"use server"

import { currentUser } from "@clerk/nextjs/server"
import { stripe } from "@/lib/stripe"
import { getSubscriptionProduct } from "@/lib/subscription-products"
import { upgradeSubscription } from "./subscription-actions"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function startCheckoutSession(productId: string, testMode = false) {
  try {
    console.log("[v0] Starting checkout session:", { productId, testMode })

    const user = await currentUser()
    if (!user) {
      throw new Error("Unauthorized")
    }

    const product = getSubscriptionProduct(productId)
    if (!product) {
      console.error("[v0] Product not found. Available products:", [
        "client-free",
        "client-premium",
        "client-business",
        "handwerker-free",
        "handwerker-professional",
        "handwerker-business",
      ])
      throw new Error(`Product with id "${productId}" not found`)
    }

    console.log("[v0] Found product:", product)

    // In test mode, skip Stripe and directly upgrade subscription
    if (testMode || product.priceInCents === 0) {
      const dbUser = await sql`
        SELECT id FROM "User" WHERE "clerkId" = ${user.id}
      `

      if (!dbUser || dbUser.length === 0) {
        const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown"
        const userType = product.role === "client" ? "CLIENT" : "CRAFTSMAN"
        await sql`
          INSERT INTO "User" ("clerkId", "email", "name", "type")
          VALUES (
            ${user.id},
            ${user.emailAddresses[0]?.emailAddress || ""},
            ${fullName},
            ${userType}
          )
        `
        console.log("[v0] Created new user in database")
      }

      await upgradeSubscription(product.planId, product.role)
      console.log("[v0] Successfully upgraded subscription in test mode")

      return {
        success: true,
        testMode: true,
        message: "Subscription activated (Test Mode)",
      }
    }

    if (!stripe) {
      throw new Error("Stripe is not configured. Please set STRIPE_SECRET_KEY.")
    }

    // Real Stripe checkout with redirect
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.emailAddresses[0]?.emailAddress,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.priceInCents,
            recurring: {
              interval: product.interval,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/subscription?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/subscription?canceled=true`,
      metadata: {
        userId: user.id,
        planId: product.planId,
        role: product.role,
      },
    })

    console.log("[v0] Created Stripe checkout session")
    return {
      success: true,
      checkoutUrl: session.url,
      testMode: false,
    }
  } catch (error) {
    console.error("[v0] Error creating checkout session:", error)
    throw error
  }
}

export async function handleStripeWebhook(event: any) {
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object
        const { userId, planId, role } = session.metadata

        if (userId && planId && role) {
          await upgradeSubscription(planId, role)
        }
        break
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object
        // Handle subscription cancellation
        break
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error handling webhook:", error)
    throw error
  }
}

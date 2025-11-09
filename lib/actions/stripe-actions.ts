"use server"

import { currentUser } from "@clerk/nextjs/server"
import { stripe } from "@/lib/stripe"
import { getSubscriptionProduct } from "@/lib/subscription-products"
import { upgradeSubscription } from "./subscription-actions"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function startCheckoutSession(productId: string, testMode = false) {
  try {
    const user = await currentUser()
    if (!user) {
      throw new Error("Unauthorized")
    }

    const product = getSubscriptionProduct(productId)
    if (!product) {
      throw new Error(`Product with id "${productId}" not found`)
    }

    // In test mode, skip Stripe and directly upgrade subscription
    if (testMode || product.priceInCents === 0) {
      // Get or create user in database
      const dbUser = await sql`
        SELECT "id" FROM "User" WHERE "clerkId" = ${user.id}
      `

      if (!dbUser || dbUser.length === 0) {
        // Create user if doesn't exist
        await sql`
          INSERT INTO "User" ("clerkId", "email", "name", "type", "subscriptionPlan")
          VALUES (
            ${user.id},
            ${user.emailAddresses[0]?.emailAddress || ""},
            ${user.firstName || ""} ${user.lastName || ""},
            ${product.role},
            ${product.planId}
          )
        `
      }

      await upgradeSubscription(product.planId, product.role)

      return {
        success: true,
        testMode: true,
        message: "Subscription activated (Test Mode)",
      }
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

    return {
      success: true,
      checkoutUrl: session.url,
      testMode: false,
    }
  } catch (error) {
    console.error("Error creating checkout session:", error)
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

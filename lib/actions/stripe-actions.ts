"use server"

import { currentUser } from "@clerk/nextjs/server"
import { stripe } from "@/lib/stripe"
import { CRAFTSMAN_PLANS } from "@/lib/subscription/plans"
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

    // Only premium plan needs checkout
    const plan = CRAFTSMAN_PLANS.premium
    if (!plan) {
      throw new Error(`Plan not found`)
    }

    // Free plan — just activate
    if (productId.includes("free") || plan.price === 0) {
      const dbUser = await sql`
        SELECT id FROM "User" WHERE "clerkId" = ${user.id}
      `

      if (!dbUser || dbUser.length === 0) {
        const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown"
        await sql`
          INSERT INTO "User" ("clerkId", "email", "name", "type")
          VALUES (
            ${user.id},
            ${user.emailAddresses[0]?.emailAddress || ""},
            ${fullName},
            'CRAFTSMAN'
          )
        `
      }

      await upgradeSubscription("free", "craftsman")
      return {
        success: true,
        testMode: true,
        message: "Kostenloser Tarif aktiviert",
      }
    }

    // Test mode — skip Stripe
    if (testMode) {
      await upgradeSubscription("premium", "craftsman")
      return {
        success: true,
        testMode: true,
        message: "Premium aktiviert (Testmodus)",
      }
    }

    if (!stripe) {
      throw new Error("Stripe is not configured. Please set STRIPE_SECRET_KEY.")
    }

    // Real Stripe checkout
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.emailAddresses[0]?.emailAddress,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Handwerker-Kontakte Premium",
              description: "Volle Sichtbarkeit - Kunden kontaktieren Sie direkt",
            },
            unit_amount: Math.round(plan.price * 100),
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/de/subscription?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/de/preise?canceled=true`,
      metadata: {
        userId: user.id,
        planId: "premium",
        role: "craftsman",
      },
    })

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
        // Handle cancellation — downgrade to free
        break
      }
    }
    return { success: true }
  } catch (error) {
    console.error("Error handling webhook:", error)
    throw error
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { handleStripeWebhook } from '@/lib/actions/stripe-actions'

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    await handleStripeWebhook(event)
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook verification failed' },
      { status: 400 }
    )
  }
}

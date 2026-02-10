import Stripe from 'stripe'

// 确保在构建阶段不会崩溃，或者提供一个备用值
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key_for_build';

export const stripe = new Stripe(stripeKey, {
  typescript: true,
})

export const getStripeSession = async ({
  priceId,
  domainUrl,
  customerEmail,
}: {
  priceId: string
  domainUrl: string
  customerEmail: string
}) => {
  const session = await stripe.checkout.sessions.create({
    customer_email: customerEmail,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${domainUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${domainUrl}/checkout/cancel`,
  })
  return session
}
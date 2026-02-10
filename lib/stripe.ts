import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
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
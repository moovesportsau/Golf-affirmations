const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const origin = req.headers.origin || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aud",
            product_data: {
              name: "The Mental Caddie – Full Access",
              description: "One-time unlock of all categories",
            },
            unit_amount: 349, // $3.49 AUD
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/?paid=1`,
      cancel_url: `${origin}/?paid=0`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message || "Stripe error" });
  }
}

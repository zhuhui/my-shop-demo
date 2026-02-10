import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      
      // 优先使用 customer_details.email，因为 customer_email 有时为空
      const email = session.customer_details?.email || session.customer_email || "unknown@example.com";
      
      console.log("Processing order:", {
        email,
        amount: session.amount_total,
        sessionId: session.id
      });

      const { error } = await supabase.from("orders").insert({
        id: crypto.randomUUID(), // 手动生成 UUID
        userEmail: email,
        amount: session.amount_total,
        status: "paid",
        stripeSessionId: session.id,
        updatedAt: new Date().toISOString(), // 手动设置更新时间
      });

      if (error) {
        console.error("Supabase insert error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    );
  }
}

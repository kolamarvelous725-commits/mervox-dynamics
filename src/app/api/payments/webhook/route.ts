import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    if (!signature) {
      console.warn("Paystack Webhook: Missing signature header");
      return NextResponse.json({ message: "Missing signature" }, { status: 400 });
    }

    if (!PAYSTACK_SECRET_KEY) {
      console.error("Paystack Webhook: Missing PAYSTACK_SECRET_KEY configuration");
      return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
    }

    // Verify HMAC SHA512 signature
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) {
      console.warn("Paystack Webhook: Signature mismatch detected");
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    console.log(`Paystack Webhook: Received event '${event}'`);

    if (event === "charge.success") {
      const data = payload.data;
      const reference = data.reference;
      const amountInCents = data.amount;
      const metadata = data.metadata;
      const userId = metadata?.userId;
      const courseId = metadata?.courseId;

      if (!reference || !userId || !courseId) {
        console.error("Paystack Webhook: Missing required details in payload metadata", { reference, userId, courseId });
        return NextResponse.json({ message: "Invalid metadata payload" }, { status: 400 });
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      // Determine price in USD using metadata or mapping by course
      let price = metadata?.usdPrice;
      if (!price || isNaN(price) || price <= 0) {
        price = courseId === "forex-trading" ? 299 : courseId === "ai-automation" ? 249 : 199;
      }

      // Call database function securely to bypass RLS and complete enrollment
      const { error: rpcError } = await supabase.rpc("complete_payment_and_enroll", {
        p_reference: reference,
        p_user_id: userId,
        p_course_id: courseId,
        p_amount: price,
        p_secret_key: PAYSTACK_SECRET_KEY,
      });

      if (rpcError) {
        console.error("Paystack Webhook: RPC complete_payment_and_enroll failed:", rpcError);
        return NextResponse.json({ message: "Database execution failed" }, { status: 500 });
      }

      console.log(`Paystack Webhook: Successfully processed transaction ${reference} and enrolled user ${userId}`);
    }

    return NextResponse.json({ status: "success" });
  } catch (err: any) {
    console.error("Paystack Webhook Exception:", err);
    return NextResponse.json({ message: err.message || "Internal Server Error" }, { status: 500 });
  }
}

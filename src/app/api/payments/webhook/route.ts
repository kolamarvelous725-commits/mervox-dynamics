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

      // Verify if transaction is already processed as paid
      const { data: existingPayment } = await supabase
        .from("payments")
        .select("*")
        .eq("transaction_id", reference)
        .maybeSingle();

      if (existingPayment && (existingPayment.status === "success" || existingPayment.status === "Paid")) {
        console.log(`Paystack Webhook: Transaction ${reference} was already successfully processed.`);
        return NextResponse.json({ status: "success", message: "Already processed" });
      }

      // Determine price in USD (converting from cents if needed, or mapping by course)
      let price = amountInCents / 100;
      if (isNaN(price) || price <= 0) {
        price = courseId === "forex-trading" ? 299 : courseId === "ai-automation" ? 249 : 199;
      }

      // Upsert payment status to success
      if (existingPayment) {
        await supabase
          .from("payments")
          .update({ status: "success" })
          .eq("transaction_id", reference);
      } else {
        await supabase.from("payments").insert({
          user_id: userId,
          course_id: courseId,
          amount: price,
          status: "success",
          payment_method: "paystack",
          transaction_id: reference,
        });
      }

      // Insert enrollment safely
      const { error: enrollError } = await supabase.from("enrollments").insert({
        user_id: userId,
        course_id: courseId,
        status: "In Progress",
      });

      if (enrollError && !enrollError.message.includes("duplicate key")) {
        console.error("Paystack Webhook: Failed to enroll student:", enrollError);
      }

      // Initialize progress safely
      const { error: progressError } = await supabase.from("progress").insert({
        user_id: userId,
        course_id: courseId,
        progress_percent: 0,
        lessons_completed: [],
      });

      if (progressError && !progressError.message.includes("duplicate key")) {
        console.error("Paystack Webhook: Failed to initialize progress:", progressError);
      }

      console.log(`Paystack Webhook: Successfully processed transaction ${reference} and enrolled user ${userId}`);
    }

    return NextResponse.json({ status: "success" });
  } catch (err: any) {
    console.error("Paystack Webhook Exception:", err);
    return NextResponse.json({ message: err.message || "Internal Server Error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  const origin = new URL(req.url).origin;

  if (!reference) {
    return NextResponse.redirect(`${origin}/academy/dashboard/courses?payment=failed&reason=no_reference`);
  }

  // Use Service Role Key if available, or fall back to Anon Key
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    if (!PAYSTACK_SECRET_KEY) {
      console.error("PAYSTACK_SECRET_KEY is missing in verification route.");
      return NextResponse.redirect(`${origin}/academy/dashboard/courses?payment=failed&reason=configuration_error`);
    }

    // Call Paystack Verify Transaction API
    console.log(`Verifying Paystack transaction reference: ${reference}`);
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const verifyData = await verifyRes.json();
    if (!verifyRes.ok || !verifyData.status) {
      console.error("Paystack transaction verify failed:", verifyData);
      return NextResponse.redirect(`${origin}/academy/dashboard/courses?payment=failed&reason=verification_failed`);
    }

    const { status, metadata } = verifyData.data;
    let userId = metadata?.userId;
    let courseId = metadata?.courseId;

    // Fallback: If metadata lacks details, look up pending payment record from Supabase by reference
    if (!userId || !courseId) {
      const { data: pendingPayment } = await supabase
        .from("payments")
        .select("*")
        .eq("transaction_id", reference)
        .maybeSingle();

      if (pendingPayment) {
        userId = userId || pendingPayment.user_id;
        courseId = courseId || pendingPayment.course_id;
      }
    }

    if (status !== "success" || !userId || !courseId) {
      console.error("Verification checks failed:", { status, userId, courseId });
      // Update payment status as failed in database if transaction exists
      await supabase
        .from("payments")
        .update({ status: "failed" })
        .eq("transaction_id", reference);

      return NextResponse.redirect(`${origin}/academy/dashboard/courses?payment=failed&reason=unsuccessful_charge`);
    }

    // Enrollment price of $120 USD for all courses
    const coursePrice = 120;

    // Check if already processed to ensure idempotency
    const { data: existingPayment } = await supabase
      .from("payments")
      .select("*")
      .eq("transaction_id", reference)
      .maybeSingle();

    if (existingPayment && (existingPayment.status === "success" || existingPayment.status === "Paid")) {
      console.log(`Transaction ${reference} already processed as successful.`);
      return NextResponse.redirect(`${origin}/academy/dashboard/courses?payment=success&course_id=${courseId}`);
    }

    // Update payment record in database to success
    const { error: updateError } = await supabase
      .from("payments")
      .update({ status: "success", amount: coursePrice })
      .eq("transaction_id", reference);

    if (updateError) {
      console.error("Failed to update payment status in Supabase:", updateError);
    }

    // Insert student enrollment (idempotency ensured by UNIQUE constraint on user_id, course_id)
    const { error: enrollError } = await supabase.from("enrollments").insert({
      user_id: userId,
      course_id: courseId,
      status: "In Progress",
    });

    if (enrollError && !enrollError.message.includes("duplicate key")) {
      console.error("Failed to insert enrollment record in Supabase:", enrollError);
    }

    // Initialize progress record for complete learning flow setup
    const { error: progressError } = await supabase.from("progress").insert({
      user_id: userId,
      course_id: courseId,
      progress_percent: 0,
      lessons_completed: [],
    });

    if (progressError && !progressError.message.includes("duplicate key")) {
      console.error("Failed to create progress record:", progressError);
    }

    return NextResponse.redirect(`${origin}/academy/dashboard/courses?payment=success&course_id=${courseId}`);
  } catch (err) {
    console.error("Exception in Paystack verification route:", err);
    return NextResponse.redirect(`${origin}/academy/dashboard/courses?payment=failed&reason=exception`);
  }
}

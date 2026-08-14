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

  // Initialize server-scoped Supabase client
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    const userId = metadata?.userId;
    const courseId = metadata?.courseId;

    if (status !== "success" || !userId || !courseId) {
      console.error("Verification checks failed:", { status, userId, courseId });
      // Update payment status as failed in database if transaction exists
      await supabase
        .from("payments")
        .update({ status: "failed" })
        .eq("transaction_id", reference);

      return NextResponse.redirect(`${origin}/academy/dashboard/courses?payment=failed&reason=unsuccessful_charge`);
    }

    // Map USD price for courses
    const usdPrice = courseId === "forex-trading" ? 299 : courseId === "ai-automation" ? 249 : 199;

    // Call database function securely to bypass RLS and complete enrollment
    const { error: rpcError } = await supabase.rpc("complete_payment_and_enroll", {
      p_reference: reference,
      p_user_id: userId,
      p_course_id: courseId,
      p_amount: usdPrice,
      p_secret_key: PAYSTACK_SECRET_KEY,
    });

    if (rpcError) {
      console.error("RPC complete_payment_and_enroll execution failed:", rpcError);
      return NextResponse.redirect(`${origin}/academy/dashboard/courses?payment=failed&reason=database_error`);
    }

    return NextResponse.redirect(`${origin}/academy/dashboard/courses?payment=success&course_id=${courseId}`);
  } catch (err) {
    console.error("Exception in Paystack verification route:", err);
    return NextResponse.redirect(`${origin}/academy/dashboard/courses?payment=failed&reason=exception`);
  }
}

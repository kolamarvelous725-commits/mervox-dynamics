export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized: Missing authentication token" }, { status: 401 });
    }

    // Initialize Supabase Client on the server with user auth headers to satisfy RLS checks
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    });

    // Validate current user's session
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ message: "Unauthorized: Invalid or expired token" }, { status: 401 });
    }

    const { courseId } = await req.json();
    if (!courseId) {
      return NextResponse.json({ message: "Bad Request: Missing courseId" }, { status: 400 });
    }

    // Enrollment price of all courses set to ₦100 NGN
    const priceInNgn = 100;
    const amountInCents = priceInNgn * 100; // Paystack expects amount in cents/kobo (10,000 kobo = ₦100)

    // Generate unique payment reference
    const uniqueRef = `MS_${Date.now()}_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

    // Get origin to construct callback URL
    const origin = new URL(req.url).origin;
    const callbackUrl = `${origin}/api/payments/verify`;

    if (!PAYSTACK_SECRET_KEY) {
      console.error("PAYSTACK_SECRET_KEY is missing from environment variables.");
      return NextResponse.json({ message: "Paystack server configuration error." }, { status: 500 });
    }

    // Call Paystack Transaction Initialize API
    console.log(`Initializing Paystack payment for user ${user.id}, reference: ${uniqueRef}`);
    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        amount: amountInCents,
        currency: "NGN",
        reference: uniqueRef,
        callback_url: callbackUrl,
        metadata: {
          userId: user.id,
          courseId: courseId,
          priceInNgn: priceInNgn,
        },
      }),
    });

    const paystackData = await paystackRes.json();
    if (!paystackRes.ok || !paystackData.status) {
      console.error("Paystack Initialize API Error:", paystackData);
      return NextResponse.json(
        { message: paystackData.message || "Failed to initialize checkout with Paystack." },
        { status: 502 }
      );
    }

    // Save pending payment record to Supabase
    const { error: insertError } = await supabase.from("payments").insert({
      user_id: user.id,
      course_id: courseId,
      amount: priceInNgn,
      status: "pending",
      payment_method: "paystack",
      transaction_id: uniqueRef,
    });

    if (insertError) {
      console.error("Supabase payments insertion failed:", insertError);
      return NextResponse.json({ message: "Failed to create payment record in database." }, { status: 500 });
    }

    return NextResponse.json({
      authorizationUrl: paystackData.data.authorization_url,
      reference: uniqueRef,
    });
  } catch (err: any) {
    console.error("Exception initializing Paystack transaction:", err);
    return NextResponse.json({ message: err.message || "Internal server error" }, { status: 500 });
  }
}

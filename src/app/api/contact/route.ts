import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, projectType, message } = body || {};

    if (!name || !email || !projectType || !message) {
      return NextResponse.json(
        { success: false, error: "Please fill out all required fields." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email).trim())) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const recipientEmail = "mervoxdynamic@gmail.com";
    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim();
    const cleanMessage = String(message).trim();

    // 1. Log submission to Supabase contact_messages table if available
    if (supabase) {
      try {
        await supabase.from("contact_messages").insert([
          {
            name: cleanName,
            email: cleanEmail,
            project_type: projectType,
            message: cleanMessage,
            created_at: new Date().toISOString(),
          },
        ]);
      } catch (dbErr) {
        console.warn("Supabase contact_messages logging warning:", dbErr);
      }
    }

    const resendApiKey = process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.trim() : "";
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER || recipientEmail;

    console.log(`[Contact API] Form submission received from ${cleanEmail}. Checking email configuration...`);
    console.log(`[Contact API] RESEND_API_KEY configured: ${Boolean(resendApiKey)}`);
    console.log(`[Contact API] SMTP_PASS / GMAIL_APP_PASSWORD configured: ${Boolean(smtpPass)}`);

    // Priority 1: Resend API if RESEND_API_KEY is configured
    if (resendApiKey) {
      const fromEmail = process.env.RESEND_FROM_EMAIL || "Mervox Contact <onboarding@resend.dev>";
      
      console.log(`[Contact API] Dispatching email via Resend API to ${recipientEmail} from ${fromEmail}...`);

      const resendPayload = {
        from: fromEmail,
        to: [recipientEmail],
        reply_to: cleanEmail,
        subject: `New Project Inquiry: ${projectType} from ${cleanName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
            <h2 style="color: #0055ff; margin-top: 0; margin-bottom: 16px;">New Project Inquiry</h2>
            <p style="margin: 6px 0; font-size: 14px; color: #374151;"><strong>Visitor's Name:</strong> ${cleanName}</p>
            <p style="margin: 6px 0; font-size: 14px; color: #374151;"><strong>Visitor's Email:</strong> <a href="mailto:${cleanEmail}" style="color: #0055ff;">${cleanEmail}</a></p>
            <p style="margin: 6px 0; font-size: 14px; color: #374151;"><strong>Selected Project Type:</strong> ${projectType}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <h3 style="color: #1f2937; margin-bottom: 8px; font-size: 15px;">Project Details / Message:</h3>
            <p style="white-space: pre-wrap; background-color: #f9fafb; padding: 16px; border-radius: 8px; color: #1f2937; font-size: 14px; line-height: 1.5; border: 1px solid #f3f4f6;">${cleanMessage}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="font-size: 12px; color: #6b7280; margin-bottom: 0;">You can reply directly to this email to contact ${cleanName} (${cleanEmail}).</p>
          </div>
        `,
      };

      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resendPayload),
      });

      const resendData = await resendRes.json();
      console.log(`[Contact API] Resend response status: ${resendRes.status}`, resendData);

      if (!resendRes.ok) {
        const errorDetail = resendData.message || resendData.name || JSON.stringify(resendData);
        console.error(`[Contact API Error] Resend API failed: ${errorDetail}`);
        return NextResponse.json(
          {
            success: false,
            error: `Resend Email Delivery Error (${resendRes.status}): ${errorDetail}`,
          },
          { status: resendRes.status || 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Your message has been sent successfully!",
        id: resendData.id,
      });
    }

    // Priority 2: SMTP / Nodemailer if SMTP_PASS or GMAIL_APP_PASSWORD is set
    if (smtpPass) {
      const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
      const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const mailOptions = {
        from: `"Mervox Dynamics Contact Form" <${smtpUser}>`,
        to: recipientEmail,
        replyTo: `"${cleanName}" <${cleanEmail}>`,
        subject: `New Project Inquiry: ${projectType} from ${cleanName}`,
        text: `You received a new inquiry from the website contact form:\n\nName: ${cleanName}\nEmail: ${cleanEmail}\nProject Type: ${projectType}\n\nProject Details:\n${cleanMessage}\n`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
            <h2 style="color: #0055ff; margin-top: 0; margin-bottom: 16px;">New Project Inquiry</h2>
            <p style="margin: 6px 0; font-size: 14px; color: #374151;"><strong>Visitor's Name:</strong> ${cleanName}</p>
            <p style="margin: 6px 0; font-size: 14px; color: #374151;"><strong>Visitor's Email:</strong> <a href="mailto:${cleanEmail}" style="color: #0055ff;">${cleanEmail}</a></p>
            <p style="margin: 6px 0; font-size: 14px; color: #374151;"><strong>Selected Project Type:</strong> ${projectType}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <h3 style="color: #1f2937; margin-bottom: 8px; font-size: 15px;">Project Details / Message:</h3>
            <p style="white-space: pre-wrap; background-color: #f9fafb; padding: 16px; border-radius: 8px; color: #1f2937; font-size: 14px; line-height: 1.5; border: 1px solid #f3f4f6;">${cleanMessage}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="font-size: 12px; color: #6b7280; margin-bottom: 0;">You can reply directly to this email to contact ${cleanName} (${cleanEmail}).</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);

      return NextResponse.json({
        success: true,
        message: "Your message has been sent successfully!",
      });
    }

    // Priority 3: Neither key is present
    console.error("[Contact API Error] No email provider configured. RESEND_API_KEY and GMAIL_APP_PASSWORD are both missing.");
    return NextResponse.json(
      {
        success: false,
        error: "Server configuration missing: RESEND_API_KEY environment variable is not set or not active on Vercel.",
      },
      { status: 500 }
    );
  } catch (err: any) {
    console.error("Error processing contact form submission:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Failed to send message. Please try again.",
      },
      { status: 500 }
    );
  }
}

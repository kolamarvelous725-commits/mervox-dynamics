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
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const recipientEmail = "mervoxdynamic@gmail.com";

    // 1. Log submission to Supabase contact_messages table if available
    if (supabase) {
      try {
        await supabase.from("contact_messages").insert([
          {
            name: name.trim(),
            email: email.trim(),
            project_type: projectType,
            message: message.trim(),
            created_at: new Date().toISOString(),
          },
        ]);
      } catch (dbErr) {
        console.warn("Supabase contact_messages logging warning:", dbErr);
      }
    }

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER || recipientEmail;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

    if (smtpPass) {
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
        replyTo: `"${name.trim()}" <${email.trim()}>`,
        subject: `New Project Inquiry: ${projectType} from ${name.trim()}`,
        text: `You received a new inquiry from the website contact form:

Name: ${name.trim()}
Email: ${email.trim()}
Project Type: ${projectType}

Project Details:
${message.trim()}
`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
            <h2 style="color: #0055ff; margin-top: 0; margin-bottom: 16px;">New Project Inquiry</h2>
            <p style="margin: 6px 0; font-size: 14px; color: #374151;"><strong>Visitor's Name:</strong> ${name.trim()}</p>
            <p style="margin: 6px 0; font-size: 14px; color: #374151;"><strong>Visitor's Email:</strong> <a href="mailto:${email.trim()}" style="color: #0055ff;">${email.trim()}</a></p>
            <p style="margin: 6px 0; font-size: 14px; color: #374151;"><strong>Selected Project Type:</strong> ${projectType}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <h3 style="color: #1f2937; margin-bottom: 8px; font-size: 15px;">Project Details / Message:</h3>
            <p style="white-space: pre-wrap; background-color: #f9fafb; padding: 16px; border-radius: 8px; color: #1f2937; font-size: 14px; line-height: 1.5; border: 1px solid #f3f4f6;">${message.trim()}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="font-size: 12px; color: #6b7280; margin-bottom: 0;">You can reply directly to this email to contact ${name.trim()} (${email.trim()}).</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    } else if (process.env.RESEND_API_KEY) {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Mervox Contact <onboarding@resend.dev>",
          to: recipientEmail,
          reply_to: email.trim(),
          subject: `New Project Inquiry: ${projectType} from ${name.trim()}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
              <h2 style="color: #0055ff; margin-top: 0; margin-bottom: 16px;">New Project Inquiry</h2>
              <p><strong>Visitor's Name:</strong> ${name.trim()}</p>
              <p><strong>Visitor's Email:</strong> <a href="mailto:${email.trim()}">${email.trim()}</a></p>
              <p><strong>Selected Project Type:</strong> ${projectType}</p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
              <h3 style="color: #1f2937; margin-bottom: 8px;">Project Details / Message:</h3>
              <p style="white-space: pre-wrap; background-color: #f9fafb; padding: 16px; border-radius: 8px;">${message.trim()}</p>
            </div>
          `,
        }),
      });

      if (!resendRes.ok) {
        const errJson = await resendRes.json();
        throw new Error(errJson.message || "Failed to send email via Resend.");
      }
    } else {
      console.log(`[Contact Form Submission Received]
Recipient: ${recipientEmail}
From: ${name.trim()} <${email.trim()}>
Project Type: ${projectType}
Message: ${message.trim()}`);
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully!",
    });
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

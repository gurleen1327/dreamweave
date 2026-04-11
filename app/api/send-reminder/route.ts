import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    await resend.emails.send({
      from: "Dreamweave <onboarding@resend.dev>",
      to: email,
      subject: "🌙 Good morning. What did you dream about?",
      html: `
        <div style="background:#0a0a0f;color:white;padding:40px;font-family:sans-serif;max-width:500px;margin:0 auto;border-radius:16px;">
          <h1 style="color:#c4b5fd;font-size:28px;">🌙 Dreamweave</h1>
          <p style="color:#e2e8f0;font-size:16px;line-height:1.7;">Good morning.</p>
          <p style="color:#e2e8f0;font-size:16px;line-height:1.7;">Your dreams from last night are still fresh. Take 2 minutes to log them before they fade.</p>
          <a href="https://dreamweave-sigma.vercel.app/dashboard" style="display:inline-block;margin-top:20px;background:#7c3aed;color:white;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:bold;">
            Log my dream ✨
          </a>
          <p style="color:#6b7280;font-size:12px;margin-top:32px;">Your dreams. Your mythology. — Dreamweave</p>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch(e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
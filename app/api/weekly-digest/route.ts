import { Resend } from "resend";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const { data: users } = await supabase.auth.admin.listUsers();

  for (const user of users.users) {
    const { data: dreams } = await supabase
      .from("dreams")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", oneWeekAgo.toISOString());

    if (!dreams || dreams.length === 0) continue;

    const allSymbols = dreams.flatMap((d: any) => d.symbols || []);
    const symbolCount: Record<string, number> = {};
    allSymbols.forEach((s: string) => {
      symbolCount[s] = (symbolCount[s] || 0) + 1;
    });
    const topSymbols = Object.entries(symbolCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([s]) => s)
      .join(", ");

    await resend.emails.send({
      from: "Dreamweave <onboarding@resend.dev>",
      to: user.email!,
      subject: `🌙 Your dream week — ${dreams.length} dreams logged`,
      html: `
        <div style="background:#0a0a0f;color:white;padding:40px;font-family:sans-serif;max-width:500px;margin:0 auto;border-radius:16px;">
          <h1 style="color:#c4b5fd;">🌙 Your week in dreams</h1>
          <p style="color:#e2e8f0;">This week you logged <strong>${dreams.length} dreams</strong>.</p>
          <p style="color:#9ca3af;">Your most common symbols: <strong style="color:#c4b5fd;">${topSymbols || "none yet"}</strong></p>
          <a href="https://dreamweave-sigma.vercel.app/mythmap" style="display:inline-block;margin-top:20px;background:#7c3aed;color:white;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:bold;">
            View my myth map ✨
          </a>
          <p style="color:#6b7280;font-size:12px;margin-top:32px;">Dreamweave — Your dreams. Your mythology.</p>
        </div>
      `
    });
  }

  return NextResponse.json({ success: true });
}
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { symbols } = await request.json();
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyDXwpL2saKamN0WU7MFLfjdIsnyjsS66LQ`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a mythologist and depth psychologist. Based on these recurring dream symbols, write a 4-5 sentence personal myth narrative about this person. Make it poetic, insightful and deeply personal. Write in second person ("You are someone who..."). Symbols: ${symbols}`
            }]
          }]
        })
      }
    );
    const data = await res.json();
    const myth = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ myth });
  } catch(e) {
    return NextResponse.json({ myth: "Your myth is still being written. Log more dreams to unlock your personal mythology." });
  }
}
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { dream } = await request.json();
    const apiKey = "AIzaSyDXwpL2saKamN0WU7MFLfjdIsnyjsS66LQ";
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=" + apiKey;
    
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Analyze this dream and reply with ONLY JSON like this exact format with no markdown: {\"symbols\": [\"water\", \"flying\"], \"emotions\": [\"joy\", \"fear\"], \"interpretation\": \"Your dream means...\", \"mythology\": \"This connects to...\", \"advice\": \"You should...\"}. Dream: " + dream }] }]
      })
    });

    const json = await res.json();
    console.log("STATUS:", res.status);
    console.log("BODY:", JSON.stringify(json).slice(0, 300));

    if (!json.candidates) {
      console.log("NO CANDIDATES - full response:", JSON.stringify(json));
      return NextResponse.json({ symbols: ["error"], emotions: ["error"], interpretation: JSON.stringify(json), mythology: "", advice: "" });
    }

    const text = json.candidates[0].content.parts[0].text;
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    const analysis = JSON.parse(text.slice(start, end + 1));
    return NextResponse.json(analysis);
  } catch(e: any) {
    console.log("CATCH ERROR:", e.message);
    return NextResponse.json({ symbols: ["catch"], emotions: ["error"], interpretation: e.message, mythology: "", advice: "" });
  }
}

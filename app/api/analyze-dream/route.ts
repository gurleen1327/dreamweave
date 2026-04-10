import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { dream } = await request.json();
    
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=AIzaSyDckED2H6dOTYuk0cbFiRZqbUVdCpBNsg8`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert dream analyst. Analyze this dream in rich detail. Reply with ONLY raw JSON, no markdown, no backticks, no explanation:
{"symbols": ["symbol1", "symbol2", "symbol3"], "emotions": ["emotion1", "emotion2"], "interpretation": "4-5 sentences analyzing the dream deeply.", "mythology": "2-3 sentences connecting to a myth or archetype.", "advice": "2 sentences of gentle advice."}

Dream: ${dream}`
            }]
          }]
        })
      }
    );

    const data = await res.json();
    console.log("Gemini raw:", JSON.stringify(data));
    const text = data.candidates[0].content.parts[0].text;
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    const analysis = JSON.parse(text.slice(start, end + 1));
    return NextResponse.json(analysis);

  } catch(e) {
    console.error("Error:", e);
    return NextResponse.json({
      symbols: ["unknown"],
      emotions: ["unknown"],
      interpretation: "Could not analyze dream.",
      mythology: "",
      advice: ""
    });
  }
}
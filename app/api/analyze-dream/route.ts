import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: Request) {
  try {
    const { dream } = await request.json();
    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 2048,
      messages: [{ role: "user", content: `You are an expert dream analyst with deep knowledge of psychology, symbolism, and mythology. Analyze this dream in rich detail.

Reply with ONLY this JSON format, no markdown, no backticks:
{
  "symbols": ["symbol1", "symbol2", "symbol3", "symbol4", "symbol5"],
  "emotions": ["emotion1", "emotion2", "emotion3"],
  "interpretation": "Write 4-5 sentences deeply analyzing what this dream means. Reference the specific symbols. Talk about what the subconscious might be processing. Make it feel personal and insightful.",
  "mythology": "In 2-3 sentences, connect this dream to a myth, archetype, or universal human story it resembles.",
  "advice": "In 2 sentences, give one gentle piece of advice based on what this dream might be telling the dreamer."
}

Dream: ${dream}` }]
    });
    const raw = message.content[0].type === "text" ? message.content[0].text : "{}";
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    const analysis = JSON.parse(raw.slice(start, end + 1));
    return NextResponse.json(analysis);
  } catch(e) {
    console.error("Error:", e);
    return NextResponse.json({ symbols: ["dream"], emotions: ["wonder"], interpretation: "Your dream contains powerful imagery worth exploring.", mythology: "", advice: "" });
  }
}
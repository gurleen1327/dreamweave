import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
export async function POST(request: Request) {
  try {
    const { dream } = await request.json();
    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: "Analyze this dream. Reply with ONLY raw JSON no markdown: {\"symbols\": [\"word1\", \"word2\"], \"emotions\": [\"word1\"], \"interpretation\": \"2 sentence interpretation\"}. Dream: " + dream }]
    });
    const raw = message.content[0].type === "text" ? message.content[0].text : "{}";
    console.log("RAW:", raw);
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    const analysis = JSON.parse(raw.slice(start, end + 1));
    return NextResponse.json(analysis);
  } catch(e) {
    console.error("Error:", e);
    return NextResponse.json({ symbols: ["dream"], emotions: ["wonder"], interpretation: "Your dream contains powerful imagery worth exploring." });
  }
}
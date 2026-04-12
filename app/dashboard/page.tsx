"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase";

function calculateStreak(dreams: any[]) {
  if (!dreams.length) return 0;
  const dates = dreams.map((d: any) => new Date(d.created_at).toDateString());
  const unique = [...new Set(dates)];
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < unique.length; i++) {
    const check = new Date(today);
    check.setDate(today.getDate() - i);
    if (unique.includes(check.toDateString())) {
      streak++;
    } else break;
  }
  return streak;
}

const moods = [
  { value: 1, emoji: "😨", label: "Nightmare" },
  { value: 2, emoji: "😟", label: "Unsettling" },
  { value: 3, emoji: "😐", label: "Neutral" },
  { value: 4, emoji: "😊", label: "Pleasant" },
  { value: 5, emoji: "🤩", label: "Amazing" }
];

export default function Dashboard() {
  const [dream, setDream] = useState("");
  const [mood, setMood] = useState(3);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null as any);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const [streak, setStreak] = useState(0);
  const [totalDreams, setTotalDreams] = useState(0);
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef(null as any);

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login";
        return;
      }
      const { data } = await supabase
        .from("dreams")
        .select("created_at")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      if (data) {
        setStreak(calculateStreak(data));
        setTotalDreams(data.length);
      }
      setChecking(false);
    }
    checkUser();
  }, []);

  function toggleRecording() {
    if (recording) {
      recognitionRef.current?.stop();
      setRecording(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recording not supported in this browser. Try Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setDream(transcript);
    };
    recognition.onend = () => setRecording(false);
    recognition.start();
    recognitionRef.current = recognition;
    setRecording(true);
  }

  async function handleSignout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  async function handleSubmit() {
    if (!dream.trim()) return;
    setLoading(true);
    setError("");
    setAnalysis(null);
    try {
      const res = await fetch("/api/analyze-dream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dream })
      });
      const text = await res.text();
      const data = JSON.parse(text);
      const analysisData = {
        symbols: Array.isArray(data.symbols) ? data.symbols : [],
        emotions: Array.isArray(data.emotions) ? data.emotions : [],
        interpretation: data.interpretation || "",
        mythology: data.mythology || "",
        advice: data.advice || ""
      };
      setAnalysis(analysisData);
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from("dreams").insert({
          user_id: session.user.id,
          content: dream,
          mood: mood,
          symbols: analysisData.symbols,
          emotions: analysisData.emotions,
          interpretation: analysisData.interpretation,
          mythology: analysisData.mythology,
          advice: analysisData.advice
        });
        setTotalDreams(prev => prev + 1);
      }
    } catch (e) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  if (checking) return (
    <main style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#c4b5fd", fontFamily: "sans-serif" }}>Loading...</p>
    </main>
  );

  return (
    <main style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      color: "white",
      fontFamily: "sans-serif",
      padding: "40px 24px"
    }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 28 }}>🌙</span>
            <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#c4b5fd" }}>Dreamweave</h1>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <a href="/history" style={{
              background: "none", border: "1px solid #4c1d95",
              color: "#9ca3af", padding: "6px 14px",
              borderRadius: 8, fontSize: 13, textDecoration: "none"
            }}>My dreams</a>
            <a href="/mythmap" style={{
              background: "none", border: "1px solid #4c1d95",
              color: "#9ca3af", padding: "6px 14px",
              borderRadius: 8, fontSize: 13, textDecoration: "none"
            }}>Myth map 🗺️</a>
            <a href="/share" style={{
              background: "none", border: "1px solid #4c1d95",
              color: "#9ca3af", padding: "6px 14px",
              borderRadius: 8, fontSize: 13, textDecoration: "none"
            }}>Share ✨</a>
            <button onClick={handleSignout} style={{
              background: "none", border: "1px solid #4c1d95",
              color: "#9ca3af", padding: "6px 14px",
              borderRadius: 8, cursor: "pointer", fontSize: 13
            }}>Sign out</button>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 24
        }}>
          <div style={{
            background: "#13131a",
            border: "1px solid #4c1d95",
            borderRadius: 12,
            padding: 16,
            textAlign: "center" as any
          }}>
            <div style={{ fontSize: 32 }}>{streak > 0 ? "🔥" : "💤"}</div>
            <div style={{ fontSize: 28, fontWeight: "bold", color: "#c4b5fd" }}>{streak}</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>day streak</div>
          </div>
          <div style={{
            background: "#13131a",
            border: "1px solid #4c1d95",
            borderRadius: 12,
            padding: 16,
            textAlign: "center" as any
          }}>
            <div style={{ fontSize: 32 }}>📖</div>
            <div style={{ fontSize: 28, fontWeight: "bold", color: "#c4b5fd" }}>{totalDreams}</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>dreams logged</div>
          </div>
        </div>

        {streak >= 3 && (
          <div style={{
            background: "#1a0533",
            border: "1px solid #7c3aed",
            borderRadius: 12,
            padding: 12,
            marginBottom: 24,
            textAlign: "center" as any,
            fontSize: 14,
            color: "#c4b5fd"
          }}>
            🔥 {streak} day streak! Keep going!
          </div>
        )}

        <h2 style={{ fontSize: 20, fontWeight: "600", marginBottom: 8 }}>
          What did you dream about?
        </h2>
        <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 20 }}>
          Describe your dream or tap the mic to speak it.
        </p>

        <div style={{ position: "relative" }}>
          <textarea
            value={dream}
            onChange={(e) => setDream(e.target.value)}
            placeholder="I was standing in a field and suddenly the sky turned purple..."
            rows={6}
            style={{
              width: "100%",
              padding: "16px",
              paddingRight: "56px",
              borderRadius: 12,
              border: recording ? "1px solid #ef4444" : "1px solid #4c1d95",
              background: "#13131a",
              color: "white",
              fontSize: 15,
              outline: "none",
              resize: "vertical",
              fontFamily: "sans-serif"
            }}
          />
          <button
            onClick={toggleRecording}
            style={{
              position: "absolute",
              right: 12,
              top: 12,
              background: recording ? "#ef4444" : "#2e1065",
              border: "none",
              borderRadius: 8,
              width: 36,
              height: 36,
              cursor: "pointer",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {recording ? "⏹" : "🎙️"}
          </button>
        </div>

        {recording && (
          <p style={{ fontSize: 13, color: "#ef4444", marginTop: 8 }}>
            🔴 Recording... speak your dream. Tap stop when done.
          </p>
        )}

        {/* Mood selector */}
        <div style={{ marginTop: 20, marginBottom: 8 }}>
          <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 12 }}>How did this dream feel?</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
            {moods.map((m) => (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                style={{
                  flex: 1,
                  padding: "10px 4px",
                  borderRadius: 10,
                  border: mood === m.value ? "2px solid #7c3aed" : "1px solid #4c1d95",
                  background: mood === m.value ? "#2e1065" : "#13131a",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4
                }}
              >
                <span style={{ fontSize: 24 }}>{m.emoji}</span>
                <span style={{ fontSize: 10, color: "#9ca3af" }}>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            marginTop: 16,
            width: "100%",
            padding: "14px",
            borderRadius: 12,
            background: loading ? "#4c1d95" : "#7c3aed",
            color: "white",
            fontWeight: "600",
            fontSize: 16,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Weaving your dream..." : "Weave this dream ✨"}
        </button>

        {error && (
          <p style={{ fontSize: 14, color: "#f87171", textAlign: "center", marginTop: 16 }}>
            {error}
          </p>
        )}

        {analysis && (
          <div style={{
            marginTop: 32,
            background: "#13131a",
            border: "1px solid #4c1d95",
            borderRadius: 16,
            padding: 24
          }}>
            <h3 style={{ fontSize: 18, fontWeight: "600", color: "#c4b5fd", marginBottom: 20 }}>
              Your dream analysis
            </h3>

            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8 }}>Symbols found</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as any }}>
                {analysis.symbols.map((s: string, i: number) => (
                  <span key={i} style={{
                    padding: "4px 12px", background: "#2e1065",
                    color: "#c4b5fd", borderRadius: 20, fontSize: 13
                  }}>{s}</span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8 }}>Emotions detected</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as any }}>
                {analysis.emotions.map((e: string, i: number) => (
                  <span key={i} style={{
                    padding: "4px 12px", background: "#1e1b4b",
                    color: "#a5b4fc", borderRadius: 20, fontSize: 13
                  }}>{e}</span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8 }}>Interpretation</p>
              <p style={{ fontSize: 15, color: "#e2e8f0", lineHeight: 1.7 }}>
                {analysis.interpretation}
              </p>
            </div>

            {analysis.mythology && (
              <div style={{
                marginBottom: 20, padding: 16,
                background: "#0f0a1e", borderRadius: 12,
                borderLeft: "3px solid #7c3aed"
              }}>
                <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8 }}>🏛️ Mythological connection</p>
                <p style={{ fontSize: 14, color: "#c4b5fd", lineHeight: 1.7 }}>{analysis.mythology}</p>
              </div>
            )}

            {analysis.advice && (
              <div style={{
                padding: 16, background: "#0a1a0f",
                borderRadius: 12, borderLeft: "3px solid #059669"
              }}>
                <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8 }}>✨ What your dream is telling you</p>
                <p style={{ fontSize: 14, color: "#6ee7b7", lineHeight: 1.7 }}>{analysis.advice}</p>
              </div>
            )}

          </div>
        )}

      </div>
    </main>
  );
}
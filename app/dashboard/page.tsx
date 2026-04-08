"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const [dream, setDream] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null as any);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login";
      }
      setChecking(false);
    }
    checkUser();
  }, []);

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
      setAnalysis({
        symbols: Array.isArray(data.symbols) ? data.symbols : [],
        emotions: Array.isArray(data.emotions) ? data.emotions : [],
        interpretation: data.interpretation || "",
        mythology: data.mythology || "",
        advice: data.advice || ""
      });
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

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 28 }}>🌙</span>
            <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#c4b5fd" }}>Dreamweave</h1>
          </div>
          <button onClick={handleSignout} style={{
            background: "none",
            border: "1px solid #4c1d95",
            color: "#9ca3af",
            padding: "6px 14px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 13
          }}>Sign out</button>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: "600", marginBottom: 8 }}>
          What did you dream about?
        </h2>
        <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 20 }}>
          Describe your dream in as much detail as you remember.
        </p>

        <textarea
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          placeholder="I was standing in a field and suddenly the sky turned purple..."
          rows={6}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: 12,
            border: "1px solid #4c1d95",
            background: "#13131a",
            color: "white",
            fontSize: 15,
            outline: "none",
            resize: "vertical",
            fontFamily: "sans-serif"
          }}
        />

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
                    padding: "4px 12px",
                    background: "#2e1065",
                    color: "#c4b5fd",
                    borderRadius: 20,
                    fontSize: 13
                  }}>{s}</span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8 }}>Emotions detected</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as any }}>
                {analysis.emotions.map((e: string, i: number) => (
                  <span key={i} style={{
                    padding: "4px 12px",
                    background: "#1e1b4b",
                    color: "#a5b4fc",
                    borderRadius: 20,
                    fontSize: 13
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
                marginBottom: 20,
                padding: 16,
                background: "#0f0a1e",
                borderRadius: 12,
                borderLeft: "3px solid #7c3aed"
              }}>
                <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8 }}>🏛️ Mythological connection</p>
                <p style={{ fontSize: 14, color: "#c4b5fd", lineHeight: 1.7 }}>
                  {analysis.mythology}
                </p>
              </div>
            )}

            {analysis.advice && (
              <div style={{
                padding: 16,
                background: "#0a1a0f",
                borderRadius: 12,
                borderLeft: "3px solid #059669"
              }}>
                <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8 }}>✨ What your dream is telling you</p>
                <p style={{ fontSize: 14, color: "#6ee7b7", lineHeight: 1.7 }}>
                  {analysis.advice}
                </p>
              </div>
            )}

          </div>
        )}

      </div>
    </main>
  );
}
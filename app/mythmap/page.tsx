"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function MythMap() {
  const [symbols, setSymbols] = useState([] as any[]);
  const [myth, setMyth] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login";
        return;
      }
      const { data: dreams } = await supabase
        .from("dreams")
        .select("symbols")
        .eq("user_id", session.user.id);

      if (dreams) {
        const symbolCount: Record<string, number> = {};
        dreams.forEach((d: any) => {
          if (d.symbols) {
            d.symbols.forEach((s: string) => {
              symbolCount[s] = (symbolCount[s] || 0) + 1;
            });
          }
        });
        const sorted = Object.entries(symbolCount)
          .sort((a, b) => b[1] - a[1])
          .map(([name, count]) => ({ name, count }));
        setSymbols(sorted);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  async function generateMyth() {
    setGenerating(true);
    const topSymbols = symbols.slice(0, 10).map(s => `${s.name} (${s.count} times)`).join(", ");
    const res = await fetch("/api/generate-myth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbols: topSymbols })
    });
    const data = await res.json();
    setMyth(data.myth);
    setGenerating(false);
  }

  const maxCount = symbols.length > 0 ? symbols[0].count : 1;

  const colors = [
    "#7c3aed", "#6d28d9", "#5b21b6",
    "#4c1d95", "#8b5cf6", "#a78bfa"
  ];

  return (
    <main style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      color: "white",
      fontFamily: "sans-serif",
      padding: "40px 24px"
    }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 28 }}>🗺️</span>
            <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#c4b5fd" }}>Your Myth Map</h1>
          </div>
          <a href="/dashboard" style={{
            background: "none",
            border: "1px solid #4c1d95",
            color: "#9ca3af",
            padding: "6px 14px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 13,
            textDecoration: "none"
          }}>+ New dream</a>
        </div>

        {loading && (
          <p style={{ color: "#9ca3af", textAlign: "center" }}>Loading your myth map...</p>
        )}

        {!loading && symbols.length === 0 && (
          <div style={{ textAlign: "center", marginTop: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🌙</div>
            <p style={{ color: "#9ca3af", fontSize: 16 }}>Log at least 3 dreams to see your myth map.</p>
            <a href="/dashboard" style={{
              display: "inline-block",
              marginTop: 16,
              background: "#7c3aed",
              color: "white",
              padding: "10px 24px",
              borderRadius: 10,
              textDecoration: "none",
              fontSize: 14
            }}>Log a dream</a>
          </div>
        )}

        {!loading && symbols.length > 0 && (
          <>
            <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 24 }}>
              Based on {symbols.reduce((a, b) => a + b.count, 0)} symbols across your dreams. Bigger = appears more often.
            </p>

            {/* Symbol bubbles */}
            <div style={{
              display: "flex",
              flexWrap: "wrap" as any,
              gap: 12,
              marginBottom: 40,
              padding: 24,
              background: "#13131a",
              borderRadius: 16,
              border: "1px solid #4c1d95"
            }}>
              {symbols.map((s, i) => {
                const size = 40 + (s.count / maxCount) * 60;
                return (
                  <div key={i} style={{
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    background: colors[i % colors.length],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: Math.max(9, size / 5),
                    fontWeight: "500",
                    textAlign: "center" as any,
                    padding: 4,
                    cursor: "default",
                    transition: "transform 0.2s",
                  }}>
                    {s.name.length > 8 ? s.name.slice(0, 7) + "..." : s.name}
                  </div>
                );
              })}
            </div>

            {/* Symbol list */}
            <div style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 18, fontWeight: "600", color: "#c4b5fd", marginBottom: 16 }}>
                Your recurring symbols
              </h2>
              {symbols.slice(0, 10).map((s, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 10
                }}>
                  <span style={{ fontSize: 14, color: "#e2e8f0", minWidth: 120 }}>{s.name}</span>
                  <div style={{ flex: 1, background: "#1e1b4b", borderRadius: 4, height: 8 }}>
                    <div style={{
                      width: `${(s.count / maxCount) * 100}%`,
                      background: "#7c3aed",
                      height: 8,
                      borderRadius: 4
                    }} />
                  </div>
                  <span style={{ fontSize: 13, color: "#9ca3af", minWidth: 60 }}>
                    {s.count} {s.count === 1 ? "dream" : "dreams"}
                  </span>
                </div>
              ))}
            </div>

            {/* Generate myth button */}
            <div style={{
              background: "#13131a",
              border: "1px solid #4c1d95",
              borderRadius: 16,
              padding: 24
            }}>
              <h2 style={{ fontSize: 18, fontWeight: "600", color: "#c4b5fd", marginBottom: 8 }}>
                🏛️ Your personal myth
              </h2>
              <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 16 }}>
                Let AI write the story of who you are based on your dream symbols.
              </p>

              {!myth && (
                <button
                  onClick={generateMyth}
                  disabled={generating}
                  style={{
                    padding: "12px 24px",
                    borderRadius: 10,
                    background: generating ? "#4c1d95" : "#7c3aed",
                    color: "white",
                    fontWeight: "600",
                    fontSize: 15,
                    border: "none",
                    cursor: generating ? "not-allowed" : "pointer"
                  }}
                >
                  {generating ? "Writing your myth..." : "Generate my myth ✨"}
                </button>
              )}

              {myth && (
                <p style={{ fontSize: 15, color: "#e2e8f0", lineHeight: 1.8 }}>
                  {myth}
                </p>
              )}
            </div>
          </>
        )}

      </div>
    </main>
  );
}
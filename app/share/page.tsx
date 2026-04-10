"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function Share() {
  const [dreams, setDreams] = useState([] as any[]);
  const [selected, setSelected] = useState(null as any);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDreams() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login";
        return;
      }
      const { data } = await supabase
        .from("dreams")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      setDreams(data || []);
      if (data && data.length > 0) setSelected(data[0]);
      setLoading(false);
    }
    loadDreams();
  }, []);

  return (
    <main style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      color: "white",
      fontFamily: "sans-serif",
      padding: "40px 24px"
    }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <a href="/dashboard" style={{ color: "#9ca3af", textDecoration: "none", fontSize: 13 }}>← Back</a>
          <span style={{ fontSize: 28 }}>✨</span>
          <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#c4b5fd" }}>Share your dream</h1>
        </div>

        {loading && <p style={{ color: "#9ca3af" }}>Loading...</p>}

        {!loading && dreams.length === 0 && (
          <div style={{ textAlign: "center", marginTop: 60 }}>
            <p style={{ color: "#9ca3af" }}>No dreams to share yet.</p>
            <a href="/dashboard" style={{
              display: "inline-block", marginTop: 16,
              background: "#7c3aed", color: "white",
              padding: "10px 24px", borderRadius: 10,
              textDecoration: "none", fontSize: 14
            }}>Log a dream first</a>
          </div>
        )}

        {!loading && dreams.length > 0 && (
          <>
            {/* Dream selector */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8 }}>Select a dream to share:</p>
              <select
                onChange={(e) => setSelected(dreams.find(d => d.id === e.target.value))}
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: "1px solid #4c1d95",
                  background: "#13131a",
                  color: "white",
                  fontSize: 14,
                  outline: "none"
                }}
              >
                {dreams.map((d: any) => (
                  <option key={d.id} value={d.id}>
                    {new Date(d.created_at).toLocaleDateString()} — {d.content.slice(0, 50)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Shareable card */}
            {selected && (
              <>
                <div id="share-card" style={{
                  background: "linear-gradient(135deg, #1a0533 0%, #0a0a0f 50%, #0d1a2e 100%)",
                  border: "1px solid #4c1d95",
                  borderRadius: 20,
                  padding: 32,
                  marginBottom: 20
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                    <span style={{ fontSize: 24 }}>🌙</span>
                    <span style={{ fontSize: 18, fontWeight: "bold", color: "#c4b5fd" }}>Dreamweave</span>
                    <span style={{ marginLeft: "auto", fontSize: 12, color: "#6b7280" }}>
                      {new Date(selected.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                  </div>

                  <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 16, lineHeight: 1.6, fontStyle: "italic" }}>
                    "{selected.content.slice(0, 120)}{selected.content.length > 120 ? "..." : ""}"
                  </p>

                  {selected.symbols && selected.symbols.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Symbols</p>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as any }}>
                        {selected.symbols.map((s: string, i: number) => (
                          <span key={i} style={{
                            padding: "3px 10px",
                            background: "#2e1065",
                            color: "#c4b5fd",
                            borderRadius: 20,
                            fontSize: 12
                          }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selected.interpretation && (
                    <div style={{
                      background: "rgba(124, 58, 237, 0.1)",
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 16
                    }}>
                      <p style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.7 }}>
                        {selected.interpretation.slice(0, 200)}{selected.interpretation.length > 200 ? "..." : ""}
                      </p>
                    </div>
                  )}

                  <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #1e1b4b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "#4c1d95" }}>dreamweave-sigma.vercel.app</span>
                    <span style={{ fontSize: 11, color: "#4c1d95" }}>Your dreams. Your mythology.</span>
                  </div>
                </div>

                <p style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", marginBottom: 16 }}>
                  📸 Take a screenshot of the card above to share on Instagram, Twitter, or anywhere!
                </p>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => {
                      const text = `My dream analysis from Dreamweave 🌙\n\nSymbols: ${selected.symbols?.join(", ")}\n\n${selected.interpretation?.slice(0, 200)}\n\nLog your dreams: dreamweave-sigma.vercel.app`;
                      navigator.clipboard.writeText(text);
                      alert("Copied to clipboard!");
                    }}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: 10,
                      background: "#7c3aed",
                      color: "white",
                      fontWeight: "600",
                      fontSize: 14,
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    📋 Copy text to share
                  </button>
                </div>
              </>
            )}
          </>
        )}

      </div>
    </main>
  );
}
"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function History() {
  const [dreams, setDreams] = useState([] as any[]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null as any);
  const [selected, setSelected] = useState(null as any);

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
        .order("created_at", { ascending: false });
      setDreams(data || []);
      setLoading(false);
    }
    loadDreams();
  }, []);

  async function deleteDream(id: string) {
    const confirm = window.confirm("Delete this dream? This cannot be undone.");
    if (!confirm) return;
    setDeleting(id);
    await supabase.from("dreams").delete().eq("id", id);
    setDreams(dreams.filter((d: any) => d.id !== id));
    if (selected?.id === id) setSelected(null);
    setDeleting(null);
  }

  const moodEmoji: Record<number, string> = {
    1: "😨", 2: "😟", 3: "😐", 4: "😊", 5: "🤩"
  };

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
            <a href="/dashboard" style={{ color: "#9ca3af", textDecoration: "none", fontSize: 13 }}>← Back</a>
            <span style={{ fontSize: 28 }}>📖</span>
            <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#c4b5fd" }}>My Dreams</h1>
          </div>
          <a href="/dashboard" style={{
            background: "#7c3aed",
            border: "none",
            color: "white",
            padding: "6px 14px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 13,
            textDecoration: "none"
          }}>+ New dream</a>
        </div>

        {loading && (
          <p style={{ color: "#9ca3af", textAlign: "center" }}>Loading your dreams...</p>
        )}

        {!loading && dreams.length === 0 && (
          <div style={{ textAlign: "center", marginTop: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🌙</div>
            <p style={{ color: "#9ca3af", fontSize: 16 }}>No dreams logged yet.</p>
            <a href="/dashboard" style={{
              display: "inline-block",
              marginTop: 16,
              background: "#7c3aed",
              color: "white",
              padding: "10px 24px",
              borderRadius: 10,
              textDecoration: "none",
              fontSize: 14
            }}>Log your first dream</a>
          </div>
        )}

        {/* Full dream view */}
        {selected && (
          <div style={{
            background: "#13131a",
            border: "1px solid #7c3aed",
            borderRadius: 16,
            padding: 24,
            marginBottom: 24
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: "#6b7280" }}>
                {new Date(selected.created_at).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                {selected.mood && <span style={{ marginLeft: 8 }}>{moodEmoji[selected.mood]}</span>}
              </p>
              <button onClick={() => setSelected(null)} style={{
                background: "none", border: "none",
                color: "#9ca3af", cursor: "pointer", fontSize: 13
              }}>✕ Close</button>
            </div>

            <p style={{ fontSize: 15, color: "#e2e8f0", lineHeight: 1.7, marginBottom: 20 }}>
              {selected.content}
            </p>

            {selected.symbols && selected.symbols.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>Symbols</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as any }}>
                  {selected.symbols.map((s: string, i: number) => (
                    <span key={i} style={{
                      padding: "3px 10px", background: "#2e1065",
                      color: "#c4b5fd", borderRadius: 20, fontSize: 12
                    }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {selected.emotions && selected.emotions.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>Emotions</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as any }}>
                  {selected.emotions.map((e: string, i: number) => (
                    <span key={i} style={{
                      padding: "3px 10px", background: "#1e1b4b",
                      color: "#a5b4fc", borderRadius: 20, fontSize: 12
                    }}>{e}</span>
                  ))}
                </div>
              </div>
            )}

            {selected.interpretation && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>Interpretation</p>
                <p style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.7 }}>{selected.interpretation}</p>
              </div>
            )}

            {selected.mythology && (
              <div style={{
                marginBottom: 16, padding: 14,
                background: "#0f0a1e", borderRadius: 10,
                borderLeft: "3px solid #7c3aed"
              }}>
                <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>🏛️ Mythological connection</p>
                <p style={{ fontSize: 14, color: "#c4b5fd", lineHeight: 1.7 }}>{selected.mythology}</p>
              </div>
            )}

            {selected.advice && (
              <div style={{
                padding: 14, background: "#0a1a0f",
                borderRadius: 10, borderLeft: "3px solid #059669"
              }}>
                <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>✨ What your dream was telling you</p>
                <p style={{ fontSize: 14, color: "#6ee7b7", lineHeight: 1.7 }}>{selected.advice}</p>
              </div>
            )}
          </div>
        )}

        {dreams.map((d: any) => (
          <div
            key={d.id}
            onClick={() => setSelected(d)}
            style={{
              background: selected?.id === d.id ? "#1a0f2e" : "#13131a",
              border: selected?.id === d.id ? "1px solid #7c3aed" : "1px solid #4c1d95",
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              cursor: "pointer",
              transition: "border 0.2s"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <p style={{ fontSize: 12, color: "#6b7280" }}>
                  {new Date(d.created_at).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </p>
                {d.mood && <span style={{ fontSize: 16 }}>{moodEmoji[d.mood]}</span>}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); deleteDream(d.id); }}
                disabled={deleting === d.id}
                style={{
                  background: "none",
                  border: "1px solid #4c1d95",
                  color: "#6b7280",
                  padding: "3px 10px",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 12
                }}
              >
                {deleting === d.id ? "..." : "🗑️"}
              </button>
            </div>

            <p style={{ fontSize: 14, color: "#e2e8f0", marginBottom: 12, lineHeight: 1.6 }}>
              {d.content.length > 120 ? d.content.slice(0, 120) + "..." : d.content}
            </p>

            {d.symbols && d.symbols.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as any }}>
                {d.symbols.slice(0, 4).map((s: string, i: number) => (
                  <span key={i} style={{
                    padding: "3px 10px", background: "#2e1065",
                    color: "#c4b5fd", borderRadius: 20, fontSize: 12
                  }}>{s}</span>
                ))}
                {d.symbols.length > 4 && (
                  <span style={{ fontSize: 12, color: "#6b7280", padding: "3px 0" }}>+{d.symbols.length - 4} more</span>
                )}
              </div>
            )}

            <p style={{ fontSize: 12, color: "#4c1d95", marginTop: 10 }}>
              Tap to see full analysis →
            </p>
          </div>
        ))}

      </div>
      {/* Bottom navigation */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#0d0d14",
        borderTop: "1px solid #1e1b4b",
        display: "flex",
        justifyContent: "space-around",
        padding: "12px 0 20px 0"
      }}>
        <a href="/dashboard" style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: 4,
          textDecoration: "none"
        }}>
          <span style={{ fontSize: 22 }}>🌙</span>
          <span style={{ fontSize: 10, color: "#6b7280" }}>Journal</span>
        </a>
        <a href="/history" style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: 4,
          textDecoration: "none"
        }}>
          <span style={{ fontSize: 22 }}>📖</span>
          <span style={{ fontSize: 10, color: "#7c3aed" }}>History</span>
        </a>
        <a href="/mythmap" style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: 4,
          textDecoration: "none"
        }}>
          <span style={{ fontSize: 22 }}>🗺️</span>
          <span style={{ fontSize: 10, color: "#6b7280" }}>Myth Map</span>
        </a>
        <a href="/share" style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: 4,
          textDecoration: "none"
        }}>
          <span style={{ fontSize: 22 }}>✨</span>
          <span style={{ fontSize: 10, color: "#6b7280" }}>Share</span>
        </a>
      </div>
    </main>
  );
}
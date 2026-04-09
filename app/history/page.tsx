"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function History() {
  const [dreams, setDreams] = useState([] as any[]);
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
        .order("created_at", { ascending: false });
      setDreams(data || []);
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

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 28 }}>🌙</span>
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

        {dreams.map((d: any) => (
          <div key={d.id} style={{
            background: "#13131a",
            border: "1px solid #4c1d95",
            borderRadius: 16,
            padding: 20,
            marginBottom: 16
          }}>
            <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>
              {new Date(d.created_at).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
            <p style={{ fontSize: 14, color: "#e2e8f0", marginBottom: 12, lineHeight: 1.6 }}>
              {d.content.length > 150 ? d.content.slice(0, 150) + "..." : d.content}
            </p>
            {d.symbols && d.symbols.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as any }}>
                {d.symbols.map((s: string, i: number) => (
                  <span key={i} style={{
                    padding: "3px 10px",
                    background: "#2e1065",
                    color: "#c4b5fd",
                    borderRadius: 20,
                    fontSize: 12
                  }}>{s}</span>
                ))}
              </div>
            )}
          </div>
        ))}

      </div>
    </main>
  );
}
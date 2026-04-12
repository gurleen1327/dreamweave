"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
  }, []);

  async function handleUpdate() {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated! Redirecting...");
      setTimeout(() => window.location.href = "/dashboard", 2000);
    }
    setLoading(false);
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      color: "white",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 24px",
      fontFamily: "sans-serif"
    }}>
      <div style={{ fontSize: 36, marginBottom: 16 }}>🌙</div>
      <h1 style={{ fontSize: 28, fontWeight: "bold", color: "#c4b5fd", marginBottom: 8 }}>
        Set new password
      </h1>
      <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 32 }}>
        {ready ? "Enter your new password below" : "Verifying your reset link..."}
      </p>

      {ready && (
        <div style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 16 }}>
          <input
            type="password"
            placeholder="New password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "12px 16px",
              borderRadius: 10,
              border: "1px solid #4c1d95",
              background: "#13131a",
              color: "white",
              fontSize: 15,
              outline: "none",
              width: "100%"
            }}
          />

          <button
            onClick={handleUpdate}
            disabled={loading || password.length < 6}
            style={{
              padding: "12px 24px",
              borderRadius: 10,
              background: loading ? "#4c1d95" : "#7c3aed",
              color: "white",
              fontWeight: "600",
              fontSize: 16,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Updating..." : "Update password"}
          </button>

          {message && (
            <p style={{ fontSize: 14, color: "#c4b5fd", textAlign: "center" }}>
              {message}
            </p>
          )}
        </div>
      )}
    </main>
  );
}
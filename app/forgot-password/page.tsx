"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://dreamweave-sigma.vercel.app/reset-password"
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for a password reset link!");
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
        Reset your password
      </h1>
      <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 32 }}>
        Enter your email and we'll send you a reset link
      </p>

      <div style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 16 }}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          onClick={handleReset}
          disabled={loading}
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
          {loading ? "Sending..." : "Send reset link"}
        </button>

        {message && (
          <p style={{ fontSize: 14, color: "#c4b5fd", textAlign: "center" }}>
            {message}
          </p>
        )}
      </div>

      <p style={{ marginTop: 24, fontSize: 14, color: "#9ca3af" }}>
        Remember your password?{" "}
        <a href="/login" style={{ color: "#c4b5fd", textDecoration: "none" }}>
          Sign in
        </a>
      </p>
    </main>
  );
}
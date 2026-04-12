export default function Home() {
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

      <div style={{ fontSize: 48, marginBottom: 24 }}>🌙</div>

      <h1 style={{
        fontSize: 48,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 16,
        color: "#c4b5fd"
      }}>
        Dreamweave
      </h1>

      <p style={{ fontSize: 18, color: "#ddd6fe", textAlign: "center", marginBottom: 8 }}>
        Your dreams. Your mythology.
      </p>

      <p style={{ fontSize: 14, color: "#9ca3af", textAlign: "center", maxWidth: 360, marginBottom: 40 }}>
        Log your dreams every morning. Dreamweave finds the symbols, patterns, and stories hidden in your sleep — over months and years.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 300 }}>
        <a href="/signup" style={{
          textAlign: "center",
          background: "#7c3aed",
          color: "white",
          fontWeight: "600",
          padding: "12px 24px",
          borderRadius: 12,
          textDecoration: "none",
          fontSize: 16
        }}>
          Start weaving dreams
        </a>
        <a href="/login" style={{
          textAlign: "center",
          border: "1px solid #6d28d9",
          color: "#c4b5fd",
          fontWeight: "500",
          padding: "12px 24px",
          borderRadius: 12,
          textDecoration: "none",
          fontSize: 16
        }}>
          I already have an account
        </a>
      </div>

      <div style={{ marginTop: 64, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, maxWidth: 480, textAlign: "center" }}>
        <div>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📖</div>
          <p style={{ fontSize: 12, color: "#9ca3af" }}>Daily dream journal</p>
        </div>
        <div>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🔮</div>
          <p style={{ fontSize: 12, color: "#9ca3af" }}>AI symbol detection</p>
        </div>
        <div>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🗺️</div>
          <p style={{ fontSize: 12, color: "#9ca3af" }}>Personal myth map</p>
        </div>
      </div>
      <div style={{ marginTop: 48, fontSize: 12, color: "#4c1d95" }}>
  <a href="/privacy" style={{ color: "#4c1d95", textDecoration: "none" }}>Privacy Policy</a>
</div>
    </main>
  );
}
export default function Privacy() {
    return (
      <main style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        color: "white",
        fontFamily: "sans-serif",
        padding: "40px 24px"
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
  
          <div style={{ marginBottom: 32 }}>
            <a href="/" style={{ color: "#9ca3af", textDecoration: "none", fontSize: 13 }}>← Back</a>
          </div>
  
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <span style={{ fontSize: 28 }}>🌙</span>
            <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#c4b5fd" }}>Privacy Policy</h1>
          </div>
  
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 32 }}>Last updated: April 2026</p>
  
          {[
            {
              title: "What we collect",
              content: "We collect your email address when you sign up, and the dream entries you choose to log. We also collect basic usage data like when you log in."
            },
            {
              title: "How we use your data",
              content: "Your dream entries are sent to Google Gemini AI to generate analysis. We store your dreams, analysis results, and mood ratings in our secure database so you can access them later. We never sell your data to anyone."
            },
            {
              title: "Who can see your dreams",
              content: "Only you can see your dreams in the app. As the app operator, we have technical access to the database but we do not read, share, or use your personal dream entries for any purpose other than running the app."
            },
            {
              title: "Google Gemini AI",
              content: "When you log a dream, the text is sent to Google Gemini API for analysis. Google processes this data according to their privacy policy. We do not send any personally identifying information alongside your dream text."
            },
            {
              title: "Email",
              content: "We use your email to send you optional morning reminders and weekly digests. You can stop these at any time by contacting us."
            },
            {
              title: "Data deletion",
              content: "You can delete individual dreams from your history at any time. To delete your entire account and all associated data, email us and we will remove everything within 7 days."
            },
            {
              title: "Contact",
              content: "If you have any questions about your privacy, email us at dreamweaveapp@gmail.com"
            }
          ].map((section, i) => (
            <div key={i} style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 16, fontWeight: "600", color: "#c4b5fd", marginBottom: 8 }}>
                {section.title}
              </h2>
              <p style={{ fontSize: 14, color: "#9ca3af", lineHeight: 1.8 }}>
                {section.content}
              </p>
            </div>
          ))}
  
        </div>
      </main>
    );
  }
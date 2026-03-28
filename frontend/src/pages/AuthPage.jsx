import { useState } from "react";

export default function AuthPage({ onLogin }) {
  const [form, setForm] = useState({ name: "", email: "" });
  const [error, setError] = useState("");

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.name.trim()) { setError("Please enter your name."); return; }
    if (!form.email.trim()) { setError("Please enter your email."); return; }
    if (!form.email.includes("@")) { setError("Please enter a valid email."); return; }
    setError("");
    onLogin({ name: form.name.trim(), email: form.email.trim(), language: "English" });
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <div style={{
      minHeight: "100vh", width: "100%",
      display: "grid", gridTemplateColumns: "1fr 1fr",
      background: "var(--bg)",
    }}>
      {/* ── Left Panel ── */}
      <div style={{
        background: "linear-gradient(160deg, #1e3a6e 0%, #162d5a 60%, #0f2040 100%)",
        display: "flex", flexDirection: "column",
        justifyContent: "center",
        padding: "72px 64px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative glows */}
        <div style={{
          position: "absolute", top: "15%", left: "-60px",
          width: "320px", height: "320px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(96,165,250,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "-60px",
          width: "260px", height: "260px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(147,197,253,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        {/* Subtle grid pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1, animation: "fadeUp 0.7s ease forwards" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "56px" }}>
            <div style={{
              width: "38px", height: "38px",
              background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "10px", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "18px",
            }}>📰</div>
            <span style={{
              color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-body)",
              fontWeight: "500", fontSize: "13px", letterSpacing: "0.1em",
            }}>NEWS INTELLIGENCE</span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 4vw, 56px)",
            fontWeight: "700", color: "#ffffff",
            lineHeight: 1.1, marginBottom: "24px", letterSpacing: "-0.02em",
          }}>
            Stay informed.<br />
            <span style={{ color: "#93c5fd", fontStyle: "italic" }}>Stay ahead.</span>
          </h1>

          <p style={{
            color: "rgba(255,255,255,0.65)", fontSize: "15px",
            lineHeight: 1.8, maxWidth: "360px",
            fontWeight: "300", letterSpacing: "0.02em",
          }}>
            AI-powered news personalized for you — summaries, credibility scores, and bias analysis tailored to how you think.
          </p>

          <div style={{ marginTop: "56px", display: "flex", flexDirection: "column", gap: "18px" }}>
            {[
              "AI summaries tailored to your persona",
              "Credibility scoring on every article",
              "Political bias detection",
              "Real-time fact checking",
            ].map(text => (
              <div key={text} style={{
                display: "flex", gap: "14px", alignItems: "center",
                color: "rgba(255,255,255,0.6)", fontSize: "14px",
                letterSpacing: "0.02em", fontWeight: "300",
              }}>
                <span style={{ color: "#93c5fd", fontSize: "10px" }}>✦</span>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div style={{
        background: "var(--bg)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "48px 64px",
      }}>
        <div style={{ width: "100%", maxWidth: "380px", animation: "fadeUp 0.7s ease 0.15s both" }}>
          <h2 style={{
            fontFamily: "var(--font-display)", fontSize: "32px",
            fontWeight: "500", color: "var(--text-primary)",
            marginBottom: "8px", letterSpacing: "-0.01em",
          }}>Welcome</h2>
          <p style={{
            color: "var(--text-muted)", fontSize: "14px",
            marginBottom: "40px", letterSpacing: "0.02em", fontWeight: "300",
          }}>
            Enter your details to get your personalized feed
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={labelStyle}>YOUR NAME</label>
              <input className="auth-input" placeholder="Jane Smith"
                value={form.name} onChange={e => update("name", e.target.value)} onKeyDown={handleKeyDown} />
            </div>
            <div>
              <label style={labelStyle}>EMAIL</label>
              <input className="auth-input" type="email" placeholder="you@email.com"
                value={form.email} onChange={e => update("email", e.target.value)} onKeyDown={handleKeyDown} />
            </div>

            {error && (
              <div style={{
                background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.2)",
                borderRadius: "var(--radius-sm)", padding: "10px 14px",
                color: "var(--red)", fontSize: "13px", letterSpacing: "0.02em",
              }}>{error}</div>
            )}

            <button className="auth-btn" onClick={handleSubmit} style={{ marginTop: "4px" }}>
              Continue →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  fontSize: "11px", color: "var(--text-muted)", fontWeight: "600",
  letterSpacing: "0.1em", display: "block", marginBottom: "8px", textTransform: "uppercase",
};
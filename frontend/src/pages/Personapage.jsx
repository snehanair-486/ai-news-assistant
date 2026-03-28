import { useState } from "react";
import { PERSONAS } from "../constants";

export default function PersonaPage({ user, onPersonaSelect }) {
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!selected) { setError("Please select what describes you best."); return; }
    onPersonaSelect(selected);
  };

  return (
    <div style={{
      minHeight: "100vh", width: "100%",
      background: "var(--bg)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "48px 24px",
    }}>
      {/* Ambient glow */}
      <div style={{
        position: "fixed", top: "30%", left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "300px", borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(37,99,235,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: "580px", animation: "fadeUp 0.6s ease forwards", position: "relative" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{
            width: "52px", height: "52px",
            background: "var(--accent-soft)", border: "1px solid var(--accent-dim)",
            borderRadius: "14px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "22px", margin: "0 auto 24px",
          }}>📰</div>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(26px, 3.5vw, 38px)",
            fontWeight: "600", color: "var(--text-primary)",
            marginBottom: "12px", lineHeight: 1.2, letterSpacing: "-0.02em",
          }}>
            Hey {user.name},<br />
            <span style={{ color: "var(--accent)", fontStyle: "italic" }}>what describes you?</span>
          </h1>
          <p style={{
            color: "var(--text-secondary)", fontSize: "15px",
            lineHeight: 1.7, fontWeight: "300", letterSpacing: "0.02em",
          }}>
            We'll personalize your feed, summaries, and insights to match how you think.
          </p>
        </div>

        {/* Persona Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "28px" }}>
          {PERSONAS.map(p => {
            const isSelected = selected === p.id;
            return (
              <button
                key={p.id}
                onClick={() => { setSelected(p.id); setError(""); }}
                style={{
                  padding: "26px 22px",
                  border: `1.5px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: "var(--radius-md)",
                  background: isSelected ? "var(--accent-soft)" : "var(--bg-card)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                  boxShadow: isSelected
                    ? "0 0 0 1px var(--accent-dim), 0 8px 24px rgba(37,99,235,0.1)"
                    : "0 2px 8px rgba(37,99,235,0.06)",
                  position: "relative",
                }}
              >
                {isSelected && (
                  <div style={{
                    position: "absolute", top: "14px", right: "14px",
                    width: "20px", height: "20px",
                    background: "var(--accent)", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "10px", color: "#ffffff", fontWeight: "700",
                  }}>✓</div>
                )}
                <div style={{ fontSize: "26px", marginBottom: "12px" }}>{p.emoji}</div>
                <div style={{
                  fontSize: "15px", fontWeight: "500",
                  color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
                  fontFamily: "var(--font-body)", marginBottom: "6px",
                  letterSpacing: "0.01em",
                }}>
                  {p.label}
                </div>
                <div style={{
                  fontSize: "12px", color: "var(--text-muted)",
                  lineHeight: 1.6, fontWeight: "300",
                  fontFamily: "var(--font-body)", letterSpacing: "0.02em",
                }}>
                  {p.desc}
                </div>
              </button>
            );
          })}
        </div>

        {error && (
          <div style={{
            background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.18)",
            borderRadius: "var(--radius-sm)", padding: "10px 14px",
            color: "var(--red)", fontSize: "13px", marginBottom: "16px",
            textAlign: "center", letterSpacing: "0.02em",
          }}>{error}</div>
        )}

        <button className="auth-btn" onClick={handleContinue}
          style={{ opacity: selected ? 1 : 0.45 }}>
          Take me to my feed →
        </button>

        <p style={{
          textAlign: "center", marginTop: "18px",
          fontSize: "12px", color: "var(--text-muted)",
          letterSpacing: "0.03em", fontWeight: "300",
        }}>
          You can always change this later
        </p>
      </div>
    </div>
  );
}
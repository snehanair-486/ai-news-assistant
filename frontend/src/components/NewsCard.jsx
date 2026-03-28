import { useState } from "react";
import { BIAS_COLORS, PERSONAS } from "../constants";

const VERDICT_STYLES = {
  "Verified":     { icon: "✓", color: "#16a34a", background: "rgba(22,163,74,0.07)",   border: "rgba(22,163,74,0.2)"   },
  "Unverified":   { icon: "~", color: "#d97706", background: "rgba(217,119,6,0.07)",   border: "rgba(217,119,6,0.2)"   },
  "Likely False": { icon: "✕", color: "#dc2626", background: "rgba(220,38,38,0.07)",   border: "rgba(220,38,38,0.2)"   },
};

const credibilityColor = (score) => {
  if (score >= 75) return "#16a34a";
  if (score >= 50) return "#d97706";
  return "#dc2626";
};

export default function NewsCard({ article, index, persona, accentColor }) {
  const [factCheck, setFactCheck] = useState(null);
  const [checking, setChecking] = useState(false);

  const source = article.title?.split(" - ").pop()?.toUpperCase() || "NEWS";
  const headline = article.title?.split(" - ")[0] || article.title;
  const personaInfo = PERSONAS.find(p => p.id === persona);
  const summaryLabel = personaInfo ? `${personaInfo.emoji} ${personaInfo.label.toUpperCase()} TAKE` : "AI SUMMARY";
  const cardAccent = accentColor || "var(--accent)";

  const handleFactCheck = async () => {
    setChecking(true);
    setFactCheck(null);
    try {
      const res = await fetch("http://localhost:5000/factcheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: article.title, text: article.description || article.title }),
      });
      setFactCheck(await res.json());
    } catch {
      setFactCheck({ verdict: "Unverified", explanation: "Could not complete fact-check at this time.", claim: "", sourceCount: 0 });
    } finally {
      setChecking(false);
    }
  };

  const verdictStyle = factCheck ? VERDICT_STYLES[factCheck.verdict] || VERDICT_STYLES["Unverified"] : null;

  return (
    <div className="news-card" style={{ animationDelay: `${index * 0.08}s` }}>

      {/* ── Source + Badges ── */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "16px",
        flexWrap: "wrap", gap: "8px",
      }}>
        <span style={{
          fontSize: "10px", color: "var(--text-muted)",
          fontFamily: "var(--font-body)", letterSpacing: "0.12em",
          fontWeight: "600", textTransform: "uppercase",
        }}>
          {source}
        </span>
        <div style={{ display: "flex", gap: "6px" }}>
          {article.bias && (
            <span style={{
              padding: "3px 10px", borderRadius: "100px", fontSize: "11px",
              fontFamily: "var(--font-body)", letterSpacing: "0.04em",
              color: BIAS_COLORS[article.bias],
              background: `${BIAS_COLORS[article.bias]}18`,
              border: `1px solid ${BIAS_COLORS[article.bias]}35`,
            }}>
              {article.bias}
            </span>
          )}
          {article.credibilityScore !== undefined && (
            <span style={{
              padding: "3px 10px", borderRadius: "100px", fontSize: "11px",
              fontFamily: "var(--font-body)", letterSpacing: "0.04em",
              color: credibilityColor(article.credibilityScore),
              background: `${credibilityColor(article.credibilityScore)}18`,
              border: `1px solid ${credibilityColor(article.credibilityScore)}35`,
            }}>
              ✓ {article.credibilityScore}/100
            </span>
          )}
        </div>
      </div>

      {/* ── Headline ── */}
      <h3 style={{
        fontSize: "18px", fontWeight: "500", color: "var(--text-primary)",
        lineHeight: 1.5, marginBottom: "18px",
        fontFamily: "var(--font-display)", letterSpacing: "-0.01em",
      }}>
        {headline}
      </h3>

      <div style={{ height: "1px", background: "var(--border-soft)", marginBottom: "18px" }} />

      {/* ── AI Summary ── */}
      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "20px" }}>
        <span style={{
          fontSize: "9px", letterSpacing: "0.12em",
          color: cardAccent,
          fontFamily: "var(--font-body)", fontWeight: "600",
          paddingTop: "4px", whiteSpace: "nowrap", textTransform: "uppercase",
        }}>
          {summaryLabel}
        </span>
        <p style={{
          margin: 0, fontSize: "14px", lineHeight: 1.8,
          color: "var(--text-secondary)", fontWeight: "300",
          letterSpacing: "0.02em",
        }}>
          {article.aiSummary || (
            <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Analyzing...</span>
          )}
        </p>
      </div>

      {/* ── Fact Check Button ── */}
      {!factCheck && (
        <button
          onClick={handleFactCheck}
          disabled={checking}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "8px 16px",
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            color: "var(--text-muted)",
            fontSize: "12px", fontFamily: "var(--font-body)",
            fontWeight: "400", letterSpacing: "0.04em",
            cursor: checking ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { if (!checking) { e.currentTarget.style.borderColor = cardAccent; e.currentTarget.style.color = cardAccent; e.currentTarget.style.background = "var(--accent-soft)"; }}}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}
        >
          {checking ? (
            <>
              <span style={{
                width: "11px", height: "11px",
                border: "1.5px solid var(--border)", borderTopColor: cardAccent,
                borderRadius: "50%", display: "inline-block",
                animation: "spin 0.8s linear infinite",
              }} />
              Checking sources...
            </>
          ) : (
            <>🔎 Fact check this article</>
          )}
        </button>
      )}

      {/* ── Fact Check Result ── */}
      {factCheck && verdictStyle && (
        <div style={{
          marginTop: "4px",
          background: verdictStyle.background,
          border: `1px solid ${verdictStyle.border}`,
          borderRadius: "var(--radius-sm)", padding: "16px 18px",
          animation: "fadeUp 0.4s ease forwards",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{
                fontSize: "12px", fontWeight: "600", color: verdictStyle.color,
                fontFamily: "var(--font-body)", letterSpacing: "0.08em",
              }}>
                {verdictStyle.icon} {factCheck.verdict.toUpperCase()}
              </span>
              {factCheck.sourceCount !== undefined && (
                <span style={{
                  fontSize: "11px", color: "var(--text-muted)",
                  background: "var(--bg-elevated)", border: "1px solid var(--border)",
                  borderRadius: "100px", padding: "2px 9px",
                  fontFamily: "var(--font-body)", letterSpacing: "0.03em",
                }}>
                  {factCheck.sourceCount} source{factCheck.sourceCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <button onClick={() => setFactCheck(null)} style={{
              background: "transparent", border: "none",
              color: "var(--text-muted)", fontSize: "11px", cursor: "pointer",
              fontFamily: "var(--font-body)", letterSpacing: "0.03em",
            }}>
              dismiss
            </button>
          </div>

          {factCheck.claim && (
            <p style={{
              fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic",
              marginBottom: "10px", lineHeight: 1.6, letterSpacing: "0.02em",
            }}>
              "{factCheck.claim}"
            </p>
          )}

          <p style={{
            fontSize: "13px", color: "var(--text-secondary)",
            lineHeight: 1.7, margin: 0, fontWeight: "300", letterSpacing: "0.02em",
          }}>
            {factCheck.explanation}
          </p>

          <p style={{
            fontSize: "10px", color: "var(--text-muted)", marginTop: "12px",
            marginBottom: 0, fontFamily: "var(--font-body)",
            letterSpacing: "0.06em", textTransform: "uppercase",
          }}>
            Cross-referenced · Groq LLM
          </p>
        </div>
      )}
    </div>
  );
}
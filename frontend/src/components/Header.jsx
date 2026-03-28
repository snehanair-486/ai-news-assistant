import { useState } from "react";
import TopicFilter from "./TopicFilter";

export default function Header({ user, onLogout, selectedTopic, onTopicChange, loadingTopic, onSearch, personaConfig }) {
  return (
    <div style={{
      background: "var(--bg-card)",
      borderBottom: "1px solid var(--border-soft)",
      padding: "0 48px",
      position: "sticky", top: 0, zIndex: 100,
      boxShadow: "0 2px 16px rgba(37, 99, 235, 0.07)",
    }}>
      {/* ── Top row ── */}
      <div style={{
        maxWidth: "1100px", margin: "0 auto",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", height: "68px",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "30px", height: "30px",
            background: "var(--accent-soft)", border: "1px solid var(--accent-dim)",
            borderRadius: "8px", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "14px",
          }}>📰</div>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: "18px", fontWeight: "500", color: "var(--text-primary)",
            letterSpacing: "-0.01em",
          }}>
            News Intelligence
          </span>
        </div>

        {/* User + logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ fontSize: "13px", color: "var(--text-muted)", letterSpacing: "0.02em" }}>
            Hello, <strong style={{ color: "var(--text-secondary)", fontWeight: "500" }}>{user.name}</strong>
          </span>
          <button onClick={onLogout} style={{
            padding: "7px 16px", borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border)", background: "transparent",
            color: "var(--text-secondary)", fontSize: "13px", cursor: "pointer",
            fontFamily: "var(--font-body)", fontWeight: "400",
            letterSpacing: "0.03em",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.background = "var(--accent-soft)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "transparent"; }}
          >
            Log out
          </button>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", paddingBottom: "14px" }}>
        <SearchBar onSearch={onSearch} disabled={loadingTopic} accentColor={personaConfig?.accentColor} />
      </div>

      {/* ── Topic filter ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", paddingBottom: "14px" }}>
        <TopicFilter selectedTopic={selectedTopic} onTopicChange={onTopicChange} disabled={loadingTopic} />
      </div>
    </div>
  );
}

function SearchBar({ onSearch, disabled, accentColor }) {
  const [query, setQuery] = useState("");

  const handleSearch = () => { if (query.trim()) onSearch(query.trim()); };
  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };

  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center", maxWidth: "500px" }}>
      <div style={{ position: "relative", flex: 1 }}>
        <span style={{
          position: "absolute", left: "14px", top: "50%",
          transform: "translateY(-50%)", fontSize: "13px",
          color: "var(--text-muted)", pointerEvents: "none",
        }}>🔍</span>
        <input
          type="text" value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search news..."
          disabled={disabled}
          style={{
            width: "100%", padding: "9px 14px 9px 36px",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            fontSize: "13px", fontFamily: "var(--font-body)",
            fontWeight: "300", letterSpacing: "0.02em",
            color: "var(--text-primary)",
            background: "var(--bg-input)",
            outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
            opacity: disabled ? 0.5 : 1,
          }}
          onFocus={e => { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "0 0 0 3px var(--accent-soft)"; }}
          onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
        />
      </div>
      <button
        onClick={handleSearch}
        disabled={disabled || !query.trim()}
        style={{
          padding: "9px 20px",
          background: disabled || !query.trim() ? "var(--bg-elevated)" : "var(--accent)",
          color: disabled || !query.trim() ? "var(--text-muted)" : "#ffffff",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          fontSize: "13px", fontFamily: "var(--font-body)",
          fontWeight: "500", letterSpacing: "0.03em",
          cursor: disabled || !query.trim() ? "not-allowed" : "pointer",
          transition: "all 0.2s", whiteSpace: "nowrap",
        }}
      >
        Search
      </button>
    </div>
  );
}
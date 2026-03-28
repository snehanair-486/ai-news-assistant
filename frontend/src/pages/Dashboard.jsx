import { useEffect, useState } from "react";
import Header from "../components/Header";
import NewsCard from "../components/NewsCard";
import { TOPIC_CATEGORIES, PERSONA_CONFIG, PERSONAS } from "../constants";

export default function Dashboard({ user, onLogout }) {
  const persona = user.persona || "professional";
  const personaConfig = PERSONA_CONFIG[persona] || PERSONA_CONFIG["professional"];
  const personaInfo = PERSONAS.find(p => p.id === persona);

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [loadingTopic, setLoadingTopic] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const enrichArticles = async (articles) => {
    for (const article of articles) {
      await new Promise(r => setTimeout(r, 1500));
      const [summaryRes, analyzeRes] = await Promise.all([
        fetch("http://localhost:5000/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: article.description || article.title, persona, summaryStyle: personaConfig.summaryStyle }),
        }),
        fetch("http://localhost:5000/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: article.title, text: article.description || article.title }),
        }),
      ]);
      const summaryData = await summaryRes.json();
      const analyzeData = await analyzeRes.json();
      setNews(prev => [...prev, {
        ...article,
        aiSummary: summaryData.summary,
        credibilityScore: analyzeData.credibilityScore,
        bias: analyzeData.bias,
      }]);
    }
  };

  const fetchNews = async (topic) => {
    setLoading(true); setLoadingTopic(true); setSearchQuery(""); setNews([]);
    try {
      const url = topic === "All"
        ? `http://localhost:5000/news?persona=${persona}`
        : `http://localhost:5000/news?category=${TOPIC_CATEGORIES[topic] || ""}`;
      const articles = await (await fetch(url)).json();
      await enrichArticles(articles);
    } catch (err) { console.error("Error fetching news:", err); }
    finally { setLoading(false); setLoadingTopic(false); }
  };

  const handleSearch = async (query) => {
    setLoading(true); setLoadingTopic(true); setSearchQuery(query); setSelectedTopic(""); setNews([]);
    try {
      const articles = await (await fetch(`http://localhost:5000/search?q=${encodeURIComponent(query)}`)).json();
      await enrichArticles(articles);
    } catch (err) { console.error("Error searching news:", err); }
    finally { setLoading(false); setLoadingTopic(false); }
  };

  useEffect(() => { fetchNews("All"); }, []);

  const handleTopic = (topic) => { setSelectedTopic(topic); fetchNews(topic); };

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "var(--bg)" }}>
      <Header
        user={user} onLogout={onLogout}
        selectedTopic={selectedTopic} onTopicChange={handleTopic}
        loadingTopic={loadingTopic} onSearch={handleSearch}
        personaConfig={personaConfig}
      />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 48px" }}>

        {/* ── Persona Banner ── */}
        <div style={{ marginBottom: "32px", animation: "fadeUp 0.5s ease forwards" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "7px",
              padding: "5px 14px",
              background: `${personaConfig.accentColor}12`,
              border: `1px solid ${personaConfig.accentColor}30`,
              borderRadius: "100px",
              fontSize: "11px", fontFamily: "var(--font-body)",
              color: personaConfig.accentColor,
              fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase",
            }}>
              {personaInfo?.emoji} {personaInfo?.label}
            </span>
          </div>

          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(24px, 3vw, 36px)",
            color: "var(--text-primary)", fontWeight: "500",
            marginBottom: "6px", letterSpacing: "-0.02em", lineHeight: 1.2,
          }}>
            {searchQuery
              ? `Results for "${searchQuery}"`
              : selectedTopic === "All"
                ? personaConfig.dashboardTitle
                : `${selectedTopic} — ${personaConfig.greeting}`}
          </h2>
          <p style={{
            color: "var(--text-muted)", fontSize: "13px",
            letterSpacing: "0.04em", fontWeight: "300",
          }}>
            {personaConfig.tagline}
          </p>
        </div>

        {/* Loading spinner */}
        {loading && news.length === 0 && (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <div style={{
              width: "32px", height: "32px",
              border: "2px solid var(--border)",
              borderTopColor: personaConfig.accentColor || "var(--accent)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 20px",
            }} />
            <p style={{
              fontFamily: "var(--font-body)", fontSize: "11px",
              letterSpacing: "0.12em", color: "var(--text-muted)",
              textTransform: "uppercase", fontWeight: "400",
            }}>
              {searchQuery
                ? `Searching for "${searchQuery}"...`
                : `Building your ${personaInfo?.label} briefing...`}
            </p>
          </div>
        )}

        {/* No results */}
        {!loading && news.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
            <div style={{ fontSize: "36px", marginBottom: "16px" }}>🔍</div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", letterSpacing: "0.06em" }}>
              No articles found. Try a different search.
            </p>
          </div>
        )}

        {/* Cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))",
          gap: "16px",
        }}>
          {news.map((article, i) => (
            <NewsCard key={i} article={article} index={i} persona={persona} accentColor={personaConfig.accentColor} />
          ))}
        </div>

        {/* Loading next */}
        {loading && news.length > 0 && (
          <div style={{
            textAlign: "center", padding: "28px",
            color: "var(--text-muted)", fontFamily: "var(--font-body)",
            fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase",
          }}>
            Analyzing next article...
          </div>
        )}
      </div>
    </div>
  );
}
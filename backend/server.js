require('dotenv').config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// ── Persona → search keywords for default feed ────────────────
const PERSONA_QUERIES = {
  investor:     "stock market finance economy investment earnings",
  founder:      "startup funding venture capital tech entrepreneurship",
  student:      "science discovery research breakthrough education",
  professional: "business policy industry economy leadership",
};

// ── Helper: call Groq with retry ──────────────────────────────
const callGroq = async (prompt, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }]
        },
        {
          headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );
      return response.data.choices[0].message.content;
    } catch (err) {
      const isRateLimit = err.response?.data?.error?.code === "rate_limit_exceeded";
      if (isRateLimit && i < retries - 1) {
        console.log(`Rate limited, retrying in 5s... (attempt ${i + 1})`);
        await new Promise(r => setTimeout(r, 5000));
      } else {
        throw err;
      }
    }
  }
};

// ── Helper: search NewsAPI for corroborating sources ──────────
const searchCorroboratingNews = async (searchQuery) => {
  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&sortBy=relevancy&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`;
    const response = await axios.get(url);
    const articles = response.data.articles || [];
    return articles.slice(0, 5).map(a => ({
      title: a.title,
      source: a.source?.name || "Unknown",
      description: a.description || "",
    }));
  } catch (err) {
    console.error("NewsAPI corroboration error:", err.message);
    return [];
  }
};

// ── GET /news ─────────────────────────────────────────────────
app.get("/news", async (req, res) => {
  try {
    const { category, persona } = req.query;

    let url;

    if (category) {
      // User manually picked a topic — use NewsAPI category headlines
      url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${process.env.NEWS_API_KEY}`;
    } else if (persona && PERSONA_QUERIES[persona]) {
      // Default feed — search by persona keywords for relevant articles
      const q = encodeURIComponent(PERSONA_QUERIES[persona]);
      url = `https://newsapi.org/v2/everything?q=${q}&sortBy=publishedAt&pageSize=6&language=en&apiKey=${process.env.NEWS_API_KEY}`;
    } else {
      // Fallback
      url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`;
    }

    const response = await axios.get(url);
    const articles = (response.data.articles || [])
      .filter(a => a.title && a.title !== "[Removed]" && a.description)
      .slice(0, 3)
      .map(article => ({
        title: article.title,
        description: article.description,
      }));

    res.json(articles);
  } catch (error) {
    console.error("News fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

// ── GET /search ───────────────────────────────────────────────
app.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Query is required" });

    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=relevancy&pageSize=3&apiKey=${process.env.NEWS_API_KEY}`;
    const response = await axios.get(url);

    const articles = (response.data.articles || [])
      .filter(a => a.title && a.title !== "[Removed]")
      .slice(0, 3)
      .map(article => ({
        title: article.title,
        description: article.description,
      }));

    res.json(articles);
  } catch (error) {
    console.error("Search error:", error.message);
    res.status(500).json({ error: "Failed to search news" });
  }
});

// ── POST /summarize ───────────────────────────────────────────
app.post("/summarize", async (req, res) => {
  try {
    const { text, summaryStyle } = req.body;

    const styleInstruction = summaryStyle ? `\nFraming: ${summaryStyle}` : "";

    const prompt = `Summarize this news article in 2-3 short, plain sentences. No bullet points, no headers, no bold text, no markdown — just clean flowing prose.${styleInstruction}

Article:
${text || "No content available."}`;

    const summary = await callGroq(prompt);
    console.log("Generated summary:", summary);
    res.json({ summary });
  } catch (error) {
    console.error("Summarization error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to summarize" });
  }
});

// ── POST /analyze ─────────────────────────────────────────────
app.post("/analyze", async (req, res) => {
  try {
    const { title, text } = req.body;

    const prompt = `Analyze this news article and respond ONLY with a valid JSON object, no explanation, no markdown, no backticks.

Article title: ${title}
Article text: ${text}

Respond with exactly this format:
{"credibilityScore": <number between 0-100>, "bias": "<one of: Left, Center-Left, Center, Center-Right, Right>"}`;

    const raw = await callGroq(prompt);
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    const result = JSON.parse(jsonMatch[0]);

    console.log("Analysis result:", result);
    res.json(result);
  } catch (error) {
    console.error("Analysis error:", error.response?.data || error.message);
    res.status(500).json({ credibilityScore: 50, bias: "Center" });
  }
});

// ── POST /factcheck ───────────────────────────────────────────
app.post("/factcheck", async (req, res) => {
  try {
    const { title, text } = req.body;

    const claimPrompt = `From this news article, extract two things and respond ONLY as JSON, no markdown, no backticks:
1. The single most important factual claim (one sentence)
2. A short 3-5 word search query to find corroborating news articles

Title: ${title}
Text: ${text}

Respond with exactly:
{"claim": "<one sentence claim>", "searchQuery": "<3-5 word search query>"}`;

    const claimRaw = await callGroq(claimPrompt);
    const claimJson = claimRaw.match(/\{[\s\S]*\}/);
    if (!claimJson) throw new Error("No JSON in claim extraction");

    const { claim, searchQuery } = JSON.parse(claimJson[0]);

    const corroboratingArticles = await searchCorroboratingNews(searchQuery);
    const sourcesText = corroboratingArticles.length > 0
      ? corroboratingArticles.map((a, i) =>
          `Source ${i + 1} - ${a.source}: "${a.title}" — ${a.description}`
        ).join("\n")
      : "No corroborating sources found.";

    const sourceCount = corroboratingArticles.length;
    await new Promise(r => setTimeout(r, 3000));

    const factCheckPrompt = `You are a news fact-checker. Evaluate whether the claim is corroborated by the retrieved sources.

CLAIM: ${claim}

SOURCES (${sourceCount} found):
${sourcesText}

Rules:
- "Verified": 3+ sources confirm it
- "Unverified": 1-2 sources, loosely related
- "Likely False": sources contradict it

Respond ONLY with valid JSON, no markdown, no backticks:
{"verdict": "<Verified, Unverified, or Likely False>", "explanation": "<2-3 sentences max>", "claim": "<repeat the claim>", "sourceCount": ${sourceCount}}`;

    const raw = await callGroq(factCheckPrompt);
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in fact-check response");
    const result = JSON.parse(jsonMatch[0]);

    res.json(result);
  } catch (error) {
    console.error("Fact-check error:", error.response?.data || error.message);
    res.status(500).json({
      verdict: "Unverified",
      explanation: "Could not complete fact-check at this time.",
      claim: "",
      sourceCount: 0,
    });
  }
});

// ── Start server ──────────────────────────────────────────────
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
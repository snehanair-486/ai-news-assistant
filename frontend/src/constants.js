export const TOPICS = [
  "All", "Technology", "Politics", "Business",
  "Health", "Sports", "Science", "Education", "Celebrity"
];

export const TOPIC_CATEGORIES = {
  All: "",
  Technology: "technology",
  Politics: "politics",
  Business: "business",
  Health: "health",
  Sports: "sports",
  Science: "science",
  Education: "education",
  Celebrity: "entertainment",
};

export const LANGUAGES = ["English", "Spanish", "French", "German", "Hindi", "Arabic", "Chinese"];

export const BIAS_COLORS = {
  "Left": "#2563eb",
  "Center-Left": "#60a5fa",
  "Center": "#6b7280",
  "Center-Right": "#f97316",
  "Right": "#dc2626",
};

export const credibilityColor = (score) => {
  if (score >= 75) return "#16a34a";
  if (score >= 50) return "#ca8a04";
  return "#dc2626";
};

// ── Personas ──────────────────────────────────────────────────
export const PERSONAS = [
  { id: "investor",  label: "Investor",        emoji: "📈", desc: "Portfolio-relevant stories, market moves, economic signals" },
  { id: "founder",   label: "Startup Founder", emoji: "🚀", desc: "Funding news, competitor moves, tech disruptions" },
  { id: "student",   label: "Student",         emoji: "🎓", desc: "Explainer-first content, simplified jargon, context-rich" },
  { id: "professional", label: "Professional", emoji: "💼", desc: "Industry trends, policy impact, career-relevant insights" },
];

export const PERSONA_CONFIG = {
  investor: {
    dashboardTitle: "Your Investor Briefing",
    defaultTopics: ["Business", "Technology", "All"],
    summaryStyle: "Focus on market impact, financial implications, and what this means for investors and portfolios.",
    greeting: "Market Intelligence",
    accentColor: "#16a34a",
    tagline: "Portfolio-relevant · Market signals · Economic impact",
  },
  founder: {
    dashboardTitle: "Your Founder Feed",
    defaultTopics: ["Technology", "Business", "All"],
    summaryStyle: "Focus on startup ecosystem implications, funding trends, competitor moves, and what this means for entrepreneurs.",
    greeting: "Founder Intelligence",
    accentColor: "#7c3aed",
    tagline: "Funding news · Competitor moves · Tech disruptions",
  },
  student: {
    dashboardTitle: "Your Learning Digest",
    defaultTopics: ["Science", "Education", "Technology", "All"],
    summaryStyle: "Explain this simply for a student. Define any jargon, give background context, and explain why this matters in the real world.",
    greeting: "Knowledge Feed",
    accentColor: "#0891b2",
    tagline: "Simplified · Context-rich · Explainer-first",
  },
  professional: {
    dashboardTitle: "Your Executive Brief",
    defaultTopics: ["Business", "Politics", "All"],
    summaryStyle: "Focus on industry trends, policy implications, regulatory impact, and strategic business insights for working professionals.",
    greeting: "Executive Intelligence",
    accentColor: "#b45309",
    tagline: "Industry trends · Policy impact · Strategic insights",
  },
};
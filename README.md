# ai-news-assistant

An AI-powered, persona-aware news experience that goes beyond static feeds. Every article is enriched with an AI summary, credibility score, bias flag, and real-time fact-check, all tailored to who you are.

---

## ✨ Features
- Persona-aware summaries: Tell the app who you are (investor, founder, student, professional) and every summary is rewritten to match your context
- Credibility scoring: Each article gets a 0–100 trust score based on source reputation and claim quality
- Bias detection: Political, economic, and editorial bias is flagged alongside every story
- RAG fact-checking: Key claims are cross-referenced against other live news sources in real time
- Topic filtering and search: Browse by category or search by keyword to build your own feed

---

## ⚙️ Setup

### Step 1 — Clone the repo
```bash
git clone https://github.com/snehanair-486/ai-news-assistant.git
```

### Step 2 — Install backend dependencies
```bash
cd ai-news-assistant
cd backend
npm install
```

### Step 3 — Create `.env` file in the backend folder

Create a `.env` file inside the `backend/` folder. You can refer to `backend/.env.example` to see what keys are needed.

Then open `.env` and paste your own API keys:
```
NEWS_API_KEY=your_newsapi_key
GROQ_API_KEY=your_groq_key
```

> Get your NewsAPI key from [newsapi.org](https://newsapi.org) and your Groq key from [console.groq.com](https://console.groq.com)

### Step 4 — Start the backend
```bash
node server.js
```

### Step 5 — Open a new terminal and install frontend dependencies
```bash
cd ai-news-assistant
cd frontend
npm install
```

### Step 6 — Start the frontend
```bash
npm run dev
```

---

The app will be running at `http://localhost:5173` and the backend at `http://localhost:5000`.

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- AI: Groq LLM (llama-3.1-8b-instant)
- News: NewsAPI
- Fact-checking: RAG pipeline with live news sources

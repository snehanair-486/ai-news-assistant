# ai-news-assistant

An AI-powered news assistant that provides personalized news with summaries, credibility scores, bias detection, and fact-checking.

## Features
- AI-generated summaries using Groq LLM
- Credibility scoring and bias detection
- RAG-based fact checking across live news sources
- Topic filtering and search
- User login and language preferences

## Setup

### 1. Clone the repo
git clone https://github.com/snehanair-486/ai-news-assistant.git
cd ai-news-assistant

### 2. Backend setup
cd backend
npm install
cp .env.example .env

Then open backend/.env and add your real API keys:
- News API key from https://newsapi.org
- Groq API key from https://console.groq.com

### 3. Frontend setup
cd ../frontend
npm install

### 4. Run the app
Terminal 1 (backend):
cd backend
node server.js

Terminal 2 (frontend):
cd frontend
npm run dev

Then open http://localhost:5173 in your browser.

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- AI: Groq LLM (llama-3.1-8b-instant)
- News: NewsAPI
- Fact-checking: RAG pipeline with live news sources

# SpeakMate AI — Free-First AI English Speaking Learning Platform

SpeakMate AI is a responsive, production-ready English speaking web application built for **Hindi-speaking learners** (levels **A1 to C1**), powered by **Next.js (JavaScript)**, **Bootstrap 5**, **SCSS Modules**, **Browser Web Speech API**, and **Google Gemini** (`@google/genai`).

---

## Key Features

1. **AI Speaking Tutor (`/tutor`)**: 8 conversation modes (*Daily Conversation, Beginner English, Free Talk, Job Interview, Office English, Travel English, Grammar Practice, Confidence Building*), voice input + text fallback, SpeechSynthesis voice playback, polite side-by-side corrections, Hindi/Hinglish/English explanations, natural expressions, and vocabulary tips.
2. **Daily Vocabulary (`/vocabulary`)**: 10 practical words per daily set with Hindi meanings, pronunciation guides, audio playback, Save Word / Learned Word tracking, search, and Revision Quiz.
3. **Grammar Lessons (`/grammar`)**: 11 structured topics with English & Hindi explanations, formulas, spoken audio examples, guided practice, and instant-feedback quizzes.
4. **Conversation Practice (`/conversation`)**: 9 real-life roleplay scenarios with an AI partner and an end-of-session performance report.
5. **Interview Practice (`/interview`)**: Category-based mock interviews asking one question at a time with grammar, vocabulary, communication feedback, and polished answer rewrites.
6. **Dashboard & Progress Tracking (`/dashboard`, `/progress`)**: Streaks, speaking minutes, completed lessons, learned vocabulary, Chart.js visualizations, and practice history persisted locally via a modular storage adapter.
7. **Onboarding, Auth, Profile & Settings (`/onboarding`, `/login`, `/signup`, `/profile`, `/settings`)**: Full customization of level, explanation language, daily goals, and TTS voice preferences.

---

## Tech Stack (100% Free-Tier Friendly)

- **Framework**: Next.js 15 App Router (JavaScript, no TypeScript)
- **Styling**: Bootstrap 5 + SCSS Modules (no Tailwind CSS)
- **Icons**: Lucide React
- **Charts**: Chart.js
- **AI SDK**: Official `@google/genai` SDK (server-side API routes only)
- **Voice**: Browser Web Speech API (`SpeechRecognition`) & `SpeechSynthesis` API
- **Persistence**: Modular `localStorage` adapter (ready for future Supabase cloud sync)

---

## Environment Variables

Copy `.env.example` to `.env.local` and add your free Google AI Studio key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.8-flash
GEMINI_MAX_HISTORY_TURNS=10
GEMINI_MAX_INPUT_CHARS=1200
```

- `GEMINI_API_KEY` is used **only** inside server-side route handlers (`src/app/api/*`) and is never exposed to browser JavaScript.
- Supported free-tier friendly models include `gemini-3.8-flash` and `gemini-3.5-flash-lite`.

---

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Verification Commands

```bash
npm test
npm run lint
npm run build
```

---

## Free Deployment on Vercel (Hobby Tier)

1. Push this repository to **GitHub**.
2. Import the repository in **Vercel** (Hobby free plan).
3. Add `GEMINI_API_KEY` and `GEMINI_MODEL` (`gemini-3.8-flash`) under **Project Settings → Environment Variables**.
4. Deploy!

---

## Honest Scope & Notes

- **Browser Voice Support**: Web Speech `SpeechRecognition` works best in Chrome and Edge; unsupported browsers automatically use the built-in text input fallback.
- **Progress Persistence**: MVP persistence uses browser `localStorage` (you can export a JSON backup anytime on `/profile`). Cloud synchronization is not active without configuring Supabase.
- **Gemini Free Tier Limits**: Built-in sliding-window rate limiting and bounded conversation history help protect your free quota, and clear messages appear if rate limits or quotas are reached.

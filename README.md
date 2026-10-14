# ECHO PWA

**Your wiser self, becoming.**

A companion that learns who you are and becomes a wiser reflection of you.
AI brain: Google Gemini, with Groq as automatic backup — and ECHO's own offline engine as the last resort, so it still works with no internet. Runs on any device.

---

## What This Is

ECHO is a Progressive Web App (PWA) built with React + Vite. Memory lives on your device (IndexedDB). Replies are written by Gemini → Groq via a Netlify Function (your API keys never reach the browser); if both are down or you're offline, ECHO's built-in JavaScript engine answers instead.

**Features:**
- Breathing orb that pulses with your mood
- Mood-reactive UI — the entire app shifts colour as ECHO reads your emotional state
- Memory whispers — past thoughts drift faintly in the background
- Personal knowledge graph — builds a living map of who you are
- Pattern detection — finds cycles, contradictions, and growth across time
- Wiser You mode — speaks as your highest self once it knows you well enough
- Private journal — ECHO reads silently and learns from the unfiltered you
- Fully offline — works with no internet connection after first load
- Installable — add to home screen on any phone

---

## Deploy to Netlify in 5 Steps

### Step 1 — Install Node.js
Download from https://nodejs.org (choose LTS version)
Verify: `node --version` should show v18 or higher

### Step 2 — Install dependencies
```bash
cd echo-pwa
npm install
```

### Step 3 — Test locally
```bash
npm run dev
```
Open http://localhost:5173 in your browser. ECHO should load.

### Step 4 — Build for production
```bash
npm run build
```
This creates a `dist/` folder with your app.

### Step 5 — Deploy to Netlify

**Option A — Drag and drop (easiest):**
1. Go to https://netlify.com and sign up (free)
2. From your dashboard, drag the `dist/` folder onto the page
3. Netlify gives you a live URL instantly

**Option B — Connect GitHub (recommended for updates):**
1. Push this project to a GitHub repository
2. Go to https://netlify.com → New Site → Import from Git
3. Select your repository
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Click Deploy

Your app is live. Share the URL with anyone — they can install ECHO on their phone from the browser.

---

## Install ECHO on Your Phone

Once deployed:

**iPhone (Safari):**
1. Open your Netlify URL in Safari
2. Tap the Share button (box with arrow)
3. Tap "Add to Home Screen"
4. Tap Add

**Android (Chrome):**
1. Open your Netlify URL in Chrome
2. Tap the three dots menu
3. Tap "Add to Home screen" or "Install app"
4. Tap Install

ECHO will appear as an app on your home screen and works offline.

---

## Project Structure

```
echo-pwa/
├── index.html              — app shell
├── vite.config.js          — build config + PWA plugin
├── package.json            — dependencies
├── netlify.toml            — Netlify config
├── public/
│   └── icons/              — app icons (192px, 512px)
└── src/
    ├── main.jsx            — React entry point
    ├── App.jsx             — full application
    ├── theme.js            — mood palettes + fonts
    ├── components/
    │   └── BreathingOrb.jsx — canvas-based living orb
    └── engine/
        ├── storage.js      — IndexedDB persistence
        ├── parser.js       — lexical emotion/intent parser
        ├── graph.js        — personal knowledge graph
        ├── metacognition.js — self-awareness + profile extraction
        └── responder.js    — response constructor + wiser self
```

---

## The ECHO Engine

ECHO's AI is built entirely from scratch — no OpenAI, no Claude API, no external services.

**Module 1 — Lexical Parser:** reads your words, extracts emotion from 8 families, intent from 6 types, urgency, depth, and key concepts.

**Module 2 — Knowledge Graph:** builds a living map of everything you share. Concepts become nodes. Co-occurrences become edges. Grows every conversation.

**Module 3 — Pattern Reasoner:** finds recurring emotions, goal-fear contradictions, growth over time, avoidance patterns.

**Module 4 — Response Constructor:** builds personalised responses from your profile + curated wisdom library. References your specific values, fears, and goals.

**Module 5 — Metacognition:** knows what it knows and what it doesn't. Tracks gaps. Builds a confidence score. Gets more precise as it learns more.

**Module 6 — Wiser Self Engine:** models your highest self and speaks back with specificity — your values, your contradictions, your patterns.

---

## Privacy

Everything stays on your device. ECHO uses IndexedDB (browser storage) — no account, no server, no data transmission. Your memories are yours alone.

---

Built with love. ECHO Engine v1.0.

---

## AI Setup (Gemini + Groq)

```
send() → /.netlify/functions/chat → Gemini → (fails / times out / rate-limited) → Groq
                  └─ offline or both down → built-in offline engine (brain.js / responder.js)
```

1. Get keys: Gemini → https://aistudio.google.com/apikey · Groq → https://console.groq.com/keys
2. Netlify → Site settings → Environment variables → add `GEMINI_API_KEY` and `GROQ_API_KEY`
   (optional: `GEMINI_MODEL`, `GROQ_MODEL`, `ALLOWED_ORIGIN` — see `.env.example`)
3. Deploy from Git (Option B above). **Drag-and-drop of `dist/` does not deploy functions.**
4. Local test: `npm i -g netlify-cli && netlify dev` (plain `npm run dev` runs offline-engine only).

Notes: the persona lives in `netlify/functions/chat.js`; the per-user context (profile + session memory) is built in `src/engine/aiPrompt.js`. Crisis wording (parser `urgency`) is never sent to an LLM. Users can switch the AI off in the menu. Free tiers are rate-limited and Google may use free-tier content to improve its products — mention this in your privacy notice.

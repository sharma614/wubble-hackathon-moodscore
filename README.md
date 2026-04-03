# MoodScore 🎵

> AI-powered video soundtrack generator — paste a YouTube URL, describe the vibe, get a royalty-free track instantly.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Wubble AI](https://img.shields.io/badge/Powered%20by-Wubble%20AI-8b5cf6)](https://wubble.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](./LICENSE)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)

**Repo name:** `moodscore` (local project)

---

## 📸 Screenshots

| Hero | Mood Selector | Track Player |
|------|--------------|--------------|
| ![Hero](./screenshots/hero.png) | ![Mood](./screenshots/mood-selector.png) | ![Player](./screenshots/track-player.png) |

---

## ✨ Features

- 🎬 **YouTube URL input** — paste any YouTube link and MoodScore auto-loads a thumbnail preview
- 📁 **Video upload** — drag & drop or browse MP4/MOV/WebM files
- 🎭 **12 mood tags** — Calm, Epic, Inspirational, Happy, Melancholic, Energetic, Cinematic, Dark, Chill, Dreamy, Jazz, Futuristic
- 🎛️ **Fine-tune controls** — genre picker, tempo (slow/medium/fast), energy (low/medium/high), duration slider (15–120s)
- ⚡ **One-click generation** — Wubble AI composes an original, royalty-free track in seconds
- 🎧 **Built-in player** — animated equalizer, seek bar, volume control, 10s skip
- 💾 **One-click download** — instantly download as MP3
- 🌙 **Dark theme** — premium glassmorphism UI with animated orbs and waveforms
- 🔌 **Demo mode** — works without an API key (plays a sample track)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Language | TypeScript |
| Music AI | [Wubble API](https://wubble.ai) |
| Deployment | [Vercel](https://vercel.com) |
| Fonts | [Google Fonts — Inter, Space Grotesk](https://fonts.google.com) |

---

## 📁 Folder Structure

```
wubble-hackathon-moodscore/
├── src/
│   ├── app/
│   │   ├── globals.css           # Global styles + design tokens
│   │   ├── layout.tsx            # Root layout + metadata
│   │   ├── page.tsx              # Main application page
│   │   └── api/
│   │       ├── generate-music/
│   │       │   └── route.ts      # POST: start generation | GET: poll status
│   │       └── extract-mood/
│   │           └── route.ts      # POST: suggest moods from video
│   ├── components/
│   │   ├── Header.tsx            # Sticky animated header
│   │   ├── VideoInput.tsx        # YouTube URL + file upload input
│   │   ├── MoodSelector.tsx      # Mood tags, genre, tempo, energy, duration
│   │   ├── GenerateButton.tsx    # Animated generate CTA
│   │   ├── TrackPlayer.tsx       # Full audio player with download
│   │   └── HowItWorks.tsx        # Feature explainer section
│   └── lib/
│       ├── wubble.ts             # Wubble API client + types
│       └── utils.ts              # YouTube URL parsing, formatters
├── public/                       # Static assets
├── screenshots/                  # App screenshots for README
├── .env.example                  # Environment variable template
├── .env.local                    # Your local secrets (gitignored)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── DEPLOYMENT.md                 # Vercel deployment guide
├── LICENSE                       # MIT License
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm
- A [Wubble API key](https://wubble.ai) _(optional — app runs in demo mode without one)_

### 1. Already cloned — you're here! 🎉

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local  # Optional for live API
```

**Demo mode works out-of-the-box — no key needed!** Add `WUBBLE_API_KEY` to `.env.local` for real generations.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app should be live. 🎉

> **No API key?** The app runs in **Demo Mode** by default and plays a sample track. Add your `WUBBLE_API_KEY` to unlock live generation.

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `WUBBLE_API_KEY` | ✅ Recommended | Your Wubble AI API key for music generation |
| `WUBBLE_API_BASE_URL` | ❌ Optional | Override the Wubble API base URL (default: `https://api.wubble.ai/v1`) |
| `NEXT_PUBLIC_APP_URL` | ❌ Optional | Your deployed app URL (e.g. `https://moodscore.vercel.app`) |

---

## 🌐 Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for full step-by-step Vercel deployment instructions.

### Quick deploy

**Ready for Vercel deployment** — connect your GitHub repo and add `WUBBLE_API_KEY` env var.

---

## 🗺 Roadmap

✅ **Core app complete** — fully functional demo mode with:
- YouTube + upload support
- Mood selector + controls
- Generation (demo/real w/ key)
- Player + download + history + share
- Responsive glassmorphism UI

**Optional enhancements:**
- [ ] Auto-mood from video (YT API + LLM)
- [ ] FFmpeg.wasm video merge

---

## 🧑‍💻 Wubble API Integration

MoodScore integrates with the [Wubble AI](https://wubble.ai) music generation API:

```typescript
// POST /api/generate-music
{
  "userDescription": "Uplifting sunrise timelapse…",
  "selectedMood": "inspirational",
  "genre": "Orchestral",
  "tempo": "medium",
  "energy": "high",
  "duration": 30
}
```

The API client is in [`src/lib/wubble.ts`](./src/lib/wubble.ts). Update the endpoint/auth headers to match your Wubble API documentation.

---

## 📄 License

MIT © 2025 — see [LICENSE](./LICENSE)

---

## 🙏 Acknowledgements

- [Wubble AI](https://wubble.ai) — royalty-free AI music generation
- [Next.js](https://nextjs.org) — React framework
- [Tailwind CSS](https://tailwindcss.com) — utility-first CSS
- [SoundHelix](https://www.soundhelix.com) — demo audio samples

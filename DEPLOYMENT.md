# Deploying MoodScore to Vercel

This guide walks you through deploying MoodScore to Vercel in under 5 minutes.

---

## Prerequisites

- A [Vercel account](https://vercel.com/signup) (free tier works)
- Your [Wubble API key](https://wubble.ai)
- The MoodScore repository pushed to GitHub / GitLab / Bitbucket

---

## Option A — Deploy via Vercel Dashboard (Recommended)

### Step 1: Push your code to GitHub

```bash
cd wubble-hackathon-moodscore
git init
git add .
git commit -m "feat: initial MoodScore app"
git remote add origin https://github.com/YOUR_USERNAME/wubble-hackathon-moodscore.git
git push -u origin main
```

### Step 2: Import the repository

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your `wubble-hackathon-moodscore` repository
4. Click **Import**

### Step 3: Configure the project

Vercel will auto-detect Next.js. Verify these settings:

| Setting | Value |
|---------|-------|
| Framework Preset | **Next.js** |
| Root Directory | `./` (or leave blank) |
| Build Command | `npm run build` |
| Output Directory | `.next` |
| Install Command | `npm install` |

### Step 4: Add environment variables

In the **"Environment Variables"** section before deploying:

| Name | Value |
|------|-------|
| `WUBBLE_API_KEY` | `your_wubble_api_key_here` |
| `WUBBLE_API_BASE_URL` | `https://api.wubble.ai/v1` _(optional)_ |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` _(optional)_ |

### Step 5: Deploy

Click **"Deploy"** — Vercel builds and deploys automatically. In ~2 minutes, your app will be live at `https://your-project.vercel.app`.

---

## Option B — Deploy via Vercel CLI

### Step 1: Install the Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login

```bash
vercel login
```

### Step 3: Deploy

From the project root:

```bash
vercel
```

Follow the prompts. For production deployment:

```bash
vercel --prod
```

### Step 4: Add environment variables via CLI

```bash
vercel env add WUBBLE_API_KEY
# Paste your key when prompted
# Select: Production, Preview, Development
```

Or use the Vercel dashboard to manage env vars after initial deployment.

---

## Option C — One-Click Deploy

Click the button below (update the `repository-url` with your GitHub URL):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/wubble-hackathon-moodscore&env=WUBBLE_API_KEY&envDescription=Your+Wubble+AI+API+key&project-name=moodscore&repo-name=wubble-hackathon-moodscore)

---

## Post-Deployment Checklist

- [ ] Visit your deployment URL and verify the UI loads
- [ ] Test the demo mode (no API key needed) — click "Generate Soundtrack"
- [ ] Verify the player appears and audio plays
- [ ] Test with a real YouTube URL (e.g. `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
- [ ] Confirm your `WUBBLE_API_KEY` env var is set in Vercel → Settings → Environment Variables
- [ ] Test end-to-end live generation with the real Wubble API

---

## Custom Domain

1. In Vercel, go to your project → **Settings → Domains**
2. Add your domain (e.g. `moodscore.yourdomain.com`)
3. Update DNS with the provided CNAME or A records
4. SSL is provisioned automatically

---

## Redeploying After Changes

Any push to your `main` branch will trigger an automatic redeploy. For preview deployments, push to any other branch — Vercel creates a unique preview URL for every PR.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check `npm run build` locally first |
| "WUBBLE_API_KEY not configured" error | Add the env var in Vercel dashboard → Settings → Environment Variables |
| API routes return 500 | Check Vercel function logs: Dashboard → Deployments → Functions tab |
| Audio doesn't play | Verify the Wubble API returns a valid `audio_url` in the response |
| Page doesn't load | Check build output in Vercel dashboard for TypeScript errors |

---

## Environment Variables Reference

```env
# Required for live music generation
WUBBLE_API_KEY=wbl_xxxxxxxxxxxxx

# Optional — override the Wubble API base URL
WUBBLE_API_BASE_URL=https://api.wubble.ai/v1

# Optional — your deployed URL (for OG tags etc)
NEXT_PUBLIC_APP_URL=https://moodscore.vercel.app
```

---

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Wubble AI](https://wubble.ai)

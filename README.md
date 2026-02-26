# Kyle's Gym Dashboard

A premium fitness tracking dashboard built with Next.js 14, featuring a sleek dark athletic aesthetic with electric blue accents.

## Features

- **Dashboard** — Stat cards (sessions, volume, streak, weekly), recent sessions list, volume-over-time area chart
- **Session Detail** — Full exercise breakdown with per-set weight/reps/volume, top-set highlighting
- **Progress** — Personal bests strip + per-exercise line charts showing weight progression over time
- Dark theme with electric blue + neon green accents, grid background, glow effects

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/) for data visualisation
- [shadcn/ui](https://ui.shadcn.com/) components
- [Lucide React](https://lucide.dev/) icons

## Data

All workout data lives in `data/workouts.json`. To log a new session, append an object to the `sessions` array following the schema:

```json
{
  "id": "YYYY-MM-DD-type",
  "date": "YYYY-MM-DD",
  "type": "Push | Pull | Legs | Upper | Lower | Full Body | Cardio",
  "label": "Human-readable label",
  "duration_seconds": 3600,
  "volume_kg": 5000,
  "exercises": [
    {
      "name": "Exercise Name",
      "sets": [
        { "set": 1, "weight_kg": 80, "reps": 8 }
      ]
    }
  ]
}
```

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

### Option 1 — Vercel CLI (fastest)

```bash
npm i -g vercel
vercel
```

Follow the prompts — Vercel auto-detects Next.js, no config needed.

### Option 2 — Vercel Dashboard

1. Push this repo to GitHub / GitLab / Bitbucket
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Click **Deploy** — zero config required

### Build settings (auto-detected)

| Setting | Value |
|---|---|
| Framework | Next.js |
| Build command | `npm run build` |
| Output directory | `.next` |
| Install command | `npm install` |

No environment variables are required — data is read from the JSON file at build time.

## Project Structure

```
gym-dashboard/
├── app/
│   ├── layout.tsx          # Root layout with Navigation
│   ├── page.tsx            # Dashboard (/)
│   ├── session/[id]/
│   │   └── page.tsx        # Session detail (/session/[id])
│   └── progress/
│       └── page.tsx        # Progress charts (/progress)
├── components/
│   ├── Navigation.tsx      # Top nav bar
│   ├── StatCard.tsx        # Metric card with icon + glow
│   ├── VolumeChart.tsx     # Area chart (Recharts)
│   ├── RecentSessions.tsx  # Session list
│   └── ExerciseProgressChart.tsx  # Per-exercise line chart
├── data/
│   └── workouts.json       # ← Add sessions here
├── lib/
│   └── workouts.ts         # Data access + utility functions
└── types/
    └── workout.ts          # TypeScript types
```

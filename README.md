# Water Cooler

AI-powered conversation starters that help you build deeper relationships with colleagues.

Water Cooler sends you personalized weekly email digests with culturally-aware conversation starters about each of your colleagues. It searches for real-time events relevant to their interests and explains them using analogies from your own cultural background.

## Quick Start

```bash
git clone https://github.com/your-username/water-cooler.git
cd water-cooler
npm install
cp .env.example .env.local
# Fill in your API keys in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to get started.

## API Keys You Need

| Service | Purpose | Free Tier | Get It |
|---------|---------|-----------|--------|
| **Resend** | Sending digest emails | 100 emails/day | [resend.com/api-keys](https://resend.com/api-keys) |
| **Gemini** | AI-generated conversation starters | 15 RPM / 1,500 RPD | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| **SerpAPI** | Real-time event search | 100 searches/month | [serpapi.com/dashboard](https://serpapi.com/dashboard) |

You also need to set a `CRON_SECRET` (any random string) to protect the digest endpoint.

## How It Works

1. **Register** — Tell it where you grew up and live now
2. **Add colleagues** — Their background, interests, hobbies, sports preferences
3. **Get digests** — 3x/week emails with conversation starters per colleague

Each digest email contains:
- **Color-coded event cards** (sports, food, festivals, news, hobbies)
- **Cultural bridge explanations** — events explained using your own background as reference
- **Conversation starters** — warm, natural openers with follow-up questions
- **Edit/Remove links** — manage colleagues directly from the email

## Architecture

```
Next.js App Router
├── SQLite (better-sqlite3) — zero-config database
├── Resend — email delivery
├── SerpAPI — real-time event search
├── Gemini — AI conversation generation
└── node-cron — digest scheduling
```

The digest pipeline per user:
1. Build 2-4 search queries per colleague (based on interests + location)
2. Execute SerpAPI searches (500ms rate limiting)
3. Send all profiles + search results to Gemini
4. Gemini generates conversation starters (strict JSON)
5. Build HTML email with inline CSS
6. Send via Resend

**Three-tier fallback**: SerpAPI fails → Gemini uses profile data only. Gemini fails → basic profile-based starters. Resend fails → log error, continue to next user.

## Configuration

See [.env.example](.env.example) for all options. Key settings:

| Variable | Default | Description |
|----------|---------|-------------|
| `DIGEST_SCHEDULE` | `0 20 * * 0,2,4` | Cron expression (Sun/Tue/Thu 8PM) |
| `DIGEST_TIMEZONE` | `America/New_York` | Timezone for cron |
| `GEMINI_MODEL` | `gemini-2.0-flash` | Which Gemini model to use |
| `BASE_URL` | `http://localhost:3000` | Used for links in emails |

## Project Structure

```
src/
├── app/                    # Next.js pages + API routes
│   ├── api/
│   │   ├── register/       # User registration
│   │   ├── colleagues/     # CRUD + lookup
│   │   ├── digest/         # Cron + trigger endpoints
│   │   ├── feedback/       # Digest feedback
│   │   └── limit-increase/ # Connection limit requests
│   ├── register/           # Registration form
│   ├── colleagues/         # Add/Edit/Remove forms
│   ├── feedback/           # Feedback form
│   └── request-limit/      # Limit increase form
├── lib/
│   ├── db.ts               # SQLite singleton
│   ├── auth.ts             # Token + ownership validation
│   ├── digest/             # The core digest pipeline
│   │   ├── orchestrator.ts # Loop all users
│   │   ├── per-user.ts     # Single-user pipeline
│   │   ├── search-queries.ts
│   │   ├── serp.ts         # SerpAPI client
│   │   ├── gemini.ts       # Gemini client + fallback
│   │   └── prompt.ts       # Full LLM prompt
│   └── email/
│       ├── resend.ts       # Email sender
│       └── digest-template.ts # HTML email builder
├── components/             # Reusable React components
└── types/                  # TypeScript interfaces
```

## Deployment

### Self-hosted (recommended)
Any server with Node.js 18+. The custom `server.ts` handles both Next.js and cron scheduling.

```bash
npm run build
npm start
```

### Vercel / Serverless
Works for the web app, but you'll need an external cron service (e.g., cron-job.org) to hit `GET /api/digest/cron` with your `CRON_SECRET` as a Bearer token.

## License

MIT

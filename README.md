<div align="center">

# Water Cooler

### Build Deeper Relationships with Your Colleagues

Water Cooler sends you personalized, culturally relevant conversation starters about your colleagues — so you always have something meaningful to talk about.

<img src="assets/screenshot.png" alt="Water Cooler Weekly Digest" width="520">

<br/>

### Demo

<video src="assets/demo.mp4" width="520" controls></video>

<br/>

**[Quick Start](#-quick-start)** · **[How It Works](#-how-it-works)** · **[Self-Host Guide](#-self-host-guide)** · **[Architecture](#-architecture)**

</div>

---

## The Problem

Work relationships matter, but keeping up with what's happening in your colleagues' worlds is hard. You forget that your teammate is from Chennai and there's a major festival this week. You miss that your manager's favorite cricket team just made the playoffs. Small talk stays small.

## The Solution

Water Cooler monitors real-time events — cultural festivals, sports results, local happenings, food trends — and connects them to what it knows about each of your colleagues. Three times a week, you get a curated email digest with:

- **What's happening** — A relevant event tied to your colleague's background
- **Why it matters to them** — Context that explains the personal connection
- **A conversation starter** — A natural, non-awkward way to bring it up
- **Follow-up questions** — To keep the conversation going

### Example

> **Colleague**: Priya (grew up in Jaipur, loves cricket, vegetarian foodie)
>
> **Event**: Rajasthan Royals just beat Chennai Super Kings in a last-over thriller
>
> **Why it matters**: Priya grew up in Jaipur — the Royals are her home team. This was their biggest win of the season.
>
> **Try saying**: "Did you catch the Royals game last night? That last over was insane."
>
> **Follow-ups**: "Have you been following them all season?" · "Did you ever go to games at SMS Stadium growing up?"

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or higher
- API keys (all have free tiers — see below)

### 1. Clone & Install

```bash
git clone https://github.com/pmayushkumar/WaterCooler.git
cd WaterCooler
npm install
```

### 2. Get Your API Keys

| Service | What it does | Free tier | Sign up |
|---------|-------------|-----------|---------|
| **Resend** | Sends the digest emails | 100 emails/day | [resend.com](https://resend.com) |
| **Gemini** | Generates conversation starters | 15 requests/min | [aistudio.google.com](https://aistudio.google.com/apikey) |
| **SerpAPI** | Finds real-time events | 100 searches/month | [serpapi.com](https://serpapi.com) |

### 3. Configure

```bash
cp .env.example .env.local
```

Edit `.env.local` with your keys:

```env
RESEND_API_KEY=re_xxxxxxxxxxxx
GEMINI_API_KEY=AIzaxxxxxxxxxxxxxxx
SERPAPI_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
CRON_SECRET=any-random-string-you-choose
FROM_EMAIL=Your Name <you@yourdomain.com>
BASE_URL=http://localhost:3000
```

> **Note**: For Resend, you'll need to [verify a sending domain](https://resend.com/docs/dashboard/domains/introduction). For quick testing, use `onboarding@resend.dev` as `FROM_EMAIL` (only delivers to your Resend account email).

### 4. Run

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** — register, add a colleague, and you'll get your first digest email within minutes.

---

## 🔧 Make It Your Own

This is designed to be forked and customized. Here are the things you'll probably want to change:

### Change the digest schedule

Edit `DIGEST_SCHEDULE` in `.env.local`. It's a standard cron expression:

```env
DIGEST_SCHEDULE=0 20 * * 0,2,4    # Sun/Tue/Thu at 8 PM (default)
DIGEST_SCHEDULE=0 9 * * 1          # Monday at 9 AM
DIGEST_SCHEDULE=0 8 * * *          # Every day at 8 AM
DIGEST_TIMEZONE=America/New_York   # Your timezone
```

### Change the AI model

```env
GEMINI_MODEL=gemini-2.0-flash      # Fast and cheap (default)
GEMINI_MODEL=gemini-2.5-pro        # Better quality, slower
```

### Change the AI personality

The full prompt lives in [`src/lib/digest/prompt.ts`](src/lib/digest/prompt.ts). The AI acts as a "Relationship Architect" — you can change its tone, the types of events it prioritizes, or the safety exclusion list.

### Change the email design

The HTML email template is in [`src/lib/email/digest-template.ts`](src/lib/email/digest-template.ts). It uses inline CSS (required for email clients). The color scheme for category badges:

| Category | Color | Hex |
|----------|-------|-----|
| Sports | Green | `#4CAF50` |
| Food | Orange | `#FF9800` |
| Festival | Purple | `#9C27B0` |
| News | Blue | `#2196F3` |
| Hobby | Teal | `#009688` |

### Change the connection limit

The default max is 10 colleagues per user. Change it in the `app_config` table in SQLite, or edit the seed value in [`src/lib/schema.sql`](src/lib/schema.sql).

---

## 📖 How It Works

```
Register → Add Colleagues → Get Weekly Digests → Have Better Conversations
```

**1. You create a profile** — where you grew up, where you live now. This is your cultural reference frame.

**2. You add colleagues** — their background, interests, hobbies, and anything personal you know about them (favorite food, recent trips, sports teams).

**3. Every Sun/Tue/Thu at 8 PM**, the digest pipeline runs:

```
For each user:
  For each colleague:
    → Build search queries from their profile
    → Search SerpAPI for real-time events
  → Send everything to Gemini
  → Gemini generates conversation starters (with cultural bridges)
  → Build HTML email
  → Send via Resend
```

**4. You get an email** with 1–3 conversation starters per colleague, each with:
- A **category badge** (sports, food, festival, news, hobby)
- **"What is this?"** — the event explained using *your* cultural background
- **"Why it matters"** — why this is relevant to *this* colleague
- **"Try saying"** — a warm, natural conversation opener
- **Follow-up questions** — to keep the conversation going

**The cultural bridge is the key feature.** If your colleague follows Russian Maslenitsa and you grew up in India, it compares it to Holi — both celebrate winter's end with food and revelry. If they follow baseball and you grew up watching cricket, it compares Shohei Ohtani to Sachin Tendulkar.

---

## 🏗 Architecture

```
Next.js (App Router)
├── SQLite (better-sqlite3)     — zero-config, single-file database
├── Resend                      — email delivery
├── Google Gemini               — AI conversation generation
├── SerpAPI                     — real-time event search
└── node-cron                   — digest scheduling
```

### Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 16 (App Router) | Full-stack React with API routes |
| **Database** | SQLite via better-sqlite3 | Zero config, no external DB needed |
| **AI** | Google Gemini | Best free tier for generative AI |
| **Search** | SerpAPI | Reliable Google search API |
| **Email** | Resend | Simple API, generous free tier |
| **Scheduling** | node-cron | In-process cron, no external service |
| **Styling** | Tailwind CSS | Utility-first, fast to customize |

### Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── register/           # POST — create user
│   │   ├── colleagues/         # CRUD + email lookup
│   │   ├── digest/             # Cron endpoint + single-user trigger
│   │   ├── feedback/           # POST — save digest feedback
│   │   └── limit-increase/     # POST — request more connections
│   ├── register/               # Registration form
│   ├── colleagues/             # Add / Edit / Remove colleague
│   ├── feedback/               # Digest feedback form
│   └── request-limit/          # Limit increase request form
├── lib/
│   ├── db.ts                   # SQLite singleton (survives hot-reload)
│   ├── auth.ts                 # Token + ownership validation
│   ├── digest/
│   │   ├── orchestrator.ts     # Loop all users, isolate errors
│   │   ├── per-user.ts         # Full pipeline for one user
│   │   ├── search-queries.ts   # Build SerpAPI queries from profiles
│   │   ├── serp.ts             # SerpAPI client (500ms rate limiting)
│   │   ├── gemini.ts           # Gemini client + fallback logic
│   │   └── prompt.ts           # The full AI prompt
│   └── email/
│       ├── resend.ts           # Resend wrapper
│       └── digest-template.ts  # HTML email with inline CSS
├── components/                 # React form components
└── types/                      # TypeScript interfaces
```

### Database Schema

6 tables in a single SQLite file (`data/water-cooler.db`):

| Table | Purpose |
|-------|---------|
| `users` | Registered users with cultural background |
| `colleagues` | Colleagues with interests and preferences |
| `app_config` | Configurable settings (connection limit) |
| `feedback` | Digest feedback ratings |
| `limit_increase_requests` | Requests for more connections |
| `digest_log` | Audit trail of every email sent |

### Resilience

The pipeline has three-tier fallback:

1. **SerpAPI fails** → Gemini generates starters from profile data alone (no real-time events)
2. **Gemini fails** → Basic profile-based conversation starters (no AI)
3. **Resend fails** → Error logged, continues to next user

Each user's digest is isolated — if one user's data causes an error, everyone else still gets their email.

---

## 🚢 Deployment

### Self-Hosted (Recommended)

Any server with Node.js 18+. The custom `server.ts` handles both the web app and cron scheduling in one process.

```bash
npm run build
npm start
```

### Vercel / Serverless

Deploy the Next.js app normally. For digest scheduling, use an external cron service (e.g., [cron-job.org](https://cron-job.org)) to hit:

```
GET https://your-app.vercel.app/api/digest/cron
Authorization: Bearer YOUR_CRON_SECRET
```

---

## 🔒 Privacy & Security

- **Token-based auth** on all edit/delete operations
- **Ownership validation** — users can only modify their own colleagues
- **XSS protection** — all user content is HTML-escaped in emails
- **No data sharing** between users
- **SQLite database** stays on your machine — no cloud database needed
- **API keys** stored in `.env.local` (gitignored, never committed)

---

## 🤝 Contributing

Contributions welcome! Some ideas:

- **Email providers** — Add SendGrid, Mailgun, or AWS SES as alternatives to Resend
- **Search providers** — Add Brave Search or Bing as alternatives to SerpAPI
- **AI models** — Add OpenAI, Claude, or Llama support
- **Notification channels** — Slack or Teams integration instead of email
- **UI improvements** — Dark mode, dashboard for managing colleagues

---

## 📄 License

MIT — do whatever you want with it.

---

<div align="center">

Built by [Ayush Kumar](https://github.com/pmayushkumar)

Because the best work relationships start with better conversations.

</div>

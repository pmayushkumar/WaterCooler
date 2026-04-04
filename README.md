<div align="center">

# Water Cooler

### AI-Powered Relationship Building for Working Professionals

Water Cooler sends you personalized, culturally relevant conversation starters about your colleagues — so you always have something meaningful to talk about.

---

</div>

## The Problem

Work relationships matter, but keeping up with what's happening in your colleagues' worlds is hard. You forget that your teammate is from Chennai and there's a major festival this week. You miss that your manager's favorite cricket team just made the playoffs. Small talk stays small.

## The Solution

Water Cooler monitors real-time events — cultural festivals, sports results, local happenings, food trends — and connects them to what it knows about each of your colleagues. Three times a week, you get a curated email digest with:

- **What's happening** — A relevant event tied to your colleague's background
- **Why it matters to them** — Context that explains the personal connection
- **A conversation starter** — A natural, non-awkward way to bring it up
- **Follow-up questions** — To keep the conversation going

## How It Works

1. **Register** — Tell Water Cooler about yourself (where you grew up, your interests)
2. **Add Colleagues** — Add the people you want to build better relationships with — their background, hobbies, interests
3. **Get Digests** — Receive email digests (Sun/Tue/Thu) with personalized conversation starters for each colleague
4. **Have Better Conversations** — Walk into Monday's standup with something real to talk about

## Example

> **Colleague**: Priya (grew up in Jaipur, loves cricket, vegetarian foodie)
>
> **Event**: Rajasthan Royals just beat Chennai Super Kings in a last-over thriller
>
> **Why it matters**: Priya grew up in Jaipur — the Royals are her home team. This was their biggest win of the season.
>
> **Conversation starter**: "Did you catch the Royals game last night? That last over was insane."
>
> **Follow-ups**: "Have you been following them all season?" / "Did you ever go to games at SMS Stadium growing up?"

## Architecture

Built entirely as a serverless workflow system — no traditional backend.

- **10 n8n workflows** handling registration, colleague management, digest generation, and feedback
- **Google Sheets** as the data layer
- **Gemini Pro** for generating culturally aware, personalized conversation starters
- **SerpAPI** for real-time event discovery (sports, festivals, local news, food trends)
- **Gmail** for digest delivery
- **Token-based auth** with per-user ownership validation

## Key Design Decisions

- **No-code backend**: Entire product runs on n8n workflows + Google Sheets. Zero infrastructure to manage, easy to iterate.
- **Sub-workflow isolation**: Each user's digest generates independently. If one user's data causes an error, everyone else still gets their email.
- **Cultural depth**: The AI doesn't just find events — it understands *why* something matters to a specific person based on where they grew up, their family background, and their interests.
- **Rate limiting**: SerpAPI calls are throttled (500ms spacing) to stay within API limits while still generating rich, multi-source content.
- **Per-user connection limits**: Configurable cap per user to manage API costs during early growth.

## Privacy & Security

- Token-based authentication on all edit/delete operations
- Ownership validation — users can only modify their own data
- XSS protection on all user-generated content
- No data sharing between users

## Status

Active and in use. 10/10 workflows deployed and tested.

## Contact

Built by [Ayush Kumar](https://github.com/pmayushkumar) — questions or feedback welcome.

---

<div align="center">

Because the best work relationships start with better conversations.

</div>
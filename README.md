# speakers.solana.com — BP25 Speaker Portal

A focused **Airtable-driven** microsite for Breakpoint speakers. Private-but-shareable pages (no login) via **HMAC-signed links**, fresh data from **Airtable** (server-side only), and convenient **ICS** calendar feeds.

> **Caveat:** This repo is a starter and a guide. **Change anything you see fit** to meet reality as you build.

---

## Tech Stack

- **Next.js (App Router, TypeScript)** — deployed on Vercel
- **Tailwind CSS + shadcn/ui (Radix)** — accessible UI primitives
- **Airtable REST API** — primary data source
- **Zod** — runtime validation of Airtable responses
- **TanStack Table** (+ `@tanstack/react-virtual`) — fast agenda tables
- **Luxon** — timezone-safe formatting
- **ICS** — generate calendar files server-side
- Optional: **Sentry** (observability), **Upstash Ratelimit** (API protection)

---

## Getting Started

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### 1) Install & Run

```bash
pnpm install
pnpm dev
# or: npm run dev / yarn dev / bun dev
```

Open http://localhost:3000.

### 2) Environment

Create `.env.local`:

```bash
AIRTABLE_PAT=pat_XXXXXXXXXXXX
AIRTABLE_BASE=app_XXXXXXXXXXXX
AIRTABLE_TABLE_SPEAKERS=Speakers
AIRTABLE_TABLE_SESSIONS=Sessions

SITE_SECRET=change_me_hmac_key
VENUE_TZ=Asia/Dubai
```

Never expose `AIRTABLE_PAT` to the client. All Airtable reads happen server-side.

### 3) shadcn/ui

shadcn is initialized. Add the primitives you need as you implement pages:

```bash
npx shadcn add button input badge card table dialog sheet tabs dropdown-menu toast separator alert avatar tooltip
```

## What’s Already Decided (Scope)

No login. Access via signed links: `/s/[slug]?key=<mac.exp>`

Airtable views as source of truth (e.g., Onboarded Speakers > For Web, Agenda > For Web)

### Pages

- `/s/[slug]` — speaker portal (profile, sessions, ticket, shareables, highlights)
- `/schedule` — agenda with Day (1–3), Stage (A/B), Type filters

### APIs

- `/api/speakers/[slug]` — server data for speaker page
- `/api/sessions` — list/filter sessions for agenda
- `/api/ics/session/[id]`, `/api/ics/speaker/[slug]`, `/api/ics/event` — calendar feeds
- `/api/revalidate` — Airtable Automation webhook (on-demand ISR)

Robots: Disallow `/s/*` and `/api/ics/*` (private-ish but shareable)

## Folder Structure (suggested)

```
app/
  s/[slug]/page.tsx
  schedule/page.tsx
  api/
    speakers/[slug]/route.ts
    sessions/route.ts
    ics/
      session/[id]/route.ts
      speaker/[slug]/route.ts
      event/route.ts
    revalidate/route.ts
  robots.ts
  globals.css

lib/
  airtable/
    client.ts       # fetch wrapper (server-only), short ISR
    zod.ts          # Speaker/Session schemas
    speakers.ts     # getSpeakerBySlug(...)
    sessions.ts     # listSessions(...filters)
  links/
    sign.ts         # HMAC sign/verify helpers
  time/
    tz.ts           # Luxon helpers (venue tz, user tz)
  ics/
    build.ts        # util to generate ICS content

components/
  speaker-card.tsx
  ticket-card.tsx
  schedule-table.tsx
  session-cell.tsx
  share-menu.tsx
  highlights-gallery.tsx

middleware.ts       # optional: extra headers for /s/*
```

## Key Implementation Notes

### Signed Links (no login)

key = base64url(HMAC_SHA256(slug + "." + exp, SITE_SECRET)).exp

Validate key on `/s/[slug]` and any JSON endpoints you expose to that page.

Rotate by shortening exp or changing SITE_SECRET (or store a per-speaker seed in Airtable if you want per-link revocation).

### Airtable Reads

Query filtered views (e.g., For Web) so only confirmed, public-safe fields flow to the UI.

Prefer denormalized fields for speed (e.g., SessionsExpanded JSON via Automation), otherwise join with a second request and cache.

### Caching & Freshness

Use fetch(..., { next: { revalidate: 60, tags: ["agenda","speaker:slug"] } })

Have Airtable Automation → POST to `/api/revalidate` on record changes; revalidate tag(s) for the touched speaker/day.

### Calendars (reduce notification spam)

Default to ICS subscribe buttons (silent updates).

Keep Luma “Add to calendar” secondary if needed.

### Privacy & Robots

Add noindex meta on `/s/[slug]`.

robots.ts disallows `/s/` and `/api/ics/`.

### Basic Hardening

Rate-limit `/api/*` (especially ICS) if scraped.

Never pass Airtable secrets to the browser.

Validate all external data with Zod before render.

## Developer TODO (shortlist)

- Implement lib/links/sign.ts and guard /s/[slug]
- Implement Airtable fetchers + Zod schemas
- Build SpeakerCard, TicketCard, ScheduleTable (TanStack Table + filters)
- Add ICS routes (session, speaker, event)
- Wire /api/revalidate and Airtable Automation
- Add noindex + robots rules
- Add basic rate limiting and Sentry (optional)
- Smoke test: 1 speaker, 2 sessions, ICS import in Apple/Google/Outlook

## Scripts

```bash
pnpm dev        # run local server
pnpm build      # production build
pnpm start      # run production
pnpm lint       # lint
```

## Deploy on Vercel

- Create project speakers-solana-com
- Set all Environment Variables
- Assign custom domain speakers.solana.com
- (Optional) Add Sentry via wizard
- Connect Airtable Automation → /api/revalidate

## Contributing

Small, focused PRs are ideal. Add notes inline if you divert from this README—this doc is a guide, not a gate.

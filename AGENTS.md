# Agents Notes

Use this file first before re-exploring the repo.

## Project

- App: Next.js 15 App Router site for a speaker portal and public schedule.
- Stack: TypeScript, Airtable REST API, Luxon, Zod, ICS generation, shadcn/ui.
- Root paths:
  - `src/app`: routes and API handlers
  - `src/lib/airtable`: Airtable client, fetchers, schemas, helpers
  - `src/lib/time`: timezone helpers
  - `src/lib/ics`: calendar generation
  - `src/lib/site.ts`: env-driven site and event config
  - `src/components`: UI and speaker portal components

## Airtable

- Base comes from `.env.local` via `AIRTABLE_BASE` and `AIRTABLE_PAT`.
- Current table env vars:
  - `AIRTABLE_TABLE_AGENDA=tbl802700wD64jBNI`
  - `AIRTABLE_TABLE_SPEAKERS=tbljHJh3sx1zrwMSD`
  - `AIRTABLE_TABLE_FORMATS=tbltJYMgzlVFeibNU`
- Shared URLs provided by user point to the same table IDs as above.
- Main normalized contract lives in `src/lib/airtable/schemas.ts`.

## Env-Driven Site Config

- Event identity and timezone should be treated as configuration, not hardcoded copy.
- Main config lives in `src/lib/site.ts`.
- Important env vars:
  - `NEXT_PUBLIC_VENUE_TZ`
  - `NEXT_PUBLIC_BASE_URL`
  - `NEXT_PUBLIC_EVENT_NAME`
  - `NEXT_PUBLIC_SITE_NAME`
  - `NEXT_PUBLIC_EVENT_DESCRIPTION`
  - `NEXT_PUBLIC_EVENT_LOCATION`
  - `NEXT_PUBLIC_ORGANIZER_NAME`
  - `NEXT_PUBLIC_SPEAKER_GUIDE_URL`
  - `EVENT_CALENDAR_NAME`
  - `EVENT_ORGANIZER_EMAIL`
  - `EVENT_GEO_LAT`
  - `EVENT_GEO_LON`
- If event copy, metadata, email labels, or ICS labels need changing, update env-backed config first.

## Important Airtable Field Mapping

- Sessions / Agenda:
  - `⚙️ Session Name`
  - `Description`
  - `Start Time`
  - `End Time`
  - `Stage`
  - `Onboarded Speakers`
  - `Moderator`
  - `Format`
  - `Actions_Deck Received`
  - `Portal_Telegram Group`
  - `Portal_Greenlight Time`
  - `Web Publishing Status`
  - `Publish to web`
- Speakers / Onboarded Speakers:
  - `Name`
  - `First Name`
  - `Last Name`
  - `Role or Title`
  - `Company`
  - `Bio`
  - `Headshot_For Web`
  - `Speaker Card`
  - `Twitter`
  - `Slide Deck File`
  - `Luma Speaker Ticket`
  - `Luma Ticket_Plus One`
  - `Invitation Code`
  - `25% Discount Code`
  - `Dietary`
  - `Speaker Permit Approval`
  - `MC Info`
  - `Parking Ticket`
  - `YouTube Speaker Video`
  - `Speaker Photo Link`
- Formats:
  - `Format`
  - `Duration (minutes)`
  - `Format Description`

## Known Gotchas

- Speaker session filtering must use Airtable linked record ids, not speaker names.
- `NEXT_PUBLIC_VENUE_TZ` is user-configured and should support aliases like `NYC`.
- Stage values come from Airtable and may include:
  - `Absolute Cinema`
  - `Lock In`
  - `Cafe del Mar`
  - `Etihad Arena`

## Files To Check First For Data Issues

- `src/lib/airtable/fetch.ts`
- `src/lib/airtable/schemas.ts`
- `src/lib/airtable/utils.ts`
- `src/app/s/page.tsx`
- `src/app/api/ics/speaker/[speakerId]/route.ts`
- `src/lib/time/tz.ts`
- `src/lib/ics/build.ts`
- `src/lib/site.ts`

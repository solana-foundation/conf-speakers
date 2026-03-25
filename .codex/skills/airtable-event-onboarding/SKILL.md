---
name: airtable-event-onboarding
description: Use when a new event points this app at a new Airtable base or new table schema and the Airtable field aliases, linked-record mappings, or publishing fields need to be reconciled with the app.
---

# Airtable Event Onboarding

Use this workflow when a new event replaces or renames Airtable columns.

## Goal

Keep the app's canonical data contract stable and update the Airtable config, not random app files.

## Workflow

1. Read `.env.local` and confirm `AIRTABLE_BASE`, `AIRTABLE_TABLE_AGENDA`, `AIRTABLE_TABLE_SPEAKERS`, and `AIRTABLE_TABLE_FORMATS`.
2. Run `npm run airtable:audit` from the repo root.
3. Update [config.ts](./../../../../src/lib/airtable/config.ts):
   - change alias arrays in `airtableFieldMap`
   - change `airtableRequiredFields` only if the app contract changed
   - update linked-record fields or publishing-status ids if the new base uses different ones
4. If the new event introduces a genuinely new app concept, update the canonical parsers in [schemas.ts](./../../../../src/lib/airtable/schemas.ts) and the UI/API code that consumes that field.
5. Run verification:
   - `npm test -- --runInBand`
   - `npx tsc --noEmit`
   - `npm run lint`
6. Summarize:
   - which aliases were added or changed
   - which live Airtable fields remain unmapped
   - which app features are now unsupported because the source fields do not exist

## Rules

- Do not hardcode new Airtable field labels directly in pages or routes.
- Prefer adding aliases to the config over changing parser logic.
- Treat missing live fields as a product decision: either make the feature optional or add the field to Airtable.
- When debugging linked sessions, use linked record ids, not speaker names.

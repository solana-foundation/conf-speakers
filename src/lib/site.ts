function normalizeBaseUrl(value?: string): string {
  const raw = value?.trim();
  if (!raw) {
    return "http://localhost:3000";
  }

  if (/^https?:\/\//.test(raw)) {
    return raw;
  }

  return `https://${raw}`;
}

export const SITE_URL = normalizeBaseUrl(process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL);
export const SITE_HOST = new URL(SITE_URL).host;

export const EVENT_NAME = process.env.NEXT_PUBLIC_EVENT_NAME?.trim() || "Event";
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME?.trim() || `${EVENT_NAME} Speaker Portal`;
export const EVENT_DESCRIPTION =
  process.env.NEXT_PUBLIC_EVENT_DESCRIPTION?.trim() || "Agenda and speaker information for this event.";
export const EVENT_LOCATION = process.env.NEXT_PUBLIC_EVENT_LOCATION?.trim() || "";
export const ORGANIZER_NAME =
  process.env.NEXT_PUBLIC_ORGANIZER_NAME?.trim() || process.env.SENDGRID_FROM_NAME?.trim() || "Events Team";
export const ORGANIZER_EMAIL =
  process.env.EVENT_ORGANIZER_EMAIL?.trim() || process.env.SENDGRID_FROM_EMAIL?.trim() || "noreply@example.com";
export const CALENDAR_NAME = process.env.EVENT_CALENDAR_NAME?.trim() || `${EVENT_NAME} Schedule`;
export const SPEAKER_GUIDE_URL = process.env.NEXT_PUBLIC_SPEAKER_GUIDE_URL?.trim() || "";

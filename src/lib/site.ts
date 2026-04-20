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

function normalizeOptionalUrl(value?: string): string {
  const raw = value?.trim();
  if (!raw) {
    return "";
  }

  if (/^https?:\/\//.test(raw)) {
    return raw;
  }

  return `https://${raw}`;
}

function parseBooleanEnv(value: string | undefined, defaultValue: boolean): boolean {
  if (value == null) {
    return defaultValue;
  }

  const normalized = value.trim().toLowerCase();

  if (["1", "true", "yes", "on"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(normalized)) {
    return false;
  }

  return defaultValue;
}

function parseNumberEnv(value: string | undefined, defaultValue: number): number {
  if (value == null) {
    return defaultValue;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultValue;
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
export const EVENT_URL = normalizeOptionalUrl(process.env.NEXT_PUBLIC_EVENT_URL);
export const EVENT_REGISTRATION_PLATFORM = process.env.NEXT_PUBLIC_EVENT_REGISTRATION_PLATFORM?.trim() || "Luma";
export const EVENT_COUPON_PARAM = process.env.NEXT_PUBLIC_EVENT_COUPON_PARAM?.trim() || "coupon";
export const SPEAKER_CONTACT_EMAIL = process.env.NEXT_PUBLIC_SPEAKER_CONTACT_EMAIL?.trim() || ORGANIZER_EMAIL;
export const SPEAKER_GUIDE_URL = process.env.NEXT_PUBLIC_SPEAKER_GUIDE_URL?.trim() || "";
export const HOME_SCHEDULE_ENABLED = parseBooleanEnv(process.env.NEXT_PUBLIC_HOME_SCHEDULE_ENABLED, true);
export const SITE_LOGO_PATH = process.env.NEXT_PUBLIC_SITE_LOGO_PATH?.trim() || "/accelerate-usa-logo.svg";
export const SITE_LOGO_WIDTH = parseNumberEnv(process.env.NEXT_PUBLIC_SITE_LOGO_WIDTH, 197);
export const SITE_LOGO_HEIGHT = parseNumberEnv(process.env.NEXT_PUBLIC_SITE_LOGO_HEIGHT, 99);
export const SOCIAL_IMAGE_PATH = process.env.NEXT_PUBLIC_SOCIAL_IMAGE_PATH?.trim() || "/twitter-card.png";

export function buildEventCouponUrl(code: string): string | null {
  if (!EVENT_URL) {
    return null;
  }

  try {
    const url = new URL(EVENT_URL);
    url.searchParams.set(EVENT_COUPON_PARAM, code);
    return url.toString();
  } catch {
    return null;
  }
}

import { APP_CONFIG } from "@/lib/app-config";

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

export const SITE_URL = normalizeBaseUrl(APP_CONFIG.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL);
export const SITE_HOST = new URL(SITE_URL).host;

export const EVENT_NAME = APP_CONFIG.NEXT_PUBLIC_EVENT_NAME;
export const SITE_NAME = APP_CONFIG.NEXT_PUBLIC_SITE_NAME;
export const EVENT_DESCRIPTION = APP_CONFIG.NEXT_PUBLIC_EVENT_DESCRIPTION;
export const EVENT_LOCATION = APP_CONFIG.NEXT_PUBLIC_EVENT_LOCATION;
export const EVENT_DATES_LABEL = APP_CONFIG.NEXT_PUBLIC_EVENT_DATES;
export const ORGANIZER_NAME = APP_CONFIG.NEXT_PUBLIC_ORGANIZER_NAME || APP_CONFIG.SENDGRID_FROM_NAME;
export const ORGANIZER_EMAIL = APP_CONFIG.EVENT_ORGANIZER_EMAIL || APP_CONFIG.SENDGRID_FROM_EMAIL;
export const CALENDAR_NAME = APP_CONFIG.EVENT_CALENDAR_NAME;
export const EVENT_URL = normalizeOptionalUrl(APP_CONFIG.NEXT_PUBLIC_EVENT_URL);
export const EVENT_SITE_URL = normalizeOptionalUrl(APP_CONFIG.NEXT_PUBLIC_EVENT_SITE_URL);
export const EVENT_REGISTRATION_PLATFORM = APP_CONFIG.NEXT_PUBLIC_EVENT_REGISTRATION_PLATFORM;
export const EVENT_COUPON_PARAM = APP_CONFIG.NEXT_PUBLIC_EVENT_COUPON_PARAM;
export const SPEAKER_CONTACT_EMAIL = APP_CONFIG.NEXT_PUBLIC_SPEAKER_CONTACT_EMAIL || ORGANIZER_EMAIL;
export const SPEAKER_GUIDE_URL = APP_CONFIG.NEXT_PUBLIC_SPEAKER_GUIDE_URL;
export const SPEAKER_GUIDE_LABEL = APP_CONFIG.NEXT_PUBLIC_SPEAKER_GUIDE_LABEL;
export const SPEAKER_GUIDE_NOTE = APP_CONFIG.NEXT_PUBLIC_SPEAKER_GUIDE_NOTE;
export const HOME_SCHEDULE_ENABLED = APP_CONFIG.NEXT_PUBLIC_HOME_SCHEDULE_ENABLED;
export const SITE_LOGO_PATH = APP_CONFIG.NEXT_PUBLIC_SITE_LOGO_PATH;
export const SITE_LOGO_WIDTH = APP_CONFIG.NEXT_PUBLIC_SITE_LOGO_WIDTH;
export const SITE_LOGO_HEIGHT = APP_CONFIG.NEXT_PUBLIC_SITE_LOGO_HEIGHT;
export const SOCIAL_IMAGE_PATH = APP_CONFIG.NEXT_PUBLIC_SOCIAL_IMAGE_PATH;
export const SOCIAL_BACKGROUND_IMAGE_PATH = APP_CONFIG.NEXT_PUBLIC_SOCIAL_BG_IMAGE_PATH;

export const EVENT_FILE_SLUG =
  EVENT_NAME.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "event";

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

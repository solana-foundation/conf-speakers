import { DateTime, Settings } from "luxon";

const VENUE_TIMEZONE = process.env.NEXT_PUBLIC_VENUE_TZ;

if (!VENUE_TIMEZONE) {
  throw new Error("NEXT_PUBLIC_VENUE_TZ is not set");
}

// Initialize Luxon settings
Settings.defaultZone = VENUE_TIMEZONE;

/**
 * Get the current time in the venue timezone
 */
export function getVenueTime(): DateTime {
  return DateTime.now().setZone(VENUE_TIMEZONE);
}

/**
 * Convert a DateTime to the venue timezone
 */
export function toVenueTime(dateTime: DateTime): DateTime {
  return dateTime.setZone(VENUE_TIMEZONE);
}

/**
 * Format a DateTime for display in a specific timezone
 */
export function formatTime(
  dateTime: DateTime | string,
  timezone: string,
  format: string = "ccc, MMM d, yyyy h:mm a z",
): string {
  let date: DateTime;
  if (typeof dateTime === "string") {
    date = DateTime.fromISO(dateTime);
  } else {
    date = dateTime;
  }
  return date.setZone(timezone).toFormat(format);
}

/**
 * Format a DateTime for display in venue timezone
 */
export function formatVenueTime(dateTime: DateTime | string, format: string = "ccc, MMM d, yyyy h:mm a z"): string {
  return formatTime(dateTime, VENUE_TIMEZONE!, format);
}

/**
 * Check if a DateTime is in the past
 */
export function isPast(dateTime: DateTime): boolean {
  return dateTime < DateTime.now();
}

/**
 * Check if a DateTime is in the future
 */
export function isFuture(dateTime: DateTime): boolean {
  return dateTime > DateTime.now();
}

/**
 * Check if a DateTime is today (in venue timezone)
 */
export function isToday(dateTime: DateTime): boolean {
  const today = getVenueTime().startOf("day");
  const date = toVenueTime(dateTime).startOf("day");
  return today.equals(date);
}

/**
 * Check if a DateTime is tomorrow (in venue timezone)
 */
export function isTomorrow(dateTime: DateTime): boolean {
  const tomorrow = getVenueTime().plus({ days: 1 }).startOf("day");
  const date = toVenueTime(dateTime).startOf("day");
  return tomorrow.equals(date);
}

/**
 * Get the start of day for a DateTime in venue timezone
 */
export function getStartOfDay(dateTime: DateTime): DateTime {
  return toVenueTime(dateTime).startOf("day");
}

/**
 * Get the end of day for a DateTime in venue timezone
 */
export function getEndOfDay(dateTime: DateTime): DateTime {
  return toVenueTime(dateTime).endOf("day");
}

/**
 * Parse an ISO string and return a DateTime in venue timezone
 */
export function parseISO(isoString: string): DateTime {
  return DateTime.fromISO(isoString).setZone(VENUE_TIMEZONE);
}

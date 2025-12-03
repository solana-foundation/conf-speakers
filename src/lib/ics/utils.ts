/**
 * Get the base URL for the application
 */
function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL;
  if (baseUrl) {
    // Strip protocol if already present
    const cleanUrl = baseUrl.replace(/^https?:\/\//, "");
    return `https://${cleanUrl}`;
  }
  return "http://localhost:3000";
}

/**
 * Generate a calendar subscription URL for a specific session
 */
export function getSessionCalendarUrl(sessionId: string, key: string): string {
  const baseUrl = getBaseUrl();
  return `webcal://${baseUrl.replace(/^https?:\/\//, "")}/api/ics/session/${sessionId}?key=${encodeURIComponent(key)}`;
}

/**
 * Generate a calendar subscription URL for all sessions
 */
export function getSessionsCalendarUrl(key: string): string {
  const baseUrl = getBaseUrl();
  return `webcal://${baseUrl.replace(/^https?:\/\//, "")}/api/ics/event?key=${encodeURIComponent(key)}`;
}

/**
 * Generate a calendar subscription URL for a specific speaker's sessions
 */
export function getSpeakerCalendarUrl(speakerId: string, key: string): string {
  const baseUrl = getBaseUrl();
  return `webcal://${baseUrl.replace(/^https?:\/\//, "")}/api/ics/speaker/${speakerId}?key=${encodeURIComponent(key)}`;
}

/**
 * Generate a regular HTTP URL for calendar subscription (fallback for apps that don't support webcal://)
 */
export function getSessionCalendarHttpUrl(sessionId: string, key: string): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/api/ics/session/${sessionId}?key=${encodeURIComponent(key)}`;
}

/**
 * Generate a regular HTTP URL for all sessions calendar subscription
 */
export function getSessionsCalendarHttpUrl(key: string): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/api/ics/event?key=${encodeURIComponent(key)}`;
}

/**
 * Generate a regular HTTP URL for speaker calendar subscription
 */
export function getSpeakerCalendarHttpUrl(speakerId: string, key: string): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/api/ics/speaker/${speakerId}?key=${encodeURIComponent(key)}`;
}

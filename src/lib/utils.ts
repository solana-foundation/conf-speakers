import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitizes any X (Twitter) handle or URL to the `handle` format.
 * Accepts: handle, @handle, x.com/handle, http(s)://x.com/handle, etc.
 */
export function sanitizeXName(input: string): string | null {
  if (!input) return null;

  let handle = input.trim();
  if (/^https?:\/\//i.test(handle)) {
    try {
      const url = new URL(handle);
      if (!["x.com", "www.x.com", "twitter.com", "www.twitter.com"].includes(url.hostname.toLowerCase())) return null;
      handle = url.pathname.replace(/^\/+|\/+$/g, "");
    } catch {
      return null;
    }
  } else {
    handle = handle
      .replace(/^(?:www\.)?(?:x\.com|twitter\.com)\//i, "")
      .replace(/^@/, "")
      .replace(/\/+$/, "");
  }

  return /^[A-Za-z0-9_]{1,15}$/.test(handle) ? handle : null;
}

/**
 * Sanitizes any X (Twitter) handle or URL to the canonical https://x.com/handle format.
 * Accepts: handle, @handle, x.com/handle, http(s)://x.com/handle, etc.
 */
export function sanitizeXLink(input: string): string | null {
  if (!input) return null;

  // Remove leading/trailing whitespace
  const handle = sanitizeXName(input);

  // If handle is empty, return null
  if (!handle) return null;

  return `https://x.com/${handle}`;
}

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

  // Remove leading/trailing whitespace
  let handle = input.trim();

  // Remove protocol and www if present
  handle = handle.replace(/^https?:\/\/(www\.)?/i, "");

  // Remove domain if present (both x.com and twitter.com)
  handle = handle.replace(/^(x\.com|twitter\.com)\//i, "");

  // Remove leading @ if present
  handle = handle.replace(/^@/, "");

  // Remove any trailing slashes
  handle = handle.replace(/\/+$/, "");

  // If after all this, handle is empty, return null
  if (!handle) return null;

  return handle;
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

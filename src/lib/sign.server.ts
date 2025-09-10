import { NextRequest } from "next/server";
import * as jwt from "jsonwebtoken";

// Generate key string as JWT
export const generateKey = (exp: string | number, slug: string, speakerId?: string) => {
  const siteSecret = process.env.SITE_SECRET;
  if (!siteSecret) {
    throw new Error("SITE_SECRET environment variable is not set");
  }

  if (!exp || !slug) {
    throw new Error("No exp or slug provided");
  }

  const payload: Record<string, any> = { slug };
  if (speakerId) {
    payload.speakerId = speakerId;
  }
  payload.exp = Math.floor(Number(exp) / 1000);

  return jwt.sign(payload, siteSecret, { noTimestamp: true });
};

export const isAuthenticated = (request: NextRequest, slug?: string) => {
  const query = new URLSearchParams(request.nextUrl.searchParams);
  const key = query.get("key");

  return isKeyValid(key, slug);
};

export const getTokenPayload = (key: string) => {
  const siteSecret = process.env.SITE_SECRET || "";
  try {
    return jwt.verify(key, siteSecret) as Record<string, any>;
  } catch {
    return null;
  }
};

export const isKeyValid = (key: string | null, slug: string = "auth") => {
  // For development, log the valid key
  if (process.env.NODE_ENV === "development") {
    console.log("Valid key:", generateKey(Date.now() + Number(process.env.NEXT_PUBLIC_KEY_EXP ?? 0), slug));
  }

  if (!key) {
    return false;
  }

  const payload = getTokenPayload(key);
  if (!payload) {
    return false;
  }

  return payload.slug === slug;
};

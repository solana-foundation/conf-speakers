import { NextRequest } from "next/server";
import * as jwt from "jsonwebtoken";

// Token payload carried in our JWT
export type TokenPayload = {
  slug: string;
  exp: number;
  speakerId?: string;
};

// Generate key string as JWT
export const generateKey = (exp: string | number, slug: string, speakerId?: string) => {
  const siteSecret = process.env.SITE_SECRET;
  if (!siteSecret) {
    throw new Error("SITE_SECRET environment variable is not set");
  }

  if (!exp || !slug) {
    throw new Error("No exp or slug provided");
  }

  const payload: TokenPayload = {
    slug,
    exp: Math.floor(Number(exp) / 1000),
    ...(speakerId ? { speakerId } : {}),
  };

  return jwt.sign(payload, siteSecret, { noTimestamp: true });
};

export const isAuthenticated = (request: NextRequest, slug?: string) => {
  const query = new URLSearchParams(request.nextUrl.searchParams);
  const key = query.get("key");

  return isKeyValid(key, slug);
};

export const getTokenPayload = (key: string): TokenPayload | null => {
  const siteSecret = process.env.SITE_SECRET || "";
  try {
    const decoded = jwt.verify(key, siteSecret);
    if (typeof decoded !== "object" || decoded === null) {
      return null;
    }

    const obj = decoded as Record<string, unknown>;
    const slug = obj["slug"];
    const exp = obj["exp"];
    const speakerId = obj["speakerId"];

    if (typeof slug === "string" && typeof exp === "number") {
      return {
        slug,
        exp,
        ...(typeof speakerId === "string" ? { speakerId } : {}),
      };
    }
    return null;
  } catch {
    return null;
  }
};

export const isKeyValid = (key: string | null, slug: string = "auth") => {
  if (!key) {
    return false;
  }

  const payload = getTokenPayload(key);
  if (!payload) {
    return false;
  }

  return payload.slug === slug;
};

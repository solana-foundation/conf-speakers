import { NextRequest } from "next/server";
import { createHmac } from "crypto";

// Generate key string base64url(HMAC_SHA256(slug + "." + exp, SITE_SECRET))
export const generateKey = (exp?: string | number, slug?: string) => {
  const siteSecret = process.env.SITE_SECRET;
  if (!siteSecret) {
    throw new Error("SITE_SECRET environment variable is not set");
  }

  // If no parameters provided, generate a simple HMAC for basic auth
  if (!exp || !slug) {
    throw new Error("No exp or slug provided");
  }

  // Generate HMAC with provided exp and slug
  const message = `${slug}.${exp}`;
  const hmac = createHmac("sha256", siteSecret).update(message).digest("base64url");

  return `${hmac}.${exp}`;
};

export const isAuthenticated = (request: NextRequest, slug?: string) => {
  const query = new URLSearchParams(request.nextUrl.searchParams);
  const key = query.get("key");

  return isKeyValid(key, slug);
};

export const isKeyValid = (key: string | null, slug: string = "auth") => {
  // For development, log the valid key
  if (process.env.NODE_ENV === "development") {
    console.log("Valid key:", generateKey(Date.now() + Number(process.env.NEXT_PUBLIC_KEY_EXP ?? 0), slug));
  }

  if (!key) {
    return false;
  }

  const parts = key.split(".");
  if (parts.length !== 2) {
    return false;
  }

  const [hmac, exp] = parts;

  if (!exp || !hmac) {
    return false;
  }

  if (Number(exp) < Date.now()) {
    return false;
  }

  return key === generateKey(exp, slug);
};

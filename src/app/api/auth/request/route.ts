import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { generateKey } from "@/lib/sign.server";

type ActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: { email?: string };
  cooldownMs?: number;
};

// In-memory abuse controls (resets on deploy)
type RLItem = { count: number; resetAt: number; cooldownUntil?: number };
type RLStore = { ip: Map<string, RLItem>; email: Map<string, RLItem> };

declare global {
  // eslint-disable-next-line no-var
  var __rateLimitStore: RLStore | undefined;
}

function getStore(): RLStore {
  if (!global.__rateLimitStore) {
    global.__rateLimitStore = { ip: new Map(), email: new Map() };
  }
  return global.__rateLimitStore;
}

const EMAIL_SCHEMA = z.string().trim().toLowerCase().max(254).email("Enter a valid email address.");
const WINDOW_MS = 15 * 60 * 1000; // 15m
const MAX_PER_IP = 10;
const MAX_PER_EMAIL = 5;
const COOLDOWN_MS = 60 * 1000; // 60s

const now = () => Date.now();
const withinWindow = (item: RLItem | undefined, windowMs: number) => !!item && item.resetAt >= now();
function incr(map: Map<string, RLItem>, key: string, windowMs: number) {
  const curr = map.get(key);
  const t = now();
  if (!withinWindow(curr, windowMs)) {
    const fresh = { count: 1, resetAt: t + windowMs } as RLItem;
    map.set(key, fresh);
    return fresh;
  }
  curr!.count += 1;
  map.set(key!, curr!);
  return curr!;
}

function getClientIp(req: NextRequest) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xrip = req.headers.get("x-real-ip");
  if (xrip) return xrip;
  return "0.0.0.0";
}

async function sendMagicLinkEmail(to: string, link: string) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "noreply@example.com";
  const subject = "Your secure access link";
  if (!resendApiKey) throw new Error("RESEND_API_KEY not configured");
  const resend = new Resend(resendApiKey);
  await resend.emails.send({
    from,
    to,
    subject,
    text: `Here is your secure link:\n\n${link}\n\nThis link will expire soon.`,
    html: `<p>Here is your secure link:</p><p><a href="${link}">${link}</a></p><p>This link will expire soon.</p>`,
  });
}

export async function POST(req: NextRequest) {
  // Small jitter to slow down abuse
  await new Promise((r) => setTimeout(r, 300 + Math.floor(Math.random() * 300)));

  const formData = await req.formData();

  // Honeypot
  const website = (formData.get("website") as string | null) || "";
  if (website.trim().length > 0) {
    return NextResponse.json<ActionState>({ ok: true, message: "Check your email for link" });
  }

  const emailInput = (formData.get("email") as string | null) || "";
  const parsed = EMAIL_SCHEMA.safeParse(emailInput);
  if (!parsed.success) {
    return NextResponse.json<ActionState>({
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: { email: parsed.error?.message ?? "Invalid email." },
    });
  }
  const email = parsed.data;

  const store = getStore();
  const ip = getClientIp(req);

  // Rate limiting
  const ipItem = incr(store.ip, ip, WINDOW_MS);
  if (ipItem.count > MAX_PER_IP) {
    return NextResponse.json<ActionState>({ ok: true, message: "Check your email for link" });
  }

  const emailItem = incr(store.email, email, WINDOW_MS);
  if (emailItem.cooldownUntil && emailItem.cooldownUntil > now()) {
    const remaining = emailItem.cooldownUntil - now();
    return NextResponse.json<ActionState>({
      ok: true,
      message: "Check your email for link",
      cooldownMs: remaining > 0 ? remaining : COOLDOWN_MS,
    });
  }
  if (emailItem.count > MAX_PER_EMAIL) {
    return NextResponse.json<ActionState>({ ok: true, message: "Check your email for link" });
  }

  try {
    const expMs = Number(process.env.NEXT_PUBLIC_KEY_EXP ?? 15 * 60 * 1000);
    const exp = now() + expMs;
    const key = generateKey(exp, "auth");
    const baseUrl = req.nextUrl.origin; // respects host/proto
    const linkTarget = "/schedule";
    const link = `${baseUrl}${linkTarget}?key=${encodeURIComponent(key)}`;

    await sendMagicLinkEmail(email, link);

    emailItem.cooldownUntil = now() + COOLDOWN_MS;
    store.email.set(email, emailItem);

    return NextResponse.json<ActionState>({ ok: true, message: "Check your email for link", cooldownMs: COOLDOWN_MS });
  } catch {
    return NextResponse.json<ActionState>({ ok: true, message: "Check your email for link" });
  }
}

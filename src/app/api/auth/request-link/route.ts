import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { airtable } from "@/lib/airtable/client";
import { generateKey } from "@/lib/sign.server";
import { isZodError } from "@/lib/airtable/utils";
import { sendMagicLinkEmail } from "@/lib/sendgrid";

const tableSpeakers = process.env.AIRTABLE_TABLE_SPEAKERS || "Onboarded Speakers";
const columnEmail = "fldXAPcvQhbruspxA"; // "Speaker's Email"
const columnAssistantEmail = "fld1o4wbFWJqYrw5X"; // "Assistant's Email"

const FormSchema = z.object({
  email: z.string("Invalid email address"),
  website: z.string().max(0, "Invalid request"),
});

type ActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: { email?: string };
  cooldownMs?: number;
};

const eventTitle = "Breakpoint Speaker Dashboard";

function formatExpiresIn(expirationMs: number) {
  if (!Number.isFinite(expirationMs) || expirationMs <= 0) return undefined;

  const minutes = Math.round(expirationMs / 60000);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"}`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"}`;

  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"}`;
}

function buildDelimitedSearchFormula(fieldId: string, emailValue: string) {
  return `FIND("," & "${emailValue}" & ",", "," & SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(LOWER({${fieldId}}), " ", ""), "\n", ""), "\r", "") & ",") > 0`;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const data = {
    email: formData.get("email")?.toString() ?? "",
    website: formData.get("website")?.toString() ?? "",
  };

  // Honeypot check: if filled, assume bot and return fake success without processing
  if (data.website !== "") {
    return NextResponse.json<ActionState>({
      ok: true,
      message: "A login link has been sent to your email.",
      cooldownMs: 60000,
    });
  }

  let parsed: z.infer<typeof FormSchema>;
  try {
    parsed = FormSchema.parse(data);
  } catch (error) {
    if (isZodError(error)) {
      const fieldErrors: { email?: string } = {};
      error.issues.forEach((e) => {
        if (e.path[0] === "email") fieldErrors.email = e.message;
      });
      return NextResponse.json<ActionState>({ ok: false, message: "Invalid form data", fieldErrors }, { status: 400 });
    }
    return NextResponse.json<ActionState>({ ok: false, message: "Invalid request" }, { status: 400 });
  }

  const { email } = parsed;
  const trimmedEmail = email.trim();
  const normalizedEmail = trimmedEmail.toLowerCase();
  const emailFormulaValue = normalizedEmail.replace(/"/g, '\\"');
  const filterFormula = `OR(${buildDelimitedSearchFormula(columnEmail, emailFormulaValue)}, ${buildDelimitedSearchFormula(columnAssistantEmail, emailFormulaValue)})`;

  try {
    const records = await airtable
      .table(tableSpeakers)
      .select({
        filterByFormula: filterFormula,
        maxRecords: 2,
      })
      .firstPage();

    if (records.length === 0) {
      return NextResponse.json<ActionState>(
        {
          ok: false,
          message: "No account found with that email.",
          fieldErrors: { email: "No account found" },
        },
        { status: 404 },
      );
    }

    if (records.length > 1) {
      return NextResponse.json<ActionState>(
        { ok: false, message: "Multiple accounts found for this email. Please contact support." },
        { status: 400 },
      );
    }

    const record = records[0];
    const speakerId = record.id;

    const now = Date.now();
    const expiresInMs = Number(process.env.NEXT_PUBLIC_KEY_EXP ?? 0);
    const exp = now + expiresInMs; // Default 3M
    const token = generateKey(exp, "auth", speakerId);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    const link = `${baseUrl}/s?key=${token}`;

    const fields = record.fields as Record<string, unknown>;
    const recipientName =
      (fields["Speaker Name"] as string | undefined) ??
      (fields["Speaker's Name"] as string | undefined) ??
      (fields["Full Name"] as string | undefined) ??
      (fields["Name"] as string | undefined);

    try {
      await sendMagicLinkEmail({
        to: trimmedEmail,
        magicLink: link,
        recipientName,
        expiresInLabel: formatExpiresIn(expiresInMs),
        eventTitle,
      });
    } catch (sendError) {
      console.error(sendError);
      return NextResponse.json<ActionState>(
        { ok: false, message: "Failed to send email. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json<ActionState>({
      ok: true,
      message: "A login link has been sent to your email.",
      cooldownMs: 60000, // 1 minute cooldown
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json<ActionState>(
      { ok: false, message: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { airtable } from "@/lib/airtable/client";
import { generateKey } from "@/lib/sign.server";
import { Resend } from "resend";
import { isZodError } from "@/lib/airtable/utils";

const tableSpeakers = process.env.AIRTABLE_TABLE_SPEAKERS || "Onboarded Speakers";
const columnEmail = "fldXAPcvQhbruspxA"; // "Speaker's Email"

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

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  console.log(formData);

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

  try {
    const records = await airtable
      .table(tableSpeakers)
      .select({
        filterByFormula: `LOWER({${columnEmail}}) = '${email.toLowerCase()}'`,
        maxRecords: 1,
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

    const speakerId = records[0].id;

    const exp = Date.now() + Number(process.env.NEXT_PUBLIC_KEY_EXP ?? 3600000); // Default 1 hour
    const token = generateKey(exp, "auth", speakerId);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    const link = `${baseUrl}/s?key=${token}`;

    console.log(records, link);

    // const resend = new Resend(process.env.RESEND_API_KEY);
    // const { error } = await resend.emails.send({
    //   from: "Breakpoint Speakers <no-reply@bpspeakers.com>", // Adjust domain as needed
    //   to: [email],
    //   subject: "Your Speaker Portal Login Link",
    //   html: `<p>Click <a href="${link}">here</a> to access your speaker portal.</p><p>This link will expire in 1 hour.</p>`,
    // });

    // if (error) {
    //   console.error(error);
    //   return NextResponse.json<ActionState>(
    //     { ok: false, message: "Failed to send email. Please try again." },
    //     { status: 500 },
    //   );
    // }

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

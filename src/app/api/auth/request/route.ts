import { NextRequest, NextResponse } from "next/server";
import { generateKey } from "@/lib/sign.server";
import { z } from "zod";
import { getZodErrorMessage, isZodError } from "@/lib/airtable/utils";

const BodySchema = z.object({
  speakerId: z.string().min(1, "speakerId is required"),
});

export const POST = async (request: NextRequest) => {
  const serverApiKey = process.env.API_KEY;
  if (!serverApiKey) {
    return NextResponse.json({ error: "Server misconfiguration: API_KEY is not set" }, { status: 500 });
  }

  const headerApiKey = request.headers.get("x-api-key");
  if (headerApiKey !== serverApiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  let speakerId: string;
  try {
    ({ speakerId } = BodySchema.parse(json));
  } catch (error) {
    if (isZodError(error)) {
      return NextResponse.json({ error: getZodErrorMessage(error) }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const exp = Date.now() + Number(process.env.NEXT_PUBLIC_KEY_EXP ?? 0);
  try {
    const token = generateKey(exp, "auth", speakerId);
    return NextResponse.json({
      token,
      speakerId,
      slug: "auth",
      exp: Math.floor(exp / 1000),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate token" }, { status: 500 });
  }
};

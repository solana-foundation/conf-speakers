import { getTokenPayload } from "@/lib/sign.server";
import { NextRequest, NextResponse } from "next/server";
import { parseSessionRecord } from "@/lib/airtable/schemas";
import { getZodErrorMessage, isZodError } from "@/lib/airtable/utils";
import { fetchSession } from "@/lib/airtable/fetch";

export const GET = async (request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) => {
  const { sessionId } = await params;

  const key = request.nextUrl.searchParams.get("key");
  const payload = key ? getTokenPayload(key) : null;
  if (payload?.slug !== "auth" || !payload.speakerId) {
    return NextResponse.json({ error: "Invalid key" }, { status: 401 });
  }

  try {
    const record = await fetchSession(sessionId);

    const data = parseSessionRecord(record);

    if (![...(data.speakerIds ?? []), ...(data.moderatorIds ?? [])].includes(payload.speakerId)) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({ ...data });
  } catch (error) {
    console.error(error);

    if (isZodError(error)) {
      return NextResponse.json({ error: getZodErrorMessage(error) }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

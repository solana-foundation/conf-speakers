import { fetchSessions } from "@/lib/airtable/fetch";
import { parseSessionRecord } from "@/lib/airtable/schemas";
import { getZodErrorMessage, isZodError } from "@/lib/airtable/utils";
import { getTokenPayload } from "@/lib/sign.server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const key = request.nextUrl.searchParams.get("key");
  const payload = key ? getTokenPayload(key) : null;
  if (payload?.slug !== "auth" || !payload.speakerId) {
    return NextResponse.json({ error: "Invalid key" }, { status: 401 });
  }

  try {
    const records = await fetchSessions();

    const data = records
      .map(parseSessionRecord)
      .filter((session) =>
        [...(session.speakerIds ?? []), ...(session.moderatorIds ?? [])].includes(payload.speakerId!),
      );

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    if (isZodError(error)) {
      return NextResponse.json({ error: getZodErrorMessage(error) }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

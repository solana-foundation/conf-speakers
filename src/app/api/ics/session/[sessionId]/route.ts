import { fetchSession } from "@/lib/airtable/fetch";
import { parseSessionRecord } from "@/lib/airtable/schemas";
import { generateIcsContent } from "@/lib/ics/build";
import { getTokenPayload } from "@/lib/sign.server";
import { NextRequest, NextResponse } from "next/server";
import { EVENT_FILE_SLUG, HOME_SCHEDULE_ENABLED } from "@/lib/site";
import { getWebPublishingStatus } from "@/lib/airtable/utils";

export const GET = async (request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) => {
  const key = request.nextUrl.searchParams.get("key");
  const payload = key ? getTokenPayload(key) : null;
  if (payload?.slug !== "ics" || (!payload.speakerId && !HOME_SCHEDULE_ENABLED)) {
    return NextResponse.json({ error: "Invalid key" }, { status: 401 });
  }

  const { sessionId } = await params;

  try {
    const record = await fetchSession(sessionId);
    const session = parseSessionRecord(record);

    if (payload.speakerId) {
      if (![...(session.speakerIds ?? []), ...(session.moderatorIds ?? [])].includes(payload.speakerId)) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }
    } else {
      const status = getWebPublishingStatus(session.webPublishingStatus);
      if (!status.hasTitle || !status.hasTime || status.hasDoNotPublish) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }
    }

    if (!session.name || !session.startTime || !session.endTime) {
      return NextResponse.json({ error: "Session missing start or end time" }, { status: 400 });
    }

    const icsContent = generateIcsContent([
      {
        id: sessionId,
        name: session.name!,
        description: session.description,
        startTime: session.startTime,
        endTime: session.endTime,
        stage: session.stage,
      },
    ]);

    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${EVENT_FILE_SLUG}-session-${sessionId}.ics"`,
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "X-Content-Type-Options": "nosniff",
        // Add CORS headers for cross-origin requests
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    });
  } catch (error) {
    console.error("Error generating session ICS:", error);
    return NextResponse.json({ error: "Failed to generate calendar" }, { status: 500 });
  }
};

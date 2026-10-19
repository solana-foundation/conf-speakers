import { fetchSessions } from "@/lib/airtable/fetch";
import { parseSessionRecord } from "@/lib/airtable/schemas";
import { generateIcsContent } from "@/lib/ics/build";
import { getTokenPayload } from "@/lib/sign.server";
import { NextRequest, NextResponse } from "next/server";
import { EVENT_FILE_SLUG, HOME_SCHEDULE_ENABLED } from "@/lib/site";
import { getWebPublishingStatus } from "@/lib/airtable/utils";

export const GET = async (request: NextRequest) => {
  const key = request.nextUrl.searchParams.get("key");
  const payload = key ? getTokenPayload(key) : null;
  if (payload?.slug !== "ics" || (!payload.speakerId && !HOME_SCHEDULE_ENABLED)) {
    return NextResponse.json({ error: "Invalid key" }, { status: 401 });
  }

  const query = new URLSearchParams(request.nextUrl.searchParams);
  const selectedSessions = query.get("sessions")?.split(",");

  try {
    const sessionRecords = await fetchSessions();
    let sessions = sessionRecords.map(parseSessionRecord).filter((session) => {
      if (!session.name || !session.startTime || !session.endTime) return false;
      if (payload.speakerId) {
        return [...(session.speakerIds ?? []), ...(session.moderatorIds ?? [])].includes(payload.speakerId);
      }
      const status = getWebPublishingStatus(session.webPublishingStatus);
      return status.hasTitle && status.hasTime && !status.hasDoNotPublish;
    });

    if (selectedSessions) {
      sessions = sessions.filter((session) => selectedSessions.includes(session.id));
    }

    if (sessions.length === 0) {
      return NextResponse.json({ error: "No sessions found" }, { status: 404 });
    }

    const icsContent = generateIcsContent(
      sessions.map((session) => ({
        id: session.id,
        name: session.name!,
        description: session.description,
        startTime: session.startTime!,
        endTime: session.endTime!,
        stage: session.stage,
      })),
    );

    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${EVENT_FILE_SLUG}-sessions.ics"`,
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "X-Content-Type-Options": "nosniff",
        // Add CORS headers for cross-origin requests
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    });
  } catch (error) {
    console.error("Error generating event ICS:", error);
    return NextResponse.json({ error: "Failed to generate calendar" }, { status: 500 });
  }
};

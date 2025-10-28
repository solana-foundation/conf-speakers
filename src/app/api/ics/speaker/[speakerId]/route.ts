import { fetchSessions, fetchSpeaker } from "@/lib/airtable/fetch";
import { SessionFieldsSchema, SpeakerFieldsSchema } from "@/lib/airtable/schemas";
import { generateSpeakerIcsContent } from "@/lib/ics/build";
import { getTokenPayload, isAuthenticated } from "@/lib/sign.server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest, { params }: { params: Promise<{ speakerId: string }> }) => {
  const { speakerId: paramSpeakerId } = await params;

  if (!isAuthenticated(request, "ics")) {
    return NextResponse.json({ error: "Invalid key" }, { status: 401 });
  }

  const query = new URLSearchParams(request.nextUrl.searchParams);
  const key = query.get("key")!;
  const payload = getTokenPayload(key);

  if (!payload || !payload.speakerId || payload.speakerId !== paramSpeakerId) {
    return NextResponse.json({ error: "Invalid token for this speaker" }, { status: 401 });
  }

  const speakerId = payload.speakerId;

  try {
    // Fetch speaker details
    const speakerRecord = await fetchSpeaker(speakerId);
    const speaker = SpeakerFieldsSchema.parse(speakerRecord);

    // Fetch sessions for this speaker
    const sessionRecords = await fetchSessions({ speakerName: speaker._name });
    const sessions = sessionRecords
      .map((record) => SessionFieldsSchema.parse(record))
      .filter((session) => session.name && session.startTime && session.endTime);

    if (sessions.length === 0) {
      return NextResponse.json({ error: "No sessions found for speaker" }, { status: 404 });
    }

    const icsContent = generateSpeakerIcsContent(
      sessions.map((session) => ({
        id: sessionRecords.find((r) => SessionFieldsSchema.parse(r).name === session.name)?.id || "",
        name: session.name!,
        description: session.description,
        startTime: session.startTime!,
        endTime: session.endTime!,
        stage: session.stage,
        speakerName: speaker._name,
      })),
    );

    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="breakpoint-2025-speaker-${speakerId}.ics"`,
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "X-Content-Type-Options": "nosniff",
        // Add CORS headers for cross-origin requests
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    });
  } catch (error) {
    console.error("Error generating speaker ICS:", error);
    return NextResponse.json({ error: "Failed to generate calendar" }, { status: 500 });
  }
};

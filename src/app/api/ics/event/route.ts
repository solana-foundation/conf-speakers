import { fetchSessions } from "@/lib/airtable/fetch";
import { SessionFieldsSchema } from "@/lib/airtable/schemas";
import { generateIcsContent } from "@/lib/ics/build";
import { isAuthenticated } from "@/lib/sign.server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  if (!isAuthenticated(request, "ics")) {
    return NextResponse.json({ error: "Invalid key" }, { status: 401 });
  }

  const query = new URLSearchParams(request.nextUrl.searchParams);
  const selectedSessions = query.get("sessions")?.split(",");

  try {
    const sessionRecords = await fetchSessions();
    let sessions = sessionRecords
      .map((record) => SessionFieldsSchema.parse(record))
      .filter((session) => session.startTime && session.endTime);

    if (selectedSessions) {
      sessions = sessions.filter((session) => selectedSessions.includes(session.id));
    }

    if (sessions.length === 0) {
      return NextResponse.json({ error: "No sessions found" }, { status: 404 });
    }

    const icsContent = generateIcsContent(
      sessions.map((session) => ({
        id: sessionRecords.find((r) => SessionFieldsSchema.parse(r).name === session.name)?.id || "",
        name: session.name,
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
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Error generating event ICS:", error);
    return NextResponse.json({ error: "Failed to generate calendar" }, { status: 500 });
  }
};

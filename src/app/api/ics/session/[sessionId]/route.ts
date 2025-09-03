import { fetchSession } from "@/lib/airtable/fetch";
import { SessionFieldsSchema } from "@/lib/airtable/schemas";
import { generateIcsContent } from "@/lib/ics/build";
import { isAuthenticated } from "@/lib/sign.server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) => {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Invalid key" }, { status: 401 });
  }

  const { sessionId } = await params;

  try {
    const record = await fetchSession(sessionId);
    const session = SessionFieldsSchema.parse(record.fields);

    if (!session.startTime || !session.endTime) {
      return NextResponse.json({ error: "Session missing start or end time" }, { status: 400 });
    }

    const icsContent = generateIcsContent([
      {
        id: sessionId,
        name: session.name,
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
        "Content-Disposition": `attachment; filename="session-${sessionId}.ics"`,
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error generating session ICS:", error);
    return NextResponse.json({ error: "Failed to generate calendar" }, { status: 500 });
  }
};

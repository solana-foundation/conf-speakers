import { isAuthenticated } from "@/lib/sign.server";
import { NextRequest, NextResponse } from "next/server";
import { SessionFieldsSchema } from "@/lib/airtable/schemas";
import { getZodErrorMessage, isZodError } from "@/lib/airtable/utils";
import { fetchSession } from "@/lib/airtable/fetch";

export const GET = async (request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) => {
  const { sessionId } = await params;

  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Invalid key" }, { status: 401 });
  }

  try {
    const record = await fetchSession(sessionId);

    const data = SessionFieldsSchema.parse(record.fields);

    return NextResponse.json({ id: sessionId, ...data });
  } catch (error) {
    console.error(error);

    if (isZodError(error)) {
      return NextResponse.json({ error: getZodErrorMessage(error) }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

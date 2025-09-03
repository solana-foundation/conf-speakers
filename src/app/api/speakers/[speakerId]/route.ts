import { isAuthenticated } from "@/lib/sign.server";
import { NextRequest, NextResponse } from "next/server";
import { fetchSpeaker } from "@/lib/airtable/fetch";
import { SpeakerFieldsSchema } from "@/lib/airtable/schemas";
import { getZodErrorMessage, isZodError } from "@/lib/airtable/utils";

export const GET = async (request: NextRequest, { params }: { params: Promise<{ speakerId: string }> }) => {
  const { speakerId } = await params;

  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Invalid key" }, { status: 401 });
  }

  try {
    const record = await fetchSpeaker(speakerId);

    const data = SpeakerFieldsSchema.parse(record.fields);

    return NextResponse.json({ id: speakerId, ...data });
  } catch (error) {
    console.error(error);

    if (isZodError(error)) {
      return NextResponse.json({ error: getZodErrorMessage(error) }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

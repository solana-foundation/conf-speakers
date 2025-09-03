import { fetchSessions } from "@/lib/airtable/fetch";
import { SessionFieldsSchema } from "@/lib/airtable/schemas";
import { getZodErrorMessage, isZodError } from "@/lib/airtable/utils";
import { isAuthenticated } from "@/lib/sign.server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Invalid key" }, { status: 401 });
  }

  try {
    const records = await fetchSessions();

    const data = records.map((record) => SessionFieldsSchema.parse(record.fields));

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    if (isZodError(error)) {
      return NextResponse.json({ error: getZodErrorMessage(error) }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

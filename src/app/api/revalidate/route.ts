import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isAuthenticated } from "@/lib/sign.server";

const COMMON_TAGS = ["sessions", "speaker", "speakers"];

export async function POST(request: NextRequest) {
  // Check authentication
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { tag } = body;

    if (tag && !COMMON_TAGS.includes(tag)) {
      return NextResponse.json({ error: "Invalid tag" }, { status: 400 });
    }

    if (tag) {
      // Revalidate by tag
      revalidateTag(tag);

      return NextResponse.json({
        message: `Cache revalidated for tag: ${tag}`,
        revalidated: true,
        timestamp: Date.now(),
      });
    }

    // If no specific tag or path, revalidate common cache tags
    COMMON_TAGS.forEach((tag) => revalidateTag(tag));

    return NextResponse.json({
      message: "Cache revalidated for all common tags",
      revalidated: true,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json({ error: "Failed to revalidate cache" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userAvatars } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return new NextResponse("User ID required", { status: 400 });
    }

    const avatar = await db.query.userAvatars.findFirst({
      where: eq(userAvatars.userId, id)
    });

    if (!avatar || !avatar.data) {
      return new NextResponse("Avatar not found", { status: 404 });
    }

    // The data is stored as a data URL: data:image/png;base64,....
    const matches = avatar.data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return new NextResponse("Invalid avatar format", { status: 500 });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    // Cache the image aggressively on the client side (1 day) and stale-while-revalidate for 7 days
    const headers = new Headers();
    headers.set("Content-Type", mimeType);
    headers.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");

    return new NextResponse(buffer, { headers });
  } catch (error) {
    console.error("Failed to fetch avatar:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

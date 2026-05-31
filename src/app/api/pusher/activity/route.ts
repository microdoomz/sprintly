import { NextRequest, NextResponse } from "next/server";
import { getPusherServer } from "@/lib/pusher/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { boardMembers, users, userAvatars } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { boardId, action } = body;

    if (!boardId || !action) {
      return new NextResponse("Missing data", { status: 400 });
    }

    // Verify channel access
    const membership = await db.query.boardMembers.findFirst({
      where: and(
        eq(boardMembers.boardId, boardId),
        eq(boardMembers.userId, session.user.id)
      )
    });

    if (!membership) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    
    // Check for user's full profile including avatar logic
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id)
    });

    const pusher = getPusherServer();
    if (!pusher) {
      return new NextResponse("Pusher not configured", { status: 503 });
    }

    // Include the full image URL. If it's a relative URL to the avatar API, we just pass it along
    const imageUrl = dbUser?.image || null;

    await pusher.trigger(`private-board-${boardId}`, "user-activity", {
      action, // 'start' or 'end'
      user: {
        id: session.user.id,
        name: session.user.name,
        image: imageUrl,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Pusher activity error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

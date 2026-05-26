import { NextRequest, NextResponse } from "next/server";
import { getPusherServer } from "@/lib/pusher/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { boardMembers } from "@/lib/db/schema";
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

    const data = await req.formData();
    const socketId = data.get("socket_id") as string;
    const channel = data.get("channel_name") as string;

    if (!socketId || !channel) {
      return new NextResponse("Missing data", { status: 400 });
    }

    // Verify channel access (private-board-xxx)
    if (channel.startsWith("private-board-")) {
      const boardId = channel.replace("private-board-", "");
      
      const membership = await db.query.boardMembers.findFirst({
        where: and(
          eq(boardMembers.boardId, boardId),
          eq(boardMembers.userId, session.user.id)
        )
      });

      if (!membership) {
        return new NextResponse("Forbidden", { status: 403 });
      }
    }

    const pusher = getPusherServer();
    if (!pusher) {
      // Graceful degradation if Pusher isn't configured
      return new NextResponse("Pusher not configured", { status: 503 });
    }

    const authResponse = pusher.authorizeChannel(socketId, channel, {
      user_id: session.user.id,
      user_info: {
        name: session.user.name,
      }
    });

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("Pusher auth error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

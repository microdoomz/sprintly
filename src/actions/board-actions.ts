"use server";

import { db } from "@/lib/db";
import { boards, boardMembers } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createBoard(data: { title: string; description?: string; coverColor?: string }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const newBoard = await db.transaction(async (tx) => {
      // 1. Create the board
      const [board] = await tx.insert(boards).values({
        title: data.title,
        description: data.description || null,
        coverColor: data.coverColor || "#8B5CF6",
        ownerId: session.user.id,
      }).returning();

      // 2. Add creator as a board member with 'owner' role
      await tx.insert(boardMembers).values({
        boardId: board.id,
        userId: session.user.id,
        role: "owner",
      });

      return board;
    });

    revalidatePath("/boards");
    revalidatePath("/dashboard");
    
    return { data: newBoard };
  } catch (error: any) {
    console.error("Failed to create board:", error);
    return { error: error.message || "Failed to create board" };
  }
}

export async function getBoards() {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return { error: "Unauthorized", data: null };
    }

    // Fetch boards where user is a member
    const userBoards = await db.query.boardMembers.findMany({
      where: eq(boardMembers.userId, session.user.id),
      with: {
        board: true
      },
    });

    return { data: userBoards.map(bm => bm.board) };
  } catch (error: any) {
    console.error("Failed to fetch boards:", error);
    return { error: error.message || "Failed to fetch boards", data: null };
  }
}

export async function getBoardById(boardId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return { error: "Unauthorized", data: null };
    }

    // Check if user is a member
    const membership = await db.query.boardMembers.findFirst({
      where: and(
        eq(boardMembers.boardId, boardId),
        eq(boardMembers.userId, session.user.id)
      )
    });

    if (!membership) {
      return { error: "Access denied or board not found", data: null };
    }

    const board = await db.query.boards.findFirst({
      where: eq(boards.id, boardId),
      with: {
        members: {
          with: {
            user: true
          }
        },
        tags: true
      }
    });

    return { data: board };
  } catch (error: any) {
    console.error("Failed to fetch board:", error);
    return { error: error.message || "Failed to fetch board", data: null };
  }
}

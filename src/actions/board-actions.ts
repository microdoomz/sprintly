"use server";

import { db } from "@/lib/db";
import { boards, boardMembers, users } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";
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

    // 1. Create the board
    const [board] = await db.insert(boards).values({
      title: data.title,
      description: data.description || null,
      coverColor: data.coverColor || "#8B5CF6",
      ownerId: session.user.id,
    }).returning();

    if (!board) {
      throw new Error("Failed to create board record");
    }

    // 2. Add creator as a board member with 'owner' role
    await db.insert(boardMembers).values({
      boardId: board.id,
      userId: session.user.id,
      role: "owner",
    });

    const newBoard = board;

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

    // Filter out soft-deleted boards
    return { data: userBoards.map(bm => bm.board).filter(b => b && b.deletedAt === null) };
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
      where: and(
        eq(boards.id, boardId),
        isNull(boards.deletedAt)
      ),
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

export async function deleteBoard(boardId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    // Check if user is owner of the board
    const board = await db.query.boards.findFirst({
      where: and(eq(boards.id, boardId), eq(boards.ownerId, session.user.id))
    });

    if (!board) {
      return { error: "Access denied. Only board owners can delete a board." };
    }

    await db.update(boards)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(boards.id, boardId));

    revalidatePath("/boards");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete board" };
  }
}

export async function updateBoard(boardId: string, data: { title: string; description?: string }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    // Check if user is owner/member (only owners/admin can update)
    const membership = await db.query.boardMembers.findFirst({
      where: and(
        eq(boardMembers.boardId, boardId),
        eq(boardMembers.userId, session.user.id)
      )
    });

    if (!membership || (membership.role !== "owner" && membership.role !== "admin")) {
      return { error: "Access denied. Only board owners can edit board details." };
    }

    await db.update(boards)
      .set({
        title: data.title,
        description: data.description || null,
        updatedAt: new Date(),
      })
      .where(eq(boards.id, boardId));

    revalidatePath(`/boards/${boardId}`);
    revalidatePath("/boards");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update board" };
  }
}

export async function addBoardMember(boardId: string, email: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    // Check if current user is owner/member (only owners/admin can invite)
    const membership = await db.query.boardMembers.findFirst({
      where: and(
        eq(boardMembers.boardId, boardId),
        eq(boardMembers.userId, session.user.id)
      )
    });

    if (!membership || (membership.role !== "owner" && membership.role !== "admin")) {
      return { error: "Access denied. Only board owners can invite members." };
    }

    // Find user by email
    const userToInvite = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (!userToInvite) {
      return { error: "User with this email is not registered in Sprintly. Ask them to create an account first." };
    }

    // Check if already a member
    const existingMember = await db.query.boardMembers.findFirst({
      where: and(
        eq(boardMembers.boardId, boardId),
        eq(boardMembers.userId, userToInvite.id)
      )
    });

    if (existingMember) {
      return { error: "User is already a member of this board" };
    }

    // Add to board_members
    await db.insert(boardMembers).values({
      boardId,
      userId: userToInvite.id,
      role: "member",
    });

    revalidatePath(`/boards/${boardId}`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to add member" };
  }
}

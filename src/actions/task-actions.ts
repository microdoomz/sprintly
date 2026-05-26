"use server";

import { db } from "@/lib/db";
import { tasks, subtasks, taskTags, tags, boardMembers } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { triggerEvent } from "@/lib/pusher/server";

// Helper to check board access
async function checkBoardAccess(boardId: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) return null;

  const membership = await db.query.boardMembers.findFirst({
    where: and(
      eq(boardMembers.boardId, boardId),
      eq(boardMembers.userId, session.user.id)
    )
  });

  if (!membership) return null;
  return session.user;
}

export async function getTasksForBoard(boardId: string) {
  try {
    const user = await checkBoardAccess(boardId);
    if (!user) return { error: "Unauthorized", data: null };

    const boardTasks = await db.query.tasks.findMany({
      where: eq(tasks.boardId, boardId),
      with: {
        subtasks: true,
        taskTags: {
          with: {
            tag: true
          }
        },
        creator: {
          columns: {
            id: true,
            name: true,
            image: true,
          }
        }
      },
      orderBy: (tasks, { asc }) => [asc(tasks.position)],
    });

    return { data: boardTasks };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch tasks", data: null };
  }
}

export async function createTask(data: {
  boardId: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: Date;
}) {
  try {
    const user = await checkBoardAccess(data.boardId);
    if (!user) return { error: "Unauthorized" };

    // Get highest position in the status column
    const existingTasks = await db.query.tasks.findMany({
      where: and(
        eq(tasks.boardId, data.boardId),
        eq(tasks.status, data.status)
      ),
      orderBy: (tasks, { desc }) => [desc(tasks.position)],
      limit: 1,
    });

    const newPosition = existingTasks.length > 0 ? existingTasks[0].position + 1024 : 1024;

    const [newTask] = await db.insert(tasks).values({
      boardId: data.boardId,
      title: data.title,
      description: data.description || null,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate || null,
      position: newPosition,
      createdBy: user.id,
    }).returning();

    // Broadcast the creation to all connected clients
    await triggerEvent(`private-board-${data.boardId}`, "task-created", {
      task: {
        ...newTask,
        subtasks: [],
        taskTags: [],
        creator: {
          id: user.id,
          name: user.name,
          image: user.image
        }
      }
    });

    revalidatePath(`/boards/${data.boardId}`);
    return { data: newTask };
  } catch (error: any) {
    return { error: error.message || "Failed to create task" };
  }
}

export async function updateTaskStatus(taskId: string, boardId: string, newStatus: string, newPosition: number) {
  try {
    const user = await checkBoardAccess(boardId);
    if (!user) return { error: "Unauthorized" };

    await db.update(tasks)
      .set({ status: newStatus, position: newPosition, updatedAt: new Date() })
      .where(eq(tasks.id, taskId));

    // Broadcast the task move
    await triggerEvent(`private-board-${boardId}`, "task-moved", {
      taskId,
      newStatus,
      newPosition
    });

    // Revalidate asynchronously to avoid blocking the drag-and-drop response
    revalidatePath(`/boards/${boardId}`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update task" };
  }
}

export async function deleteTask(taskId: string, boardId: string) {
  try {
    const user = await checkBoardAccess(boardId);
    if (!user) return { error: "Unauthorized" };

    await db.delete(tasks).where(eq(tasks.id, taskId));

    // Broadcast the task deletion
    await triggerEvent(`private-board-${boardId}`, "task-deleted", {
      taskId
    });

    revalidatePath(`/boards/${boardId}`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete task" };
  }
}

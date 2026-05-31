import { db } from "@/lib/db";
import { boards, boardMembers, tasks } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BoardWorkspace } from "@/components/boards/board-workspace";
import { BoardSettingsDialog } from "@/components/boards/board-settings-dialog";
import { ShareBoardDialog } from "@/components/boards/share-board-dialog";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { Suspense } from "react";
import { unstable_noStore as noStore } from "next/cache";
import BoardLoading from "./loading";

async function BoardContent({ boardId }: { boardId: string }) {
  noStore();
  
  // Single session check — middleware already validated auth.
  // Previously this page made 4 separate getSession() calls
  // (page + getBoardById + getTasksForBoard's checkBoardAccess).
  // Now we do it once and query the DB directly.
  const session = await auth.api.getSession({ headers: await headers() });
  const currentUserId = session?.user?.id || "";

  if (!currentUserId) {
    notFound();
  }

  // Verify membership and fetch board + tasks all in parallel
  const [membership, board, boardTasks] = await Promise.all([
    db.query.boardMembers.findFirst({
      where: and(
        eq(boardMembers.boardId, boardId),
        eq(boardMembers.userId, currentUserId)
      )
    }),
    db.query.boards.findFirst({
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
    }),
    db.query.tasks.findMany({
      where: and(
        eq(tasks.boardId, boardId),
        isNull(tasks.deletedAt)
      ),
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
    })
  ]);

  if (!membership || !board) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Board Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-4">
          <div 
            className="w-8 h-8 rounded flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: board.coverColor || '#7C3AED' }}
          >
            {board.icon || board.title.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{board.title}</h1>
            {board.description && (
              <p className="text-sm text-muted-foreground">{board.description}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Members */}
          <div className="flex -space-x-2 mr-4">
            {board.members?.map((member: any) => (
              <Avatar key={member.id} className="h-8 w-8 border-2 border-background" title={member.user.name}>
                <AvatarImage src={member.user.image || ""} />
                <AvatarFallback className="text-xs bg-primary/20 text-primary">
                  {member.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          
          {currentUserId === board.ownerId && (
            <ShareBoardDialog board={board} currentUserId={currentUserId} />
          )}
          <BoardSettingsDialog board={board} />
        </div>
      </div>

      <BoardWorkspace key={board.id} boardId={board.id} boardTags={board.tags || []} initialTasks={boardTasks || []} boardColor={board.coverColor} />
    </div>
  );
}

export default async function SingleBoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const boardId = resolvedParams.id;

  return (
    <Suspense fallback={<BoardLoading />}>
      <BoardContent boardId={boardId} />
    </Suspense>
  );
}

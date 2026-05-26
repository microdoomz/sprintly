export const dynamic = "force-dynamic";

import { getBoardById } from "@/actions/board-actions";
import { getTasksForBoard } from "@/actions/task-actions";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BoardWorkspace } from "@/components/boards/board-workspace";
import { BoardSettingsDialog } from "@/components/boards/board-settings-dialog";
import { ShareBoardDialog } from "@/components/boards/share-board-dialog";

export default async function SingleBoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const boardId = resolvedParams.id;

  const { data: board, error: boardError } = await getBoardById(boardId);
  
  if (boardError || !board) {
    notFound();
  }

  const tasksData = await getTasksForBoard(boardId);

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
          
          <ShareBoardDialog board={board} />
          <BoardSettingsDialog board={board} />
        </div>
      </div>

      <BoardWorkspace boardId={board.id} boardTags={board.tags || []} initialTasks={tasksData.data || []} />
    </div>
  );
}

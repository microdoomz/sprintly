import { getBoardById } from "@/actions/board-actions";
import { getTasksForBoard } from "@/actions/task-actions";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BoardWorkspace } from "@/components/boards/board-workspace";
import { BoardSettingsDialog } from "@/components/boards/board-settings-dialog";

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
          {/* Members (Mock UI for MVP) */}
          <div className="flex -space-x-2 mr-4">
            <Avatar className="h-8 w-8 border-2 border-background">
              <AvatarImage src="" />
              <AvatarFallback className="text-xs">U1</AvatarFallback>
            </Avatar>
            <Avatar className="h-8 w-8 border-2 border-background">
              <AvatarImage src="" />
              <AvatarFallback className="text-xs">U2</AvatarFallback>
            </Avatar>
          </div>
          
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <UserPlus className="h-4 w-4 mr-2" />
            Share
          </Button>
          <BoardSettingsDialog board={board} />
        </div>
      </div>

      <BoardWorkspace boardId={board.id} initialTasks={tasksData.data || []} />
    </div>
  );
}

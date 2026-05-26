import { getBoardById } from "@/actions/board-actions";
import { getTasksForBoard } from "@/actions/task-actions";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Settings, UserPlus, ListFilter } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { KanbanBoard } from "@/components/boards/kanban-board";
import { BoardSettingsDialog } from "@/components/boards/board-settings-dialog";

export default async function SingleBoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const boardId = resolvedParams.id;
  
  const [boardRes, tasksRes] = await Promise.all([
    getBoardById(boardId),
    getTasksForBoard(boardId),
  ]);

  const { data: board, error: boardError } = boardRes;
  const { data: tasks, error: tasksError } = tasksRes;

  if (boardError || !board) {
    notFound();
  }

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.32))] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div 
            className="w-4 h-8 rounded-sm" 
            style={{ backgroundColor: board.coverColor || '#8B5CF6' }} 
          />
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{board.title}</h2>
            {board.description && (
              <p className="text-sm text-muted-foreground">{board.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex -space-x-2 mr-4">
            {board.members.map((member) => (
              <Avatar key={member.user.id} className="h-8 w-8 border-2 border-background">
                <AvatarImage src={member.user.image || ""} />
                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                  {member.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <UserPlus className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <ListFilter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <BoardSettingsDialog board={board} />
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-muted/30 rounded-xl border border-border p-4 overflow-x-auto">
        <KanbanBoard boardId={board.id} initialTasks={tasks || []} />
      </div>
    </div>
  );
}

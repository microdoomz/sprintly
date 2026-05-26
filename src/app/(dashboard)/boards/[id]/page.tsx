import { getBoardById } from "@/actions/board-actions";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Settings, UserPlus, ListFilter } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function SingleBoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { data: board, error } = await getBoardById(resolvedParams.id);

  if (error || !board) {
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
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-muted/30 rounded-xl border border-border p-4 overflow-x-auto">
        <div className="flex h-full gap-4 min-w-max">
          {/* Kanban Columns Mock */}
          <div className="w-80 flex flex-col bg-card rounded-lg border border-border">
            <div className="p-3 font-semibold border-b border-border flex justify-between items-center">
              <span>To Do</span>
              <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">3</span>
            </div>
            <div className="flex-1 p-2 space-y-2 overflow-y-auto">
              <div className="bg-background p-3 rounded shadow-sm border border-border text-sm">
                Design new landing page
              </div>
              <div className="bg-background p-3 rounded shadow-sm border border-border text-sm">
                Set up Better Auth
              </div>
            </div>
          </div>

          <div className="w-80 flex flex-col bg-card rounded-lg border border-border">
            <div className="p-3 font-semibold border-b border-border flex justify-between items-center">
              <span>In Progress</span>
              <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">1</span>
            </div>
            <div className="flex-1 p-2 space-y-2 overflow-y-auto">
              <div className="bg-background p-3 rounded shadow-sm border border-border text-sm">
                Create database schema
              </div>
            </div>
          </div>

          <div className="w-80 flex flex-col bg-card rounded-lg border border-border">
            <div className="p-3 font-semibold border-b border-border flex justify-between items-center">
              <span>Done</span>
              <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">0</span>
            </div>
            <div className="flex-1 p-2 space-y-2 overflow-y-auto">
              {/* Empty state */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateBoardDialog } from "@/components/boards/create-board-dialog";
import Link from "next/link";
import { SmartLink } from "@/components/ui/smart-link";
import { getBoards } from "@/actions/board-actions";
import { formatDistanceToNow } from "date-fns";
import { Suspense } from "react";
import { unstable_noStore as noStore } from "next/cache";
import BoardsLoading from "./loading";

async function BoardsContent() {
  noStore();
  const { data: boards, error } = await getBoards();

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Boards</h2>
          <p className="text-muted-foreground">
            Manage your projects and collaborate with your team.
          </p>
        </div>
        <CreateBoardDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Board
          </Button>
        </CreateBoardDialog>
      </div>

      {error ? (
        <div className="text-red-500 border border-red-500/20 bg-red-500/10 p-4 rounded-md">
          {error}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <CreateBoardDialog>
            <div className="group flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-transparent hover:border-primary/50 hover:bg-accent/50 transition">
              <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary transition" />
              <span className="mt-2 text-sm font-medium text-muted-foreground group-hover:text-primary transition">
                Create New Board
              </span>
            </div>
          </CreateBoardDialog>

          {boards?.map((board) => (
            <SmartLink key={board.id} href={`/boards/${board.id}`}>
              <Card className="h-48 hover:border-primary transition cursor-pointer group flex flex-col overflow-hidden relative">
                <div className="h-2 w-full absolute top-0 left-0" style={{ backgroundColor: board.coverColor || '#8B5CF6' }} />
                <CardHeader className="pt-6">
                  <CardTitle className="flex justify-between items-start">
                    {board.title}
                  </CardTitle>
                  {board.description && (
                    <CardDescription className="line-clamp-2 mt-2">
                      {board.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="mt-auto flex justify-between items-center pb-4">
                  <span className="text-xs text-muted-foreground">
                    Updated {formatDistanceToNow(new Date(board.updatedAt), { addSuffix: true })}
                  </span>
                  <div className="flex -space-x-2">
                    {/* Real avatars would go here, mock for now */}
                    <div className="h-6 w-6 rounded-full bg-primary/20 border border-background flex items-center justify-center text-[10px] text-primary">JD</div>
                  </div>
                </CardContent>
              </Card>
            </SmartLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BoardsPage() {
  return (
    <Suspense fallback={<BoardsLoading />}>
      <BoardsContent />
    </Suspense>
  );
}

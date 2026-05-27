export const dynamic = "force-dynamic";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Clock, LayoutDashboard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { db } from "@/lib/db";
import { boardMembers, tasks } from "@/lib/db/schema";
import { eq, inArray, and, isNull } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CreateBoardDialog } from "@/components/boards/create-board-dialog";
import { DashboardTiles } from "@/components/dashboard/dashboard-tiles";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { activityLogs } from "@/lib/db/schema";
import { Suspense } from "react";
import DashboardLoading from "./loading";

function formatTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

async function DashboardContent() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    redirect("/login");
  }

  // 1. Fetch user boards
  const memberships = await db.query.boardMembers.findMany({
    where: eq(boardMembers.userId, session.user.id),
    with: {
      board: true,
    },
  });

  const myBoards = memberships
    .map((bm) => bm.board)
    .filter((b) => b && !b.deletedAt); // Filter out soft-deleted boards
  const totalBoards = myBoards.length;

  // 3. Fetch activity logs and tasks for all user boards
  let userTasks: any[] = [];
  let activities: any[] = [];
  if (myBoards.length > 0) {
    const boardIds = myBoards.map((b) => b.id);
    
    // Fallback: If no tasks/activities are recorded yet, we fetch them empty
    userTasks = await db.query.tasks.findMany({
      where: and(
        inArray(tasks.boardId, boardIds),
        isNull(tasks.deletedAt)
      ),
      with: {
        creator: {
          columns: {
            name: true,
            image: true,
          },
        },
        board: {
          columns: {
            title: true,
          },
        },
      },
      orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
    });

    activities = await db.query.activityLogs.findMany({
      where: inArray(activityLogs.boardId, boardIds),
      with: {
        user: {
          columns: {
            name: true,
            image: true,
          }
        },
        board: {
          columns: {
            title: true,
          }
        }
      },
      orderBy: (activityLogs, { desc }) => [desc(activityLogs.createdAt)],
      limit: 50,
    });
  }

  return (
    <div className="flex-1 space-y-6 overflow-hidden p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s an overview of your projects.
          </p>
        </div>
        <CreateBoardDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Board
          </Button>
        </CreateBoardDialog>
      </div>

      <div className="w-full">
        <DashboardTiles tasks={userTasks} boards={myBoards} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Boards</CardTitle>
            <CardDescription>
              Your most recently active boards
            </CardDescription>
          </CardHeader>
          <CardContent>
            {myBoards.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg border-muted-foreground/25">
                <LayoutDashboard className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">No boards created yet</p>
                <p className="text-xs text-muted-foreground mb-4">Get started by creating your first board.</p>
                <CreateBoardDialog>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Board
                  </Button>
                </CreateBoardDialog>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {myBoards.slice(0, 4).map((board) => (
                  <Link key={board.id} href={`/boards/${board.id}`}>
                    <div className="group rounded-lg border p-4 hover:border-primary transition flex flex-col space-y-2 cursor-pointer bg-card hover:bg-accent/50 relative overflow-hidden h-28 justify-between">
                      <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: board.coverColor || '#8B5CF6' }} />
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-sm line-clamp-1">{board.title}</div>
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: board.coverColor || '#8B5CF6' }} />
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {board.description || "No description provided."}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <RecentActivity activities={activities} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}

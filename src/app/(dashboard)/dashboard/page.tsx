import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Clock, LayoutDashboard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s an overview of your projects.
          </p>
        </div>
        <Button asChild>
          <Link href="/boards">
            <Plus className="mr-2 h-4 w-4" />
            New Board
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Boards</CardTitle>
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              +1 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              4 due today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              +12 this week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Boards</CardTitle>
            <CardDescription>
              Your most recently active boards
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {/* Mock Boards */}
            {[1, 2].map((i) => (
              <Link key={i} href={`/boards/${i}`}>
                <div className="group rounded-lg border p-4 hover:border-primary transition flex flex-col space-y-2 cursor-pointer bg-card hover:bg-accent/50">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">Project Beta {i}</div>
                    <div className="h-3 w-3 rounded-full bg-violet-500" />
                  </div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    Marketing website redesign and development tracking.
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              What&apos;s happening across your boards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Mock Activity */}
              <div className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    John Doe moved a task
                  </p>
                  <p className="text-sm text-muted-foreground">
                    "Update landing page copy" moved to Done
                  </p>
                </div>
                <div className="ml-auto font-medium text-xs text-muted-foreground">
                  2m ago
                </div>
              </div>
              <div className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    You created a new task
                  </p>
                  <p className="text-sm text-muted-foreground">
                    "Setup authentication" in Project Beta
                  </p>
                </div>
                <div className="ml-auto font-medium text-xs text-muted-foreground">
                  1h ago
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

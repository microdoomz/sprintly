"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckSquare, ListTodo, Calendar, Folder } from "lucide-react";
import { format } from "date-fns";

interface TaskWithBoard {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string | Date | null;
  board: {
    title: string;
  } | null;
}

interface DashboardTilesProps {
  tasks: TaskWithBoard[];
  boards?: any[];
}

const priorityColors: Record<string, string> = {
  urgent: "bg-red-500/10 text-red-500 border-red-500/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

export function DashboardTiles({ tasks, boards = [] }: DashboardTilesProps) {
  const [activeTab, setActiveTab] = useState<"todo" | "in-progress" | "done" | "boards" | null>(null);

  const todoTasks = tasks.filter((t) => t.status === "todo");
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress");
  const completedTasks = tasks.filter((t) => t.status === "done");

  const activeTasks = activeTab === "todo" 
    ? todoTasks 
    : activeTab === "in-progress" 
    ? inProgressTasks 
    : activeTab === "done" 
    ? completedTasks 
    : [];

  const getTabTitle = () => {
    if (activeTab === "todo") return "To Do Tasks";
    if (activeTab === "in-progress") return "Tasks In Progress";
    if (activeTab === "done") return "Completed Tasks";
    if (activeTab === "boards") return "All Boards";
    return "";
  };

  const getTabDescription = () => {
    if (activeTab === "boards") {
      return `You have ${boards.length} board${boards.length === 1 ? "" : "s"} across your workspaces.`;
    }
    const count = activeTasks.length;
    return `You have ${count} ${activeTab === "in-progress" ? "in-progress" : activeTab} task${count === 1 ? "" : "s"}.`;
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Boards Tile */}
        <Card 
          className="cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-all group"
          onClick={() => setActiveTab("boards")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Boards</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground group-hover:text-primary transition" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{boards.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across your workspaces
            </p>
          </CardContent>
        </Card>

        {/* To Do Tile */}
        <Card 
          className="cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-all group"
          onClick={() => setActiveTab("todo")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">To Do Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground group-hover:text-primary transition" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todoTasks.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tasks waiting to be started
            </p>
          </CardContent>
        </Card>

        {/* In Progress Tile */}
        <Card 
          className="cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-all group"
          onClick={() => setActiveTab("in-progress")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground group-hover:text-primary transition" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently actively being worked on
            </p>
          </CardContent>
        </Card>

        {/* Completed Tile */}
        <Card 
          className="cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-all group"
          onClick={() => setActiveTab("done")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground group-hover:text-primary transition" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Successfully completed
            </p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={activeTab !== null} onOpenChange={(open) => !open && setActiveTab(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-6">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              {activeTab === "todo" && <ListTodo className="h-5 w-5 text-primary" />}
              {activeTab === "in-progress" && <Clock className="h-5 w-5 text-primary" />}
              {activeTab === "done" && <CheckSquare className="h-5 w-5 text-primary" />}
              {activeTab === "boards" && <Folder className="h-5 w-5 text-primary" />}
              {getTabTitle()}
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-muted-foreground">
              {getTabDescription()}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4 py-4 min-h-[300px]">
            {activeTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                <CheckSquare className="h-10 w-10 opacity-30 mb-2" />
                <p className="text-sm font-medium">No tasks found</p>
                <p className="text-xs">There are no tasks with this status currently.</p>
              </div>
            ) : activeTab === "boards" ? (
              <div className="space-y-4">
                {boards.map((board) => (
                  <div 
                    key={board.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/40 transition gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: board.coverColor || '#8B5CF6' }} />
                        <span className="font-semibold text-sm leading-tight text-foreground truncate block">
                          {board.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="truncate">{board.description || "No description provided."}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {activeTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/40 transition gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm leading-tight text-foreground truncate block">
                          {task.title}
                        </span>
                        <Badge variant="outline" className={priorityColors[task.priority] || ""}>
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Folder className="h-3.5 w-3.5" />
                          {task.board?.title || "Unknown Board"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center text-xs text-muted-foreground shrink-0 gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {task.dueDate ? (
                        <span className="font-medium">
                          {format(new Date(task.dueDate), "MMM dd, yyyy")}
                        </span>
                      ) : (
                        <span>No due date</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

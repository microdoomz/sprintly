"use client";

import { useState, useMemo, useEffect } from "react";
import { TaskType } from "@/components/tasks/task-card";
import { KanbanBoard } from "./kanban-board";
import { ListTableView } from "./list-table-view";
import { getPusherClient } from "@/lib/pusher/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LayoutGrid, List as ListIcon, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BoardWorkspaceProps {
  boardId: string;
  initialTasks: TaskType[];
}

export function BoardWorkspace({ boardId, initialTasks }: BoardWorkspaceProps) {
  const [tasks, setTasks] = useState<TaskType[]>(initialTasks);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"position" | "newest" | "priority">("position");

  // Sync state if initial tasks change from server
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  // Realtime Pusher Subscriptions
  useEffect(() => {
    const pusher = getPusherClient();
    if (!pusher) return;

    const channel = pusher.subscribe(`private-board-${boardId}`);

    channel.bind("task-created", (data: { task: TaskType }) => {
      setTasks((current) => {
        if (current.some(t => t.id === data.task.id)) return current;
        return [...current, data.task];
      });
    });

    channel.bind("task-moved", (data: { taskId: string; newStatus: string; newPosition: number }) => {
      setTasks((current) => 
        current.map(t => 
          t.id === data.taskId 
            ? { ...t, status: data.newStatus, position: data.newPosition } 
            : t
        ).sort((a, b) => a.position - b.position)
      );
    });

    channel.bind("task-deleted", (data: { taskId: string }) => {
      setTasks((current) => current.filter(t => t.id !== data.taskId));
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`private-board-${boardId}`);
    };
  }, [boardId]);

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    if (search) {
      result = result.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase()));
    }
    
    if (filterPriority !== "all") {
      result = result.filter(t => t.priority === filterPriority);
    }

    if (filterStatus !== "all") {
      result = result.filter(t => t.status === filterStatus);
    }

    // Sort
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "priority") {
      const priorityWeights: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
      result.sort((a, b) => (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0));
    } else {
      // position sort is default
      result.sort((a, b) => a.position - b.position);
    }

    return result;
  }, [tasks, search, filterPriority, filterStatus, sortBy]);

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.32))] space-y-4">
      {/* Workspace Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center bg-card p-2 rounded-lg border">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input 
            placeholder="Search tasks..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-[250px] h-9"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                Filter & Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Priority</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={filterPriority} onValueChange={setFilterPriority}>
                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="urgent">Urgent</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="high">High</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="medium">Medium</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="low">Low</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={filterStatus} onValueChange={setFilterStatus}>
                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="todo">To Do</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="in-progress">In Progress</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="done">Done</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <DropdownMenuRadioItem value="position">Custom (Drag)</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="priority">Highest Priority</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as "kanban" | "list")} className="justify-start">
          <ToggleGroupItem value="kanban" aria-label="Kanban View" className="h-9 px-3">
            <LayoutGrid className="h-4 w-4 mr-2" />
            Board
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List View" className="h-9 px-3">
            <ListIcon className="h-4 w-4 mr-2" />
            List
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Render View */}
      {view === "kanban" ? (
        <KanbanBoard 
          boardId={boardId} 
          tasks={filteredAndSortedTasks} 
          setTasks={setTasks}
          // If filtered, we might want to disable drag-and-drop to avoid position corruption
          isFiltered={search !== "" || filterPriority !== "all" || filterStatus !== "all" || sortBy !== "position"} 
        />
      ) : (
        <ListTableView tasks={filteredAndSortedTasks} />
      )}
    </div>
  );
}

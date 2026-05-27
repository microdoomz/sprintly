"use client";

import { useMemo } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { TaskCard, TaskType } from "@/components/tasks/task-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateTaskDialog } from "@/components/tasks/task-dialog";

interface KanbanColumnProps {
  id: string;
  boardId: string;
  title: string;
  tasks: TaskType[];
  boardTags?: any[];
  boardColor?: string | null;
}

export function KanbanColumn({ id, boardId, title, tasks, boardTags = [], boardColor }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      type: "Column",
      columnId: id,
    },
  });

  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);

  return (
    <div className="flex flex-col h-full w-80 min-w-80 bg-card/50 rounded-xl border border-border">
      <div 
        className="p-4 flex items-center justify-between border-b border-border/50 bg-card rounded-t-xl"
        style={boardColor ? { borderTop: `3px solid ${boardColor}` } : {}}
      >
        <h3 className="font-semibold text-sm tracking-tight">{title}</h3>
        <span className="bg-muted text-muted-foreground text-xs font-medium px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      <div className="flex-1 flex flex-col min-h-0 relative">
        <ScrollArea className="h-full">
          <div
            ref={setNodeRef}
            className="flex flex-col gap-3 p-3 min-h-[150px] h-full"
          >
            <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} boardTags={boardTags} boardColor={boardColor} />
              ))}
            </SortableContext>
          </div>
        </ScrollArea>
      </div>

      <div className="p-2 border-t border-border/50 bg-card/50 rounded-b-xl">
        <CreateTaskDialog boardId={boardId} status={id} />
      </div>
    </div>
  );
}

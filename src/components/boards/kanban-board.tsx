"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import { KanbanColumn } from "./kanban-column";
import { TaskCard, TaskType } from "@/components/tasks/task-card";
import { updateTaskStatus } from "@/actions/task-actions";
import { getPusherClient } from "@/lib/pusher/client";
import { toast } from "sonner";
import { useSession } from "@/lib/auth/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ActiveEditor {
  id: string;
  name: string;
  image: string | null;
  timeoutId: NodeJS.Timeout;
}

interface KanbanBoardProps {
  boardId: string;
  tasks: TaskType[];
  setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
  isFiltered?: boolean;
  boardTags?: any[];
  boardColor?: string | null;
}

const COLUMNS = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

export function KanbanBoard({ boardId, tasks, setTasks, isFiltered = false, boardTags = [], boardColor }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const [activeEditors, setActiveEditors] = useState<Record<string, ActiveEditor>>({});
  const { data: session } = useSession();
  
  useEffect(() => {
    const pusher = getPusherClient();
    if (!pusher) return;

    const channelName = `private-board-${boardId}`;
    let channel = pusher.channels.channels[channelName];
    if (!channel) {
      channel = pusher.subscribe(channelName);
    }

    const handleUserActivity = (data: { action: string; user: { id: string; name: string; image: string | null } }) => {
      // Don't show our own activity
      if (session?.user?.id && data.user.id === session.user.id) return;

      setActiveEditors((prev) => {
        const newEditors = { ...prev };
        
        if (data.action === "start") {
          // Clear old timeout if exists
          if (newEditors[data.user.id]?.timeoutId) {
            clearTimeout(newEditors[data.user.id].timeoutId);
          }
          
          // Set auto-remove after 10s of inactivity
          const timeoutId = setTimeout(() => {
            setActiveEditors((current) => {
              const updated = { ...current };
              delete updated[data.user.id];
              return updated;
            });
          }, 10000);
          
          newEditors[data.user.id] = { ...data.user, timeoutId };
        } else if (data.action === "end") {
          if (newEditors[data.user.id]?.timeoutId) {
            clearTimeout(newEditors[data.user.id].timeoutId);
          }
          delete newEditors[data.user.id];
        }
        
        return newEditors;
      });
    };

    channel.bind("user-activity", handleUserActivity);

    return () => {
      channel.unbind("user-activity", handleUserActivity);
      // Clean up timeouts
      setActiveEditors((prev) => {
        Object.values(prev).forEach((editor) => clearTimeout(editor.timeoutId));
        return {};
      });
    };
  }, [boardId, session?.user?.id]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
      fetch("/api/pusher/activity", {
        method: "POST",
        body: JSON.stringify({ boardId, action: "start" }),
      }).catch(console.error);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    const isOverColumn = over.data.current?.type === "Column";

    if (!isActiveTask) return;

    setTasks((tasks) => {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);

      if (isOverTask) {
        const overTask = tasks[overIndex];
        if (tasks[activeIndex].status !== overTask.status) {
          const newTasks = [...tasks];
          newTasks[activeIndex].status = overTask.status;
          return arrayMove(newTasks, activeIndex, overIndex);
        }
        return arrayMove(tasks, activeIndex, overIndex);
      }

      if (isOverColumn) {
        const overColumnId = over.id as string;
        if (tasks[activeIndex].status !== overColumnId) {
          const newTasks = [...tasks];
          newTasks[activeIndex].status = overColumnId;
          return arrayMove(newTasks, activeIndex, newTasks.length - 1);
        }
      }

      return tasks;
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    fetch("/api/pusher/activity", {
      method: "POST",
      body: JSON.stringify({ boardId, action: "end" }),
    }).catch(console.error);
    
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id;

    if (activeId === overId) return;

    let newPosition = 0;
    let finalTask: TaskType | null = null;

    setTasks((currentTasks) => {
      const activeTaskIndex = currentTasks.findIndex((t) => t.id === activeId);
      if (activeTaskIndex === -1) return currentTasks;

      const activeTask = currentTasks[activeTaskIndex];
      finalTask = activeTask;

      // Calculate new position based on neighbors
      const tasksInColumn = currentTasks.filter((t) => t.status === activeTask.status);
      const columnIdx = tasksInColumn.findIndex((t) => t.id === activeId);

      if (tasksInColumn.length === 1) {
        newPosition = 1024;
      } else if (columnIdx === 0) {
        newPosition = tasksInColumn[1].position / 2;
      } else if (columnIdx === tasksInColumn.length - 1) {
        newPosition = tasksInColumn[columnIdx - 1].position + 1024;
      } else {
        newPosition = (tasksInColumn[columnIdx - 1].position + tasksInColumn[columnIdx + 1].position) / 2;
      }

      // Optimistically update state position
      const updatedTasks = [...currentTasks];
      updatedTasks[activeTaskIndex] = { ...activeTask, position: newPosition };
      return updatedTasks;
    });

    if (finalTask) {
      // Call server action
      const res = await updateTaskStatus((finalTask as TaskType).id, boardId, (finalTask as TaskType).status, newPosition);
      if (res.error) {
        toast.error(res.error);
      }
    }
  };

  return (
    <DndContext
      sensors={isFiltered ? [] : sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {Object.values(activeEditors).length > 0 && (
        <div className="flex items-center gap-2 mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex -space-x-2">
            {Object.values(activeEditors).map((editor) => (
              <Avatar key={editor.id} className="w-8 h-8 border-2 border-background shadow-sm">
                <AvatarImage src={editor.image || ""} />
                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                  {editor.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="text-xs text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-border/50 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {Object.values(activeEditors).length === 1 
              ? `${Object.values(activeEditors)[0].name.split(" ")[0]} is moving a task...` 
              : `${Object.values(activeEditors).length} people are moving tasks...`}
          </span>
        </div>
      )}
      <div className="flex flex-col md:flex-row h-full gap-4 md:min-w-max pb-4">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            boardId={boardId}
            title={col.title}
            tasks={tasks.filter((t) => t.status === col.id)}
            boardTags={boardTags}
            boardColor={boardColor}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeTask ? (
          <div className="opacity-100 shadow-2xl rotate-2 scale-105 transition-transform cursor-grabbing">
            <TaskCard task={activeTask} boardTags={boardTags} boardColor={boardColor} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import { KanbanColumn } from "./kanban-column";
import { TaskCard, TaskType } from "@/components/tasks/task-card";
import { updateTaskStatus } from "@/actions/task-actions";
import { getPusherClient } from "@/lib/pusher/client";
import { toast } from "sonner";

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

export function KanbanBoard({ boardId, tasks, setTasks, isFiltered = false, boardTags = [], boardColor }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
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
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTaskIndex = tasks.findIndex((t) => t.id === activeId);
    if (activeTaskIndex === -1) return;

    const activeTask = tasks[activeTaskIndex];
    let newPosition = 0;

    // Calculate new position based on neighbors
    const tasksInColumn = tasks.filter((t) => t.status === activeTask.status);
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
    const updatedTasks = [...tasks];
    updatedTasks[activeTaskIndex].position = newPosition;
    setTasks(updatedTasks);

    // Call server action
    const res = await updateTaskStatus(activeTask.id, boardId, activeTask.status, newPosition);
    if (res.error) {
      toast.error(res.error);
      // Rollback is complex here without full backup, but we can trigger a refresh or let Pusher sync it
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
      <div className="flex h-full gap-4 min-w-max pb-4">
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

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div className="opacity-90 shadow-2xl rotate-2 scale-105 transition-transform cursor-grabbing">
            <TaskCard task={activeTask} boardTags={boardTags} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

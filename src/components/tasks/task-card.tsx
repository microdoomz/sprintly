import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { Clock, MessageSquare, CheckSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TaskEditDialog } from "./task-edit-dialog";

export interface TaskType {
  id: string;
  boardId: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  subtasks: any[];
  taskTags: any[];
  creator: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface TaskCardProps {
  task: TaskType;
  boardTags?: any[];
}

export function TaskCard({ task, boardTags = [] }: TaskCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const priorityColors: Record<string, string> = {
    low: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    high: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
    urgent: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-50 border-2 border-primary rounded-lg h-[120px] bg-accent/50 w-full"
      />
    );
  }

  const completedSubtasks = task.subtasks?.filter((st) => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Card 
          className="cursor-grab hover:ring-2 hover:ring-primary/50 hover:shadow-md transition-all active:cursor-grabbing"
          onClick={() => setIsEditDialogOpen(true)}
        >
        <CardContent className="p-4 flex flex-col gap-3">
          <div className="flex justify-between items-start gap-2">
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className={priorityColors[task.priority.toLowerCase()] || priorityColors.medium}>
                {task.priority}
              </Badge>
              {task.taskTags?.map((tt) => (
                <Badge key={tt.tag.id} variant="outline" style={{ borderColor: tt.tag.color, color: tt.tag.color }}>
                  {tt.tag.name}
                </Badge>
              ))}
            </div>
            {/* Context menu trigger could go here */}
          </div>

          <h4 className="font-medium text-sm leading-tight break-words">
            {task.title}
          </h4>

          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-1 pt-3 border-t border-border">
            <div className="flex items-center gap-3 text-muted-foreground text-xs font-medium">
              {task.dueDate && (
                <div className={`flex items-center gap-1 ${new Date() > new Date(task.dueDate) ? 'text-red-500' : ''}`}>
                  <Clock className="h-3 w-3" />
                  <span>{format(new Date(task.dueDate), "MMM d")}</span>
                </div>
              )}
              {totalSubtasks > 0 && (
                <div className={`flex items-center gap-1 ${completedSubtasks === totalSubtasks ? 'text-green-500' : ''}`}>
                  <CheckSquare className="h-3 w-3" />
                  <span>{completedSubtasks}/{totalSubtasks}</span>
                </div>
              )}
            </div>
            
            <Avatar className="h-6 w-6">
              <AvatarImage src={task.creator.image || ""} />
              <AvatarFallback className="bg-primary/20 text-primary text-[10px]">
                {task.creator.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </CardContent>
      </Card>
      </div>

      <TaskEditDialog
        task={task}
        boardId={task.boardId}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        boardTags={boardTags}
      />
    </>
  );
}

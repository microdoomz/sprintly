"use client";

import { useState } from "react";
import { format } from "date-fns";
import { TaskType } from "./task-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SubtaskList } from "./subtask-list";
import { TagSelector } from "./tag-selector";
import { Trash2, Calendar, User } from "lucide-react";
import { deleteTask } from "@/actions/task-actions";
import { toast } from "sonner";

interface TaskEditDialogProps {
  task: TaskType;
  boardId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskEditDialog({ task, boardId, open, onOpenChange }: TaskEditDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await deleteTask(task.id, boardId);
      if (res.error) throw new Error(res.error);
      
      toast.success("Task deleted");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete task");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] gap-0 p-0 overflow-hidden">
        <div className="p-6 pb-4">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4 pr-6">
              <DialogTitle className="text-xl leading-tight">{task.title}</DialogTitle>
            </div>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-2">
                {task.description}
              </p>
            )}
          </DialogHeader>
        </div>

        <div className="px-6 py-4 bg-muted/30 border-y border-border/50 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-muted-foreground text-xs font-medium">Status</span>
            <div className="font-medium capitalize">{task.status.replace('-', ' ')}</div>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground text-xs font-medium">Priority</span>
            <div><Badge variant="secondary" className="capitalize">{task.priority}</Badge></div>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground text-xs font-medium">Due Date</span>
            <div className="flex items-center gap-2 font-medium">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "None"}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground text-xs font-medium">Created By</span>
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={task.creator?.image || ""} />
                <AvatarFallback className="text-[10px]">
                  {task.creator?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{task.creator?.name}</span>
            </div>
          </div>
        </div>

        <div className="p-6 grid sm:grid-cols-[1fr_250px] gap-8">
          <div className="space-y-6">
            <SubtaskList 
              taskId={task.id} 
              initialSubtasks={task.subtasks || []} 
            />
          </div>
          
          <div className="space-y-6">
            <TagSelector 
              taskId={task.id}
              selectedTags={(task.taskTags || []).map(tt => tt.tag)}
              boardTags={[]} // TODO: Pass real board tags
            />

            <div className="pt-6 border-t border-border/50">
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Task
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

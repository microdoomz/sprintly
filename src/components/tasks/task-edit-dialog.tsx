"use client";

import { useState, useEffect } from "react";
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
import { Trash2, Calendar, User, Edit2, Save, X, Loader2 } from "lucide-react";
import { deleteTask, updateTask } from "@/actions/task-actions";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskEditDialogProps {
  task: TaskType;
  boardId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boardTags?: any[];
}

export function TaskEditDialog({ task, boardId, open, onOpenChange, boardTags = [] }: TaskEditDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit Form State
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ""
  );
  const [isSaving, setIsSaving] = useState(false);

  // Sync edits if task changes
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || "");
    setPriority(task.priority);
    setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "");
  }, [task]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task? This action is reversible.");
    if (!confirmDelete) return;

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    try {
      setIsSaving(true);
      const res = await updateTask(task.id, boardId, {
        title,
        description: description || null,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
      });

      if (res.error) throw new Error(res.error);
      
      toast.success("Task updated");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update task");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => {
      if (!v) setIsEditing(false);
      onOpenChange(v);
    }}>
      <DialogContent className="sm:max-w-[600px] gap-0 p-0 overflow-hidden">
        <div className="p-6 pb-4">
          <DialogHeader>
            <div className="flex items-center justify-between gap-4 pr-6">
              {isEditing ? (
                <div className="flex-1 space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="edit-title">Title</Label>
                    <Input
                      id="edit-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={isSaving}
                      placeholder="Task title"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="edit-desc">Description</Label>
                    <Textarea
                      id="edit-desc"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={isSaving}
                      placeholder="Add description..."
                      rows={3}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <DialogTitle className="text-xl leading-tight">{task.title}</DialogTitle>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </>
              )}
            </div>
            {!isEditing && task.description && (
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
            {isEditing ? (
              <Select value={priority} onValueChange={setPriority} disabled={isSaving}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div>
                <Badge variant="secondary" className="capitalize">
                  {task.priority}
                </Badge>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground text-xs font-medium">Due Date</span>
            {isEditing ? (
              <Input
                type="date"
                className="h-8 py-0"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isSaving}
              />
            ) : (
              <div className="flex items-center gap-2 font-medium">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "None"}
              </div>
            )}
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
              boardId={boardId}
              selectedTags={(task.taskTags || []).map(tt => tt.tag)}
              boardTags={boardTags}
            />

            <div className="pt-6 border-t border-border/50 space-y-2">
              {isEditing ? (
                <div className="flex gap-2">
                  <Button 
                    className="flex-1" 
                    size="sm"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      // Reset values
                      setTitle(task.title);
                      setDescription(task.description || "");
                      setPriority(task.priority);
                      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "");
                    }}
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : null}
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={handleDelete}
                disabled={isDeleting || isSaving}
                size="sm"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                {isDeleting ? "Deleting..." : "Delete Task"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

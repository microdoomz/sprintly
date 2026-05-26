"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Settings, Trash2 } from "lucide-react";
import { updateBoard, deleteBoard } from "@/actions/board-actions";

export function BoardSettingsDialog({ board }: { board: any }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(board.title);
  const [description, setDescription] = useState(board.description || "");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    try {
      setIsLoading(true);
      const res = await updateBoard(board.id, { title, description });
      if (res.error) throw new Error(res.error);
      toast.success("Board updated successfully!");
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update board");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this board? This action is reversible.");
    if (!confirmDelete) return;

    try {
      setIsLoading(true);
      const res = await deleteBoard(board.id);
      if (res.error) throw new Error(res.error);
      toast.success("Board deleted successfully!");
      setOpen(false);
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete board");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleUpdate}>
          <DialogHeader>
            <DialogTitle>Board Settings</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Board Name</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between items-center w-full sm:justify-between">
            <Button 
              type="button" 
              variant="destructive" 
              size="sm" 
              onClick={handleDelete}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Board
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !title}>
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createTag, toggleTaskTag } from "@/actions/task-actions";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface TagSelectorProps {
  taskId: string;
  boardId: string;
  boardTags: Tag[];
  selectedTags: Tag[];
}

const TAG_COLORS = [
  "#EF4444", "#F97316", "#F59E0B", "#10B981", 
  "#06B6D4", "#3B82F6", "#6366F1", "#8B5CF6", 
  "#EC4899", "#6B7280"
];

export function TagSelector({ taskId, boardId, boardTags, selectedTags }: TagSelectorProps) {
  const [open, setOpen] = useState(false);
  const [localBoardTags, setLocalBoardTags] = useState<Tag[]>(boardTags);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[5]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    setLocalBoardTags(boardTags);
  }, [boardTags]);

  const isSelected = (tagId: string) => selectedTags.some(t => t.id === tagId);

  const toggleTag = async (tag: Tag) => {
    try {
      const res = await toggleTaskTag(taskId, boardId, tag.id);
      if (res.error) throw new Error(res.error);
      toast.success(isSelected(tag.id) ? `Removed tag "${tag.name}"` : `Added tag "${tag.name}"`);
    } catch (error: any) {
      toast.error(error.message || "Failed to toggle tag");
    }
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    try {
      setIsCreating(true);
      const res = await createTag(boardId, newTagName.trim(), newTagColor);
      if (res.error) throw new Error(res.error);

      toast.success(`Tag "${newTagName}" created!`);
      const newTag = res.data as Tag;
      if (newTag) {
        setLocalBoardTags(curr => [...curr, newTag]);
        // Auto assign to task
        await toggleTag(newTag);
      }
      setNewTagName("");
    } catch (error: any) {
      toast.error(error.message || "Failed to create tag");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Tags</h4>
      </div>

      <div className="flex flex-wrap gap-2">
        {selectedTags.map(tag => (
          <Badge 
            key={tag.id} 
            variant="outline" 
            style={{ borderColor: tag.color, color: tag.color }}
          >
            {tag.name}
          </Badge>
        ))}

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-6 border-dashed text-xs px-2 cursor-pointer">
              <Plus className="h-3 w-3 mr-1" />
              Add Tag
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3" align="start">
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground px-1">Select tags</p>
              
              <div className="max-h-36 overflow-y-auto space-y-1">
                {localBoardTags.map(tag => (
                  <div 
                    key={tag.id}
                    className="flex items-center justify-between px-2 py-1.5 hover:bg-muted rounded-md cursor-pointer transition"
                    onClick={() => toggleTag(tag)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div 
                        className="w-2.5 h-2.5 rounded-full shrink-0" 
                        style={{ backgroundColor: tag.color }} 
                      />
                      <span className="text-sm truncate">{tag.name}</span>
                    </div>
                    {isSelected(tag.id) && (
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                    )}
                  </div>
                ))}
                {localBoardTags.length === 0 && (
                  <p className="text-xs text-muted-foreground px-2 py-1.5">No tags available on this board.</p>
                )}
              </div>

              <div className="border-t pt-3 space-y-2">
                <p className="text-xs font-medium text-muted-foreground px-1">Create new tag</p>
                <form onSubmit={handleCreateTag} className="space-y-2">
                  <Input 
                    placeholder="Tag name" 
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className="h-8 text-xs"
                    disabled={isCreating}
                    required
                  />
                  <div className="flex flex-wrap gap-1 px-1 justify-between">
                    {TAG_COLORS.slice(0, 8).map(c => (
                      <button
                        key={c}
                        type="button"
                        className={`h-4.5 w-4.5 rounded-full border border-transparent transition cursor-pointer ${
                          newTagColor === c ? "ring-1.5 ring-offset-1 ring-primary scale-110" : ""
                        }`}
                        style={{ backgroundColor: c }}
                        onClick={() => setNewTagColor(c)}
                        disabled={isCreating}
                      />
                    ))}
                  </div>
                  <Button type="submit" size="sm" className="w-full h-8 text-xs cursor-pointer" disabled={isCreating}>
                    {isCreating ? "Creating..." : "Create Tag"}
                  </Button>
                </form>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

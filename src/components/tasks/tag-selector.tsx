"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface TagSelectorProps {
  taskId: string;
  boardTags: Tag[];
  selectedTags: Tag[];
}

export function TagSelector({ taskId, boardTags, selectedTags }: TagSelectorProps) {
  const [open, setOpen] = useState(false);

  const isSelected = (tagId: string) => selectedTags.some(t => t.id === tagId);

  const toggleTag = (tag: Tag) => {
    // TODO: Call server action to add/remove tag from task
    console.log("Toggled tag", tag);
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
            <Button variant="outline" size="sm" className="h-6 border-dashed text-xs px-2">
              <Plus className="h-3 w-3 mr-1" />
              Add Tag
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="start">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground px-2 py-1">Select tags</p>
              {boardTags.map(tag => (
                <div 
                  key={tag.id}
                  className="flex items-center px-2 py-1.5 hover:bg-muted rounded-sm cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: tag.color }} 
                    />
                    <span className="text-sm">{tag.name}</span>
                  </div>
                  {isSelected(tag.id) && (
                    <span className="text-xs font-medium">✓</span>
                  )}
                </div>
              ))}
              {boardTags.length === 0 && (
                <p className="text-xs text-muted-foreground px-2 py-1">No tags available on this board.</p>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

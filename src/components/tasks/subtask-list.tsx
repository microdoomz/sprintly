"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface SubtaskListProps {
  taskId: string;
  initialSubtasks: Subtask[];
  // Assuming we'll have a prop for updating subtasks or we handle it via server actions
}

export function SubtaskList({ taskId, initialSubtasks }: SubtaskListProps) {
  const [subtasks, setSubtasks] = useState<Subtask[]>(initialSubtasks);
  const [newTitle, setNewTitle] = useState("");

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    
    const newSubtask: Subtask = {
      id: Math.random().toString(), // temporary ID
      title: newTitle,
      completed: false,
    };
    
    setSubtasks([...subtasks, newSubtask]);
    setNewTitle("");
    
    // TODO: Call server action to add subtask
  };

  const handleToggle = (id: string, completed: boolean) => {
    setSubtasks(subtasks.map(st => 
      st.id === id ? { ...st, completed } : st
    ));
    
    // TODO: Call server action to update subtask
  };

  const handleDelete = (id: string) => {
    setSubtasks(subtasks.filter(st => st.id !== id));
    
    // TODO: Call server action to delete subtask
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Subtasks</h4>
        <span className="text-xs text-muted-foreground">
          {subtasks.filter(st => st.completed).length}/{subtasks.length}
        </span>
      </div>
      
      <div className="space-y-2">
        {subtasks.map((st) => (
          <div key={st.id} className="flex items-center justify-between group">
            <div className="flex items-center gap-2">
              <Checkbox 
                checked={st.completed} 
                onCheckedChange={(checked) => handleToggle(st.id, checked as boolean)}
              />
              <span className={`text-sm ${st.completed ? 'line-through text-muted-foreground' : ''}`}>
                {st.title}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 opacity-0 group-hover:opacity-100 text-destructive"
              onClick={() => handleDelete(st.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Input 
          placeholder="Add a subtask..." 
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="h-8 text-sm"
        />
        <Button size="sm" variant="secondary" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

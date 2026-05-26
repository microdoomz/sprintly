"use client";

import { TaskType } from "@/components/tasks/task-card";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const priorityColors: Record<string, string> = {
  urgent: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  high: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
  medium: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  low: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20",
};

const statusColors: Record<string, string> = {
  todo: "bg-slate-500/10 text-slate-500",
  "in-progress": "bg-blue-500/10 text-blue-500",
  done: "bg-emerald-500/10 text-emerald-500",
};

export function ListTableView({ tasks }: { tasks: TaskType[] }) {
  if (tasks.length === 0) {
    return (
      <div className="flex-1 border rounded-lg flex items-center justify-center p-8 bg-card text-muted-foreground">
        No tasks match your filters.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Task Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Creator</TableHead>
            <TableHead className="text-right">Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} className="hover:bg-muted/50 transition-colors">
              <TableCell className="font-medium">
                {task.title}
                {task.subtasks.length > 0 && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})
                  </span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={`capitalize ${statusColors[task.status]}`}>
                  {task.status.replace("-", " ")}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={`capitalize ${priorityColors[task.priority]}`}>
                  {task.priority}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "—"}
              </TableCell>
              <TableCell>
                {task.creator && (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.creator.image || ""} />
                      <AvatarFallback className="text-[10px]">
                        {task.creator.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{task.creator.name}</span>
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1 flex-wrap">
                  {task.taskTags.map((tt) => (
                    <div
                      key={tt.tag.id}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: tt.tag.color }}
                      title={tt.tag.name}
                    />
                  ))}
                  {task.taskTags.length === 0 && <span className="text-muted-foreground">—</span>}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

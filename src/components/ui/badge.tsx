import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/15 text-primary",
        secondary: "border-transparent bg-surface-hover text-foreground",
        destructive: "border-transparent bg-destructive/15 text-destructive",
        outline: "border-border text-muted-foreground",
        low: "border-transparent bg-priority-low/15 text-priority-low",
        medium: "border-transparent bg-priority-medium/15 text-priority-medium",
        high: "border-transparent bg-priority-high/15 text-priority-high",
        urgent: "border-transparent bg-priority-urgent/15 text-priority-urgent",
        todo: "border-transparent bg-status-todo/15 text-status-todo",
        "in-progress": "border-transparent bg-status-in-progress/15 text-status-in-progress",
        done: "border-transparent bg-status-done/15 text-status-done",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

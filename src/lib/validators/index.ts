import { z } from "zod";

// --- Auth ---
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// --- Boards ---
export const createBoardSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  icon: z.string().optional(),
  coverColor: z.string().optional(),
});

export const updateBoardSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  icon: z.string().optional(),
  coverColor: z.string().optional(),
});

// --- Tasks ---
export const createTaskSchema = z.object({
  boardId: z.string().uuid(),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(["todo", "in-progress", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  dueDate: z.string().datetime().optional().nullable(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(["todo", "in-progress", "done"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  position: z.number().int().optional(),
});

// --- Subtasks ---
export const createSubtaskSchema = z.object({
  taskId: z.string().uuid(),
  title: z.string().min(1, "Title is required").max(200),
});

// --- Tags ---
export const createTagSchema = z.object({
  boardId: z.string().uuid(),
  name: z.string().min(1).max(50),
  color: z.string(),
});

// --- Invites ---
export const inviteSchema = z.object({
  boardId: z.string().uuid(),
  email: z.string().email("Invalid email address"),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CreateSubtaskInput = z.infer<typeof createSubtaskSchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type InviteInput = z.infer<typeof inviteSchema>;

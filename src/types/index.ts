// ============================================================
// Sprintly Type Definitions
// ============================================================

// --- Enums ---

export const TASK_STATUS = {
  TODO: "todo",
  IN_PROGRESS: "in-progress",
  DONE: "done",
} as const;

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

export const TASK_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const;

export type TaskPriority = (typeof TASK_PRIORITY)[keyof typeof TASK_PRIORITY];

export const BOARD_MEMBER_ROLE = {
  OWNER: "owner",
  MEMBER: "member",
} as const;

export type BoardMemberRole =
  (typeof BOARD_MEMBER_ROLE)[keyof typeof BOARD_MEMBER_ROLE];

// --- Entity Types ---

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Board {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  coverColor: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BoardWithMeta extends Board {
  owner: User;
  memberCount: number;
  taskCount: number;
}

export interface BoardMember {
  id: string;
  boardId: string;
  userId: string;
  role: BoardMemberRole;
  joinedAt: Date;
  user?: User;
}

export interface Task {
  id: string;
  boardId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  position: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskWithMeta extends Task {
  tags: Tag[];
  subtasks: Subtask[];
  creator?: User;
}

export interface Tag {
  id: string;
  boardId: string;
  name: string;
  color: string;
  isPredefined: boolean;
  createdAt: Date;
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface BoardInvite {
  id: string;
  boardId: string;
  email: string;
  inviteToken: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface ActivityLog {
  id: string;
  boardId: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: Date;
  user?: User;
}

// --- Action/Form Types ---

export interface CreateBoardInput {
  title: string;
  description?: string;
  icon?: string;
  coverColor?: string;
}

export interface UpdateBoardInput {
  title?: string;
  description?: string;
  icon?: string;
  coverColor?: string;
}

export interface CreateTaskInput {
  boardId: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date | null;
  position?: number;
}

export interface MoveTaskInput {
  taskId: string;
  newStatus: TaskStatus;
  newPosition: number;
}

// --- API Response Types ---

export interface ActionResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// --- View Types ---

export type ViewMode = "kanban" | "list";

export interface FilterState {
  search: string;
  priority: TaskPriority | "all";
  status: TaskStatus | "all";
  tagIds: string[];
  sortBy: "created" | "due-date" | "priority" | "title";
  sortOrder: "asc" | "desc";
}

// --- Kanban Column ---

export interface KanbanColumn {
  id: TaskStatus;
  title: string;
  tasks: TaskWithMeta[];
}

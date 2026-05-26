import { create } from "zustand";
import type { ViewMode, FilterState, Board, TaskWithMeta } from "@/types";

// ============================================================
// Board Store
// ============================================================
interface BoardState {
  boards: Board[];
  currentBoard: Board | null;
  isLoading: boolean;
  setBoards: (boards: Board[]) => void;
  setCurrentBoard: (board: Board | null) => void;
  addBoard: (board: Board) => void;
  updateBoard: (id: string, updates: Partial<Board>) => void;
  removeBoard: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  boards: [],
  currentBoard: null,
  isLoading: true,
  setBoards: (boards) => set({ boards }),
  setCurrentBoard: (board) => set({ currentBoard: board }),
  addBoard: (board) => set((s) => ({ boards: [...s.boards, board] })),
  updateBoard: (id, updates) =>
    set((s) => ({
      boards: s.boards.map((b) => (b.id === id ? { ...b, ...updates } : b)),
      currentBoard:
        s.currentBoard?.id === id
          ? { ...s.currentBoard, ...updates }
          : s.currentBoard,
    })),
  removeBoard: (id) =>
    set((s) => ({
      boards: s.boards.filter((b) => b.id !== id),
      currentBoard: s.currentBoard?.id === id ? null : s.currentBoard,
    })),
  setLoading: (loading) => set({ isLoading: loading }),
}));

// ============================================================
// Task Store
// ============================================================
interface TaskState {
  tasks: TaskWithMeta[];
  isLoading: boolean;
  setTasks: (tasks: TaskWithMeta[]) => void;
  addTask: (task: TaskWithMeta) => void;
  updateTask: (id: string, updates: Partial<TaskWithMeta>) => void;
  removeTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: string, newPosition: number) => void;
  setLoading: (loading: boolean) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  isLoading: true,
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((s) => ({ tasks: [...s.tasks, task] })),
  updateTask: (id, updates) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  removeTask: (id) =>
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
  moveTask: (taskId, newStatus, newPosition) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId
          ? { ...t, status: newStatus as TaskWithMeta["status"], position: newPosition }
          : t
      ),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
}));

// ============================================================
// View Store
// ============================================================
interface ViewState {
  mode: ViewMode;
  filters: FilterState;
  sidebarOpen: boolean;
  setMode: (mode: ViewMode) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const defaultFilters: FilterState = {
  search: "",
  priority: "all",
  status: "all",
  tagIds: [],
  sortBy: "created",
  sortOrder: "desc",
};

export const useViewStore = create<ViewState>((set) => ({
  mode: "kanban",
  filters: defaultFilters,
  sidebarOpen: true,
  setMode: (mode) => set({ mode }),
  setFilters: (filters) =>
    set((s) => ({ filters: { ...s.filters, ...filters } })),
  resetFilters: () => set({ filters: defaultFilters }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));

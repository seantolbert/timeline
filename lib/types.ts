// Core domain types for the Timeline task tracker

export type Priority = "low" | "medium" | "high" | "urgent";
export type Status = "todo" | "in_progress" | "done";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  due_date: string | null; // ISO date string (YYYY-MM-DD)
  completed: boolean;
  tag: string | null;
  created_at: string;
  updated_at: string;
}

// Omit server-generated fields when creating/updating
export type CreateTaskInput = Omit<Task, "id" | "user_id" | "created_at" | "updated_at">;
export type UpdateTaskInput = Partial<CreateTaskInput>;

// Filter state for task list views
export interface TaskFilters {
  status?: Status | "all";
  priority?: Priority | "all";
  search?: string;
  sortBy?: "due_date" | "created_at" | "priority" | "title";
  sortDir?: "asc" | "desc";
}

// Priority config used for display/sorting
export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; color: string; order: number }
> = {
  low:    { label: "Low",    color: "text-blue-600 bg-blue-50 border-blue-200",   order: 1 },
  medium: { label: "Medium", color: "text-yellow-600 bg-yellow-50 border-yellow-200", order: 2 },
  high:   { label: "High",   color: "text-orange-600 bg-orange-50 border-orange-200", order: 3 },
  urgent: { label: "Urgent", color: "text-red-600 bg-red-50 border-red-200",     order: 4 },
};

export const STATUS_CONFIG: Record<Status, { label: string; color: string }> = {
  todo:        { label: "To Do",       color: "text-slate-600 bg-slate-100 border-slate-200" },
  in_progress: { label: "In Progress", color: "text-purple-600 bg-purple-50 border-purple-200" },
  done:        { label: "Done",        color: "text-green-600 bg-green-50 border-green-200" },
};

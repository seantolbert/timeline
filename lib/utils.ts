import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, isTomorrow, isPast, parseISO } from "date-fns";
import type { Task, TaskFilters, Priority } from "./types";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a due date for display */
export function formatDueDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = parseISO(dateStr);
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return format(date, "MMM d, yyyy");
}

/** Is this task overdue? (due in the past and not completed) */
export function isOverdue(task: Task): boolean {
  if (!task.due_date || task.completed) return false;
  return isPast(parseISO(task.due_date + "T23:59:59"));
}

/** Is this task due today? */
export function isDueToday(task: Task): boolean {
  if (!task.due_date) return false;
  return isToday(parseISO(task.due_date));
}

const PRIORITY_ORDER: Record<Priority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};

/** Apply filters and sorting to a task list */
export function filterAndSortTasks(tasks: Task[], filters: TaskFilters): Task[] {
  let result = [...tasks];

  // Search
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.tag?.toLowerCase().includes(q)
    );
  }

  // Status filter
  if (filters.status && filters.status !== "all") {
    result = result.filter((t) => t.status === filters.status);
  }

  // Priority filter
  if (filters.priority && filters.priority !== "all") {
    result = result.filter((t) => t.priority === filters.priority);
  }

  // Sort
  const dir = filters.sortDir === "asc" ? 1 : -1;
  result.sort((a, b) => {
    switch (filters.sortBy) {
      case "order":
        return (a.order - b.order) * dir;
      case "due_date": {
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return a.due_date < b.due_date ? -dir : dir;
      }
      case "priority":
        return (PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]) * dir;
      case "title":
        return a.title.localeCompare(b.title) * dir;
      default: // created_at
        return a.created_at < b.created_at ? dir : -dir;
    }
  });

  return result;
}

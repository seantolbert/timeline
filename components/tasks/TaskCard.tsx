"use client";

import { useState } from "react";
import { Calendar, Tag, Trash2, Pencil, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn, formatDueDate, isOverdue } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { PriorityBadge, StatusBadge } from "./TaskBadges";
import type { Task } from "@/lib/types";

interface TaskCardProps {
  task: Task;
  onToggle: (task: Task) => Promise<Task>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onToggle, onDelete, onEdit }: TaskCardProps) {
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const overdue = isOverdue(task);

  async function handleToggle() {
    setToggling(true);
    try {
      await onToggle(task);
    } catch {
      toast.error("Failed to update task");
    } finally {
      setToggling(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await onDelete(task.id);
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
      setDeleting(false);
    }
  }

  return (
    <div
      className={cn(
        "group flex gap-3 rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md",
        task.completed && "opacity-60",
        overdue && !task.completed && "border-red-200 bg-red-50/30"
      )}
    >
      {/* Checkbox */}
      <div className="mt-0.5 flex-shrink-0">
        <Checkbox
          checked={task.completed}
          onCheckedChange={handleToggle}
          disabled={toggling}
          aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
        />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={cn(
              "text-sm font-medium leading-snug",
              task.completed && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </h3>

          {/* Action buttons — visible on hover / always on mobile */}
          <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100 sm:opacity-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onEdit(task)}
              aria-label="Edit task"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={handleDelete}
              disabled={deleting}
              aria-label="Delete task"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {task.description}
          </p>
        )}

        {/* Meta row */}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />

          {task.due_date && (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs",
                overdue && !task.completed
                  ? "text-red-600 font-medium"
                  : "text-muted-foreground"
              )}
            >
              {overdue && !task.completed ? (
                <AlertCircle className="h-3 w-3" />
              ) : (
                <Calendar className="h-3 w-3" />
              )}
              {formatDueDate(task.due_date)}
              {overdue && !task.completed && " — Overdue"}
            </span>
          )}

          {task.tag && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Tag className="h-3 w-3" />
              {task.tag}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

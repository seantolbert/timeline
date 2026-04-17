"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/types";

interface SortableTaskCardProps {
  task: Task;
  onToggle: (task: Task) => Promise<Task>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (task: Task) => void;
  dragEnabled: boolean;
}

export function SortableTaskCard({
  task,
  onToggle,
  onDelete,
  onEdit,
  dragEnabled,
}: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: !dragEnabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-stretch gap-1",
        isDragging && "opacity-50 z-50"
      )}
    >
      {/* Drag handle */}
      <button
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        className={cn(
          "flex items-center px-1 text-muted-foreground/40 transition-colors rounded-md",
          dragEnabled
            ? "cursor-grab active:cursor-grabbing hover:text-muted-foreground touch-none"
            : "cursor-default opacity-0 pointer-events-none"
        )}
        aria-label="Drag to reorder"
        tabIndex={-1}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="min-w-0 flex-1">
        <TaskCard
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      </div>
    </div>
  );
}

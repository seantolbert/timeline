"use client";

import { useState } from "react";
import { Plus, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskCard } from "./TaskCard";
import { TaskForm } from "./TaskForm";
import { TaskFilterBar } from "./TaskFilters";
import { useTasks } from "@/lib/hooks/useTasks";
import { filterAndSortTasks } from "@/lib/utils";
import type { Task, TaskFilters, CreateTaskInput } from "@/lib/types";

interface TaskListProps {
  /** Pre-filter tasks before showing (e.g. completed-only, today-only) */
  preFilter?: (tasks: Task[]) => Task[];
  /** Show the filter bar */
  showFilters?: boolean;
  /** Title for the list */
  heading?: string;
  /** Empty state message */
  emptyMessage?: string;
}

export function TaskList({
  preFilter,
  showFilters = true,
  heading,
  emptyMessage = "No tasks here yet.",
}: TaskListProps) {
  const { tasks, loading, error, create, update, remove, toggle } = useTasks();
  const [filters, setFilters] = useState<TaskFilters>({
    sortBy: "created_at",
    sortDir: "desc",
  });
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  function updateFilter(partial: Partial<TaskFilters>) {
    setFilters((prev) => ({ ...prev, ...partial }));
  }

  async function handleCreate(data: CreateTaskInput) {
    await create(data);
    toast.success("Task created");
  }

  async function handleUpdate(data: CreateTaskInput) {
    if (!editingTask) return;
    await update(editingTask.id, data);
    toast.success("Task updated");
    setEditingTask(null);
  }

  function handleEdit(task: Task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  function handleFormClose() {
    setFormOpen(false);
    setEditingTask(null);
  }

  // Apply pre-filter (e.g. completed-only) then user filters
  const preFiltered = preFilter ? preFilter(tasks) : tasks;
  const displayed = filterAndSortTasks(preFiltered, filters);

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between gap-2">
        {heading && <h2 className="text-lg font-semibold">{heading}</h2>}
        <Button size="sm" onClick={() => setFormOpen(true)} className="ml-auto gap-1.5">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New task</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Filters */}
      {showFilters && <TaskFilterBar filters={filters} onChange={updateFilter} />}

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      )}

      {/* Task cards */}
      {!loading && displayed.length > 0 && (
        <div className="space-y-2">
          {displayed.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={toggle}
              onDelete={remove}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && displayed.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-14 text-center">
          <ClipboardList className="h-10 w-10 text-muted-foreground/40" />
          <div>
            <p className="font-medium text-muted-foreground">{emptyMessage}</p>
            <p className="mt-1 text-sm text-muted-foreground/70">
              Click <strong>Add</strong> to get started.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setFormOpen(true)}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> New task
          </Button>
        </div>
      )}

      {/* Task form dialog */}
      <TaskForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={editingTask ? handleUpdate : handleCreate}
        editTask={editingTask}
      />
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { Plus, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SortableTaskCard } from "./SortableTaskCard";
import { TaskCard } from "./TaskCard";
import { TaskForm } from "./TaskForm";
import { TaskFilterBar } from "./TaskFilters";
import { useTasks } from "@/lib/hooks/useTasks";
import { filterAndSortTasks } from "@/lib/utils";
import type { Task, TaskFilters, CreateTaskInput } from "@/lib/types";

interface TaskListProps {
  preFilter?: (tasks: Task[]) => Task[];
  showFilters?: boolean;
  emptyMessage?: string;
}

const DEFAULT_FILTERS: TaskFilters = {
  sortBy: "order",
  sortDir: "asc",
};

export function TaskList({
  preFilter,
  showFilters = true,
  emptyMessage = "No tasks here yet.",
}: TaskListProps) {
  const { tasks, loading, error, create, update, remove, toggle, reorder } = useTasks();
  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_FILTERS);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Drag handle only active when on custom order with no active search/filters
  // (dragging while filtered would reorder hidden tasks unpredictably)
  const dragEnabled =
    filters.sortBy === "order" &&
    !filters.search &&
    (filters.status === "all" || !filters.status) &&
    (filters.priority === "all" || !filters.priority);

  function updateFilter(partial: Partial<TaskFilters>) {
    setFilters((prev) => ({ ...prev, ...partial }));
  }

  async function handleCreate(data: CreateTaskInput) {
    await create({ ...data, order: 0 });
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

  // Apply pre-filter then user filters
  const preFiltered = useMemo(
    () => (preFilter ? preFilter(tasks) : tasks),
    [tasks, preFilter]
  );
  const displayed = useMemo(
    () => filterAndSortTasks(preFiltered, filters),
    [preFiltered, filters]
  );

  // dnd-kit sensors — pointer for mouse, touch for mobile
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = displayed.findIndex((t) => t.id === active.id);
    const newIndex = displayed.findIndex((t) => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    // Reorder the visible slice, then merge back into the full task list
    const reorderedSlice = arrayMove(displayed, oldIndex, newIndex);

    // Build the full reordered list: replace positions of displayed tasks
    // while keeping tasks that are filtered out in their original spots
    const displayedIds = new Set(displayed.map((t) => t.id));
    const others = tasks.filter((t) => !displayedIds.has(t.id));
    const merged = [...reorderedSlice, ...others];

    reorder(merged);
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <Button size="sm" onClick={() => setFormOpen(true)} className="ml-auto gap-1.5">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New task</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Filters */}
      {showFilters && <TaskFilterBar filters={filters} onChange={updateFilter} />}

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      )}

      {/* Sortable task list */}
      {!loading && displayed.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={displayed.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {displayed.map((task) =>
                dragEnabled ? (
                  <SortableTaskCard
                    key={task.id}
                    task={task}
                    onToggle={toggle}
                    onDelete={remove}
                    onEdit={handleEdit}
                    dragEnabled={dragEnabled}
                  />
                ) : (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={toggle}
                    onDelete={remove}
                    onEdit={handleEdit}
                  />
                )
              )}
            </div>
          </SortableContext>
        </DndContext>
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

      <TaskForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={editingTask ? handleUpdate : handleCreate}
        editTask={editingTask}
      />
    </div>
  );
}

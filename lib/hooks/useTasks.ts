"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskComplete,
  reorderTasks,
} from "../tasks";
import type { Task, CreateTaskInput, UpdateTaskInput } from "../types";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const create = useCallback(async (input: CreateTaskInput) => {
    const task = await createTask(input);
    setTasks((prev) => [task, ...prev]);
    return task;
  }, []);

  const update = useCallback(async (id: string, input: UpdateTaskInput) => {
    const task = await updateTask(id, input);
    setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
    return task;
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggle = useCallback(async (task: Task) => {
    const updated = await toggleTaskComplete(task);
    setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    return updated;
  }, []);

  /**
   * Optimistically reorder: update local state immediately,
   * then persist to Supabase in the background.
   */
  const reorder = useCallback((reordered: Task[]) => {
    setTasks(reordered);
    reorderTasks(reordered).catch(() => {
      // Silently refetch if persist fails
      load();
    });
  }, [load]);

  return { tasks, loading, error, refresh: load, create, update, remove, toggle, reorder };
}

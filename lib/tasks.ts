import { createClient } from "./supabase/client";
import type { Task, CreateTaskInput, UpdateTaskInput } from "./types";

export async function getTasks(): Promise<Task[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Task[];
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const supabase = createClient();

  // Place new tasks at the top (order = current min - 1, floor at 0)
  const { data: existing } = await supabase
    .from("tasks")
    .select("order")
    .order("order", { ascending: true })
    .limit(1);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const minOrder = (existing?.[0] as any)?.order ?? 1000;
  const newOrder = Math.max(0, minOrder - 1);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from("tasks") as any)
    .insert({ ...input, order: newOrder })
    .select()
    .single();

  if (error) throw error;
  return data as Task;
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from("tasks") as any)
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Task;
}

export async function deleteTask(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleTaskComplete(task: Task): Promise<Task> {
  return updateTask(task.id, {
    completed: !task.completed,
    status: !task.completed ? "done" : "todo",
  });
}

/**
 * Persist a new order for a reordered list.
 * Receives the full ordered array and writes each task's new index.
 * Fires all updates in parallel for speed.
 */
export async function reorderTasks(ordered: Task[]): Promise<void> {
  const supabase = createClient();
  await Promise.all(
    ordered.map((task, index) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase.from("tasks") as any)
        .update({ order: index })
        .eq("id", task.id)
    )
  );
}

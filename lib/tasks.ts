import { createClient } from "./supabase/client";
import type { Task, CreateTaskInput, UpdateTaskInput } from "./types";

export async function getTasks(): Promise<Task[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Task[];
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from("tasks") as any)
    .insert(input)
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

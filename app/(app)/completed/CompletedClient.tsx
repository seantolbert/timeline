"use client";

import { TaskList } from "@/components/tasks/TaskList";
import type { Task } from "@/lib/types";

function completedOnly(tasks: Task[]): Task[] {
  return tasks.filter((t) => t.completed);
}

export function CompletedClient() {
  return (
    <div className="space-y-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Completed</h1>
        <p className="text-sm text-muted-foreground">Tasks you&apos;ve finished.</p>
      </div>
      <TaskList
        showFilters
        preFilter={completedOnly}
        emptyMessage="No completed tasks yet. Check off some tasks to see them here!"
      />
    </div>
  );
}

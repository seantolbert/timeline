"use client";

import { format } from "date-fns";
import { TaskList } from "@/components/tasks/TaskList";
import { isOverdue, isDueToday } from "@/lib/utils";
import type { Task } from "@/lib/types";

function todayAndOverdue(tasks: Task[]): Task[] {
  return tasks.filter((t) => !t.completed && (isDueToday(t) || isOverdue(t)));
}

export function TodayClient() {
  return (
    <div className="space-y-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Today</h1>
        <p className="text-sm text-muted-foreground">
          {format(new Date(), "EEEE, MMMM d")} · Tasks due today and overdue
        </p>
      </div>
      <TaskList
        showFilters={false}
        preFilter={todayAndOverdue}
        emptyMessage="Nothing due today. Great job staying on top of things!"
      />
    </div>
  );
}

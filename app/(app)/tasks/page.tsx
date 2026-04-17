import type { Metadata } from "next";
import { TaskList } from "@/components/tasks/TaskList";

export const metadata: Metadata = { title: "All Tasks" };

export default function TasksPage() {
  return (
    <div className="space-y-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">All Tasks</h1>
        <p className="text-sm text-muted-foreground">Every task, in one place.</p>
      </div>
      <TaskList showFilters emptyMessage="No tasks yet. Create your first one!" />
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListTodo,
  ArrowRight,
  Plus,
} from "lucide-react";
import { useTasks } from "@/lib/hooks/useTasks";
import { isOverdue, isDueToday } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskForm } from "@/components/tasks/TaskForm";
import { toast } from "sonner";
import type { Task, CreateTaskInput } from "@/lib/types";

function StatCard({
  label,
  value,
  icon: Icon,
  colorClass,
  href,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  colorClass: string;
  href?: string;
}) {
  const inner = (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`rounded-xl p-2.5 ${colorClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold leading-none">{value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export function DashboardClient() {
  const { tasks, loading, create, update, remove, toggle } = useTasks();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const stats = useMemo(() => ({
    total:     tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    overdue:   tasks.filter((t) => isOverdue(t)).length,
    today:     tasks.filter((t) => isDueToday(t) && !t.completed).length,
  }), [tasks]);

  // Up to 5 most recent incomplete tasks
  const recentTasks = useMemo(
    () => tasks.filter((t) => !t.completed).slice(0, 5),
    [tasks]
  );

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

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{greeting()}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <Button size="sm" onClick={() => setFormOpen(true)} className="gap-1.5 shrink-0">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New task</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((n) => <Skeleton key={n} className="h-20 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total"     value={stats.total}     icon={ListTodo}      colorClass="bg-blue-100 text-blue-600"    href="/tasks" />
          <StatCard label="Completed" value={stats.completed} icon={CheckCircle2}  colorClass="bg-green-100 text-green-600"  href="/completed" />
          <StatCard label="Due today" value={stats.today}     icon={Clock}         colorClass="bg-yellow-100 text-yellow-600" href="/today" />
          <StatCard label="Overdue"   value={stats.overdue}   icon={AlertTriangle} colorClass="bg-red-100 text-red-600" />
        </div>
      )}

      {/* Recent tasks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Recent tasks</CardTitle>
          <Button variant="ghost" size="sm" asChild className="gap-1 text-xs">
            <Link href="/tasks">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((n) => <Skeleton key={n} className="h-16 rounded-lg" />)}
            </div>
          ) : recentTasks.length > 0 ? (
            <div className="space-y-2">
              {recentTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={toggle}
                  onDelete={remove}
                  onEdit={(t) => { setEditingTask(t); setFormOpen(true); }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <CheckCircle2 className="h-8 w-8 text-green-400" />
              <p className="font-medium text-muted-foreground">All caught up!</p>
              <p className="text-sm text-muted-foreground/70">No pending tasks.</p>
              <Button size="sm" variant="outline" onClick={() => setFormOpen(true)}>
                Add a task
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <TaskForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingTask(null); }}
        onSubmit={editingTask ? handleUpdate : handleCreate}
        editTask={editingTask}
      />
    </div>
  );
}

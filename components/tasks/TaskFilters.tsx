"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ArrowUpDown } from "lucide-react";
import type { TaskFilters } from "@/lib/types";

interface TaskFiltersProps {
  filters: TaskFilters;
  onChange: (f: Partial<TaskFilters>) => void;
}

export function TaskFilterBar({ filters, onChange }: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Search */}
      <div className="relative min-w-[180px] flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks…"
          className="pl-9"
          value={filters.search ?? ""}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </div>

      {/* Status */}
      <Select
        value={filters.status ?? "all"}
        onValueChange={(v) => onChange({ status: v as TaskFilters["status"] })}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="todo">To Do</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="done">Done</SelectItem>
        </SelectContent>
      </Select>

      {/* Priority */}
      <Select
        value={filters.priority ?? "all"}
        onValueChange={(v) => onChange({ priority: v as TaskFilters["priority"] })}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          <SelectItem value="urgent">Urgent</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select
        value={`${filters.sortBy ?? "order"}:${filters.sortDir ?? "asc"}`}
        onValueChange={(v) => {
          const [sortBy, sortDir] = v.split(":");
          onChange({
            sortBy: sortBy as TaskFilters["sortBy"],
            sortDir: sortDir as TaskFilters["sortDir"],
          });
        }}
      >
        <SelectTrigger className="w-[160px]">
          <ArrowUpDown className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="order:asc">Custom order ↕</SelectItem>
          <SelectItem value="created_at:desc">Newest first</SelectItem>
          <SelectItem value="created_at:asc">Oldest first</SelectItem>
          <SelectItem value="due_date:asc">Due date ↑</SelectItem>
          <SelectItem value="due_date:desc">Due date ↓</SelectItem>
          <SelectItem value="priority:desc">Priority (high → low)</SelectItem>
          <SelectItem value="priority:asc">Priority (low → high)</SelectItem>
          <SelectItem value="title:asc">Title A → Z</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

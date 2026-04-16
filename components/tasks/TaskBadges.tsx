import { Badge } from "@/components/ui/badge";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "@/lib/types";
import type { Priority, Status } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const { label, color } = PRIORITY_CONFIG[priority];
  return (
    <Badge variant="outline" className={cn("border font-medium text-xs", color, className)}>
      {label}
    </Badge>
  );
}

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, color } = STATUS_CONFIG[status];
  return (
    <Badge variant="outline" className={cn("border font-medium text-xs", color, className)}>
      {label}
    </Badge>
  );
}

import { CheckCircle2 } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface AppHeaderProps {
  title: string;
}

export function AppHeader({ title }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-card/80 px-4 backdrop-blur-sm sm:px-6 lg:pl-[calc(var(--sidebar-width)+1.5rem)]">
      {/* Mobile brand */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <CheckCircle2 className="h-4 w-4" />
        </div>
        <span className="text-base font-bold tracking-tight">Timeline</span>
      </div>

      {/* Page title (desktop) */}
      <h1 className="hidden text-base font-semibold lg:block">{title}</h1>

      <ThemeToggle className="lg:hidden" />
    </header>
  );
}

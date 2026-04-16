"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListTodo, CalendarCheck, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Home",      icon: LayoutDashboard },
  { href: "/tasks",     label: "Tasks",     icon: ListTodo },
  { href: "/today",     label: "Today",     icon: CalendarCheck },
  { href: "/completed", label: "Done",      icon: CheckCircle2 },
];

/**
 * Bottom navigation bar for mobile.
 * Fixed at the bottom, only visible on smaller screens.
 */
export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t bg-card safe-bottom lg:hidden">
      <div className="flex items-stretch">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
              pathname === href
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

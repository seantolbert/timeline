/**
 * Shared layout for all protected app routes (/dashboard, /tasks, /today, /completed).
 * Renders the sidebar (desktop) and bottom nav (mobile).
 */
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      {/* Main content — offset by sidebar width on desktop */}
      <main className="lg:pl-[var(--sidebar-width)]">
        <div className="mx-auto max-w-4xl px-4 pb-28 pt-4 sm:px-6 lg:pb-8 lg:pt-6">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}

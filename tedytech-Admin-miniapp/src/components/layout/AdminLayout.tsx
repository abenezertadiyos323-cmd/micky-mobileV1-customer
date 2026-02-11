import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { useAdmin } from "@/contexts/AdminContext";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AdminLayoutProps {
  title: string;
  headerActions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function AdminLayout({ title, headerActions, children, className }: AdminLayoutProps) {
  const { activeTab, setActiveTab } = useAdmin();

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <Header title={title} actions={headerActions} />

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 overflow-y-auto pb-20", // pb-20 for bottom nav space
          className
        )}
      >
        <div className="container max-w-lg mx-auto p-4">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

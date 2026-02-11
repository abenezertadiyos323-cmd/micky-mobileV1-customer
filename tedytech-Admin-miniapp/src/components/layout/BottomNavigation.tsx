import { cn } from "@/lib/utils";
import type { TabType } from "@/types/admin";
import { Home, Package, ShoppingCart, Inbox } from "lucide-react";

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  className?: string;
}

export function BottomNavigation({ activeTab, onTabChange, className }: BottomNavigationProps) {
  const tabs: Array<{
    id: TabType;
    label: string;
    icon: typeof Home;
  }> = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "inbox", label: "Inbox", icon: Inbox },
  ];

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-20 bg-background border-t border-border bottom-nav-safe",
        className
      )}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full press-effect transition-colors rounded-lg",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className={cn("text-xs", isActive && "font-semibold")}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

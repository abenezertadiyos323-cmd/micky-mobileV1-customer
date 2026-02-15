import { cn } from "@/lib/utils";
import type { TabType } from "@/types/admin";
import { Home, Package, ShoppingCart, Inbox } from "lucide-react";
import { Tabbar, TabbarLink } from "konsta/react";

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  className?: string;
}

export function BottomNavigation({
  activeTab,
  onTabChange,
  className,
}: BottomNavigationProps) {
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
    <Tabbar
      icons
      className={cn(
        "fixed bottom-0 left-0 right-0 z-20 bg-background border-t border-border bottom-nav-safe",
        className,
      )}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <TabbarLink
            key={tab.id}
            active={isActive}
            icon={<Icon className="h-5 w-5" />}
            label={tab.label}
            component="button"
            linkProps={{ onClick: () => onTabChange(tab.id) }}
          />
        );
      })}
    </Tabbar>
  );
}

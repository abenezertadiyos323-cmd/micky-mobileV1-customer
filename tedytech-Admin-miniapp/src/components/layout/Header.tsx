import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface HeaderProps {
  title: string;
  actions?: ReactNode;
  className?: string;
}

export function Header({ title, actions, className }: HeaderProps) {
  return (
    <header className={cn("sticky top-0 z-10 bg-background border-b border-border", className)}>
      <div className="flex items-center justify-between h-14 px-4">
        <h1 className="text-lg font-bold truncate">{title}</h1>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </header>
  );
}

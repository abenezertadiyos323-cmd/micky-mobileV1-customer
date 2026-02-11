import { cn } from "@/lib/utils";
import { Navbar } from "konsta/react";
import type { ReactNode } from "react";

interface HeaderProps {
  title: string;
  actions?: ReactNode;
  className?: string;
}

export function Header({ title, actions, className }: HeaderProps) {
  return (
    <Navbar
      className={cn(
        "sticky top-0 z-10 bg-background border-b border-border",
        className,
      )}
      title={title}
      right={actions}
    />
  );
}

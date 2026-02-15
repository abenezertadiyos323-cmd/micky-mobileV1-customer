import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Filters } from "@/types/admin";
import { Search, X } from "lucide-react";

interface ProductFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  className?: string;
}

export function ProductFilters({ filters, onFiltersChange, className }: ProductFiltersProps) {
  const statusOptions: Array<{ value: "active" | "draft" | "archived"; label: string }> = [
    { value: "active", label: "Active" },
    { value: "draft", label: "Draft" },
    { value: "archived", label: "Archived" },
  ];

  const hasActiveFilters = filters.search || filters.status;

  const clearFilters = () => {
    onFiltersChange({});
  };

  const toggleStatus = (status: "active" | "draft" | "archived") => {
    onFiltersChange({
      ...filters,
      status: filters.status === status ? undefined : status,
    });
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search products..."
          value={filters.search || ""}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="pl-9 pr-9"
        />
        {filters.search && (
          <button
            onClick={() => onFiltersChange({ ...filters, search: undefined })}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Status Filter Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground font-medium">Status:</span>
        {statusOptions.map((option) => (
          <Badge
            key={option.value}
            variant={filters.status === option.value ? "default" : "outline"}
            className="cursor-pointer press-effect min-h-[36px] px-3 py-1.5"
            onClick={() => toggleStatus(option.value)}
          >
            {option.label}
          </Badge>
        ))}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs">
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
}

import { Loader2 } from "lucide-react";
import { mapToProductVM, type ProductVM } from "@/lib/mapProduct";
import { cn } from "@/lib/utils";
import type { Phone } from "@/types/phone";

interface SearchResultsDropdownProps {
  results: Phone[];
  isLoading: boolean;
  query: string;
  onSelectResult: (phone: Phone) => void;
}

export function SearchResultsDropdown({
  results,
  isLoading,
  query,
  onSelectResult,
}: SearchResultsDropdownProps) {
  const shouldShow = query.length >= 2;

  if (!shouldShow) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-2xl border border-border shadow-lg z-50 overflow-hidden animate-fade-in max-h-96 overflow-y-auto">
      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Searching...</span>
        </div>
      )}

      {!isLoading && results.length === 0 && (
        <div className="p-6 text-center text-muted-foreground">
          <p className="text-sm">No phones found</p>
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <div className="divide-y divide-border">
          {results.slice(0, 8).map((phone) => {
            const product = mapToProductVM(phone as unknown as Record<string, unknown>);
            return (
              <button
                key={phone.id}
                onClick={() => onSelectResult(phone)}
                className="w-full p-3 flex gap-3 items-center hover:bg-muted transition-colors text-left"
              >
                <div className="w-12 h-12 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-foreground line-clamp-1">
                    {product.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {product.priceBirr.toLocaleString()} Birr
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

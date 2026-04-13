import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SearchResult {
  _id: string;
  phoneType?: string | null;
  brand?: string | null;
  model?: string | null;
  storage?: number | null;
  condition?: string | null;
  price: number;
  images?: string[];
  mainImageUrl?: string | null;
  exchange_available?: boolean | null;
}

interface SearchResultsDropdownProps {
  results: SearchResult[];
  isLoading: boolean;
  query: string;
  onSelectResult: (result: SearchResult) => void;
}

export function SearchResultsDropdown({
  results,
  isLoading,
  query,
  onSelectResult,
}: SearchResultsDropdownProps) {
  const shouldShow = query.length >= 2;

  if (!shouldShow) return null;

  const buildTitle = (result: SearchResult): string => {
    if (result.phoneType) return result.phoneType;
    if (result.brand || result.model) {
      return [result.brand, result.model].filter(Boolean).join(" ");
    }
    return "Phone";
  };

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
          {results.slice(0, 8).map((result) => {
            const title = buildTitle(result);

            return (
              <button
                key={result._id}
                onClick={() => onSelectResult(result)}
                className="w-full px-4 py-3 flex flex-col hover:bg-muted transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm text-foreground line-clamp-1">
                    {title}
                  </h4>
                  {result.storage && (
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {result.storage}GB
                    </Badge>
                  )}
                  {result.condition && (
                    <span className="text-xs text-muted-foreground capitalize shrink-0">
                      {result.condition}
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium text-foreground mt-0.5">
                  {result.price.toLocaleString()} Birr
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

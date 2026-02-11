import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { cn, formatPrice, formatDateTime } from "@/lib/utils";
import type { Product } from "@/types/product";
import { X, Star, Sparkles, TrendingUp } from "lucide-react";

interface ProductDetailSheetProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailSheet({ product, onClose }: ProductDetailSheetProps) {
  if (!product) return null;

  const imageSrc = product.images?.[0] || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full max-h-[85vh] bg-background rounded-t-2xl overflow-y-auto animate-slide-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Product Image */}
        <div className="relative aspect-video bg-muted overflow-hidden">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-4">
          {/* Name + Status */}
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-bold flex-1">{product.name}</h2>
            <StatusBadge status={product.status} variant="product" />
          </div>

          {/* Price */}
          <p className="text-2xl font-bold text-primary">{formatPrice(product.price)}</p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {product.isFeatured && (
              <Badge variant="outline" className="gap-1">
                <Star className="h-3 w-3" /> Featured
              </Badge>
            )}
            {product.isNewArrival && (
              <Badge variant="outline" className="gap-1">
                <Sparkles className="h-3 w-3" /> New Arrival
              </Badge>
            )}
            {product.isPopular && (
              <Badge variant="outline" className="gap-1">
                <TrendingUp className="h-3 w-3" /> Popular
              </Badge>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-1">Description</p>
              <p className="text-sm">{product.description}</p>
            </div>
          )}

          {/* Details Grid */}
          <Card className="admin-card">
            <CardContent className="p-3 space-y-3">
              {product.category && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{product.category}</span>
                </div>
              )}
              {product.currency && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Currency</span>
                  <span className="font-medium">{product.currency}</span>
                </div>
              )}
              {product.tags && product.tags.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tags</span>
                  <span className="font-medium">{product.tags.join(", ")}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">{formatDateTime(product.createdAt)}</span>
              </div>
              {product.updatedAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Updated</span>
                  <span className="font-medium">{formatDateTime(product.updatedAt)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Spacer for bottom safe area */}
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}

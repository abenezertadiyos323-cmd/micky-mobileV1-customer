import { Heart } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";
import type { ProductVM } from "@/lib/mapProduct";

interface ProductCardProps {
  product: ProductVM;
  onClick: () => void;
  index?: number;
}

export function ProductCard({ product, onClick, index = 0 }: ProductCardProps) {
  const { toggleSaved, isSaved } = useApp();
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  const saved = isSaved(product.id);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHeartAnimating(true);
    toggleSaved(product.id);
    setTimeout(() => setIsHeartAnimating(false), 400);
  };

  return (
    <div
      className={cn(
        "bg-card rounded-2xl overflow-hidden card-shadow hover-lift cursor-pointer group opacity-0 animate-fade-in",
        `stagger-${Math.min(index + 1, 6)}`,
      )}
      style={{ animationFillMode: "forwards" }}
      onClick={onClick}
    >
      <div className="relative aspect-square bg-muted overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover img-zoom"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg";
          }}
        />

        <button
          onClick={handleSave}
          aria-label={saved ? "Remove from saved items" : "Save item"}
          className={cn(
            "absolute top-2 right-2 p-2 rounded-full transition-all duration-300 press-effect",
            saved
              ? "bg-destructive text-destructive-foreground"
              : "bg-card/80 backdrop-blur-sm text-muted-foreground hover:bg-card hover:text-destructive",
            isHeartAnimating && "animate-heart-pop",
          )}
        >
          <Heart
            className="w-4 h-4 transition-transform"
            fill={saved ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-foreground text-sm leading-tight mb-1 line-clamp-1">
          {product.title}
        </h3>
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          <span className="text-xs text-muted-foreground">{product.condition}</span>
          <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", product.inStock ? "bg-success/25 text-[hsl(145_70%_45%)]" : "bg-muted text-muted-foreground")}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
        <p className="text-price text-base mb-1">
          {product.priceBirr.toLocaleString()} Birr
        </p>
      </div>
    </div>
  );
}

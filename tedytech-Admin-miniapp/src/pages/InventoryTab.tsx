import { useState } from "react";
import { ProductFilters } from "@/components/inventory/ProductFilters";
import { ProductGrid } from "@/components/inventory/ProductGrid";
import { ProductDetailSheet } from "@/components/inventory/ProductDetailSheet";
import { useFilteredProducts } from "@/hooks/useProducts";
import { useAdmin } from "@/contexts/AdminContext";
import type { Product } from "@/types/product";

export function InventoryTab() {
  const { inventoryFilters, setInventoryFilters } = useAdmin();
  const { data: products, isLoading } = useFilteredProducts(inventoryFilters);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Filters */}
      <ProductFilters filters={inventoryFilters} onFiltersChange={setInventoryFilters} />

      {/* Results Count */}
      {!isLoading && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {products.length} {products.length === 1 ? "product" : "products"}
          </span>
        </div>
      )}

      {/* Product Grid */}
      <ProductGrid
        products={products}
        isLoading={isLoading}
        onProductClick={setSelectedProduct}
      />

      {/* Product Detail Sheet */}
      <ProductDetailSheet
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

import { useState } from "react";
import { ProductFilters } from "@/components/inventory/ProductFilters";
import { ProductGrid } from "@/components/inventory/ProductGrid";
import { ProductDetailSheet } from "@/components/inventory/ProductDetailSheet";
import { Button } from "@/components/ui/button";
import { useToast, ToastContainer } from "@/components/ui/toast";
import { useFilteredProducts } from "@/hooks/useProducts";
import { useAdmin } from "@/contexts/AdminContext";
import type { Product } from "@/types/product";
import { Plus } from "lucide-react";

export function InventoryTab() {
  const { inventoryFilters, setInventoryFilters } = useAdmin();
  const { data: products, isLoading, error } = useFilteredProducts(inventoryFilters);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { toasts, show: showToast, dismiss } = useToast();

  const openCreate = () => {
    setSelectedProduct(null);
    setIsCreateOpen(true);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      {/* Filters */}
      <ProductFilters filters={inventoryFilters} onFiltersChange={setInventoryFilters} />

      <div className="flex items-center justify-end">
        <Button size="sm" onClick={openCreate} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Results Count */}
      {!isLoading && !error && (
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
        error={error}
        onProductClick={setSelectedProduct}
      />

      {/* Product Detail Sheet */}
      <ProductDetailSheet
        product={selectedProduct}
        isOpen={Boolean(selectedProduct) || isCreateOpen}
        onClose={() => {
          setSelectedProduct(null);
          setIsCreateOpen(false);
        }}
        onSuccess={(msg) => showToast(msg, "success")}
      />

      {/* Floating Action Button — always visible, above bottom nav */}
      <button
        onClick={openCreate}
        className="fixed bottom-24 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 active:scale-95 transition-all"
        aria-label="Add product"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}

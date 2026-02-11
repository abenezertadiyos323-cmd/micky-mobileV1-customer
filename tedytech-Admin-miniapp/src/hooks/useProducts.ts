import { useQuery } from "convex/react";
import { api } from "convex_generated/api";
import type { Product } from "@/types/product";
import { mockProducts } from "@/data/mockData";

/**
 * Fetch all products for admin view
 */
export function useProducts() {
  const convexProducts = useQuery(api.products.listAllProducts);

  // Fallback to mock data if Convex data is unavailable
  const products = (convexProducts ?? mockProducts) as Product[];

  return {
    data: products,
    isLoading: convexProducts === undefined,
    error: null,
  };
}

/**
 * Fetch products with filtering
 */
export function useFilteredProducts(filters: {
  search?: string;
  category?: string;
  status?: "active" | "draft" | "archived";
  sortBy?: "name" | "price" | "createdAt";
  sortOrder?: "asc" | "desc";
}) {
  const { data: allProducts, isLoading } = useProducts();

  // Apply filters
  let filtered = [...allProducts];

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
    );
  }

  // Category filter
  if (filters.category) {
    filtered = filtered.filter((p) => p.category === filters.category);
  }

  // Status filter
  if (filters.status) {
    filtered = filtered.filter((p) => p.status === filters.status);
  }

  // Sort
  if (filters.sortBy) {
    filtered.sort((a, b) => {
      let aVal: any, bVal: any;

      if (filters.sortBy === "name") {
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
      } else if (filters.sortBy === "price") {
        aVal = a.price;
        bVal = b.price;
      } else if (filters.sortBy === "createdAt") {
        aVal = a.createdAt;
        bVal = b.createdAt;
      }

      if (filters.sortOrder === "desc") {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
  }

  return {
    data: filtered,
    isLoading,
    error: null,
  };
}

/**
 * Get product statistics for dashboard
 */
export function useProductStats() {
  const { data: products, isLoading } = useProducts();

  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter((p) => p.status === "active").length,
    draftProducts: products.filter((p) => p.status === "draft").length,
    archivedProducts: products.filter((p) => p.status === "archived").length,
    featuredProducts: products.filter((p) => p.isFeatured).length,
    newArrivals: products.filter((p) => p.isNewArrival).length,
  };

  return {
    data: stats,
    isLoading,
  };
}

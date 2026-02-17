import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "convex_generated/api";
import { useAdmin } from "@/contexts/AdminContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { formatDateTime, formatPrice } from "@/lib/utils";
import type { Product, ProductStatus } from "@/types/product";
import { Loader2, Sparkles, Star, TrendingUp, X } from "lucide-react";

interface ProductDetailSheetProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}

interface ProductFormState {
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  status: ProductStatus;
  inStock: boolean;
}

const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400";
const STATUS_OPTIONS: ProductStatus[] = ["active", "draft", "archived"];

function getFormState(product: Product | null): ProductFormState {
  return {
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product ? String(product.price) : "",
    category: product?.category ?? "",
    imageUrl: product?.images?.[0] ?? "",
    status: product?.status ?? "active",
    inStock: product?.inStock ?? true,
  };
}

export function ProductDetailSheet({
  product,
  isOpen,
  onClose,
  onSuccess,
}: ProductDetailSheetProps) {
  const { adminToken } = useAdmin();
  const createProduct = useMutation(api.products.createProductAdmin);
  const updateProduct = useMutation(api.products.updateProductAdmin);
  const toggleAvailability = useMutation(api.products.toggleProductAvailability);
  const toggleInStock = useMutation(api.products.toggleProductInStock);

  const [form, setForm] = useState<ProductFormState>(getFormState(product));
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCreateMode = !product;

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setForm(getFormState(product));
    setIsEditing(!product);
    setIsSaving(false);
    setIsToggling(false);
    setError(null);
  }, [isOpen, product]);

  if (!isOpen) return null;

  const imageSrc = form.imageUrl || product?.images?.[0] || DEFAULT_PRODUCT_IMAGE;
  const isAvailable = (product?.status ?? form.status) === "active";
  const isInStock = product ? product.inStock ?? true : form.inStock;

  const setFormField = <K extends keyof ProductFormState>(
    key: K,
    value: ProductFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!adminToken) {
      setError("Admin session unavailable. Reopen the mini app.");
      return;
    }

    const name = form.name.trim();
    const price = Number(form.price);

    if (!name) {
      setError("Product name is required.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setError("Enter a valid price.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const payload = {
        token: adminToken,
        name,
        description: form.description.trim() || undefined,
        price,
        category: form.category.trim() || undefined,
        imageUrl: form.imageUrl.trim() || "",
        status: form.status,
        inStock: form.inStock,
      };

      if (isCreateMode) {
        await createProduct(payload);
        onSuccess?.("Product created successfully!");
      } else {
        await updateProduct({
          ...payload,
          productId: product!._id as any,
        });
        onSuccess?.("Changes saved successfully!");
      }

      onClose();
    } catch (err) {
      setError((err as Error).message || "Failed to save product.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleAvailability = async () => {
    if (!product) return;

    if (!adminToken) {
      setError("Admin session unavailable. Reopen the mini app.");
      return;
    }

    setIsToggling(true);
    setError(null);

    try {
      await toggleAvailability({
        token: adminToken,
        productId: product._id as any,
      });
      onClose();
    } catch (err) {
      setError((err as Error).message || "Failed to update availability.");
    } finally {
      setIsToggling(false);
    }
  };

  const handleToggleInStock = async () => {
    if (!product) return;

    if (!adminToken) {
      setError("Admin session unavailable. Reopen the mini app.");
      return;
    }

    setIsToggling(true);
    setError(null);

    try {
      await toggleInStock({
        token: adminToken,
        productId: product._id as any,
      });
      onClose();
    } catch (err) {
      setError((err as Error).message || "Failed to update stock status.");
    } finally {
      setIsToggling(false);
    }
  };

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
            alt={isCreateMode ? "New product" : product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-bold flex-1">
              {isCreateMode ? "Add Product" : product.name}
            </h2>
            <StatusBadge
              status={isCreateMode ? form.status : product.status}
              variant="product"
            />
          </div>

          {error && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          {(isCreateMode || isEditing) && (
            <Card className="admin-card">
              <CardContent className="p-4 space-y-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Name</p>
                  <Input
                    value={form.name}
                    onChange={(e) => setFormField("name", e.target.value)}
                    placeholder="Product name"
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Price (ETB)</p>
                  <Input
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => setFormField("price", e.target.value)}
                    placeholder="0"
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Category</p>
                  <Input
                    value={form.category}
                    onChange={(e) => setFormField("category", e.target.value)}
                    placeholder="Optional"
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Image URL</p>
                  <Input
                    value={form.imageUrl}
                    onChange={(e) => setFormField("imageUrl", e.target.value)}
                    placeholder="https://..."
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Description</p>
                  <Input
                    value={form.description}
                    onChange={(e) => setFormField("description", e.target.value)}
                    placeholder="Optional"
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Status</p>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((status) => (
                      <Button
                        key={status}
                        type="button"
                        size="sm"
                        variant={form.status === status ? "default" : "outline"}
                        onClick={() => setFormField("status", status)}
                        disabled={isSaving}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-md border border-border p-3">
                  <span className="text-sm">In stock</span>
                  <Button
                    type="button"
                    size="sm"
                    variant={form.inStock ? "default" : "outline"}
                    onClick={() => setFormField("inStock", !form.inStock)}
                    disabled={isSaving}
                  >
                    {form.inStock ? "Yes" : "No"}
                  </Button>
                </div>

                <div className="flex gap-2 pt-1">
                  {!isCreateMode && (
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 min-h-[44px]"
                      onClick={() => {
                        setForm(getFormState(product));
                        setIsEditing(false);
                        setError(null);
                      }}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="button"
                    className="flex-1 min-h-[44px]"
                    onClick={() => void handleSave()}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        Saving...
                      </>
                    ) : isCreateMode ? (
                      "Create Product"
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!isCreateMode && !isEditing && (
            <>
              {/* Price */}
              <p className="text-2xl font-bold text-primary">
                {formatPrice(product.price)}
              </p>

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
                {!isInStock && <Badge variant="destructive">Out of stock</Badge>}
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
                    <span className="text-muted-foreground">Availability</span>
                    <span className="font-medium">{isAvailable ? "Available" : "Unavailable"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Stock</span>
                    <span className="font-medium">{isInStock ? "In Stock" : "Out of Stock"}</span>
                  </div>
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

              <div className="space-y-2">
                <Button
                  className="w-full min-h-[44px]"
                  onClick={() => setIsEditing(true)}
                  disabled={isToggling}
                >
                  Edit Product
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="min-h-[44px]"
                    onClick={() => void handleToggleAvailability()}
                    disabled={isToggling}
                  >
                    {isToggling ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isAvailable ? (
                      "Set Unavailable"
                    ) : (
                      "Set Available"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="min-h-[44px]"
                    onClick={() => void handleToggleInStock()}
                    disabled={isToggling}
                  >
                    {isToggling ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isInStock ? (
                      "Mark Out"
                    ) : (
                      "Mark In"
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Spacer for bottom safe area */}
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}

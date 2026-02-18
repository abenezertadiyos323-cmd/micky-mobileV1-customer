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

/* ── Section divider with label ─────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 pt-1 pb-0.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {children}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
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

  /* ── Shared form fields (create + edit) ──────────────────── */
  const formContent = (
    <>
      {/* ── Essentials ─────────────────────────────────────── */}
      <SectionLabel>Essentials</SectionLabel>

      <div className="space-y-3">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Name
          </label>
          <Input
            value={form.name}
            onChange={(e) => setFormField("name", e.target.value)}
            placeholder="e.g. iPhone 14 Pro Max"
            disabled={isSaving}
            className="h-11 text-[15px]"
          />
        </div>

        {/* Price */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Price (ETB)
          </label>
          <Input
            type="number"
            min={0}
            value={form.price}
            onChange={(e) => setFormField("price", e.target.value)}
            placeholder="0"
            disabled={isSaving}
            className="h-11 text-[15px]"
          />
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Status
          </label>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map((status) => (
              <Button
                key={status}
                type="button"
                size="sm"
                variant={form.status === status ? "default" : "outline"}
                onClick={() => setFormField("status", status)}
                disabled={isSaving}
                className="flex-1 capitalize h-9"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        {/* In Stock toggle */}
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3.5 py-3">
          <span className="text-sm font-medium">In stock</span>
          <button
            type="button"
            role="switch"
            aria-checked={form.inStock}
            onClick={() => setFormField("inStock", !form.inStock)}
            disabled={isSaving}
            className={`
              relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
              transition-colors duration-200 ease-in-out
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
              disabled:cursor-not-allowed disabled:opacity-50
              ${form.inStock ? "bg-primary" : "bg-muted-foreground/30"}
            `}
          >
            <span
              className={`
                pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm
                ring-0 transition-transform duration-200 ease-in-out
                ${form.inStock ? "translate-x-5" : "translate-x-0"}
              `}
            />
          </button>
        </div>
      </div>

      {/* ── Optional ───────────────────────────────────────── */}
      <SectionLabel>Optional</SectionLabel>

      <div className="space-y-3">
        {/* Image URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Image URL
          </label>
          <Input
            value={form.imageUrl}
            onChange={(e) => setFormField("imageUrl", e.target.value)}
            placeholder="https://..."
            disabled={isSaving}
            className="h-11 text-[15px]"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Description
          </label>
          <Input
            value={form.description}
            onChange={(e) => setFormField("description", e.target.value)}
            placeholder="Short description (optional)"
            disabled={isSaving}
            className="h-11 text-[15px]"
          />
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Category
          </label>
          <Input
            value={form.category}
            onChange={(e) => setFormField("category", e.target.value)}
            placeholder="e.g. Smartphones"
            disabled={isSaving}
            className="h-11 text-[15px]"
          />
        </div>
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />

      {/* Sheet — max 85vh, flex column layout for sticky header + footer */}
      <div
        className="relative w-full flex flex-col bg-background rounded-t-2xl animate-slide-up"
        style={{ maxHeight: "85vh" }}
      >
        {/* ── Sticky header ─────────────────────────────────── */}
        <div className="shrink-0 px-5 pt-3 pb-3 border-b border-border">
          {/* Drag handle */}
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-muted-foreground/30" />

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold leading-tight">
              {isCreateMode ? "Add Product" : isEditing ? "Edit Product" : product.name}
            </h2>

            <div className="flex items-center gap-2">
              {!isCreateMode && (
                <StatusBadge
                  status={isEditing ? form.status : product.status}
                  variant="product"
                />
              )}
              <button
                onClick={onClose}
                className="p-1.5 -mr-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Scrollable body ───────────────────────────────── */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
          {error && (
            <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
              {error}
            </div>
          )}

          {(isCreateMode || isEditing) && (
            <div className="space-y-4">
              {formContent}

              {/* Cancel button (edit mode only) */}
              {!isCreateMode && (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-muted-foreground"
                  onClick={() => {
                    setForm(getFormState(product));
                    setIsEditing(false);
                    setError(null);
                  }}
                  disabled={isSaving}
                >
                  Cancel editing
                </Button>
              )}
            </div>
          )}

          {!isCreateMode && !isEditing && (
            <div className="space-y-4">
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
            </div>
          )}
        </div>

        {/* ── Sticky footer ─────────────────────────────────── */}
        <div
          className="shrink-0 border-t border-border bg-background px-5 pt-3"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0.75rem))" }}
        >
          {(isCreateMode || isEditing) ? (
            <Button
              type="button"
              className="w-full h-12 text-[15px] font-semibold rounded-xl"
              onClick={() => void handleSave()}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : isCreateMode ? (
                "Create Product"
              ) : (
                "Save Changes"
              )}
            </Button>
          ) : (
            <Button
              className="w-full h-12 text-[15px] font-semibold rounded-xl"
              onClick={() => setIsEditing(true)}
              disabled={isToggling}
            >
              Edit Product
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

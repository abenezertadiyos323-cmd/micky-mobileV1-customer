import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { cn, formatPrice, formatDateTime } from "@/lib/utils";
import type { ExchangeRequest } from "@/types/order";
import { X, ArrowRight, Check, XCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "convex_generated/api";
import { useState } from "react";

interface ExchangeDetailSheetProps {
  exchange: ExchangeRequest | null;
  onClose: () => void;
}

export function ExchangeDetailSheet({ exchange, onClose }: ExchangeDetailSheetProps) {
  const updateStatus = useMutation(api.phoneActions.updateExchangeStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!exchange) return null;

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await updateStatus({ requestId: exchange._id as any, status: newStatus });
      onClose();
    } catch (error) {
      console.error("Failed to update exchange status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const canApprove = exchange.status === "new" || exchange.status === "pending";
  const canReject = exchange.status === "new" || exchange.status === "pending";
  const canMarkPending = exchange.status === "new";

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

        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold flex-1">Exchange Request</h2>
            <StatusBadge status={exchange.status} variant="exchange" />
          </div>

          {/* Exchange Flow */}
          <Card className="admin-card">
            <CardContent className="p-4 space-y-4">
              {/* Offered Device */}
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Offering</p>
                <p className="font-semibold">{exchange.offeredModel}</p>
                <p className="text-sm text-muted-foreground">
                  {exchange.offeredStorageGb}GB &middot; {exchange.offeredCondition}
                </p>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>

              {/* Desired Device */}
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Wants</p>
                <p className="font-semibold">{exchange.desiredPhoneName || "Unknown Phone"}</p>
                {exchange.desiredPhonePrice && (
                  <p className="text-sm font-bold text-primary mt-1">
                    {formatPrice(exchange.desiredPhonePrice)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {exchange.offeredNotes && (
            <Card className="admin-card">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground font-medium mb-1">Customer Notes</p>
                <p className="text-sm">{exchange.offeredNotes}</p>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card className="admin-card">
            <CardContent className="p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Session</span>
                <span className="font-mono text-xs">{exchange.sessionId.substring(0, 20)}...</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created</span>
                <span>{formatDateTime(exchange.createdAt)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {(canApprove || canReject) && (
            <div className="flex gap-3 pt-2">
              {canMarkPending && (
                <Button
                  variant="outline"
                  className="flex-1 min-h-[44px]"
                  onClick={() => handleStatusUpdate("pending")}
                  disabled={isUpdating}
                >
                  Mark Pending
                </Button>
              )}
              {canApprove && (
                <Button
                  className="flex-1 min-h-[44px] bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleStatusUpdate("completed")}
                  disabled={isUpdating}
                >
                  <Check className="h-4 w-4 mr-1" /> Approve
                </Button>
              )}
              {canReject && (
                <Button
                  variant="destructive"
                  className="flex-1 min-h-[44px]"
                  onClick={() => handleStatusUpdate("rejected")}
                  disabled={isUpdating}
                >
                  <XCircle className="h-4 w-4 mr-1" /> Reject
                </Button>
              )}
            </div>
          )}

          {/* Spacer for bottom safe area */}
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}

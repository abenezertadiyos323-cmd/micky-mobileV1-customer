import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatRelativeTime, formatPrice } from "@/lib/utils";
import type { PhoneAction } from "@/types/order";
import { ShoppingCart, HelpCircle, Eye } from "lucide-react";

interface OrderCardProps {
  action: PhoneAction;
  onClick?: () => void;
  className?: string;
}

export function OrderCard({ action, onClick, className }: OrderCardProps) {
  // Get action type icon and label
  const getActionInfo = () => {
    switch (action.actionType) {
      case "reserve":
        return {
          icon: <ShoppingCart className="h-4 w-4" />,
          label: "Reservation",
          color: "bg-green-500/10 text-green-400",
        };
      case "ask":
        return {
          icon: <HelpCircle className="h-4 w-4" />,
          label: "Question",
          color: "bg-blue-500/10 text-blue-400",
        };
      case "view":
        return {
          icon: <Eye className="h-4 w-4" />,
          label: "View",
          color: "bg-muted text-muted-foreground",
        };
      default:
        return {
          icon: null,
          label: action.actionType,
          color: "bg-muted text-muted-foreground",
        };
    }
  };

  const actionInfo = getActionInfo();

  return (
    <Card className={cn("admin-card-interactive", className)} onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Icon */}
          <div className={cn("rounded-full p-2 shrink-0", actionInfo.color)}>
            {actionInfo.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm line-clamp-1">
                  {action.phoneName || "Unknown Phone"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Session: {action.sessionId.substring(0, 12)}...
                </p>
              </div>
              <Badge variant="outline" className="shrink-0">
                {actionInfo.label}
              </Badge>
            </div>

            {/* Price and Time */}
            <div className="flex items-center justify-between mt-3">
              {action.phonePrice && (
                <p className="text-sm font-bold text-primary">{formatPrice(action.phonePrice)}</p>
              )}
              <p className="text-xs text-muted-foreground">{formatRelativeTime(action.createdAt)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

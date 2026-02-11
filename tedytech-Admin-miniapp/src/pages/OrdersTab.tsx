import { useState } from "react";
import { OrderTabs } from "@/components/orders/OrderTabs";
import { OrderList } from "@/components/orders/OrderList";
import { OrderCard } from "@/components/orders/OrderCard";
import { ExchangeCard } from "@/components/orders/ExchangeCard";
import { ExchangeDetailSheet } from "@/components/orders/ExchangeDetailSheet";
import { usePhoneActions } from "@/hooks/useOrders";
import { useExchangeRequests } from "@/hooks/useExchanges";
import type { ExchangeRequest } from "@/types/order";

export function OrdersTab() {
  const { data: phoneActions, isLoading: actionsLoading } = usePhoneActions();
  const { data: exchanges, isLoading: exchangesLoading } = useExchangeRequests();
  const [selectedExchange, setSelectedExchange] = useState<ExchangeRequest | null>(null);

  return (
    <div className="space-y-4 animate-fade-in">
      <OrderTabs
        defaultTab="actions"
        actionsCount={phoneActions.length}
        exchangesCount={exchanges.length}
        actionsContent={
          <OrderList
            items={phoneActions}
            renderItem={(action) => (
              <OrderCard action={action} />
            )}
            isLoading={actionsLoading}
            emptyMessage="No phone actions yet"
            emptyDescription="Customer phone action requests will appear here"
          />
        }
        exchangesContent={
          <OrderList
            items={exchanges}
            renderItem={(exchange) => (
              <ExchangeCard exchange={exchange} onClick={() => setSelectedExchange(exchange)} />
            )}
            isLoading={exchangesLoading}
            emptyMessage="No exchange requests yet"
            emptyDescription="Customer exchange requests will appear here"
          />
        }
      />

      {/* Exchange Detail Sheet */}
      <ExchangeDetailSheet
        exchange={selectedExchange}
        onClose={() => setSelectedExchange(null)}
      />
    </div>
  );
}

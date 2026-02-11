import { ArrowRight } from "lucide-react";
import { List, ListItem, Block, Button } from "konsta/react";

interface OrdersSummaryCardProps {
  phoneActions: number;
  exchangeRequests: number;
  onViewAll: () => void;
}

export function OrdersSummaryCard({
  phoneActions,
  exchangeRequests,
  onViewAll,
}: OrdersSummaryCardProps) {
  return (
    <Block className="mx-4">
      <div className="p-4">
        <h3 className="font-semibold text-base mb-3">Orders & Exchanges</h3>
        <List dividers>
          <ListItem
            title="Phone Actions"
            after={<span className="font-medium">{phoneActions}</span>}
          />
          <ListItem
            title="Exchange Requests"
            after={<span className="font-medium">{exchangeRequests}</span>}
          />
        </List>
        <div className="mt-3">
          <Button large onClick={onViewAll} className="w-full justify-center">
            View all <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </Block>
  );
}

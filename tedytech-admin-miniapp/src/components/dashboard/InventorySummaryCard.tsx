import { ArrowRight } from "lucide-react";
import { List, ListItem, Block, Button } from "konsta/react";

interface InventorySummaryCardProps {
  totalProducts: number;
  byStatus: {
    active: number;
    draft: number;
    archived: number;
  };
  onViewAll: () => void;
}

export function InventorySummaryCard({
  totalProducts,
  byStatus,
  onViewAll,
}: InventorySummaryCardProps) {
  return (
    <Block className="mx-4">
      <div className="p-4">
        <h3 className="font-semibold text-base mb-3">Inventory</h3>
        <List dividers>
          <ListItem
            title="Total Products"
            after={<span className="font-medium">{totalProducts}</span>}
          />
          <ListItem
            title="Active"
            after={
              <span className="font-medium text-green-600">
                {byStatus.active}
              </span>
            }
          />
          <ListItem
            title="Draft"
            after={
              <span className="font-medium text-gray-500">
                {byStatus.draft}
              </span>
            }
          />
        </List>
        <div className="mt-3">
          <Button large onClick={onViewAll} className="w-full justify-center">
            View Inventory <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </Block>
  );
}

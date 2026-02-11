import { ArrowRight } from 'lucide-react';

interface InventorySummaryCardProps {
  totalProducts: number;
  byStatus: {
    active: number;
    draft: number;
    archived: number;
  };
  onViewAll: () => void;
}

export function InventorySummaryCard({ totalProducts, byStatus, onViewAll }: InventorySummaryCardProps) {
  return (
    <div className="mx-4 p-4 bg-white rounded-lg border border-gray-200">
      <h3 className="font-semibold text-base mb-3">Inventory</h3>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Products</span>
          <span className="font-medium">{totalProducts}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Active</span>
          <span className="font-medium text-green-600">{byStatus.active}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Draft</span>
          <span className="font-medium text-gray-500">{byStatus.draft}</span>
        </div>
      </div>
      <button
        onClick={onViewAll}
        className="w-full px-4 py-2 text-center text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center gap-2"
      >
        View Inventory <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

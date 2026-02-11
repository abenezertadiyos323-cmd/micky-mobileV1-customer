import { ArrowRight } from 'lucide-react';

interface OrdersSummaryCardProps {
  phoneActions: number;
  exchangeRequests: number;
  onViewAll: () => void;
}

export function OrdersSummaryCard({ phoneActions, exchangeRequests, onViewAll }: OrdersSummaryCardProps) {
  return (
    <div className="mx-4 p-4 bg-white rounded-lg border border-gray-200">
      <h3 className="font-semibold text-base mb-3">Orders & Exchanges</h3>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Phone Actions</span>
          <span className="font-medium">{phoneActions}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Exchange Requests</span>
          <span className="font-medium">{exchangeRequests}</span>
        </div>
      </div>
      <button
        onClick={onViewAll}
        className="w-full px-4 py-2 text-center text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center gap-2"
      >
        View all <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

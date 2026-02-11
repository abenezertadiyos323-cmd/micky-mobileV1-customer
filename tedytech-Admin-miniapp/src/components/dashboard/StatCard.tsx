import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: LucideIcon;
}

export function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        {Icon && <Icon className="h-6 w-6 text-primary opacity-50" />}
      </div>
    </div>
  );
}

import { Flame } from 'lucide-react';
import { HotLead } from '@/types/hotLead';
import { formatPrice, formatRelativeTime } from '@/lib/utils';

interface HotLeadsSectionProps {
  leads: HotLead[];
  isLoading: boolean;
}

export function HotLeadsSection({ leads, isLoading }: HotLeadsSectionProps) {
  if (isLoading) {
    return (
      <div className="mx-4 p-4 bg-white rounded-lg border border-gray-200">
        <div className="text-center text-gray-500">Loading hot leads...</div>
      </div>
    );
  }

  return (
    <div className="space-y-2 px-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Hot Leads
        </h2>
        <span className="text-sm text-gray-500">{leads.length} active</span>
      </div>

      {leads.length === 0 ? (
        <div className="p-6 bg-white rounded-lg border border-gray-200 text-center text-gray-500">
          <p>No hot leads right now</p>
          <p className="text-sm mt-1">Check Inbox for all activity</p>
        </div>
      ) : (
        <div className="space-y-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
          {leads.map((lead, idx) => (
            <div
              key={lead.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition ${
                idx !== leads.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {lead.priority && <span className="text-base">{lead.priority}</span>}
                    <span className="font-medium text-sm truncate">{lead.title}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{lead.description}</p>
                  {lead.budgetETB && (
                    <div className="text-xs text-green-600 font-medium">
                      Budget: {formatPrice(lead.budgetETB)}
                    </div>
                  )}
                </div>
                <div className="text-xs text-right flex-shrink-0">
                  <div className="text-gray-500">{formatRelativeTime(lead.timestamp)}</div>
                  <div className="text-orange-600 font-medium mt-1">{lead.waitTime}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

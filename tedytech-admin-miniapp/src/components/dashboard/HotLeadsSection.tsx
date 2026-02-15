import { Flame } from "lucide-react";
import { HotLead } from "@/types/hotLead";
import { formatPrice, formatRelativeTime } from "@/lib/utils";
import { List, ListItem, Block } from "konsta/react";

interface HotLeadsSectionProps {
  leads: HotLead[];
  isLoading: boolean;
}

export function HotLeadsSection({ leads, isLoading }: HotLeadsSectionProps) {
  if (isLoading) {
    return <Block className="mx-4 p-4 text-center">Loading hot leads...</Block>;
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
        <Block className="p-6 text-center">
          No hot leads right now
          <div className="text-sm mt-1 text-gray-500">
            Check Inbox for all activity
          </div>
        </Block>
      ) : (
        <List dividers>
          {leads.map((lead) => (
            <ListItem
              key={lead.id}
              link
              linkComponent="button"
              title={
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">
                    {lead.title}
                  </span>
                </div>
              }
              text={lead.description}
              media={
                lead.priority ? (
                  <span className="text-base">{lead.priority}</span>
                ) : undefined
              }
              after={
                <div className="text-xs text-right">
                  <div className="text-gray-500">
                    {formatRelativeTime(lead.timestamp)}
                  </div>
                  <div className="text-orange-600 font-medium mt-1">
                    {lead.waitTime}
                  </div>
                </div>
              }
              linkProps={{}}
            />
          ))}
        </List>
      )}
    </div>
  );
}

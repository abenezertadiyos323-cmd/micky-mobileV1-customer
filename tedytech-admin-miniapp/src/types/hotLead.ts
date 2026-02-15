export interface HotLead {
  id: string;
  type: 'exchange' | 'action';
  score: number; // 3, 2, 1, 0
  priority: '🔥🔥🔥' | '🔥🔥' | '🔥' | '';
  title: string;
  description: string;
  budgetETB?: number;
  timestamp: number;
  waitTime: string; // "Waiting 8m" or "Waiting 3h"
  sessionId: string;
  metadata: {
    actionType?: string;
    desiredPhoneName?: string;
    offeredModel?: string;
    status?: string;
  };
}

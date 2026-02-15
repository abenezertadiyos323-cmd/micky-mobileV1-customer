import { toast as sonnerToast } from 'sonner';

export const toast = {
  offline: () => sonnerToast.error('Connection lost - retrying...'),
  online: () => sonnerToast.success('Connection restored'),
  synced: () => sonnerToast.success('Synced ✓'),
  error: (msg: string) => sonnerToast.error(msg),
};

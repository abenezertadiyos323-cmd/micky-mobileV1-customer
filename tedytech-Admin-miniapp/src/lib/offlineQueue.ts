interface QueuedMutation {
  id: string;
  functionName: string;
  args: any;
  timestamp: number;
  retries: number;
}

const QUEUE_KEY = 'tedytech_admin_mutation_queue';
const MAX_RETRIES = 3;

export function queueMutation(functionName: string, args: any) {
  const queue = getQueue();
  queue.push({
    id: crypto.randomUUID(),
    functionName,
    args,
    timestamp: Date.now(),
    retries: 0,
  });
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function getQueue(): QueuedMutation[] {
  const data = localStorage.getItem(QUEUE_KEY);
  return data ? JSON.parse(data) : [];
}

export function clearQueue() {
  localStorage.removeItem(QUEUE_KEY);
}

export async function processQueue(convex: any) {
  const queue = getQueue();
  const failedMutations: QueuedMutation[] = [];

  for (const mutation of queue) {
    try {
      await convex.mutation(mutation.functionName, mutation.args);
    } catch (error) {
      if (mutation.retries < MAX_RETRIES) {
        failedMutations.push({ ...mutation, retries: mutation.retries + 1 });
      }
    }
  }

  if (failedMutations.length > 0) {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(failedMutations));
  } else {
    clearQueue();
  }

  return { processed: queue.length - failedMutations.length, failed: failedMutations.length };
}

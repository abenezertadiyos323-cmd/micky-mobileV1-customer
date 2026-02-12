import { safeJsonParse, safeLocalStorage } from "./errorHandler";

interface QueuedMutation {
  id: string;
  functionName: string;
  args: any;
  timestamp: number;
  retries: number;
}

const QUEUE_KEY = "tedytech_admin_mutation_queue";
const MAX_RETRIES = 3;

export function queueMutation(functionName: string, args: any) {
  console.log("[OfflineQueue] Queueing mutation:", { functionName, args });

  const queue = getQueue();
  queue.push({
    id: crypto.randomUUID(),
    functionName,
    args,
    timestamp: Date.now(),
    retries: 0,
  });

  safeLocalStorage("set", QUEUE_KEY, queue);
}

export function getQueue(): QueuedMutation[] {
  const data = localStorage.getItem(QUEUE_KEY);
  if (!data) {
    return [];
  }

  return safeJsonParse<QueuedMutation[]>(data, [], "offlineQueue.getQueue");
}

export function clearQueue() {
  console.log("[OfflineQueue] Clearing queue");
  safeLocalStorage("remove", QUEUE_KEY);
}

export async function processQueue(convex: any) {
  console.log("[OfflineQueue] Processing queue");

  const queue = getQueue();
  if (queue.length === 0) {
    console.log("[OfflineQueue] Queue is empty");
    return { processed: 0, failed: 0 };
  }

  const failedMutations: QueuedMutation[] = [];

  for (const mutation of queue) {
    try {
      console.log("[OfflineQueue] Processing mutation:", {
        id: mutation.id,
        functionName: mutation.functionName,
        retries: mutation.retries,
      });

      await convex.mutation(mutation.functionName, mutation.args);

      console.log("[OfflineQueue] Mutation succeeded:", mutation.id);
    } catch (error) {
      console.error("[OfflineQueue] Mutation failed:", {
        id: mutation.id,
        error,
        retries: mutation.retries,
      });

      if (mutation.retries < MAX_RETRIES) {
        failedMutations.push({ ...mutation, retries: mutation.retries + 1 });
      } else {
        console.error(
          "[OfflineQueue] Mutation exceeded max retries, discarding:",
          mutation.id,
        );
      }
    }
  }

  if (failedMutations.length > 0) {
    console.log(
      "[OfflineQueue] Re-queueing failed mutations:",
      failedMutations.length,
    );
    safeLocalStorage("set", QUEUE_KEY, failedMutations);
  } else {
    clearQueue();
  }

  const result = {
    processed: queue.length - failedMutations.length,
    failed: failedMutations.length,
  };

  console.log("[OfflineQueue] Processing complete:", result);
  return result;
}

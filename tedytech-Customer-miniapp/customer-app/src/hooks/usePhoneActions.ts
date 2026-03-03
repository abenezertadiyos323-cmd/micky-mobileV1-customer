import { useState } from "react";
import {
  useMutation as useConvexMutation,
  useQuery as useConvexQuery,
} from "convex/react";
import { api } from "@/convex_generated/api";
import { toast } from "@/hooks/use-toast";

export type LeadActionType = "inquiry" | "exchange" | "call" | "map";
export type LeadSourceTab =
  | "home"
  | "search"
  | "saved"
  | "product_detail"
  | "about";

interface CreateActionParams {
  actionType: LeadActionType;
  sourceTab: LeadSourceTab;
  sourceProductId?: string | null;
  timestamp?: number;
}

export function useCreatePhoneAction(sessionId: string | null) {
  const mutation = useConvexMutation(api.phoneActions.createPhoneActionRequest);
  const [isPending, setIsPending] = useState(false);

  return {
    isPending,
    mutate: async ({
      actionType,
      sourceTab,
      sourceProductId,
      timestamp,
    }: CreateActionParams) => {
      if (!sessionId) throw new Error("No session");

      setIsPending(true);
      try {
        const id = await mutation({
          sessionId,
          actionType,
          sourceTab,
          sourceProductId: sourceProductId ?? undefined,
          timestamp: timestamp ?? Date.now(),
        });
        return id;
      } catch (e) {
        console.error("Failed to create action:", e);
        toast({
          title: "Error",
          description: "Failed to submit request. Please try again.",
          variant: "destructive",
        });
        throw e;
      } finally {
        setIsPending(false);
      }
    },
  };
}

interface CreateExchangeParams {
  desiredPhoneId: string;
  offeredModel: string;
  offeredStorageGb: number;
  offeredCondition: string;
  offeredNotes: string;
}

export function useCreateExchangeRequest(sessionId: string | null) {
  const mutation = useConvexMutation(
    api.phoneActions.createExchangeRequestMiniapp,
  );
  const [isPending, setIsPending] = useState(false);

  return {
    isPending,
    mutate: async (params: CreateExchangeParams) => {
      if (!sessionId) throw new Error("No session");

      setIsPending(true);
      try {
        const id = await mutation({
          sessionId,
          desiredPhoneId: params.desiredPhoneId,
          offeredModel: params.offeredModel,
          offeredStorageGb: params.offeredStorageGb,
          offeredCondition: params.offeredCondition.toLowerCase(),
          offeredNotes: params.offeredNotes,
        });
        toast({
          title: "Exchange Request Submitted!",
          description: "Our team will contact you on Telegram with an offer.",
        });
        return id;
      } catch (e) {
        console.error("Failed to create exchange request:", e);
        toast({
          title: "Error",
          description: "Failed to submit exchange request. Please try again.",
          variant: "destructive",
        });
        throw e;
      } finally {
        setIsPending(false);
      }
    },
  };
}

export function useExchangeRequests(sessionId: string | null) {
  const data = useConvexQuery(
    api.phoneActions.getExchangeRequestsV2,
    sessionId ? { sessionId } : "skip",
  );
  return {
    data: data ?? [],
    isLoading: data === undefined,
    error: null,
  };
}

export function useExchangeDetail(
  requestId: string | null,
  sessionId: string | null,
) {
  const data = useConvexQuery(
    api.phoneActions.getExchangeDetailV2,
    requestId && sessionId ? { requestId, sessionId } : "skip",
  );
  return {
    data: data ?? null,
    isLoading: data === undefined,
    error: null,
  };
}

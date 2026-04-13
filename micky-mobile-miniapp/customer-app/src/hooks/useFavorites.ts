import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  useQuery as useConvexQuery,
  useMutation as useConvexMutation,
} from "convex/react";
import { api } from "@/convex_generated/api";
import { toast } from "@/hooks/use-toast";

export interface FavoriteRecord {
  phoneId: string;
  userId: string;
  createdAt: number;
}

const favoritesSubscribers = new Map<
  string,
  Dispatch<SetStateAction<FavoriteRecord[]>>
>();
const latestFavorites = new Map<string, FavoriteRecord[]>();

export function useFavorites(sessionId: string | null) {
  const convexData = useConvexQuery(
    api.favorites.getFavorites,
    sessionId ? { userId: sessionId } : "skip",
  );
  const data = (convexData ?? []) as FavoriteRecord[];

  const [localFavorites, setLocalFavorites] = useState<FavoriteRecord[]>([]);

  useEffect(() => {
    setLocalFavorites(data);
    if (sessionId) latestFavorites.set(sessionId, data);
  }, [sessionId, data]);

  useEffect(() => {
    if (!sessionId) return;
    favoritesSubscribers.set(sessionId, setLocalFavorites);
    return () => {
      favoritesSubscribers.delete(sessionId);
      latestFavorites.delete(sessionId);
    };
  }, [sessionId]);

  return {
    data: localFavorites,
    isLoading: !!sessionId && convexData === undefined,
    error: null,
  };
}

export function useAddFavorite(sessionId: string | null) {
  const mutation = useConvexMutation(api.favorites.addFavorite);

  return {
    mutate: async (phoneId: string) => {
      if (!sessionId) throw new Error("No session");

      const setter = favoritesSubscribers.get(sessionId);
      const previous = latestFavorites.get(sessionId) ?? [];
      const optimistic: FavoriteRecord = {
        phoneId,
        userId: sessionId,
        createdAt: Date.now(),
      };

      try {
        if (setter) {
          setter((state) => {
            if (state.some((item) => item.phoneId === phoneId)) return state;
            const next = [optimistic, ...state];
            latestFavorites.set(sessionId, next);
            return next;
          });
        }
        await mutation({ userId: sessionId, phoneId });
      } catch (e) {
        if (setter) {
          setter(() => previous);
          latestFavorites.set(sessionId, previous);
        }
        console.error("Failed to add favorite:", e);
        toast({
          title: "Error",
          description: "Failed to save phone",
          variant: "destructive",
        });
        throw e;
      }
    },
  };
}

export function useRemoveFavorite(sessionId: string | null) {
  const mutation = useConvexMutation(api.favorites.removeFavorite);

  return {
    mutate: async (phoneId: string) => {
      if (!sessionId) throw new Error("No session");

      const setter = favoritesSubscribers.get(sessionId);
      const previous = latestFavorites.get(sessionId) ?? [];

      try {
        if (setter) {
          setter((state) => {
            const next = state.filter((item) => item.phoneId !== phoneId);
            latestFavorites.set(sessionId, next);
            return next;
          });
        }
        await mutation({ userId: sessionId, phoneId });
      } catch (e) {
        if (setter) {
          setter(() => previous);
          latestFavorites.set(sessionId, previous);
        }
        console.error("Failed to remove favorite:", e);
        toast({
          title: "Error",
          description: "Failed to remove phone from saved",
          variant: "destructive",
        });
        throw e;
      }
    },
  };
}

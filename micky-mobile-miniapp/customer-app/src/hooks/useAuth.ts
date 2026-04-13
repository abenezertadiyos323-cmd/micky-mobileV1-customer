import { useState, useCallback } from "react";
import { useMutation as useConvexMutation } from "convex/react";
import { api } from "@/convex_generated/api";
import { useApp } from "@/contexts/AppContext";

const TELEGRAM_AUTH_ERROR =
  "Couldn't verify your Telegram account. Please reopen this mini app from Telegram.";

interface TelegramIdentity {
  customerId: string;
  telegramUserId: number;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  photoUrl: string | null;
}

export function useAuth() {
  const { sessionId, isSessionLoading: sessionLoading } = useApp();
  const loginWithTelegram = useConvexMutation(api.auth.loginWithTelegram);
  const [telegramIdentity, setTelegramIdentity] =
    useState<TelegramIdentity | null>(null);
  const [isTelegramVerifying, setIsTelegramVerifying] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const verifyTelegram = useCallback(
    async (initData: string) => {
      if (!initData?.trim()) {
        setAuthError(TELEGRAM_AUTH_ERROR);
        return false;
      }

      setIsTelegramVerifying(true);
      setAuthError(null);
      try {
        const result = (await loginWithTelegram.mutate({
          initData,
        })) as {
          ok: boolean;
          customer?: {
            id: string;
            telegramUserId: number;
            username?: string | null;
            firstName?: string | null;
            lastName?: string | null;
            photoUrl?: string | null;
          };
        };

        if (!result?.ok || !result.customer) {
          setTelegramIdentity(null);
          setAuthError(TELEGRAM_AUTH_ERROR);
          return false;
        }

        setTelegramIdentity({
          customerId: result.customer.id,
          telegramUserId: result.customer.telegramUserId,
          username: result.customer.username ?? null,
          firstName: result.customer.firstName ?? null,
          lastName: result.customer.lastName ?? null,
          photoUrl: result.customer.photoUrl ?? null,
        });

        return true;
      } catch {
        setTelegramIdentity(null);
        setAuthError(TELEGRAM_AUTH_ERROR);
        return false;
      } finally {
        setIsTelegramVerifying(false);
      }
    },
    [loginWithTelegram],
  );

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  return {
    user: null,
    session: null,
    authUserId: sessionId,
    telegramIdentity,
    isLoading: sessionLoading || isTelegramVerifying,
    isAuthenticated: !!sessionId,
    isTelegramAuthenticated: !!telegramIdentity,
    authError,
    clearAuthError,
    verifyTelegram,
  };
}

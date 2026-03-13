import { Referral, ReferralState } from "@/types";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect, useMemo, useCallback } from "react";
import { trpcClient } from "@/lib/trpc";
import logger from "@/lib/logger";

const STORAGE_KEY_REFERRAL = "iris_referral_state";
const REFERRAL_CODE_PATTERN = /^IRIS-[A-Z0-9]{6}$/;
const STORAGE_KEY_USER_ID = "iris_user_id";
const STORAGE_KEY_APPLIED_CODE = "iris_applied_referral_code";

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "IRIS-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
}

function getInitialReferralState(): ReferralState {
  const code = generateReferralCode();
  return {
    referralCode: code,
    referralLink: `https://iris.app/invite/${code}`,
    referralsSent: 0,
    referralsConverted: 0,
    freeMonthsEarned: 0,
    freeMonthsUsed: 0,
    referrals: [],
    maxReferralsPerMonth: 10,
    referralGoal: 1,
    referralProgress: 0,
  };
}

export const [ReferralContext, useReferral] = createContextHook(() => {
  const [state, setState] = useState<ReferralState>(getInitialReferralState());
  const [userId, setUserId] = useState<string>("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const userIdQuery = useQuery({
    queryKey: ["userId"],
    queryFn: async () => {
      let stored = await AsyncStorage.getItem(STORAGE_KEY_USER_ID);
      if (!stored) {
        stored = generateUserId();
        await AsyncStorage.setItem(STORAGE_KEY_USER_ID, stored);
      }
      return stored;
    },
  });

  useEffect(() => {
    if (userIdQuery.data) {
      setUserId(userIdQuery.data);
    }
  }, [userIdQuery.data]);

  const referralQuery = useQuery({
    queryKey: ["referralState"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY_REFERRAL);
      if (stored) {
        return JSON.parse(stored) as ReferralState;
      }
      const initial = getInitialReferralState();
      await AsyncStorage.setItem(STORAGE_KEY_REFERRAL, JSON.stringify(initial));
      return initial;
    },
  });

  const appliedCodeQuery = useQuery({
    queryKey: ["appliedReferralCode"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY_APPLIED_CODE);
      return stored || null;
    },
  });

  useEffect(() => {
    if (referralQuery.data) {
      setState(referralQuery.data);
    }
  }, [referralQuery.data]);

  useEffect(() => {
    if (appliedCodeQuery.data !== undefined) {
      setAppliedCode(appliedCodeQuery.data);
    }
  }, [appliedCodeQuery.data]);

  const registerMutation = useMutation({
    mutationFn: async ({ uid, code }: { uid: string; code: string }) => {
      try {
        const result = await trpcClient.referral.register.mutate({
          userId: uid,
          referralCode: code,
        });
        logger.log("[Referral] Backend register result:", result);
        return result;
      } catch (err) {
        logger.log("[Referral] Backend register failed (offline mode):", err);
        return { success: true as const, referralCode: code };
      }
    },
    onSuccess: () => {
      setIsRegistered(true);
    },
  });

  const { mutate: registerMutate } = registerMutation;

  useEffect(() => {
    if (userId && state.referralCode && !isRegistered) {
      registerMutate({ uid: userId, code: state.referralCode });
    }
  }, [userId, state.referralCode, isRegistered, registerMutate]);

  const saveMutation = useMutation({
    mutationFn: async (newState: ReferralState) => {
      await AsyncStorage.setItem(STORAGE_KEY_REFERRAL, JSON.stringify(newState));
      return newState;
    },
    onSuccess: (data) => {
      setState(data);
    },
  });

  const { mutate: saveMutate } = saveMutation;

  const validateCodeMutation = useMutation({
    mutationFn: async (code: string) => {
      const upperCode = code.toUpperCase();
      try {
        const result = await trpcClient.referral.validate.query({
          referralCode: upperCode,
        });
        logger.log("[Referral] Validate result:", result);
        return result;
      } catch (err) {
        logger.log("[Referral] Validate failed (offline), falling back to format check:", err);
        if (REFERRAL_CODE_PATTERN.test(upperCode)) {
          logger.log("[Referral] Code format valid (offline fallback):", upperCode);
          return { valid: true as const, referrerUserId: "" };
        }
        return { valid: false as const, error: "network_error" as const };
      }
    },
  });

  const applyCodeMutation = useMutation({
    mutationFn: async (code: string) => {
      if (!userId) {
        return { success: false as const, error: "no_user_id" as const };
      }
      try {
        const result = await trpcClient.referral.apply.mutate({
          referralCode: code,
          newUserId: userId,
        });
        logger.log("[Referral] Apply result:", result);
        if (result.success) {
          await AsyncStorage.setItem(STORAGE_KEY_APPLIED_CODE, code);
          setAppliedCode(code);
        }
        return result;
      } catch (err) {
        logger.log("[Referral] Apply failed (offline):", err);
        await AsyncStorage.setItem(STORAGE_KEY_APPLIED_CODE, code);
        setAppliedCode(code);
        return { success: true as const, referralCode: code, referrerUserId: "" };
      }
    },
  });

  const trackMilestoneMutation = useMutation({
    mutationFn: async (milestone: "installed" | "onboarded" | "subscribed") => {
      if (!userId) return { success: false as const, error: "no_user_id" as const };
      try {
        const result = await trpcClient.referral.trackMilestone.mutate({
          userId,
          milestone,
        });
        logger.log("[Referral] Milestone tracked:", milestone, result);
        return result;
      } catch (err) {
        logger.log("[Referral] Milestone track failed (offline):", err);
        return { success: false as const, error: "network_error" as const };
      }
    },
  });

  const sendReferral = useCallback((platform: Referral["platform"]) => {
    const now = new Date().toISOString();
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const referralsThisMonth = state.referrals.filter(
      (r) => new Date(r.createdAt) >= monthStart
    ).length;

    if (referralsThisMonth >= state.maxReferralsPerMonth) {
      logger.log("[Referral] Monthly limit reached:", referralsThisMonth);
      return { success: false, reason: "monthly_limit" as const };
    }

    const newReferral: Referral = {
      id: `ref_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      status: "sent",
      platform,
      createdAt: now,
    };

    const updated: ReferralState = {
      ...state,
      referralsSent: state.referralsSent + 1,
      referrals: [...state.referrals, newReferral],
    };

    saveMutate(updated);
    logger.log("[Referral] Sent via", platform, "total:", updated.referralsSent);
    return { success: true, referral: newReferral };
  }, [state, saveMutate]);

  const simulateReferralProgress = useCallback((referralId: string, newStatus: Referral["status"]) => {
    const updatedReferrals = state.referrals.map((r) => {
      if (r.id === referralId) {
        return {
          ...r,
          status: newStatus,
          convertedAt: newStatus === "subscribed" ? new Date().toISOString() : r.convertedAt,
        };
      }
      return r;
    });

    const converted = updatedReferrals.filter((r) => r.status === "subscribed").length;
    const freeMonths = Math.floor(converted / state.referralGoal);

    const updated: ReferralState = {
      ...state,
      referrals: updatedReferrals,
      referralsConverted: converted,
      freeMonthsEarned: freeMonths,
      referralProgress: converted % state.referralGoal,
    };

    saveMutate(updated);
    logger.log("[Referral] Status updated:", referralId, "->", newStatus);
  }, [state, saveMutate]);

  const referralStats = useMemo(() => {
    const sent = state.referrals.length;
    const installed = state.referrals.filter((r) => r.status === "installed" || r.status === "onboarded" || r.status === "subscribed").length;
    const onboarded = state.referrals.filter((r) => r.status === "onboarded" || r.status === "subscribed").length;
    const subscribed = state.referrals.filter((r) => r.status === "subscribed").length;
    const progressToNextFreeMonth = state.referralProgress;
    const remainingForFreeMonth = state.referralGoal - progressToNextFreeMonth;

    return {
      sent,
      installed,
      onboarded,
      subscribed,
      progressToNextFreeMonth,
      remainingForFreeMonth,
      freeMonthsEarned: state.freeMonthsEarned,
      freeMonthsUsed: state.freeMonthsUsed,
      freeMonthsAvailable: state.freeMonthsEarned - state.freeMonthsUsed,
    };
  }, [state]);

  const shareMessage = useMemo(() => {
    return `Join me on IRIS - the smart cycle tracking app! Use my code ${state.referralCode} and we both get a free month of premium! Download here: ${state.referralLink}`;
  }, [state.referralCode, state.referralLink]);

  const { mutateAsync: validateCodeAsync } = validateCodeMutation;
  const { mutateAsync: applyCodeAsync } = applyCodeMutation;
  const { mutateAsync: trackMilestoneAsync } = trackMilestoneMutation;

  const validateCode = useCallback(async (code: string) => {
    const result = await validateCodeAsync(code);
    return result;
  }, [validateCodeAsync]);

  const applyCode = useCallback(async (code: string) => {
    const result = await applyCodeAsync(code);
    return result;
  }, [applyCodeAsync]);

  const trackMilestone = useCallback(async (milestone: "installed" | "onboarded" | "subscribed") => {
    const result = await trackMilestoneAsync(milestone);
    return result;
  }, [trackMilestoneAsync]);

  return {
    referralCode: state.referralCode,
    referralLink: state.referralLink,
    referrals: state.referrals,
    referralStats,
    shareMessage,
    sendReferral,
    simulateReferralProgress,
    referralGoal: state.referralGoal,
    isLoading: referralQuery.isLoading || userIdQuery.isLoading,
    userId,
    appliedCode,
    validateCode,
    applyCode,
    trackMilestone,
    isValidating: validateCodeMutation.isPending,
    isApplying: applyCodeMutation.isPending,
  };
});

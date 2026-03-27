import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { referralStore } from "@/backend/trpc/routes/referral/store";
import logger from "@/lib/logger";

export default publicProcedure
  .input(
    z.object({
      referralCode: z.string(),
      newUserId: z.string(),
    })
  )
  .mutation(({ input }) => {
    const { referralCode, newUserId } = input;
    const code = referralCode.toUpperCase();

    if (!referralStore.isValidCodeFormat(code)) {
      logger.log("[Referral API] Apply failed - invalid code format:", code);
      return { success: false as const, error: "invalid_code" as const };
    }

    const entry = referralStore.getByCode(code);

    if (entry && entry.userId === newUserId) {
      logger.log("[Referral API] Apply failed - self referral:", newUserId);
      return { success: false as const, error: "self_referral" as const };
    }

    const alreadyReferred = referralStore.getReferredUser(newUserId);
    if (alreadyReferred) {
      logger.log("[Referral API] Apply failed - already referred:", newUserId);
      return { success: false as const, error: "already_referred" as const };
    }

    if (entry) {
      const referralsThisMonth = referralStore.getMonthlyReferralCount(entry.userId);
      if (referralsThisMonth >= 10) {
        logger.log("[Referral API] Apply failed - monthly limit reached for:", entry.userId);
        return { success: false as const, error: "monthly_limit" as const };
      }

      referralStore.applyReferral(entry.userId, newUserId, code);
      logger.log("[Referral API] Referral applied:", code, "new user:", newUserId, "referrer:", entry.userId);

      return {
        success: true as const,
        referrerUserId: entry.userId,
        referralCode: code,
      };
    }

    logger.log("[Referral API] Code format valid but referrer not in store (cold start). Accepting code:", code);
    referralStore.applyReferral("unknown_referrer", newUserId, code);

    return {
      success: true as const,
      referrerUserId: "",
      referralCode: code,
    };
  });

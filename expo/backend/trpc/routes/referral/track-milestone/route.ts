import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { referralStore } from "@/backend/trpc/routes/referral/store";
import logger from "@/lib/logger";
import { ensureReferralHydrated } from "@/backend/trpc/routes/referral/store";

export default publicProcedure
  .input(
    z.object({
      userId: z.string(),
      milestone: z.enum(["installed", "onboarded", "subscribed"]),
    })
  )
  .mutation(async ({ input }) => {
    await ensureReferralHydrated();
    const { userId, milestone } = input;

    const referral = referralStore.getReferredUser(userId);
    if (!referral) {
      logger.log("[Referral API] No referral found for user:", userId);
      return { success: false as const, error: "no_referral" as const };
    }

    const milestoneOrder: Record<string, number> = { installed: 1, onboarded: 2, subscribed: 3 };
    const currentOrder = milestoneOrder[referral.currentMilestone] || 0;
    const newOrder = milestoneOrder[milestone];

    if (newOrder <= currentOrder) {
      logger.log("[Referral API] Milestone already reached:", milestone, "for user:", userId);
      return { success: true as const, alreadyReached: true };
    }

    referralStore.updateMilestone(userId, milestone);

    const referrerStats = referralStore.getReferrerStats(referral.referrerUserId);
    logger.log("[Referral API] Milestone tracked:", milestone, "for user:", userId, "referrer:", referral.referrerUserId);

    return {
      success: true as const,
      alreadyReached: false,
      referrerUserId: referral.referrerUserId,
      referrerStats,
    };
  });

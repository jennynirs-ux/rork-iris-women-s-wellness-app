import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { referralStore } from "@/backend/trpc/routes/referral/store";
import logger from "@/lib/logger";

export default publicProcedure
  .input(
    z.object({
      userId: z.string(),
    })
  )
  .query(({ input }) => {
    const stats = referralStore.getReferrerStats(input.userId);
    logger.log("[Referral API] Stats for user:", input.userId, stats);
    return stats;
  });

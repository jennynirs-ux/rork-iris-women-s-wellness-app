import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { partnerStore } from "@/backend/trpc/routes/partner/store";
import logger from "@/lib/logger";
import { ensurePartnerHydrated } from "@/backend/trpc/routes/partner/store";

export default publicProcedure
  .input(
    z.object({
      userId: z.string(),
      partnerCode: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    await ensurePartnerHydrated();
    const { userId, partnerCode } = input;
    const result = partnerStore.linkPartner(userId, partnerCode);

    if (!result.success) {
      logger.log("[Partner API] Failed to link:", result.error);
      return { success: false, error: result.error };
    }

    logger.log("[Partner API] Successfully linked partner code:", partnerCode);
    return { success: true };
  });

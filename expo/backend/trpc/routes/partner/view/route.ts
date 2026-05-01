import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { partnerStore } from "@/backend/trpc/routes/partner/store";
import logger from "@/lib/logger";
import { ensurePartnerHydrated } from "@/backend/trpc/routes/partner/store";

export default publicProcedure
  .input(
    z.object({
      userId: z.string(),
    })
  )
  .query(async ({ input }) => {
    await ensurePartnerHydrated();
    const { userId } = input;
    const partnerData = partnerStore.getPartnerData(userId);
    logger.log("[Partner API] Retrieved partner data for user:", userId);
    return partnerData;
  });

import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { partnerStore } from "@/backend/trpc/routes/partner/store";
import logger from "@/lib/logger";

export default publicProcedure
  .input(
    z.object({
      userId: z.string(),
    })
  )
  .mutation(({ input }) => {
    const { userId } = input;
    partnerStore.unlinkPartner(userId);
    logger.log("[Partner API] Unlinked partner for user:", userId);
    return { success: true };
  });

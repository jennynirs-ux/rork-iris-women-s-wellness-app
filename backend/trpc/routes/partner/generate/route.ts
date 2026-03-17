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
    const partnerCode = partnerStore.generatePartnerCode(userId);
    logger.log("[Partner API] Generated code for user:", userId);
    return { partnerCode };
  });

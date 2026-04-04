import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { partnerStore } from "../store";
import logger from "../../../../lib/logger";

export default publicProcedure
  .input(
    z.object({
      userId: z.string(),
      partnerCode: z.string(),
    })
  )
  .mutation(({ input }) => {
    const { userId, partnerCode } = input;
    const result = partnerStore.linkPartner(userId, partnerCode);

    if (!result.success) {
      logger.log("[Partner API] Failed to link:", result.error);
      return { success: false, error: result.error };
    }

    logger.log("[Partner API] Successfully linked partner code:", partnerCode);
    return { success: true };
  });

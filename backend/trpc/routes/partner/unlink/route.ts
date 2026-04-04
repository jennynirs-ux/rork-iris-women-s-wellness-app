import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { partnerStore } from "../store";
import logger from "../../../../lib/logger";

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

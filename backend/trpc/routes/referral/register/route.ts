import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { referralStore } from "../store";
import logger from "../../../../lib/logger";

export default publicProcedure
  .input(
    z.object({
      userId: z.string(),
      referralCode: z.string(),
    })
  )
  .mutation(({ input }) => {
    const { userId, referralCode } = input;

    const existing = referralStore.getByCode(referralCode);
    if (existing && existing.userId !== userId) {
      return { success: false as const, error: "code_taken" as const };
    }

    referralStore.register(userId, referralCode);
    logger.log("[Referral API] Registered code:", referralCode, "for user:", userId);

    return { success: true as const, referralCode };
  });

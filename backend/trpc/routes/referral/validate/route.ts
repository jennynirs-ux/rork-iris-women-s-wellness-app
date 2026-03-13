import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { referralStore } from "@/backend/trpc/routes/referral/store";
import logger from "@/lib/logger";

export default publicProcedure
  .input(
    z.object({
      referralCode: z.string(),
    })
  )
  .query(({ input }) => {
    const code = input.referralCode.toUpperCase();

    const entry = referralStore.getByCode(code);
    if (entry) {
      logger.log("[Referral API] Code found in store:", code, "owner:", entry.userId);
      return { valid: true as const, referrerUserId: entry.userId };
    }

    if (referralStore.isValidCodeFormat(code)) {
      logger.log("[Referral API] Code not in store but format valid (likely cold start):", code);
      return { valid: true as const, referrerUserId: "" };
    }

    logger.log("[Referral API] Code invalid format:", code);
    return { valid: false as const, error: "not_found" as const };
  });

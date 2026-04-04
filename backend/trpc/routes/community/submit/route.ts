import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { communityStore } from "../store";
import logger from "../../../../lib/logger";

export default publicProcedure
  .input(
    z.object({
      phase: z.enum(["menstrual", "follicular", "ovulation", "luteal"]),
      content: z.string().min(10).max(280),
      category: z.enum(["nutrition", "exercise", "selfcare", "mindfulness", "sleep"]),
      userId: z.string(),
    })
  )
  .mutation(({ input }) => {
    const { phase, content, category, userId } = input;

    const todayCount = communityStore.getUserTipsCountToday(userId);
    if (todayCount >= 3) {
      logger.log("[Community API] Rate limit exceeded for user:", userId, "today count:", todayCount);
      return { success: false as const, error: "rate_limit_exceeded" as const };
    }

    if (content.length < 10 || content.length > 280) {
      return { success: false as const, error: "invalid_length" as const };
    }

    try {
      const tip = communityStore.addTip(phase, content, category, userId);
      logger.log("[Community API] Submitted tip:", tip.id, "for phase:", phase);

      return { success: true as const, tip };
    } catch (err) {
      logger.log("[Community API] Error submitting tip:", err);
      return { success: false as const, error: "submission_error" as const };
    }
  });

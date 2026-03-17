import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { partnerStore } from "@/backend/trpc/routes/partner/store";
import logger from "@/lib/logger";

export default publicProcedure
  .input(
    z.object({
      userId: z.string(),
      phase: z.string(),
      phaseDay: z.number(),
      totalCycleDays: z.number(),
      mood: z.number().nullable().optional(),
      energy: z.number().nullable().optional(),
    })
  )
  .mutation(({ input }) => {
    const { userId, phase, phaseDay, totalCycleDays, mood, energy } = input;

    partnerStore.updateSharedData(userId, {
      phase,
      phaseDay,
      totalCycleDays,
      mood: mood ?? null,
      energy: energy ?? null,
    });

    logger.log("[Partner API] Updated shared data for user:", userId);
    return { success: true };
  });

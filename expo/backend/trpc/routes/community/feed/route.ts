import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { communityStore } from "@/backend/trpc/routes/community/store";

export default publicProcedure
  .input(
    z.object({
      phase: z.enum(["menstrual", "follicular", "ovulation", "luteal"]),
      limit: z.number().min(1).max(50).optional().default(10),
    })
  )
  .query(({ input }) => {
    const { phase, limit } = input;

    const tips = communityStore.getTipsByPhase(phase, limit);

    return {
      phase,
      tips,
      totalCount: tips.length,
    };
  });

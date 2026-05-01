import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { communityStore } from "@/backend/trpc/routes/community/store";
import { ensureCommunityHydrated } from "@/backend/trpc/routes/community/store";

export default publicProcedure
  .input(
    z.object({
      tipId: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    await ensureCommunityHydrated();
    const { tipId } = input;

    const tip = communityStore.reportTip(tipId);

    if (!tip) {
      return { success: false as const, error: "tip_not_found" as const };
    }

    return {
      success: true as const,
      tip,
      autoHidden: tip.reportCount >= 3,
    };
  });

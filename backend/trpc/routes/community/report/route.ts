import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { communityStore } from "../store";

export default publicProcedure
  .input(
    z.object({
      tipId: z.string(),
    })
  )
  .mutation(({ input }) => {
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

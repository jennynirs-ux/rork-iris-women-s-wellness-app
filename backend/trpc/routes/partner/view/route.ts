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
  .query(({ input }) => {
    const { userId } = input;
    const partnerData = partnerStore.getPartnerData(userId);
    logger.log("[Partner API] Retrieved partner data for user:", userId);
    return partnerData;
  });

import { publicProcedure } from "../../../create-context";
import { z } from "zod";
import { analyticsStore } from "../store";

const trackInput = z.object({
    userId: z.string().min(1),
    event: z.string().min(1).max(100),
    properties: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
});

export default publicProcedure.input(trackInput).mutation(({ input }) => {
    try {
          analyticsStore.trackEvent({
                  userId: input.userId,
                  event: input.event as any,
                  timestamp: new Date().toISOString(),
                  properties: input.properties as Record<string, string | number | boolean> | undefined,
          });
          return { success: true };
    } catch {
          return { success: false, error: "Failed to track event" };
    }
});

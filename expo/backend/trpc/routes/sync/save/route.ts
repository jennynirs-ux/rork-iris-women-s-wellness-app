import { publicProcedure } from "../../../create-context";
import { z } from "zod";
import { syncStoreModule } from "../store";
import { ensureSyncHydrated } from "@/backend/trpc/routes/sync/store";

const saveProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string().min(1),
      userProfile: z.any(),
      checkIns: z.array(z.any()),
      scans: z.array(z.any()),
      baseline: z.any().nullable(),
      phaseBaselines: z.any().nullable(),
      cycleHistory: z.array(z.any()),
      language: z.string(),
      themeMode: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    await ensureSyncHydrated();
    const { userId, ...data } = input;
    const result = syncStoreModule.save(userId, data as any);
    return {
      success: true,
      version: result.version,
      lastSyncedAt: result.lastSyncedAt,
    };
  });

export default saveProcedure;

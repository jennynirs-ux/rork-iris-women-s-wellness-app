import { publicProcedure } from "../../../create-context";
import { z } from "zod";
import { syncStoreModule } from "../store";
import { ensureSyncHydrated } from "@/backend/trpc/routes/sync/store";

const loadProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string().min(1),
    })
  )
  .query(async ({ input }) => {
    await ensureSyncHydrated();
    const data = syncStoreModule.load(input.userId);
    if (!data) {
      return { found: false as const, data: null };
    }
    return {
      found: true as const,
      data: {
        userProfile: data.userProfile,
        checkIns: data.checkIns,
        scans: data.scans,
        baseline: data.baseline,
        phaseBaselines: data.phaseBaselines,
        cycleHistory: data.cycleHistory,
        language: data.language,
        themeMode: data.themeMode,
        version: data.version,
        lastSyncedAt: data.lastSyncedAt,
      },
    };
  });

export default loadProcedure;

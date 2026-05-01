import { adminProcedure } from "../../../create-context";
import { analyticsStore, ensureAnalyticsHydrated } from "../store";

export default adminProcedure.query(async () => {
  await ensureAnalyticsHydrated();
  return analyticsStore.getAggregatedStats();
});

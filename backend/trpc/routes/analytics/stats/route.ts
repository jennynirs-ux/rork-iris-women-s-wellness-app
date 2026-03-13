import { publicProcedure } from "../../../create-context";
import { analyticsStore } from "../store";

export default publicProcedure.query(() => {
  return analyticsStore.getAggregatedStats();
});

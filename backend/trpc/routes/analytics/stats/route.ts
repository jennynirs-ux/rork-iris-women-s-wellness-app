import { adminProcedure } from "../../../create-context";
import { analyticsStore } from "../store";

export default adminProcedure.query(() => {
    return analyticsStore.getAggregatedStats();
});

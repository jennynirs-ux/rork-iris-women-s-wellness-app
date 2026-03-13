import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import referralRegister from "./routes/referral/register/route";
import referralValidate from "./routes/referral/validate/route";
import referralApply from "./routes/referral/apply/route";
import referralTrackMilestone from "./routes/referral/track-milestone/route";
import referralStats from "./routes/referral/stats/route";
import analyticsTrack from "./routes/analytics/track/route";
import analyticsStats from "./routes/analytics/stats/route";
import syncSave from "./routes/sync/save/route";
import syncLoad from "./routes/sync/load/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  referral: createTRPCRouter({
    register: referralRegister,
    validate: referralValidate,
    apply: referralApply,
    trackMilestone: referralTrackMilestone,
    stats: referralStats,
  }),
  analytics: createTRPCRouter({
    track: analyticsTrack,
    stats: analyticsStats,
  }),
  sync: createTRPCRouter({
    save: syncSave,
    load: syncLoad,
  }),
});

export type AppRouter = typeof appRouter;

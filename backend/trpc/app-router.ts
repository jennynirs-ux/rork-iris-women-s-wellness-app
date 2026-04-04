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
import adminLogin from "./routes/admin/login/route";
import adminVerify from "./routes/admin/verify/route";
import partnerGenerate from "./routes/partner/generate/route";
import partnerLink from "./routes/partner/link/route";
import partnerUnlink from "./routes/partner/unlink/route";
import partnerUpdate from "./routes/partner/update/route";
import partnerView from "./routes/partner/view/route";
import communitySubmit from "./routes/community/submit/route";
import communityFeed from "./routes/community/feed/route";
import communityLike from "./routes/community/like/route";
import communityReport from "./routes/community/report/route";

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
  admin: createTRPCRouter({
    login: adminLogin,
    verify: adminVerify,
  }),
  partner: createTRPCRouter({
    generate: partnerGenerate,
    link: partnerLink,
    unlink: partnerUnlink,
    update: partnerUpdate,
    view: partnerView,
  }),
  community: createTRPCRouter({
    submit: communitySubmit,
    feed: communityFeed,
    like: communityLike,
    report: communityReport,
  }),
});

export type AppRouter = typeof appRouter;

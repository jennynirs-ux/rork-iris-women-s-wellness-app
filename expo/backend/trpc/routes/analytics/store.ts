import logger from "@/lib/logger";
import { loadAsync, save } from "../persistence";

export type EventName =
  | 'app_opened'
  | 'onboarding_started'
  | 'onboarding_completed'
  | 'first_checkin'
  | 'first_scan'
  | 'checkin_submitted'
  | 'scan_completed'
  | 'period_logged'
  | 'subscription_started'
  | 'subscription_cancelled'
  | 'referral_shared'
  | 'referral_applied'
  | 'paywall_viewed'
  | 'paywall_converted'
  | 'life_stage_suggestion_shown'
  | 'life_stage_accepted'
  | 'life_stage_dismissed'
  | 'health_connected'
  | 'profile_updated'
  | 'language_changed'
  | 'referral_code_generated'
  | 'program_started'
  | 'program_completed'
  | 'insight_viewed';

export interface TrackingEvent {
  userId: string;
  event: EventName;
  timestamp: string;
  properties?: Record<string, string | number | boolean>;
}

export interface ScanMetricEntry {
  timestamp: string;
  stressScore: number;
  energyScore: number;
  recoveryScore: number;
  hydrationLevel: number;
  fatigueLevel: number;
  inflammation: number;
  scleraYellowness: number;
  underEyeDarkness: number;
  eyeOpenness: number;
  tearFilmQuality: number;
}

export interface CheckInEntry {
  timestamp: string;
  energy: number;
  sleep: number;
  stressLevel: number;
  mood: number;
  symptoms: string[];
  cyclePhase: string;
}

export interface UserSnapshot {
  userId: string;
  firstSeen: string;
  lastSeen: string;
  onboardingCompleted: boolean;
  onboardingCompletedAt: string | null;
  firstCheckinAt: string | null;
  firstScanAt: string | null;
  totalCheckins: number;
  totalScans: number;
  isPremium: boolean;
  premiumStartedAt: string | null;
  premiumCancelledAt: string | null;
  lifeStage: string;
  referralApplied: boolean;
  referralCode: string | null;
  healthConnected: boolean;
  platform: string;
  paywallViews: number;
  language: string;
  scanMetrics: ScanMetricEntry[];
  checkInEntries: CheckInEntry[];
}

// In-memory state. Hydrated asynchronously on module load via the
// `hydrationPromise` below. All routes await `ensureHydrated()` before
// reading. Writes go to in-memory + debounced write-through to Supabase.
let events: TrackingEvent[] = [];
const userSnapshots = new Map<string, UserSnapshot>();

const hydrationPromise: Promise<void> = (async () => {
  try {
    const [persistedEvents, persistedSnapshots] = await Promise.all([
      loadAsync<TrackingEvent[]>('analytics-events.json'),
      loadAsync<[string, UserSnapshot][]>('analytics-snapshots.json'),
    ]);
    if (persistedEvents) events = persistedEvents;
    if (persistedSnapshots) {
      for (const [userId, snap] of persistedSnapshots) {
        userSnapshots.set(userId, snap);
      }
    }
    logger.log(
      `[Analytics] Hydrated: ${events.length} events, ${userSnapshots.size} snapshots`,
    );
  } catch (err) {
    logger.error('[Analytics] Hydration failed:', err);
  }
})();

export async function ensureAnalyticsHydrated(): Promise<void> {
  await hydrationPromise;
}

function getOrCreateSnapshot(userId: string): UserSnapshot {
  let snap = userSnapshots.get(userId);
  if (!snap) {
    const now = new Date().toISOString();
    snap = {
      userId,
      firstSeen: now,
      lastSeen: now,
      onboardingCompleted: false,
      onboardingCompletedAt: null,
      firstCheckinAt: null,
      firstScanAt: null,
      totalCheckins: 0,
      totalScans: 0,
      isPremium: false,
      premiumStartedAt: null,
      premiumCancelledAt: null,
      lifeStage: 'regular',
      referralApplied: false,
      referralCode: null,
      healthConnected: false,
      platform: 'unknown',
      paywallViews: 0,
      language: 'en',
      scanMetrics: [],
      checkInEntries: [],
    };
    userSnapshots.set(userId, snap);
  }
  return snap;
}

function trackEvent(event: TrackingEvent): void {
  events.push(event);
  const snap = getOrCreateSnapshot(event.userId);
  snap.lastSeen = event.timestamp;

  if (event.properties?.platform) {
    snap.platform = String(event.properties.platform);
  }

  switch (event.event) {
    case 'onboarding_completed':
      snap.onboardingCompleted = true;
      snap.onboardingCompletedAt = event.timestamp;
      break;
    case 'first_checkin':
      if (!snap.firstCheckinAt) snap.firstCheckinAt = event.timestamp;
      snap.totalCheckins++;
      break;
    case 'checkin_submitted':
      snap.totalCheckins++;
      if (event.properties) {
        const p = event.properties;
        snap.checkInEntries.push({
          timestamp: event.timestamp,
          energy: Number(p.energy) || 5,
          sleep: Number(p.sleep) || 5,
          stressLevel: Number(p.stressLevel) || 5,
          mood: Number(p.mood) || 5,
          symptoms: typeof p.symptoms === 'string' ? p.symptoms.split(',').filter(Boolean) : [],
          cyclePhase: String(p.cyclePhase || 'unknown'),
        });
      }
      break;
    case 'first_scan':
      if (!snap.firstScanAt) snap.firstScanAt = event.timestamp;
      snap.totalScans++;
      break;
    case 'scan_completed':
      snap.totalScans++;
      if (event.properties) {
        const p = event.properties;
        if (typeof p.stressScore === 'number') {
          snap.scanMetrics.push({
            timestamp: event.timestamp,
            stressScore: Number(p.stressScore) || 0,
            energyScore: Number(p.energyScore) || 0,
            recoveryScore: Number(p.recoveryScore) || 0,
            hydrationLevel: Number(p.hydrationLevel) || 0,
            fatigueLevel: Number(p.fatigueLevel) || 0,
            inflammation: Number(p.inflammation) || 0,
            scleraYellowness: Number(p.scleraYellowness) || 0,
            underEyeDarkness: Number(p.underEyeDarkness) || 0,
            eyeOpenness: Number(p.eyeOpenness) || 0,
            tearFilmQuality: Number(p.tearFilmQuality) || 0,
          });
        }
      }
      break;
    case 'subscription_started':
      snap.isPremium = true;
      snap.premiumStartedAt = event.timestamp;
      break;
    case 'subscription_cancelled':
      snap.isPremium = false;
      snap.premiumCancelledAt = event.timestamp;
      break;
    case 'referral_applied':
      snap.referralApplied = true;
      break;
    case 'referral_code_generated':
      if (event.properties?.code) {
        snap.referralCode = String(event.properties.code);
      }
      break;
    case 'paywall_viewed':
      snap.paywallViews++;
      break;
    case 'language_changed':
      if (event.properties?.language) {
        snap.language = String(event.properties.language);
      }
      break;
    case 'health_connected':
      snap.healthConnected = true;
      break;
    case 'life_stage_accepted':
      if (event.properties?.lifeStage) {
        snap.lifeStage = String(event.properties.lifeStage);
      }
      break;
  }

  logger.log(`[Analytics] Event: ${event.event} | User: ${event.userId} | Props:`, event.properties || {});

  // Debounced save after each event
  persistAnalyticsData();
}

function persistAnalyticsData(): void {
  save('analytics-events.json', events);
  save('analytics-snapshots.json', Array.from(userSnapshots.entries()));
}

export interface FunnelStep {
  step: string;
  count: number;
  percentage: number;
  dropoff: number;
}

export interface RevenueStats {
  totalPremium: number;
  totalFree: number;
  conversionRate: number;
  paywallViewToConversion: number;
  totalPaywallViews: number;
  churned: number;
  churnRate: number;
  estimatedMRR: number;
  estimatedARR: number;
  avgRevenuePerUser: number;
}

export interface ReferralStats {
  totalCodesGenerated: number;
  totalReferralsApplied: number;
  referralConversionRate: number;
  usersWithReferral: number;
}

export interface PlatformBreakdown {
  platform: string;
  count: number;
  percentage: number;
}

export interface LifeStageBreakdown {
  stage: string;
  count: number;
  percentage: number;
}

export interface EngagementStats {
  avgCheckinsPerUser: number;
  avgScansPerUser: number;
  usersWithMultipleCheckins: number;
  usersWithMultipleScans: number;
  powerUsers: number;
  powerUserRate: number;
}

export interface AggregatedStats {
  totalUsers: number;
  activeUsers24h: number;
  activeUsers7d: number;
  activeUsers30d: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  onboardedUsers: number;
  onboardingRate: number;
  usersWithCheckin: number;
  usersWithScan: number;
  premiumUsers: number;
  conversionRate: number;
  totalEvents: number;
  funnel: FunnelStep[];
  eventCounts: Record<string, number>;
  dailyActiveUsers: { date: string; count: number }[];
  dailyNewUsers: { date: string; count: number }[];
  dailyEvents: { date: string; count: number }[];
  recentEvents: TrackingEvent[];
  userList: UserSnapshot[];
  revenue: RevenueStats;
  referrals: ReferralStats;
  platforms: PlatformBreakdown[];
  lifeStages: LifeStageBreakdown[];
  engagement: EngagementStats;
  topEvents: { event: string; count: number; percentage: number }[];
  healthConnectedUsers: number;
  healthConnectionRate: number;
  wellnessAggregates: WellnessAggregates;
}

export interface WellnessScoreDistribution {
  low: number;
  mid: number;
  high: number;
}

export interface DailyWellnessTrend {
  date: string;
  avgEnergy: number;
  avgFatigue: number;
  avgHydration: number;
  avgStress: number;
  avgRecovery: number;
  avgInflammation: number;
  scanCount: number;
  checkInCount: number;
}

export interface PhaseAnalyticsEntry {
  phase: string;
  avgEnergy: number;
  avgFatigue: number;
  avgStress: number;
  userCount: number;
}

export interface SymptomEntry {
  symptom: string;
  count: number;
  percentage: number;
}

export interface WellnessAggregates {
  avgScores: {
    energy: number;
    fatigue: number;
    hydration: number;
    inflammation: number;
    recovery: number;
    stress: number;
  };
  scoreDistributions: {
    energy: WellnessScoreDistribution;
    fatigue: WellnessScoreDistribution;
    hydration: WellnessScoreDistribution;
    inflammation: WellnessScoreDistribution;
    recovery: WellnessScoreDistribution;
    stress: WellnessScoreDistribution;
  };
  avgEyeMetrics: {
    scleraYellowness: number;
    underEyeDarkness: number;
    eyeOpenness: number;
    tearFilmQuality: number;
    pupilDarkRatio: number;
    scleraRedness: number;
    eyeBrightness: number;
    pupilSymmetry: number;
    clarity: number;
  };
  avgCheckIn: {
    energy: number;
    sleep: number;
    stressLevel: number;
    mood: number;
  };
  checkInDistributions: {
    energy: WellnessScoreDistribution;
    sleep: WellnessScoreDistribution;
    stress: WellnessScoreDistribution;
  };
  dailyWellnessTrends: DailyWellnessTrend[];
  phaseAnalytics: PhaseAnalyticsEntry[];
  topSymptoms: SymptomEntry[];
  totalScans: number;
  totalCheckIns: number;
  usersWithScans: number;
  usersWithCheckIns: number;
  avgScansPerUser: number;
  avgCheckInsPerUser: number;
}

function getAggregatedStats(): AggregatedStats {
  const now = Date.now();
  const h24 = now - 24 * 60 * 60 * 1000;
  const d7 = now - 7 * 24 * 60 * 60 * 1000;
  const d30 = now - 30 * 24 * 60 * 60 * 1000;
  const todayStr = new Date().toISOString().split('T')[0];

  const allUsers = Array.from(userSnapshots.values());
  const totalUsers = allUsers.length;

  const activeUsers24h = allUsers.filter(u => new Date(u.lastSeen).getTime() >= h24).length;
  const activeUsers7d = allUsers.filter(u => new Date(u.lastSeen).getTime() >= d7).length;
  const activeUsers30d = allUsers.filter(u => new Date(u.lastSeen).getTime() >= d30).length;
  const newUsersToday = allUsers.filter(u => u.firstSeen.split('T')[0] === todayStr).length;
  const newUsersThisWeek = allUsers.filter(u => new Date(u.firstSeen).getTime() >= d7).length;

  const onboardedUsers = allUsers.filter(u => u.onboardingCompleted).length;
  const usersWithCheckin = allUsers.filter(u => u.firstCheckinAt !== null).length;
  const usersWithScan = allUsers.filter(u => u.firstScanAt !== null).length;
  const premiumUsers = allUsers.filter(u => u.isPremium).length;
  const healthConnectedUsers = allUsers.filter(u => u.healthConnected).length;

  const onboardingRate = totalUsers > 0 ? Math.round((onboardedUsers / totalUsers) * 100) : 0;
  const conversionRate = totalUsers > 0 ? Math.round((premiumUsers / totalUsers) * 100) : 0;
  const healthConnectionRate = totalUsers > 0 ? Math.round((healthConnectedUsers / totalUsers) * 100) : 0;

  const funnelSteps = [
    { step: 'App Opened', count: totalUsers, percentage: 100 },
    { step: 'Onboarding Done', count: onboardedUsers, percentage: totalUsers > 0 ? Math.round((onboardedUsers / totalUsers) * 100) : 0 },
    { step: 'First Check-in', count: usersWithCheckin, percentage: totalUsers > 0 ? Math.round((usersWithCheckin / totalUsers) * 100) : 0 },
    { step: 'First Scan', count: usersWithScan, percentage: totalUsers > 0 ? Math.round((usersWithScan / totalUsers) * 100) : 0 },
    { step: 'Active (7d)', count: activeUsers7d, percentage: totalUsers > 0 ? Math.round((activeUsers7d / totalUsers) * 100) : 0 },
    { step: 'Premium', count: premiumUsers, percentage: totalUsers > 0 ? Math.round((premiumUsers / totalUsers) * 100) : 0 },
  ];

  const funnel: FunnelStep[] = funnelSteps.map((step, i) => ({
    ...step,
    dropoff: i > 0 ? funnelSteps[i - 1].count - step.count : 0,
  }));

  const eventCounts: Record<string, number> = {};
  events.forEach(e => {
    eventCounts[e.event] = (eventCounts[e.event] || 0) + 1;
  });

  const totalEventsCount = events.length;
  const topEvents = Object.entries(eventCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15)
    .map(([event, count]) => ({
      event,
      count,
      percentage: totalEventsCount > 0 ? Math.round((count / totalEventsCount) * 100) : 0,
    }));

  const dailyMap = new Map<string, Set<string>>();
  const dailyNewMap = new Map<string, number>();
  const dailyEventMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    dailyMap.set(d, new Set());
    dailyNewMap.set(d, 0);
    dailyEventMap.set(d, 0);
  }
  events.forEach(e => {
    const d = e.timestamp.split('T')[0];
    if (dailyMap.has(d)) {
      dailyMap.get(d)!.add(e.userId);
      dailyEventMap.set(d, (dailyEventMap.get(d) || 0) + 1);
    }
  });
  allUsers.forEach(u => {
    const d = u.firstSeen.split('T')[0];
    if (dailyNewMap.has(d)) {
      dailyNewMap.set(d, (dailyNewMap.get(d) || 0) + 1);
    }
  });

  const dailyActiveUsers = Array.from(dailyMap.entries()).map(([date, users]) => ({
    date,
    count: users.size,
  }));
  const dailyNewUsers = Array.from(dailyNewMap.entries()).map(([date, count]) => ({
    date,
    count,
  }));
  const dailyEvents = Array.from(dailyEventMap.entries()).map(([date, count]) => ({
    date,
    count,
  }));

  const totalPaywallViews = allUsers.reduce((sum, u) => sum + u.paywallViews, 0);
  const churned = allUsers.filter(u => u.premiumCancelledAt !== null).length;
  const pricePerMonth = 9.99;
  const revenue: RevenueStats = {
    totalPremium: premiumUsers,
    totalFree: totalUsers - premiumUsers,
    conversionRate,
    paywallViewToConversion: totalPaywallViews > 0 ? Math.round((premiumUsers / totalPaywallViews) * 100) : 0,
    totalPaywallViews,
    churned,
    churnRate: totalUsers > 0 ? Math.round((churned / totalUsers) * 100) : 0,
    estimatedMRR: premiumUsers * pricePerMonth,
    estimatedARR: premiumUsers * pricePerMonth * 12,
    avgRevenuePerUser: totalUsers > 0 ? Math.round((premiumUsers * pricePerMonth / totalUsers) * 100) / 100 : 0,
  };

  const usersWithReferralCode = allUsers.filter(u => u.referralCode !== null).length;
  const usersWhoAppliedReferral = allUsers.filter(u => u.referralApplied).length;
  const referrals: ReferralStats = {
    totalCodesGenerated: usersWithReferralCode,
    totalReferralsApplied: usersWhoAppliedReferral,
    referralConversionRate: usersWithReferralCode > 0 ? Math.round((usersWhoAppliedReferral / usersWithReferralCode) * 100) : 0,
    usersWithReferral: usersWhoAppliedReferral,
  };

  const platformMap: Record<string, number> = {};
  allUsers.forEach(u => {
    platformMap[u.platform] = (platformMap[u.platform] || 0) + 1;
  });
  const platforms: PlatformBreakdown[] = Object.entries(platformMap)
    .sort(([, a], [, b]) => b - a)
    .map(([platform, count]) => ({
      platform,
      count,
      percentage: totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0,
    }));

  const stageMap: Record<string, number> = {};
  allUsers.forEach(u => {
    const stage = u.lifeStage || 'regular';
    stageMap[stage] = (stageMap[stage] || 0) + 1;
  });
  const lifeStages: LifeStageBreakdown[] = Object.entries(stageMap)
    .sort(([, a], [, b]) => b - a)
    .map(([stage, count]) => ({
      stage,
      count,
      percentage: totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0,
    }));

  const usersWithMultipleCheckins = allUsers.filter(u => u.totalCheckins >= 3).length;
  const usersWithMultipleScans = allUsers.filter(u => u.totalScans >= 2).length;
  const powerUsers = allUsers.filter(u => u.totalCheckins >= 7 && u.totalScans >= 3).length;
  const totalCheckins = allUsers.reduce((sum, u) => sum + u.totalCheckins, 0);
  const totalScans = allUsers.reduce((sum, u) => sum + u.totalScans, 0);

  const engagement: EngagementStats = {
    avgCheckinsPerUser: totalUsers > 0 ? Math.round((totalCheckins / totalUsers) * 10) / 10 : 0,
    avgScansPerUser: totalUsers > 0 ? Math.round((totalScans / totalUsers) * 10) / 10 : 0,
    usersWithMultipleCheckins,
    usersWithMultipleScans,
    powerUsers,
    powerUserRate: totalUsers > 0 ? Math.round((powerUsers / totalUsers) * 100) : 0,
  };

  const recentEvents = events.slice(-50).reverse();

  const allScanMetrics = allUsers.flatMap(u => u.scanMetrics);
  const totalScansWithMetrics = allScanMetrics.length;

  const avgScan = (key: keyof ScanMetricEntry) => {
    if (totalScansWithMetrics === 0) return 0;
    const sum = allScanMetrics.reduce((s, m) => s + (Number(m[key]) || 0), 0);
    return Math.round((sum / totalScansWithMetrics) * 100) / 100;
  };

  const allCheckInEntries = allUsers.flatMap(u => u.checkInEntries);
  const totalCheckInsAll = allCheckInEntries.length;
  const usersWithCheckIns = allUsers.filter(u => u.checkInEntries.length > 0).length;
  const usersWithScansCount = allUsers.filter(u => u.scanMetrics.length > 0).length;

  const avgCI = (key: keyof CheckInEntry) => {
    if (totalCheckInsAll === 0) return 0;
    const sum = allCheckInEntries.reduce((s, c) => s + (Number(c[key]) || 0), 0);
    return Math.round((sum / totalCheckInsAll) * 100) / 100;
  };

  const buildLMH = (values: number[]): WellnessScoreDistribution => {
    let low = 0, mid = 0, high = 0;
    values.forEach(v => {
      if (v >= 1 && v <= 3) low++;
      else if (v >= 4 && v <= 6) mid++;
      else if (v >= 7 && v <= 10) high++;
    });
    return { low, mid, high };
  };

  const dailyWellnessMap = new Map<string, { scans: ScanMetricEntry[]; checkIns: CheckInEntry[] }>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    dailyWellnessMap.set(d, { scans: [], checkIns: [] });
  }
  allScanMetrics.forEach(m => {
    const d = m.timestamp.split('T')[0];
    if (dailyWellnessMap.has(d)) dailyWellnessMap.get(d)!.scans.push(m);
  });
  allCheckInEntries.forEach(c => {
    const d = c.timestamp.split('T')[0];
    if (dailyWellnessMap.has(d)) dailyWellnessMap.get(d)!.checkIns.push(c);
  });

  const dailyWellnessTrends: DailyWellnessTrend[] = Array.from(dailyWellnessMap.entries()).map(([date, data]) => {
    const sn = data.scans.length;
    const cn = data.checkIns.length;
    const avgS = (key: keyof ScanMetricEntry) => sn > 0 ? Math.round(data.scans.reduce((s, m) => s + (Number(m[key]) || 0), 0) / sn * 10) / 10 : 0;
    return {
      date,
      avgEnergy: avgS('energyScore'),
      avgFatigue: avgS('fatigueLevel'),
      avgHydration: avgS('hydrationLevel'),
      avgStress: avgS('stressScore'),
      avgRecovery: avgS('recoveryScore'),
      avgInflammation: avgS('inflammation'),
      scanCount: sn,
      checkInCount: cn,
    };
  });

  const phaseMap = new Map<string, { energy: number[]; fatigue: number[]; stress: number[]; users: Set<string> }>();
  ['menstrual', 'follicular', 'ovulation', 'luteal'].forEach(p => phaseMap.set(p, { energy: [], fatigue: [], stress: [], users: new Set() }));
  allUsers.forEach(u => {
    u.checkInEntries.forEach(c => {
      const phase = c.cyclePhase;
      if (phaseMap.has(phase)) {
        const entry = phaseMap.get(phase)!;
        entry.energy.push(c.energy);
        entry.stress.push(c.stressLevel);
        entry.users.add(u.userId);
      }
    });
    u.scanMetrics.forEach(_m => {
    });
  });

  const phaseAnalytics: PhaseAnalyticsEntry[] = ['menstrual', 'follicular', 'ovulation', 'luteal'].map(phase => {
    const data = phaseMap.get(phase)!;
    const n = data.energy.length;
    return {
      phase,
      avgEnergy: n > 0 ? Math.round(data.energy.reduce((a, b) => a + b, 0) / n * 10) / 10 : 0,
      avgFatigue: 0,
      avgStress: n > 0 ? Math.round(data.stress.reduce((a, b) => a + b, 0) / n * 10) / 10 : 0,
      userCount: data.users.size,
    };
  });

  const symptomCounts = new Map<string, number>();
  allCheckInEntries.forEach(c => {
    c.symptoms.forEach(s => {
      symptomCounts.set(s, (symptomCounts.get(s) || 0) + 1);
    });
  });
  const topSymptoms: SymptomEntry[] = Array.from(symptomCounts.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([symptom, count]) => ({
      symptom,
      count,
      percentage: totalCheckInsAll > 0 ? Math.round((count / totalCheckInsAll) * 100) : 0,
    }));

  const wellnessAggregates: WellnessAggregates = {
    avgScores: {
      energy: avgScan('energyScore'),
      fatigue: avgScan('fatigueLevel'),
      hydration: avgScan('hydrationLevel'),
      inflammation: avgScan('inflammation'),
      recovery: avgScan('recoveryScore'),
      stress: avgScan('stressScore'),
    },
    scoreDistributions: {
      energy: buildLMH(allScanMetrics.map(m => m.energyScore)),
      fatigue: buildLMH(allScanMetrics.map(m => m.fatigueLevel)),
      hydration: buildLMH(allScanMetrics.map(m => m.hydrationLevel)),
      inflammation: buildLMH(allScanMetrics.map(m => m.inflammation)),
      recovery: buildLMH(allScanMetrics.map(m => m.recoveryScore)),
      stress: buildLMH(allScanMetrics.map(m => m.stressScore)),
    },
    avgEyeMetrics: {
      scleraYellowness: avgScan('scleraYellowness'),
      underEyeDarkness: avgScan('underEyeDarkness'),
      eyeOpenness: avgScan('eyeOpenness'),
      tearFilmQuality: avgScan('tearFilmQuality'),
      pupilDarkRatio: 0,
      scleraRedness: 0,
      eyeBrightness: 0,
      pupilSymmetry: 0,
      clarity: 0,
    },
    avgCheckIn: {
      energy: avgCI('energy'),
      sleep: avgCI('sleep'),
      stressLevel: avgCI('stressLevel'),
      mood: avgCI('mood'),
    },
    checkInDistributions: {
      energy: buildLMH(allCheckInEntries.map(c => c.energy)),
      sleep: buildLMH(allCheckInEntries.map(c => c.sleep)),
      stress: buildLMH(allCheckInEntries.map(c => c.stressLevel)),
    },
    dailyWellnessTrends,
    phaseAnalytics,
    topSymptoms,
    totalScans: totalScansWithMetrics,
    totalCheckIns: totalCheckInsAll,
    usersWithScans: usersWithScansCount,
    usersWithCheckIns,
    avgScansPerUser: totalUsers > 0 ? Math.round((totalScansWithMetrics / totalUsers) * 10) / 10 : 0,
    avgCheckInsPerUser: totalUsers > 0 ? Math.round((totalCheckInsAll / totalUsers) * 10) / 10 : 0,
  };

  return {
    totalUsers,
    activeUsers24h,
    activeUsers7d,
    activeUsers30d,
    newUsersToday,
    newUsersThisWeek,
    onboardedUsers,
    onboardingRate,
    usersWithCheckin,
    usersWithScan,
    premiumUsers,
    conversionRate,
    totalEvents: totalEventsCount,
    funnel,
    eventCounts,
    dailyActiveUsers,
    dailyNewUsers,
    dailyEvents,
    recentEvents,
    userList: allUsers,
    revenue,
    referrals,
    platforms,
    lifeStages,
    engagement,
    topEvents,
    healthConnectedUsers,
    healthConnectionRate,
    wellnessAggregates,
  };
}

function getAllUserScanData(): UserSnapshot[] {
  return Array.from(userSnapshots.values()).map(snapshot => ({
    ...snapshot,
    scanMetrics: snapshot.scanMetrics,
    checkInEntries: snapshot.checkInEntries,
  }));
}

export const analyticsStore = {
  trackEvent,
  getAggregatedStats,
  getOrCreateSnapshot,
  getAllUserScanData,
};

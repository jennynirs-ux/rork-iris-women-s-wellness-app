import { AdminDashboardData, DailyDataPoint, DateRange, PatternDetection, UserEngagement, UserDemographics, AppHealthMetrics, RetentionCohort, SymptomTrend, ScanTrend, UserJourneyStep } from '@/types/admin';
import { UserProfile, DailyCheckIn, ScanResult, CycleHistory } from '@/types';

function groupByDate(checkIns: DailyCheckIn[], scans: ScanResult[], days: number): DailyDataPoint[] {
  const data: DailyDataPoint[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const dayCheckIns = checkIns.filter(c => c.date === dateStr);
    const dayScans = scans.filter(s => s.date.split('T')[0] === dateStr);

    data.push({
      date: dateStr,
      users: dayCheckIns.length > 0 || dayScans.length > 0 ? 1 : 0,
      scans: dayScans.length,
      checkIns: dayCheckIns.length,
      revenue: 0,
      newUsers: 0,
    });
  }

  return data;
}

function countSymptoms(checkIns: DailyCheckIn[]): { symptom: string; count: number }[] {
  const counts: Record<string, number> = {};
  checkIns.forEach(ci => {
    ci.symptoms.forEach(s => {
      counts[s] = (counts[s] || 0) + 1;
    });
  });

  return Object.entries(counts)
    .map(([symptom, count]) => ({ symptom, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function computeAvgScanMetrics(scans: ScanResult[]) {
  if (scans.length === 0) {
    return { avgStress: 0, avgEnergy: 0, avgRecovery: 0, avgFatigue: 0, avgInflammation: 0, avgHydration: 0 };
  }
  const sum = scans.reduce((acc, s) => ({
    stress: acc.stress + s.stressScore,
    energy: acc.energy + s.energyScore,
    recovery: acc.recovery + s.recoveryScore,
    fatigue: acc.fatigue + s.fatigueLevel,
    inflammation: acc.inflammation + s.inflammation,
    hydration: acc.hydration + s.hydrationLevel,
  }), { stress: 0, energy: 0, recovery: 0, fatigue: 0, inflammation: 0, hydration: 0 });

  const n = scans.length;
  return {
    avgStress: Math.round((sum.stress / n) * 10) / 10,
    avgEnergy: Math.round((sum.energy / n) * 10) / 10,
    avgRecovery: Math.round((sum.recovery / n) * 10) / 10,
    avgFatigue: Math.round((sum.fatigue / n) * 10) / 10,
    avgInflammation: Math.round((sum.inflammation / n) * 10) / 10,
    avgHydration: Math.round((sum.hydration / n) * 10) / 10,
  };
}

function computeEngagement(checkIns: DailyCheckIn[], scans: ScanResult[], days: number): UserEngagement {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const allDates = new Set<string>();
  checkIns.forEach(c => allDates.add(c.date));
  scans.forEach(s => allDates.add(s.date.split('T')[0]));

  const sortedDates = Array.from(allDates).sort();
  const firstActive = sortedDates[0] || new Date().toISOString().split('T')[0];
  const lastActive = sortedDates[sortedDates.length - 1] || new Date().toISOString().split('T')[0];
  const totalActiveDays = sortedDates.length;

  const daysSinceSignup = Math.max(1, Math.floor((now - new Date(firstActive).getTime()) / dayMs));

  const last7 = now - 7 * dayMs;
  const last30 = now - 30 * dayMs;

  const daysActive7 = sortedDates.filter(d => new Date(d).getTime() >= last7).length;
  const daysActive30 = sortedDates.filter(d => new Date(d).getTime() >= last30).length;

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(now - i * dayMs).toISOString().split('T')[0];
    if (allDates.has(d)) {
      if (i === 0 || currentStreak > 0) currentStreak++;
      tempStreak++;
    } else {
      if (i === 0) currentStreak = 0;
      else if (currentStreak > 0 && !allDates.has(new Date(now - (i) * dayMs).toISOString().split('T')[0])) {
        break;
      }
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 0;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

  return {
    dailyActiveRate: Math.round((daysActive7 / 7) * 100),
    weeklyActiveRate: Math.round((daysActive30 / 30) * 100),
    avgSessionDuration: Math.round((checkIns.length * 3 + scans.length * 5) / Math.max(totalActiveDays, 1)),
    avgCheckInsPerDay: Math.round((checkIns.length / Math.max(daysSinceSignup, 1)) * 100) / 100,
    avgScansPerDay: Math.round((scans.length / Math.max(daysSinceSignup, 1)) * 100) / 100,
    streakDays: currentStreak,
    longestStreak,
    lastActiveDate: lastActive,
    firstActiveDate: firstActive,
    totalActiveDays,
    daysSinceSignup,
  };
}

function computeDemographics(userProfile: UserProfile): UserDemographics {
  let age = 0;
  if (userProfile.birthday) {
    const birth = new Date(userProfile.birthday);
    age = Math.floor((Date.now() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  }

  const ageGroup = age < 18 ? 'Under 18' : age < 25 ? '18-24' : age < 30 ? '25-29' : age < 35 ? '30-34' : age < 40 ? '35-39' : age < 45 ? '40-44' : age < 50 ? '45-49' : '50+';

  const lifeStageLabels: Record<string, string> = {
    regular: 'Regular Cycling',
    pregnancy: 'Pregnancy',
    postpartum: 'Postpartum',
    perimenopause: 'Perimenopause',
    menopause: 'Menopause',
  };

  const regularityLabels: Record<string, string> = {
    regular: 'Regular',
    irregular: 'Irregular',
    not_sure: 'Not Sure',
  };

  const birthControlLabels: Record<string, string> = {
    none: 'None',
    pill: 'Pill',
    iud_hormonal: 'IUD (Hormonal)',
    iud_copper: 'IUD (Copper)',
    implant: 'Implant',
    ring: 'Ring',
    patch: 'Patch',
    injection: 'Injection',
    other: 'Other',
  };

  const goalLabels: Record<string, string> = {
    energy: 'Energy',
    weight_loss: 'Weight Loss',
    strength: 'Strength',
    hormonal_balance: 'Hormonal Balance',
    postpartum: 'Postpartum',
    pregnancy: 'Pregnancy',
    perimenopause: 'Perimenopause',
    skin_health: 'Skin Health',
    stress_reduction: 'Stress Reduction',
  };

  const focusLabels: Record<string, string> = {
    energy_vitality: 'Energy & Vitality',
    stress_recovery: 'Stress & Recovery',
    fitness_strength: 'Fitness & Strength',
    hormonal_balance: 'Hormonal Balance',
    skin_selfcare: 'Skin & Self-Care',
    body_awareness: 'Body Awareness',
  };

  return {
    ageGroups: [{ group: ageGroup, count: 1, percentage: 100 }],
    lifeStages: [{ stage: lifeStageLabels[userProfile.lifeStage] || 'Regular Cycling', count: 1, percentage: 100 }],
    cycleRegularity: [{ type: regularityLabels[userProfile.cycleRegularity] || 'Regular', count: 1, percentage: 100 }],
    birthControlUsage: [{ type: birthControlLabels[userProfile.birthControl] || 'None', count: 1, percentage: 100 }],
    goalDistribution: userProfile.goals.map(g => ({
      goal: goalLabels[g] || g,
      count: 1,
      percentage: Math.round(100 / Math.max(userProfile.goals.length, 1)),
    })),
    focusDistribution: userProfile.mainFocus.map(f => ({
      focus: focusLabels[f] || f,
      count: 1,
      percentage: Math.round(100 / Math.max(userProfile.mainFocus.length, 1)),
    })),
  };
}

function computeAppHealth(
  userProfile: UserProfile,
  checkIns: DailyCheckIn[],
  scans: ScanResult[],
  cycleHistory: CycleHistory[],
): AppHealthMetrics {
  const profileFields = [
    { field: 'Name', done: !!userProfile.name },
    { field: 'Birthday', done: !!userProfile.birthday },
    { field: 'Weight', done: userProfile.weight > 0 },
    { field: 'Height', done: userProfile.height > 0 },
    { field: 'Goals', done: userProfile.goals.length > 0 },
    { field: 'Main Focus', done: userProfile.mainFocus.length > 0 },
    { field: 'Cycle Length', done: userProfile.cycleLength > 0 },
    { field: 'Last Period Date', done: !!userProfile.lastPeriodDate },
    { field: 'Cycle Regularity', done: !!userProfile.cycleRegularity },
    { field: 'Birth Control', done: !!userProfile.birthControl },
  ];

  const dataCompleteness = profileFields.map(f => ({
    field: f.field,
    completionRate: f.done ? 100 : 0,
  }));

  const featureAdoption = [
    {
      feature: 'Daily Check-in',
      adoptionRate: checkIns.length > 0 ? 100 : 0,
      usageCount: checkIns.length,
    },
    {
      feature: 'Eye Scan',
      adoptionRate: scans.length > 0 ? 100 : 0,
      usageCount: scans.length,
    },
    {
      feature: 'Cycle Tracking',
      adoptionRate: cycleHistory.length > 0 ? 100 : 0,
      usageCount: cycleHistory.length,
    },
    {
      feature: 'Symptom Logging',
      adoptionRate: checkIns.some(c => c.symptoms.length > 0) ? 100 : 0,
      usageCount: checkIns.filter(c => c.symptoms.length > 0).length,
    },
    {
      feature: 'Bleeding Tracker',
      adoptionRate: checkIns.some(c => c.bleedingLevel && c.bleedingLevel !== 'none') ? 100 : 0,
      usageCount: checkIns.filter(c => c.bleedingLevel && c.bleedingLevel !== 'none').length,
    },
    {
      feature: 'Notes',
      adoptionRate: checkIns.some(c => c.notes && c.notes.trim().length > 0) ? 100 : 0,
      usageCount: checkIns.filter(c => c.notes && c.notes.trim().length > 0).length,
    },
    {
      feature: 'Stress Tracking',
      adoptionRate: checkIns.some(c => c.stressLevel !== undefined) ? 100 : 0,
      usageCount: checkIns.filter(c => c.stressLevel !== undefined).length,
    },
    {
      feature: 'Caffeine Tracking',
      adoptionRate: checkIns.some(c => c.hadCaffeine !== undefined) ? 100 : 0,
      usageCount: checkIns.filter(c => c.hadCaffeine === true).length,
    },
    {
      feature: 'Cervical Mucus',
      adoptionRate: checkIns.some(c => c.cervicalMucus !== undefined) ? 100 : 0,
      usageCount: checkIns.filter(c => c.cervicalMucus !== undefined).length,
    },
    {
      feature: 'Onboarding',
      adoptionRate: userProfile.hasCompletedOnboarding ? 100 : 0,
      usageCount: userProfile.hasCompletedOnboarding ? 1 : 0,
    },
  ];

  const completedFields = profileFields.filter(f => f.done).length;
  const onboardingRate = userProfile.hasCompletedOnboarding ? 100 : Math.round((completedFields / profileFields.length) * 100);

  return {
    onboardingCompletionRate: onboardingRate,
    featureAdoption,
    dataCompleteness,
    errorRate: 0,
    avgLoadTime: 1.2,
  };
}

function computeSymptomTrends(checkIns: DailyCheckIn[]): SymptomTrend[] {
  const allSymptoms = new Set<string>();
  checkIns.forEach(c => c.symptoms.forEach(s => allSymptoms.add(s)));

  const now = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;

  return Array.from(allSymptoms).map(symptom => {
    const weeklyCount: number[] = [];
    for (let w = 3; w >= 0; w--) {
      const weekStart = now - (w + 1) * weekMs;
      const weekEnd = now - w * weekMs;
      const count = checkIns.filter(c => {
        const t = c.timestamp || new Date(c.date).getTime();
        return t >= weekStart && t < weekEnd && c.symptoms.includes(symptom);
      }).length;
      weeklyCount.push(count);
    }

    const totalCount = checkIns.filter(c => c.symptoms.includes(symptom)).length;
    const recent = weeklyCount.slice(-2);
    const earlier = weeklyCount.slice(0, 2);
    const recentAvg = recent.reduce((a, b) => a + b, 0) / Math.max(recent.length, 1);
    const earlierAvg = earlier.reduce((a, b) => a + b, 0) / Math.max(earlier.length, 1);

    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (recentAvg > earlierAvg * 1.3) trend = 'increasing';
    else if (recentAvg < earlierAvg * 0.7) trend = 'decreasing';

    return { symptom, weeklyCount, trend, totalCount };
  }).sort((a, b) => b.totalCount - a.totalCount).slice(0, 8);
}

function computeScanTrends(scans: ScanResult[]): ScanTrend[] {
  if (scans.length < 2) return [];

  const sorted = [...scans].sort((a, b) => a.timestamp - b.timestamp);
  const half = Math.floor(sorted.length / 2);
  const earlier = sorted.slice(0, half);
  const recent = sorted.slice(half);

  const metrics: { key: string; getter: (s: ScanResult) => number; goodDirection: 'lower' | 'higher' }[] = [
    { key: 'Stress', getter: s => s.stressScore, goodDirection: 'lower' },
    { key: 'Energy', getter: s => s.energyScore, goodDirection: 'higher' },
    { key: 'Recovery', getter: s => s.recoveryScore, goodDirection: 'higher' },
    { key: 'Fatigue', getter: s => s.fatigueLevel, goodDirection: 'lower' },
    { key: 'Inflammation', getter: s => s.inflammation, goodDirection: 'lower' },
    { key: 'Hydration', getter: s => s.hydrationLevel, goodDirection: 'higher' },
  ];

  return metrics.map(m => {
    const earlierAvg = earlier.reduce((sum, s) => sum + m.getter(s), 0) / Math.max(earlier.length, 1);
    const recentAvg = recent.reduce((sum, s) => sum + m.getter(s), 0) / Math.max(recent.length, 1);
    const changePercent = earlierAvg > 0 ? Math.round(((recentAvg - earlierAvg) / earlierAvg) * 100) : 0;

    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (Math.abs(changePercent) > 10) {
      if (m.goodDirection === 'lower') {
        trend = recentAvg < earlierAvg ? 'improving' : 'declining';
      } else {
        trend = recentAvg > earlierAvg ? 'improving' : 'declining';
      }
    }

    return {
      metric: m.key,
      values: sorted.slice(-14).map(s => m.getter(s)),
      dates: sorted.slice(-14).map(s => s.date.split('T')[0]),
      trend,
      currentAvg: Math.round(recentAvg * 10) / 10,
      previousAvg: Math.round(earlierAvg * 10) / 10,
      changePercent,
    };
  });
}

function computeUserJourney(
  userProfile: UserProfile,
  checkIns: DailyCheckIn[],
  scans: ScanResult[],
  cycleHistory: CycleHistory[],
): UserJourneyStep[] {
  const steps: UserJourneyStep[] = [];

  steps.push({
    step: 'App Downloaded',
    completed: true,
    completedAt: checkIns.length > 0
      ? new Date(Math.min(...checkIns.map(c => c.timestamp || new Date(c.date).getTime()))).toISOString()
      : new Date().toISOString(),
    details: 'User installed the Iris app',
  });

  steps.push({
    step: 'Onboarding Completed',
    completed: userProfile.hasCompletedOnboarding,
    completedAt: userProfile.hasCompletedOnboarding ? 'Completed' : null,
    details: userProfile.hasCompletedOnboarding
      ? `Profile set up with ${userProfile.goals.length} goals`
      : 'User has not finished onboarding',
  });

  steps.push({
    step: 'First Check-in',
    completed: checkIns.length > 0,
    completedAt: checkIns.length > 0
      ? checkIns.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))[0]?.date || null
      : null,
    details: checkIns.length > 0
      ? `First check-in recorded on ${checkIns.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))[0]?.date}`
      : 'No check-ins yet',
  });

  steps.push({
    step: 'First Eye Scan',
    completed: scans.length > 0,
    completedAt: scans.length > 0
      ? [...scans].sort((a, b) => a.timestamp - b.timestamp)[0]?.date || null
      : null,
    details: scans.length > 0
      ? `${scans.length} total scans completed`
      : 'No eye scans yet',
  });

  steps.push({
    step: 'Period Logged',
    completed: cycleHistory.length > 0,
    completedAt: cycleHistory.length > 0 ? cycleHistory[0]?.startDate || null : null,
    details: cycleHistory.length > 0
      ? `${cycleHistory.length} cycles tracked`
      : 'No cycle data logged',
  });

  const uniqueDays = new Set(checkIns.map(c => c.date));
  steps.push({
    step: '7-Day Streak',
    completed: uniqueDays.size >= 7,
    completedAt: uniqueDays.size >= 7 ? 'Achieved' : null,
    details: `${uniqueDays.size} unique days with check-ins`,
  });

  steps.push({
    step: '5+ Scans Completed',
    completed: scans.length >= 5,
    completedAt: scans.length >= 5 ? 'Achieved' : null,
    details: `${scans.length}/5 scans`,
  });

  const hasSymptoms = checkIns.some(c => c.symptoms.length > 0);
  steps.push({
    step: 'Symptom Tracking Active',
    completed: hasSymptoms,
    completedAt: hasSymptoms ? 'Active' : null,
    details: hasSymptoms
      ? `Symptoms logged in ${checkIns.filter(c => c.symptoms.length > 0).length} check-ins`
      : 'No symptoms tracked yet',
  });

  steps.push({
    step: 'Premium Subscription',
    completed: userProfile.isPremium,
    completedAt: userProfile.isPremium ? 'Active' : null,
    details: userProfile.isPremium ? 'Premium active' : 'Free tier',
  });

  return steps;
}

function computeRetentionCohorts(checkIns: DailyCheckIn[], scans: ScanResult[]): RetentionCohort[] {
  const allDates = new Set<string>();
  checkIns.forEach(c => allDates.add(c.date));
  scans.forEach(s => allDates.add(s.date.split('T')[0]));

  if (allDates.size === 0) return [];

  const sortedDates = Array.from(allDates).sort();
  const firstDate = new Date(sortedDates[0]);
  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;
  const totalDays = Math.floor((now.getTime() - firstDate.getTime()) / dayMs);

  const checkDays = [1, 7, 14, 30, 60, 90];
  const cohorts: RetentionCohort[] = [];

  const monthStart = new Date(firstDate);
  monthStart.setDate(1);

  for (let m = 0; m < Math.min(6, Math.ceil(totalDays / 30)); m++) {
    const cohortStart = new Date(monthStart);
    cohortStart.setMonth(cohortStart.getMonth() + m);
    const cohortLabel = cohortStart.toLocaleDateString('en', { month: 'short', year: 'numeric' });

    const retention: Record<string, number> = {};
    checkDays.forEach(d => {
      const checkDate = new Date(cohortStart.getTime() + d * dayMs);
      const windowStart = new Date(checkDate.getTime() - dayMs);
      const windowEnd = new Date(checkDate.getTime() + dayMs);

      const active = sortedDates.some(date => {
        const dt = new Date(date);
        return dt >= windowStart && dt <= windowEnd;
      });

      retention[`day${d}`] = active ? 100 : 0;
    });

    cohorts.push({
      cohort: cohortLabel,
      day1: retention['day1'] ?? 0,
      day7: retention['day7'] ?? 0,
      day14: retention['day14'] ?? 0,
      day30: retention['day30'] ?? 0,
      day60: retention['day60'] ?? 0,
      day90: retention['day90'] ?? 0,
    });
  }

  return cohorts;
}

export interface RealDataInput {
  userProfile: UserProfile;
  checkIns: DailyCheckIn[];
  scans: ScanResult[];
  cycleHistory: CycleHistory[];
  lifeStageSuggestion: { type: 'pregnancy' | 'perimenopause'; message: string } | null;
  dismissedSuggestionType: string | null;
}

export function getAdminDashboardData(range: DateRange, input?: RealDataInput): AdminDashboardData {
  const daysMap: Record<DateRange, number> = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    '12m': 365,
  };

  const days = daysMap[range];

  if (!input) {
    return getEmptyDashboard(days);
  }

  const { userProfile, checkIns, scans, cycleHistory } = input;

  const now = Date.now();
  const cutoff = now - days * 24 * 60 * 60 * 1000;

  const rangeCheckIns = checkIns.filter(c => {
    const t = c.timestamp || new Date(c.date).getTime();
    return t >= cutoff;
  });

  const rangeScans = scans.filter(s => {
    const t = s.timestamp || new Date(s.date).getTime();
    return t >= cutoff;
  });

  const dailyData = groupByDate(checkIns, scans, days);

  const totalCheckIns = rangeCheckIns.length;
  const totalScans = rangeScans.length;
  const activeDays = dailyData.filter(d => d.checkIns > 0 || d.scans > 0).length;

  const today = new Date().toISOString().split('T')[0];
  const todayCheckIns = checkIns.filter(c => c.date === today).length;
  const todayScans = scans.filter(s => s.date.split('T')[0] === today).length;

  const last7Days = now - 7 * 24 * 60 * 60 * 1000;
  const weekCheckIns = checkIns.filter(c => (c.timestamp || new Date(c.date).getTime()) >= last7Days).length;
  const weekScans = scans.filter(s => (s.timestamp || new Date(s.date).getTime()) >= last7Days).length;

  const avgMood = rangeCheckIns.length > 0
    ? Math.round((rangeCheckIns.reduce((sum, c) => sum + c.mood, 0) / rangeCheckIns.length) * 10) / 10
    : 0;
  const avgEnergy = rangeCheckIns.length > 0
    ? Math.round((rangeCheckIns.reduce((sum, c) => sum + c.energy, 0) / rangeCheckIns.length) * 10) / 10
    : 0;
  const avgSleep = rangeCheckIns.length > 0
    ? Math.round((rangeCheckIns.reduce((sum, c) => sum + c.sleep, 0) / rangeCheckIns.length) * 10) / 10
    : 0;

  const scanMetrics = computeAvgScanMetrics(rangeScans);

  const checkInRate = days > 0 ? Math.round((activeDays / days) * 1000) / 10 : 0;
  const avgScansPerDay = days > 0 ? Math.round((totalScans / days) * 10) / 10 : 0;
  const avgCheckInsPerDay = days > 0 ? Math.round((totalCheckIns / days) * 10) / 10 : 0;

  const avgCycleLength = cycleHistory.length > 0
    ? Math.round(cycleHistory.filter(c => c.lengthDays).reduce((sum, c) => sum + (c.lengthDays || 0), 0) / Math.max(cycleHistory.filter(c => c.lengthDays).length, 1))
    : userProfile.cycleLength;

  const lifeStageLabel = {
    regular: 'Regular',
    pregnancy: 'Pregnancy',
    postpartum: 'Postpartum',
    perimenopause: 'Perimenopause',
    menopause: 'Menopause',
  }[userProfile.lifeStage] || 'Regular';

  const regularityLabel = {
    regular: 'Regular',
    irregular: 'Irregular',
    not_sure: 'Not Sure',
  }[userProfile.cycleRegularity] || 'Regular';

  const engagement = computeEngagement(checkIns, scans, days);
  const demographics = computeDemographics(userProfile);
  const appHealth = computeAppHealth(userProfile, checkIns, scans, cycleHistory);
  const retentionCohorts = computeRetentionCohorts(checkIns, scans);
  const symptomTrends = computeSymptomTrends(rangeCheckIns);
  const scanTrends = computeScanTrends(rangeScans);
  const userJourney = computeUserJourney(userProfile, checkIns, scans, cycleHistory);

  return {
    userMetrics: {
      totalUsers: 1,
      dau: todayCheckIns > 0 || todayScans > 0 ? 1 : 0,
      wau: weekCheckIns > 0 || weekScans > 0 ? 1 : 0,
      mau: activeDays > 0 ? 1 : 0,
      retention7Day: checkInRate,
      retention30Day: checkInRate,
      conversionRate: userProfile.isPremium ? 100 : 0,
      referralUsageRate: 0,
      newUsersToday: 0,
      newUsersThisWeek: 0,
    },
    featureUsage: {
      scanCompletionRate: Math.round((totalScans / Math.max(activeDays, 1)) * 100) / 1,
      checkInCompletionRate: checkInRate,
      habitCompletionRate: 0,
      lifeStageDistribution: [
        { stage: lifeStageLabel, count: 1, percentage: 100 },
      ],
      cycleRegularityDistribution: [
        { type: regularityLabel, count: 1, percentage: 100 },
      ],
      topSymptoms: countSymptoms(rangeCheckIns),
      avgScansPerUser: avgScansPerDay,
      avgCheckInsPerUser: avgCheckInsPerDay,
    },
    revenueMetrics: {
      mrr: userProfile.isPremium ? 9.99 : 0,
      arr: userProfile.isPremium ? 119.88 : 0,
      freeTrialsActive: !userProfile.isPremium ? 1 : 0,
      churnRate: 0,
      referralDiscountsUsed: 0,
      avgRevenuePerUser: userProfile.isPremium ? 9.99 : 0,
      totalRevenue: userProfile.isPremium ? 9.99 : 0,
      mrrGrowth: 0,
      ltv: userProfile.isPremium ? 119.88 : 0,
    },
    dailyData,
    realMetrics: {
      totalCheckIns,
      totalScans,
      activeDays,
      avgMood,
      avgEnergy,
      avgSleep,
      avgCycleLength,
      cyclesTracked: cycleHistory.length,
      scanAvgStress: scanMetrics.avgStress,
      scanAvgEnergy: scanMetrics.avgEnergy,
      scanAvgRecovery: scanMetrics.avgRecovery,
      scanAvgFatigue: scanMetrics.avgFatigue,
      scanAvgInflammation: scanMetrics.avgInflammation,
      scanAvgHydration: scanMetrics.avgHydration,
      todayCheckIns,
      todayScans,
      weekCheckIns,
      weekScans,
    },
    engagement,
    demographics,
    appHealth,
    retentionCohorts,
    symptomTrends,
    scanTrends,
    userJourney,
  };
}

export function computePatternDetection(input: RealDataInput): PatternDetection {
  const { userProfile, checkIns, scans, lifeStageSuggestion, dismissedSuggestionType } = input;

  const now = Date.now();
  const fourteenDaysAgo = now - 14 * 24 * 60 * 60 * 1000;

  const recentCheckIns = checkIns.slice(-14);
  const recentScans = scans.filter(s => new Date(s.date).getTime() >= fourteenDaysAgo);

  let pregnancyScore = 0;
  let periScore = 0;
  const pregnancyIndicators: string[] = [];
  const periIndicators: string[] = [];

  if (recentCheckIns.length >= 3) {
    const pregnancySymptoms = ['Nausea', 'Breast Tenderness', 'Fatigue', 'Mood Swings', 'Bloating'];
    let pSymCount = 0;
    recentCheckIns.forEach(ci => {
      pregnancySymptoms.forEach(s => {
        if (ci.symptoms.includes(s)) pSymCount++;
      });
    });
    if (pSymCount > 0) {
      pregnancyScore += Math.min(Math.floor(pSymCount / 2), 3);
      pregnancyIndicators.push(`${pSymCount} pregnancy-related symptoms in last 14 check-ins`);
    }

    const periSymptoms = ['Hot Flashes', 'Night Sweats', 'Insomnia', 'Brain Fog', 'Mood Swings'];
    let periSymCount = 0;
    recentCheckIns.forEach(ci => {
      periSymptoms.forEach(s => {
        if (ci.symptoms.includes(s)) periSymCount++;
      });
    });
    if (periSymCount > 0) {
      periScore += Math.min(Math.floor(periSymCount / 2), 3);
      periIndicators.push(`${periSymCount} perimenopause-related symptoms in last 14 check-ins`);
    }
  }

  const lastPeriod = new Date(userProfile.lastPeriodDate);
  const daysSincePeriod = Math.floor((now - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
  const missedPeriod = daysSincePeriod > (userProfile.cycleLength || 28) + 7;
  if (missedPeriod) {
    pregnancyScore += 3;
    pregnancyIndicators.push(`Period ${daysSincePeriod - (userProfile.cycleLength || 28)} days late`);
  }

  if (recentScans.length >= 2) {
    const avgFatigue = recentScans.reduce((sum, s) => sum + s.fatigueLevel, 0) / recentScans.length;
    const avgStress = recentScans.reduce((sum, s) => sum + s.stressScore, 0) / recentScans.length;
    const avgInflammation = recentScans.reduce((sum, s) => sum + s.inflammation, 0) / recentScans.length;
    const avgRecovery = recentScans.reduce((sum, s) => sum + s.recoveryScore, 0) / recentScans.length;
    const highFatigueScans = recentScans.filter(s => s.fatigueLevel > 7).length;
    const lowEnergyScans = recentScans.filter(s => s.energyScore < 4).length;
    const highInflammationScans = recentScans.filter(s => s.inflammation > 6).length;

    if (avgFatigue > 7) { pregnancyScore += 2; pregnancyIndicators.push(`High avg fatigue (${avgFatigue.toFixed(1)})`); }
    else if (avgFatigue > 5.5) { pregnancyScore += 1; pregnancyIndicators.push(`Elevated fatigue (${avgFatigue.toFixed(1)})`); }

    if (highFatigueScans >= recentScans.length * 0.6) {
      pregnancyScore += 1;
      pregnancyIndicators.push(`${highFatigueScans}/${recentScans.length} scans show high fatigue`);
    }
    if (avgInflammation > 5) { pregnancyScore += 1; pregnancyIndicators.push(`Elevated inflammation (${avgInflammation.toFixed(1)})`); }
    if (lowEnergyScans >= recentScans.length * 0.5) {
      pregnancyScore += 1;
      pregnancyIndicators.push(`${lowEnergyScans}/${recentScans.length} scans show low energy`);
    }

    if (avgStress > 7) { periScore += 2; periIndicators.push(`High avg stress (${avgStress.toFixed(1)})`); }
    else if (avgStress > 5.5) { periScore += 1; periIndicators.push(`Elevated stress (${avgStress.toFixed(1)})`); }

    if (avgRecovery < 4) { periScore += 2; periIndicators.push(`Low avg recovery (${avgRecovery.toFixed(1)})`); }
    else if (avgRecovery < 5.5) { periScore += 1; periIndicators.push(`Below-avg recovery (${avgRecovery.toFixed(1)})`); }

    if (highInflammationScans >= recentScans.length * 0.5) {
      periScore += 1;
      periIndicators.push(`${highInflammationScans}/${recentScans.length} scans show high inflammation`);
    }

    if (avgFatigue > 6 && avgStress > 6) {
      periScore += 1;
      periIndicators.push('Combined high fatigue + stress');
    }

    if (recentScans.length >= 3) {
      const energies = recentScans.map(s => s.energyScore);
      const mean = energies.reduce((a, b) => a + b, 0) / energies.length;
      const variance = energies.reduce((sum, e) => sum + Math.pow(e - mean, 2), 0) / energies.length;
      if (Math.sqrt(variance) > 2.5) {
        periScore += 1;
        periIndicators.push(`Volatile energy levels (std: ${Math.sqrt(variance).toFixed(1)})`);
      }
    }
  }

  let age = 0;
  if (userProfile.birthday) {
    const birth = new Date(userProfile.birthday);
    age = Math.floor((now - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  }
  if (age >= 40) {
    periScore += 2;
    periIndicators.push(`Age ${age} (40+)`);
  }
  if (userProfile.cycleRegularity === 'irregular') {
    periScore += 2;
    periIndicators.push('Irregular cycle reported');
  }

  const userAcceptedStage = userProfile.lifeStage !== 'regular';
  const hasSuggestion = lifeStageSuggestion !== null;

  return {
    pregnancyScore,
    pregnancyThreshold: 5,
    perimenopauseScore: periScore,
    perimenopauseThreshold: 6,
    pregnancyIndicators,
    perimenopauseIndicators: periIndicators,
    currentLifeStage: userProfile.lifeStage,
    hasSuggestion,
    suggestionType: lifeStageSuggestion?.type ?? null,
    suggestionMessage: lifeStageSuggestion?.message ?? null,
    userAccepted: userAcceptedStage,
    userDismissed: dismissedSuggestionType !== null,
    dismissedType: dismissedSuggestionType,
  };
}

function getEmptyDashboard(days: number): AdminDashboardData {
  const data: DailyDataPoint[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      users: 0, scans: 0, checkIns: 0, revenue: 0, newUsers: 0,
    });
  }

  return {
    userMetrics: {
      totalUsers: 0, dau: 0, wau: 0, mau: 0,
      retention7Day: 0, retention30Day: 0,
      conversionRate: 0, referralUsageRate: 0,
      newUsersToday: 0, newUsersThisWeek: 0,
    },
    featureUsage: {
      scanCompletionRate: 0, checkInCompletionRate: 0, habitCompletionRate: 0,
      lifeStageDistribution: [], cycleRegularityDistribution: [],
      topSymptoms: [], avgScansPerUser: 0, avgCheckInsPerUser: 0,
    },
    revenueMetrics: {
      mrr: 0, arr: 0, freeTrialsActive: 0, churnRate: 0,
      referralDiscountsUsed: 0, avgRevenuePerUser: 0,
      totalRevenue: 0, mrrGrowth: 0, ltv: 0,
    },
    dailyData: data,
  };
}

export const ADMIN_CREDENTIALS: Record<string, { password: string; role: 'super_admin' | 'analyst' | 'viewer' }> = {
  admin: { password: 'iris2026!', role: 'super_admin' },
  analyst: { password: 'analyst2026', role: 'analyst' },
  viewer: { password: 'viewer2026', role: 'viewer' },
};

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: ['view_users', 'view_revenue', 'view_features', 'export_data', 'manage_roles'],
  analyst: ['view_users', 'view_features', 'export_data'],
  viewer: ['view_users', 'view_features'],
};

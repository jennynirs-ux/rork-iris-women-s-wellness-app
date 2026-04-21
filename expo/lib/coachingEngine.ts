import { ScanResult, DailyCheckIn, CyclePhase, UserProfile, CycleHistory, HealthData } from "@/types";

export interface CoachingTip {
  id: string;
  icon: string;
  title: string;
  message: string;
  category: "stress" | "energy" | "recovery" | "hydration" | "inflammation" | "sleep" | "phase" | "trend";
  priority: 1 | 2 | 3 | 4 | 5;
}

/**
 * Generates 2-4 personalized coaching tips based on scan results, check-ins, and cycle phase.
 * Uses a rule-based engine to identify patterns and provide actionable advice.
 */
export function generateCoachingTips(
  scans: ScanResult[],
  checkIns: DailyCheckIn[],
  phase: CyclePhase,
  userProfile: UserProfile,
  healthData?: HealthData | null
): CoachingTip[] {
  const tips: CoachingTip[] = [];

  if (scans.length === 0) {
    // Return a default tip if no scans available
    return [getDefaultPhaseTip(phase)];
  }

  // Use last 7 days of scans for analysis
  const recentScans = scans.slice(-7);
  if (recentScans.length === 0) {
    return [getDefaultPhaseTip(phase)];
  }
  const latestScan = recentScans[recentScans.length - 1];
  const latestCheckIn = checkIns.length > 0 ? checkIns[checkIns.length - 1] : null;

  // Apply stress rules
  const stressTips = checkStressRules(latestScan, recentScans, phase);
  tips.push(...stressTips);

  // Apply energy rules
  const energyTips = checkEnergyRules(latestScan, latestCheckIn, phase);
  tips.push(...energyTips);

  // Apply recovery rules
  const recoveryTips = checkRecoveryRules(latestScan, recentScans);
  tips.push(...recoveryTips);

  // Apply hydration rules
  const hydrationTips = checkHydrationRules(latestScan, latestCheckIn);
  tips.push(...hydrationTips);

  // Apply inflammation rules
  const inflammationTips = checkInflammationRules(latestScan, phase);
  tips.push(...inflammationTips);

  // Apply phase rules
  const phaseTips = checkPhaseRules(phase, latestCheckIn);
  tips.push(...phaseTips);

  // Apply sleep rules
  const sleepTips = checkSleepRules(latestCheckIn);
  tips.push(...sleepTips);

  // Apply trend rules
  const trendTips = checkTrendRules(recentScans);
  tips.push(...trendTips);

  // Apply health data rules (H1–H6)
  if (healthData) {
    const healthTips = checkHealthDataRules(healthData, latestScan, phase);
    tips.push(...healthTips);
  }

  // Remove duplicates (by id), sort by priority, and return max 4 tips
  const uniqueTips = Array.from(new Map(tips.map((t) => [t.id, t])).values());
  const sortedTips = uniqueTips.sort((a, b) => a.priority - b.priority);

  if (sortedTips.length === 0) {
    return [getDefaultPhaseTip(phase)];
  }

  return sortedTips.slice(0, 4);
}

// ============================================================================
// STRESS RULES
// ============================================================================

function checkStressRules(
  latestScan: ScanResult,
  recentScans: ScanResult[],
  phase: CyclePhase
): CoachingTip[] {
  const tips: CoachingTip[] = [];

  // Rule 1: If latest scan stressScore > 7
  if (latestScan.stressScore > 7) {
    tips.push({
      id: "stress-elevated-today",
      icon: "AlertCircle",
      title: "Stress Tip",
      message:
        "Your stress score appears higher today. Try 5 minutes of deep breathing or a short walk.",
      category: "stress",
      priority: 2,
    });
  }

  // Rule 2: If stress > 7 for 3+ consecutive days
  const consecutiveHighStress = countConsecutiveHighStress(recentScans, 7);
  if (consecutiveHighStress >= 3) {
    tips.push({
      id: "stress-prolonged-high",
      icon: "AlertCircle",
      title: "Stress Trending High",
      message: `Your stress has been high for ${consecutiveHighStress} days. Consider reducing caffeine and prioritizing sleep tonight.`,
      category: "stress",
      priority: 1,
    });
  }

  // Rule 3: If stress > 7 AND phase is luteal
  if (latestScan.stressScore > 7 && phase === "luteal") {
    tips.push({
      id: "stress-luteal",
      icon: "Moon",
      title: "Luteal Phase Stress",
      message:
        "Stress tends to peak in the luteal phase. This is normal — be extra gentle with yourself.",
      category: "stress",
      priority: 2,
    });
  }

  return tips;
}

function countConsecutiveHighStress(scans: ScanResult[], threshold: number): number {
  let count = 0;
  for (let i = scans.length - 1; i >= 0; i--) {
    if (scans[i].stressScore > threshold) {
      count++;
    } else {
      break;
    }
  }
  return count;
}

// ============================================================================
// ENERGY RULES
// ============================================================================

function checkEnergyRules(
  latestScan: ScanResult,
  latestCheckIn: DailyCheckIn | null,
  phase: CyclePhase
): CoachingTip[] {
  const tips: CoachingTip[] = [];

  // Rule 1: If energyScore < 4
  if (latestScan.energyScore < 4) {
    tips.push({
      id: "energy-low",
      icon: "Battery",
      title: "Low Energy",
      message:
        "Your energy is low. A 10-minute walk or protein-rich snack could help.",
      category: "energy",
      priority: 2,
    });
  }

  // Rule 2: If energyScore < 4 AND latest check-in sleep < 4
  if (latestScan.energyScore < 4 && latestCheckIn && latestCheckIn.sleep < 4) {
    tips.push({
      id: "energy-sleep-low",
      icon: "Moon",
      title: "Energy + Sleep Recovery",
      message:
        "Low energy + poor sleep — tonight, try going to bed 30 minutes earlier.",
      category: "energy",
      priority: 1,
    });
  }

  // Rule 3: If energyScore > 7 AND phase is follicular or ovulation
  if (
    latestScan.energyScore > 7 &&
    (phase === "follicular" || phase === "ovulation")
  ) {
    tips.push({
      id: "energy-peak",
      icon: "Zap",
      title: "Energy Peak",
      message:
        "Your energy is peaking — great time for intense workouts or challenging tasks.",
      category: "energy",
      priority: 3,
    });
  }

  return tips;
}

// ============================================================================
// RECOVERY RULES
// ============================================================================

function checkRecoveryRules(
  latestScan: ScanResult,
  recentScans: ScanResult[]
): CoachingTip[] {
  const tips: CoachingTip[] = [];

  // Rule 1: If recoveryScore < 4
  if (latestScan.recoveryScore < 4) {
    tips.push({
      id: "recovery-low",
      icon: "BedDouble",
      title: "Recovery Needed",
      message:
        "Your body needs more recovery time. Prioritize rest and hydration today.",
      category: "recovery",
      priority: 2,
    });
  }

  // Rule 2: If recoveryScore < 4 for 3+ days
  const consecutiveLowRecovery = countConsecutiveLow(recentScans, (s) => s.recoveryScore < 4);
  if (consecutiveLowRecovery >= 3) {
    tips.push({
      id: "recovery-prolonged-low",
      icon: "Moon",
      title: "Extended Recovery Deficit",
      message: `Recovery has been low for ${consecutiveLowRecovery} days. Consider a rest day and anti-inflammatory foods.`,
      category: "recovery",
      priority: 1,
    });
  }

  return tips;
}

function countConsecutiveLow(
  scans: ScanResult[],
  predicate: (scan: ScanResult) => boolean
): number {
  let count = 0;
  for (let i = scans.length - 1; i >= 0; i--) {
    if (predicate(scans[i])) {
      count++;
    } else {
      break;
    }
  }
  return count;
}

// ============================================================================
// HYDRATION RULES
// ============================================================================

function checkHydrationRules(
  latestScan: ScanResult,
  latestCheckIn: DailyCheckIn | null
): CoachingTip[] {
  const tips: CoachingTip[] = [];

  // Rule 1: If hydrationLevel < 4
  if (latestScan.hydrationLevel < 4) {
    tips.push({
      id: "hydration-low",
      icon: "Droplets",
      title: "Hydration Tip",
      message: "Your hydration trend is lower than usual. Try to drink regularly through the day.",
      category: "hydration",
      priority: 3,
    });
  }

  // Rule 2: If hydrationLevel < 4 AND latest check-in caffeine is true
  if (
    latestScan.hydrationLevel < 4 &&
    latestCheckIn &&
    latestCheckIn.hadCaffeine === true
  ) {
    tips.push({
      id: "hydration-caffeine",
      icon: "Coffee",
      title: "Caffeine + Hydration",
      message:
        "Caffeine + low hydration — balance each coffee with an extra glass of water.",
      category: "hydration",
      priority: 2,
    });
  }

  return tips;
}

// ============================================================================
// INFLAMMATION RULES
// ============================================================================

function checkInflammationRules(
  latestScan: ScanResult,
  phase: CyclePhase
): CoachingTip[] {
  const tips: CoachingTip[] = [];

  // Rule 1: If inflammation > 7
  if (latestScan.inflammation > 7) {
    tips.push({
      id: "inflammation-elevated",
      icon: "Flame",
      title: "Inflammation Tip",
      message:
        "Your inflammation estimate appears higher today. Try adding omega-3 rich foods and reducing sugar.",
      category: "inflammation",
      priority: 2,
    });
  }

  // Rule 2: If inflammation > 7 AND phase is luteal
  if (latestScan.inflammation > 7 && phase === "luteal") {
    tips.push({
      id: "inflammation-luteal",
      icon: "Leaf",
      title: "Luteal Anti-Inflammatory",
      message:
        "Luteal phase + high inflammation — anti-inflammatory foods like turmeric and leafy greens can help.",
      category: "inflammation",
      priority: 1,
    });
  }

  return tips;
}

// ============================================================================
// PHASE-AWARE RULES
// ============================================================================

function checkPhaseRules(
  phase: CyclePhase,
  latestCheckIn: DailyCheckIn | null
): CoachingTip[] {
  const tips: CoachingTip[] = [];

  // Rule 1: If phase is menstrual
  if (phase === "menstrual") {
    tips.push({
      id: "phase-menstrual",
      icon: "Droplets",
      title: "Menstrual Phase",
      message:
        "During menstruation, focus on iron-rich foods and gentle movement.",
      category: "phase",
      priority: 4,
    });
  }

  // Rule 2: If phase is ovulation
  if (phase === "ovulation") {
    tips.push({
      id: "phase-ovulation",
      icon: "Star",
      title: "Ovulation Window",
      message:
        "You're in your ovulation window — energy and mood tend to peak now.",
      category: "phase",
      priority: 4,
    });
  }

  return tips;
}

// ============================================================================
// SLEEP RULES
// ============================================================================

function checkSleepRules(latestCheckIn: DailyCheckIn | null): CoachingTip[] {
  const tips: CoachingTip[] = [];

  // Rule 1: If latest check-in sleep < 3
  if (latestCheckIn && latestCheckIn.sleep < 3) {
    tips.push({
      id: "sleep-very-low",
      icon: "Moon",
      title: "Sleep Quality Tip",
      message:
        "Your sleep quality was very low. Avoid screens 1 hour before bed tonight.",
      category: "sleep",
      priority: 1,
    });
  }

  return tips;
}

// ============================================================================
// TREND RULES
// ============================================================================

function checkTrendRules(recentScans: ScanResult[]): CoachingTip[] {
  const tips: CoachingTip[] = [];

  // Need at least 3 scans to detect a trend
  if (recentScans.length < 3) {
    return tips;
  }

  const last3Scans = recentScans.slice(-3);

  // Rule 1: If energy has been improving over last 3 scans
  if (
    last3Scans[0].energyScore < last3Scans[1].energyScore &&
    last3Scans[1].energyScore < last3Scans[2].energyScore
  ) {
    tips.push({
      id: "trend-energy-improving",
      icon: "TrendingUp",
      title: "Energy Improving",
      message:
        "Your energy is trending up — keep doing what you're doing!",
      category: "trend",
      priority: 5,
    });
  }

  // Rule 2: If stress has been decreasing over last 3 scans
  if (
    last3Scans[0].stressScore > last3Scans[1].stressScore &&
    last3Scans[1].stressScore > last3Scans[2].stressScore
  ) {
    tips.push({
      id: "trend-stress-decreasing",
      icon: "CheckCircle",
      title: "Stress Improving",
      message: "Great news — your stress levels are coming down.",
      category: "trend",
      priority: 5,
    });
  }

  return tips;
}

// ============================================================================
// HEALTH DATA RULES (H1–H6) — Apple Health / Oura integration
// ============================================================================

function checkHealthDataRules(
  health: HealthData,
  latestScan: ScanResult,
  phase: CyclePhase,
): CoachingTip[] {
  const tips: CoachingTip[] = [];

  // H1: Low HRV — nervous system under strain
  if (health.hrv !== undefined && health.hrv < 25) {
    tips.push({
      id: "health-hrv-low",
      icon: "Heart",
      title: "Low HRV Detected",
      message: "Your heart rate variability is low — a sign your nervous system needs rest. Consider skipping intense workouts today.",
      category: "recovery",
      priority: 1,
    });
  }

  // H2: HRV good + energy high → suggest capitalizing on readiness
  if (health.hrv !== undefined && health.hrv > 60 && latestScan.energyScore > 6) {
    tips.push({
      id: "health-hrv-high-energy",
      icon: "Zap",
      title: "Great Recovery Readiness",
      message: "Your HRV is strong and energy is high — ideal conditions for a challenging workout or creative work.",
      category: "energy",
      priority: 3,
    });
  }

  // H3: Short sleep from Health data
  if (health.sleepHours !== undefined && health.sleepHours < 6) {
    tips.push({
      id: "health-sleep-short",
      icon: "Moon",
      title: "Sleep Debt Building",
      message: `Apple Health recorded ${health.sleepHours.toFixed(1)}h of sleep. Aim for 7–9h — try an earlier bedtime tonight.`,
      category: "sleep",
      priority: 1,
    });
  }

  // H4: Low step count → gentle movement nudge
  if (health.steps !== undefined && health.steps < 3000 && new Date().getHours() > 14) {
    tips.push({
      id: "health-steps-low",
      icon: "Activity",
      title: "Move a Little More",
      message: `Only ${health.steps.toLocaleString()} steps so far today. A 10-minute walk can boost energy and mood.`,
      category: "energy",
      priority: 4,
    });
  }

  // H5: Wrist temperature deviation → possible ovulation or illness signal
  if (health.wristTemperatureDeviation !== undefined) {
    if (health.wristTemperatureDeviation > 0.3 && phase === 'follicular') {
      tips.push({
        id: "health-temp-rise-follicular",
        icon: "Thermometer",
        title: "Temperature Rise",
        message: "Your wrist temperature is rising — this may signal ovulation is approaching. Update your period log if needed.",
        category: "phase",
        priority: 2,
      });
    } else if (health.wristTemperatureDeviation > 0.5) {
      tips.push({
        id: "health-temp-elevated",
        icon: "Thermometer",
        title: "Elevated Temperature",
        message: "Your wrist temperature is above your personal baseline. Prioritize rest and hydration today.",
        category: "recovery",
        priority: 2,
      });
    }
  }

  // H6: Low SpO2 → hydration and breathing reminder
  if (health.spo2 !== undefined && health.spo2 < 95) {
    tips.push({
      id: "health-spo2-low",
      icon: "AlertCircle",
      title: "Oxygen Saturation Low",
      message: "Your SpO2 reading is below 95%. Try slow deep breathing exercises and ensure you're well-hydrated.",
      category: "recovery",
      priority: 1,
    });
  }

  return tips;
}

// ============================================================================
// DEFAULT PHASE TIP
// ============================================================================

function getDefaultPhaseTip(phase: CyclePhase): CoachingTip {
  const defaultTips: Record<CyclePhase, CoachingTip> = {
    menstrual: {
      id: "default-menstrual",
      icon: "Droplets",
      title: "Menstrual Phase",
      message: "Rest and self-care are important right now. Listen to your body.",
      category: "phase",
      priority: 5,
    },
    follicular: {
      id: "default-follicular",
      icon: "Sprout",
      title: "Follicular Phase",
      message:
        "This is a great time to start new projects and explore new activities.",
      category: "phase",
      priority: 5,
    },
    ovulation: {
      id: "default-ovulation",
      icon: "Star",
      title: "Ovulation",
      message:
        "You're at peak energy and confidence. Use this time for important tasks.",
      category: "phase",
      priority: 5,
    },
    luteal: {
      id: "default-luteal",
      icon: "Moon",
      title: "Luteal Phase",
      message: "Honor your need for rest and introspection during this phase.",
      category: "phase",
      priority: 5,
    },
  };

  return defaultTips[phase];
}

// ============================================================================
// PATTERN-BASED COACHING (multi-cycle analysis)
// ============================================================================

/**
 * Helper: Given scans and a cycle history entry, returns scans that fall
 * within that cycle's date range.
 */
function getScansForCycle(scans: ScanResult[], cycle: CycleHistory): ScanResult[] {
  const startMs = new Date(cycle.startDate).getTime();
  const endMs = cycle.endDate
    ? new Date(cycle.endDate).getTime()
    : startMs + (cycle.lengthDays || 28) * 24 * 60 * 60 * 1000;
  return scans.filter((s) => s.timestamp >= startMs && s.timestamp <= endMs);
}

/**
 * Helper: Given scans for a cycle and a cycle history entry, determine
 * approximate phase boundaries and return scans in the luteal phase.
 */
function getLutealScans(cycleScans: ScanResult[], cycle: CycleHistory): ScanResult[] {
  const startMs = new Date(cycle.startDate).getTime();
  const cycleDays = cycle.lengthDays || 28;
  const ovulationDay = cycle.ovulationDay || Math.round(cycleDays * 0.5);
  const lutealStartMs = startMs + ovulationDay * 24 * 60 * 60 * 1000;
  return cycleScans.filter((s) => s.timestamp >= lutealStartMs);
}

/**
 * Helper: Given scans for a cycle and a cycle history entry, determine
 * approximate follicular phase scans (after menstrual, before ovulation).
 */
function getFollicularScans(cycleScans: ScanResult[], cycle: CycleHistory): ScanResult[] {
  const startMs = new Date(cycle.startDate).getTime();
  const cycleDays = cycle.lengthDays || 28;
  const menstrualEndMs = startMs + 5 * 24 * 60 * 60 * 1000; // ~5 days menstrual
  const ovulationDay = cycle.ovulationDay || Math.round(cycleDays * 0.5);
  const ovulationMs = startMs + ovulationDay * 24 * 60 * 60 * 1000;
  return cycleScans.filter((s) => s.timestamp >= menstrualEndMs && s.timestamp < ovulationMs);
}

/**
 * Helper: average a metric across scans.
 */
function avgMetric(scans: ScanResult[], getter: (s: ScanResult) => number): number {
  if (scans.length === 0) return 0;
  return scans.reduce((sum, s) => sum + getter(s), 0) / scans.length;
}

/**
 * Generates personalized coaching tips based on multi-cycle pattern analysis.
 * Requires at least 2 completed cycles of data for pattern detection.
 *
 * @param scans - All scan results
 * @param checkIns - All daily check-ins
 * @param phase - Current cycle phase
 * @param cycleHistory - Array of past cycle records
 * @param t - Translation object
 * @returns Array of pattern-based coaching tips (may be empty)
 */
export function generatePatternBasedTips(
  scans: ScanResult[],
  checkIns: DailyCheckIn[],
  phase: CyclePhase,
  cycleHistory: CycleHistory[],
  t: any
): CoachingTip[] {
  const tips: CoachingTip[] = [];

  // Need at least 2 completed cycles for pattern analysis
  const completedCycles = cycleHistory.filter((c) => c.endDate && c.lengthDays);

  // --- Pattern 1: Stress rises in luteal phase ---
  if (completedCycles.length >= 2) {
    const lastCycles = completedCycles.slice(-3);
    let lutealStressHighCount = 0;

    for (const cycle of lastCycles) {
      const cycleScans = getScansForCycle(scans, cycle);
      const lutealScans = getLutealScans(cycleScans, cycle);
      const nonLutealScans = cycleScans.filter(
        (s) => !lutealScans.includes(s)
      );

      if (lutealScans.length >= 2 && nonLutealScans.length >= 2) {
        const lutealStress = avgMetric(lutealScans, (s) => s.stressScore);
        const nonLutealStress = avgMetric(nonLutealScans, (s) => s.stressScore);
        if (lutealStress > nonLutealStress * 1.2) {
          lutealStressHighCount++;
        }
      }
    }

    if (lutealStressHighCount >= 2) {
      tips.push({
        id: "pattern-luteal-stress",
        icon: "Moon",
        title: t.coaching?.patternLutealStressTitle ?? "Luteal Phase Stress Pattern",
        message: t.coaching?.patternLutealStressMsg ?? "Your stress tends to rise in your luteal phase. Consider scheduling lighter workdays during this time.",
        category: "stress",
        priority: 2,
      });
    }
  }

  // --- Pattern 2: Sleep drops below 6 for 3+ consecutive days ---
  if (checkIns.length >= 3) {
    const recentCheckIns = checkIns.slice(-7);
    let consecutiveLowSleep = 0;
    let maxConsecutive = 0;

    for (let i = recentCheckIns.length - 1; i >= 0; i--) {
      const sleepHours = recentCheckIns[i].sleepHours ?? recentCheckIns[i].sleep;
      if (sleepHours !== undefined && sleepHours < 6) {
        consecutiveLowSleep++;
        maxConsecutive = Math.max(maxConsecutive, consecutiveLowSleep);
      } else {
        consecutiveLowSleep = 0;
      }
    }

    if (maxConsecutive >= 3) {
      tips.push({
        id: "pattern-low-sleep-streak",
        icon: "Moon",
        title: t.coaching?.patternLowSleepTitle ?? "Sleep Deficit Detected",
        message: t.coaching?.patternLowSleepMsg ?? "Your sleep has been low recently. Try setting an earlier bedtime or a wind-down routine.",
        category: "sleep",
        priority: 1,
      });
    }
  }

  // --- Pattern 3: Energy peaks in follicular phase ---
  if (completedCycles.length >= 2) {
    const lastCycles = completedCycles.slice(-3);
    let follicularEnergyHighCount = 0;

    for (const cycle of lastCycles) {
      const cycleScans = getScansForCycle(scans, cycle);
      const follicularScans = getFollicularScans(cycleScans, cycle);
      const otherScans = cycleScans.filter(
        (s) => !follicularScans.includes(s)
      );

      if (follicularScans.length >= 2 && otherScans.length >= 2) {
        const follicularEnergy = avgMetric(follicularScans, (s) => s.energyScore);
        const otherEnergy = avgMetric(otherScans, (s) => s.energyScore);
        if (follicularEnergy > otherEnergy * 1.15) {
          follicularEnergyHighCount++;
        }
      }
    }

    if (follicularEnergyHighCount >= 2) {
      tips.push({
        id: "pattern-follicular-energy",
        icon: "Zap",
        title: t.coaching?.patternFollicularEnergyTitle ?? "Follicular Energy Peak",
        message: t.coaching?.patternFollicularEnergyMsg ?? "Your energy peaks in your follicular phase. This is a great time for challenging workouts!",
        category: "energy",
        priority: 3,
      });
    }
  }

  // --- Pattern 4: Skipped check-ins for 3+ days ---
  if (checkIns.length > 0) {
    const today = new Date();
    const lastCheckIn = checkIns[checkIns.length - 1];
    const lastCheckInDate = new Date(lastCheckIn.date);
    const daysSinceLastCheckIn = Math.floor(
      (today.getTime() - lastCheckInDate.getTime()) / (24 * 60 * 60 * 1000)
    );

    if (daysSinceLastCheckIn >= 3) {
      tips.push({
        id: "pattern-check-in-gap",
        icon: "CheckCircle",
        title: t.coaching?.patternCheckInGapTitle ?? "Welcome Back!",
        message: t.coaching?.patternCheckInGapMsg ?? "Welcome back! Consistent logging helps IRIS learn your patterns better.",
        category: "trend",
        priority: 2,
      });
    }
  }

  // --- Pattern 5: Inflammation rises after weekends ---
  if (scans.length >= 10 && checkIns.length >= 10) {
    const last30DaysMs = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentScans = scans.filter((s) => s.timestamp >= last30DaysMs);

    // Group scans by whether they are on Monday/Tuesday (post-weekend) vs mid-week
    const postWeekendScans = recentScans.filter((s) => {
      const day = new Date(s.date).getDay();
      return day === 1 || day === 2; // Monday or Tuesday
    });
    const midWeekScans = recentScans.filter((s) => {
      const day = new Date(s.date).getDay();
      return day >= 3 && day <= 5; // Wednesday to Friday
    });

    if (postWeekendScans.length >= 3 && midWeekScans.length >= 3) {
      const postWeekendInflammation = avgMetric(postWeekendScans, (s) => s.inflammation);
      const midWeekInflammation = avgMetric(midWeekScans, (s) => s.inflammation);

      if (postWeekendInflammation > midWeekInflammation * 1.2) {
        tips.push({
          id: "pattern-weekend-inflammation",
          icon: "Flame",
          title: t.coaching?.patternWeekendInflammationTitle ?? "Weekend Inflammation Pattern",
          message: t.coaching?.patternWeekendInflammationMsg ?? "Your weekend routine may be affecting your comfort scores. Notice any dietary patterns?",
          category: "inflammation",
          priority: 3,
        });
      }
    }
  }

  // --- Pattern 6: Hydration consistently low ---
  if (scans.length >= 7) {
    const last14Days = scans.filter(
      (s) => s.timestamp >= Date.now() - 14 * 24 * 60 * 60 * 1000
    );
    if (last14Days.length >= 5) {
      const lowHydrationCount = last14Days.filter(
        (s) => s.hydrationLevel < 4.5
      ).length;
      const lowHydrationRatio = lowHydrationCount / last14Days.length;

      if (lowHydrationRatio >= 0.6) {
        tips.push({
          id: "pattern-low-hydration",
          icon: "Droplets",
          title: t.coaching?.patternLowHydrationTitle ?? "Hydration Pattern",
          message: t.coaching?.patternLowHydrationMsg ?? "Your hydration tends to run low. Try setting a water reminder throughout the day.",
          category: "hydration",
          priority: 2,
        });
      }
    }
  }

  return tips;
}

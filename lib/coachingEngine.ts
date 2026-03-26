import { ScanResult, DailyCheckIn, CyclePhase, UserProfile } from "@/types";

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
  userProfile: UserProfile
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
      icon: "😰",
      title: "Stress Alert",
      message:
        "Your stress is elevated today. Try 5 minutes of deep breathing or a short walk.",
      category: "stress",
      priority: 2,
    });
  }

  // Rule 2: If stress > 7 for 3+ consecutive days
  const consecutiveHighStress = countConsecutiveHighStress(recentScans, 7);
  if (consecutiveHighStress >= 3) {
    tips.push({
      id: "stress-prolonged-high",
      icon: "⚠️",
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
      icon: "🌙",
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
      icon: "🔋",
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
      icon: "💤",
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
      icon: "⚡",
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
      icon: "🛌",
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
      icon: "😴",
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
      icon: "💧",
      title: "Hydration Alert",
      message: "You may be dehydrated. Aim for 8 glasses of water today.",
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
      icon: "☕",
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
      icon: "🔥",
      title: "Inflammation Alert",
      message:
        "Inflammation is elevated. Try adding omega-3 rich foods and reducing sugar.",
      category: "inflammation",
      priority: 2,
    });
  }

  // Rule 2: If inflammation > 7 AND phase is luteal
  if (latestScan.inflammation > 7 && phase === "luteal") {
    tips.push({
      id: "inflammation-luteal",
      icon: "🌿",
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
      icon: "🩸",
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
      icon: "🌟",
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
      icon: "🌙",
      title: "Sleep Quality Alert",
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
      icon: "📈",
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
      icon: "✅",
      title: "Stress Improving",
      message: "Great news — your stress levels are coming down.",
      category: "trend",
      priority: 5,
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
      icon: "🩸",
      title: "Menstrual Phase",
      message: "Rest and self-care are important right now. Listen to your body.",
      category: "phase",
      priority: 5,
    },
    follicular: {
      id: "default-follicular",
      icon: "🌱",
      title: "Follicular Phase",
      message:
        "This is a great time to start new projects and explore new activities.",
      category: "phase",
      priority: 5,
    },
    ovulation: {
      id: "default-ovulation",
      icon: "🌟",
      title: "Ovulation",
      message:
        "You're at peak energy and confidence. Use this time for important tasks.",
      category: "phase",
      priority: 5,
    },
    luteal: {
      id: "default-luteal",
      icon: "🌙",
      title: "Luteal Phase",
      message: "Honor your need for rest and introspection during this phase.",
      category: "phase",
      priority: 5,
    },
  };

  return defaultTips[phase];
}

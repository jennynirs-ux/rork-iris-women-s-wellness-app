import { ScanResult, DailyCheckIn, UserProfile, CyclePhase } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface StreakData {
  scanStreak: number;
  checkInStreak: number;
  longestScanStreak: number;
  longestCheckInStreak: number;
}

export interface Milestone {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface MonthlyComparison {
  metric: string;
  current: number;
  previous: number;
  change: number;
  improved: boolean;
}

const STORAGE_KEY_LONGEST_STREAKS = "iris_longest_streaks";

function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDaysDifference(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

export async function calculateStreaks(
  scans: ScanResult[],
  checkIns: DailyCheckIn[]
): Promise<StreakData> {
  const today = getLocalDateString();

  // Calculate current streaks
  let scanStreak = 0;
  let checkInStreak = 0;

  const MAX_STREAK_LOOKBACK = 365;
  let currentDate = new Date();
  for (let i = 0; i < MAX_STREAK_LOOKBACK; i++) {
    const dateStr = getLocalDateString(currentDate);
    const hasScan = scans.some((s) => s.date === dateStr);
    if (hasScan) {
      scanStreak++;
    } else {
      break;
    }
    currentDate.setDate(currentDate.getDate() - 1);
  }

  currentDate = new Date();
  for (let i = 0; i < MAX_STREAK_LOOKBACK; i++) {
    const dateStr = getLocalDateString(currentDate);
    const hasCheckIn = checkIns.some((c) => c.date === dateStr);
    if (hasCheckIn) {
      checkInStreak++;
    } else {
      break;
    }
    currentDate.setDate(currentDate.getDate() - 1);
  }

  // Load stored longest streaks
  let longestScanStreak = 0;
  let longestCheckInStreak = 0;
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY_LONGEST_STREAKS);
    if (stored) {
      const parsed = JSON.parse(stored);
      longestScanStreak = parsed.longestScanStreak || 0;
      longestCheckInStreak = parsed.longestCheckInStreak || 0;
    }
  } catch (e) {
    // Ignore storage errors
  }

  // Update longest streaks if current exceeds stored
  if (scanStreak > longestScanStreak || checkInStreak > longestCheckInStreak) {
    const updated = {
      longestScanStreak: Math.max(longestScanStreak, scanStreak),
      longestCheckInStreak: Math.max(longestCheckInStreak, checkInStreak),
    };
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY_LONGEST_STREAKS,
        JSON.stringify(updated)
      );
    } catch (e) {
      // Ignore storage errors
    }
  }

  return {
    scanStreak,
    checkInStreak,
    longestScanStreak: Math.max(longestScanStreak, scanStreak),
    longestCheckInStreak: Math.max(longestCheckInStreak, checkInStreak),
  };
}

export function calculateMilestones(
  scans: ScanResult[],
  checkIns: DailyCheckIn[],
  userProfile: UserProfile
): Milestone[] {
  const today = getLocalDateString();
  const milestones: Milestone[] = [];

  // First Scan
  const hasFirstScan = scans.length > 0;
  milestones.push({
    id: "first_scan",
    icon: "📸",
    title: "First Scan",
    description: "Completed your first eye scan",
    unlocked: hasFirstScan,
    unlockedAt: hasFirstScan ? scans[0]?.date : undefined,
  });

  // 7-day scan streak
  const sevenDayStreak = scans.filter((s) => {
    let currentDate = new Date();
    for (let i = 0; i < 7; i++) {
      const dateStr = getLocalDateString(currentDate);
      if (!scans.some((scan) => scan.date === dateStr)) {
        return false;
      }
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return true;
  }).length > 0;

  milestones.push({
    id: "week_warrior",
    icon: "🔥",
    title: "Week Warrior",
    description: "7-day scan streak",
    unlocked: sevenDayStreak,
  });

  // 14-day scan streak
  const fourteenDayStreak = scans.filter((s) => {
    let currentDate = new Date();
    for (let i = 0; i < 14; i++) {
      const dateStr = getLocalDateString(currentDate);
      if (!scans.some((scan) => scan.date === dateStr)) {
        return false;
      }
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return true;
  }).length > 0;

  milestones.push({
    id: "consistency_queen",
    icon: "👑",
    title: "Consistency Queen",
    description: "14-day scan streak",
    unlocked: fourteenDayStreak,
  });

  // 30-day scan streak
  const thirtyDayStreak = scans.filter((s) => {
    let currentDate = new Date();
    for (let i = 0; i < 30; i++) {
      const dateStr = getLocalDateString(currentDate);
      if (!scans.some((scan) => scan.date === dateStr)) {
        return false;
      }
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return true;
  }).length > 0;

  milestones.push({
    id: "monthly_master",
    icon: "⭐",
    title: "Monthly Master",
    description: "30-day scan streak",
    unlocked: thirtyDayStreak,
  });

  // 7-day check-in streak
  const sevenDayCheckInStreak = checkIns.filter((c) => {
    let currentDate = new Date();
    for (let i = 0; i < 7; i++) {
      const dateStr = getLocalDateString(currentDate);
      if (!checkIns.some((checkin) => checkin.date === dateStr)) {
        return false;
      }
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return true;
  }).length > 0;

  milestones.push({
    id: "checkin_champion",
    icon: "✅",
    title: "Check-in Champion",
    description: "7-day check-in streak",
    unlocked: sevenDayCheckInStreak,
  });

  // 30 check-ins total
  const thirtyCheckInsTotal = checkIns.length >= 30;
  milestones.push({
    id: "self_aware",
    icon: "🧠",
    title: "Self-Aware",
    description: "30 check-ins total",
    unlocked: thirtyCheckInsTotal,
  });

  // 50 scans total
  const fiftyScansTotal = scans.length >= 50;
  milestones.push({
    id: "data_pioneer",
    icon: "📊",
    title: "Data Pioneer",
    description: "50 scans total",
    unlocked: fiftyScansTotal,
  });

  // Completed scans in all 4 cycle phases
  const phasesWithScans = new Set<CyclePhase>();
  scans.forEach((s) => {
    phasesWithScans.add(s.hormonalState);
  });
  const allPhasesUnlocked = phasesWithScans.size === 4;
  milestones.push({
    id: "wellness_explorer",
    icon: "🌍",
    title: "Wellness Explorer",
    description: "Completed scans in all 4 cycle phases",
    unlocked: allPhasesUnlocked,
  });

  // 30+ days of app usage
  const oldestCheckIn = checkIns.length > 0 ? checkIns[0] : null;
  const oldestScan = scans.length > 0 ? scans[0] : null;
  const oldestDate = [oldestCheckIn?.date, oldestScan?.date]
    .filter((d): d is string => !!d)
    .sort()[0];
  const thirtyPlusDays =
    oldestDate && getDaysDifference(oldestDate, today) >= 30;
  milestones.push({
    id: "trend_setter",
    icon: "📈",
    title: "Trend Setter",
    description: "Using the app for 30+ days",
    unlocked: !!thirtyPlusDays,
  });

  // Doctor report generated (tracked via userProfile flag)
  const hasGeneratedDoctorReport = (userProfile as any).hasGeneratedDoctorReport ?? false;
  milestones.push({
    id: "health_advocate",
    icon: "👨‍⚕️",
    title: "Health Advocate",
    description: "Generated a doctor report",
    unlocked: hasGeneratedDoctorReport,
  });

  return milestones;
}

export function getMonthlyComparison(
  scans: ScanResult[],
  currentMonth: Date = new Date(),
  previousMonth: Date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
): MonthlyComparison[] {
  const currentMonthStr = `${currentMonth.getFullYear()}-${String(
    currentMonth.getMonth() + 1
  ).padStart(2, "0")}`;
  const previousMonthStr = `${previousMonth.getFullYear()}-${String(
    previousMonth.getMonth() + 1
  ).padStart(2, "0")}`;

  const currentScans = scans.filter((s) => s.date.startsWith(currentMonthStr));
  const previousScans = scans.filter((s) => s.date.startsWith(previousMonthStr));

  const comparisons: MonthlyComparison[] = [];

  if (currentScans.length > 0 && previousScans.length > 0) {
    // Stress comparison
    const currentAvgStress =
      currentScans.reduce((sum, s) => sum + s.stressScore, 0) /
      currentScans.length;
    const previousAvgStress =
      previousScans.reduce((sum, s) => sum + s.stressScore, 0) /
      previousScans.length;
    const stressChange = previousAvgStress === 0 ? 0 :
      ((previousAvgStress - currentAvgStress) / previousAvgStress) * 100;
    comparisons.push({
      metric: "Stress",
      current: Math.round(currentAvgStress * 10) / 10,
      previous: Math.round(previousAvgStress * 10) / 10,
      change: Math.round(stressChange * 10) / 10,
      improved: currentAvgStress < previousAvgStress,
    });

    // Energy comparison
    const currentAvgEnergy =
      currentScans.reduce((sum, s) => sum + s.energyScore, 0) /
      currentScans.length;
    const previousAvgEnergy =
      previousScans.reduce((sum, s) => sum + s.energyScore, 0) /
      previousScans.length;
    const energyChange = previousAvgEnergy === 0 ? 0 :
      ((currentAvgEnergy - previousAvgEnergy) / previousAvgEnergy) * 100;
    comparisons.push({
      metric: "Energy",
      current: Math.round(currentAvgEnergy * 10) / 10,
      previous: Math.round(previousAvgEnergy * 10) / 10,
      change: Math.round(energyChange * 10) / 10,
      improved: currentAvgEnergy > previousAvgEnergy,
    });

    // Recovery comparison
    const currentAvgRecovery =
      currentScans.reduce((sum, s) => sum + s.recoveryScore, 0) /
      currentScans.length;
    const previousAvgRecovery =
      previousScans.reduce((sum, s) => sum + s.recoveryScore, 0) /
      previousScans.length;
    const recoveryChange = previousAvgRecovery === 0 ? 0 :
      ((currentAvgRecovery - previousAvgRecovery) / previousAvgRecovery) * 100;
    comparisons.push({
      metric: "Recovery",
      current: Math.round(currentAvgRecovery * 10) / 10,
      previous: Math.round(previousAvgRecovery * 10) / 10,
      change: Math.round(recoveryChange * 10) / 10,
      improved: currentAvgRecovery > previousAvgRecovery,
    });
  }

  return comparisons;
}

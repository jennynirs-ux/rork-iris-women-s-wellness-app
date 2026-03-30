import { ScanResult } from "@/types";

export interface WeekComparison {
  metric: string;
  metricKey: string;     // translation key
  icon: string;          // Lucide icon name
  thisWeek: number;
  lastWeek: number;
  change: number;        // percentage change
  trend: 'improving' | 'declining' | 'stable';
  isGoodHigher: boolean; // true for energy/recovery/hydration, false for stress/fatigue/inflammation
}

interface MetricConfig {
  key: string;
  translationKey: string;
  icon: string;
  getter: (scan: ScanResult) => number;
  isGoodHigher: boolean;
}

const METRIC_CONFIGS: MetricConfig[] = [
  {
    key: 'energy',
    translationKey: 'home.energy',
    icon: 'Battery',
    getter: (scan) => scan.energyScore,
    isGoodHigher: true,
  },
  {
    key: 'stress',
    translationKey: 'home.stress',
    icon: 'Zap',
    getter: (scan) => scan.stressScore,
    isGoodHigher: false,
  },
  {
    key: 'recovery',
    translationKey: 'home.recovery',
    icon: 'Heart',
    getter: (scan) => scan.recoveryScore,
    isGoodHigher: true,
  },
  {
    key: 'hydration',
    translationKey: 'habits.hydration',
    icon: 'Droplets',
    getter: (scan) => scan.hydrationLevel,
    isGoodHigher: true,
  },
  {
    key: 'fatigue',
    translationKey: 'insights.fatigue',
    icon: 'Moon',
    getter: (scan) => scan.fatigueLevel,
    isGoodHigher: false,
  },
  {
    key: 'inflammation',
    translationKey: 'insights.inflammation',
    icon: 'Flame',
    getter: (scan) => scan.inflammation,
    isGoodHigher: false,
  },
];

/**
 * Computes the average value of a metric across a set of scans.
 */
function computeAverage(scans: ScanResult[], getter: (scan: ScanResult) => number): number {
  if (scans.length === 0) return 0;
  const sum = scans.reduce((acc, scan) => acc + getter(scan), 0);
  return sum / scans.length;
}

/**
 * Filters scans that fall within a date range [startMs, endMs).
 */
function getScansInRange(scans: ScanResult[], startMs: number, endMs: number): ScanResult[] {
  return scans.filter((scan) => {
    const scanMs = scan.timestamp;
    return scanMs >= startMs && scanMs < endMs;
  });
}

/**
 * Computes the percentage change from oldValue to newValue.
 * Returns 0 if oldValue is 0 (avoids division by zero).
 */
function percentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Determines the trend direction for a metric given old and new values.
 * A change of less than 5% is considered stable.
 */
function determineTrend(
  oldValue: number,
  newValue: number,
  isGoodHigher: boolean
): 'improving' | 'declining' | 'stable' {
  const change = percentageChange(oldValue, newValue);
  const threshold = 5; // 5% threshold for stability

  if (Math.abs(change) < threshold) return 'stable';

  if (isGoodHigher) {
    // Higher is better: increase = improving, decrease = declining
    return newValue > oldValue ? 'improving' : 'declining';
  } else {
    // Lower is better: decrease = improving, increase = declining
    return newValue < oldValue ? 'improving' : 'declining';
  }
}

/**
 * Compares scan metrics between the current week (last 7 days) and the previous week.
 * Returns null if either week has fewer than 2 scans.
 *
 * @param scans - All scan results, sorted by timestamp
 * @param today - The reference date (typically today)
 * @returns Array of WeekComparison objects, or null if insufficient data
 */
export function compareWeeks(
  scans: ScanResult[],
  today: Date
): WeekComparison[] | null {
  const endOfThisWeek = new Date(today);
  endOfThisWeek.setHours(23, 59, 59, 999);
  const endMs = endOfThisWeek.getTime();

  const startOfThisWeek = new Date(today);
  startOfThisWeek.setDate(startOfThisWeek.getDate() - 6);
  startOfThisWeek.setHours(0, 0, 0, 0);
  const thisWeekStartMs = startOfThisWeek.getTime();

  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
  const lastWeekStartMs = startOfLastWeek.getTime();

  const thisWeekScans = getScansInRange(scans, thisWeekStartMs, endMs + 1);
  const lastWeekScans = getScansInRange(scans, lastWeekStartMs, thisWeekStartMs);

  // Require at least 2 scans in each week
  if (thisWeekScans.length < 2 || lastWeekScans.length < 2) {
    return null;
  }

  return METRIC_CONFIGS.map((config) => {
    const thisWeekAvg = computeAverage(thisWeekScans, config.getter);
    const lastWeekAvg = computeAverage(lastWeekScans, config.getter);
    const change = percentageChange(lastWeekAvg, thisWeekAvg);
    const trend = determineTrend(lastWeekAvg, thisWeekAvg, config.isGoodHigher);

    return {
      metric: config.key,
      metricKey: config.translationKey,
      icon: config.icon,
      thisWeek: Math.round(thisWeekAvg * 10) / 10,
      lastWeek: Math.round(lastWeekAvg * 10) / 10,
      change: Math.round(change * 10) / 10,
      trend,
      isGoodHigher: config.isGoodHigher,
    };
  });
}

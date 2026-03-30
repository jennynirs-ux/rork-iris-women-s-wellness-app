import { ScanResult, DailyCheckIn, CycleHistory } from '@/types';

export interface CycleRecap {
  cycleNumber: number;
  startDate: string;
  endDate: string;
  lengthDays: number;
  avgStress: number;
  avgEnergy: number;
  avgRecovery: number;
  avgMood: number;
  avgSleep: number;
  topSymptoms: { symptom: string; count: number }[];
  scanCount: number;
  checkInCount: number;
  comparedToPrevious: {
    lengthChange: number;
    stressChange: number;
    energyChange: number;
  } | null;
}

// ─── helpers ────────────────────────────────────────────────────────────────

/** Safe average: returns 0 for empty arrays and guards against NaN. */
function safeAvg(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  const result = sum / values.length;
  return isNaN(result) ? 0 : result;
}

/** Round to one decimal place. */
function round1(value: number): number {
  if (isNaN(value)) return 0;
  return Math.round(value * 10) / 10;
}

/** Check if a date string is valid. */
function isValidDate(dateStr: string | undefined | null): boolean {
  if (!dateStr || typeof dateStr !== 'string') return false;
  return !isNaN(new Date(dateStr).getTime());
}

/** Compute the end date for a cycle. Uses endDate if available, else startDate + lengthDays. */
function getCycleEndMs(cycle: CycleHistory): number | null {
  if (isValidDate(cycle.endDate)) {
    return new Date(cycle.endDate!).getTime();
  }
  if (isValidDate(cycle.startDate) && cycle.lengthDays && cycle.lengthDays > 0) {
    const start = new Date(cycle.startDate).getTime();
    return start + (cycle.lengthDays - 1) * 24 * 60 * 60 * 1000;
  }
  return null;
}

/** Check if a date falls within a given range [startMs, endMs]. */
function isInRange(dateStr: string, startMs: number, endMs: number): boolean {
  if (!isValidDate(dateStr)) return false;
  const t = new Date(dateStr).getTime();
  return t >= startMs && t <= endMs;
}

// ─── main function ──────────────────────────────────────────────────────────

/**
 * Generate a recap for the most recently completed cycle.
 * Returns null if there are no completed cycles in the history.
 */
export function generateCycleRecap(
  cycleHistory: CycleHistory[],
  scans: ScanResult[],
  checkIns: DailyCheckIn[],
): CycleRecap | null {
  // Filter to completed cycles only (must have a determinable end date)
  const completedCycles = cycleHistory.filter((c) => {
    if (!isValidDate(c.startDate)) return false;
    return getCycleEndMs(c) !== null;
  });

  if (completedCycles.length < 1) return null;

  // Sort by start date ascending so the last element is the most recent
  const sorted = [...completedCycles].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  const lastCycle = sorted[sorted.length - 1];
  const prevCycle = sorted.length >= 2 ? sorted[sorted.length - 2] : null;

  const startMs = new Date(lastCycle.startDate).getTime();
  const endMs = getCycleEndMs(lastCycle)!;
  const lengthDays = lastCycle.lengthDays && lastCycle.lengthDays > 0
    ? lastCycle.lengthDays
    : Math.max(1, Math.floor((endMs - startMs) / (24 * 60 * 60 * 1000)) + 1);

  const endDateStr = lastCycle.endDate && isValidDate(lastCycle.endDate)
    ? lastCycle.endDate
    : new Date(endMs).toISOString().split('T')[0];

  // ── Filter scans & check-ins to this cycle's window ───────────────────

  const cycleScans = scans.filter((s) => s.date && isInRange(s.date, startMs, endMs));
  const cycleCheckIns = checkIns.filter((c) => c.date && isInRange(c.date, startMs, endMs));

  // ── Compute scan-based averages ───────────────────────────────────────

  const stressValues: number[] = [];
  const energyValues: number[] = [];
  const recoveryValues: number[] = [];

  for (const scan of cycleScans) {
    if (scan.stressScore != null && !isNaN(scan.stressScore)) {
      stressValues.push(scan.stressScore);
    }
    if (scan.energyScore != null && !isNaN(scan.energyScore)) {
      energyValues.push(scan.energyScore);
    }
    if (scan.recoveryScore != null && !isNaN(scan.recoveryScore)) {
      recoveryValues.push(scan.recoveryScore);
    }
  }

  // ── Compute check-in-based averages ───────────────────────────────────

  const moodValues: number[] = [];
  const sleepValues: number[] = [];

  for (const ci of cycleCheckIns) {
    if (ci.mood != null && !isNaN(ci.mood)) {
      moodValues.push(ci.mood);
    }
    if (ci.sleep != null && !isNaN(ci.sleep)) {
      sleepValues.push(ci.sleep);
    }
  }

  // ── Tally symptoms ────────────────────────────────────────────────────

  const symptomCounts: Record<string, number> = {};

  for (const ci of cycleCheckIns) {
    if (!ci.symptoms || !Array.isArray(ci.symptoms)) continue;
    for (const symptom of ci.symptoms) {
      if (!symptom || typeof symptom !== 'string') continue;
      symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
    }
  }

  // Sort by count descending, take top 5
  const topSymptoms = Object.entries(symptomCounts)
    .map(([symptom, count]) => ({ symptom, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // ── Compare to previous cycle ─────────────────────────────────────────

  let comparedToPrevious: CycleRecap['comparedToPrevious'] = null;

  if (prevCycle) {
    const prevStartMs = new Date(prevCycle.startDate).getTime();
    const prevEndMs = getCycleEndMs(prevCycle);

    if (prevEndMs !== null) {
      const prevLength = prevCycle.lengthDays && prevCycle.lengthDays > 0
        ? prevCycle.lengthDays
        : Math.max(1, Math.floor((prevEndMs - prevStartMs) / (24 * 60 * 60 * 1000)) + 1);

      // Compute previous cycle scan averages
      const prevScans = scans.filter((s) => s.date && isInRange(s.date, prevStartMs, prevEndMs));

      const prevStressVals: number[] = [];
      const prevEnergyVals: number[] = [];
      for (const scan of prevScans) {
        if (scan.stressScore != null && !isNaN(scan.stressScore)) {
          prevStressVals.push(scan.stressScore);
        }
        if (scan.energyScore != null && !isNaN(scan.energyScore)) {
          prevEnergyVals.push(scan.energyScore);
        }
      }

      const prevAvgStress = safeAvg(prevStressVals);
      const prevAvgEnergy = safeAvg(prevEnergyVals);
      const currentAvgStress = safeAvg(stressValues);
      const currentAvgEnergy = safeAvg(energyValues);

      comparedToPrevious = {
        lengthChange: round1(lengthDays - prevLength),
        stressChange: round1(currentAvgStress - prevAvgStress),
        energyChange: round1(currentAvgEnergy - prevAvgEnergy),
      };
    }
  }

  // ── Assemble recap ────────────────────────────────────────────────────

  return {
    cycleNumber: sorted.length,
    startDate: lastCycle.startDate,
    endDate: endDateStr,
    lengthDays,
    avgStress: round1(safeAvg(stressValues)),
    avgEnergy: round1(safeAvg(energyValues)),
    avgRecovery: round1(safeAvg(recoveryValues)),
    avgMood: round1(safeAvg(moodValues)),
    avgSleep: round1(safeAvg(sleepValues)),
    topSymptoms,
    scanCount: cycleScans.length,
    checkInCount: cycleCheckIns.length,
    comparedToPrevious,
  };
}

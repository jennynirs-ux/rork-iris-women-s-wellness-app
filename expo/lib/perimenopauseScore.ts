import { DailyCheckIn, ScanResult } from "@/types";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface AssessmentFactor {
  name: string;
  nameKey: string;
  value: number;   // 0-10
  weight: number;   // importance multiplier
  icon: string;     // Lucide icon name
}

export interface PerimenopauseAssessment {
  score: number;           // 0-100 composite score
  category: "low" | "moderate" | "significant";
  factors: AssessmentFactor[];
  recommendations: string[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Safe average: returns 0 for empty arrays and guards NaN. */
function safeAvg(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  const result = sum / values.length;
  return isNaN(result) ? 0 : result;
}

/** Clamp a number to [min, max]. */
function clamp(value: number, min: number, max: number): number {
  if (isNaN(value)) return min;
  return Math.max(min, Math.min(max, value));
}

/** Calculate variance for a number array. */
function variance(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = safeAvg(values);
  const squaredDiffs = values.map((v) => (v - mean) ** 2);
  return safeAvg(squaredDiffs);
}

/** Calculate age from birthday string. Returns null if invalid. */
function getAge(birthday: string | undefined): number | null {
  if (!birthday || typeof birthday !== "string") return null;
  const birth = new Date(birthday);
  if (isNaN(birth.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/** Map night sweat severity to a numeric value (0-10 scale). */
function nightSweatSeverityToScore(severity: string | undefined): number {
  switch (severity) {
    case "severe":
      return 10;
    case "moderate":
      return 7;
    case "mild":
      return 4;
    case "none":
    default:
      return 0;
  }
}

/** Filter check-ins to the most recent N days. */
function recentCheckIns(checkIns: DailyCheckIn[], days: number): DailyCheckIn[] {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return checkIns.filter((c) => {
    if (!c.date) return false;
    const t = new Date(c.date).getTime();
    return !isNaN(t) && t >= cutoff;
  });
}

/** Filter scans to the most recent N days. */
function recentScans(scans: ScanResult[], days: number): ScanResult[] {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return scans.filter((s) => {
    if (!s.date) return false;
    const t = new Date(s.date).getTime();
    return !isNaN(t) && t >= cutoff;
  });
}

// ─── Factor Calculators ──────────────────────────────────────────────────────

function calcHotFlashFactor(checkIns: DailyCheckIn[]): number {
  const counts = checkIns
    .map((c) => c.hotFlashCount ?? 0)
    .filter((v) => !isNaN(v));
  if (counts.length === 0) return 0;
  const avg = safeAvg(counts);
  // Scale: 0 flashes => 0, 1 => 3, 3 => 6, 5+ => 10
  return clamp(avg * 2, 0, 10);
}

function calcNightSweatFactor(checkIns: DailyCheckIn[]): number {
  const scores = checkIns.map((c) => nightSweatSeverityToScore(c.nightSweatSeverity));
  if (scores.length === 0) return 0;
  return clamp(safeAvg(scores), 0, 10);
}

function calcSleepDisruptionFactor(checkIns: DailyCheckIn[]): number {
  const sleepScores = checkIns
    .map((c) => c.sleep)
    .filter((v) => v != null && !isNaN(v)) as number[];
  if (sleepScores.length === 0) return 0;
  const avgSleep = safeAvg(sleepScores);
  // Sleep is 1-10 where 10 is good. Invert: 10 sleep => 0 disruption, 1 sleep => 9
  return clamp(10 - avgSleep, 0, 10);
}

function calcMoodVolatilityFactor(checkIns: DailyCheckIn[]): number {
  const moodScores = checkIns
    .map((c) => c.mood)
    .filter((v) => v != null && !isNaN(v)) as number[];
  if (moodScores.length < 3) return 0;
  const v = variance(moodScores);
  // Variance of 0 => 0, variance of 4+ => 10 (mood on 1-10 scale)
  return clamp(v * 2.5, 0, 10);
}

function calcCycleIrregularityFactor(checkIns: DailyCheckIn[]): number {
  // Look for bleeding patterns to detect cycle lengths
  const bleedingDays = checkIns
    .filter(
      (c) =>
        c.bleedingLevel &&
        c.bleedingLevel !== "none" &&
        c.bleedingLevel !== "spotting" &&
        c.date
    )
    .map((c) => new Date(c.date).getTime())
    .filter((t) => !isNaN(t))
    .sort((a, b) => a - b);

  if (bleedingDays.length < 4) return 0;

  // Group bleeding days into periods (gap > 5 days = new period)
  const periodStarts: number[] = [bleedingDays[0]];
  for (let i = 1; i < bleedingDays.length; i++) {
    const dayGap = (bleedingDays[i] - bleedingDays[i - 1]) / (24 * 60 * 60 * 1000);
    if (dayGap > 5) {
      periodStarts.push(bleedingDays[i]);
    }
  }

  if (periodStarts.length < 3) return 0;

  // Calculate cycle lengths from period start gaps
  const cycleLengths: number[] = [];
  for (let i = 1; i < periodStarts.length; i++) {
    const length = Math.round(
      (periodStarts[i] - periodStarts[i - 1]) / (24 * 60 * 60 * 1000)
    );
    if (length > 15 && length < 90) {
      cycleLengths.push(length);
    }
  }

  if (cycleLengths.length < 2) return 0;

  const minLen = Math.min(...cycleLengths);
  const maxLen = Math.max(...cycleLengths);
  const range = maxLen - minLen;

  // Range of 0-2 days => 0, 5 days => 5, 10+ days => 10
  return clamp(range, 0, 10);
}

function calcFatigueFactor(scans: ScanResult[]): number {
  const fatigueValues = scans
    .map((s) => s.fatigueLevel)
    .filter((v) => v != null && !isNaN(v)) as number[];
  if (fatigueValues.length === 0) return 0;
  return clamp(safeAvg(fatigueValues), 0, 10);
}

function calcStressFactor(scans: ScanResult[]): number {
  const stressValues = scans
    .map((s) => s.stressScore)
    .filter((v) => v != null && !isNaN(v)) as number[];
  if (stressValues.length === 0) return 0;
  return clamp(safeAvg(stressValues), 0, 10);
}

// ─── Recommendations ─────────────────────────────────────────────────────────

function buildRecommendations(factors: AssessmentFactor[]): string[] {
  const recs: string[] = [];
  const factorMap: Record<string, number> = {};
  for (const f of factors) {
    factorMap[f.nameKey] = f.value;
  }

  if ((factorMap["perimenopause.hotFlashes"] ?? 0) >= 5) {
    recs.push(
      "Track your hot flash patterns and discuss frequency changes with your healthcare provider."
    );
  }

  if ((factorMap["perimenopause.nightSweats"] ?? 0) >= 5) {
    recs.push(
      "Keep your bedroom cool and consider moisture-wicking sleepwear to improve sleep quality."
    );
  }

  if ((factorMap["perimenopause.sleepQuality"] ?? 0) >= 5) {
    recs.push(
      "Establish a consistent wind-down routine and limit screen time before bed."
    );
  }

  if ((factorMap["perimenopause.moodStability"] ?? 0) >= 5) {
    recs.push(
      "Regular physical activity and mindfulness practices may help stabilize mood swings."
    );
  }

  if ((factorMap["perimenopause.cycleRegularity"] ?? 0) >= 5) {
    recs.push(
      "Keep tracking your cycle to help your healthcare provider assess hormonal changes."
    );
  }

  if ((factorMap["perimenopause.fatigueLevel"] ?? 0) >= 5) {
    recs.push(
      "Prioritize restorative activities and consider checking iron and thyroid levels."
    );
  }

  if ((factorMap["perimenopause.stressLevel"] ?? 0) >= 5) {
    recs.push(
      "Incorporate stress-reduction techniques such as deep breathing or gentle yoga."
    );
  }

  // Always include the general disclaimer-style recommendation
  if (recs.length === 0) {
    recs.push(
      "Your wellness indicators look stable. Continue tracking to build a comprehensive picture."
    );
  }

  return recs;
}

// ─── Main Function ───────────────────────────────────────────────────────────

/**
 * Calculate a composite perimenopause wellness score based on recent
 * check-ins and scans. Returns null if insufficient data or not applicable.
 */
export function calculatePerimenopauseScore(
  checkIns: DailyCheckIn[],
  scans: ScanResult[],
  userProfile: { lifeStage: string; birthday?: string }
): PerimenopauseAssessment | null {
  // Only calculate for perimenopause/menopause users, or age > 40
  const isApplicableStage =
    userProfile.lifeStage === "perimenopause" ||
    userProfile.lifeStage === "menopause";
  const age = getAge(userProfile.birthday);
  const isAgeApplicable = age !== null && age > 40;

  if (!isApplicableStage && !isAgeApplicable) {
    return null;
  }

  // Need at least 14 days of check-in data
  const recent = recentCheckIns(checkIns, 90); // look at 90-day window
  if (recent.length < 14) {
    return null;
  }

  const recentScanData = recentScans(scans, 90);

  // ── Calculate each factor ────────────────────────────────────────────────

  const factors: AssessmentFactor[] = [
    {
      name: "Hot Flashes",
      nameKey: "perimenopause.hotFlashes",
      value: Math.round(calcHotFlashFactor(recent) * 10) / 10,
      weight: 3,
      icon: "Flame",
    },
    {
      name: "Night Sweats",
      nameKey: "perimenopause.nightSweats",
      value: Math.round(calcNightSweatFactor(recent) * 10) / 10,
      weight: 2.5,
      icon: "Moon",
    },
    {
      name: "Sleep Quality",
      nameKey: "perimenopause.sleepQuality",
      value: Math.round(calcSleepDisruptionFactor(recent) * 10) / 10,
      weight: 2,
      icon: "BedDouble",
    },
    {
      name: "Mood Stability",
      nameKey: "perimenopause.moodStability",
      value: Math.round(calcMoodVolatilityFactor(recent) * 10) / 10,
      weight: 2,
      icon: "Heart",
    },
    {
      name: "Cycle Regularity",
      nameKey: "perimenopause.cycleRegularity",
      value: Math.round(calcCycleIrregularityFactor(recent) * 10) / 10,
      weight: 2.5,
      icon: "Calendar",
    },
    {
      name: "Fatigue Level",
      nameKey: "perimenopause.fatigueLevel",
      value: Math.round(calcFatigueFactor(recentScanData) * 10) / 10,
      weight: 1.5,
      icon: "Battery",
    },
    {
      name: "Stress Level",
      nameKey: "perimenopause.stressLevel",
      value: Math.round(calcStressFactor(recentScanData) * 10) / 10,
      weight: 1,
      icon: "Brain",
    },
  ];

  // ── Compute weighted composite score ─────────────────────────────────────

  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
  const weightedSum = factors.reduce((sum, f) => sum + f.value * f.weight, 0);
  const rawScore = totalWeight > 0 ? (weightedSum / totalWeight) * 10 : 0;
  const score = clamp(Math.round(rawScore), 0, 100);

  // ── Determine category ───────────────────────────────────────────────────

  let category: PerimenopauseAssessment["category"];
  if (score <= 33) {
    category = "low";
  } else if (score <= 66) {
    category = "moderate";
  } else {
    category = "significant";
  }

  // ── Build recommendations ────────────────────────────────────────────────

  const recommendations = buildRecommendations(factors);

  return {
    score,
    category,
    factors,
    recommendations,
  };
}

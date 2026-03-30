import { CyclePhase, DailyCheckIn, ScanResult, UserProfile } from "@/types";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface CognitiveAssessment {
  overallScore: number;        // 0-100
  category: "sharp" | "good" | "fair" | "needs-attention";
  factors: CognitiveFactor[];
  recommendations: string[];
  brainExercises: BrainExercise[];
}

export interface CognitiveFactor {
  name: string;
  nameKey: string;
  score: number;       // 0-10
  icon: string;
  trend: "improving" | "stable" | "declining";
}

export interface BrainExercise {
  id: string;
  titleKey: string;
  descriptionKey: string;
  durationMinutes: number;
  category: "memory" | "focus" | "creativity" | "verbal";
  icon: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function safeAvg(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  const result = sum / values.length;
  return isNaN(result) ? 0 : result;
}

function clamp(value: number, min: number, max: number): number {
  if (isNaN(value)) return min;
  return Math.max(min, Math.min(max, value));
}

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

function recentCheckIns(checkIns: DailyCheckIn[], days: number): DailyCheckIn[] {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return checkIns.filter((c) => {
    if (!c.date) return false;
    const t = new Date(c.date).getTime();
    return !isNaN(t) && t >= cutoff;
  });
}

function recentScans(scans: ScanResult[], days: number): ScanResult[] {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return scans.filter((s) => {
    if (!s.date) return false;
    const t = new Date(s.date).getTime();
    return !isNaN(t) && t >= cutoff;
  });
}

/**
 * Determine trend by comparing recent half vs older half of values.
 */
function determineTrend(values: number[]): "improving" | "stable" | "declining" {
  if (values.length < 4) return "stable";
  const midpoint = Math.floor(values.length / 2);
  const olderHalf = values.slice(0, midpoint);
  const newerHalf = values.slice(midpoint);
  const olderAvg = safeAvg(olderHalf);
  const newerAvg = safeAvg(newerHalf);
  const diff = newerAvg - olderAvg;
  if (diff > 0.5) return "improving";
  if (diff < -0.5) return "declining";
  return "stable";
}

// ─── Brain Exercises ─────────────────────────────────────────────────────────

const BRAIN_EXERCISES: BrainExercise[] = [
  {
    id: "word-association",
    titleKey: "cognitive.exercise.wordAssociation.title",
    descriptionKey: "cognitive.exercise.wordAssociation.description",
    durationMinutes: 2,
    category: "memory",
    icon: "BookOpen",
  },
  {
    id: "number-sequence",
    titleKey: "cognitive.exercise.numberSequence.title",
    descriptionKey: "cognitive.exercise.numberSequence.description",
    durationMinutes: 3,
    category: "focus",
    icon: "Hash",
  },
  {
    id: "gratitude-journaling",
    titleKey: "cognitive.exercise.gratitudeJournaling.title",
    descriptionKey: "cognitive.exercise.gratitudeJournaling.description",
    durationMinutes: 5,
    category: "creativity",
    icon: "Heart",
  },
  {
    id: "name-recall",
    titleKey: "cognitive.exercise.nameRecall.title",
    descriptionKey: "cognitive.exercise.nameRecall.description",
    durationMinutes: 2,
    category: "memory",
    icon: "Users",
  },
  {
    id: "deep-reading",
    titleKey: "cognitive.exercise.deepReading.title",
    descriptionKey: "cognitive.exercise.deepReading.description",
    durationMinutes: 5,
    category: "focus",
    icon: "FileText",
  },
  {
    id: "creative-visualization",
    titleKey: "cognitive.exercise.creativeVisualization.title",
    descriptionKey: "cognitive.exercise.creativeVisualization.description",
    durationMinutes: 3,
    category: "creativity",
    icon: "Sparkles",
  },
];

// ─── Factor Calculators ──────────────────────────────────────────────────────

/**
 * Calculate memory factor from scan cognitiveSharpness values over time.
 * Weight: 3
 */
function calcMemoryFactor(scans: ScanResult[]): { score: number; trend: "improving" | "stable" | "declining" } {
  const values = scans
    .map((s) => s.emotionalMentalState?.cognitiveSharpness)
    .filter((v): v is number => v != null && !isNaN(v));
  if (values.length === 0) return { score: 5, trend: "stable" };
  const avg = safeAvg(values);
  return { score: clamp(avg, 0, 10), trend: determineTrend(values) };
}

/**
 * Calculate focus factor from cognitiveLoad and gazeStability.
 * Weight: 2
 */
function calcFocusFactor(scans: ScanResult[]): { score: number; trend: "improving" | "stable" | "declining" } {
  const values = scans.map((s) => {
    const cogLoad = s.physiologicalStates?.cognitiveLoad ?? 5;
    const gazeStability = s.rawOpticalSignals?.gazeStability ?? 5;
    // Higher gaze stability = better focus, lower cognitive load = less overwhelmed
    return clamp((gazeStability + (10 - cogLoad)) / 2, 0, 10);
  });
  if (values.length === 0) return { score: 5, trend: "stable" };
  return { score: clamp(safeAvg(values), 0, 10), trend: determineTrend(values) };
}

/**
 * Calculate mood stability factor from check-in mood variance.
 * Weight: 1.5
 */
function calcMoodFactor(checkIns: DailyCheckIn[]): { score: number; trend: "improving" | "stable" | "declining" } {
  const moodValues = checkIns
    .map((c) => c.mood)
    .filter((v): v is number => v != null && !isNaN(v));
  if (moodValues.length < 3) return { score: 5, trend: "stable" };

  // Higher average mood + lower variance = better
  const avgMood = safeAvg(moodValues);
  const moodVariance = moodValues.length >= 2
    ? safeAvg(moodValues.map((v) => (v - avgMood) ** 2))
    : 0;
  // Low variance (0) = 10, high variance (9+) = 0
  const stabilityScore = clamp(10 - moodVariance, 0, 10);
  const combinedScore = clamp((avgMood * 0.6 + stabilityScore * 0.4), 0, 10);
  return { score: combinedScore, trend: determineTrend(moodValues) };
}

/**
 * Calculate sleep quality factor from check-in sleep scores.
 * Weight: 2
 */
function calcSleepFactor(checkIns: DailyCheckIn[]): { score: number; trend: "improving" | "stable" | "declining" } {
  const sleepValues = checkIns
    .map((c) => c.sleep)
    .filter((v): v is number => v != null && !isNaN(v));
  if (sleepValues.length === 0) return { score: 5, trend: "stable" };
  return { score: clamp(safeAvg(sleepValues), 0, 10), trend: determineTrend(sleepValues) };
}

// ─── Recommendations ─────────────────────────────────────────────────────────

function buildCognitiveRecommendations(
  factors: CognitiveFactor[],
  currentPhase: CyclePhase | null,
): string[] {
  const recs: string[] = [];
  const factorMap: Record<string, CognitiveFactor> = {};
  for (const f of factors) {
    factorMap[f.nameKey] = f;
  }

  const memory = factorMap["cognitive.memory"];
  const focus = factorMap["cognitive.focus"];
  const mood = factorMap["cognitive.mood"];
  const sleep = factorMap["cognitive.sleep"];

  if (memory && memory.score < 5) {
    recs.push("Try memory exercises like word association or name recall to keep your recall sharp.");
  }
  if (memory && memory.trend === "declining") {
    recs.push("Your memory scores have been trending down. Consider adding brain-training activities to your routine.");
  }

  if (focus && focus.score < 5) {
    recs.push("Break tasks into smaller chunks and take short movement breaks to improve focus.");
  }

  if (mood && mood.score < 5) {
    recs.push("Mood fluctuations can affect cognitive performance. Gentle exercise and mindfulness may help stabilize your mood.");
  }

  if (sleep && sleep.score < 5) {
    recs.push("Poor sleep quality significantly impacts cognitive function. Prioritize a consistent bedtime routine.");
  }
  if (sleep && sleep.trend === "declining") {
    recs.push("Your sleep quality has been declining. Consider reducing caffeine intake and screen time before bed.");
  }

  // Phase-specific tips
  if (currentPhase === "menstrual") {
    recs.push("During menstruation, be gentle with yourself. Light creative tasks may feel easier than intense analytical work.");
  } else if (currentPhase === "follicular") {
    recs.push("Rising energy in your follicular phase is a great time for learning new skills and creative projects.");
  } else if (currentPhase === "ovulation") {
    recs.push("Around ovulation, social and verbal skills tend to peak. Great time for presentations and brainstorming.");
  } else if (currentPhase === "luteal") {
    recs.push("In the luteal phase, focus on completing tasks rather than starting new ones. Organizational work may feel more natural.");
  }

  if (recs.length === 0) {
    recs.push("Your cognitive wellness indicators look balanced. Keep up your healthy routines.");
  }

  return recs;
}

// ─── Phase Tips ──────────────────────────────────────────────────────────────

export function getPhaseBrainTip(phase: CyclePhase): string {
  switch (phase) {
    case "menstrual":
      return "Your brain benefits from rest and reflection during this phase. Focus on creative, low-pressure tasks.";
    case "follicular":
      return "Rising estrogen supports learning and memory. This is an ideal time for picking up new skills or studying.";
    case "ovulation":
      return "Peak estrogen enhances verbal fluency and social cognition. Leverage this for important conversations.";
    case "luteal":
      return "Progesterone can slow processing speed but enhances detail-oriented work. Plan for focused, methodical tasks.";
    default:
      return "Stay consistent with brain-healthy habits like hydration, movement, and quality sleep.";
  }
}

// ─── Main Function ───────────────────────────────────────────────────────────

/**
 * Calculate cognitive wellness assessment. Returns null if:
 * - User is not in perimenopause/menopause and under 40
 * - Insufficient data (< 7 days of check-ins or scans)
 */
export function calculateCognitiveWellness(
  checkIns: DailyCheckIn[],
  scans: ScanResult[],
  userProfile: Pick<UserProfile, "lifeStage" | "birthday">,
  currentPhase: CyclePhase | null,
): CognitiveAssessment | null {
  // Only activates for perimenopause/menopause users OR users > 40
  const isApplicableStage =
    userProfile.lifeStage === "perimenopause" ||
    userProfile.lifeStage === "menopause";
  const age = getAge(userProfile.birthday);
  const isAgeApplicable = age !== null && age > 40;

  if (!isApplicableStage && !isAgeApplicable) {
    return null;
  }

  // Need at least 7 days of data
  const recentCI = recentCheckIns(checkIns, 30); // 30-day window
  const recentSC = recentScans(scans, 30);

  if (recentCI.length < 7 && recentSC.length < 7) {
    return null;
  }

  // Calculate individual factors
  const memoryResult = calcMemoryFactor(recentSC);
  const focusResult = calcFocusFactor(recentSC);
  const moodResult = calcMoodFactor(recentCI);
  const sleepResult = calcSleepFactor(recentCI);

  const factors: CognitiveFactor[] = [
    {
      name: "Memory",
      nameKey: "cognitive.memory",
      score: Math.round(memoryResult.score * 10) / 10,
      icon: "Brain",
      trend: memoryResult.trend,
    },
    {
      name: "Focus",
      nameKey: "cognitive.focus",
      score: Math.round(focusResult.score * 10) / 10,
      icon: "Eye",
      trend: focusResult.trend,
    },
    {
      name: "Mood Stability",
      nameKey: "cognitive.mood",
      score: Math.round(moodResult.score * 10) / 10,
      icon: "Heart",
      trend: moodResult.trend,
    },
    {
      name: "Sleep Quality",
      nameKey: "cognitive.sleep",
      score: Math.round(sleepResult.score * 10) / 10,
      icon: "Moon",
      trend: sleepResult.trend,
    },
  ];

  // Weighted composite: memory(3), focus(2), mood(1.5), sleep(2)
  const weights = [3, 2, 1.5, 2];
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const weightedSum = factors.reduce((sum, f, i) => sum + f.score * weights[i], 0);
  const rawScore = (weightedSum / totalWeight) * 10; // scale 0-100
  const overallScore = clamp(Math.round(rawScore), 0, 100);

  // Determine category
  let category: CognitiveAssessment["category"];
  if (overallScore >= 75) {
    category = "sharp";
  } else if (overallScore >= 55) {
    category = "good";
  } else if (overallScore >= 35) {
    category = "fair";
  } else {
    category = "needs-attention";
  }

  // Build recommendations
  const recommendations = buildCognitiveRecommendations(factors, currentPhase);

  // Pick today's recommended exercises (rotate based on day of year)
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
    (24 * 60 * 60 * 1000)
  );
  const exerciseIndices = [
    dayOfYear % BRAIN_EXERCISES.length,
    (dayOfYear + 3) % BRAIN_EXERCISES.length,
  ];
  const brainExercises = exerciseIndices.map((i) => BRAIN_EXERCISES[i]);

  return {
    overallScore,
    category,
    factors,
    recommendations,
    brainExercises,
  };
}

/**
 * Get all brain exercises (for UI listing).
 */
export function getAllBrainExercises(): BrainExercise[] {
  return [...BRAIN_EXERCISES];
}

/**
 * Calculate cognitive score history over time for trend chart.
 * Returns an array of { date: string; score: number } for each day with data.
 */
export function getCognitiveScoreHistory(
  checkIns: DailyCheckIn[],
  scans: ScanResult[],
  days: number = 30,
): { date: string; score: number }[] {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const history: { date: string; score: number }[] = [];

  // Group scans by date
  const scansByDate = new Map<string, ScanResult[]>();
  for (const scan of scans) {
    if (!scan.date) continue;
    const t = new Date(scan.date).getTime();
    if (isNaN(t) || t < cutoff) continue;
    if (!scansByDate.has(scan.date)) scansByDate.set(scan.date, []);
    scansByDate.get(scan.date)!.push(scan);
  }

  // Group check-ins by date
  const checkInsByDate = new Map<string, DailyCheckIn[]>();
  for (const ci of checkIns) {
    if (!ci.date) continue;
    const t = new Date(ci.date).getTime();
    if (isNaN(t) || t < cutoff) continue;
    if (!checkInsByDate.has(ci.date)) checkInsByDate.set(ci.date, []);
    checkInsByDate.get(ci.date)!.push(ci);
  }

  // Collect all dates
  const allDates = new Set([...scansByDate.keys(), ...checkInsByDate.keys()]);
  const sortedDates = Array.from(allDates).sort();

  for (const date of sortedDates) {
    const dayScans = scansByDate.get(date) || [];
    const dayCIs = checkInsByDate.get(date) || [];

    let scoreSum = 0;
    let scoreCount = 0;

    if (dayScans.length > 0) {
      const cogValues = dayScans
        .map((s) => s.emotionalMentalState?.cognitiveSharpness)
        .filter((v): v is number => v != null && !isNaN(v));
      if (cogValues.length > 0) {
        scoreSum += safeAvg(cogValues) * 10; // scale to 0-100
        scoreCount++;
      }
    }

    if (dayCIs.length > 0) {
      const sleepVals = dayCIs
        .map((c) => c.sleep)
        .filter((v): v is number => v != null && !isNaN(v));
      const moodVals = dayCIs
        .map((c) => c.mood)
        .filter((v): v is number => v != null && !isNaN(v));
      if (sleepVals.length > 0) {
        scoreSum += safeAvg(sleepVals) * 10;
        scoreCount++;
      }
      if (moodVals.length > 0) {
        scoreSum += safeAvg(moodVals) * 10;
        scoreCount++;
      }
    }

    if (scoreCount > 0) {
      history.push({
        date,
        score: clamp(Math.round(scoreSum / scoreCount), 0, 100),
      });
    }
  }

  return history;
}

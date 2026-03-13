import logger from "@/lib/logger";
import {
  CyclePhase,
  PhaseProbabilities,
  PhaseEstimate,
  PhaseConfidence,
  DailyCheckIn,
  ScanResult,
  UserProfile,
  CycleHistory,
  PersonalBaseline,
  BleedingLevel,
  PhaseBaseline,
  CycleStatistics,
  EnrichedPhaseInfo,
} from "@/types";

function getCycleDayFromDate(lastPeriodDate: string): number {
  const lastPeriod = new Date(lastPeriodDate);
  const today = new Date();
  const daysSinceLastPeriod = Math.floor(
    (today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysSinceLastPeriod;
}

export function getNextPeriodDate(lastPeriodDate: string, cycleLength: number): Date {
  const lastPeriod = new Date(lastPeriodDate);
  const nextPeriod = new Date(lastPeriod);
  nextPeriod.setDate(lastPeriod.getDate() + cycleLength);
  return nextPeriod;
}

export function findEffectiveCycleStart(
  lastPeriodDate: string,
  checkIns: DailyCheckIn[]
): string {
  const bleedingCheckIns = checkIns.filter(
    (c) => c.bleedingLevel && c.bleedingLevel !== 'none'
  );

  if (bleedingCheckIns.length === 0) {
    return lastPeriodDate;
  }

  const sorted = [...bleedingCheckIns].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let bleedingStartDate = sorted[0].date;

  for (let i = 1; i < sorted.length; i++) {
    const prevDate = new Date(sorted[i - 1].date);
    const currDate = new Date(sorted[i].date);
    const dayDiff = Math.floor(
      (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (dayDiff <= 2) {
      bleedingStartDate = sorted[i].date;
    } else {
      break;
    }
  }

  const bleedingStart = new Date(bleedingStartDate);
  const storedStart = new Date(lastPeriodDate);

  if (bleedingStart.getTime() > storedStart.getTime()) {
    logger.log('[PhasePredictor] Using bleeding check-in as cycle start:', bleedingStartDate);
    return new Date(bleedingStartDate).toISOString();
  }

  return lastPeriodDate;
}

const PHASE_COLORS: Record<CyclePhase, string> = {
  menstrual: '#E89BA4',
  follicular: '#8BC9A3',
  ovulation: '#F4C896',
  luteal: '#B8A4E8',
};

export function getPhaseRanges(cycleLength: number): {
  menstrual: [number, number];
  follicular: [number, number];
  ovulation: [number, number];
  luteal: [number, number];
} {
  const menstrualEnd = 5;
  const ovulationCenter = Math.floor(cycleLength / 2);
  const ovulationStart = ovulationCenter - 1;
  const ovulationEnd = ovulationCenter + 1;
  const follicularEnd = ovulationStart - 1;
  const lutealStart = ovulationEnd + 1;

  return {
    menstrual: [1, menstrualEnd],
    follicular: [menstrualEnd + 1, follicularEnd],
    ovulation: [ovulationStart, ovulationEnd],
    luteal: [lutealStart, cycleLength],
  };
}

export function getPhaseForCycleDay(
  cycleDay: number,
  cycleLength: number
): CyclePhase {
  const ranges = getPhaseRanges(cycleLength);
  const dayInCycle = ((cycleDay - 1) % cycleLength) + 1;

  if (dayInCycle >= ranges.menstrual[0] && dayInCycle <= ranges.menstrual[1]) return 'menstrual';
  if (dayInCycle >= ranges.follicular[0] && dayInCycle <= ranges.follicular[1]) return 'follicular';
  if (dayInCycle >= ranges.ovulation[0] && dayInCycle <= ranges.ovulation[1]) return 'ovulation';
  return 'luteal';
}

export function computeEnrichedPhaseInfo(
  userProfile: UserProfile,
  checkIns: DailyCheckIn[],
  phaseEstimate: PhaseEstimate,
  t: any
): EnrichedPhaseInfo {
  const cycleLength = userProfile.cycleLength || 28;

  if (userProfile.lifeStage === 'pregnancy') {
    const weeksPregnant = userProfile.weeksPregnant || 0;
    let trimesterNum = 1;
    let trimesterColor = '#F4C8D4';
    if (weeksPregnant <= 13) {
      trimesterNum = 1;
      trimesterColor = '#F4C8D4';
    } else if (weeksPregnant <= 27) {
      trimesterNum = 2;
      trimesterColor = '#8BC9A3';
    } else {
      trimesterNum = 3;
      trimesterColor = '#B8A4E8';
    }
    const trimesterKey = `trimester${trimesterNum}` as 'trimester1' | 'trimester2' | 'trimester3';
    return {
      phaseName: t.phases[trimesterKey],
      phaseDay: weeksPregnant,
      cycleDay: 0,
      totalCycleDays: 40,
      phaseColor: trimesterColor,
      phaseDescription: phaseEstimate.reasoning,
      phase: phaseEstimate.mostLikely,
      lifeStageOverride: 'pregnancy',
      effectiveCycleStart: userProfile.lastPeriodDate,
    };
  }

  if (userProfile.lifeStage === 'postpartum') {
    let weeksPost = 0;
    if (userProfile.birthDate) {
      weeksPost = Math.floor((Date.now() - new Date(userProfile.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 7));
    }
    const isEarly = weeksPost <= 6;
    return {
      phaseName: isEarly ? t.phases.postpartumRecovery : t.phases.postpartumHealing,
      phaseDay: weeksPost,
      cycleDay: 0,
      totalCycleDays: 0,
      phaseColor: isEarly ? '#E89BA4' : '#F4C896',
      phaseDescription: phaseEstimate.reasoning,
      phase: phaseEstimate.mostLikely,
      lifeStageOverride: 'postpartum',
      effectiveCycleStart: userProfile.lastPeriodDate,
    };
  }

  if (userProfile.lifeStage === 'perimenopause' || userProfile.lifeStage === 'menopause') {
    const effectiveStart = findEffectiveCycleStart(userProfile.lastPeriodDate, checkIns);
    const daysSinceStart = Math.max(1, Math.floor(
      (new Date().getTime() - new Date(effectiveStart).getTime()) / (1000 * 60 * 60 * 24)
    ) + 1);
    const currentPhase = getPhaseForCycleDay(daysSinceStart, cycleLength);
    const ranges = getPhaseRanges(cycleLength);
    const dayInCycle = ((daysSinceStart - 1) % cycleLength) + 1;
    const phaseRange = ranges[currentPhase];
    const phaseDay = dayInCycle - phaseRange[0] + 1;

    return {
      phaseName: userProfile.lifeStage === 'perimenopause'
        ? t.phases.perimenopauseTransition
        : t.phases.menopause,
      phaseDay,
      cycleDay: dayInCycle,
      totalCycleDays: cycleLength,
      phaseColor: userProfile.lifeStage === 'perimenopause' ? '#F4C896' : '#B8A4E8',
      phaseDescription: phaseEstimate.reasoning,
      phase: currentPhase,
      lifeStageOverride: userProfile.lifeStage as 'perimenopause' | 'menopause',
      effectiveCycleStart: effectiveStart,
    };
  }

  const effectiveStart = findEffectiveCycleStart(userProfile.lastPeriodDate, checkIns);
  const daysSinceStart = Math.max(1, Math.floor(
    (new Date().getTime() - new Date(effectiveStart).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1);

  const isOverdue = daysSinceStart > cycleLength;
  const dayInCycle = isOverdue ? cycleLength : daysSinceStart;

  const currentPhase = isOverdue ? 'luteal' as CyclePhase : phaseEstimate.mostLikely;
  const ranges = getPhaseRanges(cycleLength);
  const phaseRange = ranges[currentPhase];
  const phaseDay = Math.max(1, dayInCycle - phaseRange[0] + 1);

  const ovulationRange = ranges.ovulation;
  const fertileWindowStart = ovulationRange[0] - 3;
  const fertileWindowEnd = ovulationRange[1] + 1;
  const isFertile = !isOverdue && dayInCycle >= fertileWindowStart && dayInCycle <= fertileWindowEnd;

  logger.log(`[PhasePredictor] daysSinceStart=${daysSinceStart}, cycleLength=${cycleLength}, isOverdue=${isOverdue}, dayInCycle=${dayInCycle}, phase=${currentPhase}`);

  return {
    phaseName: t.phases[currentPhase],
    phaseDay,
    cycleDay: dayInCycle,
    totalCycleDays: cycleLength,
    phaseColor: PHASE_COLORS[currentPhase],
    phaseDescription: phaseEstimate.reasoning,
    phase: currentPhase,
    fertileWindow: isFertile,
    isOverdue,
    effectiveCycleStart: effectiveStart,
  };
}

export function calculateCycleStatistics(
  cycleHistory: CycleHistory[]
): CycleStatistics {
  const completedCycles = cycleHistory.filter((c) => c.lengthDays && c.lengthDays > 0);
  const cyclesWithLuteal = cycleHistory.filter((c) => c.lutealLengthDays && c.lutealLengthDays > 0);

  const avgCycleLength = completedCycles.length > 0
    ? completedCycles.reduce((sum, c) => sum + (c.lengthDays || 0), 0) / completedCycles.length
    : 28;

  const avgLutealLength = cyclesWithLuteal.length > 0
    ? cyclesWithLuteal.reduce((sum, c) => sum + (c.lutealLengthDays || 0), 0) / cyclesWithLuteal.length
    : 14;

  const avgFollicularLength = avgCycleLength - avgLutealLength;

  const cycleVariability = completedCycles.length > 1
    ? Math.sqrt(
        completedCycles.reduce(
          (sum, c) => sum + Math.pow((c.lengthDays || 0) - avgCycleLength, 2),
          0
        ) / completedCycles.length
      )
    : 0;

  const lutealVariability = cyclesWithLuteal.length > 1
    ? Math.sqrt(
        cyclesWithLuteal.reduce(
          (sum, c) => sum + Math.pow((c.lutealLengthDays || 0) - avgLutealLength, 2),
          0
        ) / cyclesWithLuteal.length
      )
    : 0;

  return {
    avgCycleLength,
    avgLutealLength,
    avgFollicularLength,
    cycleVariability,
    lutealVariability,
  };
}

function getTimingPrior(
  cycleDay: number,
  cycleLength: number,
  cycleHistory: CycleHistory[],
  previousPhase: CyclePhase | null
): PhaseProbabilities {
  const stats = calculateCycleStatistics(cycleHistory);
  const effectiveCycleLength = cycleHistory.length > 0 ? stats.avgCycleLength : cycleLength;
  const lutealLength = stats.avgLutealLength;
  
  let dayInCycle = cycleDay;
  if (cycleDay > effectiveCycleLength * 2) {
    dayInCycle = ((cycleDay - 1) % Math.ceil(effectiveCycleLength)) + 1;
  }

  const menstrualEnd = 5;
  const follicularEnd = Math.floor(effectiveCycleLength - lutealLength - 3);
  const ovulationEnd = follicularEnd + 3;

  const probs: PhaseProbabilities = {
    menstrual: 0,
    follicular: 0,
    ovulation: 0,
    luteal: 0,
  };

  if (dayInCycle <= menstrualEnd) {
    probs.menstrual = 0.9;
    probs.follicular = 0.08;
    probs.ovulation = 0.01;
    probs.luteal = 0.01;
  } else if (dayInCycle <= follicularEnd) {
    probs.menstrual = 0.01;
    probs.follicular = 0.9;
    probs.ovulation = 0.08;
    probs.luteal = 0.01;
  } else if (dayInCycle <= ovulationEnd) {
    probs.menstrual = 0.01;
    probs.follicular = 0.08;
    probs.ovulation = 0.85;
    probs.luteal = 0.06;
  } else {
    probs.menstrual = 0.01;
    probs.follicular = 0.01;
    probs.ovulation = 0.03;
    probs.luteal = 0.95;
  }

  if (previousPhase) {
    return applyStateTransitionConstraints(probs, previousPhase);
  }

  return probs;
}

function applyStateTransitionConstraints(
  probs: PhaseProbabilities,
  previousPhase: CyclePhase
): PhaseProbabilities {
  const transitionMatrix: Record<CyclePhase, PhaseProbabilities> = {
    menstrual: { menstrual: 0.7, follicular: 0.3, ovulation: 0.0, luteal: 0.0 },
    follicular: { menstrual: 0.0, follicular: 0.7, ovulation: 0.3, luteal: 0.0 },
    ovulation: { menstrual: 0.0, follicular: 0.0, ovulation: 0.6, luteal: 0.4 },
    luteal: { menstrual: 0.2, follicular: 0.0, ovulation: 0.0, luteal: 0.8 },
  };

  const constraints = transitionMatrix[previousPhase];
  const result: PhaseProbabilities = {
    menstrual: probs.menstrual * constraints.menstrual,
    follicular: probs.follicular * constraints.follicular,
    ovulation: probs.ovulation * constraints.ovulation,
    luteal: probs.luteal * constraints.luteal,
  };

  const sum = result.menstrual + result.follicular + result.ovulation + result.luteal;
  if (sum === 0) return probs;

  return {
    menstrual: result.menstrual / sum,
    follicular: result.follicular / sum,
    ovulation: result.ovulation / sum,
    luteal: result.luteal / sum,
  };
}

function getBleedingEvidence(bleedingLevel: BleedingLevel): PhaseProbabilities {
  switch (bleedingLevel) {
    case "heavy":
    case "medium":
      return { menstrual: 0.95, follicular: 0.03, ovulation: 0.01, luteal: 0.01 };
    case "light":
      return { menstrual: 0.7, follicular: 0.2, ovulation: 0.05, luteal: 0.05 };
    case "spotting":
      return { menstrual: 0.4, follicular: 0.2, ovulation: 0.15, luteal: 0.25 };
    case "none":
      return { menstrual: 0.05, follicular: 0.35, ovulation: 0.25, luteal: 0.35 };
  }
}

function getSymptomEvidence(symptoms: string[]): PhaseProbabilities {
  const menstrualSymptoms = ["Cramps", "Back Pain", "Headache"];
  const ovulationSymptoms = ["Breast Tenderness"];
  const lutealSymptoms = ["Bloating", "Mood Swings", "Acne", "Breast Tenderness"];

  let menstrualScore = 0;
  let ovulationScore = 0;
  let lutealScore = 0;

  symptoms.forEach((symptom) => {
    if (menstrualSymptoms.includes(symptom)) menstrualScore += 1;
    if (ovulationSymptoms.includes(symptom)) ovulationScore += 1;
    if (lutealSymptoms.includes(symptom)) lutealScore += 1;
  });

  const total = menstrualScore + ovulationScore + lutealScore + 4;

  return {
    menstrual: (menstrualScore + 1) / total,
    follicular: 1 / total,
    ovulation: (ovulationScore + 1) / total,
    luteal: (lutealScore + 1) / total,
  };
}

function getCervicalMucusEvidence(
  mucus: "dry" | "sticky" | "creamy" | "egg_white"
): PhaseProbabilities {
  switch (mucus) {
    case "dry":
      return { menstrual: 0.3, follicular: 0.2, ovulation: 0.05, luteal: 0.45 };
    case "sticky":
      return { menstrual: 0.2, follicular: 0.45, ovulation: 0.15, luteal: 0.2 };
    case "creamy":
      return { menstrual: 0.1, follicular: 0.3, ovulation: 0.4, luteal: 0.2 };
    case "egg_white":
      return { menstrual: 0.05, follicular: 0.15, ovulation: 0.7, luteal: 0.1 };
  }
}

function getScanEvidence(
  scan: ScanResult,
  phaseBaselines: PhaseBaseline | null,
  globalBaseline: PersonalBaseline | null,
  currentPhaseEstimate: CyclePhase,
  confounders: {
    sleepQuality: number;
    stressLevel: number;
    hadCaffeine: boolean;
    isIll: boolean;
  }
): { evidence: PhaseProbabilities; confidence: number } {
  let confidence = 1.0;

  if (confounders.sleepQuality < 5) confidence *= 0.7;
  if (confounders.stressLevel > 7) confidence *= 0.6;
  if (confounders.hadCaffeine) confidence *= 0.85;
  if (confounders.isIll) confidence *= 0.4;

  const hasPhaseBaselines = phaseBaselines && 
    phaseBaselines.menstrual && phaseBaselines.follicular && 
    phaseBaselines.ovulation && phaseBaselines.luteal;

  if (!hasPhaseBaselines && (!globalBaseline || globalBaseline.samplesCount < 3)) {
    confidence *= 0.5;
  }

  const signals = scan.rawOpticalSignals;
  const physio = scan.physiologicalStates;

  let menstrualScore = 0;
  let follicularScore = 0;
  let ovulationScore = 0;
  let lutealScore = 0;

  if (hasPhaseBaselines) {
    const phases: { phase: CyclePhase; baseline: PersonalBaseline }[] = [
      { phase: "menstrual", baseline: phaseBaselines.menstrual! },
      { phase: "follicular", baseline: phaseBaselines.follicular! },
      { phase: "ovulation", baseline: phaseBaselines.ovulation! },
      { phase: "luteal", baseline: phaseBaselines.luteal! },
    ];

    phases.forEach(({ phase, baseline }) => {
      if (baseline.samplesCount >= 2) {
        const pupilDelta = Math.abs(signals.pupilDiameter - baseline.pupilDiameter) / baseline.pupilDiameter;
        const latencyDelta = Math.abs(signals.pupilLatency - baseline.pupilLatency) / baseline.pupilLatency;
        const blinkDelta = Math.abs(signals.blinkFrequency - baseline.blinkFrequency) / baseline.blinkFrequency;

        const similarity = 1 / (1 + pupilDelta + latencyDelta + blinkDelta);

        if (phase === "menstrual") menstrualScore += similarity * 0.3;
        if (phase === "follicular") follicularScore += similarity * 0.3;
        if (phase === "ovulation") ovulationScore += similarity * 0.3;
        if (phase === "luteal") lutealScore += similarity * 0.3;
      }
    });
  } else if (globalBaseline && globalBaseline.samplesCount >= 3) {
    const pupilDelta = (signals.pupilDiameter - globalBaseline.pupilDiameter) / globalBaseline.pupilDiameter;
    const latencyDelta = (signals.pupilLatency - globalBaseline.pupilLatency) / globalBaseline.pupilLatency;

    if (pupilDelta < -0.05) lutealScore += 0.2;
    if (pupilDelta > 0.05) follicularScore += 0.2;

    if (latencyDelta > 0.1) lutealScore += 0.15;
    if (latencyDelta < -0.05) ovulationScore += 0.1;
  }

  if (physio.energyLevel > 7) {
    follicularScore += 0.2;
    ovulationScore += 0.15;
  } else if (physio.energyLevel < 4) {
    menstrualScore += 0.2;
    lutealScore += 0.15;
  }

  if (physio.fatigueLoad > 7) {
    menstrualScore += 0.15;
    lutealScore += 0.15;
  }

  if (scan.stressScore > 7) {
    lutealScore += 0.1;
  }

  const total = menstrualScore + follicularScore + ovulationScore + lutealScore + 1;

  return {
    evidence: {
      menstrual: (menstrualScore + 0.25) / total,
      follicular: (follicularScore + 0.25) / total,
      ovulation: (ovulationScore + 0.25) / total,
      luteal: (lutealScore + 0.25) / total,
    },
    confidence,
  };
}

function multiplyProbabilities(
  probs: PhaseProbabilities[]
): PhaseProbabilities {
  const result: PhaseProbabilities = {
    menstrual: 1,
    follicular: 1,
    ovulation: 1,
    luteal: 1,
  };

  probs.forEach((prob) => {
    result.menstrual *= prob.menstrual;
    result.follicular *= prob.follicular;
    result.ovulation *= prob.ovulation;
    result.luteal *= prob.luteal;
  });

  const sum =
    result.menstrual + result.follicular + result.ovulation + result.luteal;

  return {
    menstrual: result.menstrual / sum,
    follicular: result.follicular / sum,
    ovulation: result.ovulation / sum,
    luteal: result.luteal / sum,
  };
}

function getConfidence(probs: PhaseProbabilities): PhaseConfidence {
  const maxProb = Math.max(
    probs.menstrual,
    probs.follicular,
    probs.ovulation,
    probs.luteal
  );

  if (maxProb > 0.7) return "high";
  if (maxProb > 0.5) return "medium";
  return "low";
}

function getMostLikelyPhase(probs: PhaseProbabilities): CyclePhase {
  const phases: CyclePhase[] = ["menstrual", "follicular", "ovulation", "luteal"];
  return phases.reduce((max, phase) =>
    probs[phase] > probs[max] ? phase : max
  );
}

export function predictPhase(
  userProfile: UserProfile,
  todayCheckIn: DailyCheckIn | null,
  latestScan: ScanResult | null,
  cycleHistory: CycleHistory[],
  baseline: PersonalBaseline | null,
  phaseBaselines: PhaseBaseline | null,
  previousPhase: CyclePhase | null
): PhaseEstimate {
  if (userProfile.birthControl !== "none" && userProfile.birthControl !== "iud_copper") {
    return {
      mostLikely: "follicular",
      probabilities: {
        menstrual: 0.25,
        follicular: 0.25,
        ovulation: 0.25,
        luteal: 0.25,
      },
      confidence: "low",
      reasoning: "Hormonal birth control affects natural cycle phases. Track symptoms and mood patterns instead.",
    };
  }

  if (userProfile.lifeStage === "pregnancy") {
    const weeksPregnant = userProfile.weeksPregnant || 0;
    let trimesterPhase: CyclePhase = "follicular";
    let reasoning = "Pregnancy";
    if (weeksPregnant <= 13) {
      trimesterPhase = "follicular";
      reasoning = `1st trimester (week ${weeksPregnant})`;
    } else if (weeksPregnant <= 27) {
      trimesterPhase = "ovulation";
      reasoning = `2nd trimester (week ${weeksPregnant})`;
    } else {
      trimesterPhase = "luteal";
      reasoning = `3rd trimester (week ${weeksPregnant})`;
    }
    return {
      mostLikely: trimesterPhase,
      probabilities: { menstrual: 0, follicular: 0, ovulation: 0, luteal: 0, [trimesterPhase]: 1 } as PhaseProbabilities,
      confidence: "high",
      reasoning,
      lifeStageOverride: "pregnancy" as const,
    };
  }

  if (userProfile.lifeStage === "postpartum") {
    let weeksPostpartum = 0;
    if (userProfile.birthDate) {
      const birthDate = new Date(userProfile.birthDate);
      weeksPostpartum = Math.floor((Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
    }
    const isEarlyRecovery = weeksPostpartum <= 6;
    return {
      mostLikely: isEarlyRecovery ? "menstrual" : "follicular",
      probabilities: { menstrual: 0.25, follicular: 0.25, ovulation: 0.25, luteal: 0.25 },
      confidence: "medium",
      reasoning: isEarlyRecovery
        ? `Early postpartum recovery (week ${weeksPostpartum})`
        : `Postpartum healing (week ${weeksPostpartum})`,
      lifeStageOverride: "postpartum" as const,
    };
  }

  if (userProfile.lifeStage === "perimenopause" || userProfile.lifeStage === "menopause") {
    return {
      mostLikely: "follicular",
      probabilities: { menstrual: 0.25, follicular: 0.25, ovulation: 0.25, luteal: 0.25 },
      confidence: "low",
      reasoning: userProfile.lifeStage === "perimenopause"
        ? "Perimenopause transition — cycle phases may be irregular"
        : "Post-menopause — traditional cycle phases don't apply",
      lifeStageOverride: userProfile.lifeStage as "perimenopause" | "menopause",
    };
  }

  const cycleDay = getCycleDayFromDate(userProfile.lastPeriodDate);
  const _effectiveCycleDay = Math.max(1, cycleDay);
  const evidences: PhaseProbabilities[] = [];
  let evidenceWeights: number[] = [];
  const reasoningParts: string[] = [];

  const timingPrior = getTimingPrior(
    cycleDay,
    userProfile.cycleLength,
    cycleHistory,
    previousPhase
  );
  evidences.push(timingPrior);
  evidenceWeights.push(3.5);
  reasoningParts.push(`Day ${cycleDay} of cycle`);

  if (todayCheckIn?.bleedingLevel) {
    const bleedingEvidence = getBleedingEvidence(todayCheckIn.bleedingLevel);
    evidences.push(bleedingEvidence);
    evidenceWeights.push(5.0);
    reasoningParts.push(`Bleeding: ${todayCheckIn.bleedingLevel}`);
  }

  if (todayCheckIn?.symptoms && todayCheckIn.symptoms.length > 0) {
    const symptomEvidence = getSymptomEvidence(todayCheckIn.symptoms);
    evidences.push(symptomEvidence);
    evidenceWeights.push(1.5);
    reasoningParts.push(`Symptoms: ${todayCheckIn.symptoms.join(", ")}`);
  }

  if (todayCheckIn?.cervicalMucus) {
    const mucusEvidence = getCervicalMucusEvidence(todayCheckIn.cervicalMucus);
    evidences.push(mucusEvidence);
    evidenceWeights.push(3.0);
    reasoningParts.push(`Cervical mucus: ${todayCheckIn.cervicalMucus}`);
  }

  if (todayCheckIn?.ovulationPain) {
    evidences.push({
      menstrual: 0.05,
      follicular: 0.15,
      ovulation: 0.65,
      luteal: 0.15,
    });
    evidenceWeights.push(2.5);
    reasoningParts.push("Ovulation pain detected");
  }

  if (latestScan && todayCheckIn) {
    const confounders = {
      sleepQuality: todayCheckIn.sleep || 7,
      stressLevel: todayCheckIn.stressLevel || 5,
      hadCaffeine: todayCheckIn.hadCaffeine || false,
      isIll: todayCheckIn.isIll || false,
    };

    const { evidence: scanEvidence, confidence: scanConfidence } = getScanEvidence(
      latestScan,
      phaseBaselines,
      baseline,
      previousPhase || "follicular",
      confounders
    );

    evidences.push(scanEvidence);
    evidenceWeights.push(2.0 * scanConfidence);
    reasoningParts.push(`Eye scan data (${Math.round(scanConfidence * 100)}% confidence)`);
  }

  const weightedEvidences = evidences.map((ev, idx) => {
    const weight = evidenceWeights[idx];
    return {
      menstrual: Math.pow(ev.menstrual, weight),
      follicular: Math.pow(ev.follicular, weight),
      ovulation: Math.pow(ev.ovulation, weight),
      luteal: Math.pow(ev.luteal, weight),
    };
  });

  const combinedProbs = multiplyProbabilities(weightedEvidences);
  const confidence = getConfidence(combinedProbs);
  const mostLikely = getMostLikelyPhase(combinedProbs);

  return {
    mostLikely,
    probabilities: combinedProbs,
    confidence,
    reasoning: reasoningParts.join(" • "),
  };
}

export function updatePersonalBaseline(
  currentBaseline: PersonalBaseline | null,
  newScan: ScanResult,
  isConfounded: boolean
): PersonalBaseline {
  if (isConfounded && currentBaseline) {
    return currentBaseline;
  }

  const signals = newScan.rawOpticalSignals;

  if (!currentBaseline || currentBaseline.samplesCount === 0) {
    return {
      pupilDiameter: signals.pupilDiameter,
      pupilContractionSpeed: signals.pupilContractionSpeed,
      pupilLatency: signals.pupilLatency,
      blinkFrequency: signals.blinkFrequency,
      microSaccadeFrequency: signals.microSaccadeFrequency,
      samplesCount: 1,
    };
  }

  const alpha = 0.2;
  const count = currentBaseline.samplesCount;

  return {
    pupilDiameter:
      currentBaseline.pupilDiameter * (1 - alpha) + signals.pupilDiameter * alpha,
    pupilContractionSpeed:
      currentBaseline.pupilContractionSpeed * (1 - alpha) +
      signals.pupilContractionSpeed * alpha,
    pupilLatency:
      currentBaseline.pupilLatency * (1 - alpha) + signals.pupilLatency * alpha,
    blinkFrequency:
      currentBaseline.blinkFrequency * (1 - alpha) + signals.blinkFrequency * alpha,
    microSaccadeFrequency:
      currentBaseline.microSaccadeFrequency * (1 - alpha) +
      signals.microSaccadeFrequency * alpha,
    samplesCount: count + 1,
  };
}

export function updatePhaseBaselines(
  currentBaselines: PhaseBaseline | null,
  newScan: ScanResult,
  currentPhase: CyclePhase,
  isConfounded: boolean
): PhaseBaseline {
  const emptyBaseline: PhaseBaseline = {
    menstrual: null,
    follicular: null,
    ovulation: null,
    luteal: null,
  };

  if (isConfounded) {
    return currentBaselines || emptyBaseline;
  }

  const baselines = currentBaselines || emptyBaseline;
  const currentPhaseBaseline = baselines[currentPhase];

  const updatedPhaseBaseline = updatePersonalBaseline(
    currentPhaseBaseline,
    newScan,
    false
  );

  return {
    ...baselines,
    [currentPhase]: updatedPhaseBaseline,
  };
}

export function shouldAskAdaptiveQuestion(
  phaseEstimate: PhaseEstimate,
  todayCheckIn: DailyCheckIn | null,
  cycleDay: number
): { shouldAsk: boolean; questionType: string | null } {
  if (phaseEstimate.confidence === "high") {
    return { shouldAsk: false, questionType: null };
  }

  if (!todayCheckIn?.bleedingLevel && cycleDay <= 7) {
    return { shouldAsk: true, questionType: "bleeding" };
  }

  if (!todayCheckIn?.cervicalMucus && cycleDay >= 10 && cycleDay <= 18) {
    return { shouldAsk: true, questionType: "cervicalMucus" };
  }

  if (!todayCheckIn?.ovulationPain && cycleDay >= 12 && cycleDay <= 16) {
    return { shouldAsk: true, questionType: "ovulationPain" };
  }

  return { shouldAsk: false, questionType: null };
}

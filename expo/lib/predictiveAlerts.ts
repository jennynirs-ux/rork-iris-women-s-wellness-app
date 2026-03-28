import { ScanResult, DailyCheckIn, CycleHistory, CyclePhase } from '@/types';

export interface PredictiveAlert {
  id: string;
  icon: string;          // Lucide icon name
  title: string;
  message: string;
  severity: 'info' | 'heads-up' | 'action';
  daysUntil: number;     // how many days until predicted event
  confidence: number;    // 0-1
}

// Minimum number of cycles required to generate predictions
const MIN_CYCLES = 2;

/**
 * Determine what cycle day a given date falls on,
 * relative to the most recent cycle start.
 */
function getCycleDayForDate(date: string, cycleHistory: CycleHistory[]): number | null {
  if (cycleHistory.length === 0) return null;
  const sorted = [...cycleHistory].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
  for (const cycle of sorted) {
    const start = new Date(cycle.startDate).getTime();
    const target = new Date(date).getTime();
    if (target >= start) {
      return Math.floor((target - start) / (24 * 60 * 60 * 1000)) + 1;
    }
  }
  return null;
}

/**
 * Get the phase for a given cycle day.
 */
function getPhaseForDay(cycleDay: number, cycleLength: number): CyclePhase {
  if (cycleDay <= 5) return 'menstrual';
  if (cycleDay <= Math.floor(cycleLength * 0.5)) return 'follicular';
  if (cycleDay <= Math.floor(cycleLength * 0.5) + 3) return 'ovulation';
  return 'luteal';
}

/**
 * Compute the average of an array of numbers, returning 0 for empty arrays.
 */
function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Map check-ins to their cycle day for pattern analysis across multiple cycles.
 */
function mapCheckInsToCycleDays(
  checkIns: DailyCheckIn[],
  cycleHistory: CycleHistory[]
): Map<number, DailyCheckIn[]> {
  const map = new Map<number, DailyCheckIn[]>();
  for (const ci of checkIns) {
    const day = getCycleDayForDate(ci.date, cycleHistory);
    if (day !== null && day >= 1 && day <= 60) {
      const existing = map.get(day) || [];
      existing.push(ci);
      map.set(day, existing);
    }
  }
  return map;
}

/**
 * Map scans to their cycle day for pattern analysis across multiple cycles.
 */
function mapScansToCycleDays(
  scans: ScanResult[],
  cycleHistory: CycleHistory[]
): Map<number, ScanResult[]> {
  const map = new Map<number, ScanResult[]>();
  for (const scan of scans) {
    const day = getCycleDayForDate(scan.date, cycleHistory);
    if (day !== null && day >= 1 && day <= 60) {
      const existing = map.get(day) || [];
      existing.push(scan);
      map.set(day, existing);
    }
  }
  return map;
}

/**
 * Check if energy consistently drops in a specific day range across multiple cycles.
 * Returns the average drop magnitude if found, or null.
 */
function detectEnergyDipPattern(
  checkInsByDay: Map<number, DailyCheckIn[]>,
  scansByDay: Map<number, ScanResult[]>,
  cycleLength: number
): { startDay: number; endDay: number; magnitude: number } | null {
  // Check luteal phase days for energy dips
  const lutealStart = Math.floor(cycleLength * 0.5) + 4;
  const lutealEnd = cycleLength;

  // Get baseline energy from follicular phase
  const follicularDays: number[] = [];
  for (let d = 6; d <= Math.floor(cycleLength * 0.5); d++) {
    const dayCheckIns = checkInsByDay.get(d) || [];
    const dayScans = scansByDay.get(d) || [];
    for (const ci of dayCheckIns) follicularDays.push(ci.energy);
    for (const s of dayScans) follicularDays.push(s.energyScore);
  }
  const baselineEnergy = avg(follicularDays);
  if (baselineEnergy === 0) return null;

  // Find the window with the most consistent energy dip
  let bestDip: { startDay: number; endDay: number; magnitude: number } | null = null;
  for (let start = lutealStart; start <= lutealEnd - 2; start++) {
    const windowEnergies: number[] = [];
    for (let d = start; d <= Math.min(start + 3, lutealEnd); d++) {
      const dayCheckIns = checkInsByDay.get(d) || [];
      const dayScans = scansByDay.get(d) || [];
      for (const ci of dayCheckIns) windowEnergies.push(ci.energy);
      for (const s of dayScans) windowEnergies.push(s.energyScore);
    }
    if (windowEnergies.length >= MIN_CYCLES) {
      const windowAvg = avg(windowEnergies);
      const dip = baselineEnergy - windowAvg;
      if (dip > 1.5 && (!bestDip || dip > bestDip.magnitude)) {
        bestDip = { startDay: start, endDay: Math.min(start + 3, lutealEnd), magnitude: dip };
      }
    }
  }
  return bestDip;
}

/**
 * Check if stress/mood patterns rise in luteal phase consistently.
 */
function detectPMSPattern(
  checkInsByDay: Map<number, DailyCheckIn[]>,
  scansByDay: Map<number, ScanResult[]>,
  cycleLength: number
): boolean {
  const lutealStart = Math.floor(cycleLength * 0.5) + 4;
  const lutealEnd = cycleLength;

  // Get baseline stress from follicular phase
  const follicularStress: number[] = [];
  for (let d = 6; d <= Math.floor(cycleLength * 0.5); d++) {
    const dayScans = scansByDay.get(d) || [];
    for (const s of dayScans) follicularStress.push(s.stressScore);
  }
  const baselineStress = avg(follicularStress);

  // Get luteal stress
  const lutealStress: number[] = [];
  const lutealMood: number[] = [];
  for (let d = lutealStart; d <= lutealEnd; d++) {
    const dayScans = scansByDay.get(d) || [];
    const dayCheckIns = checkInsByDay.get(d) || [];
    for (const s of dayScans) lutealStress.push(s.stressScore);
    for (const ci of dayCheckIns) lutealMood.push(ci.mood);
  }

  if (lutealStress.length < MIN_CYCLES && lutealMood.length < MIN_CYCLES) return false;

  const avgLutealStress = avg(lutealStress);
  const avgLutealMood = avg(lutealMood);

  // PMS pattern if luteal stress is significantly higher or mood is low
  return (avgLutealStress - baselineStress > 1.5) || (avgLutealMood < 4);
}

/**
 * Check if sleep drops in a specific phase consistently.
 */
function detectSleepDisruptionPattern(
  checkInsByDay: Map<number, DailyCheckIn[]>,
  cycleLength: number
): { phase: CyclePhase; avgSleep: number } | null {
  const phases: { name: CyclePhase; start: number; end: number }[] = [
    { name: 'menstrual', start: 1, end: 5 },
    { name: 'follicular', start: 6, end: Math.floor(cycleLength * 0.5) },
    { name: 'ovulation', start: Math.floor(cycleLength * 0.5) + 1, end: Math.floor(cycleLength * 0.5) + 3 },
    { name: 'luteal', start: Math.floor(cycleLength * 0.5) + 4, end: cycleLength },
  ];

  const phaseSleep: Record<string, number[]> = {};
  for (const phase of phases) {
    phaseSleep[phase.name] = [];
    for (let d = phase.start; d <= phase.end; d++) {
      const dayCheckIns = checkInsByDay.get(d) || [];
      for (const ci of dayCheckIns) phaseSleep[phase.name].push(ci.sleep);
    }
  }

  const allSleep = Object.values(phaseSleep).flat();
  if (allSleep.length < MIN_CYCLES * 2) return null;

  const overallAvg = avg(allSleep);
  let worstPhase: { phase: CyclePhase; avgSleep: number } | null = null;

  for (const phase of phases) {
    const sleepValues = phaseSleep[phase.name];
    if (sleepValues.length >= MIN_CYCLES) {
      const phaseAvg = avg(sleepValues);
      if (overallAvg - phaseAvg > 1.5) {
        if (!worstPhase || phaseAvg < worstPhase.avgSleep) {
          worstPhase = { phase: phase.name, avgSleep: phaseAvg };
        }
      }
    }
  }

  return worstPhase;
}

/**
 * Check if energy peaks in follicular/ovulation phase consistently.
 */
function detectPeakEnergyPattern(
  checkInsByDay: Map<number, DailyCheckIn[]>,
  scansByDay: Map<number, ScanResult[]>,
  cycleLength: number
): { startDay: number; peakEnergy: number } | null {
  const follicularStart = 6;
  const ovulationEnd = Math.floor(cycleLength * 0.5) + 3;

  const peakEnergies: number[] = [];
  let peakDay = follicularStart;
  let highestAvg = 0;

  for (let d = follicularStart; d <= ovulationEnd; d++) {
    const dayCheckIns = checkInsByDay.get(d) || [];
    const dayScans = scansByDay.get(d) || [];
    const energies: number[] = [];
    for (const ci of dayCheckIns) energies.push(ci.energy);
    for (const s of dayScans) energies.push(s.energyScore);

    if (energies.length >= MIN_CYCLES) {
      const dayAvg = avg(energies);
      peakEnergies.push(dayAvg);
      if (dayAvg > highestAvg) {
        highestAvg = dayAvg;
        peakDay = d;
      }
    }
  }

  if (peakEnergies.length === 0 || highestAvg < 6) return null;
  return { startDay: peakDay, peakEnergy: highestAvg };
}

/**
 * Check if hydration consistently drops mid-cycle.
 */
function detectHydrationDipPattern(
  scansByDay: Map<number, ScanResult[]>,
  cycleLength: number
): { startDay: number; endDay: number } | null {
  const midStart = Math.floor(cycleLength * 0.35);
  const midEnd = Math.floor(cycleLength * 0.65);

  // Baseline from early follicular
  const earlyHydration: number[] = [];
  for (let d = 6; d <= Math.floor(cycleLength * 0.3); d++) {
    const dayScans = scansByDay.get(d) || [];
    for (const s of dayScans) earlyHydration.push(s.hydrationLevel);
  }
  const baselineHydration = avg(earlyHydration);
  if (baselineHydration === 0) return null;

  // Mid-cycle hydration
  const midHydration: number[] = [];
  for (let d = midStart; d <= midEnd; d++) {
    const dayScans = scansByDay.get(d) || [];
    for (const s of dayScans) midHydration.push(s.hydrationLevel);
  }

  if (midHydration.length < MIN_CYCLES) return null;
  const midAvg = avg(midHydration);

  if (baselineHydration - midAvg > 1.0) {
    return { startDay: midStart, endDay: midEnd };
  }
  return null;
}

export function generatePredictiveAlerts(
  scans: ScanResult[],
  checkIns: DailyCheckIn[],
  cycleHistory: CycleHistory[],
  currentPhase: CyclePhase,
  cycleDay: number,
  cycleLength: number,
): PredictiveAlert[] {
  // Need at least 2 cycles of data
  if (cycleHistory.length < MIN_CYCLES) return [];
  if (scans.length === 0 && checkIns.length === 0) return [];
  if (!cycleLength || cycleLength < 15 || cycleLength > 60) return [];

  const alerts: PredictiveAlert[] = [];

  const checkInsByDay = mapCheckInsToCycleDays(checkIns, cycleHistory);
  const scansByDay = mapScansToCycleDays(scans, cycleHistory);

  // 1. Energy Dip Forecast
  const energyDip = detectEnergyDipPattern(checkInsByDay, scansByDay, cycleLength);
  if (energyDip) {
    const daysUntil = energyDip.startDay - cycleDay;
    if (daysUntil > 0 && daysUntil <= 5) {
      alerts.push({
        id: 'energy-dip-forecast',
        icon: 'BatteryLow',
        title: 'Energy Dip Coming',
        message: `Your energy typically dips in ${daysUntil} day${daysUntil > 1 ? 's' : ''} -- plan lighter activities and prioritize rest.`,
        severity: 'heads-up',
        daysUntil,
        confidence: Math.min(0.9, 0.5 + (energyDip.magnitude / 10)),
      });
    }
  }

  // 2. PMS Forecast
  const hasPMS = detectPMSPattern(checkInsByDay, scansByDay, cycleLength);
  if (hasPMS) {
    const lutealStart = Math.floor(cycleLength * 0.5) + 4;
    const daysUntilLuteal = lutealStart - cycleDay;
    if (daysUntilLuteal > 0 && daysUntilLuteal <= 5) {
      alerts.push({
        id: 'pms-forecast',
        icon: 'Heart',
        title: 'PMS Window Approaching',
        message: `Based on your patterns, PMS-related changes may begin in ${daysUntilLuteal} day${daysUntilLuteal > 1 ? 's' : ''}. Stock up on comfort foods and plan for extra rest.`,
        severity: 'action',
        daysUntil: daysUntilLuteal,
        confidence: 0.7,
      });
    }
  }

  // 3. Period Forecast
  const daysUntilPeriod = cycleLength - cycleDay + 1;
  if (daysUntilPeriod > 0 && daysUntilPeriod <= 5 && currentPhase === 'luteal') {
    alerts.push({
      id: 'period-forecast',
      icon: 'Moon',
      title: 'Period Expected Soon',
      message: `Period expected in about ${daysUntilPeriod} day${daysUntilPeriod > 1 ? 's' : ''} -- prepare your essentials.`,
      severity: 'action',
      daysUntil: daysUntilPeriod,
      confidence: cycleHistory.length >= 3 ? 0.8 : 0.6,
    });
  }

  // 4. Sleep Disruption
  const sleepDisruption = detectSleepDisruptionPattern(checkInsByDay, cycleLength);
  if (sleepDisruption) {
    const phaseStarts: Record<CyclePhase, number> = {
      menstrual: 1,
      follicular: 6,
      ovulation: Math.floor(cycleLength * 0.5) + 1,
      luteal: Math.floor(cycleLength * 0.5) + 4,
    };
    const phaseStart = phaseStarts[sleepDisruption.phase];
    const daysUntilPhase = phaseStart - cycleDay;
    if (daysUntilPhase > 0 && daysUntilPhase <= 4) {
      alerts.push({
        id: 'sleep-disruption',
        icon: 'Moon',
        title: 'Sleep May Be Lighter Soon',
        message: `Your sleep tends to be lighter during your ${sleepDisruption.phase} phase. Try dimming screens earlier and creating a calmer bedtime routine.`,
        severity: 'heads-up',
        daysUntil: daysUntilPhase,
        confidence: 0.65,
      });
    }
  }

  // 5. Peak Energy Window
  const peakEnergy = detectPeakEnergyPattern(checkInsByDay, scansByDay, cycleLength);
  if (peakEnergy) {
    const daysUntilPeak = peakEnergy.startDay - cycleDay;
    if (daysUntilPeak > 0 && daysUntilPeak <= 5) {
      alerts.push({
        id: 'peak-energy-window',
        icon: 'Zap',
        title: 'Peak Energy Window Ahead',
        message: `Your peak energy window starts in ${daysUntilPeak} day${daysUntilPeak > 1 ? 's' : ''} -- schedule important tasks and challenging workouts.`,
        severity: 'info',
        daysUntil: daysUntilPeak,
        confidence: Math.min(0.85, 0.5 + (peakEnergy.peakEnergy / 15)),
      });
    }
  }

  // 6. Hydration Reminder
  const hydrationDip = detectHydrationDipPattern(scansByDay, cycleLength);
  if (hydrationDip) {
    const daysUntilDip = hydrationDip.startDay - cycleDay;
    if (daysUntilDip > -2 && daysUntilDip <= 3) {
      alerts.push({
        id: 'hydration-reminder',
        icon: 'Droplets',
        title: 'Hydration Check',
        message: 'Your hydration tends to dip around this time in your cycle. Increase water intake and consider adding electrolytes.',
        severity: 'info',
        daysUntil: Math.max(0, daysUntilDip),
        confidence: 0.6,
      });
    }
  }

  // Sort by days until (most imminent first), then by severity
  const severityOrder: Record<string, number> = { action: 0, 'heads-up': 1, info: 2 };
  alerts.sort((a, b) => {
    if (a.daysUntil !== b.daysUntil) return a.daysUntil - b.daysUntil;
    return (severityOrder[a.severity] || 2) - (severityOrder[b.severity] || 2);
  });

  return alerts;
}

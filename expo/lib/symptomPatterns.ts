import {
  DailyCheckIn,
  ScanResult,
  CycleHistory,
  CyclePhase,
} from '@/types';
import { getPhaseRanges } from '@/lib/phasePredictor';

export interface SymptomPattern {
  id: string;
  type: 'symptom_phase' | 'metric_dip' | 'metric_peak';
  icon: string; // Lucide icon name
  metric?: string;
  symptom?: string;
  phase?: CyclePhase;
  cycleDayRange?: [number, number];
  frequency?: number; // 0-1 ratio (e.g. 0.75 = appeared in 75% of cycles)
  avgValue?: number;
  confidence: 'high' | 'medium';
}

// ─── helpers ────────────────────────────────────────────────────────────────

const ALL_PHASES: CyclePhase[] = ['menstrual', 'follicular', 'ovulation', 'luteal'];

const METRIC_ICONS: Record<string, string> = {
  mood: 'Smile',
  energy: 'Zap',
  sleep: 'BedDouble',
};

const SYMPTOM_ICONS: Record<string, string> = {
  Cramps: 'Activity',
  Headache: 'Brain',
  Bloating: 'Circle',
  'Mood Swings': 'HeartCrack',
  Acne: 'Frown',
  'Breast Tenderness': 'ShieldAlert',
  'Back Pain': 'ArrowDownUp',
  Fatigue: 'Battery',
  Nausea: 'Thermometer',
  Insomnia: 'Moon',
  default: 'AlertCircle',
};

/** Return the cycle day (1-based) for a given date relative to a cycle start date. */
function cycleDayForDate(dateStr: string, cycleStartStr: string): number {
  const d = new Date(dateStr);
  const s = new Date(cycleStartStr);
  if (isNaN(d.getTime()) || isNaN(s.getTime())) return -1;
  const diff = Math.floor((d.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return diff;
}

/** Determine which completed cycle a date belongs to. Returns the cycle index or -1. */
function findCycleIndex(dateStr: string, cycleHistory: CycleHistory[]): number {
  const t = new Date(dateStr).getTime();
  if (isNaN(t)) return -1;

  for (let i = 0; i < cycleHistory.length; i++) {
    const cycle = cycleHistory[i];
    const start = new Date(cycle.startDate).getTime();
    if (isNaN(start)) continue;

    let end: number;
    if (cycle.endDate) {
      end = new Date(cycle.endDate).getTime();
      if (isNaN(end)) continue;
    } else if (cycle.lengthDays && cycle.lengthDays > 0) {
      end = start + (cycle.lengthDays - 1) * 24 * 60 * 60 * 1000;
    } else {
      continue; // incomplete cycle, skip
    }

    if (t >= start && t <= end) return i;
  }
  return -1;
}

/** Safe average: returns 0 when the array is empty. */
function safeAvg(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/** Determine the phase for a cycle day given the cycle length. */
function phaseForDay(cycleDay: number, cycleLength: number): CyclePhase {
  const ranges = getPhaseRanges(cycleLength);
  if (cycleDay >= ranges.menstrual[0] && cycleDay <= ranges.menstrual[1]) return 'menstrual';
  if (cycleDay >= ranges.follicular[0] && cycleDay <= ranges.follicular[1]) return 'follicular';
  if (cycleDay >= ranges.ovulation[0] && cycleDay <= ranges.ovulation[1]) return 'ovulation';
  return 'luteal';
}

// ─── main analysis ──────────────────────────────────────────────────────────

export function analyzeSymptomPatterns(
  checkIns: DailyCheckIn[],
  scans: ScanResult[],
  cycleHistory: CycleHistory[],
  cycleLength: number,
): SymptomPattern[] {
  // Need at least 2 completed cycles for meaningful pattern detection
  const completedCycles = cycleHistory.filter(
    (c) => c.startDate && (c.endDate || (c.lengthDays && c.lengthDays > 0)),
  );
  if (completedCycles.length < 2) return [];

  const safeCycleLength = cycleLength >= 18 ? cycleLength : 28;
  const ranges = getPhaseRanges(safeCycleLength);
  const patterns: SymptomPattern[] = [];

  // ── Step 1: Map each check-in to its cycle day & phase ────────────────

  interface MappedCheckIn {
    checkIn: DailyCheckIn;
    cycleIndex: number;
    cycleDay: number;
    phase: CyclePhase;
  }

  const mapped: MappedCheckIn[] = [];

  for (const ci of checkIns) {
    if (!ci.date) continue;
    const idx = findCycleIndex(ci.date, completedCycles);
    if (idx < 0) continue;

    const cycle = completedCycles[idx];
    const day = cycleDayForDate(ci.date, cycle.startDate);
    if (day < 1) continue;

    const phase = phaseForDay(day, safeCycleLength);
    mapped.push({ checkIn: ci, cycleIndex: idx, cycleDay: day, phase });
  }

  if (mapped.length === 0) return patterns;

  // ── Step 2: Per-phase metric averages & overall averages ──────────────

  type MetricKey = 'mood' | 'energy' | 'sleep';
  const METRICS: MetricKey[] = ['mood', 'energy', 'sleep'];

  // Collect values per phase
  const phaseValues: Record<CyclePhase, Record<MetricKey, number[]>> = {
    menstrual: { mood: [], energy: [], sleep: [] },
    follicular: { mood: [], energy: [], sleep: [] },
    ovulation: { mood: [], energy: [], sleep: [] },
    luteal: { mood: [], energy: [], sleep: [] },
  };

  for (const m of mapped) {
    for (const metric of METRICS) {
      const val = m.checkIn[metric];
      if (val != null && typeof val === 'number' && !isNaN(val)) {
        phaseValues[m.phase][metric].push(val);
      }
    }
  }

  // Overall averages
  const overallAvg: Record<MetricKey, number> = {
    mood: 0,
    energy: 0,
    sleep: 0,
  };
  for (const metric of METRICS) {
    const allVals: number[] = [];
    for (const phase of ALL_PHASES) {
      allVals.push(...phaseValues[phase][metric]);
    }
    overallAvg[metric] = safeAvg(allVals);
  }

  // ── Step 3: Detect metric dips and peaks ──────────────────────────────

  const DIP_THRESHOLD = 1.5;
  const PEAK_THRESHOLD = 1.5;
  const MIN_SAMPLES_PER_PHASE = 3;

  for (const phase of ALL_PHASES) {
    for (const metric of METRICS) {
      const vals = phaseValues[phase][metric];
      if (vals.length < MIN_SAMPLES_PER_PHASE) continue;

      const avg = safeAvg(vals);
      const overall = overallAvg[metric];

      // Guard: skip if overall is 0 (no data)
      if (overall === 0) continue;

      const delta = avg - overall;

      if (delta <= -DIP_THRESHOLD) {
        // Metric dip
        const confidence = vals.length >= 6 ? 'high' : 'medium';
        patterns.push({
          id: `dip_${metric}_${phase}`,
          type: 'metric_dip',
          icon: METRIC_ICONS[metric] || 'TrendingDown',
          metric,
          phase,
          cycleDayRange: ranges[phase],
          avgValue: Math.round(avg * 10) / 10,
          confidence,
        });
      }

      if (delta >= PEAK_THRESHOLD) {
        // Metric peak
        const confidence = vals.length >= 6 ? 'high' : 'medium';
        patterns.push({
          id: `peak_${metric}_${phase}`,
          type: 'metric_peak',
          icon: METRIC_ICONS[metric] || 'TrendingUp',
          metric,
          phase,
          cycleDayRange: ranges[phase],
          avgValue: Math.round(avg * 10) / 10,
          confidence,
        });
      }
    }
  }

  // ── Step 4: Symptom-phase correlation ─────────────────────────────────

  // For each symptom, count how many distinct cycles it appeared in per phase.
  // If symptom shows up in >60% of cycles for a given phase, flag it.

  const SYMPTOM_FREQ_THRESHOLD = 0.6;
  const totalCycles = completedCycles.length;

  // symptomPhaseCycleSets: symptom -> phase -> Set of cycle indices
  const symptomPhaseCycleSets: Record<string, Record<CyclePhase, Set<number>>> = {};

  for (const m of mapped) {
    const symptoms = m.checkIn.symptoms;
    if (!symptoms || !Array.isArray(symptoms)) continue;

    for (const symptom of symptoms) {
      if (!symptom || typeof symptom !== 'string') continue;

      if (!symptomPhaseCycleSets[symptom]) {
        symptomPhaseCycleSets[symptom] = {
          menstrual: new Set(),
          follicular: new Set(),
          ovulation: new Set(),
          luteal: new Set(),
        };
      }
      symptomPhaseCycleSets[symptom][m.phase].add(m.cycleIndex);
    }
  }

  for (const [symptom, phaseSets] of Object.entries(symptomPhaseCycleSets)) {
    for (const phase of ALL_PHASES) {
      const cycleCount = phaseSets[phase].size;
      if (totalCycles === 0) continue;

      const frequency = cycleCount / totalCycles;
      if (frequency >= SYMPTOM_FREQ_THRESHOLD) {
        const confidence = frequency >= 0.8 && totalCycles >= 3 ? 'high' : 'medium';
        patterns.push({
          id: `symptom_${symptom.replace(/\s+/g, '_').toLowerCase()}_${phase}`,
          type: 'symptom_phase',
          icon: SYMPTOM_ICONS[symptom] || SYMPTOM_ICONS.default,
          symptom,
          phase,
          cycleDayRange: ranges[phase],
          frequency: Math.round(frequency * 100) / 100,
          confidence,
        });
      }
    }
  }

  // ── Step 5: Scan-based metric patterns (stress, energy, recovery) ─────

  interface MappedScan {
    scan: ScanResult;
    cycleIndex: number;
    cycleDay: number;
    phase: CyclePhase;
  }

  const mappedScans: MappedScan[] = [];
  for (const scan of scans) {
    if (!scan.date) continue;
    const idx = findCycleIndex(scan.date, completedCycles);
    if (idx < 0) continue;

    const cycle = completedCycles[idx];
    const day = cycleDayForDate(scan.date, cycle.startDate);
    if (day < 1) continue;

    const phase = phaseForDay(day, safeCycleLength);
    mappedScans.push({ scan, cycleIndex: idx, cycleDay: day, phase });
  }

  if (mappedScans.length >= MIN_SAMPLES_PER_PHASE) {
    type ScanMetricKey = 'stressScore' | 'energyScore' | 'recoveryScore';
    const SCAN_METRICS: ScanMetricKey[] = ['stressScore', 'energyScore', 'recoveryScore'];
    const SCAN_METRIC_ICONS: Record<ScanMetricKey, string> = {
      stressScore: 'HeartPulse',
      energyScore: 'Zap',
      recoveryScore: 'ShieldCheck',
    };

    const scanPhaseValues: Record<CyclePhase, Record<ScanMetricKey, number[]>> = {
      menstrual: { stressScore: [], energyScore: [], recoveryScore: [] },
      follicular: { stressScore: [], energyScore: [], recoveryScore: [] },
      ovulation: { stressScore: [], energyScore: [], recoveryScore: [] },
      luteal: { stressScore: [], energyScore: [], recoveryScore: [] },
    };

    for (const ms of mappedScans) {
      for (const metric of SCAN_METRICS) {
        const val = ms.scan[metric];
        if (val != null && typeof val === 'number' && !isNaN(val)) {
          scanPhaseValues[ms.phase][metric].push(val);
        }
      }
    }

    const scanOverallAvg: Record<ScanMetricKey, number> = {
      stressScore: 0,
      energyScore: 0,
      recoveryScore: 0,
    };
    for (const metric of SCAN_METRICS) {
      const allVals: number[] = [];
      for (const phase of ALL_PHASES) {
        allVals.push(...scanPhaseValues[phase][metric]);
      }
      scanOverallAvg[metric] = safeAvg(allVals);
    }

    for (const phase of ALL_PHASES) {
      for (const metric of SCAN_METRICS) {
        const vals = scanPhaseValues[phase][metric];
        if (vals.length < 2) continue;

        const avg = safeAvg(vals);
        const overall = scanOverallAvg[metric];
        if (overall === 0) continue;

        const delta = avg - overall;

        // For stress, a dip is good (lower stress) — still report it as dip/peak
        if (delta <= -DIP_THRESHOLD) {
          patterns.push({
            id: `dip_${metric}_${phase}`,
            type: 'metric_dip',
            icon: SCAN_METRIC_ICONS[metric],
            metric,
            phase,
            cycleDayRange: ranges[phase],
            avgValue: Math.round(avg * 10) / 10,
            confidence: vals.length >= 4 ? 'high' : 'medium',
          });
        }

        if (delta >= PEAK_THRESHOLD) {
          patterns.push({
            id: `peak_${metric}_${phase}`,
            type: 'metric_peak',
            icon: SCAN_METRIC_ICONS[metric],
            metric,
            phase,
            cycleDayRange: ranges[phase],
            avgValue: Math.round(avg * 10) / 10,
            confidence: vals.length >= 4 ? 'high' : 'medium',
          });
        }
      }
    }
  }

  return patterns;
}

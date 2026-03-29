import { CyclePhase, ScanResult, DailyCheckIn } from '@/types';

// ─── Types ──────────────────────────────────────────────────────────────────

export type WorkoutIntensity = 'rest' | 'light' | 'moderate' | 'intense';
export type WorkoutCategory = 'strength' | 'cardio' | 'yoga' | 'stretching' | 'hiit' | 'pilates' | 'walking' | 'rest';

export interface WorkoutSuggestion {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  category: WorkoutCategory;
  intensity: WorkoutIntensity;
  durationMinutes: number;
  phase: CyclePhase | 'all';
  calorieEstimate: number;
}

export interface DailyTrainingPlan {
  phase: CyclePhase;
  phaseDay: number;
  intensity: WorkoutIntensity;
  primaryWorkout: WorkoutSuggestion;
  alternativeWorkout: WorkoutSuggestion;
  warmup: string;
  cooldown: string;
  tips: string[];
  avoidList: string[];
  scanAdjustment?: string;
}

// ─── Workout Library ────────────────────────────────────────────────────────

const WORKOUTS: Record<string, WorkoutSuggestion> = {
  gentleYoga: {
    id: 'gentle_yoga',
    titleKey: 'workoutGentleYogaTitle',
    descriptionKey: 'workoutGentleYogaDesc',
    icon: 'Heart',
    category: 'yoga',
    intensity: 'light',
    durationMinutes: 25,
    phase: 'menstrual',
    calorieEstimate: 80,
  },
  lightWalking: {
    id: 'light_walking',
    titleKey: 'workoutLightWalkingTitle',
    descriptionKey: 'workoutLightWalkingDesc',
    icon: 'Footprints',
    category: 'walking',
    intensity: 'light',
    durationMinutes: 20,
    phase: 'menstrual',
    calorieEstimate: 60,
  },
  restDay: {
    id: 'rest_day',
    titleKey: 'workoutRestDayTitle',
    descriptionKey: 'workoutRestDayDesc',
    icon: 'Moon',
    category: 'rest',
    intensity: 'rest',
    durationMinutes: 0,
    phase: 'all',
    calorieEstimate: 0,
  },
  strengthCompound: {
    id: 'strength_compound',
    titleKey: 'workoutStrengthTitle',
    descriptionKey: 'workoutStrengthDesc',
    icon: 'Dumbbell',
    category: 'strength',
    intensity: 'moderate',
    durationMinutes: 40,
    phase: 'follicular',
    calorieEstimate: 250,
  },
  danceCardio: {
    id: 'dance_cardio',
    titleKey: 'workoutDanceCardioTitle',
    descriptionKey: 'workoutDanceCardioDesc',
    icon: 'Music',
    category: 'cardio',
    intensity: 'moderate',
    durationMinutes: 30,
    phase: 'follicular',
    calorieEstimate: 200,
  },
  hiit: {
    id: 'hiit',
    titleKey: 'workoutHiitTitle',
    descriptionKey: 'workoutHiitDesc',
    icon: 'Zap',
    category: 'hiit',
    intensity: 'intense',
    durationMinutes: 30,
    phase: 'ovulation',
    calorieEstimate: 320,
  },
  runningCycling: {
    id: 'running_cycling',
    titleKey: 'workoutRunCycleTitle',
    descriptionKey: 'workoutRunCycleDesc',
    icon: 'Activity',
    category: 'cardio',
    intensity: 'intense',
    durationMinutes: 45,
    phase: 'ovulation',
    calorieEstimate: 350,
  },
  moderateCardio: {
    id: 'moderate_cardio',
    titleKey: 'workoutModerateCardioTitle',
    descriptionKey: 'workoutModerateCardioDesc',
    icon: 'Activity',
    category: 'cardio',
    intensity: 'moderate',
    durationMinutes: 35,
    phase: 'ovulation',
    calorieEstimate: 220,
  },
  pilates: {
    id: 'pilates',
    titleKey: 'workoutPilatesTitle',
    descriptionKey: 'workoutPilatesDesc',
    icon: 'Sparkles',
    category: 'pilates',
    intensity: 'moderate',
    durationMinutes: 35,
    phase: 'luteal',
    calorieEstimate: 180,
  },
  gentleStretching: {
    id: 'gentle_stretching',
    titleKey: 'workoutStretchingTitle',
    descriptionKey: 'workoutStretchingDesc',
    icon: 'Flower2',
    category: 'stretching',
    intensity: 'light',
    durationMinutes: 25,
    phase: 'luteal',
    calorieEstimate: 70,
  },
  moderateStrength: {
    id: 'moderate_strength',
    titleKey: 'workoutModStrengthTitle',
    descriptionKey: 'workoutModStrengthDesc',
    icon: 'Dumbbell',
    category: 'strength',
    intensity: 'moderate',
    durationMinutes: 35,
    phase: 'luteal',
    calorieEstimate: 200,
  },
};

// ─── Phase warmups & cooldowns ──────────────────────────────────────────────

const WARMUPS: Record<CyclePhase, string> = {
  menstrual: 'warmupMenstrual',
  follicular: 'warmupFollicular',
  ovulation: 'warmupOvulation',
  luteal: 'warmupLuteal',
};

const COOLDOWNS: Record<CyclePhase, string> = {
  menstrual: 'cooldownMenstrual',
  follicular: 'cooldownFollicular',
  ovulation: 'cooldownOvulation',
  luteal: 'cooldownLuteal',
};

// ─── Phase tips & avoid lists ───────────────────────────────────────────────

const PHASE_TIPS: Record<CyclePhase, string[]> = {
  menstrual: [
    'tipMenstrual1',
    'tipMenstrual2',
  ],
  follicular: [
    'tipFollicular1',
    'tipFollicular2',
    'tipFollicular3',
  ],
  ovulation: [
    'tipOvulation1',
    'tipOvulation2',
    'tipOvulation3',
  ],
  luteal: [
    'tipLuteal1',
    'tipLuteal2',
    'tipLuteal3',
  ],
};

const PHASE_AVOID: Record<CyclePhase, string[]> = {
  menstrual: [
    'avoidMenstrual1',
    'avoidMenstrual2',
    'avoidMenstrual3',
  ],
  follicular: [
    'avoidFollicular1',
  ],
  ovulation: [
    'avoidOvulation1',
  ],
  luteal: [
    'avoidLuteal1',
    'avoidLuteal2',
  ],
};

// ─── Generator ──────────────────────────────────────────────────────────────

export function generateDailyTrainingPlan(
  phase: CyclePhase,
  phaseDay: number,
  latestScan: ScanResult | null,
  todayCheckIn: DailyCheckIn | null,
): DailyTrainingPlan {
  const energy = latestScan?.energyScore ?? todayCheckIn?.energy ?? 5;
  const stress = latestScan?.stressScore ?? todayCheckIn?.stressLevel ?? 5;
  const fatigue = latestScan?.fatigueLevel ?? 5;

  let primaryWorkout: WorkoutSuggestion;
  let alternativeWorkout: WorkoutSuggestion;
  let intensity: WorkoutIntensity;
  let scanAdjustment: string | undefined;

  switch (phase) {
    case 'menstrual': {
      // Very low energy: suggest rest
      if (energy < 3) {
        primaryWorkout = WORKOUTS.restDay;
        alternativeWorkout = WORKOUTS.gentleYoga;
        intensity = 'rest';
        scanAdjustment = 'scanAdjustRestDay';
      } else {
        primaryWorkout = WORKOUTS.gentleYoga;
        alternativeWorkout = WORKOUTS.lightWalking;
        intensity = 'light';
      }
      break;
    }

    case 'follicular': {
      // High energy: upgrade to HIIT
      if (energy > 7) {
        primaryWorkout = WORKOUTS.hiit;
        alternativeWorkout = WORKOUTS.strengthCompound;
        intensity = 'intense';
        scanAdjustment = 'scanAdjustHighEnergy';
      } else {
        primaryWorkout = WORKOUTS.strengthCompound;
        alternativeWorkout = WORKOUTS.danceCardio;
        intensity = 'moderate';
      }
      break;
    }

    case 'ovulation': {
      // High stress: downgrade to moderate
      if (stress > 7) {
        primaryWorkout = WORKOUTS.moderateCardio;
        alternativeWorkout = WORKOUTS.danceCardio;
        intensity = 'moderate';
        scanAdjustment = 'scanAdjustHighStress';
      } else {
        primaryWorkout = WORKOUTS.hiit;
        alternativeWorkout = WORKOUTS.runningCycling;
        intensity = 'intense';
      }
      break;
    }

    case 'luteal': {
      const isLateLuteal = phaseDay > 5;
      // High fatigue: stretching only
      if (fatigue > 7) {
        primaryWorkout = WORKOUTS.gentleStretching;
        alternativeWorkout = WORKOUTS.lightWalking;
        intensity = 'light';
        scanAdjustment = 'scanAdjustHighFatigue';
      } else if (isLateLuteal) {
        primaryWorkout = WORKOUTS.gentleStretching;
        alternativeWorkout = WORKOUTS.lightWalking;
        intensity = 'light';
      } else {
        primaryWorkout = WORKOUTS.pilates;
        alternativeWorkout = WORKOUTS.moderateStrength;
        intensity = 'moderate';
      }
      break;
    }

    default: {
      primaryWorkout = WORKOUTS.gentleYoga;
      alternativeWorkout = WORKOUTS.lightWalking;
      intensity = 'light';
    }
  }

  return {
    phase,
    phaseDay,
    intensity,
    primaryWorkout,
    alternativeWorkout,
    warmup: WARMUPS[phase],
    cooldown: COOLDOWNS[phase],
    tips: PHASE_TIPS[phase],
    avoidList: PHASE_AVOID[phase],
    scanAdjustment,
  };
}

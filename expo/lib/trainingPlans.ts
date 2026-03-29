import { CyclePhase, ScanResult, DailyCheckIn } from '@/types';

// ─── Types ──────────────────────────────────────────────────────────────────

export type WorkoutIntensity = 'rest' | 'light' | 'moderate' | 'intense';
export type WorkoutCategory = 'strength' | 'cardio' | 'yoga' | 'stretching' | 'hiit' | 'pilates' | 'walking' | 'rest' | 'swimming' | 'balance';

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
  bodyweightStrength: {
    id: 'bodyweight_strength',
    titleKey: 'workoutBodyweightTitle',
    descriptionKey: 'workoutBodyweightDesc',
    icon: 'Flame',
    category: 'strength',
    intensity: 'moderate',
    durationMinutes: 30,
    phase: 'follicular',
    calorieEstimate: 200,
  },
  danceCardio: {
    id: 'dance_cardio',
    titleKey: 'workoutDanceCardioTitle',
    descriptionKey: 'workoutDanceCardioDesc',
    icon: 'Music',
    category: 'cardio',
    intensity: 'moderate',
    durationMinutes: 25,
    phase: 'follicular',
    calorieEstimate: 180,
  },
  bodyweightHiit: {
    id: 'bodyweight_hiit',
    titleKey: 'workoutBodyweightHiitTitle',
    descriptionKey: 'workoutBodyweightHiitDesc',
    icon: 'Zap',
    category: 'hiit',
    intensity: 'intense',
    durationMinutes: 25,
    phase: 'ovulation',
    calorieEstimate: 280,
  },
  powerFlow: {
    id: 'power_flow',
    titleKey: 'workoutPowerFlowTitle',
    descriptionKey: 'workoutPowerFlowDesc',
    icon: 'Activity',
    category: 'yoga',
    intensity: 'intense',
    durationMinutes: 35,
    phase: 'ovulation',
    calorieEstimate: 250,
  },
  moderateBodyweight: {
    id: 'moderate_bodyweight',
    titleKey: 'workoutModBodyweightTitle',
    descriptionKey: 'workoutModBodyweightDesc',
    icon: 'Activity',
    category: 'strength',
    intensity: 'moderate',
    durationMinutes: 25,
    phase: 'ovulation',
    calorieEstimate: 180,
  },
  pilates: {
    id: 'pilates',
    titleKey: 'workoutPilatesTitle',
    descriptionKey: 'workoutPilatesDesc',
    icon: 'Sparkles',
    category: 'pilates',
    intensity: 'moderate',
    durationMinutes: 30,
    phase: 'luteal',
    calorieEstimate: 150,
  },
  gentleStretching: {
    id: 'gentle_stretching',
    titleKey: 'workoutStretchingTitle',
    descriptionKey: 'workoutStretchingDesc',
    icon: 'Flower2',
    category: 'stretching',
    intensity: 'light',
    durationMinutes: 20,
    phase: 'luteal',
    calorieEstimate: 60,
  },
  floorWork: {
    id: 'floor_work',
    titleKey: 'workoutFloorWorkTitle',
    descriptionKey: 'workoutFloorWorkDesc',
    icon: 'Heart',
    category: 'strength',
    intensity: 'moderate',
    durationMinutes: 25,
    phase: 'luteal',
    calorieEstimate: 140,
  },

  // ─── Life-stage workouts ──────────────────────────────────────────────────

  prenatalYoga: {
    id: 'prenatal_yoga',
    titleKey: 'workoutPrenatalYogaTitle',
    descriptionKey: 'workoutPrenatalYogaDesc',
    icon: 'Heart',
    category: 'yoga',
    intensity: 'light',
    durationMinutes: 25,
    phase: 'all',
    calorieEstimate: 90,
  },
  prenatalWalk: {
    id: 'prenatal_walk',
    titleKey: 'workoutPrenatalWalkTitle',
    descriptionKey: 'workoutPrenatalWalkDesc',
    icon: 'Footprints',
    category: 'walking',
    intensity: 'light',
    durationMinutes: 20,
    phase: 'all',
    calorieEstimate: 70,
  },
  prenatalSwim: {
    id: 'prenatal_swim',
    titleKey: 'workoutPrenatalSwimTitle',
    descriptionKey: 'workoutPrenatalSwimDesc',
    icon: 'Activity',
    category: 'swimming',
    intensity: 'light',
    durationMinutes: 20,
    phase: 'all',
    calorieEstimate: 100,
  },
  postpartumRecovery: {
    id: 'postpartum_recovery',
    titleKey: 'workoutPostpartumRecoveryTitle',
    descriptionKey: 'workoutPostpartumRecoveryDesc',
    icon: 'Heart',
    category: 'stretching',
    intensity: 'light',
    durationMinutes: 15,
    phase: 'all',
    calorieEstimate: 50,
  },
  postpartumGentle: {
    id: 'postpartum_gentle',
    titleKey: 'workoutPostpartumGentleTitle',
    descriptionKey: 'workoutPostpartumGentleDesc',
    icon: 'Footprints',
    category: 'walking',
    intensity: 'light',
    durationMinutes: 20,
    phase: 'all',
    calorieEstimate: 60,
  },
  perimenopauseStrength: {
    id: 'perimenopause_strength',
    titleKey: 'workoutPerimenopauseStrengthTitle',
    descriptionKey: 'workoutPerimenopauseStrengthDesc',
    icon: 'Flame',
    category: 'strength',
    intensity: 'moderate',
    durationMinutes: 30,
    phase: 'all',
    calorieEstimate: 180,
  },
  perimenopauseYoga: {
    id: 'perimenopause_yoga',
    titleKey: 'workoutPerimenopauseYogaTitle',
    descriptionKey: 'workoutPerimenopauseYogaDesc',
    icon: 'Heart',
    category: 'yoga',
    intensity: 'light',
    durationMinutes: 25,
    phase: 'all',
    calorieEstimate: 80,
  },
  menopauseBalance: {
    id: 'menopause_balance',
    titleKey: 'workoutMenopauseBalanceTitle',
    descriptionKey: 'workoutMenopauseBalanceDesc',
    icon: 'Activity',
    category: 'balance',
    intensity: 'light',
    durationMinutes: 20,
    phase: 'all',
    calorieEstimate: 70,
  },
  menopauseWalking: {
    id: 'menopause_walking',
    titleKey: 'workoutMenopauseWalkingTitle',
    descriptionKey: 'workoutMenopauseWalkingDesc',
    icon: 'Footprints',
    category: 'walking',
    intensity: 'moderate',
    durationMinutes: 25,
    phase: 'all',
    calorieEstimate: 120,
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
  lifeStage?: string,
  weeksPregnant?: number,
): DailyTrainingPlan {
  const energy = latestScan?.energyScore ?? todayCheckIn?.energy ?? 5;
  const stress = latestScan?.stressScore ?? todayCheckIn?.stressLevel ?? 5;
  const fatigue = latestScan?.fatigueLevel ?? 5;

  let primaryWorkout: WorkoutSuggestion;
  let alternativeWorkout: WorkoutSuggestion;
  let intensity: WorkoutIntensity;
  let scanAdjustment: string | undefined;

  // ─── Life-stage overrides (checked before cycle-phase logic) ────────────

  if (lifeStage === 'pregnancy') {
    const weeks = weeksPregnant ?? 20;
    if (weeks <= 12) {
      // Trimester 1
      primaryWorkout = WORKOUTS.prenatalYoga;
      alternativeWorkout = WORKOUTS.prenatalWalk;
      intensity = 'light';
    } else if (weeks <= 27) {
      // Trimester 2
      primaryWorkout = WORKOUTS.prenatalYoga;
      alternativeWorkout = WORKOUTS.prenatalSwim;
      intensity = 'light';
    } else {
      // Trimester 3
      primaryWorkout = WORKOUTS.prenatalWalk;
      alternativeWorkout = WORKOUTS.gentleStretching;
      intensity = 'light';
    }
    return {
      phase,
      phaseDay,
      intensity,
      primaryWorkout,
      alternativeWorkout,
      warmup: 'warmupPregnancy',
      cooldown: 'cooldownPregnancy',
      tips: ['tipPregnancy1', 'tipPregnancy2', 'tipPregnancy3'],
      avoidList: ['avoidPregnancy1', 'avoidPregnancy2', 'avoidPregnancy3'],
      scanAdjustment,
    };
  }

  if (lifeStage === 'postpartum') {
    primaryWorkout = WORKOUTS.postpartumRecovery;
    alternativeWorkout = WORKOUTS.postpartumGentle;
    intensity = 'light';
    return {
      phase,
      phaseDay,
      intensity,
      primaryWorkout,
      alternativeWorkout,
      warmup: 'warmupPostpartum',
      cooldown: 'cooldownPostpartum',
      tips: ['tipPostpartum1', 'tipPostpartum2'],
      avoidList: ['avoidPostpartum1', 'avoidPostpartum2'],
      scanAdjustment,
    };
  }

  if (lifeStage === 'perimenopause') {
    primaryWorkout = WORKOUTS.perimenopauseStrength;
    alternativeWorkout = WORKOUTS.perimenopauseYoga;
    intensity = 'moderate';
    return {
      phase,
      phaseDay,
      intensity,
      primaryWorkout,
      alternativeWorkout,
      warmup: 'warmupPerimenopause',
      cooldown: 'cooldownPerimenopause',
      tips: ['tipPerimenopause1', 'tipPerimenopause2'],
      avoidList: ['avoidPerimenopause1', 'avoidPerimenopause2'],
      scanAdjustment,
    };
  }

  if (lifeStage === 'menopause') {
    primaryWorkout = WORKOUTS.menopauseBalance;
    alternativeWorkout = WORKOUTS.menopauseWalking;
    intensity = 'light';
    return {
      phase,
      phaseDay,
      intensity,
      primaryWorkout,
      alternativeWorkout,
      warmup: 'warmupMenopause',
      cooldown: 'cooldownMenopause',
      tips: ['tipMenopause1', 'tipMenopause2'],
      avoidList: ['avoidMenopause1', 'avoidMenopause2'],
      scanAdjustment,
    };
  }

  // ─── Regular cycle-phase logic ──────────────────────────────────────────

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
      // High energy: upgrade to bodyweight HIIT
      if (energy > 7) {
        primaryWorkout = WORKOUTS.bodyweightHiit;
        alternativeWorkout = WORKOUTS.bodyweightStrength;
        intensity = 'intense';
        scanAdjustment = 'scanAdjustHighEnergy';
      } else {
        primaryWorkout = WORKOUTS.bodyweightStrength;
        alternativeWorkout = WORKOUTS.danceCardio;
        intensity = 'moderate';
      }
      break;
    }

    case 'ovulation': {
      // High stress: downgrade to moderate
      if (stress > 7) {
        primaryWorkout = WORKOUTS.moderateBodyweight;
        alternativeWorkout = WORKOUTS.danceCardio;
        intensity = 'moderate';
        scanAdjustment = 'scanAdjustHighStress';
      } else {
        primaryWorkout = WORKOUTS.bodyweightHiit;
        alternativeWorkout = WORKOUTS.powerFlow;
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
        alternativeWorkout = WORKOUTS.floorWork;
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

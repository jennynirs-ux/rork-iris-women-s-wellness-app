import { CyclePhase, ScanResult, DailyCheckIn } from '@/types';

// ─── Types ──────────────────────────────────────────────────────────────────

export type WorkoutIntensity = 'rest' | 'light' | 'moderate' | 'intense';
export type WorkoutCategory = 'strength' | 'cardio' | 'yoga' | 'stretching' | 'hiit' | 'pilates' | 'walking' | 'rest' | 'swimming' | 'balance';

export interface Exercise {
  name: string;
  sets: number;
  reps: string;          // "12" or "30 sec" or "1 min"
  restSeconds: number;
  description: string;   // brief form cue
  icon: string;          // lucide icon name
}

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
  exercises?: Exercise[];
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
    exercises: [
      { name: "Child's Pose", sets: 1, reps: '2 min', restSeconds: 0, description: 'Knees wide, arms extended, forehead on mat', icon: 'Heart' },
      { name: 'Cat-Cow', sets: 1, reps: '1 min', restSeconds: 0, description: 'Alternate arching and rounding your spine', icon: 'Activity' },
      { name: 'Seated Twist', sets: 1, reps: '1 min each side', restSeconds: 0, description: 'Sit tall, twist gently from your mid-back', icon: 'Activity' },
      { name: 'Reclined Butterfly', sets: 1, reps: '2 min', restSeconds: 0, description: 'Soles together, knees open, relax fully', icon: 'Heart' },
      { name: 'Savasana', sets: 1, reps: '3 min', restSeconds: 0, description: 'Lie flat, close your eyes, breathe naturally', icon: 'Moon' },
    ],
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
    exercises: [
      { name: 'Easy Pace Walk', sets: 1, reps: '5 min', restSeconds: 0, description: 'Slow, comfortable pace to warm up', icon: 'Footprints' },
      { name: 'Moderate Pace Walk', sets: 1, reps: '10 min', restSeconds: 0, description: 'Pick up the pace slightly, swing arms naturally', icon: 'Footprints' },
      { name: 'Cool-Down Stroll', sets: 1, reps: '5 min', restSeconds: 0, description: 'Slow down gradually, breathe deeply', icon: 'Footprints' },
    ],
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
    exercises: [
      { name: 'Deep Breathing', sets: 1, reps: '5 min', restSeconds: 0, description: 'Inhale 4 counts, hold 4, exhale 6 counts', icon: 'Heart' },
      { name: 'Gentle Neck Rolls', sets: 1, reps: '2 min', restSeconds: 0, description: 'Slow circles in each direction', icon: 'Activity' },
      { name: 'Body Scan Meditation', sets: 1, reps: '5 min', restSeconds: 0, description: 'Lie down, relax each muscle group from toes to head', icon: 'Moon' },
    ],
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
    exercises: [
      { name: 'Squats', sets: 3, reps: '15', restSeconds: 30, description: 'Feet shoulder-width, push hips back', icon: 'Flame' },
      { name: 'Push-Ups', sets: 3, reps: '10', restSeconds: 30, description: 'Modify on knees if needed', icon: 'Flame' },
      { name: 'Lunges', sets: 3, reps: '12 each leg', restSeconds: 30, description: 'Step forward, knee over ankle', icon: 'Flame' },
      { name: 'Plank', sets: 3, reps: '30 sec', restSeconds: 30, description: 'Keep hips level, engage core', icon: 'Activity' },
      { name: 'Glute Bridges', sets: 3, reps: '15', restSeconds: 30, description: 'Squeeze at the top', icon: 'Flame' },
    ],
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
    exercises: [
      { name: 'Warm-Up Groove', sets: 1, reps: '3 min', restSeconds: 0, description: 'Easy side steps and arm swings to the beat', icon: 'Music' },
      { name: 'Freestyle Dance', sets: 3, reps: '4 min', restSeconds: 30, description: 'Move freely, keep your heart rate up', icon: 'Music' },
      { name: 'Grapevine Steps', sets: 2, reps: '2 min', restSeconds: 20, description: 'Step side-behind-side, add arm movements', icon: 'Music' },
      { name: 'Cool-Down Sway', sets: 1, reps: '3 min', restSeconds: 0, description: 'Slow side-to-side movement, deep breaths', icon: 'Music' },
    ],
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
    exercises: [
      { name: 'Burpees', sets: 3, reps: '30 sec', restSeconds: 30, description: 'Drop, push-up, jump up explosively', icon: 'Zap' },
      { name: 'Mountain Climbers', sets: 3, reps: '30 sec', restSeconds: 30, description: 'Drive knees to chest rapidly in plank', icon: 'Zap' },
      { name: 'Jump Squats', sets: 3, reps: '30 sec', restSeconds: 30, description: 'Squat deep, explode upward', icon: 'Zap' },
      { name: 'High Knees', sets: 3, reps: '30 sec', restSeconds: 30, description: 'Drive knees high, pump arms fast', icon: 'Zap' },
      { name: 'Plank Jacks', sets: 3, reps: '30 sec', restSeconds: 30, description: 'Jump feet wide and back together in plank', icon: 'Zap' },
    ],
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
    exercises: [
      { name: 'Sun Salutation A', sets: 3, reps: '1 min', restSeconds: 15, description: 'Flow through the full sequence with breath', icon: 'Activity' },
      { name: 'Warrior I to II Flow', sets: 2, reps: '1 min each side', restSeconds: 15, description: 'Transition smoothly between warriors', icon: 'Activity' },
      { name: 'Chair Pose Hold', sets: 3, reps: '30 sec', restSeconds: 15, description: 'Sit deep, arms overhead, weight in heels', icon: 'Activity' },
      { name: 'Crow Pose Attempts', sets: 3, reps: '20 sec', restSeconds: 20, description: 'Lean forward, knees on triceps, lift feet', icon: 'Activity' },
      { name: 'Standing Forward Fold', sets: 1, reps: '2 min', restSeconds: 0, description: 'Hinge at hips, let head hang heavy', icon: 'Heart' },
    ],
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
    exercises: [
      { name: 'Squats', sets: 3, reps: '10', restSeconds: 30, description: 'Controlled tempo, full depth', icon: 'Flame' },
      { name: 'Push-Ups', sets: 3, reps: '10', restSeconds: 30, description: 'Chest to floor, push up strong', icon: 'Flame' },
      { name: 'Glute Bridges', sets: 3, reps: '10', restSeconds: 30, description: 'Pause at the top for 2 seconds', icon: 'Flame' },
      { name: 'Plank', sets: 3, reps: '30 sec', restSeconds: 30, description: 'Straight line from head to heels', icon: 'Activity' },
    ],
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
    exercises: [
      { name: 'The Hundred', sets: 1, reps: '1 min', restSeconds: 20, description: 'Pump arms while holding legs at 45 degrees', icon: 'Sparkles' },
      { name: 'Roll-Up', sets: 2, reps: '8', restSeconds: 20, description: 'Slowly peel spine off the mat one vertebra at a time', icon: 'Sparkles' },
      { name: 'Single Leg Circles', sets: 2, reps: '10 each leg', restSeconds: 15, description: 'Circle leg smoothly, keep hips stable', icon: 'Sparkles' },
      { name: 'Spine Stretch Forward', sets: 2, reps: '8', restSeconds: 15, description: 'Reach forward rounding over, stack back up', icon: 'Sparkles' },
      { name: 'Side-Lying Leg Lifts', sets: 2, reps: '12 each side', restSeconds: 20, description: 'Lift top leg controlled, keep hips stacked', icon: 'Sparkles' },
    ],
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
    exercises: [
      { name: 'Neck Stretches', sets: 1, reps: '2 min', restSeconds: 0, description: 'Tilt ear to shoulder, hold each side 30 seconds', icon: 'Flower2' },
      { name: 'Shoulder Opener', sets: 1, reps: '2 min', restSeconds: 0, description: 'Clasp hands behind back, open chest', icon: 'Flower2' },
      { name: 'Seated Forward Fold', sets: 1, reps: '2 min', restSeconds: 0, description: 'Reach for toes, relax into the stretch', icon: 'Flower2' },
      { name: 'Hip Flexor Stretch', sets: 1, reps: '2 min each side', restSeconds: 0, description: 'Low lunge position, sink hips forward', icon: 'Flower2' },
      { name: 'Supine Twist', sets: 1, reps: '2 min each side', restSeconds: 0, description: 'Knees to one side, arms wide, look opposite', icon: 'Flower2' },
    ],
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
    exercises: [
      { name: 'Glute Bridges', sets: 3, reps: '15', restSeconds: 30, description: 'Press through heels, squeeze glutes at top', icon: 'Flame' },
      { name: 'Leg Raises', sets: 3, reps: '12', restSeconds: 30, description: 'Keep lower back pressed into mat', icon: 'Activity' },
      { name: 'Clamshells', sets: 3, reps: '15 each side', restSeconds: 20, description: 'Feet together, open top knee like a book', icon: 'Activity' },
      { name: 'Bird-Dogs', sets: 3, reps: '10 each side', restSeconds: 20, description: 'Extend opposite arm and leg, keep hips level', icon: 'Activity' },
      { name: 'Dead Bug', sets: 3, reps: '10 each side', restSeconds: 20, description: 'Lower opposite arm and leg, keep core braced', icon: 'Activity' },
    ],
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
    exercises: [
      { name: 'Cat-Cow', sets: 1, reps: '2 min', restSeconds: 0, description: 'Gentle spinal waves on all fours', icon: 'Heart' },
      { name: 'Modified Warrior II', sets: 1, reps: '1 min each side', restSeconds: 0, description: 'Wide stance, arms open, gentle hold', icon: 'Activity' },
      { name: 'Pelvic Floor Breathing', sets: 1, reps: '3 min', restSeconds: 0, description: 'Inhale relax pelvic floor, exhale gently engage', icon: 'Heart' },
      { name: 'Side-Lying Relaxation', sets: 1, reps: '3 min', restSeconds: 0, description: 'Left side, pillow between knees, breathe deeply', icon: 'Moon' },
    ],
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
    exercises: [
      { name: 'Warm-Up Stroll', sets: 1, reps: '5 min', restSeconds: 0, description: 'Easy pace, focus on posture', icon: 'Footprints' },
      { name: 'Comfortable Walk', sets: 1, reps: '10 min', restSeconds: 0, description: 'Steady pace, stay on flat terrain', icon: 'Footprints' },
      { name: 'Cool-Down Walk', sets: 1, reps: '5 min', restSeconds: 0, description: 'Slow down, take deep breaths', icon: 'Footprints' },
    ],
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
    exercises: [
      { name: 'Pool Warm-Up', sets: 1, reps: '3 min', restSeconds: 0, description: 'Gentle walking in shallow water', icon: 'Activity' },
      { name: 'Easy Laps', sets: 4, reps: '2 min', restSeconds: 30, description: 'Slow freestyle or backstroke, steady breathing', icon: 'Activity' },
      { name: 'Water Walking', sets: 1, reps: '5 min', restSeconds: 0, description: 'Walk waist-deep, swing arms naturally', icon: 'Activity' },
    ],
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
    exercises: [
      { name: 'Pelvic Floor Kegels', sets: 3, reps: '10', restSeconds: 20, description: 'Squeeze and lift, hold 5 seconds, release', icon: 'Heart' },
      { name: 'Diaphragmatic Breathing', sets: 1, reps: '3 min', restSeconds: 0, description: 'Breathe into belly, slow exhale through mouth', icon: 'Heart' },
      { name: 'Gentle Pelvic Tilts', sets: 2, reps: '10', restSeconds: 15, description: 'Lying on back, tilt pelvis to flatten low back', icon: 'Heart' },
      { name: 'Heel Slides', sets: 2, reps: '10 each leg', restSeconds: 15, description: 'Slide heel along floor, keep core gently engaged', icon: 'Activity' },
    ],
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
    exercises: [
      { name: 'Gentle Walk', sets: 1, reps: '10 min', restSeconds: 0, description: 'Easy pace, stroller-friendly if needed', icon: 'Footprints' },
      { name: 'Standing Calf Raises', sets: 2, reps: '10', restSeconds: 15, description: 'Rise onto toes, lower slowly', icon: 'Activity' },
      { name: 'Shoulder Rolls', sets: 1, reps: '1 min', restSeconds: 0, description: 'Roll forward and backward to release tension', icon: 'Activity' },
      { name: 'Cool-Down Stretch', sets: 1, reps: '3 min', restSeconds: 0, description: 'Gentle full-body stretches, breathe deeply', icon: 'Flower2' },
    ],
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
    exercises: [
      { name: 'Squats', sets: 3, reps: '12', restSeconds: 30, description: 'Weight-bearing, full depth, stand tall', icon: 'Flame' },
      { name: 'Wall Push-Ups', sets: 3, reps: '12', restSeconds: 30, description: 'Hands on wall, lean in and push back', icon: 'Flame' },
      { name: 'Step-Ups', sets: 3, reps: '10 each leg', restSeconds: 30, description: 'Use a sturdy step or stair, drive through heel', icon: 'Flame' },
      { name: 'Standing Rows (Band)', sets: 3, reps: '12', restSeconds: 30, description: 'Pull band to chest, squeeze shoulder blades', icon: 'Flame' },
      { name: 'Heel Raises', sets: 3, reps: '15', restSeconds: 20, description: 'Rise onto toes slowly, lower with control', icon: 'Activity' },
    ],
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
    exercises: [
      { name: 'Seated Forward Fold', sets: 1, reps: '2 min', restSeconds: 0, description: 'Hinge at hips, reach for toes, cooling pose', icon: 'Heart' },
      { name: 'Legs Up the Wall', sets: 1, reps: '3 min', restSeconds: 0, description: 'Lie on back, legs resting up the wall', icon: 'Heart' },
      { name: 'Supported Bridge', sets: 1, reps: '2 min', restSeconds: 0, description: 'Hips on a pillow, gentle backbend', icon: 'Heart' },
      { name: 'Cooling Breath', sets: 1, reps: '3 min', restSeconds: 0, description: 'Curl tongue, inhale through mouth, exhale through nose', icon: 'Heart' },
      { name: 'Savasana', sets: 1, reps: '3 min', restSeconds: 0, description: 'Full relaxation, let go of tension', icon: 'Moon' },
    ],
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
    exercises: [
      { name: 'Single-Leg Stand', sets: 3, reps: '30 sec each leg', restSeconds: 15, description: 'Hold onto a chair if needed for support', icon: 'Activity' },
      { name: 'Heel-to-Toe Walk', sets: 3, reps: '10 steps', restSeconds: 15, description: 'Place heel directly in front of toes each step', icon: 'Activity' },
      { name: 'Tandem Stance', sets: 2, reps: '30 sec each foot', restSeconds: 10, description: 'One foot in front of the other, hold balance', icon: 'Activity' },
      { name: 'Seated Marching', sets: 2, reps: '1 min', restSeconds: 15, description: 'Lift knees alternately while seated', icon: 'Activity' },
      { name: 'Toe Raises', sets: 2, reps: '15', restSeconds: 15, description: 'Stand near wall, rise onto toes, hold 2 seconds', icon: 'Activity' },
    ],
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
    exercises: [
      { name: 'Warm-Up Walk', sets: 1, reps: '5 min', restSeconds: 0, description: 'Easy pace to get moving', icon: 'Footprints' },
      { name: 'Brisk Walk', sets: 1, reps: '15 min', restSeconds: 0, description: 'Conversational pace, swing arms naturally', icon: 'Footprints' },
      { name: 'Cool-Down Stroll', sets: 1, reps: '5 min', restSeconds: 0, description: 'Slow pace, focus on breathing', icon: 'Footprints' },
    ],
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

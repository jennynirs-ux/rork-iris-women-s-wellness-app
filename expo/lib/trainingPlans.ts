import { CyclePhase, ScanResult, DailyCheckIn, HealthData } from '@/types';

// ─── Types ──────────────────────────────────────────────────────────────────

export type WorkoutIntensity = 'rest' | 'light' | 'moderate' | 'intense';
export type WorkoutCategory = 'strength' | 'cardio' | 'yoga' | 'stretching' | 'hiit' | 'pilates' | 'walking' | 'rest' | 'swimming' | 'balance';
export type ExerciseSketchType =
  | 'squat' | 'lunge' | 'pushup' | 'plank' | 'deadlift' | 'hipThrust'
  | 'jumpingJack' | 'burpee' | 'mountainClimber' | 'highKnees'
  | 'childPose' | 'downwardDog' | 'warriorPose' | 'catCow' | 'hipCircle'
  | 'legRaise' | 'crunches' | 'bridge' | 'sideLeg' | 'clamshell'
  | 'walk' | 'stretch' | 'breathe' | 'rest';

export interface Exercise {
  name: string;
  sets: number;
  reps: string;          // "12" or "30 sec" or "1 min"
  restSeconds: number;
  description: string;   // brief form cue
  icon: string;          // lucide icon name
  sketchType?: ExerciseSketchType;  // used to render a simple SVG sketch
  muscleGroups?: string[];           // e.g. ['Glutes', 'Core']
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
      { name: "Child's Pose", sets: 1, reps: '2 min', restSeconds: 0, description: 'Knees wide, arms extended, forehead on mat', icon: 'Heart', sketchType: 'childPose', muscleGroups: ['Back', 'Hips'] },
      { name: 'Cat-Cow', sets: 1, reps: '1 min', restSeconds: 0, description: 'Alternate arching and rounding your spine', icon: 'Activity', sketchType: 'catCow', muscleGroups: ['Spine', 'Core'] },
      { name: 'Seated Twist', sets: 1, reps: '1 min each side', restSeconds: 0, description: 'Sit tall, twist gently from your mid-back', icon: 'Activity', sketchType: 'stretch', muscleGroups: ['Spine', 'Obliques'] },
      { name: 'Reclined Butterfly', sets: 1, reps: '2 min', restSeconds: 0, description: 'Soles together, knees open, relax fully', icon: 'Heart', sketchType: 'rest', muscleGroups: ['Hips', 'Inner Thighs'] },
      { name: 'Savasana', sets: 1, reps: '3 min', restSeconds: 0, description: 'Lie flat, close your eyes, breathe naturally', icon: 'Moon', sketchType: 'rest', muscleGroups: ['Full Body'] },
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
      { name: 'Easy Pace Walk', sets: 1, reps: '5 min', restSeconds: 0, description: 'Slow, comfortable pace to warm up', icon: 'Footprints', sketchType: 'walk', muscleGroups: ['Legs', 'Cardiovascular'] },
      { name: 'Moderate Pace Walk', sets: 1, reps: '10 min', restSeconds: 0, description: 'Pick up the pace slightly, swing arms naturally', icon: 'Footprints', sketchType: 'walk', muscleGroups: ['Legs', 'Cardiovascular'] },
      { name: 'Cool-Down Stroll', sets: 1, reps: '5 min', restSeconds: 0, description: 'Slow down gradually, breathe deeply', icon: 'Footprints', sketchType: 'walk', muscleGroups: ['Legs'] },
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
      { name: 'Deep Breathing', sets: 1, reps: '5 min', restSeconds: 0, description: 'Inhale 4 counts, hold 4, exhale 6 counts', icon: 'Heart', sketchType: 'breathe', muscleGroups: ['Diaphragm'] },
      { name: 'Gentle Neck Rolls', sets: 1, reps: '2 min', restSeconds: 0, description: 'Slow circles in each direction', icon: 'Activity', sketchType: 'stretch', muscleGroups: ['Neck'] },
      { name: 'Body Scan Meditation', sets: 1, reps: '5 min', restSeconds: 0, description: 'Lie down, relax each muscle group from toes to head', icon: 'Moon', sketchType: 'rest', muscleGroups: ['Full Body'] },
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
      { name: 'Squats', sets: 3, reps: '15', restSeconds: 30, description: 'Feet shoulder-width, push hips back', icon: 'Flame', sketchType: 'squat', muscleGroups: ['Quads', 'Glutes', 'Core'] },
      { name: 'Push-Ups', sets: 3, reps: '10', restSeconds: 30, description: 'Modify on knees if needed', icon: 'Flame', sketchType: 'pushup', muscleGroups: ['Chest', 'Shoulders', 'Triceps'] },
      { name: 'Lunges', sets: 3, reps: '12 each leg', restSeconds: 30, description: 'Step forward, knee over ankle', icon: 'Flame', sketchType: 'lunge', muscleGroups: ['Quads', 'Glutes', 'Hamstrings'] },
      { name: 'Plank', sets: 3, reps: '30 sec', restSeconds: 30, description: 'Keep hips level, engage core', icon: 'Activity', sketchType: 'plank', muscleGroups: ['Core', 'Shoulders'] },
      { name: 'Glute Bridges', sets: 3, reps: '15', restSeconds: 30, description: 'Squeeze at the top', icon: 'Flame', sketchType: 'bridge', muscleGroups: ['Glutes', 'Hamstrings'] },
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
      { name: 'Warm-Up Groove', sets: 1, reps: '3 min', restSeconds: 0, description: 'Easy side steps and arm swings to the beat', icon: 'Music', sketchType: 'walk', muscleGroups: ['Full Body'] },
      { name: 'Freestyle Dance', sets: 3, reps: '4 min', restSeconds: 30, description: 'Move freely, keep your heart rate up', icon: 'Music', sketchType: 'highKnees', muscleGroups: ['Cardiovascular', 'Full Body'] },
      { name: 'Grapevine Steps', sets: 2, reps: '2 min', restSeconds: 20, description: 'Step side-behind-side, add arm movements', icon: 'Music', sketchType: 'walk', muscleGroups: ['Legs', 'Coordination'] },
      { name: 'Cool-Down Sway', sets: 1, reps: '3 min', restSeconds: 0, description: 'Slow side-to-side movement, deep breaths', icon: 'Music', sketchType: 'stretch', muscleGroups: ['Full Body'] },
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
      { name: 'Burpees', sets: 3, reps: '30 sec', restSeconds: 30, description: 'Drop, push-up, jump up explosively', icon: 'Zap', sketchType: 'burpee', muscleGroups: ['Full Body'] },
      { name: 'Mountain Climbers', sets: 3, reps: '30 sec', restSeconds: 30, description: 'Drive knees to chest rapidly in plank', icon: 'Zap', sketchType: 'mountainClimber', muscleGroups: ['Core', 'Shoulders', 'Legs'] },
      { name: 'Jump Squats', sets: 3, reps: '30 sec', restSeconds: 30, description: 'Squat deep, explode upward', icon: 'Zap', sketchType: 'squat', muscleGroups: ['Quads', 'Glutes', 'Cardiovascular'] },
      { name: 'High Knees', sets: 3, reps: '30 sec', restSeconds: 30, description: 'Drive knees high, pump arms fast', icon: 'Zap', sketchType: 'highKnees', muscleGroups: ['Legs', 'Cardiovascular'] },
      { name: 'Plank Jacks', sets: 3, reps: '30 sec', restSeconds: 30, description: 'Jump feet wide and back together in plank', icon: 'Zap', sketchType: 'plank', muscleGroups: ['Core', 'Legs'] },
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
      { name: 'Sun Salutation A', sets: 3, reps: '1 min', restSeconds: 15, description: 'Flow through the full sequence with breath', icon: 'Activity', sketchType: 'downwardDog', muscleGroups: ['Full Body', 'Flexibility'] },
      { name: 'Warrior I to II Flow', sets: 2, reps: '1 min each side', restSeconds: 15, description: 'Transition smoothly between warriors', icon: 'Activity', sketchType: 'warriorPose', muscleGroups: ['Legs', 'Core', 'Balance'] },
      { name: 'Chair Pose Hold', sets: 3, reps: '30 sec', restSeconds: 15, description: 'Sit deep, arms overhead, weight in heels', icon: 'Activity', sketchType: 'squat', muscleGroups: ['Quads', 'Glutes', 'Core'] },
      { name: 'Crow Pose Attempts', sets: 3, reps: '20 sec', restSeconds: 20, description: 'Lean forward, knees on triceps, lift feet', icon: 'Activity', sketchType: 'plank', muscleGroups: ['Arms', 'Core', 'Balance'] },
      { name: 'Standing Forward Fold', sets: 1, reps: '2 min', restSeconds: 0, description: 'Hinge at hips, let head hang heavy', icon: 'Heart', sketchType: 'stretch', muscleGroups: ['Hamstrings', 'Spine'] },
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
      { name: 'Squats', sets: 3, reps: '10', restSeconds: 30, description: 'Controlled tempo, full depth', icon: 'Flame', sketchType: 'squat', muscleGroups: ['Quads', 'Glutes'] },
      { name: 'Push-Ups', sets: 3, reps: '10', restSeconds: 30, description: 'Chest to floor, push up strong', icon: 'Flame', sketchType: 'pushup', muscleGroups: ['Chest', 'Shoulders', 'Triceps'] },
      { name: 'Glute Bridges', sets: 3, reps: '10', restSeconds: 30, description: 'Pause at the top for 2 seconds', icon: 'Flame', sketchType: 'bridge', muscleGroups: ['Glutes', 'Hamstrings'] },
      { name: 'Plank', sets: 3, reps: '30 sec', restSeconds: 30, description: 'Straight line from head to heels', icon: 'Activity', sketchType: 'plank', muscleGroups: ['Core', 'Shoulders'] },
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
      { name: 'The Hundred', sets: 1, reps: '1 min', restSeconds: 20, description: 'Pump arms while holding legs at 45 degrees', icon: 'Sparkles', sketchType: 'legRaise', muscleGroups: ['Core', 'Hip Flexors'] },
      { name: 'Roll-Up', sets: 2, reps: '8', restSeconds: 20, description: 'Slowly peel spine off the mat one vertebra at a time', icon: 'Sparkles', sketchType: 'crunches', muscleGroups: ['Core', 'Spine'] },
      { name: 'Single Leg Circles', sets: 2, reps: '10 each leg', restSeconds: 15, description: 'Circle leg smoothly, keep hips stable', icon: 'Sparkles', sketchType: 'legRaise', muscleGroups: ['Core', 'Hips'] },
      { name: 'Spine Stretch Forward', sets: 2, reps: '8', restSeconds: 15, description: 'Reach forward rounding over, stack back up', icon: 'Sparkles', sketchType: 'stretch', muscleGroups: ['Spine', 'Hamstrings'] },
      { name: 'Side-Lying Leg Lifts', sets: 2, reps: '12 each side', restSeconds: 20, description: 'Lift top leg controlled, keep hips stacked', icon: 'Sparkles', sketchType: 'sideLeg', muscleGroups: ['Glutes', 'Hip Abductors'] },
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
      { name: 'Neck Stretches', sets: 1, reps: '2 min', restSeconds: 0, description: 'Tilt ear to shoulder, hold each side 30 seconds', icon: 'Flower2', sketchType: 'stretch', muscleGroups: ['Neck', 'Shoulders'] },
      { name: 'Shoulder Opener', sets: 1, reps: '2 min', restSeconds: 0, description: 'Clasp hands behind back, open chest', icon: 'Flower2', sketchType: 'stretch', muscleGroups: ['Chest', 'Shoulders'] },
      { name: 'Seated Forward Fold', sets: 1, reps: '2 min', restSeconds: 0, description: 'Reach for toes, relax into the stretch', icon: 'Flower2', sketchType: 'stretch', muscleGroups: ['Hamstrings', 'Spine'] },
      { name: 'Hip Flexor Stretch', sets: 1, reps: '2 min each side', restSeconds: 0, description: 'Low lunge position, sink hips forward', icon: 'Flower2', sketchType: 'lunge', muscleGroups: ['Hip Flexors', 'Quads'] },
      { name: 'Supine Twist', sets: 1, reps: '2 min each side', restSeconds: 0, description: 'Knees to one side, arms wide, look opposite', icon: 'Flower2', sketchType: 'stretch', muscleGroups: ['Spine', 'Glutes'] },
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
      { name: 'Glute Bridges', sets: 3, reps: '15', restSeconds: 30, description: 'Press through heels, squeeze glutes at top', icon: 'Flame', sketchType: 'bridge', muscleGroups: ['Glutes', 'Hamstrings'] },
      { name: 'Leg Raises', sets: 3, reps: '12', restSeconds: 30, description: 'Keep lower back pressed into mat', icon: 'Activity', sketchType: 'legRaise', muscleGroups: ['Core', 'Hip Flexors'] },
      { name: 'Clamshells', sets: 3, reps: '15 each side', restSeconds: 20, description: 'Feet together, open top knee like a book', icon: 'Activity', sketchType: 'clamshell', muscleGroups: ['Glutes', 'Hip Abductors'] },
      { name: 'Bird-Dogs', sets: 3, reps: '10 each side', restSeconds: 20, description: 'Extend opposite arm and leg, keep hips level', icon: 'Activity', sketchType: 'plank', muscleGroups: ['Core', 'Back'] },
      { name: 'Dead Bug', sets: 3, reps: '10 each side', restSeconds: 20, description: 'Lower opposite arm and leg, keep core braced', icon: 'Activity', sketchType: 'legRaise', muscleGroups: ['Core'] },
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
      { name: 'Cat-Cow', sets: 1, reps: '2 min', restSeconds: 0, description: 'Gentle spinal waves on all fours', icon: 'Heart', sketchType: 'catCow', muscleGroups: ['Spine', 'Core'] },
      { name: 'Modified Warrior II', sets: 1, reps: '1 min each side', restSeconds: 0, description: 'Wide stance, arms open, gentle hold', icon: 'Activity', sketchType: 'warriorPose', muscleGroups: ['Legs', 'Hips'] },
      { name: 'Pelvic Floor Breathing', sets: 1, reps: '3 min', restSeconds: 0, description: 'Inhale relax pelvic floor, exhale gently engage', icon: 'Heart', sketchType: 'breathe', muscleGroups: ['Pelvic Floor', 'Core'] },
      { name: 'Side-Lying Relaxation', sets: 1, reps: '3 min', restSeconds: 0, description: 'Left side, pillow between knees, breathe deeply', icon: 'Moon', sketchType: 'rest', muscleGroups: ['Full Body'] },
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
      { name: 'Warm-Up Stroll', sets: 1, reps: '5 min', restSeconds: 0, description: 'Easy pace, focus on posture', icon: 'Footprints', sketchType: 'walk', muscleGroups: ['Legs', 'Cardiovascular'] },
      { name: 'Comfortable Walk', sets: 1, reps: '10 min', restSeconds: 0, description: 'Steady pace, stay on flat terrain', icon: 'Footprints', sketchType: 'walk', muscleGroups: ['Legs', 'Cardiovascular'] },
      { name: 'Cool-Down Walk', sets: 1, reps: '5 min', restSeconds: 0, description: 'Slow down, take deep breaths', icon: 'Footprints', sketchType: 'walk', muscleGroups: ['Legs'] },
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
      { name: 'Pool Warm-Up', sets: 1, reps: '3 min', restSeconds: 0, description: 'Gentle walking in shallow water', icon: 'Activity', sketchType: 'walk', muscleGroups: ['Full Body', 'Cardiovascular'] },
      { name: 'Easy Laps', sets: 4, reps: '2 min', restSeconds: 30, description: 'Slow freestyle or backstroke, steady breathing', icon: 'Activity', sketchType: 'stretch', muscleGroups: ['Full Body', 'Cardiovascular'] },
      { name: 'Water Walking', sets: 1, reps: '5 min', restSeconds: 0, description: 'Walk waist-deep, swing arms naturally', icon: 'Activity', sketchType: 'walk', muscleGroups: ['Legs', 'Cardiovascular'] },
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
      { name: 'Pelvic Floor Kegels', sets: 3, reps: '10', restSeconds: 20, description: 'Squeeze and lift, hold 5 seconds, release', icon: 'Heart', sketchType: 'breathe', muscleGroups: ['Pelvic Floor', 'Core'] },
      { name: 'Diaphragmatic Breathing', sets: 1, reps: '3 min', restSeconds: 0, description: 'Breathe into belly, slow exhale through mouth', icon: 'Heart', sketchType: 'breathe', muscleGroups: ['Diaphragm', 'Core'] },
      { name: 'Gentle Pelvic Tilts', sets: 2, reps: '10', restSeconds: 15, description: 'Lying on back, tilt pelvis to flatten low back', icon: 'Heart', sketchType: 'bridge', muscleGroups: ['Core', 'Lower Back'] },
      { name: 'Heel Slides', sets: 2, reps: '10 each leg', restSeconds: 15, description: 'Slide heel along floor, keep core gently engaged', icon: 'Activity', sketchType: 'legRaise', muscleGroups: ['Hip Flexors', 'Core'] },
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
      { name: 'Gentle Walk', sets: 1, reps: '10 min', restSeconds: 0, description: 'Easy pace, stroller-friendly if needed', icon: 'Footprints', sketchType: 'walk', muscleGroups: ['Legs', 'Cardiovascular'] },
      { name: 'Standing Calf Raises', sets: 2, reps: '10', restSeconds: 15, description: 'Rise onto toes, lower slowly', icon: 'Activity', sketchType: 'walk', muscleGroups: ['Calves', 'Ankles'] },
      { name: 'Shoulder Rolls', sets: 1, reps: '1 min', restSeconds: 0, description: 'Roll forward and backward to release tension', icon: 'Activity', sketchType: 'stretch', muscleGroups: ['Shoulders', 'Neck'] },
      { name: 'Cool-Down Stretch', sets: 1, reps: '3 min', restSeconds: 0, description: 'Gentle full-body stretches, breathe deeply', icon: 'Flower2', sketchType: 'stretch', muscleGroups: ['Full Body'] },
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
      { name: 'Squats', sets: 3, reps: '12', restSeconds: 30, description: 'Weight-bearing, full depth, stand tall', icon: 'Flame', sketchType: 'squat', muscleGroups: ['Quads', 'Glutes', 'Hamstrings'] },
      { name: 'Wall Push-Ups', sets: 3, reps: '12', restSeconds: 30, description: 'Hands on wall, lean in and push back', icon: 'Flame', sketchType: 'pushup', muscleGroups: ['Chest', 'Shoulders', 'Triceps'] },
      { name: 'Step-Ups', sets: 3, reps: '10 each leg', restSeconds: 30, description: 'Use a sturdy step or stair, drive through heel', icon: 'Flame', sketchType: 'lunge', muscleGroups: ['Quads', 'Glutes', 'Balance'] },
      { name: 'Standing Rows (Band)', sets: 3, reps: '12', restSeconds: 30, description: 'Pull band to chest, squeeze shoulder blades', icon: 'Flame', sketchType: 'stretch', muscleGroups: ['Back', 'Biceps', 'Shoulders'] },
      { name: 'Heel Raises', sets: 3, reps: '15', restSeconds: 20, description: 'Rise onto toes slowly, lower with control', icon: 'Activity', sketchType: 'walk', muscleGroups: ['Calves', 'Ankles'] },
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
      { name: 'Seated Forward Fold', sets: 1, reps: '2 min', restSeconds: 0, description: 'Hinge at hips, reach for toes, cooling pose', icon: 'Heart', sketchType: 'stretch', muscleGroups: ['Hamstrings', 'Spine'] },
      { name: 'Legs Up the Wall', sets: 1, reps: '3 min', restSeconds: 0, description: 'Lie on back, legs resting up the wall', icon: 'Heart', sketchType: 'legRaise', muscleGroups: ['Hamstrings', 'Lower Back'] },
      { name: 'Supported Bridge', sets: 1, reps: '2 min', restSeconds: 0, description: 'Hips on a pillow, gentle backbend', icon: 'Heart', sketchType: 'bridge', muscleGroups: ['Glutes', 'Spine', 'Hips'] },
      { name: 'Cooling Breath', sets: 1, reps: '3 min', restSeconds: 0, description: 'Curl tongue, inhale through mouth, exhale through nose', icon: 'Heart', sketchType: 'breathe', muscleGroups: ['Diaphragm'] },
      { name: 'Savasana', sets: 1, reps: '3 min', restSeconds: 0, description: 'Full relaxation, let go of tension', icon: 'Moon', sketchType: 'rest', muscleGroups: ['Full Body'] },
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
      { name: 'Single-Leg Stand', sets: 3, reps: '30 sec each leg', restSeconds: 15, description: 'Hold onto a chair if needed for support', icon: 'Activity', sketchType: 'walk', muscleGroups: ['Ankles', 'Core', 'Balance'] },
      { name: 'Heel-to-Toe Walk', sets: 3, reps: '10 steps', restSeconds: 15, description: 'Place heel directly in front of toes each step', icon: 'Activity', sketchType: 'walk', muscleGroups: ['Balance', 'Legs', 'Coordination'] },
      { name: 'Tandem Stance', sets: 2, reps: '30 sec each foot', restSeconds: 10, description: 'One foot in front of the other, hold balance', icon: 'Activity', sketchType: 'walk', muscleGroups: ['Balance', 'Core', 'Ankles'] },
      { name: 'Seated Marching', sets: 2, reps: '1 min', restSeconds: 15, description: 'Lift knees alternately while seated', icon: 'Activity', sketchType: 'highKnees', muscleGroups: ['Hip Flexors', 'Core'] },
      { name: 'Toe Raises', sets: 2, reps: '15', restSeconds: 15, description: 'Stand near wall, rise onto toes, hold 2 seconds', icon: 'Activity', sketchType: 'walk', muscleGroups: ['Calves', 'Balance'] },
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
      { name: 'Warm-Up Walk', sets: 1, reps: '5 min', restSeconds: 0, description: 'Easy pace to get moving', icon: 'Footprints', sketchType: 'walk', muscleGroups: ['Legs', 'Cardiovascular'] },
      { name: 'Brisk Walk', sets: 1, reps: '15 min', restSeconds: 0, description: 'Conversational pace, swing arms naturally', icon: 'Footprints', sketchType: 'walk', muscleGroups: ['Legs', 'Cardiovascular', 'Bone Density'] },
      { name: 'Cool-Down Stroll', sets: 1, reps: '5 min', restSeconds: 0, description: 'Slow pace, focus on breathing', icon: 'Footprints', sketchType: 'walk', muscleGroups: ['Legs'] },
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
  healthData?: HealthData | null,
): DailyTrainingPlan {
  const energy = latestScan?.energyScore ?? todayCheckIn?.energy ?? 5;
  const stress = latestScan?.stressScore ?? todayCheckIn?.stressLevel ?? 5;
  const fatigue = latestScan?.fatigueLevel ?? 5;

  // Health data modifiers: low HRV forces rest; high HRV + good sleep unlocks intensity
  const hrv = healthData?.hrv;
  const sleepHours = healthData?.sleepHours;
  const healthForcesRest = (hrv !== undefined && hrv < 20) || (sleepHours !== undefined && sleepHours < 5);
  const healthUnlocksIntensity = (hrv !== undefined && hrv > 55) && (sleepHours === undefined || sleepHours >= 7);

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

  // Health data overrides (applied after cycle-phase logic)
  if (healthForcesRest && intensity !== 'rest') {
    primaryWorkout = WORKOUTS.gentleYoga;
    alternativeWorkout = WORKOUTS.lightWalking;
    intensity = 'light';
    scanAdjustment = 'scanAdjustRestDay';
  } else if (healthUnlocksIntensity && intensity === 'light' && phase !== 'menstrual') {
    // Good HRV + good sleep → allow stepping up one intensity level
    primaryWorkout = WORKOUTS.moderateBodyweight;
    alternativeWorkout = WORKOUTS.danceCardio;
    intensity = 'moderate';
    scanAdjustment = 'scanAdjustHighEnergy';
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

/**
 * Training plan translations (English).
 * Keys are referenced from lib/trainingPlans.ts and app/training-plan.tsx.
 */
export const trainingTranslations: Record<string, string> = {
  // ─── Section headers ──────────────────────────────────────────────────────
  title: "Today's Training",
  subtitle: "Cycle-synced movement for your phase",
  primaryWorkout: "Recommended",
  alternative: "Alternative",
  duration: "{n} min",
  intensity: "Intensity",
  warmup: "Warm Up",
  cooldown: "Cool Down",
  tips: "Phase Tips",
  avoid: "Better to Skip",
  startWorkout: "Start Workout",
  completed: "Workout Complete!",
  calories: "~{n} cal",

  // ─── Intensity labels ─────────────────────────────────────────────────────
  rest: "Rest",
  light: "Light",
  moderate: "Moderate",
  intense: "Intense",

  // ─── Phase labels ─────────────────────────────────────────────────────────
  phaseMenstrual: "Menstrual Phase",
  phaseFollicular: "Follicular Phase",
  phaseOvulation: "Ovulation Phase",
  phaseLuteal: "Luteal Phase",

  // ─── Workout titles ───────────────────────────────────────────────────────
  workoutGentleYogaTitle: "Gentle Yoga",
  workoutGentleYogaDesc: "Restorative stretching and breathwork to ease tension and support recovery during your period.",
  workoutLightWalkingTitle: "Light Walk",
  workoutLightWalkingDesc: "A relaxed 20-minute outdoor walk to boost circulation without over-exerting.",
  workoutRestDayTitle: "Rest Day",
  workoutRestDayDesc: "Your body needs recovery today. Focus on gentle breathing and hydration.",
  workoutBodyweightTitle: "Bodyweight Strength",
  workoutBodyweightDesc: "No equipment needed! Squats, lunges, push-ups, and planks. Build strength at home using only your body.",
  workoutDanceCardioTitle: "Dance Cardio at Home",
  workoutDanceCardioDesc: "Put on your favorite music and move for 25 minutes. Any style goes — just keep moving and have fun!",
  workoutBodyweightHiitTitle: "Bodyweight HIIT",
  workoutBodyweightHiitDesc: "25 minutes of burpees, mountain climbers, jump squats, and high knees. 30 seconds on, 30 seconds rest. No equipment needed.",
  workoutPowerFlowTitle: "Power Yoga Flow",
  workoutPowerFlowDesc: "A challenging yoga flow with warrior poses, chair pose, and balancing sequences. Builds strength and flexibility at home.",
  workoutModBodyweightTitle: "Moderate Home Circuit",
  workoutModBodyweightDesc: "A balanced home circuit: squats, push-ups, glute bridges, and planks. 3 rounds of 10 reps each. Gentle on joints.",
  workoutPilatesTitle: "Pilates at Home",
  workoutPilatesDesc: "Mat-based core work with controlled breathing. Focus on pelvic floor, abs, and posture. Only a mat needed.",
  workoutStretchingTitle: "Gentle Home Stretching",
  workoutStretchingDesc: "Full-body stretching on your mat. Focus on hips, back, and shoulders. Soothing for PMS tension. No equipment needed.",
  workoutFloorWorkTitle: "Floor Strength Work",
  workoutFloorWorkDesc: "Glute bridges, leg raises, clamshells, and bird-dogs. All done lying on a mat at home. Gentle but effective.",

  // ─── Warmups ──────────────────────────────────────────────────────────────
  warmupMenstrual: "5 minutes of gentle neck rolls, shoulder circles, and seated hip openers. Move slowly and breathe deeply.",
  warmupFollicular: "5 minutes of dynamic stretches: leg swings, arm circles, light jogging in place. Get your heart rate gently rising.",
  warmupOvulation: "5 minutes of brisk jumping jacks, high knees, and dynamic lunges. Prepare your body for peak effort.",
  warmupLuteal: "5 minutes of slow cat-cow stretches, side bends, and gentle torso twists. Ease your body into movement.",

  // ─── Cooldowns ────────────────────────────────────────────────────────────
  cooldownMenstrual: "5 minutes of child's pose, seated forward fold, and deep belly breathing. Let your body fully relax.",
  cooldownFollicular: "5 minutes of hamstring stretch, quad stretch, and light foam rolling. Help your muscles recover quickly.",
  cooldownOvulation: "5 minutes of standing forward fold, figure-four stretch, and slow breathing. Bring your heart rate down gradually.",
  cooldownLuteal: "5 minutes of reclined butterfly pose, gentle spinal twist, and box breathing. Calm your nervous system.",

  // ─── Phase tips ───────────────────────────────────────────────────────────
  tipMenstrual1: "Listen to your body — rest days are productive days",
  tipMenstrual2: "Focus on breath work and gentle movement",
  tipFollicular1: "Energy is rising — try adding more reps or rounds",
  tipFollicular2: "Try a new bodyweight exercise or flow",
  tipFollicular3: "Your body recovers faster now — great time to challenge yourself",
  tipOvulation1: "Peak performance window — push your bodyweight exercises!",
  tipOvulation2: "Great time for longer hold times and more reps",
  tipOvulation3: "Stay well-hydrated during intense home workouts",
  tipLuteal1: "Energy is declining gradually",
  tipLuteal2: "Focus on form over intensity",
  tipLuteal3: "Yoga can help with PMS symptoms",

  // ─── Avoid lists ──────────────────────────────────────────────────────────
  avoidMenstrual1: "High-intensity training",
  avoidMenstrual2: "Intense bodyweight circuits",
  avoidMenstrual3: "Hot yoga or heated rooms",
  avoidFollicular1: "Skipping workouts — capitalize on rising energy at home",
  avoidOvulation1: "Under-training — this is your power window, even at home!",
  avoidLuteal1: "Overtraining",
  avoidLuteal2: "Ignoring fatigue signals",

  // ─── Scan-aware adjustments ───────────────────────────────────────────────
  scanAdjustRestDay: "Your scan shows very low energy — a rest day is the best choice today.",
  scanAdjustHighEnergy: "Your scan shows high energy — upgraded to a more intense workout!",
  scanAdjustHighStress: "Your scan shows elevated stress — moderate cardio will help without adding strain.",
  scanAdjustHighFatigue: "Your scan shows high fatigue — gentle stretching is recommended today.",

  // ─── Life-stage workout titles ────────────────────────────────────────────
  workoutPrenatalYogaTitle: "Prenatal Yoga",
  workoutPrenatalYogaDesc: "Gentle yoga focusing on pelvic floor strength and breathing techniques. Safe for all trimesters with modifications.",
  workoutPrenatalWalkTitle: "Prenatal Walk",
  workoutPrenatalWalkDesc: "A gentle 20-minute walk at a comfortable pace. Stay hydrated and avoid overheating.",
  workoutPrenatalSwimTitle: "Prenatal Swimming",
  workoutPrenatalSwimDesc: "Low-impact water exercise that supports joints and relieves pressure. Great for the second trimester.",
  workoutPostpartumRecoveryTitle: "Postpartum Recovery",
  workoutPostpartumRecoveryDesc: "Gentle pelvic floor and deep core activation exercises. Start rebuilding your foundation at your own pace.",
  workoutPostpartumGentleTitle: "Gentle Postpartum Movement",
  workoutPostpartumGentleDesc: "Baby-friendly walks and gentle stretches. A calm way to ease back into movement after birth.",
  workoutPerimenopauseStrengthTitle: "Bone-Supporting Bodyweight",
  workoutPerimenopauseStrengthDesc: "Weight-bearing bodyweight exercises to support bone density. Squats, lunges, and standing presses.",
  workoutPerimenopauseYogaTitle: "Cooling Yoga",
  workoutPerimenopauseYogaDesc: "Cooling yoga poses and forward folds that may help ease hot flash discomfort. Calm, grounded practice.",
  workoutMenopauseBalanceTitle: "Balance & Stability",
  workoutMenopauseBalanceDesc: "Single-leg stands, heel-to-toe walks, and stability exercises. Builds confidence and helps prevent falls.",
  workoutMenopauseWalkingTitle: "Brisk Walking",
  workoutMenopauseWalkingDesc: "A 25-minute brisk walk to support cardiovascular health. Maintain a pace where you can still hold a conversation.",

  // ─── Life-stage warmups ───────────────────────────────────────────────────
  warmupPregnancy: "5 minutes of gentle shoulder rolls, seated hip circles, and deep diaphragmatic breathing. Move at your own pace.",
  warmupPostpartum: "5 minutes of gentle neck stretches, wrist circles, and seated pelvic tilts. Be kind to your body.",
  warmupPerimenopause: "5 minutes of gentle arm swings, hip circles, and light marching in place. Focus on loosening up.",
  warmupMenopause: "5 minutes of seated ankle circles, arm reaches, and gentle torso twists. Warm up every joint before moving.",

  // ─── Life-stage cooldowns ─────────────────────────────────────────────────
  cooldownPregnancy: "5 minutes of seated side stretches, gentle neck rolls, and slow deep breathing. Stay comfortable throughout.",
  cooldownPostpartum: "5 minutes of gentle full-body stretches, deep breathing, and a moment of stillness. You deserve this rest.",
  cooldownPerimenopause: "5 minutes of forward fold, seated twist, and cooling breath (inhale through the nose, exhale through the mouth).",
  cooldownMenopause: "5 minutes of gentle seated stretches, slow breathing, and progressive relaxation from toes to head.",

  // ─── Life-stage tips ──────────────────────────────────────────────────────
  tipPregnancy1: "Stay hydrated before, during, and after movement",
  tipPregnancy2: "Avoid lying flat on your back after 20 weeks",
  tipPregnancy3: "Listen to your body — stop if anything feels uncomfortable",
  tipPostpartum1: "Start slow — recovery takes time and patience",
  tipPostpartum2: "Focus on pelvic floor exercises before adding intensity",
  tipPerimenopause1: "Weight-bearing exercise supports bone health during hormonal changes",
  tipPerimenopause2: "Cooling yoga and breathwork can help with hot flash discomfort",
  tipMenopause1: "Balance exercises help build stability and prevent falls",
  tipMenopause2: "Regular walking supports heart health and mood",

  // ─── Life-stage avoid lists ───────────────────────────────────────────────
  avoidPregnancy1: "High-impact jumping or jarring movements",
  avoidPregnancy2: "Lying flat on your back (after week 20)",
  avoidPregnancy3: "Exercising in extreme heat or to the point of overheating",
  avoidPostpartum1: "Intense core work until cleared by your healthcare provider",
  avoidPostpartum2: "Running or high-impact activity (usually wait 12+ weeks)",
  avoidPerimenopause1: "Exercising in extreme heat",
  avoidPerimenopause2: "Pushing through exhaustion — rest when you need to",
  avoidMenopause1: "High-impact activities that stress joints",
  avoidMenopause2: "Skipping your warm-up — joints need extra preparation",

  // ─── Life-stage labels ────────────────────────────────────────────────────
  phasePregnancy: "Pregnancy",
  phasePostpartum: "Postpartum",
  phasePerimenopause: "Perimenopause",
  phaseMenopause: "Menopause",
};

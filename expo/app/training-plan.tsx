import React, { useMemo, useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Moon,
  Sprout,
  Sparkles,
  Flower2,
  Zap,
  Activity,
  Heart,
  Dumbbell,
  Music,
  AlertTriangle,
  Check,
  Info,
  Clock,
  Flame,
  Play,
  Pause,
  SkipForward,
  X,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useApp } from "@/contexts/AppContext";
import { CyclePhase } from "@/types";
import { generateDailyTrainingPlan, WorkoutSuggestion, WorkoutIntensity, Exercise } from "@/lib/trainingPlans";
import { trainingTranslations } from "@/constants/trainingTranslations";
import ExerciseSketch from "@/components/ExerciseSketch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { maybeRequestReview } from "@/lib/reviewPrompt";

// ─── Icon Map ────────────────────────────────────────────────────────────────

const WORKOUT_ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Heart,
  Footprints: Activity, // Footprints not in lucide-react-native
  Moon,
  Dumbbell,
  Music,
  Zap,
  Activity,
  Sparkles,
  Flower2,
  Flame,
};

const PHASE_CONFIG: Record<CyclePhase, { color: string; icon: React.ComponentType<{ size?: number; color?: string }>; labelKey: string }> = {
  menstrual: { color: "#E89BA4", icon: Moon, labelKey: "phaseMenstrual" },
  follicular: { color: "#8BC9A3", icon: Sprout, labelKey: "phaseFollicular" },
  ovulation: { color: "#F4C896", icon: Sparkles, labelKey: "phaseOvulation" },
  luteal: { color: "#B8A4E8", icon: Flower2, labelKey: "phaseLuteal" },
};

const INTENSITY_ORDER: WorkoutIntensity[] = ['rest', 'light', 'moderate', 'intense'];

const INTENSITY_COLORS: Record<WorkoutIntensity, string> = {
  rest: "#B0A8B8",
  light: "#8BC9A3",
  moderate: "#F4C896",
  intense: "#E89BA4",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

// t() is created inside the component to be language-aware; see below.

// ─── Screen ──────────────────────────────────────────────────────────────────

// ─── Helper: parse reps string to seconds (for timed exercises) ─────────────

function parseRepsToSeconds(reps: string): number | null {
  const secMatch = reps.match(/^(\d+)\s*sec/i);
  if (secMatch) return parseInt(secMatch[1], 10);
  const minMatch = reps.match(/^(\d+)\s*min/i);
  if (minMatch) return parseInt(minMatch[1], 10) * 60;
  return null; // rep-based, not timed
}

function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function TrainingPlanScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { enrichedPhaseInfo, latestScan, todayCheckIn, userProfile, healthData, language } = useApp();

  const tt = trainingTranslations[language] ?? trainingTranslations.en;
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    let value = tt[key] ?? key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value.replace(`{${k}}`, String(v));
      });
    }
    return value;
  }, [tt]);

  // Normalize exercise name to camelCase key
  const toExKey = useCallback((name: string): string => {
    return name
      .replace(/['']/g, '')
      .replace(/[^a-zA-Z0-9 ]/g, ' ')
      .trim()
      .split(/\s+/)
      .map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('');
  }, []);

  const tExName = useCallback((name: string): string => {
    const key = `ex.${toExKey(name)}.name`;
    return tt[key] ?? name;
  }, [tt, toExKey]);

  const tExDesc = useCallback((desc: string, name: string): string => {
    const key = `ex.${toExKey(name)}.desc`;
    return tt[key] ?? desc;
  }, [tt, toExKey]);

  const mgKeyMap: Record<string, string> = useMemo(() => ({
    'Core': 'mg.core', 'Hips': 'mg.hips', 'Back': 'mg.back', 'Full Body': 'mg.fullBody',
    'Chest': 'mg.chest', 'Legs': 'mg.legs', 'Glutes': 'mg.glutes', 'Triceps': 'mg.triceps',
    'Quads': 'mg.quads', 'Hamstrings': 'mg.hamstrings', 'Shoulders': 'mg.shoulders', 'Arms': 'mg.arms',
    'Obliques': 'mg.obliques', 'Abs': 'mg.abs', 'Balance': 'mg.balance', 'Ankles': 'mg.ankles',
    'Cardio': 'mg.cardio', 'Pelvic Floor': 'mg.pelvicFloor', 'Spine': 'mg.spine', 'Neck': 'mg.neck',
    'Calves': 'mg.calves', 'Flexibility': 'mg.flexibility', 'Breathwork': 'mg.breathwork',
    'Relaxation': 'mg.relaxation', 'Lower Body': 'mg.lowerBody', 'Upper Body': 'mg.upperBody',
    'Cardiovascular': 'mg.cardiovascular', 'Hip Flexors': 'mg.hipFlexors',
    'Hip Abductors': 'mg.hipAbductors', 'Inner Thighs': 'mg.innerThighs', 'Diaphragm': 'mg.diaphragm',
  }), []);

  const tMuscleGroup = useCallback((mg: string): string => {
    const key = mgKeyMap[mg];
    return key ? (tt[key] ?? mg) : mg;
  }, [tt, mgKeyMap]);

  const [expandedWarmup, setExpandedWarmup] = useState(true);
  const [expandedCooldown, setExpandedCooldown] = useState(true);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);

  // ─── Timer state ──────────────────────────────────────────────────────────
  const [timerActive, setTimerActive] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [timerWorkout, setTimerWorkout] = useState<Exercise[] | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Refs for values accessed in timer callbacks to avoid stale closures
  const currentExerciseIndexRef = useRef(currentExerciseIndex);
  const currentSetRef = useRef(currentSet);
  const isRestingRef = useRef(isResting);
  const timerWorkoutRef = useRef(timerWorkout);
  currentExerciseIndexRef.current = currentExerciseIndex;
  currentSetRef.current = currentSet;
  isRestingRef.current = isResting;
  timerWorkoutRef.current = timerWorkout;

  const phase = enrichedPhaseInfo?.phase ?? "follicular";
  const phaseDay = enrichedPhaseInfo?.phaseDay ?? 1;
  const phaseConfig = PHASE_CONFIG[phase];
  const PhaseIcon = phaseConfig.icon;

  const lifeStage = userProfile?.lifeStage ?? 'regular';
  const weeksPregnant = userProfile?.weeksPregnant;

  const plan = useMemo(
    () => generateDailyTrainingPlan(phase, phaseDay, latestScan ?? null, todayCheckIn ?? null, lifeStage, weeksPregnant, healthData),
    [phase, phaseDay, latestScan, todayCheckIn, lifeStage, weeksPregnant, healthData],
  );

  // Check if workout was already completed today
  React.useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    AsyncStorage.getItem(`training_completed_${todayStr}`).then((val) => {
      if (val === "true") setWorkoutCompleted(true);
    });
  }, []);

  // ─── Timer countdown effect ───────────────────────────────────────────────
  const isCounting = timerActive && !timerPaused && secondsLeft > 0;
  useEffect(() => {
    if (isCounting) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCounting]);

  // ─── Total elapsed timer ──────────────────────────────────────────────────
  useEffect(() => {
    if (timerActive && !timerPaused) {
      elapsedRef.current = setInterval(() => {
        setTotalElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (elapsedRef.current) clearInterval(elapsedRef.current);
    };
  }, [timerActive, timerPaused]);

  const handleWorkoutComplete = useCallback(async () => {
    setTimerActive(false);
    setShowCompletion(true);
    const todayStr = new Date().toISOString().split("T")[0];
    await AsyncStorage.setItem(`training_completed_${todayStr}`, "true");
    await AsyncStorage.setItem(`training_time_${todayStr}`, String(totalElapsed));
    setWorkoutCompleted(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Positive moment — maybe ask for a review
    maybeRequestReview();
  }, [totalElapsed]);

  const advanceToNext = useCallback(() => {
    const workout = timerWorkoutRef.current;
    if (!workout) return;
    const idx = currentExerciseIndexRef.current;
    const set = currentSetRef.current;
    const exercise = workout[idx];
    if (!exercise) return;

    if (set < exercise.sets) {
      // Next set of same exercise
      setCurrentSet((prev) => prev + 1);
      setIsResting(false);
      const secs = parseRepsToSeconds(exercise.reps);
      setSecondsLeft(secs ?? 30); // default 30s for rep-based
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else if (idx < workout.length - 1) {
      // Next exercise
      const nextIdx = idx + 1;
      setCurrentExerciseIndex(nextIdx);
      setCurrentSet(1);
      setIsResting(false);
      const secs = parseRepsToSeconds(workout[nextIdx].reps);
      setSecondsLeft(secs ?? 30);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } else {
      // Workout complete!
      handleWorkoutComplete();
    }
  }, [handleWorkoutComplete]);

  // ─── Auto-advance when timer reaches 0 ────────────────────────────────────
  useEffect(() => {
    if (!timerActive || timerPaused || secondsLeft > 0) return;
    const workout = timerWorkoutRef.current;
    if (!workout) return;
    // Timer just hit 0, decide what's next
    const exercise = workout[currentExerciseIndexRef.current];
    if (!exercise) return;

    if (isRestingRef.current) {
      // Rest is over, move to next set or exercise
      advanceToNext();
    } else {
      // Exercise portion done, start rest if there is one
      if (exercise.restSeconds > 0 && (currentSetRef.current < exercise.sets || currentExerciseIndexRef.current < workout.length - 1)) {
        setIsResting(true);
        setSecondsLeft(exercise.restSeconds);
      } else {
        advanceToNext();
      }
    }
  }, [secondsLeft, timerActive, timerPaused, advanceToNext]);

  const handleStartTimer = useCallback((exercises: Exercise[]) => {
    setTimerWorkout(exercises);
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
    setIsResting(false);
    setTotalElapsed(0);
    setTimerPaused(false);
    setShowCompletion(false);
    const secs = parseRepsToSeconds(exercises[0].reps);
    setSecondsLeft(secs ?? 30);
    setTimerActive(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, []);

  const handleEndWorkout = useCallback(() => {
    setTimerActive(false);
    setTimerWorkout(null);
    setShowCompletion(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (elapsedRef.current) clearInterval(elapsedRef.current);
  }, []);

  const handleStartWorkout = useCallback(async () => {
    const todayStr = new Date().toISOString().split("T")[0];
    await AsyncStorage.setItem(`training_completed_${todayStr}`, "true");
    setWorkoutCompleted(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const styles = useMemo(() => createStyles(colors, phaseConfig.color), [colors, phaseConfig.color]);

  const renderIntensityDots = () => {
    const currentIndex = INTENSITY_ORDER.indexOf(plan.intensity);
    return (
      <View style={styles.intensityRow}>
        {INTENSITY_ORDER.map((level, i) => (
          <View key={level} style={styles.intensityItem}>
            <View
              style={[
                styles.intensityDot,
                i <= currentIndex
                  ? { backgroundColor: INTENSITY_COLORS[plan.intensity] }
                  : { backgroundColor: colors.borderLight },
              ]}
            />
            <Text style={[styles.intensityDotLabel, i <= currentIndex && { color: colors.text }]}>
              {t(level)}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderWorkoutCard = (workout: WorkoutSuggestion, isPrimary: boolean) => {
    const IconComp = WORKOUT_ICON_MAP[workout.icon] || Activity;
    const workoutColor = isPrimary ? phaseConfig.color : colors.textSecondary;

    return (
      <View style={[styles.workoutCard, isPrimary ? styles.primaryCard : styles.secondaryCard]}>
        <View style={styles.workoutCardHeader}>
          <Text style={[styles.workoutLabel, { color: workoutColor }]}>
            {isPrimary ? t("primaryWorkout") : t("alternative")}
          </Text>
          {isPrimary && plan.scanAdjustment && (
            <View style={styles.scanBadge}>
              <Info size={12} color={phaseConfig.color} />
              <Text style={[styles.scanBadgeText, { color: phaseConfig.color }]}>{t("scanAdjusted")}</Text>
            </View>
          )}
        </View>

        <View style={styles.workoutMain}>
          <View style={[styles.workoutIconBox, { backgroundColor: workoutColor + "20" }]}>
            <IconComp size={28} color={workoutColor} />
          </View>
          <View style={styles.workoutInfo}>
            <Text style={styles.workoutTitle}>{t(workout.titleKey)}</Text>
            <Text style={styles.workoutDesc}>{t(workout.descriptionKey)}</Text>
          </View>
        </View>

        <View style={styles.workoutMeta}>
          {workout.durationMinutes > 0 && (
            <View style={styles.metaBadge}>
              <Clock size={14} color={colors.textSecondary} />
              <Text style={styles.metaText}>{t("duration", { n: workout.durationMinutes })}</Text>
            </View>
          )}
          {workout.calorieEstimate > 0 && (
            <View style={styles.metaBadge}>
              <Flame size={14} color={colors.textSecondary} />
              <Text style={styles.metaText}>{t("calories", { n: workout.calorieEstimate })}</Text>
            </View>
          )}
          <View style={[styles.intensityBadge, { backgroundColor: INTENSITY_COLORS[workout.intensity] + "20" }]}>
            <Text style={[styles.intensityBadgeText, { color: INTENSITY_COLORS[workout.intensity] }]}>
              {t(workout.intensity)}
            </Text>
          </View>
        </View>

        {/* Exercise List (always expanded) */}
        {workout.exercises && workout.exercises.length > 0 && (
          <>
            <View style={styles.exerciseToggle}>
              <Text style={styles.exerciseToggleText}>{t("exercises")} ({workout.exercises.length})</Text>
            </View>
            <View style={styles.exerciseList}>
              {workout.exercises.map((ex, i) => (
                <View key={i} style={[styles.exerciseRow, i < workout.exercises!.length - 1 && styles.exerciseRowBorder]}>
                  {ex.sketchType ? (
                    <View style={[styles.exerciseSketchBox, { backgroundColor: workoutColor + "12" }]}>
                      <ExerciseSketch type={ex.sketchType} color={workoutColor} size={52} />
                    </View>
                  ) : (
                    <View style={[styles.exerciseIconCircle, { backgroundColor: workoutColor + "15" }]}>
                      {(() => { const ExIcon = WORKOUT_ICON_MAP[ex.icon] || Activity; return <ExIcon size={16} color={workoutColor} />; })()}
                    </View>
                  )}
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{tExName(ex.name)}</Text>
                    <Text style={styles.exerciseMeta}>
                      {t("sets", { n: ex.sets })} × {ex.reps}
                      {ex.restSeconds > 0 ? ` · ${t("restTime", { n: ex.restSeconds })}` : ''}
                    </Text>
                    {ex.muscleGroups && ex.muscleGroups.length > 0 && (
                      <Text style={styles.exerciseMuscles}>{ex.muscleGroups.map(tMuscleGroup).join(' · ')}</Text>
                    )}
                    <Text style={styles.exerciseDesc}>{tExDesc(ex.description, ex.name)}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {isPrimary && (
          <View style={styles.buttonRow}>
            {workout.exercises && workout.exercises.length > 0 && !workoutCompleted && (
              <TouchableOpacity
                style={[styles.startButton, { flex: 1 }]}
                onPress={() => handleStartTimer(workout.exercises!)}
                activeOpacity={0.7}
                accessibilityLabel="Start workout timer"
                accessibilityRole="button"
              >
                <Play size={18} color="#FFFFFF" />
                <Text style={styles.startButtonText}>{t("startWorkout")}</Text>
              </TouchableOpacity>
            )}
            {workoutCompleted && (
              <View style={[styles.startButton, styles.startButtonCompleted, { flex: 1 }]}>
                <Check size={18} color="#FFFFFF" />
                <Text style={styles.startButtonText}>{t("completed")}</Text>
              </View>
            )}
            {!workout.exercises?.length && !workoutCompleted && (
              <TouchableOpacity
                style={[styles.startButton, { flex: 1 }]}
                onPress={handleStartWorkout}
                activeOpacity={0.7}
                accessibilityLabel="Mark workout complete"
                accessibilityRole="button"
              >
                <Text style={styles.startButtonText}>{t("startWorkout")}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{t("title")}</Text>
            <Text style={styles.headerSubtitle}>{t("subtitle")}</Text>
          </View>
        </View>

        {/* Phase Banner */}
        <View style={[styles.phaseBanner, { backgroundColor: phaseConfig.color + "15" }]}>
          <View style={[styles.phaseIconBox, { backgroundColor: phaseConfig.color + "25" }]}>
            <PhaseIcon size={22} color={phaseConfig.color} />
          </View>
          <View style={styles.phaseInfo}>
            <Text style={[styles.phaseLabel, { color: phaseConfig.color }]}>{t(phaseConfig.labelKey)}</Text>
            <Text style={styles.phaseDay}>{t("day")} {phaseDay}</Text>
          </View>
        </View>

        {/* Intensity Indicator */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t("intensity")}</Text>
          {renderIntensityDots()}
        </View>

        {/* Scan Adjustment Badge */}
        {plan.scanAdjustment && (
          <View style={[styles.scanAdjustCard, { borderLeftColor: phaseConfig.color }]}>
            <Info size={16} color={phaseConfig.color} />
            <Text style={styles.scanAdjustText}>{t(plan.scanAdjustment)}</Text>
          </View>
        )}

        {/* ─── Warm-up (before primary workout) ─── */}
        <TouchableOpacity
          style={styles.collapsibleHeader}
          onPress={() => setExpandedWarmup(!expandedWarmup)}
          activeOpacity={0.7}
          accessibilityLabel="Toggle warm up section"
          accessibilityRole="button"
        >
          <Text style={styles.collapsibleTitle}>{t("warmup")}</Text>
          {expandedWarmup ? (
            <ChevronUp size={20} color={colors.textSecondary} />
          ) : (
            <ChevronDown size={20} color={colors.textSecondary} />
          )}
        </TouchableOpacity>
        {expandedWarmup && (
          <View style={styles.collapsibleContent}>
            <Text style={styles.collapsibleText}>{t(plan.warmup)}</Text>
          </View>
        )}

        {/* ─── Primary Workout ─── */}
        {renderWorkoutCard(plan.primaryWorkout, true)}

        {/* ─── Cool-down (after primary workout) ─── */}
        <TouchableOpacity
          style={styles.collapsibleHeader}
          onPress={() => setExpandedCooldown(!expandedCooldown)}
          activeOpacity={0.7}
          accessibilityLabel="Toggle cool down section"
          accessibilityRole="button"
        >
          <Text style={styles.collapsibleTitle}>{t("cooldown")}</Text>
          {expandedCooldown ? (
            <ChevronUp size={20} color={colors.textSecondary} />
          ) : (
            <ChevronDown size={20} color={colors.textSecondary} />
          )}
        </TouchableOpacity>
        {expandedCooldown && (
          <View style={styles.collapsibleContent}>
            <Text style={styles.collapsibleText}>{t(plan.cooldown)}</Text>
          </View>
        )}

        {/* ─── Alternative Workout ─── */}
        {renderWorkoutCard(plan.alternativeWorkout, false)}

        {/* Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("tips")}</Text>
          {plan.tips.map((tipKey, i) => (
            <View key={i} style={styles.tipRow}>
              <View style={[styles.tipBullet, { backgroundColor: phaseConfig.color }]} />
              <Text style={styles.tipText}>{t(tipKey)}</Text>
            </View>
          ))}
        </View>

        {/* Better to Skip */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("avoid")}</Text>
          {plan.avoidList.map((avoidKey, i) => (
            <View key={i} style={styles.avoidRow}>
              <AlertTriangle size={14} color={colors.error} />
              <Text style={styles.avoidText}>{t(avoidKey)}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ─── Workout Timer Modal ─────────────────────────────────────────── */}
      <Modal
        visible={timerActive || showCompletion}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <SafeAreaView style={styles.timerContainer} edges={["top", "bottom"]}>
          {showCompletion ? (
            /* ─── Completion Screen ──────────────────────────────────────── */
            <View style={styles.completionContainer}>
              <View style={[styles.completionIconCircle, { backgroundColor: "#8BC9A3" + "20" }]}>
                <Check size={48} color="#8BC9A3" />
              </View>
              <Text style={styles.completionTitle}>{t("workoutComplete")}</Text>
              <Text style={styles.completionSubtitle}>{t("greatJob")}</Text>
              <View style={styles.completionTimeBox}>
                <Clock size={20} color={phaseConfig.color} />
                <Text style={styles.completionTimeLabel}>{t("totalTime")}</Text>
                <Text style={[styles.completionTime, { color: phaseConfig.color }]}>
                  {formatTime(totalElapsed)}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.timerButton, { backgroundColor: phaseConfig.color, marginTop: 32 }]}
                onPress={handleEndWorkout}
                activeOpacity={0.7}
              >
                <Text style={styles.timerButtonText}>{t("done")}</Text>
              </TouchableOpacity>
            </View>
          ) : timerWorkout ? (
            /* ─── Active Timer ───────────────────────────────────────────── */
            <View style={styles.timerContent}>
              {/* Header */}
              <View style={styles.timerHeader}>
                <TouchableOpacity onPress={handleEndWorkout} style={styles.timerCloseBtn}>
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.timerElapsed}>
                  <Clock size={14} color={colors.textSecondary} />
                  <Text style={styles.timerElapsedText}>
                    {t("elapsed")}: {formatTime(totalElapsed)}
                  </Text>
                </View>
              </View>

              {/* Progress indicator */}
              <Text style={styles.timerProgress}>
                {t("currentExercise", { current: currentExerciseIndex + 1, total: timerWorkout.length })}
              </Text>
              <Text style={styles.timerSetProgress}>
                {t("currentSet", { current: currentSet, total: timerWorkout[currentExerciseIndex]?.sets ?? 1 })}
              </Text>

              {/* Progress bar */}
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      backgroundColor: phaseConfig.color,
                      width: `${((currentExerciseIndex / timerWorkout.length) * 100)}%`,
                    },
                  ]}
                />
              </View>

              {/* Current exercise */}
              <View style={styles.timerExerciseBox}>
                {(() => {
                  const ex = timerWorkout[currentExerciseIndex];
                  if (!ex) return null;
                  const ExIcon = WORKOUT_ICON_MAP[ex.icon] || Activity;
                  return (
                    <>
                      <View style={[styles.timerExIconCircle, { backgroundColor: phaseConfig.color + "20" }]}>
                        <ExIcon size={32} color={phaseConfig.color} />
                      </View>
                      <Text style={styles.timerExName}>
                        {isResting ? t("resting") : tExName(ex.name)}
                      </Text>
                      {!isResting && (
                        <Text style={styles.timerExDesc}>{tExDesc(ex.description, ex.name)}</Text>
                      )}
                    </>
                  );
                })()}
              </View>

              {/* Countdown */}
              <Text style={[styles.timerCountdown, { color: isResting ? "#F4C896" : phaseConfig.color }]}>
                {formatTime(secondsLeft)}
              </Text>

              {/* Controls */}
              <View style={styles.timerControls}>
                <TouchableOpacity
                  style={[styles.timerControlBtn, { backgroundColor: colors.surface }]}
                  onPress={handleEndWorkout}
                  activeOpacity={0.7}
                >
                  <X size={20} color={colors.error} />
                  <Text style={[styles.timerControlLabel, { color: colors.error }]}>
                    {t("endWorkout")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.timerControlBtn, { backgroundColor: phaseConfig.color + "20" }]}
                  onPress={() => {
                    setTimerPaused(!timerPaused);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  activeOpacity={0.7}
                >
                  {timerPaused ? (
                    <Play size={20} color={phaseConfig.color} />
                  ) : (
                    <Pause size={20} color={phaseConfig.color} />
                  )}
                  <Text style={[styles.timerControlLabel, { color: phaseConfig.color }]}>
                    {timerPaused ? t("resume") : t("pause")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.timerControlBtn, { backgroundColor: colors.surface }]}
                  onPress={() => {
                    if (timerRef.current) clearInterval(timerRef.current);
                    setSecondsLeft(0);
                  }}
                  activeOpacity={0.7}
                >
                  <SkipForward size={20} color={colors.text} />
                  <Text style={styles.timerControlLabel}>{t("nextExercise")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

function createStyles(colors: typeof Colors.light, phaseColor: string) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      gap: 12,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    headerText: {
      flex: 1,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
    },
    headerSubtitle: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 2,
    },

    // Phase banner
    phaseBanner: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 16,
      padding: 16,
      marginBottom: 20,
      gap: 12,
    },
    phaseIconBox: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
    },
    phaseInfo: {
      flex: 1,
    },
    phaseLabel: {
      fontSize: 16,
      fontWeight: "700",
    },
    phaseDay: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 2,
    },

    // Intensity
    section: {
      marginBottom: 20,
    },
    sectionLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 10,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 12,
    },
    intensityRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 8,
    },
    intensityItem: {
      flex: 1,
      alignItems: "center",
      gap: 6,
    },
    intensityDot: {
      width: 32,
      height: 8,
      borderRadius: 4,
    },
    intensityDotLabel: {
      fontSize: 11,
      color: colors.textTertiary,
      fontWeight: "500",
    },

    // Scan adjustment
    scanAdjustCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 14,
      marginBottom: 16,
      gap: 10,
      borderLeftWidth: 4,
    },
    scanAdjustText: {
      flex: 1,
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
    },

    // Workout cards
    workoutCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    primaryCard: {
      borderWidth: 1,
      borderColor: phaseColor + "30",
    },
    secondaryCard: {
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    workoutCardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
    },
    workoutLabel: {
      fontSize: 12,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    scanBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: phaseColor + "15",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    scanBadgeText: {
      fontSize: 11,
      fontWeight: "600",
    },
    workoutMain: {
      flexDirection: "row",
      gap: 14,
      marginBottom: 16,
    },
    workoutIconBox: {
      width: 56,
      height: 56,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    workoutInfo: {
      flex: 1,
    },
    workoutTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    workoutDesc: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 19,
    },
    workoutMeta: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 16,
    },
    metaBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: colors.surface,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 10,
    },
    metaText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    intensityBadge: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 10,
    },
    intensityBadgeText: {
      fontSize: 12,
      fontWeight: "600",
    },
    startButton: {
      backgroundColor: phaseColor,
      borderRadius: 16,
      paddingVertical: 14,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 8,
    },
    startButtonCompleted: {
      backgroundColor: "#8BC9A3",
    },
    startButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },

    // Collapsible
    collapsibleHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 16,
      marginBottom: 4,
    },
    collapsibleTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
    },
    collapsibleContent: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 16,
      marginBottom: 16,
    },
    collapsibleText: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 21,
    },

    // Tips
    tipRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      marginBottom: 10,
    },
    tipBullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginTop: 6,
    },
    tipText: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
    },

    // Avoid
    avoidRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
      marginBottom: 10,
    },
    avoidText: {
      flex: 1,
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },

    // Exercise list
    exerciseToggle: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 4,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
      marginTop: 4,
    },
    exerciseToggleText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    exerciseList: {
      gap: 12,
      paddingTop: 8,
    },
    exerciseRow: {
      flexDirection: "row",
      gap: 10,
      alignItems: "flex-start",
    },
    exerciseIconCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 2,
    },
    exerciseInfo: {
      flex: 1,
    },
    exerciseName: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 2,
    },
    exerciseMeta: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    exerciseDesc: {
      fontSize: 12,
      color: colors.textTertiary,
      fontStyle: "italic",
    },
    exerciseRowBorder: {
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    exerciseSketchBox: {
      width: 64,
      height: 64,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 2,
    },
    exerciseMuscles: {
      fontSize: 11,
      color: colors.textTertiary,
      marginBottom: 2,
      fontWeight: "500",
      textTransform: "uppercase",
      letterSpacing: 0.3,
    },
    buttonRow: {
      flexDirection: "row",
      gap: 10,
      marginTop: 4,
    },

    // Timer modal
    timerContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    timerContent: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 8,
    },
    timerHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    timerCloseBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    timerElapsed: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    timerElapsedText: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    timerProgress: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: 4,
    },
    timerSetProgress: {
      fontSize: 13,
      color: colors.textTertiary,
      textAlign: "center",
      marginBottom: 12,
    },
    progressBarBg: {
      height: 4,
      backgroundColor: colors.borderLight,
      borderRadius: 2,
      marginBottom: 32,
      overflow: "hidden",
    },
    progressBarFill: {
      height: 4,
      borderRadius: 2,
    },
    timerExerciseBox: {
      alignItems: "center",
      marginBottom: 24,
    },
    timerExIconCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    timerExName: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
      marginBottom: 8,
    },
    timerExDesc: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
      paddingHorizontal: 20,
    },
    timerCountdown: {
      fontSize: 72,
      fontWeight: "700",
      textAlign: "center",
      marginBottom: 40,
      fontVariant: ["tabular-nums"],
    },
    timerControls: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 16,
      marginTop: "auto",
      paddingBottom: 24,
    },
    timerControlBtn: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 16,
      gap: 6,
      minWidth: 90,
    },
    timerControlLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.text,
    },
    timerButton: {
      paddingVertical: 16,
      paddingHorizontal: 48,
      borderRadius: 16,
      alignItems: "center",
    },
    timerButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },

    // Completion screen
    completionContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
    },
    completionIconCircle: {
      width: 96,
      height: 96,
      borderRadius: 48,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
    },
    completionTitle: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
    },
    completionSubtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: 32,
      lineHeight: 22,
    },
    completionTimeBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: colors.surface,
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderRadius: 16,
    },
    completionTimeLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    completionTime: {
      fontSize: 20,
      fontWeight: "700",
      fontVariant: ["tabular-nums"],
    },
  });
}

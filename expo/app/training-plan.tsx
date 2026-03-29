import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
} from "lucide-react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useApp } from "@/contexts/AppContext";
import { CyclePhase } from "@/types";
import { generateDailyTrainingPlan, WorkoutSuggestion, WorkoutIntensity } from "@/lib/trainingPlans";
import { trainingTranslations as tt } from "@/constants/trainingTranslations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

// ─── Icon Map ────────────────────────────────────────────────────────────────

const WORKOUT_ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Heart,
  Footprints: Activity,
  Moon,
  Dumbbell,
  Music,
  Zap,
  Activity,
  Sparkles,
  Flower2,
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

function t(key: string, params?: Record<string, string | number>): string {
  let value = tt[key] ?? key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      value = value.replace(`{${k}}`, String(v));
    });
  }
  return value;
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function TrainingPlanScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { enrichedPhaseInfo, latestScan, todayCheckIn, userProfile } = useApp();

  const [expandedWarmup, setExpandedWarmup] = useState(false);
  const [expandedCooldown, setExpandedCooldown] = useState(false);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);

  const phase = enrichedPhaseInfo?.phase ?? "follicular";
  const phaseDay = enrichedPhaseInfo?.phaseDay ?? 1;
  const phaseConfig = PHASE_CONFIG[phase];
  const PhaseIcon = phaseConfig.icon;

  const lifeStage = userProfile?.lifeStage ?? 'regular';
  const weeksPregnant = userProfile?.weeksPregnant;

  const plan = useMemo(
    () => generateDailyTrainingPlan(phase, phaseDay, latestScan ?? null, todayCheckIn ?? null, lifeStage, weeksPregnant),
    [phase, phaseDay, latestScan, todayCheckIn, lifeStage, weeksPregnant],
  );

  // Check if workout was already completed today
  React.useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    AsyncStorage.getItem(`training_completed_${todayStr}`).then((val) => {
      if (val === "true") setWorkoutCompleted(true);
    });
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
              <Text style={[styles.scanBadgeText, { color: phaseConfig.color }]}>Scan-adjusted</Text>
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

        {isPrimary && (
          <TouchableOpacity
            style={[
              styles.startButton,
              workoutCompleted && styles.startButtonCompleted,
            ]}
            onPress={handleStartWorkout}
            disabled={workoutCompleted}
            activeOpacity={0.7}
            accessibilityLabel={workoutCompleted ? "Workout completed" : "Start workout"}
            accessibilityRole="button"
          >
            {workoutCompleted ? (
              <>
                <Check size={18} color="#FFFFFF" />
                <Text style={styles.startButtonText}>{t("completed")}</Text>
              </>
            ) : (
              <Text style={styles.startButtonText}>{t("startWorkout")}</Text>
            )}
          </TouchableOpacity>
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
            <Text style={styles.phaseDay}>Day {phaseDay}</Text>
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

        {/* Primary Workout */}
        {renderWorkoutCard(plan.primaryWorkout, true)}

        {/* Alternative Workout */}
        {renderWorkoutCard(plan.alternativeWorkout, false)}

        {/* Warm-up (collapsible) */}
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

        {/* Cool-down (collapsible) */}
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
  });
}

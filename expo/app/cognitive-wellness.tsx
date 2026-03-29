import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Brain,
  Eye,
  Heart,
  Moon,
  TrendingUp,
  TrendingDown,
  Minus,
  BookOpen,
  Users,
  FileText,
  Sparkles,
  Clock,
  Lightbulb,
  ArrowLeft,
  Activity,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import Colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useApp } from "@/contexts/AppContext";
import CircularProgress from "@/components/CircularProgress";
import {
  calculateCognitiveWellness,
  getCognitiveScoreHistory,
  getPhaseBrainTip,
  getAllBrainExercises,
  CognitiveAssessment,
  CognitiveFactor,
  BrainExercise,
} from "@/lib/cognitiveWellness";
import { cognitiveTranslations as ct } from "@/constants/cognitiveTranslations";

// ─── Icon Map ────────────────────────────────────────────────────────────────

const FACTOR_ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Brain, Eye, Heart, Moon,
};

const EXERCISE_ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  BookOpen, Heart, Users, FileText, Sparkles, Hash: Activity,
};

const TREND_ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  improving: TrendingUp,
  stable: Minus,
  declining: TrendingDown,
};

const CATEGORY_COLORS: Record<string, string> = {
  memory: "#9B85D6",
  focus: "#4D96FF",
  creativity: "#F4C896",
  verbal: "#8BC9A3",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hexToChartColor(hex: string): (opacity: number) => string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (opacity = 1) => `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function getCategoryLabel(category: BrainExercise["category"]): string {
  switch (category) {
    case "memory": return ct.categoryMemory;
    case "focus": return ct.categoryFocus;
    case "creativity": return ct.categoryCreativity;
    case "verbal": return ct.categoryVerbal;
    default: return category;
  }
}

function getScoreCategoryLabel(cat: CognitiveAssessment["category"]): string {
  switch (cat) {
    case "sharp": return ct.scoreSharp;
    case "good": return ct.scoreGood;
    case "fair": return ct.scoreFair;
    case "needs-attention": return ct.scoreNeedsAttention;
  }
}

function getScoreCategoryColor(cat: CognitiveAssessment["category"], themeColors: typeof Colors.light): string {
  switch (cat) {
    case "sharp": return themeColors.statusGood;
    case "good": return themeColors.success;
    case "fair": return themeColors.warning;
    case "needs-attention": return themeColors.error;
  }
}

function getScoreDescription(cat: CognitiveAssessment["category"]): string {
  switch (cat) {
    case "sharp": return ct.sharpDescription;
    case "good": return ct.goodDescription;
    case "fair": return ct.fairDescription;
    case "needs-attention": return ct.needsAttentionDescription;
  }
}

function getTrendColor(trend: CognitiveFactor["trend"], themeColors: typeof Colors.light): string {
  switch (trend) {
    case "improving": return themeColors.statusGood;
    case "stable": return themeColors.textSecondary;
    case "declining": return themeColors.error;
  }
}

function getTrendLabel(trend: CognitiveFactor["trend"]): string {
  switch (trend) {
    case "improving": return ct.trendImproving;
    case "stable": return ct.trendStable;
    case "declining": return ct.trendDeclining;
  }
}

function getExerciseTranslation(key: string): string {
  return (ct as Record<string, string>)[key] || key;
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function CognitiveWellnessScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { userProfile, scans: scanResults, checkIns, enrichedPhaseInfo } = useApp();

  const styles = useMemo(() => createStyles(colors), [colors]);

  const assessment = useMemo(() => {
    if (!userProfile) return null;
    return calculateCognitiveWellness(
      checkIns,
      scanResults,
      userProfile,
      enrichedPhaseInfo?.phase ?? null,
    );
  }, [checkIns, scanResults, userProfile, enrichedPhaseInfo]);

  const scoreHistory = useMemo(() => {
    return getCognitiveScoreHistory(checkIns, scanResults, 30);
  }, [checkIns, scanResults]);

  const allExercises = useMemo(() => getAllBrainExercises(), []);

  const phaseTip = useMemo(() => {
    if (!enrichedPhaseInfo?.phase) return null;
    return getPhaseBrainTip(enrichedPhaseInfo.phase);
  }, [enrichedPhaseInfo]);

  const { width: screenWidth } = useWindowDimensions();

  // Not eligible
  if (!userProfile) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{ct.screenTitle}</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyState}>
          <Brain size={48} color={colors.textTertiary} />
          <Text style={styles.emptyStateText}>{ct.notAvailable}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Not eligible (life stage / age check)
  if (!assessment) {
    const isApplicable =
      userProfile.lifeStage === "perimenopause" ||
      userProfile.lifeStage === "menopause";
    const message = isApplicable ? ct.insufficientData : ct.notAvailable;

    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{ct.screenTitle}</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyState}>
          <Brain size={48} color={colors.textTertiary} />
          <Text style={styles.emptyStateText}>{message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const scoreColor = getScoreCategoryColor(assessment.category, colors);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{ct.screenTitle}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall Score Gauge */}
        <View style={styles.scoreCard}>
          <CircularProgress
            size={140}
            strokeWidth={10}
            progress={assessment.overallScore}
            progressColor={scoreColor}
            trackColor={colors.borderLight}
          >
            <Text style={[styles.scoreValue, { color: scoreColor }]}>
              {assessment.overallScore}
            </Text>
            <Text style={styles.scoreOutOf}>/ 100</Text>
          </CircularProgress>
          <Text style={[styles.scoreCategoryLabel, { color: scoreColor }]}>
            {getScoreCategoryLabel(assessment.category)}
          </Text>
          <Text style={styles.scoreDescription}>
            {getScoreDescription(assessment.category)}
          </Text>
        </View>

        {/* Factor Bars */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{ct.factorsTitle}</Text>
          {assessment.factors.map((factor) => {
            const IconComp = FACTOR_ICON_MAP[factor.icon] || Brain;
            const TrendIcon = TREND_ICON_MAP[factor.trend] || Minus;
            const trendColor = getTrendColor(factor.trend, colors);
            const barPercent = Math.min((factor.score / 10) * 100, 100);

            return (
              <View key={factor.nameKey} style={styles.factorRow}>
                <View style={styles.factorHeader}>
                  <View style={styles.factorLabelRow}>
                    <IconComp size={16} color={colors.primary} />
                    <Text style={styles.factorName}>{factor.name}</Text>
                  </View>
                  <View style={styles.factorTrendRow}>
                    <TrendIcon size={14} color={trendColor} />
                    <Text style={[styles.factorTrendText, { color: trendColor }]}>
                      {getTrendLabel(factor.trend)}
                    </Text>
                    <Text style={styles.factorScore}>
                      {factor.score.toFixed(1)}
                    </Text>
                  </View>
                </View>
                <View style={styles.factorBarTrack}>
                  <View
                    style={[
                      styles.factorBarFill,
                      {
                        width: `${barPercent}%`,
                        backgroundColor: colors.primary,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* Today's Recommended Exercise */}
        {assessment.brainExercises.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{ct.todaysExercise}</Text>
            {assessment.brainExercises.map((exercise) => {
              const ExIcon = EXERCISE_ICON_MAP[exercise.icon] || Brain;
              const catColor = CATEGORY_COLORS[exercise.category] || colors.primary;

              return (
                <View key={exercise.id} style={styles.exerciseCard}>
                  <View style={[styles.exerciseIconBox, { backgroundColor: catColor + "20" }]}>
                    <ExIcon size={24} color={catColor} />
                  </View>
                  <View style={styles.exerciseContent}>
                    <Text style={styles.exerciseTitle}>
                      {getExerciseTranslation(exercise.titleKey)}
                    </Text>
                    <Text style={styles.exerciseDescription}>
                      {getExerciseTranslation(exercise.descriptionKey)}
                    </Text>
                    <View style={styles.exerciseMeta}>
                      <View style={[styles.exerciseBadge, { backgroundColor: catColor + "20" }]}>
                        <Text style={[styles.exerciseBadgeText, { color: catColor }]}>
                          {getCategoryLabel(exercise.category)}
                        </Text>
                      </View>
                      <View style={styles.exerciseDuration}>
                        <Clock size={12} color={colors.textSecondary} />
                        <Text style={styles.exerciseDurationText}>
                          {exercise.durationMinutes} {ct.minutes}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Trend Chart */}
        {scoreHistory.length >= 3 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{ct.trendChartTitle}</Text>
            <LineChart
              data={{
                labels: scoreHistory.slice(-7).map((d) => {
                  const parts = d.date.split("-");
                  return `${parts[1]}/${parts[2]}`;
                }),
                datasets: [
                  {
                    data: scoreHistory.slice(-7).map((d) => d.score),
                    color: hexToChartColor(colors.primary),
                    strokeWidth: 2,
                  },
                ],
              }}
              width={screenWidth - 64}
              height={180}
              yAxisSuffix=""
              yAxisInterval={1}
              fromZero
              chartConfig={{
                backgroundColor: colors.card,
                backgroundGradientFrom: colors.card,
                backgroundGradientTo: colors.card,
                decimalPlaces: 0,
                color: hexToChartColor(colors.primary),
                labelColor: hexToChartColor(colors.textSecondary),
                style: { borderRadius: 12 },
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                  stroke: colors.primary,
                },
              }}
              bezier
              style={{ borderRadius: 12, marginTop: 8 }}
            />
          </View>
        )}

        {scoreHistory.length < 3 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{ct.trendChartTitle}</Text>
            <Text style={styles.emptyChartText}>{ct.noTrendData}</Text>
          </View>
        )}

        {/* Phase Brain Tip */}
        {phaseTip && (
          <View style={styles.sectionCard}>
            <View style={styles.tipHeader}>
              <Lightbulb size={18} color={colors.warning} />
              <Text style={styles.sectionTitle}>{ct.phaseTipsTitle}</Text>
            </View>
            <Text style={styles.tipText}>{phaseTip}</Text>
          </View>
        )}

        {/* Recommendations */}
        {assessment.recommendations.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{ct.recommendationsTitle}</Text>
            {assessment.recommendations.map((rec, i) => (
              <View key={i} style={styles.recRow}>
                <View style={styles.recBullet} />
                <Text style={styles.recText}>{rec}</Text>
              </View>
            ))}
          </View>
        )}

        {/* All Exercises */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{ct.allExercises}</Text>
          {allExercises.map((exercise) => {
            const ExIcon = EXERCISE_ICON_MAP[exercise.icon] || Brain;
            const catColor = CATEGORY_COLORS[exercise.category] || colors.primary;

            return (
              <View key={exercise.id} style={styles.miniExerciseRow}>
                <View style={[styles.miniExerciseIcon, { backgroundColor: catColor + "20" }]}>
                  <ExIcon size={18} color={catColor} />
                </View>
                <View style={styles.miniExerciseContent}>
                  <Text style={styles.miniExerciseTitle}>
                    {getExerciseTranslation(exercise.titleKey)}
                  </Text>
                  <View style={styles.exerciseMeta}>
                    <View style={[styles.exerciseBadge, { backgroundColor: catColor + "20" }]}>
                      <Text style={[styles.exerciseBadgeText, { color: catColor }]}>
                        {getCategoryLabel(exercise.category)}
                      </Text>
                    </View>
                    <View style={styles.exerciseDuration}>
                      <Clock size={11} color={colors.textSecondary} />
                      <Text style={styles.exerciseDurationText}>
                        {exercise.durationMinutes} {ct.minutes}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

function createStyles(colors: typeof Colors.light) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },

    // Score card
    scoreCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 28,
      alignItems: "center",
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    scoreValue: {
      fontSize: 32,
      fontWeight: "800",
    },
    scoreOutOf: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: -2,
    },
    scoreCategoryLabel: {
      fontSize: 18,
      fontWeight: "700",
      marginTop: 16,
    },
    scoreDescription: {
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: "center",
      marginTop: 6,
      lineHeight: 18,
    },

    // Section card
    sectionCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03,
      shadowRadius: 6,
      elevation: 1,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 14,
    },

    // Factor rows
    factorRow: {
      marginBottom: 16,
    },
    factorHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
    },
    factorLabelRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    factorName: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    factorTrendRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    factorTrendText: {
      fontSize: 11,
      fontWeight: "500",
    },
    factorScore: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.text,
      marginLeft: 6,
    },
    factorBarTrack: {
      height: 6,
      backgroundColor: colors.borderLight,
      borderRadius: 3,
      overflow: "hidden",
    },
    factorBarFill: {
      height: 6,
      borderRadius: 3,
    },

    // Exercises
    exerciseCard: {
      flexDirection: "row",
      gap: 14,
      marginBottom: 14,
    },
    exerciseIconBox: {
      width: 48,
      height: 48,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    exerciseContent: {
      flex: 1,
    },
    exerciseTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    exerciseDescription: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
      marginBottom: 8,
    },
    exerciseMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    exerciseBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
    },
    exerciseBadgeText: {
      fontSize: 11,
      fontWeight: "600",
    },
    exerciseDuration: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    exerciseDurationText: {
      fontSize: 11,
      color: colors.textSecondary,
    },

    // Mini exercise list
    miniExerciseRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderLight,
    },
    miniExerciseIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    miniExerciseContent: {
      flex: 1,
    },
    miniExerciseTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },

    // Trend chart
    emptyChartText: {
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: "center",
      paddingVertical: 24,
    },

    // Tips
    tipHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 10,
    },
    tipText: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },

    // Recommendations
    recRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      marginBottom: 10,
    },
    recBullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.primary,
      marginTop: 6,
    },
    recText: {
      flex: 1,
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 19,
    },

    // Empty state
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 40,
      gap: 16,
    },
    emptyStateText: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
    },
  });
}

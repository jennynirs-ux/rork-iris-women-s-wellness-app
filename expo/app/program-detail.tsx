import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import {
  Moon,
  Heart,
  Leaf,
  Dumbbell,
  Sparkles,
  ChevronLeft,
  Lock,
  CheckCircle2,
  Circle,
  Lightbulb,
  type LucideIcon,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useApp } from "@/contexts/AppContext";
import { GUIDED_PROGRAMS, GuidedProgram } from "@/constants/programs";
import { programTranslationsEN } from "@/constants/programTranslations";
import ErrorBoundary from "@/components/ErrorBoundary";

const ICON_MAP: Record<string, LucideIcon> = {
  Moon,
  Heart,
  Leaf,
  Dumbbell,
  Sparkles,
};

const CATEGORY_COLORS: Record<string, string> = {
  sleep: "#7A8DD4",
  stress: "#E89BA4",
  nutrition: "#8BC9A3",
  movement: "#F4A896",
  skin: "#D4B4F4",
};

interface ProgramProgress {
  startDate: string;
  completedDays: number[];
}

function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function ProgramDetailScreenInner() {
  const router = useRouter();
  const { colors } = useTheme();
  const { userProfile } = useApp();
  const { id } = useLocalSearchParams<{ id: string }>();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const pt = programTranslationsEN;

  const program = useMemo(
    () => GUIDED_PROGRAMS.find((p) => p.id === id) ?? null,
    [id]
  );

  const [progress, setProgress] = useState<ProgramProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const storageKey = `iris_program_${id}`;

  const loadProgress = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(storageKey);
      if (raw) {
        setProgress(JSON.parse(raw));
      }
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false);
    }
  }, [storageKey]);

  useEffect(() => {
    loadProgress();
  }, [id, loadProgress]);

  const saveProgress = useCallback(
    async (newProgress: ProgramProgress) => {
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(newProgress));
        setProgress(newProgress);
      } catch {
        // Silently fail
      }
    },
    [storageKey]
  );

  const handleStartProgram = useCallback(async () => {
    if (program?.isPremium && !userProfile?.isPremium) {
      router.push("/paywall" as any);
      return;
    }
    const newProgress: ProgramProgress = {
      startDate: getLocalDateString(),
      completedDays: [],
    };
    await saveProgress(newProgress);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [program, userProfile?.isPremium, saveProgress, router]);

  const handleCompleteDay = useCallback(async () => {
    if (!progress || !program) return;

    const currentDay = progress.completedDays.length + 1;
    if (currentDay > program.durationDays) return;

    const newProgress: ProgramProgress = {
      ...progress,
      completedDays: [...progress.completedDays, currentDay],
    };
    await saveProgress(newProgress);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [progress, program, saveProgress]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleUpgrade = useCallback(() => {
    router.push("/paywall" as any);
  }, [router]);

  if (!program) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Program not found</Text>
          <TouchableOpacity
            style={styles.backButtonPrimary}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonPrimaryText}>Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const IconComponent = ICON_MAP[program.icon] ?? Moon;
  const categoryColor = CATEGORY_COLORS[program.category] ?? colors.primary;
  const isPremiumLocked = program.isPremium && !userProfile?.isPremium;
  const isStarted = progress !== null;
  const completedCount = progress?.completedDays.length ?? 0;
  const isCompleted = completedCount >= program.durationDays;
  const currentDayIndex = isStarted ? completedCount : 0;
  const currentDay =
    currentDayIndex < program.durationDays
      ? program.days[currentDayIndex]
      : program.days[program.durationDays - 1];
  const progressPercent = Math.round(
    (completedCount / program.durationDays) * 100
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Hero section */}
        <View style={styles.heroSection}>
          <View
            style={[
              styles.heroIconContainer,
              { backgroundColor: categoryColor + "20" },
            ]}
          >
            <IconComponent size={36} color={categoryColor} />
          </View>
          <Text style={styles.heroTitle}>
            {pt[program.titleKey] ?? program.titleKey}
          </Text>
          <Text style={styles.heroDescription}>
            {pt[program.descriptionKey] ?? program.descriptionKey}
          </Text>
        </View>

        {/* Premium gate */}
        {isPremiumLocked ? (
          <View style={styles.premiumGateContainer}>
            <View style={styles.premiumGateIcon}>
              <Lock size={32} color={colors.warning} />
            </View>
            <Text style={styles.premiumGateTitle}>Premium Program</Text>
            <Text style={styles.premiumGateMessage}>
              Upgrade to IRIS Premium to access this program
            </Text>
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={handleUpgrade}
              activeOpacity={0.8}
            >
              <Text style={styles.upgradeButtonText}>Upgrade</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Progress section */}
            {isStarted && (
              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>{pt.progress}</Text>
                  <Text style={styles.progressPercent}>{progressPercent}%</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${progressPercent}%`,
                        backgroundColor: categoryColor,
                      },
                    ]}
                  />
                </View>

                {/* Day dots */}
                <View style={styles.dayDotsContainer}>
                  {program.days.map((day) => {
                    const isDone = progress?.completedDays.includes(
                      day.dayNumber
                    );
                    const isCurrent =
                      !isCompleted && day.dayNumber === currentDayIndex + 1;
                    return (
                      <View key={day.dayNumber} style={styles.dayDotWrapper}>
                        {isDone ? (
                          <CheckCircle2 size={24} color={categoryColor} />
                        ) : isCurrent ? (
                          <View
                            style={[
                              styles.dayDotCurrent,
                              { borderColor: categoryColor },
                            ]}
                          >
                            <Text
                              style={[
                                styles.dayDotCurrentText,
                                { color: categoryColor },
                              ]}
                            >
                              {day.dayNumber}
                            </Text>
                          </View>
                        ) : (
                          <Circle size={24} color={colors.borderLight} />
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Completed banner */}
            {isCompleted && (
              <View
                style={[
                  styles.completedBanner,
                  { backgroundColor: colors.success + "15" },
                ]}
              >
                <CheckCircle2 size={24} color={colors.success} />
                <Text
                  style={[styles.completedBannerText, { color: colors.success }]}
                >
                  {pt.completed}
                </Text>
              </View>
            )}

            {/* Current day content */}
            {!isCompleted && (
              <View style={styles.currentDayContainer}>
                <Text style={styles.currentDayLabel}>
                  {pt.dayOf
                    .replace("{n}", String(currentDayIndex + 1))
                    .replace("{total}", String(program.durationDays))}
                </Text>
                <Text style={styles.currentDayTitle}>
                  {pt[currentDay.titleKey] ?? currentDay.titleKey}
                </Text>
                <Text style={styles.currentDayDescription}>
                  {pt[currentDay.descriptionKey] ?? currentDay.descriptionKey}
                </Text>

                {/* Tip box */}
                <View
                  style={[
                    styles.tipBox,
                    { backgroundColor: categoryColor + "10" },
                  ]}
                >
                  <Lightbulb size={18} color={categoryColor} />
                  <Text style={styles.tipText}>
                    {pt[currentDay.tipKey] ?? currentDay.tipKey}
                  </Text>
                </View>
              </View>
            )}

            {/* Action button */}
            {!isStarted && (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: categoryColor },
                ]}
                onPress={handleStartProgram}
                activeOpacity={0.8}
              >
                <Text style={styles.actionButtonText}>{pt.startProgram}</Text>
              </TouchableOpacity>
            )}

            {isStarted && !isCompleted && (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: categoryColor },
                ]}
                onPress={handleCompleteDay}
                activeOpacity={0.8}
              >
                <CheckCircle2 size={20} color={colors.card} />
                <Text style={styles.actionButtonText}>{pt.completeDay}</Text>
              </TouchableOpacity>
            )}

            {/* All days list */}
            <View style={styles.allDaysContainer}>
              <Text style={styles.allDaysTitle}>All Days</Text>
              {program.days.map((day) => {
                const isDone = progress?.completedDays.includes(day.dayNumber);
                return (
                  <View
                    key={day.dayNumber}
                    style={[
                      styles.dayListItem,
                      isDone && {
                        backgroundColor: categoryColor + "08",
                      },
                    ]}
                  >
                    <View style={styles.dayListLeft}>
                      {isDone ? (
                        <CheckCircle2 size={20} color={categoryColor} />
                      ) : (
                        <Circle size={20} color={colors.textTertiary} />
                      )}
                      <View style={styles.dayListTextContainer}>
                        <Text
                          style={[
                            styles.dayListDayNumber,
                            isDone && { color: categoryColor },
                          ]}
                        >
                          Day {day.dayNumber}
                        </Text>
                        <Text style={styles.dayListDayTitle} numberOfLines={1}>
                          {pt[day.titleKey] ?? day.titleKey}
                        </Text>
                      </View>
                    </View>
                    {isDone && (
                      <Text
                        style={[
                          styles.dayListCompletedText,
                          { color: categoryColor },
                        ]}
                      >
                        {pt.dayCompleted}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: typeof Colors.light) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingBottom: 40,
    },
    headerBar: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 4,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    heroSection: {
      alignItems: "center" as const,
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 24,
    },
    heroIconContainer: {
      width: 72,
      height: 72,
      borderRadius: 24,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginBottom: 16,
    },
    heroTitle: {
      fontSize: 24,
      fontWeight: "700" as const,
      color: colors.text,
      textAlign: "center" as const,
      lineHeight: 30,
      marginBottom: 8,
    },
    heroDescription: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: "center" as const,
      lineHeight: 22,
    },
    progressSection: {
      marginHorizontal: 20,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    },
    progressHeader: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      marginBottom: 8,
    },
    progressLabel: {
      fontSize: 14,
      fontWeight: "600" as const,
      color: colors.text,
    },
    progressPercent: {
      fontSize: 14,
      fontWeight: "700" as const,
      color: colors.primary,
    },
    progressBarContainer: {
      height: 6,
      backgroundColor: colors.borderLight,
      borderRadius: 3,
      overflow: "hidden" as const,
      marginBottom: 16,
    },
    progressBarFill: {
      height: 6,
      borderRadius: 3,
    },
    dayDotsContainer: {
      flexDirection: "row" as const,
      justifyContent: "space-around" as const,
      alignItems: "center" as const,
    },
    dayDotWrapper: {
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    dayDotCurrent: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    dayDotCurrentText: {
      fontSize: 11,
      fontWeight: "700" as const,
    },
    completedBanner: {
      marginHorizontal: 20,
      borderRadius: 14,
      padding: 16,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      gap: 8,
      marginBottom: 16,
    },
    completedBannerText: {
      fontSize: 16,
      fontWeight: "700" as const,
    },
    currentDayContainer: {
      marginHorizontal: 20,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    },
    currentDayLabel: {
      fontSize: 13,
      fontWeight: "600" as const,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    currentDayTitle: {
      fontSize: 20,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 8,
      lineHeight: 26,
    },
    currentDayDescription: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: 16,
    },
    tipBox: {
      flexDirection: "row" as const,
      borderRadius: 12,
      padding: 14,
      gap: 10,
      alignItems: "flex-start" as const,
    },
    tipText: {
      flex: 1,
      fontSize: 13,
      color: colors.text,
      lineHeight: 20,
    },
    actionButton: {
      marginHorizontal: 20,
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      flexDirection: "row" as const,
      gap: 8,
      marginBottom: 24,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    actionButtonText: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: "#FFFFFF",
    },
    allDaysContainer: {
      marginHorizontal: 20,
    },
    allDaysTitle: {
      fontSize: 18,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 12,
    },
    dayListItem: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 12,
      marginBottom: 4,
    },
    dayListLeft: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 10,
      flex: 1,
    },
    dayListTextContainer: {
      flex: 1,
    },
    dayListDayNumber: {
      fontSize: 11,
      fontWeight: "600" as const,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    dayListDayTitle: {
      fontSize: 14,
      fontWeight: "500" as const,
      color: colors.text,
    },
    dayListCompletedText: {
      fontSize: 11,
      fontWeight: "600" as const,
    },
    premiumGateContainer: {
      marginHorizontal: 20,
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 28,
      alignItems: "center" as const,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    premiumGateIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.warning + "15",
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginBottom: 16,
    },
    premiumGateTitle: {
      fontSize: 20,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 8,
      textAlign: "center" as const,
    },
    premiumGateMessage: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: "center" as const,
      lineHeight: 22,
      marginBottom: 20,
    },
    upgradeButton: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 32,
      alignItems: "center" as const,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    upgradeButtonText: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: colors.card,
    },
    notFoundContainer: {
      flex: 1,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      padding: 24,
      gap: 12,
    },
    notFoundText: {
      fontSize: 16,
      color: colors.textTertiary,
      textAlign: "center" as const,
    },
    backButtonPrimary: {
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 14,
      paddingHorizontal: 28,
      marginTop: 8,
    },
    backButtonPrimaryText: {
      fontSize: 15,
      fontWeight: "600" as const,
      color: colors.card,
    },
  });
}

export default function ProgramDetailScreen() {
  return (
    <ErrorBoundary>
      <ProgramDetailScreenInner />
    </ErrorBoundary>
  );
}

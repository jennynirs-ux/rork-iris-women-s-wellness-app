import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Moon,
  Heart,
  Leaf,
  Dumbbell,
  Sparkles,
  ChevronLeft,
  Lock,
  Clock,
  CheckCircle2,
  Play,
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

function ProgramsScreenInner() {
  const router = useRouter();
  const { colors } = useTheme();
  const { userProfile } = useApp();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [progressMap, setProgressMap] = useState<Record<string, ProgramProgress>>({});

  const pt = programTranslationsEN;

  useEffect(() => {
    loadAllProgress();
  }, []);

  const loadAllProgress = useCallback(async () => {
    try {
      const map: Record<string, ProgramProgress> = {};
      for (const program of GUIDED_PROGRAMS) {
        const raw = await AsyncStorage.getItem(`iris_program_${program.id}`);
        if (raw) {
          map[program.id] = JSON.parse(raw);
        }
      }
      setProgressMap(map);
    } catch {
      // Silently fail — progress just won't show
    }
  }, []);

  const handleProgramPress = useCallback(
    (program: GuidedProgram) => {
      router.push(`/program-detail?id=${program.id}` as any);
    },
    [router]
  );

  const renderProgramCard = useCallback(
    ({ item }: { item: GuidedProgram }) => {
      const IconComponent = ICON_MAP[item.icon] ?? Moon;
      const isPremiumLocked = item.isPremium && !userProfile?.isPremium;
      const categoryColor = CATEGORY_COLORS[item.category] ?? colors.primary;
      const progress = progressMap[item.id];
      const isActive = progress && progress.completedDays.length < item.durationDays;
      const isCompleted = progress && progress.completedDays.length >= item.durationDays;
      const progressPercent = progress
        ? Math.round((progress.completedDays.length / item.durationDays) * 100)
        : 0;

      return (
        <TouchableOpacity
          style={styles.programCard}
          onPress={() => handleProgramPress(item)}
          activeOpacity={0.7}
        >
          <View style={styles.programCardInner}>
            <View
              style={[
                styles.programIconContainer,
                { backgroundColor: categoryColor + "20" },
              ]}
            >
              <IconComponent size={24} color={categoryColor} />
            </View>

            <View style={styles.programTextContainer}>
              <Text style={styles.programTitle} numberOfLines={1}>
                {pt[item.titleKey] ?? item.titleKey}
              </Text>
              <Text style={styles.programDescription} numberOfLines={2}>
                {pt[item.descriptionKey] ?? item.descriptionKey}
              </Text>

              <View style={styles.programMeta}>
                <View style={styles.durationBadge}>
                  <Clock size={12} color={colors.textSecondary} />
                  <Text style={styles.durationText}>
                    {item.durationDays} days
                  </Text>
                </View>

                {isCompleted && (
                  <View style={[styles.statusBadge, { backgroundColor: colors.success + "15" }]}>
                    <CheckCircle2 size={12} color={colors.success} />
                    <Text style={[styles.statusBadgeText, { color: colors.success }]}>
                      {pt.completed}
                    </Text>
                  </View>
                )}

                {isActive && !isCompleted && (
                  <View style={[styles.statusBadge, { backgroundColor: colors.primary + "15" }]}>
                    <Play size={12} color={colors.primary} />
                    <Text style={[styles.statusBadgeText, { color: colors.primary }]}>
                      {pt.active} {progressPercent}%
                    </Text>
                  </View>
                )}

                {isPremiumLocked && (
                  <View style={styles.premiumBadge}>
                    <Lock size={12} color={colors.warning} />
                    <Text style={styles.premiumBadgeText}>Premium</Text>
                  </View>
                )}
              </View>

              {isActive && !isCompleted && (
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
              )}
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [colors, styles, handleProgramPress, userProfile?.isPremium, progressMap, pt]
  );

  const keyExtractor = useCallback((item: GuidedProgram) => item.id, []);

  const ListHeader = useMemo(
    () => (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>{pt.title}</Text>
        <Text style={styles.screenSubtitle}>{pt.subtitle}</Text>
      </View>
    ),
    [styles, colors, pt, router]
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <FlatList
        data={GUIDED_PROGRAMS}
        renderItem={renderProgramCard}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

function createStyles(colors: typeof Colors.light) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContent: {
      paddingBottom: 40,
    },
    headerContainer: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 8,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginBottom: 12,
    },
    screenTitle: {
      fontSize: 28,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 4,
    },
    screenSubtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    programCard: {
      marginHorizontal: 16,
      marginTop: 12,
      backgroundColor: colors.card,
      borderRadius: 16,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    },
    programCardInner: {
      flexDirection: "row" as const,
      padding: 14,
      gap: 12,
    },
    programIconContainer: {
      width: 52,
      height: 52,
      borderRadius: 16,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    programTextContainer: {
      flex: 1,
    },
    programTitle: {
      fontSize: 16,
      fontWeight: "600" as const,
      color: colors.text,
      marginBottom: 4,
    },
    programDescription: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
      marginBottom: 8,
    },
    programMeta: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      flexWrap: "wrap" as const,
      gap: 8,
    },
    durationBadge: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      backgroundColor: colors.surface,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 8,
      gap: 4,
    },
    durationText: {
      fontSize: 11,
      fontWeight: "500" as const,
      color: colors.textSecondary,
    },
    statusBadge: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 8,
      gap: 4,
    },
    statusBadgeText: {
      fontSize: 11,
      fontWeight: "600" as const,
    },
    premiumBadge: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      backgroundColor: colors.warning + "15",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 8,
      gap: 4,
    },
    premiumBadgeText: {
      fontSize: 11,
      fontWeight: "600" as const,
      color: colors.warning,
    },
    progressBarContainer: {
      height: 4,
      backgroundColor: colors.borderLight,
      borderRadius: 2,
      marginTop: 10,
      overflow: "hidden" as const,
    },
    progressBarFill: {
      height: 4,
      borderRadius: 2,
    },
  });
}

export default function ProgramsScreen() {
  return (
    <ErrorBoundary>
      <ProgramsScreenInner />
    </ErrorBoundary>
  );
}

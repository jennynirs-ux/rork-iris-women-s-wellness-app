import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Apple,
  Moon,
  Flower2,
  Sparkles,
  Heart,
  Zap,
  Salad,
  Lightbulb,
  Sun,
  Users,
  Trophy,
  Flame,
  Star,
  Droplets,
  Cookie,
  Brain,
  Shield,
  BedDouble,
  Wind,
  Leaf,
  RefreshCw,
  Lock,
  BookOpen,
  ChevronLeft,
  type LucideIcon,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useApp } from "@/contexts/AppContext";
import { ARTICLES, Article } from "@/constants/articles";
import { CyclePhase } from "@/types";
import ErrorBoundary from "@/components/ErrorBoundary";

// Map icon string names from articles.ts to actual Lucide components
const ICON_MAP: Record<string, LucideIcon> = {
  Apple,
  Moon,
  Flower2,
  Sparkles,
  Heart,
  Zap,
  Salad,
  Lightbulb,
  Sun,
  Users,
  Trophy,
  Flame,
  Star,
  Droplets,
  Cookie,
  Brain,
  Shield,
  BedDouble,
  Wind,
  Leaf,
  RefreshCw,
};

const PHASE_FILTERS: { key: CyclePhase | "all"; colorKey: string }[] = [
  { key: "all", colorKey: "#B8A4E8" },
  { key: "menstrual", colorKey: "#E89BA4" },
  { key: "follicular", colorKey: "#8BC9A3" },
  { key: "ovulation", colorKey: "#F4C896" },
  { key: "luteal", colorKey: "#B8A4E8" },
];

function getPhaseLabel(
  phase: CyclePhase | "all",
  t: any
): string {
  if (phase === "all") return t.articles?.filterAll ?? "All Phases";
  return t.phases?.[phase] ?? phase;
}

function ArticlesScreenInner() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t, userProfile } = useApp();
  const styles = useMemo(() => createArticlesStyles(colors), [colors]);
  const [selectedPhase, setSelectedPhase] = useState<CyclePhase | "all">("all");

  const articles = t.articles as Record<string, string> | undefined;

  const filteredArticles = useMemo(() => {
    if (selectedPhase === "all") return ARTICLES;
    return ARTICLES.filter(
      (a) => a.phase === selectedPhase || a.phase === "all"
    );
  }, [selectedPhase]);

  const handleArticlePress = useCallback(
    (article: Article) => {
      router.push(`/article-detail?id=${article.id}` as any);
    },
    [router]
  );

  const renderFilterChip = useCallback(
    ({ key, colorKey }: { key: CyclePhase | "all"; colorKey: string }) => {
      const isActive = selectedPhase === key;
      return (
        <TouchableOpacity
          key={key}
          style={[
            styles.filterChip,
            isActive && { backgroundColor: colorKey },
            !isActive && { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
          ]}
          onPress={() => setSelectedPhase(key)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterChipText,
              isActive && { color: "#FFFFFF" },
              !isActive && { color: colors.textSecondary },
            ]}
          >
            {getPhaseLabel(key, t)}
          </Text>
        </TouchableOpacity>
      );
    },
    [selectedPhase, colors, styles, t]
  );

  const renderArticleCard = useCallback(
    ({ item }: { item: Article }) => {
      const IconComponent = ICON_MAP[item.icon] ?? BookOpen;
      const isPremiumLocked = item.isPremium && !userProfile?.isPremium;
      const titleText = articles?.[item.titleKey.replace("articles.", "")] ?? item.titleKey;
      const summaryText = articles?.[item.summaryKey.replace("articles.", "")] ?? item.summaryKey;

      return (
        <TouchableOpacity
          style={styles.articleCard}
          onPress={() => handleArticlePress(item)}
          activeOpacity={0.7}
        >
          <View style={styles.articleCardInner}>
            <View
              style={[
                styles.articleIconContainer,
                {
                  backgroundColor:
                    item.phase === "menstrual"
                      ? "#E89BA4" + "20"
                      : item.phase === "follicular"
                      ? "#8BC9A3" + "20"
                      : item.phase === "ovulation"
                      ? "#F4C896" + "20"
                      : item.phase === "luteal"
                      ? "#B8A4E8" + "20"
                      : colors.primaryLight + "40",
                },
              ]}
            >
              <IconComponent
                size={22}
                color={
                  item.phase === "menstrual"
                    ? "#E89BA4"
                    : item.phase === "follicular"
                    ? "#8BC9A3"
                    : item.phase === "ovulation"
                    ? "#F4C896"
                    : item.phase === "luteal"
                    ? "#B8A4E8"
                    : colors.primary
                }
              />
            </View>

            <View style={styles.articleTextContainer}>
              <Text style={styles.articleTitle} numberOfLines={2}>
                {titleText}
              </Text>
              <Text style={styles.articleSummary} numberOfLines={2}>
                {summaryText}
              </Text>
              <View style={styles.articleMeta}>
                <View style={styles.readTimeBadge}>
                  <Text style={styles.readTimeText}>
                    {item.readMinutes} {articles?.readMin ?? "min read"}
                  </Text>
                </View>
                {isPremiumLocked && (
                  <View style={styles.premiumBadge}>
                    <Lock size={12} color={colors.warning} />
                    <Text style={styles.premiumBadgeText}>
                      {articles?.premiumOnly ?? "Premium"}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [articles, colors, styles, handleArticlePress, userProfile?.isPremium]
  );

  const keyExtractor = useCallback((item: Article) => item.id, []);

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
        <Text style={styles.screenTitle}>
          {articles?.title ?? "Wellness Library"}
        </Text>
        <Text style={styles.screenSubtitle}>
          {articles?.subtitle ?? "Wellness tips for every phase"}
        </Text>

        <View style={styles.filterRow}>
          {PHASE_FILTERS.map(renderFilterChip)}
        </View>
      </View>
    ),
    [styles, colors, articles, renderFilterChip, router]
  );

  const ListEmpty = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <BookOpen size={48} color={colors.textTertiary} />
        <Text style={styles.emptyText}>
          {articles?.noResults ?? "No articles found"}
        </Text>
      </View>
    ),
    [styles, colors, articles]
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <FlatList
        data={filteredArticles}
        renderItem={renderArticleCard}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

function createArticlesStyles(colors: typeof Colors.light) {
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
    filterRow: {
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      gap: 8,
      marginBottom: 8,
    },
    filterChip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
    },
    filterChipText: {
      fontSize: 13,
      fontWeight: "600" as const,
    },
    articleCard: {
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
    articleCardInner: {
      flexDirection: "row" as const,
      padding: 14,
      gap: 12,
    },
    articleIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 14,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    articleTextContainer: {
      flex: 1,
    },
    articleTitle: {
      fontSize: 15,
      fontWeight: "600" as const,
      color: colors.text,
      marginBottom: 4,
      lineHeight: 20,
    },
    articleSummary: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
      marginBottom: 8,
    },
    articleMeta: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 8,
    },
    readTimeBadge: {
      backgroundColor: colors.surface,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 8,
    },
    readTimeText: {
      fontSize: 11,
      fontWeight: "500" as const,
      color: colors.textSecondary,
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
    emptyContainer: {
      alignItems: "center" as const,
      justifyContent: "center" as const,
      paddingVertical: 60,
      gap: 12,
    },
    emptyText: {
      fontSize: 15,
      color: colors.textTertiary,
    },
  });
}

export default function ArticlesScreen() {
  return (
    <ErrorBoundary>
      <ArticlesScreenInner />
    </ErrorBoundary>
  );
}

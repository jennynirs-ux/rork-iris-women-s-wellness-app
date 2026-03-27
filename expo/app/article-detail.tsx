import React, { useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
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
  BookOpen,
  ChevronLeft,
  Lock,
  type LucideIcon,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useApp } from "@/contexts/AppContext";
import { ARTICLES } from "@/constants/articles";
import ErrorBoundary from "@/components/ErrorBoundary";

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

function getPhaseColor(phase: string): string {
  switch (phase) {
    case "menstrual":
      return "#E89BA4";
    case "follicular":
      return "#8BC9A3";
    case "ovulation":
      return "#F4C896";
    case "luteal":
      return "#B8A4E8";
    default:
      return "#B8A4E8";
  }
}

function ArticleDetailScreenInner() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t, userProfile } = useApp();
  const { id } = useLocalSearchParams<{ id: string }>();
  const styles = useMemo(() => createArticleDetailStyles(colors), [colors]);

  const articles = t.articles as Record<string, string> | undefined;

  const article = useMemo(
    () => ARTICLES.find((a) => a.id === id) ?? null,
    [id]
  );

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleUpgrade = useCallback(() => {
    router.push("/paywall" as any);
  }, [router]);

  if (!article) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.notFoundContainer}>
          <BookOpen size={48} color={colors.textTertiary} />
          <Text style={styles.notFoundText}>
            {articles?.noResults ?? "No articles found"}
          </Text>
          <TouchableOpacity
            style={styles.backButtonPrimary}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonPrimaryText}>
              {articles?.backToLibrary ?? "Back"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const IconComponent = ICON_MAP[article.icon] ?? BookOpen;
  const phaseColor = getPhaseColor(article.phase);
  const isPremiumLocked = article.isPremium && !userProfile?.isPremium;

  const titleText =
    articles?.[article.titleKey.replace("articles.", "")] ?? article.titleKey;
  const bodyText =
    articles?.[article.bodyKey.replace("articles.", "")] ?? article.bodyKey;
  const phaseLabel =
    article.phase === "all"
      ? articles?.filterAll ?? "All Phases"
      : t.phases?.[article.phase] ?? article.phase;
  const categoryLabel =
    articles?.[`category${article.category.charAt(0).toUpperCase()}${article.category.slice(1)}`] ??
    article.category;

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
              { backgroundColor: phaseColor + "20" },
            ]}
          >
            <IconComponent size={36} color={phaseColor} />
          </View>
          <Text style={styles.heroTitle}>{titleText}</Text>
          <View style={styles.heroBadgeRow}>
            <View
              style={[
                styles.phaseBadge,
                { backgroundColor: phaseColor + "20" },
              ]}
            >
              <Text style={[styles.phaseBadgeText, { color: phaseColor }]}>
                {phaseLabel}
              </Text>
            </View>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{categoryLabel}</Text>
            </View>
            <View style={styles.readTimeBadge}>
              <Text style={styles.readTimeBadgeText}>
                {article.readMinutes} {articles?.readMin ?? "min read"}
              </Text>
            </View>
          </View>
        </View>

        {/* Premium gate */}
        {isPremiumLocked ? (
          <View style={styles.premiumGateContainer}>
            <View style={styles.premiumGateIcon}>
              <Lock size={32} color={colors.warning} />
            </View>
            <Text style={styles.premiumGateTitle}>
              {articles?.upgradeTitle ?? "Premium Article"}
            </Text>
            <Text style={styles.premiumGateMessage}>
              {articles?.upgradeMessage ??
                "Upgrade to IRIS Premium to read this article"}
            </Text>
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={handleUpgrade}
              activeOpacity={0.8}
            >
              <Text style={styles.upgradeButtonText}>
                {articles?.upgradeButton ?? "Upgrade"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Article body */
          <View style={styles.bodyContainer}>
            {bodyText.split("\n\n").map((paragraph, idx) => (
              <Text key={idx} style={styles.bodyParagraph}>
                {paragraph}
              </Text>
            ))}
          </View>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
            This content is for general wellness information only. It is not
            medical advice, diagnosis, or treatment. Consult a healthcare
            professional for medical concerns.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createArticleDetailStyles(colors: typeof Colors.light) {
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
      marginBottom: 12,
    },
    heroBadgeRow: {
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      justifyContent: "center" as const,
      gap: 8,
    },
    phaseBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
    },
    phaseBadgeText: {
      fontSize: 12,
      fontWeight: "600" as const,
    },
    categoryBadge: {
      backgroundColor: colors.surface,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
    },
    categoryBadgeText: {
      fontSize: 12,
      fontWeight: "500" as const,
      color: colors.textSecondary,
    },
    readTimeBadge: {
      backgroundColor: colors.surface,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
    },
    readTimeBadgeText: {
      fontSize: 12,
      fontWeight: "500" as const,
      color: colors.textSecondary,
    },
    bodyContainer: {
      paddingHorizontal: 20,
      paddingTop: 8,
    },
    bodyParagraph: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 26,
      marginBottom: 16,
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
    disclaimerContainer: {
      marginHorizontal: 20,
      marginTop: 20,
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 14,
    },
    disclaimerText: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: "center" as const,
      lineHeight: 18,
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

export default function ArticleDetailScreen() {
  return (
    <ErrorBoundary>
      <ArticleDetailScreenInner />
    </ErrorBoundary>
  );
}

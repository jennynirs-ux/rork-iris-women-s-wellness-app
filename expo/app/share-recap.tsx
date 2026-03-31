import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Share, ChevronLeft, Download } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useApp } from "@/contexts/AppContext";
import Colors from "@/constants/colors";
import ErrorBoundary from "@/components/ErrorBoundary";
import {
  generateShareableHTML,
  type ShareableCardData,
} from "@/lib/shareableCard";
import type { CyclePhase } from "@/types";

// ─── Route params ────────────────────────────────────────────────────────────

interface ShareRecapParams {
  cycleNumber?: string;
  cycleDays?: string;
  avgEnergy?: string;
  avgStress?: string;
  avgRecovery?: string;
  topAchievement?: string;
  phase?: string;
  phaseColor?: string;
}

// ─── Phase color mapping ─────────────────────────────────────────────────────

const PHASE_COLORS: Record<CyclePhase, string> = {
  menstrual: "#E89BA4",
  follicular: "#8BC9A3",
  ovulation: "#F4C896",
  luteal: "#B8A4E8",
};

const PHASE_LABELS: Record<CyclePhase, string> = {
  menstrual: "Menstrual",
  follicular: "Follicular",
  ovulation: "Ovulation",
  luteal: "Luteal",
};

// ─── Component ───────────────────────────────────────────────────────────────

function ShareRecapContent() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useApp();
  const params = useLocalSearchParams() as unknown as ShareRecapParams;
  const [isSharing, setIsSharing] = useState(false);

  // Parse route params into card data
  const cardData: ShareableCardData = useMemo(() => {
    const phase = (params.phase as CyclePhase) || "follicular";
    return {
      cycleNumber: parseInt(params.cycleNumber || "1", 10) || 1,
      cycleDays: parseInt(params.cycleDays || "28", 10) || 28,
      avgEnergy: parseFloat(params.avgEnergy || "0") || 0,
      avgStress: parseFloat(params.avgStress || "0") || 0,
      avgRecovery: parseFloat(params.avgRecovery || "0") || 0,
      topAchievement: params.topAchievement || "",
      phase,
      phaseColor: params.phaseColor || PHASE_COLORS[phase] || "#B8A4E8",
    };
  }, [params]);

  const phaseColor = PHASE_COLORS[cardData.phase] || "#B8A4E8";
  const phaseLabel = PHASE_LABELS[cardData.phase] || "Cycle";

  // Share handler: generate PDF from HTML, then share
  const handleShare = useCallback(async () => {
    setIsSharing(true);
    try {
      const html = generateShareableHTML(cardData);

      // Use expo-print to generate a PDF from the HTML
      const result = await Print.printToFileAsync({
        html,
        base64: false,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(result.uri, {
          mimeType: "application/pdf",
          dialogTitle: "Share Cycle Recap",
          UTI: "com.adobe.pdf",
        });
      } else {
        Alert.alert(
          "Sharing Unavailable",
          "Sharing is not available on this device."
        );
      }
    } catch (error) {
      Alert.alert(
        "Share Failed",
        "Unable to create the recap card. Please try again."
      );
    } finally {
      setIsSharing(false);
    }
  }, [cardData]);

  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.home?.cycleRecap || "Cycle Recap"}</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card Preview */}
        <View style={styles.previewCard}>
          {/* Gradient header section */}
          <View style={[styles.cardHeader, { backgroundColor: phaseColor }]}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>I</Text>
            </View>
            <Text style={styles.cardTitle}>IRIS Cycle Recap</Text>
            <Text style={styles.cardSubtitle}>Cycle {cardData.cycleNumber}</Text>
          </View>

          {/* Cycle days */}
          <View style={styles.cycleDaysSection}>
            <Text style={[styles.cycleDaysNumber, { color: colors.text }]}>
              {cardData.cycleDays}
            </Text>
            <Text style={[styles.cycleDaysLabel, { color: colors.textSecondary }]}>
              {t.home?.days || "Days"}
            </Text>
            <View style={[styles.phaseTag, { backgroundColor: phaseColor + "22" }]}>
              <Text style={[styles.phaseTagText, { color: phaseColor }]}>
                {phaseLabel} Phase
              </Text>
            </View>
          </View>

          {/* Metric badges */}
          <View style={styles.metricsRow}>
            <MetricBadge
              label={t.home?.energy || "Energy"}
              value={cardData.avgEnergy}
              colors={colors}
              accentColor="#8BC9A3"
            />
            <MetricBadge
              label={t.home?.stress || "Stress"}
              value={cardData.avgStress}
              colors={colors}
              accentColor="#E89BA4"
            />
            <MetricBadge
              label={t.home?.recovery || "Recovery"}
              value={cardData.avgRecovery}
              colors={colors}
              accentColor="#B8A4E8"
            />
          </View>

          {/* Achievement */}
          {cardData.topAchievement ? (
            <View style={[styles.achievementBanner, { borderColor: colors.border }]}>
              <Text style={[styles.achievementText, { color: colors.text }]}>
                {cardData.topAchievement}
              </Text>
            </View>
          ) : null}

          {/* Footer */}
          <Text style={[styles.cardFooter, { color: colors.textTertiary }]}>
            Track your wellness at iris-wellness.mojjo.se
          </Text>
        </View>

        {/* Share button */}
        <TouchableOpacity
          style={[styles.shareButton, { backgroundColor: phaseColor }]}
          onPress={handleShare}
          disabled={isSharing}
          activeOpacity={0.8}
        >
          {isSharing ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Share size={20} color="#FFFFFF" />
              <Text style={styles.shareButtonText}>{t.home?.shareToStories || "Share to Stories"}</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Info text */}
        <Text style={[styles.infoText, { color: colors.textTertiary }]}>
          A PDF of your cycle recap will be created for sharing. No personal
          health data is included beyond the summary shown above.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Metric Badge Sub-Component ──────────────────────────────────────────────

function MetricBadge({
  label,
  value,
  colors,
  accentColor,
}: {
  label: string;
  value: number;
  colors: typeof Colors.light;
  accentColor: string;
}) {
  const pct = Math.round(Math.min(10, Math.max(0, value)) * 10);
  return (
    <View style={[metricStyles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[metricStyles.value, { color: colors.text }]}>
        {value.toFixed(1)}
      </Text>
      <View style={[metricStyles.barTrack, { backgroundColor: colors.borderLight }]}>
        <View
          style={[
            metricStyles.barFill,
            { width: `${pct}%`, backgroundColor: accentColor },
          ]}
        />
      </View>
      <Text style={[metricStyles.label, { color: colors.textSecondary }]}>
        {label}
      </Text>
    </View>
  );
}

const metricStyles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  value: {
    fontSize: 24,
    fontWeight: "700",
  },
  barTrack: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    marginVertical: 8,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});

// ─── Styles Factory ──────────────────────────────────────────────────────────

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
      alignItems: "center",
      justifyContent: "center",
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
    previewCard: {
      backgroundColor: colors.card,
      borderRadius: 24,
      overflow: "hidden",
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardHeader: {
      paddingVertical: 32,
      paddingHorizontal: 24,
      alignItems: "center",
    },
    logoCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: "rgba(255, 255, 255, 0.25)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    logoText: {
      fontSize: 20,
      fontWeight: "800",
      color: "#FFFFFF",
      letterSpacing: 1,
    },
    cardTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: "#FFFFFF",
      letterSpacing: 0.5,
    },
    cardSubtitle: {
      fontSize: 14,
      fontWeight: "500",
      color: "rgba(255, 255, 255, 0.75)",
      marginTop: 4,
    },
    cycleDaysSection: {
      alignItems: "center",
      paddingVertical: 24,
    },
    cycleDaysNumber: {
      fontSize: 64,
      fontWeight: "800",
      lineHeight: 70,
    },
    cycleDaysLabel: {
      fontSize: 16,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 3,
      marginTop: 2,
    },
    phaseTag: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 20,
      marginTop: 12,
    },
    phaseTagText: {
      fontSize: 13,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    metricsRow: {
      flexDirection: "row",
      paddingHorizontal: 16,
      gap: 10,
      marginBottom: 20,
    },
    achievementBanner: {
      marginHorizontal: 16,
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 16,
      borderWidth: 1,
      alignItems: "center",
      marginBottom: 20,
    },
    achievementText: {
      fontSize: 15,
      fontWeight: "600",
    },
    cardFooter: {
      textAlign: "center",
      fontSize: 12,
      paddingBottom: 20,
      paddingHorizontal: 16,
    },
    shareButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      borderRadius: 16,
      gap: 10,
      marginBottom: 16,
    },
    shareButtonText: {
      fontSize: 17,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    infoText: {
      fontSize: 13,
      textAlign: "center",
      lineHeight: 18,
      paddingHorizontal: 12,
    },
  });
}

// ─── Export with ErrorBoundary ────────────────────────────────────────────────

export default function ShareRecapScreen() {
  return (
    <ErrorBoundary>
      <ShareRecapContent />
    </ErrorBoundary>
  );
}

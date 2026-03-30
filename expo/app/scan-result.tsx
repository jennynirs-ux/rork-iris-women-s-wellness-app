import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, Text, StyleSheet, Animated, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle } from "react-native-svg";
import { useApp } from "@/contexts/AppContext";
import { router } from "expo-router";
import Colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { CheckCircle, Calendar, ClipboardCheck } from "lucide-react-native";
import ErrorBoundary from "@/components/ErrorBoundary";

// Helper to determine color based on score and metric type
const getScoreColor = (value: number, metricType: 'good-high' | 'good-low'): string => {
  if (metricType === 'good-high') {
    // For energy, recovery, hydration: high is good
    if (value >= 7) return '#8BC9A3'; // green
    if (value >= 4) return '#F4C896'; // yellow
    return '#E89BA4'; // red
  } else {
    // For stress, fatigue, inflammation: low is good
    if (value <= 3) return '#8BC9A3'; // green
    if (value <= 6) return '#F4C896'; // yellow
    return '#E89BA4'; // red
  }
};

// Helper to get interpretation text (translation-aware)
const getInterpretation = (key: string, value: number, t: any): string => {
  const sr = t?.scanResult;
  switch (key) {
    case 'energy':
      return value >= 7 ? (sr?.energyHigh || 'Strong energy today') : value >= 4 ? (sr?.energyMod || 'Moderate energy') : (sr?.energyLow || 'Consider rest');
    case 'stress':
      return value <= 3 ? (sr?.stressLow || 'Stress is low') : value <= 6 ? (sr?.stressMod || 'Moderate stress levels') : (sr?.stressHigh || 'Stress score is higher — consider a break');
    case 'recovery':
      return value >= 7 ? (sr?.recoveryHigh || 'Well recovered') : value >= 4 ? (sr?.recoveryMod || 'Moderate recovery') : (sr?.recoveryLow || 'Recovery needed');
    case 'hydration':
      return value >= 7 ? (sr?.hydrationHigh || 'Well hydrated') : value >= 4 ? (sr?.hydrationMod || 'Adequate hydration') : (sr?.hydrationLow || 'Drink more water');
    case 'fatigue':
      return value <= 3 ? (sr?.fatigueEnergized || 'Feeling energized') : value <= 6 ? (sr?.fatigueSome || 'Some fatigue present') : (sr?.fatigueHigh || 'High fatigue — prioritize rest');
    case 'inflammation':
      return value <= 3 ? (sr?.inflammationLow || 'Low inflammation') : value <= 6 ? (sr?.inflammationMod || 'Moderate inflammation') : (sr?.inflammationHigh || 'Higher score — consider comfort foods');
    default:
      return '';
  }
};

interface ScoreGaugeProps {
  label: string;
  value: number;
  interpretation: string;
  color: string;
  colors: typeof Colors.light;
  styles: ReturnType<typeof createScanResultStyles>;
}

function ScoreGauge({ label, value, interpretation, color, colors, styles }: ScoreGaugeProps) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 10) * circumference;

  return (
    <View style={styles.gaugeContainer}>
      <View style={styles.gaugeCircle}>
        <Svg width={120} height={120} viewBox="0 0 120 120">
          <Circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={colors.surface}
            strokeWidth="6"
          />
          <Circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>
        <View style={styles.gaugeValue}>
          <Text style={[styles.gaugeNumber, { color }]}>{value}</Text>
          <Text style={styles.gaugeMax}>/10</Text>
        </View>
      </View>
      <Text style={styles.gaugeLabel}>{label}</Text>
      <Text style={styles.gaugeInterpretation}>{interpretation}</Text>
    </View>
  );
}

function ScanResultScreenInner() {
  const { latestScan, updateLastPeriodDate, currentPhase, todayCheckIn, t } = useApp();
  const { colors } = useTheme();
  const styles = useMemo(() => createScanResultStyles(colors), [colors]);
  const [showMenstrualDialog, setShowMenstrualDialog] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    // Check for menstrual phase detection ONLY if it's detected but not yet confirmed in app
    if (latestScan && latestScan.hormonalState === "menstrual" && currentPhase !== "menstrual") {
      setShowMenstrualDialog(true);
    }
  }, [latestScan, currentPhase]);

  const handleMenstrualConfirm = (isMenstrual: boolean) => {
    if (isMenstrual) {
      updateLastPeriodDate(new Date());
    }
    setShowMenstrualDialog(false);
  };

  const handleViewInsights = useCallback(() => {
    router.push("/(tabs)/insights" as any);
  }, []);

  const handleCheckIn = useCallback(() => {
    router.push("/check-in" as any);
  }, []);

  const handleDone = useCallback(() => {
    router.push("/(tabs)" as any);
  }, []);

  if (!latestScan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{t.scanResult.noScanData}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const scores = [
    { key: 'energy', label: t.home?.energy || 'Energy', value: latestScan.energyScore ?? 5, type: 'good-high' as const },
    { key: 'stress', label: t.home?.stress || 'Stress', value: latestScan.stressScore ?? 5, type: 'good-low' as const },
    { key: 'recovery', label: t.home?.recovery || 'Recovery', value: latestScan.recoveryScore ?? 5, type: 'good-high' as const },
    { key: 'hydration', label: t.home?.hydration || 'Hydration', value: latestScan.hydrationLevel ?? 5, type: 'good-high' as const },
    { key: 'fatigue', label: t.insights?.fatigue || 'Fatigue', value: latestScan.fatigueLevel ?? 5, type: 'good-low' as const },
    { key: 'inflammation', label: t.insights?.inflammation || 'Inflammation', value: latestScan.inflammation ?? 5, type: 'good-low' as const },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <LinearGradient
        colors={[colors.primaryLight, colors.background]}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Animated.View style={[styles.headerSection, { opacity: fadeAnim }]}>
            <CheckCircle size={64} color={colors.success} style={styles.successIcon} />
            <Text style={styles.resultTitle}>{t.scanResult?.title || 'Your Scan Results'}</Text>
            <Text style={styles.resultSubtitle}>{t.scanResult?.subtitle || "Here's your wellness snapshot"}</Text>
          </Animated.View>

          <Animated.View style={[styles.scoresGrid, { opacity: fadeAnim }]}>
            {scores.map((score, idx) => {
              const color = getScoreColor(score.value, score.type);
              const interpretation = getInterpretation(score.key, score.value, t);
              return (
                <ScoreGauge
                  key={idx}
                  label={score.label}
                  value={score.value}
                  interpretation={interpretation}
                  color={color}
                  colors={colors}
                  styles={styles}
                />
              );
            })}
          </Animated.View>

          <Animated.View style={[styles.disclaimerContainer, { opacity: fadeAnim }]}>
            <Text style={styles.disclaimer}>
              {t.common?.medicalDisclaimer || "This is a wellness tool only. Results are not medical advice, diagnosis, or treatment. Consult a healthcare professional for medical concerns."}
            </Text>
          </Animated.View>

          <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleViewInsights}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>{t.scanResult?.viewInsights || 'View Full Insights'}</Text>
            </TouchableOpacity>
            {!todayCheckIn && (
              <TouchableOpacity
                style={styles.checkInButton}
                onPress={handleCheckIn}
                activeOpacity={0.8}
              >
                <ClipboardCheck size={20} color={colors.primary} />
                <Text style={styles.checkInButtonText}>{t.scanResult?.completeCheckIn || 'Complete Your Check-In'}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleDone}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>{t.scanResult?.done || 'Done'}</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>

        {showMenstrualDialog && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalIcon}>
                <Calendar size={32} color={colors.primary} />
              </View>
              <Text style={styles.modalTitle}>{t.scanResult.cyclePhaseDetected}</Text>
              <Text style={styles.modalText}>
                {t.scanResult.menstrualQuestion}
              </Text>
              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={() => handleMenstrualConfirm(true)}
              >
                <Text style={styles.modalButtonPrimaryText}>{t.scanResult.yesIAm}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonSecondary}
                onPress={() => handleMenstrualConfirm(false)}
              >
                <Text style={styles.modalButtonSecondaryText}>{t.scanResult.noImNot}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

function createScanResultStyles(colors: typeof Colors.light) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    gradient: {
      flex: 1,
    },
    content: {
      flex: 1,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "700" as const,
      color: colors.text,
      textAlign: "center" as const,
    },
    scrollContent: {
      paddingBottom: 40,
      paddingHorizontal: 16,
      paddingTop: 24,
    },
    headerSection: {
      alignItems: "center" as const,
      marginBottom: 32,
    },
    successIcon: {
      marginBottom: 16,
    },
    resultTitle: {
      fontSize: 36,
      fontWeight: "700" as const,
      color: colors.text,
      textAlign: "center" as const,
      marginBottom: 8,
    },
    resultSubtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center" as const,
    },
    scoresGrid: {
      display: "flex" as const,
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      justifyContent: "space-between" as const,
      gap: 12,
      marginBottom: 28,
    },
    gaugeContainer: {
      width: "48.5%" as any,
      alignItems: "center" as const,
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 16,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    gaugeCircle: {
      position: "relative" as const,
      width: 120,
      height: 120,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      marginBottom: 12,
    },
    gaugeNumber: {
      fontSize: 28,
      fontWeight: "700" as const,
    },
    gaugeMax: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    gaugeValue: {
      position: "absolute" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    gaugeLabel: {
      fontSize: 14,
      fontWeight: "600" as const,
      color: colors.text,
      marginBottom: 6,
    },
    gaugeInterpretation: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: "center" as const,
      lineHeight: 16,
    },
    disclaimerContainer: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 20,
    },
    disclaimer: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: "center" as const,
      lineHeight: 18,
    },
    buttonContainer: {
      gap: 12,
    },
    primaryButton: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingVertical: 18,
      paddingHorizontal: 24,
      alignItems: "center" as const,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    primaryButtonText: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: colors.card,
    },
    checkInButton: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 24,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      borderWidth: 1.5,
      borderColor: colors.primary,
      gap: 10,
    },
    checkInButtonText: {
      fontSize: 16,
      fontWeight: "600" as const,
      color: colors.primary,
    },
    secondaryButton: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 24,
      alignItems: "center" as const,
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    secondaryButtonText: {
      fontSize: 16,
      fontWeight: "600" as const,
      color: colors.primary,
    },
    modalOverlay: {
      position: "absolute" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center" as const,
      alignItems: "center" as const,
      padding: 20,
    },
    modalContent: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: 28,
      width: "100%",
      maxWidth: 340,
      alignItems: "center" as const,
    },
    modalIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.primaryLight,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 12,
      textAlign: "center" as const,
    },
    modalText: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: "center" as const,
      lineHeight: 22,
      marginBottom: 24,
    },
    modalButtonPrimary: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingVertical: 16,
      width: "100%",
      alignItems: "center" as const,
      marginBottom: 12,
    },
    modalButtonPrimaryText: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: colors.card,
    },
    modalButtonSecondary: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      paddingVertical: 16,
      width: "100%",
      alignItems: "center" as const,
    },
    modalButtonSecondaryText: {
      fontSize: 16,
      fontWeight: "600" as const,
      color: colors.textSecondary,
    },
  });
}

export default function ScanResultScreen() {
  return (
    <ErrorBoundary>
      <ScanResultScreenInner />
    </ErrorBoundary>
  );
}

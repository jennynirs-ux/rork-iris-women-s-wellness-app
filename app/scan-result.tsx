import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, Animated, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useApp } from "@/contexts/AppContext";
import { router } from "expo-router";
import Colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { CheckCircle, Calendar } from "lucide-react-native";

export default function ScanResultScreen() {
  const { latestScan, updateLastPeriodDate, currentPhase, t } = useApp();
  const { colors } = useTheme();
  const styles = useMemo(() => createScanResultStyles(colors), [colors]);
  const [showMenstrualDialog, setShowMenstrualDialog] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      if (latestScan && latestScan.hormonalState === "menstrual" && currentPhase !== "menstrual") {
        setShowMenstrualDialog(true);
      } else {
        router.replace("/insights" as any);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [latestScan, currentPhase, scaleAnim, fadeAnim]);

  const handleMenstrualConfirm = (isMenstrual: boolean) => {
    if (isMenstrual) {
      updateLastPeriodDate(new Date());
    }
    setShowMenstrualDialog(false);
    router.replace("/insights" as any);
  };

  if (!latestScan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{t.scanResult.noScanData}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <LinearGradient
        colors={[colors.primaryLight, colors.background]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Animated.View style={[
            styles.successIcon,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}>
            <CheckCircle size={80} color={colors.success} />
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim, alignItems: "center" as const }}>
            <Text style={styles.title}>{t.scanResult.scanComplete}</Text>
            <Text style={styles.subtitle}>{t.scanResult.analyzingResults}</Text>
          </Animated.View>
        </View>

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

function createScanResultStyles(colors: typeof Colors.light) { return StyleSheet.create({
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
  successIcon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: colors.text,
    textAlign: "center" as const,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center" as const,
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
}); }

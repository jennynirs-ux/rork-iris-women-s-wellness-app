import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { IrisWidgetData, getWidgetData, formatLastUpdated } from "@/lib/widgetData";

/**
 * IrisWidget Component
 *
 * This component is designed to be rendered as an iOS home screen widget.
 * It displays:
 * - Current cycle phase name and color indicator
 * - Cycle day (e.g., "Day 14 of 28")
 * - Today's recommended focus from coaching engine
 * - IRIS branding
 * - Last update timestamp
 *
 * The widget will update via the app group shared defaults or AsyncStorage
 * when the main app updates with new scan, check-in, or phase changes.
 */

const IrisWidget: React.FC<{ size?: "small" | "medium" | "large" }> = ({
  size = "medium",
}) => {
  const [widgetData, setWidgetData] = useState<IrisWidgetData | null>(null);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const loadWidgetData = async () => {
      try {
        const data = await getWidgetData();
        setWidgetData(data);
      } catch (error) {
        console.error("Error loading widget data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWidgetData();

    // Optionally, set up a listener for AsyncStorage changes
    // In a real implementation, we'd use react-native-widgetkit for live updates
  }, []);

  if (loading || !widgetData) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>IRIS</Text>
      </View>
    );
  }

  const isMedium = size === "medium" || size === "large";
  const isSmall = size === "small";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: widgetData.phaseColor,
          opacity: 0.95,
        },
      ]}
    >
      {/* Header: Phase name */}
      <View style={styles.header}>
        <Text style={[styles.phaseName, isSmall && styles.phaseNameSmall]}>
          {widgetData.phaseName}
        </Text>
        <Text style={styles.phasePhase}>Phase</Text>
      </View>

      {/* Cycle day indicator */}
      <View style={styles.cycleSection}>
        <Text style={[styles.cycleDay, isSmall && styles.cycleDaySmall]}>
          Day {widgetData.cycleDay}
        </Text>
        <Text style={styles.cycleTotalSmall}>of {widgetData.totalCycleDays}</Text>
      </View>

      {/* Recommended focus (shown in medium and large widgets) */}
      {isMedium && (
        <View style={styles.focusSection}>
          <Text style={styles.focusLabel}>Today's Focus</Text>
          <Text
            style={styles.focusText}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {widgetData.todaysFocus}
          </Text>
        </View>
      )}

      {/* IRIS branding footer */}
      <View style={styles.footer}>
        <Text style={styles.irisLogo}>IRIS</Text>
        <Text style={styles.lastUpdated}>
          {formatLastUpdated(widgetData.lastUpdated)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    justifyContent: "space-between",
    minHeight: 150,
  },
  loadingContainer: {
    backgroundColor: "#E89BA4",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  phaseName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  phaseNameSmall: {
    fontSize: 18,
  },
  phasePhase: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
  },
  cycleSection: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  cycleDay: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  cycleDaySmall: {
    fontSize: 24,
  },
  cycleTotalSmall: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
  focusSection: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  focusLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  focusText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  irisLogo: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.8)",
    letterSpacing: 2,
  },
  lastUpdated: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "400",
  },
});

export default IrisWidget;

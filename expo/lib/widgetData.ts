import AsyncStorage from "@react-native-async-storage/async-storage";
import { CyclePhase } from "@/types";
import logger from "@/lib/logger";

/**
 * Widget data interface - shared between app and widget.
 *
 * v1.2 (B-014 follow-up): added optional scan-quality fields surfaced from the
 * latest burst-pipeline scan. The native iOS widget can render these as a small
 * badge ("8/8 frames · sharp" or "needs another scan") to reassure the user
 * that recent data is fresh and high-quality. All optional for backward compat.
 */
export interface IrisWidgetData {
  phaseName: string;
  phaseColor: string;
  cycleDay: number;
  totalCycleDays: number;
  todaysFocus: string;
  lastUpdated: number;
  hasData: boolean;
  /** Latest scan quality summary, undefined if no v1.1+ scan exists yet. */
  latestScanQuality?: {
    /** Hours since the most recent scan (rounded). */
    hoursSinceScan: number;
    /** Burst frames analyzed (0–8). 0 = legacy v1.0 single-frame scan. */
    burstFramesAnalyzed: number;
    /** Coarse quality bucket derived from frameStability + framesAnalyzed. */
    quality: "excellent" | "good" | "fair" | "retake-suggested";
  };
}

/**
 * Default widget data when no app data is available
 */
const DEFAULT_WIDGET_DATA: IrisWidgetData = {
  phaseName: "Loading...",
  phaseColor: "#E89BA4",
  cycleDay: 0,
  totalCycleDays: 28,
  todaysFocus: "Open IRIS for personalized insights",
  lastUpdated: 0,
  hasData: false,
};

const STORAGE_KEY_WIDGET_DATA = "iris_widget_data";

/**
 * Get phase name in English or translated
 */
function getPhaseName(phase: CyclePhase): string {
  const phaseNames: Record<CyclePhase, string> = {
    menstrual: "Menstrual",
    follicular: "Follicular",
    ovulation: "Ovulation",
    luteal: "Luteal",
  };
  return phaseNames[phase];
}

/**
 * Get phase color for display
 */
function getPhaseColor(phase: CyclePhase): string {
  const phaseColors: Record<CyclePhase, string> = {
    menstrual: "#EF6461", // Red
    follicular: "#FFB627", // Orange/Yellow
    ovulation: "#E89BA4", // Pink
    luteal: "#6366F1", // Indigo
  };
  return phaseColors[phase];
}

/**
 * Compute a coarse scan-quality bucket from a recent burst scan's measured signals.
 * Returns undefined for legacy (pre-v1.1) scans so the widget can hide the badge.
 */
function deriveScanQuality(
  hoursSinceScan: number,
  burstFramesAnalyzed: number,
  frameStability: number,
): IrisWidgetData["latestScanQuality"] {
  if (burstFramesAnalyzed === 0) return undefined; // legacy single-frame scan
  let quality: "excellent" | "good" | "fair" | "retake-suggested";
  if (burstFramesAnalyzed >= 7 && frameStability >= 0.8) quality = "excellent";
  else if (burstFramesAnalyzed >= 5 && frameStability >= 0.6) quality = "good";
  else if (burstFramesAnalyzed >= 3) quality = "fair";
  else quality = "retake-suggested";
  return { hoursSinceScan, burstFramesAnalyzed, quality };
}

/**
 * Updates widget data and stores it for the widget to read
 * Should be called whenever:
 * - Phase changes
 * - New scan is recorded
 * - New check-in is recorded
 * - Coaching tip changes
 *
 * v1.2: optional `latestScan` arg lets callers surface burst-pipeline quality
 * info to the widget. Pass `null` (or omit) to leave quality unchanged.
 */
export async function updateWidgetData(
  phase: CyclePhase,
  cycleDay: number,
  totalCycleDays: number,
  todaysFocus: string,
  latestScan?: { timestamp: number; burstFramesAnalyzed: number; frameStability: number } | null,
): Promise<void> {
  try {
    let scanQuality: IrisWidgetData["latestScanQuality"];
    if (latestScan) {
      const hoursSinceScan = Math.round((Date.now() - latestScan.timestamp) / (60 * 60 * 1000));
      scanQuality = deriveScanQuality(
        hoursSinceScan,
        latestScan.burstFramesAnalyzed,
        latestScan.frameStability,
      );
    }

    const widgetData: IrisWidgetData = {
      phaseName: getPhaseName(phase),
      phaseColor: getPhaseColor(phase),
      cycleDay,
      totalCycleDays,
      todaysFocus,
      lastUpdated: Date.now(),
      hasData: true,
      ...(scanQuality ? { latestScanQuality: scanQuality } : {}),
    };

    // Store in AsyncStorage
    await AsyncStorage.setItem(
      STORAGE_KEY_WIDGET_DATA,
      JSON.stringify(widgetData)
    );

    logger.log("Widget data updated:", widgetData);

    // For iOS app groups, we would also write to app group defaults here
    // This requires native code configuration
    // Example (would need native implementation):
    // await writeToAppGroupDefaults("group.se.mojjo.iris", widgetData);
  } catch (error) {
    logger.log("Error updating widget data:", error);
  }
}

/**
 * Retrieves current widget data
 */
export async function getWidgetData(): Promise<IrisWidgetData> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY_WIDGET_DATA);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    logger.log("Error retrieving widget data:", error);
  }
  return DEFAULT_WIDGET_DATA;
}

/**
 * Clears widget data (e.g., on logout)
 */
export async function clearWidgetData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY_WIDGET_DATA);
  } catch (error) {
    logger.log("Error clearing widget data:", error);
  }
}

/**
 * Formats cycle day display as "Day X of Y"
 */
export function formatCycleDayDisplay(cycleDay: number, totalDays: number): string {
  return `Day ${cycleDay} of ${totalDays}`;
}

/**
 * Formats the date of last update
 */
export function formatLastUpdated(timestamp: number): string {
  if (timestamp === 0) return "Never";
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

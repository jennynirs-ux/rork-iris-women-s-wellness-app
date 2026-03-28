import React, { useMemo, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Pressable, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { X, Eye, Heart, Droplets, AlertCircle, Sparkles, Brain, Zap, Battery, Moon, Flame, Users, BarChart3, TrendingUp, Lightbulb, Info, Sprout, Flower2, ChevronDown, ChevronUp, Coffee, Wine, Thermometer, Minus, Baby, ArrowRight, CheckCircle, XCircle, Shield } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useApp } from "@/contexts/AppContext";
import CircularProgress from "@/components/CircularProgress";
import { CyclePhase, DailyCheckIn, ScanResult } from "@/types";
import { router } from "expo-router";
import { getMarkerTranslation } from "@/lib/insightsTranslations";
import { translateSymptoms } from "@/lib/symptomTranslation";
import { LineChart } from "react-native-chart-kit";

type MarkerType = 'stress' | 'energy' | 'recovery' | 'hydration' | 'inflammation' | 'fatigue' |
  'cognitiveSharpness' | 'emotionalSensitivity' | 'socialEnergy' | 'moodVolatility' |
  'dehydrationTendency' | 'inflammatoryStress' | 'pupilSize' | 'symmetry' |
  'scleraYellowness' | 'underEyeDarkness' | 'eyeOpenness' | 'tearFilmQuality';

/** Convert a hex color like "#E89BA4" to an rgba callback for react-native-chart-kit */
const hexToChartColor = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (opacity = 1) => `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const getMetricStatus = (value: number, higherIsBetter: boolean, t: any, themeColors: typeof Colors.light): { label: string; color: string; bgColor: string } => {
  if (higherIsBetter) {
    if (value >= 7) return { label: t.insights.statusGood, color: themeColors.statusGood, bgColor: themeColors.statusGoodBg };
    if (value >= 4) return { label: t.insights.statusModerate, color: themeColors.statusModerate, bgColor: themeColors.statusModerateBg };
    return { label: t.insights.statusAttention, color: themeColors.statusAttention, bgColor: themeColors.statusAttentionBg };
  } else {
    if (value <= 3.9) return { label: t.insights.statusGood, color: themeColors.statusGood, bgColor: themeColors.statusGoodBg };
    if (value <= 6.9) return { label: t.insights.statusModerate, color: themeColors.statusModerate, bgColor: themeColors.statusModerateBg };
    return { label: t.insights.statusAttention, color: themeColors.statusAttention, bgColor: themeColors.statusAttentionBg };
  }
};

const calculateScanAverages = (scans: ScanResult[]) => {
  if (scans.length === 0) return null;
  return {
    avgFatigue: scans.reduce((s, sc) => s + sc.fatigueLevel, 0) / scans.length,
    avgStress: scans.reduce((s, sc) => s + sc.stressScore, 0) / scans.length,
    avgRecovery: scans.reduce((s, sc) => s + sc.recoveryScore, 0) / scans.length,
    avgEnergy: scans.reduce((s, sc) => s + sc.energyScore, 0) / scans.length,
    avgInflammation: scans.reduce((s, sc) => s + sc.inflammation, 0) / scans.length,
  };
};

const groupScansByDate = (scans: ScanResult[]): Map<string, ScanResult[]> => {
  const grouped = new Map<string, ScanResult[]>();
  scans.forEach(scan => {
    const dateStr = scan.date;
    if (!grouped.has(dateStr)) {
      grouped.set(dateStr, []);
    }
    grouped.get(dateStr)!.push(scan);
  });
  return grouped;
};

const getAveragedDataByDate = (grouped: Map<string, ScanResult[]>) => {
  const averaged: { date: string; timestamp: number; stress: number; energy: number; recovery: number; hydration: number; inflammation: number; fatigue: number }[] = [];

  const sortedEntries = Array.from(grouped.entries()).sort((a, b) => {
    const dateA = new Date(a[0]);
    const dateB = new Date(b[0]);
    return dateA.getTime() - dateB.getTime();
  });

  sortedEntries.forEach(([date, scansForDay]) => {
    const avg = {
      date,
      timestamp: new Date(date).getTime(),
      stress: scansForDay.reduce((s, sc) => s + sc.stressScore, 0) / scansForDay.length,
      energy: scansForDay.reduce((s, sc) => s + sc.energyScore, 0) / scansForDay.length,
      recovery: scansForDay.reduce((s, sc) => s + sc.recoveryScore, 0) / scansForDay.length,
      hydration: scansForDay.reduce((s, sc) => s + sc.hydrationLevel, 0) / scansForDay.length,
      inflammation: scansForDay.reduce((s, sc) => s + sc.inflammation, 0) / scansForDay.length,
      fatigue: scansForDay.reduce((s, sc) => s + sc.fatigueLevel, 0) / scansForDay.length,
    };
    averaged.push(avg);
  });

  return averaged;
};

const getFilteredDataByDays = (data: { date: string; timestamp: number; stress: number; energy: number; recovery: number; hydration: number; inflammation: number; fatigue: number }[], days: number) => {
  const now = Date.now();
  const cutoff = now - (days * 24 * 60 * 60 * 1000);
  return data.filter(d => d.timestamp >= cutoff);
};

const generateCheckInInsights = (
  todayCheckIn: DailyCheckIn | null,
  latestScan: ScanResult | null,
  currentPhase: CyclePhase,
  t: any
): { icon: any; color: string; title: string; message: string }[] => {
  if (!todayCheckIn || !latestScan) return [];

  const insights: { icon: any; color: string; title: string; message: string }[] = [];

  if (todayCheckIn.sleep < 5 && latestScan.fatigueLevel > 6) {
    insights.push({
      icon: Moon,
      color: "#F4C896",
      title: t.insights.crossSleepFatigueTitle,
      message: t.insights.crossSleepFatigueMsg,
    });
  }

  if (todayCheckIn.hadCaffeine && latestScan.stressScore > 7) {
    insights.push({
      icon: Coffee,
      color: "#D4A574",
      title: t.insights.crossCaffeineStressTitle,
      message: `${t.insights.crossCaffeineStressMsg} ${currentPhase === 'luteal' ? t.insights.crossCaffeineStressLuteal : t.insights.crossCaffeineStressOther}.`,
    });
  }

  if (todayCheckIn.hadAlcohol && (latestScan.hydrationLevel < 5 || latestScan.physiologicalStates?.dehydrationTendency > 6)) {
    insights.push({
      icon: Wine,
      color: "#A4C8E8",
      title: t.insights.crossAlcoholHydrationTitle,
      message: t.insights.crossAlcoholHydrationMsg,
    });
  }

  if (todayCheckIn.isIll && latestScan.inflammation > 6) {
    insights.push({
      icon: Thermometer,
      color: "#E89BA4",
      title: t.insights.crossIllnessInflammationTitle,
      message: t.insights.crossIllnessInflammationMsg,
    });
  }

  if (todayCheckIn.stressLevel && todayCheckIn.stressLevel > 7 && latestScan.emotionalMentalState?.emotionalSensitivity > 6) {
    insights.push({
      icon: Brain,
      color: "#F4C8D4",
      title: t.insights.crossStressEmotionalTitle,
      message: t.insights.crossStressEmotionalMsg,
    });
  }

  if ((todayCheckIn.hadSugar || todayCheckIn.hadProcessedFood) && latestScan.inflammation > 6) {
    insights.push({
      icon: Flame,
      color: "#F4D4A4",
      title: t.insights.crossDietInflammationTitle,
      message: t.insights.crossDietInflammationMsg,
    });
  }

  if (todayCheckIn.sleep < 5 && latestScan.emotionalMentalState?.cognitiveSharpness < 5) {
    insights.push({
      icon: Brain,
      color: "#96E8D4",
      title: t.insights.crossSleepCognitiveTitle,
      message: t.insights.crossSleepCognitiveMsg,
    });
  }

  if (todayCheckIn.energy < 4 && latestScan.energyScore < 5 && currentPhase === 'menstrual') {
    insights.push({
      icon: Battery,
      color: "#E89BA4",
      title: t.insights.crossMenstrualEnergyTitle,
      message: t.insights.crossMenstrualEnergyMsg,
    });
  }

  if (todayCheckIn.symptoms.includes("Cramps") && latestScan.stressScore > 6) {
    insights.push({
      icon: AlertCircle,
      color: "#E89BA4",
      title: t.insights.crossCrampsStressTitle,
      message: t.insights.crossCrampsStressMsg,
    });
  }

  if (todayCheckIn.symptoms.includes("Headache") && latestScan.fatigueLevel > 6) {
    insights.push({
      icon: AlertCircle,
      color: "#F4C896",
      title: t.insights.crossHeadacheFatigueTitle,
      message: t.insights.crossHeadacheFatigueMsg,
    });
  }

  if (todayCheckIn.mood < 4 && latestScan.emotionalMentalState?.moodVolatilityRisk > 6 && currentPhase === 'luteal') {
    insights.push({
      icon: Heart,
      color: "#F4B896",
      title: t.insights.crossLutealMoodTitle,
      message: t.insights.crossLutealMoodMsg,
    });
  }

  return insights;
};

const calculateVasomotorMetrics = (checkIns: DailyCheckIn[], t: any) => {
  if (checkIns.length === 0) {
    return null;
  }

  const last7Days = checkIns.slice(-7);

  const avgHotFlashes = last7Days.reduce((sum, ci) => sum + (ci.hotFlashCount || 0), 0) / last7Days.length;

  const hotFlashSeverities = last7Days
    .filter(ci => ci.hotFlashCount && ci.hotFlashCount > 0)
    .map(ci => ci.hotFlashSeverity || 'mild');

  const severityMultiplier = (severity: string | undefined) => {
    switch (severity) {
      case 'severe': return 3;
      case 'moderate': return 2;
      default: return 1;
    }
  };

  const avgSeverityMultiplier = hotFlashSeverities.length > 0
    ? hotFlashSeverities.reduce((sum, sev) => sum + severityMultiplier(sev), 0) / hotFlashSeverities.length
    : 1;

  const nightSweatDays = last7Days.filter(ci => ci.nightSweatSeverity && ci.nightSweatSeverity !== 'none').length;

  const vmsScore = (avgHotFlashes * avgSeverityMultiplier) + (nightSweatDays * 1.5);

  let trend: 'increasing' | 'stable' | 'decreasing' = 'stable';
  if (last7Days.length >= 3) {
    const first3Avg = last7Days.slice(0, 3).reduce((sum, ci) => sum + (ci.hotFlashCount || 0), 0) / 3;
    const last3Avg = last7Days.slice(-3).reduce((sum, ci) => sum + (ci.hotFlashCount || 0), 0) / 3;
    if (last3Avg > first3Avg * 1.2) trend = 'increasing';
    else if (last3Avg < first3Avg * 0.8) trend = 'decreasing';
  }

  return {
    avgHotFlashes: avgHotFlashes.toFixed(1),
    trend,
    nightSweatDays,
    vmsScore: vmsScore.toFixed(1),
  };
};



const getPhaseGuidance = (phase: CyclePhase, t: any) => {
  switch (phase) {
    case "menstrual":
      return {
        description: t.phaseGuidance.menstrualDescription,
        whatToExpect: [
          t.phaseGuidance.menstrualExpect1,
          t.phaseGuidance.menstrualExpect2,
          t.phaseGuidance.menstrualExpect3,
          t.phaseGuidance.menstrualExpect4
        ],
        howToImprove: [
          t.phaseGuidance.menstrualImprove1,
          t.phaseGuidance.menstrualImprove2,
          t.phaseGuidance.menstrualImprove3,
          t.phaseGuidance.menstrualImprove4,
          t.phaseGuidance.menstrualImprove5
        ],
        icon: Moon,
        color: "#E89BA4"
      };
    case "follicular":
      return {
        description: t.phaseGuidance.follicularDescription,
        whatToExpect: [
          t.phaseGuidance.follicularExpect1,
          t.phaseGuidance.follicularExpect2,
          t.phaseGuidance.follicularExpect3,
          t.phaseGuidance.follicularExpect4
        ],
        howToImprove: [
          t.phaseGuidance.follicularImprove1,
          t.phaseGuidance.follicularImprove2,
          t.phaseGuidance.follicularImprove3,
          t.phaseGuidance.follicularImprove4,
          t.phaseGuidance.follicularImprove5
        ],
        icon: Sprout,
        color: "#8BC9A3"
      };
    case "ovulation":
      return {
        description: t.phaseGuidance.ovulationDescription,
        whatToExpect: [
          t.phaseGuidance.ovulationExpect1,
          t.phaseGuidance.ovulationExpect2,
          t.phaseGuidance.ovulationExpect3,
          t.phaseGuidance.ovulationExpect4
        ],
        howToImprove: [
          t.phaseGuidance.ovulationImprove1,
          t.phaseGuidance.ovulationImprove2,
          t.phaseGuidance.ovulationImprove3,
          t.phaseGuidance.ovulationImprove4,
          t.phaseGuidance.ovulationImprove5
        ],
        icon: Sparkles,
        color: "#F4C896"
      };
    case "luteal":
      return {
        description: t.phaseGuidance.lutealDescription,
        whatToExpect: [
          t.phaseGuidance.lutealExpect1,
          t.phaseGuidance.lutealExpect2,
          t.phaseGuidance.lutealExpect3,
          t.phaseGuidance.lutealExpect4,
          t.phaseGuidance.lutealExpect5
        ],
        howToImprove: [
          t.phaseGuidance.lutealImprove1,
          t.phaseGuidance.lutealImprove2,
          t.phaseGuidance.lutealImprove3,
          t.phaseGuidance.lutealImprove4,
          t.phaseGuidance.lutealImprove5,
          t.phaseGuidance.lutealImprove6
        ],
        icon: Flower2,
        color: "#B8A4E8"
      };
  }
};

type LifeStageOverride = 'pregnancy' | 'postpartum' | 'perimenopause' | 'menopause';

const getLifeStageGuidance = (lifeStage: LifeStageOverride, weeksPregnant: number, t: any) => {
  switch (lifeStage) {
    case 'pregnancy': {
      const trimester = weeksPregnant <= 13 ? 1 : weeksPregnant <= 27 ? 2 : 3;
      const trimesterKey = `trimester${trimester}` as 'trimester1' | 'trimester2' | 'trimester3';
      const guidanceMap: Record<number, { description: string; whatToExpect: string[]; howToImprove: string[]; icon: any; color: string }> = {
        1: {
          description: t.pregnancyGuidance?.t1Description ?? 'Your body is adapting to early pregnancy. Hormonal shifts may cause fatigue, nausea, and mood changes. Listen to your body and rest when needed.',
          whatToExpect: [
            t.pregnancyGuidance?.t1Expect1 ?? 'Increased fatigue and need for rest',
            t.pregnancyGuidance?.t1Expect2 ?? 'Morning sickness or nausea throughout the day',
            t.pregnancyGuidance?.t1Expect3 ?? 'Heightened emotional sensitivity',
            t.pregnancyGuidance?.t1Expect4 ?? 'Breast tenderness and bloating',
          ],
          howToImprove: [
            t.pregnancyGuidance?.t1Improve1 ?? 'Prioritize sleep and take naps when possible',
            t.pregnancyGuidance?.t1Improve2 ?? 'Eat small, frequent meals to manage nausea',
            t.pregnancyGuidance?.t1Improve3 ?? 'Stay hydrated — aim for 8-10 glasses of water daily',
            t.pregnancyGuidance?.t1Improve4 ?? 'Gentle walks and prenatal yoga can help with energy',
            t.pregnancyGuidance?.t1Improve5 ?? 'Consider prenatal vitamins to support your wellness journey',
          ],
          icon: Baby,
          color: '#F4C8D4',
        },
        2: {
          description: t.pregnancyGuidance?.t2Description ?? 'Often called the "golden trimester." Energy typically improves, nausea subsides, and you may feel more like yourself. Your baby is growing rapidly.',
          whatToExpect: [
            t.pregnancyGuidance?.t2Expect1 ?? 'Increased energy compared to the first trimester',
            t.pregnancyGuidance?.t2Expect2 ?? 'Growing belly and body changes',
            t.pregnancyGuidance?.t2Expect3 ?? 'Baby movements (flutters around 16-20 weeks)',
            t.pregnancyGuidance?.t2Expect4 ?? 'Improved mood and emotional stability',
          ],
          howToImprove: [
            t.pregnancyGuidance?.t2Improve1 ?? 'Continue regular, moderate exercise like walking or swimming',
            t.pregnancyGuidance?.t2Improve2 ?? 'Focus on balanced nutrition with iron and calcium',
            t.pregnancyGuidance?.t2Improve3 ?? 'Practice pelvic floor exercises',
            t.pregnancyGuidance?.t2Improve4 ?? 'Stay active but avoid high-impact activities',
            t.pregnancyGuidance?.t2Improve5 ?? 'Consider prenatal classes and prepare for the third trimester',
          ],
          icon: Baby,
          color: '#F4C896',
        },
        3: {
          description: t.pregnancyGuidance?.t3Description ?? 'The final stretch! Your body is preparing for birth. You may experience increased fatigue, discomfort, and nesting instincts.',
          whatToExpect: [
            t.pregnancyGuidance?.t3Expect1 ?? 'Increased fatigue as your body prepares for birth',
            t.pregnancyGuidance?.t3Expect2 ?? 'Braxton Hicks contractions',
            t.pregnancyGuidance?.t3Expect3 ?? 'Difficulty sleeping and finding comfortable positions',
            t.pregnancyGuidance?.t3Expect4 ?? 'Nesting instincts and emotional preparation',
          ],
          howToImprove: [
            t.pregnancyGuidance?.t3Improve1 ?? 'Rest frequently and listen to your body',
            t.pregnancyGuidance?.t3Improve2 ?? 'Practice relaxation and breathing techniques',
            t.pregnancyGuidance?.t3Improve3 ?? 'Gentle stretching and prenatal yoga for comfort',
            t.pregnancyGuidance?.t3Improve4 ?? 'Stay hydrated and eat nutrient-dense foods',
            t.pregnancyGuidance?.t3Improve5 ?? 'Prepare your birth plan and hospital bag',
          ],
          icon: Baby,
          color: '#E89BA4',
        },
      };
      return { ...guidanceMap[trimester], phaseName: t.phases[trimesterKey] };
    }
    case 'postpartum':
      return {
        description: t.postpartumGuidance?.description ?? 'Your body is recovering from pregnancy and birth. Hormonal shifts are significant during this period. Be patient with yourself.',
        whatToExpect: [
          t.postpartumGuidance?.expect1 ?? 'Hormonal fluctuations affecting mood and energy',
          t.postpartumGuidance?.expect2 ?? 'Physical recovery from birth',
          t.postpartumGuidance?.expect3 ?? 'Sleep disruption from newborn care',
          t.postpartumGuidance?.expect4 ?? 'Gradual return of energy over weeks',
        ],
        howToImprove: [
          t.postpartumGuidance?.improve1 ?? 'Sleep when the baby sleeps',
          t.postpartumGuidance?.improve2 ?? 'Accept help from family and friends',
          t.postpartumGuidance?.improve3 ?? 'Focus on nutrition and hydration',
          t.postpartumGuidance?.improve4 ?? 'Gentle walks when you feel ready and comfortable',
          t.postpartumGuidance?.improve5 ?? 'Practice self-compassion — recovery takes time',
        ],
        icon: Heart,
        color: '#F4C8D4',
        phaseName: t.phases.postpartumRecovery,
      };
    case 'perimenopause':
      return {
        description: t.perimenopauseGuidance?.description ?? 'Your body is transitioning. Hormonal fluctuations may cause irregular cycles, mood changes, and varying energy levels.',
        whatToExpect: [
          t.perimenopauseGuidance?.expect1 ?? 'Irregular cycle lengths and flow changes',
          t.perimenopauseGuidance?.expect2 ?? 'Hot flashes and temperature sensitivity',
          t.perimenopauseGuidance?.expect3 ?? 'Sleep disruptions and fatigue',
          t.perimenopauseGuidance?.expect4 ?? 'Mood swings and brain fog',
        ],
        howToImprove: [
          t.perimenopauseGuidance?.improve1 ?? 'Regular exercise to manage symptoms',
          t.perimenopauseGuidance?.improve2 ?? 'Focus on calcium and vitamin D intake',
          t.perimenopauseGuidance?.improve3 ?? 'Practice stress management and mindfulness',
          t.perimenopauseGuidance?.improve4 ?? 'Maintain a cool sleeping environment',
          t.perimenopauseGuidance?.improve5 ?? 'Explore wellness strategies that work best for you',
        ],
        icon: Flower2,
        color: '#B8A4E8',
        phaseName: t.phases.perimenopauseTransition,
      };
    case 'menopause':
      return {
        description: t.menopauseGuidance?.description ?? 'Traditional cycle phases no longer apply. Focus on overall wellness, bone health, and cardiovascular fitness.',
        whatToExpect: [
          t.menopauseGuidance?.expect1 ?? 'Stabilizing hormones after the transition',
          t.menopauseGuidance?.expect2 ?? 'Possible continued hot flashes',
          t.menopauseGuidance?.expect3 ?? 'Changes in skin and hair',
          t.menopauseGuidance?.expect4 ?? 'Shifts in metabolism and body composition',
        ],
        howToImprove: [
          t.menopauseGuidance?.improve1 ?? 'Strength training for bone health',
          t.menopauseGuidance?.improve2 ?? 'Cardiovascular exercise for heart health',
          t.menopauseGuidance?.improve3 ?? 'Focus on nutrition, especially calcium and fiber',
          t.menopauseGuidance?.improve4 ?? 'Stay socially active and engaged',
          t.menopauseGuidance?.improve5 ?? 'Regular health check-ups and screenings',
        ],
        icon: Sparkles,
        color: '#96E8D4',
        phaseName: t.phases.menopause,
      };
  }
};

function generateTrendNarrative(
  data: number[],
  metricName: string,
  isGoodHigh: boolean,
  t: any
): string {
  if (data.length < 2) return '';
  const recent = data.slice(-3);
  const earlier = data.slice(0, 3);
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
  const change = recentAvg - earlierAvg;
  const pctChange = Math.abs(Math.round((change / (earlierAvg || 1)) * 100));

  if (Math.abs(change) < 0.5) {
    return (t.insights?.trendSteady ?? 'Your {metric} has been steady').replace('{metric}', metricName);
  }
  const direction = change > 0
    ? (t.insights?.trendRising ?? 'rising')
    : (t.insights?.trendDropping ?? 'dropping');
  const sentiment = (change > 0 === isGoodHigh)
    ? ` ${t.insights?.trendNicely ?? 'nicely'}`
    : '';
  const template = t.insights?.trendChange ?? 'Your {metric} has been {direction}{sentiment} — {pct}% over this period';
  return template
    .replace('{metric}', metricName)
    .replace('{direction}', direction)
    .replace('{sentiment}', sentiment)
    .replace('{pct}', String(pctChange));
}

export default function InsightsScreen() {
  const { scans, currentPhase, todaySummary, latestScan, todayCheckIn, checkIns, userProfile, lifeStageSuggestion, phaseEstimate, t, language } = useApp();
  const lifeStageOverride = phaseEstimate.lifeStageOverride;
  const isNonCycleLifeStage = !!lifeStageOverride;
  const { colors } = useTheme();
  const styles = useMemo(() => createInsightsStyles(colors), [colors]);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<MarkerType | null>(null);
  const [phaseGuidanceExpanded, setPhaseGuidanceExpanded] = useState(false);
  const [disclaimerVisible, setDisclaimerVisible] = useState(false);
  const [trendTimeRange, setTrendTimeRange] = useState<7 | 30 | 90>(7);

  const showMarkerInfo = useCallback((marker: MarkerType) => {
    setSelectedMarker(marker);
    setInfoModalVisible(true);
  }, []);

  const phaseGuidance = useMemo(() => {
    if (lifeStageOverride) {
      const lsGuidance = getLifeStageGuidance(lifeStageOverride, userProfile.weeksPregnant || 0, t);
      return lsGuidance || { description: '', whatToExpect: [], howToImprove: [], icon: Moon, color: '#E89BA4', phaseName: '' };
    }
    const guidance = getPhaseGuidance(currentPhase, t);
    return guidance ? { ...guidance, phaseName: t.phases[currentPhase] } : { description: '', whatToExpect: [], howToImprove: [], icon: Moon, color: '#E89BA4', phaseName: '' };
  }, [currentPhase, t, lifeStageOverride, userProfile.weeksPregnant]);
  const markerInfo = selectedMarker ? getMarkerTranslation(selectedMarker, language, currentPhase, todayCheckIn, latestScan) : null;

  const checkInInsights = useMemo(() => {
    return generateCheckInInsights(todayCheckIn, latestScan, currentPhase, t);
  }, [todayCheckIn, latestScan, currentPhase, t]);

  const patternAnalysis = useMemo(() => {
    if (!userProfile.hasCompletedOnboarding) return null;

    const now = Date.now();
    const fourteenDaysAgo = now - 14 * 24 * 60 * 60 * 1000;
    const recentCheckIns = checkIns.slice(-14);
    const recentScans = scans.filter(s => new Date(s.date).getTime() >= fourteenDaysAgo);

    if (recentCheckIns.length < 2 && recentScans.length < 2) return null;

    const pregnancyIndicators: { label: string; detected: boolean }[] = [];
    const periIndicators: { label: string; detected: boolean }[] = [];

    const lastPeriod = new Date(userProfile.lastPeriodDate);
    const daysSincePeriod = Math.floor((now - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
    const missedPeriod = daysSincePeriod > (userProfile.cycleLength || 28) + 7;
    pregnancyIndicators.push({ label: 'Missed period', detected: missedPeriod });

    if (recentCheckIns.length >= 2) {
      const hasNausea = recentCheckIns.some(ci => ci.symptoms.includes('Nausea'));
      const hasBreastTenderness = recentCheckIns.some(ci => ci.symptoms.includes('Breast Tenderness'));
      const frequentFatigue = recentCheckIns.filter(ci => ci.symptoms.includes('Fatigue')).length >= 2;
      const frequentMoodSwings = recentCheckIns.filter(ci => ci.symptoms.includes('Mood Swings')).length >= 2;

      pregnancyIndicators.push({ label: 'Nausea reported', detected: hasNausea });
      pregnancyIndicators.push({ label: 'Breast tenderness', detected: hasBreastTenderness });
      pregnancyIndicators.push({ label: 'Persistent fatigue', detected: frequentFatigue });

      const hasHotFlashes = recentCheckIns.some(ci => ci.symptoms.includes('Hot Flashes'));
      const hasNightSweats = recentCheckIns.some(ci => ci.symptoms.includes('Night Sweats'));
      const hasInsomnia = recentCheckIns.filter(ci => ci.symptoms.includes('Insomnia')).length >= 2;
      const hasBrainFog = recentCheckIns.some(ci => ci.symptoms.includes('Brain Fog'));

      periIndicators.push({ label: 'Hot flashes', detected: hasHotFlashes });
      periIndicators.push({ label: 'Night sweats', detected: hasNightSweats });
      periIndicators.push({ label: 'Sleep disruption', detected: hasInsomnia });
      periIndicators.push({ label: 'Brain fog', detected: hasBrainFog });
      periIndicators.push({ label: 'Mood swings', detected: frequentMoodSwings });
    }

    if (recentScans.length >= 2) {
      const averages = calculateScanAverages(recentScans);
      if (averages) {
        const { avgFatigue, avgStress, avgRecovery, avgEnergy, avgInflammation } = averages;

        pregnancyIndicators.push({ label: 'High fatigue pattern', detected: avgFatigue > 6 });
        pregnancyIndicators.push({ label: 'Low energy pattern', detected: avgEnergy < 5 });
        pregnancyIndicators.push({ label: 'Higher inflammation scores', detected: avgInflammation > 5 });

        periIndicators.push({ label: 'Higher stress scores', detected: avgStress > 6 });
        periIndicators.push({ label: 'Low recovery pattern', detected: avgRecovery < 5 });

        const energies = recentScans.map(s => s.energyScore);
        const mean = energies.reduce((a, b) => a + b, 0) / energies.length;
        const variance = energies.reduce((sum, e) => sum + Math.pow(e - mean, 2), 0) / energies.length;
        periIndicators.push({ label: 'Volatile energy levels', detected: Math.sqrt(variance) > 2.5 });
      }
    }

    let age = 0;
    if (userProfile.birthday) {
      const birth = new Date(userProfile.birthday);
      age = Math.floor((now - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
    }
    periIndicators.push({ label: 'Age 40+', detected: age >= 40 });
    periIndicators.push({ label: 'Irregular cycles', detected: userProfile.cycleRegularity === 'irregular' });

    const pregnancyDetected = pregnancyIndicators.filter(i => i.detected).length;
    const periDetected = periIndicators.filter(i => i.detected).length;

    const currentStage = userProfile.lifeStage;
    const hasAcceptedPregnancy = currentStage === 'pregnancy';
    const hasAcceptedPeri = currentStage === 'perimenopause' || currentStage === 'menopause';

    return {
      pregnancyIndicators,
      periIndicators,
      pregnancyDetected,
      periDetected,
      pregnancyTotal: pregnancyIndicators.length,
      periTotal: periIndicators.length,
      currentStage,
      hasAcceptedPregnancy,
      hasAcceptedPeri,
      dataPoints: recentCheckIns.length + recentScans.length,
    };
  }, [checkIns, scans, userProfile]);



  const averages = useMemo(() => {
    if (scans.length === 0) {
      return { 
        stress: 0, 
        energy: 0, 
        recovery: 0, 
        hydration: 0, 
        inflammation: 0,
        fatigue: 0,
        cognitiveSharpness: 0,
        emotionalSensitivity: 0,
        socialEnergy: 0,
        moodVolatility: 0,
        pupilDiameter: 0,
        pupilSymmetry: 0,
        dehydrationTendency: 0,
        inflammatoryStress: 0,
        scleraYellowness: 0,
        underEyeDarkness: 0,
        eyeOpenness: 0,
        tearFilmQuality: 0,
      };
    }

    const sum = scans.reduce(
      (acc, scan) => ({
        stress: acc.stress + scan.stressScore,
        energy: acc.energy + scan.energyScore,
        recovery: acc.recovery + scan.recoveryScore,
        hydration: acc.hydration + scan.hydrationLevel,
        inflammation: acc.inflammation + scan.inflammation,
        fatigue: acc.fatigue + scan.fatigueLevel,
        cognitiveSharpness: acc.cognitiveSharpness + (scan.emotionalMentalState?.cognitiveSharpness ?? 0),
        emotionalSensitivity: acc.emotionalSensitivity + (scan.emotionalMentalState?.emotionalSensitivity ?? 0),
        socialEnergy: acc.socialEnergy + (scan.emotionalMentalState?.socialEnergy ?? 0),
        moodVolatility: acc.moodVolatility + (scan.emotionalMentalState?.moodVolatilityRisk ?? 0),
        pupilDiameter: acc.pupilDiameter + (scan.rawOpticalSignals?.pupilDiameter ?? 0),
        pupilSymmetry: acc.pupilSymmetry + (scan.rawOpticalSignals?.pupilSymmetry ?? 0),
        dehydrationTendency: acc.dehydrationTendency + (scan.physiologicalStates?.dehydrationTendency ?? 0),
        inflammatoryStress: acc.inflammatoryStress + (scan.physiologicalStates?.inflammatoryStress ?? 0),
        scleraYellowness: acc.scleraYellowness + (1 - ((scan.rawOpticalSignals?.scleraBrightness ?? 127) / 255)),
        underEyeDarkness: acc.underEyeDarkness + (scan.physiologicalStates?.sleepDebtLikelihood ?? 0),
        eyeOpenness: acc.eyeOpenness + (scan.physiologicalStates?.calmVsAlert ?? 0),
        tearFilmQuality: acc.tearFilmQuality + (scan.rawOpticalSignals?.tearFilmReflectivity ?? 0),
      }),
      { stress: 0, energy: 0, recovery: 0, hydration: 0, inflammation: 0, fatigue: 0, cognitiveSharpness: 0, emotionalSensitivity: 0, socialEnergy: 0, moodVolatility: 0, pupilDiameter: 0, pupilSymmetry: 0, dehydrationTendency: 0, inflammatoryStress: 0, scleraYellowness: 0, underEyeDarkness: 0, eyeOpenness: 0, tearFilmQuality: 0 }
    );

    const len = scans.length || 1;
    return {
      stress: Math.round(sum.stress / len),
      energy: Math.round(sum.energy / len),
      recovery: Math.round(sum.recovery / len),
      hydration: Math.round(sum.hydration / len),
      inflammation: Math.round(sum.inflammation / len),
      fatigue: Math.round(sum.fatigue / len),
      cognitiveSharpness: (sum.cognitiveSharpness / len).toFixed(1),
      emotionalSensitivity: (sum.emotionalSensitivity / len).toFixed(1),
      socialEnergy: (sum.socialEnergy / len).toFixed(1),
      moodVolatility: (sum.moodVolatility / len).toFixed(1),
      pupilDiameter: (sum.pupilDiameter / len).toFixed(1),
      pupilSymmetry: (sum.pupilSymmetry / len).toFixed(2),
      dehydrationTendency: (sum.dehydrationTendency / len).toFixed(1),
      inflammatoryStress: (sum.inflammatoryStress / len).toFixed(1),
      scleraYellowness: (sum.scleraYellowness / len * 10).toFixed(1),
      underEyeDarkness: (sum.underEyeDarkness / len * 10).toFixed(1),
      eyeOpenness: (sum.eyeOpenness / len * 10).toFixed(1),
      tearFilmQuality: (sum.tearFilmQuality / len * 10).toFixed(1),
    };
  }, [scans]);

  const trendData = useMemo(() => {
    if (scans.length < 2) return null;

    const grouped = groupScansByDate(scans);
    const averaged = getAveragedDataByDate(grouped);
    const filtered = getFilteredDataByDays(averaged, trendTimeRange);

    if (filtered.length < 2) return null;

    return filtered;
  }, [scans, trendTimeRange]);

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 32; // padding

  const physicalChartData = useMemo(() => {
    if (!trendData) return null;

    return {
      labels: trendData.map(d => {
        const date = new Date(d.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      datasets: [
        {
          data: trendData.map(d => d.stress),
          color: hexToChartColor(colors.phaseMenstrual),
          strokeWidth: 2,
          label: 'Stress'
        },
        {
          data: trendData.map(d => d.energy),
          color: hexToChartColor(colors.phaseFollicular),
          strokeWidth: 2,
          label: 'Energy'
        },
        {
          data: trendData.map(d => d.recovery),
          color: hexToChartColor(colors.phaseLuteal),
          strokeWidth: 2,
          label: 'Recovery'
        }
      ]
    };
  }, [trendData, colors]);

  const hydrationInflammationChartData = useMemo(() => {
    if (!trendData) return null;

    return {
      labels: trendData.map(d => {
        const date = new Date(d.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      datasets: [
        {
          data: trendData.map(d => d.hydration),
          color: hexToChartColor(colors.habitHydration),
          strokeWidth: 2,
          label: 'Hydration'
        },
        {
          data: trendData.map(d => d.inflammation),
          color: hexToChartColor(colors.habitMovement),
          strokeWidth: 2,
          label: 'Inflammation'
        }
      ]
    };
  }, [trendData, colors]);

  const fatigueChartData = useMemo(() => {
    if (!trendData) return null;

    return {
      labels: trendData.map(d => {
        const date = new Date(d.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      datasets: [
        {
          data: trendData.map(d => d.fatigue),
          color: hexToChartColor(colors.habitRecovery),
          strokeWidth: 2,
          label: 'Fatigue'
        }
      ]
    };
  }, [trendData, colors]);

  const trendNarratives = useMemo(() => {
    if (!trendData || trendData.length < 2) return null;
    const stressData = trendData.map(d => d.stress);
    const energyData = trendData.map(d => d.energy);
    const recoveryData = trendData.map(d => d.recovery);
    const hydrationData = trendData.map(d => d.hydration);
    const inflammationData = trendData.map(d => d.inflammation);
    const fatigueData = trendData.map(d => d.fatigue);

    return {
      physical: [
        generateTrendNarrative(stressData, t.home.stress, false, t),
        generateTrendNarrative(energyData, t.home.energy, true, t),
        generateTrendNarrative(recoveryData, t.home.recovery, true, t),
      ].filter(Boolean).join('. ') || null,
      hydrationInflammation: [
        generateTrendNarrative(hydrationData, t.habits?.hydration ?? 'Hydration', true, t),
        generateTrendNarrative(inflammationData, t.insights?.inflammation ?? 'Inflammation', false, t),
      ].filter(Boolean).join('. ') || null,
      fatigue: generateTrendNarrative(fatigueData, t.insights?.fatigue ?? 'Fatigue', false, t) || null,
    };
  }, [trendData, t]);

  if (scans.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.noScansContainer}>
          <BarChart3 size={64} color={colors.textTertiary} />
          <Text style={styles.noScansTitle}>
            {(t.insights as any)?.emptyTitle || "Your Insights Await"}
          </Text>
          <Text style={styles.noScansSubtitle}>
            {(t.insights as any)?.emptySubtitle || "Complete your first scan to see personalized wellness insights and trends"}
          </Text>
          <TouchableOpacity
            style={styles.noScansCta}
            onPress={() => router.push("/(tabs)/scan" as any)}
            activeOpacity={0.8}
          >
            <Eye size={20} color={colors.card} />
            <Text style={styles.noScansCtaText}>Start Scanning</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>{t.insights.title}</Text>
              <Text style={styles.headerSubtitle}>{t.insights.subtitle}</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setDisclaimerVisible(true)} 
              style={styles.disclaimerButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Info size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {todayCheckIn && (
            <View style={styles.checkInSummaryCard}>
              <Text style={styles.checkInSummaryTitle}>{t.insights.checkInInsights}</Text>
              <View style={styles.checkInGrid}>
                <View style={styles.checkInItem}>
                  <Text style={styles.checkInLabel}>{t.checkIn.sleepQuestion}</Text>
                  <View style={styles.checkInValueRow}>
                    <Text style={styles.checkInValue}>
                      {todayCheckIn.sleep >= 7 ? t.common.yes : todayCheckIn.sleep >= 4 ? t.common.somewhat : t.common.no}
                    </Text>
                    {todayCheckIn.sleep >= 7 ? (
                      <Sparkles size={16} color="#F4C896" />
                    ) : todayCheckIn.sleep >= 4 ? (
                      <Minus size={16} color="#94A3B8" />
                    ) : (
                      <Moon size={16} color="#64748B" />
                    )}
                  </View>
                </View>
              </View>
              {!!todayCheckIn.bleedingLevel && todayCheckIn.bleedingLevel !== 'none' && (
                <View style={styles.checkInGrid}>
                  <View style={styles.checkInItem}>
                    <Text style={styles.checkInLabel}>{t.checkIn.bleeding}</Text>
                    <Text style={styles.checkInValue}>{todayCheckIn.bleedingLevel.charAt(0).toUpperCase() + todayCheckIn.bleedingLevel.slice(1)}</Text>
                  </View>
                </View>
              )}
              {(!!todayCheckIn.cervicalMucus || todayCheckIn.ovulationPain !== undefined) && (
                <View style={styles.checkInGrid}>
                  {!!todayCheckIn.cervicalMucus && (
                    <View style={styles.checkInItem}>
                      <Text style={styles.checkInLabel}>{t.insights.cervicalMucus}</Text>
                      <Text style={styles.checkInValue}>{todayCheckIn.cervicalMucus.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</Text>
                    </View>
                  )}
                  {todayCheckIn.ovulationPain !== undefined && (
                    <View style={styles.checkInItem}>
                      <Text style={styles.checkInLabel}>{t.insights.ovulationPain}</Text>
                      <Text style={styles.checkInValue}>{todayCheckIn.ovulationPain ? t.common.yes : t.common.no}</Text>
                    </View>
                  )}
                </View>
              )}
              {(todayCheckIn.hadCaffeine || todayCheckIn.hadAlcohol || todayCheckIn.isIll || todayCheckIn.hadSugar || todayCheckIn.hadProcessedFood) && (
                <View style={styles.lifestyleFactorsRow}>
                  <Text style={styles.lifestyleFactorsLabel}>{t.insights.lifestyle}: </Text>
                  {todayCheckIn.hadCaffeine && <View style={styles.factorTag}><Coffee size={12} color={colors.primary} /><Text style={styles.factorTagText}>{t.checkIn.hadCaffeine.replace('Had caffeine', 'Caffeine').replace('Drack koffein', 'Koffein').replace('Koffein getrunken', 'Koffein').replace('Caféine consommée', 'Caféine').replace('Consumió cafeína', 'Cafeína').replace('Caffeina assunta', 'Caffeina').replace('Cafeïne gebruikt', 'Cafeïne').replace('Spożyła kofeinę', 'Kofeina').replace('Consumiu cafeína', 'Cafeína')}</Text></View>}
                  {todayCheckIn.hadAlcohol && <View style={styles.factorTag}><Wine size={12} color={colors.primary} /><Text style={styles.factorTagText}>{t.checkIn.hadAlcohol.replace('Had alcohol', 'Alcohol').replace('Drack alkohol', 'Alkohol').replace('Alkohol getrunken', 'Alkohol').replace('Alcool consommé', 'Alcool').replace('Consumió alcohol', 'Alcohol').replace('Alcol assunto', 'Alcol').replace('Alcohol gebruikt', 'Alcohol').replace('Spożyła alkohol', 'Alkohol').replace('Consumiu álcool', 'Álcool')}</Text></View>}
                  {todayCheckIn.isIll && <View style={styles.factorTag}><Thermometer size={12} color={colors.primary} /><Text style={styles.factorTagText}>{t.insights.feelingIll}</Text></View>}
                  {todayCheckIn.hadSugar && <View style={styles.factorTag}><Text style={styles.factorTagText}>{t.insights.sugar}</Text></View>}
                  {todayCheckIn.hadProcessedFood && <View style={styles.factorTag}><Text style={styles.factorTagText}>{t.insights.processedFood}</Text></View>}
                </View>
              )}
              {todayCheckIn.symptoms.length > 0 && (
                <View style={styles.symptomsRow}>
                  <Text style={styles.symptomsLabel}>{t.programs.symptoms}: </Text>
                  <Text style={styles.symptomsText}>{translateSymptoms(todayCheckIn.symptoms, t.symptoms)}</Text>
                </View>
              )}
              {!!todayCheckIn.notes && todayCheckIn.notes.trim() !== '' && (
                <View style={styles.notesRow}>
                  <Text style={styles.notesLabel}>{t.insights.notes}: </Text>
                  <Text style={styles.notesText}>{todayCheckIn.notes}</Text>
                </View>
              )}
            </View>
          )}

          {latestScan && (
            <View style={styles.todayResultCard}>
              <Text style={styles.todayResultTitle}>{t.insights.scanMetrics}</Text>
              <View style={styles.todayScoresRow}>
                <View style={styles.todayScoreItem}>
                  <CircularProgress
                    size={70}
                    strokeWidth={4}
                    progress={(todaySummary.stressScore / 10) * 100}
                    progressColor={colors.stressHigh}
                    trackColor={colors.borderLight}
                    fillColor={colors.stressFill}
                  >
                    <Zap size={24} color={colors.stressHigh} />
                  </CircularProgress>
                  <View style={styles.metricLabelRow}>
                    <Text style={styles.todayScoreLabel}>{t.home.stress}</Text>
                    <TouchableOpacity onPress={() => showMarkerInfo('stress')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <Info size={14} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.todayScoreValue}>{todaySummary.stressScore}<Text style={styles.scoreMax}>/10</Text></Text>
                  <Text style={styles.todayAverage}>{t.insights.average}: {averages.stress}</Text>
                </View>
                <View style={styles.todayScoreItem}>
                  <CircularProgress
                    size={70}
                    strokeWidth={4}
                    progress={(todaySummary.energyScore / 10) * 100}
                    progressColor={colors.energyHigh}
                    trackColor={colors.borderLight}
                    fillColor={colors.energyFill}
                  >
                    <Battery size={24} color={colors.energyHigh} />
                  </CircularProgress>
                  <View style={styles.metricLabelRow}>
                    <Text style={styles.todayScoreLabel}>{t.home.energy}</Text>
                    <TouchableOpacity onPress={() => showMarkerInfo('energy')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <Info size={14} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.todayScoreValue}>{todaySummary.energyScore}<Text style={styles.scoreMax}>/10</Text></Text>
                  <Text style={styles.todayAverage}>{t.insights.average}: {averages.energy}</Text>
                </View>
                <View style={styles.todayScoreItem}>
                  <CircularProgress
                    size={70}
                    strokeWidth={4}
                    progress={(todaySummary.recoveryScore / 10) * 100}
                    progressColor={colors.recoveryHigh}
                    trackColor={colors.borderLight}
                    fillColor={colors.recoveryFill}
                  >
                    <Heart size={24} color={colors.recoveryHigh} />
                  </CircularProgress>
                  <View style={styles.metricLabelRow}>
                    <Text style={styles.todayScoreLabel}>{t.home.recovery}</Text>
                    <TouchableOpacity onPress={() => showMarkerInfo('recovery')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <Info size={14} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.todayScoreValue}>{todaySummary.recoveryScore}<Text style={styles.scoreMax}>/10</Text></Text>
                  <Text style={styles.todayAverage}>{t.insights.average}: {averages.recovery}</Text>
                </View>
              </View>
            </View>
          )}

          {checkInInsights.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.insights.yourInsightsToday}</Text>
              <Text style={styles.sectionSubtitle}>{t.insights.howChoicesConnect}</Text>
              {checkInInsights.map((insight, index) => {
                const IconComponent = insight.icon;
                return (
                  <View key={index} style={styles.contextInsightCard}>
                    <View style={[styles.contextInsightIcon, { backgroundColor: insight.color + "20" }]}>
                      <IconComponent size={20} color={insight.color} />
                    </View>
                    <View style={styles.contextInsightContent}>
                      <Text style={styles.contextInsightTitle}>{insight.title}</Text>
                      <Text style={styles.contextInsightMessage}>{insight.message}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {(userProfile.lifeStage === 'perimenopause' || userProfile.lifeStage === 'menopause') && (() => {
            const vmsMetrics = calculateVasomotorMetrics(checkIns, t);
            return vmsMetrics ? (
              <View style={styles.vasomotorCard}>
                <View style={styles.vasomotorHeader}>
                  <Flame size={24} color={colors.phaseMenstrual} />
                  <Text style={styles.vasomotorTitle}>{t.menopause?.vasomotorSymptoms || 'Vasomotor Symptoms'}</Text>
                </View>

                <View style={styles.vasomotorMetric}>
                  <Text style={styles.vasomotorMetricLabel}>{t.menopause?.hotFlashTrend || 'Hot Flash Trend'}</Text>
                  <Text style={styles.vasomotorMetricValue}>
                    {vmsMetrics.trend === 'increasing' ? t.menopause?.increasing || 'Increasing' : vmsMetrics.trend === 'decreasing' ? t.menopause?.decreasing || 'Decreasing' : t.menopause?.stable || 'Stable'}
                  </Text>
                  <Text style={styles.vasomotorMetricSubtext}>{t.insights.avgPerDay.replace('{0}', vmsMetrics.avgHotFlashes)}</Text>
                </View>

                <View style={styles.vasomotorMetric}>
                  <Text style={styles.vasomotorMetricLabel}>{t.menopause?.nightSweatFrequency || 'Night Sweats'}</Text>
                  <Text style={styles.vasomotorMetricValue}>{vmsMetrics.nightSweatDays} {t.insights.ofSevenDays}</Text>
                </View>

                <View style={[styles.vasomotorMetric, { borderBottomWidth: 0 }]}>
                  <Text style={styles.vasomotorMetricLabel}>{t.menopause?.vmsScore || 'VMS Score'}</Text>
                  <Text style={[styles.vasomotorMetricValue, { color: parseFloat(vmsMetrics.vmsScore) > 5 ? colors.error : colors.success }]}>
                    {vmsMetrics.vmsScore}
                  </Text>
                  <Text style={styles.vasomotorMetricSubtext}>{t.insights.symptomSeverityIndicator}</Text>
                </View>
              </View>
            ) : null;
          })()}

          <View style={styles.phaseCard}>
            <Text style={styles.phaseTitle}>{isNonCycleLifeStage ? (lifeStageOverride === 'pregnancy' ? t.onboarding.pregnant : lifeStageOverride === 'postpartum' ? t.phases.postpartumRecovery : lifeStageOverride === 'perimenopause' ? t.phases.perimenopauseTransition : t.phases.menopause) : t.insights.currentCyclePhase}</Text>
            <Text style={styles.phaseValue}>{phaseGuidance.phaseName}</Text>
            <Text style={styles.phaseDescription}>
              {phaseGuidance.description}
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.guidanceCard}
            onPress={() => setPhaseGuidanceExpanded(!phaseGuidanceExpanded)}
            activeOpacity={0.7}
          >
            <View style={styles.guidanceHeader}>
              <View style={[styles.guidanceIconBox, { backgroundColor: phaseGuidance.color + "20" }]}>
                {React.createElement(phaseGuidance.icon, { size: 24, color: phaseGuidance.color })}
              </View>
              <Text style={styles.guidanceTitle}>{t.insights.whatToExpect} {phaseGuidance.phaseName}</Text>
              {phaseGuidanceExpanded ? (
                <ChevronUp size={20} color={colors.textSecondary} />
              ) : (
                <ChevronDown size={20} color={colors.textSecondary} />
              )}
            </View>
            {phaseGuidanceExpanded && (
              <>
                <View style={styles.guidanceSection}>
                  <View style={styles.guidanceSectionHeader}>
                    <Info size={16} color={colors.primary} />
                    <Text style={styles.guidanceSectionTitle}>{t.insights.thisIsNormal}</Text>
                  </View>
                  {phaseGuidance.whatToExpect.map((item, index) => (
                    <View key={index} style={styles.guidanceItem}>
                      <View style={styles.guidanceBullet} />
                      <Text style={styles.guidanceText}>{item}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.guidanceSection}>
                  <View style={styles.guidanceSectionHeader}>
                    <Lightbulb size={16} color={colors.success} />
                    <Text style={[styles.guidanceSectionTitle, { color: colors.success }]}>{t.insights.howToOptimize}</Text>
                  </View>
                  {phaseGuidance.howToImprove.map((item, index) => (
                    <View key={index} style={styles.guidanceItem}>
                      <View style={[styles.guidanceBullet, { backgroundColor: colors.success }]} />
                      <Text style={styles.guidanceText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </TouchableOpacity>

          {trendData && trendData.length >= 2 && (
            <View style={styles.trendsSection}>
              <View style={styles.trendsSectionHeader}>
                <View style={styles.trendsTitleRow}>
                  <TrendingUp size={20} color={colors.primary} />
                  <Text style={styles.trendsSectionTitle}>{t.insights.chartTrends}</Text>
                </View>
                <View style={styles.timeRangeSelector}>
                  {[7, 30, 90].map((days) => (
                    <TouchableOpacity
                      key={days}
                      onPress={() => setTrendTimeRange(days as 7 | 30 | 90)}
                      style={[
                        styles.timeRangeButton,
                        trendTimeRange === days && styles.timeRangeButtonActive
                      ]}
                    >
                      <Text style={[
                        styles.timeRangeButtonText,
                        trendTimeRange === days && styles.timeRangeButtonTextActive
                      ]}>
                        {days}d
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>{t.insights.chartPhysicalScores}</Text>
                {trendNarratives?.physical && (
                  <Text style={styles.trendNarrative}>{trendNarratives.physical}</Text>
                )}
                <LineChart
                  data={physicalChartData!}
                  width={chartWidth}
                  height={200}
                  chartConfig={{
                    backgroundGradientFrom: colors.card,
                    backgroundGradientTo: colors.card,
                    color: hexToChartColor(colors.border),
                    strokeWidth: 2,
                    barPercentage: 0.5,
                    useShadowColorFromDataset: false,
                    decimalPlaces: 0,
                    propsForLabels: {
                      fontSize: 10,
                      fill: colors.textSecondary,
                    }
                  }}
                  style={styles.chart}
                  withVerticalLines={false}
                  withHorizontalLines={true}
                  withOuterLines={true}
                  bezier
                  segments={4}
                />
                <View style={styles.chartLegend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.phaseMenstrual }]} />
                    <Text style={styles.legendLabel}>{t.home.stress}</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.phaseFollicular }]} />
                    <Text style={styles.legendLabel}>{t.home.energy}</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.phaseLuteal }]} />
                    <Text style={styles.legendLabel}>{t.home.recovery}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>{t.insights.chartHydrationInflammation}</Text>
                {trendNarratives?.hydrationInflammation && (
                  <Text style={styles.trendNarrative}>{trendNarratives.hydrationInflammation}</Text>
                )}
                <LineChart
                  data={hydrationInflammationChartData!}
                  width={chartWidth}
                  height={200}
                  chartConfig={{
                    backgroundGradientFrom: colors.card,
                    backgroundGradientTo: colors.card,
                    color: hexToChartColor(colors.border),
                    strokeWidth: 2,
                    barPercentage: 0.5,
                    useShadowColorFromDataset: false,
                    decimalPlaces: 0,
                    propsForLabels: {
                      fontSize: 10,
                      fill: colors.textSecondary,
                    }
                  }}
                  style={styles.chart}
                  withVerticalLines={false}
                  withHorizontalLines={true}
                  withOuterLines={true}
                  bezier
                  segments={4}
                />
                <View style={styles.chartLegend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.habitHydration }]} />
                    <Text style={styles.legendLabel}>{t.habits?.hydration ?? t.insights.dehydrationTendency}</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.habitMovement }]} />
                    <Text style={styles.legendLabel}>{t.insights.inflammation}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>{t.insights.chartFatigue}</Text>
                {trendNarratives?.fatigue && (
                  <Text style={styles.trendNarrative}>{trendNarratives.fatigue}</Text>
                )}
                <LineChart
                  data={fatigueChartData!}
                  width={chartWidth}
                  height={200}
                  chartConfig={{
                    backgroundGradientFrom: colors.card,
                    backgroundGradientTo: colors.card,
                    color: hexToChartColor(colors.border),
                    strokeWidth: 2,
                    barPercentage: 0.5,
                    useShadowColorFromDataset: false,
                    decimalPlaces: 0,
                    propsForLabels: {
                      fontSize: 10,
                      fill: colors.textSecondary,
                    }
                  }}
                  style={styles.chart}
                  withVerticalLines={false}
                  withHorizontalLines={true}
                  withOuterLines={true}
                  bezier
                  segments={4}
                />
                <View style={styles.chartLegend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.habitRecovery }]} />
                    <Text style={styles.legendLabel}>{t.insights.fatigue}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {scans.length > 0 && !trendData && (
            <View style={styles.emptyStateCard}>
              <TrendingUp size={40} color={colors.primary} />
              <Text style={styles.emptyStateTitle}>{t.insights.keepScanningTitle}</Text>
              <Text style={styles.emptyStateText}>{t.insights.keepScanningText}</Text>
            </View>
          )}

          {scans.length > 0 && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t.insights.physicalMarkers}</Text>
                <Text style={styles.sectionSubtitle}>{t.insights.todayVsAverage}</Text>
                
                <View style={styles.detailCard}>
                  <View style={[styles.detailIcon, { backgroundColor: "#A4C8E8" + "20" }]}>
                    <Droplets size={20} color="#A4C8E8" />
                  </View>
                  <View style={styles.detailContent}>
                    <View style={styles.detailTextContent}>
                      <View style={styles.detailLabelRow}>
                        <Text style={styles.detailLabel}>{t.habits.hydration} {t.insights.level}</Text>
                        <TouchableOpacity onPress={() => showMarkerInfo('hydration')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                          <Info size={12} color={colors.textSecondary} />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.detailDescription}>{t.insights.tearFilmAnalysis}</Text>
                    </View>
                    <View style={styles.detailValues}>
                      <Text style={styles.detailValue}>{latestScan?.hydrationLevel || 0}/10</Text>
                      <Text style={styles.detailAvgValue}>{t.insights.average}: {averages.hydration}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getMetricStatus(latestScan?.hydrationLevel || 0, true, t, colors).bgColor }]}>
                        <Text style={[styles.statusBadgeText, { color: getMetricStatus(latestScan?.hydrationLevel || 0, true, t, colors).color }]}>
                          {getMetricStatus(latestScan?.hydrationLevel || 0, true, t, colors).label}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.miniProgressBar}>
                    <View style={[styles.miniProgressFill, { width: `${((latestScan?.hydrationLevel || 0) / 10) * 100}%`, backgroundColor: "#A4C8E8" }]} />
                  </View>
                </View>

                <View style={styles.detailCard}>
                  <View style={[styles.detailIcon, { backgroundColor: "#E89BA4" + "20" }]}>
                    <AlertCircle size={20} color="#E89BA4" />
                  </View>
                  <View style={styles.detailContent}>
                    <View style={styles.detailTextContent}>
                      <View style={styles.detailLabelRow}>
                        <Text style={styles.detailLabel}>{t.insights.inflammation}</Text>
                        <TouchableOpacity onPress={() => showMarkerInfo('inflammation')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                          <Info size={12} color={colors.textSecondary} />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.detailDescription}>{t.insights.vascularPatterns}</Text>
                    </View>
                    <View style={styles.detailValues}>
                      <Text style={styles.detailValue}>{latestScan?.inflammation || 0}/10</Text>
                      <Text style={styles.detailAvgValue}>{t.insights.average}: {averages.inflammation}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getMetricStatus(latestScan?.inflammation || 0, false, t, colors).bgColor }]}>
                        <Text style={[styles.statusBadgeText, { color: getMetricStatus(latestScan?.inflammation || 0, false, t, colors).color }]}>
                          {getMetricStatus(latestScan?.inflammation || 0, false, t, colors).label}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.miniProgressBar}>
                    <View style={[styles.miniProgressFill, { width: `${((latestScan?.inflammation || 0) / 10) * 100}%`, backgroundColor: "#E89BA4" }]} />
                  </View>
                </View>

                <View style={styles.detailCard}>
                  <View style={[styles.detailIcon, { backgroundColor: "#F4C896" + "20" }]}>
                    <Moon size={20} color="#F4C896" />
                  </View>
                  <View style={styles.detailContent}>
                    <View style={styles.detailTextContent}>
                      <View style={styles.detailLabelRow}>
                        <Text style={styles.detailLabel}>{t.insights.fatigue}</Text>
                        <TouchableOpacity onPress={() => showMarkerInfo('fatigue')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                          <Info size={12} color={colors.textSecondary} />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.detailDescription}>{t.insights.pupilResponse}</Text>
                    </View>
                    <View style={styles.detailValues}>
                      <Text style={styles.detailValue}>{latestScan?.fatigueLevel || 0}/10</Text>
                      <Text style={styles.detailAvgValue}>{t.insights.average}: {averages.fatigue}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getMetricStatus(latestScan?.fatigueLevel || 0, false, t, colors).bgColor }]}>
                        <Text style={[styles.statusBadgeText, { color: getMetricStatus(latestScan?.fatigueLevel || 0, false, t, colors).color }]}>
                          {getMetricStatus(latestScan?.fatigueLevel || 0, false, t, colors).label}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.miniProgressBar}>
                    <View style={[styles.miniProgressFill, { width: `${((latestScan?.fatigueLevel || 0) / 10) * 100}%`, backgroundColor: "#F4C896" }]} />
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t.insights.mentalEmotionalState}</Text>
                <Text style={styles.sectionSubtitle}>{t.insights.todayVsAverage}</Text>
                
                <View style={styles.detailCard}>
                  <View style={[styles.detailIcon, { backgroundColor: "#96E8D4" + "20" }]}>
                    <Brain size={20} color="#96E8D4" />
                  </View>
                  <View style={styles.detailContent}>
                    <View style={styles.detailTextContent}>
                      <View style={styles.detailLabelRow}>
                        <Text style={styles.detailLabel}>{t.insights.cognitiveSharpness}</Text>
                        <TouchableOpacity onPress={() => showMarkerInfo('cognitiveSharpness')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                          <Info size={12} color={colors.textSecondary} />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.detailDescription}>{t.insights.focusClarity}</Text>
                    </View>
                    <View style={styles.detailValues}>
                      <Text style={styles.detailValue}>{latestScan?.emotionalMentalState?.cognitiveSharpness.toFixed(1) || 0}/10</Text>
                      <Text style={styles.detailAvgValue}>{t.insights.average}: {averages.cognitiveSharpness}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getMetricStatus(latestScan?.emotionalMentalState?.cognitiveSharpness || 0, true, t, colors).bgColor }]}>
                        <Text style={[styles.statusBadgeText, { color: getMetricStatus(latestScan?.emotionalMentalState?.cognitiveSharpness || 0, true, t, colors).color }]}>
                          {getMetricStatus(latestScan?.emotionalMentalState?.cognitiveSharpness || 0, true, t, colors).label}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.miniProgressBar}>
                    <View style={[styles.miniProgressFill, { width: `${((latestScan?.emotionalMentalState?.cognitiveSharpness || 0) / 10) * 100}%`, backgroundColor: "#96E8D4" }]} />
                  </View>
                </View>

                <View style={styles.detailCard}>
                  <View style={[styles.detailIcon, { backgroundColor: "#F4C8D4" + "20" }]}>
                    <Heart size={20} color="#F4C8D4" />
                  </View>
                  <View style={styles.detailContent}>
                    <View style={styles.detailTextContent}>
                      <View style={styles.detailLabelRow}>
                        <Text style={styles.detailLabel}>{t.insights.emotionalSensitivity}</Text>
                        <TouchableOpacity onPress={() => showMarkerInfo('emotionalSensitivity')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                          <Info size={12} color={colors.textSecondary} />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.detailDescription}>{t.insights.stressResponse}</Text>
                    </View>
                    <View style={styles.detailValues}>
                      <Text style={styles.detailValue}>{latestScan?.emotionalMentalState?.emotionalSensitivity.toFixed(1) || 0}/10</Text>
                      <Text style={styles.detailAvgValue}>{t.insights.average}: {averages.emotionalSensitivity}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getMetricStatus(latestScan?.emotionalMentalState?.emotionalSensitivity || 0, false, t, colors).bgColor }]}>
                        <Text style={[styles.statusBadgeText, { color: getMetricStatus(latestScan?.emotionalMentalState?.emotionalSensitivity || 0, false, t, colors).color }]}>
                          {getMetricStatus(latestScan?.emotionalMentalState?.emotionalSensitivity || 0, false, t, colors).label}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.miniProgressBar}>
                    <View style={[styles.miniProgressFill, { width: `${((latestScan?.emotionalMentalState?.emotionalSensitivity || 0) / 10) * 100}%`, backgroundColor: "#F4C8D4" }]} />
                  </View>
                </View>

                <View style={styles.detailCard}>
                  <View style={[styles.detailIcon, { backgroundColor: "#E8B4D4" + "20" }]}>
                    <Users size={20} color="#E8B4D4" />
                  </View>
                  <View style={styles.detailContent}>
                    <View style={styles.detailTextContent}>
                      <View style={styles.detailLabelRow}>
                        <Text style={styles.detailLabel}>{t.insights.socialEnergy}</Text>
                        <TouchableOpacity onPress={() => showMarkerInfo('socialEnergy')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                          <Info size={12} color={colors.textSecondary} />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.detailDescription}>{t.insights.connectionReadiness}</Text>
                    </View>
                    <View style={styles.detailValues}>
                      <Text style={styles.detailValue}>{latestScan?.emotionalMentalState?.socialEnergy.toFixed(1) || 0}/10</Text>
                      <Text style={styles.detailAvgValue}>{t.insights.average}: {averages.socialEnergy}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getMetricStatus(latestScan?.emotionalMentalState?.socialEnergy || 0, true, t, colors).bgColor }]}>
                        <Text style={[styles.statusBadgeText, { color: getMetricStatus(latestScan?.emotionalMentalState?.socialEnergy || 0, true, t, colors).color }]}>
                          {getMetricStatus(latestScan?.emotionalMentalState?.socialEnergy || 0, true, t, colors).label}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.miniProgressBar}>
                    <View style={[styles.miniProgressFill, { width: `${((latestScan?.emotionalMentalState?.socialEnergy || 0) / 10) * 100}%`, backgroundColor: "#E8B4D4" }]} />
                  </View>
                </View>

                <View style={styles.detailCard}>
                  <View style={[styles.detailIcon, { backgroundColor: "#F4B896" + "20" }]}>
                    <BarChart3 size={20} color="#F4B896" />
                  </View>
                  <View style={styles.detailContent}>
                    <View style={styles.detailTextContent}>
                      <View style={styles.detailLabelRow}>
                        <Text style={styles.detailLabel}>{t.insights.moodVolatilityRisk}</Text>
                        <TouchableOpacity onPress={() => showMarkerInfo('moodVolatility')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                          <Info size={12} color={colors.textSecondary} />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.detailDescription}>{t.insights.emotionalStability}</Text>
                    </View>
                    <View style={styles.detailValues}>
                      <Text style={styles.detailValue}>{latestScan?.emotionalMentalState?.moodVolatilityRisk.toFixed(1) || 0}/10</Text>
                      <Text style={styles.detailAvgValue}>{t.insights.average}: {averages.moodVolatility}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getMetricStatus(latestScan?.emotionalMentalState?.moodVolatilityRisk || 0, false, t, colors).bgColor }]}>
                        <Text style={[styles.statusBadgeText, { color: getMetricStatus(latestScan?.emotionalMentalState?.moodVolatilityRisk || 0, false, t, colors).color }]}>
                          {getMetricStatus(latestScan?.emotionalMentalState?.moodVolatilityRisk || 0, false, t, colors).label}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.miniProgressBar}>
                    <View style={[styles.miniProgressFill, { width: `${((latestScan?.emotionalMentalState?.moodVolatilityRisk || 0) / 10) * 100}%`, backgroundColor: "#F4B896" }]} />
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t.insights.physiologicalInsights}</Text>
                <Text style={styles.sectionSubtitle}>{t.insights.todayVsAverage}</Text>
                
                <View style={styles.detailCard}>
                  <View style={[styles.detailIcon, { backgroundColor: "#B4E4F4" + "20" }]}>
                    <Droplets size={20} color="#B4E4F4" />
                  </View>
                  <View style={styles.detailContent}>
                    <View style={styles.detailTextContent}>
                      <View style={styles.detailLabelRow}>
                        <Text style={styles.detailLabel}>{t.insights.dehydrationTendency}</Text>
                        <TouchableOpacity onPress={() => showMarkerInfo('dehydrationTendency')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                          <Info size={12} color={colors.textSecondary} />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.detailDescription}>{t.insights.fluidBalanceIndicator}</Text>
                    </View>
                    <View style={styles.detailValues}>
                      <Text style={styles.detailValue}>{latestScan?.physiologicalStates?.dehydrationTendency.toFixed(1) || 0}/10</Text>
                      <Text style={styles.detailAvgValue}>{t.insights.average}: {averages.dehydrationTendency}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getMetricStatus(latestScan?.physiologicalStates?.dehydrationTendency || 0, false, t, colors).bgColor }]}>
                        <Text style={[styles.statusBadgeText, { color: getMetricStatus(latestScan?.physiologicalStates?.dehydrationTendency || 0, false, t, colors).color }]}>
                          {getMetricStatus(latestScan?.physiologicalStates?.dehydrationTendency || 0, false, t, colors).label}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.miniProgressBar}>
                    <View style={[styles.miniProgressFill, { width: `${((latestScan?.physiologicalStates?.dehydrationTendency || 0) / 10) * 100}%`, backgroundColor: "#B4E4F4" }]} />
                  </View>
                </View>

                <View style={styles.detailCard}>
                  <View style={[styles.detailIcon, { backgroundColor: "#F4D4A4" + "20" }]}>
                    <Flame size={20} color="#F4D4A4" />
                  </View>
                  <View style={styles.detailContent}>
                    <View style={styles.detailTextContent}>
                      <View style={styles.detailLabelRow}>
                        <Text style={styles.detailLabel}>{t.insights.inflammatoryStress}</Text>
                        <TouchableOpacity onPress={() => showMarkerInfo('inflammatoryStress')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                          <Info size={12} color={colors.textSecondary} />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.detailDescription}>{t.insights.systemicInflammation}</Text>
                    </View>
                    <View style={styles.detailValues}>
                      <Text style={styles.detailValue}>{latestScan?.physiologicalStates?.inflammatoryStress.toFixed(1) || 0}/10</Text>
                      <Text style={styles.detailAvgValue}>{t.insights.average}: {averages.inflammatoryStress}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getMetricStatus(latestScan?.physiologicalStates?.inflammatoryStress || 0, false, t, colors).bgColor }]}>
                        <Text style={[styles.statusBadgeText, { color: getMetricStatus(latestScan?.physiologicalStates?.inflammatoryStress || 0, false, t, colors).color }]}>
                          {getMetricStatus(latestScan?.physiologicalStates?.inflammatoryStress || 0, false, t, colors).label}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.miniProgressBar}>
                    <View style={[styles.miniProgressFill, { width: `${((latestScan?.physiologicalStates?.inflammatoryStress || 0) / 10) * 100}%`, backgroundColor: "#F4D4A4" }]} />
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t.insights.rawEyeMetrics}</Text>
                <Text style={styles.sectionSubtitle}>{t.insights.todayVsAverage}</Text>
                <Text style={styles.estimateDisclaimer}>{t.scan.disclaimer}</Text>
                
                <View style={styles.opticalStatsGrid}>
                  <TouchableOpacity style={styles.opticalStatsItem} onPress={() => showMarkerInfo('pupilSize')} activeOpacity={0.7}>
                    <View style={[styles.opticalStatsIcon, { backgroundColor: colors.primaryLight }]}>
                      <Heart size={18} color={colors.primary} />
                    </View>
                    <View style={styles.opticalLabelRow}>
                      <Text style={styles.opticalStatsLabel}>{t.insights.pupilSize}</Text>
                      <Info size={10} color={colors.textSecondary} />
                    </View>
                    <Text style={styles.opticalStatsValue}>{latestScan?.rawOpticalSignals?.pupilDiameter.toFixed(1) || 0}/10</Text>
                    <Text style={styles.opticalStatsAvg}>{t.insights.average}: {averages.pupilDiameter}/10</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.opticalStatsItem} onPress={() => showMarkerInfo('symmetry')} activeOpacity={0.7}>
                    <View style={[styles.opticalStatsIcon, { backgroundColor: colors.primaryLight }]}>
                      <TrendingUp size={18} color={colors.primary} />
                    </View>
                    <View style={styles.opticalLabelRow}>
                      <Text style={styles.opticalStatsLabel}>{t.insights.symmetry}</Text>
                      <Info size={10} color={colors.textSecondary} />
                    </View>
                    <Text style={styles.opticalStatsValue}>{((latestScan?.rawOpticalSignals?.pupilSymmetry || 0) * 100).toFixed(0)}%</Text>
                    <Text style={styles.opticalStatsAvg}>{t.insights.average}: {(Number(averages.pupilSymmetry) * 100).toFixed(0)}%</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.opticalStatsItem} onPress={() => showMarkerInfo('scleraYellowness')} activeOpacity={0.7}>
                    <View style={[styles.opticalStatsIcon, { backgroundColor: '#FEF3C720' }]}>
                      <Eye size={18} color="#F59E0B" />
                    </View>
                    <View style={styles.opticalLabelRow}>
                      <Text style={styles.opticalStatsLabel}>{t.insights.scleraClarity ?? 'Sclera Clarity'}</Text>
                      <Info size={10} color={colors.textSecondary} />
                    </View>
                    <Text style={styles.opticalStatsValue}>{((1 - (latestScan?.rawOpticalSignals?.scleraBrightness ? latestScan.rawOpticalSignals.scleraBrightness / 255 : 0.5)) * 10).toFixed(1)}/10</Text>
                    <Text style={styles.opticalStatsAvg}>{t.insights.average}: {averages.scleraYellowness}/10</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.opticalStatsItem} onPress={() => showMarkerInfo('underEyeDarkness')} activeOpacity={0.7}>
                    <View style={[styles.opticalStatsIcon, { backgroundColor: '#F4C89620' }]}>
                      <Moon size={18} color="#F4C896" />
                    </View>
                    <View style={styles.opticalLabelRow}>
                      <Text style={styles.opticalStatsLabel}>{t.insights.underEyeVitality ?? 'Under-Eye Vitality'}</Text>
                      <Info size={10} color={colors.textSecondary} />
                    </View>
                    <Text style={styles.opticalStatsValue}>{((latestScan?.physiologicalStates?.sleepDebtLikelihood || 0.3) * 10).toFixed(1)}/10</Text>
                    <Text style={styles.opticalStatsAvg}>{t.insights.average}: {averages.underEyeDarkness}/10</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.opticalStatsItem} onPress={() => showMarkerInfo('eyeOpenness')} activeOpacity={0.7}>
                    <View style={[styles.opticalStatsIcon, { backgroundColor: '#10B98120' }]}>
                      <Zap size={18} color="#10B981" />
                    </View>
                    <View style={styles.opticalLabelRow}>
                      <Text style={styles.opticalStatsLabel}>{t.insights.eyeAlertness ?? 'Eye Alertness'}</Text>
                      <Info size={10} color={colors.textSecondary} />
                    </View>
                    <Text style={styles.opticalStatsValue}>{((latestScan?.physiologicalStates?.calmVsAlert || 0.5) * 10).toFixed(1)}/10</Text>
                    <Text style={styles.opticalStatsAvg}>{t.insights.average}: {averages.eyeOpenness}/10</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.opticalStatsItem} onPress={() => showMarkerInfo('tearFilmQuality')} activeOpacity={0.7}>
                    <View style={[styles.opticalStatsIcon, { backgroundColor: '#A4C8E820' }]}>
                      <Droplets size={18} color="#A4C8E8" />
                    </View>
                    <View style={styles.opticalLabelRow}>
                      <Text style={styles.opticalStatsLabel}>{t.insights.eyeMoisture ?? 'Eye Moisture'}</Text>
                      <Info size={10} color={colors.textSecondary} />
                    </View>
                    <Text style={styles.opticalStatsValue}>{((latestScan?.rawOpticalSignals?.tearFilmReflectivity || 0.5) * 10).toFixed(1)}/10</Text>
                    <Text style={styles.opticalStatsAvg}>{t.insights.average}: {averages.tearFilmQuality}/10</Text>
                  </TouchableOpacity>
                </View>
              </View>


            </>
          )}

          {patternAnalysis && (patternAnalysis.pregnancyDetected >= 3 || patternAnalysis.periDetected >= 3) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pattern Detection</Text>
              <Text style={styles.sectionSubtitle}>Based on {patternAnalysis.dataPoints} data points from the last 14 days</Text>

              {patternAnalysis.pregnancyDetected >= 3 && (
                <View style={styles.patternCard}>
                  <View style={styles.patternHeader}>
                    <View style={[styles.patternIconBox, { backgroundColor: '#F4C8D420' }]}>
                      <Baby size={22} color="#E89BA4" />
                    </View>
                    <View style={styles.patternHeaderText}>
                      <Text style={styles.patternTitle}>Pregnancy Indicators</Text>
                      <Text style={styles.patternCount}>{patternAnalysis.pregnancyDetected}/{patternAnalysis.pregnancyTotal} patterns noted</Text>
                    </View>
                    {patternAnalysis.hasAcceptedPregnancy ? (
                      <View style={styles.acceptedBadge}>
                        <CheckCircle size={14} color="#10B981" />
                        <Text style={styles.acceptedBadgeText}>Active</Text>
                      </View>
                    ) : lifeStageSuggestion?.type === 'pregnancy' ? (
                      <View style={styles.pendingBadge}>
                        <AlertCircle size={14} color="#F59E0B" />
                        <Text style={styles.pendingBadgeText}>Review</Text>
                      </View>
                    ) : null}
                  </View>
                  <View style={styles.indicatorsList}>
                    {patternAnalysis.pregnancyIndicators.map((ind, idx) => (
                      <View key={idx} style={styles.indicatorRow}>
                        {ind.detected ? (
                          <CheckCircle size={14} color="#10B981" />
                        ) : (
                          <XCircle size={14} color={colors.textTertiary} />
                        )}
                        <Text style={[styles.indicatorLabel, !ind.detected && styles.indicatorLabelInactive]}>{ind.label}</Text>
                      </View>
                    ))}
                  </View>
                  {!patternAnalysis.hasAcceptedPregnancy && (
                    <TouchableOpacity
                      style={styles.patternActionButton}
                      onPress={() => router.push('/profile' as any)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.patternActionText}>Update Life Stage</Text>
                      <ArrowRight size={14} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                  {patternAnalysis.hasAcceptedPregnancy && (
                    <View style={styles.patternStatusRow}>
                      <Shield size={14} color="#10B981" />
                      <Text style={styles.patternStatusText}>Life stage set to Pregnancy — insights are tailored</Text>
                    </View>
                  )}
                </View>
              )}

              {patternAnalysis.periDetected >= 3 && (
                <View style={styles.patternCard}>
                  <View style={styles.patternHeader}>
                    <View style={[styles.patternIconBox, { backgroundColor: '#B8A4E820' }]}>
                      <Thermometer size={22} color="#B8A4E8" />
                    </View>
                    <View style={styles.patternHeaderText}>
                      <Text style={styles.patternTitle}>Perimenopause Indicators</Text>
                      <Text style={styles.patternCount}>{patternAnalysis.periDetected}/{patternAnalysis.periTotal} patterns noted</Text>
                    </View>
                    {patternAnalysis.hasAcceptedPeri ? (
                      <View style={styles.acceptedBadge}>
                        <CheckCircle size={14} color="#10B981" />
                        <Text style={styles.acceptedBadgeText}>Active</Text>
                      </View>
                    ) : lifeStageSuggestion?.type === 'perimenopause' ? (
                      <View style={styles.pendingBadge}>
                        <AlertCircle size={14} color="#F59E0B" />
                        <Text style={styles.pendingBadgeText}>Review</Text>
                      </View>
                    ) : null}
                  </View>
                  <View style={styles.indicatorsList}>
                    {patternAnalysis.periIndicators.map((ind, idx) => (
                      <View key={idx} style={styles.indicatorRow}>
                        {ind.detected ? (
                          <CheckCircle size={14} color="#10B981" />
                        ) : (
                          <XCircle size={14} color={colors.textTertiary} />
                        )}
                        <Text style={[styles.indicatorLabel, !ind.detected && styles.indicatorLabelInactive]}>{ind.label}</Text>
                      </View>
                    ))}
                  </View>
                  {!patternAnalysis.hasAcceptedPeri && (
                    <TouchableOpacity
                      style={[styles.patternActionButton, { backgroundColor: '#B8A4E8' }]}
                      onPress={() => router.push('/profile' as any)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.patternActionText}>Update Life Stage</Text>
                      <ArrowRight size={14} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                  {patternAnalysis.hasAcceptedPeri && (
                    <View style={styles.patternStatusRow}>
                      <Shield size={14} color="#10B981" />
                      <Text style={styles.patternStatusText}>Life stage set to {userProfile.lifeStage === 'menopause' ? 'Menopause' : 'Perimenopause'} — insights are tailored</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.insights.scanHistory}</Text>
            <View style={styles.historyCard}>
              <Eye size={32} color={colors.primary} style={{ marginBottom: 8 }} />
              <Text style={styles.historyValue}>{scans.length}</Text>
              <Text style={styles.historyLabel}>{t.insights.totalScans}</Text>
            </View>
            {scans.length === 0 && (
              <Text style={styles.emptyText}>
                {t.insights.startFirstScan}
              </Text>
            )}
          </View>
        </ScrollView>

        <Modal
          visible={infoModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setInfoModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <Pressable style={styles.modalOverlayDismiss} onPress={() => setInfoModalVisible(false)} />
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{markerInfo?.title}</Text>
                <TouchableOpacity onPress={() => setInfoModalVisible(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              {markerInfo && (
                <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false} bounces={false} nestedScrollEnabled={true}>
                  <View style={styles.modalSection}>
                    <View style={styles.modalSectionHeader}>
                      <Info size={16} color={colors.primary} />
                      <Text style={styles.modalSectionTitle}>{t.insights.inYourPhase} {phaseGuidance.phaseName} {!isNonCycleLifeStage && t.insights.inYourPhase.includes('Phase') ? '' : ''}</Text>
                    </View>
                    <Text style={styles.modalPhaseContext}>{markerInfo.phaseContext}</Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>{t.insights.whatWeMeasure}</Text>
                    <Text style={styles.modalText}>{markerInfo.whatWeMeasure}</Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>{t.insights.whatAffectsThisScore}</Text>
                    {markerInfo.hasActiveFactors && (
                      <View style={styles.activeFactorsLabel}>
                        <AlertCircle size={14} color={colors.primary} />
                        <Text style={styles.activeFactorsLabelText}>{t.insights.basedOnCheckIn}</Text>
                      </View>
                    )}
                    {markerInfo.whatAffects.map((item, index) => (
                      <View key={index} style={[
                        styles.modalListItem,
                        item.isActiveToday && styles.modalListItemActive,
                      ]}>
                        <View style={[
                          styles.modalBullet,
                          item.isActiveToday && styles.modalBulletActive,
                        ]} />
                        <Text style={[
                          styles.modalListText,
                          item.isActiveToday && styles.modalListTextActive,
                        ]}>{item.text}{item.isActiveToday ? ' ⬅ ' + t.insights.today2 : ''}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.modalSection}>
                    <View style={styles.modalSectionHeader}>
                      <Lightbulb size={16} color={colors.success} />
                      <Text style={[styles.modalSectionTitle, { color: colors.success }]}>{t.insights.howToImprove}</Text>
                    </View>
                    {markerInfo.howToImprove.map((item, index) => (
                      <View key={index} style={styles.modalListItem}>
                        <View style={[styles.modalBullet, { backgroundColor: colors.success }]} />
                        <Text style={styles.modalListText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>

        <Modal
          visible={disclaimerVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setDisclaimerVisible(false)}
        >
          <View style={styles.disclaimerOverlay}>
            <View style={styles.disclaimerContent}>
              <View style={styles.disclaimerHeader}>
                <View style={styles.disclaimerIconCircle}>
                  <Info size={28} color={colors.primary} />
                </View>
              </View>
              <Text style={styles.disclaimerTitle}>{t.insights.importantDisclaimer}</Text>
              <Text style={styles.disclaimerText}>
                {t.insights.disclaimerText1}
                {"\n\n"}
                {t.insights.disclaimerText2}
                {"\n\n"}
                {t.insights.disclaimerText3}
              </Text>
              <TouchableOpacity 
                style={styles.disclaimerButton2} 
                onPress={() => setDisclaimerVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.disclaimerButtonText}>{t.insights.iUnderstand}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

function createInsightsStyles(colors: typeof Colors.light) { return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  wrapper: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerTop: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "flex-start" as const,
  },
  disclaimerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 40,
  },
  phaseCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: "center" as const,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  phaseTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  phaseValue: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: colors.primary,
    textTransform: "capitalize" as const,
    marginBottom: 12,
  },
  phaseDescription: {
    fontSize: 14,
    color: colors.text,
    textAlign: "center" as const,
    lineHeight: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 16,
  },
  scoreGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    marginHorizontal: -6,
  },
  scoreGridItem: {
    width: "33.333%" as const,
    paddingHorizontal: 6,
    marginBottom: 12,
    alignItems: "center" as const,
  },
  scoreGridLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: "center" as const,
    marginTop: 10,
    marginBottom: 4,
  },
  scoreGridValue: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: colors.text,
    textAlign: "center" as const,
  },
  scoreGridMax: {
    fontSize: 13,
    color: colors.textTertiary,
  },
  scoreGridAvg: {
    fontSize: 10,
    color: colors.textTertiary,
    textAlign: "center" as const,
    marginTop: 2,
  },
  miniProgressBar: {
    height: 4,
    backgroundColor: colors.borderLight,
    borderRadius: 2,
    overflow: "hidden" as const,
  },
  miniProgressFill: {
    height: "100%" as const,
    borderRadius: 2,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: -8,
    marginBottom: 16,
  },
  estimateDisclaimer: {
    fontSize: 11,
    color: colors.textSecondary,
    opacity: 0.7,
    marginBottom: 12,
    lineHeight: 15,
    fontStyle: "italic" as const,
  },
  historyCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 32,
    alignItems: "center" as const,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  historyValue: {
    fontSize: 48,
    fontWeight: "700" as const,
    color: colors.primary,
    marginBottom: 8,
  },
  historyLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center" as const,
    marginTop: 16,
    lineHeight: 20,
  },
  detailCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  detailIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  detailContent: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 8,
  },
  detailTextContent: {
    flex: 1,
  },
  detailLabelRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    marginBottom: 2,
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: colors.text,
  },
  detailDescription: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.primary,
  },
  detailValues: {
    alignItems: "flex-end" as const,
  },
  detailAvgValue: {
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 2,
  },
  opticalStatsGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    marginHorizontal: -6,
  },
  opticalStatsItem: {
    width: "50%" as const,
    paddingHorizontal: 6,
    marginBottom: 16,
    alignItems: "center" as const,
  },
  opticalStatsIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 8,
  },
  opticalLabelRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 4,
    marginBottom: 4,
  },
  opticalStatsLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center" as const,
  },
  opticalStatsValue: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.text,
    textAlign: "center" as const,
  },
  opticalStatsAvg: {
    fontSize: 10,
    color: colors.textTertiary,
    textAlign: "center" as const,
    marginTop: 2,
  },
  insightCard: {
    flexDirection: "row" as const,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  insightIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 4,
  },
  insightText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  recommendationsBox: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 16,
  },
  recommendationRow: {
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    marginBottom: 12,
  },
  recommendationBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 6,
    marginRight: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  todayResultCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  todayResultTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 20,
    textAlign: "center" as const,
  },
  todayScoresRow: {
    flexDirection: "row" as const,
    justifyContent: "space-around" as const,
    marginBottom: 16,
  },
  todayScoreItem: {
    alignItems: "center" as const,
  },
  todayScoreLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 4,
  },
  todayScoreValue: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.text,
  },
  metricLabelRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 4,
    marginTop: 8,
    marginBottom: 4,
  },
  scoreMax: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  todayAverage: {
    fontSize: 10,
    color: colors.textTertiary,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)" as const,
    justifyContent: "flex-end" as const,
  },
  modalOverlayDismiss: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%" as const,
    minHeight: 300,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    padding: 24,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.card,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: colors.text,
    flex: 1,
  },
  modalScroll: {
    flexGrow: 1,
    flexShrink: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  modalSection: {
    marginBottom: 28,
  },
  modalSectionHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
    marginBottom: 12,
  },
  modalSectionTitle: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: colors.text,
  },
  modalPhaseContext: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 24,
    backgroundColor: colors.primaryLight,
    padding: 18,
    borderRadius: 12,
    fontWeight: "500" as const,
  },
  modalText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 24,
  },
  modalListItem: {
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    marginBottom: 10,
  },
  modalListItemActive: {
    backgroundColor: colors.primaryLight,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: -4,
    marginBottom: 8,
  },
  modalBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 9,
    marginRight: 12,
  },
  modalBulletActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 8,
  },
  modalListText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    lineHeight: 24,
  },
  modalListTextActive: {
    fontWeight: "600" as const,
    color: colors.primary,
  },
  activeFactorsLabel: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    alignSelf: "flex-start" as const,
  },
  activeFactorsLabelText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: colors.primary,
  },
  guidanceCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  guidanceHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 0,
  },
  guidanceIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  guidanceTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.text,
    marginRight: 8,
  },
  guidanceSection: {
    marginTop: 20,
    marginBottom: 0,
  },
  guidanceSectionHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 12,
  },
  guidanceSectionTitle: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: colors.primary,
    marginLeft: 8,
  },
  guidanceItem: {
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    marginBottom: 10,
    paddingLeft: 8,
  },
  guidanceBullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.primary,
    marginTop: 7,
    marginRight: 10,
  },
  guidanceText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
  },
  disclaimerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    padding: 20,
  },
  disclaimerContent: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 32,
    width: "100%" as const,
    maxWidth: 400,
    alignItems: "center" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  disclaimerHeader: {
    alignItems: "center" as const,
    marginBottom: 20,
  },
  disclaimerIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  disclaimerTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 16,
    textAlign: "center" as const,
  },
  disclaimerText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
    textAlign: "center" as const,
    marginBottom: 24,
  },
  disclaimerButton2: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: "100%" as const,
    alignItems: "center" as const,
  },
  disclaimerButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  checkInSummaryCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.primaryLight,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  checkInSummaryTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 16,
  },
  checkInGrid: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    marginBottom: 12,
  },
  checkInItem: {
    alignItems: "center" as const,
  },
  checkInLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  checkInValue: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.primary,
  },
  checkInValueRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
  },
  lifestyleFactorsRow: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    alignItems: "center" as const,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  lifestyleFactorsLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 8,
  },
  factorTag: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
    gap: 4,
  },
  factorTagText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: "600" as const,
  },
  symptomsRow: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    alignItems: "flex-start" as const,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  symptomsLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: colors.textSecondary,
    marginRight: 6,
  },
  symptomsText: {
    fontSize: 12,
    color: colors.text,
    flex: 1,
  },
  notesRow: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    alignItems: "flex-start" as const,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: colors.textSecondary,
    marginRight: 6,
  },
  notesText: {
    fontSize: 12,
    color: colors.text,
    flex: 1,
    lineHeight: 18,
  },
  contextInsightCard: {
    flexDirection: "row" as const,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contextInsightIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
    flexShrink: 0,
  },
  contextInsightContent: {
    flex: 1,
  },
  contextInsightTitle: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 6,
  },
  contextInsightMessage: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  calendarCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  calendarHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 20,
  },
  calendarArrow: {
    padding: 8,
  },
  calendarMonth: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.text,
  },
  calendarWeekdays: {
    flexDirection: "row" as const,
    justifyContent: "space-around" as const,
    marginBottom: 12,
  },
  calendarWeekday: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: colors.textSecondary,
    width: "14.28%" as const,
    textAlign: "center" as const,
  },
  calendarGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
  },
  calendarDay: {
    width: "14.28%" as const,
    aspectRatio: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    borderRadius: 8,
    marginBottom: 4,
  },
  calendarDayWithData: {
    backgroundColor: colors.primaryLight,
  },
  calendarDayToday: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  calendarDaySelected: {
    backgroundColor: colors.primary,
  },
  calendarDayText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500" as const,
  },
  calendarDayTextWithData: {
    color: colors.primary,
    fontWeight: "600" as const,
  },
  calendarDayTextToday: {
    color: colors.primary,
    fontWeight: "700" as const,
  },
  calendarDayTextSelected: {
    color: colors.card,
    fontWeight: "700" as const,
  },
  calendarDayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    position: "absolute" as const,
    bottom: 4,
  },
  selectedDateCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  selectedDateTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 20,
    textAlign: "center" as const,
  },
  selectedCheckInSummary: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  selectedSectionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 16,
  },
  selectedScanSummary: {
    marginBottom: 0,
  },
  selectedScoresRow: {
    flexDirection: "row" as const,
    justifyContent: "space-around" as const,
    marginBottom: 20,
  },
  selectedScoreItem: {
    alignItems: "center" as const,
  },
  selectedScoreLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 4,
  },
  selectedScoreValue: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.text,
  },
  selectedMetricsGrid: {
    gap: 12,
  },
  selectedMetricRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  selectedMetricLabel: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500" as const,
  },
  selectedMetricValue: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: colors.primary,
  },
  noDataCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 32,
    marginBottom: 24,
    alignItems: "center" as const,
  },
  noDataText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center" as const,
  },
  statusBadge: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: "flex-end" as const,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700" as const,
  },
  patternCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  patternHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 16,
  },
  patternIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  patternHeaderText: {
    flex: 1,
  },
  patternTitle: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 2,
  },
  patternCount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  acceptedBadge: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  acceptedBadgeText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#10B981",
  },
  pendingBadge: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  pendingBadgeText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#F59E0B",
  },
  indicatorsList: {
    marginBottom: 16,
  },
  indicatorRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  indicatorLabel: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500" as const,
  },
  indicatorLabelInactive: {
    color: colors.textTertiary,
  },
  patternActionButton: {
    backgroundColor: "#E89BA4",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 6,
    alignSelf: "flex-start" as const,
  },
  patternActionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600" as const,
  },
  patternStatusRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  patternStatusText: {
    fontSize: 13,
    color: "#065F46",
    fontWeight: "500" as const,
    flex: 1,
  },
  trendsSection: {
    marginBottom: 32,
  },
  trendsSectionHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 20,
  },
  trendsTitleRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
  },
  trendsSectionTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: colors.text,
  },
  timeRangeSelector: {
    flexDirection: "row" as const,
    gap: 8,
  },
  timeRangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeRangeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeRangeButtonText: {
    fontSize: 12,
    fontWeight: "500" as const,
    color: colors.textSecondary,
  },
  timeRangeButtonTextActive: {
    color: "#FFFFFF",
  },
  chartContainer: {
    marginBottom: 24,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.text,
    marginBottom: 16,
  },
  trendNarrative: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: "italic" as const,
    marginBottom: 12,
    marginTop: -8,
    lineHeight: 18,
  },
  chart: {
    borderRadius: 16,
    marginRight: 0,
  },
  chartLegend: {
    flexDirection: "row" as const,
    justifyContent: "flex-start" as const,
    gap: 16,
    marginTop: 12,
    flexWrap: "wrap" as const,
  },
  legendItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyStateCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 32,
    marginBottom: 24,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center" as const,
  },
  vasomotorCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#E89BA4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  vasomotorHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 20,
    gap: 12,
  },
  vasomotorTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.text,
    flex: 1,
  },
  vasomotorMetric: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  vasomotorMetricLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500" as const,
    marginBottom: 6,
  },
  vasomotorMetricValue: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 4,
  },
  vasomotorMetricSubtext: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 4,
  },
  noScansContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    paddingHorizontal: 40,
  },
  noScansTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
    textAlign: "center" as const,
  },
  noScansSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center" as const,
    lineHeight: 22,
    marginBottom: 32,
  },
  noScansCta: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  noScansCtaText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.card,
  },
}); }

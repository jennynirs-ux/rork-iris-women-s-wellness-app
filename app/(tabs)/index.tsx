import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
  TextInput,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Droplets,
  Activity,
  Apple,
  Moon,
  Sparkles,
  Brain,
  CheckCircle2,
  Circle,
  Edit2,
  X,
  Sprout,
  Flower2,
  Zap,
  Heart,
  Battery,
  Hand,
  Eye,
  ArrowRight,
  Baby,
  Thermometer,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import CircularProgress from "@/components/CircularProgress";
import { useApp } from "@/contexts/AppContext";
import { useTheme } from "@/contexts/ThemeContext";
import { router } from "expo-router";
import { Habit } from "@/types";
import Colors from "@/constants/colors";

const PHASE_INFO = {
  menstrual: { color: "#E89BA4", icon: Moon },
  follicular: { color: "#8BC9A3", icon: Sprout },
  ovulation: { color: "#F4C896", icon: Sparkles },
  luteal: { color: "#B8A4E8", icon: Flower2 },
};

const HABIT_ICONS = {
  hydration: Droplets,
  movement: Activity,
  nutrition: Apple,
  recovery: Moon,
  skincare: Sparkles,
  mindfulness: Brain,
  selfcheck: Hand,
  pelvicfloor: Activity,
};

const HABIT_COLORS = {
  hydration: "#A4C8E8",
  movement: "#F4A896",
  nutrition: "#8BC9A3",
  recovery: "#B8A4E8",
  skincare: "#F4C8D4",
  mindfulness: "#96E8D4",
  selfcheck: "#E89BA4",
  pelvicfloor: "#F4C896",
};

function WebDatePicker({ date, onChange, colors }: { date: Date; onChange: (date: Date) => void; colors: typeof Colors.light }) {
  const monthRef = useRef<TextInput>(null);
  const dayRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);
  
  const [month, setMonth] = useState(String(date.getMonth() + 1).padStart(2, '0'));
  const [day, setDay] = useState(String(date.getDate()).padStart(2, '0'));
  const [year, setYear] = useState(String(date.getFullYear()));

  const updateDate = (newMonth: string, newDay: string, newYear: string) => {
    const monthNum = parseInt(newMonth) || 1;
    const dayNum = parseInt(newDay) || 1;
    const yearNum = parseInt(newYear) || new Date().getFullYear();
    
    if (monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31 && yearNum >= 1900 && yearNum <= 2100) {
      let newDate = new Date(yearNum, monthNum - 1, dayNum);
      if (!isNaN(newDate.getTime())) {
        const today = new Date();
        if (newDate > today) {
          newDate = today;
        }
        onChange(newDate);
      }
    }
  };

  const handleMonthChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 2);
    setMonth(cleaned);
    if (cleaned.length === 2) {
      dayRef.current?.focus();
      updateDate(cleaned, day, year);
    }
  };

  const handleDayChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 2);
    setDay(cleaned);
    if (cleaned.length === 2) {
      yearRef.current?.focus();
      updateDate(month, cleaned, year);
    }
  };

  const handleYearChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 4);
    setYear(cleaned);
    if (cleaned.length === 4) {
      updateDate(month, day, cleaned);
    }
  };

  const wdpStyles = useMemo(() => StyleSheet.create({
    container: {
      flexDirection: "row" as const,
      alignItems: "flex-end" as const,
      justifyContent: "center" as const,
    },
    group: {
      alignItems: "center" as const,
      marginHorizontal: 4,
    },
    separatorContainer: {
      justifyContent: "center" as const,
      alignItems: "center" as const,
      marginHorizontal: 4,
    },
    label: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 6,
      fontWeight: "500" as const,
    },
    input: {
      width: 60,
      height: 56,
      fontSize: 20,
      fontWeight: "600" as const,
      color: colors.text,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 8,
      backgroundColor: colors.background,
      textAlign: "center" as const,
    },
    yearInput: {
      width: 90,
    },
    separator: {
      fontSize: 24,
      fontWeight: "600" as const,
      color: colors.textSecondary,
      marginBottom: 8,
    },
  }), [colors]);

  return (
    <View style={wdpStyles.container}>
      <View style={wdpStyles.group}>
        <Text style={wdpStyles.label}>Month</Text>
        <TextInput
          ref={monthRef}
          style={wdpStyles.input}
          value={month}
          onChangeText={handleMonthChange}
          placeholder="MM"
          placeholderTextColor={colors.textTertiary}
          keyboardType="number-pad"
          maxLength={2}
        />
      </View>
      <View style={wdpStyles.separatorContainer}>
        <Text style={wdpStyles.separator}>/</Text>
      </View>
      <View style={wdpStyles.group}>
        <Text style={wdpStyles.label}>Day</Text>
        <TextInput
          ref={dayRef}
          style={wdpStyles.input}
          value={day}
          onChangeText={handleDayChange}
          placeholder="DD"
          placeholderTextColor={colors.textTertiary}
          keyboardType="number-pad"
          maxLength={2}
        />
      </View>
      <View style={wdpStyles.separatorContainer}>
        <Text style={wdpStyles.separator}>/</Text>
      </View>
      <View style={wdpStyles.group}>
        <Text style={wdpStyles.label}>Year</Text>
        <TextInput
          ref={yearRef}
          style={[wdpStyles.input, wdpStyles.yearInput]}
          value={year}
          onChangeText={handleYearChange}
          placeholder="YYYY"
          placeholderTextColor={colors.textTertiary}
          keyboardType="number-pad"
          maxLength={4}
        />
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const { todaySummary, updateHabit, todayHabits, setTodayHabits, latestScan, currentPhase, userProfile, todayCheckIn, updateLastPeriodDate, isLoading, lifeStageSuggestion, dismissLifeStageSuggestion, enrichedPhaseInfo, t } = useApp();
  const { colors } = useTheme();
  const [showEditPeriodModal, setShowEditPeriodModal] = useState(false);
  const [tempDate, setTempDate] = useState(new Date(userProfile.lastPeriodDate));

  const styles = useMemo(() => createStyles(colors), [colors]);

  useEffect(() => {
    if (!isLoading && !userProfile.hasCompletedOnboarding) {
      router.replace("/onboarding" as any);
    }
  }, [userProfile.hasCompletedOnboarding, isLoading]);

  const hasTodayScan = useMemo(() => {
    if (!latestScan) return false;
    const today = new Date().toISOString().split("T")[0];
    return latestScan.date === today;
  }, [latestScan]);

  const shouldShowDailyRitualCard = !hasTodayScan || !todayCheckIn;

  const generateTodayHabits = useCallback(() => {
    const scan = latestScan;
    const checkIn = todayCheckIn;
    const habits: Habit[] = [];
    let habitId = 0;

    const checkInEnergy = checkIn?.energy || 5;
    const combinedEnergy = checkIn && scan 
      ? (checkIn.energy + scan.energyScore) / 2 
      : checkInEnergy;

    const hasCramps = checkIn?.symptoms.includes("Cramps");
    const hasFatigue = checkIn?.symptoms.includes("Fatigue");
    const hasInsomnia = checkIn?.symptoms.includes("Insomnia");
    const hasBackPain = checkIn?.symptoms.includes("Back Pain");
    const hasAcne = checkIn?.symptoms.includes("Acne");
    const lowMood = checkIn && checkIn.mood < 5;
    const hasMoodSwings = checkIn?.symptoms.includes("Mood Swings");
    const hasHeadache = checkIn?.symptoms.includes("Headache");
    const hasBloating = checkIn?.symptoms.includes("Bloating");
    const poorSleep = checkIn && checkIn.sleep < 5;
    const hadCaffeine = checkIn?.hadCaffeine;
    const hadAlcohol = checkIn?.hadAlcohol;
    const isIll = checkIn?.isIll;
    const stressScore = scan?.stressScore || 5;
    const highStress = stressScore > 7;
    const veryHighStress = stressScore > 8.5;
    const highInflammation = scan && scan.inflammation > 6;
    const highFatigue = scan && scan.fatigueLevel > 7;
    const moderateFatigue = scan && scan.fatigueLevel > 5 && scan.fatigueLevel <= 7;
    const lowRecovery = scan && scan.recoveryScore < 5;
    const goodRecovery = scan && scan.recoveryScore >= 7;
    const lowHydration = !scan || scan.hydrationLevel < 6;
    const moderateHydration = scan && scan.hydrationLevel >= 6 && scan.hydrationLevel < 8;

    const shouldRest = isIll || veryHighStress || (highStress && lowRecovery) || (highFatigue && poorSleep);
    const shouldDoGentle = shouldRest || hasCramps || (hasFatigue && combinedEnergy < 4) || (poorSleep && lowRecovery);
    const canDoIntense = !shouldRest && !shouldDoGentle && combinedEnergy > 7 && (!highStress || goodRecovery) && !highFatigue;

    if (lowHydration) {
      habits.push({ id: String(++habitId), title: t.habits.morningHydrationBoost, description: currentPhase === "menstrual" ? t.habits.drinkGlassesElectrolytes : t.habits.drinkGlasses, category: "hydration", completed: false, icon: "Droplets" });
    } else if (moderateHydration) {
      habits.push({ id: String(++habitId), title: t.habits.stayHydrated, description: t.habits.sipWater, category: "hydration", completed: false, icon: "Droplets" });
    }

    if (shouldRest) {
      habits.push({ id: String(++habitId), title: t.habits.restDay, description: isIll ? t.habits.focusRecovery : t.habits.bodyNeedsRest, category: "recovery", completed: false, icon: "Moon" });
    } else if (shouldDoGentle) {
      habits.push({ id: String(++habitId), title: t.habits.restorativeMovement, description: hasCramps ? t.habits.gentlePelvicStretches : t.habits.gentleStretching, category: "movement", completed: false, icon: "Activity" });
    } else if (currentPhase === "menstrual") {
      if (canDoIntense) {
        habits.push({ id: String(++habitId), title: t.habits.strengthTraining, description: t.habits.energyHighDespitePeriod, category: "movement", completed: false, icon: "Activity" });
      } else if (combinedEnergy > 5) {
        habits.push({ id: String(++habitId), title: t.habits.moderateMovement, description: t.habits.decentEnergy, category: "movement", completed: false, icon: "Activity" });
      } else {
        habits.push({ id: String(++habitId), title: t.habits.lightWalk, description: t.habits.easyWalkNature, category: "movement", completed: false, icon: "Activity" });
      }
    } else if (currentPhase === "follicular") {
      if (canDoIntense) {
        habits.push({ id: String(++habitId), title: t.habits.strengthTraining, description: t.habits.weightsResistance, category: "movement", completed: false, icon: "Activity" });
      } else if (combinedEnergy > 5) {
        habits.push({ id: String(++habitId), title: t.habits.energizingCardio, description: t.habits.joggingCycling, category: "movement", completed: false, icon: "Activity" });
      } else {
        habits.push({ id: String(++habitId), title: t.habits.moderateMovement, description: t.habits.pilatesYoga, category: "movement", completed: false, icon: "Activity" });
      }
    } else if (currentPhase === "ovulation") {
      if (canDoIntense) {
        habits.push({ id: String(++habitId), title: t.habits.peakPerformance, description: t.habits.hiitIntense, category: "movement", completed: false, icon: "Activity" });
      } else if (combinedEnergy > 5) {
        habits.push({ id: String(++habitId), title: t.habits.moderateIntense, description: t.habits.cardioSports, category: "movement", completed: false, icon: "Activity" });
      } else {
        habits.push({ id: String(++habitId), title: t.habits.moderateExercise, description: t.habits.moderateCardio, category: "movement", completed: false, icon: "Activity" });
      }
    } else {
      if (canDoIntense && combinedEnergy > 7) {
        habits.push({ id: String(++habitId), title: t.habits.moderateIntense, description: t.habits.cardioSports, category: "movement", completed: false, icon: "Activity" });
      } else if (combinedEnergy > 5) {
        habits.push({ id: String(++habitId), title: t.habits.moderateExercise, description: t.habits.moderateCardio, category: "movement", completed: false, icon: "Activity" });
      } else {
        habits.push({ id: String(++habitId), title: t.habits.gentleMovement, description: t.habits.restorativeYoga, category: "movement", completed: false, icon: "Activity" });
      }
    }

    if (currentPhase === "luteal") {
      if (highInflammation) {
        habits.push({ id: String(++habitId), title: t.habits.antiInflammatory, description: t.habits.turmericOmega3, category: "nutrition", completed: false, icon: "Apple" });
      } else {
        habits.push({ id: String(++habitId), title: t.habits.nutrientDense, description: t.habits.complexCarbsMagnesium, category: "nutrition", completed: false, icon: "Apple" });
      }
      if (hasBloating) {
        habits.push({ id: String(++habitId), title: t.habits.reduceBloating, description: t.habits.avoidSaltFiber, category: "nutrition", completed: false, icon: "Apple" });
      }
    } else if (currentPhase === "menstrual") {
      habits.push({ id: String(++habitId), title: t.habits.ironMagnesium, description: t.habits.spinachChocolate, category: "nutrition", completed: false, icon: "Apple" });
    } else if (currentPhase === "follicular") {
      habits.push({ id: String(++habitId), title: t.habits.proteinFresh, description: t.habits.leanProteinVeggies, category: "nutrition", completed: false, icon: "Apple" });
    } else {
      habits.push({ id: String(++habitId), title: t.habits.balancedNutrition, description: t.habits.healthyFatsFiber, category: "nutrition", completed: false, icon: "Apple" });
    }

    if (highInflammation && currentPhase !== "luteal") {
      habits.push({ id: String(++habitId), title: t.habits.antiInflammSupport, description: t.habits.greenTeaTurmeric, category: "nutrition", completed: false, icon: "Apple" });
    }

    if (veryHighStress) {
      habits.push({ id: String(++habitId), title: t.habits.urgentStressRecovery, description: hadCaffeine ? t.habits.stopCaffeineRest : t.habits.prioritizeRest, category: "recovery", completed: false, icon: "Moon" });
    } else if (highStress) {
      habits.push({ id: String(++habitId), title: t.habits.stressRecovery, description: hadCaffeine ? t.habits.noCaffeineBreathing : t.habits.lightStretchingBreaks, category: "recovery", completed: false, icon: "Moon" });
    }

    if (poorSleep || hasInsomnia || (lowRecovery && !highStress) || (highFatigue && !shouldRest)) {
      habits.push({ id: String(++habitId), title: t.habits.sleepOptimization, description: hasInsomnia ? t.habits.noScreensMagnesium : poorSleep ? t.habits.prioritizeSleep : t.habits.sleepQuality, category: "recovery", completed: false, icon: "Moon" });
    }

    if ((currentPhase === "menstrual" || hasBackPain) && !poorSleep && !highStress && !shouldRest) {
      habits.push({ id: String(++habitId), title: t.habits.soothingSelfCare, description: hasBackPain ? t.habits.heatTherapy : t.habits.warmBathLavender, category: "recovery", completed: false, icon: "Moon" });
    }

    if (hadAlcohol && (!goodRecovery || lowHydration)) {
      habits.push({ id: String(++habitId), title: t.habits.recoverySupport, description: t.habits.extraWaterElectrolytes, category: "recovery", completed: false, icon: "Moon" });
    }

    if (moderateFatigue && !highFatigue && !shouldRest) {
      habits.push({ id: String(++habitId), title: t.habits.energySupport, description: t.habits.balancedMealsHydrated, category: "recovery", completed: false, icon: "Moon" });
    }

    if (hasAcne) {
      habits.push({ id: String(++habitId), title: t.habits.targetedAcne, description: t.habits.gentleCleanserAcid, category: "skincare", completed: false, icon: "Sparkles" });
    } else if (currentPhase === "ovulation" || currentPhase === "follicular") {
      habits.push({ id: String(++habitId), title: t.habits.glowingSkin, description: t.habits.exfoliateVitaminC, category: "skincare", completed: false, icon: "Sparkles" });
    } else if (currentPhase === "luteal" && highInflammation) {
      habits.push({ id: String(++habitId), title: t.habits.calmingSkincare, description: t.habits.gentleCleanserNiacinamide, category: "skincare", completed: false, icon: "Sparkles" });
    } else if (currentPhase === "menstrual") {
      habits.push({ id: String(++habitId), title: t.habits.gentleSkinCare, description: t.habits.mildCleanserSPF, category: "skincare", completed: false, icon: "Sparkles" });
    }

    if (lowMood || hasMoodSwings) {
      habits.push({ id: String(++habitId), title: t.habits.moodElevation, description: t.habits.meditationGratitude, category: "mindfulness", completed: false, icon: "Brain" });
    }

    if (hasHeadache) {
      habits.push({ id: String(++habitId), title: t.habits.headacheRelief, description: t.habits.dimLightsMassage, category: "mindfulness", completed: false, icon: "Brain" });
    }

    if (veryHighStress && !lowMood) {
      habits.push({ id: String(++habitId), title: t.habits.deepStressRelief, description: t.habits.boxBreathingJournal, category: "mindfulness", completed: false, icon: "Brain" });
    } else if (highStress && !lowMood && !hasHeadache) {
      habits.push({ id: String(++habitId), title: t.habits.calmMind, description: t.habits.breathingRelaxation, category: "mindfulness", completed: false, icon: "Brain" });
    }

    if (currentPhase === "luteal" && !lowMood && !highStress) {
      habits.push({ id: String(++habitId), title: t.habits.emotionalBalance, description: t.habits.meditationAffirmations, category: "mindfulness", completed: false, icon: "Brain" });
    }

    if (isIll) {
      habits.push({ id: String(++habitId), title: t.habits.immuneSupport, description: t.habits.restVitaminC, category: "recovery", completed: false, icon: "Moon" });
    }

    if (habits.length === 0) {
      habits.push({ id: "1", title: t.habits.dailyWellness, description: t.habits.hydrateMove, category: "hydration", completed: false, icon: "Droplets" });
    }

    habits.push({ id: String(++habitId), title: t.habits.pelvicFloorExercise, description: t.habits.gentleContractions, category: "pelvicfloor", completed: false, icon: "Activity" });

    const today = new Date();
    const dayOfMonth = today.getDate();
    if (dayOfMonth === 1) {
      habits.push({ id: String(++habitId), title: t.habits.squeezeDayMonthly, description: t.habits.breastSelfExam, category: "selfcheck", completed: false, icon: "Hand" });
    }

    setTodayHabits(habits);
  }, [latestScan, currentPhase, todayCheckIn, setTodayHabits]);

  useEffect(() => {
    generateTodayHabits();
  }, [generateTodayHabits]);

  const lifeStagePhase = useMemo(() => {
    const override = enrichedPhaseInfo.lifeStageOverride;
    if (override === 'pregnancy') {
      return { color: enrichedPhaseInfo.phaseColor, icon: Baby, label: enrichedPhaseInfo.phaseName };
    }
    if (override === 'postpartum') {
      return { color: enrichedPhaseInfo.phaseColor, icon: Heart, label: enrichedPhaseInfo.phaseName };
    }
    if (override === 'perimenopause') {
      return { color: enrichedPhaseInfo.phaseColor, icon: Sparkles, label: enrichedPhaseInfo.phaseName };
    }
    if (override === 'menopause') {
      return { color: enrichedPhaseInfo.phaseColor, icon: Sparkles, label: enrichedPhaseInfo.phaseName };
    }
    const info = PHASE_INFO[enrichedPhaseInfo.phase];
    return { color: info.color, icon: info.icon, label: enrichedPhaseInfo.phaseName };
  }, [enrichedPhaseInfo]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <Eye size={48} color={colors.primary} />
          <Text style={styles.loadingText}>IRIS</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>IRIS</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.summaryCard}>
            <View style={styles.phaseHeader}>
              <View style={[styles.phaseIconContainer, { backgroundColor: lifeStagePhase.color + "30" }]}>
                <lifeStagePhase.icon size={32} color={lifeStagePhase.color} />
              </View>
              <View style={styles.phaseInfo}>
                <Text style={styles.phaseLabel}>{t.home.phase}</Text>
                <Text style={styles.phaseName}>{lifeStagePhase.label}</Text>
              </View>
              {userProfile.lifeStage === 'regular' && (
                <TouchableOpacity
                  style={styles.editPhaseButton}
                  onPress={() => {
                    setTempDate(new Date(userProfile.lastPeriodDate));
                    setShowEditPeriodModal(true);
                  }}
                >
                  <Edit2 size={20} color={colors.primary} />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.scoresContainer}>
              <View style={styles.scoreItem}>
                <CircularProgress
                  size={56}
                  strokeWidth={3}
                  progress={(todaySummary.stressScore / 10) * 100}
                  progressColor={colors.stressHigh}
                  trackColor={colors.borderLight}
                  fillColor={colors.stressFill}
                >
                  <Zap size={20} color={colors.stressHigh} />
                </CircularProgress>
                <Text style={styles.scoreLabel}>{t.home.stress}</Text>
              </View>
              <View style={styles.scoreItem}>
                <CircularProgress
                  size={56}
                  strokeWidth={3}
                  progress={(todaySummary.energyScore / 10) * 100}
                  progressColor={colors.energyHigh}
                  trackColor={colors.borderLight}
                  fillColor={colors.energyFill}
                >
                  <Battery size={20} color={colors.energyHigh} />
                </CircularProgress>
                <Text style={styles.scoreLabel}>{t.home.energy}</Text>
              </View>
              <View style={styles.scoreItem}>
                <CircularProgress
                  size={56}
                  strokeWidth={3}
                  progress={(todaySummary.recoveryScore / 10) * 100}
                  progressColor={colors.recoveryHigh}
                  trackColor={colors.borderLight}
                  fillColor={colors.recoveryFill}
                >
                  <Heart size={20} color={colors.recoveryHigh} />
                </CircularProgress>
                <Text style={styles.scoreLabel}>{t.home.recovery}</Text>
              </View>
            </View>

            <View style={styles.focusContainer}>
              <Text style={styles.focusLabel}>{t.home.recommendedFocus}</Text>
              <Text style={styles.focusText}>{todaySummary.recommendedFocus}</Text>
            </View>
          </View>

          {lifeStageSuggestion && (
            <View style={styles.suggestionBanner}>
              <View style={styles.suggestionIconRow}>
                <View style={[
                  styles.suggestionIcon,
                  { backgroundColor: lifeStageSuggestion.type === 'pregnancy' ? '#F4C8D420' : '#B8A4E820' },
                ]}>
                  {lifeStageSuggestion.type === 'pregnancy' ? (
                    <Baby size={22} color="#E89BA4" />
                  ) : (
                    <Thermometer size={22} color="#B8A4E8" />
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => dismissLifeStageSuggestion(lifeStageSuggestion.type)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <X size={18} color={colors.textTertiary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.suggestionText}>{lifeStageSuggestion.message}</Text>
              <TouchableOpacity
                style={styles.suggestionButton}
                onPress={() => router.push('/profile' as any)}
              >
                <Text style={styles.suggestionButtonText}>Update Life Stage</Text>
                <ArrowRight size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

          {shouldShowDailyRitualCard && (
            <TouchableOpacity 
              style={styles.dailyRitualCard}
              onPress={() => router.push("/scan" as any)}
              activeOpacity={0.7}
            >
              <View style={styles.ritualIconContainer}>
                <View style={styles.ritualIconCircle}>
                  <Eye size={24} color={colors.primary} />
                </View>
              </View>
              <View style={styles.ritualContent}>
                <Text style={styles.ritualTitle}>{t.home.dailyRitual}</Text>
                <Text style={styles.ritualSubtext}>{t.home.startYourDay}</Text>
              </View>
              <View style={styles.ritualButton}>
                <Text style={styles.ritualButtonText}>Start</Text>
                <ArrowRight size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          )}

          <View style={styles.habitsSection}>
            <Text style={styles.sectionTitle}>{t.home.todaysHabits}</Text>
            {todayHabits.map((habit) => {
              const IconComponent = HABIT_ICONS[habit.category];
              const habitColor = HABIT_COLORS[habit.category];
              return (
                <TouchableOpacity
                  key={habit.id}
                  style={styles.habitCard}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    updateHabit({ habitId: habit.id, completed: !habit.completed });
                  }}
                >
                  <View style={[styles.habitIcon, { backgroundColor: habitColor + "20" }]}>
                    <IconComponent size={20} color={habitColor} />
                  </View>
                  <View style={styles.habitContent}>
                    <Text style={styles.habitTitle}>{habit.title}</Text>
                    <Text style={styles.habitDescription}>{habit.description}</Text>
                  </View>
                  <View style={styles.habitCheckbox}>
                    {habit.completed ? (
                      <CheckCircle2 size={24} color={colors.primary} />
                    ) : (
                      <Circle size={24} color={colors.border} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <Modal
          visible={showEditPeriodModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowEditPeriodModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t.home.updateLastPeriod}</Text>
                <TouchableOpacity onPress={() => setShowEditPeriodModal(false)}>
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalDescription}>
                Select the first day of your last period to adjust your cycle tracking. Day {enrichedPhaseInfo.cycleDay} of {enrichedPhaseInfo.totalCycleDays} — {enrichedPhaseInfo.phaseName}
              </Text>
              
              <View style={styles.datePickerContainer}>
                {Platform.OS === "web" ? (
                  <WebDatePicker date={tempDate} onChange={setTempDate} colors={colors} />
                ) : (
                  <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedDate) => {
                      if (selectedDate) {
                        setTempDate(selectedDate);
                      }
                    }}
                    maximumDate={new Date()}
                    style={{ width: "100%", height: 200 }}
                  />
                )}
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  updateLastPeriodDate(tempDate);
                  setShowEditPeriodModal(false);
                }}
              >
                <Text style={styles.saveButtonText}>{t.home.save}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

function createStyles(colors: typeof Colors.light) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
    header: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "700" as const,
      color: colors.primary,
      letterSpacing: 2,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      gap: 16,
    },
    loadingText: {
      fontSize: 28,
      fontWeight: "700" as const,
      color: colors.primary,
      letterSpacing: 2,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
      paddingTop: 0,
      paddingBottom: 40,
    },
    summaryCard: {
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
    phaseHeader: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      marginBottom: 20,
    },
    phaseIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginRight: 16,
    },
    phaseInfo: {
      flex: 1,
    },
    phaseLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    phaseName: {
      fontSize: 22,
      fontWeight: "700" as const,
      color: colors.text,
    },
    scoresContainer: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      marginBottom: 16,
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    scoreItem: {
      alignItems: "center" as const,
      flex: 1,
      paddingHorizontal: 4,
    },
    scoreLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 8,
      fontWeight: "600" as const,
    },
    focusContainer: {
      alignItems: "center" as const,
    },
    focusLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    focusText: {
      fontSize: 16,
      fontWeight: "600" as const,
      color: colors.primary,
    },
    habitsSection: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 16,
    },
    habitCard: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
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
    habitIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginRight: 12,
    },
    habitContent: {
      flex: 1,
    },
    habitTitle: {
      fontSize: 15,
      fontWeight: "600" as const,
      color: colors.text,
      marginBottom: 2,
    },
    habitDescription: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    habitCheckbox: {
      marginLeft: 8,
    },
    editPhaseButton: {
      padding: 8,
      backgroundColor: colors.primaryLight,
      borderRadius: 12,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end" as const,
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      paddingBottom: 40,
    },
    modalHeader: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      marginBottom: 8,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: "700" as const,
      color: colors.text,
    },
    modalDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 24,
    },
    datePickerContainer: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      alignItems: "center" as const,
      marginBottom: 20,
    },
    suggestionBanner: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    suggestionIconRow: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      marginBottom: 12,
    },
    suggestionIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    suggestionText: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 16,
    },
    suggestionButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 20,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      gap: 6,
      alignSelf: "flex-start" as const,
    },
    suggestionButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "600" as const,
    },
    saveButton: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 16,
      alignItems: "center" as const,
    },
    saveButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600" as const,
    },
    dailyRitualCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      marginBottom: 24,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.primaryLight,
    },
    ritualIconContainer: {
      marginRight: 16,
    },
    ritualIconCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primaryLight,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    ritualContent: {
      flex: 1,
    },
    ritualTitle: {
      fontSize: 16,
      fontWeight: "600" as const,
      color: colors.text,
      marginBottom: 4,
    },
    ritualSubtext: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    ritualButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 4,
    },
    ritualButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "600" as const,
    },
  });
}

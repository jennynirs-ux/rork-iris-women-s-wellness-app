import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
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
  ChevronDown,
  ChevronUp,
  Send,
  ThumbsUp,
  Flag,
  Flame,
  ClipboardCheck,
  AlertCircle,
  Star,
  TrendingUp,
  CheckCircle,
  Camera,
  Leaf,
  Coffee,
  BedDouble,
} from "lucide-react-native";

const COACHING_ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  AlertCircle, Moon, Zap, Battery, Droplets, Flame, Leaf, Star,
  TrendingUp, CheckCircle, Brain, Camera, Heart, Sprout, Coffee, BedDouble,
};
import * as Haptics from "expo-haptics";
import CircularProgress from "@/components/CircularProgress";
import { useApp } from "@/contexts/AppContext";
import { useTheme } from "@/contexts/ThemeContext";
import { router } from "expo-router";
import { Habit } from "@/types";
import Colors from "@/constants/colors";
import { generateCoachingTips, CoachingTip } from "@/lib/coachingEngine";
import { trpc } from "@/lib/trpc";
import logger from "@/lib/logger";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { calculateStreaks, StreakData } from "@/lib/gamification";

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

const COMMUNITY_CATEGORY_ICONS = {
  nutrition: Apple,
  exercise: Activity,
  selfcare: Moon,
  mindfulness: Brain,
  sleep: Moon,
};

const COMMUNITY_CATEGORY_COLORS = {
  nutrition: "#8BC9A3",
  exercise: "#F4A896",
  selfcare: "#F4C8D4",
  mindfulness: "#96E8D4",
  sleep: "#B8A4E8",
};

interface CommunityTip {
  id: string;
  phase: string;
  content: string;
  category: "nutrition" | "exercise" | "selfcare" | "mindfulness" | "sleep";
  likes: number;
  createdAt: string;
  reportCount: number;
}

interface HabitCardProps {
  habit: Habit;
  colors: typeof Colors.light;
  onPress: (habitId: string, completed: boolean) => void;
  styles: ReturnType<typeof createStyles>;
}

const HabitCard = React.memo(({ habit, colors, onPress, styles }: HabitCardProps) => {
  const IconComponent = HABIT_ICONS[habit.category];
  const habitColor = HABIT_COLORS[habit.category];

  return (
    <TouchableOpacity
      style={styles.habitCard}
      onPress={() => onPress(habit.id, habit.completed)}
      accessibilityLabel={`${habit.title}, ${habit.completed ? 'completed' : 'not completed'}`}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: habit.completed }}
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
});

HabitCard.displayName = 'HabitCard';

interface CoachingTipCardProps {
  tip: CoachingTip;
  colors: typeof Colors.light;
  onDismiss: (tipId: string) => void;
  styles: ReturnType<typeof createStyles>;
}

const CoachingTipCard = React.memo(({ tip, colors, onDismiss, styles }: CoachingTipCardProps) => {
  const categoryColors: Record<CoachingTip['category'], string> = {
    stress: "#FF6B6B",
    energy: "#FFD93D",
    recovery: "#6BCB77",
    hydration: "#4D96FF",
    inflammation: "#FF8C42",
    sleep: "#9D84B7",
    phase: "#E89BA4",
    trend: "#66C2FF",
  };

  const borderColor = categoryColors[tip.category];
  const IconComp = COACHING_ICON_MAP[tip.icon];

  return (
    <View style={[styles.coachingTipCard, { borderLeftColor: borderColor }]}>
      <View style={styles.coachingTipContent}>
        <View style={styles.coachingTipHeader}>
          {IconComp ? (
            <View style={{ marginRight: 12 }}>
              <IconComp size={20} color={borderColor} />
            </View>
          ) : (
            <Text style={styles.coachingTipIcon}>{tip.icon}</Text>
          )}
          <Text style={styles.coachingTipTitle}>{tip.title}</Text>
          <TouchableOpacity
            onPress={() => onDismiss(tip.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel={`Dismiss ${tip.title}`}
            accessibilityRole="button"
          >
            <X size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.coachingTipMessage}>{tip.message}</Text>
      </View>
    </View>
  );
});

CoachingTipCard.displayName = 'CoachingTipCard';

interface CommunityTipCardProps {
  tip: CommunityTip;
  colors: typeof Colors.light;
  onLike: (tipId: string) => void;
  onReport: (tipId: string) => void;
  styles: ReturnType<typeof createStyles>;
  isLiked: boolean;
}

const CommunityTipCard = React.memo(({ tip, colors, onLike, onReport, styles, isLiked }: CommunityTipCardProps) => {
  const IconComponent = COMMUNITY_CATEGORY_ICONS[tip.category];
  const categoryColor = COMMUNITY_CATEGORY_COLORS[tip.category];

  return (
    <View style={[styles.communityTipCard, { borderLeftColor: categoryColor }]}>
      <View style={styles.communityTipContent}>
        <View style={styles.communityTipHeader}>
          <View style={[styles.communityTipIcon, { backgroundColor: categoryColor + "20" }]}>
            <IconComponent size={16} color={categoryColor} />
          </View>
          <Text style={styles.communityTipCategory}>{tip.category}</Text>
        </View>
        <Text style={styles.communityTipText}>{tip.content}</Text>
        <View style={styles.communityTipFooter}>
          <TouchableOpacity
            style={[styles.communityTipActionButton, isLiked && styles.communityTipActionButtonActive]}
            onPress={() => onLike(tip.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel={`Like tip, ${tip.likes} likes`}
            accessibilityRole="button"
          >
            <ThumbsUp size={14} color={isLiked ? colors.primary : colors.textTertiary} />
            <Text style={[styles.communityTipActionText, isLiked && { color: colors.primary }]}>
              {tip.likes}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.communityTipActionButton}
            onPress={() => onReport(tip.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Report tip"
            accessibilityRole="button"
          >
            <Flag size={14} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

CommunityTipCard.displayName = 'CommunityTipCard';

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
  const { todaySummary, updateHabit, todayHabits, setTodayHabits, latestScan, currentPhase, userProfile, todayCheckIn, updateLastPeriodDate, isLoading, lifeStageSuggestion, dismissLifeStageSuggestion, enrichedPhaseInfo, phaseEstimate, scans, checkIns, t } = useApp();
  const { colors } = useTheme();
  const [showEditPeriodModal, setShowEditPeriodModal] = useState(false);
  const [tempDate, setTempDate] = useState(new Date(userProfile.lastPeriodDate));
  const [dismissedCoachingTips, setDismissedCoachingTips] = useState<Set<string>>(new Set());
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [communityTipText, setCommunityTipText] = useState("");
  const [communityTipCategory, setCommunityTipCategory] = useState<"nutrition" | "exercise" | "selfcare" | "mindfulness" | "sleep">("mindfulness");
  const [communityCollapsed, setCommunityCollapsed] = useState(false);
  const [likedTips, setLikedTips] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);

  const styles = useMemo(() => createStyles(colors), [colors]);

  // Get user ID from storage
  useEffect(() => {
    const loadUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("iris_user_id");
        if (!storedUserId) {
          const newId = Math.random().toString(36).substring(2, 15);
          await AsyncStorage.setItem("iris_user_id", newId);
          setUserId(newId);
        } else {
          setUserId(storedUserId);
        }
      } catch (err) {
        logger.error("Error loading user ID:", err);
      }
    };
    loadUserId();
  }, []);

  // Calculate streaks whenever scans or checkIns change
  useEffect(() => {
    const loadStreaks = async () => {
      const streaks = await calculateStreaks(scans, checkIns);
      setStreakData(streaks);
    };
    loadStreaks();
  }, [scans, checkIns]);

  // Fetch community feed
  const { data: communityFeedData, refetch: refetchCommunityFeed } = trpc.community.feed.useQuery(
    { phase: currentPhase, limit: 5 },
    { enabled: !communityCollapsed && !!currentPhase }
  );

  // Submit community tip mutation
  const submitTipMutation = trpc.community.submit.useMutation({
    onSuccess: () => {
      setCommunityTipText("");
      setCommunityTipCategory("mindfulness");
      setShowCommunityModal(false);
      refetchCommunityFeed();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    onError: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
  });

  // Like tip mutation
  const likeTipMutation = trpc.community.like.useMutation({
    onSuccess: () => {
      refetchCommunityFeed();
    },
  });

  // Report tip mutation
  const reportTipMutation = trpc.community.report.useMutation({
    onSuccess: () => {
      refetchCommunityFeed();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
  });

  const coachingTips = useMemo(() => {
    const allTips = generateCoachingTips(scans, checkIns, currentPhase, userProfile);
    return allTips.filter((tip) => !dismissedCoachingTips.has(tip.id));
  }, [scans, checkIns, currentPhase, userProfile, dismissedCoachingTips]);

  const handleDismissCoachingTip = useCallback((tipId: string) => {
    setDismissedCoachingTips((prev) => new Set([...prev, tipId]));
  }, []);

  useEffect(() => {
    if (!isLoading && !userProfile.hasCompletedOnboarding) {
      router.replace("/onboarding" as any);
    }
  }, [userProfile.hasCompletedOnboarding, isLoading]);

  const generateTodayHabits = useCallback(() => {
    const scan = latestScan;
    const checkIn = todayCheckIn;
    const habits: Habit[] = [];
    let habitId = 0;

    const checkInEnergy = checkIn?.energy || 5;
    const combinedEnergy = checkIn && scan 
      ? (checkIn.energy + scan.energyScore) / 2 
      : checkInEnergy;

    const hasCramps = checkIn?.symptoms?.includes("Cramps");
    const hasFatigue = checkIn?.symptoms?.includes("Fatigue");
    const hasInsomnia = checkIn?.symptoms?.includes("Insomnia");
    const hasBackPain = checkIn?.symptoms?.includes("Back Pain");
    const hasAcne = checkIn?.symptoms?.includes("Acne");
    const lowMood = checkIn && checkIn.mood < 5;
    const hasMoodSwings = checkIn?.symptoms?.includes("Mood Swings");
    const hasHeadache = checkIn?.symptoms?.includes("Headache");
    const hasBloating = checkIn?.symptoms?.includes("Bloating");
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

  const handleHabitPress = useCallback((habitId: string, completed: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateHabit({ habitId, completed: !completed });
  }, [updateHabit]);

  const handleSubmitCommunityTip = useCallback(() => {
    if (!communityTipText.trim() || communityTipText.length < 10 || !userId) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    submitTipMutation.mutate({
      phase: currentPhase,
      content: communityTipText,
      category: communityTipCategory,
      userId,
    });
  }, [communityTipText, communityTipCategory, currentPhase, userId, submitTipMutation]);

  const handleLikeCommunityTip = useCallback((tipId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLikedTips((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tipId)) {
        newSet.delete(tipId);
      } else {
        newSet.add(tipId);
      }
      return newSet;
    });
    likeTipMutation.mutate({ tipId });
  }, [likeTipMutation]);

  const handleReportCommunityTip = useCallback((tipId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    reportTipMutation.mutate({ tipId });
  }, [reportTipMutation]);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    let greetingText: string;
    if (hour < 12) {
      greetingText = t.home?.goodMorning || 'Good morning';
    } else if (hour < 17) {
      greetingText = t.home?.goodAfternoon || 'Good afternoon';
    } else {
      greetingText = t.home?.goodEvening || 'Good evening';
    }
    if (userProfile.name) {
      greetingText = `${greetingText}, ${userProfile.name}`;
    }
    return greetingText;
  }, [t, userProfile.name]);

  const isNewUser = useMemo(() => scans.length === 0 && !todayCheckIn, [scans.length, todayCheckIn]);

  const progressScanDone = useMemo(() => {
    if (!latestScan) return false;
    return latestScan.date === todayStr;
  }, [latestScan, todayStr]);

  const progressCheckInDone = useMemo(() => !!todayCheckIn, [todayCheckIn]);

  const habitsProgress = useMemo(() => {
    const total = todayHabits.length;
    const completed = todayHabits.filter(h => h.completed).length;
    return { completed, total };
  }, [todayHabits]);

  const allHabits = useMemo(() => {
    const scanHabit: Habit = {
      id: '__scan__',
      title: t.home?.scan || 'Scan',
      description: progressScanDone
        ? (t.home?.scanCompleted || 'Completed today')
        : (t.home?.startYourDay || 'Start your day with a scan and check-in'),
      category: 'hydration' as Habit['category'],
      completed: progressScanDone,
      icon: 'Eye',
    };
    const checkInHabit: Habit = {
      id: '__checkin__',
      title: t.home?.checkIn || 'Check-in',
      description: progressCheckInDone
        ? (t.home?.checkInCompleted || 'Completed today')
        : (t.home?.logHowYouFeel || 'Log how you feel today'),
      category: 'hydration' as Habit['category'],
      completed: progressCheckInDone,
      icon: 'ClipboardCheck',
    };
    return [scanHabit, checkInHabit, ...todayHabits];
  }, [todayHabits, progressScanDone, progressCheckInDone, t]);

  const handleSpecialHabitPress = useCallback((habitId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (habitId === '__scan__') {
      router.push('/(tabs)/scan');
    } else if (habitId === '__checkin__') {
      router.push('/check-in' as any);
    }
  }, []);

  const renderHeaderComponent = useCallback(() => (
    <View>
      {/* FIX 2: Personalized Greeting */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{greeting}</Text>
          {enrichedPhaseInfo?.cycleDay != null && enrichedPhaseInfo?.phaseName ? (
            <Text style={styles.headerSubtitle}>
              Day {enrichedPhaseInfo.cycleDay} of {enrichedPhaseInfo.totalCycleDays} · {enrichedPhaseInfo.phaseName}
            </Text>
          ) : null}
        </View>
      </View>

      {/* FIX 1: Welcome Card for new users */}
      {isNewUser && (
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeIconContainer}>
            <Eye size={36} color={colors.primary} />
          </View>
          <Text style={styles.welcomeTitle}>
            {t.home?.welcome || 'Welcome to IRIS'}
          </Text>
          <Text style={styles.welcomeSubtitle}>
            {t.home?.welcomeSubtitle || 'Start your first scan to unlock your personalized wellness dashboard'}
          </Text>
          <TouchableOpacity
            style={styles.welcomeButton}
            onPress={() => router.push('/(tabs)/scan')}
            activeOpacity={0.7}
            accessibilityLabel="Start your first scan"
            accessibilityRole="button"
          >
            <Text style={styles.welcomeButtonText}>
              {t.home?.startFirstScan || 'Start Your First Scan'}
            </Text>
            <ArrowRight size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}


      <View style={styles.summaryCard}>
        <View style={styles.phaseBadgeRow}>
          <View style={[styles.phaseBadge, { backgroundColor: lifeStagePhase.color + "20" }]}>
            <lifeStagePhase.icon size={14} color={lifeStagePhase.color} />
            <Text style={[styles.phaseBadgeText, { color: lifeStagePhase.color }]}>{lifeStagePhase.label}</Text>
          </View>
          {userProfile.lifeStage === 'regular' && (
            <TouchableOpacity
              style={styles.editPhaseButton}
              onPress={() => {
                setTempDate(new Date(userProfile.lastPeriodDate));
                setShowEditPeriodModal(true);
              }}
              accessibilityLabel="Edit cycle start date"
              accessibilityRole="button"
            >
              <Edit2 size={16} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
        {phaseEstimate.confidence === 'low' && (
          <Text style={styles.phaseConfidenceText}>
            Estimated — log more data for accuracy
          </Text>
        )}
        {phaseEstimate.confidence === 'medium' && (
          <Text style={styles.phaseConfidenceText}>
            Approximate — based on limited data
          </Text>
        )}

        <View style={styles.scoresContainer}>
          <View style={styles.scoreItem} accessibilityLabel={`Stress score: ${todaySummary.stressScore} out of 10`}>
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
          <View style={styles.scoreItem} accessibilityLabel={`Energy score: ${todaySummary.energyScore} out of 10`}>
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
          <View style={styles.scoreItem} accessibilityLabel={`Recovery score: ${todaySummary.recoveryScore} out of 10`}>
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

      {/* Streak moved inline to Scan habit item */}

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
              accessibilityLabel="Dismiss suggestion"
              accessibilityRole="button"
            >
              <X size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.suggestionText}>{lifeStageSuggestion.message}</Text>
          <TouchableOpacity
            style={styles.suggestionButton}
            onPress={() => router.push('/profile' as any)}
            accessibilityLabel="Update life stage"
            accessibilityRole="button"
          >
            <Text style={styles.suggestionButtonText}>Update Life Stage</Text>
            <ArrowRight size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      {/* Daily Tips hidden — redundant with summary card's recommended focus */}

      <View style={styles.habitsList}>
        <Text style={styles.sectionTitle}>{t.home.todaysHabits}</Text>
      </View>
    </View>
  ), [lifeStagePhase, userProfile, colors, t, todaySummary, lifeStageSuggestion, dismissLifeStageSuggestion, coachingTips, handleDismissCoachingTip, greeting, enrichedPhaseInfo, isNewUser, phaseEstimate, streakData]);

  const renderFooterComponent = useCallback(() => (
    <View>
      {communityFeedData?.tips && communityFeedData.tips.length > 0 && (
        <View style={styles.communitySection}>
          <TouchableOpacity
            style={styles.communitySectionHeader}
            onPress={() => setCommunityCollapsed(!communityCollapsed)}
            activeOpacity={0.7}
            accessibilityLabel="Toggle community feed"
            accessibilityRole="button"
          >
            <Text style={styles.sectionTitle}>From the Community</Text>
            {communityCollapsed ? (
              <ChevronDown size={20} color={colors.text} />
            ) : (
              <ChevronUp size={20} color={colors.text} />
            )}
          </TouchableOpacity>

          {!communityCollapsed && (
            <View style={styles.communityContent}>
              {communityFeedData.tips.map((tip) => (
                <CommunityTipCard
                  key={tip.id}
                  tip={tip}
                  colors={colors}
                  onLike={handleLikeCommunityTip}
                  onReport={handleReportCommunityTip}
                  isLiked={likedTips.has(tip.id)}
                  styles={styles}
                />
              ))}

              <TouchableOpacity
                style={styles.communityShareButton}
                onPress={() => setShowCommunityModal(true)}
                activeOpacity={0.7}
                accessibilityLabel="Share a tip"
                accessibilityRole="button"
              >
                <Send size={16} color="#FFFFFF" />
                <Text style={styles.communityShareButtonText}>Share a tip</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  ), [communityCollapsed, communityFeedData, likedTips, handleLikeCommunityTip, handleReportCommunityTip, colors, styles]);

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
        <FlatList
          data={allHabits}
          renderItem={({ item: habit }) => {
            if (habit.id === '__scan__' || habit.id === '__checkin__') {
              const isSpecialScan = habit.id === '__scan__';
              const iconColor = habit.completed ? '#8BC9A3' : colors.primary;
              return (
                <TouchableOpacity
                  style={styles.habitCard}
                  onPress={() => handleSpecialHabitPress(habit.id)}
                  accessibilityLabel={`${habit.title}, ${habit.completed ? 'completed' : 'not completed'}`}
                  accessibilityRole="button"
                >
                  <View style={[styles.habitIcon, { backgroundColor: (habit.completed ? '#8BC9A3' : colors.primary) + '20' }]}>
                    {isSpecialScan ? (
                      <Eye size={20} color={iconColor} />
                    ) : (
                      <ClipboardCheck size={20} color={iconColor} />
                    )}
                  </View>
                  <View style={styles.habitContent}>
                    <Text style={styles.habitTitle}>{habit.title}</Text>
                    <Text style={styles.habitDescription}>{habit.description}</Text>
                    {isSpecialScan && streakData && streakData.scanStreak > 1 && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 }}>
                        <Flame size={11} color={colors.statusAttention} />
                        <Text style={{ fontSize: 11, fontWeight: '600', color: colors.statusAttention }}>
                          {streakData.scanStreak}-day {t.home?.scanStreak || 'streak'}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.habitCheckbox}>
                    {habit.completed ? (
                      <CheckCircle2 size={24} color="#8BC9A3" />
                    ) : (
                      <ArrowRight size={24} color={colors.primary} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            }
            return (
              <HabitCard
                habit={habit}
                colors={colors}
                onPress={handleHabitPress}
                styles={styles}
              />
            );
          }}
          keyExtractor={(habit) => habit.id}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          ListHeaderComponent={renderHeaderComponent}
          ListFooterComponent={renderFooterComponent}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
        />

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
                <TouchableOpacity
                  onPress={() => setShowEditPeriodModal(false)}
                  accessibilityLabel="Close"
                  accessibilityRole="button"
                >
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
                accessibilityLabel="Save period date"
                accessibilityRole="button"
              >
                <Text style={styles.saveButtonText}>{t.home.save}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showCommunityModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowCommunityModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Share a Tip</Text>
                <TouchableOpacity
                  onPress={() => setShowCommunityModal(false)}
                  accessibilityLabel="Close"
                  accessibilityRole="button"
                >
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalDescription}>
                Share a helpful tip with others in your {currentPhase} phase. Keep it 10-280 characters.
              </Text>

              <View style={styles.communityModalForm}>
                <Text style={styles.formLabel}>Category</Text>
                <View style={styles.categorySelector}>
                  {(["nutrition", "exercise", "selfcare", "mindfulness", "sleep"] as const).map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryButton,
                        communityTipCategory === cat && styles.categoryButtonActive,
                      ]}
                      onPress={() => setCommunityTipCategory(cat)}
                      accessibilityLabel={`Select ${cat} category`}
                      accessibilityRole="button"
                    >
                      <Text
                        style={[
                          styles.categoryButtonText,
                          communityTipCategory === cat && { color: "#FFFFFF" },
                        ]}
                      >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.formLabel}>Your Tip</Text>
                <TextInput
                  style={styles.communityTipInput}
                  placeholder="Share your wisdom..."
                  placeholderTextColor={colors.textTertiary}
                  value={communityTipText}
                  onChangeText={setCommunityTipText}
                  multiline
                  maxLength={280}
                  textAlignVertical="top"
                />
                <Text style={styles.characterCount}>
                  {communityTipText.length}/280
                </Text>

                <TouchableOpacity
                  style={[
                    styles.submitTipButton,
                    (communityTipText.length < 10 || submitTipMutation.isPending) && styles.submitTipButtonDisabled,
                  ]}
                  onPress={handleSubmitCommunityTip}
                  disabled={communityTipText.length < 10 || submitTipMutation.isPending}
                  accessibilityLabel="Submit tip"
                  accessibilityRole="button"
                >
                  <Text style={styles.submitTipButtonText}>
                    {submitTipMutation.isPending ? "Submitting..." : "Submit Tip"}
                  </Text>
                </TouchableOpacity>
              </View>
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
      fontSize: 24,
      fontWeight: "700" as const,
      color: colors.text,
    },
    headerSubtitle: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 4,
    },
    welcomeCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 24,
      marginBottom: 24,
      alignItems: "center" as const,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.primaryLight,
    },
    welcomeIconContainer: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.primaryLight,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginBottom: 16,
    },
    welcomeTitle: {
      fontSize: 22,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 8,
      textAlign: "center" as const,
    },
    welcomeSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center" as const,
      lineHeight: 20,
      marginBottom: 20,
      paddingHorizontal: 8,
    },
    welcomeButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 24,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 8,
    },
    welcomeButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600" as const,
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
    phaseBadgeRow: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
      marginBottom: 12,
    },
    phaseBadge: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      gap: 6,
    },
    phaseBadgeText: {
      fontSize: 13,
      fontWeight: "700" as const,
    },
    phaseConfidenceText: {
      fontSize: 11,
      color: colors.textTertiary,
      marginBottom: 8,
    },
    phaseDescriptionSmall: {
      fontSize: 12,
      color: colors.textTertiary,
      textAlign: "center" as const,
      marginTop: 12,
      lineHeight: 17,
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
    streakCard: {
      backgroundColor: "#FF6B6B20",
      borderRadius: 12,
      padding: 12,
      marginHorizontal: 20,
      marginTop: 16,
      marginBottom: 4,
      borderLeftWidth: 4,
      borderLeftColor: "#FF6B6B",
    },
    streakText: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: colors.text,
    },
    streakSubtext: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 4,
    },
    habitsList: {
      marginBottom: 16,
      paddingHorizontal: 20,
    },
    flatListContent: {
      paddingHorizontal: 20,
      paddingBottom: 40,
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
    coachingTipsSection: {
      marginBottom: 24,
    },
    coachingTipCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderLeftWidth: 4,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    coachingTipContent: {
      flex: 1,
    },
    coachingTipHeader: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      marginBottom: 8,
    },
    coachingTipIcon: {
      fontSize: 20,
      marginRight: 12,
    },
    coachingTipTitle: {
      fontSize: 15,
      fontWeight: "600" as const,
      color: colors.text,
      flex: 1,
    },
    coachingTipMessage: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 19,
      marginLeft: 32,
    },
    communitySection: {
      marginBottom: 24,
    },
    communitySectionHeader: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      paddingHorizontal: 20,
      marginBottom: 12,
    },
    communityContent: {
      paddingHorizontal: 20,
    },
    communityTipCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderLeftWidth: 4,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    communityTipContent: {
      flex: 1,
    },
    communityTipHeader: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      marginBottom: 8,
      gap: 8,
    },
    communityTipIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    communityTipCategory: {
      fontSize: 12,
      fontWeight: "600" as const,
      color: colors.textSecondary,
      textTransform: "capitalize" as const,
    },
    communityTipText: {
      fontSize: 13,
      color: colors.text,
      lineHeight: 19,
      marginBottom: 12,
    },
    communityTipFooter: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 8,
    },
    communityTipActionButton: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: colors.surface,
    },
    communityTipActionButtonActive: {
      backgroundColor: colors.primaryLight,
    },
    communityTipActionText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "600" as const,
    },
    communityEmptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontStyle: "italic" as const,
      textAlign: "center" as const,
      marginVertical: 24,
    },
    communityShareButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 20,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      gap: 8,
      marginTop: 16,
      marginBottom: 8,
    },
    communityShareButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "600" as const,
    },
    communityModalForm: {
      gap: 16,
    },
    formLabel: {
      fontSize: 13,
      fontWeight: "600" as const,
      color: colors.text,
      marginBottom: 4,
    },
    categorySelector: {
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      gap: 8,
    },
    categoryButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    categoryButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    categoryButtonText: {
      fontSize: 12,
      fontWeight: "600" as const,
      color: colors.textSecondary,
    },
    communityTipInput: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      padding: 12,
      minHeight: 100,
      fontSize: 14,
      color: colors.text,
      fontFamily: undefined,
    },
    characterCount: {
      fontSize: 12,
      color: colors.textTertiary,
      textAlign: "right" as const,
    },
    submitTipButton: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 16,
      alignItems: "center" as const,
      marginTop: 8,
    },
    submitTipButtonDisabled: {
      opacity: 0.5,
    },
    submitTipButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600" as const,
    },
  });
}

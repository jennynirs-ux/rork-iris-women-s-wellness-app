import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Droplets,
  Leaf,
  Coffee,
  Apple,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Sparkles,
  Moon,
  Sprout,
  Flower2,
  Zap,
  Heart,
  Check,
  Minus,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useApp } from "@/contexts/AppContext";
import { CyclePhase } from "@/types";
import { generateDailyMealPlan, DailyMealPlan, MealSuggestion } from "@/lib/mealPlans";
import { mealTranslations as mt } from "@/constants/mealTranslations";

// ─── Icon Map ────────────────────────────────────────────────────────────────
// Map meal icon strings to available lucide-react-native icons
const MEAL_ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Leaf,
  Coffee,
  Apple,
  Sparkles,
  Zap,
  Heart,
  Fish: Droplets,       // Fish icon mapped to Droplets
  Egg: Sparkles,        // Egg icon mapped to Sparkles
  Cherry: Heart,        // Cherry mapped to Heart
  Cookie: Sparkles,     // Cookie mapped to Sparkles
  Wheat: Leaf,          // Wheat mapped to Leaf
  Soup: Droplets,       // Soup mapped to Droplets
  Salad: Leaf,          // Salad mapped to Leaf
  Beef: Zap,            // Beef mapped to Zap
};

const PHASE_INFO: Record<CyclePhase, { color: string; icon: React.ComponentType<{ size?: number; color?: string }>; label: string; description: string }> = {
  menstrual: { color: "#E89BA4", icon: Moon, label: mt.phaseMenstrual, description: mt.phaseDescMenstrual },
  follicular: { color: "#8BC9A3", icon: Sprout, label: mt.phaseFollicular, description: mt.phaseDescFollicular },
  ovulation: { color: "#F4C896", icon: Sparkles, label: mt.phaseOvulation, description: mt.phaseDescOvulation },
  luteal: { color: "#B8A4E8", icon: Flower2, label: mt.phaseLuteal, description: mt.phaseDescLuteal },
};

const MEAL_TYPE_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  breakfast: Coffee,
  lunch: Leaf,
  dinner: Moon,
  snack: Apple,
};

const MEAL_TYPE_COLORS: Record<string, string> = {
  breakfast: "#F4C896",
  lunch: "#8BC9A3",
  dinner: "#B8A4E8",
  snack: "#E89BA4",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getMealTypeLabel(type: MealSuggestion["mealType"]): string {
  switch (type) {
    case "breakfast": return mt.breakfast;
    case "lunch": return mt.lunch;
    case "dinner": return mt.dinner;
    case "snack": return mt.snack;
  }
}

function getMealTranslation(key: string): string {
  return (mt as Record<string, string>)[key] || key;
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function MealPlanScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { enrichedPhaseInfo, latestScan, todayCheckIn } = useApp();

  const [waterCount, setWaterCount] = useState(0);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);

  const styles = useMemo(() => createStyles(colors), [colors]);

  const currentPhase: CyclePhase = enrichedPhaseInfo?.phase ?? "follicular";
  const phaseDay = enrichedPhaseInfo?.phaseDay ?? 1;
  const phaseInfo = PHASE_INFO[currentPhase];

  const mealPlan: DailyMealPlan = useMemo(() => {
    return generateDailyMealPlan(currentPhase, phaseDay, latestScan, todayCheckIn);
  }, [currentPhase, phaseDay, latestScan, todayCheckIn]);

  const handleWaterIncrement = useCallback(() => {
    setWaterCount((prev) => Math.min(prev + 1, mealPlan.hydrationGoal + 4));
  }, [mealPlan.hydrationGoal]);

  const handleWaterDecrement = useCallback(() => {
    setWaterCount((prev) => Math.max(prev - 1, 0));
  }, []);

  const toggleMealExpand = useCallback((mealId: string) => {
    setExpandedMeal((prev) => (prev === mealId ? null : mealId));
  }, []);

  const PhaseIcon = phaseInfo.icon;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{mt.screenTitle}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Phase Badge */}
        <View style={styles.phaseBanner}>
          <View style={[styles.phaseBadge, { backgroundColor: phaseInfo.color + "20" }]}>
            <PhaseIcon size={16} color={phaseInfo.color} />
            <Text style={[styles.phaseBadgeText, { color: phaseInfo.color }]}>
              {phaseInfo.label}
            </Text>
          </View>
          <Text style={styles.phaseDescription}>{phaseInfo.description}</Text>
        </View>

        {/* Meal Cards */}
        {mealPlan.meals.map((meal) => {
          const MealTypeIcon = MEAL_TYPE_ICONS[meal.mealType] || Leaf;
          const mealColor = MEAL_TYPE_COLORS[meal.mealType] || colors.primary;
          const MealIcon = MEAL_ICON_MAP[meal.icon] || Leaf;
          const isExpanded = expandedMeal === meal.id;

          return (
            <TouchableOpacity
              key={meal.id}
              style={styles.mealCard}
              onPress={() => toggleMealExpand(meal.id)}
              activeOpacity={0.7}
              accessibilityLabel={`${getMealTypeLabel(meal.mealType)}: ${getMealTranslation(meal.titleKey)}`}
              accessibilityRole="button"
            >
              <View style={styles.mealCardHeader}>
                <View style={[styles.mealTypeIconBox, { backgroundColor: mealColor + "20" }]}>
                  <MealTypeIcon size={20} color={mealColor} />
                </View>
                <View style={styles.mealCardHeaderText}>
                  <Text style={[styles.mealTypeLabel, { color: mealColor }]}>
                    {getMealTypeLabel(meal.mealType)}
                  </Text>
                  <Text style={styles.mealTitle}>
                    {getMealTranslation(meal.titleKey)}
                  </Text>
                </View>
                <View style={styles.mealCardChevron}>
                  {isExpanded ? (
                    <ChevronUp size={18} color={colors.textTertiary} />
                  ) : (
                    <ChevronDown size={18} color={colors.textTertiary} />
                  )}
                </View>
              </View>

              {isExpanded && (
                <View style={styles.mealCardBody}>
                  <Text style={styles.mealDescription}>
                    {getMealTranslation(meal.descriptionKey)}
                  </Text>
                  <View style={styles.nutrientRow}>
                    {meal.nutrients.map((nutrient, idx) => (
                      <View key={idx} style={[styles.nutrientBadge, { backgroundColor: mealColor + "15" }]}>
                        <Text style={[styles.nutrientBadgeText, { color: mealColor }]}>
                          {nutrient}
                        </Text>
                      </View>
                    ))}
                    {meal.isAntiInflammatory && (
                      <View style={[styles.nutrientBadge, { backgroundColor: colors.statusGood + "20" }]}>
                        <Text style={[styles.nutrientBadgeText, { color: colors.statusGood }]}>
                          Anti-inflammatory
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Hydration Goal */}
        <View style={styles.sectionCard}>
          <View style={styles.hydrationHeader}>
            <Droplets size={20} color="#4D96FF" />
            <Text style={styles.sectionTitle}>{mt.hydrationTitle}</Text>
          </View>
          <Text style={styles.hydrationSubtext}>
            {waterCount} {mt.hydrationGlassesOf} {mealPlan.hydrationGoal} {mt.hydrationUnit}
          </Text>
          <View style={styles.hydrationGlassRow}>
            {Array.from({ length: mealPlan.hydrationGoal }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.hydrationGlass,
                  {
                    backgroundColor: i < waterCount ? "#4D96FF" : colors.borderLight,
                  },
                ]}
              >
                <Droplets size={14} color={i < waterCount ? "#FFFFFF" : colors.textTertiary} />
              </View>
            ))}
          </View>
          <View style={styles.hydrationButtons}>
            <TouchableOpacity
              style={[styles.hydrationButton, { backgroundColor: colors.borderLight }]}
              onPress={handleWaterDecrement}
              accessibilityLabel="Remove a glass of water"
              accessibilityRole="button"
            >
              <Minus size={18} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.hydrationButton, { backgroundColor: "#4D96FF" }]}
              onPress={handleWaterIncrement}
              accessibilityLabel="Add a glass of water"
              accessibilityRole="button"
            >
              <Droplets size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Key Nutrients */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{mt.keyNutrientsTitle}</Text>
          <View style={styles.tagRow}>
            {mealPlan.keyNutrients.map((nutrient, i) => (
              <View key={i} style={[styles.tagBadge, { backgroundColor: colors.statusGood + "15" }]}>
                <Check size={12} color={colors.statusGood} />
                <Text style={[styles.tagText, { color: colors.statusGood }]}>{nutrient}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Avoid List */}
        {mealPlan.avoidList.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{mt.avoidTitle}</Text>
            <View style={styles.tagRow}>
              {mealPlan.avoidList.map((item, i) => (
                <View key={i} style={[styles.tagBadge, { backgroundColor: colors.error + "15" }]}>
                  <AlertCircle size={12} color={colors.error} />
                  <Text style={[styles.tagText, { color: colors.error }]}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

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
      justifyContent: "center",
      alignItems: "center",
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

    // Phase banner
    phaseBanner: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 18,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03,
      shadowRadius: 6,
      elevation: 1,
    },
    phaseBadge: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
      marginBottom: 10,
    },
    phaseBadgeText: {
      fontSize: 13,
      fontWeight: "600",
    },
    phaseDescription: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 19,
    },

    // Meal cards
    mealCard: {
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 16,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03,
      shadowRadius: 4,
      elevation: 1,
    },
    mealCardHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    mealTypeIconBox: {
      width: 44,
      height: 44,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    mealCardHeaderText: {
      flex: 1,
    },
    mealTypeLabel: {
      fontSize: 11,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 2,
    },
    mealTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
    },
    mealCardChevron: {
      padding: 4,
    },
    mealCardBody: {
      marginTop: 14,
      paddingTop: 14,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.borderLight,
    },
    mealDescription: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 19,
      marginBottom: 12,
    },
    nutrientRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
    },
    nutrientBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    nutrientBadgeText: {
      fontSize: 11,
      fontWeight: "600",
    },

    // Section card
    sectionCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03,
      shadowRadius: 6,
      elevation: 1,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 12,
    },

    // Hydration
    hydrationHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 8,
    },
    hydrationSubtext: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 14,
    },
    hydrationGlassRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 14,
    },
    hydrationGlass: {
      width: 32,
      height: 32,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    hydrationButtons: {
      flexDirection: "row",
      gap: 12,
    },
    hydrationButton: {
      flex: 1,
      height: 40,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },

    // Tags
    tagRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    tagBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
    },
    tagText: {
      fontSize: 12,
      fontWeight: "600",
    },
  });
}

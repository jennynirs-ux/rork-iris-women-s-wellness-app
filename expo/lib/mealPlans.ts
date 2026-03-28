import { CyclePhase, DailyCheckIn, ScanResult } from "@/types";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface MealSuggestion {
  id: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  titleKey: string;
  descriptionKey: string;
  icon: string;
  nutrients: string[];        // key nutrients this meal provides
  phase: CyclePhase | "all";
  isAntiInflammatory: boolean;
}

export interface DailyMealPlan {
  phase: CyclePhase;
  phaseDay: number;
  meals: MealSuggestion[];
  hydrationGoal: number;      // glasses
  keyNutrients: string[];     // what to focus on today
  avoidList: string[];        // what to reduce
}

// ─── Meal Database ───────────────────────────────────────────────────────────

const MENSTRUAL_MEALS: MealSuggestion[] = [
  {
    id: "m-b1",
    mealType: "breakfast",
    titleKey: "meal.menstrual.breakfast1.title",
    descriptionKey: "meal.menstrual.breakfast1.description",
    icon: "Leaf",
    nutrients: ["Iron", "Vitamin C", "Fiber"],
    phase: "menstrual",
    isAntiInflammatory: true,
  },
  {
    id: "m-b2",
    mealType: "breakfast",
    titleKey: "meal.menstrual.breakfast2.title",
    descriptionKey: "meal.menstrual.breakfast2.description",
    icon: "Coffee",
    nutrients: ["Iron", "Magnesium", "B Vitamins"],
    phase: "menstrual",
    isAntiInflammatory: false,
  },
  {
    id: "m-l1",
    mealType: "lunch",
    titleKey: "meal.menstrual.lunch1.title",
    descriptionKey: "meal.menstrual.lunch1.description",
    icon: "Soup",
    nutrients: ["Iron", "Protein", "Zinc"],
    phase: "menstrual",
    isAntiInflammatory: true,
  },
  {
    id: "m-l2",
    mealType: "lunch",
    titleKey: "meal.menstrual.lunch2.title",
    descriptionKey: "meal.menstrual.lunch2.description",
    icon: "Salad",
    nutrients: ["Iron", "Vitamin C", "Folate"],
    phase: "menstrual",
    isAntiInflammatory: true,
  },
  {
    id: "m-d1",
    mealType: "dinner",
    titleKey: "meal.menstrual.dinner1.title",
    descriptionKey: "meal.menstrual.dinner1.description",
    icon: "Beef",
    nutrients: ["Iron", "Protein", "B12"],
    phase: "menstrual",
    isAntiInflammatory: false,
  },
  {
    id: "m-d2",
    mealType: "dinner",
    titleKey: "meal.menstrual.dinner2.title",
    descriptionKey: "meal.menstrual.dinner2.description",
    icon: "Soup",
    nutrients: ["Iron", "Fiber", "Vitamin A"],
    phase: "menstrual",
    isAntiInflammatory: true,
  },
  {
    id: "m-s1",
    mealType: "snack",
    titleKey: "meal.menstrual.snack1.title",
    descriptionKey: "meal.menstrual.snack1.description",
    icon: "Cookie",
    nutrients: ["Magnesium", "Iron", "Antioxidants"],
    phase: "menstrual",
    isAntiInflammatory: true,
  },
];

const FOLLICULAR_MEALS: MealSuggestion[] = [
  {
    id: "f-b1",
    mealType: "breakfast",
    titleKey: "meal.follicular.breakfast1.title",
    descriptionKey: "meal.follicular.breakfast1.description",
    icon: "Zap",
    nutrients: ["Protein", "Vitamin C", "Fiber"],
    phase: "follicular",
    isAntiInflammatory: true,
  },
  {
    id: "f-b2",
    mealType: "breakfast",
    titleKey: "meal.follicular.breakfast2.title",
    descriptionKey: "meal.follicular.breakfast2.description",
    icon: "Leaf",
    nutrients: ["Probiotics", "Protein", "Calcium"],
    phase: "follicular",
    isAntiInflammatory: true,
  },
  {
    id: "f-l1",
    mealType: "lunch",
    titleKey: "meal.follicular.lunch1.title",
    descriptionKey: "meal.follicular.lunch1.description",
    icon: "Salad",
    nutrients: ["Fiber", "Vitamin A", "Protein"],
    phase: "follicular",
    isAntiInflammatory: true,
  },
  {
    id: "f-l2",
    mealType: "lunch",
    titleKey: "meal.follicular.lunch2.title",
    descriptionKey: "meal.follicular.lunch2.description",
    icon: "Fish",
    nutrients: ["Probiotics", "Protein", "Omega-3"],
    phase: "follicular",
    isAntiInflammatory: true,
  },
  {
    id: "f-d1",
    mealType: "dinner",
    titleKey: "meal.follicular.dinner1.title",
    descriptionKey: "meal.follicular.dinner1.description",
    icon: "Salad",
    nutrients: ["Protein", "Iron", "B Vitamins"],
    phase: "follicular",
    isAntiInflammatory: false,
  },
  {
    id: "f-d2",
    mealType: "dinner",
    titleKey: "meal.follicular.dinner2.title",
    descriptionKey: "meal.follicular.dinner2.description",
    icon: "Fish",
    nutrients: ["Omega-3", "Protein", "Selenium"],
    phase: "follicular",
    isAntiInflammatory: true,
  },
  {
    id: "f-s1",
    mealType: "snack",
    titleKey: "meal.follicular.snack1.title",
    descriptionKey: "meal.follicular.snack1.description",
    icon: "Apple",
    nutrients: ["Probiotics", "Vitamin C", "Fiber"],
    phase: "follicular",
    isAntiInflammatory: true,
  },
];

const OVULATION_MEALS: MealSuggestion[] = [
  {
    id: "o-b1",
    mealType: "breakfast",
    titleKey: "meal.ovulation.breakfast1.title",
    descriptionKey: "meal.ovulation.breakfast1.description",
    icon: "Leaf",
    nutrients: ["Antioxidants", "Fiber", "Vitamin C"],
    phase: "ovulation",
    isAntiInflammatory: true,
  },
  {
    id: "o-b2",
    mealType: "breakfast",
    titleKey: "meal.ovulation.breakfast2.title",
    descriptionKey: "meal.ovulation.breakfast2.description",
    icon: "Egg",
    nutrients: ["Protein", "Omega-3", "Vitamin D"],
    phase: "ovulation",
    isAntiInflammatory: true,
  },
  {
    id: "o-l1",
    mealType: "lunch",
    titleKey: "meal.ovulation.lunch1.title",
    descriptionKey: "meal.ovulation.lunch1.description",
    icon: "Salad",
    nutrients: ["Fiber", "Antioxidants", "Vitamin K"],
    phase: "ovulation",
    isAntiInflammatory: true,
  },
  {
    id: "o-l2",
    mealType: "lunch",
    titleKey: "meal.ovulation.lunch2.title",
    descriptionKey: "meal.ovulation.lunch2.description",
    icon: "Fish",
    nutrients: ["Omega-3", "Protein", "Vitamin D"],
    phase: "ovulation",
    isAntiInflammatory: true,
  },
  {
    id: "o-d1",
    mealType: "dinner",
    titleKey: "meal.ovulation.dinner1.title",
    descriptionKey: "meal.ovulation.dinner1.description",
    icon: "Fish",
    nutrients: ["Omega-3", "Protein", "Selenium"],
    phase: "ovulation",
    isAntiInflammatory: true,
  },
  {
    id: "o-d2",
    mealType: "dinner",
    titleKey: "meal.ovulation.dinner2.title",
    descriptionKey: "meal.ovulation.dinner2.description",
    icon: "Salad",
    nutrients: ["Fiber", "Vitamin A", "Antioxidants"],
    phase: "ovulation",
    isAntiInflammatory: true,
  },
  {
    id: "o-s1",
    mealType: "snack",
    titleKey: "meal.ovulation.snack1.title",
    descriptionKey: "meal.ovulation.snack1.description",
    icon: "Cherry",
    nutrients: ["Antioxidants", "Vitamin C", "Fiber"],
    phase: "ovulation",
    isAntiInflammatory: true,
  },
];

const LUTEAL_MEALS: MealSuggestion[] = [
  {
    id: "l-b1",
    mealType: "breakfast",
    titleKey: "meal.luteal.breakfast1.title",
    descriptionKey: "meal.luteal.breakfast1.description",
    icon: "Wheat",
    nutrients: ["Complex Carbs", "Fiber", "Magnesium"],
    phase: "luteal",
    isAntiInflammatory: false,
  },
  {
    id: "l-b2",
    mealType: "breakfast",
    titleKey: "meal.luteal.breakfast2.title",
    descriptionKey: "meal.luteal.breakfast2.description",
    icon: "Egg",
    nutrients: ["Protein", "B Vitamins", "Magnesium"],
    phase: "luteal",
    isAntiInflammatory: false,
  },
  {
    id: "l-l1",
    mealType: "lunch",
    titleKey: "meal.luteal.lunch1.title",
    descriptionKey: "meal.luteal.lunch1.description",
    icon: "Salad",
    nutrients: ["Complex Carbs", "Protein", "Fiber"],
    phase: "luteal",
    isAntiInflammatory: false,
  },
  {
    id: "l-l2",
    mealType: "lunch",
    titleKey: "meal.luteal.lunch2.title",
    descriptionKey: "meal.luteal.lunch2.description",
    icon: "Soup",
    nutrients: ["Magnesium", "Fiber", "Vitamin A"],
    phase: "luteal",
    isAntiInflammatory: true,
  },
  {
    id: "l-d1",
    mealType: "dinner",
    titleKey: "meal.luteal.dinner1.title",
    descriptionKey: "meal.luteal.dinner1.description",
    icon: "Fish",
    nutrients: ["Omega-3", "Protein", "Magnesium"],
    phase: "luteal",
    isAntiInflammatory: true,
  },
  {
    id: "l-d2",
    mealType: "dinner",
    titleKey: "meal.luteal.dinner2.title",
    descriptionKey: "meal.luteal.dinner2.description",
    icon: "Soup",
    nutrients: ["Complex Carbs", "Fiber", "B6"],
    phase: "luteal",
    isAntiInflammatory: true,
  },
  {
    id: "l-s1",
    mealType: "snack",
    titleKey: "meal.luteal.snack1.title",
    descriptionKey: "meal.luteal.snack1.description",
    icon: "Cookie",
    nutrients: ["Magnesium", "Healthy Fats", "Antioxidants"],
    phase: "luteal",
    isAntiInflammatory: false,
  },
];

const PHASE_MEALS: Record<CyclePhase, MealSuggestion[]> = {
  menstrual: MENSTRUAL_MEALS,
  follicular: FOLLICULAR_MEALS,
  ovulation: OVULATION_MEALS,
  luteal: LUTEAL_MEALS,
};

// ─── Phase Nutrition Info ────────────────────────────────────────────────────

const PHASE_NUTRIENTS: Record<CyclePhase, string[]> = {
  menstrual: ["Iron", "Vitamin C", "Magnesium", "Zinc", "B12"],
  follicular: ["Vitamin C", "Probiotics", "Lean Protein", "Fiber", "B Vitamins"],
  ovulation: ["Antioxidants", "Omega-3", "Fiber", "Vitamin D", "Selenium"],
  luteal: ["Magnesium", "Complex Carbs", "B6", "Omega-3", "Fiber"],
};

const PHASE_AVOID: Record<CyclePhase, string[]> = {
  menstrual: ["Excess caffeine", "Salty processed foods", "Alcohol", "Refined sugar"],
  follicular: ["Heavy fried foods", "Excess dairy", "Processed snacks"],
  ovulation: ["Inflammatory oils", "Excess sugar", "Processed meats"],
  luteal: ["Excess caffeine", "Refined sugar", "Alcohol", "Excess sodium"],
};

const BASE_HYDRATION = 8; // glasses

// ─── Helpers ─────────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  if (isNaN(value)) return min;
  return Math.max(min, Math.min(max, value));
}

/**
 * Deterministic daily selection: pick meals based on phase day to rotate variety.
 */
function selectMealsForDay(
  meals: MealSuggestion[],
  phaseDay: number,
): { breakfast: MealSuggestion; lunch: MealSuggestion; dinner: MealSuggestion; snack: MealSuggestion } {
  const breakfasts = meals.filter((m) => m.mealType === "breakfast");
  const lunches = meals.filter((m) => m.mealType === "lunch");
  const dinners = meals.filter((m) => m.mealType === "dinner");
  const snacks = meals.filter((m) => m.mealType === "snack");

  const pick = <T,>(arr: T[], day: number): T => arr[day % Math.max(arr.length, 1)];

  return {
    breakfast: pick(breakfasts, phaseDay),
    lunch: pick(lunches, phaseDay),
    dinner: pick(dinners, phaseDay),
    snack: pick(snacks, phaseDay),
  };
}

// ─── Main Function ───────────────────────────────────────────────────────────

/**
 * Generate a daily meal plan based on current cycle phase, scan results,
 * and check-in data.
 */
export function generateDailyMealPlan(
  phase: CyclePhase,
  phaseDay: number,
  latestScan: ScanResult | null,
  todayCheckIn: DailyCheckIn | null,
): DailyMealPlan {
  const phaseMeals = PHASE_MEALS[phase] || PHASE_MEALS.follicular;
  const selected = selectMealsForDay(phaseMeals, phaseDay);

  let meals = [selected.breakfast, selected.lunch, selected.dinner, selected.snack];

  // ── Scan-based adjustments ──────────────────────────────────────────────

  let hydrationGoal = BASE_HYDRATION;
  const keyNutrients = [...PHASE_NUTRIENTS[phase]];
  const avoidList = [...PHASE_AVOID[phase]];

  if (latestScan) {
    // High inflammation: prefer anti-inflammatory meals
    const inflammation = latestScan.inflammation ?? 0;
    if (inflammation >= 6) {
      const antiInflamMeals = phaseMeals.filter((m) => m.isAntiInflammatory);
      if (antiInflamMeals.length >= 4) {
        const antiSelected = selectMealsForDay(antiInflamMeals, phaseDay);
        meals = [antiSelected.breakfast, antiSelected.lunch, antiSelected.dinner, antiSelected.snack];
      }
      if (!keyNutrients.includes("Omega-3")) keyNutrients.push("Omega-3");
      if (!keyNutrients.includes("Antioxidants")) keyNutrients.push("Antioxidants");
      if (!avoidList.includes("Inflammatory oils")) avoidList.push("Inflammatory oils");
    }

    // Low hydration: increase hydration goal
    const hydration = latestScan.hydrationLevel ?? 5;
    if (hydration < 4) {
      hydrationGoal = 10;
    } else if (hydration < 6) {
      hydrationGoal = 9;
    }
  }

  // ── Check-in adjustments ────────────────────────────────────────────────

  if (todayCheckIn) {
    // Poor sleep: add sleep-supporting nutrient note
    const sleep = todayCheckIn.sleep ?? 5;
    if (sleep < 4) {
      if (!keyNutrients.includes("Magnesium")) keyNutrients.push("Magnesium");
      if (!keyNutrients.includes("Tryptophan")) keyNutrients.push("Tryptophan");
      if (!avoidList.includes("Caffeine after noon")) avoidList.push("Caffeine after noon");
    }

    // High stress
    const stressLevel = todayCheckIn.stressLevel ?? 5;
    if (stressLevel >= 7) {
      if (!keyNutrients.includes("B Vitamins")) keyNutrients.push("B Vitamins");
      if (!keyNutrients.includes("Vitamin C")) keyNutrients.push("Vitamin C");
    }

    // Low energy
    const energy = todayCheckIn.energy ?? 5;
    if (energy < 4) {
      if (!keyNutrients.includes("Iron")) keyNutrients.push("Iron");
      if (!keyNutrients.includes("Complex Carbs")) keyNutrients.push("Complex Carbs");
    }
  }

  return {
    phase,
    phaseDay: clamp(phaseDay, 1, 99),
    meals,
    hydrationGoal,
    keyNutrients: keyNutrients.slice(0, 6), // cap at 6
    avoidList: avoidList.slice(0, 5),         // cap at 5
  };
}

/**
 * Get all meals for a specific phase (for browsing).
 */
export function getMealsForPhase(phase: CyclePhase): MealSuggestion[] {
  return PHASE_MEALS[phase] || [];
}

/**
 * Get phase nutrition summary.
 */
export function getPhaseNutritionSummary(phase: CyclePhase): {
  keyNutrients: string[];
  avoidList: string[];
} {
  return {
    keyNutrients: PHASE_NUTRIENTS[phase] || [],
    avoidList: PHASE_AVOID[phase] || [],
  };
}

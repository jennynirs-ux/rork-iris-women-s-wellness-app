import { CyclePhase, DailyCheckIn, ScanResult, HealthData } from "@/types";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface MealRecipe {
  ingredients: string[];    // "1 cup spinach", "2 eggs", etc.
  steps: string[];          // "Heat pan...", "Add eggs..."
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
}

export interface MealSuggestion {
  id: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  titleKey: string;
  descriptionKey: string;
  icon: string;
  nutrients: string[];        // key nutrients this meal provides
  phase: CyclePhase | "all";
  isAntiInflammatory: boolean;
  recipe?: MealRecipe;
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
    recipe: {
      ingredients: ["2 cups fresh spinach", "1 cup mixed berries", "1 banana", "1 tbsp almond butter", "1/2 cup orange juice", "1/2 cup water"],
      steps: ["Add spinach, berries, and banana to a blender.", "Pour in orange juice and water.", "Blend until smooth, about 60 seconds.", "Pour into a bowl and top with almond butter."],
      prepMinutes: 5,
      cookMinutes: 0,
      servings: 1,
    },
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
    recipe: {
      ingredients: ["1/2 cup steel-cut oats", "1 cup water", "4 chopped dates", "2 tbsp walnuts", "1 tsp honey", "Pinch of cinnamon"],
      steps: ["Bring water to a boil and stir in oats.", "Reduce heat and simmer for 15 minutes, stirring occasionally.", "Top with chopped dates, walnuts, honey, and cinnamon.", "Serve warm."],
      prepMinutes: 2,
      cookMinutes: 15,
      servings: 1,
    },
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
    recipe: {
      ingredients: ["1 cup red lentils", "2 carrots, diced", "2 celery stalks, diced", "1 tsp turmeric", "1 tsp cumin", "4 cups vegetable broth"],
      steps: ["Saute carrots and celery in a pot with a little olive oil for 3 minutes.", "Add turmeric and cumin, stir for 30 seconds.", "Pour in broth and lentils, bring to a boil.", "Reduce heat and simmer for 20 minutes until lentils are soft.", "Season with salt and pepper to taste."],
      prepMinutes: 10,
      cookMinutes: 25,
      servings: 2,
    },
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
    recipe: {
      ingredients: ["3 cups fresh spinach", "1 can chickpeas, drained", "1 bell pepper, sliced", "2 tbsp tahini", "1 tbsp lemon juice", "Salt and pepper"],
      steps: ["Roast chickpeas at 200C/400F for 20 minutes until crispy.", "Arrange spinach on a plate and top with bell pepper.", "Add roasted chickpeas on top.", "Whisk tahini with lemon juice and drizzle over the salad."],
      prepMinutes: 5,
      cookMinutes: 20,
      servings: 1,
    },
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
    recipe: {
      ingredients: ["200g grass-fed beef strips", "1 cup broccoli florets", "1 cup snap peas", "2 tbsp soy sauce", "1 tsp fresh ginger, grated", "1 cup cooked brown rice"],
      steps: ["Cook brown rice according to package directions.", "Heat oil in a wok or large pan over high heat.", "Stir-fry beef strips for 3 minutes until browned.", "Add broccoli, snap peas, ginger, and soy sauce.", "Cook for 4 more minutes and serve over rice."],
      prepMinutes: 10,
      cookMinutes: 20,
      servings: 2,
    },
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
    recipe: {
      ingredients: ["1 sweet potato, cubed", "2 carrots, chopped", "1 parsnip, chopped", "2 cups kale, chopped", "1 can white beans, drained", "4 cups vegetable broth"],
      steps: ["Add sweet potato, carrots, parsnip, and broth to a large pot.", "Bring to a boil, then reduce to a simmer for 20 minutes.", "Stir in kale and white beans.", "Cook for 5 more minutes until kale is tender.", "Season with salt, pepper, and a pinch of thyme."],
      prepMinutes: 10,
      cookMinutes: 25,
      servings: 3,
    },
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
    recipe: {
      ingredients: ["2 squares 70% dark chocolate", "2 tbsp pumpkin seeds", "2 tbsp dried apricots, chopped"],
      steps: ["Break chocolate into small pieces.", "Combine with pumpkin seeds and chopped apricots.", "Enjoy as a quick snack."],
      prepMinutes: 2,
      cookMinutes: 0,
      servings: 1,
    },
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
    recipe: {
      ingredients: ["1 cup kale, chopped", "1/2 cup pineapple chunks", "1 tsp fresh ginger", "1 scoop protein powder", "1 cup coconut water"],
      steps: ["Add all ingredients to a blender.", "Blend on high until smooth.", "Pour into a glass and serve immediately."],
      prepMinutes: 5,
      cookMinutes: 0,
      servings: 1,
    },
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
    recipe: {
      ingredients: ["1 cup Greek yogurt", "1/4 cup granola", "1/2 cup fresh berries", "1 tbsp chia seeds", "1 tsp honey"],
      steps: ["Spoon yogurt into a bowl or glass.", "Layer with granola and fresh berries.", "Sprinkle chia seeds on top and drizzle with honey."],
      prepMinutes: 5,
      cookMinutes: 0,
      servings: 1,
    },
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
    recipe: {
      ingredients: ["1/2 cup quinoa", "1/2 sweet potato, cubed", "1/2 cup edamame", "1 carrot, shredded", "1/2 avocado, sliced", "2 tbsp ginger-sesame dressing"],
      steps: ["Cook quinoa according to package directions and let cool.", "Roast sweet potato cubes at 200C/400F for 20 minutes.", "Arrange quinoa in a bowl, top with sweet potato, edamame, carrot, and avocado.", "Drizzle with ginger-sesame dressing."],
      prepMinutes: 10,
      cookMinutes: 20,
      servings: 1,
    },
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
    recipe: {
      ingredients: ["150g salmon fillet", "1/2 cup brown rice, cooked", "1/4 cup kimchi", "1/2 cucumber, sliced", "1 tbsp soy sauce", "1 tsp sesame oil"],
      steps: ["Season salmon with soy sauce and grill for 4 minutes per side.", "Arrange brown rice in a bowl.", "Top with grilled salmon, kimchi, and cucumber.", "Drizzle with sesame oil."],
      prepMinutes: 5,
      cookMinutes: 10,
      servings: 1,
    },
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
    recipe: {
      ingredients: ["200g ground turkey", "4 large lettuce leaves", "1/2 mango, diced", "1/2 avocado, sliced", "1 lime, juiced", "1 tbsp olive oil"],
      steps: ["Heat olive oil in a pan and cook ground turkey until browned.", "Season with salt, pepper, and a squeeze of lime.", "Spoon turkey into lettuce cups.", "Top with diced mango and avocado slices."],
      prepMinutes: 10,
      cookMinutes: 10,
      servings: 2,
    },
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
    recipe: {
      ingredients: ["200g cod fillet", "1 bunch asparagus", "1 lemon", "2 tbsp mixed herbs", "1 tbsp olive oil", "Salt and pepper"],
      steps: ["Preheat oven to 200C/400F.", "Place cod on a baking sheet, drizzle with olive oil, and season with herbs, salt, and pepper.", "Arrange asparagus around the fish and squeeze lemon over everything.", "Bake for 15 minutes until fish flakes easily."],
      prepMinutes: 5,
      cookMinutes: 15,
      servings: 2,
    },
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
    recipe: {
      ingredients: ["2 carrots, cut into sticks", "2 celery stalks, cut into sticks", "2 tbsp sauerkraut", "2 tbsp hummus"],
      steps: ["Cut carrots and celery into sticks.", "Arrange on a plate with sauerkraut and hummus.", "Dip and enjoy."],
      prepMinutes: 5,
      cookMinutes: 0,
      servings: 1,
    },
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
    recipe: {
      ingredients: ["1 packet acai puree", "1/2 cup blueberries", "1/2 cup strawberries", "2 tbsp hemp seeds", "2 tbsp coconut flakes", "1/2 cup almond milk"],
      steps: ["Blend acai puree with almond milk until thick and smooth.", "Pour into a bowl.", "Top with blueberries, strawberries, hemp seeds, and coconut flakes."],
      prepMinutes: 5,
      cookMinutes: 0,
      servings: 1,
    },
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
    recipe: {
      ingredients: ["2 slices whole grain bread", "1 ripe avocado", "2 eggs", "1 tsp everything seasoning", "Salt and pepper"],
      steps: ["Toast bread until golden.", "Mash avocado and spread on toast.", "Poach eggs in simmering water for 3 minutes.", "Place eggs on avocado toast and sprinkle with everything seasoning."],
      prepMinutes: 5,
      cookMinutes: 5,
      servings: 1,
    },
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
    recipe: {
      ingredients: ["4 large collard green leaves", "1/4 cup hummus", "1 small beet, shredded", "1 carrot, shredded", "1/2 cup sprouts", "2 tbsp sunflower seeds"],
      steps: ["Trim thick stems from collard leaves.", "Spread hummus across each leaf.", "Layer shredded beet, carrot, and sprouts on top.", "Sprinkle with sunflower seeds, roll tightly, and slice in half."],
      prepMinutes: 10,
      cookMinutes: 0,
      servings: 2,
    },
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
    recipe: {
      ingredients: ["150g wild salmon fillet", "3 cups mixed greens", "1/2 cup cherry tomatoes, halved", "2 tbsp walnuts", "2 tbsp olive oil", "1 tbsp lemon juice"],
      steps: ["Season salmon with salt and pepper, then grill for 4 minutes per side.", "Arrange mixed greens on a plate with cherry tomatoes and walnuts.", "Flake grilled salmon over the salad.", "Whisk olive oil with lemon juice and drizzle over the top."],
      prepMinutes: 5,
      cookMinutes: 10,
      servings: 1,
    },
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
    recipe: {
      ingredients: ["200g salmon fillet", "1 cup brussels sprouts, halved", "1 medium sweet potato, cubed", "2 tbsp olive oil", "2 cloves garlic, minced", "Salt and pepper"],
      steps: ["Preheat oven to 200C/400F.", "Toss brussels sprouts and sweet potato with olive oil, garlic, salt, and pepper on a baking sheet.", "Place salmon on the same sheet.", "Bake for 18 minutes until salmon is cooked through and vegetables are tender."],
      prepMinutes: 10,
      cookMinutes: 18,
      servings: 2,
    },
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
    recipe: {
      ingredients: ["4 bell peppers, tops removed and seeded", "1 cup cooked quinoa", "1/2 cup cherry tomatoes, diced", "1/4 cup olives, sliced", "1/4 cup feta cheese", "2 tbsp fresh herbs (basil, parsley)"],
      steps: ["Preheat oven to 190C/375F.", "Mix quinoa, tomatoes, olives, feta, and herbs in a bowl.", "Stuff mixture into bell peppers.", "Place in a baking dish and bake for 25 minutes."],
      prepMinutes: 10,
      cookMinutes: 25,
      servings: 4,
    },
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
    recipe: {
      ingredients: ["1/2 cup blueberries", "1/2 cup raspberries", "1/2 cup strawberries", "1 lime wedge"],
      steps: ["Rinse all berries.", "Combine in a cup or small bowl.", "Squeeze lime over the top and enjoy."],
      prepMinutes: 3,
      cookMinutes: 0,
      servings: 1,
    },
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
    recipe: {
      ingredients: ["1/2 cup mashed sweet potato", "1/2 cup oat flour", "1 egg", "1 tsp cinnamon", "1 tbsp maple syrup", "1 tbsp coconut oil"],
      steps: ["Mix mashed sweet potato, oat flour, egg, and cinnamon into a batter.", "Heat coconut oil in a pan over medium heat.", "Pour small rounds of batter and cook 2 minutes per side.", "Drizzle with maple syrup and serve."],
      prepMinutes: 5,
      cookMinutes: 10,
      servings: 2,
    },
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
    recipe: {
      ingredients: ["2 eggs", "1 slice whole grain bread", "1/2 avocado", "1 tbsp pumpkin seeds", "Salt and pepper"],
      steps: ["Toast bread until golden.", "Scramble eggs in a pan with a bit of oil.", "Mash avocado on toast and top with scrambled eggs.", "Sprinkle pumpkin seeds on top."],
      prepMinutes: 3,
      cookMinutes: 5,
      servings: 1,
    },
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
    recipe: {
      ingredients: ["1 medium sweet potato", "1/2 cup cooked quinoa", "1/2 cup black beans", "1/4 cup corn", "2 tbsp Greek yogurt", "1 tsp cumin"],
      steps: ["Bake sweet potato at 200C/400F for 40 minutes until tender.", "Mix quinoa, black beans, corn, and cumin together.", "Split sweet potato open and stuff with the quinoa mixture.", "Top with a dollop of Greek yogurt."],
      prepMinutes: 5,
      cookMinutes: 40,
      servings: 1,
    },
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
    recipe: {
      ingredients: ["1 medium butternut squash, cubed", "1 onion, diced", "3 cups vegetable broth", "1/4 tsp nutmeg", "2 tbsp coconut cream", "1 tbsp olive oil"],
      steps: ["Saute onion in olive oil until soft.", "Add cubed squash and broth, bring to a boil.", "Simmer 20 minutes until squash is tender.", "Blend until smooth, stir in nutmeg, and top with coconut cream."],
      prepMinutes: 10,
      cookMinutes: 25,
      servings: 3,
    },
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
    recipe: {
      ingredients: ["200g salmon fillet", "1/2 cup quinoa", "2 tbsp toasted almonds", "1 tbsp olive oil", "1 tbsp fresh dill", "1 lemon"],
      steps: ["Cook quinoa according to package directions.", "Season salmon with olive oil, salt, and pepper.", "Bake salmon at 200C/400F for 14 minutes.", "Fluff quinoa with dill and toasted almonds, serve alongside salmon with a lemon squeeze."],
      prepMinutes: 5,
      cookMinutes: 15,
      servings: 2,
    },
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
    recipe: {
      ingredients: ["1 can chickpeas, drained", "1 cup spinach", "1 can coconut milk", "1 tbsp turmeric", "1 tsp cumin", "1 cup cooked brown rice"],
      steps: ["Heat a pot and add coconut milk, turmeric, and cumin.", "Add chickpeas and simmer for 10 minutes.", "Stir in spinach until wilted.", "Serve over brown rice."],
      prepMinutes: 5,
      cookMinutes: 15,
      servings: 2,
    },
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
    recipe: {
      ingredients: ["2 squares dark chocolate", "2 tbsp raw almonds"],
      steps: ["Break chocolate into pieces.", "Pair with almonds and enjoy."],
      prepMinutes: 1,
      cookMinutes: 0,
      servings: 1,
    },
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

// ─── Life-stage Meal Database ───────────────────────────────────────────────

const PREGNANCY_MEALS: MealSuggestion[] = [
  {
    id: "preg-b1",
    mealType: "breakfast",
    titleKey: "meal.pregnancy.breakfast1.title",
    descriptionKey: "meal.pregnancy.breakfast1.description",
    icon: "Leaf",
    nutrients: ["Folate", "Iron", "Fiber"],
    phase: "menstrual",
    isAntiInflammatory: true,
    recipe: {
      ingredients: ["2 eggs", "1 cup fresh spinach", "1/4 cup cooked red lentils", "1 slice whole grain toast", "1 tsp olive oil", "Salt and pepper"],
      steps: ["Heat olive oil in a pan and saute spinach until wilted.", "Add lentils and stir to combine.", "Scramble in the eggs and cook until set.", "Serve on whole grain toast."],
      prepMinutes: 5,
      cookMinutes: 8,
      servings: 1,
    },
  },
  {
    id: "preg-b2",
    mealType: "breakfast",
    titleKey: "meal.pregnancy.breakfast2.title",
    descriptionKey: "meal.pregnancy.breakfast2.description",
    icon: "Egg",
    nutrients: ["Protein", "Calcium", "Vitamin D"],
    phase: "menstrual",
    isAntiInflammatory: false,
    recipe: {
      ingredients: ["1 cup Greek yogurt", "2 tbsp sliced almonds", "2 dried figs, chopped", "1 tsp honey"],
      steps: ["Spoon yogurt into a bowl.", "Top with sliced almonds and chopped figs.", "Drizzle with honey."],
      prepMinutes: 3,
      cookMinutes: 0,
      servings: 1,
    },
  },
  {
    id: "preg-l1",
    mealType: "lunch",
    titleKey: "meal.pregnancy.lunch1.title",
    descriptionKey: "meal.pregnancy.lunch1.description",
    icon: "Salad",
    nutrients: ["Folate", "Iron", "Vitamin C"],
    phase: "menstrual",
    isAntiInflammatory: true,
    recipe: {
      ingredients: ["3 cups mixed greens", "1/2 cup warm lentils", "1 small beet, roasted and sliced", "1/2 bell pepper, diced", "2 tbsp lemon vinaigrette"],
      steps: ["Arrange mixed greens on a plate.", "Top with warm lentils, roasted beet slices, and bell pepper.", "Drizzle with lemon vinaigrette."],
      prepMinutes: 10,
      cookMinutes: 0,
      servings: 1,
    },
  },
  {
    id: "preg-l2",
    mealType: "lunch",
    titleKey: "meal.pregnancy.lunch2.title",
    descriptionKey: "meal.pregnancy.lunch2.description",
    icon: "Soup",
    nutrients: ["Protein", "Fiber", "Iron"],
    phase: "menstrual",
    isAntiInflammatory: true,
    recipe: {
      ingredients: ["1 can white beans, drained", "2 cups kale, chopped", "1 carrot, diced", "4 cups vegetable broth", "1 slice whole grain bread"],
      steps: ["Add broth, beans, carrot, and kale to a pot.", "Bring to a boil, then simmer for 15 minutes.", "Season with salt and pepper.", "Serve with whole grain bread."],
      prepMinutes: 5,
      cookMinutes: 15,
      servings: 2,
    },
  },
  {
    id: "preg-d1",
    mealType: "dinner",
    titleKey: "meal.pregnancy.dinner1.title",
    descriptionKey: "meal.pregnancy.dinner1.description",
    icon: "Fish",
    nutrients: ["Omega-3", "Protein", "DHA"],
    phase: "menstrual",
    isAntiInflammatory: true,
    recipe: {
      ingredients: ["200g wild-caught salmon fillet", "1 medium sweet potato, cubed", "1 cup broccoli florets", "1 tbsp olive oil", "1 lemon", "Salt and pepper"],
      steps: ["Preheat oven to 200C/400F.", "Toss sweet potato and broccoli with olive oil and season.", "Place salmon on the baking sheet alongside vegetables.", "Bake for 18 minutes, squeeze lemon over salmon before serving."],
      prepMinutes: 10,
      cookMinutes: 18,
      servings: 2,
    },
  },
  {
    id: "preg-d2",
    mealType: "dinner",
    titleKey: "meal.pregnancy.dinner2.title",
    descriptionKey: "meal.pregnancy.dinner2.description",
    icon: "Leaf",
    nutrients: ["Iron", "Calcium", "Protein"],
    phase: "menstrual",
    isAntiInflammatory: false,
    recipe: {
      ingredients: ["200g lean beef strips", "2 cups spinach", "1 cup calcium-fortified rice, cooked", "1 tbsp soy sauce", "1 clove garlic, minced"],
      steps: ["Heat a pan and cook beef strips with garlic until browned.", "Add soy sauce and stir.", "Add spinach and cook until just wilted.", "Serve over calcium-fortified rice."],
      prepMinutes: 5,
      cookMinutes: 10,
      servings: 2,
    },
  },
  {
    id: "preg-s1",
    mealType: "snack",
    titleKey: "meal.pregnancy.snack1.title",
    descriptionKey: "meal.pregnancy.snack1.description",
    icon: "Apple",
    nutrients: ["Calcium", "Protein", "Omega-3"],
    phase: "menstrual",
    isAntiInflammatory: true,
    recipe: {
      ingredients: ["1/2 cup yogurt", "2 tbsp crushed walnuts", "1 tbsp ground flaxseed"],
      steps: ["Spoon yogurt into a small bowl.", "Top with crushed walnuts and ground flaxseed.", "Stir gently and enjoy."],
      prepMinutes: 2,
      cookMinutes: 0,
      servings: 1,
    },
  },
];

const POSTPARTUM_MEALS: MealSuggestion[] = [
  {
    id: "pp-b1",
    mealType: "breakfast",
    titleKey: "meal.postpartum.breakfast1.title",
    descriptionKey: "meal.postpartum.breakfast1.description",
    icon: "Egg",
    nutrients: ["Iron", "Protein", "B12"],
    phase: "menstrual",
    isAntiInflammatory: false,
    recipe: {
      ingredients: ["2 eggs", "1 cup spinach", "1 slice iron-fortified toast", "1 tsp butter", "Salt and pepper"],
      steps: ["Melt butter in a pan and wilt spinach.", "Scramble eggs into the spinach.", "Serve on iron-fortified toast."],
      prepMinutes: 3,
      cookMinutes: 5,
      servings: 1,
    },
  },
  {
    id: "pp-b2",
    mealType: "breakfast",
    titleKey: "meal.postpartum.breakfast2.title",
    descriptionKey: "meal.postpartum.breakfast2.description",
    icon: "Leaf",
    nutrients: ["Omega-3", "Fiber", "Iron"],
    phase: "menstrual",
    isAntiInflammatory: true,
    recipe: {
      ingredients: ["1/2 cup rolled oats", "1/2 cup milk", "1 tbsp chia seeds", "2 tbsp walnuts", "1 banana, sliced"],
      steps: ["Combine oats, milk, and chia seeds in a jar.", "Refrigerate overnight.", "In the morning, top with walnuts and banana slices."],
      prepMinutes: 5,
      cookMinutes: 0,
      servings: 1,
    },
  },
  {
    id: "pp-l1",
    mealType: "lunch",
    titleKey: "meal.postpartum.lunch1.title",
    descriptionKey: "meal.postpartum.lunch1.description",
    icon: "Soup",
    nutrients: ["Protein", "Iron", "Collagen"],
    phase: "menstrual",
    isAntiInflammatory: true,
    recipe: {
      ingredients: ["2 cups bone broth", "1 cup shredded chicken", "1 small sweet potato, cubed", "1 cup greens (kale or spinach)", "Salt and pepper"],
      steps: ["Bring bone broth to a simmer.", "Add sweet potato and cook for 10 minutes.", "Stir in shredded chicken and greens.", "Cook 3 more minutes and season to taste."],
      prepMinutes: 5,
      cookMinutes: 15,
      servings: 1,
    },
  },
  {
    id: "pp-l2",
    mealType: "lunch",
    titleKey: "meal.postpartum.lunch2.title",
    descriptionKey: "meal.postpartum.lunch2.description",
    icon: "Salad",
    nutrients: ["Iron", "Vitamin C", "Fiber"],
    phase: "menstrual",
    isAntiInflammatory: true,
    recipe: {
      ingredients: ["1/2 cup quinoa, cooked", "2 cups baby spinach", "1/2 cup roasted chickpeas", "2 tbsp lemon dressing", "Salt and pepper"],
      steps: ["Arrange spinach in a bowl.", "Top with quinoa and roasted chickpeas.", "Drizzle with lemon dressing and season."],
      prepMinutes: 5,
      cookMinutes: 0,
      servings: 1,
    },
  },
  {
    id: "pp-d1",
    mealType: "dinner",
    titleKey: "meal.postpartum.dinner1.title",
    descriptionKey: "meal.postpartum.dinner1.description",
    icon: "Fish",
    nutrients: ["Omega-3", "Protein", "Vitamin D"],
    phase: "menstrual",
    isAntiInflammatory: true,
    recipe: {
      ingredients: ["200g salmon fillet", "1 cup mixed root vegetables, cubed", "1 tbsp olive oil", "1 tsp rosemary", "Salt and pepper"],
      steps: ["Preheat oven to 200C/400F.", "Toss root vegetables with olive oil and rosemary.", "Place salmon and vegetables on a baking sheet.", "Bake for 18 minutes."],
      prepMinutes: 10,
      cookMinutes: 18,
      servings: 2,
    },
  },
  {
    id: "pp-d2",
    mealType: "dinner",
    titleKey: "meal.postpartum.dinner2.title",
    descriptionKey: "meal.postpartum.dinner2.description",
    icon: "Beef",
    nutrients: ["Iron", "Protein", "Zinc"],
    phase: "menstrual",
    isAntiInflammatory: false,
    recipe: {
      ingredients: ["300g stewing beef, cubed", "2 carrots, chopped", "2 potatoes, cubed", "3 cups beef broth", "1 tsp mixed herbs", "1 tbsp olive oil"],
      steps: ["Brown beef in olive oil in a large pot.", "Add carrots, potatoes, broth, and herbs.", "Bring to a boil, then reduce heat.", "Simmer for 45 minutes until beef is tender."],
      prepMinutes: 10,
      cookMinutes: 50,
      servings: 3,
    },
  },
  {
    id: "pp-s1",
    mealType: "snack",
    titleKey: "meal.postpartum.snack1.title",
    descriptionKey: "meal.postpartum.snack1.description",
    icon: "Cookie",
    nutrients: ["Omega-3", "Magnesium", "Healthy Fats"],
    phase: "menstrual",
    isAntiInflammatory: true,
    recipe: {
      ingredients: ["2 tbsp walnuts", "2 tbsp pumpkin seeds", "2 tbsp dark chocolate chips"],
      steps: ["Combine all ingredients in a small bowl.", "Mix and enjoy as a quick energy snack."],
      prepMinutes: 1,
      cookMinutes: 0,
      servings: 1,
    },
  },
];

const PERIMENOPAUSE_MEALS: MealSuggestion[] = [
  {
    id: "peri-b1",
    mealType: "breakfast",
    titleKey: "meal.perimenopause.breakfast1.title",
    descriptionKey: "meal.perimenopause.breakfast1.description",
    icon: "Leaf",
    nutrients: ["Phytoestrogens", "Fiber", "Calcium"],
    phase: "menstrual",
    isAntiInflammatory: true,
    recipe: {
      ingredients: ["1 cup soy milk", "1 tbsp ground flaxseed", "1 banana", "1/2 cup mixed berries", "1 tsp honey"],
      steps: ["Add soy milk, flaxseed, banana, and berries to a blender.", "Blend until smooth.", "Sweeten with honey and serve."],
      prepMinutes: 5,
      cookMinutes: 0,
      servings: 1,
    },
  },
  {
    id: "peri-b2",
    mealType: "breakfast",
    titleKey: "meal.perimenopause.breakfast2.title",
    descriptionKey: "meal.perimenopause.breakfast2.description",
    icon: "Egg",
    nutrients: ["Protein", "Vitamin D", "Calcium"],
    phase: "menstrual",
    isAntiInflammatory: false,
    recipe: {
      ingredients: ["2 eggs", "1 slice fortified whole grain toast", "1 slice calcium-rich cheese", "Salt and pepper"],
      steps: ["Poach eggs in simmering water for 3 minutes.", "Toast the bread and place cheese on top.", "Set poached eggs on the toast and season."],
      prepMinutes: 3,
      cookMinutes: 5,
      servings: 1,
    },
  },
  {
    id: "peri-l1",
    mealType: "lunch",
    titleKey: "meal.perimenopause.lunch1.title",
    descriptionKey: "meal.perimenopause.lunch1.description",
    icon: "Salad",
    nutrients: ["Phytoestrogens", "Magnesium", "Fiber"],
    phase: "menstrual",
    isAntiInflammatory: true,
    recipe: {
      ingredients: ["1/2 cup quinoa, cooked", "1/2 cup steamed edamame", "1 tbsp ground flaxseed", "1 cup roasted vegetables", "2 tbsp tahini dressing"],
      steps: ["Arrange quinoa in a bowl.", "Top with edamame, flaxseed, and roasted vegetables.", "Drizzle with tahini dressing."],
      prepMinutes: 5,
      cookMinutes: 0,
      servings: 1,
    },
  },
  {
    id: "peri-l2",
    mealType: "lunch",
    titleKey: "meal.perimenopause.lunch2.title",
    descriptionKey: "meal.perimenopause.lunch2.description",
    icon: "Fish",
    nutrients: ["Omega-3", "Calcium", "Vitamin D"],
    phase: "menstrual",
    isAntiInflammatory: true,
    recipe: {
      ingredients: ["3 cups kale, chopped", "1 tin sardines, drained", "1/2 cup white beans", "2 tbsp lemon dressing", "1 tbsp olive oil"],
      steps: ["Massage kale with olive oil until softened.", "Top with sardines and white beans.", "Drizzle with lemon dressing and toss gently."],
      prepMinutes: 8,
      cookMinutes: 0,
      servings: 1,
    },
  },
  {
    id: "peri-d1",
    mealType: "dinner",
    titleKey: "meal.perimenopause.dinner1.title",
    descriptionKey: "meal.perimenopause.dinner1.description",
    icon: "Leaf",
    nutrients: ["Phytoestrogens", "Protein", "Magnesium"],
    phase: "menstrual",
    isAntiInflammatory: true,
    recipe: {
      ingredients: ["200g firm tofu, cubed", "2 cups mixed vegetables", "2 tbsp ginger-soy sauce", "1 cup cooked brown rice", "1 tbsp sesame oil"],
      steps: ["Heat sesame oil in a wok over high heat.", "Add tofu and cook until golden on all sides.", "Add vegetables and stir-fry for 4 minutes.", "Pour in ginger-soy sauce and serve over brown rice."],
      prepMinutes: 10,
      cookMinutes: 10,
      servings: 2,
    },
  },
  {
    id: "peri-d2",
    mealType: "dinner",
    titleKey: "meal.perimenopause.dinner2.title",
    descriptionKey: "meal.perimenopause.dinner2.description",
    icon: "Fish",
    nutrients: ["Omega-3", "Protein", "Vitamin D"],
    phase: "menstrual",
    isAntiInflammatory: true,
    recipe: {
      ingredients: ["200g mackerel fillet", "2 cups dark leafy greens", "1 medium sweet potato, cubed", "1 tbsp olive oil", "1 lemon", "Salt and pepper"],
      steps: ["Roast sweet potato cubes at 200C/400F for 20 minutes.", "Season mackerel and bake for 12 minutes.", "Saute greens in olive oil until wilted.", "Plate together and squeeze lemon over the fish."],
      prepMinutes: 10,
      cookMinutes: 20,
      servings: 2,
    },
  },
  {
    id: "peri-s1",
    mealType: "snack",
    titleKey: "meal.perimenopause.snack1.title",
    descriptionKey: "meal.perimenopause.snack1.description",
    icon: "Cookie",
    nutrients: ["Magnesium", "Antioxidants", "Healthy Fats"],
    phase: "menstrual",
    isAntiInflammatory: true,
    recipe: {
      ingredients: ["2 squares dark chocolate", "2 tbsp almonds", "2 brazil nuts"],
      steps: ["Break chocolate into pieces.", "Enjoy alongside almonds and brazil nuts."],
      prepMinutes: 1,
      cookMinutes: 0,
      servings: 1,
    },
  },
];

const MENOPAUSE_MEALS: MealSuggestion[] = [
  {
    id: "meno-b1",
    mealType: "breakfast",
    titleKey: "meal.menopause.breakfast1.title",
    descriptionKey: "meal.menopause.breakfast1.description",
    icon: "Leaf",
    nutrients: ["Calcium", "Fiber", "Antioxidants"],
    phase: "menstrual",
    isAntiInflammatory: true,
    recipe: {
      ingredients: ["1 cup almond milk", "1 cup kale", "1/2 cup blueberries", "1 tbsp ground flaxseed", "1 banana"],
      steps: ["Add all ingredients to a blender.", "Blend until smooth.", "Pour and serve immediately."],
      prepMinutes: 5,
      cookMinutes: 0,
      servings: 1,
    },
  },
  {
    id: "meno-b2",
    mealType: "breakfast",
    titleKey: "meal.menopause.breakfast2.title",
    descriptionKey: "meal.menopause.breakfast2.description",
    icon: "Egg",
    nutrients: ["Protein", "Omega-3", "Vitamin D"],
    phase: "menstrual",
    isAntiInflammatory: true,
    recipe: {
      ingredients: ["2 omega-3 enriched eggs", "1 cup spinach", "30g smoked salmon", "1 tsp olive oil", "Salt and pepper"],
      steps: ["Heat olive oil in a pan and wilt spinach.", "Scramble eggs into the spinach.", "Top with smoked salmon and season."],
      prepMinutes: 3,
      cookMinutes: 5,
      servings: 1,
    },
  },
  {
    id: "meno-l1",
    mealType: "lunch",
    titleKey: "meal.menopause.lunch1.title",
    descriptionKey: "meal.menopause.lunch1.description",
    icon: "Salad",
    nutrients: ["Omega-3", "Antioxidants", "Protein"],
    phase: "menstrual",
    isAntiInflammatory: true,
    recipe: {
      ingredients: ["150g grilled salmon", "3 cups mixed greens", "1/2 avocado, sliced", "2 tbsp walnuts", "2 tbsp olive oil dressing"],
      steps: ["Grill salmon for 4 minutes per side.", "Arrange mixed greens on a plate.", "Top with salmon, avocado, and walnuts.", "Drizzle with olive oil dressing."],
      prepMinutes: 5,
      cookMinutes: 8,
      servings: 1,
    },
  },
  {
    id: "meno-l2",
    mealType: "lunch",
    titleKey: "meal.menopause.lunch2.title",
    descriptionKey: "meal.menopause.lunch2.description",
    icon: "Soup",
    nutrients: ["Calcium", "Protein", "Vitamin K"],
    phase: "menstrual",
    isAntiInflammatory: true,
    recipe: {
      ingredients: ["2 cups broccoli florets", "1 can white beans, drained", "3 cups vegetable broth", "2 tbsp parmesan", "1 tbsp olive oil"],
      steps: ["Saute broccoli in olive oil for 3 minutes.", "Add broth and beans, simmer for 15 minutes.", "Blend until creamy.", "Top with grated parmesan."],
      prepMinutes: 5,
      cookMinutes: 18,
      servings: 2,
    },
  },
  {
    id: "meno-d1",
    mealType: "dinner",
    titleKey: "meal.menopause.dinner1.title",
    descriptionKey: "meal.menopause.dinner1.description",
    icon: "Fish",
    nutrients: ["Omega-3", "Protein", "Vitamin D"],
    phase: "menstrual",
    isAntiInflammatory: true,
    recipe: {
      ingredients: ["200g white fish fillet", "1 cup mixed mediterranean vegetables", "1/2 cup cooked quinoa", "1 tbsp olive oil", "1 lemon", "Fresh herbs"],
      steps: ["Preheat oven to 190C/375F.", "Toss vegetables with olive oil and spread on a baking sheet.", "Place fish on top, season with herbs and lemon juice.", "Bake for 15 minutes, serve over quinoa."],
      prepMinutes: 10,
      cookMinutes: 15,
      servings: 2,
    },
  },
  {
    id: "meno-d2",
    mealType: "dinner",
    titleKey: "meal.menopause.dinner2.title",
    descriptionKey: "meal.menopause.dinner2.description",
    icon: "Leaf",
    nutrients: ["Protein", "Calcium", "Fiber"],
    phase: "menstrual",
    isAntiInflammatory: false,
    recipe: {
      ingredients: ["1 chicken breast", "3 cups kale, chopped", "1 medium sweet potato, cubed", "2 tbsp tahini", "1 tbsp olive oil", "Salt and pepper"],
      steps: ["Grill or bake chicken breast until cooked through, about 15 minutes.", "Roast sweet potato cubes at 200C/400F for 20 minutes.", "Massage kale with olive oil.", "Slice chicken over kale, add sweet potato, and drizzle with tahini."],
      prepMinutes: 10,
      cookMinutes: 20,
      servings: 2,
    },
  },
  {
    id: "meno-s1",
    mealType: "snack",
    titleKey: "meal.menopause.snack1.title",
    descriptionKey: "meal.menopause.snack1.description",
    icon: "Cherry",
    nutrients: ["Antioxidants", "Fiber", "Vitamin C"],
    phase: "menstrual",
    isAntiInflammatory: true,
    recipe: {
      ingredients: ["1/2 cup mixed berries", "2 tbsp walnuts"],
      steps: ["Rinse berries and place in a small bowl.", "Top with walnuts and enjoy."],
      prepMinutes: 2,
      cookMinutes: 0,
      servings: 1,
    },
  },
];

// ─── Life-stage Nutrition Info ──────────────────────────────────────────────

const LIFESTAGE_NUTRIENTS: Record<string, string[]> = {
  pregnancy: ["Folate", "Iron", "Calcium", "Omega-3 (DHA)", "Vitamin D"],
  postpartum: ["Iron", "Protein", "Omega-3", "Vitamin D", "B Vitamins"],
  perimenopause: ["Phytoestrogens", "Calcium", "Magnesium", "Vitamin D", "Omega-3"],
  menopause: ["Calcium", "Omega-3", "Antioxidants", "Protein", "Vitamin D"],
};

const LIFESTAGE_AVOID: Record<string, string[]> = {
  pregnancy: ["Raw fish & sushi", "Soft unpasteurized cheese", "Excessive caffeine", "Alcohol"],
  postpartum: ["Excess caffeine", "Processed foods", "Alcohol", "Excess sugar"],
  perimenopause: ["Excess caffeine", "Alcohol", "Spicy food (may trigger hot flashes)", "Refined sugar"],
  menopause: ["Processed food", "Excess sugar", "Excess sodium", "Alcohol"],
};

const LIFESTAGE_MEALS: Record<string, MealSuggestion[]> = {
  pregnancy: PREGNANCY_MEALS,
  postpartum: POSTPARTUM_MEALS,
  perimenopause: PERIMENOPAUSE_MEALS,
  menopause: MENOPAUSE_MEALS,
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
  lifeStage?: string,
  healthData?: HealthData | null,
): DailyMealPlan {
  // ─── Life-stage override ──────────────────────────────────────────────
  if (lifeStage && lifeStage !== 'regular' && LIFESTAGE_MEALS[lifeStage]) {
    const lsMeals = LIFESTAGE_MEALS[lifeStage];
    const selected = selectMealsForDay(lsMeals, phaseDay);
    const meals = [selected.breakfast, selected.lunch, selected.dinner, selected.snack];

    let hydrationGoal = lifeStage === 'pregnancy' ? 10
      : lifeStage === 'postpartum' ? 10
      : BASE_HYDRATION;

    return {
      phase,
      phaseDay: clamp(phaseDay, 1, 99),
      meals,
      hydrationGoal,
      keyNutrients: (LIFESTAGE_NUTRIENTS[lifeStage] || []).slice(0, 6),
      avoidList: (LIFESTAGE_AVOID[lifeStage] || []).slice(0, 5),
    };
  }

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

  // ── Health data adjustments ─────────────────────────────────────────────

  if (healthData) {
    // High active energy burn → add extra Complex Carbs + Protein
    const activeEnergy = healthData.activeEnergy;
    if (activeEnergy !== undefined && activeEnergy > 500) {
      if (!keyNutrients.includes("Complex Carbs")) keyNutrients.push("Complex Carbs");
      if (!keyNutrients.includes("Protein")) keyNutrients.push("Protein");
    }

    // Low HRV → anti-inflammatory support
    const hrv = healthData.hrv;
    if (hrv !== undefined && hrv < 30) {
      if (!keyNutrients.includes("Omega-3")) keyNutrients.push("Omega-3");
      if (!keyNutrients.includes("Magnesium")) keyNutrients.push("Magnesium");
    }

    // Short sleep via Health data → tryptophan + magnesium (sleep support)
    const sleepHours = healthData.sleepHours;
    if (sleepHours !== undefined && sleepHours < 6) {
      if (!keyNutrients.includes("Magnesium")) keyNutrients.push("Magnesium");
      if (!keyNutrients.includes("Tryptophan")) keyNutrients.push("Tryptophan");
      if (!avoidList.includes("Caffeine after noon")) avoidList.push("Caffeine after noon");
    }

    // Elevated wrist temperature deviation → anti-inflammatory + hydration
    const tempDev = healthData.wristTemperatureDeviation;
    if (tempDev !== undefined && tempDev > 0.4) {
      hydrationGoal = Math.max(hydrationGoal, 10);
      if (!keyNutrients.includes("Antioxidants")) keyNutrients.push("Antioxidants");
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

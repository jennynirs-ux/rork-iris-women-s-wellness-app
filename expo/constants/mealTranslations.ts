import { Language } from './translations';

// ─── English ────────────────────────────────────────────────────────────────

const en: Record<string, string> = {
  // Screen
  screenTitle: "Today's Meal Plan",
  subtitle: "Cycle-synced nutrition for your phase",

  // Phase labels
  phaseMenstrual: "Menstrual Phase",
  phaseFollicular: "Follicular Phase",
  phaseOvulation: "Ovulation Phase",
  phaseLuteal: "Luteal Phase",

  // Phase nutrition descriptions
  phaseDescMenstrual: "Focus on iron-rich, warming foods to replenish what your body needs.",
  phaseDescFollicular: "Light, fresh foods and fermented options to match rising energy.",
  phaseDescOvulation: "Anti-inflammatory foods and raw veggies to support peak energy.",
  phaseDescLuteal: "Complex carbs and magnesium-rich foods to ease pre-period symptoms.",

  // Badge labels
  "mealPlan.antiInflammatory": "Anti-inflammatory",

  // Meal type labels
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",

  // Hydration
  hydrationTitle: "Hydration Goal",
  hydrationUnit: "glasses today",
  hydrationGlassesOf: "of",

  // Nutrients
  keyNutrientsTitle: "Key Nutrients Today",
  avoidTitle: "Try to Reduce",

  // Navigation
  viewMealPlan: "Today's Meals",

  // Recipe
  "mealPlan.ingredients": "Ingredients",
  "mealPlan.steps": "How to Make",
  "mealPlan.prepTime": "Prep",
  "mealPlan.cookTime": "Cook",
  "mealPlan.servings": "servings",
  "mealPlan.viewRecipe": "View Recipe",
  "mealPlan.hideRecipe": "Hide Recipe",
  "mealPlan.minutes": "min",

  // ─── Menstrual Phase Meals ─────────────────────────────────────────────────

  "meal.menstrual.breakfast1.title": "Spinach & Berry Smoothie",
  "meal.menstrual.breakfast1.description":
    "Iron-rich spinach blended with mixed berries, banana, and a squeeze of orange for vitamin C to boost iron absorption.",

  "meal.menstrual.breakfast2.title": "Warm Oatmeal with Dates",
  "meal.menstrual.breakfast2.description":
    "Comforting steel-cut oats topped with chopped dates, walnuts, and a drizzle of honey. Rich in iron and magnesium.",

  "meal.menstrual.lunch1.title": "Lentil & Vegetable Soup",
  "meal.menstrual.lunch1.description":
    "Hearty red lentil soup with carrots, celery, and warming spices like turmeric and cumin. High in iron and protein.",

  "meal.menstrual.lunch2.title": "Spinach & Chickpea Salad",
  "meal.menstrual.lunch2.description":
    "Fresh spinach with roasted chickpeas, bell peppers, and lemon-tahini dressing. Packed with iron and vitamin C.",

  "meal.menstrual.dinner1.title": "Grass-fed Beef Stir-fry",
  "meal.menstrual.dinner1.description":
    "Tender beef strips with broccoli, snap peas, and ginger sauce over brown rice. Excellent source of iron and B12.",

  "meal.menstrual.dinner2.title": "Warming Root Vegetable Stew",
  "meal.menstrual.dinner2.description":
    "Sweet potato, carrots, and parsnips simmered in a savory broth with kale and white beans. Comforting and nutrient-dense.",

  "meal.menstrual.snack1.title": "Dark Chocolate & Trail Mix",
  "meal.menstrual.snack1.description":
    "A square of 70% dark chocolate with a small handful of pumpkin seeds and dried apricots. Rich in magnesium and iron.",

  // ─── Follicular Phase Meals ────────────────────────────────────────────────

  "meal.follicular.breakfast1.title": "Energizing Green Smoothie",
  "meal.follicular.breakfast1.description":
    "Kale, pineapple, ginger, and protein powder blended with coconut water. Light, refreshing, and energizing.",

  "meal.follicular.breakfast2.title": "Greek Yogurt Parfait",
  "meal.follicular.breakfast2.description":
    "Probiotic-rich Greek yogurt layered with granola, fresh berries, and a sprinkle of chia seeds for gut health.",

  "meal.follicular.lunch1.title": "Rainbow Buddha Bowl",
  "meal.follicular.lunch1.description":
    "Quinoa base with roasted sweet potato, edamame, shredded carrots, avocado, and ginger-sesame dressing.",

  "meal.follicular.lunch2.title": "Kimchi Salmon Grain Bowl",
  "meal.follicular.lunch2.description":
    "Fermented kimchi with grilled salmon, brown rice, cucumber, and pickled vegetables. Probiotics meet omega-3s.",

  "meal.follicular.dinner1.title": "Lean Turkey Lettuce Wraps",
  "meal.follicular.dinner1.description":
    "Seasoned ground turkey in crisp lettuce cups with mango salsa, avocado, and a lime drizzle. Light yet satisfying.",

  "meal.follicular.dinner2.title": "Baked Cod with Asparagus",
  "meal.follicular.dinner2.description":
    "Herb-crusted cod fillet with roasted asparagus and lemon. Light, clean protein with selenium and omega-3s.",

  "meal.follicular.snack1.title": "Fermented Veggie Sticks",
  "meal.follicular.snack1.description":
    "Crunchy carrot and celery sticks served with sauerkraut and hummus. Probiotics and fiber in one simple snack.",

  // ─── Ovulation Phase Meals ─────────────────────────────────────────────────

  "meal.ovulation.breakfast1.title": "Berry Antioxidant Bowl",
  "meal.ovulation.breakfast1.description":
    "Acai base topped with blueberries, strawberries, hemp seeds, and coconut flakes. Bursting with antioxidants.",

  "meal.ovulation.breakfast2.title": "Avocado Toast with Eggs",
  "meal.ovulation.breakfast2.description":
    "Whole grain toast with mashed avocado, poached eggs, and everything seasoning. Balanced protein and healthy fats.",

  "meal.ovulation.lunch1.title": "Raw Vegetable Wrap",
  "meal.ovulation.lunch1.description":
    "Collard green wraps filled with hummus, shredded beets, carrots, sprouts, and sunflower seeds. Light and nutrient-dense.",

  "meal.ovulation.lunch2.title": "Grilled Salmon Salad",
  "meal.ovulation.lunch2.description":
    "Wild salmon over mixed greens with cherry tomatoes, walnuts, and olive oil dressing. Rich in omega-3 and antioxidants.",

  "meal.ovulation.dinner1.title": "Baked Salmon with Veggies",
  "meal.ovulation.dinner1.description":
    "Omega-3 rich salmon fillet with roasted brussels sprouts and sweet potato. Anti-inflammatory and satisfying.",

  "meal.ovulation.dinner2.title": "Mediterranean Stuffed Peppers",
  "meal.ovulation.dinner2.description":
    "Bell peppers filled with quinoa, tomatoes, olives, feta, and fresh herbs. Light Mediterranean flavors.",

  "meal.ovulation.snack1.title": "Mixed Berry Cup",
  "meal.ovulation.snack1.description":
    "Fresh blueberries, raspberries, and strawberries with a squeeze of lime. Simple, refreshing, and packed with vitamin C.",

  // ─── Luteal Phase Meals ────────────────────────────────────────────────────

  "meal.luteal.breakfast1.title": "Sweet Potato Pancakes",
  "meal.luteal.breakfast1.description":
    "Fluffy pancakes made with mashed sweet potato, oats, and cinnamon. Complex carbs to keep blood sugar stable.",

  "meal.luteal.breakfast2.title": "Egg & Avocado Toast",
  "meal.luteal.breakfast2.description":
    "Scrambled eggs on whole grain toast with avocado and a side of roasted pumpkin seeds for magnesium.",

  "meal.luteal.lunch1.title": "Quinoa Stuffed Sweet Potato",
  "meal.luteal.lunch1.description":
    "Baked sweet potato filled with herbed quinoa, black beans, corn, and a dollop of Greek yogurt. Hearty and balanced.",

  "meal.luteal.lunch2.title": "Butternut Squash Soup",
  "meal.luteal.lunch2.description":
    "Creamy roasted butternut squash soup with warming nutmeg and a swirl of coconut cream. Soothing and magnesium-rich.",

  "meal.luteal.dinner1.title": "Salmon with Quinoa Pilaf",
  "meal.luteal.dinner1.description":
    "Baked salmon served alongside herb quinoa pilaf with toasted almonds. Omega-3s and magnesium in every bite.",

  "meal.luteal.dinner2.title": "Warming Chickpea Curry",
  "meal.luteal.dinner2.description":
    "Chickpeas simmered in a turmeric-coconut curry with spinach over brown rice. Anti-inflammatory and warming.",

  "meal.luteal.snack1.title": "Dark Chocolate & Almonds",
  "meal.luteal.snack1.description":
    "Two squares of dark chocolate with raw almonds. Magnesium and healthy fats to support mood and curb cravings.",

  // ─── Life-stage labels ────────────────────────────────────────────────────

  phasePregnancy: "Pregnancy",
  phasePostpartum: "Postpartum",
  phasePerimenopause: "Perimenopause",
  phaseMenopause: "Menopause",

  phaseDescPregnancy: "Nutrient-dense foods rich in folate, iron, calcium, and omega-3 to support you and your baby.",
  phaseDescPostpartum: "Recovery-focused meals with iron, protein, and anti-inflammatory foods to help your body heal.",
  phaseDescPerimenopause: "Phytoestrogen-rich foods, calcium, and magnesium to support hormonal balance and bone health.",
  phaseDescMenopause: "Bone-supporting calcium, heart-healthy omega-3, and antioxidant-rich foods for overall wellness.",

  // ─── Pregnancy Meals ──────────────────────────────────────────────────────

  "meal.pregnancy.breakfast1.title": "Lentil & Spinach Scramble",
  "meal.pregnancy.breakfast1.description":
    "Scrambled eggs with sauteed spinach and red lentils on whole grain toast. Packed with folate and iron for early development.",

  "meal.pregnancy.breakfast2.title": "Calcium-Rich Yogurt Bowl",
  "meal.pregnancy.breakfast2.description":
    "Greek yogurt topped with sliced almonds, figs, and a drizzle of honey. Great source of calcium and protein.",

  "meal.pregnancy.lunch1.title": "Leafy Green & Lentil Salad",
  "meal.pregnancy.lunch1.description":
    "Mixed greens with warm lentils, roasted beets, bell peppers, and lemon vinaigrette. Rich in folate, iron, and vitamin C.",

  "meal.pregnancy.lunch2.title": "Nourishing Bean Soup",
  "meal.pregnancy.lunch2.description":
    "White bean and vegetable soup with kale and whole grain bread. Hearty, warming, and full of fiber and iron.",

  "meal.pregnancy.dinner1.title": "Baked Salmon with Sweet Potato",
  "meal.pregnancy.dinner1.description":
    "Wild-caught salmon (fully cooked) with roasted sweet potato and steamed broccoli. Omega-3 and DHA for brain development.",

  "meal.pregnancy.dinner2.title": "Iron-Rich Beef & Greens",
  "meal.pregnancy.dinner2.description":
    "Lean beef strips with sauteed spinach and calcium-fortified rice. Excellent source of iron, calcium, and protein.",

  "meal.pregnancy.snack1.title": "Walnuts & Yogurt",
  "meal.pregnancy.snack1.description":
    "A small bowl of yogurt with crushed walnuts and a sprinkle of ground flaxseed. Calcium, omega-3, and protein in one snack.",

  // ─── Postpartum Meals ─────────────────────────────────────────────────────

  "meal.postpartum.breakfast1.title": "Iron-Boosting Eggs & Toast",
  "meal.postpartum.breakfast1.description":
    "Scrambled eggs with wilted spinach on iron-fortified toast. Helps replenish iron stores after birth.",

  "meal.postpartum.breakfast2.title": "Omega-3 Overnight Oats",
  "meal.postpartum.breakfast2.description":
    "Oats soaked overnight with chia seeds, walnuts, and banana. Anti-inflammatory omega-3s and fiber to support recovery.",

  "meal.postpartum.lunch1.title": "Bone Broth & Vegetable Bowl",
  "meal.postpartum.lunch1.description":
    "Rich bone broth with shredded chicken, sweet potato, and greens. Collagen and protein to support tissue healing.",

  "meal.postpartum.lunch2.title": "Spinach & Quinoa Power Bowl",
  "meal.postpartum.lunch2.description":
    "Quinoa with baby spinach, roasted chickpeas, and lemon dressing. Iron and vitamin C for blood replenishment.",

  "meal.postpartum.dinner1.title": "Salmon & Roasted Vegetables",
  "meal.postpartum.dinner1.description":
    "Baked salmon with a medley of roasted root vegetables. Omega-3 fatty acids for mood support and recovery.",

  "meal.postpartum.dinner2.title": "Slow-Cooked Beef Stew",
  "meal.postpartum.dinner2.description":
    "Tender beef with carrots, potatoes, and herbs in a rich broth. Iron and zinc to support your body's healing.",

  "meal.postpartum.snack1.title": "Trail Mix with Dark Chocolate",
  "meal.postpartum.snack1.description":
    "Walnuts, pumpkin seeds, and dark chocolate chips. Omega-3s and magnesium for energy and mood support.",

  // ─── Perimenopause Meals ──────────────────────────────────────────────────

  "meal.perimenopause.breakfast1.title": "Flaxseed & Soy Smoothie",
  "meal.perimenopause.breakfast1.description":
    "Soy milk blended with ground flaxseed, banana, and berries. Phytoestrogens and fiber to support hormonal balance.",

  "meal.perimenopause.breakfast2.title": "Egg & Calcium Toast",
  "meal.perimenopause.breakfast2.description":
    "Poached eggs on fortified whole grain toast with a side of calcium-rich cheese. Protein and vitamin D for bone health.",

  "meal.perimenopause.lunch1.title": "Edamame & Flax Grain Bowl",
  "meal.perimenopause.lunch1.description":
    "Quinoa with steamed edamame, ground flaxseed, roasted vegetables, and tahini. Phytoestrogens and magnesium combined.",

  "meal.perimenopause.lunch2.title": "Sardine & Kale Salad",
  "meal.perimenopause.lunch2.description":
    "Kale salad with sardines, white beans, and lemon dressing. Omega-3, calcium, and vitamin D all in one bowl.",

  "meal.perimenopause.dinner1.title": "Tofu & Vegetable Stir-Fry",
  "meal.perimenopause.dinner1.description":
    "Firm tofu with colorful vegetables in a ginger-soy sauce over brown rice. Phytoestrogens and magnesium for balance.",

  "meal.perimenopause.dinner2.title": "Baked Mackerel with Greens",
  "meal.perimenopause.dinner2.description":
    "Omega-3 rich mackerel with sauteed dark leafy greens and roasted sweet potato. Heart and bone support in every bite.",

  "meal.perimenopause.snack1.title": "Dark Chocolate & Mixed Nuts",
  "meal.perimenopause.snack1.description":
    "A square of dark chocolate with almonds and brazil nuts. Magnesium and antioxidants to ease tension and support sleep.",

  // ─── Menopause Meals ──────────────────────────────────────────────────────

  "meal.menopause.breakfast1.title": "Berry & Leafy Green Smoothie",
  "meal.menopause.breakfast1.description":
    "Blueberries, kale, and almond milk smoothie with ground flaxseed. Antioxidants and calcium for brain and bone support.",

  "meal.menopause.breakfast2.title": "Omega-3 Egg Scramble",
  "meal.menopause.breakfast2.description":
    "Omega-3 enriched eggs scrambled with spinach and smoked salmon. Protein, healthy fats, and vitamin D.",

  "meal.menopause.lunch1.title": "Salmon & Avocado Bowl",
  "meal.menopause.lunch1.description":
    "Grilled salmon over mixed greens with avocado, walnuts, and olive oil dressing. Heart-healthy omega-3 and antioxidants.",

  "meal.menopause.lunch2.title": "Broccoli & White Bean Soup",
  "meal.menopause.lunch2.description":
    "Creamy broccoli soup with white beans and parmesan. Calcium, protein, and vitamin K for bone support.",

  "meal.menopause.dinner1.title": "Grilled Fish with Vegetables",
  "meal.menopause.dinner1.description":
    "Grilled white fish with roasted mediterranean vegetables and quinoa. Lean protein, omega-3, and vitamin D.",

  "meal.menopause.dinner2.title": "Chicken & Kale Bowl",
  "meal.menopause.dinner2.description":
    "Grilled chicken breast with massaged kale, roasted sweet potato, and tahini. Protein for muscle maintenance and calcium.",

  "meal.menopause.snack1.title": "Mixed Berry Cup with Nuts",
  "meal.menopause.snack1.description":
    "Fresh mixed berries with a handful of walnuts. Antioxidants for brain health and omega-3 for heart support.",
};

// ─── Swedish ────────────────────────────────────────────────────────────────

const sv: Record<string, string> = {
  // Screen
  screenTitle: "Dagens Måltidsplan",
  subtitle: "Cykelsanpassad näring för din fas",

  // Phase labels
  phaseMenstrual: "Menstruationsfas",
  phaseFollicular: "Follikelfas",
  phaseOvulation: "Ovulationsfas",
  phaseLuteal: "Lutealfas",

  // Phase nutrition descriptions
  phaseDescMenstrual: "Fokusera på järnrika, värmande rätter för att fylla på kroppens behov.",
  phaseDescFollicular: "Lätta, fräscha rätter och fermenterade alternativ som matchar din stigande energi.",
  phaseDescOvulation: "Antiinflammatorisk mat och rå grönsaker för att stödja maximal energi.",
  phaseDescLuteal: "Komplexa kolhydrater och magnesiumrik mat för att lindra PMS-besvär.",

  // Badge labels
  "mealPlan.antiInflammatory": "Antiinflammatorisk",

  // Meal type labels
  breakfast: "Frukost",
  lunch: "Lunch",
  dinner: "Middag",
  snack: "Mellanmål",

  // Hydration
  hydrationTitle: "Vätskemål",
  hydrationUnit: "glas idag",
  hydrationGlassesOf: "av",

  // Nutrients
  keyNutrientsTitle: "Dagens Viktiga Näringsämnen",
  avoidTitle: "Försök Minska",

  // Navigation
  viewMealPlan: "Dagens Måltider",

  // Recipe
  "mealPlan.ingredients": "Ingredienser",
  "mealPlan.steps": "Gör Så Här",
  "mealPlan.prepTime": "Förberedelse",
  "mealPlan.cookTime": "Tillagning",
  "mealPlan.servings": "portioner",
  "mealPlan.viewRecipe": "Visa Recept",
  "mealPlan.hideRecipe": "Dölj Recept",
  "mealPlan.minutes": "min",

  // ─── Menstrual Phase Meals ─────────────────────────────────────────────────

  "meal.menstrual.breakfast1.title": "Spenat- & Bärsmoothie",
  "meal.menstrual.breakfast1.description":
    "Järnrik spenat mixad med blandade bär, banan och en skvätt apelsin för C-vitamin som ökar järnupptaget.",

  "meal.menstrual.breakfast2.title": "Varm Havregröt med Dadlar",
  "meal.menstrual.breakfast2.description":
    "Värmande grovklippt havregrynsgröt toppad med hackade dadlar, valnötter och en skvätt honung. Rik på järn och magnesium.",

  "meal.menstrual.lunch1.title": "Linssoppa med Grönsaker",
  "meal.menstrual.lunch1.description":
    "Kraftig röd linssoppa med morötter, selleri och värmande kryddor som gurkmeja och spiskummin. Rik på järn och protein.",

  "meal.menstrual.lunch2.title": "Spenat- & Kikärtssallad",
  "meal.menstrual.lunch2.description":
    "Färsk spenat med rostade kikärtor, paprika och citron-tahinidressing. Fullpackad med järn och C-vitamin.",

  "meal.menstrual.dinner1.title": "Wok med Naturbeteskött",
  "meal.menstrual.dinner1.description":
    "Möra nötköttstrimlor med broccoli, sockerärtor och ingefärssås på råris. Utmärkt källa till järn och B12.",

  "meal.menstrual.dinner2.title": "Värmande Rotfruktgryta",
  "meal.menstrual.dinner2.description":
    "Sötpotatis, morötter och palsternacka kokta i en mustig buljong med grönkål och vita bönor. Tröstande och näringsrik.",

  "meal.menstrual.snack1.title": "Mörk Choklad & Nötmix",
  "meal.menstrual.snack1.description":
    "En bit 70% mörk choklad med en liten handfull pumpafrön och torkade aprikoser. Rik på magnesium och järn.",

  // ─── Follicular Phase Meals ────────────────────────────────────────────────

  "meal.follicular.breakfast1.title": "Energigivande Grön Smoothie",
  "meal.follicular.breakfast1.description":
    "Grönkål, ananas, ingefära och proteinpulver mixat med kokosvatten. Lätt, fräscht och energigivande.",

  "meal.follicular.breakfast2.title": "Grekisk Yoghurtparfait",
  "meal.follicular.breakfast2.description":
    "Probiotisk grekisk yoghurt i lager med granola, färska bär och en nypa chiafrön för tarmhälsa.",

  "meal.follicular.lunch1.title": "Regnbågs-Buddhabowl",
  "meal.follicular.lunch1.description":
    "Quinoabas med rostad sötpotatis, edamame, riven morot, avokado och ingefära-sesamdressing.",

  "meal.follicular.lunch2.title": "Kimchi-Laxbowl",
  "meal.follicular.lunch2.description":
    "Fermenterad kimchi med grillad lax, råris, gurka och inlagda grönsaker. Probiotika möter omega-3.",

  "meal.follicular.dinner1.title": "Kalkonsalladsrullar",
  "meal.follicular.dinner1.description":
    "Kryddad kalkonf\u00e4rs i krispiga salladsblad med mangosalsa, avokado och en skvätt lime. Lätt men mättande.",

  "meal.follicular.dinner2.title": "Ugnsbakad Torsk med Sparris",
  "meal.follicular.dinner2.description":
    "Örtpanerad torskfilé med rostad sparris och citron. Lätt, rent protein med selen och omega-3.",

  "meal.follicular.snack1.title": "Fermenterade Grönsaksstavar",
  "meal.follicular.snack1.description":
    "Krispiga morot- och selleristavar med surkål och hummus. Probiotika och fiber i ett enkelt mellanmål.",

  // ─── Ovulation Phase Meals ─────────────────────────────────────────────────

  "meal.ovulation.breakfast1.title": "Bär-Antioxidantbowl",
  "meal.ovulation.breakfast1.description":
    "Açaibas toppad med blåbär, jordgubbar, hampfrön och kokosflingor. Sprängfylld med antioxidanter.",

  "meal.ovulation.breakfast2.title": "Avokadotoast med Ägg",
  "meal.ovulation.breakfast2.description":
    "Fullkornstoast med mosad avokado, pocherade ägg och kryddor. Balanserat protein och nyttiga fetter.",

  "meal.ovulation.lunch1.title": "Rå Grönsakswrap",
  "meal.ovulation.lunch1.description":
    "Kålblad fyllda med hummus, riven rödbeta, morot, groddar och solrosfrön. Lätt och näringsrik.",

  "meal.ovulation.lunch2.title": "Grillad Laxsallad",
  "meal.ovulation.lunch2.description":
    "Vild lax på blandade salladsblad med körsbärstomater, valnötter och olivoljedressing. Rik på omega-3 och antioxidanter.",

  "meal.ovulation.dinner1.title": "Ugnsbakad Lax med Grönsaker",
  "meal.ovulation.dinner1.description":
    "Omega-3-rik laxfilé med rostade brysselkål och sötpotatis. Antiinflammatorisk och mättande.",

  "meal.ovulation.dinner2.title": "Medelhavsfylld Paprika",
  "meal.ovulation.dinner2.description":
    "Paprika fylld med quinoa, tomater, oliver, fetaost och färska örter. Lätta medelhavssmmaker.",

  "meal.ovulation.snack1.title": "Bärbägare",
  "meal.ovulation.snack1.description":
    "Färska blåbär, hallon och jordgubbar med en skvätt lime. Enkelt, fräscht och fullt av C-vitamin.",

  // ─── Luteal Phase Meals ────────────────────────────────────────────────────

  "meal.luteal.breakfast1.title": "Sötpotatisplättar",
  "meal.luteal.breakfast1.description":
    "Fluffiga plättar gjorda på mosad sötpotatis, havre och kanel. Komplexa kolhydrater som håller blodsockret stabilt.",

  "meal.luteal.breakfast2.title": "Ägg- & Avokadotoast",
  "meal.luteal.breakfast2.description":
    "Äggröra på fullkornstoast med avokado och rostade pumpafrön för magnesium.",

  "meal.luteal.lunch1.title": "Quinoafylld Sötpotatis",
  "meal.luteal.lunch1.description":
    "Bakad sötpotatis fylld med örtquinoa, svarta bönor, majs och en klick grekisk yoghurt. Mättande och balanserad.",

  "meal.luteal.lunch2.title": "Butternutsoppa",
  "meal.luteal.lunch2.description":
    "Krämig rostad butternutsoppa med värmande muskotnöt och en virvel kokosgrädde. Lenande och magnesiumrik.",

  "meal.luteal.dinner1.title": "Lax med Quinoapilaf",
  "meal.luteal.dinner1.description":
    "Ugnsbakad lax serverad med örtquinoapilaf och rostade mandlar. Omega-3 och magnesium i varje tugga.",

  "meal.luteal.dinner2.title": "Värmande Kikärtsgryta",
  "meal.luteal.dinner2.description":
    "Kikärtor kokta i gurkmeje-kokoscurry med spenat på råris. Antiinflammatorisk och värmande.",

  "meal.luteal.snack1.title": "Mörk Choklad & Mandlar",
  "meal.luteal.snack1.description":
    "Två bitar mörk choklad med råa mandlar. Magnesium och nyttiga fetter som stöder humöret och dämpar sug.",

  // ─── Life-stage labels ────────────────────────────────────────────────────

  phasePregnancy: "Graviditet",
  phasePostpartum: "Postpartum",
  phasePerimenopause: "Perimenopaus",
  phaseMenopause: "Menopaus",

  phaseDescPregnancy: "Näringsrik mat med folat, järn, kalcium och omega-3 för att stödja dig och ditt barn.",
  phaseDescPostpartum: "Återhämtningsfokuserade måltider med järn, protein och antiinflammatorisk mat för läkning.",
  phaseDescPerimenopause: "Fytoöstrogenrik mat, kalcium och magnesium för hormonbalans och benhälsa.",
  phaseDescMenopause: "Benstärkande kalcium, hjärtvänlig omega-3 och antioxidantrik mat för övergripande välmående.",

  // ─── Pregnancy Meals ──────────────────────────────────────────────────────

  "meal.pregnancy.breakfast1.title": "Lins- & Spenatäggröra",
  "meal.pregnancy.breakfast1.description":
    "Äggröra med fräst spenat och röda linser på fullkornstoast. Fullpackad med folat och järn för tidig utveckling.",

  "meal.pregnancy.breakfast2.title": "Kalciumrik Yoghurtbowl",
  "meal.pregnancy.breakfast2.description":
    "Grekisk yoghurt toppad med skivade mandlar, fikon och en skvätt honung. Utmärkt källa till kalcium och protein.",

  "meal.pregnancy.lunch1.title": "Bladgrönssallad med Linser",
  "meal.pregnancy.lunch1.description":
    "Blandade gröna blad med varma linser, rostade rödbetor, paprika och citronvinägrett. Rik på folat, järn och C-vitamin.",

  "meal.pregnancy.lunch2.title": "Närande Bönsoppa",
  "meal.pregnancy.lunch2.description":
    "Vit bönsoppa med grönsaker, grönkål och fullkornsbröd. Mättande, värmande och full av fiber och järn.",

  "meal.pregnancy.dinner1.title": "Ugnsbakad Lax med Sötpotatis",
  "meal.pregnancy.dinner1.description":
    "Vildfångad lax (genomstekt) med rostad sötpotatis och ångkokt broccoli. Omega-3 och DHA för hjärnans utveckling.",

  "meal.pregnancy.dinner2.title": "Järnrikt Nötkött med Grönt",
  "meal.pregnancy.dinner2.description":
    "Magra nötköttstrimlor med fräst spenat och kalciumberikad ris. Utmärkt källa till järn, kalcium och protein.",

  "meal.pregnancy.snack1.title": "Valnötter & Yoghurt",
  "meal.pregnancy.snack1.description":
    "En liten skål yoghurt med krossade valnötter och malet linfrö. Kalcium, omega-3 och protein i ett mellanmål.",

  // ─── Postpartum Meals ─────────────────────────────────────────────────────

  "meal.postpartum.breakfast1.title": "Järnboostande Ägg & Toast",
  "meal.postpartum.breakfast1.description":
    "Äggröra med välmad spenat på järnberikad toast. Hjälper till att fylla på järndepåerna efter förlossningen.",

  "meal.postpartum.breakfast2.title": "Omega-3 Overnight Oats",
  "meal.postpartum.breakfast2.description":
    "Havregryn blötlagda över natten med chiafrön, valnötter och banan. Antiinflammatorisk omega-3 och fiber för återhämtning.",

  "meal.postpartum.lunch1.title": "Benbuljong & Grönsaksbowl",
  "meal.postpartum.lunch1.description":
    "Mustig benbuljong med strimblad kyckling, sötpotatis och grönt. Kollagen och protein för vävnadsläkning.",

  "meal.postpartum.lunch2.title": "Spenat- & Quinoapowerbowl",
  "meal.postpartum.lunch2.description":
    "Quinoa med babyspenat, rostade kikärtor och citrondressing. Järn och C-vitamin för blodåterställning.",

  "meal.postpartum.dinner1.title": "Lax & Rostade Grönsaker",
  "meal.postpartum.dinner1.description":
    "Ugnsbakad lax med en blandning av rostade rotfrukter. Omega-3-fettsyror för humör och återhämtning.",

  "meal.postpartum.dinner2.title": "Långkokt Nötköttgryta",
  "meal.postpartum.dinner2.description":
    "Mört nötkött med morötter, potatis och örter i en mustig buljong. Järn och zink för kroppens läkning.",

  "meal.postpartum.snack1.title": "Nötmix med Mörk Choklad",
  "meal.postpartum.snack1.description":
    "Valnötter, pumpafrön och mörka chokladbitar. Omega-3 och magnesium för energi och humör.",

  // ─── Perimenopause Meals ──────────────────────────────────────────────────

  "meal.perimenopause.breakfast1.title": "Linfrö- & Sojasmoothie",
  "meal.perimenopause.breakfast1.description":
    "Sojamjölk mixad med malet linfrö, banan och bär. Fytoöstrogener och fiber för hormonbalans.",

  "meal.perimenopause.breakfast2.title": "Ägg & Kalciumtoast",
  "meal.perimenopause.breakfast2.description":
    "Pocherade ägg på berikad fullkornstoast med en sida kalciumrik ost. Protein och D-vitamin för benhälsa.",

  "meal.perimenopause.lunch1.title": "Edamame- & Linfröbowl",
  "meal.perimenopause.lunch1.description":
    "Quinoa med ångkokta edamamebönor, malet linfrö, rostade grönsaker och tahini. Fytoöstrogener och magnesium.",

  "meal.perimenopause.lunch2.title": "Sardin- & Grönkålssallad",
  "meal.perimenopause.lunch2.description":
    "Grönkålssallad med sardiner, vita bönor och citrondressing. Omega-3, kalcium och D-vitamin i en skål.",

  "meal.perimenopause.dinner1.title": "Tofu- & Grönsakswok",
  "meal.perimenopause.dinner1.description":
    "Fast tofu med färgglada grönsaker i ingefärs-sojasås på råris. Fytoöstrogener och magnesium för balans.",

  "meal.perimenopause.dinner2.title": "Ugnsbakad Makrill med Grönt",
  "meal.perimenopause.dinner2.description":
    "Omega-3-rik makrill med frästa mörka bladgrönsaker och rostad sötpotatis. Hjärt- och benstöd i varje tugga.",

  "meal.perimenopause.snack1.title": "Mörk Choklad & Blandade Nötter",
  "meal.perimenopause.snack1.description":
    "En bit mörk choklad med mandlar och paranötter. Magnesium och antioxidanter för att lindra spänning och stödja sömn.",

  // ─── Menopause Meals ──────────────────────────────────────────────────────

  "meal.menopause.breakfast1.title": "Bär- & Bladgrönssmoothie",
  "meal.menopause.breakfast1.description":
    "Blåbär, grönkål och mandelmjölkssmoothie med malet linfrö. Antioxidanter och kalcium för hjärna och ben.",

  "meal.menopause.breakfast2.title": "Omega-3-Äggröra",
  "meal.menopause.breakfast2.description":
    "Omega-3-berikade ägg med spenat och rökt lax. Protein, nyttiga fetter och D-vitamin.",

  "meal.menopause.lunch1.title": "Lax- & Avokadobowl",
  "meal.menopause.lunch1.description":
    "Grillad lax på blandade salladsblad med avokado, valnötter och olivoljedressing. Hjärtvänlig omega-3 och antioxidanter.",

  "meal.menopause.lunch2.title": "Broccoli- & Vitbönsoppa",
  "meal.menopause.lunch2.description":
    "Krämig broccolisoppa med vita bönor och parmesan. Kalcium, protein och K-vitamin för benstöd.",

  "meal.menopause.dinner1.title": "Grillad Fisk med Grönsaker",
  "meal.menopause.dinner1.description":
    "Grillad vitfisk med rostade medelhavsgrönsaker och quinoa. Magert protein, omega-3 och D-vitamin.",

  "meal.menopause.dinner2.title": "Kyckling- & Grönkålsbowl",
  "meal.menopause.dinner2.description":
    "Grillad kycklingbröst med masserad grönkål, rostad sötpotatis och tahini. Protein för muskelunderhåll och kalcium.",

  "meal.menopause.snack1.title": "Bärbägare med Nötter",
  "meal.menopause.snack1.description":
    "Färska blandade bär med en handfull valnötter. Antioxidanter för hjärnhälsa och omega-3 för hjärtat.",
};

// ─── German ─────────────────────────────────────────────────────────────────

const de: Record<string, string> = {
  // Screen
  screenTitle: "Heutiger Ernährungsplan",
  subtitle: "Zyklusangepasste Ernährung für deine Phase",

  // Phase labels
  phaseMenstrual: "Menstruationsphase",
  phaseFollicular: "Follikelphase",
  phaseOvulation: "Ovulationsphase",
  phaseLuteal: "Lutealphase",

  // Phase nutrition descriptions
  phaseDescMenstrual: "Setze auf eisenreiche, wärmende Speisen, um deinen Körper aufzufüllen.",
  phaseDescFollicular: "Leichte, frische Speisen und fermentierte Optionen passend zur steigenden Energie.",
  phaseDescOvulation: "Entzündungshemmende Lebensmittel und rohes Gemüse für maximale Energie.",
  phaseDescLuteal: "Komplexe Kohlenhydrate und magnesiumreiche Lebensmittel gegen PMS-Beschwerden.",

  // Badge labels
  "mealPlan.antiInflammatory": "Entzündungshemmend",

  // Meal type labels
  breakfast: "Frühstück",
  lunch: "Mittagessen",
  dinner: "Abendessen",
  snack: "Snack",

  // Hydration
  hydrationTitle: "Trinkziel",
  hydrationUnit: "Gläser heute",
  hydrationGlassesOf: "von",

  // Nutrients
  keyNutrientsTitle: "Wichtige Nährstoffe Heute",
  avoidTitle: "Versuche zu Reduzieren",

  // Navigation
  viewMealPlan: "Heutige Mahlzeiten",

  // Recipe
  "mealPlan.ingredients": "Zutaten",
  "mealPlan.steps": "Zubereitung",
  "mealPlan.prepTime": "Vorbereitung",
  "mealPlan.cookTime": "Kochzeit",
  "mealPlan.servings": "Portionen",
  "mealPlan.viewRecipe": "Rezept Anzeigen",
  "mealPlan.hideRecipe": "Rezept Ausblenden",
  "mealPlan.minutes": "Min",

  // ─── Menstrual Phase Meals ─────────────────────────────────────────────────

  "meal.menstrual.breakfast1.title": "Spinat-Beeren-Smoothie",
  "meal.menstrual.breakfast1.description":
    "Eisenreicher Spinat gemixt mit Beeren, Banane und einem Spritzer Orange für Vitamin C zur besseren Eisenaufnahme.",

  "meal.menstrual.breakfast2.title": "Warmer Haferbrei mit Datteln",
  "meal.menstrual.breakfast2.description":
    "Wärmender Haferbrei mit gehackten Datteln, Walnüssen und einem Schuss Honig. Reich an Eisen und Magnesium.",

  "meal.menstrual.lunch1.title": "Linsen-Gemüse-Suppe",
  "meal.menstrual.lunch1.description":
    "Herzhafte rote Linsensuppe mit Karotten, Sellerie und wärmenden Gewürzen wie Kurkuma und Kreuzkümmel. Reich an Eisen und Protein.",

  "meal.menstrual.lunch2.title": "Spinat-Kichererbsen-Salat",
  "meal.menstrual.lunch2.description":
    "Frischer Spinat mit gerösteten Kichererbsen, Paprika und Zitronen-Tahini-Dressing. Vollgepackt mit Eisen und Vitamin C.",

  "meal.menstrual.dinner1.title": "Rindfleisch-Pfanne",
  "meal.menstrual.dinner1.description":
    "Zarte Rindfleischstreifen mit Brokkoli, Zuckerschoten und Ingwersauce auf braunem Reis. Hervorragende Eisen- und B12-Quelle.",

  "meal.menstrual.dinner2.title": "Wärmender Wurzelgemüse-Eintopf",
  "meal.menstrual.dinner2.description":
    "Süßkartoffel, Karotten und Pastinaken in einer herzhaften Brühe mit Grünkohl und weißen Bohnen. Wärmend und nährstoffreich.",

  "meal.menstrual.snack1.title": "Dunkle Schokolade & Studentenfutter",
  "meal.menstrual.snack1.description":
    "Ein Stück 70% dunkle Schokolade mit einer kleinen Handvoll Kürbiskerne und getrockneter Aprikosen. Reich an Magnesium und Eisen.",

  // ─── Follicular Phase Meals ────────────────────────────────────────────────

  "meal.follicular.breakfast1.title": "Energiespendender Grüner Smoothie",
  "meal.follicular.breakfast1.description":
    "Grünkohl, Ananas, Ingwer und Proteinpulver gemixt mit Kokoswasser. Leicht, erfrischend und belebend.",

  "meal.follicular.breakfast2.title": "Griechisches Joghurt-Parfait",
  "meal.follicular.breakfast2.description":
    "Probiotischer griechischer Joghurt geschichtet mit Granola, frischen Beeren und einer Prise Chiasamen für die Darmgesundheit.",

  "meal.follicular.lunch1.title": "Regenbogen-Buddha-Bowl",
  "meal.follicular.lunch1.description":
    "Quinoa-Basis mit gerösteter Süßkartoffel, Edamame, geraspelten Karotten, Avocado und Ingwer-Sesam-Dressing.",

  "meal.follicular.lunch2.title": "Kimchi-Lachs-Bowl",
  "meal.follicular.lunch2.description":
    "Fermentiertes Kimchi mit gegrilltem Lachs, braunem Reis, Gurke und eingelegtem Gemüse. Probiotika trifft Omega-3.",

  "meal.follicular.dinner1.title": "Puten-Salat-Wraps",
  "meal.follicular.dinner1.description":
    "Gewürztes Putenhack in knackigen Salatblättern mit Mangosalsa, Avocado und einem Spritzer Limette. Leicht und sättigend.",

  "meal.follicular.dinner2.title": "Gebackener Kabeljau mit Spargel",
  "meal.follicular.dinner2.description":
    "Kräuter-Kabeljaufilet mit geröstetem Spargel und Zitrone. Leichtes, sauberes Protein mit Selen und Omega-3.",

  "meal.follicular.snack1.title": "Fermentierte Gemüsesticks",
  "meal.follicular.snack1.description":
    "Knackige Karotten- und Selleriesticks mit Sauerkraut und Hummus. Probiotika und Ballaststoffe in einem einfachen Snack.",

  // ─── Ovulation Phase Meals ─────────────────────────────────────────────────

  "meal.ovulation.breakfast1.title": "Beeren-Antioxidantien-Bowl",
  "meal.ovulation.breakfast1.description":
    "Açaí-Basis getoppt mit Blaubeeren, Erdbeeren, Hanfsamen und Kokosflocken. Voller Antioxidantien.",

  "meal.ovulation.breakfast2.title": "Avocado-Toast mit Ei",
  "meal.ovulation.breakfast2.description":
    "Vollkorntoast mit zerdrückter Avocado, pochierten Eiern und Gewürzmischung. Ausgewogenes Protein und gesunde Fette.",

  "meal.ovulation.lunch1.title": "Rohkost-Wrap",
  "meal.ovulation.lunch1.description":
    "Kohlblatt-Wraps gefüllt mit Hummus, geraspelter Rote Bete, Karotten, Sprossen und Sonnenblumenkernen. Leicht und nährstoffreich.",

  "meal.ovulation.lunch2.title": "Gegrillter Lachs-Salat",
  "meal.ovulation.lunch2.description":
    "Wildlachs auf gemischtem Blattsalat mit Kirschtomaten, Walnüssen und Olivenöl-Dressing. Reich an Omega-3 und Antioxidantien.",

  "meal.ovulation.dinner1.title": "Gebackener Lachs mit Gemüse",
  "meal.ovulation.dinner1.description":
    "Omega-3-reiches Lachsfilet mit geröstetem Rosenkohl und Süßkartoffel. Entzündungshemmend und sättigend.",

  "meal.ovulation.dinner2.title": "Mediterran Gefüllte Paprika",
  "meal.ovulation.dinner2.description":
    "Paprika gefüllt mit Quinoa, Tomaten, Oliven, Feta und frischen Kräutern. Leichte mediterrane Aromen.",

  "meal.ovulation.snack1.title": "Gemischte Beerenschale",
  "meal.ovulation.snack1.description":
    "Frische Blaubeeren, Himbeeren und Erdbeeren mit einem Spritzer Limette. Einfach, erfrischend und voller Vitamin C.",

  // ─── Luteal Phase Meals ────────────────────────────────────────────────────

  "meal.luteal.breakfast1.title": "Süßkartoffel-Pfannkuchen",
  "meal.luteal.breakfast1.description":
    "Fluffige Pfannkuchen aus Süßkartoffelpüree, Haferflocken und Zimt. Komplexe Kohlenhydrate für stabilen Blutzucker.",

  "meal.luteal.breakfast2.title": "Ei & Avocado-Toast",
  "meal.luteal.breakfast2.description":
    "Rührei auf Vollkorntoast mit Avocado und gerösteten Kürbiskernen für Magnesium.",

  "meal.luteal.lunch1.title": "Quinoa-Gefüllte Süßkartoffel",
  "meal.luteal.lunch1.description":
    "Gebackene Süßkartoffel gefüllt mit Kräuter-Quinoa, schwarzen Bohnen, Mais und einem Klecks griechischem Joghurt. Herzhaft und ausgewogen.",

  "meal.luteal.lunch2.title": "Butternut-Kürbissuppe",
  "meal.luteal.lunch2.description":
    "Cremige geröstete Butternut-Kürbissuppe mit wärmender Muskatnuss und einem Wirbel Kokoscreme. Wohltuend und magnesiumreich.",

  "meal.luteal.dinner1.title": "Lachs mit Quinoa-Pilaf",
  "meal.luteal.dinner1.description":
    "Gebackener Lachs mit Kräuter-Quinoa-Pilaf und gerösteten Mandeln. Omega-3 und Magnesium in jedem Bissen.",

  "meal.luteal.dinner2.title": "Wärmendes Kichererbsen-Curry",
  "meal.luteal.dinner2.description":
    "Kichererbsen in einem Kurkuma-Kokos-Curry mit Spinat auf braunem Reis. Entzündungshemmend und wärmend.",

  "meal.luteal.snack1.title": "Dunkle Schokolade & Mandeln",
  "meal.luteal.snack1.description":
    "Zwei Stücke dunkle Schokolade mit rohen Mandeln. Magnesium und gesunde Fette für Stimmung und gegen Heißhunger.",

  // ─── Life-stage labels ────────────────────────────────────────────────────

  phasePregnancy: "Schwangerschaft",
  phasePostpartum: "Wochenbett",
  phasePerimenopause: "Perimenopause",
  phaseMenopause: "Menopause",

  phaseDescPregnancy: "Nährstoffreiche Lebensmittel mit Folsäure, Eisen, Kalzium und Omega-3 für dich und dein Baby.",
  phaseDescPostpartum: "Erholungsfördernde Mahlzeiten mit Eisen, Protein und entzündungshemmenden Lebensmitteln zur Heilung.",
  phaseDescPerimenopause: "Phytoöstrogenreiche Lebensmittel, Kalzium und Magnesium für hormonelles Gleichgewicht und Knochengesundheit.",
  phaseDescMenopause: "Knochenstärkendes Kalzium, herzgesundes Omega-3 und antioxidantienreiche Lebensmittel für das Wohlbefinden.",

  // ─── Pregnancy Meals ──────────────────────────────────────────────────────

  "meal.pregnancy.breakfast1.title": "Linsen-Spinat-Rührei",
  "meal.pregnancy.breakfast1.description":
    "Rührei mit angebratenem Spinat und roten Linsen auf Vollkorntoast. Vollgepackt mit Folsäure und Eisen für die frühe Entwicklung.",

  "meal.pregnancy.breakfast2.title": "Kalziumreiche Joghurt-Bowl",
  "meal.pregnancy.breakfast2.description":
    "Griechischer Joghurt mit Mandelscheiben, Feigen und einem Schuss Honig. Hervorragende Kalzium- und Proteinquelle.",

  "meal.pregnancy.lunch1.title": "Blattgrün-Linsen-Salat",
  "meal.pregnancy.lunch1.description":
    "Gemischtes Blattgrün mit warmen Linsen, gerösteter Rote Bete, Paprika und Zitronen-Vinaigrette. Reich an Folsäure, Eisen und Vitamin C.",

  "meal.pregnancy.lunch2.title": "Nährende Bohnensuppe",
  "meal.pregnancy.lunch2.description":
    "Weiße-Bohnen-Gemüsesuppe mit Grünkohl und Vollkornbrot. Herzhaft, wärmend und voller Ballaststoffe und Eisen.",

  "meal.pregnancy.dinner1.title": "Gebackener Lachs mit Süßkartoffel",
  "meal.pregnancy.dinner1.description":
    "Wildlachs (vollständig gegart) mit gerösteter Süßkartoffel und gedämpftem Brokkoli. Omega-3 und DHA für die Gehirnentwicklung.",

  "meal.pregnancy.dinner2.title": "Eisenreiches Rindfleisch mit Grünzeug",
  "meal.pregnancy.dinner2.description":
    "Magere Rindfleischstreifen mit Spinat und kalziumangereichertem Reis. Hervorragende Eisen-, Kalzium- und Proteinquelle.",

  "meal.pregnancy.snack1.title": "Walnüsse & Joghurt",
  "meal.pregnancy.snack1.description":
    "Eine kleine Schüssel Joghurt mit zerkleinerten Walnüssen und gemahlenem Leinsamen. Kalzium, Omega-3 und Protein in einem Snack.",

  // ─── Postpartum Meals ─────────────────────────────────────────────────────

  "meal.postpartum.breakfast1.title": "Eisenspendende Eier & Toast",
  "meal.postpartum.breakfast1.description":
    "Rührei mit welkem Spinat auf eisenangereichtertem Toast. Hilft die Eisenspeicher nach der Geburt aufzufüllen.",

  "meal.postpartum.breakfast2.title": "Omega-3 Overnight Oats",
  "meal.postpartum.breakfast2.description":
    "Über Nacht eingeweichte Haferflocken mit Chiasamen, Walnüssen und Banane. Entzündungshemmendes Omega-3 und Ballaststoffe für die Erholung.",

  "meal.postpartum.lunch1.title": "Knochenbrühe & Gemüse-Bowl",
  "meal.postpartum.lunch1.description":
    "Reichhaltige Knochenbrühe mit zerkleinertem Hähnchen, Süßkartoffel und Grünzeug. Kollagen und Protein für die Gewebeheilung.",

  "meal.postpartum.lunch2.title": "Spinat-Quinoa-Power-Bowl",
  "meal.postpartum.lunch2.description":
    "Quinoa mit Babyspinat, gerösteten Kichererbsen und Zitronendressing. Eisen und Vitamin C zur Blutauffüllung.",

  "meal.postpartum.dinner1.title": "Lachs & Geröstetes Gemüse",
  "meal.postpartum.dinner1.description":
    "Gebackener Lachs mit einer Mischung aus geröstetem Wurzelgemüse. Omega-3-Fettsäuren für Stimmung und Erholung.",

  "meal.postpartum.dinner2.title": "Langsam Geschmorter Rindereintopf",
  "meal.postpartum.dinner2.description":
    "Zartes Rindfleisch mit Karotten, Kartoffeln und Kräutern in einer reichhaltigen Brühe. Eisen und Zink für die Heilung.",

  "meal.postpartum.snack1.title": "Studentenfutter mit Dunkler Schokolade",
  "meal.postpartum.snack1.description":
    "Walnüsse, Kürbiskerne und dunkle Schokoladenstücke. Omega-3 und Magnesium für Energie und Stimmung.",

  // ─── Perimenopause Meals ──────────────────────────────────────────────────

  "meal.perimenopause.breakfast1.title": "Leinsamen-Soja-Smoothie",
  "meal.perimenopause.breakfast1.description":
    "Sojamilch gemixt mit gemahlenem Leinsamen, Banane und Beeren. Phytoöstrogene und Ballaststoffe für hormonelles Gleichgewicht.",

  "meal.perimenopause.breakfast2.title": "Ei & Kalzium-Toast",
  "meal.perimenopause.breakfast2.description":
    "Pochierte Eier auf angereichertem Vollkorntoast mit kalziumreichem Käse. Protein und Vitamin D für die Knochengesundheit.",

  "meal.perimenopause.lunch1.title": "Edamame-Leinsamen-Bowl",
  "meal.perimenopause.lunch1.description":
    "Quinoa mit gedämpften Edamame, gemahlenem Leinsamen, geröstetem Gemüse und Tahini. Phytoöstrogene und Magnesium vereint.",

  "meal.perimenopause.lunch2.title": "Sardinen-Grünkohl-Salat",
  "meal.perimenopause.lunch2.description":
    "Grünkohlsalat mit Sardinen, weißen Bohnen und Zitronendressing. Omega-3, Kalzium und Vitamin D in einer Schüssel.",

  "meal.perimenopause.dinner1.title": "Tofu-Gemüse-Pfanne",
  "meal.perimenopause.dinner1.description":
    "Fester Tofu mit buntem Gemüse in Ingwer-Sojasauce auf braunem Reis. Phytoöstrogene und Magnesium für die Balance.",

  "meal.perimenopause.dinner2.title": "Gebackene Makrele mit Grünzeug",
  "meal.perimenopause.dinner2.description":
    "Omega-3-reiche Makrele mit angebratenen dunklen Blattgemüsen und gerösteter Süßkartoffel. Herz- und Knochenunterstützung.",

  "meal.perimenopause.snack1.title": "Dunkle Schokolade & Nussmischung",
  "meal.perimenopause.snack1.description":
    "Ein Stück dunkle Schokolade mit Mandeln und Paranüssen. Magnesium und Antioxidantien gegen Anspannung und für besseren Schlaf.",

  // ─── Menopause Meals ──────────────────────────────────────────────────────

  "meal.menopause.breakfast1.title": "Beeren-Blattgrün-Smoothie",
  "meal.menopause.breakfast1.description":
    "Blaubeeren, Grünkohl und Mandelmilch-Smoothie mit gemahlenem Leinsamen. Antioxidantien und Kalzium für Gehirn und Knochen.",

  "meal.menopause.breakfast2.title": "Omega-3-Rührei",
  "meal.menopause.breakfast2.description":
    "Omega-3-angereicherte Eier mit Spinat und Räucherlachs. Protein, gesunde Fette und Vitamin D.",

  "meal.menopause.lunch1.title": "Lachs-Avocado-Bowl",
  "meal.menopause.lunch1.description":
    "Gegrillter Lachs auf gemischtem Blattsalat mit Avocado, Walnüssen und Olivenöl-Dressing. Herzgesundes Omega-3 und Antioxidantien.",

  "meal.menopause.lunch2.title": "Brokkoli-Weiße-Bohnen-Suppe",
  "meal.menopause.lunch2.description":
    "Cremige Brokkolisuppe mit weißen Bohnen und Parmesan. Kalzium, Protein und Vitamin K für die Knochen.",

  "meal.menopause.dinner1.title": "Gegrillter Fisch mit Gemüse",
  "meal.menopause.dinner1.description":
    "Gegrillter Weißfisch mit geröstetem mediterranem Gemüse und Quinoa. Mageres Protein, Omega-3 und Vitamin D.",

  "meal.menopause.dinner2.title": "Hähnchen-Grünkohl-Bowl",
  "meal.menopause.dinner2.description":
    "Gegrillte Hähnchenbrust mit massiertem Grünkohl, gerösteter Süßkartoffel und Tahini. Protein für den Muskelerhalt und Kalzium.",

  "meal.menopause.snack1.title": "Beerenschale mit Nüssen",
  "meal.menopause.snack1.description":
    "Frische gemischte Beeren mit einer Handvoll Walnüssen. Antioxidantien für die Gehirngesundheit und Omega-3 fürs Herz.",
};

// ─── French ─────────────────────────────────────────────────────────────────

const fr: Record<string, string> = {
  // Screen
  screenTitle: "Menu du Jour",
  subtitle: "Nutrition adaptée à votre phase du cycle",

  // Phase labels
  phaseMenstrual: "Phase Menstruelle",
  phaseFollicular: "Phase Folliculaire",
  phaseOvulation: "Phase d'Ovulation",
  phaseLuteal: "Phase Lutéale",

  // Phase nutrition descriptions
  phaseDescMenstrual: "Privilégiez les aliments riches en fer et réconfortants pour recharger votre corps.",
  phaseDescFollicular: "Aliments légers, frais et fermentés pour accompagner votre montée d'énergie.",
  phaseDescOvulation: "Aliments anti-inflammatoires et légumes crus pour soutenir votre énergie maximale.",
  phaseDescLuteal: "Glucides complexes et aliments riches en magnésium pour atténuer les symptômes prémenstruels.",

  // Badge labels
  "mealPlan.antiInflammatory": "Anti-inflammatoire",

  // Meal type labels
  breakfast: "Petit-déjeuner",
  lunch: "Déjeuner",
  dinner: "Dîner",
  snack: "Collation",

  // Hydration
  hydrationTitle: "Objectif Hydratation",
  hydrationUnit: "verres aujourd'hui",
  hydrationGlassesOf: "sur",

  // Nutrients
  keyNutrientsTitle: "Nutriments Clés du Jour",
  avoidTitle: "Essayez de Réduire",

  // Navigation
  viewMealPlan: "Repas du Jour",

  // Recipe
  "mealPlan.ingredients": "Ingrédients",
  "mealPlan.steps": "Préparation",
  "mealPlan.prepTime": "Préparation",
  "mealPlan.cookTime": "Cuisson",
  "mealPlan.servings": "portions",
  "mealPlan.viewRecipe": "Voir la Recette",
  "mealPlan.hideRecipe": "Masquer la Recette",
  "mealPlan.minutes": "min",

  // ─── Menstrual Phase Meals ─────────────────────────────────────────────────

  "meal.menstrual.breakfast1.title": "Smoothie Épinards & Fruits Rouges",
  "meal.menstrual.breakfast1.description":
    "Épinards riches en fer mixés avec des fruits rouges, de la banane et un trait d'orange pour la vitamine C qui favorise l'absorption du fer.",

  "meal.menstrual.breakfast2.title": "Porridge Tiède aux Dattes",
  "meal.menstrual.breakfast2.description":
    "Flocons d'avoine réconfortants garnis de dattes hachées, de noix et d'un filet de miel. Riche en fer et magnésium.",

  "meal.menstrual.lunch1.title": "Soupe de Lentilles aux Légumes",
  "meal.menstrual.lunch1.description":
    "Soupe copieuse de lentilles corail avec carottes, céleri et épices réchauffantes comme le curcuma et le cumin. Riche en fer et protéines.",

  "meal.menstrual.lunch2.title": "Salade d'Épinards aux Pois Chiches",
  "meal.menstrual.lunch2.description":
    "Épinards frais avec pois chiches grillés, poivrons et sauce citron-tahini. Riche en fer et vitamine C.",

  "meal.menstrual.dinner1.title": "Sauté de Bœuf aux Légumes",
  "meal.menstrual.dinner1.description":
    "Lanières de bœuf tendres avec brocoli, pois mange-tout et sauce au gingembre sur riz complet. Excellente source de fer et de B12.",

  "meal.menstrual.dinner2.title": "Ragoût Réconfortant de Légumes Racines",
  "meal.menstrual.dinner2.description":
    "Patate douce, carottes et panais mijotés dans un bouillon savoureux avec du chou frisé et des haricots blancs. Réconfortant et nutritif.",

  "meal.menstrual.snack1.title": "Chocolat Noir & Mélange de Fruits Secs",
  "meal.menstrual.snack1.description":
    "Un carré de chocolat noir 70% avec une petite poignée de graines de courge et d'abricots secs. Riche en magnésium et fer.",

  // ─── Follicular Phase Meals ────────────────────────────────────────────────

  "meal.follicular.breakfast1.title": "Smoothie Vert Énergisant",
  "meal.follicular.breakfast1.description":
    "Chou frisé, ananas, gingembre et protéine en poudre mixés avec de l'eau de coco. Léger, rafraîchissant et énergisant.",

  "meal.follicular.breakfast2.title": "Parfait au Yaourt Grec",
  "meal.follicular.breakfast2.description":
    "Yaourt grec probiotique en couches avec du granola, des fruits frais et une pincée de graines de chia pour la santé intestinale.",

  "meal.follicular.lunch1.title": "Buddha Bowl Arc-en-Ciel",
  "meal.follicular.lunch1.description":
    "Base de quinoa avec patate douce rôtie, edamame, carottes râpées, avocat et sauce gingembre-sésame.",

  "meal.follicular.lunch2.title": "Bowl Saumon-Kimchi",
  "meal.follicular.lunch2.description":
    "Kimchi fermenté avec saumon grillé, riz complet, concombre et légumes marinés. Les probiotiques rencontrent les oméga-3.",

  "meal.follicular.dinner1.title": "Wraps de Dinde en Feuilles de Laitue",
  "meal.follicular.dinner1.description":
    "Dinde hachée assaisonnée dans des feuilles de laitue croquantes avec salsa de mangue, avocat et un filet de citron vert. Léger mais rassasiant.",

  "meal.follicular.dinner2.title": "Cabillaud au Four avec Asperges",
  "meal.follicular.dinner2.description":
    "Filet de cabillaud en croûte d'herbes avec asperges rôties et citron. Protéine légère et propre avec sélénium et oméga-3.",

  "meal.follicular.snack1.title": "Bâtonnets de Légumes Fermentés",
  "meal.follicular.snack1.description":
    "Bâtonnets croquants de carottes et céleri avec choucroute et houmous. Probiotiques et fibres dans une collation simple.",

  // ─── Ovulation Phase Meals ─────────────────────────────────────────────────

  "meal.ovulation.breakfast1.title": "Bowl Antioxydant aux Baies",
  "meal.ovulation.breakfast1.description":
    "Base d'açaï garnie de myrtilles, fraises, graines de chanvre et copeaux de noix de coco. Débordant d'antioxydants.",

  "meal.ovulation.breakfast2.title": "Toast Avocat-Œufs",
  "meal.ovulation.breakfast2.description":
    "Toast complet avec avocat écrasé, œufs pochés et assaisonnement. Protéines équilibrées et graisses saines.",

  "meal.ovulation.lunch1.title": "Wrap de Légumes Crus",
  "meal.ovulation.lunch1.description":
    "Wraps de feuilles de chou garnis de houmous, betterave râpée, carottes, germes et graines de tournesol. Léger et nutritif.",

  "meal.ovulation.lunch2.title": "Salade de Saumon Grillé",
  "meal.ovulation.lunch2.description":
    "Saumon sauvage sur mesclun avec tomates cerises, noix et vinaigrette à l'huile d'olive. Riche en oméga-3 et antioxydants.",

  "meal.ovulation.dinner1.title": "Saumon au Four avec Légumes",
  "meal.ovulation.dinner1.description":
    "Filet de saumon riche en oméga-3 avec choux de Bruxelles rôtis et patate douce. Anti-inflammatoire et rassasiant.",

  "meal.ovulation.dinner2.title": "Poivrons Farcis Méditerranéens",
  "meal.ovulation.dinner2.description":
    "Poivrons farcis de quinoa, tomates, olives, feta et herbes fraîches. Saveurs légères de la Méditerranée.",

  "meal.ovulation.snack1.title": "Coupe de Fruits Rouges",
  "meal.ovulation.snack1.description":
    "Myrtilles, framboises et fraises fraîches avec un trait de citron vert. Simple, rafraîchissant et riche en vitamine C.",

  // ─── Luteal Phase Meals ────────────────────────────────────────────────────

  "meal.luteal.breakfast1.title": "Pancakes à la Patate Douce",
  "meal.luteal.breakfast1.description":
    "Pancakes moelleux à base de purée de patate douce, flocons d'avoine et cannelle. Glucides complexes pour une glycémie stable.",

  "meal.luteal.breakfast2.title": "Toast Œuf & Avocat",
  "meal.luteal.breakfast2.description":
    "Œufs brouillés sur toast complet avec avocat et graines de courge grillées pour le magnésium.",

  "meal.luteal.lunch1.title": "Patate Douce Farcie au Quinoa",
  "meal.luteal.lunch1.description":
    "Patate douce au four farcie de quinoa aux herbes, haricots noirs, maïs et une cuillerée de yaourt grec. Copieux et équilibré.",

  "meal.luteal.lunch2.title": "Velouté de Butternut",
  "meal.luteal.lunch2.description":
    "Velouté crémeux de courge butternut rôtie avec noix de muscade et un filet de crème de coco. Apaisant et riche en magnésium.",

  "meal.luteal.dinner1.title": "Saumon avec Pilaf de Quinoa",
  "meal.luteal.dinner1.description":
    "Saumon au four accompagné d'un pilaf de quinoa aux herbes et amandes grillées. Oméga-3 et magnésium à chaque bouchée.",

  "meal.luteal.dinner2.title": "Curry Réconfortant de Pois Chiches",
  "meal.luteal.dinner2.description":
    "Pois chiches mijotés dans un curry curcuma-coco avec épinards sur riz complet. Anti-inflammatoire et réconfortant.",

  "meal.luteal.snack1.title": "Chocolat Noir & Amandes",
  "meal.luteal.snack1.description":
    "Deux carrés de chocolat noir avec des amandes crues. Magnésium et graisses saines pour l'humeur et contre les fringales.",

  // ─── Life-stage labels ────────────────────────────────────────────────────

  phasePregnancy: "Grossesse",
  phasePostpartum: "Post-partum",
  phasePerimenopause: "Périménopause",
  phaseMenopause: "Ménopause",

  phaseDescPregnancy: "Aliments riches en nutriments : folate, fer, calcium et oméga-3 pour vous et votre bébé.",
  phaseDescPostpartum: "Repas axés sur la récupération avec fer, protéines et aliments anti-inflammatoires pour la guérison.",
  phaseDescPerimenopause: "Aliments riches en phytoœstrogènes, calcium et magnésium pour l'équilibre hormonal et la santé osseuse.",
  phaseDescMenopause: "Calcium pour les os, oméga-3 pour le cœur et aliments riches en antioxydants pour le bien-être général.",

  // ─── Pregnancy Meals ──────────────────────────────────────────────────────

  "meal.pregnancy.breakfast1.title": "Œufs Brouillés Lentilles & Épinards",
  "meal.pregnancy.breakfast1.description":
    "Œufs brouillés avec épinards sautés et lentilles rouges sur toast complet. Riche en folate et fer pour le développement précoce.",

  "meal.pregnancy.breakfast2.title": "Bowl de Yaourt Riche en Calcium",
  "meal.pregnancy.breakfast2.description":
    "Yaourt grec garni d'amandes effilées, de figues et d'un filet de miel. Excellente source de calcium et protéines.",

  "meal.pregnancy.lunch1.title": "Salade de Légumes Verts & Lentilles",
  "meal.pregnancy.lunch1.description":
    "Mélange de jeunes pousses avec lentilles tièdes, betteraves rôties, poivrons et vinaigrette citron. Riche en folate, fer et vitamine C.",

  "meal.pregnancy.lunch2.title": "Soupe Nourrissante aux Haricots",
  "meal.pregnancy.lunch2.description":
    "Soupe de haricots blancs et légumes avec chou frisé et pain complet. Copieuse, réconfortante et pleine de fibres et fer.",

  "meal.pregnancy.dinner1.title": "Saumon au Four & Patate Douce",
  "meal.pregnancy.dinner1.description":
    "Saumon sauvage (bien cuit) avec patate douce rôtie et brocoli vapeur. Oméga-3 et DHA pour le développement cérébral.",

  "meal.pregnancy.dinner2.title": "Bœuf Riche en Fer & Légumes Verts",
  "meal.pregnancy.dinner2.description":
    "Lanières de bœuf maigre avec épinards sautés et riz enrichi en calcium. Excellente source de fer, calcium et protéines.",

  "meal.pregnancy.snack1.title": "Noix & Yaourt",
  "meal.pregnancy.snack1.description":
    "Un petit bol de yaourt avec des noix concassées et des graines de lin moulues. Calcium, oméga-3 et protéines en une collation.",

  // ─── Postpartum Meals ─────────────────────────────────────────────────────

  "meal.postpartum.breakfast1.title": "Œufs & Toast Boosters de Fer",
  "meal.postpartum.breakfast1.description":
    "Œufs brouillés avec épinards tombés sur toast enrichi en fer. Aide à reconstituer les réserves de fer après l'accouchement.",

  "meal.postpartum.breakfast2.title": "Overnight Oats Oméga-3",
  "meal.postpartum.breakfast2.description":
    "Flocons d'avoine trempés toute la nuit avec graines de chia, noix et banane. Oméga-3 anti-inflammatoires et fibres pour la récupération.",

  "meal.postpartum.lunch1.title": "Bowl Bouillon d'Os & Légumes",
  "meal.postpartum.lunch1.description":
    "Bouillon d'os riche avec poulet effiloché, patate douce et légumes verts. Collagène et protéines pour la guérison des tissus.",

  "meal.postpartum.lunch2.title": "Power Bowl Épinards & Quinoa",
  "meal.postpartum.lunch2.description":
    "Quinoa avec jeunes pousses d'épinards, pois chiches grillés et sauce citron. Fer et vitamine C pour reconstituer le sang.",

  "meal.postpartum.dinner1.title": "Saumon & Légumes Rôtis",
  "meal.postpartum.dinner1.description":
    "Saumon au four avec un assortiment de légumes racines rôtis. Acides gras oméga-3 pour l'humeur et la récupération.",

  "meal.postpartum.dinner2.title": "Ragoût de Bœuf Mijoté",
  "meal.postpartum.dinner2.description":
    "Bœuf tendre avec carottes, pommes de terre et herbes dans un bouillon riche. Fer et zinc pour la guérison de votre corps.",

  "meal.postpartum.snack1.title": "Mélange de Fruits Secs au Chocolat Noir",
  "meal.postpartum.snack1.description":
    "Noix, graines de courge et pépites de chocolat noir. Oméga-3 et magnésium pour l'énergie et l'humeur.",

  // ─── Perimenopause Meals ──────────────────────────────────────────────────

  "meal.perimenopause.breakfast1.title": "Smoothie Lin & Soja",
  "meal.perimenopause.breakfast1.description":
    "Lait de soja mixé avec des graines de lin moulues, banane et fruits rouges. Phytoœstrogènes et fibres pour l'équilibre hormonal.",

  "meal.perimenopause.breakfast2.title": "Toast Œuf & Calcium",
  "meal.perimenopause.breakfast2.description":
    "Œufs pochés sur toast complet enrichi avec fromage riche en calcium. Protéines et vitamine D pour la santé osseuse.",

  "meal.perimenopause.lunch1.title": "Bowl Edamame & Graines de Lin",
  "meal.perimenopause.lunch1.description":
    "Quinoa avec edamame vapeur, graines de lin moulues, légumes rôtis et tahini. Phytoœstrogènes et magnésium combinés.",

  "meal.perimenopause.lunch2.title": "Salade de Sardines & Chou Frisé",
  "meal.perimenopause.lunch2.description":
    "Salade de chou frisé avec sardines, haricots blancs et sauce citron. Oméga-3, calcium et vitamine D dans un seul bol.",

  "meal.perimenopause.dinner1.title": "Sauté de Tofu & Légumes",
  "meal.perimenopause.dinner1.description":
    "Tofu ferme avec légumes colorés en sauce gingembre-soja sur riz complet. Phytoœstrogènes et magnésium pour l'équilibre.",

  "meal.perimenopause.dinner2.title": "Maquereau au Four avec Verdure",
  "meal.perimenopause.dinner2.description":
    "Maquereau riche en oméga-3 avec légumes à feuilles foncées sautés et patate douce rôtie. Soutien cardiaque et osseux.",

  "meal.perimenopause.snack1.title": "Chocolat Noir & Mélange de Noix",
  "meal.perimenopause.snack1.description":
    "Un carré de chocolat noir avec amandes et noix du Brésil. Magnésium et antioxydants pour la détente et le sommeil.",

  // ─── Menopause Meals ──────────────────────────────────────────────────────

  "meal.menopause.breakfast1.title": "Smoothie Baies & Légumes Verts",
  "meal.menopause.breakfast1.description":
    "Myrtilles, chou frisé et lait d'amande avec graines de lin moulues. Antioxydants et calcium pour le cerveau et les os.",

  "meal.menopause.breakfast2.title": "Œufs Brouillés Oméga-3",
  "meal.menopause.breakfast2.description":
    "Œufs enrichis en oméga-3 avec épinards et saumon fumé. Protéines, graisses saines et vitamine D.",

  "meal.menopause.lunch1.title": "Bowl Saumon & Avocat",
  "meal.menopause.lunch1.description":
    "Saumon grillé sur mesclun avec avocat, noix et vinaigrette à l'huile d'olive. Oméga-3 bon pour le cœur et antioxydants.",

  "meal.menopause.lunch2.title": "Soupe Brocoli & Haricots Blancs",
  "meal.menopause.lunch2.description":
    "Velouté de brocoli aux haricots blancs et parmesan. Calcium, protéines et vitamine K pour les os.",

  "meal.menopause.dinner1.title": "Poisson Grillé aux Légumes",
  "meal.menopause.dinner1.description":
    "Poisson blanc grillé avec légumes méditerranéens rôtis et quinoa. Protéine maigre, oméga-3 et vitamine D.",

  "meal.menopause.dinner2.title": "Bowl Poulet & Chou Frisé",
  "meal.menopause.dinner2.description":
    "Blanc de poulet grillé avec chou frisé massé, patate douce rôtie et tahini. Protéines pour le maintien musculaire et calcium.",

  "meal.menopause.snack1.title": "Coupe de Baies aux Noix",
  "meal.menopause.snack1.description":
    "Fruits rouges frais avec une poignée de noix. Antioxydants pour le cerveau et oméga-3 pour le cœur.",
};

// ─── Spanish ────────────────────────────────────────────────────────────────

const es: Record<string, string> = {
  // Screen
  screenTitle: "Plan de Comidas de Hoy",
  subtitle: "Nutrición sincronizada con tu ciclo",

  // Phase labels
  phaseMenstrual: "Fase Menstrual",
  phaseFollicular: "Fase Folicular",
  phaseOvulation: "Fase de Ovulación",
  phaseLuteal: "Fase Lútea",

  // Phase nutrition descriptions
  phaseDescMenstrual: "Prioriza alimentos ricos en hierro y reconfortantes para reponer lo que tu cuerpo necesita.",
  phaseDescFollicular: "Alimentos ligeros, frescos y fermentados para acompañar tu energía en aumento.",
  phaseDescOvulation: "Alimentos antiinflamatorios y verduras crudas para potenciar tu máxima energía.",
  phaseDescLuteal: "Carbohidratos complejos y alimentos ricos en magnesio para aliviar los síntomas premenstruales.",

  // Badge labels
  "mealPlan.antiInflammatory": "Antiinflamatorio",

  // Meal type labels
  breakfast: "Desayuno",
  lunch: "Almuerzo",
  dinner: "Cena",
  snack: "Merienda",

  // Hydration
  hydrationTitle: "Meta de Hidratación",
  hydrationUnit: "vasos hoy",
  hydrationGlassesOf: "de",

  // Nutrients
  keyNutrientsTitle: "Nutrientes Clave de Hoy",
  avoidTitle: "Intenta Reducir",

  // Navigation
  viewMealPlan: "Comidas de Hoy",

  // Recipe
  "mealPlan.ingredients": "Ingredientes",
  "mealPlan.steps": "Preparación",
  "mealPlan.prepTime": "Preparación",
  "mealPlan.cookTime": "Cocción",
  "mealPlan.servings": "porciones",
  "mealPlan.viewRecipe": "Ver Receta",
  "mealPlan.hideRecipe": "Ocultar Receta",
  "mealPlan.minutes": "min",

  // ─── Menstrual Phase Meals ─────────────────────────────────────────────────

  "meal.menstrual.breakfast1.title": "Smoothie de Espinacas y Frutos Rojos",
  "meal.menstrual.breakfast1.description":
    "Espinacas ricas en hierro mezcladas con frutos rojos, plátano y un chorro de naranja para la vitamina C que favorece la absorción del hierro.",

  "meal.menstrual.breakfast2.title": "Avena Caliente con Dátiles",
  "meal.menstrual.breakfast2.description":
    "Avena reconfortante con dátiles picados, nueces y un chorrito de miel. Rica en hierro y magnesio.",

  "meal.menstrual.lunch1.title": "Sopa de Lentejas y Verduras",
  "meal.menstrual.lunch1.description":
    "Sopa contundente de lentejas rojas con zanahorias, apio y especias como cúrcuma y comino. Alta en hierro y proteínas.",

  "meal.menstrual.lunch2.title": "Ensalada de Espinacas y Garbanzos",
  "meal.menstrual.lunch2.description":
    "Espinacas frescas con garbanzos tostados, pimientos y aderezo de limón y tahini. Repleta de hierro y vitamina C.",

  "meal.menstrual.dinner1.title": "Salteado de Ternera con Verduras",
  "meal.menstrual.dinner1.description":
    "Tiras tiernas de ternera con brócoli, tirabeques y salsa de jengibre sobre arroz integral. Excelente fuente de hierro y B12.",

  "meal.menstrual.dinner2.title": "Estofado Reconfortante de Raíces",
  "meal.menstrual.dinner2.description":
    "Boniato, zanahorias y chirivías cocidos en un caldo sabroso con col rizada y alubias blancas. Reconfortante y nutritivo.",

  "meal.menstrual.snack1.title": "Chocolate Negro y Frutos Secos",
  "meal.menstrual.snack1.description":
    "Un trozo de chocolate negro al 70% con un puñado de semillas de calabaza y albaricoques secos. Rico en magnesio y hierro.",

  // ─── Follicular Phase Meals ────────────────────────────────────────────────

  "meal.follicular.breakfast1.title": "Smoothie Verde Energizante",
  "meal.follicular.breakfast1.description":
    "Col rizada, piña, jengibre y proteína en polvo mezclados con agua de coco. Ligero, refrescante y energizante.",

  "meal.follicular.breakfast2.title": "Parfait de Yogur Griego",
  "meal.follicular.breakfast2.description":
    "Yogur griego probiótico en capas con granola, frutos rojos frescos y una pizca de semillas de chía para la salud intestinal.",

  "meal.follicular.lunch1.title": "Buddha Bowl Arcoíris",
  "meal.follicular.lunch1.description":
    "Base de quinoa con boniato asado, edamame, zanahoria rallada, aguacate y aderezo de jengibre y sésamo.",

  "meal.follicular.lunch2.title": "Bowl de Salmón con Kimchi",
  "meal.follicular.lunch2.description":
    "Kimchi fermentado con salmón a la plancha, arroz integral, pepino y verduras encurtidas. Probióticos y omega-3 juntos.",

  "meal.follicular.dinner1.title": "Wraps de Pavo en Lechuga",
  "meal.follicular.dinner1.description":
    "Pavo picado condimentado en hojas de lechuga crujientes con salsa de mango, aguacate y un toque de lima. Ligero pero saciante.",

  "meal.follicular.dinner2.title": "Bacalao al Horno con Espárragos",
  "meal.follicular.dinner2.description":
    "Filete de bacalao con costra de hierbas, espárragos asados y limón. Proteína ligera con selenio y omega-3.",

  "meal.follicular.snack1.title": "Palitos de Verduras Fermentadas",
  "meal.follicular.snack1.description":
    "Palitos crujientes de zanahoria y apio con chucrut y hummus. Probióticos y fibra en una merienda sencilla.",

  // ─── Ovulation Phase Meals ─────────────────────────────────────────────────

  "meal.ovulation.breakfast1.title": "Bowl Antioxidante de Frutos Rojos",
  "meal.ovulation.breakfast1.description":
    "Base de açaí cubierta con arándanos, fresas, semillas de cáñamo y virutas de coco. Repleto de antioxidantes.",

  "meal.ovulation.breakfast2.title": "Tostada de Aguacate con Huevos",
  "meal.ovulation.breakfast2.description":
    "Tostada integral con aguacate machacado, huevos pochados y condimentos. Proteínas equilibradas y grasas saludables.",

  "meal.ovulation.lunch1.title": "Wrap de Verduras Crudas",
  "meal.ovulation.lunch1.description":
    "Wraps de col rellenos de hummus, remolacha rallada, zanahoria, brotes y semillas de girasol. Ligero y nutritivo.",

  "meal.ovulation.lunch2.title": "Ensalada de Salmón a la Plancha",
  "meal.ovulation.lunch2.description":
    "Salmón salvaje sobre mezcla de hojas verdes con tomates cherry, nueces y vinagreta de aceite de oliva. Rico en omega-3 y antioxidantes.",

  "meal.ovulation.dinner1.title": "Salmón al Horno con Verduras",
  "meal.ovulation.dinner1.description":
    "Filete de salmón rico en omega-3 con coles de Bruselas asadas y boniato. Antiinflamatorio y saciante.",

  "meal.ovulation.dinner2.title": "Pimientos Rellenos Mediterráneos",
  "meal.ovulation.dinner2.description":
    "Pimientos rellenos de quinoa, tomates, aceitunas, queso feta y hierbas frescas. Sabores ligeros del Mediterráneo.",

  "meal.ovulation.snack1.title": "Copa de Frutos Rojos",
  "meal.ovulation.snack1.description":
    "Arándanos, frambuesas y fresas frescas con un chorrito de lima. Simple, refrescante y repleta de vitamina C.",

  // ─── Luteal Phase Meals ────────────────────────────────────────────────────

  "meal.luteal.breakfast1.title": "Tortitas de Boniato",
  "meal.luteal.breakfast1.description":
    "Tortitas esponjosas de puré de boniato, avena y canela. Carbohidratos complejos para mantener estable el azúcar en sangre.",

  "meal.luteal.breakfast2.title": "Tostada de Huevo y Aguacate",
  "meal.luteal.breakfast2.description":
    "Huevos revueltos sobre tostada integral con aguacate y semillas de calabaza tostadas para el magnesio.",

  "meal.luteal.lunch1.title": "Boniato Relleno de Quinoa",
  "meal.luteal.lunch1.description":
    "Boniato al horno relleno de quinoa con hierbas, frijoles negros, maíz y una cucharada de yogur griego. Contundente y equilibrado.",

  "meal.luteal.lunch2.title": "Crema de Calabaza Butternut",
  "meal.luteal.lunch2.description":
    "Crema de calabaza butternut asada con nuez moscada y un toque de crema de coco. Reconfortante y rica en magnesio.",

  "meal.luteal.dinner1.title": "Salmón con Pilaf de Quinoa",
  "meal.luteal.dinner1.description":
    "Salmón al horno acompañado de pilaf de quinoa con hierbas y almendras tostadas. Omega-3 y magnesio en cada bocado.",

  "meal.luteal.dinner2.title": "Curry Reconfortante de Garbanzos",
  "meal.luteal.dinner2.description":
    "Garbanzos cocidos en un curry de cúrcuma y coco con espinacas sobre arroz integral. Antiinflamatorio y reconfortante.",

  "meal.luteal.snack1.title": "Chocolate Negro y Almendras",
  "meal.luteal.snack1.description":
    "Dos trozos de chocolate negro con almendras crudas. Magnesio y grasas saludables para el ánimo y contra los antojos.",

  // ─── Life-stage labels ────────────────────────────────────────────────────

  phasePregnancy: "Embarazo",
  phasePostpartum: "Postparto",
  phasePerimenopause: "Perimenopausia",
  phaseMenopause: "Menopausia",

  phaseDescPregnancy: "Alimentos ricos en nutrientes con folato, hierro, calcio y omega-3 para ti y tu bebé.",
  phaseDescPostpartum: "Comidas enfocadas en la recuperación con hierro, proteínas y alimentos antiinflamatorios para la curación.",
  phaseDescPerimenopause: "Alimentos ricos en fitoestrógenos, calcio y magnesio para el equilibrio hormonal y la salud ósea.",
  phaseDescMenopause: "Calcio para los huesos, omega-3 para el corazón y alimentos antioxidantes para el bienestar general.",

  // ─── Pregnancy Meals ──────────────────────────────────────────────────────

  "meal.pregnancy.breakfast1.title": "Revuelto de Lentejas y Espinacas",
  "meal.pregnancy.breakfast1.description":
    "Huevos revueltos con espinacas salteadas y lentejas rojas sobre tostada integral. Repleto de folato y hierro para el desarrollo temprano.",

  "meal.pregnancy.breakfast2.title": "Bowl de Yogur Rico en Calcio",
  "meal.pregnancy.breakfast2.description":
    "Yogur griego con almendras laminadas, higos y un chorrito de miel. Gran fuente de calcio y proteínas.",

  "meal.pregnancy.lunch1.title": "Ensalada Verde con Lentejas",
  "meal.pregnancy.lunch1.description":
    "Mezcla de hojas verdes con lentejas tibias, remolacha asada, pimientos y vinagreta de limón. Rica en folato, hierro y vitamina C.",

  "meal.pregnancy.lunch2.title": "Sopa Nutritiva de Alubias",
  "meal.pregnancy.lunch2.description":
    "Sopa de alubias blancas y verduras con col rizada y pan integral. Contundente, reconfortante y llena de fibra y hierro.",

  "meal.pregnancy.dinner1.title": "Salmón al Horno con Boniato",
  "meal.pregnancy.dinner1.description":
    "Salmón salvaje (completamente cocido) con boniato asado y brócoli al vapor. Omega-3 y DHA para el desarrollo cerebral.",

  "meal.pregnancy.dinner2.title": "Ternera Rica en Hierro con Verduras",
  "meal.pregnancy.dinner2.description":
    "Tiras de ternera magra con espinacas salteadas y arroz enriquecido en calcio. Excelente fuente de hierro, calcio y proteínas.",

  "meal.pregnancy.snack1.title": "Nueces y Yogur",
  "meal.pregnancy.snack1.description":
    "Un pequeño bol de yogur con nueces trituradas y semillas de lino molidas. Calcio, omega-3 y proteínas en una merienda.",

  // ─── Postpartum Meals ─────────────────────────────────────────────────────

  "meal.postpartum.breakfast1.title": "Huevos y Tostada Ricos en Hierro",
  "meal.postpartum.breakfast1.description":
    "Huevos revueltos con espinacas pochadas sobre tostada enriquecida en hierro. Ayuda a reponer las reservas de hierro tras el parto.",

  "meal.postpartum.breakfast2.title": "Overnight Oats con Omega-3",
  "meal.postpartum.breakfast2.description":
    "Avena remojada durante la noche con semillas de chía, nueces y plátano. Omega-3 antiinflamatorio y fibra para la recuperación.",

  "meal.postpartum.lunch1.title": "Bowl de Caldo de Huesos y Verduras",
  "meal.postpartum.lunch1.description":
    "Caldo de huesos rico con pollo desmenuzado, boniato y verduras de hoja verde. Colágeno y proteínas para la curación de tejidos.",

  "meal.postpartum.lunch2.title": "Power Bowl de Espinacas y Quinoa",
  "meal.postpartum.lunch2.description":
    "Quinoa con espinacas baby, garbanzos tostados y aderezo de limón. Hierro y vitamina C para reponer la sangre.",

  "meal.postpartum.dinner1.title": "Salmón y Verduras Asadas",
  "meal.postpartum.dinner1.description":
    "Salmón al horno con una variedad de raíces asadas. Ácidos grasos omega-3 para el ánimo y la recuperación.",

  "meal.postpartum.dinner2.title": "Estofado de Ternera a Fuego Lento",
  "meal.postpartum.dinner2.description":
    "Ternera tierna con zanahorias, patatas y hierbas en un caldo rico. Hierro y zinc para la curación del cuerpo.",

  "meal.postpartum.snack1.title": "Mix de Frutos Secos con Chocolate Negro",
  "meal.postpartum.snack1.description":
    "Nueces, semillas de calabaza y chips de chocolate negro. Omega-3 y magnesio para la energía y el ánimo.",

  // ─── Perimenopause Meals ──────────────────────────────────────────────────

  "meal.perimenopause.breakfast1.title": "Smoothie de Lino y Soja",
  "meal.perimenopause.breakfast1.description":
    "Leche de soja mezclada con semillas de lino molidas, plátano y frutos rojos. Fitoestrógenos y fibra para el equilibrio hormonal.",

  "meal.perimenopause.breakfast2.title": "Tostada de Huevo y Calcio",
  "meal.perimenopause.breakfast2.description":
    "Huevos pochados sobre tostada integral enriquecida con queso rico en calcio. Proteínas y vitamina D para la salud ósea.",

  "meal.perimenopause.lunch1.title": "Bowl de Edamame y Lino",
  "meal.perimenopause.lunch1.description":
    "Quinoa con edamame al vapor, semillas de lino molidas, verduras asadas y tahini. Fitoestrógenos y magnesio combinados.",

  "meal.perimenopause.lunch2.title": "Ensalada de Sardinas y Col Rizada",
  "meal.perimenopause.lunch2.description":
    "Ensalada de col rizada con sardinas, alubias blancas y aderezo de limón. Omega-3, calcio y vitamina D en un solo plato.",

  "meal.perimenopause.dinner1.title": "Salteado de Tofu y Verduras",
  "meal.perimenopause.dinner1.description":
    "Tofu firme con verduras coloridas en salsa de jengibre y soja sobre arroz integral. Fitoestrógenos y magnesio para el equilibrio.",

  "meal.perimenopause.dinner2.title": "Caballa al Horno con Verduras",
  "meal.perimenopause.dinner2.description":
    "Caballa rica en omega-3 con verduras de hoja oscura salteadas y boniato asado. Apoyo cardíaco y óseo en cada bocado.",

  "meal.perimenopause.snack1.title": "Chocolate Negro y Frutos Secos Variados",
  "meal.perimenopause.snack1.description":
    "Un trozo de chocolate negro con almendras y nueces de Brasil. Magnesio y antioxidantes para relajar y favorecer el sueño.",

  // ─── Menopause Meals ──────────────────────────────────────────────────────

  "meal.menopause.breakfast1.title": "Smoothie de Frutos Rojos y Hojas Verdes",
  "meal.menopause.breakfast1.description":
    "Arándanos, col rizada y leche de almendras con semillas de lino molidas. Antioxidantes y calcio para cerebro y huesos.",

  "meal.menopause.breakfast2.title": "Revuelto de Huevos Omega-3",
  "meal.menopause.breakfast2.description":
    "Huevos enriquecidos en omega-3 con espinacas y salmón ahumado. Proteínas, grasas saludables y vitamina D.",

  "meal.menopause.lunch1.title": "Bowl de Salmón y Aguacate",
  "meal.menopause.lunch1.description":
    "Salmón a la plancha sobre mezcla de hojas verdes con aguacate, nueces y vinagreta de aceite de oliva. Omega-3 cardiosaludable y antioxidantes.",

  "meal.menopause.lunch2.title": "Crema de Brócoli y Alubias Blancas",
  "meal.menopause.lunch2.description":
    "Crema de brócoli con alubias blancas y parmesano. Calcio, proteínas y vitamina K para los huesos.",

  "meal.menopause.dinner1.title": "Pescado a la Plancha con Verduras",
  "meal.menopause.dinner1.description":
    "Pescado blanco a la plancha con verduras mediterráneas asadas y quinoa. Proteína magra, omega-3 y vitamina D.",

  "meal.menopause.dinner2.title": "Bowl de Pollo y Col Rizada",
  "meal.menopause.dinner2.description":
    "Pechuga de pollo a la plancha con col rizada masajeada, boniato asado y tahini. Proteínas para el mantenimiento muscular y calcio.",

  "meal.menopause.snack1.title": "Copa de Frutos Rojos con Nueces",
  "meal.menopause.snack1.description":
    "Frutos rojos frescos variados con un puñado de nueces. Antioxidantes para el cerebro y omega-3 para el corazón.",
};

// ─── Italian ────────────────────────────────────────────────────────────────

const it: Record<string, string> = {
  // Screen
  screenTitle: "Piano Pasti di Oggi",
  subtitle: "Alimentazione sincronizzata con il tuo ciclo",

  // Phase labels
  phaseMenstrual: "Fase Mestruale",
  phaseFollicular: "Fase Follicolare",
  phaseOvulation: "Fase Ovulatoria",
  phaseLuteal: "Fase Luteale",

  // Phase nutrition descriptions
  phaseDescMenstrual: "Punta su alimenti ricchi di ferro e riscaldanti per reintegrare ciò di cui il tuo corpo ha bisogno.",
  phaseDescFollicular: "Cibi leggeri, freschi e fermentati per accompagnare l'energia in crescita.",
  phaseDescOvulation: "Alimenti antinfiammatori e verdure crude per sostenere il picco di energia.",
  phaseDescLuteal: "Carboidrati complessi e alimenti ricchi di magnesio per alleviare i sintomi premestruali.",

  // Badge labels
  "mealPlan.antiInflammatory": "Antinfiammatorio",

  // Meal type labels
  breakfast: "Colazione",
  lunch: "Pranzo",
  dinner: "Cena",
  snack: "Spuntino",

  // Hydration
  hydrationTitle: "Obiettivo Idratazione",
  hydrationUnit: "bicchieri oggi",
  hydrationGlassesOf: "di",

  // Nutrients
  keyNutrientsTitle: "Nutrienti Chiave di Oggi",
  avoidTitle: "Cerca di Ridurre",

  // Navigation
  viewMealPlan: "Pasti di Oggi",

  // Recipe
  "mealPlan.ingredients": "Ingredienti",
  "mealPlan.steps": "Preparazione",
  "mealPlan.prepTime": "Preparazione",
  "mealPlan.cookTime": "Cottura",
  "mealPlan.servings": "porzioni",
  "mealPlan.viewRecipe": "Vedi Ricetta",
  "mealPlan.hideRecipe": "Nascondi Ricetta",
  "mealPlan.minutes": "min",

  // ─── Menstrual Phase Meals ─────────────────────────────────────────────────

  "meal.menstrual.breakfast1.title": "Smoothie Spinaci e Frutti di Bosco",
  "meal.menstrual.breakfast1.description":
    "Spinaci ricchi di ferro frullati con frutti di bosco, banana e una spruzzata di arancia per la vitamina C che favorisce l'assorbimento del ferro.",

  "meal.menstrual.breakfast2.title": "Porridge Caldo con Datteri",
  "meal.menstrual.breakfast2.description":
    "Fiocchi d'avena confortanti con datteri tritati, noci e un filo di miele. Ricco di ferro e magnesio.",

  "meal.menstrual.lunch1.title": "Zuppa di Lenticchie e Verdure",
  "meal.menstrual.lunch1.description":
    "Zuppa sostanziosa di lenticchie rosse con carote, sedano e spezie riscaldanti come curcuma e cumino. Ricca di ferro e proteine.",

  "meal.menstrual.lunch2.title": "Insalata di Spinaci e Ceci",
  "meal.menstrual.lunch2.description":
    "Spinaci freschi con ceci tostati, peperoni e condimento limone-tahina. Ricca di ferro e vitamina C.",

  "meal.menstrual.dinner1.title": "Manzo Saltato in Padella",
  "meal.menstrual.dinner1.description":
    "Strisce di manzo tenero con broccoli, taccole e salsa allo zenzero su riso integrale. Ottima fonte di ferro e B12.",

  "meal.menstrual.dinner2.title": "Stufato di Radici Riscaldante",
  "meal.menstrual.dinner2.description":
    "Patata dolce, carote e pastinaca cotte in un brodo saporito con cavolo riccio e fagioli bianchi. Confortante e nutriente.",

  "meal.menstrual.snack1.title": "Cioccolato Fondente e Mix di Frutta Secca",
  "meal.menstrual.snack1.description":
    "Un quadratino di cioccolato fondente al 70% con una manciata di semi di zucca e albicocche secche. Ricco di magnesio e ferro.",

  // ─── Follicular Phase Meals ────────────────────────────────────────────────

  "meal.follicular.breakfast1.title": "Smoothie Verde Energizzante",
  "meal.follicular.breakfast1.description":
    "Cavolo riccio, ananas, zenzero e proteine in polvere frullati con acqua di cocco. Leggero, rinfrescante ed energizzante.",

  "meal.follicular.breakfast2.title": "Parfait di Yogurt Greco",
  "meal.follicular.breakfast2.description":
    "Yogurt greco probiotico a strati con granola, frutti di bosco freschi e una spolverata di semi di chia per la salute intestinale.",

  "meal.follicular.lunch1.title": "Buddha Bowl Arcobaleno",
  "meal.follicular.lunch1.description":
    "Base di quinoa con patata dolce arrosto, edamame, carote julienne, avocado e condimento zenzero-sesamo.",

  "meal.follicular.lunch2.title": "Bowl Salmone e Kimchi",
  "meal.follicular.lunch2.description":
    "Kimchi fermentato con salmone grigliato, riso integrale, cetriolo e verdure in agrodolce. Probiotici e omega-3 insieme.",

  "meal.follicular.dinner1.title": "Involtini di Tacchino in Lattuga",
  "meal.follicular.dinner1.description":
    "Tacchino macinato condito in foglie di lattuga croccanti con salsa al mango, avocado e un goccio di lime. Leggero ma saziante.",

  "meal.follicular.dinner2.title": "Merluzzo al Forno con Asparagi",
  "meal.follicular.dinner2.description":
    "Filetto di merluzzo in crosta di erbe con asparagi arrosto e limone. Proteina leggera con selenio e omega-3.",

  "meal.follicular.snack1.title": "Bastoncini di Verdure Fermentate",
  "meal.follicular.snack1.description":
    "Bastoncini croccanti di carote e sedano con crauti e hummus. Probiotici e fibre in uno spuntino semplice.",

  // ─── Ovulation Phase Meals ─────────────────────────────────────────────────

  "meal.ovulation.breakfast1.title": "Bowl Antiossidante ai Frutti di Bosco",
  "meal.ovulation.breakfast1.description":
    "Base di açaí con mirtilli, fragole, semi di canapa e scaglie di cocco. Piena di antiossidanti.",

  "meal.ovulation.breakfast2.title": "Toast Avocado e Uova",
  "meal.ovulation.breakfast2.description":
    "Toast integrale con avocado schiacciato, uova in camicia e mix di spezie. Proteine bilanciate e grassi sani.",

  "meal.ovulation.lunch1.title": "Wrap di Verdure Crude",
  "meal.ovulation.lunch1.description":
    "Wraps di cavolo farciti con hummus, barbabietola grattugiata, carote, germogli e semi di girasole. Leggero e nutriente.",

  "meal.ovulation.lunch2.title": "Insalata di Salmone Grigliato",
  "meal.ovulation.lunch2.description":
    "Salmone selvaggio su insalata mista con pomodorini, noci e condimento all'olio d'oliva. Ricco di omega-3 e antiossidanti.",

  "meal.ovulation.dinner1.title": "Salmone al Forno con Verdure",
  "meal.ovulation.dinner1.description":
    "Filetto di salmone ricco di omega-3 con cavolini di Bruxelles arrosto e patata dolce. Antinfiammatorio e saziante.",

  "meal.ovulation.dinner2.title": "Peperoni Ripieni alla Mediterranea",
  "meal.ovulation.dinner2.description":
    "Peperoni farciti con quinoa, pomodori, olive, feta ed erbe fresche. Sapori leggeri del Mediterraneo.",

  "meal.ovulation.snack1.title": "Coppa di Frutti di Bosco",
  "meal.ovulation.snack1.description":
    "Mirtilli, lamponi e fragole fresche con una spruzzata di lime. Semplice, rinfrescante e ricca di vitamina C.",

  // ─── Luteal Phase Meals ────────────────────────────────────────────────────

  "meal.luteal.breakfast1.title": "Pancake alla Patata Dolce",
  "meal.luteal.breakfast1.description":
    "Pancake soffici a base di purea di patata dolce, fiocchi d'avena e cannella. Carboidrati complessi per una glicemia stabile.",

  "meal.luteal.breakfast2.title": "Toast Uovo e Avocado",
  "meal.luteal.breakfast2.description":
    "Uova strapazzate su toast integrale con avocado e semi di zucca tostati per il magnesio.",

  "meal.luteal.lunch1.title": "Patata Dolce Ripiena di Quinoa",
  "meal.luteal.lunch1.description":
    "Patata dolce al forno farcita con quinoa alle erbe, fagioli neri, mais e un cucchiaio di yogurt greco. Sostanziosa ed equilibrata.",

  "meal.luteal.lunch2.title": "Vellutata di Zucca Butternut",
  "meal.luteal.lunch2.description":
    "Vellutata cremosa di zucca butternut arrosto con noce moscata e un filo di crema di cocco. Calmante e ricca di magnesio.",

  "meal.luteal.dinner1.title": "Salmone con Pilaf di Quinoa",
  "meal.luteal.dinner1.description":
    "Salmone al forno con pilaf di quinoa alle erbe e mandorle tostate. Omega-3 e magnesio ad ogni boccone.",

  "meal.luteal.dinner2.title": "Curry Riscaldante di Ceci",
  "meal.luteal.dinner2.description":
    "Ceci cotti in un curry di curcuma e cocco con spinaci su riso integrale. Antinfiammatorio e riscaldante.",

  "meal.luteal.snack1.title": "Cioccolato Fondente e Mandorle",
  "meal.luteal.snack1.description":
    "Due quadratini di cioccolato fondente con mandorle crude. Magnesio e grassi sani per l'umore e contro la voglia di dolce.",

  // ─── Life-stage labels ────────────────────────────────────────────────────

  phasePregnancy: "Gravidanza",
  phasePostpartum: "Post-parto",
  phasePerimenopause: "Perimenopausa",
  phaseMenopause: "Menopausa",

  phaseDescPregnancy: "Alimenti ricchi di nutrienti con folato, ferro, calcio e omega-3 per te e il tuo bambino.",
  phaseDescPostpartum: "Pasti mirati al recupero con ferro, proteine e alimenti antinfiammatori per la guarigione.",
  phaseDescPerimenopause: "Alimenti ricchi di fitoestrogeni, calcio e magnesio per l'equilibrio ormonale e la salute ossea.",
  phaseDescMenopause: "Calcio per le ossa, omega-3 per il cuore e alimenti antiossidanti per il benessere generale.",

  // ─── Pregnancy Meals ──────────────────────────────────────────────────────

  "meal.pregnancy.breakfast1.title": "Uova Strapazzate con Lenticchie e Spinaci",
  "meal.pregnancy.breakfast1.description":
    "Uova strapazzate con spinaci saltati e lenticchie rosse su toast integrale. Ricche di folato e ferro per lo sviluppo iniziale.",

  "meal.pregnancy.breakfast2.title": "Bowl di Yogurt Ricco di Calcio",
  "meal.pregnancy.breakfast2.description":
    "Yogurt greco con mandorle a fette, fichi e un filo di miele. Ottima fonte di calcio e proteine.",

  "meal.pregnancy.lunch1.title": "Insalata Verde con Lenticchie",
  "meal.pregnancy.lunch1.description":
    "Mix di foglie verdi con lenticchie tiepide, barbabietole arrosto, peperoni e vinaigrette al limone. Ricca di folato, ferro e vitamina C.",

  "meal.pregnancy.lunch2.title": "Zuppa Nutriente di Fagioli",
  "meal.pregnancy.lunch2.description":
    "Zuppa di fagioli bianchi e verdure con cavolo riccio e pane integrale. Sostanziosa, riscaldante e ricca di fibre e ferro.",

  "meal.pregnancy.dinner1.title": "Salmone al Forno con Patata Dolce",
  "meal.pregnancy.dinner1.description":
    "Salmone selvaggio (ben cotto) con patata dolce arrosto e broccoli al vapore. Omega-3 e DHA per lo sviluppo cerebrale.",

  "meal.pregnancy.dinner2.title": "Manzo Ricco di Ferro con Verdure",
  "meal.pregnancy.dinner2.description":
    "Strisce di manzo magro con spinaci saltati e riso arricchito di calcio. Ottima fonte di ferro, calcio e proteine.",

  "meal.pregnancy.snack1.title": "Noci e Yogurt",
  "meal.pregnancy.snack1.description":
    "Una ciotolina di yogurt con noci tritate e semi di lino macinati. Calcio, omega-3 e proteine in uno spuntino.",

  // ─── Postpartum Meals ─────────────────────────────────────────────────────

  "meal.postpartum.breakfast1.title": "Uova e Toast Ricostituenti",
  "meal.postpartum.breakfast1.description":
    "Uova strapazzate con spinaci appassiti su toast arricchito di ferro. Aiuta a reintegrare le riserve di ferro dopo il parto.",

  "meal.postpartum.breakfast2.title": "Overnight Oats Omega-3",
  "meal.postpartum.breakfast2.description":
    "Fiocchi d'avena ammollati con semi di chia, noci e banana. Omega-3 antinfiammatori e fibre per il recupero.",

  "meal.postpartum.lunch1.title": "Bowl Brodo d'Ossa e Verdure",
  "meal.postpartum.lunch1.description":
    "Brodo d'ossa ricco con pollo sfilacciato, patata dolce e verdure. Collagene e proteine per la guarigione dei tessuti.",

  "meal.postpartum.lunch2.title": "Power Bowl Spinaci e Quinoa",
  "meal.postpartum.lunch2.description":
    "Quinoa con spinacini, ceci tostati e condimento al limone. Ferro e vitamina C per il ripristino del sangue.",

  "meal.postpartum.dinner1.title": "Salmone e Verdure Arrosto",
  "meal.postpartum.dinner1.description":
    "Salmone al forno con un mix di radici arrosto. Acidi grassi omega-3 per l'umore e il recupero.",

  "meal.postpartum.dinner2.title": "Stufato di Manzo a Cottura Lenta",
  "meal.postpartum.dinner2.description":
    "Manzo tenero con carote, patate ed erbe in un brodo ricco. Ferro e zinco per la guarigione del corpo.",

  "meal.postpartum.snack1.title": "Mix di Frutta Secca con Cioccolato Fondente",
  "meal.postpartum.snack1.description":
    "Noci, semi di zucca e gocce di cioccolato fondente. Omega-3 e magnesio per energia e umore.",

  // ─── Perimenopause Meals ──────────────────────────────────────────────────

  "meal.perimenopause.breakfast1.title": "Smoothie Semi di Lino e Soia",
  "meal.perimenopause.breakfast1.description":
    "Latte di soia frullato con semi di lino macinati, banana e frutti di bosco. Fitoestrogeni e fibre per l'equilibrio ormonale.",

  "meal.perimenopause.breakfast2.title": "Toast Uovo e Calcio",
  "meal.perimenopause.breakfast2.description":
    "Uova in camicia su toast integrale arricchito con formaggio ricco di calcio. Proteine e vitamina D per la salute ossea.",

  "meal.perimenopause.lunch1.title": "Bowl Edamame e Semi di Lino",
  "meal.perimenopause.lunch1.description":
    "Quinoa con edamame al vapore, semi di lino macinati, verdure arrosto e tahina. Fitoestrogeni e magnesio combinati.",

  "meal.perimenopause.lunch2.title": "Insalata di Sardine e Cavolo Riccio",
  "meal.perimenopause.lunch2.description":
    "Insalata di cavolo riccio con sardine, fagioli bianchi e condimento al limone. Omega-3, calcio e vitamina D in una ciotola.",

  "meal.perimenopause.dinner1.title": "Tofu e Verdure Saltati",
  "meal.perimenopause.dinner1.description":
    "Tofu compatto con verdure colorate in salsa zenzero-soia su riso integrale. Fitoestrogeni e magnesio per l'equilibrio.",

  "meal.perimenopause.dinner2.title": "Sgombro al Forno con Verdure",
  "meal.perimenopause.dinner2.description":
    "Sgombro ricco di omega-3 con verdure a foglia scura saltate e patata dolce arrosto. Supporto per cuore e ossa.",

  "meal.perimenopause.snack1.title": "Cioccolato Fondente e Frutta Secca Mista",
  "meal.perimenopause.snack1.description":
    "Un quadratino di cioccolato fondente con mandorle e noci del Brasile. Magnesio e antiossidanti per rilassarsi e dormire meglio.",

  // ─── Menopause Meals ──────────────────────────────────────────────────────

  "meal.menopause.breakfast1.title": "Smoothie Frutti di Bosco e Verdure",
  "meal.menopause.breakfast1.description":
    "Mirtilli, cavolo riccio e latte di mandorla con semi di lino macinati. Antiossidanti e calcio per cervello e ossa.",

  "meal.menopause.breakfast2.title": "Uova Strapazzate Omega-3",
  "meal.menopause.breakfast2.description":
    "Uova arricchite di omega-3 con spinaci e salmone affumicato. Proteine, grassi sani e vitamina D.",

  "meal.menopause.lunch1.title": "Bowl Salmone e Avocado",
  "meal.menopause.lunch1.description":
    "Salmone grigliato su insalata mista con avocado, noci e condimento all'olio d'oliva. Omega-3 per il cuore e antiossidanti.",

  "meal.menopause.lunch2.title": "Vellutata di Broccoli e Fagioli Bianchi",
  "meal.menopause.lunch2.description":
    "Vellutata di broccoli con fagioli bianchi e parmigiano. Calcio, proteine e vitamina K per le ossa.",

  "meal.menopause.dinner1.title": "Pesce alla Griglia con Verdure",
  "meal.menopause.dinner1.description":
    "Pesce bianco grigliato con verdure mediterranee arrosto e quinoa. Proteine magre, omega-3 e vitamina D.",

  "meal.menopause.dinner2.title": "Bowl Pollo e Cavolo Riccio",
  "meal.menopause.dinner2.description":
    "Petto di pollo grigliato con cavolo riccio massaggiato, patata dolce arrosto e tahina. Proteine per i muscoli e calcio.",

  "meal.menopause.snack1.title": "Coppa di Frutti di Bosco con Noci",
  "meal.menopause.snack1.description":
    "Frutti di bosco freschi misti con una manciata di noci. Antiossidanti per il cervello e omega-3 per il cuore.",
};

// ─── Dutch ──────────────────────────────────────────────────────────────────

const nl: Record<string, string> = {
  // Screen
  screenTitle: "Maaltijdplan van Vandaag",
  subtitle: "Cyclusafgestemde voeding voor jouw fase",

  // Phase labels
  phaseMenstrual: "Menstruatiefase",
  phaseFollicular: "Folliculaire Fase",
  phaseOvulation: "Ovulatiefase",
  phaseLuteal: "Luteale Fase",

  // Phase nutrition descriptions
  phaseDescMenstrual: "Focus op ijzerrijke, verwarmende gerechten om je lichaam aan te vullen.",
  phaseDescFollicular: "Lichte, frisse gerechten en gefermenteerde opties passend bij je stijgende energie.",
  phaseDescOvulation: "Ontstekingsremmend voedsel en rauwe groenten voor maximale energie.",
  phaseDescLuteal: "Complexe koolhydraten en magnesiumrijk voedsel om PMS-klachten te verlichten.",

  // Badge labels
  "mealPlan.antiInflammatory": "Ontstekingsremmend",

  // Meal type labels
  breakfast: "Ontbijt",
  lunch: "Lunch",
  dinner: "Avondeten",
  snack: "Tussendoortje",

  // Hydration
  hydrationTitle: "Hydratiedoel",
  hydrationUnit: "glazen vandaag",
  hydrationGlassesOf: "van",

  // Nutrients
  keyNutrientsTitle: "Belangrijke Voedingsstoffen Vandaag",
  avoidTitle: "Probeer te Verminderen",

  // Navigation
  viewMealPlan: "Maaltijden van Vandaag",

  // Recipe
  "mealPlan.ingredients": "Ingrediënten",
  "mealPlan.steps": "Bereidingswijze",
  "mealPlan.prepTime": "Voorbereiding",
  "mealPlan.cookTime": "Kooktijd",
  "mealPlan.servings": "porties",
  "mealPlan.viewRecipe": "Bekijk Recept",
  "mealPlan.hideRecipe": "Verberg Recept",
  "mealPlan.minutes": "min",

  // ─── Menstrual Phase Meals ─────────────────────────────────────────────────

  "meal.menstrual.breakfast1.title": "Spinazie-Bessensmoothie",
  "meal.menstrual.breakfast1.description":
    "IJzerrijke spinazie gemixt met bessen, banaan en een scheutje sinaasappel voor vitamine C die de ijzeropname bevordert.",

  "meal.menstrual.breakfast2.title": "Warme Havermout met Dadels",
  "meal.menstrual.breakfast2.description":
    "Verwarmende havermout met gehakte dadels, walnoten en een scheutje honing. Rijk aan ijzer en magnesium.",

  "meal.menstrual.lunch1.title": "Linzen-Groentesoep",
  "meal.menstrual.lunch1.description":
    "Stevige rode linzensoep met wortelen, selderij en verwarmende kruiden zoals kurkuma en komijn. Rijk aan ijzer en eiwitten.",

  "meal.menstrual.lunch2.title": "Spinazie-Kikkererwtsalade",
  "meal.menstrual.lunch2.description":
    "Verse spinazie met geroosterde kikkererwten, paprika en citroen-tahinidressing. Boordevol ijzer en vitamine C.",

  "meal.menstrual.dinner1.title": "Rundvlees Roerbak",
  "meal.menstrual.dinner1.description":
    "Malse rundvleesreepjes met broccoli, peultjes en gembersaus op zilvervliesrijst. Uitstekende bron van ijzer en B12.",

  "meal.menstrual.dinner2.title": "Verwarmende Wortelgroentestoofpot",
  "meal.menstrual.dinner2.description":
    "Zoete aardappel, wortelen en pastinaak gestoofd in een hartige bouillon met boerenkool en witte bonen. Troostend en voedzaam.",

  "meal.menstrual.snack1.title": "Pure Chocolade & Notenmix",
  "meal.menstrual.snack1.description":
    "Een stukje 70% pure chocolade met een handvol pompoenpitten en gedroogde abrikozen. Rijk aan magnesium en ijzer.",

  // ─── Follicular Phase Meals ────────────────────────────────────────────────

  "meal.follicular.breakfast1.title": "Energiegevende Groene Smoothie",
  "meal.follicular.breakfast1.description":
    "Boerenkool, ananas, gember en eiwitpoeder gemixt met kokoswater. Licht, verfrissend en energiegevend.",

  "meal.follicular.breakfast2.title": "Griekse Yoghurt Parfait",
  "meal.follicular.breakfast2.description":
    "Probiotische Griekse yoghurt in laagjes met granola, verse bessen en een snufje chiazaden voor een gezonde darm.",

  "meal.follicular.lunch1.title": "Regenboog Boeddha Bowl",
  "meal.follicular.lunch1.description":
    "Quinoabasis met geroosterde zoete aardappel, edamame, geraspte wortel, avocado en gember-sesamdressing.",

  "meal.follicular.lunch2.title": "Kimchi-Zalm Bowl",
  "meal.follicular.lunch2.description":
    "Gefermenteerde kimchi met gegrilde zalm, zilvervliesrijst, komkommer en ingemaakte groenten. Probiotica ontmoet omega-3.",

  "meal.follicular.dinner1.title": "Kalkoen-Slawraps",
  "meal.follicular.dinner1.description":
    "Gekruid kalkoengehakt in knapperige slablaadjes met mangosalsa, avocado en een scheutje limoen. Licht maar verzadigend.",

  "meal.follicular.dinner2.title": "Kabeljauw uit de Oven met Asperges",
  "meal.follicular.dinner2.description":
    "Kabeljauwfilet met kruidenkorst, geroosterde asperges en citroen. Licht, puur eiwit met selenium en omega-3.",

  "meal.follicular.snack1.title": "Gefermenteerde Groentesticks",
  "meal.follicular.snack1.description":
    "Knapperige wortel- en selderijsticks met zuurkool en hummus. Probiotica en vezels in één simpel tussendoortje.",

  // ─── Ovulation Phase Meals ─────────────────────────────────────────────────

  "meal.ovulation.breakfast1.title": "Bessen-Antioxidant Bowl",
  "meal.ovulation.breakfast1.description":
    "Açaíbasis getopt met blauwe bessen, aardbeien, hennepzaden en kokosvlokken. Boordevol antioxidanten.",

  "meal.ovulation.breakfast2.title": "Avocadotoast met Ei",
  "meal.ovulation.breakfast2.description":
    "Volkoren toast met geprakte avocado, gepocheerde eieren en kruidenmix. Uitgebalanceerde eiwitten en gezonde vetten.",

  "meal.ovulation.lunch1.title": "Rauwe Groentewrap",
  "meal.ovulation.lunch1.description":
    "Koolbladwraps gevuld met hummus, geraspte biet, wortel, kiemgroenten en zonnebloempitten. Licht en voedzaam.",

  "meal.ovulation.lunch2.title": "Gegrilde Zalmsalade",
  "meal.ovulation.lunch2.description":
    "Wilde zalm op gemengde sla met cherrytomaatjes, walnoten en olijfoliedressing. Rijk aan omega-3 en antioxidanten.",

  "meal.ovulation.dinner1.title": "Zalm uit de Oven met Groenten",
  "meal.ovulation.dinner1.description":
    "Omega-3 rijke zalmfilet met geroosterde spruitjes en zoete aardappel. Ontstekingsremmend en verzadigend.",

  "meal.ovulation.dinner2.title": "Mediterraans Gevulde Paprika",
  "meal.ovulation.dinner2.description":
    "Paprika gevuld met quinoa, tomaten, olijven, feta en verse kruiden. Lichte Mediterrane smaken.",

  "meal.ovulation.snack1.title": "Gemengd Bessenbekertje",
  "meal.ovulation.snack1.description":
    "Verse blauwe bessen, frambozen en aardbeien met een scheutje limoen. Simpel, verfrissend en vol vitamine C.",

  // ─── Luteal Phase Meals ────────────────────────────────────────────────────

  "meal.luteal.breakfast1.title": "Zoete Aardappelpannenkoeken",
  "meal.luteal.breakfast1.description":
    "Luchtige pannenkoeken van zoete aardappelpuree, haver en kaneel. Complexe koolhydraten voor een stabiele bloedsuiker.",

  "meal.luteal.breakfast2.title": "Ei & Avocadotoast",
  "meal.luteal.breakfast2.description":
    "Roerei op volkoren toast met avocado en geroosterde pompoenpitten voor magnesium.",

  "meal.luteal.lunch1.title": "Met Quinoa Gevulde Zoete Aardappel",
  "meal.luteal.lunch1.description":
    "Gebakken zoete aardappel gevuld met kruiden-quinoa, zwarte bonen, maïs en een schep Griekse yoghurt. Stevig en uitgebalanceerd.",

  "meal.luteal.lunch2.title": "Butternut Pompoensoep",
  "meal.luteal.lunch2.description":
    "Romige geroosterde butternut pompoensoep met nootmuskaat en een swirl kokosroom. Troostend en magnesiumrijk.",

  "meal.luteal.dinner1.title": "Zalm met Quinoa Pilaf",
  "meal.luteal.dinner1.description":
    "Zalm uit de oven met kruiden-quinoapilaf en geroosterde amandelen. Omega-3 en magnesium bij elke hap.",

  "meal.luteal.dinner2.title": "Verwarmende Kikkererwten Curry",
  "meal.luteal.dinner2.description":
    "Kikkererwten gestoofd in een kurkuma-kokoscurry met spinazie op zilvervliesrijst. Ontstekingsremmend en verwarmend.",

  "meal.luteal.snack1.title": "Pure Chocolade & Amandelen",
  "meal.luteal.snack1.description":
    "Twee stukjes pure chocolade met rauwe amandelen. Magnesium en gezonde vetten voor je humeur en tegen trek.",

  // ─── Life-stage labels ────────────────────────────────────────────────────

  phasePregnancy: "Zwangerschap",
  phasePostpartum: "Postpartum",
  phasePerimenopause: "Perimenopauze",
  phaseMenopause: "Menopauze",

  phaseDescPregnancy: "Voedzame producten rijk aan foliumzuur, ijzer, calcium en omega-3 voor jou en je baby.",
  phaseDescPostpartum: "Herstelgerichte maaltijden met ijzer, eiwitten en ontstekingsremmend voedsel voor genezing.",
  phaseDescPerimenopause: "Voedsel rijk aan fytooestrogenen, calcium en magnesium voor hormonale balans en botgezondheid.",
  phaseDescMenopause: "Botbeschermend calcium, hartvriendelijk omega-3 en antioxidantrijk voedsel voor algeheel welzijn.",

  // ─── Pregnancy Meals ──────────────────────────────────────────────────────

  "meal.pregnancy.breakfast1.title": "Linzen-Spinazie Roerei",
  "meal.pregnancy.breakfast1.description":
    "Roerei met gesauteerde spinazie en rode linzen op volkoren toast. Boordevol foliumzuur en ijzer voor de vroege ontwikkeling.",

  "meal.pregnancy.breakfast2.title": "Calciumrijke Yoghurt Bowl",
  "meal.pregnancy.breakfast2.description":
    "Griekse yoghurt met geschaafde amandelen, vijgen en een scheutje honing. Geweldige bron van calcium en eiwitten.",

  "meal.pregnancy.lunch1.title": "Groene Salade met Linzen",
  "meal.pregnancy.lunch1.description":
    "Gemengd blad met warme linzen, geroosterde bieten, paprika en citroenvinaigrette. Rijk aan foliumzuur, ijzer en vitamine C.",

  "meal.pregnancy.lunch2.title": "Voedzame Bonensoep",
  "meal.pregnancy.lunch2.description":
    "Wittebonensoep met groenten, boerenkool en volkoren brood. Stevig, verwarmend en vol vezels en ijzer.",

  "meal.pregnancy.dinner1.title": "Zalm uit de Oven met Zoete Aardappel",
  "meal.pregnancy.dinner1.description":
    "Wilde zalm (goed doorbakken) met geroosterde zoete aardappel en gestoomde broccoli. Omega-3 en DHA voor hersenontwikkeling.",

  "meal.pregnancy.dinner2.title": "IJzerrijk Rundvlees met Groenten",
  "meal.pregnancy.dinner2.description":
    "Magere rundvleesreepjes met gesauteerde spinazie en calciumverrijkte rijst. Uitstekende bron van ijzer, calcium en eiwitten.",

  "meal.pregnancy.snack1.title": "Walnoten & Yoghurt",
  "meal.pregnancy.snack1.description":
    "Een schaaltje yoghurt met gekruimelde walnoten en gemalen lijnzaad. Calcium, omega-3 en eiwitten in één tussendoortje.",

  // ─── Postpartum Meals ─────────────────────────────────────────────────────

  "meal.postpartum.breakfast1.title": "IJzerversterkend Ei & Toast",
  "meal.postpartum.breakfast1.description":
    "Roerei met geslonken spinazie op ijzerverrijkt toast. Helpt de ijzervoorraden na de bevalling aan te vullen.",

  "meal.postpartum.breakfast2.title": "Omega-3 Overnight Oats",
  "meal.postpartum.breakfast2.description":
    "Haver geweekt met chiazaden, walnoten en banaan. Ontstekingsremmende omega-3 en vezels voor herstel.",

  "meal.postpartum.lunch1.title": "Beenderbouillon & Groente Bowl",
  "meal.postpartum.lunch1.description":
    "Rijke beenderbouillon met geplukte kip, zoete aardappel en groenten. Collageen en eiwitten voor weefselherstel.",

  "meal.postpartum.lunch2.title": "Spinazie-Quinoa Power Bowl",
  "meal.postpartum.lunch2.description":
    "Quinoa met babyspinazie, geroosterde kikkererwten en citroendressing. IJzer en vitamine C voor bloedaanmaak.",

  "meal.postpartum.dinner1.title": "Zalm & Geroosterde Groenten",
  "meal.postpartum.dinner1.description":
    "Zalm uit de oven met een mix van geroosterde wortelgroenten. Omega-3 vetzuren voor stemming en herstel.",

  "meal.postpartum.dinner2.title": "Langzaam Gegaard Rundvleesstoofpot",
  "meal.postpartum.dinner2.description":
    "Mals rundvlees met wortelen, aardappelen en kruiden in een rijke bouillon. IJzer en zink voor het herstel van je lichaam.",

  "meal.postpartum.snack1.title": "Notenmix met Pure Chocolade",
  "meal.postpartum.snack1.description":
    "Walnoten, pompoenpitten en pure chocoladestukjes. Omega-3 en magnesium voor energie en stemming.",

  // ─── Perimenopause Meals ──────────────────────────────────────────────────

  "meal.perimenopause.breakfast1.title": "Lijnzaad-Soja Smoothie",
  "meal.perimenopause.breakfast1.description":
    "Sojamelk gemixt met gemalen lijnzaad, banaan en bessen. Fytooestrogenen en vezels voor hormonale balans.",

  "meal.perimenopause.breakfast2.title": "Ei & Calcium Toast",
  "meal.perimenopause.breakfast2.description":
    "Gepocheerde eieren op verrijkt volkoren toast met calciumrijke kaas. Eiwitten en vitamine D voor botgezondheid.",

  "meal.perimenopause.lunch1.title": "Edamame-Lijnzaad Bowl",
  "meal.perimenopause.lunch1.description":
    "Quinoa met gestoomde edamame, gemalen lijnzaad, geroosterde groenten en tahini. Fytooestrogenen en magnesium gecombineerd.",

  "meal.perimenopause.lunch2.title": "Sardine-Boerenkoolsalade",
  "meal.perimenopause.lunch2.description":
    "Boerenkoolsalade met sardines, witte bonen en citroendressing. Omega-3, calcium en vitamine D in één kom.",

  "meal.perimenopause.dinner1.title": "Tofu-Groente Roerbak",
  "meal.perimenopause.dinner1.description":
    "Stevige tofu met kleurrijke groenten in gember-sojasaus op zilvervliesrijst. Fytooestrogenen en magnesium voor balans.",

  "meal.perimenopause.dinner2.title": "Makreel uit de Oven met Groenten",
  "meal.perimenopause.dinner2.description":
    "Omega-3 rijke makreel met gesauteerde donkere bladgroenten en geroosterde zoete aardappel. Hart- en botondersteuning.",

  "meal.perimenopause.snack1.title": "Pure Chocolade & Gemengde Noten",
  "meal.perimenopause.snack1.description":
    "Een stukje pure chocolade met amandelen en paranoten. Magnesium en antioxidanten voor ontspanning en betere slaap.",

  // ─── Menopause Meals ──────────────────────────────────────────────────────

  "meal.menopause.breakfast1.title": "Bessen- & Bladgroensmoothie",
  "meal.menopause.breakfast1.description":
    "Blauwe bessen, boerenkool en amandelmelk-smoothie met gemalen lijnzaad. Antioxidanten en calcium voor hersenen en botten.",

  "meal.menopause.breakfast2.title": "Omega-3 Roerei",
  "meal.menopause.breakfast2.description":
    "Omega-3 verrijkte eieren met spinazie en gerookte zalm. Eiwitten, gezonde vetten en vitamine D.",

  "meal.menopause.lunch1.title": "Zalm-Avocado Bowl",
  "meal.menopause.lunch1.description":
    "Gegrilde zalm op gemengde sla met avocado, walnoten en olijfoliedressing. Hartvriendelijk omega-3 en antioxidanten.",

  "meal.menopause.lunch2.title": "Broccoli-Wittebonensoep",
  "meal.menopause.lunch2.description":
    "Romige broccolisoep met witte bonen en parmezaan. Calcium, eiwitten en vitamine K voor de botten.",

  "meal.menopause.dinner1.title": "Gegrilde Vis met Groenten",
  "meal.menopause.dinner1.description":
    "Gegrilde witte vis met geroosterde mediterrane groenten en quinoa. Mager eiwit, omega-3 en vitamine D.",

  "meal.menopause.dinner2.title": "Kip-Boerenkool Bowl",
  "meal.menopause.dinner2.description":
    "Gegrilde kipfilet met gemasseerde boerenkool, geroosterde zoete aardappel en tahini. Eiwitten voor spieronderhoud en calcium.",

  "meal.menopause.snack1.title": "Bessenbekertje met Noten",
  "meal.menopause.snack1.description":
    "Verse gemengde bessen met een handvol walnoten. Antioxidanten voor de hersenen en omega-3 voor het hart.",
};

// ─── Polish ─────────────────────────────────────────────────────────────────

const pl: Record<string, string> = {
  // Screen
  screenTitle: "Dzisiejszy Plan Posiłków",
  subtitle: "Odżywianie dopasowane do fazy cyklu",

  // Phase labels
  phaseMenstrual: "Faza Menstruacyjna",
  phaseFollicular: "Faza Folikularna",
  phaseOvulation: "Faza Owulacji",
  phaseLuteal: "Faza Lutealna",

  // Phase nutrition descriptions
  phaseDescMenstrual: "Postaw na pokarmy bogate w żelazo i rozgrzewające, by uzupełnić to, czego potrzebuje Twoje ciało.",
  phaseDescFollicular: "Lekkie, świeże potrawy i opcje fermentowane, dopasowane do rosnącej energii.",
  phaseDescOvulation: "Pokarmy przeciwzapalne i surowe warzywa, by wspierać szczytową energię.",
  phaseDescLuteal: "Złożone węglowodany i pokarmy bogate w magnez, by złagodzić objawy przedmiesiączkowe.",

  // Badge labels
  "mealPlan.antiInflammatory": "Przeciwzapalny",

  // Meal type labels
  breakfast: "Śniadanie",
  lunch: "Obiad",
  dinner: "Kolacja",
  snack: "Przekąska",

  // Hydration
  hydrationTitle: "Cel Nawodnienia",
  hydrationUnit: "szklanek dzisiaj",
  hydrationGlassesOf: "z",

  // Nutrients
  keyNutrientsTitle: "Kluczowe Składniki Odżywcze Dziś",
  avoidTitle: "Postaraj Się Ograniczyć",

  // Navigation
  viewMealPlan: "Dzisiejsze Posiłki",

  // Recipe
  "mealPlan.ingredients": "Składniki",
  "mealPlan.steps": "Sposób Przygotowania",
  "mealPlan.prepTime": "Przygotowanie",
  "mealPlan.cookTime": "Gotowanie",
  "mealPlan.servings": "porcje",
  "mealPlan.viewRecipe": "Pokaż Przepis",
  "mealPlan.hideRecipe": "Ukryj Przepis",
  "mealPlan.minutes": "min",

  // ─── Menstrual Phase Meals ─────────────────────────────────────────────────

  "meal.menstrual.breakfast1.title": "Koktajl ze Szpinakiem i Jagodami",
  "meal.menstrual.breakfast1.description":
    "Bogaty w żelazo szpinak zmiksowany z owocami leśnymi, bananem i odrobiną soku z pomarańczy dla witaminy C wspomagającej wchłanianie żelaza.",

  "meal.menstrual.breakfast2.title": "Ciepła Owsianka z Daktylami",
  "meal.menstrual.breakfast2.description":
    "Rozgrzewająca owsianka z pokrojonymi daktylami, orzechami włoskimi i odrobiną miodu. Bogata w żelazo i magnez.",

  "meal.menstrual.lunch1.title": "Zupa z Soczewicy i Warzyw",
  "meal.menstrual.lunch1.description":
    "Sycąca zupa z czerwonej soczewicy z marchewką, selerem i rozgrzewającymi przyprawami jak kurkuma i kminek. Bogata w żelazo i białko.",

  "meal.menstrual.lunch2.title": "Sałatka ze Szpinakiem i Ciecierzycą",
  "meal.menstrual.lunch2.description":
    "Świeży szpinak z pieczoną ciecierzycą, papryką i sosem cytrynowo-tahini. Pełna żelaza i witaminy C.",

  "meal.menstrual.dinner1.title": "Smażona Wołowina z Warzywami",
  "meal.menstrual.dinner1.description":
    "Delikatne paski wołowiny z brokułami, groszkiem cukrowym i sosem imbirowym na brązowym ryżu. Doskonałe źródło żelaza i B12.",

  "meal.menstrual.dinner2.title": "Rozgrzewający Gulasz z Warzyw Korzeniowych",
  "meal.menstrual.dinner2.description":
    "Batat, marchewki i pasternak duszone w wywarze z jarmużem i białą fasolą. Kojący i pożywny.",

  "meal.menstrual.snack1.title": "Gorzka Czekolada i Mieszanka Orzechów",
  "meal.menstrual.snack1.description":
    "Kawałek 70% gorzkiej czekolady z garścią pestek dyni i suszonych moreli. Bogata w magnez i żelazo.",

  // ─── Follicular Phase Meals ────────────────────────────────────────────────

  "meal.follicular.breakfast1.title": "Energetyzujący Zielony Koktajl",
  "meal.follicular.breakfast1.description":
    "Jarmuż, ananas, imbir i białko w proszku zmiksowane z wodą kokosową. Lekki, orzeźwiający i dodający energii.",

  "meal.follicular.breakfast2.title": "Parfait z Jogurtem Greckim",
  "meal.follicular.breakfast2.description":
    "Probiotyczny jogurt grecki w warstwach z granolą, świeżymi jagodami i szczyptą nasion chia dla zdrowia jelit.",

  "meal.follicular.lunch1.title": "Tęczowa Miska Buddy",
  "meal.follicular.lunch1.description":
    "Baza z quinoa z pieczonym batatem, edamame, tartą marchewką, awokado i sosem imbirowo-sezamowym.",

  "meal.follicular.lunch2.title": "Miska z Łososiem i Kimchi",
  "meal.follicular.lunch2.description":
    "Fermentowane kimchi z grillowanym łososiem, brązowym ryżem, ogórkiem i kiszonymi warzywami. Probiotyki spotykają omega-3.",

  "meal.follicular.dinner1.title": "Wrapy z Indykiem w Sałacie",
  "meal.follicular.dinner1.description":
    "Przyprawiony mielony indyk w chrupiących liściach sałaty z salsą z mango, awokado i odrobiną limonki. Lekki, ale sycący.",

  "meal.follicular.dinner2.title": "Pieczony Dorsz ze Szparagami",
  "meal.follicular.dinner2.description":
    "Filet dorsza w ziołowej panierce z pieczonymi szparagami i cytryną. Lekkie białko z selenem i omega-3.",

  "meal.follicular.snack1.title": "Fermentowane Patyczki Warzywne",
  "meal.follicular.snack1.description":
    "Chrupiące patyczki z marchewki i selera z kiszoną kapustą i hummusem. Probiotyki i błonnik w jednej prostej przekąsce.",

  // ─── Ovulation Phase Meals ─────────────────────────────────────────────────

  "meal.ovulation.breakfast1.title": "Miska Antyoksydacyjna z Jagodami",
  "meal.ovulation.breakfast1.description":
    "Baza z açaí z borówkami, truskawkami, nasionami konopi i wiórkami kokosowymi. Pełna antyoksydantów.",

  "meal.ovulation.breakfast2.title": "Tost z Awokado i Jajkiem",
  "meal.ovulation.breakfast2.description":
    "Pełnoziarnisty tost z rozgniecionym awokado, jajkami w koszulkach i przyprawami. Zbilansowane białko i zdrowe tłuszcze.",

  "meal.ovulation.lunch1.title": "Wrap z Surowych Warzyw",
  "meal.ovulation.lunch1.description":
    "Wrapy z liści kapusty z hummusem, tartym burakiem, marchewką, kiełkami i pestkami słonecznika. Lekki i pożywny.",

  "meal.ovulation.lunch2.title": "Sałatka z Grillowanym Łososiem",
  "meal.ovulation.lunch2.description":
    "Dziki łosoś na mieszance sałat z pomidorkami koktajlowymi, orzechami włoskimi i dressingiem z oliwy. Bogata w omega-3 i antyoksydanty.",

  "meal.ovulation.dinner1.title": "Pieczony Łosoś z Warzywami",
  "meal.ovulation.dinner1.description":
    "Bogaty w omega-3 filet z łososia z pieczonymi brukselkami i batatem. Przeciwzapalny i sycący.",

  "meal.ovulation.dinner2.title": "Papryka Faszerowana po Śródziemnomorsku",
  "meal.ovulation.dinner2.description":
    "Papryka faszerowana quinoą, pomidorami, oliwkami, fetą i świeżymi ziołami. Lekkie śródziemnomorskie smaki.",

  "meal.ovulation.snack1.title": "Kubeczek z Jagodami",
  "meal.ovulation.snack1.description":
    "Świeże borówki, maliny i truskawki z odrobiną limonki. Proste, orzeźwiające i pełne witaminy C.",

  // ─── Luteal Phase Meals ────────────────────────────────────────────────────

  "meal.luteal.breakfast1.title": "Placki z Batata",
  "meal.luteal.breakfast1.description":
    "Puszyste placki z puree z batata, płatków owsianych i cynamonu. Złożone węglowodany dla stabilnego poziomu cukru.",

  "meal.luteal.breakfast2.title": "Tost z Jajkiem i Awokado",
  "meal.luteal.breakfast2.description":
    "Jajecznica na pełnoziarnistym toście z awokado i pieczonymi pestkami dyni dla magnezu.",

  "meal.luteal.lunch1.title": "Batat Faszerowany Quinoą",
  "meal.luteal.lunch1.description":
    "Pieczony batat nadziewany ziołową quinoą, czarną fasolą, kukurydzą i łyżką jogurtu greckiego. Sycący i zbilansowany.",

  "meal.luteal.lunch2.title": "Zupa Krem z Dyni Piżmowej",
  "meal.luteal.lunch2.description":
    "Kremowa zupa z pieczonej dyni piżmowej z gałką muszkatołową i nutą kremu kokosowego. Kojąca i bogata w magnez.",

  "meal.luteal.dinner1.title": "Łosoś z Piławem z Quinoa",
  "meal.luteal.dinner1.description":
    "Pieczony łosoś z ziołowym piławem z quinoa i prażonymi migdałami. Omega-3 i magnez w każdym kęsie.",

  "meal.luteal.dinner2.title": "Rozgrzewające Curry z Ciecierzycy",
  "meal.luteal.dinner2.description":
    "Ciecierzyca gotowana w curry z kurkumą i mlekiem kokosowym ze szpinakiem na brązowym ryżu. Przeciwzapalne i rozgrzewające.",

  "meal.luteal.snack1.title": "Gorzka Czekolada i Migdały",
  "meal.luteal.snack1.description":
    "Dwa kawałki gorzkiej czekolady z surowymi migdałami. Magnez i zdrowe tłuszcze dla nastroju i na zachcianki.",

  // ─── Life-stage labels ────────────────────────────────────────────────────

  phasePregnancy: "Ciąża",
  phasePostpartum: "Połóg",
  phasePerimenopause: "Perimenopauza",
  phaseMenopause: "Menopauza",

  phaseDescPregnancy: "Pożywne produkty bogate w kwas foliowy, żelazo, wapń i omega-3 dla Ciebie i Twojego dziecka.",
  phaseDescPostpartum: "Posiłki wspierające regenerację z żelazem, białkiem i pokarmami przeciwzapalnymi dla gojenia.",
  phaseDescPerimenopause: "Pokarmy bogate w fitoestrogeny, wapń i magnez dla równowagi hormonalnej i zdrowia kości.",
  phaseDescMenopause: "Wapń wzmacniający kości, omega-3 dla serca i pokarmy bogate w antyoksydanty dla ogólnego dobrostanu.",

  // ─── Pregnancy Meals ──────────────────────────────────────────────────────

  "meal.pregnancy.breakfast1.title": "Jajecznica z Soczewicą i Szpinakiem",
  "meal.pregnancy.breakfast1.description":
    "Jajecznica z podsmażonym szpinakiem i czerwoną soczewicą na pełnoziarnistym toście. Pełna kwasu foliowego i żelaza dla wczesnego rozwoju.",

  "meal.pregnancy.breakfast2.title": "Miska Jogurtowa Bogata w Wapń",
  "meal.pregnancy.breakfast2.description":
    "Jogurt grecki z płatkami migdałowymi, figami i odrobiną miodu. Świetne źródło wapnia i białka.",

  "meal.pregnancy.lunch1.title": "Zielona Sałatka z Soczewicą",
  "meal.pregnancy.lunch1.description":
    "Mieszanka zielonych liści z ciepłą soczewicą, pieczonymi burakami, papryką i cytrusowym winegretem. Bogata w kwas foliowy, żelazo i witaminę C.",

  "meal.pregnancy.lunch2.title": "Pożywna Zupa Fasolowa",
  "meal.pregnancy.lunch2.description":
    "Zupa z białej fasoli i warzyw z jarmużem i pełnoziarnistym chlebem. Sycąca, rozgrzewająca i pełna błonnika i żelaza.",

  "meal.pregnancy.dinner1.title": "Pieczony Łosoś z Batatem",
  "meal.pregnancy.dinner1.description":
    "Dziki łosoś (w pełni upieczony) z pieczonym batatem i brokułami na parze. Omega-3 i DHA dla rozwoju mózgu.",

  "meal.pregnancy.dinner2.title": "Wołowina Bogata w Żelazo z Zieleniną",
  "meal.pregnancy.dinner2.description":
    "Chude paski wołowiny z podsmażonym szpinakiem i ryżem wzbogaconym wapniem. Doskonałe źródło żelaza, wapnia i białka.",

  "meal.pregnancy.snack1.title": "Orzechy Włoskie i Jogurt",
  "meal.pregnancy.snack1.description":
    "Miseczka jogurtu z pokruszonymi orzechami włoskimi i mielonym siemieniem lnianym. Wapń, omega-3 i białko w jednej przekąsce.",

  // ─── Postpartum Meals ─────────────────────────────────────────────────────

  "meal.postpartum.breakfast1.title": "Jajka i Tost Wzmacniające Żelazo",
  "meal.postpartum.breakfast1.description":
    "Jajecznica z przywiędłym szpinakiem na wzbogaconym w żelazo toście. Pomaga uzupełnić zapasy żelaza po porodzie.",

  "meal.postpartum.breakfast2.title": "Nocna Owsianka Omega-3",
  "meal.postpartum.breakfast2.description":
    "Płatki owsiane moczone przez noc z nasionami chia, orzechami włoskimi i bananem. Przeciwzapalne omega-3 i błonnik dla regeneracji.",

  "meal.postpartum.lunch1.title": "Miska z Rosołem Kostnym i Warzywami",
  "meal.postpartum.lunch1.description":
    "Bogaty rosół kostny z rozdrobnionym kurczakiem, batatem i zieleniną. Kolagen i białko wspierające gojenie tkanek.",

  "meal.postpartum.lunch2.title": "Power Bowl ze Szpinakiem i Quinoą",
  "meal.postpartum.lunch2.description":
    "Quinoa z młodym szpinakiem, pieczoną ciecierzycą i sosem cytrynowym. Żelazo i witamina C dla odnowy krwi.",

  "meal.postpartum.dinner1.title": "Łosoś i Pieczone Warzywa",
  "meal.postpartum.dinner1.description":
    "Pieczony łosoś z mieszanką pieczonych warzyw korzeniowych. Kwasy tłuszczowe omega-3 dla nastroju i regeneracji.",

  "meal.postpartum.dinner2.title": "Wolno Gotowany Gulasz Wołowy",
  "meal.postpartum.dinner2.description":
    "Delikatna wołowina z marchewką, ziemniakami i ziołami w bogatym wywarze. Żelazo i cynk wspierające gojenie.",

  "meal.postpartum.snack1.title": "Mieszanka Orzechów z Gorzką Czekoladą",
  "meal.postpartum.snack1.description":
    "Orzechy włoskie, pestki dyni i kawałki gorzkiej czekolady. Omega-3 i magnez dla energii i nastroju.",

  // ─── Perimenopause Meals ──────────────────────────────────────────────────

  "meal.perimenopause.breakfast1.title": "Koktajl z Siemienia Lnianego i Soi",
  "meal.perimenopause.breakfast1.description":
    "Mleko sojowe zmiksowane z mielonym siemieniem lnianym, bananem i jagodami. Fitoestrogeny i błonnik dla równowagi hormonalnej.",

  "meal.perimenopause.breakfast2.title": "Tost z Jajkiem i Wapniem",
  "meal.perimenopause.breakfast2.description":
    "Jajka w koszulkach na wzbogaconym pełnoziarnistym toście z serem bogatym w wapń. Białko i witamina D dla zdrowia kości.",

  "meal.perimenopause.lunch1.title": "Miska z Edamame i Siemieniem Lnianym",
  "meal.perimenopause.lunch1.description":
    "Quinoa z gotowanym na parze edamame, mielonym siemieniem lnianym, pieczonymi warzywami i tahini. Fitoestrogeny i magnez w jednym.",

  "meal.perimenopause.lunch2.title": "Sałatka z Sardynek i Jarmużu",
  "meal.perimenopause.lunch2.description":
    "Sałatka z jarmużu z sardynkami, białą fasolą i sosem cytrynowym. Omega-3, wapń i witamina D w jednej misce.",

  "meal.perimenopause.dinner1.title": "Smażone Tofu z Warzywami",
  "meal.perimenopause.dinner1.description":
    "Twarde tofu z kolorowymi warzywami w sosie imbirowo-sojowym na brązowym ryżu. Fitoestrogeny i magnez dla równowagi.",

  "meal.perimenopause.dinner2.title": "Pieczona Makrela z Zieleniną",
  "meal.perimenopause.dinner2.description":
    "Bogata w omega-3 makrela z podsmażonymi ciemnymi warzywami liściastymi i pieczonym batatem. Wsparcie dla serca i kości.",

  "meal.perimenopause.snack1.title": "Gorzka Czekolada i Mieszane Orzechy",
  "meal.perimenopause.snack1.description":
    "Kawałek gorzkiej czekolady z migdałami i orzechami brazylijskimi. Magnez i antyoksydanty na rozluźnienie i lepszy sen.",

  // ─── Menopause Meals ──────────────────────────────────────────────────────

  "meal.menopause.breakfast1.title": "Koktajl Jagodowo-Szpinakowy",
  "meal.menopause.breakfast1.description":
    "Borówki, jarmuż i mleko migdałowe z mielonym siemieniem lnianym. Antyoksydanty i wapń dla mózgu i kości.",

  "meal.menopause.breakfast2.title": "Jajecznica Omega-3",
  "meal.menopause.breakfast2.description":
    "Jajka wzbogacone omega-3 z podsmażonym szpinakiem i wędzonym łososiem. Białko, zdrowe tłuszcze i witamina D.",

  "meal.menopause.lunch1.title": "Miska z Łososiem i Awokado",
  "meal.menopause.lunch1.description":
    "Grillowany łosoś na mieszance sałat z awokado, orzechami włoskimi i dressingiem z oliwy. Omega-3 dla serca i antyoksydanty.",

  "meal.menopause.lunch2.title": "Zupa z Brokułów i Białej Fasoli",
  "meal.menopause.lunch2.description":
    "Kremowa zupa brokułowa z białą fasolą i parmezanem. Wapń, białko i witamina K dla kości.",

  "meal.menopause.dinner1.title": "Grillowana Ryba z Warzywami",
  "meal.menopause.dinner1.description":
    "Grillowana biała ryba z pieczonymi warzywami śródziemnomorskimi i quinoą. Chude białko, omega-3 i witamina D.",

  "meal.menopause.dinner2.title": "Miska z Kurczakiem i Jarmużem",
  "meal.menopause.dinner2.description":
    "Grillowany filet z kurczaka z masowanym jarmużem, pieczonym batatem i tahini. Białko dla utrzymania mięśni i wapń.",

  "meal.menopause.snack1.title": "Kubeczek Jagodowy z Orzechami",
  "meal.menopause.snack1.description":
    "Świeże mieszane jagody z garścią orzechów włoskich. Antyoksydanty dla mózgu i omega-3 dla serca.",
};

// ─── Portuguese ─────────────────────────────────────────────────────────────

const pt: Record<string, string> = {
  // Screen
  screenTitle: "Plano Alimentar de Hoje",
  subtitle: "Nutrição sincronizada com a fase do seu ciclo",

  // Phase labels
  phaseMenstrual: "Fase Menstrual",
  phaseFollicular: "Fase Folicular",
  phaseOvulation: "Fase de Ovulação",
  phaseLuteal: "Fase Lútea",

  // Phase nutrition descriptions
  phaseDescMenstrual: "Priorize alimentos ricos em ferro e reconfortantes para repor o que o seu corpo precisa.",
  phaseDescFollicular: "Alimentos leves, frescos e fermentados para acompanhar a sua energia crescente.",
  phaseDescOvulation: "Alimentos anti-inflamatórios e vegetais crus para apoiar o pico de energia.",
  phaseDescLuteal: "Hidratos de carbono complexos e alimentos ricos em magnésio para aliviar os sintomas pré-menstruais.",

  // Badge labels
  "mealPlan.antiInflammatory": "Anti-inflamatório",

  // Meal type labels
  breakfast: "Pequeno-almoço",
  lunch: "Almoço",
  dinner: "Jantar",
  snack: "Lanche",

  // Hydration
  hydrationTitle: "Meta de Hidratação",
  hydrationUnit: "copos hoje",
  hydrationGlassesOf: "de",

  // Nutrients
  keyNutrientsTitle: "Nutrientes Chave de Hoje",
  avoidTitle: "Tente Reduzir",

  // Navigation
  viewMealPlan: "Refeições de Hoje",

  // Recipe
  "mealPlan.ingredients": "Ingredientes",
  "mealPlan.steps": "Modo de Preparo",
  "mealPlan.prepTime": "Preparação",
  "mealPlan.cookTime": "Cozimento",
  "mealPlan.servings": "porções",
  "mealPlan.viewRecipe": "Ver Receita",
  "mealPlan.hideRecipe": "Ocultar Receita",
  "mealPlan.minutes": "min",

  // ─── Menstrual Phase Meals ─────────────────────────────────────────────────

  "meal.menstrual.breakfast1.title": "Smoothie de Espinafre e Frutos Vermelhos",
  "meal.menstrual.breakfast1.description":
    "Espinafre rico em ferro batido com frutos vermelhos, banana e um toque de laranja para vitamina C que melhora a absorção de ferro.",

  "meal.menstrual.breakfast2.title": "Papas de Aveia Quentes com Tâmaras",
  "meal.menstrual.breakfast2.description":
    "Papas de aveia reconfortantes com tâmaras picadas, nozes e um fio de mel. Ricas em ferro e magnésio.",

  "meal.menstrual.lunch1.title": "Sopa de Lentilhas e Legumes",
  "meal.menstrual.lunch1.description":
    "Sopa reconfortante de lentilhas vermelhas com cenouras, aipo e especiarias como açafrão e cominho. Rica em ferro e proteína.",

  "meal.menstrual.lunch2.title": "Salada de Espinafre e Grão-de-Bico",
  "meal.menstrual.lunch2.description":
    "Espinafre fresco com grão-de-bico torrado, pimentos e molho de limão-tahini. Repleta de ferro e vitamina C.",

  "meal.menstrual.dinner1.title": "Salteado de Carne com Legumes",
  "meal.menstrual.dinner1.description":
    "Tiras tenras de carne com brócolos, ervilhas-tortas e molho de gengibre sobre arroz integral. Excelente fonte de ferro e B12.",

  "meal.menstrual.dinner2.title": "Estufado Reconfortante de Raízes",
  "meal.menstrual.dinner2.description":
    "Batata-doce, cenouras e pastinacas cozidas num caldo saboroso com couve e feijão branco. Reconfortante e nutritivo.",

  "meal.menstrual.snack1.title": "Chocolate Negro e Mistura de Frutos Secos",
  "meal.menstrual.snack1.description":
    "Um quadrado de chocolate negro 70% com um punhado de sementes de abóbora e alperces secos. Rico em magnésio e ferro.",

  // ─── Follicular Phase Meals ────────────────────────────────────────────────

  "meal.follicular.breakfast1.title": "Smoothie Verde Energizante",
  "meal.follicular.breakfast1.description":
    "Couve, ananás, gengibre e proteína em pó batidos com água de coco. Leve, refrescante e energizante.",

  "meal.follicular.breakfast2.title": "Parfait de Iogurte Grego",
  "meal.follicular.breakfast2.description":
    "Iogurte grego probiótico em camadas com granola, frutos frescos e uma pitada de sementes de chia para a saúde intestinal.",

  "meal.follicular.lunch1.title": "Tigela Buda Arco-Íris",
  "meal.follicular.lunch1.description":
    "Base de quinoa com batata-doce assada, edamame, cenoura ralada, abacate e molho de gengibre-sésamo.",

  "meal.follicular.lunch2.title": "Tigela de Salmão com Kimchi",
  "meal.follicular.lunch2.description":
    "Kimchi fermentado com salmão grelhado, arroz integral, pepino e legumes em conserva. Probióticos e ómega-3 juntos.",

  "meal.follicular.dinner1.title": "Wraps de Peru em Alface",
  "meal.follicular.dinner1.description":
    "Peru picado temperado em folhas de alface crocantes com salsa de manga, abacate e um toque de lima. Leve mas saciante.",

  "meal.follicular.dinner2.title": "Bacalhau no Forno com Espargos",
  "meal.follicular.dinner2.description":
    "Filé de bacalhau com crosta de ervas, espargos assados e limão. Proteína leve com selénio e ómega-3.",

  "meal.follicular.snack1.title": "Palitos de Legumes Fermentados",
  "meal.follicular.snack1.description":
    "Palitos crocantes de cenoura e aipo com chucrute e hummus. Probióticos e fibra num lanche simples.",

  // ─── Ovulation Phase Meals ─────────────────────────────────────────────────

  "meal.ovulation.breakfast1.title": "Tigela Antioxidante de Frutos Vermelhos",
  "meal.ovulation.breakfast1.description":
    "Base de açaí coberta com mirtilos, morangos, sementes de cânhamo e flocos de coco. Repleta de antioxidantes.",

  "meal.ovulation.breakfast2.title": "Torrada de Abacate com Ovos",
  "meal.ovulation.breakfast2.description":
    "Torrada integral com abacate esmagado, ovos escalfados e temperos. Proteína equilibrada e gorduras saudáveis.",

  "meal.ovulation.lunch1.title": "Wrap de Legumes Crus",
  "meal.ovulation.lunch1.description":
    "Wraps de couve recheados com hummus, beterraba ralada, cenoura, rebentos e sementes de girassol. Leve e nutritivo.",

  "meal.ovulation.lunch2.title": "Salada de Salmão Grelhado",
  "meal.ovulation.lunch2.description":
    "Salmão selvagem sobre mistura de folhas com tomate-cereja, nozes e vinagrete de azeite. Rico em ómega-3 e antioxidantes.",

  "meal.ovulation.dinner1.title": "Salmão no Forno com Legumes",
  "meal.ovulation.dinner1.description":
    "Filé de salmão rico em ómega-3 com couves-de-bruxelas assadas e batata-doce. Anti-inflamatório e saciante.",

  "meal.ovulation.dinner2.title": "Pimentos Recheados à Mediterrânica",
  "meal.ovulation.dinner2.description":
    "Pimentos recheados com quinoa, tomate, azeitonas, feta e ervas frescas. Sabores leves do Mediterrâneo.",

  "meal.ovulation.snack1.title": "Taça de Frutos Vermelhos",
  "meal.ovulation.snack1.description":
    "Mirtilos, framboesas e morangos frescos com um toque de lima. Simples, refrescante e repleta de vitamina C.",

  // ─── Luteal Phase Meals ────────────────────────────────────────────────────

  "meal.luteal.breakfast1.title": "Panquecas de Batata-Doce",
  "meal.luteal.breakfast1.description":
    "Panquecas fofas de puré de batata-doce, aveia e canela. Hidratos complexos para manter o açúcar no sangue estável.",

  "meal.luteal.breakfast2.title": "Torrada de Ovo e Abacate",
  "meal.luteal.breakfast2.description":
    "Ovos mexidos em torrada integral com abacate e sementes de abóbora torradas para magnésio.",

  "meal.luteal.lunch1.title": "Batata-Doce Recheada com Quinoa",
  "meal.luteal.lunch1.description":
    "Batata-doce assada recheada com quinoa às ervas, feijão preto, milho e uma colher de iogurte grego. Reconfortante e equilibrada.",

  "meal.luteal.lunch2.title": "Sopa de Abóbora Butternut",
  "meal.luteal.lunch2.description":
    "Sopa cremosa de abóbora butternut assada com noz-moscada e um toque de creme de coco. Reconfortante e rica em magnésio.",

  "meal.luteal.dinner1.title": "Salmão com Pilaf de Quinoa",
  "meal.luteal.dinner1.description":
    "Salmão no forno com pilaf de quinoa às ervas e amêndoas torradas. Ómega-3 e magnésio em cada garfada.",

  "meal.luteal.dinner2.title": "Caril Reconfortante de Grão-de-Bico",
  "meal.luteal.dinner2.description":
    "Grão-de-bico cozido num caril de açafrão e coco com espinafre sobre arroz integral. Anti-inflamatório e reconfortante.",

  "meal.luteal.snack1.title": "Chocolate Negro e Amêndoas",
  "meal.luteal.snack1.description":
    "Dois quadrados de chocolate negro com amêndoas cruas. Magnésio e gorduras saudáveis para o humor e contra desejos.",

  // ─── Life-stage labels ────────────────────────────────────────────────────

  phasePregnancy: "Gravidez",
  phasePostpartum: "Pós-parto",
  phasePerimenopause: "Perimenopausa",
  phaseMenopause: "Menopausa",

  phaseDescPregnancy: "Alimentos ricos em nutrientes com ácido fólico, ferro, cálcio e ómega-3 para si e o seu bebé.",
  phaseDescPostpartum: "Refeições focadas na recuperação com ferro, proteína e alimentos anti-inflamatórios para a cura.",
  phaseDescPerimenopause: "Alimentos ricos em fitoestrógenos, cálcio e magnésio para equilíbrio hormonal e saúde óssea.",
  phaseDescMenopause: "Cálcio para os ossos, ómega-3 para o coração e alimentos antioxidantes para o bem-estar geral.",

  // ─── Pregnancy Meals ──────────────────────────────────────────────────────

  "meal.pregnancy.breakfast1.title": "Ovos Mexidos com Lentilhas e Espinafre",
  "meal.pregnancy.breakfast1.description":
    "Ovos mexidos com espinafre salteado e lentilhas vermelhas em torrada integral. Repletos de ácido fólico e ferro para o desenvolvimento inicial.",

  "meal.pregnancy.breakfast2.title": "Tigela de Iogurte Rica em Cálcio",
  "meal.pregnancy.breakfast2.description":
    "Iogurte grego com amêndoas laminadas, figos e um fio de mel. Ótima fonte de cálcio e proteína.",

  "meal.pregnancy.lunch1.title": "Salada de Folhas Verdes com Lentilhas",
  "meal.pregnancy.lunch1.description":
    "Mistura de folhas verdes com lentilhas mornas, beterraba assada, pimentos e vinagrete de limão. Rica em ácido fólico, ferro e vitamina C.",

  "meal.pregnancy.lunch2.title": "Sopa Nutritiva de Feijão",
  "meal.pregnancy.lunch2.description":
    "Sopa de feijão branco e legumes com couve e pão integral. Reconfortante, quente e cheia de fibra e ferro.",

  "meal.pregnancy.dinner1.title": "Salmão no Forno com Batata-Doce",
  "meal.pregnancy.dinner1.description":
    "Salmão selvagem (completamente cozinhado) com batata-doce assada e brócolos a vapor. Ómega-3 e DHA para o desenvolvimento cerebral.",

  "meal.pregnancy.dinner2.title": "Carne Rica em Ferro com Verduras",
  "meal.pregnancy.dinner2.description":
    "Tiras de carne magra com espinafre salteado e arroz enriquecido com cálcio. Excelente fonte de ferro, cálcio e proteína.",

  "meal.pregnancy.snack1.title": "Nozes e Iogurte",
  "meal.pregnancy.snack1.description":
    "Uma tigela pequena de iogurte com nozes trituradas e sementes de linhaça moídas. Cálcio, ómega-3 e proteína num lanche.",

  // ─── Postpartum Meals ─────────────────────────────────────────────────────

  "meal.postpartum.breakfast1.title": "Ovos e Torrada para Repor Ferro",
  "meal.postpartum.breakfast1.description":
    "Ovos mexidos com espinafre murcho em torrada enriquecida com ferro. Ajuda a repor as reservas de ferro após o parto.",

  "meal.postpartum.breakfast2.title": "Overnight Oats com Ómega-3",
  "meal.postpartum.breakfast2.description":
    "Aveia demolhada durante a noite com sementes de chia, nozes e banana. Ómega-3 anti-inflamatório e fibra para a recuperação.",

  "meal.postpartum.lunch1.title": "Tigela de Caldo de Ossos e Legumes",
  "meal.postpartum.lunch1.description":
    "Caldo de ossos rico com frango desfiado, batata-doce e verduras. Colagénio e proteína para a cicatrização dos tecidos.",

  "meal.postpartum.lunch2.title": "Power Bowl de Espinafre e Quinoa",
  "meal.postpartum.lunch2.description":
    "Quinoa com espinafre bebé, grão-de-bico torrado e molho de limão. Ferro e vitamina C para a reposição sanguínea.",

  "meal.postpartum.dinner1.title": "Salmão e Legumes Assados",
  "meal.postpartum.dinner1.description":
    "Salmão no forno com uma variedade de raízes assadas. Ácidos gordos ómega-3 para o humor e recuperação.",

  "meal.postpartum.dinner2.title": "Estufado de Carne Lento",
  "meal.postpartum.dinner2.description":
    "Carne tenra com cenouras, batatas e ervas num caldo rico. Ferro e zinco para a cura do corpo.",

  "meal.postpartum.snack1.title": "Mistura de Frutos Secos com Chocolate Negro",
  "meal.postpartum.snack1.description":
    "Nozes, sementes de abóbora e pepitas de chocolate negro. Ómega-3 e magnésio para energia e humor.",

  // ─── Perimenopause Meals ──────────────────────────────────────────────────

  "meal.perimenopause.breakfast1.title": "Smoothie de Linhaça e Soja",
  "meal.perimenopause.breakfast1.description":
    "Leite de soja batido com sementes de linhaça moídas, banana e frutos vermelhos. Fitoestrógenos e fibra para o equilíbrio hormonal.",

  "meal.perimenopause.breakfast2.title": "Torrada de Ovo e Cálcio",
  "meal.perimenopause.breakfast2.description":
    "Ovos escalfados em torrada integral enriquecida com queijo rico em cálcio. Proteína e vitamina D para a saúde óssea.",

  "meal.perimenopause.lunch1.title": "Tigela de Edamame e Linhaça",
  "meal.perimenopause.lunch1.description":
    "Quinoa com edamame a vapor, sementes de linhaça moídas, legumes assados e tahini. Fitoestrógenos e magnésio combinados.",

  "meal.perimenopause.lunch2.title": "Salada de Sardinha e Couve",
  "meal.perimenopause.lunch2.description":
    "Salada de couve com sardinhas, feijão branco e molho de limão. Ómega-3, cálcio e vitamina D numa tigela.",

  "meal.perimenopause.dinner1.title": "Salteado de Tofu e Legumes",
  "meal.perimenopause.dinner1.description":
    "Tofu firme com legumes coloridos em molho de gengibre-soja sobre arroz integral. Fitoestrógenos e magnésio para o equilíbrio.",

  "meal.perimenopause.dinner2.title": "Cavala no Forno com Verduras",
  "meal.perimenopause.dinner2.description":
    "Cavala rica em ómega-3 com verduras de folha escura salteadas e batata-doce assada. Apoio cardíaco e ósseo em cada garfada.",

  "meal.perimenopause.snack1.title": "Chocolate Negro e Frutos Secos Variados",
  "meal.perimenopause.snack1.description":
    "Um quadrado de chocolate negro com amêndoas e castanhas-do-pará. Magnésio e antioxidantes para relaxar e dormir melhor.",

  // ─── Menopause Meals ──────────────────────────────────────────────────────

  "meal.menopause.breakfast1.title": "Smoothie de Frutos Vermelhos e Verduras",
  "meal.menopause.breakfast1.description":
    "Mirtilos, couve e leite de amêndoa com sementes de linhaça moídas. Antioxidantes e cálcio para o cérebro e os ossos.",

  "meal.menopause.breakfast2.title": "Ovos Mexidos Ómega-3",
  "meal.menopause.breakfast2.description":
    "Ovos enriquecidos com ómega-3 com espinafre e salmão fumado. Proteína, gorduras saudáveis e vitamina D.",

  "meal.menopause.lunch1.title": "Tigela de Salmão e Abacate",
  "meal.menopause.lunch1.description":
    "Salmão grelhado sobre mistura de folhas com abacate, nozes e vinagrete de azeite. Ómega-3 saudável para o coração e antioxidantes.",

  "meal.menopause.lunch2.title": "Sopa de Brócolos e Feijão Branco",
  "meal.menopause.lunch2.description":
    "Sopa cremosa de brócolos com feijão branco e parmesão. Cálcio, proteína e vitamina K para os ossos.",

  "meal.menopause.dinner1.title": "Peixe Grelhado com Legumes",
  "meal.menopause.dinner1.description":
    "Peixe branco grelhado com legumes mediterrânicos assados e quinoa. Proteína magra, ómega-3 e vitamina D.",

  "meal.menopause.dinner2.title": "Tigela de Frango e Couve",
  "meal.menopause.dinner2.description":
    "Peito de frango grelhado com couve massajada, batata-doce assada e tahini. Proteína para manutenção muscular e cálcio.",

  "meal.menopause.snack1.title": "Taça de Frutos Vermelhos com Nozes",
  "meal.menopause.snack1.description":
    "Frutos vermelhos frescos variados com um punhado de nozes. Antioxidantes para o cérebro e ómega-3 para o coração.",
};

export const mealTranslations: Record<Language, Record<string, string>> = {
  en, sv, de, fr, es, it, nl, pl, pt,
};

import { Language } from './translations';

export const chatTranslations: Record<Language, Record<string, string>> = {
  en: {
    // UI strings
    headerTitle: "Wellness Companion",
    headerSubtitle: "{phaseName} phase \u00b7 Day {cycleDay}",
    inputPlaceholder: "Ask IRIS anything...",
    welcomeMessage: "Hi there! I'm your IRIS wellness companion. I use your cycle, scan, and check-in data to give you personalized wellness guidance. Ask me anything about your energy, nutrition, stress, sleep, or mood.",
    quickTired: "Why am I tired?",
    quickEat: "What should I eat?",
    quickStress: "How's my stress?",
    quickSleep: "Sleep tips",

    // Phase names
    phaseMenstrual: "menstrual",
    phaseFollicular: "follicular",
    phaseOvulation: "ovulation",
    phaseLuteal: "luteal",

    // Energy/tired responses
    energyIntro: "You're on day {cycleDay} of your cycle ({phaseName} phase).",
    energyScoreToday: " Your energy score today is {energy}/10",
    energyLower: ", which is lower than your average of {avg}.",
    energyHigher: ", which is higher than your average of {avg}.",
    energySame: ", which is about the same as your average of {avg}.",
    energyLuteal: " Many people experience lower energy in the luteal phase. Consider gentle movement like walking or yoga, and try going to bed 30 minutes earlier tonight.",
    energyMenstrual: " During menstruation, your body is using extra energy. Prioritize rest, iron-rich foods like leafy greens, and stay well-hydrated.",
    energyFollicular: " The follicular phase usually brings rising energy. If you are still feeling tired, check your sleep quality and hydration levels.",
    energyOvulation: " During ovulation, energy is typically at its peak. If you are feeling tired, it may be worth checking your sleep and stress levels.",
    energyHighFatigue: " Your fatigue indicator is elevated today \u2014 consider a short power nap or a light stretching session.",

    // Food/nutrition responses
    foodIntro: "During the {phaseName} phase, ",
    foodLuteal: "your body may benefit from complex carbs, magnesium-rich foods (dark chocolate, nuts), and anti-inflammatory choices.",
    foodInflammation: " Your inflammation score is slightly higher today \u2014 consider adding turmeric or ginger to your meals.",
    foodMenstrual: "focus on iron-rich foods (spinach, lentils, red meat), warming soups, and anti-inflammatory options. Dark chocolate and magnesium-rich foods can also help with cramps.",
    foodFollicular: "your metabolism is picking up. Lean proteins, fresh vegetables, and fermented foods support rising estrogen. This is a great time to experiment with new recipes.",
    foodOvulation: "energy is high and your body handles carbs well. Focus on fiber-rich foods, healthy fats, and plenty of antioxidant-rich fruits and vegetables.",
    foodLowHydration: " Your hydration level is lower than ideal \u2014 aim for at least 8 glasses of water today.",

    // Stress responses
    stressIntro: "You're in the {phaseName} phase (day {cycleDay}).",
    stressScoreToday: " Your stress score today is {stress}/10",
    stressAvg: " (your average is {avg}).",
    stressHigh: " Your stress level is notably elevated. Try a 5-minute box breathing exercise: breathe in for 4 counts, hold 4, out 4, hold 4. Repeat 5 times.",
    stressModerate: " Your stress is moderate. A short walk outside, some deep breathing, or even a few minutes of journaling could help bring it down.",
    stressLow: " Your stress level looks well-managed today. Keep it up with whatever routine is working for you.",
    stressNoScan: " Complete a scan today to get personalized stress insights. In the meantime, try 5 minutes of deep breathing or a short walk.",
    stressLutealNote: " The luteal phase can amplify stress sensitivity \u2014 be extra kind to yourself this week.",

    // Sleep responses
    sleepLogged: "Based on your check-in, you logged {hours} hours of sleep. ",
    sleepLow: "That is below the recommended 7-9 hours. ",
    sleepSlightlyLow: "That is slightly under the optimal range. ",
    sleepGood: "That is within a healthy range. ",
    sleepLuteal: "During the luteal phase, progesterone rises which can make you feel sleepier but paradoxically disrupt deep sleep. Try magnesium before bed (200-400mg), avoid screens 1 hour before sleep, and keep your room cool (around 65-68\u00b0F / 18-20\u00b0C).",
    sleepMenstrual: "Menstruation can affect sleep quality. A warm bath before bed, chamomile tea, and gentle stretching can help. Consider a heating pad if cramps are disrupting your rest.",
    sleepFollicular: "Rising estrogen in the follicular phase generally supports better sleep. Use this time to establish good sleep habits: consistent bedtime, no caffeine after 2pm, and a dark, cool room.",
    sleepOvulation: "Around ovulation, body temperature rises slightly which can affect sleep. Keep your bedroom extra cool and consider light bedding. This is a good time to wind down with a calming routine.",
    sleepLowRecovery: " Your recovery score is low \u2014 prioritizing sleep tonight will help your body restore.",

    // Mood responses
    moodIntro: "You're in the {phaseName} phase. ",
    moodScoreToday: "Your mood today is {mood}/10. ",
    moodLow: "That is lower than ideal. ",
    moodLuteal: "The luteal phase can bring mood fluctuations due to shifting progesterone levels. Journaling, light exercise, and connecting with someone you trust can help stabilize your emotions.",
    moodMenstrual: "Hormones are at their lowest during menstruation, which can affect mood. Be gentle with yourself \u2014 self-care, rest, and comfort foods (in moderation) are all appropriate right now.",
    moodFollicular: "Rising estrogen typically brings improved mood and motivation. This is a great time for social activities, creative projects, and trying new things.",
    moodOvulation: "Ovulation often brings a mood peak thanks to high estrogen and a surge in LH. Enjoy this social, confident energy while it lasts.",

    // Exercise responses
    exerciseIntro: "For the {phaseName} phase (day {cycleDay}), ",
    exerciseMenstrual: "gentle movement like walking, yoga, or light stretching is recommended. Your body is recovering, so avoid pushing too hard.",
    exerciseFollicular: "your body is primed for strength gains. Try resistance training, HIIT, or learning new athletic skills. Energy and coordination are improving.",
    exerciseOvulation: "this is your peak performance window. Go for personal records, high-intensity workouts, or challenging group classes. Your body can handle more right now.",
    exerciseLuteal: "focus on moderate-intensity exercise. Pilates, moderate cardio, and yoga are great choices. As the phase progresses, transition to lighter activities.",
    exerciseLowEnergy: " However, your energy is quite low today \u2014 it is fine to do something gentle or take a rest day.",

    // Skin responses
    skinIntro: "During the {phaseName} phase, ",
    skinLuteal: "rising progesterone increases oil production and can trigger breakouts. Use gentle, non-comedogenic products, salicylic acid for blemishes, and niacinamide for oil control.",
    skinMenstrual: "skin may be sensitive and dry. Use hydrating, gentle products and avoid harsh exfoliants. Focus on soothing ingredients like aloe and centella.",
    skinFollicular: "estrogen is rising and skin typically looks clearer. This is a great time for exfoliation, vitamin C serums, and trying new active ingredients.",
    skinOvulation: "you are likely at your most radiant. Estrogen peaks create a natural glow. Keep your routine simple and enjoy it.",

    // Catch-all
    // Hydration responses
    hydrationIntro: "Staying well-hydrated is important during the {phaseName} phase. ",
    hydrationVeryLow: "Your hydration level is {hydration}/10 — that's quite low. Try to drink a glass of water right now and set reminders throughout the day. ",
    hydrationLow: "Your hydration level is {hydration}/10 — a bit below optimal. Aim for at least 8 glasses today. ",
    hydrationGood: "Your hydration level is {hydration}/10 — you're doing well! Keep it up. ",
    hydrationMenstrual: "During menstruation, you lose extra fluids. Warm herbal teas (ginger, chamomile) count toward hydration and can ease cramps too.",
    hydrationOvulation: "Around ovulation, your body temperature rises slightly. Increase water intake and add electrolytes if you're active.",
    hydrationLuteal: "In the luteal phase, progesterone can cause water retention. Paradoxically, drinking MORE water helps reduce bloating.",
    hydrationFollicular: "The follicular phase is a great time to build hydration habits. Try infusing water with lemon, cucumber, or berries for variety.",

    // Cramps/pain responses
    crampsIntro: "Let's talk about managing discomfort during the {phaseName} phase (day {cycleDay}). ",
    crampsMenstrual: "Menstrual cramps are caused by prostaglandins. Things that can help: a heating pad on your lower abdomen, gentle walking, magnesium-rich foods (dark chocolate, bananas), and anti-inflammatory teas like ginger or chamomile. Gentle yoga poses like child's pose and cat-cow can also ease tension.",
    crampsLuteal: "Pre-menstrual discomfort is common in the luteal phase. Magnesium supplements (200-400mg), calcium-rich foods, regular gentle exercise, and reducing caffeine and salt can all help manage PMS symptoms.",
    crampsOvulation: "Some people experience mittelschmerz — a brief, sharp pain during ovulation. This is normal. A warm compress and light movement usually help. If pain is severe or persistent, consult your healthcare provider.",
    crampsFollicular: "The follicular phase is typically the most comfortable phase. If you're experiencing unusual discomfort, consider tracking it — patterns can help you and your doctor identify any concerns.",

    // Libido/intimacy responses
    libidoIntro: "Libido naturally fluctuates with your cycle. During the {phaseName} phase: ",
    libidoOvulation: "libido tends to peak around ovulation due to high estrogen and testosterone. This is your body's natural fertility window. Enjoy this increased desire and confidence.",
    libidoFollicular: "rising estrogen in the follicular phase gradually increases desire and arousal. You may feel more socially energized and attracted to others.",
    libidoLuteal: "progesterone rises and can lower libido for many people. This is normal. Focus on emotional intimacy, and don't pressure yourself. Cuddling and connection are just as valid.",
    libidoMenstrual: "libido varies during menstruation — some feel increased desire while others don't. Both are completely normal. Listen to your body and do what feels right for you.",

    // Supplements responses
    supplementsIntro: "Here are supplement considerations for the {phaseName} phase (always consult your doctor first): ",
    supplementsMenstrual: "Iron (especially if you have heavy periods), magnesium (200-400mg for cramps and mood), vitamin C (to boost iron absorption), and omega-3 fatty acids (anti-inflammatory). B-complex vitamins can also support energy.",
    supplementsFollicular: "Probiotics to support gut health and estrogen metabolism, vitamin D (especially if you get limited sun), zinc for immune support, and B vitamins for energy. This is a good time to focus on building nutrient stores.",
    supplementsOvulation: "Antioxidants like vitamin E and C, omega-3 fatty acids, and zinc. NAC (N-acetyl cysteine) may support healthy ovulation. Stay well-hydrated and focus on whole foods over supplements when possible.",
    supplementsLuteal: "Magnesium glycinate (for sleep and mood), vitamin B6 (may help with PMS), calcium (1000mg shown to reduce PMS symptoms), and evening primrose oil. Chasteberry (vitex) is also used by some for PMS, but consult your doctor first.",

    // Focus/productivity responses
    focusIntro: "Your cognitive patterns shift with your cycle. In the {phaseName} phase (day {cycleDay}): ",
    focusFollicular: "rising estrogen enhances verbal skills, creativity, and learning. This is your best time for brainstorming, starting new projects, planning, and absorbing new information. Schedule important meetings and creative work now.",
    focusOvulation: "your communication skills and social intelligence peak. Great time for presentations, negotiations, collaborations, and networking. You may find it easier to multitask and think on your feet.",
    focusLuteal: "progesterone shifts your brain toward detail-oriented, methodical thinking. Use this for editing, proofreading, organizing, finishing projects, and administrative tasks. Avoid starting entirely new projects if possible.",
    focusMenstrual: "your brain is in a reflective, evaluative state. This is actually ideal for strategic thinking, reviewing goals, journaling, and making decisions based on intuition. Don't force high-output creative work — instead, plan and reflect.",
    focusLowEnergy: " Your energy is low today — try working in short 25-minute focus blocks (Pomodoro technique) with 5-minute breaks.",

    // Cycle knowledge responses
    cycleIntro: "You're on day {cycleDay} of {totalDays} in your cycle, currently in the {phaseName} phase. ",
    cycleMenstrual: "The menstrual phase (typically days 1-5) is when your uterine lining sheds. Hormone levels (estrogen and progesterone) are at their lowest. Your body is focused on renewal. Think of this as your inner winter — a time for rest, reflection, and gentle self-care.",
    cycleFollicular: "The follicular phase (typically days 6-13) is when your body prepares a new egg. Estrogen steadily rises, boosting energy, mood, and creativity. Think of this as your inner spring — a time of growth and new beginnings.",
    cycleOvulation: "The ovulation phase (typically days 14-16) is when a mature egg is released. Estrogen peaks and luteinizing hormone surges. You may feel most social, confident, and energetic. Think of this as your inner summer — your peak performance window.",
    cycleLuteal: "The luteal phase (typically days 17-28) is when progesterone rises to prepare for possible implantation. If pregnancy doesn't occur, hormones drop and the cycle begins again. Think of this as your inner autumn — a time for winding down and nesting.",

    // Quick reply additions
    quickCramps: "Help with cramps",
    quickFocus: "Focus tips",

    // Catch-all
    fallbackIntro: "I can help with questions about your energy, nutrition, stress, sleep, mood, exercise, skin, hydration, cramps, supplements, focus, and your cycle \u2014 all personalized to your {phaseName} phase (day {cycleDay} of {totalDays}).",
    fallbackScan: "\n\nYour latest scan shows: energy {energy}/10, stress {stress}/10, recovery {recovery}/10.",
    fallbackSuggestions: "\n\nTry asking me things like:\n- Why am I tired?\n- What should I eat?\n- How is my stress?\n- Give me sleep tips\n- Help with cramps\n- Focus tips for today\n- What supplements should I take?\n- Tell me about my cycle",

    // Keyword matching (pipe-delimited)
    "kw.energy": "tired|energy|fatigue|exhausted",
    "kw.food": "eat|food|nutrition|diet",
    "kw.stress": "stress|anxious|anxiety|overwhelm",
    "kw.sleep": "sleep|insomnia|rest",
    "kw.mood": "mood|sad|happy|emotional",
    "kw.exercise": "exercise|workout|movement|gym",
    "kw.skin": "skin|acne|glow|breakout",
    "kw.hydration": "hydration|water|thirsty|dehydrated|drink",
    "kw.cramps": "cramps|pain|ache|bloating|pms|discomfort|period pain",
    "kw.libido": "libido|sex|intimacy|desire|arousal",
    "kw.supplements": "supplement|vitamin|mineral|magnesium|iron|zinc",
    "kw.focus": "focus|concentration|productivity|brain fog|mental|cognitive",
    "kw.cycle": "cycle|period|phase|ovulation|menstrual|luteal|follicular",
  },

  sv: {
    headerTitle: "H\u00e4lsokompanjon",
    headerSubtitle: "{phaseName}fas \u00b7 Dag {cycleDay}",
    inputPlaceholder: "Fr\u00e5ga IRIS vad som helst...",
    welcomeMessage: "Hej! Jag \u00e4r din IRIS-h\u00e4lsokompanjon. Jag anv\u00e4nder din cykel-, skanning- och incheckningsdata f\u00f6r att ge dig personlig h\u00e4lsov\u00e4gledning. Fr\u00e5ga mig vad som helst om din energi, kost, stress, s\u00f6mn eller ditt hum\u00f6r.",
    quickTired: "Varf\u00f6r \u00e4r jag tr\u00f6tt?",
    quickEat: "Vad ska jag \u00e4ta?",
    quickStress: "Hur \u00e4r min stress?",
    quickSleep: "S\u00f6mntips",

    phaseMenstrual: "menstruations",
    phaseFollicular: "follikul\u00e4r",
    phaseOvulation: "ovulations",
    phaseLuteal: "luteal",

    energyIntro: "Du \u00e4r p\u00e5 dag {cycleDay} av din cykel ({phaseName}fas).",
    energyScoreToday: " Din energiponng idag \u00e4r {energy}/10",
    energyLower: ", vilket \u00e4r l\u00e4gre \u00e4n ditt genomsnitt p\u00e5 {avg}.",
    energyHigher: ", vilket \u00e4r h\u00f6gre \u00e4n ditt genomsnitt p\u00e5 {avg}.",
    energySame: ", vilket \u00e4r ungef\u00e4r samma som ditt genomsnitt p\u00e5 {avg}.",
    energyLuteal: " M\u00e5nga upplever l\u00e4gre energi i lutealfasen. \u00d6verv\u00e4g lugn r\u00f6relse som promenader eller yoga, och f\u00f6rs\u00f6k l\u00e4gga dig 30 minuter tidigare ikv\u00e4ll.",
    energyMenstrual: " Under menstruationen anv\u00e4nder kroppen extra energi. Prioritera vila, j\u00e4rnrik mat som bladgr\u00f6nsaker och h\u00e5ll dig v\u00e4lhydrerad.",
    energyFollicular: " Follikul\u00e4rfasen brukar ge stigande energi. Om du fortfarande k\u00e4nner dig tr\u00f6tt, kontrollera din s\u00f6mnkvalitet och v\u00e4tskeniv\u00e5er.",
    energyOvulation: " Under ovulationen \u00e4r energin vanligtvis som h\u00f6gst. Om du k\u00e4nner dig tr\u00f6tt kan det vara v\u00e4rt att kolla din s\u00f6mn och stressniv\u00e5.",
    energyHighFatigue: " Din tr\u00f6tthetsindikator \u00e4r f\u00f6rh\u00f6jd idag \u2014 \u00f6verv\u00e4g en kort tupplur eller l\u00e4tt stretching.",

    foodIntro: "Under {phaseName}fasen, ",
    foodLuteal: "kan din kropp ha nytta av komplexa kolhydrater, magnesiumrik mat (m\u00f6rk choklad, n\u00f6tter) och antiinflammatoriska val.",
    foodInflammation: " Din inflammationspo\u00e4ng \u00e4r n\u00e5got h\u00f6gre idag \u2014 \u00f6verv\u00e4g att l\u00e4gga till gurkmeja eller ingef\u00e4ra i dina m\u00e5ltider.",
    foodMenstrual: "fokusera p\u00e5 j\u00e4rnrik mat (spenat, linser, r\u00f6tt k\u00f6tt), v\u00e4rmande soppor och antiinflammatoriska alternativ. M\u00f6rk choklad och magnesiumrik mat kan ocks\u00e5 hj\u00e4lpa mot menstruationskramper.",
    foodFollicular: "din metabolism \u00f6kar. Magra proteiner, f\u00e4rska gr\u00f6nsaker och fermenterad mat st\u00f6djer stigande \u00f6strogen. Det \u00e4r ett bra tillf\u00e4lle att prova nya recept.",
    foodOvulation: "energin \u00e4r h\u00f6g och kroppen hanterar kolhydrater bra. Fokusera p\u00e5 fiberrik mat, nyttiga fetter och massor av antioxidantrika frukter och gr\u00f6nsaker.",
    foodLowHydration: " Din v\u00e4tskeniv\u00e5 \u00e4r l\u00e4gre \u00e4n idealt \u2014 sikta p\u00e5 minst 8 glas vatten idag.",

    stressIntro: "Du \u00e4r i {phaseName}fasen (dag {cycleDay}).",
    stressScoreToday: " Din stresspo\u00e4ng idag \u00e4r {stress}/10",
    stressAvg: " (ditt genomsnitt \u00e4r {avg}).",
    stressHigh: " Din stressniv\u00e5 \u00e4r m\u00e4rkbart f\u00f6rh\u00f6jd. Prova en 5-minuters box-breathing\u00f6vning: andas in i 4 takter, h\u00e5ll 4, ut 4, h\u00e5ll 4. Upprepa 5 g\u00e5nger.",
    stressModerate: " Din stress \u00e4r m\u00e5ttlig. En kort promenad utomhus, djupandning eller n\u00e5gra minuters journalf\u00f6ring kan hj\u00e4lpa till att s\u00e4nka den.",
    stressLow: " Din stressniv\u00e5 ser v\u00e4lhanterad ut idag. Forts\u00e4tt med det som fungerar f\u00f6r dig.",
    stressNoScan: " G\u00f6r en skanning idag f\u00f6r att f\u00e5 personliga stressinsikter. Under tiden, prova 5 minuters djupandning eller en kort promenad.",
    stressLutealNote: " Lutealfasen kan f\u00f6rst\u00e4rka stresskk\u00e4nsligheten \u2014 var extra snll mot dig sj\u00e4lv denna vecka.",

    sleepLogged: "Baserat p\u00e5 din incheckning loggade du {hours} timmars s\u00f6mn. ",
    sleepLow: "Det \u00e4r under de rekommenderade 7-9 timmarna. ",
    sleepSlightlyLow: "Det \u00e4r n\u00e5got under det optimala intervallet. ",
    sleepGood: "Det \u00e4r inom ett h\u00e4lsosamt intervall. ",
    sleepLuteal: "Under lutealfasen stiger progesteronet vilket kan g\u00f6ra dig s\u00f6mnigare men paradoxalt nog st\u00f6ra djups\u00f6mnen. Prova magnesium f\u00f6re s\u00e4ngen (200-400mg), undvik sk\u00e4rmar 1 timme f\u00f6re s\u00f6mnen och h\u00e5ll rummet svalt (ca 18-20\u00b0C).",
    sleepMenstrual: "Menstruationen kan p\u00e5verka s\u00f6mnkvaliteten. Ett varmt bad f\u00f6re s\u00e4ngen, kamomill-te och l\u00e4tt stretching kan hj\u00e4lpa. \u00d6verv\u00e4g en v\u00e4rmedyna om menstruationskramper st\u00f6r din vila.",
    sleepFollicular: "Stigande \u00f6strogen i follikul\u00e4rfasen st\u00f6djer generellt b\u00e4ttre s\u00f6mn. Anv\u00e4nd denna tid f\u00f6r att etablera goda s\u00f6mnvanor: regelbunden l\u00e4ggdags, inget koffein efter kl 14 och ett m\u00f6rkt, svalt rum.",
    sleepOvulation: "Runt ovulationen stiger kroppstemperaturen l\u00e4tt vilket kan p\u00e5verka s\u00f6mnen. H\u00e5ll sovrummet extra svalt och \u00f6verv\u00e4g l\u00e4tt s\u00e4ngkl\u00e4der. Det \u00e4r ett bra tillf\u00e4lle att varva ner med en lugnande rutin.",
    sleepLowRecovery: " Din \u00e5terh\u00e4mtningspo\u00e4ng \u00e4r l\u00e5g \u2014 att prioritera s\u00f6mn ikv\u00e4ll hj\u00e4lper kroppen att \u00e5terst\u00e4llas.",

    moodIntro: "Du \u00e4r i {phaseName}fasen. ",
    moodScoreToday: "Ditt hum\u00f6r idag \u00e4r {mood}/10. ",
    moodLow: "Det \u00e4r l\u00e4gre \u00e4n idealt. ",
    moodLuteal: "Lutealfasen kan ge hum\u00f6rsv\u00e4ngningar p\u00e5 grund av skiftande progesteronniv\u00e5er. Journalf\u00f6ring, l\u00e4tt motion och att prata med n\u00e5gon du litar p\u00e5 kan hj\u00e4lpa till att stabilisera dina k\u00e4nslor.",
    moodMenstrual: "Hormonerna \u00e4r som l\u00e4gst under menstruationen, vilket kan p\u00e5verka hum\u00f6ret. Var sn\u00e4ll mot dig sj\u00e4lv \u2014 egenv\u00e5rd, vila och tr\u00f6stmat (med m\u00e5tta) \u00e4r helt l\u00e4mpligt just nu.",
    moodFollicular: "Stigande \u00f6strogen ger vanligtvis f\u00f6rb\u00e4ttrat hum\u00f6r och motivation. Det \u00e4r ett bra tillf\u00e4lle f\u00f6r sociala aktiviteter, kreativa projekt och att prova nya saker.",
    moodOvulation: "Ovulationen ger ofta en hum\u00f6rstopp tack vare h\u00f6gt \u00f6strogen och en LH-topp. Njut av denna sociala, sj\u00e4lvs\u00e4kra energi medan den varar.",

    exerciseIntro: "F\u00f6r {phaseName}fasen (dag {cycleDay}), ",
    exerciseMenstrual: "rekommenderas lugn r\u00f6relse som promenader, yoga eller l\u00e4tt stretching. Din kropp \u00e5terh\u00e4mtar sig, s\u00e5 undvik att pressa f\u00f6r h\u00e5rt.",
    exerciseFollicular: "\u00e4r din kropp redo f\u00f6r styrkevinster. Prova styrketr\u00e4ning, HIIT eller att l\u00e4ra dig nya atletiska f\u00e4rdigheter. Energi och koordination f\u00f6rb\u00e4ttras.",
    exerciseOvulation: "detta \u00e4r ditt topprestationsf\u00f6nster. Sikta p\u00e5 personliga rekord, h\u00f6gintensiva tr\u00e4ningspass eller utmanande grupptr\u00e4ningar. Din kropp klarar mer just nu.",
    exerciseLuteal: "fokusera p\u00e5 m\u00e5ttlig tr\u00e4ning. Pilates, m\u00e5ttlig kardio och yoga \u00e4r bra val. N\u00e4r fasen fortskrider, \u00f6verg\u00e5 till l\u00e4ttare aktiviteter.",
    exerciseLowEnergy: " Men din energi \u00e4r ganska l\u00e5g idag \u2014 det \u00e4r helt ok\u00e4j att g\u00f6ra n\u00e5got l\u00e4tt eller ta en vilodag.",

    skinIntro: "Under {phaseName}fasen, ",
    skinLuteal: "h\u00f6jer stigande progesteron talgproduktionen och kan utl\u00f6sa utbrott. Anv\u00e4nd milda, icke-komedogena produkter, salicylsyra mot finnar och niacinamid f\u00f6r talgkontroll.",
    skinMenstrual: "kan huden vara k\u00e4nslig och torr. Anv\u00e4nd \u00e5terfuktande, milda produkter och undvik starka exfolieringsmedel. Fokusera p\u00e5 lugnande ingredienser som aloe och centella.",
    skinFollicular: "\u00f6kar \u00f6strogenet och huden ser vanligtvis klarare ut. Det \u00e4r ett bra tillf\u00e4lle f\u00f6r exfoliering, C-vitaminserum och att prova nya aktiva ingredienser.",
    skinOvulation: "str\u00e5lar du troligtvis som mest. \u00d6strogentoppen skapar en naturlig lyster. H\u00e5ll din rutin enkel och njut av det.",

    fallbackIntro: "Jag kan hj\u00e4lpa med fr\u00e5gor om din energi, kost, stress, s\u00f6mn, hum\u00f6r, tr\u00e4ning och hudv\u00e5rd \u2014 allt anpassat till din {phaseName}fas (dag {cycleDay} av {totalDays}).",
    fallbackScan: "\n\nDin senaste skanning visar: energi {energy}/10, stress {stress}/10, \u00e5terh\u00e4mtning {recovery}/10.",
    fallbackSuggestions: "\n\nProva att fr\u00e5ga mig saker som:\n- Varf\u00f6r \u00e4r jag tr\u00f6tt?\n- Vad ska jag \u00e4ta?\n- Hur \u00e4r min stress?\n- Ge mig s\u00f6mntips\n- Vilken tr\u00e4ning ska jag g\u00f6ra?\n- Hur m\u00e5r min hud den h\u00e4r veckan?",

    "kw.energy": "tr\u00f6tt|energi|utmattad|uttr\u00f6ttad|orkeslös|sliten",
    "kw.food": "\u00e4ta|mat|kost|n\u00e4ring|diet",
    "kw.stress": "stress|stressad|oro|\u00e5ngest|\u00f6verväldigad",
    "kw.sleep": "s\u00f6mn|s\u00f6mnl\u00f6s|sova|vila|insomni",
    "kw.mood": "hum\u00f6r|ledsen|glad|k\u00e4nslom\u00e4ssig|nedst\u00e4md",
    "kw.exercise": "tr\u00e4ning|tr\u00e4na|motion|gym|r\u00f6relse",
    "kw.skin": "hud|akne|finnar|utslag|gl\u00f6d",

    // Hydration responses
    hydrationIntro: "Att h\u00e5lla sig v\u00e4lhydrerad \u00e4r viktigt under {phaseName}fasen. ",
    hydrationVeryLow: "Din v\u00e4tskeniv\u00e5 \u00e4r {hydration}/10 \u2014 det \u00e4r ganska l\u00e5gt. F\u00f6rs\u00f6k dricka ett glas vatten nu direkt och s\u00e4tt p\u00e5minnelser under dagen. ",
    hydrationLow: "Din v\u00e4tskeniv\u00e5 \u00e4r {hydration}/10 \u2014 lite under optimalt. Sikta p\u00e5 minst 8 glas idag. ",
    hydrationGood: "Din v\u00e4tskeniv\u00e5 \u00e4r {hydration}/10 \u2014 du g\u00f6r bra ifr\u00e5n dig! Forts\u00e4tt s\u00e5. ",
    hydrationMenstrual: "Under menstruationen f\u00f6rlorar du extra v\u00e4tska. Varma \u00f6rtt\u00e9er (ingef\u00e4ra, kamomill) r\u00e4knas till v\u00e4tskeintaget och kan lindra kramper ocks\u00e5.",
    hydrationOvulation: "Runt \u00e4gglossningen stiger kroppstemperaturen n\u00e5got. \u00d6ka vattenintaget och tills\u00e4tt elektrolyter om du \u00e4r aktiv.",
    hydrationLuteal: "I lutealfasen kan progesteron orsaka v\u00e4tskeretention. Paradoxalt nog hj\u00e4lper det att dricka MER vatten mot uppbl\u00e5sthet.",
    hydrationFollicular: "Follikul\u00e4rfasen \u00e4r en bra tid att bygga v\u00e4tskevanor. Prova att smaks\u00e4tta vatten med citron, gurka eller b\u00e4r f\u00f6r variation.",

    // Cramps/pain responses
    crampsIntro: "L\u00e5t oss prata om att hantera obehag under {phaseName}fasen (dag {cycleDay}). ",
    crampsMenstrual: "Menstruationskramper orsakas av prostaglandiner. Saker som kan hj\u00e4lpa: en v\u00e4rmedyna p\u00e5 nedre delen av magen, l\u00e4tta promenader, magnesiumrik mat (m\u00f6rk choklad, bananer) och antiinflammatoriska t\u00e9er som ingef\u00e4ra eller kamomill. Milda yogast\u00e4llningar som barnets st\u00e4llning och katt-ko kan ocks\u00e5 l\u00e4tta p\u00e5 sp\u00e4nningen.",
    crampsLuteal: "Premenstruellt obehag \u00e4r vanligt i lutealfasen. Magnesiumtillskott (200-400mg), kalciumrik mat, regelbunden mild motion och minskat koffein- och saltintag kan alla hj\u00e4lpa till att hantera PMS-symtom.",
    crampsOvulation: "Vissa upplever mittelschmerz \u2014 en kort, skarp sm\u00e4rta vid \u00e4gglossning. Detta \u00e4r normalt. Ett varmt omslag och l\u00e4tt r\u00f6relse hj\u00e4lper vanligtvis. Om sm\u00e4rtan \u00e4r sv\u00e5r eller ih\u00e5llande, kontakta din v\u00e5rdgivare.",
    crampsFollicular: "Follikul\u00e4rfasen \u00e4r vanligtvis den mest bekv\u00e4ma fasen. Om du upplever ovanligt obehag, \u00f6verv\u00e4g att sp\u00e5ra det \u2014 m\u00f6nster kan hj\u00e4lpa dig och din l\u00e4kare att identifiera eventuella problem.",

    // Libido/intimacy responses
    libidoIntro: "Libido varierar naturligt med din cykel. Under {phaseName}fasen: ",
    libidoOvulation: "libido tenderar att toppa runt \u00e4gglossningen p\u00e5 grund av h\u00f6gt \u00f6strogen och testosteron. Detta \u00e4r kroppens naturliga fertila f\u00f6nster. Njut av denna \u00f6kade lust och sj\u00e4lvf\u00f6rtroende.",
    libidoFollicular: "stigande \u00f6strogen i follikul\u00e4rfasen \u00f6kar gradvis lust och upphetsning. Du kan k\u00e4nna dig mer socialt energisk och attraherad av andra.",
    libidoLuteal: "progesteron stiger och kan s\u00e4nka libido f\u00f6r m\u00e5nga. Detta \u00e4r normalt. Fokusera p\u00e5 emotionell intimitet och pressa inte dig sj\u00e4lv. Kelande och n\u00e4rhet \u00e4r lika viktiga.",
    libidoMenstrual: "libido varierar under menstruationen \u2014 vissa k\u00e4nner \u00f6kad lust medan andra inte g\u00f6r det. B\u00e5da \u00e4r helt normalt. Lyssna p\u00e5 din kropp och g\u00f6r det som k\u00e4nns r\u00e4tt f\u00f6r dig.",

    // Supplements responses
    supplementsIntro: "H\u00e4r \u00e4r tillskotts\u00f6verv\u00e4ganden f\u00f6r {phaseName}fasen (r\u00e5dg\u00f6r alltid med din l\u00e4kare f\u00f6rst): ",
    supplementsMenstrual: "J\u00e4rn (s\u00e4rskilt vid rikliga menstruationer), magnesium (200-400mg f\u00f6r kramper och hum\u00f6r), vitamin C (f\u00f6r att \u00f6ka j\u00e4rnupptaget) och omega-3-fettsyror (antiinflammatoriskt). B-vitaminkomplex kan ocks\u00e5 st\u00f6dja energin.",
    supplementsFollicular: "Probiotika f\u00f6r att st\u00f6dja tarmh\u00e4lsa och \u00f6strogenmetabolism, vitamin D (s\u00e4rskilt om du f\u00e5r begr\u00e4nsat med sol), zink f\u00f6r immunst\u00f6d och B-vitaminer f\u00f6r energi. Det h\u00e4r \u00e4r en bra tid att fokusera p\u00e5 att bygga n\u00e4ringsf\u00f6rr\u00e5d.",
    supplementsOvulation: "Antioxidanter som vitamin E och C, omega-3-fettsyror och zink. NAC (N-acetylcystein) kan st\u00f6dja h\u00e4lsosam \u00e4gglossning. H\u00e5ll dig v\u00e4lhydrerad och fokusera p\u00e5 hel mat framf\u00f6r tillskott n\u00e4r det \u00e4r m\u00f6jligt.",
    supplementsLuteal: "Magnesiumglycinat (f\u00f6r s\u00f6mn och hum\u00f6r), vitamin B6 (kan hj\u00e4lpa mot PMS), kalcium (1000mg har visats minska PMS-symtom) och nattljusolja. Munkpeppar (vitex) anv\u00e4nds ocks\u00e5 av vissa mot PMS, men r\u00e5dg\u00f6r med din l\u00e4kare f\u00f6rst.",

    // Focus/productivity responses
    focusIntro: "Dina kognitiva m\u00f6nster f\u00f6r\u00e4ndras med din cykel. I {phaseName}fasen (dag {cycleDay}): ",
    focusFollicular: "stigande \u00f6strogen f\u00f6rb\u00e4ttrar verbala f\u00f6rm\u00e5gor, kreativitet och inl\u00e4rning. Det h\u00e4r \u00e4r din b\u00e4sta tid f\u00f6r brainstorming, starta nya projekt, planering och att ta in ny information. Planera viktiga m\u00f6ten och kreativt arbete nu.",
    focusOvulation: "dina kommunikationsf\u00f6rm\u00e5gor och sociala intelligens toppar. Bra tid f\u00f6r presentationer, f\u00f6rhandlingar, samarbeten och n\u00e4tverkande. Du kan tycka att det \u00e4r l\u00e4ttare att multitaska och t\u00e4nka snabbt.",
    focusLuteal: "progesteron skiftar din hj\u00e4rna mot detaljorienterat, metodiskt t\u00e4nkande. Anv\u00e4nd detta f\u00f6r redigering, korrekturl\u00e4sning, organisering, avsluta projekt och administrativa uppgifter. Undvik att starta helt nya projekt om m\u00f6jligt.",
    focusMenstrual: "din hj\u00e4rna \u00e4r i ett reflekterande, utv\u00e4rderande tillst\u00e5nd. Det h\u00e4r \u00e4r faktiskt idealiskt f\u00f6r strategiskt t\u00e4nkande, granska m\u00e5l, journalf\u00f6ring och att fatta beslut baserat p\u00e5 intuition. Tvinga inte fram h\u00f6gpresterande kreativt arbete \u2014 planera och reflektera ist\u00e4llet.",
    focusLowEnergy: " Din energi \u00e4r l\u00e5g idag \u2014 prova att arbeta i korta 25-minuters fokusblock (Pomodoroteknik) med 5 minuters pauser.",

    // Cycle knowledge responses
    cycleIntro: "Du \u00e4r p\u00e5 dag {cycleDay} av {totalDays} i din cykel, f\u00f6r n\u00e4rvarande i {phaseName}fasen. ",
    cycleMenstrual: "Menstruationsfasen (vanligtvis dag 1-5) \u00e4r n\u00e4r livmoderslemhinnan st\u00f6ts ut. Hormonniv\u00e5erna (\u00f6strogen och progesteron) \u00e4r som l\u00e4gst. Din kropp fokuserar p\u00e5 f\u00f6rnyelse. T\u00e4nk p\u00e5 detta som din inre vinter \u2014 en tid f\u00f6r vila, reflektion och mild egenv\u00e5rd.",
    cycleFollicular: "Follikul\u00e4rfasen (vanligtvis dag 6-13) \u00e4r n\u00e4r kroppen f\u00f6rbereder ett nytt \u00e4gg. \u00d6strogen stiger stadigt och \u00f6kar energi, hum\u00f6r och kreativitet. T\u00e4nk p\u00e5 detta som din inre v\u00e5r \u2014 en tid av tillv\u00e4xt och nya b\u00f6rjan.",
    cycleOvulation: "Ovulationsfasen (vanligtvis dag 14-16) \u00e4r n\u00e4r ett moget \u00e4gg frig\u00f6rs. \u00d6strogen toppar och luteiniserande hormon \u00f6kar kraftigt. Du kan k\u00e4nna dig som mest social, sj\u00e4lvs\u00e4ker och energisk. T\u00e4nk p\u00e5 detta som din inre sommar \u2014 ditt toppresultatf\u00f6nster.",
    cycleLuteal: "Lutealfasen (vanligtvis dag 17-28) \u00e4r n\u00e4r progesteron stiger f\u00f6r att f\u00f6rbereda f\u00f6r eventuell implantation. Om graviditet inte sker sjunker hormonerna och cykeln b\u00f6rjar om. T\u00e4nk p\u00e5 detta som din inre h\u00f6st \u2014 en tid att varva ner och bygga bo.",

    // Quick reply additions
    quickCramps: "Hj\u00e4lp med kramper",
    quickFocus: "Fokustips",

    // New keyword arrays
    "kw.hydration": "v\u00e4tska|vatten|t\u00f6rstig|uttorkad|dricka",
    "kw.cramps": "kramper|sm\u00e4rta|ont|uppbl\u00e5st|pms|obehag|menssm\u00e4rta",
    "kw.libido": "libido|sex|intimitet|lust|upphetsning",
    "kw.supplements": "kosttillskott|vitamin|mineral|magnesium|j\u00e4rn|zink",
    "kw.focus": "fokus|koncentration|produktivitet|hj\u00e4rndimma|mental|kognitiv",
    "kw.cycle": "cykel|mens|fas|\u00e4gglossning|menstruation|luteal|follikul\u00e4r",
  },

  de: {
    headerTitle: "Wellness-Begleiter",
    headerSubtitle: "{phaseName}-Phase \u00b7 Tag {cycleDay}",
    inputPlaceholder: "Frag IRIS etwas...",
    welcomeMessage: "Hallo! Ich bin dein IRIS-Wellness-Begleiter. Ich nutze deine Zyklus-, Scan- und Check-in-Daten, um dir personalisierte Wellness-Tipps zu geben. Frag mich alles \u00fcber deine Energie, Ern\u00e4hrung, Stress, Schlaf oder Stimmung.",
    quickTired: "Warum bin ich m\u00fcde?",
    quickEat: "Was soll ich essen?",
    quickStress: "Wie ist mein Stress?",
    quickSleep: "Schlaftipps",

    phaseMenstrual: "Menstruations",
    phaseFollicular: "Follikel",
    phaseOvulation: "Ovulations",
    phaseLuteal: "Luteal",

    energyIntro: "Du bist an Tag {cycleDay} deines Zyklus ({phaseName}-Phase).",
    energyScoreToday: " Dein Energiewert heute ist {energy}/10",
    energyLower: ", was niedriger ist als dein Durchschnitt von {avg}.",
    energyHigher: ", was h\u00f6her ist als dein Durchschnitt von {avg}.",
    energySame: ", was ungef\u00e4hr gleich deinem Durchschnitt von {avg} ist.",
    energyLuteal: " Viele Menschen erleben weniger Energie in der Lutealphase. Versuche sanfte Bewegung wie Spazierengehen oder Yoga und geh heute Abend 30 Minuten fr\u00fcher ins Bett.",
    energyMenstrual: " W\u00e4hrend der Menstruation verbraucht dein K\u00f6rper zus\u00e4tzliche Energie. Priorisiere Ruhe, eisenreiche Lebensmittel wie Blattgem\u00fcse und bleib gut hydriert.",
    energyFollicular: " Die Follikelphase bringt normalerweise steigende Energie. Wenn du dich immer noch m\u00fcde f\u00fchlst, \u00fcberpr\u00fcfe deine Schlafqualit\u00e4t und Fl\u00fcssigkeitszufuhr.",
    energyOvulation: " W\u00e4hrend des Eisprungs ist die Energie normalerweise am h\u00f6chsten. Wenn du dich m\u00fcde f\u00fchlst, lohnt es sich, deinen Schlaf und dein Stressniveau zu \u00fcberpr\u00fcfen.",
    energyHighFatigue: " Dein M\u00fcdigkeitsindikator ist heute erh\u00f6ht \u2014 erw\u00e4ge einen kurzen Powernap oder eine leichte Dehn\u00fcbung.",

    foodIntro: "W\u00e4hrend der {phaseName}-Phase, ",
    foodLuteal: "kann dein K\u00f6rper von komplexen Kohlenhydraten, magnesiumreichen Lebensmitteln (dunkle Schokolade, N\u00fcsse) und entz\u00fcndungshemmenden Lebensmitteln profitieren.",
    foodInflammation: " Dein Entz\u00fcndungswert ist heute etwas h\u00f6her \u2014 erw\u00e4ge, Kurkuma oder Ingwer zu deinen Mahlzeiten hinzuzuf\u00fcgen.",
    foodMenstrual: "konzentriere dich auf eisenreiche Lebensmittel (Spinat, Linsen, rotes Fleisch), w\u00e4rmende Suppen und entz\u00fcndungshemmende Optionen. Dunkle Schokolade und magnesiumreiche Lebensmittel k\u00f6nnen auch bei Kr\u00e4mpfen helfen.",
    foodFollicular: "dein Stoffwechsel kommt in Schwung. Magere Proteine, frisches Gem\u00fcse und fermentierte Lebensmittel unterst\u00fctzen das steigende \u00d6strogen. Dies ist eine gro\u00dfartige Zeit, um neue Rezepte auszuprobieren.",
    foodOvulation: "die Energie ist hoch und dein K\u00f6rper verarbeitet Kohlenhydrate gut. Konzentriere dich auf ballaststoffreiche Lebensmittel, gesunde Fette und viel antioxidantienreiches Obst und Gem\u00fcse.",
    foodLowHydration: " Dein Fl\u00fcssigkeitsniveau ist niedriger als ideal \u2014 trinke heute mindestens 8 Gl\u00e4ser Wasser.",

    stressIntro: "Du bist in der {phaseName}-Phase (Tag {cycleDay}).",
    stressScoreToday: " Dein Stresswert heute ist {stress}/10",
    stressAvg: " (dein Durchschnitt ist {avg}).",
    stressHigh: " Dein Stressniveau ist deutlich erh\u00f6ht. Probiere eine 5-min\u00fctige Box-Breathing-\u00dcbung: 4 Z\u00e4hler einatmen, 4 halten, 4 ausatmen, 4 halten. 5 Mal wiederholen.",
    stressModerate: " Dein Stress ist moderat. Ein kurzer Spaziergang drau\u00dfen, tiefes Atmen oder ein paar Minuten Journaling k\u00f6nnten helfen, ihn zu senken.",
    stressLow: " Dein Stressniveau sieht heute gut gemanagt aus. Mach weiter mit der Routine, die f\u00fcr dich funktioniert.",
    stressNoScan: " Mache heute einen Scan, um personalisierte Stress-Einblicke zu erhalten. In der Zwischenzeit probiere 5 Minuten tiefes Atmen oder einen kurzen Spaziergang.",
    stressLutealNote: " Die Lutealphase kann die Stressempfindlichkeit verst\u00e4rken \u2014 sei diese Woche besonders sanft zu dir selbst.",

    sleepLogged: "Laut deinem Check-in hast du {hours} Stunden Schlaf protokolliert. ",
    sleepLow: "Das liegt unter den empfohlenen 7-9 Stunden. ",
    sleepSlightlyLow: "Das liegt leicht unter dem optimalen Bereich. ",
    sleepGood: "Das liegt in einem gesunden Bereich. ",
    sleepLuteal: "W\u00e4hrend der Lutealphase steigt das Progesteron, was dich schl\u00e4friger machen kann, aber paradoxerweise den Tiefschlaf st\u00f6ren kann. Probiere Magnesium vor dem Schlafengehen (200-400mg), vermeide Bildschirme 1 Stunde vor dem Schlafen und halte dein Zimmer k\u00fchl (ca. 18-20\u00b0C).",
    sleepMenstrual: "Die Menstruation kann die Schlafqualit\u00e4t beeintr\u00e4chtigen. Ein warmes Bad vor dem Schlafen, Kamillentee und sanftes Dehnen k\u00f6nnen helfen. Erw\u00e4ge ein W\u00e4rmekissen, wenn Kr\u00e4mpfe deine Ruhe st\u00f6ren.",
    sleepFollicular: "Steigendes \u00d6strogen in der Follikelphase unterst\u00fctzt generell besseren Schlaf. Nutze diese Zeit, um gute Schlafgewohnheiten zu etablieren: regelm\u00e4\u00dfige Schlafenszeit, kein Koffein nach 14 Uhr und ein dunkles, k\u00fchles Zimmer.",
    sleepOvulation: "Rund um den Eisprung steigt die K\u00f6rpertemperatur leicht, was den Schlaf beeinflussen kann. Halte dein Schlafzimmer besonders k\u00fchl und erw\u00e4ge leichte Bettw\u00e4sche. Dies ist eine gute Zeit, um mit einer beruhigenden Routine herunterzufahren.",
    sleepLowRecovery: " Dein Erholungswert ist niedrig \u2014 priorisiere heute Nacht den Schlaf, um deinem K\u00f6rper bei der Regeneration zu helfen.",

    moodIntro: "Du bist in der {phaseName}-Phase. ",
    moodScoreToday: "Deine Stimmung heute ist {mood}/10. ",
    moodLow: "Das ist niedriger als ideal. ",
    moodLuteal: "Die Lutealphase kann Stimmungsschwankungen durch sich ver\u00e4ndernde Progesteronspiegel verursachen. Journaling, leichte Bewegung und der Kontakt zu jemandem, dem du vertraust, k\u00f6nnen helfen, deine Emotionen zu stabilisieren.",
    moodMenstrual: "Hormone sind w\u00e4hrend der Menstruation am niedrigsten, was die Stimmung beeinflussen kann. Sei sanft zu dir selbst \u2014 Selbstf\u00fcrsorge, Ruhe und Comfort Food (in Ma\u00dfen) sind jetzt v\u00f6llig angebracht.",
    moodFollicular: "Steigendes \u00d6strogen bringt typischerweise verbesserte Stimmung und Motivation. Dies ist eine gro\u00dfartige Zeit f\u00fcr soziale Aktivit\u00e4ten, kreative Projekte und Neues auszuprobieren.",
    moodOvulation: "Der Eisprung bringt oft ein Stimmungshoch dank hohem \u00d6strogen und einem LH-Anstieg. Genie\u00dfe diese soziale, selbstbewusste Energie, solange sie anh\u00e4lt.",

    exerciseIntro: "F\u00fcr die {phaseName}-Phase (Tag {cycleDay}), ",
    exerciseMenstrual: "wird sanfte Bewegung wie Spazierengehen, Yoga oder leichtes Dehnen empfohlen. Dein K\u00f6rper erholt sich, also vermeide es, dich zu sehr zu pushen.",
    exerciseFollicular: "ist dein K\u00f6rper bereit f\u00fcr Kraftzuw\u00e4chse. Probiere Krafttraining, HIIT oder lerne neue sportliche F\u00e4higkeiten. Energie und Koordination verbessern sich.",
    exerciseOvulation: "dies ist dein Leistungsh\u00f6hepunkt. Geh f\u00fcr pers\u00f6nliche Rekorde, hochintensive Workouts oder fordernde Gruppenkurse. Dein K\u00f6rper kann jetzt mehr verkraften.",
    exerciseLuteal: "konzentriere dich auf m\u00e4\u00dfig intensive Bewegung. Pilates, moderates Cardio und Yoga sind gute Optionen. Wenn die Phase voranschreitet, wechsle zu leichteren Aktivit\u00e4ten.",
    exerciseLowEnergy: " Allerdings ist deine Energie heute ziemlich niedrig \u2014 es ist v\u00f6llig in Ordnung, etwas Sanftes zu machen oder einen Ruhetag einzulegen.",

    skinIntro: "W\u00e4hrend der {phaseName}-Phase, ",
    skinLuteal: "erh\u00f6ht steigendes Progesteron die Talgproduktion und kann Unreinheiten ausl\u00f6sen. Verwende sanfte, nicht-komedogene Produkte, Salicyls\u00e4ure gegen Pickel und Niacinamid zur Talgkontrolle.",
    skinMenstrual: "kann die Haut empfindlich und trocken sein. Verwende feuchtigkeitsspendende, sanfte Produkte und vermeide aggressive Peelings. Setze auf beruhigende Inhaltsstoffe wie Aloe und Centella.",
    skinFollicular: "steigt das \u00d6strogen und die Haut sieht typischerweise klarer aus. Dies ist eine gro\u00dfartige Zeit f\u00fcr Peeling, Vitamin-C-Seren und neue aktive Inhaltsstoffe.",
    skinOvulation: "strahlst du wahrscheinlich am meisten. Der \u00d6strogengipfel erzeugt ein nat\u00fcrliches Gl\u00fchen. Halte deine Routine einfach und genie\u00dfe es.",

    fallbackIntro: "Ich kann bei Fragen zu deiner Energie, Ern\u00e4hrung, Stress, Schlaf, Stimmung, Bewegung und Hautpflege helfen \u2014 alles personalisiert f\u00fcr deine {phaseName}-Phase (Tag {cycleDay} von {totalDays}).",
    fallbackScan: "\n\nDein letzter Scan zeigt: Energie {energy}/10, Stress {stress}/10, Erholung {recovery}/10.",
    fallbackSuggestions: "\n\nProbiere, mich Dinge zu fragen wie:\n- Warum bin ich m\u00fcde?\n- Was soll ich essen?\n- Wie ist mein Stress?\n- Gib mir Schlaftipps\n- Welches Training soll ich machen?\n- Wie ist meine Haut diese Woche?",

    "kw.energy": "m\u00fcde|energie|ersch\u00f6pft|m\u00fcdigkeit|kraftlos|schlapp",
    "kw.food": "essen|ern\u00e4hrung|nahrung|di\u00e4t|lebensmittel",
    "kw.stress": "stress|\u00e4ngstlich|angst|\u00fcberfordert|\u00fcberw\u00e4ltigt",
    "kw.sleep": "schlaf|schlaflos|schlafen|ruhe|insomnie",
    "kw.mood": "stimmung|traurig|gl\u00fccklich|emotional|niedergeschlagen",
    "kw.exercise": "training|sport|bewegung|fitnessstudio|\u00fcbung",
    "kw.skin": "haut|akne|gl\u00e4nzen|pickel|unreinheiten",

    // Hydration responses
    hydrationIntro: "Gut hydriert zu bleiben ist w\u00e4hrend der {phaseName}-Phase wichtig. ",
    hydrationVeryLow: "Dein Hydrationslevel ist {hydration}/10 \u2014 das ist ziemlich niedrig. Versuche jetzt gleich ein Glas Wasser zu trinken und stelle dir Erinnerungen f\u00fcr den Tag ein. ",
    hydrationLow: "Dein Hydrationslevel ist {hydration}/10 \u2014 etwas unter dem Optimum. Strebe heute mindestens 8 Gl\u00e4ser an. ",
    hydrationGood: "Dein Hydrationslevel ist {hydration}/10 \u2014 du machst das gut! Weiter so. ",
    hydrationMenstrual: "W\u00e4hrend der Menstruation verlierst du zus\u00e4tzliche Fl\u00fcssigkeit. Warme Kr\u00e4utertees (Ingwer, Kamille) z\u00e4hlen zur Fl\u00fcssigkeitszufuhr und k\u00f6nnen auch Kr\u00e4mpfe lindern.",
    hydrationOvulation: "Um den Eisprung steigt die K\u00f6rpertemperatur leicht an. Erh\u00f6he die Wasseraufnahme und f\u00fcge Elektrolyte hinzu, wenn du aktiv bist.",
    hydrationLuteal: "In der Lutealphase kann Progesteron Wassereinlagerungen verursachen. Paradoxerweise hilft es, MEHR Wasser zu trinken, um Bl\u00e4hungen zu reduzieren.",
    hydrationFollicular: "Die Follikelphase ist eine gute Zeit, um Trinkgewohnheiten aufzubauen. Versuche Wasser mit Zitrone, Gurke oder Beeren zu aromatisieren.",

    // Cramps/pain responses
    crampsIntro: "Lass uns \u00fcber den Umgang mit Beschwerden w\u00e4hrend der {phaseName}-Phase (Tag {cycleDay}) sprechen. ",
    crampsMenstrual: "Menstruationskr\u00e4mpfe werden durch Prostaglandine verursacht. Was helfen kann: ein Heizkissen auf dem Unterbauch, sanftes Spazierengehen, magnesiumreiche Lebensmittel (dunkle Schokolade, Bananen) und entz\u00fcndungshemmende Tees wie Ingwer oder Kamille. Sanfte Yoga-Posen wie die Kindshaltung und Katze-Kuh k\u00f6nnen auch Verspannungen l\u00f6sen.",
    crampsLuteal: "Pr\u00e4menstruelle Beschwerden sind in der Lutealphase h\u00e4ufig. Magnesiumpr\u00e4parate (200-400mg), kalziumreiche Lebensmittel, regelm\u00e4\u00dfige sanfte Bewegung und die Reduzierung von Koffein und Salz k\u00f6nnen helfen, PMS-Symptome zu lindern.",
    crampsOvulation: "Manche erleben Mittelschmerz \u2014 einen kurzen, stechenden Schmerz beim Eisprung. Das ist normal. Ein warmer Umschlag und leichte Bewegung helfen meist. Wenn der Schmerz stark oder anhaltend ist, konsultiere deinen Arzt.",
    crampsFollicular: "Die Follikelphase ist normalerweise die beschwerdefreieste Phase. Wenn du ungew\u00f6hnliche Beschwerden hast, erw\u00e4ge sie zu dokumentieren \u2014 Muster k\u00f6nnen dir und deinem Arzt helfen, Bedenken zu identifizieren.",

    // Libido/intimacy responses
    libidoIntro: "Die Libido schwankt nat\u00fcrlich mit deinem Zyklus. W\u00e4hrend der {phaseName}-Phase: ",
    libidoOvulation: "die Libido erreicht tendenziell um den Eisprung ihren H\u00f6hepunkt, bedingt durch hohes \u00d6strogen und Testosteron. Dies ist das nat\u00fcrliche Fruchtbarkeitsfenster deines K\u00f6rpers. Genie\u00dfe dieses gesteigerte Verlangen und Selbstvertrauen.",
    libidoFollicular: "steigendes \u00d6strogen in der Follikelphase erh\u00f6ht allm\u00e4hlich Verlangen und Erregung. Du f\u00fchlst dich m\u00f6glicherweise sozial energischer und angezogener von anderen.",
    libidoLuteal: "Progesteron steigt und kann die Libido bei vielen senken. Das ist normal. Konzentriere dich auf emotionale N\u00e4he und setze dich nicht unter Druck. Kuscheln und Verbundenheit sind genauso wertvoll.",
    libidoMenstrual: "die Libido variiert w\u00e4hrend der Menstruation \u2014 manche empfinden gesteigertes Verlangen, andere nicht. Beides ist v\u00f6llig normal. H\u00f6re auf deinen K\u00f6rper und tue, was sich richtig anf\u00fchlt.",

    // Supplements responses
    supplementsIntro: "Hier sind Erg\u00e4nzungsmittel-Empfehlungen f\u00fcr die {phaseName}-Phase (sprich immer zuerst mit deinem Arzt): ",
    supplementsMenstrual: "Eisen (besonders bei starker Periode), Magnesium (200-400mg f\u00fcr Kr\u00e4mpfe und Stimmung), Vitamin C (um die Eisenaufnahme zu verbessern) und Omega-3-Fetts\u00e4uren (entz\u00fcndungshemmend). B-Komplex-Vitamine k\u00f6nnen auch die Energie unterst\u00fctzen.",
    supplementsFollicular: "Probiotika zur Unterst\u00fctzung der Darmgesundheit und des \u00d6strogenstoffwechsels, Vitamin D (besonders bei wenig Sonne), Zink f\u00fcr die Immunabwehr und B-Vitamine f\u00fcr Energie. Dies ist eine gute Zeit, um N\u00e4hrstoffspeicher aufzubauen.",
    supplementsOvulation: "Antioxidantien wie Vitamin E und C, Omega-3-Fetts\u00e4uren und Zink. NAC (N-Acetylcystein) kann einen gesunden Eisprung unterst\u00fctzen. Bleibe gut hydriert und bevorzuge Vollwertkost gegen\u00fcber Nahrungserg\u00e4nzungsmitteln, wenn m\u00f6glich.",
    supplementsLuteal: "Magnesiumglycinat (f\u00fcr Schlaf und Stimmung), Vitamin B6 (kann bei PMS helfen), Kalzium (1000mg hat sich als PMS-lindernd erwiesen) und Nachtkerzen\u00f6l. M\u00f6nchspfeffer (Vitex) wird von manchen bei PMS verwendet, aber sprich zuerst mit deinem Arzt.",

    // Focus/productivity responses
    focusIntro: "Deine kognitiven Muster ver\u00e4ndern sich mit deinem Zyklus. In der {phaseName}-Phase (Tag {cycleDay}): ",
    focusFollicular: "steigendes \u00d6strogen verbessert verbale F\u00e4higkeiten, Kreativit\u00e4t und Lernf\u00e4higkeit. Dies ist deine beste Zeit f\u00fcr Brainstorming, neue Projekte starten, Planung und neue Informationen aufnehmen. Plane jetzt wichtige Meetings und kreative Arbeit.",
    focusOvulation: "deine Kommunikationsf\u00e4higkeiten und soziale Intelligenz erreichen ihren H\u00f6hepunkt. Gute Zeit f\u00fcr Pr\u00e4sentationen, Verhandlungen, Zusammenarbeit und Networking. Du kannst m\u00f6glicherweise leichter multitasken und schnell denken.",
    focusLuteal: "Progesteron lenkt dein Gehirn in Richtung detailorientiertes, methodisches Denken. Nutze dies f\u00fcr Lektorat, Korrekturlesen, Organisation, Projekte abschlie\u00dfen und Verwaltungsaufgaben. Vermeide es, wenn m\u00f6glich, v\u00f6llig neue Projekte zu starten.",
    focusMenstrual: "dein Gehirn ist in einem reflektierenden, bewertenden Zustand. Das ist eigentlich ideal f\u00fcr strategisches Denken, Ziele \u00fcberpr\u00fcfen, Journaling und intuitive Entscheidungen. Erzwinge keine hochproduktive kreative Arbeit \u2014 plane und reflektiere stattdessen.",
    focusLowEnergy: " Deine Energie ist heute niedrig \u2014 versuche in kurzen 25-Minuten-Fokusbl\u00f6cken (Pomodoro-Technik) mit 5-Minuten-Pausen zu arbeiten.",

    // Cycle knowledge responses
    cycleIntro: "Du bist an Tag {cycleDay} von {totalDays} deines Zyklus, aktuell in der {phaseName}-Phase. ",
    cycleMenstrual: "Die Menstruationsphase (typischerweise Tage 1-5) ist, wenn die Geb\u00e4rmutterschleimhaut abgesto\u00dfen wird. Die Hormonspiegel (\u00d6strogen und Progesteron) sind am niedrigsten. Dein K\u00f6rper konzentriert sich auf Erneuerung. Betrachte dies als deinen inneren Winter \u2014 eine Zeit f\u00fcr Ruhe, Reflexion und sanfte Selbstf\u00fcrsorge.",
    cycleFollicular: "Die Follikelphase (typischerweise Tage 6-13) ist, wenn dein K\u00f6rper eine neue Eizelle vorbereitet. \u00d6strogen steigt stetig und f\u00f6rdert Energie, Stimmung und Kreativit\u00e4t. Betrachte dies als deinen inneren Fr\u00fchling \u2014 eine Zeit des Wachstums und der Neuanf\u00e4nge.",
    cycleOvulation: "Die Ovulationsphase (typischerweise Tage 14-16) ist, wenn eine reife Eizelle freigesetzt wird. \u00d6strogen erreicht seinen H\u00f6hepunkt und das luteinisierende Hormon steigt stark an. Du f\u00fchlst dich vielleicht am geselligsten, selbstbewusstesten und energischsten. Betrachte dies als deinen inneren Sommer \u2014 dein Leistungsh\u00f6hepunkt-Fenster.",
    cycleLuteal: "Die Lutealphase (typischerweise Tage 17-28) ist, wenn Progesteron steigt, um sich auf eine m\u00f6gliche Einnistung vorzubereiten. Wenn keine Schwangerschaft eintritt, sinken die Hormone und der Zyklus beginnt von vorne. Betrachte dies als deinen inneren Herbst \u2014 eine Zeit zum Runterfahren und Einnisten.",

    // Quick reply additions
    quickCramps: "Hilfe bei Kr\u00e4mpfen",
    quickFocus: "Fokus-Tipps",

    // New keyword arrays
    "kw.hydration": "fl\u00fcssigkeit|wasser|durstig|dehydriert|trinken|hydration",
    "kw.cramps": "kr\u00e4mpfe|schmerzen|bl\u00e4hungen|pms|beschwerden|regelschmerzen",
    "kw.libido": "libido|sex|intimit\u00e4t|verlangen|erregung|lust",
    "kw.supplements": "nahrungserg\u00e4nzung|vitamin|mineral|magnesium|eisen|zink|erg\u00e4nzungsmittel",
    "kw.focus": "fokus|konzentration|produktivit\u00e4t|gehirnnebel|mental|kognitiv",
    "kw.cycle": "zyklus|periode|phase|eisprung|menstruation|luteal|follikul\u00e4r",
  },

  fr: {
    headerTitle: "Compagnon Bien-\u00eatre",
    headerSubtitle: "Phase {phaseName} \u00b7 Jour {cycleDay}",
    inputPlaceholder: "Demandez \u00e0 IRIS...",
    welcomeMessage: "Bonjour ! Je suis votre compagnon bien-\u00eatre IRIS. J'utilise vos donn\u00e9es de cycle, de scan et de check-in pour vous donner des conseils personnalis\u00e9s. Posez-moi des questions sur votre \u00e9nergie, nutrition, stress, sommeil ou humeur.",
    quickTired: "Pourquoi suis-je fatigu\u00e9e ?",
    quickEat: "Que devrais-je manger ?",
    quickStress: "Comment va mon stress ?",
    quickSleep: "Conseils sommeil",

    phaseMenstrual: "menstruelle",
    phaseFollicular: "folliculaire",
    phaseOvulation: "ovulatoire",
    phaseLuteal: "lut\u00e9ale",

    energyIntro: "Vous \u00eates au jour {cycleDay} de votre cycle (phase {phaseName}).",
    energyScoreToday: " Votre score d'\u00e9nergie aujourd'hui est de {energy}/10",
    energyLower: ", ce qui est inf\u00e9rieur \u00e0 votre moyenne de {avg}.",
    energyHigher: ", ce qui est sup\u00e9rieur \u00e0 votre moyenne de {avg}.",
    energySame: ", ce qui est \u00e0 peu pr\u00e8s \u00e9gal \u00e0 votre moyenne de {avg}.",
    energyLuteal: " Beaucoup de personnes ressentent une baisse d'\u00e9nergie pendant la phase lut\u00e9ale. Envisagez des mouvements doux comme la marche ou le yoga, et essayez de vous coucher 30 minutes plus t\u00f4t ce soir.",
    energyMenstrual: " Pendant les r\u00e8gles, votre corps utilise de l'\u00e9nergie suppl\u00e9mentaire. Priorisez le repos, les aliments riches en fer comme les l\u00e9gumes verts, et restez bien hydrat\u00e9e.",
    energyFollicular: " La phase folliculaire apporte g\u00e9n\u00e9ralement une \u00e9nergie croissante. Si vous vous sentez encore fatigu\u00e9e, v\u00e9rifiez votre qualit\u00e9 de sommeil et votre hydratation.",
    energyOvulation: " Pendant l'ovulation, l'\u00e9nergie est g\u00e9n\u00e9ralement \u00e0 son maximum. Si vous \u00eates fatigu\u00e9e, il peut \u00eatre utile de v\u00e9rifier votre sommeil et votre niveau de stress.",
    energyHighFatigue: " Votre indicateur de fatigue est \u00e9lev\u00e9 aujourd'hui \u2014 envisagez une courte sieste ou une s\u00e9ance d'\u00e9tirements l\u00e9gers.",

    foodIntro: "Pendant la phase {phaseName}, ",
    foodLuteal: "votre corps peut b\u00e9n\u00e9ficier de glucides complexes, d'aliments riches en magn\u00e9sium (chocolat noir, noix) et de choix anti-inflammatoires.",
    foodInflammation: " Votre score d'inflammation est l\u00e9g\u00e8rement plus \u00e9lev\u00e9 aujourd'hui \u2014 envisagez d'ajouter du curcuma ou du gingembre \u00e0 vos repas.",
    foodMenstrual: "concentrez-vous sur les aliments riches en fer (\u00e9pinards, lentilles, viande rouge), les soupes r\u00e9chauffantes et les options anti-inflammatoires. Le chocolat noir et les aliments riches en magn\u00e9sium peuvent aussi aider contre les crampes.",
    foodFollicular: "votre m\u00e9tabolisme s'acc\u00e9l\u00e8re. Prot\u00e9ines maigres, l\u00e9gumes frais et aliments ferment\u00e9s soutiennent la mont\u00e9e d'\u0153strog\u00e8ne. C'est le moment id\u00e9al pour exp\u00e9rimenter de nouvelles recettes.",
    foodOvulation: "l'\u00e9nergie est \u00e9lev\u00e9e et votre corps g\u00e8re bien les glucides. Concentrez-vous sur les aliments riches en fibres, les graisses saines et beaucoup de fruits et l\u00e9gumes riches en antioxydants.",
    foodLowHydration: " Votre niveau d'hydratation est inf\u00e9rieur \u00e0 l'id\u00e9al \u2014 visez au moins 8 verres d'eau aujourd'hui.",

    stressIntro: "Vous \u00eates dans la phase {phaseName} (jour {cycleDay}).",
    stressScoreToday: " Votre score de stress aujourd'hui est de {stress}/10",
    stressAvg: " (votre moyenne est de {avg}).",
    stressHigh: " Votre niveau de stress est nettement \u00e9lev\u00e9. Essayez un exercice de respiration carr\u00e9e de 5 minutes : inspirez 4 temps, retenez 4, expirez 4, retenez 4. R\u00e9p\u00e9tez 5 fois.",
    stressModerate: " Votre stress est mod\u00e9r\u00e9. Une courte marche dehors, de la respiration profonde ou quelques minutes de journaling pourraient aider \u00e0 le r\u00e9duire.",
    stressLow: " Votre niveau de stress semble bien g\u00e9r\u00e9 aujourd'hui. Continuez avec la routine qui fonctionne pour vous.",
    stressNoScan: " Faites un scan aujourd'hui pour obtenir des informations personnalis\u00e9es sur le stress. En attendant, essayez 5 minutes de respiration profonde ou une courte marche.",
    stressLutealNote: " La phase lut\u00e9ale peut amplifier la sensibilit\u00e9 au stress \u2014 soyez particuli\u00e8rement douce avec vous-m\u00eame cette semaine.",

    sleepLogged: "D'apr\u00e8s votre check-in, vous avez enregistr\u00e9 {hours} heures de sommeil. ",
    sleepLow: "C'est en dessous des 7-9 heures recommand\u00e9es. ",
    sleepSlightlyLow: "C'est l\u00e9g\u00e8rement en dessous de la plage optimale. ",
    sleepGood: "C'est dans une plage saine. ",
    sleepLuteal: "Pendant la phase lut\u00e9ale, la progest\u00e9rone augmente, ce qui peut vous rendre plus somnolente mais paradoxalement perturber le sommeil profond. Essayez le magn\u00e9sium avant le coucher (200-400mg), \u00e9vitez les \u00e9crans 1 heure avant de dormir et gardez votre chambre fra\u00eeche (environ 18-20\u00b0C).",
    sleepMenstrual: "Les r\u00e8gles peuvent affecter la qualit\u00e9 du sommeil. Un bain chaud avant le coucher, une tisane de camomille et des \u00e9tirements doux peuvent aider. Envisagez un coussin chauffant si les crampes perturbent votre repos.",
    sleepFollicular: "L'\u0153strog\u00e8ne en hausse dans la phase folliculaire favorise g\u00e9n\u00e9ralement un meilleur sommeil. Profitez de cette p\u00e9riode pour \u00e9tablir de bonnes habitudes de sommeil : heure de coucher r\u00e9guli\u00e8re, pas de caf\u00e9ine apr\u00e8s 14h et une chambre sombre et fra\u00eeche.",
    sleepOvulation: "Autour de l'ovulation, la temp\u00e9rature corporelle augmente l\u00e9g\u00e8rement, ce qui peut affecter le sommeil. Gardez votre chambre bien fra\u00eeche et optez pour une literie l\u00e9g\u00e8re. C'est le bon moment pour une routine apaisante au coucher.",
    sleepLowRecovery: " Votre score de r\u00e9cup\u00e9ration est bas \u2014 priorisez le sommeil ce soir pour aider votre corps \u00e0 se restaurer.",

    moodIntro: "Vous \u00eates dans la phase {phaseName}. ",
    moodScoreToday: "Votre humeur aujourd'hui est de {mood}/10. ",
    moodLow: "C'est plus bas qu'id\u00e9al. ",
    moodLuteal: "La phase lut\u00e9ale peut entra\u00eener des fluctuations d'humeur dues aux changements de progest\u00e9rone. Le journaling, l'exercice l\u00e9ger et le contact avec une personne de confiance peuvent aider \u00e0 stabiliser vos \u00e9motions.",
    moodMenstrual: "Les hormones sont au plus bas pendant les r\u00e8gles, ce qui peut affecter l'humeur. Soyez douce avec vous-m\u00eame \u2014 prendre soin de soi, se reposer et manger des aliments r\u00e9confortants (avec mod\u00e9ration) est tout \u00e0 fait appropri\u00e9.",
    moodFollicular: "L'\u0153strog\u00e8ne en hausse apporte g\u00e9n\u00e9ralement une meilleure humeur et motivation. C'est le moment id\u00e9al pour les activit\u00e9s sociales, les projets cr\u00e9atifs et essayer de nouvelles choses.",
    moodOvulation: "L'ovulation apporte souvent un pic d'humeur gr\u00e2ce \u00e0 un \u0153strog\u00e8ne \u00e9lev\u00e9 et une pouss\u00e9e de LH. Profitez de cette \u00e9nergie sociale et confiante tant qu'elle dure.",

    exerciseIntro: "Pour la phase {phaseName} (jour {cycleDay}), ",
    exerciseMenstrual: "des mouvements doux comme la marche, le yoga ou les \u00e9tirements l\u00e9gers sont recommand\u00e9s. Votre corps r\u00e9cup\u00e8re, alors \u00e9vitez de trop forcer.",
    exerciseFollicular: "votre corps est pr\u00eat pour des gains de force. Essayez la musculation, le HIIT ou l'apprentissage de nouvelles comp\u00e9tences athl\u00e9tiques. L'\u00e9nergie et la coordination s'am\u00e9liorent.",
    exerciseOvulation: "c'est votre fen\u00eatre de performance maximale. Visez des records personnels, des entra\u00eenements haute intensit\u00e9 ou des cours collectifs exigeants. Votre corps peut en supporter plus maintenant.",
    exerciseLuteal: "concentrez-vous sur l'exercice d'intensit\u00e9 mod\u00e9r\u00e9e. Pilates, cardio mod\u00e9r\u00e9 et yoga sont d'excellents choix. \u00c0 mesure que la phase avance, passez \u00e0 des activit\u00e9s plus l\u00e9g\u00e8res.",
    exerciseLowEnergy: " Cependant, votre \u00e9nergie est assez basse aujourd'hui \u2014 il est tout \u00e0 fait acceptable de faire quelque chose de doux ou de prendre un jour de repos.",

    skinIntro: "Pendant la phase {phaseName}, ",
    skinLuteal: "la progest\u00e9rone en hausse augmente la production de s\u00e9bum et peut d\u00e9clencher des \u00e9ruptions. Utilisez des produits doux et non-com\u00e9dog\u00e8nes, de l'acide salicylique pour les imperfections et de la niacinamide pour contr\u00f4ler le s\u00e9bum.",
    skinMenstrual: "la peau peut \u00eatre sensible et s\u00e8che. Utilisez des produits hydratants et doux, et \u00e9vitez les exfoliants agressifs. Privil\u00e9giez les ingr\u00e9dients apaisants comme l'aloe et la centella.",
    skinFollicular: "l'\u0153strog\u00e8ne monte et la peau para\u00eet g\u00e9n\u00e9ralement plus nette. C'est le moment id\u00e9al pour l'exfoliation, les s\u00e9rums \u00e0 la vitamine C et essayer de nouveaux actifs.",
    skinOvulation: "vous \u00eates probablement \u00e0 votre plus bel \u00e9clat. Le pic d'\u0153strog\u00e8ne cr\u00e9e un \u00e9clat naturel. Gardez votre routine simple et profitez-en.",

    fallbackIntro: "Je peux vous aider avec des questions sur votre \u00e9nergie, nutrition, stress, sommeil, humeur, exercice et soins de la peau \u2014 le tout personnalis\u00e9 pour votre phase {phaseName} (jour {cycleDay} sur {totalDays}).",
    fallbackScan: "\n\nVotre dernier scan montre : \u00e9nergie {energy}/10, stress {stress}/10, r\u00e9cup\u00e9ration {recovery}/10.",
    fallbackSuggestions: "\n\nEssayez de me poser des questions comme :\n- Pourquoi suis-je fatigu\u00e9e ?\n- Que devrais-je manger ?\n- Comment va mon stress ?\n- Donne-moi des conseils sommeil\n- Quel entra\u00eenement faire ?\n- Comment va ma peau cette semaine ?",

    "kw.energy": "fatigu\u00e9e|fatigue|\u00e9nergie|\u00e9puis\u00e9e|lasse|crev\u00e9e",
    "kw.food": "manger|nourriture|nutrition|alimentation|r\u00e9gime",
    "kw.stress": "stress|anxi\u00e9t\u00e9|anxieuse|d\u00e9bord\u00e9e|submerg\u00e9e",
    "kw.sleep": "sommeil|insomnie|dormir|repos",
    "kw.mood": "humeur|triste|heureuse|\u00e9motionnelle|d\u00e9prim\u00e9e",
    "kw.exercise": "exercice|entra\u00eenement|sport|mouvement|salle",
    "kw.skin": "peau|acn\u00e9|\u00e9clat|boutons|imperfections",

    // Hydration responses
    hydrationIntro: "Rester bien hydrat\u00e9e est important pendant la phase {phaseName}. ",
    hydrationVeryLow: "Votre niveau d\u2019hydratation est \u00e0 {hydration}/10 \u2014 c\u2019est assez bas. Essayez de boire un verre d\u2019eau maintenant et programmez des rappels tout au long de la journ\u00e9e. ",
    hydrationLow: "Votre niveau d\u2019hydratation est \u00e0 {hydration}/10 \u2014 un peu en dessous de l\u2019optimal. Visez au moins 8 verres aujourd\u2019hui. ",
    hydrationGood: "Votre niveau d\u2019hydratation est \u00e0 {hydration}/10 \u2014 c\u2019est bien ! Continuez comme \u00e7a. ",
    hydrationMenstrual: "Pendant les r\u00e8gles, vous perdez des fluides suppl\u00e9mentaires. Les tisanes chaudes (gingembre, camomille) comptent dans l\u2019hydratation et peuvent aussi soulager les crampes.",
    hydrationOvulation: "Autour de l\u2019ovulation, la temp\u00e9rature corporelle augmente l\u00e9g\u00e8rement. Augmentez l\u2019apport en eau et ajoutez des \u00e9lectrolytes si vous \u00eates active.",
    hydrationLuteal: "En phase lut\u00e9ale, la progest\u00e9rone peut provoquer une r\u00e9tention d\u2019eau. Paradoxalement, boire PLUS d\u2019eau aide \u00e0 r\u00e9duire les ballonnements.",
    hydrationFollicular: "La phase folliculaire est un bon moment pour cr\u00e9er des habitudes d\u2019hydratation. Essayez d\u2019infuser l\u2019eau avec du citron, du concombre ou des baies pour varier.",

    // Cramps/pain responses
    crampsIntro: "Parlons de la gestion de l\u2019inconfort pendant la phase {phaseName} (jour {cycleDay}). ",
    crampsMenstrual: "Les crampes menstruelles sont caus\u00e9es par les prostaglandines. Ce qui peut aider : une bouillotte sur le bas-ventre, une marche douce, des aliments riches en magn\u00e9sium (chocolat noir, bananes) et des tisanes anti-inflammatoires comme le gingembre ou la camomille. Des postures de yoga douces comme la posture de l\u2019enfant et chat-vache peuvent aussi soulager les tensions.",
    crampsLuteal: "L\u2019inconfort pr\u00e9menstruel est courant en phase lut\u00e9ale. Les compl\u00e9ments de magn\u00e9sium (200-400mg), les aliments riches en calcium, l\u2019exercice doux r\u00e9gulier et la r\u00e9duction de la caf\u00e9ine et du sel peuvent aider \u00e0 g\u00e9rer les sympt\u00f4mes du SPM.",
    crampsOvulation: "Certaines personnes ressentent le mittelschmerz \u2014 une douleur br\u00e8ve et aig\u00fce pendant l\u2019ovulation. C\u2019est normal. Une compresse chaude et un mouvement l\u00e9ger aident g\u00e9n\u00e9ralement. Si la douleur est forte ou persistante, consultez votre m\u00e9decin.",
    crampsFollicular: "La phase folliculaire est g\u00e9n\u00e9ralement la plus confortable. Si vous ressentez un inconfort inhabituel, pensez \u00e0 le noter \u2014 les tendances peuvent vous aider, vous et votre m\u00e9decin, \u00e0 identifier d\u2019\u00e9ventuels probl\u00e8mes.",

    // Libido/intimacy responses
    libidoIntro: "La libido fluctue naturellement avec votre cycle. Pendant la phase {phaseName} : ",
    libidoOvulation: "la libido a tendance \u00e0 atteindre son pic autour de l\u2019ovulation en raison de niveaux \u00e9lev\u00e9s d\u2019\u0153strog\u00e8ne et de testost\u00e9rone. C\u2019est la fen\u00eatre de fertilit\u00e9 naturelle de votre corps. Profitez de ce d\u00e9sir et de cette confiance accrus.",
    libidoFollicular: "l\u2019\u0153strog\u00e8ne montant en phase folliculaire augmente progressivement le d\u00e9sir et l\u2019excitation. Vous pouvez vous sentir plus socialement \u00e9nergis\u00e9e et attir\u00e9e par les autres.",
    libidoLuteal: "la progest\u00e9rone augmente et peut r\u00e9duire la libido chez beaucoup de personnes. C\u2019est normal. Concentrez-vous sur l\u2019intimit\u00e9 \u00e9motionnelle et ne vous mettez pas la pression. Les c\u00e2lins et la connexion sont tout aussi importants.",
    libidoMenstrual: "la libido varie pendant les r\u00e8gles \u2014 certaines ressentent un d\u00e9sir accru tandis que d\u2019autres non. Les deux sont tout \u00e0 fait normaux. \u00c9coutez votre corps et faites ce qui vous semble juste.",

    // Supplements responses
    supplementsIntro: "Voici des recommandations de compl\u00e9ments pour la phase {phaseName} (consultez toujours votre m\u00e9decin d\u2019abord) : ",
    supplementsMenstrual: "Fer (surtout en cas de r\u00e8gles abondantes), magn\u00e9sium (200-400mg pour les crampes et l\u2019humeur), vitamine C (pour am\u00e9liorer l\u2019absorption du fer) et acides gras om\u00e9ga-3 (anti-inflammatoire). Les vitamines du complexe B peuvent aussi soutenir l\u2019\u00e9nergie.",
    supplementsFollicular: "Probiotiques pour soutenir la sant\u00e9 intestinale et le m\u00e9tabolisme des \u0153strog\u00e8nes, vitamine D (surtout si vous avez peu de soleil), zinc pour le soutien immunitaire et vitamines B pour l\u2019\u00e9nergie. C\u2019est un bon moment pour constituer vos r\u00e9serves nutritives.",
    supplementsOvulation: "Antioxydants comme les vitamines E et C, acides gras om\u00e9ga-3 et zinc. La NAC (N-ac\u00e9tylcyst\u00e9ine) peut soutenir une ovulation saine. Restez bien hydrat\u00e9e et privil\u00e9giez les aliments complets aux compl\u00e9ments quand c\u2019est possible.",
    supplementsLuteal: "Glycinate de magn\u00e9sium (pour le sommeil et l\u2019humeur), vitamine B6 (peut aider avec le SPM), calcium (1000mg a montr\u00e9 une r\u00e9duction des sympt\u00f4mes du SPM) et huile d\u2019onagre. Le gattilier (vitex) est aussi utilis\u00e9 par certaines pour le SPM, mais consultez votre m\u00e9decin d\u2019abord.",

    // Focus/productivity responses
    focusIntro: "Vos sch\u00e9mas cognitifs \u00e9voluent avec votre cycle. En phase {phaseName} (jour {cycleDay}) : ",
    focusFollicular: "l\u2019\u0153strog\u00e8ne montant am\u00e9liore les comp\u00e9tences verbales, la cr\u00e9ativit\u00e9 et l\u2019apprentissage. C\u2019est votre meilleur moment pour le brainstorming, d\u00e9marrer de nouveaux projets, planifier et absorber de nouvelles informations. Planifiez maintenant vos r\u00e9unions importantes et le travail cr\u00e9atif.",
    focusOvulation: "vos comp\u00e9tences en communication et votre intelligence sociale sont \u00e0 leur apog\u00e9e. Bon moment pour les pr\u00e9sentations, n\u00e9gociations, collaborations et le r\u00e9seautage. Vous trouverez peut-\u00eatre plus facile de faire plusieurs choses \u00e0 la fois et de r\u00e9fl\u00e9chir rapidement.",
    focusLuteal: "la progest\u00e9rone oriente votre cerveau vers une pens\u00e9e d\u00e9taill\u00e9e et m\u00e9thodique. Utilisez cela pour la r\u00e9vision, la relecture, l\u2019organisation, la finalisation de projets et les t\u00e2ches administratives. \u00c9vitez de d\u00e9marrer des projets enti\u00e8rement nouveaux si possible.",
    focusMenstrual: "votre cerveau est dans un \u00e9tat r\u00e9flexif et \u00e9valuatif. C\u2019est en fait id\u00e9al pour la pens\u00e9e strat\u00e9gique, la r\u00e9vision des objectifs, l\u2019\u00e9criture de journal et la prise de d\u00e9cisions bas\u00e9es sur l\u2019intuition. Ne forcez pas un travail cr\u00e9atif intense \u2014 planifiez et r\u00e9fl\u00e9chissez plut\u00f4t.",
    focusLowEnergy: " Votre \u00e9nergie est basse aujourd\u2019hui \u2014 essayez de travailler en blocs de concentration de 25 minutes (technique Pomodoro) avec des pauses de 5 minutes.",

    // Cycle knowledge responses
    cycleIntro: "Vous \u00eates au jour {cycleDay} sur {totalDays} de votre cycle, actuellement en phase {phaseName}. ",
    cycleMenstrual: "La phase menstruelle (g\u00e9n\u00e9ralement jours 1-5) est le moment o\u00f9 la muqueuse ut\u00e9rine est \u00e9limin\u00e9e. Les niveaux hormonaux (\u0153strog\u00e8ne et progest\u00e9rone) sont au plus bas. Votre corps se concentre sur le renouvellement. Consid\u00e9rez cela comme votre hiver int\u00e9rieur \u2014 un temps de repos, de r\u00e9flexion et de soins doux.",
    cycleFollicular: "La phase folliculaire (g\u00e9n\u00e9ralement jours 6-13) est le moment o\u00f9 votre corps pr\u00e9pare un nouvel ovule. L\u2019\u0153strog\u00e8ne monte r\u00e9guli\u00e8rement, stimulant l\u2019\u00e9nergie, l\u2019humeur et la cr\u00e9ativit\u00e9. Consid\u00e9rez cela comme votre printemps int\u00e9rieur \u2014 un temps de croissance et de nouveaux d\u00e9buts.",
    cycleOvulation: "La phase ovulatoire (g\u00e9n\u00e9ralement jours 14-16) est le moment o\u00f9 un ovule mature est lib\u00e9r\u00e9. L\u2019\u0153strog\u00e8ne atteint son pic et l\u2019hormone lut\u00e9inisante monte en fl\u00e8che. Vous vous sentez peut-\u00eatre au plus sociable, confiante et \u00e9nergique. Consid\u00e9rez cela comme votre \u00e9t\u00e9 int\u00e9rieur \u2014 votre fen\u00eatre de performance maximale.",
    cycleLuteal: "La phase lut\u00e9ale (g\u00e9n\u00e9ralement jours 17-28) est le moment o\u00f9 la progest\u00e9rone augmente pour pr\u00e9parer une \u00e9ventuelle implantation. Si la grossesse n\u2019a pas lieu, les hormones chutent et le cycle recommence. Consid\u00e9rez cela comme votre automne int\u00e9rieur \u2014 un temps pour ralentir et se cocooner.",

    // Quick reply additions
    quickCramps: "Aide pour les crampes",
    quickFocus: "Conseils de concentration",

    // New keyword arrays
    "kw.hydration": "hydratation|eau|soif|d\u00e9shydrat\u00e9e|boire|liquide",
    "kw.cramps": "crampes|douleur|ballonnements|spm|inconfort|r\u00e8gles douloureuses",
    "kw.libido": "libido|sexe|intimit\u00e9|d\u00e9sir|excitation",
    "kw.supplements": "compl\u00e9ment|vitamine|min\u00e9ral|magn\u00e9sium|fer|zinc",
    "kw.focus": "concentration|productivit\u00e9|brouillard mental|cognitif|focus",
    "kw.cycle": "cycle|r\u00e8gles|phase|ovulation|menstruel|lut\u00e9al|folliculaire",
  },

  es: {
    headerTitle: "Compa\u00f1ero de Bienestar",
    headerSubtitle: "Fase {phaseName} \u00b7 D\u00eda {cycleDay}",
    inputPlaceholder: "Pregunta a IRIS...",
    welcomeMessage: "\u00a1Hola! Soy tu compa\u00f1ero de bienestar IRIS. Utilizo tus datos de ciclo, escaneo y registro diario para darte orientaci\u00f3n personalizada. Preg\u00fantame sobre tu energ\u00eda, nutrici\u00f3n, estr\u00e9s, sue\u00f1o o estado de \u00e1nimo.",
    quickTired: "\u00bfPor qu\u00e9 estoy cansada?",
    quickEat: "\u00bfQu\u00e9 deber\u00eda comer?",
    quickStress: "\u00bfC\u00f3mo est\u00e1 mi estr\u00e9s?",
    quickSleep: "Consejos de sue\u00f1o",

    phaseMenstrual: "menstrual",
    phaseFollicular: "folicular",
    phaseOvulation: "ovulatoria",
    phaseLuteal: "l\u00fatea",

    energyIntro: "Est\u00e1s en el d\u00eda {cycleDay} de tu ciclo (fase {phaseName}).",
    energyScoreToday: " Tu puntuaci\u00f3n de energ\u00eda hoy es {energy}/10",
    energyLower: ", lo cual es inferior a tu promedio de {avg}.",
    energyHigher: ", lo cual es superior a tu promedio de {avg}.",
    energySame: ", lo cual es similar a tu promedio de {avg}.",
    energyLuteal: " Muchas personas experimentan menor energ\u00eda en la fase l\u00fatea. Considera movimientos suaves como caminar o yoga, e intenta acostarte 30 minutos antes esta noche.",
    energyMenstrual: " Durante la menstruaci\u00f3n, tu cuerpo usa energ\u00eda adicional. Prioriza el descanso, alimentos ricos en hierro como verduras de hoja verde, y mant\u00e9nte bien hidratada.",
    energyFollicular: " La fase folicular suele traer energ\u00eda creciente. Si a\u00fan te sientes cansada, revisa tu calidad de sue\u00f1o y niveles de hidrataci\u00f3n.",
    energyOvulation: " Durante la ovulaci\u00f3n, la energ\u00eda est\u00e1 t\u00edpicamente en su punto m\u00e1ximo. Si te sientes cansada, puede valer la pena revisar tu sue\u00f1o y niveles de estr\u00e9s.",
    energyHighFatigue: " Tu indicador de fatiga est\u00e1 elevado hoy \u2014 considera una siesta corta o una sesi\u00f3n de estiramientos suaves.",

    foodIntro: "Durante la fase {phaseName}, ",
    foodLuteal: "tu cuerpo puede beneficiarse de carbohidratos complejos, alimentos ricos en magnesio (chocolate oscuro, nueces) y opciones antiinflamatorias.",
    foodInflammation: " Tu puntuaci\u00f3n de inflamaci\u00f3n est\u00e1 ligeramente m\u00e1s alta hoy \u2014 considera a\u00f1adir c\u00farcuma o jengibre a tus comidas.",
    foodMenstrual: "c\u00e9ntrate en alimentos ricos en hierro (espinacas, lentejas, carne roja), sopas calientes y opciones antiinflamatorias. El chocolate oscuro y los alimentos ricos en magnesio tambi\u00e9n pueden ayudar con los calambres.",
    foodFollicular: "tu metabolismo se est\u00e1 acelerando. Prote\u00ednas magras, vegetales frescos y alimentos fermentados apoyan el aumento de estr\u00f3geno. Es un gran momento para experimentar con nuevas recetas.",
    foodOvulation: "la energ\u00eda es alta y tu cuerpo maneja bien los carbohidratos. C\u00e9ntrate en alimentos ricos en fibra, grasas saludables y muchas frutas y verduras ricas en antioxidantes.",
    foodLowHydration: " Tu nivel de hidrataci\u00f3n es m\u00e1s bajo de lo ideal \u2014 intenta beber al menos 8 vasos de agua hoy.",

    stressIntro: "Est\u00e1s en la fase {phaseName} (d\u00eda {cycleDay}).",
    stressScoreToday: " Tu puntuaci\u00f3n de estr\u00e9s hoy es {stress}/10",
    stressAvg: " (tu promedio es {avg}).",
    stressHigh: " Tu nivel de estr\u00e9s est\u00e1 notablemente elevado. Prueba un ejercicio de respiraci\u00f3n cuadrada de 5 minutos: inhala 4 tiempos, mant\u00e9n 4, exhala 4, mant\u00e9n 4. Repite 5 veces.",
    stressModerate: " Tu estr\u00e9s es moderado. Un paseo corto al aire libre, respiraci\u00f3n profunda o unos minutos de escritura terap\u00e9utica podr\u00edan ayudar a reducirlo.",
    stressLow: " Tu nivel de estr\u00e9s parece bien gestionado hoy. Sigue con la rutina que te funciona.",
    stressNoScan: " Completa un escaneo hoy para obtener informaci\u00f3n personalizada sobre el estr\u00e9s. Mientras tanto, prueba 5 minutos de respiraci\u00f3n profunda o un paseo corto.",
    stressLutealNote: " La fase l\u00fatea puede amplificar la sensibilidad al estr\u00e9s \u2014 s\u00e9 especialmente amable contigo misma esta semana.",

    sleepLogged: "Seg\u00fan tu registro, dormiste {hours} horas. ",
    sleepLow: "Eso est\u00e1 por debajo de las 7-9 horas recomendadas. ",
    sleepSlightlyLow: "Eso est\u00e1 ligeramente por debajo del rango \u00f3ptimo. ",
    sleepGood: "Eso est\u00e1 dentro de un rango saludable. ",
    sleepLuteal: "Durante la fase l\u00fatea, la progesterona sube lo que puede hacerte sentir m\u00e1s somnolenta pero parad\u00f3jicamente interrumpir el sue\u00f1o profundo. Prueba magnesio antes de dormir (200-400mg), evita pantallas 1 hora antes de acostarte y mant\u00e9n tu habitaci\u00f3n fresca (alrededor de 18-20\u00b0C).",
    sleepMenstrual: "La menstruaci\u00f3n puede afectar la calidad del sue\u00f1o. Un ba\u00f1o caliente antes de dormir, infusi\u00f3n de manzanilla y estiramientos suaves pueden ayudar. Considera una almohadilla t\u00e9rmica si los calambres interrumpen tu descanso.",
    sleepFollicular: "El aumento de estr\u00f3geno en la fase folicular generalmente favorece un mejor sue\u00f1o. Usa este tiempo para establecer buenos h\u00e1bitos de sue\u00f1o: horario consistente, sin cafe\u00edna despu\u00e9s de las 14h y una habitaci\u00f3n oscura y fresca.",
    sleepOvulation: "Alrededor de la ovulaci\u00f3n, la temperatura corporal sube ligeramente lo que puede afectar el sue\u00f1o. Mant\u00e9n tu dormitorio extra fresco y considera ropa de cama ligera. Es un buen momento para una rutina relajante antes de dormir.",
    sleepLowRecovery: " Tu puntuaci\u00f3n de recuperaci\u00f3n es baja \u2014 priorizar el sue\u00f1o esta noche ayudar\u00e1 a tu cuerpo a restaurarse.",

    moodIntro: "Est\u00e1s en la fase {phaseName}. ",
    moodScoreToday: "Tu estado de \u00e1nimo hoy es {mood}/10. ",
    moodLow: "Eso es m\u00e1s bajo de lo ideal. ",
    moodLuteal: "La fase l\u00fatea puede traer fluctuaciones de humor debido a los cambios en la progesterona. Escribir un diario, hacer ejercicio suave y hablar con alguien de confianza pueden ayudar a estabilizar tus emociones.",
    moodMenstrual: "Las hormonas est\u00e1n en su punto m\u00e1s bajo durante la menstruaci\u00f3n, lo que puede afectar el \u00e1nimo. S\u00e9 amable contigo misma \u2014 el autocuidado, el descanso y la comida reconfortante (con moderaci\u00f3n) son apropiados ahora.",
    moodFollicular: "El aumento de estr\u00f3geno t\u00edpicamente trae mejor humor y motivaci\u00f3n. Es un gran momento para actividades sociales, proyectos creativos y probar cosas nuevas.",
    moodOvulation: "La ovulaci\u00f3n a menudo trae un pico de \u00e1nimo gracias al alto estr\u00f3geno y un aumento de LH. Disfruta de esta energ\u00eda social y segura mientras dure.",

    exerciseIntro: "Para la fase {phaseName} (d\u00eda {cycleDay}), ",
    exerciseMenstrual: "se recomienda movimiento suave como caminar, yoga o estiramientos ligeros. Tu cuerpo se est\u00e1 recuperando, as\u00ed que evita exigirte demasiado.",
    exerciseFollicular: "tu cuerpo est\u00e1 listo para ganancias de fuerza. Prueba entrenamiento de fuerza, HIIT o aprende nuevas habilidades deportivas. La energ\u00eda y la coordinaci\u00f3n est\u00e1n mejorando.",
    exerciseOvulation: "esta es tu ventana de m\u00e1ximo rendimiento. Busca records personales, entrenamientos de alta intensidad o clases grupales desafiantes. Tu cuerpo puede manejar m\u00e1s ahora.",
    exerciseLuteal: "c\u00e9ntrate en ejercicio de intensidad moderada. Pilates, cardio moderado y yoga son excelentes opciones. A medida que avanza la fase, transiciona a actividades m\u00e1s suaves.",
    exerciseLowEnergy: " Sin embargo, tu energ\u00eda es bastante baja hoy \u2014 est\u00e1 bien hacer algo suave o tomar un d\u00eda de descanso.",

    skinIntro: "Durante la fase {phaseName}, ",
    skinLuteal: "el aumento de progesterona incrementa la producci\u00f3n de sebo y puede desencadenar brotes. Usa productos suaves y no comedog\u00e9nicos, \u00e1cido salic\u00edlico para imperfecciones y niacinamida para controlar la grasa.",
    skinMenstrual: "la piel puede estar sensible y seca. Usa productos hidratantes y suaves, y evita exfoliantes agresivos. C\u00e9ntrate en ingredientes calmantes como aloe y centella.",
    skinFollicular: "el estr\u00f3geno sube y la piel suele verse m\u00e1s clara. Es un gran momento para exfoliaci\u00f3n, s\u00e9rums de vitamina C y probar nuevos ingredientes activos.",
    skinOvulation: "probablemente est\u00e9s en tu mejor momento de luminosidad. El pico de estr\u00f3geno crea un brillo natural. Mant\u00e9n tu rutina sencilla y disfr\u00fatala.",

    fallbackIntro: "Puedo ayudarte con preguntas sobre tu energ\u00eda, nutrici\u00f3n, estr\u00e9s, sue\u00f1o, estado de \u00e1nimo, ejercicio y cuidado de la piel \u2014 todo personalizado para tu fase {phaseName} (d\u00eda {cycleDay} de {totalDays}).",
    fallbackScan: "\n\nTu \u00faltimo escaneo muestra: energ\u00eda {energy}/10, estr\u00e9s {stress}/10, recuperaci\u00f3n {recovery}/10.",
    fallbackSuggestions: "\n\nPrueba a preguntarme cosas como:\n- \u00bfPor qu\u00e9 estoy cansada?\n- \u00bfQu\u00e9 deber\u00eda comer?\n- \u00bfC\u00f3mo est\u00e1 mi estr\u00e9s?\n- Dame consejos de sue\u00f1o\n- \u00bfQu\u00e9 entrenamiento deber\u00eda hacer?\n- \u00bfC\u00f3mo est\u00e1 mi piel esta semana?",

    "kw.energy": "cansada|energ\u00eda|fatiga|agotada|exhausta",
    "kw.food": "comer|comida|nutrici\u00f3n|dieta|alimentaci\u00f3n",
    "kw.stress": "estr\u00e9s|ansiosa|ansiedad|abrumada|agobiada",
    "kw.sleep": "sue\u00f1o|insomnio|dormir|descanso|descansar",
    "kw.mood": "humor|\u00e1nimo|triste|feliz|emocional|deprimida",
    "kw.exercise": "ejercicio|entrenamiento|deporte|movimiento|gimnasio",
    "kw.skin": "piel|acn\u00e9|brillo|granos|imperfecciones",

    // Hydration responses
    hydrationIntro: "Mantenerse bien hidratada es importante durante la fase {phaseName}. ",
    hydrationVeryLow: "Tu nivel de hidrataci\u00f3n es {hydration}/10 \u2014 es bastante bajo. Intenta beber un vaso de agua ahora mismo y pon recordatorios durante el d\u00eda. ",
    hydrationLow: "Tu nivel de hidrataci\u00f3n es {hydration}/10 \u2014 un poco por debajo de lo \u00f3ptimo. Intenta tomar al menos 8 vasos hoy. ",
    hydrationGood: "Tu nivel de hidrataci\u00f3n es {hydration}/10 \u2014 \u00a1lo est\u00e1s haciendo bien! Sigue as\u00ed. ",
    hydrationMenstrual: "Durante la menstruaci\u00f3n, pierdes l\u00edquidos adicionales. Las infusiones calientes (jengibre, manzanilla) cuentan como hidrataci\u00f3n y tambi\u00e9n pueden aliviar los calambres.",
    hydrationOvulation: "Alrededor de la ovulaci\u00f3n, la temperatura corporal sube ligeramente. Aumenta la ingesta de agua y a\u00f1ade electrolitos si est\u00e1s activa.",
    hydrationLuteal: "En la fase l\u00fatea, la progesterona puede causar retenci\u00f3n de l\u00edquidos. Parad\u00f3jicamente, beber M\u00c1S agua ayuda a reducir la hinchaz\u00f3n.",
    hydrationFollicular: "La fase folicular es un buen momento para crear h\u00e1bitos de hidrataci\u00f3n. Prueba a infusionar el agua con lim\u00f3n, pepino o frutos rojos para variar.",

    // Cramps/pain responses
    crampsIntro: "Hablemos sobre c\u00f3mo manejar las molestias durante la fase {phaseName} (d\u00eda {cycleDay}). ",
    crampsMenstrual: "Los calambres menstruales son causados por las prostaglandinas. Lo que puede ayudar: una bolsa de calor en el bajo vientre, caminatas suaves, alimentos ricos en magnesio (chocolate negro, pl\u00e1tanos) e infusiones antiinflamatorias como jengibre o manzanilla. Posturas suaves de yoga como la postura del ni\u00f1o y gato-vaca tambi\u00e9n pueden aliviar la tensi\u00f3n.",
    crampsLuteal: "Las molestias premenstruales son comunes en la fase l\u00fatea. Suplementos de magnesio (200-400mg), alimentos ricos en calcio, ejercicio suave regular y reducir la cafe\u00edna y la sal pueden ayudar a controlar los s\u00edntomas del SPM.",
    crampsOvulation: "Algunas personas experimentan mittelschmerz \u2014 un dolor breve y agudo durante la ovulaci\u00f3n. Es normal. Una compresa caliente y movimiento ligero suelen ayudar. Si el dolor es intenso o persistente, consulta a tu m\u00e9dico.",
    crampsFollicular: "La fase folicular suele ser la m\u00e1s c\u00f3moda. Si experimentas molestias inusuales, considera registrarlas \u2014 los patrones pueden ayudarte a ti y a tu m\u00e9dico a identificar posibles problemas.",

    // Libido/intimacy responses
    libidoIntro: "La libido fluctu\u00faa naturalmente con tu ciclo. Durante la fase {phaseName}: ",
    libidoOvulation: "la libido tiende a alcanzar su punto m\u00e1ximo alrededor de la ovulaci\u00f3n debido a los altos niveles de estr\u00f3geno y testosterona. Esta es la ventana de fertilidad natural de tu cuerpo. Disfruta de este mayor deseo y confianza.",
    libidoFollicular: "el estr\u00f3geno en aumento en la fase folicular incrementa gradualmente el deseo y la excitaci\u00f3n. Puedes sentirte m\u00e1s energ\u00e9tica socialmente y atra\u00edda por los dem\u00e1s.",
    libidoLuteal: "la progesterona sube y puede reducir la libido en muchas personas. Esto es normal. Conc\u00e9ntrate en la intimidad emocional y no te presiones. Los abrazos y la conexi\u00f3n son igual de v\u00e1lidos.",
    libidoMenstrual: "la libido var\u00eda durante la menstruaci\u00f3n \u2014 algunas sienten mayor deseo mientras que otras no. Ambas opciones son completamente normales. Escucha a tu cuerpo y haz lo que te parezca correcto.",

    // Supplements responses
    supplementsIntro: "Aqu\u00ed tienes recomendaciones de suplementos para la fase {phaseName} (consulta siempre primero con tu m\u00e9dico): ",
    supplementsMenstrual: "Hierro (especialmente si tienes reglas abundantes), magnesio (200-400mg para calambres y estado de \u00e1nimo), vitamina C (para mejorar la absorci\u00f3n de hierro) y \u00e1cidos grasos omega-3 (antiinflamatorio). Las vitaminas del complejo B tambi\u00e9n pueden apoyar la energ\u00eda.",
    supplementsFollicular: "Probi\u00f3ticos para apoyar la salud intestinal y el metabolismo de estr\u00f3genos, vitamina D (especialmente si recibes poca luz solar), zinc para el apoyo inmunol\u00f3gico y vitaminas B para la energ\u00eda. Es un buen momento para enfocarte en construir reservas de nutrientes.",
    supplementsOvulation: "Antioxidantes como vitaminas E y C, \u00e1cidos grasos omega-3 y zinc. La NAC (N-acetilciste\u00edna) puede apoyar una ovulaci\u00f3n saludable. Mant\u00e9nte bien hidratada y prioriza los alimentos integrales sobre los suplementos cuando sea posible.",
    supplementsLuteal: "Glicinato de magnesio (para el sue\u00f1o y el estado de \u00e1nimo), vitamina B6 (puede ayudar con el SPM), calcio (1000mg ha demostrado reducir los s\u00edntomas del SPM) y aceite de onagra. El sauzgatillo (vitex) tambi\u00e9n es usado por algunas para el SPM, pero consulta primero con tu m\u00e9dico.",

    // Focus/productivity responses
    focusIntro: "Tus patrones cognitivos cambian con tu ciclo. En la fase {phaseName} (d\u00eda {cycleDay}): ",
    focusFollicular: "el estr\u00f3geno en aumento mejora las habilidades verbales, la creatividad y el aprendizaje. Este es tu mejor momento para hacer lluvia de ideas, comenzar nuevos proyectos, planificar y absorber nueva informaci\u00f3n. Programa ahora reuniones importantes y trabajo creativo.",
    focusOvulation: "tus habilidades de comunicaci\u00f3n e inteligencia social alcanzan su punto m\u00e1ximo. Buen momento para presentaciones, negociaciones, colaboraciones y networking. Puede que te resulte m\u00e1s f\u00e1cil hacer varias cosas a la vez y pensar r\u00e1pidamente.",
    focusLuteal: "la progesterona orienta tu cerebro hacia un pensamiento detallista y met\u00f3dico. \u00dasalo para edici\u00f3n, revisi\u00f3n, organizaci\u00f3n, terminar proyectos y tareas administrativas. Evita comenzar proyectos completamente nuevos si es posible.",
    focusMenstrual: "tu cerebro est\u00e1 en un estado reflexivo y evaluativo. Esto es en realidad ideal para el pensamiento estrat\u00e9gico, revisar objetivos, escribir un diario y tomar decisiones basadas en la intuici\u00f3n. No fuerces trabajo creativo de alta producci\u00f3n \u2014 en su lugar, planifica y reflexiona.",
    focusLowEnergy: " Tu energ\u00eda est\u00e1 baja hoy \u2014 prueba a trabajar en bloques de concentraci\u00f3n de 25 minutos (t\u00e9cnica Pomodoro) con pausas de 5 minutos.",

    // Cycle knowledge responses
    cycleIntro: "Est\u00e1s en el d\u00eda {cycleDay} de {totalDays} de tu ciclo, actualmente en la fase {phaseName}. ",
    cycleMenstrual: "La fase menstrual (normalmente d\u00edas 1-5) es cuando se desprende el revestimiento uterino. Los niveles hormonales (estr\u00f3geno y progesterona) est\u00e1n en su punto m\u00e1s bajo. Tu cuerpo se enfoca en la renovaci\u00f3n. Pi\u00e9nsalo como tu invierno interior \u2014 un tiempo de descanso, reflexi\u00f3n y autocuidado suave.",
    cycleFollicular: "La fase folicular (normalmente d\u00edas 6-13) es cuando tu cuerpo prepara un nuevo \u00f3vulo. El estr\u00f3geno sube constantemente, impulsando la energ\u00eda, el \u00e1nimo y la creatividad. Pi\u00e9nsalo como tu primavera interior \u2014 un tiempo de crecimiento y nuevos comienzos.",
    cycleOvulation: "La fase ovulatoria (normalmente d\u00edas 14-16) es cuando se libera un \u00f3vulo maduro. El estr\u00f3geno alcanza su pico y la hormona luteinizante aumenta bruscamente. Puedes sentirte lo m\u00e1s sociable, segura y en\u00e9rgica. Pi\u00e9nsalo como tu verano interior \u2014 tu ventana de m\u00e1ximo rendimiento.",
    cycleLuteal: "La fase l\u00fatea (normalmente d\u00edas 17-28) es cuando la progesterona sube para prepararse para una posible implantaci\u00f3n. Si no hay embarazo, las hormonas bajan y el ciclo comienza de nuevo. Pi\u00e9nsalo como tu oto\u00f1o interior \u2014 un tiempo para desacelerar y hacer nido.",

    // Quick reply additions
    quickCramps: "Ayuda con calambres",
    quickFocus: "Consejos de concentraci\u00f3n",

    // New keyword arrays
    "kw.hydration": "hidrataci\u00f3n|agua|sed|deshidratada|beber|l\u00edquido",
    "kw.cramps": "calambres|dolor|hinchaz\u00f3n|spm|molestias|dolor menstrual",
    "kw.libido": "libido|sexo|intimidad|deseo|excitaci\u00f3n",
    "kw.supplements": "suplemento|vitamina|mineral|magnesio|hierro|zinc",
    "kw.focus": "concentraci\u00f3n|productividad|niebla mental|cognitivo|enfoque",
    "kw.cycle": "ciclo|regla|fase|ovulaci\u00f3n|menstrual|l\u00fatea|folicular",
  },

  it: {
    headerTitle: "Compagno di Benessere",
    headerSubtitle: "Fase {phaseName} \u00b7 Giorno {cycleDay}",
    inputPlaceholder: "Chiedi a IRIS...",
    welcomeMessage: "Ciao! Sono il tuo compagno di benessere IRIS. Utilizzo i tuoi dati su ciclo, scansioni e check-in per darti consigli personalizzati. Chiedimi qualsiasi cosa su energia, nutrizione, stress, sonno o umore.",
    quickTired: "Perch\u00e9 sono stanca?",
    quickEat: "Cosa dovrei mangiare?",
    quickStress: "Com'\u00e8 il mio stress?",
    quickSleep: "Consigli sul sonno",

    phaseMenstrual: "mestruale",
    phaseFollicular: "follicolare",
    phaseOvulation: "ovulatoria",
    phaseLuteal: "luteale",

    energyIntro: "Sei al giorno {cycleDay} del tuo ciclo (fase {phaseName}).",
    energyScoreToday: " Il tuo punteggio energetico oggi \u00e8 {energy}/10",
    energyLower: ", che \u00e8 inferiore alla tua media di {avg}.",
    energyHigher: ", che \u00e8 superiore alla tua media di {avg}.",
    energySame: ", che \u00e8 circa uguale alla tua media di {avg}.",
    energyLuteal: " Molte persone sperimentano un calo di energia nella fase luteale. Considera movimenti dolci come camminare o yoga, e prova ad andare a letto 30 minuti prima stasera.",
    energyMenstrual: " Durante le mestruazioni, il tuo corpo utilizza energia extra. Dai priorit\u00e0 al riposo, cibi ricchi di ferro come verdure a foglia verde, e mantieniti ben idratata.",
    energyFollicular: " La fase follicolare porta solitamente un aumento di energia. Se ti senti ancora stanca, controlla la qualit\u00e0 del sonno e i livelli di idratazione.",
    energyOvulation: " Durante l'ovulazione, l'energia \u00e8 tipicamente al massimo. Se ti senti stanca, potrebbe valere la pena controllare il sonno e i livelli di stress.",
    energyHighFatigue: " Il tuo indicatore di fatica \u00e8 elevato oggi \u2014 considera un breve pisolino o una sessione di stretching leggero.",

    foodIntro: "Durante la fase {phaseName}, ",
    foodLuteal: "il tuo corpo pu\u00f2 beneficiare di carboidrati complessi, cibi ricchi di magnesio (cioccolato fondente, noci) e scelte antinfiammatorie.",
    foodInflammation: " Il tuo punteggio di infiammazione \u00e8 leggermente pi\u00f9 alto oggi \u2014 considera di aggiungere curcuma o zenzero ai tuoi pasti.",
    foodMenstrual: "concentrati su cibi ricchi di ferro (spinaci, lenticchie, carne rossa), zuppe calde e opzioni antinfiammatorie. Il cioccolato fondente e i cibi ricchi di magnesio possono anche aiutare con i crampi.",
    foodFollicular: "il tuo metabolismo si sta attivando. Proteine magre, verdure fresche e cibi fermentati supportano l'aumento di estrogeni. \u00c8 un ottimo momento per sperimentare nuove ricette.",
    foodOvulation: "l'energia \u00e8 alta e il tuo corpo gestisce bene i carboidrati. Concentrati su cibi ricchi di fibre, grassi sani e tanta frutta e verdura ricca di antiossidanti.",
    foodLowHydration: " Il tuo livello di idratazione \u00e8 pi\u00f9 basso dell'ideale \u2014 punta ad almeno 8 bicchieri d'acqua oggi.",

    stressIntro: "Sei nella fase {phaseName} (giorno {cycleDay}).",
    stressScoreToday: " Il tuo punteggio di stress oggi \u00e8 {stress}/10",
    stressAvg: " (la tua media \u00e8 {avg}).",
    stressHigh: " Il tuo livello di stress \u00e8 notevolmente elevato. Prova un esercizio di respirazione quadrata di 5 minuti: inspira per 4 tempi, trattieni 4, espira 4, trattieni 4. Ripeti 5 volte.",
    stressModerate: " Il tuo stress \u00e8 moderato. Una breve passeggiata all'aperto, respirazione profonda o qualche minuto di journaling potrebbero aiutare a ridurlo.",
    stressLow: " Il tuo livello di stress sembra ben gestito oggi. Continua con la routine che funziona per te.",
    stressNoScan: " Completa una scansione oggi per ottenere informazioni personalizzate sullo stress. Nel frattempo, prova 5 minuti di respirazione profonda o una breve passeggiata.",
    stressLutealNote: " La fase luteale pu\u00f2 amplificare la sensibilit\u00e0 allo stress \u2014 sii particolarmente gentile con te stessa questa settimana.",

    sleepLogged: "Dal tuo check-in, hai registrato {hours} ore di sonno. ",
    sleepLow: "Questo \u00e8 al di sotto delle 7-9 ore raccomandate. ",
    sleepSlightlyLow: "Questo \u00e8 leggermente sotto il range ottimale. ",
    sleepGood: "Questo \u00e8 in un range sano. ",
    sleepLuteal: "Durante la fase luteale, il progesterone sale il che pu\u00f2 farti sentire pi\u00f9 sonnolenta ma paradossalmente disturbare il sonno profondo. Prova il magnesio prima di dormire (200-400mg), evita gli schermi 1 ora prima di andare a letto e mantieni la stanza fresca (circa 18-20\u00b0C).",
    sleepMenstrual: "Le mestruazioni possono influire sulla qualit\u00e0 del sonno. Un bagno caldo prima di dormire, tisana alla camomilla e stretching dolce possono aiutare. Considera uno scaldino se i crampi disturbano il tuo riposo.",
    sleepFollicular: "L'aumento di estrogeni nella fase follicolare generalmente favorisce un sonno migliore. Usa questo tempo per stabilire buone abitudini del sonno: orario costante, niente caffeina dopo le 14 e una stanza buia e fresca.",
    sleepOvulation: "Intorno all'ovulazione, la temperatura corporea sale leggermente il che pu\u00f2 influire sul sonno. Mantieni la camera da letto extra fresca e considera lenzuola leggere. \u00c8 un buon momento per una routine rilassante prima di dormire.",
    sleepLowRecovery: " Il tuo punteggio di recupero \u00e8 basso \u2014 dare priorit\u00e0 al sonno stasera aiuter\u00e0 il tuo corpo a rigenerarsi.",

    moodIntro: "Sei nella fase {phaseName}. ",
    moodScoreToday: "Il tuo umore oggi \u00e8 {mood}/10. ",
    moodLow: "Questo \u00e8 pi\u00f9 basso dell'ideale. ",
    moodLuteal: "La fase luteale pu\u00f2 portare fluttuazioni dell'umore a causa dei cambiamenti del progesterone. Scrivere un diario, fare esercizio leggero e parlare con qualcuno di fiducia possono aiutare a stabilizzare le tue emozioni.",
    moodMenstrual: "Gli ormoni sono al minimo durante le mestruazioni, il che pu\u00f2 influire sull'umore. Sii gentile con te stessa \u2014 cura di s\u00e9, riposo e comfort food (con moderazione) sono del tutto appropriati ora.",
    moodFollicular: "L'aumento di estrogeni porta tipicamente un miglioramento dell'umore e della motivazione. \u00c8 un ottimo momento per attivit\u00e0 sociali, progetti creativi e provare cose nuove.",
    moodOvulation: "L'ovulazione porta spesso un picco di umore grazie agli alti estrogeni e a un'ondata di LH. Goditi questa energia sociale e sicura finch\u00e9 dura.",

    exerciseIntro: "Per la fase {phaseName} (giorno {cycleDay}), ",
    exerciseMenstrual: "si raccomandano movimenti dolci come camminare, yoga o stretching leggero. Il tuo corpo si sta riprendendo, quindi evita di sforzarti troppo.",
    exerciseFollicular: "il tuo corpo \u00e8 pronto per guadagni di forza. Prova allenamento con i pesi, HIIT o imparare nuove abilit\u00e0 atletiche. Energia e coordinazione stanno migliorando.",
    exerciseOvulation: "questa \u00e8 la tua finestra di massima performance. Punta a record personali, allenamenti ad alta intensit\u00e0 o lezioni di gruppo impegnative. Il tuo corpo pu\u00f2 gestire di pi\u00f9 adesso.",
    exerciseLuteal: "concentrati su esercizio a intensit\u00e0 moderata. Pilates, cardio moderato e yoga sono ottime scelte. Man mano che la fase avanza, passa ad attivit\u00e0 pi\u00f9 leggere.",
    exerciseLowEnergy: " Tuttavia, la tua energia \u00e8 piuttosto bassa oggi \u2014 va benissimo fare qualcosa di leggero o prendersi un giorno di riposo.",

    skinIntro: "Durante la fase {phaseName}, ",
    skinLuteal: "l'aumento di progesterone aumenta la produzione di sebo e pu\u00f2 scatenare eruzioni. Usa prodotti delicati e non comedogenici, acido salicilico per le imperfezioni e niacinamide per il controllo del sebo.",
    skinMenstrual: "la pelle pu\u00f2 essere sensibile e secca. Usa prodotti idratanti e delicati ed evita esfolianti aggressivi. Concentrati su ingredienti lenitivi come aloe e centella.",
    skinFollicular: "gli estrogeni salgono e la pelle appare tipicamente pi\u00f9 chiara. \u00c8 un ottimo momento per l'esfoliazione, sieri alla vitamina C e provare nuovi ingredienti attivi.",
    skinOvulation: "probabilmente sei al massimo della tua luminosit\u00e0. Il picco di estrogeni crea un bagliore naturale. Mantieni la tua routine semplice e goditela.",

    fallbackIntro: "Posso aiutarti con domande sulla tua energia, nutrizione, stress, sonno, umore, esercizio e cura della pelle \u2014 tutto personalizzato per la tua fase {phaseName} (giorno {cycleDay} di {totalDays}).",
    fallbackScan: "\n\nLa tua ultima scansione mostra: energia {energy}/10, stress {stress}/10, recupero {recovery}/10.",
    fallbackSuggestions: "\n\nProva a chiedermi cose come:\n- Perch\u00e9 sono stanca?\n- Cosa dovrei mangiare?\n- Com'\u00e8 il mio stress?\n- Dammi consigli sul sonno\n- Quale allenamento dovrei fare?\n- Come sta la mia pelle questa settimana?",

    "kw.energy": "stanca|energia|affaticata|esausta|spossata",
    "kw.food": "mangiare|cibo|nutrizione|dieta|alimentazione",
    "kw.stress": "stress|ansiosa|ansia|sopraffatta|travolta",
    "kw.sleep": "sonno|insonnia|dormire|riposo|riposare",
    "kw.mood": "umore|triste|felice|emotiva|depressa",
    "kw.exercise": "esercizio|allenamento|sport|movimento|palestra",
    "kw.skin": "pelle|acne|luminosit\u00e0|brufoli|imperfezioni",

    // Hydration responses
    hydrationIntro: "Mantenersi ben idratata \u00e8 importante durante la fase {phaseName}. ",
    hydrationVeryLow: "Il tuo livello di idratazione \u00e8 {hydration}/10 \u2014 \u00e8 piuttosto basso. Prova a bere un bicchiere d\u2019acqua adesso e imposta dei promemoria durante la giornata. ",
    hydrationLow: "Il tuo livello di idratazione \u00e8 {hydration}/10 \u2014 un po\u2019 sotto l\u2019ottimale. Punta ad almeno 8 bicchieri oggi. ",
    hydrationGood: "Il tuo livello di idratazione \u00e8 {hydration}/10 \u2014 stai andando bene! Continua cos\u00ec. ",
    hydrationMenstrual: "Durante le mestruazioni, perdi liquidi extra. Le tisane calde (zenzero, camomilla) contano nell\u2019idratazione e possono anche alleviare i crampi.",
    hydrationOvulation: "Intorno all\u2019ovulazione, la temperatura corporea aumenta leggermente. Aumenta l\u2019assunzione di acqua e aggiungi elettroliti se sei attiva.",
    hydrationLuteal: "Nella fase luteale, il progesterone pu\u00f2 causare ritenzione idrica. Paradossalmente, bere PI\u00d9 acqua aiuta a ridurre il gonfiore.",
    hydrationFollicular: "La fase follicolare \u00e8 un buon momento per creare abitudini di idratazione. Prova ad aromatizzare l\u2019acqua con limone, cetriolo o frutti di bosco per variare.",

    // Cramps/pain responses
    crampsIntro: "Parliamo di come gestire il disagio durante la fase {phaseName} (giorno {cycleDay}). ",
    crampsMenstrual: "I crampi mestruali sono causati dalle prostaglandine. Cose che possono aiutare: una borsa dell\u2019acqua calda sul basso ventre, passeggiate leggere, cibi ricchi di magnesio (cioccolato fondente, banane) e tisane antinfiammatorie come zenzero o camomilla. Posizioni yoga dolci come la posizione del bambino e gatto-mucca possono anche alleviare la tensione.",
    crampsLuteal: "Il disagio premestruale \u00e8 comune nella fase luteale. Integratori di magnesio (200-400mg), cibi ricchi di calcio, esercizio dolce regolare e la riduzione di caffeina e sale possono aiutare a gestire i sintomi della SPM.",
    crampsOvulation: "Alcune persone sperimentano il mittelschmerz \u2014 un dolore breve e acuto durante l\u2019ovulazione. \u00c8 normale. Un impacco caldo e un movimento leggero di solito aiutano. Se il dolore \u00e8 forte o persistente, consulta il tuo medico.",
    crampsFollicular: "La fase follicolare \u00e8 generalmente la fase pi\u00f9 confortevole. Se stai sperimentando un disagio insolito, considera di annotarlo \u2014 i pattern possono aiutare te e il tuo medico a identificare eventuali problemi.",

    // Libido/intimacy responses
    libidoIntro: "La libido fluttua naturalmente con il ciclo. Durante la fase {phaseName}: ",
    libidoOvulation: "la libido tende a raggiungere il picco intorno all\u2019ovulazione grazie ad alti livelli di estrogeni e testosterone. Questa \u00e8 la finestra di fertilit\u00e0 naturale del tuo corpo. Goditi questo aumento di desiderio e sicurezza.",
    libidoFollicular: "gli estrogeni in aumento nella fase follicolare aumentano gradualmente il desiderio e l\u2019eccitazione. Potresti sentirti pi\u00f9 energica socialmente e attratta dagli altri.",
    libidoLuteal: "il progesterone sale e pu\u00f2 ridurre la libido per molte persone. \u00c8 normale. Concentrati sull\u2019intimit\u00e0 emotiva e non metterti sotto pressione. Le coccole e la connessione sono altrettanto valide.",
    libidoMenstrual: "la libido varia durante le mestruazioni \u2014 alcune sentono un desiderio maggiore mentre altre no. Entrambe le situazioni sono completamente normali. Ascolta il tuo corpo e fai ci\u00f2 che ti sembra giusto.",

    // Supplements responses
    supplementsIntro: "Ecco alcune considerazioni sugli integratori per la fase {phaseName} (consulta sempre prima il tuo medico): ",
    supplementsMenstrual: "Ferro (soprattutto in caso di mestruazioni abbondanti), magnesio (200-400mg per crampi e umore), vitamina C (per migliorare l\u2019assorbimento del ferro) e acidi grassi omega-3 (antinfiammatorio). Le vitamine del complesso B possono anche supportare l\u2019energia.",
    supplementsFollicular: "Probiotici per supportare la salute intestinale e il metabolismo degli estrogeni, vitamina D (soprattutto se prendi poco sole), zinco per il supporto immunitario e vitamine B per l\u2019energia. \u00c8 un buon momento per concentrarsi sulla costruzione delle riserve nutritive.",
    supplementsOvulation: "Antiossidanti come vitamine E e C, acidi grassi omega-3 e zinco. La NAC (N-acetilcisteina) pu\u00f2 supportare un\u2019ovulazione sana. Mantieniti ben idratata e prediligi gli alimenti integrali rispetto agli integratori quando possibile.",
    supplementsLuteal: "Glicinato di magnesio (per sonno e umore), vitamina B6 (pu\u00f2 aiutare con la SPM), calcio (1000mg ha dimostrato di ridurre i sintomi della SPM) e olio di enotera. L\u2019agnocasto (vitex) \u00e8 anche usato da alcune per la SPM, ma consulta prima il tuo medico.",

    // Focus/productivity responses
    focusIntro: "I tuoi schemi cognitivi cambiano con il ciclo. Nella fase {phaseName} (giorno {cycleDay}): ",
    focusFollicular: "gli estrogeni in aumento migliorano le abilit\u00e0 verbali, la creativit\u00e0 e l\u2019apprendimento. Questo \u00e8 il momento migliore per brainstorming, avviare nuovi progetti, pianificare e assorbire nuove informazioni. Programma ora riunioni importanti e lavoro creativo.",
    focusOvulation: "le tue capacit\u00e0 comunicative e l\u2019intelligenza sociale raggiungono il picco. Ottimo momento per presentazioni, negoziazioni, collaborazioni e networking. Potresti trovare pi\u00f9 facile fare pi\u00f9 cose contemporaneamente e pensare rapidamente.",
    focusLuteal: "il progesterone orienta il cervello verso un pensiero dettagliato e metodico. Usalo per revisione, correzione bozze, organizzazione, completare progetti e attivit\u00e0 amministrative. Evita di iniziare progetti completamente nuovi se possibile.",
    focusMenstrual: "il tuo cervello \u00e8 in uno stato riflessivo e valutativo. Questo \u00e8 in realt\u00e0 ideale per il pensiero strategico, la revisione degli obiettivi, la scrittura di un diario e le decisioni basate sull\u2019intuizione. Non forzare un lavoro creativo ad alta intensit\u00e0 \u2014 piuttosto, pianifica e rifletti.",
    focusLowEnergy: " La tua energia \u00e8 bassa oggi \u2014 prova a lavorare in blocchi di concentrazione di 25 minuti (tecnica Pomodoro) con pause di 5 minuti.",

    // Cycle knowledge responses
    cycleIntro: "Sei al giorno {cycleDay} di {totalDays} del tuo ciclo, attualmente nella fase {phaseName}. ",
    cycleMenstrual: "La fase mestruale (tipicamente giorni 1-5) \u00e8 quando il rivestimento uterino viene espulso. I livelli ormonali (estrogeni e progesterone) sono al minimo. Il tuo corpo \u00e8 concentrato sul rinnovamento. Pensalo come il tuo inverno interiore \u2014 un tempo di riposo, riflessione e cura dolce di s\u00e9.",
    cycleFollicular: "La fase follicolare (tipicamente giorni 6-13) \u00e8 quando il tuo corpo prepara un nuovo ovulo. Gli estrogeni salgono costantemente, stimolando energia, umore e creativit\u00e0. Pensalo come la tua primavera interiore \u2014 un tempo di crescita e nuovi inizi.",
    cycleOvulation: "La fase ovulatoria (tipicamente giorni 14-16) \u00e8 quando un ovulo maturo viene rilasciato. Gli estrogeni raggiungono il picco e l\u2019ormone luteinizzante aumenta bruscamente. Potresti sentirti al massimo della socialit\u00e0, sicurezza ed energia. Pensalo come la tua estate interiore \u2014 la tua finestra di massime prestazioni.",
    cycleLuteal: "La fase luteale (tipicamente giorni 17-28) \u00e8 quando il progesterone sale per preparare un eventuale impianto. Se la gravidanza non avviene, gli ormoni calano e il ciclo ricomincia. Pensalo come il tuo autunno interiore \u2014 un tempo per rallentare e fare il nido.",

    // Quick reply additions
    quickCramps: "Aiuto con i crampi",
    quickFocus: "Consigli per la concentrazione",

    // New keyword arrays
    "kw.hydration": "idratazione|acqua|sete|disidratata|bere|liquido",
    "kw.cramps": "crampi|dolore|gonfiore|spm|disagio|dolori mestruali",
    "kw.libido": "libido|sesso|intimit\u00e0|desiderio|eccitazione",
    "kw.supplements": "integratore|vitamina|minerale|magnesio|ferro|zinco",
    "kw.focus": "concentrazione|produttivit\u00e0|nebbia mentale|cognitivo|focus",
    "kw.cycle": "ciclo|mestruazioni|fase|ovulazione|mestruale|luteale|follicolare",
  },

  nl: {
    headerTitle: "Wellness Begeleider",
    headerSubtitle: "{phaseName}fase \u00b7 Dag {cycleDay}",
    inputPlaceholder: "Vraag IRIS iets...",
    welcomeMessage: "Hallo! Ik ben je IRIS-welzijnsbegeleider. Ik gebruik je cyclus-, scan- en check-ingegevens om je gepersonaliseerde welzijnsadviezen te geven. Vraag me alles over je energie, voeding, stress, slaap of stemming.",
    quickTired: "Waarom ben ik moe?",
    quickEat: "Wat moet ik eten?",
    quickStress: "Hoe is mijn stress?",
    quickSleep: "Slaaptips",

    phaseMenstrual: "menstruatie",
    phaseFollicular: "folliculaire",
    phaseOvulation: "ovulatie",
    phaseLuteal: "luteale",

    energyIntro: "Je bent op dag {cycleDay} van je cyclus ({phaseName}fase).",
    energyScoreToday: " Je energiescore vandaag is {energy}/10",
    energyLower: ", wat lager is dan je gemiddelde van {avg}.",
    energyHigher: ", wat hoger is dan je gemiddelde van {avg}.",
    energySame: ", wat ongeveer hetzelfde is als je gemiddelde van {avg}.",
    energyLuteal: " Veel mensen ervaren minder energie in de luteale fase. Overweeg zachte beweging zoals wandelen of yoga, en probeer vanavond 30 minuten eerder naar bed te gaan.",
    energyMenstrual: " Tijdens de menstruatie gebruikt je lichaam extra energie. Geef prioriteit aan rust, ijzerrijke voeding zoals bladgroenten, en blijf goed gehydrateerd.",
    energyFollicular: " De folliculaire fase brengt meestal stijgende energie. Als je je nog steeds moe voelt, controleer je slaapkwaliteit en vochtinname.",
    energyOvulation: " Tijdens de ovulatie is de energie doorgaans op zijn hoogtepunt. Als je je moe voelt, kan het de moeite waard zijn om je slaap en stressniveau te controleren.",
    energyHighFatigue: " Je vermoeidheids-indicator is vandaag verhoogd \u2014 overweeg een kort dutje of een lichte stretchsessie.",

    foodIntro: "Tijdens de {phaseName}fase, ",
    foodLuteal: "kan je lichaam baat hebben bij complexe koolhydraten, magnesiumrijke voeding (pure chocolade, noten) en ontstekingsremmende keuzes.",
    foodInflammation: " Je ontstekingsscore is vandaag iets hoger \u2014 overweeg kurkuma of gember aan je maaltijden toe te voegen.",
    foodMenstrual: "focus op ijzerrijke voeding (spinazie, linzen, rood vlees), verwarmende soepen en ontstekingsremmende opties. Pure chocolade en magnesiumrijke voeding kunnen ook helpen bij krampen.",
    foodFollicular: "je metabolisme neemt toe. Magere eiwitten, verse groenten en gefermenteerd voedsel ondersteunen het stijgende oestrogeen. Dit is een geweldig moment om nieuwe recepten uit te proberen.",
    foodOvulation: "de energie is hoog en je lichaam kan goed om met koolhydraten. Focus op vezelrijke voeding, gezonde vetten en veel antioxidantrijk fruit en groenten.",
    foodLowHydration: " Je vochtgehalte is lager dan ideaal \u2014 streef naar minimaal 8 glazen water vandaag.",

    stressIntro: "Je bent in de {phaseName}fase (dag {cycleDay}).",
    stressScoreToday: " Je stressscore vandaag is {stress}/10",
    stressAvg: " (je gemiddelde is {avg}).",
    stressHigh: " Je stressniveau is merkbaar verhoogd. Probeer een 5-minuten box-breathing oefening: adem 4 tellen in, houd 4 vast, adem 4 uit, houd 4 vast. Herhaal 5 keer.",
    stressModerate: " Je stress is matig. Een korte wandeling buiten, wat diep ademhalen of een paar minuten journalen kunnen helpen om het te verlagen.",
    stressLow: " Je stressniveau ziet er vandaag goed beheerst uit. Ga zo door met de routine die voor je werkt.",
    stressNoScan: " Maak vandaag een scan voor gepersonaliseerde stressinzichten. In de tussentijd, probeer 5 minuten diep ademhalen of een korte wandeling.",
    stressLutealNote: " De luteale fase kan stressgevoeligheid versterken \u2014 wees deze week extra lief voor jezelf.",

    sleepLogged: "Op basis van je check-in heb je {hours} uur slaap geregistreerd. ",
    sleepLow: "Dat is onder de aanbevolen 7-9 uur. ",
    sleepSlightlyLow: "Dat is iets onder het optimale bereik. ",
    sleepGood: "Dat valt binnen een gezond bereik. ",
    sleepLuteal: "Tijdens de luteale fase stijgt het progesteron, wat je slaperig kan maken maar paradoxaal genoeg de diepe slaap kan verstoren. Probeer magnesium voor het slapengaan (200-400mg), vermijd schermen 1 uur voor het slapen en houd je kamer koel (rond 18-20\u00b0C).",
    sleepMenstrual: "Menstruatie kan de slaapkwaliteit be\u00efnvloeden. Een warm bad voor het slapen, kamillethee en zachte stretching kunnen helpen. Overweeg een warmtekussen als krampen je rust verstoren.",
    sleepFollicular: "Stijgend oestrogeen in de folliculaire fase ondersteunt over het algemeen betere slaap. Gebruik deze tijd om goede slaapgewoonten te vestigen: consistent bedtijd, geen cafe\u00efne na 14 uur en een donkere, koele kamer.",
    sleepOvulation: "Rond de ovulatie stijgt de lichaamstemperatuur licht, wat de slaap kan be\u00efnvloeden. Houd je slaapkamer extra koel en overweeg licht beddengoed. Dit is een goed moment om tot rust te komen met een kalmerende routine.",
    sleepLowRecovery: " Je herstelscore is laag \u2014 prioriteit geven aan slaap vanavond zal je lichaam helpen herstellen.",

    moodIntro: "Je bent in de {phaseName}fase. ",
    moodScoreToday: "Je stemming vandaag is {mood}/10. ",
    moodLow: "Dat is lager dan ideaal. ",
    moodLuteal: "De luteale fase kan stemmingswisselingen veroorzaken door veranderende progesteronniveaus. Journalen, lichte beweging en contact met iemand die je vertrouwt kunnen helpen je emoties te stabiliseren.",
    moodMenstrual: "Hormonen zijn op hun laagst tijdens de menstruatie, wat de stemming kan be\u00efnvloeden. Wees lief voor jezelf \u2014 zelfzorg, rust en comfort food (met mate) zijn nu helemaal gepast.",
    moodFollicular: "Stijgend oestrogeen brengt doorgaans verbeterde stemming en motivatie. Dit is een geweldig moment voor sociale activiteiten, creatieve projecten en nieuwe dingen proberen.",
    moodOvulation: "Ovulatie brengt vaak een stemmingspiek dankzij hoog oestrogeen en een LH-piek. Geniet van deze sociale, zelfverzekerde energie zolang het duurt.",

    exerciseIntro: "Voor de {phaseName}fase (dag {cycleDay}), ",
    exerciseMenstrual: "wordt zachte beweging zoals wandelen, yoga of lichte stretching aanbevolen. Je lichaam herstelt, dus vermijd te hard te pushen.",
    exerciseFollicular: "is je lichaam klaar voor krachtwinst. Probeer krachttraining, HIIT of het leren van nieuwe sportieve vaardigheden. Energie en co\u00f6rdinatie verbeteren.",
    exerciseOvulation: "dit is je piekmomenten-venster. Ga voor persoonlijke records, high-intensity workouts of uitdagende groepslessen. Je lichaam kan nu meer aan.",
    exerciseLuteal: "focus op matig intensieve oefening. Pilates, matige cardio en yoga zijn uitstekende keuzes. Naarmate de fase vordert, schakel over naar lichtere activiteiten.",
    exerciseLowEnergy: " Maar je energie is vandaag vrij laag \u2014 het is prima om iets zachts te doen of een rustdag te nemen.",

    skinIntro: "Tijdens de {phaseName}fase, ",
    skinLuteal: "verhoogt stijgend progesteron de talgproductie en kan het uitbraken veroorzaken. Gebruik zachte, niet-comedogene producten, salicylzuur voor onzuiverheden en niacinamide voor talgcontrole.",
    skinMenstrual: "kan de huid gevoelig en droog zijn. Gebruik hydraterende, zachte producten en vermijd agressieve exfolianten. Focus op kalmerende ingredi\u00ebnten zoals alo\u00eb en centella.",
    skinFollicular: "stijgt het oestrogeen en ziet de huid er doorgaans helderder uit. Dit is een geweldig moment voor exfoliatie, vitamine C-serums en het proberen van nieuwe actieve ingredi\u00ebnten.",
    skinOvulation: "straal je waarschijnlijk het meest. De oestrogeenpiek cre\u00ebert een natuurlijke gloed. Houd je routine simpel en geniet ervan.",

    fallbackIntro: "Ik kan helpen met vragen over je energie, voeding, stress, slaap, stemming, beweging en huidverzorging \u2014 allemaal gepersonaliseerd voor je {phaseName}fase (dag {cycleDay} van {totalDays}).",
    fallbackScan: "\n\nJe laatste scan toont: energie {energy}/10, stress {stress}/10, herstel {recovery}/10.",
    fallbackSuggestions: "\n\nProbeer me dingen te vragen zoals:\n- Waarom ben ik moe?\n- Wat moet ik eten?\n- Hoe is mijn stress?\n- Geef me slaaptips\n- Welke training moet ik doen?\n- Hoe is mijn huid deze week?",

    "kw.energy": "moe|energie|vermoeid|uitgeput|slap",
    "kw.food": "eten|voeding|voedsel|dieet",
    "kw.stress": "stress|angstig|angst|overweldigd|gespannen",
    "kw.sleep": "slaap|slapeloosheid|slapen|rust|rusten",
    "kw.mood": "humeur|stemming|verdrietig|blij|emotioneel|neerslachtig",
    "kw.exercise": "oefening|training|sport|bewegen|sportschool",
    "kw.skin": "huid|acne|gloed|puistjes|onzuiverheden",

    // Hydration responses
    hydrationIntro: "Goed gehydrateerd blijven is belangrijk tijdens de {phaseName}-fase. ",
    hydrationVeryLow: "Je hydratieniveau is {hydration}/10 \u2014 dat is behoorlijk laag. Probeer nu meteen een glas water te drinken en stel herinneringen in voor de rest van de dag. ",
    hydrationLow: "Je hydratieniveau is {hydration}/10 \u2014 iets onder optimaal. Streef vandaag naar minstens 8 glazen. ",
    hydrationGood: "Je hydratieniveau is {hydration}/10 \u2014 je doet het goed! Ga zo door. ",
    hydrationMenstrual: "Tijdens de menstruatie verlies je extra vocht. Warme kruidenthee\u00ebn (gember, kamille) tellen mee voor je vochtinname en kunnen ook krampen verlichten.",
    hydrationOvulation: "Rond de ovulatie stijgt je lichaamstemperatuur licht. Verhoog je waterinname en voeg elektrolyten toe als je actief bent.",
    hydrationLuteal: "In de luteale fase kan progesteron vochtvasthoudend werken. Paradoxaal genoeg helpt het om MEER water te drinken tegen een opgeblazen gevoel.",
    hydrationFollicular: "De folliculaire fase is een goed moment om hydratiegewoontes op te bouwen. Probeer water te verrijken met citroen, komkommer of bessen voor afwisseling.",

    // Cramps/pain responses
    crampsIntro: "Laten we het hebben over het omgaan met ongemak tijdens de {phaseName}-fase (dag {cycleDay}). ",
    crampsMenstrual: "Menstruatiekrampen worden veroorzaakt door prostaglandinen. Wat kan helpen: een warmtekruik op je onderbuik, rustig wandelen, magnesiumrijk voedsel (pure chocolade, bananen) en ontstekingsremmende thee\u00ebn zoals gember of kamille. Zachte yogahoudingen zoals de kindhouding en kat-koe kunnen ook spanning verlichten.",
    crampsLuteal: "Premenstrueel ongemak is gebruikelijk in de luteale fase. Magnesiumsupplementen (200-400mg), calciumrijk voedsel, regelmatige lichte beweging en het verminderen van cafe\u00efne en zout kunnen allemaal helpen om PMS-symptomen te beheersen.",
    crampsOvulation: "Sommige mensen ervaren mittelschmerz \u2014 een korte, scherpe pijn tijdens de ovulatie. Dit is normaal. Een warm kompres en lichte beweging helpen meestal. Als de pijn hevig of aanhoudend is, raadpleeg dan je arts.",
    crampsFollicular: "De folliculaire fase is doorgaans de meest comfortabele fase. Als je ongewoon ongemak ervaart, overweeg het bij te houden \u2014 patronen kunnen jou en je arts helpen om eventuele zorgen te identificeren.",

    // Libido/intimacy responses
    libidoIntro: "Libido fluctueert van nature met je cyclus. Tijdens de {phaseName}-fase: ",
    libidoOvulation: "de libido bereikt meestal een piek rond de ovulatie door hoge oestrogeen- en testosteronspiegels. Dit is het natuurlijke vruchtbaarheidsvenster van je lichaam. Geniet van dit verhoogde verlangen en zelfvertrouwen.",
    libidoFollicular: "stijgend oestrogeen in de folliculaire fase verhoogt geleidelijk verlangen en opwinding. Je kunt je sociaal energieker en aangetrokken tot anderen voelen.",
    libidoLuteal: "progesteron stijgt en kan de libido bij veel mensen verlagen. Dit is normaal. Richt je op emotionele intimiteit en leg jezelf geen druk op. Knuffelen en verbinding zijn net zo waardevol.",
    libidoMenstrual: "de libido varieert tijdens de menstruatie \u2014 sommigen voelen meer verlangen, anderen niet. Beide zijn volkomen normaal. Luister naar je lichaam en doe wat goed voelt.",

    // Supplements responses
    supplementsIntro: "Hier zijn supplementoverwegingen voor de {phaseName}-fase (overleg altijd eerst met je arts): ",
    supplementsMenstrual: "IJzer (vooral bij zware menstruatie), magnesium (200-400mg voor krampen en stemming), vitamine C (om de ijzeropname te verbeteren) en omega-3-vetzuren (ontstekingsremmend). B-complex vitamines kunnen ook de energie ondersteunen.",
    supplementsFollicular: "Probiotica voor de ondersteuning van de darmgezondheid en het oestrogeenmetabolisme, vitamine D (vooral als je weinig zon krijgt), zink voor immuunondersteuning en B-vitamines voor energie. Dit is een goed moment om je te richten op het opbouwen van voedingsstofvoorraden.",
    supplementsOvulation: "Antioxidanten zoals vitamine E en C, omega-3-vetzuren en zink. NAC (N-acetylcyste\u00efne) kan een gezonde ovulatie ondersteunen. Blijf goed gehydrateerd en geef de voorkeur aan volwaardige voeding boven supplementen wanneer mogelijk.",
    supplementsLuteal: "Magnesiumglycinaat (voor slaap en stemming), vitamine B6 (kan helpen bij PMS), calcium (1000mg is aangetoond PMS-symptomen te verminderen) en teunisbloemolie. Monnikspeper (vitex) wordt door sommigen ook gebruikt bij PMS, maar overleg eerst met je arts.",

    // Focus/productivity responses
    focusIntro: "Je cognitieve patronen verschuiven met je cyclus. In de {phaseName}-fase (dag {cycleDay}): ",
    focusFollicular: "stijgend oestrogeen verbetert verbale vaardigheden, creativiteit en leren. Dit is je beste moment voor brainstormen, nieuwe projecten starten, plannen en nieuwe informatie opnemen. Plan nu belangrijke vergaderingen en creatief werk.",
    focusOvulation: "je communicatievaardigheden en sociale intelligentie bereiken hun piek. Goed moment voor presentaties, onderhandelingen, samenwerkingen en netwerken. Je vindt het misschien makkelijker om te multitasken en snel te denken.",
    focusLuteal: "progesteron stuurt je brein richting gedetailleerd, methodisch denken. Gebruik dit voor redigeren, proeflezen, organiseren, projecten afronden en administratieve taken. Vermijd het starten van geheel nieuwe projecten als dat mogelijk is.",
    focusMenstrual: "je brein is in een reflectieve, evaluerende staat. Dit is eigenlijk ideaal voor strategisch denken, doelen herzien, journaling en beslissingen nemen op basis van intu\u00eftie. Dwing geen creatief werk op hoog niveau af \u2014 plan en reflecteer in plaats daarvan.",
    focusLowEnergy: " Je energie is vandaag laag \u2014 probeer te werken in korte focusblokken van 25 minuten (Pomodoro-techniek) met pauzes van 5 minuten.",

    // Cycle knowledge responses
    cycleIntro: "Je bent op dag {cycleDay} van {totalDays} in je cyclus, momenteel in de {phaseName}-fase. ",
    cycleMenstrual: "De menstruatiefase (doorgaans dagen 1-5) is wanneer het baarmoederslijmvlies wordt afgestoten. Hormoonspiegels (oestrogeen en progesteron) zijn op hun laagst. Je lichaam richt zich op vernieuwing. Zie dit als je innerlijke winter \u2014 een tijd voor rust, reflectie en zachte zelfzorg.",
    cycleFollicular: "De folliculaire fase (doorgaans dagen 6-13) is wanneer je lichaam een nieuw eitje voorbereidt. Oestrogeen stijgt gestaag en stimuleert energie, stemming en creativiteit. Zie dit als je innerlijke lente \u2014 een tijd van groei en nieuwe beginnen.",
    cycleOvulation: "De ovulatiefase (doorgaans dagen 14-16) is wanneer een rijp eitje wordt vrijgelaten. Oestrogeen bereikt zijn piek en het lute\u00efniserend hormoon stijgt sterk. Je voelt je misschien het meest sociaal, zelfverzekerd en energiek. Zie dit als je innerlijke zomer \u2014 je piekprestatie-venster.",
    cycleLuteal: "De luteale fase (doorgaans dagen 17-28) is wanneer progesteron stijgt ter voorbereiding op een mogelijke innesteling. Als er geen zwangerschap optreedt, dalen de hormonen en begint de cyclus opnieuw. Zie dit als je innerlijke herfst \u2014 een tijd om af te winden en te nestelen.",

    // Quick reply additions
    quickCramps: "Hulp bij krampen",
    quickFocus: "Focustips",

    // New keyword arrays
    "kw.hydration": "hydratatie|water|dorst|uitgedroogd|drinken|vocht",
    "kw.cramps": "krampen|pijn|opgeblazen|pms|ongemak|menstruatiepijn",
    "kw.libido": "libido|seks|intimiteit|verlangen|opwinding",
    "kw.supplements": "supplement|vitamine|mineraal|magnesium|ijzer|zink",
    "kw.focus": "focus|concentratie|productiviteit|hersenmist|mentaal|cognitief",
    "kw.cycle": "cyclus|menstruatie|fase|ovulatie|menstrueel|luteaal|folliculair",
  },

  pl: {
    headerTitle: "Towarzysz Zdrowia",
    headerSubtitle: "Faza {phaseName} \u00b7 Dzie\u0144 {cycleDay}",
    inputPlaceholder: "Zapytaj IRIS o cokolwiek...",
    welcomeMessage: "Cze\u015b\u0107! Jestem Twoim towarzyszem zdrowia IRIS. Wykorzystuj\u0119 dane o Twoim cyklu, skanach i codziennych wpisach, aby dawa\u0107 Ci spersonalizowane porady dotycz\u0105ce zdrowia. Zapytaj mnie o energi\u0119, od\u017cywianie, stres, sen lub nastr\u00f3j.",
    quickTired: "Dlaczego jestem zm\u0119czona?",
    quickEat: "Co powinnam je\u015b\u0107?",
    quickStress: "Jak wygl\u0105da m\u00f3j stres?",
    quickSleep: "Porady dotycz\u0105ce snu",

    phaseMenstrual: "menstruacyjna",
    phaseFollicular: "folikularna",
    phaseOvulation: "owulacyjna",
    phaseLuteal: "lutealna",

    energyIntro: "Jeste\u015b w dniu {cycleDay} swojego cyklu (faza {phaseName}).",
    energyScoreToday: " Tw\u00f3j wynik energii dzi\u015b to {energy}/10",
    energyLower: ", co jest ni\u017csze ni\u017c Twoja \u015brednia {avg}.",
    energyHigher: ", co jest wy\u017csze ni\u017c Twoja \u015brednia {avg}.",
    energySame: ", co jest mniej wi\u0119cej r\u00f3wne Twojej \u015bredniej {avg}.",
    energyLuteal: " Wiele os\u00f3b do\u015bwiadcza ni\u017cszej energii w fazie lutealnej. Rozwa\u017c delikatny ruch, jak spacer lub joga, i spr\u00f3buj po\u0142o\u017cy\u0107 si\u0119 30 minut wcze\u015bniej dzi\u015b wieczorem.",
    energyMenstrual: " Podczas menstruacji Tw\u00f3j organizm zu\u017cywa dodatkow\u0105 energi\u0119. Daj priorytet odpoczynkowi, \u017cywno\u015bci bogatej w \u017celazo, takiej jak zielone warzywa li\u015bciaste, i pij du\u017co wody.",
    energyFollicular: " Faza folikularna zwykle przynosi rosn\u0105c\u0105 energi\u0119. Je\u015bli nadal czujesz si\u0119 zm\u0119czona, sprawd\u017a jako\u015b\u0107 snu i poziom nawodnienia.",
    energyOvulation: " Podczas owulacji energia jest zazwyczaj na szczycie. Je\u015bli czujesz si\u0119 zm\u0119czona, warto sprawdzi\u0107 sw\u00f3j sen i poziom stresu.",
    energyHighFatigue: " Tw\u00f3j wska\u017anik zm\u0119czenia jest dzi\u015b podwy\u017cszony \u2014 rozwa\u017c kr\u00f3tk\u0105 drzemk\u0119 lub lekk\u0105 sesj\u0119 rozci\u0105gania.",

    foodIntro: "Podczas fazy {phaseName}, ",
    foodLuteal: "Tw\u00f3j organizm mo\u017ce skorzysta\u0107 ze z\u0142o\u017conych w\u0119glowodan\u00f3w, \u017cywno\u015bci bogatej w magnez (gorzka czekolada, orzechy) i wybor\u00f3w przeciwzapalnych.",
    foodInflammation: " Tw\u00f3j wynik zapalenia jest dzi\u015b nieco wy\u017cszy \u2014 rozwa\u017c dodanie kurkumy lub imbiru do posi\u0142k\u00f3w.",
    foodMenstrual: "skup si\u0119 na \u017cywno\u015bci bogatej w \u017celazo (szpinak, soczewica, czerwone mi\u0119so), rozgrzewaj\u0105cych zupach i opcjach przeciwzapalnych. Gorzka czekolada i \u017cywno\u015b\u0107 bogata w magnez mog\u0105 r\u00f3wnie\u017c pom\u00f3c przy skurczach.",
    foodFollicular: "Tw\u00f3j metabolizm przyspiesza. Chude bia\u0142ka, \u015bwie\u017ce warzywa i fermentowana \u017cywno\u015b\u0107 wspieraj\u0105 rosn\u0105cy estrogen. To \u015bwietny czas na eksperymentowanie z nowymi przepisami.",
    foodOvulation: "energia jest wysoka, a Tw\u00f3j organizm dobrze radzi sobie z w\u0119glowodanami. Skup si\u0119 na \u017cywno\u015bci bogatej w b\u0142onnik, zdrowych t\u0142uszczach i du\u017cej ilo\u015bci owoc\u00f3w i warzyw bogatych w antyoksydanty.",
    foodLowHydration: " Tw\u00f3j poziom nawodnienia jest ni\u017cszy ni\u017c idealny \u2014 staraj si\u0119 wypi\u0107 co najmniej 8 szklanek wody dzi\u015b.",

    stressIntro: "Jeste\u015b w fazie {phaseName} (dzie\u0144 {cycleDay}).",
    stressScoreToday: " Tw\u00f3j wynik stresu dzi\u015b to {stress}/10",
    stressAvg: " (Twoja \u015brednia to {avg}).",
    stressHigh: " Tw\u00f3j poziom stresu jest wyra\u017anie podwy\u017cszony. Spr\u00f3buj 5-minutowego \u0107wiczenia oddechowego: wdech na 4, przytrzymaj 4, wydech 4, przytrzymaj 4. Powt\u00f3rz 5 razy.",
    stressModerate: " Tw\u00f3j stres jest umiarkowany. Kr\u00f3tki spacer na \u015bwie\u017cym powietrzu, g\u0142\u0119bokie oddychanie lub kilka minut pisania dziennika mog\u0105 pom\u00f3c go zmniejszy\u0107.",
    stressLow: " Tw\u00f3j poziom stresu wygl\u0105da dzi\u015b na dobrze kontrolowany. Kontynuuj rutyn\u0119, kt\u00f3ra dzia\u0142a.",
    stressNoScan: " Wykonaj skan dzi\u015b, aby uzyska\u0107 spersonalizowane informacje o stresie. W mi\u0119dzyczasie spr\u00f3buj 5 minut g\u0142\u0119bokiego oddychania lub kr\u00f3tkiego spaceru.",
    stressLutealNote: " Faza lutealna mo\u017ce wzmocni\u0107 wra\u017cliwo\u015b\u0107 na stres \u2014 b\u0105d\u017a wyj\u0105tkowo mi\u0142a dla siebie w tym tygodniu.",

    sleepLogged: "Na podstawie Twojego wpisu, spa\u0142a\u015b {hours} godzin. ",
    sleepLow: "To poni\u017cej zalecanych 7-9 godzin. ",
    sleepSlightlyLow: "To nieco poni\u017cej optymalnego zakresu. ",
    sleepGood: "To mie\u015bci si\u0119 w zdrowym zakresie. ",
    sleepLuteal: "Podczas fazy lutealnej progesteron ro\u015bnie, co mo\u017ce sprawi\u0107, \u017ce poczujesz si\u0119 bardziej senna, ale paradoksalnie zaburzy\u0107 g\u0142\u0119boki sen. Spr\u00f3buj magnezu przed snem (200-400mg), unikaj ekran\u00f3w godzin\u0119 przed snem i utrzymuj ch\u0142odn\u0105 temperatur\u0119 w pokoju (oko\u0142o 18-20\u00b0C).",
    sleepMenstrual: "Menstruacja mo\u017ce wp\u0142ywa\u0107 na jako\u015b\u0107 snu. Ciep\u0142a k\u0105piel przed snem, herbata rumiankowa i delikatne rozci\u0105ganie mog\u0105 pom\u00f3c. Rozwa\u017c termofor, je\u015bli skurcze zak\u0142\u00f3caj\u0105 Tw\u00f3j odpoczynek.",
    sleepFollicular: "Rosn\u0105cy estrogen w fazie folikularnej generalnie wspiera lepszy sen. Wykorzystaj ten czas na ustalenie dobrych nawyk\u00f3w snu: sta\u0142a pora snu, brak kofeiny po 14, ciemny i ch\u0142odny pok\u00f3j.",
    sleepOvulation: "W okolicach owulacji temperatura cia\u0142a lekko ro\u015bnie, co mo\u017ce wp\u0142ywa\u0107 na sen. Utrzymuj sypialni\u0119 wyj\u0105tkowo ch\u0142odn\u0105 i rozwa\u017c lekk\u0105 po\u015bciel. To dobry czas na wyciszaj\u0105c\u0105 rutyn\u0119 przed snem.",
    sleepLowRecovery: " Tw\u00f3j wynik regeneracji jest niski \u2014 priorytetowe traktowanie snu dzi\u015b w nocy pomo\u017ce Twojemu cia\u0142u si\u0119 zregenerowa\u0107.",

    moodIntro: "Jeste\u015b w fazie {phaseName}. ",
    moodScoreToday: "Tw\u00f3j nastr\u00f3j dzi\u015b to {mood}/10. ",
    moodLow: "To ni\u017csze ni\u017c idealnie. ",
    moodLuteal: "Faza lutealna mo\u017ce przynosi\u0107 wahania nastroju z powodu zmieniaj\u0105cego si\u0119 progesteronu. Pisanie dziennika, lekkie \u0107wiczenia i rozmowa z kim\u015b, komu ufasz, mog\u0105 pom\u00f3c ustabilizowa\u0107 emocje.",
    moodMenstrual: "Hormony s\u0105 na najni\u017cszym poziomie podczas menstruacji, co mo\u017ce wp\u0142ywa\u0107 na nastr\u00f3j. B\u0105d\u017a dla siebie \u0142agodna \u2014 dbanie o siebie, odpoczynek i jedzenie na pocieszenie (z umiarem) s\u0105 teraz jak najbardziej na miejscu.",
    moodFollicular: "Rosn\u0105cy estrogen zwykle przynosi lepszy nastr\u00f3j i motywacj\u0119. To \u015bwietny czas na aktywno\u015bci towarzyskie, kreatywne projekty i pr\u00f3bowanie nowych rzeczy.",
    moodOvulation: "Owulacja cz\u0119sto przynosi szczyt nastroju dzi\u0119ki wysokiemu estrogenowi i wzrostowi LH. Ciesz si\u0119 t\u0105 towarzysk\u0105, pewn\u0105 siebie energi\u0105, dop\u00f3ki trwa.",

    exerciseIntro: "Na faz\u0119 {phaseName} (dzie\u0144 {cycleDay}), ",
    exerciseMenstrual: "zalecany jest delikatny ruch, taki jak spacer, joga lub lekkie rozci\u0105ganie. Tw\u00f3j organizm si\u0119 regeneruje, wi\u0119c unikaj zbyt intensywnego wysi\u0142ku.",
    exerciseFollicular: "Tw\u00f3j organizm jest gotowy na przyrosty si\u0142y. Spr\u00f3buj treningu si\u0142owego, HIIT lub nauki nowych umiej\u0119tno\u015bci sportowych. Energia i koordynacja si\u0119 poprawiaj\u0105.",
    exerciseOvulation: "to Twoje okno szczytowej wydajno\u015bci. D\u0105\u017c do rekord\u00f3w osobistych, trening\u00f3w o wysokiej intensywno\u015bci lub wymagaj\u0105cych zaj\u0119\u0107 grupowych. Tw\u00f3j organizm mo\u017ce teraz wi\u0119cej.",
    exerciseLuteal: "skup si\u0119 na \u0107wiczeniach o umiarkowanej intensywno\u015bci. Pilates, umiarkowane cardio i joga to \u015bwietne wybory. W miar\u0119 post\u0119pu fazy przechodz na l\u017cejsze aktywno\u015bci.",
    exerciseLowEnergy: " Jednak Twoja energia jest dzi\u015b do\u015b\u0107 niska \u2014 mo\u017cesz zrobi\u0107 co\u015b delikatnego lub wzi\u0105\u0107 dzie\u0144 wolny.",

    skinIntro: "Podczas fazy {phaseName}, ",
    skinLuteal: "rosn\u0105cy progesteron zwi\u0119ksza produkcj\u0119 sebum i mo\u017ce wywo\u0142a\u0107 wypryski. U\u017cywaj delikatnych, niekomedogennych produkt\u00f3w, kwasu salicylowego na niedoskona\u0142o\u015bci i niacynamidu do kontroli sebum.",
    skinMenstrual: "sk\u00f3ra mo\u017ce by\u0107 wra\u017cliwa i sucha. U\u017cywaj nawil\u017caj\u0105cych, delikatnych produkt\u00f3w i unikaj agresywnych peeling\u00f3w. Skup si\u0119 na kojdcych sk\u0142adnikach, takich jak aloes i centella.",
    skinFollicular: "estrogen ro\u015bnie i sk\u00f3ra zwykle wygl\u0105da czy\u015bciej. To \u015bwietny czas na peeling, serum z witamin\u0105 C i pr\u00f3bowanie nowych aktywnych sk\u0142adnik\u00f3w.",
    skinOvulation: "prawdopodobnie wygl\u0105dasz najbardziej promienny. Szczyt estrogenu tworzy naturaln\u0105 po\u015bwiat\u0119. Utrzymuj swoj\u0105 rutyn\u0119 prost\u0105 i ciesz si\u0119 ni\u0105.",

    fallbackIntro: "Mog\u0119 pom\u00f3c z pytaniami o Twoj\u0105 energi\u0119, od\u017cywianie, stres, sen, nastr\u00f3j, \u0107wiczenia i piel\u0119gnacj\u0119 sk\u00f3ry \u2014 wszystko spersonalizowane dla Twojej fazy {phaseName} (dzie\u0144 {cycleDay} z {totalDays}).",
    fallbackScan: "\n\nTw\u00f3j ostatni skan pokazuje: energia {energy}/10, stres {stress}/10, regeneracja {recovery}/10.",
    fallbackSuggestions: "\n\nSpr\u00f3buj zapyta\u0107 mnie o:\n- Dlaczego jestem zm\u0119czona?\n- Co powinnam je\u015b\u0107?\n- Jak wygl\u0105da m\u00f3j stres?\n- Daj mi porady dotycz\u0105ce snu\n- Jaki trening powinnam zrobi\u0107?\n- Jak wygl\u0105da moja sk\u00f3ra w tym tygodniu?",

    "kw.energy": "zm\u0119czona|energia|zm\u0119czenie|wyczerpana|os\u0142abiona",
    "kw.food": "je\u015b\u0107|jedzenie|od\u017cywianie|dieta|posi\u0142ek",
    "kw.stress": "stres|nerwowa|l\u0119k|przyt\u0142oczona|zestresowana",
    "kw.sleep": "sen|bezsenno\u015b\u0107|spa\u0107|odpoczynek|odpocz\u0105\u0107",
    "kw.mood": "nastr\u00f3j|humor|smutna|szcz\u0119\u015bliwa|emocjonalna|przygnebiona",
    "kw.exercise": "\u0107wiczenia|trening|sport|ruch|si\u0142ownia",
    "kw.skin": "sk\u00f3ra|tradzik|blask|pryszcze|niedoskona\u0142o\u015bci",

    // Hydration responses
    hydrationIntro: "Utrzymanie dobrego nawodnienia jest wa\u017cne podczas fazy {phaseName}. ",
    hydrationVeryLow: "Tw\u00f3j poziom nawodnienia to {hydration}/10 \u2014 to do\u015b\u0107 nisko. Spr\u00f3buj teraz wypi\u0107 szklank\u0119 wody i ustaw przypomnienia na ca\u0142y dzie\u0144. ",
    hydrationLow: "Tw\u00f3j poziom nawodnienia to {hydration}/10 \u2014 nieco poni\u017cej optymalnego. Staraj si\u0119 wypi\u0107 co najmniej 8 szklanek dzisiaj. ",
    hydrationGood: "Tw\u00f3j poziom nawodnienia to {hydration}/10 \u2014 \u015bwietnie Ci idzie! Tak trzymaj. ",
    hydrationMenstrual: "Podczas miesi\u0105czki tracisz dodatkowe p\u0142yny. Ciep\u0142e herbaty zio\u0142owe (imbir, rumianek) licz\u0105 si\u0119 do nawodnienia i mog\u0105 te\u017c \u0142agodzi\u0107 skurcze.",
    hydrationOvulation: "W okolicach owulacji temperatura cia\u0142a nieznacznie wzrasta. Zwi\u0119ksz spo\u017cycie wody i dodaj elektrolity, je\u015bli jeste\u015b aktywna.",
    hydrationLuteal: "W fazie lutealnej progesteron mo\u017ce powodowa\u0107 zatrzymywanie wody. Paradoksalnie, picie WI\u0118CEJ wody pomaga zmniejszy\u0107 wzd\u0119cia.",
    hydrationFollicular: "Faza folikularna to dobry czas na budowanie nawyk\u00f3w nawadniania. Spr\u00f3buj aromatyzowa\u0107 wod\u0119 cytryq, og\u00f3rkiem lub owocami le\u015bnymi dla urozmaicenia.",

    // Cramps/pain responses
    crampsIntro: "Porozmawiajmy o radzeniu sobie z dyskomfortem podczas fazy {phaseName} (dzie\u0144 {cycleDay}). ",
    crampsMenstrual: "Skurcze menstruacyjne s\u0105 powodowane przez prostaglandyny. Co mo\u017ce pom\u00f3c: poduszka grzewcza na podbrzusze, spokojne spacery, \u017cywno\u015b\u0107 bogata w magnez (gorzka czekolada, banany) i herbaty przeciwzapalne jak imbir lub rumianek. \u0141agodne pozycje jogi jak pozycja dziecka i kot-krowa mog\u0105 r\u00f3wnie\u017c zniwe\u0142owa\u0107 napi\u0119cie.",
    crampsLuteal: "Dyskomfort przedmiesi\u0105czkowy jest cz\u0119sty w fazie lutealnej. Suplementy magnezu (200-400mg), \u017cywno\u015b\u0107 bogata w wap\u0144, regularne \u0142agodne \u0107wiczenia i ograniczenie kofeiny oraz soli mog\u0105 pom\u00f3c w radzeniu sobie z objawami PMS.",
    crampsOvulation: "Niekt\u00f3re osoby do\u015bwiadczaj\u0105 mittelschmerzu \u2014 kr\u00f3tkiego, ostrego b\u00f3lu podczas owulacji. To normalne. Ciep\u0142y ok\u0142ad i lekki ruch zazwyczaj pomagaj\u0105. Je\u015bli b\u00f3l jest silny lub utrzymuje si\u0119, skonsultuj si\u0119 z lekarzem.",
    crampsFollicular: "Faza folikularna jest zazwyczaj najbardziej komfortow\u0105 faz\u0105. Je\u015bli odczuwasz nietypowy dyskomfort, rozwa\u017c jego \u015bledzenie \u2014 wzorce mog\u0105 pom\u00f3c Tobie i Twojemu lekarzowi zidentyfikowa\u0107 ewentualne problemy.",

    // Libido/intimacy responses
    libidoIntro: "Libido naturalnie zmienia si\u0119 z cyklem. Podczas fazy {phaseName}: ",
    libidoOvulation: "libido ma tendencj\u0119 do osi\u0105gania szczytu w okolicach owulacji z powodu wysokiego poziomu estrogenu i testosteronu. To naturalne okno p\u0142odno\u015bci Twojego cia\u0142a. Ciesz si\u0119 tym zwi\u0119kszonym pragnieniem i pewno\u015bci\u0105 siebie.",
    libidoFollicular: "rosn\u0105cy estrogen w fazie folikularnej stopniowo zwi\u0119ksza pragnienie i podniecenie. Mo\u017cesz czu\u0107 si\u0119 bardziej energiczna spo\u0142ecznie i przyci\u0105gana do innych.",
    libidoLuteal: "progesteron ro\u015bnie i mo\u017ce obni\u017cy\u0107 libido u wielu os\u00f3b. To normalne. Skup si\u0119 na intymno\u015bci emocjonalnej i nie wywieraj na siebie presji. Przytulanie i blisko\u015b\u0107 s\u0105 r\u00f3wnie wa\u017cne.",
    libidoMenstrual: "libido r\u00f3\u017cni si\u0119 podczas miesi\u0105czki \u2014 niekt\u00f3re odczuwaj\u0105 wi\u0119ksze pragnienie, a inne nie. Oba warianty s\u0105 ca\u0142kowicie normalne. S\u0142uchaj swojego cia\u0142a i r\u00f3b to, co wydaje Ci si\u0119 w\u0142a\u015bciwe.",

    // Supplements responses
    supplementsIntro: "Oto zalecenia dotycz\u0105ce suplement\u00f3w na faz\u0119 {phaseName} (zawsze najpierw skonsultuj si\u0119 z lekarzem): ",
    supplementsMenstrual: "\u017belazo (szczeg\u00f3lnie przy obfitych miesi\u0105czkach), magnez (200-400mg na skurcze i nastr\u00f3j), witamina C (aby poprawi\u0107 wch\u0142anianie \u017celaza) i kwasy t\u0142uszczowe omega-3 (przeciwzapalne). Witaminy z kompleksu B mog\u0105 r\u00f3wnie\u017c wspiera\u0107 energi\u0119.",
    supplementsFollicular: "Probiotyki wspieraj\u0105ce zdrowie jelit i metabolizm estrogenu, witamina D (szczeg\u00f3lnie przy ma\u0142ej ilo\u015bci s\u0142o\u0144ca), cynk dla wsparcia odporno\u015bci i witaminy B dla energii. To dobry czas, aby skupi\u0107 si\u0119 na budowaniu zapas\u00f3w sk\u0142adnik\u00f3w od\u017cywczych.",
    supplementsOvulation: "Przeciwutleniacze takie jak witaminy E i C, kwasy t\u0142uszczowe omega-3 i cynk. NAC (N-acetylocysteina) mo\u017ce wspiera\u0107 zdrow\u0105 owulacj\u0119. Utrzymuj dobre nawodnienie i stawiaj na pe\u0142nowarto\u015bciow\u0105 \u017cywno\u015b\u0107 zamiast suplement\u00f3w, gdy to mo\u017cliwe.",
    supplementsLuteal: "Glicynian magnezu (na sen i nastr\u00f3j), witamina B6 (mo\u017ce pom\u00f3c przy PMS), wap\u0144 (1000mg wykazano zmniejszenie objaw\u00f3w PMS) i olej z wiesio\u0142ka. Niepokalanek (vitex) jest r\u00f3wnie\u017c stosowany przez niekt\u00f3re przy PMS, ale skonsultuj si\u0119 najpierw z lekarzem.",

    // Focus/productivity responses
    focusIntro: "Twoje wzorce poznawcze zmieniaj\u0105 si\u0119 z cyklem. W fazie {phaseName} (dzie\u0144 {cycleDay}): ",
    focusFollicular: "rosn\u0105cy estrogen poprawia umiej\u0119tno\u015bci werbalne, kreatywno\u015b\u0107 i zdolno\u015b\u0107 uczenia si\u0119. To najlepszy czas na burz\u0119 m\u00f3zg\u00f3w, rozpoczynanie nowych projekt\u00f3w, planowanie i przyswajanie nowych informacji. Zaplanuj teraz wa\u017cne spotkania i prac\u0119 kreatywn\u0105.",
    focusOvulation: "Twoje umiej\u0119tno\u015bci komunikacyjne i inteligencja spo\u0142eczna osi\u0105gaj\u0105 szczyt. Dobry czas na prezentacje, negocjacje, wsp\u00f3\u0142prac\u0119 i networking. Mo\u017ce by\u0107 Ci \u0142atwiej wykonywa\u0107 wiele zada\u0144 jednocze\u015bnie i szybko my\u015ble\u0107.",
    focusLuteal: "progesteron kieruje Tw\u00f3j m\u00f3zg ku szczeg\u00f3\u0142owemu, metodycznemu my\u015bleniu. Wykorzystaj to do edycji, korekty, organizacji, ko\u0144czenia projekt\u00f3w i zada\u0144 administracyjnych. Unikaj rozpoczynania ca\u0142kowicie nowych projekt\u00f3w, je\u015bli to mo\u017cliwe.",
    focusMenstrual: "Tw\u00f3j m\u00f3zg jest w stanie refleksyjnym i oceniaj\u0105cym. To w\u0142a\u015bciwie idealny czas na my\u015blenie strategiczne, przegl\u0105danie cel\u00f3w, prowadzenie dziennika i podejmowanie decyzji opartych na intuicji. Nie wymuszaj intensywnej pracy tw\u00f3rczej \u2014 zamiast tego planuj i reflektuj.",
    focusLowEnergy: " Twoja energia jest dzi\u015b niska \u2014 spr\u00f3buj pracowa\u0107 w kr\u00f3tkich 25-minutowych blokach skupienia (technika Pomodoro) z 5-minutowymi przerwami.",

    // Cycle knowledge responses
    cycleIntro: "Jeste\u015b na dniu {cycleDay} z {totalDays} swojego cyklu, obecnie w fazie {phaseName}. ",
    cycleMenstrual: "Faza menstruacyjna (zazwyczaj dni 1-5) to czas, gdy b\u0142ona \u015bluzowa macicy jest z\u0142uszczana. Poziomy hormon\u00f3w (estrogen i progesteron) s\u0105 najni\u017csze. Twoje cia\u0142o skupia si\u0119 na odnowie. Pomy\u015bl o tym jako o swojej wewn\u0119trznej zimie \u2014 czasie odpoczynku, refleksji i delikatnej troski o siebie.",
    cycleFollicular: "Faza folikularna (zazwyczaj dni 6-13) to czas, gdy Twoje cia\u0142o przygotowuje nowe jajeczko. Estrogen stale ro\u015bnie, zwi\u0119kszaj\u0105c energi\u0119, nastr\u00f3j i kreatywno\u015b\u0107. Pomy\u015bl o tym jako o swojej wewn\u0119trznej wio\u015bnie \u2014 czasie wzrostu i nowych pocz\u0105tk\u00f3w.",
    cycleOvulation: "Faza owulacyjna (zazwyczaj dni 14-16) to czas, gdy dojrza\u0142e jajeczko jest uwalniane. Estrogen osi\u0105ga szczyt, a hormon luteinizuj\u0105cy gwa\u0142townie wzrasta. Mo\u017cesz czu\u0107 si\u0119 najbardziej towarzyska, pewna siebie i energiczna. Pomy\u015bl o tym jako o swoim wewn\u0119trznym lecie \u2014 oknie szczytowej wydajno\u015bci.",
    cycleLuteal: "Faza lutealna (zazwyczaj dni 17-28) to czas, gdy progesteron ro\u015bnie, przygotowuj\u0105c si\u0119 na ewentualne zag\u0144ie\u017cd\u017cenie. Je\u015bli ci\u0105\u017ca nie wyst\u0105pi, hormony spadaj\u0105 i cykl zaczyna si\u0119 od nowa. Pomy\u015bl o tym jako o swojej wewn\u0119trznej jesieni \u2014 czasie na zwolnienie tempa i zbudowanie przytulnego gniazda.",

    // Quick reply additions
    quickCramps: "Pomoc przy skurczach",
    quickFocus: "Wskaz\u00f3wki dot. skupienia",

    // New keyword arrays
    "kw.hydration": "nawodnienie|woda|pragnienie|odwodnienie|pi\u0107",
    "kw.cramps": "skurcze|b\u00f3l|wzd\u0119cia|pms|dyskomfort|b\u00f3l miesi\u0105czkowy",
    "kw.libido": "libido|seks|intymno\u015b\u0107|pragnienie|podniecenie",
    "kw.supplements": "suplement|witamina|minera\u0142|magnez|\u017celazo|cynk",
    "kw.focus": "skupienie|koncentracja|produktywno\u015b\u0107|mg\u0142a m\u00f3zgowa|mentalny|kognitywny",
    "kw.cycle": "cykl|miesi\u0105czka|faza|owulacja|menstruacyjny|lutealny|folikularny",
  },

  pt: {
    headerTitle: "Companheiro de Bem-estar",
    headerSubtitle: "Fase {phaseName} \u00b7 Dia {cycleDay}",
    inputPlaceholder: "Pergunte ao IRIS...",
    welcomeMessage: "Ol\u00e1! Sou o seu companheiro de bem-estar IRIS. Uso os seus dados de ciclo, scan e check-in para lhe dar orienta\u00e7\u00e3o personalizada. Pergunte-me sobre a sua energia, nutri\u00e7\u00e3o, stress, sono ou humor.",
    quickTired: "Porque estou cansada?",
    quickEat: "O que devo comer?",
    quickStress: "Como est\u00e1 o meu stress?",
    quickSleep: "Dicas de sono",

    phaseMenstrual: "menstrual",
    phaseFollicular: "folicular",
    phaseOvulation: "ovulat\u00f3ria",
    phaseLuteal: "l\u00fatea",

    energyIntro: "Est\u00e1 no dia {cycleDay} do seu ciclo (fase {phaseName}).",
    energyScoreToday: " A sua pontua\u00e7\u00e3o de energia hoje \u00e9 {energy}/10",
    energyLower: ", o que \u00e9 inferior \u00e0 sua m\u00e9dia de {avg}.",
    energyHigher: ", o que \u00e9 superior \u00e0 sua m\u00e9dia de {avg}.",
    energySame: ", o que \u00e9 aproximadamente igual \u00e0 sua m\u00e9dia de {avg}.",
    energyLuteal: " Muitas pessoas experimentam menor energia na fase l\u00fatea. Considere movimentos suaves como caminhar ou yoga, e tente deitar-se 30 minutos mais cedo esta noite.",
    energyMenstrual: " Durante a menstrua\u00e7\u00e3o, o seu corpo usa energia extra. Priorize o descanso, alimentos ricos em ferro como vegetais de folha verde, e mantenha-se bem hidratada.",
    energyFollicular: " A fase folicular geralmente traz energia crescente. Se ainda se sente cansada, verifique a qualidade do sono e os n\u00edveis de hidrata\u00e7\u00e3o.",
    energyOvulation: " Durante a ovula\u00e7\u00e3o, a energia est\u00e1 tipicamente no seu pico. Se se sente cansada, pode valer a pena verificar o seu sono e n\u00edveis de stress.",
    energyHighFatigue: " O seu indicador de fadiga est\u00e1 elevado hoje \u2014 considere uma sesta curta ou uma sess\u00e3o de alongamentos leves.",

    foodIntro: "Durante a fase {phaseName}, ",
    foodLuteal: "o seu corpo pode beneficiar de hidratos de carbono complexos, alimentos ricos em magn\u00e9sio (chocolate negro, nozes) e escolhas anti-inflamat\u00f3rias.",
    foodInflammation: " A sua pontua\u00e7\u00e3o de inflama\u00e7\u00e3o est\u00e1 ligeiramente mais alta hoje \u2014 considere adicionar a\u00e7afr\u00e3o ou gengibre \u00e0s suas refei\u00e7\u00f5es.",
    foodMenstrual: "concentre-se em alimentos ricos em ferro (espinafres, lentilhas, carne vermelha), sopas quentes e op\u00e7\u00f5es anti-inflamat\u00f3rias. Chocolate negro e alimentos ricos em magn\u00e9sio tamb\u00e9m podem ajudar com c\u00f3licas.",
    foodFollicular: "o seu metabolismo est\u00e1 a acelerar. Prote\u00ednas magras, vegetais frescos e alimentos fermentados apoiam o aumento de estrog\u00e9nio. \u00c9 um \u00f3timo momento para experimentar novas receitas.",
    foodOvulation: "a energia est\u00e1 alta e o seu corpo lida bem com hidratos de carbono. Concentre-se em alimentos ricos em fibra, gorduras saud\u00e1veis e muitas frutas e vegetais ricos em antioxidantes.",
    foodLowHydration: " O seu n\u00edvel de hidrata\u00e7\u00e3o est\u00e1 abaixo do ideal \u2014 tente beber pelo menos 8 copos de \u00e1gua hoje.",

    stressIntro: "Est\u00e1 na fase {phaseName} (dia {cycleDay}).",
    stressScoreToday: " A sua pontua\u00e7\u00e3o de stress hoje \u00e9 {stress}/10",
    stressAvg: " (a sua m\u00e9dia \u00e9 {avg}).",
    stressHigh: " O seu n\u00edvel de stress est\u00e1 notavelmente elevado. Tente um exerc\u00edcio de respira\u00e7\u00e3o quadrada de 5 minutos: inspire 4 tempos, segure 4, expire 4, segure 4. Repita 5 vezes.",
    stressModerate: " O seu stress \u00e9 moderado. Um passeio curto ao ar livre, respira\u00e7\u00e3o profunda ou alguns minutos de escrita terap\u00eautica podem ajudar a reduzi-lo.",
    stressLow: " O seu n\u00edvel de stress parece bem gerido hoje. Continue com a rotina que est\u00e1 a funcionar para si.",
    stressNoScan: " Complete um scan hoje para obter informa\u00e7\u00f5es personalizadas sobre o stress. Entretanto, tente 5 minutos de respira\u00e7\u00e3o profunda ou um passeio curto.",
    stressLutealNote: " A fase l\u00fatea pode amplificar a sensibilidade ao stress \u2014 seja especialmente gentil consigo mesma esta semana.",

    sleepLogged: "Com base no seu check-in, registou {hours} horas de sono. ",
    sleepLow: "Isso est\u00e1 abaixo das 7-9 horas recomendadas. ",
    sleepSlightlyLow: "Isso est\u00e1 ligeiramente abaixo do intervalo \u00f3timo. ",
    sleepGood: "Isso est\u00e1 dentro de um intervalo saud\u00e1vel. ",
    sleepLuteal: "Durante a fase l\u00fatea, a progesterona sobe o que pode faz\u00ea-la sentir mais sonolenta mas paradoxalmente perturbar o sono profundo. Tente magn\u00e9sio antes de dormir (200-400mg), evite ecr\u00e3s 1 hora antes de deitar e mantenha o quarto fresco (cerca de 18-20\u00b0C).",
    sleepMenstrual: "A menstrua\u00e7\u00e3o pode afetar a qualidade do sono. Um banho quente antes de dormir, ch\u00e1 de camomila e alongamentos suaves podem ajudar. Considere um saco de \u00e1gua quente se as c\u00f3licas estiverem a perturbar o seu descanso.",
    sleepFollicular: "O aumento de estrog\u00e9nio na fase folicular geralmente favorece um sono melhor. Use este tempo para estabelecer bons h\u00e1bitos de sono: hor\u00e1rio consistente, sem cafe\u00edna ap\u00f3s as 14h e um quarto escuro e fresco.",
    sleepOvulation: "Por volta da ovula\u00e7\u00e3o, a temperatura corporal sobe ligeiramente o que pode afetar o sono. Mantenha o quarto extra fresco e considere roupa de cama leve. \u00c9 um bom momento para uma rotina calmante antes de dormir.",
    sleepLowRecovery: " A sua pontua\u00e7\u00e3o de recupera\u00e7\u00e3o est\u00e1 baixa \u2014 priorizar o sono esta noite ajudar\u00e1 o seu corpo a restaurar-se.",

    moodIntro: "Est\u00e1 na fase {phaseName}. ",
    moodScoreToday: "O seu humor hoje \u00e9 {mood}/10. ",
    moodLow: "Isso \u00e9 mais baixo do que o ideal. ",
    moodLuteal: "A fase l\u00fatea pode trazer flutua\u00e7\u00f5es de humor devido \u00e0s mudan\u00e7as na progesterona. Escrever um di\u00e1rio, exerc\u00edcio leve e conversar com algu\u00e9m de confian\u00e7a podem ajudar a estabilizar as suas emo\u00e7\u00f5es.",
    moodMenstrual: "As hormonas est\u00e3o no seu n\u00edvel mais baixo durante a menstrua\u00e7\u00e3o, o que pode afetar o humor. Seja gentil consigo mesma \u2014 autocuidado, descanso e comida reconfortante (com modera\u00e7\u00e3o) s\u00e3o totalmente apropriados agora.",
    moodFollicular: "O aumento de estrog\u00e9nio tipicamente traz humor e motiva\u00e7\u00e3o melhorados. \u00c9 um \u00f3timo momento para atividades sociais, projetos criativos e experimentar coisas novas.",
    moodOvulation: "A ovula\u00e7\u00e3o frequentemente traz um pico de humor gra\u00e7as ao alto estrog\u00e9nio e a um surto de LH. Aproveite esta energia social e confiante enquanto dura.",

    exerciseIntro: "Para a fase {phaseName} (dia {cycleDay}), ",
    exerciseMenstrual: "movimentos suaves como caminhar, yoga ou alongamentos leves s\u00e3o recomendados. O seu corpo est\u00e1 a recuperar, por isso evite for\u00e7ar demasiado.",
    exerciseFollicular: "o seu corpo est\u00e1 pronto para ganhos de for\u00e7a. Tente treino de for\u00e7a, HIIT ou aprender novas habilidades atl\u00e9ticas. Energia e coordena\u00e7\u00e3o est\u00e3o a melhorar.",
    exerciseOvulation: "esta \u00e9 a sua janela de pico de performance. V\u00e1 atr\u00e1s de records pessoais, treinos de alta intensidade ou aulas de grupo desafiantes. O seu corpo aguenta mais agora.",
    exerciseLuteal: "concentre-se em exerc\u00edcio de intensidade moderada. Pilates, cardio moderado e yoga s\u00e3o excelentes escolhas. \u00c0 medida que a fase avan\u00e7a, transite para atividades mais leves.",
    exerciseLowEnergy: " No entanto, a sua energia est\u00e1 bastante baixa hoje \u2014 n\u00e3o h\u00e1 problema em fazer algo suave ou tirar um dia de descanso.",

    skinIntro: "Durante a fase {phaseName}, ",
    skinLuteal: "o aumento de progesterona aumenta a produ\u00e7\u00e3o de sebo e pode desencadear erup\u00e7\u00f5es. Use produtos suaves e n\u00e3o comedog\u00e9nicos, \u00e1cido salic\u00edlico para imperfeiq\u00f5es e niacinamida para controlo de oleosidade.",
    skinMenstrual: "a pele pode estar sens\u00edvel e seca. Use produtos hidratantes e suaves e evite esfoliantes agressivos. Concentre-se em ingredientes calmantes como aloe e centella.",
    skinFollicular: "o estrog\u00e9nio est\u00e1 a subir e a pele geralmente parece mais clara. \u00c9 um \u00f3timo momento para esfoliar, s\u00e9runs de vitamina C e experimentar novos ingredientes ativos.",
    skinOvulation: "provavelmente est\u00e1 no seu momento mais radiante. O pico de estrog\u00e9nio cria um brilho natural. Mantenha a sua rotina simples e aproveite.",

    fallbackIntro: "Posso ajudar com perguntas sobre a sua energia, nutri\u00e7\u00e3o, stress, sono, humor, exerc\u00edcio e cuidados com a pele \u2014 tudo personalizado para a sua fase {phaseName} (dia {cycleDay} de {totalDays}).",
    fallbackScan: "\n\nO seu \u00faltimo scan mostra: energia {energy}/10, stress {stress}/10, recupera\u00e7\u00e3o {recovery}/10.",
    fallbackSuggestions: "\n\nTente perguntar-me coisas como:\n- Porque estou cansada?\n- O que devo comer?\n- Como est\u00e1 o meu stress?\n- D\u00ea-me dicas de sono\n- Que treino devo fazer?\n- Como est\u00e1 a minha pele esta semana?",

    "kw.energy": "cansada|energia|fadiga|exausta|esgotada",
    "kw.food": "comer|comida|nutri\u00e7\u00e3o|dieta|alimenta\u00e7\u00e3o",
    "kw.stress": "stress|stresse|ansiosa|ansiedade|sobrecarregada",
    "kw.sleep": "sono|ins\u00f3nia|dormir|descanso|descansar",
    "kw.mood": "humor|disposi\u00e7\u00e3o|triste|feliz|emocional|deprimida",
    "kw.exercise": "exerc\u00edcio|treino|desporto|movimento|gin\u00e1sio",
    "kw.skin": "pele|acne|brilho|borbulhas|imperfeições",

    // Hydration responses
    hydrationIntro: "Manter-se bem hidratada \u00e9 importante durante a fase {phaseName}. ",
    hydrationVeryLow: "O seu n\u00edvel de hidrata\u00e7\u00e3o \u00e9 {hydration}/10 \u2014 \u00e9 bastante baixo. Tente beber um copo de \u00e1gua agora e programe lembretes ao longo do dia. ",
    hydrationLow: "O seu n\u00edvel de hidrata\u00e7\u00e3o \u00e9 {hydration}/10 \u2014 um pouco abaixo do ideal. Tente beber pelo menos 8 copos hoje. ",
    hydrationGood: "O seu n\u00edvel de hidrata\u00e7\u00e3o \u00e9 {hydration}/10 \u2014 est\u00e1 a ir bem! Continue assim. ",
    hydrationMenstrual: "Durante a menstrua\u00e7\u00e3o, perde l\u00edquidos extra. Ch\u00e1s quentes de ervas (gengibre, camomila) contam para a hidrata\u00e7\u00e3o e tamb\u00e9m podem aliviar c\u00f3licas.",
    hydrationOvulation: "Por volta da ovula\u00e7\u00e3o, a temperatura corporal sobe ligeiramente. Aumente a ingest\u00e3o de \u00e1gua e adicione eletr\u00f3litos se estiver ativa.",
    hydrationLuteal: "Na fase l\u00fatea, a progesterona pode causar reten\u00e7\u00e3o de l\u00edquidos. Paradoxalmente, beber MAIS \u00e1gua ajuda a reduzir o incha\u00e7o.",
    hydrationFollicular: "A fase folicular \u00e9 um bom momento para criar h\u00e1bitos de hidrata\u00e7\u00e3o. Experimente aromatizar a \u00e1gua com lim\u00e3o, pepino ou frutos vermelhos para variar.",

    // Cramps/pain responses
    crampsIntro: "Vamos falar sobre como lidar com o desconforto durante a fase {phaseName} (dia {cycleDay}). ",
    crampsMenstrual: "As c\u00f3licas menstruais s\u00e3o causadas pelas prostaglandinas. O que pode ajudar: uma bolsa de \u00e1gua quente no baixo ventre, caminhadas leves, alimentos ricos em magn\u00e9sio (chocolate negro, bananas) e ch\u00e1s anti-inflamat\u00f3rios como gengibre ou camomila. Posturas suaves de yoga como a posi\u00e7\u00e3o da crian\u00e7a e gato-vaca tamb\u00e9m podem aliviar a tens\u00e3o.",
    crampsLuteal: "O desconforto pr\u00e9-menstrual \u00e9 comum na fase l\u00fatea. Suplementos de magn\u00e9sio (200-400mg), alimentos ricos em c\u00e1lcio, exerc\u00edcio suave regular e a redu\u00e7\u00e3o de cafe\u00edna e sal podem ajudar a gerir os sintomas de SPM.",
    crampsOvulation: "Algumas pessoas sentem mittelschmerz \u2014 uma dor breve e aguda durante a ovula\u00e7\u00e3o. \u00c9 normal. Uma compressa quente e movimento leve geralmente ajudam. Se a dor for intensa ou persistente, consulte o seu m\u00e9dico.",
    crampsFollicular: "A fase folicular \u00e9 geralmente a mais confort\u00e1vel. Se estiver a sentir desconforto incomum, considere registar \u2014 os padr\u00f5es podem ajud\u00e1-la e ao seu m\u00e9dico a identificar poss\u00edveis preocupa\u00e7\u00f5es.",

    // Libido/intimacy responses
    libidoIntro: "A libido flutua naturalmente com o seu ciclo. Durante a fase {phaseName}: ",
    libidoOvulation: "a libido tende a atingir o pico por volta da ovula\u00e7\u00e3o devido a n\u00edveis elevados de estrog\u00e9nio e testosterona. Esta \u00e9 a janela de fertilidade natural do seu corpo. Aproveite este aumento de desejo e confian\u00e7a.",
    libidoFollicular: "o estrog\u00e9nio em ascens\u00e3o na fase folicular aumenta gradualmente o desejo e a excita\u00e7\u00e3o. Pode sentir-se mais energizada socialmente e atra\u00edda pelos outros.",
    libidoLuteal: "a progesterona sobe e pode reduzir a libido em muitas pessoas. Isto \u00e9 normal. Concentre-se na intimidade emocional e n\u00e3o se pressione. Mimos e conex\u00e3o s\u00e3o igualmente v\u00e1lidos.",
    libidoMenstrual: "a libido varia durante a menstrua\u00e7\u00e3o \u2014 algumas sentem mais desejo enquanto outras n\u00e3o. Ambas as situa\u00e7\u00f5es s\u00e3o completamente normais. Ou\u00e7a o seu corpo e fa\u00e7a o que lhe parece certo.",

    // Supplements responses
    supplementsIntro: "Aqui est\u00e3o recomenda\u00e7\u00f5es de suplementos para a fase {phaseName} (consulte sempre o seu m\u00e9dico primeiro): ",
    supplementsMenstrual: "Ferro (especialmente em caso de menstrua\u00e7\u00f5es abundantes), magn\u00e9sio (200-400mg para c\u00f3licas e humor), vitamina C (para melhorar a absor\u00e7\u00e3o de ferro) e \u00e1cidos gordos \u00f3mega-3 (anti-inflamat\u00f3rio). As vitaminas do complexo B tamb\u00e9m podem apoiar a energia.",
    supplementsFollicular: "Probi\u00f3ticos para apoiar a sa\u00fade intestinal e o metabolismo do estrog\u00e9nio, vitamina D (especialmente se apanha pouco sol), zinco para apoio imunit\u00e1rio e vitaminas B para energia. \u00c9 um bom momento para se focar na constru\u00e7\u00e3o de reservas nutritivas.",
    supplementsOvulation: "Antioxidantes como vitaminas E e C, \u00e1cidos gordos \u00f3mega-3 e zinco. NAC (N-acetilciste\u00edna) pode apoiar uma ovula\u00e7\u00e3o saud\u00e1vel. Mantenha-se bem hidratada e prefira alimentos integrais em vez de suplementos quando poss\u00edvel.",
    supplementsLuteal: "Glicinato de magn\u00e9sio (para sono e humor), vitamina B6 (pode ajudar com SPM), c\u00e1lcio (1000mg demonstrou reduzir sintomas de SPM) e \u00f3leo de pr\u00edmula. O agno-casto (vitex) tamb\u00e9m \u00e9 usado por algumas para SPM, mas consulte o seu m\u00e9dico primeiro.",

    // Focus/productivity responses
    focusIntro: "Os seus padr\u00f5es cognitivos mudam com o ciclo. Na fase {phaseName} (dia {cycleDay}): ",
    focusFollicular: "o estrog\u00e9nio em ascens\u00e3o melhora as compet\u00eancias verbais, a criatividade e a aprendizagem. Este \u00e9 o seu melhor momento para brainstorming, iniciar novos projetos, planear e absorver novas informa\u00e7\u00f5es. Agende agora reuni\u00f5es importantes e trabalho criativo.",
    focusOvulation: "as suas compet\u00eancias de comunica\u00e7\u00e3o e intelig\u00eancia social atingem o pico. Bom momento para apresenta\u00e7\u00f5es, negocia\u00e7\u00f5es, colabora\u00e7\u00f5es e networking. Pode achar mais f\u00e1cil fazer v\u00e1rias coisas ao mesmo tempo e pensar rapidamente.",
    focusLuteal: "a progesterona orienta o seu c\u00e9rebro para um pensamento detalhado e met\u00f3dico. Use isto para edi\u00e7\u00e3o, revis\u00e3o, organiza\u00e7\u00e3o, finalizar projetos e tarefas administrativas. Evite iniciar projetos completamente novos se poss\u00edvel.",
    focusMenstrual: "o seu c\u00e9rebro est\u00e1 num estado reflexivo e avaliativo. Isto \u00e9 na verdade ideal para pensamento estrat\u00e9gico, rever objetivos, escrever um di\u00e1rio e tomar decis\u00f5es baseadas na intui\u00e7\u00e3o. N\u00e3o force trabalho criativo intenso \u2014 em vez disso, planeie e reflita.",
    focusLowEnergy: " A sua energia est\u00e1 baixa hoje \u2014 tente trabalhar em blocos de concentra\u00e7\u00e3o de 25 minutos (t\u00e9cnica Pomodoro) com pausas de 5 minutos.",

    // Cycle knowledge responses
    cycleIntro: "Est\u00e1 no dia {cycleDay} de {totalDays} do seu ciclo, atualmente na fase {phaseName}. ",
    cycleMenstrual: "A fase menstrual (tipicamente dias 1-5) \u00e9 quando o revestimento uterino \u00e9 eliminado. Os n\u00edveis hormonais (estrog\u00e9nio e progesterona) est\u00e3o no m\u00ednimo. O seu corpo est\u00e1 focado na renova\u00e7\u00e3o. Pense nisto como o seu inverno interior \u2014 um tempo de descanso, reflex\u00e3o e autocuidado suave.",
    cycleFollicular: "A fase folicular (tipicamente dias 6-13) \u00e9 quando o seu corpo prepara um novo \u00f3vulo. O estrog\u00e9nio sobe constantemente, impulsionando a energia, o humor e a criatividade. Pense nisto como a sua primavera interior \u2014 um tempo de crescimento e novos come\u00e7os.",
    cycleOvulation: "A fase ovulat\u00f3ria (tipicamente dias 14-16) \u00e9 quando um \u00f3vulo maduro \u00e9 libertado. O estrog\u00e9nio atinge o pico e a hormona luteinizante aumenta drasticamente. Pode sentir-se mais social, confiante e en\u00e9rgica. Pense nisto como o seu ver\u00e3o interior \u2014 a sua janela de desempenho m\u00e1ximo.",
    cycleLuteal: "A fase l\u00fatea (tipicamente dias 17-28) \u00e9 quando a progesterona sobe para preparar uma poss\u00edvel implanta\u00e7\u00e3o. Se n\u00e3o houver gravidez, as hormonas descem e o ciclo rece\u00e7a. Pense nisto como o seu outono interior \u2014 um tempo para abrandar e aninhar-se.",

    // Quick reply additions
    quickCramps: "Ajuda com c\u00f3licas",
    quickFocus: "Dicas de concentra\u00e7\u00e3o",

    // New keyword arrays
    "kw.hydration": "hidrata\u00e7\u00e3o|\u00e1gua|sede|desidratada|beber|l\u00edquido",
    "kw.cramps": "c\u00f3licas|dor|incha\u00e7o|spm|desconforto|dor menstrual",
    "kw.libido": "libido|sexo|intimidade|desejo|excita\u00e7\u00e3o",
    "kw.supplements": "suplemento|vitamina|mineral|magn\u00e9sio|ferro|zinco",
    "kw.focus": "concentra\u00e7\u00e3o|produtividade|nevoeiro mental|cognitivo|foco",
    "kw.cycle": "ciclo|per\u00edodo|fase|ovula\u00e7\u00e3o|menstrual|l\u00fatea|folicular",
  },
};

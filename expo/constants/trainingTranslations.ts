/**
 * Training plan translations — 9 languages.
 * Keys are referenced from lib/trainingPlans.ts and app/training-plan.tsx.
 */
import { Language } from './translations';

// ─────────────────────────────────────────────────────────────────────────────
// English
// ─────────────────────────────────────────────────────────────────────────────
const en: Record<string, string> = {
  // ─── Section headers ──────────────────────────────────────────────────────
  title: "Today's Training",
  subtitle: "Cycle-synced movement for your phase",
  primaryWorkout: "Recommended",
  alternative: "Alternative",
  duration: "{n} min",
  intensity: "Intensity",
  warmup: "Warm Up",
  cooldown: "Cool Down",
  tips: "Phase Tips",
  avoid: "Better to Skip",
  startWorkout: "Start Workout",
  completed: "Workout Complete!",
  calories: "~{n} cal",

  // ─── Intensity labels ─────────────────────────────────────────────────────
  rest: "Rest",
  light: "Light",
  moderate: "Moderate",
  intense: "Intense",

  // ─── Phase labels ─────────────────────────────────────────────────────────
  phaseMenstrual: "Menstrual Phase",
  phaseFollicular: "Follicular Phase",
  phaseOvulation: "Ovulation Phase",
  phaseLuteal: "Luteal Phase",

  // ─── Workout titles ───────────────────────────────────────────────────────
  workoutGentleYogaTitle: "Gentle Yoga",
  workoutGentleYogaDesc: "Restorative stretching and breathwork to ease tension and support recovery during your period.",
  workoutLightWalkingTitle: "Light Walk",
  workoutLightWalkingDesc: "A relaxed 20-minute outdoor walk to boost circulation without over-exerting.",
  workoutRestDayTitle: "Rest Day",
  workoutRestDayDesc: "Your body needs recovery today. Focus on gentle breathing and hydration.",
  workoutBodyweightTitle: "Bodyweight Strength",
  workoutBodyweightDesc: "No equipment needed! Squats, lunges, push-ups, and planks. Build strength at home using only your body.",
  workoutDanceCardioTitle: "Dance Cardio at Home",
  workoutDanceCardioDesc: "Put on your favorite music and move for 25 minutes. Any style goes — just keep moving and have fun!",
  workoutBodyweightHiitTitle: "Bodyweight HIIT",
  workoutBodyweightHiitDesc: "25 minutes of burpees, mountain climbers, jump squats, and high knees. 30 seconds on, 30 seconds rest. No equipment needed.",
  workoutPowerFlowTitle: "Power Yoga Flow",
  workoutPowerFlowDesc: "A challenging yoga flow with warrior poses, chair pose, and balancing sequences. Builds strength and flexibility at home.",
  workoutModBodyweightTitle: "Moderate Home Circuit",
  workoutModBodyweightDesc: "A balanced home circuit: squats, push-ups, glute bridges, and planks. 3 rounds of 10 reps each. Gentle on joints.",
  workoutPilatesTitle: "Pilates at Home",
  workoutPilatesDesc: "Mat-based core work with controlled breathing. Focus on pelvic floor, abs, and posture. Only a mat needed.",
  workoutStretchingTitle: "Gentle Home Stretching",
  workoutStretchingDesc: "Full-body stretching on your mat. Focus on hips, back, and shoulders. Soothing for PMS tension. No equipment needed.",
  workoutFloorWorkTitle: "Floor Strength Work",
  workoutFloorWorkDesc: "Glute bridges, leg raises, clamshells, and bird-dogs. All done lying on a mat at home. Gentle but effective.",

  // ─── Warmups ──────────────────────────────────────────────────────────────
  warmupMenstrual: "5 minutes of gentle neck rolls, shoulder circles, and seated hip openers. Move slowly and breathe deeply.",
  warmupFollicular: "5 minutes of dynamic stretches: leg swings, arm circles, light jogging in place. Get your heart rate gently rising.",
  warmupOvulation: "5 minutes of brisk jumping jacks, high knees, and dynamic lunges. Prepare your body for peak effort.",
  warmupLuteal: "5 minutes of slow cat-cow stretches, side bends, and gentle torso twists. Ease your body into movement.",

  // ─── Cooldowns ────────────────────────────────────────────────────────────
  cooldownMenstrual: "5 minutes of child's pose, seated forward fold, and deep belly breathing. Let your body fully relax.",
  cooldownFollicular: "5 minutes of hamstring stretch, quad stretch, and light foam rolling. Help your muscles recover quickly.",
  cooldownOvulation: "5 minutes of standing forward fold, figure-four stretch, and slow breathing. Bring your heart rate down gradually.",
  cooldownLuteal: "5 minutes of reclined butterfly pose, gentle spinal twist, and box breathing. Calm your nervous system.",

  // ─── Phase tips ───────────────────────────────────────────────────────────
  tipMenstrual1: "Listen to your body — rest days are productive days",
  tipMenstrual2: "Focus on breath work and gentle movement",
  tipFollicular1: "Energy is rising — try adding more reps or rounds",
  tipFollicular2: "Try a new bodyweight exercise or flow",
  tipFollicular3: "Your body recovers faster now — great time to challenge yourself",
  tipOvulation1: "Peak performance window — push your bodyweight exercises!",
  tipOvulation2: "Great time for longer hold times and more reps",
  tipOvulation3: "Stay well-hydrated during intense home workouts",
  tipLuteal1: "Energy is declining gradually",
  tipLuteal2: "Focus on form over intensity",
  tipLuteal3: "Yoga can help with PMS symptoms",

  // ─── Avoid lists ──────────────────────────────────────────────────────────
  avoidMenstrual1: "High-intensity training",
  avoidMenstrual2: "Intense bodyweight circuits",
  avoidMenstrual3: "Hot yoga or heated rooms",
  avoidFollicular1: "Skipping workouts — capitalize on rising energy at home",
  avoidOvulation1: "Under-training — this is your power window, even at home!",
  avoidLuteal1: "Overtraining",
  avoidLuteal2: "Ignoring fatigue signals",

  // ─── Scan-aware adjustments ───────────────────────────────────────────────
  scanAdjustRestDay: "Your scan shows very low energy — a rest day is the best choice today.",
  scanAdjustHighEnergy: "Your scan shows high energy — upgraded to a more intense workout!",
  scanAdjustHighStress: "Your scan shows elevated stress — moderate cardio will help without adding strain.",
  scanAdjustHighFatigue: "Your scan shows high fatigue — gentle stretching is recommended today.",

  // ─── Life-stage workout titles ────────────────────────────────────────────
  workoutPrenatalYogaTitle: "Prenatal Yoga",
  workoutPrenatalYogaDesc: "Gentle yoga focusing on pelvic floor strength and breathing techniques. Safe for all trimesters with modifications.",
  workoutPrenatalWalkTitle: "Prenatal Walk",
  workoutPrenatalWalkDesc: "A gentle 20-minute walk at a comfortable pace. Stay hydrated and avoid overheating.",
  workoutPrenatalSwimTitle: "Prenatal Swimming",
  workoutPrenatalSwimDesc: "Low-impact water exercise that supports joints and relieves pressure. Great for the second trimester.",
  workoutPostpartumRecoveryTitle: "Postpartum Recovery",
  workoutPostpartumRecoveryDesc: "Gentle pelvic floor and deep core activation exercises. Start rebuilding your foundation at your own pace.",
  workoutPostpartumGentleTitle: "Gentle Postpartum Movement",
  workoutPostpartumGentleDesc: "Baby-friendly walks and gentle stretches. A calm way to ease back into movement after birth.",
  workoutPerimenopauseStrengthTitle: "Bone-Supporting Bodyweight",
  workoutPerimenopauseStrengthDesc: "Weight-bearing bodyweight exercises to support bone density. Squats, lunges, and standing presses.",
  workoutPerimenopauseYogaTitle: "Cooling Yoga",
  workoutPerimenopauseYogaDesc: "Cooling yoga poses and forward folds that may help ease hot flash discomfort. Calm, grounded practice.",
  workoutMenopauseBalanceTitle: "Balance & Stability",
  workoutMenopauseBalanceDesc: "Single-leg stands, heel-to-toe walks, and stability exercises. Builds confidence and helps prevent falls.",
  workoutMenopauseWalkingTitle: "Brisk Walking",
  workoutMenopauseWalkingDesc: "A 25-minute brisk walk to support cardiovascular health. Maintain a pace where you can still hold a conversation.",

  // ─── Life-stage warmups ───────────────────────────────────────────────────
  warmupPregnancy: "5 minutes of gentle shoulder rolls, seated hip circles, and deep diaphragmatic breathing. Move at your own pace.",
  warmupPostpartum: "5 minutes of gentle neck stretches, wrist circles, and seated pelvic tilts. Be kind to your body.",
  warmupPerimenopause: "5 minutes of gentle arm swings, hip circles, and light marching in place. Focus on loosening up.",
  warmupMenopause: "5 minutes of seated ankle circles, arm reaches, and gentle torso twists. Warm up every joint before moving.",

  // ─── Life-stage cooldowns ─────────────────────────────────────────────────
  cooldownPregnancy: "5 minutes of seated side stretches, gentle neck rolls, and slow deep breathing. Stay comfortable throughout.",
  cooldownPostpartum: "5 minutes of gentle full-body stretches, deep breathing, and a moment of stillness. You deserve this rest.",
  cooldownPerimenopause: "5 minutes of forward fold, seated twist, and cooling breath (inhale through the nose, exhale through the mouth).",
  cooldownMenopause: "5 minutes of gentle seated stretches, slow breathing, and progressive relaxation from toes to head.",

  // ─── Life-stage tips ──────────────────────────────────────────────────────
  tipPregnancy1: "Stay hydrated before, during, and after movement",
  tipPregnancy2: "Avoid lying flat on your back after 20 weeks",
  tipPregnancy3: "Listen to your body — stop if anything feels uncomfortable",
  tipPostpartum1: "Start slow — recovery takes time and patience",
  tipPostpartum2: "Focus on pelvic floor exercises before adding intensity",
  tipPerimenopause1: "Weight-bearing exercise supports bone health during hormonal changes",
  tipPerimenopause2: "Cooling yoga and breathwork can help with hot flash discomfort",
  tipMenopause1: "Balance exercises help build stability and prevent falls",
  tipMenopause2: "Regular walking supports heart health and mood",

  // ─── Life-stage avoid lists ───────────────────────────────────────────────
  avoidPregnancy1: "High-impact jumping or jarring movements",
  avoidPregnancy2: "Lying flat on your back (after week 20)",
  avoidPregnancy3: "Exercising in extreme heat or to the point of overheating",
  avoidPostpartum1: "Intense core work until cleared by your healthcare provider",
  avoidPostpartum2: "Running or high-impact activity (usually wait 12+ weeks)",
  avoidPerimenopause1: "Exercising in extreme heat",
  avoidPerimenopause2: "Pushing through exhaustion — rest when you need to",
  avoidMenopause1: "High-impact activities that stress joints",
  avoidMenopause2: "Skipping your warm-up — joints need extra preparation",

  // ─── Life-stage labels ────────────────────────────────────────────────────
  phasePregnancy: "Pregnancy",
  phasePostpartum: "Postpartum",
  phasePerimenopause: "Perimenopause",
  phaseMenopause: "Menopause",

  // ─── Workout timer & exercises ───────────────────────────────────────────
  exercises: "Exercises",
  sets: "{n} sets",
  reps: "{n} reps",
  restTime: "{n}s rest",
  currentExercise: "Exercise {current} of {total}",
  currentSet: "Set {current} of {total}",
  resting: "Rest",
  pause: "Pause",
  resume: "Resume",
  endWorkout: "End Workout",
  workoutComplete: "Workout Complete!",
  totalTime: "Total Time",
  greatJob: "Great job! You completed your workout.",
  nextExercise: "Next",
  elapsed: "Elapsed",

  // ─── Misc labels ──────────────────────────────────────────────────────────
  scanAdjusted: "Scan-adjusted",
  day: "Day",
};

// ─────────────────────────────────────────────────────────────────────────────
// Swedish (Svenska)
// ─────────────────────────────────────────────────────────────────────────────
const sv: Record<string, string> = {
  // ─── Section headers ──────────────────────────────────────────────────────
  title: "Dagens träning",
  subtitle: "Cykelanpassad rörelse för din fas",
  primaryWorkout: "Rekommenderat",
  alternative: "Alternativ",
  duration: "{n} min",
  intensity: "Intensitet",
  warmup: "Uppvärmning",
  cooldown: "Nedvarvning",
  tips: "Fastips",
  avoid: "Bättre att hoppa över",
  startWorkout: "Starta träning",
  completed: "Träning klar!",
  calories: "~{n} kcal",

  // ─── Intensity labels ─────────────────────────────────────────────────────
  rest: "Vila",
  light: "Lätt",
  moderate: "Måttlig",
  intense: "Intensiv",

  // ─── Phase labels ─────────────────────────────────────────────────────────
  phaseMenstrual: "Menstruationsfas",
  phaseFollicular: "Follikelfas",
  phaseOvulation: "Ovulationsfas",
  phaseLuteal: "Lutealfas",

  // ─── Workout titles ───────────────────────────────────────────────────────
  workoutGentleYogaTitle: "Mjuk yoga",
  workoutGentleYogaDesc: "Återhämtande stretching och andningsövningar för att lätta på spänningar och stödja återhämtningen under mensen.",
  workoutLightWalkingTitle: "Lätt promenad",
  workoutLightWalkingDesc: "En avslappnad 20-minuters utomhuspromenad för bättre blodcirkulation utan att överanstränga dig.",
  workoutRestDayTitle: "Vilodag",
  workoutRestDayDesc: "Din kropp behöver återhämtning idag. Fokusera på lugn andning och vätskeintag.",
  workoutBodyweightTitle: "Kroppsviktsstyrka",
  workoutBodyweightDesc: "Ingen utrustning behövs! Knäböj, utfall, armhävningar och plankor. Bygg styrka hemma med bara din kropp.",
  workoutDanceCardioTitle: "Danskardio hemma",
  workoutDanceCardioDesc: "Sätt på din favoritmusik och rör dig i 25 minuter. Vilken stil som helst — bara fortsätt röra dig och ha kul!",
  workoutBodyweightHiitTitle: "HIIT med kroppsvikt",
  workoutBodyweightHiitDesc: "25 minuter med burpees, mountain climbers, jumpingknäböj och höga knän. 30 sekunder på, 30 sekunder vila. Ingen utrustning behövs.",
  workoutPowerFlowTitle: "Power yoga-flöde",
  workoutPowerFlowDesc: "Ett utmanande yogaflöde med krigarställningar, stolsställning och balanssekvenser. Bygger styrka och rörlighet hemma.",
  workoutModBodyweightTitle: "Måttligt hemmapass",
  workoutModBodyweightDesc: "Ett balanserat hemmapass: knäböj, armhävningar, höftlyft och plankor. 3 rundor med 10 repetitioner var. Skonsamt för leder.",
  workoutPilatesTitle: "Pilates hemma",
  workoutPilatesDesc: "Mattbaserat kärn­arbete med kontrollerad andning. Fokus på bäckenbotten, mage och hållning. Bara en matta behövs.",
  workoutStretchingTitle: "Mjuk stretching hemma",
  workoutStretchingDesc: "Helkroppsstretching på din matta. Fokus på höfter, rygg och axlar. Lindrande vid PMS-spänningar. Ingen utrustning behövs.",
  workoutFloorWorkTitle: "Golvstyrka",
  workoutFloorWorkDesc: "Höftlyft, benlyftar, clamshells och bird-dogs. Allt görs liggande på en matta hemma. Skonsamt men effektivt.",

  // ─── Warmups ──────────────────────────────────────────────────────────────
  warmupMenstrual: "5 minuters mjuka nackrullningar, axelcirklar och sittande höftöppnare. Rör dig långsamt och andas djupt.",
  warmupFollicular: "5 minuters dynamisk stretching: bensving, armcirklar, lätt jogging på stället. Få pulsen att stiga försiktigt.",
  warmupOvulation: "5 minuters snabba hampelmanhopp, höga knän och dynamiska utfall. Förbered kroppen för maximal insats.",
  warmupLuteal: "5 minuters långsam katt-ko-stretch, sidböjningar och mjuka bålvridningar. Låt kroppen komma igång gradvis.",

  // ─── Cooldowns ────────────────────────────────────────────────────────────
  cooldownMenstrual: "5 minuter i barnets ställning, sittande framåtfällning och djup magandning. Låt kroppen slappna av helt.",
  cooldownFollicular: "5 minuters hamstringsstretch, quadstretch och lätt foam rolling. Hjälp musklerna att återhämta sig snabbt.",
  cooldownOvulation: "5 minuters stående framåtfällning, fyra-stretch och långsam andning. Sänk pulsen gradvis.",
  cooldownLuteal: "5 minuter i liggande fjärilsställning, mjuk ryggvridning och fyrkantsandning. Lugna ner nervsystemet.",

  // ─── Phase tips ───────────────────────────────────────────────────────────
  tipMenstrual1: "Lyssna på din kropp — vilodagar är produktiva dagar",
  tipMenstrual2: "Fokusera på andningsövningar och mjuk rörelse",
  tipFollicular1: "Energin stiger — prova att lägga till fler repetitioner eller rundor",
  tipFollicular2: "Testa en ny kroppsviktsövning eller ett nytt flöde",
  tipFollicular3: "Kroppen återhämtar sig snabbare nu — bra tid att utmana dig själv",
  tipOvulation1: "Topp­prestation — kör hårdare med kroppsviktsövningar!",
  tipOvulation2: "Bra tid för längre hålltider och fler repetitioner",
  tipOvulation3: "Håll dig väl­hydrerad under intensiva hemmapass",
  tipLuteal1: "Energin sjunker gradvis",
  tipLuteal2: "Fokusera på teknik framför intensitet",
  tipLuteal3: "Yoga kan hjälpa mot PMS-symptom",

  // ─── Avoid lists ──────────────────────────────────────────────────────────
  avoidMenstrual1: "Högintensiv träning",
  avoidMenstrual2: "Intensiva kroppsviktspass",
  avoidMenstrual3: "Het yoga eller uppvärmda rum",
  avoidFollicular1: "Att skippa träning — utnyttja den stigande energin hemma",
  avoidOvulation1: "Att underträna — det här är ditt kraftfönster, även hemma!",
  avoidLuteal1: "Överträning",
  avoidLuteal2: "Att ignorera trötthets­signaler",

  // ─── Scan-aware adjustments ───────────────────────────────────────────────
  scanAdjustRestDay: "Din skanning visar mycket låg energi — en vilodag är bästa valet idag.",
  scanAdjustHighEnergy: "Din skanning visar hög energi — uppgraderat till ett mer intensivt pass!",
  scanAdjustHighStress: "Din skanning visar förhöjd stress — måttlig kardio hjälper utan att belasta ytterligare.",
  scanAdjustHighFatigue: "Din skanning visar hög trötthet — mjuk stretching rekommenderas idag.",

  // ─── Life-stage workout titles ────────────────────────────────────────────
  workoutPrenatalYogaTitle: "Gravidyoga",
  workoutPrenatalYogaDesc: "Mjuk yoga med fokus på bäckenbottenstyrka och andningsteknik. Säkert under alla trimestrar med anpassningar.",
  workoutPrenatalWalkTitle: "Gravidpromenad",
  workoutPrenatalWalkDesc: "En lugn 20-minuters promenad i bekvämt tempo. Håll dig hydrerad och undvik överhettning.",
  workoutPrenatalSwimTitle: "Gravsimning",
  workoutPrenatalSwimDesc: "Lågintensiv vattenträning som stödjer leder och avlastar tryck. Utmärkt under andra trimestern.",
  workoutPostpartumRecoveryTitle: "Efterfödsloåterhämtning",
  workoutPostpartumRecoveryDesc: "Mjuka bäckenbotten- och djupa magaktiverings­övningar. Börja återuppbygga din grund i din egen takt.",
  workoutPostpartumGentleTitle: "Mjuk efterfödslorörelse",
  workoutPostpartumGentleDesc: "Barnvänliga promenader och mjuk stretching. Ett lugnt sätt att komma tillbaka till rörelse efter förlossningen.",
  workoutPerimenopauseStrengthTitle: "Benstödjande kroppsvikt",
  workoutPerimenopauseStrengthDesc: "Viktbärande kroppsviktsövningar för att stödja bentäthet. Knäböj, utfall och stående pressar.",
  workoutPerimenopauseYogaTitle: "Svalkande yoga",
  workoutPerimenopauseYogaDesc: "Svalkande yogaställningar och framåtfällningar som kan lindra obehag vid värmevallningar. Lugn, jordad praktik.",
  workoutMenopauseBalanceTitle: "Balans och stabilitet",
  workoutMenopauseBalanceDesc: "Enbensstående, häl-tå-gång och stabilitetsövningar. Bygger självförtroende och hjälper till att förebygga fall.",
  workoutMenopauseWalkingTitle: "Rask promenad",
  workoutMenopauseWalkingDesc: "En 25-minuters rask promenad för att stödja hjärthälsan. Håll ett tempo där du fortfarande kan föra ett samtal.",

  // ─── Life-stage warmups ───────────────────────────────────────────────────
  warmupPregnancy: "5 minuters mjuka axelrullningar, sittande höftcirklar och djup diafragmaandning. Rör dig i din egen takt.",
  warmupPostpartum: "5 minuters mjuka nackstretchningar, handledsrullningar och sittande bäckenrörelser. Var snäll mot din kropp.",
  warmupPerimenopause: "5 minuters mjuka armsving, höftcirklar och lätt marsch på stället. Fokusera på att lossna upp.",
  warmupMenopause: "5 minuters sittande vristed, armlyft och mjuka bålvridningar. Värm upp varje led innan du rör dig.",

  // ─── Life-stage cooldowns ─────────────────────────────────────────────────
  cooldownPregnancy: "5 minuters sittande sidstretchning, mjuka nackrullningar och långsam djupandning. Håll dig bekväm hela tiden.",
  cooldownPostpartum: "5 minuters mjuk helkroppsstretching, djup andning och en stund av stillhet. Du förtjänar denna vila.",
  cooldownPerimenopause: "5 minuters framåtfällning, sittande vridning och svalkande andning (andas in genom näsan, ut genom munnen).",
  cooldownMenopause: "5 minuters mjuk sittande stretching, långsam andning och progressiv avslappning från tår till huvud.",

  // ─── Life-stage tips ──────────────────────────────────────────────────────
  tipPregnancy1: "Håll dig hydrerad före, under och efter rörelse",
  tipPregnancy2: "Undvik att ligga platt på rygg efter vecka 20",
  tipPregnancy3: "Lyssna på din kropp — sluta om något känns obehagligt",
  tipPostpartum1: "Börja lugnt — återhämtning tar tid och tålamod",
  tipPostpartum2: "Fokusera på bäckenbottenövningar innan du ökar intensiteten",
  tipPerimenopause1: "Viktbärande träning stödjer benhälsan under hormonella förändringar",
  tipPerimenopause2: "Svalkande yoga och andningsövningar kan hjälpa mot obehag vid värmevallningar",
  tipMenopause1: "Balansövningar bygger stabilitet och förebygger fall",
  tipMenopause2: "Regelbundna promenader stödjer hjärthälsan och humöret",

  // ─── Life-stage avoid lists ───────────────────────────────────────────────
  avoidPregnancy1: "Höga hopp eller stötiga rörelser",
  avoidPregnancy2: "Att ligga platt på rygg (efter vecka 20)",
  avoidPregnancy3: "Träning i extrem värme eller till överhettning",
  avoidPostpartum1: "Intensiv magträning tills du fått klartecken av vården",
  avoidPostpartum2: "Löpning eller högintensiv aktivitet (vänta vanligtvis 12+ veckor)",
  avoidPerimenopause1: "Träning i extrem värme",
  avoidPerimenopause2: "Att pressa dig genom utmattning — vila när du behöver",
  avoidMenopause1: "Högintensiva aktiviteter som belastar leder",
  avoidMenopause2: "Att skippa uppvärmningen — leder behöver extra förberedelse",

  // ─── Life-stage labels ────────────────────────────────────────────────────
  phasePregnancy: "Graviditet",
  phasePostpartum: "Efterfödslo",
  phasePerimenopause: "Perimenopaus",
  phaseMenopause: "Menopaus",

  // ─── Workout timer & exercises ───────────────────────────────────────────
  exercises: "Övningar",
  sets: "{n} set",
  reps: "{n} rep",
  restTime: "{n}s vila",
  currentExercise: "Övning {current} av {total}",
  currentSet: "Set {current} av {total}",
  resting: "Vila",
  pause: "Pausa",
  resume: "Fortsätt",
  endWorkout: "Avsluta träning",
  workoutComplete: "Träning klar!",
  totalTime: "Total tid",
  greatJob: "Bra jobbat! Du har slutfört din träning.",
  nextExercise: "Nästa",
  elapsed: "Förflutit",

  // ─── Misc labels ──────────────────────────────────────────────────────────
  scanAdjusted: "Skanningsjusterat",
  day: "Dag",
};

// ─────────────────────────────────────────────────────────────────────────────
// German (Deutsch)
// ─────────────────────────────────────────────────────────────────────────────
const de: Record<string, string> = {
  // ─── Section headers ──────────────────────────────────────────────────────
  title: "Heutiges Training",
  subtitle: "Zyklusgerechte Bewegung für deine Phase",
  primaryWorkout: "Empfohlen",
  alternative: "Alternative",
  duration: "{n} Min.",
  intensity: "Intensität",
  warmup: "Aufwärmen",
  cooldown: "Abkühlen",
  tips: "Phasen-Tipps",
  avoid: "Besser auslassen",
  startWorkout: "Training starten",
  completed: "Training abgeschlossen!",
  calories: "~{n} kcal",

  // ─── Intensity labels ─────────────────────────────────────────────────────
  rest: "Ruhe",
  light: "Leicht",
  moderate: "Moderat",
  intense: "Intensiv",

  // ─── Phase labels ─────────────────────────────────────────────────────────
  phaseMenstrual: "Menstruationsphase",
  phaseFollicular: "Follikelphase",
  phaseOvulation: "Ovulationsphase",
  phaseLuteal: "Lutealphase",

  // ─── Workout titles ───────────────────────────────────────────────────────
  workoutGentleYogaTitle: "Sanftes Yoga",
  workoutGentleYogaDesc: "Erholsames Dehnen und Atemübungen, um Verspannungen zu lösen und die Regeneration während der Periode zu unterstützen.",
  workoutLightWalkingTitle: "Leichter Spaziergang",
  workoutLightWalkingDesc: "Ein entspannter 20-Minuten-Spaziergang an der frischen Luft, um den Kreislauf in Schwung zu bringen, ohne dich zu überanstrengen.",
  workoutRestDayTitle: "Ruhetag",
  workoutRestDayDesc: "Dein Körper braucht heute Erholung. Konzentriere dich auf sanftes Atmen und ausreichend Flüssigkeit.",
  workoutBodyweightTitle: "Krafttraining mit Körpergewicht",
  workoutBodyweightDesc: "Keine Geräte nötig! Kniebeugen, Ausfallschritte, Liegestütze und Planks. Baue Kraft zu Hause nur mit deinem Körpergewicht auf.",
  workoutDanceCardioTitle: "Tanz-Cardio zu Hause",
  workoutDanceCardioDesc: "Leg deine Lieblingsmusik auf und bewege dich 25 Minuten lang. Egal welcher Stil — einfach weiterbewegen und Spaß haben!",
  workoutBodyweightHiitTitle: "HIIT mit Körpergewicht",
  workoutBodyweightHiitDesc: "25 Minuten Burpees, Mountain Climbers, Sprung-Kniebeugen und hohe Knie. 30 Sekunden Belastung, 30 Sekunden Pause. Keine Geräte nötig.",
  workoutPowerFlowTitle: "Power-Yoga-Flow",
  workoutPowerFlowDesc: "Ein fordernder Yoga-Flow mit Kriegerstellungen, Stuhlhaltung und Balancesequenzen. Stärkt Kraft und Flexibilität zu Hause.",
  workoutModBodyweightTitle: "Moderates Heimtraining",
  workoutModBodyweightDesc: "Ein ausgewogenes Heimtraining: Kniebeugen, Liegestütze, Glute Bridges und Planks. 3 Runden à 10 Wiederholungen. Gelenkschonend.",
  workoutPilatesTitle: "Pilates zu Hause",
  workoutPilatesDesc: "Mattenbasierte Rumpfarbeit mit kontrollierter Atmung. Fokus auf Beckenboden, Bauchmuskeln und Haltung. Nur eine Matte nötig.",
  workoutStretchingTitle: "Sanftes Dehnen zu Hause",
  workoutStretchingDesc: "Ganzkörper-Stretching auf der Matte. Fokus auf Hüfte, Rücken und Schultern. Wohltuend bei PMS-Beschwerden. Keine Geräte nötig.",
  workoutFloorWorkTitle: "Bodentraining",
  workoutFloorWorkDesc: "Glute Bridges, Beinheben, Clamshells und Vierfüßlerstand-Übungen. Alles im Liegen auf der Matte zu Hause. Sanft, aber effektiv.",

  // ─── Warmups ──────────────────────────────────────────────────────────────
  warmupMenstrual: "5 Minuten sanfte Nackenbewegungen, Schulterkreise und sitzende Hüftöffner. Bewege dich langsam und atme tief.",
  warmupFollicular: "5 Minuten dynamisches Dehnen: Beinschwünge, Armkreise, leichtes Joggen auf der Stelle. Lass deinen Puls sanft steigen.",
  warmupOvulation: "5 Minuten zügige Hampelmänner, hohe Knie und dynamische Ausfallschritte. Bereite deinen Körper auf Höchstleistung vor.",
  warmupLuteal: "5 Minuten langsame Katze-Kuh-Dehnungen, Seitneigungen und sanfte Rumpfdrehungen. Lass deinen Körper langsam in die Bewegung kommen.",

  // ─── Cooldowns ────────────────────────────────────────────────────────────
  cooldownMenstrual: "5 Minuten Kindshaltung, sitzende Vorbeuge und tiefe Bauchatmung. Lass deinen Körper vollständig entspannen.",
  cooldownFollicular: "5 Minuten Oberschenkelrückseiten-Dehnung, Quadrizeps-Dehnung und leichtes Faszienrollen. Hilf deinen Muskeln, sich schnell zu erholen.",
  cooldownOvulation: "5 Minuten stehende Vorbeuge, Vierer-Dehnung und langsames Atmen. Bring deinen Puls allmählich runter.",
  cooldownLuteal: "5 Minuten liegende Schmetterlingsstellung, sanfte Wirbelsäulendrehung und Kastenatmung. Beruhige dein Nervensystem.",

  // ─── Phase tips ───────────────────────────────────────────────────────────
  tipMenstrual1: "Höre auf deinen Körper — Ruhetage sind produktive Tage",
  tipMenstrual2: "Konzentriere dich auf Atemübungen und sanfte Bewegung",
  tipFollicular1: "Die Energie steigt — versuche mehr Wiederholungen oder Runden einzubauen",
  tipFollicular2: "Probiere eine neue Eigengewichtsübung oder einen neuen Flow aus",
  tipFollicular3: "Dein Körper erholt sich jetzt schneller — eine tolle Zeit, dich herauszufordern",
  tipOvulation1: "Leistungshoch — gib bei Eigengewichtsübungen Vollgas!",
  tipOvulation2: "Gute Zeit für längere Haltezeiten und mehr Wiederholungen",
  tipOvulation3: "Trinke ausreichend bei intensiven Heimtrainings",
  tipLuteal1: "Die Energie nimmt allmählich ab",
  tipLuteal2: "Fokus auf Technik statt Intensität",
  tipLuteal3: "Yoga kann bei PMS-Beschwerden helfen",

  // ─── Avoid lists ──────────────────────────────────────────────────────────
  avoidMenstrual1: "Hochintensives Training",
  avoidMenstrual2: "Intensive Eigengewichts-Zirkel",
  avoidMenstrual3: "Hot Yoga oder beheizte Räume",
  avoidFollicular1: "Training ausfallen lassen — nutze die steigende Energie zu Hause",
  avoidOvulation1: "Zu wenig trainieren — das ist dein Leistungsfenster, auch zu Hause!",
  avoidLuteal1: "Übertraining",
  avoidLuteal2: "Müdigkeitssignale ignorieren",

  // ─── Scan-aware adjustments ───────────────────────────────────────────────
  scanAdjustRestDay: "Dein Scan zeigt sehr niedrige Energie — ein Ruhetag ist heute die beste Wahl.",
  scanAdjustHighEnergy: "Dein Scan zeigt hohe Energie — Upgrade auf ein intensiveres Training!",
  scanAdjustHighStress: "Dein Scan zeigt erhöhten Stress — moderates Cardio hilft, ohne zusätzlich zu belasten.",
  scanAdjustHighFatigue: "Dein Scan zeigt hohe Erschöpfung — sanftes Dehnen wird heute empfohlen.",

  // ─── Life-stage workout titles ────────────────────────────────────────────
  workoutPrenatalYogaTitle: "Schwangerschaftsyoga",
  workoutPrenatalYogaDesc: "Sanftes Yoga mit Fokus auf Beckenbodenstärkung und Atemtechniken. Sicher in jedem Trimester mit Anpassungen.",
  workoutPrenatalWalkTitle: "Schwangerschaftsspaziergang",
  workoutPrenatalWalkDesc: "Ein gemütlicher 20-Minuten-Spaziergang in angenehmem Tempo. Bleib hydriert und vermeide Überhitzung.",
  workoutPrenatalSwimTitle: "Schwangerschaftsschwimmen",
  workoutPrenatalSwimDesc: "Gelenkschonendes Wassertraining, das die Gelenke stützt und Druck lindert. Ideal im zweiten Trimester.",
  workoutPostpartumRecoveryTitle: "Rückbildung",
  workoutPostpartumRecoveryDesc: "Sanfte Beckenboden- und tiefe Rumpfaktivierung. Beginne in deinem eigenen Tempo, deine Basis wieder aufzubauen.",
  workoutPostpartumGentleTitle: "Sanfte Wochenbettbewegung",
  workoutPostpartumGentleDesc: "Babytaugliche Spaziergänge und sanftes Dehnen. Ein ruhiger Weg, nach der Geburt wieder in Bewegung zu kommen.",
  workoutPerimenopauseStrengthTitle: "Knochenunterstützendes Eigengewicht",
  workoutPerimenopauseStrengthDesc: "Eigengewichtsübungen mit Belastung zur Unterstützung der Knochendichte. Kniebeugen, Ausfallschritte und Stehpressen.",
  workoutPerimenopauseYogaTitle: "Kühlendes Yoga",
  workoutPerimenopauseYogaDesc: "Kühlende Yoga-Haltungen und Vorbeugen, die bei Hitzewallungen helfen können. Ruhige, geerdete Praxis.",
  workoutMenopauseBalanceTitle: "Gleichgewicht & Stabilität",
  workoutMenopauseBalanceDesc: "Einbeinstand, Fersengang und Stabilitätsübungen. Stärkt das Selbstvertrauen und hilft, Stürze zu vermeiden.",
  workoutMenopauseWalkingTitle: "Zügiges Gehen",
  workoutMenopauseWalkingDesc: "Ein 25-minütiger zügiger Spaziergang zur Unterstützung der Herzgesundheit. Halte ein Tempo, bei dem du dich noch unterhalten kannst.",

  // ─── Life-stage warmups ───────────────────────────────────────────────────
  warmupPregnancy: "5 Minuten sanfte Schulterkreise, sitzende Hüftkreise und tiefe Zwerchfellatmung. Bewege dich in deinem eigenen Tempo.",
  warmupPostpartum: "5 Minuten sanfte Nackendehnungen, Handgelenkskreise und sitzende Beckenkippungen. Sei liebevoll zu deinem Körper.",
  warmupPerimenopause: "5 Minuten sanfte Armschwünge, Hüftkreise und leichtes Marschieren auf der Stelle. Fokus auf Lockerwerden.",
  warmupMenopause: "5 Minuten sitzende Fußgelenkskreise, Armstreckungen und sanfte Rumpfdrehungen. Wärme jedes Gelenk auf, bevor du loslegst.",

  // ─── Life-stage cooldowns ─────────────────────────────────────────────────
  cooldownPregnancy: "5 Minuten sitzende Seitdehnungen, sanfte Nackenbewegungen und langsames tiefes Atmen. Bleib durchgehend bequem.",
  cooldownPostpartum: "5 Minuten sanftes Ganzkörper-Dehnen, tiefes Atmen und ein Moment der Stille. Du hast dir diese Ruhe verdient.",
  cooldownPerimenopause: "5 Minuten Vorbeuge, sitzende Drehung und kühlende Atmung (durch die Nase ein, durch den Mund aus).",
  cooldownMenopause: "5 Minuten sanfte sitzende Dehnungen, langsames Atmen und progressive Entspannung von den Zehen bis zum Kopf.",

  // ─── Life-stage tips ──────────────────────────────────────────────────────
  tipPregnancy1: "Trinke ausreichend vor, während und nach der Bewegung",
  tipPregnancy2: "Vermeide flaches Liegen auf dem Rücken nach der 20. Woche",
  tipPregnancy3: "Höre auf deinen Körper — hör auf, wenn sich etwas unangenehm anfühlt",
  tipPostpartum1: "Beginne langsam — Erholung braucht Zeit und Geduld",
  tipPostpartum2: "Konzentriere dich auf Beckenbodenübungen, bevor du die Intensität steigerst",
  tipPerimenopause1: "Krafttraining mit Gewicht unterstützt die Knochengesundheit während hormoneller Veränderungen",
  tipPerimenopause2: "Kühlendes Yoga und Atemübungen können bei Hitzewallungen helfen",
  tipMenopause1: "Gleichgewichtsübungen stärken die Stabilität und beugen Stürzen vor",
  tipMenopause2: "Regelmäßiges Gehen unterstützt Herzgesundheit und Stimmung",

  // ─── Life-stage avoid lists ───────────────────────────────────────────────
  avoidPregnancy1: "Sprünge mit hohem Aufprall oder ruckartige Bewegungen",
  avoidPregnancy2: "Flach auf dem Rücken liegen (nach Woche 20)",
  avoidPregnancy3: "Training bei extremer Hitze oder bis zur Überhitzung",
  avoidPostpartum1: "Intensives Bauchmuskeltraining, bis vom Arzt freigegeben",
  avoidPostpartum2: "Laufen oder hochintensive Aktivitäten (in der Regel 12+ Wochen warten)",
  avoidPerimenopause1: "Training bei extremer Hitze",
  avoidPerimenopause2: "Durch Erschöpfung hindurchkämpfen — ruhe dich aus, wenn du es brauchst",
  avoidMenopause1: "Hochbelastende Aktivitäten, die die Gelenke beanspruchen",
  avoidMenopause2: "Das Aufwärmen auslassen — Gelenke brauchen extra Vorbereitung",

  // ─── Life-stage labels ────────────────────────────────────────────────────
  phasePregnancy: "Schwangerschaft",
  phasePostpartum: "Wochenbett",
  phasePerimenopause: "Perimenopause",
  phaseMenopause: "Menopause",

  // ─── Workout timer & exercises ───────────────────────────────────────────
  exercises: "Übungen",
  sets: "{n} Sätze",
  reps: "{n} Wdh.",
  restTime: "{n}s Pause",
  currentExercise: "Übung {current} von {total}",
  currentSet: "Satz {current} von {total}",
  resting: "Pause",
  pause: "Pause",
  resume: "Weiter",
  endWorkout: "Training beenden",
  workoutComplete: "Training abgeschlossen!",
  totalTime: "Gesamtzeit",
  greatJob: "Super gemacht! Du hast dein Training abgeschlossen.",
  nextExercise: "Weiter",
  elapsed: "Vergangen",

  // ─── Misc labels ──────────────────────────────────────────────────────────
  scanAdjusted: "Scan-angepasst",
  day: "Tag",
};

// ─────────────────────────────────────────────────────────────────────────────
// French (Français)
// ─────────────────────────────────────────────────────────────────────────────
const fr: Record<string, string> = {
  // ─── Section headers ──────────────────────────────────────────────────────
  title: "Entraînement du jour",
  subtitle: "Mouvement adapté à votre phase du cycle",
  primaryWorkout: "Recommandé",
  alternative: "Alternative",
  duration: "{n} min",
  intensity: "Intensité",
  warmup: "Échauffement",
  cooldown: "Retour au calme",
  tips: "Conseils de phase",
  avoid: "Mieux vaut éviter",
  startWorkout: "Commencer l'entraînement",
  completed: "Entraînement terminé !",
  calories: "~{n} cal",

  // ─── Intensity labels ─────────────────────────────────────────────────────
  rest: "Repos",
  light: "Léger",
  moderate: "Modéré",
  intense: "Intense",

  // ─── Phase labels ─────────────────────────────────────────────────────────
  phaseMenstrual: "Phase menstruelle",
  phaseFollicular: "Phase folliculaire",
  phaseOvulation: "Phase d'ovulation",
  phaseLuteal: "Phase lutéale",

  // ─── Workout titles ───────────────────────────────────────────────────────
  workoutGentleYogaTitle: "Yoga doux",
  workoutGentleYogaDesc: "Étirements restaurateurs et exercices de respiration pour soulager les tensions et favoriser la récupération pendant les règles.",
  workoutLightWalkingTitle: "Marche légère",
  workoutLightWalkingDesc: "Une promenade de 20 minutes en extérieur pour stimuler la circulation sans forcer.",
  workoutRestDayTitle: "Jour de repos",
  workoutRestDayDesc: "Votre corps a besoin de récupérer aujourd'hui. Concentrez-vous sur la respiration douce et l'hydratation.",
  workoutBodyweightTitle: "Renforcement au poids du corps",
  workoutBodyweightDesc: "Aucun équipement nécessaire ! Squats, fentes, pompes et planches. Renforcez-vous à la maison avec votre propre poids.",
  workoutDanceCardioTitle: "Danse cardio à la maison",
  workoutDanceCardioDesc: "Mettez votre musique préférée et bougez pendant 25 minutes. Tous les styles sont permis — continuez à bouger et amusez-vous !",
  workoutBodyweightHiitTitle: "HIIT au poids du corps",
  workoutBodyweightHiitDesc: "25 minutes de burpees, mountain climbers, squats sautés et montées de genoux. 30 secondes d'effort, 30 secondes de repos. Aucun équipement nécessaire.",
  workoutPowerFlowTitle: "Power yoga flow",
  workoutPowerFlowDesc: "Un enchaînement de yoga exigeant avec postures du guerrier, chaise et séquences d'équilibre. Développe force et souplesse à la maison.",
  workoutModBodyweightTitle: "Circuit modéré à la maison",
  workoutModBodyweightDesc: "Un circuit équilibré : squats, pompes, ponts fessiers et planches. 3 tours de 10 répétitions chacun. Doux pour les articulations.",
  workoutPilatesTitle: "Pilates à la maison",
  workoutPilatesDesc: "Travail au sol ciblant le centre du corps avec respiration contrôlée. Focus sur le plancher pelvien, les abdos et la posture. Un tapis suffit.",
  workoutStretchingTitle: "Étirements doux à la maison",
  workoutStretchingDesc: "Étirements complets sur votre tapis. Focus sur les hanches, le dos et les épaules. Apaisant pour les tensions liées au SPM. Aucun équipement nécessaire.",
  workoutFloorWorkTitle: "Renforcement au sol",
  workoutFloorWorkDesc: "Ponts fessiers, élévations de jambes, clamshells et bird-dogs. Tout se fait allongée sur un tapis. Doux mais efficace.",

  // ─── Warmups ──────────────────────────────────────────────────────────────
  warmupMenstrual: "5 minutes de rotations douces du cou, cercles d'épaules et ouvertures de hanches assises. Bougez lentement et respirez profondément.",
  warmupFollicular: "5 minutes d'étirements dynamiques : balancements de jambes, cercles de bras, jogging léger sur place. Laissez votre rythme cardiaque monter doucement.",
  warmupOvulation: "5 minutes de jumping jacks rapides, montées de genoux et fentes dynamiques. Préparez votre corps pour un effort maximal.",
  warmupLuteal: "5 minutes d'étirements lents chat-vache, inclinaisons latérales et torsions douces du buste. Glissez en douceur dans le mouvement.",

  // ─── Cooldowns ────────────────────────────────────────────────────────────
  cooldownMenstrual: "5 minutes en posture de l'enfant, flexion avant assise et respiration abdominale profonde. Laissez votre corps se détendre complètement.",
  cooldownFollicular: "5 minutes d'étirement des ischio-jambiers, des quadriceps et de rouleau de massage léger. Aidez vos muscles à récupérer rapidement.",
  cooldownOvulation: "5 minutes de flexion avant debout, étirement en quatre et respiration lente. Faites redescendre votre rythme cardiaque progressivement.",
  cooldownLuteal: "5 minutes en papillon couché, torsion douce de la colonne et respiration en carré. Calmez votre système nerveux.",

  // ─── Phase tips ───────────────────────────────────────────────────────────
  tipMenstrual1: "Écoutez votre corps — les jours de repos sont des jours productifs",
  tipMenstrual2: "Concentrez-vous sur la respiration et les mouvements doux",
  tipFollicular1: "L'énergie monte — essayez d'ajouter des répétitions ou des séries",
  tipFollicular2: "Essayez un nouvel exercice au poids du corps ou un nouveau flow",
  tipFollicular3: "Votre corps récupère plus vite maintenant — c'est le moment de vous challenger",
  tipOvulation1: "Pic de performance — poussez vos exercices au poids du corps !",
  tipOvulation2: "Bon moment pour des maintiens plus longs et plus de répétitions",
  tipOvulation3: "Restez bien hydratée pendant les entraînements intenses à la maison",
  tipLuteal1: "L'énergie diminue progressivement",
  tipLuteal2: "Privilégiez la technique plutôt que l'intensité",
  tipLuteal3: "Le yoga peut aider à soulager les symptômes du SPM",

  // ─── Avoid lists ──────────────────────────────────────────────────────────
  avoidMenstrual1: "Entraînement haute intensité",
  avoidMenstrual2: "Circuits intenses au poids du corps",
  avoidMenstrual3: "Hot yoga ou salles chauffées",
  avoidFollicular1: "Sauter les entraînements — profitez de l'énergie montante à la maison",
  avoidOvulation1: "Sous-entraînement — c'est votre fenêtre de puissance, même à la maison !",
  avoidLuteal1: "Surentraînement",
  avoidLuteal2: "Ignorer les signaux de fatigue",

  // ─── Scan-aware adjustments ───────────────────────────────────────────────
  scanAdjustRestDay: "Votre scan indique une énergie très basse — un jour de repos est le meilleur choix aujourd'hui.",
  scanAdjustHighEnergy: "Votre scan indique une énergie élevée — entraînement plus intense sélectionné !",
  scanAdjustHighStress: "Votre scan indique un stress élevé — le cardio modéré vous aidera sans ajouter de tension.",
  scanAdjustHighFatigue: "Votre scan indique une grande fatigue — des étirements doux sont recommandés aujourd'hui.",

  // ─── Life-stage workout titles ────────────────────────────────────────────
  workoutPrenatalYogaTitle: "Yoga prénatal",
  workoutPrenatalYogaDesc: "Yoga doux axé sur le renforcement du plancher pelvien et les techniques de respiration. Sûr à tous les trimestres avec des adaptations.",
  workoutPrenatalWalkTitle: "Marche prénatale",
  workoutPrenatalWalkDesc: "Une promenade de 20 minutes à un rythme confortable. Restez hydratée et évitez la surchauffe.",
  workoutPrenatalSwimTitle: "Natation prénatale",
  workoutPrenatalSwimDesc: "Exercice aquatique à faible impact qui soutient les articulations et soulage la pression. Idéal au deuxième trimestre.",
  workoutPostpartumRecoveryTitle: "Rééducation post-partum",
  workoutPostpartumRecoveryDesc: "Exercices doux d'activation du plancher pelvien et des muscles profonds. Reconstruisez vos fondations à votre rythme.",
  workoutPostpartumGentleTitle: "Mouvements doux post-partum",
  workoutPostpartumGentleDesc: "Promenades avec bébé et étirements doux. Une façon sereine de reprendre le mouvement après l'accouchement.",
  workoutPerimenopauseStrengthTitle: "Renforcement osseux au poids du corps",
  workoutPerimenopauseStrengthDesc: "Exercices en charge au poids du corps pour soutenir la densité osseuse. Squats, fentes et pressions debout.",
  workoutPerimenopauseYogaTitle: "Yoga rafraîchissant",
  workoutPerimenopauseYogaDesc: "Postures de yoga rafraîchissantes et flexions avant qui peuvent aider à soulager les bouffées de chaleur. Pratique calme et ancrée.",
  workoutMenopauseBalanceTitle: "Équilibre et stabilité",
  workoutMenopauseBalanceDesc: "Appui sur une jambe, marche talon-pointe et exercices de stabilité. Renforce la confiance et aide à prévenir les chutes.",
  workoutMenopauseWalkingTitle: "Marche rapide",
  workoutMenopauseWalkingDesc: "Une marche rapide de 25 minutes pour soutenir la santé cardiovasculaire. Maintenez un rythme qui vous permet encore de discuter.",

  // ─── Life-stage warmups ───────────────────────────────────────────────────
  warmupPregnancy: "5 minutes de rotations douces des épaules, cercles de hanches assis et respiration diaphragmatique profonde. Allez à votre rythme.",
  warmupPostpartum: "5 minutes d'étirements doux du cou, cercles de poignets et bascules pelviennes assises. Soyez bienveillante avec votre corps.",
  warmupPerimenopause: "5 minutes de balancements de bras, cercles de hanches et marche légère sur place. Concentrez-vous sur le relâchement.",
  warmupMenopause: "5 minutes de cercles de chevilles assis, extensions de bras et torsions douces du buste. Échauffez chaque articulation avant de bouger.",

  // ─── Life-stage cooldowns ─────────────────────────────────────────────────
  cooldownPregnancy: "5 minutes d'étirements latéraux assis, rotations douces du cou et respiration lente et profonde. Restez à l'aise tout au long.",
  cooldownPostpartum: "5 minutes d'étirements doux complets, respiration profonde et un moment de calme. Vous méritez ce repos.",
  cooldownPerimenopause: "5 minutes de flexion avant, torsion assise et respiration rafraîchissante (inspirer par le nez, expirer par la bouche).",
  cooldownMenopause: "5 minutes d'étirements doux assis, respiration lente et relaxation progressive des orteils à la tête.",

  // ─── Life-stage tips ──────────────────────────────────────────────────────
  tipPregnancy1: "Restez hydratée avant, pendant et après le mouvement",
  tipPregnancy2: "Évitez de vous allonger sur le dos après 20 semaines",
  tipPregnancy3: "Écoutez votre corps — arrêtez si quelque chose vous gêne",
  tipPostpartum1: "Commencez doucement — la récupération demande du temps et de la patience",
  tipPostpartum2: "Concentrez-vous sur les exercices du plancher pelvien avant d'augmenter l'intensité",
  tipPerimenopause1: "L'exercice en charge soutient la santé osseuse pendant les changements hormonaux",
  tipPerimenopause2: "Le yoga rafraîchissant et la respiration peuvent aider à soulager les bouffées de chaleur",
  tipMenopause1: "Les exercices d'équilibre renforcent la stabilité et préviennent les chutes",
  tipMenopause2: "La marche régulière soutient la santé cardiaque et l'humeur",

  // ─── Life-stage avoid lists ───────────────────────────────────────────────
  avoidPregnancy1: "Sauts à fort impact ou mouvements brusques",
  avoidPregnancy2: "S'allonger sur le dos (après la semaine 20)",
  avoidPregnancy3: "S'entraîner par chaleur extrême ou jusqu'à la surchauffe",
  avoidPostpartum1: "Travail abdominal intense avant l'accord de votre professionnel de santé",
  avoidPostpartum2: "Course ou activité haute intensité (attendre généralement 12+ semaines)",
  avoidPerimenopause1: "S'entraîner par chaleur extrême",
  avoidPerimenopause2: "Forcer malgré l'épuisement — reposez-vous quand vous en avez besoin",
  avoidMenopause1: "Activités à fort impact qui sollicitent les articulations",
  avoidMenopause2: "Sauter l'échauffement — les articulations ont besoin de plus de préparation",

  // ─── Life-stage labels ────────────────────────────────────────────────────
  phasePregnancy: "Grossesse",
  phasePostpartum: "Post-partum",
  phasePerimenopause: "Périménopause",
  phaseMenopause: "Ménopause",

  // ─── Workout timer & exercises ───────────────────────────────────────────
  exercises: "Exercices",
  sets: "{n} séries",
  reps: "{n} rép.",
  restTime: "{n}s repos",
  currentExercise: "Exercice {current} sur {total}",
  currentSet: "Série {current} sur {total}",
  resting: "Repos",
  pause: "Pause",
  resume: "Reprendre",
  endWorkout: "Terminer l'entraînement",
  workoutComplete: "Entraînement terminé !",
  totalTime: "Temps total",
  greatJob: "Bravo ! Vous avez terminé votre entraînement.",
  nextExercise: "Suivant",
  elapsed: "Écoulé",

  // ─── Misc labels ──────────────────────────────────────────────────────────
  scanAdjusted: "Ajusté par scan",
  day: "Jour",
};

// ─────────────────────────────────────────────────────────────────────────────
// Spanish (Español)
// ─────────────────────────────────────────────────────────────────────────────
const es: Record<string, string> = {
  // ─── Section headers ──────────────────────────────────────────────────────
  title: "Entrenamiento de hoy",
  subtitle: "Movimiento sincronizado con tu ciclo",
  primaryWorkout: "Recomendado",
  alternative: "Alternativa",
  duration: "{n} min",
  intensity: "Intensidad",
  warmup: "Calentamiento",
  cooldown: "Vuelta a la calma",
  tips: "Consejos de fase",
  avoid: "Mejor evitar",
  startWorkout: "Iniciar entrenamiento",
  completed: "¡Entrenamiento completo!",
  calories: "~{n} cal",

  // ─── Intensity labels ─────────────────────────────────────────────────────
  rest: "Descanso",
  light: "Ligero",
  moderate: "Moderado",
  intense: "Intenso",

  // ─── Phase labels ─────────────────────────────────────────────────────────
  phaseMenstrual: "Fase menstrual",
  phaseFollicular: "Fase folicular",
  phaseOvulation: "Fase de ovulación",
  phaseLuteal: "Fase lútea",

  // ─── Workout titles ───────────────────────────────────────────────────────
  workoutGentleYogaTitle: "Yoga suave",
  workoutGentleYogaDesc: "Estiramientos restaurativos y ejercicios de respiración para aliviar la tensión y apoyar la recuperación durante la menstruación.",
  workoutLightWalkingTitle: "Caminata ligera",
  workoutLightWalkingDesc: "Un paseo relajado de 20 minutos al aire libre para mejorar la circulación sin esforzarte demasiado.",
  workoutRestDayTitle: "Día de descanso",
  workoutRestDayDesc: "Tu cuerpo necesita recuperarse hoy. Concéntrate en respirar suavemente y mantenerte hidratada.",
  workoutBodyweightTitle: "Fuerza con peso corporal",
  workoutBodyweightDesc: "¡Sin equipamiento! Sentadillas, zancadas, flexiones y planchas. Gana fuerza en casa usando solo tu cuerpo.",
  workoutDanceCardioTitle: "Cardio-baile en casa",
  workoutDanceCardioDesc: "Pon tu música favorita y muévete durante 25 minutos. Cualquier estilo vale — ¡solo sigue moviéndote y diviértete!",
  workoutBodyweightHiitTitle: "HIIT con peso corporal",
  workoutBodyweightHiitDesc: "25 minutos de burpees, escaladores, sentadillas con salto y rodillas altas. 30 segundos de trabajo, 30 segundos de descanso. Sin equipamiento.",
  workoutPowerFlowTitle: "Power yoga flow",
  workoutPowerFlowDesc: "Un flujo de yoga exigente con posturas del guerrero, silla y secuencias de equilibrio. Desarrolla fuerza y flexibilidad en casa.",
  workoutModBodyweightTitle: "Circuito moderado en casa",
  workoutModBodyweightDesc: "Un circuito equilibrado: sentadillas, flexiones, puentes de glúteos y planchas. 3 rondas de 10 repeticiones. Suave con las articulaciones.",
  workoutPilatesTitle: "Pilates en casa",
  workoutPilatesDesc: "Trabajo de core en colchoneta con respiración controlada. Enfoque en suelo pélvico, abdominales y postura. Solo necesitas una esterilla.",
  workoutStretchingTitle: "Estiramientos suaves en casa",
  workoutStretchingDesc: "Estiramientos de cuerpo completo en tu esterilla. Enfoque en caderas, espalda y hombros. Reconfortante para la tensión del SPM. Sin equipamiento.",
  workoutFloorWorkTitle: "Trabajo de fuerza en suelo",
  workoutFloorWorkDesc: "Puentes de glúteos, elevaciones de pierna, clamshells y bird-dogs. Todo tumbada en la esterilla. Suave pero eficaz.",

  // ─── Warmups ──────────────────────────────────────────────────────────────
  warmupMenstrual: "5 minutos de rotaciones suaves de cuello, círculos de hombros y abridores de cadera sentada. Muévete despacio y respira profundamente.",
  warmupFollicular: "5 minutos de estiramientos dinámicos: balanceos de pierna, círculos de brazo, trote ligero en el sitio. Deja que tu ritmo cardíaco suba suavemente.",
  warmupOvulation: "5 minutos de jumping jacks rápidos, rodillas altas y zancadas dinámicas. Prepara tu cuerpo para el máximo esfuerzo.",
  warmupLuteal: "5 minutos de estiramientos lentos gato-vaca, inclinaciones laterales y giros suaves del torso. Deja que tu cuerpo entre en movimiento gradualmente.",

  // ─── Cooldowns ────────────────────────────────────────────────────────────
  cooldownMenstrual: "5 minutos de postura del niño, flexión sentada hacia delante y respiración abdominal profunda. Deja que tu cuerpo se relaje por completo.",
  cooldownFollicular: "5 minutos de estiramiento de isquiotibiales, cuádriceps y rodillo de espuma ligero. Ayuda a tus músculos a recuperarse rápido.",
  cooldownOvulation: "5 minutos de flexión hacia delante de pie, estiramiento en cuatro y respiración lenta. Baja tu ritmo cardíaco progresivamente.",
  cooldownLuteal: "5 minutos de mariposa tumbada, giro suave de columna y respiración cuadrada. Calma tu sistema nervioso.",

  // ─── Phase tips ───────────────────────────────────────────────────────────
  tipMenstrual1: "Escucha a tu cuerpo — los días de descanso son días productivos",
  tipMenstrual2: "Concéntrate en la respiración y el movimiento suave",
  tipFollicular1: "La energía está subiendo — intenta añadir más repeticiones o rondas",
  tipFollicular2: "Prueba un nuevo ejercicio con peso corporal o un nuevo flujo",
  tipFollicular3: "Tu cuerpo se recupera más rápido ahora — buen momento para desafiarte",
  tipOvulation1: "¡Ventana de máximo rendimiento — dale fuerte a los ejercicios con peso corporal!",
  tipOvulation2: "Buen momento para mantener más tiempo y más repeticiones",
  tipOvulation3: "Mantente bien hidratada durante los entrenamientos intensos en casa",
  tipLuteal1: "La energía disminuye gradualmente",
  tipLuteal2: "Prioriza la técnica sobre la intensidad",
  tipLuteal3: "El yoga puede ayudar con los síntomas del SPM",

  // ─── Avoid lists ──────────────────────────────────────────────────────────
  avoidMenstrual1: "Entrenamiento de alta intensidad",
  avoidMenstrual2: "Circuitos intensos con peso corporal",
  avoidMenstrual3: "Hot yoga o salas calefactadas",
  avoidFollicular1: "Saltarse los entrenamientos — aprovecha la energía creciente en casa",
  avoidOvulation1: "Entrenar poco — ¡esta es tu ventana de poder, incluso en casa!",
  avoidLuteal1: "Sobreentrenamiento",
  avoidLuteal2: "Ignorar las señales de fatiga",

  // ─── Scan-aware adjustments ───────────────────────────────────────────────
  scanAdjustRestDay: "Tu escaneo muestra energía muy baja — un día de descanso es la mejor opción hoy.",
  scanAdjustHighEnergy: "Tu escaneo muestra energía alta — ¡se ha seleccionado un entrenamiento más intenso!",
  scanAdjustHighStress: "Tu escaneo muestra estrés elevado — el cardio moderado te ayudará sin añadir tensión.",
  scanAdjustHighFatigue: "Tu escaneo muestra mucha fatiga — se recomiendan estiramientos suaves hoy.",

  // ─── Life-stage workout titles ────────────────────────────────────────────
  workoutPrenatalYogaTitle: "Yoga prenatal",
  workoutPrenatalYogaDesc: "Yoga suave centrado en el fortalecimiento del suelo pélvico y técnicas de respiración. Seguro en todos los trimestres con adaptaciones.",
  workoutPrenatalWalkTitle: "Caminata prenatal",
  workoutPrenatalWalkDesc: "Un paseo de 20 minutos a un ritmo cómodo. Mantente hidratada y evita el sobrecalentamiento.",
  workoutPrenatalSwimTitle: "Natación prenatal",
  workoutPrenatalSwimDesc: "Ejercicio acuático de bajo impacto que alivia la presión articular. Ideal para el segundo trimestre.",
  workoutPostpartumRecoveryTitle: "Recuperación posparto",
  workoutPostpartumRecoveryDesc: "Ejercicios suaves de activación del suelo pélvico y core profundo. Reconstruye tus bases a tu propio ritmo.",
  workoutPostpartumGentleTitle: "Movimiento suave posparto",
  workoutPostpartumGentleDesc: "Paseos con el bebé y estiramientos suaves. Una forma tranquila de retomar el movimiento tras el parto.",
  workoutPerimenopauseStrengthTitle: "Peso corporal para los huesos",
  workoutPerimenopauseStrengthDesc: "Ejercicios de carga con peso corporal para apoyar la densidad ósea. Sentadillas, zancadas y prensas de pie.",
  workoutPerimenopauseYogaTitle: "Yoga refrescante",
  workoutPerimenopauseYogaDesc: "Posturas de yoga refrescantes y flexiones hacia delante que pueden aliviar los sofocos. Práctica calmada y enraizada.",
  workoutMenopauseBalanceTitle: "Equilibrio y estabilidad",
  workoutMenopauseBalanceDesc: "Apoyo sobre una pierna, caminata talón-punta y ejercicios de estabilidad. Genera confianza y ayuda a prevenir caídas.",
  workoutMenopauseWalkingTitle: "Caminata rápida",
  workoutMenopauseWalkingDesc: "Una caminata rápida de 25 minutos para apoyar la salud cardiovascular. Mantén un ritmo que te permita conversar.",

  // ─── Life-stage warmups ───────────────────────────────────────────────────
  warmupPregnancy: "5 minutos de rotaciones suaves de hombros, círculos de cadera sentada y respiración diafragmática profunda. Ve a tu propio ritmo.",
  warmupPostpartum: "5 minutos de estiramientos suaves de cuello, círculos de muñeca e inclinaciones pélvicas sentada. Sé amable con tu cuerpo.",
  warmupPerimenopause: "5 minutos de balanceos de brazos, círculos de cadera y marcha ligera en el sitio. Concéntrate en soltar tensión.",
  warmupMenopause: "5 minutos de círculos de tobillo sentada, extensiones de brazo y giros suaves del torso. Calienta cada articulación antes de moverte.",

  // ─── Life-stage cooldowns ─────────────────────────────────────────────────
  cooldownPregnancy: "5 minutos de estiramientos laterales sentada, rotaciones suaves de cuello y respiración lenta y profunda. Mantente cómoda en todo momento.",
  cooldownPostpartum: "5 minutos de estiramientos suaves de cuerpo completo, respiración profunda y un momento de quietud. Mereces este descanso.",
  cooldownPerimenopause: "5 minutos de flexión hacia delante, giro sentada y respiración refrescante (inhala por la nariz, exhala por la boca).",
  cooldownMenopause: "5 minutos de estiramientos suaves sentada, respiración lenta y relajación progresiva de pies a cabeza.",

  // ─── Life-stage tips ──────────────────────────────────────────────────────
  tipPregnancy1: "Mantente hidratada antes, durante y después del movimiento",
  tipPregnancy2: "Evita tumbarte boca arriba después de la semana 20",
  tipPregnancy3: "Escucha a tu cuerpo — para si algo te resulta incómodo",
  tipPostpartum1: "Empieza despacio — la recuperación lleva tiempo y paciencia",
  tipPostpartum2: "Concéntrate en ejercicios de suelo pélvico antes de aumentar la intensidad",
  tipPerimenopause1: "El ejercicio con carga apoya la salud ósea durante los cambios hormonales",
  tipPerimenopause2: "El yoga refrescante y la respiración pueden aliviar las molestias de los sofocos",
  tipMenopause1: "Los ejercicios de equilibrio fortalecen la estabilidad y previenen caídas",
  tipMenopause2: "Caminar con regularidad apoya la salud del corazón y el ánimo",

  // ─── Life-stage avoid lists ───────────────────────────────────────────────
  avoidPregnancy1: "Saltos de alto impacto o movimientos bruscos",
  avoidPregnancy2: "Tumbarse boca arriba (después de la semana 20)",
  avoidPregnancy3: "Ejercicio con calor extremo o hasta el sobrecalentamiento",
  avoidPostpartum1: "Trabajo abdominal intenso sin autorización médica",
  avoidPostpartum2: "Correr o actividad de alto impacto (esperar normalmente 12+ semanas)",
  avoidPerimenopause1: "Ejercicio con calor extremo",
  avoidPerimenopause2: "Forzarte a pesar del agotamiento — descansa cuando lo necesites",
  avoidMenopause1: "Actividades de alto impacto que tensionan las articulaciones",
  avoidMenopause2: "Saltarse el calentamiento — las articulaciones necesitan preparación extra",

  // ─── Life-stage labels ────────────────────────────────────────────────────
  phasePregnancy: "Embarazo",
  phasePostpartum: "Posparto",
  phasePerimenopause: "Perimenopausia",
  phaseMenopause: "Menopausia",

  // ─── Workout timer & exercises ───────────────────────────────────────────
  exercises: "Ejercicios",
  sets: "{n} series",
  reps: "{n} reps",
  restTime: "{n}s descanso",
  currentExercise: "Ejercicio {current} de {total}",
  currentSet: "Serie {current} de {total}",
  resting: "Descanso",
  pause: "Pausa",
  resume: "Reanudar",
  endWorkout: "Terminar entrenamiento",
  workoutComplete: "¡Entrenamiento completo!",
  totalTime: "Tiempo total",
  greatJob: "¡Genial! Has completado tu entrenamiento.",
  nextExercise: "Siguiente",
  elapsed: "Transcurrido",

  // ─── Misc labels ──────────────────────────────────────────────────────────
  scanAdjusted: "Ajustado por escaneo",
  day: "Día",
};

// ─────────────────────────────────────────────────────────────────────────────
// Italian (Italiano)
// ─────────────────────────────────────────────────────────────────────────────
const it: Record<string, string> = {
  // ─── Section headers ──────────────────────────────────────────────────────
  title: "Allenamento di oggi",
  subtitle: "Movimento sincronizzato con il tuo ciclo",
  primaryWorkout: "Consigliato",
  alternative: "Alternativa",
  duration: "{n} min",
  intensity: "Intensità",
  warmup: "Riscaldamento",
  cooldown: "Defaticamento",
  tips: "Consigli di fase",
  avoid: "Meglio evitare",
  startWorkout: "Inizia allenamento",
  completed: "Allenamento completato!",
  calories: "~{n} cal",

  // ─── Intensity labels ─────────────────────────────────────────────────────
  rest: "Riposo",
  light: "Leggero",
  moderate: "Moderato",
  intense: "Intenso",

  // ─── Phase labels ─────────────────────────────────────────────────────────
  phaseMenstrual: "Fase mestruale",
  phaseFollicular: "Fase follicolare",
  phaseOvulation: "Fase ovulatoria",
  phaseLuteal: "Fase luteale",

  // ─── Workout titles ───────────────────────────────────────────────────────
  workoutGentleYogaTitle: "Yoga dolce",
  workoutGentleYogaDesc: "Stretching ristorativo e lavoro sul respiro per sciogliere le tensioni e favorire il recupero durante il ciclo.",
  workoutLightWalkingTitle: "Passeggiata leggera",
  workoutLightWalkingDesc: "Una passeggiata rilassata di 20 minuti all'aperto per migliorare la circolazione senza sforzarti troppo.",
  workoutRestDayTitle: "Giorno di riposo",
  workoutRestDayDesc: "Il tuo corpo ha bisogno di recuperare oggi. Concentrati su respirazione dolce e idratazione.",
  workoutBodyweightTitle: "Forza a corpo libero",
  workoutBodyweightDesc: "Nessuna attrezzatura necessaria! Squat, affondi, flessioni e plank. Costruisci forza a casa usando solo il tuo corpo.",
  workoutDanceCardioTitle: "Cardio-danza a casa",
  workoutDanceCardioDesc: "Metti la tua musica preferita e muoviti per 25 minuti. Qualsiasi stile va bene — continua a muoverti e divertiti!",
  workoutBodyweightHiitTitle: "HIIT a corpo libero",
  workoutBodyweightHiitDesc: "25 minuti di burpees, mountain climbers, squat jump e ginocchia alte. 30 secondi di lavoro, 30 secondi di riposo. Nessuna attrezzatura.",
  workoutPowerFlowTitle: "Power yoga flow",
  workoutPowerFlowDesc: "Un flusso di yoga impegnativo con posizioni del guerriero, sedia e sequenze di equilibrio. Sviluppa forza e flessibilità a casa.",
  workoutModBodyweightTitle: "Circuito moderato a casa",
  workoutModBodyweightDesc: "Un circuito equilibrato: squat, flessioni, ponti glutei e plank. 3 giri da 10 ripetizioni ciascuno. Delicato sulle articolazioni.",
  workoutPilatesTitle: "Pilates a casa",
  workoutPilatesDesc: "Lavoro sul core a tappetino con respirazione controllata. Focus su pavimento pelvico, addominali e postura. Serve solo un tappetino.",
  workoutStretchingTitle: "Stretching dolce a casa",
  workoutStretchingDesc: "Stretching di tutto il corpo sul tappetino. Focus su anche, schiena e spalle. Rilassante per le tensioni da SPM. Nessuna attrezzatura.",
  workoutFloorWorkTitle: "Lavoro di forza a terra",
  workoutFloorWorkDesc: "Ponti glutei, sollevamenti di gambe, clamshells e bird-dogs. Tutto sdraiata su un tappetino a casa. Dolce ma efficace.",

  // ─── Warmups ──────────────────────────────────────────────────────────────
  warmupMenstrual: "5 minuti di rotazioni dolci del collo, cerchi con le spalle e apertura delle anche da seduta. Muoviti lentamente e respira profondamente.",
  warmupFollicular: "5 minuti di stretching dinamico: oscillazioni delle gambe, cerchi con le braccia, corsa leggera sul posto. Lascia salire la frequenza cardiaca gradualmente.",
  warmupOvulation: "5 minuti di jumping jack rapidi, ginocchia alte e affondi dinamici. Prepara il tuo corpo per il massimo sforzo.",
  warmupLuteal: "5 minuti di stretching lento gatto-mucca, inclinazioni laterali e torsioni dolci del busto. Entra nel movimento gradualmente.",

  // ─── Cooldowns ────────────────────────────────────────────────────────────
  cooldownMenstrual: "5 minuti in posizione del bambino, piegamento in avanti da seduta e respirazione addominale profonda. Lascia il corpo rilassarsi completamente.",
  cooldownFollicular: "5 minuti di stretching per ischiocrurali, quadricipiti e rullo di schiuma leggero. Aiuta i muscoli a recuperare velocemente.",
  cooldownOvulation: "5 minuti di piegamento in avanti in piedi, stretching a quattro e respirazione lenta. Abbassa la frequenza cardiaca gradualmente.",
  cooldownLuteal: "5 minuti di farfalla sdraiata, torsione spinale dolce e respirazione quadrata. Calma il sistema nervoso.",

  // ─── Phase tips ───────────────────────────────────────────────────────────
  tipMenstrual1: "Ascolta il tuo corpo — i giorni di riposo sono giorni produttivi",
  tipMenstrual2: "Concentrati sugli esercizi di respirazione e il movimento dolce",
  tipFollicular1: "L'energia sta salendo — prova ad aggiungere più ripetizioni o giri",
  tipFollicular2: "Prova un nuovo esercizio a corpo libero o un nuovo flusso",
  tipFollicular3: "Il tuo corpo recupera più velocemente ora — ottimo momento per sfidarti",
  tipOvulation1: "Finestra di massima prestazione — dai il massimo con gli esercizi a corpo libero!",
  tipOvulation2: "Ottimo momento per tempi di tenuta più lunghi e più ripetizioni",
  tipOvulation3: "Mantieniti ben idratata durante gli allenamenti intensi a casa",
  tipLuteal1: "L'energia diminuisce gradualmente",
  tipLuteal2: "Dai priorità alla tecnica rispetto all'intensità",
  tipLuteal3: "Lo yoga può aiutare con i sintomi della SPM",

  // ─── Avoid lists ──────────────────────────────────────────────────────────
  avoidMenstrual1: "Allenamento ad alta intensità",
  avoidMenstrual2: "Circuiti intensi a corpo libero",
  avoidMenstrual3: "Hot yoga o stanze riscaldate",
  avoidFollicular1: "Saltare gli allenamenti — sfrutta l'energia crescente a casa",
  avoidOvulation1: "Allenarti poco — questa è la tua finestra di potenza, anche a casa!",
  avoidLuteal1: "Sovrallenamento",
  avoidLuteal2: "Ignorare i segnali di stanchezza",

  // ─── Scan-aware adjustments ───────────────────────────────────────────────
  scanAdjustRestDay: "La tua scansione mostra energia molto bassa — un giorno di riposo è la scelta migliore oggi.",
  scanAdjustHighEnergy: "La tua scansione mostra energia alta — selezionato un allenamento più intenso!",
  scanAdjustHighStress: "La tua scansione mostra stress elevato — il cardio moderato ti aiuterà senza aggiungere tensione.",
  scanAdjustHighFatigue: "La tua scansione mostra alta stanchezza — si consiglia stretching dolce oggi.",

  // ─── Life-stage workout titles ────────────────────────────────────────────
  workoutPrenatalYogaTitle: "Yoga prenatale",
  workoutPrenatalYogaDesc: "Yoga dolce incentrato sul rafforzamento del pavimento pelvico e tecniche di respirazione. Sicuro in ogni trimestre con adattamenti.",
  workoutPrenatalWalkTitle: "Passeggiata prenatale",
  workoutPrenatalWalkDesc: "Una passeggiata di 20 minuti a un ritmo confortevole. Mantieniti idratata ed evita il surriscaldamento.",
  workoutPrenatalSwimTitle: "Nuoto prenatale",
  workoutPrenatalSwimDesc: "Esercizio acquatico a basso impatto che sostiene le articolazioni e allevia la pressione. Ideale nel secondo trimestre.",
  workoutPostpartumRecoveryTitle: "Recupero post-parto",
  workoutPostpartumRecoveryDesc: "Esercizi dolci di attivazione del pavimento pelvico e del core profondo. Ricostruisci le tue basi al tuo ritmo.",
  workoutPostpartumGentleTitle: "Movimento dolce post-parto",
  workoutPostpartumGentleDesc: "Passeggiate con il bebè e stretching dolce. Un modo sereno per riprendere il movimento dopo il parto.",
  workoutPerimenopauseStrengthTitle: "Corpo libero per le ossa",
  workoutPerimenopauseStrengthDesc: "Esercizi a carico con peso corporeo per supportare la densità ossea. Squat, affondi e press in piedi.",
  workoutPerimenopauseYogaTitle: "Yoga rinfrescante",
  workoutPerimenopauseYogaDesc: "Posizioni yoga rinfrescanti e piegamenti in avanti che possono aiutare ad alleviare le vampate di calore. Pratica calma e radicata.",
  workoutMenopauseBalanceTitle: "Equilibrio e stabilità",
  workoutMenopauseBalanceDesc: "Appoggio su una gamba, camminata tallone-punta ed esercizi di stabilità. Costruisce fiducia e aiuta a prevenire le cadute.",
  workoutMenopauseWalkingTitle: "Camminata veloce",
  workoutMenopauseWalkingDesc: "Una camminata veloce di 25 minuti per supportare la salute cardiovascolare. Mantieni un ritmo che ti permetta di conversare.",

  // ─── Life-stage warmups ───────────────────────────────────────────────────
  warmupPregnancy: "5 minuti di rotazioni dolci delle spalle, cerchi di anca da seduta e respirazione diaframmatica profonda. Procedi al tuo ritmo.",
  warmupPostpartum: "5 minuti di stretching dolce del collo, cerchi dei polsi e inclinazioni pelviche da seduta. Sii gentile con il tuo corpo.",
  warmupPerimenopause: "5 minuti di oscillazioni dolci delle braccia, cerchi delle anche e marcia leggera sul posto. Concentrati sullo sciogliere le tensioni.",
  warmupMenopause: "5 minuti di cerchi delle caviglie da seduta, estensioni delle braccia e torsioni dolci del busto. Riscalda ogni articolazione prima di muoverti.",

  // ─── Life-stage cooldowns ─────────────────────────────────────────────────
  cooldownPregnancy: "5 minuti di stretching laterale da seduta, rotazioni dolci del collo e respirazione lenta e profonda. Resta comoda per tutto il tempo.",
  cooldownPostpartum: "5 minuti di stretching dolce completo, respirazione profonda e un momento di quiete. Meriti questo riposo.",
  cooldownPerimenopause: "5 minuti di piegamento in avanti, torsione da seduta e respirazione rinfrescante (inspira dal naso, espira dalla bocca).",
  cooldownMenopause: "5 minuti di stretching dolce da seduta, respirazione lenta e rilassamento progressivo dai piedi alla testa.",

  // ─── Life-stage tips ──────────────────────────────────────────────────────
  tipPregnancy1: "Mantieniti idratata prima, durante e dopo il movimento",
  tipPregnancy2: "Evita di sdraiarti sulla schiena dopo la settimana 20",
  tipPregnancy3: "Ascolta il tuo corpo — fermati se qualcosa ti causa disagio",
  tipPostpartum1: "Inizia piano — il recupero richiede tempo e pazienza",
  tipPostpartum2: "Concentrati sugli esercizi del pavimento pelvico prima di aumentare l'intensità",
  tipPerimenopause1: "L'esercizio con carico supporta la salute delle ossa durante i cambiamenti ormonali",
  tipPerimenopause2: "Yoga rinfrescante e lavoro sul respiro possono aiutare con le vampate di calore",
  tipMenopause1: "Gli esercizi di equilibrio rafforzano la stabilità e prevengono le cadute",
  tipMenopause2: "Camminare regolarmente supporta la salute del cuore e l'umore",

  // ─── Life-stage avoid lists ───────────────────────────────────────────────
  avoidPregnancy1: "Salti ad alto impatto o movimenti bruschi",
  avoidPregnancy2: "Sdraiarsi sulla schiena (dopo la settimana 20)",
  avoidPregnancy3: "Allenarsi con caldo estremo o fino al surriscaldamento",
  avoidPostpartum1: "Lavoro addominale intenso finché non si ha il via libera dal medico",
  avoidPostpartum2: "Corsa o attività ad alto impatto (di solito attendere 12+ settimane)",
  avoidPerimenopause1: "Allenarsi con caldo estremo",
  avoidPerimenopause2: "Forzarsi nonostante la stanchezza — riposa quando ne hai bisogno",
  avoidMenopause1: "Attività ad alto impatto che sollecitano le articolazioni",
  avoidMenopause2: "Saltare il riscaldamento — le articolazioni hanno bisogno di più preparazione",

  // ─── Life-stage labels ────────────────────────────────────────────────────
  phasePregnancy: "Gravidanza",
  phasePostpartum: "Post-parto",
  phasePerimenopause: "Perimenopausa",
  phaseMenopause: "Menopausa",

  // ─── Workout timer & exercises ───────────────────────────────────────────
  exercises: "Esercizi",
  sets: "{n} serie",
  reps: "{n} rip.",
  restTime: "{n}s riposo",
  currentExercise: "Esercizio {current} di {total}",
  currentSet: "Serie {current} di {total}",
  resting: "Riposo",
  pause: "Pausa",
  resume: "Riprendi",
  endWorkout: "Termina allenamento",
  workoutComplete: "Allenamento completato!",
  totalTime: "Tempo totale",
  greatJob: "Ottimo lavoro! Hai completato il tuo allenamento.",
  nextExercise: "Avanti",
  elapsed: "Trascorso",

  // ─── Misc labels ──────────────────────────────────────────────────────────
  scanAdjusted: "Adattato dalla scansione",
  day: "Giorno",
};

// ─────────────────────────────────────────────────────────────────────────────
// Dutch (Nederlands)
// ─────────────────────────────────────────────────────────────────────────────
const nl: Record<string, string> = {
  // ─── Section headers ──────────────────────────────────────────────────────
  title: "Training van vandaag",
  subtitle: "Cyclusafgestemde beweging voor jouw fase",
  primaryWorkout: "Aanbevolen",
  alternative: "Alternatief",
  duration: "{n} min",
  intensity: "Intensiteit",
  warmup: "Warming-up",
  cooldown: "Cooling-down",
  tips: "Fasetips",
  avoid: "Beter overslaan",
  startWorkout: "Start training",
  completed: "Training voltooid!",
  calories: "~{n} cal",

  // ─── Intensity labels ─────────────────────────────────────────────────────
  rest: "Rust",
  light: "Licht",
  moderate: "Matig",
  intense: "Intensief",

  // ─── Phase labels ─────────────────────────────────────────────────────────
  phaseMenstrual: "Menstruatiefase",
  phaseFollicular: "Folliculaire fase",
  phaseOvulation: "Ovulatiefase",
  phaseLuteal: "Luteale fase",

  // ─── Workout titles ───────────────────────────────────────────────────────
  workoutGentleYogaTitle: "Zachte yoga",
  workoutGentleYogaDesc: "Herstellende stretching en ademhalingsoefeningen om spanning te verminderen en herstel tijdens je menstruatie te ondersteunen.",
  workoutLightWalkingTitle: "Lichte wandeling",
  workoutLightWalkingDesc: "Een ontspannen wandeling van 20 minuten buiten om je bloedsomloop te stimuleren zonder je te overbelasten.",
  workoutRestDayTitle: "Rustdag",
  workoutRestDayDesc: "Je lichaam heeft vandaag herstel nodig. Richt je op rustige ademhaling en hydratatie.",
  workoutBodyweightTitle: "Krachttraining met lichaamsgewicht",
  workoutBodyweightDesc: "Geen materiaal nodig! Squats, lunges, push-ups en planks. Bouw kracht op thuis met alleen je eigen lichaamsgewicht.",
  workoutDanceCardioTitle: "Danscardio thuis",
  workoutDanceCardioDesc: "Zet je favoriete muziek op en beweeg 25 minuten lang. Elke stijl is goed — blijf gewoon bewegen en heb plezier!",
  workoutBodyweightHiitTitle: "HIIT met lichaamsgewicht",
  workoutBodyweightHiitDesc: "25 minuten burpees, mountain climbers, squat jumps en hoge knieën. 30 seconden aan, 30 seconden rust. Geen materiaal nodig.",
  workoutPowerFlowTitle: "Power yoga flow",
  workoutPowerFlowDesc: "Een uitdagende yogaflow met krijgerhoudingen, stoelhouding en balansoefeningen. Bouwt kracht en flexibiliteit op thuis.",
  workoutModBodyweightTitle: "Gematigd thuiscircuit",
  workoutModBodyweightDesc: "Een gebalanceerd thuiscircuit: squats, push-ups, glute bridges en planks. 3 rondes van 10 herhalingen. Zacht voor de gewrichten.",
  workoutPilatesTitle: "Pilates thuis",
  workoutPilatesDesc: "Matwerk gericht op de core met gecontroleerde ademhaling. Focus op bekkenbodem, buikspieren en houding. Alleen een mat nodig.",
  workoutStretchingTitle: "Zachte stretching thuis",
  workoutStretchingDesc: "Volledige lichaamsstretching op je mat. Focus op heupen, rug en schouders. Verzachtend bij PMS-spanning. Geen materiaal nodig.",
  workoutFloorWorkTitle: "Krachtoefeningen op de vloer",
  workoutFloorWorkDesc: "Glute bridges, beenliften, clamshells en bird-dogs. Alles liggend op een mat thuis. Zacht maar effectief.",

  // ─── Warmups ──────────────────────────────────────────────────────────────
  warmupMenstrual: "5 minuten zachte nekrollingen, schoudercirkels en zittende heupopeners. Beweeg langzaam en adem diep.",
  warmupFollicular: "5 minuten dynamische stretching: beenzwaaien, armcirkels, licht joggen op de plaats. Laat je hartslag geleidelijk stijgen.",
  warmupOvulation: "5 minuten snelle jumping jacks, hoge knieën en dynamische lunges. Bereid je lichaam voor op maximale inspanning.",
  warmupLuteal: "5 minuten langzame kat-koe stretches, zijwaartse buigingen en zachte rompdraaien. Laat je lichaam geleidelijk op gang komen.",

  // ─── Cooldowns ────────────────────────────────────────────────────────────
  cooldownMenstrual: "5 minuten kindhouding, zittende vooroverbuiging en diepe buikademhaling. Laat je lichaam volledig ontspannen.",
  cooldownFollicular: "5 minuten hamstring-stretch, quadriceps-stretch en licht foamrollen. Help je spieren snel te herstellen.",
  cooldownOvulation: "5 minuten staande vooroverbuiging, figuur-vier stretch en langzame ademhaling. Breng je hartslag geleidelijk omlaag.",
  cooldownLuteal: "5 minuten liggende vlinder, zachte werveldraaing en vierkante ademhaling. Kalmeer je zenuwstelsel.",

  // ─── Phase tips ───────────────────────────────────────────────────────────
  tipMenstrual1: "Luister naar je lichaam — rustdagen zijn productieve dagen",
  tipMenstrual2: "Richt je op ademhalingsoefeningen en zachte beweging",
  tipFollicular1: "Je energie stijgt — probeer meer herhalingen of rondes toe te voegen",
  tipFollicular2: "Probeer een nieuwe lichaamsgewichtoefening of flow",
  tipFollicular3: "Je lichaam herstelt nu sneller — een goed moment om jezelf uit te dagen",
  tipOvulation1: "Piekprestatie-venster — ga voluit met je lichaamsgewichtoefeningen!",
  tipOvulation2: "Goed moment voor langere houdtijden en meer herhalingen",
  tipOvulation3: "Blijf goed gehydrateerd tijdens intensieve thuistrainingen",
  tipLuteal1: "Je energie neemt geleidelijk af",
  tipLuteal2: "Focus op techniek boven intensiteit",
  tipLuteal3: "Yoga kan helpen bij PMS-klachten",

  // ─── Avoid lists ──────────────────────────────────────────────────────────
  avoidMenstrual1: "Training met hoge intensiteit",
  avoidMenstrual2: "Intensieve lichaamsgewichtcircuits",
  avoidMenstrual3: "Hot yoga of verwarmde ruimtes",
  avoidFollicular1: "Trainingen overslaan — benut je stijgende energie thuis",
  avoidOvulation1: "Te weinig trainen — dit is jouw krachtenvenster, ook thuis!",
  avoidLuteal1: "Overtraining",
  avoidLuteal2: "Vermoeidheidssignalen negeren",

  // ─── Scan-aware adjustments ───────────────────────────────────────────────
  scanAdjustRestDay: "Je scan toont zeer lage energie — een rustdag is vandaag de beste keuze.",
  scanAdjustHighEnergy: "Je scan toont hoge energie — geüpgraded naar een intensievere training!",
  scanAdjustHighStress: "Je scan toont verhoogde stress — matige cardio helpt zonder extra belasting.",
  scanAdjustHighFatigue: "Je scan toont hoge vermoeidheid — zachte stretching wordt vandaag aanbevolen.",

  // ─── Life-stage workout titles ────────────────────────────────────────────
  workoutPrenatalYogaTitle: "Prenatale yoga",
  workoutPrenatalYogaDesc: "Zachte yoga gericht op bekkenbodemkracht en ademhalingstechnieken. Veilig in elk trimester met aanpassingen.",
  workoutPrenatalWalkTitle: "Prenatale wandeling",
  workoutPrenatalWalkDesc: "Een rustige wandeling van 20 minuten in een comfortabel tempo. Blijf gehydrateerd en voorkom oververhitting.",
  workoutPrenatalSwimTitle: "Prenataal zwemmen",
  workoutPrenatalSwimDesc: "Low-impact watertraining die gewrichten ondersteunt en druk verlicht. Ideaal in het tweede trimester.",
  workoutPostpartumRecoveryTitle: "Postpartum herstel",
  workoutPostpartumRecoveryDesc: "Zachte bekkenbdem- en diepe core-activatie oefeningen. Begin je basis te herstellen in je eigen tempo.",
  workoutPostpartumGentleTitle: "Zachte postpartum beweging",
  workoutPostpartumGentleDesc: "Babyvriendelijke wandelingen en zachte stretches. Een rustige manier om na de bevalling weer te gaan bewegen.",
  workoutPerimenopauseStrengthTitle: "Botondersteunend lichaamsgewicht",
  workoutPerimenopauseStrengthDesc: "Belastende lichaamsgewichtoefeningen ter ondersteuning van botdichtheid. Squats, lunges en staande presses.",
  workoutPerimenopauseYogaTitle: "Verkoelende yoga",
  workoutPerimenopauseYogaDesc: "Verkoelende yogahoudingen en vooroverbuigingen die kunnen helpen bij opvliegers. Kalme, geaarde beoefening.",
  workoutMenopauseBalanceTitle: "Balans en stabiliteit",
  workoutMenopauseBalanceDesc: "Op één been staan, hiel-teenlopen en stabiliteitsoefeningen. Bouwt vertrouwen op en helpt valincidenten te voorkomen.",
  workoutMenopauseWalkingTitle: "Stevig wandelen",
  workoutMenopauseWalkingDesc: "Een stevige wandeling van 25 minuten ter ondersteuning van de cardiovasculaire gezondheid. Houd een tempo aan waarbij je nog kunt praten.",

  // ─── Life-stage warmups ───────────────────────────────────────────────────
  warmupPregnancy: "5 minuten zachte schouderrollingen, zittende heupcirkels en diepe middenrifademhaling. Beweeg op je eigen tempo.",
  warmupPostpartum: "5 minuten zachte nekstretches, polscirkels en zittende bekkenkantelingen. Wees lief voor je lichaam.",
  warmupPerimenopause: "5 minuten zachte armzwaaien, heupcirkels en licht marcheren op de plaats. Focus op losser worden.",
  warmupMenopause: "5 minuten zittende enkelcirkels, armreikingen en zachte rompdraaien. Warm elk gewricht op voor je gaat bewegen.",

  // ─── Life-stage cooldowns ─────────────────────────────────────────────────
  cooldownPregnancy: "5 minuten zittende zijwaartse stretches, zachte nekrollingen en langzame diepe ademhaling. Blijf comfortabel.",
  cooldownPostpartum: "5 minuten zachte volledige lichaamsstretches, diepe ademhaling en een moment van stilte. Je verdient deze rust.",
  cooldownPerimenopause: "5 minuten vooroverbuiging, zittende draai en verkoelende ademhaling (inademen door de neus, uitademen door de mond).",
  cooldownMenopause: "5 minuten zachte zittende stretches, langzame ademhaling en progressieve ontspanning van tenen tot hoofd.",

  // ─── Life-stage tips ──────────────────────────────────────────────────────
  tipPregnancy1: "Blijf gehydrateerd voor, tijdens en na het bewegen",
  tipPregnancy2: "Vermijd plat op je rug liggen na week 20",
  tipPregnancy3: "Luister naar je lichaam — stop als iets oncomfortabel voelt",
  tipPostpartum1: "Begin rustig — herstel kost tijd en geduld",
  tipPostpartum2: "Richt je op bekkenbodemoefeningen voor je de intensiteit verhoogt",
  tipPerimenopause1: "Belastende oefeningen ondersteunen de botgezondheid tijdens hormonale veranderingen",
  tipPerimenopause2: "Verkoelende yoga en ademhalingsoefeningen kunnen helpen bij opvliegers",
  tipMenopause1: "Balansoefeningen versterken de stabiliteit en voorkomen vallen",
  tipMenopause2: "Regelmatig wandelen ondersteunt de hartgezondheid en stemming",

  // ─── Life-stage avoid lists ───────────────────────────────────────────────
  avoidPregnancy1: "High-impact sprongen of schokkerige bewegingen",
  avoidPregnancy2: "Plat op je rug liggen (na week 20)",
  avoidPregnancy3: "Sporten bij extreme hitte of tot oververhitting",
  avoidPostpartum1: "Intensief buikspierwerk tot je arts toestemming geeft",
  avoidPostpartum2: "Hardlopen of high-impact activiteit (meestal 12+ weken wachten)",
  avoidPerimenopause1: "Sporten bij extreme hitte",
  avoidPerimenopause2: "Door uitputting heen drukken — rust wanneer je het nodig hebt",
  avoidMenopause1: "High-impact activiteiten die gewrichten belasten",
  avoidMenopause2: "De warming-up overslaan — gewrichten hebben extra voorbereiding nodig",

  // ─── Life-stage labels ────────────────────────────────────────────────────
  phasePregnancy: "Zwangerschap",
  phasePostpartum: "Postpartum",
  phasePerimenopause: "Perimenopauze",
  phaseMenopause: "Menopauze",

  // ─── Workout timer & exercises ───────────────────────────────────────────
  exercises: "Oefeningen",
  sets: "{n} sets",
  reps: "{n} herh.",
  restTime: "{n}s rust",
  currentExercise: "Oefening {current} van {total}",
  currentSet: "Set {current} van {total}",
  resting: "Rust",
  pause: "Pauzeer",
  resume: "Hervat",
  endWorkout: "Training beëindigen",
  workoutComplete: "Training voltooid!",
  totalTime: "Totale tijd",
  greatJob: "Goed gedaan! Je hebt je training afgerond.",
  nextExercise: "Volgende",
  elapsed: "Verstreken",

  // ─── Misc labels ──────────────────────────────────────────────────────────
  scanAdjusted: "Scan-aangepast",
  day: "Dag",
};

// ─────────────────────────────────────────────────────────────────────────────
// Polish (Polski)
// ─────────────────────────────────────────────────────────────────────────────
const pl: Record<string, string> = {
  // ─── Section headers ──────────────────────────────────────────────────────
  title: "Dzisiejszy trening",
  subtitle: "Ruch dopasowany do fazy cyklu",
  primaryWorkout: "Zalecany",
  alternative: "Alternatywa",
  duration: "{n} min",
  intensity: "Intensywność",
  warmup: "Rozgrzewka",
  cooldown: "Schładzanie",
  tips: "Porady na tę fazę",
  avoid: "Lepiej odpuścić",
  startWorkout: "Rozpocznij trening",
  completed: "Trening ukończony!",
  calories: "~{n} kcal",

  // ─── Intensity labels ─────────────────────────────────────────────────────
  rest: "Odpoczynek",
  light: "Lekka",
  moderate: "Umiarkowana",
  intense: "Intensywna",

  // ─── Phase labels ─────────────────────────────────────────────────────────
  phaseMenstrual: "Faza menstruacyjna",
  phaseFollicular: "Faza folikularna",
  phaseOvulation: "Faza owulacyjna",
  phaseLuteal: "Faza lutealna",

  // ─── Workout titles ───────────────────────────────────────────────────────
  workoutGentleYogaTitle: "Łagodna joga",
  workoutGentleYogaDesc: "Regenerujący stretching i ćwiczenia oddechowe, aby złagodzić napięcie i wspomóc regenerację podczas okresu.",
  workoutLightWalkingTitle: "Lekki spacer",
  workoutLightWalkingDesc: "Spokojny 20-minutowy spacer na świeżym powietrzu, by poprawić krążenie bez nadmiernego wysiłku.",
  workoutRestDayTitle: "Dzień odpoczynku",
  workoutRestDayDesc: "Twoje ciało potrzebuje dziś regeneracji. Skup się na spokojnym oddychaniu i nawadnianiu.",
  workoutBodyweightTitle: "Siła z własnym ciałem",
  workoutBodyweightDesc: "Bez sprzętu! Przysiady, wykroki, pompki i plank. Buduj siłę w domu, używając tylko własnego ciała.",
  workoutDanceCardioTitle: "Cardio taneczne w domu",
  workoutDanceCardioDesc: "Włącz ulubioną muzykę i ruszaj się przez 25 minut. Każdy styl jest dobry — po prostu się ruszaj i baw się!",
  workoutBodyweightHiitTitle: "HIIT z własnym ciałem",
  workoutBodyweightHiitDesc: "25 minut burpees, mountain climbers, przysiady z wyskokiem i wysokie kolana. 30 sekund pracy, 30 sekund odpoczynku. Bez sprzętu.",
  workoutPowerFlowTitle: "Power yoga flow",
  workoutPowerFlowDesc: "Wymagający flow jogi z pozycjami wojownika, krzesłem i sekwencjami równowagi. Buduje siłę i elastyczność w domu.",
  workoutModBodyweightTitle: "Umiarkowany obwód domowy",
  workoutModBodyweightDesc: "Zbalansowany obwód domowy: przysiady, pompki, mostek, plank. 3 rundy po 10 powtórzeń. Łagodny dla stawów.",
  workoutPilatesTitle: "Pilates w domu",
  workoutPilatesDesc: "Praca na macie skupiona na centrum z kontrolowanym oddechem. Skupienie na dnie miednicy, brzuchu i postawie. Potrzebna tylko mata.",
  workoutStretchingTitle: "Łagodny stretching w domu",
  workoutStretchingDesc: "Stretching całego ciała na macie. Skupienie na biodrach, plecach i barkach. Kojący przy napięciu PMS. Bez sprzętu.",
  workoutFloorWorkTitle: "Trening siłowy na podłodze",
  workoutFloorWorkDesc: "Mostek, unoszenie nóg, clamshells i bird-dogs. Wszystko leżąc na macie w domu. Łagodne, ale skuteczne.",

  // ─── Warmups ──────────────────────────────────────────────────────────────
  warmupMenstrual: "5 minut łagodnych obrotów szyi, kółek ramionami i otwierania bioder w siadzie. Poruszaj się powoli i oddychaj głęboko.",
  warmupFollicular: "5 minut dynamicznego stretchingu: wahania nóg, kółka ramionami, lekki jogging w miejscu. Pozwól pulsowi delikatnie rosnąć.",
  warmupOvulation: "5 minut szybkich pajacyków, wysokich kolan i dynamicznych wykroków. Przygotuj ciało na maksymalny wysiłek.",
  warmupLuteal: "5 minut powolnego kociego grzbietu, skłonów bocznych i łagodnych skrętów tułowia. Wprowadź ciało w ruch stopniowo.",

  // ─── Cooldowns ────────────────────────────────────────────────────────────
  cooldownMenstrual: "5 minut pozycji dziecka, skłonu w siadzie i głębokiego oddychania brzusznego. Pozwól ciału w pełni się zrelaksować.",
  cooldownFollicular: "5 minut rozciągania mięśni kulszowo-goleniowych, czworogłowych i lekkiego rolowania. Pomóż mięśniom szybko się zregenerować.",
  cooldownOvulation: "5 minut skłonu w staniu, rozciągania w czwórkę i wolnego oddychania. Stopniowo obniż tętno.",
  cooldownLuteal: "5 minut motyla na plecach, łagodnego skrętu kręgosłupa i oddychania kwadratowego. Uspokój układ nerwowy.",

  // ─── Phase tips ───────────────────────────────────────────────────────────
  tipMenstrual1: "Słuchaj swojego ciała — dni odpoczynku to produktywne dni",
  tipMenstrual2: "Skup się na ćwiczeniach oddechowych i łagodnym ruchu",
  tipFollicular1: "Energia rośnie — spróbuj dodać więcej powtórzeń lub rund",
  tipFollicular2: "Wypróbuj nowe ćwiczenie z własnym ciałem lub nowy flow",
  tipFollicular3: "Twoje ciało regeneruje się teraz szybciej — świetny moment, by się wyzwać",
  tipOvulation1: "Szczyt wydajności — daj z siebie wszystko w ćwiczeniach z własnym ciałem!",
  tipOvulation2: "Dobry czas na dłuższe utrzymanie pozycji i więcej powtórzeń",
  tipOvulation3: "Nawadniaj się podczas intensywnych treningów domowych",
  tipLuteal1: "Energia stopniowo spada",
  tipLuteal2: "Stawiaj na technikę, nie na intensywność",
  tipLuteal3: "Joga może pomóc z objawami PMS",

  // ─── Avoid lists ──────────────────────────────────────────────────────────
  avoidMenstrual1: "Trening o wysokiej intensywności",
  avoidMenstrual2: "Intensywne obwody z własnym ciałem",
  avoidMenstrual3: "Gorąca joga lub nagrzane pomieszczenia",
  avoidFollicular1: "Opuszczanie treningów — wykorzystaj rosnącą energię w domu",
  avoidOvulation1: "Za mało treningu — to twoje okno mocy, nawet w domu!",
  avoidLuteal1: "Przetrenowanie",
  avoidLuteal2: "Ignorowanie sygnałów zmęczenia",

  // ─── Scan-aware adjustments ───────────────────────────────────────────────
  scanAdjustRestDay: "Twój skan wskazuje bardzo niską energię — dzień odpoczynku to najlepszy wybór na dziś.",
  scanAdjustHighEnergy: "Twój skan wskazuje wysoką energię — ulepszono do bardziej intensywnego treningu!",
  scanAdjustHighStress: "Twój skan wskazuje podwyższony stres — umiarkowane cardio pomoże bez dodatkowego obciążenia.",
  scanAdjustHighFatigue: "Twój skan wskazuje duże zmęczenie — łagodny stretching jest dziś zalecany.",

  // ─── Life-stage workout titles ────────────────────────────────────────────
  workoutPrenatalYogaTitle: "Joga prenatalna",
  workoutPrenatalYogaDesc: "Łagodna joga skupiona na sile dna miednicy i technikach oddechowych. Bezpieczna w każdym trymestrze z modyfikacjami.",
  workoutPrenatalWalkTitle: "Spacer prenatalny",
  workoutPrenatalWalkDesc: "Spokojny 20-minutowy spacer w wygodnym tempie. Nawadniaj się i unikaj przegrzania.",
  workoutPrenatalSwimTitle: "Pływanie prenatalne",
  workoutPrenatalSwimDesc: "Ćwiczenia w wodzie o niskim obciążeniu, które wspierają stawy i łagodzą ucisk. Świetne w drugim trymestrze.",
  workoutPostpartumRecoveryTitle: "Regeneracja poporodowa",
  workoutPostpartumRecoveryDesc: "Łagodne ćwiczenia aktywacji dna miednicy i głębokich mięśni centrum. Odbudowuj podstawy we własnym tempie.",
  workoutPostpartumGentleTitle: "Łagodny ruch poporodowy",
  workoutPostpartumGentleDesc: "Spacery z dzieckiem i łagodny stretching. Spokojny sposób na powrót do ruchu po porodzie.",
  workoutPerimenopauseStrengthTitle: "Wspieranie kości z własnym ciałem",
  workoutPerimenopauseStrengthDesc: "Obciążeniowe ćwiczenia z masą ciała wspierające gęstość kości. Przysiady, wykroki i wyciskanie na stojąco.",
  workoutPerimenopauseYogaTitle: "Chłodząca joga",
  workoutPerimenopauseYogaDesc: "Chłodzące pozycje jogi i skłony do przodu, które mogą pomóc złagodzić uderzenia gorąca. Spokojna, ugruntowana praktyka.",
  workoutMenopauseBalanceTitle: "Równowaga i stabilność",
  workoutMenopauseBalanceDesc: "Stanie na jednej nodze, chodzenie pięta-palce i ćwiczenia stabilizujące. Buduje pewność siebie i zapobiega upadkom.",
  workoutMenopauseWalkingTitle: "Szybki marsz",
  workoutMenopauseWalkingDesc: "25-minutowy szybki marsz wspierający zdrowie układu krążenia. Utrzymuj tempo, przy którym możesz jeszcze rozmawiać.",

  // ─── Life-stage warmups ───────────────────────────────────────────────────
  warmupPregnancy: "5 minut łagodnych kółek ramionami, kółek biodrami w siadzie i głębokiego oddychania przeponowego. Poruszaj się we własnym tempie.",
  warmupPostpartum: "5 minut łagodnego rozciągania szyi, kółek nadgarstkami i przechyłów miednicy w siadzie. Bądź dla siebie łagodna.",
  warmupPerimenopause: "5 minut łagodnych wahań ramionami, kółek biodrami i lekkiego marszu w miejscu. Skup się na rozluźnieniu.",
  warmupMenopause: "5 minut kółek kostkami w siadzie, sięgania ramionami i łagodnych skrętów tułowia. Rozgrzej każdy staw przed ruchem.",

  // ─── Life-stage cooldowns ─────────────────────────────────────────────────
  cooldownPregnancy: "5 minut bocznego rozciągania w siadzie, łagodnych obrotów szyi i wolnego głębokiego oddychania. Utrzymuj komfort.",
  cooldownPostpartum: "5 minut łagodnego rozciągania całego ciała, głębokiego oddychania i chwili ciszy. Zasługujesz na ten odpoczynek.",
  cooldownPerimenopause: "5 minut skłonu do przodu, skrętu w siadzie i chłodzącego oddechu (wdech nosem, wydech ustami).",
  cooldownMenopause: "5 minut łagodnego rozciągania w siadzie, wolnego oddychania i progresywnego rozluźniania od palców stóp do głowy.",

  // ─── Life-stage tips ──────────────────────────────────────────────────────
  tipPregnancy1: "Nawadniaj się przed, w trakcie i po ruchu",
  tipPregnancy2: "Unikaj leżenia na plecach po 20. tygodniu",
  tipPregnancy3: "Słuchaj swojego ciała — przerwij, jeśli coś sprawia dyskomfort",
  tipPostpartum1: "Zacznij powoli — regeneracja wymaga czasu i cierpliwości",
  tipPostpartum2: "Skup się na ćwiczeniach dna miednicy przed zwiększeniem intensywności",
  tipPerimenopause1: "Ćwiczenia obciążeniowe wspierają zdrowie kości podczas zmian hormonalnych",
  tipPerimenopause2: "Chłodząca joga i ćwiczenia oddechowe mogą pomóc przy uderzeniach gorąca",
  tipMenopause1: "Ćwiczenia równowagi budują stabilność i zapobiegają upadkom",
  tipMenopause2: "Regularne spacery wspierają zdrowie serca i nastrój",

  // ─── Life-stage avoid lists ───────────────────────────────────────────────
  avoidPregnancy1: "Skoki o dużym obciążeniu lub gwałtowne ruchy",
  avoidPregnancy2: "Leżenie na plecach (po 20. tygodniu)",
  avoidPregnancy3: "Ćwiczenia w ekstremalnym upale lub do przegrzania",
  avoidPostpartum1: "Intensywna praca na brzuch bez zgody lekarza",
  avoidPostpartum2: "Bieganie lub aktywność o dużym obciążeniu (zazwyczaj czekaj 12+ tygodni)",
  avoidPerimenopause1: "Ćwiczenia w ekstremalnym upale",
  avoidPerimenopause2: "Forsowanie się mimo wyczerpania — odpoczywaj, kiedy potrzebujesz",
  avoidMenopause1: "Aktywności o dużym obciążeniu obciążające stawy",
  avoidMenopause2: "Pomijanie rozgrzewki — stawy potrzebują dodatkowego przygotowania",

  // ─── Life-stage labels ────────────────────────────────────────────────────
  phasePregnancy: "Ciąża",
  phasePostpartum: "Połóg",
  phasePerimenopause: "Perimenopauza",
  phaseMenopause: "Menopauza",

  // ─── Workout timer & exercises ───────────────────────────────────────────
  exercises: "Ćwiczenia",
  sets: "{n} serie",
  reps: "{n} powt.",
  restTime: "{n}s odpoczynku",
  currentExercise: "Ćwiczenie {current} z {total}",
  currentSet: "Seria {current} z {total}",
  resting: "Odpoczynek",
  pause: "Pauza",
  resume: "Wznów",
  endWorkout: "Zakończ trening",
  workoutComplete: "Trening ukończony!",
  totalTime: "Łączny czas",
  greatJob: "Świetna robota! Ukończyłaś trening.",
  nextExercise: "Dalej",
  elapsed: "Upłynęło",

  // ─── Misc labels ──────────────────────────────────────────────────────────
  scanAdjusted: "Dopasowane skanem",
  day: "Dzień",
};

// ─────────────────────────────────────────────────────────────────────────────
// Portuguese (Português)
// ─────────────────────────────────────────────────────────────────────────────
const pt: Record<string, string> = {
  // ─── Section headers ──────────────────────────────────────────────────────
  title: "Treino de hoje",
  subtitle: "Movimento sincronizado com a sua fase do ciclo",
  primaryWorkout: "Recomendado",
  alternative: "Alternativa",
  duration: "{n} min",
  intensity: "Intensidade",
  warmup: "Aquecimento",
  cooldown: "Retorno à calma",
  tips: "Dicas da fase",
  avoid: "Melhor evitar",
  startWorkout: "Iniciar treino",
  completed: "Treino concluído!",
  calories: "~{n} cal",

  // ─── Intensity labels ─────────────────────────────────────────────────────
  rest: "Descanso",
  light: "Leve",
  moderate: "Moderado",
  intense: "Intenso",

  // ─── Phase labels ─────────────────────────────────────────────────────────
  phaseMenstrual: "Fase menstrual",
  phaseFollicular: "Fase folicular",
  phaseOvulation: "Fase de ovulação",
  phaseLuteal: "Fase lútea",

  // ─── Workout titles ───────────────────────────────────────────────────────
  workoutGentleYogaTitle: "Yoga suave",
  workoutGentleYogaDesc: "Alongamentos restaurativos e exercícios de respiração para aliviar a tensão e apoiar a recuperação durante a menstruação.",
  workoutLightWalkingTitle: "Caminhada leve",
  workoutLightWalkingDesc: "Uma caminhada ao ar livre de 20 minutos para melhorar a circulação sem se sobrecarregar.",
  workoutRestDayTitle: "Dia de descanso",
  workoutRestDayDesc: "O seu corpo precisa de recuperar hoje. Concentre-se na respiração calma e na hidratação.",
  workoutBodyweightTitle: "Força com peso corporal",
  workoutBodyweightDesc: "Sem equipamento! Agachamentos, avanços, flexões e pranchas. Ganhe força em casa usando apenas o seu corpo.",
  workoutDanceCardioTitle: "Cardio-dança em casa",
  workoutDanceCardioDesc: "Ponha a sua música favorita e mexa-se durante 25 minutos. Qualquer estilo serve — continue a mexer-se e divirta-se!",
  workoutBodyweightHiitTitle: "HIIT com peso corporal",
  workoutBodyweightHiitDesc: "25 minutos de burpees, mountain climbers, agachamentos com salto e joelhos altos. 30 segundos de trabalho, 30 segundos de descanso. Sem equipamento.",
  workoutPowerFlowTitle: "Power yoga flow",
  workoutPowerFlowDesc: "Um fluxo de yoga desafiante com posturas de guerreiro, cadeira e sequências de equilíbrio. Desenvolve força e flexibilidade em casa.",
  workoutModBodyweightTitle: "Circuito moderado em casa",
  workoutModBodyweightDesc: "Um circuito equilibrado: agachamentos, flexões, pontes de glúteos e pranchas. 3 rondas de 10 repetições. Suave para as articulações.",
  workoutPilatesTitle: "Pilates em casa",
  workoutPilatesDesc: "Trabalho no tapete focado no core com respiração controlada. Foco no pavimento pélvico, abdominais e postura. Só precisa de um tapete.",
  workoutStretchingTitle: "Alongamentos suaves em casa",
  workoutStretchingDesc: "Alongamento de corpo inteiro no tapete. Foco nas ancas, costas e ombros. Calmante para a tensão do SPM. Sem equipamento.",
  workoutFloorWorkTitle: "Trabalho de força no chão",
  workoutFloorWorkDesc: "Pontes de glúteos, elevações de pernas, clamshells e bird-dogs. Tudo deitada num tapete em casa. Suave mas eficaz.",

  // ─── Warmups ──────────────────────────────────────────────────────────────
  warmupMenstrual: "5 minutos de rotações suaves do pescoço, círculos com os ombros e abridores de ancas sentada. Mova-se devagar e respire profundamente.",
  warmupFollicular: "5 minutos de alongamento dinâmico: balanços de pernas, círculos com os braços, corrida leve no lugar. Deixe a frequência cardíaca subir suavemente.",
  warmupOvulation: "5 minutos de jumping jacks rápidos, joelhos altos e avanços dinâmicos. Prepare o corpo para o esforço máximo.",
  warmupLuteal: "5 minutos de alongamento lento gato-vaca, inclinações laterais e rotações suaves do tronco. Entre no movimento gradualmente.",

  // ─── Cooldowns ────────────────────────────────────────────────────────────
  cooldownMenstrual: "5 minutos de postura da criança, flexão sentada e respiração abdominal profunda. Deixe o corpo relaxar completamente.",
  cooldownFollicular: "5 minutos de alongamento dos isquiotibiais, quadríceps e rolo de espuma leve. Ajude os músculos a recuperar rapidamente.",
  cooldownOvulation: "5 minutos de flexão em pé, alongamento em quatro e respiração lenta. Baixe a frequência cardíaca progressivamente.",
  cooldownLuteal: "5 minutos de borboleta deitada, torção suave da coluna e respiração quadrada. Acalme o sistema nervoso.",

  // ─── Phase tips ───────────────────────────────────────────────────────────
  tipMenstrual1: "Ouça o seu corpo — os dias de descanso são dias produtivos",
  tipMenstrual2: "Concentre-se em exercícios de respiração e movimento suave",
  tipFollicular1: "A energia está a subir — tente adicionar mais repetições ou rondas",
  tipFollicular2: "Experimente um novo exercício com peso corporal ou um novo fluxo",
  tipFollicular3: "O seu corpo recupera mais rápido agora — boa altura para se desafiar",
  tipOvulation1: "Janela de desempenho máximo — dê tudo nos exercícios com peso corporal!",
  tipOvulation2: "Boa altura para manter posições mais tempo e mais repetições",
  tipOvulation3: "Mantenha-se bem hidratada durante treinos intensos em casa",
  tipLuteal1: "A energia diminui gradualmente",
  tipLuteal2: "Dê prioridade à técnica em vez da intensidade",
  tipLuteal3: "O yoga pode ajudar com os sintomas de SPM",

  // ─── Avoid lists ──────────────────────────────────────────────────────────
  avoidMenstrual1: "Treino de alta intensidade",
  avoidMenstrual2: "Circuitos intensos com peso corporal",
  avoidMenstrual3: "Hot yoga ou salas aquecidas",
  avoidFollicular1: "Saltar treinos — aproveite a energia crescente em casa",
  avoidOvulation1: "Treinar pouco — esta é a sua janela de poder, mesmo em casa!",
  avoidLuteal1: "Sobretreino",
  avoidLuteal2: "Ignorar os sinais de fadiga",

  // ─── Scan-aware adjustments ───────────────────────────────────────────────
  scanAdjustRestDay: "A sua leitura mostra energia muito baixa — um dia de descanso é a melhor escolha hoje.",
  scanAdjustHighEnergy: "A sua leitura mostra energia alta — treino mais intenso selecionado!",
  scanAdjustHighStress: "A sua leitura mostra stress elevado — o cardio moderado vai ajudar sem acrescentar tensão.",
  scanAdjustHighFatigue: "A sua leitura mostra fadiga elevada — alongamentos suaves são recomendados hoje.",

  // ─── Life-stage workout titles ────────────────────────────────────────────
  workoutPrenatalYogaTitle: "Yoga pré-natal",
  workoutPrenatalYogaDesc: "Yoga suave focado no fortalecimento do pavimento pélvico e técnicas de respiração. Seguro em todos os trimestres com adaptações.",
  workoutPrenatalWalkTitle: "Caminhada pré-natal",
  workoutPrenatalWalkDesc: "Uma caminhada de 20 minutos a um ritmo confortável. Mantenha-se hidratada e evite o sobreaquecimento.",
  workoutPrenatalSwimTitle: "Natação pré-natal",
  workoutPrenatalSwimDesc: "Exercício aquático de baixo impacto que apoia as articulações e alivia a pressão. Ideal no segundo trimestre.",
  workoutPostpartumRecoveryTitle: "Recuperação pós-parto",
  workoutPostpartumRecoveryDesc: "Exercícios suaves de ativação do pavimento pélvico e do core profundo. Reconstrua a sua base ao seu ritmo.",
  workoutPostpartumGentleTitle: "Movimento suave pós-parto",
  workoutPostpartumGentleDesc: "Passeios com o bebé e alongamentos suaves. Uma forma tranquila de retomar o movimento após o parto.",
  workoutPerimenopauseStrengthTitle: "Peso corporal para os ossos",
  workoutPerimenopauseStrengthDesc: "Exercícios de carga com peso corporal para apoiar a densidade óssea. Agachamentos, avanços e pressões em pé.",
  workoutPerimenopauseYogaTitle: "Yoga refrescante",
  workoutPerimenopauseYogaDesc: "Posturas de yoga refrescantes e flexões para a frente que podem ajudar a aliviar os afrontamentos. Prática calma e enraizada.",
  workoutMenopauseBalanceTitle: "Equilíbrio e estabilidade",
  workoutMenopauseBalanceDesc: "Apoio numa perna, caminhada calcanhar-ponta e exercícios de estabilidade. Gera confiança e ajuda a prevenir quedas.",
  workoutMenopauseWalkingTitle: "Caminhada rápida",
  workoutMenopauseWalkingDesc: "Uma caminhada rápida de 25 minutos para apoiar a saúde cardiovascular. Mantenha um ritmo que lhe permita conversar.",

  // ─── Life-stage warmups ───────────────────────────────────────────────────
  warmupPregnancy: "5 minutos de rotações suaves dos ombros, círculos de ancas sentada e respiração diafragmática profunda. Vá ao seu ritmo.",
  warmupPostpartum: "5 minutos de alongamentos suaves do pescoço, círculos de pulsos e inclinações pélvicas sentada. Seja gentil com o seu corpo.",
  warmupPerimenopause: "5 minutos de balanços de braços suaves, círculos de ancas e marcha leve no lugar. Concentre-se em soltar a tensão.",
  warmupMenopause: "5 minutos de círculos de tornozelos sentada, extensões de braços e rotações suaves do tronco. Aqueça cada articulação antes de se mexer.",

  // ─── Life-stage cooldowns ─────────────────────────────────────────────────
  cooldownPregnancy: "5 minutos de alongamentos laterais sentada, rotações suaves do pescoço e respiração lenta e profunda. Mantenha-se confortável.",
  cooldownPostpartum: "5 minutos de alongamentos suaves de corpo inteiro, respiração profunda e um momento de quietude. Merece este descanso.",
  cooldownPerimenopause: "5 minutos de flexão para a frente, torção sentada e respiração refrescante (inspirar pelo nariz, expirar pela boca).",
  cooldownMenopause: "5 minutos de alongamentos suaves sentada, respiração lenta e relaxamento progressivo dos pés à cabeça.",

  // ─── Life-stage tips ──────────────────────────────────────────────────────
  tipPregnancy1: "Mantenha-se hidratada antes, durante e após o movimento",
  tipPregnancy2: "Evite deitar-se de costas após a semana 20",
  tipPregnancy3: "Ouça o seu corpo — pare se algo for desconfortável",
  tipPostpartum1: "Comece devagar — a recuperação leva tempo e paciência",
  tipPostpartum2: "Concentre-se em exercícios do pavimento pélvico antes de aumentar a intensidade",
  tipPerimenopause1: "O exercício de carga apoia a saúde óssea durante as alterações hormonais",
  tipPerimenopause2: "Yoga refrescante e respiração podem ajudar a aliviar os afrontamentos",
  tipMenopause1: "Os exercícios de equilíbrio reforçam a estabilidade e previnem quedas",
  tipMenopause2: "Caminhar regularmente apoia a saúde do coração e o humor",

  // ─── Life-stage avoid lists ───────────────────────────────────────────────
  avoidPregnancy1: "Saltos de alto impacto ou movimentos bruscos",
  avoidPregnancy2: "Deitar-se de costas (após a semana 20)",
  avoidPregnancy3: "Exercício com calor extremo ou até ao sobreaquecimento",
  avoidPostpartum1: "Trabalho abdominal intenso sem autorização do profissional de saúde",
  avoidPostpartum2: "Corrida ou atividade de alto impacto (geralmente esperar 12+ semanas)",
  avoidPerimenopause1: "Exercício com calor extremo",
  avoidPerimenopause2: "Forçar-se apesar da exaustão — descanse quando precisar",
  avoidMenopause1: "Atividades de alto impacto que sobrecarreguem as articulações",
  avoidMenopause2: "Saltar o aquecimento — as articulações precisam de preparação extra",

  // ─── Life-stage labels ────────────────────────────────────────────────────
  phasePregnancy: "Gravidez",
  phasePostpartum: "Pós-parto",
  phasePerimenopause: "Perimenopausa",
  phaseMenopause: "Menopausa",

  // ─── Workout timer & exercises ───────────────────────────────────────────
  exercises: "Exercícios",
  sets: "{n} séries",
  reps: "{n} reps",
  restTime: "{n}s descanso",
  currentExercise: "Exercício {current} de {total}",
  currentSet: "Série {current} de {total}",
  resting: "Descanso",
  pause: "Pausa",
  resume: "Retomar",
  endWorkout: "Terminar treino",
  workoutComplete: "Treino concluído!",
  totalTime: "Tempo total",
  greatJob: "Excelente! Completou o seu treino.",
  nextExercise: "Seguinte",
  elapsed: "Decorrido",

  // ─── Misc labels ──────────────────────────────────────────────────────────
  scanAdjusted: "Ajustado pela leitura",
  day: "Dia",
};

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────
export const trainingTranslations: Record<Language, Record<string, string>> = {
  en, sv, de, fr, es, it, nl, pl, pt,
};

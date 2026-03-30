import { CyclePhase, DailyCheckIn, ScanResult } from "@/types";
import { Language } from "@/constants/translations";

type MarkerType = 'stress' | 'energy' | 'recovery' | 'hydration' | 'inflammation' | 'fatigue' | 
  'cognitiveSharpness' | 'emotionalSensitivity' | 'socialEnergy' | 'moodVolatility' |
  'dehydrationTendency' | 'inflammatoryStress' | 'pupilSize' | 'symmetry' |
  'scleraYellowness' | 'underEyeDarkness' | 'eyeOpenness' | 'tearFilmQuality';

interface AffectItem {
  text: string;
  isActiveToday: boolean;
}

interface MarkerInfo {
  title: string;
  whatWeMeasure: string;
  whatAffects: AffectItem[];
  howToImprove: string[];
  phaseContext: string;
  hasActiveFactors: boolean;
}

type L = Record<Language, string>;

const g = (lang: Language, s: L): string => s[lang] || s.en;

const stressData = {
  title: {
    en: "Stress Score", sv: "Stressresultat", de: "Stresswert", fr: "Score de stress",
    es: "Puntuación de estrés", it: "Punteggio stress", nl: "Stressscore", pl: "Wynik stresu", pt: "Pontuação de stress",
  } as L,
  whatWeMeasure: {
    en: "We analyze your eye photo for pupil dark-to-light ratio, tear film reflection quality, brightness, and under-eye appearance, and combine this with your daily check-in responses (stress level, sleep) and cycle phase to estimate your current stress tendency.",
    sv: "Vi analyserar ditt ögonfoto för pupillens mörker-till-ljus-förhållande, tårfilmsreflektion, ljusstyrka och utseendet under ögonen, och kombinerar detta med dina dagliga incheckningssvar (stressnivå, sömn) och cykelfas för att uppskatta din nuvarande stresstendens.",
    de: "Wir analysieren Ihr Augenfoto auf Pupillen-Dunkel-Hell-Verhältnis, Tränenfilm-Reflexionsqualität, Helligkeit und Erscheinung unter den Augen und kombinieren dies mit Ihren Check-in-Antworten (Stresslevel, Schlaf) und Zyklusphase.",
    fr: "Nous analysons votre photo oculaire pour le rapport pupillaire, la qualité de réflexion du film lacrymal, la luminosité et l'apparence sous les yeux, combinés avec vos réponses quotidiennes et phase du cycle.",
    es: "Analizamos tu foto ocular para la proporción pupilar, calidad de reflexión lagrimal, brillo y apariencia bajo los ojos, combinados con tus respuestas diarias y fase del ciclo.",
    it: "Analizziamo la tua foto oculare per il rapporto pupillare, qualità di riflessione del film lacrimale, luminosità e aspetto sotto gli occhi, combinati con le tue risposte giornaliere e fase del ciclo.",
    nl: "We analyseren je oogfoto op pupilverhouding, traanfilmreflectie, helderheid en het uiterlijk onder de ogen, gecombineerd met je check-in-antwoorden en cyclusfase.",
    pl: "Analizujemy zdjęcie oka pod kątem stosunku źrenicy, jakości odbicia filmu łzowego, jasności i wyglądu pod oczami, w połączeniu z odpowiedziami z check-in i fazą cyklu.",
    pt: "Analisamos a foto do olho para proporção pupilar, qualidade de reflexão do filme lacrimal, brilho e aparência sob os olhos, combinados com as suas respostas diárias e fase do ciclo.",
  } as L,
  whatAffects: {
    sleep: {
      en: "Sleep quality and duration", sv: "Sömnkvalitet och varaktighet", de: "Schlafqualität und -dauer", fr: "Qualité et durée du sommeil",
      es: "Calidad y duración del sueño", it: "Qualità e durata del sonno", nl: "Slaapkwaliteit en -duur", pl: "Jakość i długość snu", pt: "Qualidade e duração do sono",
    } as L,
    activity: {
      en: "Physical activity and overtraining", sv: "Fysisk aktivitet och överträning", de: "Körperliche Aktivität und Übertraining", fr: "Activité physique et surentraînement",
      es: "Actividad física y sobreentrenamiento", it: "Attività fisica e sovrallenamento", nl: "Fysieke activiteit en overtraining", pl: "Aktywność fizyczna i przetrenowanie", pt: "Atividade física e excesso de treino",
    } as L,
    emotional: {
      en: "Emotional stressors and anxiety", sv: "Emotionella stressfaktorer och ångest", de: "Emotionale Stressfaktoren und Angst", fr: "Facteurs de stress émotionnels et anxiété",
      es: "Factores de estrés emocional y ansiedad", it: "Fattori di stress emotivo e ansia", nl: "Emotionele stressoren en angst", pl: "Stresory emocjonalne i lęk", pt: "Fatores de stress emocional e ansiedade",
    } as L,
    caffeine: {
      en: "Caffeine and stimulant intake", sv: "Koffein- och stimulantintag", de: "Koffein- und Stimulanzienaufnahme", fr: "Consommation de caféine et de stimulants",
      es: "Consumo de cafeína y estimulantes", it: "Assunzione di caffeina e stimolanti", nl: "Cafeïne- en stimulantinname", pl: "Spożycie kofeiny i stymulantów", pt: "Consumo de cafeína e estimulantes",
    } as L,
    hormones: {
      en: "Hormone fluctuations during your cycle", sv: "Hormonfluktuationer under din cykel", de: "Hormonschwankungen während Ihres Zyklus", fr: "Fluctuations hormonales pendant votre cycle",
      es: "Fluctuaciones hormonales durante tu ciclo", it: "Fluttuazioni ormonali durante il ciclo", nl: "Hormoonschommelingen tijdens je cyclus", pl: "Wahania hormonalne podczas cyklu", pt: "Flutuações hormonais durante o seu ciclo",
    } as L,
    illness: {
      en: "Being unwell or fighting illness", sv: "Att vara sjuk eller bekämpa sjukdom", de: "Krank sein oder Krankheit bekämpfen", fr: "Être malade ou lutter contre une maladie",
      es: "Estar enfermo o luchar contra una enfermedad", it: "Essere malato o combattere una malattia", nl: "Ziek zijn of ziekte bestrijden", pl: "Choroba lub walka z infekcją", pt: "Estar doente ou combater uma doença",
    } as L,
  },
  howToImprove: [
    {
      en: "Practice deep breathing or meditation for 10 minutes daily", sv: "Öva djupandning eller meditation i 10 minuter dagligen", de: "Üben Sie täglich 10 Minuten tiefes Atmen oder Meditation", fr: "Pratiquez la respiration profonde ou la méditation 10 minutes par jour",
      es: "Practica respiración profunda o meditación 10 minutos al día", it: "Pratica la respirazione profonda o la meditazione per 10 minuti al giorno", nl: "Oefen dagelijks 10 minuten diepe ademhaling of meditatie", pl: "Ćwicz głębokie oddychanie lub medytację przez 10 minut dziennie", pt: "Pratique respiração profunda ou meditação durante 10 minutos diários",
    } as L,
    {
      en: "Prioritize 7-9 hours of quality sleep", sv: "Prioritera 7-9 timmars kvalitetssömn", de: "Priorisieren Sie 7-9 Stunden Qualitätsschlaf", fr: "Priorisez 7 à 9 heures de sommeil de qualité",
      es: "Prioriza 7-9 horas de sueño de calidad", it: "Dai priorità a 7-9 ore di sonno di qualità", nl: "Geef prioriteit aan 7-9 uur kwaliteitsslaap", pl: "Priorytetowo traktuj 7-9 godzin dobrego snu", pt: "Priorize 7-9 horas de sono de qualidade",
    } as L,
    {
      en: "Reduce caffeine intake, especially in the afternoon", sv: "Minska koffeinintaget, särskilt på eftermiddagen", de: "Reduzieren Sie die Koffeinaufnahme, besonders nachmittags", fr: "Réduisez la caféine, surtout l'après-midi",
      es: "Reduce el consumo de cafeína, especialmente por la tarde", it: "Riduci l'assunzione di caffeina, specialmente nel pomeriggio", nl: "Verminder cafeïne-inname, vooral 's middags", pl: "Ogranicz spożycie kofeiny, szczególnie po południu", pt: "Reduza o consumo de cafeína, especialmente à tarde",
    } as L,
    {
      en: "Take short breaks during work to decompress", sv: "Ta korta pauser under arbetet för att varva ner", de: "Machen Sie kurze Pausen während der Arbeit", fr: "Prenez de courtes pauses pendant le travail",
      es: "Toma descansos cortos durante el trabajo para descomprimirte", it: "Fai brevi pause durante il lavoro per decomprimere", nl: "Neem korte pauzes tijdens het werk om te ontspannen", pl: "Rób krótkie przerwy w pracy, aby się odprężyć", pt: "Faça pausas curtas durante o trabalho para descomprimir",
    } as L,
    {
      en: "Try gentle yoga or walks in nature", sv: "Prova mild yoga eller promenader i naturen", de: "Versuchen Sie sanftes Yoga oder Spaziergänge in der Natur", fr: "Essayez le yoga doux ou les promenades dans la nature",
      es: "Prueba yoga suave o paseos por la naturaleza", it: "Prova yoga dolce o passeggiate nella natura", nl: "Probeer zachte yoga of wandelingen in de natuur", pl: "Spróbuj łagodnej jogi lub spacerów na łonie natury", pt: "Experimente yoga suave ou caminhadas na natureza",
    } as L,
  ],
  phaseContext: {
    menstrual: {
      en: "During menstruation, higher stress levels are normal due to prostaglandin release and inflammation. Your body is working hard.",
      sv: "Under menstruation är högre stressnivåer normala på grund av prostaglandinfrisättning och inflammation. Din kropp arbetar hårt.",
      de: "Während der Menstruation sind höhere Stresswerte aufgrund von Prostaglandinfreisetzung und Entzündungen normal. Ihr Körper arbeitet hart.",
      fr: "Pendant les menstruations, des niveaux de stress plus élevés sont normaux en raison de la libération de prostaglandines. Votre corps travaille dur.",
      es: "Durante la menstruación, niveles de estrés más altos son normales debido a la liberación de prostaglandinas. Tu cuerpo está trabajando duro.",
      it: "Durante le mestruazioni, livelli di stress più alti sono normali a causa del rilascio di prostaglandine. Il tuo corpo sta lavorando sodo.",
      nl: "Tijdens de menstruatie zijn hogere stressniveaus normaal door de afgifte van prostaglandinen. Je lichaam werkt hard.",
      pl: "Podczas menstruacji wyższy poziom stresu jest normalny z powodu uwalniania prostaglandyn. Twoje ciało ciężko pracuje.",
      pt: "Durante a menstruação, níveis de stress mais altos são normais devido à libertação de prostaglandinas. O seu corpo está a trabalhar muito.",
    } as L,
    follicular: {
      en: "Your stress resilience improves during the follicular phase as estrogen rises. You should feel more capable of handling challenges.",
      sv: "Din stressresistens förbättras under follikelfasen när östrogen stiger. Du bör känna dig mer kapabel att hantera utmaningar.",
      de: "Ihre Stressresilienz verbessert sich in der Follikelphase, wenn Östrogen steigt. Sie sollten sich fähiger fühlen, Herausforderungen zu bewältigen.",
      fr: "Votre résilience au stress s'améliore pendant la phase folliculaire avec la montée des œstrogènes.",
      es: "Tu resiliencia al estrés mejora durante la fase folicular a medida que el estrógeno aumenta.",
      it: "La tua resilienza allo stress migliora durante la fase follicolare con l'aumento degli estrogeni.",
      nl: "Je stressbestendigheid verbetert tijdens de folliculaire fase naarmate oestrogeen stijgt.",
      pl: "Twoja odporność na stres poprawia się w fazie folikularnej, gdy estrogen rośnie.",
      pt: "A sua resiliência ao stress melhora durante a fase folicular à medida que o estrogénio sobe.",
    } as L,
    ovulation: {
      en: "Peak stress tolerance! High estrogen and testosterone levels help you stay calm and confident under pressure.",
      sv: "Toppstresstolerans! Höga östrogen- och testosteronnivåer hjälper dig att hålla dig lugn och säker under press.",
      de: "Höchste Stresstoleranz! Hohe Östrogen- und Testosteronspiegel helfen Ihnen, unter Druck ruhig und selbstbewusst zu bleiben.",
      fr: "Tolérance au stress maximale ! Des niveaux élevés d'œstrogènes et de testostérone vous aident à rester calme sous pression.",
      es: "¡Máxima tolerancia al estrés! Los niveles altos de estrógeno y testosterona te ayudan a mantener la calma bajo presión.",
      it: "Massima tolleranza allo stress! Alti livelli di estrogeni e testosterone ti aiutano a restare calma sotto pressione.",
      nl: "Piekstresstolerantie! Hoge oestrogeen- en testosteronniveaus helpen je kalm en zelfverzekerd te blijven onder druk.",
      pl: "Szczytowa tolerancja na stres! Wysokie poziomy estrogenu i testosteronu pomagają zachować spokój pod presją.",
      pt: "Tolerância máxima ao stress! Níveis elevados de estrogénio e testosterona ajudam a manter a calma sob pressão.",
    } as L,
    luteal: {
      en: "Stress sensitivity increases as progesterone rises then falls. Be extra kind to yourself and reduce stressors when possible.",
      sv: "Stresskänsligheten ökar när progesteron stiger och sedan faller. Var extra snäll mot dig själv och minska stressfaktorer när det är möjligt.",
      de: "Die Stressempfindlichkeit steigt, wenn Progesteron steigt und dann fällt. Seien Sie besonders nett zu sich selbst.",
      fr: "La sensibilité au stress augmente quand la progestérone monte puis descend. Soyez particulièrement gentille avec vous-même.",
      es: "La sensibilidad al estrés aumenta cuando la progesterona sube y luego baja. Sé especialmente amable contigo misma.",
      it: "La sensibilità allo stress aumenta quando il progesterone sale e poi scende. Sii particolarmente gentile con te stessa.",
      nl: "Stressgevoeligheid neemt toe als progesteron stijgt en dan daalt. Wees extra lief voor jezelf.",
      pl: "Wrażliwość na stres wzrasta, gdy progesteron rośnie, a potem spada. Bądź dla siebie szczególnie łagodna.",
      pt: "A sensibilidade ao stress aumenta quando a progesterona sobe e depois desce. Seja extra gentil consigo mesma.",
    } as L,
  },
  defaultPhaseContext: {
    en: "This marker can fluctuate throughout your cycle. Track patterns to understand your personal rhythms.",
    sv: "Denna markör kan fluktuera under din cykel. Spåra mönster för att förstå dina personliga rytmer.",
    de: "Dieser Marker kann während Ihres Zyklus schwanken. Verfolgen Sie Muster, um Ihre persönlichen Rhythmen zu verstehen.",
    fr: "Ce marqueur peut fluctuer au cours de votre cycle. Suivez les tendances pour comprendre vos rythmes personnels.",
    es: "Este marcador puede fluctuar a lo largo de tu ciclo. Rastrea patrones para entender tus ritmos personales.",
    it: "Questo marcatore può fluttuare durante il ciclo. Monitora i modelli per capire i tuoi ritmi personali.",
    nl: "Deze marker kan fluctueren gedurende je cyclus. Volg patronen om je persoonlijke ritmes te begrijpen.",
    pl: "Ten wskaźnik może się zmieniać w trakcie cyklu. Śledź wzorce, aby zrozumieć swoje osobiste rytmy.",
    pt: "Este marcador pode flutuar ao longo do seu ciclo. Acompanhe padrões para entender os seus ritmos pessoais.",
  } as L,
};

const energyData = {
  title: {
    en: "Energy Score", sv: "Energiresultat", de: "Energiewert", fr: "Score d'énergie",
    es: "Puntuación de energía", it: "Punteggio energia", nl: "Energiescore", pl: "Wynik energii", pt: "Pontuação de energia",
  } as L,
  whatWeMeasure: {
    en: "We analyze your eye photo for overall brightness, eye openness (how wide your eyes are), and under-eye appearance, and combine this with your daily check-in responses (energy, sleep) and cycle phase to estimate your energy level.",
    sv: "Vi analyserar ditt ögonfoto för övergripande ljusstyrka, ögonöppenhet (hur vidöppna dina ögon är) och utseendet under ögonen, och kombinerar detta med dina dagliga incheckningssvar (energi, sömn) och cykelfas för att uppskatta din energinivå.",
    de: "Wir analysieren Ihr Augenfoto auf Gesamthelligkeit, Augenöffnung (wie weit Ihre Augen geöffnet sind) und Erscheinung unter den Augen, kombiniert mit Ihren Check-in-Antworten und Zyklusphase.",
    fr: "Nous analysons votre photo oculaire pour la luminosité, l'ouverture des yeux et l'apparence sous les yeux, combinés avec vos réponses quotidiennes et phase du cycle.",
    es: "Analizamos tu foto ocular para el brillo, apertura de los ojos y apariencia bajo los ojos, combinados con tus respuestas diarias y fase del ciclo.",
    it: "Analizziamo la tua foto oculare per luminosità, apertura degli occhi e aspetto sotto gli occhi, combinati con le tue risposte giornaliere e fase del ciclo.",
    nl: "We analyseren je oogfoto op helderheid, oogopening (hoe wijd je ogen open zijn) en het uiterlijk onder de ogen, gecombineerd met je check-in-antwoorden en cyclusfase.",
    pl: "Analizujemy zdjęcie oka pod kątem jasności, otwarcia oczu (jak szeroko otwarte są Twoje oczy) i wyglądu pod oczami, w połączeniu z odpowiedziami z check-in i fazą cyklu.",
    pt: "Analisamos a foto do olho para brilho, abertura dos olhos e aparência sob os olhos, combinados com as suas respostas diárias e fase do ciclo.",
  } as L,
  whatAffects: {
    sleep: {
      en: "Sleep quality and circadian rhythm alignment", sv: "Sömnkvalitet och cirkadisk rytmanpassning", de: "Schlafqualität und zirkadiane Rhythmusanpassung", fr: "Qualité du sommeil et alignement circadien",
      es: "Calidad del sueño y alineación del ritmo circadiano", it: "Qualità del sonno e allineamento del ritmo circadiano", nl: "Slaapkwaliteit en circadiane ritmeanpassing", pl: "Jakość snu i zgodność z rytmem dobowym", pt: "Qualidade do sono e alinhamento do ritmo circadiano",
    } as L,
    sugar: {
      en: "Blood sugar imbalance from sugar intake", sv: "Blodsockerobalans från sockerintag", de: "Blutzuckerungleichgewicht durch Zuckeraufnahme", fr: "Déséquilibre glycémique dû au sucre",
      es: "Desequilibrio de azúcar en sangre por consumo de azúcar", it: "Squilibrio glicemico da assunzione di zucchero", nl: "Bloedsuikeronbalans door suikerinname", pl: "Zaburzenia poziomu cukru we krwi", pt: "Desequilíbrio de açúcar no sangue",
    } as L,
    hydration: {
      en: "Hydration levels", sv: "Hydreringsnivåer", de: "Hydratationsstand", fr: "Niveaux d'hydratation",
      es: "Niveles de hidratación", it: "Livelli di idratazione", nl: "Hydratieniveaus", pl: "Poziomy nawodnienia", pt: "Níveis de hidratação",
    } as L,
    activity: {
      en: "Physical activity and recovery balance", sv: "Fysisk aktivitet och återhämtningsbalans", de: "Körperliche Aktivität und Erholungsbalance", fr: "Activité physique et équilibre de récupération",
      es: "Actividad física y equilibrio de recuperación", it: "Attività fisica e equilibrio di recupero", nl: "Fysieke activiteit en herstelbalans", pl: "Aktywność fizyczna i równowaga regeneracji", pt: "Atividade física e equilíbrio de recuperação",
    } as L,
    hormones: {
      en: "Hormonal changes throughout your menstrual cycle", sv: "Hormonförändringar genom din menstruationscykel", de: "Hormonelle Veränderungen während Ihres Menstruationszyklus", fr: "Changements hormonaux pendant votre cycle menstruel",
      es: "Cambios hormonales a lo largo de tu ciclo menstrual", it: "Cambiamenti ormonali durante il ciclo mestruale", nl: "Hormonale veranderingen tijdens je menstruatiecyclus", pl: "Zmiany hormonalne w trakcie cyklu menstruacyjnego", pt: "Alterações hormonais ao longo do seu ciclo menstrual",
    } as L,
    caffeine: {
      en: "Caffeine consumption affecting energy cycles", sv: "Koffeinkonsumtion som påverkar energicykler", de: "Koffeinkonsum, der Energiezyklen beeinflusst", fr: "Consommation de caféine affectant les cycles d'énergie",
      es: "Consumo de cafeína afectando los ciclos de energía", it: "Consumo di caffeina che influenza i cicli energetici", nl: "Cafeïneconsumptie die energiecycli beïnvloedt", pl: "Spożycie kofeiny wpływające na cykle energetyczne", pt: "Consumo de cafeína afetando os ciclos de energia",
    } as L,
    alcohol: {
      en: "Alcohol disrupting restorative sleep", sv: "Alkohol som stör återställande sömn", de: "Alkohol, der den erholsamen Schlaf stört", fr: "L'alcool perturbant le sommeil réparateur",
      es: "El alcohol alterando el sueño reparador", it: "L'alcol che disturba il sonno ristoratore", nl: "Alcohol dat herstellende slaap verstoort", pl: "Alkohol zaburzający sen regeneracyjny", pt: "Álcool perturbando o sono reparador",
    } as L,
    illness: {
      en: "Your body fighting illness uses extra energy", sv: "Din kropp bekämpar sjukdom och använder extra energi", de: "Ihr Körper bekämpft Krankheit und verbraucht extra Energie", fr: "Votre corps utilise de l'énergie supplémentaire pour combattre la maladie",
      es: "Tu cuerpo luchando contra una enfermedad usa energía extra", it: "Il tuo corpo che combatte la malattia usa energia extra", nl: "Je lichaam dat ziekte bestrijdt gebruikt extra energie", pl: "Twoje ciało walczące z chorobą zużywa dodatkową energię", pt: "O seu corpo a combater doenças usa energia extra",
    } as L,
  },
  howToImprove: [
    { en: "Eat balanced meals with protein and complex carbs", sv: "Ät balanserade måltider med protein och komplexa kolhydrater", de: "Essen Sie ausgewogene Mahlzeiten mit Protein und komplexen Kohlenhydraten", fr: "Mangez des repas équilibrés avec protéines et glucides complexes", es: "Come comidas equilibradas con proteínas y carbohidratos complejos", it: "Mangia pasti equilibrati con proteine e carboidrati complessi", nl: "Eet uitgebalanceerde maaltijden met eiwitten en complexe koolhydraten", pl: "Jedz zbilansowane posiłki z białkiem i złożonymi węglowodanami", pt: "Coma refeições equilibradas com proteínas e carboidratos complexos" } as L,
    { en: "Stay hydrated throughout the day", sv: "Håll dig hydrerad hela dagen", de: "Bleiben Sie den ganzen Tag über hydriert", fr: "Restez hydratée tout au long de la journée", es: "Mantente hidratada durante todo el día", it: "Mantieniti idratata durante il giorno", nl: "Blijf de hele dag gehydrateerd", pl: "Pij dużo wody przez cały dzień", pt: "Mantenha-se hidratada ao longo do dia" } as L,
    { en: "Move your body regularly, but avoid overtraining", sv: "Rör på kroppen regelbundet, men undvik överträning", de: "Bewegen Sie sich regelmäßig, vermeiden Sie aber Übertraining", fr: "Bougez régulièrement, mais évitez le surentraînement", es: "Mueve tu cuerpo regularmente, pero evita el sobreentrenamiento", it: "Muovi il corpo regolarmente, ma evita il sovrallenamento", nl: "Beweeg regelmatig, maar vermijd overtraining", pl: "Regularnie ruszaj ciałem, ale unikaj przetrenowania", pt: "Mova o seu corpo regularmente, mas evite o excesso de treino" } as L,
    { en: "Align your activities with your cycle phase", sv: "Anpassa dina aktiviteter efter din cykelfas", de: "Passen Sie Ihre Aktivitäten an Ihre Zyklusphase an", fr: "Alignez vos activités avec votre phase du cycle", es: "Alinea tus actividades con tu fase del ciclo", it: "Allinea le tue attività con la fase del ciclo", nl: "Stem je activiteiten af op je cyclusfase", pl: "Dostosuj aktywności do fazy cyklu", pt: "Alinhe as suas atividades com a fase do ciclo" } as L,
    { en: "Consider B-vitamins and iron-rich foods", sv: "Överväg B-vitaminer och järnrika livsmedel", de: "Erwägen Sie B-Vitamine und eisenreiche Lebensmittel", fr: "Pensez aux vitamines B et aux aliments riches en fer", es: "Considera vitaminas B y alimentos ricos en hierro", it: "Considera vitamine del gruppo B e cibi ricchi di ferro", nl: "Overweeg B-vitamines en ijzerrijke voeding", pl: "Rozważ witaminy z grupy B i pokarmy bogate w żelazo", pt: "Considere vitaminas B e alimentos ricos em ferro" } as L,
  ],
  phaseContext: {
    menstrual: {
      en: "Low energy is completely normal during your period. Hormone levels are at their lowest, so be gentle with yourself.",
      sv: "Låg energi är helt normalt under din mens. Hormonnivåerna är som lägst, så var snäll mot dig själv.",
      de: "Niedrige Energie ist während Ihrer Periode völlig normal. Die Hormonspiegel sind am niedrigsten — seien Sie sanft zu sich.",
      fr: "Une faible énergie est tout à fait normale pendant vos règles. Les niveaux hormonaux sont au plus bas.",
      es: "La baja energía es completamente normal durante tu período. Los niveles hormonales están en su punto más bajo.",
      it: "L'energia bassa è completamente normale durante il ciclo. I livelli ormonali sono al minimo.",
      nl: "Lage energie is volkomen normaal tijdens je menstruatie. Hormoonspiegels zijn op hun laagst.",
      pl: "Niska energia jest całkowicie normalna podczas okresu. Poziomy hormonów są najniższe.",
      pt: "Energia baixa é completamente normal durante o período. Os níveis hormonais estão no seu ponto mais baixo.",
    } as L,
    follicular: {
      en: "Rising estrogen naturally boosts energy. This is an excellent time to tackle demanding tasks and workouts.",
      sv: "Stigande östrogen ökar naturligt energin. Detta är en utmärkt tid att ta itu med krävande uppgifter och träningspass.",
      de: "Steigendes Östrogen steigert natürlich die Energie. Eine ausgezeichnete Zeit für anspruchsvolle Aufgaben.",
      fr: "L'augmentation des œstrogènes booste naturellement l'énergie. Un excellent moment pour les tâches exigeantes.",
      es: "El estrógeno en aumento aumenta naturalmente la energía. Un excelente momento para tareas exigentes.",
      it: "L'aumento degli estrogeni aumenta naturalmente l'energia. Un momento eccellente per compiti impegnativi.",
      nl: "Stijgend oestrogeen boost van nature je energie. Een uitstekend moment voor veeleisende taken.",
      pl: "Rosnący estrogen naturalnie zwiększa energię. To doskonały czas na wymagające zadania.",
      pt: "O estrogénio em ascensão aumenta naturalmente a energia. Um excelente momento para tarefas exigentes.",
    } as L,
    ovulation: {
      en: "Maximum energy levels. Your body is optimized for performance — use this window strategically.",
      sv: "Maximala energinivåer. Din kropp är optimerad för prestation — använd detta fönster strategiskt.",
      de: "Maximale Energieniveaus. Ihr Körper ist auf Leistung optimiert — nutzen Sie dieses Fenster strategisch.",
      fr: "Niveaux d'énergie maximaux. Votre corps est optimisé pour la performance.",
      es: "Niveles máximos de energía. Tu cuerpo está optimizado para el rendimiento.",
      it: "Livelli massimi di energia. Il tuo corpo è ottimizzato per la prestazione.",
      nl: "Maximale energieniveaus. Je lichaam is geoptimaliseerd voor prestatie.",
      pl: "Maksymalne poziomy energii. Twoje ciało jest zoptymalizowane pod kątem wydajności.",
      pt: "Níveis máximos de energia. O seu corpo está otimizado para o desempenho.",
    } as L,
    luteal: {
      en: "Declining energy is normal in the luteal phase, especially in the second half. Focus on sustainable activities.",
      sv: "Minskande energi är normalt i luteinfasen, särskilt i andra halvan. Fokusera på hållbara aktiviteter.",
      de: "Abnehmende Energie ist in der Lutealphase normal, besonders in der zweiten Hälfte. Konzentrieren Sie sich auf nachhaltige Aktivitäten.",
      fr: "La baisse d'énergie est normale dans la phase lutéale. Concentrez-vous sur des activités durables.",
      es: "La disminución de energía es normal en la fase lútea. Concéntrate en actividades sostenibles.",
      it: "Il calo di energia è normale nella fase luteale. Concentrati su attività sostenibili.",
      nl: "Dalende energie is normaal in de luteale fase. Richt je op duurzame activiteiten.",
      pl: "Spadek energii jest normalny w fazie lutealnej. Skup się na zrównoważonych aktywnościach.",
      pt: "A diminuição de energia é normal na fase lútea. Concentre-se em atividades sustentáveis.",
    } as L,
  },
  defaultPhaseContext: {
    en: "Energy levels naturally fluctuate with your cycle. Track patterns to optimize your schedule.",
    sv: "Energinivåer fluktuerar naturligt med din cykel. Spåra mönster för att optimera ditt schema.",
    de: "Energieniveaus schwanken natürlich mit Ihrem Zyklus. Verfolgen Sie Muster zur Optimierung.",
    fr: "Les niveaux d'énergie fluctuent naturellement avec votre cycle. Suivez les tendances pour optimiser.",
    es: "Los niveles de energía fluctúan naturalmente con tu ciclo. Rastrea patrones para optimizar.",
    it: "I livelli di energia fluttuano naturalmente con il ciclo. Monitora i modelli per ottimizzare.",
    nl: "Energieniveaus fluctueren van nature met je cyclus. Volg patronen om te optimaliseren.",
    pl: "Poziomy energii naturalnie zmieniają się z cyklem. Śledź wzorce, aby zoptymalizować harmonogram.",
    pt: "Os níveis de energia flutuam naturalmente com o seu ciclo. Acompanhe padrões para otimizar.",
  } as L,
};

const recoveryData = {
  title: {
    en: "Recovery Score", sv: "Återhämtningsresultat", de: "Erholungswert", fr: "Score de récupération",
    es: "Puntuación de recuperación", it: "Punteggio recupero", nl: "Herstelscore", pl: "Wynik regeneracji", pt: "Pontuação de recuperação",
  } as L,
  whatWeMeasure: {
    en: "We analyze your eye photo for brightness, eye openness, tear film reflection quality, sclera redness, and under-eye appearance, and combine this with your daily check-in responses and cycle phase to estimate your recovery readiness.",
    sv: "Vi analyserar ditt ögonfoto för ljusstyrka, ögonöppenhet, tårfilmsreflektionskvalitet, sklerarödshet och utseendet under ögonen, och kombinerar detta med dina dagliga incheckningssvar och cykelfas för att uppskatta din återhämtningsberedskap.",
    de: "Wir analysieren Ihr Augenfoto auf Helligkeit, Augenöffnung, Tränenfilm-Reflexion, Sklerarötung und Erscheinung unter den Augen, kombiniert mit Ihren Check-in-Antworten und Zyklusphase.",
    fr: "Nous analysons votre photo oculaire pour la luminosité, l'ouverture des yeux, la qualité du film lacrymal, la rougeur sclérale et l'apparence sous les yeux, combinés avec vos réponses et phase du cycle.",
    es: "Analizamos tu foto ocular para brillo, apertura de ojos, calidad de reflexión lagrimal, rojez escleral y apariencia bajo los ojos, combinados con tus respuestas y fase del ciclo.",
    it: "Analizziamo la tua foto oculare per luminosità, apertura degli occhi, qualità di riflessione lacrimale, rossore sclerale e aspetto sotto gli occhi, combinati con le tue risposte e fase del ciclo.",
    nl: "We analyseren je oogfoto op helderheid, oogopening, traanfilmreflectie, sclera-roodheid en het uiterlijk onder de ogen, gecombineerd met je check-in-antwoorden en cyclusfase.",
    pl: "Analizujemy zdjęcie oka pod kątem jasności, otwarcia oczu, jakości odbicia filmu łzowego, zaczerwienienia twardówki i wyglądu pod oczami, w połączeniu z odpowiedziami z check-in i fazą cyklu.",
    pt: "Analisamos a foto do olho para brilho, abertura dos olhos, qualidade de reflexão lacrimal, vermelhidão escleral e aparência sob os olhos, combinados com as suas respostas e fase do ciclo.",
  } as L,
  whatAffects: {
    sleep: { en: "Quality and quantity of sleep", sv: "Kvalitet och kvantitet av sömn", de: "Qualität und Quantität des Schlafs", fr: "Qualité et quantité du sommeil", es: "Calidad y cantidad del sueño", it: "Qualità e quantità del sonno", nl: "Kwaliteit en hoeveelheid slaap", pl: "Jakość i ilość snu", pt: "Qualidade e quantidade de sono" } as L,
    workout: { en: "Intensity and frequency of workouts", sv: "Intensitet och frekvens av träningspass", de: "Intensität und Häufigkeit der Trainingseinheiten", fr: "Intensité et fréquence des entraînements", es: "Intensidad y frecuencia de los entrenamientos", it: "Intensità e frequenza degli allenamenti", nl: "Intensiteit en frequentie van trainingen", pl: "Intensywność i częstotliwość treningów", pt: "Intensidade e frequência dos treinos" } as L,
    stress: { en: "Stress and mental load", sv: "Stress och mental belastning", de: "Stress und mentale Belastung", fr: "Stress et charge mentale", es: "Estrés y carga mental", it: "Stress e carico mentale", nl: "Stress en mentale belasting", pl: "Stres i obciążenie psychiczne", pt: "Stress e carga mental" } as L,
    processedFood: { en: "Processed food reducing recovery efficiency", sv: "Bearbetad mat minskar återhämtningseffektivitet", de: "Verarbeitete Lebensmittel verringern die Erholungseffizienz", fr: "Aliments transformés réduisant l'efficacité de la récupération", es: "Alimentos procesados reduciendo la eficiencia de recuperación", it: "Cibo processato che riduce l'efficienza del recupero", nl: "Bewerkt voedsel dat herstelefficiëntie vermindert", pl: "Przetworzona żywność zmniejszająca efektywność regeneracji", pt: "Alimentos processados reduzindo a eficiência de recuperação" } as L,
    hormones: { en: "Hormonal fluctuations in your cycle", sv: "Hormonfluktuationer i din cykel", de: "Hormonschwankungen in Ihrem Zyklus", fr: "Fluctuations hormonales dans votre cycle", es: "Fluctuaciones hormonales en tu ciclo", it: "Fluttuazioni ormonali nel tuo ciclo", nl: "Hormoonschommelingen in je cyclus", pl: "Wahania hormonalne w cyklu", pt: "Flutuações hormonais no seu ciclo" } as L,
    alcohol: { en: "Alcohol slowing recovery processes", sv: "Alkohol saktar återhämtningsprocesser", de: "Alkohol verlangsamt Erholungsprozesse", fr: "L'alcool ralentissant les processus de récupération", es: "El alcohol ralentizando los procesos de recuperación", it: "L'alcol rallenta i processi di recupero", nl: "Alcohol vertraagt herstelprocessen", pl: "Alkohol spowalniający procesy regeneracji", pt: "Álcool desacelerando os processos de recuperação" } as L,
    illness: { en: "Illness demanding more recovery resources", sv: "Sjukdom kräver mer återhämtningsresurser", de: "Krankheit erfordert mehr Erholungsressourcen", fr: "La maladie exigeant plus de ressources de récupération", es: "La enfermedad demandando más recursos de recuperación", it: "La malattia che richiede più risorse di recupero", nl: "Ziekte die meer herstelbronnen vereist", pl: "Choroba wymagająca więcej zasobów regeneracyjnych", pt: "Doença exigindo mais recursos de recuperação" } as L,
  },
  howToImprove: [
    { en: "Prioritize rest days between intense workouts", sv: "Prioritera vilodagar mellan intensiva träningspass", de: "Priorisieren Sie Ruhetage zwischen intensiven Trainingseinheiten", fr: "Priorisez les jours de repos entre les entraînements intenses", es: "Prioriza días de descanso entre entrenamientos intensos", it: "Dai priorità ai giorni di riposo tra allenamenti intensi", nl: "Geef prioriteit aan rustdagen tussen intensieve trainingen", pl: "Priorytetowo traktuj dni odpoczynku między intensywnymi treningami", pt: "Priorize dias de descanso entre treinos intensos" } as L,
    { en: "Focus on anti-inflammatory foods (berries, fatty fish, turmeric)", sv: "Fokusera på antiinflammatoriska livsmedel (bär, fet fisk, gurkmeja)", de: "Konzentrieren Sie sich auf entzündungshemmende Lebensmittel (Beeren, fetter Fisch, Kurkuma)", fr: "Misez sur les aliments anti-inflammatoires (baies, poissons gras, curcuma)", es: "Enfócate en alimentos antiinflamatorios (bayas, pescado graso, cúrcuma)", it: "Concentrati su cibi antinfiammatori (bacche, pesce grasso, curcuma)", nl: "Richt je op ontstekingsremmende voeding (bessen, vette vis, kurkuma)", pl: "Skup się na pokarmach przeciwzapalnych (jagody, tłuste ryby, kurkuma)", pt: "Foque em alimentos anti-inflamatórios (frutas vermelhas, peixe gordo, açafrão)" } as L,
    { en: "Get consistent, quality sleep", sv: "Få konsekvent, kvalitetssömn", de: "Schlafen Sie regelmäßig und gut", fr: "Dormez de manière régulière et de qualité", es: "Duerme de forma consistente y con calidad", it: "Dormi in modo costante e di qualità", nl: "Slaap consistent en kwalitatief", pl: "Śpij regularnie i jakościowo", pt: "Durma de forma consistente e com qualidade" } as L,
    { en: "Try gentle stretching or foam rolling", sv: "Prova mild stretching eller foam rolling", de: "Versuchen Sie sanftes Dehnen oder Faszienrollen", fr: "Essayez des étirements doux ou le foam roller", es: "Prueba estiramientos suaves o foam rolling", it: "Prova stretching dolce o foam rolling", nl: "Probeer zacht rekken of foam rollen", pl: "Spróbuj łagodnego rozciągania lub rolowania", pt: "Experimente alongamentos suaves ou foam rolling" } as L,
    { en: "Consider magnesium supplementation", sv: "Överväg magnesiumtillskott", de: "Erwägen Sie Magnesiumergänzung", fr: "Envisagez une supplémentation en magnésium", es: "Considera suplementación de magnesio", it: "Considera l'integrazione di magnesio", nl: "Overweeg magnesiumsuppletie", pl: "Rozważ suplementację magnezu", pt: "Considere suplementação de magnésio" } as L,
  ],
  phaseContext: {
    menstrual: { en: "Recovery may be slower during menstruation due to inflammation and blood loss. Extra rest is beneficial.", sv: "Återhämtning kan vara långsammare under menstruation på grund av inflammation och blodförlust. Extra vila är fördelaktigt.", de: "Die Erholung kann während der Menstruation aufgrund von Entzündungen und Blutverlust langsamer sein.", fr: "La récupération peut être plus lente pendant les menstruations. Le repos supplémentaire est bénéfique.", es: "La recuperación puede ser más lenta durante la menstruación. El descanso extra es beneficioso.", it: "Il recupero può essere più lento durante le mestruazioni. Il riposo extra è benefico.", nl: "Herstel kan langzamer zijn tijdens de menstruatie. Extra rust is gunstig.", pl: "Regeneracja może być wolniejsza podczas menstruacji. Dodatkowy odpoczynek jest korzystny.", pt: "A recuperação pode ser mais lenta durante a menstruação. O descanso extra é benéfico." } as L,
    follicular: { en: "Your body recovers more efficiently now. This is the ideal phase for high-intensity training.", sv: "Din kropp återhämtar sig mer effektivt nu. Detta är den ideala fasen för högintensiv träning.", de: "Ihr Körper erholt sich jetzt effizienter. Die ideale Phase für hochintensives Training.", fr: "Votre corps récupère plus efficacement. Phase idéale pour l'entraînement de haute intensité.", es: "Tu cuerpo se recupera más eficientemente ahora. Fase ideal para entrenamiento de alta intensidad.", it: "Il tuo corpo recupera più efficientemente ora. Fase ideale per allenamento ad alta intensità.", nl: "Je lichaam herstelt nu efficiënter. De ideale fase voor intensieve training.", pl: "Twoje ciało regeneruje się teraz bardziej efektywnie. Idealna faza na intensywny trening.", pt: "O seu corpo recupera mais eficientemente agora. Fase ideal para treino de alta intensidade." } as L,
    ovulation: { en: "Optimal recovery capacity. Your body can handle intense physical and mental demands.", sv: "Optimal återhämtningskapacitet. Din kropp kan hantera intensiva fysiska och mentala krav.", de: "Optimale Erholungskapazität. Ihr Körper kann intensive Anforderungen bewältigen.", fr: "Capacité de récupération optimale. Votre corps peut gérer des exigences intenses.", es: "Capacidad de recuperación óptima. Tu cuerpo puede manejar demandas intensas.", it: "Capacità di recupero ottimale. Il tuo corpo può gestire richieste intense.", nl: "Optimale herstelcapaciteit. Je lichaam kan intense eisen aan.", pl: "Optymalna zdolność regeneracji. Twoje ciało może sprostać intensywnym wymaganiom.", pt: "Capacidade de recuperação ótima. O seu corpo pode lidar com exigências intensas." } as L,
    luteal: { en: "Recovery needs increase during this phase. Listen to your body's signals for rest.", sv: "Återhämtningsbehov ökar under denna fas. Lyssna på din kropps signaler för vila.", de: "Der Erholungsbedarf steigt in dieser Phase. Hören Sie auf die Signale Ihres Körpers.", fr: "Les besoins de récupération augmentent. Écoutez les signaux de votre corps.", es: "Las necesidades de recuperación aumentan en esta fase. Escucha las señales de tu cuerpo.", it: "Le esigenze di recupero aumentano in questa fase. Ascolta i segnali del tuo corpo.", nl: "Herstelbehoefte neemt toe in deze fase. Luister naar de signalen van je lichaam.", pl: "Potrzeby regeneracyjne rosną w tej fazie. Słuchaj sygnałów swojego ciała.", pt: "As necessidades de recuperação aumentam nesta fase. Ouça os sinais do seu corpo." } as L,
  },
  defaultPhaseContext: { en: "Recovery capacity varies throughout your cycle. Adapt your training accordingly.", sv: "Återhämtningskapacitet varierar genom din cykel. Anpassa din träning därefter.", de: "Die Erholungskapazität variiert während Ihres Zyklus. Passen Sie Ihr Training an.", fr: "La capacité de récupération varie avec votre cycle. Adaptez votre entraînement.", es: "La capacidad de recuperación varía con tu ciclo. Adapta tu entrenamiento.", it: "La capacità di recupero varia con il ciclo. Adatta il tuo allenamento.", nl: "Herstelcapaciteit varieert met je cyclus. Pas je training aan.", pl: "Zdolność regeneracji zmienia się w trakcie cyklu. Dostosuj trening.", pt: "A capacidade de recuperação varia com o ciclo. Adapte o seu treino." } as L,
};

const hydrationData = {
  title: { en: "Hydration Level", sv: "Hydreringsnivå", de: "Hydratationsniveau", fr: "Niveau d'hydratation", es: "Nivel de hidratación", it: "Livello di idratazione", nl: "Hydratieniveau", pl: "Poziom nawodnienia", pt: "Nível de hidratação" } as L,
  whatWeMeasure: {
    en: "We analyze your eye photo for tear film reflection quality, sclera yellowness, sclera redness, and brightness — these may reflect hydration-related tendencies. This is combined with your daily check-in responses and cycle phase.",
    sv: "Vi analyserar ditt ögonfoto för tårfilmsreflektionskvalitet, skleragulhet, sklerarödshet och ljusstyrka — dessa kan återspegla hydreringsrelaterade tendenser. Detta kombineras med dina dagliga incheckningssvar och cykelfas.",
    de: "Wir analysieren Ihr Augenfoto auf Tränenfilm-Reflexion, Sklera-Gelbfärbung, Sklerarötung und Helligkeit — diese können hydratationsbezogene Tendenzen widerspiegeln, kombiniert mit Check-in-Antworten und Zyklusphase.",
    fr: "Nous analysons votre photo oculaire pour la qualité du film lacrymal, la coloration jaune sclérale, la rougeur et la luminosité — combinées avec vos réponses quotidiennes et phase du cycle.",
    es: "Analizamos tu foto ocular para calidad de reflexión lagrimal, coloración amarilla escleral, rojez y brillo — combinados con tus respuestas diarias y fase del ciclo.",
    it: "Analizziamo la tua foto oculare per qualità di riflessione lacrimale, colorazione gialla sclerale, rossore e luminosità — combinati con le tue risposte giornaliere e fase del ciclo.",
    nl: "We analyseren je oogfoto op traanfilmreflectie, sclera-geelheid, sclera-roodheid en helderheid — gecombineerd met je check-in-antwoorden en cyclusfase.",
    pl: "Analizujemy zdjęcie oka pod kątem jakości odbicia filmu łzowego, żółtości twardówki, zaczerwienienia i jasności — w połączeniu z odpowiedziami z check-in i fazą cyklu.",
    pt: "Analisamos a foto do olho para qualidade de reflexão lacrimal, coloração amarela escleral, vermelhidão e brilho — combinados com as suas respostas diárias e fase do ciclo.",
  } as L,
  whatAffects: {
    water: { en: "Daily water intake", sv: "Dagligt vattenintag", de: "Tägliche Wasseraufnahme", fr: "Apport quotidien en eau", es: "Ingesta diaria de agua", it: "Assunzione giornaliera di acqua", nl: "Dagelijkse waterinname", pl: "Dzienne spożycie wody", pt: "Ingestão diária de água" } as L,
    caffeine: { en: "Caffeine acting as a diuretic", sv: "Koffein som verkar som diuretikum", de: "Koffein als Diuretikum", fr: "La caféine agissant comme diurétique", es: "La cafeína actuando como diurético", it: "La caffeina che agisce come diuretico", nl: "Cafeïne als diureticum", pl: "Kofeina działająca jako diuretyk", pt: "Cafeína atuando como diurético" } as L,
    alcohol: { en: "Alcohol increasing fluid loss", sv: "Alkohol ökar vätskeförlust", de: "Alkohol erhöht den Flüssigkeitsverlust", fr: "L'alcool augmentant la perte de liquide", es: "El alcohol aumentando la pérdida de líquidos", it: "L'alcol che aumenta la perdita di liquidi", nl: "Alcohol dat vochtverlies verhoogt", pl: "Alkohol zwiększający utratę płynów", pt: "Álcool aumentando a perda de líquidos" } as L,
    climate: { en: "Climate and humidity levels", sv: "Klimat och luftfuktighetsnivåer", de: "Klima und Luftfeuchtigkeit", fr: "Climat et niveaux d'humidité", es: "Clima y niveles de humedad", it: "Clima e livelli di umidità", nl: "Klimaat en vochtigheidsniveaus", pl: "Klimat i poziomy wilgotności", pt: "Clima e níveis de humidade" } as L,
    exercise: { en: "Exercise intensity and duration", sv: "Träningsintensitet och varaktighet", de: "Trainingsintensität und -dauer", fr: "Intensité et durée de l'exercice", es: "Intensidad y duración del ejercicio", it: "Intensità e durata dell'esercizio", nl: "Trainingsintensiteit en -duur", pl: "Intensywność i czas trwania ćwiczeń", pt: "Intensidade e duração do exercício" } as L,
    illness: { en: "Illness increasing fluid needs", sv: "Sjukdom ökar vätskebehov", de: "Krankheit erhöht den Flüssigkeitsbedarf", fr: "La maladie augmentant les besoins en liquide", es: "La enfermedad aumentando las necesidades de líquidos", it: "La malattia che aumenta il fabbisogno di liquidi", nl: "Ziekte die de vochtbehoefte verhoogt", pl: "Choroba zwiększająca zapotrzebowanie na płyny", pt: "Doença aumentando as necessidades de líquidos" } as L,
  },
  howToImprove: [
    { en: "Drink at least 8 glasses of water daily", sv: "Drick minst 8 glas vatten dagligen", de: "Trinken Sie täglich mindestens 8 Gläser Wasser", fr: "Buvez au moins 8 verres d'eau par jour", es: "Bebe al menos 8 vasos de agua al día", it: "Bevi almeno 8 bicchieri d'acqua al giorno", nl: "Drink dagelijks minstens 8 glazen water", pl: "Pij co najmniej 8 szklanek wody dziennie", pt: "Beba pelo menos 8 copos de água por dia" } as L,
    { en: "Reduce caffeine and alcohol intake", sv: "Minska koffein- och alkoholintag", de: "Reduzieren Sie Koffein- und Alkoholkonsum", fr: "Réduisez la caféine et l'alcool", es: "Reduce el consumo de cafeína y alcohol", it: "Riduci l'assunzione di caffeina e alcol", nl: "Verminder cafeïne- en alcoholinname", pl: "Ogranicz spożycie kofeiny i alkoholu", pt: "Reduza o consumo de cafeína e álcool" } as L,
    { en: "Eat water-rich foods (cucumber, watermelon, oranges)", sv: "Ät vattenrika livsmedel (gurka, vattenmelon, apelsiner)", de: "Essen Sie wasserreiche Lebensmittel (Gurke, Wassermelone, Orangen)", fr: "Mangez des aliments riches en eau (concombre, pastèque, oranges)", es: "Come alimentos ricos en agua (pepino, sandía, naranjas)", it: "Mangia cibi ricchi d'acqua (cetriolo, anguria, arance)", nl: "Eet waterrijke voeding (komkommer, watermeloen, sinaasappels)", pl: "Jedz pokarmy bogate w wodę (ogórek, arbuz, pomarańcze)", pt: "Coma alimentos ricos em água (pepino, melancia, laranjas)" } as L,
    { en: "Use a humidifier in dry environments", sv: "Använd en luftfuktare i torra miljöer", de: "Verwenden Sie einen Luftbefeuchter in trockenen Umgebungen", fr: "Utilisez un humidificateur dans les environnements secs", es: "Usa un humidificador en ambientes secos", it: "Usa un umidificatore in ambienti secchi", nl: "Gebruik een luchtbevochtiger in droge omgevingen", pl: "Używaj nawilżacza w suchym otoczeniu", pt: "Use um humidificador em ambientes secos" } as L,
    { en: "Monitor urine color for hydration status", sv: "Övervaka urinfärg för hydreringsstatus", de: "Überwachen Sie die Urinfarbe für den Hydratationsstatus", fr: "Surveillez la couleur de l'urine pour l'état d'hydratation", es: "Monitorea el color de la orina para el estado de hidratación", it: "Monitora il colore delle urine per lo stato di idratazione", nl: "Monitor urinekleur voor hydratatiestatus", pl: "Monitoruj kolor moczu pod kątem nawodnienia", pt: "Monitore a cor da urina para o estado de hidratação" } as L,
  ],
  phaseContext: {
    menstrual: { en: "You may need extra hydration during menstruation to support blood volume and reduce cramping.", sv: "Du kan behöva extra hydrering under menstruation för att stödja blodvolym och minska kramper.", de: "Während der Menstruation benötigen Sie möglicherweise zusätzliche Flüssigkeit.", fr: "Vous pourriez avoir besoin de plus d'hydratation pendant les menstruations.", es: "Podrías necesitar hidratación extra durante la menstruación.", it: "Potresti aver bisogno di idratazione extra durante le mestruazioni.", nl: "Je hebt mogelijk extra hydratatie nodig tijdens de menstruatie.", pl: "Możesz potrzebować dodatkowego nawodnienia podczas menstruacji.", pt: "Pode precisar de hidratação extra durante a menstruação." } as L,
  },
  defaultPhaseContext: { en: "Hydration needs can vary with your cycle. Stay consistent with water intake.", sv: "Hydreringsbehov kan variera med din cykel. Håll dig konsekvent med vattenintag.", de: "Der Flüssigkeitsbedarf kann mit Ihrem Zyklus variieren. Trinken Sie regelmäßig.", fr: "Les besoins en hydratation varient avec votre cycle. Restez régulière.", es: "Las necesidades de hidratación varían con tu ciclo. Mantente constante.", it: "Le esigenze di idratazione variano con il ciclo. Resta costante.", nl: "Hydratiebehoeften variëren met je cyclus. Blijf constant.", pl: "Potrzeby nawodnienia zmieniają się z cyklem. Bądź konsekwentna.", pt: "As necessidades de hidratação variam com o ciclo. Mantenha-se constante." } as L,
};

const inflammationData = {
  title: { en: "Inflammation", sv: "Inflammation", de: "Entzündung", fr: "Inflammation", es: "Inflamación", it: "Infiammazione", nl: "Ontsteking", pl: "Stan zapalny", pt: "Inflamação" } as L,
  whatWeMeasure: {
    en: "We analyze your eye photo for sclera redness, sclera yellowness, and tear film quality, which may be associated with how your body responds to physical or lifestyle stressors. This is combined with your check-in data and cycle phase. This is not a medical assessment.",
    sv: "Vi analyserar ditt ögonfoto för sklerarödshet, skleragulhet och tårfilmskvalitet, som kan vara förknippade med hur din kropp svarar på stressfaktorer. Detta kombineras med din incheckningsdata och cykelfas. Detta är inte en medicinsk bedömning.",
    de: "Wir analysieren Ihr Augenfoto auf Sklerarötung, Sklera-Gelbfärbung und Tränenfilmqualität, die mit der Reaktion Ihres Körpers auf Stressoren zusammenhängen können. Kombiniert mit Check-in-Daten und Zyklusphase. Keine medizinische Bewertung.",
    fr: "Nous analysons votre photo oculaire pour la rougeur sclérale, la coloration jaune et la qualité du film lacrymal, associées à la réponse de votre corps aux facteurs de stress. Combiné avec vos données et phase du cycle. Ce n'est pas une évaluation médicale.",
    es: "Analizamos tu foto ocular para rojez escleral, coloración amarilla y calidad lagrimal, que pueden estar asociadas con la respuesta de tu cuerpo a factores de estrés. Combinado con tus datos y fase del ciclo. No es una evaluación médica.",
    it: "Analizziamo la tua foto oculare per rossore sclerale, colorazione gialla e qualità del film lacrimale, che possono essere associati alla risposta del corpo ai fattori di stress. Combinato con i dati giornalieri e fase del ciclo. Non è una valutazione medica.",
    nl: "We analyseren je oogfoto op sclera-roodheid, sclera-geelheid en traanfilmkwaliteit, die verband kunnen houden met hoe je lichaam reageert op stressoren. Gecombineerd met check-in-data en cyclusfase. Geen medische beoordeling.",
    pl: "Analizujemy zdjęcie oka pod kątem zaczerwienienia twardówki, żółtości i jakości filmu łzowego, które mogą być związane z reakcją ciała na stresory. W połączeniu z danymi z check-in i fazą cyklu. To nie jest ocena medyczna.",
    pt: "Analisamos a foto do olho para vermelhidão escleral, coloração amarela e qualidade do filme lacrimal, que podem estar associadas a como o corpo responde a fatores de stress. Combinado com dados diários e fase do ciclo. Não é uma avaliação médica.",
  } as L,
  whatAffects: {
    processedFood: { en: "Processed food triggering inflammatory response", sv: "Bearbetad mat utlöser inflammatorisk respons", de: "Verarbeitete Lebensmittel lösen Entzündungsreaktion aus", fr: "Aliments transformés déclenchant une réponse inflammatoire", es: "Alimentos procesados desencadenando respuesta inflamatoria", it: "Cibo processato che innesca risposta infiammatoria", nl: "Bewerkt voedsel dat ontstekingsreactie triggert", pl: "Przetworzona żywność wywołująca reakcję zapalną", pt: "Alimentos processados desencadeando resposta inflamatória" } as L,
    sugar: { en: "Sugar intake elevating inflammation", sv: "Sockerintag ökar inflammation", de: "Zuckeraufnahme erhöht Entzündungen", fr: "Consommation de sucre élevant l'inflammation", es: "El azúcar elevando la inflamación", it: "L'assunzione di zucchero che eleva l'infiammazione", nl: "Suikerinname die ontsteking verhoogt", pl: "Spożycie cukru zwiększające stan zapalny", pt: "Consumo de açúcar elevando a inflamação" } as L,
    stress: { en: "Stress levels", sv: "Stressnivåer", de: "Stresslevel", fr: "Niveaux de stress", es: "Niveles de estrés", it: "Livelli di stress", nl: "Stressniveaus", pl: "Poziomy stresu", pt: "Níveis de stress" } as L,
    sleep: { en: "Poor sleep quality", sv: "Dålig sömnkvalitet", de: "Schlechte Schlafqualität", fr: "Mauvaise qualité du sommeil", es: "Mala calidad del sueño", it: "Scarsa qualità del sonno", nl: "Slechte slaapkwaliteit", pl: "Słaba jakość snu", pt: "Má qualidade do sono" } as L,
    hormones: { en: "Menstrual cycle hormones", sv: "Menstruationscykelhormoner", de: "Menstruationszyklushormone", fr: "Hormones du cycle menstruel", es: "Hormonas del ciclo menstrual", it: "Ormoni del ciclo mestruale", nl: "Menstruatiecyclushormonen", pl: "Hormony cyklu menstruacyjnego", pt: "Hormónios do ciclo menstrual" } as L,
    alcohol: { en: "Alcohol contributing to inflammation", sv: "Alkohol bidrar till inflammation", de: "Alkohol trägt zu Entzündungen bei", fr: "L'alcool contribuant à l'inflammation", es: "El alcohol contribuyendo a la inflamación", it: "L'alcol che contribuisce all'infiammazione", nl: "Alcohol dat bijdraagt aan ontsteking", pl: "Alkohol przyczyniający się do stanu zapalnego", pt: "Álcool contribuindo para a inflamação" } as L,
    illness: { en: "Illness causing elevated inflammatory response", sv: "Sjukdom orsakar förhöjd inflammatorisk respons", de: "Krankheit verursacht erhöhte Entzündungsreaktion", fr: "La maladie provoquant une réponse inflammatoire élevée", es: "La enfermedad causando respuesta inflamatoria elevada", it: "La malattia che causa risposta infiammatoria elevata", nl: "Ziekte die verhoogde ontstekingsreactie veroorzaakt", pl: "Choroba powodująca podwyższoną reakcję zapalną", pt: "Doença causando resposta inflamatória elevada" } as L,
  },
  howToImprove: [
    { en: "Eat anti-inflammatory foods (berries, leafy greens, fatty fish)", sv: "Ät antiinflammatoriska livsmedel (bär, bladgrönsaker, fet fisk)", de: "Essen Sie entzündungshemmende Lebensmittel", fr: "Mangez des aliments anti-inflammatoires", es: "Come alimentos antiinflamatorios", it: "Mangia cibi antinfiammatori", nl: "Eet ontstekingsremmende voeding", pl: "Jedz pokarmy przeciwzapalne", pt: "Coma alimentos anti-inflamatórios" } as L,
    { en: "Add turmeric and ginger to meals", sv: "Lägg till gurkmeja och ingefära i måltider", de: "Fügen Sie Kurkuma und Ingwer zu Mahlzeiten hinzu", fr: "Ajoutez du curcuma et du gingembre aux repas", es: "Añade cúrcuma y jengibre a las comidas", it: "Aggiungi curcuma e zenzero ai pasti", nl: "Voeg kurkuma en gember toe aan maaltijden", pl: "Dodawaj kurkumę i imbir do posiłków", pt: "Adicione açafrão e gengibre às refeições" } as L,
    { en: "Reduce sugar and processed foods", sv: "Minska socker och bearbetade livsmedel", de: "Reduzieren Sie Zucker und verarbeitete Lebensmittel", fr: "Réduisez le sucre et les aliments transformés", es: "Reduce el azúcar y los alimentos procesados", it: "Riduci lo zucchero e i cibi processati", nl: "Verminder suiker en bewerkt voedsel", pl: "Ogranicz cukier i przetworzoną żywność", pt: "Reduza açúcar e alimentos processados" } as L,
    { en: "Get adequate sleep (7-9 hours)", sv: "Få tillräcklig sömn (7-9 timmar)", de: "Schlafen Sie ausreichend (7-9 Stunden)", fr: "Dormez suffisamment (7-9 heures)", es: "Duerme lo suficiente (7-9 horas)", it: "Dormi a sufficienza (7-9 ore)", nl: "Slaap voldoende (7-9 uur)", pl: "Śpij wystarczająco (7-9 godzin)", pt: "Durma adequadamente (7-9 horas)" } as L,
    { en: "Practice stress management techniques", sv: "Öva stresshanteringstekniker", de: "Üben Sie Stressbewältigungstechniken", fr: "Pratiquez des techniques de gestion du stress", es: "Practica técnicas de manejo del estrés", it: "Pratica tecniche di gestione dello stress", nl: "Oefen stressmanagementtechnieken", pl: "Ćwicz techniki zarządzania stresem", pt: "Pratique técnicas de gestão de stress" } as L,
  ],
  phaseContext: {
    menstrual: { en: "Elevated inflammation is expected during menstruation due to prostaglandins. This is normal.", sv: "Förhöjd inflammation förväntas under menstruation på grund av prostaglandiner. Detta är normalt.", de: "Erhöhte Entzündungen sind während der Menstruation aufgrund von Prostaglandinen normal.", fr: "L'inflammation élevée est attendue pendant les menstruations. C'est normal.", es: "La inflamación elevada es esperada durante la menstruación. Es normal.", it: "L'infiammazione elevata è prevista durante le mestruazioni. È normale.", nl: "Verhoogde ontsteking is normaal tijdens de menstruatie.", pl: "Podwyższony stan zapalny jest oczekiwany podczas menstruacji. To normalne.", pt: "Inflamação elevada é esperada durante a menstruação. É normal." } as L,
    luteal: { en: "Some inflammation increase is normal in the luteal phase, especially near your period.", sv: "Viss inflammationsökning är normal i luteinfasen, särskilt nära din mens.", de: "Ein gewisser Anstieg der Entzündung ist in der Lutealphase normal.", fr: "Une certaine augmentation de l'inflammation est normale dans la phase lutéale.", es: "Un cierto aumento de la inflamación es normal en la fase lútea.", it: "Un certo aumento dell'infiammazione è normale nella fase luteale.", nl: "Enige toename van ontsteking is normaal in de luteale fase.", pl: "Pewien wzrost stanu zapalnego jest normalny w fazie lutealnej.", pt: "Algum aumento da inflamação é normal na fase lútea." } as L,
  },
  defaultPhaseContext: { en: "Inflammation levels can shift with your cycle. Track patterns to identify triggers.", sv: "Inflammationsnivåer kan ändras med din cykel. Spåra mönster för att identifiera utlösare.", de: "Entzündungswerte können mit Ihrem Zyklus schwanken. Verfolgen Sie Muster.", fr: "Les niveaux d'inflammation varient avec votre cycle. Suivez les tendances.", es: "Los niveles de inflamación pueden cambiar con tu ciclo. Rastrea patrones.", it: "I livelli di infiammazione possono variare con il ciclo. Monitora i modelli.", nl: "Ontstekingsniveaus kunnen variëren met je cyclus. Volg patronen.", pl: "Poziomy stanu zapalnego mogą się zmieniać z cyklem. Śledź wzorce.", pt: "Os níveis de inflamação podem variar com o ciclo. Acompanhe padrões." } as L,
};

const fatigueData = {
  title: { en: "Fatigue Level", sv: "Trötthetsnivå", de: "Erschöpfungsgrad", fr: "Niveau de fatigue", es: "Nivel de fatiga", it: "Livello di fatica", nl: "Vermoeidheidsniveau", pl: "Poziom zmęczenia", pt: "Nível de fadiga" } as L,
  whatWeMeasure: {
    en: "We analyze your eye photo for under-eye darkness, eye openness (alertness), pupil dark-to-light ratio, and sclera redness, and combine this with your daily check-in responses (sleep, energy) and cycle phase to estimate your fatigue level.",
    sv: "Vi analyserar ditt ögonfoto för mörka ringar under ögonen, ögonöppenhet (vakenhet), pupillens mörker-till-ljus-förhållande och sklerarödshet, och kombinerar detta med dina dagliga incheckningssvar (sömn, energi) och cykelfas.",
    de: "Wir analysieren Ihr Augenfoto auf Augenringe, Augenöffnung (Wachheit), Pupillenverhältnis und Sklerarötung, kombiniert mit Ihren Check-in-Antworten (Schlaf, Energie) und Zyklusphase.",
    fr: "Nous analysons votre photo oculaire pour les cernes, l'ouverture des yeux, le rapport pupillaire et la rougeur sclérale, combinés avec vos réponses quotidiennes (sommeil, énergie) et phase du cycle.",
    es: "Analizamos tu foto ocular para ojeras, apertura de ojos, proporción pupilar y rojez escleral, combinados con tus respuestas diarias (sueño, energía) y fase del ciclo.",
    it: "Analizziamo la tua foto oculare per occhiaie, apertura degli occhi, rapporto pupillare e rossore sclerale, combinati con le tue risposte giornaliere (sonno, energia) e fase del ciclo.",
    nl: "We analyseren je oogfoto op donkere kringen, oogopening (alertheid), pupilverhouding en sclera-roodheid, gecombineerd met je check-in-antwoorden (slaap, energie) en cyclusfase.",
    pl: "Analizujemy zdjęcie oka pod kątem cieni pod oczami, otwarcia oczu (czujności), stosunku źrenicy i zaczerwienienia twardówki, w połączeniu z odpowiedziami z check-in (sen, energia) i fazą cyklu.",
    pt: "Analisamos a foto do olho para olheiras, abertura dos olhos, proporção pupilar e vermelhidão escleral, combinados com as suas respostas diárias (sono, energia) e fase do ciclo.",
  } as L,
  whatAffects: {
    sleep: { en: "Sleep quantity and quality", sv: "Sömnkvantitet och kvalitet", de: "Schlafquantität und -qualität", fr: "Quantité et qualité du sommeil", es: "Cantidad y calidad del sueño", it: "Quantità e qualità del sonno", nl: "Hoeveelheid en kwaliteit slaap", pl: "Ilość i jakość snu", pt: "Quantidade e qualidade do sono" } as L,
    exertion: { en: "Physical exertion", sv: "Fysisk ansträngning", de: "Körperliche Anstrengung", fr: "Effort physique", es: "Esfuerzo físico", it: "Sforzo fisico", nl: "Fysieke inspanning", pl: "Wysiłek fizyczny", pt: "Esforço físico" } as L,
    mental: { en: "Mental workload", sv: "Mental arbetsbelastning", de: "Mentale Arbeitsbelastung", fr: "Charge mentale", es: "Carga mental", it: "Carico mentale", nl: "Mentale werkbelasting", pl: "Obciążenie psychiczne", pt: "Carga mental" } as L,
    nutrition: { en: "Nutrition deficiencies", sv: "Näringsbrist", de: "Nährstoffmangel", fr: "Carences nutritionnelles", es: "Deficiencias nutricionales", it: "Carenze nutrizionali", nl: "Voedingstekorten", pl: "Niedobory żywieniowe", pt: "Deficiências nutricionais" } as L,
    hormones: { en: "Hormone fluctuations in your cycle", sv: "Hormonfluktuationer i din cykel", de: "Hormonschwankungen in Ihrem Zyklus", fr: "Fluctuations hormonales dans votre cycle", es: "Fluctuaciones hormonales en tu ciclo", it: "Fluttuazioni ormonali nel tuo ciclo", nl: "Hormoonschommelingen in je cyclus", pl: "Wahania hormonalne w cyklu", pt: "Flutuações hormonais no seu ciclo" } as L,
    illness: { en: "Illness increasing fatigue", sv: "Sjukdom ökar trötthet", de: "Krankheit erhöht Erschöpfung", fr: "La maladie augmentant la fatigue", es: "La enfermedad aumentando la fatiga", it: "La malattia che aumenta la fatica", nl: "Ziekte die vermoeidheid verhoogt", pl: "Choroba zwiększająca zmęczenie", pt: "Doença aumentando a fadiga" } as L,
    alcohol: { en: "Alcohol disrupting deep sleep", sv: "Alkohol stör djup sömn", de: "Alkohol stört den Tiefschlaf", fr: "L'alcool perturbant le sommeil profond", es: "El alcohol alterando el sueño profundo", it: "L'alcol che disturba il sonno profondo", nl: "Alcohol dat diepe slaap verstoort", pl: "Alkohol zaburzający głęboki sen", pt: "Álcool perturbando o sono profundo" } as L,
  },
  howToImprove: [
    { en: "Prioritize 7-9 hours of quality sleep", sv: "Prioritera 7-9 timmars kvalitetssömn", de: "Priorisieren Sie 7-9 Stunden Qualitätsschlaf", fr: "Priorisez 7-9 heures de sommeil de qualité", es: "Prioriza 7-9 horas de sueño de calidad", it: "Dai priorità a 7-9 ore di sonno di qualità", nl: "Geef prioriteit aan 7-9 uur kwaliteitsslaap", pl: "Priorytetowo traktuj 7-9 godzin dobrego snu", pt: "Priorize 7-9 horas de sono de qualidade" } as L,
    { en: "Take regular breaks during work", sv: "Ta regelbundna pauser under arbetet", de: "Machen Sie regelmäßig Pausen", fr: "Prenez des pauses régulières", es: "Toma descansos regulares durante el trabajo", it: "Fai pause regolari durante il lavoro", nl: "Neem regelmatig pauzes tijdens het werk", pl: "Rób regularne przerwy w pracy", pt: "Faça pausas regulares durante o trabalho" } as L,
    { en: "Balance high-intensity activities with rest", sv: "Balansera högintensiva aktiviteter med vila", de: "Balancieren Sie intensive Aktivitäten mit Ruhe", fr: "Équilibrez les activités intenses avec du repos", es: "Equilibra actividades de alta intensidad con descanso", it: "Bilancia attività ad alta intensità con riposo", nl: "Balanceer intense activiteiten met rust", pl: "Równoważ intensywne aktywności z odpoczynkiem", pt: "Equilibre atividades de alta intensidade com descanso" } as L,
    { en: "Ensure adequate iron and B12 intake", sv: "Säkerställ tillräckligt intag av järn och B12", de: "Stellen Sie eine ausreichende Eisen- und B12-Aufnahme sicher", fr: "Assurez un apport suffisant en fer et B12", es: "Asegura una ingesta adecuada de hierro y B12", it: "Assicura un adeguato apporto di ferro e B12", nl: "Zorg voor voldoende ijzer- en B12-inname", pl: "Zapewnij odpowiednie spożycie żelaza i B12", pt: "Garanta ingestão adequada de ferro e B12" } as L,
    { en: "Limit screen time before bed", sv: "Begränsa skärmtid före sänggåendet", de: "Begrenzen Sie die Bildschirmzeit vor dem Schlafengehen", fr: "Limitez le temps d'écran avant le coucher", es: "Limita el tiempo de pantalla antes de dormir", it: "Limita il tempo davanti allo schermo prima di dormire", nl: "Beperk schermtijd voor het slapengaan", pl: "Ogranicz czas ekranowy przed snem", pt: "Limite o tempo de ecrã antes de dormir" } as L,
  ],
  phaseContext: {
    menstrual: { en: "Higher fatigue is normal during your period. Blood loss and hormonal changes naturally reduce energy reserves.", sv: "Högre trötthet är normalt under din mens. Blodförlust och hormonförändringar minskar naturligt energireserver.", de: "Höhere Müdigkeit ist während der Periode normal. Blutverlust und hormonelle Veränderungen reduzieren Energiereserven.", fr: "Une fatigue accrue est normale pendant vos règles.", es: "Una mayor fatiga es normal durante tu período.", it: "Una maggiore fatica è normale durante il ciclo.", nl: "Hogere vermoeidheid is normaal tijdens je menstruatie.", pl: "Wyższe zmęczenie jest normalne podczas okresu.", pt: "Maior fadiga é normal durante o período." } as L,
  },
  defaultPhaseContext: { en: "Fatigue levels naturally vary with your cycle. Prioritize rest when needed.", sv: "Trötthetsnivåer varierar naturligt med din cykel. Prioritera vila när det behövs.", de: "Erschöpfungsgrade variieren natürlich mit Ihrem Zyklus. Priorisieren Sie Ruhe.", fr: "Les niveaux de fatigue varient naturellement avec votre cycle.", es: "Los niveles de fatiga varían naturalmente con tu ciclo.", it: "I livelli di fatica variano naturalmente con il ciclo.", nl: "Vermoeidheidsniveaus variëren van nature met je cyclus.", pl: "Poziomy zmęczenia naturalnie zmieniają się z cyklem.", pt: "Os níveis de fadiga variam naturalmente com o ciclo." } as L,
};

const cognitiveSharpnessData = {
  title: { en: "Cognitive Sharpness", sv: "Kognitiv skärpa", de: "Kognitive Schärfe", fr: "Acuité cognitive", es: "Agudeza cognitiva", it: "Acutezza cognitiva", nl: "Cognitieve scherpte", pl: "Ostrość poznawcza", pt: "Acuidade cognitiva" } as L,
  whatWeMeasure: {
    en: "This is estimated from your daily check-in responses and menstrual cycle phase. It does not use eye scan data directly.",
    sv: "Detta uppskattas från dina dagliga incheckningssvar och menstruationscykelfas. Det använder inte ögonskanningsdata direkt.",
    de: "Dies wird aus Ihren täglichen Check-in-Antworten und Menstruationszyklusphase geschätzt. Es verwendet keine Augenscandaten direkt.",
    fr: "Ceci est estimé à partir de vos réponses quotidiennes et de votre phase du cycle menstruel. N'utilise pas directement les données du scan oculaire.",
    es: "Esto se estima a partir de tus respuestas diarias y fase del ciclo menstrual. No utiliza datos del escaneo ocular directamente.",
    it: "Questo è stimato dalle tue risposte giornaliere e dalla fase del ciclo mestruale. Non utilizza direttamente i dati della scansione oculare.",
    nl: "Dit wordt geschat op basis van je dagelijkse check-in-antwoorden en menstruatiecyclusfase. Gebruikt geen oogscangegevens direct.",
    pl: "Jest to szacowane na podstawie Twoich codziennych odpowiedzi i fazy cyklu menstruacyjnego. Nie wykorzystuje bezpośrednio danych ze skanowania oka.",
    pt: "Isto é estimado a partir das suas respostas diárias e fase do ciclo menstrual. Não utiliza dados do scan ocular diretamente.",
  } as L,
  whatAffects: {
    sleep: { en: "Sleep quality", sv: "Sömnkvalitet", de: "Schlafqualität", fr: "Qualité du sommeil", es: "Calidad del sueño", it: "Qualità del sonno", nl: "Slaapkwaliteit", pl: "Jakość snu", pt: "Qualidade do sono" } as L,
    stress: { en: "Stress levels", sv: "Stressnivåer", de: "Stresslevel", fr: "Niveaux de stress", es: "Niveles de estrés", it: "Livelli di stress", nl: "Stressniveaus", pl: "Poziomy stresu", pt: "Níveis de stress" } as L,
    sugar: { en: "Blood sugar instability from sugar intake", sv: "Blodsockerinstabilitet från sockerintag", de: "Blutzuckerinstabilität durch Zuckeraufnahme", fr: "Instabilité glycémique due au sucre", es: "Inestabilidad de azúcar en sangre", it: "Instabilità glicemica da assunzione di zucchero", nl: "Bloedsuikerinstabiliteit door suikerinname", pl: "Niestabilność poziomu cukru we krwi", pt: "Instabilidade de açúcar no sangue" } as L,
    hydration: { en: "Hydration", sv: "Hydrering", de: "Hydratation", fr: "Hydratation", es: "Hidratación", it: "Idratazione", nl: "Hydratatie", pl: "Nawodnienie", pt: "Hidratação" } as L,
    cycle: { en: "Menstrual cycle phase", sv: "Menstruationscykelfas", de: "Menstruationszyklusphase", fr: "Phase du cycle menstruel", es: "Fase del ciclo menstrual", it: "Fase del ciclo mestruale", nl: "Menstruatiecyclusfase", pl: "Faza cyklu menstruacyjnego", pt: "Fase do ciclo menstrual" } as L,
    caffeine: { en: "Caffeine affecting focus and concentration", sv: "Koffein påverkar fokus och koncentration", de: "Koffein beeinflusst Fokus und Konzentration", fr: "La caféine affectant la concentration", es: "La cafeína afectando la concentración", it: "La caffeina che influenza la concentrazione", nl: "Cafeïne die focus en concentratie beïnvloedt", pl: "Kofeina wpływająca na skupienie", pt: "Cafeína afetando foco e concentração" } as L,
  },
  howToImprove: [
    { en: "Get consistent sleep schedule", sv: "Få ett konsekvent sömnschema", de: "Halten Sie einen regelmäßigen Schlafrhythmus ein", fr: "Maintenez un horaire de sommeil régulier", es: "Mantén un horario de sueño consistente", it: "Mantieni un programma di sonno costante", nl: "Houd een consistent slaapschema aan", pl: "Utrzymuj regularny harmonogram snu", pt: "Mantenha um horário de sono consistente" } as L,
    { en: "Eat regular balanced meals", sv: "Ät regelbundna balanserade måltider", de: "Essen Sie regelmäßig ausgewogene Mahlzeiten", fr: "Mangez des repas réguliers et équilibrés", es: "Come comidas regulares y equilibradas", it: "Mangia pasti regolari ed equilibrati", nl: "Eet regelmatige uitgebalanceerde maaltijden", pl: "Jedz regularne zbilansowane posiłki", pt: "Coma refeições regulares e equilibradas" } as L,
    { en: "Practice mindfulness or meditation", sv: "Öva mindfulness eller meditation", de: "Üben Sie Achtsamkeit oder Meditation", fr: "Pratiquez la pleine conscience ou la méditation", es: "Practica mindfulness o meditación", it: "Pratica la mindfulness o la meditazione", nl: "Oefen mindfulness of meditatie", pl: "Ćwicz uważność lub medytację", pt: "Pratique mindfulness ou meditação" } as L,
    { en: "Take breaks between focused tasks", sv: "Ta pauser mellan fokuserade uppgifter", de: "Machen Sie Pausen zwischen konzentrierten Aufgaben", fr: "Faites des pauses entre les tâches concentrées", es: "Toma descansos entre tareas enfocadas", it: "Fai pause tra compiti concentrati", nl: "Neem pauzes tussen gefocuste taken", pl: "Rób przerwy między skupionymi zadaniami", pt: "Faça pausas entre tarefas focadas" } as L,
    { en: "Stay hydrated throughout the day", sv: "Håll dig hydrerad hela dagen", de: "Bleiben Sie den ganzen Tag hydriert", fr: "Restez hydratée tout au long de la journée", es: "Mantente hidratada todo el día", it: "Mantieniti idratata durante il giorno", nl: "Blijf de hele dag gehydrateerd", pl: "Pij dużo wody przez cały dzień", pt: "Mantenha-se hidratada ao longo do dia" } as L,
  ],
  phaseContext: {
    follicular: { en: "Mental clarity peaks in the follicular phase. Great time for learning and problem-solving.", sv: "Mental klarhet når sin topp i follikelfasen. Bra tid för lärande och problemlösning.", de: "Mentale Klarheit erreicht in der Follikelphase ihren Höhepunkt.", fr: "La clarté mentale atteint son pic pendant la phase folliculaire.", es: "La claridad mental alcanza su pico en la fase folicular.", it: "La chiarezza mentale raggiunge il picco nella fase follicolare.", nl: "Mentale helderheid piekt in de folliculaire fase.", pl: "Klarność umysłu osiąga szczyt w fazie folikularnej.", pt: "A clareza mental atinge o pico na fase folicular." } as L,
    ovulation: { en: "Peak mental performance. Optimal window for challenging cognitive tasks.", sv: "Topp mental prestation. Optimalt fönster för utmanande kognitiva uppgifter.", de: "Höchste mentale Leistung. Optimales Fenster für anspruchsvolle kognitive Aufgaben.", fr: "Performance mentale maximale. Fenêtre optimale pour les tâches cognitives.", es: "Rendimiento mental máximo. Ventana óptima para tareas cognitivas desafiantes.", it: "Prestazione mentale massima. Finestra ottimale per compiti cognitivi impegnativi.", nl: "Piek mentale prestatie. Optimaal venster voor uitdagende cognitieve taken.", pl: "Szczytowa wydajność umysłowa. Optymalny czas na wymagające zadania poznawcze.", pt: "Desempenho mental máximo. Janela ótima para tarefas cognitivas desafiantes." } as L,
  },
  defaultPhaseContext: { en: "Cognitive function varies with your cycle. Track your sharpest days.", sv: "Kognitiv funktion varierar med din cykel. Spåra dina skarpaste dagar.", de: "Die kognitive Funktion variiert mit Ihrem Zyklus.", fr: "La fonction cognitive varie avec votre cycle.", es: "La función cognitiva varía con tu ciclo.", it: "La funzione cognitiva varia con il ciclo.", nl: "Cognitieve functie varieert met je cyclus.", pl: "Funkcje poznawcze zmieniają się z cyklem.", pt: "A função cognitiva varia com o ciclo." } as L,
};

const emotionalSensitivityData = {
  title: { en: "Emotional Sensitivity", sv: "Emotionell känslighet", de: "Emotionale Empfindlichkeit", fr: "Sensibilité émotionnelle", es: "Sensibilidad emocional", it: "Sensibilità emotiva", nl: "Emotionele gevoeligheid", pl: "Wrażliwość emocjonalna", pt: "Sensibilidade emocional" } as L,
  whatWeMeasure: {
    en: "This is estimated from your daily check-in responses and menstrual cycle phase. It does not use eye scan data directly.",
    sv: "Detta uppskattas från dina dagliga incheckningssvar och menstruationscykelfas. Det använder inte ögonskanningsdata direkt.",
    de: "Dies wird aus Ihren täglichen Check-in-Antworten und Menstruationszyklusphase geschätzt. Es verwendet keine Augenscandaten direkt.",
    fr: "Ceci est estimé à partir de vos réponses quotidiennes et de votre phase du cycle. N'utilise pas les données du scan oculaire directement.",
    es: "Esto se estima a partir de tus respuestas diarias y fase del ciclo. No utiliza datos del escaneo ocular directamente.",
    it: "Questo è stimato dalle tue risposte giornaliere e dalla fase del ciclo. Non utilizza i dati della scansione oculare direttamente.",
    nl: "Dit wordt geschat op basis van je dagelijkse check-in-antwoorden en cyclusfase. Gebruikt geen oogscangegevens direct.",
    pl: "Jest to szacowane na podstawie Twoich codziennych odpowiedzi i fazy cyklu. Nie wykorzystuje bezpośrednio danych ze skanowania oka.",
    pt: "Isto é estimado a partir das suas respostas diárias e fase do ciclo. Não utiliza dados do scan ocular diretamente.",
  } as L,
  whatAffects: {
    hormones: { en: "Hormonal fluctuations", sv: "Hormonfluktuationer", de: "Hormonschwankungen", fr: "Fluctuations hormonales", es: "Fluctuaciones hormonales", it: "Fluttuazioni ormonali", nl: "Hormoonschommelingen", pl: "Wahania hormonalne", pt: "Flutuações hormonais" } as L,
    stress: { en: "Stress levels", sv: "Stressnivåer", de: "Stresslevel", fr: "Niveaux de stress", es: "Niveles de estrés", it: "Livelli di stress", nl: "Stressniveaus", pl: "Poziomy stresu", pt: "Níveis de stress" } as L,
    sleep: { en: "Sleep quality", sv: "Sömnkvalitet", de: "Schlafqualität", fr: "Qualité du sommeil", es: "Calidad del sueño", it: "Qualità del sonno", nl: "Slaapkwaliteit", pl: "Jakość snu", pt: "Qualidade do sono" } as L,
    life: { en: "Life stressors", sv: "Livsstressfaktorer", de: "Lebensstressoren", fr: "Facteurs de stress de la vie", es: "Factores de estrés vital", it: "Fattori di stress della vita", nl: "Levensstressoren", pl: "Stresory życiowe", pt: "Fatores de stress da vida" } as L,
    cycle: { en: "Cycle phase", sv: "Cykelfas", de: "Zyklusphase", fr: "Phase du cycle", es: "Fase del ciclo", it: "Fase del ciclo", nl: "Cyclusfase", pl: "Faza cyklu", pt: "Fase do ciclo" } as L,
    caffeine: { en: "Caffeine amplifying stress response", sv: "Koffein förstärker stressrespons", de: "Koffein verstärkt die Stressreaktion", fr: "La caféine amplifiant la réponse au stress", es: "La cafeína amplificando la respuesta al estrés", it: "La caffeina che amplifica la risposta allo stress", nl: "Cafeïne die stressrespons versterkt", pl: "Kofeina wzmacniająca reakcję stresową", pt: "Cafeína amplificando a resposta ao stress" } as L,
  },
  howToImprove: [
    { en: "Practice emotional awareness and journaling", sv: "Öva emotionell medvetenhet och dagboksskrivande", de: "Üben Sie emotionale Achtsamkeit und Tagebuchschreiben", fr: "Pratiquez la conscience émotionnelle et le journal intime", es: "Practica la conciencia emocional y el diario", it: "Pratica la consapevolezza emotiva e il diario", nl: "Oefen emotioneel bewustzijn en journaling", pl: "Ćwicz świadomość emocjonalną i pisanie dziennika", pt: "Pratique consciência emocional e diário" } as L,
    { en: "Establish healthy boundaries", sv: "Etablera hälsosamma gränser", de: "Setzen Sie gesunde Grenzen", fr: "Établissez des limites saines", es: "Establece límites saludables", it: "Stabilisci confini sani", nl: "Stel gezonde grenzen", pl: "Ustal zdrowe granice", pt: "Estabeleça limites saudáveis" } as L,
    { en: "Get adequate rest", sv: "Få tillräcklig vila", de: "Ruhen Sie sich ausreichend aus", fr: "Reposez-vous suffisamment", es: "Descansa lo suficiente", it: "Riposati adeguatamente", nl: "Rust voldoende uit", pl: "Odpoczywaj wystarczająco", pt: "Descanse adequadamente" } as L,
    { en: "Try relaxation techniques", sv: "Prova avslappningstekniker", de: "Versuchen Sie Entspannungstechniken", fr: "Essayez des techniques de relaxation", es: "Prueba técnicas de relajación", it: "Prova tecniche di rilassamento", nl: "Probeer ontspanningstechnieken", pl: "Wypróbuj techniki relaksacyjne", pt: "Experimente técnicas de relaxamento" } as L,
    { en: "Consider adapting expectations based on cycle phase", sv: "Överväg att anpassa förväntningar baserat på cykelfas", de: "Erwägen Sie, Erwartungen an die Zyklusphase anzupassen", fr: "Adaptez vos attentes en fonction de votre phase du cycle", es: "Considera adaptar expectativas según la fase del ciclo", it: "Considera di adattare le aspettative in base alla fase del ciclo", nl: "Overweeg verwachtingen aan te passen op basis van cyclusfase", pl: "Rozważ dostosowanie oczekiwań do fazy cyklu", pt: "Considere adaptar expectativas com base na fase do ciclo" } as L,
  ],
  phaseContext: {
    ovulation: { en: "You may feel more emotionally stable and resilient during ovulation due to peak estrogen.", sv: "Du kan känna dig mer emotionellt stabil och motståndskraftig under ovulation på grund av topp östrogen.", de: "Sie können sich während des Eisprungs emotional stabiler fühlen.", fr: "Vous pouvez vous sentir plus stable émotionnellement pendant l'ovulation.", es: "Puedes sentirte más estable emocionalmente durante la ovulación.", it: "Potresti sentirti più stabile emotivamente durante l'ovulazione.", nl: "Je kunt je emotioneel stabieler voelen tijdens de ovulatie.", pl: "Możesz czuć się bardziej stabilna emocjonalnie podczas owulacji.", pt: "Pode sentir-se mais estável emocionalmente durante a ovulação." } as L,
    luteal: { en: "Increased sensitivity is normal as progesterone fluctuates. Honor your emotional needs.", sv: "Ökad känslighet är normal när progesteron fluktuerar. Hedra dina emotionella behov.", de: "Erhöhte Empfindlichkeit ist normal bei Progesteronschwankungen.", fr: "Une sensibilité accrue est normale quand la progestérone fluctue.", es: "Mayor sensibilidad es normal cuando la progesterona fluctúa.", it: "Una maggiore sensibilità è normale quando il progesterone fluttua.", nl: "Verhoogde gevoeligheid is normaal bij progesteronschommelingen.", pl: "Zwiększona wrażliwość jest normalna przy wahaniach progesteronu.", pt: "Maior sensibilidade é normal quando a progesterona flutua." } as L,
  },
  defaultPhaseContext: { en: "Emotional sensitivity naturally varies with hormonal changes.", sv: "Emotionell känslighet varierar naturligt med hormonförändringar.", de: "Emotionale Empfindlichkeit variiert natürlich mit hormonellen Veränderungen.", fr: "La sensibilité émotionnelle varie naturellement avec les changements hormonaux.", es: "La sensibilidad emocional varía naturalmente con los cambios hormonales.", it: "La sensibilità emotiva varia naturalmente con i cambiamenti ormonali.", nl: "Emotionele gevoeligheid varieert van nature met hormonale veranderingen.", pl: "Wrażliwość emocjonalna naturalnie zmienia się z hormonami.", pt: "A sensibilidade emocional varia naturalmente com as alterações hormonais." } as L,
};

const socialEnergyData = {
  title: { en: "Social Energy", sv: "Social energi", de: "Soziale Energie", fr: "Énergie sociale", es: "Energía social", it: "Energia sociale", nl: "Sociale energie", pl: "Energia społeczna", pt: "Energia social" } as L,
  whatWeMeasure: {
    en: "This is estimated from your daily check-in responses and menstrual cycle phase. It does not use eye scan data directly.",
    sv: "Detta uppskattas från dina dagliga incheckningssvar och menstruationscykelfas. Det använder inte ögonskanningsdata direkt.",
    de: "Dies wird aus Ihren täglichen Check-in-Antworten und Menstruationszyklusphase geschätzt. Es verwendet keine Augenscandaten direkt.",
    fr: "Ceci est estimé à partir de vos réponses quotidiennes et de votre phase du cycle. N'utilise pas les données du scan oculaire directement.",
    es: "Esto se estima a partir de tus respuestas diarias y fase del ciclo. No utiliza datos del escaneo ocular directamente.",
    it: "Questo è stimato dalle tue risposte giornaliere e dalla fase del ciclo. Non utilizza i dati della scansione oculare direttamente.",
    nl: "Dit wordt geschat op basis van je dagelijkse check-in-antwoorden en cyclusfase. Gebruikt geen oogscangegevens direct.",
    pl: "Jest to szacowane na podstawie Twoich codziennych odpowiedzi i fazy cyklu. Nie wykorzystuje bezpośrednio danych ze skanowania oka.",
    pt: "Isto é estimado a partir das suas respostas diárias e fase do ciclo. Não utiliza dados do scan ocular diretamente.",
  } as L,
  whatAffects: {
    energy: { en: "Overall energy levels", sv: "Övergripande energinivåer", de: "Allgemeines Energieniveau", fr: "Niveaux d'énergie globaux", es: "Niveles generales de energía", it: "Livelli di energia generali", nl: "Algehele energieniveaus", pl: "Ogólne poziomy energii", pt: "Níveis gerais de energia" } as L,
    stress: { en: "Stress and overwhelm", sv: "Stress och överväldigande", de: "Stress und Überforderung", fr: "Stress et surcharge", es: "Estrés y agobio", it: "Stress e sovraccarico", nl: "Stress en overweldiging", pl: "Stres i przytłoczenie", pt: "Stress e sobrecarga" } as L,
    sleep: { en: "Poor sleep reducing social capacity", sv: "Dålig sömn minskar social kapacitet", de: "Schlechter Schlaf reduziert soziale Kapazität", fr: "Le manque de sommeil réduisant la capacité sociale", es: "El mal sueño reduciendo la capacidad social", it: "Il sonno scarso che riduce la capacità sociale", nl: "Slechte slaap die sociale capaciteit vermindert", pl: "Słaby sen zmniejszający zdolności społeczne", pt: "Sono fraco reduzindo a capacidade social" } as L,
    cycle: { en: "Hormonal cycle phase", sv: "Hormonell cykelfas", de: "Hormonelle Zyklusphase", fr: "Phase hormonale du cycle", es: "Fase hormonal del ciclo", it: "Fase ormonale del ciclo", nl: "Hormonale cyclusfase", pl: "Hormonalna faza cyklu", pt: "Fase hormonal do ciclo" } as L,
    illness: { en: "Feeling unwell reducing social energy", sv: "Att känna sig sjuk minskar social energi", de: "Unwohlsein reduziert soziale Energie", fr: "Se sentir mal réduit l'énergie sociale", es: "Sentirse mal reduciendo la energía social", it: "Sentirsi male riduce l'energia sociale", nl: "Je onwel voelen vermindert sociale energie", pl: "Złe samopoczucie zmniejszające energię społeczną", pt: "Sentir-se mal reduzindo a energia social" } as L,
  },
  howToImprove: [
    { en: "Balance social time with alone time", sv: "Balansera social tid med ensam tid", de: "Balancieren Sie soziale und Alleinzeit", fr: "Équilibrez le temps social et le temps seul", es: "Equilibra el tiempo social con el tiempo a solas", it: "Bilancia il tempo sociale con il tempo da sola", nl: "Balanceer sociale tijd met alleen-tijd", pl: "Równoważ czas towarzyski z czasem dla siebie", pt: "Equilibre tempo social com tempo sozinha" } as L,
    { en: "Schedule socializing when energy is higher", sv: "Schemalägg socialisering när energin är högre", de: "Planen Sie Sozialkontakte, wenn die Energie höher ist", fr: "Planifiez les activités sociales quand l'énergie est plus élevée", es: "Programa socialización cuando la energía es más alta", it: "Pianifica la socializzazione quando l'energia è più alta", nl: "Plan socialiseren wanneer de energie hoger is", pl: "Planuj spotkania towarzyskie, gdy energia jest wyższa", pt: "Agende socialização quando a energia for mais alta" } as L,
    { en: "Set boundaries around commitments", sv: "Sätt gränser kring åtaganden", de: "Setzen Sie Grenzen bei Verpflichtungen", fr: "Fixez des limites concernant les engagements", es: "Establece límites en los compromisos", it: "Stabilisci limiti negli impegni", nl: "Stel grenzen aan verplichtingen", pl: "Ustalaj granice zobowiązań", pt: "Estabeleça limites nos compromissos" } as L,
    { en: "Rest before and after social events", sv: "Vila före och efter sociala evenemang", de: "Ruhen Sie vor und nach sozialen Veranstaltungen", fr: "Reposez-vous avant et après les événements sociaux", es: "Descansa antes y después de eventos sociales", it: "Riposati prima e dopo eventi sociali", nl: "Rust voor en na sociale evenementen", pl: "Odpoczywaj przed i po wydarzeniach towarzyskich", pt: "Descanse antes e depois de eventos sociais" } as L,
    { en: "Choose quality over quantity in interactions", sv: "Välj kvalitet över kvantitet i interaktioner", de: "Wählen Sie Qualität statt Quantität bei Interaktionen", fr: "Privilégiez la qualité à la quantité dans les interactions", es: "Elige calidad sobre cantidad en las interacciones", it: "Scegli la qualità sulla quantità nelle interazioni", nl: "Kies kwaliteit boven kwantiteit in interacties", pl: "Wybieraj jakość ponad ilość w interakcjach", pt: "Escolha qualidade sobre quantidade nas interações" } as L,
  ],
  phaseContext: {
    follicular: { en: "Rising estrogen enhances social confidence and connection. You'll likely feel more outgoing.", sv: "Stigande östrogen förbättrar socialt självförtroende och koppling. Du kommer troligen att känna dig mer utåtriktad.", de: "Steigendes Östrogen verbessert soziales Selbstvertrauen.", fr: "L'augmentation des œstrogènes améliore la confiance sociale.", es: "El estrógeno en aumento mejora la confianza social.", it: "L'aumento degli estrogeni migliora la fiducia sociale.", nl: "Stijgend oestrogeen verbetert sociaal zelfvertrouwen.", pl: "Rosnący estrogen zwiększa pewność siebie w kontaktach społecznych.", pt: "O estrogénio em ascensão melhora a confiança social." } as L,
  },
  defaultPhaseContext: { en: "Social energy ebbs and flows with your cycle. Plan accordingly.", sv: "Social energi fluktuerar med din cykel. Planera därefter.", de: "Soziale Energie schwankt mit Ihrem Zyklus. Planen Sie entsprechend.", fr: "L'énergie sociale fluctue avec votre cycle. Planifiez en conséquence.", es: "La energía social fluctúa con tu ciclo. Planifica en consecuencia.", it: "L'energia sociale fluttua con il ciclo. Pianifica di conseguenza.", nl: "Sociale energie fluctueert met je cyclus. Plan dienovereenkomstig.", pl: "Energia społeczna zmienia się z cyklem. Planuj odpowiednio.", pt: "A energia social flutua com o ciclo. Planeie em conformidade." } as L,
};

const moodVolatilityData = {
  title: { en: "Mood Variability", sv: "Humörvariation", de: "Stimmungsschwankungen", fr: "Variabilité de l'humeur", es: "Variabilidad del ánimo", it: "Variabilità dell'umore", nl: "Stemmingsvariabiliteit", pl: "Zmienność nastroju", pt: "Variabilidade de humor" } as L,
  whatWeMeasure: {
    en: "This is estimated from your daily check-in responses and menstrual cycle phase. It does not use eye scan data directly.",
    sv: "Detta uppskattas från dina dagliga incheckningssvar och menstruationscykelfas. Det använder inte ögonskanningsdata direkt.",
    de: "Dies wird aus Ihren täglichen Check-in-Antworten und Menstruationszyklusphase geschätzt. Es verwendet keine Augenscandaten direkt.",
    fr: "Ceci est estimé à partir de vos réponses quotidiennes et de votre phase du cycle. N'utilise pas les données du scan oculaire directement.",
    es: "Esto se estima a partir de tus respuestas diarias y fase del ciclo. No utiliza datos del escaneo ocular directamente.",
    it: "Questo è stimato dalle tue risposte giornaliere e dalla fase del ciclo. Non utilizza i dati della scansione oculare direttamente.",
    nl: "Dit wordt geschat op basis van je dagelijkse check-in-antwoorden en cyclusfase. Gebruikt geen oogscangegevens direct.",
    pl: "Jest to szacowane na podstawie Twoich codziennych odpowiedzi i fazy cyklu. Nie wykorzystuje bezpośrednio danych ze skanowania oka.",
    pt: "Isto é estimado a partir das suas respostas diárias e fase do ciclo. Não utiliza dados do scan ocular diretamente.",
  } as L,
  whatAffects: {
    hormones: { en: "Hormonal changes in cycle", sv: "Hormonförändringar i cykel", de: "Hormonelle Veränderungen im Zyklus", fr: "Changements hormonaux dans le cycle", es: "Cambios hormonales en el ciclo", it: "Cambiamenti ormonali nel ciclo", nl: "Hormonale veranderingen in cyclus", pl: "Zmiany hormonalne w cyklu", pt: "Alterações hormonais no ciclo" } as L,
    sugar: { en: "Blood sugar swings from sugar intake", sv: "Blodsockersvängningar från sockerintag", de: "Blutzuckerschwankungen durch Zuckeraufnahme", fr: "Fluctuations glycémiques dues au sucre", es: "Oscilaciones de azúcar en sangre", it: "Oscillazioni glicemiche da assunzione di zucchero", nl: "Bloedsuikerschommelingen door suikerinname", pl: "Wahania poziomu cukru we krwi", pt: "Oscilações de açúcar no sangue" } as L,
    sleep: { en: "Sleep disruption", sv: "Sömnstörning", de: "Schlafstörungen", fr: "Perturbation du sommeil", es: "Alteración del sueño", it: "Disturbi del sonno", nl: "Slaapverstoring", pl: "Zaburzenia snu", pt: "Perturbação do sono" } as L,
    stress: { en: "Stress accumulation", sv: "Stressackumulering", de: "Stressanhäufung", fr: "Accumulation de stress", es: "Acumulación de estrés", it: "Accumulo di stress", nl: "Stressaccumulatie", pl: "Akumulacja stresu", pt: "Acumulação de stress" } as L,
    nutrition: { en: "Nutritional deficiencies", sv: "Näringsbrist", de: "Nährstoffmangel", fr: "Carences nutritionnelles", es: "Deficiencias nutricionales", it: "Carenze nutrizionali", nl: "Voedingstekorten", pl: "Niedobory żywieniowe", pt: "Deficiências nutricionais" } as L,
    caffeine: { en: "Caffeine contributing to mood fluctuations", sv: "Koffein bidrar till humörsvängningar", de: "Koffein trägt zu Stimmungsschwankungen bei", fr: "La caféine contribuant aux fluctuations d'humeur", es: "La cafeína contribuyendo a las fluctuaciones del ánimo", it: "La caffeina che contribuisce alle fluttuazioni dell'umore", nl: "Cafeïne dat bijdraagt aan stemmingswisselingen", pl: "Kofeina przyczyniająca się do wahań nastroju", pt: "Cafeína contribuindo para flutuações de humor" } as L,
  },
  howToImprove: [
    { en: "Eat balanced meals to stabilize blood sugar", sv: "Ät balanserade måltider för att stabilisera blodsocker", de: "Essen Sie ausgewogene Mahlzeiten zur Blutzuckerstabilisierung", fr: "Mangez des repas équilibrés pour stabiliser la glycémie", es: "Come comidas equilibradas para estabilizar el azúcar en sangre", it: "Mangia pasti equilibrati per stabilizzare la glicemia", nl: "Eet uitgebalanceerde maaltijden om bloedsuiker te stabiliseren", pl: "Jedz zbilansowane posiłki, aby ustabilizować poziom cukru", pt: "Coma refeições equilibradas para estabilizar o açúcar no sangue" } as L,
    { en: "Prioritize consistent sleep schedule", sv: "Prioritera konsekvent sömnschema", de: "Priorisieren Sie einen regelmäßigen Schlafrhythmus", fr: "Priorisez un horaire de sommeil régulier", es: "Prioriza un horario de sueño consistente", it: "Dai priorità a un programma di sonno costante", nl: "Geef prioriteit aan een consistent slaapschema", pl: "Priorytetowo traktuj regularny harmonogram snu", pt: "Priorize um horário de sono consistente" } as L,
    { en: "Practice stress management daily", sv: "Öva stresshantering dagligen", de: "Üben Sie täglich Stressbewältigung", fr: "Pratiquez la gestion du stress quotidiennement", es: "Practica el manejo del estrés diariamente", it: "Pratica la gestione dello stress quotidianamente", nl: "Oefen dagelijks stressmanagement", pl: "Ćwicz codziennie zarządzanie stresem", pt: "Pratique gestão de stress diariamente" } as L,
    { en: "Consider magnesium supplementation", sv: "Överväg magnesiumtillskott", de: "Erwägen Sie Magnesiumergänzung", fr: "Envisagez une supplémentation en magnésium", es: "Considera suplementación de magnesio", it: "Considera l'integrazione di magnesio", nl: "Overweeg magnesiumsuppletie", pl: "Rozważ suplementację magnezu", pt: "Considere suplementação de magnésio" } as L,
    { en: "Track patterns in your cycle", sv: "Spåra mönster i din cykel", de: "Verfolgen Sie Muster in Ihrem Zyklus", fr: "Suivez les tendances de votre cycle", es: "Rastrea patrones en tu ciclo", it: "Monitora i modelli nel tuo ciclo", nl: "Volg patronen in je cyclus", pl: "Śledź wzorce w swoim cyklu", pt: "Acompanhe padrões no seu ciclo" } as L,
  ],
  phaseContext: {
    luteal: { en: "Mood swings are common in late luteal phase due to hormone shifts. Practice self-compassion.", sv: "Humörsvängningar är vanliga i sen luteinfas på grund av hormonförskjutningar. Öva självmedkänsla.", de: "Stimmungsschwankungen sind in der späten Lutealphase häufig. Üben Sie Selbstmitgefühl.", fr: "Les sautes d'humeur sont courantes en fin de phase lutéale. Pratiquez l'auto-compassion.", es: "Los cambios de humor son comunes en la fase lútea tardía. Practica la autocompasión.", it: "Gli sbalzi d'umore sono comuni nella fase luteale tardiva. Pratica l'autocompassione.", nl: "Stemmingswisselingen zijn gebruikelijk in de late luteale fase. Oefen zelfcompassie.", pl: "Wahania nastroju są częste w późnej fazie lutealnej. Ćwicz współczucie dla siebie.", pt: "Mudanças de humor são comuns na fase lútea tardia. Pratique autocompaixão." } as L,
  },
  defaultPhaseContext: { en: "Mood stability varies throughout your cycle. This is natural and normal.", sv: "Humörstabilitet varierar genom din cykel. Detta är naturligt och normalt.", de: "Die Stimmungsstabilität variiert während Ihres Zyklus. Das ist natürlich.", fr: "La stabilité de l'humeur varie avec votre cycle. C'est naturel.", es: "La estabilidad del ánimo varía con tu ciclo. Es natural y normal.", it: "La stabilità dell'umore varia con il ciclo. È naturale e normale.", nl: "Stemmingsstabiliteit varieert gedurende je cyclus. Dit is natuurlijk.", pl: "Stabilność nastroju zmienia się w trakcie cyklu. To naturalne i normalne.", pt: "A estabilidade de humor varia ao longo do ciclo. É natural e normal." } as L,
};

const dehydrationTendencyData = {
  title: { en: "Dehydration Tendency", sv: "Uttorkningstendens", de: "Dehydrierungstendenz", fr: "Tendance à la déshydratation", es: "Tendencia a la deshidratación", it: "Tendenza alla disidratazione", nl: "Uitdrogingstendens", pl: "Tendencja do odwodnienia", pt: "Tendência à desidratação" } as L,
  whatWeMeasure: {
    en: "This is estimated from your eye photo analysis (sclera appearance, tear film quality, sclera yellowness) combined with your check-in responses and cycle phase.",
    sv: "Detta uppskattas från din ögonfotoanalys (sklerautseende, tårfilmskvalitet, skleragulhet) kombinerat med dina incheckningssvar och cykelfas.",
    de: "Dies wird aus Ihrer Augenfotoanalyse (Skleraaussehen, Tränenfilmqualität, Sklera-Gelbfärbung) in Kombination mit Check-in-Antworten und Zyklusphase geschätzt.",
    fr: "Ceci est estimé à partir de l'analyse de votre photo oculaire (apparence sclérale, qualité du film lacrymal, coloration jaune) combinée avec vos réponses et phase du cycle.",
    es: "Esto se estima a partir del análisis de tu foto ocular (apariencia escleral, calidad lagrimal, coloración amarilla) combinado con tus respuestas y fase del ciclo.",
    it: "Questo è stimato dall'analisi della tua foto oculare (aspetto sclerale, qualità lacrimale, colorazione gialla) combinata con le tue risposte e fase del ciclo.",
    nl: "Dit wordt geschat op basis van je oogfoto-analyse (sclera-uiterlijk, traanfilmkwaliteit, sclera-geelheid) gecombineerd met je check-in-antwoorden en cyclusfase.",
    pl: "Jest to szacowane na podstawie analizy zdjęcia oka (wygląd twardówki, jakość filmu łzowego, żółtość twardówki) w połączeniu z odpowiedziami z check-in i fazą cyklu.",
    pt: "Isto é estimado a partir da análise da foto do olho (aparência escleral, qualidade lacrimal, coloração amarela) combinada com as suas respostas e fase do ciclo.",
  } as L,
  whatAffects: {
    water: { en: "Water intake", sv: "Vattenintag", de: "Wasseraufnahme", fr: "Apport en eau", es: "Ingesta de agua", it: "Assunzione di acqua", nl: "Waterinname", pl: "Spożycie wody", pt: "Ingestão de água" } as L,
    caffeine: { en: "Caffeine increasing fluid loss", sv: "Koffein ökar vätskeförlust", de: "Koffein erhöht Flüssigkeitsverlust", fr: "La caféine augmentant la perte de liquide", es: "La cafeína aumentando la pérdida de líquidos", it: "La caffeina che aumenta la perdita di liquidi", nl: "Cafeïne dat vochtverlies verhoogt", pl: "Kofeina zwiększająca utratę płynów", pt: "Cafeína aumentando a perda de líquidos" } as L,
    alcohol: { en: "Alcohol acting as a diuretic", sv: "Alkohol verkar som diuretikum", de: "Alkohol als Diuretikum", fr: "L'alcool agissant comme diurétique", es: "El alcohol actuando como diurético", it: "L'alcol che agisce come diuretico", nl: "Alcohol als diureticum", pl: "Alkohol działający jako diuretyk", pt: "Álcool atuando como diurético" } as L,
    exercise: { en: "Exercise and sweating", sv: "Träning och svettning", de: "Training und Schwitzen", fr: "Exercice et transpiration", es: "Ejercicio y sudoración", it: "Esercizio e sudorazione", nl: "Beweging en zweten", pl: "Ćwiczenia i pocenie się", pt: "Exercício e transpiração" } as L,
    climate: { en: "Climate conditions", sv: "Klimatförhållanden", de: "Klimabedingungen", fr: "Conditions climatiques", es: "Condiciones climáticas", it: "Condizioni climatiche", nl: "Klimaatcondities", pl: "Warunki klimatyczne", pt: "Condições climáticas" } as L,
    illness: { en: "Illness increasing dehydration risk", sv: "Sjukdom ökar dehydreringsrisk", de: "Krankheit erhöht Dehydrierungsrisiko", fr: "La maladie augmentant le risque de déshydratation", es: "La enfermedad aumentando el riesgo de deshidratación", it: "La malattia che aumenta il rischio di disidratazione", nl: "Ziekte die uitdrogingsrisico verhoogt", pl: "Choroba zwiększająca ryzyko odwodnienia", pt: "Doença aumentando o risco de desidratação" } as L,
  },
  howToImprove: [
    { en: "Increase water intake consistently", sv: "Öka vattenintag konsekvent", de: "Erhöhen Sie die Wasseraufnahme konsequent", fr: "Augmentez votre apport en eau régulièrement", es: "Aumenta la ingesta de agua de forma consistente", it: "Aumenta l'assunzione di acqua costantemente", nl: "Verhoog waterinname consequent", pl: "Stale zwiększaj spożycie wody", pt: "Aumente a ingestão de água de forma consistente" } as L,
    { en: "Reduce diuretics (coffee, tea, alcohol)", sv: "Minska diuretika (kaffe, te, alkohol)", de: "Reduzieren Sie Diuretika (Kaffee, Tee, Alkohol)", fr: "Réduisez les diurétiques (café, thé, alcool)", es: "Reduce los diuréticos (café, té, alcohol)", it: "Riduci i diuretici (caffè, tè, alcol)", nl: "Verminder diuretica (koffie, thee, alcohol)", pl: "Ogranicz diuretyki (kawa, herbata, alkohol)", pt: "Reduza diuréticos (café, chá, álcool)" } as L,
    { en: "Eat hydrating foods", sv: "Ät hydrerande livsmedel", de: "Essen Sie hydratisierende Lebensmittel", fr: "Mangez des aliments hydratants", es: "Come alimentos hidratantes", it: "Mangia cibi idratanti", nl: "Eet hydraterende voeding", pl: "Jedz nawadniające pokarmy", pt: "Coma alimentos hidratantes" } as L,
    { en: "Monitor urine color", sv: "Övervaka urinfärg", de: "Überwachen Sie die Urinfarbe", fr: "Surveillez la couleur de l'urine", es: "Monitorea el color de la orina", it: "Monitora il colore delle urine", nl: "Monitor urinekleur", pl: "Monitoruj kolor moczu", pt: "Monitore a cor da urina" } as L,
    { en: "Drink water before, during, after exercise", sv: "Drick vatten före, under, efter träning", de: "Trinken Sie vor, während und nach dem Training Wasser", fr: "Buvez de l'eau avant, pendant et après l'exercice", es: "Bebe agua antes, durante y después del ejercicio", it: "Bevi acqua prima, durante e dopo l'esercizio", nl: "Drink water voor, tijdens en na het sporten", pl: "Pij wodę przed, w trakcie i po ćwiczeniach", pt: "Beba água antes, durante e depois do exercício" } as L,
  ],
  phaseContext: {},
  defaultPhaseContext: { en: "Hydration needs vary. Stay consistent with water intake.", sv: "Hydreringsbehov varierar. Håll dig konsekvent med vattenintag.", de: "Der Flüssigkeitsbedarf variiert. Trinken Sie regelmäßig.", fr: "Les besoins en hydratation varient. Restez régulière.", es: "Las necesidades de hidratación varían. Mantente constante.", it: "Le esigenze di idratazione variano. Resta costante.", nl: "Hydratiebehoeften variëren. Blijf constant.", pl: "Potrzeby nawodnienia się zmieniają. Bądź konsekwentna.", pt: "As necessidades de hidratação variam. Mantenha-se constante." } as L,
};

const inflammatoryStressData = {
  title: { en: "Inflammatory Stress", sv: "Inflammatorisk stress", de: "Entzündungsstress", fr: "Stress inflammatoire", es: "Estrés inflamatorio", it: "Stress infiammatorio", nl: "Ontstekingsstress", pl: "Stres zapalny", pt: "Stress inflamatório" } as L,
  whatWeMeasure: {
    en: "This is estimated from your eye photo analysis (sclera redness) combined with your check-in responses, lifestyle factors, and cycle phase.",
    sv: "Detta uppskattas från din ögonfotoanalys (sklerarödshet) kombinerat med dina incheckningssvar, livsstilsfaktorer och cykelfas.",
    de: "Dies wird aus Ihrer Augenfotoanalyse (Sklerarötung) in Kombination mit Ihren Check-in-Antworten, Lebensstilfaktoren und Zyklusphase geschätzt.",
    fr: "Ceci est estimé à partir de l'analyse de votre photo oculaire (rougeur sclérale) combinée avec vos réponses quotidiennes, facteurs de mode de vie et phase du cycle.",
    es: "Esto se estima a partir del análisis de tu foto ocular (rojez escleral) combinado con tus respuestas diarias, factores de estilo de vida y fase del ciclo.",
    it: "Questo è stimato dall'analisi della tua foto oculare (rossore sclerale) combinata con le tue risposte giornaliere, fattori di stile di vita e fase del ciclo.",
    nl: "Dit wordt geschat op basis van je oogfoto-analyse (sclera-roodheid) gecombineerd met je check-in-antwoorden, leefstijlfactoren en cyclusfase.",
    pl: "Jest to szacowane na podstawie analizy zdjęcia oka (zaczerwienienie twardówki) w połączeniu z odpowiedziami z check-in, czynnikami stylu życia i fazą cyklu.",
    pt: "Isto é estimado a partir da análise da foto do olho (vermelhidão escleral) combinada com as suas respostas diárias, fatores de estilo de vida e fase do ciclo.",
  } as L,
  whatAffects: {
    processedFood: { en: "Processed food intake", sv: "Intag av bearbetad mat", de: "Aufnahme von verarbeiteten Lebensmitteln", fr: "Consommation d'aliments transformés", es: "Consumo de alimentos procesados", it: "Assunzione di cibo processato", nl: "Inname van bewerkt voedsel", pl: "Spożycie przetworzonej żywności", pt: "Consumo de alimentos processados" } as L,
    sugar: { en: "Sugar driving inflammatory response", sv: "Socker driver inflammatorisk respons", de: "Zucker treibt Entzündungsreaktion an", fr: "Le sucre stimulant la réponse inflammatoire", es: "El azúcar impulsando la respuesta inflamatoria", it: "Lo zucchero che guida la risposta infiammatoria", nl: "Suiker dat ontstekingsreactie aandrijft", pl: "Cukier napędzający reakcję zapalną", pt: "Açúcar impulsionando a resposta inflamatória" } as L,
    stress: { en: "Chronic stress", sv: "Kronisk stress", de: "Chronischer Stress", fr: "Stress chronique", es: "Estrés crónico", it: "Stress cronico", nl: "Chronische stress", pl: "Stres chroniczny", pt: "Stress crónico" } as L,
    sleep: { en: "Sleep quality", sv: "Sömnkvalitet", de: "Schlafqualität", fr: "Qualité du sommeil", es: "Calidad del sueño", it: "Qualità del sonno", nl: "Slaapkwaliteit", pl: "Jakość snu", pt: "Qualidade do sono" } as L,
    hormones: { en: "Hormonal fluctuations", sv: "Hormonfluktuationer", de: "Hormonschwankungen", fr: "Fluctuations hormonales", es: "Fluctuaciones hormonales", it: "Fluttuazioni ormonali", nl: "Hormoonschommelingen", pl: "Wahania hormonalne", pt: "Flutuações hormonais" } as L,
    alcohol: { en: "Alcohol increasing inflammatory markers", sv: "Alkohol ökar inflammatoriska markörer", de: "Alkohol erhöht Entzündungsmarker", fr: "L'alcool augmentant les marqueurs inflammatoires", es: "El alcohol aumentando los marcadores inflamatorios", it: "L'alcol che aumenta i marcatori infiammatori", nl: "Alcohol dat ontstekingsmarkers verhoogt", pl: "Alkohol zwiększający markery zapalne", pt: "Álcool aumentando marcadores inflamatórios" } as L,
    illness: { en: "Illness elevating inflammation", sv: "Sjukdom ökar inflammation", de: "Krankheit erhöht Entzündungen", fr: "La maladie élevant l'inflammation", es: "La enfermedad elevando la inflamación", it: "La malattia che eleva l'infiammazione", nl: "Ziekte die ontsteking verhoogt", pl: "Choroba zwiększająca stan zapalny", pt: "Doença elevando a inflamação" } as L,
  },
  howToImprove: [
    { en: "Increase omega-3 intake (fish, flaxseed)", sv: "Öka omega-3-intag (fisk, linfrö)", de: "Erhöhen Sie die Omega-3-Aufnahme (Fisch, Leinsamen)", fr: "Augmentez l'apport en oméga-3 (poisson, lin)", es: "Aumenta la ingesta de omega-3 (pescado, linaza)", it: "Aumenta l'assunzione di omega-3 (pesce, semi di lino)", nl: "Verhoog omega-3-inname (vis, lijnzaad)", pl: "Zwiększ spożycie omega-3 (ryby, siemię lniane)", pt: "Aumente a ingestão de ómega-3 (peixe, linhaça)" } as L,
    { en: "Add colorful antioxidant-rich foods", sv: "Lägg till färgglada antioxidantrika livsmedel", de: "Fügen Sie bunte antioxidantienreiche Lebensmittel hinzu", fr: "Ajoutez des aliments colorés riches en antioxydants", es: "Añade alimentos coloridos ricos en antioxidantes", it: "Aggiungi cibi colorati ricchi di antiossidanti", nl: "Voeg kleurrijke antioxidantrijke voeding toe", pl: "Dodaj kolorowe pokarmy bogate w antyoksydanty", pt: "Adicione alimentos coloridos ricos em antioxidantes" } as L,
    { en: "Reduce processed foods and sugar", sv: "Minska bearbetade livsmedel och socker", de: "Reduzieren Sie verarbeitete Lebensmittel und Zucker", fr: "Réduisez les aliments transformés et le sucre", es: "Reduce los alimentos procesados y el azúcar", it: "Riduci i cibi processati e lo zucchero", nl: "Verminder bewerkt voedsel en suiker", pl: "Ogranicz przetworzoną żywność i cukier", pt: "Reduza alimentos processados e açúcar" } as L,
    { en: "Get quality sleep", sv: "Få kvalitetssömn", de: "Schlafen Sie gut", fr: "Dormez de qualité", es: "Duerme con calidad", it: "Dormi di qualità", nl: "Slaap kwalitatief", pl: "Śpij dobrze", pt: "Durma com qualidade" } as L,
    { en: "Balance intense exercise with recovery", sv: "Balansera intensiv träning med återhämtning", de: "Balancieren Sie intensives Training mit Erholung", fr: "Équilibrez l'exercice intense avec la récupération", es: "Equilibra el ejercicio intenso con la recuperación", it: "Bilancia l'esercizio intenso con il recupero", nl: "Balanceer intensieve training met herstel", pl: "Równoważ intensywne ćwiczenia z regeneracją", pt: "Equilibre exercício intenso com recuperação" } as L,
  ],
  phaseContext: {},
  defaultPhaseContext: { en: "Inflammatory markers can shift with lifestyle and hormones.", sv: "Inflammatoriska markörer kan ändras med livsstil och hormoner.", de: "Entzündungsmarker können sich mit Lebensstil und Hormonen verändern.", fr: "Les marqueurs inflammatoires varient avec le mode de vie et les hormones.", es: "Los marcadores inflamatorios pueden cambiar con el estilo de vida y las hormonas.", it: "I marcatori infiammatori possono variare con lo stile di vita e gli ormoni.", nl: "Ontstekingsmarkers kunnen veranderen met leefstijl en hormonen.", pl: "Markery zapalne mogą się zmieniać ze stylem życia i hormonami.", pt: "Os marcadores inflamatórios podem variar com o estilo de vida e as hormonas." } as L,
};

const pupilSizeData = {
  title: { en: "Wellness Score", sv: "Välmåendepoäng", de: "Wohlbefindenswert", fr: "Score de bien-être", es: "Puntuación de bienestar", it: "Punteggio benessere", nl: "Welzijnsscore", pl: "Wynik dobrostanu", pt: "Pontuação de bem-estar" } as L,
  whatWeMeasure: {
    en: "Your overall wellness score combines eye photo analysis (brightness, dark-to-light ratio in the eye region) with your check-in data and cycle phase into a single indicator.",
    sv: "Din övergripande välmåendepoäng kombinerar ögonfotoanalys (ljusstyrka, mörker-till-ljus-förhållande i ögonområdet) med din incheckningsdata och cykelfas till en enda indikator.",
    de: "Ihr Gesamtwohlbefindenswert kombiniert die Augenfotoanalyse (Helligkeit, Dunkel-zu-Hell-Verhältnis im Augenbereich) mit Ihren Check-in-Daten und Zyklusphase zu einem einzigen Indikator.",
    fr: "Votre score de bien-être global combine l'analyse de la photo oculaire (luminosité, rapport sombre/clair) avec vos données quotidiennes et phase du cycle en un seul indicateur.",
    es: "Tu puntuación de bienestar general combina el análisis de la foto ocular (brillo, proporción oscuro-claro) con tus datos diarios y fase del ciclo en un solo indicador.",
    it: "Il tuo punteggio di benessere generale combina l'analisi della foto oculare (luminosità, rapporto scuro-chiaro) con i tuoi dati giornalieri e fase del ciclo in un unico indicatore.",
    nl: "Je algehele welzijnsscore combineert oogfoto-analyse (helderheid, donker-licht-verhouding) met je check-in-gegevens en cyclusfase tot één indicator.",
    pl: "Twój ogólny wynik dobrostanu łączy analizę zdjęcia oka (jasność, stosunek ciemnych do jasnych pikseli) z danymi z check-in i fazą cyklu w jeden wskaźnik.",
    pt: "A sua pontuação de bem-estar geral combina a análise da foto do olho (brilho, proporção escuro-claro) com os seus dados diários e fase do ciclo num único indicador.",
  } as L,
  whatAffects: {
    sleep: { en: "Sleep quality and duration", sv: "Sömnkvalitet och varaktighet", de: "Schlafqualität und -dauer", fr: "Qualité et durée du sommeil", es: "Calidad y duración del sueño", it: "Qualità e durata del sonno", nl: "Slaapkwaliteit en -duur", pl: "Jakość i długość snu", pt: "Qualidade e duração do sono" } as L,
    stress: { en: "Stress levels", sv: "Stressnivåer", de: "Stresslevel", fr: "Niveaux de stress", es: "Niveles de estrés", it: "Livelli di stress", nl: "Stressniveaus", pl: "Poziomy stresu", pt: "Níveis de stress" } as L,
    energy: { en: "Energy and mood", sv: "Energi och humör", de: "Energie und Stimmung", fr: "Énergie et humeur", es: "Energía y ánimo", it: "Energia e umore", nl: "Energie en stemming", pl: "Energia i nastrój", pt: "Energia e humor" } as L,
    recovery: { en: "Recovery and rest", sv: "Återhämtning och vila", de: "Erholung und Ruhe", fr: "Récupération et repos", es: "Recuperación y descanso", it: "Recupero e riposo", nl: "Herstel en rust", pl: "Regeneracja i odpoczynek", pt: "Recuperação e descanso" } as L,
    cycle: { en: "Cycle phase", sv: "Cykelfas", de: "Zyklusphase", fr: "Phase du cycle", es: "Fase del ciclo", it: "Fase del ciclo", nl: "Cyclusfase", pl: "Faza cyklu", pt: "Fase do ciclo" } as L,
  },
  howToImprove: [
    { en: "Prioritize consistent, quality sleep", sv: "Prioritera konsekvent, kvalitativ sömn", de: "Priorisieren Sie regelmäßigen, qualitativ hochwertigen Schlaf", fr: "Priorisez un sommeil régulier et de qualité", es: "Prioriza un sueño consistente y de calidad", it: "Dai priorità a un sonno costante e di qualità", nl: "Geef prioriteit aan consistent, kwalitatief slaap", pl: "Priorytetowo traktuj konsekwentny, dobry sen", pt: "Priorize sono consistente e de qualidade" } as L,
    { en: "Manage stress through breathing exercises or meditation", sv: "Hantera stress genom andningsövningar eller meditation", de: "Bewältigen Sie Stress durch Atemübungen oder Meditation", fr: "Gérez le stress par des exercices de respiration ou la méditation", es: "Maneja el estrés mediante ejercicios de respiración o meditación", it: "Gestisci lo stress con esercizi di respirazione o meditazione", nl: "Beheer stress door ademhalingsoefeningen of meditatie", pl: "Zarządzaj stresem poprzez ćwiczenia oddechowe lub medytację", pt: "Gerencie o stress através de exercícios respiratórios ou meditação" } as L,
    { en: "Stay hydrated throughout the day", sv: "Håll dig hydrerad under hela dagen", de: "Bleiben Sie den ganzen Tag hydriert", fr: "Restez hydratée tout au long de la journée", es: "Mantente hidratada todo el día", it: "Mantieniti idratata durante il giorno", nl: "Blijf de hele dag gehydrateerd", pl: "Pij dużo wody przez cały dzień", pt: "Mantenha-se hidratada ao longo do dia" } as L,
    { en: "Adjust activity intensity to your cycle phase", sv: "Anpassa aktivitetsintensitet till din cykelfas", de: "Passen Sie die Aktivitätsintensität an Ihre Zyklusphase an", fr: "Ajustez l'intensité de l'activité à votre phase du cycle", es: "Ajusta la intensidad de la actividad a tu fase del ciclo", it: "Adatta l'intensità dell'attività alla fase del ciclo", nl: "Pas de activiteitsintensiteit aan op je cyclusfase", pl: "Dostosuj intensywność aktywności do fazy cyklu", pt: "Ajuste a intensidade da atividade à fase do ciclo" } as L,
    { en: "Track daily to see trends over time", sv: "Spåra dagligen för att se trender över tid", de: "Verfolgen Sie täglich, um Trends zu erkennen", fr: "Suivez quotidiennement pour voir les tendances", es: "Rastrea diariamente para ver tendencias", it: "Monitora quotidianamente per vedere le tendenze", nl: "Volg dagelijks om trends te zien", pl: "Śledź codziennie, aby zobaczyć trendy", pt: "Acompanhe diariamente para ver tendências" } as L,
  ],
  phaseContext: {},
  defaultPhaseContext: { en: "Your wellness score reflects how your daily habits and cycle phase combine to affect how you feel.", sv: "Din välmåendepoäng återspeglar hur dina dagliga vanor och cykelfas kombineras och påverkar hur du mår.", de: "Ihr Wohlbefindenswert spiegelt wider, wie sich Ihre Gewohnheiten und Zyklusphase auf Ihr Befinden auswirken.", fr: "Votre score de bien-être reflète comment vos habitudes et votre phase du cycle affectent votre ressenti.", es: "Tu puntuación de bienestar refleja cómo tus hábitos y fase del ciclo afectan cómo te sientes.", it: "Il tuo punteggio di benessere riflette come le tue abitudini e la fase del ciclo influenzano come ti senti.", nl: "Je welzijnsscore weerspiegelt hoe je gewoonten en cyclusfase je gevoel beïnvloeden.", pl: "Twój wynik dobrostanu odzwierciedla, jak Twoje nawyki i faza cyklu wpływają na samopoczucie.", pt: "A sua pontuação de bem-estar reflete como os seus hábitos e fase do ciclo afetam como se sente." } as L,
};

const symmetryData = {
  title: { en: "Balance", sv: "Balans", de: "Balance", fr: "Équilibre", es: "Equilibrio", it: "Equilibrio", nl: "Balans", pl: "Równowaga", pt: "Equilíbrio" } as L,
  whatWeMeasure: {
    en: "We measure the similarity between your left and right eye regions in the photo, and combine this with your check-in data to reflect overall balance and consistency of your wellness indicators.",
    sv: "Vi mäter likheten mellan dina vänstra och högra ögonområden i fotot, och kombinerar detta med din incheckningsdata för att återspegla övergripande balans och konsekvens i dina välmåendeindikatorer.",
    de: "Wir messen die Ähnlichkeit zwischen Ihren linken und rechten Augenbereichen im Foto und kombinieren dies mit Ihren Check-in-Daten, um die Gesamtbalance und Konsistenz Ihrer Wohlbefindensindikatoren widerzuspiegeln.",
    fr: "Nous mesurons la similarité entre vos régions oculaires gauche et droite sur la photo, et combinons cela avec vos données quotidiennes pour refléter l'équilibre global de vos indicateurs de bien-être.",
    es: "Medimos la similitud entre las regiones oculares izquierda y derecha en la foto, y combinamos esto con tus datos diarios para reflejar el equilibrio general de tus indicadores de bienestar.",
    it: "Misuriamo la somiglianza tra le regioni oculari sinistra e destra nella foto, e combiniamo questo con i tuoi dati giornalieri per riflettere l'equilibrio generale dei tuoi indicatori di benessere.",
    nl: "We meten de gelijkenis tussen je linker en rechter ooggebieden in de foto, en combineren dit met je check-in-gegevens om de algehele balans van je welzijnsindicatoren weer te geven.",
    pl: "Mierzymy podobieństwo między lewym a prawym obszarem oka na zdjęciu i łączymy to z danymi z check-in, aby odzwierciedlić ogólną równowagę wskaźników dobrostanu.",
    pt: "Medimos a semelhança entre as regiões oculares esquerda e direita na foto, e combinamos com os seus dados diários para refletir o equilíbrio geral dos seus indicadores de bem-estar.",
  } as L,
  whatAffects: {
    stress: { en: "Stress levels", sv: "Stressnivåer", de: "Stresslevel", fr: "Niveaux de stress", es: "Niveles de estrés", it: "Livelli di stress", nl: "Stressniveaus", pl: "Poziomy stresu", pt: "Níveis de stress" } as L,
    energy: { en: "Energy consistency", sv: "Energikonsistens", de: "Energiekonsistenz", fr: "Constance de l'énergie", es: "Consistencia de energía", it: "Costanza energetica", nl: "Energieconsistentie", pl: "Stałość energii", pt: "Consistência de energia" } as L,
    sleep: { en: "Sleep regularity", sv: "Sömnregelbundenhet", de: "Schlafregelmäßigkeit", fr: "Régularité du sommeil", es: "Regularidad del sueño", it: "Regolarità del sonno", nl: "Slaapregelmaat", pl: "Regularność snu", pt: "Regularidade do sono" } as L,
    activity: { en: "Activity and recovery balance", sv: "Aktivitets- och återhämtningsbalans", de: "Aktivitäts- und Erholungsbalance", fr: "Équilibre activité et récupération", es: "Equilibrio entre actividad y recuperación", it: "Equilibrio attività e recupero", nl: "Activiteits- en herstelbalans", pl: "Równowaga aktywności i regeneracji", pt: "Equilíbrio entre atividade e recuperação" } as L,
    cycle: { en: "Cycle phase transitions", sv: "Cykelfasövergångar", de: "Zyklusphaseübergänge", fr: "Transitions de phase du cycle", es: "Transiciones de fase del ciclo", it: "Transizioni di fase del ciclo", nl: "Cyclusfaseovergangen", pl: "Przejścia między fazami cyklu", pt: "Transições de fase do ciclo" } as L,
  },
  howToImprove: [
    { en: "Maintain a consistent sleep schedule", sv: "Håll ett konsekvent sömnschema", de: "Halten Sie einen regelmäßigen Schlafrhythmus ein", fr: "Maintenez un horaire de sommeil régulier", es: "Mantén un horario de sueño consistente", it: "Mantieni un programma di sonno costante", nl: "Houd een consistent slaapschema aan", pl: "Utrzymuj regularny harmonogram snu", pt: "Mantenha um horário de sono consistente" } as L,
    { en: "Balance activity with rest days", sv: "Balansera aktivitet med vilodagar", de: "Balancieren Sie Aktivität mit Ruhetagen", fr: "Équilibrez l'activité avec des jours de repos", es: "Equilibra la actividad con días de descanso", it: "Bilancia l'attività con giorni di riposo", nl: "Balanceer activiteit met rustdagen", pl: "Równoważ aktywność z dniami odpoczynku", pt: "Equilibre atividade com dias de descanso" } as L,
    { en: "Manage stress proactively", sv: "Hantera stress proaktivt", de: "Bewältigen Sie Stress proaktiv", fr: "Gérez le stress de manière proactive", es: "Maneja el estrés de forma proactiva", it: "Gestisci lo stress proattivamente", nl: "Beheer stress proactief", pl: "Zarządzaj stresem proaktywnie", pt: "Gerencie o stress proativamente" } as L,
    { en: "Track daily to identify patterns", sv: "Spåra dagligen för att identifiera mönster", de: "Verfolgen Sie täglich, um Muster zu erkennen", fr: "Suivez quotidiennement pour identifier les tendances", es: "Rastrea diariamente para identificar patrones", it: "Monitora quotidianamente per identificare modelli", nl: "Volg dagelijks om patronen te identificeren", pl: "Śledź codziennie, aby identyfikować wzorce", pt: "Acompanhe diariamente para identificar padrões" } as L,
    { en: "Align your routine with your cycle phase", sv: "Anpassa din rutin efter din cykelfas", de: "Richten Sie Ihre Routine an Ihrer Zyklusphase aus", fr: "Alignez votre routine avec votre phase du cycle", es: "Alinea tu rutina con tu fase del ciclo", it: "Allinea la tua routine con la fase del ciclo", nl: "Stem je routine af op je cyclusfase", pl: "Dopasuj rutynę do fazy cyklu", pt: "Alinhe a sua rotina com a fase do ciclo" } as L,
  ],
  phaseContext: {},
  defaultPhaseContext: { en: "Balance reflects the consistency of your wellness data. Higher balance means better harmony.", sv: "Balans återspeglar konsekvensen i din välmåendedata. Högre balans innebär bättre harmoni.", de: "Balance spiegelt die Konsistenz Ihrer Wohlbefindensdaten wider. Höhere Balance bedeutet bessere Harmonie.", fr: "L'équilibre reflète la cohérence de vos données de bien-être. Un meilleur équilibre signifie plus d'harmonie.", es: "El equilibrio refleja la consistencia de tus datos de bienestar. Mayor equilibrio significa mejor armonía.", it: "L'equilibrio riflette la coerenza dei tuoi dati di benessere. Maggiore equilibrio significa migliore armonia.", nl: "Balans weerspiegelt de consistentie van je welzijnsgegevens. Hogere balans betekent betere harmonie.", pl: "Równowaga odzwierciedla spójność danych o dobrostanie. Wyższa równowaga oznacza lepszą harmonię.", pt: "O equilíbrio reflete a consistência dos seus dados de bem-estar. Maior equilíbrio significa melhor harmonia." } as L,
};

const scleraYellownessData = {
  title: { en: "Sclera Clarity", sv: "Skleraklarhet", de: "Sklera-Klarheit", fr: "Clarté sclérale", es: "Claridad escleral", it: "Chiarezza sclerale", nl: "Sclera-helderheid", pl: "Czystość twardówki", pt: "Clareza escleral" } as L,
  whatWeMeasure: {
    en: "We analyze the white-to-yellow color balance of your eye whites in the photo. A more yellow tinge may reflect dehydration or lifestyle factors. This is combined with your check-in data and cycle phase.",
    sv: "Vi analyserar vit-till-gul-färgbalansen i dina ögonvitor på fotot. En gulare ton kan återspegla uttorkning eller livsstilsfaktorer. Detta kombineras med din incheckningsdata och cykelfas.",
    de: "Wir analysieren die Weiß-Gelb-Farbbalance Ihrer Augenweiß im Foto. Ein gelblicher Ton kann Dehydrierung oder Lebensstilfaktoren widerspiegeln. Kombiniert mit Check-in-Daten und Zyklusphase.",
    fr: "Nous analysons l'équilibre blanc-jaune de vos yeux sur la photo. Une teinte plus jaune peut refléter la déshydratation ou des facteurs de mode de vie. Combiné avec vos données et phase du cycle.",
    es: "Analizamos el equilibrio de color blanco-amarillo de tus ojos en la foto. Un tono más amarillo puede reflejar deshidratación o factores de estilo de vida. Combinado con tus datos y fase del ciclo.",
    it: "Analizziamo l'equilibrio bianco-giallo dei tuoi occhi nella foto. Un tono più giallo può riflettere disidratazione o fattori di stile di vita. Combinato con i tuoi dati e fase del ciclo.",
    nl: "We analyseren de wit-geel kleurbalans van je oogwit in de foto. Een geelere tint kan uitdroging of leefstijlfactoren weerspiegelen. Gecombineerd met je gegevens en cyclusfase.",
    pl: "Analizujemy balans kolorów biało-żółtych białek oczu na zdjęciu. Żółtawy odcień może odzwierciedlać odwodnienie lub czynniki stylu życia. W połączeniu z danymi z check-in i fazą cyklu.",
    pt: "Analisamos o equilíbrio de cor branco-amarelo dos seus olhos na foto. Um tom mais amarelo pode refletir desidratação ou fatores de estilo de vida. Combinado com os seus dados e fase do ciclo.",
  } as L,
  whatAffects: {
    hydration: { en: "Hydration levels", sv: "Hydreringsnivåer", de: "Hydratationsstand", fr: "Niveaux d'hydratation", es: "Niveles de hidratación", it: "Livelli di idratazione", nl: "Hydratieniveaus", pl: "Poziomy nawodnienia", pt: "Níveis de hidratação" } as L,
    sleep: { en: "Sleep quality and rest", sv: "Sömnkvalitet och vila", de: "Schlafqualität und Ruhe", fr: "Qualité du sommeil et repos", es: "Calidad del sueño y descanso", it: "Qualità del sonno e riposo", nl: "Slaapkwaliteit en rust", pl: "Jakość snu i odpoczynek", pt: "Qualidade do sono e descanso" } as L,
    alcohol: { en: "Alcohol consumption", sv: "Alkoholkonsumtion", de: "Alkoholkonsum", fr: "Consommation d'alcool", es: "Consumo de alcohol", it: "Consumo di alcol", nl: "Alcoholconsumptie", pl: "Spożycie alkoholu", pt: "Consumo de álcool" } as L,
    nutrition: { en: "Nutrition and diet quality", sv: "Näring och kostkvalitet", de: "Ernährungs- und Diätqualität", fr: "Nutrition et qualité de l'alimentation", es: "Nutrición y calidad de la dieta", it: "Nutrizione e qualità della dieta", nl: "Voeding en dieetkwaliteit", pl: "Odżywianie i jakość diety", pt: "Nutrição e qualidade da dieta" } as L,
    hormones: { en: "Hormonal changes in your cycle", sv: "Hormonförändringar i din cykel", de: "Hormonelle Veränderungen in Ihrem Zyklus", fr: "Changements hormonaux dans votre cycle", es: "Cambios hormonales en tu ciclo", it: "Cambiamenti ormonali nel tuo ciclo", nl: "Hormonale veranderingen in je cyclus", pl: "Zmiany hormonalne w cyklu", pt: "Alterações hormonais no seu ciclo" } as L,
  },
  howToImprove: [
    { en: "Drink at least 8 glasses of water daily", sv: "Drick minst 8 glas vatten dagligen", de: "Trinken Sie täglich mindestens 8 Gläser Wasser", fr: "Buvez au moins 8 verres d'eau par jour", es: "Bebe al menos 8 vasos de agua al día", it: "Bevi almeno 8 bicchieri d'acqua al giorno", nl: "Drink dagelijks minstens 8 glazen water", pl: "Pij co najmniej 8 szklanek wody dziennie", pt: "Beba pelo menos 8 copos de água por dia" } as L,
    { en: "Reduce alcohol and caffeine intake", sv: "Minska alkohol- och koffeinintag", de: "Reduzieren Sie Alkohol- und Koffeinkonsum", fr: "Réduisez l'alcool et la caféine", es: "Reduce el consumo de alcohol y cafeína", it: "Riduci l'assunzione di alcol e caffeina", nl: "Verminder alcohol- en cafeïne-inname", pl: "Ogranicz spożycie alkoholu i kofeiny", pt: "Reduza o consumo de álcool e cafeína" } as L,
    { en: "Eat colorful, nutrient-rich foods", sv: "Ät färgglada, näringsrika livsmedel", de: "Essen Sie bunte, nährstoffreiche Lebensmittel", fr: "Mangez des aliments colorés et riches en nutriments", es: "Come alimentos coloridos y ricos en nutrientes", it: "Mangia cibi colorati e ricchi di nutrienti", nl: "Eet kleurrijke, voedzame voeding", pl: "Jedz kolorowe, bogate w składniki odżywcze pokarmy", pt: "Coma alimentos coloridos e ricos em nutrientes" } as L,
    { en: "Get consistent quality sleep", sv: "Få konsekvent kvalitetssömn", de: "Schlafen Sie regelmäßig und gut", fr: "Dormez de manière régulière et de qualité", es: "Duerme de forma consistente y con calidad", it: "Dormi in modo costante e di qualità", nl: "Slaap consistent en kwalitatief", pl: "Śpij regularnie i dobrze", pt: "Durma de forma consistente e com qualidade" } as L,
  ],
  phaseContext: {
    menstrual: { en: "During menstruation, sclera appearance can vary due to fluid shifts. Stay well hydrated.", sv: "Under menstruation kan sklerautseendet variera på grund av vätskeförändringar. Håll dig väl hydrerad.", de: "Während der Menstruation kann sich das Sklera-Aussehen aufgrund von Flüssigkeitsverschiebungen verändern.", fr: "Pendant les menstruations, l'apparence sclérale peut varier. Restez bien hydratée.", es: "Durante la menstruación, la apariencia escleral puede variar. Mantente bien hidratada.", it: "Durante le mestruazioni, l'aspetto sclerale può variare. Mantieniti ben idratata.", nl: "Tijdens de menstruatie kan het sclera-uiterlijk variëren. Blijf goed gehydrateerd.", pl: "Podczas menstruacji wygląd twardówki może się zmieniać. Pij dużo wody.", pt: "Durante a menstruação, a aparência escleral pode variar. Mantenha-se bem hidratada." } as L,
  },
  defaultPhaseContext: { en: "Sclera clarity can reflect hydration and overall wellness. Track changes over time.", sv: "Skleraklarhet kan återspegla hydrering och övergripande välmående. Spåra förändringar över tid.", de: "Sklera-Klarheit kann Hydratation und allgemeines Wohlbefinden widerspiegeln.", fr: "La clarté sclérale peut refléter l'hydratation et le bien-être général.", es: "La claridad escleral puede reflejar la hidratación y el bienestar general.", it: "La chiarezza sclerale può riflettere l'idratazione e il benessere generale.", nl: "Sclera-helderheid kan hydratatie en algeheel welzijn weerspiegelen.", pl: "Czystość twardówki może odzwierciedlać nawodnienie i ogólne samopoczucie.", pt: "A clareza escleral pode refletir a hidratação e o bem-estar geral." } as L,
};

const underEyeDarknessData = {
  title: { en: "Under-Eye Vitality", sv: "Vitalitet under ögonen", de: "Vitalität unter den Augen", fr: "Vitalité sous les yeux", es: "Vitalidad bajo los ojos", it: "Vitalità sotto gli occhi", nl: "Vitaliteit onder de ogen", pl: "Witalność pod oczami", pt: "Vitalidade sob os olhos" } as L,
  whatWeMeasure: {
    en: "We analyze the skin tone beneath your eye line in the photo. Darker under-eye areas may reflect fatigue, poor sleep, or dehydration. This is combined with your check-in data and cycle phase.",
    sv: "Vi analyserar hudtonen under din ögonlinje på fotot. Mörkare områden under ögonen kan återspegla trötthet, dålig sömn eller uttorkning. Detta kombineras med din incheckningsdata och cykelfas.",
    de: "Wir analysieren den Hautton unter Ihrer Augenlinie im Foto. Dunklere Augenringe können Müdigkeit, schlechten Schlaf oder Dehydrierung widerspiegeln. Kombiniert mit Check-in-Daten und Zyklusphase.",
    fr: "Nous analysons le teint sous vos yeux sur la photo. Des cernes plus foncés peuvent refléter la fatigue, un mauvais sommeil ou la déshydratation. Combiné avec vos données et phase du cycle.",
    es: "Analizamos el tono de piel debajo de la línea de tus ojos en la foto. Ojeras más oscuras pueden reflejar fatiga, mal sueño o deshidratación. Combinado con tus datos y fase del ciclo.",
    it: "Analizziamo il tono della pelle sotto la linea degli occhi nella foto. Occhiaie più scure possono riflettere fatica, sonno scarso o disidratazione. Combinato con i tuoi dati e fase del ciclo.",
    nl: "We analyseren de huidtint onder je ooglijn in de foto. Donkerdere wallen kunnen vermoeidheid, slechte slaap of uitdroging weerspiegelen. Gecombineerd met je gegevens en cyclusfase.",
    pl: "Analizujemy odcień skóry pod linią oczu na zdjęciu. Ciemniejsze cienie pod oczami mogą odzwierciedlać zmęczenie, słaby sen lub odwodnienie. W połączeniu z danymi z check-in i fazą cyklu.",
    pt: "Analisamos o tom de pele abaixo da linha dos olhos na foto. Olheiras mais escuras podem refletir fadiga, sono fraco ou desidratação. Combinado com os seus dados e fase do ciclo.",
  } as L,
  whatAffects: {
    sleep: { en: "Sleep quality and duration", sv: "Sömnkvalitet och varaktighet", de: "Schlafqualität und -dauer", fr: "Qualité et durée du sommeil", es: "Calidad y duración del sueño", it: "Qualità e durata del sonno", nl: "Slaapkwaliteit en -duur", pl: "Jakość i długość snu", pt: "Qualidade e duração do sono" } as L,
    hydration: { en: "Hydration levels", sv: "Hydreringsnivåer", de: "Hydratationsstand", fr: "Niveaux d'hydratation", es: "Niveles de hidratación", it: "Livelli di idratazione", nl: "Hydratieniveaus", pl: "Poziomy nawodnienia", pt: "Níveis de hidratação" } as L,
    stress: { en: "Stress and fatigue", sv: "Stress och trötthet", de: "Stress und Müdigkeit", fr: "Stress et fatigue", es: "Estrés y fatiga", it: "Stress e fatica", nl: "Stress en vermoeidheid", pl: "Stres i zmęczenie", pt: "Stress e fadiga" } as L,
    alcohol: { en: "Alcohol disrupting restorative sleep", sv: "Alkohol som stör återställande sömn", de: "Alkohol stört erholsamen Schlaf", fr: "L'alcool perturbant le sommeil réparateur", es: "El alcohol alterando el sueño reparador", it: "L'alcol che disturba il sonno ristoratore", nl: "Alcohol dat herstellende slaap verstoort", pl: "Alkohol zaburzający sen regeneracyjny", pt: "Álcool perturbando o sono reparador" } as L,
    hormones: { en: "Hormonal fluctuations in your cycle", sv: "Hormonfluktuationer i din cykel", de: "Hormonschwankungen in Ihrem Zyklus", fr: "Fluctuations hormonales dans votre cycle", es: "Fluctuaciones hormonales en tu ciclo", it: "Fluttuazioni ormonali nel tuo ciclo", nl: "Hormoonschommelingen in je cyclus", pl: "Wahania hormonalne w cyklu", pt: "Flutuações hormonais no seu ciclo" } as L,
    illness: { en: "Illness increasing fatigue", sv: "Sjukdom ökar trötthet", de: "Krankheit erhöht Müdigkeit", fr: "La maladie augmentant la fatigue", es: "La enfermedad aumentando la fatiga", it: "La malattia che aumenta la fatica", nl: "Ziekte die vermoeidheid verhoogt", pl: "Choroba zwiększająca zmęczenie", pt: "Doença aumentando a fadiga" } as L,
  },
  howToImprove: [
    { en: "Prioritize 7-9 hours of quality sleep", sv: "Prioritera 7-9 timmars kvalitetssömn", de: "Priorisieren Sie 7-9 Stunden Qualitätsschlaf", fr: "Priorisez 7-9 heures de sommeil de qualité", es: "Prioriza 7-9 horas de sueño de calidad", it: "Dai priorità a 7-9 ore di sonno di qualità", nl: "Geef prioriteit aan 7-9 uur kwaliteitsslaap", pl: "Priorytetowo traktuj 7-9 godzin dobrego snu", pt: "Priorize 7-9 horas de sono de qualidade" } as L,
    { en: "Stay well hydrated throughout the day", sv: "Håll dig väl hydrerad under dagen", de: "Bleiben Sie den ganzen Tag gut hydriert", fr: "Restez bien hydratée tout au long de la journée", es: "Mantente bien hidratada durante el día", it: "Mantieniti ben idratata durante il giorno", nl: "Blijf de hele dag goed gehydrateerd", pl: "Pij dużo wody przez cały dzień", pt: "Mantenha-se bem hidratada ao longo do dia" } as L,
    { en: "Apply a cold compress to reduce puffiness", sv: "Applicera ett kallt omslag för att minska svullnad", de: "Legen Sie eine kalte Kompresse auf, um Schwellungen zu reduzieren", fr: "Appliquez une compresse froide pour réduire les gonflements", es: "Aplica una compresa fría para reducir la hinchazón", it: "Applica un impacco freddo per ridurre il gonfiore", nl: "Breng een koud kompres aan om zwelling te verminderen", pl: "Zastosuj zimny kompres, aby zmniejszyć opuchliznę", pt: "Aplique uma compressa fria para reduzir o inchaço" } as L,
    { en: "Reduce screen time before bed", sv: "Minska skärmtid före sänggåendet", de: "Reduzieren Sie Bildschirmzeit vor dem Schlafengehen", fr: "Réduisez le temps d'écran avant le coucher", es: "Reduce el tiempo de pantalla antes de dormir", it: "Riduci il tempo allo schermo prima di dormire", nl: "Verminder schermtijd voor het slapengaan", pl: "Ogranicz czas ekranowy przed snem", pt: "Reduza o tempo de ecrã antes de dormir" } as L,
  ],
  phaseContext: {
    menstrual: { en: "Under-eye darkness may increase during menstruation due to fatigue and fluid changes. Extra rest helps.", sv: "Mörka ringar under ögonen kan öka under menstruation på grund av trötthet. Extra vila hjälper.", de: "Augenringe können während der Menstruation zunehmen. Extra Ruhe hilft.", fr: "Les cernes peuvent augmenter pendant les menstruations. Le repos supplémentaire aide.", es: "Las ojeras pueden aumentar durante la menstruación. El descanso extra ayuda.", it: "Le occhiaie possono aumentare durante le mestruazioni. Il riposo extra aiuta.", nl: "Donkere kringen kunnen toenemen tijdens de menstruatie. Extra rust helpt.", pl: "Cienie pod oczami mogą się nasilać podczas menstruacji. Dodatkowy odpoczynek pomaga.", pt: "As olheiras podem aumentar durante a menstruação. O descanso extra ajuda." } as L,
  },
  defaultPhaseContext: { en: "Under-eye appearance reflects sleep quality and overall vitality. Consistent rest improves it.", sv: "Utseendet under ögonen återspeglar sömnkvalitet och vitalitet. Konsekvent vila förbättrar det.", de: "Das Erscheinungsbild unter den Augen spiegelt Schlafqualität und Vitalität wider.", fr: "L'apparence sous les yeux reflète la qualité du sommeil et la vitalité.", es: "La apariencia bajo los ojos refleja la calidad del sueño y la vitalidad.", it: "L'aspetto sotto gli occhi riflette la qualità del sonno e la vitalità.", nl: "Het uiterlijk onder de ogen weerspiegelt slaapkwaliteit en vitaliteit.", pl: "Wygląd pod oczami odzwierciedla jakość snu i witalność.", pt: "A aparência sob os olhos reflete a qualidade do sono e a vitalidade." } as L,
};

const eyeOpennessData = {
  title: { en: "Eye Alertness", sv: "Ögonvakenhet", de: "Augen-Wachheit", fr: "Vivacité oculaire", es: "Alerta ocular", it: "Vigilanza oculare", nl: "Oog-alertheid", pl: "Czujność oczu", pt: "Alerta ocular" } as L,
  whatWeMeasure: {
    en: "We measure how wide open your eyes are based on the proportion of visible white area (sclera) in the eye region. Wider open eyes suggest greater alertness, while narrow or droopy eyes may suggest fatigue.",
    sv: "Vi mäter hur vidöppna dina ögon är baserat på andelen synligt vitt område (sklera) i ögonregionen. Vidöppna ögon tyder på större vakenhet, medan smala eller hängande ögon kan tyda på trötthet.",
    de: "Wir messen, wie weit Ihre Augen geöffnet sind, basierend auf dem sichtbaren weißen Bereich. Weit geöffnete Augen deuten auf mehr Wachheit hin, während schmale Augen auf Müdigkeit hindeuten können.",
    fr: "Nous mesurons l'ouverture de vos yeux en fonction de la zone blanche visible. Des yeux bien ouverts suggèrent plus de vigilance, tandis que des yeux mi-clos peuvent indiquer de la fatigue.",
    es: "Medimos cuán abiertos están tus ojos basándonos en el área blanca visible. Ojos bien abiertos sugieren mayor alerta, mientras que ojos entrecerrados pueden indicar fatiga.",
    it: "Misuriamo quanto sono aperti i tuoi occhi in base all'area bianca visibile. Occhi ben aperti suggeriscono maggiore vigilanza, mentre occhi semichiusi possono indicare fatica.",
    nl: "We meten hoe wijd je ogen open zijn op basis van het zichtbare witte gebied. Wijd open ogen suggereren meer alertheid, terwijl smalle ogen vermoeidheid kunnen aangeven.",
    pl: "Mierzymy, jak szeroko otwarte są Twoje oczy na podstawie widocznego białego obszaru. Szeroko otwarte oczy sugerują większą czujność, a wąskie oczy mogą wskazywać na zmęczenie.",
    pt: "Medimos quão abertos estão os seus olhos com base na área branca visível. Olhos bem abertos sugerem maior alerta, enquanto olhos semicerrados podem indicar fadiga.",
  } as L,
  whatAffects: {
    sleep: { en: "Sleep quality and duration", sv: "Sömnkvalitet och varaktighet", de: "Schlafqualität und -dauer", fr: "Qualité et durée du sommeil", es: "Calidad y duración del sueño", it: "Qualità e durata del sonno", nl: "Slaapkwaliteit en -duur", pl: "Jakość i długość snu", pt: "Qualidade e duração do sono" } as L,
    caffeine: { en: "Caffeine affecting alertness", sv: "Koffein påverkar vakenhet", de: "Koffein beeinflusst die Wachheit", fr: "La caféine affectant la vigilance", es: "La cafeína afectando la alerta", it: "La caffeina che influenza la vigilanza", nl: "Cafeïne die alertheid beïnvloedt", pl: "Kofeina wpływająca na czujność", pt: "Cafeína afetando a alerta" } as L,
    stress: { en: "Stress and mental fatigue", sv: "Stress och mental trötthet", de: "Stress und mentale Müdigkeit", fr: "Stress et fatigue mentale", es: "Estrés y fatiga mental", it: "Stress e affaticamento mentale", nl: "Stress en mentale vermoeidheid", pl: "Stres i zmęczenie psychiczne", pt: "Stress e fadiga mental" } as L,
    activity: { en: "Physical activity levels", sv: "Fysisk aktivitetsnivå", de: "Körperliche Aktivität", fr: "Niveaux d'activité physique", es: "Niveles de actividad física", it: "Livelli di attività fisica", nl: "Niveaus van fysieke activiteit", pl: "Poziomy aktywności fizycznej", pt: "Níveis de atividade física" } as L,
    hormones: { en: "Hormonal cycle phase", sv: "Hormonell cykelfas", de: "Hormonelle Zyklusphase", fr: "Phase hormonale du cycle", es: "Fase hormonal del ciclo", it: "Fase ormonale del ciclo", nl: "Hormonale cyclusfase", pl: "Hormonalna faza cyklu", pt: "Fase hormonal do ciclo" } as L,
  },
  howToImprove: [
    { en: "Get consistent, quality sleep (7-9 hours)", sv: "Få konsekvent, kvalitativ sömn (7-9 timmar)", de: "Schlafen Sie regelmäßig 7-9 Stunden", fr: "Dormez régulièrement 7-9 heures de qualité", es: "Duerme consistentemente 7-9 horas de calidad", it: "Dormi costantemente 7-9 ore di qualità", nl: "Slaap consistent 7-9 uur van kwaliteit", pl: "Śpij regularnie 7-9 godzin", pt: "Durma consistentemente 7-9 horas de qualidade" } as L,
    { en: "Take breaks during screen work", sv: "Ta pauser under skärmarbete", de: "Machen Sie Pausen bei Bildschirmarbeit", fr: "Faites des pauses pendant le travail sur écran", es: "Toma descansos durante el trabajo con pantallas", it: "Fai pause durante il lavoro allo schermo", nl: "Neem pauzes tijdens beeldschermwerk", pl: "Rób przerwy podczas pracy przy ekranie", pt: "Faça pausas durante o trabalho no ecrã" } as L,
    { en: "Gentle movement or fresh air to boost alertness", sv: "Lätt rörelse eller frisk luft för att öka vakenheten", de: "Sanfte Bewegung oder frische Luft für mehr Wachheit", fr: "Mouvement doux ou air frais pour augmenter la vigilance", es: "Movimiento suave o aire fresco para aumentar la alerta", it: "Movimento dolce o aria fresca per aumentare la vigilanza", nl: "Zachte beweging of frisse lucht voor meer alertheid", pl: "Łagodny ruch lub świeże powietrze dla większej czujności", pt: "Movimento suave ou ar fresco para aumentar a alerta" } as L,
    { en: "Stay hydrated — dehydration can cause eye strain", sv: "Håll dig hydrerad — uttorkning kan orsaka ögontrötthet", de: "Bleiben Sie hydriert — Dehydrierung kann Augenbelastung verursachen", fr: "Restez hydratée — la déshydratation peut fatiguer les yeux", es: "Mantente hidratada — la deshidratación puede causar tensión ocular", it: "Mantieniti idratata — la disidratazione può affaticare gli occhi", nl: "Blijf gehydrateerd — uitdroging kan oogvermoeidheid veroorzaken", pl: "Pij dużo wody — odwodnienie może powodować zmęczenie oczu", pt: "Mantenha-se hidratada — a desidratação pode causar tensão ocular" } as L,
  ],
  phaseContext: {
    menstrual: { en: "Lower alertness is normal during menstruation. Fatigue from hormonal changes can make eyes feel heavier.", sv: "Lägre vakenhet är normal under menstruation. Trötthet från hormonförändringar kan göra ögonen tunga.", de: "Geringere Wachheit ist während der Menstruation normal.", fr: "Une vigilance moindre est normale pendant les menstruations.", es: "Una menor alerta es normal durante la menstruación.", it: "Una minore vigilanza è normale durante le mestruazioni.", nl: "Lagere alertheid is normaal tijdens de menstruatie.", pl: "Niższa czujność jest normalna podczas menstruacji.", pt: "Menor alerta é normal durante a menstruação." } as L,
    ovulation: { en: "Peak alertness! High estrogen supports bright, open eyes and optimal energy.", sv: "Toppvakenhet! Högt östrogen stödjer klara, öppna ögon och optimal energi.", de: "Höchste Wachheit! Hohes Östrogen unterstützt wache, offene Augen.", fr: "Vigilance maximale ! Les œstrogènes élevés favorisent des yeux ouverts et énergiques.", es: "¡Máxima alerta! El estrógeno alto favorece ojos abiertos y energía óptima.", it: "Massima vigilanza! Gli estrogeni alti favoriscono occhi aperti ed energia.", nl: "Piekalertheid! Hoog oestrogeen ondersteunt heldere, open ogen.", pl: "Szczytowa czujność! Wysoki estrogen wspiera jasne, otwarte oczy.", pt: "Alerta máximo! O estrogénio elevado favorece olhos abertos e energia." } as L,
  },
  defaultPhaseContext: { en: "Eye alertness reflects your overall wakefulness and energy state.", sv: "Ögonvakenhet återspeglar din övergripande vakenhet och energitillstånd.", de: "Augen-Wachheit spiegelt Ihren allgemeinen Wachheits- und Energiezustand wider.", fr: "La vivacité oculaire reflète votre état de vigilance et d'énergie.", es: "La alerta ocular refleja tu estado de vigilia y energía.", it: "La vigilanza oculare riflette il tuo stato di veglia ed energia.", nl: "Oog-alertheid weerspiegelt je algehele waakzaamheid en energietoestand.", pl: "Czujność oczu odzwierciedla Twój ogólny stan czuwania i energii.", pt: "A alerta ocular reflete o seu estado de vigília e energia." } as L,
};

const tearFilmQualityData = {
  title: { en: "Eye Moisture", sv: "Ögonfuktighet", de: "Augenfeuchtigkeit", fr: "Humidité oculaire", es: "Humedad ocular", it: "Umidità oculare", nl: "Oogvochtigheid", pl: "Wilgotność oka", pt: "Humidade ocular" } as L,
  whatWeMeasure: {
    en: "We analyze the quality of the light reflection on your eye surface. Well-hydrated eyes produce a sharp, concentrated bright spot, while dry eyes produce diffuse, spread-out reflections. This is combined with your check-in data.",
    sv: "Vi analyserar kvaliteten på ljusreflektionen på din ögonyta. Välhydrerade ögon ger en skarp, koncentrerad ljuspunkt, medan torra ögon ger diffusa reflexioner. Detta kombineras med din incheckningsdata.",
    de: "Wir analysieren die Qualität der Lichtreflexion auf Ihrer Augenoberfläche. Gut befeuchtete Augen erzeugen einen scharfen, konzentrierten Lichtpunkt, während trockene Augen diffuse Reflexionen erzeugen.",
    fr: "Nous analysons la qualité de la réflexion lumineuse sur votre surface oculaire. Des yeux bien hydratés produisent un point lumineux net, tandis que des yeux secs produisent des reflets diffus.",
    es: "Analizamos la calidad del reflejo de luz en la superficie de tu ojo. Ojos bien hidratados producen un punto brillante nítido, mientras que ojos secos producen reflejos difusos.",
    it: "Analizziamo la qualità del riflesso luminoso sulla superficie dell'occhio. Occhi ben idratati producono un punto luminoso nitido, mentre occhi secchi producono riflessi diffusi.",
    nl: "We analyseren de kwaliteit van de lichtreflectie op je oogoppervlak. Goed bevochtigde ogen produceren een scherpe, geconcentreerde lichtvlek, terwijl droge ogen diffuse reflecties produceren.",
    pl: "Analizujemy jakość odbicia światła na powierzchni oka. Dobrze nawilżone oczy dają ostry, skoncentrowany punkt świetlny, a suche oczy dają rozproszone odbicia.",
    pt: "Analisamos a qualidade da reflexão de luz na superfície do olho. Olhos bem hidratados produzem um ponto brilhante nítido, enquanto olhos secos produzem reflexos difusos.",
  } as L,
  whatAffects: {
    hydration: { en: "Overall hydration levels", sv: "Övergripande hydreringsnivåer", de: "Allgemeine Hydratation", fr: "Niveaux d'hydratation généraux", es: "Niveles generales de hidratación", it: "Livelli di idratazione generali", nl: "Algehele hydratieniveaus", pl: "Ogólne poziomy nawodnienia", pt: "Níveis gerais de hidratação" } as L,
    sleep: { en: "Sleep quality affecting eye moisture", sv: "Sömnkvalitet påverkar ögonfuktighet", de: "Schlafqualität beeinflusst Augenfeuchtigkeit", fr: "Qualité du sommeil affectant l'humidité oculaire", es: "Calidad del sueño afectando la humedad ocular", it: "Qualità del sonno che influenza l'umidità oculare", nl: "Slaapkwaliteit die oogvochtigheid beïnvloedt", pl: "Jakość snu wpływająca na wilgotność oka", pt: "Qualidade do sono afetando a humidade ocular" } as L,
    caffeine: { en: "Caffeine reducing tear production", sv: "Koffein minskar tårproduktion", de: "Koffein reduziert die Tränenproduktion", fr: "La caféine réduisant la production de larmes", es: "La cafeína reduciendo la producción de lágrimas", it: "La caffeina che riduce la produzione di lacrime", nl: "Cafeïne dat traanproductie vermindert", pl: "Kofeina zmniejszająca produkcję łez", pt: "Cafeína reduzindo a produção de lágrimas" } as L,
    climate: { en: "Dry air and wind exposure", sv: "Torr luft och vindexponering", de: "Trockene Luft und Windeinwirkung", fr: "Air sec et exposition au vent", es: "Aire seco y exposición al viento", it: "Aria secca ed esposizione al vento", nl: "Droge lucht en blootstelling aan wind", pl: "Suche powietrze i ekspozycja na wiatr", pt: "Ar seco e exposição ao vento" } as L,
    screen: { en: "Extended screen time reducing blink rate", sv: "Förlängd skärmtid minskar blinkfrekvens", de: "Verlängerte Bildschirmzeit reduziert die Blinzelrate", fr: "Temps d'écran prolongé réduisant le clignement", es: "Tiempo prolongado de pantalla reduciendo el parpadeo", it: "Tempo prolungato allo schermo che riduce il battito delle palpebre", nl: "Verlengde schermtijd die knipperfrequentie vermindert", pl: "Przedłużony czas ekranowy zmniejszający częstotliwość mrugania", pt: "Tempo prolongado de ecrã reduzindo a frequência de pestanejo" } as L,
  },
  howToImprove: [
    { en: "Drink water regularly throughout the day", sv: "Drick vatten regelbundet under dagen", de: "Trinken Sie regelmäßig Wasser über den Tag", fr: "Buvez de l'eau régulièrement tout au long de la journée", es: "Bebe agua regularmente durante el día", it: "Bevi acqua regolarmente durante il giorno", nl: "Drink regelmatig water gedurende de dag", pl: "Pij wodę regularnie w ciągu dnia", pt: "Beba água regularmente ao longo do dia" } as L,
    { en: "Use the 20-20-20 rule: every 20 min, look 20 ft away for 20 sec", sv: "Använd 20-20-20-regeln: var 20:e minut, titta 6 meter bort i 20 sekunder", de: "Nutzen Sie die 20-20-20-Regel: alle 20 Min, schauen Sie 6m weit für 20 Sek", fr: "Utilisez la règle 20-20-20 : toutes les 20 min, regardez à 6m pendant 20 sec", es: "Usa la regla 20-20-20: cada 20 min, mira a 6m durante 20 seg", it: "Usa la regola 20-20-20: ogni 20 min, guarda a 6m per 20 sec", nl: "Gebruik de 20-20-20 regel: elke 20 min, kijk 6m weg voor 20 sec", pl: "Stosuj zasadę 20-20-20: co 20 min, patrz 6m daleko przez 20 sek", pt: "Use a regra 20-20-20: a cada 20 min, olhe a 6m por 20 seg" } as L,
    { en: "Use a humidifier in dry environments", sv: "Använd en luftfuktare i torra miljöer", de: "Verwenden Sie einen Luftbefeuchter in trockenen Umgebungen", fr: "Utilisez un humidificateur dans les environnements secs", es: "Usa un humidificador en ambientes secos", it: "Usa un umidificatore in ambienti secchi", nl: "Gebruik een luchtbevochtiger in droge omgevingen", pl: "Używaj nawilżacza w suchym otoczeniu", pt: "Use um humidificador em ambientes secos" } as L,
    { en: "Blink more often, especially during screen use", sv: "Blinka oftare, särskilt vid skärmanvändning", de: "Blinzeln Sie öfter, besonders bei Bildschirmnutzung", fr: "Clignez plus souvent, surtout devant un écran", es: "Parpadea más a menudo, especialmente al usar pantallas", it: "Sbatti le palpebre più spesso, specialmente davanti allo schermo", nl: "Knipper vaker, vooral bij beeldschermgebruik", pl: "Mrugaj częściej, szczególnie przy ekranie", pt: "Pisque mais vezes, especialmente ao usar ecrãs" } as L,
  ],
  phaseContext: {},
  defaultPhaseContext: { en: "Tear film quality reflects eye surface moisture. Well-hydrated eyes feel comfortable and look clear.", sv: "Tårfilmskvalitet återspeglar ögonytans fuktighet. Välhydrerade ögon känns bekväma och ser klara ut.", de: "Tränenfilmqualität spiegelt die Feuchtigkeitsversorgung der Augenoberfläche wider.", fr: "La qualité du film lacrymal reflète l'humidité de la surface oculaire.", es: "La calidad de la película lagrimal refleja la humedad de la superficie ocular.", it: "La qualità del film lacrimale riflette l'umidità della superficie oculare.", nl: "Traanfilmkwaliteit weerspiegelt de vochtigheid van het oogoppervlak.", pl: "Jakość filmu łzowego odzwierciedla nawilżenie powierzchni oka.", pt: "A qualidade do filme lacrimal reflete a humidade da superfície ocular." } as L,
};

interface MarkerData {
  title: L;
  whatWeMeasure: L;
  whatAffects: Record<string, L>;
  howToImprove: L[];
  phaseContext: Partial<Record<CyclePhase, L>>;
  defaultPhaseContext: L;
}

const allMarkerData: Record<MarkerType, MarkerData> = {
  stress: stressData,
  energy: energyData,
  recovery: recoveryData,
  hydration: hydrationData,
  inflammation: inflammationData,
  fatigue: fatigueData,
  cognitiveSharpness: cognitiveSharpnessData,
  emotionalSensitivity: emotionalSensitivityData,
  socialEnergy: socialEnergyData,
  moodVolatility: moodVolatilityData,
  dehydrationTendency: dehydrationTendencyData,
  inflammatoryStress: inflammatoryStressData,
  pupilSize: pupilSizeData,
  symmetry: symmetryData,
  scleraYellowness: scleraYellownessData,
  underEyeDarkness: underEyeDarknessData,
  eyeOpenness: eyeOpennessData,
  tearFilmQuality: tearFilmQualityData,
};

export function getMarkerTranslation(
  marker: MarkerType,
  language: Language,
  phase: CyclePhase,
  checkIn: DailyCheckIn | null,
  _scan: ScanResult | null
): MarkerInfo {
  const data = allMarkerData[marker];
  
  if (!data) {
    return {
      title: marker,
      whatWeMeasure: "",
      whatAffects: [],
      howToImprove: [],
      hasActiveFactors: false,
      phaseContext: ""
    };
  }

  const hadCaffeine = checkIn?.hadCaffeine ?? false;
  const hadAlcohol = checkIn?.hadAlcohol ?? false;
  const hadSugar = checkIn?.hadSugar ?? false;
  const hadProcessedFood = checkIn?.hadProcessedFood ?? false;
  const isIll = checkIn?.isIll ?? false;
  const poorSleep = checkIn ? checkIn.sleep < 5 : false;

  const whatAffectsArray = Object.entries(data.whatAffects).map(([key, texts]): AffectItem => {
    let isActive = false;
    if (key.includes('caffeine')) isActive = hadCaffeine;
    else if (key.includes('alcohol')) isActive = hadAlcohol;
    else if (key.includes('sugar')) isActive = hadSugar;
    else if (key.includes('processed') || key.includes('Food')) isActive = hadProcessedFood;
    else if (key.includes('illness') || key === 'illness') isActive = isIll;
    else if (key === 'sleep') isActive = poorSleep;

    return { text: g(language, texts as L), isActiveToday: isActive };
  });

  const activeItems = whatAffectsArray.filter(item => item.isActiveToday);
  const generalItems = whatAffectsArray.filter(item => !item.isActiveToday);
  const sortedAffects = [...activeItems, ...generalItems];

  let phaseContextText = g(language, data.defaultPhaseContext);
  const phaseTexts = data.phaseContext as Partial<Record<CyclePhase, L>>;
  if (phaseTexts[phase]) {
    phaseContextText = g(language, phaseTexts[phase] as L);
  }

  return {
    title: g(language, data.title),
    whatWeMeasure: g(language, data.whatWeMeasure),
    whatAffects: sortedAffects,
    howToImprove: data.howToImprove.map(tip => g(language, tip)),
    hasActiveFactors: activeItems.length > 0,
    phaseContext: phaseContextText
  };
}

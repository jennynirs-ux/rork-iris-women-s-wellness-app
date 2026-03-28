import * as Print from 'expo-print';
import { UserProfile, DailyCheckIn, ScanResult, CyclePhase, CycleHistory, HealthData } from '@/types';
import { Language } from '@/constants/translations';

// ---------------------------------------------------------------------------
// Report-specific translations (inline to avoid bloating main translations.ts)
// ---------------------------------------------------------------------------
type ReportStrings = {
  title: string;
  disclaimerHeading: string;
  disclaimerBody: string;
  dataPeriod: string;
  days: string;
  name: string;
  reportGenerated: string;
  cycleSummary: string;
  currentPhase: string;
  cycleLength: string;
  regularity: string;
  regular: string;
  irregular: string;
  uncertain: string;
  lifeStage: string;
  regularCycling: string;
  lastPeriod: string;
  notRecorded: string;
  wellnessScores: string;
  last30Days: string;
  metric: string;
  average: string;
  min: string;
  max: string;
  energyLevel: string;
  stressLevel: string;
  recoveryReadiness: string;
  hydrationLevel: string;
  fatigueLevel: string;
  inflammation: string;
  trendChartTitle: string;
  trendChartSubtitle: string;
  date: string;
  stress: string;
  energy: string;
  recovery: string;
  hydration: string;
  fatigue: string;
  symptomFrequency: string;
  symptom: string;
  occurrences: string;
  percentOfDays: string;
  checkInSummary: string;
  averageMood: string;
  averageEnergy: string;
  averageSleep: string;
  weeklyMoodTrend: string;
  weeklySleepTrend: string;
  week: string;
  avgMood: string;
  avgSleep: string;
  checkIns: string;
  lifestyleFactors: string;
  factor: string;
  daysReported: string;
  caffeineDays: string;
  alcoholDays: string;
  sugarDays: string;
  processedFoodDays: string;
  illnessDays: string;
  appleHealthData: string;
  appleHealthDisclaimer: string;
  hrvAverage: string;
  hrvRange: string;
  wristTemperature: string;
  sleepDuration: string;
  restingHeartRate: string;
  stepCount: string;
  cycleHistoryTitle: string;
  cycleStart: string;
  cycleEnd: string;
  lengthDays: string;
  estOvulationDay: string;
  follicularLength: string;
  lutealLength: string;
  ongoing: string;
  notablePatterns: string;
  frequency: string;
  footerGenerated: string;
  footerDisclaimer1: string;
  footerDisclaimer2: string;
  footerDisclaimer3: string;
  phaseMenstrual: string;
  phaseFollicular: string;
  phaseOvulation: string;
  phaseLuteal: string;
};

const reportI18n: Record<Language, ReportStrings> = {
  en: {
    title: 'IRIS Wellness Report',
    disclaimerHeading: 'WELLNESS REPORT \u2014 NOT A MEDICAL DOCUMENT',
    disclaimerBody: 'This report summarizes wellness estimates from the IRIS app. It is not a medical assessment, diagnosis, or treatment recommendation. Please discuss any concerns with your healthcare provider.',
    dataPeriod: 'Data Period',
    days: 'days',
    name: 'Name',
    reportGenerated: 'Report Generated',
    cycleSummary: 'Cycle Summary',
    currentPhase: 'Current Phase',
    cycleLength: 'Cycle Length',
    regularity: 'Regularity',
    regular: 'Regular',
    irregular: 'Irregular',
    uncertain: 'Uncertain',
    lifeStage: 'Life Stage',
    regularCycling: 'Regular Cycling',
    lastPeriod: 'Last Period',
    notRecorded: 'Not recorded',
    wellnessScores: 'Wellness Scores',
    last30Days: 'Last 30 Days',
    metric: 'Metric',
    average: 'Average',
    min: 'Min',
    max: 'Max',
    energyLevel: 'Energy Level',
    stressLevel: 'Stress Level',
    recoveryReadiness: 'Recovery Readiness',
    hydrationLevel: 'Hydration Level',
    fatigueLevel: 'Fatigue Level',
    inflammation: 'Inflammation',
    trendChartTitle: '7-Day Scan Trend',
    trendChartSubtitle: 'Visual overview of recent scan scores (0\u201310 scale)',
    date: 'Date',
    stress: 'Stress',
    energy: 'Energy',
    recovery: 'Recovery',
    hydration: 'Hydration',
    fatigue: 'Fatigue',
    symptomFrequency: 'Symptom Frequency',
    symptom: 'Symptom',
    occurrences: 'Occurrences',
    percentOfDays: '% of Days',
    checkInSummary: 'Daily Check-in Summary',
    averageMood: 'Average Mood',
    averageEnergy: 'Average Energy',
    averageSleep: 'Average Sleep Quality',
    weeklyMoodTrend: 'Weekly Mood Trend',
    weeklySleepTrend: 'Weekly Sleep Trend',
    week: 'Week',
    avgMood: 'Avg Mood',
    avgSleep: 'Avg Sleep',
    checkIns: 'Check-ins',
    lifestyleFactors: 'Lifestyle Factors',
    factor: 'Factor',
    daysReported: 'Days Reported',
    caffeineDays: 'Caffeine',
    alcoholDays: 'Alcohol',
    sugarDays: 'Added Sugar',
    processedFoodDays: 'Processed Food',
    illnessDays: 'Feeling Ill',
    appleHealthData: 'Apple Health Data',
    appleHealthDisclaimer: 'Data synced from Apple Health. Values represent the most recent sync and may not cover the full report period.',
    hrvAverage: 'HRV (Heart Rate Variability)',
    hrvRange: 'HRV Range',
    wristTemperature: 'Wrist Temperature',
    sleepDuration: 'Sleep Duration',
    restingHeartRate: 'Resting Heart Rate',
    stepCount: 'Steps (latest)',
    cycleHistoryTitle: 'Cycle History',
    cycleStart: 'Start',
    cycleEnd: 'End',
    lengthDays: 'Length',
    estOvulationDay: 'Est. Ovulation Day',
    follicularLength: 'Follicular',
    lutealLength: 'Luteal',
    ongoing: 'Ongoing',
    notablePatterns: 'Notable Wellness Patterns',
    frequency: 'Frequency',
    footerGenerated: 'Generated by IRIS Women\'s Wellness App',
    footerDisclaimer1: 'WELLNESS ESTIMATES ONLY \u2014 NOT A MEDICAL DOCUMENT',
    footerDisclaimer2: 'This report is for informational purposes only. It is not a medical diagnosis, assessment, or treatment recommendation.',
    footerDisclaimer3: 'Please consult with your healthcare provider for medical advice.',
    phaseMenstrual: 'Menstrual',
    phaseFollicular: 'Follicular',
    phaseOvulation: 'Ovulation',
    phaseLuteal: 'Luteal',
  },
  sv: {
    title: 'IRIS V\u00e4lm\u00e5enderapport',
    disclaimerHeading: 'V\u00c4LM\u00c5ENDERAPPORT \u2014 INTE ETT MEDICINSKT DOKUMENT',
    disclaimerBody: 'Denna rapport sammanfattar v\u00e4lm\u00e5endeuppskattningar fr\u00e5n IRIS-appen. Det \u00e4r inte en medicinsk bed\u00f6mning, diagnos eller behandlingsrekommendation. Diskutera eventuella fr\u00e5gor med din v\u00e5rdgivare.',
    dataPeriod: 'Dataperiod',
    days: 'dagar',
    name: 'Namn',
    reportGenerated: 'Rapport skapad',
    cycleSummary: 'Cykel\u00f6versikt',
    currentPhase: 'Aktuell fas',
    cycleLength: 'Cykell\u00e4ngd',
    regularity: 'Regelbundenhet',
    regular: 'Regelbunden',
    irregular: 'Oregelbunden',
    uncertain: 'Os\u00e4ker',
    lifeStage: 'Livsfas',
    regularCycling: 'Regelbunden cykel',
    lastPeriod: 'Senaste mens',
    notRecorded: 'Ej registrerad',
    wellnessScores: 'V\u00e4lm\u00e5endepo\u00e4ng',
    last30Days: 'Senaste 30 dagarna',
    metric: 'M\u00e4tv\u00e4rde',
    average: 'Medel',
    min: 'Min',
    max: 'Max',
    energyLevel: 'Energiniv\u00e5',
    stressLevel: 'Stressniv\u00e5',
    recoveryReadiness: '\u00c5terh\u00e4mtning',
    hydrationLevel: 'V\u00e4tskeniv\u00e5',
    fatigueLevel: 'Tr\u00f6tthetsniv\u00e5',
    inflammation: 'Inflammation',
    trendChartTitle: '7-dagars scanningstrend',
    trendChartSubtitle: 'Visuell \u00f6versikt av senaste scanningsresultat (0\u201310)',
    date: 'Datum',
    stress: 'Stress',
    energy: 'Energi',
    recovery: '\u00c5terh\u00e4mtning',
    hydration: 'V\u00e4tska',
    fatigue: 'Tr\u00f6tthet',
    symptomFrequency: 'Symptomfrekvens',
    symptom: 'Symptom',
    occurrences: 'F\u00f6rekomster',
    percentOfDays: '% av dagar',
    checkInSummary: 'Daglig incheckning',
    averageMood: 'Genomsnittligt hum\u00f6r',
    averageEnergy: 'Genomsnittlig energi',
    averageSleep: 'Genomsnittlig s\u00f6mnkvalitet',
    weeklyMoodTrend: 'Veckovis hum\u00f6rtrend',
    weeklySleepTrend: 'Veckovis s\u00f6mntrend',
    week: 'Vecka',
    avgMood: 'Medel hum\u00f6r',
    avgSleep: 'Medel s\u00f6mn',
    checkIns: 'Incheckningar',
    lifestyleFactors: 'Livsstilsfaktorer',
    factor: 'Faktor',
    daysReported: 'Rapporterade dagar',
    caffeineDays: 'Koffein',
    alcoholDays: 'Alkohol',
    sugarDays: 'Tillsatt socker',
    processedFoodDays: 'Bearbetad mat',
    illnessDays: 'K\u00e4nner sig sjuk',
    appleHealthData: 'Apple H\u00e4lsa-data',
    appleHealthDisclaimer: 'Data synkad fr\u00e5n Apple H\u00e4lsa. V\u00e4rden representerar senaste synkningen och t\u00e4cker kanske inte hela rapportperioden.',
    hrvAverage: 'HRV (Hj\u00e4rtfrekvensvariabilitet)',
    hrvRange: 'HRV-omf\u00e5ng',
    wristTemperature: 'Handled stemperatur',
    sleepDuration: 'S\u00f6mntid',
    restingHeartRate: 'Vilohj\u00e4rtfrekvens',
    stepCount: 'Steg (senaste)',
    cycleHistoryTitle: 'Cykelhistorik',
    cycleStart: 'Start',
    cycleEnd: 'Slut',
    lengthDays: 'L\u00e4ngd',
    estOvulationDay: 'Ber\u00e4knad \u00e4gglossningsdag',
    follicularLength: 'Follikul\u00e4r',
    lutealLength: 'Luteal',
    ongoing: 'P\u00e5g\u00e5ende',
    notablePatterns: 'Anm\u00e4rkningsv\u00e4rda m\u00f6nster',
    frequency: 'Frekvens',
    footerGenerated: 'Skapad av IRIS Women\'s Wellness App',
    footerDisclaimer1: 'ENDAST V\u00c4LM\u00c5ENDEUPPSKATTNINGAR \u2014 INTE ETT MEDICINSKT DOKUMENT',
    footerDisclaimer2: 'Denna rapport \u00e4r endast f\u00f6r informations\u00e4ndam\u00e5l.',
    footerDisclaimer3: 'Konsultera din v\u00e5rdgivare f\u00f6r medicinsk r\u00e5dgivning.',
    phaseMenstrual: 'Menstruation',
    phaseFollicular: 'Follikul\u00e4r',
    phaseOvulation: '\u00c4gglossning',
    phaseLuteal: 'Luteal',
  },
  de: {
    title: 'IRIS Wellness-Bericht',
    disclaimerHeading: 'WELLNESS-BERICHT \u2014 KEIN MEDIZINISCHES DOKUMENT',
    disclaimerBody: 'Dieser Bericht fasst Wellness-Sch\u00e4tzungen der IRIS-App zusammen. Er ist keine medizinische Bewertung, Diagnose oder Behandlungsempfehlung. Besprechen Sie Bedenken mit Ihrem Arzt.',
    dataPeriod: 'Datenzeitraum',
    days: 'Tage',
    name: 'Name',
    reportGenerated: 'Bericht erstellt',
    cycleSummary: 'Zyklus\u00fcbersicht',
    currentPhase: 'Aktuelle Phase',
    cycleLength: 'Zyklusl\u00e4nge',
    regularity: 'Regelm\u00e4\u00dfigkeit',
    regular: 'Regelm\u00e4\u00dfig',
    irregular: 'Unregelm\u00e4\u00dfig',
    uncertain: 'Unsicher',
    lifeStage: 'Lebensphase',
    regularCycling: 'Regelm\u00e4\u00dfiger Zyklus',
    lastPeriod: 'Letzte Periode',
    notRecorded: 'Nicht erfasst',
    wellnessScores: 'Wellness-Werte',
    last30Days: 'Letzte 30 Tage',
    metric: 'Messwert',
    average: 'Durchschnitt',
    min: 'Min',
    max: 'Max',
    energyLevel: 'Energieniveau',
    stressLevel: 'Stressniveau',
    recoveryReadiness: 'Erholungsbereitschaft',
    hydrationLevel: 'Hydratation',
    fatigueLevel: 'Erm\u00fcdung',
    inflammation: 'Entz\u00fcndung',
    trendChartTitle: '7-Tage Scan-Trend',
    trendChartSubtitle: 'Visuelle \u00dcbersicht der Scan-Ergebnisse (0\u201310)',
    date: 'Datum',
    stress: 'Stress',
    energy: 'Energie',
    recovery: 'Erholung',
    hydration: 'Hydratation',
    fatigue: 'Erm\u00fcdung',
    symptomFrequency: 'Symptomh\u00e4ufigkeit',
    symptom: 'Symptom',
    occurrences: 'H\u00e4ufigkeit',
    percentOfDays: '% der Tage',
    checkInSummary: 'T\u00e4glicher Check-in',
    averageMood: 'Durchschnittliche Stimmung',
    averageEnergy: 'Durchschnittliche Energie',
    averageSleep: 'Durchschnittliche Schlafqualit\u00e4t',
    weeklyMoodTrend: 'W\u00f6chentlicher Stimmungstrend',
    weeklySleepTrend: 'W\u00f6chentlicher Schlaftrend',
    week: 'Woche',
    avgMood: 'Stimmung',
    avgSleep: 'Schlaf',
    checkIns: 'Check-ins',
    lifestyleFactors: 'Lebensstilfaktoren',
    factor: 'Faktor',
    daysReported: 'Gemeldete Tage',
    caffeineDays: 'Koffein',
    alcoholDays: 'Alkohol',
    sugarDays: 'Zucker',
    processedFoodDays: 'Verarbeitete Nahrung',
    illnessDays: 'Krank',
    appleHealthData: 'Apple Health-Daten',
    appleHealthDisclaimer: 'Daten aus Apple Health synchronisiert. Werte repr\u00e4sentieren die letzte Synchronisierung.',
    hrvAverage: 'HRV (Herzfrequenzvariabilit\u00e4t)',
    hrvRange: 'HRV-Bereich',
    wristTemperature: 'Handgelenktemperatur',
    sleepDuration: 'Schlafdauer',
    restingHeartRate: 'Ruheherzfrequenz',
    stepCount: 'Schritte (aktuell)',
    cycleHistoryTitle: 'Zyklushistorie',
    cycleStart: 'Start',
    cycleEnd: 'Ende',
    lengthDays: 'L\u00e4nge',
    estOvulationDay: 'Gesch. Eisprung',
    follicularLength: 'Follikul\u00e4r',
    lutealLength: 'Luteal',
    ongoing: 'Laufend',
    notablePatterns: 'Bemerkenswerte Muster',
    frequency: 'H\u00e4ufigkeit',
    footerGenerated: 'Erstellt von IRIS Women\'s Wellness App',
    footerDisclaimer1: 'NUR WELLNESS-SCH\u00c4TZUNGEN \u2014 KEIN MEDIZINISCHES DOKUMENT',
    footerDisclaimer2: 'Dieser Bericht dient nur zu Informationszwecken.',
    footerDisclaimer3: 'Konsultieren Sie Ihren Arzt f\u00fcr medizinische Beratung.',
    phaseMenstrual: 'Menstruation',
    phaseFollicular: 'Follikul\u00e4r',
    phaseOvulation: 'Eisprung',
    phaseLuteal: 'Luteal',
  },
  fr: {
    title: 'Rapport Bien-\u00eatre IRIS',
    disclaimerHeading: 'RAPPORT DE BIEN-\u00caTRE \u2014 PAS UN DOCUMENT M\u00c9DICAL',
    disclaimerBody: 'Ce rapport r\u00e9sume les estimations de bien-\u00eatre de l\'application IRIS. Il ne constitue pas une \u00e9valuation m\u00e9dicale, un diagnostic ou une recommandation de traitement.',
    dataPeriod: 'P\u00e9riode de donn\u00e9es',
    days: 'jours',
    name: 'Nom',
    reportGenerated: 'Rapport g\u00e9n\u00e9r\u00e9',
    cycleSummary: 'R\u00e9sum\u00e9 du cycle',
    currentPhase: 'Phase actuelle',
    cycleLength: 'Dur\u00e9e du cycle',
    regularity: 'R\u00e9gularit\u00e9',
    regular: 'R\u00e9gulier',
    irregular: 'Irr\u00e9gulier',
    uncertain: 'Incertain',
    lifeStage: '\u00c9tape de vie',
    regularCycling: 'Cycle r\u00e9gulier',
    lastPeriod: 'Derni\u00e8res r\u00e8gles',
    notRecorded: 'Non enregistr\u00e9',
    wellnessScores: 'Scores de bien-\u00eatre',
    last30Days: '30 derniers jours',
    metric: 'M\u00e9trique',
    average: 'Moyenne',
    min: 'Min',
    max: 'Max',
    energyLevel: '\u00c9nergie',
    stressLevel: 'Stress',
    recoveryReadiness: 'R\u00e9cup\u00e9ration',
    hydrationLevel: 'Hydratation',
    fatigueLevel: 'Fatigue',
    inflammation: 'Inflammation',
    trendChartTitle: 'Tendance sur 7 jours',
    trendChartSubtitle: 'Aper\u00e7u visuel des r\u00e9sultats de scan r\u00e9cents (0\u201310)',
    date: 'Date',
    stress: 'Stress',
    energy: '\u00c9nergie',
    recovery: 'R\u00e9cup\u00e9ration',
    hydration: 'Hydratation',
    fatigue: 'Fatigue',
    symptomFrequency: 'Fr\u00e9quence des sympt\u00f4mes',
    symptom: 'Sympt\u00f4me',
    occurrences: 'Occurrences',
    percentOfDays: '% des jours',
    checkInSummary: 'R\u00e9sum\u00e9 des check-ins',
    averageMood: 'Humeur moyenne',
    averageEnergy: '\u00c9nergie moyenne',
    averageSleep: 'Qualit\u00e9 de sommeil moyenne',
    weeklyMoodTrend: 'Tendance hebdomadaire de l\'humeur',
    weeklySleepTrend: 'Tendance hebdomadaire du sommeil',
    week: 'Semaine',
    avgMood: 'Humeur',
    avgSleep: 'Sommeil',
    checkIns: 'Check-ins',
    lifestyleFactors: 'Facteurs de style de vie',
    factor: 'Facteur',
    daysReported: 'Jours signal\u00e9s',
    caffeineDays: 'Caf\u00e9ine',
    alcoholDays: 'Alcool',
    sugarDays: 'Sucre ajout\u00e9',
    processedFoodDays: 'Aliments transform\u00e9s',
    illnessDays: 'Malade',
    appleHealthData: 'Donn\u00e9es Apple Sant\u00e9',
    appleHealthDisclaimer: 'Donn\u00e9es synchronis\u00e9es depuis Apple Sant\u00e9. Les valeurs repr\u00e9sentent la derni\u00e8re synchronisation.',
    hrvAverage: 'VFC (Variabilit\u00e9 de fr\u00e9quence cardiaque)',
    hrvRange: 'Plage VFC',
    wristTemperature: 'Temp\u00e9rature du poignet',
    sleepDuration: 'Dur\u00e9e de sommeil',
    restingHeartRate: 'Fr\u00e9quence cardiaque au repos',
    stepCount: 'Pas (dernier)',
    cycleHistoryTitle: 'Historique du cycle',
    cycleStart: 'D\u00e9but',
    cycleEnd: 'Fin',
    lengthDays: 'Dur\u00e9e',
    estOvulationDay: 'Ovulation est.',
    follicularLength: 'Folliculaire',
    lutealLength: 'Lut\u00e9ale',
    ongoing: 'En cours',
    notablePatterns: 'Mod\u00e8les notables',
    frequency: 'Fr\u00e9quence',
    footerGenerated: 'G\u00e9n\u00e9r\u00e9 par IRIS Women\'s Wellness App',
    footerDisclaimer1: 'ESTIMATIONS DE BIEN-\u00caTRE UNIQUEMENT \u2014 PAS UN DOCUMENT M\u00c9DICAL',
    footerDisclaimer2: 'Ce rapport est \u00e0 titre informatif uniquement.',
    footerDisclaimer3: 'Consultez votre m\u00e9decin pour des conseils m\u00e9dicaux.',
    phaseMenstrual: 'Menstruation',
    phaseFollicular: 'Folliculaire',
    phaseOvulation: 'Ovulation',
    phaseLuteal: 'Lut\u00e9ale',
  },
  es: {
    title: 'Informe de Bienestar IRIS',
    disclaimerHeading: 'INFORME DE BIENESTAR \u2014 NO ES UN DOCUMENTO M\u00c9DICO',
    disclaimerBody: 'Este informe resume estimaciones de bienestar de la app IRIS. No es una evaluaci\u00f3n m\u00e9dica, diagn\u00f3stico ni recomendaci\u00f3n de tratamiento.',
    dataPeriod: 'Per\u00edodo de datos',
    days: 'd\u00edas',
    name: 'Nombre',
    reportGenerated: 'Informe generado',
    cycleSummary: 'Resumen del ciclo',
    currentPhase: 'Fase actual',
    cycleLength: 'Duraci\u00f3n del ciclo',
    regularity: 'Regularidad',
    regular: 'Regular',
    irregular: 'Irregular',
    uncertain: 'Incierto',
    lifeStage: 'Etapa de vida',
    regularCycling: 'Ciclo regular',
    lastPeriod: '\u00daltima menstruaci\u00f3n',
    notRecorded: 'No registrado',
    wellnessScores: 'Puntuaciones de bienestar',
    last30Days: '\u00daltimos 30 d\u00edas',
    metric: 'M\u00e9trica',
    average: 'Promedio',
    min: 'M\u00edn',
    max: 'M\u00e1x',
    energyLevel: 'Energ\u00eda',
    stressLevel: 'Estr\u00e9s',
    recoveryReadiness: 'Recuperaci\u00f3n',
    hydrationLevel: 'Hidrataci\u00f3n',
    fatigueLevel: 'Fatiga',
    inflammation: 'Inflamaci\u00f3n',
    trendChartTitle: 'Tendencia de 7 d\u00edas',
    trendChartSubtitle: 'Resumen visual de escaneos recientes (0\u201310)',
    date: 'Fecha',
    stress: 'Estr\u00e9s',
    energy: 'Energ\u00eda',
    recovery: 'Recuperaci\u00f3n',
    hydration: 'Hidrataci\u00f3n',
    fatigue: 'Fatiga',
    symptomFrequency: 'Frecuencia de s\u00edntomas',
    symptom: 'S\u00edntoma',
    occurrences: 'Ocurrencias',
    percentOfDays: '% de d\u00edas',
    checkInSummary: 'Resumen de check-in diario',
    averageMood: '\u00c1nimo promedio',
    averageEnergy: 'Energ\u00eda promedio',
    averageSleep: 'Calidad de sue\u00f1o promedio',
    weeklyMoodTrend: 'Tendencia semanal de \u00e1nimo',
    weeklySleepTrend: 'Tendencia semanal de sue\u00f1o',
    week: 'Semana',
    avgMood: '\u00c1nimo',
    avgSleep: 'Sue\u00f1o',
    checkIns: 'Check-ins',
    lifestyleFactors: 'Factores de estilo de vida',
    factor: 'Factor',
    daysReported: 'D\u00edas reportados',
    caffeineDays: 'Cafe\u00edna',
    alcoholDays: 'Alcohol',
    sugarDays: 'Az\u00facar a\u00f1adido',
    processedFoodDays: 'Alimentos procesados',
    illnessDays: 'Enfermedad',
    appleHealthData: 'Datos de Apple Salud',
    appleHealthDisclaimer: 'Datos sincronizados desde Apple Salud. Los valores representan la \u00faltima sincronizaci\u00f3n.',
    hrvAverage: 'VFC (Variabilidad de frecuencia card\u00edaca)',
    hrvRange: 'Rango VFC',
    wristTemperature: 'Temperatura de mu\u00f1eca',
    sleepDuration: 'Duraci\u00f3n del sue\u00f1o',
    restingHeartRate: 'Frecuencia card\u00edaca en reposo',
    stepCount: 'Pasos (reciente)',
    cycleHistoryTitle: 'Historial del ciclo',
    cycleStart: 'Inicio',
    cycleEnd: 'Fin',
    lengthDays: 'Duraci\u00f3n',
    estOvulationDay: 'Ovulaci\u00f3n est.',
    follicularLength: 'Folicular',
    lutealLength: 'L\u00fatea',
    ongoing: 'En curso',
    notablePatterns: 'Patrones notables',
    frequency: 'Frecuencia',
    footerGenerated: 'Generado por IRIS Women\'s Wellness App',
    footerDisclaimer1: 'SOLO ESTIMACIONES DE BIENESTAR \u2014 NO ES UN DOCUMENTO M\u00c9DICO',
    footerDisclaimer2: 'Este informe es solo para fines informativos.',
    footerDisclaimer3: 'Consulte a su m\u00e9dico para asesoramiento m\u00e9dico.',
    phaseMenstrual: 'Menstrual',
    phaseFollicular: 'Folicular',
    phaseOvulation: 'Ovulaci\u00f3n',
    phaseLuteal: 'L\u00fatea',
  },
  it: {
    title: 'Rapporto Benessere IRIS',
    disclaimerHeading: 'RAPPORTO DI BENESSERE \u2014 NON UN DOCUMENTO MEDICO',
    disclaimerBody: 'Questo rapporto riassume le stime di benessere dall\'app IRIS. Non \u00e8 una valutazione medica, diagnosi o raccomandazione di trattamento.',
    dataPeriod: 'Periodo dati',
    days: 'giorni',
    name: 'Nome',
    reportGenerated: 'Rapporto generato',
    cycleSummary: 'Riepilogo del ciclo',
    currentPhase: 'Fase attuale',
    cycleLength: 'Durata del ciclo',
    regularity: 'Regolarit\u00e0',
    regular: 'Regolare',
    irregular: 'Irregolare',
    uncertain: 'Incerto',
    lifeStage: 'Fase della vita',
    regularCycling: 'Ciclo regolare',
    lastPeriod: 'Ultimo ciclo',
    notRecorded: 'Non registrato',
    wellnessScores: 'Punteggi benessere',
    last30Days: 'Ultimi 30 giorni',
    metric: 'Metrica',
    average: 'Media',
    min: 'Min',
    max: 'Max',
    energyLevel: 'Energia',
    stressLevel: 'Stress',
    recoveryReadiness: 'Recupero',
    hydrationLevel: 'Idratazione',
    fatigueLevel: 'Affaticamento',
    inflammation: 'Infiammazione',
    trendChartTitle: 'Tendenza 7 giorni',
    trendChartSubtitle: 'Panoramica visiva delle scansioni recenti (0\u201310)',
    date: 'Data',
    stress: 'Stress',
    energy: 'Energia',
    recovery: 'Recupero',
    hydration: 'Idratazione',
    fatigue: 'Affaticamento',
    symptomFrequency: 'Frequenza sintomi',
    symptom: 'Sintomo',
    occurrences: 'Occorrenze',
    percentOfDays: '% dei giorni',
    checkInSummary: 'Riepilogo check-in giornaliero',
    averageMood: 'Umore medio',
    averageEnergy: 'Energia media',
    averageSleep: 'Qualit\u00e0 del sonno media',
    weeklyMoodTrend: 'Tendenza settimanale umore',
    weeklySleepTrend: 'Tendenza settimanale sonno',
    week: 'Settimana',
    avgMood: 'Umore',
    avgSleep: 'Sonno',
    checkIns: 'Check-in',
    lifestyleFactors: 'Fattori di stile di vita',
    factor: 'Fattore',
    daysReported: 'Giorni segnalati',
    caffeineDays: 'Caffeina',
    alcoholDays: 'Alcol',
    sugarDays: 'Zucchero aggiunto',
    processedFoodDays: 'Cibo processato',
    illnessDays: 'Malattia',
    appleHealthData: 'Dati Apple Salute',
    appleHealthDisclaimer: 'Dati sincronizzati da Apple Salute. I valori rappresentano l\'ultima sincronizzazione.',
    hrvAverage: 'VFC (Variabilit\u00e0 frequenza cardiaca)',
    hrvRange: 'Range VFC',
    wristTemperature: 'Temperatura polso',
    sleepDuration: 'Durata del sonno',
    restingHeartRate: 'Frequenza cardiaca a riposo',
    stepCount: 'Passi (recente)',
    cycleHistoryTitle: 'Storico del ciclo',
    cycleStart: 'Inizio',
    cycleEnd: 'Fine',
    lengthDays: 'Durata',
    estOvulationDay: 'Ovulazione stim.',
    follicularLength: 'Follicolare',
    lutealLength: 'Luteale',
    ongoing: 'In corso',
    notablePatterns: 'Pattern notevoli',
    frequency: 'Frequenza',
    footerGenerated: 'Generato da IRIS Women\'s Wellness App',
    footerDisclaimer1: 'SOLO STIME DI BENESSERE \u2014 NON UN DOCUMENTO MEDICO',
    footerDisclaimer2: 'Questo rapporto \u00e8 solo a scopo informativo.',
    footerDisclaimer3: 'Consultare il medico per consigli medici.',
    phaseMenstrual: 'Mestruale',
    phaseFollicular: 'Follicolare',
    phaseOvulation: 'Ovulazione',
    phaseLuteal: 'Luteale',
  },
  nl: {
    title: 'IRIS Welzijnsrapport',
    disclaimerHeading: 'WELZIJNSRAPPORT \u2014 GEEN MEDISCH DOCUMENT',
    disclaimerBody: 'Dit rapport vat welzijnsschattingen van de IRIS-app samen. Het is geen medische beoordeling, diagnose of behandeladvies.',
    dataPeriod: 'Gegevensperiode',
    days: 'dagen',
    name: 'Naam',
    reportGenerated: 'Rapport gegenereerd',
    cycleSummary: 'Cyclusoverzicht',
    currentPhase: 'Huidige fase',
    cycleLength: 'Cycluslengte',
    regularity: 'Regelmaat',
    regular: 'Regelmatig',
    irregular: 'Onregelmatig',
    uncertain: 'Onzeker',
    lifeStage: 'Levensfase',
    regularCycling: 'Regelmatige cyclus',
    lastPeriod: 'Laatste menstruatie',
    notRecorded: 'Niet geregistreerd',
    wellnessScores: 'Welzijnsscores',
    last30Days: 'Laatste 30 dagen',
    metric: 'Meetwaarde',
    average: 'Gemiddeld',
    min: 'Min',
    max: 'Max',
    energyLevel: 'Energie',
    stressLevel: 'Stress',
    recoveryReadiness: 'Herstel',
    hydrationLevel: 'Hydratatie',
    fatigueLevel: 'Vermoeidheid',
    inflammation: 'Ontsteking',
    trendChartTitle: '7-daagse scantrend',
    trendChartSubtitle: 'Visueel overzicht van recente scans (0\u201310)',
    date: 'Datum',
    stress: 'Stress',
    energy: 'Energie',
    recovery: 'Herstel',
    hydration: 'Hydratatie',
    fatigue: 'Vermoeidheid',
    symptomFrequency: 'Symptoomfrequentie',
    symptom: 'Symptoom',
    occurrences: 'Voorkomens',
    percentOfDays: '% van dagen',
    checkInSummary: 'Dagelijkse check-in samenvatting',
    averageMood: 'Gemiddelde stemming',
    averageEnergy: 'Gemiddelde energie',
    averageSleep: 'Gemiddelde slaapkwaliteit',
    weeklyMoodTrend: 'Wekelijkse stemmingstrend',
    weeklySleepTrend: 'Wekelijkse slaaptrend',
    week: 'Week',
    avgMood: 'Stemming',
    avgSleep: 'Slaap',
    checkIns: 'Check-ins',
    lifestyleFactors: 'Levensstijlfactoren',
    factor: 'Factor',
    daysReported: 'Gerapporteerde dagen',
    caffeineDays: 'Cafe\u00efne',
    alcoholDays: 'Alcohol',
    sugarDays: 'Suiker',
    processedFoodDays: 'Bewerkt voedsel',
    illnessDays: 'Ziek',
    appleHealthData: 'Apple Gezondheid-data',
    appleHealthDisclaimer: 'Gegevens gesynchroniseerd vanuit Apple Gezondheid. Waarden vertegenwoordigen de laatste synchronisatie.',
    hrvAverage: 'HRV (Hartslagvariabiliteit)',
    hrvRange: 'HRV-bereik',
    wristTemperature: 'Polstemperatuur',
    sleepDuration: 'Slaapduur',
    restingHeartRate: 'Rusthartslag',
    stepCount: 'Stappen (recent)',
    cycleHistoryTitle: 'Cyclusgeschiedenis',
    cycleStart: 'Start',
    cycleEnd: 'Einde',
    lengthDays: 'Lengte',
    estOvulationDay: 'Gesch. ovulatie',
    follicularLength: 'Folliculair',
    lutealLength: 'Luteaal',
    ongoing: 'Lopend',
    notablePatterns: 'Opvallende patronen',
    frequency: 'Frequentie',
    footerGenerated: 'Gegenereerd door IRIS Women\'s Wellness App',
    footerDisclaimer1: 'ALLEEN WELZIJNSSCHATTINGEN \u2014 GEEN MEDISCH DOCUMENT',
    footerDisclaimer2: 'Dit rapport is alleen ter informatie.',
    footerDisclaimer3: 'Raadpleeg uw arts voor medisch advies.',
    phaseMenstrual: 'Menstruatie',
    phaseFollicular: 'Folliculair',
    phaseOvulation: 'Ovulatie',
    phaseLuteal: 'Luteaal',
  },
  pl: {
    title: 'Raport Wellness IRIS',
    disclaimerHeading: 'RAPORT WELLNESS \u2014 NIE JEST DOKUMENTEM MEDYCZNYM',
    disclaimerBody: 'Ten raport podsumowuje szacunki samopoczucia z aplikacji IRIS. Nie stanowi oceny medycznej, diagnozy ani zalecenia leczenia.',
    dataPeriod: 'Okres danych',
    days: 'dni',
    name: 'Imi\u0119',
    reportGenerated: 'Raport wygenerowany',
    cycleSummary: 'Podsumowanie cyklu',
    currentPhase: 'Aktualna faza',
    cycleLength: 'D\u0142ugo\u015b\u0107 cyklu',
    regularity: 'Regularno\u015b\u0107',
    regular: 'Regularny',
    irregular: 'Nieregularny',
    uncertain: 'Niepewny',
    lifeStage: 'Etap \u017cycia',
    regularCycling: 'Regularny cykl',
    lastPeriod: 'Ostatnia miesi\u0105czka',
    notRecorded: 'Nie zarejestrowano',
    wellnessScores: 'Wyniki wellness',
    last30Days: 'Ostatnie 30 dni',
    metric: 'Wska\u017anik',
    average: '\u015arednia',
    min: 'Min',
    max: 'Maks',
    energyLevel: 'Energia',
    stressLevel: 'Stres',
    recoveryReadiness: 'Regeneracja',
    hydrationLevel: 'Nawodnienie',
    fatigueLevel: 'Zm\u0119czenie',
    inflammation: 'Stan zapalny',
    trendChartTitle: '7-dniowy trend skan\u00f3w',
    trendChartSubtitle: 'Wizualny przegl\u0105d ostatnich wynik\u00f3w (0\u201310)',
    date: 'Data',
    stress: 'Stres',
    energy: 'Energia',
    recovery: 'Regeneracja',
    hydration: 'Nawodnienie',
    fatigue: 'Zm\u0119czenie',
    symptomFrequency: 'Cz\u0119stotliwo\u015b\u0107 objaw\u00f3w',
    symptom: 'Objaw',
    occurrences: 'Wyst\u0105pienia',
    percentOfDays: '% dni',
    checkInSummary: 'Podsumowanie dziennych zg\u0142osze\u0144',
    averageMood: '\u015aredni nastr\u00f3j',
    averageEnergy: '\u015arednia energia',
    averageSleep: '\u015arednia jako\u015b\u0107 snu',
    weeklyMoodTrend: 'Tygodniowy trend nastroju',
    weeklySleepTrend: 'Tygodniowy trend snu',
    week: 'Tydzie\u0144',
    avgMood: 'Nastr\u00f3j',
    avgSleep: 'Sen',
    checkIns: 'Zg\u0142oszenia',
    lifestyleFactors: 'Czynniki stylu \u017cycia',
    factor: 'Czynnik',
    daysReported: 'Zg\u0142oszone dni',
    caffeineDays: 'Kofeina',
    alcoholDays: 'Alkohol',
    sugarDays: 'Cukier',
    processedFoodDays: '\u017bywno\u015b\u0107 przetworzona',
    illnessDays: 'Choroba',
    appleHealthData: 'Dane Apple Zdrowie',
    appleHealthDisclaimer: 'Dane zsynchronizowane z Apple Zdrowie. Warto\u015bci reprezentuj\u0105 ostatni\u0105 synchronizacj\u0119.',
    hrvAverage: 'HRV (Zmienno\u015b\u0107 rytmu serca)',
    hrvRange: 'Zakres HRV',
    wristTemperature: 'Temperatura nadgarstka',
    sleepDuration: 'Czas snu',
    restingHeartRate: 'T\u0119tno spoczynkowe',
    stepCount: 'Kroki (ostatnie)',
    cycleHistoryTitle: 'Historia cyklu',
    cycleStart: 'Pocz\u0105tek',
    cycleEnd: 'Koniec',
    lengthDays: 'D\u0142ugo\u015b\u0107',
    estOvulationDay: 'Szac. owulacja',
    follicularLength: 'Folikularna',
    lutealLength: 'Lutealna',
    ongoing: 'W toku',
    notablePatterns: 'Znacz\u0105ce wzorce',
    frequency: 'Cz\u0119stotliwo\u015b\u0107',
    footerGenerated: 'Wygenerowano przez IRIS Women\'s Wellness App',
    footerDisclaimer1: 'TYLKO SZACUNKI WELLNESS \u2014 NIE JEST DOKUMENTEM MEDYCZNYM',
    footerDisclaimer2: 'Ten raport s\u0142u\u017cy wy\u0142\u0105cznie celom informacyjnym.',
    footerDisclaimer3: 'Skonsultuj si\u0119 z lekarzem w sprawie porady medycznej.',
    phaseMenstrual: 'Menstruacja',
    phaseFollicular: 'Folikularna',
    phaseOvulation: 'Owulacja',
    phaseLuteal: 'Lutealna',
  },
  pt: {
    title: 'Relat\u00f3rio de Bem-estar IRIS',
    disclaimerHeading: 'RELAT\u00d3RIO DE BEM-ESTAR \u2014 N\u00c3O \u00c9 UM DOCUMENTO M\u00c9DICO',
    disclaimerBody: 'Este relat\u00f3rio resume estimativas de bem-estar do app IRIS. N\u00e3o \u00e9 uma avalia\u00e7\u00e3o m\u00e9dica, diagn\u00f3stico ou recomenda\u00e7\u00e3o de tratamento.',
    dataPeriod: 'Per\u00edodo de dados',
    days: 'dias',
    name: 'Nome',
    reportGenerated: 'Relat\u00f3rio gerado',
    cycleSummary: 'Resumo do ciclo',
    currentPhase: 'Fase atual',
    cycleLength: 'Dura\u00e7\u00e3o do ciclo',
    regularity: 'Regularidade',
    regular: 'Regular',
    irregular: 'Irregular',
    uncertain: 'Incerto',
    lifeStage: 'Fase da vida',
    regularCycling: 'Ciclo regular',
    lastPeriod: '\u00daltima menstrua\u00e7\u00e3o',
    notRecorded: 'N\u00e3o registrado',
    wellnessScores: 'Pontua\u00e7\u00f5es de bem-estar',
    last30Days: '\u00daltimos 30 dias',
    metric: 'M\u00e9trica',
    average: 'M\u00e9dia',
    min: 'M\u00edn',
    max: 'M\u00e1x',
    energyLevel: 'Energia',
    stressLevel: 'Estresse',
    recoveryReadiness: 'Recupera\u00e7\u00e3o',
    hydrationLevel: 'Hidrata\u00e7\u00e3o',
    fatigueLevel: 'Fadiga',
    inflammation: 'Inflama\u00e7\u00e3o',
    trendChartTitle: 'Tend\u00eancia de 7 dias',
    trendChartSubtitle: 'Vis\u00e3o geral dos resultados de escaneamento recentes (0\u201310)',
    date: 'Data',
    stress: 'Estresse',
    energy: 'Energia',
    recovery: 'Recupera\u00e7\u00e3o',
    hydration: 'Hidrata\u00e7\u00e3o',
    fatigue: 'Fadiga',
    symptomFrequency: 'Frequ\u00eancia de sintomas',
    symptom: 'Sintoma',
    occurrences: 'Ocorr\u00eancias',
    percentOfDays: '% dos dias',
    checkInSummary: 'Resumo de check-in di\u00e1rio',
    averageMood: 'Humor m\u00e9dio',
    averageEnergy: 'Energia m\u00e9dia',
    averageSleep: 'Qualidade m\u00e9dia do sono',
    weeklyMoodTrend: 'Tend\u00eancia semanal de humor',
    weeklySleepTrend: 'Tend\u00eancia semanal de sono',
    week: 'Semana',
    avgMood: 'Humor',
    avgSleep: 'Sono',
    checkIns: 'Check-ins',
    lifestyleFactors: 'Fatores de estilo de vida',
    factor: 'Fator',
    daysReported: 'Dias relatados',
    caffeineDays: 'Cafe\u00edna',
    alcoholDays: '\u00c1lcool',
    sugarDays: 'A\u00e7\u00facar adicionado',
    processedFoodDays: 'Alimentos processados',
    illnessDays: 'Doen\u00e7a',
    appleHealthData: 'Dados Apple Sa\u00fade',
    appleHealthDisclaimer: 'Dados sincronizados do Apple Sa\u00fade. Os valores representam a \u00faltima sincroniza\u00e7\u00e3o.',
    hrvAverage: 'VFC (Variabilidade da frequ\u00eancia card\u00edaca)',
    hrvRange: 'Faixa VFC',
    wristTemperature: 'Temperatura do pulso',
    sleepDuration: 'Dura\u00e7\u00e3o do sono',
    restingHeartRate: 'Frequ\u00eancia card\u00edaca em repouso',
    stepCount: 'Passos (recente)',
    cycleHistoryTitle: 'Hist\u00f3rico do ciclo',
    cycleStart: 'In\u00edcio',
    cycleEnd: 'Fim',
    lengthDays: 'Dura\u00e7\u00e3o',
    estOvulationDay: 'Ovula\u00e7\u00e3o est.',
    follicularLength: 'Folicular',
    lutealLength: 'L\u00fatea',
    ongoing: 'Em andamento',
    notablePatterns: 'Padr\u00f5es not\u00e1veis',
    frequency: 'Frequ\u00eancia',
    footerGenerated: 'Gerado por IRIS Women\'s Wellness App',
    footerDisclaimer1: 'APENAS ESTIMATIVAS DE BEM-ESTAR \u2014 N\u00c3O \u00c9 UM DOCUMENTO M\u00c9DICO',
    footerDisclaimer2: 'Este relat\u00f3rio \u00e9 apenas para fins informativos.',
    footerDisclaimer3: 'Consulte seu m\u00e9dico para aconselhamento m\u00e9dico.',
    phaseMenstrual: 'Menstrual',
    phaseFollicular: 'Folicular',
    phaseOvulation: 'Ovula\u00e7\u00e3o',
    phaseLuteal: 'L\u00fatea',
  },
};

function getReportStrings(lang?: Language): ReportStrings {
  return reportI18n[lang ?? 'en'] ?? reportI18n.en;
}

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------
interface PatternAnalysis {
  description: string;
  frequency: string;
}

interface WeeklyAverages {
  weekLabel: string;
  avgMood: number;
  avgSleep: number;
  count: number;
}

interface LifestyleCount {
  caffeine: number;
  alcohol: number;
  sugar: number;
  processedFood: number;
  illness: number;
  total: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getPhaseDisplayName(phase: CyclePhase, r: ReportStrings): string {
  const phaseNames: Record<CyclePhase, string> = {
    menstrual: r.phaseMenstrual,
    follicular: r.phaseFollicular,
    ovulation: r.phaseOvulation,
    luteal: r.phaseLuteal,
  };
  return phaseNames[phase] || phase;
}

function safeAvg(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

function colorForScore(score: number): string {
  if (score >= 7) return '#4CAF50';
  if (score >= 4) return '#FFC107';
  return '#F44336';
}

function inverseColorForScore(score: number): string {
  // For stress/fatigue/inflammation where lower is better
  if (score <= 3) return '#4CAF50';
  if (score <= 6) return '#FFC107';
  return '#F44336';
}

function formatDateShort(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${month}/${day}`;
  } catch {
    return dateStr;
  }
}

function formatDateMedium(dateStr: string, locale: string = 'en-US'): string {
  try {
    return new Date(dateStr).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

// ---------------------------------------------------------------------------
// Data computation
// ---------------------------------------------------------------------------
function calculateWellnessAverages(scans: ScanResult[]): {
  energy: { avg: number; min: number; max: number };
  stress: { avg: number; min: number; max: number };
  recovery: { avg: number; min: number; max: number };
  hydration: { avg: number; min: number; max: number };
  fatigue: { avg: number; min: number; max: number };
  inflammation: { avg: number; min: number; max: number };
} {
  if (scans.length === 0) {
    return {
      energy: { avg: 0, min: 0, max: 0 },
      stress: { avg: 0, min: 0, max: 0 },
      recovery: { avg: 0, min: 0, max: 0 },
      hydration: { avg: 0, min: 0, max: 0 },
      fatigue: { avg: 0, min: 0, max: 0 },
      inflammation: { avg: 0, min: 0, max: 0 },
    };
  }

  const calc = (values: number[]) => ({
    avg: safeAvg(values),
    min: Math.min(...values),
    max: Math.max(...values),
  });

  return {
    energy: calc(scans.map(s => s.energyScore)),
    stress: calc(scans.map(s => s.stressScore)),
    recovery: calc(scans.map(s => s.recoveryScore)),
    hydration: calc(scans.map(s => s.hydrationLevel)),
    fatigue: calc(scans.map(s => s.fatigueLevel)),
    inflammation: calc(scans.map(s => s.inflammation)),
  };
}

function getSymptomFrequency(checkIns: DailyCheckIn[]): Array<{ symptom: string; count: number; percentage: number }> {
  const symptomMap: Record<string, number> = {};
  const totalDays = checkIns.length;

  checkIns.forEach(checkIn => {
    checkIn.symptoms.forEach(symptom => {
      symptomMap[symptom] = (symptomMap[symptom] || 0) + 1;
    });
  });

  return Object.entries(symptomMap)
    .map(([symptom, count]) => ({
      symptom,
      count,
      percentage: totalDays > 0 ? Math.round((count / totalDays) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

function calculateCheckInAverages(checkIns: DailyCheckIn[]): {
  mood: number;
  energy: number;
  sleep: number;
} {
  if (checkIns.length === 0) {
    return { mood: 0, energy: 0, sleep: 0 };
  }

  return {
    mood: safeAvg(checkIns.map(ci => ci.mood ?? 0)),
    energy: safeAvg(checkIns.map(ci => ci.energy ?? 0)),
    sleep: safeAvg(checkIns.map(ci => ci.sleep ?? 0)),
  };
}

function calculateWeeklyTrends(checkIns: DailyCheckIn[]): WeeklyAverages[] {
  if (checkIns.length === 0) return [];

  // Sort check-ins by date ascending
  const sorted = [...checkIns].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Group into calendar weeks
  const weeks: Record<string, { moods: number[]; sleeps: number[] }> = {};
  sorted.forEach(ci => {
    const d = new Date(ci.date);
    // ISO week start (Monday)
    const dayOfWeek = d.getDay() || 7; // 1=Mon..7=Sun
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - dayOfWeek + 1);
    const key = weekStart.toISOString().slice(0, 10);

    if (!weeks[key]) weeks[key] = { moods: [], sleeps: [] };
    if (ci.mood != null) weeks[key].moods.push(ci.mood);
    if (ci.sleep != null) weeks[key].sleeps.push(ci.sleep);
  });

  return Object.entries(weeks)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6) // last 6 weeks
    .map(([weekStart, data]) => ({
      weekLabel: formatDateShort(weekStart),
      avgMood: safeAvg(data.moods),
      avgSleep: safeAvg(data.sleeps),
      count: Math.max(data.moods.length, data.sleeps.length),
    }));
}

function calculateLifestyleFactors(checkIns: DailyCheckIn[]): LifestyleCount {
  const counts: LifestyleCount = { caffeine: 0, alcohol: 0, sugar: 0, processedFood: 0, illness: 0, total: checkIns.length };

  checkIns.forEach(ci => {
    if (ci.hadCaffeine) counts.caffeine++;
    if (ci.hadAlcohol) counts.alcohol++;
    if (ci.hadSugar) counts.sugar++;
    if (ci.hadProcessedFood) counts.processedFood++;
    if (ci.isIll) counts.illness++;
  });

  return counts;
}

function detectPatterns(scans: ScanResult[], checkIns: DailyCheckIn[], phase: CyclePhase, r: ReportStrings): PatternAnalysis[] {
  const patterns: PatternAnalysis[] = [];
  const wellnessAverages = calculateWellnessAverages(scans);
  const checkInAverages = calculateCheckInAverages(checkIns);

  if (wellnessAverages.stress.avg > 6) {
    patterns.push({
      description: `Higher stress wellness scores estimated (avg: ${wellnessAverages.stress.avg}/10), particularly during ${getPhaseDisplayName(phase, r)} phase`,
      frequency: "Ongoing",
    });
  }

  if (wellnessAverages.energy.avg < 4) {
    patterns.push({
      description: `Low energy levels during measurement period (avg: ${wellnessAverages.energy.avg}/10)`,
      frequency: "Consistent",
    });
  }

  if (wellnessAverages.hydration.avg < 4) {
    patterns.push({
      description: "Consistently low hydration levels - recommend increased water intake",
      frequency: "Persistent",
    });
  }

  if (wellnessAverages.inflammation.avg > 6) {
    patterns.push({
      description: `Higher inflammation wellness scores (avg: ${wellnessAverages.inflammation.avg}/10)`,
      frequency: "Notable",
    });
  }

  if (checkInAverages.sleep < 5) {
    patterns.push({
      description: `Sleep quality concerns (avg: ${checkInAverages.sleep}/10) - consider sleep hygiene evaluation`,
      frequency: "Regular",
    });
  }

  const sleepValues = checkIns.map(ci => ci.sleep);
  if (sleepValues.length > 2) {
    const variance = sleepValues.reduce((sum, val) => sum + Math.pow(val - checkInAverages.sleep, 2), 0) / sleepValues.length;
    if (Math.sqrt(variance) > 3) {
      patterns.push({
        description: "Variable mood and energy levels estimated - may benefit from stress management techniques",
        frequency: "Intermittent",
      });
    }
  }

  // Additional lifestyle-based patterns
  const lifestyle = calculateLifestyleFactors(checkIns);
  if (lifestyle.total > 0) {
    const caffeinePct = Math.round((lifestyle.caffeine / lifestyle.total) * 100);
    if (caffeinePct > 80) {
      patterns.push({
        description: `High caffeine frequency (${caffeinePct}% of days) - may affect sleep quality and stress`,
        frequency: "Frequent",
      });
    }
    const illPct = Math.round((lifestyle.illness / lifestyle.total) * 100);
    if (illPct > 20) {
      patterns.push({
        description: `Illness reported on ${illPct}% of days during this period`,
        frequency: "Notable",
      });
    }
  }

  return patterns;
}

function getLast7DaysScans(scans: ScanResult[]): ScanResult[] {
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  return [...scans]
    .filter(s => new Date(s.date).getTime() >= sevenDaysAgo)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7);
}

// ---------------------------------------------------------------------------
// HTML section builders
// ---------------------------------------------------------------------------
function buildBarCell(value: number, color: string, maxWidth: number = 80): string {
  const width = Math.max(2, Math.round((value / 10) * maxWidth));
  return `<td style="padding:4px 6px;">
    <div style="display:flex;align-items:center;gap:4px;">
      <div style="width:${width}px;height:14px;background-color:${color};border-radius:2px;"></div>
      <span style="font-size:10px;color:#555;">${value}</span>
    </div>
  </td>`;
}

function buildTrendChartSection(scans: ScanResult[], r: ReportStrings): string {
  const recent = getLast7DaysScans(scans);
  if (recent.length === 0) return '';

  const rows = recent.map(scan => {
    const dateLabel = formatDateShort(scan.date);
    return `<tr>
      <td style="padding:4px 6px;font-size:10px;font-weight:bold;white-space:nowrap;">${dateLabel}</td>
      ${buildBarCell(scan.stressScore, inverseColorForScore(scan.stressScore))}
      ${buildBarCell(scan.energyScore, colorForScore(scan.energyScore))}
      ${buildBarCell(scan.recoveryScore, colorForScore(scan.recoveryScore))}
      ${buildBarCell(scan.hydrationLevel, colorForScore(scan.hydrationLevel))}
      ${buildBarCell(scan.fatigueLevel, inverseColorForScore(scan.fatigueLevel))}
      ${buildBarCell(scan.inflammation, inverseColorForScore(scan.inflammation))}
    </tr>`;
  }).join('');

  return `
  <div class="section">
    <div class="section-title">${r.trendChartTitle}</div>
    <p style="font-size:10px;color:#888;margin-bottom:8px;">${r.trendChartSubtitle}</p>
    <table style="font-size:10px;">
      <thead>
        <tr>
          <th style="padding:4px 6px;">${r.date}</th>
          <th style="padding:4px 6px;">${r.stress}</th>
          <th style="padding:4px 6px;">${r.energy}</th>
          <th style="padding:4px 6px;">${r.recovery}</th>
          <th style="padding:4px 6px;">${r.hydration}</th>
          <th style="padding:4px 6px;">${r.fatigue}</th>
          <th style="padding:4px 6px;">${r.inflammation}</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
    <div style="font-size:9px;color:#aaa;margin-top:4px;">
      <span style="display:inline-block;width:10px;height:10px;background:#4CAF50;border-radius:2px;margin-right:2px;vertical-align:middle;"></span> Good
      <span style="display:inline-block;width:10px;height:10px;background:#FFC107;border-radius:2px;margin-left:8px;margin-right:2px;vertical-align:middle;"></span> Moderate
      <span style="display:inline-block;width:10px;height:10px;background:#F44336;border-radius:2px;margin-left:8px;margin-right:2px;vertical-align:middle;"></span> Attention
    </div>
  </div>`;
}

function buildWeeklyTrendsSection(checkIns: DailyCheckIn[], r: ReportStrings): string {
  const weeks = calculateWeeklyTrends(checkIns);
  if (weeks.length === 0) return '';

  const moodRows = weeks.map(w => `<tr>
    <td style="padding:4px 6px;font-size:10px;">${w.weekLabel}</td>
    ${buildBarCell(w.avgMood, colorForScore(w.avgMood))}
    <td style="padding:4px 6px;font-size:10px;color:#888;">${w.count}</td>
  </tr>`).join('');

  const sleepRows = weeks.map(w => `<tr>
    <td style="padding:4px 6px;font-size:10px;">${w.weekLabel}</td>
    ${buildBarCell(w.avgSleep, colorForScore(w.avgSleep))}
    <td style="padding:4px 6px;font-size:10px;color:#888;">${w.count}</td>
  </tr>`).join('');

  return `
  <div class="section">
    <div class="section-title">${r.weeklyMoodTrend}</div>
    <table style="font-size:10px;">
      <thead><tr><th style="padding:4px 6px;">${r.week}</th><th style="padding:4px 6px;">${r.avgMood}</th><th style="padding:4px 6px;">${r.checkIns}</th></tr></thead>
      <tbody>${moodRows}</tbody>
    </table>
  </div>
  <div class="section">
    <div class="section-title">${r.weeklySleepTrend}</div>
    <table style="font-size:10px;">
      <thead><tr><th style="padding:4px 6px;">${r.week}</th><th style="padding:4px 6px;">${r.avgSleep}</th><th style="padding:4px 6px;">${r.checkIns}</th></tr></thead>
      <tbody>${sleepRows}</tbody>
    </table>
  </div>`;
}

function buildLifestyleSection(checkIns: DailyCheckIn[], r: ReportStrings): string {
  const lf = calculateLifestyleFactors(checkIns);
  if (lf.total === 0) return '';

  const pct = (n: number) => lf.total > 0 ? Math.round((n / lf.total) * 100) : 0;

  const rows = [
    { label: r.caffeineDays, count: lf.caffeine, p: pct(lf.caffeine) },
    { label: r.alcoholDays, count: lf.alcohol, p: pct(lf.alcohol) },
    { label: r.sugarDays, count: lf.sugar, p: pct(lf.sugar) },
    { label: r.processedFoodDays, count: lf.processedFood, p: pct(lf.processedFood) },
    { label: r.illnessDays, count: lf.illness, p: pct(lf.illness) },
  ];

  // Only show factors that have at least 1 occurrence
  const relevantRows = rows.filter(row => row.count > 0);
  if (relevantRows.length === 0) return '';

  return `
  <div class="section">
    <div class="section-title">${r.lifestyleFactors}</div>
    <table>
      <thead>
        <tr>
          <th>${r.factor}</th>
          <th>${r.daysReported}</th>
          <th>${r.percentOfDays}</th>
        </tr>
      </thead>
      <tbody>
        ${relevantRows.map(row => `<tr>
          <td>${row.label}</td>
          <td>${row.count} / ${lf.total}</td>
          <td>${row.p}%</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

function buildAppleHealthSection(healthData: HealthData | null | undefined, r: ReportStrings): string {
  if (!healthData) return '';

  const hasAnyData = healthData.hrv != null ||
    healthData.wristTemperature != null ||
    healthData.sleepHours != null ||
    healthData.restingHeartRate != null ||
    healthData.steps != null;

  if (!hasAnyData) return '';

  const rows: string[] = [];

  if (healthData.hrv != null) {
    rows.push(`<div class="metric-row">
      <span class="metric-label">${r.hrvAverage}:</span>
      <span class="metric-value">${healthData.hrv} ms</span>
    </div>`);
  }

  if (healthData.restingHeartRate != null) {
    rows.push(`<div class="metric-row">
      <span class="metric-label">${r.restingHeartRate}:</span>
      <span class="metric-value">${healthData.restingHeartRate} bpm</span>
    </div>`);
  }

  if (healthData.wristTemperature != null) {
    rows.push(`<div class="metric-row">
      <span class="metric-label">${r.wristTemperature}:</span>
      <span class="metric-value">${healthData.wristTemperature}\u00b0C</span>
    </div>`);
  }

  if (healthData.sleepHours != null) {
    rows.push(`<div class="metric-row">
      <span class="metric-label">${r.sleepDuration}:</span>
      <span class="metric-value">${healthData.sleepHours} h</span>
    </div>`);
  }

  if (healthData.steps != null) {
    rows.push(`<div class="metric-row">
      <span class="metric-label">${r.stepCount}:</span>
      <span class="metric-value">${healthData.steps.toLocaleString()}</span>
    </div>`);
  }

  return `
  <div class="section">
    <div class="section-title">${r.appleHealthData}</div>
    ${rows.join('')}
    <div style="margin-top:8px;padding:8px 10px;background-color:#f0f4ff;border:1px solid #c5d0e6;border-radius:4px;font-size:10px;color:#555;">
      ${r.appleHealthDisclaimer}
    </div>
  </div>`;
}

function buildCycleHistorySection(cycleHistory: CycleHistory[] | null | undefined, r: ReportStrings, locale: string): string {
  if (!cycleHistory || cycleHistory.length === 0) return '';

  // Show last 6 cycles
  const recentCycles = cycleHistory.slice(-6).reverse();

  const rows = recentCycles.map(cycle => {
    const start = formatDateMedium(cycle.startDate, locale);
    const end = cycle.endDate ? formatDateMedium(cycle.endDate, locale) : r.ongoing;
    const length = cycle.lengthDays != null ? `${cycle.lengthDays} ${r.days}` : '\u2014';
    const ovDay = cycle.ovulationDay != null ? `${r.days} ${cycle.ovulationDay}` : '\u2014';
    const follicular = cycle.follicularLengthDays != null ? `${cycle.follicularLengthDays} ${r.days}` : '\u2014';
    const luteal = cycle.lutealLengthDays != null ? `${cycle.lutealLengthDays} ${r.days}` : '\u2014';

    return `<tr>
      <td>${start}</td>
      <td>${end}</td>
      <td>${length}</td>
      <td>${ovDay}</td>
      <td>${follicular}</td>
      <td>${luteal}</td>
    </tr>`;
  }).join('');

  return `
  <div class="section" style="page-break-before:auto;">
    <div class="section-title">${r.cycleHistoryTitle}</div>
    <table>
      <thead>
        <tr>
          <th>${r.cycleStart}</th>
          <th>${r.cycleEnd}</th>
          <th>${r.lengthDays}</th>
          <th>${r.estOvulationDay}</th>
          <th>${r.follicularLength}</th>
          <th>${r.lutealLength}</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </div>`;
}

// ---------------------------------------------------------------------------
// Main HTML builder
// ---------------------------------------------------------------------------
function buildHTML(
  userProfile: UserProfile,
  scans: ScanResult[],
  checkIns: DailyCheckIn[],
  phase: CyclePhase,
  healthData?: HealthData | null,
  cycleHistory?: CycleHistory[] | null,
  lang?: Language,
): string {
  const r = getReportStrings(lang);
  const locale = lang === 'en' ? 'en-US' : lang ?? 'en-US';

  const today = new Date();
  const todayStr = today.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });

  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startDateStr = thirtyDaysAgo.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
  const endDateStr = today.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });

  const wellnessAverages = calculateWellnessAverages(scans);
  const symptomFrequency = getSymptomFrequency(checkIns);
  const checkInAverages = calculateCheckInAverages(checkIns);
  const patterns = detectPatterns(scans, checkIns, phase, r);

  const lastPeriodDate = userProfile.lastPeriodDate
    ? new Date(userProfile.lastPeriodDate).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })
    : r.notRecorded;

  const regularity = userProfile.cycleRegularity === 'regular'
    ? r.regular
    : userProfile.cycleRegularity === 'irregular'
      ? r.irregular
      : r.uncertain;

  const lifeStageLabel = userProfile.lifeStage === 'regular'
    ? r.regularCycling
    : userProfile.lifeStage.charAt(0).toUpperCase() + userProfile.lifeStage.slice(1);

  // Build optional sections
  const trendChart = buildTrendChartSection(scans, r);
  const weeklyTrends = buildWeeklyTrendsSection(checkIns, r);
  const lifestyleSection = buildLifestyleSection(checkIns, r);
  const appleHealthSection = buildAppleHealthSection(healthData, r);
  const cycleHistorySection = buildCycleHistorySection(cycleHistory, r, locale);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #333;
      line-height: 1.5;
      background: white;
      padding: 40px;
    }
    .header {
      border-bottom: 3px solid #7B68EE;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }
    .logo-area {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #7B68EE, #9B89FF);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 16px;
      text-align: center;
      line-height: 36px;
    }
    .title {
      font-size: 22px;
      font-weight: bold;
      color: #333;
    }
    .title-sub {
      font-size: 11px;
      color: #999;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .patient-info {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      font-size: 12px;
      color: #666;
    }
    .date-range {
      font-size: 11px;
      color: #888;
      margin-top: 6px;
      padding: 6px 10px;
      background-color: #f5f3ff;
      border-radius: 4px;
      display: inline-block;
    }
    .section {
      margin-bottom: 28px;
    }
    .section-title {
      font-size: 14px;
      font-weight: bold;
      color: #333;
      margin-bottom: 12px;
      border-bottom: 2px solid #e8e4ff;
      padding-bottom: 6px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
      font-size: 11px;
    }
    th {
      background-color: #f5f3ff;
      border: 1px solid #d5d0ea;
      padding: 8px;
      text-align: left;
      font-weight: bold;
      color: #333;
    }
    td {
      border: 1px solid #e0dce8;
      padding: 8px;
      text-align: left;
    }
    tr:nth-child(even) {
      background-color: #faf9ff;
    }
    .metric-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
      font-size: 12px;
    }
    .metric-label {
      font-weight: bold;
      color: #333;
    }
    .metric-value {
      color: #666;
    }
    .pattern-item {
      margin-bottom: 12px;
      padding: 10px;
      background-color: #f9f9f9;
      border-left: 3px solid #7B68EE;
      font-size: 12px;
    }
    .pattern-description {
      color: #333;
      margin-bottom: 3px;
    }
    .pattern-frequency {
      color: #888;
      font-size: 11px;
      font-style: italic;
    }
    .wellness-disclaimer-banner {
      margin-bottom: 24px;
      padding: 16px 20px;
      background-color: #fff8e1;
      border: 2px solid #ffcc02;
      border-radius: 8px;
      font-size: 12px;
      color: #333;
      text-align: center;
      line-height: 1.6;
    }
    .wellness-disclaimer-banner strong {
      display: block;
      font-size: 13px;
      margin-bottom: 6px;
      color: #b8860b;
      letter-spacing: 0.5px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 15px;
      border-top: 2px solid #e8e4ff;
      font-size: 10px;
      color: #888;
      text-align: center;
    }
    .footer strong {
      color: #666;
    }
    .cycle-info {
      display: flex;
      justify-content: space-around;
      margin-bottom: 15px;
      font-size: 11px;
      padding: 12px;
      background-color: #f9f8ff;
      border-radius: 6px;
      border: 1px solid #e8e4ff;
    }
    .cycle-item {
      flex: 1;
    }
    .cycle-label {
      color: #888;
      font-size: 10px;
      margin-bottom: 3px;
    }
    .cycle-value {
      font-weight: bold;
      color: #333;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-top">
      <div class="logo-area">
        <div class="logo-icon">I</div>
        <div>
          <div class="title">${r.title}</div>
          <div class="title-sub">Women's Wellness</div>
        </div>
      </div>
    </div>
    <div class="patient-info">
      <div><strong>${r.name}:</strong> ${userProfile.name}</div>
      <div><strong>${r.reportGenerated}:</strong> ${todayStr}</div>
    </div>
    <div class="date-range">${r.dataPeriod}: ${startDateStr} \u2013 ${endDateStr} (30 ${r.days})</div>
  </div>

  <div class="wellness-disclaimer-banner">
    <strong>${r.disclaimerHeading}</strong>
    ${r.disclaimerBody}
  </div>

  <div class="section">
    <div class="section-title">${r.cycleSummary}</div>
    <div class="cycle-info">
      <div class="cycle-item">
        <div class="cycle-label">${r.currentPhase}</div>
        <div class="cycle-value">${getPhaseDisplayName(phase, r)}</div>
      </div>
      <div class="cycle-item">
        <div class="cycle-label">${r.cycleLength}</div>
        <div class="cycle-value">${userProfile.cycleLength} ${r.days}</div>
      </div>
      <div class="cycle-item">
        <div class="cycle-label">${r.regularity}</div>
        <div class="cycle-value">${regularity}</div>
      </div>
      <div class="cycle-item">
        <div class="cycle-label">${r.lifeStage}</div>
        <div class="cycle-value">${lifeStageLabel}</div>
      </div>
      <div class="cycle-item">
        <div class="cycle-label">${r.lastPeriod}</div>
        <div class="cycle-value">${lastPeriodDate}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">${r.wellnessScores} (${r.last30Days})</div>
    <table>
      <thead>
        <tr>
          <th>${r.metric}</th>
          <th>${r.average}</th>
          <th>${r.min}</th>
          <th>${r.max}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${r.energyLevel}</td>
          <td>${wellnessAverages.energy.avg}/10</td>
          <td>${wellnessAverages.energy.min}</td>
          <td>${wellnessAverages.energy.max}</td>
        </tr>
        <tr>
          <td>${r.stressLevel}</td>
          <td>${wellnessAverages.stress.avg}/10</td>
          <td>${wellnessAverages.stress.min}</td>
          <td>${wellnessAverages.stress.max}</td>
        </tr>
        <tr>
          <td>${r.recoveryReadiness}</td>
          <td>${wellnessAverages.recovery.avg}/10</td>
          <td>${wellnessAverages.recovery.min}</td>
          <td>${wellnessAverages.recovery.max}</td>
        </tr>
        <tr>
          <td>${r.hydrationLevel}</td>
          <td>${wellnessAverages.hydration.avg}/10</td>
          <td>${wellnessAverages.hydration.min}</td>
          <td>${wellnessAverages.hydration.max}</td>
        </tr>
        <tr>
          <td>${r.fatigueLevel}</td>
          <td>${wellnessAverages.fatigue.avg}/10</td>
          <td>${wellnessAverages.fatigue.min}</td>
          <td>${wellnessAverages.fatigue.max}</td>
        </tr>
        <tr>
          <td>${r.inflammation}</td>
          <td>${wellnessAverages.inflammation.avg}/10</td>
          <td>${wellnessAverages.inflammation.min}</td>
          <td>${wellnessAverages.inflammation.max}</td>
        </tr>
      </tbody>
    </table>
  </div>

  ${trendChart}

  ${symptomFrequency.length > 0 ? `
  <div class="section">
    <div class="section-title">${r.symptomFrequency} (${r.last30Days})</div>
    <table>
      <thead>
        <tr>
          <th>${r.symptom}</th>
          <th>${r.occurrences}</th>
          <th>${r.percentOfDays}</th>
        </tr>
      </thead>
      <tbody>
        ${symptomFrequency.slice(0, 15).map(s => `
        <tr>
          <td>${s.symptom}</td>
          <td>${s.count}</td>
          <td>${s.percentage}%</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}

  <div class="section">
    <div class="section-title">${r.checkInSummary}</div>
    <div class="metric-row">
      <span class="metric-label">${r.averageMood}:</span>
      <span class="metric-value">${checkInAverages.mood}/10</span>
    </div>
    <div class="metric-row">
      <span class="metric-label">${r.averageEnergy}:</span>
      <span class="metric-value">${checkInAverages.energy}/10</span>
    </div>
    <div class="metric-row">
      <span class="metric-label">${r.averageSleep}:</span>
      <span class="metric-value">${checkInAverages.sleep}/10</span>
    </div>
  </div>

  ${weeklyTrends}

  ${lifestyleSection}

  ${appleHealthSection}

  ${cycleHistorySection}

  ${patterns.length > 0 ? `
  <div class="section">
    <div class="section-title">${r.notablePatterns}</div>
    ${patterns.map(p => `
    <div class="pattern-item">
      <div class="pattern-description">${p.description}</div>
      <div class="pattern-frequency">${r.frequency}: ${p.frequency}</div>
    </div>
    `).join('')}
  </div>
  ` : ''}

  <div class="footer">
    <p>${r.footerGenerated}</p>
    <p style="margin-top:4px;"><strong>${r.footerDisclaimer1}</strong></p>
    <p>${r.footerDisclaimer2}</p>
    <p>${r.footerDisclaimer3}</p>
  </div>
</body>
</html>
  `;

  return html;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export async function generateDoctorReport(
  userProfile: UserProfile,
  scans: ScanResult[],
  checkIns: DailyCheckIn[],
  phase: CyclePhase,
  healthData?: HealthData | null,
  cycleHistory?: CycleHistory[] | null,
  lang?: Language,
): Promise<string> {
  try {
    const html = buildHTML(userProfile, scans, checkIns, phase, healthData, cycleHistory, lang);

    const pdfUri = await Print.printToFileAsync({
      html,
      base64: false,
    });

    return pdfUri.uri;
  } catch (error) {
    // Error propagated to caller — no console logging of health data in production
    throw error;
  }
}

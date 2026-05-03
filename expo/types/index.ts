export type CyclePhase = "menstrual" | "follicular" | "ovulation" | "luteal";

export type LifeStage = "regular" | "pregnancy" | "postpartum" | "perimenopause" | "menopause";

export type PhaseConfidence = "high" | "medium" | "low";

export type BleedingLevel = "none" | "spotting" | "light" | "medium" | "heavy";

export type CycleRegularity = "regular" | "irregular" | "not_sure";

export type BirthControlType = "none" | "pill" | "iud_hormonal" | "iud_copper" | "implant" | "ring" | "patch" | "injection" | "other";

export interface PhaseProbabilities {
  menstrual: number;
  follicular: number;
  ovulation: number;
  luteal: number;
}

export interface PhaseEstimate {
  mostLikely: CyclePhase;
  probabilities: PhaseProbabilities;
  confidence: PhaseConfidence;
  reasoning: string;
  lifeStageOverride?: 'pregnancy' | 'postpartum' | 'perimenopause' | 'menopause';
}

export type Goal = 
  | "energy"
  | "weight_loss"
  | "strength"
  | "hormonal_balance"
  | "postpartum"
  | "pregnancy"
  | "perimenopause"
  | "skin_health"
  | "stress_reduction";

export type MainFocus = 
  | "energy_vitality"
  | "stress_recovery"
  | "fitness_strength"
  | "hormonal_balance"
  | "skin_selfcare"
  | "body_awareness";

export interface UserProfile {
  name: string;
  birthday: string;
  weight: number;
  height: number;
  goals: Goal[];
  mainFocus: MainFocus[];
  cycleLength: number;
  cycleLengthMin?: number;
  cycleLengthMax?: number;
  lastPeriodDate: string;
  lifeStage: LifeStage;
  cycleRegularity: CycleRegularity;
  birthControl: BirthControlType;
  isPremium: boolean;
  hasCompletedOnboarding: boolean;
  pregnancyDueDate?: string;
  weeksPregnant?: number;
  birthDate?: string;
  deliveryType?: "vaginal" | "cesarean" | "other";
  dataConsent?: boolean;
  partnerCode?: string;
  linkedPartnerId?: string | null;
}

export interface DailyCheckIn {
  date: string;
  timestamp: number;
  mood: number;
  energy: number;
  sleep: number;
  symptoms: string[];
  notes: string;
  bleedingLevel?: BleedingLevel;
  sleepHours?: number;
  stressLevel?: number;
  hadCaffeine?: boolean;
  hadAlcohol?: boolean;
  isIll?: boolean;
  hadSugar?: boolean;
  hadProcessedFood?: boolean;
  cervicalMucus?: "dry" | "sticky" | "creamy" | "egg_white";
  ovulationPain?: boolean;
  hotFlashCount?: number;
  hotFlashSeverity?: 'mild' | 'moderate' | 'severe';
  nightSweatSeverity?: 'none' | 'mild' | 'moderate' | 'severe';
  tookHRT?: boolean;
}

export interface RawOpticalSignals {
  pupilDiameter: number;
  pupilContractionSpeed: number;
  pupilDilationSpeed: number;
  pupilLatency: number;
  pupilRecoveryTime: number;
  pupilSymmetry: number;
  blinkFrequency: number;
  blinkDuration: number;
  microSaccadeFrequency: number;
  gazeStability: number;
  scleraRedness: number;
  scleraBrightness: number;
  tearFilmReflectivity: number;
}

/**
 * v1.1 measured optical signals.
 *
 * Unlike `RawOpticalSignals`, every field here is computed from actual pixel
 * data (or cross-frame analysis from the burst) rather than synthesized from
 * other wellness scores. Set by the burst capture pipeline only; absent on
 * legacy single-frame scans.
 *
 * Fields:
 *  - pupilToIrisRatio: pupil width / total eye width, ~[0.2, 0.7]
 *  - limbalRingClarity: sharpness of iris/sclera boundary, [0, 1]
 *  - vesselDensity: red branching pattern density in sclera, [0, 1]
 *  - realBlinkRate: blinks per second from cross-frame openness transitions
 *  - tearFilmStability: 1 − std-dev of tear film quality across burst, [0, 1]
 *  - frameStability: low brightness/pupil variance across frames = steady scan, [0, 1]
 *  - burstFramesAnalyzed: count of frames that passed validation; 0 = single-frame fallback
 *  - burstDurationMs: span of the burst (first to last capture timestamp)
 */
export interface MeasuredOpticalSignals {
  pupilToIrisRatio: number;
  limbalRingClarity: number;
  vesselDensity: number;
  realBlinkRate: number;
  tearFilmStability: number;
  frameStability: number;
  burstFramesAnalyzed: number;
  burstDurationMs: number;
}

export interface PhysiologicalStates {
  stressLevel: "low" | "medium" | "high";
  sympatheticActivation: number;
  calmVsAlert: number;
  cognitiveLoad: number;
  energyLevel: number;
  fatigueLoad: number;
  recoveryReadiness: number;
  sleepDebtLikelihood: number;
  dehydrationTendency: number;
  inflammatoryStress: number;
}

export interface SkinBeautySignals {
  skinStress: number;
  breakoutRiskWindow: boolean;
  drynessTendency: number;
  bestBeautyCareTiming: boolean;
  avoidIrritationFlag: boolean;
}

export interface EmotionalMentalState {
  emotionalSensitivity: number;
  socialEnergy: number;
  moodVolatilityRisk: number;
  cognitiveSharpness: number;
}

export interface ScanResult {
  id: string;
  date: string;
  timestamp: number;
  stressScore: number;
  energyScore: number;
  recoveryScore: number;
  hydrationLevel: number;
  fatigueLevel: number;
  inflammation: number;
  hormonalState: CyclePhase;
  phaseEstimate?: PhaseEstimate;
  recommendations: string[];
  rawOpticalSignals: RawOpticalSignals;
  /**
   * v1.1+ only: real measured signals from burst capture + advanced analysis.
   * Optional for backward compat with v1.0 scans persisted in AsyncStorage.
   */
  measuredOpticalSignals?: MeasuredOpticalSignals;
  physiologicalStates: PhysiologicalStates;
  skinBeautySignals: SkinBeautySignals;
  emotionalMentalState: EmotionalMentalState;
}

export interface PersonalBaseline {
  pupilDiameter: number;
  pupilContractionSpeed: number;
  pupilLatency: number;
  blinkFrequency: number;
  microSaccadeFrequency: number;
  samplesCount: number;
}

export interface PhaseBaseline {
  menstrual: PersonalBaseline | null;
  follicular: PersonalBaseline | null;
  ovulation: PersonalBaseline | null;
  luteal: PersonalBaseline | null;
}

export interface CycleStatistics {
  avgCycleLength: number;
  avgLutealLength: number;
  avgFollicularLength: number;
  cycleVariability: number;
  lutealVariability: number;
}

export interface CycleHistory {
  startDate: string;
  endDate?: string;
  lengthDays?: number;
  ovulationDay?: number;
  lutealLengthDays?: number;
  follicularLengthDays?: number;
}

export interface HealthData {
  sleepHours?: number;
  sleepStartTime?: string;
  sleepEndTime?: string;
  menstrualFlowLevel?: 'none' | 'light' | 'medium' | 'heavy';
  menstrualCycleStart?: string;
  menstrualCycleEnd?: string;
  heartRate?: number;
  restingHeartRate?: number;
  steps?: number;
  activeEnergy?: number;
  hrv?: number;
  wristTemperature?: number;
  /** Apple Watch Series 8+ temperature deviation from personal baseline (°C) */
  wristTemperatureDeviation?: number;
  /** SpO2 percentage from Apple Watch */
  spo2?: number;
  /** Breaths per minute from Apple Watch */
  respiratoryRate?: number;
  /** Mindfulness minutes from Apple Health */
  mindfulnessMinutes?: number;
  /** Stand hours from Apple Watch */
  standHours?: number;
  lastSyncDate?: string;
}

export interface HealthConnectionState {
  isConnected: boolean;
  isAvailable: boolean;
  enabledDataTypes: HealthDataType[];
  lastSyncDate?: string;
}

export type HealthDataType = 'sleep' | 'menstrualCycle' | 'heartRate' | 'steps' | 'activeEnergy' | 'hrv' | 'temperature' | 'spo2' | 'respiratoryRate' | 'mindfulness';

// ── Oura Ring Types ───────────────────────────────────────────────────────────

export interface OuraReadinessContributors {
  hrvBalance: number;
  bodyTemperature: number;
  previousDayActivity: number | null;
  sleepBalance: number;
  restingHeartRate: number;
  recoveryIndex: number;
  activityBalance?: number;
  sleepRegularity?: number;
}

export interface OuraData {
  // Readiness
  readinessScore: number;                    // 0–100
  readinessContributors: OuraReadinessContributors;
  /** °C deviation from personal baseline — key cycle-tracking signal */
  temperatureDeviation: number;
  /** Trend component of temperature deviation */
  temperatureTrendDeviation: number;
  // Sleep
  sleepScore: number;                        // 0–100
  totalSleepDuration: number;                // seconds
  remSleepDuration: number;                  // seconds
  deepSleepDuration: number;                 // seconds
  lightSleepDuration: number;                // seconds
  sleepEfficiency: number;                   // 0–100
  sleepLatency: number;                      // seconds
  // Activity
  activityScore: number;                     // 0–100
  activeCalories: number;
  totalCalories: number;
  steps: number;
  sedentaryTime: number;                     // seconds
  highActivityTime: number;                  // seconds
  // Biometrics
  restingHeartRate: number;                  // bpm
  /** Average nightly HRV (rMSSD in ms) */
  hrv: number;
  lowestHeartRate: number;
  averageBreathRate: number;
  // SpO2
  spo2Average: number;                       // %
  breathingDisturbanceIndex: number;
  // Stress
  stressHighMinutes: number;
  recoveryHighMinutes: number;
  daySummary: 'restored' | 'normal' | 'stressful' | null;
  // Meta
  date: string;
  lastSyncDate: string;
}

export interface OuraConnectionState {
  isConnected: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  /** Unix timestamp (ms) when access token expires */
  tokenExpiresAt: number | null;
  lastSyncDate: string | null;
  /** Oura membership required for data access */
  hasMembership: boolean;
}

// ── ARKit Ambient Reading Types ───────────────────────────────────────────────

/** A single 30-second ambient reading computed from ARKit blend shapes */
export interface AmbientReading {
  /** % of frames (0–1) where eye openness < 0.2 — fatigue depth */
  perclos: number;
  /** Blinks per minute in this window */
  blinkRate: number;
  /** Composite (0–1): squint intensity + reduced openness, higher = more strain */
  eyeStrain: number;
  /** Gaze direction consistency (0–1), higher = more focused */
  focusScore: number;
  /** Unix timestamp (ms) when computed */
  timestamp: number;
}

/** Raw blend shape snapshot for a single ARKit frame */
export interface BlendShapeFrame {
  eyeBlinkLeft: number;
  eyeBlinkRight: number;
  eyeWideLeft: number;
  eyeWideRight: number;
  eyeSquintLeft: number;
  eyeSquintRight: number;
  /** [x, y, z] gaze direction vector */
  lookAtPoint: [number, number, number];
  /** CACurrentMediaTime() in seconds */
  timestamp: number;
}

/** Accumulated ambient readings for the current app session (in-memory only) */
export interface AmbientReadingSession {
  readings: AmbientReading[];
  sessionStartedAt: number;
  isActive: boolean;
}

/** Personal blink baseline derived from last 7 active scans */
export interface AmbientReadingBaseline {
  /** Average blinks per minute */
  blinkRateBpm: number;
  samplesCount: number;
  lastUpdated: string;
}

// ── Unified Signal Architecture ───────────────────────────────────────────────

export type SignalSource = 'iris_scan' | 'ambient_arkit' | 'apple_health' | 'oura_ring' | 'check_in';

/** All wellness signals merged from every source — fed into coaching engine */
export interface WellnessSignals {
  scan: ScanResult | null;
  ambient: AmbientReading | null;
  health: HealthData | null;
  oura: OuraData | null;
  checkIn: DailyCheckIn | null;
  signalSources: SignalSource[];
  lastUpdated: string;
}

export interface Referral {
  id: string;
  referredEmail?: string;
  referredName?: string;
  status: 'sent' | 'installed' | 'onboarded' | 'subscribed';
  platform: 'instagram' | 'tiktok' | 'whatsapp' | 'link' | 'other';
  createdAt: string;
  convertedAt?: string;
}

export interface ReferralState {
  referralCode: string;
  referralLink: string;
  referralsSent: number;
  referralsConverted: number;
  freeMonthsEarned: number;
  freeMonthsUsed: number;
  referrals: Referral[];
  maxReferralsPerMonth: number;
  referralGoal: number;
  referralProgress: number;
}

export interface Habit {
  id: string;
  title: string;
  description: string;
  category: "hydration" | "nutrition" | "movement" | "recovery" | "skincare" | "mindfulness" | "pelvicfloor" | "selfcheck";
  completed: boolean;
  icon: string;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  category: "weight_fitness" | "cycle_training" | "skin_beauty" | "stress_mood" | "pregnancy_postpartum" | "menopause";
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  lessons: number;
  imageUrl?: string;
}

export interface EnrichedPhaseInfo {
  phaseName: string;
  phaseDay: number;
  cycleDay: number;
  totalCycleDays: number;
  phaseColor: string;
  phaseDescription: string;
  phase: CyclePhase;
  lifeStageOverride?: 'pregnancy' | 'postpartum' | 'perimenopause' | 'menopause';
  fertileWindow?: boolean;
  isOverdue?: boolean;
  effectiveCycleStart: string;
}

export interface DaySummary {
  date: string;
  phase: CyclePhase;
  stressScore: number;
  energyScore: number;
  recoveryScore: number;
  recommendedFocus: string;
  habits: Habit[];
}

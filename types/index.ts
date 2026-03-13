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
  lastSyncDate?: string;
}

export interface HealthConnectionState {
  isConnected: boolean;
  isAvailable: boolean;
  enabledDataTypes: HealthDataType[];
  lastSyncDate?: string;
}

export type HealthDataType = 'sleep' | 'menstrualCycle' | 'heartRate' | 'steps' | 'activeEnergy';

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

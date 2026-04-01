import { UserProfile, DailyCheckIn, ScanResult, Habit, DaySummary, PhaseEstimate, PersonalBaseline, CycleHistory, PhaseBaseline, CyclePhase, HealthData, HealthConnectionState, HealthDataType, EnrichedPhaseInfo } from "@/types";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { AppState, Platform } from "react-native";
import { predictPhase, updatePersonalBaseline, updatePhaseBaselines, shouldAskAdaptiveQuestion, findEffectiveCycleStart, computeEnrichedPhaseInfo, getPhaseForCycleDay } from "@/lib/phasePredictor";
import { scheduleMenstrualPhaseNotification, scheduleSqueezeDayReminder } from "@/lib/notifications";
import { Language, getTranslation } from "@/constants/translations";
import { getHealthKitAvailability, requestHealthKitPermissions, fetchAllHealthData, saveHealthConnection, loadHealthConnection, saveHealthData, loadHealthData } from "@/lib/healthKit";
import { trackEvent } from "@/lib/analytics";
import { UnitSystem } from "@/lib/unitConversion";
import logger from "@/lib/logger";
import { updateWidgetData } from "@/lib/widgetData";
import { trpcClient } from "@/lib/trpc";
import { generateCycleRecap, CycleRecap } from "@/lib/cycleRecap";

function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isValidDateString(dateStr: string | null | undefined): boolean {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

const STORAGE_KEY_USER = "iris_user_profile";
const STORAGE_KEY_CHECKINS = "iris_checkins";
const STORAGE_KEY_SCANS = "iris_scans";
const STORAGE_KEY_BASELINE = "iris_baseline";
const STORAGE_KEY_PHASE_BASELINES = "iris_phase_baselines";
const STORAGE_KEY_CYCLE_HISTORY = "iris_cycle_history";
const STORAGE_KEY_PREVIOUS_PHASE = "iris_previous_phase";
const STORAGE_KEY_DISMISSED_SUGGESTION = "iris_dismissed_life_stage_suggestion";
const STORAGE_KEY_LANGUAGE = "iris_language";
const STORAGE_KEY_UNITS = "iris_units";
const STORAGE_KEY_PHASE_OVERRIDES = "iris_phase_overrides";
const STORAGE_KEY_CYCLE_RECAP = "iris_cycle_recap";

// Memoized helper functions for lifeStageSuggestion calculation
const calculatePregnancySymptomScore = (recentCheckIns: DailyCheckIn[]): number => {
  const pregnancySymptoms = ['Nausea', 'Breast Tenderness', 'Fatigue', 'Mood Swings', 'Bloating'];
  let score = 0;
  for (const ci of recentCheckIns) {
    for (const s of pregnancySymptoms) {
      if (ci.symptoms.includes(s)) score++;
    }
  }
  return score;
};

const calculatePeriSymptomScore = (recentCheckIns: DailyCheckIn[]): number => {
  const periSymptoms = ['Hot Flashes', 'Night Sweats', 'Insomnia', 'Brain Fog', 'Mood Swings'];
  let score = 0;
  for (const ci of recentCheckIns) {
    for (const s of periSymptoms) {
      if (ci.symptoms.includes(s)) score++;
    }
  }
  return score;
};

const calculateScanAverages = (scans: ScanResult[]): {
  avgFatigue: number;
  avgStress: number;
  avgInflammation: number;
  avgRecovery: number;
  avgEnergy: number;
  highFatigueCount: number;
  highInflammationCount: number;
  lowEnergyCount: number;
} => {
  const avgFatigue = scans.reduce((sum, s) => sum + s.fatigueLevel, 0) / scans.length;
  const avgStress = scans.reduce((sum, s) => sum + s.stressScore, 0) / scans.length;
  const avgInflammation = scans.reduce((sum, s) => sum + s.inflammation, 0) / scans.length;
  const avgRecovery = scans.reduce((sum, s) => sum + s.recoveryScore, 0) / scans.length;
  const avgEnergy = scans.reduce((sum, s) => sum + s.energyScore, 0) / scans.length;
  const highFatigueCount = scans.filter(s => s.fatigueLevel > 7).length;
  const highInflammationCount = scans.filter(s => s.inflammation > 6).length;
  const lowEnergyCount = scans.filter(s => s.energyScore < 4).length;
  return { avgFatigue, avgStress, avgInflammation, avgRecovery, avgEnergy, highFatigueCount: highFatigueCount, highInflammationCount, lowEnergyCount };
};

const calculateEnergyVolatility = (scans: ScanResult[]): boolean => {
  if (scans.length < 3) return false;
  const energies = scans.map(s => s.energyScore);
  const mean = energies.reduce((a, b) => a + b, 0) / energies.length;
  const variance = energies.reduce((sum, e) => sum + Math.pow(e - mean, 2), 0) / energies.length;
  return Math.sqrt(variance) > 2.5;
};


function getInitialUserProfile(): UserProfile {
  return {
    name: "",
    birthday: "",
    weight: 0,
    height: 0,
    goals: [],
    mainFocus: [],
    cycleLength: 28,
    cycleLengthMin: 26,
    cycleLengthMax: 32,
    lastPeriodDate: new Date().toISOString(),
    lifeStage: "regular",
    cycleRegularity: "regular",
    birthControl: "none",
    isPremium: false,
    hasCompletedOnboarding: false,
    dataConsent: true,
  };
}

function validateUserProfile(data: any): UserProfile {
  const defaults = getInitialUserProfile();
  if (!data || typeof data !== 'object') {
    logger.error('[AppContext] Invalid profile data, using defaults');
    return defaults;
  }
  // Ensure required fields have correct types; fall back to defaults otherwise
  return {
    ...defaults,
    ...data,
    name: typeof data.name === 'string' ? data.name : defaults.name,
    cycleLength: typeof data.cycleLength === 'number' && data.cycleLength > 0 ? data.cycleLength : defaults.cycleLength,
    lastPeriodDate: (typeof data.lastPeriodDate === 'string' && !isNaN(new Date(data.lastPeriodDate).getTime()))
      ? data.lastPeriodDate
      : defaults.lastPeriodDate,
    goals: Array.isArray(data.goals) ? data.goals : defaults.goals,
    mainFocus: Array.isArray(data.mainFocus) ? data.mainFocus : defaults.mainFocus,
    hasCompletedOnboarding: typeof data.hasCompletedOnboarding === 'boolean' ? data.hasCompletedOnboarding : defaults.hasCompletedOnboarding,
    isPremium: typeof data.isPremium === 'boolean' ? data.isPremium : defaults.isPremium,
  };
}

export const [AppContext, useApp] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [userProfile, setUserProfile] = useState<UserProfile>(getInitialUserProfile());
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>([]);
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [todayHabits, setTodayHabits] = useState<Habit[]>([]);
  const [baseline, setBaseline] = useState<PersonalBaseline | null>(null);
  const [phaseBaselines, setPhaseBaselines] = useState<PhaseBaseline | null>(null);
  const [cycleHistory, setCycleHistory] = useState<CycleHistory[]>([]);
  const [previousPhase, setPreviousPhase] = useState<CyclePhase | null>(null);
  const [dismissedSuggestion, setDismissedSuggestion] = useState<string | null>(null);
  const [latestCycleRecap, setLatestCycleRecap] = useState<CycleRecap | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [units, setUnits] = useState<UnitSystem>('metric');
  const [healthConnection, setHealthConnection] = useState<HealthConnectionState>({
    isConnected: false,
    isAvailable: false,
    enabledDataTypes: [],
  });
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [phaseOverrides, setPhaseOverrides] = useState<Record<string, CyclePhase>>({});
  const phaseOverridesRef = useRef(phaseOverrides);
  phaseOverridesRef.current = phaseOverrides;

  const userQuery = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY_USER);
        if (!stored) return getInitialUserProfile();
        const parsed = JSON.parse(stored);
        return validateUserProfile(parsed);
      } catch (e) {
        logger.error('[AppContext] Failed to load user profile:', e);
        return getInitialUserProfile();
      }
    },
  });

  const checkInsQuery = useQuery({
    queryKey: ["checkIns"],
    queryFn: async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY_CHECKINS);
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        logger.error('[AppContext] Failed to load check-ins:', e);
        return [];
      }
    },
  });

  const scansQuery = useQuery({
    queryKey: ["scans"],
    queryFn: async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY_SCANS);
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        logger.error('[AppContext] Failed to load scans:', e);
        return [];
      }
    },
  });

  const baselineQuery = useQuery({
    queryKey: ["baseline"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY_BASELINE);
      return stored ? JSON.parse(stored) : null;
    },
  });

  const phaseBaselinesQuery = useQuery({
    queryKey: ["phaseBaselines"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY_PHASE_BASELINES);
      return stored ? JSON.parse(stored) : null;
    },
  });

  const dismissedSuggestionQuery = useQuery({
    queryKey: ["dismissedSuggestion"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY_DISMISSED_SUGGESTION);
      return stored || null;
    },
  });

  const healthConnectionQuery = useQuery({
    queryKey: ["healthConnection"],
    queryFn: async () => {
      return await loadHealthConnection();
    },
  });

  const healthDataQuery = useQuery({
    queryKey: ["healthData"],
    queryFn: async () => {
      return await loadHealthData();
    },
  });

  const languageQuery = useQuery({
    queryKey: ["language"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY_LANGUAGE);
      return (stored as Language) || 'en';
    },
  });

  const unitsQuery = useQuery({
    queryKey: ["units"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY_UNITS);
      return (stored as UnitSystem) || 'metric';
    },
  });

  const previousPhaseQuery = useQuery({
    queryKey: ["previousPhase"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY_PREVIOUS_PHASE);
      return stored ? JSON.parse(stored) : null;
    },
  });

  const cycleHistoryQuery = useQuery({
    queryKey: ["cycleHistory"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY_CYCLE_HISTORY);
      return stored ? JSON.parse(stored) : [];
    },
  });

  const phaseOverridesQuery = useQuery({
    queryKey: ["phaseOverrides"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY_PHASE_OVERRIDES);
      return stored ? JSON.parse(stored) : {};
    },
  });

  const cycleRecapQuery = useQuery({
    queryKey: ["cycleRecap"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY_CYCLE_RECAP);
      return stored ? JSON.parse(stored) as CycleRecap : null;
    },
  });

  useEffect(() => {
    if (cycleRecapQuery.data !== undefined) setLatestCycleRecap(cycleRecapQuery.data);
  }, [cycleRecapQuery.data]);

  useEffect(() => {
    if (userQuery.data) setUserProfile(userQuery.data);
  }, [userQuery.data]);

  useEffect(() => {
    if (checkInsQuery.data) setCheckIns(checkInsQuery.data);
  }, [checkInsQuery.data]);

  useEffect(() => {
    if (scansQuery.data) setScans(scansQuery.data);
  }, [scansQuery.data]);

  useEffect(() => {
    if (baselineQuery.data !== undefined) setBaseline(baselineQuery.data);
  }, [baselineQuery.data]);

  useEffect(() => {
    if (phaseBaselinesQuery.data !== undefined) setPhaseBaselines(phaseBaselinesQuery.data);
  }, [phaseBaselinesQuery.data]);

  useEffect(() => {
    if (cycleHistoryQuery.data) setCycleHistory(cycleHistoryQuery.data);
  }, [cycleHistoryQuery.data]);

  useEffect(() => {
    if (previousPhaseQuery.data !== undefined) setPreviousPhase(previousPhaseQuery.data);
  }, [previousPhaseQuery.data]);

  useEffect(() => {
    if (dismissedSuggestionQuery.data !== undefined) setDismissedSuggestion(dismissedSuggestionQuery.data);
  }, [dismissedSuggestionQuery.data]);

  useEffect(() => {
    if (languageQuery.data) setLanguage(languageQuery.data);
  }, [languageQuery.data]);

  useEffect(() => {
    if (unitsQuery.data) setUnits(unitsQuery.data);
  }, [unitsQuery.data]);

  useEffect(() => {
    if (healthConnectionQuery.data) setHealthConnection(healthConnectionQuery.data);
  }, [healthConnectionQuery.data]);

  useEffect(() => {
    if (healthDataQuery.data !== undefined) setHealthData(healthDataQuery.data);
  }, [healthDataQuery.data]);

  useEffect(() => {
    if (phaseOverridesQuery.data) setPhaseOverrides(phaseOverridesQuery.data);
  }, [phaseOverridesQuery.data]);

  const updateUserMutation = useMutation({
    mutationFn: async (profile: UserProfile) => {
      logger.log('[AppContext] Saving user profile to AsyncStorage, hasCompletedOnboarding:', profile.hasCompletedOnboarding);
      await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
      const verification = await AsyncStorage.getItem(STORAGE_KEY_USER);
      if (!verification) {
        logger.error('[AppContext] CRITICAL: Profile save verification failed!');
        throw new Error('Failed to persist user profile');
      }
      logger.log('[AppContext] Profile saved and verified successfully');
      return profile;
    },
    onSuccess: (data) => {
      setUserProfile(data);
      queryClient.setQueryData(["userProfile"], data);
      trackEvent('profile_updated', { lifeStage: data.lifeStage });
    },
  });

  const addCheckInMutation = useMutation({
    mutationFn: async (checkIn: DailyCheckIn) => {
      // Validate required fields before persisting
      const clampScore = (val: number | undefined, fallback: number) => {
        if (val === undefined || val === null || !Number.isFinite(val)) return fallback;
        return Math.max(1, Math.min(10, Math.round(val)));
      };
      const validated: DailyCheckIn = {
        ...checkIn,
        date: /^\d{4}-\d{2}-\d{2}$/.test(checkIn.date) ? checkIn.date : getLocalDateString(),
        mood: clampScore(checkIn.mood, 5),
        energy: clampScore(checkIn.energy, 5),
        sleep: clampScore(checkIn.sleep, 5),
        stressLevel: clampScore(checkIn.stressLevel, 5),
        symptoms: Array.isArray(checkIn.symptoms) ? checkIn.symptoms : [],
        timestamp: Date.now(),
      };
      const updated = [...checkIns, validated];
      await AsyncStorage.setItem(STORAGE_KEY_CHECKINS, JSON.stringify(updated));
      return updated;
    },
    onSuccess: (data) => {
      setCheckIns(data);
      queryClient.setQueryData(["checkIns"], data);
      const latest = data[data.length - 1];

      // Build event properties with limited metrics for all users
      const checkInProps = latest ? {
        energy: latest.energy,
        sleep: latest.sleep,
        stressLevel: latest.stressLevel ?? 5,
        mood: latest.mood,
        symptoms: (latest.symptoms || []).join(','),
        cyclePhase: previousPhase || 'unknown',
      } : undefined;

      // If user consented to data sharing, include all check-in fields
      const fullCheckInProperties = userProfile.dataConsent && latest ? {
        ...checkInProps,
        mood: latest.mood,
        energy: latest.energy,
        sleep: latest.sleep,
        ...(latest.sleepHours !== undefined && { sleepHours: latest.sleepHours }),
        stressLevel: latest.stressLevel ?? 5,
        symptoms: (latest.symptoms || []).join(','),
        bleedingLevel: latest.bleedingLevel ?? 'none',
        cervicalMucus: latest.cervicalMucus ?? 'dry',
        caffeine: latest.hadCaffeine ? 1 : 0,
        alcohol: latest.hadAlcohol ? 1 : 0,
        isIll: latest.isIll ? 1 : 0,
        sugar: latest.hadSugar ? 1 : 0,
        processedFood: latest.hadProcessedFood ? 1 : 0,
        ovulationPain: latest.ovulationPain ? 1 : 0,
        ...(latest.notes && { notes: latest.notes }),
      } : checkInProps;

      if (checkIns.length === 0) {
        trackEvent('first_checkin', fullCheckInProperties);
      } else {
        trackEvent('checkin_submitted', fullCheckInProperties);
      }

      // Update partner with shared data if user has a partner linked
      if (userProfile.linkedPartnerId && latest && userProfile.name) {
        try {
          trpcClient.partner.update.mutate({
            userId: userProfile.name, // Using name as userId placeholder
            phase: previousPhase || 'unknown',
            phaseDay: 1,
            totalCycleDays: userProfile.cycleLength,
            mood: latest.mood,
            energy: latest.energy,
          });
        } catch (err) {
          logger.log('[AppContext] Failed to update partner data:', err);
        }
      }
    },
  });

  const updateCheckInMutation = useMutation({
    mutationFn: async (checkIn: DailyCheckIn) => {
      const updated = checkIns.map((c) => c.date === checkIn.date ? checkIn : c);
      await AsyncStorage.setItem(STORAGE_KEY_CHECKINS, JSON.stringify(updated));
      return updated;
    },
    onSuccess: (data) => {
      setCheckIns(data);
      queryClient.setQueryData(["checkIns"], data);
    },
  });

  const addScanMutation = useMutation({
    mutationFn: async (scan: ScanResult) => {
      const today = getLocalDateString();
      const todayCheckIns = checkIns.filter((c) => c.date === today);
      
      const avgTodayCheckIn = todayCheckIns.length > 0
        ? {
            sleep: Math.round(todayCheckIns.reduce((sum, c) => sum + c.sleep, 0) / todayCheckIns.length),
            stressLevel: todayCheckIns[0].stressLevel !== undefined
              ? Math.round(todayCheckIns.reduce((sum, c) => sum + (c.stressLevel || 5), 0) / todayCheckIns.length)
              : undefined,
            hadCaffeine: todayCheckIns.some(c => c.hadCaffeine),
            isIll: todayCheckIns.some(c => c.isIll),
          }
        : null;
      
      const isConfounded = avgTodayCheckIn
        ? (avgTodayCheckIn.sleep || 7) < 5 || 
          (avgTodayCheckIn.stressLevel || 5) > 7 || 
          avgTodayCheckIn.hadCaffeine === true ||
          avgTodayCheckIn.isIll === true
        : false;

      const newBaseline = updatePersonalBaseline(baseline, scan, isConfounded);
      await AsyncStorage.setItem(STORAGE_KEY_BASELINE, JSON.stringify(newBaseline));
      setBaseline(newBaseline);

      const currentPhaseEstimate = previousPhase || "follicular";
      const newPhaseBaselines = updatePhaseBaselines(
        phaseBaselines,
        scan,
        currentPhaseEstimate,
        isConfounded
      );
      await AsyncStorage.setItem(STORAGE_KEY_PHASE_BASELINES, JSON.stringify(newPhaseBaselines));
      setPhaseBaselines(newPhaseBaselines);

      const updated = [scan, ...scans];
      await AsyncStorage.setItem(STORAGE_KEY_SCANS, JSON.stringify(updated));
      return updated;
    },
    onSuccess: (data) => {
      setScans(data);
      const latestScan = data[0];

      // Build event properties with limited metrics for all users
      const scanMetrics = latestScan ? {
        stressScore: latestScan.stressScore,
        energyScore: latestScan.energyScore,
        recoveryScore: latestScan.recoveryScore,
        hydrationLevel: latestScan.hydrationLevel,
        fatigueLevel: latestScan.fatigueLevel,
        inflammation: latestScan.inflammation,
        scleraYellowness: Math.round((1 - (latestScan.rawOpticalSignals.scleraBrightness / 255)) * 100) / 100,
        underEyeDarkness: latestScan.physiologicalStates.sleepDebtLikelihood,
        eyeOpenness: latestScan.physiologicalStates.calmVsAlert,
        tearFilmQuality: latestScan.rawOpticalSignals.tearFilmReflectivity,
      } : undefined;

      // If user consented to data sharing, include all scan fields
      const fullScanProperties = userProfile.dataConsent && latestScan ? {
        ...scanMetrics,
        // Raw optical signals
        pupilDiameter: latestScan.rawOpticalSignals.pupilDiameter,
        pupilContractionSpeed: latestScan.rawOpticalSignals.pupilContractionSpeed,
        pupilDilationSpeed: latestScan.rawOpticalSignals.pupilDilationSpeed,
        pupilLatency: latestScan.rawOpticalSignals.pupilLatency,
        pupilRecoveryTime: latestScan.rawOpticalSignals.pupilRecoveryTime,
        pupilSymmetry: latestScan.rawOpticalSignals.pupilSymmetry,
        blinkFrequency: latestScan.rawOpticalSignals.blinkFrequency,
        blinkDuration: latestScan.rawOpticalSignals.blinkDuration,
        microSaccadeFrequency: latestScan.rawOpticalSignals.microSaccadeFrequency,
        gazeStability: latestScan.rawOpticalSignals.gazeStability,
        scleraRedness: latestScan.rawOpticalSignals.scleraRedness,
        scleraBrightness: latestScan.rawOpticalSignals.scleraBrightness,
        tearFilmReflectivity: latestScan.rawOpticalSignals.tearFilmReflectivity,
        // Physiological states
        physiologicalStressLevel: latestScan.physiologicalStates.stressLevel,
        sympatheticActivation: latestScan.physiologicalStates.sympatheticActivation,
        calmVsAlert: latestScan.physiologicalStates.calmVsAlert,
        cognitiveLoad: latestScan.physiologicalStates.cognitiveLoad,
        energyLevel: latestScan.physiologicalStates.energyLevel,
        fatigueLoad: latestScan.physiologicalStates.fatigueLoad,
        recoveryReadiness: latestScan.physiologicalStates.recoveryReadiness,
        sleepDebtLikelihood: latestScan.physiologicalStates.sleepDebtLikelihood,
        dehydrationTendency: latestScan.physiologicalStates.dehydrationTendency,
        inflammatoryStress: latestScan.physiologicalStates.inflammatoryStress,
        // Skin beauty signals
        skinStress: latestScan.skinBeautySignals.skinStress,
        breakoutRiskWindow: latestScan.skinBeautySignals.breakoutRiskWindow ? 1 : 0,
        drynessTendency: latestScan.skinBeautySignals.drynessTendency,
        bestBeautyCareTiming: latestScan.skinBeautySignals.bestBeautyCareTiming ? 1 : 0,
        avoidIrritationFlag: latestScan.skinBeautySignals.avoidIrritationFlag ? 1 : 0,
        // Emotional mental state
        emotionalSensitivity: latestScan.emotionalMentalState.emotionalSensitivity,
        socialEnergy: latestScan.emotionalMentalState.socialEnergy,
        moodVolatilityRisk: latestScan.emotionalMentalState.moodVolatilityRisk,
        cognitiveSharpness: latestScan.emotionalMentalState.cognitiveSharpness,
        // Additional scan info
        hormonalState: latestScan.hormonalState,
      } : scanMetrics;

      if (scans.length === 0) {
        trackEvent('first_scan', fullScanProperties);
      } else {
        trackEvent('scan_completed', fullScanProperties);
      }

      // Update partner with shared data if user has a partner linked
      if (userProfile.linkedPartnerId && latestScan && userProfile.name) {
        try {
          trpcClient.partner.update.mutate({
            userId: userProfile.name, // Using name as userId placeholder
            phase: previousPhase || 'unknown',
            phaseDay: 1,
            totalCycleDays: userProfile.cycleLength,
            mood: null,
            energy: latestScan.energyScore,
          });
        } catch (err) {
          logger.log('[AppContext] Failed to update partner data:', err);
        }
      }
    },
  });

  const updateHabitMutation = useMutation({
    mutationFn: async ({ habitId, completed }: { habitId: string; completed: boolean }) => {
      const updated = todayHabits.map((h) =>
        h.id === habitId ? { ...h, completed } : h
      );
      return updated;
    },
    onSuccess: (data) => {
      setTodayHabits(data);
    },
  });

  useEffect(() => {
    trackEvent('app_opened');
  }, []);

  const updateLastPeriodDateMutation = useMutation({
    mutationFn: async (date: Date) => {
      const newHistory: CycleHistory = {
        startDate: date.toISOString(),
      };

      let updatedHistory: CycleHistory[];
      if (cycleHistory.length > 0) {
        const lastCycle = cycleHistory[cycleHistory.length - 1];
        if (!lastCycle.endDate) {
          const updatedLastCycle = {
            ...lastCycle,
            endDate: date.toISOString(),
            lengthDays: Math.floor(
              (date.getTime() - new Date(lastCycle.startDate).getTime()) / (1000 * 60 * 60 * 24)
            ),
          };
          updatedHistory = [...cycleHistory.slice(0, -1), updatedLastCycle, newHistory];
        } else {
          updatedHistory = [...cycleHistory, newHistory];
        }
      } else {
        updatedHistory = [newHistory];
      }

      const updated = {
        ...userProfile,
        lastPeriodDate: date.toISOString(),
      };
      
      await AsyncStorage.setItem(STORAGE_KEY_CYCLE_HISTORY, JSON.stringify(updatedHistory));
      await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
      await AsyncStorage.removeItem(STORAGE_KEY_PREVIOUS_PHASE);
      
      setCycleHistory(updatedHistory);
      setUserProfile(updated);
      setPreviousPhase(null);
      
      scheduleMenstrualPhaseNotification(date.toISOString(), updated.cycleLength).catch(err => {
        logger.log('Failed to schedule notification:', err);
      });

      // Generate cycle recap for the just-completed cycle
      try {
        const recap = generateCycleRecap(updatedHistory, scans, checkIns);
        if (recap) {
          await AsyncStorage.setItem(STORAGE_KEY_CYCLE_RECAP, JSON.stringify(recap));
          setLatestCycleRecap(recap);
          logger.info('[AppContext] Cycle recap generated for cycle #' + recap.cycleNumber);
        }
      } catch (recapErr) {
        logger.error('[AppContext] Failed to generate cycle recap:', recapErr);
      }

      return updated;
    },
    onSuccess: () => {
      trackEvent('period_logged');
    },
  });

  const effectiveCycleStart = useMemo(() => {
    try {
      if (userProfile.lifeStage === 'pregnancy' || userProfile.lifeStage === 'postpartum') {
        return userProfile.lastPeriodDate;
      }
      return findEffectiveCycleStart(userProfile.lastPeriodDate, checkIns);
    } catch (err) {
      logger.error('[AppContext] Error computing effectiveCycleStart:', err);
      return userProfile.lastPeriodDate;
    }
  }, [userProfile.lastPeriodDate, userProfile.lifeStage, checkIns]);

  const profileWithEffectiveStart = useMemo((): UserProfile => {
    return {
      ...userProfile,
      lastPeriodDate: effectiveCycleStart,
    };
  }, [userProfile, effectiveCycleStart]);

  const phaseEstimate = useMemo((): PhaseEstimate => {
    try {
      const today = getLocalDateString();
      const todayCheckIns = checkIns.filter((c) => c.date === today);
      const latestTodayCheckIn = todayCheckIns.length > 0 
        ? todayCheckIns.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))[0]
        : null;
      const todayScans = scans.filter((s) => s.date?.split('T')[0] === today);
      const latestTodayScan = todayScans.length > 0
        ? todayScans.sort((a, b) => b.timestamp - a.timestamp)[0]
        : scans[0] || null;

      return predictPhase(
        profileWithEffectiveStart,
        latestTodayCheckIn,
        latestTodayScan,
        cycleHistory,
        baseline,
        phaseBaselines,
        previousPhase,
        healthData
      );
    } catch (err) {
      logger.error('[AppContext] Error computing phaseEstimate:', err);
      return {
        mostLikely: 'follicular' as CyclePhase,
        probabilities: { menstrual: 0.25, follicular: 0.25, ovulation: 0.25, luteal: 0.25 },
        confidence: 'low' as const,
        reasoning: 'Error computing phase estimate',
      };
    }
  }, [profileWithEffectiveStart, checkIns, scans, cycleHistory, baseline, phaseBaselines, previousPhase, healthData]);

  const currentPhase = useMemo(() => {
    // Use calendar-math phase to stay consistent with the Calendar tab.
    // The Bayesian phaseEstimate.mostLikely is still available for
    // confidence scoring and reasoning text.
    const cycleLength = profileWithEffectiveStart.cycleLength || 28;
    const start = profileWithEffectiveStart.lastPeriodDate;
    if (!start) return phaseEstimate.mostLikely;
    const daysSince = Math.max(1, Math.floor(
      (Date.now() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)
    ) + 1);
    return getPhaseForCycleDay(daysSince, cycleLength);
  }, [profileWithEffectiveStart, phaseEstimate]);

  useEffect(() => {
    if (currentPhase !== previousPhase) {
      void AsyncStorage.setItem(STORAGE_KEY_PREVIOUS_PHASE, JSON.stringify(currentPhase));
      setPreviousPhase(currentPhase);
    }
  }, [currentPhase, previousPhase]);

  useEffect(() => {
    if (userProfile.hasCompletedOnboarding && userProfile.lastPeriodDate) {
      scheduleMenstrualPhaseNotification(
        userProfile.lastPeriodDate,
        userProfile.cycleLength
      ).catch((err) => {
        logger.log('Failed to schedule notification on app load:', err);
      });
    }
  }, [userProfile.hasCompletedOnboarding, userProfile.lastPeriodDate, userProfile.cycleLength]);

  // Schedule Squeeze Day (monthly breast self-exam) reminder on app load
  useEffect(() => {
    if (userProfile.hasCompletedOnboarding) {
      scheduleSqueezeDayReminder().catch((err) => {
        logger.log('Failed to schedule Squeeze Day reminder on app load:', err);
      });
    }
  }, [userProfile.hasCompletedOnboarding]);

  const userProfileRef = useRef(userProfile);
  userProfileRef.current = userProfile;

  const autoTransitionToPostpartum = useCallback(() => {
    const profile = userProfileRef.current;
    if (
      profile.lifeStage === 'pregnancy' &&
      profile.pregnancyDueDate &&
      profile.hasCompletedOnboarding
    ) {
      // Validate pregnancy due date before parsing
      if (!isValidDateString(profile.pregnancyDueDate)) {
        logger.error('[AppContext] Invalid pregnancyDueDate:', profile.pregnancyDueDate);
        return;
      }
      const dueDate = new Date(profile.pregnancyDueDate);
      const now = new Date();
      if (now.getTime() > dueDate.getTime()) {
        logger.log('[AppContext] Due date passed, auto-transitioning to postpartum');
        const updatedProfile = {
          ...profile,
          lifeStage: 'postpartum' as const,
          birthDate: profile.pregnancyDueDate,
        };
        updateUserMutation.mutateAsync(updatedProfile).catch((err) => {
          logger.log('[AppContext] Failed to auto-transition to postpartum:', err);
        });
      }
    }
  }, [updateUserMutation]);

  useEffect(() => {
    autoTransitionToPostpartum();
  }, [userProfile.lifeStage, userProfile.pregnancyDueDate, userProfile.hasCompletedOnboarding, autoTransitionToPostpartum]);

  const lifeStageSuggestion = useMemo((): { type: 'pregnancy' | 'perimenopause'; message: string } | null => {
    try {
    if (userProfile.lifeStage !== 'regular') return null;
    if (!userProfile.hasCompletedOnboarding) return null;

    const recentCheckIns = checkIns.slice(-14);
    const hasEnoughCheckIns = recentCheckIns.length >= 3;

    const now = Date.now();
    const fourteenDaysAgo = now - 14 * 24 * 60 * 60 * 1000;
    // Validate scan dates before parsing
    const recentScans = scans.filter(s => {
      if (!isValidDateString(s.date)) {
        logger.warn('[AppContext] Invalid scan date encountered:', s.date);
        return false;
      }
      return new Date(s.date).getTime() >= fourteenDaysAgo;
    });
    const hasEnoughScans = recentScans.length >= 2;

    if (!hasEnoughCheckIns && !hasEnoughScans) return null;

    let pregnancyScore = 0;
    let periScore = 0;

    if (hasEnoughCheckIns) {
      pregnancyScore = calculatePregnancySymptomScore(recentCheckIns);
      periScore = calculatePeriSymptomScore(recentCheckIns);
    }

    // Validate lastPeriodDate before parsing
    if (!isValidDateString(userProfile.lastPeriodDate)) {
      logger.error('[AppContext] Invalid lastPeriodDate in lifeStageSuggestion:', userProfile.lastPeriodDate);
      return null;
    }
    const lastPeriod = new Date(userProfile.lastPeriodDate);
    const daysSincePeriod = Math.floor((now - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
    const missedPeriod = daysSincePeriod > (userProfile.cycleLength || 28) + 7;
    if (missedPeriod) pregnancyScore += 3;

    if (hasEnoughScans) {
      const { avgFatigue, avgStress, avgInflammation, avgRecovery, avgEnergy, highFatigueCount, highInflammationCount, lowEnergyCount } = calculateScanAverages(recentScans);

      if (avgFatigue > 7) pregnancyScore += 2;
      else if (avgFatigue > 5.5) pregnancyScore += 1;

      if (highFatigueCount >= recentScans.length * 0.6) pregnancyScore += 1;

      if (avgInflammation > 5) pregnancyScore += 1;

      if (lowEnergyCount >= recentScans.length * 0.5) pregnancyScore += 1;

      if (avgStress > 7) periScore += 2;
      else if (avgStress > 5.5) periScore += 1;

      if (avgRecovery < 4) periScore += 2;
      else if (avgRecovery < 5.5) periScore += 1;

      if (highInflammationCount >= recentScans.length * 0.5) periScore += 1;

      if (avgFatigue > 6 && avgStress > 6) periScore += 1;

      const hasVolatileEnergy = calculateEnergyVolatility(recentScans);
      if (hasVolatileEnergy) periScore += 1;

      logger.log('[LifeStage] Scan analysis:', {
        avgFatigue: avgFatigue.toFixed(1),
        avgStress: avgStress.toFixed(1),
        avgInflammation: avgInflammation.toFixed(1),
        avgRecovery: avgRecovery.toFixed(1),
        avgEnergy: avgEnergy.toFixed(1),
        highFatigueScans: highFatigueCount,
        highInflammationScans: highInflammationCount,
        lowEnergyScans: lowEnergyCount,
        hasVolatileEnergy,
        scanCount: recentScans.length,
      });
    }

    let age = 0;
    if (userProfile.birthday) {
      // Validate birthday before parsing
      if (!isValidDateString(userProfile.birthday)) {
        logger.warn('[AppContext] Invalid birthday encountered:', userProfile.birthday);
      } else {
        const birth = new Date(userProfile.birthday);
        age = Math.floor((now - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
      }
    }
    if (age >= 40) periScore += 2;
    if (userProfile.cycleRegularity === 'irregular') periScore += 2;

    logger.log('[LifeStage] Final scores:', { pregnancyScore, periScore, age, hasEnoughCheckIns, hasEnoughScans });

    const pregnancyThreshold = 5;
    const periThreshold = 6;

    if (pregnancyScore >= pregnancyThreshold && dismissedSuggestion !== 'pregnancy') {
      return {
        type: 'pregnancy',
        message: 'Based on your recent check-ins and scan patterns, could it be that you are pregnant? You can update your life stage in your profile.',
      };
    }

    if (periScore >= periThreshold && dismissedSuggestion !== 'perimenopause') {
      return {
        type: 'perimenopause',
        message: 'Your recent symptoms and scan data may suggest perimenopause. Would you like to update your life stage for more tailored insights?',
      };
    }

    return null;
    } catch (err) {
      logger.error('[AppContext] Error computing lifeStageSuggestion:', err);
      return null;
    }
  }, [userProfile, checkIns, scans, dismissedSuggestion]);

  const dismissLifeStageSuggestionMutation = useMutation({
    mutationFn: async (type: string) => {
      await AsyncStorage.setItem(STORAGE_KEY_DISMISSED_SUGGESTION, type);
      return type;
    },
    onSuccess: (type) => {
      setDismissedSuggestion(type);
      trackEvent('life_stage_dismissed', { dismissedType: type });
    },
  });

  const connectHealthMutation = useMutation({
    mutationFn: async (dataTypes: HealthDataType[]): Promise<HealthConnectionState> => {
      const availability = getHealthKitAvailability();
      let granted = false;

      if (availability.isAvailable) {
        granted = await requestHealthKitPermissions();
      }

      const newState: HealthConnectionState = {
        isConnected: granted || !availability.isAvailable,
        isAvailable: availability.isAvailable,
        enabledDataTypes: dataTypes,
        lastSyncDate: new Date().toISOString(),
      };

      await saveHealthConnection(newState);

      if (granted && dataTypes.length > 0) {
        const data = await fetchAllHealthData(dataTypes);
        await saveHealthData(data);
        setHealthData(data);
      }

      return newState;
    },
    onSuccess: (state) => {
      setHealthConnection(state);
      if (state.isConnected) {
        trackEvent('health_connected', { dataTypes: state.enabledDataTypes.join(',') });
      }
    },
  });

  const disconnectHealthMutation = useMutation({
    mutationFn: async () => {
      const newState: HealthConnectionState = {
        isConnected: false,
        isAvailable: getHealthKitAvailability().isAvailable,
        enabledDataTypes: [],
      };
      await saveHealthConnection(newState);
      await saveHealthData({});
      setHealthData(null);
      return newState;
    },
    onSuccess: (state) => {
      setHealthConnection(state);
    },
  });

  const syncHealthDataMutation = useMutation({
    mutationFn: async () => {
      if (!healthConnection.isConnected || healthConnection.enabledDataTypes.length === 0) {
        return null;
      }
      const data = await fetchAllHealthData(healthConnection.enabledDataTypes);
      await saveHealthData(data);
      return data;
    },
    onSuccess: (data) => {
      if (data) {
        setHealthData(data);
        const updatedConnection = {
          ...healthConnection,
          lastSyncDate: new Date().toISOString(),
        };
        setHealthConnection(updatedConnection);
        void saveHealthConnection(updatedConnection);
      }
    },
  });

  const updateLanguageMutation = useMutation({
    mutationFn: async (lang: Language) => {
      logger.log('[AppContext] Saving language preference:', lang);
      await AsyncStorage.setItem(STORAGE_KEY_LANGUAGE, lang);
      return lang;
    },
    onSuccess: (lang) => {
      setLanguage(lang);
      queryClient.setQueryData(["language"], lang);
      trackEvent('language_changed', { language: lang });
    },
  });

  const updateUnitsMutation = useMutation({
    mutationFn: async (newUnits: UnitSystem) => {
      logger.log('[AppContext] Saving unit preference:', newUnits);
      await AsyncStorage.setItem(STORAGE_KEY_UNITS, newUnits);
      return newUnits;
    },
    onSuccess: (newUnits) => {
      setUnits(newUnits);
      queryClient.setQueryData(["units"], newUnits);
      trackEvent('units_changed', { units: newUnits });
    },
  });

  const setPhaseOverrideMutation = useMutation({
    mutationFn: async ({ date, phase }: { date: string; phase: CyclePhase | null }) => {
      // Use ref to always get latest state, preventing race conditions from rapid taps
      const updated = { ...phaseOverridesRef.current };
      if (phase === null) {
        delete updated[date];
      } else {
        updated[date] = phase;
      }
      await AsyncStorage.setItem(STORAGE_KEY_PHASE_OVERRIDES, JSON.stringify(updated));
      return updated;
    },
    onSuccess: (updated) => {
      setPhaseOverrides(updated);
      queryClient.invalidateQueries({ queryKey: ["phaseOverrides"] });
      // Invalidate userProfile to trigger re-computation of derived caches
      // that depend on phase information (e.g., enrichedPhaseInfo if override is for today)
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      trackEvent('phase_override', { date: Object.keys(updated).length.toString() });
    },
  });

  const deleteAllDataMutation = useMutation({
    mutationFn: async () => {
      const keys = [
        STORAGE_KEY_USER,
        STORAGE_KEY_CHECKINS,
        STORAGE_KEY_SCANS,
        STORAGE_KEY_BASELINE,
        STORAGE_KEY_PHASE_BASELINES,
        STORAGE_KEY_CYCLE_HISTORY,
        STORAGE_KEY_PREVIOUS_PHASE,
        STORAGE_KEY_DISMISSED_SUGGESTION,
        STORAGE_KEY_LANGUAGE,
        STORAGE_KEY_UNITS,
        STORAGE_KEY_PHASE_OVERRIDES,
      ];
      await AsyncStorage.multiRemove(keys);
      logger.log('[AppContext] All user data deleted');
      return true;
    },
    onSuccess: () => {
      setUserProfile(getInitialUserProfile());
      setCheckIns([]);
      setScans([]);
      setBaseline(null);
      setPhaseBaselines(null);
      setCycleHistory([]);
      setPreviousPhase(null);
      setDismissedSuggestion(null);
      setTodayHabits([]);
      setPhaseOverrides({});
      setLanguage('en');
      setUnits('metric');
      disconnectHealthMutation.mutate();
      queryClient.clear();
      trackEvent('account_deleted');
      logger.log('[AppContext] All data deleted and query cache cleared');
    },
  });

  const adaptiveQuestion = useMemo(() => {
    try {
      const today = getLocalDateString();
      const todayCheckIn = checkIns.find((c) => c.date === today) || null;
      // Validate lastPeriodDate before parsing
      if (!isValidDateString(userProfile.lastPeriodDate)) {
        logger.error('[AppContext] Invalid lastPeriodDate in adaptiveQuestion:', userProfile.lastPeriodDate);
        return { shouldAsk: false, questionType: null };
      }
      const lastPeriod = new Date(userProfile.lastPeriodDate);
      const cycleDay = Math.floor((new Date().getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));

      return shouldAskAdaptiveQuestion(phaseEstimate, todayCheckIn, cycleDay);
    } catch (err) {
      logger.error('[AppContext] Error computing adaptiveQuestion:', err);
      return { shouldAsk: false, questionType: null };
    }
  }, [phaseEstimate, checkIns, userProfile.lastPeriodDate]);

  const latestScan = useMemo(() => {
    const today = getLocalDateString();
    const todayScans = scans.filter((s) => s.date?.split('T')[0] === today);
    if (todayScans.length > 0) {
      return todayScans.sort((a, b) => b.timestamp - a.timestamp)[0];
    }
    return scans[0] || null;
  }, [scans]);

  const todayCheckIn = useMemo(() => {
    const today = getLocalDateString();
    const todayCheckIns = checkIns.filter((c) => c.date === today);
    if (todayCheckIns.length > 0) {
      return todayCheckIns.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))[0];
    }
    return null;
  }, [checkIns]);

  const t = useMemo(() => getTranslation(language), [language]);

  const enrichedPhaseInfo = useMemo((): EnrichedPhaseInfo => {
    try {
      return computeEnrichedPhaseInfo(profileWithEffectiveStart, checkIns, phaseEstimate, t);
    } catch (err) {
      logger.error('[AppContext] Error computing enrichedPhaseInfo:', err);
      return {
        phaseName: t?.phases?.[phaseEstimate.mostLikely] ?? 'Follicular',
        phaseDay: 1,
        cycleDay: 1,
        totalCycleDays: profileWithEffectiveStart.cycleLength || 28,
        phaseColor: '#8BC9A3',
        phaseDescription: 'Unable to compute phase details',
        phase: phaseEstimate.mostLikely,
        effectiveCycleStart: profileWithEffectiveStart.lastPeriodDate,
      };
    }
  }, [profileWithEffectiveStart, checkIns, phaseEstimate, t]);

  const todaySummary = useMemo((): DaySummary => {
    try {
      const today = getLocalDateString();
      const scan = latestScan;
      const checkIn = todayCheckIn;

      let recommendedFocus = "Balance & Harmony";
      
      const checkInEnergy = checkIn?.energy || 5;
      const combinedEnergy = checkIn && scan 
        ? (checkIn.energy + scan.energyScore) / 2 
        : checkInEnergy;
      
      const stressScore = scan?.stressScore || 5;
      const recoveryScore = scan?.recoveryScore || 7;
      const fatigueLevel = scan?.fatigueLevel || 5;
      const isIll = checkIn?.isIll;
      const poorSleep = checkIn && checkIn.sleep < 5;
      const hasCramps = checkIn?.symptoms?.includes("Cramps");
      const hasFatigue = checkIn?.symptoms?.includes("Fatigue");

      const veryHighStress = stressScore > 8.5;
      const highStress = stressScore > 7;
      const lowRecovery = recoveryScore < 5;
      const goodRecovery = recoveryScore >= 7;
      const highFatigue = fatigueLevel > 7;

      const shouldRest = isIll || veryHighStress || (highStress && lowRecovery) || (highFatigue && poorSleep);
      const shouldDoGentle = shouldRest || hasCramps || (hasFatigue && combinedEnergy < 4) || (poorSleep && lowRecovery);
      const canDoIntense = !shouldRest && !shouldDoGentle && combinedEnergy > 7 && (!highStress || goodRecovery) && !highFatigue;

      if (shouldRest) {
        recommendedFocus = isIll ? t.recommendedFocus?.restAndRecoveryHealing ?? "Rest & Recovery" : t.recommendedFocus?.urgentRestRecovery ?? "Urgent Rest";
      } else if (shouldDoGentle) {
        recommendedFocus = hasCramps ? t.recommendedFocus?.gentleMovementEaseDiscomfort ?? "Gentle Movement" : t.recommendedFocus?.lightActivitySelfCare ?? "Light Activity";
      } else if (canDoIntense) {
        if (currentPhase === "ovulation") {
          recommendedFocus = t.recommendedFocus?.peakEnergyStrengthHIIT ?? "Peak Energy";
        } else if (currentPhase === "follicular") {
          recommendedFocus = t.recommendedFocus?.risingEnergyChallengingWorkouts ?? "Rising Energy";
        } else if (currentPhase === "menstrual") {
          recommendedFocus = t.recommendedFocus?.energyUpStrengthTraining ?? "Strength Training";
        } else {
          recommendedFocus = t.recommendedFocus?.goodEnergyModerateIntense ?? "Moderate Activity";
        }
      } else if (highStress) {
        recommendedFocus = t.recommendedFocus?.stressManagementRecovery ?? "Stress Management";
      } else if (lowRecovery) {
        recommendedFocus = t.recommendedFocus?.gentleMovementHydration ?? "Gentle Movement";
      } else if (combinedEnergy > 5) {
        if (currentPhase === "menstrual") {
          recommendedFocus = t.recommendedFocus?.decentEnergyModerateMovement ?? "Moderate Movement";
        } else if (currentPhase === "luteal") {
          recommendedFocus = t.recommendedFocus?.steadyEnergyModerateSelfCare ?? "Self Care";
        } else {
          recommendedFocus = t.recommendedFocus?.moderateActivityBalancedNutrition ?? "Balanced Activity";
        }
      } else {
        recommendedFocus = t.recommendedFocus?.restAndNourishment ?? "Rest & Nourishment";
      }

      return {
        date: today,
        phase: currentPhase,
        stressScore: scan?.stressScore || 5,
        energyScore: scan?.energyScore || 6,
        recoveryScore: scan?.recoveryScore || 7,
        recommendedFocus,
        habits: todayHabits,
      };
    } catch (err) {
      logger.error('[AppContext] Error computing todaySummary:', err);
      return {
        date: getLocalDateString(),
        phase: currentPhase,
        stressScore: 5,
        energyScore: 6,
        recoveryScore: 7,
        recommendedFocus: 'Balance & Harmony',
        habits: todayHabits,
      };
    }
  }, [currentPhase, latestScan, todayHabits, todayCheckIn, t]);

  // Update iOS widget data whenever phase, cycle day, or recommended focus changes
  useEffect(() => {
    if (userProfile.hasCompletedOnboarding && enrichedPhaseInfo) {
      void updateWidgetData(
        currentPhase,
        enrichedPhaseInfo.cycleDay,
        enrichedPhaseInfo.totalCycleDays,
        todaySummary.recommendedFocus
      ).catch((err) => {
        logger.log('Failed to update widget data:', err);
      });
    }
  }, [currentPhase, enrichedPhaseInfo, todaySummary.recommendedFocus, userProfile.hasCompletedOnboarding]);

  const dismissCycleRecap = useCallback(async () => {
    setLatestCycleRecap(null);
    await AsyncStorage.removeItem(STORAGE_KEY_CYCLE_RECAP);
  }, []);

  // Auto-sync Apple Health whenever the app comes back to the foreground
  // Throttle: only sync if last sync was > 30 minutes ago
  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    if (!healthConnection.isConnected || healthConnection.enabledDataTypes.length === 0) return;

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        const lastSync = healthConnection.lastSyncDate ? new Date(healthConnection.lastSyncDate).getTime() : 0;
        const thirtyMinutesMs = 30 * 60 * 1000;
        if (Date.now() - lastSync > thirtyMinutesMs) {
          logger.log('[AppContext] App foregrounded — auto-syncing Apple Health');
          syncHealthDataMutation.mutate();
        }
      }
    });

    return () => subscription.remove();
  }, [healthConnection.isConnected, healthConnection.enabledDataTypes, healthConnection.lastSyncDate]);

  const isLoading = userQuery.isLoading || checkInsQuery.isLoading || scansQuery.isLoading || baselineQuery.isLoading || phaseBaselinesQuery.isLoading || cycleHistoryQuery.isLoading || previousPhaseQuery.isLoading || languageQuery.isLoading || unitsQuery.isLoading || phaseOverridesQuery.isLoading;
  const isHealthSyncing = syncHealthDataMutation.isPending;

  return useMemo(() => ({
    userProfile,
    updateUserProfile: updateUserMutation.mutateAsync,
    checkIns,
    addCheckIn: addCheckInMutation.mutate,
    updateCheckIn: updateCheckInMutation.mutate,
    scans,
    addScan: addScanMutation.mutate,
    currentPhase,
    latestScan,
    todayCheckIn,
    todaySummary,
    todayHabits,
    setTodayHabits,
    updateHabit: updateHabitMutation.mutate,
    updateLastPeriodDate: updateLastPeriodDateMutation.mutateAsync,
    phaseEstimate,
    enrichedPhaseInfo,
    effectiveCycleStart,
    baseline,
    cycleHistory,
    adaptiveQuestion,
    lifeStageSuggestion,
    dismissLifeStageSuggestion: dismissLifeStageSuggestionMutation.mutate,
    language,
    updateLanguage: updateLanguageMutation.mutateAsync,
    t,
    units,
    updateUnits: updateUnitsMutation.mutateAsync,
    healthConnection,
    healthData,
    connectHealth: connectHealthMutation.mutateAsync,
    disconnectHealth: disconnectHealthMutation.mutateAsync,
    syncHealthData: syncHealthDataMutation.mutateAsync,
    isHealthSyncing,
    deleteAllData: deleteAllDataMutation.mutateAsync,
    phaseOverrides,
    setPhaseOverride: setPhaseOverrideMutation.mutateAsync,
    latestCycleRecap,
    dismissCycleRecap,
    isLoading,
  }), [
    userProfile, checkIns, scans, currentPhase, latestScan, todayCheckIn,
    todaySummary, todayHabits, phaseEstimate, enrichedPhaseInfo,
    effectiveCycleStart, baseline, cycleHistory, adaptiveQuestion,
    lifeStageSuggestion, language, t, units, healthConnection, healthData,
    isHealthSyncing, isLoading, phaseOverrides, latestCycleRecap, dismissCycleRecap,
    updateUserMutation.mutateAsync, addCheckInMutation.mutate,
    updateCheckInMutation.mutate, addScanMutation.mutate,
    updateHabitMutation.mutate, updateLastPeriodDateMutation.mutateAsync,
    dismissLifeStageSuggestionMutation.mutate, updateLanguageMutation.mutateAsync,
    updateUnitsMutation.mutateAsync, connectHealthMutation.mutateAsync,
    disconnectHealthMutation.mutateAsync, syncHealthDataMutation.mutateAsync,
    deleteAllDataMutation.mutateAsync, setPhaseOverrideMutation.mutateAsync,
    setTodayHabits,
  ]);
});

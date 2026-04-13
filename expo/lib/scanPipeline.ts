/**
 * Shared scan pipeline logic — reused by scan.tsx (tab) and QuickScanModal.
 * Pure computation: no UI side effects, no navigation, no haptics.
 */

import { Platform } from 'react-native';
import {
  analyzeEyeImage,
  computeWellnessScores,
  cropEyeRegion,
  cropUnderEyeRegion,
  validateEyeImage,
} from '@/lib/eyeAnalysis';
import type { ImageValidationResult } from '@/lib/eyeAnalysis';
import { ScanResult, DailyCheckIn, CyclePhase } from '@/types';
import logger from '@/lib/logger';

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCyclePhaseFactor(phase: CyclePhase | null): number {
  switch (phase) {
    case 'menstrual':  return 7;
    case 'luteal':     return 5;
    case 'ovulation':  return 3;
    case 'follicular': return 2;
    default:           return 4;
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ScanScores {
  stressScore: number;
  energyScore: number;
  recoveryScore: number;
  hydrationLevel: number;
  fatigueLevel: number;
  inflammation: number;
}

export interface RawEyeAnalysisResult {
  brightness: number;
  redness: number;
  clarity: number;
  pupilDarkRatio: number;
  symmetry: number;
  scleraYellowness: number;
  underEyeDarkness: number;
  eyeOpenness: number;
  tearFilmQuality: number;
}

export interface ScanAnalysisResult {
  scores: ScanScores;
  rawEyeAnalysis: RawEyeAnalysisResult;
}

export interface ScanPipelineError {
  type: 'validation_failed' | 'analysis_failed' | 'capture_failed' | 'timeout';
  reason?: string;
}

// ── Core analysis pipeline ────────────────────────────────────────────────────

const ANALYSIS_TIMEOUT_MS = 20_000;

/**
 * Run the full eye analysis pipeline given a captured photo.
 * Returns ScanAnalysisResult on success, ScanPipelineError on failure.
 */
export async function runScanAnalysis(
  photoUri: string,
  photoBase64: string,
  imageWidth: number,
  imageHeight: number,
  currentPhase: CyclePhase | null,
  todayCheckIn: DailyCheckIn | null,
): Promise<ScanAnalysisResult | ScanPipelineError> {
  // Validate image first
  const validation: ImageValidationResult = await validateEyeImage(photoBase64, imageWidth, imageHeight);
  logger.log('[ScanPipeline] Image validation:', validation);

  if (!validation.isValid) {
    return { type: 'validation_failed', reason: validation.reason };
  }

  // Run analysis with timeout
  const analysisPromise = (async (): Promise<ScanAnalysisResult | ScanPipelineError> => {
    let analysisBase64 = photoBase64;
    let underEyeBase64: string | undefined;

    if (Platform.OS !== 'web') {
      const croppedBase64 = await cropEyeRegion(photoUri, imageWidth, imageHeight);
      if (croppedBase64) {
        analysisBase64 = croppedBase64;
        logger.log('[ScanPipeline] Using cropped eye region');
      }
      const underEyeCropped = await cropUnderEyeRegion(photoUri, imageWidth, imageHeight);
      if (underEyeCropped) {
        underEyeBase64 = underEyeCropped;
      }
    }

    const eyeAnalysis = await analyzeEyeImage(analysisBase64, imageWidth, imageHeight, underEyeBase64);
    logger.log('[ScanPipeline] Eye analysis complete');

    if (!eyeAnalysis) {
      return { type: 'analysis_failed' };
    }

    const cyclePhaseFactor = getCyclePhaseFactor(currentPhase);
    const checkInContext = todayCheckIn ? {
      energy: todayCheckIn.energy,
      sleep: todayCheckIn.sleep,
      stressLevel: todayCheckIn.stressLevel,
    } : null;

    const scores = computeWellnessScores(eyeAnalysis, checkInContext, cyclePhaseFactor);

    return { scores, rawEyeAnalysis: eyeAnalysis };
  })();

  const timeoutPromise = new Promise<ScanPipelineError>((resolve) =>
    setTimeout(() => resolve({ type: 'timeout' }), ANALYSIS_TIMEOUT_MS)
  );

  try {
    return await Promise.race([analysisPromise, timeoutPromise]);
  } catch (err) {
    logger.error('[ScanPipeline] Analysis error:', err);
    return { type: 'analysis_failed' };
  }
}

// ── Build scan result ─────────────────────────────────────────────────────────

/**
 * Build a ScanResult from scores + raw eye analysis.
 * Pure function — no side effects.
 */
export function buildScanResult(
  scores: ScanScores,
  rawEyeAnalysis: RawEyeAnalysisResult,
  currentPhase: CyclePhase | null,
  recommendations: string[],
): ScanResult {
  const clamp = (val: number, min = 0, max = 10) => {
    const v = Number.isFinite(val) ? val : 5;
    return Math.max(min, Math.min(max, v));
  };
  const clamp01 = (val: number) => {
    const v = Number.isFinite(val) ? val : 0.5;
    return Math.max(0, Math.min(1, v));
  };

  const eye = {
    brightness:        clamp01(rawEyeAnalysis.brightness),
    redness:           clamp01(rawEyeAnalysis.redness),
    clarity:           clamp01(rawEyeAnalysis.clarity),
    pupilDarkRatio:    clamp01(rawEyeAnalysis.pupilDarkRatio),
    symmetry:          clamp01(rawEyeAnalysis.symmetry),
    scleraYellowness:  clamp01(rawEyeAnalysis.scleraYellowness),
    underEyeDarkness:  clamp01(rawEyeAnalysis.underEyeDarkness),
    eyeOpenness:       clamp01(rawEyeAnalysis.eyeOpenness),
    tearFilmQuality:   clamp01(rawEyeAnalysis.tearFilmQuality),
  };

  const stressScore    = clamp(scores.stressScore, 1, 10);
  const energyScore    = clamp(scores.energyScore, 1, 10);
  const recoveryScore  = clamp(scores.recoveryScore, 1, 10);
  const hydrationLevel = clamp(scores.hydrationLevel, 1, 10);
  const fatigueLevel   = clamp(scores.fatigueLevel, 1, 10);
  const inflammation   = clamp(scores.inflammation, 1, 10);
  const phase          = currentPhase ?? 'follicular';

  const bodyBalance = clamp((recoveryScore + hydrationLevel + (10 - fatigueLevel)) / 3);
  const focusLevel  = clamp((energyScore + (10 - fatigueLevel) + recoveryScore) / 3);

  return {
    id: Date.now().toString(),
    date: getLocalDateString(),
    timestamp: Date.now(),
    stressScore,
    energyScore,
    recoveryScore,
    hydrationLevel,
    fatigueLevel,
    inflammation,
    hormonalState: phase,
    recommendations,
    rawOpticalSignals: {
      pupilDiameter:           Math.round(eye.pupilDarkRatio * 100) / 100,
      pupilContractionSpeed:   220 + (stressScore - 5) * 15,
      pupilDilationSpeed:      200 + (energyScore - 5) * 10,
      pupilLatency:            250 - (energyScore - 5) * 10 + fatigueLevel * 5,
      pupilRecoveryTime:       1200 + fatigueLevel * 30 - recoveryScore * 20,
      pupilSymmetry:           Math.min(1, Math.max(0.8, eye.symmetry)),
      blinkFrequency:          Math.round(bodyBalance * 100) / 100,
      blinkDuration:           110 + fatigueLevel * 3,
      microSaccadeFrequency:   1.5 + (stressScore - 5) * 0.15,
      gazeStability:           Math.min(1, Math.max(0.5, focusLevel)),
      scleraRedness:           Math.round(eye.redness * 6 * 100) / 100,
      scleraBrightness:        Math.round(eye.brightness * 255),
      tearFilmReflectivity:    Math.min(1, Math.max(0.3, eye.tearFilmQuality * 0.6 + eye.brightness * 0.4)),
    },
    physiologicalStates: {
      stressLevel:           stressScore > 7 ? 'high' : stressScore > 4 ? 'medium' : 'low',
      sympatheticActivation: Math.round((stressScore / 10) * 100) / 100,
      calmVsAlert:           Math.round(((10 - stressScore) / 10) * 100) / 100,
      cognitiveLoad:         Math.round(clamp(stressScore * 0.6 + fatigueLevel * 0.3) * 10) / 10,
      energyLevel:           Math.round(energyScore),
      fatigueLoad:           Math.round(fatigueLevel),
      recoveryReadiness:     Math.round((recoveryScore / 10) * 100) / 100,
      sleepDebtLikelihood:   fatigueLevel > 7 ? 0.8 : fatigueLevel > 5 ? 0.5 : 0.2,
      dehydrationTendency:   Math.round(((10 - hydrationLevel) / 10) * 100) / 100,
      inflammatoryStress:    Math.round((inflammation / 10) * 100) / 100,
    },
    skinBeautySignals: {
      skinStress:            Math.round(((inflammation + stressScore) / 2) * 10) / 10,
      breakoutRiskWindow:    inflammation > 6 && (phase === 'luteal' || phase === 'menstrual'),
      drynessTendency:       Math.round(((10 - hydrationLevel) / 10) * 100) / 100,
      bestBeautyCareTiming:  phase === 'follicular' || phase === 'ovulation',
      avoidIrritationFlag:   inflammation > 7,
    },
    emotionalMentalState: {
      // Blend phase context with actual scan data so scores reflect the user's state,
      // not just which cycle phase they're in.
      emotionalSensitivity: Math.round(clamp(
        stressScore * 0.45 + fatigueLevel * 0.25 +
        (phase === 'luteal' ? 2 : phase === 'menstrual' ? 1.5 : 0)
      ) * 10) / 10,
      socialEnergy:         Math.round(clamp(energyScore * 0.6 + recoveryScore * 0.3 + (10 - stressScore) * 0.1) * 10) / 10,
      moodVolatilityRisk:   Math.round(clamp(
        stressScore * 0.5 + fatigueLevel * 0.2 +
        (phase === 'luteal' ? 1.5 : 0)
      ) * 10) / 10,
      cognitiveSharpness:   Math.round(clamp(energyScore * 0.4 + (10 - fatigueLevel) * 0.3 + (10 - stressScore) * 0.3) * 10) / 10,
    },
  };
}

// ── Type guard ────────────────────────────────────────────────────────────────

export function isScanError(result: ScanAnalysisResult | ScanPipelineError): result is ScanPipelineError {
  return 'type' in result && typeof (result as ScanPipelineError).type === 'string';
}

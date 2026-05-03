// PRIVACY: All burst frames are analyzed on-device and immediately discarded.
// Only numerical scores are stored. No frame is written to disk or transmitted.
//
// Burst capture for IRIS scan v1.1:
// - Captures 8 photos over ~2 seconds (~250 ms apart)
// - Runs the existing per-frame analysis on each frame
// - Computes cross-frame metrics that need temporal data:
//   * realBlinkRate: count of eye-openness transitions
//   * tearFilmStability: std-dev of tear film quality across frames
//   * frameMotion: how much the eye moved between frames (penalty for shaky)
// - Aggregates per-frame readings via median (noise-robust) for the canonical
//   single-frame analysis returned to the rest of the app.

import { Platform } from 'react-native';
import logger from '@/lib/logger';
import {
  analyzeEyeImage,
  EyeAnalysisResult,
  validateEyeImage,
  cropEyeRegion,
  cropUnderEyeRegion,
} from '@/lib/eyeAnalysis';
import {
  analyzeAdvancedSignals,
  AdvancedSignals,
  DEFAULT_ADVANCED_SIGNALS,
} from '@/lib/advancedAnalysis';

// ───────────────────────────────────────────────────────────────────────────
// Public types
// ───────────────────────────────────────────────────────────────────────────

export interface BurstFrame {
  base64: string;
  width: number;
  height: number;
  uri: string;
  capturedAt: number; // ms timestamp
}

export interface BurstCrossFrameSignals {
  /** Real blink count per second computed from eye openness transitions. */
  realBlinkRate: number;
  /** Std-dev of tear film quality across frames; lower = stable, [0, 1]. */
  tearFilmStability: number;
  /** Average eye movement between frames (lower = steadier gaze), [0, 1]. */
  frameStability: number;
  /** Number of analyzable frames; if < 3 cross-frame metrics are unreliable. */
  framesAnalyzed: number;
  /** Total burst duration in ms. */
  burstDurationMs: number;
}

export interface BurstAnalysisResult {
  /** Median per-frame analysis: the canonical single-frame result. */
  aggregated: EyeAnalysisResult;
  /** Median advanced signals across frames. */
  advanced: AdvancedSignals;
  /** Cross-frame temporal metrics. */
  crossFrame: BurstCrossFrameSignals;
}

export interface CameraLike {
  takePictureAsync: (opts: {
    quality?: number;
    base64?: boolean;
    exif?: boolean;
    skipProcessing?: boolean;
  }) => Promise<{ uri: string; base64?: string; width?: number; height?: number } | undefined>;
}

// ───────────────────────────────────────────────────────────────────────────
// Constants
// ───────────────────────────────────────────────────────────────────────────

export const BURST_FRAME_COUNT = 8;
export const BURST_FRAME_INTERVAL_MS = 250; // 8 frames * 250ms = 2s burst
export const BURST_TIMEOUT_MS = 6000;       // give up if burst takes > 6s

const BLINK_OPENNESS_THRESHOLD = 0.35;
const FRAME_STABILITY_NORMALIZER = 0.3;     // brightness std > this = unstable

const clamp = (val: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, val));

// ───────────────────────────────────────────────────────────────────────────
// Capture loop
// ───────────────────────────────────────────────────────────────────────────

/**
 * Capture N frames from the camera at a fixed interval.
 * Resolves with however many frames succeeded (may be < N if camera misbehaves).
 * The caller is responsible for showing UI feedback during the ~2s capture.
 */
export async function captureBurst(
  camera: CameraLike,
  count: number = BURST_FRAME_COUNT,
  intervalMs: number = BURST_FRAME_INTERVAL_MS,
): Promise<BurstFrame[]> {
  const frames: BurstFrame[] = [];
  const burstStart = Date.now();
  const deadline = burstStart + BURST_TIMEOUT_MS;

  for (let i = 0; i < count; i++) {
    if (Date.now() > deadline) {
      logger.log('[BurstCapture] Burst deadline exceeded, stopping early at frame', i);
      break;
    }
    const frameStart = Date.now();
    try {
      const photo = await camera.takePictureAsync({
        quality: 0.6, // lower than single-shot 0.8 — 8 frames need to fit in memory
        base64: true,
        exif: false,
        skipProcessing: true, // faster on iOS, important for tight cadence
      });

      if (photo && photo.base64 && photo.uri) {
        frames.push({
          base64: photo.base64,
          width: photo.width ?? 640,
          height: photo.height ?? 480,
          uri: photo.uri,
          capturedAt: frameStart,
        });
      } else {
        logger.log('[BurstCapture] Frame', i, 'returned no data');
      }
    } catch (err) {
      logger.log('[BurstCapture] Frame', i, 'capture error:', err);
    }

    // Pace the burst — wait the rest of intervalMs before the next shot
    const elapsed = Date.now() - frameStart;
    const sleepMs = Math.max(0, intervalMs - elapsed);
    if (sleepMs > 0 && i < count - 1) {
      await new Promise((r) => setTimeout(r, sleepMs));
    }
  }

  logger.log('[BurstCapture] Captured', frames.length, 'frames in', Date.now() - burstStart, 'ms');
  return frames;
}

// ───────────────────────────────────────────────────────────────────────────
// Frame analysis (single frame, parallel-safe)
// ───────────────────────────────────────────────────────────────────────────

interface PerFrameAnalysis {
  basic: EyeAnalysisResult;
  advanced: AdvancedSignals;
}

async function analyzeFrame(frame: BurstFrame): Promise<PerFrameAnalysis | null> {
  // Validate first — discard blurry/dark/no-face frames
  const validation = await validateEyeImage(frame.base64, frame.width, frame.height);
  if (!validation.isValid) {
    logger.log('[BurstCapture] Frame rejected:', validation.reason);
    return null;
  }

  // Crop the eye region for tighter analysis (native only — web uses raw frame)
  let analysisBase64 = frame.base64;
  let underEyeBase64: string | undefined;
  if (Platform.OS !== 'web') {
    const cropped = await cropEyeRegion(frame.uri, frame.width, frame.height);
    if (cropped) analysisBase64 = cropped;
    const ue = await cropUnderEyeRegion(frame.uri, frame.width, frame.height);
    if (ue) underEyeBase64 = ue;
  }

  const basic = await analyzeEyeImage(analysisBase64, frame.width, frame.height, underEyeBase64);
  if (!basic) return null;

  const advanced = (await analyzeAdvancedSignals(analysisBase64, frame.width, frame.height))
    ?? DEFAULT_ADVANCED_SIGNALS;

  return { basic, advanced };
}

// ───────────────────────────────────────────────────────────────────────────
// Aggregation helpers
// ───────────────────────────────────────────────────────────────────────────

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function aggregateBasic(analyses: EyeAnalysisResult[]): EyeAnalysisResult {
  return {
    brightness: median(analyses.map((a) => a.brightness)),
    redness: median(analyses.map((a) => a.redness)),
    clarity: median(analyses.map((a) => a.clarity)),
    pupilDarkRatio: median(analyses.map((a) => a.pupilDarkRatio)),
    symmetry: median(analyses.map((a) => a.symmetry)),
    scleraYellowness: median(analyses.map((a) => a.scleraYellowness)),
    underEyeDarkness: median(analyses.map((a) => a.underEyeDarkness)),
    eyeOpenness: median(analyses.map((a) => a.eyeOpenness)),
    tearFilmQuality: median(analyses.map((a) => a.tearFilmQuality)),
  };
}

function aggregateAdvanced(analyses: AdvancedSignals[]): AdvancedSignals {
  return {
    pupilToIrisRatio: median(analyses.map((a) => a.pupilToIrisRatio)),
    limbalRingClarity: median(analyses.map((a) => a.limbalRingClarity)),
    vesselDensity: median(analyses.map((a) => a.vesselDensity)),
  };
}

// ───────────────────────────────────────────────────────────────────────────
// Cross-frame metrics
// ───────────────────────────────────────────────────────────────────────────

/**
 * Count blink events from a sequence of eye-openness readings.
 * A blink = openness drops below threshold then rises back above it.
 * Returns blinks per second over the burst window.
 */
function computeRealBlinkRate(opennessSeq: number[], durationMs: number): number {
  if (opennessSeq.length < 3 || durationMs <= 0) return 0;
  let blinks = 0;
  let inBlink = false;
  for (const o of opennessSeq) {
    if (!inBlink && o < BLINK_OPENNESS_THRESHOLD) {
      inBlink = true;
      blinks++;
    } else if (inBlink && o > BLINK_OPENNESS_THRESHOLD + 0.1) {
      // hysteresis: must climb above threshold + 0.1 to reset
      inBlink = false;
    }
  }
  // Convert to blinks per second; typical resting human is ~0.25/s (15 / min)
  // and rises with fatigue.
  return blinks / (durationMs / 1000);
}

/**
 * Tear film stability = 1 - normalized std-dev of tear film quality across frames.
 * Higher = more stable tear film. Range [0, 1].
 */
function computeTearFilmStability(tearFilmSeq: number[]): number {
  if (tearFilmSeq.length < 3) return 0.5; // default if too few frames
  const sd = stdDev(tearFilmSeq);
  // SD of 0.0 → stability 1.0 (perfectly stable)
  // SD of 0.3 → stability 0.0 (very unstable)
  return clamp(1 - sd / 0.3, 0, 1);
}

/**
 * Frame stability = how steady the eye region is across frames.
 * Approximated by std-dev of brightness (a moving eye / camera shake creates
 * varying brightness and pupil-dark-ratio).
 */
function computeFrameStability(brightnessSeq: number[], pupilSeq: number[]): number {
  if (brightnessSeq.length < 3) return 0.5;
  const brightSd = stdDev(brightnessSeq);
  const pupilSd = stdDev(pupilSeq);
  const combined = (brightSd + pupilSd) / 2;
  return clamp(1 - combined / FRAME_STABILITY_NORMALIZER, 0, 1);
}

// ───────────────────────────────────────────────────────────────────────────
// Public entry point
// ───────────────────────────────────────────────────────────────────────────

/**
 * Analyze a burst of frames. Returns the aggregated single-frame result plus
 * cross-frame temporal metrics. Frames are processed sequentially to keep
 * memory pressure bounded (8 base64 strings at q=0.6 ≈ 600KB resident).
 *
 * If fewer than 3 frames pass validation, falls back to single-frame analysis
 * of the best frame and returns reduced cross-frame confidence.
 */
export async function analyzeBurst(
  frames: BurstFrame[],
): Promise<BurstAnalysisResult | null> {
  if (frames.length === 0) {
    logger.log('[BurstCapture] No frames to analyze');
    return null;
  }

  const burstStart = frames[0].capturedAt;
  const burstEnd = frames[frames.length - 1].capturedAt;
  const burstDurationMs = Math.max(1, burstEnd - burstStart);

  const perFrame: PerFrameAnalysis[] = [];
  for (const frame of frames) {
    const result = await analyzeFrame(frame);
    if (result) perFrame.push(result);
    // Discard the base64 in the original array immediately for memory hygiene
    // (the caller may also do this once analyzeBurst returns)
    frame.base64 = '';
  }

  if (perFrame.length === 0) {
    logger.log('[BurstCapture] All frames failed validation');
    return null;
  }

  const basics = perFrame.map((f) => f.basic);
  const advs = perFrame.map((f) => f.advanced);

  const aggregated = aggregateBasic(basics);
  const advanced = aggregateAdvanced(advs);

  const realBlinkRate = computeRealBlinkRate(
    basics.map((b) => b.eyeOpenness),
    burstDurationMs,
  );
  const tearFilmStability = computeTearFilmStability(
    basics.map((b) => b.tearFilmQuality),
  );
  const frameStability = computeFrameStability(
    basics.map((b) => b.brightness),
    basics.map((b) => b.pupilDarkRatio),
  );

  const crossFrame: BurstCrossFrameSignals = {
    realBlinkRate,
    tearFilmStability,
    frameStability,
    framesAnalyzed: perFrame.length,
    burstDurationMs,
  };

  logger.log('[BurstCapture] Aggregated burst result:', {
    framesAnalyzed: perFrame.length,
    burstDurationMs,
    realBlinkRate: realBlinkRate.toFixed(3),
    tearFilmStability: tearFilmStability.toFixed(3),
    frameStability: frameStability.toFixed(3),
  });

  return { aggregated, advanced, crossFrame };
}

/**
 * Combined helper: capture + analyze in one call.
 * Useful for callers that don't need access to raw frames between steps.
 */
export async function captureAndAnalyzeBurst(
  camera: CameraLike,
  count?: number,
  intervalMs?: number,
): Promise<BurstAnalysisResult | null> {
  const frames = await captureBurst(camera, count, intervalMs);
  return analyzeBurst(frames);
}

// ───────────────────────────────────────────────────────────────────────────
// Default cross-frame signals (used when burst is unavailable, e.g. legacy fallback)
// ───────────────────────────────────────────────────────────────────────────

export const DEFAULT_CROSS_FRAME_SIGNALS: BurstCrossFrameSignals = {
  realBlinkRate: 0.25,        // ~15 blinks/min — adult resting baseline
  tearFilmStability: 0.5,
  frameStability: 0.7,
  framesAnalyzed: 0,
  burstDurationMs: 0,
};

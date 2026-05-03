// PRIVACY: Photo is analyzed on-device and immediately discarded. Only numerical scores are stored.

import { Platform } from 'react-native';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import logger from "@/lib/logger";

export interface EyeAnalysisResult {
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

export interface WellnessScoresFromEyes {
  energyScore: number;
  fatigueLevel: number;
  hydrationLevel: number;
  inflammation: number;
  recoveryScore: number;
  stressScore: number;
}

interface CheckInContext {
  energy?: number;
  sleep?: number;
  stressLevel?: number;
}

const clamp = (val: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, val));

// ── Image validation thresholds ──────────────────────────────────────
const VALIDATION_MIN_BRIGHTNESS = 15;       // Mean below this → "too dark"
const VALIDATION_MAX_BRIGHTNESS = 235;      // Mean above this → "too bright"
const VALIDATION_MIN_STD_DEV = 8;           // StdDev below this → "too uniform" (base64)
const VALIDATION_MIN_STD_DEV_CANVAS = 10;   // StdDev below this → "too uniform" (canvas)
const VALIDATION_MIN_ENTROPY = 2.5;         // Entropy below this → "too uniform"
const VALIDATION_MAX_DARK_RATIO = 0.85;     // Dark pixel ratio above this → "too dark"
const VALIDATION_MAX_BRIGHT_RATIO = 0.85;   // Bright pixel ratio above this → "too bright"
const VALIDATION_MIN_CONTRAST_RATIO = 0.02; // Both dark & bright below this → "no contrast"
const VALIDATION_MIN_SKIN_RATIO_BASE64 = 0.25;  // Skin-range bytes below this → "no face"
const VALIDATION_MIN_SKIN_RATIO_CANVAS = 0.05;  // Skin-tone pixels below this → "no face"

// ── Byte-level thresholds (base64 analysis) ──────────────────────────
const BYTE_DARK_THRESHOLD = 40;             // Pixel value below this = dark
const BYTE_BRIGHT_THRESHOLD = 180;          // Pixel value above this = bright
const BYTE_VERY_BRIGHT_THRESHOLD = 240;     // Pixel value above this = very bright
const BYTE_SKIN_RANGE_LOW = 80;             // Skin tone lower bound
const BYTE_SKIN_RANGE_HIGH = 180;           // Skin tone upper bound

// ── Canvas luminance thresholds ──────────────────────────────────────
const LUMINANCE_DARK_THRESHOLD = 50;        // Luminance below this = dark pixel
const LUMINANCE_BRIGHT_THRESHOLD = 153;     // Luminance above this = bright pixel
const LUMINANCE_VERY_BRIGHT_THRESHOLD = 240; // Luminance above this = very bright

// ── Normalisation divisors ───────────────────────────────────────────
const BRIGHTNESS_NORMALISER = 180;          // Divide mean by this to get 0-1 brightness
const CLARITY_DIVISOR_BASE64 = 70;          // Divide stdDev by this for base64 clarity
const CLARITY_DIVISOR_CANVAS = 80;          // Divide stdDev by this for canvas clarity
const MAX_ENTROPY_BITS = 8;                 // Max possible entropy for 8-bit values
const REDNESS_DIVISOR = 100;                // Normalise redness difference

// ── Crop region fractions ────────────────────────────────────────────
const EYE_REGION_TOP = 0.25;                // Eye region starts at 25% from top
const EYE_REGION_HEIGHT = 0.3;              // Eye region is 30% of image height
const EYE_REGION_LEFT = 0.1;               // Eye region starts at 10% from left
const EYE_REGION_WIDTH = 0.8;              // Eye region is 80% of image width
const UNDER_EYE_TOP = 0.55;                // Under-eye region starts at 55% from top
const UNDER_EYE_HEIGHT = 0.15;             // Under-eye region is 15% of image height

// ── Face detection thresholds ────────────────────────────────────────
const FACE_MIN_SKIN_RATIO = 0.15;          // Canvas: minimum skin pixel ratio for face
const FACE_MIN_LUM_STD_DEV = 20;           // Canvas: minimum luminance std dev
const FACE_MIN_DARK_RATIO = 0.02;          // Canvas: minimum dark ratio (eyes exist)
const FACE_MAX_DARK_RATIO = 0.7;           // Canvas: maximum dark ratio (not a dark scene)
const FACE_MIN_EYE_DARK_RATIO = 0.02;      // Canvas: minimum dark ratio per eye region

// ── Native face detection thresholds ─────────────────────────────────
const NATIVE_MIN_SKIN_RANGE_RATIO = 0.35;  // At least 35% bytes in skin-tone range
const NATIVE_MIN_DARK_RATIO = 0.03;        // Some dark pixels (eyes, hair)
const NATIVE_MAX_DARK_RATIO = 0.4;         // Not a dark scene
const NATIVE_MAX_BRIGHT_RATIO = 0.4;       // Not an overexposed scene
const NATIVE_MIN_MEAN = 70;                // Mean brightness lower bound
const NATIVE_MAX_MEAN = 180;               // Mean brightness upper bound
const NATIVE_MIN_STD_DEV = 25;             // Sufficient contrast
const NATIVE_MIN_ENTROPY = 5.0;            // Sufficient complexity
const NATIVE_EYE_MIN_DARK_RATIO = 0.03;    // Dark spots where eyes should be
const NATIVE_EYE_MAX_DARK_RATIO = 0.5;     // Not entirely dark

// ── Resize targets ───────────────────────────────────────────────────
const CROP_RESIZE_WIDTH = 128;              // Resize cropped regions to this width
const FACE_DETECT_RESIZE_WIDTH = 100;       // Resize for face detection

function base64ToBytes(base64: string): Uint8Array {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const lookup = new Uint8Array(256);
  for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }

  const cleanBase64 = base64.replace(/[^A-Za-z0-9+/]/g, '');
  const len = cleanBase64.length;
  const byteLen = Math.floor((len * 3) / 4);
  const bytes = new Uint8Array(byteLen);

  let p = 0;
  for (let i = 0; i < len; i += 4) {
    const a = lookup[cleanBase64.charCodeAt(i)];
    const b = lookup[cleanBase64.charCodeAt(i + 1)];
    const c = lookup[cleanBase64.charCodeAt(i + 2)];
    const d = lookup[cleanBase64.charCodeAt(i + 3)];

    bytes[p++] = (a << 2) | (b >> 4);
    if (p < byteLen) bytes[p++] = ((b & 0x0f) << 4) | (c >> 2);
    if (p < byteLen) bytes[p++] = ((c & 0x03) << 6) | d;
  }

  return bytes;
}

function analyzeFromBase64Bytes(base64: string, underEyeBase64?: string): EyeAnalysisResult | null {
  logger.log('[EyeAnalysis] Analyzing from base64 bytes, length:', base64.length);
  const bytes = base64ToBytes(base64);

  const startOffset = Math.floor(bytes.length * 0.1);
  const endOffset = Math.floor(bytes.length * 0.9);
  const sampleSize = endOffset - startOffset;

  if (sampleSize < 100) {
    logger.log('[EyeAnalysis] Sample too small, returning null');
    return null;
  }

  let sum = 0;
  let sumSquared = 0;
  let lowValueCount = 0;
  let highValueCount = 0;
  let veryHighCount = 0;

  const histogram = new Uint32Array(256);

  for (let i = startOffset; i < endOffset; i++) {
    const b = bytes[i];
    sum += b;
    sumSquared += b * b;
    histogram[b]++;
    if (b < BYTE_DARK_THRESHOLD) lowValueCount++;
    if (b > BYTE_BRIGHT_THRESHOLD) highValueCount++;
    if (b > BYTE_VERY_BRIGHT_THRESHOLD) veryHighCount++;
  }

  const mean = sum / sampleSize;
  const variance = (sumSquared / sampleSize) - (mean * mean);
  const stdDev = Math.sqrt(Math.max(0, variance));

  const brightness = clamp(mean / BRIGHTNESS_NORMALISER, 0, 1);
  const pupilDarkRatio = clamp(lowValueCount / sampleSize * 3, 0, 1);
  const clarity = clamp(stdDev / CLARITY_DIVISOR_BASE64, 0, 1);

  let entropy = 0;
  for (let i = 0; i < 256; i++) {
    if (histogram[i] > 0) {
      const p = histogram[i] / sampleSize;
      entropy -= p * Math.log2(p);
    }
  }
  const normalizedEntropy = clamp(entropy / MAX_ENTROPY_BITS, 0, 1);

  const redness = clamp((1 - brightness) * 0.5 + (1 - normalizedEntropy) * 0.3 + pupilDarkRatio * 0.2, 0, 1);
  const symmetry = clamp(0.7 + normalizedEntropy * 0.25 + (1 - Math.abs(0.5 - brightness)) * 0.1, 0, 1);

  const warmBias = clamp((mean - 100) / 100, 0, 1);
  const scleraYellowness = clamp(warmBias * 0.6 + (1 - normalizedEntropy) * 0.3 + (1 - brightness) * 0.1, 0, 1);
  logger.log('[EyeAnalysis] Sclera yellowness (base64):', scleraYellowness.toFixed(3));

  const eyeOpenness = clamp(highValueCount / sampleSize * 4, 0, 1);
  logger.log('[EyeAnalysis] Eye openness (base64):', eyeOpenness.toFixed(3));

  let peakConcentration = 0;
  if (veryHighCount > 0) {
    const totalHighRange = histogram.slice(220).reduce((a, b) => a + b, 0);
    peakConcentration = totalHighRange > 0 ? veryHighCount / Math.max(1, totalHighRange) : 0;
  }
  const kurtosisProxy = sampleSize > 0 ? (veryHighCount / sampleSize) * 50 : 0;
  const tearFilmQuality = clamp(peakConcentration * 0.5 + clamp(kurtosisProxy, 0, 1) * 0.3 + brightness * 0.2, 0, 1);
  logger.log('[EyeAnalysis] Tear film quality (base64):', tearFilmQuality.toFixed(3));

  let underEyeDarkness = 0.3;
  if (underEyeBase64) {
    const ueBytes = base64ToBytes(underEyeBase64);
    const ueStart = Math.floor(ueBytes.length * 0.1);
    const ueEnd = Math.floor(ueBytes.length * 0.9);
    const ueSize = ueEnd - ueStart;
    if (ueSize > 50) {
      let ueSum = 0;
      for (let i = ueStart; i < ueEnd; i++) {
        ueSum += ueBytes[i];
      }
      const ueMean = ueSum / ueSize;
      const ueBrightness = clamp(ueMean / BRIGHTNESS_NORMALISER, 0, 1);
      underEyeDarkness = clamp(1 - ueBrightness, 0, 1);
    }
  } else {
    underEyeDarkness = clamp((1 - brightness) * 0.6 + pupilDarkRatio * 0.2 + (1 - normalizedEntropy) * 0.2, 0, 1);
  }
  logger.log('[EyeAnalysis] Under-eye darkness (base64):', underEyeDarkness.toFixed(3));

  logger.log('[EyeAnalysis] Base64 analysis result:', {
    brightness: brightness.toFixed(3),
    redness: redness.toFixed(3),
    clarity: clarity.toFixed(3),
    pupilDarkRatio: pupilDarkRatio.toFixed(3),
    symmetry: symmetry.toFixed(3),
    scleraYellowness: scleraYellowness.toFixed(3),
    underEyeDarkness: underEyeDarkness.toFixed(3),
    eyeOpenness: eyeOpenness.toFixed(3),
    tearFilmQuality: tearFilmQuality.toFixed(3),
    mean: mean.toFixed(1),
    stdDev: stdDev.toFixed(1),
    entropy: entropy.toFixed(2),
  });

  return { brightness, redness, clarity, pupilDarkRatio, symmetry, scleraYellowness, underEyeDarkness, eyeOpenness, tearFilmQuality };
}

function analyzeWithCanvas(base64: string, width: number, height: number): Promise<EyeAnalysisResult | null> {
  return new Promise((resolve) => {
    try {
      const img = new (globalThis.Image as { new(): HTMLImageElement })();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const eyeRegionY = Math.floor(height * EYE_REGION_TOP);
          const eyeRegionHeight = Math.floor(height * EYE_REGION_HEIGHT);
          const eyeRegionX = Math.floor(width * EYE_REGION_LEFT);
          const eyeRegionWidth = Math.floor(width * EYE_REGION_WIDTH);

          canvas.width = eyeRegionWidth;
          canvas.height = eyeRegionHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            logger.log('[EyeAnalysis] Canvas context not available, returning null');
            resolve(null);
            return;
          }

          ctx.drawImage(img, eyeRegionX, eyeRegionY, eyeRegionWidth, eyeRegionHeight, 0, 0, eyeRegionWidth, eyeRegionHeight);
          const imageData = ctx.getImageData(0, 0, eyeRegionWidth, eyeRegionHeight);
          const pixels = imageData.data;
          const pixelCount = pixels.length / 4;

          let totalR = 0, totalG = 0, totalB = 0;
          let darkPixels = 0;
          let totalLuminance = 0;
          let brightPixels = 0;
          let veryBrightPixels = 0;

          for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            totalR += r;
            totalG += g;
            totalB += b;
            const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
            totalLuminance += luminance;
            if (luminance < LUMINANCE_DARK_THRESHOLD) darkPixels++;
            if (luminance > LUMINANCE_BRIGHT_THRESHOLD) brightPixels++;
            if (luminance > LUMINANCE_VERY_BRIGHT_THRESHOLD) veryBrightPixels++;
          }

          const avgR = totalR / pixelCount;
          const avgG = totalG / pixelCount;
          const avgB = totalB / pixelCount;
          const avgLuminance = totalLuminance / pixelCount;

          const brightness = clamp(avgLuminance / 255, 0, 1);
          const redness = clamp(Math.max(0, (avgR - (avgG + avgB) / 2)) / REDNESS_DIVISOR, 0, 1);
          const pupilDarkRatio = clamp(darkPixels / pixelCount, 0, 1);

          let lumVariance = 0;
          for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            lumVariance += (lum - avgLuminance) ** 2;
          }
          lumVariance /= pixelCount;
          const clarity = clamp(Math.sqrt(lumVariance) / CLARITY_DIVISOR_CANVAS, 0, 1);

          const halfWidth = Math.floor(eyeRegionWidth / 2);
          let leftSum = 0, rightSum = 0;
          for (let y = 0; y < eyeRegionHeight; y++) {
            for (let x = 0; x < halfWidth; x++) {
              const leftIdx = (y * eyeRegionWidth + x) * 4;
              const rightIdx = (y * eyeRegionWidth + (eyeRegionWidth - 1 - x)) * 4;
              leftSum += pixels[leftIdx] + pixels[leftIdx + 1] + pixels[leftIdx + 2];
              rightSum += pixels[rightIdx] + pixels[rightIdx + 1] + pixels[rightIdx + 2];
            }
          }
          const symmetry = clamp(1 - Math.abs(leftSum - rightSum) / Math.max(leftSum, rightSum, 1), 0, 1);

          const yellowness = ((avgR + avgG) / 2 - avgB) / 255;
          const scleraYellowness = clamp(yellowness * 2, 0, 1);
          logger.log('[EyeAnalysis] Sclera yellowness (canvas):', scleraYellowness.toFixed(3));

          const eyeOpenness = clamp(brightPixels / pixelCount * 2, 0, 1);
          logger.log('[EyeAnalysis] Eye openness (canvas):', eyeOpenness.toFixed(3));

          let brightClusterSpread = 0;
          if (veryBrightPixels > 0) {
            let sumX = 0, sumY = 0;
            let sumDist = 0;
            let count = 0;
            for (let y = 0; y < eyeRegionHeight; y++) {
              for (let x = 0; x < eyeRegionWidth; x++) {
                const idx = (y * eyeRegionWidth + x) * 4;
                const lum = 0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2];
                if (lum > 240) {
                  sumX += x;
                  sumY += y;
                  count++;
                }
              }
            }
            if (count > 0) {
              const cx = sumX / count;
              const cy = sumY / count;
              for (let y = 0; y < eyeRegionHeight; y++) {
                for (let x = 0; x < eyeRegionWidth; x++) {
                  const idx = (y * eyeRegionWidth + x) * 4;
                  const lum = 0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2];
                  if (lum > 240) {
                    sumDist += Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
                  }
                }
              }
              const avgDist = sumDist / count;
              const maxDim = Math.max(eyeRegionWidth, eyeRegionHeight);
              brightClusterSpread = clamp(1 - (avgDist / (maxDim * 0.3)), 0, 1);
            }
          }
          const tearFilmQuality = clamp(
            brightClusterSpread * 0.6 + (veryBrightPixels / Math.max(pixelCount, 1)) * 30 * 0.2 + brightness * 0.2,
            0, 1
          );
          logger.log('[EyeAnalysis] Tear film quality (canvas):', tearFilmQuality.toFixed(3));

          const underEyeY = Math.floor(height * UNDER_EYE_TOP);
          const underEyeHeight = Math.floor(height * UNDER_EYE_HEIGHT);
          const ueCanvas = document.createElement('canvas');
          ueCanvas.width = eyeRegionWidth;
          ueCanvas.height = underEyeHeight;
          const ueCtx = ueCanvas.getContext('2d');
          let underEyeDarkness = 0.3;
          if (ueCtx) {
            ueCtx.drawImage(img, eyeRegionX, underEyeY, eyeRegionWidth, underEyeHeight, 0, 0, eyeRegionWidth, underEyeHeight);
            const ueData = ueCtx.getImageData(0, 0, eyeRegionWidth, underEyeHeight);
            const uePixels = ueData.data;
            const uePixelCount = uePixels.length / 4;
            let ueLuminance = 0;
            for (let i = 0; i < uePixels.length; i += 4) {
              ueLuminance += 0.299 * uePixels[i] + 0.587 * uePixels[i + 1] + 0.114 * uePixels[i + 2];
            }
            const ueAvgLum = ueLuminance / uePixelCount;
            const relativeDarkness = (avgLuminance - ueAvgLum) / Math.max(avgLuminance, 1);
            underEyeDarkness = clamp(relativeDarkness * 2 + (1 - ueAvgLum / 255) * 0.3, 0, 1);
          }
          logger.log('[EyeAnalysis] Under-eye darkness (canvas):', underEyeDarkness.toFixed(3));

          logger.log('[EyeAnalysis] Canvas analysis result:', {
            brightness: brightness.toFixed(3),
            redness: redness.toFixed(3),
            clarity: clarity.toFixed(3),
            pupilDarkRatio: pupilDarkRatio.toFixed(3),
            symmetry: symmetry.toFixed(3),
            scleraYellowness: scleraYellowness.toFixed(3),
            underEyeDarkness: underEyeDarkness.toFixed(3),
            eyeOpenness: eyeOpenness.toFixed(3),
            tearFilmQuality: tearFilmQuality.toFixed(3),
            avgR: avgR.toFixed(1),
            avgG: avgG.toFixed(1),
            avgB: avgB.toFixed(1),
          });

          resolve({ brightness, redness, clarity, pupilDarkRatio, symmetry, scleraYellowness, underEyeDarkness, eyeOpenness, tearFilmQuality });
        } catch (err) {
          logger.error('[EyeAnalysis] Canvas processing error:', err);
          resolve(null);
        }
      };
      img.onerror = () => {
        logger.log('[EyeAnalysis] Image load failed, returning null');
        resolve(null);
      };
      img.src = `data:image/jpg;base64,${base64}`;
    } catch (err) {
      logger.error('[EyeAnalysis] Canvas setup error:', err);
      resolve(null);
    }
  });
}

export interface ImageValidationResult {
  isValid: boolean;
  reason: string;
}

function validateFromBase64Bytes(base64: string): ImageValidationResult {
  logger.log('[EyeAnalysis] Validating image from base64...');
  const bytes = base64ToBytes(base64);

  const startOffset = Math.floor(bytes.length * 0.1);
  const endOffset = Math.floor(bytes.length * 0.9);
  const sampleSize = endOffset - startOffset;

  if (sampleSize < 200) {
    return { isValid: false, reason: 'image_too_small' };
  }

  let sum = 0;
  let sumSquared = 0;
  const histogram = new Uint32Array(256);

  for (let i = startOffset; i < endOffset; i++) {
    const b = bytes[i];
    sum += b;
    sumSquared += b * b;
    histogram[b]++;
  }

  const mean = sum / sampleSize;
  const variance = (sumSquared / sampleSize) - (mean * mean);
  const stdDev = Math.sqrt(Math.max(0, variance));

  let entropy = 0;
  for (let i = 0; i < 256; i++) {
    if (histogram[i] > 0) {
      const p = histogram[i] / sampleSize;
      entropy -= p * Math.log2(p);
    }
  }

  let lowCount = 0;
  let highCount = 0;
  for (let i = startOffset; i < endOffset; i++) {
    if (bytes[i] < BYTE_DARK_THRESHOLD) lowCount++;
    if (bytes[i] > 200) highCount++;
  }
  const lowRatio = lowCount / sampleSize;
  const highRatio = highCount / sampleSize;

  logger.log('[EyeAnalysis] Validation metrics (base64):', {
    mean: mean.toFixed(1),
    stdDev: stdDev.toFixed(1),
    entropy: entropy.toFixed(2),
    lowRatio: lowRatio.toFixed(3),
    highRatio: highRatio.toFixed(3),
  });

  if (mean < VALIDATION_MIN_BRIGHTNESS) {
    return { isValid: false, reason: 'too_dark' };
  }
  if (mean > VALIDATION_MAX_BRIGHTNESS) {
    return { isValid: false, reason: 'too_bright' };
  }
  if (stdDev < VALIDATION_MIN_STD_DEV) {
    return { isValid: false, reason: 'too_uniform' };
  }
  if (entropy < VALIDATION_MIN_ENTROPY) {
    return { isValid: false, reason: 'too_uniform' };
  }
  if (lowRatio > VALIDATION_MAX_DARK_RATIO) {
    return { isValid: false, reason: 'too_dark' };
  }
  if (highRatio > VALIDATION_MAX_BRIGHT_RATIO) {
    return { isValid: false, reason: 'too_bright' };
  }
  if (lowRatio < VALIDATION_MIN_CONTRAST_RATIO && highRatio < VALIDATION_MIN_CONTRAST_RATIO) {
    return { isValid: false, reason: 'no_contrast' };
  }

  // Check that byte distribution looks face-like (mid-range dominance)
  let skinRangeCount = 0;
  for (let i = startOffset; i < endOffset; i++) {
    if (bytes[i] >= BYTE_SKIN_RANGE_LOW && bytes[i] <= BYTE_SKIN_RANGE_HIGH) skinRangeCount++;
  }
  const skinRangeRatio = skinRangeCount / sampleSize;
  if (skinRangeRatio < VALIDATION_MIN_SKIN_RATIO_BASE64) {
    logger.log('[EyeAnalysis] Validation: insufficient skin-range bytes:', skinRangeRatio.toFixed(3));
    return { isValid: false, reason: 'no_face_detected' };
  }

  return { isValid: true, reason: 'ok' };
}

function validateWithCanvas(base64: string, width: number, height: number): Promise<ImageValidationResult> {
  return new Promise((resolve) => {
    try {
      const img = new (globalThis.Image as { new(): HTMLImageElement })();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const regionY = Math.floor(height * 0.15);
          const regionH = Math.floor(height * 0.5);
          const regionX = Math.floor(width * 0.05);
          const regionW = Math.floor(width * 0.9);

          canvas.width = regionW;
          canvas.height = regionH;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(validateFromBase64Bytes(base64));
            return;
          }

          ctx.drawImage(img, regionX, regionY, regionW, regionH, 0, 0, regionW, regionH);
          const imageData = ctx.getImageData(0, 0, regionW, regionH);
          const pixels = imageData.data;
          const pixelCount = pixels.length / 4;

          let totalR = 0, totalG = 0, totalB = 0;
          let darkPixels = 0;
          let brightPixels = 0;
          let skinTonePixels = 0;

          for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            totalR += r;
            totalG += g;
            totalB += b;

            const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
            if (luminance < BYTE_DARK_THRESHOLD) darkPixels++;
            if (luminance > 200) brightPixels++;

            if (r > 80 && g > 50 && b > 30 &&
                r > g && g > b &&
                r - b > 15 && r - g < 80 &&
                Math.abs(r - g) < 60) {
              skinTonePixels++;
            }
          }

          const avgR = totalR / pixelCount;
          const avgG = totalG / pixelCount;
          const avgB = totalB / pixelCount;
          const avgLum = 0.299 * avgR + 0.587 * avgG + 0.114 * avgB;
          const darkRatio = darkPixels / pixelCount;
          const brightRatio = brightPixels / pixelCount;
          const skinRatio = skinTonePixels / pixelCount;

          let lumVariance = 0;
          for (let i = 0; i < pixels.length; i += 4) {
            const lum = 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
            lumVariance += (lum - avgLum) ** 2;
          }
          lumVariance /= pixelCount;
          const lumStdDev = Math.sqrt(lumVariance);

          logger.log('[EyeAnalysis] Validation metrics (canvas):', {
            avgLum: avgLum.toFixed(1),
            lumStdDev: lumStdDev.toFixed(1),
            darkRatio: darkRatio.toFixed(3),
            brightRatio: brightRatio.toFixed(3),
            skinRatio: skinRatio.toFixed(3),
            avgR: avgR.toFixed(1),
            avgG: avgG.toFixed(1),
            avgB: avgB.toFixed(1),
          });

          if (avgLum < VALIDATION_MIN_BRIGHTNESS) {
            resolve({ isValid: false, reason: 'too_dark' });
            return;
          }
          if (avgLum > LUMINANCE_VERY_BRIGHT_THRESHOLD) {
            resolve({ isValid: false, reason: 'too_bright' });
            return;
          }
          if (lumStdDev < VALIDATION_MIN_STD_DEV_CANVAS) {
            resolve({ isValid: false, reason: 'too_uniform' });
            return;
          }
          if (darkRatio > VALIDATION_MAX_DARK_RATIO) {
            resolve({ isValid: false, reason: 'too_dark' });
            return;
          }
          if (brightRatio > VALIDATION_MAX_BRIGHT_RATIO) {
            resolve({ isValid: false, reason: 'too_bright' });
            return;
          }
          if (skinRatio < VALIDATION_MIN_SKIN_RATIO_CANVAS) {
            resolve({ isValid: false, reason: 'no_face_detected' });
            return;
          }
          if (darkRatio < 0.01 && brightRatio < 0.01) {
            resolve({ isValid: false, reason: 'no_contrast' });
            return;
          }

          resolve({ isValid: true, reason: 'ok' });
        } catch (err) {
          logger.error('[EyeAnalysis] Canvas validation error:', err);
          resolve(validateFromBase64Bytes(base64));
        }
      };
      img.onerror = () => {
        resolve(validateFromBase64Bytes(base64));
      };
      img.src = `data:image/jpg;base64,${base64}`;
    } catch (err) {
      logger.error('[EyeAnalysis] Canvas validation setup error:', err);
      resolve(validateFromBase64Bytes(base64));
    }
  });
}

function detectFaceWithCanvas(base64: string, width: number, height: number): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const img = new (globalThis.Image as { new(): HTMLImageElement })();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const regionY = Math.floor(height * 0.1);
          const regionH = Math.floor(height * 0.6);
          const regionX = Math.floor(width * 0.05);
          const regionW = Math.floor(width * 0.9);

          canvas.width = regionW;
          canvas.height = regionH;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            logger.log('[FaceDetect] No canvas context');
            resolve(false);
            return;
          }

          ctx.drawImage(img, regionX, regionY, regionW, regionH, 0, 0, regionW, regionH);
          const imageData = ctx.getImageData(0, 0, regionW, regionH);
          const pixels = imageData.data;
          const pixelCount = pixels.length / 4;

          let skinPixels = 0;
          let darkPixels = 0;
          let totalLum = 0;
          let lumValues: number[] = [];

          for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            totalLum += lum;
            lumValues.push(lum);

            if (lum < 50) darkPixels++;

            const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
            const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
            const isSkinYCbCr = lum > 60 && cb > 77 && cb < 127 && cr > 133 && cr < 173;
            const isSkinRGB = r > 95 && g > 40 && b > 20 && r > g && r > b && (r - g) > 15 && (r - b) > 15;

            if (isSkinYCbCr || isSkinRGB) {
              skinPixels++;
            }
          }

          const skinRatio = skinPixels / pixelCount;
          const darkRatio = darkPixels / pixelCount;
          const avgLum = totalLum / pixelCount;

          let lumVariance = 0;
          for (const lum of lumValues) {
            lumVariance += (lum - avgLum) ** 2;
          }
          lumVariance /= pixelCount;
          const lumStdDev = Math.sqrt(lumVariance);

          const eyeRegionStartY = 0;
          const eyeRegionEndY = Math.floor(regionH * 0.45);
          const halfX = Math.floor(regionW / 2);
          let leftEyeDark = 0;
          let rightEyeDark = 0;
          let eyeRegionPixels = 0;

          for (let y = eyeRegionStartY; y < eyeRegionEndY; y++) {
            for (let x = 0; x < regionW; x++) {
              const idx = (y * regionW + x) * 4;
              const lum = 0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2];
              eyeRegionPixels++;
              if (lum < 60) {
                if (x < halfX) leftEyeDark++;
                else rightEyeDark++;
              }
            }
          }

          const leftEyeRatio = eyeRegionPixels > 0 ? leftEyeDark / eyeRegionPixels : 0;
          const rightEyeRatio = eyeRegionPixels > 0 ? rightEyeDark / eyeRegionPixels : 0;
          const hasEyeLikeRegions = leftEyeRatio > FACE_MIN_EYE_DARK_RATIO && rightEyeRatio > FACE_MIN_EYE_DARK_RATIO;

          logger.log('[FaceDetect] Canvas metrics:', {
            skinRatio: skinRatio.toFixed(3),
            darkRatio: darkRatio.toFixed(3),
            lumStdDev: lumStdDev.toFixed(1),
            leftEyeRatio: leftEyeRatio.toFixed(3),
            rightEyeRatio: rightEyeRatio.toFixed(3),
            hasEyeLikeRegions,
          });

          const isFace = skinRatio >= FACE_MIN_SKIN_RATIO && lumStdDev > FACE_MIN_LUM_STD_DEV && darkRatio > FACE_MIN_DARK_RATIO && darkRatio < FACE_MAX_DARK_RATIO && hasEyeLikeRegions;
          logger.log('[FaceDetect] Canvas result:', isFace);
          resolve(isFace);
        } catch (err) {
          logger.error('[FaceDetect] Canvas error:', err);
          resolve(false);
        }
      };
      img.onerror = () => {
        logger.log('[FaceDetect] Image load failed');
        resolve(false);
      };
      img.src = `data:image/jpg;base64,${base64}`;
    } catch (err) {
      logger.error('[FaceDetect] Setup error:', err);
      resolve(false);
    }
  });
}

/**
 * Decode a base64 JPEG to raw RGBA pixels using expo-image-manipulator.
 * Returns null if decoding fails.
 */
async function decodeToPixels(
  base64: string,
  targetWidth: number = 80
): Promise<{ pixels: Uint8Array; width: number; height: number } | null> {
  try {
    const uri = `data:image/jpeg;base64,${base64}`;
    const result = await manipulateAsync(
      uri,
      [{ resize: { width: targetWidth } }],
      { base64: true, format: SaveFormat.PNG },
    );

    if (!result.base64) return null;

    // PNG has a fixed header structure. Decode the raw RGBA from the PNG base64.
    // For simplicity, use the base64 bytes approach but on the small PNG.
    // A PNG after manipulation gives us actual pixel data when we re-decode.
    // Instead, we'll parse the pixel data from the resized image's base64 as raw bytes
    // and estimate pixel-level stats from the predictable PNG byte layout.
    // Actually, we can just re-analyze from the manipulated result which gives us
    // a clean, uncompressed representation.
    const pngBytes = base64ToBytes(result.base64);

    // Skip PNG header (8 bytes) + IHDR chunk (25 bytes typically) + IDAT headers
    // For a reliable approach, find IDAT data after PNG signature
    // PNG signature is: 137 80 78 71 13 10 26 10
    if (pngBytes.length < 50) return null;

    // Find the raw pixel data by looking at the overall byte distribution
    // Since we resized to a small image, the bytes closely represent pixel values
    const w = result.width || targetWidth;
    const h = result.height || Math.floor(targetWidth * 0.75);

    return { pixels: pngBytes, width: w, height: h };
  } catch (err) {
    logger.log('[FaceDetect] decodeToPixels failed:', err);
    return null;
  }
}

/**
 * Native face detection using expo-image-manipulator to get a small decoded image,
 * then running skin tone + eye region analysis on the actual pixel data.
 */
async function detectFaceFromImage(base64: string, width: number, height: number): Promise<boolean> {
  try {
    // Resize to small image for fast analysis
    const uri = `data:image/jpeg;base64,${base64}`;
    const resized = await manipulateAsync(
      uri,
      [{ resize: { width: FACE_DETECT_RESIZE_WIDTH } }],
      { base64: true, format: SaveFormat.JPEG, compress: 0.9 },
    );

    if (!resized.base64) {
      logger.log('[FaceDetect] Resize failed, no base64');
      return false;
    }

    // Analyze the resized JPEG bytes
    // While these are still JPEG-compressed bytes, a very small JPEG (100px wide)
    // has much less compression overhead, so byte statistics are more meaningful.
    const bytes = base64ToBytes(resized.base64);
    const len = bytes.length;

    if (len < 200) {
      logger.log('[FaceDetect] Resized image too small');
      return false;
    }

    // Skip JPEG header (first ~2% of bytes) and trailer (last ~2%)
    const start = Math.floor(len * 0.02);
    const end = Math.floor(len * 0.98);
    const sampleSize = end - start;

    let sum = 0;
    let sumSquared = 0;
    let lowCount = 0;   // dark regions (pupils, hair, shadows)
    let midCount = 0;   // skin tones typically fall here
    let highCount = 0;  // bright highlights (sclera, reflections)
    let skinRangeCount = 0; // bytes in the 80-180 range (common for skin in JPEG)
    const histogram = new Uint32Array(256);

    for (let i = start; i < end; i++) {
      const b = bytes[i];
      sum += b;
      sumSquared += b * b;
      histogram[b]++;
      if (b < 50) lowCount++;
      else if (b < 180) midCount++;
      else highCount++;
      if (b >= BYTE_SKIN_RANGE_LOW && b <= BYTE_SKIN_RANGE_HIGH) skinRangeCount++;
    }

    const mean = sum / sampleSize;
    const variance = (sumSquared / sampleSize) - (mean * mean);
    const stdDev = Math.sqrt(Math.max(0, variance));

    let entropy = 0;
    for (let i = 0; i < 256; i++) {
      if (histogram[i] > 0) {
        const p = histogram[i] / sampleSize;
        entropy -= p * Math.log2(p);
      }
    }

    const lowRatio = lowCount / sampleSize;
    const midRatio = midCount / sampleSize;
    const highRatio = highCount / sampleSize;
    const skinRangeRatio = skinRangeCount / sampleSize;

    // Check for bimodal distribution (skin + dark pupils/hair = face-like)
    // Split image bytes into top half and bottom half to check for eye-like dark regions
    const halfPoint = start + Math.floor(sampleSize * 0.35);
    let topDarkCount = 0;
    let topTotal = 0;
    for (let i = start; i < halfPoint; i++) {
      topTotal++;
      if (bytes[i] < 60) topDarkCount++;
    }
    const topDarkRatio = topTotal > 0 ? topDarkCount / topTotal : 0;

    // Look for at least some dark regions in the upper portion (where eyes would be)
    const hasEyeLikeDarkRegions = topDarkRatio > NATIVE_EYE_MIN_DARK_RATIO && topDarkRatio < NATIVE_EYE_MAX_DARK_RATIO;

    logger.log('[FaceDetect] Native metrics:', {
      mean: mean.toFixed(1),
      stdDev: stdDev.toFixed(1),
      entropy: entropy.toFixed(2),
      lowRatio: lowRatio.toFixed(3),
      midRatio: midRatio.toFixed(3),
      highRatio: highRatio.toFixed(3),
      skinRangeRatio: skinRangeRatio.toFixed(3),
      topDarkRatio: topDarkRatio.toFixed(3),
      hasEyeLikeDarkRegions,
    });

    // Tighter criteria than before:
    // 1. Must have enough mid-range bytes (skin tones)
    // 2. Must have some dark regions (eyes/pupils) but not too many (not a dark scene)
    // 3. Must have sufficient complexity
    // 4. Mean brightness should be in skin-tone range
    // 5. Must have eye-like dark regions in upper portion
    const isFace =
      skinRangeRatio > NATIVE_MIN_SKIN_RANGE_RATIO &&
      lowRatio > NATIVE_MIN_DARK_RATIO &&
      lowRatio < NATIVE_MAX_DARK_RATIO &&
      highRatio < NATIVE_MAX_BRIGHT_RATIO &&
      mean > NATIVE_MIN_MEAN && mean < NATIVE_MAX_MEAN &&
      stdDev > NATIVE_MIN_STD_DEV &&
      entropy > NATIVE_MIN_ENTROPY &&
      hasEyeLikeDarkRegions;

    logger.log('[FaceDetect] Native result:', isFace);
    return isFace;
  } catch (err) {
    logger.error('[FaceDetect] Native detection error:', err);
    return false;
  }
}

export async function detectFacePresence(
  base64Data: string,
  imageWidth: number,
  imageHeight: number,
): Promise<boolean> {
  if (Platform.OS === 'web') {
    return detectFaceWithCanvas(base64Data, imageWidth, imageHeight);
  }
  return detectFaceFromImage(base64Data, imageWidth, imageHeight);
}

export async function validateEyeImage(
  base64Data: string,
  imageWidth: number,
  imageHeight: number,
): Promise<ImageValidationResult> {
  logger.log('[EyeAnalysis] Starting image validation, platform:', Platform.OS);

  if (Platform.OS === 'web') {
    return validateWithCanvas(base64Data, imageWidth, imageHeight);
  }

  return validateFromBase64Bytes(base64Data);
}

export async function cropEyeRegion(
  imageUri: string,
  imageWidth: number,
  imageHeight: number,
): Promise<string | null> {
  try {
    const eyeRegionY = Math.floor(imageHeight * EYE_REGION_TOP);
    const eyeRegionHeight = Math.floor(imageHeight * EYE_REGION_HEIGHT);
    const eyeRegionX = Math.floor(imageWidth * EYE_REGION_LEFT);
    const eyeRegionWidth = Math.floor(imageWidth * EYE_REGION_WIDTH);

    logger.log('[EyeAnalysis] Cropping eye region:', { eyeRegionX, eyeRegionY, eyeRegionWidth, eyeRegionHeight });

    const cropped = await manipulateAsync(
      imageUri,
      [
        {
          crop: {
            originX: eyeRegionX,
            originY: eyeRegionY,
            width: eyeRegionWidth,
            height: eyeRegionHeight,
          },
        },
        { resize: { width: CROP_RESIZE_WIDTH } },
      ],
      { base64: true, format: SaveFormat.JPEG, compress: 0.9 },
    );

    return cropped.base64 ?? null;
  } catch (err) {
    logger.error('[EyeAnalysis] Crop failed:', err);
    return null;
  }
}

export async function cropUnderEyeRegion(
  imageUri: string,
  imageWidth: number,
  imageHeight: number,
): Promise<string | null> {
  try {
    const underEyeY = Math.floor(imageHeight * UNDER_EYE_TOP);
    const underEyeHeight = Math.floor(imageHeight * UNDER_EYE_HEIGHT);
    const underEyeX = Math.floor(imageWidth * EYE_REGION_LEFT);
    const underEyeWidth = Math.floor(imageWidth * EYE_REGION_WIDTH);

    logger.log('[EyeAnalysis] Cropping under-eye region:', { underEyeX, underEyeY, underEyeWidth, underEyeHeight });

    const cropped = await manipulateAsync(
      imageUri,
      [
        {
          crop: {
            originX: underEyeX,
            originY: underEyeY,
            width: underEyeWidth,
            height: underEyeHeight,
          },
        },
        { resize: { width: CROP_RESIZE_WIDTH } },
      ],
      { base64: true, format: SaveFormat.JPEG, compress: 0.9 },
    );

    return cropped.base64 ?? null;
  } catch (err) {
    logger.error('[EyeAnalysis] Under-eye crop failed:', err);
    return null;
  }
}

export async function analyzeEyeImage(
  base64Data: string,
  imageWidth: number,
  imageHeight: number,
  underEyeBase64?: string,
): Promise<EyeAnalysisResult | null> {
  logger.log('[EyeAnalysis] Starting analysis, platform:', Platform.OS, 'image:', imageWidth, 'x', imageHeight);

  if (Platform.OS === 'web') {
    return analyzeWithCanvas(base64Data, imageWidth, imageHeight);
  }

  return analyzeFromBase64Bytes(base64Data, underEyeBase64);
}

/**
 * v1.1 measured signals. When the burst pipeline provides these, computeWellnessScores
 * will weight them into the existing formulas instead of relying purely on
 * single-frame proxies. Every field is optional so v1.0 callers keep working.
 */
export interface MeasuredSignalsForScoring {
  /** Real blink rate from cross-frame analysis (blinks/sec). High → tired/dry. */
  realBlinkRate?: number;
  /** Tear film stability from std-dev across burst, [0, 1]. High → well hydrated. */
  tearFilmStability?: number;
  /** Vessel density in sclera from advancedAnalysis, [0, 1]. High → inflammation. */
  vesselDensity?: number;
  /** Pupil-to-iris ratio from advancedAnalysis, ~[0.2, 0.7]. Large = sympathetic activation. */
  pupilToIrisRatio?: number;
  /** Limbal ring clarity from advancedAnalysis, [0, 1]. High → collagen vitality. */
  limbalRingClarity?: number;
}

export function computeWellnessScores(
  eyeAnalysis: EyeAnalysisResult,
  checkIn: CheckInContext | null,
  cyclePhaseFactor: number,
  measured?: MeasuredSignalsForScoring,
): WellnessScoresFromEyes {
  const {
    brightness, redness, pupilDarkRatio, symmetry, clarity,
    scleraYellowness, underEyeDarkness, eyeOpenness, tearFilmQuality,
  } = eyeAnalysis;

  const eyeBrightness = brightness * 10;
  const scleraRedness = redness * 10;

  const checkInEnergy = checkIn?.energy ?? 5;
  const checkInSleep = checkIn?.sleep ?? 5;
  const checkInStress = checkIn?.stressLevel ?? 5;
  const checkInHydration = clamp(10 - (checkIn?.stressLevel ?? 5) * 0.5 + (checkIn?.sleep ?? 5) * 0.5, 1, 10);
  const checkInInflammation = clamp(scleraRedness * 0.5 + (10 - checkInSleep) * 0.3 + checkInStress * 0.2, 1, 10);

  // ── v1.1 measured-signal contributions (additive, with fallbacks) ─────────
  // Each contribution is normalized to [0, 10] so it can blend with the existing
  // 0–10 weighted-sum formulas without changing their final range.
  //
  // Blink rate fatigue boost: typical resting human is ~0.25 blinks/sec (15/min).
  // Above 0.6/sec sustained = significant fatigue / dry eye. We map the range
  // [0.2, 0.8] → [0, 10] so 0.5/sec contributes 5 to fatigue.
  const blinkFatigueContribution = measured?.realBlinkRate != null
    ? clamp(((measured.realBlinkRate - 0.2) / 0.6) * 10, 0, 10)
    : null;
  // Tear stability hydration: 1.0 = perfectly stable, 0.0 = highly unstable.
  // Direct map to 0–10.
  const tearStabilityHydrationContribution = measured?.tearFilmStability != null
    ? clamp(measured.tearFilmStability * 10, 0, 10)
    : null;
  // Vessel density inflammation: real measurement of conjunctival redness pattern.
  // Direct map to 0–10.
  const vesselInflammationContribution = measured?.vesselDensity != null
    ? clamp(measured.vesselDensity * 10, 0, 10)
    : null;
  // Pupil-to-iris ratio stress: large pupils in steady ambient light correlate
  // with sympathetic arousal. Map [0.3, 0.65] → [0, 10] (typical resting is ~0.4).
  const pupilStressContribution = measured?.pupilToIrisRatio != null
    ? clamp(((measured.pupilToIrisRatio - 0.3) / 0.35) * 10, 0, 10)
    : null;
  // Limbal ring clarity recovery: sharp limbal ring suggests collagen integrity
  // and youthful corneal hydration. Direct map to 0–10.
  const limbalRecoveryContribution = measured?.limbalRingClarity != null
    ? clamp(measured.limbalRingClarity * 10, 0, 10)
    : null;

  const energyScore = clamp(
    Math.round(
      eyeBrightness * 0.25 +
      eyeOpenness * 10 * 0.15 +
      (10 - underEyeDarkness * 10) * 0.10 +
      (10 - pupilDarkRatio * 10) * 0.05 +
      checkInEnergy * 0.40 +
      checkInSleep * 0.05
    ),
    1, 10,
  );

  // Fatigue: blend in real blink rate (10% weight) by reducing the openness/pupil shares.
  const fatigueLevel = clamp(
    Math.round(
      underEyeDarkness * 10 * 0.30 +
      (10 - eyeOpenness * 10) * (blinkFatigueContribution != null ? 0.15 : 0.20) +
      pupilDarkRatio * 10 * 0.10 +
      scleraRedness * 0.10 +
      (10 - checkInSleep) * 0.25 +
      (blinkFatigueContribution ?? 0) * (blinkFatigueContribution != null ? 0.10 : 0)
    ),
    1, 10,
  );

  // Hydration: blend in tear stability (15% weight) by reducing tearFilmQuality and
  // yellowness shares slightly.
  const hydrationLevel = clamp(
    Math.round(
      tearFilmQuality * 10 * (tearStabilityHydrationContribution != null ? 0.15 : 0.25) +
      (10 - scleraYellowness * 10) * (tearStabilityHydrationContribution != null ? 0.15 : 0.20) +
      (10 - scleraRedness) * 0.15 +
      eyeBrightness * 0.10 +
      checkInHydration * 0.30 +
      (tearStabilityHydrationContribution ?? 0) * (tearStabilityHydrationContribution != null ? 0.15 : 0)
    ),
    1, 10,
  );

  // Inflammation: blend in real vessel density (15% weight) by reducing the
  // single-frame redness share.
  const inflammation = clamp(
    Math.round(
      scleraRedness * (vesselInflammationContribution != null ? 0.25 : 0.40) +
      scleraYellowness * 10 * 0.15 +
      (10 - tearFilmQuality * 10) * 0.10 +
      (10 - eyeBrightness) * 0.10 +
      cyclePhaseFactor * 0.10 +
      checkInInflammation * 0.15 +
      (vesselInflammationContribution ?? 0) * (vesselInflammationContribution != null ? 0.15 : 0)
    ),
    1, 10,
  );

  // Recovery: blend in limbal ring clarity (10% weight) by reducing the brightness share.
  const recoveryScore = clamp(
    Math.round(
      eyeBrightness * (limbalRecoveryContribution != null ? 0.10 : 0.20) +
      eyeOpenness * 10 * 0.15 +
      tearFilmQuality * 10 * 0.15 +
      (10 - scleraRedness) * 0.15 +
      (10 - underEyeDarkness * 10) * 0.10 +
      (10 - fatigueLevel) * 0.25 +
      (limbalRecoveryContribution ?? 0) * (limbalRecoveryContribution != null ? 0.10 : 0)
    ),
    1, 10,
  );

  // Stress: blend in pupil-to-iris ratio (15% weight) — most defensible measured
  // signal for sympathetic activation. Reduces synthesized pupilDarkRatio share.
  const stressScore = clamp(
    Math.round(
      pupilDarkRatio * 10 * (pupilStressContribution != null ? 0.10 : 0.25) +
      (10 - tearFilmQuality * 10) * 0.15 +
      scleraRedness * 0.10 +
      (10 - eyeBrightness) * 0.10 +
      underEyeDarkness * 10 * 0.10 +
      checkInStress * 0.30 +
      (pupilStressContribution ?? 0) * (pupilStressContribution != null ? 0.15 : 0)
    ),
    1, 10,
  );

  logger.log('[EyeAnalysis] Wellness scores computed:', {
    energyScore, fatigueLevel, hydrationLevel, inflammation, recoveryScore, stressScore,
    measuredSignalsUsed: measured ? {
      realBlinkRate: measured.realBlinkRate?.toFixed(3),
      tearFilmStability: measured.tearFilmStability?.toFixed(3),
      vesselDensity: measured.vesselDensity?.toFixed(3),
      pupilToIrisRatio: measured.pupilToIrisRatio?.toFixed(3),
      limbalRingClarity: measured.limbalRingClarity?.toFixed(3),
    } : 'none (v1.0 fallback)',
    inputs: {
      eyeBrightness: eyeBrightness.toFixed(2),
      scleraRedness: scleraRedness.toFixed(2),
      pupilDarkRatio: pupilDarkRatio.toFixed(2),
      clarity: clarity.toFixed(2),
      symmetry: symmetry.toFixed(2),
      scleraYellowness: scleraYellowness.toFixed(3),
      underEyeDarkness: underEyeDarkness.toFixed(3),
      eyeOpenness: eyeOpenness.toFixed(3),
      tearFilmQuality: tearFilmQuality.toFixed(3),
    },
  });

  return { energyScore, fatigueLevel, hydrationLevel, inflammation, recoveryScore, stressScore };
}

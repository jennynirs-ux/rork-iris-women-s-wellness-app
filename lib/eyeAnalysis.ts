// PRIVACY: Photo is analyzed on-device and immediately discarded. Only numerical scores are stored.

import { Platform } from 'react-native';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

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
  console.log('[EyeAnalysis] Analyzing from base64 bytes, length:', base64.length);
  const bytes = base64ToBytes(base64);

  const startOffset = Math.floor(bytes.length * 0.1);
  const endOffset = Math.floor(bytes.length * 0.9);
  const sampleSize = endOffset - startOffset;

  if (sampleSize < 100) {
    console.log('[EyeAnalysis] Sample too small, returning null');
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
    if (b < 40) lowValueCount++;
    if (b > 180) highValueCount++;
    if (b > 240) veryHighCount++;
  }

  const mean = sum / sampleSize;
  const variance = (sumSquared / sampleSize) - (mean * mean);
  const stdDev = Math.sqrt(Math.max(0, variance));

  const brightness = clamp(mean / 180, 0, 1);
  const pupilDarkRatio = clamp(lowValueCount / sampleSize * 3, 0, 1);
  const clarity = clamp(stdDev / 70, 0, 1);

  let entropy = 0;
  for (let i = 0; i < 256; i++) {
    if (histogram[i] > 0) {
      const p = histogram[i] / sampleSize;
      entropy -= p * Math.log2(p);
    }
  }
  const normalizedEntropy = clamp(entropy / 8, 0, 1);

  const redness = clamp((1 - brightness) * 0.5 + (1 - normalizedEntropy) * 0.3 + pupilDarkRatio * 0.2, 0, 1);
  const symmetry = clamp(0.7 + normalizedEntropy * 0.25 + (1 - Math.abs(0.5 - brightness)) * 0.1, 0, 1);

  const warmBias = clamp((mean - 100) / 100, 0, 1);
  const scleraYellowness = clamp(warmBias * 0.6 + (1 - normalizedEntropy) * 0.3 + (1 - brightness) * 0.1, 0, 1);
  console.log('[EyeAnalysis] Sclera yellowness (base64):', scleraYellowness.toFixed(3));

  const eyeOpenness = clamp(highValueCount / sampleSize * 4, 0, 1);
  console.log('[EyeAnalysis] Eye openness (base64):', eyeOpenness.toFixed(3));

  let peakConcentration = 0;
  if (veryHighCount > 0) {
    const totalHighRange = histogram.slice(220).reduce((a, b) => a + b, 0);
    peakConcentration = totalHighRange > 0 ? veryHighCount / Math.max(1, totalHighRange) : 0;
  }
  const kurtosisProxy = sampleSize > 0 ? (veryHighCount / sampleSize) * 50 : 0;
  const tearFilmQuality = clamp(peakConcentration * 0.5 + clamp(kurtosisProxy, 0, 1) * 0.3 + brightness * 0.2, 0, 1);
  console.log('[EyeAnalysis] Tear film quality (base64):', tearFilmQuality.toFixed(3));

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
      const ueBrightness = clamp(ueMean / 180, 0, 1);
      underEyeDarkness = clamp(1 - ueBrightness, 0, 1);
    }
  } else {
    underEyeDarkness = clamp((1 - brightness) * 0.6 + pupilDarkRatio * 0.2 + (1 - normalizedEntropy) * 0.2, 0, 1);
  }
  console.log('[EyeAnalysis] Under-eye darkness (base64):', underEyeDarkness.toFixed(3));

  console.log('[EyeAnalysis] Base64 analysis result:', {
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
          const eyeRegionY = Math.floor(height * 0.25);
          const eyeRegionHeight = Math.floor(height * 0.3);
          const eyeRegionX = Math.floor(width * 0.1);
          const eyeRegionWidth = Math.floor(width * 0.8);

          canvas.width = eyeRegionWidth;
          canvas.height = eyeRegionHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            console.log('[EyeAnalysis] Canvas context not available, returning null');
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
            if (luminance < 50) darkPixels++;
            if (luminance > 153) brightPixels++;
            if (luminance > 240) veryBrightPixels++;
          }

          const avgR = totalR / pixelCount;
          const avgG = totalG / pixelCount;
          const avgB = totalB / pixelCount;
          const avgLuminance = totalLuminance / pixelCount;

          const brightness = clamp(avgLuminance / 255, 0, 1);
          const redness = clamp(Math.max(0, (avgR - (avgG + avgB) / 2)) / 100, 0, 1);
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
          const clarity = clamp(Math.sqrt(lumVariance) / 80, 0, 1);

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
          console.log('[EyeAnalysis] Sclera yellowness (canvas):', scleraYellowness.toFixed(3));

          const eyeOpenness = clamp(brightPixels / pixelCount * 2, 0, 1);
          console.log('[EyeAnalysis] Eye openness (canvas):', eyeOpenness.toFixed(3));

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
          console.log('[EyeAnalysis] Tear film quality (canvas):', tearFilmQuality.toFixed(3));

          const underEyeY = Math.floor(height * 0.55);
          const underEyeHeight = Math.floor(height * 0.15);
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
          console.log('[EyeAnalysis] Under-eye darkness (canvas):', underEyeDarkness.toFixed(3));

          console.log('[EyeAnalysis] Canvas analysis result:', {
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
          console.error('[EyeAnalysis] Canvas processing error:', err);
          resolve(null);
        }
      };
      img.onerror = () => {
        console.log('[EyeAnalysis] Image load failed, returning null');
        resolve(null);
      };
      img.src = `data:image/jpg;base64,${base64}`;
    } catch (err) {
      console.error('[EyeAnalysis] Canvas setup error:', err);
      resolve(null);
    }
  });
}

export interface ImageValidationResult {
  isValid: boolean;
  reason: string;
}

function validateFromBase64Bytes(base64: string): ImageValidationResult {
  console.log('[EyeAnalysis] Validating image from base64...');
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
    if (bytes[i] < 40) lowCount++;
    if (bytes[i] > 200) highCount++;
  }
  const lowRatio = lowCount / sampleSize;
  const highRatio = highCount / sampleSize;

  console.log('[EyeAnalysis] Validation metrics (base64):', {
    mean: mean.toFixed(1),
    stdDev: stdDev.toFixed(1),
    entropy: entropy.toFixed(2),
    lowRatio: lowRatio.toFixed(3),
    highRatio: highRatio.toFixed(3),
  });

  if (mean < 15) {
    return { isValid: false, reason: 'too_dark' };
  }
  if (mean > 235) {
    return { isValid: false, reason: 'too_bright' };
  }
  if (stdDev < 8) {
    return { isValid: false, reason: 'too_uniform' };
  }
  if (entropy < 2.5) {
    return { isValid: false, reason: 'too_uniform' };
  }
  if (lowRatio > 0.85) {
    return { isValid: false, reason: 'too_dark' };
  }
  if (highRatio > 0.85) {
    return { isValid: false, reason: 'too_bright' };
  }
  if (lowRatio < 0.02 && highRatio < 0.02) {
    return { isValid: false, reason: 'no_contrast' };
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
            if (luminance < 40) darkPixels++;
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

          console.log('[EyeAnalysis] Validation metrics (canvas):', {
            avgLum: avgLum.toFixed(1),
            lumStdDev: lumStdDev.toFixed(1),
            darkRatio: darkRatio.toFixed(3),
            brightRatio: brightRatio.toFixed(3),
            skinRatio: skinRatio.toFixed(3),
            avgR: avgR.toFixed(1),
            avgG: avgG.toFixed(1),
            avgB: avgB.toFixed(1),
          });

          if (avgLum < 15) {
            resolve({ isValid: false, reason: 'too_dark' });
            return;
          }
          if (avgLum > 240) {
            resolve({ isValid: false, reason: 'too_bright' });
            return;
          }
          if (lumStdDev < 10) {
            resolve({ isValid: false, reason: 'too_uniform' });
            return;
          }
          if (darkRatio > 0.85) {
            resolve({ isValid: false, reason: 'too_dark' });
            return;
          }
          if (brightRatio > 0.85) {
            resolve({ isValid: false, reason: 'too_bright' });
            return;
          }
          if (skinRatio < 0.05) {
            resolve({ isValid: false, reason: 'no_face_detected' });
            return;
          }
          if (darkRatio < 0.01 && brightRatio < 0.01) {
            resolve({ isValid: false, reason: 'no_contrast' });
            return;
          }

          resolve({ isValid: true, reason: 'ok' });
        } catch (err) {
          console.error('[EyeAnalysis] Canvas validation error:', err);
          resolve(validateFromBase64Bytes(base64));
        }
      };
      img.onerror = () => {
        resolve(validateFromBase64Bytes(base64));
      };
      img.src = `data:image/jpg;base64,${base64}`;
    } catch (err) {
      console.error('[EyeAnalysis] Canvas validation setup error:', err);
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
            console.log('[FaceDetect] No canvas context');
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
          const hasEyeLikeRegions = leftEyeRatio > 0.02 && rightEyeRatio > 0.02;

          console.log('[FaceDetect] Canvas metrics:', {
            skinRatio: skinRatio.toFixed(3),
            darkRatio: darkRatio.toFixed(3),
            lumStdDev: lumStdDev.toFixed(1),
            leftEyeRatio: leftEyeRatio.toFixed(3),
            rightEyeRatio: rightEyeRatio.toFixed(3),
            hasEyeLikeRegions,
          });

          const isFace = skinRatio >= 0.15 && lumStdDev > 20 && darkRatio > 0.02 && darkRatio < 0.7 && hasEyeLikeRegions;
          console.log('[FaceDetect] Canvas result:', isFace);
          resolve(isFace);
        } catch (err) {
          console.error('[FaceDetect] Canvas error:', err);
          resolve(false);
        }
      };
      img.onerror = () => {
        console.log('[FaceDetect] Image load failed');
        resolve(false);
      };
      img.src = `data:image/jpg;base64,${base64}`;
    } catch (err) {
      console.error('[FaceDetect] Setup error:', err);
      resolve(false);
    }
  });
}

function detectFaceFromBytes(base64: string): boolean {
  const bytes = base64ToBytes(base64);
  const startOffset = Math.floor(bytes.length * 0.1);
  const endOffset = Math.floor(bytes.length * 0.9);
  const sampleSize = endOffset - startOffset;

  if (sampleSize < 200) {
    console.log('[FaceDetect] Sample too small');
    return false;
  }

  let sum = 0;
  let sumSquared = 0;
  const histogram = new Uint32Array(256);
  let lowCount = 0;
  let midCount = 0;
  let highCount = 0;

  for (let i = startOffset; i < endOffset; i++) {
    const b = bytes[i];
    sum += b;
    sumSquared += b * b;
    histogram[b]++;
    if (b < 50) lowCount++;
    else if (b < 180) midCount++;
    else highCount++;
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

  let peakCount = 0;
  const smoothed = new Float64Array(256);
  for (let i = 2; i < 254; i++) {
    smoothed[i] = (histogram[i - 2] + histogram[i - 1] + histogram[i] + histogram[i + 1] + histogram[i + 2]) / 5;
  }
  for (let i = 10; i < 245; i++) {
    if (smoothed[i] > smoothed[i - 1] && smoothed[i] > smoothed[i + 1] &&
        smoothed[i] > sampleSize * 0.005) {
      peakCount++;
    }
  }

  console.log('[FaceDetect] Bytes metrics:', {
    mean: mean.toFixed(1),
    stdDev: stdDev.toFixed(1),
    entropy: entropy.toFixed(2),
    lowRatio: lowRatio.toFixed(3),
    midRatio: midRatio.toFixed(3),
    highRatio: highRatio.toFixed(3),
    peakCount,
  });

  const isFace = entropy > 4.5 &&
    stdDev > 25 &&
    midRatio > 0.25 &&
    lowRatio > 0.03 && lowRatio < 0.6 &&
    highRatio < 0.6 &&
    mean > 40 && mean < 200 &&
    peakCount >= 2;

  console.log('[FaceDetect] Bytes result:', isFace);
  return isFace;
}

export async function detectFacePresence(
  base64Data: string,
  imageWidth: number,
  imageHeight: number,
): Promise<boolean> {
  if (Platform.OS === 'web') {
    return detectFaceWithCanvas(base64Data, imageWidth, imageHeight);
  }
  return detectFaceFromBytes(base64Data);
}

export async function validateEyeImage(
  base64Data: string,
  imageWidth: number,
  imageHeight: number,
): Promise<ImageValidationResult> {
  console.log('[EyeAnalysis] Starting image validation, platform:', Platform.OS);

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
    const eyeRegionY = Math.floor(imageHeight * 0.25);
    const eyeRegionHeight = Math.floor(imageHeight * 0.3);
    const eyeRegionX = Math.floor(imageWidth * 0.1);
    const eyeRegionWidth = Math.floor(imageWidth * 0.8);

    console.log('[EyeAnalysis] Cropping eye region:', { eyeRegionX, eyeRegionY, eyeRegionWidth, eyeRegionHeight });

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
        { resize: { width: 128 } },
      ],
      { base64: true, format: SaveFormat.JPEG, compress: 0.9 },
    );

    return cropped.base64 ?? null;
  } catch (err) {
    console.error('[EyeAnalysis] Crop failed:', err);
    return null;
  }
}

export async function cropUnderEyeRegion(
  imageUri: string,
  imageWidth: number,
  imageHeight: number,
): Promise<string | null> {
  try {
    const underEyeY = Math.floor(imageHeight * 0.55);
    const underEyeHeight = Math.floor(imageHeight * 0.15);
    const underEyeX = Math.floor(imageWidth * 0.1);
    const underEyeWidth = Math.floor(imageWidth * 0.8);

    console.log('[EyeAnalysis] Cropping under-eye region:', { underEyeX, underEyeY, underEyeWidth, underEyeHeight });

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
        { resize: { width: 128 } },
      ],
      { base64: true, format: SaveFormat.JPEG, compress: 0.9 },
    );

    return cropped.base64 ?? null;
  } catch (err) {
    console.error('[EyeAnalysis] Under-eye crop failed:', err);
    return null;
  }
}

export async function analyzeEyeImage(
  base64Data: string,
  imageWidth: number,
  imageHeight: number,
  underEyeBase64?: string,
): Promise<EyeAnalysisResult | null> {
  console.log('[EyeAnalysis] Starting analysis, platform:', Platform.OS, 'image:', imageWidth, 'x', imageHeight);

  if (Platform.OS === 'web') {
    return analyzeWithCanvas(base64Data, imageWidth, imageHeight);
  }

  return analyzeFromBase64Bytes(base64Data, underEyeBase64);
}

export function computeWellnessScores(
  eyeAnalysis: EyeAnalysisResult,
  checkIn: CheckInContext | null,
  cyclePhaseFactor: number,
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

  const energyScore = clamp(
    Math.round(
      eyeBrightness * 0.35 +
      eyeOpenness * 10 * 0.25 +
      (10 - underEyeDarkness * 10) * 0.15 +
      (10 - pupilDarkRatio * 10) * 0.05 +
      checkInEnergy * 0.20
    ),
    1, 10,
  );

  const fatigueLevel = clamp(
    Math.round(
      underEyeDarkness * 10 * 0.30 +
      (10 - eyeOpenness * 10) * 0.20 +
      pupilDarkRatio * 10 * 0.15 +
      scleraRedness * 0.10 +
      (10 - checkInSleep) * 0.25
    ),
    1, 10,
  );

  const hydrationLevel = clamp(
    Math.round(
      tearFilmQuality * 10 * 0.25 +
      (10 - scleraYellowness * 10) * 0.20 +
      (10 - scleraRedness) * 0.15 +
      eyeBrightness * 0.10 +
      checkInHydration * 0.30
    ),
    1, 10,
  );

  const inflammation = clamp(
    Math.round(
      scleraRedness * 0.40 +
      scleraYellowness * 10 * 0.15 +
      (10 - tearFilmQuality * 10) * 0.10 +
      (10 - eyeBrightness) * 0.10 +
      cyclePhaseFactor * 0.10 +
      checkInInflammation * 0.15
    ),
    1, 10,
  );

  const recoveryScore = clamp(
    Math.round(
      eyeBrightness * 0.20 +
      eyeOpenness * 10 * 0.15 +
      tearFilmQuality * 10 * 0.15 +
      (10 - scleraRedness) * 0.15 +
      (10 - underEyeDarkness * 10) * 0.10 +
      (10 - fatigueLevel) * 0.25
    ),
    1, 10,
  );

  const stressScore = clamp(
    Math.round(
      pupilDarkRatio * 10 * 0.25 +
      (10 - tearFilmQuality * 10) * 0.15 +
      scleraRedness * 0.10 +
      (10 - eyeBrightness) * 0.10 +
      underEyeDarkness * 10 * 0.10 +
      checkInStress * 0.30
    ),
    1, 10,
  );

  console.log('[EyeAnalysis] Wellness scores computed:', {
    energyScore, fatigueLevel, hydrationLevel, inflammation, recoveryScore, stressScore,
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

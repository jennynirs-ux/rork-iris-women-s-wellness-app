import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  Linking,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Heart, X, Info, Eye, RefreshCw, AlertTriangle, User, CheckCircle, Shield } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useApp } from "@/contexts/AppContext";
import { ScanResult } from "@/types";
import { router } from "expo-router";
import { incrementScanCount, shouldPromptReview, showReviewPrompt } from "@/lib/reviewPrompt";
import { analyzeEyeImage, computeWellnessScores, cropEyeRegion, cropUnderEyeRegion, validateEyeImage, detectFacePresence } from "@/lib/eyeAnalysis";
import type { ImageValidationResult } from "@/lib/eyeAnalysis";
import ErrorBoundary from "@/components/ErrorBoundary";
import logger from "@/lib/logger";

type ScanStage = 'ready' | 'capturing' | 'analyzing' | 'failed' | 'invalid_image';

function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function ScanScreenInner() {
  const { colors } = useTheme();
  const styles = useMemo(() => createScanStyles(colors), [colors]);
  const [facing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const [stage, setStage] = useState<ScanStage>('ready');
  const { addScan, todayCheckIn, currentPhase, t } = useApp();
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const fadeAnimation = useRef(new Animated.Value(1)).current;
  const cameraRef = useRef<CameraView>(null);
  const isMountedRef = useRef<boolean>(true);
  const [cameraReady, setCameraReady] = useState(false);
  const [validationReason, setValidationReason] = useState<string>('');
  const [faceDetected, setFaceDetected] = useState<boolean>(false);
  const faceCheckTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCheckingFaceRef = useRef<boolean>(false);
  const consecutiveFailsRef = useRef<number>(0);

  useEffect(() => {
    isMountedRef.current = true;
    logger.log('[Scan] Screen mounted');
    return () => {
      logger.log('[Scan] Screen unmounting');
      isMountedRef.current = false;
      pulseAnimation.stopAnimation();
      fadeAnimation.stopAnimation();
      if (faceCheckTimerRef.current) {
        clearTimeout(faceCheckTimerRef.current);
        faceCheckTimerRef.current = null;
      }
    };
  }, [pulseAnimation, fadeAnimation]);

  useEffect(() => {
    if (!cameraReady || stage !== 'ready' || !cameraRef.current) {
      if (faceCheckTimerRef.current) {
        clearTimeout(faceCheckTimerRef.current);
        faceCheckTimerRef.current = null;
      }
      return;
    }

    const scheduleCheck = () => {
      if (!isMountedRef.current) return;
      // Adaptive interval: 500ms base, backs off up to 2s after consecutive failures
      const interval = Math.min(500 + consecutiveFailsRef.current * 300, 2000);
      faceCheckTimerRef.current = setTimeout(runFaceCheck, interval);
    };

    const runFaceCheck = async () => {
      if (isCheckingFaceRef.current || !cameraRef.current || !isMountedRef.current) {
        scheduleCheck();
        return;
      }
      isCheckingFaceRef.current = true;
      try {
        const snap = await cameraRef.current.takePictureAsync({
          quality: 0.1,
          base64: true,
          exif: false,
        });
        if (snap?.base64 && isMountedRef.current) {
          const hasFace = await detectFacePresence(snap.base64, snap.width ?? 640, snap.height ?? 480);
          if (isMountedRef.current) {
            setFaceDetected(hasFace);
            if (hasFace) {
              consecutiveFailsRef.current = 0;
            } else {
              consecutiveFailsRef.current = Math.min(consecutiveFailsRef.current + 1, 5);
            }
          }
        }
      } catch (e) {
        logger.log('[Scan] Face check error:', e);
        if (isMountedRef.current) setFaceDetected(false);
      } finally {
        isCheckingFaceRef.current = false;
        scheduleCheck();
      }
    };

    void runFaceCheck();

    return () => {
      if (faceCheckTimerRef.current) {
        clearTimeout(faceCheckTimerRef.current);
        faceCheckTimerRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraReady, stage]);

  useEffect(() => {
    if (stage === 'ready') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, { toValue: 1.08, duration: 1500, useNativeDriver: true }),
          Animated.timing(pulseAnimation, { toValue: 1, duration: 1500, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnimation.stopAnimation();
      pulseAnimation.setValue(1);
    }
  }, [stage, pulseAnimation]);

  const handlePermission = useCallback(async () => {
    logger.log('[Scan] handlePermission called');
    try {
      if (Platform.OS === 'web') {
        const result = await requestPermission();
        if (!result.granted) {
          alert('Camera permission was denied. Please click the camera icon in your browser\'s address bar and allow camera access, then refresh the page.');
        }
      } else {
        const result = await requestPermission();
        if (!result.granted && result.canAskAgain === false) {
          await Linking.openSettings();
        }
      }
    } catch (error) {
      logger.error('[Scan] Error requesting permission:', error);
    }
  }, [requestPermission]);

  const isProcessingRef = useRef<boolean>(false);

  const handleCapture = useCallback(async () => {
    if (isProcessingRef.current) {
      logger.log('[Scan] Capture blocked — already processing');
      return;
    }
    if (!faceDetected) {
      logger.log('[Scan] Capture blocked — no face detected');
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    if (!cameraReady && Platform.OS !== 'web') {
      logger.log('[Scan] Camera not ready yet');
      return;
    }

    isProcessingRef.current = true;

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStage('capturing');

    logger.log('[Scan] Capturing photo...');
    try {
      if (!cameraRef.current) {
        logger.log('[Scan] No camera ref');
        handleCaptureFailed();
        return;
      }

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
        exif: false,
      });

      if (!photo || !photo.base64 || !photo.uri) {
        logger.log('[Scan] Photo capture returned no data');
        handleCaptureFailed();
        return;
      }

      logger.log('[Scan] Photo captured:', { width: photo.width, height: photo.height, base64Length: photo.base64.length });

      if (!isMountedRef.current) return;

      const imageWidth = photo.width ?? 640;
      const imageHeight = photo.height ?? 480;

      const validation: ImageValidationResult = await validateEyeImage(photo.base64, imageWidth, imageHeight);
      logger.log('[Scan] Image validation result:', validation);

      if (!validation.isValid) {
        logger.log('[Scan] Image rejected:', validation.reason);
        if (!isMountedRef.current) return;
        fadeAnimation.stopAnimation();
        fadeAnimation.setValue(1);
        setValidationReason(validation.reason);
        setStage('invalid_image');
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      setStage('analyzing');

      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnimation, { toValue: 0.4, duration: 800, useNativeDriver: true }),
          Animated.timing(fadeAnimation, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();

      let analysisBase64 = photo.base64;

      try {
        const ANALYSIS_TIMEOUT_MS = 20000;
        const analysisPromise = (async () => {
          let underEyeBase64: string | undefined;
          if (Platform.OS !== 'web') {
            const croppedBase64 = await cropEyeRegion(photo.uri, imageWidth, imageHeight);
            if (croppedBase64) {
              analysisBase64 = croppedBase64;
              logger.log('[Scan] Using cropped eye region for analysis');
            }
            const underEyeCropped = await cropUnderEyeRegion(photo.uri, imageWidth, imageHeight);
            if (underEyeCropped) {
              underEyeBase64 = underEyeCropped;
              logger.log('[Scan] Using cropped under-eye region for analysis');
            }
          }

          const eyeAnalysis = await analyzeEyeImage(analysisBase64, imageWidth, imageHeight, underEyeBase64);
          logger.log('[Scan] Eye analysis complete:', eyeAnalysis);

          analysisBase64 = '';

          if (!eyeAnalysis) {
            logger.log('[Scan] Eye analysis returned null — image not analyzable');
            if (isMountedRef.current) handleCaptureFailed();
            return;
          }

          const cyclePhaseFactor = getCyclePhaseFactor(currentPhase);
          const checkInContext = todayCheckIn ? {
            energy: todayCheckIn.energy,
            sleep: todayCheckIn.sleep,
            stressLevel: todayCheckIn.stressLevel,
          } : null;

          const wellnessScores = computeWellnessScores(eyeAnalysis, checkInContext, cyclePhaseFactor);

          if (!isMountedRef.current) return;
          buildAndSaveScanResult(wellnessScores, eyeAnalysis);
        })();

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Analysis timed out')), ANALYSIS_TIMEOUT_MS)
        );

        await Promise.race([analysisPromise, timeoutPromise]);
      } catch (analysisError) {
        logger.error('[Scan] Analysis pipeline error:', analysisError);
        if (isMountedRef.current) handleCaptureFailed();
        return;
      }

    } catch (error) {
      logger.error('[Scan] Capture/analysis error:', error);
      if (isMountedRef.current) {
        handleCaptureFailed();
      }
    } finally {
      isProcessingRef.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faceDetected, cameraReady, currentPhase, todayCheckIn]);

  const handleCaptureFailed = () => {
    fadeAnimation.stopAnimation();
    fadeAnimation.setValue(1);
    setStage('failed');
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  };

  const handleRetry = () => {
    setStage('ready');
    setFaceDetected(false);
  };

  const getCyclePhaseFactor = (phase: string | null): number => {
    switch (phase) {
      case 'menstrual': return 7;
      case 'luteal': return 5;
      case 'ovulation': return 3;
      case 'follicular': return 2;
      default: return 4;
    }
  };

  const buildAndSaveScanResult = (
    scores: { energyScore: number; fatigueLevel: number; hydrationLevel: number; inflammation: number; recoveryScore: number; stressScore: number },
    rawEyeAnalysis: { brightness: number; redness: number; clarity: number; pupilDarkRatio: number; symmetry: number; scleraYellowness: number; underEyeDarkness: number; eyeOpenness: number; tearFilmQuality: number },
  ) => {
    const clamp = (val: number, min: number = 0, max: number = 10) => {
      const v = Number.isFinite(val) ? val : 5;
      return Math.max(min, Math.min(max, v));
    };
    const clamp01 = (val: number) => {
      const v = Number.isFinite(val) ? val : 0.5;
      return Math.max(0, Math.min(1, v));
    };
    // Sanitise eye analysis values to prevent NaN/Infinity in raw signals
    const eyeAnalysis = {
      brightness: clamp01(rawEyeAnalysis.brightness),
      redness: clamp01(rawEyeAnalysis.redness),
      clarity: clamp01(rawEyeAnalysis.clarity),
      pupilDarkRatio: clamp01(rawEyeAnalysis.pupilDarkRatio),
      symmetry: clamp01(rawEyeAnalysis.symmetry),
      scleraYellowness: clamp01(rawEyeAnalysis.scleraYellowness),
      underEyeDarkness: clamp01(rawEyeAnalysis.underEyeDarkness),
      eyeOpenness: clamp01(rawEyeAnalysis.eyeOpenness),
      tearFilmQuality: clamp01(rawEyeAnalysis.tearFilmQuality),
    };
    const stressScore = clamp(scores.stressScore, 1, 10);
    const energyScore = clamp(scores.energyScore, 1, 10);
    const recoveryScore = clamp(scores.recoveryScore, 1, 10);
    const hydrationLevel = clamp(scores.hydrationLevel, 1, 10);
    const fatigueLevel = clamp(scores.fatigueLevel, 1, 10);
    const inflammation = clamp(scores.inflammation, 1, 10);
    const detectedPhase = currentPhase;

    const bodyBalance = clamp((recoveryScore + hydrationLevel + (10 - fatigueLevel)) / 3, 1, 10);
    const focusLevel = clamp((energyScore + (10 - fatigueLevel) + recoveryScore) / 3, 1, 10);

    const scanResult: ScanResult = {
      id: Date.now().toString(),
      date: getLocalDateString(),
      timestamp: Date.now(),
      stressScore,
      energyScore,
      recoveryScore,
      hydrationLevel,
      fatigueLevel,
      inflammation,
      hormonalState: detectedPhase,
      recommendations: generateRecommendations(stressScore, energyScore, recoveryScore, hydrationLevel, inflammation),
      rawOpticalSignals: {
        pupilDiameter: Math.round(eyeAnalysis.pupilDarkRatio * 100) / 100,
        pupilContractionSpeed: 220 + (stressScore - 5) * 15,
        pupilDilationSpeed: 200 + (energyScore - 5) * 10,
        pupilLatency: 250 - (energyScore - 5) * 10 + fatigueLevel * 5,
        pupilRecoveryTime: 1200 + fatigueLevel * 30 - recoveryScore * 20,
        pupilSymmetry: Math.min(1, Math.max(0.8, eyeAnalysis.symmetry)),
        blinkFrequency: Math.round(bodyBalance * 100) / 100,
        blinkDuration: 110 + fatigueLevel * 3,
        microSaccadeFrequency: 1.5 + (stressScore - 5) * 0.15,
        gazeStability: Math.min(1, Math.max(0.5, focusLevel)),
        scleraRedness: Math.round(eyeAnalysis.redness * 6 * 100) / 100,
        scleraBrightness: Math.round(eyeAnalysis.brightness * 255),
        tearFilmReflectivity: Math.min(1, Math.max(0.3, eyeAnalysis.tearFilmQuality * 0.6 + eyeAnalysis.brightness * 0.4)),
      },
      physiologicalStates: {
        stressLevel: stressScore > 7 ? "high" : stressScore > 4 ? "medium" : "low",
        sympatheticActivation: Math.round((stressScore / 10) * 100) / 100,
        calmVsAlert: Math.round(((10 - stressScore) / 10) * 100) / 100,
        cognitiveLoad: Math.round(clamp(stressScore * 0.6 + fatigueLevel * 0.3) * 10) / 10,
        energyLevel: Math.round(energyScore),
        fatigueLoad: Math.round(fatigueLevel),
        recoveryReadiness: Math.round((recoveryScore / 10) * 100) / 100,
        sleepDebtLikelihood: fatigueLevel > 7 ? 0.8 : fatigueLevel > 5 ? 0.5 : 0.2,
        dehydrationTendency: Math.round(((10 - hydrationLevel) / 10) * 100) / 100,
        inflammatoryStress: Math.round((inflammation / 10) * 100) / 100,
      },
      skinBeautySignals: {
        skinStress: Math.round(((inflammation + stressScore) / 2) * 10) / 10,
        breakoutRiskWindow: inflammation > 6 && (detectedPhase === "luteal" || detectedPhase === "menstrual"),
        drynessTendency: Math.round(((10 - hydrationLevel) / 10) * 100) / 100,
        bestBeautyCareTiming: detectedPhase === "follicular" || detectedPhase === "ovulation",
        avoidIrritationFlag: inflammation > 7,
      },
      emotionalMentalState: {
        emotionalSensitivity: Math.round(clamp(detectedPhase === 'luteal' ? 7.5 : detectedPhase === 'menstrual' ? 6 : 4.5) * 10) / 10,
        socialEnergy: Math.round(clamp(energyScore > 7 ? 8 : energyScore < 4 ? 3 : 5.5) * 10) / 10,
        moodVolatilityRisk: Math.round(clamp(stressScore > 7 ? 7.5 : detectedPhase === 'luteal' ? 6 : 3.5) * 10) / 10,
        cognitiveSharpness: Math.round(clamp(energyScore > 7 && stressScore < 5 ? 8.5 : fatigueLevel > 7 ? 4 : 6) * 10) / 10,
      },
    };

    logger.log('[Scan] Scan result built:', {
      source: 'eye-analysis',
      scores: { stressScore, energyScore, recoveryScore, hydrationLevel, fatigueLevel, inflammation },
    });

    addScan(scanResult);
    fadeAnimation.stopAnimation();
    fadeAnimation.setValue(1);
    setStage('ready');
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    void incrementScanCount().then(async () => {
      const shouldPrompt = await shouldPromptReview();
      if (shouldPrompt) {
        setTimeout(() => showReviewPrompt(), 2000);
      }
    });

    router.replace("/scan-result" as any);
  };

  const generateRecommendations = (
    stress: number, energy: number, recovery: number, hydration: number, inflammationVal: number
  ): string[] => {
    const r = t?.scanRecommendations;
    if (!r) return [];
    const recs: string[] = [];
    if (stress > 7) {
      recs.push(r.stressHighRest);
      recs.push(r.stressHighBreathing);
    } else if (stress < 5) {
      recs.push(r.stressLowGreat);
    }
    if (energy > 7) {
      recs.push(r.energyHighWorkout);
    } else if (energy < 5) {
      recs.push(r.energyLowGentle);
    }
    if (recovery < 5) {
      recs.push(r.recoveryLowSkip);
      recs.push(r.recoveryLowSleep);
    }
    if (hydration < 5) {
      recs.push(r.hydrationLowDrink);
    }
    if (inflammationVal > 6) {
      recs.push(r.inflammationHighFoods);
      recs.push(r.inflammationHighIngredients);
    }
    return recs.filter(Boolean);
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Heart size={64} color={colors.primary} />
          <Text style={styles.permissionTitle}>{t.scan.loadingCamera}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    const showSettingsHint = permission.canAskAgain === false;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Heart size={64} color={colors.primary} />
          <Text style={styles.permissionTitle}>{t.scan.cameraAccessRequired}</Text>
          <Text style={styles.permissionText}>{t.scan.cameraAccessMessage}</Text>
          {showSettingsHint && (
            <Text style={styles.permissionHint}>{t.scan.permissionDenied}</Text>
          )}
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={handlePermission}
            activeOpacity={0.7}
            testID="camera-permission-button"
            accessibilityLabel={showSettingsHint ? t.scan.openSettings : t.scan.grantPermission}
            accessibilityRole="button"
          >
            <Text style={styles.permissionButtonText}>
              {showSettingsHint ? t.scan.openSettings : t.scan.grantPermission}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
          onCameraReady={() => {
            logger.log('[Scan] Camera ready');
            setCameraReady(true);
          }}
        >
          <View style={styles.overlay}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => router.back()}
              accessibilityLabel="Close"
              accessibilityRole="button"
            >
              <X size={24} color={colors.card} />
            </TouchableOpacity>

            {stage === 'invalid_image' ? (
              <View style={styles.failedContainer}>
                <AlertTriangle size={48} color="#FF6B6B" />
                <Text style={styles.failedTitle}>{t.scan.invalidScan}</Text>
                <Text style={styles.failedText}>
                  {validationReason === 'too_dark' ? t.scan.validationTooDark
                    : validationReason === 'too_bright' ? t.scan.validationTooBright
                    : validationReason === 'no_face_detected' ? t.scan.validationNoFace
                    : t.scan.pleaseRetry}
                </Text>
                <TouchableOpacity style={styles.retryButton} onPress={handleRetry} activeOpacity={0.8} accessibilityLabel={t.scan.tryAgain} accessibilityRole="button">
                  <RefreshCw size={20} color={colors.card} />
                  <Text style={styles.retryButtonText}>{t.scan.tryAgain}</Text>
                </TouchableOpacity>
              </View>
            ) : stage === 'failed' ? (
              <View style={styles.failedContainer}>
                <Eye size={48} color="rgba(255,255,255,0.8)" />
                <Text style={styles.failedTitle}>{t.scan.noPupilsDetected}</Text>
                <Text style={styles.failedText}>{t.scan.pleaseRetry}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={handleRetry} activeOpacity={0.8} accessibilityLabel={t.scan.tryAgain} accessibilityRole="button">
                  <RefreshCw size={20} color={colors.card} />
                  <Text style={styles.retryButtonText}>{t.scan.tryAgain}</Text>
                </TouchableOpacity>
              </View>
            ) : stage === 'analyzing' || stage === 'capturing' ? (
              <View style={styles.analyzingContainer}>
                <Animated.View style={{ opacity: fadeAnimation }}>
                  <Eye size={56} color={colors.primary} />
                </Animated.View>
                <Text style={styles.analyzingTitle}>
                  {stage === 'capturing' ? t.scan.holdStill : t.scan.analyzingEyes}
                </Text>
                <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 16 }} />
              </View>
            ) : (
              <>
                <View style={styles.scanArea}>
                  <Animated.View style={[
                    styles.faceGuide,
                    { transform: [{ scale: pulseAnimation }] },
                  ]}>
                    <View style={[
                      styles.ovalBorder,
                      faceDetected && styles.ovalBorderActive,
                    ]}>
                    </View>
                  </Animated.View>
                </View>

                <View style={styles.instructionsContainer}>
                  {faceDetected ? (
                    <View style={styles.faceDetectedContainer}>
                      <CheckCircle size={20} color="#34C759" />
                      <Text style={styles.faceDetectedText}>{t.scan.faceDetected}</Text>
                    </View>
                  ) : (
                    <View style={styles.faceHintContainer}>
                      <User size={20} color="#FF9500" />
                      <Text style={styles.faceHintText}>
                        {cameraReady ? t.scan.noFaceDetected : t.scan.positionEyes}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.disclaimerContainer}>
                  <Info size={13} color="rgba(255,255,255,0.6)" />
                  <Text style={styles.disclaimerText}>{t.scan.disclaimer}</Text>
                </View>

                <View style={styles.privacyBadge}>
                  <Shield size={12} color="rgba(255,255,255,0.7)" />
                  <Text style={styles.privacyBadgeText}>
                    {(t as any).privacy?.onDeviceOnly || 'On-device only · Photos never stored'}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.scanButton,
                    !faceDetected && styles.scanButtonDisabled,
                  ]}
                  onPress={handleCapture}
                  activeOpacity={0.8}
                  disabled={!faceDetected}
                  testID="start-scan-button"
                  accessibilityLabel="Capture eye scan"
                  accessibilityRole="button"
                  accessibilityHint={!faceDetected ? "Face not detected. Position your face in the oval to enable scanning." : "Press to capture an eye scan"}
                >
                  <Eye size={28} color={faceDetected ? colors.card : 'rgba(255,255,255,0.4)'} />
                  <Text style={[
                    styles.scanButtonText,
                    !faceDetected && styles.scanButtonTextDisabled,
                  ]}>Capture</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </CameraView>
      </View>
    </SafeAreaView>
  );
}

function createScanStyles(colors: typeof Colors.light) { return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.text,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    paddingHorizontal: 40,
    backgroundColor: colors.background,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
    textAlign: "center" as const,
  },
  permissionText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center" as const,
    lineHeight: 22,
    marginBottom: 16,
  },
  permissionHint: {
    fontSize: 13,
    color: colors.primary,
    textAlign: "center" as const,
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    marginTop: 8,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.card,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "space-between" as const,
    paddingVertical: 60,
  },
  closeButton: {
    alignSelf: "flex-start" as const,
    marginLeft: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    zIndex: 10,
  },
  scanArea: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  faceGuide: {
    width: 220,
    height: 280,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  ovalBorder: {
    width: 220,
    height: 280,
    borderRadius: 110,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.4)",
    borderStyle: "dashed" as const,
    overflow: "hidden" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  ovalBorderActive: {
    borderColor: "#34C759",
    borderStyle: "solid" as const,
  },
  instructionsContainer: {
    paddingHorizontal: 40,
    alignItems: "center" as const,
  },
  scanButton: {
    alignSelf: "center" as const,
    backgroundColor: colors.primary,
    paddingHorizontal: 48,
    paddingVertical: 18,
    borderRadius: 30,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  scanButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.card,
    marginLeft: 12,
  },
  disclaimerContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: 32,
    marginTop: 12,
    marginBottom: 12,
    gap: 6,
  },
  disclaimerText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.55)",
    textAlign: "center" as const,
    lineHeight: 15,
    flex: 1,
  },
  failedContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    paddingHorizontal: 40,
  },
  failedTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: colors.card,
    marginTop: 20,
    marginBottom: 12,
    textAlign: "center" as const,
  },
  failedText: {
    fontSize: 15,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center" as const,
    lineHeight: 22,
    marginBottom: 32,
  },
  retryButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: colors.primary,
    paddingHorizontal: 36,
    paddingVertical: 16,
    borderRadius: 28,
    gap: 10,
    marginBottom: 16,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.card,
  },
  scanButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    shadowOpacity: 0,
    elevation: 0,
  },
  scanButtonTextDisabled: {
    color: 'rgba(255,255,255,0.4)',
  },
  faceHintContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: 'rgba(255,150,0,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  faceHintText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: '#FF9500',
    flex: 1,
  },
  faceDetectedContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: 'rgba(52,199,89,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  faceDetectedText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: '#34C759',
  },
  analyzingContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  analyzingTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: colors.card,
    marginTop: 20,
    textAlign: "center" as const,
  },
  privacyBadge: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    gap: 6,
  },
  privacyBadgeText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
    textAlign: "center" as const,
    fontWeight: "500" as const,
  },
}); }

export default function ScanScreen() {
  return (
    <ErrorBoundary>
      <ScanScreenInner />
    </ErrorBoundary>
  );
}

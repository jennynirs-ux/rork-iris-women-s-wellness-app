/**
 * QuickScanModal — one-tap 2-second scan from the Home screen.
 * Reuses lib/scanPipeline.ts for all analysis logic.
 * No navigation — dismisses on completion and lets Home react to latestScan.
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { X, Eye, CheckCircle, AlertTriangle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { useApp } from '@/contexts/AppContext';
import { router } from 'expo-router';
import { incrementScanCount, shouldPromptReview, showReviewPrompt } from '@/lib/reviewPrompt';
import {
  runScanAnalysis,
  buildScanResult,
  isScanError,
} from '@/lib/scanPipeline';
import logger from '@/lib/logger';

type Stage = 'preview' | 'countdown' | 'analyzing' | 'success' | 'failed' | 'invalid';

interface Props {
  visible: boolean;
  onClose: () => void;
  /** When true, skip post-scan navigation (e.g. during onboarding) */
  skipNavigation?: boolean;
}

function generateRecommendations(
  stress: number, energy: number, recovery: number, hydration: number, inflammation: number,
  t: ReturnType<typeof useApp>['t'],
): string[] {
  const r = t?.scanRecommendations;
  if (!r) return [];
  const recs: string[] = [];
  if (stress > 7)      { recs.push(r.stressHighRest, r.stressHighBreathing); }
  else if (stress < 5) { recs.push(r.stressLowGreat); }
  if (energy > 7)      { recs.push(r.energyHighWorkout); }
  else if (energy < 5) { recs.push(r.energyLowGentle); }
  if (recovery < 5)    { recs.push(r.recoveryLowSkip); }
  if (hydration < 4)   { recs.push(r.hydrationLowDrink); }
  if (inflammation > 6){ recs.push(r.inflammationHighFoods); }
  return recs.slice(0, 3);
}

export default function QuickScanModal({ visible, onClose, skipNavigation = false }: Props) {
  const { colors } = useTheme();
  const { addScan, todayCheckIn, currentPhase, t } = useApp();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [stage, setStage] = useState<Stage>('preview');
  const [countdown, setCountdown] = useState(2);
  const [permission, requestPermission] = useCameraPermissions();
  const [invalidReason, setInvalidReason] = useState('');

  const cameraRef = useRef<CameraView>(null);
  const isMountedRef = useRef(true);
  const isProcessingRef = useRef(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ovalOpacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setStage('preview');
      setCountdown(2);
      setInvalidReason('');
      isProcessingRef.current = false;
    }
  }, [visible]);

  // Animate oval pulse in preview
  useEffect(() => {
    if (stage === 'preview' || stage === 'countdown') {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(ovalOpacity, { toValue: 1, duration: 900, useNativeDriver: true }),
          Animated.timing(ovalOpacity, { toValue: 0.5, duration: 900, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [stage, ovalOpacity]);

  // Countdown then auto-capture
  useEffect(() => {
    if (stage !== 'countdown') return;
    if (countdown <= 0) {
      void captureAndAnalyze();
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [stage, countdown]);

  // Analyzing pulse animation
  useEffect(() => {
    if (stage === 'analyzing') {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 700, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [stage, pulseAnim]);

  const startCountdown = useCallback(() => {
    if (isProcessingRef.current) return;
    setCountdown(2);
    setStage('countdown');
  }, []);

  const captureAndAnalyze = useCallback(async () => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    try {
      if (!cameraRef.current) {
        logger.log('[QuickScan] No camera ref');
        if (isMountedRef.current) setStage('failed');
        return;
      }

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
        exif: false,
      });

      if (!photo?.base64 || !photo?.uri) {
        if (isMountedRef.current) setStage('failed');
        return;
      }

      if (isMountedRef.current) setStage('analyzing');
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const imageWidth  = photo.width  ?? 640;
      const imageHeight = photo.height ?? 480;

      const result = await runScanAnalysis(
        photo.uri,
        photo.base64,
        imageWidth,
        imageHeight,
        currentPhase,
        todayCheckIn,
      );

      if (!isMountedRef.current) return;

      if (isScanError(result)) {
        if (result.type === 'validation_failed') {
          setInvalidReason(result.reason ?? '');
          setStage('invalid');
        } else {
          setStage('failed');
        }
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      const recommendations = generateRecommendations(
        result.scores.stressScore,
        result.scores.energyScore,
        result.scores.recoveryScore,
        result.scores.hydrationLevel,
        result.scores.inflammation,
        t,
      );

      const scanResult = buildScanResult(result.scores, result.rawEyeAnalysis, currentPhase, recommendations);
      addScan(scanResult);

      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setStage('success');

      void incrementScanCount().then(async () => {
        const shouldPrompt = await shouldPromptReview();
        if (shouldPrompt) setTimeout(() => showReviewPrompt(), 2000);
      });

      // After brief success flash, close modal and optionally route
      setTimeout(() => {
        if (!isMountedRef.current) return;
        onClose();
        if (!skipNavigation) {
          if (!todayCheckIn) {
            router.replace('/check-in' as any);
          } else {
            router.replace('/(tabs)/insights' as any);
          }
        }
      }, 800);

    } catch (err) {
      // "Camera unmounted during taking photo process" is a benign race —
      // user closed the modal mid-capture. Don't surface it as a red error.
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('Camera unmounted')) {
        logger.log('[QuickScan] Capture aborted — modal closed');
      } else {
        logger.error('[QuickScan] Error:', err);
      }
      if (isMountedRef.current) setStage('failed');
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      isProcessingRef.current = false;
    }
  }, [currentPhase, todayCheckIn, addScan, onClose, t, skipNavigation]);

  // ── Permission not granted ────────────────────────────────────────────────

  if (!permission?.granted) {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
        <View style={[styles.root, { backgroundColor: colors.background }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <Eye size={48} color={colors.primary} style={{ marginBottom: 16 }} />
          <Text style={[styles.heading, { color: colors.text }]}>
            {t?.scan?.cameraAccessRequired ?? 'Camera Access Needed'}
          </Text>
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            {t?.scan?.cameraAccessMessage ?? 'IRIS needs camera access to scan your eye.'}
          </Text>
          <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={requestPermission}>
            <Text style={styles.btnText}>{t?.scan?.grantPermission ?? 'Enable Camera'}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <View style={styles.root}>
        {/* Camera feed — always mounted to prevent "Camera unmounted during
            taking photo process" errors if the user closes the modal or
            stage changes while takePictureAsync is still in flight. */}
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={'front' as CameraType}
        />

        {/* Dark overlay */}
        <View style={styles.overlay} />

        {/* Close button */}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <X size={24} color="#fff" />
        </TouchableOpacity>

        {/* Eye oval guide */}
        <Animated.View style={[styles.ovalGuide, { opacity: ovalOpacity, borderColor: colors.primary }]} />

        {/* Stage-specific content */}
        {stage === 'preview' && (
          <View style={styles.bottomPanel}>
            <Text style={styles.instructionText}>
              {t?.scan?.positionEyes ?? 'Position your eye in the oval'}
            </Text>
            <TouchableOpacity
              style={[styles.scanBtn, { backgroundColor: colors.primary }]}
              onPress={startCountdown}
            >
              <Eye size={22} color="#fff" />
              <Text style={styles.scanBtnText}>{t?.scan?.startScan ?? 'Scan Now'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {stage === 'countdown' && (
          <View style={styles.bottomPanel}>
            <Text style={styles.countdownText}>{countdown}</Text>
            <Text style={styles.instructionText}>
              {t?.scan?.positionEyes ?? 'Hold steady…'}
            </Text>
          </View>
        )}

        {stage === 'analyzing' && (
          <View style={styles.bottomPanel}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <ActivityIndicator size="large" color={colors.primary} />
            </Animated.View>
            <Text style={styles.instructionText}>
              {t?.scan?.scanning ?? 'Analyzing…'}
            </Text>
          </View>
        )}

        {stage === 'success' && (
          <View style={styles.bottomPanel}>
            <CheckCircle size={48} color={colors.statusGood} />
            <Text style={[styles.instructionText, { color: colors.statusGood }]}>
              {t?.scanResult?.scanComplete ?? 'Scan complete!'}
            </Text>
          </View>
        )}

        {(stage === 'failed' || stage === 'invalid') && (
          <View style={styles.bottomPanel}>
            <AlertTriangle size={40} color={colors.stressHigh} />
            <Text style={[styles.instructionText, { color: '#fff' }]}>
              {stage === 'invalid' ? invalidReason : (t?.scan?.tryAgain ?? 'Scan failed. Try again.')}
            </Text>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: colors.primary }]}
              onPress={() => { setStage('preview'); setCountdown(2); }}
            >
              <Text style={styles.btnText}>{t?.scan?.tryAgain ?? 'Try Again'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: '#000',
      alignItems: 'center',
      justifyContent: 'center',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.35)',
    },
    closeBtn: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? 56 : 40,
      right: 20,
      zIndex: 10,
      padding: 8,
      borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    ovalGuide: {
      width: 200,
      height: 260,
      borderRadius: 100,
      borderWidth: 2.5,
      position: 'absolute',
      top: '20%',
    },
    bottomPanel: {
      position: 'absolute',
      bottom: 60,
      left: 0,
      right: 0,
      alignItems: 'center',
      gap: 16,
      paddingHorizontal: 32,
    },
    instructionText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '500',
      textAlign: 'center',
      textShadowColor: 'rgba(0,0,0,0.5)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
    },
    countdownText: {
      color: '#fff',
      fontSize: 72,
      fontWeight: '700',
      textShadowColor: 'rgba(0,0,0,0.6)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 8,
    },
    scanBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 32,
      paddingVertical: 14,
      borderRadius: 32,
    },
    scanBtnText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    btn: {
      paddingHorizontal: 32,
      paddingVertical: 14,
      borderRadius: 32,
    },
    btnText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    heading: {
      fontSize: 20,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 8,
    },
    body: {
      fontSize: 15,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 24,
      paddingHorizontal: 24,
    },
  });
}

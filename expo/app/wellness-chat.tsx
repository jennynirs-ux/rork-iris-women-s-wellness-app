/**
 * AI Wellness Companion Chat
 *
 * A rule-based "smart FAQ bot" that uses the user's cycle data, scan scores,
 * check-in data, and historical patterns to generate personalised wellness
 * responses.  NOT a real AI — just a carefully crafted response engine.
 *
 * Features:
 *   - Chat-style UI with message bubbles
 *   - Quick-reply chips for common questions
 *   - Responses personalised to cycle phase, scan scores, check-in data
 *   - Messages persist across sessions via AsyncStorage
 *   - Phase-colored assistant avatar
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Send,
  ArrowLeft,
  Sparkles,
  Zap,
  Coffee,
  Moon,
  Heart,
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';
import Colors from '@/constants/colors';
import { chatTranslations } from '@/constants/chatTranslations';
import logger from '@/lib/logger';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'iris_chat_messages';
const MAX_MESSAGES = 200;

const PHASE_COLORS: Record<string, string> = {
  menstrual: '#E89BA4',
  follicular: '#8BC9A3',
  ovulation: '#F4C896',
  luteal: '#B8A4E8',
};

interface QuickReply {
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  query: string;
}

function getQuickReplies(ct: (key: string) => string): QuickReply[] {
  return [
    { label: ct('quickTired'), icon: Zap, query: ct('quickTired') },
    { label: ct('quickEat'), icon: Coffee, query: ct('quickEat') },
    { label: ct('quickStress'), icon: Heart, query: ct('quickStress') },
    { label: ct('quickSleep'), icon: Moon, query: ct('quickSleep') },
    { label: ct('quickCramps'), icon: Heart, query: ct('quickCramps') },
    { label: ct('quickFocus'), icon: Sparkles, query: ct('quickFocus') },
  ];
}

// ---------------------------------------------------------------------------
// Response engine
// ---------------------------------------------------------------------------

function generateResponse(
  query: string,
  phase: string,
  enrichedPhaseInfo: any,
  latestScan: any,
  todayCheckIn: any,
  scans: any[],
  checkIns: any[],
  ct: (key: string, params?: Record<string, string | number>) => string,
): string {
  const lowerQuery = query.toLowerCase();
  const cycleDay = enrichedPhaseInfo?.cycleDay ?? '?';
  const totalDays = enrichedPhaseInfo?.totalCycleDays ?? '?';
  const phaseKey = `phase${phase.charAt(0).toUpperCase() + phase.slice(1)}`;
  const phaseName = ct(phaseKey);

  // Multilingual keyword matching — checks both English fallback and current language keywords
  const matchesTopic = (topic: string): boolean => {
    const keywords = ct(`kw.${topic}`).split('|');
    return keywords.some((kw) => lowerQuery.includes(kw.toLowerCase()));
  };

  // Helper: compute rolling average for a scan field
  const scanAvg = (field: string, fallback: number = 5): number => {
    if (scans.length === 0) return fallback;
    const recent = scans.slice(-14);
    const sum = recent.reduce((s: number, scan: any) => s + ((scan as any)[field] ?? fallback), 0);
    return Math.round((sum / recent.length) * 10) / 10;
  };

  const energy = latestScan?.energyScore ?? todayCheckIn?.energy ?? null;
  const stress = latestScan?.stressScore ?? null;
  const recovery = latestScan?.recoveryScore ?? null;
  const hydration = latestScan?.hydrationLevel ?? null;
  const inflammation = latestScan?.inflammation ?? null;
  const fatigue = latestScan?.fatigueLevel ?? null;
  const sleepHours = todayCheckIn?.sleepHours ?? todayCheckIn?.sleep ?? null;
  const mood = todayCheckIn?.mood ?? null;

  // --- TIRED / ENERGY ---
  if (matchesTopic('energy')) {
    const avgEnergy = scanAvg('energyScore', 5);
    let response = ct('energyIntro', { cycleDay, phaseName });

    if (energy !== null) {
      response += ct('energyScoreToday', { energy });
      if (avgEnergy) {
        if (energy < avgEnergy) {
          response += ct('energyLower', { avg: avgEnergy });
        } else if (energy > avgEnergy) {
          response += ct('energyHigher', { avg: avgEnergy });
        } else {
          response += ct('energySame', { avg: avgEnergy });
        }
      } else {
        response += '.';
      }
    }

    if (phase === 'luteal') {
      response += ct('energyLuteal');
    } else if (phase === 'menstrual') {
      response += ct('energyMenstrual');
    } else if (phase === 'follicular') {
      response += ct('energyFollicular');
    } else {
      response += ct('energyOvulation');
    }

    if (fatigue !== null && fatigue > 7) {
      response += ct('energyHighFatigue');
    }

    return response;
  }

  // --- FOOD / NUTRITION ---
  if (matchesTopic('food')) {
    let response = ct('foodIntro', { phaseName });

    if (phase === 'luteal') {
      response += ct('foodLuteal');
      if (inflammation !== null && inflammation > 5) {
        response += ct('foodInflammation');
      }
    } else if (phase === 'menstrual') {
      response += ct('foodMenstrual');
    } else if (phase === 'follicular') {
      response += ct('foodFollicular');
    } else {
      response += ct('foodOvulation');
    }

    if (hydration !== null && hydration < 6) {
      response += ct('foodLowHydration');
    }

    return response;
  }

  // --- STRESS ---
  if (matchesTopic('stress')) {
    const avgStress = scanAvg('stressScore', 5);
    let response = ct('stressIntro', { phaseName, cycleDay });

    if (stress !== null) {
      response += ct('stressScoreToday', { stress });
      if (avgStress) {
        response += ct('stressAvg', { avg: avgStress });
      } else {
        response += '.';
      }

      if (stress > 7) {
        response += ct('stressHigh');
      } else if (stress > 5) {
        response += ct('stressModerate');
      } else {
        response += ct('stressLow');
      }
    } else {
      response += ct('stressNoScan');
    }

    if (phase === 'luteal') {
      response += ct('stressLutealNote');
    }

    return response;
  }

  // --- SLEEP ---
  if (matchesTopic('sleep')) {
    let response = '';

    if (sleepHours !== null) {
      response += ct('sleepLogged', { hours: sleepHours });
      if (sleepHours < 6) {
        response += ct('sleepLow');
      } else if (sleepHours < 7) {
        response += ct('sleepSlightlyLow');
      } else {
        response += ct('sleepGood');
      }
    }

    if (phase === 'luteal') {
      response += ct('sleepLuteal');
    } else if (phase === 'menstrual') {
      response += ct('sleepMenstrual');
    } else if (phase === 'follicular') {
      response += ct('sleepFollicular');
    } else {
      response += ct('sleepOvulation');
    }

    if (recovery !== null && recovery < 5) {
      response += ct('sleepLowRecovery');
    }

    return response;
  }

  // --- MOOD ---
  if (matchesTopic('mood')) {
    let response = ct('moodIntro', { phaseName });

    if (mood !== null) {
      response += ct('moodScoreToday', { mood });
      if (mood < 4) {
        response += ct('moodLow');
      }
    }

    if (phase === 'luteal') {
      response += ct('moodLuteal');
    } else if (phase === 'menstrual') {
      response += ct('moodMenstrual');
    } else if (phase === 'follicular') {
      response += ct('moodFollicular');
    } else {
      response += ct('moodOvulation');
    }

    return response;
  }

  // --- EXERCISE / WORKOUT ---
  if (matchesTopic('exercise')) {
    let response = ct('exerciseIntro', { phaseName, cycleDay });

    if (phase === 'menstrual') {
      response += ct('exerciseMenstrual');
    } else if (phase === 'follicular') {
      response += ct('exerciseFollicular');
    } else if (phase === 'ovulation') {
      response += ct('exerciseOvulation');
    } else {
      response += ct('exerciseLuteal');
    }

    if (energy !== null && energy < 4) {
      response += ct('exerciseLowEnergy');
    }

    return response;
  }

  // --- SKIN ---
  if (matchesTopic('skin')) {
    let response = ct('skinIntro', { phaseName });

    if (phase === 'luteal') {
      response += ct('skinLuteal');
    } else if (phase === 'menstrual') {
      response += ct('skinMenstrual');
    } else if (phase === 'follicular') {
      response += ct('skinFollicular');
    } else {
      response += ct('skinOvulation');
    }

    return response;
  }

  // --- HYDRATION ---
  if (matchesTopic('hydration')) {
    let response = ct('hydrationIntro', { phaseName });

    if (hydration !== null) {
      if (hydration < 4) {
        response += ct('hydrationVeryLow', { hydration });
      } else if (hydration < 6) {
        response += ct('hydrationLow', { hydration });
      } else {
        response += ct('hydrationGood', { hydration });
      }
    }

    if (phase === 'menstrual') {
      response += ct('hydrationMenstrual');
    } else if (phase === 'ovulation') {
      response += ct('hydrationOvulation');
    } else if (phase === 'luteal') {
      response += ct('hydrationLuteal');
    } else {
      response += ct('hydrationFollicular');
    }

    return response;
  }

  // --- CRAMPS / PAIN ---
  if (matchesTopic('cramps')) {
    let response = ct('crampsIntro', { phaseName, cycleDay });

    if (phase === 'menstrual') {
      response += ct('crampsMenstrual');
    } else if (phase === 'luteal') {
      response += ct('crampsLuteal');
    } else if (phase === 'ovulation') {
      response += ct('crampsOvulation');
    } else {
      response += ct('crampsFollicular');
    }

    return response;
  }

  // --- LIBIDO / INTIMACY ---
  if (matchesTopic('libido')) {
    let response = ct('libidoIntro', { phaseName });

    if (phase === 'ovulation') {
      response += ct('libidoOvulation');
    } else if (phase === 'follicular') {
      response += ct('libidoFollicular');
    } else if (phase === 'luteal') {
      response += ct('libidoLuteal');
    } else {
      response += ct('libidoMenstrual');
    }

    return response;
  }

  // --- SUPPLEMENTS / VITAMINS ---
  if (matchesTopic('supplements')) {
    let response = ct('supplementsIntro', { phaseName });

    if (phase === 'menstrual') {
      response += ct('supplementsMenstrual');
    } else if (phase === 'follicular') {
      response += ct('supplementsFollicular');
    } else if (phase === 'ovulation') {
      response += ct('supplementsOvulation');
    } else {
      response += ct('supplementsLuteal');
    }

    return response;
  }

  // --- FOCUS / PRODUCTIVITY ---
  if (matchesTopic('focus')) {
    let response = ct('focusIntro', { phaseName, cycleDay });

    if (phase === 'follicular') {
      response += ct('focusFollicular');
    } else if (phase === 'ovulation') {
      response += ct('focusOvulation');
    } else if (phase === 'luteal') {
      response += ct('focusLuteal');
    } else {
      response += ct('focusMenstrual');
    }

    if (energy !== null && energy < 4) {
      response += ct('focusLowEnergy');
    }

    return response;
  }

  // --- CYCLE / PERIOD ---
  if (matchesTopic('cycle')) {
    let response = ct('cycleIntro', { phaseName, cycleDay, totalDays });

    if (phase === 'menstrual') {
      response += ct('cycleMenstrual');
    } else if (phase === 'follicular') {
      response += ct('cycleFollicular');
    } else if (phase === 'ovulation') {
      response += ct('cycleOvulation');
    } else {
      response += ct('cycleLuteal');
    }

    return response;
  }

  // --- CATCH-ALL ---
  let fallback = ct('fallbackIntro', { phaseName, cycleDay, totalDays });

  if (latestScan) {
    fallback += ct('fallbackScan', {
      energy: latestScan.energyScore,
      stress: latestScan.stressScore,
      recovery: latestScan.recoveryScore,
    });
  }

  fallback += ct('fallbackSuggestions');

  return fallback;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function WellnessChatScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { currentPhase, enrichedPhaseInfo, latestScan, todayCheckIn, scans, checkIns, language } = useApp();

  const ctMap = chatTranslations[language ?? 'en'] ?? chatTranslations.en;
  const ct = useCallback((key: string, params?: Record<string, string | number>): string => {
    let value = ctMap[key] ?? key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value.replace(`{${k}}`, String(v));
      });
    }
    return value;
  }, [ctMap]);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const phaseColor = PHASE_COLORS[currentPhase] || colors.primary;
  const quickReplies = useMemo(() => getQuickReplies(ct), [ct]);

  // Load persisted messages
  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as ChatMessage[];
          setMessages(parsed);
        } else {
          // Welcome message
          setMessages([
            {
              id: 'welcome',
              role: 'assistant',
              text: ct('welcomeMessage'),
              timestamp: Date.now(),
            },
          ]);
        }
      } catch (e) {
        logger.error('[Chat] Failed to load messages:', e);
      }
    };
    load();
  }, []);

  // Persist messages whenever they change
  useEffect(() => {
    if (messages.length === 0) return;
    const save = async () => {
      try {
        // Keep only the latest N messages to avoid storage bloat
        const toSave = messages.slice(-MAX_MESSAGES);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      } catch (e) {
        logger.error('[Chat] Failed to save messages:', e);
      }
    };
    save();
  }, [messages]);

  const handleSend = useCallback(
    (text?: string) => {
      const msg = (text || inputText).trim();
      if (!msg) return;

      const userMessage: ChatMessage = {
        id: Date.now().toString() + '_user',
        role: 'user',
        text: msg,
        timestamp: Date.now(),
      };

      // Generate response
      const responseText = generateResponse(
        msg,
        currentPhase,
        enrichedPhaseInfo,
        latestScan,
        todayCheckIn,
        scans,
        checkIns,
        ct,
      );

      const assistantMessage: ChatMessage = {
        id: Date.now().toString() + '_assistant',
        role: 'assistant',
        text: responseText,
        timestamp: Date.now() + 1,
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setInputText('');

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    },
    [inputText, currentPhase, enrichedPhaseInfo, latestScan, todayCheckIn, scans, checkIns, ct],
  );

  const renderMessage = useCallback(
    ({ item }: { item: ChatMessage }) => {
      const isUser = item.role === 'user';
      return (
        <View style={[styles.messageBubbleRow, isUser && styles.messageBubbleRowUser]}>
          {!isUser && (
            <View style={[styles.avatar, { backgroundColor: phaseColor + '30' }]}>
              <Sparkles size={16} color={phaseColor} />
            </View>
          )}
          <View
            style={[
              styles.messageBubble,
              isUser ? styles.messageBubbleUser : styles.messageBubbleAssistant,
              !isUser && { borderColor: phaseColor + '30' },
            ]}
          >
            <Text style={[styles.messageText, isUser && styles.messageTextUser]}>
              {item.text}
            </Text>
            <Text style={[styles.messageTime, isUser && styles.messageTimeUser]}>
              {new Date(item.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>
      );
    },
    [styles, phaseColor],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={[styles.headerAvatar, { backgroundColor: phaseColor + '30' }]}>
          <Sparkles size={18} color={phaseColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{ct('headerTitle')}</Text>
          <Text style={styles.headerSubtitle}>
            {ct('headerSubtitle', {
              phaseName: enrichedPhaseInfo?.phaseName || currentPhase,
              cycleDay: enrichedPhaseInfo?.cycleDay ?? '?',
            })}
          </Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => {
          flatListRef.current?.scrollToEnd({ animated: false });
        }}
      />

      {/* Quick replies */}
      <View style={styles.quickRepliesContainer}>
        {quickReplies.map((qr) => (
          <TouchableOpacity
            key={qr.query}
            style={[styles.quickReplyChip, { borderColor: phaseColor + '50' }]}
            onPress={() => handleSend(qr.query)}
            activeOpacity={0.7}
          >
            <qr.icon size={14} color={phaseColor} />
            <Text style={[styles.quickReplyText, { color: phaseColor }]}>{qr.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder={ct('inputPlaceholder')}
            placeholderTextColor={colors.textTertiary}
            multiline
            maxLength={500}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
            blurOnSubmit
          />
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: phaseColor }]}
            onPress={() => handleSend()}
            disabled={!inputText.trim()}
            accessibilityLabel="Send message"
            accessibilityRole="button"
          >
            <Send size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

function createStyles(colors: typeof Colors.light) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: 12,
    },
    backButton: {
      padding: 4,
    },
    headerAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.text,
    },
    headerSubtitle: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 1,
    },
    messagesList: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
    },
    messageBubbleRow: {
      flexDirection: 'row',
      marginBottom: 12,
      alignItems: 'flex-end',
      gap: 8,
    },
    messageBubbleRowUser: {
      flexDirection: 'row-reverse',
    },
    avatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
    },
    messageBubble: {
      maxWidth: '78%',
      borderRadius: 18,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    messageBubbleAssistant: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderTopLeftRadius: 4,
    },
    messageBubbleUser: {
      backgroundColor: colors.primary,
      borderTopRightRadius: 4,
    },
    messageText: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.text,
    },
    messageTextUser: {
      color: '#FFFFFF',
    },
    messageTime: {
      fontSize: 11,
      color: colors.textTertiary,
      marginTop: 4,
      alignSelf: 'flex-end',
    },
    messageTimeUser: {
      color: 'rgba(255,255,255,0.7)',
    },
    quickRepliesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 16,
      paddingVertical: 8,
      gap: 8,
    },
    quickReplyChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1.5,
      backgroundColor: colors.card,
    },
    quickReplyText: {
      fontSize: 13,
      fontWeight: '600',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: 10,
    },
    input: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 10,
      fontSize: 15,
      color: colors.text,
      maxHeight: 100,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sendButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}

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

const PHASE_NAMES: Record<string, string> = {
  menstrual: 'menstrual',
  follicular: 'follicular',
  ovulation: 'ovulation',
  luteal: 'luteal',
};

interface QuickReply {
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  query: string;
}

const QUICK_REPLIES: QuickReply[] = [
  { label: 'Why am I tired?', icon: Zap, query: 'Why am I tired?' },
  { label: 'What should I eat?', icon: Coffee, query: 'What should I eat?' },
  { label: "How's my stress?", icon: Heart, query: "How's my stress?" },
  { label: 'Sleep tips', icon: Moon, query: 'Sleep tips' },
];

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
): string {
  const lowerQuery = query.toLowerCase();
  const cycleDay = enrichedPhaseInfo?.cycleDay ?? '?';
  const totalDays = enrichedPhaseInfo?.totalCycleDays ?? '?';
  const phaseName = PHASE_NAMES[phase] || phase;

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
  if (lowerQuery.includes('tired') || lowerQuery.includes('energy') || lowerQuery.includes('fatigue') || lowerQuery.includes('exhausted')) {
    const avgEnergy = scanAvg('energyScore', 5);
    let response = `You're on day ${cycleDay} of your cycle (${phaseName} phase).`;

    if (energy !== null) {
      response += ` Your energy score today is ${energy}/10`;
      if (avgEnergy) {
        response += `, which is ${energy < avgEnergy ? 'lower' : energy > avgEnergy ? 'higher' : 'about the same as'} than your average of ${avgEnergy}.`;
      } else {
        response += '.';
      }
    }

    if (phase === 'luteal') {
      response += ' Many people experience lower energy in the luteal phase. Consider gentle movement like walking or yoga, and try going to bed 30 minutes earlier tonight.';
    } else if (phase === 'menstrual') {
      response += ' During menstruation, your body is using extra energy. Prioritize rest, iron-rich foods like leafy greens, and stay well-hydrated.';
    } else if (phase === 'follicular') {
      response += ' The follicular phase usually brings rising energy. If you are still feeling tired, check your sleep quality and hydration levels.';
    } else {
      response += ' During ovulation, energy is typically at its peak. If you are feeling tired, it may be worth checking your sleep and stress levels.';
    }

    if (fatigue !== null && fatigue > 7) {
      response += ' Your fatigue indicator is elevated today — consider a short power nap or a light stretching session.';
    }

    return response;
  }

  // --- FOOD / NUTRITION ---
  if (lowerQuery.includes('eat') || lowerQuery.includes('food') || lowerQuery.includes('nutrition') || lowerQuery.includes('diet')) {
    let response = `During the ${phaseName} phase, `;

    if (phase === 'luteal') {
      response += 'your body may benefit from complex carbs, magnesium-rich foods (dark chocolate, nuts), and anti-inflammatory choices.';
      if (inflammation !== null && inflammation > 5) {
        response += ' Your inflammation score is slightly higher today — consider adding turmeric or ginger to your meals.';
      }
    } else if (phase === 'menstrual') {
      response += 'focus on iron-rich foods (spinach, lentils, red meat), warming soups, and anti-inflammatory options. Dark chocolate and magnesium-rich foods can also help with cramps.';
    } else if (phase === 'follicular') {
      response += 'your metabolism is picking up. Lean proteins, fresh vegetables, and fermented foods support rising estrogen. This is a great time to experiment with new recipes.';
    } else {
      response += 'energy is high and your body handles carbs well. Focus on fiber-rich foods, healthy fats, and plenty of antioxidant-rich fruits and vegetables.';
    }

    if (hydration !== null && hydration < 6) {
      response += ' Your hydration level is lower than ideal — aim for at least 8 glasses of water today.';
    }

    return response;
  }

  // --- STRESS ---
  if (lowerQuery.includes('stress') || lowerQuery.includes('anxious') || lowerQuery.includes('anxiety') || lowerQuery.includes('overwhelm')) {
    const avgStress = scanAvg('stressScore', 5);
    let response = `You're in the ${phaseName} phase (day ${cycleDay}).`;

    if (stress !== null) {
      response += ` Your stress score today is ${stress}/10`;
      if (avgStress) {
        response += ` (your average is ${avgStress}).`;
      } else {
        response += '.';
      }

      if (stress > 7) {
        response += ' Your stress level is notably elevated. Try a 5-minute box breathing exercise: breathe in for 4 counts, hold 4, out 4, hold 4. Repeat 5 times.';
      } else if (stress > 5) {
        response += ' Your stress is moderate. A short walk outside, some deep breathing, or even a few minutes of journaling could help bring it down.';
      } else {
        response += ' Your stress level looks well-managed today. Keep it up with whatever routine is working for you.';
      }
    } else {
      response += ' Complete a scan today to get personalized stress insights. In the meantime, try 5 minutes of deep breathing or a short walk.';
    }

    if (phase === 'luteal') {
      response += ' The luteal phase can amplify stress sensitivity — be extra kind to yourself this week.';
    }

    return response;
  }

  // --- SLEEP ---
  if (lowerQuery.includes('sleep') || lowerQuery.includes('insomnia') || lowerQuery.includes('rest')) {
    let response = '';

    if (sleepHours !== null) {
      response += `Based on your check-in, you logged ${sleepHours} hours of sleep. `;
      if (sleepHours < 6) {
        response += 'That is below the recommended 7-9 hours. ';
      } else if (sleepHours < 7) {
        response += 'That is slightly under the optimal range. ';
      } else {
        response += 'That is within a healthy range. ';
      }
    }

    if (phase === 'luteal') {
      response += 'During the luteal phase, progesterone rises which can make you feel sleepier but paradoxically disrupt deep sleep. Try magnesium before bed (200-400mg), avoid screens 1 hour before sleep, and keep your room cool (around 65-68F / 18-20C).';
    } else if (phase === 'menstrual') {
      response += 'Menstruation can affect sleep quality. A warm bath before bed, chamomile tea, and gentle stretching can help. Consider a heating pad if cramps are disrupting your rest.';
    } else if (phase === 'follicular') {
      response += 'Rising estrogen in the follicular phase generally supports better sleep. Use this time to establish good sleep habits: consistent bedtime, no caffeine after 2pm, and a dark, cool room.';
    } else {
      response += 'Around ovulation, body temperature rises slightly which can affect sleep. Keep your bedroom extra cool and consider light bedding. This is a good time to wind down with a calming routine.';
    }

    if (recovery !== null && recovery < 5) {
      response += ' Your recovery score is low — prioritizing sleep tonight will help your body restore.';
    }

    return response;
  }

  // --- MOOD ---
  if (lowerQuery.includes('mood') || lowerQuery.includes('sad') || lowerQuery.includes('happy') || lowerQuery.includes('emotional')) {
    let response = `You're in the ${phaseName} phase. `;

    if (mood !== null) {
      response += `Your mood today is ${mood}/10. `;
      if (mood < 4) {
        response += 'That is lower than ideal. ';
      }
    }

    if (phase === 'luteal') {
      response += 'The luteal phase can bring mood fluctuations due to shifting progesterone levels. Journaling, light exercise, and connecting with someone you trust can help stabilize your emotions.';
    } else if (phase === 'menstrual') {
      response += 'Hormones are at their lowest during menstruation, which can affect mood. Be gentle with yourself — self-care, rest, and comfort foods (in moderation) are all appropriate right now.';
    } else if (phase === 'follicular') {
      response += 'Rising estrogen typically brings improved mood and motivation. This is a great time for social activities, creative projects, and trying new things.';
    } else {
      response += 'Ovulation often brings a mood peak thanks to high estrogen and a surge in LH. Enjoy this social, confident energy while it lasts.';
    }

    return response;
  }

  // --- EXERCISE / WORKOUT ---
  if (lowerQuery.includes('exercise') || lowerQuery.includes('workout') || lowerQuery.includes('movement') || lowerQuery.includes('gym')) {
    let response = `For the ${phaseName} phase (day ${cycleDay}), `;

    if (phase === 'menstrual') {
      response += 'gentle movement like walking, yoga, or light stretching is recommended. Your body is recovering, so avoid pushing too hard.';
    } else if (phase === 'follicular') {
      response += 'your body is primed for strength gains. Try resistance training, HIIT, or learning new athletic skills. Energy and coordination are improving.';
    } else if (phase === 'ovulation') {
      response += 'this is your peak performance window. Go for personal records, high-intensity workouts, or challenging group classes. Your body can handle more right now.';
    } else {
      response += 'focus on moderate-intensity exercise. Pilates, moderate cardio, and yoga are great choices. As the phase progresses, transition to lighter activities.';
    }

    if (energy !== null && energy < 4) {
      response += ' However, your energy is quite low today — it is fine to do something gentle or take a rest day.';
    }

    return response;
  }

  // --- SKIN ---
  if (lowerQuery.includes('skin') || lowerQuery.includes('acne') || lowerQuery.includes('glow') || lowerQuery.includes('breakout')) {
    let response = `During the ${phaseName} phase, `;

    if (phase === 'luteal') {
      response += 'rising progesterone increases oil production and can trigger breakouts. Use gentle, non-comedogenic products, salicylic acid for blemishes, and niacinamide for oil control.';
    } else if (phase === 'menstrual') {
      response += 'skin may be sensitive and dry. Use hydrating, gentle products and avoid harsh exfoliants. Focus on soothing ingredients like aloe and centella.';
    } else if (phase === 'follicular') {
      response += 'estrogen is rising and skin typically looks clearer. This is a great time for exfoliation, vitamin C serums, and trying new active ingredients.';
    } else {
      response += 'you are likely at your most radiant. Estrogen peaks create a natural glow. Keep your routine simple and enjoy it.';
    }

    return response;
  }

  // --- CATCH-ALL ---
  let fallback = `I can help with questions about your energy, nutrition, stress, sleep, mood, exercise, and skin care — all personalized to your ${phaseName} phase (day ${cycleDay} of ${totalDays}).`;

  if (latestScan) {
    fallback += `\n\nYour latest scan shows: energy ${latestScan.energyScore}/10, stress ${latestScan.stressScore}/10, recovery ${latestScan.recoveryScore}/10.`;
  }

  fallback += '\n\nTry asking me things like:\n- Why am I tired?\n- What should I eat?\n- How is my stress?\n- Give me sleep tips\n- What workout should I do?\n- How is my skin this week?';

  return fallback;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function WellnessChatScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { currentPhase, enrichedPhaseInfo, latestScan, todayCheckIn, scans, checkIns } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const phaseColor = PHASE_COLORS[currentPhase] || colors.primary;

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
              text: `Hi there! I'm your IRIS wellness companion. I use your cycle, scan, and check-in data to give you personalized wellness guidance. Ask me anything about your energy, nutrition, stress, sleep, or mood.`,
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
    [inputText, currentPhase, enrichedPhaseInfo, latestScan, todayCheckIn, scans, checkIns],
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
          <Text style={styles.headerTitle}>Wellness Companion</Text>
          <Text style={styles.headerSubtitle}>
            {enrichedPhaseInfo?.phaseName || currentPhase} phase · Day {enrichedPhaseInfo?.cycleDay ?? '?'}
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
        {QUICK_REPLIES.map((qr) => (
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
            placeholder="Ask about your wellness..."
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

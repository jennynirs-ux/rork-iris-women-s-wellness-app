import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import {
  ChevronLeft,
  BookOpen,
  Save,
  Check,
  Trash2,
  PenLine,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useApp } from "@/contexts/AppContext";
import { CyclePhase } from "@/types";
import { journalTranslationsEN } from "@/constants/journalTranslations";
import ErrorBoundary from "@/components/ErrorBoundary";

const JOURNAL_STORAGE_PREFIX = "iris_journal_";
const JOURNAL_INDEX_KEY = "iris_journal_index";

interface JournalEntry {
  date: string;
  text: string;
  timestamp: number;
}

function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function getPromptForPhase(phase: CyclePhase): string {
  const jt = journalTranslationsEN;
  switch (phase) {
    case "menstrual":
      return jt.promptMenstrual;
    case "follicular":
      return jt.promptFollicular;
    case "ovulation":
      return jt.promptOvulation;
    case "luteal":
      return jt.promptLuteal;
    default:
      return jt.placeholder;
  }
}

function JournalScreenInner() {
  const router = useRouter();
  const { colors } = useTheme();
  const { enrichedPhaseInfo } = useApp();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const jt = journalTranslationsEN;

  const todayDate = useMemo(() => getLocalDateString(), []);
  const [text, setText] = useState("");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoadingEntries, setIsLoadingEntries] = useState(true);

  const prompt = useMemo(
    () => getPromptForPhase(enrichedPhaseInfo?.phase ?? "follicular"),
    [enrichedPhaseInfo?.phase]
  );

  useEffect(() => {
    loadAllEntries();
    loadTodayEntry();
  }, []);

  const loadTodayEntry = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(`${JOURNAL_STORAGE_PREFIX}${todayDate}`);
      if (raw) {
        const entry: JournalEntry = JSON.parse(raw);
        setText(entry.text);
      }
    } catch {
      // Silently fail
    }
  }, [todayDate]);

  const loadAllEntries = useCallback(async () => {
    try {
      const indexRaw = await AsyncStorage.getItem(JOURNAL_INDEX_KEY);
      const dates: string[] = indexRaw ? JSON.parse(indexRaw) : [];

      const loaded: JournalEntry[] = [];
      for (const date of dates) {
        const raw = await AsyncStorage.getItem(`${JOURNAL_STORAGE_PREFIX}${date}`);
        if (raw) {
          loaded.push(JSON.parse(raw));
        }
      }

      // Sort by date descending (most recent first)
      loaded.sort((a, b) => b.timestamp - a.timestamp);
      setEntries(loaded);
    } catch {
      // Silently fail
    } finally {
      setIsLoadingEntries(false);
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!text.trim()) return;

    try {
      const entry: JournalEntry = {
        date: todayDate,
        text: text.trim(),
        timestamp: Date.now(),
      };

      await AsyncStorage.setItem(
        `${JOURNAL_STORAGE_PREFIX}${todayDate}`,
        JSON.stringify(entry)
      );

      // Update index
      const indexRaw = await AsyncStorage.getItem(JOURNAL_INDEX_KEY);
      const dates: string[] = indexRaw ? JSON.parse(indexRaw) : [];
      if (!dates.includes(todayDate)) {
        dates.unshift(todayDate);
        await AsyncStorage.setItem(JOURNAL_INDEX_KEY, JSON.stringify(dates));
      }

      setIsSaved(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Refresh entries
      await loadAllEntries();

      // Reset saved indicator after 2 seconds
      setTimeout(() => setIsSaved(false), 2000);
    } catch {
      // Silently fail
    }
  }, [text, todayDate, loadAllEntries]);

  const handleDeleteEntry = useCallback(
    (date: string) => {
      Alert.alert(jt.deleteConfirm, "", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(`${JOURNAL_STORAGE_PREFIX}${date}`);

              // Update index
              const indexRaw = await AsyncStorage.getItem(JOURNAL_INDEX_KEY);
              const dates: string[] = indexRaw ? JSON.parse(indexRaw) : [];
              const filtered = dates.filter((d) => d !== date);
              await AsyncStorage.setItem(
                JOURNAL_INDEX_KEY,
                JSON.stringify(filtered)
              );

              // If deleting today's entry, clear text
              if (date === todayDate) {
                setText("");
              }

              await loadAllEntries();
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Warning
              );
            } catch {
              // Silently fail
            }
          },
        },
      ]);
    },
    [todayDate, loadAllEntries, jt.deleteConfirm]
  );

  const renderEntry = useCallback(
    ({ item }: { item: JournalEntry }) => {
      const isToday = item.date === todayDate;
      const preview =
        item.text.length > 100
          ? item.text.substring(0, 100) + "..."
          : item.text;

      return (
        <View style={styles.entryCard}>
          <View style={styles.entryHeader}>
            <Text style={styles.entryDate}>{formatDisplayDate(item.date)}</Text>
            {!isToday && (
              <TouchableOpacity
                onPress={() => handleDeleteEntry(item.date)}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Trash2 size={16} color={colors.textTertiary} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.entryPreview}>{preview}</Text>
          <Text style={styles.entryCharCount}>
            {item.text.length} {jt.characters}
          </Text>
        </View>
      );
    },
    [styles, colors, todayDate, handleDeleteEntry, jt.characters]
  );

  const keyExtractor = useCallback((item: JournalEntry) => item.date, []);

  const ListHeader = useMemo(
    () => (
      <View>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>{jt.title}</Text>
        </View>

        {/* Today's entry section */}
        <View style={styles.todaySection}>
          <Text style={styles.todayDate}>{formatDisplayDate(todayDate)}</Text>

          {/* Phase-based prompt */}
          <View style={styles.promptContainer}>
            <PenLine size={16} color={colors.primary} />
            <Text style={styles.promptText}>{prompt}</Text>
          </View>

          <TextInput
            style={styles.textInput}
            multiline
            placeholder={jt.placeholder}
            placeholderTextColor={colors.textTertiary}
            value={text}
            onChangeText={(val) => {
              setText(val);
              setIsSaved(false);
            }}
            textAlignVertical="top"
          />

          <View style={styles.inputFooter}>
            <Text style={styles.charCount}>
              {text.length} {jt.characters}
            </Text>
            <TouchableOpacity
              style={[
                styles.saveButton,
                !text.trim() && styles.saveButtonDisabled,
                isSaved && { backgroundColor: colors.success },
              ]}
              onPress={handleSave}
              activeOpacity={0.8}
              disabled={!text.trim()}
            >
              {isSaved ? (
                <>
                  <Check size={16} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>{jt.saved}</Text>
                </>
              ) : (
                <>
                  <Save size={16} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>{jt.save}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Past entries header */}
        {entries.length > 0 && (
          <Text style={styles.pastEntriesTitle}>{jt.entries}</Text>
        )}
      </View>
    ),
    [
      styles,
      colors,
      jt,
      todayDate,
      prompt,
      text,
      isSaved,
      handleSave,
      entries.length,
      router,
    ]
  );

  // Filter out today from the past entries list (today is shown in the editor)
  const pastEntries = useMemo(
    () => entries.filter((e) => e.date !== todayDate),
    [entries, todayDate]
  );

  const ListEmpty = useMemo(
    () =>
      !isLoadingEntries && pastEntries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <BookOpen size={48} color={colors.textTertiary} />
          <Text style={styles.emptyText}>{jt.noEntries}</Text>
        </View>
      ) : null,
    [isLoadingEntries, pastEntries.length, styles, colors, jt.noEntries]
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          data={pastEntries}
          renderItem={renderEntry}
          keyExtractor={keyExtractor}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={ListEmpty}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(colors: typeof Colors.light) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContent: {
      paddingBottom: 40,
    },
    headerContainer: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 8,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginBottom: 12,
    },
    screenTitle: {
      fontSize: 28,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 16,
    },
    todaySection: {
      marginHorizontal: 16,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 24,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    },
    todayDate: {
      fontSize: 15,
      fontWeight: "600" as const,
      color: colors.text,
      marginBottom: 12,
    },
    promptContainer: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      backgroundColor: colors.primaryLight + "40",
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      gap: 8,
      marginBottom: 12,
    },
    promptText: {
      flex: 1,
      fontSize: 13,
      color: colors.primary,
      fontStyle: "italic" as const,
      lineHeight: 18,
    },
    textInput: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 14,
      fontSize: 15,
      color: colors.text,
      lineHeight: 22,
      minHeight: 140,
      maxHeight: 280,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    inputFooter: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      marginTop: 10,
    },
    charCount: {
      fontSize: 12,
      color: colors.textTertiary,
    },
    saveButton: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 16,
      gap: 6,
    },
    saveButtonDisabled: {
      opacity: 0.5,
    },
    saveButtonText: {
      fontSize: 14,
      fontWeight: "600" as const,
      color: "#FFFFFF",
    },
    pastEntriesTitle: {
      fontSize: 18,
      fontWeight: "700" as const,
      color: colors.text,
      marginHorizontal: 16,
      marginBottom: 8,
    },
    entryCard: {
      marginHorizontal: 16,
      marginTop: 8,
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 14,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },
    entryHeader: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      marginBottom: 8,
    },
    entryDate: {
      fontSize: 13,
      fontWeight: "600" as const,
      color: colors.textSecondary,
    },
    entryPreview: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
      marginBottom: 6,
    },
    entryCharCount: {
      fontSize: 11,
      color: colors.textTertiary,
    },
    emptyContainer: {
      alignItems: "center" as const,
      justifyContent: "center" as const,
      paddingVertical: 40,
      gap: 12,
    },
    emptyText: {
      fontSize: 15,
      color: colors.textTertiary,
      textAlign: "center" as const,
      paddingHorizontal: 32,
    },
  });
}

export default function JournalScreen() {
  return (
    <ErrorBoundary>
      <JournalScreenInner />
    </ErrorBoundary>
  );
}

import React, { useState, useMemo, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { translateSymptoms } from "@/lib/symptomTranslation";

import {
  ChevronLeft,
  ChevronRight,
  Moon,
  Sprout,
  Sparkles,
  Flower2,
  Zap,
  Battery,
  Heart,
  Coffee,
  Wine,
  Thermometer,
  Candy,
  Package,
  Droplets,
  AlertCircle,
  Brain,
  Users,
  BarChart3,
  Wind,
  Flame,
  Baby,
  Sun,
  Calendar,
  Clock,
  Edit3,
  RotateCcw,
  ClipboardCheck,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useApp } from "@/contexts/AppContext";
import { CyclePhase, LifeStage } from "@/types";
import { getPhaseForCycleDay } from "@/lib/phasePredictor";

function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const PHASE_INFO = {
  menstrual: { name: "Menstrual", color: "#E89BA4", icon: Moon },
  follicular: { name: "Follicular", color: "#8BC9A3", icon: Sprout },
  ovulation: { name: "Ovulation", color: "#F4C896", icon: Sparkles },
  luteal: { name: "Luteal", color: "#B8A4E8", icon: Flower2 },
};

const LIFE_STAGE_INFO = {
  trimester1: { color: "#F4C8D4", icon: Baby },
  trimester2: { color: "#8BC9A3", icon: Baby },
  trimester3: { color: "#B8A4E8", icon: Baby },
  postpartumRecovery: { color: "#E89BA4", icon: Heart },
  postpartumHealing: { color: "#F4C896", icon: Heart },
  perimenopause: { color: "#F4C896", icon: Sun },
  menopause: { color: "#B8A4E8", icon: Sparkles },
};

type LifeStagePhaseKey = keyof typeof LIFE_STAGE_INFO;

function calculateCyclePhase(lastPeriodDate: string, cycleLength: number, date: Date): CyclePhase {
  const lastPeriod = new Date(lastPeriodDate);
  const daysSinceLastPeriod = Math.floor((date.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
  // Don't clamp to 1 — let getPhaseForCycleDay handle negative days via modulo
  const cycleDay = daysSinceLastPeriod + 1;
  return getPhaseForCycleDay(cycleDay, cycleLength);
}

function getPregnancyStartDate(userProfile: { weeksPregnant?: number; pregnancyDueDate?: string }): Date {
  if (userProfile.pregnancyDueDate) {
    const due = new Date(userProfile.pregnancyDueDate);
    return new Date(due.getTime() - 40 * 7 * 24 * 60 * 60 * 1000);
  }
  if (userProfile.weeksPregnant) {
    return new Date(Date.now() - userProfile.weeksPregnant * 7 * 24 * 60 * 60 * 1000);
  }
  return new Date();
}

function getPregnancyWeekForDate(date: Date, userProfile: { weeksPregnant?: number; pregnancyDueDate?: string }): number {
  const start = getPregnancyStartDate(userProfile);
  const diffMs = date.getTime() - start.getTime();
  const weeks = diffMs / (1000 * 60 * 60 * 24 * 7);
  return Math.max(0, weeks);
}

function getPregnancyPhaseKeyForDate(date: Date, userProfile: { weeksPregnant?: number; pregnancyDueDate?: string }): LifeStagePhaseKey {
  const weeks = getPregnancyWeekForDate(date, userProfile);
  if (weeks <= 13) return "trimester1";
  if (weeks <= 27) return "trimester2";
  return "trimester3";
}

function getPostpartumPhaseKey(userProfile: { birthDate?: string }): LifeStagePhaseKey {
  let weeksPost = 0;
  if (userProfile.birthDate) {
    weeksPost = Math.floor((Date.now() - new Date(userProfile.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 7));
  }
  return weeksPost <= 6 ? "postpartumRecovery" : "postpartumHealing";
}

type TimelinePhase = 
  | { type: 'menstrual'; phase: CyclePhase }
  | { type: 'lifeStage'; key: LifeStagePhaseKey };

function getPregnancyStartFromProfile(userProfile: { weeksPregnant?: number; pregnancyDueDate?: string; birthDate?: string }): Date | null {
  if (userProfile.pregnancyDueDate) {
    const due = new Date(userProfile.pregnancyDueDate);
    return new Date(due.getTime() - 40 * 7 * 24 * 60 * 60 * 1000);
  }
  if (userProfile.weeksPregnant) {
    return new Date(Date.now() - userProfile.weeksPregnant * 7 * 24 * 60 * 60 * 1000);
  }
  return null;
}

function getDueDateFromProfile(userProfile: { weeksPregnant?: number; pregnancyDueDate?: string; birthDate?: string }): Date | null {
  if (userProfile.pregnancyDueDate) return new Date(userProfile.pregnancyDueDate);
  if (userProfile.weeksPregnant) {
    const start = new Date(Date.now() - userProfile.weeksPregnant * 7 * 24 * 60 * 60 * 1000);
    return new Date(start.getTime() + 40 * 7 * 24 * 60 * 60 * 1000);
  }
  return null;
}

function getBirthDateFromProfile(userProfile: { birthDate?: string; pregnancyDueDate?: string }): Date | null {
  if (userProfile.birthDate) return new Date(userProfile.birthDate);
  return null;
}

function getTimelinePhaseForDate(
  date: Date,
  lifeStage: LifeStage,
  userProfile: { weeksPregnant?: number; pregnancyDueDate?: string; birthDate?: string; lastPeriodDate: string; cycleLength: number }
): TimelinePhase {
  if (lifeStage === 'pregnancy') {
    const pregStart = getPregnancyStartFromProfile(userProfile);
    const dueDate = getDueDateFromProfile(userProfile);
    
    if (pregStart && date.getTime() < pregStart.getTime()) {
      const phase = calculateCyclePhase(userProfile.lastPeriodDate, userProfile.cycleLength, date);
      return { type: 'menstrual', phase };
    }
    
    if (dueDate && date.getTime() > dueDate.getTime()) {
      const weeksPost = Math.floor((date.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
      return { type: 'lifeStage', key: weeksPost <= 6 ? 'postpartumRecovery' : 'postpartumHealing' };
    }
    
    const key = getPregnancyPhaseKeyForDate(date, userProfile);
    return { type: 'lifeStage', key };
  }
  
  if (lifeStage === 'postpartum') {
    const birthDate = getBirthDateFromProfile(userProfile);
    const pregStart = birthDate ? new Date(birthDate.getTime() - 40 * 7 * 24 * 60 * 60 * 1000) : null;
    
    if (pregStart && date.getTime() < pregStart.getTime()) {
      const phase = calculateCyclePhase(userProfile.lastPeriodDate, userProfile.cycleLength, date);
      return { type: 'menstrual', phase };
    }
    
    if (birthDate && date.getTime() < birthDate.getTime() && pregStart) {
      const diffMs = date.getTime() - pregStart.getTime();
      const weeks = Math.max(0, diffMs / (1000 * 60 * 60 * 24 * 7));
      if (weeks <= 13) return { type: 'lifeStage', key: 'trimester1' };
      if (weeks <= 27) return { type: 'lifeStage', key: 'trimester2' };
      return { type: 'lifeStage', key: 'trimester3' };
    }
    
    if (birthDate) {
      const weeksPost = Math.floor((date.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
      return { type: 'lifeStage', key: weeksPost <= 6 ? 'postpartumRecovery' : 'postpartumHealing' };
    }
    
    return { type: 'lifeStage', key: getPostpartumPhaseKey(userProfile) };
  }
  
  if (lifeStage === 'perimenopause') return { type: 'lifeStage', key: 'perimenopause' };
  if (lifeStage === 'menopause') return { type: 'lifeStage', key: 'menopause' };
  
  const phase = calculateCyclePhase(userProfile.lastPeriodDate, userProfile.cycleLength, date);
  return { type: 'menstrual', phase };
}

function getLifeStageLabel(key: LifeStagePhaseKey, t: any): string {
  const map: Record<LifeStagePhaseKey, string> = {
    trimester1: t.phases.trimester1,
    trimester2: t.phases.trimester2,
    trimester3: t.phases.trimester3,
    postpartumRecovery: t.phases.postpartumRecovery,
    postpartumHealing: t.phases.postpartumHealing,
    perimenopause: t.phases.perimenopauseTransition,
    menopause: t.phases.menopause,
  };
  return map[key] || key;
}

function getLifeStageLegendKeys(lifeStage: LifeStage): LifeStagePhaseKey[] {
  if (lifeStage === "pregnancy") return ["trimester1", "trimester2", "trimester3"];
  if (lifeStage === "postpartum") return ["postpartumRecovery", "postpartumHealing"];
  if (lifeStage === "perimenopause") return ["perimenopause"];
  if (lifeStage === "menopause") return ["menopause"];
  return [];
}

export default function CalendarScreen() {
  const { scans, checkIns, userProfile, t, effectiveCycleStart, phaseOverrides, setPhaseOverride } = useApp();
  const { colors } = useTheme();
  const isRegularCycle = userProfile.lifeStage === "regular";
  const isPregnancy = userProfile.lifeStage === "pregnancy";

  const styles = useMemo(() => createCalendarStyles(colors), [colors]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const pregnancyInfo = useMemo(() => {
    if (!isPregnancy) return null;
    const now = new Date();
    const currentWeek = Math.floor(getPregnancyWeekForDate(now, userProfile));
    const dueDate = userProfile.pregnancyDueDate ? new Date(userProfile.pregnancyDueDate) : null;
    const daysLeft = dueDate ? Math.max(0, Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : null;
    const progressPct = Math.min(100, (currentWeek / 40) * 100);
    const isPastDue = dueDate ? now.getTime() > dueDate.getTime() : false;
    const currentTrimester = currentWeek <= 13 ? 1 : currentWeek <= 27 ? 2 : 3;
    return { currentWeek: Math.min(currentWeek, 42), dueDate, daysLeft, progressPct, isPastDue, currentTrimester };
  }, [isPregnancy, userProfile]);

  const dueDateStr = useMemo(() => {
    if (!isPregnancy || !userProfile.pregnancyDueDate) return null;
    const due = new Date(userProfile.pregnancyDueDate);
    return getLocalDateString(due);
  }, [isPregnancy, userProfile.pregnancyDueDate]);

  const isCurrentMonth = useMemo(() => {
    const now = new Date();
    return selectedMonth.getMonth() === now.getMonth() && selectedMonth.getFullYear() === now.getFullYear();
  }, [selectedMonth]);

  const goToPreviousMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1));
  };

  const goToToday = useCallback(() => {
    const now = new Date();
    setSelectedMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(null);
  }, []);

  const calendarDays = useMemo(() => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  }, [selectedMonth]);

  const getDayInfo = useCallback((day: number) => {
    const date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
    const dateStr = getLocalDateString(date);

    const hasScan = scans.some(s => s.date.split('T')[0] === dateStr);
    const dayCheckIns = checkIns.filter(c => c.date === dateStr);
    const checkIn = dayCheckIns.length > 0
      ? dayCheckIns.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))[0]
      : null;
    const hasCheckIn = !!checkIn;

    // Check for user override first, then fall back to calculated phase
    const override = phaseOverrides[dateStr];
    const phase = override
      ? override
      : isRegularCycle
        ? calculateCyclePhase(effectiveCycleStart, userProfile.cycleLength, date)
        : null;

    const isDueDate = dueDateStr === dateStr;
    const hasOverride = !!override;

    return { hasScan, hasCheckIn, phase, checkIn, date, dateStr, isDueDate, hasOverride };
  }, [selectedMonth, scans, checkIns, isRegularCycle, effectiveCycleStart, userProfile.cycleLength, dueDateStr, phaseOverrides]);

  const getPhaseInfoForDay = useCallback((day: number) => {
    const date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
    const dateStr = getLocalDateString(date);

    // Check for user override first
    const override = phaseOverrides[dateStr];
    if (override) {
      return {
        color: PHASE_INFO[override].color,
        icon: PHASE_INFO[override].icon,
        label: t.phases[override],
      };
    }

    const timeline = getTimelinePhaseForDate(date, userProfile.lifeStage, userProfile);

    if (timeline.type === 'menstrual') {
      return {
        color: PHASE_INFO[timeline.phase].color,
        icon: PHASE_INFO[timeline.phase].icon,
        label: t.phases[timeline.phase],
      };
    }

    const info = LIFE_STAGE_INFO[timeline.key];
    return {
      color: info.color,
      icon: info.icon,
      label: getLifeStageLabel(timeline.key, t),
    };
  }, [selectedMonth, userProfile, t, phaseOverrides]);

  const handleDayPress = useCallback((day: number) => {
    const date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
    const dateStr = getLocalDateString(date);
    const today = getLocalDateString(new Date());

    if (dateStr === today) {
      const hasScan = scans.some(s => s.date.split('T')[0] === dateStr);
      const hasCheckIn = checkIns.some(c => c.date === dateStr);

      if (!hasScan || !hasCheckIn) {
        router.push('/scan' as any);
      } else {
        setSelectedDate(date);
      }
    } else {
      setSelectedDate(date);
    }
  }, [selectedMonth, scans, checkIns]);

  const isToday = useCallback((day: number) => {
    const today = new Date();
    return day === today.getDate() &&
           selectedMonth.getMonth() === today.getMonth() &&
           selectedMonth.getFullYear() === today.getFullYear();
  }, [selectedMonth]);

  const isSelected = useCallback((day: number) => {
    if (!selectedDate) return false;
    return day === selectedDate.getDate() &&
           selectedMonth.getMonth() === selectedDate.getMonth() &&
           selectedMonth.getFullYear() === selectedDate.getFullYear();
  }, [selectedDate, selectedMonth]);

  const monthNames = useMemo(() => [
    t.calendar.months.january, t.calendar.months.february, t.calendar.months.march,
    t.calendar.months.april, t.calendar.months.may, t.calendar.months.june,
    t.calendar.months.july, t.calendar.months.august, t.calendar.months.september,
    t.calendar.months.october, t.calendar.months.november, t.calendar.months.december
  ], [t.calendar.months]);

  const formatDate = useCallback((date: Date) => {
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }, [monthNames]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t.programs.title}</Text>
          <Text style={styles.headerSubtitle}>
            {t.programs.subtitle}
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {isPregnancy && pregnancyInfo && (
            <View style={styles.pregnancyCard}>
              <View style={styles.pregnancyHeader}>
                <View style={styles.pregnancyIconWrap}>
                  <Baby size={22} color="#fff" />
                </View>
                <View style={styles.pregnancyHeaderText}>
                  <Text style={styles.pregnancyTitle}>{t.programs.pregnancyProgress}</Text>
                  <Text style={styles.pregnancyWeekLabel}>
                    {t.programs.weekOf} {pregnancyInfo.currentWeek} · {getLifeStageLabel(
                      pregnancyInfo.currentTrimester === 1 ? "trimester1" : pregnancyInfo.currentTrimester === 2 ? "trimester2" : "trimester3", t
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.trimesterTrack}>
                <View style={styles.trimesterSegments}>
                  <View style={[styles.trimesterSeg, { backgroundColor: LIFE_STAGE_INFO.trimester1.color, flex: 13 }]}>
                    <Text style={styles.trimesterSegLabel}>T1</Text>
                  </View>
                  <View style={[styles.trimesterSeg, { backgroundColor: LIFE_STAGE_INFO.trimester2.color, flex: 14 }]}>
                    <Text style={styles.trimesterSegLabel}>T2</Text>
                  </View>
                  <View style={[styles.trimesterSeg, { backgroundColor: LIFE_STAGE_INFO.trimester3.color, flex: 13 }]}>
                    <Text style={styles.trimesterSegLabel}>T3</Text>
                  </View>
                </View>
                <View style={[styles.trimesterProgressIndicator, { left: `${Math.min(pregnancyInfo.progressPct, 98)}%` }]}>
                  <View style={styles.trimesterProgressDot} />
                </View>
              </View>

              {pregnancyInfo.dueDate && (
                <View style={styles.dueDateRow}>
                  <View style={styles.dueDateInfo}>
                    <Calendar size={14} color={colors.textSecondary} />
                    <Text style={styles.dueDateLabel}>{t.programs.dueDate}</Text>
                  </View>
                  <Text style={styles.dueDateValue}>
                    {formatDate(pregnancyInfo.dueDate)}
                  </Text>
                </View>
              )}

              {pregnancyInfo.daysLeft !== null && pregnancyInfo.daysLeft > 0 && (
                <View style={styles.daysLeftRow}>
                  <Clock size={14} color={LIFE_STAGE_INFO[pregnancyInfo.currentTrimester === 1 ? "trimester1" : pregnancyInfo.currentTrimester === 2 ? "trimester2" : "trimester3"].color} />
                  <Text style={[styles.daysLeftText, { color: LIFE_STAGE_INFO[pregnancyInfo.currentTrimester === 1 ? "trimester1" : pregnancyInfo.currentTrimester === 2 ? "trimester2" : "trimester3"].color }]}>
                    {pregnancyInfo.daysLeft} {t.programs.daysLeft}
                  </Text>
                </View>
              )}

              {pregnancyInfo.isPastDue && (
                <View style={styles.pastDueBadge}>
                  <Text style={styles.pastDueText}>{t.programs.pastDue}</Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.monthSelector}>
            <TouchableOpacity
              onPress={goToPreviousMonth}
              style={styles.monthButton}
              accessibilityLabel="Previous month"
              accessibilityRole="button"
            >
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.monthText}>
              {(() => {
                const monthNames = [
                  t.calendar.months.january, t.calendar.months.february, t.calendar.months.march,
                  t.calendar.months.april, t.calendar.months.may, t.calendar.months.june,
                  t.calendar.months.july, t.calendar.months.august, t.calendar.months.september,
                  t.calendar.months.october, t.calendar.months.november, t.calendar.months.december
                ];
                return `${monthNames[selectedMonth.getMonth()]} ${selectedMonth.getFullYear()}`;
              })()}
            </Text>
            <TouchableOpacity
              onPress={goToNextMonth}
              style={styles.monthButton}
              accessibilityLabel="Next month"
              accessibilityRole="button"
            >
              <ChevronRight size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.calendarCard}>
            <View style={styles.weekDays}>
              {[t.calendar.daysShort.sun, t.calendar.daysShort.mon, t.calendar.daysShort.tue, 
                t.calendar.daysShort.wed, t.calendar.daysShort.thu, t.calendar.daysShort.fri, 
                t.calendar.daysShort.sat].map((day) => (
                <Text key={day} style={styles.weekDayText}>{day}</Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <View key={`empty-${index}`} style={styles.emptyDay} />;
                }

                const { hasScan, hasCheckIn, isDueDate, hasOverride } = getDayInfo(day);
                const today = isToday(day);
                const selected = isSelected(day);
                const phaseInfo = getPhaseInfoForDay(day);
                const PhaseIconComp = phaseInfo.icon;

                return (
                  <View key={day} style={styles.dayCell}>
                    <TouchableOpacity
                      onPress={() => handleDayPress(day)}
                      style={[
                        styles.dayContent,
                        { backgroundColor: phaseInfo.color + '30' },
                        isDueDate && styles.dueDateDayContent,
                        selected && !today && styles.selectedContent,
                        today && styles.todayContent,
                      ]}
                      accessibilityLabel={`${day}, ${phaseInfo.label}${isDueDate ? `, ${t.programs.dueDate}` : ''}`}
                      accessibilityRole="button"
                    >
                      <Text
                        style={[
                          styles.dayText,
                          isDueDate && styles.dueDateDayText,
                          selected && !today && styles.selectedText,
                          today && styles.todayText,
                        ]}
                      >
                        {day}
                      </Text>
                      {isDueDate ? (
                        <View style={styles.dayPhaseIcon}>
                          <Baby size={8} color="#E85D75" />
                        </View>
                      ) : (
                        <View style={styles.dayPhaseIcon}>
                          <PhaseIconComp size={8} color={phaseInfo.color} />
                        </View>
                      )}
                      {(hasScan || hasCheckIn || hasOverride) && (
                        <View style={styles.indicators}>
                          {hasOverride && (
                            <View style={[styles.indicator, { backgroundColor: '#FF9500' }]} />
                          )}
                          {hasScan && (
                            <View style={[styles.indicator, { backgroundColor: colors.primary }]} />
                          )}
                          {hasCheckIn && (
                            <View style={[styles.indicator, { backgroundColor: colors.success }]} />
                          )}
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>

          {selectedDate && (() => {
            const dateStr = getLocalDateString(selectedDate);
            const dayCheckIns = checkIns.filter(c => c.date === dateStr);
            const checkIn = dayCheckIns.length > 0
              ? dayCheckIns.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))[0]
              : null;
            const dayScans = scans.filter(s => s.date.split('T')[0] === dateStr);
            const scan = dayScans.length > 0
              ? dayScans.sort((a, b) => b.timestamp - a.timestamp)[0]
              : null;

            let selectedPhaseColor: string;
            let SelectedPhaseIcon: React.ComponentType<{ size: number; color: string }>;
            let selectedPhaseLabel: string;

            const timeline = getTimelinePhaseForDate(selectedDate, userProfile.lifeStage, userProfile);
            const override = phaseOverrides[dateStr];

            // If there's a user override, show that phase instead
            if (override) {
              const pi = PHASE_INFO[override];
              selectedPhaseColor = pi.color;
              SelectedPhaseIcon = pi.icon;
              selectedPhaseLabel = `${t.phases[override]} ${t.home.phase}`;
            } else if (timeline.type === 'menstrual') {
              const pi = PHASE_INFO[timeline.phase];
              selectedPhaseColor = pi.color;
              SelectedPhaseIcon = pi.icon;
              selectedPhaseLabel = `${t.phases[timeline.phase]} ${t.home.phase}`;
            } else {
              const lsInfo = LIFE_STAGE_INFO[timeline.key];
              selectedPhaseColor = lsInfo.color;
              SelectedPhaseIcon = lsInfo.icon;
              if (timeline.key === 'trimester1' || timeline.key === 'trimester2' || timeline.key === 'trimester3') {
                const pregStart = getPregnancyStartFromProfile(userProfile) 
                  || (userProfile.birthDate ? new Date(new Date(userProfile.birthDate).getTime() - 40 * 7 * 24 * 60 * 60 * 1000) : null);
                if (pregStart) {
                  const week = Math.floor((selectedDate.getTime() - pregStart.getTime()) / (1000 * 60 * 60 * 24 * 7));
                  selectedPhaseLabel = `${getLifeStageLabel(timeline.key, t)} · ${t.programs.weekOf} ${Math.max(0, week)}`;
                } else {
                  selectedPhaseLabel = getLifeStageLabel(timeline.key, t);
                }
              } else {
                selectedPhaseLabel = getLifeStageLabel(timeline.key, t);
              }
            }

            return (
              <View style={styles.selectedDateCard}>
                <Text style={styles.selectedDateTitle}>
                  {formatDate(selectedDate)}
                </Text>

                <View style={[styles.phaseIndicator, { backgroundColor: selectedPhaseColor + '20' }]}>
                  <SelectedPhaseIcon size={20} color={selectedPhaseColor} />
                  <Text style={[styles.phaseIndicatorText, { color: selectedPhaseColor }]}>
                    {selectedPhaseLabel}
                  </Text>
                  {phaseOverrides[dateStr] && (
                    <View style={styles.overrideBadge}>
                      <Edit3 size={10} color="#FF9500" />
                    </View>
                  )}
                </View>

                {isRegularCycle && (
                  <View style={styles.phasePickerSection}>
                    <View style={styles.phasePickerHeader}>
                      <Text style={styles.phasePickerTitle}>{t.programs?.changePhase || 'Change phase'}</Text>
                      {phaseOverrides[dateStr] && (
                        <TouchableOpacity
                          style={styles.resetButton}
                          onPress={() => setPhaseOverride({ date: dateStr, phase: null })}
                          accessibilityLabel="Reset phase override"
                          accessibilityRole="button"
                        >
                          <RotateCcw size={12} color={colors.textSecondary} />
                          <Text style={styles.resetButtonText}>{t.programs?.resetPhase || 'Reset'}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <View style={styles.phasePickerRow}>
                      {(Object.keys(PHASE_INFO) as CyclePhase[]).map((phaseKey) => {
                        const info = PHASE_INFO[phaseKey];
                        const PhaseIcon = info.icon;
                        const isCurrentOverride = phaseOverrides[dateStr] === phaseKey;
                        const isCalculatedPhase = !phaseOverrides[dateStr] && timeline.type === 'menstrual' && timeline.phase === phaseKey;
                        const isActive = isCurrentOverride || isCalculatedPhase;

                        return (
                          <TouchableOpacity
                            key={phaseKey}
                            style={[
                              styles.phasePickerButton,
                              { borderColor: info.color + '60' },
                              isActive && { backgroundColor: info.color + '30', borderColor: info.color },
                            ]}
                            onPress={() => {
                              if (isCalculatedPhase) return; // Already the calculated phase
                              setPhaseOverride({ date: dateStr, phase: phaseKey });
                            }}
                            accessibilityLabel={`${t.phases[phaseKey]}${isActive ? ' (current)' : ''}`}
                            accessibilityRole="button"
                          >
                            <PhaseIcon size={16} color={info.color} />
                            <Text style={[styles.phasePickerLabel, { color: isActive ? info.color : colors.textSecondary }]}>
                              {t.phases[phaseKey]}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}

                {checkIn && (
                  <View style={styles.selectedCheckInSummary}>
                    <Text style={styles.selectedSectionTitle}>{t.programs.checkIn}</Text>
                    <View style={styles.checkInDetailsGrid}>
                      <View style={styles.checkInDetailItem}>
                        <Text style={styles.checkInLabel}>{t.checkIn.sleepQuestion}</Text>
                        <Text style={styles.checkInValue}>{checkIn.sleep >= 7 ? t.sleepAnswers.yes : checkIn.sleep >= 4 ? t.sleepAnswers.somewhat : t.sleepAnswers.no}</Text>
                      </View>
                    </View>
                    {!!checkIn.bleedingLevel && checkIn.bleedingLevel !== 'none' && (
                      <View style={styles.bleedingSection}>
                        <Text style={styles.checkInLabel}>{t.checkIn.bleeding}</Text>
                        <Text style={styles.checkInValue}>{checkIn.bleedingLevel.charAt(0).toUpperCase() + checkIn.bleedingLevel.slice(1)}</Text>
                      </View>
                    )}
                    {(!!checkIn.cervicalMucus || checkIn.ovulationPain !== undefined) && (
                      <View style={styles.fertilitySection}>
                        {!!checkIn.cervicalMucus && (
                          <View style={styles.fertilityItem}>
                            <Text style={styles.checkInLabel}>{t.programs.cervicalMucus}</Text>
                            <Text style={styles.checkInValue}>{checkIn.cervicalMucus.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</Text>
                          </View>
                        )}
                        {checkIn.ovulationPain !== undefined && (
                          <View style={styles.fertilityItem}>
                            <Text style={styles.checkInLabel}>{t.programs.ovulationPain}</Text>
                            <Text style={styles.checkInValue}>{checkIn.ovulationPain ? t.common.yes : t.common.no}</Text>
                          </View>
                        )}
                      </View>
                    )}
                    {(checkIn.hadCaffeine || checkIn.hadAlcohol || checkIn.isIll || checkIn.hadSugar || checkIn.hadProcessedFood) && (
                      <View style={styles.lifestyleSection}>
                        <Text style={styles.checkInLabel}>{t.programs.lifestyle}</Text>
                        <View style={styles.lifestyleRow}>
                          {checkIn.hadCaffeine && (
                            <View style={styles.lifestyleBadge}>
                              <Coffee size={12} color={colors.primary} />
                              <Text style={styles.lifestyleBadgeText}>{t.checkIn.hadCaffeine}</Text>
                            </View>
                          )}
                          {checkIn.hadAlcohol && (
                            <View style={styles.lifestyleBadge}>
                              <Wine size={12} color={colors.primary} />
                              <Text style={styles.lifestyleBadgeText}>{t.checkIn.hadAlcohol}</Text>
                            </View>
                          )}
                          {checkIn.isIll && (
                            <View style={styles.lifestyleBadge}>
                              <Thermometer size={12} color={colors.primary} />
                              <Text style={styles.lifestyleBadgeText}>{t.checkIn.isIll}</Text>
                            </View>
                          )}
                          {checkIn.hadSugar && (
                            <View style={styles.lifestyleBadge}>
                              <Candy size={12} color={colors.primary} />
                              <Text style={styles.lifestyleBadgeText}>{t.checkIn.hadSugar}</Text>
                            </View>
                          )}
                          {checkIn.hadProcessedFood && (
                            <View style={styles.lifestyleBadge}>
                              <Package size={12} color={colors.primary} />
                              <Text style={styles.lifestyleBadgeText}>{t.checkIn.hadProcessedFood}</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    )}
                    {checkIn.symptoms.length > 0 && (
                      <View style={styles.symptomsSection}>
                        <Text style={styles.checkInLabel}>{t.programs.symptoms}</Text>
                        <Text style={styles.symptomsText}>{translateSymptoms(checkIn.symptoms, t.symptoms)}</Text>
                      </View>
                    )}
                    {!!checkIn.notes && checkIn.notes.trim() !== '' && (
                      <View style={styles.notesSection}>
                        <Text style={styles.checkInLabel}>{t.programs.notes}</Text>
                        <Text style={styles.notesText}>{checkIn.notes}</Text>
                      </View>
                    )}
                  </View>
                )}

                {scan && (
                  <View style={styles.selectedScanSummary}>
                    <Text style={styles.selectedSectionTitle}>{t.programs.scanMetrics}</Text>

                    <View style={styles.scanMetricsGroup}>
                      <ScanMetricBar label={t.home.stress} value={scan.stressScore} color={colors.stressHigh} icon={Zap} />
                      <ScanMetricBar label={t.home.energy} value={scan.energyScore} color={colors.energyHigh} icon={Battery} />
                      <ScanMetricBar label={t.home.recovery} value={scan.recoveryScore} color={colors.recoveryHigh} icon={Heart} />
                    </View>

                    <View style={styles.scanMetricsGroup}>
                      <Text style={styles.scanGroupLabel}>{t.programs.physical}</Text>
                      <ScanMetricBar label={t.habits.hydration} value={scan.hydrationLevel} color={colors.habitHydration} icon={Droplets} />
                      <ScanMetricBar label={t.programs.inflammation} value={scan.inflammation} color={colors.phaseMenstrual} icon={AlertCircle} />
                      <ScanMetricBar label={t.programs.fatigue} value={scan.fatigueLevel} color={colors.phaseOvulation} icon={Moon} />
                    </View>

                    <View style={styles.scanMetricsGroup}>
                      <Text style={styles.scanGroupLabel}>{t.programs.mentalEmotional}</Text>
                      <ScanMetricBar label={t.programs.cognitiveSharpness} value={scan.emotionalMentalState.cognitiveSharpness} color={colors.habitNutrition} icon={Brain} />
                      <ScanMetricBar label={t.programs.emotionalSensitivity} value={scan.emotionalMentalState.emotionalSensitivity} color={colors.secondary} icon={Heart} />
                      <ScanMetricBar label={t.programs.socialEnergy} value={scan.emotionalMentalState.socialEnergy} color={colors.habitRecovery} icon={Users} />
                      <ScanMetricBar label={t.insights?.moodVolatilityRisk || t.programs.moodVolatility} value={scan.emotionalMentalState.moodVolatilityRisk} color={colors.habitMovement} icon={BarChart3} />
                    </View>

                    <View style={styles.scanMetricsGroup}>
                      <Text style={styles.scanGroupLabel}>{t.programs.physiological}</Text>
                      <ScanMetricBar label={t.programs.sympatheticActivation} value={scan.physiologicalStates.sympatheticActivation} color={colors.error} icon={Wind} />
                      <ScanMetricBar label={t.programs.cognitiveLoad} value={scan.physiologicalStates.cognitiveLoad} color={colors.info} icon={Brain} />
                      <ScanMetricBar label={t.programs.dehydrationTendency} value={scan.physiologicalStates.dehydrationTendency} color={colors.habitMindfulness} icon={Droplets} />
                      <ScanMetricBar label={t.programs.inflammatoryStress} value={scan.physiologicalStates.inflammatoryStress} color={colors.habitSkincare} icon={Flame} />
                    </View>

                    <View style={styles.scanMetricsGroup}>
                      <Text style={styles.scanGroupLabel}>{t.programs.skinBeauty}</Text>
                      <ScanMetricBar label={t.programs.skinStress} value={scan.skinBeautySignals.skinStress} color={colors.secondary} icon={Sparkles} />
                      <ScanMetricBar label={t.programs.drynessTendency} value={scan.skinBeautySignals.drynessTendency} color={colors.primaryLight} icon={Droplets} />
                    </View>
                  </View>
                )}

                {!checkIn && !scan && (
                  <View style={styles.noDataSection}>
                    <Text style={styles.noDataText}>{t.programs.noDataForDay}</Text>
                  </View>
                )}

                {(() => {
                  const todayStr = getLocalDateString(new Date());
                  const isSelectedToday = dateStr === todayStr;
                  if (isSelectedToday && !checkIn) {
                    return (
                      <TouchableOpacity
                        style={styles.checkInCta}
                        onPress={() => router.push('/check-in' as any)}
                        activeOpacity={0.8}
                      >
                        <ClipboardCheck size={20} color="#fff" />
                        <Text style={styles.checkInCtaText}>{t.programs.completeTodaysCheckIn}</Text>
                      </TouchableOpacity>
                    );
                  }
                  return null;
                })()}
              </View>
            );
          })()}

          <View style={styles.legendContainer}>
            <Text style={styles.legendTitle}>{t.programs.cyclePhases || t.programs.title}</Text>
            <View style={styles.legendGrid}>
              {(userProfile.lifeStage === 'pregnancy' || userProfile.lifeStage === 'postpartum') ? (
                <>
                  {(Object.keys(PHASE_INFO) as CyclePhase[]).map((phaseKey) => {
                    const phase = PHASE_INFO[phaseKey];
                    const PhaseIcon = phase.icon;
                    return (
                      <View key={phaseKey} style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: phase.color + '45' }]}>
                          <PhaseIcon size={16} color={phase.color} />
                        </View>
                        <Text style={styles.legendText}>{t.phases[phaseKey]}</Text>
                      </View>
                    );
                  })}
                  {(['trimester1', 'trimester2', 'trimester3', 'postpartumRecovery', 'postpartumHealing'] as LifeStagePhaseKey[]).map((key) => {
                    const info = LIFE_STAGE_INFO[key];
                    const Icon = info.icon;
                    return (
                      <View key={key} style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: info.color + '45' }]}>
                          <Icon size={16} color={info.color} />
                        </View>
                        <Text style={styles.legendText}>{getLifeStageLabel(key, t)}</Text>
                      </View>
                    );
                  })}
                </>
              ) : isRegularCycle ? (
                (Object.keys(PHASE_INFO) as CyclePhase[]).map((phaseKey) => {
                  const phase = PHASE_INFO[phaseKey];
                  const PhaseIcon = phase.icon;
                  return (
                    <View key={phaseKey} style={styles.legendItem}>
                      <View style={[styles.legendColor, { backgroundColor: phase.color + '45' }]}>
                        <PhaseIcon size={16} color={phase.color} />
                      </View>
                      <Text style={styles.legendText}>{t.phases[phaseKey]}</Text>
                    </View>
                  );
                })
              ) : (
                (() => {
                  const legendKeys = getLifeStageLegendKeys(userProfile.lifeStage);
                  return legendKeys.map((key) => {
                    const info = LIFE_STAGE_INFO[key];
                    const Icon = info.icon;
                    return (
                      <View key={key} style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: info.color + '45' }]}>
                          <Icon size={16} color={info.color} />
                        </View>
                        <Text style={styles.legendText}>{getLifeStageLabel(key, t)}</Text>
                      </View>
                    );
                  });
                })()
              )}
            </View>
          </View>

          {isPregnancy && dueDateStr && (
            <View style={styles.legendContainer}>
              <Text style={styles.legendTitle}>{t.programs.dueDate}</Text>
              <View style={styles.activityLegend}>
                <View style={styles.activityItem}>
                  <View style={[styles.dueDateLegendDot, { borderColor: "#E85D75" }]} />
                  <Text style={styles.legendText}>{t.programs.dueDate}</Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.legendContainer}>
            <Text style={styles.legendTitle}>{t.programs.activityIndicators}</Text>
            <View style={styles.activityLegend}>
              <View style={styles.activityItem}>
                <View style={[styles.indicator, { backgroundColor: colors.primary }]} />
                <Text style={styles.legendText}>{t.programs.eyeScan}</Text>
              </View>
              <View style={styles.activityItem}>
                <View style={[styles.indicator, { backgroundColor: colors.success }]} />
                <Text style={styles.legendText}>{t.programs.checkInIndicator}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {!isCurrentMonth && (
          <TouchableOpacity
            style={styles.todayPill}
            onPress={goToToday}
            activeOpacity={0.85}
          >
            <Calendar size={14} color="#fff" />
            <Text style={styles.todayPillText}>{t.programs.todayButton}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

function ScanMetricBar({ label, value, color, icon: Icon }: { label: string; value: number; color: string; icon: React.ComponentType<{ size: number; color: string }>; }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createCalendarStyles(colors), [colors]);
  const pct = Math.min(Math.max((value / 10) * 100, 0), 100);
  return (
    <View style={styles.metricBarRow}>
      <View style={[styles.metricBarIcon, { backgroundColor: color + '15' }]}>
        <Icon size={14} color={color} />
      </View>
      <View style={styles.metricBarContent}>
        <View style={styles.metricBarLabelRow}>
          <Text style={styles.metricBarLabel}>{label}</Text>
          <Text style={styles.metricBarValue}>{value.toFixed(1)}</Text>
        </View>
        <View style={styles.metricBarTrack}>
          <View style={[styles.metricBarFill, { width: `${pct}%`, backgroundColor: color }]} />
        </View>
      </View>
    </View>
  );
}

function createCalendarStyles(colors: typeof Colors.light) { return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 40,
  },
  pregnancyCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: LIFE_STAGE_INFO.trimester2.color + '40',
    shadowColor: LIFE_STAGE_INFO.trimester2.color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  pregnancyHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 16,
    gap: 12,
  },
  pregnancyIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: LIFE_STAGE_INFO.trimester2.color,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  pregnancyHeaderText: {
    flex: 1,
  },
  pregnancyTitle: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: colors.text,
  },
  pregnancyWeekLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  trimesterTrack: {
    height: 28,
    borderRadius: 14,
    overflow: "hidden" as const,
    marginBottom: 14,
    position: "relative" as const,
  },
  trimesterSegments: {
    flexDirection: "row" as const,
    flex: 1,
    borderRadius: 14,
    overflow: "hidden" as const,
    height: 28,
  },
  trimesterSeg: {
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  trimesterSegLabel: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#fff",
    opacity: 0.9,
  },
  trimesterProgressIndicator: {
    position: "absolute" as const,
    top: -2,
    width: 4,
    height: 32,
    alignItems: "center" as const,
  },
  trimesterProgressDot: {
    width: 4,
    height: 32,
    borderRadius: 2,
    backgroundColor: colors.text,
    opacity: 0.7,
  },
  dueDateRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingTop: 4,
  },
  dueDateInfo: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
  },
  dueDateLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500" as const,
  },
  dueDateValue: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: colors.text,
  },
  daysLeftRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    marginTop: 8,
  },
  daysLeftText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  pastDueBadge: {
    marginTop: 10,
    backgroundColor: "#E85D75" + '18',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: "flex-start" as const,
  },
  pastDueText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#E85D75",
  },
  monthSelector: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    marginBottom: 20,
  },
  monthButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.text,
  },
  calendarCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  weekDays: {
    flexDirection: "row" as const,
    justifyContent: "space-around" as const,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: colors.textSecondary,
    width: 40,
    textAlign: "center" as const,
  },
  calendarGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
  },
  emptyDay: {
    width: "14.28%" as const,
    aspectRatio: 1,
  },
  dayCell: {
    width: "14.28%" as const,
    aspectRatio: 1,
    padding: 2,
  },
  dayContent: {
    flex: 1,
    borderRadius: 8,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    position: "relative" as const,
  },
  dueDateDayContent: {
    borderWidth: 2,
    borderColor: "#E85D75",
    borderStyle: "dashed" as const,
  },
  dueDateDayText: {
    fontWeight: "700" as const,
    color: "#E85D75",
  },
  todayContent: {
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  selectedContent: {
    backgroundColor: colors.primary + '18',
    borderWidth: 1.5,
    borderColor: colors.primary + '60',
    borderRadius: 10,
  },
  selectedText: {
    fontWeight: "700" as const,
    color: colors.primary,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: colors.text,
  },
  todayText: {
    fontWeight: "800" as const,
    color: "#FFFFFF",
  },
  phaseIndicator: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  phaseIndicatorText: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  selectedDateCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  selectedDateTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 16,
  },
  selectedCheckInSummary: {
    marginBottom: 20,
  },
  selectedSectionTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.text,
    marginBottom: 12,
  },
  checkInDetailsGrid: {
    flexDirection: "row" as const,
    gap: 12,
    marginBottom: 12,
  },
  checkInDetailItem: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: "center" as const,
  },
  bleedingSection: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  fertilitySection: {
    flexDirection: "row" as const,
    gap: 12,
    marginBottom: 12,
  },
  fertilityItem: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: "center" as const,
  },
  checkInGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 12,
  },
  checkInItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    flex: 1,
    minWidth: "45%" as const,
    alignItems: "center" as const,
  },
  checkInLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  checkInValue: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.text,
  },
  selectedScanSummary: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 20,
  },
  scanMetricsGroup: {
    marginBottom: 16,
  },
  scanGroupLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: colors.textSecondary,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
  },
  metricBarRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 10,
    gap: 10,
  },
  metricBarIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  metricBarContent: {
    flex: 1,
  },
  metricBarLabelRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 4,
  },
  metricBarLabel: {
    fontSize: 13,
    color: colors.text,
    fontWeight: "500" as const,
  },
  metricBarValue: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: colors.text,
  },
  metricBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.borderLight,
    overflow: "hidden" as const,
  },
  metricBarFill: {
    height: 6,
    borderRadius: 3,
  },
  noDataSection: {
    padding: 16,
    alignItems: "center" as const,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  noDataText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  symptomsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  symptomsText: {
    fontSize: 14,
    color: colors.text,
    marginTop: 4,
  },
  notesSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  notesText: {
    fontSize: 14,
    color: colors.text,
    marginTop: 4,
    lineHeight: 20,
  },
  lifestyleSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  lifestyleRow: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
    marginTop: 8,
  },
  lifestyleBadge: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  lifestyleBadgeText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "500" as const,
  },
  dayPhaseIcon: {
    position: "absolute" as const,
    top: 3,
    right: 3,
    opacity: 0.7,
  },
  indicators: {
    position: "absolute" as const,
    bottom: 4,
    flexDirection: "row" as const,
    gap: 3,
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  legendContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 12,
  },
  legendGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
  },
  legendItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    width: "50%" as const,
    marginBottom: 12,
  },
  legendColor: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  legendText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  activityLegend: {
    flexDirection: "row" as const,
    gap: 20,
  },
  activityItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
  },
  dueDateLegendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderStyle: "dashed" as const,
  },
  overrideBadge: {
    marginLeft: "auto" as const,
    backgroundColor: "#FF9500" + "20",
    borderRadius: 8,
    padding: 4,
  },
  phasePickerSection: {
    marginBottom: 16,
  },
  phasePickerHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    marginBottom: 10,
  },
  phasePickerTitle: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: colors.textSecondary,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  resetButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  resetButtonText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  phasePickerRow: {
    flexDirection: "row" as const,
    gap: 8,
  },
  phasePickerButton: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 4,
  },
  phasePickerLabel: {
    fontSize: 10,
    fontWeight: "600" as const,
    textAlign: "center" as const,
  },
  todayPill: {
    position: "absolute" as const,
    bottom: 80,
    alignSelf: "center" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  todayPillText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#fff",
  },
  checkInCta: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 16,
  },
  checkInCtaText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#fff",
  },
}); }

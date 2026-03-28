import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Platform,
  Switch,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';

import {
  User as UserIcon,
  Calendar,
  Crown,
  Share2,
  Settings,
  ChevronRight,
  Bell,
  Heart,
  Moon,
  Activity,
  Footprints,
  Flame,
  RefreshCw,
  Check,
  Gift,
  Shield,
  FileText,
  Zap,
  Thermometer,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import { useTheme, ThemeMode } from "@/contexts/ThemeContext";
import { useSync } from "@/contexts/SyncContext";
import { useApp } from "@/contexts/AppContext";
import { useReferral } from "@/contexts/ReferralContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Goal, UserProfile, BirthControlType, CycleRegularity, LifeStage, HealthDataType } from "@/types";
import { getHealthKitAvailability } from "@/lib/healthKit";
import { areNotificationsEnabled, enableNotifications, disableNotifications } from "@/lib/notifications";
import { LANGUAGES } from "@/constants/translations";
import { formatWeight, formatHeight, weightInputValue, heightInputValue, parseWeightInput, parseHeightInput } from "@/lib/unitConversion";
import logger from "@/lib/logger";
import { generateDoctorReport } from "@/lib/doctorReport";
import { calculateMilestones, getMonthlyComparison, Milestone, MonthlyComparison } from "@/lib/gamification";

function getTranslatedMonths(t: any): string[] {
  const m = t.calendar.months;
  return [
    m.january, m.february, m.march, m.april, m.may, m.june,
    m.july, m.august, m.september, m.october, m.november, m.december,
  ];
}

const ITEM_HEIGHT = 44;

function WheelColumn({ data, selectedIndex, onSelect, width }: {
  data: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  width: number;
}) {
  const { colors } = useTheme();
  const wheelStyles = useMemo(() => createWheelStyles(colors), [colors]);
  const scrollRef = useRef<ScrollView>(null);
  const isUserScrolling = useRef(false);
  const lastSelectedIndex = useRef(selectedIndex);

  React.useEffect(() => {
    if (!isUserScrolling.current && lastSelectedIndex.current !== selectedIndex) {
      lastSelectedIndex.current = selectedIndex;
      scrollRef.current?.scrollTo({ y: selectedIndex * ITEM_HEIGHT, animated: false });
    }
  }, [selectedIndex]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: selectedIndex * ITEM_HEIGHT, animated: false });
    }, 50);
    return () => clearTimeout(timer);
  }, [selectedIndex]);

  const handleScrollEnd = useCallback((e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, data.length - 1));
    isUserScrolling.current = false;
    lastSelectedIndex.current = clampedIndex;
    if (clampedIndex !== selectedIndex) {
      onSelect(clampedIndex);
    }
    scrollRef.current?.scrollTo({ y: clampedIndex * ITEM_HEIGHT, animated: true });
  }, [data.length, selectedIndex, onSelect]);

  return (
    <View style={[wheelStyles.columnContainer, { width }]}>
      <View style={wheelStyles.selectionHighlight} pointerEvents="none" />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onScrollBeginDrag={() => { isUserScrolling.current = true; }}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={(e) => {
          if (Platform.OS === 'web') {
            handleScrollEnd(e);
          }
        }}
        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
        style={wheelStyles.scrollView}
        nestedScrollEnabled={true}
        removeClippedSubviews={false}
      >
        {data.map((item, index) => {
          const isSelected = index === selectedIndex;
          return (
            <TouchableOpacity
              key={`${item}-${index}`}
              style={wheelStyles.item}
              onPress={() => {
                lastSelectedIndex.current = index;
                onSelect(index);
                scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
              }}
              activeOpacity={0.7}
            >
              <Text style={[
                wheelStyles.itemText,
                isSelected && wheelStyles.itemTextSelected,
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

function DateWheelPicker({ value, onChange, minimumYear, maximumDate, t }: {
  value: Date;
  onChange: (date: Date) => void;
  minimumYear: number;
  maximumDate: Date;
  t: any;
}) {
  const { colors } = useTheme();
  const wheelStyles = useMemo(() => createWheelStyles(colors), [colors]);
  const currentYear = maximumDate.getFullYear();
  const years = React.useMemo(() => {
    const arr: string[] = [];
    for (let y = currentYear; y >= minimumYear; y--) {
      arr.push(String(y));
    }
    return arr;
  }, [currentYear, minimumYear]);

  const selectedMonth = value.getMonth();
  const selectedYear = value.getFullYear();
  const selectedDay = value.getDate();
  const yearIndex = years.indexOf(String(selectedYear));

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const days = React.useMemo(() => {
    const arr: string[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      arr.push(String(d));
    }
    return arr;
  }, [daysInMonth]);

  const handleMonthSelect = useCallback((index: number) => {
    const newDate = new Date(selectedYear, index, Math.min(selectedDay, new Date(selectedYear, index + 1, 0).getDate()));
    if (newDate <= maximumDate) {
      onChange(newDate);
    } else {
      onChange(new Date(maximumDate));
    }
  }, [selectedYear, selectedDay, maximumDate, onChange]);

  const handleDaySelect = useCallback((index: number) => {
    const day = index + 1;
    const newDate = new Date(selectedYear, selectedMonth, day);
    if (newDate <= maximumDate) {
      onChange(newDate);
    } else {
      onChange(new Date(maximumDate));
    }
  }, [selectedYear, selectedMonth, maximumDate, onChange]);

  const handleYearSelect = useCallback((index: number) => {
    const year = parseInt(years[index], 10);
    const maxDay = new Date(year, selectedMonth + 1, 0).getDate();
    const newDate = new Date(year, selectedMonth, Math.min(selectedDay, maxDay));
    if (newDate <= maximumDate) {
      onChange(newDate);
    } else {
      onChange(new Date(maximumDate));
    }
  }, [years, selectedMonth, selectedDay, maximumDate, onChange]);

  return (
    <View style={wheelStyles.container}>
      <View style={wheelStyles.labelsRow}>
        <Text style={[wheelStyles.label, { width: 110 }]}>{t.settings.month}</Text>
        <Text style={[wheelStyles.label, { width: 60 }]}>{t.settings.day}</Text>
        <Text style={[wheelStyles.label, { width: 80 }]}>{t.settings.year}</Text>
      </View>
      <View style={wheelStyles.wheelsRow}>
        <WheelColumn
          data={getTranslatedMonths(t)}
          selectedIndex={selectedMonth}
          onSelect={handleMonthSelect}
          width={110}
        />
        <WheelColumn
          data={days}
          selectedIndex={selectedDay - 1}
          onSelect={handleDaySelect}
          width={60}
        />
        <WheelColumn
          data={years}
          selectedIndex={yearIndex >= 0 ? yearIndex : 0}
          onSelect={handleYearSelect}
          width={80}
        />
      </View>
    </View>
  );
}

function createWheelStyles(colors: typeof Colors.light) { return StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 8,
  },
  labelsRow: {
    flexDirection: "row" as const,
    justifyContent: "center" as const,
    gap: 16,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: colors.textSecondary,
    textAlign: "center" as const,
  },
  wheelsRow: {
    flexDirection: "row" as const,
    justifyContent: "center" as const,
    gap: 16,
    height: ITEM_HEIGHT * 5,
  },
  columnContainer: {
    height: ITEM_HEIGHT * 5,
    overflow: "hidden" as const,
    borderRadius: 12,
    backgroundColor: colors.surface,
    position: "relative" as const,
  },
  selectionHighlight: {
    position: "absolute" as const,
    top: ITEM_HEIGHT * 2,
    left: 4,
    right: 4,
    height: ITEM_HEIGHT,
    backgroundColor: colors.primaryLight,
    borderRadius: 10,
    zIndex: 0,
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  itemText: {
    fontSize: 16,
    color: colors.textTertiary,
    fontWeight: "400" as const,
  },
  itemTextSelected: {
    color: colors.text,
    fontWeight: "700" as const,
    fontSize: 17,
  },
}); }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _getGoals(t: any): { id: Goal; label: string }[] {
  return [
    { id: "energy", label: t.profile.goalEnergy },
    { id: "weight_loss", label: t.profile.goalWeightLoss },
    { id: "strength", label: t.profile.goalStrength },
    { id: "hormonal_balance", label: t.profile.goalHormonalBalance },
    { id: "skin_health", label: t.profile.goalSkinHealth },
    { id: "stress_reduction", label: t.profile.goalStressReduction },
  ];
}

function getBirthControlOptions(t: any): { value: BirthControlType; label: string }[] {
  return [
    { value: "none", label: t.profile.bcNone },
    { value: "pill", label: t.profile.bcPill },
    { value: "iud_hormonal", label: t.profile.bcHormonalIUD },
    { value: "iud_copper", label: t.profile.bcCopperIUD },
    { value: "implant", label: t.profile.bcImplant },
    { value: "ring", label: t.profile.bcRing },
    { value: "patch", label: t.profile.bcPatch },
    { value: "injection", label: t.profile.bcInjection },
    { value: "other", label: t.profile.bcOther },
  ];
}

function getCycleRegularityOptions(t: any): { value: CycleRegularity; label: string }[] {
  return [
    { value: "regular", label: t.profile.regularPredictable },
    { value: "irregular", label: t.profile.irregularUnpredictable },
    { value: "not_sure", label: t.profile.notSure },
  ];
}

function getLifeStageOptions(t: any): { value: LifeStage; label: string; description: string }[] {
  return [
    { value: "regular", label: t.profile.menstrualCycleLabel, description: t.profile.regularCycling },
    { value: "pregnancy", label: t.profile.pregnantLabel, description: t.profile.currentlyExpecting },
    { value: "postpartum", label: t.profile.postpartumLabel, description: t.profile.afterBirthRecovery },
    { value: "perimenopause", label: t.profile.perimenopauseLabel, description: t.profile.transitionalPhase },
    { value: "menopause", label: t.profile.menopauseLabel, description: t.profile.postMenopause },
  ];
}



export default function ProfileScreen() {
  const router = useRouter();
  const { colors, themeMode, setTheme } = useTheme();
  const { userProfile, updateUserProfile, currentPhase, updateLastPeriodDate, phaseEstimate, checkIns, scans, language, updateLanguage, t, units, updateUnits, healthConnection, healthData, connectHealth, disconnectHealth, syncHealthData, isHealthSyncing, deleteAllData, cycleHistory, baseline, effectiveCycleStart } = useApp();
  const [isExporting, setIsExporting] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const { referralStats, referralGoal } = useReferral();
  const { isPremium } = useSubscription();
  const { syncId, lastSyncedAt, isSyncing, push, restoreFromId, ensureSyncId } = useSync();
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [restoreId, setRestoreId] = useState('');
  const [isEditing, setIsEditing] = useState(!userProfile.name);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(userProfile);
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(userProfile.lastPeriodDate));
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showUnitsModal, setShowUnitsModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [editWeeksPregnant, setEditWeeksPregnant] = useState(userProfile.weeksPregnant?.toString() || '');
  const adminTapCount = useRef(0);
  const adminTapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [editDueDate, setEditDueDate] = useState(userProfile.pregnancyDueDate || '');
  const [editBabyBirthDate, setEditBabyBirthDate] = useState(userProfile.birthDate || '');
  const [editDeliveryType, setEditDeliveryType] = useState<"vaginal" | "cesarean" | "other">(userProfile.deliveryType || 'vaginal');
  const [showDueDateModal, setShowDueDateModal] = useState(false);
  const [showBabyBirthDateModal, setShowBabyBirthDateModal] = useState(false);
  const [dueDatePicker, setDueDatePicker] = useState(userProfile.pregnancyDueDate ? new Date(userProfile.pregnancyDueDate) : new Date());
  const [babyBirthDatePicker, setBabyBirthDatePicker] = useState(userProfile.birthDate ? new Date(userProfile.birthDate) : new Date());


  const [showHealthModal, setShowHealthModal] = useState(false);
  const [selectedHealthTypes, setSelectedHealthTypes] = useState<HealthDataType[]>(healthConnection.enabledDataTypes || ['sleep', 'menstrualCycle', 'heartRate', 'steps']);
  // Apple Health integration enabled for B-007
  const APPLE_HEALTH_ENABLED = true as boolean;
  const insets = useSafeAreaInsets();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [monthlyComparison, setMonthlyComparison] = useState<MonthlyComparison[]>([]);

  // Partner mode states
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [partnerCode] = useState(userProfile.partnerCode || '');
  const [partnerInputCode, setPartnerInputCode] = useState('');

  const styles = useMemo(() => createProfileStyles(colors), [colors]);

  // Calculate milestones and monthly comparison whenever scans, checkIns, or userProfile change
  useEffect(() => {
    const loadGameification = () => {
      const milestonesData = calculateMilestones(scans, checkIns, userProfile);
      setMilestones(milestonesData);
      const comparisonData = getMonthlyComparison(scans);
      setMonthlyComparison(comparisonData);
    };
    loadGameification();
  }, [scans, checkIns, userProfile]);

  const calculateAge = (birthday: string): number => {
    if (!birthday) return 0;
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSave = () => {
    if (!editedProfile.name || !editedProfile.birthday || editedProfile.weight === 0 || editedProfile.height === 0) {
      Alert.alert(t.profile.missingInfo, t.profile.fillAllFields);
      return;
    }
    const profileToSave: UserProfile = {
      ...editedProfile,
      pregnancyDueDate: editedProfile.lifeStage === 'pregnancy' ? editDueDate || undefined : undefined,
      weeksPregnant: editedProfile.lifeStage === 'pregnancy' && editWeeksPregnant ? parseInt(editWeeksPregnant) : undefined,
      birthDate: editedProfile.lifeStage === 'postpartum' ? editBabyBirthDate || undefined : undefined,
      deliveryType: editedProfile.lifeStage === 'postpartum' ? editDeliveryType : undefined,
    };
    updateUserProfile(profileToSave);
    setIsEditing(false);
  };



  const [isSelectingBirthday, setIsSelectingBirthday] = useState(false);

  const handleOpenBirthdayModal = () => {
    const birthDate = editedProfile.birthday ? new Date(editedProfile.birthday) : new Date(1990, 0, 1);
    setSelectedDate(birthDate);
    setIsSelectingBirthday(true);
    setShowDateModal(true);
  };

  const handleOpenPeriodModal = () => {
    setSelectedDate(new Date(userProfile.lastPeriodDate));
    setIsSelectingBirthday(false);
    setShowDateModal(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _toggleGoal = (goal: Goal) => {
    const goals = editedProfile.goals.includes(goal)
      ? editedProfile.goals.filter((g) => g !== goal)
      : [...editedProfile.goals, goal];
    setEditedProfile({ ...editedProfile, goals });
  };

  const calculateBMI = () => {
    if (userProfile.weight === 0 || userProfile.height === 0) return null;
    const heightM = userProfile.height / 100;
    return (userProfile.weight / (heightM * heightM)).toFixed(1);
  };

  const profileWeightHeight = useMemo(() => {
    if (userProfile.weight === 0 && userProfile.height === 0) return '';
    const parts: string[] = [];
    if (userProfile.weight > 0) parts.push(formatWeight(userProfile.weight, units));
    if (userProfile.height > 0) parts.push(formatHeight(userProfile.height, units));
    return parts.join(' • ');
  }, [userProfile.weight, userProfile.height, units]);

  useEffect(() => {
    areNotificationsEnabled().then((enabled) => {
      setNotificationsEnabled(enabled);
      setIsLoadingNotifications(false);
    });
  }, []);

  const handleToggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    try {
      if (value) {
        const success = await enableNotifications(
          userProfile.lastPeriodDate,
          userProfile.cycleLength
        );
        if (!success) {
          setNotificationsEnabled(false);
          Alert.alert(
            t.profile.permissionRequired,
            t.profile.enableNotificationsMessage
          );
        }
      } else {
        await disableNotifications();
      }
    } catch (error) {
      logger.error('Failed to toggle notifications:', error);
      setNotificationsEnabled(!value);
      Alert.alert(
        t.settings.error,
        t.profile.notificationErrorMessage
      );
    }
  };

  const handleToggleDataConsent = async (value: boolean) => {
    try {
      await updateUserProfile({
        ...userProfile,
        dataConsent: value,
      });
    } catch (error) {
      logger.error('Failed to toggle data consent:', error);
      Alert.alert(
        t.settings.error,
        'Failed to update data consent preference. Please try again.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t.profile.title}</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {!isEditing && userProfile.name ? (
            <>
              <View style={styles.profileCard}>
                <View style={styles.avatarContainer}>
                  <UserIcon size={48} color={colors.primary} />
                </View>
                <Text style={styles.profileName}>{userProfile.name}</Text>
                <View style={styles.profileInfoRow}>
                  <Text style={styles.profileInfo}>
                    {calculateAge(userProfile.birthday)} {t.profile.yearsOld}
                  </Text>
                  {!!calculateBMI() && (
                    <Text style={styles.profileInfo}> • BMI {calculateBMI()}</Text>
                  )}
                </View>
                {!!profileWeightHeight && (
                  <Text style={[styles.profileInfo, { marginBottom: 12 }]}>{profileWeightHeight}</Text>
                )}
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setIsEditing(true)}
                >
                  <Text style={styles.editButtonText}>{t.profile.editProfile}</Text>
                </TouchableOpacity>
              </View>



              <TouchableOpacity 
                style={styles.menuItem}
                onPress={handleOpenPeriodModal}
              >
                <View style={styles.menuIcon}>
                  <Calendar size={20} color={colors.primary} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuText}>{t.profile.lastPeriodStart}</Text>
                  <Text style={styles.menuSubtext}>
                    {new Date(userProfile.lastPeriodDate).toLocaleDateString(language === 'en' ? 'en-US' : language, { month: 'short', day: 'numeric', year: 'numeric' })} • {t.phases[currentPhase]}
                  </Text>
                  {phaseEstimate && (
                    <Text style={[styles.menuSubtext, { fontSize: 11, marginTop: 2 }]}>
                      {t.profile.confidence}: {phaseEstimate.confidence} • {phaseEstimate.reasoning}
                    </Text>
                  )}
                </View>
                <ChevronRight size={20} color={colors.textTertiary} />
              </TouchableOpacity>

              <View style={styles.menuItem}>
                <View style={styles.menuIcon}>
                  <Bell size={20} color={colors.primary} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuText}>{t.profile.periodReminders}</Text>
                  <Text style={styles.menuSubtext}>
                    {notificationsEnabled
                      ? t.profile.periodRemindersOn
                      : t.profile.periodRemindersOff}
                  </Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={handleToggleNotifications}
                  disabled={isLoadingNotifications}
                  trackColor={{ false: colors.border, true: colors.primaryLight }}
                  thumbColor={notificationsEnabled ? colors.primary : colors.surface}
                  ios_backgroundColor={colors.border}
                />
              </View>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/notification-settings')}
                activeOpacity={0.7}
              >
                <View style={styles.menuIcon}>
                  <Settings size={20} color={colors.primary} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuText}>{t.notifications.title}</Text>
                  <Text style={styles.menuSubtext}>Check-in, scan, hydration</Text>
                </View>
                <ChevronRight size={20} color={colors.textTertiary} />
              </TouchableOpacity>

              <View style={styles.referralDashboardCard}>
                <View style={styles.referralDashboardHeader}>
                  <View style={styles.referralDashboardIconWrap}>
                    <Gift size={20} color={colors.warning} />
                  </View>
                  <View style={styles.referralDashboardHeaderText}>
                    <Text style={styles.referralDashboardTitle}>{t.referral.title}</Text>
                    <Text style={styles.referralDashboardSubtitle}>{t.referral.reward}</Text>
                  </View>
                </View>
                <View style={styles.referralMiniStats}>
                  <View style={styles.referralMiniStat}>
                    <Text style={styles.referralMiniStatNumber}>{referralStats.sent}</Text>
                    <Text style={styles.referralMiniStatLabel}>{t.referral.referralsSent}</Text>
                  </View>
                  <View style={styles.referralMiniStatDivider} />
                  <View style={styles.referralMiniStat}>
                    <Text style={styles.referralMiniStatNumber}>{referralStats.subscribed}</Text>
                    <Text style={styles.referralMiniStatLabel}>{t.referral.referralsConverted}</Text>
                  </View>
                  <View style={styles.referralMiniStatDivider} />
                  <View style={styles.referralMiniStat}>
                    <Text style={[styles.referralMiniStatNumber, { color: colors.warning }]}>{referralStats.freeMonthsAvailable}</Text>
                    <Text style={styles.referralMiniStatLabel}>{t.referral.freeMonthsAvailable}</Text>
                  </View>
                </View>
                <View style={styles.referralProgressBarBg}>
                  <View style={[styles.referralProgressBarFill, { width: `${Math.min((referralStats.progressToNextFreeMonth / referralGoal) * 100, 100)}%` }]} />
                </View>
                <Text style={styles.referralProgressLabel}>
                  {referralStats.progressToNextFreeMonth} / {referralGoal} {t.referral.referralsConverted.toLowerCase()}
                </Text>
                <TouchableOpacity
                  style={styles.referralShareButton}
                  onPress={() => router.push('/referral')}
                  activeOpacity={0.7}
                >
                  <Share2 size={16} color="#FFFFFF" />
                  <Text style={styles.referralShareButtonText}>{t.referral.shareNow}</Text>
                </TouchableOpacity>
              </View>

              {isPremium ? (
                <View style={[styles.premiumCard, { borderColor: colors.success }]}>
                  <Crown size={32} color={colors.warning} />
                  <View style={styles.premiumContent}>
                    <Text style={styles.premiumTitle}>{t.profile.premium}</Text>
                    <Text style={styles.premiumPrice}>Active</Text>
                  </View>
                  <View style={[styles.premiumButton, { backgroundColor: colors.success }]}>
                    <Text style={styles.premiumButtonText}>Active</Text>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.premiumCard}
                  onPress={() => router.push('/paywall')}
                  activeOpacity={0.7}
                >
                  <Crown size={32} color={colors.warning} />
                  <View style={styles.premiumContent}>
                    <Text style={styles.premiumTitle}>{t.profile.premium}</Text>
                    <Text style={styles.premiumPrice}>$4.99 / month</Text>
                  </View>
                  <View style={styles.premiumButton}>
                    <Text style={styles.premiumButtonText}>{t.profile.upgrade}</Text>
                  </View>
                </TouchableOpacity>
              )}

              {/* Achievements Section */}
              {milestones && milestones.length > 0 && (
                <View style={styles.achievementsSection}>
                  <Text style={styles.sectionTitle}>Achievements</Text>
                  <View style={styles.milestonesGrid}>
                    {milestones.map((milestone) => (
                      <View
                        key={milestone.id}
                        style={[
                          styles.milestoneCard,
                          !milestone.unlocked && styles.milestoneCardLocked,
                        ]}
                      >
                        <Text style={styles.milestoneIcon}>{milestone.icon}</Text>
                        <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                        <Text style={[styles.milestoneDescription, !milestone.unlocked && styles.milestoneDescriptionLocked]}>
                          {milestone.description}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Monthly Comparison Section */}
              {monthlyComparison && monthlyComparison.length > 0 && (
                <View style={styles.monthlyComparisonSection}>
                  <Text style={styles.sectionTitle}>Monthly Progress</Text>
                  {monthlyComparison.map((comparison, index) => (
                    <View key={index} style={styles.comparisonItem}>
                      <View style={styles.comparisonLabel}>
                        <Text style={styles.comparisonMetric}>{comparison.metric}</Text>
                        <View style={[
                          styles.comparisonChange,
                          comparison.improved ? styles.comparisonChangeImproved : styles.comparisonChangeWorsened,
                        ]}>
                          <Text style={styles.comparisonChangeText}>
                            {comparison.improved ? '↑' : '↓'} {Math.abs(comparison.change).toFixed(1)}%
                          </Text>
                        </View>
                      </View>
                      <View style={styles.comparisonValues}>
                        <Text style={styles.comparisonValue}>
                          {comparison.current.toFixed(1)} (this month)
                        </Text>
                        <Text style={styles.comparisonValuePrevious}>
                          {comparison.previous.toFixed(1)} (last month)
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {APPLE_HEALTH_ENABLED && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => setShowHealthModal(true)}
              >
                <View style={[styles.menuIcon, { backgroundColor: '#FFE8EC' }]}>
                  <Heart size={20} color="#E8607A" />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuText}>{t.health.appleHealth}</Text>
                  <Text style={styles.menuSubtext}>
                    {healthConnection.isConnected ? t.health.connected : t.health.notConnected}
                    {healthConnection.isConnected && healthData?.lastSyncDate
                      ? ` • ${new Date(healthData.lastSyncDate).toLocaleTimeString(language === 'en' ? 'en-US' : language, { hour: '2-digit', minute: '2-digit' } as Intl.DateTimeFormatOptions)}`
                      : ''}
                  </Text>
                </View>
                <View style={[styles.healthStatusDot, healthConnection.isConnected && styles.healthStatusDotConnected]} />
                <ChevronRight size={20} color={colors.textTertiary} />
              </TouchableOpacity>
              )}

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => setShowSettingsModal(true)}
              >
                <View style={styles.menuIcon}>
                  <Settings size={20} color={colors.primary} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuText}>{t.profile.settings}</Text>
                </View>
                <ChevronRight size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.editContainer}>
              <Text style={styles.editTitle}>
                {userProfile.name ? t.profile.editProfile : t.profile.completeYourProfile}
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t.profile.name}</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfile.name}
                  onChangeText={(text) =>
                    setEditedProfile({ ...editedProfile, name: text })
                  }
                  placeholder={t.profile.enterName}
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t.profile.birthday}</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={handleOpenBirthdayModal}
                >
                  <Text style={editedProfile.birthday ? styles.dateInputText : styles.dateInputPlaceholder}>
                    {editedProfile.birthday 
                      ? new Date(editedProfile.birthday).toLocaleDateString(language === 'en' ? 'en-US' : language, { month: 'long', day: 'numeric', year: 'numeric' })
                      : t.profile.selectBirthday}
                  </Text>
                  {!!editedProfile.birthday && (
                    <Text style={styles.dateInputAge}>
                      {calculateAge(editedProfile.birthday)} {t.profile.yearsOld}
                    </Text>
                  )}
                  <Calendar size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, styles.inputHalf]}>
                  <Text style={styles.inputLabel}>
                    {units === 'imperial' ? `${t.profile.weightLabel.replace(/\(.*\)/, '').trim()} (lbs)` : t.profile.weightLabel}
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={weightInputValue(editedProfile.weight, units)}
                    onChangeText={(text) =>
                      setEditedProfile({
                        ...editedProfile,
                        weight: parseWeightInput(text, units),
                      })
                    }
                    placeholder={units === 'imperial' ? 'e.g. 130' : t.onboarding.weight}
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={[styles.inputGroup, styles.inputHalf]}>
                  <Text style={styles.inputLabel}>
                    {units === 'imperial' ? `${t.profile.heightLabel.replace(/\(.*\)/, '').trim()} (ft'in")` : t.profile.heightLabel}
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={heightInputValue(editedProfile.height, units)}
                    onChangeText={(text) => {
                      if (units === 'imperial') {
                        setEditedProfile({
                          ...editedProfile,
                          height: parseHeightInput(text, units),
                        });
                      } else {
                        setEditedProfile({
                          ...editedProfile,
                          height: parseInt(text) || 0,
                        });
                      }
                    }}
                    placeholder={units === 'imperial' ? "e.g. 5'6\"" : t.onboarding.height}
                    placeholderTextColor={colors.textTertiary}
                    keyboardType={units === 'imperial' ? 'default' : 'number-pad'}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t.profile.currentLifeStage}</Text>
                <View style={styles.optionsContainer}>
                  {getLifeStageOptions(t).map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionChip,
                        editedProfile.lifeStage === option.value && styles.optionChipActive,
                      ]}
                      onPress={() =>
                        setEditedProfile({ ...editedProfile, lifeStage: option.value })
                      }
                    >
                      <Text
                        style={[
                          styles.optionChipText,
                          editedProfile.lifeStage === option.value &&
                            styles.optionChipTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {editedProfile.lifeStage === 'regular' && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{t.profile.cycleRegularity}</Text>
                    <View style={styles.optionsContainer}>
                      {getCycleRegularityOptions(t).map((option) => (
                        <TouchableOpacity
                          key={option.value}
                          style={[
                            styles.optionChip,
                            editedProfile.cycleRegularity === option.value && styles.optionChipActive,
                          ]}
                          onPress={() =>
                            setEditedProfile({ ...editedProfile, cycleRegularity: option.value })
                          }
                        >
                          <Text
                            style={[
                              styles.optionChipText,
                              editedProfile.cycleRegularity === option.value &&
                                styles.optionChipTextActive,
                            ]}
                          >
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {editedProfile.cycleRegularity === "irregular" && (
                    <View style={styles.inputRow}>
                      <View style={[styles.inputGroup, styles.inputHalf]}>
                        <Text style={styles.inputLabel}>{t.profile.minCycleDays}</Text>
                        <TextInput
                          style={styles.input}
                          value={editedProfile.cycleLengthMin ? editedProfile.cycleLengthMin.toString() : ""}
                          onChangeText={(text) =>
                            setEditedProfile({
                              ...editedProfile,
                              cycleLengthMin: parseInt(text) || undefined,
                            })
                          }
                          placeholder="24"
                          placeholderTextColor={colors.textTertiary}
                          keyboardType="number-pad"
                        />
                      </View>
                      <View style={[styles.inputGroup, styles.inputHalf]}>
                        <Text style={styles.inputLabel}>{t.profile.maxCycleDays}</Text>
                        <TextInput
                          style={styles.input}
                          value={editedProfile.cycleLengthMax ? editedProfile.cycleLengthMax.toString() : ""}
                          onChangeText={(text) =>
                            setEditedProfile({
                              ...editedProfile,
                              cycleLengthMax: parseInt(text) || undefined,
                            })
                          }
                          placeholder="35"
                          placeholderTextColor={colors.textTertiary}
                          keyboardType="number-pad"
                        />
                      </View>
                    </View>
                  )}

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{t.profile.birthControlMethod}</Text>
                    <View style={styles.optionsContainer}>
                      {getBirthControlOptions(t).map((option) => (
                        <TouchableOpacity
                          key={option.value}
                          style={[
                            styles.optionChip,
                            editedProfile.birthControl === option.value && styles.optionChipActive,
                          ]}
                          onPress={() =>
                            setEditedProfile({ ...editedProfile, birthControl: option.value })
                          }
                        >
                          <Text
                            style={[
                              styles.optionChipText,
                              editedProfile.birthControl === option.value &&
                                styles.optionChipTextActive,
                            ]}
                          >
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </>
              )}

              {editedProfile.lifeStage === 'pregnancy' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t.profile.pregnancyInfo}</Text>
                  <View style={styles.pregnancyEditContainer}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>{t.profile.weeksPregnantOptional}</Text>
                      <TextInput
                        style={styles.input}
                        value={editWeeksPregnant}
                        onChangeText={setEditWeeksPregnant}
                        placeholder="e.g. 12"
                        placeholderTextColor={colors.textTertiary}
                        keyboardType="number-pad"
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>{t.profile.dueDateOptional}</Text>
                      <TouchableOpacity
                        style={styles.dateInput}
                        onPress={() => {
                          setDueDatePicker(editDueDate ? new Date(editDueDate) : new Date());
                          setShowDueDateModal(true);
                        }}
                      >
                        <Text style={editDueDate ? styles.dateInputText : styles.dateInputPlaceholder}>
                          {editDueDate
                            ? new Date(editDueDate).toLocaleDateString(language === 'en' ? 'en-US' : language, { month: 'long', day: 'numeric', year: 'numeric' })
                            : t.profile.selectDueDatePlaceholder}
                        </Text>
                        <Calendar size={20} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}

              {editedProfile.lifeStage === 'postpartum' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t.profile.postpartumInfo}</Text>
                  <View style={styles.pregnancyEditContainer}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>{t.profile.babyBirthDate}</Text>
                      <TouchableOpacity
                        style={styles.dateInput}
                        onPress={() => {
                          setBabyBirthDatePicker(editBabyBirthDate ? new Date(editBabyBirthDate) : new Date());
                          setShowBabyBirthDateModal(true);
                        }}
                      >
                        <Text style={editBabyBirthDate ? styles.dateInputText : styles.dateInputPlaceholder}>
                          {editBabyBirthDate
                            ? new Date(editBabyBirthDate).toLocaleDateString(language === 'en' ? 'en-US' : language, { month: 'long', day: 'numeric', year: 'numeric' })
                            : t.profile.selectBirthDatePlaceholder}
                        </Text>
                        <Calendar size={20} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>{t.profile.deliveryType}</Text>
                      <View style={styles.optionsContainer}>
                        {([{ value: 'vaginal' as const, label: t.profile.vaginal }, { value: 'cesarean' as const, label: t.profile.cesarean }, { value: 'other' as const, label: t.profile.otherDelivery }]).map((option) => (
                          <TouchableOpacity
                            key={option.value}
                            style={[
                              styles.optionChip,
                              editDeliveryType === option.value && styles.optionChipActive,
                            ]}
                            onPress={() => setEditDeliveryType(option.value)}
                          >
                            <Text
                              style={[
                                styles.optionChipText,
                                editDeliveryType === option.value && styles.optionChipTextActive,
                              ]}
                            >
                              {option.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {(editedProfile.lifeStage === 'perimenopause' || editedProfile.lifeStage === 'menopause') && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t.profile.additionalInfo}</Text>
                  <Text style={styles.lifeStageNote}>
                    {editedProfile.lifeStage === 'perimenopause'
                      ? t.profile.perimenopauseNote
                      : t.profile.menopauseNote}
                  </Text>
                </View>
              )}



              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>{t.profile.savingsProfile}</Text>
              </TouchableOpacity>

              {!!userProfile.name && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setEditedProfile(userProfile);
                    setIsEditing(false);
                  }}
                >
                  <Text style={styles.cancelButtonText}>{t.profile.cancel}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>



        <Modal
          visible={showSettingsModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowSettingsModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.cycleModalContent, { maxHeight: '85%', paddingBottom: Math.max(insets.bottom, 20) + 20 }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>{t.settings.title}</Text>
                <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
                  <Text style={styles.modalCloseText}>{t.settings.close}</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView showsVerticalScrollIndicator={false} bounces={false} keyboardShouldPersistTaps="handled">
              <View style={styles.settingsGroup}>
                <Text style={styles.settingsGroupTitle}>{t.settings.appSettings}</Text>
                <TouchableOpacity 
                  style={styles.settingsItem}
                  onPress={() => {
                    setShowSettingsModal(false);
                    setTimeout(() => setShowUnitsModal(true), 350);
                  }}
                >
                  <Text style={styles.settingsItemText}>{t.settings.units}</Text>
                  <View style={styles.settingsItemRight}>
                    <Text style={styles.settingsItemValue}>
                      {units === 'metric' ? t.settings.metric : t.settings.imperial}
                    </Text>
                    <ChevronRight size={20} color={colors.textTertiary} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.settingsItem}
                  onPress={() => {
                    setShowSettingsModal(false);
                    setTimeout(() => setShowLanguageModal(true), 350);
                  }}
                >
                  <Text style={styles.settingsItemText}>{t.settings.language}</Text>
                  <View style={styles.settingsItemRight}>
                    <Text style={styles.settingsItemValue}>
                      {LANGUAGES.find(l => l.code === language)?.nativeName || 'English'}
                    </Text>
                    <ChevronRight size={20} color={colors.textTertiary} />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.settingsGroup}>
                <Text style={styles.settingsGroupTitle}>Appearance</Text>
                {(['system', 'light', 'dark'] as ThemeMode[]).map((mode) => (
                  <TouchableOpacity
                    key={mode}
                    style={[styles.settingsOption, themeMode === mode && styles.settingsOptionSelected]}
                    onPress={() => setTheme(mode)}
                  >
                    <Text style={[styles.settingsOptionText, themeMode === mode && styles.settingsOptionTextSelected]}>
                      {mode === 'system' ? 'System Default' : mode === 'light' ? 'Light Mode' : 'Dark Mode'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.settingsGroup}>
                <Text style={styles.settingsGroupTitle}>Cloud Sync</Text>
                <TouchableOpacity
                  style={styles.settingsItem}
                  onPress={() => {
                    setShowSettingsModal(false);
                    setTimeout(() => setShowSyncModal(true), 350);
                  }}
                >
                  <Text style={styles.settingsItemText}>Backup & Restore</Text>
                  <View style={styles.settingsItemRight}>
                    <Text style={styles.settingsItemValue}>
                      {lastSyncedAt ? 'Synced' : 'Not synced'}
                    </Text>
                    <ChevronRight size={20} color={colors.textTertiary} />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.settingsGroup}>
                <Text style={styles.settingsGroupTitle}>{t.settings.dataPrivacy}</Text>

                <View style={styles.dataConsentItem}>
                  <View style={styles.dataConsentContent}>
                    <Text style={styles.dataConsentItemText}>Share Anonymous Data</Text>
                    <Text style={styles.dataConsentItemDescription}>
                      Help improve Iris by sharing anonymous health insights with our research team
                    </Text>
                  </View>
                  <Switch
                    value={userProfile.dataConsent ?? false}
                    onValueChange={handleToggleDataConsent}
                    trackColor={{ false: colors.border, true: colors.primaryLight }}
                    thumbColor={userProfile.dataConsent ? colors.primary : colors.surface}
                    ios_backgroundColor={colors.border}
                  />
                </View>

                <View style={styles.downloadDataSection}>
                  <Text style={styles.downloadDataDesc}>{t.settings.downloadMyDataDesc}</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.settingsItem, isExporting && { opacity: 0.5 }]}
                  disabled={isExporting}
                  onPress={async () => {
                    setIsExporting(true);
                    try {
                      const exportData = {
                        exportInfo: {
                          appName: 'IRIS',
                          exportDate: new Date().toISOString(),
                          dataFormat: 'JSON',
                          gdprArticle20: 'Data portability export',
                        },
                        profile: {
                          name: userProfile.name,
                          birthday: userProfile.birthday,
                          weight: userProfile.weight,
                          height: userProfile.height,
                          goals: userProfile.goals,
                          mainFocus: userProfile.mainFocus,
                          lifeStage: userProfile.lifeStage,
                          cycleRegularity: userProfile.cycleRegularity,
                          birthControl: userProfile.birthControl,
                          hasCompletedOnboarding: userProfile.hasCompletedOnboarding,
                        },
                        cycleData: {
                          cycleLength: userProfile.cycleLength,
                          cycleLengthMin: userProfile.cycleLengthMin,
                          cycleLengthMax: userProfile.cycleLengthMax,
                          lastPeriodDate: userProfile.lastPeriodDate,
                          effectiveCycleStart: effectiveCycleStart,
                          cycleHistory: cycleHistory,
                        },
                        checkInHistory: checkIns,
                        scanResults: scans,
                        preferences: {
                          language: language,
                          units: units,
                        },
                        healthData: healthData,
                        baseline: baseline,
                      };
                      const jsonString = JSON.stringify(exportData, null, 2);
                      const dateStr = new Date().toISOString().split('T')[0];
                      const fileName = `iris-data-export-${dateStr}.json`;

                      if (Platform.OS === 'web') {
                        const blob = new Blob([jsonString], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = fileName;
                        a.click();
                        URL.revokeObjectURL(url);
                        Alert.alert(t.settings.success, t.settings.downloadMyDataSuccess);
                      } else {
                        const file = new File(Paths.cache, fileName);
                        file.write(jsonString);
                        const canShare = await Sharing.isAvailableAsync();
                        if (canShare) {
                          await Sharing.shareAsync(file.uri, {
                            mimeType: 'application/json',
                            dialogTitle: t.settings.downloadMyData,
                            UTI: 'public.json',
                          });
                        } else {
                          Alert.alert(t.settings.error, t.settings.downloadMyDataError);
                        }
                      }
                    } catch (e) {
                      logger.error('[Profile] Export data error:', e);
                      Alert.alert(t.settings.error, t.settings.downloadMyDataError);
                    } finally {
                      setIsExporting(false);
                    }
                  }}
                >
                  <Text style={styles.settingsItemText}>{t.settings.downloadMyData}</Text>
                  <ChevronRight size={20} color={colors.textTertiary} />
                </TouchableOpacity>

                <View style={styles.downloadDataSection}>
                  <Text style={styles.downloadDataDesc}>Share a professional wellness report with your healthcare provider</Text>
                </View>
                <TouchableOpacity
                  style={[styles.settingsItem, isGeneratingReport && { opacity: 0.5 }]}
                  disabled={isGeneratingReport}
                  onPress={async () => {
                    setIsGeneratingReport(true);
                    try {
                      const pdfUri = await generateDoctorReport(userProfile, scans, checkIns, currentPhase, healthData, cycleHistory, language);
                      const canShare = await Sharing.isAvailableAsync();
                      if (canShare) {
                        await Sharing.shareAsync(pdfUri, {
                          mimeType: 'application/pdf',
                          dialogTitle: 'Share Wellness Report with Doctor',
                          UTI: 'com.adobe.pdf',
                        });
                      } else {
                        Alert.alert('Error', 'Sharing is not available on this device');
                      }
                    } catch (e) {
                      logger.error('[Profile] Doctor report generation error:', e);
                      Alert.alert('Error', 'Failed to generate wellness report. Please try again.');
                    } finally {
                      setIsGeneratingReport(false);
                    }
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <FileText size={20} color={colors.primary} />
                    <Text style={styles.settingsItemText}>Share with Doctor</Text>
                  </View>
                  <ChevronRight size={20} color={colors.textTertiary} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.settingsItem}
                  onPress={() => {
                    setShowSettingsModal(false);
                    setTimeout(() => setShowPrivacyModal(true), 350);
                  }}
                >
                  <Text style={styles.settingsItemText}>{t.settings.privacyPolicy}</Text>
                  <ChevronRight size={20} color={colors.textTertiary} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.settingsItem}
                  onPress={() => {
                    setShowSettingsModal(false);
                    setTimeout(() => setShowTermsModal(true), 350);
                  }}
                >
                  <Text style={styles.settingsItemText}>{t.settings.termsOfService}</Text>
                  <ChevronRight size={20} color={colors.textTertiary} />
                </TouchableOpacity>
              </View>

              <View style={styles.privacyCard}>
                <View style={styles.privacyCardHeader}>
                  <Shield size={20} color={colors.success} />
                  <Text style={styles.privacyCardTitle}>
                    {(t as any).privacy?.yourPrivacy || 'Your Privacy'}
                  </Text>
                </View>
                <View style={styles.privacyCardContent}>
                  <Text style={styles.privacyCardBullet}>
                    • {(t as any).privacy?.eyePhotosOnDevice || 'Eye photos are analyzed on-device and never stored or sent'}
                  </Text>
                  <Text style={styles.privacyCardBullet}>
                    • {(t as any).privacy?.wellnessDataLocal || 'Your wellness data stays on your phone'}
                  </Text>
                  <Text style={styles.privacyCardBullet}>
                    • {(t as any).privacy?.noThirdPartySharing || 'No third-party data sharing'}
                  </Text>
                  <Text style={styles.privacyCardBullet}>
                    • {(t as any).privacy?.youControlData || 'You control what data is shared (Settings > Data Privacy)'}
                  </Text>
                </View>
              </View>

              <View style={styles.settingsGroup}>
                <Text style={styles.settingsGroupTitle}>Partner Sharing</Text>
                {userProfile.linkedPartnerId ? (
                  <>
                    <Text style={styles.settingsItemText}>Partner Connected</Text>
                    <TouchableOpacity
                      style={styles.settingsItem}
                      onPress={() => {
                        Alert.alert(
                          'Unlink Partner',
                          'Are you sure you want to unlink your partner?',
                          [
                            { text: 'Cancel', style: 'cancel' },
                            {
                              text: 'Unlink',
                              style: 'destructive',
                              onPress: () => {
                                // TODO: Call unlink mutation
                              }
                            }
                          ]
                        );
                      }}
                    >
                      <Text style={[styles.settingsItemText, { color: colors.primary }]}>Unlink Partner</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    style={styles.settingsItem}
                    onPress={() => setShowPartnerModal(true)}
                  >
                    <Text style={styles.settingsItemText}>Share with Partner</Text>
                    <ChevronRight size={20} color={colors.textTertiary} />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.settingsGroup}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => {
                    Alert.alert(
                      t.settings.deleteAccountTitle,
                      t.settings.deleteAccountMessage,
                      [
                        { text: t.settings.cancel, style: 'cancel' },
                        { 
                          text: t.settings.deleteAccountConfirm, 
                          style: 'destructive',
                          onPress: async () => {
                            try {
                              await deleteAllData();
                              setShowSettingsModal(false);
                              Alert.alert('', t.settings.accountDeleted);
                              router.replace('/onboarding');
                            } catch (e) {
                              logger.error('[Profile] Delete error:', e);
                              Alert.alert(t.settings.error, 'Failed to delete data. Please try again.');
                            }
                          }
                        }
                      ]
                    );
                  }}
                >
                  <Text style={styles.deleteButtonText}>{t.settings.deleteAccount}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity activeOpacity={1} onPress={() => {
                adminTapCount.current += 1;
                if (adminTapTimeout.current) clearTimeout(adminTapTimeout.current);
                adminTapTimeout.current = setTimeout(() => { adminTapCount.current = 0; }, 2000);
                if (adminTapCount.current >= 5) {
                  adminTapCount.current = 0;
                  setShowSettingsModal(false);
                  setTimeout(() => router.push('/admin-login'), 300);
                }
              }}>
                <Text style={styles.versionText}>{t.settings.version} 1.0.0</Text>
              </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showDateModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowDateModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.cycleModalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>
                  {isSelectingBirthday ? t.settings.selectBirthday : t.settings.lastPeriodStart}
                </Text>
                <TouchableOpacity onPress={() => setShowDateModal(false)}>
                  <Text style={styles.modalCloseText}>{t.settings.cancel}</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.modalSubtitle}>
                {isSelectingBirthday
                  ? t.settings.selectBirthDate
                  : t.settings.selectFirstDay}
              </Text>
              
              {!isSelectingBirthday && (
                <View style={styles.datePickerSection}>
                  <Text style={styles.datePickerLabel}>{t.settings.quickSelect}</Text>
                  <View style={styles.quickDateButtons}>
                    {[0, 7, 14, 21, 28].map((daysAgo) => {
                      const date = new Date();
                      date.setDate(date.getDate() - daysAgo);
                      const isSelected = Math.abs(selectedDate.getTime() - date.getTime()) < 86400000;
                      
                      return (
                        <TouchableOpacity
                          key={daysAgo}
                          style={[
                            styles.quickDateButton,
                            isSelected && styles.quickDateButtonActive,
                          ]}
                          onPress={() => setSelectedDate(date)}
                        >
                          <Text style={[
                            styles.quickDateButtonText,
                            isSelected && styles.quickDateButtonTextActive,
                          ]}>
                            {daysAgo === 0 ? t.settings.today : `${daysAgo}${t.settings.daysAgo}`}
                          </Text>
                          <Text style={[
                            styles.quickDateButtonDate,
                            isSelected && styles.quickDateButtonTextActive,
                          ]}>
                            {date.toLocaleDateString(language === 'en' ? 'en-US' : language, { month: 'short', day: 'numeric' })}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              <DateWheelPicker
                value={selectedDate}
                onChange={setSelectedDate}
                minimumYear={isSelectingBirthday ? 1920 : new Date().getFullYear() - 1}
                maximumDate={new Date()}
                t={t}
              />
              
              <Text style={styles.selectedDateText}>
                {t.settings.selected}: {selectedDate.toLocaleDateString(language === 'en' ? 'en-US' : language, { month: 'long', day: 'numeric', year: 'numeric' })}
              </Text>
              
              <TouchableOpacity
                style={styles.saveDateButton}
                onPress={async () => {
                  if (isSelectingBirthday) {
                    setEditedProfile({ ...editedProfile, birthday: selectedDate.toISOString() });
                    setShowDateModal(false);
                  } else {
                    await updateLastPeriodDate(selectedDate);
                    setShowDateModal(false);
                  }
                }}
              >
                <Text style={styles.saveDateButtonText}>{t.settings.save}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showUnitsModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowUnitsModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.cycleModalContent, { paddingBottom: Math.max(insets.bottom, 20) + 20 }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>{t.settings.units}</Text>
                <TouchableOpacity onPress={() => setShowUnitsModal(false)}>
                  <Text style={styles.modalCloseText}>{t.common.done}</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity
                style={[styles.settingsOption, units === 'metric' && styles.settingsOptionSelected]}
                onPress={() => {
                  updateUnits('metric');
                  setTimeout(() => setShowUnitsModal(false), 300);
                }}
              >
                <Text style={[styles.settingsOptionText, units === 'metric' && styles.settingsOptionTextSelected]}>
                  {t.settings.metric} (kg, cm)
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.settingsOption, units === 'imperial' && styles.settingsOptionSelected]}
                onPress={() => {
                  updateUnits('imperial');
                  setTimeout(() => setShowUnitsModal(false), 300);
                }}
              >
                <Text style={[styles.settingsOptionText, units === 'imperial' && styles.settingsOptionTextSelected]}>
                  {t.settings.imperial} (lb, in)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showLanguageModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowLanguageModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.cycleModalContent, { maxHeight: '70%', paddingBottom: Math.max(insets.bottom, 20) + 20 }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>{t.settings.language}</Text>
                <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                  <Text style={styles.modalCloseText}>{t.common.done}</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={{ maxHeight: 400 }} contentContainerStyle={{ padding: 16 }} bounces={false} showsVerticalScrollIndicator={false}>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[styles.settingsOption, language === lang.code && styles.settingsOptionSelected]}
                  onPress={async () => {
                    await updateLanguage(lang.code);
                    setTimeout(() => setShowLanguageModal(false), 300);
                  }}
                >
                  <Text style={[styles.settingsOptionText, language === lang.code && styles.settingsOptionTextSelected]}>
                    {lang.nativeName}
                  </Text>
                </TouchableOpacity>
              ))}
              </ScrollView>
            </View>
          </View>
        </Modal>



        <Modal
          visible={showPrivacyModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPrivacyModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.cycleModalContent, { maxHeight: '80%', paddingBottom: Math.max(insets.bottom, 20) + 20 }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>{t.settings.privacyPolicy}</Text>
                <TouchableOpacity onPress={() => setShowPrivacyModal(false)}>
                  <Text style={styles.modalCloseText}>{t.settings.close}</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.legalContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.legalTitle}>{t.settings.privacyPolicyTitle}</Text>
                <Text style={styles.legalDate}>{t.settings.privacyLastUpdated}</Text>
                
                <Text style={styles.legalSectionTitle}>{t.settings.privacySection1Title}</Text>
                <Text style={styles.legalText}>
                  {t.settings.privacySection1Text}
                </Text>
                
                <Text style={styles.legalSectionTitle}>{t.settings.privacySection2Title}</Text>
                <Text style={styles.legalText}>
                  {t.settings.privacySection2Text}
                </Text>
                
                <Text style={styles.legalSectionTitle}>{t.settings.privacySection3Title}</Text>
                <Text style={styles.legalText}>
                  {t.settings.privacySection3Text}
                </Text>
                
                <Text style={styles.legalSectionTitle}>{t.settings.privacySection4Title}</Text>
                <Text style={styles.legalText}>
                  {t.settings.privacySection4Text}
                </Text>
                
                <Text style={styles.legalSectionTitle}>{t.settings.privacySection5Title}</Text>
                <Text style={styles.legalText}>
                  {t.settings.privacySection5Text}
                </Text>
                
                <Text style={styles.legalSectionTitle}>{t.settings.privacySection6Title}</Text>
                <Text style={styles.legalText}>
                  {t.settings.privacySection6Text}
                </Text>
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showDueDateModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowDueDateModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.cycleModalContent, { paddingBottom: Math.max(insets.bottom, 20) + 20 }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>{t.settings.selectDueDate}</Text>
                <TouchableOpacity onPress={() => setShowDueDateModal(false)}>
                  <Text style={styles.modalCloseText}>{t.settings.cancel}</Text>
                </TouchableOpacity>
              </View>
              <DateWheelPicker
                value={dueDatePicker}
                onChange={setDueDatePicker}
                minimumYear={new Date().getFullYear()}
                maximumDate={new Date(new Date().getFullYear() + 1, 11, 31)}
                t={t}
              />
              <Text style={styles.selectedDateText}>
                {t.settings.selected}: {dueDatePicker.toLocaleDateString(language === 'en' ? 'en-US' : language, { month: 'long', day: 'numeric', year: 'numeric' })}
              </Text>
              <TouchableOpacity
                style={styles.saveDateButton}
                onPress={() => {
                  setEditDueDate(dueDatePicker.toISOString());
                  setShowDueDateModal(false);
                }}
              >
                <Text style={styles.saveDateButtonText}>{t.settings.save}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showBabyBirthDateModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowBabyBirthDateModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.cycleModalContent, { paddingBottom: Math.max(insets.bottom, 20) + 20 }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>{t.settings.babyBirthDate}</Text>
                <TouchableOpacity onPress={() => setShowBabyBirthDateModal(false)}>
                  <Text style={styles.modalCloseText}>{t.settings.cancel}</Text>
                </TouchableOpacity>
              </View>
              <DateWheelPicker
                value={babyBirthDatePicker}
                onChange={setBabyBirthDatePicker}
                minimumYear={new Date().getFullYear() - 5}
                maximumDate={new Date()}
                t={t}
              />
              <Text style={styles.selectedDateText}>
                {t.settings.selected}: {babyBirthDatePicker.toLocaleDateString(language === 'en' ? 'en-US' : language, { month: 'long', day: 'numeric', year: 'numeric' })}
              </Text>
              <TouchableOpacity
                style={styles.saveDateButton}
                onPress={() => {
                  setEditBabyBirthDate(babyBirthDatePicker.toISOString());
                  setShowBabyBirthDateModal(false);
                }}
              >
                <Text style={styles.saveDateButtonText}>{t.settings.save}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showTermsModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowTermsModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.cycleModalContent, { maxHeight: '80%', paddingBottom: Math.max(insets.bottom, 20) + 20 }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>{t.settings.termsOfService}</Text>
                <TouchableOpacity onPress={() => setShowTermsModal(false)}>
                  <Text style={styles.modalCloseText}>{t.settings.close}</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.legalContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.legalTitle}>{t.settings.termsTitle}</Text>
                <Text style={styles.legalDate}>{t.settings.termsLastUpdated}</Text>
                
                <Text style={styles.legalSectionTitle}>{t.settings.termsSection1Title}</Text>
                <Text style={styles.legalText}>
                  {t.settings.termsSection1Text}
                </Text>
                
                <Text style={styles.legalSectionTitle}>{t.settings.termsSection2Title}</Text>
                <Text style={styles.legalText}>
                  {t.settings.termsSection2Text}
                </Text>
                
                <Text style={styles.legalSectionTitle}>{t.settings.termsSection3Title}</Text>
                <Text style={styles.legalText}>
                  {t.settings.termsSection3Text}
                </Text>
                
                <Text style={styles.legalSectionTitle}>{t.settings.termsSection4Title}</Text>
                <Text style={styles.legalText}>
                  {t.settings.termsSection4Text}
                </Text>
                
                <Text style={styles.legalSectionTitle}>{t.settings.termsSection5Title}</Text>
                <Text style={styles.legalText}>
                  {t.settings.termsSection5Text}
                </Text>
                
                <Text style={styles.legalSectionTitle}>{t.settings.termsSection6Title}</Text>
                <Text style={styles.legalText}>
                  {t.settings.termsSection6Text}
                </Text>
                
                <Text style={styles.legalSectionTitle}>{t.settings.termsSection7Title}</Text>
                <Text style={styles.legalText}>
                  {t.settings.termsSection7Text}
                </Text>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {APPLE_HEALTH_ENABLED && (<Modal
          visible={showHealthModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowHealthModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.cycleModalContent, { maxHeight: '85%', paddingBottom: Math.max(insets.bottom, 20) + 20 }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>{t.health.appleHealth}</Text>
                <TouchableOpacity onPress={() => setShowHealthModal(false)}>
                  <Text style={styles.modalCloseText}>{t.settings.close}</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                <View style={styles.healthHeaderCard}>
                  <View style={styles.healthLogoContainer}>
                    <Heart size={28} color="#E8607A" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.healthHeaderTitle}>{t.health.appleHealth}</Text>
                    <Text style={styles.healthHeaderSubtitle}>{t.health.appleHealthDescription}</Text>
                  </View>
                </View>

                <View style={styles.healthStatusCard}>
                  <View style={styles.healthStatusRow}>
                    <Text style={styles.healthStatusLabel}>{healthConnection.isConnected ? t.health.connected : t.health.notConnected}</Text>
                    <View style={[styles.healthStatusIndicator, healthConnection.isConnected && styles.healthStatusIndicatorActive]}>
                      <Text style={[styles.healthStatusIndicatorText, healthConnection.isConnected && styles.healthStatusIndicatorTextActive]}>
                        {healthConnection.isConnected ? t.health.connected : t.health.notConnected}
                      </Text>
                    </View>
                  </View>
                  {healthConnection.isConnected && healthConnection.lastSyncDate && (
                    <Text style={styles.healthSyncInfo}>
                      {t.health.lastSynced}: {new Date(healthConnection.lastSyncDate).toLocaleString(language === 'en' ? 'en-US' : language, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' } as Intl.DateTimeFormatOptions)}
                    </Text>
                  )}
                </View>

                <Text style={styles.healthSectionTitle}>{t.health.dataTypes}</Text>

                {[
                  { id: 'sleep' as HealthDataType, label: t.health.sleep, icon: Moon, color: '#7B68EE' },
                  { id: 'menstrualCycle' as HealthDataType, label: t.health.menstrualCycle, icon: Activity, color: '#E8607A' },
                  { id: 'heartRate' as HealthDataType, label: t.health.heartRate, icon: Heart, color: '#FF6B6B' },
                  { id: 'steps' as HealthDataType, label: t.health.steps, icon: Footprints, color: '#4CAF50' },
                  { id: 'activeEnergy' as HealthDataType, label: t.health.activeEnergy, icon: Flame, color: '#FF9800' },
                  { id: 'hrv' as HealthDataType, label: t.health.hrv || 'Heart Rate Variability', icon: Zap, color: '#9C27B0' },
                  { id: 'temperature' as HealthDataType, label: t.health.temperature || 'Wrist Temperature', icon: Thermometer, color: '#FF5722' },
                ].map((item) => {
                  const isSelected = selectedHealthTypes.includes(item.id);
                  const IconComponent = item.icon;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.healthTypeItem, isSelected && styles.healthTypeItemSelected]}
                      onPress={() => {
                        setSelectedHealthTypes(prev =>
                          prev.includes(item.id)
                            ? prev.filter(t => t !== item.id)
                            : [...prev, item.id]
                        );
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.healthTypeIcon, { backgroundColor: item.color + '18' }]}>
                        <IconComponent size={18} color={item.color} />
                      </View>
                      <Text style={[styles.healthTypeLabel, isSelected && styles.healthTypeLabelSelected]}>{item.label}</Text>
                      <View style={[styles.healthCheckbox, isSelected && styles.healthCheckboxSelected]}>
                        {isSelected && <Check size={14} color="#FFFFFF" />}
                      </View>
                    </TouchableOpacity>
                  );
                })}

                {healthConnection.isConnected && healthData != null && (
                  <View style={styles.healthDataPreview}>
                    <Text style={styles.healthSectionTitle}>{t.health.healthDataFromApple}</Text>
                    {healthData?.sleepHours != null && (
                      <View style={styles.healthDataRow}>
                        <Moon size={16} color="#7B68EE" />
                        <Text style={styles.healthDataText}>{healthData?.sleepHours} {t.health.hoursSlept}</Text>
                      </View>
                    )}
                    {healthData?.menstrualFlowLevel && (
                      <View style={styles.healthDataRow}>
                        <Activity size={16} color="#E8607A" />
                        <Text style={styles.healthDataText}>{t.health.currentFlow}: {healthData?.menstrualFlowLevel}</Text>
                      </View>
                    )}
                    {healthData?.heartRate != null && (
                      <View style={styles.healthDataRow}>
                        <Heart size={16} color="#FF6B6B" />
                        <Text style={styles.healthDataText}>{healthData?.heartRate} {t.health.bpm}</Text>
                      </View>
                    )}
                    {healthData?.steps != null && (
                      <View style={styles.healthDataRow}>
                        <Footprints size={16} color="#4CAF50" />
                        <Text style={styles.healthDataText}>{healthData?.steps?.toLocaleString()} {t.health.stepsToday}</Text>
                      </View>
                    )}
                    {healthData?.hrv != null && (
                      <View style={styles.healthDataRow}>
                        <Zap size={16} color="#9C27B0" />
                        <Text style={styles.healthDataText}>{t.health.hrv || 'HRV'}: {healthData?.hrv}</Text>
                      </View>
                    )}
                    {healthData?.wristTemperature != null && (
                      <View style={styles.healthDataRow}>
                        <Thermometer size={16} color="#FF5722" />
                        <Text style={styles.healthDataText}>{t.health.temperature || 'Wrist Temp'}: {healthData?.wristTemperature}°C</Text>
                      </View>
                    )}
                  </View>
                )}

                <View style={{ gap: 10, marginTop: 20 }}>
                  {!healthConnection.isConnected ? (
                    <TouchableOpacity
                      style={styles.healthConnectButton}
                      onPress={async () => {
                        if (selectedHealthTypes.length === 0) {
                          Alert.alert(t.health.noDataTypes, t.health.selectAtLeastOne);
                          return;
                        }
                        const availability = getHealthKitAvailability();
                        if (Platform.OS === 'web') {
                          Alert.alert(t.health.notAvailableTitle, t.health.notAvailableWeb);
                          return;
                        }
                        if (Platform.OS === 'android') {
                          Alert.alert(t.health.notAvailableTitle, t.health.notAvailableAndroid);
                          return;
                        }
                        try {
                          await connectHealth(selectedHealthTypes);
                          Alert.alert(t.health.connectionSuccess, t.health.connectionSuccessMessage);
                        } catch (e) {
                          logger.log('[Health] Connection error:', e);
                          if (!availability.isAvailable) {
                            Alert.alert(t.health.notAvailableTitle, t.health.notAvailableIos);
                          }
                        }
                      }}
                      activeOpacity={0.8}
                    >
                      <Heart size={20} color="#FFFFFF" />
                      <Text style={styles.healthConnectButtonText}>{t.health.connect}</Text>
                    </TouchableOpacity>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={styles.healthSyncButton}
                        onPress={async () => {
                          try {
                            await syncHealthData();
                            Alert.alert(t.health.syncComplete, t.health.syncCompleteMessage);
                          } catch (e) {
                            logger.log('[Health] Sync error:', e);
                          }
                        }}
                        disabled={isHealthSyncing}
                        activeOpacity={0.8}
                      >
                        <RefreshCw size={18} color={colors.primary} />
                        <Text style={styles.healthSyncButtonText}>
                          {isHealthSyncing ? t.health.syncing : t.health.syncNow}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.healthDisconnectButton}
                        onPress={() => {
                          Alert.alert(
                            t.health.disconnect,
                            t.health.disconnectedMessage,
                            [
                              { text: t.settings.cancel, style: 'cancel' },
                              {
                                text: t.health.disconnect,
                                style: 'destructive',
                                onPress: async () => {
                                  await disconnectHealth();
                                },
                              },
                            ]
                          );
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.healthDisconnectButtonText}>{t.health.disconnect}</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>

                {Platform.OS !== 'ios' && (
                  <View style={styles.healthNotAvailableNote}>
                    <Text style={styles.healthNotAvailableText}>
                      {Platform.OS === 'android' ? t.health.notAvailableAndroid : t.health.notAvailableWeb}
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>)}

        <Modal
          visible={showSyncModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowSyncModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.cycleModalContent, { maxHeight: '75%', paddingBottom: Math.max(insets.bottom, 20) + 20 }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>Cloud Sync</Text>
                <TouchableOpacity onPress={() => setShowSyncModal(false)}>
                  <Text style={styles.modalCloseText}>{t.settings.close}</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 20 }}>
                  <Text style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 20 }}>
                    Back up your data to the cloud and restore it on any device using your unique Sync ID.
                  </Text>
                </View>

                <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 16 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600' as const, color: colors.textSecondary, marginBottom: 8, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>Your Sync ID</Text>
                  <Text style={{ fontSize: 20, fontWeight: '700' as const, color: colors.text, letterSpacing: 1 }}>
                    {syncId || 'Not created yet'}
                  </Text>
                  {lastSyncedAt && (
                    <Text style={{ fontSize: 12, color: colors.textTertiary, marginTop: 6 }}>
                      Last synced: {new Date(lastSyncedAt).toLocaleString()}
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  style={{ backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center' as const, marginBottom: 12, opacity: isSyncing ? 0.6 : 1 }}
                  onPress={async () => {
                    await ensureSyncId();
                    push();
                  }}
                  disabled={isSyncing}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: 16, fontWeight: '700' as const, color: '#FFFFFF' }}>
                    {isSyncing ? 'Syncing...' : 'Back Up Now'}
                  </Text>
                </TouchableOpacity>

                <View style={{ marginTop: 20, borderTopWidth: 1, borderTopColor: colors.borderLight, paddingTop: 20 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600' as const, color: colors.text, marginBottom: 12 }}>Restore from another device</Text>
                  <Text style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 12, lineHeight: 18 }}>
                    Enter the Sync ID from your other device to restore your data here.
                  </Text>
                  <TextInput
                    style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, fontSize: 16, fontWeight: '600' as const, color: colors.text, borderWidth: 1, borderColor: colors.border, textAlign: 'center' as const, letterSpacing: 1 }}
                    value={restoreId}
                    onChangeText={setRestoreId}
                    placeholder="IRIS-XXXXXXXX"
                    placeholderTextColor={colors.textTertiary}
                    autoCapitalize="characters"
                  />
                  <TouchableOpacity
                    style={{ backgroundColor: colors.surface, borderRadius: 14, paddingVertical: 14, alignItems: 'center' as const, marginTop: 12, borderWidth: 1, borderColor: colors.primary, opacity: isSyncing || !restoreId.trim() ? 0.5 : 1 }}
                    onPress={async () => {
                      const success = await restoreFromId(restoreId);
                      if (success) {
                        setRestoreId('');
                        setShowSyncModal(false);
                        Alert.alert('Restored', 'Your data has been restored. Please restart the app to see changes.');
                      }
                    }}
                    disabled={isSyncing || !restoreId.trim()}
                    activeOpacity={0.8}
                  >
                    <Text style={{ fontSize: 15, fontWeight: '600' as const, color: colors.primary }}>
                      {isSyncing ? 'Restoring...' : 'Restore Data'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showPartnerModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPartnerModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.cycleModalContent, { paddingBottom: Math.max(insets.bottom, 20) + 20 }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>Share with Partner</Text>
                <TouchableOpacity onPress={() => setShowPartnerModal(false)}>
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} bounces={false} keyboardShouldPersistTaps="handled">
                <View style={{ padding: 16 }}>
                  <Text style={styles.modalSubtitle}>Your Partner Code</Text>
                  <View style={[styles.partnerCodeContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.partnerCodeText, { color: colors.text }]}>
                      {partnerCode || 'Loading...'}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        if (partnerCode) {
                          // Copy to clipboard
                          Alert.alert('Copied', 'Partner code copied to clipboard');
                        }
                      }}
                      style={styles.copyButton}
                    >
                      <Share2 size={20} color={colors.primary} />
                    </TouchableOpacity>
                  </View>

                  <Text style={[styles.modalSubtitle, { marginTop: 24 }]}>Enter Partner&apos;s Code</Text>
                  <TextInput
                    style={[styles.partnerInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
                    placeholder="IRIS-XXXXXX"
                    placeholderTextColor={colors.textTertiary}
                    value={partnerInputCode}
                    onChangeText={setPartnerInputCode}
                    maxLength={11}
                  />

                  <TouchableOpacity
                    style={[styles.linkButton, { backgroundColor: colors.primary }]}
                    onPress={() => {
                      if (partnerInputCode) {
                        // TODO: Call link mutation
                        Alert.alert('Partner Linked!', 'You are now sharing data with your partner');
                        setShowPartnerModal(false);
                      }
                    }}
                  >
                    <Text style={styles.linkButtonText}>Link Partner</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

function createProfileStyles(colors: typeof Colors.light) { return StyleSheet.create({
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 32,
    alignItems: "center" as const,
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryLight,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 4,
  },
  profileInfoRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 20,
  },
  profileInfo: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  editButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.card,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 12,
  },
  goalsContainer: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
  },
  goalBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  goalBadgeText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: colors.primary,
  },
  menuItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: colors.text,
  },
  menuSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  premiumCard: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.warning,
  },
  premiumContent: {
    flex: 1,
    marginLeft: 16,
  },
  premiumTitle: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 2,
  },
  premiumPrice: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  premiumButton: {
    backgroundColor: colors.warning,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  premiumButtonText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: colors.card,
  },
  achievementsSection: {
    marginBottom: 24,
  },
  milestonesGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    justifyContent: "space-between" as const,
  },
  milestoneCard: {
    width: "48%",
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    alignItems: "center" as const,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  milestoneCardLocked: {
    opacity: 0.5,
  },
  milestoneIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  milestoneTitle: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: colors.text,
    marginBottom: 4,
    textAlign: "center" as const,
  },
  milestoneDescription: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: "center" as const,
  },
  milestoneDescriptionLocked: {
    color: colors.textTertiary,
  },
  monthlyComparisonSection: {
    marginBottom: 24,
  },
  comparisonItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  comparisonLabel: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 8,
  },
  comparisonMetric: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: colors.text,
  },
  comparisonChange: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  comparisonChangeImproved: {
    backgroundColor: "#6BCB7720",
  },
  comparisonChangeWorsened: {
    backgroundColor: "#FF6B6B20",
  },
  comparisonChangeText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: colors.text,
  },
  comparisonValues: {
    marginTop: 8,
  },
  comparisonValue: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: colors.text,
  },
  comparisonValuePrevious: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  editContainer: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
  },
  editTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 24,
    textAlign: "center" as const,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row" as const,
  },
  inputHalf: {
    flex: 1,
    marginRight: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  goalsGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
  },
  goalChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
    marginBottom: 8,
  },
  goalChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  goalChipText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500" as const,
  },
  goalChipTextActive: {
    color: colors.primary,
    fontWeight: "600" as const,
  },
  optionsContainer: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  optionChipText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500" as const,
  },
  optionChipTextActive: {
    color: colors.primary,
    fontWeight: "600" as const,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center" as const,
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: colors.card,
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: "center" as const,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: colors.textSecondary,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end" as const,
  },
  cycleModalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    overflow: "hidden" as const,
  },
  modalHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 8,
  },
  modalHeaderTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: colors.text,
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.primary,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  cyclePhaseItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  cyclePhaseItemActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  cyclePhaseInfo: {
    flex: 1,
  },
  cyclePhaseLabel: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.text,
    marginBottom: 2,
  },
  cyclePhaseTextActive: {
    color: colors.primary,
  },
  cyclePhaseDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  cyclePhaseDescActive: {
    color: colors.primary,
    opacity: 0.7,
  },
  datePickerSection: {
    marginTop: 8,
  },
  datePickerLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.text,
    marginBottom: 12,
  },
  quickDateButtons: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    marginBottom: 16,
    marginHorizontal: -4,
  },
  quickDateButton: {
    flex: 1,
    minWidth: "30%" as const,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: "center" as const,
    borderWidth: 2,
    borderColor: "transparent",
    marginHorizontal: 4,
    marginBottom: 8,
  },
  quickDateButtonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  quickDateButtonText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: colors.text,
    marginBottom: 2,
  },
  quickDateButtonTextActive: {
    color: colors.primary,
  },
  quickDateButtonDate: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  selectedDateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center" as const,
    marginTop: 8,
  },
  datePickerContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 8,
    marginTop: 8,
    marginBottom: 12,
    minHeight: 200,
  },
  datePicker: {
    width: "100%" as const,
    height: 200,
  },
  webDateDisplay: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center" as const,
  },
  webDateText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.text,
  },
  dateInput: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateInputText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  dateInputPlaceholder: {
    flex: 1,
    fontSize: 15,
    color: colors.textTertiary,
  },
  dateInputAge: {
    fontSize: 13,
    color: colors.textSecondary,
    marginRight: 8,
  },
  saveDateButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center" as const,
    marginTop: 20,
  },
  saveDateButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.card,
  },
  referralDashboardCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.warning + '30',
  },
  referralDashboardHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 16,
  },
  referralDashboardIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.warning + '18',
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  referralDashboardHeaderText: {
    flex: 1,
  },
  referralDashboardTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.text,
  },
  referralDashboardSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  referralMiniStats: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 14,
  },
  referralMiniStat: {
    flex: 1,
    alignItems: "center" as const,
  },
  referralMiniStatNumber: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: colors.text,
  },
  referralMiniStatLabel: {
    fontSize: 10,
    fontWeight: "500" as const,
    color: colors.textTertiary,
    marginTop: 2,
    textAlign: "center" as const,
  },
  referralMiniStatDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },
  referralProgressBarBg: {
    height: 6,
    backgroundColor: colors.surface,
    borderRadius: 3,
    marginBottom: 6,
    overflow: "hidden" as const,
  },
  referralProgressBarFill: {
    height: 6,
    backgroundColor: colors.warning,
    borderRadius: 3,
  },
  referralProgressLabel: {
    fontSize: 11,
    color: colors.textTertiary,
    marginBottom: 14,
  },
  referralShareButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  referralShareButtonText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  settingsGroup: {
    marginBottom: 24,
  },
  settingsGroupTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  settingsItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  settingsItemText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: "500" as const,
  },
  settingsItemValue: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
  },
  dataConsentItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  dataConsentContent: {
    flex: 1,
    marginRight: 12,
  },
  dataConsentItemText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: "500" as const,
    marginBottom: 4,
  },
  dataConsentItemDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  downloadDataSection: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  downloadDataDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  privacyCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  privacyCardHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 12,
    gap: 8,
  },
  privacyCardTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.text,
  },
  privacyCardContent: {
    gap: 10,
  },
  privacyCardBullet: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  deleteButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: "center" as const,
    borderWidth: 1,
    borderColor: "#ff4444",
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#ff4444",
  },
  pregnancyEditContainer: {
    marginTop: 8,
  },
  lifeStageNote: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: 8,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  versionText: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: "center" as const,
    marginTop: 8,
  },
  settingsItemRight: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
  },
  settingsOption: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  settingsOptionSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  settingsOptionText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "500" as const,
  },
  settingsOptionTextSelected: {
    fontWeight: "700" as const,
    color: colors.primary,
  },
  legalContent: {
    flex: 1,
  },
  legalTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 4,
  },
  legalDate: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  legalSectionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  legalText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  healthStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textTertiary,
    marginRight: 8,
  },
  healthStatusDotConnected: {
    backgroundColor: '#4CAF50',
  },
  healthHeaderCard: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: '#FFF0F3',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    gap: 14,
  },
  healthLogoContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#FFE0E6',
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  healthHeaderTitle: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 3,
  },
  healthHeaderSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  healthStatusCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  healthStatusRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
  },
  healthStatusLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.text,
  },
  healthStatusIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: colors.border,
  },
  healthStatusIndicatorActive: {
    backgroundColor: '#E8F5E9',
  },
  healthStatusIndicatorText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: colors.textSecondary,
  },
  healthStatusIndicatorTextActive: {
    color: '#2E7D32',
  },
  healthSyncInfo: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 6,
  },
  healthSectionTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.textSecondary,
    marginBottom: 10,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  healthTypeItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  healthTypeItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '40',
  },
  healthTypeIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  healthTypeLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500" as const,
    color: colors.text,
  },
  healthTypeLabelSelected: {
    fontWeight: "600" as const,
    color: colors.primary,
  },
  healthCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  healthCheckboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  healthDataPreview: {
    marginTop: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
  },
  healthDataRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  healthDataText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500" as const,
  },
  healthConnectButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: '#E8607A',
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
  },
  healthConnectButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: '#FFFFFF',
  },
  healthSyncButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: colors.primaryLight,
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
  },
  healthSyncButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: colors.primary,
  },
  healthDisconnectButton: {
    alignItems: "center" as const,
    paddingVertical: 12,
  },
  healthDisconnectButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: '#ff4444',
  },
  healthNotAvailableNote: {
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
  },
  healthNotAvailableText: {
    fontSize: 13,
    color: '#F57F17',
    lineHeight: 18,
    textAlign: "center" as const,
  },
  partnerCodeContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  partnerCodeText: {
    fontSize: 18,
    fontWeight: "700" as const,
    letterSpacing: 2,
  },
  copyButton: {
    padding: 8,
  },
  partnerInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginTop: 12,
  },
  linkButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginTop: 20,
  },
  linkButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: '#FFFFFF',
  },
}); }

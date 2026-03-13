import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
  ActivityIndicator,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Eye, Heart, Sparkles, ChevronDown, Gift, Check, AlertCircle } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useApp } from "@/contexts/AppContext";
import { useReferral } from "@/contexts/ReferralContext";
import { LifeStage, MainFocus } from "@/types";
import { Language, LANGUAGES } from "@/constants/translations";
import { getPendingReferralCode, clearPendingReferralCode } from "@/hooks/useDeepLinkReferral";
import { trackEvent } from "@/lib/analytics";
import logger from "@/lib/logger";

const LIFE_STAGE_OPTIONS: { value: LifeStage; label: string }[] = [
  { value: "regular", label: "Menstrual cycle" },
  { value: "pregnancy", label: "Pregnant" },
  { value: "postpartum", label: "Postpartum" },
  { value: "perimenopause", label: "Perimenopause / Menopause" },
];


const BIRTH_YEAR_OPTIONS = Array.from({ length: 80 }, (_, i) => {
  const year = new Date().getFullYear() - 16 - i;
  return year;
});

const MONTH_OPTIONS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const getDaysInMonth = (month: string, year: string): number => {
  if (!month || !year) return 31;
  return new Date(parseInt(year), parseInt(month), 0).getDate();
};

const DAY_OPTIONS = (month: string, year: string) => {
  const days = getDaysInMonth(month, year);
  return Array.from({ length: days }, (_, i) => {
    const day = i + 1;
    return { value: String(day).padStart(2, "0"), label: String(day) };
  });
};

const PickerDropdown = ({ 
  isOpen, 
  children,
  onClose,
}: { 
  isOpen: boolean; 
  children: React.ReactNode;
  onClose: () => void;
}) => {
  const { colors } = useTheme();
  const { t } = useApp();
  const styles = useMemo(() => createOnboardingStyles(colors), [colors]);
  if (!isOpen) return null;
  
  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t.common.select}</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>{t.common.done}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            style={styles.modalScrollView}
            showsVerticalScrollIndicator={true}
          >
            {children}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
};

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createOnboardingStyles(colors), [colors]);
  const { userProfile, updateUserProfile, language, updateLanguage, t } = useApp();
  const { validateCode, applyCode, appliedCode, isValidating, isApplying, trackMilestone, referralCode: ownReferralCode } = useReferral();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [selectedLifeStage, setSelectedLifeStage] = useState<LifeStage>("regular");
  const [selectedFocus, setSelectedFocus] = useState<MainFocus[]>([]);
  const [name, setName] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const [showReferralInput, setShowReferralInput] = useState(false);
  const [referralCodeInput, setReferralCodeInput] = useState("");
  const [referralStatus, setReferralStatus] = useState<"idle" | "valid" | "invalid" | "applied">(appliedCode ? "applied" : "idle");
  const [referralError, setReferralError] = useState("");
  const referralExpandAnim = useRef(new Animated.Value(0)).current;

  const [periodDay, setPeriodDay] = useState("");
  const [periodMonth, setPeriodMonth] = useState("");
  const [periodYear, setPeriodYear] = useState("");
  const [showPeriodDayPicker, setShowPeriodDayPicker] = useState(false);
  const [showPeriodMonthPicker, setShowPeriodMonthPicker] = useState(false);
  const [showPeriodYearPicker, setShowPeriodYearPicker] = useState(false);
  const [periodDateError, setPeriodDateError] = useState("");

  const [dueDay, setDueDay] = useState("");
  const [dueMonth, setDueMonth] = useState("");
  const [dueYear, setDueYear] = useState("");
  const [showDueDayPicker, setShowDueDayPicker] = useState(false);
  const [showDueMonthPicker, setShowDueMonthPicker] = useState(false);
  const [showDueYearPicker, setShowDueYearPicker] = useState(false);
  const [weeksPregnant, setWeeksPregnant] = useState("");

  const [babyBirthDay, setBabyBirthDay] = useState("");
  const [babyBirthMonth, setBabyBirthMonth] = useState("");
  const [babyBirthYear, setBabyBirthYear] = useState("");
  const [showBabyBirthDayPicker, setShowBabyBirthDayPicker] = useState(false);
  const [showBabyBirthMonthPicker, setShowBabyBirthMonthPicker] = useState(false);
  const [showBabyBirthYearPicker, setShowBabyBirthYearPicker] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"vaginal" | "cesarean" | "other">("vaginal");

  const isAnyPickerOpen = showDayPicker || showMonthPicker || showYearPicker || 
    showPeriodDayPicker || showPeriodMonthPicker || showPeriodYearPicker ||
    showDueDayPicker || showDueMonthPicker || showDueYearPicker ||
    showBabyBirthDayPicker || showBabyBirthMonthPicker || showBabyBirthYearPicker;

  const monthNames = [
    t.calendar.months.january, t.calendar.months.february, t.calendar.months.march,
    t.calendar.months.april, t.calendar.months.may, t.calendar.months.june,
    t.calendar.months.july, t.calendar.months.august, t.calendar.months.september,
    t.calendar.months.october, t.calendar.months.november, t.calendar.months.december,
  ];

  const getMonthLabel = (monthValue: string): string => {
    const idx = parseInt(monthValue) - 1;
    return idx >= 0 && idx < monthNames.length ? monthNames[idx] : monthValue;
  };

  useEffect(() => {
    if (appliedCode) {
      setReferralCodeInput(appliedCode);
      setReferralStatus("applied");
      setShowReferralInput(true);
      Animated.timing(referralExpandAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [appliedCode, referralExpandAnim]);

  useEffect(() => {
    getPendingReferralCode().then((code) => {
      if (code && !appliedCode) {
        logger.log("[Onboarding] Found pending referral code from deep link:", code);
        setReferralCodeInput(code);
        setShowReferralInput(true);
        Animated.timing(referralExpandAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }).start();
        clearPendingReferralCode();
      }
    });
  }, [appliedCode, referralExpandAnim]);

  const toggleReferralInput = () => {
    const newShow = !showReferralInput;
    setShowReferralInput(newShow);
    Animated.timing(referralExpandAnim, {
      toValue: newShow ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const extractCodeFromText = (text: string): string => {
    const match = text.match(/IRIS-[A-Z0-9]{6}/i);
    if (match) return match[0].toUpperCase();
    return text.trim().toUpperCase();
  };

  const handleValidateReferral = async () => {
    const rawInput = referralCodeInput.trim();
    if (!rawInput) return;
    const code = extractCodeFromText(rawInput);
    if (!code) return;
    logger.log("[Onboarding] Validating referral code:", code, "from input:", rawInput);

    setReferralError("");
    setReferralStatus("idle");

    if (ownReferralCode && code === ownReferralCode.toUpperCase()) {
      logger.log("[Onboarding] Self-referral blocked client-side:", code);
      setReferralError(t.onboarding.selfReferralError);
      setReferralStatus("invalid");
      return;
    }

    try {
      const result = await validateCode(code);
      logger.log("[Onboarding] Validate result:", result);
      if (result.valid) {
        const applyResult = await applyCode(code);
        logger.log("[Onboarding] Apply result:", applyResult);
        if (applyResult.success) {
          setReferralStatus("applied");
          setReferralCodeInput(code);
          logger.log("[Onboarding] Referral code applied:", code);
        } else {
          const errorMsg = applyResult.error === "self_referral" ? t.onboarding.selfReferralError
            : applyResult.error === "already_referred" ? t.onboarding.alreadyReferredError
            : applyResult.error === "monthly_limit" ? t.onboarding.monthlyLimitError
            : t.onboarding.couldNotApplyError;
          setReferralError(errorMsg);
          setReferralStatus("invalid");
        }
      } else {
        setReferralError(t.onboarding.invalidCodeError);
        setReferralStatus("invalid");
      }
    } catch (err) {
      logger.log("[Onboarding] Referral validation error:", err);
      setReferralError(t.onboarding.somethingWentWrongError);
      setReferralStatus("invalid");
    }
  };

  const handleContinue = async () => {
    if (currentStep === 0) {
      await updateLanguage(selectedLanguage);
      setCurrentStep(currentStep + 1);
    } else if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const closeAllPickers = () => {
    setShowDayPicker(false);
    setShowMonthPicker(false);
    setShowYearPicker(false);
    setShowPeriodDayPicker(false);
    setShowPeriodMonthPicker(false);
    setShowPeriodYearPicker(false);
    setShowDueDayPicker(false);
    setShowDueMonthPicker(false);
    setShowDueYearPicker(false);
    setShowBabyBirthDayPicker(false);
    setShowBabyBirthMonthPicker(false);
    setShowBabyBirthYearPicker(false);
  };

  const isPeriodDateInFuture = (day: string, month: string, year: string): boolean => {
    if (!day || !month || !year) return false;
    const selected = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return selected > today;
  };

  const validatePeriodDate = (day: string, month: string, year: string) => {
    if (isPeriodDateInFuture(day, month, year)) {
      setPeriodDateError(t.onboarding.selectDateInPast);
    } else {
      setPeriodDateError("");
    }
  };

  const getFilteredPeriodDayOptions = (month: string, year: string) => {
    const allDays = DAY_OPTIONS(month, year);
    const now = new Date();
    if (year && month && parseInt(year) === now.getFullYear() && parseInt(month) === now.getMonth() + 1) {
      return allDays.filter((d) => parseInt(d.value) <= now.getDate());
    }
    return allDays;
  };

  const getFilteredPeriodMonthOptions = (year: string) => {
    const now = new Date();
    if (year && parseInt(year) === now.getFullYear()) {
      return MONTH_OPTIONS.filter((m) => parseInt(m.value) <= now.getMonth() + 1);
    }
    return MONTH_OPTIONS;
  };

  const canComplete = name.trim().length > 0;

  const handleComplete = async () => {
    const birthdayISO = birthYear && birthMonth && birthDay
      ? new Date(parseInt(birthYear), parseInt(birthMonth) - 1, parseInt(birthDay)).toISOString()
      : "";

    let lastPeriodISO = userProfile.lastPeriodDate;
    if (periodYear && periodMonth && periodDay) {
      const periodDate = new Date(parseInt(periodYear), parseInt(periodMonth) - 1, parseInt(periodDay));
      if (periodDate > new Date()) {
        periodDate.setTime(new Date().getTime());
        logger.log('[Onboarding] Period date was in the future, clamped to today');
      }
      lastPeriodISO = periodDate.toISOString();
    }

    const dueDateISO = dueYear && dueMonth && dueDay
      ? new Date(parseInt(dueYear), parseInt(dueMonth) - 1, parseInt(dueDay)).toISOString()
      : undefined;

    const birthDateISO = babyBirthYear && babyBirthMonth && babyBirthDay
      ? new Date(parseInt(babyBirthYear), parseInt(babyBirthMonth) - 1, parseInt(babyBirthDay)).toISOString()
      : undefined;

    await updateUserProfile({
      ...userProfile,
      name: name.trim(),
      birthday: birthdayISO,
      weight: parseInt(weight) || 0,
      height: parseInt(height) || 0,
      lifeStage: selectedLifeStage,
      mainFocus: selectedFocus,
      lastPeriodDate: lastPeriodISO,
      pregnancyDueDate: selectedLifeStage === "pregnancy" ? dueDateISO : undefined,
      weeksPregnant: selectedLifeStage === "pregnancy" && weeksPregnant ? parseInt(weeksPregnant) : undefined,
      birthDate: selectedLifeStage === "postpartum" ? birthDateISO : undefined,
      deliveryType: selectedLifeStage === "postpartum" ? deliveryType : undefined,
      hasCompletedOnboarding: true,
    });

    trackMilestone("onboarded").catch((err) => {
      logger.log("[Onboarding] Failed to track onboarded milestone:", err);
    });

    trackEvent('onboarding_completed', { lifeStage: selectedLifeStage });
    router.replace("/scan" as any);
  };

  const renderStep0 = () => (
    <View style={styles.centeredStep}>
      <View style={styles.iconContainer}>
        <Eye size={64} color={colors.primary} strokeWidth={1.5} />
      </View>
      <Text style={styles.title}>{t.onboarding.selectLanguage}</Text>
      <Text style={styles.body}>{t.onboarding.language}</Text>
      <View style={styles.languageOptionsContainer}>
        {LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageOption,
              selectedLanguage === lang.code && styles.languageOptionActive,
            ]}
            onPress={() => setSelectedLanguage(lang.code)}
          >
            <View style={[
              styles.radioOuter,
              selectedLanguage === lang.code && styles.radioOuterActive,
            ]}>
              {selectedLanguage === lang.code && (
                <View style={styles.radioInner} />
              )}
            </View>
            <Text
              style={[
                styles.languageOptionText,
                selectedLanguage === lang.code && styles.languageOptionTextActive,
              ]}
            >
              {lang.nativeName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const referralInputHeight = referralExpandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 140],
  });

  const renderStep1 = () => (
    <View style={styles.centeredStep}>
      <View style={styles.iconContainer}>
        <Eye size={64} color={colors.primary} strokeWidth={1.5} />
      </View>
      <Text style={styles.title}>{t.onboarding.welcomeTitle}</Text>
      <Text style={styles.body}>
        {t.onboarding.welcomeBody1}
      </Text>
      <Text style={styles.body}>
        {t.onboarding.welcomeBody2}
      </Text>
      <Text style={styles.patentText}>
        {t.onboarding.welcomeBody3}
      </Text>

      <TouchableOpacity
        style={styles.referralToggle}
        onPress={toggleReferralInput}
        activeOpacity={0.7}
      >
        <Gift size={18} color={colors.primary} />
        <Text style={styles.referralToggleText}>{t.onboarding.haveReferralCode}</Text>
        <ChevronDown
          size={16}
          color={colors.textSecondary}
          style={showReferralInput ? { transform: [{ rotate: "180deg" }] } : undefined}
        />
      </TouchableOpacity>

      <Animated.View style={[styles.referralExpandable, { maxHeight: referralInputHeight, opacity: referralExpandAnim }]}>
        <View style={styles.referralInputRow}>
          <TextInput
            style={[
              styles.referralInput,
              referralStatus === "applied" && styles.referralInputApplied,
              referralStatus === "invalid" && styles.referralInputError,
            ]}
            value={referralCodeInput}
            onChangeText={(text) => {
              setReferralCodeInput(text.toUpperCase());
              if (referralStatus !== "idle") {
                setReferralStatus("idle");
                setReferralError("");
              }
            }}
            placeholder="e.g. IRIS-ABC123"
            placeholderTextColor={colors.textTertiary}
            autoCapitalize="characters"
            editable={referralStatus !== "applied"}
            testID="referral-code-input"
          />
          {referralStatus !== "applied" && (
            <TouchableOpacity
              style={[
                styles.referralApplyButton,
                (!referralCodeInput.trim() || isValidating || isApplying) && styles.referralApplyButtonDisabled,
              ]}
              onPress={handleValidateReferral}
              disabled={!referralCodeInput.trim() || isValidating || isApplying}
              testID="referral-apply-button"
            >
              {(isValidating || isApplying) ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.referralApplyText}>{t.onboarding.apply}</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
        {referralStatus === "applied" && (
          <View style={styles.referralSuccessRow}>
            <Check size={14} color={colors.success} />
            <Text style={styles.referralSuccessText}>{t.onboarding.referralApplied}</Text>
          </View>
        )}
        {referralStatus === "invalid" && referralError ? (
          <View style={styles.referralErrorRow}>
            <AlertCircle size={14} color={colors.error} />
            <Text style={styles.referralErrorText}>{referralError}</Text>
          </View>
        ) : null}
      </Animated.View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.centeredStep}>
      <View style={styles.iconContainer}>
        <Sparkles size={64} color={colors.primary} strokeWidth={1.5} />
      </View>
      <Text style={styles.title}>{t.onboarding.howItWorksTitle}</Text>
      <View style={styles.howItWorksContainer}>
        <View style={styles.howItWorksItem}>
          <View style={styles.howItWorksBullet} />
          <Text style={styles.howItWorksText}>{t.onboarding.howItWorksBullet1}</Text>
        </View>
        <View style={styles.howItWorksItem}>
          <View style={styles.howItWorksBullet} />
          <Text style={styles.howItWorksText}>{t.onboarding.howItWorksBullet2}</Text>
        </View>
      </View>
      <Text style={styles.body}>
        {t.onboarding.howItWorksBody}
      </Text>
      <View style={styles.noteContainer}>
        <Text style={styles.noteText}>{t.onboarding.howItWorksNote}</Text>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.formStep}>
      <View style={styles.iconContainerSmall}>
        <Heart size={48} color={colors.primary} strokeWidth={1.5} />
      </View>
      <Text style={styles.title}>{t.onboarding.personalizeTitle}</Text>

      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>{t.onboarding.yourName}</Text>
        <TextInput
          style={styles.textInput}
          value={name}
          onChangeText={setName}
          placeholder={t.onboarding.enterName}
          placeholderTextColor={colors.textTertiary}
          autoCapitalize="words"
        />
      </View>

      <View style={[styles.inputSection, styles.birthdaySection]}>
        <Text style={styles.inputLabel}>{t.onboarding.birthday}</Text>
        <View style={styles.datePickerRow}>
          <View style={[styles.datePickerItem, showDayPicker && styles.datePickerItemActive]}>
            <TouchableOpacity
              style={styles.selectInput}
              onPress={() => {
                setShowDayPicker(!showDayPicker);
                setShowMonthPicker(false);
                setShowYearPicker(false);
              }}
            >
              <Text style={birthDay ? styles.selectInputText : styles.selectInputPlaceholder}>
                {birthDay || t.onboarding.day}
              </Text>
              <ChevronDown size={16} color={colors.textTertiary} />
            </TouchableOpacity>
            <PickerDropdown isOpen={showDayPicker} onClose={() => setShowDayPicker(false)}>
              {DAY_OPTIONS(birthMonth, birthYear).map((day) => (
                <TouchableOpacity
                  key={day.value}
                  style={[
                    styles.pickerItem,
                    birthDay === day.value && styles.pickerItemActive,
                  ]}
                  onPress={() => {
                    setBirthDay(day.value);
                    setShowDayPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerText,
                      birthDay === day.value && styles.pickerTextActive,
                    ]}
                  >
                    {day.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </PickerDropdown>
          </View>

          <View style={[styles.datePickerItem, showMonthPicker && styles.datePickerItemActive]}>
            <TouchableOpacity
              style={styles.selectInput}
              onPress={() => {
                setShowMonthPicker(!showMonthPicker);
                setShowDayPicker(false);
                setShowYearPicker(false);
              }}
            >
              <Text style={birthMonth ? styles.selectInputText : styles.selectInputPlaceholder}>
                {birthMonth ? getMonthLabel(birthMonth) : t.onboarding.month}
              </Text>
              <ChevronDown size={16} color={colors.textTertiary} />
            </TouchableOpacity>
            <PickerDropdown isOpen={showMonthPicker} onClose={() => setShowMonthPicker(false)}>
              {MONTH_OPTIONS.map((month) => (
                <TouchableOpacity
                  key={month.value}
                  style={[
                    styles.pickerItem,
                    birthMonth === month.value && styles.pickerItemActive,
                  ]}
                  onPress={() => {
                    setBirthMonth(month.value);
                    setShowMonthPicker(false);
                    if (birthDay && parseInt(birthDay) > getDaysInMonth(month.value, birthYear)) {
                      setBirthDay("");
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.pickerText,
                      birthMonth === month.value && styles.pickerTextActive,
                    ]}
                  >
                    {getMonthLabel(month.value)}
                  </Text>
                </TouchableOpacity>
              ))}
            </PickerDropdown>
          </View>

          <View style={[styles.datePickerItem, showYearPicker && styles.datePickerItemActive]}>
            <TouchableOpacity
              style={styles.selectInput}
              onPress={() => {
                setShowYearPicker(!showYearPicker);
                setShowDayPicker(false);
                setShowMonthPicker(false);
              }}
            >
              <Text style={birthYear ? styles.selectInputText : styles.selectInputPlaceholder}>
                {birthYear || t.onboarding.year}
              </Text>
              <ChevronDown size={16} color={colors.textTertiary} />
            </TouchableOpacity>
            <PickerDropdown isOpen={showYearPicker} onClose={() => setShowYearPicker(false)}>
              {BIRTH_YEAR_OPTIONS.map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.pickerItem,
                    birthYear === year.toString() && styles.pickerItemActive,
                  ]}
                  onPress={() => {
                    setBirthYear(year.toString());
                    setShowYearPicker(false);
                    if (birthDay && birthMonth && parseInt(birthDay) > getDaysInMonth(birthMonth, year.toString())) {
                      setBirthDay("");
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.pickerText,
                      birthYear === year.toString() && styles.pickerTextActive,
                    ]}
                  >
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </PickerDropdown>
          </View>
        </View>
      </View>

      <View style={styles.inputRow}>
        <View style={styles.inputHalf}>
          <Text style={styles.inputLabel}>{t.onboarding.weight}</Text>
          <TextInput
            style={styles.textInput}
            value={weight}
            onChangeText={setWeight}
            placeholder="e.g. 65"
            placeholderTextColor={colors.textTertiary}
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.inputHalf}>
          <Text style={styles.inputLabel}>{t.onboarding.height}</Text>
          <TextInput
            style={styles.textInput}
            value={height}
            onChangeText={setHeight}
            placeholder="e.g. 168"
            placeholderTextColor={colors.textTertiary}
            keyboardType="number-pad"
          />
        </View>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>{t.onboarding.lifeStage}</Text>
        <Text style={styles.inputSubtext}>{t.onboarding.selectOne}</Text>
        <View style={styles.optionsContainer}>
          {LIFE_STAGE_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionCard,
                selectedLifeStage === option.value && styles.optionCardActive,
              ]}
              onPress={() => setSelectedLifeStage(option.value)}
            >
              <View style={[
                styles.radioOuter,
                selectedLifeStage === option.value && styles.radioOuterActive,
              ]}>
                {selectedLifeStage === option.value && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text
                style={[
                  styles.optionText,
                  selectedLifeStage === option.value && styles.optionTextActive,
                ]}
              >
                {option.value === 'regular' ? t.onboarding.menstrualCycle :
                 option.value === 'pregnancy' ? t.onboarding.pregnant :
                 option.value === 'postpartum' ? t.onboarding.postpartum :
                 t.onboarding.perimenopause}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {selectedLifeStage === "regular" && (
        <View style={[styles.inputSection, styles.periodSection]}>
          <Text style={styles.inputLabel}>{t.onboarding.lastPeriod}</Text>
          <Text style={styles.inputSubtext}>{t.onboarding.lastPeriodSubtext}</Text>
          <View style={styles.datePickerRow}>
            <View style={[styles.datePickerItem, showPeriodDayPicker && styles.datePickerItemActive]}>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => {
                  setShowPeriodDayPicker(!showPeriodDayPicker);
                  setShowPeriodMonthPicker(false);
                  setShowPeriodYearPicker(false);
                }}
              >
                <Text style={periodDay ? styles.selectInputText : styles.selectInputPlaceholder}>
                  {periodDay || t.onboarding.day}
                </Text>
                <ChevronDown size={16} color={colors.textTertiary} />
              </TouchableOpacity>
              <PickerDropdown isOpen={showPeriodDayPicker} onClose={() => setShowPeriodDayPicker(false)}>
                {getFilteredPeriodDayOptions(periodMonth, periodYear).map((day) => (
                  <TouchableOpacity
                    key={day.value}
                    style={[
                      styles.pickerItem,
                      periodDay === day.value && styles.pickerItemActive,
                    ]}
                    onPress={() => {
                      setPeriodDay(day.value);
                      setShowPeriodDayPicker(false);
                      validatePeriodDate(day.value, periodMonth, periodYear);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerText,
                        periodDay === day.value && styles.pickerTextActive,
                      ]}
                    >
                      {day.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </PickerDropdown>
            </View>

            <View style={[styles.datePickerItem, showPeriodMonthPicker && styles.datePickerItemActive]}>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => {
                  setShowPeriodMonthPicker(!showPeriodMonthPicker);
                  setShowPeriodDayPicker(false);
                  setShowPeriodYearPicker(false);
                }}
              >
                <Text style={periodMonth ? styles.selectInputText : styles.selectInputPlaceholder}>
                  {periodMonth ? getMonthLabel(periodMonth) : t.onboarding.month}
                </Text>
                <ChevronDown size={16} color={colors.textTertiary} />
              </TouchableOpacity>
              <PickerDropdown isOpen={showPeriodMonthPicker} onClose={() => setShowPeriodMonthPicker(false)}>
                {getFilteredPeriodMonthOptions(periodYear).map((month) => (
                  <TouchableOpacity
                    key={month.value}
                    style={[
                      styles.pickerItem,
                      periodMonth === month.value && styles.pickerItemActive,
                    ]}
                    onPress={() => {
                      setPeriodMonth(month.value);
                      setShowPeriodMonthPicker(false);
                      if (periodDay && parseInt(periodDay) > getDaysInMonth(month.value, periodYear)) {
                        setPeriodDay("");
                      }
                      validatePeriodDate(periodDay, month.value, periodYear);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerText,
                        periodMonth === month.value && styles.pickerTextActive,
                      ]}
                    >
                      {getMonthLabel(month.value)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </PickerDropdown>
            </View>

            <View style={[styles.datePickerItem, showPeriodYearPicker && styles.datePickerItemActive]}>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => {
                  setShowPeriodYearPicker(!showPeriodYearPicker);
                  setShowPeriodDayPicker(false);
                  setShowPeriodMonthPicker(false);
                }}
              >
                <Text style={periodYear ? styles.selectInputText : styles.selectInputPlaceholder}>
                  {periodYear || t.onboarding.year}
                </Text>
                <ChevronDown size={16} color={colors.textTertiary} />
              </TouchableOpacity>
              <PickerDropdown isOpen={showPeriodYearPicker} onClose={() => setShowPeriodYearPicker(false)}>
                {Array.from({ length: 3 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.pickerItem,
                      periodYear === year.toString() && styles.pickerItemActive,
                    ]}
                    onPress={() => {
                      setPeriodYear(year.toString());
                      setShowPeriodYearPicker(false);
                      const newDay = periodDay && periodMonth && parseInt(periodDay) > getDaysInMonth(periodMonth, year.toString()) ? "" : periodDay;
                      if (!newDay && periodDay) setPeriodDay("");
                      validatePeriodDate(newDay, periodMonth, year.toString());
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerText,
                        periodYear === year.toString() && styles.pickerTextActive,
                      ]}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </PickerDropdown>
            </View>
          </View>
          {periodDateError ? (
            <View style={styles.periodDateErrorContainer}>
              <AlertCircle size={14} color={colors.error} />
              <Text style={styles.periodDateErrorText}>{periodDateError}</Text>
            </View>
          ) : null}
        </View>
      )}

      {selectedLifeStage === "pregnancy" && (
        <View style={[styles.inputSection, styles.pregnancySection]}>
          <Text style={styles.inputLabel}>{t.onboarding.pregnancyInfo}</Text>
          <Text style={styles.inputSubtext}>{t.onboarding.pregnancySubtext}</Text>
          
          <View style={styles.inputHalfSection}>
            <Text style={styles.inputLabel}>{t.onboarding.weeksPregnant}</Text>
            <TextInput
              style={styles.textInput}
              value={weeksPregnant}
              onChangeText={setWeeksPregnant}
              placeholder="e.g. 12"
              placeholderTextColor={colors.textTertiary}
              keyboardType="number-pad"
            />
          </View>

          <Text style={styles.inputLabel}>{t.onboarding.dueDate}</Text>
          <View style={styles.datePickerRow}>
            <View style={[styles.datePickerItem, showDueDayPicker && styles.datePickerItemActive]}>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => {
                  setShowDueDayPicker(!showDueDayPicker);
                  setShowDueMonthPicker(false);
                  setShowDueYearPicker(false);
                }}
              >
                <Text style={dueDay ? styles.selectInputText : styles.selectInputPlaceholder}>
                  {dueDay || t.onboarding.day}
                </Text>
                <ChevronDown size={16} color={colors.textTertiary} />
              </TouchableOpacity>
              <PickerDropdown isOpen={showDueDayPicker} onClose={() => setShowDueDayPicker(false)}>
                {DAY_OPTIONS(dueMonth, dueYear).map((day) => (
                  <TouchableOpacity
                    key={day.value}
                    style={[
                      styles.pickerItem,
                      dueDay === day.value && styles.pickerItemActive,
                    ]}
                    onPress={() => {
                      setDueDay(day.value);
                      setShowDueDayPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerText,
                        dueDay === day.value && styles.pickerTextActive,
                      ]}
                    >
                      {day.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </PickerDropdown>
            </View>

            <View style={[styles.datePickerItem, showDueMonthPicker && styles.datePickerItemActive]}>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => {
                  setShowDueMonthPicker(!showDueMonthPicker);
                  setShowDueDayPicker(false);
                  setShowDueYearPicker(false);
                }}
              >
                <Text style={dueMonth ? styles.selectInputText : styles.selectInputPlaceholder}>
                  {dueMonth ? getMonthLabel(dueMonth) : t.onboarding.month}
                </Text>
                <ChevronDown size={16} color={colors.textTertiary} />
              </TouchableOpacity>
              <PickerDropdown isOpen={showDueMonthPicker} onClose={() => setShowDueMonthPicker(false)}>
                {MONTH_OPTIONS.map((month) => (
                  <TouchableOpacity
                    key={month.value}
                    style={[
                      styles.pickerItem,
                      dueMonth === month.value && styles.pickerItemActive,
                    ]}
                    onPress={() => {
                      setDueMonth(month.value);
                      setShowDueMonthPicker(false);
                      if (dueDay && parseInt(dueDay) > getDaysInMonth(month.value, dueYear)) {
                        setDueDay("");
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerText,
                        dueMonth === month.value && styles.pickerTextActive,
                      ]}
                    >
                      {getMonthLabel(month.value)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </PickerDropdown>
            </View>

            <View style={[styles.datePickerItem, showDueYearPicker && styles.datePickerItemActive]}>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => {
                  setShowDueYearPicker(!showDueYearPicker);
                  setShowDueDayPicker(false);
                  setShowDueMonthPicker(false);
                }}
              >
                <Text style={dueYear ? styles.selectInputText : styles.selectInputPlaceholder}>
                  {dueYear || t.onboarding.year}
                </Text>
                <ChevronDown size={16} color={colors.textTertiary} />
              </TouchableOpacity>
              <PickerDropdown isOpen={showDueYearPicker} onClose={() => setShowDueYearPicker(false)}>
                {Array.from({ length: 2 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.pickerItem,
                      dueYear === year.toString() && styles.pickerItemActive,
                    ]}
                    onPress={() => {
                      setDueYear(year.toString());
                      setShowDueYearPicker(false);
                      if (dueDay && dueMonth && parseInt(dueDay) > getDaysInMonth(dueMonth, year.toString())) {
                        setDueDay("");
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerText,
                        dueYear === year.toString() && styles.pickerTextActive,
                      ]}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </PickerDropdown>
            </View>
          </View>
        </View>
      )}

      {selectedLifeStage === "postpartum" && (
        <View style={[styles.inputSection, styles.postpartumSection]}>
          <Text style={styles.inputLabel}>{t.onboarding.postpartumInfo}</Text>
          <Text style={styles.inputSubtext}>{t.onboarding.postpartumSubtext}</Text>
          
          <Text style={styles.inputLabel}>{t.onboarding.babyBirthDate}</Text>
          <View style={styles.datePickerRow}>
            <View style={[styles.datePickerItem, showBabyBirthDayPicker && styles.datePickerItemActive]}>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => {
                  setShowBabyBirthDayPicker(!showBabyBirthDayPicker);
                  setShowBabyBirthMonthPicker(false);
                  setShowBabyBirthYearPicker(false);
                }}
              >
                <Text style={babyBirthDay ? styles.selectInputText : styles.selectInputPlaceholder}>
                  {babyBirthDay || t.onboarding.day}
                </Text>
                <ChevronDown size={16} color={colors.textTertiary} />
              </TouchableOpacity>
              <PickerDropdown isOpen={showBabyBirthDayPicker} onClose={() => setShowBabyBirthDayPicker(false)}>
                {DAY_OPTIONS(babyBirthMonth, babyBirthYear).map((day) => (
                  <TouchableOpacity
                    key={day.value}
                    style={[
                      styles.pickerItem,
                      babyBirthDay === day.value && styles.pickerItemActive,
                    ]}
                    onPress={() => {
                      setBabyBirthDay(day.value);
                      setShowBabyBirthDayPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerText,
                        babyBirthDay === day.value && styles.pickerTextActive,
                      ]}
                    >
                      {day.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </PickerDropdown>
            </View>

            <View style={[styles.datePickerItem, showBabyBirthMonthPicker && styles.datePickerItemActive]}>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => {
                  setShowBabyBirthMonthPicker(!showBabyBirthMonthPicker);
                  setShowBabyBirthDayPicker(false);
                  setShowBabyBirthYearPicker(false);
                }}
              >
                <Text style={babyBirthMonth ? styles.selectInputText : styles.selectInputPlaceholder}>
                  {babyBirthMonth ? getMonthLabel(babyBirthMonth) : t.onboarding.month}
                </Text>
                <ChevronDown size={16} color={colors.textTertiary} />
              </TouchableOpacity>
              <PickerDropdown isOpen={showBabyBirthMonthPicker} onClose={() => setShowBabyBirthMonthPicker(false)}>
                {MONTH_OPTIONS.map((month) => (
                  <TouchableOpacity
                    key={month.value}
                    style={[
                      styles.pickerItem,
                      babyBirthMonth === month.value && styles.pickerItemActive,
                    ]}
                    onPress={() => {
                      setBabyBirthMonth(month.value);
                      setShowBabyBirthMonthPicker(false);
                      if (babyBirthDay && parseInt(babyBirthDay) > getDaysInMonth(month.value, babyBirthYear)) {
                        setBabyBirthDay("");
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerText,
                        babyBirthMonth === month.value && styles.pickerTextActive,
                      ]}
                    >
                      {getMonthLabel(month.value)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </PickerDropdown>
            </View>

            <View style={[styles.datePickerItem, showBabyBirthYearPicker && styles.datePickerItemActive]}>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => {
                  setShowBabyBirthYearPicker(!showBabyBirthYearPicker);
                  setShowBabyBirthDayPicker(false);
                  setShowBabyBirthMonthPicker(false);
                }}
              >
                <Text style={babyBirthYear ? styles.selectInputText : styles.selectInputPlaceholder}>
                  {babyBirthYear || t.onboarding.year}
                </Text>
                <ChevronDown size={16} color={colors.textTertiary} />
              </TouchableOpacity>
              <PickerDropdown isOpen={showBabyBirthYearPicker} onClose={() => setShowBabyBirthYearPicker(false)}>
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.pickerItem,
                      babyBirthYear === year.toString() && styles.pickerItemActive,
                    ]}
                    onPress={() => {
                      setBabyBirthYear(year.toString());
                      setShowBabyBirthYearPicker(false);
                      if (babyBirthDay && babyBirthMonth && parseInt(babyBirthDay) > getDaysInMonth(babyBirthMonth, year.toString())) {
                        setBabyBirthDay("");
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerText,
                        babyBirthYear === year.toString() && styles.pickerTextActive,
                      ]}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </PickerDropdown>
            </View>
          </View>

          <Text style={[styles.inputLabel, { marginTop: 16 }]}>{t.onboarding.deliveryType}</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionCard,
                deliveryType === "vaginal" && styles.optionCardActive,
              ]}
              onPress={() => setDeliveryType("vaginal")}
            >
              <View style={[
                styles.radioOuter,
                deliveryType === "vaginal" && styles.radioOuterActive,
              ]}>
                {deliveryType === "vaginal" && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text
                style={[
                  styles.optionText,
                  deliveryType === "vaginal" && styles.optionTextActive,
                ]}
              >
{t.onboarding.vaginal}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionCard,
                deliveryType === "cesarean" && styles.optionCardActive,
              ]}
              onPress={() => setDeliveryType("cesarean")}
            >
              <View style={[
                styles.radioOuter,
                deliveryType === "cesarean" && styles.radioOuterActive,
              ]}>
                {deliveryType === "cesarean" && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text
                style={[
                  styles.optionText,
                  deliveryType === "cesarean" && styles.optionTextActive,
                ]}
              >
{t.onboarding.cesarean}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionCard,
                deliveryType === "other" && styles.optionCardActive,
              ]}
              onPress={() => setDeliveryType("other")}
            >
              <View style={[
                styles.radioOuter,
                deliveryType === "other" && styles.radioOuterActive,
              ]}>
                {deliveryType === "other" && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text
                style={[
                  styles.optionText,
                  deliveryType === "other" && styles.optionTextActive,
                ]}
              >
{t.onboarding.other}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {selectedLifeStage === "perimenopause" && (
        <View style={[styles.inputSection, styles.perimenopauseSection]}>
          <Text style={styles.inputLabel}>{t.onboarding.lastPeriodOptional}</Text>
          <Text style={styles.inputSubtext}>{t.onboarding.ifStillHavingPeriods}</Text>
          <View style={styles.datePickerRow}>
            <View style={[styles.datePickerItem, showPeriodDayPicker && styles.datePickerItemActive]}>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => {
                  setShowPeriodDayPicker(!showPeriodDayPicker);
                  setShowPeriodMonthPicker(false);
                  setShowPeriodYearPicker(false);
                }}
              >
                <Text style={periodDay ? styles.selectInputText : styles.selectInputPlaceholder}>
                  {periodDay || t.onboarding.day}
                </Text>
                <ChevronDown size={16} color={colors.textTertiary} />
              </TouchableOpacity>
              <PickerDropdown isOpen={showPeriodDayPicker} onClose={() => setShowPeriodDayPicker(false)}>
                {getFilteredPeriodDayOptions(periodMonth, periodYear).map((day) => (
                  <TouchableOpacity
                    key={day.value}
                    style={[
                      styles.pickerItem,
                      periodDay === day.value && styles.pickerItemActive,
                    ]}
                    onPress={() => {
                      setPeriodDay(day.value);
                      setShowPeriodDayPicker(false);
                      validatePeriodDate(day.value, periodMonth, periodYear);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerText,
                        periodDay === day.value && styles.pickerTextActive,
                      ]}
                    >
                      {day.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </PickerDropdown>
            </View>

            <View style={[styles.datePickerItem, showPeriodMonthPicker && styles.datePickerItemActive]}>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => {
                  setShowPeriodMonthPicker(!showPeriodMonthPicker);
                  setShowPeriodDayPicker(false);
                  setShowPeriodYearPicker(false);
                }}
              >
                <Text style={periodMonth ? styles.selectInputText : styles.selectInputPlaceholder}>
                  {periodMonth ? getMonthLabel(periodMonth) : t.onboarding.month}
                </Text>
                <ChevronDown size={16} color={colors.textTertiary} />
              </TouchableOpacity>
              <PickerDropdown isOpen={showPeriodMonthPicker} onClose={() => setShowPeriodMonthPicker(false)}>
                {getFilteredPeriodMonthOptions(periodYear).map((month) => (
                  <TouchableOpacity
                    key={month.value}
                    style={[
                      styles.pickerItem,
                      periodMonth === month.value && styles.pickerItemActive,
                    ]}
                    onPress={() => {
                      setPeriodMonth(month.value);
                      setShowPeriodMonthPicker(false);
                      if (periodDay && parseInt(periodDay) > getDaysInMonth(month.value, periodYear)) {
                        setPeriodDay("");
                      }
                      validatePeriodDate(periodDay, month.value, periodYear);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerText,
                        periodMonth === month.value && styles.pickerTextActive,
                      ]}
                    >
                      {getMonthLabel(month.value)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </PickerDropdown>
            </View>

            <View style={[styles.datePickerItem, showPeriodYearPicker && styles.datePickerItemActive]}>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => {
                  setShowPeriodYearPicker(!showPeriodYearPicker);
                  setShowPeriodDayPicker(false);
                  setShowPeriodMonthPicker(false);
                }}
              >
                <Text style={periodYear ? styles.selectInputText : styles.selectInputPlaceholder}>
                  {periodYear || t.onboarding.year}
                </Text>
                <ChevronDown size={16} color={colors.textTertiary} />
              </TouchableOpacity>
              <PickerDropdown isOpen={showPeriodYearPicker} onClose={() => setShowPeriodYearPicker(false)}>
                {Array.from({ length: 3 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.pickerItem,
                      periodYear === year.toString() && styles.pickerItemActive,
                    ]}
                    onPress={() => {
                      setPeriodYear(year.toString());
                      setShowPeriodYearPicker(false);
                      const newDay = periodDay && periodMonth && parseInt(periodDay) > getDaysInMonth(periodMonth, year.toString()) ? "" : periodDay;
                      if (!newDay && periodDay) setPeriodDay("");
                      validatePeriodDate(newDay, periodMonth, year.toString());
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerText,
                        periodYear === year.toString() && styles.pickerTextActive,
                      ]}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </PickerDropdown>
            </View>
          </View>
          {periodDateError ? (
            <View style={styles.periodDateErrorContainer}>
              <AlertCircle size={14} color={colors.error} />
              <Text style={styles.periodDateErrorText}>{periodDateError}</Text>
            </View>
          ) : null}
        </View>
      )}



      <View style={styles.disclaimerContainer}>
        <Text style={styles.disclaimerText}>
          {t.onboarding.disclaimer}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.progressContainer}>
          {[0, 1, 2, 3].map((step) => (
            <View
              key={step}
              style={[
                styles.progressDot,
                currentStep === step && styles.progressDotActive,
                currentStep > step && styles.progressDotCompleted,
              ]}
            />
          ))}
        </View>
        <Text style={styles.stepIndicatorText} accessibilityRole="text">
          {`${currentStep + 1} / 4`}
        </Text>

        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={!isAnyPickerOpen}
        >
          {currentStep === 0 && renderStep0()}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              currentStep === 3 && !canComplete && styles.primaryButtonDisabled,
            ]}
            onPress={currentStep === 3 ? handleComplete : handleContinue}
            disabled={currentStep === 3 && !canComplete}
          >
            <Text style={styles.primaryButtonText}>
              {currentStep === 3 ? t.onboarding.complete : t.onboarding.continue}
            </Text>
          </TouchableOpacity>
          {currentStep === 3 && (
            <View style={styles.legalLinksRow}>
              <TouchableOpacity
                onPress={() => setShowPrivacyModal(true)}
              >
                <Text style={styles.privacyLinkText}>{t.onboarding.privacyPolicyLink}</Text>
              </TouchableOpacity>
              <Text style={styles.legalLinkSeparator}> · </Text>
              <TouchableOpacity
                onPress={() => setShowTermsModal(true)}
              >
                <Text style={styles.privacyLinkText}>{t.onboarding.termsOfServiceLink}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={showPrivacyModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { maxHeight: '85%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.settings.privacyPolicy}</Text>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowPrivacyModal(false)}>
                <Text style={styles.modalCloseText}>{t.settings.cancel}</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
              <Text style={styles.privacyTitle}>{t.settings.privacyPolicyTitle}</Text>
              <Text style={styles.privacyDate}>{t.settings.privacyLastUpdated}</Text>
              <Text style={styles.privacySectionTitle}>{t.settings.privacySection1Title}</Text>
              <Text style={styles.privacyText}>{t.settings.privacySection1Text}</Text>
              <Text style={styles.privacySectionTitle}>{t.settings.privacySection2Title}</Text>
              <Text style={styles.privacyText}>{t.settings.privacySection2Text}</Text>
              <Text style={styles.privacySectionTitle}>{t.settings.privacySection3Title}</Text>
              <Text style={styles.privacyText}>{t.settings.privacySection3Text}</Text>
              <Text style={styles.privacySectionTitle}>{t.settings.privacySection4Title}</Text>
              <Text style={styles.privacyText}>{t.settings.privacySection4Text}</Text>
              <Text style={styles.privacySectionTitle}>{t.settings.privacySection5Title}</Text>
              <Text style={styles.privacyText}>{t.settings.privacySection5Text}</Text>
              <Text style={styles.privacySectionTitle}>{t.settings.privacySection6Title}</Text>
              <Text style={styles.privacyText}>{t.settings.privacySection6Text}</Text>
            </ScrollView>
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
          <View style={[styles.modalContainer, { maxHeight: '85%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.settings.termsOfService}</Text>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowTermsModal(false)}>
                <Text style={styles.modalCloseText}>{t.settings.cancel}</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
              <Text style={styles.privacyTitle}>{t.settings.termsTitle}</Text>
              <Text style={styles.privacyDate}>{t.settings.termsLastUpdated}</Text>
              <Text style={styles.privacySectionTitle}>{t.settings.termsSection1Title}</Text>
              <Text style={styles.privacyText}>{t.settings.termsSection1Text}</Text>
              <Text style={styles.privacySectionTitle}>{t.settings.termsSection2Title}</Text>
              <Text style={styles.privacyText}>{t.settings.termsSection2Text}</Text>
              <Text style={styles.privacySectionTitle}>{t.settings.termsSection3Title}</Text>
              <Text style={styles.privacyText}>{t.settings.termsSection3Text}</Text>
              <Text style={styles.privacySectionTitle}>{t.settings.termsSection4Title}</Text>
              <Text style={styles.privacyText}>{t.settings.termsSection4Text}</Text>
              <Text style={styles.privacySectionTitle}>{t.settings.termsSection5Title}</Text>
              <Text style={styles.privacyText}>{t.settings.termsSection5Text}</Text>
              <Text style={styles.privacySectionTitle}>{t.settings.termsSection6Title}</Text>
              <Text style={styles.privacyText}>{t.settings.termsSection6Text}</Text>
              <Text style={styles.privacySectionTitle}>{t.settings.termsSection7Title}</Text>
              <Text style={styles.privacyText}>{t.settings.termsSection7Text}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function createOnboardingStyles(colors: typeof Colors.light) { return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: "row" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    paddingVertical: 20,
    paddingHorizontal: 24,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  progressDotActive: {
    width: 24,
    backgroundColor: colors.primary,
  },
  progressDotCompleted: {
    backgroundColor: colors.primary,
    opacity: 0.4,
  },
  stepIndicatorText: {
    textAlign: "center" as const,
    fontSize: 13,
    fontWeight: "500" as const,
    color: colors.textSecondary,
    marginTop: -12,
    marginBottom: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  centeredStep: {
    minHeight: 400,
    justifyContent: "center" as const,
    paddingBottom: 40,
  },
  formStep: {
    paddingTop: 8,
  },
  iconContainer: {
    alignItems: "center" as const,
    marginBottom: 32,
  },
  iconContainerSmall: {
    alignItems: "center" as const,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "600" as const,
    color: colors.text,
    textAlign: "center" as const,
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  body: {
    fontSize: 17,
    lineHeight: 26,
    color: colors.textSecondary,
    textAlign: "center" as const,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  patentText: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textTertiary,
    textAlign: "center" as const,
    marginTop: 8,
    paddingHorizontal: 8,
    fontStyle: "italic" as const,
  },
  howItWorksContainer: {
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  howItWorksItem: {
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    marginBottom: 16,
  },
  howItWorksBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 10,
    marginRight: 12,
  },
  howItWorksText: {
    flex: 1,
    fontSize: 17,
    lineHeight: 26,
    color: colors.text,
    fontWeight: "500" as const,
  },
  noteContainer: {
    marginTop: 24,
    marginHorizontal: 8,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.primary,
    textAlign: "center" as const,
    fontWeight: "500" as const,
  },
  inputSection: {
    marginBottom: 28,
    zIndex: 1,
  },
  birthdaySection: {
    zIndex: 10,
  },
  periodSection: {
    zIndex: 9,
  },
  pregnancySection: {
    zIndex: 8,
  },
  postpartumSection: {
    zIndex: 7,
  },
  perimenopauseSection: {
    zIndex: 6,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.text,
    marginBottom: 4,
  },
  inputSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 14,
  },
  textInput: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginTop: 8,
  },
  selectInput: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginTop: 8,
  },
  selectInputText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  selectInputPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: colors.textTertiary,
  },
  datePickerRow: {
    flexDirection: "row" as const,
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  datePickerItem: {
    flex: 1,
    position: "relative" as const,
    zIndex: 1,
  },
  datePickerItemActive: {
    zIndex: 9999,
  },
  pickerListContainer: {
    position: "absolute" as const,
    top: 56,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  pickerList: {
    maxHeight: 180,
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  pickerItemActive: {
    backgroundColor: colors.primaryLight,
  },
  pickerText: {
    fontSize: 16,
    color: colors.text,
    flexShrink: 0,
  },
  pickerTextActive: {
    color: colors.primary,
    fontWeight: "600" as const,
  },
  inputRow: {
    flexDirection: "row" as const,
    gap: 12,
    marginBottom: 28,
  },
  inputHalf: {
    flex: 1,
  },
  inputHalfSection: {
    marginBottom: 16,
  },
  languageSection: {
    marginTop: 32,
    width: '100%' as const,
  },
  languageInput: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginTop: 8,
    gap: 12,
  },
  languageInputText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500' as const,
  },
  languageOptionsContainer: {
    marginTop: 24,
    gap: 12,
  },
  languageOption: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  languageOptionActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  languageOptionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: "500" as const,
  },
  languageOptionTextActive: {
    color: colors.primary,
    fontWeight: "600" as const,
  },
  optionsContainer: {
    gap: 10,
  },
  optionCard: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  optionCardActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  radioOuterActive: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    fontWeight: "500" as const,
  },
  optionTextActive: {
    color: colors.primary,
    fontWeight: "600" as const,
  },
  focusCard: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  focusCardActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  checkboxOuter: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  checkboxOuterActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: colors.card,
  },
  focusText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    fontWeight: "500" as const,
  },
  focusTextActive: {
    color: colors.primary,
    fontWeight: "600" as const,
  },
  periodDateErrorContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    marginTop: 8,
  },
  periodDateErrorText: {
    fontSize: 13,
    color: colors.error,
    fontWeight: "500" as const,
  },
  disclaimerContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  disclaimerText: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
    textAlign: "center" as const,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    padding: 20,
  },
  modalContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    width: "100%" as const,
    maxHeight: "70%" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: colors.text,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.primary,
  },
  privacyLinkContainer: {
    alignItems: "center" as const,
    paddingVertical: 12,
    marginTop: 4,
  },
  legalLinksRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingVertical: 12,
    marginTop: 4,
    flexWrap: "wrap" as const,
  },
  legalLinkSeparator: {
    fontSize: 14,
    color: colors.textTertiary,
    marginHorizontal: 4,
  },
  privacyLinkText: {
    fontSize: 14,
    color: colors.textSecondary,
    textDecorationLine: "underline" as const,
  },
  privacyTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 4,
  },
  privacyDate: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  privacySectionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  privacyText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: 12,
  },
  modalScrollView: {
    maxHeight: 400,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center" as const,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: colors.card,
    letterSpacing: 0.2,
  },
  referralToggle: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8,
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    borderRadius: 14,
    alignSelf: "center" as const,
  },
  referralToggleText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: colors.primary,
  },
  referralExpandable: {
    overflow: "hidden" as const,
    marginTop: 12,
  },
  referralInputRow: {
    flexDirection: "row" as const,
    gap: 10,
    alignItems: "center" as const,
  },
  referralInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.text,
    borderWidth: 1.5,
    borderColor: colors.border,
    letterSpacing: 1,
    textAlign: "center" as const,
  },
  referralInputApplied: {
    borderColor: colors.success,
    backgroundColor: colors.success + "10",
  },
  referralInputError: {
    borderColor: colors.error,
    backgroundColor: colors.error + "08",
  },
  referralApplyButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    minWidth: 80,
  },
  referralApplyButtonDisabled: {
    opacity: 0.5,
  },
  referralApplyText: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  referralSuccessRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 4,
  },
  referralSuccessText: {
    fontSize: 13,
    fontWeight: "500" as const,
    color: colors.success,
  },
  referralErrorRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 4,
  },
  referralErrorText: {
    fontSize: 13,
    fontWeight: "500" as const,
    color: colors.error,
  },
}); }

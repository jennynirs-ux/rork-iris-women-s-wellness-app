import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { Coffee, Wine, Thermometer, Candy, Package, Info, X, Sparkles, Meh, BatteryLow, Smile, SmilePlus, Minus, Frown, CloudRain, Zap, Battery, RefreshCw, BatteryWarning, Moon, Lightbulb, Plus, ChevronDown, ChevronUp } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useApp } from "@/contexts/AppContext";
import Colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { DailyCheckIn, BleedingLevel } from "@/types";
import { getTranslation } from "@/constants/translations";
import { translateSymptom } from "@/lib/symptomTranslation";

function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const SYMPTOMS_BY_STAGE: Record<string, string[]> = {
  regular: [
    "Cramps",
    "Headache",
    "Bloating",
    "Fatigue",
    "Breast Tenderness",
    "Mood Swings",
    "Back Pain",
    "Acne",
    "Insomnia",
    "Hot Flashes",
    "Night Sweats",
    "Brain Fog",
  ],
  pregnancy: [
    "Nausea",
    "Morning Sickness",
    "Food Aversions",
    "Frequent Urination",
    "Tender Breasts",
    "Fatigue",
    "Heartburn",
    "Back Pain",
    "Swelling",
    "Constipation",
    "Hot Flashes",
    "Night Sweats",
    "Brain Fog",
  ],
  postpartum: [
    "Night Sweats",
    "Breast Engorgement",
    "Postpartum Bleeding",
    "Perineal Pain",
    "Mood Changes",
    "Fatigue",
    "Back Pain",
    "Cramping",
    "Headache",
    "Insomnia",
    "Hot Flashes",
    "Brain Fog",
  ],
  perimenopause: [
    "Hot Flashes",
    "Night Sweats",
    "Irregular Periods",
    "Mood Changes",
    "Sleep Issues",
    "Brain Fog",
    "Joint Pain",
    "Vaginal Dryness",
    "Weight Gain",
    "Headache",
  ],
  menopause: [
    "Hot Flashes",
    "Night Sweats",
    "Vaginal Dryness",
    "Sleep Issues",
    "Weight Gain",
    "Memory Issues",
    "Mood Changes",
    "Joint Pain",
    "Dry Skin",
    "Hair Thinning",
  ],
};

const SYMPTOMS_HORMONAL_CONTRACEPTION: string[] = [
  "Breakthrough Bleeding",
  "Nausea",
  "Breast Tenderness",
  "Headaches",
  "Mood Changes",
  "Spotting",
  "Bloating",
  "Weight Changes",
  "Fatigue",
  "Hot Flashes",
  "Night Sweats",
  "Brain Fog",
];

const SYMPTOMS_IRREGULAR_CYCLE: string[] = [
  "Spotting",
  "Irregular Bleeding",
  "Missed Periods",
  "Prolonged Bleeding",
  "Cramps",
  "Mood Swings",
  "Fatigue",
  "Headache",
  "Bloating",
  "Hot Flashes",
  "Night Sweats",
  "Brain Fog",
];

export default function CheckInScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createCheckInStyles(colors), [colors]);
  const params = useLocalSearchParams();
  const selectedDate = params.date as string | undefined;
  const { addCheckIn, updateCheckIn, adaptiveQuestion, userProfile, checkIns, scans, language } = useApp();
  const t = getTranslation(language);
  
  const getRelevantSymptoms = (): string[] => {
    if (userProfile.birthControl !== "none") {
      return SYMPTOMS_HORMONAL_CONTRACEPTION;
    }
    if (userProfile.cycleRegularity === "irregular") {
      return SYMPTOMS_IRREGULAR_CYCLE;
    }
    return SYMPTOMS_BY_STAGE[userProfile.lifeStage] || SYMPTOMS_BY_STAGE.regular;
  };

  const getSymptomLabel = (symptom: string): string => {
    return translateSymptom(symptom, t.symptoms);
  };
  
  const relevantSymptoms = getRelevantSymptoms();
  const [sleep, setSleep] = useState(5);
  const [restedOption, setRestedOption] = useState<"yes" | "somewhat" | "no">("somewhat");
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [bleedingLevel, setBleedingLevel] = useState<BleedingLevel>("none");
  const [hadCaffeine, setHadCaffeine] = useState(false);
  const [hadAlcohol, setHadAlcohol] = useState(false);
  const [isIll, setIsIll] = useState(false);
  const [hadSugar, setHadSugar] = useState(false);
  const [hadProcessedFood, setHadProcessedFood] = useState(false);
  const [cervicalMucus, setCervicalMucus] = useState<"dry" | "sticky" | "creamy" | "egg_white" | undefined>(undefined);
  const [ovulationPain, setOvulationPain] = useState<boolean | undefined>(undefined);
  const [hotFlashCount, setHotFlashCount] = useState<string>("0");
  const [hotFlashSeverity, setHotFlashSeverity] = useState<"mild" | "moderate" | "severe" | undefined>(undefined);
  const [nightSweatSeverity, setNightSweatSeverity] = useState<"none" | "mild" | "moderate" | "severe">("none");
  const [tookHRT, setTookHRT] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeInfoModal, setActiveInfoModal] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    essential: true,
    bleeding: true,
    lifestyle: false,
    symptoms: false,
    menopause: false,
  });

  const INFO_CONTENT: Record<string, { title: string; content: string }> = {
    sleep: {
      title: t.checkIn.infoSleepTitle,
      content: t.checkIn.infoSleepContent,
    },
    bleeding: {
      title: t.checkIn.infoBleedingTitle,
      content: t.checkIn.infoBleedingContent,
    },
    lifestyle: {
      title: t.checkIn.infoLifestyleTitle,
      content: t.checkIn.infoLifestyleContent,
    },
    symptoms: {
      title: t.checkIn.infoSymptomsTitle,
      content: t.checkIn.infoSymptomsContent,
    },
    cervicalMucus: {
      title: t.checkIn.infoCervicalMucusTitle,
      content: t.checkIn.infoCervicalMucusContent,
    },
    ovulationPain: {
      title: t.checkIn.infoOvulationPainTitle,
      content: t.checkIn.infoOvulationPainContent,
    }
  };

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const SectionHeader = ({ sectionKey, title }: { sectionKey: string; title: string }) => {
    const isOpen = openSections[sectionKey] ?? false;
    return (
      <TouchableOpacity
        style={styles.collapsibleHeader}
        onPress={() => toggleSection(sectionKey)}
        accessibilityLabel={`${title}, ${isOpen ? 'collapse' : 'expand'}`}
        accessibilityRole="button"
      >
        <Text style={styles.collapsibleHeaderText}>{title}</Text>
        {isOpen ? (
          <ChevronUp size={20} color={colors.textSecondary} />
        ) : (
          <ChevronDown size={20} color={colors.textSecondary} />
        )}
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (selectedDate) {
      const dayCheckIns = checkIns.filter((c) => c.date === selectedDate);
      if (dayCheckIns.length > 0) {
        const existingCheckIn = dayCheckIns.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))[0];
        setSleep(existingCheckIn.sleep);
        setRestedOption(existingCheckIn.sleep >= 7 ? "yes" : existingCheckIn.sleep >= 4 ? "somewhat" : "no");
        setSymptoms(existingCheckIn.symptoms);
        setNotes(existingCheckIn.notes);
        setBleedingLevel(existingCheckIn.bleedingLevel || "none");
        setHadCaffeine(existingCheckIn.hadCaffeine || false);
        setHadAlcohol(existingCheckIn.hadAlcohol || false);
        setIsIll(existingCheckIn.isIll || false);
        setHadSugar(existingCheckIn.hadSugar || false);
        setHadProcessedFood(existingCheckIn.hadProcessedFood || false);
        setCervicalMucus(existingCheckIn.cervicalMucus);
        setOvulationPain(existingCheckIn.ovulationPain);
        setMood(existingCheckIn.mood || 5);
        setEnergy(existingCheckIn.energy || 5);
        setHotFlashCount((existingCheckIn.hotFlashCount ?? 0).toString());
        setHotFlashSeverity(existingCheckIn.hotFlashSeverity);
        setNightSweatSeverity(existingCheckIn.nightSweatSeverity || "none");
        setTookHRT(existingCheckIn.tookHRT || false);
        setIsEditMode(true);
      }
    }
  }, [selectedDate, checkIns]);

  const LOCALE_MAP: Record<string, string> = {
    en: 'en-US', sv: 'sv-SE', de: 'de-DE', fr: 'fr-FR',
    es: 'es-ES', it: 'it-IT', nl: 'nl-NL', pl: 'pl-PL', pt: 'pt-PT',
  };

  const getDateDisplay = () => {
    if (!selectedDate) return t.checkIn.today;
    const date = new Date(selectedDate + "T00:00:00");
    const todayString = getLocalDateString();
    
    if (selectedDate === todayString) return t.checkIn.today;
    
    const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" };
    return date.toLocaleDateString(LOCALE_MAP[language] || 'en-US', options);
  };

  const handleSymptomToggle = (symptom: string) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter((s) => s !== symptom));
    } else {
      setSymptoms([...symptoms, symptom]);
    }
  };

  const handleSubmit = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const checkIn: DailyCheckIn = {
      date: selectedDate || getLocalDateString(),
      timestamp: Date.now(),
      mood,
      energy,
      sleep,
      symptoms,
      notes,
      bleedingLevel,
      stressLevel: 5,
      hadCaffeine,
      hadAlcohol,
      isIll,
      hadSugar,
      hadProcessedFood,
      cervicalMucus,
      ovulationPain,
      hotFlashCount: hotFlashCount ? parseInt(hotFlashCount) : undefined,
      hotFlashSeverity,
      nightSweatSeverity,
      tookHRT,
    };
    
    if (isEditMode) {
      updateCheckIn(checkIn);
      router.back();
    } else {
      addCheckIn(checkIn);
      // If user just scanned today, go to insights to see combined results
      // Otherwise go to home
      const hasTodayScan = scans.some(s => s.date === getLocalDateString());
      if (hasTodayScan) {
        router.replace("/(tabs)/insights" as any);
      } else {
        router.replace("/(tabs)");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{isEditMode ? t.checkIn.editCheckIn : t.checkIn.howAreYouFeeling}</Text>
        <Text style={styles.dateLabel}>{getDateDisplay()}</Text>

        <SectionHeader sectionKey="essential" title={t.checkIn.sectionEssential} />
        {openSections.essential && (<>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t.checkIn.wakeUpRested}</Text>
            <TouchableOpacity
              onPress={() => setActiveInfoModal("sleep")}
              style={styles.infoButton}
              accessibilityLabel={t.checkIn.infoSleepTitle}
              accessibilityRole="button"
              accessibilityHint="Show information about sleep"
            >
              <Info size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.restedContainer}>
            {[
              { key: "yes" as const, label: t.checkIn.yesRefreshed, icon: "sparkles" as const, value: 8 },
              { key: "somewhat" as const, label: t.checkIn.somewhatRested, icon: "meh" as const, value: 5 },
              { key: "no" as const, label: t.checkIn.noTired, icon: "batteryLow" as const, value: 2 },
            ].map((option) => {
              const isActive = restedOption === option.key;
              const iconColor = isActive ? colors.primary : colors.textSecondary;
              return (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.restedChip,
                  isActive && styles.restedChipActive,
                ]}
                onPress={() => {
                  setRestedOption(option.key);
                  setSleep(option.value);
                }}
                accessibilityLabel={option.label}
                accessibilityRole="radio"
                accessibilityState={{ selected: isActive }}
              >
                <View style={styles.restedIconContainer}>
                  {option.icon === "sparkles" && <Sparkles size={24} color={iconColor} />}
                  {option.icon === "meh" && <Meh size={24} color={iconColor} />}
                  {option.icon === "batteryLow" && <BatteryLow size={24} color={iconColor} />}
                </View>
                <Text
                  style={[
                    styles.restedText,
                    isActive && styles.restedTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.checkIn.moodQuestion}</Text>
          <View style={styles.restedContainer}>
            {[
              { key: 9, label: t.checkIn.moodGreat, icon: "smilePlus" as const },
              { key: 7, label: t.checkIn.moodGood, icon: "smile" as const },
              { key: 5, label: t.checkIn.moodOkay, icon: "meh" as const },
              { key: 3, label: t.checkIn.moodLow, icon: "frown" as const },
              { key: 1, label: t.checkIn.moodBad, icon: "cloudRain" as const },
            ].map((option) => {
              const isActive = mood === option.key;
              const iconColor = isActive ? colors.primary : colors.textSecondary;
              return (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.moodChip,
                  isActive && styles.restedChipActive,
                ]}
                onPress={() => setMood(option.key)}
                accessibilityLabel={option.label}
                accessibilityRole="radio"
                accessibilityState={{ selected: isActive }}
              >
                <View style={styles.moodIconContainer}>
                  {option.icon === "smilePlus" && <SmilePlus size={22} color={iconColor} />}
                  {option.icon === "smile" && <Smile size={22} color={iconColor} />}
                  {option.icon === "meh" && <Minus size={22} color={iconColor} />}
                  {option.icon === "frown" && <Frown size={22} color={iconColor} />}
                  {option.icon === "cloudRain" && <CloudRain size={22} color={iconColor} />}
                </View>
                <Text style={[
                  styles.moodLabel,
                  isActive && styles.restedTextActive,
                ]}>{option.label}</Text>
              </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.checkIn.energyQuestion}</Text>
          <View style={styles.restedContainer}>
            {[
              { key: 9, label: t.checkIn.energyHigh, icon: "zap" as const },
              { key: 7, label: t.checkIn.energyGood, icon: "battery" as const },
              { key: 5, label: t.checkIn.energyModerate, icon: "refreshCw" as const },
              { key: 3, label: t.checkIn.energyLow, icon: "batteryWarning" as const },
              { key: 1, label: t.checkIn.energyDrained, icon: "moon" as const },
            ].map((option) => {
              const isActive = energy === option.key;
              const iconColor = isActive ? colors.primary : colors.textSecondary;
              return (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.moodChip,
                  isActive && styles.restedChipActive,
                ]}
                onPress={() => setEnergy(option.key)}
                accessibilityLabel={option.label}
                accessibilityRole="radio"
                accessibilityState={{ selected: isActive }}
              >
                <View style={styles.moodIconContainer}>
                  {option.icon === "zap" && <Zap size={22} color={iconColor} />}
                  {option.icon === "battery" && <Battery size={22} color={iconColor} />}
                  {option.icon === "refreshCw" && <RefreshCw size={22} color={iconColor} />}
                  {option.icon === "batteryWarning" && <BatteryWarning size={22} color={iconColor} />}
                  {option.icon === "moon" && <Moon size={22} color={iconColor} />}
                </View>
                <Text style={[
                  styles.moodLabel,
                  isActive && styles.restedTextActive,
                ]}>{option.label}</Text>
              </TouchableOpacity>
              );
            })}
          </View>
        </View>
        </>)}

        {userProfile.birthControl === "none" && userProfile.lifeStage === "regular" && (
          <>
          <SectionHeader sectionKey="bleeding" title={t.checkIn.sectionBleeding} />
          {openSections.bleeding && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t.checkIn.bleedingStatus}</Text>
              <TouchableOpacity
                onPress={() => setActiveInfoModal("bleeding")}
                style={styles.infoButton}
                accessibilityLabel={t.checkIn.infoBleedingTitle}
                accessibilityRole="button"
                accessibilityHint="Show information about bleeding"
              >
                <Info size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.bleedingContainer}>
              {[
                { value: "none" as BleedingLevel, label: t.checkIn.none },
                { value: "spotting" as BleedingLevel, label: t.checkIn.spotting },
                { value: "light" as BleedingLevel, label: t.checkIn.light },
                { value: "medium" as BleedingLevel, label: t.checkIn.medium },
                { value: "heavy" as BleedingLevel, label: t.checkIn.heavy },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.bleedingChip,
                    bleedingLevel === option.value && styles.bleedingChipActive,
                  ]}
                  onPress={() => setBleedingLevel(option.value)}
                  accessibilityLabel={option.label}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: bleedingLevel === option.value }}
                >
                  <Text
                    style={[
                      styles.bleedingText,
                      bleedingLevel === option.value && styles.bleedingTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          )}
          </>
        )}

        <SectionHeader sectionKey="lifestyle" title={t.checkIn.sectionLifestyle} />
        {openSections.lifestyle && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t.checkIn.lifestyleFactors}</Text>
            <TouchableOpacity
              onPress={() => setActiveInfoModal("lifestyle")}
              style={styles.infoButton}
              accessibilityLabel={t.checkIn.infoLifestyleTitle}
              accessibilityRole="button"
              accessibilityHint="Show information about lifestyle factors"
            >
              <Info size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.lifestyleContainer}>
            <TouchableOpacity
              style={[
                styles.lifestyleChip,
                hadCaffeine && styles.lifestyleChipActive,
              ]}
              onPress={() => setHadCaffeine(!hadCaffeine)}
              accessibilityLabel={t.checkIn.caffeine}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: hadCaffeine }}
            >
              <View style={styles.lifestyleContent}>
                <Coffee
                  size={16}
                  color={hadCaffeine ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.lifestyleText,
                    hadCaffeine && styles.lifestyleTextActive,
                  ]}
                >
                  {t.checkIn.caffeine}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.lifestyleChip,
                hadAlcohol && styles.lifestyleChipActive,
              ]}
              onPress={() => setHadAlcohol(!hadAlcohol)}
              accessibilityLabel={t.checkIn.alcohol}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: hadAlcohol }}
            >
              <View style={styles.lifestyleContent}>
                <Wine
                  size={16}
                  color={hadAlcohol ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.lifestyleText,
                    hadAlcohol && styles.lifestyleTextActive,
                  ]}
                >
                  {t.checkIn.alcohol}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.lifestyleChip,
                isIll && styles.lifestyleChipActive,
              ]}
              onPress={() => setIsIll(!isIll)}
              accessibilityLabel={t.checkIn.feelingIll}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isIll }}
            >
              <View style={styles.lifestyleContent}>
                <Thermometer
                  size={16}
                  color={isIll ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.lifestyleText,
                    isIll && styles.lifestyleTextActive,
                  ]}
                >
                  {t.checkIn.feelingIll}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.lifestyleChip,
                hadSugar && styles.lifestyleChipActive,
              ]}
              onPress={() => setHadSugar(!hadSugar)}
              accessibilityLabel={t.checkIn.sugar}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: hadSugar }}
            >
              <View style={styles.lifestyleContent}>
                <Candy
                  size={16}
                  color={hadSugar ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.lifestyleText,
                    hadSugar && styles.lifestyleTextActive,
                  ]}
                >
                  {t.checkIn.sugar}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.lifestyleChip,
                hadProcessedFood && styles.lifestyleChipActive,
              ]}
              onPress={() => setHadProcessedFood(!hadProcessedFood)}
              accessibilityLabel={t.checkIn.processedFood}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: hadProcessedFood }}
            >
              <View style={styles.lifestyleContent}>
                <Package
                  size={16}
                  color={hadProcessedFood ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.lifestyleText,
                    hadProcessedFood && styles.lifestyleTextActive,
                  ]}
                >
                  {t.checkIn.processedFood}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        )}

        {adaptiveQuestion.shouldAsk && adaptiveQuestion.questionType === "cervicalMucus" && (
          <View style={[styles.section, styles.adaptiveSection]}>
            <View style={styles.sectionHeader}>
              <View style={styles.adaptiveTitleRow}><Lightbulb size={18} color={colors.primary} /><Text style={styles.sectionTitle}>{t.checkIn.cervicalMucusOptional}</Text></View>
              <TouchableOpacity
                onPress={() => setActiveInfoModal("cervicalMucus")}
                style={styles.infoButton}
                accessibilityLabel={t.checkIn.infoCervicalMucusTitle}
                accessibilityRole="button"
                accessibilityHint="Show information about cervical mucus"
              >
                <Info size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.adaptiveHint}>
              {t.checkIn.improvePrediction}
            </Text>
            <View style={styles.mucusContainer}>
              {[
                { value: "dry" as const, label: t.checkIn.dry },
                { value: "sticky" as const, label: t.checkIn.sticky },
                { value: "creamy" as const, label: t.checkIn.creamy },
                { value: "egg_white" as const, label: t.checkIn.eggWhite },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.mucusChip,
                    cervicalMucus === option.value && styles.mucusChipActive,
                  ]}
                  onPress={() => setCervicalMucus(option.value)}
                  accessibilityLabel={option.label}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: cervicalMucus === option.value }}
                >
                  <Text
                    style={[
                      styles.mucusText,
                      cervicalMucus === option.value && styles.mucusTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {adaptiveQuestion.shouldAsk && adaptiveQuestion.questionType === "ovulationPain" && (
          <View style={[styles.section, styles.adaptiveSection]}>
            <View style={styles.sectionHeader}>
              <View style={styles.adaptiveTitleRow}><Lightbulb size={18} color={colors.primary} /><Text style={styles.sectionTitle}>{t.checkIn.ovulationPainOptional}</Text></View>
              <TouchableOpacity
                onPress={() => setActiveInfoModal("ovulationPain")}
                style={styles.infoButton}
                accessibilityLabel={t.checkIn.infoOvulationPainTitle}
                accessibilityRole="button"
                accessibilityHint="Show information about ovulation pain"
              >
                <Info size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.adaptiveHint}>
              {t.checkIn.ovulationPainQuestion}
            </Text>
            <View style={styles.painContainer}>
              <TouchableOpacity
                style={[
                  styles.painButton,
                  ovulationPain === true && styles.painButtonActive,
                ]}
                onPress={() => setOvulationPain(true)}
                accessibilityLabel={t.common.yes}
                accessibilityRole="radio"
                accessibilityState={{ selected: ovulationPain === true }}
              >
                <Text
                  style={[
                    styles.painButtonText,
                    ovulationPain === true && styles.painButtonTextActive,
                  ]}
                >
                  {t.common.yes}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.painButton,
                  ovulationPain === false && styles.painButtonActive,
                ]}
                onPress={() => setOvulationPain(false)}
                accessibilityLabel={t.common.no}
                accessibilityRole="radio"
                accessibilityState={{ selected: ovulationPain === false }}
              >
                <Text
                  style={[
                    styles.painButtonText,
                    ovulationPain === false && styles.painButtonTextActive,
                  ]}
                >
                  {t.common.no}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {(userProfile.lifeStage === 'perimenopause' || userProfile.lifeStage === 'menopause') && (
          <>
          <SectionHeader sectionKey="menopause" title={t.checkIn.sectionMenopause} />
          {openSections.menopause && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.menopause?.vasomotorSymptoms || 'Vasomotor Symptoms'}</Text>

            <View style={styles.subsection}>
              <Text style={styles.subsectionLabel}>{t.menopause?.hotFlashCount || 'Hot Flashes Today'}</Text>
              <View style={styles.hotFlashCounterContainer}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setHotFlashCount(Math.max(0, parseInt(hotFlashCount || '0') - 1).toString())}
                  accessibilityLabel="Decrease hot flash count"
                  accessibilityRole="button"
                >
                  <Minus size={20} color={colors.primary} />
                </TouchableOpacity>
                <TextInput
                  style={styles.counterInput}
                  value={hotFlashCount}
                  onChangeText={(text) => {
                    const num = parseInt(text) || 0;
                    if (num >= 0 && num <= 10) setHotFlashCount(num.toString());
                  }}
                  keyboardType="numeric"
                  maxLength={2}
                  accessibilityLabel="Hot flash count"
                />
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setHotFlashCount(Math.min(10, parseInt(hotFlashCount || '0') + 1).toString())}
                  accessibilityLabel="Increase hot flash count"
                  accessibilityRole="button"
                >
                  <Plus size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {parseInt(hotFlashCount || '0') > 0 && (
              <View style={styles.subsection}>
                <Text style={styles.subsectionLabel}>{t.menopause?.hotFlashSeverity || 'Severity'}</Text>
                <View style={styles.severityContainer}>
                  {(['mild', 'moderate', 'severe'] as const).map((severity) => (
                    <TouchableOpacity
                      key={severity}
                      style={[
                        styles.severityChip,
                        hotFlashSeverity === severity && styles.severityChipActive,
                      ]}
                      onPress={() => setHotFlashSeverity(severity)}
                      accessibilityLabel={t.menopause?.[severity] || severity}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: hotFlashSeverity === severity }}
                    >
                      <Text
                        style={[
                          styles.severityText,
                          hotFlashSeverity === severity && styles.severityTextActive,
                        ]}
                      >
                        {t.menopause?.[severity] || severity.charAt(0).toUpperCase() + severity.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.subsection}>
              <Text style={styles.subsectionLabel}>{t.menopause?.nightSweatSeverity || 'Night Sweats'}</Text>
              <View style={styles.severityContainer}>
                {(['none', 'mild', 'moderate', 'severe'] as const).map((severity) => (
                  <TouchableOpacity
                    key={severity}
                    style={[
                      styles.severityChip,
                      nightSweatSeverity === severity && styles.severityChipActive,
                    ]}
                    onPress={() => setNightSweatSeverity(severity)}
                    accessibilityLabel={t.menopause?.[severity] || severity}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: nightSweatSeverity === severity }}
                  >
                    <Text
                      style={[
                        styles.severityText,
                        nightSweatSeverity === severity && styles.severityTextActive,
                      ]}
                    >
                      {t.menopause?.[severity] || severity.charAt(0).toUpperCase() + severity.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.hrtChip,
                tookHRT && styles.hrtChipActive,
              ]}
              onPress={() => setTookHRT(!tookHRT)}
              accessibilityLabel={t.menopause?.tookHRT || 'Took HRT'}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: tookHRT }}
            >
              <Text
                style={[
                  styles.hrtText,
                  tookHRT && styles.hrtTextActive,
                ]}
              >
                {t.menopause?.tookHRT || 'Took HRT today'}
              </Text>
            </TouchableOpacity>
          </View>
          )}
          </>
        )}

        <SectionHeader sectionKey="symptoms" title={t.checkIn.sectionSymptoms} />
        {openSections.symptoms && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t.checkIn.anySymptoms}</Text>
            <TouchableOpacity
              onPress={() => setActiveInfoModal("symptoms")}
              style={styles.infoButton}
              accessibilityLabel={t.checkIn.infoSymptomsTitle}
              accessibilityRole="button"
              accessibilityHint="Show information about symptoms"
            >
              <Info size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.symptomsContainer}>
            {relevantSymptoms.map((symptom) => (
              <TouchableOpacity
                key={symptom}
                style={[
                  styles.symptomChip,
                  symptoms.includes(symptom) && styles.symptomChipActive,
                ]}
                onPress={() => handleSymptomToggle(symptom)}
                accessibilityLabel={getSymptomLabel(symptom)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: symptoms.includes(symptom) }}
              >
                <Text
                  style={[
                    styles.symptomText,
                    symptoms.includes(symptom) && styles.symptomTextActive,
                  ]}
                >
                  {getSymptomLabel(symptom)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.checkIn.notesOptional}</Text>
          <TextInput
            style={styles.notesInput}
            placeholder={t.checkIn.notesPlaceholder}
            placeholderTextColor={colors.textTertiary}
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            accessibilityLabel={t.checkIn.notesOptional}
            accessibilityHint="Enter optional notes about your day"
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} accessibilityLabel={isEditMode ? t.checkIn.updateCheckIn : t.checkIn.completeCheckIn} accessibilityRole="button">
          <Text style={styles.submitButtonText}>{isEditMode ? t.checkIn.updateCheckIn : t.checkIn.completeCheckIn}</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={activeInfoModal !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveInfoModal(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActiveInfoModal(null)}
          accessibilityLabel="Close information modal"
          accessibilityRole="button"
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setActiveInfoModal(null)}
              accessibilityLabel="Close"
              accessibilityRole="button"
            >
              <X size={24} color={colors.text} />
            </TouchableOpacity>
            
            {activeInfoModal !== null && (
              <>
                <Text style={styles.modalTitle}>
                  {INFO_CONTENT[activeInfoModal]?.title}
                </Text>
                <Text style={styles.modalText}>
                  {INFO_CONTENT[activeInfoModal]?.content}
                </Text>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

function createCheckInStyles(colors: typeof Colors.light) { return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  collapsibleHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingVertical: 14,
    paddingHorizontal: 4,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  collapsibleHeaderText: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: colors.text,
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 8,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.text,
    flex: 1,
  },
  infoButton: {
    padding: 4,
    marginLeft: 8,
  },
  restedContainer: {
    flexDirection: "row" as const,
    gap: 10,
  },
  restedChip: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 6,
  },
  restedChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  restedIconContainer: {
    width: 32,
    height: 32,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  restedText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500" as const,
    textAlign: "center" as const,
  },
  restedTextActive: {
    color: colors.primary,
    fontWeight: "600" as const,
  },
  bleedingContainer: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
  },
  bleedingChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bleedingChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  bleedingText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500" as const,
  },
  bleedingTextActive: {
    color: colors.primary,
    fontWeight: "600" as const,
  },
  lifestyleContainer: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
  },
  lifestyleContent: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
  },
  lifestyleChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  lifestyleChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  lifestyleText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500" as const,
  },
  lifestyleTextActive: {
    color: colors.primary,
    fontWeight: "600" as const,
  },
  adaptiveSection: {
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: "dashed" as const,
  },
  adaptiveHint: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  mucusContainer: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
  },
  mucusChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mucusChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  mucusText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500" as const,
  },
  mucusTextActive: {
    color: colors.card,
    fontWeight: "600" as const,
  },
  painContainer: {
    flexDirection: "row" as const,
    gap: 12,
  },
  painButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center" as const,
  },
  painButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  painButtonText: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: "500" as const,
  },
  painButtonTextActive: {
    color: colors.card,
    fontWeight: "600" as const,
  },
  symptomsContainer: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
  },
  symptomChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  symptomChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  symptomText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500" as const,
  },
  symptomTextActive: {
    color: colors.primary,
    fontWeight: "600" as const,
  },
  notesInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: colors.text,
    minHeight: 100,
    textAlignVertical: "top" as const,
  },
  moodChip: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 4,
    minWidth: 56,
  },
  moodIconContainer: {
    width: 28,
    height: 28,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  moodLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: "500" as const,
    textAlign: "center" as const,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: colors.card,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalCloseButton: {
    position: "absolute" as const,
    top: 16,
    right: 16,
    padding: 4,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 12,
    paddingRight: 32,
  },
  modalText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  adaptiveTitleRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    flex: 1,
  },
  subsection: {
    marginBottom: 16,
  },
  subsectionLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.text,
    marginBottom: 10,
  },
  hotFlashCounterContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 12,
  },
  counterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  counterInput: {
    width: 60,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 18,
    fontWeight: "600" as const,
    color: colors.text,
    textAlign: "center" as const,
  },
  severityContainer: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
  },
  severityChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  severityChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  severityText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500" as const,
  },
  severityTextActive: {
    color: colors.primary,
    fontWeight: "600" as const,
  },
  hrtChip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
  },
  hrtChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  hrtText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500" as const,
  },
  hrtTextActive: {
    color: colors.primary,
    fontWeight: "600" as const,
  },
}); }

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Animated,
  Linking,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import {
  Share2,
  Copy,
  Gift,
  Users,
  Trophy,
  Check,
  Clock,
  Download,
  UserPlus,
  CreditCard,
  Shield,
  X,
} from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useApp } from "@/contexts/AppContext";
import { useReferral } from "@/contexts/ReferralContext";
import { Referral } from "@/types";

function getStatusIcon(status: Referral["status"]) {
  switch (status) {
    case "sent":
      return Clock;
    case "installed":
      return Download;
    case "onboarded":
      return UserPlus;
    case "subscribed":
      return CreditCard;
    default:
      return Clock;
  }
}

function getStatusColor(status: Referral["status"]) {
  switch (status) {
    case "sent":
      return "#F4C896";
    case "installed":
      return "#A4C8E8";
    case "onboarded":
      return "#C8B6E8";
    case "subscribed":
      return "#8BC9A3";
    default:
      return "#6B6278";
  }
}

export default function ReferralScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createReferralStyles(colors), [colors]);
  const { t, language } = useApp();
  const {
    referralCode,
    referrals,
    referralStats,
    shareMessage,
    sendReferral,
    referralGoal,
  } = useReferral();

  const [copiedCode, setCopiedCode] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: referralStats.progressToNextFreeMonth / referralGoal,
        duration: 800,
        useNativeDriver: false,
      }),
    ]).start();
  }, [referralStats.progressToNextFreeMonth, referralGoal, fadeAnim, progressAnim]);

  const handleCopyCode = useCallback(async () => {
    try {
      if (Platform.OS === "web") {
        try {
          await navigator.clipboard.writeText(referralCode);
        } catch {
          const textArea = document.createElement("textarea");
          textArea.value = referralCode;
          textArea.style.position = "fixed";
          textArea.style.left = "-9999px";
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
        }
      } else {
        await Clipboard.setStringAsync(referralCode);
      }
    } catch (err) {
      console.log("Copy failed:", err);
    }
    setCopiedCode(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(t.referral.linkCopied);
    setTimeout(() => setCopiedCode(false), 2000);
  }, [referralCode, t]);

  const handleShare = useCallback(
    async (platform: "instagram" | "tiktok" | "whatsapp" | "link") => {
      const result = sendReferral(platform);
      if (!result.success && result.reason === "monthly_limit") {
        Alert.alert(t.referral.monthlyLimit, t.referral.monthlyLimitReached);
        return;
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      if (platform === "link") {
        handleCopyCode();
        return;
      }

      if (Platform.OS === "web") {
        handleCopyCode();
        return;
      }

      const encoded = encodeURIComponent(shareMessage);

      if (platform === "whatsapp") {
        const whatsappUrl = `whatsapp://send?text=${encoded}`;
        const canOpen = await Linking.canOpenURL(whatsappUrl).catch(() => false);
        if (canOpen) {
          Linking.openURL(whatsappUrl).catch(() => handleCopyCode());
        } else {
          Linking.openURL(`https://wa.me/?text=${encoded}`).catch(() => handleCopyCode());
        }
      } else if (platform === "instagram") {
        try {
          await Share.share({ message: shareMessage });
        } catch {
          handleCopyCode();
        }
      } else if (platform === "tiktok") {
        try {
          await Share.share({ message: shareMessage });
        } catch {
          handleCopyCode();
        }
      }
    },
    [sendReferral, shareMessage, t, handleCopyCode]
  );

  const getStatusLabel = useCallback(
    (status: Referral["status"]) => {
      switch (status) {
        case "sent":
          return t.referral.statusSent;
        case "installed":
          return t.referral.statusInstalled;
        case "onboarded":
          return t.referral.statusOnboarded;
        case "subscribed":
          return t.referral.statusSubscribed;
        default:
          return status;
      }
    },
    [t]
  );

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const progressText = t.referral.progressText
    .replace("{current}", String(referralStats.progressToNextFreeMonth))
    .replace("{goal}", String(referralGoal))
    .replace("{remaining}", String(referralStats.remainingForFreeMonth));

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />

      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t.referral.title}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.heroCard}>
              <View style={styles.heroIconWrap}>
                <Gift size={28} color="#FFFFFF" />
              </View>
              <Text style={styles.heroTitle}>{t.referral.subtitle}</Text>
              <Text style={styles.heroReward}>{t.referral.reward}</Text>
            </View>

            <View style={styles.codeCard}>
              <Text style={styles.codeLabel}>{t.referral.yourCode}</Text>
              <View style={styles.codeBox}>
                <Text style={styles.codeText}>{referralCode}</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.copyButton,
                  copiedCode && styles.copyButtonActive,
                ]}
                onPress={handleCopyCode}
                activeOpacity={0.7}
              >
                {copiedCode ? (
                  <Check size={18} color="#FFFFFF" />
                ) : (
                  <Copy size={18} color="#FFFFFF" />
                )}
                <Text style={styles.copyButtonText}>
                  {copiedCode
                    ? t.referral.linkCopied
                    : t.referral.copyLinkButton}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>{t.referral.shareVia || 'Share via'}</Text>
            <View style={styles.shareGrid}>
              <TouchableOpacity
                style={styles.shareCard}
                onPress={() => handleShare('whatsapp')}
                activeOpacity={0.7}
              >
                <View style={[styles.shareIconWrap, { backgroundColor: '#25D36620' }]}>
                  <Share2 size={20} color="#25D366" />
                </View>
                <Text style={styles.shareLabel}>WhatsApp</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.shareCard}
                onPress={() => handleShare('instagram')}
                activeOpacity={0.7}
              >
                <View style={[styles.shareIconWrap, { backgroundColor: '#E4405F20' }]}>
                  <Share2 size={20} color="#E4405F" />
                </View>
                <Text style={styles.shareLabel}>Instagram</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.shareCard}
                onPress={() => handleShare('tiktok')}
                activeOpacity={0.7}
              >
                <View style={[styles.shareIconWrap, { backgroundColor: '#00000020' }]}>
                  <Share2 size={20} color="#000000" />
                </View>
                <Text style={styles.shareLabel}>TikTok</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.shareCard}
                onPress={() => handleShare('link')}
                activeOpacity={0.7}
              >
                <View style={[styles.shareIconWrap, { backgroundColor: colors.primary + '20' }]}>
                  <Copy size={20} color={colors.primary} />
                </View>
                <Text style={styles.shareLabel}>{t.referral.copyLinkButton}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Trophy size={20} color={colors.warning} />
                <Text style={styles.progressTitle}>
                  {t.referral.progressTitle}
                </Text>
              </View>
              <View style={styles.progressBarBg}>
                <Animated.View
                  style={[styles.progressBarFill, { width: progressWidth }]}
                />
              </View>
              <Text style={styles.progressText}>
                {referralStats.progressToNextFreeMonth >= referralGoal
                  ? t.referral.completedText
                  : progressText}
              </Text>
            </View>

            <Text style={styles.sectionTitle}>{t.referral.dashboard}</Text>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <View
                  style={[
                    styles.statIconWrap,
                    { backgroundColor: colors.info + "20" },
                  ]}
                >
                  <Users size={18} color={colors.info} />
                </View>
                <Text style={styles.statNumber}>
                  {referralStats.sent}
                </Text>
                <Text style={styles.statLabel}>
                  {t.referral.referralsSent}
                </Text>
              </View>
              <View style={styles.statCard}>
                <View
                  style={[
                    styles.statIconWrap,
                    { backgroundColor: colors.success + "20" },
                  ]}
                >
                  <Check size={18} color={colors.success} />
                </View>
                <Text style={styles.statNumber}>
                  {referralStats.subscribed}
                </Text>
                <Text style={styles.statLabel}>
                  {t.referral.referralsConverted}
                </Text>
              </View>
              <View style={styles.statCard}>
                <View
                  style={[
                    styles.statIconWrap,
                    { backgroundColor: colors.warning + "20" },
                  ]}
                >
                  <Gift size={18} color={colors.warning} />
                </View>
                <Text style={styles.statNumber}>
                  {referralStats.freeMonthsAvailable}
                </Text>
                <Text style={styles.statLabel}>
                  {t.referral.freeMonthsAvailable}
                </Text>
              </View>
            </View>

            <View style={styles.howItWorksCard}>
              <Text style={styles.howItWorksTitle}>
                {t.referral.howItWorks}
              </Text>
              <View style={styles.stepRow}>
                <View style={[styles.stepDot, { backgroundColor: colors.info }]} />
                <Text style={styles.stepText}>{t.referral.step1}</Text>
              </View>
              <View style={styles.stepRow}>
                <View style={[styles.stepDot, { backgroundColor: colors.primary }]} />
                <Text style={styles.stepText}>{t.referral.step2}</Text>
              </View>
              <View style={styles.stepRow}>
                <View style={[styles.stepDot, { backgroundColor: colors.success }]} />
                <Text style={styles.stepText}>{t.referral.step3}</Text>
              </View>
            </View>

            {referrals.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>
                  {t.referral.recentActivity}
                </Text>
                {referrals
                  .slice()
                  .reverse()
                  .slice(0, 10)
                  .map((ref) => {
                    const StatusIcon = getStatusIcon(ref.status);
                    const statusColor = getStatusColor(ref.status);
                    return (
                      <View key={ref.id} style={styles.activityItem}>
                        <View
                          style={[
                            styles.activityIconWrap,
                            { backgroundColor: statusColor + "20" },
                          ]}
                        >
                          <StatusIcon size={16} color={statusColor} />
                        </View>
                        <View style={styles.activityInfo}>
                          <Text style={styles.activityStatus}>
                            {getStatusLabel(ref.status)}
                          </Text>
                          <Text style={styles.activityDate}>
                            {new Date(ref.createdAt).toLocaleDateString(
                              language === "en" ? "en-US" : language,
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}{" "}
                            {t.referral.via} {ref.platform}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.activityBadge,
                            { backgroundColor: statusColor + "20" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.activityBadgeText,
                              { color: statusColor },
                            ]}
                          >
                            {getStatusLabel(ref.status)}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
              </>
            )}

            {referrals.length === 0 && (
              <View style={styles.emptyState}>
                <Users
                  size={40}
                  color={colors.textTertiary}
                />
                <Text style={styles.emptyTitle}>
                  {t.referral.noReferralsYet}
                </Text>
                <Text style={styles.emptySubtitle}>
                  {t.referral.startSharing}
                </Text>
              </View>
            )}

            <View style={styles.fraudNotice}>
              <Shield size={14} color={colors.textTertiary} />
              <Text style={styles.fraudNoticeText}>
                {t.referral.fraudNotice}
              </Text>
            </View>
            <Text style={styles.termsText}>{t.referral.termsApply}</Text>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function createReferralStyles(colors: typeof Colors.light) { return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: colors.text,
  },
  closeButton: {
    position: "absolute" as const,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 24,
    alignItems: "center" as const,
    marginBottom: 20,
  },
  heroIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#FFFFFF",
    textAlign: "center" as const,
    marginBottom: 8,
    lineHeight: 22,
  },
  heroReward: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center" as const,
  },
  codeCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    alignItems: "center" as const,
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  codeLabel: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: colors.textSecondary,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  codeBox: {
    backgroundColor: colors.primaryLight + "60",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderWidth: 2,
    borderColor: colors.primary + "30",
    borderStyle: "dashed" as const,
    marginBottom: 16,
  },
  codeText: {
    fontSize: 26,
    fontWeight: "800" as const,
    color: colors.primary,
    letterSpacing: 3,
  },
  copyButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
    width: "100%" as const,
  },
  copyButtonActive: {
    backgroundColor: colors.success,
  },
  copyButtonText: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.textSecondary,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 4,
  },
  shareGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 10,
    marginBottom: 24,
  },
  shareCard: {
    flex: 1,
    minWidth: "22%" as const,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: "center" as const,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shareIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 8,
  },
  shareLabel: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: colors.text,
    textAlign: "center" as const,
  },
  progressCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: colors.warning,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    marginBottom: 14,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.text,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: colors.surface,
    borderRadius: 5,
    marginBottom: 10,
    overflow: "hidden" as const,
  },
  progressBarFill: {
    height: 10,
    backgroundColor: colors.warning,
    borderRadius: 5,
  },
  progressText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: "row" as const,
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: "center" as const,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "500" as const,
    color: colors.textSecondary,
    textAlign: "center" as const,
  },
  howItWorksCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  howItWorksTitle: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 14,
  },
  stepRow: {
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    gap: 12,
    marginBottom: 10,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  activityItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
  },
  activityIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityStatus: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.text,
  },
  activityDate: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },
  activityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  activityBadgeText: {
    fontSize: 11,
    fontWeight: "600" as const,
  },
  emptyState: {
    alignItems: "center" as const,
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.text,
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center" as const,
    lineHeight: 18,
  },
  fraudNotice: {
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    gap: 8,
    paddingHorizontal: 4,
    marginTop: 8,
  },
  fraudNoticeText: {
    flex: 1,
    fontSize: 11,
    color: colors.textTertiary,
    lineHeight: 16,
  },
  termsText: {
    fontSize: 11,
    color: colors.textTertiary,
    textAlign: "center" as const,
    marginTop: 8,
    marginBottom: 8,
  },
}); }

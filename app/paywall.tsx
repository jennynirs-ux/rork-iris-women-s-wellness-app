import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Crown,
  X,
  Check,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  Heart,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { trackEvent } from "@/lib/analytics";
import { useApp } from "@/contexts/AppContext";
import { getTranslation } from "@/constants/translations";

export default function PaywallScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { offering, isPurchasing, purchase, restore, isRestoring, isPremium } =
    useSubscription();
  const { language } = useApp();
  const t = getTranslation(language);
  const styles = useMemo(() => createPaywallStyles(colors), [colors]);
  const [selectedPkg, setSelectedPkg] = useState<"monthly" | "annual">("annual");

  React.useEffect(() => {
    trackEvent('paywall_viewed');
  }, []);

  const monthlyPkg = offering?.availablePackages?.find(
    (p: any) => p.packageType === "MONTHLY"
  );
  const annualPkg = offering?.availablePackages?.find(
    (p: any) => p.packageType === "ANNUAL"
  );

  const isRCAvailable = offering !== null;

  const handlePurchase = async () => {
    if (!isRCAvailable) {
      Alert.alert(
        t.paywall.errorTitle,
        t.paywall.purchaseNotAvailablePreview
      );
      return;
    }
    const pkg = selectedPkg === "monthly" ? monthlyPkg : annualPkg;
    if (!pkg) {
      Alert.alert(t.paywall.errorTitle, t.paywall.packageNotAvailable);
      return;
    }
    try {
      await purchase(pkg);
      trackEvent('paywall_converted', { plan: selectedPkg });
      trackEvent('subscription_started', { plan: selectedPkg });
      Alert.alert(t.paywall.welcomePremiumTitle, t.paywall.welcomePremiumMessage, [
        { text: t.paywall.continueButton, onPress: () => router.back() },
      ]);
    } catch (e: any) {
      if (e?.userCancelled) return;
      console.log("[Paywall] Purchase error:", e);
      Alert.alert(t.paywall.purchaseFailedTitle, e?.message || t.paywall.purchaseFailedMessage);
    }
  };

  const handleRestore = async () => {
    if (!isRCAvailable) {
      Alert.alert(
        t.paywall.errorTitle,
        t.paywall.restoreNotAvailablePreview
      );
      return;
    }
    try {
      await restore();
      if (isPremium) {
        Alert.alert(t.paywall.restoredTitle, t.paywall.restoredMessage, [
          { text: t.paywall.continueButton, onPress: () => router.back() },
        ]);
      } else {
        Alert.alert(t.paywall.noPurchasesTitle, t.paywall.noPurchasesMessage);
      }
    } catch (e: any) {
      console.log("[Paywall] Restore error:", e);
      Alert.alert(t.paywall.restoreFailedTitle, t.paywall.restoreFailedMessage);
    }
  };

  const monthlyPrice = monthlyPkg?.product?.priceString || "$4.99";
  const annualPrice = annualPkg?.product?.priceString || "$29.99";
  const annualMonthly = annualPkg?.product?.price
    ? `$${(annualPkg.product.price / 12).toFixed(2)}`
    : "$2.50";

  const features = [
    { icon: Sparkles, label: t.paywall.featureAdvancedInsights, color: "#B8A4E8" },
    { icon: TrendingUp, label: t.paywall.featureTrendTracking, color: "#8BC9A3" },
    { icon: Zap, label: t.paywall.featureHabitOptimization, color: "#F4C896" },
    { icon: Heart, label: t.paywall.featureCyclePrograms, color: "#E89BA4" },
    { icon: Shield, label: t.paywall.featurePrioritySupport, color: "#A4C8E8" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <X size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.heroSection}>
          <View style={styles.crownContainer}>
            <Crown size={44} color="#F4C896" />
          </View>
          <Text style={styles.heroTitle}>{t.paywall.unlockTitle}</Text>
          <Text style={styles.heroSubtitle}>
            {t.paywall.unlockSubtitle}
          </Text>
        </View>

        <View style={styles.featuresSection}>
          {features.map((feature, index) => {
            const IconComp = feature.icon;
            return (
              <View key={index} style={styles.featureRow}>
                <View style={[styles.featureIcon, { backgroundColor: feature.color + "18" }]}>
                  <IconComp size={18} color={feature.color} />
                </View>
                <Text style={styles.featureText}>{feature.label}</Text>
                <Check size={16} color={colors.success} />
              </View>
            );
          })}
        </View>

        <View style={styles.plansSection}>
          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPkg === "annual" && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPkg("annual")}
            activeOpacity={0.7}
          >
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>{t.paywall.bestValue}</Text>
            </View>
            <View style={styles.planRadio}>
              <View
                style={[
                  styles.planRadioInner,
                  selectedPkg === "annual" && styles.planRadioInnerSelected,
                ]}
              />
            </View>
            <View style={styles.planInfo}>
              <Text style={styles.planName}>{t.paywall.yearly}</Text>
              <Text style={styles.planPriceMain}>{annualPrice}{t.paywall.perYear}</Text>
              <Text style={styles.planPriceSub}>{annualMonthly}{t.paywall.perMonth}</Text>
            </View>
            <View style={styles.planSavings}>
              <Text style={styles.planSavingsText}>{t.paywall.savePercent}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPkg === "monthly" && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPkg("monthly")}
            activeOpacity={0.7}
          >
            <View style={styles.planRadio}>
              <View
                style={[
                  styles.planRadioInner,
                  selectedPkg === "monthly" && styles.planRadioInnerSelected,
                ]}
              />
            </View>
            <View style={styles.planInfo}>
              <Text style={styles.planName}>{t.paywall.monthly}</Text>
              <Text style={styles.planPriceMain}>{monthlyPrice}{t.paywall.perMonth}</Text>
              <Text style={styles.planPriceSub}>{t.paywall.cancelAnytime}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.socialProof}>
          <Text style={styles.socialProofText}>
            {t.paywall.socialProof}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.purchaseButton, (isPurchasing || isRestoring) && styles.purchaseButtonDisabled]}
          onPress={handlePurchase}
          disabled={isPurchasing || isRestoring}
          activeOpacity={0.8}
        >
          {isPurchasing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.purchaseButtonText}>{t.paywall.startFreeTrial}</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.trialNote}>
          {t.paywall.trialNote} {selectedPkg === "annual" ? annualPrice + t.paywall.perYear : monthlyPrice + t.paywall.perMonth}
        </Text>

        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={isPurchasing || isRestoring}
        >
          {isRestoring ? (
            <ActivityIndicator size="small" color={colors.textSecondary} />
          ) : (
            <Text style={styles.restoreButtonText}>{t.paywall.restorePurchases}</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.legalText}>
          {t.paywall.legalText}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function createPaywallStyles(colors: typeof Colors.light) { return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  closeButton: {
    alignSelf: "flex-end" as const,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginTop: 8,
    marginRight: -4,
  },
  heroSection: {
    alignItems: "center" as const,
    marginTop: 8,
    marginBottom: 32,
  },
  crownContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF8EE",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 20,
    shadowColor: "#F4C896",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "800" as const,
    color: colors.text,
    textAlign: "center" as const,
    lineHeight: 38,
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center" as const,
    lineHeight: 22,
    maxWidth: 280,
  },
  featuresSection: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  featureRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 14,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500" as const,
    color: colors.text,
  },
  plansSection: {
    gap: 12,
    marginBottom: 20,
  },
  planCard: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 2,
    borderColor: colors.border,
    position: "relative" as const,
    overflow: "hidden" as const,
  },
  planCardSelected: {
    borderColor: colors.primary,
    backgroundColor: "#FDFBFF",
  },
  planBadge: {
    position: "absolute" as const,
    top: 0,
    right: 0,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 10,
  },
  planBadgeText: {
    fontSize: 10,
    fontWeight: "800" as const,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  planRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 14,
  },
  planRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "transparent",
  },
  planRadioInnerSelected: {
    backgroundColor: colors.primary,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 2,
  },
  planPriceMain: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.text,
  },
  planPriceSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  planSavings: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  planSavingsText: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: "#4CAF50",
  },
  socialProof: {
    marginBottom: 20,
    alignItems: "center" as const,
  },
  socialProofText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: "italic" as const,
    textAlign: "center" as const,
  },
  purchaseButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  purchaseButtonDisabled: {
    opacity: 0.7,
  },
  purchaseButtonText: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  trialNote: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center" as const,
    marginTop: 10,
    marginBottom: 16,
  },
  restoreButton: {
    alignItems: "center" as const,
    paddingVertical: 12,
  },
  restoreButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.textSecondary,
    textDecorationLine: "underline" as const,
  },
  legalText: {
    fontSize: 10,
    color: colors.textTertiary,
    textAlign: "center" as const,
    lineHeight: 15,
    marginTop: 12,
    paddingHorizontal: 8,
  },
}); }

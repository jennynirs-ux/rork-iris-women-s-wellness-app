import { useState, useEffect } from "react";
import { Platform } from "react-native";
import createContextHook from "@nkzw/create-context-hook";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Constants from "expo-constants";

let Purchases: any = null;
type PurchasesPackage = any;

function isExpoGo(): boolean {
  return Constants.appOwnership === 'expo' || Constants.executionEnvironment === 'storeClient';
}

function getRCToken() {
  if (__DEV__ || Platform.OS === "web")
    return process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY;
  return Platform.select({
    ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY,
    android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY,
    default: process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY,
  });
}

if (Platform.OS !== "web" && !isExpoGo()) {
  try {
    Purchases = require("react-native-purchases").default;
    const rcToken = getRCToken();
    if (rcToken && Purchases) {
      console.log("[RC] Configuring RevenueCat");
      Purchases.configure({ apiKey: rcToken });
    }
  } catch (e) {
    console.log("[RC] RevenueCat not available:", e);
  }
} else {
  console.log("[RC] Skipping RevenueCat init (web or Expo Go)");
}

export const [SubscriptionContext, useSubscription] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [isPremium, setIsPremium] = useState(false);

  const customerInfoQuery = useQuery({
    queryKey: ["customerInfo"],
    queryFn: async () => {
      if (!Purchases) return null;
      try {
        const info = await Purchases.getCustomerInfo();
        console.log("[RC] Customer info fetched", info.entitlements.active);
        return info;
      } catch (e) {
        console.log("[RC] Error fetching customer info:", e);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  const offeringsQuery = useQuery({
    queryKey: ["offerings"],
    queryFn: async () => {
      if (!Purchases) return null;
      try {
        const offerings = await Purchases.getOfferings();
        console.log("[RC] Offerings fetched", offerings.current?.identifier);
        return offerings.current;
      } catch (e) {
        console.log("[RC] Error fetching offerings:", e);
        return null;
      }
    },
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (customerInfoQuery.data) {
      const hasPremium =
        typeof customerInfoQuery.data.entitlements?.active?.["premium"] !==
        "undefined";
      setIsPremium(hasPremium);
    }
  }, [customerInfoQuery.data]);

  const purchaseMutation = useMutation({
    mutationFn: async (pkg: PurchasesPackage) => {
      if (!Purchases) throw new Error("Purchases not available on web");
      console.log("[RC] Purchasing package:", pkg.identifier);
      const result = await Purchases.purchasePackage(pkg);
      console.log("[RC] Purchase result:", result.customerInfo.entitlements.active);
      return result.customerInfo;
    },
    onSuccess: (info) => {
      const hasPremium =
        typeof info.entitlements?.active?.["premium"] !== "undefined";
      setIsPremium(hasPremium);
      queryClient.invalidateQueries({ queryKey: ["customerInfo"] });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async () => {
      if (!Purchases) throw new Error("Purchases not available on web");
      console.log("[RC] Restoring purchases");
      const info = await Purchases.restorePurchases();
      console.log("[RC] Restore result:", info.entitlements.active);
      return info;
    },
    onSuccess: (info) => {
      const hasPremium =
        typeof info.entitlements?.active?.["premium"] !== "undefined";
      setIsPremium(hasPremium);
      queryClient.invalidateQueries({ queryKey: ["customerInfo"] });
    },
  });

  return {
    isPremium,
    offering: offeringsQuery.data ?? null,
    isLoadingOfferings: offeringsQuery.isLoading,
    purchase: purchaseMutation.mutateAsync,
    isPurchasing: purchaseMutation.isPending,
    purchaseError: purchaseMutation.error,
    restore: restoreMutation.mutateAsync,
    isRestoring: restoreMutation.isPending,
  };
});

import { useState, useEffect } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Constants from "expo-constants";
import logger from "@/lib/logger";

let Purchases: any = null;
type PurchasesPackage = any;

// Cache storage keys
const CACHE_KEY_SUBSCRIPTION = "subscription_cache";
const CACHE_STALENESS_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

interface SubscriptionCache {
  isPremium: boolean;
  timestamp: number;
}

interface PurchaseError {
  code: string;
  userMessage: string;
  isCancelled: boolean;
}

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
      logger.log("[RC] Configuring RevenueCat");
      Purchases.configure({ apiKey: rcToken });
    }
  } catch (e) {
    logger.log("[RC] RevenueCat not available:", e);
  }
} else {
  logger.log("[RC] Skipping RevenueCat init (web or Expo Go)");
}

/**
 * Save subscription status to cache
 */
async function cacheSubscriptionStatus(isPremium: boolean): Promise<void> {
  try {
    const cache: SubscriptionCache = {
      isPremium,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(CACHE_KEY_SUBSCRIPTION, JSON.stringify(cache));
    logger.log("[RC] Subscription cached:", { isPremium, timestamp: cache.timestamp });
  } catch (e) {
    logger.error("[RC] Failed to cache subscription:", e);
  }
}

/**
 * Retrieve cached subscription status if available and not too stale
 */
async function getCachedSubscriptionStatus(): Promise<boolean | null> {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY_SUBSCRIPTION);
    if (!cached) {
      logger.log("[RC] No subscription cache found");
      return null;
    }

    const data: SubscriptionCache = JSON.parse(cached);
    const ageMs = Date.now() - data.timestamp;
    const isStale = ageMs > CACHE_STALENESS_MS;

    if (isStale) {
      logger.log("[RC] Subscription cache is stale (age:", ageMs / 1000 / 60 / 60, "hours)");
      return null;
    }

    logger.log("[RC] Using cached subscription status:", { isPremium: data.isPremium, ageMs });
    return data.isPremium;
  } catch (e) {
    logger.error("[RC] Failed to read subscription cache:", e);
    return null;
  }
}

/**
 * Detect if error is a network error
 */
function isNetworkError(error: any): boolean {
  const message = String(error?.message || error);
  return (
    message.includes("Network request failed") ||
    message.includes("Failed to fetch") ||
    message.includes("ECONNREFUSED") ||
    message.includes("timeout") ||
    message.includes("AbortError") ||
    message.includes("offline") ||
    message.includes("ERR_INTERNET_DISCONNECTED")
  );
}

/**
 * Convert RevenueCat error to structured error object
 */
function parseRevenueCatError(error: any): PurchaseError {
  const message = String(error?.message || error);
  const code = error?.code || "UNKNOWN";

  // User cancelled the purchase (RevenueCat error code 1)
  if (code === "1" || message.includes("User cancelled")) {
    return {
      code: "USER_CANCELLED",
      userMessage: "",
      isCancelled: true,
    };
  }

  // Already owned the product
  if (
    code === "7" ||
    message.includes("already own") ||
    message.includes("already purchased")
  ) {
    return {
      code: "ALREADY_PURCHASED",
      userMessage: "You already own this product.",
      isCancelled: false,
    };
  }

  // Network error
  if (isNetworkError(error)) {
    return {
      code: "NETWORK_ERROR",
      userMessage: "No internet connection. Please check your network and try again.",
      isCancelled: false,
    };
  }

  // Generic error
  return {
    code,
    userMessage: "Unable to complete purchase. Please try again.",
    isCancelled: false,
  };
}

/**
 * Retry logic with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  initialDelayMs: number = 1000
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      // Only retry on network errors
      if (!isNetworkError(error)) {
        throw error;
      }

      if (attempt < maxAttempts - 1) {
        const delayMs = initialDelayMs * Math.pow(2, attempt);
        logger.log(`[RC] Retry attempt ${attempt + 1}/${maxAttempts} after ${delayMs}ms`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError;
}

export const [SubscriptionContext, useSubscription] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [isPremium, setIsPremium] = useState(false);
  const [purchaseErrorMessage, setPurchaseErrorMessage] = useState<string | null>(null);
  const [restoreErrorMessage, setRestoreErrorMessage] = useState<string | null>(null);

  const customerInfoQuery = useQuery({
    queryKey: ["customerInfo"],
    queryFn: async () => {
      if (!Purchases) return null;
      try {
        const info = await Purchases.getCustomerInfo();
        logger.log("[RC] Customer info fetched", info.entitlements.active);
        // Cache successful result
        const hasPremium =
          typeof info.entitlements?.active?.["premium"] !== "undefined";
        await cacheSubscriptionStatus(hasPremium);
        return info;
      } catch (e) {
        logger.log("[RC] Error fetching customer info:", e);
        // On error, try to use cached value
        if (isNetworkError(e)) {
          const cachedPremium = await getCachedSubscriptionStatus();
          if (cachedPremium !== null) {
            logger.log("[RC] Using cached subscription status due to network error");
            return { entitlements: { active: { premium: cachedPremium ? {} : undefined } } };
          }
        }
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
        logger.log("[RC] Offerings fetched", offerings.current?.identifier);
        return offerings.current;
      } catch (e) {
        logger.log("[RC] Error fetching offerings:", e);
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

  const purchaseMutation = useMutation<any, Error, PurchasesPackage>({
    mutationFn: async (pkg: PurchasesPackage) => {
      if (!Purchases) throw new Error("Purchases not available on web");
      logger.log("[RC] Purchasing package:", pkg.identifier);

      try {
        const result = await Purchases.purchasePackage(pkg);
        logger.log("[RC] Purchase result:", result.customerInfo.entitlements.active);
        return result.customerInfo;
      } catch (error) {
        const parsedError = parseRevenueCatError(error);

        if (parsedError.isCancelled) {
          logger.log("[RC] User cancelled purchase");
          // Don't treat cancellation as an error
          throw new Error(JSON.stringify({ ...parsedError, isCancelled: true }));
        }

        if (parsedError.code === "ALREADY_PURCHASED") {
          logger.log("[RC] Product already purchased, attempting restore");
          // Automatically restore if already purchased
          try {
            const info = await retryWithBackoff(
              () => Purchases.restorePurchases(),
              2,
              1000
            );
            return info;
          } catch (restoreError) {
            logger.error("[RC] Auto-restore failed:", restoreError);
            throw new Error(JSON.stringify(parsedError));
          }
        }

        logger.error("[RC] Purchase error:", parsedError);
        throw new Error(JSON.stringify(parsedError));
      }
    },
    onSuccess: (customerInfo: any) => {
      const hasPremium =
        typeof customerInfo.entitlements?.active?.["premium"] !== "undefined";
      setIsPremium(hasPremium);
      cacheSubscriptionStatus(hasPremium);
      setPurchaseErrorMessage(null);
      queryClient.invalidateQueries({ queryKey: ["customerInfo"] });
    },
    onError: (error: Error) => {
      try {
        const errorData = JSON.parse(error.message) as PurchaseError;
        if (errorData.isCancelled) {
          // Don't show error for cancelled purchases
          setPurchaseErrorMessage(null);
        } else {
          setPurchaseErrorMessage(errorData.userMessage || "Purchase failed");
        }
      } catch {
        setPurchaseErrorMessage("Purchase failed");
      }
    },
  });

  const restoreMutation = useMutation<any, Error>({
    mutationFn: async () => {
      if (!Purchases) throw new Error("Purchases not available on web");
      logger.log("[RC] Restoring purchases");

      try {
        const info = await retryWithBackoff(
          () => Purchases.restorePurchases(),
          2,
          1000
        );
        logger.log("[RC] Restore result:", (info as any).entitlements.active);
        return info;
      } catch (error) {
        logger.error("[RC] Restore error:", error);
        const parsedError = parseRevenueCatError(error);
        throw new Error(JSON.stringify(parsedError));
      }
    },
    onSuccess: (info: any) => {
      const hasPremium =
        typeof info.entitlements?.active?.["premium"] !== "undefined";
      setIsPremium(hasPremium);
      cacheSubscriptionStatus(hasPremium);
      setRestoreErrorMessage(null);
      queryClient.invalidateQueries({ queryKey: ["customerInfo"] });
    },
    onError: (error: Error) => {
      try {
        const errorData = JSON.parse(error.message) as PurchaseError;
        setRestoreErrorMessage(errorData.userMessage || "Restore failed");
      } catch {
        setRestoreErrorMessage("Restore failed");
      }
    },
  });

  /**
   * Force-refresh subscription status
   */
  const refreshSubscriptionStatus = async () => {
    logger.log("[RC] Force-refreshing subscription status");
    queryClient.invalidateQueries({ queryKey: ["customerInfo"] });
    await queryClient.refetchQueries({ queryKey: ["customerInfo"] });
  };

  return {
    isPremium,
    offering: offeringsQuery.data ?? null,
    isLoadingOfferings: offeringsQuery.isLoading,
    purchase: purchaseMutation.mutateAsync,
    isPurchasing: purchaseMutation.isPending,
    purchaseError: purchaseMutation.error,
    purchaseErrorMessage,
    restore: restoreMutation.mutateAsync,
    isRestoring: restoreMutation.isPending,
    restoreErrorMessage,
    refreshSubscriptionStatus,
  };
});

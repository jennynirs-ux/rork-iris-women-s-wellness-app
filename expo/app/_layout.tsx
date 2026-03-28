import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useCallback, useState } from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AppContext, useApp } from "@/contexts/AppContext";
import { AdminContext, useAdmin } from "@/contexts/AdminContext";
import { ReferralContext } from "@/contexts/ReferralContext";
import { SubscriptionContext } from "@/contexts/SubscriptionContext";
import { ThemeContext, useTheme } from "@/contexts/ThemeContext";
import { SyncContext } from "@/contexts/SyncContext";
import { trpc, trpcClient } from "@/lib/trpc";
import { useDeepLinkReferral } from "@/hooks/useDeepLinkReferral";
import logger from "@/lib/logger";

logger.log('[IRIS] Root layout module evaluating');

SplashScreen.preventAutoHideAsync().catch(() => {
  logger.log('[SplashScreen] preventAutoHideAsync failed');
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function SplashHider({ children }: { children: React.ReactNode }) {
  const { isLoading, userProfile } = useApp();
  const colorScheme = useColorScheme();
  const [appReady, setAppReady] = useState<boolean>(false);

  const isDataReady = !isLoading && userProfile !== undefined;

  useEffect(() => {
    logger.log('[IRIS] SplashHider isLoading:', isLoading, 'isDataReady:', isDataReady, 'appReady:', appReady);
    if (isDataReady && !appReady) {
      logger.log('[IRIS] Data ready — setting appReady and hiding splash');
      setAppReady(true);
      SplashScreen.hideAsync().catch((err) => {
        logger.error('[SplashScreen] hideAsync failed:', err);
      });
    }
  }, [isLoading, isDataReady, appReady]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!appReady) {
        logger.log('[IRIS] Force hiding splash after timeout');
        setAppReady(true);
        SplashScreen.hideAsync().catch(() => {});
      }
    }, 10000);
    return () => clearTimeout(timeout);
  }, [appReady]);

  const bgColor = colorScheme === 'dark' ? '#121016' : '#F7F6F4';

  if (!appReady) {
    logger.log('[IRIS] SplashHider: not ready, rendering blank view');
    return <View style={[splashStyles.root, { backgroundColor: bgColor }]} />;
  }

  logger.log('[IRIS] SplashHider: ready, rendering children');
  return <View style={[splashStyles.root, { backgroundColor: bgColor }]}>{children}</View>;
}

const splashStyles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

function DeepLinkHandler({ children }: { children: React.ReactNode }) {
  const onCodeReceived = useCallback((code: string) => {
    logger.log("[DeepLink] Referral code received in layout:", code);
  }, []);

  useDeepLinkReferral(onCodeReceived);

  return <>{children}</>;
}

/**
 * Redirects to onboarding if user hasn't completed it, regardless of which
 * route they enter from (prevents deep-link bypass of onboarding).
 * Also guards admin route — redirects unauthenticated users to admin-login.
 */
function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { isLoading, userProfile } = useApp();
  const { isAuthenticated: isAdminAuthenticated } = useAdmin();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const isOnboardingScreen = segments[0] === 'onboarding';
    const hasCompleted = userProfile?.hasCompletedOnboarding;

    if (!hasCompleted && !isOnboardingScreen) {
      router.replace('/onboarding' as any);
      return;
    }

    // Guard admin route — redirect to admin-login if not authenticated
    if (segments[0] === 'admin' && !isAdminAuthenticated) {
      router.replace('/admin-login' as any);
    }
  }, [isLoading, userProfile?.hasCompletedOnboarding, segments, isAdminAuthenticated]);

  // Show nothing while data loads — prevents onboarding flash
  if (isLoading) {
    return <View style={{ flex: 1 }} />;
  }

  return <>{children}</>;
}

function RootLayoutNav() {
  const { colors } = useTheme();
  return (
    <OnboardingGate>
      <Stack screenOptions={{ headerBackTitle: "Back", headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.text, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="check-in" options={{ presentation: "modal", title: "Daily Check-In" }} />
        <Stack.Screen name="scan-result" options={{ presentation: "modal", title: "Scan Results" }} />
        <Stack.Screen name="admin-login" options={{ headerShown: false }} />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
        <Stack.Screen name="share-recap" options={{ presentation: "modal", title: "Cycle Recap" }} />
        <Stack.Screen name="referral" options={{ presentation: "modal", headerShown: false }} />
        <Stack.Screen name="paywall" options={{ presentation: "modal", headerShown: false }} />
        <Stack.Screen name="programs" options={{ headerShown: false }} />
        <Stack.Screen name="program-detail" options={{ headerShown: false }} />
        <Stack.Screen name="journal" options={{ headerShown: false }} />
      </Stack>
    </OnboardingGate>
  );
}

export default function RootLayout() {
  logger.log('[IRIS] RootLayout rendering');
  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <ErrorBoundary>
          <AppContext>
            <SplashHider>
              <ThemeContext>
                <SubscriptionContext>
                  <AdminContext>
                    <ReferralContext>
                      <SyncContext>
                        <DeepLinkHandler>
                          <GestureHandlerRootView style={{ flex: 1 }}>
                            <RootLayoutNav />
                          </GestureHandlerRootView>
                        </DeepLinkHandler>
                      </SyncContext>
                    </ReferralContext>
                  </AdminContext>
                </SubscriptionContext>
              </ThemeContext>
            </SplashHider>
          </AppContext>
        </ErrorBoundary>
      </trpc.Provider>
    </QueryClientProvider>
  );
}

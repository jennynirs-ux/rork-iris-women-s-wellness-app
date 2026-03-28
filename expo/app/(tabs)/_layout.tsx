import { Tabs } from "expo-router";
import { Home, Calendar, Scan, BarChart3, User, Wifi } from "lucide-react-native";
import React, { useMemo } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useApp } from "@/contexts/AppContext";
import { StyleSheet, View, Platform, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

export default function TabLayout() {
  const { colors } = useTheme();
  const { t } = useApp();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === 'web' ? 8 : Math.max(insets.bottom, 8);
  const { isOffline } = useNetworkStatus();

  const dynamicStyles = useMemo(() => StyleSheet.create({
    tabBar: {
      backgroundColor: colors.card,
      borderTopColor: colors.borderLight,
      borderTopWidth: 1,
      paddingTop: 0,
      paddingBottom: bottomPadding,
    },
    tabLabel: {
      fontSize: 11,
      fontWeight: "500" as const,
    },
    scanButtonContainer: {
      position: "absolute" as const,
      top: -20,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    scanButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.primary,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    offlineBanner: {
      backgroundColor: colors.textSecondary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 8,
    },
    offlineBannerText: {
      color: colors.card,
      fontSize: 13,
      fontWeight: "500" as const,
      flex: 1,
    },
  }), [colors, bottomPadding]);

  return (
    <View style={{ flex: 1 }}>
      {isOffline && (
        <View style={dynamicStyles.offlineBanner}>
          <Wifi size={18} color={colors.card} />
          <Text style={dynamicStyles.offlineBannerText}>You are offline</Text>
        </View>
      )}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.tabIconDefault,
          headerShown: false,
          tabBarStyle: dynamicStyles.tabBar,
          tabBarLabelStyle: dynamicStyles.tabLabel,
        }}
      >
      <Tabs.Screen
        name="index"
        options={{
          title: t.tabs.home,
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          tabBarAccessibilityLabel: t.tabs.home,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: t.tabs.calendar,
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
          tabBarAccessibilityLabel: t.tabs.calendar,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: t.tabs.scan,
          tabBarIcon: () => (
            <View style={dynamicStyles.scanButtonContainer}>
              <View style={dynamicStyles.scanButton}>
                <Scan color={colors.card} size={28} />
              </View>
            </View>
          ),
          tabBarLabel: () => (
            <Text style={{ fontSize: 10, color: colors.primary, fontWeight: '600', marginTop: 22 }}>
              {t.tabs.scan}
            </Text>
          ),
          tabBarAccessibilityLabel: t.tabs.scan,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: t.tabs.insights,
          tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} />,
          tabBarAccessibilityLabel: t.tabs.insights,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t.tabs.profile,
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          tabBarAccessibilityLabel: t.tabs.profile,
        }}
      />
    </Tabs>
    </View>
  );
}

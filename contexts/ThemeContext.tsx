import { useState, useEffect, useMemo, useCallback } from "react";
import { useColorScheme } from "react-native";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation } from "@tanstack/react-query";
import Colors from "@/constants/colors";

export type ThemeMode = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY_THEME = "iris_theme_mode";

export const [ThemeContext, useTheme] = createContextHook(() => {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");

  const themeQuery = useQuery({
    queryKey: ["themeMode"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY_THEME);
      return (stored as ThemeMode) || "system";
    },
  });

  useEffect(() => {
    if (themeQuery.data) {
      setThemeMode(themeQuery.data);
    }
  }, [themeQuery.data]);

  const updateThemeMutation = useMutation({
    mutationFn: async (mode: ThemeMode) => {
      await AsyncStorage.setItem(STORAGE_KEY_THEME, mode);
      return mode;
    },
    onSuccess: (mode) => {
      setThemeMode(mode);
    },
  });

  const resolvedTheme: ResolvedTheme = useMemo(() => {
    if (themeMode === "system") {
      return systemScheme === "dark" ? "dark" : "light";
    }
    return themeMode;
  }, [themeMode, systemScheme]);

  const colors = useMemo(() => {
    return Colors[resolvedTheme];
  }, [resolvedTheme]);

  const isDark = resolvedTheme === "dark";

  const setTheme = useCallback((mode: ThemeMode) => {
    updateThemeMutation.mutate(mode);
  }, [updateThemeMutation]);

  return useMemo(() => ({
    themeMode,
    resolvedTheme,
    isDark,
    colors,
    setTheme,
  }), [themeMode, resolvedTheme, isDark, colors, setTheme]);
});

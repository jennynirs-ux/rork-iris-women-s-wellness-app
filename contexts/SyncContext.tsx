import { useState, useEffect, useCallback } from "react";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation } from "@tanstack/react-query";
import { trpcClient } from "@/lib/trpc";
import { useApp } from "@/contexts/AppContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Alert } from "react-native";

const STORAGE_KEY_SYNC_ID = "iris_sync_id";
const STORAGE_KEY_LAST_SYNC = "iris_last_sync_at";

function generateSyncId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "IRIS-";
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

export const [SyncContext, useSync] = createContextHook(() => {
  const [syncId, setSyncId] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const { userProfile, checkIns, scans, language } = useApp();
  const { themeMode } = useTheme();

  const syncIdQuery = useQuery({
    queryKey: ["syncId"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY_SYNC_ID);
      return stored || null;
    },
  });

  const lastSyncQuery = useQuery({
    queryKey: ["lastSync"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY_LAST_SYNC);
      return stored || null;
    },
  });

  useEffect(() => {
    if (syncIdQuery.data !== undefined) setSyncId(syncIdQuery.data);
  }, [syncIdQuery.data]);

  useEffect(() => {
    if (lastSyncQuery.data !== undefined) setLastSyncedAt(lastSyncQuery.data);
  }, [lastSyncQuery.data]);

  const createSyncIdMutation = useMutation({
    mutationFn: async () => {
      const newId = generateSyncId();
      await AsyncStorage.setItem(STORAGE_KEY_SYNC_ID, newId);
      return newId;
    },
    onSuccess: (id) => {
      setSyncId(id);
      console.log("[Sync] Created sync ID:", id);
    },
  });

  const setSyncIdMutation = useMutation({
    mutationFn: async (id: string) => {
      await AsyncStorage.setItem(STORAGE_KEY_SYNC_ID, id);
      return id;
    },
    onSuccess: (id) => {
      setSyncId(id);
      console.log("[Sync] Set sync ID:", id);
    },
  });

  const pushMutation = useMutation({
    mutationFn: async () => {
      if (!syncId) {
        throw new Error("No sync ID. Create one first.");
      }

      const baselineStr = await AsyncStorage.getItem("iris_baseline");
      const phaseBaselinesStr = await AsyncStorage.getItem("iris_phase_baselines");
      const cycleHistoryStr = await AsyncStorage.getItem("iris_cycle_history");

      const result = await trpcClient.sync.save.mutate({
        userId: syncId,
        userProfile,
        checkIns,
        scans,
        baseline: baselineStr ? JSON.parse(baselineStr) : null,
        phaseBaselines: phaseBaselinesStr ? JSON.parse(phaseBaselinesStr) : null,
        cycleHistory: cycleHistoryStr ? JSON.parse(cycleHistoryStr) : [],
        language,
        themeMode,
      });

      const syncTime = result.lastSyncedAt;
      await AsyncStorage.setItem(STORAGE_KEY_LAST_SYNC, syncTime);
      return result;
    },
    onSuccess: (result) => {
      setLastSyncedAt(result.lastSyncedAt);
      console.log("[Sync] Push complete, version:", result.version);
    },
    onError: (error) => {
      console.error("[Sync] Push failed:", error);
    },
  });

  const pullMutation = useMutation({
    mutationFn: async (targetId?: string) => {
      const id = targetId || syncId;
      if (!id) {
        throw new Error("No sync ID provided.");
      }

      const result = await trpcClient.sync.load.query({ userId: id });

      if (!result.found || !result.data) {
        throw new Error("No data found for this sync ID.");
      }

      await AsyncStorage.setItem("iris_user_profile", JSON.stringify(result.data.userProfile));
      await AsyncStorage.setItem("iris_checkins", JSON.stringify(result.data.checkIns));
      await AsyncStorage.setItem("iris_scans", JSON.stringify(result.data.scans));
      if (result.data.baseline) {
        await AsyncStorage.setItem("iris_baseline", JSON.stringify(result.data.baseline));
      }
      if (result.data.phaseBaselines) {
        await AsyncStorage.setItem("iris_phase_baselines", JSON.stringify(result.data.phaseBaselines));
      }
      await AsyncStorage.setItem("iris_cycle_history", JSON.stringify(result.data.cycleHistory));
      await AsyncStorage.setItem("iris_language", result.data.language);
      await AsyncStorage.setItem("iris_theme_mode", result.data.themeMode);

      if (targetId && targetId !== syncId) {
        await AsyncStorage.setItem(STORAGE_KEY_SYNC_ID, targetId);
        setSyncId(targetId);
      }

      const syncTime = result.data.lastSyncedAt;
      await AsyncStorage.setItem(STORAGE_KEY_LAST_SYNC, syncTime);

      return result.data;
    },
    onSuccess: (data) => {
      setLastSyncedAt(data.lastSyncedAt);
      console.log("[Sync] Pull complete, version:", data.version);
    },
    onError: (error) => {
      console.error("[Sync] Pull failed:", error);
    },
  });

  const { mutateAsync: createSyncIdAsync } = createSyncIdMutation;
  const { mutate: pushMutate } = pushMutation;
  const { mutate: pullMutate, mutateAsync: pullMutateAsync } = pullMutation;

  const ensureSyncId = useCallback(async () => {
    if (syncId) return syncId;
    const newId = await createSyncIdAsync();
    return newId;
  }, [syncId, createSyncIdAsync]);

  const push = useCallback(async () => {
    await ensureSyncId();
    setTimeout(() => pushMutate(), 100);
  }, [ensureSyncId, pushMutate]);

  const pull = useCallback(async (targetId?: string) => {
    pullMutate(targetId);
  }, [pullMutate]);

  const restoreFromId = useCallback(async (id: string) => {
    const trimmed = id.trim().toUpperCase();
    if (!trimmed.startsWith("IRIS-") || trimmed.length < 10) {
      Alert.alert("Invalid ID", "Please enter a valid sync ID (e.g. IRIS-XXXXXXXX).");
      return false;
    }
    try {
      await pullMutateAsync(trimmed);
      return true;
    } catch {
      Alert.alert("Restore Failed", "No data found for this sync ID, or the server is unavailable.");
      return false;
    }
  }, [pullMutateAsync]);

  const isSyncing = pushMutation.isPending || pullMutation.isPending;

  return {
    syncId,
    lastSyncedAt,
    isSyncing,
    push,
    pull,
    restoreFromId,
    ensureSyncId,
    setSyncId: setSyncIdMutation.mutateAsync,
    isPushError: pushMutation.isError,
    isPullError: pullMutation.isError,
  };
});

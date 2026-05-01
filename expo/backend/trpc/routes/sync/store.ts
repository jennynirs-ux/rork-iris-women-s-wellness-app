import logger from "@/lib/logger";
import * as persistence from "../persistence";

interface SyncedData {
  userId: string;
  userProfile: any;
  checkIns: any[];
  scans: any[];
  baseline: any | null;
  phaseBaselines: any | null;
  cycleHistory: any[];
  language: string;
  themeMode: string;
  lastSyncedAt: string;
  version: number;
}

const syncStore = new Map<string, SyncedData>();

const hydrationPromise: Promise<void> = (async () => {
  try {
    const data = await persistence.loadAsync<[string, SyncedData][]>('sync-store.json');
    if (!data) return;
    for (const [k, v] of data) syncStore.set(k, v);
  } catch (err) {
    console.error('[Sync] Hydration failed:', err);
  }
})();

export async function ensureSyncHydrated(): Promise<void> {
  await hydrationPromise;
}

function save(userId: string, data: Omit<SyncedData, "userId" | "lastSyncedAt" | "version">): SyncedData {
  const existing = syncStore.get(userId);
  const version = existing ? existing.version + 1 : 1;
  const entry: SyncedData = {
    ...data,
    userId,
    lastSyncedAt: new Date().toISOString(),
    version,
  };
  syncStore.set(userId, entry);
  logger.log("[SyncStore] Saved data for user:", userId, "version:", version);

  // Debounced persistence
  persistSyncStore();

  return entry;
}

function load(userId: string): SyncedData | null {
  const data = syncStore.get(userId) || null;
  if (data) {
    logger.log("[SyncStore] Loaded data for user:", userId, "version:", data.version);
  } else {
    logger.log("[SyncStore] No data found for user:", userId);
  }
  return data;
}

function getLastSyncVersion(userId: string): number {
  const data = syncStore.get(userId);
  return data?.version ?? 0;
}

function deleteData(userId: string): boolean {
  const existed = syncStore.has(userId);
  syncStore.delete(userId);
  logger.log("[SyncStore] Deleted data for user:", userId, "existed:", existed);

  // Debounced persistence
  persistSyncStore();

  return existed;
}

function persistSyncStore(): void {
  persistence.save('sync-store.json', Array.from(syncStore.entries()));
}

export const syncStoreModule = {
  save,
  load,
  getLastSyncVersion,
  deleteData,
};

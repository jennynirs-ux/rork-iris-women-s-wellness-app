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
  console.log("[SyncStore] Saved data for user:", userId, "version:", version);
  return entry;
}

function load(userId: string): SyncedData | null {
  const data = syncStore.get(userId) || null;
  if (data) {
    console.log("[SyncStore] Loaded data for user:", userId, "version:", data.version);
  } else {
    console.log("[SyncStore] No data found for user:", userId);
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
  console.log("[SyncStore] Deleted data for user:", userId, "existed:", existed);
  return existed;
}

export const syncStoreModule = {
  save,
  load,
  getLastSyncVersion,
  deleteData,
};

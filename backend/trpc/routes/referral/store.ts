import logger from "@/lib/logger";
import * as persistence from "../persistence";

interface ReferralCodeEntry {
  userId: string;
  referralCode: string;
  createdAt: string;
}

interface ReferredUserEntry {
  referredUserId: string;
  referrerUserId: string;
  referralCode: string;
  currentMilestone: "installed" | "onboarded" | "subscribed";
  appliedAt: string;
  milestoneUpdatedAt: string;
}

interface ReferrerStats {
  totalReferred: number;
  installed: number;
  onboarded: number;
  subscribed: number;
  freeMonthsEarned: number;
  referralGoal: number;
  progressToNext: number;
}

const REFERRAL_CODE_PATTERN = /^IRIS-[A-Z0-9]{6}$/;

// Initialize from persisted file or empty
interface ReferralStoreData {
  referralCodes: [string, ReferralCodeEntry][];
  codeToEntry: [string, ReferralCodeEntry][];
  referredUsers: [string, ReferredUserEntry][];
  referrerToReferred: [string, ReferredUserEntry[]][];
}

const storedData = persistence.load<ReferralStoreData>('referral-store.json') || {
  referralCodes: [],
  codeToEntry: [],
  referredUsers: [],
  referrerToReferred: [],
};

const referralCodes = new Map<string, ReferralCodeEntry>(storedData.referralCodes);
const codeToEntry = new Map<string, ReferralCodeEntry>(storedData.codeToEntry);
const referredUsers = new Map<string, ReferredUserEntry>(storedData.referredUsers);
const referrerToReferred = new Map<string, ReferredUserEntry[]>(storedData.referrerToReferred);

function isValidCodeFormat(code: string): boolean {
  return REFERRAL_CODE_PATTERN.test(code.toUpperCase());
}

function register(userId: string, referralCode: string): void {
  const entry: ReferralCodeEntry = {
    userId,
    referralCode,
    createdAt: new Date().toISOString(),
  };
  referralCodes.set(userId, entry);
  codeToEntry.set(referralCode.toUpperCase(), entry);
  logger.log("[ReferralStore] Registered code:", referralCode.toUpperCase(), "for user:", userId, "total codes:", codeToEntry.size);
  persistReferralStore();
}

function getByCode(code: string): ReferralCodeEntry | undefined {
  return codeToEntry.get(code.toUpperCase());
}

function getReferredUser(userId: string): ReferredUserEntry | undefined {
  return referredUsers.get(userId);
}

function applyReferral(referrerUserId: string, newUserId: string, referralCode: string): void {
  const now = new Date().toISOString();
  const entry: ReferredUserEntry = {
    referredUserId: newUserId,
    referrerUserId,
    referralCode,
    currentMilestone: "installed",
    appliedAt: now,
    milestoneUpdatedAt: now,
  };
  referredUsers.set(newUserId, entry);

  const existing = referrerToReferred.get(referrerUserId) || [];
  existing.push(entry);
  referrerToReferred.set(referrerUserId, existing);
  persistReferralStore();
}

function updateMilestone(userId: string, milestone: "installed" | "onboarded" | "subscribed"): void {
  const entry = referredUsers.get(userId);
  if (entry) {
    entry.currentMilestone = milestone;
    entry.milestoneUpdatedAt = new Date().toISOString();
    persistReferralStore();
  }
}

function getMonthlyReferralCount(referrerUserId: string): number {
  const referred = referrerToReferred.get(referrerUserId) || [];
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  return referred.filter((r) => new Date(r.appliedAt) >= monthStart).length;
}

function getReferrerStats(referrerUserId: string): ReferrerStats {
  const referred = referrerToReferred.get(referrerUserId) || [];
  const referralGoal = 1;

  const installed = referred.filter(
    (r) => r.currentMilestone === "installed" || r.currentMilestone === "onboarded" || r.currentMilestone === "subscribed"
  ).length;
  const onboarded = referred.filter(
    (r) => r.currentMilestone === "onboarded" || r.currentMilestone === "subscribed"
  ).length;
  const subscribed = referred.filter((r) => r.currentMilestone === "subscribed").length;
  const freeMonthsEarned = Math.floor(subscribed / referralGoal);

  return {
    totalReferred: referred.length,
    installed,
    onboarded,
    subscribed,
    freeMonthsEarned,
    referralGoal,
    progressToNext: subscribed % referralGoal,
  };
}

function persistReferralStore(): void {
  const data: ReferralStoreData = {
    referralCodes: Array.from(referralCodes.entries()),
    codeToEntry: Array.from(codeToEntry.entries()),
    referredUsers: Array.from(referredUsers.entries()),
    referrerToReferred: Array.from(referrerToReferred.entries()),
  };
  persistence.save('referral-store.json', data);
}

export const referralStore = {
  register,
  getByCode,
  getReferredUser,
  applyReferral,
  updateMilestone,
  getMonthlyReferralCount,
  getReferrerStats,
  isValidCodeFormat,
};

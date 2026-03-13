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

const referralCodes = new Map<string, ReferralCodeEntry>();
const codeToEntry = new Map<string, ReferralCodeEntry>();
const referredUsers = new Map<string, ReferredUserEntry>();
const referrerToReferred = new Map<string, ReferredUserEntry[]>();

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
  console.log("[ReferralStore] Registered code:", referralCode.toUpperCase(), "for user:", userId, "total codes:", codeToEntry.size);
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
}

function updateMilestone(userId: string, milestone: "installed" | "onboarded" | "subscribed"): void {
  const entry = referredUsers.get(userId);
  if (entry) {
    entry.currentMilestone = milestone;
    entry.milestoneUpdatedAt = new Date().toISOString();
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

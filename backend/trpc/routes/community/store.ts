import logger from "../../../lib/logger";
import * as persistence from "../persistence";

export type CyclePhase = "menstrual" | "follicular" | "ovulation" | "luteal";
export type TipCategory = "nutrition" | "exercise" | "selfcare" | "mindfulness" | "sleep";

export interface CommunityTip {
  id: string;
  phase: CyclePhase;
  content: string;
  category: TipCategory;
  likes: number;
  createdAt: string;
  reportCount: number;
}

interface UserTipTracker {
  userId: string;
  tipsSubmitted: { date: string; count: number }[];
}

interface CommunityStoreData {
  tips: [string, CommunityTip][];
  userTipTracking: [string, UserTipTracker][];
}

const storedData = persistence.load<CommunityStoreData>("community-tips.json") || {
  tips: [],
  userTipTracking: [],
};

const tips = new Map<string, CommunityTip>(storedData.tips);
const userTipTracking = new Map<string, UserTipTracker>(storedData.userTipTracking);

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function addTip(phase: CyclePhase, content: string, category: TipCategory, userId: string): CommunityTip {
  const id = generateId();
  const now = new Date().toISOString();

  const tip: CommunityTip = {
    id,
    phase,
    content,
    category,
    likes: 0,
    createdAt: now,
    reportCount: 0,
  };

  tips.set(id, tip);

  const today = getTodayDateString();
  const tracker = userTipTracking.get(userId) || {
    userId,
    tipsSubmitted: [],
  };

  const todayEntry = tracker.tipsSubmitted.find((t) => t.date === today);
  if (todayEntry) {
    todayEntry.count++;
  } else {
    tracker.tipsSubmitted.push({ date: today, count: 1 });
  }

  userTipTracking.set(userId, tracker);
  persistCommunityStore();

  logger.log("[CommunityStore] Added tip:", id, "for phase:", phase, "total tips:", tips.size);

  return tip;
}

function getTipsByPhase(phase: CyclePhase, limit: number = 10): CommunityTip[] {
  const phaseTips = Array.from(tips.values())
    .filter((tip) => tip.phase === phase && tip.reportCount < 3)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);

  return phaseTips;
}

function likeTip(tipId: string): CommunityTip | undefined {
  const tip = tips.get(tipId);
  if (tip && tip.reportCount < 3) {
    tip.likes++;
    persistCommunityStore();
    logger.log("[CommunityStore] Liked tip:", tipId, "new likes:", tip.likes);
  }
  return tip;
}

function reportTip(tipId: string): CommunityTip | undefined {
  const tip = tips.get(tipId);
  if (tip) {
    tip.reportCount++;
    logger.log("[CommunityStore] Reported tip:", tipId, "report count:", tip.reportCount);
    if (tip.reportCount >= 3) {
      logger.log("[CommunityStore] Auto-hiding tip:", tipId, "due to reports");
    }
    persistCommunityStore();
  }
  return tip;
}

function getPopularTips(limit: number = 10): CommunityTip[] {
  return Array.from(tips.values())
    .filter((tip) => tip.reportCount < 3)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, limit);
}

function getUserTipsCountToday(userId: string): number {
  const tracker = userTipTracking.get(userId);
  if (!tracker) return 0;

  const today = getTodayDateString();
  const todayEntry = tracker.tipsSubmitted.find((t) => t.date === today);
  return todayEntry ? todayEntry.count : 0;
}

function persistCommunityStore(): void {
  const data: CommunityStoreData = {
    tips: Array.from(tips.entries()),
    userTipTracking: Array.from(userTipTracking.entries()),
  };
  persistence.save("community-tips.json", data);
}

export const communityStore = {
  addTip,
  getTipsByPhase,
  likeTip,
  reportTip,
  getPopularTips,
  getUserTipsCountToday,
};

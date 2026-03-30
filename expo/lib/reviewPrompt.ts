import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import logger from "@/lib/logger";

const REVIEW_STORAGE_KEY = "iris_review_state";
const SCANS_BEFORE_PROMPT = 3;
const DAYS_BETWEEN_PROMPTS = 30;

interface ReviewState {
  lastPromptDate: string | null;
  hasRated: boolean;
  scanCount: number;
  dismissCount: number;
}

async function getReviewState(): Promise<ReviewState> {
  try {
    const stored = await AsyncStorage.getItem(REVIEW_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    logger.log("[Review] Error loading state:", e);
  }
  return { lastPromptDate: null, hasRated: false, scanCount: 0, dismissCount: 0 };
}

async function saveReviewState(state: ReviewState): Promise<void> {
  try {
    await AsyncStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    logger.log("[Review] Error saving state:", e);
  }
}

export async function incrementScanCount(): Promise<void> {
  const state = await getReviewState();
  state.scanCount += 1;
  await saveReviewState(state);
  logger.log("[Review] Scan count:", state.scanCount);
}

export async function shouldPromptReview(): Promise<boolean> {
  const state = await getReviewState();

  if (state.hasRated) return false;
  if (state.dismissCount >= 3) return false;
  if (state.scanCount < SCANS_BEFORE_PROMPT) return false;

  if (state.lastPromptDate) {
    const lastDate = new Date(state.lastPromptDate);
    const daysSince = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince < DAYS_BETWEEN_PROMPTS) return false;
  }

  return true;
}

export async function showReviewPrompt(t?: { title?: string; message?: string; rate?: string; later?: string }): Promise<void> {
  const state = await getReviewState();

  const title = t?.title || "Enjoying IRIS?";
  const message = t?.message || "If you find IRIS helpful, would you mind leaving a review? It really helps us improve!";
  const rateText = t?.rate || "Rate IRIS";
  const laterText = t?.later || "Maybe Later";

  Alert.alert(title, message, [
    {
      text: laterText,
      style: "cancel",
      onPress: async () => {
        state.dismissCount += 1;
        state.lastPromptDate = new Date().toISOString();
        await saveReviewState(state);
        logger.log("[Review] Dismissed, count:", state.dismissCount);
      },
    },
    {
      text: rateText,
      onPress: async () => {
        state.hasRated = true;
        state.lastPromptDate = new Date().toISOString();
        await saveReviewState(state);
        logger.log("[Review] User chose to rate");

        logger.log("[Review] User chose to rate - thank you!");
      },
    },
  ]);

  state.lastPromptDate = new Date().toISOString();
  await saveReviewState(state);
}

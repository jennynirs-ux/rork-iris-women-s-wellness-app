/**
 * In-App Review Prompt
 *
 * Triggers the native App Store / Google Play review dialog at strategic
 * positive moments. Uses rate limiting to avoid annoying users:
 *
 * - Maximum once per 60 days
 * - Only after the user has used the app for at least 3 days
 * - Only after at least 5 scans completed
 * - Only at "happy moments" (workout complete, streak milestone, good scan)
 *
 * Apple guidelines: The system limits the display to 3 times per year.
 * Google Play: The API handles rate limiting internally.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';
import { Platform } from 'react-native';
import logger from './logger';

const STORAGE_KEY_LAST_PROMPT = 'iris_review_last_prompt';
const STORAGE_KEY_PROMPT_COUNT = 'iris_review_prompt_count';
const STORAGE_KEY_FIRST_USE = 'iris_review_first_use';
const STORAGE_KEY_SCAN_COUNT = 'iris_review_scan_count';

const MIN_DAYS_BETWEEN_PROMPTS = 60;
const MIN_DAYS_SINCE_FIRST_USE = 3;
const MIN_SCANS_BEFORE_PROMPT = 5;
const MAX_PROMPTS_EVER = 6;

/**
 * Track first app use (call once during onboarding or first launch)
 */
export async function trackFirstUse(): Promise<void> {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY_FIRST_USE);
    if (!existing) {
      await AsyncStorage.setItem(STORAGE_KEY_FIRST_USE, new Date().toISOString());
    }
  } catch (e) {
    logger.error('[ReviewPrompt] Failed to track first use:', e);
  }
}

/**
 * Increment scan count (call after each successful scan)
 */
export async function trackScanCompleted(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_SCAN_COUNT);
    const count = raw ? parseInt(raw, 10) : 0;
    await AsyncStorage.setItem(STORAGE_KEY_SCAN_COUNT, String(count + 1));
  } catch (e) {
    logger.error('[ReviewPrompt] Failed to track scan:', e);
  }
}

/**
 * Check if conditions are met and show the review prompt.
 *
 * Call this at positive moments:
 * - After completing a workout
 * - After reaching a 7-day streak
 * - After a scan with high energy (>=7)
 * - After completing onboarding
 *
 * The function handles all rate limiting internally. Safe to call often.
 */
/**
 * Aliases for backward compatibility with scan.tsx imports
 */
export const incrementScanCount = trackScanCompleted;
export const shouldPromptReview = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'web') return false;
    const isAvailable = await StoreReview.isAvailableAsync();
    if (!isAvailable) return false;
    const countRaw = await AsyncStorage.getItem(STORAGE_KEY_PROMPT_COUNT);
    const totalPrompts = countRaw ? parseInt(countRaw, 10) : 0;
    if (totalPrompts >= MAX_PROMPTS_EVER) return false;
    const firstUseRaw = await AsyncStorage.getItem(STORAGE_KEY_FIRST_USE);
    if (firstUseRaw) {
      const daysSinceFirstUse = (Date.now() - new Date(firstUseRaw).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceFirstUse < MIN_DAYS_SINCE_FIRST_USE) return false;
    } else {
      return false;
    }
    const scanRaw = await AsyncStorage.getItem(STORAGE_KEY_SCAN_COUNT);
    if ((scanRaw ? parseInt(scanRaw, 10) : 0) < MIN_SCANS_BEFORE_PROMPT) return false;
    const lastRaw = await AsyncStorage.getItem(STORAGE_KEY_LAST_PROMPT);
    if (lastRaw) {
      const daysSince = (Date.now() - new Date(lastRaw).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < MIN_DAYS_BETWEEN_PROMPTS) return false;
    }
    return true;
  } catch { return false; }
};
export const showReviewPrompt = async (): Promise<void> => { await maybeRequestReview(); };

export async function maybeRequestReview(): Promise<boolean> {
  try {
    // Check if StoreReview is available on this platform
    if (Platform.OS === 'web') return false;
    const isAvailable = await StoreReview.isAvailableAsync();
    if (!isAvailable) return false;

    // Check total prompt count
    const countRaw = await AsyncStorage.getItem(STORAGE_KEY_PROMPT_COUNT);
    const totalPrompts = countRaw ? parseInt(countRaw, 10) : 0;
    if (totalPrompts >= MAX_PROMPTS_EVER) return false;

    // Check minimum days since first use
    const firstUseRaw = await AsyncStorage.getItem(STORAGE_KEY_FIRST_USE);
    if (firstUseRaw) {
      const firstUse = new Date(firstUseRaw);
      const daysSinceFirstUse = (Date.now() - firstUse.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceFirstUse < MIN_DAYS_SINCE_FIRST_USE) return false;
    } else {
      return false;
    }

    // Check minimum scan count
    const scanRaw = await AsyncStorage.getItem(STORAGE_KEY_SCAN_COUNT);
    const scanCount = scanRaw ? parseInt(scanRaw, 10) : 0;
    if (scanCount < MIN_SCANS_BEFORE_PROMPT) return false;

    // Check cooldown since last prompt
    const lastPromptRaw = await AsyncStorage.getItem(STORAGE_KEY_LAST_PROMPT);
    if (lastPromptRaw) {
      const lastPrompt = new Date(lastPromptRaw);
      const daysSinceLastPrompt = (Date.now() - lastPrompt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceLastPrompt < MIN_DAYS_BETWEEN_PROMPTS) return false;
    }

    // All conditions met — request review!
    await StoreReview.requestReview();

    // Record that we prompted
    await AsyncStorage.setItem(STORAGE_KEY_LAST_PROMPT, new Date().toISOString());
    await AsyncStorage.setItem(STORAGE_KEY_PROMPT_COUNT, String(totalPrompts + 1));

    logger.info('[ReviewPrompt] Review prompt shown (total: ' + (totalPrompts + 1) + ')');
    return true;
  } catch (e) {
    logger.error('[ReviewPrompt] Failed to request review:', e);
    return false;
  }
}

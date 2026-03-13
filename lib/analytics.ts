import { Platform } from 'react-native';
import { trpcClient } from '@/lib/trpc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from "@/lib/logger";

const STORAGE_KEY_USER_ID = 'iris_analytics_user_id';

let cachedUserId: string | null = null;

function generateUserId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = 'usr_';
  for (let i = 0; i < 16; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

async function getUserId(): Promise<string> {
  if (cachedUserId) return cachedUserId;

  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY_USER_ID);
    if (stored) {
      cachedUserId = stored;
      return stored;
    }
  } catch (e) {
    logger.log('[Analytics] Error reading userId:', e);
  }

  const newId = generateUserId();
  cachedUserId = newId;
  try {
    await AsyncStorage.setItem(STORAGE_KEY_USER_ID, newId);
  } catch (e) {
    logger.log('[Analytics] Error saving userId:', e);
  }
  return newId;
}

type EventName =
  | 'app_opened'
  | 'onboarding_started'
  | 'onboarding_completed'
  | 'first_checkin'
  | 'first_scan'
  | 'checkin_submitted'
  | 'scan_completed'
  | 'period_logged'
  | 'subscription_started'
  | 'subscription_cancelled'
  | 'referral_shared'
  | 'referral_applied'
  | 'paywall_viewed'
  | 'paywall_converted'
  | 'life_stage_suggestion_shown'
  | 'life_stage_accepted'
  | 'life_stage_dismissed'
  | 'health_connected'
  | 'profile_updated'
  | 'language_changed'
  | 'units_changed'
  | 'account_deleted';

const eventQueue: { event: EventName; properties?: Record<string, string | number | boolean> }[] = [];
let isProcessing = false;

async function processQueue(): Promise<void> {
  if (isProcessing || eventQueue.length === 0) return;
  isProcessing = true;

  const userId = await getUserId();

  while (eventQueue.length > 0) {
    const item = eventQueue.shift();
    if (!item) break;

    try {
      await trpcClient.analytics.track.mutate({
        userId,
        event: item.event,
        properties: {
          ...item.properties,
          platform: Platform.OS,
        },
      });
      logger.log('[Analytics] Sent event:', item.event);
    } catch (e) {
      logger.log('[Analytics] Failed to send event:', item.event, e);
    }
  }

  isProcessing = false;
}

export function trackEvent(
  event: EventName,
  properties?: Record<string, string | number | boolean>,
): void {
  eventQueue.push({ event, properties });
  processQueue().catch(e => logger.log('[Analytics] Queue processing error:', e));
}

export async function getAnalyticsUserId(): Promise<string> {
  return getUserId();
}

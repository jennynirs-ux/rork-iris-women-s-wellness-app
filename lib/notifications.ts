import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getNextPeriodDate } from '@/lib/phasePredictor';
import logger from "@/lib/logger";

const NOTIFICATION_IDENTIFIER = 'menstrual_phase_reminder';
const STORAGE_KEY_NOTIFICATION_ENABLED = 'iris_notifications_enabled';

try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch (e) {
  logger.log('[Notifications] Failed to set notification handler:', e);
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    logger.log('Notification permission not granted');
    return false;
  }

  return true;
}

export async function areNotificationsEnabled(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }

  const stored = await AsyncStorage.getItem(STORAGE_KEY_NOTIFICATION_ENABLED);
  return stored === 'true';
}

export async function setNotificationsEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY_NOTIFICATION_ENABLED, enabled.toString());
}

export async function scheduleMenstrualPhaseNotification(
  lastPeriodDate: string,
  cycleLength: number
): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }

  const enabled = await areNotificationsEnabled();
  if (!enabled) {
    return;
  }

  await cancelMenstrualPhaseNotification();

  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    return;
  }

  const nextPeriod = getNextPeriodDate(lastPeriodDate, cycleLength);
  const now = new Date();

  if (nextPeriod.getTime() <= now.getTime()) {
    logger.log('[Notifications] Next period date is in the past (overdue), skipping notification');
    return;
  }

  const notificationDate = new Date(nextPeriod);
  notificationDate.setDate(nextPeriod.getDate() - 2);

  const msUntilNotification = notificationDate.getTime() - now.getTime();
  const oneDayMs = 24 * 60 * 60 * 1000;

  if (msUntilNotification < oneDayMs) {
    logger.log('[Notifications] Notification would fire in less than 1 day, skipping stale notification');
    return;
  }

  const secondsUntilNotification = Math.floor(msUntilNotification / 1000);
  const daysUntilPeriod = Math.round((nextPeriod.getTime() - notificationDate.getTime()) / oneDayMs);

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_IDENTIFIER,
    content: {
      title: '🩸 Period Reminder',
      body: `Your period is expected to start in about ${daysUntilPeriod} day${daysUntilPeriod !== 1 ? 's' : ''}. Prepare essentials and track any early symptoms.`,
      data: { type: 'menstrual_reminder' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: secondsUntilNotification,
    },
  });

  logger.log(`[Notifications] Scheduled menstrual notification for ${notificationDate.toLocaleDateString()}, ${daysUntilPeriod} days before period`);
}

export async function cancelMenstrualPhaseNotification(): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }

  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  const existingNotification = scheduledNotifications.find(
    (n) => n.identifier === NOTIFICATION_IDENTIFIER
  );

  if (existingNotification) {
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDENTIFIER);
  }
}

export async function enableNotifications(
  lastPeriodDate: string,
  cycleLength: number
): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }

  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    return false;
  }

  await setNotificationsEnabled(true);
  await scheduleMenstrualPhaseNotification(lastPeriodDate, cycleLength);
  
  return true;
}

export async function disableNotifications(): Promise<void> {
  await setNotificationsEnabled(false);
  await cancelMenstrualPhaseNotification();
}

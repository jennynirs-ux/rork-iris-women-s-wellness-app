import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getNextPeriodDate } from '@/lib/phasePredictor';
import logger from "@/lib/logger";

// Notification identifiers
const NOTIFICATION_IDENTIFIER = 'menstrual_phase_reminder';
const STORAGE_KEY_NOTIFICATION_ENABLED = 'iris_notifications_enabled';
const STORAGE_KEY_CHECKIN_ENABLED = 'iris_checkin_reminder_enabled';
const STORAGE_KEY_CHECKIN_HOUR = 'iris_checkin_reminder_hour';
const STORAGE_KEY_SCAN_ENABLED = 'iris_scan_reminder_enabled';
const STORAGE_KEY_SCAN_DAY = 'iris_scan_reminder_day';
const STORAGE_KEY_HYDRATION_ENABLED = 'iris_hydration_reminder_enabled';

// Notification type identifiers
const NOTIFICATION_CHECKIN_REMINDER = 'checkin_reminder';
const NOTIFICATION_SCAN_REMINDER = 'scan_reminder';
const NOTIFICATION_HYDRATION_REMINDER = 'hydration_reminder';

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

  try {
    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_IDENTIFIER,
      content: {
        title: 'Period Reminder',
        body: `Your period is expected to start in about ${daysUntilPeriod} day${daysUntilPeriod !== 1 ? 's' : ''}. Prepare essentials and track any early symptoms.`,
        data: { type: 'menstrual_reminder' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntilNotification,
      },
    });

    logger.log(`[Notifications] Scheduled menstrual notification for ${notificationDate.toLocaleDateString()}, ${daysUntilPeriod} days before period`);
  } catch (err) {
    logger.error('[Notifications] Failed to schedule menstrual notification:', err);
  }
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

// Check-in Reminder Functions
export async function isCheckInReminderEnabled(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }
  const stored = await AsyncStorage.getItem(STORAGE_KEY_CHECKIN_ENABLED);
  return stored === 'true';
}

export async function setCheckInReminderEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY_CHECKIN_ENABLED, enabled.toString());
}

export async function getCheckInReminderHour(): Promise<number> {
  if (Platform.OS === 'web') {
    return 20; // Default 8pm
  }
  const stored = await AsyncStorage.getItem(STORAGE_KEY_CHECKIN_HOUR);
  return stored ? parseInt(stored, 10) : 20;
}

export async function setCheckInReminderHour(hour: number): Promise<void> {
  if (hour < 0 || hour > 23) {
    throw new Error('Hour must be between 0 and 23');
  }
  await AsyncStorage.setItem(STORAGE_KEY_CHECKIN_HOUR, hour.toString());
}

// Scan Reminder Functions
export async function isScanReminderEnabled(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }
  const stored = await AsyncStorage.getItem(STORAGE_KEY_SCAN_ENABLED);
  return stored === 'true';
}

export async function setScanReminderEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY_SCAN_ENABLED, enabled.toString());
}

export async function getScanReminderDay(): Promise<number> {
  if (Platform.OS === 'web') {
    return 0; // Default Sunday
  }
  const stored = await AsyncStorage.getItem(STORAGE_KEY_SCAN_DAY);
  return stored ? parseInt(stored, 10) : 0;
}

export async function setScanReminderDay(day: number): Promise<void> {
  if (day < 0 || day > 6) {
    throw new Error('Day must be between 0 (Sunday) and 6 (Saturday)');
  }
  await AsyncStorage.setItem(STORAGE_KEY_SCAN_DAY, day.toString());
}

// Hydration Reminder Functions
export async function isHydrationReminderEnabled(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }
  const stored = await AsyncStorage.getItem(STORAGE_KEY_HYDRATION_ENABLED);
  return stored === 'true';
}

export async function setHydrationReminderEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY_HYDRATION_ENABLED, enabled.toString());
}

// Schedule Check-in Reminder
export async function scheduleCheckInReminder(): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }

  const enabled = await isCheckInReminderEnabled();
  if (!enabled) {
    return;
  }

  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    return;
  }

  // Cancel any existing check-in reminders
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  const existingNotification = scheduledNotifications.find(
    (n) => n.identifier === NOTIFICATION_CHECKIN_REMINDER
  );

  if (existingNotification) {
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_CHECKIN_REMINDER);
  }

  const hour = await getCheckInReminderHour();
  const now = new Date();
  const reminderTime = new Date();
  reminderTime.setHours(hour, 0, 0, 0);

  // If the time has already passed today, schedule for tomorrow
  if (reminderTime.getTime() <= now.getTime()) {
    reminderTime.setDate(reminderTime.getDate() + 1);
  }

  try {
    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_CHECKIN_REMINDER,
      content: {
        title: 'Daily Check-in',
        body: 'How are you feeling today? Log your symptoms and mood.',
        data: { type: 'checkin_reminder' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute: 0,
      },
    });

    logger.log(`[Notifications] Scheduled daily check-in reminder for ${hour}:00`);
  } catch (err) {
    logger.error('[Notifications] Failed to schedule check-in reminder:', err);
  }
}

// Schedule Scan Reminder
export async function scheduleScanReminder(): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }

  const enabled = await isScanReminderEnabled();
  if (!enabled) {
    return;
  }

  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    return;
  }

  // Cancel any existing scan reminders
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  const existingNotification = scheduledNotifications.find(
    (n) => n.identifier === NOTIFICATION_SCAN_REMINDER
  );

  if (existingNotification) {
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_SCAN_REMINDER);
  }

  const day = await getScanReminderDay();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  try {
    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_SCAN_REMINDER,
      content: {
        title: 'Weekly Iris Scan',
        body: 'Take your weekly iris scan to track your eye wellness.',
        data: { type: 'scan_reminder' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: day === 0 ? 7 : day, // expo-notifications uses 1-7 (Sunday=7)
        hour: 8,
        minute: 0,
      },
    });

    logger.log(`[Notifications] Scheduled weekly scan reminder for ${dayNames[day]} at 8:00 AM`);
  } catch (err) {
    logger.error('[Notifications] Failed to schedule scan reminder:', err);
  }
}

// Schedule Hydration Reminders
export async function scheduleHydrationReminders(): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }

  const enabled = await isHydrationReminderEnabled();
  if (!enabled) {
    return;
  }

  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    return;
  }

  // Cancel any existing hydration reminders
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  const hydrationReminders = scheduledNotifications.filter(
    (n) => n.identifier?.startsWith(NOTIFICATION_HYDRATION_REMINDER)
  );

  for (const reminder of hydrationReminders) {
    await Notifications.cancelScheduledNotificationAsync(reminder.identifier);
  }

  // Schedule reminders every 2 hours from 8am to 10pm (8, 10, 12, 2, 4, 6, 8, 10)
  const reminderHours = [8, 10, 12, 14, 16, 18, 20, 22];

  try {
    for (const hour of reminderHours) {
      const identifier = `${NOTIFICATION_HYDRATION_REMINDER}_${hour}`;

      await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
          title: 'Hydration Reminder',
          body: 'Stay hydrated! Drink some water.',
          data: { type: 'hydration_reminder' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute: 0,
        },
      });
    }

    logger.log('[Notifications] Scheduled hydration reminders for every 2 hours (8am-10pm)');
  } catch (err) {
    logger.error('[Notifications] Failed to schedule hydration reminders:', err);
  }
}

// Cancel all hydration reminders
export async function cancelHydrationReminders(): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }

  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  const hydrationReminders = scheduledNotifications.filter(
    (n) => n.identifier?.startsWith(NOTIFICATION_HYDRATION_REMINDER)
  );

  for (const reminder of hydrationReminders) {
    await Notifications.cancelScheduledNotificationAsync(reminder.identifier);
  }
}

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useApp } from '@/contexts/AppContext';
import {
  requestNotificationPermissions,
  isCheckInReminderEnabled,
  setCheckInReminderEnabled,
  getCheckInReminderHour,
  setCheckInReminderHour,
  scheduleCheckInReminder,
  isScanReminderEnabled,
  setScanReminderEnabled,
  getScanReminderDay,
  setScanReminderDay,
  scheduleScanReminder,
  isHydrationReminderEnabled,
  setHydrationReminderEnabled,
  scheduleHydrationReminders,
  cancelHydrationReminders,
  isSqueezeDayEnabled,
  setSqueezeDayEnabled,
  scheduleSqueezeDayReminder,
  cancelSqueezeDayReminder,
} from '@/lib/notifications';
import logger from '@/lib/logger';

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useApp();

  const [checkInEnabled, setCheckInEnabled] = useState(false);
  const [checkInHour, setCheckInHour] = useState(20);
  const [scanEnabled, setScanEnabled] = useState(false);
  const [scanDay, setScanDay] = useState(0);
  const [hydrationEnabled, setHydrationEnabled] = useState(false);
  const [squeezeDayEnabled, setSqueezeDayEnabledState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const styles = useMemo(() => createStyles(colors), [colors]);

  // Day names array
  const dayNames = [
    t.notifications.sunday,
    t.notifications.monday,
    t.notifications.tuesday,
    t.notifications.wednesday,
    t.notifications.thursday,
    t.notifications.friday,
    t.notifications.saturday,
  ];

  // Load notification settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const [checkIn, checkInH, scan, scanD, hydration, squeezeDay] = await Promise.all([
        isCheckInReminderEnabled(),
        getCheckInReminderHour(),
        isScanReminderEnabled(),
        getScanReminderDay(),
        isHydrationReminderEnabled(),
        isSqueezeDayEnabled(),
      ]);

      setCheckInEnabled(checkIn);
      setCheckInHour(checkInH);
      setScanEnabled(scan);
      setScanDay(scanD);
      setHydrationEnabled(hydration);
      setSqueezeDayEnabledState(squeezeDay);
    } catch (error) {
      logger.log('[NotificationSettings] Error loading settings:', error);
      Alert.alert('Error', t.profile.notificationErrorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckInToggle = async (value: boolean) => {
    try {
      if (Platform.OS === 'web') {
        Alert.alert('Info', 'Notifications are not available on web');
        return;
      }

      if (value) {
        const hasPermission = await requestNotificationPermissions();
        if (!hasPermission) {
          Alert.alert('Error', t.profile.enableNotificationsMessage);
          return;
        }
      }

      setCheckInEnabled(value);
      await setCheckInReminderEnabled(value);

      if (value) {
        await scheduleCheckInReminder();
      }

      logger.log(`[NotificationSettings] Check-in reminder ${value ? 'enabled' : 'disabled'}`);
    } catch (error) {
      logger.log('[NotificationSettings] Error toggling check-in reminder:', error);
      Alert.alert('Error', t.profile.notificationErrorMessage);
      setCheckInEnabled(!value);
    }
  };

  const handleCheckInTimeChange = async (hour: number) => {
    try {
      setCheckInHour(hour);
      await setCheckInReminderHour(hour);

      if (checkInEnabled) {
        await scheduleCheckInReminder();
      }

      logger.log(`[NotificationSettings] Check-in time changed to ${hour}:00`);
    } catch (error) {
      logger.log('[NotificationSettings] Error changing check-in time:', error);
      Alert.alert('Error', t.profile.notificationErrorMessage);
    }
  };

  const handleScanToggle = async (value: boolean) => {
    try {
      if (Platform.OS === 'web') {
        Alert.alert('Info', 'Notifications are not available on web');
        return;
      }

      if (value) {
        const hasPermission = await requestNotificationPermissions();
        if (!hasPermission) {
          Alert.alert('Error', t.profile.enableNotificationsMessage);
          return;
        }
      }

      setScanEnabled(value);
      await setScanReminderEnabled(value);

      if (value) {
        await scheduleScanReminder();
      }

      logger.log(`[NotificationSettings] Scan reminder ${value ? 'enabled' : 'disabled'}`);
    } catch (error) {
      logger.log('[NotificationSettings] Error toggling scan reminder:', error);
      Alert.alert('Error', t.profile.notificationErrorMessage);
      setScanEnabled(!value);
    }
  };

  const handleScanDayChange = async (day: number) => {
    try {
      setScanDay(day);
      await setScanReminderDay(day);

      if (scanEnabled) {
        await scheduleScanReminder();
      }

      logger.log(`[NotificationSettings] Scan day changed to ${dayNames[day]}`);
    } catch (error) {
      logger.log('[NotificationSettings] Error changing scan day:', error);
      Alert.alert('Error', t.profile.notificationErrorMessage);
    }
  };

  const handleHydrationToggle = async (value: boolean) => {
    try {
      if (Platform.OS === 'web') {
        Alert.alert('Info', 'Notifications are not available on web');
        return;
      }

      if (value) {
        const hasPermission = await requestNotificationPermissions();
        if (!hasPermission) {
          Alert.alert('Error', t.profile.enableNotificationsMessage);
          return;
        }
      }

      setHydrationEnabled(value);
      await setHydrationReminderEnabled(value);

      if (value) {
        await scheduleHydrationReminders();
      } else {
        await cancelHydrationReminders();
      }

      logger.log(`[NotificationSettings] Hydration reminder ${value ? 'enabled' : 'disabled'}`);
    } catch (error) {
      logger.log('[NotificationSettings] Error toggling hydration reminder:', error);
      Alert.alert('Error', t.profile.notificationErrorMessage);
      setHydrationEnabled(!value);
    }
  };

  const handleSqueezeDayToggle = async (value: boolean) => {
    try {
      if (Platform.OS === 'web') {
        Alert.alert('Info', 'Notifications are not available on web');
        return;
      }

      if (value) {
        const hasPermission = await requestNotificationPermissions();
        if (!hasPermission) {
          Alert.alert('Error', t.profile.enableNotificationsMessage);
          return;
        }
      }

      setSqueezeDayEnabledState(value);
      await setSqueezeDayEnabled(value);

      if (value) {
        await scheduleSqueezeDayReminder();
      } else {
        await cancelSqueezeDayReminder();
      }

      logger.log(`[NotificationSettings] Squeeze Day reminder ${value ? 'enabled' : 'disabled'}`);
    } catch (error) {
      logger.log('[NotificationSettings] Error toggling Squeeze Day reminder:', error);
      Alert.alert('Error', t.profile.notificationErrorMessage);
      setSqueezeDayEnabledState(!value);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.notifications.title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Check-in Reminder Section */}
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={styles.sectionTitle}>{t.notifications.checkInReminder}</Text>
          <Text style={styles.sectionDescription}>{t.notifications.checkInReminderDescription}</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLabel}>
              <Text style={styles.settingText}>{t.notifications.enableNotifications}</Text>
            </View>
            <Switch
              value={checkInEnabled}
              onValueChange={handleCheckInToggle}
              disabled={isLoading}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={checkInEnabled ? colors.primary : colors.surface}
              ios_backgroundColor={colors.border}
            />
          </View>

          {checkInEnabled && (
            <View style={[styles.settingRow, { marginTop: 12 }]}>
              <View style={styles.settingLabel}>
                <Text style={styles.settingText}>{t.notifications.reminderTime}</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.timePickerContainer}
              >
                {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                  <TouchableOpacity
                    key={hour}
                    style={[
                      styles.timeButton,
                      checkInHour === hour && [styles.timeButtonActive, { backgroundColor: colors.primary }],
                      { borderColor: colors.border },
                    ]}
                    onPress={() => handleCheckInTimeChange(hour)}
                  >
                    <Text
                      style={[
                        styles.timeButtonText,
                        checkInHour === hour && { color: '#FFFFFF' },
                      ]}
                    >
                      {`${hour.toString().padStart(2, '0')}:00`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Scan Reminder Section */}
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={styles.sectionTitle}>{t.notifications.scanReminder}</Text>
          <Text style={styles.sectionDescription}>{t.notifications.scanReminderDescription}</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLabel}>
              <Text style={styles.settingText}>{t.notifications.enableNotifications}</Text>
            </View>
            <Switch
              value={scanEnabled}
              onValueChange={handleScanToggle}
              disabled={isLoading}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={scanEnabled ? colors.primary : colors.surface}
              ios_backgroundColor={colors.border}
            />
          </View>

          {scanEnabled && (
            <View style={[styles.settingRow, { marginTop: 12 }]}>
              <View style={styles.settingLabel}>
                <Text style={styles.settingText}>{t.notifications.reminderDay}</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.dayPickerContainer}
              >
                {dayNames.map((day, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dayButton,
                      scanDay === index && [styles.dayButtonActive, { backgroundColor: colors.primary }],
                      { borderColor: colors.border },
                    ]}
                    onPress={() => handleScanDayChange(index)}
                  >
                    <Text
                      style={[
                        styles.dayButtonText,
                        scanDay === index && { color: '#FFFFFF' },
                      ]}
                    >
                      {day.substring(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Hydration Reminder Section */}
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={styles.sectionTitle}>{t.notifications.hydrationReminder}</Text>
          <Text style={styles.sectionDescription}>{t.notifications.hydrationReminderDescription}</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLabel}>
              <Text style={styles.settingText}>{t.notifications.enableNotifications}</Text>
            </View>
            <Switch
              value={hydrationEnabled}
              onValueChange={handleHydrationToggle}
              disabled={isLoading}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={hydrationEnabled ? colors.primary : colors.surface}
              ios_backgroundColor={colors.border}
            />
          </View>
        </View>

        {/* Squeeze Day — Monthly Breast Self-Exam Reminder */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.notifications?.squeezeDayTitle || 'Squeeze Day'}</Text>
          <Text style={styles.sectionDescription}>
            {t.notifications?.squeezeDayDescription || 'Get a monthly reminder on the 1st to do your breast self-exam. Early detection saves lives.'}
          </Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLabel}>
              <Text style={styles.settingText}>{t.notifications.enableNotifications}</Text>
            </View>
            <Switch
              value={squeezeDayEnabled}
              onValueChange={handleSqueezeDayToggle}
              disabled={isLoading}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={squeezeDayEnabled ? colors.primary : colors.surface}
              ios_backgroundColor={colors.border}
            />
          </View>

          {squeezeDayEnabled && (
            <View style={{ marginTop: 12, padding: 12, backgroundColor: colors.primaryLight + '22', borderRadius: 10 }}>
              <Text style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 18 }}>
                {t.notifications?.squeezeDayInfo || 'You\u2019ll receive a reminder on the 1st of every month at 9:00 AM.'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
    },
    section: {
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    sectionDescription: {
      fontSize: 13,
      color: colors.textTertiary,
      marginBottom: 16,
      lineHeight: 18,
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    settingLabel: {
      flex: 1,
    },
    settingText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '500',
    },
    timePickerContainer: {
      gap: 8,
      paddingVertical: 8,
    },
    timeButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    timeButtonActive: {
      borderColor: colors.primary,
    },
    timeButtonText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.text,
    },
    dayPickerContainer: {
      gap: 8,
      paddingVertical: 8,
    },
    dayButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      minWidth: 50,
      alignItems: 'center',
    },
    dayButtonActive: {
      borderColor: colors.primary,
    },
    dayButtonText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.text,
    },
  });

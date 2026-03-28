/**
 * Smart Notification Timing
 * Analyzes user check-in patterns to determine optimal notification times.
 * Instead of fixed reminder times, sends notifications when the user
 * is most likely to engage.
 */

import { DailyCheckIn, ScanResult } from '@/types';

export interface NotificationTiming {
  preferredCheckInHour: number;   // 0-23
  preferredScanHour: number;      // 0-23
  activeDays: number[];           // 0-6 (Sun-Sat) — days user is most active
  engagementScore: number;        // 0-1 — how engaged the user is
  shouldReduceFrequency: boolean; // true if user ignores most notifications
}

/**
 * Analyze user's historical check-in and scan timestamps to find
 * their preferred engagement windows.
 */
export function analyzeNotificationTiming(
  checkIns: DailyCheckIn[],
  scans: ScanResult[],
): NotificationTiming {
  const defaults: NotificationTiming = {
    preferredCheckInHour: 20, // 8 PM default
    preferredScanHour: 8,     // 8 AM default
    activeDays: [1, 2, 3, 4, 5], // weekdays
    engagementScore: 0.5,
    shouldReduceFrequency: false,
  };

  if (checkIns.length < 7 && scans.length < 7) return defaults;

  // Analyze check-in hours
  const checkInHours: number[] = [];
  for (const ci of checkIns) {
    if (ci.timestamp) {
      const d = new Date(ci.timestamp);
      if (!isNaN(d.getTime())) {
        checkInHours.push(d.getHours());
      }
    }
  }

  // Analyze scan hours
  const scanHours: number[] = [];
  for (const s of scans) {
    if (s.timestamp) {
      const d = new Date(s.timestamp);
      if (!isNaN(d.getTime())) {
        scanHours.push(d.getHours());
      }
    }
  }

  // Find mode (most common hour)
  const preferredCheckInHour = checkInHours.length > 0
    ? findMode(checkInHours)
    : defaults.preferredCheckInHour;

  const preferredScanHour = scanHours.length > 0
    ? findMode(scanHours)
    : defaults.preferredScanHour;

  // Analyze active days
  const dayCount: Record<number, number> = {};
  for (const ci of checkIns) {
    if (ci.timestamp) {
      const d = new Date(ci.timestamp);
      if (!isNaN(d.getTime())) {
        const day = d.getDay();
        dayCount[day] = (dayCount[day] || 0) + 1;
      }
    }
  }

  const sortedDays = Object.entries(dayCount)
    .sort(([, a], [, b]) => b - a)
    .map(([day]) => parseInt(day));

  const activeDays = sortedDays.length > 0
    ? sortedDays.slice(0, 5)
    : defaults.activeDays;

  // Calculate engagement score (% of last 30 days with check-in or scan)
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recentCheckIns = checkIns.filter(ci =>
    ci.timestamp ? ci.timestamp > thirtyDaysAgo : false
  ).length;
  const recentScans = scans.filter(s =>
    s.timestamp ? s.timestamp > thirtyDaysAgo : false
  ).length;

  const uniqueDaysActive = Math.min(30, recentCheckIns + recentScans);
  const engagementScore = Math.min(1, uniqueDaysActive / 30);

  // If engagement is very low, reduce notification frequency
  const shouldReduceFrequency = engagementScore < 0.15;

  return {
    preferredCheckInHour,
    preferredScanHour,
    activeDays,
    engagementScore,
    shouldReduceFrequency,
  };
}

function findMode(arr: number[]): number {
  const counts: Record<number, number> = {};
  let maxCount = 0;
  let mode = arr[0] ?? 0;

  for (const val of arr) {
    counts[val] = (counts[val] || 0) + 1;
    if (counts[val] > maxCount) {
      maxCount = counts[val];
      mode = val;
    }
  }

  return mode;
}

/**
 * Generate notification schedule based on analyzed timing.
 * Returns an array of { hour, minute, dayOfWeek } for scheduling.
 */
export function generateNotificationSchedule(timing: NotificationTiming): {
  checkInReminders: { hour: number; minute: number; weekday: number }[];
  scanReminders: { hour: number; minute: number; weekday: number }[];
} {
  const checkInReminders = timing.activeDays.map(day => ({
    hour: timing.preferredCheckInHour,
    minute: 0,
    weekday: day,
  }));

  // Scan reminders: fewer than check-in (every other active day)
  const scanDays = timing.shouldReduceFrequency
    ? timing.activeDays.slice(0, 2) // Only 2 days if low engagement
    : timing.activeDays.slice(0, Math.min(4, timing.activeDays.length));

  const scanReminders = scanDays.map(day => ({
    hour: timing.preferredScanHour,
    minute: 0,
    weekday: day,
  }));

  return { checkInReminders, scanReminders };
}

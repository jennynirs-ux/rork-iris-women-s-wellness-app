import { Platform } from 'react-native';
import { HealthData, HealthDataType, HealthConnectionState } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from "@/lib/logger";

const STORAGE_KEY_HEALTH_CONNECTION = 'iris_health_connection';
const STORAGE_KEY_HEALTH_DATA = 'iris_health_data';

let AppleHealthKit: any = null;

function tryLoadHealthKit(): boolean {
  if (Platform.OS !== 'ios') {
    logger.log('[HealthKit] Not iOS, skipping');
    return false;
  }

  try {
    AppleHealthKit = require('react-native-health')?.default;
    if (AppleHealthKit) {
      logger.log('[HealthKit] Module loaded successfully');
      return true;
    }
  } catch {
    logger.log('[HealthKit] Native module not available (expected in Expo Go)');
  }
  return false;
}

const isHealthKitAvailable = tryLoadHealthKit();

export function getHealthKitAvailability(): { isAvailable: boolean; reason: string } {
  if (Platform.OS === 'web') {
    return { isAvailable: false, reason: 'web' };
  }
  if (Platform.OS === 'android') {
    return { isAvailable: false, reason: 'android' };
  }
  if (!isHealthKitAvailable) {
    return { isAvailable: false, reason: 'no_module' };
  }
  return { isAvailable: true, reason: 'available' };
}

export async function requestHealthKitPermissions(): Promise<boolean> {
  if (!isHealthKitAvailable || !AppleHealthKit) {
    logger.log('[HealthKit] Cannot request permissions - module not available');
    return false;
  }

  // Only request permissions for data we actually use:
  // - HRV + AppleSleepingWristTemperature: feed phase predictor
  // - SleepAnalysis, HeartRate, StepCount, BodyTemperature: surfaced on Insights tab
  // Permissions previously requested but unused (MenstrualFlow, ActiveEnergyBurned,
  // OxygenSaturation, RespiratoryRate, MindfulSession, AppleStandTime) were removed
  // to comply with Apple Guideline 5.1.1 (request only what the app actually needs).
  const permissions = {
    permissions: {
      read: [
        AppleHealthKit.Constants?.Permissions?.SleepAnalysis,
        AppleHealthKit.Constants?.Permissions?.HeartRate,
        AppleHealthKit.Constants?.Permissions?.StepCount,
        AppleHealthKit.Constants?.Permissions?.HeartRateVariability,
        AppleHealthKit.Constants?.Permissions?.BodyTemperature,
        AppleHealthKit.Constants?.Permissions?.AppleSleepingWristTemperature,
      ].filter(Boolean),
    },
  };

  return new Promise((resolve) => {
    try {
      AppleHealthKit.initHealthKit(permissions, (err: any) => {
        if (err) {
          logger.log('[HealthKit] Permission error:', err);
          resolve(false);
        } else {
          logger.log('[HealthKit] Permissions granted');
          resolve(true);
        }
      });
    } catch (e) {
      logger.log('[HealthKit] Init error:', e);
      resolve(false);
    }
  });
}

export async function fetchSleepData(): Promise<{ sleepHours?: number; sleepStartTime?: string; sleepEndTime?: string }> {
  if (!isHealthKitAvailable || !AppleHealthKit) {
    return {};
  }

  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(18, 0, 0, 0);

  return new Promise((resolve) => {
    try {
      AppleHealthKit.getSleepSamples(
        {
          startDate: yesterday.toISOString(),
          endDate: now.toISOString(),
          limit: 10,
        },
        (err: any, results: any[]) => {
          if (err || !results || results.length === 0) {
            logger.log('[HealthKit] No sleep data:', err);
            resolve({});
            return;
          }

          const asleepSamples = results.filter(
            (s: any) => s.value === 'ASLEEP' || s.value === 'INBED'
          );

          if (asleepSamples.length === 0) {
            resolve({});
            return;
          }

          const earliest = asleepSamples.reduce((a: any, b: any) =>
            new Date(a.startDate) < new Date(b.startDate) ? a : b
          );
          const latest = asleepSamples.reduce((a: any, b: any) =>
            new Date(a.endDate) > new Date(b.endDate) ? a : b
          );

          const totalMs = asleepSamples.reduce((sum: number, s: any) => {
            return sum + (new Date(s.endDate).getTime() - new Date(s.startDate).getTime());
          }, 0);

          const sleepHours = Math.round((totalMs / (1000 * 60 * 60)) * 10) / 10;

          logger.log('[HealthKit] Sleep data:', { sleepHours });
          resolve({
            sleepHours,
            sleepStartTime: earliest.startDate,
            sleepEndTime: latest.endDate,
          });
        }
      );
    } catch {
      logger.log('[HealthKit] Sleep fetch error');
      resolve({});
    }
  });
}

export async function fetchMenstrualData(): Promise<{ menstrualFlowLevel?: 'none' | 'light' | 'medium' | 'heavy'; menstrualCycleStart?: string }> {
  if (!isHealthKitAvailable || !AppleHealthKit) {
    return {};
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 60);

  return new Promise((resolve) => {
    try {
      AppleHealthKit.getMenstrualFlowSamples?.(
        {
          startDate: thirtyDaysAgo.toISOString(),
          endDate: now.toISOString(),
        },
        (err: any, results: any[]) => {
          if (err || !results || results.length === 0) {
            logger.log('[HealthKit] No menstrual data:', err);
            resolve({});
            return;
          }

          const sorted = results.sort(
            (a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );

          const latest = sorted[0];
          const flowMap: Record<string, 'none' | 'light' | 'medium' | 'heavy'> = {
            'HKCategoryValueMenstrualFlowNone': 'none',
            'HKCategoryValueMenstrualFlowLight': 'light',
            'HKCategoryValueMenstrualFlowMedium': 'medium',
            'HKCategoryValueMenstrualFlowHeavy': 'heavy',
          };

          const periodStarts = sorted.filter((s: any) => s.value !== 'HKCategoryValueMenstrualFlowNone');
          let cycleStart: string | undefined;
          if (periodStarts.length > 0) {
            const lastPeriodSamples = [];
            let prevDate: Date | null = null;
            for (const sample of periodStarts) {
              const sampleDate = new Date(sample.startDate);
              if (prevDate && Math.abs(sampleDate.getTime() - prevDate.getTime()) > 5 * 24 * 60 * 60 * 1000) {
                break;
              }
              lastPeriodSamples.push(sample);
              prevDate = sampleDate;
            }
            const earliest = lastPeriodSamples.reduce((a: any, b: any) =>
              new Date(a.startDate) < new Date(b.startDate) ? a : b
            );
            cycleStart = earliest.startDate;
          }

          logger.log('[HealthKit] Menstrual data:', { flow: latest?.value, cycleStart });
          resolve({
            menstrualFlowLevel: flowMap[latest?.value] || undefined,
            menstrualCycleStart: cycleStart,
          });
        }
      );
    } catch {
      logger.log('[HealthKit] Menstrual fetch error');
      resolve({});
    }
  });
}

export async function fetchHeartRateData(): Promise<{ heartRate?: number; restingHeartRate?: number }> {
  if (!isHealthKitAvailable || !AppleHealthKit) {
    return {};
  }

  const now = new Date();
  const oneHourAgo = new Date(now);
  oneHourAgo.setHours(oneHourAgo.getHours() - 4);

  return new Promise((resolve) => {
    try {
      AppleHealthKit.getHeartRateSamples(
        {
          startDate: oneHourAgo.toISOString(),
          endDate: now.toISOString(),
          ascending: false,
          limit: 5,
        },
        (err: any, results: any[]) => {
          if (err || !results || results.length === 0) {
            resolve({});
            return;
          }

          const avgHR = Math.round(
            results.reduce((sum: number, r: any) => sum + r.value, 0) / results.length
          );

          logger.log('[HealthKit] Heart rate:', avgHR);
          resolve({ heartRate: avgHR });
        }
      );
    } catch {
      resolve({});
    }
  });
}

export async function fetchHRVData(): Promise<{ hrv?: number }> {
  if (!isHealthKitAvailable || !AppleHealthKit) {
    return {};
  }

  const now = new Date();
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  return new Promise((resolve) => {
    try {
      AppleHealthKit.getHeartRateVariabilitySamples?.(
        {
          startDate: twoDaysAgo.toISOString(),
          endDate: now.toISOString(),
          ascending: false,
          limit: 1,
        },
        (err: any, results: any[]) => {
          if (err || !results || results.length === 0) {
            logger.log('[HealthKit] No HRV data:', err);
            resolve({});
            return;
          }

          const latestHRV = results[0]?.value;
          logger.log('[HealthKit] HRV:', latestHRV);
          resolve({ hrv: latestHRV ? Math.round(latestHRV * 100) / 100 : undefined });
        }
      );
    } catch {
      logger.log('[HealthKit] HRV fetch error');
      resolve({});
    }
  });
}

export async function fetchTemperatureData(): Promise<{ wristTemperature?: number }> {
  if (!isHealthKitAvailable || !AppleHealthKit) {
    return {};
  }

  const now = new Date();
  const threeDaysAgo = new Date(now);
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  return new Promise((resolve) => {
    try {
      AppleHealthKit.getWristTemperatureSamples?.(
        {
          startDate: threeDaysAgo.toISOString(),
          endDate: now.toISOString(),
          ascending: false,
          limit: 1,
        },
        (err: any, results: any[]) => {
          if (err || !results || results.length === 0) {
            logger.log('[HealthKit] No wrist temperature data:', err);
            resolve({});
            return;
          }

          const latestTemp = results[0]?.value;
          logger.log('[HealthKit] Wrist temperature:', latestTemp);
          resolve({ wristTemperature: latestTemp ? Math.round(latestTemp * 100) / 100 : undefined });
        }
      );
    } catch {
      logger.log('[HealthKit] Temperature fetch error');
      resolve({});
    }
  });
}

export async function fetchActiveEnergyData(): Promise<{ activeEnergy?: number }> {
  if (!isHealthKitAvailable || !AppleHealthKit) {
    return {};
  }

  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  return new Promise((resolve) => {
    try {
      AppleHealthKit.getActiveEnergyBurned?.(
        {
          startDate: startOfDay.toISOString(),
          endDate: now.toISOString(),
        },
        (err: any, results: any[]) => {
          if (err || !results || results.length === 0) {
            resolve({});
            return;
          }
          const total = Math.round(results.reduce((sum: number, r: any) => sum + (r.value || 0), 0));
          logger.log('[HealthKit] Active energy:', total);
          resolve({ activeEnergy: total });
        }
      );
    } catch {
      resolve({});
    }
  });
}

export async function fetchSpO2Data(): Promise<{ spo2?: number }> {
  if (!isHealthKitAvailable || !AppleHealthKit) {
    return {};
  }

  const now = new Date();
  const oneDayAgo = new Date(now);
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  return new Promise((resolve) => {
    try {
      AppleHealthKit.getOxygenSaturationSamples?.(
        {
          startDate: oneDayAgo.toISOString(),
          endDate: now.toISOString(),
          ascending: false,
          limit: 1,
        },
        (err: any, results: any[]) => {
          if (err || !results || results.length === 0) {
            logger.log('[HealthKit] No SpO2 data:', err);
            resolve({});
            return;
          }
          // Apple Health returns SpO2 as 0–1 fraction; multiply by 100 for %
          const raw = results[0]?.value;
          const pct = raw !== undefined ? (raw > 1 ? raw : Math.round(raw * 1000) / 10) : undefined;
          logger.log('[HealthKit] SpO2:', pct);
          resolve({ spo2: pct });
        }
      );
    } catch {
      logger.log('[HealthKit] SpO2 fetch error');
      resolve({});
    }
  });
}

export async function fetchRespiratoryRateData(): Promise<{ respiratoryRate?: number }> {
  if (!isHealthKitAvailable || !AppleHealthKit) {
    return {};
  }

  const now = new Date();
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  return new Promise((resolve) => {
    try {
      AppleHealthKit.getRespiratoryRateSamples?.(
        {
          startDate: twoDaysAgo.toISOString(),
          endDate: now.toISOString(),
          ascending: false,
          limit: 1,
        },
        (err: any, results: any[]) => {
          if (err || !results || results.length === 0) {
            logger.log('[HealthKit] No respiratory rate data:', err);
            resolve({});
            return;
          }
          const rate = results[0]?.value;
          logger.log('[HealthKit] Respiratory rate:', rate);
          resolve({ respiratoryRate: rate ? Math.round(rate * 10) / 10 : undefined });
        }
      );
    } catch {
      logger.log('[HealthKit] Respiratory rate fetch error');
      resolve({});
    }
  });
}

export async function fetchWristTemperatureDeviationData(): Promise<{ wristTemperatureDeviation?: number }> {
  if (!isHealthKitAvailable || !AppleHealthKit) {
    return {};
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return new Promise((resolve) => {
    try {
      // Apple Watch Series 8+ exposes wrist temperature as a nightly deviation from personal baseline
      AppleHealthKit.getAppleSleepingWristTemperature?.(
        {
          startDate: sevenDaysAgo.toISOString(),
          endDate: now.toISOString(),
          ascending: false,
          limit: 1,
        },
        (err: any, results: any[]) => {
          if (err || !results || results.length === 0) {
            logger.log('[HealthKit] No wrist temperature deviation data:', err);
            resolve({});
            return;
          }
          // Stored as degrees Celsius deviation from personal baseline
          const deviation = results[0]?.value;
          logger.log('[HealthKit] Wrist temperature deviation:', deviation);
          resolve({ wristTemperatureDeviation: deviation !== undefined ? Math.round(deviation * 100) / 100 : undefined });
        }
      );
    } catch {
      logger.log('[HealthKit] Wrist temperature deviation fetch error');
      resolve({});
    }
  });
}

export async function fetchMindfulnessData(): Promise<{ mindfulnessMinutes?: number; standHours?: number }> {
  if (!isHealthKitAvailable || !AppleHealthKit) {
    return {};
  }

  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const result: { mindfulnessMinutes?: number; standHours?: number } = {};

  await new Promise<void>((resolve) => {
    try {
      AppleHealthKit.getMindfulSession?.(
        {
          startDate: startOfDay.toISOString(),
          endDate: now.toISOString(),
        },
        (err: any, results: any[]) => {
          if (!err && results && results.length > 0) {
            const totalMs = results.reduce((sum: number, r: any) => {
              return sum + (new Date(r.endDate).getTime() - new Date(r.startDate).getTime());
            }, 0);
            result.mindfulnessMinutes = Math.round(totalMs / 60000);
            logger.log('[HealthKit] Mindfulness minutes:', result.mindfulnessMinutes);
          }
          resolve();
        }
      );
    } catch {
      resolve();
    }
  });

  await new Promise<void>((resolve) => {
    try {
      AppleHealthKit.getAppleStandTime?.(
        {
          startDate: startOfDay.toISOString(),
          endDate: now.toISOString(),
        },
        (err: any, results: any) => {
          if (!err && results?.value !== undefined) {
            result.standHours = Math.round(results.value);
            logger.log('[HealthKit] Stand hours:', result.standHours);
          }
          resolve();
        }
      );
    } catch {
      resolve();
    }
  });

  return result;
}

export async function fetchStepsData(): Promise<{ steps?: number }> {
  if (!isHealthKitAvailable || !AppleHealthKit) {
    return {};
  }

  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  return new Promise((resolve) => {
    try {
      AppleHealthKit.getStepCount(
        {
          startDate: startOfDay.toISOString(),
          endDate: now.toISOString(),
        },
        (err: any, results: any) => {
          if (err) {
            resolve({});
            return;
          }
          logger.log('[HealthKit] Steps:', results?.value);
          resolve({ steps: Math.round(results?.value || 0) });
        }
      );
    } catch {
      resolve({});
    }
  });
}

export async function fetchAllHealthData(enabledTypes: HealthDataType[]): Promise<HealthData> {
  const data: HealthData = {};

  const promises: Promise<void>[] = [];

  if (enabledTypes.includes('sleep')) {
    promises.push(
      fetchSleepData().then((sleepData) => {
        Object.assign(data, sleepData);
      })
    );
  }

  if (enabledTypes.includes('menstrualCycle')) {
    promises.push(
      fetchMenstrualData().then((menstrualData) => {
        Object.assign(data, menstrualData);
      })
    );
  }

  if (enabledTypes.includes('heartRate')) {
    promises.push(
      fetchHeartRateData().then((hrData) => {
        Object.assign(data, hrData);
      })
    );
  }

  if (enabledTypes.includes('steps')) {
    promises.push(
      fetchStepsData().then((stepsData) => {
        Object.assign(data, stepsData);
      })
    );
  }

  if (enabledTypes.includes('hrv')) {
    promises.push(
      fetchHRVData().then((hrvData) => {
        Object.assign(data, hrvData);
      })
    );
  }

  if (enabledTypes.includes('temperature')) {
    promises.push(
      fetchTemperatureData().then((tempData) => {
        Object.assign(data, tempData);
      })
    );
    promises.push(
      fetchWristTemperatureDeviationData().then((devData) => {
        Object.assign(data, devData);
      })
    );
  }

  if (enabledTypes.includes('spo2')) {
    promises.push(
      fetchSpO2Data().then((spo2Data) => {
        Object.assign(data, spo2Data);
      })
    );
  }

  if (enabledTypes.includes('respiratoryRate')) {
    promises.push(
      fetchRespiratoryRateData().then((rrData) => {
        Object.assign(data, rrData);
      })
    );
  }

  if (enabledTypes.includes('mindfulness')) {
    promises.push(
      fetchMindfulnessData().then((mindData) => {
        Object.assign(data, mindData);
      })
    );
  }

  if (enabledTypes.includes('activeEnergy')) {
    promises.push(
      fetchActiveEnergyData().then((aeData) => {
        Object.assign(data, aeData);
      })
    );
  }

  await Promise.all(promises);
  data.lastSyncDate = new Date().toISOString();

  logger.log('[HealthKit] All health data fetched:', data);
  return data;
}

export async function saveHealthConnection(state: HealthConnectionState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY_HEALTH_CONNECTION, JSON.stringify(state));
}

export async function loadHealthConnection(): Promise<HealthConnectionState> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY_HEALTH_CONNECTION);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    logger.log('[HealthKit] Error loading connection state');
  }
  return {
    isConnected: false,
    isAvailable: getHealthKitAvailability().isAvailable,
    enabledDataTypes: [],
  };
}

export async function saveHealthData(data: HealthData): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY_HEALTH_DATA, JSON.stringify(data));
}

export async function loadHealthData(): Promise<HealthData | null> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY_HEALTH_DATA);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    logger.log('[HealthKit] Error loading health data');
  }
  return null;
}

/**
 * Oura Ring Integration Module
 *
 * Framework for integrating Oura Ring data into the IRIS wellness app.
 * Since we cannot use the actual Oura API in a Rork build, this module:
 *   1. Defines the data types Oura would provide
 *   2. Provides mock data for development
 *   3. Has placeholder functions that would connect to Oura's REST API
 *   4. Integrates with the existing HealthData type
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { HealthData } from '@/types';
import logger from '@/lib/logger';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OuraData {
  hrv: number | null;
  restingHeartRate: number | null;
  /** Deviation from personal baseline in degrees Celsius */
  bodyTemperature: number | null;
  sleepScore: number | null;
  /** Total sleep duration in minutes */
  sleepDuration: number | null;
  readinessScore: number | null;
  activeCalories: number | null;
  steps: number | null;
  respiratoryRate: number | null;
}

export interface OuraConnectionState {
  isConnected: boolean;
  lastSyncDate: string | null;
  accessToken: string | null;
}

// ---------------------------------------------------------------------------
// Storage keys
// ---------------------------------------------------------------------------

const OURA_CONNECTION_KEY = 'iris_oura_connection';
const OURA_DATA_KEY = 'iris_oura_data';

// ---------------------------------------------------------------------------
// Mock data generator — used during development
// ---------------------------------------------------------------------------

function generateMockOuraData(): OuraData {
  return {
    hrv: Math.round(30 + Math.random() * 60),                    // 30-90 ms
    restingHeartRate: Math.round(52 + Math.random() * 18),        // 52-70 bpm
    bodyTemperature: parseFloat((-0.3 + Math.random() * 0.6).toFixed(2)), // -0.3 to +0.3 C
    sleepScore: Math.round(60 + Math.random() * 40),              // 60-100
    sleepDuration: Math.round(300 + Math.random() * 240),         // 300-540 min (5-9h)
    readinessScore: Math.round(50 + Math.random() * 50),          // 50-100
    activeCalories: Math.round(100 + Math.random() * 400),        // 100-500 kcal
    steps: Math.round(2000 + Math.random() * 10000),              // 2k-12k
    respiratoryRate: parseFloat((12 + Math.random() * 6).toFixed(1)), // 12-18 breaths/min
  };
}

// ---------------------------------------------------------------------------
// Connection helpers (persisted via AsyncStorage)
// ---------------------------------------------------------------------------

async function loadConnectionState(): Promise<OuraConnectionState> {
  try {
    const raw = await AsyncStorage.getItem(OURA_CONNECTION_KEY);
    if (raw) {
      return JSON.parse(raw) as OuraConnectionState;
    }
  } catch (e) {
    logger.error('[Oura] Failed to load connection state:', e);
  }
  return { isConnected: false, lastSyncDate: null, accessToken: null };
}

async function saveConnectionState(state: OuraConnectionState): Promise<void> {
  try {
    await AsyncStorage.setItem(OURA_CONNECTION_KEY, JSON.stringify(state));
  } catch (e) {
    logger.error('[Oura] Failed to save connection state:', e);
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Initiate connection to Oura Ring.
 *
 * In a production build this would:
 *   1. Open the Oura OAuth2 consent screen
 *   2. Exchange the auth code for an access token
 *   3. Store the token securely
 *
 * For now we simulate a successful connection with mock data.
 */
export async function connectOura(): Promise<boolean> {
  try {
    logger.log('[Oura] Connecting (mock)...');
    // TODO: Replace with real OAuth2 flow
    // const authUrl = `https://cloud.ouraring.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=daily`;
    // const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);
    // ... exchange code for token ...

    const state: OuraConnectionState = {
      isConnected: true,
      lastSyncDate: new Date().toISOString(),
      accessToken: 'mock_token_' + Date.now(),
    };
    await saveConnectionState(state);

    // Immediately fetch (mock) data on connect
    const data = generateMockOuraData();
    await AsyncStorage.setItem(OURA_DATA_KEY, JSON.stringify(data));

    logger.log('[Oura] Connected successfully (mock)');
    return true;
  } catch (e) {
    logger.error('[Oura] Connection failed:', e);
    return false;
  }
}

/**
 * Fetch Oura data for a specific date.
 *
 * In production this would call:
 *   GET https://api.ouraring.com/v2/usercollection/daily_readiness?start_date={date}&end_date={date}
 *   GET https://api.ouraring.com/v2/usercollection/daily_sleep?start_date={date}&end_date={date}
 *   GET https://api.ouraring.com/v2/usercollection/daily_activity?start_date={date}&end_date={date}
 *   GET https://api.ouraring.com/v2/usercollection/heartrate?start_date={date}&end_date={date}
 *
 * For now it returns mock data.
 */
export async function fetchOuraData(_date: string): Promise<OuraData | null> {
  try {
    const conn = await loadConnectionState();
    if (!conn.isConnected) {
      logger.log('[Oura] Not connected — skipping fetch');
      return null;
    }

    // TODO: Replace with real API calls using conn.accessToken
    // const headers = { Authorization: `Bearer ${conn.accessToken}` };
    // const readinessRes = await fetch(`https://api.ouraring.com/v2/usercollection/daily_readiness?start_date=${date}&end_date=${date}`, { headers });
    // ...

    const data = generateMockOuraData();

    // Update last sync
    await saveConnectionState({ ...conn, lastSyncDate: new Date().toISOString() });
    await AsyncStorage.setItem(OURA_DATA_KEY, JSON.stringify(data));

    logger.log('[Oura] Fetched data (mock) for', _date);
    return data;
  } catch (e) {
    logger.error('[Oura] Fetch failed:', e);
    return null;
  }
}

/**
 * Disconnect from Oura Ring.
 * Clears stored tokens and cached data.
 */
export async function disconnectOura(): Promise<void> {
  try {
    logger.log('[Oura] Disconnecting...');
    // TODO: Revoke token via Oura API
    // await fetch('https://api.ouraring.com/oauth/revoke', { method: 'POST', body: ... });

    await saveConnectionState({ isConnected: false, lastSyncDate: null, accessToken: null });
    await AsyncStorage.removeItem(OURA_DATA_KEY);
    logger.log('[Oura] Disconnected');
  } catch (e) {
    logger.error('[Oura] Disconnect failed:', e);
  }
}

/**
 * Check whether the user currently has an active Oura connection.
 */
export async function isOuraConnected(): Promise<boolean> {
  const conn = await loadConnectionState();
  return conn.isConnected;
}

/**
 * Get the last sync timestamp (or null).
 */
export async function getOuraLastSync(): Promise<string | null> {
  const conn = await loadConnectionState();
  return conn.lastSyncDate;
}

// ---------------------------------------------------------------------------
// Integration helpers
// ---------------------------------------------------------------------------

/**
 * Merge Oura data into the existing HealthData object.
 * Oura values take priority only when the corresponding HealthData field is empty.
 */
export function mergeOuraIntoHealthData(
  existing: HealthData | null,
  oura: OuraData | null,
): HealthData {
  const base: HealthData = existing || {};

  if (!oura) return base;

  return {
    ...base,
    hrv: base.hrv ?? oura.hrv ?? undefined,
    restingHeartRate: base.restingHeartRate ?? oura.restingHeartRate ?? undefined,
    wristTemperature: base.wristTemperature ?? (oura.bodyTemperature != null ? oura.bodyTemperature : undefined),
    sleepHours: base.sleepHours ?? (oura.sleepDuration != null ? Math.round((oura.sleepDuration / 60) * 10) / 10 : undefined),
    steps: base.steps ?? oura.steps ?? undefined,
    activeEnergy: base.activeEnergy ?? oura.activeCalories ?? undefined,
    lastSyncDate: new Date().toISOString(),
  };
}

/**
 * Load the most recently cached Oura data from storage.
 */
export async function loadCachedOuraData(): Promise<OuraData | null> {
  try {
    const raw = await AsyncStorage.getItem(OURA_DATA_KEY);
    if (raw) {
      return JSON.parse(raw) as OuraData;
    }
  } catch (e) {
    logger.error('[Oura] Failed to load cached data:', e);
  }
  return null;
}

import * as fs from 'fs';
import * as path from 'path';
import logger from '@/lib/logger';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DEBOUNCE_DELAY = 5000; // 5 seconds

// Track debounce timers per filename
const debounceTimers = new Map<string, NodeJS.Timeout>();
const pendingWrites = new Map<string, any>();

/**
 * Ensure the data directory exists
 */
function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Load data from a JSON file
 * Returns null if the file doesn't exist or on read error
 */
export function load<T>(filename: string): T | null {
  try {
    ensureDataDir();
    const filepath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filepath)) {
      return null;
    }
    const content = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (err) {
    logger.log(`[Persistence] Error loading ${filename}:`, err);
    return null;
  }
}

/**
 * Save data to a JSON file with temp-file-then-rename pattern
 * Uses debouncing to batch writes within a 5-second window
 */
export function save<T>(filename: string, data: T): void {
  // Store the pending write
  pendingWrites.set(filename, data);

  // Clear existing timer if any
  const existingTimer = debounceTimers.get(filename);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  // Set a new debounced timer
  const timer = setTimeout(() => {
    performWrite(filename);
  }, DEBOUNCE_DELAY);

  debounceTimers.set(filename, timer);
}

/**
 * Internal function that performs the actual write
 */
function performWrite(filename: string): void {
  try {
    ensureDataDir();
    const data = pendingWrites.get(filename);
    if (data === undefined) {
      return;
    }

    const filepath = path.join(DATA_DIR, filename);
    const tempFilepath = `${filepath}.tmp`;

    // Write to temp file first
    const jsonContent = JSON.stringify(data, null, 2);
    fs.writeFileSync(tempFilepath, jsonContent, 'utf-8');

    // Atomically rename temp file to target file
    fs.renameSync(tempFilepath, filepath);

    logger.log(`[Persistence] Saved ${filename}`);

    // Clean up
    debounceTimers.delete(filename);
    pendingWrites.delete(filename);
  } catch (err) {
    logger.log(`[Persistence] Error saving ${filename}:`, err);
    // Keep the timer so it retries on next debounce
  }
}

/**
 * Force a flush of all pending writes
 * Useful for graceful shutdown
 */
export function flushAll(): void {
  for (const filename of debounceTimers.keys()) {
    const timer = debounceTimers.get(filename);
    if (timer) {
      clearTimeout(timer);
    }
    performWrite(filename);
  }
}

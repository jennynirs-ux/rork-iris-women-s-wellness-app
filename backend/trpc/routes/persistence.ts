import * as fs from 'fs';
import * as path from 'path';
import logger from '../../lib/logger';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DEBOUNCE_DELAY = 5000;

const debounceTimers = new Map<string, NodeJS.Timeout>();
const pendingWrites = new Map<string, any>();

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

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

export function save<T>(filename: string, data: T): void {
  pendingWrites.set(filename, data);

  const existingTimer = debounceTimers.get(filename);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  const timer = setTimeout(() => {
    performWrite(filename);
  }, DEBOUNCE_DELAY);

  debounceTimers.set(filename, timer);
}

function performWrite(filename: string): void {
  try {
    ensureDataDir();
    const data = pendingWrites.get(filename);
    if (data === undefined) {
      return;
    }

    const filepath = path.join(DATA_DIR, filename);
    const tempFilepath = `${filepath}.tmp`;

    const jsonContent = JSON.stringify(data, null, 2);
    fs.writeFileSync(tempFilepath, jsonContent, 'utf-8');

    fs.renameSync(tempFilepath, filepath);

    logger.log(`[Persistence] Saved ${filename}`);

    debounceTimers.delete(filename);
    pendingWrites.delete(filename);
  } catch (err) {
    logger.log(`[Persistence] Error saving ${filename}:`, err);
  }
}

export function flushAll(): void {
  for (const filename of debounceTimers.keys()) {
    const timer = debounceTimers.get(filename);
    if (timer) {
      clearTimeout(timer);
    }
    performWrite(filename);
  }
}

/**
 * Persistence layer.
 *
 * Backed by the `kv_store` Postgres table in Supabase. Each historical
 * "JSON file" name maps to a row keyed by `key` with JSONB `value`.
 *
 * Stores hydrate in-memory state at startup (`loadAsync` once) and use
 * `saveAsync` for write-through. The synchronous `load`/`save` API is
 * kept for backward compatibility — it falls back to a local file when
 * Supabase is not configured (development without a backend DB).
 */
import * as fs from 'fs';
import * as path from 'path';
import logger from '@/lib/logger';
import { getSupabase, isSupabaseConfigured } from '@/backend/lib/supabase';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DEBOUNCE_DELAY = 5000;

const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();
const pendingWrites = new Map<string, unknown>();

// ─── File-system fallback (only when Supabase is not configured) ────────────

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadFromFile<T>(filename: string): T | null {
  try {
    ensureDataDir();
    const filepath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filepath)) return null;
    return JSON.parse(fs.readFileSync(filepath, 'utf-8')) as T;
  } catch (err) {
    logger.log(`[Persistence] File load error ${filename}:`, err);
    return null;
  }
}

function saveToFile<T>(filename: string, data: T): void {
  try {
    ensureDataDir();
    const filepath = path.join(DATA_DIR, filename);
    const tempFilepath = `${filepath}.tmp`;
    fs.writeFileSync(tempFilepath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFilepath, filepath);
  } catch (err) {
    logger.log(`[Persistence] File save error ${filename}:`, err);
  }
}

// ─── Supabase-backed async API ──────────────────────────────────────────────

export async function loadAsync<T>(key: string): Promise<T | null> {
  const supabase = getSupabase();
  if (!supabase) return loadFromFile<T>(key);

  try {
    const { data, error } = await supabase
      .from('kv_store')
      .select('value')
      .eq('key', key)
      .maybeSingle();

    if (error) {
      logger.error(`[Persistence] Supabase load error for ${key}:`, error.message);
      return null;
    }
    return ((data?.value ?? null) as T | null);
  } catch (err) {
    logger.error(`[Persistence] Unexpected load error for ${key}:`, err);
    return null;
  }
}

export async function saveAsync<T>(key: string, value: T): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    saveToFile(key, value);
    return;
  }

  try {
    const { error } = await supabase
      .from('kv_store')
      .upsert({ key, value }, { onConflict: 'key' });

    if (error) {
      logger.error(`[Persistence] Supabase save error for ${key}:`, error.message);
    }
  } catch (err) {
    logger.error(`[Persistence] Unexpected save error for ${key}:`, err);
  }
}

// ─── Sync wrappers (legacy) ─────────────────────────────────────────────────
// These remain for backwards-compatibility. They only work against the file
// fallback. Stores SHOULD migrate to loadAsync/saveAsync.

export function load<T>(filename: string): T | null {
  if (isSupabaseConfigured()) {
    logger.error(
      `[Persistence] Sync load() called for "${filename}" with Supabase configured. ` +
        'This always returns null — switch the caller to loadAsync().',
    );
    return null;
  }
  return loadFromFile<T>(filename);
}

export function save<T>(filename: string, data: T): void {
  // When Supabase is configured we forward to async write-through (debounced).
  pendingWrites.set(filename, data);
  const existing = debounceTimers.get(filename);
  if (existing) clearTimeout(existing);

  debounceTimers.set(
    filename,
    setTimeout(() => {
      const value = pendingWrites.get(filename);
      pendingWrites.delete(filename);
      debounceTimers.delete(filename);
      if (value === undefined) return;
      if (isSupabaseConfigured()) {
        void saveAsync(filename, value);
      } else {
        saveToFile(filename, value);
      }
    }, DEBOUNCE_DELAY),
  );
}

export function flushAll(): void {
  for (const [filename, timer] of debounceTimers.entries()) {
    clearTimeout(timer);
    const value = pendingWrites.get(filename);
    pendingWrites.delete(filename);
    debounceTimers.delete(filename);
    if (value === undefined) continue;
    if (isSupabaseConfigured()) {
      void saveAsync(filename, value);
    } else {
      saveToFile(filename, value);
    }
  }
}

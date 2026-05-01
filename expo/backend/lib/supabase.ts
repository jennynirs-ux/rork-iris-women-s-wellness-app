/**
 * Supabase service-role client.
 *
 * Used by the Hono + tRPC backend for all persistence. Connects with the
 * service_role key, which bypasses Row Level Security — never expose this
 * client to a browser or to mobile-app code.
 *
 * Required env vars:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import logger from '@/lib/logger';

let _client: SupabaseClient | null = null;
let _warned = false;

export function getSupabase(): SupabaseClient | null {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    if (!_warned) {
      logger.error(
        '[Supabase] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set. ' +
          'Backend will operate without persistence — all reads return null, ' +
          'writes are no-ops. Set both env vars on the deploy host.',
      );
      _warned = true;
    }
    return null;
  }

  _client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { 'x-application-name': 'iris-backend' } },
  });

  return _client;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

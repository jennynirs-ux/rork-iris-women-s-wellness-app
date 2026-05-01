/**
 * Production-safe logger that only outputs in development mode.
 * Replaces raw console.log/warn/error throughout the app to prevent
 * sensitive health data, referral codes, and scan metrics from
 * leaking to production device logs.
 */

// Cross-platform dev detection. React Native sets __DEV__; Node/Bun
// (the Hono backend) does not — fall back to NODE_ENV.
const isDev: boolean = (() => {
  try {
    const dev = (globalThis as { __DEV__?: boolean }).__DEV__;
    if (typeof dev === 'boolean') return dev;
  } catch {
    /* ignore */
  }
  try {
    return (
      typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production'
    );
  } catch {
    return false;
  }
})();

export const logger = {
  log: (...args: any[]) => {
    if (isDev) console.log(...args);
  },
  warn: (...args: any[]) => {
    if (isDev) console.warn(...args);
  },
  error: (...args: any[]) => {
    // Errors always surface, even in production — needed for backend logs
    // and fly.io diagnostics.
    console.error(...args);
  },
  info: (...args: any[]) => {
    if (isDev) console.info(...args);
  },
};

export default logger;

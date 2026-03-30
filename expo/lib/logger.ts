/**
 * Production-safe logger that only outputs in development mode.
 * Replaces raw console.log/warn/error throughout the app to prevent
 * sensitive health data, referral codes, and scan metrics from
 * leaking to production device logs.
 */

const isDev = __DEV__;

export const logger = {
  log: (...args: any[]) => {
    if (isDev) console.log(...args);
  },
  warn: (...args: any[]) => {
    if (isDev) console.warn(...args);
  },
  error: (...args: any[]) => {
    if (isDev) console.error(...args);
  },
  info: (...args: any[]) => {
    if (isDev) console.info(...args);
  },
};

export default logger;

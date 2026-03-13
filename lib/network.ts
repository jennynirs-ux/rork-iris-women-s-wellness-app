import logger from "@/lib/logger";

/**
 * Check if the backend API is reachable.
 * Returns true if we can reach the tRPC endpoint, false otherwise.
 */
export async function isBackendReachable(): Promise<boolean> {
  const baseUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  if (!baseUrl) {
    logger.log("[Network] No EXPO_PUBLIC_RORK_API_BASE_URL configured");
    return false;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(`${baseUrl}/api/trpc`, {
      method: "HEAD",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return response.ok || response.status === 404; // 404 is fine, means server is up
  } catch (e) {
    logger.log("[Network] Backend unreachable:", e);
    return false;
  }
}

/**
 * Wraps a tRPC call with offline-safe error handling.
 * Returns the result on success, or the fallback value on network failure.
 */
export async function safeTrpcCall<T>(
  call: () => Promise<T>,
  fallback: T,
  label: string = "trpc"
): Promise<T> {
  try {
    return await call();
  } catch (error: any) {
    const message = error?.message || String(error);

    // Network-level failures or JSON parse errors (BUG-002)
    if (
      message.includes("Network request failed") ||
      message.includes("Failed to fetch") ||
      message.includes("JSON") ||
      message.includes("Unexpected token") ||
      message.includes("ECONNREFUSED") ||
      message.includes("timeout") ||
      message.includes("AbortError")
    ) {
      logger.log(`[${label}] Network error (offline mode):`, message);
      return fallback;
    }

    // Re-throw actual application errors
    throw error;
  }
}

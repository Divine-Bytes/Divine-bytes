/**
 * In-memory sliding window rate limiter.
 * Suitable for single-instance dev/preview deployments.
 * For production multi-instance setups, replace with a Redis-backed solution.
 */

interface RateLimiterOptions {
  /** Maximum requests allowed within the window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

interface RateLimiter {
  check: (key: string) => boolean;
}

/**
 * Creates a sliding window rate limiter.
 * Returns a `check(key)` function that returns `true` when the key is rate-limited.
 */
export function getRateLimiter(options: RateLimiterOptions): RateLimiter {
  const { limit, windowMs } = options;
  // Map of key → sorted list of request timestamps
  const store = new Map<string, number[]>();

  function check(key: string): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;

    let timestamps = store.get(key) ?? [];
    // Remove timestamps outside the window
    timestamps = timestamps.filter((ts) => ts > windowStart);

    if (timestamps.length >= limit) {
      store.set(key, timestamps);
      return true; // rate limited
    }

    timestamps.push(now);
    store.set(key, timestamps);
    return false; // not limited
  }

  return { check };
}

// Shared public API rate limiter — 100 req/min per IP
export const publicApiLimiter = getRateLimiter({ limit: 100, windowMs: 60 * 1000 });

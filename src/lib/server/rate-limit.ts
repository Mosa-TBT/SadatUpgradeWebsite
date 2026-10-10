/**
 * Lightweight in-memory sliding-window rate limiter for public form endpoints.
 * Sufficient for abuse prevention on this app; swap for Redis/Laravel cache if
 * this ever moves to multiple Node instances.
 */

const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs = 60_000): boolean {
  const now = Date.now();
  const hits = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);

  // Opportunistic pruning to keep the map bounded.
  if (buckets.size > 10_000) {
    for (const [k, timestamps] of buckets) {
      if (timestamps.every((t) => now - t > windowMs)) buckets.delete(k);
    }
  }
  return true;
}
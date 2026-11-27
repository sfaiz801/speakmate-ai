/**
 * Lightweight in-memory sliding-window rate limiter & request validator
 * to protect the free-tier Gemini API quota from accidental loops or abuse.
 */

const buckets = new Map();

export function checkRateLimit(clientKey = 'global', limit = 18, windowMs = 60_000) {
  const now = Date.now();
  const timestamps = buckets.get(clientKey) || [];
  const recent = timestamps.filter((ts) => now - ts < windowMs);

  if (recent.length >= limit) {
    const oldest = recent[0];
    const retryAfterSec = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000));
    buckets.set(clientKey, recent);
    return { allowed: false, retryAfterSec, remaining: 0 };
  }

  recent.push(now);
  buckets.set(clientKey, recent);

  // Prevent unbounded growth in long-running server instances
  if (buckets.size > 500) {
    const firstKey = buckets.keys().next().value;
    if (firstKey) buckets.delete(firstKey);
  }

  return { allowed: true, retryAfterSec: 0, remaining: limit - recent.length };
}

export function getClientIdentifier(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'local-client';
}

export function validateUserText(message, maxChars = 1200) {
  if (typeof message !== 'string') {
    return { valid: false, error: 'Message must be a text string.' };
  }
  const trimmed = message.trim();
  if (!trimmed) {
    return { valid: false, error: 'Please type or speak a message before sending.' };
  }
  if (trimmed.length > maxChars) {
    return {
      valid: false,
      error: `Message is too long (${trimmed.length} chars). Please keep each turn under ${maxChars} characters.`,
    };
  }
  return { valid: true, text: trimmed };
}

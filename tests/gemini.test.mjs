import test from 'node:test';
import assert from 'node:assert/strict';
import { checkRateLimit, validateUserText } from '../src/lib/gemini/rateLimiter.js';
import { buildBoundedContents, mapGeminiError } from '../src/lib/gemini/client.js';
import { buildTutorSystemInstruction } from '../src/lib/gemini/prompts.js';

test('validateUserText rejects empty and overly long inputs', () => {
  assert.equal(validateUserText('   ', 1200).valid, false);
  assert.equal(validateUserText(null, 1200).valid, false);
  assert.equal(validateUserText('a'.repeat(1201), 1200).valid, false);
  const ok = validateUserText('  Hello teacher  ', 1200);
  assert.equal(ok.valid, true);
  assert.equal(ok.text, 'Hello teacher');
});

test('checkRateLimit enforces per-window request cap', () => {
  const key = `test-client-${Date.now()}`;
  assert.equal(checkRateLimit(key, 2, 60_000).allowed, true);
  assert.equal(checkRateLimit(key, 2, 60_000).allowed, true);
  const blocked = checkRateLimit(key, 2, 60_000);
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterSec >= 1);
});

test('buildBoundedContents trims old turns, maps assistant to model, and normalizes leading model turn', () => {
  const history = [
    { role: 'user', text: 'Turn 1' },
    { role: 'assistant', text: 'Reply 1' },
    { role: 'user', text: 'Turn 2' },
    { role: 'assistant', text: 'Reply 2' },
  ];
  const contents = buildBoundedContents(history, 'Latest turn', 2);
  assert.equal(contents.length, 3);
  assert.equal(contents[0].role, 'user');
  assert.equal(contents[1].role, 'model');
  assert.equal(contents[2].parts[0].text, 'Latest turn');

  const modelFirst = buildBoundedContents([{ role: 'assistant', text: 'Welcome!' }], 'Hi teacher', 10);
  assert.equal(modelFirst[0].role, 'user');
  assert.equal(modelFirst[1].role, 'model');
  assert.equal(modelFirst[2].role, 'user');
  assert.equal(modelFirst[2].parts[0].text, 'Hi teacher');
});

test('mapGeminiError provides clear user-facing error messages for quota and missing key', () => {
  const quotaErr = mapGeminiError({ status: 429, message: 'RESOURCE_EXHAUSTED' });
  assert.equal(quotaErr.status, 429);
  assert.equal(quotaErr.code, 'QUOTA_EXCEEDED');

  const keyErr = mapGeminiError({ code: 'MISSING_API_KEY', message: 'Missing key' });
  assert.equal(keyErr.status, 503);

  const overloadErr = mapGeminiError({
    status: 503,
    message: 'This model is currently experiencing high demand. UNAVAILABLE',
  });
  assert.equal(overloadErr.status, 503);
  assert.equal(overloadErr.code, 'MODEL_OVERLOADED');
});

test('buildTutorSystemInstruction includes learner level and explanation language', () => {
  const prompt = buildTutorSystemInstruction({
    mode: 'Job Interview',
    englishLevel: 'B1',
    explanationLanguage: 'Hinglish',
    learnerName: 'Aarav',
  });
  assert.match(prompt, /B1/);
  assert.match(prompt, /Hinglish/);
  assert.match(prompt, /Aarav/);
});

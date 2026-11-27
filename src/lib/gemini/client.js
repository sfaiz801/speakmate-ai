import { GoogleGenAI } from '@google/genai';

const DEFAULT_MODEL = 'gemini-3.5-flash-lite';

export function getGeminiConfig() {
  const apiKey = process.env.GEMINI_API_KEY?.trim() || '';
  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  const maxHistoryTurns = Number(process.env.GEMINI_MAX_HISTORY_TURNS || 10);
  const maxInputChars = Number(process.env.GEMINI_MAX_INPUT_CHARS || 1200);

  return {
    configured: Boolean(apiKey && apiKey !== 'your_gemini_api_key_here'),
    apiKey,
    model,
    maxHistoryTurns: Number.isFinite(maxHistoryTurns) ? Math.min(Math.max(maxHistoryTurns, 2), 20) : 10,
    maxInputChars: Number.isFinite(maxInputChars) ? Math.min(Math.max(maxInputChars, 200), 3000) : 1200,
  };
}

export function createGeminiClient() {
  const { configured, apiKey } = getGeminiConfig();
  if (!configured) {
    const err = new Error(
      'GEMINI_API_KEY is not configured on the server. Add your free Google AI Studio key in .env.local.'
    );
    err.status = 503;
    err.code = 'MISSING_API_KEY';
    throw err;
  }
  return new GoogleGenAI({ apiKey });
}

export function mapGeminiError(error) {
  const status = error?.status || error?.statusCode || 500;
  const rawMessage = String(error?.message || '');

  if (error?.code === 'MISSING_API_KEY') {
    return {
      status: 503,
      code: 'MISSING_API_KEY',
      message: error.message,
    };
  }

  if (
    status === 429 ||
    rawMessage.includes('429') ||
    rawMessage.includes('RESOURCE_EXHAUSTED') ||
    rawMessage.toLowerCase().includes('quota')
  ) {
    return {
      status: 429,
      code: 'QUOTA_EXCEEDED',
      message:
        'Gemini API free-tier rate limit or daily quota was reached. Please wait 30–60 seconds and try again.',
    };
  }

  if (status === 401 || status === 403 || rawMessage.includes('API_KEY_INVALID')) {
    return {
      status: 401,
      code: 'INVALID_API_KEY',
      message:
        'The server GEMINI_API_KEY appears invalid or unauthorized. Please verify your Google AI Studio key.',
    };
  }

  if (
    status === 503 ||
    rawMessage.includes('UNAVAILABLE') ||
    rawMessage.toLowerCase().includes('high demand')
  ) {
    return {
      status: 503,
      code: 'MODEL_OVERLOADED',
      message:
        'The AI model is temporarily experiencing high demand. Please wait a few seconds and try again.',
    };
  }

  if (status === 404 || rawMessage.toLowerCase().includes('not found')) {
    return {
      status: 400,
      code: 'MODEL_ERROR',
      message:
        'Configured GEMINI_MODEL could not be reached. Check GEMINI_MODEL in your environment (e.g., gemini-3.8-flash or gemini-3.5-flash-lite).',
    };
  }

  return {
    status: 502,
    code: 'GEMINI_UPSTREAM_ERROR',
    message: 'Could not reach the AI tutor right now. Please try again in a moment.',
  };
}

/**
 * Safely trims and converts chat messages into Gemini contents array,
 * ensuring turns start with 'user' and alternate cleanly.
 */
export function buildBoundedContents(history = [], latestUserMessage, maxTurns = 10) {
  const safeHistory = Array.isArray(history) ? history.slice(-maxTurns) : [];
  const normalized = safeHistory
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant' || m.role === 'model') &&
        typeof m.text === 'string' &&
        m.text.trim()
    )
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : m.role,
      parts: [{ text: m.text.trim().slice(0, 1200) }],
    }));

  // Gemini expects the conversation array to begin with a 'user' turn.
  if (normalized.length > 0 && normalized[0].role === 'model') {
    normalized.unshift({
      role: 'user',
      parts: [{ text: 'Hello teacher, please start our practice session.' }],
    });
  }

  // Merge consecutive turns of the same role to preserve strict user/model alternation
  const contents = [];
  for (const turn of normalized) {
    const prev = contents[contents.length - 1];
    if (prev && prev.role === turn.role) {
      prev.parts[0].text = `${prev.parts[0].text}\n${turn.parts[0].text}`;
    } else {
      contents.push(turn);
    }
  }

  const last = contents[contents.length - 1];
  if (last && last.role === 'user') {
    last.parts[0].text = `${last.parts[0].text}\n${latestUserMessage}`;
  } else {
    contents.push({
      role: 'user',
      parts: [{ text: latestUserMessage }],
    });
  }

  return contents;
}

const FALLBACK_MODEL = 'gemini-3.5-flash-lite';

function withTimeout(promise, ms) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => {
        const err = new Error('Primary Gemini model timed out under load.');
        err.status = 503;
        reject(err);
      }, ms);
    }),
  ]).finally(() => clearTimeout(timer));
}

export async function generateContentWithFallback(ai, { primaryModel, contents, config }) {
  try {
    const req = ai.models.generateContent({
      model: primaryModel,
      contents,
      config,
    });
    const response =
      primaryModel !== FALLBACK_MODEL ? await withTimeout(req, 9000) : await req;
    return { response, modelUsed: primaryModel };
  } catch (error) {
    const msg = String(error?.message || '');
    const isTransientOverload =
      error?.status === 503 || msg.includes('UNAVAILABLE') || msg.toLowerCase().includes('high demand');

    if (isTransientOverload && primaryModel !== FALLBACK_MODEL) {
      const response = await ai.models.generateContent({
        model: FALLBACK_MODEL,
        contents,
        config,
      });
      return { response, modelUsed: FALLBACK_MODEL };
    }

    throw error;
  }
}

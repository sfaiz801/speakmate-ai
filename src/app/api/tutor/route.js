import { NextResponse } from 'next/server';
import {
  buildBoundedContents,
  createGeminiClient,
  generateContentWithFallback,
  getGeminiConfig,
  mapGeminiError,
} from '@/lib/gemini/client';
import { buildTutorSystemInstruction } from '@/lib/gemini/prompts';
import {
  checkRateLimit,
  getClientIdentifier,
  validateUserText,
} from '@/lib/gemini/rateLimiter';

const TUTOR_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    reply: { type: 'string' },
    hasCorrection: { type: 'boolean' },
    originalSentence: { type: 'string' },
    correctedSentence: { type: 'string' },
    explanation: { type: 'string' },
    naturalExpression: { type: 'string' },
    vocabularyTip: {
      type: 'object',
      properties: {
        word: { type: 'string' },
        meaning: { type: 'string' },
        example: { type: 'string' },
      },
      required: ['word', 'meaning', 'example'],
    },
  },
  required: [
    'reply',
    'hasCorrection',
    'originalSentence',
    'correctedSentence',
    'explanation',
    'naturalExpression',
    'vocabularyTip',
  ],
};

export async function POST(request) {
  try {
    const clientIp = getClientIdentifier(request);
    const rate = checkRateLimit(`tutor:${clientIp}`, 18, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: `Too many requests in a short time. Please wait ${rate.retryAfterSec}s before sending your next message.`,
          code: 'RATE_LIMITED',
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
    }

    const config = getGeminiConfig();
    const validation = validateUserText(body.message, config.maxInputChars);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const ai = createGeminiClient();
    const systemInstruction = buildTutorSystemInstruction({
      mode: body.mode,
      englishLevel: body.englishLevel,
      explanationLanguage: body.explanationLanguage,
      learnerName: body.learnerName,
    });

    const contents = buildBoundedContents(body.history, validation.text, config.maxHistoryTurns);

    const { response, modelUsed } = await generateContentWithFallback(ai, {
      primaryModel: config.model,
      contents,
      config: {
        systemInstruction,
        temperature: 0.65,
        responseMimeType: 'application/json',
        responseSchema: TUTOR_RESPONSE_SCHEMA,
      },
    });

    const rawText = response?.text || '';
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      parsed = {
        reply: rawText || 'Nice effort! Could you tell me a little more about that?',
        hasCorrection: false,
        originalSentence: '',
        correctedSentence: '',
        explanation: '',
        naturalExpression: '',
        vocabularyTip: { word: '', meaning: '', example: '' },
      };
    }

    return NextResponse.json({
      data: parsed,
      model: modelUsed,
      remainingRequestsPerMinute: rate.remaining,
    });
  } catch (error) {
    const mapped = mapGeminiError(error);
    return NextResponse.json(
      { error: mapped.message, code: mapped.code },
      { status: mapped.status }
    );
  }
}

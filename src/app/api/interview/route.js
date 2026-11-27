import { NextResponse } from 'next/server';
import {
  buildBoundedContents,
  createGeminiClient,
  generateContentWithFallback,
  getGeminiConfig,
  mapGeminiError,
} from '@/lib/gemini/client';
import { buildInterviewSystemInstruction } from '@/lib/gemini/prompts';
import {
  checkRateLimit,
  getClientIdentifier,
  validateUserText,
} from '@/lib/gemini/rateLimiter';

const INTERVIEW_SCHEMA = {
  type: 'object',
  properties: {
    grammarFeedback: { type: 'string' },
    vocabularySuggestions: { type: 'array', items: { type: 'string' } },
    communicationFeedback: { type: 'string' },
    suggestedImprovedAnswer: { type: 'string' },
    nextQuestion: { type: 'string' },
  },
  required: [
    'grammarFeedback',
    'vocabularySuggestions',
    'communicationFeedback',
    'suggestedImprovedAnswer',
    'nextQuestion',
  ],
};

export async function POST(request) {
  try {
    const clientIp = getClientIdentifier(request);
    const rate = checkRateLimit(`interview:${clientIp}`, 15, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: `Please wait ${rate.retryAfterSec}s before submitting the next interview answer.`,
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
    const validation = validateUserText(body.answer, config.maxInputChars);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const ai = createGeminiClient();
    const systemInstruction = buildInterviewSystemInstruction({
      categoryTitle: body.categoryTitle || 'General HR Interview',
      englishLevel: body.englishLevel,
      explanationLanguage: body.explanationLanguage,
    });

    const formattedUserTurn = `Interview Question Asked: "${body.currentQuestion || 'Tell me about yourself.'}"\nCandidate Answer: "${validation.text}"`;
    const contents = buildBoundedContents(body.history, formattedUserTurn, config.maxHistoryTurns);

    const { response, modelUsed } = await generateContentWithFallback(ai, {
      primaryModel: config.model,
      contents,
      config: {
        systemInstruction,
        temperature: 0.55,
        responseMimeType: 'application/json',
        responseSchema: INTERVIEW_SCHEMA,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return NextResponse.json({
      data: parsed,
      model: modelUsed,
    });
  } catch (error) {
    const mapped = mapGeminiError(error);
    return NextResponse.json(
      { error: mapped.message, code: mapped.code },
      { status: mapped.status }
    );
  }
}

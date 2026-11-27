import { NextResponse } from 'next/server';
import {
  buildBoundedContents,
  createGeminiClient,
  generateContentWithFallback,
  getGeminiConfig,
  mapGeminiError,
} from '@/lib/gemini/client';
import { buildConversationSystemInstruction } from '@/lib/gemini/prompts';
import {
  checkRateLimit,
  getClientIdentifier,
  validateUserText,
} from '@/lib/gemini/rateLimiter';

const ROLEPLAY_TURN_SCHEMA = {
  type: 'object',
  properties: {
    reply: { type: 'string' },
    quickCoachTip: { type: 'string' },
  },
  required: ['reply', 'quickCoachTip'],
};

const REPORT_SCHEMA = {
  type: 'object',
  properties: {
    overallSummary: { type: 'string' },
    strengths: { type: 'array', items: { type: 'string' } },
    areasToImprove: { type: 'array', items: { type: 'string' } },
    usefulPhrasesLearned: { type: 'array', items: { type: 'string' } },
    confidenceScore: { type: 'integer' },
  },
  required: [
    'overallSummary',
    'strengths',
    'areasToImprove',
    'usefulPhrasesLearned',
    'confidenceScore',
  ],
};

export async function POST(request) {
  try {
    const clientIp = getClientIdentifier(request);
    const rate = checkRateLimit(`conversation:${clientIp}`, 18, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: `Rate limit reached. Please wait ${rate.retryAfterSec}s before continuing.`,
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
    const requestReport = Boolean(body.requestReport);

    const userPrompt = requestReport
      ? 'Please review our conversation history above and generate my end-of-session performance report.'
      : body.message;

    const validation = validateUserText(userPrompt, config.maxInputChars);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const ai = createGeminiClient();
    const systemInstruction = buildConversationSystemInstruction({
      scenarioTitle: body.scenarioTitle || 'Everyday Conversation',
      aiRole: body.aiRole || 'Conversation Partner',
      englishLevel: body.englishLevel,
      explanationLanguage: body.explanationLanguage,
      requestReport,
    });

    const contents = buildBoundedContents(body.history, validation.text, config.maxHistoryTurns);

    const { response, modelUsed } = await generateContentWithFallback(ai, {
      primaryModel: config.model,
      contents,
      config: {
        systemInstruction,
        temperature: requestReport ? 0.4 : 0.7,
        responseMimeType: 'application/json',
        responseSchema: requestReport ? REPORT_SCHEMA : ROLEPLAY_TURN_SCHEMA,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return NextResponse.json({
      data: parsed,
      requestReport,
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

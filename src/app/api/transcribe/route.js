import { NextResponse } from 'next/server';
import {
  createGeminiClient,
  generateContentWithFallback,
  getGeminiConfig,
  mapGeminiError,
} from '@/lib/gemini/client';
import { checkRateLimit, getClientIdentifier } from '@/lib/gemini/rateLimiter';

const MAX_AUDIO_BASE64_CHARS = 3_500_000; // ~2.5 MB audio clip

export async function POST(request) {
  try {
    const clientIp = getClientIdentifier(request);
    const rate = checkRateLimit(`transcribe:${clientIp}`, 20, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: `Voice transcription rate limit reached. Please wait ${rate.retryAfterSec}s.`,
          code: 'RATE_LIMITED',
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
    }

    const audioBase64 = typeof body.audioBase64 === 'string' ? body.audioBase64.trim() : '';
    const mimeType = typeof body.mimeType === 'string' ? body.mimeType.split(';')[0].trim() : 'audio/webm';

    if (!audioBase64) {
      return NextResponse.json({ error: 'No audio data received.' }, { status: 400 });
    }

    if (audioBase64.length > MAX_AUDIO_BASE64_CHARS) {
      return NextResponse.json(
        { error: 'Voice clip is too long. Please keep each speaking turn under 45 seconds.' },
        { status: 400 }
      );
    }

    if (!mimeType.startsWith('audio/')) {
      return NextResponse.json({ error: 'Unsupported audio format.' }, { status: 400 });
    }

    const config = getGeminiConfig();
    const ai = createGeminiClient();

    const { response } = await generateContentWithFallback(ai, {
      primaryModel: config.model,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: 'Listen carefully and transcribe exactly what the speaker said. The speaker may speak English, Hindi, or Hinglish (Hindi written in Roman or Devanagari script). Return ONLY the spoken transcript text with natural punctuation. If there is only silence or background noise, return an empty string.',
            },
            {
              inlineData: {
                mimeType,
                data: audioBase64,
              },
            },
          ],
        },
      ],
      config: {
        temperature: 0.1,
      },
    });

    const transcript = (response?.text || '').trim();
    return NextResponse.json({ transcript });
  } catch (error) {
    const mapped = mapGeminiError(error);
    return NextResponse.json(
      { error: mapped.message, code: mapped.code },
      { status: mapped.status }
    );
  }
}

import { NextResponse } from 'next/server';
import { getGeminiConfig } from '@/lib/gemini/client';

export async function GET() {
  const config = getGeminiConfig();
  return NextResponse.json({
    ok: true,
    service: 'SpeakMate AI',
    geminiConfigured: config.configured,
    model: config.model,
    maxHistoryTurns: config.maxHistoryTurns,
    maxInputChars: config.maxInputChars,
  });
}

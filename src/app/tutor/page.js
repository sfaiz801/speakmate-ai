'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Volume2,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  AlertTriangle,
  BookmarkCheck,
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import VoiceControls from '@/components/tutor/VoiceControls';
import { useApp } from '@/context/AppContext';
import { TUTOR_MODES } from '@/data/levels';
import { speakText, stopSpeaking } from '@/lib/speech/webSpeech';

export default function TutorPage() {
  const { state, isHydrated, logPracticeSession, addToast } = useApp();

  const [selectedMode, setSelectedMode] = useState(TUTOR_MODES[0].id);
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [apiError, setApiError] = useState('');
  const [lastFailedMessage, setLastFailedMessage] = useState('');
  const [healthInfo, setHealthInfo] = useState({ checked: false, geminiConfigured: true, model: '' });
  const [turnCount, setTurnCount] = useState(0);

  const chatEndRef = useRef(null);
  const activeModeObj = TUTOR_MODES.find((m) => m.id === selectedMode) || TUTOR_MODES[0];

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => {
        setHealthInfo({
          checked: true,
          geminiConfigured: Boolean(data.geminiConfigured),
          model: data.model || '',
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setMessages([
      {
        id: `starter-${selectedMode}`,
        role: 'assistant',
        text: activeModeObj.starterPrompt,
        structured: null,
      },
    ]);
    setApiError('');
    stopSpeaking();
    setIsSpeaking(false);
  }, [selectedMode, activeModeObj.starterPrompt]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  useEffect(() => () => stopSpeaking(), []);

  const handlePlayAudio = (text) => {
    if (!text) return;
    speakText(text, {
      lang: state?.settings?.preferredVoiceLang || 'en-IN',
      rate: state?.settings?.speechRate || 0.95,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  };

  const handleSendMessage = async (userText, { isRetry = false } = {}) => {
    setApiError('');
    setLastFailedMessage('');

    const baseMessages = isRetry ? messages.slice(0, -1) : messages;
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: userText,
    };

    const nextMessages = [...baseMessages, userMsg];
    setMessages(nextMessages);
    setIsProcessing(true);

    try {
      const historyPayload = nextMessages.slice(0, -1).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: historyPayload,
          mode: activeModeObj.title,
          englishLevel: state?.profile?.englishLevel || 'A1',
          explanationLanguage: state?.profile?.explanationLanguage || 'Hindi',
          learnerName: state?.profile?.name || 'Learner',
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setApiError(json.error || 'Unable to get a response from SpeakMate AI.');
        setLastFailedMessage(userText);
        return;
      }

      const structured = json.data || {};
      const replyText = structured.reply || 'Nice try! Could you tell me more?';

      const aiMsg = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: replyText,
        structured,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setTurnCount((prev) => prev + 1);

      if (state?.settings?.autoSpeakResponses !== false) {
        handlePlayAudio(replyText);
      }
    } catch {
      setApiError('Network error while contacting the AI tutor. Please check your connection.');
      setLastFailedMessage(userText);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveSession = () => {
    const mins = Math.max(2, turnCount * 2);
    logPracticeSession({
      type: 'tutor',
      title: `AI Tutor: ${activeModeObj.title}`,
      durationMinutes: mins,
      summary: `Completed ${turnCount} speaking turns in ${activeModeObj.title}.`,
    });
    addToast({
      title: 'Session Saved!',
      message: `Added ${mins} practice minutes to your streak & progress.`,
      variant: 'success',
    });
    setTurnCount(0);
  };

  const handleResetChat = () => {
    stopSpeaking();
    setIsSpeaking(false);
    setTurnCount(0);
    setMessages([
      {
        id: `starter-${selectedMode}-${Date.now()}`,
        role: 'assistant',
        text: activeModeObj.starterPrompt,
        structured: null,
      },
    ]);
  };

  return (
    <AppShell
      title="AI Speaking Tutor"
      subtitle={
        isHydrated
          ? `Tuned to ${state.profile.englishLevel} • Explanations in ${state.profile.explanationLanguage}`
          : 'Loading your personal tutor...'
      }
      actions={
        <div className="d-flex flex-wrap gap-2">
          {turnCount > 0 && (
            <button
              type="button"
              onClick={handleSaveSession}
              className="btn btn-success d-inline-flex align-items-center gap-1"
            >
              <BookmarkCheck size={16} />
              Save Practice ({turnCount} turns)
            </button>
          )}
          <button
            type="button"
            onClick={handleResetChat}
            className="btn btn-outline-secondary d-inline-flex align-items-center gap-1"
          >
            <RotateCcw size={16} />
            New Session
          </button>
        </div>
      }
    >
      {healthInfo.checked && !healthInfo.geminiConfigured && (
        <div className="alert alert-warning d-flex align-items-start gap-2 rounded-4 mb-4">
          <AlertTriangle size={20} className="flex-shrink-0 mt-1" />
          <div className="small">
            <strong>GEMINI_API_KEY is not configured yet.</strong> Add a free Google AI Studio key
            in <code>.env.local</code> (see <code>.env.example</code>) and restart the server to
            enable live Gemini tutor replies.
          </div>
        </div>
      )}

      {/* Conversation Mode Selector */}
      <div className="sm-card p-3 mb-3 mb-md-4">
        <div className="small fw-bold text-muted mb-2">Choose Conversation Mode (8 Modes)</div>
        <div className="sm-pill-strip">
          {TUTOR_MODES.map((mode) => {
            const active = mode.id === selectedMode;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setSelectedMode(mode.id)}
                className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold ${
                  active ? 'sm-gradient-btn' : 'btn-light border text-dark'
                }`}
              >
                {mode.title}
              </button>
            );
          })}
        </div>
        <div className="small text-muted mt-2">
          <strong className="text-dark">{activeModeObj.title}:</strong> {activeModeObj.subtitle} •{' '}
          <span className="text-primary">{activeModeObj.hindiHint}</span>
        </div>
      </div>

      {/* Chat Conversation Thread */}
      <div className="sm-card p-3 p-md-4 mb-3">
        <div
          className="d-flex flex-column gap-3 overflow-auto pe-1 sm-scroll-thread"
          style={{ maxHeight: '52vh', minHeight: 280 }}
        >
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const s = msg.structured;

            return (
              <div
                key={msg.id}
                className={`d-flex flex-column ${isUser ? 'align-items-end' : 'align-items-start'}`}
              >
                <div
                  className="p-3 rounded-4"
                  style={{
                    maxWidth: 'min(90%, 660px)',
                    backgroundColor: isUser ? '#eef2ff' : '#f8fafc',
                    border: isUser ? '1px solid #c7d2fe' : '1px solid #e2e8f0',
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between gap-3 mb-1">
                    <span className="small fw-bold text-primary">
                      {isUser ? 'You' : 'SpeakMate AI Teacher'}
                    </span>
                    {!isUser && (
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(msg.text)}
                        className="btn btn-sm btn-light border py-0 px-2 d-inline-flex align-items-center gap-1"
                        aria-label="Play tutor response aloud"
                      >
                        <Volume2 size={14} />
                        <span className="small">Listen</span>
                      </button>
                    )}
                  </div>

                  <p className="mb-0 text-dark" style={{ whiteSpace: 'pre-wrap' }}>
                    {msg.text}
                  </p>

                  {/* Structured Corrections & Tips */}
                  {s && s.hasCorrection && (
                    <div
                      className="mt-3 p-3 rounded-3"
                      style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
                    >
                      <div className="small fw-bold text-primary mb-1 d-flex align-items-center gap-1">
                        <CheckCircle2 size={15} className="text-success" />
                        Gentle Grammar Tip
                      </div>
                      {s.originalSentence && (
                        <div className="small mb-1">
                          <span className="text-muted">You said:</span>{' '}
                          <span className="text-danger text-decoration-line-through">
                            {s.originalSentence}
                          </span>
                        </div>
                      )}
                      {s.correctedSentence && (
                        <div className="small fw-semibold text-success mb-1">
                          Better: {s.correctedSentence}
                        </div>
                      )}
                      {s.explanation && <div className="small text-muted">{s.explanation}</div>}
                    </div>
                  )}

                  {s && (s.naturalExpression || s.vocabularyTip?.word) && (
                    <div className="mt-2 d-flex flex-column gap-1 pt-2 border-top small">
                      {s.naturalExpression && (
                        <div>
                          <span className="fw-semibold text-primary d-inline-flex align-items-center gap-1">
                            <Sparkles size={13} /> Natural phrase:
                          </span>{' '}
                          <span className="text-dark">{s.naturalExpression}</span>
                        </div>
                      )}
                      {s.vocabularyTip?.word && (
                        <div>
                          <span className="fw-semibold text-success d-inline-flex align-items-center gap-1">
                            <BookOpen size={13} /> Useful word:
                          </span>{' '}
                          <strong>{s.vocabularyTip.word}</strong> ({s.vocabularyTip.meaning}) —{' '}
                          <em className="text-muted">{s.vocabularyTip.example}</em>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isProcessing && (
            <div className="align-self-start p-3 rounded-4 bg-light border small text-muted d-inline-flex align-items-center gap-2">
              <span className="sm-typing-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span>SpeakMate AI is preparing your feedback...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {apiError && (
        <div className="alert alert-danger small d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
          <div className="d-flex align-items-start gap-2">
            <AlertTriangle size={17} className="flex-shrink-0 mt-1" />
            <span>{apiError}</span>
          </div>
          {lastFailedMessage && !isProcessing && (
            <button
              type="button"
              onClick={() => handleSendMessage(lastFailedMessage, { isRetry: true })}
              className="btn btn-sm btn-outline-danger fw-semibold"
            >
              Retry
            </button>
          )}
        </div>
      )}

      <VoiceControls
        onSendMessage={handleSendMessage}
        isProcessing={isProcessing}
        isSpeaking={isSpeaking}
        recognitionLang={state?.settings?.preferredVoiceLang || 'en-IN'}
        onStopSpeaking={() => {
          stopSpeaking();
          setIsSpeaking(false);
        }}
      />
    </AppShell>
  );
}

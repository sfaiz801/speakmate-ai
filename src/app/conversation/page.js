'use client';

import React, { useEffect, useState } from 'react';
import {
  Volume2,
  Award,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import VoiceControls from '@/components/tutor/VoiceControls';
import { useApp } from '@/context/AppContext';
import { CONVERSATION_SCENARIOS } from '@/data/conversationScenarios';
import { speakText, stopSpeaking } from '@/lib/speech/webSpeech';

export default function ConversationPracticePage() {
  const { state, recordSpeakingTurn, addToast } = useApp();

  const [scenarioId, setScenarioId] = useState(CONVERSATION_SCENARIOS[0].id);
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [report, setReport] = useState(null);
  const [apiError, setApiError] = useState('');

  const scenario =
    CONVERSATION_SCENARIOS.find((s) => s.id === scenarioId) || CONVERSATION_SCENARIOS[0];

  useEffect(() => {
    setMessages([
      {
        id: `open-${scenario.id}`,
        role: 'assistant',
        text: scenario.openingLine,
        tip: '',
      },
    ]);
    setReport(null);
    setApiError('');
    stopSpeaking();
    setIsSpeaking(false);
  }, [scenario.id, scenario.openingLine]);

  useEffect(() => () => stopSpeaking(), []);

  const playReply = (text) => {
    speakText(text, {
      lang: state?.settings?.preferredVoiceLang || 'en-IN',
      rate: state?.settings?.speechRate || 0.95,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  };

  const handleSend = async (userText) => {
    setApiError('');
    const userMsg = { id: `u-${Date.now()}`, role: 'user', text: userText };
    const nextMsgs = [...messages, userMsg];
    setMessages(nextMsgs);
    setIsProcessing(true);

    try {
      const res = await fetch('/api/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: nextMsgs.slice(0, -1).map((m) => ({ role: m.role, text: m.text })),
          scenarioTitle: scenario.title,
          aiRole: scenario.aiRole,
          englishLevel: state?.profile?.englishLevel || 'A1',
          explanationLanguage: state?.profile?.explanationLanguage || 'Hindi',
          requestReport: false,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setApiError(json.error || 'Could not continue roleplay.');
        return;
      }

      const replyText = json.data?.reply || 'That sounds great! What else would you like to say?';
      const tip = json.data?.quickCoachTip || '';

      const isFirstUserTurn = messages.filter((m) => m.role === 'user').length === 1;
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: 'assistant', text: replyText, tip },
      ]);

      recordSpeakingTurn({
        type: 'conversation',
        title: `Roleplay: ${scenario.title}`,
        minutesDelta: 2,
        isNewSession: isFirstUserTurn,
        summary: `Practiced real-life roleplay: ${scenario.title}.`,
      });

      if (state?.settings?.autoSpeakResponses !== false) {
        playReply(replyText);
      }
    } catch {
      setApiError('Network error while contacting the roleplay partner.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateReport = async () => {
    const userTurns = messages.filter((m) => m.role === 'user');
    if (userTurns.length === 0) {
      addToast({
        title: 'Speak at least once',
        message: 'Reply at least once in this scenario before generating your performance report.',
        variant: 'info',
      });
      return;
    }

    setApiError('');
    setIsProcessing(true);
    try {
      const res = await fetch('/api/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: messages.map((m) => ({ role: m.role, text: m.text })),
          scenarioTitle: scenario.title,
          aiRole: scenario.aiRole,
          englishLevel: state?.profile?.englishLevel || 'A1',
          explanationLanguage: state?.profile?.explanationLanguage || 'Hindi',
          requestReport: true,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setApiError(json.error || 'Could not generate session report.');
        return;
      }

      setReport(json.data);
      addToast({
        title: 'Performance Report Ready!',
        message: 'Roleplay session saved to your progress.',
        variant: 'success',
      });
    } catch {
      setApiError('Network error while generating your performance report.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestart = () => {
    stopSpeaking();
    setMessages([{ id: `open-${Date.now()}`, role: 'assistant', text: scenario.openingLine, tip: '' }]);
    setReport(null);
    setApiError('');
  };

  return (
    <AppShell
      title="Conversation Practice"
      subtitle="Roleplay 9 real-life situations with Gemini and receive an end-of-session performance report."
      actions={
        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleGenerateReport}
            disabled={isProcessing}
            className="btn btn-success d-inline-flex align-items-center gap-1"
          >
            <Award size={16} />
            End &amp; Get Report
          </button>
          <button
            type="button"
            onClick={handleRestart}
            className="btn btn-outline-secondary d-inline-flex align-items-center gap-1"
          >
            <RotateCcw size={16} />
            Restart
          </button>
        </div>
      }
    >
      {/* Mobile Scenario Dropdown */}
      <div className="sm-card p-3 mb-3 d-lg-none">
        <label htmlFor="mobileScenarioSelect" className="form-label small fw-bold text-muted mb-1">
          Choose Real-Life Scenario (9)
        </label>
        <select
          id="mobileScenarioSelect"
          className="form-select"
          value={scenario.id}
          onChange={(e) => setScenarioId(e.target.value)}
        >
          {CONVERSATION_SCENARIOS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title} ({item.difficulty.split(' ')[0]})
            </option>
          ))}
        </select>
      </div>

      <div className="row g-4">
        {/* Desktop Scenario Picker */}
        <div className="col-12 col-lg-4 d-none d-lg-block">
          <div className="sm-card p-3 position-sticky" style={{ top: '1.25rem' }}>
            <h2 className="h6 fw-bold mb-3 px-1">Real-Life Scenarios (9)</h2>
            <div className="d-flex flex-column gap-2 overflow-auto sm-scroll-thread pe-1" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
              {CONVERSATION_SCENARIOS.map((item) => {
                const selected = item.id === scenario.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setScenarioId(item.id)}
                    className={`btn text-start p-3 rounded-3 border ${
                      selected ? 'border-primary bg-primary bg-opacity-10' : 'bg-white'
                    }`}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold small text-dark">{item.title}</span>
                      <span className="badge sm-badge-soft-blue rounded-pill">
                        {item.difficulty.split(' ')[0]}
                      </span>
                    </div>
                    <div className="small text-muted">{item.hindiTitle}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Roleplay Stage */}
        <div className="col-12 col-lg-8">
          <div className="sm-card p-3 p-sm-4 mb-3">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pb-3 mb-3 border-bottom">
              <div>
                <h2 className="h5 fw-bold mb-0">{scenario.title}</h2>
                <div className="small text-muted">
                  AI Partner: <strong className="text-dark">{scenario.aiRole}</strong> •{' '}
                  {scenario.description}
                </div>
              </div>
            </div>

            <div className="mb-3">
              <div className="small fw-semibold text-muted mb-1">Helpful Phrases to Try:</div>
              <div className="d-flex flex-wrap gap-2">
                {scenario.usefulPhrases.map((phrase) => (
                  <span key={phrase} className="badge sm-badge-soft-primary rounded-pill px-3 py-2">
                    {phrase}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="d-flex flex-column gap-3 overflow-auto mb-3 pe-1 sm-scroll-thread"
              style={{ maxHeight: '44vh', minHeight: 240 }}
            >
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-4 ${isUser ? 'align-self-end' : 'align-self-start'}`}
                    style={{
                      maxWidth: 'min(90%, 620px)',
                      backgroundColor: isUser ? '#eef2ff' : '#f8fafc',
                      border: isUser ? '1px solid #c7d2fe' : '1px solid #e2e8f0',
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                      <span className="small fw-bold text-primary">
                        {isUser ? 'You' : scenario.aiRole}
                      </span>
                      {!isUser && (
                        <button
                          type="button"
                          onClick={() => playReply(msg.text)}
                          className="btn btn-sm btn-light border py-0 px-2"
                        >
                          <Volume2 size={14} />
                        </button>
                      )}
                    </div>
                    <p className="mb-0 text-dark">{msg.text}</p>
                    {msg.tip && (
                      <div className="mt-2 pt-2 border-top small text-primary">
                        <Sparkles size={13} className="me-1" />
                        Coach Tip: {msg.tip}
                      </div>
                    )}
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
                  <span>{scenario.aiRole} is replying...</span>
                </div>
              )}
            </div>

            {apiError && (
              <div className="alert alert-danger small d-flex align-items-start gap-2 mb-3">
                <AlertTriangle size={17} className="flex-shrink-0 mt-1" />
                <span>{apiError}</span>
              </div>
            )}

            <VoiceControls
              onSendMessage={handleSend}
              isProcessing={isProcessing}
              isSpeaking={isSpeaking}
              recognitionLang={state?.settings?.preferredVoiceLang || 'en-IN'}
              onStopSpeaking={() => {
                stopSpeaking();
                setIsSpeaking(false);
              }}
              placeholder="Respond in character using voice or text..."
            />
          </div>

          {/* Performance Report */}
          {report && (
            <div className="sm-card p-4 border-success">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                <h3 className="h5 fw-bold mb-0 d-flex align-items-center gap-2 text-success">
                  <CheckCircle2 size={20} />
                  Session Performance Report
                </h3>
                <span className="badge sm-badge-soft-success rounded-pill px-3 py-2">
                  Communication Score: {report.confidenceScore || 8} / 10
                </span>
              </div>
              <p className="text-dark mb-3">{report.overallSummary}</p>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="p-3 rounded-3 bg-light h-100">
                    <div className="fw-bold small text-success mb-2">What Went Well</div>
                    <ul className="small mb-0 ps-3">
                      {(report.strengths || []).map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="p-3 rounded-3 bg-light h-100">
                    <div className="fw-bold small text-primary mb-2">Areas to Polish</div>
                    <ul className="small mb-0 ps-3">
                      {(report.areasToImprove || []).map((a, idx) => (
                        <li key={idx}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

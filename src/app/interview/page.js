'use client';

import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  Volume2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Info,
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import VoiceControls from '@/components/tutor/VoiceControls';
import { useApp } from '@/context/AppContext';
import { INTERVIEW_CATEGORIES } from '@/data/interviewCategories';
import { speakText, stopSpeaking } from '@/lib/speech/webSpeech';

export default function InterviewPracticePage() {
  const { state, logPracticeSession, addToast } = useApp();

  const [categoryId, setCategoryId] = useState(INTERVIEW_CATEGORIES[0].id);
  const [currentQuestion, setCurrentQuestion] = useState(INTERVIEW_CATEGORIES[0].sampleFirstQuestion);
  const [turns, setTurns] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [apiError, setApiError] = useState('');

  const category =
    INTERVIEW_CATEGORIES.find((c) => c.id === categoryId) || INTERVIEW_CATEGORIES[0];

  useEffect(() => {
    setCurrentQuestion(category.sampleFirstQuestion);
    setTurns([]);
    setApiError('');
    stopSpeaking();
    setIsSpeaking(false);
  }, [category.id, category.sampleFirstQuestion]);

  useEffect(() => () => stopSpeaking(), []);

  const playAudio = (text) => {
    speakText(text, {
      lang: state?.settings?.preferredVoiceLang || 'en-IN',
      rate: state?.settings?.speechRate || 0.95,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  };

  const handleAnswerSubmit = async (answerText) => {
    setApiError('');
    setIsProcessing(true);

    try {
      const historyPayload = turns.flatMap((t) => [
        { role: 'assistant', text: t.question },
        { role: 'user', text: t.answer },
      ]);

      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryTitle: category.title,
          currentQuestion,
          answer: answerText,
          history: historyPayload,
          englishLevel: state?.profile?.englishLevel || 'B1',
          explanationLanguage: state?.profile?.explanationLanguage || 'Hindi',
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setApiError(json.error || 'Failed to evaluate your interview answer.');
        return;
      }

      const evaluation = json.data || {};
      const nextQ =
        evaluation.nextQuestion ||
        'Great effort! Next question: What is one strength that helps you succeed in a team?';

      setTurns((prev) => [
        ...prev,
        {
          id: `turn-${Date.now()}`,
          question: currentQuestion,
          answer: answerText,
          evaluation,
        },
      ]);
      setCurrentQuestion(nextQ);

      logPracticeSession({
        type: 'interview',
        title: `Interview Practice: ${category.title}`,
        durationMinutes: 3,
        summary: `Answered "${currentQuestion.slice(0, 60)}..."`,
      });

      if (state?.settings?.autoSpeakResponses !== false) {
        playAudio(nextQ);
      }
    } catch {
      setApiError('Network error while evaluating your interview answer.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    stopSpeaking();
    setCurrentQuestion(category.sampleFirstQuestion);
    setTurns([]);
    setApiError('');
    addToast({ title: 'Mock Interview Reset', message: 'Ready for a fresh round!', variant: 'info' });
  };

  return (
    <AppShell
      title="Interview Practice"
      subtitle="Answer one interview question at a time and get grammar, vocabulary, communication feedback, and a polished sample answer."
      actions={
        <button
          type="button"
          onClick={handleReset}
          className="btn btn-outline-secondary d-inline-flex align-items-center gap-1"
        >
          <RotateCcw size={16} />
          New Interview
        </button>
      }
    >
      {/* Category Selector */}
      <div className="sm-card p-3 mb-3 mb-md-4">
        <div className="small fw-bold text-muted mb-2">Select Interview Category</div>
        <div className="sm-pill-strip">
          {INTERVIEW_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryId(cat.id)}
              className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold ${
                cat.id === categoryId ? 'sm-gradient-btn' : 'btn-light border text-dark'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
        <div className="small text-muted mt-2">
          {category.description} • <span className="text-primary">{category.hindiTitle}</span>
        </div>
      </div>

      {/* Honest Transcript Scope Notice */}
      <div className="alert alert-info small d-flex align-items-start gap-2 rounded-4 mb-4">
        <Info size={17} className="flex-shrink-0 mt-1" />
        <span>
          Evaluation is based on the words and structure of your typed or spoken transcript. Browser
          speech recognition provides text transcripts only and does not score acoustic accent.
        </span>
      </div>

      {/* Current Interview Question */}
      <div className="sm-card p-4 mb-4 border-primary border-opacity-25">
        <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
          <span className="badge sm-badge-soft-primary rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1">
            <Briefcase size={14} />
            Question #{turns.length + 1}
          </span>
          <button
            type="button"
            onClick={() => playAudio(currentQuestion)}
            className="btn btn-sm btn-light border d-inline-flex align-items-center gap-1"
          >
            <Volume2 size={15} className="text-primary" />
            Listen Question
          </button>
        </div>

        <h2 className="h4 fw-bold text-dark mb-3">{currentQuestion}</h2>

        {apiError && (
          <div className="alert alert-danger small d-flex align-items-start gap-2 mb-3">
            <AlertTriangle size={17} className="flex-shrink-0 mt-1" />
            <span>{apiError}</span>
          </div>
        )}

        <VoiceControls
          onSendMessage={handleAnswerSubmit}
          isProcessing={isProcessing}
          isSpeaking={isSpeaking}
          recognitionLang={state?.settings?.preferredVoiceLang || 'en-IN'}
          onStopSpeaking={() => {
            stopSpeaking();
            setIsSpeaking(false);
          }}
          placeholder="Speak or type your interview answer here..."
        />
      </div>

      {/* Feedback History */}
      {turns.length > 0 && (
        <div className="d-flex flex-column gap-3">
          <h3 className="h5 fw-bold mb-1">Your Answer Evaluations</h3>
          {[...turns].reverse().map((turn) => {
            const ev = turn.evaluation || {};
            return (
              <div key={turn.id} className="sm-card p-4">
                <div className="small text-muted mb-1">Question: {turn.question}</div>
                <div className="p-3 rounded-3 bg-light border mb-3">
                  <div className="small fw-bold text-dark mb-1">Your Answer:</div>
                  <div className="small text-dark">&ldquo;{turn.answer}&rdquo;</div>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <div className="p-3 rounded-3 border h-100">
                      <div className="fw-bold small text-primary mb-1">Grammar Feedback</div>
                      <p className="small text-dark mb-0">{ev.grammarFeedback}</p>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="p-3 rounded-3 border h-100">
                      <div className="fw-bold small text-success mb-1">Communication Feedback</div>
                      <p className="small text-dark mb-0">{ev.communicationFeedback}</p>
                    </div>
                  </div>
                  <div className="col-12 col-md-5">
                    <div className="p-3 rounded-3 border h-100">
                      <div className="fw-bold small text-dark mb-2 d-flex align-items-center gap-1">
                        <Sparkles size={14} className="text-primary" />
                        Vocabulary Upgrades
                      </div>
                      <div className="d-flex flex-wrap gap-2">
                        {(ev.vocabularySuggestions || []).map((word, idx) => (
                          <span key={idx} className="badge sm-badge-soft-blue rounded-pill px-3 py-2">
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-7">
                    <div
                      className="p-3 rounded-3 h-100"
                      style={{ backgroundColor: '#eef2ff', border: '1px solid #c7d2fe' }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-bold small text-primary d-inline-flex align-items-center gap-1">
                          <CheckCircle2 size={15} />
                          Suggested Improved Answer
                        </span>
                        {ev.suggestedImprovedAnswer && (
                          <button
                            type="button"
                            onClick={() => playAudio(ev.suggestedImprovedAnswer)}
                            className="btn btn-sm btn-light border py-0 px-2"
                          >
                            <Volume2 size={14} />
                          </button>
                        )}
                      </div>
                      <p className="small text-dark mb-0">{ev.suggestedImprovedAnswer}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}

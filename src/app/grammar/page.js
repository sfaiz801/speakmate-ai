'use client';

import React, { useRef, useState } from 'react';
import {
  CheckCircle2,
  Volume2,
  Lightbulb,
  HelpCircle,
  BookOpenCheck,
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { useApp } from '@/context/AppContext';
import { GRAMMAR_LESSONS } from '@/data/grammarLessons';
import { speakText } from '@/lib/speech/webSpeech';

export default function GrammarPage() {
  const { state, completeGrammarLesson, addToast } = useApp();

  const [selectedId, setSelectedId] = useState(GRAMMAR_LESSONS[0].id);
  const [showPracticeAnswer, setShowPracticeAnswer] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const lessonDetailRef = useRef(null);
  const completedIds = state?.progress?.completedGrammarIds || [];
  const lesson = GRAMMAR_LESSONS.find((l) => l.id === selectedId) || GRAMMAR_LESSONS[0];

  const handleSelectLesson = (id) => {
    setSelectedId(id);
    setShowPracticeAnswer({});
    setQuizAnswers({});
    setQuizSubmitted(false);
    if (typeof window !== 'undefined' && window.innerWidth < 992) {
      lessonDetailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleChooseOption = (qIdx, optionIdx) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optionIdx }));
  };

  const handleSubmitQuiz = () => {
    const total = lesson.quiz.length;
    const answeredCount = Object.keys(quizAnswers).length;
    if (answeredCount < total) {
      addToast({
        title: 'Answer all questions',
        message: 'Please select an answer for every quiz question before checking.',
        variant: 'info',
      });
      return;
    }

    let score = 0;
    lesson.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) score += 1;
    });

    setQuizSubmitted(true);
    completeGrammarLesson(lesson.id, lesson.title, score, total);
    addToast({
      title: 'Lesson Quiz Checked!',
      message: `You scored ${score}/${total} in ${lesson.title}.`,
      variant: score === total ? 'success' : 'primary',
    });
  };

  return (
    <AppShell
      title="Grammar Lessons"
      subtitle={`${completedIds.length} of ${GRAMMAR_LESSONS.length} structured lessons completed`}
    >
      {/* Mobile Quick Lesson Picker */}
      <div className="sm-card p-3 mb-3 d-lg-none">
        <label htmlFor="mobileLessonSelect" className="form-label small fw-bold text-muted mb-1">
          Jump to Grammar Lesson (11 Topics)
        </label>
        <select
          id="mobileLessonSelect"
          className="form-select"
          value={lesson.id}
          onChange={(e) => handleSelectLesson(e.target.value)}
        >
          {GRAMMAR_LESSONS.map((item, idx) => (
            <option key={item.id} value={item.id}>
              {idx + 1}. {item.title} ({item.level})
              {completedIds.includes(item.id) ? ' ✓' : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="row g-4">
        {/* Desktop Lesson List */}
        <div className="col-12 col-lg-4 d-none d-lg-block">
          <div className="sm-card p-3 position-sticky" style={{ top: '1.25rem' }}>
            <h2 className="h6 fw-bold mb-3 px-1">All Grammar Topics (11)</h2>
            <div className="d-flex flex-column gap-2 overflow-auto sm-scroll-thread pe-1" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
              {GRAMMAR_LESSONS.map((item, idx) => {
                const isDone = completedIds.includes(item.id);
                const isSelected = item.id === lesson.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectLesson(item.id)}
                    className={`btn text-start p-3 rounded-3 border d-flex align-items-start justify-content-between gap-2 ${
                      isSelected ? 'border-primary bg-primary bg-opacity-10' : 'bg-white'
                    }`}
                  >
                    <div>
                      <div className="small text-muted fw-semibold">
                        Lesson {idx + 1} • {item.level} • {item.durationMinutes}m
                      </div>
                      <div className="fw-bold small text-dark">{item.title}</div>
                    </div>
                    {isDone && <CheckCircle2 size={18} className="text-success flex-shrink-0 mt-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Lesson Detail */}
        <div ref={lessonDetailRef} className="col-12 col-lg-8">
          <div className="sm-card p-3 p-sm-4 p-md-5 mb-4">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
              <span className="badge sm-badge-soft-primary rounded-pill px-3 py-2">
                Level {lesson.level} • {lesson.durationMinutes} min lesson
              </span>
              {completedIds.includes(lesson.id) && (
                <span className="badge sm-badge-soft-success rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1">
                  <CheckCircle2 size={14} /> Completed
                </span>
              )}
            </div>

            <h2 className="h3 fw-bold mb-1">{lesson.title}</h2>
            <p className="text-primary fw-semibold small mb-4">{lesson.hindiTitle}</p>

            {/* Simple & Hindi Explanations */}
            <div className="mb-4">
              <h3 className="h6 fw-bold mb-2">Simple English Explanation</h3>
              <p className="text-dark">{lesson.simpleExplanation}</p>
            </div>

            <div
              className="p-3 p-md-4 rounded-4 mb-4"
              style={{ backgroundColor: '#eef2ff', border: '1px solid #c7d2fe' }}
            >
              <h3 className="h6 fw-bold text-primary mb-2">हिंदी में आसान समझ (Hindi Explanation)</h3>
              <p className="mb-0 text-dark">{lesson.hindiExplanation}</p>
            </div>

            <div className="p-3 rounded-3 bg-light border mb-4">
              <div className="small fw-bold text-muted mb-1">Key Formula / Pattern</div>
              <div className="fw-bold text-dark">{lesson.formula}</div>
            </div>

            {/* Examples */}
            <div className="mb-4">
              <h3 className="h6 fw-bold mb-3">Real-Life Examples</h3>
              <div className="d-flex flex-column gap-2">
                {lesson.examples.map((ex, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-3 border d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2"
                  >
                    <div>
                      <div className="fw-semibold text-dark">{ex.en}</div>
                      <div className="small text-muted">{ex.hi}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => speakText(ex.en, { rate: 0.92 })}
                      className="btn btn-sm btn-light border align-self-start d-inline-flex align-items-center gap-1"
                    >
                      <Volume2 size={14} className="text-primary" />
                      Listen
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Practice Questions */}
            <div className="mb-4">
              <h3 className="h6 fw-bold mb-3 d-flex align-items-center gap-2">
                <Lightbulb size={18} className="text-warning" />
                Guided Practice
              </h3>
              {lesson.practiceQuestions.map((pq, idx) => (
                <div key={idx} className="p-3 rounded-3 bg-light border mb-2">
                  <div className="fw-semibold small text-dark mb-1">{pq.prompt}</div>
                  <div className="small text-muted mb-2">Hint: {pq.hint}</div>
                  <button
                    type="button"
                    onClick={() =>
                      setShowPracticeAnswer((prev) => ({ ...prev, [idx]: !prev[idx] }))
                    }
                    className="btn btn-sm btn-outline-primary"
                  >
                    {showPracticeAnswer[idx] ? 'Hide Answer' : 'Check Sample Answer'}
                  </button>
                  {showPracticeAnswer[idx] && (
                    <div className="mt-2 p-2 rounded bg-white border small fw-semibold text-success">
                      Answer: {pq.sampleAnswer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Interactive Quiz */}
            <div className="border-top pt-4">
              <h3 className="h5 fw-bold mb-3 d-flex align-items-center gap-2">
                <HelpCircle size={20} className="text-primary" />
                Quick Check Quiz
              </h3>

              <div className="d-flex flex-column gap-4">
                {lesson.quiz.map((q, qIdx) => {
                  const chosen = quizAnswers[qIdx];
                  const isCorrect = chosen === q.correctIndex;

                  return (
                    <div key={qIdx} className="p-3 rounded-4 border bg-white">
                      <div className="fw-bold mb-3">
                        {qIdx + 1}. {q.question}
                      </div>
                      <div className="d-flex flex-column gap-2">
                        {q.options.map((opt, optIdx) => {
                          const selected = chosen === optIdx;
                          let btnClass = 'btn-outline-secondary text-dark bg-white';
                          if (quizSubmitted) {
                            if (optIdx === q.correctIndex) btnClass = 'btn-success text-white';
                            else if (selected) btnClass = 'btn-danger text-white';
                          } else if (selected) {
                            btnClass = 'btn-primary text-white';
                          }
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleChooseOption(qIdx, optIdx)}
                              className={`btn text-start p-2 px-3 border ${btnClass}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div
                          className={`mt-3 p-3 rounded-3 small ${
                            isCorrect ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'
                          }`}
                        >
                          <div className="fw-bold">
                            {isCorrect ? 'Correct!' : 'Not quite — review this tip:'}
                          </div>
                          <div className="text-dark mt-1">{q.feedback}</div>
                          <div className="text-muted mt-1">{q.hindiFeedback}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 d-flex flex-wrap gap-2">
                {!quizSubmitted ? (
                  <button
                    type="button"
                    onClick={handleSubmitQuiz}
                    className="btn sm-gradient-btn px-4 d-inline-flex align-items-center gap-2"
                  >
                    <BookOpenCheck size={17} />
                    Submit Quiz &amp; Save Progress
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setQuizAnswers({});
                      setQuizSubmitted(false);
                    }}
                    className="btn btn-outline-primary"
                  >
                    Retake Quiz
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

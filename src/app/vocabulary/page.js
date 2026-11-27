'use client';

import React, { useMemo, useState } from 'react';
import {
  Volume2,
  Bookmark,
  CheckCircle2,
  Search,
  RefreshCw,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import EmptyState from '@/components/common/EmptyState';
import { useApp } from '@/context/AppContext';
import { VOCABULARY_SETS, ALL_VOCABULARY_WORDS } from '@/data/vocabularyData';
import { speakText } from '@/lib/speech/webSpeech';

export default function VocabularyPage() {
  const {
    state,
    toggleSaveWord,
    toggleLearnedWord,
    setActiveVocabSetId,
    logPracticeSession,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState('daily');
  const [searchQuery, setSearchQuery] = useState('');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const savedIds = useMemo(
    () => state?.progress?.savedWordIds || [],
    [state?.progress?.savedWordIds]
  );
  const learnedIds = useMemo(
    () => state?.progress?.learnedWordIds || [],
    [state?.progress?.learnedWordIds]
  );
  const currentSetId = state?.progress?.activeVocabSetId || 1;
  const activeSet = VOCABULARY_SETS.find((s) => s.setId === currentSetId) || VOCABULARY_SETS[0];

  const filteredWords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let baseList = activeSet.words;

    if (activeTab === 'saved') {
      baseList = ALL_VOCABULARY_WORDS.filter((w) => savedIds.includes(w.id));
    } else if (activeTab === 'learned') {
      baseList = ALL_VOCABULARY_WORDS.filter((w) => learnedIds.includes(w.id));
    } else if (q) {
      baseList = ALL_VOCABULARY_WORDS;
    }

    if (!q) return baseList;
    return baseList.filter(
      (w) =>
        w.word.toLowerCase().includes(q) ||
        w.hindiMeaning.toLowerCase().includes(q) ||
        w.example.toLowerCase().includes(q)
    );
  }, [activeTab, activeSet.words, savedIds, learnedIds, searchQuery]);

  const quizQuestions = useMemo(() => {
    const pool = activeSet.words;
    return pool.slice(0, 5).map((target, idx) => {
      const distractors = ALL_VOCABULARY_WORDS.filter((w) => w.id !== target.id)
        .slice(idx * 2, idx * 2 + 3)
        .map((w) => w.hindiMeaning);
      const options = [target.hindiMeaning, ...distractors];
      // Deterministic rotation based on index so SSR/CSR never diverges
      const rotateBy = idx % options.length;
      const rotated = [...options.slice(rotateBy), ...options.slice(0, rotateBy)];
      return {
        word: target.word,
        example: target.example,
        correctMeaning: target.hindiMeaning,
        options: rotated,
      };
    });
  }, [activeSet.words]);

  const handlePlayWord = (wordObj) => {
    speakText(`${wordObj.word}. ${wordObj.example}`, {
      lang: state?.settings?.preferredVoiceLang || 'en-IN',
      rate: state?.settings?.speechRate || 0.92,
    });
  };

  const handleNextSet = () => {
    const nextIdx = VOCABULARY_SETS.findIndex((s) => s.setId === currentSetId) + 1;
    const nextSet = VOCABULARY_SETS[nextIdx % VOCABULARY_SETS.length];
    setActiveVocabSetId(nextSet.setId);
    setQuizIndex(0);
    setQuizSelected(null);
    setQuizScore(0);
    setQuizDone(false);
    addToast({
      title: 'Switched Daily Set',
      message: `Loaded ${nextSet.title} (10 fresh words).`,
      variant: 'info',
    });
  };

  const handleAnswerQuiz = (option) => {
    if (quizSelected !== null) return;
    setQuizSelected(option);
    if (option === quizQuestions[quizIndex].correctMeaning) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    if (quizIndex + 1 < quizQuestions.length) {
      setQuizIndex((prev) => prev + 1);
      setQuizSelected(null);
    } else {
      setQuizDone(true);
      logPracticeSession({
        type: 'vocabulary',
        title: `Vocabulary Quiz: ${activeSet.title}`,
        durationMinutes: 5,
        summary: `Scored ${quizScore}/${quizQuestions.length} in daily vocabulary revision.`,
      });
    }
  };

  const restartQuiz = () => {
    setQuizIndex(0);
    setQuizSelected(null);
    setQuizScore(0);
    setQuizDone(false);
  };

  return (
    <AppShell
      title="Daily Vocabulary"
      subtitle="10 practical words per set with Hindi meanings, pronunciation, audio, and revision quizzes."
      actions={
        <button
          type="button"
          onClick={handleNextSet}
          className="btn btn-outline-primary d-inline-flex align-items-center gap-2 fw-semibold"
        >
          <RefreshCw size={16} />
          Next 10-Word Set
        </button>
      }
    >
      {/* Controls Bar */}
      <div className="sm-card p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-lg-7">
            <div className="sm-pill-strip">
              {[
                { id: 'daily', label: `${activeSet.title} (10)` },
                { id: 'saved', label: `My Saved Words (${savedIds.length})` },
                { id: 'learned', label: `Learned Words (${learnedIds.length})` },
                { id: 'quiz', label: 'Revision Quiz' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold ${
                    activeTab === tab.id ? 'sm-gradient-btn' : 'btn-light border text-dark'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab !== 'quiz' && (
            <div className="col-12 col-lg-5">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <Search size={16} className="text-muted" />
                </span>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search English word or Hindi meaning..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search vocabulary"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Revision Quiz Tab */}
      {activeTab === 'quiz' ? (
        <div className="sm-card p-4 p-md-5 mx-auto" style={{ maxWidth: 680 }}>
          {!quizDone ? (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="badge sm-badge-soft-primary rounded-pill px-3 py-2">
                  Question {quizIndex + 1} of {quizQuestions.length}
                </span>
                <span className="small fw-semibold text-muted">Score: {quizScore}</span>
              </div>
              <h2 className="h4 fw-bold mb-2">
                What is the Hindi meaning of &ldquo;{quizQuestions[quizIndex].word}&rdquo;?
              </h2>
              <p className="small text-muted mb-4">
                Example: <em>{quizQuestions[quizIndex].example}</em>
              </p>

              <div className="d-flex flex-column gap-2 mb-4">
                {quizQuestions[quizIndex].options.map((opt) => {
                  const isCorrect = opt === quizQuestions[quizIndex].correctMeaning;
                  const isChosen = quizSelected === opt;
                  let cls = 'btn-outline-secondary text-dark bg-white';
                  if (quizSelected !== null) {
                    if (isCorrect) cls = 'btn-success text-white';
                    else if (isChosen) cls = 'btn-danger text-white';
                  }
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleAnswerQuiz(opt)}
                      disabled={quizSelected !== null}
                      className={`btn text-start p-3 border ${cls}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {quizSelected !== null && (
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    onClick={handleNextQuizQuestion}
                    className="btn sm-gradient-btn px-4"
                  >
                    {quizIndex + 1 < quizQuestions.length ? 'Next Question' : 'Finish Quiz'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <div className="badge sm-badge-soft-success rounded-pill px-3 py-2 mb-3">
                Quiz Completed!
              </div>
              <h2 className="h3 fw-bold mb-2">
                You scored {quizScore} / {quizQuestions.length}
              </h2>
              <p className="text-muted mb-4">
                Your revision session has been added to your daily practice progress.
              </p>
              <button type="button" onClick={restartQuiz} className="btn sm-gradient-btn px-4">
                Try Quiz Again
              </button>
            </div>
          )}
        </div>
      ) : filteredWords.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No matching words found"
          description="Try clearing your search filter or save/learn words from today's 10-word set."
          actionLabel="View Today's 10 Words"
          onAction={() => {
            setSearchQuery('');
            setActiveTab('daily');
          }}
        />
      ) : (
        <div className="row g-3">
          {filteredWords.map((item) => {
            const isSaved = savedIds.includes(item.id);
            const isLearned = learnedIds.includes(item.id);

            return (
              <div key={item.id} className="col-12 col-md-6">
                <div className="sm-card p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <h2 className="h5 fw-bold mb-0 text-dark">{item.word}</h2>
                          <span className="badge sm-badge-soft-blue rounded-pill">
                            {item.level}
                          </span>
                        </div>
                        <div className="small text-muted">
                          {item.partOfSpeech} • <span>/{item.pronunciation}/</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handlePlayWord(item)}
                        className="btn btn-sm btn-light border d-inline-flex align-items-center gap-1"
                        aria-label={`Listen to ${item.word}`}
                      >
                        <Volume2 size={15} className="text-primary" />
                        Listen
                      </button>
                    </div>

                    <div
                      className="p-2 px-3 rounded-3 mb-2 fw-semibold small"
                      style={{ backgroundColor: '#eef2ff', color: '#3730a3' }}
                    >
                      Hindi Meaning: {item.hindiMeaning}
                    </div>

                    <p className="small text-dark mb-3">
                      <span className="text-muted fw-semibold">Example:</span> &ldquo;{item.example}
                      &rdquo;
                    </p>
                  </div>

                  <div className="d-flex flex-wrap gap-2 pt-2 border-top">
                    <button
                      type="button"
                      onClick={() => toggleLearnedWord(item.id)}
                      className={`btn btn-sm d-inline-flex align-items-center gap-1 ${
                        isLearned ? 'btn-success' : 'btn-outline-success'
                      }`}
                    >
                      <CheckCircle2 size={15} />
                      {isLearned ? 'Learned' : 'Mark Learned'}
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleSaveWord(item.id)}
                      className={`btn btn-sm d-inline-flex align-items-center gap-1 ${
                        isSaved ? 'btn-primary' : 'btn-outline-secondary'
                      }`}
                    >
                      <Bookmark size={15} />
                      {isSaved ? 'Saved' : 'Save Word'}
                    </button>
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

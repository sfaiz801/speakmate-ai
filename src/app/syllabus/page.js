'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckSquare,
  Award,
  Volume2,
  Mic,
  PenLine,
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import CertificationView from '@/components/certification/CertificationView';
import { useApp } from '@/context/AppContext';
import {
  SYLLABUS_STAGES,
  SYLLABUS_MODULES,
  CERTIFICATION_TIERS,
} from '@/data/syllabusData';
import { speakText } from '@/lib/speech/webSpeech';
import { buildTodayTasks, getTodayIsoDate } from '@/lib/storage/progressHelpers';
import styles from './Syllabus.module.scss';

export default function SyllabusPage() {
  const {
    state,
    completeSyllabusModule,
    saveWritingSubmission,
    toggleDailyTaskCheck,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState('learning');
  const [stageFilter, setStageFilter] = useState('all');
  const [selectedModuleId, setSelectedModuleId] = useState(SYLLABUS_MODULES[0].id);
  const [writingDraft, setWritingDraft] = useState('');
  const [showSampleWriting, setShowSampleWriting] = useState(false);
  const [aiWritingFeedback, setAiWritingFeedback] = useState(null);
  const [checkingWriting, setCheckingWriting] = useState(false);

  const moduleDetailRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'learning' || tab === 'tasks' || tab === 'certification') {
        setActiveTab(tab);
      }
    }
  }, []);

  const completedSyllabusIds = useMemo(
    () => state?.progress?.completedSyllabusIds || [],
    [state?.progress?.completedSyllabusIds]
  );

  const visibleModules = useMemo(() => {
    if (stageFilter === 'all') return SYLLABUS_MODULES;
    return SYLLABUS_MODULES.filter((m) => m.stageId === stageFilter);
  }, [stageFilter]);

  const activeModule =
    SYLLABUS_MODULES.find((m) => m.id === selectedModuleId) || SYLLABUS_MODULES[0];

  useEffect(() => {
    const saved = state?.progress?.writingSubmissions?.[activeModule.id]?.text || '';
    setWritingDraft(saved);
    setShowSampleWriting(false);
    setAiWritingFeedback(null);
  }, [activeModule.id, state?.progress?.writingSubmissions]);

  const handleSelectModule = (id) => {
    setSelectedModuleId(id);
    if (typeof window !== 'undefined' && window.innerWidth < 992) {
      moduleDetailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePlayPhrase = (text) => {
    speakText(text, {
      lang: state?.settings?.preferredVoiceLang || 'en-IN',
      rate: state?.settings?.speechRate || 0.92,
    });
  };

  const handleSaveWriting = () => {
    if (!writingDraft.trim()) {
      addToast({ title: 'Write something first', message: 'Enter at least one English sentence before saving.', variant: 'info' });
      return;
    }
    saveWritingSubmission(activeModule.id, writingDraft.trim());
    addToast({ title: 'Writing Saved!', message: 'Your written practice is saved locally.', variant: 'success' });
  };

  const handleCheckWritingWithAI = async () => {
    const cleaned = writingDraft.trim();
    if (!cleaned) {
      addToast({ title: 'Empty Writing Box', message: 'Write a few lines first so the AI coach can review them.', variant: 'info' });
      return;
    }

    saveWritingSubmission(activeModule.id, cleaned);
    setCheckingWriting(true);
    setAiWritingFeedback(null);

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Please review my writing for "${activeModule.title}": ${cleaned}`,
          history: [],
          mode: 'Grammar Practice',
          englishLevel: state?.profile?.englishLevel || activeModule.level,
          explanationLanguage: state?.profile?.explanationLanguage || 'Hindi',
          learnerName: state?.profile?.name || 'Learner',
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        addToast({ title: 'Could not check writing', message: json.error || 'Try again in a moment.', variant: 'danger' });
        return;
      }
      setAiWritingFeedback(json.data);
    } catch {
      addToast({ title: 'Network Error', message: 'Could not reach AI coach right now.', variant: 'danger' });
    } finally {
      setCheckingWriting(false);
    }
  };

  const handleCompleteModule = () => {
    completeSyllabusModule(activeModule.id, activeModule.title);
    addToast({
      title: 'Module Completed!',
      message: `Great job finishing "${activeModule.title}".`,
      variant: 'success',
    });
  };

  // Tasks Tab data
  const today = getTodayIsoDate();
  const autoTasks = buildTodayTasks(state);
  const customTaskIdsToday = state?.progress?.completedTaskIdsByDate?.[today] || [];
  const dailyHabitTasks = [
    {
      id: 'habit-words',
      title: `Say today's 4 syllabus words & phrases aloud (${activeModule.title})`,
      hindi: 'आज के मुख्य शब्द और वाक्य बोलकर अभ्यास करें',
      actionLabel: 'Go to Learning',
      onAction: () => setActiveTab('learning'),
    },
    {
      id: 'habit-write',
      title: 'Write 3–4 simple English sentences in the Syllabus Writing Box',
      hindi: 'सिलेबस में 3–4 आसान अंग्रेजी वाक्य लिखें',
      actionLabel: 'Open Writing',
      onAction: () => setActiveTab('learning'),
    },
    {
      id: 'habit-talk',
      title: 'Have a 5-turn voice or text chat with AI Speaking Tutor',
      hindi: 'AI Tutor के साथ 5 बार बोलने का अभ्यास करें',
      actionHref: '/tutor',
      actionLabel: 'Open Tutor',
    },
  ];

  const earnedCertificates = state?.progress?.earnedCertificates || [];

  return (
    <AppShell
      title="Full English Syllabus & Certification"
      subtitle="Step-by-step roadmap: kaha se shuru karein, kya bolein, kya likhein, daily tasks, aur completion certificates."
    >
      {/* Top 3 Dedicated Tabs */}
      <div className={`d-flex flex-wrap gap-2 mb-4 ${styles.noPrint}`} role="tablist" aria-label="Syllabus sections">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'learning'}
          onClick={() => setActiveTab('learning')}
          className={`${styles.tabBtn} d-inline-flex align-items-center gap-2 ${
            activeTab === 'learning' ? styles.tabBtnActive : ''
          }`}
        >
          <BookOpen size={18} />
          Learning (Full Syllabus {completedSyllabusIds.length}/{SYLLABUS_MODULES.length})
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'tasks'}
          onClick={() => setActiveTab('tasks')}
          className={`${styles.tabBtn} d-inline-flex align-items-center gap-2 ${
            activeTab === 'tasks' ? styles.tabBtnActive : ''
          }`}
        >
          <CheckSquare size={18} />
          Tasks
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'certification'}
          onClick={() => setActiveTab('certification')}
          className={`${styles.tabBtn} d-inline-flex align-items-center gap-2 ${
            activeTab === 'certification' ? styles.tabBtnActive : ''
          }`}
        >
          <Award size={18} />
          Certification ({earnedCertificates.length}/{CERTIFICATION_TIERS.length})
        </button>
      </div>

      {/* TAB 1: LEARNING (FULL SYLLABUS) */}
      {activeTab === 'learning' && (
        <div>
          {/* Stage Filter Strip */}
          <div className="sm-card p-3 mb-4">
            <div className="small fw-bold text-muted mb-2">
              Step-by-Step Roadmap (Stage 1 से Stage 4 तक क्रम से सीखें)
            </div>
            <div className="sm-pill-strip mb-3">
              <button
                type="button"
                onClick={() => setStageFilter('all')}
                className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold ${
                  stageFilter === 'all' ? 'sm-gradient-btn' : 'btn-light border text-dark'
                }`}
              >
                All 12 Modules
              </button>
              {SYLLABUS_STAGES.map((stage) => (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setStageFilter(stage.id)}
                  className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold ${
                    stageFilter === stage.id ? 'sm-gradient-btn' : 'btn-light border text-dark'
                  }`}
                >
                  Stage {stage.stageNumber} ({stage.level})
                </button>
              ))}
            </div>
            <div className="row g-2">
              {SYLLABUS_STAGES.map((stage) => (
                <div key={stage.id} className="col-12 col-md-6 col-xl-3">
                  <div className="p-2 px-3 rounded-3 bg-light border h-100">
                    <div className="small fw-bold text-primary">{stage.title}</div>
                    <div className="small text-muted">{stage.hindiTitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Quick Module Picker */}
          <div className="sm-card p-3 mb-3 d-lg-none">
            <label htmlFor="mobileSyllabusSelect" className="form-label small fw-bold text-muted mb-1">
              Select Syllabus Module
            </label>
            <select
              id="mobileSyllabusSelect"
              className="form-select"
              value={activeModule.id}
              onChange={(e) => handleSelectModule(e.target.value)}
            >
              {visibleModules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.dayLabel}: {m.title} ({m.level})
                  {completedSyllabusIds.includes(m.id) ? ' ✓' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="row g-4">
            {/* Desktop Module List */}
            <div className="col-12 col-lg-4 d-none d-lg-block">
              <div className="sm-card p-3 position-sticky" style={{ top: '1.25rem' }}>
                <h2 className="h6 fw-bold mb-3 px-1">Course Modules ({visibleModules.length})</h2>
                <div
                  className="d-flex flex-column gap-2 overflow-auto sm-scroll-thread pe-1"
                  style={{ maxHeight: 'calc(100vh - 9rem)' }}
                >
                  {visibleModules.map((mod) => {
                    const isDone = completedSyllabusIds.includes(mod.id);
                    const isSelected = mod.id === activeModule.id;
                    return (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => handleSelectModule(mod.id)}
                        className={`btn text-start p-3 rounded-3 border d-flex align-items-start justify-content-between gap-2 ${
                          isSelected ? 'border-primary bg-primary bg-opacity-10' : 'bg-white'
                        }`}
                      >
                        <div>
                          <div className="small text-muted fw-semibold">
                            {mod.dayLabel} • {mod.level}
                          </div>
                          <div className="fw-bold small text-dark">{mod.title}</div>
                          <div className="small text-primary">{mod.hindiTitle}</div>
                        </div>
                        {isDone && (
                          <CheckCircle2 size={18} className="text-success flex-shrink-0 mt-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Active Module Detail */}
            <div ref={moduleDetailRef} className="col-12 col-lg-8">
              <div className="sm-card p-3 p-sm-4 p-md-5">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                  <span className="badge sm-badge-soft-primary rounded-pill px-3 py-2">
                    {activeModule.dayLabel} • Level {activeModule.level}
                  </span>
                  {completedSyllabusIds.includes(activeModule.id) && (
                    <span className="badge sm-badge-soft-success rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1">
                      <CheckCircle2 size={14} /> Completed
                    </span>
                  )}
                </div>

                <h2 className="h3 fw-bold mb-1">{activeModule.title}</h2>
                <p className="text-primary fw-semibold small mb-2">{activeModule.hindiTitle}</p>
                <p className="text-muted mb-4">{activeModule.goal}</p>

                {/* 1. What Words & Phrases to Speak */}
                <div className="mb-4">
                  <h3 className="h6 fw-bold mb-3">1. Kya Words aur Sentences Bolein (Speak These)</h3>
                  <div className="row g-2">
                    {activeModule.wordsToSpeak.map((item) => (
                      <div key={item.word} className="col-12 col-md-6">
                        <div className="p-3 rounded-3 border bg-light bg-opacity-50 h-100 d-flex flex-column justify-content-between">
                          <div>
                            <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                              <span className="fw-bold text-dark">{item.word}</span>
                              <button
                                type="button"
                                onClick={() => handlePlayPhrase(item.phrase)}
                                className="btn btn-sm btn-light border py-0 px-2 d-inline-flex align-items-center gap-1"
                                aria-label={`Listen to ${item.phrase}`}
                              >
                                <Volume2 size={13} className="text-primary" />
                                Listen
                              </button>
                            </div>
                            <div className="small text-primary mb-2">{item.hindi}</div>
                          </div>
                          <div className="small text-dark bg-white p-2 rounded border">
                            &ldquo;{item.phrase}&rdquo;
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. What to Talk About (Speaking Practice) */}
                <div
                  className="p-3 p-md-4 rounded-4 mb-4"
                  style={{ backgroundColor: '#eef2ff', border: '1px solid #c7d2fe' }}
                >
                  <h3 className="h6 fw-bold text-primary mb-2 d-flex align-items-center gap-2">
                    <Mic size={17} />
                    2. Kya Baat Karein (Speaking Practice)
                  </h3>
                  <p className="fw-semibold text-dark small mb-1">{activeModule.speakingTask.prompt}</p>
                  <p className="small text-muted mb-3">{activeModule.speakingTask.hindiHint}</p>

                  <div className="d-flex flex-column gap-2 mb-3">
                    {activeModule.speakingTask.sampleLines.map((line) => (
                      <div
                        key={line}
                        className="p-2 px-3 rounded-3 bg-white border d-flex align-items-center justify-content-between gap-2 small"
                      >
                        <span className="text-dark">&ldquo;{line}&rdquo;</span>
                        <button
                          type="button"
                          onClick={() => handlePlayPhrase(line)}
                          className="btn btn-sm btn-light border py-0 px-2 flex-shrink-0"
                        >
                          <Volume2 size={13} className="text-primary" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="d-flex flex-wrap gap-2">
                    <Link
                      href={`/tutor?mode=${activeModule.tutorMode}&topic=${encodeURIComponent(activeModule.title)}`}
                      className="btn btn-sm sm-gradient-btn d-inline-flex align-items-center gap-1"
                    >
                      <Mic size={15} />
                      Practice Speaking with AI Tutor
                    </Link>
                    <Link href="/grammar" className="btn btn-sm btn-outline-primary bg-white">
                      Related Grammar Lesson
                    </Link>
                  </div>
                </div>

                {/* 3. What to Write (Writing Practice) */}
                <div className="p-3 p-md-4 rounded-4 border bg-white mb-4">
                  <h3 className="h6 fw-bold mb-2 d-flex align-items-center gap-2">
                    <PenLine size={17} className="text-primary" />
                    3. Kya Likhein (Writing Practice)
                  </h3>
                  <p className="small fw-semibold text-dark mb-1">{activeModule.writingTask.prompt}</p>
                  <p className="small text-muted mb-3">{activeModule.writingTask.hindiHint}</p>

                  <label htmlFor="syllabusWritingBox" className="visually-hidden">
                    Writing practice box
                  </label>
                  <textarea
                    id="syllabusWritingBox"
                    rows={3}
                    className="form-control mb-3"
                    placeholder="Write your English sentences here..."
                    value={writingDraft}
                    onChange={(e) => setWritingDraft(e.target.value)}
                  />

                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <button
                      type="button"
                      onClick={handleCheckWritingWithAI}
                      disabled={checkingWriting}
                      className="btn btn-sm sm-gradient-btn d-inline-flex align-items-center gap-1"
                    >
                      <Sparkles size={15} />
                      {checkingWriting ? 'Checking...' : 'Check Writing with AI Coach'}
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveWriting}
                      className="btn btn-sm btn-outline-secondary"
                    >
                      Save Draft
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSampleWriting((p) => !p)}
                      className="btn btn-sm btn-light border"
                    >
                      {showSampleWriting ? 'Hide Sample' : 'See Sample Answer'}
                    </button>
                  </div>

                  {showSampleWriting && (
                    <div className="p-3 rounded-3 bg-light border small mb-2">
                      <strong className="text-success">Sample Answer:</strong>{' '}
                      {activeModule.writingTask.sampleAnswer}
                    </div>
                  )}

                  {aiWritingFeedback && (
                    <div className="p-3 rounded-3 border bg-light small">
                      <div className="fw-bold text-primary mb-1">AI Coach Feedback</div>
                      <p className="mb-2 text-dark">{aiWritingFeedback.reply}</p>
                      {aiWritingFeedback.hasCorrection && aiWritingFeedback.correctedSentence && (
                        <div className="p-2 rounded bg-white border">
                          <div className="text-success fw-semibold">
                            Better: {aiWritingFeedback.correctedSentence}
                          </div>
                          {aiWritingFeedback.explanation && (
                            <div className="text-muted mt-1">{aiWritingFeedback.explanation}</div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Mark Complete */}
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-3 border-top">
                  <div className="small text-muted">
                    Finish speaking + writing above, then mark this module completed.
                  </div>
                  <button
                    type="button"
                    onClick={handleCompleteModule}
                    className={`btn d-inline-flex align-items-center gap-2 ${
                      completedSyllabusIds.includes(activeModule.id)
                        ? 'btn-success'
                        : 'sm-gradient-btn'
                    }`}
                  >
                    <CheckCircle2 size={17} />
                    {completedSyllabusIds.includes(activeModule.id)
                      ? 'Completed (Saved)'
                      : 'Mark Module Completed'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TASKS */}
      {activeTab === 'tasks' && (
        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <div className="sm-card p-4 h-100">
              <h2 className="h5 fw-bold mb-1">Daily Speaking, Writing &amp; Word Tasks</h2>
              <p className="small text-muted mb-3">
                Tick off your daily practice habits for today ({today}).
              </p>

              <div className="d-flex flex-column gap-2 mb-4">
                {dailyHabitTasks.map((task) => {
                  const checked = customTaskIdsToday.includes(task.id);
                  return (
                    <div
                      key={task.id}
                      className="p-3 rounded-3 border d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 bg-light bg-opacity-50"
                    >
                      <button
                        type="button"
                        onClick={() => toggleDailyTaskCheck(task.id)}
                        className="btn btn-link text-start text-decoration-none p-0 d-flex align-items-start gap-2 text-dark"
                      >
                        {checked ? (
                          <CheckCircle2 size={20} className="text-success flex-shrink-0 mt-1" />
                        ) : (
                          <Circle size={20} className="text-muted flex-shrink-0 mt-1" />
                        )}
                        <span>
                          <span className={`d-block fw-semibold small ${checked ? 'text-decoration-line-through text-muted' : ''}`}>
                            {task.title}
                          </span>
                          <span className="d-block small text-primary">{task.hindi}</span>
                        </span>
                      </button>

                      {task.actionHref ? (
                        <Link
                          href={task.actionHref}
                          className="btn btn-sm btn-outline-primary flex-shrink-0"
                        >
                          {task.actionLabel}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={task.onAction}
                          className="btn btn-sm btn-outline-primary flex-shrink-0"
                        >
                          {task.actionLabel}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <h3 className="h6 fw-bold mb-2">Auto-Tracked Milestones Today</h3>
              <div className="d-flex flex-column gap-2">
                {autoTasks.map((t) => (
                  <Link
                    key={t.id}
                    href={t.href}
                    className="p-3 rounded-3 border d-flex align-items-center justify-content-between gap-2 text-dark sm-task-row"
                  >
                    <div className="d-flex align-items-center gap-2">
                      {t.done ? (
                        <CheckCircle2 size={18} className="text-success flex-shrink-0" />
                      ) : (
                        <Circle size={18} className="text-muted flex-shrink-0" />
                      )}
                      <span className="small fw-semibold">{t.title}</span>
                    </div>
                    <span className="badge sm-badge-soft-primary rounded-pill">{t.cta}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <div className="sm-card p-4">
              <h2 className="h5 fw-bold mb-2">Daily 30-Minute Routine Plan</h2>
              <p className="small text-muted mb-3">
                Agar samajh na aaye ki roz kya karein, to is simple schedule ko follow karein:
              </p>
              <div className="d-flex flex-column gap-3 small">
                <div className="p-3 rounded-3 bg-light border">
                  <div className="fw-bold text-primary">10 mins — Vocabulary &amp; Words</div>
                  <div className="text-muted">Learn 5–10 daily words, click Listen, and repeat aloud.</div>
                </div>
                <div className="p-3 rounded-3 bg-light border">
                  <div className="fw-bold text-primary">5 mins — Writing Task</div>
                  <div className="text-muted">Write 3–4 short lines in the Learning tab and check with AI.</div>
                </div>
                <div className="p-3 rounded-3 bg-light border">
                  <div className="fw-bold text-primary">15 mins — Speaking Practice</div>
                  <div className="text-muted">Talk in AI Speaking Tutor or Conversation Roleplay without fear.</div>
                </div>
              </div>
              <Link
                href="/tutor"
                className="btn sm-gradient-btn w-100 mt-4 d-inline-flex align-items-center justify-content-center gap-2"
              >
                Start Today&apos;s Speaking Session
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CERTIFICATION */}
      {activeTab === 'certification' && <CertificationView />}
    </AppShell>
  );
}

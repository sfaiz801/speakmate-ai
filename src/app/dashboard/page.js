'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  Flame,
  Clock,
  BookOpen,
  GraduationCap,
  Mic,
  ArrowRight,
  CheckCircle2,
  Circle,
  Sparkles,
  MessagesSquare,
  Briefcase,
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import StatCard from '@/components/common/StatCard';
import { DashboardSkeleton } from '@/components/common/LoadingSkeleton';
import ProgressChart from '@/components/charts/ProgressChart';
import { useApp } from '@/context/AppContext';
import { ENGLISH_LEVELS } from '@/data/levels';
import { GRAMMAR_LESSONS } from '@/data/grammarLessons';
import { buildTodayTasks, getTodayMinutes } from '@/lib/storage/progressHelpers';

export default function DashboardPage() {
  const { state, isHydrated } = useApp();

  const weeklyChartData = useMemo(() => {
    const days = (state?.progress?.dailyActivity || []).slice(-7);
    return {
      labels: days.map((d) => d.label || d.date?.slice(5)),
      datasets: [
        {
          label: 'Speaking & Study Minutes',
          data: days.map((d) => d.minutes || 0),
          backgroundColor: 'rgba(79, 70, 229, 0.82)',
          borderRadius: 8,
          maxBarThickness: 36,
        },
      ],
    };
  }, [state?.progress?.dailyActivity]);

  if (!isHydrated) {
    return (
      <AppShell title="Learning Dashboard">
        <DashboardSkeleton />
      </AppShell>
    );
  }

  const { profile, progress } = state;
  const levelObj = ENGLISH_LEVELS.find((l) => l.id === profile.englishLevel) || ENGLISH_LEVELS[0];
  const todayMinutes = getTodayMinutes(progress.dailyActivity);
  const goalMinutes = profile.dailyGoalMinutes || 15;
  const goalPct = Math.min(100, Math.round((todayMinutes / goalMinutes) * 100));
  const tasks = buildTodayTasks(state);

  const nextLesson =
    GRAMMAR_LESSONS.find((lesson) => !(progress.completedGrammarIds || []).includes(lesson.id)) ||
    GRAMMAR_LESSONS[0];

  return (
    <AppShell
      title={`Namaste, ${profile.name}!`}
      subtitle={`Level: ${levelObj.name} • Daily Goal: ${goalMinutes} mins • Explanations in ${profile.explanationLanguage}`}
      actions={
        <Link href="/tutor" className="btn sm-gradient-btn d-inline-flex align-items-center gap-2">
          <Mic size={17} />
          Talk to AI Tutor
        </Link>
      }
    >
      {/* Onboarding Nudge if not completed */}
      {!profile.onboarded && (
        <div className="alert alert-primary d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-4 rounded-4">
          <div className="d-flex align-items-center gap-2">
            <Sparkles size={18} />
            <span className="small fw-semibold">
              Personalize your level, name, and Hindi explanation settings for a tailored AI tutor!
            </span>
          </div>
          <Link href="/onboarding" className="btn btn-sm btn-primary fw-semibold">
            Complete Setup
          </Link>
        </div>
      )}

      {/* Daily Goal Hero Banner */}
      <div
        className="p-3 p-md-4 rounded-4 text-white mb-4 shadow-sm"
        style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6d28d9 60%, #2563eb 100%)' }}
      >
        <div className="row align-items-center g-3">
          <div className="col-12 col-lg-8">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <span className="badge bg-white bg-opacity-25 text-white rounded-pill px-3 py-1">
                {levelObj.name}
              </span>
              <span className="badge bg-white bg-opacity-25 text-white rounded-pill px-3 py-1">
                Today: {todayMinutes} / {goalMinutes} mins
              </span>
            </div>
            <h2 className="h4 fw-bold mb-2">
              {goalPct >= 100
                ? 'Awesome! You hit today’s speaking goal!'
                : 'Ready for a quick 5-minute speaking warm-up?'}
            </h2>
            <p className="mb-3 opacity-90 small">
              Practice speaking aloud without hesitation. Your AI tutor corrects important grammar
              mistakes politely in {profile.explanationLanguage}.
            </p>
            <div className="progress bg-white bg-opacity-25" style={{ height: 10, maxWidth: 420 }}>
              <div
                className="progress-bar bg-warning"
                role="progressbar"
                style={{ width: `${goalPct}%` }}
                aria-valuenow={goalPct}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
          <div className="col-12 col-lg-4 d-flex flex-wrap justify-content-lg-end gap-2">
            <Link href="/tutor" className="btn btn-light text-primary fw-bold px-4">
              <Mic size={17} className="me-1" />
              Open AI Tutor
            </Link>
            <Link href="/conversation" className="btn btn-outline-light fw-semibold">
              Roleplay
            </Link>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3">
          <StatCard
            icon={Flame}
            label="Learning Streak"
            value={`${progress.streakDays || 0} days`}
            subtext="Keep practicing daily"
            tone="amber"
          />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard
            icon={Clock}
            label="Speaking Practice"
            value={`${progress.totalSpeakingMinutes || 0} mins`}
            subtext={`${progress.totalSessions || 0} sessions logged`}
            tone="indigo"
          />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard
            icon={BookOpen}
            label="Vocabulary Learned"
            value={progress.learnedWordIds?.length || 0}
            subtext={`${progress.savedWordIds?.length || 0} saved words`}
            tone="blue"
          />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard
            icon={GraduationCap}
            label="Completed Lessons"
            value={`${progress.completedGrammarIds?.length || 0} / ${GRAMMAR_LESSONS.length}`}
            subtext="Grammar modules"
            tone="emerald"
          />
        </div>
      </div>

      {/* Main Grid: Weekly Chart + Today's Tasks */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-7">
          <div className="sm-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h2 className="h5 fw-bold mb-0">Weekly Practice Activity</h2>
                <div className="small text-muted">Minutes practiced across the last 7 days</div>
              </div>
              <Link href="/progress" className="small fw-semibold text-primary">
                View Full Analytics
              </Link>
            </div>
            <ProgressChart type="bar" data={weeklyChartData} height={240} />
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="sm-card p-4 h-100">
            <h2 className="h5 fw-bold mb-1">Today&apos;s Learning Tasks</h2>
            <p className="small text-muted mb-3">Complete small steps every day to build fluency.</p>
            <div className="d-flex flex-column gap-2">
              {tasks.map((task) => (
                <Link
                  key={task.id}
                  href={task.href}
                  className="p-3 rounded-3 border d-flex align-items-center justify-content-between gap-2 text-dark bg-light bg-opacity-50 sm-task-row"
                >
                  <div className="d-flex align-items-center gap-2 min-w-0">
                    {task.done ? (
                      <CheckCircle2 size={19} className="text-success flex-shrink-0" />
                    ) : (
                      <Circle size={19} className="text-muted flex-shrink-0" />
                    )}
                    <span className={`small fw-semibold ${task.done ? 'text-decoration-line-through text-muted' : ''}`}>
                      {task.title}
                    </span>
                  </div>
                  <span className="badge sm-badge-soft-primary rounded-pill flex-shrink-0">
                    {task.cta}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Continue Learning Section */}
      <div className="mb-2">
        <h2 className="h5 fw-bold mb-3">Continue Learning</h2>
        <div className="row g-3">
          <div className="col-12 col-md-4">
            <div className="sm-card sm-card-interactive p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <span className="badge sm-badge-soft-primary rounded-pill mb-2">Next Grammar Lesson</span>
                <h3 className="h6 fw-bold mb-1">{nextLesson.title}</h3>
                <p className="small text-muted mb-3">{nextLesson.summary}</p>
              </div>
              <Link href="/grammar" className="fw-semibold small text-primary d-inline-flex align-items-center gap-1">
                Start Lesson <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="sm-card sm-card-interactive p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <span className="badge sm-badge-soft-blue rounded-pill mb-2">Real-Life Roleplay</span>
                <h3 className="h6 fw-bold mb-1 d-flex align-items-center gap-2">
                  <MessagesSquare size={17} className="text-primary" />
                  Conversation Practice
                </h3>
                <p className="small text-muted mb-3">
                  Practice ordering food, office syncs, phone calls, or meeting new people with an AI report.
                </p>
              </div>
              <Link href="/conversation" className="fw-semibold small text-primary d-inline-flex align-items-center gap-1">
                Choose a Scenario <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="sm-card sm-card-interactive p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <span className="badge sm-badge-soft-success rounded-pill mb-2">Career Booster</span>
                <h3 className="h6 fw-bold mb-1 d-flex align-items-center gap-2">
                  <Briefcase size={17} className="text-success" />
                  AI Interview Simulator
                </h3>
                <p className="small text-muted mb-3">
                  Answer one interview question at a time and get grammar, vocabulary, and improved answer coaching.
                </p>
              </div>
              <Link href="/interview" className="fw-semibold small text-primary d-inline-flex align-items-center gap-1">
                Start Mock Interview <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

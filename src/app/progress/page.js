'use client';

import React, { useMemo } from 'react';
import {
  Flame,
  Clock,
  BookOpen,
  GraduationCap,
  Award,
  Activity,
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import StatCard from '@/components/common/StatCard';
import ProgressChart from '@/components/charts/ProgressChart';
import EmptyState from '@/components/common/EmptyState';
import { DashboardSkeleton } from '@/components/common/LoadingSkeleton';
import { useApp } from '@/context/AppContext';
import { GRAMMAR_LESSONS } from '@/data/grammarLessons';
import { ALL_VOCABULARY_WORDS } from '@/data/vocabularyData';
import { getLastSevenDaysSeries } from '@/lib/storage/progressHelpers';

export default function ProgressPage() {
  const { state, isHydrated } = useApp();

  const activityLineData = useMemo(() => {
    const days = getLastSevenDaysSeries(state?.progress?.dailyActivity);
    return {
      labels: days.map((d) => d.label || d.date?.slice(5)),
      datasets: [
        {
          label: 'Minutes Practiced',
          data: days.map((d) => d.minutes || 0),
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79, 70, 229, 0.14)',
          fill: true,
          tension: 0.35,
        },
        {
          label: 'Words Learned',
          data: days.map((d) => d.wordsLearned || 0),
          borderColor: '#0ea5e9',
          backgroundColor: 'rgba(14, 165, 233, 0.12)',
          fill: false,
          tension: 0.35,
        },
      ],
    };
  }, [state?.progress?.dailyActivity]);

  const breakdownDoughnutData = useMemo(() => {
    const completedLessons = state?.progress?.completedGrammarIds?.length || 0;
    const remainingLessons = Math.max(0, GRAMMAR_LESSONS.length - completedLessons);
    return {
      labels: ['Completed Lessons', 'Remaining Lessons'],
      datasets: [
        {
          data: [completedLessons, remainingLessons],
          backgroundColor: ['#10b981', '#e2e8f0'],
          borderWidth: 0,
        },
      ],
    };
  }, [state?.progress?.completedGrammarIds]);

  if (!isHydrated) {
    return (
      <AppShell title="Progress Tracking">
        <DashboardSkeleton />
      </AppShell>
    );
  }

  const { progress } = state;
  const quizScores = progress.quizScores || [];
  const history = progress.practiceHistory || [];
  const avgQuizPct = quizScores.length
    ? Math.round(
        (quizScores.reduce((acc, q) => acc + q.score / Math.max(1, q.total), 0) /
          quizScores.length) *
          100
      )
    : 0;

  return (
    <AppShell
      title="Progress Tracking"
      subtitle="All speaking minutes, streaks, vocabulary, and quiz scores persisted locally in your browser."
    >
      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3">
          <StatCard
            icon={Flame}
            label="Learning Streak"
            value={`${progress.streakDays || 0} days`}
            subtext={`Last active: ${progress.lastActiveDate || 'Today'}`}
            tone="amber"
          />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard
            icon={Clock}
            label="Total Duration"
            value={`${progress.totalSpeakingMinutes || 0} mins`}
            subtext={`${progress.totalSessions || 0} speaking sessions`}
            tone="indigo"
          />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard
            icon={BookOpen}
            label="Vocabulary Learned"
            value={`${progress.learnedWordIds?.length || 0} / ${ALL_VOCABULARY_WORDS.length}`}
            subtext={`${progress.savedWordIds?.length || 0} saved for review`}
            tone="blue"
          />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard
            icon={Award}
            label="Quiz Accuracy"
            value={quizScores.length ? `${avgQuizPct}%` : '—'}
            subtext={`${quizScores.length} quizzes completed`}
            tone="emerald"
          />
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-8">
          <div className="sm-card p-4 h-100">
            <h2 className="h5 fw-bold mb-1">Daily Learning Activity</h2>
            <p className="small text-muted mb-3">Practice minutes &amp; vocabulary growth over the past 7 days</p>
            <ProgressChart type="line" data={activityLineData} height={260} />
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="sm-card p-4 h-100">
            <h2 className="h5 fw-bold mb-1">Grammar Completion</h2>
            <p className="small text-muted mb-3">
              {progress.completedGrammarIds?.length || 0} of {GRAMMAR_LESSONS.length} lessons done
            </p>
            <ProgressChart type="doughnut" data={breakdownDoughnutData} height={220} />
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="sm-card p-4 h-100">
            <h2 className="h5 fw-bold mb-3 d-flex align-items-center gap-2">
              <GraduationCap size={19} className="text-primary" />
              Quiz Performance
            </h2>
            {quizScores.length === 0 ? (
              <EmptyState
                icon={GraduationCap}
                title="No quizzes taken yet"
                description="Finish a Grammar Lesson quiz to record your first score here."
                actionLabel="Go to Grammar"
                actionHref="/grammar"
              />
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 small">
                  <thead>
                    <tr className="text-muted">
                      <th>Topic</th>
                      <th>Score</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizScores.map((q) => (
                      <tr key={q.id}>
                        <td className="fw-semibold text-dark">{q.topicTitle}</td>
                        <td>
                          <span className="badge sm-badge-soft-success rounded-pill">
                            {q.score} / {q.total}
                          </span>
                        </td>
                        <td className="text-muted">{q.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="sm-card p-4 h-100">
            <h2 className="h5 fw-bold mb-3 d-flex align-items-center gap-2">
              <Activity size={19} className="text-primary" />
              Recent Practice History
            </h2>
            {history.length === 0 ? (
              <EmptyState
                icon={Activity}
                title="No practice sessions yet"
                description="Start a conversation in AI Speaking Tutor or Roleplay Practice."
                actionLabel="Open AI Tutor"
                actionHref="/tutor"
              />
            ) : (
              <div className="d-flex flex-column gap-2">
                {history.slice(0, 8).map((item) => (
                  <div key={item.id} className="p-3 rounded-3 border bg-light bg-opacity-50">
                    <div className="d-flex justify-content-between align-items-center gap-2 mb-1">
                      <span className="fw-bold small text-dark">{item.title}</span>
                      <span className="badge sm-badge-soft-primary rounded-pill">
                        {item.durationMinutes} min
                      </span>
                    </div>
                    {item.summary && <div className="small text-muted">{item.summary}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

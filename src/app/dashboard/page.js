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
  Award,
  Activity,
  Map,
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import StatCard from '@/components/common/StatCard';
import { DashboardSkeleton } from '@/components/common/LoadingSkeleton';
import ProgressChart from '@/components/charts/ProgressChart';
import { useApp } from '@/context/AppContext';
import { ENGLISH_LEVELS } from '@/data/levels';
import { GRAMMAR_LESSONS } from '@/data/grammarLessons';
import { SYLLABUS_MODULES, CERTIFICATION_TIERS } from '@/data/syllabusData';
import {
  buildTodayTasks,
  getLastSevenDaysSeries,
  getTodayMinutes,
} from '@/lib/storage/progressHelpers';

export default function DashboardPage() {
  const { state, isHydrated } = useApp();

  const weeklyChartData = useMemo(() => {
    const days = getLastSevenDaysSeries(state?.progress?.dailyActivity);
    return {
      labels: days.map((d) => d.label),
      datasets: [
        {
          label: 'Speaking & Study Minutes',
          data: days.map((d) => d.minutes || 0),
          backgroundColor: 'rgba(79, 70, 229, 0.85)',
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

  const completedSyllabusCount = progress.completedSyllabusIds?.length || 0;
  const completedGrammarCount = progress.completedGrammarIds?.length || 0;
  const earnedCertCount = progress.earnedCertificates?.length || 0;
  const recentHistory = (progress.practiceHistory || []).slice(0, 4);

  const nextLesson =
    GRAMMAR_LESSONS.find((lesson) => !(progress.completedGrammarIds || []).includes(lesson.id)) ||
    GRAMMAR_LESSONS[0];
  const nextSyllabus =
    SYLLABUS_MODULES.find((mod) => !(progress.completedSyllabusIds || []).includes(mod.id)) ||
    SYLLABUS_MODULES[0];

  return (
    <AppShell
      title={`Namaste, ${profile.name}!`}
      subtitle={`Level: ${levelObj.name} • Daily Goal: ${goalMinutes} mins • Live Progress Tracking`}
      actions={
        <div className="d-flex flex-wrap gap-2">
          <Link href="/syllabus" className="btn btn-outline-primary d-inline-flex align-items-center gap-2 fw-semibold">
            <Map size={16} />
            Full Syllabus &amp; Certs
          </Link>
          <Link href="/tutor" className="btn sm-gradient-btn d-inline-flex align-items-center gap-2">
            <Mic size={17} />
            Talk to AI Tutor
          </Link>
        </div>
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
              <span className="badge bg-success bg-opacity-75 text-white rounded-pill px-3 py-1">
                Live Synced
              </span>
            </div>
            <h2 className="h4 fw-bold mb-2">
              {goalPct >= 100
                ? 'Awesome! You hit today’s speaking goal!'
                : todayMinutes === 0
                ? 'Start your first speaking session today!'
                : `Great momentum! ${goalMinutes - todayMinutes} mins left for today's goal.`}
            </h2>
            <p className="mb-3 opacity-90 small">
              Every speaking turn, vocabulary word, grammar quiz, and syllabus module updates these
              stats in real time.
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
            <Link href="/syllabus?tab=tasks" className="btn btn-outline-light fw-semibold">
              Daily Tasks
            </Link>
          </div>
        </div>
      </div>

      {/* Real-Time Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3">
          <StatCard
            icon={Flame}
            label="Learning Streak"
            value={`${progress.streakDays || 0} days`}
            subtext={progress.lastActiveDate ? `Active: ${progress.lastActiveDate}` : 'Practice today to start'}
            tone="amber"
          />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard
            icon={Clock}
            label="Speaking Practice"
            value={`${progress.totalSpeakingMinutes || 0} mins`}
            subtext={`${progress.totalSessions || 0} sessions completed`}
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
            label="Lessons & Syllabus"
            value={`${completedSyllabusCount} / ${SYLLABUS_MODULES.length}`}
            subtext={`${completedGrammarCount}/${GRAMMAR_LESSONS.length} grammar • ${earnedCertCount}/${CERTIFICATION_TIERS.length} certs`}
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
                <h2 className="h5 fw-bold mb-0">Real-Time Weekly Activity</h2>
                <div className="small text-muted">Actual minutes practiced across the last 7 days</div>
              </div>
              <Link href="/progress" className="small fw-semibold text-primary">
                Full Analytics
              </Link>
            </div>
            <ProgressChart type="bar" data={weeklyChartData} height={240} />
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="sm-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <h2 className="h5 fw-bold mb-0">Today&apos;s Learning Tasks</h2>
              <Link href="/syllabus?tab=tasks" className="small fw-semibold text-primary">
                Tasks Tab
              </Link>
            </div>
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

      {/* Live Recent Activity & Syllabus/Cert Quick Cards */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-5">
          <div className="sm-card p-4 h-100">
            <h2 className="h5 fw-bold mb-3 d-flex align-items-center gap-2">
              <Activity size={18} className="text-primary" />
              Recent Live Activity
            </h2>
            {recentHistory.length === 0 ? (
              <div className="p-3 rounded-3 bg-light border small text-muted">
                No activity logged yet. Speak 1 sentence in AI Tutor, learn a word, or finish a
                syllabus module to see live updates here!
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {recentHistory.map((item) => (
                  <div key={item.id} className="p-3 rounded-3 border bg-light bg-opacity-50">
                    <div className="d-flex justify-content-between align-items-center gap-2">
                      <span className="fw-bold small text-dark text-truncate">{item.title}</span>
                      <span className="badge sm-badge-soft-primary rounded-pill flex-shrink-0">
                        {item.durationMinutes} min
                      </span>
                    </div>
                    <div className="small text-muted mt-1">
                      {item.date ? new Date(item.date).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : 'Today'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="row g-3 h-100">
            <div className="col-12 col-md-6">
              <div className="sm-card sm-card-interactive p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <span className="badge sm-badge-soft-primary rounded-pill mb-2">
                    Next Syllabus Step • {nextSyllabus.dayLabel}
                  </span>
                  <h3 className="h6 fw-bold mb-1">{nextSyllabus.title}</h3>
                  <p className="small text-primary mb-2">{nextSyllabus.hindiTitle}</p>
                  <p className="small text-muted mb-3">{nextSyllabus.goal}</p>
                </div>
                <Link href="/syllabus?tab=learning" className="fw-semibold small text-primary d-inline-flex align-items-center gap-1">
                  Open Syllabus <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="sm-card sm-card-interactive p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <span className="badge sm-badge-soft-success rounded-pill mb-2 d-inline-flex align-items-center gap-1">
                    <Award size={13} /> Certification
                  </span>
                  <h3 className="h6 fw-bold mb-1">
                    {earnedCertCount} / {CERTIFICATION_TIERS.length} Certificates Earned
                  </h3>
                  <p className="small text-muted mb-3">
                    Track Foundation (A1–A2), Conversational (B1), and Career Mastery (B2–C1)
                    milestones.
                  </p>
                </div>
                <Link href="/certification" className="fw-semibold small text-primary d-inline-flex align-items-center gap-1">
                  Open Certification Section <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="sm-card sm-card-interactive p-3 h-100 d-flex flex-column justify-content-between">
                <div>
                  <span className="badge sm-badge-soft-blue rounded-pill mb-2">Grammar</span>
                  <h3 className="h6 fw-bold mb-2">{nextLesson.title}</h3>
                </div>
                <Link href="/grammar" className="fw-semibold small text-primary d-inline-flex align-items-center gap-1">
                  Practice <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="sm-card sm-card-interactive p-3 h-100 d-flex flex-column justify-content-between">
                <div>
                  <span className="badge sm-badge-soft-blue rounded-pill mb-2">Roleplay</span>
                  <h3 className="h6 fw-bold mb-2 d-flex align-items-center gap-1">
                    <MessagesSquare size={15} className="text-primary" /> Conversations
                  </h3>
                </div>
                <Link href="/conversation" className="fw-semibold small text-primary d-inline-flex align-items-center gap-1">
                  Open <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="sm-card sm-card-interactive p-3 h-100 d-flex flex-column justify-content-between">
                <div>
                  <span className="badge sm-badge-soft-warning rounded-pill mb-2">Career</span>
                  <h3 className="h6 fw-bold mb-2 d-flex align-items-center gap-1">
                    <Briefcase size={15} className="text-warning" /> Interviews
                  </h3>
                </div>
                <Link href="/interview" className="fw-semibold small text-primary d-inline-flex align-items-center gap-1">
                  Practice <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

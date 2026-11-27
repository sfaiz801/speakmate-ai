/**
 * Pure helper functions for calculating streaks, daily goals, and dashboard tasks.
 */

export function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function computeUpdatedStreak(lastActiveDate, currentStreak, today = getTodayIsoDate()) {
  if (!lastActiveDate) return Math.max(1, currentStreak || 1);
  if (lastActiveDate === today) return Math.max(1, currentStreak || 1);

  const prev = new Date(`${lastActiveDate}T00:00:00Z`);
  const curr = new Date(`${today}T00:00:00Z`);
  const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return (currentStreak || 0) + 1;
  }
  return 1;
}

export function upsertTodayActivity(dailyActivity = [], delta = {}) {
  const today = getTodayIsoDate();
  const label = new Date().toLocaleDateString('en-IN', { weekday: 'short' });
  const list = Array.isArray(dailyActivity) ? [...dailyActivity] : [];
  const idx = list.findIndex((item) => item.date === today);

  if (idx >= 0) {
    const existing = list[idx];
    list[idx] = {
      ...existing,
      minutes: (existing.minutes || 0) + (delta.minutes || 0),
      sessions: (existing.sessions || 0) + (delta.sessions || 0),
      wordsLearned: (existing.wordsLearned || 0) + (delta.wordsLearned || 0),
    };
  } else {
    list.push({
      date: today,
      label,
      minutes: delta.minutes || 0,
      sessions: delta.sessions || 0,
      wordsLearned: delta.wordsLearned || 0,
    });
  }

  return list.slice(-14);
}

export function getTodayMinutes(dailyActivity = []) {
  const today = getTodayIsoDate();
  const entry = dailyActivity.find((d) => d.date === today);
  return entry ? entry.minutes || 0 : 0;
}

/**
 * Aligns weekly chart data to the exact last 7 real calendar days.
 */
export function getLastSevenDaysSeries(dailyActivity = []) {
  const byDate = new Map((dailyActivity || []).map((d) => [d.date, d]));
  const result = [];
  const today = new Date();

  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('en-IN', { weekday: 'short' });
    const found = byDate.get(iso);
    result.push({
      date: iso,
      label,
      minutes: found?.minutes || 0,
      sessions: found?.sessions || 0,
      wordsLearned: found?.wordsLearned || 0,
    });
  }
  return result;
}

export function buildTodayTasks(state) {
  const todayMinutes = getTodayMinutes(state?.progress?.dailyActivity);
  const goal = state?.profile?.dailyGoalMinutes || 15;
  const learnedCount = state?.progress?.learnedWordIds?.length || 0;
  const completedLessons = state?.progress?.completedGrammarIds?.length || 0;

  return [
    {
      id: 'task-speak',
      title: `Speak with AI Tutor (${Math.min(todayMinutes, goal)}/${goal} mins today)`,
      href: '/tutor',
      done: todayMinutes >= goal,
      cta: 'Start Speaking',
    },
    {
      id: 'task-vocab',
      title: 'Learn or review 5 daily vocabulary words',
      href: '/vocabulary',
      done: learnedCount >= 10,
      cta: 'Open Vocabulary',
    },
    {
      id: 'task-grammar',
      title: 'Complete a Grammar Lesson & Quiz',
      href: '/grammar',
      done: completedLessons >= 2,
      cta: 'Practice Grammar',
    },
    {
      id: 'task-roleplay',
      title: 'Try 1 Real-Life Conversation Scenario',
      href: '/conversation',
      done: (state?.progress?.practiceHistory || []).some(
        (h) => h.type === 'conversation' && h.date?.slice(0, 10) === getTodayIsoDate()
      ),
      cta: 'Start Roleplay',
    },
  ];
}

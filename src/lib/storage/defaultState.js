/**
 * Default state factory for SpeakMate AI MVP.
 * Uses modular local persistence so cloud sync (e.g. Supabase) can be plugged in later.
 */

export function getLastSevenDaysActivity() {
  const days = [];
  const today = new Date();
  const sampleMinutes = [12, 18, 10, 22, 15, 25, 0];

  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const isoDate = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('en-IN', { weekday: 'short' });
    days.push({
      date: isoDate,
      label,
      minutes: sampleMinutes[6 - i],
      sessions: sampleMinutes[6 - i] > 0 ? 1 : 0,
      wordsLearned: sampleMinutes[6 - i] > 15 ? 4 : 2,
    });
  }
  return days;
}

export function createDefaultAppState() {
  return {
    version: 1,
    auth: {
      isAuthenticated: false,
      mode: 'local', // Explicitly indicates LocalStorage persistence (not cloud sync)
      email: '',
      passwordHash: '',
      lastSignedInAt: null,
    },
    profile: {
      name: 'Learner',
      explanationLanguage: 'Hindi',
      englishLevel: 'A1',
      dailyGoalMinutes: 15,
      learningPurpose: 'daily',
      onboarded: false,
      joinedAt: new Date().toISOString().slice(0, 10),
    },
    settings: {
      autoSpeakResponses: true,
      speechRate: 0.95,
      preferredVoiceLang: 'en-IN',
      showHindiHints: true,
      soundEffects: true,
    },
    progress: {
      streakDays: 3,
      lastActiveDate: new Date().toISOString().slice(0, 10),
      totalSpeakingMinutes: 102,
      totalSessions: 9,
      completedGrammarIds: ['sentence-structure'],
      quizScores: [
        {
          id: 'sample-quiz-1',
          topicId: 'sentence-structure',
          topicTitle: 'Basic English Sentence Structure',
          score: 3,
          total: 3,
          date: new Date().toISOString().slice(0, 10),
        },
      ],
      savedWordIds: ['v-101', 'v-104', 'v-105'],
      learnedWordIds: ['v-101', 'v-102', 'v-104', 'v-106', 'v-108', 'v-109'],
      activeVocabSetId: 1,
      dailyActivity: getLastSevenDaysActivity(),
      practiceHistory: [
        {
          id: 'hist-1',
          type: 'tutor',
          title: 'Daily Conversation Practice',
          durationMinutes: 12,
          summary: 'Practiced greeting and morning routine sentences.',
          date: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'hist-2',
          type: 'grammar',
          title: 'Basic English Sentence Structure',
          durationMinutes: 8,
          summary: 'Completed lesson and scored 3/3 on the quiz.',
          date: new Date(Date.now() - 172800000).toISOString(),
        },
      ],
    },
  };
}

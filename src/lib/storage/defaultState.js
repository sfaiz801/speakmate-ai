/**
 * Default state factory for SpeakMate AI.
 * Starts with zeroed real-time tracking (no pre-filled fake sample stats).
 */

export function getLastSevenDaysActivity() {
  const days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const isoDate = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('en-IN', { weekday: 'short' });
    days.push({
      date: isoDate,
      label,
      minutes: 0,
      sessions: 0,
      wordsLearned: 0,
    });
  }
  return days;
}

export function createDefaultAppState() {
  return {
    version: 2,
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
      streakDays: 0,
      lastActiveDate: null,
      totalSpeakingMinutes: 0,
      totalSessions: 0,
      completedGrammarIds: [],
      completedSyllabusIds: [],
      writingSubmissions: {},
      completedTaskIdsByDate: {},
      earnedCertificates: [],
      quizScores: [],
      savedWordIds: [],
      learnedWordIds: [],
      activeVocabSetId: 1,
      dailyActivity: getLastSevenDaysActivity(),
      practiceHistory: [],
    },
  };
}

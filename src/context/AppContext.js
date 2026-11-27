'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createDefaultAppState } from '@/lib/storage/defaultState';
import { storageAdapter, simpleLocalHash } from '@/lib/storage/storageAdapter';
import {
  computeUpdatedStreak,
  getTodayIsoDate,
  upsertTodayActivity,
} from '@/lib/storage/progressHelpers';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState(() => createDefaultAppState());
  const [isHydrated, setIsHydrated] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const loaded = storageAdapter.loadState();
    setState(loaded);
    setIsHydrated(true);
  }, []);

  const persist = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      storageAdapter.saveState(next);
      return next;
    });
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast) => {
      const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, variant: 'primary', ...toast }]);
      setTimeout(() => {
        dismissToast(id);
      }, 4200);
    },
    [dismissToast]
  );

  const updateProfile = useCallback(
    (updates) => {
      persist((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          ...updates,
        },
      }));
    },
    [persist]
  );

  const updateSettings = useCallback(
    (updates) => {
      persist((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          ...updates,
        },
      }));
    },
    [persist]
  );

  const logPracticeSession = useCallback(
    ({ type = 'tutor', title, durationMinutes = 5, summary = '', wordsLearned = 0 }) => {
      const today = getTodayIsoDate();
      persist((prev) => {
        const nextStreak = computeUpdatedStreak(
          prev.progress.lastActiveDate,
          prev.progress.streakDays,
          today
        );
        const mins = Math.max(1, Math.round(durationMinutes));
        const newEntry = {
          id: `hist-${Date.now()}`,
          type,
          title: title || 'Speaking Practice',
          durationMinutes: mins,
          summary,
          date: new Date().toISOString(),
        };

        return {
          ...prev,
          progress: {
            ...prev.progress,
            streakDays: nextStreak,
            lastActiveDate: today,
            totalSpeakingMinutes: (prev.progress.totalSpeakingMinutes || 0) + mins,
            totalSessions: (prev.progress.totalSessions || 0) + 1,
            dailyActivity: upsertTodayActivity(prev.progress.dailyActivity, {
              minutes: mins,
              sessions: 1,
              wordsLearned,
            }),
            practiceHistory: [newEntry, ...(prev.progress.practiceHistory || [])].slice(0, 40),
          },
        };
      });
    },
    [persist]
  );

  const completeGrammarLesson = useCallback(
    (lessonId, topicTitle, score, total) => {
      const today = getTodayIsoDate();
      persist((prev) => {
        const completed = new Set(prev.progress.completedGrammarIds || []);
        completed.add(lessonId);

        const nextStreak = computeUpdatedStreak(
          prev.progress.lastActiveDate,
          prev.progress.streakDays,
          today
        );

        const quizEntry = {
          id: `quiz-${Date.now()}`,
          topicId: lessonId,
          topicTitle,
          score,
          total,
          date: today,
        };

        const histEntry = {
          id: `hist-${Date.now()}`,
          type: 'grammar',
          title: topicTitle,
          durationMinutes: 6,
          summary: `Completed grammar quiz with score ${score}/${total}.`,
          date: new Date().toISOString(),
        };

        return {
          ...prev,
          progress: {
            ...prev.progress,
            streakDays: nextStreak,
            lastActiveDate: today,
            completedGrammarIds: Array.from(completed),
            quizScores: [quizEntry, ...(prev.progress.quizScores || [])].slice(0, 30),
            dailyActivity: upsertTodayActivity(prev.progress.dailyActivity, {
              minutes: 6,
              sessions: 1,
            }),
            practiceHistory: [histEntry, ...(prev.progress.practiceHistory || [])].slice(0, 40),
          },
        };
      });
    },
    [persist]
  );

  const toggleSaveWord = useCallback(
    (wordId) => {
      persist((prev) => {
        const list = prev.progress.savedWordIds || [];
        const exists = list.includes(wordId);
        const nextSaved = exists ? list.filter((id) => id !== wordId) : [...list, wordId];
        return {
          ...prev,
          progress: {
            ...prev.progress,
            savedWordIds: nextSaved,
          },
        };
      });
    },
    [persist]
  );

  const toggleLearnedWord = useCallback(
    (wordId) => {
      const today = getTodayIsoDate();
      persist((prev) => {
        const list = prev.progress.learnedWordIds || [];
        const exists = list.includes(wordId);
        const nextLearned = exists ? list.filter((id) => id !== wordId) : [...list, wordId];
        return {
          ...prev,
          progress: {
            ...prev.progress,
            streakDays: computeUpdatedStreak(
              prev.progress.lastActiveDate,
              prev.progress.streakDays,
              today
            ),
            lastActiveDate: today,
            learnedWordIds: nextLearned,
            dailyActivity: exists
              ? prev.progress.dailyActivity
              : upsertTodayActivity(prev.progress.dailyActivity, { wordsLearned: 1, minutes: 1 }),
          },
        };
      });
    },
    [persist]
  );

  const setActiveVocabSetId = useCallback(
    (setId) => {
      persist((prev) => ({
        ...prev,
        progress: {
          ...prev.progress,
          activeVocabSetId: setId,
        },
      }));
    },
    [persist]
  );

  const signupLocal = useCallback(
    ({ name, email, password }) => {
      const normalizedEmail = String(email || '').trim().toLowerCase();
      const accounts = storageAdapter.loadLocalAccounts();
      if (accounts.some((acc) => acc.email === normalizedEmail)) {
        return { ok: false, error: 'An account with this email already exists on this browser.' };
      }
      const newAccount = {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash: simpleLocalHash(password),
        createdAt: new Date().toISOString(),
      };
      storageAdapter.saveLocalAccounts([...accounts, newAccount]);
      persist((prev) => ({
        ...prev,
        auth: {
          isAuthenticated: true,
          mode: 'local',
          email: normalizedEmail,
          passwordHash: newAccount.passwordHash,
          lastSignedInAt: new Date().toISOString(),
        },
        profile: {
          ...prev.profile,
          name: name.trim(),
        },
      }));
      return { ok: true };
    },
    [persist]
  );

  const loginLocal = useCallback(
    ({ email, password }) => {
      const normalizedEmail = String(email || '').trim().toLowerCase();
      const accounts = storageAdapter.loadLocalAccounts();
      const found = accounts.find((acc) => acc.email === normalizedEmail);
      if (!found) {
        return { ok: false, error: 'No local account found for this email on this browser. Please sign up first.' };
      }
      if (found.passwordHash !== simpleLocalHash(password)) {
        return { ok: false, error: 'Incorrect password. Please try again or reset it.' };
      }
      persist((prev) => ({
        ...prev,
        auth: {
          isAuthenticated: true,
          mode: 'local',
          email: found.email,
          passwordHash: found.passwordHash,
          lastSignedInAt: new Date().toISOString(),
        },
        profile: {
          ...prev.profile,
          name: prev.profile.name && prev.profile.name !== 'Learner' ? prev.profile.name : found.name,
        },
      }));
      return { ok: true };
    },
    [persist]
  );

  const resetLocalPassword = useCallback(({ email, newPassword }) => {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const accounts = storageAdapter.loadLocalAccounts();
    const idx = accounts.findIndex((acc) => acc.email === normalizedEmail);
    if (idx < 0) {
      return { ok: false, error: 'Email not found in local browser accounts.' };
    }
    const updated = [...accounts];
    updated[idx] = {
      ...updated[idx],
      passwordHash: simpleLocalHash(newPassword),
    };
    storageAdapter.saveLocalAccounts(updated);
    return { ok: true };
  }, []);

  const logoutLocal = useCallback(() => {
    persist((prev) => ({
      ...prev,
      auth: {
        ...prev.auth,
        isAuthenticated: false,
      },
    }));
  }, [persist]);

  const resetAllData = useCallback(() => {
    const fresh = storageAdapter.resetState();
    setState(fresh);
    addToast({ title: 'Progress Reset', message: 'Local progress has been reset to defaults.', variant: 'info' });
  }, [addToast]);

  const completeSyllabusModule = useCallback(
    (moduleId, title) => {
      const today = getTodayIsoDate();
      persist((prev) => {
        const set = new Set(prev.progress.completedSyllabusIds || []);
        const alreadyDone = set.has(moduleId);
        set.add(moduleId);
        return {
          ...prev,
          progress: {
            ...prev.progress,
            streakDays: computeUpdatedStreak(
              prev.progress.lastActiveDate,
              prev.progress.streakDays,
              today
            ),
            lastActiveDate: today,
            completedSyllabusIds: Array.from(set),
            dailyActivity: alreadyDone
              ? prev.progress.dailyActivity
              : upsertTodayActivity(prev.progress.dailyActivity, { minutes: 8, sessions: 1 }),
            practiceHistory: alreadyDone
              ? prev.progress.practiceHistory
              : [
                  {
                    id: `syl-${Date.now()}`,
                    type: 'syllabus',
                    title: `Syllabus: ${title}`,
                    durationMinutes: 8,
                    summary: 'Completed speaking & writing module.',
                    date: new Date().toISOString(),
                  },
                  ...(prev.progress.practiceHistory || []),
                ].slice(0, 40),
          },
        };
      });
    },
    [persist]
  );

  const saveWritingSubmission = useCallback(
    (moduleId, text) => {
      persist((prev) => ({
        ...prev,
        progress: {
          ...prev.progress,
          writingSubmissions: {
            ...(prev.progress.writingSubmissions || {}),
            [moduleId]: {
              text,
              updatedAt: new Date().toISOString(),
            },
          },
        },
      }));
    },
    [persist]
  );

  const toggleDailyTaskCheck = useCallback(
    (taskId) => {
      const today = getTodayIsoDate();
      persist((prev) => {
        const byDate = prev.progress.completedTaskIdsByDate || {};
        const todayList = byDate[today] || [];
        const exists = todayList.includes(taskId);
        const nextToday = exists
          ? todayList.filter((id) => id !== taskId)
          : [...todayList, taskId];
        return {
          ...prev,
          progress: {
            ...prev.progress,
            completedTaskIdsByDate: {
              ...byDate,
              [today]: nextToday,
            },
          },
        };
      });
    },
    [persist]
  );

  const earnCertificate = useCallback(
    (certPayload) => {
      persist((prev) => {
        const existing = prev.progress.earnedCertificates || [];
        if (existing.some((c) => c.id === certPayload.id)) {
          return prev;
        }
        return {
          ...prev,
          progress: {
            ...prev.progress,
            earnedCertificates: [
              ...existing,
              {
                ...certPayload,
                issuedAt: new Date().toISOString().slice(0, 10),
              },
            ],
          },
        };
      });
    },
    [persist]
  );

  return (
    <AppContext.Provider
      value={{
        state,
        isHydrated,
        toasts,
        addToast,
        dismissToast,
        updateProfile,
        updateSettings,
        logPracticeSession,
        completeGrammarLesson,
        toggleSaveWord,
        toggleLearnedWord,
        setActiveVocabSetId,
        signupLocal,
        loginLocal,
        resetLocalPassword,
        logoutLocal,
        resetAllData,
        completeSyllabusModule,
        saveWritingSubmission,
        toggleDailyTaskCheck,
        earnCertificate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
}

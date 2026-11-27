'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Save, Download, UserCheck, Info } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { useApp } from '@/context/AppContext';
import {
  ENGLISH_LEVELS,
  EXPLANATION_LANGUAGES,
  DAILY_GOALS,
  LEARNING_PURPOSES,
} from '@/data/levels';

export default function ProfilePage() {
  const { state, isHydrated, updateProfile, addToast } = useApp();

  const [name, setName] = useState('');
  const [explanationLanguage, setExplanationLanguage] = useState('Hindi');
  const [englishLevel, setEnglishLevel] = useState('A1');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(15);
  const [learningPurpose, setLearningPurpose] = useState('daily');

  useEffect(() => {
    if (isHydrated && state?.profile) {
      setName(state.profile.name || '');
      setExplanationLanguage(state.profile.explanationLanguage || 'Hindi');
      setEnglishLevel(state.profile.englishLevel || 'A1');
      setDailyGoalMinutes(state.profile.dailyGoalMinutes || 15);
      setLearningPurpose(state.profile.learningPurpose || 'daily');
    }
  }, [isHydrated, state?.profile]);

  const handleSave = (e) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      addToast({ title: 'Invalid Name', message: 'Please enter at least 2 characters.', variant: 'danger' });
      return;
    }
    updateProfile({
      name: name.trim(),
      explanationLanguage,
      englishLevel,
      dailyGoalMinutes: Number(dailyGoalMinutes),
      learningPurpose,
      onboarded: true,
    });
    addToast({ title: 'Profile Updated', message: 'Your learning preferences were saved.', variant: 'success' });
  };

  const handleExportBackup = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `speakmate-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell
      title="User Profile"
      subtitle="Update your English level, explanation language, and daily goal anytime."
      actions={
        <button
          type="button"
          onClick={handleExportBackup}
          className="btn btn-outline-primary d-inline-flex align-items-center gap-2"
        >
          <Download size={16} />
          Export Progress JSON
        </button>
      }
    >
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="sm-card p-4">
            <form onSubmit={handleSave} className="d-flex flex-column gap-3">
              <div>
                <label htmlFor="profileName" className="form-label fw-semibold small">
                  Display Name
                </label>
                <input
                  id="profileName"
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label htmlFor="profileLevel" className="form-label fw-semibold small">
                    Current English Level
                  </label>
                  <select
                    id="profileLevel"
                    className="form-select"
                    value={englishLevel}
                    onChange={(e) => setEnglishLevel(e.target.value)}
                  >
                    {ENGLISH_LEVELS.map((lvl) => (
                      <option key={lvl.id} value={lvl.id}>
                        {lvl.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="profileLang" className="form-label fw-semibold small">
                    Preferred Explanation Language
                  </label>
                  <select
                    id="profileLang"
                    className="form-select"
                    value={explanationLanguage}
                    onChange={(e) => setExplanationLanguage(e.target.value)}
                  >
                    {EXPLANATION_LANGUAGES.map((lang) => (
                      <option key={lang.id} value={lang.id}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label htmlFor="profileGoal" className="form-label fw-semibold small">
                    Daily Learning Goal
                  </label>
                  <select
                    id="profileGoal"
                    className="form-select"
                    value={dailyGoalMinutes}
                    onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
                  >
                    {DAILY_GOALS.map((g) => (
                      <option key={g.minutes} value={g.minutes}>
                        {g.label} ({g.badge})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="profilePurpose" className="form-label fw-semibold small">
                    Learning Purpose
                  </label>
                  <select
                    id="profilePurpose"
                    className="form-select"
                    value={learningPurpose}
                    onChange={(e) => setLearningPurpose(e.target.value)}
                  >
                    {LEARNING_PURPOSES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" className="btn sm-gradient-btn px-4 d-inline-flex align-items-center gap-2">
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="sm-card p-4 mb-3">
            <h2 className="h6 fw-bold mb-2 d-flex align-items-center gap-2">
              <UserCheck size={18} className="text-primary" />
              Account Status
            </h2>
            {state?.auth?.isAuthenticated ? (
              <div className="small text-dark">
                Signed in locally as <strong>{state.auth.email}</strong>
              </div>
            ) : (
              <div className="small text-muted">
                Using Guest Learner mode.{' '}
                <Link href="/signup" className="text-primary fw-semibold">
                  Create a local account
                </Link>{' '}
                or{' '}
                <Link href="/login" className="text-primary fw-semibold">
                  Log in
                </Link>
                .
              </div>
            )}
          </div>

          <div className="alert alert-info small d-flex align-items-start gap-2 rounded-4">
            <Info size={17} className="flex-shrink-0 mt-1" />
            <span>
              Storage Mode: <strong>Browser LocalStorage</strong>. Progress stays on this device
              and browser unless exported. Cloud synchronization is not enabled in this free MVP.
            </span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

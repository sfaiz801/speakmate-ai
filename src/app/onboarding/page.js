'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import PublicNavbar from '@/components/layout/PublicNavbar';
import { useApp } from '@/context/AppContext';
import {
  ENGLISH_LEVELS,
  EXPLANATION_LANGUAGES,
  DAILY_GOALS,
  LEARNING_PURPOSES,
} from '@/data/levels';

export default function OnboardingPage() {
  const router = useRouter();
  const { state, isHydrated, updateProfile, addToast } = useApp();

  const [name, setName] = useState('');
  const [explanationLanguage, setExplanationLanguage] = useState('Hindi');
  const [englishLevel, setEnglishLevel] = useState('A1');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(15);
  const [learningPurpose, setLearningPurpose] = useState('daily');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isHydrated && state?.profile) {
      setName(state.profile.name === 'Learner' ? '' : state.profile.name || '');
      setExplanationLanguage(state.profile.explanationLanguage || 'Hindi');
      setEnglishLevel(state.profile.englishLevel || 'A1');
      setDailyGoalMinutes(state.profile.dailyGoalMinutes || 15);
      setLearningPurpose(state.profile.learningPurpose || 'daily');
    }
  }, [isHydrated, state?.profile]);

  const handleSave = (e) => {
    e.preventDefault();
    setError('');
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError('Please tell us your name (at least 2 characters) so your AI tutor can greet you.');
      return;
    }

    updateProfile({
      name: trimmed,
      explanationLanguage,
      englishLevel,
      dailyGoalMinutes,
      learningPurpose,
      onboarded: true,
    });

    addToast({
      title: 'Learning Plan Ready!',
      message: `Welcome ${trimmed}! Your AI tutor is tuned to ${englishLevel} with ${explanationLanguage} explanations.`,
      variant: 'success',
    });
    router.push('/dashboard');
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <PublicNavbar />
      <main className="container py-4 py-md-5 flex-grow-1" style={{ maxWidth: 820 }}>
        <div className="sm-card p-4 p-md-5">
          <div className="text-center mb-4">
            <span className="badge sm-badge-soft-primary rounded-pill px-3 py-2 mb-2 d-inline-flex align-items-center gap-1">
              <Sparkles size={14} />
              Personalize Your AI Tutor
            </span>
            <h1 className="h3 fw-bold mb-1">Let&apos;s Set Up Your Learning Profile</h1>
            <p className="text-muted small mb-0">
              You can update any of these preferences later in Profile or Settings.
            </p>
          </div>

          {error && <div className="alert alert-danger small">{error}</div>}

          <form onSubmit={handleSave} className="d-flex flex-column gap-4" noValidate>
            {/* 1. Name */}
            <div>
              <label htmlFor="onboardName" className="form-label fw-bold">
                1. What should your AI tutor call you?
              </label>
              <input
                id="onboardName"
                type="text"
                className="form-control form-control-lg"
                placeholder="Enter your first name (e.g., Priya, Rahul)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* 2. Explanation Language */}
            <div>
              <div className="form-label fw-bold mb-2">
                2. Preferred explanation language for grammar &amp; tips
              </div>
              <div className="row g-2">
                {EXPLANATION_LANGUAGES.map((lang) => {
                  const selected = explanationLanguage === lang.id;
                  return (
                    <div key={lang.id} className="col-12 col-md-4">
                      <button
                        type="button"
                        onClick={() => setExplanationLanguage(lang.id)}
                        className={`btn w-100 text-start p-3 h-100 border ${
                          selected ? 'border-primary bg-primary bg-opacity-10' : 'bg-white'
                        }`}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="fw-bold small text-dark">{lang.label}</span>
                          {selected && <CheckCircle2 size={16} className="text-primary" />}
                        </div>
                        <div className="small text-muted">{lang.description}</div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. English Level */}
            <div>
              <div className="form-label fw-bold mb-2">3. Your current English speaking level</div>
              <div className="row g-2">
                {ENGLISH_LEVELS.map((lvl) => {
                  const selected = englishLevel === lvl.id;
                  return (
                    <div key={lvl.id} className="col-12 col-md-6">
                      <button
                        type="button"
                        onClick={() => setEnglishLevel(lvl.id)}
                        className={`btn w-100 text-start p-3 h-100 border ${
                          selected ? 'border-primary bg-primary bg-opacity-10' : 'bg-white'
                        }`}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="fw-bold text-dark">{lvl.name}</span>
                          {selected && <CheckCircle2 size={17} className="text-primary" />}
                        </div>
                        <div className="small text-muted">{lvl.description}</div>
                        <div className="small text-primary mt-1">{lvl.hindiDesc}</div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Daily Goal */}
            <div>
              <div className="form-label fw-bold mb-2">4. Daily learning goal</div>
              <div className="row g-2">
                {DAILY_GOALS.map((goal) => {
                  const selected = dailyGoalMinutes === goal.minutes;
                  return (
                    <div key={goal.minutes} className="col-6 col-md-3">
                      <button
                        type="button"
                        onClick={() => setDailyGoalMinutes(goal.minutes)}
                        className={`btn w-100 text-start p-3 h-100 border ${
                          selected ? 'border-primary bg-primary bg-opacity-10' : 'bg-white'
                        }`}
                      >
                        <div className="badge sm-badge-soft-primary rounded-pill mb-2">
                          {goal.badge}
                        </div>
                        <div className="fw-bold text-dark">{goal.label}</div>
                        <div className="small text-muted">{goal.description}</div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. Learning Purpose */}
            <div>
              <div className="form-label fw-bold mb-2">5. Main purpose for learning English</div>
              <div className="row g-2">
                {LEARNING_PURPOSES.map((purpose) => {
                  const selected = learningPurpose === purpose.id;
                  return (
                    <div key={purpose.id} className="col-12 col-md-6">
                      <button
                        type="button"
                        onClick={() => setLearningPurpose(purpose.id)}
                        className={`btn w-100 text-start p-3 h-100 border ${
                          selected ? 'border-primary bg-primary bg-opacity-10' : 'bg-white'
                        }`}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold text-dark">{purpose.label}</span>
                          {selected && <CheckCircle2 size={16} className="text-primary" />}
                        </div>
                        <div className="small text-muted mt-1">{purpose.desc}</div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 d-flex justify-content-end">
              <button
                type="submit"
                className="btn sm-gradient-btn btn-lg px-4 d-inline-flex align-items-center gap-2"
              >
                Save &amp; Go to Dashboard
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

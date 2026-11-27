'use client';

import React, { useState } from 'react';
import { Volume2, Trash2, CheckCircle2 } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { useApp } from '@/context/AppContext';
import { speakText } from '@/lib/speech/webSpeech';

export default function SettingsPage() {
  const { state, updateSettings, resetAllData, addToast } = useApp();
  const [confirmReset, setConfirmReset] = useState(false);

  const settings = state?.settings || {};

  const handleTestVoice = () => {
    const ok = speakText(
      'Hello! I am SpeakMate AI, your personal English speaking tutor. Let us practice together!',
      {
        lang: settings.preferredVoiceLang || 'en-IN',
        rate: settings.speechRate || 0.95,
      }
    );
    if (!ok) {
      addToast({
        title: 'Speech Synthesis Unavailable',
        message: 'Your browser does not support text-to-speech playback.',
        variant: 'danger',
      });
    }
  };

  return (
    <AppShell
      title="Settings"
      subtitle="Customize voice playback speed, Hindi hint preferences, and local data."
    >
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="sm-card p-4 mb-4">
            <h2 className="h5 fw-bold mb-3">Voice &amp; Audio Preferences</h2>

            <div className="form-check form-switch mb-3">
              <input
                id="autoSpeakSwitch"
                type="checkbox"
                className="form-check-input"
                checked={Boolean(settings.autoSpeakResponses)}
                onChange={(e) => updateSettings({ autoSpeakResponses: e.target.checked })}
              />
              <label htmlFor="autoSpeakSwitch" className="form-check-label fw-semibold">
                Automatically read AI Tutor responses aloud
              </label>
            </div>

            <div className="form-check form-switch mb-4">
              <input
                id="hindiHintsSwitch"
                type="checkbox"
                className="form-check-input"
                checked={Boolean(settings.showHindiHints)}
                onChange={(e) => updateSettings({ showHindiHints: e.target.checked })}
              />
              <label htmlFor="hindiHintsSwitch" className="form-check-label fw-semibold">
                Show Hindi translations &amp; hints across lessons
              </label>
            </div>

            <div className="mb-3">
              <label htmlFor="voiceLangSelect" className="form-label fw-semibold small">
                Preferred Tutor Voice Accent
              </label>
              <select
                id="voiceLangSelect"
                className="form-select"
                value={settings.preferredVoiceLang || 'en-IN'}
                onChange={(e) => updateSettings({ preferredVoiceLang: e.target.value })}
              >
                <option value="en-IN">Indian English (en-IN)</option>
                <option value="en-GB">British English (en-GB)</option>
                <option value="en-US">American English (en-US)</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="speechRateRange" className="form-label fw-semibold small">
                Speaking Speed: <strong>{Number(settings.speechRate || 0.95).toFixed(2)}x</strong>
              </label>
              <input
                id="speechRateRange"
                type="range"
                className="form-range"
                min="0.7"
                max="1.25"
                step="0.05"
                value={settings.speechRate || 0.95}
                onChange={(e) => updateSettings({ speechRate: Number(e.target.value) })}
              />
              <div className="d-flex justify-content-between small text-muted">
                <span>Slower (0.70x - Beginner friendly)</span>
                <span>Normal (0.95x)</span>
                <span>Faster (1.25x)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleTestVoice}
              className="btn btn-outline-primary d-inline-flex align-items-center gap-2"
            >
              <Volume2 size={16} />
              Test Voice Playback
            </button>
          </div>

          {/* Data & Reset */}
          <div className="sm-card p-4 border-danger border-opacity-25">
            <h2 className="h5 fw-bold text-danger mb-2">Local Data Management</h2>
            <p className="small text-muted mb-3">
              Resetting clears your locally saved streak, completed grammar lessons, saved words, and
              profile preferences on this browser.
            </p>

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="btn btn-outline-danger d-inline-flex align-items-center gap-2"
              >
                <Trash2 size={16} />
                Reset Local Progress
              </button>
            ) : (
              <div className="d-flex flex-wrap align-items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    resetAllData();
                    setConfirmReset(false);
                  }}
                  className="btn btn-danger"
                >
                  Confirm Reset Everything
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="btn btn-outline-secondary"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="sm-card p-4">
            <h2 className="h6 fw-bold mb-2 d-flex align-items-center gap-2">
              <CheckCircle2 size={17} className="text-success" />
              Free-Tier Friendly Architecture
            </h2>
            <ul className="small text-muted ps-3 mb-0 d-flex flex-column gap-2">
              <li>AI requests run securely through Next.js API routes.</li>
              <li>Voice input uses browser Web Speech API (no paid STT charges).</li>
              <li>Audio playback uses browser SpeechSynthesis API.</li>
              <li>Progress persists in modular LocalStorage ready for future Supabase sync.</li>
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

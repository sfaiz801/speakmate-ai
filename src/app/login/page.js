'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, KeyRound, Info } from 'lucide-react';
import PublicNavbar from '@/components/layout/PublicNavbar';
import { useApp } from '@/context/AppContext';

export default function LoginPage() {
  const router = useRouter();
  const { loginLocal, resetLocalPassword, addToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetMsg, setResetMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter both your email and password.');
      return;
    }

    const res = loginLocal({ email, password });
    if (!res.ok) {
      setError(res.error);
      return;
    }

    addToast({ title: 'Welcome back!', message: 'Signed in to your local SpeakMate profile.', variant: 'success' });
    router.push('/dashboard');
  };

  const handleReset = (e) => {
    e.preventDefault();
    setResetMsg('');
    if (!resetEmail.trim() || newPassword.length < 6) {
      setResetMsg('Enter a valid email and a new password of at least 6 characters.');
      return;
    }
    const res = resetLocalPassword({ email: resetEmail, newPassword });
    if (!res.ok) {
      setResetMsg(res.error);
      return;
    }
    addToast({ title: 'Password Updated', message: 'You can now log in with your new password.', variant: 'success' });
    setShowReset(false);
    setEmail(resetEmail);
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <PublicNavbar />
      <main className="container py-5 flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="sm-card p-4 p-md-5 w-100" style={{ maxWidth: 460 }}>
          <div className="text-center mb-4">
            <h1 className="h3 fw-bold mb-1">Welcome Back</h1>
            <p className="text-muted small mb-0">Log in to continue your English speaking streak.</p>
          </div>

          <div className="alert alert-info small d-flex align-items-start gap-2 mb-4" role="note">
            <Info size={17} className="flex-shrink-0 mt-1" />
            <span>
              MVP Mode: Accounts and learning progress are stored locally in this browser
              (LocalStorage). Cloud sync is not enabled yet.
            </span>
          </div>

          {error && <div className="alert alert-danger small">{error}</div>}

          {!showReset ? (
            <form onSubmit={handleLogin} noValidate>
              <div className="mb-3">
                <label htmlFor="loginEmail" className="form-label fw-semibold small">
                  Email Address
                </label>
                <input
                  id="loginEmail"
                  type="email"
                  className="form-control"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <label htmlFor="loginPassword" className="form-label fw-semibold small mb-1">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowReset(true)}
                    className="btn btn-link btn-sm p-0 text-decoration-none"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  id="loginPassword"
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn sm-gradient-btn w-100 py-2 mb-3">
                <LogIn size={17} className="me-2" />
                Log In
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} noValidate>
              <h2 className="h6 fw-bold mb-3 d-flex align-items-center gap-2">
                <KeyRound size={16} />
                Reset Local Account Password
              </h2>
              {resetMsg && <div className="alert alert-warning small">{resetMsg}</div>}
              <div className="mb-3">
                <label htmlFor="resetEmail" className="form-label fw-semibold small">
                  Registered Email
                </label>
                <input
                  id="resetEmail"
                  type="email"
                  className="form-control"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label fw-semibold small">
                  New Password (min 6 chars)
                </label>
                <input
                  id="newPassword"
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="d-flex gap-2 mb-3">
                <button type="submit" className="btn sm-gradient-btn flex-fill">
                  Update Password
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowReset(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="text-center small text-muted pt-2 border-top">
            New to SpeakMate AI?{' '}
            <Link href="/signup" className="fw-semibold text-primary">
              Create Free Account
            </Link>
            <div className="mt-2">
              <Link href="/onboarding" className="text-muted text-decoration-underline">
                Or continue directly as Guest Learner
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

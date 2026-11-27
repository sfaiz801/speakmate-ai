'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, Info } from 'lucide-react';
import PublicNavbar from '@/components/layout/PublicNavbar';
import { useApp } from '@/context/AppContext';

export default function SignupPage() {
  const router = useRouter();
  const { signupLocal, addToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (name.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const res = signupLocal({ name, email, password });
    if (!res.ok) {
      setError(res.error);
      return;
    }

    addToast({
      title: 'Account Created',
      message: 'Let us personalize your English learning plan!',
      variant: 'success',
    });
    router.push('/onboarding');
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <PublicNavbar />
      <main className="container py-5 flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="sm-card p-4 p-md-5 w-100" style={{ maxWidth: 460 }}>
          <div className="text-center mb-4">
            <h1 className="h3 fw-bold mb-1">Create Your Free Account</h1>
            <p className="text-muted small mb-0">Start speaking English confidently today.</p>
          </div>

          <div className="alert alert-info small d-flex align-items-start gap-2 mb-4" role="note">
            <Info size={17} className="flex-shrink-0 mt-1" />
            <span>
              Your account is saved locally in your browser via LocalStorage so you can start right
              away without needing paid cloud infrastructure.
            </span>
          </div>

          {error && <div className="alert alert-danger small">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="signupName" className="form-label fw-semibold small">
                Your Name
              </label>
              <input
                id="signupName"
                type="text"
                className="form-control"
                placeholder="e.g., Aarav Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="signupEmail" className="form-label fw-semibold small">
                Email Address
              </label>
              <input
                id="signupEmail"
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="signupPassword" className="form-label fw-semibold small">
                Password (min 6 characters)
              </label>
              <input
                id="signupPassword"
                type="password"
                className="form-control"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn sm-gradient-btn w-100 py-2 mb-3">
              <UserPlus size={17} className="me-2" />
              Sign Up &amp; Personalize
            </button>
          </form>

          <div className="text-center small text-muted pt-2 border-top">
            Already have an account?{' '}
            <Link href="/login" className="fw-semibold text-primary">
              Log In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

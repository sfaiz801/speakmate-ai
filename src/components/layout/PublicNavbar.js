'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';
import BrandLogo from './BrandLogo';
import styles from './PublicNavbar.module.scss';

export default function PublicNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.navbar}>
      <div className="container py-2 py-md-3">
        <div className="d-flex align-items-center justify-content-between gap-3">
          <BrandLogo href="/" />

          <nav className="d-none d-lg-flex align-items-center gap-1" aria-label="Primary navigation">
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#how-it-works" className={styles.navLink}>How It Works</a>
            <a href="#levels" className={styles.navLink}>Levels</a>
            <a href="#faq" className={styles.navLink}>FAQ</a>
            <Link href="/tutor" className={styles.navLink}>Try AI Tutor</Link>
          </nav>

          <div className="d-none d-lg-flex align-items-center gap-2">
            <Link href="/login" className="btn btn-outline-secondary border-0 fw-semibold">
              Log In
            </Link>
            <Link href="/onboarding" className="btn sm-gradient-btn px-3 d-inline-flex align-items-center gap-1">
              Start Learning Free
              <ArrowRight size={16} />
            </Link>
          </div>

          <button
            type="button"
            className="btn btn-light d-lg-none border"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div className="d-lg-none pt-3 pb-2 border-top mt-3 d-flex flex-column gap-2">
            <a href="#features" className={styles.navLink} onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className={styles.navLink} onClick={() => setMenuOpen(false)}>How It Works</a>
            <a href="#levels" className={styles.navLink} onClick={() => setMenuOpen(false)}>Levels</a>
            <a href="#faq" className={styles.navLink} onClick={() => setMenuOpen(false)}>FAQ</a>
            <Link href="/tutor" className={styles.navLink} onClick={() => setMenuOpen(false)}>Try AI Tutor</Link>
            <div className="d-flex gap-2 pt-2">
              <Link href="/login" className="btn btn-outline-primary flex-fill" onClick={() => setMenuOpen(false)}>
                Log In
              </Link>
              <Link href="/onboarding" className="btn sm-gradient-btn flex-fill" onClick={() => setMenuOpen(false)}>
                Start Free
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

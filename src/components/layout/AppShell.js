'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Mic,
  BookOpen,
  GraduationCap,
  MessagesSquare,
  Briefcase,
  TrendingUp,
  User,
  Settings,
  Flame,
  Menu,
  X,
  LogOut,
  Map,
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import { useApp } from '@/context/AppContext';
import styles from './AppShell.module.scss';

const NAV_SECTIONS = [
  {
    label: 'Learn',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/syllabus', label: 'Syllabus & Certs', icon: Map },
      { href: '/tutor', label: 'AI Speaking Tutor', icon: Mic },
      { href: '/vocabulary', label: 'Daily Vocabulary', icon: BookOpen },
      { href: '/grammar', label: 'Grammar Lessons', icon: GraduationCap },
    ],
  },
  {
    label: 'Practice',
    items: [
      { href: '/conversation', label: 'Conversation Practice', icon: MessagesSquare },
      { href: '/interview', label: 'Interview Practice', icon: Briefcase },
      { href: '/progress', label: 'Progress Tracking', icon: TrendingUp },
    ],
  },
  {
    label: 'Account',
    items: [
      { href: '/profile', label: 'User Profile', icon: User },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

const MOBILE_BOTTOM_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/syllabus', label: 'Syllabus', icon: Map },
  { href: '/tutor', label: 'AI Tutor', icon: Mic },
  { href: '/vocabulary', label: 'Vocab', icon: BookOpen },
  { href: '/progress', label: 'Progress', icon: TrendingUp },
];

export default function AppShell({ title, subtitle, actions, children }) {
  const pathname = usePathname();
  const { state, logoutLocal } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const streak = state?.progress?.streakDays || 0;
  const level = state?.profile?.englishLevel || 'A1';
  const name = state?.profile?.name || 'Learner';

  const renderNavLinks = (onClick) => (
    <>
      {NAV_SECTIONS.map((section) => (
        <div key={section.label} className="mb-2">
          <div className={styles.navSectionLabel}>{section.label}</div>
          {section.items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClick}
                aria-current={active ? 'page' : undefined}
                className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </>
  );

  return (
    <div className={styles.shell}>
      {/* Desktop Sidebar */}
      <aside className={`${styles.sidebar} d-none d-lg-flex`} aria-label="Sidebar navigation">
        <div className="p-3 border-bottom">
          <BrandLogo href="/dashboard" />
        </div>

        <div className={styles.navScroll}>{renderNavLinks()}</div>

        <div className="p-3 border-top bg-light">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="badge sm-badge-soft-primary rounded-pill px-2 py-1">
              Level {level}
            </span>
            <span className="badge sm-badge-soft-warning rounded-pill px-2 py-1 d-inline-flex align-items-center gap-1">
              <Flame size={13} />
              {streak}d streak
            </span>
          </div>
          <div className="d-flex align-items-center justify-content-between gap-2">
            <Link href="/profile" className="text-truncate small fw-semibold text-dark">
              {name}
            </Link>
            {state?.auth?.isAuthenticated && (
              <button
                type="button"
                onClick={logoutLocal}
                className="btn btn-sm btn-link text-muted p-0"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <>
          <div className={styles.drawerBackdrop} onClick={() => setDrawerOpen(false)} />
          <div className={`${styles.drawerPanel} d-lg-none`} role="dialog" aria-label="Mobile navigation">
            <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
              <BrandLogo href="/dashboard" compact />
              <button
                type="button"
                className="btn btn-sm btn-light border"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>
            </div>
            <div className={styles.navScroll}>{renderNavLinks(() => setDrawerOpen(false))}</div>
            <div className="p-3 border-top small text-muted">
              Signed in locally as <strong className="text-dark">{name}</strong>
            </div>
          </div>
        </>
      )}

      {/* Main Content Column */}
      <div className={styles.mainArea}>
        {/* Mobile Compact Top Header */}
        <header className={`${styles.mobileHeader} d-flex d-lg-none align-items-center justify-content-between px-3`}>
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-light border"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={19} />
            </button>
            <BrandLogo href="/dashboard" compact />
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="badge sm-badge-soft-warning rounded-pill px-2 py-1 d-inline-flex align-items-center gap-1">
              <Flame size={13} />
              {streak}
            </span>
            <Link href="/profile" className="badge sm-badge-soft-primary rounded-pill px-2 py-1">
              {level}
            </Link>
          </div>
        </header>

        <main className={styles.contentWrap}>
          <div className={styles.contentInner}>
            {(title || actions) && (
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
                <div>
                  {title && <h1 className="h3 fw-bold mb-1 text-dark">{title}</h1>}
                  {subtitle && <p className="text-muted small mb-0">{subtitle}</p>}
                </div>
                {actions && <div className="d-flex flex-wrap gap-2">{actions}</div>}
              </div>
            )}

            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className={`${styles.bottomNav} d-flex d-lg-none`} aria-label="Mobile quick navigation">
        {MOBILE_BOTTOM_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.bottomLink} ${active ? styles.bottomLinkActive : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

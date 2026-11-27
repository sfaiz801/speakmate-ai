import { createDefaultAppState } from './defaultState';

const STORAGE_KEY = 'speakmate_ai_state_v1';
const ACCOUNTS_KEY = 'speakmate_ai_local_accounts_v1';

/**
 * Simple deterministic hash for local demo accounts (NOT for production server auth).
 */
export function simpleLocalHash(value) {
  let hash = 0;
  const str = String(value || '');
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `local_${Math.abs(hash).toString(16)}`;
}

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export const storageAdapter = {
  backendName: 'localStorage',

  loadState() {
    const fallback = createDefaultAppState();
    if (!isBrowser()) return fallback;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return {
        ...fallback,
        ...parsed,
        auth: { ...fallback.auth, ...(parsed.auth || {}) },
        profile: { ...fallback.profile, ...(parsed.profile || {}) },
        settings: { ...fallback.settings, ...(parsed.settings || {}) },
        progress: { ...fallback.progress, ...(parsed.progress || {}) },
      };
    } catch {
      return fallback;
    }
  },

  saveState(state) {
    if (!isBrowser()) return false;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  },

  resetState() {
    const fresh = createDefaultAppState();
    if (isBrowser()) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    }
    return fresh;
  },

  loadLocalAccounts() {
    if (!isBrowser()) return [];
    try {
      const raw = window.localStorage.getItem(ACCOUNTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveLocalAccounts(accounts) {
    if (!isBrowser()) return false;
    try {
      window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
      return true;
    } catch {
      return false;
    }
  },
};

import React from 'react';
import styles from './StatCard.module.scss';

const TONE_STYLES = {
  indigo: { bg: '#eef2ff', color: '#4f46e5' },
  blue: { bg: '#e0f2fe', color: '#0284c7' },
  emerald: { bg: '#d1fae5', color: '#059669' },
  amber: { bg: '#fef3c7', color: '#d97706' },
  purple: { bg: '#f3e8ff', color: '#7c3aed' },
};

export default function StatCard({ icon: Icon, label, value, subtext, tone = 'indigo' }) {
  const palette = TONE_STYLES[tone] || TONE_STYLES.indigo;

  return (
    <div className={styles.statCard}>
      <div className="d-flex align-items-start justify-content-between gap-2">
        <div>
          <div className="text-muted small fw-semibold mb-1">{label}</div>
          <div className={styles.value}>{value}</div>
          {subtext && <div className="text-muted small mt-1">{subtext}</div>}
        </div>
        {Icon && (
          <div
            className={styles.iconWrap}
            style={{ backgroundColor: palette.bg, color: palette.color }}
            aria-hidden="true"
          >
            <Icon size={21} />
          </div>
        )}
      </div>
    </div>
  );
}

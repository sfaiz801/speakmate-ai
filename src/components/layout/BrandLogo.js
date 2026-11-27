import React from 'react';
import Link from 'next/link';

export default function BrandLogo({ href = '/', compact = false, dark = false }) {
  return (
    <Link href={href} className="d-inline-flex align-items-center gap-2 text-decoration-none">
      <span
        className="d-inline-flex align-items-center justify-content-center rounded-3 shadow-sm"
        style={{
          width: compact ? 34 : 38,
          height: compact ? 34 : 38,
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 65%, #38bdf8 100%)',
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3C7.03 3 3 6.58 3 11c0 2.13.94 4.06 2.47 5.5L4.5 21l4.86-1.94c.84.23 1.73.36 2.64.36 4.97 0 9-3.58 9-8s-4.03-8.42-9-8.42Z"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M9 10.5v2M12 8.5v5M15 10.5v2"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="d-flex flex-column lh-1">
        <span
          className={`fw-bold ${compact ? 'fs-6' : 'fs-5'} ${dark ? 'text-white' : 'text-dark'}`}
          style={{ letterSpacing: '-0.02em' }}
        >
          SpeakMate <span style={{ color: dark ? '#a5b4fc' : '#4f46e5' }}>AI</span>
        </span>
        {!compact && (
          <span className="text-muted" style={{ fontSize: '0.68rem', fontWeight: 500 }}>
            Personal English Coach
          </span>
        )}
      </span>
    </Link>
  );
}

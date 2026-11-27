import React from 'react';
import Link from 'next/link';

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionHref, onAction }) {
  return (
    <div className="sm-card p-4 p-md-5 text-center">
      {Icon && (
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
          style={{ width: 56, height: 56, backgroundColor: '#eef2ff', color: '#4f46e5' }}
        >
          <Icon size={26} />
        </div>
      )}
      <h3 className="h5 fw-bold mb-2">{title}</h3>
      <p className="text-muted mx-auto mb-3" style={{ maxWidth: 420 }}>
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn sm-gradient-btn">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className="btn sm-gradient-btn">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

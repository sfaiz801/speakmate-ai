'use client';

import React from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div
      className="position-fixed bottom-0 end-0 p-3 d-flex flex-column gap-2"
      style={{ zIndex: 1090, maxWidth: 360 }}
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const isDanger = toast.variant === 'danger';
        const isSuccess = toast.variant === 'success';
        const Icon = isDanger ? AlertCircle : isSuccess ? CheckCircle2 : Info;
        const borderColor = isDanger ? '#ef4444' : isSuccess ? '#10b981' : '#4f46e5';

        return (
          <div
            key={toast.id}
            className="sm-card p-3 d-flex align-items-start gap-2 shadow"
            style={{ borderLeft: `4px solid ${borderColor}` }}
            role="status"
          >
            <Icon size={18} style={{ color: borderColor, flexShrink: 0, marginTop: 2 }} />
            <div className="flex-grow-1 small">
              {toast.title && <div className="fw-bold text-dark">{toast.title}</div>}
              {toast.message && <div className="text-muted">{toast.message}</div>}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="btn btn-sm p-0 text-muted border-0"
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

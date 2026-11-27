'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || 'Something unexpected happened while rendering this view.',
    };
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' });
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5">
          <div className="sm-card p-4 p-md-5 text-center mx-auto" style={{ maxWidth: 520 }}>
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{ width: 56, height: 56, backgroundColor: '#fee2e2', color: '#dc2626' }}
            >
              <AlertTriangle size={28} />
            </div>
            <h2 className="h4 fw-bold mb-2">Something went wrong</h2>
            <p className="text-muted mb-4">{this.state.message}</p>
            <button type="button" onClick={this.handleReset} className="btn sm-gradient-btn px-4">
              <RefreshCw size={16} className="me-2" />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

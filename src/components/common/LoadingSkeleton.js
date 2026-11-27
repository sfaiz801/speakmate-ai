import React from 'react';

export function DashboardSkeleton() {
  return (
    <div className="container-fluid px-0">
      <div className="sm-skeleton mb-4" style={{ height: 112, width: '100%' }} />
      <div className="row g-3 mb-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="col-6 col-xl-3">
            <div className="sm-skeleton" style={{ height: 108 }} />
          </div>
        ))}
      </div>
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="sm-skeleton" style={{ height: 280 }} />
        </div>
        <div className="col-12 col-lg-4">
          <div className="sm-skeleton" style={{ height: 280 }} />
        </div>
      </div>
    </div>
  );
}

export function CardListSkeleton({ count = 3 }) {
  return (
    <div className="row g-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="col-12 col-md-6 col-xl-4">
          <div className="sm-skeleton" style={{ height: 150 }} />
        </div>
      ))}
    </div>
  );
}

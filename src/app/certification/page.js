'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import CertificationView from '@/components/certification/CertificationView';

export default function CertificationPage() {
  return (
    <AppShell
      title="SpeakMate AI Certification"
      subtitle="Earn Foundation (A1–A2), Conversational Fluency (B1), and Career Mastery (B2–C1) completion certificates."
    >
      <CertificationView />
    </AppShell>
  );
}

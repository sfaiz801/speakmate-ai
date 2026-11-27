'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Award,
  CheckCircle2,
  Lock,
  HelpCircle,
  Printer,
  Download,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CERTIFICATION_TIERS } from '@/data/syllabusData';
import styles from './CertificationView.module.scss';

function downloadCertificatePng({ learnerName, title, level, issuedAt, score, total }) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  const grad = ctx.createLinearGradient(0, 0, 1200, 800);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.65, '#f8fafc');
  grad.addColorStop(1, '#eef2ff');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 800);

  // Outer & Inner Borders
  ctx.strokeStyle = '#4f46e5';
  ctx.lineWidth = 14;
  ctx.strokeRect(28, 28, 1144, 744);
  ctx.strokeStyle = '#c7d2fe';
  ctx.lineWidth = 3;
  ctx.strokeRect(48, 48, 1104, 704);

  // Header Badge
  ctx.fillStyle = '#4f46e5';
  ctx.font = 'bold 26px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SPEAKMATE AI • COURSE COMPLETION CERTIFICATE', 600, 140);

  ctx.fillStyle = '#64748b';
  ctx.font = '24px system-ui, -apple-system, sans-serif';
  ctx.fillText('This certifies that', 600, 235);

  // Learner Name
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 58px system-ui, -apple-system, sans-serif';
  ctx.fillText(learnerName || 'Learner', 600, 320);

  // Divider line under name
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(320, 348);
  ctx.lineTo(880, 348);
  ctx.stroke();

  // Achievement text
  ctx.fillStyle = '#334155';
  ctx.font = '26px system-ui, -apple-system, sans-serif';
  ctx.fillText('has completed all learning milestones and passed the assessment for', 600, 415);

  ctx.fillStyle = '#4f46e5';
  ctx.font = 'bold 38px system-ui, -apple-system, sans-serif';
  ctx.fillText(title, 600, 480);

  ctx.fillStyle = '#475569';
  ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
  ctx.fillText(`CEFR Track: ${level}  •  Assessment Score: ${score}/${total}`, 600, 540);

  // Footer
  ctx.fillStyle = '#64748b';
  ctx.font = '22px system-ui, -apple-system, sans-serif';
  ctx.fillText(`Issued on ${issuedAt}  •  SpeakMate AI Personal English Coach`, 600, 680);

  const link = document.createElement('a');
  link.download = `speakmate-certificate-${level.toLowerCase()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export default function CertificationView() {
  const { state, earnCertificate, addToast } = useApp();
  const [activeExamCertId, setActiveExamCertId] = useState(null);
  const [examAnswers, setExamAnswers] = useState({});

  const metrics = {
    syllabusCount: state?.progress?.completedSyllabusIds?.length || 0,
    grammarCount: state?.progress?.completedGrammarIds?.length || 0,
    wordsCount: state?.progress?.learnedWordIds?.length || 0,
    speakingMinutes: state?.progress?.totalSpeakingMinutes || 0,
  };
  const earnedCertificates = state?.progress?.earnedCertificates || [];

  const handleSubmitCertExam = (tier) => {
    const total = tier.assessment.length;
    if (Object.keys(examAnswers).length < total) {
      addToast({
        title: 'Answer all questions',
        message: 'Please answer every assessment question before submitting.',
        variant: 'info',
      });
      return;
    }

    let score = 0;
    tier.assessment.forEach((q, idx) => {
      if (examAnswers[idx] === q.correctIndex) score += 1;
    });

    const passScore = Math.ceil(total * 0.75);
    if (score >= passScore) {
      earnCertificate({
        id: tier.id,
        title: tier.title,
        level: tier.level,
        learnerName: state?.profile?.name || 'Learner',
        score,
        total,
      });
      setActiveExamCertId(null);
      setExamAnswers({});
      addToast({
        title: 'Certificate Unlocked!',
        message: `Congratulations! You passed (${score}/${total}) and earned ${tier.title}.`,
        variant: 'success',
      });
    } else {
      addToast({
        title: `Score: ${score}/${total}`,
        message: `You need at least ${passScore}/${total} to unlock this certificate. Review the lessons and try again!`,
        variant: 'danger',
      });
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div className={`sm-card p-3 p-md-4 ${styles.noPrint}`}>
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div>
            <h2 className="h5 fw-bold mb-1">
              Your Earned Certificates: {earnedCertificates.length} / {CERTIFICATION_TIERS.length}
            </h2>
            <p className="small text-muted mb-0">
              Complete the real learning milestones below and pass the 4-question assessment (75%+)
              to unlock each printable &amp; downloadable SpeakMate AI completion certificate.
            </p>
          </div>
          <Link href="/syllabus" className="btn btn-sm btn-outline-primary flex-shrink-0">
            Open Syllabus Roadmap <ArrowRight size={14} className="ms-1" />
          </Link>
        </div>
      </div>

      {CERTIFICATION_TIERS.map((tier) => {
        const req = tier.requirements;
        const criteria = [
          {
            label: 'Syllabus Modules',
            current: metrics.syllabusCount,
            target: req.minSyllabusModules,
            unit: '',
            href: '/syllabus',
          },
          {
            label: 'Grammar Lessons',
            current: metrics.grammarCount,
            target: req.minGrammarLessons,
            unit: '',
            href: '/grammar',
          },
          {
            label: 'Words Learned',
            current: metrics.wordsCount,
            target: req.minLearnedWords,
            unit: '',
            href: '/vocabulary',
          },
          {
            label: 'Speaking Minutes',
            current: metrics.speakingMinutes,
            target: req.minSpeakingMinutes,
            unit: 'm',
            href: '/tutor',
          },
        ];

        const eligible = criteria.every((c) => c.current >= c.target);
        const earned = earnedCertificates.find((c) => c.id === tier.id);
        const examOpen = activeExamCertId === tier.id;

        return (
          <div key={tier.id} className="sm-card p-4">
            <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-3">
              <div>
                <span className="badge sm-badge-soft-primary rounded-pill mb-2">
                  Level {tier.level}
                </span>
                <h3 className="h5 fw-bold mb-1">{tier.title}</h3>
                <div className="small text-primary fw-semibold mb-1">{tier.hindiTitle}</div>
                <p className="small text-muted mb-0">{tier.description}</p>
              </div>

              {earned ? (
                <span className="badge sm-badge-soft-success rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1">
                  <CheckCircle2 size={15} /> Earned ({earned.issuedAt})
                </span>
              ) : eligible ? (
                <span className="badge sm-badge-soft-blue rounded-pill px-3 py-2">
                  Ready for Assessment
                </span>
              ) : (
                <span className="badge sm-badge-soft-warning rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1">
                  <Lock size={14} /> In Progress
                </span>
              )}
            </div>

            {/* Criteria Cards */}
            <div className={`row g-2 mb-3 small ${styles.noPrint}`}>
              {criteria.map((c) => {
                const done = c.current >= c.target;
                const pct = Math.min(100, Math.round((c.current / Math.max(1, c.target)) * 100));
                return (
                  <div key={c.label} className="col-6 col-md-3">
                    <Link
                      href={c.href}
                      className={`d-block p-2 px-3 rounded-3 border text-dark h-100 ${
                        done ? 'border-success bg-success bg-opacity-10' : 'bg-light'
                      }`}
                    >
                      <div className="fw-bold d-flex justify-content-between align-items-center">
                        <span>{c.label}</span>
                        {done && <CheckCircle2 size={14} className="text-success" />}
                      </div>
                      <div className="mb-1">
                        {c.current}
                        {c.unit} / {c.target}
                        {c.unit}
                      </div>
                      <div className="progress" style={{ height: 5 }}>
                        <div
                          className={`progress-bar ${done ? 'bg-success' : 'bg-primary'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Earned Certificate Card */}
            {earned && (
              <div className={`${styles.certificateCard} mt-3`}>
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                  <div>
                    <div className="small text-uppercase fw-bold text-primary mb-1">
                      SpeakMate AI • Course Completion Certificate
                    </div>
                    <h4 className="h4 fw-bold text-dark mb-1">
                      {earned.learnerName || state?.profile?.name || 'Learner'}
                    </h4>
                    <p className="small text-muted mb-2">
                      has completed all required milestones and passed the assessment (
                      {earned.score}/{earned.total}) for <strong>{tier.title}</strong> ({tier.level}).
                    </p>
                    <div className="small fw-semibold text-dark">
                      Issued on: {earned.issuedAt}
                    </div>
                  </div>
                  <div className="d-flex flex-column align-items-md-end gap-2">
                    <div className={styles.certificateSeal} aria-hidden="true">
                      <Award size={28} />
                    </div>
                    <div className={`d-flex flex-wrap gap-2 ${styles.noPrint}`}>
                      <button
                        type="button"
                        onClick={() =>
                          downloadCertificatePng({
                            learnerName: earned.learnerName || state?.profile?.name || 'Learner',
                            title: tier.title,
                            level: tier.level,
                            issuedAt: earned.issuedAt,
                            score: earned.score,
                            total: earned.total,
                          })
                        }
                        className="btn btn-sm sm-gradient-btn d-inline-flex align-items-center gap-1"
                      >
                        <Download size={15} />
                        Download PNG
                      </button>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                      >
                        <Printer size={15} />
                        Print / PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Assessment Quiz */}
            {!earned && (
              <div className={styles.noPrint}>
                {!examOpen ? (
                  <button
                    type="button"
                    disabled={!eligible}
                    onClick={() => {
                      setActiveExamCertId(tier.id);
                      setExamAnswers({});
                    }}
                    className={`btn btn-sm ${eligible ? 'sm-gradient-btn' : 'btn-outline-secondary'}`}
                  >
                    <HelpCircle size={15} className="me-1" />
                    {eligible
                      ? 'Take Certification Assessment'
                      : 'Complete All 4 Criteria Above to Unlock Exam'}
                  </button>
                ) : (
                  <div className="p-3 p-md-4 rounded-4 border bg-light mt-2">
                    <h4 className="h6 fw-bold mb-3">
                      {tier.title} — Assessment (Need 3/4 to Pass)
                    </h4>
                    <div className="d-flex flex-column gap-3 mb-3">
                      {tier.assessment.map((q, qIdx) => (
                        <div key={qIdx} className="p-3 rounded-3 bg-white border">
                          <div className="fw-semibold small mb-2">
                            {qIdx + 1}. {q.question}
                          </div>
                          <div className="d-flex flex-column gap-2">
                            {q.options.map((opt, optIdx) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() =>
                                  setExamAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))
                                }
                                className={`btn btn-sm text-start border ${
                                  examAnswers[qIdx] === optIdx
                                    ? 'btn-primary text-white'
                                    : 'btn-light text-dark'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleSubmitCertExam(tier)}
                        className="btn btn-sm sm-gradient-btn px-4"
                      >
                        Submit Assessment
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveExamCertId(null)}
                        className="btn btn-sm btn-outline-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

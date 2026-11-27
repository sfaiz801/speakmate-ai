'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mic,
  Sparkles,
  BookOpen,
  MessagesSquare,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  Volume2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  GraduationCap,
  Award,
} from 'lucide-react';
import PublicNavbar from '@/components/layout/PublicNavbar';
import BrandLogo from '@/components/layout/BrandLogo';
import { ENGLISH_LEVELS } from '@/data/levels';
import styles from './Landing.module.scss';

const FEATURES = [
  {
    icon: Mic,
    title: 'Voice-First AI Speaking Tutor',
    desc: 'Speak into your microphone or type anytime. Receive warm replies, voice playback, and zero-judgment corrections.',
    tone: '#eef2ff',
    color: '#4f46e5',
  },
  {
    icon: Sparkles,
    title: 'Hindi-Friendly Explanations',
    desc: 'Understand why a sentence sounds awkward with clear Hindi or Hinglish explanations alongside natural English.',
    tone: '#e0f2fe',
    color: '#0284c7',
  },
  {
    icon: MessagesSquare,
    title: 'Real-Life Roleplay Scenarios',
    desc: 'Practice ordering food, talking on the phone, shopping, college discussions, and office syncs with instant session reports.',
    tone: '#d1fae5',
    color: '#059669',
  },
  {
    icon: Briefcase,
    title: 'AI Interview Simulator',
    desc: 'Prepare for fresher, tech, support, and leadership interviews one question at a time with polished answer rewrites.',
    tone: '#fef3c7',
    color: '#d97706',
  },
  {
    icon: BookOpen,
    title: '10 Daily Vocabulary Words',
    desc: 'Learn practical words with Hindi meanings, pronunciation guides, audio playback, saved word lists, and revision quizzes.',
    tone: '#f3e8ff',
    color: '#7c3aed',
  },
  {
    icon: TrendingUp,
    title: '11 Grammar Modules & Progress',
    desc: 'Master sentence structure, tenses, modals, and common Hindi-to-English mistakes with quizzes and streak charts.',
    tone: '#ffe4e6',
    color: '#e11d48',
  },
];

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Set Your Level & Goal',
    desc: 'Pick your current English level (A1–C1), preferred explanation language (Hindi, Hinglish, or English), and daily target.',
  },
  {
    step: '2',
    title: 'Speak or Type Naturally',
    desc: 'Choose a speaking mode—Daily Conversation, Office, Travel, or Interview—and answer one simple question at a time.',
  },
  {
    step: '3',
    title: 'Get Polite Corrections & Fluency',
    desc: 'See your original sentence, the corrected version, a natural phrasing tip, and listen aloud using browser voice playback.',
  },
];

const SAMPLE_TESTIMONIALS = [
  {
    name: 'Rohan Verma (Sample Profile)',
    role: 'B.Com Graduate • Lucknow',
    quote:
      'I always hesitated because I translated Hindi word-for-word. Seeing my exact sentence corrected gently in Hindi gave me confidence to speak in my first HR interview.',
  },
  {
    name: 'Pooja Sharma (Sample Profile)',
    role: 'Software Trainee • Jaipur',
    quote:
      'The Office English and Interview Practice modes helped me explain my college project clearly instead of memorizing robotic scripts.',
  },
  {
    name: 'Ankit Tiwari (Sample Profile)',
    role: 'Small Business Owner • Indore',
    quote:
      'Practicing 10 minutes before sleep with Daily Vocabulary and phone-call roleplay made talking to out-of-state clients much easier.',
  },
];

const FAQS = [
  {
    q: 'Is SpeakMate AI really free to use?',
    a: 'Yes! SpeakMate AI is designed around free-tier tools: Google Gemini API free tier, browser-native Web Speech API for voice input/output, and LocalStorage for progress tracking.',
  },
  {
    q: 'What if my browser does not support voice recognition?',
    a: 'No problem at all. While Chrome and Edge support Web Speech recognition well, every speaking module includes a seamless text input fallback so you can practice anywhere.',
  },
  {
    q: 'Does it explain mistakes in Hindi?',
    a: 'Yes! During onboarding (and anytime in Settings), you can choose Hindi, Hinglish, or Simple English for grammar tips and mistake explanations.',
  },
  {
    q: 'Are there usage limits on the AI tutor?',
    a: 'Because the free Gemini API tier has rate and daily request quotas, SpeakMate AI includes sensible request guards and shows clear, helpful messages if the free quota is temporarily busy.',
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="min-vh-100 d-flex flex-column bg-white">
      <PublicNavbar />

      {/* Hero */}
      <section className={styles.heroSection}>
        <div className="container">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-12 col-lg-6">
              <span className="badge sm-badge-soft-primary rounded-pill px-3 py-2 mb-3 d-inline-flex align-items-center gap-2">
                <Sparkles size={15} />
                Built for Hindi-Speaking Learners • Free-First
              </span>
              <h1 className={styles.heroTitle}>
                Speak English Confidently with Your{' '}
                <span className="sm-gradient-text">Personal AI Tutor.</span>
              </h1>
              <p className="lead text-muted mt-3 mb-4">
                Practice real spoken English at your own pace with Google Gemini. Get polite
                grammar corrections, Hindi explanations, daily vocabulary, and interactive voice
                conversations—without fear of judgment.
              </p>

              <div className="d-flex flex-wrap gap-3 mb-4">
                <Link
                  href="/onboarding"
                  className="btn sm-gradient-btn btn-lg px-4 d-inline-flex align-items-center gap-2"
                >
                  Start Learning Free
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/tutor"
                  className="btn btn-outline-primary btn-lg px-4 d-inline-flex align-items-center gap-2"
                >
                  <Mic size={18} />
                  Try AI Tutor
                </Link>
              </div>

              <div className="d-flex flex-wrap gap-3 small text-muted">
                <span className="d-inline-flex align-items-center gap-1">
                  <CheckCircle2 size={16} className="text-success" />
                  A1 to C1 Guided Levels
                </span>
                <span className="d-inline-flex align-items-center gap-1">
                  <CheckCircle2 size={16} className="text-success" />
                  Voice + Text Input
                </span>
                <span className="d-inline-flex align-items-center gap-1">
                  <CheckCircle2 size={16} className="text-success" />
                  No Credit Card Needed
                </span>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className={styles.previewCard}>
                <div className="px-4 py-3 border-bottom bg-light d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge sm-badge-soft-primary rounded-pill">AI Speaking Tutor</span>
                    <span className="small text-muted fw-semibold">Beginner English • Hindi Tips</span>
                  </div>
                  <span className="badge sm-badge-soft-success rounded-pill d-inline-flex align-items-center gap-1">
                    <Volume2 size={13} />
                    Voice Ready
                  </span>
                </div>

                <div className="p-4 d-flex flex-column gap-3">
                  <div className={styles.chatBubbleAi}>
                    <div className="small fw-bold text-primary mb-1">SpeakMate AI Tutor</div>
                    <div className="small text-dark">
                      Namaste! Tell me one thing you did this morning. Don&apos;t worry about
                      mistakes!
                    </div>
                  </div>

                  <div className={`${styles.chatBubbleUser} align-self-end`} style={{ maxWidth: '88%' }}>
                    <div className="small fw-bold mb-1">You (Voice Transcript)</div>
                    <div className="small">“Today morning I am wake up at 7 AM and drink tea.”</div>
                  </div>

                  <div className={styles.chatBubbleAi}>
                    <div className="small fw-bold text-primary mb-2">Tutor Reply &amp; Gentle Fix</div>
                    <div className="p-2 rounded-3 mb-2" style={{ backgroundColor: '#eef2ff' }}>
                      <div className="small">
                        <span className="text-muted">You said:</span>{' '}
                        <span className="text-decoration-line-through text-danger">
                          Today morning I am wake up...
                        </span>
                      </div>
                      <div className="small fw-semibold text-success">
                        Better: “This morning I woke up at 7 AM and drank tea.”
                      </div>
                      <div className="small text-muted mt-1">
                        हिंदी टिप: सुबह की बात बीते समय (Past) में है, इसलिए &quot;wake&quot; की जगह
                        &quot;woke up&quot; और &quot;today morning&quot; की जगह &quot;this morning&quot; बोलें।
                      </div>
                    </div>
                    <div className="small text-dark">
                      Great effort! What did you have with your tea?
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section id="features" className="py-5 bg-light">
        <div className="container py-3">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: 640 }}>
            <span className="badge sm-badge-soft-blue rounded-pill px-3 py-2 mb-2">
              Everything You Need to Speak Fluently
            </span>
            <h2 className="h2 fw-bold text-dark">Built Like a Real Personal English Teacher</h2>
            <p className="text-muted mb-0">
              Not a generic chatbot—every module is crafted to help Hindi speakers overcome hesitation
              step by step.
            </p>
          </div>

          <div className="row g-4">
            {FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="col-12 col-md-6 col-lg-4">
                  <div className="sm-card sm-card-interactive p-4 h-100">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
                      style={{ width: 48, height: 48, backgroundColor: feat.tone, color: feat.color }}
                    >
                      <Icon size={23} />
                    </div>
                    <h3 className="h5 fw-bold mb-2">{feat.title}</h3>
                    <p className="text-muted small mb-0">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-5 bg-white border-top border-bottom">
        <div className="container py-3">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: 620 }}>
            <h2 className="h2 fw-bold text-dark">How SpeakMate AI Works</h2>
            <p className="text-muted mb-0">Start speaking in under 60 seconds.</p>
          </div>
          <div className="row g-4">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="col-12 col-md-4">
                <div className="sm-card p-4 h-100 text-center">
                  <div className={`${styles.stepCircle} mx-auto mb-3`}>{item.step}</div>
                  <h3 className="h5 fw-bold mb-2">{item.title}</h3>
                  <p className="text-muted small mb-0">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Levels */}
      <section id="levels" className="py-5 bg-light">
        <div className="container py-3">
          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3 mb-4">
            <div>
              <h2 className="h2 fw-bold text-dark mb-1">5 Guided Learning Levels (A1 to C1)</h2>
              <p className="text-muted mb-0">
                Your AI tutor automatically adapts sentence length, vocabulary, and pace to your level.
              </p>
            </div>
            <Link href="/onboarding" className="btn btn-outline-primary fw-semibold">
              Choose Your Level
            </Link>
          </div>

          <div className="row g-3">
            {ENGLISH_LEVELS.map((lvl) => (
              <div key={lvl.id} className="col-12 col-md-6 col-xl">
                <div className="sm-card p-3 p-md-4 h-100">
                  <span className="badge sm-badge-soft-primary rounded-pill mb-2">{lvl.id}</span>
                  <h3 className="h6 fw-bold mb-2">{lvl.name}</h3>
                  <p className="small text-muted mb-2">{lvl.description}</p>
                  <p className="small fw-medium text-primary mb-0">{lvl.hindiDesc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-5 bg-white border-top">
        <div className="container py-3">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-6">
              <h2 className="h2 fw-bold text-dark mb-3">Why Learners Stay Consistent</h2>
              <p className="text-muted mb-4">
                Traditional grammar books teach rules, not speaking confidence. SpeakMate AI combines
                active speaking practice with clear bilingual support.
              </p>
              <div className="d-flex flex-column gap-3">
                {[
                  'One question at a time so you never feel overwhelmed.',
                  'Side-by-side original vs. corrected English with polite encouragement.',
                  'Practical 10-minute daily sessions that build lasting streaks.',
                  'Safe, private practice before talking in real interviews or meetings.',
                ].map((benefit) => (
                  <div key={benefit} className="d-flex align-items-start gap-2">
                    <CheckCircle2 size={20} className="text-success flex-shrink-0 mt-1" />
                    <span className="text-dark fw-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div
                className="p-4 p-md-5 rounded-4 text-white"
                style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 65%, #2563eb 100%)' }}
              >
                <div className="d-inline-flex align-items-center gap-2 bg-white bg-opacity-25 px-3 py-1 rounded-pill small fw-semibold mb-3">
                  <ShieldCheck size={16} />
                  Privacy &amp; Free-First Promise
                </div>
                <h3 className="h4 fw-bold mb-3">Practice Without Pressure or Paywalls</h3>
                <p className="mb-4 opacity-90">
                  Your learning progress is saved locally right in your browser to get started
                  instantly—and Gemini API keys stay strictly on the server, never exposed in frontend code.
                </p>
                <div className="d-flex flex-wrap gap-2">
                  <Link href="/dashboard" className="btn btn-light fw-bold text-primary px-4">
                    Open Dashboard
                  </Link>
                  <Link href="/grammar" className="btn btn-outline-light fw-semibold px-4">
                    Browse Grammar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certification Section */}
      <section id="certification" className="py-5 bg-light border-top">
        <div className="container py-3">
          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3 mb-4">
            <div>
              <span className="badge sm-badge-soft-primary rounded-pill px-3 py-2 mb-2 d-inline-flex align-items-center gap-1">
                <Award size={14} />
                SpeakMate AI Completion Certificates
              </span>
              <h2 className="h2 fw-bold text-dark mb-1">
                Earn Milestone Certificates as You Learn
              </h2>
              <p className="text-muted mb-0">
                Complete syllabus modules, speaking minutes, and short assessments to unlock
                downloadable PNG &amp; printable PDF certificates.
              </p>
            </div>
            <Link href="/certification" className="btn sm-gradient-btn fw-semibold flex-shrink-0">
              View Certificates
            </Link>
          </div>

          <div className="row g-4">
            {[
              {
                level: 'A1–A2',
                title: 'Foundation Certificate',
                hindi: 'बुनियादी अंग्रेजी बोलचाल सर्टिफिकेट',
                desc: 'Master greetings, daily routines, polite requests, and foundational grammar.',
              },
              {
                level: 'B1',
                title: 'Conversational Fluency Certificate',
                hindi: 'दैनिक और ऑफिस बातचीत सर्टिफिकेट',
                desc: 'Handle phone calls, workplace updates, and everyday situations naturally.',
              },
              {
                level: 'B2–C1',
                title: 'Career & Interview Mastery Certificate',
                hindi: 'इंटरव्यू और प्रोफेशनल मास्टरी सर्टिफिकेट',
                desc: 'Deliver structured STAR interview answers and lead fluent discussions.',
              },
            ].map((cert) => (
              <div key={cert.title} className="col-12 col-md-4">
                <div className="sm-card sm-card-interactive p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="badge sm-badge-soft-blue rounded-pill">{cert.level}</span>
                      <Award size={20} className="text-primary" />
                    </div>
                    <h3 className="h5 fw-bold mb-1">{cert.title}</h3>
                    <div className="small text-primary fw-semibold mb-2">{cert.hindi}</div>
                    <p className="small text-muted mb-0">{cert.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials (Clearly identified sample content) */}
      <section className="py-5 bg-light border-top">
        <div className="container py-3">
          <div className="text-center mx-auto mb-4" style={{ maxWidth: 640 }}>
            <span className="badge sm-badge-soft-warning rounded-pill px-3 py-2 mb-2">
              Illustrative Sample Stories
            </span>
            <h2 className="h2 fw-bold text-dark">Designed for Everyday Indian Learners</h2>
            <p className="text-muted small mb-0">
              Note: The testimonials below are clearly labeled sample learner profiles illustrating
              common SpeakMate AI use cases.
            </p>
          </div>
          <div className="row g-4">
            {SAMPLE_TESTIMONIALS.map((t) => (
              <div key={t.name} className="col-12 col-md-4">
                <div className="sm-card p-4 h-100 d-flex flex-column justify-content-between">
                  <p className="text-dark mb-3">&ldquo;{t.quote}&rdquo;</p>
                  <div className="border-top pt-3">
                    <div className="fw-bold small text-dark">{t.name}</div>
                    <div className="text-muted small">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-5 bg-white border-top">
        <div className="container py-3" style={{ maxWidth: 820 }}>
          <div className="text-center mb-4">
            <h2 className="h2 fw-bold text-dark">Frequently Asked Questions</h2>
          </div>
          <div className="d-flex flex-column gap-3">
            {FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.q} className={styles.faqItem}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="btn w-100 text-start p-0 border-0 d-flex align-items-center justify-content-between gap-2 fw-bold text-dark"
                    aria-expanded={isOpen}
                  >
                    <span>{item.q}</span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {isOpen && <p className="text-muted small mt-2 mb-0">{item.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-light py-5 mt-auto">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-12 col-md-5">
              <BrandLogo href="/" dark />
              <p className="small text-secondary mt-3 mb-0">
                Free-first AI English speaking tutor built with Next.js, Bootstrap 5, Web Speech
                API, and Google Gemini.
              </p>
            </div>
            <div className="col-6 col-md-3">
              <div className="fw-bold small mb-2 text-white">Practice</div>
              <ul className="list-unstyled small d-flex flex-column gap-1 mb-0">
                <li><Link href="/tutor" className="text-secondary">AI Speaking Tutor</Link></li>
                <li><Link href="/conversation" className="text-secondary">Conversation Practice</Link></li>
                <li><Link href="/interview" className="text-secondary">Interview Practice</Link></li>
                <li><Link href="/vocabulary" className="text-secondary">Daily Vocabulary</Link></li>
              </ul>
            </div>
            <div className="col-6 col-md-4">
              <div className="fw-bold small mb-2 text-white">Account &amp; Learning</div>
              <ul className="list-unstyled small d-flex flex-column gap-1 mb-0">
                <li><Link href="/dashboard" className="text-secondary">Learning Dashboard</Link></li>
                <li><Link href="/grammar" className="text-secondary">Grammar Lessons</Link></li>
                <li><Link href="/onboarding" className="text-secondary">Onboarding Setup</Link></li>
                <li><Link href="/login" className="text-secondary">Login / Sign Up</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-top border-secondary border-opacity-25 mt-4 pt-3 d-flex flex-column flex-sm-row justify-content-between gap-2 small text-secondary">
            <span>© {new Date().getFullYear()} SpeakMate AI. Free educational MVP.</span>
            <span className="d-inline-flex align-items-center gap-1">
              <GraduationCap size={15} />
              Progress persisted locally in browser storage.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

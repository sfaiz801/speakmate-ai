'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Send, VolumeX, Loader2, AlertCircle } from 'lucide-react';
import {
  getSpeechRecognitionSupport,
  getSpeechSynthesisSupport,
  mapSpeechRecognitionError,
} from '@/lib/speech/webSpeech';
import styles from './VoiceControls.module.scss';

export default function VoiceControls({
  onSendMessage,
  isProcessing = false,
  isSpeaking = false,
  onStopSpeaking,
  recognitionLang = 'en-IN',
  placeholder = 'Type your English response here, or tap Start Mic to speak...',
  disabled = false,
}) {
  const [textInput, setTextInput] = useState('');
  const [interimText, setInterimText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState('');

  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');
  const interimTranscriptRef = useRef('');

  useEffect(() => {
    const rec = getSpeechRecognitionSupport();
    const tts = getSpeechSynthesisSupport();
    setSpeechSupported(rec.supported);
    setTtsSupported(tts.supported);

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, []);

  const handleStartMic = () => {
    setVoiceNotice('');
    const { supported, constructor: SpeechRecognition } = getSpeechRecognitionSupport();
    if (!supported || !SpeechRecognition) {
      setVoiceNotice(
        'Voice input is not supported in this browser. Please type your message below (Chrome or Edge desktop/Android supports Web Speech recognition).'
      );
      return;
    }

    if (isSpeaking && onStopSpeaking) {
      onStopSpeaking();
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore previous cleanup errors
      }
      recognitionRef.current = null;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = recognitionLang || 'en-IN';
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      finalTranscriptRef.current = '';
      interimTranscriptRef.current = '';
      setInterimText('');

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let interim = '';
        let finalChunk = '';
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const transcript = event.results[i][0]?.transcript || '';
          if (event.results[i].isFinal) {
            finalChunk += `${transcript} `;
          } else {
            interim += transcript;
          }
        }

        const cleanFinal = finalChunk.trim();
        if (cleanFinal) {
          finalTranscriptRef.current = `${finalTranscriptRef.current} ${cleanFinal}`.trim();
          setTextInput((prev) => `${prev ? `${prev} ` : ''}${cleanFinal}`.trim());
        }
        interimTranscriptRef.current = interim.trim();
        setInterimText(interim.trim());
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        interimTranscriptRef.current = '';
        setInterimText('');
        if (event.error !== 'aborted') {
          setVoiceNotice(mapSpeechRecognitionError(event.error));
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (!finalTranscriptRef.current && interimTranscriptRef.current) {
          const fallbackChunk = interimTranscriptRef.current;
          setTextInput((prev) => `${prev ? `${prev} ` : ''}${fallbackChunk}`.trim());
        }
        interimTranscriptRef.current = '';
        setInterimText('');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceNotice('Could not start microphone. Please check browser mic permissions or type below.');
    }
  };

  const handleStopMic = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleaned = (textInput.trim() || interimTranscriptRef.current.trim()).trim();
    if (!cleaned || isProcessing || disabled) return;
    if (isListening) handleStopMic();
    setTextInput('');
    interimTranscriptRef.current = '';
    setInterimText('');
    await onSendMessage(cleaned);
  };

  const statusBadge = isListening
    ? { label: 'Listening...', cls: 'sm-badge-soft-danger', dot: styles.dotListening }
    : isProcessing
    ? { label: 'Thinking...', cls: 'sm-badge-soft-primary', dot: styles.dotProcessing }
    : isSpeaking
    ? { label: 'Tutor Speaking...', cls: 'sm-badge-soft-success', dot: styles.dotSpeaking }
    : { label: 'Ready', cls: 'sm-badge-soft-blue', dot: styles.dotReady };

  return (
    <div className={styles.voiceBox}>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
        <div className="d-flex flex-wrap align-items-center gap-2">
          <span
            className={`badge ${statusBadge.cls} rounded-pill px-2 py-1 d-inline-flex align-items-center gap-1`}
          >
            <span className={`${styles.statusDot} ${statusBadge.dot}`} aria-hidden="true" />
            {statusBadge.label}
          </span>
          {!speechSupported && (
            <span className="small text-muted">
              Browser mic unavailable — text mode active
            </span>
          )}
          {!ttsSupported && (
            <span className="small text-muted">• Audio playback unavailable</span>
          )}
        </div>

        <div className="d-flex align-items-center gap-2">
          {isSpeaking && onStopSpeaking && (
            <button
              type="button"
              onClick={onStopSpeaking}
              className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
            >
              <VolumeX size={15} />
              Stop Audio
            </button>
          )}

          {!isListening ? (
            <button
              type="button"
              onClick={handleStartMic}
              disabled={isProcessing || disabled}
              className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 fw-semibold"
              aria-label="Start microphone"
            >
              <Mic size={15} />
              Start Mic
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStopMic}
              className={`btn btn-sm btn-danger d-inline-flex align-items-center gap-1 fw-semibold ${styles.micBtnActive}`}
              aria-label="Stop microphone"
            >
              <MicOff size={15} />
              Stop Mic
            </button>
          )}
        </div>
      </div>

      {voiceNotice && (
        <div className="alert alert-warning py-2 px-3 small d-flex align-items-start gap-2 mb-2">
          <AlertCircle size={16} className="flex-shrink-0 mt-1" />
          <span>{voiceNotice}</span>
        </div>
      )}

      {interimText && (
        <div className={`${styles.interimPill} mb-2`}>
          <span className="fw-semibold text-primary">Hearing:</span> {interimText}
        </div>
      )}

      <form onSubmit={handleSubmit} className="d-flex gap-2 align-items-end">
        <div className="flex-grow-1">
          <label htmlFor="voiceTextInput" className="visually-hidden">
            Your English message
          </label>
          <textarea
            id="voiceTextInput"
            rows={2}
            className="form-control"
            placeholder={placeholder}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            disabled={isProcessing || disabled}
          />
        </div>
        <button
          type="submit"
          disabled={!textInput.trim() || isProcessing || disabled}
          className="btn sm-gradient-btn px-3 py-2 d-inline-flex align-items-center gap-1"
          style={{ height: 46 }}
          aria-label="Send message"
        >
          {isProcessing ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
          <span className="d-none d-sm-inline">Send</span>
        </button>
      </form>
      <div className="form-text mt-1">
        Tip: Tap <strong>Start Mic</strong> to dictate, review/edit your text if needed, and press{' '}
        <strong>Send</strong> (or Enter).
      </div>
    </div>
  );
}

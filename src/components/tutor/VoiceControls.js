'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Send, VolumeX, Loader2, AlertCircle } from 'lucide-react';
import {
  getSpeechRecognitionSupport,
  getSpeechSynthesisSupport,
  mapSpeechRecognitionError,
} from '@/lib/speech/webSpeech';
import styles from './VoiceControls.module.scss';

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = String(reader.result || '');
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function getMediaRecorderSupport() {
  if (typeof window === 'undefined') return false;
  return Boolean(
    typeof navigator !== 'undefined' &&
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === 'function' &&
      typeof window.MediaRecorder !== 'undefined'
  );
}

export default function VoiceControls({
  onSendMessage,
  isProcessing = false,
  isSpeaking = false,
  onStopSpeaking,
  recognitionLang = 'en-IN',
  placeholder = 'Speak or type in English (or Hinglish if stuck)...',
  disabled = false,
}) {
  const [textInput, setTextInput] = useState('');
  const [interimText, setInterimText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [autoSendVoice, setAutoSendVoice] = useState(true);
  const [recorderMode, setRecorderMode] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [mediaSupported, setMediaSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState('');

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const finalTranscriptRef = useRef('');
  const interimTranscriptRef = useRef('');
  const autoSendRef = useRef(true);
  const onSendRef = useRef(onSendMessage);
  const textInputRef = useRef('');

  useEffect(() => {
    autoSendRef.current = autoSendVoice;
  }, [autoSendVoice]);

  useEffect(() => {
    onSendRef.current = onSendMessage;
  }, [onSendMessage]);

  useEffect(() => {
    textInputRef.current = textInput;
  }, [textInput]);

  useEffect(() => {
    const rec = getSpeechRecognitionSupport();
    const tts = getSpeechSynthesisSupport();
    const media = getMediaRecorderSupport();
    setSpeechSupported(rec.supported);
    setTtsSupported(tts.supported);
    setMediaSupported(media);
    if (!rec.supported && media) {
      setRecorderMode(true);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const stopMediaTracks = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
  };

  const startRecorderVoice = async () => {
    setVoiceNotice('');
    if (!getMediaRecorderSupport()) {
      setVoiceNotice('Microphone recording is unavailable in this browser. Please type your message below.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      audioChunksRef.current = [];

      const preferredTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
      const mimeType = preferredTypes.find((t) => window.MediaRecorder.isTypeSupported(t)) || '';
      const recorder = mimeType ? new window.MediaRecorder(stream, { mimeType }) : new window.MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        setIsListening(false);
        stopMediaTracks();

        const blobType = recorder.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: blobType });
        audioChunksRef.current = [];

        if (blob.size < 400) {
          setVoiceNotice('Voice clip was too short. Hold/speak for 1–2 seconds and tap Stop Mic.');
          return;
        }

        setIsTranscribing(true);
        try {
          const audioBase64 = await blobToBase64(blob);
          const res = await fetch('/api/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audioBase64, mimeType: blobType }),
          });
          const json = await res.json();

          if (!res.ok) {
            setVoiceNotice(json.error || 'Could not transcribe audio. Please type below.');
            return;
          }

          const transcript = (json.transcript || '').trim();
          if (!transcript) {
            setVoiceNotice('Could not hear clear speech. Please speak closer to your mic or type below.');
            return;
          }

          if (autoSendRef.current) {
            setTextInput('');
            await onSendRef.current(transcript);
          } else {
            setTextInput((prev) => `${prev ? `${prev} ` : ''}${transcript}`.trim());
          }
        } catch {
          setVoiceNotice('Network error while transcribing voice. Please try again or type below.');
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsListening(true);
    } catch (err) {
      stopMediaTracks();
      setIsListening(false);
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        setVoiceNotice(
          'Microphone permission was denied. Allow mic access in your browser bar (or Brave Shields/site settings) and try again.'
        );
      } else {
        setVoiceNotice('Could not access microphone. Please check your device mic or type below.');
      }
    }
  };

  const handleStartMic = async () => {
    setVoiceNotice('');
    if (isSpeaking && onStopSpeaking) {
      onStopSpeaking();
    }

    if (recorderMode || !speechSupported) {
      await startRecorderVoice();
      return;
    }

    const { constructor: SpeechRecognition } = getSpeechRecognitionSupport();
    if (!SpeechRecognition) {
      setRecorderMode(true);
      await startRecorderVoice();
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
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
      let switchedToFallback = false;

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

      recognition.onerror = async (event) => {
        setIsListening(false);
        interimTranscriptRef.current = '';
        setInterimText('');

        // Brave & some privacy browsers block Google Web Speech servers with 'network'.
        // Seamlessly switch to MediaRecorder + Gemini audio transcription!
        if (event.error === 'network' && getMediaRecorderSupport()) {
          switchedToFallback = true;
          setRecorderMode(true);
          setVoiceNotice(
            'Switched to universal audio recorder (works in Brave & all browsers). Tap Stop & Send when finished speaking.'
          );
          await startRecorderVoice();
          return;
        }

        if (event.error !== 'aborted') {
          setVoiceNotice(mapSpeechRecognitionError(event.error));
        }
      };

      recognition.onend = async () => {
        setIsListening(false);
        if (switchedToFallback) return;

        const combined = (
          finalTranscriptRef.current ||
          interimTranscriptRef.current ||
          ''
        ).trim();

        if (!finalTranscriptRef.current && interimTranscriptRef.current) {
          const fallbackChunk = interimTranscriptRef.current;
          setTextInput((prev) => `${prev ? `${prev} ` : ''}${fallbackChunk}`.trim());
        }

        interimTranscriptRef.current = '';
        setInterimText('');

        if (autoSendRef.current && combined) {
          const fullText = (textInputRef.current.trim() || combined).trim();
          if (fullText) {
            setTextInput('');
            await onSendRef.current(fullText);
          }
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      if (getMediaRecorderSupport()) {
        setRecorderMode(true);
        await startRecorderVoice();
      } else {
        setVoiceNotice('Could not start microphone. Please check permissions or type below.');
      }
    }
  };

  const handleStopMic = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }
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
    if (!cleaned || isProcessing || isTranscribing || disabled) return;
    if (isListening) handleStopMic();
    setTextInput('');
    interimTranscriptRef.current = '';
    setInterimText('');
    await onSendMessage(cleaned);
  };

  const busy = isProcessing || isTranscribing;

  const statusBadge = isListening
    ? {
        label: recorderMode ? 'Recording... Tap Stop when done' : 'Listening...',
        cls: 'sm-badge-soft-danger',
        dot: styles.dotListening,
      }
    : isTranscribing
    ? { label: 'Understanding voice...', cls: 'sm-badge-soft-primary', dot: styles.dotProcessing }
    : isProcessing
    ? { label: 'AI Coach thinking...', cls: 'sm-badge-soft-primary', dot: styles.dotProcessing }
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

          <div className="form-check form-switch m-0 d-inline-flex align-items-center gap-1 small">
            <input
              id="autoSendVoiceSwitch"
              type="checkbox"
              className="form-check-input m-0"
              checked={autoSendVoice}
              onChange={(e) => setAutoSendVoice(e.target.checked)}
            />
            <label htmlFor="autoSendVoiceSwitch" className="form-check-label text-muted small">
              Auto-send voice
            </label>
          </div>

          {!speechSupported && !mediaSupported && (
            <span className="small text-muted">Mic unavailable — text mode active</span>
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
              disabled={busy || disabled}
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
              {recorderMode ? 'Stop & Send' : 'Stop Mic'}
            </button>
          )}
        </div>
      </div>

      {voiceNotice && (
        <div className="alert alert-info py-2 px-3 small d-flex align-items-start gap-2 mb-2">
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
            disabled={busy || disabled}
          />
        </div>
        <button
          type="submit"
          disabled={!textInput.trim() || busy || disabled}
          className="btn sm-gradient-btn px-3 py-2 d-inline-flex align-items-center gap-1"
          style={{ height: 46 }}
          aria-label="Send message"
        >
          {busy ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
          <span className="d-none d-sm-inline">Send</span>
        </button>
      </form>
      <div className="form-text mt-1">
        Tip: Tap <strong>Start Mic</strong> and speak naturally (even broken English or Hinglish).
        {recorderMode
          ? ' Using universal audio mode — tap Stop & Send when finished.'
          : ' Auto-send sends automatically when you pause, or type below anytime.'}
      </div>
    </div>
  );
}

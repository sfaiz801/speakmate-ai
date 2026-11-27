/**
 * Safe wrappers around Browser Web Speech API (SpeechRecognition) & SpeechSynthesis.
 * Always reports capability honestly and never assumes universal browser support.
 */

export function getSpeechRecognitionSupport() {
  if (typeof window === 'undefined') {
    return { supported: false, constructor: null };
  }
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  return {
    supported: Boolean(SpeechRecognition),
    constructor: SpeechRecognition,
  };
}

export function getSpeechSynthesisSupport() {
  if (typeof window === 'undefined') {
    return { supported: false };
  }
  return {
    supported: typeof window.speechSynthesis !== 'undefined' && typeof window.SpeechSynthesisUtterance !== 'undefined',
  };
}

export function mapSpeechRecognitionError(errorCode) {
  switch (errorCode) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Microphone permission was blocked. Please allow microphone access in your browser address bar, or type your message below.';
    case 'no-speech':
      return 'No speech was detected. Please speak clearly closer to your mic or type your answer.';
    case 'audio-capture':
      return 'No working microphone was found on this device. You can type your message instead.';
    case 'network':
      return 'Browser speech recognition had a network error. Please try again or type your message.';
    case 'aborted':
      return 'Listening stopped.';
    default:
      return 'Voice recognition encountered an issue. You can continue anytime by typing below.';
  }
}

export function pickPreferredEnglishVoice(voices = [], preferredLang = 'en-IN') {
  if (!voices.length) return null;
  const scoreVoice = (v) => {
    let score = 0;
    const name = (v.name || '').toLowerCase();
    const lang = v.lang || '';
    if (lang === preferredLang) score += 50;
    else if (lang.startsWith('en-IN')) score += 40;
    else if (lang.startsWith('en-GB')) score += 30;
    else if (lang.startsWith('en-US')) score += 25;
    else if (lang.startsWith('en')) score += 15;
    else return -1;

    if (name.includes('natural')) score += 30;
    if (name.includes('google')) score += 25;
    if (name.includes('online')) score += 20;
    if (name.includes('microsoft')) score += 10;
    return score;
  };

  let best = null;
  let bestScore = -1;
  for (const v of voices) {
    const s = scoreVoice(v);
    if (s > bestScore) {
      bestScore = s;
      best = v;
    }
  }
  return best || voices[0];
}

let activeSpeechToken = 0;

export function speakText(text, options = {}) {
  const { supported } = getSpeechSynthesisSupport();
  if (!supported || !text) {
    if (options.onEnd) options.onEnd();
    return false;
  }

  try {
    activeSpeechToken += 1;
    const token = activeSpeechToken;
    const wasSpeaking = window.speechSynthesis.speaking || window.speechSynthesis.pending;
    if (wasSpeaking) {
      window.speechSynthesis.cancel();
    }

    const startSpeech = () => {
      if (token !== activeSpeechToken) return;
      const utterance = new window.SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const voice = pickPreferredEnglishVoice(voices, options.lang || 'en-IN');

      if (voice) utterance.voice = voice;
      utterance.lang = voice?.lang || options.lang || 'en-IN';
      utterance.rate = typeof options.rate === 'number' ? options.rate : 0.95;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        if (token === activeSpeechToken && options.onStart) {
          options.onStart();
        }
      };

      const finish = () => {
        if (token === activeSpeechToken && options.onEnd) {
          options.onEnd();
        }
      };

      utterance.onend = finish;
      utterance.onerror = finish;

      window.speechSynthesis.speak(utterance);
    };

    if (wasSpeaking) {
      setTimeout(startSpeech, 40);
    } else {
      startSpeech();
    }
    return true;
  } catch {
    if (options.onEnd) options.onEnd();
    return false;
  }
}

export function stopSpeaking() {
  activeSpeechToken += 1;
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

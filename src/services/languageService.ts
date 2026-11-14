export type Language = 'te' | 'en';

export interface BillExplanation {
  headline: string;
  summary: string;
  keyPoints: string[];
  audioScript: string;
  discomStatusNote: string;
}

export function getAudioScript(
  units: number,
  total: number,
  days: number,
  dueDate: string,
  lang: Language
): string {
  if (lang === 'te') {
    return `నమస్కారం. మీ విద్యుత్ బిల్లు వివరణ. మీరు ${days} రోజులలో ${units} యూనిట్లు వినియోగించారు. మొత్తం చెల్లించవలసిన మొత్తం రూపాయలు ${total.toLocaleString('en-IN')}. చివరి గడువు తేదీ ${dueDate}. ప్రతి ఛార్జీ వివరాలు స్క్రీన్‌పై స్పష్టంగా ఉన్నాయి.`;
  }
  return `Hello. Your electricity bill summary. You consumed ${units} units over ${days} billing days. Total amount payable is rupees ${total.toLocaleString('en-IN')}, due by ${dueDate}. You can review every itemised charge on your screen.`;
}

// Native Speech synthesis with strict language binding
let activeUtterance: SpeechSynthesisUtterance | null = null;

export function playAudio(
  text: string,
  lang: Language,
  rate: number = 1.0,
  onEnd?: () => void
): boolean {
  if (!('speechSynthesis' in window)) {
    return false;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  if (lang === 'te') {
    utterance.lang = 'te-IN';
    const teluguVoice = voices.find(
      (v) => v.lang.includes('te') || v.name.toLowerCase().includes('telugu')
    );
    if (teluguVoice) {
      utterance.voice = teluguVoice;
    } else {
      const inVoice = voices.find((v) => v.lang === 'en-IN');
      if (inVoice) utterance.voice = inVoice;
    }
  } else {
    utterance.lang = 'en-IN';
    const englishVoice = voices.find(
      (v) => v.lang === 'en-IN' || v.lang.startsWith('en')
    );
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
  }

  utterance.onend = () => {
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  activeUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function pauseAudio(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }
}

export function resumeAudio(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.resume();
  }
}

export function stopAudio(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}

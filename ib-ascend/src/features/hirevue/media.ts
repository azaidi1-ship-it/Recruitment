/**
 * Browser media helpers for HireVue practice: camera/mic stream, a per-take
 * recorder, and live transcription via the Web Speech API where available.
 * Recordings stay in memory for the session (download to keep them).
 */

export function mediaSupported(): boolean {
  return typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia) && typeof MediaRecorder !== 'undefined';
}

export async function openCamera(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({
    video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
    audio: true,
  });
}

export function stopStream(stream: MediaStream | null): void {
  stream?.getTracks().forEach((t) => t.stop());
}

function pickMimeType(): string | undefined {
  const candidates = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'];
  return candidates.find((c) => MediaRecorder.isTypeSupported?.(c));
}

/** Records one take from a live stream. */
export class TakeRecorder {
  private recorder: MediaRecorder;
  private chunks: Blob[] = [];
  readonly mimeType: string;

  constructor(stream: MediaStream) {
    const mimeType = pickMimeType();
    this.recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    this.mimeType = this.recorder.mimeType || mimeType || 'video/webm';
    this.recorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.chunks.push(e.data);
    };
  }

  start(): void {
    this.chunks = [];
    this.recorder.start(1000);
  }

  stop(): Promise<Blob> {
    return new Promise((resolve) => {
      if (this.recorder.state === 'inactive') {
        resolve(new Blob(this.chunks, { type: this.mimeType }));
        return;
      }
      this.recorder.onstop = () => resolve(new Blob(this.chunks, { type: this.mimeType }));
      this.recorder.stop();
    });
  }
}

// ── Speech recognition (Chrome/Edge/Safari expose it, sometimes prefixed) ──

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  start(): void;
  stop(): void;
}
type SpeechCtor = new () => SpeechRecognitionLike;

function speechCtor(): SpeechCtor | null {
  const w = window as unknown as { SpeechRecognition?: SpeechCtor; webkitSpeechRecognition?: SpeechCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function speechSupported(): boolean {
  return typeof window !== 'undefined' && speechCtor() !== null;
}

export interface Transcriber {
  start(): void;
  /** Stops listening and returns the final transcript. */
  stop(): string;
}

/**
 * Live transcript. The browser may end recognition after silence, so it is
 * restarted automatically until stop() is called.
 */
export function createTranscriber(onUpdate: (finalText: string, interim: string) => void): Transcriber | null {
  const Ctor = speechCtor();
  if (!Ctor) return null;
  const rec = new Ctor();
  rec.continuous = true;
  rec.interimResults = true;
  rec.lang = 'en-US';
  let active = false;
  let finalText = '';

  rec.onresult = (e) => {
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i]!;
      if (r.isFinal) finalText += `${r[0].transcript.trim()} `;
      else interim += r[0].transcript;
    }
    onUpdate(finalText.trim(), interim.trim());
  };
  rec.onend = () => {
    if (active) {
      try {
        rec.start();
      } catch {
        /* already restarting */
      }
    }
  };
  rec.onerror = (e) => {
    // Silence timeouts are normal; anything else (no network, no mic, denied) stops the restart loop.
    if (e.error !== 'no-speech' && e.error !== 'aborted') active = false;
  };

  return {
    start() {
      active = true;
      finalText = '';
      try {
        rec.start();
      } catch {
        /* ignore double start */
      }
    },
    stop() {
      active = false;
      try {
        rec.stop();
      } catch {
        /* ignore */
      }
      return finalText.trim();
    },
  };
}

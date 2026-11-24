import { useSyncExternalStore } from 'react';

/**
 * One controller per scene. The left page (guide) and right page (stage) are separate React trees,
 * so they share playback state through this tiny store instead of props.
 *
 * Speech uses the browser's built-in Web Speech API (free, offline on most systems).
 * Sound never starts by itself: speaking begins only after the reader presses Play.
 */
export interface Cue {
  say: string;                 // what the guide says (spoken + subtitle)
  point?: [number, number];    // where the pointer goes on the stage, in stage coords (0–600, 0–420)
  bubble?: string;             // short "thought" comment shown at the pointer
  step?: number;               // diagram state; defaults to the cue index
}

interface State { idx: number; playing: boolean; speaking: boolean; loading: number | null; blocked: boolean }

let voiceOn = localStorage.getItem('voice') !== 'off';
let rate = 1;
let autoOn = localStorage.getItem('auto') !== 'off';
const voiceListeners = new Set<() => void>();
export const voiceStore = {
  get: () => voiceSnap,
  setVoice(v: boolean) { voiceOn = v; localStorage.setItem('voice', v ? 'on' : 'off'); if (!v) stopSound(); emitVoice(); },
  setRate(r: number) { rate = r; emitVoice(); },
  setAuto(a: boolean) { autoOn = a; localStorage.setItem('auto', a ? 'on' : 'off'); emitVoice(); },
};
let voiceSnap = { voiceOn, rate, autoOn };
function emitVoice() { voiceSnap = { voiceOn, rate, autoOn }; voiceListeners.forEach((l) => l()); }
export const useVoice = () => useSyncExternalStore((l) => { voiceListeners.add(l); return () => voiceListeners.delete(l); }, () => voiceSnap);

function pickVoice(): SpeechSynthesisVoice | undefined {
  const vs = speechSynthesis.getVoices().filter((v) => v.lang.startsWith('en'));
  // Prefer young, lively male voices; neural/"Natural" voices (Edge, Windows 11) sound far more human.
  const young = /(andrew|brian|guy|christopher|eric|ryan|roger|steffan)/i;
  const male = /(guy|david|mark|daniel|george|ryan|christopher|eric|male|james|brian|andrew)/i;
  const neural = /natural|online|neural/i;
  return vs.find((v) => young.test(v.name) && neural.test(v.name))
    ?? vs.find((v) => male.test(v.name) && neural.test(v.name))
    ?? vs.find((v) => male.test(v.name)) ?? vs[0];
}

/* Pre-recorded neural voice (scripts/make_voice.py). Same FNV-1a hash as the script. */
export function voiceFile(text: string) {
  let h = 0x811c9dc5;
  for (const b of new TextEncoder().encode(text)) { h ^= b; h = Math.imul(h, 0x01000193) >>> 0; }
  return `${import.meta.env.BASE_URL}audio/${h.toString(16).padStart(8, '0')}.mp3`;
}
/** Clips already downloaded into memory (text → blob URL), so playback starts instantly. */
const clips = new Map<string, string>();
const clipUrl = (text: string) => clips.get(text) ?? voiceFile(text);
async function fetchClip(text: string) {
  if (clips.has(text)) return;
  try { const r = await fetch(voiceFile(text)); if (r.ok) clips.set(text, URL.createObjectURL(await r.blob())); } catch { /* falls back to streaming */ }
}
const player = typeof Audio !== 'undefined' ? new Audio() : null;
const preloader = typeof Audio !== 'undefined' ? new Audio() : null;
function stopSound() { player?.pause(); if ('speechSynthesis' in window) speechSynthesis.cancel(); }

const controllers = new Map<string, Controller>();
let active: Controller | null = null;

export class Controller {
  state: State = { idx: 0, playing: false, speaking: false, loading: null, blocked: false };
  private listeners = new Set<() => void>();
  private timer: ReturnType<typeof setTimeout> | number = 0;
  private token = 0;
  constructor(public id: string, public cues: Cue[]) {}

  subscribe = (l: () => void) => { this.listeners.add(l); return () => { this.listeners.delete(l); }; };
  get = () => this.state;
  private set(p: Partial<State>) { this.state = { ...this.state, ...p }; this.listeners.forEach((l) => l()); }

  private prep = 0;
  /** Page opened: download this scene's voice (with progress), then start explaining by itself. */
  async start() {
    const my = ++this.prep;
    const todo = voiceOn ? this.cues.filter((c) => !clips.has(c.say)) : [];
    if (todo.length) {
      let n = 0; this.set({ loading: 0 });
      await Promise.all(todo.map((c) => fetchClip(c.say).then(() => { if (my === this.prep) this.set({ loading: ++n / todo.length }); })));
    }
    if (my !== this.prep) return;
    this.set({ loading: null });
    if (autoOn && !this.state.playing) { this.finished = false; this.set({ idx: 0 }); this.play(); }
  }
  cancelStart() { this.prep++; if (this.state.loading !== null) this.set({ loading: null }); }

  play() {
    if (active && active !== this) active.pause();
    active = this;
    if (this.state.idx >= this.cues.length - 1 && !this.state.playing && this.state.speaking === false && this.finished) { this.finished = false; this.set({ idx: 0 }); }
    this.set({ playing: true, blocked: false });
    this.run();
  }
  finished = false;
  pause() { this.token++; clearTimeout(this.timer); stopSound(); this.set({ playing: false, speaking: false }); }
  goto(i: number) {
    const idx = Math.max(0, Math.min(this.cues.length - 1, i));
    const wasPlaying = this.state.playing;
    this.token++; clearTimeout(this.timer); stopSound();
    this.set({ idx, speaking: false });
    if (wasPlaying) this.run();
  }
  reset() { this.pause(); this.finished = false; this.set({ idx: 0 }); }

  private run() {
    const my = ++this.token;
    const cue = this.cues[this.state.idx];
    const done = () => {
      if (my !== this.token) return;
      this.set({ speaking: false });
      if (this.state.idx < this.cues.length - 1) {
        this.timer = window.setTimeout(() => { if (my === this.token) { this.set({ idx: this.state.idx + 1 }); this.run(); } }, 300 / rate);
      } else { this.finished = true; this.set({ playing: false }); }
    };
    this.set({ speaking: true });
    const browserVoice = () => {
      if (!('speechSynthesis' in window)) { this.timer = globalThis.setTimeout(done, Math.max(2600, cue.say.length * 55) / rate); return; }
      const u = new SpeechSynthesisUtterance(cue.say);
      const v = pickVoice(); if (v) u.voice = v;
      u.rate = 1.07 * rate; u.pitch = 1.12;
      u.onend = done; u.onerror = done;
      speechSynthesis.cancel(); speechSynthesis.speak(u);
    };
    // warm the next clip so there is no gap between sentences
    const next = this.cues[this.state.idx + 1];
    if (next && preloader && !clips.has(next.say)) { preloader.src = voiceFile(next.say); preloader.preload = 'auto'; }
    if (voiceOn && player) {
      player.onended = done;
      player.onerror = () => { if (my === this.token) browserVoice(); };
      player.src = clipUrl(cue.say);
      player.playbackRate = rate;
      player.play().catch((e: DOMException) => {
        if (my !== this.token) return;
        // The browser refuses sound until the reader has clicked once: wait for a tap instead of skipping ahead.
        if (e.name === 'NotAllowedError') { this.pause(); this.set({ blocked: true }); } else browserVoice();
      });
    } else {
      // Silent mode: hold each subtitle long enough to read it.
      this.timer = window.setTimeout(done, Math.max(2600, cue.say.length * 55) / rate);
    }
  }
}

export function getController(id: string, cues: Cue[]) {
  let c = controllers.get(id);
  if (!c) { c = new Controller(id, cues); controllers.set(id, c); }
  return c;
}
export function useScene(c: Controller) { return useSyncExternalStore(c.subscribe, c.get); }

/** Called by the book whenever the page turns. */
export function stopAllScenes() { controllers.forEach((c) => { c.cancelStart(); if (c.state.playing) c.pause(); }); }
/** Called by the book when a page becomes visible: loads it and starts the explanation. */
export function startScene(id: string) { controllers.get(id)?.start(); }

if (typeof window !== 'undefined' && 'speechSynthesis' in window) speechSynthesis.getVoices(); // warm up voice list

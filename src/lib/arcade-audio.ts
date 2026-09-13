import type { Voice } from "@/lib/roster";

let ctx: AudioContext | null = null;

function audio() {
  if (!ctx) ctx = new AudioContext();
  // Browsers start the context suspended until a gesture; every call is post-click.
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function toneAt(
  freq: number,
  dur: number,
  gain: number,
  wave: OscillatorType,
  at: number,
  dest?: AudioNode
) {
  const ac = audio();
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = wave;
  osc.frequency.setValueAtTime(freq, at);
  amp.gain.setValueAtTime(0, at);
  amp.gain.linearRampToValueAtTime(gain, at + 0.005);
  amp.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(amp).connect(dest ?? ac.destination);
  osc.start(at);
  osc.stop(at + dur + 0.02);
}

function tone(
  freq: number,
  dur: number,
  gain: number,
  wave: OscillatorType,
  delay = 0
) {
  toneAt(freq, dur, gain, wave, audio().currentTime + delay);
}

/** Typing blip in the speaker's own timbre. */
export function blip(v: Voice) {
  // Sawtooth and square carry far more energy than sine at the same gain.
  const gain = v.wave === "sawtooth" ? 0.02 : v.wave === "sine" ? 0.05 : 0.03;
  tone(v.freq * (0.94 + Math.random() * 0.16), v.dur, gain, v.wave);
}

/** Signature sting when a character is selected or starts a new line. */
export function sting(v: Voice) {
  v.sting.forEach((f, i) => tone(f, 0.1, 0.05, v.wave, i * 0.08));
}

export function thunk() {
  tone(180, 0.06, 0.05, "square");
}

/** Reel used by the randomiser while it cycles the roster. */
export function tick(step: number) {
  tone(320 + step * 45, 0.028, 0.035, "square");
}

/* ── Attract-mode theme ─────────────────────────────────────────
   A four-bar loop over C - G - Am - F, the progression every 80s
   sports game reached for. Lead in square, bass in triangle, and a
   click track built from two short tones rather than drum samples. */

const NOTE: Record<string, number> = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196, A3: 220,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392, A4: 440, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99,
};

// prettier-ignore
const LEAD = (
  "C5 . E5 . G5 E5 C5 . " +
  "B4 . D5 . G5 D5 B4 . " +
  "A4 . C5 . E5 C5 A4 . " +
  "F4 . A4 . C5 F5 E5 D5"
).split(" ");

// prettier-ignore
const BASS = (
  "C3 . G3 . C3 . G3 . " +
  "G3 . D3 . G3 . D3 . " +
  "A3 . E3 . A3 . E3 . " +
  "F3 . C3 . F3 . G3 ."
).split(" ");

const STEP = 0.2; // eighth note, ~150bpm
const LOOKAHEAD = 0.3;
const FULL = 0.5;
const DUCKED = 0.16;

let bus: GainNode | null = null;
let pump: number | null = null;
let want = false;
let armed = false;
let nextTime = 0;
let cursor = 0;
let level = FULL;

function schedule() {
  const ac = audio();
  const out = bus;
  if (!out) return;
  while (nextTime < ac.currentTime + LOOKAHEAD) {
    const i = cursor % LEAD.length;
    const lead = NOTE[LEAD[i]];
    if (lead) toneAt(lead, STEP * 1.5, 0.05, "square", nextTime, out);
    const low = NOTE[BASS[i]];
    if (low) toneAt(low, STEP * 1.8, 0.075, "triangle", nextTime, out);
    if (i % 4 === 0) toneAt(72, 0.09, 0.09, "square", nextTime, out);
    else if (i % 2 === 1) toneAt(2100, 0.018, 0.014, "square", nextTime, out);
    nextTime += STEP;
    cursor++;
  }
}

function run() {
  const ac = audio();
  if (!want || pump !== null) return;

  // Autoplay is blocked until the page has been interacted with, so arm a
  // one-shot listener and let the first click or keypress start the music.
  if (ac.state !== "running") {
    void ac.resume().then(run, () => {});
    if (!armed) {
      armed = true;
      const kick = () => {
        armed = false;
        void audio().resume().then(run, () => {});
      };
      for (const ev of ["pointerdown", "keydown", "touchstart"] as const) {
        window.addEventListener(ev, kick, { once: true });
      }
    }
    return;
  }

  bus = ac.createGain();
  bus.gain.setValueAtTime(level, ac.currentTime);
  bus.connect(ac.destination);
  nextTime = ac.currentTime + 0.08;
  schedule();
  pump = window.setInterval(schedule, 45);
}

export function startTheme() {
  want = true;
  run();
}

export function stopTheme() {
  want = false;
  if (pump !== null) {
    clearInterval(pump);
    pump = null;
  }
  if (bus && ctx) {
    const t = ctx.currentTime;
    // Ramp instead of cutting; an abrupt disconnect clicks through the speakers.
    bus.gain.cancelScheduledValues(t);
    bus.gain.setValueAtTime(bus.gain.value, t);
    bus.gain.linearRampToValueAtTime(0, t + 0.12);
    const dying = bus;
    setTimeout(() => dying.disconnect(), 400);
    bus = null;
  }
  cursor = 0;
}

/** Pull the theme back under dialogue so the typing blips stay legible. */
export function duckTheme(quiet: boolean) {
  level = quiet ? DUCKED : FULL;
  if (!bus || !ctx) return;
  const t = ctx.currentTime;
  bus.gain.cancelScheduledValues(t);
  bus.gain.setValueAtTime(bus.gain.value, t);
  bus.gain.linearRampToValueAtTime(level, t + 0.35);
}

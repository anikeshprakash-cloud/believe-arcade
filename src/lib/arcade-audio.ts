import type { Voice } from "@/lib/roster";

let ctx: AudioContext | null = null;

function audio() {
  if (!ctx) ctx = new AudioContext();
  // Browsers start the context suspended until a gesture; every call is post-click.
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(
  freq: number,
  dur: number,
  gain: number,
  wave: OscillatorType,
  delay = 0
) {
  const ac = audio();
  const t0 = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = wave;
  osc.frequency.setValueAtTime(freq, t0);
  amp.gain.setValueAtTime(0, t0);
  amp.gain.linearRampToValueAtTime(gain, t0 + 0.005);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(amp).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
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

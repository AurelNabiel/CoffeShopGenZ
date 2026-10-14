/**
 * Lo-fi cozy BGM generator — dibuat langsung di browser dengan Web Audio API.
 * Tidak butuh file audio, tidak ada masalah lisensi.
 *
 * Isi: progresi Fmaj9 → Em7 → Dm9 → Cmaj9 di 72 BPM, electric piano hangat,
 * bass lembut, drum brush pelan dengan swing, melodi pentatonik acak + delay,
 * reverb, dan suara kresek piringan hitam.
 */

export interface BgmEngine {
  start(): Promise<void>;
  setMuted(muted: boolean): void;
  suspend(): void;
  resume(): void;
  dispose(): void;
}

const hz = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

const CHORDS = [
  { root: 41, notes: [53, 57, 60, 64, 67] }, // Fmaj9
  { root: 40, notes: [52, 55, 59, 62] },     // Em7
  { root: 38, notes: [50, 53, 57, 60, 64] }, // Dm9
  { root: 36, notes: [48, 52, 55, 59, 62] }, // Cmaj9
];
const PENTA = [72, 74, 76, 79, 81, 84];
const BPM = 72;
const VOLUME = 0.55;

export function createLofiEngine(): BgmEngine {
  const AC: typeof AudioContext =
    window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AC();

  // ---- routing: sumber → bus → lowpass (hangat) → compressor → master → speaker
  const master = ctx.createGain();
  master.gain.value = 0;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18;
  comp.ratio.value = 3;
  const warm = ctx.createBiquadFilter();
  warm.type = "lowpass";
  warm.frequency.value = 3200;
  warm.Q.value = 0.4;
  const bus = ctx.createGain();
  bus.connect(warm).connect(comp).connect(master).connect(ctx.destination);

  // reverb dari impulse buatan
  const reverb = ctx.createConvolver();
  reverb.buffer = makeImpulse(ctx, 2.8);
  const reverbOut = ctx.createGain();
  reverbOut.gain.value = 0.32;
  reverb.connect(reverbOut).connect(bus);

  // delay untuk melodi
  const step = 60 / BPM / 4;
  const delay = ctx.createDelay(2);
  delay.delayTime.value = step * 3;
  const fb = ctx.createGain();
  fb.gain.value = 0.32;
  const delayOut = ctx.createGain();
  delayOut.gain.value = 0.28;
  delay.connect(fb).connect(delay);
  delay.connect(delayOut).connect(bus);

  // efek "wow" pita kaset: LFO pelan ke detune
  const wow = ctx.createOscillator();
  wow.frequency.value = 0.33;
  const wowDepth = ctx.createGain();
  wowDepth.gain.value = 7;
  wow.connect(wowDepth);
  wow.start();

  const noise = makeNoise(ctx, 2);

  // kresek vinyl
  const crackleSrc = ctx.createBufferSource();
  crackleSrc.buffer = makeCrackle(ctx, 5);
  crackleSrc.loop = true;
  const crackleHp = ctx.createBiquadFilter();
  crackleHp.type = "highpass";
  crackleHp.frequency.value = 900;
  const crackleGain = ctx.createGain();
  crackleGain.gain.value = 0.06;
  crackleSrc.connect(crackleHp).connect(crackleGain).connect(bus);

  // ---- instrumen
  function piano(m: number, t: number, vel: number, dur: number) {
    const f = hz(m);
    const g = ctx.createGain();
    const peak = 0.055 * vel;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.015);
    g.gain.exponentialRampToValueAtTime(peak * 0.35, t + 1.1);
    g.gain.setTargetAtTime(0.0001, t + dur, 0.35);
    const o1 = ctx.createOscillator();
    o1.type = "triangle";
    o1.frequency.value = f;
    const o2 = ctx.createOscillator();
    o2.type = "sine";
    o2.frequency.value = f * 2;
    const g2 = ctx.createGain();
    g2.gain.value = 0.18;
    wowDepth.connect(o1.detune);
    wowDepth.connect(o2.detune);
    o1.connect(g);
    o2.connect(g2).connect(g);
    g.connect(bus);
    const send = ctx.createGain();
    send.gain.value = 0.45;
    g.connect(send).connect(reverb);
    const end = t + dur + 2;
    o1.start(t); o2.start(t);
    o1.stop(end); o2.stop(end);
    o1.onended = () => { wowDepth.disconnect(o1.detune); wowDepth.disconnect(o2.detune); g.disconnect(); };
  }

  function bass(m: number, t: number, dur: number) {
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = hz(m);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.06, t + dur * 0.8);
    g.gain.setTargetAtTime(0.0001, t + dur, 0.1);
    o.connect(g).connect(bus);
    o.start(t);
    o.stop(t + dur + 0.6);
  }

  function kick(t: number, vel = 1) {
    const o = ctx.createOscillator();
    o.frequency.setValueAtTime(115, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.13);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.42 * vel, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
    o.connect(g).connect(bus);
    o.start(t);
    o.stop(t + 0.4);
  }

  function noiseHit(t: number, type: BiquadFilterType, freq: number, level: number, decay: number, wet = 0) {
    const s = ctx.createBufferSource();
    s.buffer = noise;
    s.playbackRate.value = 0.9 + Math.random() * 0.2;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = 0.7;
    const g = ctx.createGain();
    g.gain.setValueAtTime(level, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    s.connect(f).connect(g).connect(bus);
    if (wet) {
      const send = ctx.createGain();
      send.gain.value = wet;
      g.connect(send).connect(reverb);
    }
    s.start(t, Math.random() * 1.5);
    s.stop(t + decay + 0.05);
  }

  function lead(m: number, t: number) {
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = hz(m);
    wowDepth.connect(o.detune);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.045, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
    o.connect(g);
    g.connect(bus);
    g.connect(delay);
    const send = ctx.createGain();
    send.gain.value = 0.6;
    g.connect(send).connect(reverb);
    o.start(t);
    o.stop(t + 1.5);
    o.onended = () => wowDepth.disconnect(o.detune);
  }

  // ---- sequencer (lookahead scheduler)
  let stepIdx = 0;
  let nextTime = 0;
  let timer: ReturnType<typeof setInterval> | null = null;
  let lastLead = 0;

  function schedule(s: number, base: number) {
    const bar = Math.floor(s / 16);
    const pos = s % 16;
    const swing = pos % 4 === 2 ? step * 0.3 : 0;
    const t = base + swing;
    const chord = CHORDS[bar % CHORDS.length];
    const breakdown = bar % 16 >= 14; // tiap 16 bar, 2 bar tanpa drum
    const barDur = step * 16;

    if (pos === 0) {
      chord.notes.forEach((n, i) => piano(n, t + i * 0.014, 0.9 - i * 0.06, barDur * 0.9));
      bass(chord.root, t, step * 7);
    }
    if (pos === 8 && Math.random() < 0.55) {
      chord.notes.slice(-3).forEach((n, i) => piano(n, t + i * 0.012, 0.45, step * 7));
    }
    if (pos === 10) bass(chord.root + 7, t, step * 5);

    if (!breakdown) {
      if (pos === 0) kick(t, 1);
      if (pos === 10) kick(t, 0.7);
      if (pos === 4 || pos === 12) noiseHit(t, "bandpass", 1900, 0.11, 0.2, 0.25);
      if (pos % 2 === 0 && Math.random() > 0.12) noiseHit(t, "highpass", 7500, pos % 4 === 0 ? 0.03 : 0.018, 0.05);
    }

    if ((pos === 2 || pos === 6 || pos === 10 || pos === 14) && bar % 2 === 1 && Math.random() < 0.4 && s - lastLead > 3) {
      lead(PENTA[Math.floor(Math.random() * PENTA.length)], t);
      lastLead = s;
    }
  }

  function tick() {
    while (nextTime < ctx.currentTime + 0.15) {
      schedule(stepIdx, nextTime);
      nextTime += step;
      stepIdx++;
    }
  }

  let started = false;

  return {
    async start() {
      if (started) return this.setMuted(false);
      started = true;
      await ctx.resume();
      crackleSrc.start();
      nextTime = ctx.currentTime + 0.1;
      timer = setInterval(tick, 25);
      master.gain.setTargetAtTime(VOLUME, ctx.currentTime, 1.2);
    },
    setMuted(muted: boolean) {
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      if (muted) {
        master.gain.setTargetAtTime(0, now, 0.15);
        setTimeout(() => { if (master.gain.value < 0.01) ctx.suspend(); }, 900);
      } else {
        ctx.resume();
        master.gain.setTargetAtTime(VOLUME, now, 0.6);
      }
    },
    suspend() { ctx.suspend(); },
    resume() { ctx.resume(); },
    dispose() {
      if (timer) clearInterval(timer);
      ctx.close();
    },
  };
}

/** Pemutar untuk file audio sendiri (public/bgm.mp3), dengan fade in/out. */
export function createFileEngine(src: string): BgmEngine {
  const audio = new Audio(src);
  audio.loop = true;
  audio.volume = 0;
  let raf = 0;
  const fadeTo = (target: number, ms: number, done?: () => void) => {
    cancelAnimationFrame(raf);
    const from = audio.volume, t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / ms);
      audio.volume = from + (target - from) * k;
      if (k < 1) raf = requestAnimationFrame(step);
      else done?.();
    };
    raf = requestAnimationFrame(step);
  };
  return {
    async start() { await audio.play(); fadeTo(VOLUME, 1500); },
    setMuted(m) {
      if (m) fadeTo(0, 400, () => audio.pause());
      else { audio.play(); fadeTo(VOLUME, 800); }
    },
    suspend() { audio.pause(); },
    resume() { audio.play(); },
    dispose() { cancelAnimationFrame(raf); audio.pause(); audio.src = ""; },
  };
}

// ---- buffer helpers
function makeNoise(ctx: BaseAudioContext, sec: number) {
  const b = ctx.createBuffer(1, ctx.sampleRate * sec, ctx.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return b;
}

function makeCrackle(ctx: BaseAudioContext, sec: number) {
  const b = ctx.createBuffer(1, ctx.sampleRate * sec, ctx.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) {
    let v = (Math.random() * 2 - 1) * 0.04; // desis halus
    if (Math.random() < 0.0004) v += (Math.random() * 2 - 1) * 0.9; // klik
    d[i] = v;
  }
  return b;
}

function makeImpulse(ctx: BaseAudioContext, sec: number) {
  const len = ctx.sampleRate * sec;
  const b = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = b.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  }
  return b;
}

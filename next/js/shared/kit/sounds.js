/*
 * Sounds by name. Some are recordings, some are made of a few notes; both are listed in the kit's settings, so no
 * sound's file or recipe is written here. A sound never masks a voice: under a voice a sound the child made plays
 * quieter, a short tick quieter still, and anything else is dropped. Nothing sounds before the child's first tap.
 *
 *   const sounds = createSounds({ kit, say })
 *   sounds.ready(names)     sounds.play(name, { under?, volume? })     sounds.loop(name, on)
 *   sounds.simmer(heat, k, bubbleAt)    the boil's loop: louder as the hottest vessel heats (-1: none heating)
 */
export function createSounds({ kit, say }) {
  const Q = kit.sounds.ramp;
  const S = kit.sounds;
  let ctx = null;
  const buffers = new Map();
  const loops = new Map();
  const wake = () => {
    if (!ctx) {
      const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state === "suspended") ctx.resume();
  };
  globalThis.addEventListener("pointerdown", wake, { capture: true });

  async function fetchBuffer(name) {
    const f = S.files[name];
    if (!ctx || !f || buffers.has(f.file)) return;
    buffers.set(f.file, null);
    try {
      const data = await (await fetch(f.file)).arrayBuffer();
      buffers.set(f.file, await ctx.decodeAudioData(data));
    } catch (e) {
      buffers.delete(f.file);
    }
  }

  /** How loud a sound may be right now: full when nobody is speaking; under a voice only the child's own sounds and ticks. */
  function gate(name, under) {
    if (!say.busy()) return 1;
    if (under) return S.under;
    const notes = S.synth[name];
    if (notes && Math.max(...notes.map((n) => n[3] + n[5])) <= S.tickMs) return S.tick;
    return 0;
  }

  function note([wave, from, to, ms, loud, at], volume) {
    const t0 = ctx.currentTime + at / 1000;
    const end = t0 + ms / 1000;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = wave;
    o.frequency.setValueAtTime(from, t0);
    if (to !== from) o.frequency.exponentialRampToValueAtTime(to, end);
    g.gain.setValueAtTime(Q.floor, t0);
    g.gain.exponentialRampToValueAtTime(loud * S.master * volume, t0 + Q.attack);
    g.gain.exponentialRampToValueAtTime(Q.floor, end);
    o.connect(g).connect(ctx.destination);
    o.start(t0);
    o.stop(end + Q.tail);
  }
  function hiss([ms, band, q, loud, at], volume) {
    const t0 = ctx.currentTime + at / 1000;
    const len = Math.ceil((ctx.sampleRate * ms) / 1000);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.sin(i * 12.9898 + (i % 97) * 78.233) * 43758.5453 % 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = band;
    f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(Q.floor, t0);
    g.gain.exponentialRampToValueAtTime(loud * S.master * volume, t0 + Q.noiseAttack);
    g.gain.exponentialRampToValueAtTime(Q.floor, t0 + ms / 1000);
    src.connect(f).connect(g).connect(ctx.destination);
    src.start(t0);
  }

  function startLoop(name) {
    const f = S.files[name];
    const buf = f && buffers.get(f.file);
    if (!ctx || !buf) return null;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    [src.loopStart, src.loopEnd] = f.loop;
    const g = ctx.createGain();
    g.gain.value = Q.floor;
    src.connect(g).connect(ctx.destination);
    src.start(0, f.loop[0]);
    const l = { src, g };
    loops.set(name, l);
    return l;
  }
  function stopLoop(name) {
    const l = loops.get(name);
    if (!l) return;
    loops.delete(name);
    l.g.gain.setTargetAtTime(Q.floor, ctx.currentTime, Q.loopFade);
    l.src.stop(ctx.currentTime + Q.loopStop);
  }

  return {
    ready(names) {
      wake();
      names.forEach(fetchBuffer);
    },
    play(name, { under = false, volume = 1 } = {}) {
      if (!ctx || ctx.state !== "running") return;
      const v = gate(name, under) * volume;
      if (!v) return;
      if (S.synth[name]) S.synth[name].forEach((n) => note(n, v));
      if (S.noise[name]) S.noise[name].forEach((n) => hiss(n, v));
      const f = S.files[name];
      const buf = f && buffers.get(f.file);
      if (!f) return;
      if (!buf) return void fetchBuffer(name); // not in yet: skipped, never played late
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const g = ctx.createGain();
      g.gain.value = v;
      src.connect(g).connect(ctx.destination);
      src.start();
      if (f.cut) {
        const end = ctx.currentTime + f.cut / 1000;
        g.gain.setValueAtTime(v, end - f.fade / 1000);
        g.gain.linearRampToValueAtTime(Q.floor, end);
        src.stop(end);
      }
    },
    loop(name, on) {
      if (!ctx || ctx.state !== "running") return;
      if (!on) return stopLoop(name);
      const l = loops.get(name) || startLoop(name);
      if (l) l.g.gain.setTargetAtTime(say.busy() ? Q.floor : 1, ctx.currentTime, Q.duck);
    },
    /** The boil rises in loudness only, evenly in dB, with no join heard; it is silent under a voice. */
    simmer(heat, k, bubbling) {
      if (!ctx || ctx.state !== "running") return;
      if (heat < 0) return stopLoop("simmer");
      const l = loops.get("simmer") || startLoop("simmer");
      if (!l) return;
      const m = S.simmer;
      const db = heat <= bubbling ? m.cold + ((m.bubbling - m.cold) * heat) / bubbling : heat <= k.hi ? m.bubbling : m.bubbling + ((m.over - m.bubbling) * (heat - k.hi)) / (1 - k.hi);
      l.g.gain.setTargetAtTime(say.busy() ? Q.floor : 10 ** (db / 20), ctx.currentTime, Q.simmerDuck);
    },
    stopAll() {
      [...loops.keys()].forEach(stopLoop);
    },
  };
}

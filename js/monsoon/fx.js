/*
 * Monsoon rush: sound effects (a small Web Audio synth, no files).
 * Everything is MONO and the same on every pot (design loop 1: stereo drip
 * sounds were a leak). The rain bed runs under the whole storm; a creak
 * starts every wave's shared countdown; the reveal's sounds (plink off a
 * lid, plop into the food) only play at the landing.
 * Silent under ?clock=virtual (tests) and ?mute=1.
 */
(function (global) {
  const M = global.Monsoon;
  const FX = (M.FX = {});
  let ctx = null;
  let out = null;
  let rainNode = null;

  function ac() {
    if (M.muted) return null;
    if (!ctx) {
      ctx = M.clock.ctx || (M.clock.unlock && M.clock.unlock()) || null;
      if (!ctx) return null;
      out = ctx.createGain();
      out.gain.value = 0.45;
      out.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function tone(freq, dur, { type = "sine", gain = 0.3, slide = 0, when = 0 } = {}) {
    const c = ac();
    if (!c) return;
    const t = c.currentTime + when;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    o.connect(g).connect(out);
    o.start(t);
    o.stop(t + dur + 0.02);
  }
  function noise(dur, { gain = 0.2, freq = 1500, q = 0.8, when = 0 } = {}) {
    const c = ac();
    if (!c) return;
    const t = c.currentTime + when;
    const n = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, n, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const s = c.createBufferSource();
    s.buffer = buf;
    const f = c.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = freq;
    f.Q.value = q;
    const g = c.createGain();
    g.gain.value = gain;
    s.connect(f).connect(g).connect(out);
    s.start(t);
  }

  FX.plink = () => tone(1760, 0.25, { type: "triangle", gain: 0.22, slide: -300 }); // off a lid: saved
  FX.plop = () => {
    tone(320, 0.18, { gain: 0.28, slide: 380 }); // into the pot
    noise(0.15, { gain: 0.12, freq: 900 });
  };
  FX.clink = () => tone(980, 0.12, { type: "square", gain: 0.06 });
  FX.creak = () => tone(140, 0.5, { type: "sawtooth", gain: 0.04, slide: 40 });
  FX.drip = () => tone(1300, 0.08, { type: "sine", gain: 0.12, slide: -500 });
  FX.pop = () => tone(660, 0.1, { type: "sine", gain: 0.15, slide: 200 });
  FX.star = () => {
    tone(880, 0.18, { type: "triangle", gain: 0.14 });
    tone(1320, 0.25, { type: "triangle", gain: 0.12, when: 0.1 });
  };

  /** The rain bed: soft filtered noise under the whole storm. */
  FX.rain = function (on) {
    const c = ac();
    if (!c) return;
    if (!on) {
      if (rainNode) {
        try {
          rainNode.g.gain.setTargetAtTime(0, c.currentTime, 0.4);
          const n = rainNode;
          setTimeout(() => n.s.stop(), 1500);
        } catch (e) {}
      }
      rainNode = null;
      return;
    }
    if (rainNode) return;
    const len = c.sampleRate * 2;
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const s = c.createBufferSource();
    s.buffer = buf;
    s.loop = true;
    const f = c.createBiquadFilter();
    f.type = "highpass";
    f.frequency.value = 2500;
    const g = c.createGain();
    g.gain.value = 0;
    g.gain.setTargetAtTime(0.05, c.currentTime, 0.8);
    s.connect(f).connect(g).connect(out);
    s.start();
    rainNode = { s, g };
  };
})(window);

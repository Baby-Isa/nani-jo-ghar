/*
 * Small synthesised sounds for the shared UI (no audio files): Web Audio
 * oscillators with soft envelopes, kept quiet and warm.
 *
 *   Sfx.play(name, {volume, delay})   "bing" (a new best), "gold" (all right: a rising
 *                                     chime), "right" (a slot fills), "wrong" (a soft low
 *                                     thud), "tap", "whoosh" (a page turns), "pop" (a UI
 *                                     piece fades in)
 *   Sfx.unlock()                      call inside a tap (iOS) if the page has no other audio
 *   Sfx.muted = true                  silence everything (a grown-up's setting)
 *
 * Every call is safe without Web Audio (Node, old browsers): it does nothing.
 * Plain <script>: window.Sfx (and Shared.sfx); Node: require().
 */
(function (root, factory) {
  const Sfx = factory(root);
  if (typeof module === "object" && module.exports) module.exports = Sfx;
  else {
    root.Sfx = Sfx;
    (root.Shared = root.Shared || {}).sfx = Sfx;
  }
})(typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const Sfx = { muted: false, volume: 0.5 };
  let ctx = null;
  const ac = () => {
    if (ctx) return ctx;
    const AC = root && (root.AudioContext || root.webkitAudioContext);
    if (!AC) return null;
    try {
      ctx = new AC();
    } catch (e) {
      ctx = null;
    }
    return ctx;
  };
  Sfx.unlock = () => {
    const c = ac();
    if (c && c.state === "suspended") c.resume().catch(() => {});
  };

  // one note: type, frequency (Hz), start (s from now), length (s), peak gain
  function note(c, out, { type = "sine", f, t = 0, len = 0.3, gain = 0.3, slideTo }) {
    const o = c.createOscillator();
    const g = c.createGain();
    const at = c.currentTime + t;
    o.type = type;
    o.frequency.setValueAtTime(f, at);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, at + len);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(gain, at + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, at + len);
    o.connect(g).connect(out);
    o.start(at);
    o.stop(at + len + 0.05);
  }
  const SOUNDS = {
    // a bell: a bright fundamental and its octave, long tail
    bing: (c, o) => {
      note(c, o, { f: 1318.5, len: 1.1, gain: 0.32 });
      note(c, o, { f: 2637, len: 0.7, gain: 0.1 });
      note(c, o, { f: 1975.5, t: 0.09, len: 0.9, gain: 0.12 });
    },
    // C E G C, then a shimmer
    gold: (c, o) => {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => note(c, o, { type: "triangle", f, t: i * 0.1, len: 0.55, gain: 0.26 }));
      note(c, o, { f: 2093, t: 0.42, len: 0.9, gain: 0.08 });
      note(c, o, { f: 1568, t: 0.46, len: 0.9, gain: 0.08 });
    },
    right: (c, o) => note(c, o, { type: "triangle", f: 880, len: 0.16, gain: 0.18, slideTo: 990 }),
    wrong: (c, o) => note(c, o, { type: "sine", f: 196, len: 0.22, gain: 0.2, slideTo: 150 }),
    tap: (c, o) => note(c, o, { type: "triangle", f: 660, len: 0.08, gain: 0.14 }),
    whoosh: (c, o) => note(c, o, { type: "sine", f: 300, len: 0.25, gain: 0.08, slideTo: 700 }),
    pop: (c, o) => note(c, o, { type: "sine", f: 520, len: 0.12, gain: 0.14, slideTo: 780 }),
  };
  Sfx.names = Object.keys(SOUNDS);
  Sfx.play = function (name, opts) {
    opts = opts || {};
    if (Sfx.muted || !SOUNDS[name]) return false;
    const c = ac();
    if (!c) return false;
    if (c.state === "suspended") c.resume().catch(() => {});
    const run = () => {
      try {
        const out = c.createGain();
        out.gain.value = (opts.volume != null ? opts.volume : 1) * Sfx.volume;
        out.connect(c.destination);
        SOUNDS[name](c, out);
      } catch (e) { /* never break the game for a sound */ }
    };
    if (opts.delay) setTimeout(run, opts.delay);
    else run();
    return true;
  };
  return Sfx;
});

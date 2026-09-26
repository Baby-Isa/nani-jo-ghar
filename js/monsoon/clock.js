/*
 * Monsoon rush: the clock (design doc section 8.1, build brief task 1).
 *
 * Every call, reveal and landing is on ONE clock, in seconds. In the
 * browser that is the audio clock (AudioContext.currentTime), so a phone's
 * audio latency never moves a reveal relative to Nani's voice. Tests and
 * the Node leak bot use the VirtualClock instead: time only moves when
 * advance(dt) is called, so headless runs (6–11 fps WebGL) grade exactly
 * as a real player at 60 fps would be graded (`?clock=virtual`).
 *
 *   clock.now()            seconds
 *   clock.at(t, fn)        run fn once now() >= t; returns an id for cancel()
 *   clock.until(t)         a promise that resolves at t
 *   clock.cancel(id)
 *   VirtualClock#advance(dt)  (tests) move time on, firing what's due in order
 *
 * The UMD shape is js/shared/speech.js's: require() in Node, Monsoon.Clock
 * in the browser.
 */
(function (root, factory) {
  const Clock = factory();
  if (typeof module === "object" && module.exports) module.exports = Clock;
  else {
    root.Monsoon = root.Monsoon || {};
    root.Monsoon.Clock = Clock;
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /** The part both clocks share: a time-ordered list of pending callbacks. */
  class Scheduler {
    constructor() {
      this.q = [];
      this.seq = 0;
    }
    at(t, fn) {
      const id = ++this.seq;
      this.q.push({ t, fn, id });
      this.q.sort((a, b) => a.t - b.t || a.id - b.id);
      this.kick && this.kick();
      return id;
    }
    cancel(id) {
      this.q = this.q.filter((e) => e.id !== id);
    }
    clear() {
      this.q = [];
    }
    until(t) {
      return new Promise((resolve) => this.at(t, resolve));
    }
    /** Fire everything due at or before now(), in time order. */
    flush() {
      const now = this.now();
      while (this.q.length && this.q[0].t <= now + 1e-9) {
        const e = this.q.shift();
        try {
          e.fn(e.t);
        } catch (err) {
          if (typeof console !== "undefined") console.error(err);
        }
      }
    }
  }

  /** Deterministic time for tests and the Node bots. */
  class VirtualClock extends Scheduler {
    constructor(t0) {
      super();
      this.t = t0 || 0;
      this.virtual = true;
    }
    now() {
      return this.t;
    }
    /** Move on by dt seconds, firing callbacks at their own times, in order. */
    advance(dt) {
      const end = this.t + Math.max(0, dt);
      while (this.q.length && this.q[0].t <= end) {
        this.t = Math.max(this.t, this.q[0].t);
        this.flush();
      }
      this.t = end;
      this.flush();
      return this.t;
    }
  }

  /**
   * The browser's clock: AudioContext.currentTime once audio is unlocked
   * (a tap), performance.now() before that. A requestAnimationFrame loop
   * (plus a coarse timer, for background tabs) fires what's due.
   */
  class AudioClock extends Scheduler {
    constructor() {
      super();
      this.ctx = null;
      this.offset = 0; // keeps now() continuous when the audio clock takes over
      this.running = false;
      this.kick = () => this.start();
    }
    unlock() {
      if (this.ctx) {
        if (this.ctx.state === "suspended") this.ctx.resume();
        return this.ctx;
      }
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        const before = this.now();
        this.ctx = new AC();
        if (this.ctx.state === "suspended") this.ctx.resume();
        this.offset = before - this.ctx.currentTime;
      } catch (e) {
        this.ctx = null;
      }
      return this.ctx;
    }
    now() {
      if (this.ctx && this.ctx.state === "running") return this.ctx.currentTime + this.offset;
      return (typeof performance !== "undefined" ? performance.now() : Date.now()) / 1000;
    }
    start() {
      if (this.running || typeof window === "undefined") return;
      this.running = true;
      const loop = () => {
        this.flush();
        if (this.q.length) window.requestAnimationFrame(loop);
        else this.running = false;
      };
      window.requestAnimationFrame(loop);
      // rAF stops in a background tab; this keeps a storm moving (coarsely)
      if (!this.timer) this.timer = setInterval(() => this.flush(), 100);
    }
  }

  return { Scheduler, VirtualClock, AudioClock };
});

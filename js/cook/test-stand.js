/*
 * The stand-still switch (Sprint 20 P4, TEST ONLY): the same order every time and the game stopped at a named moment, so the box
 * reader (build/tools/review/boxes.mjs) reads exact boxes from a game that stands still. No page loads this file: only the box
 * reader injects it (Playwright addInitScript), after setting window.__njgStandArm. It does nothing without that arm, and nothing
 * at all in a store build (window.NJG_BUILD === "store"). It changes no game file and no game state; it only holds the page's clock.
 *
 *   window.__njgStandArm = { seed, settle, sig(), moments: [{ name, when(S), note, wait(S), after }] }   set by the harness first
 *                        (note: the moment is the Lifecycle writing that note ("*": any note, the first with when(S) true; "dom":
 *                        the page changing): from that breath the game's timers wait, so no next step and no help on a timer comes,
 *                        while the motion under way comes to rest; then the whole game is held)
 *                        (wait: while it holds, the play bot holds its tap too: the moment is coming)
 *                        (after: the least time, game ms, the condition holds before the game is held: a light that fades in)
 *   njgStand.reached()   the moment the game is standing still at ({name, t, frames}), or null
 *   njgStand.go()        let the game run on (to the next moment)
 *   njgStand.reseed()    the dice back to the seed (the harness calls it in the same breath as the round's start)
 *   njgStand.pending()   the moments not reached yet ({name, on, same, lost: how often the condition came and went unreached,
 *                        changes, prev, last: its last two different readings, so the tool can say what kept moving})
 *   njgStand.busy()      held, or a moment's condition holds and the game is settling into it (the play bot waits: never a tap then)
 *   njgStand.life(what)  whether the shared Lifecycle log has said `what` (a moment's condition reads it)
 *
 * The dice: Math.random is a fixed-seed generator (mulberry32, as the sandbox's own), started again from the seed when the round
 * starts (njgStand.reseed(), the harness, with the lab's call) and at each stage's start, so the order, the decoys and the faces are
 * the same every run. The clock: while held, Date.now and performance.now stand still, timers that fall due wait and run on release with
 * their remaining time, animation frames wait, the page's CSS and web animations are paused, sound contexts are suspended and media
 * paused. On release the clock goes on from where it stood (the time held never happened, for the game).
 * A moment is reached when its condition holds, no animation that ends is still running (a fade, a slide), and the page's boxes
 * (the harness's sig(), the reader's own numbers) have been the same for `settle` animation frames in a row: then the game is held
 * in that same frame, before anything else runs.
 */
(function () {
  "use strict";
  var W = window;
  if (W.NJG_BUILD === "store") return; // never in a store build
  var ARM = W.__njgStandArm;
  if (!ARM || W.njgStand) return; // never outside the test harness
  // ---- the dice ----
  var seed = (ARM.seed >>> 0) || 7;
  Math.random = function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  // the dice start again from the seed at each fixed point of the round (the lab's start, each stage's start: Lifecycle.stageStart),
  // so a draw made at one (chai's decoys at the station's start) never depends on how many frames an animation drew from it before
  var base = seed;
  var reseeds = 0;
  function reseed() { reseeds++; seed = (base ^ Math.imul(reseeds, 0x9e3779b1)) >>> 0; }
  // (and the shared Lifecycle's log, entry by entry as it is written: a moment can come at a note, in the same breath)
  var lc;
  var onLife = function () {};
  try {
    Object.defineProperty(W, "Lifecycle", {
      configurable: true,
      get: function () { return lc; },
      set: function (v) {
        lc = v;
        if (v && typeof v.stageStart === "function" && !v.__standSeeded) {
          var start = v.stageStart;
          v.stageStart = function () { reseed(); return start.apply(this, arguments); };
          v.__standSeeded = true;
        }
        if (v && v.log && typeof v.log.push === "function" && !v.log.__stand) {
          var push = v.log.push;
          v.log.push = function (e) { var r = push.apply(this, arguments); try { onLife(e); } catch (x) { /* a log only */ } return r; };
          v.log.__stand = true;
        }
      },
    });
  } catch (e) { /* defined already: the lab's start still reseeds */ }
  // ---- the clock ----
  var realDateNow = Date.now.bind(Date);
  var realPerfNow = performance.now.bind(performance);
  var realSetTimeout = W.setTimeout.bind(W);
  var realClearTimeout = W.clearTimeout.bind(W);
  var realSetInterval = W.setInterval.bind(W);
  var realRaf = W.requestAnimationFrame.bind(W);
  var realCancelRaf = W.cancelAnimationFrame.bind(W);
  var held = false;
  var stilling = false; // a moment at a note: the game's timers wait (no next step, no help on a timer) while its motion comes to rest
  var heldAt = 0; // real performance.now() when held
  var offset = 0; // ms held so far (the game never saw them)
  var vPerf = function () { return (held ? heldAt : realPerfNow()) - offset; };
  var dateBase = realDateNow() - realPerfNow();
  Date.now = function () { return Math.round(dateBase + vPerf()); };
  performance.now = vPerf;
  // timeouts: a stable id (the first real id); one that falls due while held waits, and on release runs after what was left of it
  var timers = new Map(); // id -> {real, fn, due}
  W.setTimeout = function (fn, ms) {
    var args = Array.prototype.slice.call(arguments, 2);
    var rec = { fn: fn, args: args, due: vPerf() + Math.max(0, +ms || 0), real: 0, id: 0 };
    var fire = function () {
      if (held || stilling) { rec.waiting = true; return; }
      timers.delete(rec.id);
      if (typeof rec.fn === "function") rec.fn.apply(W, rec.args);
      else if (typeof rec.fn === "string") (0, eval)(rec.fn);
    };
    rec.fire = fire;
    rec.real = realSetTimeout(fire, Math.max(0, +ms || 0));
    rec.id = rec.real;
    timers.set(rec.id, rec);
    return rec.id;
  };
  W.clearTimeout = function (id) {
    var rec = timers.get(id);
    if (rec) { timers.delete(id); realClearTimeout(rec.real); }
    else realClearTimeout(id);
  };
  // intervals: a tick that falls while held is skipped (they are samplers and pollers)
  W.setInterval = function (fn, ms) {
    var args = Array.prototype.slice.call(arguments, 2);
    return realSetInterval(function () { if (!held && !stilling && typeof fn === "function") fn.apply(W, args); }, ms);
  };
  // animation frames: the time they are given is the game's (held time taken out); held, they wait for the release
  var frames = new Map(); // id -> {cb, real}
  var nextFrame = 1;
  var askFrame = function (id) {
    var f = frames.get(id);
    if (!f) return;
    f.real = realRaf(function (ts) {
      if (!frames.has(id)) return;
      if (held) { f.waiting = true; return; }
      frames.delete(id);
      f.cb(ts - offset);
    });
  };
  W.requestAnimationFrame = function (cb) {
    var id = nextFrame++;
    frames.set(id, { cb: cb, real: 0 });
    askFrame(id);
    return id;
  };
  W.cancelAnimationFrame = function (id) {
    var f = frames.get(id);
    if (f) { frames.delete(id); realCancelRaf(f.real); }
  };
  // sound: every context the page makes, so a hold can suspend it
  var contexts = [];
  ["AudioContext", "webkitAudioContext"].forEach(function (k) {
    var C = W[k];
    if (!C) return;
    var Wrapped = function () {
      var c = new (Function.prototype.bind.apply(C, [null].concat(Array.prototype.slice.call(arguments))))();
      contexts.push(c);
      return c;
    };
    Wrapped.prototype = C.prototype;
    try { W[k] = Wrapped; } catch (e) { /* read-only */ }
  });
  var paused = { anims: [], media: [], ctx: [] };
  // (a loop is paused at its start, so a held frame never depends on where in its loop it was: a talking face, a pulse; on release
  // it goes on from where it was)
  function pauseAnims() {
    try {
      var run = document.getAnimations().filter(function (a) { return a.playState === "running"; });
      run.forEach(function (a) {
        var was = a.currentTime;
        a.pause();
        var t = a.effect && a.effect.getComputedTiming();
        if (t && !isFinite(t.endTime)) { a.__standWas = was; try { a.currentTime = 0; } catch (e) { /* not seekable */ } }
      });
      paused.anims = paused.anims.concat(run);
    } catch (e) { /* none */ }
  }
  // hold the game: its clock, timers, frames, taps and sound; the page's animations too, unless `finish` (a moment at a note: the ones
  // that end run to their end first, tick() pauses the rest)
  function hold(finish) {
    if (held) return;
    held = true;
    heldAt = realPerfNow();
    if (!finish) pauseAnims();
    paused.media = Array.prototype.filter.call(document.querySelectorAll("audio, video"), function (m) { return !m.paused; });
    paused.media.forEach(function (m) { try { m.pause(); } catch (e) { /* gone */ } });
    paused.ctx = contexts.filter(function (c) { return c.state === "running"; });
    paused.ctx.forEach(function (c) { try { c.suspend(); } catch (e) { /* closed */ } });
  }
  function release() {
    if (!held) return;
    offset += realPerfNow() - heldAt;
    held = false;
    paused.anims.forEach(function (a) { try { if (a.__standWas != null) { a.currentTime = a.__standWas; a.__standWas = null; } a.play(); } catch (e) { /* gone */ } });
    paused.media.forEach(function (m) { try { m.play().catch(function () {}); } catch (e) { /* gone */ } });
    paused.ctx.forEach(function (c) { try { c.resume(); } catch (e) { /* closed */ } });
    paused = { anims: [], media: [], ctx: [] };
    var now = vPerf();
    timers.forEach(function (rec) {
      if (!rec.waiting) return;
      rec.waiting = false;
      realClearTimeout(rec.real);
      rec.real = realSetTimeout(rec.fire, Math.max(0, rec.due - now));
    });
    frames.forEach(function (f, id) { if (f.waiting) { f.waiting = false; askFrame(id); } });
  }
  // a tap while held never reaches the game (the play bot waits for busy(), this is the guard behind it)
  ["pointerdown", "pointerup", "mousedown", "mouseup", "click", "touchstart", "touchend"].forEach(function (t) {
    W.addEventListener(t, function (e) { if (held) { e.stopImmediatePropagation(); e.preventDefault(); } }, true);
  });
  // ---- the moments ----
  var lifeSeen = {};
  var lines = 0;
  var S = {
    // the Lifecycle has said `what` (counted as written: its log keeps only the last 400)
    life: function (what) { return !!lifeSeen[what]; },
    held: function () { return held; },
    // a line is being said (the Lifecycle's say-start and say-end, one each per line)
    speaking: function () { return lines > 0; },
  };
  var moments = (ARM.moments || []).map(function (m) { return { name: m.name, note: m.note || null, when: m.when || null, wait: m.wait || null, after: m.after || 0, done: false, on: false, since: 0, last: null, same: 0 }; });
  var finishing = null; // a moment come at its note, its motion coming to rest (stilling) before the game is held
  onLife = function (e) {
    if (!e) return;
    lifeSeen[e.what] = true;
    if (e.what === "say-start") lines++;
    else if (e.what === "say-end") lines = Math.max(0, lines - 1);
    if (held) return;
    for (var i = 0; i < moments.length; i++) {
      var m = moments[i];
      if (m.done || !m.note || (m.note !== "*" && m.note !== e.what)) continue;
      var ok = true;
      try { ok = !m.when || !!m.when(S); } catch (x) { ok = false; }
      if (!ok) continue;
      m.done = true;
      stilling = true;
      finishing = m;
      finishing.from = realPerfNow();
      m.same = 0;
      m.last = null;
      return;
    }
  };
  var settle = ARM.settle || 8;
  var reached = null;
  var sig = ARM.sig || function () { return ""; };
  function moving() {
    try {
      return document.getAnimations().some(function (a) {
        if (a.playState !== "running" || !a.effect) return false;
        var t = a.effect.getComputedTiming();
        return isFinite(t.endTime) && t.progress != null;
      });
    } catch (e) { return false; }
  }
  // a moment at "dom": checked as the page changes (a MutationObserver: after the change's own code, before any timer or frame)
  function onDom() {
    if (held) return;
    for (var i = 0; i < moments.length; i++) {
      var m = moments[i];
      if (m.done || m.note !== "dom") continue;
      var ok = false;
      try { ok = !!m.when(S); } catch (x) { ok = false; }
      if (!ok) continue;
      m.done = true;
      stilling = true;
      finishing = m;
      finishing.from = realPerfNow();
      m.same = 0;
      m.last = null;
      return;
    }
  }
  if (moments.some(function (m) { return m.note === "dom"; })) {
    try { new MutationObserver(onDom).observe(document, { childList: true, subtree: true, attributes: true, characterData: true }); } catch (e) { /* no observer */ }
  }
  // the pictures on screen are in (a card landing at a note may still be fetching its pictures)
  function loading() {
    try {
      return Array.prototype.some.call(document.images, function (im) {
        if (im.complete) return false;
        var r = im.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.right > 0 && r.bottom > 0 && r.left < innerWidth && r.top < innerHeight;
      });
    } catch (e) { return false; }
  }
  function tick() {
    realRaf(tick);
    if (finishing) {
      // the motion under way at the note comes to rest (a card's glide, a pan's drop, a fade; frames and tweens run on, the timers
      // wait), and the pictures on screen are in; then the whole game is held. At most 5 s: a moment that never comes to rest is
      // held as it is, and the reader's second read says so
      var f = finishing;
      var s0 = "";
      try { s0 = sig(S); } catch (e) { s0 = "error " + e; }
      if (moving() || loading()) { f.same = 0; f.last = null; }
      else if (s0 === f.last) f.same++;
      else { f.last = s0; f.same = 1; }
      if (f.same < settle && realPerfNow() - f.from < 5000) return;
      hold();
      stilling = false;
      reached = { name: f.name, t: Math.round(vPerf()), at: f.note, frames: f.same };
      finishing = null;
      return;
    }
    if (held) return;
    for (var i = 0; i < moments.length; i++) {
      var m = moments[i];
      if (m.done || m.note) continue;
      var on = false;
      try { on = !!m.when(S); } catch (e) { on = false; }
      if (!on) {
        if (m.on) { m.on = false; m.last = null; m.same = 0; m.lost = (m.lost || 0) + 1; }
        continue;
      }
      if (!m.on) m.since = vPerf();
      m.on = true;
      var s = "";
      try { s = sig(S); } catch (e) { s = "error " + e; }
      // (and nothing that ends is still on its way: a fade, a slide, a card growing; a loop never ends and does not count)
      if (moving()) { m.same = 0; m.last = null; continue; }
      if (s === m.last) m.same++;
      else { if (m.last != null) m.prev = m.last; m.last = s; m.same = 1; m.changes = (m.changes || 0) + 1; }
      if (m.same >= settle && vPerf() - m.since >= m.after) {
        m.done = true;
        hold();
        reached = { name: m.name, t: Math.round(vPerf()), frames: m.same };
        return; // one moment at a time: the next waits for the release
      }
    }
  }
  realRaf(tick);
  W.njgStand = {
    S: S,
    reached: function () { return reached; },
    go: function () { reached = null; release(); return true; },
    hold: hold,
    release: release,
    reseed: function () { reseeds = 0; seed = base; return true; },
    held: function () { return held; },
    // (why a moment was never reached: its last two different readings while its condition held, so the tool can say what moved)
    pending: function () { return moments.filter(function (m) { return !m.done; }).map(function (m) { return { name: m.name, on: m.on, same: m.same, lost: m.lost || 0, changes: m.changes || 0, prev: m.prev || null, last: m.last || null }; }); },
    busy: function () { return held || !!finishing || moments.some(function (m) { if (m.done) return false; if (m.on) return true; try { return !!(m.wait && m.wait(S)); } catch (e) { return false; } }); },
  };
})();

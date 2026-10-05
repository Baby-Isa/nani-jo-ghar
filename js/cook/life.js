/*
 * Cook's lifetime (C4, decision 45): every timer, interval, animation frame and page-wide listener Cook starts while
 * it is mounted, so unmount (js/cook/mount.js) can stop them all and leave nothing behind (E17).
 *
 * A Cook module imports the timer names from here, which shadow the browser's own inside that module:
 *   import { setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame } from "./life.js";
 * Listeners on the page itself (window, document, document.body, visualViewport) go through on(target, type, fn, o);
 * listeners on Cook's own DOM need nothing (they go with the DOM). onEnd(fn) runs fn at the end (a ResizeObserver's
 * disconnect, a shared widget's destroy). The six files the parked pages and Node harnesses still load as classic
 * scripts (core, words, lang, ui, order, recipes) reach this as Cook.life (js/cook/ns.js) when Cook loads as modules.
 *
 * end() clears everything; open() reports what is still running (the mount test, build/test_cook_mount.mjs).
 */
const G = globalThis;
const timers = new Set();
const intervals = new Set();
const frames = new Set();
const listeners = new Set();
const ends = new Set();

export function setTimeout(fn, ms, ...args) {
  const t = G.setTimeout(() => {
    timers.delete(t);
    if (typeof fn === "function") fn(...args);
  }, ms);
  timers.add(t);
  return t;
}
export function clearTimeout(t) {
  timers.delete(t);
  G.clearTimeout(t);
}
export function setInterval(fn, ms, ...args) {
  const t = G.setInterval(fn, ms, ...args);
  intervals.add(t);
  return t;
}
export function clearInterval(t) {
  intervals.delete(t);
  G.clearInterval(t);
}
export function requestAnimationFrame(fn) {
  if (!G.requestAnimationFrame) return setTimeout(() => fn(Date.now()), 16);
  const f = G.requestAnimationFrame((ts) => {
    frames.delete(f);
    fn(ts);
  });
  frames.add(f);
  return f;
}
export function cancelAnimationFrame(f) {
  frames.delete(f);
  if (G.cancelAnimationFrame) G.cancelAnimationFrame(f);
}

/** A listener on the page itself, removed at the end. Returns a function that removes it sooner. */
export function on(target, type, fn, o) {
  if (!target || !target.addEventListener) return () => {};
  target.addEventListener(type, fn, o);
  const rec = [target, type, fn, o];
  listeners.add(rec);
  return () => {
    if (!listeners.delete(rec)) return;
    target.removeEventListener(type, fn, o);
  };
}
/** Something to undo at the end (a ResizeObserver's disconnect, a shared widget's destroy). */
export function onEnd(fn) {
  ends.add(fn);
  return () => ends.delete(fn);
}

/** What is still running (for the mount test). */
export function open() {
  return { timers: timers.size, intervals: intervals.size, frames: frames.size, listeners: listeners.size, ends: ends.size };
}

/** Stop everything Cook started. */
export function end() {
  [...ends].reverse().forEach((fn) => {
    try {
      fn();
    } catch (e) {
      /* already gone */
    }
  });
  ends.clear();
  timers.forEach((t) => G.clearTimeout(t));
  timers.clear();
  intervals.forEach((t) => G.clearInterval(t));
  intervals.clear();
  frames.forEach((f) => G.cancelAnimationFrame && G.cancelAnimationFrame(f));
  frames.clear();
  listeners.forEach(([t, type, fn, o]) => t.removeEventListener(type, fn, o));
  listeners.clear();
}

export const life = { setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame, on, onEnd, open, end };
export default life;

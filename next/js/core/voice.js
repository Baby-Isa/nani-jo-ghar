/*
 * One voice for every line: one queue of lines, each said piece by piece from its clip plan (the language engine's),
 * and the device's own voice for a word with no family recording, on the test path only.
 *
 * WHICH CLIP is the engine's plan (js/core/lang/engine/clips.js, with the rules in ./voice-clips.js): Mum's take of
 * the whole line or a phrase where its text fits (Zafar, 18 Nov: "Mum's whole-line takes play where they fit"), else
 * word by word, with the old game's pause between words (gapMs, data/kit.json voice.wordGapMs). On the STORE path
 * (window.NJG_BUILD = "store", or ?voice=store to preview it) only clips marked OK play and the device never speaks.
 *
 * ONE WAY TO CANCEL: a line is alive while the queue has not been stopped or replaced since it was queued. Each
 * piece is played only while its line is alive, and a device word is handed the same test (`due`), so a word that
 * is still waiting for its voice when its line goes is never spoken late.
 *
 *   const V = createVoice({ player, path, gapMs, wait })    player: {play(url, {onStart}) -> Promise, stop(), synth?(text, o) -> Promise}
 *       wait(ms): the pause between two words, on the caller's clock (one that stands still while the round is held)
 *   V.say({ clipPlan }, { onWord, onStart, queue = false, ifIdle }) -> Promise<{ done }>
 *       onWord(tokens, item): a piece is next; onStart(tokens, item, { ms }?): it is really heard (ms: a clip's length, when known)
 *       queue: false replaces what is said; true waits its turn. ifIdle: said only when nothing is said or waiting.
 *   V.stop()      V.busy() (saying or waiting)
 *   deviceSpeak(text, { times, onStart, due, wait }) -> Promise<heard>    the device voice; due() false: it is not wanted any more
 *       times: data/kit.json voice.device (its speed and every wait it keeps)
 */
import { voicePath } from "./voice-clips.js";

// the device voice's own state, kept here, never on the browser's object: when this file last cancelled it (the next
// word waits out times.cancelGapMs: Chrome drops one spoken in the same breath), when its voices were first asked for,
// and whether they are in (a phone's Chrome loads them lazily, and a word asked for before they are in is never heard)
let cancelAt = 0;
let voicesAsked = 0;
let voicesHere = false;

const synthOf = () => globalThis.speechSynthesis || null;
const voicesOf = (S) => {
  try {
    return (S.getVoices && S.getVoices()) || [];
  } catch (e) {
    return [];
  }
};
function cancel(S) {
  cancelAt = Date.now();
  try {
    S.cancel();
  } catch (e) {
    /* gone */
  }
}
/** The voices are asked for as this module loads, long before the first order; deviceSpeak waits for them. */
function warmVoices(S) {
  if (!S || voicesAsked) return;
  voicesAsked = Date.now();
  const seen = () => voicesOf(S).length && (voicesHere = true);
  try {
    if (S.addEventListener) S.addEventListener("voiceschanged", seen);
  } catch (e) {
    /* a synth without voices */
  }
  seen();
}
async function voicesIn(S, times, wait) {
  warmVoices(S);
  const until = voicesAsked + times.voicesWaitMs;
  while (!(voicesHere || (voicesOf(S).length && (voicesHere = true)))) {
    if (Date.now() >= until) return false;
    await wait(times.voicesPollMs);
  }
  return true;
}

/**
 * The device voice (Gujarati, Hindi or Indian English if the device has one). It waits for the voices and out a
 * recent cancel, then speaks only if its line still wants it (due). It ends when the browser says so; one that never
 * starts, or never ends, is let go of and cancelled there and then, so it can never come out later, out of turn
 * (every device word is said through one queue, so the browser holds no other word of ours to lose).
 */
export function deviceSpeak(text, { times, onStart = null, due = () => true, wait = (ms) => new Promise((r) => setTimeout(r, ms)) }) {
  const S = synthOf();
  if (!S || !globalThis.SpeechSynthesisUtterance) return Promise.resolve(false);
  return voicesIn(S, times, wait)
    .then(() => {
      const since = Date.now() - cancelAt;
      return since < times.cancelGapMs ? wait(times.cancelGapMs - since) : null;
    })
    .then(() => (due() ? speakNow(S, text, { times, onStart, due }) : false));
}

function speakNow(S, text, { times, onStart, due }) {
  return new Promise((resolve) => {
    let done = false;
    let started = false;
    const timers = [];
    let watch = null;
    const fin = (heard) => {
      if (done) return;
      done = true;
      timers.forEach((t) => clearTimeout(t));
      clearInterval(watch);
      resolve(heard);
    };
    const letGo = (heard) => {
      if (done) return;
      cancel(S);
      fin(heard);
    };
    try {
      const vs = voicesOf(S);
      const v = vs.find((x) => /^gu/i.test(x.lang)) || vs.find((x) => /^hi/i.test(x.lang)) || vs.find((x) => /^en-IN/i.test(x.lang)) || vs[0];
      const u = new globalThis.SpeechSynthesisUtterance(text);
      if (v) (u.voice = v), (u.lang = v.lang);
      u.rate = times.rate;
      u.onstart = () => {
        started = true;
        if (!due()) return letGo(false); // (its line went while the device was getting ready)
        try {
          if (onStart) onStart();
        } catch (e) {
          /* the caller's problem */
        }
      };
      u.onend = u.onerror = () => fin(started);
      S.speak(u);
      // (no voice installed at all: let go of it almost at once, so a test browser is not held up)
      timers.push(setTimeout(() => !started && letGo(false), vs.length ? times.noStartMs : times.noVoiceMs));
      timers.push(setTimeout(() => letGo(true), times.capMs + times.capPerLetterMs * String(text).length));
      // its line stopped or replaced while it speaks: it stops too
      watch = setInterval(() => !due() && letGo(started), times.dueEveryMs);
    } catch (e) {
      fin(false);
    }
  });
}

/**
 * A phone's browser speaks with the device voice only once a tap has let it (as it does sound); a word asked for before
 * that waits and may come out later, out of turn. So the first tap (the start tap) speaks one silent space, once.
 */
const PRIME_TAPS = ["pointerdown", "touchend", "click", "keydown"];
function primeOnTap(S) {
  if (!S || !globalThis.SpeechSynthesisUtterance || !globalThis.addEventListener) return;
  const prime = () => {
    PRIME_TAPS.forEach((t) => globalThis.removeEventListener(t, prime, true));
    try {
      const u = new globalThis.SpeechSynthesisUtterance(" ");
      u.volume = 0;
      S.speak(u);
    } catch (e) {
      /* no device voice */
    }
  };
  PRIME_TAPS.forEach((t) => globalThis.addEventListener(t, prime, true));
}

warmVoices(synthOf());
primeOnTap(synthOf());

export function createVoice({ player, path, gapMs = 0, wait = (ms) => new Promise((r) => setTimeout(r, ms)) } = {}) {
  const P = player || { play: async () => true, stop() {} };
  const thePath = () => path || voicePath();
  const planOf = (result) => (result.clipPlan || []).filter((c) => thePath() === "test" || c.source === "family-ok");

  async function playItems(items, alive, onWord, onStart) {
    for (const it of items) {
      if (!alive()) return false;
      if (onWord) {
        try {
          onWord(it.tokens, it);
        } catch (e) {
          /* the caller's problem */
        }
      }
      const heard = onStart ? (info) => onStart(it.tokens, it, info) : null;
      if (it.file && (it.source === "family-ok" || thePath() === "test")) await P.play(it.file, { onStart: heard });
      else if (it.source === "device" && thePath() === "test" && P.synth) await P.synth(it.text, { onStart: heard, due: alive });
      // the pause between two words of a line (none after the last: the next line keeps its own beat)
      if (gapMs && it !== items[items.length - 1] && alive()) await wait(gapMs);
    }
    return alive();
  }

  // every line waits its turn on one queue. gen counts the stops: a line queued before a stop is not alive after it.
  // live counts the lines saying or waiting (busy)
  const q = { gen: 0, tail: Promise.resolve(), live: 0 };
  const clear = () => {
    q.gen++;
    q.tail = Promise.resolve();
    P.stop();
  };
  return {
    say(result, { onWord, onStart, queue = false, ifIdle = false } = {}) {
      if (ifIdle && q.live > 0) return Promise.resolve({ done: false, skipped: true });
      const items = planOf(result);
      if (!queue) clear(); // replace: whatever is said or waiting goes
      const gen = q.gen;
      const alive = () => gen === q.gen;
      q.live++;
      const done = q.tail
        .catch(() => {})
        .then(async () => (alive() ? { done: await playItems(items, alive, onWord, onStart) } : { done: false }))
        .finally(() => (q.live = Math.max(0, q.live - 1)));
      q.tail = done;
      return done;
    },
    stop: clear,
    busy: () => q.live > 0,
  };
}

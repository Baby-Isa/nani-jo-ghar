/*
 * Shared speaking moment: the UI around Speech.listen() (docs/shared-api.md s4).
 *
 * Role reversal in every mode: the child says the Kutchi and a character
 * acts on it. This module is that moment, once: a big round microphone
 * button, the closed set as faint word pills beneath it, the listening
 * state, a character reaction hook, one "say it again" after a miss, the
 * pills going live after the retry or on a timer, and a parent's ✓ in
 * Grandparent mode. It never blocks progress and never marks anything
 * wrong: a miss is a shrug, and a pill tap always finishes the moment.
 *
 *   const out = await Say.moment({
 *     choices: ["cook-chai", "cook-dudh", "cook-khun"],   // the closed set (2-8)
 *     mode: "cook",                                       // for the log and the rules
 *     character: { listen(), heard(choice, res), miss(tries, res), act(choice, via), done(out) },
 *     accept: (choice, via) => true,        // the mode may reject a hearing (a wrong act): counts as a miss
 *     expected: "cook-chai",                // optional: what a parent's ✓ confirms
 *     grandparent: false,                   // show the parent's ✓ / again
 *     pillsLive: false,                     // L1: pills and mic together from the start
 *     timeoutMs: 4000, pillsAfterMs: 8000, retries: 1, minConfidence: 0.5,
 *     label: (id) => text, container: element, caption: "Tell the cook what to make",
 *   });
 *   // -> {choice, via: "voice" | "pill" | "parent" | "skip", confidence, tries, retried, fallback, enrolled}
 *
 *   Say.tell(opts)            the same, under the names Who did it / Find it
 *                             designed against (actor, onHeard / onChoice)
 *   Say.pills(el, ids, opts)  the shared pill builder on its own
 *   Say.machine(opts)         the pure state machine under moment() (tests, bots)
 *   Say.isListening()         a mode's audio must not play a voice line while true
 *
 * The voice star is scored from the resolved moments by js/shared/stars.js
 * (Stars.voice): "voice" and "parent" count, "pill" leaves it open.
 *
 * Plain <script> after speech.js: window.Say (and Shared.say); Node:
 * require() (the machine runs anywhere; moment() needs a document).
 */
(function (root, factory) {
  const Say = factory(root);
  if (typeof module === "object" && module.exports) module.exports = Say;
  else {
    root.Say = Say;
    (root.Shared = root.Shared || {}).say = Say;
  }
})(typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const Say = {};
  Say.DEFAULTS = { timeoutMs: 4000, pillsAfterMs: 8000, retries: 1, minConfidence: 0.5, pillsLive: false, grandparent: false };

  /* ------------------------------------------------------ the machine */
  /**
   * Phases: "ready" (mic waiting for a tap) -> "listening" -> back to
   * "ready" with a hint after a miss, or "done". pillsLive turns true after
   * `retries` misses, on the timer, when the mic can't be used, or from the
   * start (opts.pillsLive). Every method returns the state.
   *   start({micOk})  micTap()  heard(res)  rejected()  timer()
   *   pill(id)  parentOk()  parentAgain()  skip()
   */
  Say.machine = function (opts) {
    opts = Object.assign({}, Say.DEFAULTS, opts || {});
    const st = { phase: "idle", tries: 0, misses: 0, micShown: true, pillsLive: !!opts.pillsLive, hint: false, parentArmed: false, outcome: null, last: null };
    const finish = (o) => {
      st.phase = "done";
      st.outcome = Object.assign({ confidence: null, tries: st.tries, retried: st.misses > 0, fallback: o.via === "pill" }, o);
      return st;
    };
    const miss = (res) => {
      st.misses++;
      st.last = res || null;
      st.phase = "ready";
      st.hint = true;
      if (st.misses > opts.retries) st.pillsLive = true;
      return st;
    };
    const M = {
      state: st,
      start(o) {
        st.phase = "ready";
        if (o && o.micOk === false) {
          st.micShown = false;
          st.pillsLive = true;
        }
        return st;
      },
      micTap() {
        if (st.phase !== "ready" || !st.micShown) return st;
        st.phase = "listening";
        st.tries++;
        return st;
      },
      /** The listen() result: {choice, confidence} | null. */
      heard(res) {
        if (st.phase !== "listening") return st;
        if (res && res.choice && (res.confidence == null || res.confidence >= opts.minConfidence)) {
          st.phase = "acting";
          st.last = res;
          return st;
        }
        return miss(res);
      },
      /** The character acted on the hearing and the mode accepted it. */
      accepted() {
        if (st.phase !== "acting") return st;
        return finish({ choice: st.last.choice, via: "voice", confidence: st.last.confidence });
      },
      /** The mode rejected the act (the wrong cup): a miss like any other. */
      rejected() {
        if (st.phase !== "acting") return st;
        return miss(st.last);
      },
      timer() {
        if (st.phase !== "done") st.pillsLive = true;
        return st;
      },
      pill(id) {
        if (st.phase === "done" || st.phase === "listening") return st;
        if (st.parentArmed) return finish({ choice: id, via: "parent" });
        if (!st.pillsLive) return st;
        return finish({ choice: id, via: "pill" });
      },
      /** Grandparent mode: "they said it". Confirms `expected`, else arms the pills so the parent taps which word. */
      parentOk() {
        if (st.phase === "done") return st;
        if (opts.expected) return finish({ choice: opts.expected, via: "parent" });
        st.parentArmed = true;
        st.pillsLive = true;
        return st;
      },
      /** Grandparent mode: "again": back to the mic, no miss counted. */
      parentAgain() {
        if (st.phase !== "done") {
          st.phase = "ready";
          st.parentArmed = false;
        }
        return st;
      },
      skip() {
        if (st.phase !== "done") finish({ choice: null, via: "skip" });
        return st;
      },
    };
    return M;
  };

  /* ---------------------------------------------------------- the DOM */
  let listening = false;
  Say.isListening = () => listening;
  const CSS = `
.njg-say{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:60;display:flex;flex-direction:column;align-items:center;gap:10px;padding:12px 16px 14px;border-radius:22px;background:rgba(255,250,240,.94);box-shadow:0 6px 24px rgba(60,30,10,.25);font:600 16px/1.2 system-ui,sans-serif;color:#3b2415;max-width:calc(100vw - 24px)}
.njg-say .cap{font-weight:500;font-size:15px;text-align:center;max-width:32em}
.njg-say .mic{width:84px;height:84px;border-radius:50%;border:0;background:#c8553d;color:#fff;display:grid;place-items:center;cursor:pointer;box-shadow:0 4px 0 #8e3526;transition:transform .12s}
.njg-say .mic svg{width:42px;height:42px}
.njg-say .mic:active{transform:translateY(3px);box-shadow:0 1px 0 #8e3526}
.njg-say.listening .mic{animation:njg-pulse 1s ease-in-out infinite}
.njg-say.speaking .mic{transform:scale(1.12);background:#e0673f}
.njg-say.hint .mic{outline:4px solid #f2b134}
.njg-say .mic[hidden]{display:none}
.njg-say .pills{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}
.njg-say .pill{min-height:44px;min-width:64px;padding:8px 16px;border-radius:22px;border:2px solid #d9bf95;background:#fff;font:inherit;color:inherit;opacity:.35;pointer-events:none;transition:opacity .3s}
.njg-say.hint .pill{opacity:.6}
.njg-say.live .pill{opacity:1;pointer-events:auto;cursor:pointer}
.njg-say .pill.ph{font-style:italic;color:#8a7a6a}
.njg-say .parent{display:flex;gap:8px;font-size:13px}
.njg-say .parent button{min-height:36px;padding:4px 12px;border-radius:18px;border:1px solid #b9a07a;background:#f7eedd;font:inherit}
@keyframes njg-pulse{0%,100%{box-shadow:0 0 0 0 rgba(200,85,61,.5),0 4px 0 #8e3526}50%{box-shadow:0 0 0 14px rgba(200,85,61,0),0 4px 0 #8e3526}}
@media (max-height:440px){.njg-say{bottom:8px;padding:8px 12px;gap:6px}.njg-say .mic{width:60px;height:60px}.njg-say .mic svg{width:30px;height:30px}.njg-say .pill{min-height:38px}}
@media (prefers-reduced-motion:reduce){.njg-say.listening .mic{animation:none;outline:4px solid #c8553d}}`;
  const MIC = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/></svg>`;
  function injectCss(doc) {
    if (doc.getElementById("njg-say-css")) return;
    const s = doc.createElement("style");
    s.id = "njg-say-css";
    s.textContent = CSS;
    (doc.head || doc.body).appendChild(s);
  }
  const defaultLabel = (id) => {
    const C = root && root.Cook;
    return C && C.display ? C.display(id) : id;
  };
  const isPlaceholder = (id) => {
    const C = root && root.Cook;
    return !!(C && C.isPlaceholder && C.data && C.data.words && C.data.words[id] && C.isPlaceholder(id));
  };

  /**
   * The shared pill builder: one button per id in el. opts: {label(id),
   * onPick(id), live}. Returns {el, setLive(bool), buttons}.
   */
  Say.pills = function (el, ids, opts) {
    opts = opts || {};
    const doc = el.ownerDocument || root.document;
    const wrap = doc.createElement("div");
    wrap.className = "pills";
    const buttons = {};
    for (const id of ids) {
      const b = doc.createElement("button");
      b.className = "pill" + (isPlaceholder(id) ? " ph" : "");
      b.type = "button";
      b.setAttribute("data-choice", id);
      b.textContent = (opts.label || defaultLabel)(id);
      b.addEventListener("click", () => opts.onPick && opts.onPick(id));
      wrap.appendChild(b);
      buttons[id] = b;
    }
    el.appendChild(wrap);
    const setLive = (on) => (on ? el.classList.add("live") : el.classList.remove("live"));
    if (opts.live) setLive(true);
    return { el: wrap, setLive, buttons };
  };

  /**
   * One speaking moment on screen. Resolves when it's done (never rejects).
   * The returned promise also has .cancel() (resolves as a skip).
   */
  Say.moment = function (opts) {
    const S = root && root.Stars;
    const fromRules = S && S.rules && opts && opts.mode && opts.minConfidence == null ? { minConfidence: S.rules(opts.mode).minConfidence } : {};
    opts = Object.assign({}, Say.DEFAULTS, fromRules, opts || {});
    const doc = (opts.container && opts.container.ownerDocument) || root.document;
    const Speech = opts.speech || (root && root.Speech) || null;
    const ch = opts.character || opts.actor || {};
    const call = (fn, ...a) => {
      try {
        return fn ? fn.apply(ch, a) : undefined;
      } catch (e) {
        return undefined;
      }
    };
    const choices = opts.choices || [];
    const micOk = !!(Speech && Speech.listen && choices.length >= 2 && (!Speech.hasTemplates || Speech.hasTemplates(choices)) && !(Speech.status && ["refused", "absent"].includes(Speech.status())));
    const M = Say.machine(opts);
    injectCss(doc);
    const box = doc.createElement("div");
    box.className = "njg-say";
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", "Say it");
    if (opts.caption) {
      const cap = doc.createElement("div");
      cap.className = "cap";
      cap.textContent = opts.caption;
      box.appendChild(cap);
    }
    const mic = doc.createElement("button");
    mic.className = "mic";
    mic.type = "button";
    mic.setAttribute("aria-label", "Tap and say it");
    mic.innerHTML = MIC;
    box.appendChild(mic);
    let resolveOut;
    const done = new Promise((r) => (resolveOut = r));
    const pills = Say.pills(box, choices, { label: opts.label, onPick: (id) => step(M.pill(id)) });
    if (opts.grandparent) {
      const row = doc.createElement("div");
      row.className = "parent";
      const btn = (text, key, fn) => {
        const b = doc.createElement("button");
        b.type = "button";
        b.setAttribute("data-parent", key);
        b.textContent = text;
        b.addEventListener("click", fn);
        row.appendChild(b);
      };
      btn("✓ They said it", "ok", () => {
        if (Speech && Speech.cancel) Speech.cancel();
        step(M.parentOk());
      });
      btn("Again", "again", () => step(M.parentAgain()));
      box.appendChild(row);
    }
    (opts.container || doc.body).appendChild(box);
    let timer = null;
    let closed = false;

    function render(st) {
      mic.hidden = !st.micShown;
      box.classList.toggle("listening", st.phase === "listening");
      if (st.phase !== "listening") box.classList.remove("speaking");
      box.classList.toggle("hint", !!st.hint);
      pills.setLive(st.pillsLive);
      if (typeof opts.onState === "function") opts.onState(Object.assign({}, st));
    }
    function log(out) {
      if (!Speech || !Speech.logMoment) return;
      const r = (Speech.last && Speech.last.result) || {};
      Speech.logMoment({ mode: opts.mode || null, choices: choices.slice(), choice: out.choice, via: out.via, confidence: out.confidence, margin: out.via === "voice" && r.margin != null ? Math.round(r.margin * 100) / 100 : null, tries: out.tries, retried: out.retried, fallback: out.fallback, enrolled: !!out.enrolled });
    }
    async function step(st) {
      if (closed) return;
      render(st);
      if (st.phase !== "done") return;
      closed = true;
      if (timer) clearTimeout(timer);
      if (Speech && Speech.cancel) Speech.cancel();
      listening = false;
      const out = Object.assign({}, st.outcome);
      if (Speech && Speech.confirm && out.choice) {
        if (out.via === "parent") out.enrolled = Speech.confirm(out.choice, "parent");
        else if (out.via === "voice") out.enrolled = Speech.confirm(out.choice, "game");
      }
      if (out.via === "pill" || out.via === "parent") await call(ch.act, out.choice, out.via);
      log(out);
      await call(ch.done, out);
      if (opts.onHeard) opts.onHeard(out);
      if (opts.onChoice) opts.onChoice(out);
      box.remove();
      resolveOut(out);
    }
    mic.addEventListener("click", () => {
      if (M.state.phase !== "ready") return;
      step(M.micTap());
      call(ch.listen);
      listening = true;
      // listen() must start inside this tap (iOS): no await before it
      const p = Speech.listen({
        choices,
        timeoutMs: opts.timeoutMs,
        onState: (s) => {
          if (s === "speaking") box.classList.add("speaking");
        },
      });
      Promise.resolve(p).then(async (res) => {
        listening = false;
        if (closed) return;
        const st = M.heard(res);
        if (st.phase === "acting") {
          await call(ch.heard, res.choice, res);
          await call(ch.act, res.choice, "voice");
          const ok = opts.accept ? await opts.accept(res.choice, "voice") : true;
          step(ok === false ? M.rejected() : M.accepted());
          if (ok === false) call(ch.miss, M.state.misses, res);
        } else {
          call(ch.miss, st.misses, res);
          step(st);
        }
      });
    });
    step(M.start({ micOk }));
    if (opts.pillsAfterMs > 0) timer = setTimeout(() => step(M.timer()), opts.pillsAfterMs);
    done.cancel = () => step(M.skip());
    return done;
  };

  /** Who did it / Find it's name for the moment: actor = character, onHeard / onChoice callbacks. */
  Say.tell = (opts) => Say.moment(Object.assign({}, opts, { character: opts.character || opts.actor }));

  return Say;
});

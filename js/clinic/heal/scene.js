/*
 * The heal games' close-up scene (clinic v2, design sheets part B;
 * docs/game-design/modes/clinic.md). A PROTOTYPE layer: flat stand-in
 * shapes on the blurred CB6b bed, so the mechanics can be judged before art.
 *
 *   const S = Clinic.HealScene.make(stage, ctx, {place: "limb" | "head", game: "knee"});
 *   S.svg            the drawing layer: viewBox 0 0 800 500 (meet), overflow visible
 *                    limb close-ups lie on the paper strip (y ~345-480);
 *                    head close-ups sit against the wall (y ~20-300)
 *   S.s(tag, attrs, parent) / S.h(tag, cls, parent, text)
 *   S.pt(e) -> {x, y} in svg units · S.client(x, y) -> {x, y} client px (tests)
 *   S.face(mood)     the patient's round face, top-left: neutral, ouch, happy, wince, cold, hot, read, sad
 *   S.say(line, who) a line ({kutchi, english, placeholder} or English) by "patient" / "doctor"
 *   S.begin(why)     start: input live at once (13i); the why beat (standalone only) and the card's read-along alongside
 *   S.why(problem, goal)   the opening beat, shown not told (13g): the pained face, then the doctor's line;
 *                    only when the game runs on its own (ctx.inRun skips it: the diagnosis already told it, 13i)
 *   S.tools(list, onPick)  the tool shelf (stand-in buttons on the right); S.pick(id) selects; the things that
 *                    came from the pharmacy's tray are marked (13)
 *   S.cue(kind, spec, target, then?)   first-time help: the ghost finger on the shared onboarding kit, no words,
 *                    no device voice (13g, UX 8); S.uncue() ends it; S.did() the child acted
 *   S.count(n)       the count-up (Cook rule Q7): the host writes it (ctx.tally; L1 on the card, said); L3 said here
 *   S.timer(ms, onEnd)     a gentle bar: {stop(), left()}
 *   S.destroy()
 *
 * Pure helpers (Node too): HealScene.NUM, pick, shuffle, row(), bot(rows, rng).
 */
(function (root, factory) {
  const g = typeof globalThis !== "undefined" ? globalThis : root;
  const Clinic = (g.Clinic = g.Clinic || {});
  const S = factory(g);
  Clinic.HealScene = S;
  if (typeof module === "object" && module.exports) module.exports = S;
})(typeof self !== "undefined" ? self : this, function (global) {
  "use strict";
  const HS = {};
  // every word, number and join from data through the seam (js/clinic/lang.js; R5): 1-5 only, so counts stay at 5 or under
  // (looked up when used: a page may load js/clinic/lang.js after this file, e.g. the heal host's loadBase)
  const Lg = () => global.ClinicLang || (typeof require === "function" ? require("../lang.js") : null);
  Object.defineProperty(HS, "L", { get: Lg, enumerable: true });
  /** The number word for n ("ba"), or null past five. */
  HS.num = (n, o) => (Lg().numId(n) ? Lg().num(n, o).kutchi : null);
  HS.cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  HS.pick = (a, rng) => a[Math.floor(rng() * a.length)];
  HS.shuffle = (a, rng) => {
    const b = a.slice();
    for (let k = b.length - 1; k > 0; k--) {
      const j = Math.floor(rng() * (k + 1));
      [b[k], b[j]] = [b[j], b[k]];
    }
    return b;
  };
  /**
   * CLN-49: of the things within reach of a touch, the one aimed at: the smallest gap between the touch and its
   * edge (inside a small blob beats the edge of a big one next to it). list: [{x, y, r, ...}]; pad: the finger.
   */
  HS.nearest = function (p, list, pad = 16) {
    let best = null;
    let bestGap = Infinity;
    (list || []).forEach((q) => {
      if (!q) return;
      const d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d >= q.r + pad) return;
      const gap = d - q.r;
      if (gap < bestGap) {
        bestGap = gap;
        best = q;
      }
    });
    return best;
  };
  /** An English placeholder word ("to record"). */
  HS.ph = (english) => ({ kutchi: null, english, placeholder: true });
  /** The colours: English placeholders until the doctor's recording (Section G). */
  HS.COLOURS = { red: "#d8433f", blue: "#3f6fd8", green: "#3fa35b", yellow: "#f0c43a", orange: "#f08a2c", purple: "#8a55c8", white: "#f7f4ee" };

  /**
   * The shared blind bot. rows: [{id, options, answer}] (answer may be an
   * array for an ordered row; options then list the possible sequences).
   * A blind player sees the pictures but not the words: it guesses.
   * {seq: [choices], answer: [..]}: a sequence, each element one of seq.
   * {skill: true}: a hand-skill row (no words decide it): every player gets it.
   */
  HS.STRATEGIES = ["fair", "random", "first-option", "last-option", "middle-option"];
  HS.bot = function (rows, rng) {
    const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    return {
      rows,
      strategies: HS.STRATEGIES,
      solve(strategy) {
        const res = rows.map((r) => {
          if (strategy === "fair" || r.skill) return true; // a skill row (no words in it): anyone can get it
          if (r.seq) {
            // an ordered row: each element guessed from the same choices
            const g = r.answer.map((_, i) => (strategy === "first-option" ? r.seq[0] : strategy === "last-option" ? r.seq[r.seq.length - 1] : strategy === "middle-option" ? r.seq[i % r.seq.length] : HS.pick(r.seq, rng)));
            return same(g, r.answer);
          }
          const o = r.options || [r.answer];
          let guess;
          if (strategy === "first-option") guess = o[0];
          else if (strategy === "last-option") guess = o[o.length - 1];
          else if (strategy === "middle-option") guess = o[Math.floor((o.length - 1) / 2)];
          else guess = HS.pick(o, rng);
          return same(guess, r.answer);
        });
        return { right: res.filter(Boolean).length, total: res.length };
      },
    };
  };

  /* ---------------- the browser scene ---------------- */
  const NS = "http://www.w3.org/2000/svg";
  // D1 (1 Oct, CLN-43): behind every close-up, the exam room itself (CB2b), zoomed on the bed and blurred, so the
  // room matches the wide shot the zoom came from; CB6b (the close-up bed) is kept only as a fallback
  const BG = "assets/clinic/rooms/bg-clinic-exam-cb2b-v1.webp";
  // the close-up's look is in css/clinic.css (R5: no styles written from code; sizes on the shared tokens)

  HS.make = function (stage, ctx, opts = {}) {
    const doc = stage.ownerDocument;
    const Kit = global.Clinic && global.Clinic.Kit;
    const h = (tag, cls, parent, text) => {
      const n = doc.createElement(tag);
      if (cls) n.className = cls;
      if (text != null) n.textContent = text;
      if (parent) parent.appendChild(n);
      return n;
    };
    const s = (tag, attrs, parent) => {
      const n = doc.createElementNS(NS, tag);
      Object.entries(attrs || {}).forEach(([k, v]) => v != null && n.setAttribute(k, v));
      if (parent) parent.appendChild(n);
      return n;
    };
    const root = h("div", "hs-root", stage);
    root.dataset.place = opts.place || "limb";
    const svg = s("svg", { class: "hs-svg", viewBox: "0 0 800 500", preserveAspectRatio: "xMidYMid meet" }, root);
    // the blurred bed, placed so its paper strip sits at y 342-482 whatever the stage's shape
    const bgUrl = ((Kit && Kit.root) || "") + BG;
    s("image", { href: Kit && Kit.url ? Kit.url(BG) : bgUrl, x: -800, y: -470, width: 2400, height: 1600, preserveAspectRatio: "none", opacity: 0.95, class: "hs-bg" }, svg);
    s("rect", { x: -2000, y: -2000, width: 5000, height: 5000, fill: "#fffaf0", opacity: 0.22 }, svg);
    const S = { root, svg, s, h, ctx, level: ctx.level, game: opts.game || (ctx.game && ctx.game.id) };
    S.layer = s("g", { class: "hs-art" }, svg);
    S.fx = s("g", { class: "hs-fx" }, svg);

    /* ---- coordinates ---- */
    S.pt = (e) => {
      const m = svg.getScreenCTM();
      if (!m) return { x: 0, y: 0 };
      const p = svg.createSVGPoint();
      p.x = e.clientX;
      p.y = e.clientY;
      const q = p.matrixTransform(m.inverse());
      return { x: q.x, y: q.y };
    };
    S.client = (x, y) => {
      const m = svg.getScreenCTM();
      const p = svg.createSVGPoint();
      p.x = x;
      p.y = y;
      const q = p.matrixTransform(m);
      return { x: q.x, y: q.y };
    };
    /** svg units per client px (for hit radii in fingers, not units) */
    S.unit = () => {
      const m = svg.getScreenCTM();
      return m ? 1 / m.a : 1;
    };

    /* ---- the patient's round face ---- */
    const faceBox = h("div", "hs-face", root);
    const fs = s("svg", { viewBox: "0 0 100 100" }, faceBox);
    const skin = opts.skin || "#e9b98f";
    s("circle", { cx: 50, cy: 54, r: 38, fill: skin }, fs);
    s("path", { d: "M14 46 Q18 12 50 12 Q84 12 86 46 Q70 26 50 28 Q30 26 14 46Z", fill: opts.hair || "#3b2415" }, fs);
    const cheeks = s("g", { opacity: 0 }, fs);
    s("circle", { cx: 30, cy: 64, r: 7, fill: "#f07a6a" }, cheeks);
    s("circle", { cx: 70, cy: 64, r: 7, fill: "#f07a6a" }, cheeks);
    const eyes = s("g", {}, fs);
    const mouth = s("path", { fill: "none", stroke: "#5b2a1a", "stroke-width": 4, "stroke-linecap": "round" }, fs);
    const extra = s("g", {}, fs);
    const MOODS = {
      neutral: { eyes: "open", mouth: "M38 72 L62 72" },
      happy: { eyes: "open", mouth: "M34 68 Q50 84 66 68" },
      ouch: { eyes: "shut", mouth: "M38 76 Q50 64 62 76" },
      wince: { eyes: "shut", mouth: "M36 72 L44 68 L50 74 L56 68 L64 72" },
      sad: { eyes: "open", mouth: "M38 76 Q50 66 62 76" },
      cold: { eyes: "open", mouth: "M36 72 L42 69 L48 73 L54 69 L60 73 L64 70", tint: "#bcd8f0", extra: "shiver" },
      hot: { eyes: "open", mouth: "M40 72 Q50 78 60 72", cheeks: 1, extra: "sweat" },
      read: { eyes: "open", mouth: "M42 70 Q50 82 58 70 Q50 74 42 70Z" },
      drink: { eyes: "shut", mouth: "M44 72 Q50 76 56 72" },
    };
    let faceT = null;
    S.face = (mood, ms) => {
      const m = MOODS[mood] || MOODS.neutral;
      while (eyes.firstChild) eyes.removeChild(eyes.firstChild);
      while (extra.firstChild) extra.removeChild(extra.firstChild);
      if (m.eyes === "shut") {
        s("path", { d: "M30 48 Q36 52 42 48", stroke: "#3b2415", "stroke-width": 4, fill: "none", "stroke-linecap": "round" }, eyes);
        s("path", { d: "M58 48 Q64 52 70 48", stroke: "#3b2415", "stroke-width": 4, fill: "none", "stroke-linecap": "round" }, eyes);
      } else {
        s("circle", { cx: 36, cy: 48, r: 4.5, fill: "#3b2415" }, eyes);
        s("circle", { cx: 64, cy: 48, r: 4.5, fill: "#3b2415" }, eyes);
      }
      mouth.setAttribute("d", m.mouth);
      mouth.setAttribute("fill", mood === "read" ? "#7a2a2a" : "none");
      cheeks.setAttribute("opacity", m.cheeks ? 0.8 : 0);
      faceBox.style.background = m.tint || "#fff";
      if (m.extra === "sweat") s("path", { d: "M82 40 Q86 48 82 52 Q78 48 82 40Z", fill: "#6bb7ea" }, extra);
      if (m.extra === "shiver") faceBox.classList.add("shake");
      else faceBox.classList.remove("shake");
      faceBox.dataset.mood = mood;
      clearTimeout(faceT);
      if (ms) faceT = setTimeout(() => S.face(opts.rest || "neutral"), ms);
    };
    S.face(opts.rest || "neutral");
    // D16 (1 Oct, CLN-42): no 🩺 badge in the corner; the doctor speaks from his box in the sidebar
    const Voice = Kit && Kit.Voice;
    if (Voice) {
      Voice.speakers.patient = () => faceBox;
      Voice.speakers.doctor = () => doc.querySelector(".cl-docbox .ng-face") || null;
    }

    /* ---- lines ---- */
    const asLine = (l) => (typeof l === "string" ? HS.ph(l) : l);
    S.say = (line, who = "doctor") => ctx.say(asLine(line), { who });
    /**
     * The "why" beat (13g, 13i): shown, not told: the patient's pained face, then the doctor's line (his goal:
     * a line to record, never an English caption). Only when the game runs on its own (the lab, standalone):
     * in a full run the diagnosis has already told it, so the game starts straight in (ctx.inRun).
     */
    S.standalone = !ctx.inRun;
    S.why = async (problem, goal) => {
      if (!S.standalone) return;
      S.face("ouch");
      await new Promise((r) => ctx.after(Kit && Kit.fast ? 80 : 1100, r));
      S.face("sad");
      void problem; // the problem is the face: no words (13g)
      void goal; // D9: the goal is the card's headline now, said by the card's read-along
      S.face(opts.rest || "neutral");
    };
    /**
     * Start the game: input is live at once (13i: never wait for the talking); the why beat (standalone only)
     * and the card's read-along run alongside. A tap during them simply goes ahead.
     */
    S.begin = (why) => {
      S.ready = true;
      const talk = (why ? S.why(why.problem, why.goal) : Promise.resolve()).then(() => ctx.card.speak && ctx.card.speak());
      return talk.catch(() => {});
    };

    /* ---- the tool shelf ---- */
    const shelf = h("div", "hs-tools", root);
    S.toolEls = {};
    S.sel = null;
    let onPick = null;
    S.tools = (list, fn) => {
      shelf.innerHTML = "";
      S.toolEls = {};
      // as many rows as fit the play area's height (a phone is short), then more columns
      const rowsFit = Math.max(2, Math.floor((root.getBoundingClientRect().height * 0.86 + 8) / 70));
      shelf.style.setProperty("--cols", Math.ceil(list.length / Math.min(6, rowsFit)));
      onPick = fn;
      list.forEach((t) => {
        const b = h("button", "hs-tool", shelf);
        b.type = "button";
        b.dataset.tool = t.id;
        if (t.colours) {
          const sw = h("span", "g sw", b);
          t.colours.forEach((c) => {
            const d = h("span", null, sw);
            d.className = "hs-sw";
            d.style.setProperty("--sw", HS.COLOURS[c] || c);
          });
        } else h("span", "g", b, t.glyph || "•");
        if (t.label) h("span", "l", b, t.label);
        if (t.bg) b.style.background = t.bg;
        // what came from the pharmacy (13) is still known (S.fromTray), but D16 (1 Oct, CLN-42): no gold
        // half-circle badge on the tools: an unexplained icon
        if (S.fromTray(t)) b.classList.add("from-tray");
        ctx.on(b, "click", (e) => {
          e.stopPropagation();
          if (!S.ready) return;
          S.did(); // the child is on it: the first-time help moves on
          S.pick(t.id);
          if (onPick) onPick(t.id, b);
        });
        S.toolEls[t.id] = b;
      });
    };
    S.pick = (id) => {
      S.sel = id;
      Object.entries(S.toolEls).forEach(([k, b]) => b.classList.toggle("sel", k === id));
      if (ctx.sfx) ctx.sfx("tap");
    };
    S.used = (id, on = true) => S.toolEls[id] && S.toolEls[id].classList.toggle("used", on);
    S.pulseTool = (id) => Object.entries(S.toolEls).forEach(([k, b]) => b.classList.toggle("pulse", k === id));

    /* ---- what came from the pharmacy (13: the tray feeds the heal game) ---- */
    const ALIAS = { bud: "cotton-bud", thermo: "thermometer", apple: "lollipop", cover: "patch", "care-patch": "patch", "care-drops": "drops", "care-plaster": "plaster", "cook-paani": "paani", "fru-02": "limu", "tool-tweezers": "tweezers" };
    const norm = (id) => ALIAS[id] || String(id || "").replace(/^(care|tool|cook)-/, "");
    const trayIds = new Set((ctx.tray || []).map((t) => norm(t.id)));
    S.fromTray = (t) => {
      if (!trayIds.size || !t) return false;
      const id = norm(t.from || t.id);
      if (trayIds.has(id)) return true;
      if (/^pl-/.test(id) && trayIds.has("plaster")) return true; // the scrape's coloured plasters
      if (/^jug-/.test(id) && (trayIds.has("jug-hot") || trayIds.has("jug-cold"))) return true;
      return false;
    };

    /* ---- the first-time help: the ghost finger on the shared onboarding kit (13g, UX 8) ----
     * No words and no device voice: everything but the one thing is dimmed, the ghost finger does the
     * move once (tap, drag, hold, swipe) on its target, the child does it, then the next thing is lit.
     * What the child hears is the doctor's line with the card's read-along (the card), never a cue.
     *   S.cue(kind, spec, target, then?)   spec = def.cues[kind]: {gesture, to?, then?}
     *     target: an element, {x, y} in svg units, or a function returning either (the tool or the spot)
     *     spec.then / then: the second thing (after a tool: the spot on the close-up), tapped
     * Once per profile per game and kind (UIStore "onboarded"); &cues=1 shows it every time, &cues=0 never.
     * S.cueLog lists every kind whose help was asked for (the tests check every step kind has one).
     */
    const force = (() => {
      try {
        return new URLSearchParams(global.location.search).get("cues");
      } catch (e) {
        return null;
      }
    })();
    S.cuesOn = force !== "0" && !!global.Onboard && ctx.onboardOn !== false;
    S.cueLog = [];
    const rectOf = (p, pad = 34) => () => {
      const t = typeof p === "function" ? p() : p;
      if (!t) return null;
      if (t.getBoundingClientRect) return t;
      if (t.x != null) {
        const c = S.client(t.x, t.y);
        const r = (t.r ? t.r / S.unit() : pad);
        return [c.x - r, c.y - r, 2 * r, 2 * r];
      }
      return null;
    };
    let cueId = null;
    const mine = () => global.Onboard && global.Onboard.active && global.Onboard.active() && cueId && global.Onboard.active().id === cueId;
    S.uncue = () => {
      if (mine()) global.Onboard.active().skip();
    };
    /** The child acted: the help moves to its next thing (or ends). */
    S.lastDid = 0;
    S.did = () => {
      S.lastDid = Date.now();
      if (global.Onboard && global.Onboard.signal) global.Onboard.signal("hs-did");
    };
    S.cue = (key, spec, target, then) => {
      S.cueLog.push(key);
      if (!S.cuesOn || !spec || spec.watch) return; // a step the child only watches has nothing to demo
      const sp = typeof spec === "string" ? { gesture: "tap" } : spec;
      const g = sp.gesture || "tap";
      const first = rectOf(target);
      if (!first()) return;
      const isTool = (() => {
        const t = typeof target === "function" ? target() : target;
        return !!(t && t.closest && t.closest(".hs-tools, .cl-actions, .njg-btn, .njg-pills"));
      })();
      const steps = [];
      // the tool is already in hand (picking it opened this step): start at the second thing
      const held = isTool && (() => {
        const t = typeof target === "function" ? target() : target;
        return t && t.dataset && t.dataset.tool && t.dataset.tool === S.sel;
      })();
      if (held) {
        /* no first step */
      } else if (g === "drag" && sp.to) {
        const to = rectOf(sp.to);
        steps.push({ spotlight: [first, to], ghost: { gesture: "drag", from: first, to }, wait: "hs-did" });
      } else steps.push({ spotlight: first, ghost: { gesture: g }, wait: isTool ? "tap" : "hs-did" });
      const nx = then || sp.then;
      if (nx) {
        const t2 = rectOf(nx.target || nx);
        const g2 = nx.gesture || "tap";
        const to2 = nx.to ? rectOf(nx.to) : null;
        if (t2()) steps.push({ spotlight: to2 ? [t2, to2] : t2, ghost: to2 ? { gesture: g2, from: t2, to: to2 } : { gesture: g2 }, wait: "hs-did" });
      }
      if (!steps.length) return;
      S.uncue();
      cueId = `clinic/heal-${S.game}-${key}`;
      const asked = Date.now();
      const id = cueId;
      global.Onboard.run(cueId, steps, { force: force === "1", idleMs: 6000 })
        .then((how) => {
          // SH-46 (1 Oct, P32): a move the child has met before but isn't doing now is shown again after a pause,
          // not only the first time ever
          if (how !== "seen") return;
          ctx.after(8000, () => {
            if (S.lastDid > asked || cueId !== id || mine()) return;
            global.Onboard.run(id, steps, { force: true, idleMs: 6000 }).catch(() => {});
          });
        })
        .catch(() => {});
    };
    // the child has started on the close-up: the help moves on
    ctx.on(svg, "pointerdown", () => S.did());
    S.markSeen = () => {};

    /* ---- the count-up (Cook rule Q7) ----
     * The host writes the count (ctx.tally's chip, and at level 1 the card's row, said aloud: G6), so
     * nothing is drawn here: at level 3 the count is heard only, and said here. S.count(null) is a no-op.
     */
    S.count = (n, o = {}) => {
      if (n == null) return;
      if (ctx.level >= 3 && HS.num(n) && Voice && !o.silent) Voice.say(Lg().num(n, { cap: true }), { who: "doctor", noBubble: true });
    };

    /**
     * D5 (SH-38): close a step by itself once it can (level 1 at the count): test() -> true (now), false (wait a
     * beat: the game is busy), or "stop" (the step moved on).
     */
    S.when = (test, fn, first = 300) => {
      const tick = () => {
        const r = test();
        if (r === "stop") return;
        if (r) fn();
        else ctx.after(150, tick);
      };
      ctx.after(first, tick);
    };

    /* ---- the gentle timer ---- */
    S.timer = (ms, onEnd) => {
      const el = h("div", "hs-timer", root);
      const bar = h("i", null, el);
      const t0 = Date.now();
      let stopped = false;
      let paused = 0;
      let pausedAt = 0;
      const tick = () => {
        if (stopped) return;
        const now = pausedAt || Date.now();
        const left = Math.max(0, ms - (now - t0 - paused));
        bar.style.width = `${(100 * left) / ms}%`;
        el.classList.toggle("low", left < ms * 0.25);
        if (left <= 0) {
          stopped = true;
          el.remove();
          onEnd && onEnd();
          return;
        }
        ctx.after(200, tick);
      };
      tick();
      return {
        el,
        stop() {
          stopped = true;
          el.remove();
        },
        pause() {
          if (!pausedAt) pausedAt = Date.now();
        },
        resume() {
          if (pausedAt) (paused += Date.now() - pausedAt), (pausedAt = 0);
          tick();
        },
        left: () => Math.max(0, ms - ((pausedAt || Date.now()) - t0 - paused)),
      };
    };

    /** A short label by the face ("what they say", level 1 of the eye test). */
    S.said = (text) => {
      root.querySelectorAll(".hs-said").forEach((n) => n.remove());
      if (!text) return null;
      const el = h("div", "hs-said", root, text);
      const fr = faceBox.getBoundingClientRect();
      const rr = root.getBoundingClientRect();
      el.style.left = `${fr.right - rr.left + 8}px`;
      el.style.top = `${fr.top - rr.top + fr.height * 0.45}px`;
      return el;
    };

    S.clear = (g) => {
      while (g.firstChild) g.removeChild(g.firstChild);
    };
    S.destroy = () => {
      S.uncue();
      clearTimeout(faceT);
      root.remove();
    };
    return S;
  };
  return HS;
});

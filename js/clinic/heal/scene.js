/*
 * The heal games' close-up scene (clinic v2, design sheets part B;
 * docs/modes/clinic-v2-design-sheets.md). A PROTOTYPE layer: flat stand-in
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
 *   S.why(problem, goal)   the opening beat: the patient says the problem, the doctor the goal
 *   S.tools(list, onPick)  the tool shelf (stand-in buttons on the right); S.pick(id) selects
 *   S.cue(key, text, target)   the first-time cue: words + a pointing hand; S.uncue()
 *   S.count(n)       the count-up (Cook rule Q7): L1 shown and said, L2 shown, L3 said
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
  // the numbers the family has given (Cook's words); 1-5 only, so counts stay at 5 or under
  HS.NUM = { 1: "hakro", 2: "ba", 3: "trae", 4: "char", 5: "panj" };
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
  /** An English placeholder word ("to record"). */
  HS.ph = (english) => ({ kutchi: null, english, placeholder: true });
  /** The colours: English placeholders until the doctor's recording (Section G). */
  HS.COLOURS = { red: "#d8433f", blue: "#3f6fd8", green: "#3fa35b", yellow: "#f0c43a", orange: "#f08a2c", purple: "#8a55c8", white: "#f7f4ee" };

  /**
   * The shared blind bot. rows: [{id, options, answer}] (answer may be an
   * array for an ordered row; options then list the possible sequences).
   * A blind player sees the pictures but not the words: it guesses.
   */
  HS.STRATEGIES = ["fair", "random", "first-option", "last-option", "middle-option"];
  HS.bot = function (rows, rng) {
    const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    return {
      rows,
      strategies: HS.STRATEGIES,
      solve(strategy) {
        const res = rows.map((r) => {
          if (strategy === "fair") return true;
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
  const BG = "assets/clinic/rooms/cb6b-closeup-bed-blur-v1.webp";
  const CSS = `
  .hs-root{position:absolute;inset:0;z-index:5;overflow:hidden;background:linear-gradient(#efe3cc 0 55%,#9fbfa6 55%);touch-action:none;user-select:none;-webkit-user-select:none}
  .hs-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
  .hs-face{position:absolute;left:10px;top:10px;width:clamp(64px,12vmin,104px);height:clamp(64px,12vmin,104px);border-radius:50%;background:#fff;border:4px solid #d9bf95;box-shadow:0 4px 10px rgba(60,40,20,.18);z-index:7;pointer-events:none}
  .hs-face svg{width:100%;height:100%}
  .hs-face.shake{animation:hs-shake .35s 2}
  @keyframes hs-shake{25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
  .hs-doc{position:absolute;left:10px;bottom:10px;width:clamp(44px,8vmin,64px);height:clamp(44px,8vmin,64px);border-radius:50%;background:#e8f3ef;border:3px solid #2e8b7a;display:grid;place-items:center;font-size:clamp(20px,4vmin,30px);z-index:7;pointer-events:none}
  .hs-tools{position:absolute;right:8px;top:50%;transform:translateY(-50%);display:grid;grid-template-columns:repeat(var(--cols,1),auto);gap:8px;z-index:8;pointer-events:none}
  .hs-tools>*{pointer-events:auto}
  .hs-root .hs-tool{flex:0 0 auto;width:auto;margin:0;box-sizing:border-box;min-width:clamp(60px,9vw,96px);min-height:clamp(46px,7vh,66px);border-radius:16px;border:4px solid #d8c6a8;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;font:700 12px/1.1 system-ui,sans-serif;color:#5b4636;cursor:pointer;padding:3px 6px}
  .hs-tool .g{font-size:clamp(20px,3.4vmin,30px);line-height:1.1}
  .hs-tool .sw{display:flex;gap:2px}
  .hs-tool.sel{border-color:#2e8b7a;box-shadow:0 0 0 5px rgba(46,139,122,.35)}
  .hs-tool.used{opacity:.45}
  .hs-tool.pulse{animation:hs-pulse 1s ease-in-out infinite}
  @keyframes hs-pulse{50%{box-shadow:0 0 0 7px rgba(240,180,60,.55)}}
  .hs-count{position:absolute;left:50%;top:8px;transform:translateX(-50%);min-width:54px;padding:2px 14px;border-radius:18px;background:#fff;border:3px solid #2e8b7a;font:800 clamp(20px,4vmin,30px)/1.2 system-ui,sans-serif;color:#2e6b5f;text-align:center;z-index:7;pointer-events:none}
  .hs-count.pop{animation:hs-pop .3s}
  @keyframes hs-pop{50%{transform:translateX(-50%) scale(1.25)}}
  .hs-timer{position:absolute;left:22%;right:22%;top:clamp(46px,8vmin,60px);height:12px;border-radius:8px;background:rgba(255,255,255,.7);border:2px solid #d8c6a8;z-index:7;overflow:hidden;pointer-events:none}
  .hs-timer i{position:absolute;left:0;top:0;bottom:0;background:#6bbf8a;transition:width .25s linear}
  .hs-timer.low i{background:#f0a040}
  .hs-cue{position:absolute;z-index:9;max-width:min(46%,340px);background:#fffbe6;border:3px solid #e0a63a;border-radius:16px;padding:6px 12px;font:700 clamp(13px,2.2vmin,17px)/1.25 system-ui,sans-serif;color:#5b3c12;box-shadow:0 4px 12px rgba(80,50,10,.2);pointer-events:none}
  .hs-cue b{color:#8a3a52}
  .hs-hand{position:absolute;z-index:9;font-size:clamp(30px,6vmin,46px);pointer-events:none;transform:translate(-20%,-10%);animation:hs-hand 1.1s ease-in-out infinite}
  @keyframes hs-hand{50%{transform:translate(-20%,-10%) translateY(10px) scale(.92)}}
  .hs-said{position:absolute;z-index:8;background:#fff;border:3px solid #d9bf95;border-radius:14px;padding:3px 10px;font:800 clamp(14px,2.6vmin,20px)/1.2 system-ui,sans-serif;color:#3b2415;pointer-events:none;white-space:nowrap}
  `;

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
    const css = h("style", null, stage);
    css.textContent = CSS;
    const root = h("div", "hs-root", stage);
    root.dataset.place = opts.place || "limb";
    const svg = s("svg", { class: "hs-svg", viewBox: "0 0 800 500", preserveAspectRatio: "xMidYMid meet" }, root);
    // the blurred bed, placed so its paper strip sits at y 342-482 whatever the stage's shape
    const bgUrl = ((Kit && Kit.root) || "") + BG;
    s("image", { href: bgUrl, x: -300, y: -190, width: 1400, height: 933, preserveAspectRatio: "none", opacity: 0.95 }, svg);
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
    h("div", "hs-doc", root, "🩺");
    const Voice = Kit && Kit.Voice;
    if (Voice) {
      Voice.speakers.patient = () => faceBox;
      Voice.speakers.doctor = () => root.querySelector(".hs-doc");
    }

    /* ---- lines ---- */
    const asLine = (l) => (typeof l === "string" ? HS.ph(l) : l);
    S.say = (line, who = "doctor") => ctx.say(asLine(line), { who });
    S.why = async (problem, goal) => {
      S.face("sad");
      await S.say(problem, "patient");
      S.face("neutral");
      await S.say(goal, "doctor");
    };

    /* ---- the tool shelf ---- */
    const shelf = h("div", "hs-tools", root);
    S.toolEls = {};
    S.sel = null;
    let onPick = null;
    S.tools = (list, fn) => {
      shelf.innerHTML = "";
      S.toolEls = {};
      shelf.style.setProperty("--cols", Math.ceil(list.length / 6));
      onPick = fn;
      list.forEach((t) => {
        const b = h("button", "hs-tool", shelf);
        b.type = "button";
        b.dataset.tool = t.id;
        if (t.colours) {
          const sw = h("span", "g sw", b);
          t.colours.forEach((c) => {
            const d = h("span", null, sw);
            d.style.cssText = `display:inline-block;width:16px;height:26px;border-radius:5px;background:${HS.COLOURS[c] || c};border:2px solid rgba(0,0,0,.2)`;
          });
        } else h("span", "g", b, t.glyph || "•");
        if (t.label) h("span", "l", b, t.label);
        if (t.bg) b.style.background = t.bg;
        ctx.on(b, "click", (e) => {
          e.stopPropagation();
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

    /* ---- the first-time cue: words for every step, a pointing hand ---- */
    const seenKey = `njg-heal-cues-${S.game}`;
    let seen = false;
    try {
      seen = global.localStorage && global.localStorage.getItem(seenKey) === "1";
    } catch (e) {
      /* private mode */
    }
    const force = (() => {
      try {
        return new URLSearchParams(global.location.search).get("cues");
      } catch (e) {
        return null;
      }
    })();
    S.cuesOn = force === "0" ? false : force === "1" || ctx.level === 1 || !seen;
    S.cueLog = [];
    let cueEl = null;
    let handEl = null;
    S.uncue = () => {
      if (cueEl) cueEl.remove();
      if (handEl) handEl.remove();
      cueEl = handEl = null;
    };
    /** target: {x, y} in svg units, an element, or a function returning either */
    S.cue = (key, text, target) => {
      S.cueLog.push(key);
      if (!S.cuesOn) return;
      S.uncue();
      const rr = root.getBoundingClientRect();
      let p = typeof target === "function" ? target() : target;
      let cx = rr.width / 2;
      let cy = rr.height / 2;
      if (p && p.getBoundingClientRect) {
        const r = p.getBoundingClientRect();
        cx = r.left + r.width / 2 - rr.left;
        cy = r.top + r.height / 2 - rr.top;
      } else if (p && p.x != null) {
        const c = S.client(p.x, p.y);
        cx = c.x - rr.left;
        cy = c.y - rr.top;
      }
      cueEl = h("div", "hs-cue", root);
      cueEl.dataset.cue = key;
      cueEl.innerHTML = text;
      handEl = h("div", "hs-hand", root, "👆");
      handEl.style.left = `${cx}px`;
      handEl.style.top = `${cy}px`;
      // the words sit above the hand, or below when it points high; kept on screen
      const w = Math.min(rr.width * 0.46, 340);
      let left = Math.max(8, Math.min(rr.width - w - 8, cx - w / 2));
      cueEl.style.left = `${left}px`;
      if (cy > rr.height * 0.45) cueEl.style.bottom = `${Math.max(8, rr.height - cy + 26)}px`;
      else cueEl.style.top = `${Math.min(rr.height - 60, cy + 54)}px`;
      if (Voice && !Voice.quiet) Voice.say(HS.ph(cueEl.textContent), { who: "nani", noBubble: true });
    };
    S.markSeen = () => {
      try {
        global.localStorage && global.localStorage.setItem(seenKey, "1");
      } catch (e) {
        /* private mode */
      }
    };

    /* ---- the count-up (Cook rule Q7) ---- */
    const countEl = h("div", "hs-count", root);
    countEl.style.display = "none";
    S.count = (n, o = {}) => {
      if (n == null) {
        countEl.style.display = "none";
        return;
      }
      const L = ctx.level;
      if (L <= 2 && !o.hidden) {
        countEl.style.display = "";
        countEl.textContent = o.label ? `${o.label} ${n}` : String(n);
        countEl.classList.remove("pop");
        void countEl.offsetWidth;
        countEl.classList.add("pop");
      } else countEl.style.display = "none";
      if ((L === 1 || L >= 3) && HS.NUM[n] && Voice && !o.silent) Voice.say({ kutchi: HS.cap(HS.NUM[n]), english: String(n) }, { who: "doctor", noBubble: true });
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
      clearTimeout(faceT);
      root.remove();
      css.remove();
    };
    return S;
  };
  return HS;
});

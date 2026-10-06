/*
 * Nani's guide box (Zafar, 28 Sept 2026; docs/feedback/cook-ui-feedback-2026-09-28.md 3).
 * One shared component, so every mode can put Nani at the top of its sidebar:
 *
 *   [face)] what to do now, in Kutchi, up to 2 lines       [bulb] [mute]
 *
 *  - Sidebar v3 (Zafar, 28 Sept late; docs/feedback/cook-ui-feedback-2026-09-28.md 10): a calm sage green box
 *    with a darker sage band down the left (one CSS variable, --nani-sage), so she stands apart from
 *    the panel and the cards;
 *  - her face is the replay button (a small speaker badge on its corner), as on every card
 *    (hearing her again works even when she's muted: you asked);
 *  - the text is what to do NOW (a line of hers, or an English placeholder flagged "to record"
 *    until the family records it), up to 2 lines, shrunk to fit, never cut off with "..."
 *    (js/shared/fit.js "fit2" when loaded);
 *  - the mute button mutes or unmutes her voice. It's remembered for every mode, per player, in the
 *    one save (Save flag "naniMuted"); muted, she still shows what she'd say;
 *  - the light bulb (translate) lives here too, drawn with the results art.
 *
 *   const g = NaniGuide.mount(el, {face, bulb, bulbId, onBulb, onReplay, base})
 *   g.set(html, {rec})      the line now (html: the host's own word markup); rec: flagged "to record"
 *   g.talk(on)              her face bobs while she talks
 *   g.replaying(on)         her face's badge lights while her line is heard again
 *   g.el                    the box
 *   g.strip(on)             R4: the asker is the guide (Nani's pantry list): the box keeps only its tools (no second
 *                           face, no line); the host shows the line as the card's top strip
 *   NaniGuide.muted()       is her voice off? (every mode asks this before she speaks)
 *
 * The step rules (decision 55, rules R1-R4 of docs/design-language/guide-and-card.md), one for every mode:
 *   const st = NaniGuide.stepper({show(html, {rec}), clear(), speak(step) -> Promise, glow(step, on), level() -> n,
 *                                 pauseMs(level) -> ms, onHelp(step)})
 *   st.open({html, rec, line, ...})   a step opens: ONE line, the next step only (never the whole card). Level 1:
 *                           shown and said at once, the glow after the pause. Level 2+: nothing until the pause,
 *                           then the line, said, with the glow (the first step too). Help, not a giveaway.
 *   st.close()              the step ended: its line clears (a spoken line never outstays its step), the glow goes
 *   st.poke()               the child did something: the pause starts again
 *   st.help()               the help now (the bulb, a wrong tap): line, voice and glow
 *   st.current              the open step, or null
 *   NaniGuide.setMuted(v)   NaniGuide.onMute(fn) -> unsubscribe
 *
 * Plain <script>: window.NaniGuide (and Shared.guide). Styles: css/shared/guide.css.
 */
(function (root, factory) {
  const G = factory(root);
  if (typeof module === "object" && module.exports) module.exports = G;
  else {
    root.NaniGuide = G;
    (root.Shared = root.Shared || {}).guide = G;
  }
})(typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const FLAG = "naniMuted";
  const G = { FLAG };
  let memMuted = false;
  const listeners = [];
  const save = () => root.Save || null;

  G.muted = function () {
    const S = save();
    try {
      if (S) return !!S.flag(FLAG);
    } catch (e) {
      /* storage blocked: the visit's own value */
    }
    return memMuted;
  };
  G.setMuted = function (v) {
    memMuted = !!v;
    const S = save();
    try {
      if (S) S.setFlag(FLAG, !!v);
    } catch (e) {
      /* memory only */
    }
    listeners.slice().forEach((fn) => {
      try {
        fn(!!v);
      } catch (e) {
        /* a listener's own problem */
      }
    });
  };
  G.onMute = (fn) => (listeners.push(fn), () => listeners.splice(listeners.indexOf(fn), 1));

  /** The pause before help, by level (ms): about 5 s at level 1 (the glow), a little longer from level 2. */
  G.PAUSE = [5000, 6000, 7000, 8000];
  G.stepper = function (o = {}) {
    const lv = () => Math.max(1, Number(o.level ? o.level() : 1) || 1);
    const pause = (l) => (o.pauseMs ? o.pauseMs(l) : G.PAUSE[Math.min(G.PAUSE.length, l) - 1]);
    let cur = null;
    let timer = null;
    let shownAt = 0;
    const call = (fn, ...a) => {
      try {
        return fn ? fn(...a) : undefined;
      } catch (e) {
        return undefined;
      }
    };
    const stopTimer = () => (clearTimeout(timer), (timer = null));
    const show = (s) => {
      if (!s || s.shown) return;
      s.shown = true;
      shownAt = Date.now();
      call(o.show, s.html, { rec: !!s.rec });
    };
    const say = (s) => Promise.resolve(G.muted() ? null : call(o.speak, s)).catch(() => {});
    const helpNow = (s) => {
      if (!s || s !== cur) return;
      show(s);
      s.helped = true;
      call(o.onHelp, s);
      say(s);
      call(o.glow, s, true);
    };
    const arm = () => {
      stopTimer();
      const s = cur;
      // helpAfter false: the host's own hesitation help runs this step (the line is still the box's)
      if (!s || s.helped || s.helpAfter === false) return;
      timer = setTimeout(() => helpNow(s), pause(lv()));
    };
    const st = {
      get current() {
        return cur;
      },
      open(step) {
        st.close();
        cur = Object.assign({ shown: false, helped: false }, step);
        if (lv() <= 1 && !cur.quiet) {
          show(cur);
          say(cur);
        } else call(o.clear);
        arm();
        return cur;
      },
      close() {
        stopTimer();
        const s = cur;
        cur = null;
        if (s) call(o.glow, s, false);
        call(o.clear);
      },
      poke() {
        if (cur && !cur.helped) arm();
      },
      help() {
        helpNow(cur);
      },
      shownFor: () => (cur && cur.shown ? Date.now() - shownAt : 0),
    };
    return st;
  };

  const SPEAKER = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path class="ng-waves" d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><path class="ng-slash" d="M16 9l6 6M22 9l-6 6" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /**
   * Build the box inside `el` (emptied). opts: face (img URL), bulb (img URL, optional), bulbId, onBulb, onReplay(faceButton),
   * name (who the box is: "Nani" by default; the clinic's is the doctor, 13f: Nani isn't at the clinic).
   */
  G.mount = function (el, opts = {}) {
    if (!el) return null;
    el.classList.add("njg-guide");
    el.setAttribute("role", "group");
    const who = esc(opts.name || "Nani");
    el.setAttribute("aria-label", opts.name || "Nani");
    el.innerHTML = `
      <button class="ng-face face-say" type="button" aria-label="Hear ${who} again" title="Hear ${who} again"><img alt="${who}" src="${esc(opts.face || "")}"><span class="say-badge" aria-hidden="true"></span></button>
      <span class="ng-say"></span>
      <span class="ng-tools">
        ${opts.bulb || opts.onBulb ? `<button class="ng-bulb" type="button"${opts.bulbId ? ` id="${esc(opts.bulbId)}"` : ""} aria-label="Show it in English for a moment" title="Show it in English for a moment">${opts.bulb ? `<img alt="" src="${esc(opts.bulb)}">` : ""}<span class="bulb-t"></span></button>` : ""}
        <button class="ng-mute" type="button" aria-pressed="false">${SPEAKER}</button>
      </span>`;
    const face = el.querySelector(".ng-face");
    const say = el.querySelector(".ng-say");
    const mute = el.querySelector(".ng-mute");
    const paint = () => {
      const m = G.muted();
      el.classList.toggle("muted", m);
      mute.setAttribute("aria-pressed", String(m));
      const nm = opts.name || "Nani";
      const label = opts.name ? (m ? `${nm} is quiet. Tap to hear again` : `Make ${nm} quiet`) : m ? "Nani is quiet. Tap to hear her again" : "Make Nani quiet";
      mute.setAttribute("aria-label", label);
      mute.title = label;
    };
    mute.addEventListener("click", (ev) => {
      ev.stopPropagation();
      G.setMuted(!G.muted());
      mute.classList.remove("flash");
      void mute.offsetWidth;
      mute.classList.add("flash");
    });
    face.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (opts.onReplay) opts.onReplay(face);
    });
    const bulb = el.querySelector(".ng-bulb");
    if (bulb && opts.onBulb) bulb.addEventListener("click", (ev) => (ev.stopPropagation(), opts.onBulb(bulb)));
    const off = G.onMute(paint);
    paint();
    const fit = () => root.FitText && say.firstChild && root.FitText.fit(say.firstChild);
    const ro = typeof ResizeObserver === "function" ? new ResizeObserver(fit) : null;
    if (ro) ro.observe(say);
    let text = "";
    return {
      el,
      set(html, { rec = false } = {}) {
        if (html === text && say.classList.contains("rec") === !!rec) return;
        text = html;
        say.innerHTML = `<span class="ng-line fit fit2">${html}</span>${rec ? `<small class="ng-rec">to record</small>` : ""}`;
        say.classList.toggle("rec", !!rec);
        fit();
        el.classList.remove("new");
        void el.offsetWidth;
        el.classList.add("new");
      },
      talk(on) {
        el.classList.toggle("talk", !!on);
      },
      replaying(on) {
        face.classList.toggle("on", !!on);
      },
      strip(on) {
        el.classList.toggle("ng-strip", !!on);
      },
      destroy() {
        off();
        if (ro) ro.disconnect();
        el.innerHTML = "";
      },
    };
  };
  return G;
});

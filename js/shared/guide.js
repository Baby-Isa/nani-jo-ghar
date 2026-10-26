/*
 * Nani's guide box (Zafar, 28 Sept 2026; docs/archive/feedback/cook-ui-feedback-2026-09-28.md 3).
 * One shared component, so every mode can put Nani at the top of its sidebar:
 *
 *   [face)] what to do now, in Kutchi, up to 2 lines       [bulb] [mute]
 *
 *  - Sidebar v3 (Zafar, 28 Sept late; docs/archive/feedback/cook-ui-feedback-2026-09-28.md 10): a calm sage green box
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
 *   g.mood(m)               her face in that mood (opts.faces: {mood: {src, crop}}, each head cut once; ART-10)
 *   g.el                    the box
 *   g.strip(on)             R4: the asker is the guide (Nani's pantry list): the box keeps only its tools (no second
 *                           face, no line); the host shows the line as the card's top strip
 *   NaniGuide.muted()       is her voice off? (every mode asks this before she speaks)
 *
 * The step rules (decision 55, rules R1-R4 of docs/design-language/guide-and-card.md), one for every mode:
 *   const st = NaniGuide.stepper({show(html, {rec}), clear(), speak(step) -> Promise, glow(step, on), level() -> n,
 *                                 pauseMs(level) -> ms, onHelp(step)})
 *   st.open({html, rec, line, ...})   a step opens: ONE line, the next step only (never the whole card), shown at once in
 *                           the box at every level (SH-63, Zafar 21 Oct: the guide says the step, the card keeps the order).
 *                           Nothing is said or lit at the open (SH-60, SH-95: the help ladder below); the step call of the
 *                           level table (Nani saying each step once as it opens) hooks in as `call(step)`.
 *   st.close([{clear}])     the step ended: the glow goes; its line stays until the next step opens (SH-63), cleared
 *                           with {clear: true} (the stage's end)
 *   st.poke()               the child did something: the page's idle clock starts again (it also starts on every tap, drag or key)
 *   st.help()               the help now (the bulb, a wrong tap): line, voice and glow
 *   NaniGuide.PAUSE / REPEAT / BULB_PULSE   the ladder's table (below); NaniGuide.idleMs() ms since the last action;
 *   NaniGuide.pulseBulbs(on) both light bulbs pulse (class help-pulse)
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

  /*
   * The help ladder (Zafar, 17 Oct; decision 4: SH-60, SH-95, SH-96). One table for every station, counted from the child's
   * LAST ACTION (any tap, drag or key: the idle clock below), never from when a step opened:
   *   PAUSE[level-1]   how long she must have done nothing before Nani helps: her line and the glow at the SAME moment
   *                    (2 s later than before: 7, 8, 11, 15 s)
   *   REPEAT           a help line is never said again within this time (never twice in a row, PAN-16); a help never comes
 *                    again with no action since it (SH-60: it "shouldn't persist"): after an action the pause runs again
   *   BULB_PULSE       after this long stuck both light bulbs pulse, so the child knows they can be tapped (15-20 s)
   * Nothing is said or lit when a step opens (the "step call", Nani saying each step once as it opens, is the next wave's:
   * pass `call(step)` to the stepper and it runs at that moment). PAUSE and BULB_PULSE are the ONE ladder table, data/shared.json
   * helpMs and bulbPulseMs (S13-A1), read through js/shared/tokens.js (Tokens.ladder) every time, so every game has the same; no
   * copy here. Until the table has loaded, every pause is endless (nothing helps yet). A test may set its own (G.PAUSE = [...]).
   */
  const ladder = (k) => {
    const T = root.Tokens || (typeof module === "object" && module.exports && typeof require === "function" ? require("./tokens.js") : null);
    return T && T.ladder ? T.ladder[k] : null;
  };
  let pauseOwn = null;
  let pulseOwn = null;
  Object.defineProperty(G, "PAUSE", { enumerable: true, get: () => pauseOwn || ladder("helpMs") || [Infinity, Infinity, Infinity, Infinity], set: (v) => (pauseOwn = v) });
  Object.defineProperty(G, "BULB_PULSE", { enumerable: true, get: () => (pulseOwn != null ? pulseOwn : ladder("bulbPulseMs") != null ? ladder("bulbPulseMs") : Infinity), set: (v) => (pulseOwn = v) });
  G.REPEAT = 10000;
  G.idleHelp = false;
  /**
   * ART-19 (Zafar, 22 Oct, A10: the doctor talking in the pop-up box is "way too quick ... the mouth opens and closes too wide ...
   * blinks so rapidly: slow it way down and open the mouth less"): ONE calm cadence for every talking face (Nani's box here,
   * the doctor's card faces and figure, js/clinic/kit.js). The mouth is open only briefly and shut for longer, about two flaps
   * a second (it reads as opening less); a blink is a slow 220 ms, every 5.5 to 9 s.
   */
  G.MOUTH = { open: 150, shut: 330, shutJitter: 140, blink: 220, blinkEvery: 5500, blinkJitter: 3500 };
  /** How long the mouth stays as it is now (open: true, just opened). */
  G.mouthMs = (open) => (open ? G.MOUTH.open : G.MOUTH.shut + Math.random() * G.MOUTH.shutJitter);
  /** The wait to the next blink. */
  G.blinkGap = () => G.MOUTH.blinkEvery + Math.random() * G.MOUTH.blinkJitter;
  const clock ={ t: Date.now(), on: false };
  /** The idle clock: one listener for the page, so every station pokes it on every action (SH-60: "the timer restarts on every action"). */
  G.watch = function () {
    const d = root.document;
    if (clock.on || !d || !d.addEventListener) return;
    clock.on = true;
    const bump = () => (clock.t = Date.now());
    ["pointerdown", "pointerup", "keydown", "wheel", "touchstart"].forEach((ev) => d.addEventListener(ev, bump, true));
    d.addEventListener("pointermove", (e) => e.buttons && bump(), true); // a drag or a stir is doing something
  };
  G.poke = () => (clock.t = Date.now());
  /** ms since the child last did anything (or a station started). */
  G.idleMs = () => Date.now() - clock.t;
  G.lastAction = () => clock.t;
  /** The pulse on both light bulbs (the English bulb in her box and the closed card's small bulb): a class the page styles (css/cook.css). */
  G.BULBS = "#btn-bulb, .ng-bulb, .oc-look.bulb";
  let pulsing = false;
  G.pulseBulbs = function (on) {
    const d = root.document;
    if (!d || !d.querySelectorAll) return;
    d.querySelectorAll(G.BULBS).forEach((b) => b.classList.toggle("help-pulse", !!on));
    if (!!on !== pulsing) {
      pulsing = !!on;
      logHelp("bulb-pulse", { step: pulsing ? "on" : "off" }); // (a test log: contract-25)
    }
  };
  // what has been said, and when (every Cook line is marked as it is spoken, js/cook/words.js Lang.speak): the help never says
  // a line again that was said less than REPEAT ago
  const spoken = new Map();
  const norm = (t) => String(t || "").toLowerCase().replace(/\s+/g, " ").trim();
  G.markSaid = (t) => spoken.set(norm(t), Date.now());
  G.recentlySaid = (t) => Date.now() - (spoken.get(norm(t)) || -1e9) < G.REPEAT;
  // s08 w6B (contract-22, tadka: "Pela loon." said as part of her whole list, then again as its step's call 1.8 s later): said
  // a moment ago on its own or inside a longer line
  G.recentlySaidIn = (t) => {
    const k = norm(t);
    if (!k) return false;
    const now = Date.now();
    for (const [line, at] of spoken) if (now - at < G.REPEAT && line.includes(k)) return true;
    return false;
  };
  const logHelp = (what, info) => {
    // SH-60 (s08 w6J): when Nani last helped, so a glow a station asked for lights with her line, never seconds after it
    if (what === "help") G.lastHelpAt = Date.now();
    try {
      if (root.Lifecycle && root.Lifecycle.note) root.Lifecycle.note(what, info);
    } catch (e) {
      /* only a log (the contract checks read it) */
    }
  };
  G.logHelp = logHelp;

  G.stepper = function (o = {}) {
    G.watch();
    const lv = () => Math.max(1, Number(o.level ? o.level() : 1) || 1);
    const pause = (l) => (o.pauseMs ? o.pauseMs(l) : G.PAUSE[Math.min(G.PAUSE.length, l) - 1]);
    let cur = null;
    let timer = null;
    let shownAt = 0;
    let seq = 0;
    const call = (fn, ...a) => {
      try {
        return fn ? fn(...a) : undefined;
      } catch (e) {
        return undefined;
      }
    };
    const stopTimer = () => (clearInterval(timer), (timer = null));
    const show = (s) => {
      if (!s || s.shown) return;
      s.shown = true;
      shownAt = Date.now();
      call(o.show, s.html, { rec: !!s.rec });
    };
    // the step's words: the whole line and each of its parts (a line made of two is said part by part)
    const textsOf = (s) => {
      const l = s.line;
      if (!l || !l.segs) return [String(s.html || "")];
      const plain = (x) => x.segs.map((g) => g.t).join("");
      return [plain(l)].concat((l.parts || []).map(plain));
    };
    const say = (s, manual = false) => {
      if (G.muted()) return Promise.resolve(null);
      // PAN-16: a line is not said again within REPEAT of its last saying (by the help, or by the station itself: the
      // daar's tadka order said at the start)
      if (!manual && textsOf(s).some((t) => G.recentlySaid(t))) return Promise.resolve(null);
      textsOf(s).forEach(G.markSaid);
      return Promise.resolve(call(o.speak, s)).catch(() => {});
    };
    // the help: her line and the glow at the same moment (SH-60); the line is shown at once and said unless it was just said
    const helpNow = (s, { manual = false } = {}) => {
      if (!s || s !== cur) return;
      show(s);
      s.helped = true;
      s.helpedAt = Date.now();
      logHelp("help", { step: manual ? "asked" : "idle", by: `L${lv()} ${s.id || ""}` });
      call(o.onHelp, s);
      say(s, manual);
      // (the glow is lit in the same turn as her voice; a station's own glow calls wait for this moment: G.helping)
      G.helping = true;
      try {
        call(o.glow, s, true);
      } finally {
        G.helping = false;
      }
    };
    // when the next help is due: PAUSE of no action after the step opened or the last action. SH-60 (Zafar: the help "shouldn't
    // persist"): once helped, it never comes again while the child does nothing (it used to repeat every REPEAT, line and glow);
    // after an action the pause applies again from that action
    const due = (s) => {
      const base = Math.max(clock.t, s.openedAt);
      if (!s.helped) return base + pause(lv());
      if (clock.t <= s.helpedAt) return Infinity;
      return clock.t + pause(lv());
    };
    const arm = () => {
      stopTimer();
      const s = cur;
      // helpAfter false: the host's own hesitation help runs this step (the line is still the box's)
      if (!s || s.helpAfter === false) return;
      timer = setInterval(() => {
        if (s !== cur) return stopTimer();
        if (Date.now() >= due(s) - 15) helpNow(s);
      }, 200);
    };
    const st = {
      get current() {
        return cur;
      },
      open(step) {
        st.close();
        cur = Object.assign({ shown: false, helped: false, openedAt: Date.now(), id: ++seq }, step);
        // SH-63 (Zafar, 21 Oct: "the guide says the step, the card keeps the order"): the box shows the step's line as the step
        // opens, at every level, and keeps it until the step closes, so it is never empty between step calls. Nothing is said
        // or lit at the open: the voice is the step call (o.call) and the help after the pause, with the glow (SH-60, SH-95)
        call(o.clear);
        show(cur);
        logHelp("step-open", { step: String(cur.id), by: `L${lv()}` });
        call(o.call, cur);
        arm();
        return cur;
      },
      /**
       * The step ended: its glow goes and its help stops. SH-63 (Zafar, 21 Oct: the guide box always says the current step,
       * never empty): its line stays in the box until the next step opens (open() replaces it) or the stage ends
       * (close({clear: true}), below); a host clears it itself when there is nothing left to do (Cook's UI.guideClear).
       */
      close(opt) {
        stopTimer();
        const s = cur;
        cur = null;
        if (s) call(o.glow, s, false);
        if (opt && opt.clear) call(o.clear);
      },
      /** The child did something: the pause starts again (every station's actions also poke the page's idle clock). */
      poke() {
        G.poke();
      },
      help() {
        // (G.idleHelp: a station's own timer asks for the step's help because the child has been idle: that is the ladder's help,
        // not one the child asked for, so the same-line rule and the log treat it so)
        helpNow(cur, { manual: !G.idleHelp });
      },
      shownFor: () => (cur && cur.shown ? Date.now() - shownAt : 0),
    };
    // a stage that ends takes its open step with it: no help line or glow ever comes after the stage (contract-3)
    try {
      if (root.Lifecycle && root.Lifecycle.onStageEnd) root.Lifecycle.onStageEnd(() => st.close({ clear: true }));
    } catch (e) {
      /* no lifecycle on this page */
    }
    return st;
  };

  const CUTS = new Map(); // src|crop -> Promise of the cut head (ART-10)
  const CUT_DONE = new Map(); // src|crop -> the cut head, once ready
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
    // ART-10 (s07 fix round): her face follows her mood. opts.faces: {mood: {src, crop: [x, y, w, h] in the picture's
    // px}}: each mood's head is cut once from its picture (the same pictures as her counter sprite), and g.mood(m)
    // shows it; until a cut is ready (or with no faces) the box keeps opts.face
    const faceImg = face.querySelector("img");
    const moods = {};
    let moodNow = "neutral";
    const put = (u) => u && faceImg.getAttribute("src") !== u && faceImg.setAttribute("src", u);
    /*
     * ART-19 (s08 w6F; the judge: "her mouth keeps the same closed smile ... while the line plays"): while she talks her
     * mouth moves: her talking face and her resting one in turn (two mouth frames on the one registered canvas, in the calm
     * G.MOUTH cadence the clinic's figures share), until the mood changes. ART-10: and she blinks now and then at rest by
     * herself (her blink face for G.MOUTH.blink every G.blinkGap()), unless the host blinked her a moment ago (Cook's own blink).
     */
    // ART-19 (Zafar, 22 Oct, A10: "way too quick ... too much open, too much closed ... blinks so rapidly: slow it way down and
    // open the mouth less"): the calm cadence of G.MOUTH, shared with the doctor's faces (js/clinic/kit.js)
    let flapT = 0;
    let mouthOpen = false;
    const stopFlap = () => {
      clearTimeout(flapT);
      flapT = 0;
      mouthOpen = false;
      delete el.dataset.mouth;
    };
    const flap = () => {
      flapT = 0;
      if (moodNow !== "talk" || !moods.talk || el.isConnected === false) return stopFlap();
      mouthOpen = !mouthOpen;
      put(mouthOpen ? moods.talk : moods.neutral || moods.talk);
      el.dataset.mouth = mouthOpen ? "open" : "shut";
      flapT = setTimeout(flap, G.mouthMs(mouthOpen));
    };
    let lastBlink = 0;
    let blinkT = 0;
    let blinkShut = false;
    const showMood = () => {
      if (moodNow === "blink") lastBlink = Date.now();
      if (moodNow === "talk" && moods.talk) {
        if (!flapT) flap();
      } else {
        stopFlap();
        if (!blinkShut) put(moods[moodNow] || moods.neutral);
      }
      el.dataset.mood = moodNow;
    };
    const selfBlink = () => {
      blinkT = 0;
      if (el.isConnected === false) return; // (a box taken off the page without destroy(): its blinks stop)
      const doc = root.document;
      const idle = moodNow === "neutral" && !flapT && moods.blink && moods.neutral;
      if (idle && Date.now() - lastBlink > G.MOUTH.blinkEvery * 0.6 && !(doc && doc.hidden)) {
        lastBlink = Date.now();
        blinkShut = true;
        put(moods.blink);
        el.dataset.blink = "1";
        setTimeout(() => {
          blinkShut = false;
          delete el.dataset.blink;
          showMood();
        }, G.MOUTH.blink);
      }
      blinkT = setTimeout(selfBlink, G.blinkGap());
    };
    if (opts.faces && opts.faces.blink && root.document) blinkT = setTimeout(selfBlink, 2600);
    // (each head is cut once per page: a box mounted again, the next screen, shows it at once, never opts.face first)
    const cutFace = (f) => {
      if (!f || !f.src) return Promise.resolve(null);
      const k = `${f.src}|${f.crop || ""}`;
      if (!CUTS.has(k)) CUTS.set(k, cutOnce(f));
      return CUTS.get(k);
    };
    Object.keys(opts.faces || {}).forEach((m) => {
      const f = opts.faces[m];
      const k = f && `${f.src}|${f.crop || ""}`;
      if (k && CUT_DONE.has(k)) moods[m] = CUT_DONE.get(k);
    });
    if (moods.neutral) showMood();
    const cutOnce = (f) =>
      new Promise((res) => {
        if (!f.crop || typeof document === "undefined") return res(f.src);
        const im = new Image();
        im.onload = () => {
          try {
            const [x, y, w, hh] = f.crop;
            // cut at the size it is drawn (its screen px, a little over: never over 3x, the load check's oversize rule)
            const drawn = faceImg.getBoundingClientRect().width || 64;
            const N = Math.round(Math.max(48, Math.min(w, 256, drawn * (root.devicePixelRatio || 1) * 1.25)));
            const c = document.createElement("canvas");
            c.width = N;
            c.height = Math.round((N * hh) / w);
            c.getContext("2d").drawImage(im, x, y, w, hh, 0, 0, c.width, c.height);
            const u = c.toDataURL("image/png");
            CUT_DONE.set(`${f.src}|${f.crop}`, u);
            res(u);
          } catch (e) {
            res(null); // (a cross-origin picture: the box keeps its one face)
          }
        };
        im.onerror = () => res(null);
        im.src = f.src;
      });
    Object.keys(opts.faces || {}).forEach((m) =>
      cutFace(opts.faces[m]).then((u) => {
        if (!u) return;
        moods[m] = u;
        if (m === moodNow || (m === "neutral" && !moods[moodNow])) showMood();
      })
    );
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
      /** Her face's mood now (a key of opts.faces: neutral, happy, talk, blink...); an unknown one shows neutral. */
      mood(m) {
        moodNow = m || "neutral";
        showMood();
      },
      get moodNow() {
        return moodNow;
      },
      strip(on) {
        el.classList.toggle("ng-strip", !!on);
      },
      destroy() {
        off();
        stopFlap();
        clearTimeout(blinkT);
        if (ro) ro.disconnect();
        el.innerHTML = "";
      },
    };
  };
  return G;
});

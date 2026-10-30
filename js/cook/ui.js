/*
 * Cook with Nani: the HTML layer (Phase A).
 *
 *  - Word pills in three shapes (docs/archive/cook/cook-with-nani-phase-a-design.md s4):
 *    full [speaker | Kutchi | translate], choice (big, tappable) and the
 *    in-world item labels (drawn in Phaser, see stations.js).
 *  - The mission card: who ordered, the order as pills (words fade to dots
 *    as they're learned), (R4: no stars; the shared end screen has the badges)
 *    that fill or grey out as you cook, and the steps. At the end it's
 *    stamped and becomes a completion card.
 *  - Nani's "pass me" interrupt, small-talk choices, gist and how-to lines,
 *    the count badge, the done button, toasts and panels.
 * Images never contain words; every word is here.
 */
(function (global) {
  // C4: Cook's namespace (js/cook/ns.js) when Cook loads as modules; the parked pages' and Node harnesses' marked window.Cook
  // when this file runs as a classic script. Timers go through Cook's lifetime (js/cook/life.js) when it is there.
  const Cook = (global.njgTest && global.njgTest.loading) || (global.Cook = global.Cook || {});
  const { setTimeout, clearTimeout, setInterval, clearInterval } = Cook.life || global;
  const Lang = Cook.Lang;
  const $ = (s) => document.querySelector(s);
  const UI = (Cook.UI = {});
  // C4: a listener on the page itself goes through Cook's lifetime when Cook is mounted (js/cook/life.js: removed at
  // unmount); on a parked page it is a plain listener. Returns the function that removes it.
  const onPage = (t, type, fn, o) => (Cook.life ? Cook.life.on(t, type, fn, o) : (t.addEventListener(type, fn, o), () => t.removeEventListener(type, fn, o)));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /*
   * Sprint 11 (B-cook): the shared pieces Cook's page doesn't list: js/shared/word-card.js (the order's word cards),
   * js/shared/conversations.js (the kitchen conversation) and js/shared/speech.js (speaking as play), each loaded once when
   * first asked for (UI.init asks early, so they are there by the first order), with the page's version stamp and its
   * styles. Nothing waits on them: a page without one goes on as before.
   */
  const SHARED = {
    "word-card": ["WordCard", "js/shared/word-card.js", "css/shared/word-card.css"],
    conversations: ["Conversations", "js/shared/conversations.js", "css/shared/conversations.css"],
    speech: ["Speech", "js/shared/speech.js", null],
    bulb: ["Bulb", "js/shared/bulb.js", null],
    buttons: ["NjgButtons", "js/shared/buttons.js", "css/shared/buttons.css"],
  };
  const sharedP = {};
  const stamped = (rel) => {
    const u = new URL(rel, document.baseURI);
    if (global.NJG_V) u.search = `?v=${global.NJG_V}`;
    return u.href;
  };
  UI.needShared = function (name) {
    if (sharedP[name]) return sharedP[name];
    const spec = SHARED[name];
    if (!spec || typeof document === "undefined") return Promise.resolve(null);
    const [glob, js, css] = spec;
    if (css && ![...document.querySelectorAll('link[rel="stylesheet"]')].some((l) => (l.getAttribute("href") || "").includes(css))) {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = stamped(css);
      document.head.appendChild(l);
    }
    sharedP[name] = (global[glob] ? Promise.resolve() : import(stamped(js)))
      .then(() => global[glob] || null)
      .catch(() => null);
    return sharedP[name];
  };
  UI.esc = esc;

  /* ---------------- icons ---------------- */
  const ICON = {
    speaker: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    translate: `<svg viewBox="0 0 24 24" aria-hidden="true"><text x="1" y="12" font-size="11" font-weight="800" fill="currentColor">A</text><text x="10" y="21" font-size="11" font-weight="800" fill="currentColor">En</text></svg>`,
    ear: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 9a4.5 4.5 0 1 1 9 0c0 2.6-2.4 3.4-3.1 5.3-.5 1.4-.4 3.7-2.7 3.7-1.5 0-2.4-1-2.4-2.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M11 9.5a1.8 1.8 0 1 1 3.3 1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    hand: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 12V6.5a1.5 1.5 0 0 1 3 0V11V4.5a1.5 1.5 0 0 1 3 0V11V5.5a1.5 1.5 0 0 1 3 0V12V8.5a1.5 1.5 0 0 1 3 0V14c0 4-2.5 7-6.5 7S5.5 18.5 4 15.5l-1.2-2.3A1.5 1.5 0 0 1 5.4 12L7 14" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></svg>`,
    bolt: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg>`,
    tick: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5 9.5 18 20 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    chefhat: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 14.2a4 4 0 0 1-.6-7.9A4.6 4.6 0 0 1 12 3.4a4.6 4.6 0 0 1 5.6 2.9 4 4 0 0 1-.6 7.9V20H7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M7 16.8h10M10 11v3M14 11v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    magnifier: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="m14.5 14.5 6 6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>`,
    replay: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M18.6 2.8v4.6H14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    eye: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="12" r="3.2" fill="currentColor"/></svg>`,
  };
  ICON.bulb = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5a6.5 6.5 0 0 0-3.8 11.8c.8.6 1.3 1.4 1.3 2.3V17h5v-.4c0-.9.5-1.7 1.3-2.3A6.5 6.5 0 0 0 12 2.5z" fill="currentColor" opacity=".9"/><path d="M9.6 19h4.8M10.4 21.3h3.2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9.6 9.2a2.7 2.7 0 0 1 2.4-2.3" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/></svg>`;
  UI.ICON = ICON;
  /**
   * Wave 6 (docs/design-language/ux-principles.md), for pages that opt in with <body class="w6">
   * (cook.html): the sidebar on the left, one card per thing with a fixed
   * shape, no per-line speaker, 👁 or translate (one light bulb at the top of
   * the sidebar instead; one speaker per card, reading it with read-along).
   * Other pages that share this file keep the Wave 5 card.
   */
  UI.w6 = () => document.body.classList.contains("w6");
  /*
   * Sprint 14: the kit's s14 look, on for chai (mission.s14): body.njg-s14 carries the page-level parts (the lab's wider side
   * panel, Nani's box with the arrow in place of the bulb and no speaker of her own, the scrolling order list); the order card
   * and the word cards take it as their option (OrderCard s14, WordCard.big14 / item14). The serif is loaded once, the first time.
   */
  UI.s14 = () => !!(mission && mission.s14 && UI.w6());
  UI.applyS14 = function (on) {
    if (typeof document === "undefined" || !document.body) return;
    on = !!on && UI.w6();
    if (on && !document.querySelector("link[data-njg-card14-font]")) {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap";
      l.dataset.njgCard14Font = "";
      document.head.appendChild(l);
    }
    // the light's look for the whole chai round, the counter's conversation too (its reply had the old finger: contract-44)
    if (global.Onboard) global.Onboard.look = on ? "s14" : global.Onboard.look === "s14" ? null : global.Onboard.look;
    if (document.body.classList.contains("njg-s14") === on) return;
    document.body.classList.toggle("njg-s14", on);
    guideS14(on);
    if (!on) UI.helper(null);
  };

  /**
   * PARKED MODES ONLY (Find it, Dress up, Snap borrow this file; H45): their star icons from their own
   * star sets. Cook itself has no stars since step 3 R4 (H5, J7: the three badges instead); this and the
   * other marked legacy-star helpers below go when those modes move onto the core.
   */
  UI.starInfo = function (k, mode = Cook.save.mode) {
    const sets = Cook.data.star_sets || {};
    const set = sets[Cook.gameMode || "cook"] || sets.cook || {};
    const key = k === "third" ? (mode === "busy" ? "busy" : "relaxed") : k;
    const fallback = { ear: "ear", hand: "hand", busy: "bolt", relaxed: "tick" }[key];
    return Object.assign({ icon: fallback, name: key, tip: "" }, set[key] || {});
  };
  UI.starIcon = (k, mode) => ICON[UI.starInfo(k, mode).icon] || ICON.tick;

  /* ---------------- geometry: world -> page ----------------
   * The canvas fills #stage and shows more than the 1600x900 design box when the stage has room
   * (the stage fill, CookScene.fitView): a world point goes through the camera (its scroll and zoom). */
  UI.worldScale = function () {
    const canvas = document.querySelector("#game canvas");
    const S = Cook.scene;
    if (!canvas) return 1;
    const gw = S && S.scale ? S.scale.gameSize.width : 1600;
    const cam = S && S.cameras ? S.cameras.main : null;
    return (canvas.getBoundingClientRect().width / gw) * (cam ? cam.zoom : 1);
  };
  UI.worldToScreen = function (x, y) {
    const canvas = document.querySelector("#game canvas");
    if (!canvas) return { x, y };
    const r = canvas.getBoundingClientRect();
    const S = Cook.scene;
    const cam = S && S.cameras ? S.cameras.main : null;
    const s = UI.worldScale();
    const v = Cook.view || { left: 0, top: 0 };
    const x0 = cam && cam.zoom === 1 ? cam.scrollX : v.left;
    const y0 = cam && cam.zoom === 1 ? cam.scrollY : v.top;
    return { x: r.left + (x - x0) * s, y: r.top + (y - y0) * s, s };
  };
  UI.worldToStage = function (x, y) {
    const canvas = document.querySelector("#game canvas");
    const stage = $("#stage").getBoundingClientRect();
    if (!canvas) return { x, y, s: 1, stage };
    const p = UI.worldToScreen(x, y);
    return { x: p.x - stage.left, y: p.y - stage.top, s: p.s, rect: canvas.getBoundingClientRect(), stage };
  };
  /** The camera moved (the stage changed shape): things placed from world points follow. */
  UI.onViewFit = function () {
    if (tallyPt) placeTally();
  };

  /* ---------------- word pills ---------------- */
  /**
   * A pill for a line. opts: {shape: "full" | "choice", hide: fn(wordId),
   * noTranslate, onHint}. The speaker plays the line; translate shows the
   * English (and counts as help, a hint on the hints badge).
   */
  UI.pill = function (line, opts = {}) {
    const el = document.createElement("span");
    el.className = `wp wp-${opts.shape || "full"}`;
    const sayLine = opts.speakLine || line;
    const voice = Lang.hasVoice(sayLine);
    const hideTr = opts.noTranslate || !line.en;
    el.innerHTML = `${voice ? `<button class="wp-say" type="button" aria-label="Hear it">${ICON.speaker}</button>` : opts.reserveSay ? `<span class="wp-gap"></span>` : ""}<span class="wp-text">${opts.readAlong ? raHtml(line, opts) : Lang.html(line, opts)}</span>${
      opts.onReveal ? `<button class="wp-eye" type="button" aria-label="Show the word">${ICON.eye}</button>` : ""
    }${hideTr ? "" : `<button class="wp-tr" type="button" aria-label="Show in English">${ICON.translate}</button>`}<span class="wp-en hidden">${esc(line.en || "")}</span>`;
    const say = el.querySelector(".wp-say");
    if (say)
      say.addEventListener("click", (ev) => {
        ev.stopPropagation();
        Cook.unlockAudio();
        say.classList.add("on");
        if (opts.onHear) opts.onHear();
        (opts.readAlong && sayLine === line ? speakAlong(line, el) : Lang.speak(sayLine)).then(() => say.classList.remove("on"));
      });
    const eye = el.querySelector(".wp-eye");
    if (eye)
      eye.addEventListener("click", (ev) => {
        ev.stopPropagation();
        opts.onReveal();
      });
    const tr = el.querySelector(".wp-tr");
    if (tr)
      tr.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const en = el.querySelector(".wp-en");
        en.classList.toggle("hidden");
        tr.classList.toggle("on", !en.classList.contains("hidden"));
        if (en.classList.contains("hidden")) return;
        // English shows the meaning: for a line with order words in it,
        // that's the answer (costs the accuracy badge); otherwise it's help.
        if (opts.onTranslate) opts.onTranslate();
        else if (Cook.onHelp) Cook.onHelp(line.segs.some((s) => s.w) ? "translate" : "help", { line });
      });
    return el;
  };

  /*
   * 29 Sept (X2, Zafar: the read-along underline is the standard): any spoken line shows as its
   * spoken parts (one span each), and each part underlines while it's said, as on the sidebar card.
   * raHtml(line, opts) -> the html; speakAlong(line, box) speaks it part by part, underlining the
   * spans inside box. A line with a whole recording of its own is heard whole, all of it underlined.
   */
  const raParts = (line) => (line && line.parts && line.parts.length > 1 ? line.parts : [line]);
  const raHtml = (line, opts = {}) => raParts(line).map((p, i) => `<span class="ra" data-ra="${i}">${Lang.html(p, opts)}</span>`).join(" ");
  async function speakAlong(line, box) {
    // SH-17 (S05-C2): while Nani's line is her card's top strip (R4, the pantry), the strip's words light up too
    const boxes = () => [box].concat(box && guide && box === guide.el && mission && mission.stripMode ? [...document.querySelectorAll("#mission .oc-strip")] : []).filter(Boolean);
    const spans = (i) => [].concat(...boxes().map((b) => [...b.querySelectorAll(i == null ? ".ra" : `.ra[data-ra="${i}"]`)]));
    const lit = (els, on) => els.forEach((e) => e.classList.toggle("ra-on", on));
    // SH-17 (S05-G): the strip (and the box) can be redrawn while a part is said (the card re-renders, OC.setStrip replaces
    // the strip): the part being said stays lit on whatever spans are on screen now, not only the ones there when it began
    const hold = (i) => {
      lit(spans(i), true);
      const t = setInterval(() => lit(spans(i), true), 60);
      return () => {
        clearInterval(t);
        lit(spans(i), false);
      };
    };
    if (Lang.hasWhole && Lang.hasWhole(line)) {
      const off = hold(null);
      try {
        return await Lang.speak(line);
      } finally {
        off();
      }
    }
    const parts = raParts(line);
    for (let i = 0; i < parts.length; i++) {
      const off = hold(parts.length > 1 ? i : null);
      try {
        // SH-17 (S05-G): a part whose voice is one short clip ("Muke chai de." says only chai, 140 ms, until Mum records
        // the frame) stays lit long enough to be seen at a child's pace, as the pop-up's read-along does
        if (Lang.hasVoice(parts[i])) await Promise.all([Lang.speak(parts[i]), Cook.wait(Math.min(900, 220 * Lang.plain(parts[i]).split(/\s+/).length))]);
        else await Cook.wait(Math.max(500, Cook.readMs(Lang.plain(parts[i])) * 0.5));
      } finally {
        off();
      }
    }
    return true;
  }
  UI.raHtml = raHtml;
  UI.speakAlong = speakAlong;
  /*
   * 29 Sept (P1): one speech queue at a station. The counting voice ("hakro dudh") and Nani's next
   * line never talk over each other: each waits for the one before it, the count first.
   */
  let speechTail = Promise.resolve();
  // (a clip that never ends can't hold the queue: each waits at most 4 s for the one before)
  // LNG-09 (Zafar, 17 Oct: "speed up the instructions a little bit"): a spoken line is shown at least this long. It was 700 ms,
  // from the days of the slowed test voice (rate 0.7); the voice runs at its own speed now, so a short word is no longer held
  const LINE_MIN_MS = 300;
  const queued = (fn) => {
    // SH-66 (s04-fxc): a line queued before a voice stop (a station's end, a tap through the pop-up) never starts after
    // it: the shared voice layer's generation is taken now and checked when its turn comes (js/shared/request-popup.js)
    const V = global.Lifecycle && global.Lifecycle.voice;
    const gen = V ? V.gen() : 0;
    const before = Promise.race([speechTail.catch(() => {}), new Promise((r) => setTimeout(r, 4000))]);
    const mine = before.then(() => (V && V.gen() !== gen ? undefined : fn()));
    speechTail = mine.catch(() => {});
    return mine;
  };
  UI.queueSpeech = queued;

  /* ---------------- speech: bubble by a character, or Nani's card ---------------- */
  // S13-B2 (the kit review 3, decision 6): a character's line is the kit's one speech bubble (js/shared/conversations.js
  // Conversations.bubble), the same as the clinic's and a conversation's: placed by the one placement (Lifecycle.bubble.place:
  // above the speaker's head, its tail down to it, below it with no room; S04-B, SH-68) and following the head while the camera
  // moves. Cook's own #bubble, its tail and its placement went.
  let bubbleAnchor = null;
  let bubbleEl = null;
  const card = () => $("#nani-card");
  // the speaker's head on the page (px): the top of their picture, in world px (anchor.head), else the point they speak from
  const headBox = (an) => () => {
    if (!an || an.badge) return null;
    try {
      const hd = an.head;
      if (hd) {
        const a = UI.worldToScreen(hd.x, hd.y);
        const z = UI.worldToScreen(hd.x + hd.w, hd.y + hd.h);
        return { left: a.x, top: a.y, width: z.x - a.x, height: z.y - a.y };
      }
      const p = UI.worldToScreen(an.x, an.y);
      return { left: p.x, top: p.y, width: 1, height: 1 };
    } catch (e) {
      return null;
    }
  };
  function placeBubble() {
    if (bubbleEl && bubbleEl.isConnected && bubbleEl.njgPlace) bubbleEl.njgPlace();
  }
  UI.placeBubble = placeBubble;
  const dropBubble = () => {
    if (bubbleEl) bubbleEl.remove();
    bubbleEl = null;
  };
  // the page-wide resize listeners (a parked page: at load; Cook mounted: at UI.init, through its lifetime)
  const pageWide = () => {
    onPage(global, "resize", () => setTimeout(placeBubble, 60));
    onPage(global, "resize", () => tallyPt && placeTally());
  };

  /**
   * Say a line. anchor {x, y, head?, who?} in world px (a bubble by a character) or
   * {badge: true} (Nani's card in the sidebar, which can never cover a
   * thing to tap). Plays the voice; resolves when it ends. A tap anywhere
   * that isn't a button skips (nothing is unskippable). opts.hide hides
   * well-known words as dots; opts.ms for text-only lines.
   */
  UI.say = async function (line, anchor, opts = {}) {
    bubbleAnchor = anchor;
    const token = Cook.run;
    dropBubble();
    // the kit's bubble (its script loads once, early: UI.needShared); without it the line goes to Nani's card
    const C = anchor && anchor.badge ? null : await UI.needShared("conversations");
    const toCard = !(C && C.bubble);
    const pill = UI.pill(line, { hide: opts.hide, onHear: opts.onHear, noTranslate: UI.w6(), readAlong: true });
    let target, slot;
    if (toCard) {
      target = card();
      slot = target.querySelector(".say-slot");
      slot.innerHTML = "";
      slot.appendChild(pill);
      target.classList.remove("hidden", "talk");
      target.style.animation = "none";
      void target.offsetWidth;
      target.style.animation = "";
      target.classList.add("talk");
    } else {
      card().classList.add("hidden");
      dropBubble(); // (one bubble at a time: a line said while this one's script was loading)
      pill.classList.add("wp-line"); // (Cook's own pill: its words big, its speaker a full tap, css/cook.css .wp-line)
      // its speaker (data-who): the one named, else "cook" (the contract's Cook speaker: the nearest character's head)
      bubbleEl = target = C.bubble(headBox(anchor), { who: (anchor && anchor.who) || "cook", text: pill, layer: $("#stage"), tap: true, z: 10 });
      slot = target.querySelector(".cv-text");
      // SH-153's check (contract-73): on the s14 look, the bubble's speaker as drawn (its size and 1.8 em of its words), for the checks
      if (UI.s14()) {
        const b = target;
        requestAnimationFrame(() => {
          const sp = b.querySelector(".wp-say");
          const tx = b.querySelector(".wp-text");
          if (!sp || !b.isConnected) return;
          const r = sp.getBoundingClientRect();
          const em = parseFloat(getComputedStyle(sp).fontSize) || 0;
          const ic = sp.querySelector("svg");
          const ir = ic ? ic.getBoundingClientRect() : null;
          try {
            if (global.Lifecycle && global.Lifecycle.note) global.Lifecycle.note("bubble-spk", { step: String(Math.round(Math.min(r.width, r.height))), by: `em:${(em * 1.8).toFixed(1)} icon:${ir ? Math.round(ir.width) : 0} text:${tx ? (parseFloat(getComputedStyle(tx).fontSize) || 0).toFixed(1) : 0}` });
          } catch (e) {
            /* only a log */
          }
        });
      }
    }
    let skip;
    let offSkip = null;
    const skipped = new Promise((resolve) => {
      skip = (ev) => {
        if (ev.target.closest && ev.target.closest("button, a, #overlay, .wp")) return;
        resolve();
      };
      offSkip = onPage(document, "pointerdown", skip, true);
    });
    try {
      const naniQuiet = (toCard || opts.nani) && UI.naniMuted();
      const voice = !opts.silent && !naniQuiet && Lang.hasVoice(line);
      const talk = voice ? Promise.all([queued(() => speakAlong(line, slot)), Cook.wait(LINE_MIN_MS)]) : Cook.wait(opts.ms || Cook.readMs(Lang.plain(line)));
      await Promise.race([talk, skipped]);
    } finally {
      if (offSkip) offSkip();
      target.classList.remove("talk");
    }
    Cook.checkRun(token);
    if (opts.autoHide) UI.hideBubble();
  };
  UI.hideBubble = function () {
    dropBubble();
    card().classList.add("hidden");
  };

  /*
   * Wave 6b (docs/design-language/ux-principles.md 13): the instruction card is the master;
   * at a station Nani is a VOICE. Her card doesn't take sidebar space: her
   * line plays, and the rows of the order card it names throb while she
   * says it (the throbbing hint). A line about something that isn't on the
   * card (a short interjection, or a switch, "now marcha!")
   * shows as a small caption over the top of the picture that never takes a
   * tap. Outside a station (story moments, the send-off) she talks as before.
   *   UI.voice(line, opts) -> resolves when it ends (a tap skips, as UI.say)
   */
  const lineWords = (line) => {
    const parts = line && line.parts ? line.parts : [line];
    const ids = [];
    parts.forEach((p) => ((p && p.segs) || []).forEach((s) => s.w && !ids.includes(s.w) && ids.push(s.w)));
    return ids;
  };
  let voiceTok = 0;
  const throbbedHidden = new Set();
  UI.voice = async function (line, opts = {}) {
    if (!UI.w6() || !Cook.inStation || !$("#voice")) return UI.say(line, { badge: true }, opts);
    const tok = ++voiceTok;
    card().classList.add("hidden");
    dropBubble();
    // the row she's talking about: ONE highlight at a time (SH-53), the first open row with one of her words on it;
    // a word hidden on the card is lit only the first time it is hidden (D11: after that the glow would give it away)
    const ids = lineWords(line).filter((id) => !String(id).startsWith("num-") && !String(id).startsWith("lnk-"));
    const els = [];
    let lit = null;
    sideEls.forEach((list, r) => {
      if (lit || !r || !r.ids || r.done || !r.ids.some((id) => ids.includes(id))) return;
      if (rowHidden(r)) {
        const key = r.ids.join("+");
        if (throbbedHidden.has(key)) return;
        throbbedHidden.add(key);
      }
      lit = r;
      els.push(...list);
    });
    const cap = $("#voice");
    const onCard = els.length > 0 && !opts.caption;
    document.querySelectorAll(".oc-throb").forEach((e) => e.classList.remove("oc-throb"));
    els.forEach((e) => e.classList.add("oc-throb")); // (the kit's row state, css/shared/order-card.css; S13-B1)
    // 28 Sept: her line shows in her own box at the top of the sidebar (no caption over the picture)
    if (guide) {
      guideLine = line;
      const st = stepper && stepper.current;
      if (st && st.line && Lang.plain(st.line) === Lang.plain(line)) st.shown = true;
      guide.set(raHtml(line, { hide: opts.hide }));
      guide.talk(true);
    } else if (!onCard) {
      cap.innerHTML = `<span class="vc-say">${ICON.speaker}</span><span class="vc-t">${raHtml(line, { hide: opts.hide })}</span>`;
      cap.classList.remove("hidden");
      cap.style.animation = "none";
      void cap.offsetWidth;
      cap.style.animation = "";
    }
    const token = Cook.run;
    let skip;
    let offSkip = null;
    const skipped = new Promise((resolve) => {
      skip = (ev) => {
        if (ev.target.closest && ev.target.closest("button, a, #overlay")) return;
        resolve();
      };
      offSkip = onPage(document, "pointerdown", skip, true);
    });
    try {
      // Nani muted (her box): she still shows the line, silently
      const voice = !opts.silent && !UI.naniMuted() && Lang.hasVoice(line);
      const talk = voice ? Promise.all([queued(() => speakAlong(line, guide ? guide.el : cap)), Cook.wait(LINE_MIN_MS)]) : Cook.wait(opts.ms || Math.min(2600, Cook.readMs(Lang.plain(line))));
      await Promise.race([talk, skipped]);
    } finally {
      if (offSkip) offSkip();
      if (tok === voiceTok) {
        els.forEach((e) => e.classList.remove("oc-throb"));
        cap.classList.add("hidden");
        if (guide) {
          guide.talk(false);
          // R2 (bug 3 of the guide-and-card inventory): a spoken line never outstays its moment: the box goes back to
          // the step that is open (its line if it has been shown), else the station's instruction
          if (!opts.keep) restoreGuide();
        }
      }
    }
    Cook.checkRun(token);
  };
  UI.hideVoice = () => {
    voiceTok++;
    if ($("#voice")) $("#voice").classList.add("hidden");
    document.querySelectorAll(".oc-throb").forEach((e) => e.classList.remove("oc-throb"));
    if (guide) {
      guide.talk(false);
      showGuide();
    }
  };

  /* ---------------- Nani's guide box (28 Sept; js/shared/guide.js) ---------------- */
  /*
   * At the top of the sidebar in every station: her face and what to do now. The instruction
   * comes from data.guide (by station, or station:phase); none is recorded yet, so each shows
   * its English flagged "to record" until it gets a `line`. While she says one of her own lines
   * (UI.voice), the box shows that line. Tap the box to mute or unmute her (every mode, saved);
   * her speaker hears the line again; the light bulb lives here too.
   */
  let guide = null;
  let guideKey = null;
  let guideLine = null; // what the box shows now: a line (Kutchi) or null (the instruction)
  let guideEnglish = null; // the line the bulb is showing in English now
  UI.naniMuted = () => !!(global.NaniGuide && global.NaniGuide.muted());
  // which data.guide key the box shows now (the station:phase, else the station, else the default)
  const guideEntryKey = () => {
    const G = (Cook.data && Cook.data.guide) || {};
    const k = guideKey || "";
    return [k, k.split(":")[0], "default"].find((x) => x && G[x]) || null;
  };
  function showGuide() {
    if (!guide) return;
    // a step is open (UI.step): the box is that step's, never the station's standing instruction
    if (stepper && stepper.current) return restoreGuide();
    guideLine = null;
    const key = guideEntryKey();
    if (!key) return guide.set("");
    // step 4d: the engine's line (a line Mum gave), else the engine's to-record placeholder (grey italic)
    const line = Lang.guideLine(key, Cook.data.guide[key]);
    if (line.ok) {
      guideLine = line;
      guide.set(raHtml(guideLine));
    } else guide.set(esc(Lang.plain(line)), { rec: true });
  }
  function restoreGuide() {
    if (!guide) return;
    const st = stepper && stepper.current;
    if (!st) {
      guideLine = null;
      if (stepper) return showGuideKey();
      return;
    }
    guideLine = st.shown ? st.line : null;
    guide.set(st.shown ? st.html : "", { rec: !!(st.shown && st.rec) });
  }
  function showGuideKey() {
    const s = stepper;
    stepper = null;
    try {
      showGuide();
    } finally {
      stepper = s;
    }
  }

  /*
   * The step rules (decision 55; docs/design-language/guide-and-card.md R1-R4), Cook's side of NaniGuide.stepper:
   *   UI.step(line, {glow(on), hide, helpAfter, quiet})  a step opens: its one line (L1 shown and said at once; L2+
   *                         after the pause, with the glow and a hint on the badge); the line clears when it closes
   *   UI.stepDone()         the step ended (the line clears, the glow goes)
   *   UI.stepPoke()         the child acted: the pause starts again
   *   UI.stepHelp()         help now (the line, said, and the glow)
   *   UI.stepOpen(line, {ctx})  the one-line hook a station's step engine calls (the pantry): opens the step with the
   *                         station's own hesitation help (helpAfter false), and says whether to guide at once (only
   *                         the taught first round: decision 55, SH-60: help after the pause, the first item too)
   */
  let stepper = null;
  /*
   * s08 w2A (SH-110, the level table's step call; Zafar, 19 Oct): as a step opens Nani says its line once, at every level:
   * the order in pieces, never help (nothing is shown or lit, it never costs). Said through the one speech queue, tagged
   * role "call"; skipped (and logged, Lifecycle step-call) when she is muted, the line has no voice, the station said it a
   * moment ago (the help ladder's same-line rule), or the step closed before its turn. The help after the pause is unchanged.
   */
  const callNote = (s, by) => {
    try {
      if (global.Lifecycle && global.Lifecycle.note) global.Lifecycle.note("step-call", { step: String(s.id), by });
    } catch (e) {
      /* only a log */
    }
  };
  const copyLine = (l) => Object.assign({}, l, { parts: l.parts ? l.parts.map(copyLine) : l.parts });
  function stepCall(s) {
    const row = Cook.levelRow ? Cook.levelRow(orderLevel()) : { stepCall: false };
    if (!row.stepCall) return callNote(s, "skip-off");
    if (s.noCall) return callNote(s, `skip-${s.noCall}`);
    if (!s.line || s.line.ok === false || !Lang.hasVoice(s.line)) return callNote(s, "skip-novoice");
    if (UI.naniMuted()) return callNote(s, "skip-muted");
    const G = global.NaniGuide;
    // MAA-15 (Zafar, 17 Oct: maani's Firai on both turns): a step opened with "again" is called even if its words were just said
    if (!s.again && G && (G.recentlySaidIn || G.recentlySaid)(Lang.plain(s.line))) return callNote(s, "skip-said");
    callNote(s, s.again ? "queued-again" : "queued");
    s.callWaiting = true; // (s08 w6B, contract-36: a call still waiting when its step closes is logged skip-closed then: glow below)
    const line = Lang.role(copyLine(s.line), "call");
    queued(() => {
      if (!s.callWaiting) return null; // (already logged skip-closed as its step closed)
      s.callWaiting = false;
      if (!stepper || stepper.current !== s) return callNote(s, "skip-closed");
      // (s14, Zafar 29 Oct: "Chulo bar is spoken early, before the visual help": the call a beat after the step opens, its light first)
      const lag = UI.s14() && global.Rules && global.Rules.callAfterLightMs ? global.Rules.callAfterLightMs() / (Cook.speed || 1) : 0;
      return (lag ? Cook.wait(lag) : Promise.resolve()).then(() => {
        if (!stepper || stepper.current !== s) return callNote(s, "skip-closed");
        if (guide) guide.talk(true);
        return Lang.speak(line).finally(() => guide && guide.talk(false));
      });
    }).catch(() => {});
  }
  function makeStepper() {
    if (!global.NaniGuide || !global.NaniGuide.stepper) return null;
    return global.NaniGuide.stepper({
      show: (html, o) => {
        if (!guide) return;
        guideLine = stepper && stepper.current && stepper.current.line && stepper.current.line.ok !== false ? stepper.current.line : null;
        guide.set(html, o);
      },
      clear: () => {
        guideLine = null;
        if (guide) guide.set("");
      },
      speak: (s) => (s.line && Lang.hasVoice(s.line) && guide ? queued(() => speakAlong(s.line, guide.el)) : null),
      glow: (s, on) => {
        // s08 w6B (contract-36, day 6's pantry: the last thing tapped while step 8's call waited behind a count, then the stage
        // ended and the queue was dropped, so neither the call nor its skip was logged): a step that closes with its call still
        // waiting logs the skip now
        if (!on && s && s.callWaiting) {
          s.callWaiting = false;
          callNote(s, "skip-closed");
        }
        return s.glow && s.glow(on);
      },
      level: () => orderLevel(),
      onHelp: (s) => Cook.onHelp && Cook.onHelp("hint", { ids: s.ids || [] }),
      call: (s) => stepCall(s),
    });
  }
  UI.step = function (line, o = {}) {
    if (!stepper) stepper = makeStepper();
    if (!stepper || !line) return null;
    const rec = line.ok === false;
    return stepper.open({ line, html: rec ? esc(Lang.plain(line)) : raHtml(line, { hide: o.hide }), rec, glow: o.glow || null, helpAfter: o.helpAfter, quiet: !!o.quiet, ids: o.ids, noCall: o.noCall || null, again: !!o.again });
  };
  UI.stepDone = () => stepper && stepper.close();
  // (Sprint 11: the open step's id, as Nani's stepper logs it: a station's hint rungs for that step go by the same name)
  UI.stepId = () => (stepper && stepper.current ? stepper.current.id : null);
  /** An off-screen guide's line in her box (or her card's strip, R4), said; resolves when it ends (a tap skips). */
  UI.guideSay = async function (line, o = {}) {
    if (!guide || !line) return UI.say(line, { badge: true }, o);
    if (stepper) stepper.close();
    guideLine = line;
    guide.set(raHtml(line), { rec: line.ok === false });
    guide.talk(true);
    let off = null;
    const skipped = new Promise((resolve) => (off = onPage(document, "pointerdown", (ev) => !(ev.target.closest && ev.target.closest("button, a, #overlay")) && resolve(), true)));
    try {
      const voice = !UI.naniMuted() && Lang.hasVoice(line);
      await Promise.race([voice ? Promise.all([queued(() => speakAlong(line, guide.el)), Cook.wait(600)]) : Cook.wait(o.ms || Math.min(2600, Cook.readMs(Lang.plain(line)))), skipped]);
    } finally {
      if (off) off();
      if (guide) guide.talk(false);
    }
  };
  UI.stepPoke = () => stepper && stepper.poke();
  UI.stepHelp = () => stepper && stepper.help();
  UI.stepOpen = function (line, { ctx, hide } = {}) {
    UI.step(line, { helpAfter: false, hide });
    return !!(ctx && ctx.guided);
  };
  /**
   * PAN-10 (Zafar, 14 Oct: no folded second box, R4 one face): while Nani asks on her own card (the pantry), her task
   * line (the station's guide line: data.guide[key] through the engine, else its to-record English, grey italic) is
   * her card's top strip whenever no step line is showing there (from level 2 a step's line shows only after the
   * pause). UI.stripTask(null) clears it. Level 1 needs none: she names each thing as it comes (the step line, at once).
   */
  UI.stripTask = function (key) {
    if (!mission) return;
    const G = (Cook.data && Cook.data.guide) || {};
    const k = key && [key, String(key).split(":")[0]].find((x) => x && G[x]);
    const line = k ? Lang.guideLine(k, G[k]) : null;
    mission.stripTask = line ? (line.ok ? { html: raHtml(line) } : { html: esc(Lang.plain(line)), rec: true }) : null;
    if (!mission.stripMode || (mission.strip && mission.strip.html && !mission.strip.task)) return;
    mission.strip = mission.stripTask ? Object.assign({ task: true }, mission.stripTask) : null;
    const c = document.querySelector(`#mission .oc-card[data-who="${CSS.escape(String(mission.who))}"]`);
    if (OCard() && OCard().setStrip) OCard().setStrip(c, mission.strip);
  };
  /** R4 (S02-B, T12): while Nani asks on a card of her own (daar's chop list) her box keeps only its tools (one face). */
  let stationStrip = false;
  let peekFolded = false;
  const applyStrip = () => guide && guide.strip && guide.strip(stationStrip || peekFolded || !!(mission && mission.stripMode));
  UI.guideStrip = (on) => {
    stationStrip = !!on;
    applyStrip();
  };
  /**
   * CK-38: while a peek holds a closed card open on a sidebar too short for it (sekelo L3: both skewers at 800x360), her
   * box folds to its tools (no face, no line), so the card fits; it comes back as the peek ends (checkFit, below)
   */
  const peekFold = (side) => {
    const peeking = !!document.querySelector("#mission .oc-card.peek");
    if (!peeking) {
      if (peekFolded) {
        peekFolded = false;
        applyStrip();
        side.classList.remove("peek-fold");
      }
      return;
    }
    if (side.scrollHeight <= side.clientHeight + 1) return;
    // one step at a time (each change asks again): her box to its tools, then (the card already in pills) the rail's
    // buttons step out for the peek's few seconds
    if (!peekFolded) {
      peekFolded = true;
      applyStrip();
    } else if ((mission.compact || 0) >= 3) side.classList.add("peek-fold");
  };
  /** The station (or station:phase) whose instruction the box shows. */
  UI.guideFor = function (key) {
    guideKey = key || null;
    if (guide && !guide.el.classList.contains("talk")) showGuide();
  };
  /** Nothing to do (the day's coin jar, between screens): her box is empty, not a station's old instruction (R2). */
  UI.guideClear = function () {
    guideKey = null;
    guideLine = null;
    if (stepper) stepper.close();
    if (guide) guide.set("");
  };
  /** Which data.guide key a goal text belongs to (a station's goal, or one of its phases). */
  function guideKeyOf(text) {
    const st = (Cook.data && Cook.data.stations) || {};
    for (const k of Object.keys(st)) {
      if (st[k].goal === text) return k;
      const ph = st[k].phases || {};
      const p = Object.keys(ph).find((x) => ph[x] === text);
      if (p) return `${k}:${p}`;
    }
    return null;
  }
  function mountGuide() {
    const el = $("#guide");
    if (!el || !global.NaniGuide) return;
    // ART-10: her box's face follows her mood: talking while she speaks, happy for a moment when a row of the order
    // ticks, blinking now and then at rest (UI.naniMood; the service view's setMood too). s08 (Zafar, 16 Oct: "all good
    // and consistent"): the faces are her face sheet's (nani-face*.webp, every cell registered onto the neutral one by
    // build/tools/art/specs/s08-nani.cut.json, so a swap moves nothing), each loaded before it is first shown
    const faces = {};
    ["neutral", "happy", "talk", "blink"].forEach((m) => {
      faces[m] = { src: Cook.v(Cook.facePath("nani", m)) };
      if (typeof Image !== "undefined") new Image().src = faces[m].src;
    });
    const g = global.NaniGuide.mount(el, {
      face: Cook.v(Cook.facePath("nani")),
      faces,
      bulb: Cook.v("assets/ui/results/icon-bulb.webp"),
      bulbId: "btn-bulb",
      onBulb: () => {
        Cook.unlockAudio();
        UI.bulb();
      },
      onReplay: (btn) => {
        Cook.unlockAudio();
        const line = guideLine;
        if (!line || !Lang.hasVoice(line)) return;
        btn.classList.add("on");
        speakAlong(line, guide.el)
          .catch(() => {})
          .then(() => btn.classList.remove("on"));
      },
    });
    // R4: while the asker is the guide (Nani's own list) her line is her card's top strip, not a second face
    const rawSet = g.set;
    g.set = (html, o = {}) => {
      rawSet(html, o);
      if (!mission || !mission.stripMode) return;
      // PAN-10: no step line showing: her task line (UI.stripTask), if the station set one
      mission.strip = html ? { html, rec: !!o.rec } : mission.stripTask ? Object.assign({ task: true }, mission.stripTask) : null;
      const c = document.querySelector(`#mission .oc-card[data-who="${CSS.escape(String(mission.who))}"]`);
      if (OCard() && OCard().setStrip) OCard().setStrip(c, mission.strip);
    };
    // her mood: talk while she speaks, then back to the mood she rests in; a blink now and then while neutral
    const rawTalk = g.talk;
    g.talk = (on) => {
      rawTalk(on);
      talking = !!on;
      g.mood(on ? "talk" : restMood());
    };
    guide = g;
    g.mood(restMood());
    clearTimeout(blinkT);
    const blink = () => {
      if (guide !== g) return;
      if (!talking && g.moodNow === "neutral") {
        g.mood("blink");
        setTimeout(() => guide === g && !talking && g.moodNow === "blink" && g.mood(restMood()), 150);
      }
      blinkT = setTimeout(blink, 3200 + Math.random() * 2600);
    };
    blinkT = setTimeout(blink, 2400);
    showGuide();
    // (Sprint 14: a box mounted again, the next station, keeps chai's look)
    if (document.body.classList.contains("njg-s14")) guideS14(true);
  }
  /*
   * Sprint 14 (SH-149, CHAI-35; lab/cards.html's .nani, Zafar 27-28 Oct): Nani's box on the s14 look. The arrow takes the bulb's
   * place (the bulb and her own speaker go: a tap on her face replays her; no green bar, one helper colour). The arrow opens her
   * helper card in place: her box grows (the order card below is pushed down, never covered) and shows the item's card with
   * everything shown (picture, Kutchi, English; never dotted: the order card's dots are the small help, this the full answer).
   * UI.helper(w) names what it would show now (a station's current item: UI.wordOf's {word, wordOpts}, or null: the arrow goes);
   * UI.helperOpen(on, {by}) opens or closes it (a tap on the arrow, or the station's hint after the level's wait: by "hint").
   */
  const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
  let helperW = null;
  let helperOn = false;
  const helperEls = () => {
    const g = $("#guide");
    return g ? { g, arrow: g.querySelector(".ng-arrow"), slot: g.querySelector(".ng-help-in") } : null;
  };
  function guideS14(on) {
    const g = $("#guide");
    if (!g) return;
    g.classList.toggle("ng-s14", !!on);
    let a = g.querySelector(".ng-arrow");
    if (on && !a) {
      a = document.createElement("button");
      a.type = "button";
      a.className = "ng-arrow";
      a.setAttribute("aria-label", "Help");
      a.setAttribute("aria-expanded", "false");
      a.innerHTML = ARROW;
      a.addEventListener("click", (ev) => {
        ev.stopPropagation();
        Cook.unlockAudio();
        UI.helperOpen(!helperOn, { by: "arrow" });
      });
      (g.querySelector(".ng-tools") || g).appendChild(a);
      const h = document.createElement("div");
      h.className = "ng-help";
      h.innerHTML = '<div class="ng-help-in"></div>';
      g.appendChild(h);
    }
    if (on) paintHelper();
  }
  function paintHelper() {
    const e = helperEls();
    if (!e || !e.arrow) return;
    e.arrow.hidden = !helperW;
    e.g.classList.toggle("ng-open", !!(helperOn && helperW));
    e.arrow.setAttribute("aria-expanded", helperOn && helperW ? "true" : "false");
    const want = helperOn && helperW ? helperW : null;
    if (e.slot._w === want) return;
    e.slot._w = want;
    e.slot.innerHTML = "";
    if (!want || !global.WordCard || !global.WordCard.big14) return;
    // (a phone: side by side; a big screen: stacked, as the lab's option 5A)
    // (side by side wherever the stacked card would push the order card out of the side panel: a phone, a short laptop)
    const phone = global.innerHeight < 760;
    global.WordCard.big14(e.slot, want.word, Object.assign({}, want.wordOpts || {}, { all: true, variant: phone ? "side" : "small", cls: "ng-helper-card" }));
    const raf = (Cook.life && Cook.life.requestAnimationFrame) || global.requestAnimationFrame;
    raf(() => global.WordCard.fit14(e.slot));
    setTimeout(() => global.WordCard && global.WordCard.fit14(e.slot), 480);
  }
  UI.helper = function (w) {
    if (!w) helperOn = false;
    helperW = w || null;
    paintHelper();
  };
  UI.helperOpen = function (on, o = {}) {
    if (on && !helperW) return false;
    const was = helperOn;
    helperOn = !!on;
    paintHelper();
    // the full answer is help: opened by the child or by the hint, it counts as a hint once per item (never recall)
    if (helperOn && !was && helperW && o.by !== "quiet") {
      const id = helperW.word && helperW.word.id;
      try {
        if (global.Lifecycle && global.Lifecycle.note) global.Lifecycle.note("helper-open", { step: String(id == null ? "" : id), by: String(o.by || "arrow") });
      } catch (e) {
        /* only a log */
      }
      if (helperW.onOpen) helperW.onOpen(o.by || "arrow");
    }
    return helperOn;
  };
  UI.helperIsOpen = () => !!(helperOn && helperW);
  let talking = false;
  let blinkT = 0;
  let restAs = "neutral"; // the mood she rests in (the service view's setMood)
  let happyUntil = 0;
  let happyT = 0;
  const restMood = () => (Date.now() < happyUntil ? "happy" : restAs);
  /** Nani's face in her box: "happy" for a moment (ms), or the mood she rests in (the counter sprite's setMood). */
  UI.naniMood = function (mood, ms = 0) {
    if (ms > 0) {
      happyUntil = Date.now() + ms;
      clearTimeout(happyT);
      happyT = setTimeout(() => guide && !talking && guide.mood(restMood()), ms + 20);
    } else {
      restAs = ["happy", "neutral"].includes(mood) ? mood : "neutral";
      happyUntil = 0;
    }
    if (guide && !talking) guide.mood(ms > 0 ? mood : restMood());
  };

  /* ---------------- gist (top of the picture) and help ("?" in the sidebar) ---------------- */
  /*
   * Wave 5 (clarity and calm): the goal is never shown on its own. It sits
   * behind the "?" at the bottom of the sidebar and pops out when pressed.
   * The first time you meet a station (or while Nani is guiding) the "?"
   * pulses, and the ghost finger shows the move on the object itself.
   * UI.gist(text, {top: true}) is the short notice over the picture between
   * orders (a day's title, "someone's on their way").
   */
  const HELP_DEFAULT = "Listen to what they ask for, then cook it just the way they said. Tap ↻ on the order card to hear it again.";
  let helpText = HELP_DEFAULT;
  UI.gist = function (text, opts = {}) {
    if (opts.top) {
      const g = $("#gist");
      g.textContent = text;
      g.classList.remove("hidden");
      return;
    }
    const stations = (Cook.data && Cook.data.stations) || {};
    // Nani's box: the instruction for this station (or this phase of it)
    const gk = guideKeyOf(text);
    if (gk) UI.guideFor(gk);
    // opts.key: another mode's goal (Find it), so its "?" pulses only the first time too
    const key = opts.key || Object.keys(stations).find((k) => stations[k].goal === text);
    Cook.save.goalShown = Cook.save.goalShown || {};
    const guided = Cook.ctx && Cook.ctx.guided;
    const fresh = !key || guided || !Cook.save.goalShown[key] || opts.full;
    if (key) Cook.save.goalShown[key] = true;
    if (text !== helpText) UI.closeHelp();
    helpText = text;
    const hb = $("#btn-help");
    // CK-53 (Zafar, 27 Oct: "this question mark shouldn't be highlighted"): the ? never glows (it waits behind the cog)
    if (hb) hb.classList.remove("fresh");
    void fresh;
  };
  UI.helpText = () => helpText;
  UI.hideGist = () => {
    $("#gist").classList.add("hidden");
    UI.closeHelp();
    helpText = HELP_DEFAULT;
    if ($("#btn-help")) $("#btn-help").classList.remove("fresh");
  };
  UI.hideTopGist = () => $("#gist").classList.add("hidden");
  /**
   * The "?" pops the goal out beside itself: the kit's one grown-ups' pop-up (js/shared/buttons.js NjgButtons.grownUpPop; S13-A2,
   * non-negotiable 3), with the grown-ups' "Play as new" (SH-60) and, while the first-time help runs, its skip (G7 / CQ15).
   */
  let guPop = null;
  const guPopNow = () => {
    const btn = $("#btn-help");
    if (!btn || !global.NjgButtons || !global.NjgButtons.grownUpPop) return null;
    if (guPop && guPop.anchor === btn) return guPop;
    guPop = global.NjgButtons.grownUpPop(btn, {
      goal: () => helpText,
      toggle: false, // (UI.init's own tap on the "?" opens and closes it)
      upgrades: true,
      // Sprint 10 (Zafar, 21 Oct): the one fresh start (words, first-time help, Cook, clinic, story, conversations), then this page's own copy
      playAsNew: () => {
        if (global.Save && global.Save.resetPlayer) global.Save.resetPlayer();
        Cook.resetSave({ fresh: true });
        if (mission) renderOrder();
      },
    });
    return guPop;
  };
  UI.openHelp = function () {
    const p = guPopNow();
    if (p) p.open();
  };
  UI.closeHelp = function () {
    if (guPop) guPop.close();
  };
  UI.helpOpen = () => !!(guPop && guPop.isOpen());

  /* ---------------- choices (small talk), as big pills ---------------- */
  let lastChoose = 0; // (Sprint 11: the flow's own small talk just ran: the kitchen conversation isn't played on top of it)
  UI.choose = function (options, correctKey, opts = {}) {
    lastChoose = Date.now();
    const box = $("#choices");
    box.innerHTML = "";
    box.classList.remove("hidden");
    let misses = 0;
    return new Promise((resolve) => {
      let glowTimer = null;
      const glowRight = () => {
        const b = box.querySelector(`[data-key="${correctKey}"]`);
        if (b) b.classList.add("glow");
      };
      if (opts.glowAfter != null) glowTimer = setTimeout(glowRight, opts.glowAfter);
      Cook.shuffle(options).forEach((o) => {
        const btn = document.createElement("div");
        btn.className = "choice";
        btn.dataset.key = o.key;
        btn.setAttribute("role", "button");
        btn.appendChild(UI.pill(o.line, { shape: "choice", noTranslate: true }));
        btn.addEventListener("click", () => {
          Cook.unlockAudio();
          if (o.key === correctKey) {
            clearTimeout(glowTimer);
            btn.classList.add("right");
            Cook.sfx.right();
            Cook.expect = null;
            setTimeout(() => {
              box.classList.add("hidden");
              box.innerHTML = "";
              resolve({ misses });
            }, 350);
          } else {
            misses++;
            btn.classList.remove("wrong");
            void btn.offsetWidth;
            btn.classList.add("wrong");
            Cook.sfx.soft();
            if (opts.onWrong) opts.onWrong(misses);
            glowRight();
          }
        });
        box.appendChild(btn);
      });
      Cook.expect = { kind: "click", selector: `#choices .choice[data-key="${correctKey}"] .wp-text`, wrong: `#choices .choice:not([data-key="${correctKey}"]) .wp-text` };
    });
  };

  /* ---------------- Nani: "pass me…" ---------------- */
  /**
   * Nani slides in from the edge and asks for something. Three look-alike
   * items on a tray; tap the one she named. Relaxed: the cooking pauses.
   * Resolves {misses}.
   */
  /*
   * Nani's card comes forward in the SIDEBAR (never over the play area: in
   * Busy mode she once covered a boiling pan). Three look-alike choices as
   * choice pills (picture + speaker), all from one look-alike group so the
   * answer is never the odd one out. Relaxed: the cooking pauses (the
   * caller sets Cook.paused). Busy: it keeps going and the play area stays
   * tappable. The two-miss highlight and the translate button show the
   * answer, so they cost the accuracy badge; from word stage 3 the right
   * picture's speaker counts as help.
   */
  function passMeOptions(want, options) {
    const groups = ((Cook.data.lookalike_groups || {}).groups || []).filter((g) => g.includes(want));
    const drawable = (id) => {
      const w = Cook.item(id);
      return !!(w && (w.heap || w.image));
    };
    // how many to choose from is the mechanic's knob (data.mechanics.passme)
    const n = Math.max(1, options.length - 1);
    const g = groups.find((x) => x.filter((id) => id !== want && drawable(id)).length >= n);
    if (!g) return options;
    return [want].concat(Cook.shuffle(g.filter((id) => id !== want && drawable(id))).slice(0, n));
  }
  UI.passMeOptions = passMeOptions;
  UI.passMe = function (want, options, opts = {}) {
    const box = $("#passme");
    options = passMeOptions(want, options);
    // decision 80: her "pass me" stays outside the request pop-up (not an order; contract-1 skips it)
    const line = Lang.role(Lang.line("give", Lang.phrase([want])), "passme");
    box.querySelector(".pm-say").innerHTML = "";
    box.querySelector(".pm-say").appendChild(UI.pill(line, { hide: opts.hide, onHear: opts.onHear, noTranslate: UI.w6(), onTranslate: () => Cook.onHelp && Cook.onHelp("translate", { ids: [want], passMe: true }) }));
    const tray = box.querySelector(".pm-tray");
    tray.innerHTML = "";
    card().classList.add("hidden");
    box.classList.remove("hidden", "leaving");
    box.classList.toggle("busy", Cook.save.mode === "busy");
    let misses = 0;
    /*
     * T19 (MAA-14, M9, M10): Nani comes ON SCREEN, over the play area (the game is paused), with a 3-second ring and
     * a tick-tock once she has asked; out of time, she looks impatient and goes (no penalty beyond its coins).
     */
    const home = box.parentNode;
    const next = box.nextSibling;
    const stage = $("#stage");
    if (stage && opts.onScreen !== false) {
      stage.appendChild(box);
      box.classList.add("onscreen");
      // ART-08 (S13-A2): on the stage her circle is the kit's big one (one of its three sizes); in the sidebar, the row
      if (global.Face) global.Face.size(box.querySelector(".pm-face"), "big");
    }
    // her nod as she asks (the kit's talk, css/shared/face.css .talk)
    const pmFace = box.querySelector(".pm-face");
    if (pmFace) {
      pmFace.classList.add("talk");
      setTimeout(() => pmFace.classList.remove("talk"), 1800);
    }
    let ring = box.querySelector(".pm-ring");
    if (!ring) {
      ring = document.createElement("div");
      ring.className = "pm-ring";
      ring.innerHTML = `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="16" class="pm-ring-bg"/><circle cx="20" cy="20" r="16" class="pm-ring-fg"/></svg>`;
      box.querySelector(".pm-nani").appendChild(ring);
    }
    ring.classList.remove("run");
    box.classList.remove("late");
    const ringMs = opts.ringMs || (Cook.data.calm || {}).passMeRingMs || 3000;
    // MAA-14: her frown is fetched now, so the swap at the end of the ring is instant (the same framing as her face here)
    if (typeof Image !== "undefined") new Image().src = Cook.v(Cook.facePath("nani", "frown"));
    let clock = null;
    let ticker = null;
    let over = false;
    const stopClock = () => {
      clearTimeout(clock);
      clearInterval(ticker);
      ring.classList.remove("run");
    };
    const putBack = () => {
      box.classList.remove("onscreen", "late");
      if (global.Face) global.Face.size(box.querySelector(".pm-face"), "row");
      const fi = box.querySelector(".pm-face img");
      if (fi && fi.dataset.home) {
        fi.src = fi.dataset.home;
        delete fi.dataset.home;
      }
      if (home && box.parentNode !== home) home.insertBefore(box, next);
    };
    const said = UI.naniMuted() ? Promise.resolve() : Promise.resolve(Lang.speak(line)).catch(() => {});
    return new Promise((resolve) => {
      said.then(() => {
        if (over || box.classList.contains("hidden")) return;
        void ring.offsetWidth;
        ring.style.setProperty("--pm-ring-ms", `${ringMs}ms`);
        ring.classList.add("run");
        let tock = false;
        ticker = setInterval(() => ((tock = !tock), Cook.sfx.click && Cook.sfx.click()), 500);
        clock = setTimeout(() => {
          if (over) return;
          over = true;
          stopClock();
          box.classList.add("late");
          // MAA-14: out of time she looks impatient (her own frown face), then goes; her usual face comes back with her
          const fi = box.querySelector(".pm-face img");
          if (fi && !fi.dataset.home) {
            fi.dataset.home = fi.getAttribute("src");
            fi.src = Cook.v(Cook.facePath("nani", "frown"));
          }
          if (Cook.expect && String(Cook.expect.selector || "").startsWith("#passme")) Cook.expect = null;
          setTimeout(() => {
            box.classList.add("leaving");
            setTimeout(() => {
              box.classList.add("hidden");
              putBack();
              resolve({ misses: misses + 1, late: true });
            }, 300);
          }, 900);
        }, ringMs);
      });
      Cook.shuffle(options).forEach((id) => {
        const b = document.createElement("div");
        b.className = "pm-item";
        b.dataset.id = id;
        b.setAttribute("role", "button");
        b.setAttribute("aria-label", "This one");
        const voice = Lang.hasVoice(Lang.wordLine(id));
        // in the pantry, the thing as it stands on the shelf (pantry v2), not its top-down bowl
        const shelf = Cook.scene && Cook.scene.viewName === "pantry" && Cook.Art.refUrl(`${id}.shelf`);
        b.innerHTML = `<img src="${shelf || Cook.Art.wordUrl(id)}" alt="">${voice ? `<button class="wp-say" type="button" aria-label="Hear its name">${ICON.speaker}</button>` : ""}`;
        const say = b.querySelector(".wp-say");
        if (say)
          say.addEventListener("click", (ev) => {
            ev.stopPropagation();
            Cook.unlockAudio();
            say.classList.add("on");
            if (Cook.onLabel) Cook.onLabel(id, { passMe: want });
            Lang.speakWord(id).then(() => say.classList.remove("on"));
          });
        b.addEventListener("click", () => {
          Cook.unlockAudio();
          if (b.parentNode !== tray || box.classList.contains("leaving")) return;
          // Wave 6b (UX 11): from level 2 a wrong pick is taken like any other (she says thanks);
          // the end review shows it
          const quiet = id !== want && Cook.quietMistakes && Cook.quietMistakes(Cook.ctx);
          if (over) return;
          if (id === want || quiet) {
            over = true;
            stopClock();
            if (quiet) misses++;
            b.classList.add(quiet ? "picked" : "right");
            if (quiet) Cook.sfx.pop();
            else Cook.sfx.right();
            if (Cook.expect && String(Cook.expect.selector || "").startsWith("#passme")) Cook.expect = null;
            setTimeout(() => {
              box.classList.add("leaving");
              setTimeout(() => {
                box.classList.add("hidden");
                putBack();
                // contract-3 (S05-C): her "Thank you!" finishes before play (and the next station) goes on, never under it
                const thanksLine = Lang.role(Lang.line("thanks"), "passme");
                const thanks = UI.voice(thanksLine, { ms: 900 }).catch(() => {});
                // (S05-C2) and at least as long as it is said (about 0.45 s a word, real time): a line with no clip yet
                // ends at once, and the next beat must not start under it once it is recorded
                const said = new Promise((r) => setTimeout(r, Math.max(900, Lang.plain(thanksLine).split(/\s+/).filter(Boolean).length * 450)));
                Promise.race([Promise.all([thanks, said]), new Promise((r) => setTimeout(r, 1600))]).then(() => resolve({ misses }));
              }, 300);
            }, 450);
          } else {
            misses++;
            b.classList.remove("wrong");
            void b.offsetWidth;
            b.classList.add("wrong");
            Cook.sfx.soft();
            if (!UI.naniMuted()) Lang.speak(line);
            if (misses >= 2) {
              tray.querySelector(`[data-id="${want}"]`).classList.add("glow");
              if (Cook.onHelp) Cook.onHelp("shown", { ids: [want], passMe: true });
            }
          }
        });
        tray.appendChild(b);
      });
      Cook.expect = { kind: "click", selector: `#passme .pm-item[data-id="${want}"] img`, wrong: `#passme .pm-item:not([data-id="${want}"]) img` };
    });
  };

  /* ---------------- the mission card: the order as a sequence list ---------------- */
  /*
   * The order is drawn as a list (js/cook/order.js builds the ladder): one
   * row and one dot per thing, always, [speaker] word-or-••• [👁 reveal].
   * Steps that go in order are joined by a line from dot to dot; things
   * that can go in any order sit on their own dots with no line between
   * them. "No X" rows look like the rest apart from a small ✕. Once
   * "ne poi" is well known (word stage 3+) every dot is joined by the same
   * plain line, so only the spoken "ne poi" tells you what comes in order.
   * No pictures in the rows, ever.
   *
   * Help on the card: the speaker is free while a row's words are still
   * shown as text; once they're dots, replaying costs a hint.
   * 👁 shows the Kutchi (never English) and costs the accuracy badge; so does
   * the dish row's A/En (English for the whole order) before it's done.
   *
   * Wave 5: when someone orders, the same list comes up big in the middle
   * of the picture (the intro card) while it's said, then flies down into
   * the sidebar. ↻ on the small card opens it big again.
   */
  const M = (UI.mission = {});
  let mission = null;
  const Order = () => Cook.Order;
  // s08 w2A (SH-110, the level table): the card dots its item words from L3 (frames, verbs and numbers stay written), by the
  // order's level, never by how well a word is known (L1-L2 write every word: Zafar, 19 Oct)
  const hideWord = (id) => !!mission && !!Cook.dotItem && Cook.dotItem(id, mission.level);
  const faceUrl = (who, mood) => Cook.v(Cook.facePath(who, mood));
  UI.faceUrl = faceUrl;
  M.open = function ({ who, name, ladders, lines, line, busy, how }) {
    if (!ladders) ladders = [Order().fromLines(lines || [])];
    const seqWord = Lang.frames().seq_word;
    mission = {
      who,
      name,
      ladders,
      line: line || (lines ? Lang.join(lines) : Order().speech(ladders)),
      stars: { ear: "pending", hand: "pending", third: "pending" }, // parked modes only (legacy stars)
      busy,
      // the request card's instructions (Wave 6): what to do, in plain English
      how: how || null,
      plain: !!seqWord && Cook.wordStage(seqWord) >= 3,
      english: false,
      // the order's level: how long the light bulb shows English (data.calm.bulbMs)
      level: orderLevel(),
      // Sprint 11 (B-cook): a people order (the chai tray's cups) is said item by item, each a word card that pops from the
      // guide box into its row; its rows are the shared word card's (OrderCard rowEl -> WordCard.row)
      wordRows: ladders.some((L) => (L.sections || []).some((x) => x.for)),
      away: new Set(),
    };
    // Sprint 14 (lab/cards.html, Zafar 27-28 Oct): chai's people order on the kit's s14 look (the new word cards, the sideways
    // order row, the helper card, the light); every other order keeps today's look until the roll-out
    mission.s14 = mission.wordRows && ladders.length > 0 && ladders.every((L) => L.recipe === "chai");
    UI.applyS14(mission.s14);
    // s08 w6B (contract-35, contract-36: the day flows were judged at their flow's label, L1, while day 3's maani and chai are
    // L3 and a seen profile plays later dishes higher): the order's own level, for the checks (the sidebar's data-level and a
    // Lifecycle note "order-level"), never shown to the child
    try {
      if ($("#side")) $("#side").dataset.level = String(mission.level);
      if (global.Lifecycle && global.Lifecycle.note) global.Lifecycle.note("order-level", { step: String(mission.level), by: String(who || "") });
    } catch (e) {
      /* only a marker */
    }
    UI.bulbOff();
    // SH-59 (C16): a new order starts with the "?" calm (no pulse left over from the last station or a conversation)
    if ($("#btn-help")) $("#btn-help").classList.remove("fresh");
    UI.closeHelp();
    // R4: Nani asking herself (the pantry list): one face, her line as the card's strip
    mission.stripMode = who === "nani";
    mission.strip = null;
    stationStrip = peekFolded = false; // a new order: no station card or peek folds her box (CK-38)
    applyStrip();
    if ($("#side")) $("#side").classList.remove("peek-fold");
    if (UI.stepDone) UI.stepDone();
    // Nani's box: a new order, so no station's instruction yet
    if (UI.guideFor) UI.guideFor(null);
    const el = $("#mission");
    el.classList.remove("hidden", "stamped", "arriving");
    el.classList.toggle("busy", !!busy);
    el.querySelector(".m-face").src = faceUrl(who);
    el.querySelector(".m-face").alt = name;
    el.querySelector(".m-ring").title = name;
    renderStars();
    renderOrder();
    // Sprint 11: the word cards' pictures (the row's small copy and the big one the item is said with) start now, so they
    // are there by the time each item is said (the kitchen conversation comes first)
    if (mission.wordRows) mission.ladders.forEach((L) => Order().rows(L).forEach((r) => !r.head && wcPicSrc(wcWordId(r)) && [96, 240].forEach((n) => thumbOf(Cook.v(wcPicSrc(wcWordId(r))), n))));
    UI.setPatience(busy ? 1 : null);
  };
  // parked modes only (legacy stars): Cook's card has no star box (R4)
  function renderStars() {
    const box = $("#mission .m-stars");
    if (!box) return;
    box.innerHTML = ["ear", "hand", "third"]
      .map((k) => {
        const info = UI.starInfo(k, mission.busy ? "busy" : "relaxed");
        const drain = k === "third" && mission.busy ? " drain" : "";
        return `<span class="mstar ${mission.stars[k]}${drain}" data-k="${k}" title="${esc(info.tip)}">${ICON[info.icon] || ""}</span>`;
      })
      .join("");
    if (mission.busy && mission.patience != null) paintDrain(mission.patience);
  }
  const rowHidden = (r) => !r.done && !r.revealed && r.line.segs.some((s) => s.w && (r.dots || hideWord(s.w)));
  // SH-98 (Zafar, 17 Oct: "if you click light bulb everything should be written in Kutchi"): the card's small bulb (the peek) shows EVERY word
  // and number, never a dotted one; its card is drawn that way (peekCard, set per card while its data is built, orderCards). Wave 2A's
  // level table hangs the dotted L3 card on dotsOk: it says whether a card may show its well-known words as dots (an open card
  // may; the peek never does)
  let peekCard = false;
  // SH-110 (Zafar, 26 Oct: "when the order first comes ... you should see it written in Kutchi"): the pop-up's card (drawCards big,
  // the people order's big word card) writes every word; the sidebar's card may dot them, each dotted row with its speaker
  let writtenCard = false;
  M.dotsHook = null; // wave 2A's level table: (mission) => false makes the open card at that level show no dotted words (the L3 card with some dotted is the other way round); null: as before
  const dotsOk = () => !peekCard && !writtenCard && (typeof M.dotsHook !== "function" || M.dotsHook(mission) !== false);
  const rowHide = (r) => (id) => dotsOk() && !r.done && !r.revealed && (r.dots || hideWord(id));
  // SH-101 (Zafar, 17 Oct): the peek lasts the level's time, from data (data/cook.json calm.peekMs: 7 s at level 3, the 3.5 s added to the others)
  const peekMsOf = () => {
    const t = ((Cook.data && Cook.data.calm) || {}).peekMs || {};
    const lv = Math.min(4, Math.max(1, mission ? mission.level : 1));
    return (t[lv] != null ? t[lv] : 7000) / (Cook.speed || 1);
  };
  // SH-110 (Zafar, 26 Oct: "we can't just have fully blanked out order cards on the left when the game starts"): a card closed for
  // the order to be remembered (closed.peek: the level table's L4 card, a station's closedFrom) is drawn open, its item words
  // dotted and each dotted row starting with its speaker (OrderCard speakerFirst); so no card peeks any more. A phase fold (a card
  // you can't act on now, closed without peek) still folds. Was: L4 folded to face + headline, a peek (a hint) to look
  const peeksFor = () => false;
  const memoryClosed = (closed) => !!(closed && closed.peek);
  const anyHidden = (L) => Order().rows(L).some(rowHidden);
  const hasRows = (m) => m.ladders.some((L) => L.sections.some((s) => s.groups.some((g) => g.length)));
  /**
   * The list's shape, shared by the small card and the intro card: per
   * ladder, its head (the dish) and its sections; per section, its rows,
   * each with `up` / `down` when the line joins it to the row before / after.
   */
  function shape() {
    return mission.ladders.map((L) => ({
      L,
      sections: L.sections
        .filter((s) => (!s.when || s.shown) && s.groups.some((g) => g.some((r) => !s.concealed || r.done)))
        .map((s) => {
          const plain = mission.plain && !s.simple;
          const seq = !mission.plain && s.seq && s.groups.filter((g) => g.length).length > 1;
          const rows = [];
          s.groups.forEach((g, gi) => g.forEach((r) => (!s.concealed || r.done) && rows.push({ r, gi, up: false, down: false })));
          // the line: a plain list joins every thing to the one before; a sequence
          // joins the first thing of each step to the step before. "No X" rows aren't
          // steps: the line runs past their ✕
          let prev = -1;
          rows.forEach((x, k) => {
            if (x.r.no) return;
            const first = !rows.slice(0, k).some((y) => !y.r.no && y.gi === x.gi);
            if (prev >= 0 && (plain || (seq && first && x.gi > rows[prev].gi))) {
              rows[prev].down = true;
              x.up = true;
              for (let j = prev + 1; j < k; j++) rows[j].up = rows[j].down = true;
            }
            prev = k;
          });
          // 28 Sept: an ordered job (skewer pieces, chaat layers, tadka) gets the sequence line and its next row
          return { s, rows, seq, plain };
        }),
    }));
  }
  function rowEl(L, { r, up, down }) {
    const li = document.createElement("div");
    li.className = ["lr", r.no ? "no" : "", r.done ? "done" : "", up ? "up" : "", down ? "down" : ""].filter(Boolean).join(" ");
    li.insertAdjacentHTML("beforeend", `<i class="ldot"></i>`);
    const hidden = rowHidden(r);
    li.appendChild(
      UI.pill(r.line, {
        hide: rowHide(r),
        noTranslate: true,
        reserveSay: true,
        // SH-102: hearing it again is free, written or dotted (only seeing it, the eye and the bulbs, costs a hint)
        onReveal: hidden
          ? () => {
              r.revealed = true;
              if (Cook.onHelp) Cook.onHelp("reveal", { ids: r.ids });
              renderOrder();
            }
          : null,
      })
    );
    if (mission.english && r.line.en) li.insertAdjacentHTML("beforeend", `<div class="lr-en">${esc(r.line.en)}</div>`);
    // another mode can add to a row (Find it: the running tally, the count's digit)
    if (typeof r.decorate === "function") r.decorate(li);
    return li;
  }
  /** A later dish's row ("Ne samosa."): its words, no dot. The first dish sits in the card's head. */
  function headEl(L) {
    const r = L.head;
    const li = document.createElement("div");
    li.className = ["lr", "head", r.done ? "done" : ""].filter(Boolean).join(" ");
    li.appendChild(UI.pill(r.line, { hide: rowHide(r), noTranslate: true, reserveSay: true }));
    if (mission.english && r.line.en) li.insertAdjacentHTML("beforeend", `<div class="lr-en">${esc(r.line.en)}</div>`);
    return li;
  }
  /** The card's head: the first dish's line ("Muke chai khape.") beside the face, and its English when A/En is on. */
  function renderDish() {
    const box = $("#mission .m-dish");
    const L = mission.ladders[0];
    const r = L && L.head;
    box.innerHTML = r ? `<span class="md-text">${Lang.html(r.line, { hide: rowHide(r) })}</span>${mission.english && r.line.en ? `<span class="md-en">${esc(r.line.en)}</span>` : ""}` : `<span class="md-text">${esc(mission.name)}</span>`;
    const tr = $("#mission .m-tr");
    if (tr) tr.classList.toggle("on", !!mission.english);
  }
  /** A/En: English under every row of the order (for rows still to do, that's the answer: the accuracy badge). */
  M.translate = function () {
    if (!mission) return;
    mission.english = !mission.english;
    if (mission.english && Cook.onHelp) {
      const open = [].concat(...mission.ladders.map((L) => Order().rows(L).filter((x) => !x.done)));
      if (open.length) Cook.onHelp("translate", { ids: [].concat(...open.map((x) => x.ids)) });
      else Cook.onHelp("help");
    }
    renderOrder();
  };
  function renderOrder() {
    if (!mission) return;
    if (UI.w6()) return renderOrder6();
    // (S13-B1: below is the parked pages' old ladder only, Find it, Dress up and Snap with no body.w6; Cook draws every card, the
    // sidebar's and the pop-up's, through the kit: renderOrder6 -> drawCards -> OrderCard.update)
    const box = $("#mission .m-order");
    box.innerHTML = "";
    renderDish();
    shape().forEach(({ L, sections }, li) => {
      const lad = document.createElement("div");
      lad.className = "ladder";
      if (L.head && li > 0) lad.appendChild(headEl(L));
      // a part that's all done folds onto one line (still a dot each) while other parts are to do,
      // so the part you're on stays in view on a small screen
      const open = Order().rows(L).some((r) => !r.done && !r.head);
      sections.forEach(({ s, rows }) => {
        const fold = open && !mission.english && rows.every((x) => x.r.done);
        const sec = document.createElement("div");
        sec.className = ["lsec", s.when ? "late" : "", s.for ? "lfor" : "", fold ? "folded" : ""].filter(Boolean).join(" ");
        // one person's part of the order (a cup on the Chai tray): their face, no name
        if (s.for) sec.insertAdjacentHTML("beforeend", `<img class="lface" src="${faceUrl(esc(s.for))}" alt="">`);
        const list = document.createElement("div");
        list.className = "lrows";
        if (fold) list.innerHTML = rows.map(({ r }) => `<span class="lc${r.no ? " no" : ""}"><i class="ldot"></i>${Lang.html(r.line)}</span>`).join("");
        else rows.forEach((x) => list.appendChild(rowEl(L, x)));
        sec.appendChild(list);
        lad.appendChild(sec);
      });
      box.appendChild(lad);
    });
    if (introOpen()) renderIntro();
  }

  /* ---------------- the order pop-up: the order, big, in the middle ---------------- */
  /*
   * S13-B1 (the kit review's decision 4; contract-41): Cook's order pop-up is the kit's (js/shared/request-popup.js, the
   * .njg-rq-card the clinic and the day draw): Lifecycle.request with host (the play area) and build (its body), the cards drawn
   * there by drawCards({big}). Cook's own #intro and its CSS went. rq is the open pop-up ({body, along}); a parked page (Find
   * it, Dress up, Snap: no body.w6) still brings its own #intro and the old drawing below (renderIntro, M.introduce's parked path)
   */
  let rq = null;
  const intro = () => $("#intro");
  const introOpen = () => (rq ? !!rq.body && rq.body.isConnected : !!intro() && !intro().classList.contains("hidden"));
  const RQ_CARD = ".njg-rq-card"; // (the players' tap-through target: Cook.expect's selector)
  function request(o, draw) {
    let me = null;
    return global.Lifecycle.request(
      Object.assign({ host: $("#stage") }, o, {
        build(body) {
          me = rq = { body, along: !!o.along, off: global.FitText && global.FitText.watch ? global.FitText.watch(body) : null };
          if (draw) draw(body);
        },
      })
    ).finally(() => {
      if (me && me.off) me.off();
      if (rq === me) rq = null;
    });
  }
  function renderIntro() {
    if (rq) return rq.along ? null : renderIntro6(); // (Sprint 11: along, the item said now is the pop-up's only card)
    if (!intro() || intro().classList.contains("along")) return;
    if (UI.w6()) return;
    const box = intro().querySelector(".ic-order");
    box.innerHTML = "";
    shape().forEach(({ L, sections }) => {
      const lad = document.createElement("div");
      lad.className = "ladder";
      if (L.head) lad.insertAdjacentHTML("beforeend", `<div class="ir head"><span class="ir-text">${Lang.html(L.head.cardLine || L.head.line, { hide: rowHide(L.head) })}</span></div>`);
      sections.forEach(({ s, rows }) => {
        const sec = document.createElement("div");
        sec.className = ["lsec", s.for ? "lfor" : ""].filter(Boolean).join(" ");
        if (s.for) sec.insertAdjacentHTML("beforeend", `<img class="lface" src="${faceUrl(esc(s.for))}" alt="">`);
        const cls = ({ r, up, down }) => ["ir", r.no ? "no" : "", r.done ? "done" : "", up ? "up" : "", down ? "down" : ""].filter(Boolean).join(" ");
        sec.insertAdjacentHTML("beforeend", `<div class="lrows">${rows.map((x) => `<div class="${cls(x)}"><i class="ldot"></i><span class="ir-text">${Lang.html(x.r.line, { hide: rowHide(x.r) })}</span></div>`).join("")}</div>`);
        lad.appendChild(sec);
      });
      box.appendChild(lad);
    });
  }
  /*
   * Sprint 11 (B-cook, task 1; docs/game-design/easy-to-play.md principle 10; Zafar, 14 Oct: "model, then ask"): the kitchen
   * conversation before the order, through the shared module (js/shared/conversations.js, placements CK1 then CK2: the
   * customer's salaam or how are you, else the ask, make me chai). Its bubbles sit at the speaker's head on the counter, the
   * reply pills bottom right; it models the answer itself when nobody answers (its own idle time), so it never holds the
   * game. The module keeps its own caps (one a visit, then one every 2 minutes; none in a save's first order). Not after the
   * flow's own small talk (story mode's greeting, which runs through UI.choose), so nothing is greeted twice.
   */
  let convN = 0;
  async function kitchenTalk() {
    const m = mission;
    if (!m || m.talked || m.who === "nani" || !Cook.scene) return;
    m.talked = true;
    if (Date.now() - lastChoose < 20000) return;
    const ctx = Cook.ctx || {};
    const C = await UI.needShared("conversations");
    if (!C || !C.maybe || m !== mission) return;
    const S = Cook.scene;
    const who = m.who;
    const token = Cook.run;
    const prevExpect = Cook.expect;
    // (the test players wait: the moment ends by itself, as for a child who doesn't answer)
    Cook.expect = { kind: "wait", talk: true };
    try {
      C.speed = Cook.speed || 1;
      if (C.startVisitNow && !kitchenTalk.visit) kitchenTalk.visit = (C.startVisitNow("cook"), true);
      const cv = document.querySelector("#game canvas");
      const anchor = (id) => {
        const img = S.chars && S.chars[id === "ali" ? "cousin" : id];
        if (!img || !cv || !S.headBox) return null;
        const hb = S.headBox(img);
        const a = UI.worldToScreen(hb.x + hb.w / 2, hb.y);
        return { x: a.x, y: a.y };
      };
      const base = {
        mode: "cook",
        round: `cook-order-${++convN}`,
        busy: Cook.save.mode === "busy",
        firstRound: !ctx.lab && !(Cook.save.orders > 0),
        speaker: who === "cousin" ? "ali" : who,
        anchor,
        container: document.body,
        character: {
          mood: (id, kind) => {
            const cw = id === "ali" ? "cousin" : id;
            if (S.chars && S.chars[cw]) S.setMood(cw, kind === "happy" ? "happy" : "neutral");
            // CHAI-31 (the judge: "a generic emoji face, not Nana's portrait"): the bubble's face is the speaker's own,
            // as on the order's card (the module redraws its face on every mood: it is put back each time)
            document.querySelectorAll(`.cv-bubble[data-speaker="${id}"] .cv-face`).forEach((f) => {
              // ART-08 (S13-A2): the kit's one face circle (js/shared/face.js), the row size, as on the card
              const src = faceUrl(cw, kind === "happy" ? "happy" : undefined);
              if (f.querySelector(".njg-face") && f.dataset.face === src) return;
              f.dataset.face = src;
              f.innerHTML = global.Face.html(cw, "row", { src, alt: "" });
              const im = f.querySelector("img");
              im.onerror = () => (im.onerror = null, (im.src = faceUrl(cw)));
              // CHAI-31 (the judge: the bubble cut off at the top at 915x412): the face makes it taller than the module placed
              // it for, so it comes down into the screen if it reaches past the top (never clipped: non-negotiable 9)
              const b = f.closest(".cv-bubble");
              const fit = () => {
                if (!b || !b.isConnected) return;
                const r = b.getBoundingClientRect();
                if (r.top < 8) b.style.top = `${parseFloat(b.style.top || "0") + (8 - r.top)}px`;
              };
              im.onload = fit;
              requestAnimationFrame(fit);
            });
          },
        },
      };
      const dish = (((ctx.order || {}).dishes || [])[0] || {}).recipe || "chai";
      const c1 = await C.maybe(Object.assign({ placement: "CK1" }, base));
      if (!c1.ran && token === Cook.run) await C.maybe(Object.assign({ placement: "CK2", x: { dish: dish === "chai" ? "cook-chai" : `cook-${dish}` } }, base));
    } catch (e) {
      /* the conversation is never the game: the order goes on */
    } finally {
      if (Cook.expect && Cook.expect.talk) Cook.expect = prevExpect && !prevExpect.talk ? prevExpect : null;
    }
    Cook.checkRun(token);
  }

  /*
   * Sprint 11 (B-cook, task 2; easy-to-play principles 6 and 9): a people order said item by item. The asker stays in
   * view at the counter and says each part of their card in their own bubble at their head; as each item is said its word
   * card shows big at the top left of the play area, by the guide box, then flies into its row on their sidebar card
   * (WordCard.fly), so the card fills as it is said. Still the shared request pop-up (Lifecycle.request: a tap anywhere stops the
   * voice and lands every row at once), in its see-through kind (along, S13-B1): no veil, nothing over a face, the word card
   * said now made by the kit's one entrance (WordCard.pop) in the pop-up's body.
   */
  async function introduceAlong(opts = {}) {
    const m = mission;
    let box = null;
    const people = orderCards().filter((c) => c.who);
    // every person's row waits off the card until it is said
    m.away = new Set([].concat(...people.map((c) => c.rows.filter((r) => !r.head))));
    renderOrder();
    UI.closeHelp();
    const token = Cook.run;
    let skipped = false;
    const prevExpect = Cook.expect;
    Cook.expect = { kind: "click", selector: RQ_CARD, intro: true };
    const rowElOf = (who, r) => {
      const c = [...document.querySelectorAll("#mission .oc-card")].find((x) => x.dataset.who === who);
      return c ? (sideEls.get(r) || []).find((e) => c.contains(e) && e.classList.contains("oc-row")) || null : null;
    };
    // Sprint 14 (SH-150, SH-144, SH-152; lab/cards.html playOrder): on the s14 look the word said now pops out big by the side
    // panel (never in the pop-up's box), the order row glides to its card meanwhile (never a jump), and the big card then moves
    // and turns into the row's card (WordCard.morph: no fade out and in)
    const s14 = UI.s14() && global.WordCard && global.WordCard.big14 && global.WordCard.morph;
    let big14 = null;
    let tapAt = 0;
    const pop14 = (w) => {
      if (big14) big14.remove();
      const side = $("#side");
      const st = $("#stage");
      if (!side || !st) return null;
      const play = st.getBoundingClientRect();
      const sr = side.getBoundingClientRect();
      const c = global.WordCard.big14(null, w.word, Object.assign({}, w.wordOpts || {}, { cls: "wc14-pop" }));
      const wd = Math.round(Math.min(300, play.height * 0.6, play.width * 0.42));
      Object.assign(c.style, { position: "fixed", left: `${sr.right + 14}px`, top: `${play.top + 10}px`, width: `${wd}px`, zIndex: "45", pointerEvents: "none", margin: "0" });
      document.body.appendChild(c);
      global.WordCard.fit14(c);
      // (shorter screens: the card keeps inside the play area, its picture shorter first)
      if (c.offsetHeight > play.height - 20) c.classList.add("wc14-small");
      // SH-154 (Zafar, 29 Oct): never over a face: placed in the free space beside the side panel, measured against every face
      // on screen (the people's heads in the kitchen, any face circle in the play area) and the bubbles
      placeFree14(c, play, sr, wd);
      if (c.animate) c.animate([{ opacity: 0, transform: "scale(0.6)" }, { opacity: 1, transform: "scale(1.04)" }, { transform: "scale(1)" }], { duration: 380 / (Cook.speed || 1), easing: "cubic-bezier(.2,.8,.2,1)" });
      big14 = c;
      return c;
    };
    // SH-154: the faces on screen (page px): every character's head in the scene (Cook.scene headBox), every face circle in the
    // play area (DOM), each with a small margin
    const faces14 = () => {
      const out = [];
      const S = Cook.scene;
      try {
        Object.values((S && S.chars) || {}).forEach((img) => {
          if (!img || !img.active || img.visible === false || !S.headBox) return;
          const hb = S.headBox(img);
          const a = UI.worldToScreen(hb.x, hb.y);
          const z = UI.worldToScreen(hb.x + hb.w, hb.y + hb.h);
          out.push({ left: a.x - 8, top: a.y - 8, right: z.x + 8, bottom: z.y + 8 });
        });
      } catch (e) {
        /* no scene */
      }
      // (every face circle on the page: the play area's and the side panel's, Nani's and the order card's)
      document.querySelectorAll(".njg-face, .cv-face, .oc-face, .face-say").forEach((f) => {
        if (f.closest(".wc14-pop, .wc14-flyer")) return;
        const b = f.getBoundingClientRect();
        if (b.width > 0) out.push({ left: b.left - 6, top: b.top - 6, right: b.right + 6, bottom: b.bottom + 6 });
      });
      return out;
    };
    const overlap14 = (r, list) => list.reduce((a, b) => a + Math.max(0, Math.min(r.right, b.right) - Math.max(r.left, b.left)) * Math.max(0, Math.min(r.bottom, b.bottom) - Math.max(r.top, b.top)), 0);
    function placeFree14(c, play, sr, wd) {
      const faces = faces14();
      const bubs = [...document.querySelectorAll(".cv-bubble")].map((b) => b.getBoundingClientRect()).filter((b) => b.width > 0);
      const pad = 10;
      const smallAt = c.classList.contains("wc14-small");
      let best = null;
      const perfect = () => best && best.onFace === 0 && best.onBub === 0;
      // one area (x from x0 to x1, y from y0 to y1), at each width from the full card down (a smaller picture from 160 px): the spots
      // from its top left outwards; the best is the one over no face, then over the fewest bubbles, then the nearest the side panel
      const scan = (x0, x1, y0, y1, widths, cost) => {
        for (const w of widths.map(Math.round)) {
          if (w < 100 || w > x1 - x0) continue;
          c.style.width = `${w}px`;
          c.classList.toggle("wc14-small", smallAt || w <= 160);
          global.WordCard.fit14(c);
          const h = c.offsetHeight;
          for (let y = y0; y + h <= y1 + 0.5 || y === y0; y += 12) {
            for (let x = x0; x + w <= x1 + 0.5 || x === x0; x += 16) {
              const r = { left: x, top: y, right: x + w, bottom: y + h };
              const onFace = overlap14(r, faces);
              const onBub = overlap14(r, bubs);
              const score = cost + onBub + (x - x0) * 0.5 + (y - y0) * 0.25;
              if (!best || onFace < best.onFace || (onFace === best.onFace && score < best.score)) best = { x, y, w, h, score, onFace, onBub, small: c.classList.contains("wc14-small") };
              if (onFace === 0 && onBub === 0) break;
            }
            if (perfect()) return;
          }
        }
      };
      // the play area beside the side panel first; then, a phone with three people at the counter and no face-free spot there,
      // over the side panel (the order card the big card is about to turn into), still never over a face (contract-76: 740x320)
      // (Zafar, 29 Oct: "If there's three, put the cards bottom left under the face": from the central rules' popBelowFacesFrom
      // people on, the space under the people's heads, from the left, comes first)
      const heads = (() => {
        const S = Cook.scene;
        return Object.values((S && S.chars) || {}).filter((img) => img && img.active && img.visible !== false);
      })();
      if (global.Rules && heads.length >= global.Rules.popBelowFacesFrom()) {
        // (Zafar, 29 Oct: "If there's three people and no space for the big card under the left face they use the smaller card
        // version ... or just scale it down to fit. With three people there won't be a better place": always under the faces at
        // the left, the card narrower, then smaller, then scaled to the room there)
        const under = faces.filter((f) => f.left >= sr.right).reduce((m, f) => Math.max(m, f.bottom), play.top);
        const y0 = under + pad;
        const room = Math.max(40, play.bottom - pad - y0);
        let w = wd;
        for (w of [wd, wd * 0.85, wd * 0.7, 160, 130, 110, 95, 80].map(Math.round)) {
          c.style.width = `${w}px`;
          c.classList.toggle("wc14-small", smallAt || w <= 160);
          global.WordCard.fit14(c);
          if (c.offsetHeight <= room) break;
        }
        // (its speaker and words have their smallest sizes, so past the narrowest card the whole card is scaled down to the room:
        // zoom, so its box and the move into its row card see the size it shows at)
        const k = c.offsetHeight > room ? Math.max(0.3, room / c.offsetHeight) : 1;
        c.style.zoom = k < 1 ? String(Math.round(k * 1000) / 1000) : "";
        // (a zoomed element's left and top are zoomed too: given in its own scale)
        Object.assign(c.style, { left: `${Math.round((sr.right + 14) / k)}px`, top: `${Math.round(y0 / k)}px` });
        try {
          if (global.Lifecycle && global.Lifecycle.note) global.Lifecycle.note("pop-face", { step: "0", by: JSON.stringify({ under: true, w, k: Math.round(k * 100) / 100, y: Math.round(y0) }) });
        } catch (e) {
          /* only a log */
        }
        return;
      }
      if (!perfect()) scan(sr.right + 14, play.right - pad, play.top + pad, play.bottom - pad, [wd, wd * 0.85, wd * 0.7, 160, 130, 110], best ? 1 : 0);
      if (best && best.onFace > 0) scan(sr.left + 8, sr.right - 8, Math.max(play.top, sr.top) + pad, Math.min(play.bottom, sr.bottom) - pad, [Math.min(wd, sr.width - 16), 160, 130, 110], 1e6);
      if (!best) return;
      c.style.width = `${best.w}px`;
      c.classList.toggle("wc14-small", !!best.small);
      global.WordCard.fit14(c);
      Object.assign(c.style, { left: `${Math.round(best.x)}px`, top: `${Math.round(best.y)}px` });
      // (SH-154's check: how much of the card sits over a face, for the contract checks only)
      try {
        const f0 = faces[0];
        if (global.Lifecycle && global.Lifecycle.note) global.Lifecycle.note("pop-face", { step: String(Math.round(best.onFace)), by: JSON.stringify({ faces: faces.length, w: best.w, x: Math.round(best.x), y: Math.round(best.y), f: f0 ? [f0.left, f0.top, f0.right, f0.bottom].map(Math.round) : null }) });
      } catch (e) {
        /* only a log */
      }
    }
    // SH-155: the big card's hold by the word's state (the central rules: new 1.5 s, learning 1.0 s, known 0.6 s), its line said meanwhile
    const hold14 = (r) => {
      if (!global.Rules) return 0;
      let rec = null;
      try {
        const P = Cook.core && Cook.core.progress;
        rec = P && P.get ? P.get(wcWordId(r)) : null;
      } catch (e) {
        rec = null;
      }
      return global.Rules.hold(global.Rules.wordState(rec));
    };
    const land = (r, who, fast) => {
      if (s14) {
        const to = rowElOf(who, r);
        const big = big14;
        big14 = null;
        const done = () => {
          m.away.delete(r);
          if (to) to.classList.remove("oc-away");
          if (big) big.remove();
        };
        if (fast || !big || !to) return Promise.resolve(done());
        return global.WordCard.morph(big, to).catch(() => {}).then(done);
      }
      m.away.delete(r);
      const to = rowElOf(who, r);
      if (!to) return Promise.resolve();
      const big = box && box.querySelector(".wc-card");
      if (fast || !big) {
        to.classList.remove("oc-away");
        return Promise.resolve();
      }
      // (the row's frame shows; its word card flies in from the big one: WordCard.fly hides it until it lands)
      const wc = to.querySelector(":scope > .wc") || to;
      to.classList.remove("oc-away");
      // (the flight starts from the big card's place, read at once; the big card then goes, so the word is never on screen twice)
      const flight = global.WordCard.fly(big, wc).catch(() => wc.classList.remove("wc-away"));
      big.remove();
      return flight;
    };
    const sayPart = async (who, line) => {
      const S = Cook.scene;
      if (S && S.chars && S.chars[who] && S.talk) return S.talk(who, line, { ms: Cook.readMs(Lang.plain(line)) * 0.6 });
      // (nobody at the counter to say it: the card's own read-along)
      return Lang.hasVoice(line) ? Promise.all([Lang.speak(line), Cook.wait(700)]) : Cook.wait(Cook.readMs(Lang.plain(line)) * 0.6);
    };
    const read = async () => {
      for (const who of people.map((c) => c.who)) {
        if (skipped || token !== Cook.run) return;
        const c = [...document.querySelectorAll("#mission .oc-card")].find((x) => x.dataset.who === who);
        if (!c || !c._parts) continue;
        if (M.focus) M.focus(who);
        const parts = c._parts();
        for (const p of parts) {
          if (skipped || token !== Cook.run) return;
          const r = p.row;
          const item = r && m.away.has(r);
          if (!box) return;
          box.innerHTML = "";
          if (item) {
            const w = UI.wordOf(r, { size: 240, written: true });
            if (w && s14) {
              pop14(w);
              const slot = rowElOf(who, r);
              if (slot && OCard() && OCard().glideTo) OCard().glideTo(slot);
              if (slot && slot.closest(".oc-card") && slot.closest(".oc-card").scrollIntoView) slot.closest(".oc-card").scrollIntoView({ block: "nearest", behavior: "smooth" });
            } else if (w) global.WordCard.pop(box, w.word, w.wordOpts);
          }
          try {
            // (s14: the big card stays at least its hold, the line said meanwhile; never waits for the voice past it)
            await Promise.all([sayPart(who, p.line), item && s14 ? Cook.wait(hold14(r)) : null]);
          } catch (e) {
            if (!(e instanceof Cook.Abort)) throw e;
          }
          if (item && !skipped) await land(r, who, false);
          if (box) box.innerHTML = "";
          if (!skipped) await Cook.wait(120);
        }
        UI.hideBubble();
      }
    };
    try {
      await request(
        {
          reason: "cook:order",
          along: true,
          target: () => $("#mission"),
          lead: 0,
          hold: 300,
          wait: (ms) => Cook.wait(ms),
          // the sidebar card's face is the replay (it is outside the pop-up); a tap on the play area lands everything at once
          // (SH-157: on the central rules, a tap on a bubble, the cog or its menu does its own thing and never skips:
          // global.Rules.skips(target), through the pop-up's zones)
          zones: s14 && !!global.Rules && typeof global.Rules.skips === "function",
          onTap: () => ((tapAt = tapAt || Date.now()), (skipped = true)),
          onStop: () => UI.hush(),
          read,
        },
        (body) => (box = body)
      );
    } finally {
      skipped = true;
      if (box) box.innerHTML = "";
      // (Sprint 14: a tap on the kitchen lands the whole order at once: no big card or copy of one left on screen, CK-54)
      if (big14) big14.remove();
      big14 = null;
      document.querySelectorAll(".wc14-pop, .wc14-flyer").forEach((x) => x.remove());
      UI.hideBubble();
      stopReading();
      if (m === mission) {
        m.away.clear();
        renderOrder();
        // (the row from its first card)
        // (as a glide, so a redraw carries it on: never back to the order's last card)
        if (s14) document.querySelectorAll("#mission .oc-row14").forEach((x) => x.firstElementChild && OCard().glideTo(x.firstElementChild, { home: true }));
      }
      // CK-54's check (contract-74): a tap on the kitchen while the order was given: how long until every card was in its row,
      // and what was left over (a row still away, a big card or a copy of one), logged for the checks only
      if (tapAt && s14) {
        const left = document.querySelectorAll("#mission .oc-row.oc-away, .wc14-pop, .wc14-flyer").length;
        try {
          if (global.Lifecycle && global.Lifecycle.note) global.Lifecycle.note("order-skip", { step: String(Date.now() - tapAt), by: `left:${left}` });
        } catch (e) {
          /* only a log */
        }
      }
      if (M.focus && m === mission) M.focus(null);
      if (Cook.expect && Cook.expect.intro) Cook.expect = prevExpect && !prevExpect.intro ? prevExpect : null;
    }
    Cook.checkRun(token);
  }

  /*
   * The order big while it's said, in the kit's pop-up (S13-B1; was Cook's #intro): its cards drawn by drawCards({big}) in the
   * pop-up's body (renderIntro6), each person reading their own card (decision 53), a tap anywhere but a face stops the voice
   * and folds it into the sidebar (S03-A, SH-64); opts.only: a part of the order revealed mid-station (only its rows are read)
   */
  async function introduceKit(opts, people) {
    const m = mission;
    const faces = () => (rq && rq.body ? [...rq.body.querySelectorAll(".oc-face")] : []);
    $("#mission").classList.add("arriving");
    UI.closeHelp();
    const token = Cook.run;
    let skipped = false;
    const onSay = (ev) => {
      ev.stopPropagation();
      Cook.unlockAudio();
      faces().forEach((f) => f.classList.add("on"));
      readAlong(partsOf(m.line, introEls)).then(() => faces().forEach((f) => f.classList.remove("on")));
    };
    const prevExpect = Cook.expect;
    Cook.expect = { kind: "click", selector: RQ_CARD, intro: true };
    const only = opts.only || null;
    const onlyRow = (p) => [].concat(p.row || [], (p.line && p.line.rows) || [], (p.line && p.line.row) || []).some((r) => only.includes(r));
    const keep = (parts) => (only ? (parts.some(onlyRow) ? parts.filter((p, i) => i === 0 || onlyRow(p)) : []) : parts);
    const sayPeople = async () => {
      const cards = rq && rq.body ? [...rq.body.querySelectorAll(only ? ".oc-card" : ".oc-card[data-who]")] : [];
      for (const c of cards) {
        if (skipped || token !== Cook.run) return;
        const parts = keep(c._parts ? c._parts() : []);
        if (!parts.length) continue;
        const face = c.querySelector(".oc-face");
        c.classList.add("speaking");
        if (face) face.classList.add("on");
        try {
          await readAlong(parts, { min: 700 });
        } finally {
          c.classList.remove("speaking");
          if (face) face.classList.remove("on");
        }
        await Cook.wait(160);
      }
    };
    // Wave 6: read along: each part lights up on the card as it's said
    const read = () => ((people || only) && opts.speak !== false ? sayPeople() : opts.speak !== false ? readAlong(keep(partsOf(m.line, introEls)), { min: 900 }) : Cook.wait(Cook.readMs(Lang.plain(m.line))));
    try {
      await request(
        {
          reason: opts.only ? "cook:reveal" : "cook:order",
          target: () => $("#mission"),
          lead: 0,
          hold: opts.pause != null ? opts.pause : 1400,
          wait: (ms) => Cook.wait(ms),
          ignore: (ev) => {
            if (!ev.target.closest(".oc-face")) return false;
            onSay(ev);
            return true;
          },
          onTap: () => (skipped = true),
          onStop: () => UI.hush(),
          read,
        },
        () => renderIntro6()
      );
    } finally {
      stopReading();
      if (Cook.expect && Cook.expect.intro) Cook.expect = prevExpect && !prevExpect.intro ? prevExpect : null;
    }
    Cook.checkRun(token);
    const target = $("#mission");
    target.classList.remove("arriving");
    target.classList.add("landed");
    setTimeout(() => target.classList.remove("landed"), 400);
  }
  /**
   * Show the order big while it's said. Resolves once it has flown into
   * the sidebar: on a tap, or after the voice and a short pause.
   */
  M.introduce = async function (opts = {}) {
    if (!mission) return;
    // decision 53 (CHAI-15, T6): requests first: everyone's own order comes up front (a cup's rows that waited for
    // the tray too), each person's card read in turn, lit as they say it (tap to skip); then the game is quiet
    const people = opts.people !== false && mission.ladders.some((L) => L.sections.some((s) => s.for));
    if (people) {
      mission.ladders.forEach((L) => L.sections.forEach((s) => s.for && s.when && (s.shown = true)));
      mission.peopleSaid = true;
      renderOrder();
    }
    if (!hasRows(mission)) return;
    // Sprint 11 (B-cook, task 1; Zafar, 14 Oct: "model, then ask"): the kitchen conversation plays before the order (a
    // people order's rows wait off its card meanwhile: they come as they are said)
    const along = people && !opts.only && mission.wordRows && global.WordCard && OCard() && UI.w6();
    if (along) {
      mission.away = new Set([].concat(...orderCards().filter((c) => c.who).map((c) => c.rows.filter((r) => !r.head))));
      renderOrder();
    }
    if (!opts.only && opts.pause == null) await kitchenTalk();
    // Sprint 11 (task 2): a people order (the chai cups) is said item by item at the asker's face, each its word card
    if (along) return introduceAlong(opts);
    if (UI.w6()) return introduceKit(opts, people);
    // (a parked page: its own #intro and the old drawing)
    const m = mission;
    const el = intro();
    el.classList.remove("along");
    const card = el.querySelector(".ic-card");
    el.querySelector(".ic-face").src = faceUrl(m.who);
    const nameEl = el.querySelector(".ic-name");
    if (nameEl) nameEl.textContent = m.name;
    // 28 Sept (Zafar): no English instructions on a pop-up; the card itself shows the task
    const how = el.querySelector(".ic-how");
    if (how) how.textContent = "";
    // the face is the replay button: the old head's (Wave 5) or the order card's (design system 12), found at the tap (the card is redrawn)
    const faces = () => [...el.querySelectorAll(".ic-say, .oc-face")];
    renderIntro();
    $("#mission").classList.add("arriving");
    el.classList.remove("hidden");
    UI.closeHelp();
    const token = Cook.run;
    let done;
    const tapped = new Promise((resolve) => (done = resolve));
    const onSay = (ev) => {
      ev.stopPropagation();
      Cook.unlockAudio();
      faces().forEach((f) => f.classList.add("on"));
      (UI.w6() ? readAlong(partsOf(m.line, introEls)) : Lang.speak(m.line)).then(() => faces().forEach((f) => f.classList.remove("on")));
    };
    const prevExpect = Cook.expect;
    Cook.expect = { kind: "click", selector: "#intro .ic-card", intro: true };
    card.classList.add("talk");
    const voice = opts.speak !== false && Lang.hasVoice(m.line);
    // decision 53: each person says their own card (their face lights: the card is their bubble), one after another
    let skipped = false;
    tapped.then(() => (skipped = true));
    // M.request: only the revealed rows are read (the headline first, as a person's own card says it)
    const only = opts.only || null;
    const onlyRow = (p) => [].concat(p.row || [], (p.line && p.line.rows) || [], (p.line && p.line.row) || []).some((r) => only.includes(r));
    const keep = (parts) => (only ? (parts.some(onlyRow) ? parts.filter((p, i) => i === 0 || onlyRow(p)) : []) : parts);
    const sayPeople = async () => {
      const cards = [...intro().querySelectorAll(only ? ".ic-order .oc-card" : ".ic-order .oc-card[data-who]")];
      for (const c of cards) {
        if (skipped || token !== Cook.run) return;
        const parts = keep(c._parts ? c._parts() : []);
        if (!parts.length) continue;
        const face = c.querySelector(".oc-face");
        c.classList.add("speaking");
        if (face) face.classList.add("on");
        try {
          await readAlong(parts, { min: 700 });
        } finally {
          c.classList.remove("speaking");
          if (face) face.classList.remove("on");
        }
        await Cook.wait(160);
      }
    };
    // S03-A (decision 53, SH-64), S04-B: the shared lifecycle's request pop-up (js/shared/request-popup.js) runs it:
    // read out while it's up; a tap anywhere but a face stops the voice at once (the one voice layer, UI.hush) and folds
    // it into the sidebar. opts.only: a part of the order revealed mid-station (M.request): only its rows are read
    const read = () => {
      // Wave 6: read along: each part lights up on the card as it's said
      const said = (people || only) && opts.speak !== false ? sayPeople() : UI.w6() && opts.speak !== false ? readAlong(keep(partsOf(m.line, introEls)), { min: 900 }) : voice ? Promise.all([Lang.speak(m.line), Cook.wait(900)]) : Cook.wait(Cook.readMs(Lang.plain(m.line)));
      return said.then(() => card.classList.remove("talk"));
    };
    try {
      await global.Lifecycle.request({
        reason: opts.only ? "cook:reveal" : "cook:order",
        el,
        card,
        target: () => $("#mission"),
        lead: 0,
        hold: opts.pause != null ? opts.pause : 1400,
        wait: (ms) => Cook.wait(ms),
        ignore: (ev) => {
          if (!ev.target.closest(".ic-say, .oc-face")) return false;
          onSay(ev);
          return true;
        },
        onTap: () => done(),
        onStop: () => UI.hush(),
        read,
      });
    } finally {
      card.classList.remove("talk");
      stopReading();
      if (Cook.expect && Cook.expect.intro) Cook.expect = prevExpect && !prevExpect.intro ? prevExpect : null;
    }
    Cook.checkRun(token);
    const target = $("#mission");
    target.classList.remove("arriving");
    target.classList.add("landed");
    setTimeout(() => target.classList.remove("landed"), 400);
  };
  /** ↻ on the small card: the order big again, said again (a replay: help once its words are dots). */
  M.replay = async function () {
    if (!mission || introOpen() || $("#mission").classList.contains("stamped")) return;
    // Sprint 11: a people order's card says itself again on the card (its rows are already there)
    if (mission.wordRows && global.WordCard) return M.sayCard();
    const relaxed = Cook.save.mode !== "busy";
    const wasPaused = Cook.paused;
    if (relaxed) Cook.paused = true;
    try {
      await M.introduce({ pause: 1200 });
    } catch (e) {
      if (!(e instanceof Cook.Abort)) throw e;
    } finally {
      if (relaxed) Cook.paused = wasPaused;
    }
  };
  /**
   * s04-fxc (decision 53, 75 (1), contract-1): a phase that gives Nani's own order with no request pop-up since the
   * last stage ended (the chop again, only the vegetables that were wrong: "Kali ba mirchi.") opens with the shared
   * request pop-up: her card, the line read out, folding into her box; then the station is quiet. Resolves {asked}:
   * false when a pop-up already opened this phase (the line is said as before).
   */
  M.askLine = async function (line, { who = "nani", hide } = {}) {
    const L = global.Lifecycle;
    const OC = OCard();
    if (!line || !L || !L.asked || L.asked() || introOpen() || !OC || !UI.w6()) return { asked: false };
    // (the kit's pop-up, S13-B1: her card, with its own face, drawn in its body)
    const rec = line.ok === false;
    const draw = (body) => body.appendChild(OC.card({ person: { id: who, face: faceUrl(who), name: who === "nani" ? "Nani" : "" }, headline: { html: rec ? esc(Lang.plain(line)) : raHtml(line, { hide }), rec }, items: [] }, { big: true }));
    UI.closeHelp();
    const token = Cook.run;
    const prevExpect = Cook.expect;
    Cook.expect = { kind: "click", selector: RQ_CARD, intro: true };
    const read = () => (!UI.naniMuted() && Lang.hasVoice(line) ? Promise.all([Lang.speak(line), Cook.wait(LINE_MIN_MS)]) : Cook.wait(Cook.readMs(Lang.plain(line))));
    // R4 (DAAR-25, T12 "one Nani card"): her own card is already in the sidebar (the chop card, made before the chop again):
    // the pop-up is that card shown big, so it leaves the sidebar while the pop-up is up and the pop-up folds back into it
    const mine = [...document.querySelectorAll("#mission .oc-card")].find((x) => x.dataset.who === who) || null;
    if (mine) mine.style.visibility = "hidden";
    // CK-40 (R4, contract-20: one face per person): while her card is up in the pop-up, her box keeps only its tools (no
    // second Nani face beside it, as while her chop card is in the sidebar); her face comes back as the pop-up folds
    const own = who === "nani" && !!UI.guideStrip;
    if (own) UI.guideStrip(true);
    try {
      await request({ reason: "cook:station-order", target: () => (mine && mine.isConnected ? mine : $("#guide") || $("#mission")), lead: 0, hold: 900, wait: (ms) => Cook.wait(ms), onStop: () => UI.hush(), read }, draw);
    } finally {
      if (own) UI.guideStrip(!!mine && mine.isConnected);
      if (mine) mine.style.visibility = "";
      stopReading();
      if (Cook.expect && Cook.expect.intro) Cook.expect = prevExpect && !prevExpect.intro ? prevExpect : null;
    }
    Cook.checkRun(token);
    return { asked: true };
  };
  M.introOpen = introOpen;
  M.peopleSaid = () => !!(mission && mission.peopleSaid);

  /* ================= Wave 6: cards, read-along, the light bulb ================= */
  /*
   * docs/design-language/ux-principles.md 1, 3 and 4. The order card and the request card
   * (the intro) are drawn from the same blocks:
   *  - plain rows: a dot and the words, nothing else (no speaker, 👁 or
   *    translate on a row any more);
   *  - one card per thing being made, with a fixed shape: a person's cup
   *    (their face, "{person} lai", then the same slots every time: milk,
   *    sugar, which chai), one card per skewer (always four dots; a mixed
   *    one names its pieces on its dots, in order), one card per maani.
   * Every card has one speaker in its top-right corner: it reads the card
   * in order and each part lights up as it's said (read-along, by recorded
   * chunk: each spoken line has its own voice file). Hearing it again once
   * its words are dots is help (a hint), as before.
   * The light bulb at the top of the sidebar flips the words to English for
   * a few seconds (data.calm.bulbMs by level: 8 s at every level, SH-41 / D11,
   * Zafar 1 Oct "give it like eight seconds"; the older 5, 3, 2, 1 s is gone); for rows still
   * to do that's the answer, so it costs the accuracy badge, like A/En did.
   */
  const sideEls = new Map(); // row -> [elements] on the sidebar card
  const introEls = new Map(); // row -> [elements] on the request card
  const addEl = (map, r, el) => r && map.set(r, (map.get(r) || []).concat(el));
  function orderLevel() {
    const ctx = Cook.ctx;
    if (!ctx) return 1;
    const ds = (ctx.order && ctx.order.dishes) || [];
    const lv = ds.map((d) => d.level || 1);
    return Math.max(ctx.level || 1, ...(lv.length ? lv : [1]));
  }
  // (the level the sidebar's cards are drawn at: a station's own card follows it, so one order never has two ladders, contract-35)
  UI.orderLevel = orderLevel;
  /** Spoken parts ([{line, els}]) of a joined line whose parts know their rows (Cook.Order.speech). */
  function partsOf(line, map) {
    const parts = line && line.parts ? line.parts : line ? [line] : [];
    return parts.map((l) => ({ line: l, els: elsOf(l, map) }));
  }
  /** The elements a spoken part lights: its row's, and every row it says (a headline that names a row, X1). */
  function elsOf(l, map) {
    const rows = [].concat(l.rows || [], l.row || []).filter((r, i, a) => a.indexOf(r) === i);
    return [].concat(...rows.map((r) => map.get(r) || []));
  }
  let readToken = 0;
  /*
   * contract-8 (SH-53, SH-79, decision 95; s08 w3B): one thing lit while a card is read. The rows' "next" marks are held
   * (taken off and kept here) from the first part read until the reading ends or is stopped, then given back; a card drawn
   * again meanwhile has its new marks held too (renderOrder6). Was: each part gave its marks back in its own finally, so a
   * read stopped by a new one (a replay over the order, the hint over a replay) put "next" back while the new one was lit.
   */
  const heldNext = new Set();
  let readActive = false;
  const holdNext = (keep = []) =>
    document.querySelectorAll(".oc-row.next, .oc-item.next").forEach((e) => {
      if (keep.includes(e)) return;
      e.classList.remove("next");
      heldNext.add(e);
    });
  const giveNext = () => {
    heldNext.forEach((e) => e.isConnected && e.classList.add("next"));
    heldNext.clear();
  };
  const stopReading = () => {
    readToken++;
    readActive = false;
    document.querySelectorAll(".reading").forEach((e) => e.classList.remove("reading"));
    giveNext();
  };
  /** A part that names several rows (one word in two skewers' boxes, a headline naming rows) lights one: the first on the card. */
  const oneLit = (els) => (els.length > 1 ? [els.slice().sort((a, b) => (a.compareDocumentPosition(b) & 4 ? -1 : 1))[0]] : els);
  /**
   * S03-A, the voice stop (SH-64, CLN-109): Cook's voice really stops: the read-along's chain (readToken), the core's
   * channels (their lines already chained stay quiet) and the clip playing now (Cook.stopVoice). A tap through the
   * request pop-up runs it (every stop of the shared lifecycle's voice layer runs it too: Lifecycle.voice.onStop).
   */
  UI.hush = function () {
    stopReading();
    const V = Cook.core && Cook.core.voice;
    if (V && V.stop) ["cook", "main", "word"].forEach((ch) => {
      try {
        V.stop(ch);
      } catch (e) {
        /* no channel */
      }
    });
    if (Cook.stopVoice) Cook.stopVoice();
  };
  if (global.Lifecycle && !UI.hushHooked) UI.hushHooked = global.Lifecycle.voice.onStop(() => UI.hush());
  /**
   * Read parts in turn, lighting each one's elements while it's said (the
   * voice file of that chunk, or a reading pause if it has none). A new
   * read stops the last one.
   */
  // (Sprint 11: when each part's words were last read out, so a station can leave out a line said a moment ago)
  const readAt = new Map();
  const readKey = (line) => Lang.plain(line).toLowerCase().replace(/[^a-z\s-]/g, "").trim();
  UI.readLately = (line, ms = 10000) => {
    const t = readAt.get(readKey(line));
    return !!t && Date.now() - t < ms;
  };
  async function readAlong(parts, { min = 0 } = {}) {
    stopReading();
    const token = ++readToken;
    const t0 = Date.now();
    for (const p of parts) {
      if (token !== readToken) return;
      readAt.set(readKey(p.line), Date.now());
      const lit = oneLit(p.els);
      // SH-79 (decision 95, contract-8): one lit thing on the card: while a row is read out, the next row's mark waits
      readActive = true;
      holdNext(lit);
      lit.forEach((e) => e.classList.add("reading"));
      try {
        // SH-17 (S05-G): a part stays lit while it is said and at least ~220 ms a word (up to 0.9 s): a part whose clip is
        // short ('elchi' in 'Muke elchi waari chai khape.') lit for under 150 ms, too fast to follow at a child's pace
        if (Lang.hasVoice(p.line)) await Promise.all([Lang.speak(p.line), Cook.wait(Math.max(260, Math.min(900, 220 * Lang.plain(p.line).split(/\s+/).length)))]);
        else await Cook.wait(Math.max(700, Cook.readMs(Lang.plain(p.line)) * 0.55));
      } finally {
        lit.forEach((e) => e.classList.remove("reading"));
      }
      if (token === readToken) await Cook.wait(120);
    }
    // the reading is over (and was not stopped by another): the next marks come back
    if (token === readToken) {
      readActive = false;
      giveNext();
    }
    const left = min / Cook.speed - (Date.now() - t0);
    if (left > 0 && token === readToken) await Cook.wait(left * Cook.speed);
  }
  UI.readAlong = readAlong;
  /** The words of a line as the card shows them: Kutchi (dots when known), or English while the bulb is on. */
  const text6 = (line, hide) => (mission && mission.english && line.en ? `<span class="en6">${esc(line.en)}</span>` : Lang.html(line, { hide }));
  /*
   * Design system 12 (Zafar, 28 Sept, late): the order model, drawn by the shared order card
   * (js/shared/order-card.js, css/shared/order-card.css) in the sidebar and the request pop-up alike:
   * person → items → parts, no pictures, no pips, no digits. Here a ladder becomes the card's data,
   * {person, headline, items: [{label, count, parts, ordered}]}:
   *  - a person's own section (the Chai tray's cups): their own card; their rows are the parts, straight
   *    under the headline, in the card's slot order (milk, sugar, which chai);
   *  - a kind made several times (a tally row with `cards`: skewers, maani): an item row with its Kutchi
   *    number ("ba lakri gos", "hakri maani"); a mixed skewer's pieces (its `cardOf` list) are its parts,
   *    in order. The same mix several times is one row ("ba lakri mixed"), its pieces once; two
   *    different mixes (two lists) are two rows ("hakri lakri mixed"), each with its own pieces;
   *  - every other row (the pantry's list, the chop and the tadka, the chaat's layers, the samosa's
   *    fillings): the dish's own parts, straight under the headline, a list in order with the sequence line.
   * Rows tick when their step closes (UX 11; nothing goes red until the review); a finished item row
   * folds to one gold line, a finished person to face + headline + check (in the sidebar only).
   */
  const OCard = () => global.OrderCard;
  /** A row's words on the card: no full stop at the end (the headline is the sentence; rows are lower case, see the card's CSS). */
  const rowText = (html) => String(html).replace(/\.((?:<\/[a-z0-9]+>)*)\s*$/i, "$1");
  // decision 57 (SH-52): the bulb's English is the full order, numbers too ("two chapati"), whatever the card drops
  const fullLine = (r) => (mission && mission.english && r.phrase && !r.no ? r.phrase : r.line);
  // DAAR-19 (S06 r2): a step row with its own tool (r.pic, the recipe's say entry: the daar stir row's ladle) shows it
  // before its words, so the laps ("ba") read as the stir's, not as a stray plain row; never a word's picture (that would
  // give the word away), only the tool of a step whose verb the card doesn't write
  // The picture is the station's own (already loaded for the station), drawn on the card at a line's height: a small copy
  // made once from it (64 px, the load check's rule: never a 360 px picture drawn at 24 px), the card redrawn when it's ready
  const THUMBS = new Map();
  const thumbOf = (src, N = 64) => {
    const key = N === 64 ? src : `${src}@${N}`;
    if (THUMBS.has(key)) return THUMBS.get(key);
    THUMBS.set(key, null);
    const im = new Image();
    im.onload = () => {
      try {
        const k = N / Math.max(im.naturalWidth, im.naturalHeight);
        const c = document.createElement("canvas");
        c.width = Math.max(1, Math.round(im.naturalWidth * k));
        c.height = Math.max(1, Math.round(im.naturalHeight * k));
        c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        THUMBS.set(key, c.toDataURL("image/png"));
        if (mission) renderOrder();
      } catch (e) {
        /* no picture: the row keeps its words */
      }
    };
    im.src = src;
    return null;
  };
  const rowPic = (r) => {
    const t = r && r.pic ? thumbOf(r.pic) : null;
    return t ? `<img class="ck-step-pic" src="${t}" alt="" aria-hidden="true">` : "";
  };
  // SH-110: a dotted row's speaker says the row (Lang.speak, the card's one voice path: free, never a hint, never a mark on a word)
  const sayRow = (r) => () => Lang.speak(r.line);
  const partNode = (r, gi) => ({ label: rowPic(r) + rowText(text6(fullLine(r), rowHide(r))), done: !!r.done, no: !!r.no, wrong: !!r.wrong, key: r, gi, next: false, say: sayRow(r) });
  /*
   * Sprint 11 (B-cook, task 2): a people order's row is the shared word card's row (js/shared/word-card.js through
   * OrderCard's rowEl): the item's picture (its own shelf art, drawn small: a copy at the row's size, as rowPic's), its
   * Kutchi (the card's own words, dotted where the level dots them), its English and the speaker, faded by the word's
   * stage (English blank at 3, the picture at 4). A row whose words are dotted shows no picture and no English either (they
   * would be the answer the child is to hear). The eye's reveal is a hint (as the old eye was) and never advances the word.
   */
  const WC_PIC = { "veg-14": "assets/cook/items/shelf-veg-14-jar-f.webp", "veg-13": "assets/cook/items/shelf-veg-13-jar-f.webp", "ph-half": "assets/cook/items-s14/glass/glass-fill-milky-3-s14.webp", "ph-full": "assets/cook/items-s14/glass/glass-fill-milky-6-s14.webp" }; // (half and full: the s14 glass half and full, the judge 29 Oct: "aakho" had no picture)
  const WC_ID = /^(cook-(paani|dudh|chai|khun)|spi-[0-9]+|veg-[0-9]+)$/;
  const wcPicSrc = (id) => WC_PIC[id] || (WC_ID.test(id) ? `assets/cook/items/shelf-${id}-bare-f.webp` : null);
  const wcWordId = (r) => [...(r.ids || [])].reverse().find((id) => wcPicSrc(id)) || (r.ids || []).slice(-1)[0];
  const wcStage = (id) => {
    try {
      const P = Cook.core && Cook.core.progress;
      return P && P.stage ? P.stage(id) || 1 : 1;
    } catch (e) {
      return 1;
    }
  };
  UI.wordOf = function (r, { size = 96, written = false, head = false } = {}) {
    const W = global.WordCard;
    if (!W || !r || (r.head && !head)) return null;
    // (a sidebar too short for every card, G1's second step and on: the rows go back to the plain one-line rows, so the
    // order still fits whole without scrolling; non-negotiable 9. The pop-up's card (writtenCard) is never squeezed: one
    // pop-up look at every size, round 3)
    if (mission && !writtenCard && (mission.compact || 0) >= 2 && size < 200) return null;
    const id = wcWordId(r);
    const src = wcPicSrc(id);
    // (a kind's row, samosa's "ba samosa", is a word row only when its thing has a picture)
    if (head && !src) return null;
    // Zafar, 29 Oct (chai level rules 7): on the s14 look (chai) the card by chai's own row: its Kutchi always written, its English
    // shown at L1 and dotted from L2, its picture blurred from L3 (SH-155: the central rules, data/rules.json levels cardEnglish,
    // cardPicture, through js/shared/rules.js)
    if (UI.s14()) {
      const RL = global.Rules ? global.Rules.level(mission.level || 1) : { cardEnglish: false, cardPicture: true };
      const at = (k) => (k === "pic" ? RL.cardPicture : RL.cardEnglish);
      const srcB = wcPicSrc(wcWordId(r));
      const picB = srcB ? thumbOf(Cook.v(srcB), size) : null;
      return {
        word: {
          id: wcWordId(r),
          kutchi: { html: `<span class="wc-kt">${rowText(text6(fullLine(r), () => false))}</span>` },
          english: r.line.en || "",
          rec: !!r.rec,
          // (the big card: the picture itself, already loaded by the shelf; a thumbnail not yet made left "hakro khun" blank: the judge, 29 Oct)
          picture: srcB && size >= 200 ? { src: Cook.v(srcB), fit: "contain" } : picB ? { src: picB, fit: "contain" } : srcB ? { src: Cook.v(srcB), fit: "contain" } : null,
          say: () => Lang.speak(r.line),
        },
        wordOpts: {
          slots: { picture: at("pic") !== false && !!srcB, english: at("en") === true, kutchiText: RL.cardKutchi !== false },
          enShown: at("en") === true,
          progress: Cook.core && Cook.core.progress,
          onReveal: () => Cook.onHelp && Cook.onHelp("reveal", { ids: r.ids }),
        },
      };
    }
    // (written: the word said now, big, as the order first comes: always written in Kutchi, SH-110)
    const hidden = !written && rowHidden(r) && dotsOk();
    const base = W.slots(wcStage(id), { placeholder: !!r.rec });
    const pic = src ? thumbOf(Cook.v(src), size) : null;
    return {
      word: {
        id,
        // (one span: the slot lays its children out as flex items, which would drop the spaces between the words)
        kutchi: { html: `<span class="wc-kt">${rowText(text6(fullLine(r), written ? () => false : rowHide(r)))}</span>` },
        english: r.line.en || "",
        rec: !!r.rec,
        // (the big card said now: its own picture while the small copy is still being made)
        picture: pic ? { src: pic, fit: "contain" } : src && size >= 200 ? { src: Cook.v(src), fit: "contain" } : null,
        say: () => Lang.speak(r.line),
      },
      wordOpts: {
        slots: { picture: base.picture && !hidden && !!src, english: base.english && !hidden, kutchiText: true },
        progress: Cook.core && Cook.core.progress,
        onReveal: () => Cook.onHelp && Cook.onHelp("reveal", { ids: r.ids }),
      },
    };
  };
  /** A count row said for one of several ("ba lakri mixed" -> "hakri lakri mixed"): the same words, the number one. */
  const oneOf = (r) => Lang.phrase((r.parts || r.ids).map((p) => (typeof p === "number" ? 1 : p)));
  /** An ordered list's next step (its group), `at` steps on (a station that ticks later moves it: M.advance). */
  function nextGroup(rows, at = 0) {
    const steps = [];
    rows.filter((x) => !x.r.no).forEach((x) => steps.push(...Array(Math.max(1, x.r.need || 1)).fill(x)));
    const open = steps.slice(at).find((x) => !x.r.done);
    return open ? open.gi : null;
  }
  /** The headline as the card shows it; a line still to record is flagged. */
  function headNode(r) {
    if (!r) return { html: esc(mission.name) };
    if (r.rec) return { html: esc(r.line.en || Lang.plain(r.line)), rec: true, key: r };
    // the headline is what the person says, always shown (design system 12): its words never fade to
    // dots ("Muke ••• khape." at the grill); the rows below carry the listening
    // SAM-23 (Zafar, 18 Oct: "keep the title ... I want samosa, and even in English"): a dish whose count heads each block has no number in
    // its title in either language (r.uncountedTitle); the bulb's English of every other headline is the whole line
    return { html: text6(mission && mission.english && !r.uncountedTitle ? r.line : r.cardLine || r.line, () => false), key: r };
  }
  /** Every card of the order: [{data, key, who, rows}] (rows: the ladder rows it shows, for read-along). */
  function orderCards() {
    const cards = [];
    shape().forEach(({ L, sections }) => {
      const headline = headNode(L.head || null);
      const person = (who) => ({ id: who, face: faceUrl(who), name: who === mission.who ? mission.name : who });
      const people = sections.filter((x) => x.s.for);
      if (people.length) {
        people.forEach(({ s, rows }) => {
          peekCard = peeksFor(s.for);
          const placed = rows.slice().sort((a, b) => Order().slotOf(L, a.r) - Order().slotOf(L, b.r));
          // decision 97 (3), SH-78: a person's card stays open from their dish's first step to its last: every row ticked
          // is not finished while their dish is still being made (chai: their pour); the station closes them ({all, for})
          const parts = placed.map((x) => Object.assign(partNode(x.r, x.gi), mission.wordRows ? UI.wordOf(x.r) : null));
          const rowsDone = parts.length > 0 && parts.every((p) => p.done || p.no);
          const dishDone = !!(L.closedAll || (L.closedFor && L.closedFor[s.for]));
          cards.push({ key: `${L.dish || 0}:${s.for}`, who: s.for, L, rows: placed.map((x) => x.r), data: { person: person(s.for), headline: s.head ? headNode(s.head) : headline, items: [{ label: null, parts }], done: rowsDone && dishDone } });
        });
        return;
      }
      const items = [];
      const rowsShown = [];
      peekCard = peeksFor(mission.who);
      sections.forEach(({ s, rows, seq }) => {
        if (s.cardOf) return; // drawn under its item
        const flat = rows.filter((x) => !x.r.cards);
        if (s.block && s.head) {
          // 30 Sept: a second block of the dish (samosa's second kind): its own row ("trae samosa"), its parts under it
          const parts = flat.map((x) => partNode(x.r, x.gi));
          // SAM-11 (T16): a block's head is always its own row ("ba samosa", its fillings under it), even when it's the
          // only block (count 2: never the shared card's "direct" shape, which drops the head)
          const n = s.head.qty || 1;
          if (n > 1 && s.head.made != null) {
            // SH-53 (Zafar, 21 Oct: yes): the kind's row ("trae samosa") over one box per samosa, its fillings in it; a box's
            // pieces tick as that samosa is made (filled and left for the next strip: progress, never which spoonful was
            // right, so the counting rule holds); the kind's row ticks only when all of them are made (SAM-24: closeItem)
            items.push({ label: rowText(text6(s.head.cardLine || s.head.line, rowHide(s.head))), count: 1, parts: [], ordered: false, done: !!s.head.done, key: s.head, src: [], say: sayRow(s.head) });
            for (let u = 0; u < n; u++) {
              const made = !!s.head.done || u < s.head.made;
              items.push({ label: null, count: 1, parts: parts.map((p) => Object.assign({}, p, { done: made || p.done, next: false })), ordered: false, group: true, done: made, src: [] });
            }
            rowsShown.push(s.head, ...flat.map((x) => x.r));
            return;
          }
          // S13-B1 (the judge on SH-110: "a box nested inside a 'samosa' box, unlike the flat rows above it"; round 3: "one flat
          // look at every level", and the pop-up's "nested indented second row"): the kind's row over its fillings as the card's
          // plain rows, one a line (was the kind's own box round its row and its fillings' chips), each a word row (picture,
          // speaker, Kutchi) where the thing has a picture
          // (several of a kind: its rows tick together when all its samosas are made, SAM-24's one tick; one: with its fillings)
          const all = !!s.head.done || (n <= 1 && parts.length > 0 && parts.every((p) => p.done || p.no));
          // (the kind's row ticks with its fillings, as the box's row did: SAM-24's one tick, contract-50)
          items.push(Object.assign({ label: rowText(text6(s.head.cardLine || s.head.line, rowHide(s.head))), count: 1, parts: [], ordered: false, done: all, key: s.head, src: [], say: sayRow(s.head) }, UI.wordOf(s.head, { head: true })));
          const pics = flat.every((x) => !x.r.no && wcPicSrc(wcWordId(x.r)));
          items.push({ label: null, count: 1, parts: parts.map((p, i) => Object.assign({}, p, { done: all || (n <= 1 && p.done), next: false }, pics ? UI.wordOf(flat[i].r) : null)), ordered: false, done: all, src: [] });
          rowsShown.push(s.head, ...flat.map((x) => x.r));
          return;
        }
        if (flat.length) {
          // S13-B1 (the judge: one card anatomy): a list whose every row is a thing with its own picture (the pantry's list, the
          // daar's vegetables) is drawn in word-card rows, as a people order is (picture, speaker, Kutchi, English by the word's
          // stage); an ordered list (a skewer, chaat's layers) keeps its little skewer of pills
          const pics = !seq && flat.every((x) => !x.r.no && !x.r.head && wcPicSrc(wcWordId(x.r)));
          const parts = flat.map((x) => Object.assign(partNode(x.r, x.gi), pics ? UI.wordOf(x.r) : null));
          // DAAR-26 (s08 w6M; the judge, 20 Oct: "the L4 card at the stir shows only 'Muke daar khape.' with no stir row"): on a
          // card closed for its level the stir row stays written once it has come (she says the laps and the speed: SH-99)
          const keep = s.when === "stir" && !!s.shown && !!(mission.levelClosed || (mission.closed && mission.closed.peek));
          items.push({ label: null, parts, ordered: seq, at: s.at || 0, src: flat, keep });
          rowsShown.push(...flat.map((x) => x.r));
        }
        rows
          .filter((x) => x.r.cards)
          .forEach(({ r }) => {
            const mixes = L.sections.filter((y) => y.cardOf && y.cardOf === r.ids[r.ids.length - 1] && (!y.when || y.shown));
            const src = (ps) => [].concat(...ps.groups.map((g, gi) => g.filter((p) => !p.no).map((p) => ({ r: p, gi }))));
            const item = (label, ps) => ({ label, count: ps ? 1 : r.qty || 1, parts: ps ? src(ps).map((x) => partNode(x.r, x.gi)) : [], ordered: !!ps, done: !!r.done, wrong: !!r.wrong, key: r, src: ps ? src(ps) : [], say: sayRow(r) });
            rowsShown.push(r);
            // SEK-03 (S05-C, the shared group box): several different skewers, one plain box each (no label row; the
            // headline gives the summary), alternate boxes tinted, each drawn as a little skewer
            if (mixes.length > 1 && (r.qty || 1) === mixes.length) mixes.forEach((ps) => items.push(Object.assign(item(rowText(text6(oneOf(r), rowHide(r))), ps), { group: true })));
            // SEK-03 (S05-C2): several skewers of one mix ("ba lakri mix") are a box each too, the same little skewer
            // twice, not one label row over a list of its pieces (a skewer's mix is a sequence; maani's fillings are not)
            // The pieces tick along the one mix for the first skewer; a later box is done when its skewer is (M.tickCard)
            else if (mixes.length === 1 && mixes[0].seq) {
              // contract-30 (SH-99; s08 w3B): the same mix several times is said with its number ("ba lakri mixed"), so the
              // number is written too: the kind's own row over its boxes (one is the bare item: Zafar, 19 Oct, no row for one)
              if ((r.qty || 1) > 1) items.push({ label: rowText(text6(fullLine(r), rowHide(r))), count: 1, parts: [], ordered: false, done: !!r.done, wrong: !!r.wrong, key: r, src: [], say: sayRow(r) });
              for (let u = 0; u < (r.qty || 1); u++) {
                const it = Object.assign(item(rowText(text6(oneOf(r), rowHide(r))), mixes[0]), { group: true });
                const unit = !!(r.units && r.units[u]) || !!r.done;
                // SEK-13 (S06): a later skewer of the same mix ticks its own pieces as they go on (M.tickPiece), never
                // all at once when it is finished
                const got = (r.unitGot && r.unitGot[u]) || 0;
                if (u > 0 || unit) {
                  it.parts = it.parts.map((p, pi) => Object.assign({}, p, { done: unit || pi < got, next: false }));
                  it.done = unit;
                }
                items.push(it);
              }
            } else {
              const it = item(rowText(text6(fullLine(r), rowHide(r))), mixes[0] || null);
              it.count = r.qty || 1;
              items.push(it);
            }
            mixes.forEach((ps) => rowsShown.push(...[].concat(...ps.groups)));
          });
      });
      // the card is finished only with its dish (queue item 8): every row closed AND the head, when the head
      // is a thing still being made (samosa's "trae samosa" while folding and frying, Nana's daar while
      // the stir runs); a head to record (the pantry's "bring me these") or with no word waits for nothing
      const H = L.head;
      const rowsDone = !!OCard() && items.length > 0 && OCard().shape({ items }).items.every((it) => it.done);
      const done = rowsDone && (!H || !!H.rec || !(H.ids || []).length || !!H.done);
      cards.push({ key: `${L.dish || 0}:${mission.who}`, who: mission.who, L, rows: rowsShown, own: true, data: { person: person(mission.who), headline, items, done, strip: mission.stripMode && L === mission.ladders[0] ? mission.strip : null } });
    });
    peekCard = false;
    // the next step of an ordered job (a light grey band): only in the first ordered list still open
    let marked = false;
    cards.forEach((c) =>
      c.data.items.forEach((it) => {
        if (marked || !it.ordered || it.done || !it.src) return;
        const g = nextGroup(it.src, it.at || 0);
        if (g == null) return;
        it.parts.forEach((p) => (p.next = p.gi === g && !p.no && !p.done));
        marked = it.parts.some((p) => p.next);
      })
    );
    return cards;
  }
  /** The order's cards into box (the sidebar's, or the pop-up's at full size); map: row -> its elements (read-along). */
  function drawCards(box, map, { big = false } = {}) {
    map.clear();
    const OC = OCard();
    // S13-B1 (the recipe ladder through the kit): each card is drawn again by OrderCard.update from the one drawn before it (its
    // key, data-ck), which keeps its decoded face (DAAR-04, DAAR-18, CHT-06: a fresh face was a blank circle for a few frames)
    const before = new Map([...box.querySelectorAll(".oc-card[data-ck]")].map((c) => [c.dataset.ck, c]));
    // S14 (chai, the kit's s14 option): each card's sideways row as it stood, so the redraw moves nothing until a tick (OC.settle14)
    const s14 = !big && UI.s14();
    const snap14 = s14 && OC && OC.snap14 ? OC.snap14(box) : null;
    const keepFaces = (out) => {
      if (snap14) out.forEach((e) => e && e.dataset && e.dataset.ck && OC.settle14(e, snap14.get(e.dataset.ck), (mission.folds || {})[e.dataset.ck]));
      return out;
    };
    box.innerHTML = "";
    if (!OC) return [];
    const folds = (mission.folds = mission.folds || {});
    // a station's own person cards (Nani's chop card, design system 13), above the order's, sidebar only
    const extra = big ? [] : (mission.extra || []).map((x) => {
      const st = folds[`x:${x.key}`] || (folds[`x:${x.key}`] = {});
      // C3 (E12): a station's own card (daar's chop card) replays its line from its face, like every card
      const onFace = x.say
        ? (ev, cardEl) => {
            ev.stopPropagation();
            Cook.unlockAudio();
            const face = cardEl && cardEl.querySelector(".oc-face");
            if (face) face.classList.add("on");
            Promise.resolve(x.say())
              .catch(() => {})
              .then(() => face && face.classList.remove("on"));
          }
        : null;
      const e = OC.update(before.get(`x:${x.key}`) || null, x.data, { fold: st, closed: !!x.closed, stamped: !!mission.stamped, foldAfter: 700 / (Cook.speed || 1), onEl: (key, el) => addEl(map, key, el), onFace });
      e.dataset.extra = x.key;
      e.dataset.ck = `x:${x.key}`;
      if ((mission.compact || 0) >= 3) e.classList.add(e.querySelector(".oc-said") ? "oc-tight" : "oc-pills");
      if ((mission.compact || 0) >= 4) e.classList.add("oc-two");
      if ((mission.compact || 0) >= 5) e.classList.add("oc-three");
      box.appendChild(e);
      return e;
    });
    const closed = mission.closed || null;
    writtenCard = big; // SH-110: the pop-up writes the order (the sidebar's card may dot it)
    let cards;
    try {
      cards = orderCards();
    } finally {
      writtenCard = false;
    }
    const idle = big ? new Set() : idlePeople(cards);
    const minis = big ? new Set() : miniPeople(cards);
    // CK-40 (R4, contract-20: one card and one face per person): a person who orders two dishes (day 6: the cousin's
    // mishkaki and chaat) gets ONE card: the first dish's card wears their face, each later dish is a continuation of it
    // (its headline and rows, no second face), joined to it in one .oc-person outline
    const firstOf = new Map();
    return keepFaces(extra.concat(cards.map((c) => {
      const lead = c.who ? firstOf.get(c.who) : null;
      if (c.who && !lead) firstOf.set(c.who, c);
      // the pop-up never shows more than the sidebar card it folds into: a start-folded card (§14a, M.closeCards with
      // peek: the order is to be remembered) is the shared closed big card there (js/shared/order-card.js big + closed:
      // face, headline, one row of dots; the order is heard in full, never written; non-negotiable 6, as the clinic).
      // A phase fold (a card you can't act on now) is still drawn open in the pop-up
      // SH-110: a card closed for memory (closed.peek) is drawn open, dotted, each dotted row with its speaker; the pop-up never closed
      const phase = !!closed && !big && !memoryClosed(closed) && (!closed.who || closed.who === c.who);
      const el = OC.update(before.get(c.key) || null, lead ? Object.assign({}, c.data, { person: null }) : c.data, {
        big,
        s14, // (Sprint 14: the new order row of item cards, chai only)
        stamped: !big && !!mission.stamped,
        mini: minis.has(c.key), // (G1's face alone: OrderCard draws its left speaker, SH-110)
        fold: big ? null : folds[c.key] || (folds[c.key] = {}),
        // the phase fold / a start-folded card (M.closeCards): face + headline; a peek may cost a hint
        // G1 (F8, only the current need): on a sidebar too short for every person, the people not in progress
        // fold to face + headline too (a tap opens one; the face is still the replay)
        closed: phase || idle.has(c.key),
        // D11 (as the clinic): Nani's English bulb opens a closed card for its time, so the English shows each kind and its parts (SAM-23:
        // "three samosas" and its fillings under it); the small bulb's peek is the Kutchi (SH-98)
        open: !!mission.english,
        onPeek: !big && phase && closed.peek ? () => Cook.onHelp && Cook.onHelp("hint", { ids: [] }) : null,
        peekMs: peekMsOf(),
        foldAfter: 700 / (Cook.speed || 1),
        onEl: (key, e) => addEl(map, key, e),
        decorate: (e, node) => node.key && typeof node.key.decorate === "function" && node.key.decorate(e),
        onFace: big ? null : (ev) => {
          ev.stopPropagation();
          Cook.unlockAudio();
          if (c.own && mission.ladders.length === 1) return M.sayCard();
          sayCardEl(el, null);
        },
      });
      // what this card says, in order (the headline, then its rows): a person says their line from here
      // 29 Sept (X1): the card's own sentence, in card order (one per person); each part lights the rows it says
      el._parts = (left = false) => {
        const head = c.data.headline && c.data.headline.key;
        // SH-102, SH-114: left: a replay reads the steps not yet done only, once any is (never the headline then); all of it otherwise
        const body = c.rows.filter((r) => !r.head);
        const part = left && body.some((r) => r.done) && body.some((r) => !r.done);
        const rowsIn = part ? c.rows.filter((r) => !r.head && !r.done) : c.rows;
        // CHAI-39, SH-152 (Zafar, 29 Oct, round 4; the central rules' order.noLast): on the s14 look a person's "no" items are said
        // after everything they asked for, as their cards sit at the row's end, so the row only moves forward while the order
        // is given; the engine builds the sentence from the rows in that order (Order.sentence), never a hand-written line
        const noLast = s14 && global.Rules && global.Rules.noLast && global.Rules.noLast();
        const rowsSaid = noLast ? rowsIn.filter((r) => r.head || !r.no).concat(rowsIn.filter((r) => !r.head && r.no)) : rowsIn;
        const headSaid = part ? null : head;
        const line = c.who && c.L && c.L.sections.some((s) => s.for === c.who)
          ? Order().sentence(headSaid, rowsSaid, { join: Order().joinOf(c.L) })
          : Order().speech([Object.assign({}, c.L, { head: headSaid || null, sections: c.L.sections.filter((s) => !s.when || s.shown).map((s) => Object.assign({}, s, { when: null, groups: part ? s.groups.map((g) => g.filter((r) => !r.done)).filter((g) => g.length) : s.groups })).filter((s) => s.groups.length) })]);
        return line.parts.map((l) => ({ row: l.row, line: l, els: elsOf(l, map).filter((e) => el.contains(e)) }));
      };
      el._rows = c.rows;
      el.dataset.ck = c.key; // (the next redraw finds it: OrderCard.update)
      // G1, the third step: every open card's rows flow as pills, two to a line (decision 25's layout)
      // (SH-110, the judge: a card with blanked rows keeps one row a line, each with its speaker at its left, never pills)
      if (!big && (mission.compact || 0) >= 3 && !minis.has(c.key)) el.classList.add(el.querySelector(".oc-said") ? "oc-tight" : "oc-pills");
      if (!big && (mission.compact || 0) >= 4 && !minis.has(c.key)) el.classList.add("oc-two");
      if (!big && (mission.compact || 0) >= 5 && !minis.has(c.key)) el.classList.add("oc-three");
      if (minis.has(c.key)) {
        // G1, the second step on a sidebar still too short: the people not in progress are their faces in one row
        // (each face still the replay; a tap beside it brings that person forward)
        el.classList.add("oc-mini");
        el.addEventListener("click", (ev) => !ev.target.closest(".oc-face") && M.focus(c.who));
        let row = box.querySelector(":scope > .oc-minis");
        if (!row) row = box.appendChild(Object.assign(document.createElement("div"), { className: "oc-minis" }));
        // a continuation of someone who is just their face shows nothing more (CK-40)
        if (!lead) row.appendChild(el);
      } else if (lead && lead.el && lead.el.parentNode) {
        // CK-40: under its person's first card, in one outline (the pop-up's crowd grid keeps it in that person's column)
        let wrap = lead.el.parentNode.classList && lead.el.parentNode.classList.contains("oc-person") ? lead.el.parentNode : null;
        if (!wrap) {
          wrap = document.createElement("div");
          wrap.className = "oc-person";
          wrap.dataset.person = c.who;
          lead.el.parentNode.insertBefore(wrap, lead.el);
          wrap.appendChild(lead.el);
        }
        el.classList.add("oc-cont");
        wrap.appendChild(el);
      } else box.appendChild(el);
      if (c.who && !lead) c.el = el;
      return el;
    })));
  }
  /**
   * G1 (F8 "only the current need"; R6's phones): a round with several people's cards that doesn't fit the sidebar
   * (still overflowing at the frame's smallest fit, js/shared/frame.js fitSide) folds the people not in progress to
   * face + headline. In progress: the person a station is on (M.focus, e.g. the chai pan in hand), else the first
   * person not yet done. A screen where everything fits keeps every card open (laptops and tablets unchanged).
   */
  function curPerson(cards) {
    const OC = OCard();
    const open = cards.filter((c) => c.who && !OC.shape(c.data).done);
    return { open, cur: open.find((c) => c.who === mission.focusWho) || open[0] || null };
  }
  function idlePeople(cards) {
    const out = new Set();
    if (!mission.compact) return out;
    const { open, cur } = curPerson(cards);
    if (open.length < 2) return out;
    open.forEach((c) => c !== cur && out.add(c.key));
    return out;
  }
  /** The second step (compact 2): everyone but the person in progress, done or not, is just their face. */
  function miniPeople(cards) {
    const out = new Set();
    if ((mission.compact || 0) < 2) return out;
    const people = cards.filter((c) => c.who);
    if (people.length < 2) return out;
    const { cur } = curPerson(cards);
    people.forEach((c) => c !== cur && out.add(c.key));
    return out;
  }
  /** A station names the person it's working on now (their card stays open when the sidebar is too short). */
  M.focus = function (who) {
    if (!mission || mission.focusWho === who) return;
    mission.focusWho = who || null;
    if (mission.compact) renderOrder();
  };
  /** After a redraw (once the frame has fitted the sidebar): still overflowing with several people open? Fold the idle ones. */
  let fitWatched = false;
  function checkFit() {
    const side = $("#side");
    if (!side) return;
    // Nani's box growing (her English line, a flag) can tip the sidebar over too
    if (!fitWatched && global.ResizeObserver && $("#guide")) {
      fitWatched = true;
      const ro = new ResizeObserver(() => checkFit());
      if (Cook.life) Cook.life.onEnd(() => (ro.disconnect(), (fitWatched = false)));
      ro.observe($("#guide"));
      // a peeked card opens without a redraw: the order growing can tip it over too
      if ($("#mission")) ro.observe($("#mission"));
    }
    const raf = (Cook.life && Cook.life.requestAnimationFrame) || global.requestAnimationFrame || ((f) => setTimeout(f, 16));
    raf(() =>
      raf(() => {
        if (mission && side.clientHeight > 0) peekFold(side); // CK-38: a peek on a short sidebar folds her box meanwhile
        if (!mission || (mission.compact || 0) >= 6 || side.clientHeight <= 0 || $("#mission").classList.contains("hidden")) return;
        // (Sprint 14: on the s14 look the orders are one under the other in a list that scrolls, the next one peeking, every card
        // open: nothing folds to fit; lab/cards.html .orders)
        if (UI.s14()) return;
        if (side.scrollHeight <= side.clientHeight + 1) return;
        // one step at a time (the redraw checks again): 1 folds the idle people to their headline, 2 to their face,
        // 3 flows the open card's rows as pills. With fewer than two people steps 1 and 2 fold nothing: one person (and a
        // station's card) go straight to pills. CK-38: that step was never taken (it returned), so one person's order
        // opened by a peek (sekelo L3: both skewers) ran past a 360 px sidebar
        const one = orderCards().filter((c) => c.who).length + (mission.extra || []).length < 2;
        // 4, 5 (S13-A2 fix round: every speaker row is a tap tall, SH-134): the rows two, then three, to a line (the kit's .oc-two, .oc-three);
        // 6: the rail (?, home, the book) steps out of the sidebar to the play area's bottom-left corner (a phone's sekelo L3-L4)
        mission.compact = one && (mission.compact || 0) < 3 ? 3 : (mission.compact || 0) + 1;
        renderOrder();
      })
    );
  }
  /**
   * The phase fold (design system 13) and the start-folded card (14a): the order's cards fold to face +
   * headline (no check) until opened again. opts.peek: a tap opens a card for a moment and counts as a
   * hint (the light-bulb badge); without it a tap opens and closes it freely. opts.who: only that person's card.
   * M.closeCards(false) opens them again.
   */
  M.closeCards = function (on, opts = {}) {
    if (!mission) return;
    // Zafar, 29 Oct (chai level rules 7): on the s14 look the active order card is always open, never folded for its level (L4)
    if (opts.level && on && UI.s14()) return;
    // F9 (S05-C): an order closed for its level (opts.level) stays closed: a station's phase fold opening it again
    // (closeCards(false)) goes back to the level's closed card, never to the written one
    if (opts.level) mission.levelClosed = !!on;
    if (!on && mission.levelClosed) on = true;
    mission.closed = on ? { peek: !!(opts.peek || mission.levelClosed), who: opts.who || null } : null;
    Object.values(mission.folds || {}).forEach((st) => { st.peekUntil = 0; st.opened = false; });
    renderOrder();
  };
  /**
   * A station's own person card in the sidebar, above the order's (Nani's chop card, design system 13):
   * data is the shared order card's ({person, headline, items}); calling it again with the same key
   * redraws it (ticks). opts.closed: folded like M.closeCards. M.removeCard(key) takes it away.
   */
  M.addCard = function (key, data, opts = {}) {
    if (!mission) return;
    const list = (mission.extra = (mission.extra || []).filter((x) => x.key !== key));
    list.push({ key, data, closed: !!opts.closed, say: opts.say || null });
    renderOrder();
  };
  M.removeCard = function (key) {
    if (!mission || !mission.extra) return;
    mission.extra = mission.extra.filter((x) => x.key !== key);
    renderOrder();
  };
  /** One card reads itself (its face lights), counting it as help once its words are dots. rows: only these (a recast). */
  async function sayCardEl(c, rows) {
    const face = c.querySelector(".oc-face");
    // SH-102, SH-114 (Zafar, 18 Oct: "they should just read out starting from the remaining steps"): a replay is free and says only the steps
    // not yet done (all of it while nothing is done, and when everything is); a recast (rows) says those rows
    // s08 w6B (contract-31: a replay said "trae khun.", a step already ticked): once every step is done there is nothing left
    // to say but whose it is, so a replay then says the headline only (never a ticked row again)
    const all = c._parts();
    const body = all.slice(1).filter((p) => p && p.row);
    const allDone = !rows && body.length > 0 && body.every((p) => p.row.done);
    const parts = rows ? all.filter((p, i) => i === 0 || rows.some((r) => p.row === r)) : allDone ? all.slice(0, 1) : c._parts(true);
    c.classList.add("speaking");
    if (face) face.classList.add("on");
    try {
      await readAlong(parts);
    } catch (e) {
      /* a new read stopped it */
    } finally {
      c.classList.remove("speaking");
      if (face) face.classList.remove("on");
    }
  }
  /**
   * A person says their line from their own card in the sidebar (it lights up as it's read, their
   * face's badge glows), never from a second card below it. rows: only these (a recast). Resolves when
   * it's said; false when there's no card for them.
   */
  M.sayPerson = async function (who, rows) {
    // G1: on a short sidebar the person speaking is the one in progress: their card opens to be read along
    const was = mission ? mission.focusWho : null;
    if (mission && mission.compact) M.focus(who);
    try {
      return await sayPersonCard(who, rows);
    } finally {
      // back to the person in progress (unless a station moved on to someone else meanwhile)
      if (mission && mission.focusWho === who && was !== who) M.focus(was);
    }
  };
  async function sayPersonCard(who, rows) {
    const c = [...document.querySelectorAll("#mission .oc-card")].find((x) => x.dataset.who === who);
    if (!c || !c._parts || $("#mission").classList.contains("hidden")) return false;
    if (c.scrollIntoView) c.scrollIntoView({ block: "nearest" });
    await sayCardEl(c, rows || null);
    return true;
  }
  function renderOrder6() {
    const box = $("#mission .m-order");
    drawCards(box, sideEls);
    // Sprint 11: a row not said yet waits off the card (introduceAlong pops it in as it is said)
    if (mission.away && mission.away.size) mission.away.forEach((r) => (sideEls.get(r) || []).forEach((e) => e.classList && e.classList.contains("oc-row") && e.classList.add("oc-away")));
    $("#side").classList.remove("rail-out"); // CK-53 (Zafar, 27 Oct): the rail never leaves the sidebar for the play area
    checkFit();
    // the request card steps back: its cards are the order card component's (the shared head goes)
    $("#mission").classList.add("people");
    $("#side").classList.toggle("english", !!mission.english);
    if (introOpen()) renderIntro6();
    // contract-8: a card drawn again while a card is read keeps its new next marks held until the reading ends
    if (readActive) holdNext([...document.querySelectorAll(".reading")]);
  }
  function renderIntro6() {
    if (!rq || rq.along || !rq.body) return;
    // (S13-B1: the kit's pop-up lays the cards out itself: several people side by side, a long order in two columns,
    // js/shared/request-popup.js layout; decision 53)
    drawCards(rq.body, introEls, { big: true });
    if (readActive) holdNext([...document.querySelectorAll(".reading")]);
  }
  /**
   * SH-102, SH-114: the order as a replay says it: only the rows not yet done once any is done (and not the headline then); the whole
   * order while nothing is done, and when everything is
   */
  function replayLine() {
    const rows = [].concat(...mission.ladders.map((L) => Order().rows(L).filter((r) => !r.head)));
    // (s08 w6B, contract-31: everything done, the headline alone; nothing done, all of it)
    if (rows.length && rows.every((r) => r.done) && mission.ladders.some((L) => L.head)) return Order().speech(mission.ladders.map((L) => Object.assign({}, L, { sections: [] })));
    if (!(rows.some((r) => r.done) && rows.some((r) => !r.done))) return mission.line;
    return Order().speech(mission.ladders.map((L) => Object.assign({}, L, { head: null, sections: L.sections.filter((s) => !s.when || s.shown).map((s) => Object.assign({}, s, { when: null, groups: s.groups.map((g) => g.filter((r) => !r.done)).filter((g) => g.length) })).filter((s) => s.groups.length) })));
  }
  /** The order card's own speaker: the order, read along on the card (the steps left once some are done: replayLine). */
  M.sayCard = function () {
    if (!mission || introOpen()) return;
    const btns = [...document.querySelectorAll("#mission .oc-face")]; // the face is the replay button
    btns.forEach((b) => b.classList.add("on"));
    return readAlong(partsOf(replayLine(), sideEls))
      .catch(() => {})
      .then(() => btns.forEach((b) => b.classList.remove("on")));
  };

  /* ---- the light bulb: the shared one (js/shared/bulb.js; C3, decision 38d: no Cook shim) ---- */
  // the bulb's time by level: the ONE ladder table (data/shared.json, read through js/shared/tokens.js Tokens.ladder; S13-A1, S13-B1):
  // no copy here (the shared bulb, js/shared/bulb.js, reads the same table)
  UI.bulbMs = () => {
    const T = global.Tokens;
    const table = (T && T.ladder && T.ladder.bulbMs) || (global.Bulb && global.Bulb.MS) || [];
    const lv = mission ? mission.level : orderLevel();
    // (a parked page with neither tokens.js nor bulb.js has no table: no bulb time until it loads the kit, S13-A1's shell)
    return table.length ? table[Math.min(table.length, Math.max(1, lv)) - 1] : 0;
  };
  // English while it's on: the sidebar, and the order card's rows still to do
  function bulbOn() {
    Cook.sfx.click();
    $("#side").classList.add("english");
    // SH-57 (decision 57): the bulb flips the guide's line to English too (her box, or her card's strip)
    if (guide && guideLine && guideLine.en && guideLine.ok !== false) {
      guideEnglish = guideLine;
      guide.set(`<span class="en6">${esc(guideLine.en)}</span>`);
    }
    if (mission && !$("#mission").classList.contains("stamped")) {
      mission.english = true;
      // English for rows still to do is the answer: the accuracy badge (Cook.onHelp "translate")
      const open = [].concat(...mission.ladders.map((L) => Order().rows(L).filter((x) => !x.done)));
      if (Cook.onHelp) {
        if (open.length) Cook.onHelp("translate", { ids: [].concat(...open.map((x) => x.ids)) });
        else Cook.onHelp("help");
      }
      renderOrder();
    } else if (Cook.onHelp) Cook.onHelp("help");
  }
  function bulbOffOwn() {
    const side = $("#side");
    if (side) side.classList.remove("english");
    if (guide && guideEnglish) {
      if (guideLine === guideEnglish) guide.set(raHtml(guideLine));
      guideEnglish = null;
    }
    if (mission && mission.english) {
      mission.english = false;
      renderOrder();
    }
  }
  // a parked page that loads Cook's UI without js/shared/bulb.js (Find it, Dress up, Snap) gets the same
  // behaviour from a minimal stand-in with the shared bulb's API (until those modes move onto the core)
  const parkedBulb = (o) => {
    const b = { on: false, timer: null };
    b.use = (btn) => {
      if (b.on) return false;
      b.on = true;
      b.btn = btn;
      const ms = o.ms() / o.speed();
      btn.style.setProperty("--bulb-ms", `${ms}ms`);
      btn.classList.remove("on");
      void btn.offsetWidth;
      btn.classList.add("on");
      o.onOn(ms);
      b.timer = setTimeout(() => b.off(), ms);
      return true;
    };
    b.off = () => {
      clearTimeout(b.timer);
      const was = b.on;
      b.on = false;
      if (b.btn) b.btn.classList.remove("on");
      if (was) o.onOff();
    };
    return b;
  };
  const bulbOpts = { click: false, ms: () => UI.bulbMs(), speed: () => Cook.speed || 1, onOn: bulbOn, onOff: bulbOffOwn };
  const sharedBulb = global.Bulb ? global.Bulb.create(null, bulbOpts) : parkedBulb(bulbOpts);
  UI.bulbOff = function () {
    if (sharedBulb && sharedBulb.on) sharedBulb.off();
    else {
      const b = $("#btn-bulb");
      if (b) b.classList.remove("on", "lit");
      bulbOffOwn();
    }
  };
  /** One use of the bulb (one at a time: a tap while it's on does nothing). */
  UI.bulb = function () {
    const b = $("#btn-bulb");
    if (!b) return false;
    return sharedBulb.use(b);
  };


  const ladderFor = (dish) => (mission ? mission.ladders.find((L) => L.dish === dish) || mission.ladders[0] : null);
  function markDone(r) {
    r.done = true;
    r.wrong = false; // CK-32: a row done again (redone right, or shown) is no longer the wrong one
    // a finished row shows its words again
  }
  /**
   * A "don't" row (dudh na, dungri na) stays neutral while the dish is being made: nothing was added, but
   * nothing is finished either, so it never turns gold mid-dish (queue item 8). It ticks with the rest when
   * the dish is finished (M.finishDish), or when a station closes it itself (closeItem / tickItem {no}).
   * A card's fold doesn't wait for it (the shared card counts an open no-row as done).
   */
  function settle() {}
  /**
   * A count row ("ba dungri", "trae maani"): it ticks when its step closes
   * (the item is put down, finished or served), never the moment the number
   * is reached, so a tick can't give the count away (UX 11, agreed 26 Sept).
   */
  const isCount = (r) => !r.head && !r.no && !r.labelQty && ((r.parts || []).some((p) => typeof p === "number") || (!r.list && (r.need || 1) > 1));
  M.isCount = isCount;
  /**
   * Tick the first open row with this item on it. Returns the row, or null.
   * A count row only counts up here; it ticks when its step closes (M.closeItem),
   * unless opts.close.
   */
  M.tickItem = function (id, dish = 0, opts = {}) {
    const L = ladderFor(dish);
    if (!L) return null;
    const rows = Order()
      .rows(L)
      .filter((r) => !r.done && (opts.no ? r.no : !r.no) && (!opts.for || r.for === opts.for) && (opts.block == null || (r.block || 1) === opts.block));
    // an order row first, the dish's own name last (the pantry fetches the tea for "chai")
    const r = rows.find((x) => !x.head && x.ids.includes(id)) || rows.find((x) => x.ids.includes(id));
    if (!r) return null;
    r.got = (r.got || 0) + 1;
    if (UI.naniMood) UI.naniMood("happy", 1600); // ART-10: something went in: Nani's face smiles a moment (progress, not a verdict)
    if (isCount(r) && !opts.close) return r;
    if (r.got >= (r.need || 1) || isCount(r)) markDone(r);
    settle(L);
    renderOrder();
    return r;
  };
  /** C3 (E14): a thing taken back before Done: the last row it ticked (or counted up) opens again. */
  M.untickItem = function (id, dish = 0) {
    const L = ladderFor(dish);
    if (!L) return null;
    const rows = Order().rows(L).filter((x) => !x.no && (x.got || 0) > 0 && x.ids.includes(id));
    const r = rows.find((x) => !x.head) || rows[0];
    if (!r) return null;
    r.got = Math.max(0, (r.got || 0) - 1);
    r.done = false;
    settle(L);
    renderOrder();
    return r;
  };
  /**
   * A step has closed (the chop ring ran out, the cup is poured, Done): its
   * rows with these items tick, count rows included, right or not (the count
   * is judged in the end review). opts.for: one person's rows only.
   */
  M.closeItem = function (ids, dish = 0, opts = {}) {
    const L = ladderFor(dish);
    if (!L) return [];
    const want = [].concat(ids);
    const rows = Order()
      .rows(L)
      .filter((r) => !r.done && !r.head && (!opts.for || r.for === opts.for) && (opts.block == null || (r.block || 1) === opts.block) && (opts.all || (!r.no && r.ids.some((id) => want.includes(id)))));
    // (a "don't" row isn't closed by its word mid-dish, only with everything: {all}, or the dish's finish)
    // the head (the dish itself: "trae samosa", Nana's "daar") closes when the station says the dish is
    // made: opts.head, everything closed ({all} for the whole order), or its own word when no row has it
    const H = L.head;
    // decision 97 (3): the station says a person's dish (or the whole order) is made: their card may fold once its rows are done
    if (opts.all && opts.for) (L.closedFor = L.closedFor || {})[opts.for] = true;
    if (opts.all && !opts.for) L.closedAll = true;
    if (H && !H.done && !H.rec && (opts.head || (opts.all && !opts.for) || (!rows.length && want.length && (H.ids || []).some((id) => want.includes(id))))) rows.push(H);
    rows.forEach(markDone);
    if (rows.length) {
      settle(L);
      renderOrder();
      if (UI.naniMood) UI.naniMood("happy", 1600); // ART-10: a step is made: Nani's face smiles a moment
    }
    return rows;
  };
  /** Tick the i-th piece of the dish's sequence (a mixed skewer's pieces): that row, never another row with the same word. */
  /** The sequences that positions count along: a skewer's mixes, one after the other (two different mixes), else the first. */
  const seqSecs = (L) => {
    const mixes = L ? L.sections.filter((x) => x.cardOf) : [];
    return mixes.length ? mixes : [L && L.sections.find((x) => x.seq)].filter(Boolean);
  };
  M.tickUnit = function (i, dish = 0) {
    const L = ladderFor(dish);
    const secs = seqSecs(L);
    if (!secs.length) return null;
    const units = [];
    secs.forEach((s) => s.groups.forEach((g) => g.forEach((r) => !r.no && units.push(...Array(r.need || 1).fill(r)))));
    const r = units[i];
    if (!r || r.done) return r || null;
    r.got = (r.got || 0) + 1;
    if (r.got >= (r.need || 1)) markDone(r);
    settle(L);
    renderOrder();
    return r;
  };
  /**
   * 28 Sept: one of the things made several times is finished (a skewer threaded): its kind's
   * next mini card ticks. The kind's own row (the count, "ba lakri gos") still ticks only when
   * the step closes (UX 11). kind: a word id, or a compound kind ("ph-big+cook-maani").
   */
  M.tickCard = function (kind, dish = 0) {
    const L = ladderFor(dish);
    if (!L || !kind) return null;
    const want = String(kind).split("+");
    const r = Order()
      .rows(L)
      .find((x) => x.units && want.every((id) => x.ids.includes(id)) && x.units.some((u) => !u));
    if (!r) return null;
    r.units[r.units.indexOf(false)] = true;
    renderOrder();
    return r;
  };
  /**
   * SEK-13 (S06): a piece went on (n: how many pieces are on now; 0 after the last came off) on a skewer of a mix
   * already made once (the same mix again: "ba lakri mixed"): the box of the skewer being threaded (its kind's first
   * unit not yet made) ticks that many of its pieces. kind: the mix's word id (as M.tickCard).
   */
  M.tickPiece = function (kind, n, dish = 0) {
    const L = ladderFor(dish);
    if (!L || !kind) return null;
    const want = String(kind).split("+");
    const r = Order()
      .rows(L)
      .find((x) => x.units && want.every((id) => x.ids.includes(id)) && x.units.some((u) => !u));
    if (!r) return null;
    const u = r.units.indexOf(false);
    r.unitGot = r.unitGot || [];
    if ((r.unitGot[u] || 0) === n) return r;
    r.unitGot[u] = n;
    renderOrder();
    return r;
  };
  /** A step of the dish's ordered job was taken (a chaat layer went in): its "next" row moves on. */
  M.advance = function (dish = 0) {
    const L = ladderFor(dish);
    const s = L && L.sections.find((x) => x.seq && (!x.when || x.shown) && !x.cardOf);
    if (!s) return;
    s.at = (s.at || 0) + 1;
    renderOrder();
  };
  /** The i-th piece of the dish's sequence (thread reports a position, not an item). */
  M.unitId = function (i, dish = 0) {
    const L = ladderFor(dish);
    if (!L) return null;
    const units = [];
    seqSecs(L).forEach((s) => s.groups.forEach((g) => g.forEach((r) => !r.no && r.ids.forEach((id) => units.push(...Array(r.need || 1).fill(id))))));
    return units[i] || null;
  };
  /** Something went wrong for this item (a word id, or a compound kind's ids): mark its row (shown on the result card). */
  M.missItem = function (id, dish = 0, { no = null, counted = false, for: forWho = null, block = null, did = null } = {}) {
    const L = ladderFor(dish);
    if (!L) return null;
    const want = [].concat(id);
    const has = (x) => want.every((w) => x.ids.includes(w));
    const rows = Order()
      .rows(L, { all: true })
      .filter((r) => (!forWho || r.for === forWho) && (block == null || (r.block || 1) === block));
    const num = (x) => x.parts && x.parts.some((p) => typeof p === "number");
    const r =
      // a count that went wrong is the counted row ("ba maani"), not the dish's name ("maani")
      (counted && rows.find((x) => !x.head && num(x) && has(x))) ||
      rows.find((x) => has(x) && (no == null || !!x.no === no) && !x.done) ||
      rows.find((x) => has(x) && (no == null || !!x.no === no)) ||
      (counted ? rows.find(num) : null);
    if (r) r.miss = true;
    // decision 93: what went in instead (a word id), for the steps page's "done" (the first try's, kept)
    if (r && did && !r.did) r.did = did;
    return r;
  };
  /**
   * CK-32 (Zafar, 29 Sept: "the card marks the wrong row"): at a wrong serve's review, the rows the serve found wrong are
   * drawn red on the card (the shared card's `wrong`), and the card stays open to show them, until they are redone
   * (M.reopen) or shown (a tick). Never mid-round: only a station's serve calls it. Returns the rows marked.
   */
  M.serveWrong = function (ids, dish = 0, { for: forWho = null } = {}) {
    const L = ladderFor(dish);
    if (!L) return [];
    const want = [].concat(ids);
    const rows = Order()
      .rows(L, { all: true })
      .filter((r) => !r.head && (!forWho || r.for === forWho) && r.ids.some((id) => want.includes(id)));
    rows.forEach((r) => (r.wrong = true));
    if (rows.length) renderOrder();
    return rows;
  };
  /**
   * Decision 51 (CK-23): a wrong item is redone on the spot: its rows open again (opts.for: one person's), the first
   * try's mark (r.miss) kept for the end review. Returns the rows reopened.
   */
  M.reopen = function (ids, dish = 0, opts = {}) {
    const L = ladderFor(dish);
    if (!L) return [];
    // a cup made again: that person's dish is not made any more (decision 97 (3))
    if (opts.for && L.closedFor) delete L.closedFor[opts.for];
    if (!opts.for) L.closedAll = false;
    const want = ids == null ? null : [].concat(ids);
    const rows = Order()
      .rows(L, { all: true })
      .filter((r) => !r.head && (!opts.for || r.for === opts.for) && (!want || r.ids.some((id) => want.includes(id))));
    rows.forEach((r) => {
      r.done = false;
      r.got = 0;
      r.wrong = false; // CK-32: open again, plain (the red was the review's)
    });
    if (mission && mission.folds) Object.values(mission.folds).forEach((st) => ((st.open = false), (st.doneAt = 0)));
    renderOrder();
    return rows;
  };
  /** The next open step went wrong (an out-of-order pick). */
  M.missNext = function (dish = 0) {
    const L = ladderFor(dish);
    if (!L) return null;
    const r = Order()
      .rows(L)
      .find((x) => !x.head && !x.no && !x.done);
    if (r) r.miss = true;
    return r;
  };
  /** A dish is finished: whatever is left is done (the ticks catch up). */
  M.finishDish = function (dish = 0) {
    const L = ladderFor(dish);
    if (!L) return;
    L.sections.forEach((s) => {
      s.shown = s.shown || !s.when;
      s.concealed = false;
    });
    Order()
      .rows(L)
      .forEach((r) => !r.miss && markDone(r));
    renderOrder();
  };
  /** A section that waits for its station appears (the tadka order when the tadka starts). */
  M.reveal = function (key) {
    if (!mission) return null;
    let found = null;
    mission.ladders.forEach((L) =>
      L.sections.forEach((s) => {
        if (s.when === key && !s.shown) {
          s.shown = true;
          found = { L, s };
        }
      })
    );
    if (found) {
      renderOrder();
      // the part that just appeared (the tadka order) is the one to look at
      const late = [...document.querySelectorAll("#mission .lsec.late")].pop();
      if (late && late.scrollIntoView) late.scrollIntoView({ block: "nearest" });
    }
    return found;
  };
  /**
   * S04-B (decision 75 (1), CHT-10, Z2): a part of the order that waits for its station (chaat's layer order, daar's
   * tadka and stir) is a new order for a play phase, so it opens with the shared request pop-up: the card big, only
   * the new rows read out (at every level, L4's closed card too), then folded into the sidebar. Every caller of
   * ctx.nextStep (each station's begin) gets it; returns the revealed section, or null (nothing new: no pop-up).
   */
  M.request = async function (key) {
    const found = M.reveal(key);
    if (!found) return null;
    const rows = found.s.groups.flat();
    if (rows.length && global.Lifecycle && !introOpen()) {
      try {
        await M.introduce({ only: rows, pause: 900 });
      } catch (e) {
        if (!(e instanceof Cook.Abort)) throw e;
      }
    }
    return found;
  };
  /**
   * Wave 3 (tadka): a section that has appeared shows its words as dots
   * ("dots"), or goes back off the card ("hidden": Nani's order, from
   * memory). The rows come back when the dish is finished.
   */
  M.conceal = function (key, how) {
    if (!mission || !how || how === "words") return;
    mission.ladders.forEach((L) =>
      L.sections.forEach((s) => {
        if (s.key !== key) return;
        // "hidden": off the card, but each one comes back as it's done (the card still ticks off, UX 11)
        if (how === "hidden") s.concealed = true;
        else [].concat(...s.groups).forEach((r) => (r.dots = true));
      })
    );
    renderOrder();
  };
  M.ladders = () => (mission ? mission.ladders : []);
  /** Draw the rows again (a mode that keeps its own row state, e.g. Find it's tallies). */
  M.refresh = () => mission && renderOrder();
  M.isTarget = function (id) {
    if (!mission) return false;
    return mission.ladders.some((L) =>
      Order()
        .rows(L)
        .some((r) => !r.done && !r.no && r.ids.includes(id))
    );
  };
  // Wave 5: the English step pills are gone; kept as no-ops for callers
  M.step = () => {};
  M.setSteps = () => {};
  /** PARKED MODES ONLY (legacy stars; Cook never calls it). state: "earned" | "lost" | "pending" */
  M.star = function (k, state, { final = false } = {}) {
    if (!mission || mission.stars[k] === state) return;
    // Wave 6b (UX 11): no verdicts mid-round. A page that opts in (Cook.deferStars) keeps its
    // stars as they are while you play; they're shown when the order is served (final)
    if (state === "lost" && Cook.deferStars && !final && !mission.stamped) return;
    if (mission.stars[k] === "lost" && state !== "earned") return;
    mission.stars[k] = state;
    renderStars();
    const el = $(`#mission .mstar[data-k="${k}"]`);
    if (el) {
      el.classList.add("pop");
      setTimeout(() => el.classList.remove("pop"), 500);
    }
  };
  M.stars = () => (mission ? Object.assign({}, mission.stars) : {});
  M.stamp = function () {
    $("#mission").classList.add("stamped");
    if (mission) mission.stamped = true;
    // S13-B1 (one stamp): every card of the order wears the kit's served stamp (OrderCard.stamp; drawn again on a redraw: drawCards)
    if (OCard() && OCard().stamp) document.querySelectorAll("#mission .oc-card").forEach((c) => OCard().stamp(c));
    // CHT-15 (the judge, 20 Oct: "the tick badge on the mission bubble covers the end of 'khape'"): the stamp's room narrows
    // the card's words (css/shared/order-card.css .stamped), which changes no box FitText.watch sees, so the headline kept
    // the size it was fitted at and ran under the done tick. Fit the card's words again now (and once the fold has run)
    const refit = () => global.FitText && $("#mission") && global.FitText.run($("#mission"));
    refit();
    setTimeout(refit, 60);
    setTimeout(refit, 500);
    UI.bulbOff();
    UI.stepDone();
  };
  M.close = function () {
    stopReading();
    UI.helper(null);
    UI.stepDone();
    if (guide && guide.strip) guide.strip(false);
    $("#mission").classList.add("hidden");
    $("#mission").classList.remove("arriving");
    if (intro()) intro().classList.add("hidden");
    if (rq && global.Lifecycle && global.Lifecycle.close) global.Lifecycle.close(); // (the kit's pop-up, S13-B1: it folds now)
    mission = null;
  };
  M.html = function () {
    const el = $("#mission");
    return el ? el.innerHTML : "";
  };

  /* Busy: the customer's patience as a ring round their face (a parked mode's
     legacy lightning star drains with it). */
  function paintDrain(frac) {
    const st = $(`#mission .mstar[data-k="third"]`);
    if (st) st.style.setProperty("--fill", `${Math.round(Cook.clamp(frac, 0, 1) * 100)}%`);
  }
  UI.setPatience = function (frac) {
    const el = $("#mission");
    const ring = el.querySelector(".m-ring");
    if (frac == null) {
      ring.classList.remove("on", "low");
      if (mission) mission.patience = null;
      return;
    }
    const f = Cook.clamp(frac, 0, 1);
    ring.classList.add("on");
    ring.classList.toggle("low", f < 0.35);
    ring.style.setProperty("--p", f.toFixed(3));
    if (mission) mission.patience = f;
    paintDrain(f);
  };

  /* ---------------- pocket money ---------------- */
  // Wave 5: no coins counter in the sidebar (pocket money is on the title screen and the day's
  // summary); kept as a no-op so the parked modes that call it needn't care
  UI.setCoins = () => {};
  UI.setStars = () => {}; // parked modes only
  function bumpEl(p) {
    p.classList.remove("bump");
    void p.offsetWidth;
    p.classList.add("bump");
  }

  /* ---------------- the word review (the result card) ---------------- */
  /**
   * Every Kutchi word in an order, once, in the order it was said: the dish
   * names, the things, the numbers, and "ne poi" when there was a sequence.
   * English placeholders aren't Kutchi, so they're left out.
   */
  UI.orderWords = function (ladders) {
    const out = [];
    const add = (id) => id && Lang.known(id) && !Cook.isPlaceholder(id) && !out.includes(id) && out.push(id);
    (ladders || []).forEach((L) => {
      Order()
        .rows(L, { all: true })
        .forEach((r) => (r.phrase ? r.phrase.segs : r.line.segs).concat(r.line.segs).forEach((s) => s.w && add(s.w)));
      const seqWord = Lang.frames().seq_word;
      if (seqWord && L.sections.some((s) => s.seq && s.groups.length > 1)) add(seqWord);
    });
    return out;
  };
  /**
   * SH-02: the same words as orderWords, each in the FORM the order used ("hakri" where the order said
   * hakri dungri, not the dictionary's "hakro"): [{id, kutchi, check}] where kutchi is the text the card
   * showed (lower case, no full stop) and check marks a form guessed for a noun of unconfirmed gender
   * (decision 21: the "to check" flag on the test site). A word met in two forms keeps the first.
   */
  UI.orderWordForms = function (ladders) {
    const ids = UI.orderWords(ladders);
    const form = new Map();
    const clean = (id, t) => {
      let k = String(t || "").replace(/[.,!?;:]+/g, " ").replace(/\s+/g, " ").trim();
      const base = Cook.display(id);
      if (k && base && base.charAt(0) === base.charAt(0).toLowerCase()) k = k.charAt(0).toLowerCase() + k.slice(1);
      return k || base;
    };
    const look = (segs) => (segs || []).forEach((s) => s.w && s.lang === "k" && !s.part && !form.has(s.w) && form.set(s.w, { kutchi: clean(s.w, s.t), check: !!s.check, cell: s.cell }));
    (ladders || []).forEach((L) => Order().rows(L, { all: true }).forEach((r) => look((r.phrase ? r.phrase.segs : r.line.segs).concat(r.line.segs))));
    return ids.map((id) => Object.assign({ id, kutchi: Cook.display(id), check: false }, form.get(id) || {}));
  };
  /** Word pills: [speaker] Kutchi · English, marked "missed" or "help". */
  UI.wordReview = function (words) {
    if (!words || !words.length) return "";
    return `<div class="wr">${words
      .map((w) => {
        const tag = w.state === "missed" ? `<span class="wr-tag">missed</span>` : w.state === "helped" ? `<span class="wr-tag">help</span>` : "";
        const ph = Cook.isPlaceholder(w.id);
        return `<button class="wr-pill ${w.state || "ok"}" type="button" data-w="${esc(w.id)}" aria-label="Hear it"><span class="wr-say">${ICON.speaker}</span><b class="${ph ? "njg-ph" : ""}">${esc(Cook.display(w.id))}</b><span class="wr-en">${esc(Cook.english(w.id))}</span>${tag}</button>`;
      })
      .join("")}</div>`;
  };
  UI.wireWordReview = (root) =>
    root.querySelectorAll(".wr-pill[data-w]").forEach((b) =>
      b.addEventListener("click", () => {
        Cook.unlockAudio();
        b.classList.add("on");
        Lang.speakWord(b.dataset.w).then(() => b.classList.remove("on"));
      })
    );

  /* ---------------- the picture tally, done button, toast ---------------- */
  /*
   * Wave 6b (docs/design-language/ux-principles.md 11): a small tally in the top-right
   * corner of every station where you make several things: a picture of
   * each thing with how many YOU have done so far (🧅 3, 🍅 2). It shows
   * what you did, never the target, and never the Kutchi number as text
   * (the audio says it while the number is being learned).
   *   UI.count(n, {id, icon, state, speak})  set one thing's count (id: a
   *     word id or any key; icon: a picture URL, else the word's sprite)
   *   UI.hideCount()                          clear the tally
   * It never takes a tap (pointer-events: none), so it can't cover a thing to tap.
   */
  const tally = new Map(); // key -> {n, icon}
  function iconFor(id, state) {
    if (!id || !Cook.Art) return null;
    const url = Cook.Art.refUrl;
    for (const st of [state, "whole", "done", "raw", "bowl"].filter(Boolean)) {
      const u = url && url(`${id}.${st}`);
      if (u) return u;
    }
    return Cook.item(id) ? Cook.Art.wordUrl(id) : null;
  }
  UI.tallyIcon = iconFor;
  /*
   * R4 (F1, F25): on Cook's page the tally is the shared kit's (js/shared/tally.js), mounted on #count-badge;
   * a page without the kit (the parked modes that borrow this file) keeps the drawing below.
   */
  let kitTally = null;
  const shared = () => {
    if (kitTally) return kitTally;
    const b = $("#count-badge");
    if (!b || !global.Tally || !document.body.classList.contains("w6")) return null;
    b.classList.remove("hidden");
    kitTally = global.Tally.mount(b);
    return kitTally;
  };
  function drawTally() {
    const kt = shared();
    if (kt) {
      if (!tally.size) return kt.clear();
      tally.forEach((t, key) => kt.counts[key] !== tallyLabel(t, key) && kt.set(key, tallyLabel(t, key), { icon: t.icon }));
      return;
    }
    const b = $("#count-badge");
    if (!b) return;
    if (!tally.size) {
      b.classList.add("hidden");
      return;
    }
    b.classList.remove("hidden");
    // a grid, at most three across (css/cook.css)
    b.style.setProperty("--cols", Math.min(3, tally.size));
    b.innerHTML = [...tally.entries()]
      .map(([key, t]) => `<span class="tl" data-k="${esc(key)}">${t.icon ? `<img src="${esc(t.icon)}" alt="">` : ""}<b class="count-digit">${t.n}</b></span>`)
      .join("");
  }
  /*
   * SH-39 (D6, clinic play-test P23/P26; S05-C): the running count reads as the Kutchi number word at levels 1-2
   * ("tran", agreeing with its thing: hakri dungri) and as dots from level 3 (the child hears "panj" and sees five
   * dots: they must know panj is five); never a digit to match. The station puts the tally on the tool in use
   * (UI.tallyAt), never in a card row or a far corner.
   */
  function tallyLabel(t, key) {
    if (t.lv >= 3) return "\u25cf".repeat(Math.max(0, Math.min(t.n, 12)));
    const ws = key && key !== "_" ? String(key).split("+") : [];
    const g = ws.length && Lang.gender ? Lang.gender(ws[ws.length - 1]) : null;
    const w = t.n >= 1 && t.n <= 10 && Lang.num ? (Lang.num(t.n, g)[0] || {}).t : null;
    // (DAAR-12's flaw, s08 w8A: the laps chip read the digit "0" before the first lap; nothing counted yet is the icon alone)
    return w || (t.n >= 1 ? String(t.n) : "");
  }
  UI.count = function (n, { speak = true, id = "_", icon = null, state = null } = {}) {
    const prev = tally.get(id);
    tally.set(id, { n, lv: mission ? mission.level : orderLevel(), icon: icon || (prev && prev.icon) || iconFor(id === "_" ? null : id, state) });
    drawTally();
    if (tallyPt && tallyAnchor === "right") placeTally(); // CHAI-20: a wider badge (a second group) is kept on screen
    const el = $(`#count-badge .tl[data-k="${CSS.escape(id)}"]`);
    if (el) bumpEl(el); // (the shared tally bumps its own chip)
    // Counting aloud teaches the number words (stages 1-2). From stage 3
    // the count is silent, so you can't just stop when the sound matches
    // what you heard in the order.
    // 28 Sept (Zafar): the voice says the count AND the thing ("hakri dungri", "ba dungri"), the number
    // agreeing with the noun (hakro/hakri). A later level (3+) or Nani on mute stays silent.
    const lv = mission ? mission.level : orderLevel();
    // C3 (decision 41, E12): Nani counts along at level 1 only, in every station (the Chai tray's sugar too);
    // level 2: written on the card, no counting along; level 3+: heard in the order only (the face replays it)
    const heard = lv <= 1;
    // PAN-11 (6 Oct): the count word goes over her line at once (her line pauses and carries on), never queued behind it
    if (speak && n >= 1 && n <= 5 && heard && !UI.naniMuted()) UI.lastCount = Lang.speak(tallyLine(n, id), { over: true }).catch(() => {});
  };
  /** "hakri dungri", "ba maani", "ba wadhi maani": the count and the thing, as the order says it. */
  function tallyLine(n, id) {
    const ws = id && id !== "_" ? String(id).split("+") : [];
    // (s08 w2A, SH-99's last gap: tagged role "count": counting along the taps is a tally, not the order, contract-30)
    if (!ws.length || !ws.every((w) => Lang.known(w)) || ws.some((w) => Cook.isPlaceholder(w))) return Lang.role(Lang.say({ fn: "Count", n }, { row: true }), "count");
    const parts = Lang.countParts(n, ws[ws.length - 1]);
    const at = parts.indexOf(ws[ws.length - 1]);
    parts.splice(at, 1, ...ws);
    return Lang.role(Lang.phrase(parts), "count");
  }
  UI.tallyLine = tallyLine;
  /** One more of `id` on the tally (returns the new count). */
  UI.countUp = function (id, opts = {}) {
    const n = ((tally.get(id) || {}).n || 0) + 1;
    UI.count(n, Object.assign({ id }, opts));
    return n;
  };
  UI.countOf = (id) => (tally.get(id) || {}).n || 0;
  /**
   * Where the tally sits: its usual corner (null), or centred on a point of
   * the picture ([x, y] in the 1600x900 world), e.g. the pantry's fridge base,
   * so it covers nothing you need. Follows the picture when the window resizes.
   */
  let tallyPt = null;
  function placeTally() {
    const b = $("#count-badge");
    if (!b) return;
    if (!tallyPt) {
      b.classList.remove("at");
      b.style.left = b.style.top = "";
      return;
    }
    const st = $("#stage").getBoundingClientRect();
    const p = UI.worldToScreen(tallyPt[0], tallyPt[1]);
    b.classList.add("at");
    // SH-39: a tally anchored by its right edge grows to the left, away from the word that pops on the pan's other side
    b.classList.toggle("at-r", tallyAnchor === "right");
    b.style.left = `${p.x - st.left}px`;
    b.style.top = `${p.y - st.top}px`;
    // CHAI-20 (S05-C3): a badge anchored by its right edge that grows past the stage's left edge (two count groups at L3 on
    // the first pan) is pushed back on screen, never cut (non-negotiable 9)
    // SH-39 (s08 w8A: at 844x390 the badge over the first pan ran off the stage's top edge, its words cut in half): any
    // badge that would leave the stage, on any side, is moved back inside it, whole
    const gap = 8;
    const r = b.getBoundingClientRect();
    const dx = r.left < st.left + gap ? st.left + gap - r.left : r.right > st.right - gap ? Math.max(st.left + gap - r.left, st.right - gap - r.right) : 0;
    const dy = r.top < st.top + gap ? st.top + gap - r.top : r.bottom > st.bottom - gap ? Math.max(st.top + gap - r.top, st.bottom - gap - r.bottom) : 0;
    if (dx) b.style.left = `${p.x - st.left + dx}px`;
    if (dy) b.style.top = `${p.y - st.top + dy}px`;
  }
  let tallyAnchor = null;
  UI.tallyAt = function (pt, { anchor = null } = {}) {
    tallyPt = pt || null;
    tallyAnchor = anchor;
    placeTally();
  };
  if (!Cook.life) pageWide();
  UI.hideCount = () => {
    tally.clear();
    drawTally();
  };
  /** C3 (E14): one thing's count down by one (a take-back); at none it leaves the tally. */
  UI.countDown = function (id) {
    const n = Math.max(0, UI.countOf(id) - 1);
    if (n > 0) return UI.count(n, { id, speak: false });
    tally.delete(id);
    const kt = shared();
    if (kt) kt.clear();
    drawTally();
  };
  let doneResolve = null;
  let doneGlowT = null;
  /*
   * CK-41 (decision 95, contract-8: one highlight at a time): the ✓'s glow is what the station wants (doneWant); it shows
   * only while no picture in the scene glows (the scene's glow stack, stations.js glow(), holds it: UI.holdDone). Roll-tawa's
   * ✓ lit at the count while the tawa's raw chapati glowed to be flipped, both for 300 ms; the ✓ now waits for the flip
   */
  let doneWant = false;
  let heldBy = null; // the picture glowing now (a picture gone with its station holds nothing)
  const doneGlowNow = () => {
    const b = $("#done-btn");
    const held = !!(heldBy && heldBy.active && heldBy.scene);
    if (b) b.classList.toggle("glow", doneWant && !held);
  };
  UI.holdDone = (obj) => {
    heldBy = obj || null;
    doneGlowNow();
  };
  UI.done = function (opts = {}) {
    const b = $("#done-btn");
    b.classList.remove("hidden");
    doneWant = !!opts.glow;
    // SH-58 (C8, D5): when the ✓ is the only thing left it glows (the first plays of a station:
    // its first five rounds), not only in a guided round
    clearTimeout(doneGlowT);
    // (S05-C, S's request: at once, the moment it is the only thing left, as every other focal glow; a play counts
    // once per order, however often a station shows its ✓: chai's showed it on every refresh, so the five plays were
    // used up in the first round)
    if (opts.glow !== false && UI.doneGlows()) doneWant = true;
    doneGlowNow();
    return new Promise((resolve) => {
      doneResolve = resolve;
    });
  };
  UI.glowDone = (on) => {
    doneWant = !!on;
    doneGlowNow();
  };
  /** SH-58: still in a station's first plays (its first five orders), when a lone ✓ glows. Counted once per order. */
  const doneCounted = new WeakSet();
  UI.doneGlows = function () {
    const c = Cook.ctx;
    const st = (c && c.order && c.order.dishes && (c.order.dishes[c.dishAt || 0] || {}).recipe) || "lab";
    const plays = (Cook.save.donePlays = Cook.save.donePlays || {});
    const early = (plays[st] || 0) < 5;
    if (c && !doneCounted.has(c)) {
      doneCounted.add(c);
      plays[st] = (plays[st] || 0) + 1;
    }
    return early;
  };
  /**
   * Wave 6: the big button between two jobs of one station ("Go to the
   * barbecue"), bottom right under the thumb. Resolves when it's pressed.
   */
  let goResolve = null;
  UI.go = function (label, opts = {}) {
    const b = $("#go-btn");
    if (!b) return Promise.resolve();
    const t = b.querySelector(".njg-next-t") || b.querySelector(".go-t");
    t.textContent = label;
    // a label Mum hasn't given yet is the engine's English placeholder: italic, flagged to record (rule G2)
    t.classList.toggle("njg-ph", !!opts.rec); // (the kit's one placeholder class, css/shared/app.css; S13-B1)
    b.classList.toggle("glow", !!opts.glow);
    const kit = global.NjgButtons;
    // Sprint 11 (Zafar, 22 Oct: "no Next and no Done anywhere"; principle 4): the job between two jobs is complete, so
    // after a short beat the station moves on by itself through the one move-on hook (NjgButtons.moveOn). #go-btn stays
    // in the page, hidden (its label and picture code keeps working), and is never waited on. A UI.hideGo() before the
    // beat (the station went another way) cancels it. A page without the kit keeps the old button.
    if (!kit || !kit.moveOn) {
      b.classList.remove("hidden");
      return new Promise((resolve) => (goResolve = resolve));
    }
    b.classList.add("hidden");
    return new Promise((resolve) => {
      const mine = (goResolve = resolve);
      const run = Cook.run;
      kit.moveOn(() => {
        if (goResolve !== mine || run !== Cook.run) return;
        goResolve = null;
        resolve();
      }, { reason: "cook:station", ms: opts.ms });
    });
  };
  UI.glowGo = (on) => $("#go-btn") && $("#go-btn").classList.toggle("glow", on);
  UI.hideGo = function () {
    if ($("#go-btn")) $("#go-btn").classList.add("hidden");
    goResolve = null;
  };
  UI.hideDone = function () {
    clearTimeout(doneGlowT);
    $("#done-btn").classList.add("hidden");
    doneResolve = null;
  };
  UI.toast = function (text) {
    const t = $("#toast");
    t.textContent = text;
    t.classList.remove("hidden");
    t.style.animation = "none";
    void t.offsetWidth;
    t.style.animation = "";
  };

  /* ---------------- panels ---------------- */
  UI.panel = function (html, opts = {}) {
    const o = $("#overlay");
    o.classList.remove("hidden");
    // S02-E (decision 64): the title shows the redrawn kitchen once it has landed (the old photo isn't fetched)
    const kt = (((Cook.data && Cook.data.art) || {}).s02 || {})["kitchen-trays"];
    o.style.backgroundImage = opts.title && kt && kt.ready && kt.file ? `url("${Cook.v(kt.file)}")` : "";
    // the kitchen's master (SH-91): its core (the island and trays) is at the bottom, so the title keeps the counter in view
    o.style.backgroundPosition = opts.title && kt && kt.ready && Array.isArray(kt.core) ? "50% 100%" : "";
    o.classList.toggle("title-mode", !!opts.title);
    const p = $("#panel");
    p.innerHTML = html;
    p.scrollTop = 0;
    // CK-36: a grown-ups' view (opts.grown: the Station lab) may scroll; a child's panel never (the layout lint's rule)
    p.toggleAttribute("data-grown", !!opts.grown);
    return p;
  };
  UI.closePanel = () => {
    $("#overlay").classList.add("hidden");
    if (Cook.expect && Cook.expect.kind === "click" && document.querySelector("#panel " + Cook.expect.selector)) Cook.expect = null;
  };
  UI.panelOpen = () => !$("#overlay").classList.contains("hidden");

  UI.clearStage = function () {
    UI.hideBubble();
    UI.hideVoice();
    UI.hideGist();
    UI.hideCount();
    UI.hideDone();
    UI.hideGo();
    $("#choices").classList.add("hidden");
    $("#passme").classList.add("hidden");
    if ($("#intro")) $("#intro").classList.add("hidden");
    UI.closeHelp();
  };

  /**
   * C4: back to how the page loaded, for the next mount (js/cook/mount.js unmounts Cook and may mount it again in
   * the same page): the shared widgets this file made are destroyed and every handle on the old screen dropped.
   */
  UI.reset = function () {
    if (guide && guide.destroy) {
      try {
        guide.destroy();
      } catch (e) {
        /* gone with the screen */
      }
    }
    if (stepper) stepper.close();
    stepper = null;
    guide = guideKey = guideLine = null;
    if (kitTally && kitTally.destroy) kitTally.destroy();
    kitTally = null;
    mission = null;
    tallyPt = null;
    tally.clear();
    doneResolve = goResolve = null;
    bubbleAnchor = null;
    dropBubble();
    speechTail = Promise.resolve();
    helpText = HELP_DEFAULT;
    voiceTok++;
    readToken++;
  };

  UI.init = function () {
    // Sprint 11: the word card and the conversations, there by the first order
    ["word-card", "conversations"].forEach((n) => UI.needShared(n));
    // SH-131 (S13-A2): a parked page (Find it, Dress up, Snap) loads neither tokens.js nor bulb.js: the shared bulb comes in, and
    // reads data/shared.json's bulbMs itself, so UI.bulbMs is never 0 s there
    if (!global.Tokens && !global.Bulb) UI.needShared("bulb");
    // every page element here is optional (another page, like find.html, may not have all of them)
    const on = (sel, fn) => {
      const e = $(sel);
      if (e) e.addEventListener("click", fn);
      return e;
    };
    // ✓ Done and → Next: the shared kit's buttons (js/shared/buttons.js; F1, SH-23), made here on Cook's page;
    // a page with its own (the parked modes that borrow this file) keeps them
    const pressGo = () => {
      const r = goResolve;
      UI.hideGo();
      if (r) r();
    };
    const pressDone = () => {
      const r = doneResolve;
      UI.hideDone();
      if (r) r();
    };
    const kit = global.NjgButtons;
    const stage = $("#stage");
    if (kit && stage && !$("#done-btn")) kit.done(stage, pressDone, { id: "done-btn" }).classList.add("hidden");
    else on("#done-btn", () => (Cook.sfx.click(), pressDone()));
    if (kit && stage && !$("#go-btn")) kit.next(stage, "", pressGo, { id: "go-btn" }).classList.add("hidden");
    else on("#go-btn", () => (Cook.sfx.click(), pressGo()));
    if (Cook.life) pageWide();
    onPage(document, "pointerdown", () => Cook.unlockAudio(), { passive: true });
    // the "?": the goal pops out (the kit's grown-ups' pop-up: a tap elsewhere, or the screen turning, puts it away itself)
    // (a parked page without the kit's buttons gets them, so its "?" is the same pop-up: S13-A2)
    if (global.NjgButtons) guPopNow();
    else UI.needShared("buttons").then(() => guPopNow());
    // CK-53: the cog opens and closes the ?, home and book beside it; a tap anywhere else (but the grown-ups' pop-up) closes them
    const cog = $("#side-cog");
    const menu = $("#side-menu");
    /*
     * SH-156 (Zafar, 29 Oct, round 4: "the cog top right of the play area"; lessons round 1, 8: the pinned cog took the side
     * panel's foot): the cog and its menu move to the top right of the play area in every Cook game, the side panel's foot
     * freed for the orders; its place at each screen size is css/cook.css (.ck-cog-rail), its menu's items and their order
     * the central rules' (data/rules.json menu, js/shared/rules.js Rules.menu)
     */
    const rail = cog && cog.closest(".side-rail");
    const stageEl = $("#stage");
    if (rail && stageEl && UI.w6()) {
      rail.classList.add("ck-cog-rail");
      cog.classList.add("ck-cog");
      cog.dataset.njgZone = "cog"; // (the central rules' skip zones know it by this: data/rules.json skip)
      if (menu) menu.dataset.njgZone = "menu";
      stageEl.appendChild(rail);
      // (over the play area its taps are its own: they never reach the game under it, as a tap on the pantry's "?" reached the
      // jar under it, a wrong pick; contract-24 at 930x430. The idle clock still sees them: it listens on the page's capture)
      ["pointerdown", "pointerup", "mousedown", "mouseup", "touchstart", "touchend", "click"].forEach((ev) => rail.addEventListener(ev, (e) => e.stopPropagation()));
      const order = () => {
        if (!menu || !global.Rules || !global.Rules.menu) return;
        global.Rules.menu().forEach((id) => {
          const b = document.getElementById(id);
          if (b && b.parentElement === menu) menu.appendChild(b);
        });
      };
      order();
      const T = global.Tokens;
      if (T && T.rulesReady) T.rulesReady.then(order).catch(() => {});
    }
    const setMenu = (open) => {
      if (!cog || !menu) return;
      menu.hidden = !open;
      cog.setAttribute("aria-expanded", open ? "true" : "false");
      if (!open && UI.helpOpen()) UI.closeHelp();
    };
    on("#side-cog", () => {
      Cook.sfx.click();
      setMenu(menu.hidden);
    });
    onPage(document, "pointerdown", (e) => {
      if (!menu || menu.hidden) return;
      if (e.target.closest && e.target.closest(".side-rail, .njg-gu-pop")) return;
      setMenu(false);
    }, { passive: true });
    UI.openMenu = () => setMenu(true);
    on("#btn-help", () => {
      Cook.sfx.click();
      if (UI.helpOpen()) UI.closeHelp();
      else UI.openHelp();
    });
    const tr = on("#mission .m-tr", () => UI.mission.translate());
    if (tr) tr.innerHTML = ICON.translate;
    // 28 Sept: Nani's guide box carries the light bulb (a page without it keeps its own #btn-bulb)
    mountGuide();
    if (!guide) {
      const bulb = on("#btn-bulb", () => {
        Cook.unlockAudio();
        UI.bulb();
      });
      if (bulb) bulb.insertAdjacentHTML("afterbegin", ICON.bulb);
    }
    // Sidebar v2: a speech card's face (the customer at the tray, Nani's "pass me") hears its line again
    [["#nani-card", ".say-slot"], ["#passme", ".pm-say"]].forEach(([sel, slot]) =>
      on(`${sel} .face-say`, (ev) => {
        ev.stopPropagation();
        const hear = $(`${sel} ${slot} .wp-say`);
        if (hear) hear.click();
      })
    );
    // Sidebar v2: the card's face is its replay button (a speaker badge on its corner)
    on("#mission .m-ring", () => {
      Cook.unlockAudio();
      UI.mission.sayCard();
    });
    // one line, always: headlines and pills shrink to fit (js/shared/fit.js)
    if (global.FitText)
      ["#side", "#intro"].forEach((sel) => {
        const off = $(sel) && global.FitText.watch($(sel));
        if (off && Cook.life) Cook.life.onEnd(off);
      });
    const replay = on("#mission .m-replay", () => {
      Cook.unlockAudio();
      UI.mission.replay();
    });
    if (replay) replay.innerHTML = ICON.replay;
  };
})(window);

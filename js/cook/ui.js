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
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const $ = (s) => document.querySelector(s);
  const UI = (Cook.UI = {});
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
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
    const spans = (i) => (box ? [...box.querySelectorAll(i == null ? ".ra" : `.ra[data-ra="${i}"]`)] : []);
    const lit = (els, on) => els.forEach((e) => e.classList.toggle("ra-on", on));
    if (Lang.hasWhole && Lang.hasWhole(line)) {
      lit(spans(), true);
      try {
        return await Lang.speak(line);
      } finally {
        lit(spans(), false);
      }
    }
    const parts = raParts(line);
    for (let i = 0; i < parts.length; i++) {
      const els = spans(parts.length > 1 ? i : null);
      lit(els, true);
      try {
        if (Lang.hasVoice(parts[i])) await Lang.speak(parts[i]);
        else await Cook.wait(Math.max(500, Cook.readMs(Lang.plain(parts[i])) * 0.5));
      } finally {
        lit(els, false);
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
  const queued = (fn) => {
    const before = Promise.race([speechTail.catch(() => {}), new Promise((r) => setTimeout(r, 4000))]);
    const mine = before.then(fn);
    speechTail = mine.catch(() => {});
    return mine;
  };
  UI.queueSpeech = queued;

  /* ---------------- speech: bubble by a character, or Nani's card ---------------- */
  let bubbleAnchor = null;
  const bubble = () => $("#bubble");
  const card = () => $("#nani-card");
  function placeBubble() {
    const b = bubble();
    if (!bubbleAnchor || bubbleAnchor.badge || b.classList.contains("hidden")) return;
    const p = UI.worldToStage(bubbleAnchor.x, bubbleAnchor.y);
    const stageW = p.stage ? p.stage.width : 1000;
    const w = b.offsetWidth;
    let left = Cook.clamp(p.x - 26, 8, stageW - w - 8);
    b.style.left = `${left}px`;
    b.style.top = `${p.y}px`;
    b.style.setProperty("--tail-x", `${Cook.clamp(p.x - left - 9, 14, w - 30)}px`);
  }
  UI.placeBubble = placeBubble;
  global.addEventListener("resize", () => setTimeout(placeBubble, 60));

  /**
   * Say a line. anchor {x, y} in world px (a bubble by a character) or
   * {badge: true} (Nani's card in the sidebar, which can never cover a
   * thing to tap). Plays the voice; resolves when it ends. A tap anywhere
   * that isn't a button skips (nothing is unskippable). opts.hide hides
   * well-known words as dots; opts.ms for text-only lines.
   */
  UI.say = async function (line, anchor, opts = {}) {
    bubbleAnchor = anchor;
    const target = anchor && anchor.badge ? card() : bubble();
    const other = target === card() ? bubble() : card();
    other.classList.add("hidden");
    const slot = target.querySelector(".say-slot");
    slot.innerHTML = "";
    slot.appendChild(UI.pill(line, { hide: opts.hide, onHear: opts.onHear, noTranslate: UI.w6(), readAlong: true }));
    target.classList.remove("hidden", "talk");
    target.style.animation = "none";
    void target.offsetWidth;
    target.style.animation = "";
    if (target === bubble()) placeBubble();
    else target.classList.add("talk");
    const token = Cook.run;
    let skip;
    const skipped = new Promise((resolve) => {
      skip = (ev) => {
        if (ev.target.closest && ev.target.closest("button, a, #overlay, .wp")) return;
        resolve();
      };
      document.addEventListener("pointerdown", skip, true);
    });
    try {
      const naniQuiet = (target === card() || opts.nani) && UI.naniMuted();
      const voice = !opts.silent && !naniQuiet && Lang.hasVoice(line);
      const talk = voice ? Promise.all([queued(() => speakAlong(line, slot)), Cook.wait(700)]) : Cook.wait(opts.ms || Cook.readMs(Lang.plain(line)));
      await Promise.race([talk, skipped]);
    } finally {
      document.removeEventListener("pointerdown", skip, true);
      target.classList.remove("talk");
    }
    Cook.checkRun(token);
    if (opts.autoHide) UI.hideBubble();
  };
  UI.hideBubble = function () {
    bubble().classList.add("hidden");
    card().classList.add("hidden");
  };

  /*
   * Wave 6b (docs/design-language/ux-principles.md 13): the instruction card is the master;
   * at a station Nani is a VOICE. Her card doesn't take sidebar space: her
   * line plays, and the rows of the order card it names throb while she
   * says it (the throbbing hint). A line about something that isn't on the
   * card (a short interjection, "Arre re!", or a switch, "now marcha!")
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
  UI.voice = async function (line, opts = {}) {
    if (!UI.w6() || !Cook.inStation || !$("#voice")) return UI.say(line, { badge: true }, opts);
    const tok = ++voiceTok;
    card().classList.add("hidden");
    bubble().classList.add("hidden");
    // the rows she's talking about: every row (on the small card) with one of her words on it
    const ids = lineWords(line).filter((id) => !String(id).startsWith("num-") && !String(id).startsWith("lnk-"));
    const els = [];
    sideEls.forEach((list, r) => {
      if (r && r.ids && r.ids.some((id) => ids.includes(id))) els.push(...list);
    });
    const cap = $("#voice");
    const onCard = els.length > 0 && !opts.caption;
    document.querySelectorAll(".throb").forEach((e) => e.classList.remove("throb"));
    els.forEach((e) => e.classList.add("throb"));
    // 28 Sept: her line shows in her own box at the top of the sidebar (no caption over the picture)
    if (guide) {
      guideLine = line;
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
    const skipped = new Promise((resolve) => {
      skip = (ev) => {
        if (ev.target.closest && ev.target.closest("button, a, #overlay")) return;
        resolve();
      };
      document.addEventListener("pointerdown", skip, true);
    });
    try {
      // Nani muted (her box): she still shows the line, silently
      const voice = !opts.silent && !UI.naniMuted() && Lang.hasVoice(line);
      const talk = voice ? Promise.all([queued(() => speakAlong(line, guide ? guide.el : cap)), Cook.wait(700)]) : Cook.wait(opts.ms || Math.min(2600, Cook.readMs(Lang.plain(line))));
      await Promise.race([talk, skipped]);
    } finally {
      document.removeEventListener("pointerdown", skip, true);
      if (tok === voiceTok) {
        els.forEach((e) => e.classList.remove("throb"));
        cap.classList.add("hidden");
        if (guide) guide.talk(false);
      }
    }
    Cook.checkRun(token);
  };
  UI.hideVoice = () => {
    voiceTok++;
    if ($("#voice")) $("#voice").classList.add("hidden");
    document.querySelectorAll(".throb").forEach((e) => e.classList.remove("throb"));
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
  UI.naniMuted = () => !!(global.NaniGuide && global.NaniGuide.muted());
  const guideEntry = () => {
    const G = (Cook.data && Cook.data.guide) || {};
    const k = guideKey || "";
    return G[k] || G[k.split(":")[0]] || G.default || null;
  };
  function showGuide() {
    if (!guide) return;
    guideLine = null;
    const g = guideEntry();
    if (g && g.line && Cook.data.lines[g.line]) {
      guideLine = Lang.line(g.line);
      guide.set(raHtml(guideLine));
    } else guide.set(esc((g && g.en) || ""), { rec: !!(g && g.en) });
  }
  /** The station (or station:phase) whose instruction the box shows. */
  UI.guideFor = function (key) {
    guideKey = key || null;
    if (guide && !guide.el.classList.contains("talk")) showGuide();
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
    guide = global.NaniGuide.mount(el, {
      face: Cook.v(Cook.facePath("nani")),
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
        if (Cook.onHelp && line.segs.some((x) => x.w)) Cook.onHelp("replay", { line });
        btn.classList.add("on");
        speakAlong(line, guide.el)
          .catch(() => {})
          .then(() => btn.classList.remove("on"));
      },
    });
    showGuide();
  }

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
    if (hb) hb.classList.toggle("fresh", !!fresh);
  };
  UI.helpText = () => helpText;
  UI.hideGist = () => {
    $("#gist").classList.add("hidden");
    UI.closeHelp();
    helpText = HELP_DEFAULT;
    if ($("#btn-help")) $("#btn-help").classList.remove("fresh");
  };
  UI.hideTopGist = () => $("#gist").classList.add("hidden");
  /** The "?" pops the goal out beside itself (over the sidebar, or just into the picture on a narrow one). */
  UI.openHelp = function () {
    const pop = $("#help-pop");
    const btn = $("#btn-help");
    if (!pop || !btn) return;
    pop.querySelector(".hp-text").textContent = helpText;
    // the grown-ups' skip lives here now (G7 / CQ15), only while the first-time help runs
    pop.querySelectorAll(".ob-skip-row").forEach((x) => x.remove());
    if (global.Onboard && global.Onboard.active && global.Onboard.active()) {
      const sk = global.Onboard.skipButton(pop);
      if (sk) sk.addEventListener("skipped", () => UI.closeHelp());
    }
    pop.classList.remove("hidden");
    btn.classList.remove("fresh");
    btn.setAttribute("aria-expanded", "true");
    const b = btn.getBoundingClientRect();
    const vw = global.innerWidth;
    const vh = global.innerHeight;
    const w = Math.min(340, vw - 16);
    pop.style.width = `${w}px`;
    // above the button, opening towards the picture (the sidebar is on the left in Wave 6)
    const onLeft = b.left + b.width / 2 < vw / 2;
    const left = Cook.clamp(onLeft ? b.left : b.right - w, 8, vw - w - 8);
    pop.style.left = `${left}px`;
    pop.style.bottom = `${Math.max(8, vh - b.top + 8)}px`;
    pop.style.setProperty("--tail-x", `${Cook.clamp(b.left + b.width / 2 - left - 8, 12, w - 24)}px`);
  };
  UI.closeHelp = function () {
    const pop = $("#help-pop");
    if (!pop) return;
    pop.classList.add("hidden");
    if ($("#btn-help")) $("#btn-help").setAttribute("aria-expanded", "false");
  };
  UI.helpOpen = () => !!$("#help-pop") && !$("#help-pop").classList.contains("hidden");

  /* ---------------- choices (small talk), as big pills ---------------- */
  UI.choose = function (options, correctKey, opts = {}) {
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
      const w = Cook.data.words[id];
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
    const line = Lang.line("give", Lang.phrase([want]));
    box.querySelector(".pm-say").innerHTML = "";
    box.querySelector(".pm-say").appendChild(UI.pill(line, { hide: opts.hide, onHear: opts.onHear, noTranslate: UI.w6(), onTranslate: () => Cook.onHelp && Cook.onHelp("translate", { ids: [want], passMe: true }) }));
    const tray = box.querySelector(".pm-tray");
    tray.innerHTML = "";
    card().classList.add("hidden");
    box.classList.remove("hidden", "leaving");
    box.classList.toggle("busy", Cook.save.mode === "busy");
    let misses = 0;
    if (!UI.naniMuted()) Lang.speak(line);
    return new Promise((resolve) => {
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
          if (id === want || quiet) {
            if (quiet) misses++;
            b.classList.add(quiet ? "picked" : "right");
            if (quiet) Cook.sfx.pop();
            else Cook.sfx.right();
            if (Cook.expect && String(Cook.expect.selector || "").startsWith("#passme")) Cook.expect = null;
            setTimeout(() => {
              box.classList.add("leaving");
              setTimeout(() => {
                box.classList.add("hidden");
                UI.voice(Lang.line("thanks"), { ms: 900 }).catch(() => {});
                resolve({ misses });
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
  const hideWord = (id) => Cook.cardHidden(id) && Lang.wordHasVoice(id);
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
    };
    UI.bulbOff();
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
  const rowHide = (r) => (id) => !r.done && !r.revealed && (r.dots || hideWord(id));
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
        onHear: () => {
          // hearing it again is fine while the words are on the card; once
          // they're dots, a replay is help (a hint)
          if (rowHidden(r) && Cook.onHelp) Cook.onHelp("replay", { ids: r.ids });
        },
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
    li.appendChild(UI.pill(r.line, { hide: rowHide(r), noTranslate: true, reserveSay: true, onHear: () => rowHidden(r) && Cook.onHelp && Cook.onHelp("replay", { ids: r.ids }) }));
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

  /* ---------------- the intro card: the order, big, in the middle ---------------- */
  const intro = () => $("#intro");
  const introOpen = () => !intro().classList.contains("hidden");
  function renderIntro() {
    if (UI.w6()) return renderIntro6();
    const box = intro().querySelector(".ic-order");
    box.innerHTML = "";
    shape().forEach(({ L, sections }) => {
      const lad = document.createElement("div");
      lad.className = "ladder";
      if (L.head) lad.insertAdjacentHTML("beforeend", `<div class="ir head"><span class="ir-text">${Lang.html(L.head.line, { hide: rowHide(L.head) })}</span></div>`);
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
  /**
   * Show the order big while it's said. Resolves once it has flown into
   * the sidebar: on a tap, or after the voice and a short pause.
   */
  M.introduce = async function (opts = {}) {
    if (!mission || !hasRows(mission)) return;
    const m = mission;
    const el = intro();
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
      if (m.ladders.some(anyHidden) && Cook.onHelp) Cook.onHelp("replay");
      (UI.w6() ? readAlong(partsOf(m.line, introEls)) : Lang.speak(m.line)).then(() => faces().forEach((f) => f.classList.remove("on")));
    };
    const onTap = (ev) => {
      if (ev.target.closest(".ic-say, .oc-face")) return onSay(ev);
      done();
    };
    el.addEventListener("click", onTap);
    const prevExpect = Cook.expect;
    Cook.expect = { kind: "click", selector: "#intro .ic-card", intro: true };
    card.classList.add("talk");
    const voice = opts.speak !== false && Lang.hasVoice(m.line);
    // Wave 6: read along: each part lights up on the card as it's said
    const said = UI.w6() && opts.speak !== false ? readAlong(partsOf(m.line, introEls), { min: 900 }) : voice ? Promise.all([Lang.speak(m.line), Cook.wait(900)]) : Cook.wait(Cook.readMs(Lang.plain(m.line)));
    const talk = said.then(() => {
      card.classList.remove("talk");
      return Cook.wait(opts.pause != null ? opts.pause : 1400);
    });
    try {
      await Promise.race([talk, tapped]);
    } finally {
      el.removeEventListener("click", onTap);
      card.classList.remove("talk");
      stopReading();
      if (Cook.expect && Cook.expect.intro) Cook.expect = prevExpect && !prevExpect.intro ? prevExpect : null;
    }
    Cook.checkRun(token);
    await flyIn();
  };
  /** The big card shrinks into the small one's place in the sidebar. */
  async function flyIn() {
    const el = intro();
    const card = el.querySelector(".ic-card");
    const target = $("#mission");
    const a = card.getBoundingClientRect();
    const b = target.getBoundingClientRect();
    const reduced = global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && b.width && a.width && card.animate) {
      const s = Math.min(b.width / a.width, 1);
      const anim = card.animate(
        [
          { transform: "none", opacity: 1 },
          { transform: `translate(${b.left - a.left}px, ${b.top - a.top}px) scale(${s})`, opacity: 0.3 },
        ],
        { duration: 480, easing: "cubic-bezier(.5,0,.3,1)", fill: "forwards" }
      );
      await new Promise((resolve) => {
        anim.onfinish = resolve;
        setTimeout(resolve, 700);
      });
    }
    el.classList.add("hidden");
    if (card.getAnimations) card.getAnimations().forEach((x) => x.cancel());
    target.classList.remove("arriving");
    target.classList.add("landed");
    setTimeout(() => target.classList.remove("landed"), 400);
  }
  /** ↻ on the small card: the order big again, said again (a replay: help once its words are dots). */
  M.replay = async function () {
    if (!mission || introOpen() || $("#mission").classList.contains("stamped")) return;
    if (mission.ladders.some(anyHidden) && Cook.onHelp) Cook.onHelp("replay");
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
  M.introOpen = introOpen;

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
   * a few seconds (data.calm.bulbMs by level: 5, 3, 2, 1 s); for rows still
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
  const stopReading = () => {
    readToken++;
    document.querySelectorAll(".reading").forEach((e) => e.classList.remove("reading"));
  };
  /**
   * Read parts in turn, lighting each one's elements while it's said (the
   * voice file of that chunk, or a reading pause if it has none). A new
   * read stops the last one.
   */
  async function readAlong(parts, { min = 0 } = {}) {
    stopReading();
    const token = ++readToken;
    const t0 = Date.now();
    for (const p of parts) {
      if (token !== readToken) return;
      p.els.forEach((e) => e.classList.add("reading"));
      try {
        if (Lang.hasVoice(p.line)) await Promise.all([Lang.speak(p.line), Cook.wait(260)]);
        else await Cook.wait(Math.max(700, Cook.readMs(Lang.plain(p.line)) * 0.55));
      } finally {
        p.els.forEach((e) => e.classList.remove("reading"));
      }
      if (token === readToken) await Cook.wait(120);
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
  const partNode = (r, gi) => ({ label: rowText(text6(r.line, rowHide(r))), done: !!r.done, no: !!r.no, key: r, gi, next: false });
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
    return { html: text6(r.line, () => false), key: r };
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
          const placed = rows.slice().sort((a, b) => Order().slotOf(L, a.r) - Order().slotOf(L, b.r));
          cards.push({ key: `${L.dish || 0}:${s.for}`, who: s.for, L, rows: placed.map((x) => x.r), data: { person: person(s.for), headline: s.head ? headNode(s.head) : headline, items: [{ label: null, parts: placed.map((x) => partNode(x.r, x.gi)) }] } });
        });
        return;
      }
      const items = [];
      const rowsShown = [];
      sections.forEach(({ s, rows, seq }) => {
        if (s.cardOf) return; // drawn under its item
        const flat = rows.filter((x) => !x.r.cards);
        if (s.block && s.head) {
          // 30 Sept: a second block of the dish (samosa's second kind): its own row ("trae samosa"), its parts under it
          const parts = flat.map((x) => partNode(x.r, x.gi));
          items.push({ label: rowText(text6(s.head.cardLine || s.head.line, rowHide(s.head))), count: 1, parts, ordered: false, at: 0, src: flat, key: s.head });
          rowsShown.push(s.head, ...flat.map((x) => x.r));
          return;
        }
        if (flat.length) {
          const parts = flat.map((x) => partNode(x.r, x.gi));
          items.push({ label: null, parts, ordered: seq, at: s.at || 0, src: flat });
          rowsShown.push(...flat.map((x) => x.r));
        }
        rows
          .filter((x) => x.r.cards)
          .forEach(({ r }) => {
            const mixes = L.sections.filter((y) => y.cardOf && y.cardOf === r.ids[r.ids.length - 1] && (!y.when || y.shown));
            const src = (ps) => [].concat(...ps.groups.map((g, gi) => g.filter((p) => !p.no).map((p) => ({ r: p, gi }))));
            const item = (label, ps) => ({ label, count: ps ? 1 : r.qty || 1, parts: ps ? src(ps).map((x) => partNode(x.r, x.gi)) : [], ordered: !!ps, done: !!r.done, key: r, src: ps ? src(ps) : [] });
            rowsShown.push(r);
            if (mixes.length > 1 && (r.qty || 1) === mixes.length) mixes.forEach((ps) => items.push(item(rowText(text6(oneOf(r), rowHide(r))), ps)));
            else {
              const it = item(rowText(text6(r.line, rowHide(r))), mixes[0] || null);
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
      cards.push({ key: `${L.dish || 0}:${mission.who}`, who: mission.who, L, rows: rowsShown, own: true, data: { person: person(mission.who), headline, items, done } });
    });
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
    box.innerHTML = "";
    if (!OC) return [];
    const folds = (mission.folds = mission.folds || {});
    // a station's own person cards (Nani's chop card, design system 13), above the order's, sidebar only
    const extra = big ? [] : (mission.extra || []).map((x) => {
      const st = folds[`x:${x.key}`] || (folds[`x:${x.key}`] = {});
      const e = OC.card(x.data, { fold: st, closed: !!x.closed, foldAfter: 700 / (Cook.speed || 1), onEl: (key, el) => addEl(map, key, el) });
      e.dataset.extra = x.key;
      box.appendChild(e);
      return e;
    });
    const closed = mission.closed || null;
    return extra.concat(orderCards().map((c) => {
      const el = OC.card(c.data, {
        big,
        fold: big ? null : folds[c.key] || (folds[c.key] = {}),
        // the phase fold / a start-folded card (M.closeCards): face + headline; a peek may cost a hint
        closed: !big && !!closed && (!closed.who || closed.who === c.who),
        onPeek: closed && closed.peek ? () => Cook.onHelp && Cook.onHelp("hint", { ids: [] }) : null,
        peekMs: 3500 / (Cook.speed || 1),
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
      el._parts = () => {
        const head = c.data.headline && c.data.headline.key;
        const line = c.who && c.L && c.L.sections.some((s) => s.for === c.who)
          ? Order().sentence(head, c.rows, { join: Order().joinOf(c.L) })
          : Order().speech([Object.assign({}, c.L, { head: head || null, sections: c.L.sections.filter((s) => !s.when || s.shown).map((s) => Object.assign({}, s, { when: null })) })]);
        return line.parts.map((l) => ({ row: l.row, line: l, els: elsOf(l, map).filter((e) => el.contains(e)) }));
      };
      el._rows = c.rows;
      box.appendChild(el);
      return el;
    }));
  }
  /**
   * The phase fold (design system 13) and the start-folded card (14a): the order's cards fold to face +
   * headline (no check) until opened again. opts.peek: a tap opens a card for a moment and counts as a
   * hint (the light-bulb badge); without it a tap opens and closes it freely. opts.who: only that person's card.
   * M.closeCards(false) opens them again.
   */
  M.closeCards = function (on, opts = {}) {
    if (!mission) return;
    mission.closed = on ? { peek: !!opts.peek, who: opts.who || null } : null;
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
    list.push({ key, data, closed: !!opts.closed });
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
    const hidden = (c._rows || []).filter(rowHidden);
    if (hidden.length && Cook.onHelp && !rows) Cook.onHelp("replay", { ids: [].concat(...hidden.map((r) => r.ids)) });
    const parts = rows ? c._parts().filter((p, i) => i === 0 || rows.some((r) => p.row === r)) : c._parts();
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
    const c = [...document.querySelectorAll("#mission .oc-card")].find((x) => x.dataset.who === who);
    if (!c || !c._parts || $("#mission").classList.contains("hidden")) return false;
    if (c.scrollIntoView) c.scrollIntoView({ block: "nearest" });
    await sayCardEl(c, rows || null);
    return true;
  };
  function renderOrder6() {
    const box = $("#mission .m-order");
    drawCards(box, sideEls);
    // the request card steps back: its cards are the order card component's (the shared head goes)
    $("#mission").classList.add("people");
    $("#side").classList.toggle("english", !!mission.english);
    if (introOpen()) renderIntro6();
  }
  function renderIntro6() {
    const box = intro().querySelector(".ic-order");
    drawCards(box, introEls, { big: true });
    const card = intro().querySelector(".ic-card");
    card.classList.add("people");
    // a long order: the pop-up lays its items out in two columns rather than running off the screen
    card.classList.toggle("wide", box.querySelectorAll(".oc-row").length > 8);
  }
  /** The order card's own speaker: the whole order, read along on the card. */
  M.sayCard = function () {
    if (!mission || introOpen()) return;
    const btns = [...document.querySelectorAll("#mission .oc-face")]; // the face is the replay button
    if (mission.ladders.some(anyHidden) && Cook.onHelp) Cook.onHelp("replay");
    btns.forEach((b) => b.classList.add("on"));
    return readAlong(partsOf(mission.line, sideEls))
      .catch(() => {})
      .then(() => btns.forEach((b) => b.classList.remove("on")));
  };

  /* ---- the light bulb ---- */
  let bulbTimer = null;
  UI.bulbOff = function () {
    clearTimeout(bulbTimer);
    bulbTimer = null;
    const b = $("#btn-bulb");
    if (b) b.classList.remove("on");
    const side = $("#side");
    if (side) side.classList.remove("english");
    if (mission && mission.english) {
      mission.english = false;
      renderOrder();
    }
  };
  UI.bulbMs = () => {
    const ms = ((Cook.data && Cook.data.calm) || {}).bulbMs || [5000, 3000, 2000, 1000];
    const lv = mission ? mission.level : orderLevel();
    return ms[Math.min(ms.length, Math.max(1, lv)) - 1];
  };
  UI.bulb = function () {
    const b = $("#btn-bulb");
    if (!b || bulbTimer) return;
    Cook.sfx.click();
    const ms = UI.bulbMs();
    b.style.setProperty("--bulb-ms", `${ms}ms`);
    b.classList.remove("on");
    void b.offsetWidth;
    b.classList.add("on");
    $("#side").classList.add("english");
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
    bulbTimer = setTimeout(() => UI.bulbOff(), ms / Cook.speed);
  };


  const ladderFor = (dish) => (mission ? mission.ladders.find((L) => L.dish === dish) || mission.ladders[0] : null);
  function markDone(r) {
    r.done = true;
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
    if (isCount(r) && !opts.close) return r;
    if (r.got >= (r.need || 1) || isCount(r)) markDone(r);
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
    if (H && !H.done && !H.rec && (opts.head || (opts.all && !opts.for) || (!rows.length && want.length && (H.ids || []).some((id) => want.includes(id))))) rows.push(H);
    rows.forEach(markDone);
    if (rows.length) {
      settle(L);
      renderOrder();
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
  M.missItem = function (id, dish = 0, { no = null, counted = false, for: forWho = null, block = null } = {}) {
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
    return r;
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
    UI.bulbOff();
  };
  M.close = function () {
    stopReading();
    $("#mission").classList.add("hidden");
    $("#mission").classList.remove("arriving");
    intro().classList.add("hidden");
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
    const add = (id) => id && Cook.data.words[id] && !Cook.isPlaceholder(id) && !out.includes(id) && out.push(id);
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
    const look = (segs) => (segs || []).forEach((s) => s.w && s.lang === "k" && !form.has(s.w) && form.set(s.w, { kutchi: clean(s.w, s.t), check: !!s.check }));
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
        return `<button class="wr-pill ${w.state || "ok"}" type="button" data-w="${esc(w.id)}" aria-label="Hear it"><span class="wr-say">${ICON.speaker}</span><b class="${ph ? "ph" : ""}">${esc(Cook.display(w.id))}</b><span class="wr-en">${esc(Cook.english(w.id))}</span>${tag}</button>`;
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
    return Cook.data.words[id] ? Cook.Art.wordUrl(id) : null;
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
      tally.forEach((t, key) => kt.counts[key] !== t.n && kt.set(key, t.n, { icon: t.icon }));
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
  UI.count = function (n, { speak = true, id = "_", icon = null, state = null } = {}) {
    const prev = tally.get(id);
    tally.set(id, { n, icon: icon || (prev && prev.icon) || iconFor(id === "_" ? null : id, state) });
    drawTally();
    const el = $(`#count-badge .tl[data-k="${CSS.escape(id)}"]`);
    if (el) bumpEl(el); // (the shared tally bumps its own chip)
    // Counting aloud teaches the number words (stages 1-2). From stage 3
    // the count is silent, so you can't just stop when the sound matches
    // what you heard in the order.
    // 28 Sept (Zafar): the voice says the count AND the thing ("hakri dungri", "ba dungri"), the number
    // agreeing with the noun (hakro/hakri). A later level (3+) or Nani on mute stays silent.
    const lv = mission ? mission.level : orderLevel();
    // 29 Sept (Q7): counting is heard as you add at level 1 only (level 2: written; 3+: heard in the order);
    // chai's sugar keeps its own (level 2 too: it's the listening test there)
    const heard = lv <= 1 || (lv <= 2 && id === "cook-khun");
    if (speak && n >= 1 && n <= 5 && Cook.wordStage(`num-0${n}`) < 3 && heard && !UI.naniMuted()) queued(() => Lang.speak(tallyLine(n, id)));
  };
  /** "hakri dungri", "ba maani", "ba wadhi maani": the count and the thing, as the order says it. */
  function tallyLine(n, id) {
    const ws = id && id !== "_" ? String(id).split("+") : [];
    if (!ws.length || !ws.every((w) => Cook.data.words[w]) || ws.some((w) => Cook.isPlaceholder(w))) return { segs: Lang.num(n), en: String(n) };
    const parts = Lang.countParts(n, ws[ws.length - 1]);
    const at = parts.indexOf(ws[ws.length - 1]);
    parts.splice(at, 1, ...ws);
    return Lang.phrase(parts);
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
    b.style.left = `${p.x - st.left}px`;
    b.style.top = `${p.y - st.top}px`;
  }
  UI.tallyAt = function (pt) {
    tallyPt = pt || null;
    placeTally();
  };
  global.addEventListener("resize", () => tallyPt && placeTally());
  UI.hideCount = () => {
    tally.clear();
    drawTally();
  };
  let doneResolve = null;
  UI.done = function (opts = {}) {
    const b = $("#done-btn");
    b.classList.remove("hidden");
    b.classList.toggle("glow", !!opts.glow);
    return new Promise((resolve) => {
      doneResolve = resolve;
    });
  };
  UI.glowDone = (on) => $("#done-btn").classList.toggle("glow", on);
  /**
   * Wave 6: the big button between two jobs of one station ("Go to the
   * barbecue"), bottom right under the thumb. Resolves when it's pressed.
   */
  let goResolve = null;
  UI.go = function (label, opts = {}) {
    const b = $("#go-btn");
    if (!b) return Promise.resolve();
    (b.querySelector(".njg-next-t") || b.querySelector(".go-t")).textContent = label;
    b.classList.remove("hidden");
    b.classList.toggle("glow", !!opts.glow);
    return new Promise((resolve) => (goResolve = resolve));
  };
  UI.glowGo = (on) => $("#go-btn") && $("#go-btn").classList.toggle("glow", on);
  UI.hideGo = function () {
    if ($("#go-btn")) $("#go-btn").classList.add("hidden");
    goResolve = null;
  };
  UI.hideDone = function () {
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
    o.classList.toggle("title-mode", !!opts.title);
    const p = $("#panel");
    p.innerHTML = html;
    p.scrollTop = 0;
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

  UI.init = function () {
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
    document.addEventListener("pointerdown", () => Cook.unlockAudio(), { passive: true });
    // the "?": the goal pops out; any tap elsewhere puts it away
    on("#btn-help", () => {
      Cook.sfx.click();
      if (UI.helpOpen()) UI.closeHelp();
      else UI.openHelp();
    });
    document.addEventListener(
      "pointerdown",
      (ev) => {
        if (UI.helpOpen() && !ev.target.closest("#btn-help, #help-pop")) UI.closeHelp();
      },
      true
    );
    global.addEventListener("resize", () => UI.closeHelp());
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
    if (global.FitText) ["#side", "#intro"].forEach((sel) => $(sel) && global.FitText.watch($(sel)));
    const replay = on("#mission .m-replay", () => {
      Cook.unlockAudio();
      UI.mission.replay();
    });
    if (replay) replay.innerHTML = ICON.replay;
  };
})(window);

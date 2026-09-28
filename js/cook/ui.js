/*
 * Cook with Nani: the HTML layer (Phase A).
 *
 *  - Word pills in three shapes (docs/cook-with-nani-phase-a-design.md s4):
 *    full [speaker | Kutchi | translate], choice (big, tappable) and the
 *    in-world item labels (drawn in Phaser, see stations.js).
 *  - The mission card: who ordered, the order as pills (words fade to dots
 *    as they're learned), three star cut-outs (ear, hand, lightning/tick)
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
   * Wave 6 (docs/UX-PRINCIPLES.md), for pages that opt in with <body class="w6">
   * (cook.html): the sidebar on the left, one card per thing with a fixed
   * shape, no per-line speaker, 👁 or translate (one light bulb at the top of
   * the sidebar instead; one speaker per card, reading it with read-along).
   * Other pages that share this file keep the Wave 5 card.
   */
  UI.w6 = () => document.body.classList.contains("w6");

  /**
   * Star icons come from the game mode's star set (data.star_sets), so each
   * mode supplies its own: in Cook the "cooked well" star is a chef's hat,
   * in Find it (planned) a magnifying glass. k: "ear" | "hand" | "third".
   */
  UI.starInfo = function (k, mode = Cook.save.mode) {
    const sets = Cook.data.star_sets || {};
    const set = sets[Cook.gameMode || "cook"] || sets.cook || {};
    const key = k === "third" ? (mode === "busy" ? "busy" : "relaxed") : k;
    const fallback = { ear: "ear", hand: "hand", busy: "bolt", relaxed: "tick" }[key];
    return Object.assign({ icon: fallback, name: key, tip: "" }, set[key] || {});
  };
  UI.starIcon = (k, mode) => ICON[UI.starInfo(k, mode).icon] || ICON.tick;

  /* ---------------- geometry: world (1600x900) -> page ---------------- */
  UI.worldToStage = function (x, y) {
    const canvas = document.querySelector("#game canvas");
    const stage = $("#stage").getBoundingClientRect();
    if (!canvas) return { x, y, s: 1, stage };
    const r = canvas.getBoundingClientRect();
    const s = r.width / 1600;
    return { x: r.left - stage.left + x * s, y: r.top - stage.top + y * s, s, rect: r, stage };
  };
  UI.worldToScreen = function (x, y) {
    const canvas = document.querySelector("#game canvas");
    const r = canvas.getBoundingClientRect();
    const s = r.width / 1600;
    return { x: r.left + x * s, y: r.top + y * s };
  };

  /* ---------------- word pills ---------------- */
  /**
   * A pill for a line. opts: {shape: "full" | "choice", hide: fn(wordId),
   * noTranslate, onHint}. The speaker plays the line; translate shows the
   * English (and counts as help, for the "no help" star).
   */
  UI.pill = function (line, opts = {}) {
    const el = document.createElement("span");
    el.className = `wp wp-${opts.shape || "full"}`;
    const sayLine = opts.speakLine || line;
    const voice = Lang.hasVoice(sayLine);
    const hideTr = opts.noTranslate || !line.en;
    el.innerHTML = `${voice ? `<button class="wp-say" type="button" aria-label="Hear it">${ICON.speaker}</button>` : opts.reserveSay ? `<span class="wp-gap"></span>` : ""}<span class="wp-text">${Lang.html(line, opts)}</span>${
      opts.onReveal ? `<button class="wp-eye" type="button" aria-label="Show the word">${ICON.eye}</button>` : ""
    }${hideTr ? "" : `<button class="wp-tr" type="button" aria-label="Show in English">${ICON.translate}</button>`}<span class="wp-en hidden">${esc(line.en || "")}</span>`;
    const say = el.querySelector(".wp-say");
    if (say)
      say.addEventListener("click", (ev) => {
        ev.stopPropagation();
        Cook.unlockAudio();
        say.classList.add("on");
        if (opts.onHear) opts.onHear();
        Lang.speak(sayLine).then(() => say.classList.remove("on"));
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
        // that's the answer (costs the ear star); otherwise it's help.
        if (opts.onTranslate) opts.onTranslate();
        else if (Cook.onHelp) Cook.onHelp(line.segs.some((s) => s.w) ? "translate" : "help", { line });
      });
    return el;
  };

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
    slot.appendChild(UI.pill(line, { hide: opts.hide, onHear: opts.onHear, noTranslate: UI.w6() }));
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
      const talk = voice ? Promise.all([Lang.speak(line), Cook.wait(700)]) : Cook.wait(opts.ms || Cook.readMs(Lang.plain(line)));
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
   * Wave 6b (docs/UX-PRINCIPLES.md 13): the instruction card is the master;
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
      guide.set(Lang.html(line, { hide: opts.hide }));
      guide.talk(true);
    } else if (!onCard) {
      cap.innerHTML = `<span class="vc-say">${ICON.speaker}</span><span class="vc-t">${Lang.html(line, { hide: opts.hide })}</span>`;
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
      const talk = voice ? Promise.all([Lang.speak(line), Cook.wait(700)]) : Cook.wait(opts.ms || Math.min(2600, Cook.readMs(Lang.plain(line))));
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
      guide.set(Lang.html(guideLine));
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
      face: Cook.v("assets/cook/characters/nani-badge.webp"),
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
        Lang.speak(line)
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
   * answer, so they cost the ear star; from word stage 3 the right
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
   * shown as text; once they're dots, replaying costs the no-help star.
   * 👁 shows the Kutchi (never English) and costs the ear star; so does
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
  const faceUrl = (who) => Cook.v(`assets/cook/characters/${who}-badge.webp`);
  UI.faceUrl = faceUrl;
  M.open = function ({ who, name, ladders, lines, line, busy, how }) {
    if (!ladders) ladders = [Order().fromLines(lines || [])];
    const seqWord = Lang.frames().seq_word;
    mission = {
      who,
      name,
      ladders,
      line: line || (lines ? Lang.join(lines) : Order().speech(ladders)),
      stars: { ear: "pending", hand: "pending", third: "pending" },
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
  function renderStars() {
    const box = $("#mission .m-stars");
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
          // they're dots, a replay is help (the no-help star)
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
  /** A/En: English under every row of the order (for rows still to do, that's the answer: the ear star). */
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
    const say = el.querySelector(".ic-say"); // Sidebar v2: the face is the replay button
    renderIntro();
    $("#mission").classList.add("arriving");
    el.classList.remove("hidden");
    UI.closeHelp();
    const token = Cook.run;
    let done;
    const tapped = new Promise((resolve) => (done = resolve));
    const onTap = (ev) => {
      if (ev.target.closest(".ic-say")) return;
      done();
    };
    const onSay = (ev) => {
      ev.stopPropagation();
      Cook.unlockAudio();
      say.classList.add("on");
      if (m.ladders.some(anyHidden) && Cook.onHelp) Cook.onHelp("replay");
      (UI.w6() ? readAlong(partsOf(m.line, introEls)) : Lang.speak(m.line)).then(() => say.classList.remove("on"));
    };
    el.addEventListener("click", onTap);
    say.addEventListener("click", onSay);
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
      say.removeEventListener("click", onSay);
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
   * docs/UX-PRINCIPLES.md 1, 3 and 4. The order card and the request card
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
   * its words are dots is help (the no-help star), as before.
   * The light bulb at the top of the sidebar flips the words to English for
   * a few seconds (data.calm.bulbMs by level: 5, 3, 2, 1 s); for rows still
   * to do that's the answer, so it costs the ear star, like A/En did.
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
    return parts.map((l) => ({ line: l, els: (l.row && map.get(l.row)) || [] }));
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
  /** A card's speaker: read these parts, and count it as help once they're dots. */
  function cardSay(btn, parts, rows) {
    if (!btn.classList.contains("face-say")) btn.innerHTML = ICON.speaker;
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      Cook.unlockAudio();
      const hidden = rows.filter(rowHidden);
      if (hidden.length && Cook.onHelp) Cook.onHelp("replay", { ids: [].concat(...hidden.map((r) => r.ids)) });
      btn.classList.add("on");
      readAlong(parts())
        .catch(() => {})
        .then(() => btn.classList.remove("on"));
    });
    return btn;
  }
  /** The words of a line as the card shows them: Kutchi (dots when known), or English while the bulb is on. */
  const text6 = (line, hide) => (mission && mission.english && line.en ? `<span class="en6">${esc(line.en)}</span>` : Lang.html(line, { hide }));
  /*
   * 28 Sept (Zafar, docs/cook-ui-feedback-2026-09-28.md 1-2): one row format everywhere, on the
   * request pop-up and the sidebar card alike. No pictures (they'd give the Kutchi away), no dots:
   *   [word ........................ tick]
   * A row that's done gets a flat gold outline and a small flat gold check on the right (Sidebar v3). In an ordered job
   * (a skewer's pieces, the chaat layers, the tadka) the row to do next has a light grey band and
   * one thin line runs down the left joining the rows (the same component for every ordered job, no
   * numbers, no arrows); an any-order list (the pantry) has no "next". Rows still to do are plain:
   * no empty circles. Rows tick when that step closes (UX 11); nothing goes red until the review.
   */
  // Sidebar v3 (28 Sept, late): a small flat gold check (a gold disc, a white check), not the 3D tick art
  const CHECK = `<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#c99a2e"/><path d="M5.6 10.4 8.6 13.3 14.4 7.2" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const tickHtml = (on) => `<span class="tk" aria-hidden="true">${on ? CHECK : ""}</span>`;
  function row6(map, { r }, { next = false, key = null } = {}) {
    const li = document.createElement("div");
    li.className = ["lr", "r6", r.no ? "no" : "", r.done ? "done" : "", next && !r.done ? "next" : "", r.miss && r.done === false && mission && mission.stamped ? "miss" : ""].filter(Boolean).join(" ");
    li.innerHTML = `<span class="lt fit">${text6(r.line, rowHide(r))}</span>${tickHtml(r.done)}`;
    if (typeof r.decorate === "function") r.decorate(li);
    addEl(map, key || r, li);
    return li;
  }
  /** Rows into a list; an ordered one gets the sequence line and its next step marked. */
  function rowList(map, rows, { seq = false, line = false, at = 0 } = {}) {
    const list = document.createElement("div");
    list.className = ["lrows", seq || line ? "lseq" : ""].filter(Boolean).join(" ");
    list.dataset.fitGroup = "";
    // the next step: the first group with something still to do (the whole group, if it's any-order),
    // at or after `at` steps taken (a station whose rows tick later, at the check, moves it on: M.advance)
    let open = null;
    if (seq) {
      const steps = [];
      rows.filter((x) => !x.r.no).forEach((x) => steps.push(...Array(Math.max(1, x.r.need || 1)).fill(x)));
      open = steps.slice(at).find((x) => !x.r.done) || null;
    }
    rows.forEach((x) => list.appendChild(row6(map, x, { next: !!open && x.gi === open.gi && !x.r.no, key: x.key || null })));
    return list;
  }
  /** The card's title words: a row's words without its number ("lakri gos", "wadhi maani"). */
  const titleOf = (r) => {
    const parts = (r.parts || r.ids).filter((p) => typeof p === "string");
    return Lang.phrase(parts);
  };
  /**
   * Things made several times (skewers, maani): the kind as it was said, once ("ba lakri gos",
   * with its speaker), then a mini card per unit (28 Sept, Zafar: "two skewers" = two mini cards).
   * A mini card is one row ("lakri gos") that ticks when that one is made; a mixed skewer's card
   * lists its pieces in order, as an ordered job (the sequence line, the next piece marked).
   */
  function unitGroup(map, r, pieces, sum) {
    const g = document.createElement("div");
    g.className = ["ugroup", r.done ? "done" : ""].filter(Boolean).join(" ");
    // Sidebar v2 (28 Sept evening): the kind as it was said ("hakri lakri mixed") is the card's summary,
    // under its headline, one line each; the group boxes themselves carry no label
    const head = document.createElement("span");
    head.className = ["sum-line", "fit", r.done ? "done" : ""].filter(Boolean).join(" ");
    head.innerHTML = text6(r.line, rowHide(r));
    addEl(map, r, head);
    if (sum) sum.appendChild(head);
    const grid = document.createElement("div");
    grid.className = "icards";
    const n = Math.max(1, r.qty || 1);
    const units = r.units || [];
    const unitDone = (u) => !!(r.done || units[u]);
    // which unit's card is being made now (its next piece is marked)
    const now = pieces ? [...Array(n).keys()].find((u) => !unitDone(u)) : -1;
    const seen = new Map();
    const pieceDone = pieces
      ? pieces.map((p) => {
          const k = seen.get(p) || 0;
          seen.set(p, k + 1);
          return !!(p.done || k < (p.got || 0));
        })
      : [];
    const cards = [];
    for (let u = 0; u < n; u++) {
      const c = document.createElement("div");
      c.className = ["icard", "unit", pieces ? "named" : "", unitDone(u) ? "done" : ""].filter(Boolean).join(" ");
      if (pieces) {
        const list = document.createElement("div");
        list.className = "lrows lseq";
        list.dataset.fitGroup = "";
        const done = (k) => unitDone(u) || (u === now && u === 0 && pieceDone[k]);
        const next = u === now ? pieces.findIndex((p, k) => !done(k)) : -1;
        pieces.forEach((p, k) => {
          const li = row6(u === 0 ? map : new Map(), { r: Object.assign(Object.create(p), { done: done(k) }) }, { next: k === next, key: p });
          list.appendChild(li);
        });
        c.appendChild(list);
      } else {
        // the mini card names the kind ("gos", "wadhi maani"): the count and "lakri" are in the title above
        const one = { line: Lang.phrase(r.ids), done: unitDone(u), ids: r.ids, no: false };
        c.appendChild(row6(new Map(), { r: Object.assign(Object.create(r), one) }));
      }
      cards.push(c);
      grid.appendChild(c);
    }
    g.appendChild(grid);
    return g;
  }
  /**
   * Design system 10 (Zafar, 28 Sept, late): a person's card in the sidebar collapses once all its pills are
   * done: it animates up into one line (face + headline + a small flat gold check), a beat after the last
   * pill ticks so that tick is seen. Tapping a collapsed card re-opens it (and tapping it again folds it).
   * The cards are redrawn often, so the state lives on the order (mission.folds), keyed by dish and person.
   */
  const FOLD_AFTER = 700;
  function foldCard(c, key, done) {
    if (!mission) return;
    const folds = (mission.folds = mission.folds || {});
    const st = folds[key] || (folds[key] = { doneAt: 0, open: false });
    c.dataset.fold = key;
    if (!done) {
      st.doneAt = 0;
      st.open = false;
      return;
    }
    if (!st.doneAt) st.doneAt = Date.now();
    const due = st.doneAt + FOLD_AFTER / (Cook.speed || 1) - Date.now();
    c.classList.add("foldable");
    if (st.open) c.classList.add("reopened");
    else if (due <= 0) c.classList.add("folded", "still");
    else
      setTimeout(() => {
        // the card as it is now (it may have been redrawn since)
        const cur = [...document.querySelectorAll("#mission .icard.person")].find((x) => x.dataset.fold === key);
        if (cur && !st.open && cur.classList.contains("done")) cur.classList.add("folded");
      }, due);
    c.addEventListener("click", (e) => {
      if (e.target.closest(".face-say")) return; // the face is replay
      st.open = !st.open;
      c.classList.remove("still");
      c.classList.toggle("folded", !st.open);
      c.classList.toggle("reopened", st.open);
    });
  }
  /**
   * One person's card (a cup on the Chai tray). Sidebar v3 (28 Sept, late; docs/cook-ui-feedback-2026-09-28.md 10):
   * one white card per person: their face (= replay), the short headline ("Muke chai khape."), then
   * their pills. No "{name} lai." sub-header: the card is theirs. A second person has their own card.
   */
  function personCard(map, L, s, rows) {
    const c = document.createElement("div");
    const allDone = rows.every((x) => x.r.done);
    c.className = ["icard", "person", allDone ? "done" : ""].filter(Boolean).join(" ");
    c.dataset.who = s.for;
    const head = L.head || null;
    c.innerHTML = `<div class="pc-head"><button class="card-say face-say" type="button" aria-label="Hear it again"><img class="lface" src="${faceUrl(esc(s.for))}" alt=""><span class="say-badge" aria-hidden="true"></span></button>${head ? `<div class="ic-title md-text fit">${text6(head.line, rowHide(head))}</div>` : ""}<span class="pc-tk">${tickHtml(true)}</span></div><div class="pc-body"><div class="pc-in"></div></div>`;
    const title = c.querySelector(".ic-title");
    if (head && title) addEl(map, head, title);
    // the card's fixed slots, in order (milk, sugar, which chai); an empty slot draws nothing (no empty circles)
    const placed = rows.slice().sort((a, b) => Cook.Order.slotOf(L, a.r) - Cook.Order.slotOf(L, b.r));
    c.querySelector(".pc-in").appendChild(rowList(map, placed));
    if (map === sideEls) foldCard(c, `${L.dish || 0}:${s.for}`, allDone);
    const parts = () => (head && title ? [{ line: head.line, els: [title] }] : []).concat(placed.map((x) => ({ row: x.r, line: x.r.no || !x.r.said ? x.r.line : x.r.said, els: (map.get(x.r) || []).filter((e) => c.contains(e)) })));
    c._parts = parts;
    cardSay(c.querySelector(".pc-head .face-say"), parts, rows.map((x) => x.r));
    return c;
  }
  /** Does this order have person cards (the Chai tray)? Then each person's card is the card (no shared head). */
  const hasPeople = () => !!mission && mission.ladders.some((L) => L.sections.some((s) => s.for && (!s.when || s.shown)));
  /**
   * Sidebar v3: a person says their line from their own card in the sidebar (it lights up as it's
   * read, their face's badge glows), never from a second, full-sentence card below it. rows: only
   * these (a recast). Resolves when it's said; false when there's no card for them.
   */
  M.sayPerson = async function (who, rows) {
    const c = [...document.querySelectorAll("#mission .icard.person")].find((x) => x.dataset.who === who);
    if (!c || !c._parts || $("#mission").classList.contains("hidden")) return false;
    const face = c.querySelector(".face-say");
    const parts = rows ? c._parts().filter((p, i) => i === 0 || rows.some((r) => p.row === r)) : c._parts();
    c.classList.add("speaking");
    if (face) face.classList.add("on");
    if (c.scrollIntoView) c.scrollIntoView({ block: "nearest" });
    try {
      await readAlong(parts);
    } finally {
      c.classList.remove("speaking");
      if (face) face.classList.remove("on");
    }
    return true;
  };
  /** A ladder's blocks into `box`: sections as rows, person cards and unit cards. */
  function blocks6(box, map, { big = false, sum = null } = {}) {
    map.clear();
    if (sum) sum.innerHTML = "";
    shape().forEach(({ L, sections }, li) => {
      const lad = document.createElement("div");
      lad.className = "ladder";
      // a later dish's line ("Ne samosa."); the first dish is the card's head
      if (L.head && li > 0) {
        const h = document.createElement("div");
        h.className = ["lr", "r6", "head", L.head.done ? "done" : ""].filter(Boolean).join(" ");
        h.innerHTML = `<span class="lt">${text6(L.head.line, rowHide(L.head))}</span>`;
        addEl(map, L.head, h);
        lad.appendChild(h);
      }
      const pieceSec = (id) => L.sections.find((x) => x.cardOf === id);
      sections.forEach(({ s, rows, seq, plain }) => {
        if (s.cardOf) return; // drawn on its card
        if (s.for) return lad.appendChild(personCard(map, L, s, rows));
        const sec = document.createElement("div");
        sec.className = ["lsec", s.when ? "late" : ""].filter(Boolean).join(" ");
        const cards = rows.filter((x) => x.r.cards);
        const flat = rows.filter((x) => !x.r.cards);
        if (flat.length) sec.appendChild(rowList(map, flat, { seq, line: plain && flat.length > 1, at: s.at || 0 }));
        cards.forEach((x) => {
          const ps = pieceSec(x.r.ids[x.r.ids.length - 1]);
          const pieces = ps ? [].concat(...ps.groups).filter((p) => !p.no).flatMap((p) => Array(p.need || 1).fill(p)) : null;
          // Sidebar v2: every skewer (or maani) is a group box, one of a kind included; the kinds are the summary
          sec.appendChild(unitGroup(map, x.r, pieces, sum));
        });
        lad.appendChild(sec);
      });
      box.appendChild(lad);
    });
    // Sidebar v2: alternate group boxes are tinted differently, so each skewer or cup stands apart
    box.querySelectorAll(".icard:not(.person)").forEach((c, i) => c.classList.toggle("tint-b", i % 2 === 1));
  }
  function renderOrder6() {
    const box = $("#mission .m-order");
    box.innerHTML = "";
    blocks6(box, sideEls, { sum: $("#mission .m-sum") });
    renderDish6();
    // Sidebar v3: one white card per person; the shared head goes (each person's card has the headline)
    $("#mission").classList.toggle("people", hasPeople());
    $("#side").classList.toggle("english", !!mission.english);
    if (introOpen()) renderIntro6();
  }
  /** The headline (the overall request) as the card's head shows it; a line still to record is flagged. */
  function headline6(r) {
    if (!r) return `<span class="md-text fit">${esc(mission.name)}</span>`;
    if (r.rec) return `<span class="md-text rec"><span class="md-line fit">${esc(r.line.en || Lang.plain(r.line))}</span><small class="md-rec">to record</small></span>`;
    return `<span class="md-text fit">${text6(r.line, rowHide(r))}</span>`;
  }
  function renderDish6() {
    const box = $("#mission .m-dish");
    const L = mission.ladders[0];
    const r = L && L.head;
    box.innerHTML = headline6(r);
    if (r) {
      sideEls.delete(r);
      addEl(sideEls, r, box);
    }
  }
  function renderIntro6() {
    const box = intro().querySelector(".ic-order");
    box.innerHTML = "";
    blocks6(box, introEls, { big: true, sum: intro().querySelector(".m-sum") });
    // a long order: the pop-up lays its group boxes out in two columns rather than running off the screen
    intro().querySelector(".ic-card").classList.toggle("wide", box.querySelectorAll(".r6").length > 8);
    intro().querySelector(".ic-card").classList.toggle("people", hasPeople());
    // 28 Sept: the headline sits in the pop-up's head, beside the face (no name)
    const dish = intro().querySelector(".ic-dish");
    const L = mission.ladders[0];
    if (dish) {
      dish.innerHTML = headline6(L && L.head);
      if (L && L.head) addEl(introEls, L.head, dish);
    }
  }
  /** The order card's own speaker: the whole order, read along on the card. */
  M.sayCard = function () {
    if (!mission || introOpen()) return;
    const btn = $("#mission .m-ring"); // Sidebar v2: the face is the replay button
    if (mission.ladders.some(anyHidden) && Cook.onHelp) Cook.onHelp("replay");
    if (btn) btn.classList.add("on");
    return readAlong(partsOf(mission.line, sideEls))
      .catch(() => {})
      .then(() => btn && btn.classList.remove("on"));
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
      // English for rows still to do is the answer: the ear star (Cook.onHelp "translate")
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
  /** When every step of a section is done, its "no X" rows are done too (unless one was broken). */
  function settle(L) {
    L.sections.forEach((s) => {
      const rows = [].concat(...s.groups);
      if (rows.filter((r) => !r.no).every((r) => r.done)) rows.filter((r) => r.no && !r.miss).forEach(markDone);
    });
  }
  /**
   * A count row ("ba dungri", "trae maani"): it ticks when its step closes
   * (the item is put down, finished or served), never the moment the number
   * is reached, so a tick can't give the count away (UX 11, agreed 26 Sept).
   */
  const isCount = (r) => !r.head && !r.no && ((r.parts || []).some((p) => typeof p === "number") || (!r.list && (r.need || 1) > 1));
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
      .filter((r) => !r.done && (opts.no ? r.no : !r.no) && (!opts.for || r.for === opts.for));
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
      .filter((r) => !r.done && !r.head && (!opts.for || r.for === opts.for) && (opts.all || r.ids.some((id) => want.includes(id))));
    rows.forEach(markDone);
    if (rows.length) {
      settle(L);
      renderOrder();
    }
    return rows;
  };
  /** Tick the i-th piece of the dish's sequence (a mixed skewer's pieces): that row, never another row with the same word. */
  M.tickUnit = function (i, dish = 0) {
    const L = ladderFor(dish);
    const s = L && L.sections.find((x) => x.seq);
    if (!s) return null;
    const units = [];
    s.groups.forEach((g) => g.forEach((r) => !r.no && units.push(...Array(r.need || 1).fill(r))));
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
    const s = L.sections.find((x) => x.seq);
    if (!s) return null;
    const units = [];
    s.groups.forEach((g) => g.forEach((r) => !r.no && r.ids.forEach((id) => units.push(...Array(r.need || 1).fill(id)))));
    return units[i] || null;
  };
  /** Something went wrong for this item (a word id, or a compound kind's ids): mark its row (shown on the result card). */
  M.missItem = function (id, dish = 0, { no = null, counted = false, for: forWho = null } = {}) {
    const L = ladderFor(dish);
    if (!L) return null;
    const want = [].concat(id);
    const has = (x) => want.every((w) => x.ids.includes(w));
    const rows = Order()
      .rows(L, { all: true })
      .filter((r) => !forWho || r.for === forWho);
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
  /** state: "earned" | "lost" | "pending" */
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

  /* Busy: the customer's patience as a ring round their face, and the
     lightning star drains with it (grey once it's too low to win). */
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
  // Wave 5: no coins/stars counter in the sidebar any more (pocket money is
  // on the title screen and the day's summary); kept so callers needn't care
  UI.setCoins = () => {};
  UI.setStars = () => {};
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
   * Wave 6b (docs/UX-PRINCIPLES.md 11): a small tally in the top-right
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
  function drawTally() {
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
    if (el) bumpEl(el);
    // Counting aloud teaches the number words (stages 1-2). From stage 3
    // the count is silent, so you can't just stop when the sound matches
    // what you heard in the order.
    // 28 Sept (Zafar): the voice says the count AND the thing ("hakri dungri", "ba dungri"), the number
    // agreeing with the noun (hakro/hakri). A later level (3+) or Nani on mute stays silent.
    const lv = mission ? mission.level : orderLevel();
    if (speak && n >= 1 && n <= 5 && Cook.wordStage(`num-0${n}`) < 3 && lv <= 2 && !UI.naniMuted()) Lang.speak(tallyLine(n, id));
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
    b.querySelector(".go-t").textContent = label;
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
    on("#go-btn", () => {
      Cook.sfx.click();
      const r = goResolve;
      UI.hideGo();
      if (r) r();
    });
    on("#done-btn", () => {
      Cook.sfx.click();
      const r = doneResolve;
      UI.hideDone();
      if (r) r();
    });
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
        if (UI.helpOpen() && !ev.target.closest("#btn-help")) UI.closeHelp();
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

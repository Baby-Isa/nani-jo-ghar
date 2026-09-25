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
  UI.ICON = ICON;

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
    slot.appendChild(UI.pill(line, { hide: opts.hide, onHear: opts.onHear }));
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
      const voice = !opts.silent && Lang.hasVoice(line);
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
    // above the button, its right edge on the button's right edge (so it opens towards the picture)
    const left = Cook.clamp(b.right - w, 8, vw - w - 8);
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
    box.querySelector(".pm-say").appendChild(UI.pill(line, { hide: opts.hide, onHear: opts.onHear, onTranslate: () => Cook.onHelp && Cook.onHelp("translate", { ids: [want], passMe: true }) }));
    const tray = box.querySelector(".pm-tray");
    tray.innerHTML = "";
    card().classList.add("hidden");
    box.classList.remove("hidden", "leaving");
    box.classList.toggle("busy", Cook.save.mode === "busy");
    let misses = 0;
    Lang.speak(line);
    return new Promise((resolve) => {
      Cook.shuffle(options).forEach((id) => {
        const b = document.createElement("div");
        b.className = "pm-item";
        b.dataset.id = id;
        b.setAttribute("role", "button");
        b.setAttribute("aria-label", "This one");
        const voice = Lang.hasVoice(Lang.wordLine(id));
        b.innerHTML = `<img src="${Cook.Art.wordUrl(id)}" alt="">${voice ? `<button class="wp-say" type="button" aria-label="Hear its name">${ICON.speaker}</button>` : ""}`;
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
          if (id === want) {
            b.classList.add("right");
            Cook.sfx.right();
            if (Cook.expect && String(Cook.expect.selector || "").startsWith("#passme")) Cook.expect = null;
            setTimeout(() => {
              box.classList.add("leaving");
              setTimeout(() => {
                box.classList.add("hidden");
                UI.say(Lang.line("thanks"), { badge: true }, { ms: 900 }).catch(() => {});
                resolve({ misses });
              }, 300);
            }, 450);
          } else {
            misses++;
            b.classList.remove("wrong");
            void b.offsetWidth;
            b.classList.add("wrong");
            Cook.sfx.soft();
            Lang.speak(line);
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
  const faceUrl = (who) => (who === "nani" ? "assets/cook/characters/nani-badge.webp" : `assets/cook/characters/${who}-badge.webp`);
  UI.faceUrl = faceUrl;
  M.open = function ({ who, name, ladders, lines, line, busy }) {
    if (!ladders) ladders = [Order().fromLines(lines || [])];
    const seqWord = Lang.frames().seq_word;
    mission = {
      who,
      name,
      ladders,
      line: line || (lines ? Lang.join(lines) : Order().speech(ladders)),
      stars: { ear: "pending", hand: "pending", third: "pending" },
      busy,
      plain: !!seqWord && Cook.wordStage(seqWord) >= 3,
      english: false,
    };
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
        .filter((s) => (!s.when || s.shown) && s.groups.some((g) => g.length))
        .map((s) => {
          const plain = mission.plain && !s.simple;
          const seq = !mission.plain && s.seq && s.groups.filter((g) => g.length).length > 1;
          const rows = [];
          s.groups.forEach((g, gi) => g.forEach((r) => rows.push({ r, gi, up: false, down: false })));
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
          return { s, rows };
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
    el.querySelector(".ic-name").textContent = m.name;
    const say = el.querySelector(".ic-say");
    say.innerHTML = ICON.speaker;
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
      Lang.speak(m.line).then(() => say.classList.remove("on"));
    };
    el.addEventListener("click", onTap);
    say.addEventListener("click", onSay);
    const prevExpect = Cook.expect;
    Cook.expect = { kind: "click", selector: "#intro .ic-card", intro: true };
    card.classList.add("talk");
    const voice = opts.speak !== false && Lang.hasVoice(m.line);
    const talk = (voice ? Promise.all([Lang.speak(m.line), Cook.wait(900)]) : Cook.wait(Cook.readMs(Lang.plain(m.line)))).then(() => {
      card.classList.remove("talk");
      return Cook.wait(opts.pause != null ? opts.pause : 1400);
    });
    try {
      await Promise.race([talk, tapped]);
    } finally {
      el.removeEventListener("click", onTap);
      say.removeEventListener("click", onSay);
      card.classList.remove("talk");
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
  /** Tick the first open row with this item on it. Returns the row, or null. */
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
    if (r.got >= (r.need || 1)) markDone(r);
    settle(L);
    renderOrder();
    return r;
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
      // a count that went wrong is the counted row ("bo maani"), not the dish's name ("maani")
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
    L.sections.forEach((s) => (s.shown = s.shown || !s.when));
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
        if (how === "hidden") s.shown = false;
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
  M.star = function (k, state) {
    if (!mission || mission.stars[k] === state) return;
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
  };
  M.close = function () {
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

  /* ---------------- count badge, done button, toast ---------------- */
  // Digit only, always: this is the running tally (how many so far), never
  // the target, and never the Kutchi number as text (that would show the
  // word in a second place at once; the audio still says it).
  UI.count = function (n, { speak = true } = {}) {
    const b = $("#count-badge");
    b.classList.remove("hidden");
    b.querySelector(".count-digit").textContent = n;
    bumpEl(b);
    // Counting aloud teaches the number words (stages 1-2). From stage 3
    // the count is digit-only and silent, so you can't just stop when the
    // sound matches what you heard in the order.
    if (speak && n >= 1 && n <= 5 && Cook.wordStage(`num-0${n}`) < 3) Lang.speak({ segs: Lang.num(n), en: String(n) });
  };
  UI.hideCount = () => $("#count-badge").classList.add("hidden");
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
    UI.hideGist();
    UI.hideCount();
    UI.hideDone();
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
    const replay = on("#mission .m-replay", () => {
      Cook.unlockAudio();
      UI.mission.replay();
    });
    if (replay) replay.innerHTML = ICON.replay;
  };
})(window);

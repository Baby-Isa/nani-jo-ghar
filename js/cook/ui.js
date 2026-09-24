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

  /* ---------------- gist (top of the picture) and how-to (sidebar) ---------------- */
  /*
   * The goal sits at the bottom of the sidebar. The first time you meet a
   * station (or while Nani is guiding) it's shown in full; after that it's
   * a small "?" that opens on tap, so it never pushes anything around.
   */
  UI.gist = function (text, opts = {}) {
    if (opts.top) {
      const g = $("#gist");
      g.textContent = text;
      g.classList.remove("hidden");
      return;
    }
    const h = $("#how");
    const stations = (Cook.data && Cook.data.stations) || {};
    const key = Object.keys(stations).find((k) => stations[k].goal === text);
    Cook.save.goalShown = Cook.save.goalShown || {};
    const guided = Cook.ctx && Cook.ctx.guided;
    const full = !key || guided || !Cook.save.goalShown[key] || opts.full;
    if (key) Cook.save.goalShown[key] = true;
    h.innerHTML = `<button class="how-q" type="button" aria-label="What do I do here?">?</button><span class="how-text"><b>Goal</b> ${esc(text)}</span>`;
    h.classList.toggle("collapsed", !full);
    h.classList.remove("hidden");
    h.querySelector(".how-q").addEventListener("click", () => h.classList.toggle("collapsed"));
  };
  UI.hideGist = () => {
    $("#gist").classList.add("hidden");
    $("#how").classList.add("hidden");
  };
  UI.hideTopGist = () => $("#gist").classList.add("hidden");

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

  /* ---------------- the mission card: the order ladder ---------------- */
  /*
   * The order is drawn as a ladder (js/cook/order.js builds it): one row
   * per thing, [speaker] word-or-••• [👁 reveal] [A/En translate]. A dot
   * per group; rows sharing a dot go in any order; dots joined by a dashed
   * line are steps in order. "No X" rows look like the rest apart from a
   * small ✕. Once "ne poi" is well known (word stage 3+) every row gets its
   * own dot on a plain line, so only the spoken "ne poi" tells you what
   * comes in order.
   *
   * Help on the card: the speaker is free while a row's words are still
   * shown as text; once they're dots, replaying costs the no-help star.
   * 👁 shows the Kutchi (never English) and costs the ear star; so does
   * translating a row before it's done.
   */
  const M = (UI.mission = {});
  let mission = null;
  const Order = () => Cook.Order;
  const hideWord = (id) => Cook.cardHidden(id) && Lang.wordHasVoice(id);
  M.open = function ({ who, name, ladders, lines, steps, busy }) {
    if (!ladders) ladders = [Order().fromLines(lines || [])];
    const seqWord = Lang.frames().seq_word;
    mission = { who, ladders, steps, stars: { ear: "pending", hand: "pending", third: "pending" }, stepAt: 0, busy, plain: !!seqWord && Cook.wordStage(seqWord) >= 3 };
    const el = $("#mission");
    el.classList.remove("hidden", "stamped");
    el.classList.toggle("busy", !!busy);
    el.querySelector(".m-face").src = who === "nani" ? "assets/cook/characters/nani-badge.webp" : `assets/cook/characters/${who}-badge.webp`;
    el.querySelector(".m-name").textContent = name;
    renderStars();
    renderOrder();
    renderSteps();
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
  function rowEl(L, r) {
    const li = document.createElement("div");
    li.className = ["lr", r.head ? "head" : "", r.no ? "no" : "", r.done ? "done" : ""].filter(Boolean).join(" ");
    const hidden = rowHidden(r);
    const speakLine = r.head ? Order().speech([L]) : null;
    li.appendChild(
      UI.pill(r.line, {
        hide: (id) => !r.done && !r.revealed && (r.dots || hideWord(id)),
        speakLine,
        reserveSay: true,
        onHear: () => {
          // hearing it again is fine while the words are on the card; once
          // they're dots, a replay is help (the no-help star)
          const rows = r.head ? Order().rows(L) : [r];
          if (rows.some(rowHidden) && Cook.onHelp) Cook.onHelp("replay", { ids: r.ids });
        },
        onReveal: hidden
          ? () => {
              r.revealed = true;
              if (Cook.onHelp) Cook.onHelp("reveal", { ids: r.ids });
              renderOrder();
            }
          : null,
        onTranslate: () => {
          if (!r.done && Cook.onHelp) Cook.onHelp("translate", { ids: r.ids });
          else if (Cook.onHelp) Cook.onHelp("help");
        },
      })
    );
    return li;
  }
  function renderOrder() {
    const box = $("#mission .m-order");
    box.innerHTML = "";
    mission.ladders.forEach((L) => {
      const lad = document.createElement("div");
      lad.className = "ladder";
      if (L.head) lad.appendChild(rowEl(L, L.head));
      L.sections.forEach((s) => {
        if (s.when && !s.shown) return;
        const sec = document.createElement("div");
        // plain: every row its own dot on a plain line (only the voice marks the order)
        const groups = mission.plain && !s.simple ? [].concat(...s.groups).map((r) => [r]) : s.groups;
        const nRows = groups.reduce((a, g) => a + g.length, 0);
        if (!nRows) return;
        sec.className = ["lsec", s.simple ? "simple" : "", !mission.plain && s.seq && groups.length > 1 ? "lseq" : "", mission.plain && groups.length > 1 ? "lplain" : "", s.when ? "late" : ""].filter(Boolean).join(" ");
        groups.forEach((g) => {
          const ge = document.createElement("div");
          ge.className = ["lg", g.length > 1 ? "multi" : "", g.every((r) => r.done) ? "done" : ""].filter(Boolean).join(" ");
          if (!s.simple) ge.insertAdjacentHTML("beforeend", `<i class="ldot"></i>`);
          g.forEach((r) => ge.appendChild(rowEl(L, r)));
          sec.appendChild(ge);
        });
        lad.appendChild(sec);
      });
      box.appendChild(lad);
    });
  }
  function renderSteps() {
    const box = $("#mission .m-steps");
    box.innerHTML = (mission.steps || []).map((s, i) => `<span class="mstep ${i < mission.stepAt ? "on" : i === mission.stepAt ? "now" : ""}">${esc(s)}</span>`).join("");
  }
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
  M.tickItem = function (id, dish = 0) {
    const L = ladderFor(dish);
    if (!L) return null;
    const rows = Order()
      .rows(L)
      .filter((r) => !r.done && !r.no);
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
  /** Something went wrong for this item: mark its row (shown on the result card). */
  M.missItem = function (id, dish = 0, { no = null, counted = false } = {}) {
    const L = ladderFor(dish);
    if (!L) return null;
    const rows = Order().rows(L, { all: true });
    const r =
      rows.find((x) => x.ids.includes(id) && (no == null || !!x.no === no) && !x.done) ||
      rows.find((x) => x.ids.includes(id) && (no == null || !!x.no === no)) ||
      (counted ? rows.find((x) => x.parts && x.parts.some((p) => typeof p === "number")) : null);
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
    if (found) renderOrder();
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
  M.isTarget = function (id) {
    if (!mission) return false;
    return mission.ladders.some((L) =>
      Order()
        .rows(L)
        .some((r) => !r.done && !r.no && r.ids.includes(id))
    );
  };
  M.step = function (i) {
    if (!mission) return;
    mission.stepAt = i;
    renderSteps();
  };
  M.setSteps = function (steps, at = 0) {
    if (!mission) return;
    mission.steps = steps;
    mission.stepAt = at;
    renderSteps();
  };
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

  /* ---------------- sidebar bits ---------------- */
  UI.setCoins = function (n, bump) {
    $("#coins").textContent = n;
    if (bump) bumpEl($("#coins").parentElement);
  };
  UI.setStars = function (n, bump) {
    $("#stars").textContent = n;
    if (bump) bumpEl($("#stars").parentElement);
  };
  function bumpEl(p) {
    p.classList.remove("bump");
    void p.offsetWidth;
    p.classList.add("bump");
  }
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
  };

  UI.init = function () {
    $("#done-btn").addEventListener("click", () => {
      Cook.sfx.click();
      const r = doneResolve;
      UI.hideDone();
      if (r) r();
    });
    document.addEventListener("pointerdown", () => Cook.unlockAudio(), { passive: true });
  };
})(window);

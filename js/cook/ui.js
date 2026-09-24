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
  };
  UI.ICON = ICON;

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
    const voice = Lang.hasVoice(line);
    const hideTr = opts.noTranslate || !line.en;
    el.innerHTML = `${voice ? `<button class="wp-say" type="button" aria-label="Hear it">${ICON.speaker}</button>` : ""}<span class="wp-text">${Lang.html(line, opts)}</span>${
      hideTr ? "" : `<button class="wp-tr" type="button" aria-label="Show in English">${ICON.translate}</button>`
    }<span class="wp-en hidden">${esc(line.en || "")}</span>`;
    const say = el.querySelector(".wp-say");
    if (say)
      say.addEventListener("click", (ev) => {
        ev.stopPropagation();
        Cook.unlockAudio();
        say.classList.add("on");
        if (opts.onHear) opts.onHear();
        Lang.speak(line).then(() => say.classList.remove("on"));
      });
    const tr = el.querySelector(".wp-tr");
    if (tr)
      tr.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const en = el.querySelector(".wp-en");
        en.classList.toggle("hidden");
        tr.classList.toggle("on", !en.classList.contains("hidden"));
        if (!en.classList.contains("hidden") && Cook.onHelp) Cook.onHelp("translate");
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
  UI.gist = function (text, opts = {}) {
    if (opts.top) {
      const g = $("#gist");
      g.textContent = text;
      g.classList.remove("hidden");
    } else {
      const h = $("#how");
      h.innerHTML = `<b>Goal</b> ${esc(text)}`;
      h.classList.remove("hidden");
    }
  };
  UI.hideGist = () => {
    $("#gist").classList.add("hidden");
    $("#how").classList.add("hidden");
  };

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
  UI.passMe = function (want, options, opts = {}) {
    const box = $("#passme");
    const line = Lang.line("give", Lang.phrase([want]));
    box.querySelector(".pm-say").innerHTML = "";
    box.querySelector(".pm-say").appendChild(UI.pill(line, { hide: opts.hide, onHear: opts.onHear }));
    const tray = box.querySelector(".pm-tray");
    tray.innerHTML = "";
    box.classList.remove("hidden", "leaving");
    let misses = 0;
    Lang.speak(line);
    return new Promise((resolve) => {
      Cook.shuffle(options).forEach((id) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "pm-item";
        b.dataset.id = id;
        b.innerHTML = `<img src="${Cook.Art.wordUrl(id)}" alt="">`;
        b.addEventListener("click", () => {
          Cook.unlockAudio();
          if (id === want) {
            b.classList.add("right");
            Cook.sfx.right();
            Cook.expect = null;
            UI.say(Lang.line("thanks"), { badge: true }, { ms: 900 }).catch(() => {});
            setTimeout(() => {
              box.classList.add("leaving");
              setTimeout(() => {
                box.classList.add("hidden");
                resolve({ misses });
              }, 350);
            }, 500);
          } else {
            misses++;
            b.classList.remove("wrong");
            void b.offsetWidth;
            b.classList.add("wrong");
            Cook.sfx.soft();
            Lang.speak(line);
            if (misses >= 2) tray.querySelector(`[data-id="${want}"]`).classList.add("glow");
          }
        });
        tray.appendChild(b);
      });
      Cook.expect = { kind: "click", selector: `#passme .pm-item[data-id="${want}"]`, wrong: `#passme .pm-item:not([data-id="${want}"])` };
    });
  };

  /* ---------------- the mission card ---------------- */
  const M = (UI.mission = {});
  let mission = null;
  M.open = function ({ who, name, lines, steps, busy }) {
    mission = { who, lines, steps, stars: { ear: "pending", hand: "pending", third: "pending" }, done: [], stepAt: 0, busy };
    const el = $("#mission");
    el.classList.remove("hidden", "stamped");
    el.querySelector(".m-face").src = who === "nani" ? "assets/cook/characters/nani-badge.webp" : `assets/cook/characters/${who}-badge.webp`;
    el.querySelector(".m-name").textContent = name;
    renderStars();
    renderOrder();
    renderSteps();
  };
  function renderStars() {
    const box = $("#mission .m-stars");
    const third = mission.busy ? "bolt" : "tick";
    const tips = { ear: "Understood: everything they asked for", hand: "Cooked well: nothing spilt or burnt", bolt: "Quick: served before the patience bar ran out", tick: "No help: no hints or translations used" };
    box.innerHTML = [
      ["ear", "ear"],
      ["hand", "hand"],
      ["third", third],
    ]
      .map(([k, icon]) => `<span class="mstar ${mission.stars[k]}" data-k="${k}" title="${tips[icon]}">${ICON[icon]}</span>`)
      .join("");
  }
  function renderOrder() {
    const ul = $("#mission .m-order");
    ul.innerHTML = "";
    mission.lines.forEach((l, i) => {
      const li = document.createElement("li");
      if (mission.done[i]) li.classList.add("done");
      li.appendChild(
        UI.pill(l.line, {
          hide: (id) => Cook.cardHidden(id) && !mission.done[i],
          onHear: () => {
            // replaying a known word's instruction counts as help
            if (l.line.segs.some((s) => s.w && Cook.wordStage(s.w) >= 4) && Cook.onHelp) Cook.onHelp("replay");
          },
        })
      );
      ul.appendChild(li);
    });
  }
  function renderSteps() {
    const box = $("#mission .m-steps");
    box.innerHTML = mission.steps.map((s, i) => `<span class="mstep ${i < mission.stepAt ? "on" : i === mission.stepAt ? "now" : ""}">${esc(s)}</span>`).join("");
  }
  M.tick = function (i) {
    if (!mission) return;
    mission.done[i] = true;
    renderOrder();
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
  UI.setPatience = function (frac) {
    const p = $("#patience");
    if (frac == null) return p.classList.add("hidden");
    p.classList.remove("hidden");
    p.querySelector("i").style.width = `${Math.round(Cook.clamp(frac, 0, 1) * 100)}%`;
    p.classList.toggle("low", frac < 0.35);
  };

  /* ---------------- count badge, done button, toast ---------------- */
  // Digit only, always: this is the running tally (how many so far), never
  // the target, and never the Kutchi number as text (that would show the
  // word in a second place at once; the audio still says it).
  UI.count = function (n, { speak = true } = {}) {
    const b = $("#count-badge");
    b.classList.remove("hidden");
    b.querySelector(".count-digit").textContent = n;
    bumpEl(b);
    if (speak && n >= 1 && n <= 5) Lang.speak(Lang.num(n) ? { segs: Lang.num(n), en: String(n) } : null);
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

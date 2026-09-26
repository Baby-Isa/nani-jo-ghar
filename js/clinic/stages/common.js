/*
 * The clinic's stages: what they share (DOM). Each stage is a file in this
 * folder that registers `Clinic.Stages.<name> = {run(env, plan) -> Promise<result>}`
 * and draws into the one screen (js/clinic/screen.js): the request card
 * opens over the play area, is read aloud a line at a time (each lighting as
 * it plays), then shrinks into the sidebar (UX s1, s13); the play area holds
 * the room; the big button on the right moves on (UX s2, s5).
 *
 * A stage's result: {rows: [{id, ok, tested, row}], moments: [Say out],
 * words: [], log: []}. Rows are judged on the FIRST try (a wrong thing just
 * happens, UX s11); the child still finishes the stage.
 *
 * env = {screen, data (the pipeline data), level, fig (the patient's figure,
 * made at the waiting room), bodyFile, speak (speaking moments on), onboard
 * (onboarding scripts on), first (the first-ever session), rng}.
 *
 * For tests, `Clinic.Stages.expect()` says what the current stage wants next
 * ({stage, kind, target selector or point, ...}).
 */
(function (global) {
  "use strict";
  const Clinic = (global.Clinic = global.Clinic || {});
  const Kit = Clinic.Kit;
  const h = Kit.h;
  const S = (Clinic.Stages = Clinic.Stages || {});

  S.current = null; // {stage, expect()} for tests
  S.expect = () => (S.current && S.current.expect ? S.current.expect() : null);
  S.setExpect = (stage, fn) => (S.current = { stage, expect: fn });

  /** A stage element with its room's background (rough art, else a flat colour). */
  S.room = function (screen, name) {
    const stage = screen.clearStage();
    stage.classList.add("cl-room", `room-${name}`);
    const src = Kit.room(name);
    if (src) {
      const bg = h("div", "cl-room-bg", stage);
      bg.style.backgroundImage = `url("${Kit.url(src)}")`;
    }
    screen.clearActions();
    screen.tally.clear();
    return stage;
  };

  /** The doctor's face for the card (no sprite yet: a greybox face). */
  S.doctorFace = function () {
    const f = h("div", "cl-face doctor");
    f.innerHTML = '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="19" fill="#c99a74"/><path d="M5 14 Q20 -2 35 14 L35 10 Q20 -6 5 10Z" fill="#2b1d16"/><circle cx="14" cy="18" r="4.5" fill="none" stroke="#333" stroke-width="1.6"/><circle cx="26" cy="18" r="4.5" fill="none" stroke="#333" stroke-width="1.6"/><path d="M18.5 18 h3" stroke="#333" stroke-width="1.6"/><path d="M13 28 Q20 33 27 28" fill="none" stroke="#5a3a33" stroke-width="2" stroke-linecap="round"/><path d="M12 26 Q20 22 28 26" fill="#2b1d16"/></svg>';
    return f;
  };
  /** A person's face for the card or a bench seat: the rough sprite, else a small greybox figure. */
  S.personFace = function (kind, mood) {
    const f = h("div", "cl-face person");
    const src = Kit.person(kind, mood || "neutral");
    if (src) {
      const img = h("img", "", f);
      img.alt = "";
      img.src = Kit.url(src);
    } else f.textContent = { baby: "👶", "old-man": "👴", "old-woman": "👵", girl: "👧", boy: "👦", auntie: "👩", uncle: "👨" }[kind] || "🙂";
    return f;
  };

  /**
   * The request card (UX s1): the rows go in the sidebar card; a big copy
   * opens over the play area and is read aloud row by row (each lighting),
   * then flies into the sidebar. Resolves when it has landed.
   */
  S.request = async function (screen, { title, face, rows, who = "doctor", read = true }) {
    const card = screen.card;
    card.setTitle(title || "", face || S.doctorFace());
    card.setRows(rows);
    card.who = who;
    if (!read) return;
    const big = card.el.cloneNode(true);
    big.classList.add("cl-card-big");
    big.querySelectorAll(".cl-card-speak").forEach((b) => b.remove());
    screen.main.appendChild(big);
    card.el.classList.add("cl-card-waiting");
    const bigRows = Array.from(big.querySelectorAll(".cl-row"));
    await Kit.wait(250);
    for (let i = 0; i < rows.length; i++) {
      const el = bigRows[i];
      if (el) el.classList.add("reading");
      await Kit.Voice.say(rows[i], { who: rows[i].who || who, noBubble: true });
      if (el) el.classList.remove("reading");
    }
    // fly into the sidebar
    const from = big.getBoundingClientRect();
    const to = card.el.getBoundingClientRect();
    const sx = to.width / Math.max(1, from.width);
    const sy = to.height / Math.max(1, from.height);
    big.style.transformOrigin = "0 0";
    big.style.transition = `transform ${Kit.fast ? 60 : 450}ms ease-in, opacity ${Kit.fast ? 60 : 450}ms ease-in`;
    void big.offsetWidth;
    big.style.transform = `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${sx}, ${sy})`;
    big.style.opacity = "0.2";
    await Kit.wait(Kit.fast ? 70 : 460);
    big.remove();
    card.el.classList.remove("cl-card-waiting");
  };

  /** The big button on the right; resolves when pressed. `throb` makes it pulse. */
  S.button = function (screen, word, { throb = true, cls = "", wait = true } = {}) {
    let btn;
    const p = new Promise((res) => {
      btn = screen.go(word, () => {
        if (btn.disabled) return;
        btn.disabled = true;
        if (global.Sfx && global.Sfx.tap) try { global.Sfx.tap(); } catch (e) { /* no sound */ }
        res(btn);
      }, `${cls} ${throb ? "throb" : ""}`);
    });
    btn.dataset.go = typeof word === "string" ? word : word.english || "";
    return wait ? p.then(() => btn) : { btn, pressed: p };
  };

  /** A line as a word object from the pipeline data. */
  S.line = (env, id, vars) => global.ClinicPipeline.line(env.data, id, vars);
  S.say = (line, who, o = {}) => Kit.Voice.say(line, Object.assign({ who }, o));

  /** Onboarding (UX s8, s10): once per profile per stage, only when env.onboard. */
  S.onboard = function (env, id, script) {
    if (!env.onboard || !global.Onboard) return Promise.resolve("off");
    return global.Onboard.run(`clinic/${id}`, script, { idleMs: 6000 });
  };
  S.signal = (name) => global.Onboard && global.Onboard.signal(name);
  /** A stage has ended: close any onboarding still open for it (its spotlight's element is gone). */
  S.endOnboard = function () {
    if (!global.Onboard || !global.Onboard.active || !global.Onboard.active()) return;
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  };

  /** A result collector for a stage. */
  S.result = function (stage) {
    const rows = [];
    const firstDone = new Set();
    return {
      stage,
      rows,
      moments: [],
      words: [],
      log: [],
      /** Judge a row on its first try only. */
      judge(row, ok) {
        if (firstDone.has(row.id)) return false;
        firstDone.add(row.id);
        rows.push({ id: row.id, ok: !!ok, tested: row.tested !== false && !row.taught, row, stage });
        return true;
      },
      judged: (id) => firstDone.has(id),
    };
  };

  /** Speaking moments (UX: speaking on `tell`, the pills as the fallback, a grown-up's tick). */
  S.moment = function (env, opts) {
    if (!global.Say || !env.speak) {
      // no speaking kit: the pills alone, through the same shape
      return S.pillsOnly(env, opts);
    }
    return global.Say.moment(Object.assign({
      mode: "clinic",
      container: env.screen.main,
      grandparent: !!env.grandparent,
      pillsLive: env.level <= 1,
      pillsAfterMs: Kit.fast ? 300 : 8000,
      retries: 1,
      timeoutMs: 4000,
      label: (id) => Kit.plain(opts.word(id)),
    }, opts));
  };
  /** The pills on their own (no mic): the same {choice, via} result. */
  S.pillsOnly = function (env, opts) {
    return new Promise((res) => {
      const box = h("div", "cl-pills", env.screen.main);
      if (opts.caption) Kit.text({ english: opts.caption }, h("div", "cl-pills-cap", box));
      opts.choices.forEach((id) => {
        const b = h("button", "cl-pill", box);
        b.type = "button";
        b.dataset.choice = id;
        Kit.text(opts.word(id), b);
        b.addEventListener("click", async () => {
          box.querySelectorAll("button").forEach((x) => (x.disabled = true));
          if (opts.character && opts.character.act) await opts.character.act(id, "pill");
          const ok = opts.accept ? opts.accept(id, "pill") : true;
          if (ok === false) {
            box.querySelectorAll("button").forEach((x) => (x.disabled = false));
            return;
          }
          box.remove();
          res({ choice: id, via: "pill", tries: 1 });
        });
      });
    });
  };

  /** Seat/element centre in client px (for tests). */
  S.centre = (el) => {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
  };
})(typeof self !== "undefined" ? self : this);

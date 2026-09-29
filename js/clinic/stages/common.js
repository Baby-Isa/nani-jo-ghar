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

  /**
   * A stage element with its room's background. Clinic v2: the approved background
   * (data/clinic/scenes-v2.json) at full strength, in a scene box that keeps the
   * picture's aspect, so everything placed in it (in shares of the picture) stays
   * on the painted bench, bed, belt or doormat at every screen size. Returns the
   * stage; stage.scene is the box (null for a room without a v2 picture: the old
   * rough art, faded).
   */
  S.room = function (screen, name) {
    const stage = screen.clearStage();
    stage.classList.add("cl-room", `room-${name}`);
    screen.clearActions();
    screen.tally.clear();
    const V = Clinic.Scenes;
    const room = V && V.rooms && V.rooms[name];
    if (room) {
      stage.classList.add("v2");
      const cap = h("div", "cl-scene-cap", stage);
      const box = h("div", "cl-scene", stage);
      const url = `url("${Kit.url(room.src)}")`;
      box.style.backgroundImage = url;
      cap.style.backgroundImage = url;
      stage.scene = box;
      stage.sceneCfg = V[name] || {};
      S.fitScene(stage, box, cap, room, V.aspect || 1.5);
      return stage;
    }
    stage.scene = null;
    const src = Kit.room(name);
    if (src) {
      const bg = h("div", "cl-room-bg", stage);
      bg.style.backgroundImage = `url("${Kit.url(src)}")`;
    }
    return stage;
  };
  /** Size the scene box: cover the stage when `need` fits, else fit `need`'s width, on the bottom. */
  S.fitScene = function (stage, box, cap, room, A) {
    const fit = () => {
      if (!box.isConnected) return;
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      if (!W || !H) return;
      const need = room.need || [0, 1];
      const span = need[1] - need[0];
      let w;
      let h2;
      let left;
      let top;
      if (W / H >= A) {
        w = W;
        h2 = W / A;
        left = 0;
        top = (H - h2) * (room.ay != null ? room.ay : 0.6);
      } else if (H * A * span <= W) {
        h2 = H;
        w = H * A;
        const mid = (need[0] + need[1]) / 2;
        left = Math.min(0, Math.max(W - w, W / 2 - mid * w));
        top = 0;
      } else {
        w = W / span;
        h2 = w / A;
        left = -need[0] * w;
        top = H - h2;
      }
      Object.assign(box.style, { width: `${w}px`, height: `${h2}px`, left: `${left}px`, top: `${top}px` });
      // above a bottom-fitted box: the top of the picture, mirrored and softened, so the wall carries on
      if (top > 0) Object.assign(cap.style, { display: "block", left: `${left}px`, width: `${w}px`, top: `${top - h2}px`, height: `${h2}px` });
      else cap.style.display = "none";
      stage.style.setProperty("--scene-w", `${w}px`);
      stage.style.setProperty("--scene-h", `${h2}px`);
      box.dispatchEvent(new CustomEvent("scenefit"));
    };
    fit();
    if (global.ResizeObserver) {
      const ro = new ResizeObserver(fit);
      ro.observe(stage);
    } else global.addEventListener("resize", fit);
    return fit;
  };
  /** Place an element in the scene box: x centre, y = its bottom (feet), h = height (shares of the picture). */
  S.place = function (el, { x, y, h: ht, z, w }) {
    el.classList.add("cl-placed");
    el.style.left = `${x * 100}%`;
    el.style.top = `${y * 100}%`;
    if (ht != null) el.style.height = `${ht * 100}%`;
    if (w != null) el.style.width = `${w * 100}%`;
    if (z != null) el.style.zIndex = String(z);
    return el;
  };

  /** The doctor's face for the card (no sprite yet: a greybox face). */
  S.doctorFace = function (mood) {
    const f = h("div", "cl-face doctor");
    const src = Kit.person("doctor", mood || "neutral");
    if (src) {
      const img = h("img", "", f);
      img.alt = "";
      img.src = Kit.url(src);
      return f;
    }
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

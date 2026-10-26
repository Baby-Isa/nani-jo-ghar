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
  S.GOALS = {
    waiting: "Who's next? Listen to the doctor, then tap the tick under that person.",
    exam: "Find where it hurts: listen to the patient (and the doctor), then tap the body.",
    stand: "The check-up: pick the tool the doctor says, then tap the part.",
    pharmacy: "Tap the things the doctor asks for as they ride past on the belt.",
    door: "Is everything okay now? Pick the face (or what helps), then say goodbye.",
  };
  // the doctor's line in his box (13f: the doctor fills Nani's guidance role): his own words for the room,
  // never an English instruction to the child (UX 8). Line ids in data/clinic/pipeline.json; placeholders to record.
  S.GUIDE = { waiting: "why-waiting", exam: "where", stand: "lookhere", pharmacy: "why-pharmacy", door: "okay-now" };
  S.room = function (screen, name) {
    const stage = screen.clearStage();
    screen.goal = S.GOALS[name] || "";
    const gd = S.GUIDE[name] && Clinic.Run && Clinic.Run.data ? global.ClinicPipeline.line(Clinic.Run.data, S.GUIDE[name]) : null;
    if (screen.setNani) screen.setNani(gd);
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
      S.certificate(box, stage.sceneCfg.certificate);
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
  /**
   * A2 (5 Oct), the square exam room (art plan R3, 2.2): a room with `square` (scenes-v2 rooms.exam.square, the
   * 1536 x 1536 picture with CB2b kept pixel for pixel in rows 256-1280) shows its whole width on a screen taller
   * than the room (a tablet), with the new ceiling and floor bands above and below, instead of cropping the sides.
   * The scene box stays the 1536 x 1024 room, so every position in the scene's data keeps its meaning; the square
   * picture is a layer inside the box that runs past its top and bottom, so it zooms with the box.
   */
  const squareFit = function (m, W, H, room, A) {
    const sq = room && room.square;
    if (!sq || W / H >= A) return m;
    const need = room.need || [0, 1];
    const w = Math.max(W, H); // the square must cover the height
    const h2 = w / A;
    const band = (sq.middle ? sq.middle[0] / (sq.size || 1536) : 1 / 6) * w; // the ceiling band's height on screen
    const st = Math.min(0, Math.max(H - w, (H - w) * 0.5)); // the square's top
    const left = w > W ? Math.min(0, Math.max(W - w, W / 2 - ((need[0] + need[1]) / 2) * w)) : 0;
    return { w, h: h2, left, top: st + band };
  };
  const squareLayer = function (box, room) {
    const sq = room && room.square;
    let el = box.querySelector(":scope > .cl-scene-sq");
    if (!sq) {
      if (el) el.remove();
      return;
    }
    if (!el) {
      el = h("div", "cl-scene-sq");
      box.insertBefore(el, box.firstChild);
      el.style.backgroundImage = `url("${Kit.url(sq.src)}")`;
    }
    const size = sq.size || 1536;
    const mid = sq.middle || [256, 1280];
    const k = 100 / (mid[1] - mid[0]); // % of the box per source px
    Object.assign(el.style, { top: `${-mid[0] * k}%`, height: `${size * k}%` });
  };
  S.squareFit = squareFit;

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
      const q = squareFit({ w, h: h2, left, top }, W, H, room, A);
      (w = q.w), (h2 = q.h), (left = q.left), (top = q.top);
      squareLayer(box, room);
      Object.assign(box.style, { width: `${w}px`, height: `${h2}px`, left: `${left}px`, top: `${top}px` });
      // the picture's top rows stretched up (the edge carried on), softened: no mirrored ghosts of the wall's pictures
      if (top > 0 && !room.square) Object.assign(cap.style, { display: "block", left: `${left}px`, width: `${w}px`, top: "0px", height: `${top + 2}px`, backgroundSize: `100% ${h2 * 40}px`, backgroundPosition: "0 0" });
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
  /**
   * R3a/R5: the scene box from the shared stage (js/shared/stage.js: exactly the maths above, tested in
   * build/test_shared_stage.mjs), so the clinic and Cook map scenes one way. Called once by js/clinic/main.js.
   */
  S.useStage = function (Stage) {
    S.fitScene = function (stage, box, cap, room, A) {
      const A_ = A || 1.5;
      const SW = 1536;
      const SH = SW / A_;
      const need = room.need || [0, 1];
      const spec = { w: SW, h: SH, safe: [need[0] * SW, null, need[1] * SW, null], fill: "cover", anchorY: room.ay != null ? room.ay : 0.6 };
      const fit = () => {
        if (!box.isConnected) return;
        const W = stage.clientWidth;
        const H = stage.clientHeight;
        if (!W || !H) return;
        const m = squareFit(Stage.fit({ box: { w: W, h: H }, scene: spec }), W, H, room, A_);
        squareLayer(box, room);
        Object.assign(box.style, { width: `${m.w}px`, height: `${m.h}px`, left: `${m.left}px`, top: `${m.top}px` });
        if (m.top > 0 && !room.square) Object.assign(cap.style, { display: "block", left: `${m.left}px`, width: `${m.w}px`, top: "0px", height: `${m.top + 2}px`, backgroundSize: `100% ${m.h * 40}px`, backgroundPosition: "0 0" });
        else cap.style.display = "none";
        stage.style.setProperty("--scene-w", `${m.w}px`);
        stage.style.setProperty("--scene-h", `${m.h}px`);
        box.dispatchEvent(new CustomEvent("scenefit"));
      };
      fit();
      if (global.ResizeObserver) new ResizeObserver(fit).observe(stage);
      else global.addEventListener("resize", fit);
      return fit;
    };
  };
  /**
   * A2 (5 Oct): a patient kind's real art (data/clinic/heal-art.json patients[kind], cut by
   * build/cut_clinic_heal_v3.py), loaded once and shared with the heal host; null when that kind has none yet.
   */
  S.artFor = async function (kind) {
    const HH = Clinic.HealHost;
    if (!S._healArt) S._healArt = (HH && HH.healArt) || (await Kit.loadJSON("data/clinic/heal-art.json")) || {};
    if (HH && HH.healArt == null) HH.healArt = S._healArt;
    return (kind && S._healArt.patients && S._healArt.patients[kind]) || null;
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

  /**
   * CLN-116 (29 Sept, CB2b review): the exam room's right wall holds the real doctor's certificate, a photo Zafar will
   * supply, added in code as a framed picture (scenes-v2.json exam.certificate: the frame's centre x, bottom y, width
   * and height as shares of the room, and src). Until the photo comes it is a grey frame, flagged in the markup only
   * (data-rec, decision 84: nothing written for the child). It sits in the scene box, so it moves and scales with the room.
   */
  S.certificate = function (box, spec) {
    if (!box || !spec) return null;
    const f = S.place(h("div", `cl-cert${spec.src ? "" : " rec"}`, box), { x: spec.x, y: spec.y, w: spec.w, h: spec.h, z: 1 });
    f.setAttribute("aria-hidden", "true");
    if (spec.src) {
      const im = h("img", "", f);
      im.alt = "";
      im.src = Kit.url(spec.src);
    } else f.dataset.rec = "certificate photo: Zafar to supply";
    return f;
  };

  /** The doctor's face for a card (CLN-150: the real man's face, Kit.doctorFace; neutral, talk, laugh or think). */
  S.doctorFace = (mood) => Kit.faceCircle("doctor", Kit.doctorFace(mood || "neutral"), "cl-face doctor"); // ART-08 (S13-A2): the kit's one face maker
  /**
   * The doctor standing in a room (CLN-150): his real art (Kit.doctorFigure) placed by his feet at cfg {x, y (the feet
   * line), h (his height), z}, as shares of the room picture; his bubbles come from his head. Returns the element.
   */
  S.doctor = function (box, cfg, cls, view) {
    const el = S.place(Kit.doctorFigure(box, cls, { h: cfg.h, view }), { x: cfg.x, y: cfg.y, z: cfg.z != null ? cfg.z : 2 });
    Kit.Voice.speakers.doctor = () => el.__doc.head;
    return el;
  };
  /** A person's face for the card or a bench seat: the rough sprite, else a small greybox figure. */
  S.personFace = function (kind, mood) {
    // ART-08 (S13-A2): the kit's one face maker (Kit.faceCircle, js/shared/face.js); a person with no picture shows its emoji
    const src = Kit.person(kind, mood || "neutral");
    return Kit.faceCircle(kind, src ? Kit.url(src) : null, "cl-face person", { baby: "👶", "old-man": "👴", "old-woman": "👵", girl: "👧", boy: "👦", auntie: "👩", uncle: "👨" }[kind] || "🙂");
  };

  /**
   * The request card (UX s1, s13; clinic fixes 13c, 13i): the rows go straight into the sidebar's order
   * card and are read aloud with the read-along (each row lighting as it's said). Nothing waits for the
   * talking: input is live at once, and a tap during the reading simply goes ahead. Resolves at once;
   * `.reading` is the read-along's promise. opts: ordered (one ordered job), closed + onPeek (the closed
   * card: the call is heard, not read; a tap peeks and counts a hint).
   */
  S.request = function (screen, { title, face, rows, who = "doctor", read = true, ordered = false, closed = false, onPeek = null, look = null }) {
    const card = screen.card;
    card.who = who;
    card.isOrdered = !!ordered;
    // decision 57 (CLN-91): look "bulb" on a spoken card (the waiting room's call): the small bulb, no counter
    card.closed = closed ? { onPeek, look } : null;
    card.fold = {};
    card.titleText = title || "";
    // CLN-140 (R4 in the clinic): the doctor is the guide and the asker, so his face shows once, on his own sidebar card
    // (null here: the screen's card wears his face, screen.js); his box above keeps only the bulb and sound buttons
    card.faceEl = face || (who === "doctor" ? null : S.doctorFace());
    card.setRows(rows);
    const reading = read ? card.speak() : Promise.resolve();
    return Promise.resolve({ reading });
  };

  /**
   * The request pop-up (decision 53, T27; S03-A, CLN-84, SH-64; S04-F1: every clinic stage): the shared one
   * (js/shared/request-popup.js), the same as Cook's and every heal game's, through the shared lifecycle (S04-B,
   * decision 75 (1)). The doctor's card at full size over the play area, read out row by row (the read-along); a tap
   * anywhere stops the voice at once and folds it into the sidebar; then the game is quiet. The stage then sets the
   * sidebar card with S.request(..., {read: false}). The pop-up never shows more than that sidebar card: a closed
   * card (from level 3: heard, not read) is closed here too. prep(card): the stage's own drawing of its card (the
   * check-up's tool blocks), applied before the rows are set.
   */
  S.requestPopup = function (screen, { reason, title, rows, ordered, face, closed = false, prep = null, readTitle = true }) {
    const LC = global.Lifecycle;
    if (!LC) return Promise.resolve({ skipped: false });
    let card = null;
    const fill = (c) => {
      if (prep) prep(c);
      c.isOrdered = !!ordered;
      c.titleText = title || "";
      c.faceEl = face || S.doctorFace();
      c.setRows((rows || []).map((r) => Object.assign({}, r)));
    };
    return LC.request({
      reason: reason || "clinic",
      host: screen.main,
      target: () => screen.card.el,
      fast: Kit.fast,
      wait: (ms) => Kit.wait(ms),
      build(box) {
        card = new Kit.Card(box, { who: "doctor", big: true });
        // a closed card (from level 3, CLN-114): the shared closed big card (js/shared/order-card.js), the doctor's face,
        // the headline the closed sidebar card shows and a row of dots; the rows are read out, never drawn
        if (closed) card.closed = { onPeek: null, look: null };
        fill(card);
      },
      // the read-out starts once the pop-up is on screen: at real speed its own 300 ms lead covers the 0.2 s fade in;
      // at test speed (a 20 ms lead) it waits for the fade, so the first line is never said before the card shows
      // readTitle false: a headline the doctor has just said (the waiting room's [Who's next?]) is not read again
      read: () => (Kit.fast ? new Promise((r) => setTimeout(r, 220)) : Promise.resolve()).then(() => card.speak(readTitle ? undefined : card.rows.map((r) => r.id))),
      onStop: () => Kit.Voice.clear(),
    });
  };

  /**
   * The staging hook (UX 16, 13e): while two characters talk they stand three-quarter turned to each other
   * ("talk"); when it's the child's turn to act they turn to face the player ("front"): that turn is the
   * "your turn" cue. A swap between two drawn poses with a quick crossfade, never an animation. The art
   * (a three-quarter pose, mirrored for left and right, and a front pose) doesn't exist yet: with the
   * stand-ins the hook sets data-pose and data-facing, and the CSS turns the stand-in a little
   * (css/clinic.css "staging"). When the art lands, Kit.art.poses[kind] = {talk, front} swaps the picture.
   *   S.pose(el, "talk" | "front", {facing: "left" | "right"})
   */
  S.pose = function (el, pose, o = {}) {
    if (!el) return el;
    const was = el.dataset.pose;
    el.dataset.pose = pose;
    if (o.facing) el.dataset.facing = o.facing;
    el.classList.add("cl-staged");
    if (was && was !== pose) {
      el.classList.remove("pose-swap");
      void el.offsetWidth;
      el.classList.add("pose-swap");
    }
    // the real doctor (CLN-150): his own turned view, swapped in place on his feet line (Kit.doctorFigure)
    if (el.__doc) el.__doc.pose(pose, o.facing || el.dataset.facing);
    const kind = el.dataset.kind;
    const poses = kind && Kit.art && Kit.art.poses && Kit.art.poses[kind];
    const img = el.querySelector("img");
    if (poses && img && poses[pose] && Kit.sprite(poses[pose])) img.src = Kit.url(Kit.sprite(poses[pose]));
    return el;
  };
  /** Both talk (three-quarter, turned to each other), or both turn to the player (the child's turn). */
  S.stage = function (a, b, turn) {
    if (turn === "player") {
      S.pose(a, "front");
      S.pose(b, "front");
    } else {
      S.pose(a, "talk", { facing: "right" });
      S.pose(b, "talk", { facing: "left" });
    }
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
    const out = global.Say.moment(Object.assign({
      mode: "clinic",
      container: env.screen.main,
      grandparent: !!env.grandparent,
      pillsLive: env.level <= 1,
      pillsAfterMs: Kit.fast ? 300 : 8000,
      retries: 1,
      timeoutMs: 4000,
      label: (id) => Kit.plain(opts.word(id)),
      // decision 84 (CLN-117): a pill the engine has no Kutchi for yet is its English in grey italic, tagged "to record"
      // by the shared Say itself (S05-S2; the caption through opts.captionRec); "Thank you" is the family's (decision 81)
      isPlaceholder: (id) => {
        const w = opts.word(id);
        return !!(w && typeof w === "object" && !w.kutchi);
      },
    }, opts));
    return out;
  };
  /** The pills on their own (no mic): the same {choice, via} result. */
  S.pillsOnly = function (env, opts) {
    return new Promise((res) => {
      const box = h("div", "cl-pills", env.screen.main);
      if (opts.caption) Kit.text({ english: opts.caption }, h("div", "cl-pills-cap", box));
      // S13-A2: the kit's pills (js/shared/buttons.js NjgButtons.pills: one look); .cl-pill stays on each as the stages' and
      // the tests' handle (the waiting room puts a face on its pills)
      const word = (id) => {
        const n = document.createElement("span");
        Kit.text(opts.word(id), n);
        return n;
      };
      global.NjgButtons.pills(box, opts.choices.map((id) => ({ id, node: word(id) })), async (id) => {
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
      box.querySelectorAll(".njg-pill").forEach((b) => b.classList.add("cl-pill"));
    });
  };

  /** Seat/element centre in client px (for tests). */
  S.centre = (el) => {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
  };
})(typeof self !== "undefined" ? self : this);

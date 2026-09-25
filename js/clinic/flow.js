/*
 * The clinic: boot, the grading context, and the clinic lab.
 * docs/modes/clinic-design.md R3.9 phase 1, 8.3 (the lab).
 *
 * The clinic runs on Cook's engine (js/cook/core, lang, art, ui, stations,
 * station-lib, zone), loaded unchanged, with Cook's own mechanics (fetch,
 * pour, count, stir, knead, passme) loaded as they are and called by id.
 * data/clinic.json is merged into Cook.data at load under clinic-only ids;
 * data/cook.json is never edited. Nothing is saved yet: the lab keeps word
 * progress in memory only (Cook.writeSave is never called here), so plugging
 * into the shell's one save later needs no migration.
 *
 * The lab: any mechanic x level 1-3 alone, or a whole visit of each type,
 * a morning, the dispensary; "say" (the stub recogniser: right word, wrong
 * word, nothing, unsure, mumble, or the real microphone), "a grown-up judges
 * speaking", the hotspot overlay and the hotspot editor.
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const Clinic = (global.Clinic = global.Clinic || {});
  const V = global.ClinicVisit;
  const $ = (s) => document.querySelector(s);
  Clinic.settings = Object.assign({ parentJudges: false, hotspots: false, reads: false }, Clinic.settings || {});

  /* ---------------- data: merge the clinic into Cook.data (in memory only) ---------------- */
  Cook.onLoad.push(async (data) => {
    const [cl, pose, scene] = await Promise.all([
      fetch("data/clinic.json").then((r) => r.json()),
      fetch("data/patients/grey-adult.json").then((r) => r.json()),
      fetch("data/scenes/clinic.json").then((r) => r.json()),
    ]);
    data.clinic = cl;
    data.clinicScene = scene;
    Object.entries(cl.words).forEach(([id, w]) => (data.words[id] = data.words[id] || w));
    Object.entries(cl.lines).forEach(([id, l]) => (data.lines[id] = data.lines[id] || l));
    data.mechanics = data.mechanics || {};
    Object.entries(cl.mechanics).forEach(([id, m]) => !id.startsWith("_") && !data.mechanics[id] && (data.mechanics[id] = m));
    Object.entries(cl.stations).forEach(([id, st]) => (data.stations[id] = data.stations[id] || st));
    data.lookalike_groups = data.lookalike_groups || { groups: [] };
    cl.lookalike_groups.groups.forEach((g) => data.lookalike_groups.groups.push(g));
    data.lookalikes = data.lookalikes || {};
    cl.lookalike_groups.groups.forEach((g) => g.forEach((id) => (data.lookalikes[id] = data.lookalikes[id] || g.filter((x) => x !== id))));
    data.star_sets = Object.assign({}, data.star_sets, { clinic: cl.star_sets.clinic });
    Clinic.body = ClinicBody.build(pose);
  });

  /* ---------------- the grading context (one visit) ---------------- */
  const STARS = ["ear", "voice", "hand", "tick"];
  Clinic.makeCtx = function ({ visit = null, lab = true, guided = false, level = 1 } = {}) {
    const ctx = {
      visit,
      lab,
      guided,
      level,
      result: {},
      basket: [],
      results: {},
      grades: [],
      help: 0,
      misses: [],
      heardLines: [],
      voiceLog: [],
      order: { who: "nana", dishes: [] },
    };
    Cook.ctx = ctx;
    // Cook's mechanics report here too (fetch, count, stir, pass me)
    ctx.listen = (ok, why) => {
      if (ok) return;
      ctx.misses.push(why || "missed");
      Clinic.stars.set("ear", "lost");
    };
    ctx.skill = (score, what) => {
      ctx.grades.push({ what, score: Math.round(score) });
      if (score < 55) Clinic.stars.set("hand", "lost");
    };
    /** The first try at a row is what counts (later tries finish the visit kindly). */
    ctx.grade = (row, ok, extra = {}) => {
      if (!row) return;
      const prev = ctx.results[row.id];
      if (prev) {
        if (ok) prev.done = true;
        return;
      }
      ctx.results[row.id] = Object.assign({ first: !!ok, helped: !!row.helped, done: !!ok }, extra);
      if (!ok && row.tested && row.kind !== "voice") ctx.listen(false, `${row.kind}: wanted ${row.accept[0]}`);
      [].concat(row.accept[0]).forEach((w) => typeof w === "string" && w.split("#").forEach((id) => (ok ? Cook.markRight(id) : Cook.markMiss(id))));
    };
    /** A row's answer was shown (the patient touched it after two misses): the row's ear star goes. */
    ctx.shown = (row) => {
      if (!row) return;
      const r = (ctx.results[row.id] = ctx.results[row.id] || { first: false });
      r.first = false;
      ctx.listen(false, `shown ${row.accept[0]}`);
    };
    ctx.voice = (row, res) => {
      ctx.results[row.id] = { first: !!res.first, spoken: !!res.spoken, path: res.path };
      ctx.voiceLog.push({ moment: row.moment, answer: row.accept[0], path: res.path.join(" > "), star: res.spoken && res.first });
      if (!(res.spoken && res.first)) Clinic.stars.set("voice", "lost");
    };
    ctx.helped = (kind) => {
      ctx.help++;
      Clinic.stars.set("tick", "lost");
    };
    ctx.heard = (line) => ctx.heardLines.push(Lang.plain(line));
    ctx.maybePassMe = async () => {};
    return ctx;
  };
  /** The four stars at the end of a visit (R3.4): null = no slot on this visit. */
  Clinic.finalStars = function (ctx) {
    const v = ctx.visit;
    const data = Cook.data.clinic;
    const ear = v ? V.earStar(v, ctx.results) : ctx.misses.length === 0;
    // the "say it" lab entry is one speaking row on its own: its star is that row
    const voice = !v ? null : v.type === "tell" ? v.rows.every((r) => (ctx.results[r.id] || {}).spoken && ctx.results[r.id].first) : V.voiceStar(v, ctx.results, data);
    return { ear: ear === null ? null : ear && ctx.misses.length === 0, voice, hand: ctx.grades.length ? !ctx.grades.some((g) => g.score < 55) : null, tick: ctx.help === 0 };
  };

  /* ---------------- the sidebar card: who, and the stars as they happen ---------------- */
  const ICONS = { ear: "&#128066;", voice: "&#127908;", hand: "&#129657;", tick: "&#10003;" };
  Clinic.stars = {
    reset(slots) {
      const el = $("#cl-stars");
      el.innerHTML = STARS.filter((s) => slots[s]).map((s) => `<span class="cl-star on" data-star="${s}" title="${UI.esc(((Cook.data.clinic.star_sets.clinic || {})[s === "tick" ? "relaxed" : s] || {}).tip || s)}">${ICONS[s]}</span>`).join("");
    },
    set(s, state) {
      const el = document.querySelector(`#cl-stars [data-star="${s}"]`);
      if (el) el.classList.toggle("on", state !== "lost");
    },
  };
  Clinic.card = function (title, sub, slots) {
    $("#cl-card").classList.remove("hidden");
    $("#cl-card .cl-title").textContent = title;
    $("#cl-card .cl-sub").textContent = sub || "";
    Clinic.stars.reset(slots || { ear: true, hand: true, tick: true });
  };

  /* ---------------- the lab ---------------- */
  Clinic.labs = [];
  /** Register a lab entry: {key, name, verb, group, run(L)}. */
  Clinic.lab = (e) => Clinic.labs.push(e);
  const S = () => Cook.scene;
  const GROUPS = [
    ["visit", "Whole visits"],
    ["mech", "Mechanics, alone"],
    ["cook", "Cook's mechanics, in the clinic"],
    ["tools", "Tools"],
  ];
  function showLab() {
    Cook.run++;
    UI.clearStage();
    $("#cl-card").classList.add("hidden");
    const level = Clinic.labLevel || 1;
    const say = Clinic.Speech.mode;
    const p = UI.panel(`
      <h1>The clinic: lab</h1>
      <p>Phase 1 greybox: every word is an English placeholder (grey italics) until the family gives the Kutchi. Try any visit or mechanic at level 1, 2 or 3.</p>
      <div class="seg" role="group" aria-label="Level">${[1, 2, 3].map((n) => `<button data-level="${n}" class="${n === level ? "on" : ""}">Level ${n}</button>`).join("")}</div>
      <div class="cl-opts">
        <label>Say: <select id="cl-say">${Clinic.Speech.MODES.map(([k, n]) => `<option value="${k}" ${k === say ? "selected" : ""}>${UI.esc(n)}</option>`).join("")}</select></label>
        <label><input type="checkbox" id="cl-parent" ${Clinic.settings.parentJudges ? "checked" : ""}> A grown-up judges speaking</label>
        <label><input type="checkbox" id="cl-hot" ${Clinic.settings.hotspots ? "checked" : ""}> Hotspot overlay (dev)</label>
      </div>
      ${GROUPS.map(([g, t]) => `<h3>${t}</h3><div class="lab-grid">${Clinic.labs.filter((e) => e.group === g).map((e) => `<button data-lab="${e.key}">${UI.esc(e.name)}<small>${UI.esc(e.verb)}</small></button>`).join("")}</div>`).join("")}
    `, { title: true });
    p.querySelectorAll("[data-level]").forEach((b) => b.addEventListener("click", () => ((Clinic.labLevel = Number(b.dataset.level)), showLab())));
    $("#cl-say").addEventListener("change", (e) => (Clinic.Speech.mode = e.target.value));
    $("#cl-parent").addEventListener("change", (e) => (Clinic.settings.parentJudges = e.target.checked));
    $("#cl-hot").addEventListener("change", (e) => (Clinic.settings.hotspots = e.target.checked));
    p.querySelectorAll("[data-lab]").forEach((b) => b.addEventListener("click", () => runLab(b.dataset.lab)));
    Cook.expect = null;
  }
  Clinic.showLab = showLab;

  async function runLab(key, { level = Clinic.labLevel || 1 } = {}) {
    const entry = Clinic.labs.find((e) => e.key === key);
    Cook.run++;
    Cook.unlockAudio();
    UI.closePanel();
    UI.clearStage();
    const s = S();
    s.clearView();
    const ctx = Clinic.makeCtx({ level });
    Clinic.last = { key, level, ctx, done: false };
    let out;
    try {
      await s.setView("marble");
      out = await entry.run({ S: s, ctx, level, key });
    } catch (e) {
      if (e instanceof Cook.Abort) return;
      console.error(e);
      throw e;
    }
    const stars = Clinic.finalStars(ctx);
    Clinic.last.done = true;
    Clinic.last.stars = stars;
    Clinic.last.out = out;
    const star = (k) => (stars[k] === null || stars[k] === undefined ? "" : `<span class="cl-star ${stars[k] ? "on" : ""}">${ICONS[k]}</span>`);
    const why = ctx.misses.length ? `Ear: ${UI.esc(ctx.misses.join("; "))}` : "Understood everything.";
    const voice = ctx.voiceLog.length ? `<br>Speaking: ${ctx.voiceLog.map((v) => `${v.moment} ${UI.esc(Cook.english(v.answer))}: ${UI.esc(v.path)}${v.star ? " ★" : ""}`).join("; ")}` : "";
    const hands = ctx.grades.length ? `<br>Hands: ${ctx.grades.map((g) => `${UI.esc(g.what)} ${g.score}%`).join(" · ")}` : "";
    const words = [...new Set((ctx.visit ? V.words(ctx.visit) : []).filter((w) => Cook.data.words[w]))];
    const review = words.length ? `<h3>The words (Kutchi to come)</h3><p class="cl-review">${words.map((w) => UI.esc(Cook.english(w))).join(" · ")}</p>` : "";
    const p = UI.panel(`
      <h2>${UI.esc(entry.name)}: done</h2>
      <div class="cl-result">${STARS.map(star).join("")}</div>
      <p>${why}${voice}${hands}${ctx.help ? `<br>${ctx.help} help(s): "?" or replays` : ""}</p>
      ${review}
      <div class="btn-row"><button class="btn primary" id="lab-again">Again</button><button class="btn" id="lab-list">The lab</button></div>`);
    $("#lab-again").addEventListener("click", () => runLab(key, { level }));
    $("#lab-list").addEventListener("click", showLab);
    Cook.expect = { kind: "click", selector: "#lab-list" };
    return stars;
  }
  Clinic.runLab = runLab;

  /* ---------------- test hooks (build/test_clinic.py) ---------------- */
  global.__clinic = {
    /** What the game wants next, in screen px (the test plays from this; it never calls a handler). */
    expectation() {
      const e = Cook.expect;
      if (!e) return null;
      const out = {};
      Object.keys(e).forEach((k) => typeof e[k] !== "function" && (out[k] = e[k]));
      const conv = (x, y) => UI.worldToScreen(x, y);
      const k = conv(1, 0).x - conv(0, 0).x;
      if (e.x != null) Object.assign(out, { sx: conv(e.x, e.y).x, sy: conv(e.x, e.y).y });
      if (e.from) Object.assign(out, { sfrom: conv(e.from.x, e.from.y), sto: conv(e.to.x, e.to.y) });
      if (e.wrongs) out.swrongs = e.wrongs.map((w) => conv(w.x, w.y));
      if (e.rx) Object.assign(out, { srx: e.rx * k, sry: (e.ry || e.rx) * k });
      if (e.r) out.sr = e.r * k;
      if (typeof e.count === "function") out.count = e.kind === "stir" && Cook.stirCount ? Cook.stirCount() : e.count();
      delete out.wrongs;
      return out;
    },
    gauge: () => (Cook.gauge ? { level: Cook.gauge.level, lo: Cook.gauge.lo, hi: Cook.gauge.hi } : null),
    lab: (key, level = 1, opts = {}) => {
      if (opts.say) Clinic.Speech.mode = opts.say;
      Clinic.settings.parentJudges = !!opts.parent;
      runLab(key, { level }).catch((e) => console.error(e));
      return true;
    },
    last: () => (Clinic.last ? { key: Clinic.last.key, level: Clinic.last.level, done: Clinic.last.done, stars: Clinic.last.stars || null, misses: Clinic.last.ctx.misses, voice: Clinic.last.ctx.voiceLog, grades: Clinic.last.ctx.grades } : null),
    labs: () => Clinic.labs.map((e) => e.key),
    panel: () => UI.panelOpen(),
  };

  /* ---------------- boot ---------------- */
  global.addEventListener("load", async () => {
    UI.init();
    $("#btn-home").addEventListener("click", showLab);
    $("#cl-ask").addEventListener("click", () => {
      Cook.sfx.click();
      Clinic.Ask.press();
    });
    await Cook.load();
    Cook.onSceneReady = () => showLab();
    new Phaser.Game({
      type: Phaser.AUTO,
      parent: "game",
      width: 1600,
      height: 900,
      backgroundColor: "#e9dcc4",
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      input: { activePointers: 1 },
      scene: [Cook.CookScene],
    });
  });
})(window);

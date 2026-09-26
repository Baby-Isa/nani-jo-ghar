/*
 * The clinic's runner (DOM): a patient through the five stages, then the
 * shared end-of-round screen (js/shared/results.js: time, accuracy, hints,
 * then the word review), and a clinic morning of patients with "Close the
 * clinic" at the end (docs/modes/clinic-design.md P1, P6, P8).
 *
 *   await Clinic.Run.load();                       // data, art, the body
 *   const scr = Clinic.Screen.build(root);
 *   await Clinic.Run.morning(scr, {session});      // the saved session when omitted
 *   await Clinic.Run.patient(scr, plan, {results}) // one patient
 *   Clinic.Run.stage(scr, "pharmacy", plan)        // one stage alone (the lab)
 *
 * Progress lives in UIStore("clinic", "state"): {session, levels per stage,
 * album, coins}. After a morning, a stage whose rows were all right goes up a
 * level (ClinicPipeline.levelUp). The first-ever session is session 1.
 */
(function (global) {
  "use strict";
  const Clinic = global.Clinic;
  const Kit = Clinic.Kit;
  const S = Clinic.Stages;
  const h = Kit.h;
  const PL = () => global.ClinicPipeline;

  const R = (Clinic.Run = { data: null, log: [], last: null, opts: { speak: true, onboard: true } });

  R.load = async function () {
    await Clinic.HealHost.loadBase();
    const pj = await Kit.loadJSON("data/clinic/pipeline.json");
    R.data = PL().prepare(pj, Clinic.HealHost.clinic);
    R.bodyFile = Clinic.HealHost.bodyFile;
    return R;
  };
  R.games = () => Clinic.Heal.ids();

  /* ---------------- saved state ---------------- */
  const DEF = () => ({ session: 1, levels: { waiting: 1, diagnosis: 1, pharmacy: 1, heal: 1, sendoff: 1 }, album: [], coins: 0 });
  R.state = function () {
    try {
      const s = global.UIStore && global.UIStore.get("clinic", "state");
      return Object.assign(DEF(), s || {});
    } catch (e) {
      return DEF();
    }
  };
  R.save = function (s) {
    try {
      if (global.UIStore) global.UIStore.set("clinic", "state", s);
    } catch (e) {
      /* labs without storage */
    }
  };
  R.reset = () => R.save(DEF());

  R.env = function (screen, plan, o = {}) {
    const fig = Clinic.Figure.make(R.bodyFile, { kind: plan.kind, colour: plan.colour, size: plan.size });
    return {
      screen,
      data: R.data,
      level: plan.level,
      fig,
      bodyFile: R.bodyFile,
      speak: o.speak != null ? o.speak : R.opts.speak,
      onboard: o.onboard != null ? o.onboard : R.opts.onboard,
      grandparent: o.grandparent != null ? !!o.grandparent : !!R.opts.grandparent,
      first: !!plan.first,
      rng: o.rng || PL().rng(o.seed || Math.floor(Math.random() * 1e9)),
    };
  };

  /** Run one stage of a plan (the lab, and the patient below). */
  R.stage = async function (screen, name, plan, env) {
    const sp = plan.stages[name];
    screen.setLevel(sp.level);
    env.level = sp.level;
    const t0 = Date.now();
    const res = await S[name].run(env, sp, plan);
    S.endOnboard();
    res.timeMs = Date.now() - t0;
    R.log.push({ stage: name, variant: sp.variant || null, level: sp.level, rows: res.rows.map((r) => ({ id: r.id, ok: r.ok, tested: r.tested })) });
    return res;
  };

  /** The patient's accuracy: every tested row of the five stages, plus the healing game's own right/total. */
  R.score = function (results) {
    const marks = [];
    ["waiting", "diagnosis", "pharmacy"].forEach((s) => (results[s] ? results[s].rows : []).forEach((r) => r.tested && marks.push(r.ok)));
    const hl = results.heal && results.heal.heal;
    if (hl && hl.total) for (let i = 0; i < hl.total; i++) marks.push(i < hl.right);
    (results.sendoff ? results.sendoff.rows : []).forEach((r) => r.tested && marks.push(r.ok));
    return { right: marks.filter(Boolean).length, total: marks.length, marks };
  };

  /** One patient through the pipeline, then the end-of-round screen. */
  R.patient = async function (screen, plan, o = {}) {
    const env = R.env(screen, plan, o);
    screen.resetHints();
    screen.trayWrap.classList.add("hidden");
    const t0 = Date.now();
    const results = {};
    for (const name of PL().STAGES) {
      if (o.only && !o.only.includes(name)) continue;
      results[name] = await R.stage(screen, name, plan, env);
    }
    const timeMs = Date.now() - t0;
    const sc = R.score(results);
    const healWords = results.heal && results.heal.heal ? results.heal.heal.words : [];
    const words = PL().words(R.data, plan, healWords);
    const out = { plan, results, timeMs, right: sc.right, total: sc.total, marks: sc.marks, hints: screen.hints, words };
    R.last = out;
    env.fig.destroy();
    if (o.results !== false && global.Results) {
      out.shown = await global.Results.show({
        mode: "clinic",
        game: plan.ailment,
        level: plan.level,
        timeMs,
        right: sc.right,
        total: sc.total,
        marks: sc.marks,
        hints: screen.hints,
        words,
        sound: !Kit.fast,
        container: document.body,
      });
    }
    return out;
  };

  /** A clinic morning (P8): the session's patients, then "Close the clinic". */
  R.morning = async function (screen, o = {}) {
    const st = R.state();
    const session = o.session || st.session;
    const rng = PL().rng(o.seed || Math.floor(Math.random() * 1e9));
    const m = PL().morning(R.data, { session, levels: o.levels || st.levels, rng, games: R.games(), speak: o.speak != null ? o.speak : R.opts.speak });
    R.morningPlan = m;
    const outs = [];
    // UI that appears when first needed (UX s8): the light bulb stays hidden through the first-ever patient
    const bulbKey = "clinic/bulb";
    if (global.Onboard && m.entry.first) global.Onboard.await(screen.bulb.btn, bulbKey);
    else if (global.Onboard) global.Onboard.fadeIn(screen.bulb.btn, bulbKey);
    for (let i = 0; i < m.patients.length; i++) {
      const plan = m.patients[i];
      const out = await R.patient(screen, plan, Object.assign({}, o, { rng }));
      outs.push(out);
      st.album = Array.from(new Set((st.album || []).concat([`${plan.kind}:${plan.ailment}`])));
      st.coins = (st.coins || 0) + 1 + (out.right === out.total && out.total > 0 ? 1 : 0);
      if (i < m.patients.length - 1) {
        screen.clearStage();
        screen.clearActions();
        screen.card.setRows([]);
        await S.button(screen, S.line({ data: R.data }, "nextpatient"));
      }
    }
    // level up per stage (a stage whose tested rows were all right this morning)
    const perStage = outs.map((x) => {
      const r = {};
      Object.entries(x.results).forEach(([s, v]) => (r[s] = s === "heal" ? [{ ok: !v.heal || !v.heal.total || v.heal.right === v.heal.total, tested: !!(v.heal && v.heal.total) }] : v.rows));
      return r;
    });
    if (!o.noSave) {
      st.levels = m.entry.levels && session <= 2 ? Object.assign({}, st.levels) : PL().levelUp(st.levels, perStage);
      st.session = session + 1;
      R.save(st);
    }
    await R.close(screen, outs, st);
    return { morning: m, outs, state: st };
  };

  /** "Close the clinic": the receipt (patients seen, stickers, pocket money). */
  R.close = async function (screen, outs, st) {
    const stage = screen.clearStage();
    screen.clearActions();
    screen.card.setTitle("", S.doctorFace());
    screen.card.setRows([]);
    const r = h("div", "cl-receipt", stage);
    h("div", "cl-receipt-title", r, "🏥");
    const list = h("div", "cl-receipt-list", r);
    outs.forEach((o) => {
      const row = h("div", "cl-receipt-row", list);
      row.appendChild(S.personFace(o.plan.kind, "happy"));
      h("span", "cl-receipt-item", row).appendChild(Kit.icon(o.plan.stages.pharmacy.asked[0], null));
      h("span", `cl-receipt-mark${o.right === o.total ? " gold" : ""}`, row, o.right === o.total ? "★" : "☆");
    });
    h("div", "cl-receipt-coins", r, `🪙 ${st.coins || 0}`);
    await S.button(screen, S.line({ data: R.data }, "close"));
  };
})(typeof self !== "undefined" ? self : this);

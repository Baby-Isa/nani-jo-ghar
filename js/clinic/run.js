/*
 * The clinic's stage runner (DOM). The one game host runs the rounds (js/clinic/main.js: a patient, a
 * morning, a lab stage); this file loads the data and runs ONE stage of a patient's plan on the clinic's
 * screen, and draws "Close the clinic" at the end of a morning.
 *
 *   await Clinic.Run.load();                       // data, art, the body
 *   Clinic.Run.stage(scr, "pharmacy", plan, env)   // one stage of a plan
 *
 * Progress lives in the clinic's own save namespace ("clinic": {state: {session, levels per stage, album}}).
 * After a morning, a stage whose rows were all right goes up a level (ClinicPipeline.levelUp).
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
    // clinic v2: the item overrides (the apple, the tube, the torch) reach every picture; the new rooms
    Object.entries(pj.items || {}).forEach(([id, it]) => id !== "_about" && (Kit.ITEMS[id] = Object.assign({}, Kit.ITEMS[id] || {}, it)));
    Clinic.Scenes = await Kit.loadJSON("data/clinic/scenes-v2.json");
    // D11: the light bulb's time per level, from data
    if (pj.bulb_ms) Object.entries(pj.bulb_ms).forEach(([l, ms]) => /^\d+$/.test(l) && (Kit.BULB_MS[l] = ms));
    R.bodyFile = Clinic.HealHost.bodyFile;
    return R;
  };
  R.games = () => Clinic.Heal.ids();

  /* ---------------- saved state ---------------- */
  // R5: the clinic's own namespace in the one save ("clinic": session, stage levels, album). No coins: they are the
  // one purse's (decision 20). Read once from the old place (ui.clinic.state) when the namespace is still empty.
  const DEF = () => ({ session: 1, levels: { waiting: 1, diagnosis: 1, pharmacy: 1, heal: 1, sendoff: 1 }, album: [] });
  const SAVE = () => (global.Save && typeof global.Save.get === "function" ? global.Save : null);
  R.state = function () {
    try {
      const sv = SAVE();
      let s = sv ? (sv.get("clinic") || {}).state : null;
      if (!s && global.UIStore) s = global.UIStore.get("clinic", "state");
      const out = Object.assign(DEF(), s || {});
      delete out.coins;
      return out;
    } catch (e) {
      return DEF();
    }
  };
  R.save = function (s) {
    try {
      const sv = SAVE();
      const st = Object.assign({}, s);
      delete st.coins;
      if (sv && sv.update) sv.update("clinic", (d) => Object.assign({}, d, { state: st }));
      else if (global.UIStore) global.UIStore.set("clinic", "state", st);
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

  /** "Close the clinic": the receipt (patients seen, stickers, pocket money). */
  R.close = async function (screen, outs, o = {}) {
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
    h("div", "cl-receipt-coins", r, `🪙 ${o.coins || 0}`);
    await S.button(screen, S.line({ data: R.data }, "close"));
  };
})(typeof self !== "undefined" ? self : this);

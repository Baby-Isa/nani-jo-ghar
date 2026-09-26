/*
 * Combined station: the Mishkaki grill.
 *
 * Wave 6 (docs/UX-PRINCIPLES.md 5 and 6): one job at a time. First thread
 * every skewer (the thread mechanic, the whole screen): tap the bowls, each
 * finished skewer waits beside the board. Then the big button, "Go to the
 * barbecue", takes them to the rack by the grill (the grill mechanic, the
 * whole screen): tap one to put it on, turn it on the green twice, lift it
 * onto the plate. Tick Done when the plate is ready. No chips on the grill
 * any more (frying has its own station, samosa + fry).
 *
 * The juggle (thread while the grill cooks, both on one screen) is the
 * optional hard level (`juggle: true`, level 4 in data), never level 1:
 * the threading board on the left feeds the rack on the right.
 *
 * The order (recipes.mishkaki in data/cook.json) says how many skewers of
 * each kind, in Kutchi ("ba lakri gos, hakri lakri boga"), and a mixed skewer's
 * pieces in order. Nothing on screen shows the count or the kinds: every
 * piece bowl is always there and the rack has fixed slots per level. The
 * ear star: pieces that fit the order, the right number of each kind on the
 * plate, a mixed skewer in the spoken order. The hand star: every turn and
 * lift (burnt or undercooked costs it).
 *
 * Levels: data/stations/mishkaki-grill.json (which level each part runs at,
 * and `juggle`). The order's shape per level is the recipe's slot data.
 * Returns {plate, art, count} for the recipe (serve the plate).
 */
(function (global) {
  const Cook = global.Cook;
  const Mech = Cook.Mech;
  const St = Cook.Stations;

  Mech.combined("mishkaki-grill", {
    station: "mishkaki-grill",
    view: "marble",
    dataFile: "data/stations/mishkaki-grill.json",
    zones: [
      { id: "thread", mech: "thread", region: [0, 0, 470, 900], footprint: { x: 0, y: 0, w: 470, h: 900 }, backdrop: "bg:wood", out: "skewers" },
      { id: "grill", mech: "grill", region: [470, 0, 1130, 900], footprint: { x: 470, y: 0, w: 1130, h: 900 }, in: "skewers" },
    ],
    async run(host, p) {
      const order = { skewers: p.skewers || {}, pattern: p.pattern || [] };
      return host.knobs.juggle ? juggle(host, order) : oneJobAtATime(host, order);
    },
  });

  /** Thread them all, "Go to the barbecue", grill them: each job on the whole screen. */
  async function oneJobAtATime(host, order) {
    const S = host.S;
    const ctx = host.ctx;
    // the two-zone screen isn't used: each job gets the whole picture
    Object.values(host.zones).forEach((z) => z.close());
    const lv = (id) => ((host.knobs.zones || {})[id] || {}).level || host.level;
    const phases = (Cook.data.stations["mishkaki-grill"] || {}).phases || {};
    const rack = Mech.knobs("grill", { level: lv("grill") }).rack;

    // 1. thread every skewer
    await St.begin(S, ctx, "thread", "marble");
    if (phases.thread) Cook.UI.gist(phases.thread);
    if (ctx.nextStep) ctx.nextStep("Skewer");
    const tz = Mech.zone(S, ctx, { id: "thread", level: lv("thread") });
    const made = await Mech.run("thread", tz, Object.assign({ handoff: { label: phases.go || "Go to the barbecue", max: rack } }, order));
    tz.close();
    St.end();

    // 2. the barbecue: the skewers wait on the rack
    await St.begin(S, ctx, "grill", "marble");
    if (phases.grill) Cook.UI.gist(phases.grill);
    if (ctx.nextStep) ctx.nextStep("Grill");
    const gz = Mech.zone(S, ctx, { id: "grill", level: lv("grill") });
    const r = await Mech.run("grill", gz, Object.assign({ rackItems: (made && made.items) || [] }, order));
    gz.close();
    St.end();
    return r;
  }

  /** The optional hard level: thread on the left while the grill on the right cooks. */
  async function juggle(host, order) {
    const ctx = host.ctx;
    const line = {};
    const until = new Promise((r) => (line.stop = r));
    const tz = host.zones.thread;
    const gz = host.zones.grill;
    if (ctx.nextStep) ctx.nextStep("Skewer");
    line.onGrill = () => ctx.nextStep && ctx.nextStep("Grill");
    const threading = Mech.run("thread", tz, Object.assign({ line, until, layout: { bowlsX: 170, boardX: 372 } }, order));
    const r = await Mech.run("grill", gz, Object.assign({ line, dx: 0 }, order));
    line.stop();
    await threading;
    host.channel("skewers").close();
    tz.close();
    gz.close();
    return r;
  }

  Mech.lab("mishkaki-grill", {
    name: "Mishkaki grill",
    verb: "Thread, then the barbecue (level 4: both at once)",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.mishkaki.make(Cook.pick(["nana", "ma", "cousin"]), { level: L.level });
      L.card(d, R.mishkaki.steps(d));
      await L.station("mishkaki-grill", { skewers: d.skewers, pattern: d.pattern });
    },
  });
})(window);

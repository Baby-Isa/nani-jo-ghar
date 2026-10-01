/*
 * Combined station: Sekelo (formerly the Mishkaki grill; design system §15, Sekelo v2).
 *
 * Wave 6 (docs/design-language/ux-principles.md 5 and 6): one job at a time. First thread
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
 * accuracy badge: pieces that fit the order, the right number of each kind on the
 * plate, a mixed skewer in the spoken order. The hand job (not scored): every turn and
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
      // two different mixes (design system 12, level 4): both patterns, one skewer of each
      const order = { skewers: p.skewers || {}, pattern: p.pattern2 ? [p.pattern || [], p.pattern2] : p.pattern || [], who: p.who };
      return host.knobs.juggle ? juggle(host, order) : oneJobAtATime(host, order);
    },
  });

  /**
   * Sekelo v2 (§15): thread them all, "to the grill", grill them: each job on the whole screen. Then serve
   * and taste (§14a): right, they praise it; wrong, the plate comes back empty and the child makes it again
   * (threading first), the first try already logged for the end review.
   */
  async function oneJobAtATime(host, order) {
    const S = host.S;
    const ctx = host.ctx;
    // the two-zone screen isn't used: each job gets the whole picture
    Object.values(host.zones).forEach((z) => z.close());
    const lv = (id) => ((host.knobs.zones || {})[id] || {}).level || host.level;
    const phases = (Cook.data.stations["mishkaki-grill"] || {}).phases || {};
    const rack = Mech.knobs("grill", { level: lv("grill") }).rack;
    const who = order.who || (ctx.order && ctx.order.who) || "nana";
    // Sekelo v2's art loads while the order card is up (a slow phone mustn't meet an empty scene)
    const SK = Cook.Skewer;
    const kThread = Mech.knobs("thread", { level: lv("thread") });
    await SK.loadArt(S, SK.pieceIds().concat(kThread.decoyPool || []));
    await SK.faceArt(S, who);
    for (let attempt = 0; ; attempt++) {
      // 1. thread every skewer
      await St.begin(S, ctx, "thread", "marble");
      if (phases.thread && !attempt) Cook.UI.gist(phases.thread);
      if (ctx.nextStep) ctx.nextStep("Skewer");
      const tz = Mech.zone(S, ctx, { id: "thread", level: lv("thread") });
      const made = await Mech.run("thread", tz, Object.assign({ handoff: { label: phases.go || "to the grill", max: rack } }, order));
      tz.close();
      St.end();

      // 2. the grill: the skewers wait on the rack; then the plate goes to them to taste
      await St.begin(S, ctx, "grill", "marble");
      if (phases.grill && !attempt) Cook.UI.gist(phases.grill);
      if (ctx.nextStep) ctx.nextStep("Grill");
      const gz = Mech.zone(S, ctx, { id: "grill", level: lv("grill") });
      const r = await Mech.run("grill", gz, Object.assign({ rackItems: (made && made.items) || [], shelf: made && made.shelf, taste: { who }, retry: attempt > 0, lastTry: attempt >= 2 }, order));
      gz.close();
      St.end();
      if (!r || !r.redo) return r;
    }
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
    name: "Sekelo",
    verb: "Thread, then the barbecue (level 4: both at once)",
    async run(L) {
      const R = Cook.Recipes;
      // the lab's card is always Nana's: it's Nana who tastes it
      const who = (L.ctx.order && L.ctx.order.who) || "nana";
      const d = R.mishkaki.make(who, { level: L.level });
      L.card(d, R.mishkaki.steps(d));
      await L.station("mishkaki-grill", { skewers: d.skewers, pattern: d.pattern, pattern2: d.pattern2, who });
    },
  });
})(window);

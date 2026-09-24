/*
 * Combined station: the Mishkaki grill.
 *
 * One screen, two zones: the threading board on the left (the thread
 * mechanic, on a wooden worktop) and the rack, the grill and the plate on
 * the right (the grill mechanic). Threading feeds the grill: each skewer
 * you finish goes to the rack (when it has room); tap one on the rack to
 * put it on the grill, where it has its own ring; turn it on the green
 * twice, then lift it onto the plate. Tick Done when the plate is ready.
 *
 * The order (recipes.mishkaki in data/cook.json) says how many skewers of
 * each kind, in Kutchi ("bo ghos, hikdo vegetable"), and at level 3 a
 * mixed skewer's pieces in order. Nothing on screen shows the count or the
 * kinds: every piece bowl is always there, the rack and grill have fixed
 * slots per level, and the chips basket is always offered. The ear star:
 * pieces that fit the order, the right number of each kind on the plate,
 * a mixed skewer in the spoken order, chips or not. The hand star: every
 * turn and lift (burnt or undercooked costs it).
 *
 * Levels: data/stations/mishkaki-grill.json (which level each zone runs
 * at; the grill's levels add spots and speed). The order's shape per level
 * (one skewer, two, three or four with mixed) is the recipe's slot data.
 * Returns {plate, chips, art} for the recipe (fry the chips if you added
 * them; serve the plate).
 */
(function (global) {
  const Cook = global.Cook;
  const Mech = Cook.Mech;

  Mech.combined("mishkaki-grill", {
    station: "mishkaki-grill",
    view: "marble",
    dataFile: "data/stations/mishkaki-grill.json",
    zones: [
      { id: "thread", mech: "thread", region: [0, 0, 420, 900], footprint: { x: 0, y: 0, w: 420, h: 900 }, backdrop: "bg:wood", out: "skewers" },
      { id: "grill", mech: "grill", region: [420, 0, 1180, 900], footprint: { x: 420, y: 0, w: 1180, h: 900 }, in: "skewers" },
    ],
    async run(host, p) {
      const ctx = host.ctx;
      const line = {};
      const until = new Promise((r) => (line.stop = r));
      const tz = host.zones.thread;
      const gz = host.zones.grill;
      if (ctx.nextStep) ctx.nextStep("Skewer");
      line.onGrill = () => ctx.nextStep && ctx.nextStep("Grill");
      const order = { skewers: p.skewers || {}, pattern: p.pattern || [] };
      const threading = Mech.run("thread", tz, Object.assign({ line, until, layout: { bowlsX: 100, boardX: 290 } }, order));
      const r = await Mech.run("grill", gz, Object.assign({ line, chips: p.chips == null ? undefined : !!p.chips, dx: 0 }, order));
      line.stop();
      await threading;
      host.channel("skewers").close();
      tz.close();
      gz.close();
      return r;
    },
  });

  Mech.lab("mishkaki-grill", {
    name: "Mishkaki grill",
    verb: "Combined: thread, grill, plate",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.mishkaki.make(Cook.pick(["nana", "ma", "cousin"]), { level: L.level });
      L.card(d, R.mishkaki.steps(d));
      await L.station("mishkaki-grill", { skewers: d.skewers, pattern: d.pattern, chips: d.chips });
    },
  });
})(window);

/*
 * Combined station (lab-only proof): Roll -> Tawa.
 *
 * Two zones side by side on one screen: the chakla (the roll mechanic) on
 * a wooden board on the left, the tawa (the tawa mechanic) on the hob on
 * the right. Each rolled maani is routed through the "rolled" channel and
 * flies over to the tawa, which cooks it while you roll the next. One set
 * of stars: the roll zone says whether you made as many as they asked
 * for (ear); every roll and every flip scores the hand star.
 *
 * It proves the host; the real Maani line (dough bowls -> chakla -> tawa,
 * big/small, two tawas) is js/cook/stations/maani-line.js, next wave.
 * Levels: data/stations/roll-tawa.json (which level each zone runs at).
 */
(function (global) {
  const Cook = global.Cook;
  const Mech = Cook.Mech;

  Mech.combined("roll-tawa", {
    station: "roll-tawa",
    view: "hob",
    dataFile: "data/stations/roll-tawa.json",
    zones: [
      {
        id: "roll",
        mech: "roll",
        region: [0, 0, 800, 900],
        backdrop: "bg:wood",
        // a tighter layout than the full-screen roll station
        footprint: { x: 60, y: 170, w: 900, h: 700 },
        out: "rolled",
        params: (p) => ({ count: p.count, at: [520, 430], spareAt: [150, 780], stackAt: [880, 790] }),
      },
      {
        id: "tawa",
        mech: "tawa",
        region: [800, 0, 800, 900],
        // design coords = screen coords here, so the tawa sits on the hob's burner
        footprint: { x: 800, y: 0, w: 800, h: 900 },
        in: "rolled",
        params: (p, host) => {
          const two = Mech.knobs("tawa", { level: host.zones.tawa.level }).tawas > 1;
          return two
            ? { spots: [[1030, 250], [1330, 520]], size: 0.7, plateAt: [1010, 790], spatulaAt: [1500, 760] }
            : { spots: [["burner-right", 0, 0]], plateAt: [1200, 790], spatulaAt: [1480, 660] };
        },
      },
    ],
  });

  Mech.lab("roll-tawa", {
    name: "Roll → Tawa",
    verb: "Combined (proof)",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.maani.make();
      L.card(R.maani.lines(d, 0), ["Roll", "Tawa"]);
      await L.station("roll-tawa", { count: d.count });
    },
  });
})(window);

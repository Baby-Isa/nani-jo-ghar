/*
 * T2 Lay the dastarkhwan (D.2): tableware to people on the cushions and to
 * places on the cloth (the H view, D.9.2). `place` + `stack` + `check`;
 * Simba's `paw` from level 2; at level 3 fetch-and-lay: a shelf zone
 * (`fetch`, out "fetched") beside the cloth zone (in "fetched"), Cook's
 * two-zone routing.
 */
(function (global) {
  const Tidy = global.Tidy;
  Tidy.Game.define("dastarkhwan", {
    name: "Lay the dastarkhwan",
    prepare(H) {
      if (H.kn.fetch) Tidy.fetchPrepare(H);
    },
    zones(H) {
      const lay = { id: "cloth", main: true, mechs: ["place", "stack", "check", "paw"], params: { force: H.opts.paw }, in: "fetched" };
      if (!H.kn.fetch) return [Object.assign(lay, { region: [0, 0, 1600, 900] })];
      return [
        { id: "shelf", region: [0, 0, 400, 900], cls: "shelfzone", mechs: ["fetch"], out: "fetched" },
        Object.assign(lay, { region: [400, 0, 1200, 900] }),
      ];
    },
  });
})(window);

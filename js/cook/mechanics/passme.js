/*
 * Mechanic: "pass me" (Nani interrupts). She slides in with look-alikes
 * and asks for any word you've met, weakest first. Relaxed pauses the
 * cooking; Busy keeps it cooking. Recipes don't call this directly: they
 * say where Nani *may* ask ({"do": "interrupt"} -> ctx.maybePassMe), and a
 * mechanic can offer a moment with z.passMeAfter(ms).
 * Knobs (data.mechanics.passme): options (how many to choose from).
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  Mech.define("passme", {
    api: "passMe",
    async run(z, { want } = {}, k) {
      const ctx = z.ctx;
      if (!want) {
        // anything the player has met (spaced review), weakest first
        const met = Object.keys(Cook.save.words).filter((id) => Cook.data.words[id] && !id.startsWith("num-") && (Cook.data.words[id].heap || Cook.data.words[id].image));
        const pool = met.length >= 3 ? met : Object.keys(Cook.data.words).filter((id) => Cook.data.words[id].heap);
        pool.sort((a, b) => Cook.wordStage(a) - Cook.wordStage(b) + (Math.random() - 0.5));
        want = pool[0];
      }
      const options = [want].concat(St.lookalikes(want, k.options - 1));
      const prevExpect = Cook.expect;
      const relaxed = Cook.save.mode !== "busy";
      if (relaxed) Cook.paused = true;
      Cook.sfx.pop();
      Cook.markSeen(want);
      Cook.interrupting = true;
      let r;
      try {
        r = await UI.passMe(want, options, { hide: St.hideKnown(ctx) });
      } finally {
        Cook.interrupting = false;
        Cook.paused = false;
      }
      if (r.misses) Cook.markMiss(want);
      else Cook.markRight(want);
      z.listen(r.misses === 0, `pass me ${want}`);
      ctx.result.passMe = (ctx.result.passMe || 0) + 1;
      // whatever the stations want now (a ring may have run on in Busy)
      Cook.Hub.republish(prevExpect);
    },
  });

  Mech.lab("passme", {
    name: "Pass me",
    verb: "Nani interrupts",
    async run(L) {
      await L.S.setView("marble");
      L.card([Lang.line("give", Lang.phrase(["cook-khun"]))], ["Pass me"]);
      await L.station("passme", {});
    },
  });
})(window);

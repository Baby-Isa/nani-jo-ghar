/*
 * Twist: Simba's paw (new; D.3, M11). From level 2, mid-board, a paw
 * sweeps a random strip: tap it in time to shoo him (hand skill), or it
 * knocks 2-3 placed things in that strip into a heap on the tray. The strip
 * is random and correctness is ignored (it never marks things right or
 * wrong), and nothing is replayed (6.4). The Neat star survives if he was
 * shooed or every knocked thing was put somewhere again.
 * Knobs (data/tidy.json mechanics.paw): chance, knock [min, max], warnMs, stripW.
 * Params: force (the lab's Paw button).
 */
(function (global) {
  const Tidy = global.Tidy;
  const U = () => Tidy.Rules.util;

  Tidy.Mech.define("paw", {
    run(z, p, k) {
      const H = z.host;
      if (!(p.force || (H.kn.paw && Math.random() < k.chance))) return {};
      let drops = 0;
      let armed = false;
      const knocked = new Set();
      H.on("drop", ({ iid }) => {
        knocked.delete(iid);
        if (++drops >= 2 && !armed) {
          armed = true;
          setTimeout(() => !H.done && !H.dead && sweep(), (2500 + Math.random() * 4000) / (global.Cook.speed || 1));
        }
      });
      H.on("done", () => {
        if (knocked.size) H.loseNeat("Simba's mess");
      });
      async function sweep() {
        const x0 = 60 + Math.random() * (1600 - k.stripW - 120);
        const paw = Tidy.el("div", "paw", z.el);
        Object.assign(paw.style, { left: `${x0}px`, top: "300px", width: `${k.stripW}px` });
        paw.textContent = "🐾";
        let shooed = false;
        paw.addEventListener("pointerdown", (e) => {
          e.stopPropagation();
          shooed = true;
        });
        const prev = Tidy.exp;
        const c = z.toClient(x0 + k.stripW / 2, 360);
        Tidy.expect({ what: "paw", x: c.x, y: c.y, then: prev });
        const until = Date.now() + (k.warnMs * 2.5) / (global.Cook.speed || 1);
        while (!shooed && Date.now() < until && !H.done) await Tidy.wait(50);
        paw.remove();
        Tidy.expect(prev);
        if (shooed) {
          Tidy.nani(Tidy.frame("shoo"), { speak: false, hold: 600 });
          Tidy.sfx("puff");
          return;
        }
        const inStrip = Object.keys(H.pl).filter((i) => {
          const s = H.R.B.byId[H.pl[i]];
          return s && s.x >= x0 && s.x <= x0 + k.stripW;
        });
        const n = k.knock[0] + Math.floor(Math.random() * (k.knock[1] - k.knock[0] + 1));
        U().shuffle(Math.random, inStrip)
          .slice(0, n)
          .forEach((i) => {
            H.move(i, "tray", { knocked: true, swapped: true });
            knocked.add(i);
          });
        if (knocked.size) {
          Tidy.sfx("whoosh");
          Tidy.nani(Tidy.frame("mess"), { speak: true });
        }
      }
      return {};
    },
  });

  Tidy.Mech.lab("paw", { name: "Simba's paw", verb: "Tap to shoo him", game: "putaway", level: 2, paw: true });
})(window);

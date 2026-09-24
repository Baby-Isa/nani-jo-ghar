/*
 * Mechanic: pour. Hold to pour; let go in the green band. Two forms:
 *  - from a jug (params.liquid): water, milk… into params.vessel;
 *  - from a vessel (params.source) into a cup (params.vessel): the chai
 *    pan into each cup, the Chai tray's cups.
 * The liquid rises inside the vessel and the sound rises in pitch; Nani
 * says "Enough!" as it reaches the band while the word is new.
 * Kutchi: which liquid (water/milk), "no milk"; later half/full.
 * Knobs (data.mechanics.pour): rate, bandScale, enoughUntilStage,
 * spillScore, auto (stops at the line), instant (a machine does it),
 * specialJug (liquids whose jug is drawn upgraded). Profiles: water, milk, cup.
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  const band = (target, k) => {
    const [lo, hi] = target;
    if (!k.bandScale || k.bandScale === 1) return [lo, hi];
    const c = (lo + hi) / 2;
    const h = ((hi - lo) / 2) * k.bandScale;
    return [c - h, c + h];
  };

  Mech.define("pour", {
    api: "pourInto",
    profile: (p) => (p.source ? "cup" : p.liquid === "cook-paani" || !p.liquid ? "water" : "milk"),
    async run(z, p, k) {
      return p.source ? fromVessel(z, p, k) : fromJug(z, p, k);
    },
  });

  async function fromJug(z, { vessel, liquid = "cook-paani", color = 0x9fd3f0, from = 0, fromLevel = false, target = [0.45, 0.62], jugAt, speak = true }, k) {
    const S = z.S;
    const ctx = z.ctx;
    color = St.color(color);
    if (fromLevel) from = vessel.level;
    const at = St.pt(jugAt, { x: 1300, y: St.STRIP_Y });
    const jugKey = Cook.data.words[liquid] && Cook.data.words[liquid].image ? Cook.data.words[liquid].image : "water-jug";
    const jug = S.prop(jugKey, z.X(at.x), z.Y(at.y + 60), z.L(170), z.L(200), { depth: D.item + 1 });
    if ((k.specialJug || []).includes(liquid)) S.special(jug);
    jug.label = S.label(jug, liquid);
    const home = { x: jug.x, y: jug.y, a: jug.angle };
    const [lo, hi] = band(target, k);
    vessel.drawTarget(lo, hi);
    let saidEnough = false;
    const stream = S.track(S.add.graphics().setDepth(D.fx));
    const surf = () => vessel.surface();
    if (speak) z.say(Lang.wordLine(liquid), { hide: St.hideKnown(ctx) }).catch(() => {});
    const v = await S.pour(jug, {
      rate: k.rate,
      auto: !!k.auto,
      lo,
      hi,
      io: z.io,
      onStart: () => S.tweens.add({ targets: jug, x: vessel.x + vessel.rimRx * 0.9, y: vessel.y - vessel.rimRy - z.L(40), angle: -60, duration: 220 }),
      onStop: () => {
        stream.clear();
        S.tweens.add({ targets: jug, x: home.x, y: home.y, angle: home.a, duration: 260 });
      },
      onLevel: (lv) => {
        const L = from + (1 - from) * Math.min(1.08, lv);
        vessel.setLiquid(L, color);
        const q = surf();
        stream.clear();
        stream.lineStyle(z.L(10), color, 0.8);
        stream.lineBetween(jug.getBounds().left + z.L(10), jug.getBounds().top + z.L(20), q.x + z.L(20), q.y);
        if (!saidEnough && lv >= lo && (ctx.guided || Cook.wordStage(liquid) <= k.enoughUntilStage)) {
          saidEnough = true;
          z.say(Lang.line("enough"), { ms: 900 }).catch(() => {});
        }
        if (L > 1.0 && !vessel.spilled) {
          vessel.spilled = true;
          S.burst(vessel.x + vessel.rimRx, vessel.y, [color, 0xffffff], 14, z.L(60));
        }
      },
    });
    const score = vessel.spilled ? k.spillScore : S.bandScore(v, lo, hi);
    z.skill(score, "pour");
    S.verdict(vessel.x, vessel.y - vessel.rimRy - z.L(90), score, { bad: v < lo ? "too-little" : "too-much" });
    vessel.clearTarget();
    z.progress({ poured: liquid, level: v });
    await Cook.wait(450);
    return v;
  }

  async function fromVessel(z, { source, vessel, color = 0xc49468, target = [0.72, 0.9], steam = 0 }, k) {
    const S = z.S;
    color = St.color(color);
    let v;
    if (k.instant) {
      await Cook.wait(k.instantMs);
      vessel.setLiquid(k.instantLevel, color);
      z.skill(100, "pour");
      v = k.instantLevel;
    } else {
      const [lo, hi] = band(target, k);
      v = await S.pour(source, {
        rate: k.rate,
        lo,
        hi,
        io: z.io,
        onLevel: (lv) => vessel.setLiquid(lv, color),
        onStart: () => vessel.drawTarget(lo, hi),
      });
      vessel.clearTarget();
      const sc = v > 1 ? k.spillScore : S.bandScore(v, lo, hi);
      z.skill(sc, "pour");
      S.verdict(vessel.rim.x, vessel.rim.y - z.L(90), sc, { bad: v < lo ? "too-little" : "too-much" });
    }
    if (steam) S.steam(vessel.rim.x, vessel.rim.y - z.L(30), steam);
    z.progress({ poured: "cup", level: v });
    return v;
  }

  Mech.lab("pour", {
    name: "Pour",
    verb: "To the line",
    async run(L) {
      L.card([Lang.wordLine("cook-paani")], ["pour"]);
      const z = await L.scene("pour", "hob");
      const pan = St.vessel(L.S, "pan", z.X(St.BURNER.left.x), z.Y(St.BURNER.left.y - 30), 1.35 * z.k);
      await L.run("pour", z, { vessel: pan, liquid: "cook-paani", target: [0.42, 0.58] });
    },
  });
})(window);

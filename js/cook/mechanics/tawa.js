/*
 * Mechanic: tawa (flip and puff). A ring on the chapati fills like a
 * clock; tap in the green and the spatula flips it; tap again in the
 * green and it puffs. Then it goes onto the plate.
 *
 * Several tawas at once (knob `tawas`): each has its own ring and takes
 * the next chapati as soon as it's free. Standalone it cooks `n` chapatis;
 * in a zone with an `in` channel it cooks whatever arrives (flying the
 * rolled maani's sprite over) until the channel closes.
 * Items may carry tint (a dough colour) and size (a small maani is drawn
 * smaller); z.progress reports {cooked, item, score} as each one lands on
 * the plate (a stack that grows). Tapping anywhere on the tawa counts.
 * Params: n, spots/plateAt/spatulaAt (design coords, to re-lay it out),
 * size (tawa and chapati scale, e.g. 0.8 to fit two in a zone), art
 * {raw, half, done} (texture keys: a painted prop or a drawn key such as
 * "layer:<wordId>"; default the chapati), doneWord (verdict key for the
 * second tap, default "it-puffed").
 * Knobs (data.mechanics.tawa): band, rate, rate2, speedUp, burntScore,
 * tawas, passMeAfterMs, special.
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;
  const B = St.BURNER;
  // where the tawas sit, by how many there are
  const SPOTS = { 1: [B.right], 2: [B.left, B.right] };

  Mech.define("tawa", {
    api: "flip",
    station: "flip",
    view: "hob",
    footprint: { x: 200, y: 150, w: 1360, h: 740 },
    async run(z, { n = 0, spots, plateAt, spatulaAt, size = 1, art = {}, doneWord = "it-puffed" }, k) {
      const S = z.S;
      const tex = (key, dflt) => (!key ? dflt : S.textures.exists(key) ? key : S.tex(key));
      const RAW = tex(art.raw, "chapati-raw");
      const HALF = tex(art.half, "chapati-half");
      const DONE = tex(art.done, "chapati-puffed");
      const ks = z.k * size; // the tawa's own scale
      const list = (spots || SPOTS[k.tawas] || SPOTS[1]).map((p) => St.pt(p));
      const plate = St.pt(plateAt, { x: 360, y: St.STRIP_Y - 20 });
      const home = St.pt(spatulaAt, { x: 1300, y: 640 });
      // the whole tawa is a tap target too (a big one, for small fingers)
      const tws = list.map((sp) => {
        const tw = S.flat(S.tex("tawa"), z.X(sp.x), z.Y(sp.y), 470 * ks, 410 * ks, { depth: D.item - 1 });
        if (k.special) S.special(tw);
        return tw;
      });
      S.flat(S.tex("vessel:serving"), z.X(plate.x), z.Y(plate.y), z.L(300), z.L(200));
      const spat = S.hand("spatula", { x: z.X(home.x), y: z.Y(home.y), angle: -20, k: z.k });
      const [lo, hi] = k.band;
      const sizzle = Cook.sfx.sizzleLoop();
      S.loops.push(sizzle);
      const queue = z.in || Mech.queue(Array.from({ length: n }, (_, i) => ({ kind: "maani", i })));
      let started = 0;
      let served = 0;

      // an item's own colour (millet dough is greyer) times the browning
      const C = Phaser.Display.Color;
      const mul = (a, b) => {
        const x = C.IntegerToRGB(a);
        const y = C.IntegerToRGB(b);
        return C.GetColor(Math.round((x.r * y.r) / 255), Math.round((x.g * y.g) / 255), Math.round((x.b * y.b) / 255));
      };
      const BURNT = 0x8a6a55;
      const cookOne = async (wz, sp, item, i, tw) => {
        const x = z.X(sp.x);
        const y = z.Y(sp.y);
        const base = item.tint != null ? item.tint : 0xffffff;
        const sz = 0.7 * ks * (item.size || 1); // a small maani looks small on the tawa too
        let ch;
        if (item.sprite && item.sprite.active) {
          // routed from another zone: fly it over
          ch = item.sprite;
          ch.setDepth(D.item + 1);
          await S.fly(ch, x, y, { scale: sz, duration: 380 });
        } else ch = S.track(S.add.image(x, y, RAW).setScale(sz).setDepth(D.item + 1));
        ch.baseScale = sz;
        Cook.sfx.sizzle(0.4);
        if (i === 0) z.passMeAfter(k.passMeAfterMs);
        const v1 = await S.ring(ch, { r: 180 * ks, lo, hi, rate: k.rate * (1 + i * k.speedUp), io: wz.io, alsoTap: [tw], onLevel: (v) => ch.setTint(mul(base, C.GetColor(255, 255 - v * 45, 255 - v * 90))) });
        // the spatula slides under and flips it
        await Cook.tween(S, { targets: spat, x: x + z.L(40), y: y + z.L(30), duration: 120 });
        Cook.sfx.flip();
        await Cook.tween(S, { targets: ch, scaleY: 0.02 * ks, duration: 110 });
        ch.setTexture(HALF).setTint(v1 >= 1 ? mul(base, BURNT) : base);
        ch.setScale(sz, 0.02 * ks);
        await Cook.tween(S, { targets: ch, scaleY: sz, duration: 110 });
        S.tweens.add({ targets: spat, x: z.X(home.x), y: z.Y(home.y), duration: 200 });
        const a = v1 >= 1 ? k.burntScore : S.bandScore(v1, lo, hi);
        S.verdict(x, y - 230 * ks, a, { bad: v1 >= 1 ? "burnt" : "too-early" });
        const v2 = await S.ring(ch, { r: 180 * ks, lo, hi, rate: k.rate2 * (1 + i * k.speedUp), io: wz.io, alsoTap: [tw] });
        // the puff: a good one balloons up with a whoosh of steam
        const puffed = v2 >= lo && v2 < 1;
        Cook.sfx.puff();
        ch.setTexture(DONE).setTint(v1 >= 1 || v2 >= 1 ? mul(base, BURNT) : base);
        const dz = sz * 0.8;
        ch.setScale(dz * 0.85);
        await Cook.tween(S, { targets: ch, scale: dz * (puffed ? 1.3 : 1.05), duration: puffed ? 260 : 180, ease: "Back.easeOut", yoyo: true });
        S.steam(x, y - 80 * ks, puffed ? 7 : 3);
        if (puffed) S.burst(x, y - 30 * ks, [0xfff6e0, 0xffffff, 0xf3e1b8], 10, 150 * ks);
        const b = v2 >= 1 ? k.burntScore : S.bandScore(v2, lo, hi);
        S.verdict(x, y - 230 * ks, b, { perfect: doneWord, bad: v2 >= 1 ? "burnt" : "flat" });
        z.skill((a + b) / 2, "tawa");
        z.progress({ cooked: served + 1, item, score: (a + b) / 2 });
        // onto the plate: a growing stack, each one a little askew
        const j = served++;
        ch.setDepth(D.item + 2 + j * 0.01);
        const ps = 0.5 * z.k * (item.size || 1);
        S.tweens.add({ targets: ch, angle: Math.random() * 24 - 12, duration: 450 });
        await S.fly(ch, z.X(plate.x) + z.L(Math.random() * 16 - 8), z.Y(plate.y - 24) - z.L(j * 16), { scale: ps, duration: 450 });
      };
      // one worker per tawa, each taking the next chapati when it's free
      await Promise.all(
        list.map(async (sp, j) => {
          const wz = z.child({ id: `${z.id}.tawa${j}` });
          for (;;) {
            const item = await queue.take();
            if (!item) break;
            await cookOne(wz, sp, item, started++, tws[j]);
          }
          wz.close();
        })
      );
      sizzle.stop();
      return served;
    },
  });

  Mech.lab("flip", {
    name: "Tawa",
    verb: "Flip and puff",
    async run(L) {
      L.card([Lang.line(Lang.orderFrame(0), Lang.phrase(Lang.countParts(2, "cook-maani")))], ["Tawa"]);
      await L.station("tawa", { n: 2 });
    },
  });
})(window);

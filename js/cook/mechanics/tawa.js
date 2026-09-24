/*
 * Mechanic: tawa (flip and puff). A ring on the chapati fills like a
 * clock; tap in the green and the spatula flips it; tap again in the
 * green and it puffs. Then it goes onto the plate.
 *
 * Several tawas at once (knob `tawas`): each has its own ring and takes
 * the next chapati as soon as it's free. Standalone it cooks `n` chapatis;
 * in a zone with an `in` channel it cooks whatever arrives (flying the
 * rolled maani's sprite over) until the channel closes.
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
      list.forEach((sp) => {
        const tw = S.flat(S.tex("tawa"), z.X(sp.x), z.Y(sp.y), 470 * ks, 410 * ks, { depth: D.item - 1 });
        if (k.special) S.special(tw);
      });
      S.flat(S.tex("vessel:serving"), z.X(plate.x), z.Y(plate.y), z.L(300), z.L(200));
      const spat = S.hand("spatula", { x: z.X(home.x), y: z.Y(home.y), angle: -20, k: z.k });
      const [lo, hi] = k.band;
      const sizzle = Cook.sfx.sizzleLoop();
      S.loops.push(sizzle);
      const queue = z.in || Mech.queue(Array.from({ length: n }, (_, i) => ({ kind: "maani", i })));
      let started = 0;
      let served = 0;

      const cookOne = async (wz, sp, item, i) => {
        const x = z.X(sp.x);
        const y = z.Y(sp.y);
        let ch;
        if (item.sprite && item.sprite.active) {
          // routed from another zone: fly it over
          ch = item.sprite;
          ch.setDepth(D.item + 1);
          await S.fly(ch, x, y, { scale: 0.7 * ks, duration: 380 });
        } else ch = S.track(S.add.image(x, y, RAW).setScale(0.7 * ks).setDepth(D.item + 1));
        ch.baseScale = 0.7 * ks;
        if (i === 0) z.passMeAfter(k.passMeAfterMs);
        const v1 = await S.ring(ch, { r: 180 * ks, lo, hi, rate: k.rate * (1 + i * k.speedUp), io: wz.io, onLevel: (v) => ch.setTint(Phaser.Display.Color.GetColor(255, 255 - v * 45, 255 - v * 90)) });
        // the spatula slides under and flips it
        await Cook.tween(S, { targets: spat, x: x + z.L(40), y: y + z.L(30), duration: 120 });
        Cook.sfx.flip();
        await Cook.tween(S, { targets: ch, scaleY: 0.02 * ks, duration: 110 });
        ch.setTexture(HALF).clearTint();
        ch.setScale(0.7 * ks, 0.02 * ks);
        await Cook.tween(S, { targets: ch, scaleY: 0.7 * ks, duration: 110 });
        S.tweens.add({ targets: spat, x: z.X(home.x), y: z.Y(home.y), duration: 200 });
        const a = v1 >= 1 ? k.burntScore : S.bandScore(v1, lo, hi);
        S.verdict(x, y - 230 * ks, a, { bad: v1 >= 1 ? "burnt" : "too-early" });
        const v2 = await S.ring(ch, { r: 180 * ks, lo, hi, rate: k.rate2 * (1 + i * k.speedUp), io: wz.io });
        Cook.sfx.puff();
        ch.setTexture(DONE);
        ch.setScale(0.56 * ks);
        await Cook.tween(S, { targets: ch, scale: 0.66 * ks, duration: 220, ease: "Back.easeOut", yoyo: true });
        S.steam(x, y - 80 * ks, 4);
        const b = v2 >= 1 ? k.burntScore : S.bandScore(v2, lo, hi);
        S.verdict(x, y - 230 * ks, b, { perfect: doneWord, bad: v2 >= 1 ? "burnt" : "flat" });
        z.skill((a + b) / 2, "tawa");
        z.progress({ cooked: served + 1 });
        await S.fly(ch, z.X(plate.x), z.Y(plate.y - 20) - z.L(served++ * 8), { scale: 0.42 * z.k, duration: 450 });
      };
      // one worker per tawa, each taking the next chapati when it's free
      await Promise.all(
        list.map(async (sp, j) => {
          const wz = z.child({ id: `${z.id}.tawa${j}` });
          for (;;) {
            const item = await queue.take();
            if (!item) break;
            await cookOne(wz, sp, item, started++);
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

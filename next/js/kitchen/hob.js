/*
 * The hob: its picture, and for each burner the flames, the knob, the person's face on the front strip, and the ring
 * that shows the heat on the vessel itself (never a separate timer). It draws what the heat rule says; it decides nothing.
 *
 *   const hob = createHob({ stage, kitchen, plan, people, onKnob, onFace })
 *   hob.fire(v, "off" | "high" | "low")      hob.ring(v, heat | null, k)      hob.wiggleKnob(v)
 *   hob.steam(v, on)      hob.puffs(v)      hob.chosen(v | null)      hob.stepBack()      hob.knobBox(v) / hob.vesselBox(v)
 *   hobRefs({ kitchen, steamArt, people }) -> { draw, then }: the pictures it draws with, and the steam it shows later
 */
const hex = (c) => parseInt(c.slice(1), 16);

export const hobRefs = ({ kitchen, steamArt, people }) => {
  const A = kitchen.art;
  return { draw: [A.hob[people.length - 1], A.knobOff, A.knobOn, A.flameHigh, A.flameLow].concat(people.map((p) => p.face)), then: steamArt };
};

export function createHob({ stage, kitchen, plan, people, steamArt, onKnob, onFace }) {
  const k = kitchen.layout;
  const A = kitchen.art;
  const RING = kitchen.hob.ring;
  const KNOB = kitchen.hob.knob;
  const H = kitchen.hob;
  const shadows = stage.layer("worktop", "shadows");
  const base = stage.layer("worktop", "hob");
  const flames = stage.layer("worktop", "flames");
  const marks = stage.layer("worktop", "marks");
  const things = stage.layer("worktop", "things");
  const rings = stage.layer("worktop", "rings");
  const air = stage.layer("worktop", "steam");
  const ST = kitchen.steam;
  let wispN = 0;
  stage.shapeShadow(shadows, A.hob[plan.n - 1], { x: plan.hob.x, y: plan.hob.y, w: plan.hob.w });
  const hobPic = stage.picture(base, A.hob[plan.n - 1], { x: plan.hob.x, y: plan.hob.y, origin: [0, 0], w: plan.hob.w });
  const flameScale = plan.flame / k.flameSrc;

  const burners = plan.vessels.map((v, i) => {
    const high = stage.picture(flames, A.flameHigh, { x: v.x, y: v.y, scale: flameScale, alpha: 0 });
    const low = stage.picture(flames, A.flameLow, { x: v.x, y: v.y, scale: flameScale * k.flameLow, alpha: 0 });
    const mark = stage.graphics(marks);
    const face = stage.image(things, stage.badge(people[i].face), { x: v.face.x, y: v.face.y, w: k.badge });
    const knobOff = stage.picture(things, A.knobOff, { x: v.knob.x, y: v.knob.y, w: k.knob });
    const knobOn = stage.picture(things, A.knobOn, { x: v.knob.x, y: v.knob.y, w: k.knob, alpha: 0, angle: -90 });
    const ring = stage.graphics(rings);
    stage.onTap({ obj: knobOff.obj }, () => onKnob(i));
    stage.onTap({ obj: face.obj }, () => onFace(i));
    return { v, high, low, mark, face, knobOff, knobOn, ring, wiggling: false, steam: null };
  });

  /** One wisp: it fades in as it rises, then drifts and fades away. */
  function wisp(x, y, w, rise, drift) {
    const R = plan.rimR;
    const pic = stage.picture(air, steamArt[wispN++ % steamArt.length], { x, y, w, alpha: 0 });
    const full = pic.obj.scaleX;
    pic.set({ scale: full * ST.grow[0] });
    pic.to({ alpha: ST.alpha, y: y - ST.riseIn * R * (rise / ST.riseAll) }, ST.inMs, "out").then(() => pic.to({ alpha: 0, y: y - rise * R, x: x + drift * R, scale: full * ST.grow[1] }, ST.outMs, "linear")).then(() => pic.remove());
  }

  return {
    /** Steam rises over a vessel from the boil until it leaves the heat. */
    steam(i, on) {
      const b = burners[i];
      if (!!b.steam === !!on) return;
      if (b.steam) b.steam.remove();
      b.steam = null;
      if (!on) return;
      let side = 1;
      const puff = () => ((side = -side), wisp(b.v.x + side * ST.side * plan.rimR * Math.random(), b.v.y - ST.startUp * plan.rimR, ST.w * plan.rimR, ST.riseAll, side * ST.drift));
      puff();
      b.steam = stage.scene.time.addEvent({ delay: ST.everyMs, loop: true, callback: puff });
    },
    /** A boil-over: two wisps from the vessel's upper left and top. */
    puffs(i) {
      const b = burners[i];
      for (const [dx, dy, w, rise] of ST.puffs) wisp(b.v.x + dx * plan.rimR, b.v.y + dy * plan.rimR, w * plan.rimR, rise, 0);
    },
    /** The knob turns and the flames follow; nothing flickers. */
    fire(i, how) {
      const b = burners[i];
      b.knobOff.to({ angle: KNOB[how] }, KNOB.ms, "back");
      b.knobOn.to({ angle: KNOB[how] - 90, alpha: how === "off" ? 0 : 1 }, KNOB.ms, "back");
      b.high.to({ alpha: how === "high" ? KNOB.flame : 0 }, KNOB.flameMs);
      b.low.to({ alpha: how === "low" ? KNOB.flame : 0 }, KNOB.flameMs);
    },
    flamesOut: (i, ms) => (burners[i].high.to({ alpha: 0 }, ms), burners[i].low.to({ alpha: 0 }, ms)),
    /** The ring on the vessel's rim: a clock from twelve, its green band, the sweep so far and the hand's dot. */
    ring(i, heat, hk) {
      const b = burners[i];
      const g = b.ring;
      g.clear();
      if (heat == null) return;
      const R = plan.rimR;
      const a = (t) => -Math.PI / 2 + t * 2 * Math.PI;
      const arc = (w, colour, alpha, from, to) => g.lineStyle(w, hex(colour), alpha).beginPath().arc(b.v.x, b.v.y, R, a(from), a(to)).strokePath();
      arc(...RING.outer, 0, 1);
      arc(...RING.track, 0, 1);
      arc(...RING.green, hk.lo, hk.hi);
      arc(RING.sweep, heat > hk.hi ? RING.red : RING.gold, 1, 0, heat);
      const hx = b.v.x + Math.cos(a(heat)) * R;
      const hy = b.v.y + Math.sin(a(heat)) * R;
      g.fillStyle(0xffffff, 1).fillCircle(hx, hy, RING.dot);
      g.lineStyle(RING.dotLine[0], hex(RING.dotLine[1]), RING.dotLine[2]).strokeCircle(hx, hy, RING.dot);
    },
    async wiggleKnob(i) {
      const b = burners[i];
      if (b.wiggling) return;
      b.wiggling = true;
      const o = b.knobOff.obj;
      const rest = o.angle;
      for (let n = 0; n < H.wiggle.times; n++) {
        await stage.tween(o, { angle: rest - H.wiggle.deg }, H.wiggle.ms);
        await stage.tween(o, { angle: rest + H.wiggle.deg }, H.wiggle.ms);
      }
      await stage.tween(o, { angle: rest }, H.wiggle.ms);
      b.wiggling = false;
    },
    /** With two or three vessels, the chosen one sits in a warm pool of light with a gold ring round its person's face. */
    chosen(i) {
      burners.forEach((b, n) => {
        b.mark.clear();
        if (burners.length < 2 || n !== i) return;
        H.chosen.rings.forEach((m) => b.mark.fillStyle(hex(H.chosen.pool), H.chosen.poolA).fillCircle(b.v.x, b.v.y, plan.vesselR * m));
        b.mark.lineStyle(H.chosen.ring[0], hex(H.chosen.ring[1]), 1).strokeCircle(b.v.face.x, b.v.face.y, H.chosen.ring[2]);
      });
    },
    /** Once everything is served the hob steps back a little. */
    stepBack() {
      [hobPic].concat(burners.flatMap((b) => [b.face, b.knobOff, b.knobOn])).forEach((h) => h.to({ alpha: H.stepBack }, KNOB.flameMs));
    },
    hobBox: () => ({ x: plan.hob.x, y: plan.hob.y, w: plan.hob.w, h: plan.hob.h }),
    faceBox: (i) => ({ x: burners[i].v.face.x - k.badge / 2, y: burners[i].v.face.y - k.badge / 2, w: k.badge, h: k.badge }),
    knobBox: (i) => ({ x: burners[i].v.knob.x - k.knob / 2 - 4, y: burners[i].v.knob.y - k.knob / 2 - 4, w: k.knob + 8, h: k.knob + 8 }),
    vesselBox: (i) => ({ x: burners[i].v.x - plan.rimR, y: burners[i].v.y - plan.rimR, w: plan.rimR * 2, h: plan.rimR * 2 }),
  };
}

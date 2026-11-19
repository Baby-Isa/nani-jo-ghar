/*
 * The serving spot: where finished dishes sit with their face labels. The family says where it is; this draws the
 * dishes and each person's face beside theirs, and fills a dish through the states the game names. A game supplies
 * only a dish's art id and its fill state; it never draws its own plates, glasses or labels.
 *
 *   const serving = createServing({ stage, kit, spot, people, art: { base, empty }, dim })
 *       spot: the family's plan (where, how big, each dish's place); people: [{ id, face }]
 *   serving.set(i, ref)                 the dish resting in a state
 *   serving.frame(i, ref)               one frame of a fill (drawn just above the resting dish)
 *   serving.settle(i)   serving.undim()   serving.drop(i) -> Promise   serving.twinkle(i, big?) -> Promise   serving.away(seats)
 *   serving.review(checks) -> Promise   the big faces: happy with a hop, or sad with a small shake of the head
 *   serving.praise(text) / serving.closeReview() -> Promise     serving.dishBox(i) / serving.dishMiddle(i)
 *   servingRefs({ kit, art, people }) -> { draw, then }: its dishes and labels, then its drop, twinkles and the review's faces
 */
export const servingRefs = ({ kit, art, people }) => ({
  draw: Object.values(art).concat(people.map((p) => p.face)),
  then: [kit.art.drop].concat(kit.art.twinkles, people.flatMap((p) => [p.faceHappy, p.faceSad].filter(Boolean))),
});

export function createServing({ stage, kit, spot, people, art, dim, s }) {
  const L = kit.look;
  const shadows = stage.layer("worktop", "shadows");
  const base = stage.layer("worktop", "spot");
  const veilL = stage.layer("worktop", "veil");
  const fx = stage.layer("worktop", "fx");
  const top = stage.layer("worktop", "labels");
  // its shadow and its dimming while cooking both follow the tray as drawn (its rounded corners), never its picture's box
  stage.shapeShadow(shadows, art.base, { x: spot.x, y: spot.y, w: spot.w });
  stage.picture(base, art.base, { x: spot.x, y: spot.y, origin: [0, 0], w: spot.w });
  const veil = stage.silhouette(veilL, art.base, kit.serving.veil, { x: spot.x, y: spot.y, w: spot.w, alpha: dim }).obj;

  const V = kit.serving;
  const fd = Math.min(V.face.most, Math.max(V.face.least, V.face.px / s));
  const dishes = spot.wells.map((well, i) => {
    const pic = stage.picture(base, art.empty, { x: well.x, y: well.y, rim: spot.gR });
    const over = stage.picture(base, art.empty, { x: well.x, y: well.y, rim: spot.gR, alpha: 0 });
    // the face sits in the corner of the spot nearest its dish, clear of the dish's rim
    const left = well.x < spot.x + spot.w / 2;
    const upper = well.y < spot.y + spot.h / 2;
    let c = fd / 2 + V.face.pad;
    const at = () => ({ x: left ? spot.x + c : spot.x + spot.w - c, y: upper ? spot.y + c : spot.y + spot.h - c });
    while (c > fd / 2 - V.face.slide && Math.hypot(at().x - well.x, at().y - well.y) < spot.gR + fd / 2 + V.face.clear) c -= 1;
    const face = stage.image(top, stage.badge(people[i].face), { x: at().x, y: at().y, w: fd });
    return { well, pic, over, face };
  });
  let big = [];
  let praiseCard = null;

  const glassW = () => spot.gR * 2;

  return {
    set(i, ref) {
      dishes[i].pic.swap(ref, { rim: spot.gR });
      dishes[i].over.set({ alpha: 0 });
    },
    frame(i, ref) {
      dishes[i].over.swap(ref, { rim: spot.gR }).set({ alpha: 1 });
    },
    async settle(i) {
      const o = dishes[i].pic.obj;
      const sc = o.scaleX;
      for (const [k, ms] of V.settle) await stage.tween(o, { scale: sc * k }, ms);
    },
    undim: () => stage.tween(veil, { alpha: 0 }, V.undimMs),
    /** These dishes and their faces are away from the spot (orders done right while another is remade); the rest are here. */
    away(list) {
      dishes.forEach((d, i) => {
        d.away = list.includes(i);
        [d.pic, d.over, d.face].forEach((p) => p.set({ visible: !d.away }));
      });
    },
    /** The painted drop that falls into a dish holding what was asked. */
    async drop(i) {
      const gw = glassW();
      const w = dishes[i].well;
      const D = V.drop;
      const d = stage.picture(fx, kit.art.drop, { x: w.x + D.x * gw, y: w.y - D.from * gw, w: D.w * gw, alpha: 0 });
      d.to({ alpha: 1 }, D.fadeMs);
      await d.to({ y: w.y - D.to * gw }, D.fallMs, "quadIn");
      d.remove();
    },
    /** Three small gold twinkles, one after another, in added light. */
    async twinkle(i, bigOnes = false) {
      const gw = glassW();
      const w = dishes[i].well;
      const T = V.twinkle;
      const kind = bigOnes ? T.big : T.small;
      const span = kind.span * gw;
      const cx = w.x + kind.x * gw;
      const cy = w.y + kind.y * gw;
      const spots = T.spots;
      await Promise.all(
        kit.art.twinkles.map(async (ref, n) => {
          await stage.wait(n * T.gapMs);
          const t = stage.picture(fx, ref, { x: cx + spots[n][0] * span, y: cy + spots[n][1] * span, w: span * spots[n][2] });
          t.obj.setBlendMode("ADD");
          const full = t.obj.scaleX;
          t.set({ scale: full * T.from });
          await t.to({ scale: full, angle: T.turn }, T.inMs);
          await t.to({ scale: full * T.outTo, angle: 2 * T.turn, alpha: 0 }, T.outMs);
          t.remove();
        })
      );
    },
    /** Every dish is looked at: each person's big face pops in at their dish, happy or sad. Never a cross. */
    async review(checks, faceOf) {
      const gaps = dishes.length > 1 ? Math.min(...dishes.slice(1).map((d, i) => Math.hypot(d.well.x - dishes[i].well.x, d.well.y - dishes[i].well.y))) : 0;
      const Rv = V.review;
      const size = dishes.length > 1 ? Math.max(Rv.least, Math.min(Rv.most, Rv.ofGap * gaps)) : Rv.one;
      // (a dish that has left the spot is not looked at again)
      big = dishes.map((d, i) => {
        if (d.away) return null;
        d.face.set({ visible: false });
        const off = Rv.off * (spot.gR + size / 2);
        const x = Math.max(spot.x + size / 2 + Rv.inside, d.well.x - off);
        const f = stage.image(top, stage.badge(faceOf(i, checks[i].right)), { x, y: d.well.y - off, w: size });
        const full = f.obj.scaleX;
        f.set({ scale: full * Rv.from, alpha: 0 });
        f.full = full;
        f.size = size;
        f.right = checks[i].right;
        return f;
      });
      big = big.filter(Boolean);
      await Promise.all(big.map((f) => f.to({ scale: f.full, alpha: 1 }, Rv.popMs, "back")));
      big.forEach(async (f) => {
        if (f.right) {
          const y = f.obj.y;
          for (let n = 0; n < Rv.hops; n++) {
            await f.to({ y: y - f.size * Rv.hop }, Rv.stepMs);
            await f.to({ y }, Rv.stepMs);
          }
        } else
          for (let n = 0; n < Rv.hops; n++) {
            await f.to({ angle: -Rv.shake }, Rv.stepMs);
            await f.to({ angle: Rv.shake }, Rv.stepMs);
            await f.to({ angle: 0 }, Rv.stepMs);
          }
      });
    },
    /** The praise, on a small white card beside one of the faces. */
    praise(text) {
      const f = big[big.length - 1];
      if (!f) return;
      const P = V.praise;
      const c = stage.container(top, f.obj.x + f.size / 2 + P.gap, f.obj.y);
      const t = stage.text(c, text, { fontFamily: L.wordFont, fontStyle: P.weight, fontSize: `${P.font}px`, color: L.vars.kutchi });
      t.setOrigin(0, 1 / 2).setPosition(P.inset, 0);
      const g = stage.graphics(c);
      g.fillStyle(parseInt(P.shade.slice(1), 16), P.shadeA).fillRoundedRect(0, P.drop - P.lift, t.width1 + P.pad, P.h, P.radius);
      g.fillStyle(0xffffff, 1).fillRoundedRect(0, -P.lift, t.width1 + P.pad, P.h, P.radius);
      c.bringToTop(t);
      c.alpha = 0;
      stage.tween(c, { alpha: 1 }, P.fadeMs);
      praiseCard = c;
    },
    async closeReview() {
      await Promise.all(big.map((f) => f.to({ alpha: 0, scale: f.full * V.closeTo }, V.closeMs, "in")));
      big.forEach((f) => f.remove());
      big = [];
      if (praiseCard) praiseCard.destroy();
      praiseCard = null;
      dishes.forEach((d) => d.face.set({ visible: !d.away }));
    },
    dishMiddle: (i) => ({ x: dishes[i].well.x, y: dishes[i].well.y, r: spot.gR }),
    dishBox(i) {
      const d = dishes[i];
      const x0 = Math.min(d.well.x - spot.gR, d.face.obj.x - fd / 2);
      const y0 = Math.min(d.well.y - spot.gR, d.face.obj.y - fd / 2);
      return { x: x0, y: y0, w: d.well.x + spot.gR - x0, h: d.well.y + spot.gR - y0 };
    },
    faceBox: (i) => ({ x: dishes[i].face.obj.x - fd / 2, y: dishes[i].face.obj.y - fd / 2, w: fd, h: fd }),
    spotBox: () => ({ x: spot.x, y: spot.y, w: spot.w, h: spot.h }),
    tapOf: (i) => ({ view: "worktop", x: dishes[i].well.x - spot.gR, y: dishes[i].well.y - spot.gR, w: spot.gR * 2, h: spot.gR * 2 }),
  };
}

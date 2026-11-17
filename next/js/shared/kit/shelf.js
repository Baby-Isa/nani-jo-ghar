/*
 * The shelf: the bottom row for things seen from the side. It draws its own band, each thing standing on it with its
 * shadow, and the word pill under each, evenly spaced. A picked thing keeps its size and glides: a bottle flies to
 * the vessel, tips, and comes back; a jar sends a spoon. The row keeps its things all game.
 *
 *   const shelf = createShelf({ stage, say, kit, k, row, wordArt, onItem, onPill })
 *       row: what layout.rowOf gave; k: the family's layout numbers (band, sizes, pill)
 *   shelf.pour(id, to, times, onFill) -> Promise      shelf.spoon(id, to, spoonRef, times, onLand) -> Promise
 *   shelf.back(id, from, spoonRef) -> Promise         shelf.wiggle(id)   shelf.glow(id, on)   shelf.dimOthers(id | null)
 *   shelf.pop(id, at)       the thing's word pops over the vessel as it goes in
 *   shelf.boxOf(id) -> { x, y, w, h } in design px (the thing with its pill), for a light
 */
export function createShelf({ stage, say, kit, k, row, wordArt, pillShows, onItem, onPill }) {
  const L = kit.look;
  const ground = stage.layer("worktop", "ground");
  const shadows = stage.layer("worktop", "shadows");
  const halos = stage.layer("worktop", "halos"); // apart from the shadows, so a check that hides them leaves the glow
  const things = stage.layer("worktop", "things");
  const pills = stage.layer("worktop", "pills");
  const fly = stage.layer("worktop", "fly");
  const s = stage.scaleOf("worktop");
  const top = stage.topOf("worktop");
  const b = k.band;
  const Z = kit.shelf;
  const FAR = Z.far;
  const [SW, SH] = [stage.sheet.w, stage.sheet.h];

  // the band: stone from its top line down, the tile over it, and the shelf strip the things stand on
  const g = stage.graphics(ground);
  g.fillStyle(parseInt(kit.look.stone.slice(1), 16), 1).fillRect(-FAR, b.top, SW + 2 * FAR, SH - b.top + FAR);
  stage.tiled(ground, kit.art.band, { x: -FAR, y: b.top, w: SW + 2 * FAR, h: SH - b.top, scale: Z.band.tile }).set({ alpha: Z.band.alpha });
  g.fillStyle(parseInt(Z.band.lineInk.slice(1), 16), Z.band.lineA).fillRect(-FAR, b.top, SW + 2 * FAR, Z.band.line);
  stage.tiled(ground, kit.art.shelf, { x: -FAR, y: b.shelfY, w: SW + 2 * FAR, h: b.shelfH, scale: Z.band.shelfTile });

  const items = new Map();
  for (const slot of row.slots) {
    const wa = wordArt[slot.id];
    const [pw, ph] = stage.art.size(wa.art);
    let h = Math.max(b.room * k.sizes[wa.size], k.minThingPx / s);
    let w = (h * pw) / ph;
    if (w > row.slotW - Z.fit) [w, h] = [row.slotW - Z.fit, ((row.slotW - Z.fit) * ph) / pw];
    const shade = stage.shadow(shadows, { x: slot.x, y: b.base - Z.shade.lift, w: w * Z.shade.w, h: Z.shade.h });
    const pic = stage.picture(things, wa.art, { x: slot.x, y: b.base, origin: [1 / 2, 1], h });
    const entry = say.entry(slot.id);
    const pill = makePill(slot, entry ? entry.kutchi : "", pillShows(slot.id));
    items.set(slot.id, { slot, pic, shade, pill, w, h, busy: false });
    stage.onTap({ obj: pic.obj }, () => onItem(slot.id));
    stage.onTap({ view: "worktop", x: slot.x - pill.w / 2, y: row.pillY - pill.h / 2, w: pill.w, h: pill.h }, () => {
      stage.tween(pill.c, { scale: row.pillScale * Z.pillPop[0] }, Z.pillPop[1]).then(() => stage.tween(pill.c, { scale: row.pillScale }, Z.pillPop[1]));
      onPill(slot.id);
    });
  }

  /** The flat speaker with its two waves, from its left edge. */
  function speakerMark(g, x, y, k) {
    const M = L.speakerMark;
    const ink = parseInt(kit.look.vars.ink.slice(1), 16);
    const [bw, bh] = M.box;
    const [cw, ch] = M.cone;
    g.fillStyle(ink, 1).fillPoints([{ x, y: y - bh * k }, { x: x + bw * k, y: y - bh * k }, { x: x + cw * k, y: y - ch * k }, { x: x + cw * k, y: y + ch * k }, { x: x + bw * k, y: y + bh * k }, { x, y: y + bh * k }], true);
    for (const r of M.waves) g.lineStyle(M.line * k, ink, 1).beginPath().arc(x + (cw + 1) * k, y, r * k, -M.wave, M.wave).strokePath();
  }

  /** A word pill: a white card with a speaker and the word (the speaker alone once the child has earned the word). */
  function makePill(slot, word, shown) {
    const c = stage.container(pills, slot.x, row.pillY);
    const text = stage.text(c, shown ? word : "", { fontFamily: L.wordFont, fontStyle: L.wordWeight, fontSize: `${k.pill.font}px`, color: L.pillInk });
    const w = shown ? text.width1 + k.pill.pad : k.pill.min;
    const h = k.pill.h;
    const gg = stage.graphics(c);
    gg.fillStyle(parseInt(L.pillShade.slice(1), 16), L.pillShadeA).fillRoundedRect(-w / 2, -h / 2 + Z.pillDrop, w, h, Z.pillRadius);
    gg.fillStyle(0xffffff, 1).fillRoundedRect(-w / 2, -h / 2, w, h, Z.pillRadius);
    // the speaker: a flat icon, the same on every pill
    const M = L.speakerMark;
    speakerMark(gg, shown ? -w / 2 + M.pad : -M.width / 2, 0, 1);
    c.bringToTop(text);
    text.setOrigin(0, 1 / 2).setPosition(-w / 2 + M.pad + M.width + M.gap, -1);
    c.setScale(row.pillScale);
    return { c, w: w * row.pillScale, h: h * row.pillScale };
  }

  const wait = (ms) => stage.wait(ms);

  /** Fly in an arc: the place follows a sine ease while y is lifted by the arc. */
  function arcTo(h, to, ms, arc) {
    const from = { x: h.obj.x, y: h.obj.y };
    const st = { p: 0 };
    return new Promise((resolve) =>
      stage.scene.tweens.add({
        targets: st,
        p: 1,
        duration: ms,
        ease: "Sine.easeInOut",
        onUpdate() {
          h.obj.x = from.x + (to.x - from.x) * st.p;
          h.obj.y = from.y + (to.y - from.y) * st.p - Math.sin(st.p * Math.PI) * arc;
        },
        onComplete: resolve,
      })
    );
  }

  return {
    /** A bottle or carton: it flies to the vessel, tips, pours (the vessel's own picture changes meanwhile) and returns. */
    async pour(id, to, t, { onTip, onFill, onBack } = {}) {
      const it = items.get(id);
      it.pic.set({ visible: false });
      it.shade.set({ visible: false });
      const copy = stage.picture(fly, wordArt[id].art, { x: it.slot.x, y: b.base - it.h / 2, h: it.h });
      await arcTo(copy, to, t.fly, t.arc);
      const tip = copy.to({ angle: t.tilt }, t.tip, "out");
      wait(t.sound).then(() => onTip && onTip());
      await tip;
      if (onFill) onFill(t.fill);
      await wait(t.fill);
      await copy.to({ angle: 0 }, t.untip);
      await arcTo(copy, { x: it.slot.x, y: b.base - it.h / 2 }, t.back, t.backArc);
      copy.remove();
      it.pic.set({ visible: true });
      it.shade.set({ visible: true });
      if (onBack) onBack();
      const base = it.pic.obj.scaleX;
      await stage.tween(it.pic.obj, { scaleX: base * Z.squash.wide, scaleY: base * Z.squash.flat }, Z.squash.inMs);
      await stage.tween(it.pic.obj, { scaleX: base, scaleY: base }, Z.squash.outMs);
    },
    /** A spoonful from a jar: a teaspoon flies to the vessel and stirs; the thing lands as the stir ends. */
    async spoon(id, to, spoonRef, t, { onLand, len } = {}) {
      const it = items.get(id);
      const sp = stage.picture(fly, spoonRef, { x: it.slot.x, y: b.base - it.h / 2 - Z.spoon.above, w: len, origin: Z.spoon.origin, angle: Z.spoon.rest });
      await arcTo(sp, { x: to.x, y: to.y - to.r }, t.fly, t.arc);
      // the stir: the bowl goes round the middle, then lifts away
      const st = { a: 0 };
      sp.set({ angle: Z.spoon.over });
      await new Promise((resolve) =>
        stage.scene.tweens.add({
          targets: st,
          a: 1,
          duration: t.stir,
          onUpdate() {
            const ang = -Math.PI / 2 + st.a * t.turns * 2 * Math.PI;
            sp.obj.x = to.x + Math.cos(ang) * to.r;
            const last = st.a > Z.spoon.lastPart ? (st.a - Z.spoon.lastPart) / (1 - Z.spoon.lastPart) : 0; // the end of the stir: it lifts and fades
      sp.obj.y = to.y + Math.sin(ang) * to.r - last * to.r * Z.spoon.liftTo;
            sp.obj.alpha = 1 - last * Z.spoon.liftTo;
          },
          onComplete: resolve,
        })
      );
      sp.remove();
      if (onLand) onLand();
    },
    /** A spoonful taken back: a spoon flies from the vessel to its jar and is gone. */
    async back(id, from, spoonRef, t, len) {
      const it = items.get(id);
      const sp = stage.picture(fly, spoonRef, { x: from.x, y: from.y, w: len, origin: Z.spoon.origin, angle: Z.spoon.rest });
      await arcTo(sp, { x: it.slot.x, y: b.base - it.h / 2 }, t.fly, t.arc);
      await sp.to({ angle: Z.spoon.tip }, Z.spoon.tipMs);
      await wait(Z.spoon.goneMs);
      sp.remove();
    },
    /** The word pop: a white card with a speaker and the word, over the vessel; it rises in, stays, and drifts away. */
    pop(id, at) {
      const P = L.pop;
      const entry = say.entry(id);
      const kPop = Math.max(1, P.minPx / (P.font * s));
      const c = stage.container(stage.layer("worktop", "labels"), at.x, at.y + P.rise);
      const text = stage.text(c, entry ? entry.kutchi : "", { fontFamily: L.wordFont, fontStyle: L.wordWeight, fontSize: `${P.font}px`, color: L.pillInk });
      const w = text.width1 + P.pad;
      const g = stage.graphics(c);
      g.fillStyle(parseInt(L.pillShade.slice(1), 16), L.pillShadeA).fillRoundedRect(-w / 2, -P.h + Z.popDrop, w, P.h, Z.popRadius);
      g.fillStyle(0xffffff, 1).fillRoundedRect(-w / 2, -P.h, w, P.h, Z.popRadius);
      const kM = P.h / k.pill.h; // the pop is the pill, bigger
      const iy = -P.h / 2;
      speakerMark(g, -w / 2 + L.speakerMark.pad * kM, iy, kM);
      c.bringToTop(text);
      text.setOrigin(0, 1 / 2).setPosition(-w / 2 + (L.speakerMark.pad + L.speakerMark.width + L.speakerMark.gap) * kM, iy - 1);
      c.setScale(kPop);
      // whole on screen, whatever the pan's place
      const half = (w * kPop) / 2;
      c.x = Math.max(half + P.edge, Math.min(stage.sheet.w - half - P.edge, at.x));
      c.alpha = 0;
      stage.tween(c, { alpha: 1, y: at.y }, P.inMs, "back");
      stage.wait(P.stayMs).then(() => stage.tween(c, { alpha: 0, y: at.y - P.rise }, P.outMs)).then(() => c.destroy());
    },
    /** A refused tap: the thing rocks and ends straight. No sound, no cross. */
    async wiggle(id) {
      const it = items.get(id);
      if (!it || it.busy) return;
      it.busy = true;
      const o = it.pic.obj;
      for (let i = 0; i < L.wiggle.times; i++) {
        await stage.tween(o, { angle: -L.wiggle.deg }, L.wiggle.ms);
        await stage.tween(o, { angle: L.wiggle.deg }, L.wiggle.ms);
      }
      await stage.tween(o, { angle: 0 }, L.wiggle.ms);
      it.busy = false;
    },
    /** A lit thing glows (a soft gold halo of its own outline, breathing) and hops where it stands until told to stop. */
    glow(id, on) {
      const it = items.get(id);
      if (!it) return;
      if (it.hop) {
        it.hop.stop();
        it.hop = null;
        it.pic.obj.y = b.base;
      }
      if (it.halo) {
        it.halo.remove();
        it.halo = null;
      }
      if (!on) return;
      const H = stage.halo(wordArt[id].art);
      const [pw] = stage.art.size(wordArt[id].art);
      const kk = it.w / pw / H.k; // the halo's small copy, drawn at the thing's size
      it.halo = stage.image(halos, H.key, { x: it.slot.x, y: b.base - it.h / 2 });
      it.halo.obj.setScale(kk);
      stage.scene.tweens.add({ targets: it.halo.obj, alpha: L.halo.breatheTo, duration: L.halo.breatheMs, yoyo: true, repeat: -1 });
      const up = Math.max(L.hop.min, Math.min(L.hop.max, it.h * L.hop.share));
      it.hop = stage.scene.tweens.add({ targets: it.pic.obj, y: b.base - up, duration: L.hop.upMs, ease: "Quad.easeOut", yoyo: true, repeat: -1, repeatDelay: L.hop.restMs });
    },
    dimOthers(id) {
      for (const [key, it] of items) it.pic.obj.alpha = id && key !== id ? L.dimOthers : 1;
    },
    boxOf(id) {
      const it = items.get(id);
      const w = Math.max(it.w, it.pill.w);
      const hopRoom = Math.max(L.hop.min, Math.min(L.hop.max, it.h * L.hop.share));
      const y0 = b.base - it.h - hopRoom;
      return { x: it.slot.x - w / 2, y: y0, w, h: row.pillY + it.pill.h / 2 + 2 - y0 };
    },
    picBox(id) {
      const it = items.get(id);
      return { x: it.slot.x - it.w / 2, y: b.base - it.h, w: it.w, h: it.h };
    },
    pillBox(id) {
      const it = items.get(id);
      return { x: it.slot.x - it.pill.w / 2, y: row.pillY - it.pill.h / 2, w: it.pill.w, h: it.pill.h };
    },
    middleOf: (id) => ({ x: items.get(id).slot.x, y: b.base - items.get(id).h / 2 }),
    ids: () => [...items.keys()],
  };
}

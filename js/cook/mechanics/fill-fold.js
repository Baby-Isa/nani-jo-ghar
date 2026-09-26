/*
 * Mechanics: fill and fold (samosa; later dahi puri, dabeli…).
 *  fill: spoon the fillings the customer named into the mixing bowl, as
 *        many spoons of each as they said ("ne ba chundo, ne hakro
 *        watana"), in any order. Any bowl can be spooned (decoys and the
 *        "no X" item too); nothing is refused and a running tally sits on
 *        each bowl, so you press Done when you think it's right, and it's
 *        graded then. Kutchi: the nouns, the counts, "no X".
 *  fold: each pastry gets a scoop of the filling; swipe along each dashed
 *        line to fold it. Make as many samosas as they asked for, then
 *        Done (no "Samosa 2 of 2": the count is theirs, said once).
 * St.fillFold(S, ctx, params) is the samosa station: fill once, then fold
 * them all, on one view.
 * Knobs: fill {decoys [min, max], decoyPick, rowY, flyMs};
 *        fold {folds, minLen, minDot, maxExtra}.
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  /** {id: n} from a tally, a list (one spoon each) or any-order groups. */
  const asTally = (f) => {
    if (!f) return {};
    if (!Array.isArray(f)) {
      const out = {};
      Object.keys(f).forEach((id) => Number(f[id]) > 0 && (out[id] = Number(f[id])));
      return out;
    }
    const out = {};
    f.flat().forEach((id) => (out[id] = (out[id] || 0) + 1));
    return out;
  };

  Mech.define("fill", {
    station: "fill",
    view: "marble",
    async run(z, { fillings, exclude = [], pool, decoyPool }, k) {
      const S = z.S;
      const ctx = z.ctx;
      const want = asTally(fillings);
      const kinds = Object.keys(want);
      if (!pool) pool = St.decoys(decoyPool, kinds.concat(exclude), St.knobInt(k.decoys), k.decoyPick);
      const bowl = St.vessel(S, "serving", z.X(800), z.Y(300), 1.55 * z.k);
      const ids = Cook.shuffle([...new Set(pool.concat(kinds, exclude))]);
      const items = St.ingredients(z, ids, { y: k.rowY, x0: 260, x1: 1250, maxPerRow: Math.max(1, Math.ceil(ids.length / 2)), w: 165, h: 120 });
      const got = {};
      const blobs = [];
      // Wave 6b: the picture tally in the top-right corner (spoons of each, what you did; said
      // aloud while the number is being learned), in place of a badge on every bowl
      const badge = (id) => UI.count(got[id], { id, state: "bowl" });
      const next = () => kinds.find((id) => (got[id] || 0) < want[id]) || null;
      let last = 0;
      for (;;) {
        const r = await St.freePick(z, { items, next: next(), doneOk: blobs.length > 0, doneGlow: ctx.guided && !next() });
        if (r.done) break;
        if (performance.now() - last < 220) continue; // a double tap
        last = performance.now();
        const id = r.id;
        const obj = items[id];
        got[id] = (got[id] || 0) + 1;
        badge(id);
        const blob = S.track(S.add.image(obj.x, obj.y, S.tex(`layer:${id}`)).setScale(0.26 * z.k).setDepth(D.fx));
        Cook.sfx.pop();
        const a = Math.random() * Math.PI * 2;
        const rr = Math.sqrt(Math.random()) * 0.55;
        const p = bowl.surface();
        await S.fly(blob, p.x + Math.cos(a) * bowl.rimRx * rr, p.y + Math.sin(a) * bowl.rimRy * rr, { scale: 0.3 * z.k, duration: k.flyMs, arc: z.L(120) });
        blob.setDepth(D.item + 1);
        blob.wordId = id;
        blobs.push(blob);
        z.progress({ filled: id, n: got[id] });
      }
      // graded now: each filling, how many spoons, and nothing they said no to
      let ok = true;
      // what shouldn't be there first (so a "no X" row is marked before the rows tick)
      Object.keys(got).forEach((id) => {
        if (want[id]) return;
        ok = false;
        z.listen(false, exclude.includes(id) ? `put ${id} in (they said no)` : `put ${id} in`);
      });
      kinds.forEach((id) => {
        const g = got[id] || 0;
        const right = g === want[id];
        if (!right) {
          ok = false;
          z.listen(false, `spooned ${g}, they asked for ${want[id]}: ${id}`);
        }
        if (!ctx.guided) {
          (right ? Cook.markRight : Cook.markMiss)(id);
          if (want[id] <= 5) (right ? Cook.markRight : Cook.markMiss)(Cook.numId(want[id]));
        }
      });
      // the step has closed (Done): its rows tick, count rows too, right or not (UX 11)
      if (ctx.closeItem) ctx.closeItem(kinds);
      // a finished bowl sparkles either way: the end review says whether it was right
      Cook.sfx.right();
      S.sparkle(bowl.rim.x, bowl.rim.y);
      if (!ok) z.oops();
      UI.hideCount();
      ctx.result.fillings = Object.assign({}, got);
      return { bowl, items, blobs };
    },
  });

  // the three folds of a samosa, in design coords (the pastry centred at 800, 330)
  const FOLDS = [
    [[640, 470], [860, 210]],
    [[960, 470], [740, 210]],
    [[630, 430], [970, 430]],
  ];
  /** One swipe along a line; resolves "done" instead if Done is pressed first (when offered). */
  function swipe(z, [[x1, y1], [x2, y2]], { minLen, minDot, doneOk, doneExpect, doneGlow }) {
    return new Promise((resolve) => {
      let start = null;
      const offs = [];
      const finish = (r) => {
        offs.forEach((o) => o());
        UI.hideDone();
        z.expect(null);
        resolve(r);
      };
      offs.push(
        z.on("pointerdown", (p) => (start = { x: p.worldX, y: p.worldY })),
        z.on("pointerup", (p) => {
          if (!start) return;
          const dx = p.worldX - start.x;
          const dy = p.worldY - start.y;
          const len = Math.hypot(dx, dy);
          const want = Math.hypot(x2 - x1, y2 - y1);
          const dot = (dx * (x2 - x1) + dy * (y2 - y1)) / (len * want || 1);
          start = null;
          if (len > want * minLen && dot > minDot) finish("fold");
          else Cook.sfx.soft();
        })
      );
      if (doneOk) UI.done({ glow: doneGlow }).then(() => finish("done"));
      z.expect(doneExpect ? { kind: "click", selector: "#done-btn" } : { kind: "swipe", x1, y1, x2, y2 });
    });
  }

  Mech.define("fold", {
    station: "fold",
    view: "marble",
    /**
     * count: how many they asked for (Done after each samosa; graded). With
     * no count, one samosa (the Phase A fold). bowl/blobs: the filling.
     */
    async run(z, { sheet, items = {}, blobs = [], bowl, count }, k) {
      const S = z.S;
      const ctx = z.ctx;
      UI.gist(Cook.data.stations.fold.goal);
      Object.values(items).forEach((o) => {
        o.setVisible(false);
        if (o.label) o.label.setVisible(false);
      });
      // the filling bowl moves aside; finished samosas go on a plate
      const bowlAt = { x: z.X(250), y: z.Y(250) };
      if (bowl) {
        // the rim lands on bowlAt at 0.6 of the size
        const dx = bowlAt.x - (bowl.rim.x - bowl.x) * 0.6 - bowl.x;
        const dy = bowlAt.y - (bowl.rim.y - bowl.y) * 0.6 - bowl.y;
        blobs.forEach((b) => S.tweens.add({ targets: b, x: bowlAt.x + (b.x - bowl.rim.x) * 0.6, y: bowlAt.y + (b.y - bowl.rim.y) * 0.6, scale: b.scale * 0.6, duration: 400 }));
        S.tweens.add({ targets: bowl, x: bowl.x + dx, y: bowl.y + dy, scale: bowl.scale * 0.6, duration: 400 });        if (bowl.liqGraphics) bowl.liqGraphics.setVisible(false);
        await Cook.wait(420);
      }
      const plate = { x: z.X(1330), y: z.Y(640) };
      const painted = Cook.Art.sprite(S, "plate.top"); // the enamel plate (data.art.sprites), else a drawn one
      if (count && painted) {
        S.track(S.add.ellipse(plate.x + z.L(6), plate.y + z.L(10), z.L(290), z.L(280), 0x3a2410, 0.14).setDepth(D.item - 0.3));
        S.flat(painted, plate.x, plate.y, z.L(300), z.L(300), { depth: D.item - 0.2 });
      } else if (count) S.track(S.add.ellipse(plate.x, plate.y, z.L(330), z.L(150), 0xf3eee6, 1).setStrokeStyle(z.L(6), 0xb24a3a).setDepth(D.item - 0.2));
      const kinds = [...new Set(blobs.map((b) => b.wordId).filter(Boolean))];
      const folds = FOLDS.slice(0, k.folds);
      const g = S.track(S.add.graphics().setDepth(D.fx));
      const most = count ? count + k.maxExtra : 1;
      let made = 0;
      const done = [];
      while (made < most) {
        const fresh = !sheet || made > 0;
        if (fresh) sheet = S.track(S.add.image(z.X(800), z.Y(330), S.tex("pastry:0")).setScale(1.1 * z.k).setDepth(D.item));
        // a scoop of the filling onto this pastry
        const scoop = [];
        if (bowl && kinds.length) {
          kinds.forEach((id, i) => {
            const s = S.track(S.add.image(bowlAt.x, bowlAt.y, S.tex(`layer:${id}`)).setScale(0.18 * z.k).setDepth(D.item + 1));
            scoop.push(s);
            S.fly(s, z.X(800 + (i - (kinds.length - 1) / 2) * 34), z.Y(360 - (i % 2) * 14), { scale: 0.26 * z.k, duration: 360, arc: z.L(90) });
          });
          await Cook.wait(380);
        } else if (!bowl && made === 0) blobs.forEach((b) => scoop.push(b));
        let quit = false;
        for (let f = 0; f < folds.length; f++) {
          const [[x1, y1], [x2, y2]] = folds[f].map(([x, y]) => [z.X(x), z.Y(y)]);
          g.clear();
          for (let t = 0; t < 1; t += 0.06) {
            g.lineStyle(z.L(7), 0x3a2410, 0.75);
            g.lineBetween(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, x1 + (x2 - x1) * (t + 0.03), y1 + (y2 - y1) * (t + 0.03));
          }
          g.fillStyle(0xb24a3a, 1);
          g.fillCircle(x1, y1, z.L(12));
          const offer = !!count && f === 0 && made > 0;
          const gh = S.ghost([[x1, y1], [x2, y2]], { duration: 700, delay: z.guided || (f === 0 && made === 0) ? 200 : 4000 });
          const r = await swipe(z, [[x1, y1], [x2, y2]], { minLen: k.minLen, minDot: k.minDot, doneOk: offer, doneExpect: offer && made >= count, doneGlow: offer && ctx.guided && made >= count });
          gh.stop();
          if (r === "done") {
            quit = true;
            break;
          }
          Cook.sfx.flip();
          sheet.setTexture(S.tex(`pastry:${f + 1}`));
          if (f === 0) scoop.forEach((o) => o.setVisible(false));
          S.tweens.add({ targets: sheet, scaleX: 1.02 * z.k, duration: 90, yoyo: true });
          z.progress((f + 1) / folds.length);
        }
        g.clear();
        if (quit) {
          // the spare pastry goes back
          scoop.forEach((o) => o.destroy());
          S.tweens.add({ targets: sheet, alpha: 0, duration: 250, onComplete: () => sheet.destroy() });
          break;
        }
        made++;
        if (count) UI.count(made, { id: "ph-samosa", state: "folded" });
        S.sparkle(z.X(800), z.Y(330));
        z.skill(100, "fold");
        if (!count) break;
        // onto the plate (a picture of what you made, never a count to aim for)
        const at = { x: plate.x + ((made - 1) % 3 - 1) * z.L(90), y: plate.y - Math.floor((made - 1) / 3) * z.L(40) };
        await S.fly(sheet, at.x, at.y, { scale: 0.34 * z.k, duration: 380, arc: z.L(80) });
        done.push(sheet);
      }
      g.destroy();
      if (count) {
        const ok = made === count;
        z.listen(ok, `folded ${made}, they asked for ${count}: ph-samosa`);
        if (!ctx.guided && count <= 5) (ok ? Cook.markRight : Cook.markMiss)(Cook.numId(count));
        ctx.result.folded = made;
      }
      await Cook.wait(300);
      return count ? made : sheet;
    },
  });

  /** The samosa station: fill the bowl once, then fold as many as they asked for, on one view. */
  St.fillFold = async function (S, ctx, params = {}, opts = {}) {
    await St.begin(S, ctx, "fill", "marble");
    const z = opts.zone || Mech.zone(S, ctx, { id: "fillFold", level: opts.level || params.level || ctx.level, region: opts.region });
    const made = await Mech.run("fill", z, params);
    if (ctx.nextStep) ctx.nextStep("fold");
    const n = await Mech.run("fold", z, Object.assign({ level: params.level, count: params.count || 1 }, made));
    if (!opts.zone) z.close();
    St.end();
    return n;
  };

  Mech.lab("fill", {
    name: "Samosa",
    verb: "Fill and fold",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.samosa.make(Cook.pick(["nana", "ma", "cousin"]));
      L.card(d, ["Fill", "Fold"]);
      await St.fillFold(L.S, L.ctx, { fillings: d.fillings, exclude: d.no, decoyPool: Cook.data.recipes.samosa.lists.fillings_all, count: d.count, level: L.level }, { region: L.region });
    },
  });
})(window);

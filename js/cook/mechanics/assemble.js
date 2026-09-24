/*
 * Mechanic: assemble (the chaat bowl, later falooda, dabeli…). Toppings
 * go into a glass bowl, where each one shows as its own layer. Any
 * topping can go in (nothing is refused while you build: the bowl is
 * what you made); you press Done. Then the customer checks it out loud,
 * layer by layer from the bottom ("Channa. Ne poi bataato…"), ticking
 * each one. At the first wrong layer they stop, the layers from there up
 * are scooped out, and they say the rest of the order again from that
 * point (the recast lands exactly where the mistake was); you carry on.
 * Kutchi: the sequence ("ne poi"), the likes, "no X".
 * Params: sequence (ids, or arrays of ids for any-order groups), exclude
 * (the "no" items, on the counter as traps), pool (exact decoys) or
 * decoyPool (knob `decoys` [min, max] are picked from it at random).
 * Knobs (data.mechanics.assemble): decoys, decoyPick, flyMs, bowl (the
 * glass bowl in design coords), rowY, checkMs.
 *
 * St.freePick (below) is the shared "tap anything, or Done" step that the
 * fill mechanic uses too: nothing is refused, so nothing gives the answer
 * away; you're graded afterwards.
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  /** A number from a knob: n, or [min, max] (random). */
  const knobInt = (v) => (Array.isArray(v) ? v[0] + Math.floor(Math.random() * (v[1] - v[0] + 1)) : v);
  St.knobInt = knobInt;

  /**
   * One free pick: resolves {id, obj} when any item is tapped, or {done}
   * when Done is pressed (offered if `doneOk`). `next` is what the order
   * wants next (for the guided glow and the test only; never shown
   * otherwise). Nothing is refused.
   */
  St.freePick = (z, { items, next, doneOk, doneGlow }) =>
    new Promise((resolve) => {
      const S = z.S;
      let over = false;
      const finish = (r) => {
        if (over) return;
        over = true;
        Object.values(items).forEach((o) => {
          if (!o || !o.active) return;
          S.untap(o);
          S.glow(o, false);
        });
        UI.hideDone();
        z.expect(null);
        resolve(r);
      };
      Object.entries(items).forEach(([id, obj]) => obj && obj.active && S.tappable(obj, () => finish({ id, obj })));
      if (doneOk) UI.done({ glow: !!doneGlow }).then(() => finish({ done: true }));
      const target = next && items[next] && items[next].active ? items[next] : null;
      if (target && z.guided) S.glow(target, true);
      if (target) {
        const c = S.centre(target);
        const wrongs = Object.keys(items)
          .filter((k) => k !== next && items[k] && items[k].active)
          .map((k) => S.centre(items[k]));
        z.expect({ kind: "tap", x: c.x, y: c.y, key: next, wrongs });
      } else if (doneOk) z.expect({ kind: "click", selector: "#done-btn" });
      else z.expect({ kind: "wait" });
    });

  /** The customer speaks from the sidebar card (their face on it, never over the play area). */
  St.customerSay = async (ctx, line, opts = {}) => {
    const face = document.querySelector("#nani-card .nc-face");
    const who = ctx.order && ctx.order.who;
    if (face && who && who !== "nani") {
      face.dataset.nani = face.dataset.nani || face.getAttribute("src");
      face.src = `assets/cook/characters/${who}-badge.webp`;
    }
    return UI.say(line, { badge: true }, opts).catch(() => {});
  };
  St.customerDone = () => {
    const face = document.querySelector("#nani-card .nc-face");
    UI.hideBubble();
    if (face && face.dataset.nani) face.src = face.dataset.nani;
  };

  const hex = (c) => St.color(c);
  const shade = (c, amt) => {
    const col = Phaser.Display.Color.IntegerToColor(c);
    const f = (v) => Cook.clamp(Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt), 0, 255);
    return Phaser.Display.Color.GetColor(f(col.red), f(col.green), f(col.blue));
  };

  /**
   * A glass bowl seen from above and in front, so each topping shows as a
   * band through the glass and the top one as the surface. spec in design
   * coords: x, y (the centre of the base), depth, rx/ry (rim), brx/bry (base).
   */
  function glassBowl(z, spec, layerTh) {
    const S = z.S;
    const B = { x: z.X(spec.x), y: z.Y(spec.y), depth: z.L(spec.depth), rx: z.L(spec.rx), ry: z.L(spec.ry), brx: z.L(spec.brx), bry: z.L(spec.bry) };
    const at = (t) => ({ x: B.x, y: B.y - B.depth * t, rx: B.brx + (B.rx - B.brx) * t, ry: B.bry + (B.ry - B.bry) * t });
    const arc = (t, a0, a1, n = 30) => {
      const e = at(t);
      return Array.from({ length: n + 1 }, (_, i) => {
        const a = a0 + ((a1 - a0) * i) / n;
        return { x: e.x + Math.cos(a) * e.rx, y: e.y + Math.sin(a) * e.ry };
      });
    };
    const band = (t0, t1) => arc(t1, 0, Math.PI).concat(arc(t0, Math.PI, 0));
    const back = S.track(S.add.graphics().setDepth(D.item));
    const bands = S.track(S.add.graphics().setDepth(D.item + 0.2));
    const hi = S.track(S.add.graphics().setDepth(D.item + 0.45));
    const front = S.track(S.add.graphics().setDepth(D.item + 0.5));
    // the glass: body, the inside, the base
    back.fillStyle(0xdcebef, 0.55).fillPoints(arc(1, Math.PI, 2 * Math.PI).concat(arc(0, 0, Math.PI)), true);
    const rim = at(1);
    back.fillStyle(0xf6fbfc, 0.55).fillEllipse(rim.x, rim.y, rim.rx * 2, rim.ry * 2);
    const base = at(0);
    back.fillStyle(0xcfdfe4, 0.6).fillEllipse(base.x, base.y, base.rx * 2, base.ry * 2);
    S.track(S.add.ellipse(base.x, base.y + base.ry * 0.9, base.rx * 2.3, base.ry * 0.9, 0x3a2410, 0.16).setDepth(D.item - 0.5));
    front.lineStyle(z.L(6), 0xffffff, 0.95).strokeEllipse(rim.x, rim.y, rim.rx * 2, rim.ry * 2);
    front.lineStyle(z.L(3), 0x9fb9c2, 0.8).strokePoints(arc(0, 0, Math.PI), false);
    front.lineStyle(z.L(3), 0xb9d0d7, 0.8);
    front.lineBetween(rim.x - rim.rx, rim.y, base.x - base.rx, base.y);
    front.lineBetween(rim.x + rim.rx, rim.y, base.x + base.rx, base.y);
    // a highlight down the left of the glass
    const streak = [];
    for (let i = 0; i <= 10; i++) {
      const t = 0.12 + (0.8 * i) / 10;
      const e = at(t);
      streak.push({ x: e.x + Math.cos(2.45) * e.rx, y: e.y + Math.sin(2.45) * e.ry });
    }
    for (let i = 10; i >= 0; i--) {
      const t = 0.12 + (0.8 * i) / 10;
      const e = at(t);
      streak.push({ x: e.x + Math.cos(2.62) * e.rx, y: e.y + Math.sin(2.62) * e.ry });
    }
    front.fillStyle(0xffffff, 0.4).fillPoints(streak, true);

    const layers = []; // {id, color, liquid, dots, t0, t1, grow}
    let topImg = null;
    const t0Of = (i) => 0.03 + i * layerTh;
    function draw() {
      bands.clear();
      layers.forEach((L) => {
        const t1 = L.t0 + (L.t1 - L.t0) * L.grow;
        if (t1 <= L.t0 + 0.001) return;
        bands.fillStyle(L.liquid ? L.color : shade(L.color, -0.22), 1).fillPoints(band(L.t0, t1), true);
        bands.lineStyle(z.L(2), shade(L.color, -0.28), 0.8).strokePoints(arc(L.t0, 0, Math.PI), false);
        // the pieces show through the glass in their own shape (cubes, balls, strands, leaves)
        L.dots.forEach((d) => {
          const t = L.t0 + (t1 - L.t0) * d.t;
          const e = at(t);
          const x = e.x + Math.cos(d.a) * e.rx * 0.985;
          const y = e.y + Math.sin(d.a) * e.ry * 0.985;
          const r = z.L(d.r);
          bands.fillStyle(d.c, 1);
          if (L.kind === "cubes") bands.fillRect(x - r, y - r * 0.8, r * 2, r * 1.6);
          else if (L.kind === "strands") bands.lineStyle(z.L(3), d.c, 1).lineBetween(x - r * 1.8, y - r * 0.3, x + r * 1.8, y + r * 0.3);
          else if (L.kind === "leaves") bands.fillEllipse(x, y, r * 2.6, r * 1.2);
          else if (L.kind === "pieces") bands.fillEllipse(x, y, r * 2.2, r * 1.5);
          else {
            bands.fillCircle(x, y, r * 1.15);
            bands.fillStyle(0xffffff, 0.35).fillCircle(x - r * 0.35, y - r * 0.35, r * 0.35);
          }
        });
      });
      const L = layers[layers.length - 1];
      if (topImg) topImg.destroy();
      topImg = null;
      if (!L) return;
      const e = at(L.t0 + (L.t1 - L.t0) * L.grow);
      bands.fillStyle(L.color, 1).fillEllipse(e.x, e.y, e.rx * 2, e.ry * 2);
      bands.fillStyle(shade(L.color, 0.2), 0.5).fillEllipse(e.x - e.rx * 0.25, e.y - e.ry * 0.25, e.rx * 0.7, e.ry * 0.5);
      topImg = S.track(S.add.image(e.x, e.y, S.tex(`layer:${L.id}`)).setDepth(D.item + 0.3));
      topImg.setDisplaySize(e.rx * 1.85, e.ry * 2.4);
    }
    const bowl = {
      at,
      get n() {
        return layers.length;
      },
      /** The point a new spoonful lands on. */
      surface() {
        const L = layers[layers.length - 1];
        return at(L ? L.t1 : 0.03);
      },
      async add(id, ms = 260) {
        const w = Cook.data.words[id] || {};
        const spec = w.layer || w.heap || { color: "#cccccc" };
        const color = hex(spec.color);
        const liquid = spec.kind === "liquid";
        const dots = liquid ? [] : Array.from({ length: 34 }, () => ({ a: 0.12 * Math.PI + Math.random() * 0.76 * Math.PI, t: 0.15 + Math.random() * 0.7, r: 4 + Math.random() * 5, c: shade(color, (Math.random() - 0.5) * 0.5) }));
        const i = layers.length;
        const L = { id, color, liquid, kind: spec.kind, dots, t0: t0Of(i), t1: t0Of(i + 1), grow: 0 };
        layers.push(L);
        await new Promise((resolve) =>
          S.tweens.addCounter({
            from: 0,
            to: 1,
            duration: ms,
            ease: "Sine.easeOut",
            onUpdate: (tw) => {
              L.grow = tw.getValue();
              draw();
            },
            onComplete: resolve,
          })
        );
      },
      /** Scoop out every layer from i up. */
      async removeFrom(i) {
        const gone = layers.splice(i);
        gone.forEach((L, j) => {
          const e = at((L.t0 + L.t1) / 2);
          const img = S.track(S.add.image(e.x, e.y, S.tex(`layer:${L.id}`)).setDepth(D.fx).setDisplaySize(e.rx * 1.2, e.ry * 1.6));
          S.tweens.add({ targets: img, y: e.y - z.L(160 + j * 30), x: e.x + z.L(260), alpha: 0, duration: 520, delay: j * 90, onComplete: () => img.destroy() });
        });
        draw();
        await Cook.wait(520 + gone.length * 90);
      },
      /** Flash a layer while it's checked. */
      pulse(i, color = 0xffffff) {
        const L = layers[i];
        if (!L) return;
        hi.clear();
        hi.fillStyle(color, 0.55).fillPoints(band(L.t0, L.t1), true);
        hi.setAlpha(1);
        S.tweens.add({ targets: hi, alpha: 0, duration: 520, delay: 180 });
      },
      /** A tick or a cross beside a layer. */
      mark(i, ok) {
        const L = layers[i];
        if (!L) return null;
        const e = at((L.t0 + L.t1) / 2);
        const m = S.track(
          S.add
            .text(e.x + e.rx + z.L(40), e.y + e.ry * 0.3, ok ? "✓" : "✗", { fontFamily: "Nunito, sans-serif", fontSize: `${Math.round(z.L(58))}px`, fontStyle: "bold", color: ok ? "#4f7a4a" : "#b24a3a", stroke: "#fffaf1", strokeThickness: Math.round(z.L(8)) })
            .setOrigin(0.5)
            .setDepth(D.fx + 1)
        );
        m.setScale(0.4);
        S.tweens.add({ targets: m, scale: 1, duration: 160, ease: "Back.easeOut" });
        return m;
      },
    };
    return bowl;
  }

  /** Where a list stands: the next thing it wants, and the first mistake in `got`. */
  function checker(sequence) {
    const steps = sequence.map((e) => [].concat(e));
    return {
      total: steps.reduce((a, g) => a + g.length, 0),
      /** The next id the order wants after `got` (as if `got` were right). */
      next(got) {
        let p = 0;
        for (const g of steps) {
          const placed = got.slice(p, p + g.length);
          if (placed.length < g.length) return g.find((x) => !placed.includes(x)) || g[0];
          p += g.length;
        }
        return null;
      },
      /** The first wrong place: {at, expected, got} (got undefined = missing; expected null = extra). */
      mistake(got) {
        let p = 0;
        for (const g of steps) {
          const rem = g.slice();
          for (let j = 0; j < g.length; j++) {
            const x = got[p + j];
            if (x === undefined) return { at: p + j, expected: rem[0] };
            const idx = rem.indexOf(x);
            if (idx < 0) return { at: p + j, expected: rem[0], got: x };
            rem.splice(idx, 1);
          }
          p += g.length;
        }
        return got.length > p ? { at: p, expected: null, got: got[p] } : null;
      },
      /** Is position i the first of its step (said with "ne poi"), and is it in a group? */
      place(i) {
        let p = 0;
        for (let s = 0; s < steps.length; s++) {
          if (i < p + steps[s].length) return { step: s, first: i === p, group: steps[s].length > 1 };
          p += steps[s].length;
        }
        return { step: steps.length, first: true, group: false };
      },
      /** The rest of the order from position i, as list entries. */
      rest(i, got) {
        let p = 0;
        const out = [];
        steps.forEach((g) => {
          if (p + g.length <= i) {
            p += g.length;
            return;
          }
          const placed = got.slice(p, i);
          const left = g.filter((x) => !placed.includes(x));
          out.push(left.length > 1 ? left : left[0]);
          p += g.length;
        });
        return out;
      },
    };
  }

  Mech.define("assemble", {
    station: "assemble",
    view: "marble",
    async run(z, { sequence, exclude = [], pool, decoyPool }, k) {
      const S = z.S;
      const ctx = z.ctx;
      const flat = sequence.flat();
      const C = checker(sequence);
      if (!pool) pool = St.decoys(decoyPool, flat.concat(exclude), knobInt(k.decoys), k.decoyPick);
      const ids = Cook.shuffle([...new Set(pool.concat(flat, exclude))]);
      // the toppings on two rows under a big glass bowl
      const items = St.ingredients(z, ids, { y: k.rowY, x0: 260, x1: 1340, maxPerRow: Math.max(1, Math.ceil(ids.length / 2)), w: 165, h: 120 });
      const bowl = glassBowl(z, k.bowl, 0.8 / Math.max(5, C.total + 1));
      const got = [];
      let confirmed = 0; // layers the customer has already ticked
      let mistakes = 0;
      const F = Lang.frames();
      const hide = St.hideKnown(ctx);
      const said = (id, i, fresh) => {
        const ph = Lang.phrase([id]);
        const pl = C.place(i);
        if (fresh && i === 0) return Lang.bare(ph);
        return Lang.line(pl.first && i > 0 ? F.seq : F.any, ph);
      };
      for (;;) {
        // build: tap any topping (it goes in as the next layer), or Done
        let last = 0;
        for (;;) {
          const r = await St.freePick(z, { items, next: C.next(got), doneOk: got.length > confirmed, doneGlow: ctx.guided && got.length >= C.total });
          if (r.done) break;
          if (performance.now() - last < 220) continue; // a double tap
          last = performance.now();
          const id = r.id;
          const obj = items[id];
          const spoon = S.track(S.add.image(obj.x, obj.y - z.L(10), S.tex(`layer:${id}`)).setScale(0.3 * z.k).setDepth(D.fx));
          Cook.sfx.pop();
          const p = bowl.surface();
          await S.fly(spoon, p.x + (Math.random() - 0.5) * z.L(30), p.y, { scale: 0.5 * z.k, duration: k.flyMs, arc: z.L(120) });
          spoon.destroy();
          got.push(id);
          obj.setAlpha(0.6); // used (it can still go in again)
          await bowl.add(id);
          z.progress({ layer: id, n: got.length });
        }
        // the customer checks it, layer by layer, out loud
        const m = C.mistake(got);
        const upTo = m ? m.at : got.length;
        const wrong = m && m.got;
        let why = null;
        if (m && wrong && exclude.includes(wrong)) why = `added ${wrong} (they said no)`;
        else if (m && wrong && m.expected) why = `${wrong} instead of ${m.expected}`;
        else if (m && wrong) why = `added ${wrong} at the end`;
        else if (m) why = `forgot ${m.expected}`;
        // a "no X" that went in: its row is marked before the others tick (they'd settle it as done)
        const noFirst = !!(wrong && exclude.includes(wrong));
        if (noFirst) z.listen(false, why);
        for (let i = confirmed; i < upTo; i++) {
          bowl.pulse(i);
          bowl.mark(i, true);
          if (ctx.tickItem) ctx.tickItem(got[i]);
          if (!ctx.guided && !mistakes) Cook.markRight(got[i]);
          await St.customerSay(ctx, said(got[i], i, true), { hide, ms: k.checkMs });
        }
        confirmed = upTo;
        if (!m) break;
        mistakes++;
        // the mistake: say what was wrong, scoop it out, and say the rest again from there
        if (m.at < got.length) {
          bowl.pulse(m.at, 0xb24a3a);
          const x = bowl.mark(m.at, false);
          if (x) S.tweens.add({ targets: x, alpha: 0, delay: 900, duration: 300, onComplete: () => x.destroy() });
        }
        if (!noFirst) z.listen(false, why);
        if (m.expected) Cook.markMiss(m.expected);
        const oops = [Lang.line("oops")];
        if (wrong && exclude.includes(wrong)) oops.push(Lang.line(F.no, Lang.phrase([wrong])));
        await St.customerSay(ctx, Lang.join(oops), { ms: 900 });
        if (got.length > m.at) await bowl.removeFrom(m.at);
        got.splice(m.at);
        Object.keys(items).forEach((id) => items[id].setAlpha(got.includes(id) ? 0.6 : 1));
        // the recast: the rest of the order again, from the layer that went wrong
        const rest = C.rest(m.at, got);
        if (rest.length) {
          const lines = [];
          rest.forEach((e, gi) =>
            [].concat(e).forEach((id, j) => {
              const ph = Lang.phrase([id]);
              if (m.at === 0 && !lines.length) lines.push(Lang.bare(ph));
              else lines.push(Lang.line(gi === 0 && j === 0 ? (C.place(m.at).first ? F.seq : F.any) : j === 0 ? F.seq : F.any, ph));
            })
          );
          exclude.forEach((id) => lines.push(Lang.line(F.no, Lang.phrase([id]))));
          await St.customerSay(ctx, Lang.join(lines), { hide });
        }
      }
      St.customerDone();
      ctx.result.layers = got.slice();
      z.skill(100, "assemble");
      S.sparkle(bowl.at(1).x, bowl.at(1).y);
      Cook.sfx.right();
      await Cook.wait(500);
      return got;
    },
  });

  Mech.lab("assemble", {
    name: "Chaat bowl",
    verb: "Assemble",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.chaat.make(Cook.pick(["nana", "ma", "cousin"]));
      L.card(d, ["Build"]);
      await L.station("assemble", { sequence: d.seq, exclude: d.no, decoyPool: Cook.data.recipes.chaat.lists.toppings });
    },
  });
})(window);

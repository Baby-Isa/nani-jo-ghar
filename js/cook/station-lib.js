/*
 * Cook with Nani: the station library's shared kitchen (Phase A, split
 * into building blocks 24 Sept 2026).
 *
 * Each station is one single-finger mini-game, a "verb" that recipes
 * reuse with different settings (docs/cook-with-nani-phase-a-design.md s8).
 * Rule: every station has at least one setting that only the Kutchi tells
 * you (what, how many, which order, how, or leave-it-out).
 *
 * The verbs themselves are MECHANICS, one per file in js/cook/mechanics/,
 * run through zones (js/cook/zone.js). This file holds what they share:
 * starting a station (view, goal line, mission step), the hob and strip
 * positions, rows of ingredients, look-alikes, the drawn vessels, Nani's
 * short lines, and picking things in order (with any-order groups).
 *
 * Every mechanic is still callable the Phase A way, as
 * Cook.Stations.<name>(S, ctx, params): e.g. St.roll(S, ctx, {count: 3}).
 * It reports into ctx:
 *   ctx.listen(ok)       — did you do what the words said? (the ear star)
 *   ctx.skill(score)     — hands: pour to the line, flip on time (the hand star)
 *   ctx.result[...]      — what you actually made, for the customer
 * and it may call ctx.maybePassMe() at a safe moment (Nani interrupts).
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const S$ = (Cook.Stations = {});

  // hob burners (bg:hob) and the worktop strip below the hob, in design coords
  const BURNER = { left: { x: 515, y: 375 }, right: { x: 1085, y: 375 } };
  const STRIP_Y = 790;

  const nani = (line, opts = {}) => UI.say(line, { badge: true }, opts);
  const oops = () => nani(Lang.line("oops"), { ms: 900 }).catch(() => {});
  const hideKnown = (ctx) => (id) => !ctx.guided && Cook.cardHidden(id);
  S$.nani = nani;
  S$.oops = oops;
  S$.hideKnown = hideKnown;

  /** Start a station: its view, its goal line (first time or guided), its step on the mission card. */
  async function begin(S, ctx, key, view) {
    // Wave 5: the lab's order card is still up big in the middle: start once it has flown into the sidebar
    if (ctx && ctx.intro) {
      await ctx.intro;
      ctx.intro = null;
    }
    // the station's painted sprites load while the view changes (data.art.sprites.need)
    const art = Cook.Art.need(S, key);
    await S.setView(view);
    await art;
    const st = Cook.data.stations[key] || {};
    Cook.save.seenStation = Cook.save.seenStation || {};
    // the goal waits behind the "?" (it pulses the first time); Nani's last line goes, and she
    // keeps quiet for a moment so the player can work it out (Cook.hintDelay adds the quiet)
    if (st.goal) UI.gist(st.goal);
    else UI.hideGist();
    UI.hideBubble();
    Cook.quietUntil = Date.now() + ((Cook.data.calm || {}).quietMs || 0);
    Cook.save.seenStation[key] = true;
    if (ctx.nextStep) ctx.nextStep(key);
    // Wave 6: the first time here, dim all but the next thing and show the move (js/cook/coach.js).
    // Only in a guided run (a dish's first order; the lab's "Nani helps"): the spotlight can be the answer
    if (Cook.Coach && UI.w6() && ctx.guided) Cook.Coach.start(key);
  }
  function end() {
    if (Cook.Coach) Cook.Coach.stop();
    UI.hideGist();
    UI.hideCount();
    UI.hideDone();
  }
  /**
   * Positions along a strip. Past `maxPerRow` items, labels start to
   * overlap and truncate each other, so it splits into two rows instead —
   * the second where the row normally sits, the first in the dead space
   * above it (design s7: help never covers a thing to tap).
   */
  function row(n, { y = STRIP_Y, x0 = 160, x1 = 1440, maxPerRow = n, rowGap = 180 } = {}) {
    const oneRow = (count, x0, x1, y) => (count === 1 ? [{ x: (x0 + x1) / 2, y }] : Array.from({ length: count }, (_, i) => ({ x: x0 + ((x1 - x0) * i) / (count - 1), y })));
    if (n <= maxPerRow) return oneRow(n, x0, x1, y);
    const counts = [Math.ceil(n / 2), Math.floor(n / 2)];
    return counts.flatMap((count, r) => oneRow(count, x0, x1, y - (counts.length - 1 - r) * rowGap));
  }
  /** row() in a zone's design coords: returns world positions. */
  S$.zrow = (z, n, { y = STRIP_Y, x0 = 160, x1 = 1440, maxPerRow = n, rowGap = 180 } = {}) =>
    row(n, { y: z.Y(y), x0: z.X(x0), x1: z.X(x1), maxPerRow, rowGap: z.L(rowGap) });
  /** A row of ingredient bowls with labels: {id: img}. */
  S$.ingredients = (z, ids, { y = STRIP_Y, dy = 0, x0 = 160, x1 = 1440, maxPerRow, w = 170, h = 128 } = {}) => {
    const items = {};
    S$.zrow(z, ids.length, { y, x0, x1, maxPerRow }).forEach((p, i) => (items[ids[i]] = z.S.ingredient(ids[i], p.x, p.y + z.L(dy), { w: z.L(w), h: z.L(h) })));
    return items;
  };
  function lookalikes(id, n = 2) {
    const L = (Cook.data.lookalikes || {})[id] || [];
    const pool = L.concat(Cook.shuffle(Object.keys(Cook.data.words).filter((w) => w !== id && !w.startsWith("num-") && (Cook.data.words[w].heap || Cook.data.words[w].image))));
    return [...new Set(pool)].filter((w) => w !== id).slice(0, n);
  }
  S$.lookalikes = lookalikes;
  /** "#9fd3f0" (data) or 0x9fd3f0 (code) -> a number. */
  S$.color = (c) => (typeof c === "string" ? parseInt(c.replace("#", ""), 16) : c);
  S$.heapColor = (id, fallback = 0x996633) => {
    const h = (Cook.data.words[id] || {}).heap;
    return h ? Phaser.Display.Color.HexStringToColor(h.color).color : fallback;
  };
  /**
   * A point in design coords from data or code: {x, y}, [x, y], or
   * ["burner-left", dx, dy]; "strip" as y is the worktop strip.
   */
  const ANCHORS = { "burner-left": BURNER.left, "burner-right": BURNER.right };
  S$.pt = (v, dflt) => {
    if (v == null) return dflt;
    if (Array.isArray(v)) {
      if (typeof v[0] === "string" && ANCHORS[v[0]]) return { x: ANCHORS[v[0]].x + (v[1] || 0), y: ANCHORS[v[0]].y + (v[2] || 0) };
      return { x: v[0], y: v[1] === "strip" ? STRIP_Y : v[1] };
    }
    return v;
  };

  /**
   * Tap items in the order given. `series` entries are a word id (a step
   * of its own) or an array of ids (a group: any order within it), the
   * same grouping the order ladder shows as shared dots.
   */
  S$.inOrder = async function (z, { items, series, onWrong, onPick, markSeen = true }) {
    let n = 0;
    for (const entry of series) {
      const group = Array.isArray(entry) ? entry.slice() : [entry];
      while (group.length) {
        const expected = group[0];
        if (markSeen) Cook.markSeen(expected);
        const r = await z.S.step({
          items,
          expected,
          word: expected,
          guided: z.guided,
          sayLine: Lang.wordLine(expected),
          allowAny: group.length > 1 ? (k) => group.includes(k) : undefined,
          onWrong: (k, m) => onWrong(k, m, expected),
          io: z.io,
        });
        group.splice(group.indexOf(r.key), 1);
        await onPick(r.key, r, n++);
      }
    }
  };
  /** Pick `n` decoys from a pool, leaving out what's wanted or refused. */
  S$.decoys = (pool, not, n, how = "random") => {
    const left = (pool || []).filter((x) => !not.includes(x));
    return (how === "first" ? left : Cook.shuffle(left)).slice(0, n == null ? left.length : n);
  };

  /**
   * A drawn vessel (pan, pot, kadai, cup, serving bowl, tadka pan) with a
   * liquid surface that rises inside it, and target rings.
   */
  S$.vessel = function (S, kind, x, y, scale = 1) {
    const info = Cook.Art.vesselInfo(kind);
    // a painted vessel (data.art.sprites.vessels): its opening centred on (x, y), as wide as
    // the drawn one's, so the liquid, the lines and everything aimed at the rim keep their size
    const spr = Cook.Art.vesselSprite(S, kind);
    let img;
    let rim;
    if (spr) {
      const s = (scale * info.rim[2] * spr.size) / spr.rx;
      img = S.track(S.add.image(x, y, spr.key).setOrigin(spr.cx / spr.w, spr.cy / spr.h).setScale(s).setDepth(D.item));
      rim = { x, y, rx: spr.rx * s, ry: spr.ry * s, depth: spr.depth * s };
      // the contact shadow under its body (not the handle)
      img.shadow = S.contactShadow(img, { centerX: x, centerY: y + rim.ry * 0.12, width: rim.rx * 2.5, height: rim.ry * 2.5 });
    } else {
      const key = S.tex(`vessel:${kind}`);
      img = S.track(S.add.image(x, y, key).setScale(scale).setDepth(D.item));
      const [cx, cy, rx, ry] = info.rim;
      const ox = x - (info.w / 2) * scale;
      const oy = y - (info.h / 2) * scale;
      rim = { x: ox + cx * scale, y: oy + cy * scale, rx: rx * scale, ry: ry * scale, depth: info.depth * scale };
    }
    const liq = S.track(S.add.graphics().setDepth(D.item + 0.4));
    const tgt = S.track(S.add.graphics().setDepth(D.item + 0.6));
    const v = img;
    v.rimRx = rim.rx;
    v.rimRy = rim.ry;
    v.level = 0;
    v.color = 0x9fd3f0;
    const at = (L) => {
      // the surface: lower and a little narrower when shallow
      const k = Cook.clamp(L, 0, 1.05);
      const yy = rim.y + rim.depth * (1 - k) * 0.85;
      const s = 0.78 + 0.22 * k;
      return { x: rim.x, y: yy, rx: rim.rx * s * 0.96, ry: rim.ry * s * 0.9 };
    };
    v.setLiquid = (L, color) => {
      v.level = L;
      if (color != null) v.color = color;
      liq.clear();
      if (L <= 0.01 || (spr && spr.filled)) return; // a painted vessel that shows its own contents
      const p = at(L);
      liq.fillStyle(v.color, 0.95);
      liq.fillEllipse(p.x, p.y, p.rx * 2, p.ry * 2);
      liq.fillStyle(0xffffff, 0.22);
      liq.fillEllipse(p.x - p.rx * 0.3, p.y - p.ry * 0.3, p.rx * 0.7, p.ry * 0.4);
    };
    v.surface = () => {
      const p = at(Math.max(v.level, 0.1));
      return { x: p.x, y: p.y };
    };
    v.drawTarget = (lo, hi) => {
      tgt.clear();
      const a = at(lo);
      const b = at(hi);
      // green band between the two levels, dashed edges
      tgt.fillStyle(0x7d9a78, 0.22);
      tgt.fillEllipse(b.x, (a.y + b.y) / 2, b.rx * 2, (b.ry + a.y - b.y) * 2);
      [a, b].forEach((p) => {
        for (let t = 0; t < Math.PI * 2; t += 0.22) {
          tgt.lineStyle(5, 0x4f6b4b, 0.95);
          const x1 = p.x + Math.cos(t) * p.rx;
          const y1 = p.y + Math.sin(t) * p.ry;
          const x2 = p.x + Math.cos(t + 0.12) * p.rx;
          const y2 = p.y + Math.sin(t + 0.12) * p.ry;
          tgt.lineBetween(x1, y1, x2, y2);
        }
      });
    };
    v.clearTarget = () => tgt.clear();
    v.liqGraphics = liq;
    v.rim = rim;
    return v;
  };

  S$.BURNER = BURNER;
  S$.STRIP_Y = STRIP_Y;
  S$.begin = begin;
  S$.end = end;
  S$.row = row;
})(window);

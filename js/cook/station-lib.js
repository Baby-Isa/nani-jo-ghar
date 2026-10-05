/*
 * Cook with Nani: the station library's shared kitchen (Phase A, split
 * into building blocks 24 Sept 2026).
 *
 * Each station is one single-finger mini-game, a "verb" that recipes
 * reuse with different settings (docs/archive/cook/cook-with-nani-phase-a-design.md s8).
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
 *   ctx.listen(ok)       — did you do what the words said? (the accuracy badge)
 *   ctx.skill(score)     — hands: pour to the line, flip on time (a hand job (not scored))
 *   ctx.result[...]      — what you actually made, for the customer
 * and it may call ctx.maybePassMe() at a safe moment (Nani interrupts).
 */
import { Cook as CookNS } from "./ns.js";
import { setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame } from "./life.js";

(function (global) {
  const Cook = CookNS;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const S$ = (Cook.Stations = {});

  // hob burners (bg:hob) and the worktop strip below the hob, in design coords
  const BURNER = { left: { x: 515, y: 375 }, right: { x: 1085, y: 375 } };
  const STRIP_Y = 790;

  // at a station Nani is a voice (docs/design-language/ux-principles.md 13); one gentle "Arre re!" at level 1 only (UX 11)
  const nani = (line, opts = {}) => UI.voice(line, opts);
  const oops = () => (Cook.gentleOops(Cook.ctx) ? nani(Lang.line("oops"), { ms: 900 }).catch(() => {}) : Promise.resolve());
  // C3 (decision 41, E12): from level 3 a number is heard, never written: in Nani's box it shows as dots too
  const hideKnown = (ctx) => (id) => (!ctx.guided && Cook.cardHidden(id)) || ((ctx.level || 1) >= 3 && /^num-/.test(String(id)));
  S$.nani = nani;
  S$.oops = oops;

  /*
   * 29 Sept (X7, Zafar): the shelf band's one padding rule. The band is the bottom 26% (666-900 in
   * design px) with the name chips at 860 (46 high). The gap from the top of the band to the top of
   * the tallest thing on it equals the gap from the bottom of the chips to the bottom of the band;
   * a thing that hops when Nani points at it (S.glow's bounce) and its glow keep inside that, so
   * the hop and a little glow come off the room first. shelfFit gives the largest scale (at most k)
   * that keeps a picture standing on `base` inside the rule.
   */
  const SHELF = { top: 666, bottom: 900, chipY: 860, chipH: 46, glow: 4 };
  S$.SHELF = SHELF;
  S$.shelfPad = () => SHELF.bottom - (SHELF.chipY + SHELF.chipH / 2);
  S$.shelfItemTop = () => SHELF.top + S$.shelfPad();
  /** How far S.glow's bounce lifts a thing this tall (the same rule as stations.js glow()). */
  S$.shelfHop = (h) => Math.max(6, Math.min(16, h * 0.07));
  /** Where a texture's picture starts and ends ([top, bottom] as fractions of its canvas height). */
  S$.opaqueSpan = function (S, key) {
    const cache = (S$._span = S$._span || {});
    if (cache[key]) return cache[key];
    let out = [0, 1];
    try {
      const src = S.textures.get(key).getSourceImage();
      const cv = document.createElement("canvas");
      cv.width = src.width;
      cv.height = src.height;
      const g = cv.getContext("2d", { willReadFrequently: true });
      g.drawImage(src, 0, 0);
      const d = g.getImageData(0, 0, cv.width, cv.height).data;
      const row = (y) => {
        for (let x = 0; x < cv.width; x += 2) if (d[(y * cv.width + x) * 4 + 3] > 60) return true;
        return false;
      };
      let t = 0;
      while (t < cv.height - 1 && !row(t)) t++;
      let b = cv.height - 1;
      while (b > t && !row(b)) b--;
      out = [t / cv.height, (b + 1) / cv.height];
    } catch (e) {
      /* a tainted texture: its whole canvas */
    }
    return (cache[key] = out);
  };
  /** The largest scale (at most k) at which texture `key`, standing on `base`, keeps the band's top gap (with its hop). */
  S$.shelfFit = function (S, key, k, base, { hop = true } = {}) {
    if (!S.textures.exists(key)) return k;
    const [t, b] = S$.opaqueSpan(S, key);
    const h = (b - t) * S.textures.get(key).getSourceImage().height;
    const room = base - S$.shelfItemTop() - SHELF.glow;
    let s = k;
    for (let n = 0; n < 3; n++) s = Math.min(k, (room - (hop ? S$.shelfHop(h * s) : 0)) / h);
    return Math.max(0.05, s);
  };
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
    // only this station's hand poses (js/cook/hands.js): the last station's go
    await Promise.all([art, Cook.Hands ? Cook.Hands.need(S, key) : null]);
    const st = Cook.data.stations[key] || {};
    Cook.save.seenStation = Cook.save.seenStation || {};
    // the goal waits behind the "?" (it pulses the first time); Nani's last line goes, and she
    // keeps quiet for a moment so the player can work it out (Cook.hintDelay adds the quiet)
    if (st.goal) UI.gist(st.goal);
    else UI.hideGist();
    UI.hideBubble();
    Cook.inStation = true;
    Cook.quietUntil = Date.now() + ((Cook.data.calm || {}).quietMs || 0);
    Cook.save.seenStation[key] = true;
    if (ctx.nextStep) ctx.nextStep(key);
    // Wave 6: the first time here, dim all but the next thing and show the move (js/cook/coach.js).
    // Only in a guided run (a dish's first order; the lab's "Nani helps"): the spotlight can be the answer
    if (Cook.Coach && UI.w6() && ctx.guided) Cook.Coach.start(key);
  }
  /**
   * A phase's first-time coach inside a station that has already begun (29 Sept, X11): daar's tadka and
   * stir run on after the chop in the same view, so its begin can't start them. Same rule as begin's.
   */
  function coach(ctx, key) {
    if (Cook.Coach && UI.w6() && ctx && ctx.guided) Cook.Coach.start(key);
  }
  function end() {
    if (Cook.Coach) Cook.Coach.stop();
    Cook.inStation = false;
    UI.hideVoice();
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
    const pool = L.concat(Cook.shuffle(Cook.items().filter((w) => w !== id && !w.startsWith("num-") && (Cook.item(w).heap || Cook.item(w).image))));
    return [...new Set(pool)].filter((w) => w !== id).slice(0, n);
  }
  S$.lookalikes = lookalikes;
  /** "#9fd3f0" (data) or 0x9fd3f0 (code) -> a number. */
  S$.color = (c) => (typeof c === "string" ? parseInt(c.replace("#", ""), 16) : c);
  S$.heapColor = (id, fallback = 0x996633) => {
    const h = (Cook.item(id) || {}).heap;
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
  S$.inOrder = async function (z, { items, series, onWrong, onPick, onLand, markSeen = true }) {
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
          // level 2 up: a wrong pick goes in like any other (UX 11); onLand shows it
          quiet: z.quiet && !!onLand,
          onLand,
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

  /** A colour mixed toward another: mix(0xrrggbb, 0xrrggbb, 0..1). */
  const mix = (a, b, f) => {
    const A = Phaser.Display.Color.ValueToColor(a);
    const B = Phaser.Display.Color.ValueToColor(b);
    const c = Phaser.Display.Color.Interpolate.ColorWithColor(A, B, 1000, Math.round(Cook.clamp(f, 0, 1) * 1000));
    return Phaser.Display.Color.GetColor(c.r, c.g, c.b);
  };
  S$.mix = mix;
  // water is see-through (the pan's steel shows through it); everything else is opaque
  const WATER = 0x9fd3f0;
  /**
   * A liquid's surface in a top-down vessel, lit like the painted art (the window light
   * from the top left): a shaded edge where the vessel's wall shadows it, the body, a
   * soft sheen, and a bright meniscus on the lit far side. boil (0..1) rolls the surface.
   */
  function shade(g, p, color, boil = 0) {
    const a = color === WATER ? 0.5 : 0.97;
    g.fillStyle(mix(color, 0x1a0e06, 0.28), a);
    g.fillEllipse(p.x, p.y, p.rx * 2, p.ry * 2);
    g.fillStyle(color, a);
    g.fillEllipse(p.x + p.rx * 0.04, p.y + p.ry * 0.05, p.rx * 1.86, p.ry * 1.84);
    g.fillStyle(mix(color, 0xffffff, 0.12), a * 0.6);
    g.fillEllipse(p.x + p.rx * 0.1, p.y + p.ry * 0.12, p.rx * 1.3, p.ry * 1.2);
    // the sheen: the window's reflection, soft (two layers)
    g.fillStyle(0xffffff, color === WATER ? 0.2 : 0.1);
    g.fillEllipse(p.x - p.rx * 0.28, p.y - p.ry * 0.3, p.rx * 0.8, p.ry * 0.36);
    g.fillStyle(0xffffff, color === WATER ? 0.18 : 0.1);
    g.fillEllipse(p.x - p.rx * 0.32, p.y - p.ry * 0.34, p.rx * 0.4, p.ry * 0.16);
    // the meniscus: a thin bright line round the near, lit side
    g.lineStyle(Math.max(1.5, p.rx / 45), 0xffffff, 0.28);
    g.beginPath();
    g.arc(p.x, p.y, p.rx * 0.985, 0.25, 2.3, false);
    g.strokePath();
    if (boil > 0) {
      // a rolling boil: rings of froth that come and go
      const t = performance.now() / 1000;
      for (let i = 0; i < 9; i++) {
        const u = (t * 0.9 + i * 0.37) % 1;
        const ang = i * 2.4 + Math.floor(t * 0.9 + i * 0.37) * 1.7;
        const d = 0.25 + ((i * 0.31) % 0.6);
        const bx = p.x + Math.cos(ang) * p.rx * d;
        const by = p.y + Math.sin(ang) * p.ry * d;
        const r = p.rx * (0.05 + 0.09 * boil) * (0.4 + u);
        g.lineStyle(Math.max(1, r * 0.25), mix(color, 0xffffff, 0.55), (1 - u) * 0.8 * boil);
        g.strokeEllipse(bx, by, r * 2, r * 1.4);
      }
    }
  }
  S$.shade = shade;
  S$.WATER = WATER;
  /** Load textures the scene hasn't got yet: [[key, url], ...] (urls cache-busted through Cook.v). */
  S$.load = (S, list) => {
    const missing = list.filter(([key]) => !S.textures.exists(key));
    if (!missing.length) return Promise.resolve();
    return new Promise((resolve) => {
      missing.forEach(([key, url]) => S.load.image(key, Cook.v ? Cook.v(url) : url));
      S.load.once("complete", resolve);
      S.load.start();
    });
  };
  /**
   * A spoon stir in a vessel (anything with a rim and a surface): a spoon dips in,
   * goes round twice with a swirl on the liquid, and lifts out.
   */
  S$.stirIn = (S, vessel, { ms = 700, turns = 2 } = {}) => {
    if (!vessel || !vessel.rim || !vessel.active || vessel.stirring) return Promise.resolve();
    vessel.stirring = true;
    const p = vessel.surface ? vessel.surface() : vessel.rim;
    const rx = vessel.rim.rx * 0.45;
    const ry = vessel.rim.ry * 0.45;
    const L = vessel.rim.rx / 60;
    const sp = S.track(S.add.graphics().setDepth(D.fx - 1));
    const sw = S.track(S.add.graphics().setDepth(D.item + 0.5));
    return new Promise((resolve) => {
      S.tweens.addCounter({
        from: 0,
        to: 1,
        duration: ms,
        ease: "Sine.easeInOut",
        onUpdate: (tw) => {
          const u = tw.getValue();
          const a = -Math.PI / 2 + u * turns * Math.PI * 2;
          const x = p.x + Math.cos(a) * rx;
          const y = p.y + Math.sin(a) * ry;
          const lift = Math.max(0, 1 - Math.min(u, 1 - u) * 8); // dips in, lifts out
          sp.clear().setAlpha(1 - lift * 0.7);
          // the handle leans out to the lower right (the hand's side), the bowl in the liquid
          sp.lineStyle(Math.max(3, L * 7), 0xb9bcc2, 1);
          sp.lineBetween(x, y - lift * L * 20, x + L * 70, y + L * 38 - lift * L * 20);
          sp.fillStyle(0xd7d9dd, 1);
          sp.fillEllipse(x, y - lift * L * 20, L * 26, L * 16);
          // the swirl it leaves on the surface
          sw.clear();
          for (let i = 0; i < 3; i++) {
            const b = a - 0.6 - i * 0.5;
            sw.lineStyle(Math.max(1, L * 2), 0xffffff, 0.22 - i * 0.06);
            sw.beginPath();
            sw.arc(p.x, p.y, rx * (0.7 + i * 0.2), b - 0.9, b, false);
            sw.strokePath();
          }
          // squash the swirl to the surface's ellipse
          sw.setScale(1, ry / rx).setPosition(0, p.y - p.y * (ry / rx));
        },
        onComplete: () => {
          vessel.stirring = false;
          sp.destroy();
          S.tweens.add({ targets: sw, alpha: 0, duration: 300, onComplete: () => sw.destroy() });
          resolve();
        },
      });
    });
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
      shade(liq, at(L), v.color, v.boiling || 0);
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
  S$.coach = coach;
  S$.row = row;
})(window);

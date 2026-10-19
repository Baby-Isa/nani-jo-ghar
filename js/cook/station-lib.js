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

  // at a station Nani is a voice (docs/design-language/ux-principles.md 13); one gentle "oh oh" at level 1 only (UX 11, R6)
  const nani = (line, opts = {}) => UI.voice(line, opts);
  const oops = () => Cook.oops(Cook.ctx); // R6: the family's "oh oh oh" or a soft sound (S02-A hook; arre re is gone)
  // C3 (decision 41, E12): from level 3 a number is heard, never written: in Nani's box it shows as dots too
  // from level 3 a number is heard, not written (E12), except the first times it is heard (decision 57, as the card)
  const hideKnown = (ctx) => (id) => (!ctx.guided && Cook.cardHidden(id)) || ((ctx.level || 1) >= 3 && /^num-/.test(String(id)) && !(Cook.timesHeard && Cook.timesHeard(id) < 3));
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

  /*
   * The help ladder, one table for every station (Zafar, 17 Oct; decision 4; SH-60, SH-95, SH-96, SH-53; js/shared/guide.js):
   *   - the lab's "Nani helps" is off until ticked (flow.js reads Cook.labGuided !== false, so this is the default);
   *   - first-play guidance (ctx.guided) only at levels 1 and 2; at levels 3 and 4 nothing at the start;
   *   - the idle clock is the page's (NaniGuide.idleMs: every tap, drag and key restarts it, in every station);
   *   - Nani's word and the glow come at the same moment, after the pause (S$.step below, the stepper in guide.js);
   *   - after calm.bulbPulseMs stuck, both light bulbs pulse.
   * The numbers are data (data/cook.json calm.helpMs, calm.bulbPulseMs); the glow's size and beat are one token (Cook.GLOW,
   * mirrored as CSS variables so the tick's pulse and the item glow are the same).
   */
  if (Cook.labGuided == null) Cook.labGuided = false;
  const NG = () => global.NaniGuide;
  // the glow token (SH-53, 17 Oct: "make it glow even more, extend a little further out ... like how we got on the tick button,
  // pulsating quite strongly"): the tick's own pulse (css/shared/buttons.css njgDonePulse: 1.2 s, a 12 px gold glow at .85) is
  // the beat and the reach of the item glow, the bulbs' pulse and the done glow, written once here and mirrored as CSS variables
  // (css/cook.css reads --glow-ms, --glow-radius, --glow-rgb, --glow-alpha)
  const GLOW = (Cook.GLOW = { ms: 1200, radius: 12, color: 0xe0a63a, rgb: "224, 166, 58", alpha: 0.85 });
  const glowCss = () => {
    try {
      const st = document.documentElement.style;
      st.setProperty("--glow-ms", `${GLOW.ms}ms`);
      st.setProperty("--glow-radius", `${GLOW.radius}px`);
      st.setProperty("--glow-rgb", GLOW.rgb);
      st.setProperty("--glow-alpha", String(GLOW.alpha));
    } catch (e) {
      /* no page */
    }
  };
  let pulseTimer = null;
  let glowTimer = null;
  const levelOf = (ctx) => Cook.roundLevel(ctx);
  function ladderStart(S, ctx) {
    const calm = (Cook.data && Cook.data.calm) || {};
    const G = NG();
    if (G) {
      if (Array.isArray(calm.helpMs)) G.PAUSE = calm.helpMs.slice();
      if (calm.repeatMs) G.REPEAT = calm.repeatMs;
      if (calm.bulbPulseMs) G.BULB_PULSE = calm.bulbPulseMs;
      G.watch();
      G.poke();
    }
    glowCss();
    Lang.popReset();
    // first-play guidance only at levels 1 and 2 (SH-95: "You shouldn't be getting help, especially not in level four")
    if (ctx && ctx.guided && levelOf(ctx) >= 3) ctx.guided = false;
    // the shared step engine and the glow, on this scene (stations.js keeps the old ones, unused by the stations)
    if (S && !S.__ladder) {
      S.__ladder = true;
      S.step = (o) => S$.step(S, o);
      // every "light up the next thing" is help, so it waits for the ladder (SH-60: "for the first item too, every game"): a
      // glow asked for sits until the child has done nothing for the pause, then comes on with Nani's word (the stepper's
      // and S$.step's own glows are lit at that moment, and a glow asked for with {now: true} is lit at once)
      const glow0 = S.glow && S.glow.bind(S);
      if (glow0) {
        const pending = (S.__pendingGlows = new Map());
        S.glow = (obj, on = true, o) => {
          if (!obj) return;
          if (!on) {
            pending.delete(obj);
            return glow0(obj, false, o);
          }
          const g = NG();
          if (!g || g.helping || (o && o.now) || !Cook.inStation) return glow0(obj, true, o);
          pending.set(obj, { o, at: Date.now() });
        };
        S.__releaseGlows = () => {
          const g = NG();
          if (!g || !pending.size) return;
          const need = g.PAUSE[Math.min(g.PAUSE.length, levelOf()) - 1];
          // (a glow asked for waits the pause from when it was asked and from the child's last action, whichever is later)
          [...pending].forEach(([obj, p]) => {
            if (Math.min(g.idleMs(), Date.now() - p.at) < need) return;
            pending.delete(obj);
            if (obj.active) (g.logHelp("help", { step: "idle", by: `L${levelOf()} glow` }), glow0(obj, true, p.o));
          });
        };
      }
    }
    clearInterval(pulseTimer);
    pulseTimer = setInterval(() => {
      const g = NG();
      if (g) g.pulseBulbs(!!Cook.inStation && !Cook.paused && g.idleMs() >= g.BULB_PULSE);
    }, 500);
    clearInterval(glowTimer);
    glowTimer = setInterval(() => S && S.__releaseGlows && S.__releaseGlows(), 200);
  }
  function ladderStop() {
    clearInterval(pulseTimer);
    clearInterval(glowTimer);
    pulseTimer = glowTimer = null;
    if (Cook.scene && Cook.scene.__pendingGlows) Cook.scene.__pendingGlows.clear();
    if (NG()) NG().pulseBulbs(false);
  }
  /** SH-53: the item glow as strong, as wide and on the same beat as the tick's ring (GLOW), whether WebGL or the canvas halo. */
  function tuneGlow(S, obj) {
    const g = obj.glowFx;
    const ring = GLOW.radius;
    const mine = (t) => (t.targets || []).some((x) => x === g.fx || x === g.halo);
    if (g.fx && obj.preFX) {
      g.tweens.filter(mine).forEach((t) => t.stop());
      g.tweens = g.tweens.filter((t) => !mine(t));
      obj.preFX.remove(g.fx);
      obj.preFX.padding = Math.max(obj.preFX.padding || 0, ring * 3.6);
      g.fx = obj.preFX.addGlow(GLOW.color, ring * 0.4, 0, false, 0.1, Math.round(ring * 2.2));
      g.tweens.push(S.tweens.add({ targets: g.fx, outerStrength: ring * 1.2, duration: GLOW.ms / 2, yoyo: true, repeat: -1, ease: "Sine.easeInOut" }));
    } else if (g.halo) {
      g.tweens.filter(mine).forEach((t) => t.stop());
      g.tweens = g.tweens.filter((t) => !mine(t));
      const c = S.opaqueBox(obj);
      g.halo.setSize && g.halo.setSize(c.w * 1.25 + ring * 4, c.h * 1.2 + ring * 3.4);
      g.halo.setAlpha(GLOW.alpha);
      g.tweens.push(S.tweens.add({ targets: g.halo, alpha: GLOW.alpha * 0.45, scale: 1.1, duration: GLOW.ms / 2, yoyo: true, repeat: -1 }));
    }
  }

  /** Start a station: its view, its goal line (first time or guided), its step on the mission card. */
  async function begin(S, ctx, key, view, { closed = false } = {}) {
    ladderStart(S, ctx);
    Cook.focusBox = null; // the last station's test crop box (flow.js hook focus) goes with it
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
    if (global.Lifecycle && global.Lifecycle.stageStart) global.Lifecycle.stageStart("cook:station");
    Cook.quietUntil = Date.now() + ((Cook.data.calm || {}).quietMs || 0);
    Cook.save.seenStation[key] = true;
    // a station whose card starts folded at this level (§14a, chaat's L4: Mech.define closedFrom) folds it before the
    // pop-up below, so that pop-up is the shared closed big card: the order heard, never written (non-negotiable 6)
    if (closed && UI.mission && UI.mission.closeCards) UI.mission.closeCards(true, { peek: true });
    // a part of the order that waits for this station comes up in the shared request pop-up before play (S04-B)
    if (ctx.nextStep) await ctx.nextStep(key);
    // Wave 6: the first time here, dim all but the next thing and show the move (js/cook/coach.js).
    // Only in a guided run (a dish's first order; the lab's "Nani helps"): the spotlight can be the answer
    if (Cook.Coach && UI.w6() && ctx.guided) Cook.Coach.start(key);
    // the child can act from here: the help ladder's idle time counts from now (not from the art loading and the pop-up read-out)
    if (NG()) NG().poke();
  }
  /**
   * A phase's first-time coach inside a station that has already begun (29 Sept, X11): daar's tadka and
   * stir run on after the chop in the same view, so its begin can't start them. Same rule as begin's.
   */
  function coach(ctx, key) {
    if (Cook.Coach && UI.w6() && ctx && ctx.guided) Cook.Coach.start(key);
  }
  function end() {
    // S04-B (decision 75 (3), SH-66, Z5): a station's end is a stage end: every voice stops (the pantry's lines never
    // reach the next station or the serve), every bubble goes
    if (global.Lifecycle) global.Lifecycle.stageEnd("cook:station");
    if (Cook.Coach) Cook.Coach.stop();
    Cook.inStation = false;
    ladderStop();
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
   * s04-fxc: a station's art, loaded before it starts, with a safety cap in real time (never Cook.wait: at test speed
   * a 5 s cap became 1 s and maani's millet pile drew as Phaser's missing square, a tap target nobody could hit; a slow
   * connection did the same at 5 s). The cap only stops a dead file hanging the game.
   */
  S$.loadArt = (S, list, ms = 20000) => Promise.race([S$.load(S, list), new Promise((r) => setTimeout(r, ms))]);
  /**
   * A spoon stir in a vessel (anything with a rim and a surface): a spoon dips in,
   * goes round twice with a swirl on the liquid, and lifts out.
   */
  /** Where a stir's teaspoon starts (its bowl at the top of its round) and its size: Cook.Spoon lands a spoonful there. */
  S$.stirStart = (vessel) => {
    const p = vessel.surface ? vessel.surface() : vessel.rim;
    return { x: p.x, y: p.y - vessel.rim.ry * 0.45, L: vessel.rim.rx / 60 };
  };
  /*
   * CHAI-13 (S06 round 3): dipped: the spoon is already in (a spoonful just landed there, S$.stirStart), so it goes round
   * at once, never lifting out and dipping in again. A spoonful while the spoon is still going round sends it round again
   * (it was skipped: two quick sugars stirred once, and the second spoonful's stir never showed).
   */
  S$.stirIn = (S, vessel, { ms = 700, turns = 2, dipped = false } = {}) => {
    if (!vessel || !vessel.rim || !vessel.active) return Promise.resolve();
    if (vessel.stirring) {
      vessel.stirAgain = (vessel.stirAgain || 0) + 1;
      return Promise.resolve();
    }
    vessel.stirring = true;
    vessel.stirAgain = 0;
    const p = vessel.surface ? vessel.surface() : vessel.rim;
    const rx = vessel.rim.rx * 0.45;
    const ry = vessel.rim.ry * 0.45;
    const L = vessel.rim.rx / 60;
    const sp = S.track(S.add.graphics().setDepth(D.fx + 1)); // CHAI-13 (S06): the stirring teaspoon over the puff, never hidden by it
    const sw = S.track(S.add.graphics().setDepth(D.item + 0.5));
    let first = true;
    const draw = (u) => {
      const a = -Math.PI / 2 + u * turns * Math.PI * 2;
      const x = p.x + Math.cos(a) * rx;
      const y = p.y + Math.sin(a) * ry;
      // dips in (unless it is already in), lifts out at the last round's end
      const lift = Math.max(first && !dipped ? 1 - u * 8 : 0, vessel.stirAgain > 0 ? 0 : 1 - (1 - u) * 8, 0);
      sp.clear().setAlpha(1 - lift * 0.7);
      // the handle leans out to the lower right (the hand's side), the bowl in the liquid (CHAI-13: a teaspoon)
      S$.teaspoon(sp, x, y - lift * L * 20, x + L * 70, y + L * 38 - lift * L * 20, L);
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
    };
    draw(0); // in this frame: a spoonful's spoon hands over to it with no gap
    return new Promise((resolve) => {
      const round = () =>
        S.tweens.addCounter({
          from: 0,
          to: 1,
          duration: ms,
          ease: "Linear",
          onUpdate: (tw) => draw(tw.getValue()),
          onComplete: () => {
            if (vessel.stirAgain > 0 && sp.active) {
              vessel.stirAgain--;
              first = false;
              round();
              return;
            }
            vessel.stirring = false;
            sp.destroy();
            S.tweens.add({ targets: sw, alpha: 0, duration: 300, onComplete: () => sw.destroy() });
            resolve();
          },
        });
      round();
    });
  };

  /*
   * CHAI-13 (C18): a real teaspoon, drawn until the art run's (art.s02 "teaspoon") lands: a deep oval bowl with its
   * shine, a thin neck and a handle that widens to a rounded end, steel with a darker edge. (bx, by) is the bowl,
   * (hx, hy) the handle's end; heap: the colour of what's on it (sugar), or null.
   */
  S$.teaspoon = function (g, bx, by, hx, hy, L, heap = null) {
    const a = Math.atan2(hy - by, hx - bx);
    const len = Math.hypot(hx - bx, hy - by);
    const nx = -Math.sin(a);
    const ny = Math.cos(a);
    const at = (t, w) => ({ x: bx + Math.cos(a) * len * t + nx * w, y: by + Math.sin(a) * len * t + ny * w });
    const neck = 0.22;
    const pts = [at(neck, L * 1.6), at(0.78, L * 3.4), at(0.97, L * 3.6), at(1, 0), at(0.97, -L * 3.6), at(0.78, -L * 3.4), at(neck, -L * 1.6)];
    g.fillStyle(0x8d9198, 1);
    g.fillPoints(pts.map((p, i) => ({ x: p.x + (i < 3 ? nx : -nx) * 0.8, y: p.y + (i < 3 ? ny : -ny) * 0.8 })), true);
    g.fillStyle(0xc9ccd2, 1);
    g.fillPoints(pts, true);
    g.fillStyle(0xeef0f3, 0.8);
    g.fillPoints([at(neck + 0.05, L * 0.4), at(0.9, L * 1.2), at(0.9, L * 0.2), at(neck + 0.05, -L * 0.2)], true);
    // the bowl: an oval along the handle's line
    const bw = L * 15;
    const bh = L * 10;
    const ell = (w, h, dx = 0) => {
      const out = [];
      for (let i = 0; i < 20; i++) {
        const t = (i / 20) * Math.PI * 2;
        const ex = Math.cos(t) * w + dx;
        const ey = Math.sin(t) * h;
        out.push({ x: bx + Math.cos(a) * ex - Math.sin(a) * ey, y: by + Math.sin(a) * ex + Math.cos(a) * ey });
      }
      return out;
    };
    g.fillStyle(0x8d9198, 1);
    g.fillPoints(ell(bw + 1.2, bh + 1.2), true);
    g.fillStyle(0xd9dbe0, 1);
    g.fillPoints(ell(bw, bh), true);
    g.fillStyle(0xa9adb4, 1);
    g.fillPoints(ell(bw * 0.78, bh * 0.7, -L * 1), true);
    if (heap != null) {
      g.fillStyle(heap, 1);
      g.fillPoints(ell(bw * 0.7, bh * 0.62, -L * 1), true);
    } else {
      g.fillStyle(0xffffff, 0.75);
      g.fillPoints(ell(bw * 0.25, bh * 0.18, -L * 5), true);
    }
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

  /*
   * S02-B (T1-T19, decision 55, rule R2): Nani's guide box is the NEXT STEP, one line at a time, in step with the
   * highlight. A station names its steps by guide key (data/cook.json `guide`: a Mum line, else the engine's grey
   * to-record placeholder) and moves the box on as each step opens:
   *   const g = St.steps(ctx);   g.to("maani-line:take", {glow(on), line})   g.done()   g.poke()   g.key
   * Level 1: the line is shown and said as the step opens; level 2+: only after a pause, with the glow (Session A's
   * UI.step). The same key twice in a row is the same step (no repeat). Old pages without UI.step get guideFor.
   */
  S$.guideLine = (key) => Lang.guideLine(key, ((Cook.data && Cook.data.guide) || {})[key] || {});
  /**
   * "Bataato wiji chad!": the next thing and Mum's "put it in" as ONE sentence, the engine's DoIt with its object (SH-97, P15:
   * "there's a full stop there, there shouldn't be ... it's just put in potato, a one sentence instruction"). Was two lines
   * joined, "Bataato." then "Wiji chad!".
   */
  S$.addLine = (id) => Object.assign(Lang.say({ fn: "DoIt", verb: "v.put-in", obj: Lang.itemOf([id]) }), { key: "guide-add" });
  S$.steps = function (ctx) {
    let cur = null;
    const g = {
      get key() {
        return cur;
      },
      to(key, o = {}) {
        const id = o.id || key;
        if (!key) return g.done();
        if (id === cur && !o.force) return null;
        cur = id;
        // decision 80: the guide key's own line is her how-to line (not an order); a station's own line says so itself
        const line = o.line ? (o.role ? Lang.role(o.line, o.role) : o.line) : Lang.role(S$.guideLine(key), "howto");
        if (UI.step) return UI.step(line, { glow: o.glow || null, hide: o.hide || (ctx ? hideKnown(ctx) : undefined), quiet: !!o.quiet, ids: o.ids });
        if (UI.guideFor) UI.guideFor(key);
        return null;
      },
      done() {
        cur = null;
        if (UI.stepDone) UI.stepDone();
      },
      poke: () => UI.stepPoke && UI.stepPoke(),
      help: () => UI.stepHelp && UI.stepHelp(),
    };
    return g;
  };
  /**
   * The shared step engine (was CookScene.step in stations.js; the help ladder's side for the stations that wait for one tap
   * among items: the pantry, the add stations, tadka). Waits for the player to tap `expected` among `items` ({key: obj}).
   * A wrong item wiggles (level 1) or lands quietly (level 2+); from the second wrong try the right one glows.
   * HELP (SH-60, SH-95): nothing is said or lit when it opens, guided or not; once the child has done nothing for the
   * ladder's pause (NaniGuide.PAUSE by level, counted from the last action on the page) Nani says the word and the item
   * glows at the same moment; again only after REPEAT more of no action. The first (hint) counts as help, the glow as
   * "shown" (accuracy badge), unless this is the guided first play.
   */
  S$.step = function (S, { items, expected, word, guided, sayLine, allowAny, onWrong, onLand, quiet = false, io = Cook.IO, ctl = null }) {
    return new Promise((resolve) => {
      let misses = 0;
      const target = items[expected];
      let poll = null;
      const cleanup = () => {
        clearInterval(poll);
        Object.values(items).forEach((o) => {
          S.untap(o);
          S.glow(o, false);
        });
      };
      // C3 (E14): the caller can stop this step (a thing was taken back: the step starts again with it)
      if (ctl)
        ctl.cancel = () => {
          cleanup();
          io.expect(null);
          resolve({ cancelled: true, misses });
        };
      // Nani is a voice at a station; the row she names throbs on the card (UX 13)
      const hint = () => sayLine && UI.voice(sayLine).catch(() => {});
      const openedAt = Date.now();
      let helped = 0;
      let helpedAt = 0;
      poll = setInterval(() => {
        const g = NG();
        if (!g || !target || !target.active) return;
        const idle = Math.min(g.idleMs(), Date.now() - openedAt);
        const need = helped ? g.REPEAT : g.PAUSE[Math.min(g.PAUSE.length, levelOf()) - 1];
        if (idle < need || (helped && Date.now() - helpedAt < g.REPEAT)) return;
        helped++;
        helpedAt = Date.now();
        if (!guided && Cook.onHelp) Cook.onHelp("hint");
        if (g && g.logHelp) g.logHelp("help", { step: "idle", by: `L${levelOf()} ${expected}` });
        // (a step with no word of its own to say here, the pantry's guided step: the step's line, through the stepper)
        if (sayLine) hint();
        else if (UI.stepHelp) {
          g.idleHelp = true;
          try {
            UI.stepHelp();
          } finally {
            g.idleHelp = false;
          }
        }
        S.glow(target, true, { bounce: true, now: true });
        if (!guided && Cook.onHelp) Cook.onHelp("shown", { ids: [expected] }); // being shown costs the accuracy badge
      }, 200);
      Object.entries(items).forEach(([key, obj]) => {
        if (!obj || !obj.active) return;
        S.tappable(obj, () => {
          if (key === expected || (allowAny && allowAny(key))) {
            cleanup();
            io.expect(null);
            resolve({ key, misses });
          } else if (quiet) {
            // Wave 6b (UX 11), level 2 up: a wrong pick lands like any other (onLand moves it);
            // nothing says it's wrong now, the end review does
            misses++;
            Cook.sfx.pop();
            if (onWrong) onWrong(key, misses);
            if (onLand) {
              S.untap(obj);
              onLand(key, obj);
            }
          } else {
            misses++;
            S.wiggle(obj);
            Cook.sfx.soft();
            if (onWrong) onWrong(key, misses);
            if (misses >= 2) {
              S.glow(target, true, { bounce: true, now: true });
              if (misses === 2 && !guided && Cook.onHelp) Cook.onHelp("shown", { ids: [expected] }); // being shown costs the accuracy badge
            }
          }
        });
      });
      const c = S.centre(target);
      io.expect({
        kind: "tap",
        x: c.x,
        y: c.y,
        key: expected,
        wrongs: Object.keys(items)
          .filter((k) => k !== expected && items[k] && items[k].active)
          .map((k) => S.centre(items[k])),
      });
    });
  };

  /*
   * Decision 51 (CK-23): a wrong item is redone on the spot, never the whole game. A station keeps one tracker per
   * round (ctx.redo, from flow.js / OrderCard.redo; a lab page without it gets its own) and asks it per item key.
   */
  S$.redo = (ctx) => (ctx && ctx.redo) || (ctx && (ctx.redo = global.OrderCard && global.OrderCard.redo ? global.OrderCard.redo({ max: 3 }) : null)) || {
    wrong: () => ({ tries: 3, action: "show" }),
    help: () => false,
    tries: () => 0,
    right: () => 0,
  };

  /*
   * S02-B: the art run's pictures by id (data/cook.json art.s02). St.art(id) is the entry once it has landed
   * (ready, with its file and measured meta), else null, and the station keeps its current art. St.artLoad(ids)
   * gives the [key, url] pairs to load (only the ready ones: nothing missing is ever fetched); the texture key is
   * "s02-<id>".
   */
  S$.art = (id) => {
    const e = ((((Cook.data || {}).art || {}).s02 || {})[id]) || null;
    return e && e.ready && e.file ? e : null;
  };
  S$.artKey = (id) => `s02-${id}`;
  S$.artLoad = (ids) => [].concat(ids).filter((id) => S$.art(id)).map((id) => [S$.artKey(id), S$.art(id).file]);
  /** Has the art run's picture for this id loaded into the scene? */
  S$.hasArt = (S, id) => !!(S$.art(id) && S.textures && S.textures.exists(S$.artKey(id)));

  // (moved from js/cook/mechanics/assemble.js, CK-25: fill, fry, samosa and daar use them too)
  /** A number from a knob: n, or [min, max] (random). */
  const knobInt = (v) => (Array.isArray(v) ? v[0] + Math.floor(Math.random() * (v[1] - v[0] + 1)) : v);
  S$.knobInt = knobInt;

  /**
   * One free pick: resolves {id, obj} when any item is tapped, or {done}
   * when Done is pressed (offered if `doneOk`). `next` is what the order
   * wants next (for the guided glow and the test only; never shown
   * otherwise). Nothing is refused.
   */
  S$.freePick = (z, { items, next, doneOk, doneGlow, help = false }) =>
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
      if (target && (z.guided || help)) S.glow(target, true); // help: a redo's second try (decision 51)
      if (target) {
        const c = S.centre(target);
        const wrongs = Object.keys(items)
          .filter((k) => k !== next && items[k] && items[k].active)
          .map((k) => S.centre(items[k]));
        z.expect({ kind: "tap", x: c.x, y: c.y, key: next, wrongs });
      } else if (doneOk) z.expect({ kind: "click", selector: "#done-btn", open: Object.values(items).some((o) => o && o.active) }); // open: a pick still changes it
      else z.expect({ kind: "wait" });
    });

  /** The customer speaks from the sidebar card (their face on it, never over the play area). */
  S$.customerSay = async (ctx, line, opts = {}) => {
    const face = document.querySelector("#nani-card .nc-face");
    const who = ctx.order && ctx.order.who;
    if (face && who && who !== "nani") {
      face.dataset.nani = face.dataset.nani || face.getAttribute("src");
      face.src = Cook.v(Cook.facePath(who));
    }
    return UI.say(line, { badge: true }, opts).catch(() => {});
  };
  S$.customerDone = () => {
    const face = document.querySelector("#nani-card .nc-face");
    UI.hideBubble();
    if (face && face.dataset.nani) face.src = face.dataset.nani;
  };

  S$.BURNER = BURNER;
  S$.STRIP_Y = STRIP_Y;
  S$.begin = begin;
  S$.end = end;
  S$.coach = coach;
  S$.row = row;
})(window);

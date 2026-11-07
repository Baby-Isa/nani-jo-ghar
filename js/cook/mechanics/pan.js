/*
 * The kitchen kit's pan (Sprint 18, the module map's piece 5: "pans and their looks"; docs/architecture/module-map.md).
 * A pan from exactly above on its burner, its contents shown only by pictures (never drawn: ART-12, CK-06): one picture per
 * look on one registration (each placed by its own measured rim centre), a contents picture over it for the looks that have
 * one (cut to the pan's contents circle), the next look fading in over the last, the handle drawn again over the heat ring,
 * the spoonfuls lying on the surface until they sink in at the boil, the glow ring, the chosen pan's warm pool. Taken from
 * the reference game's pan (the signed-off build, 7 Nov) so that game's values give its look exactly; no game is named here
 * (STD-F1-02): every picture, measure and colour is the game's, from its settings file (`kit.pan`, the set below).
 *
 *   Cook.Kit.pan(S, o)               a pan; o: at {x, y} (the burner's centre), rimR (the rim's drawn radius) or panR
 *                                    (the outer size the flames are sized to; rimR = panR x set.rimOfPan), set (below),
 *                                    lookOf(pan) -> [look, next look or null, how far 0..1] (the game decides which look),
 *                                    heaps(pan) -> the spoonfuls on its surface or null (pan.heaps below), depth (the base,
 *                                    Cook.D.item), handleDepth (Cook.D.fx - 1.9), shadow (true: the contact shadow), sel
 *                                    {pool, ring, badge} (the chosen pan's colours and the face badge's size), spoonWet(pan)
 *                                    (the stirring spoon's wet look, Cook.Spoon: "empty" by default)
 *     -> pan {x, y, rimR, rIn, panR, scale, img, mix, disc, mixDisc, handle, glowRing, bits, spices, bubbles, sel, selRing,
 *             layers, vessel (what the shared spoon aims at), shown, fading, depth,
 *             show(fade?)          the look now (fade {from, u}: the last look, the new one over it at u), as lookOf says
 *             fade(from, ms=450)   the look cross-fades from `from` to what lookOf says now -> Promise
 *             view(a, b, u)        a look and the next one over it at u, whatever lookOf says (the lab's way to show any)
 *             heaps(list, sink)    the spoonfuls on the surface (sugar heaps, pictures, small heaps), sinking (1 -> 0)
 *             select(on, face)     the chosen pan: a warm pool of light under it and a gold ring round its face
 *             glow(on)             the glow ring on the rim (only while it is the next thing)
 *             hide(), unhide()     every layer, the shadow and the bubbles off and back (a pour carries the pan away)
 *             destroy()}
 *   Cook.Kit.pan.art(set)            [key, url] pairs to load: every look and contents picture
 *   Cook.Kit.pan.look(im, set, name) put look `name` on an image by its registration, or the nearest look already in
 *                                    (set.near) while its picture still loads (CHAI-91: never the missing square)
 *   Cook.Kit.pan.stage(set, name)    [look picture, contents picture or null] for a look (pure; Node tests it)
 *   Cook.Kit.pan.land(S, targets, o) a thing lands: a small squash and settle (o.top: a top-down thing dips; k, ms)
 *
 * The set (a game's `kit.pan` in data/stations/<game>.json):
 *   looks {name: {key, file, w, h, cx, cy}}  the pan's pictures, each by its rim centre in source px
 *   rim, inner                                the rim's and the contents' radius, source px
 *   turn, mirror, bodyDy                      the pan's turn (degrees), flipped (the spout on the other side), the outline's
 *                                             drop from the burner's centre (source px)
 *   handle [a, b]                             the handle's wedge, degrees from its own direction
 *   near {look: [nearest looks]}              what shows while a look's picture still loads
 *   stages {look: [picture, contents?]}       each look of the game: its pan picture and a contents picture over it
 *   disc {prefix, w, cx, cy, rIn, files}      the contents pictures (cut to the contents' circle): key prefix, canvas width,
 *                                             registration (fractions), contents radius (of w), {name: url}
 *   ring {colour, width}                      the glow ring's colour and line
 *   sel {pool, poolA, badge}                  the chosen pan's pool of light (colour, alpha) and its face badge's size
 *   heaps {wet, wetA, crystals [3], under, underA}  the spoonfuls' colours (sugar on its wet patch; a small heap's shade)
 *   rimOfPan                                  the rim's radius over the outer size (panR)
 */
import { Cook as CookNS } from "../ns.js";

(function (global) {
  const Cook = CookNS;
  const DEPTH = { item: 30, fx: 40 }; // (Cook.D's, when the kit is used on a lab page with no Cook scene)
  const D = () => Cook.D || DEPTH;
  const int = (c, d) => (c == null ? d : typeof c === "number" ? c : parseInt(String(c).replace(/^#/, ""), 16));
  const track = (S, o) => (S.track ? S.track(o) : o);
  // (a mask's fill: only its shape counts; the white token)
  const MASK = () => (global.Tokens && global.Tokens.int ? global.Tokens.int("white") : 1);

  /** [look picture, contents picture or null] for a look of the set (the empty pan for a look it lacks). */
  function stage(set, name) {
    const st = (set.stages && (set.stages[name] || set.stages.empty)) || [name];
    return [st[0], st[1] || null];
  }

  /** Look `name` on image `im`, by its own registration point; the nearest look in while its picture loads (CHAI-91). */
  function look(im, set, name) {
    let t = set.looks[name];
    const tm = im.scene && im.scene.textures;
    if (tm && !tm.exists(t.key)) {
      const waits = (im.lookWaits = im.lookWaits || new Set());
      if (!waits.has(t.key)) {
        waits.add(t.key);
        const k = t.key;
        tm.once(`addtexture-${k}`, () => {
          waits.delete(k);
          if (im.active && im.lookWant) look(im, set, im.lookWant);
        });
      }
      im.lookWant = name;
      const near = ((set.near || {})[name] || []).concat("empty").find((k) => set.looks[k] && tm.exists(set.looks[k].key));
      if (!near) return im;
      t = set.looks[near];
    } else im.lookWant = name;
    if (im.texture.key !== t.key) im.setTexture(t.key);
    // (mirrored: Phaser flips a picture within its own box, so the registration point is taken from the other side)
    return im.setFlipX(!!set.mirror).setOrigin(set.mirror ? 1 - t.cx / t.w : t.cx / t.w, t.cy / t.h);
  }

  /** What to load for a set: its looks and its contents pictures. */
  function art(set) {
    const out = Object.values(set.looks).map((t) => [t.key, t.file]);
    const d = set.disc;
    if (d && d.files) Object.keys(d.files).forEach((k) => out.push([d.prefix + k, d.files[k]]));
    return out.filter(([key], i, a) => a.findIndex(([k2]) => k2 === key) === i);
  }

  /**
   * A thing lands (Sprint 11, the motion on the real art): a small squash, a bounce back, and it settles. A side-on thing squashes on
   * its base; a top-down one (a pan set on its burner, a glass as it fills) dips towards the worktop and back.
   */
  function land(S, targets, { k = 0.07, top = false, ms = 320 } = {}) {
    [].concat(targets)
      .filter((o) => o && o.active && o.scene)
      .forEach((o) => {
        if (o.landTw) {
          o.landTw.stop();
          o.setScale(o.landTw.sx, o.landTw.sy);
        }
        const sx = o.scaleX;
        const sy = o.scaleY;
        const keys = top ? [[1 - k * 0.6, 1 - k * 0.6], [1 + k * 0.22, 1 + k * 0.22], [1, 1]] : [[1 + k, 1 - k], [1 - k * 0.4, 1 + k * 0.45], [1, 1]];
        const part = [0.28, 0.34, 0.38];
        let i = 0;
        const step = () => {
          if (!o.active) return;
          if (i >= keys.length) return (o.landTw = null);
          const [a, b] = keys[i];
          const tw = S.tweens.add({ targets: o, scaleX: sx * a, scaleY: sy * b, duration: ms * part[i], ease: "Sine.easeOut", onComplete: step });
          i++;
          o.landTw = { stop: () => tw.stop(), sx, sy };
        };
        step();
      });
  }

  function pan(S, o) {
    const set = o.set;
    const Dp = D();
    const base = o.depth != null ? o.depth : Dp.item;
    const handleDepth = o.handleDepth != null ? o.handleDepth : Dp.fx - 1.9;
    const rimR = o.rimR != null ? o.rimR : o.panR * (set.rimOfPan || 0.92);
    const panR = o.panR != null ? o.panR : rimR / (set.rimOfPan || 0.92);
    const s8 = rimR / set.rim; // the pictures' scale
    const rIn = set.inner * s8;
    const x = o.at.x;
    const y = o.at.y - (set.bodyDy || 0) * s8;
    const dc = set.disc || null;
    // the contents' pictures, cut to this pan's contents circle: their own contents' radius a little past it
    const discScale = dc ? (rIn * 1.03) / (dc.rIn * dc.w) : 1;
    const regDisc = (im) => im.setOrigin(dc.cx, dc.cy).setScale(discScale);
    // the glow ring (CHAI-25: a ring on the rim's centre, never the picture's box with its handle), one texture per rim size
    const ringKey = `kit-pan-ring-${set.rim}`;
    if (!S.textures.exists(ringKey)) {
      const g = S.make.graphics({ add: false });
      g.lineStyle((set.ring && set.ring.width) || 9, int(set.ring && set.ring.colour, MASK()), 1);
      g.strokeCircle(set.rim + 16, set.rim + 16, set.rim + 4);
      g.generateTexture(ringKey, 2 * set.rim + 32, 2 * set.rim + 32);
      g.destroy();
    }
    const top = (name, depth) => look(track(S, S.add.image(x, y, set.looks[name].key)), set, name).setScale(s8).setAngle(set.turn || 0).setDepth(depth);
    const img = top("empty", base);
    img.baseScale = s8;
    if (o.shadow !== false && S.contactShadow) img.shadow = S.contactShadow(img, { centerX: x, centerY: y + panR * 0.08, width: panR * 2.15, height: panR * 2.15 });
    const discMask = (() => {
      const mg = S.make.graphics({ add: false });
      mg.fillStyle(MASK(), 1);
      mg.fillCircle(x, y, rIn);
      return mg.createGeometryMask();
    })();
    const firstDisc = dc && dc.files ? Object.keys(dc.files)[0] : null;
    const discImg = (depth) => {
      if (!firstDisc) return track(S, S.add.image(x, y, "__DEFAULT")).setDepth(depth).setVisible(false);
      return regDisc(track(S, S.add.image(x, y, dc.prefix + firstDisc))).setDepth(depth).setVisible(false).setMask(discMask);
    };
    const disc = discImg(base + 0.02);
    const mix = top("empty", base + 0.05).setAlpha(0);
    const mixDisc = discImg(base + 0.07);
    const glowRing = track(S, S.add.image(x, y, ringKey).setScale(s8).setDepth(base + 0.45).setVisible(false));
    // CHAI-12 (C19): the handle stays fully opaque OVER the heat ring: drawn again above it, masked to its wedge (the empty picture's)
    const handle = top("empty", handleDepth);
    {
      const mg = S.make.graphics({ add: false });
      const pts = (set.handle || [-14, 14]).map((d) => (set.mirror ? 180 - d : d) + (set.turn || 0)).flatMap((deg, k) => {
        const t = (deg * Math.PI) / 180;
        // (from just past the contents: the empty picture never covers what is in the pan)
        const inner = { x: x + Math.cos(t) * rIn * 1.03, y: y + Math.sin(t) * rIn * 1.03 };
        const outer = { x: x + Math.cos(t) * rimR * 3, y: y + Math.sin(t) * rimR * 3 };
        return k ? [outer, inner] : [inner, outer];
      });
      mg.fillStyle(MASK(), 1);
      mg.fillPoints(pts, true);
      handle.setMask(mg.createGeometryMask());
    }
    // SH-32: what was spooned in lies on the surface until it boils in; CK-06: the spice pictures over the sugar's heaps
    const bits = track(S, S.add.graphics().setDepth(base + 0.3));
    const spices = track(S, S.add.container(0, 0).setDepth(base + 0.32));
    spices.setMask(discMask);
    const bubbles = track(S, S.add.graphics().setDepth(base + 0.5));
    const sel = track(S, S.add.graphics().setDepth(base - 0.5));
    const selRing = track(S, S.add.graphics().setDepth(base + 0.95));
    const layers = { mix, disc, mixDisc, handle, bits, spices };
    const p = { x, y, rimR, rIn, panR, scale: s8, depth: base, set, img, mix, disc, mixDisc, handle, glowRing, bits, spices, bubbles, sel, selRing, layers, shown: "empty", fading: false, spicePics: {} };

    // what the shared spoon aims at (Cook.Spoon): a vessel with a rim and a surface; o.spoonWet(pan) the stirring spoon's wet look
    p.vessel = { active: true, rim: { x, y, rx: rIn, ry: rIn, depth: 0 }, rimRx: rIn, rimRy: rIn, surface: () => ({ x, y }) };
    p.vessel.spoonWet = () => (o.spoonWet ? o.spoonWet(p) : "empty");
    img.panOf = p;
    // a look's contents picture on one of the two disc layers
    const discOn = (im, k, alpha) => {
      if (!k || alpha <= 0 || !dc) return im.setVisible(false);
      if (im.texture.key !== dc.prefix + k) regDisc(im.setTexture(dc.prefix + k)).setRotation(0);
      return im.setVisible(true).setAlpha(alpha);
    };
    const tex = (name, topIm, dsc, alpha) => {
      const [k8, kd] = stage(set, name);
      look(topIm, set, k8);
      discOn(dsc, kd, alpha);
    };
    p.view = (a, b, u) => {
      tex(a, img, disc, 1);
      if (b) tex(b, mix, mixDisc, u);
      else discOn(mixDisc, null, 0);
      mix.setAlpha(b ? u : 0);
      return p;
    };
    p.show = (fade) => {
      if (!fade && p.fading) return p; // something's going in: its fade has the picture
      let [a, b, u] = o.lookOf ? o.lookOf(p) : [p.shown, null, 0];
      if (fade && fade.u < 1 && fade.from !== a) [a, b, u] = [fade.from, a, fade.u];
      else if (!fade || fade.u >= 1) p.shown = b && u >= 0.5 ? b : a;
      p.view(a, b, u);
      if (o.heaps) {
        const h = o.heaps(p);
        if (h) p.heaps(h.list, h.sink);
      }
      return p;
    };
    p.fade = (from, ms = 450) =>
      new Promise((done) => {
        p.fading = true;
        S.tweens.addCounter({
          from: 0,
          to: 1,
          duration: ms,
          onUpdate: (tw) => p.show({ from, u: tw.getValue() }),
          onComplete: () => {
            p.fading = false;
            p.show();
            done();
          },
        });
      });
    /*
     * SH-32: each spoonful lies on the surface where it went (no invisible counters): list [{heap: true} | {pic: {key, w, n}} |
     * {colour}] in the order they went in. A heap of sugar (or the salt that looks like it) on a darker wet patch, fine crystals
     * lit from the top left (a seeded scatter: the same spoonful looks the same every frame); a picture laid where it went (an
     * elchi pod, a ginger slice: CK-06); anything else a small heap of its colour. Spots go round the middle by the golden angle,
     * so heaps never stack. sink 1 -> 0 as it boils in (the heaps and pictures fade, the pictures shrink a little). An empty list
     * (or no liquid: list null) clears them.
     */
    p.heaps = (list, sink = 1) => {
      const g = bits;
      if (!g || !g.active) return p;
      g.clear();
      if (!list) {
        Object.values(p.spicePics).forEach((im) => im && im.active && im.destroy());
        p.spicePics = {};
        return p;
      }
      const H = set.heaps || {};
      const crystals = (H.crystals || [null, null, null]).map((c) => int(c, MASK()));
      const spot = (i) => {
        const a = i * 2.39996 - 0.6;
        const r = rIn * (0.22 + 0.2 * ((i * 0.618) % 1));
        return { x: x + Math.cos(a) * r, y: y + Math.sin(a) * r };
      };
      const keep = new Set();
      // the heaps first (sugar and its lookalike), then everything else in the order it went in (as the reference game draws them)
      const heaps = list.filter((s) => s.heap);
      const rest = list.filter((s) => !s.heap);
      let i = 0;
      heaps.forEach(() => {
        const q = spot(i);
        // SH-32 (s08 w8A): a third bigger, on a darker wet patch, so each spoonful reads at laptop size
        const w = rIn * 0.32;
        g.fillStyle(int(H.wet, 0), H.wetA != null ? H.wetA : 0.26).fillEllipse(q.x + w * 0.05, q.y + w * 0.08, w * 1.05, w * 0.66);
        let seed = (i + 1) * 9301;
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
        for (let c = 0; c < 72; c++) {
          const a = rnd() * Math.PI * 2;
          const rr = Math.sqrt(rnd());
          const cx = q.x + Math.cos(a) * rr * w * 0.5;
          const cy = q.y + Math.sin(a) * rr * w * 0.3 - (1 - rr) * w * 0.08;
          const lit = Math.cos(a + 2.4) * 0.5 + 0.5;
          const col = lit > 0.6 ? crystals[0] : lit > 0.3 ? crystals[1] : crystals[2];
          const sz = Math.max(1.4, w * (0.035 + rnd() * 0.03));
          g.fillStyle(col, 1).fillRect(cx - sz / 2, cy - sz / 2, sz, sz);
        }
        i++;
      });
      rest.forEach((s) => {
        const q = spot(i++);
        const sp = s.pic;
        if (sp && sp.key && S.textures.exists(sp.key)) {
          const tw = S.textures.get(sp.key).getSourceImage().width || 1;
          for (let k = 0; k < sp.n; k++) {
            const tag = `${s.id || sp.key}:${k}`;
            keep.add(tag);
            let im = p.spicePics[tag];
            if (!im || !im.active) {
              im = S.add.image(0, 0, sp.key);
              spices.add(im);
              p.spicePics[tag] = im;
            }
            const off = sp.n > 1 ? [[-0.06, -0.02, 0.5], [0.08, 0.06, -0.45]][k] || [0, 0, 0.3] : [0, 0, 0.3];
            const sc = ((sp.w * rIn * 2) / tw) * (0.86 + 0.14 * sink);
            im.setPosition(q.x + off[0] * rIn, q.y + off[1] * rIn).setRotation(off[2]).setScale(sc);
          }
          return;
        }
        const w = rIn * 0.22;
        g.fillStyle(int(H.under, 0), H.underA != null ? H.underA : 0.2).fillEllipse(q.x + w * 0.06, q.y + w * 0.1, w, w * 0.6);
        g.fillStyle(int(s.colour, int(H.blob, 0)), 1).fillEllipse(q.x, q.y, w, w * 0.58);
      });
      Object.keys(p.spicePics).forEach((tag) => {
        if (keep.has(tag)) return;
        const im = p.spicePics[tag];
        if (im && im.active) im.destroy();
        delete p.spicePics[tag];
      });
      g.setAlpha(sink);
      spices.setAlpha(sink);
      return p;
    };
    // the chosen pan: a warm pool of light under it, and a gold ring round its face (several pans in play only: the game decides)
    p.select = (on, face) => {
      sel.clear();
      selRing.clear();
      if (!on) return p;
      const so = Object.assign({}, set.sel || {}, o.sel || {});
      for (let j = 0; j < 3; j++) {
        sel.fillStyle(int(so.pool, int(set.ring && set.ring.colour, MASK())), so.poolA != null ? so.poolA : 0.14);
        sel.fillCircle(x, y, panR * (1.06 + j * 0.08));
      }
      if (face) {
        const gold = so.ring != null ? int(so.ring) : global.Tokens && global.Tokens.cookInk ? global.Tokens.cookInk().gold : global.Tokens.int("gold");
        selRing.lineStyle(5, gold, 1);
        selRing.strokeCircle(face.x, face.y, (so.badge || 64) / 2 + 4);
      }
      return p;
    };
    p.glow = (on) => (glowRing.setVisible(!!on), p);
    const all = () => [img, mix, disc, mixDisc, handle, bits, spices];
    p.hide = () => {
      Object.values(layers).forEach((im) => im.setVisible(false));
      bubbles.setVisible(false);
      if (img.shadow) img.shadow.setVisible(false);
      return p;
    };
    p.unhide = () => {
      Object.values(layers).forEach((im) => im.setVisible(true));
      bubbles.setVisible(true);
      if (img.shadow) img.shadow.setVisible(true);
      // (the disc layers show only where a look has a contents picture)
      p.show();
      return p;
    };
    p.destroy = () => {
      all().concat(glowRing, bubbles, sel, selRing, img.shadow).forEach((im) => im && im.active && im.destroy());
      Object.values(p.spicePics).forEach((im) => im && im.active && im.destroy());
    };
    return p;
  }

  pan.art = art;
  pan.look = look;
  pan.stage = stage;
  pan.land = land;
  Cook.Kit = Cook.Kit || {};
  Cook.Kit.pan = pan;
})(globalThis);

export const KitPan = CookNS.Kit.pan;
export default KitPan;

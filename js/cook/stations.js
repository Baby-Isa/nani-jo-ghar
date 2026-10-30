/*
 * Cook with Nani: the Phaser scene and the helpers every station shares
 * (Phase A). The stations themselves live in station-lib.js.
 *
 * Views: "service" (the family at the island) and "pantry" use painted
 * backgrounds; every cooking station uses a top-down worktop ("marble",
 * "hob", "wood"), so tools can rotate and hands can come up from the
 * bottom of the screen: painted for marble and hob (data.art.sprites.bg,
 * loaded as the view fades in), drawn in code otherwise.
 *
 * Shared helpers: props with contact shadows, item labels that fade by
 * word stage, glow and wiggle (the step engine is js/cook/station-lib.js's
 * S$.step since wave 1A), hold-to-pour, a ring timer that sits on the food ("tap when
 * it's green"), first-person hands, a fingertip demo, particles, and a
 * pause that "pass me" uses in Relaxed mode. Cook.expect always says what
 * the player should do next, for the end-to-end test.
 *
 * Several things can run at once (two tawas, three skewers, a combined
 * station's zones), so per-frame work goes through addTick() rather than
 * one `tick` slot, and pour/ring report what they expect through an
 * `io` ({expect, gauge}; see zone.js) instead of writing the globals.
 */
import { Cook as CookNS } from "./ns.js";
import { setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame } from "./life.js";

(function (global) {
  const Cook = CookNS;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const W = 1600;
  const H = 900;
  const D = { bg: 0, back: 5, char: 10, occ: 20, item: 30, item2: 32, front: 34, fx: 40, hand: 45, top: 50 };

  const CHARS = {
    // s08 (ART-13, ART-10): her jaw-fixed lean set (v3), one canvas 460x501, head 186 px wide at 1:1, drawn at 0.90
    // (s08-rejudge-fixes: her head 0.85 of Ma's). s08-nani-ground (Zafar, 16 Oct: "her body is completely floating"; then
    // "aim for hands and arms resting on knee or lap as if sitting on a stool behind"): the whole family sit on stools behind
    // the counter, hands in their laps, the counter's front (the occluder, y 611 down) over the lower part of their forearms,
    // never a strip of cabinet between an arm and the counter. One rule for everyone: the lowest point of every arm sits at
    // least 4 px under the occluder's top, so the talk's 2 px lift and 0.4 degree tilt never open a gap. Nani: her body meets
    // the counter at canvas row 449.7 (the source's counter line, build/tools/art/specs/s08-nani.cut-data.json
    // counter_row), so top = 615 - 449.7 x 0.90 = 210 (her crown 213.6, Ma's 228.4: a touch taller); the others 6 px lower
    // than before (their hands were on the edge). pointTip: her fingertip on the canvas (cut-data front.tip).
    nani: { x: 330, top: 210, scale: 0.9, pointTip: [193.2, 530.7] },
    nana: { x: 940, top: 181, scale: 1.25 },
    ma: { x: 940, top: 201, scale: 1.14 },
    cousin: { x: 940, top: 296, scale: 1.02 },
  };

  /** How far a station may raise its scene pieces into the extra worktop above the design box (k of it; see fitView). */
  Cook.lift = (k = 0.5) => Math.round(((Cook.view && Cook.view.ey) || 0) * k);
  /**
   * A zone whose Y (and P) raise the scene by Cook.lift(): a station lays its scene pieces out with it and
   * keeps the plain zone for the shelf band, so a taller stage puts them in the middle of the worktop.
   * Everything else (input, expectations, reporting) is the zone's own.
   */
  Cook.liftZone = function (z, lift = Cook.lift()) {
    if (!lift) return z;
    const Y = (y) => z.Y(y) - lift;
    const P = (x, y) => ({ x: z.X(x), y: Y(y) });
    return new Proxy(z, {
      get(t, key) {
        if (key === "Y") return Y;
        if (key === "P") return P;
        if (key === "unlifted") return t;
        const v = t[key];
        return typeof v === "function" ? v.bind(t) : v;
      },
      set(t, key, v) {
        t[key] = v;
        return true;
      },
    });
  };
  /** An x just past the right edge of what's shown (a person sliding in from the right), never on a wide stage. */
  Cook.offRight = (x = 1760) => Math.max(x, ((Cook.view && Cook.view.right) || 1600) + 160);

  class CookScene extends Phaser.Scene {
    constructor() {
      super("cook");
    }

    preload() {
      /*
       * Decision 68 (J11, S02-E): the scene loads only what every screen shares: the kitchen (the redrawn one with its
       * three trays, decision 64, once art.s02 "kitchen-trays" has landed), Nani and the customers, the cousin's badge
       * (data/cook.json art.assets.shared). A station's own pictures (its props, painted sprites and station art) load
       * when it's chosen (St.begin -> Cook.Art.need), prefetched while the order is read (Cook.Art.prefetch); never
       * another station's. Each texture key keeps the name the code draws it by.
       */
      const kt = (((Cook.data && Cook.data.art) || {}).s02 || {})["kitchen-trays"];
      const shared = ((((Cook.data && Cook.data.art) || {}).assets || {}).shared || {}).images || {};
      Object.entries(shared).forEach(([key, url]) => this.load.image(key, key === "bg-service" && kt && kt.ready && kt.file ? kt.file : url));
      if (!shared["bg-service"]) this.load.image("bg-service", kt && kt.ready && kt.file ? kt.file : "assets/cook/bg/service.jpg");
    }

    create() {
      // decision 64 (S02-E): on the redrawn kitchen each customer stands behind their own tray (its measured middle)
      const kt = (((Cook.data && Cook.data.art) || {}).s02 || {})["kitchen-trays"];
      const trays = kt && kt.ready && kt.meta && Array.isArray(kt.meta.trays) ? kt.meta.trays : null;
      if (trays && trays[1]) ["nana", "ma", "cousin"].forEach((c) => (CHARS[c].x = trays[1][0]));
      this.cameras.main.setBackgroundColor("#e9dcc4");
      this.bg = this.add.image(0, 0, "bg-service").setOrigin(0).setDepth(D.bg);
      this.bgExt = [];
      // the stage fill (queue item 8): the world grows with the stage (Phaser.Scale.EXPAND), see fitView
      this.scale.on("resize", () => this.fitView());
      this.fitView();
      this.layer = [];
      this.chars = {};
      this.loops = [];
      this.ticks = [];
      this.tweens.timeScale = Cook.speed;
      this.time.timeScale = Cook.speed;
      Cook.scene = this;
      this.events.on("update", () => {
        if (Cook.paused) {
          this.lastTick = performance.now();
          return;
        }
        if (this.tick) this.tick();
        if (this.ticks.length) this.ticks.slice().forEach((t) => t.fn && t.fn());
      });
      if (Cook.onSceneReady) Cook.onSceneReady(this);
    }

    /* ---------------- the visible world (the stage fill, queue item 8) ----------------
     * The game is Phaser.Scale.EXPAND on a 1600x900 base: the canvas fills #stage and the world shown
     * grows past 1600x900 in whichever direction the stage has room (a laptop stage is taller than 16:9,
     * a phone held sideways wider). Stations still lay out in the 1600x900 design box; the camera keeps
     * that box centred across and anchored to the BOTTOM (the shelf band reaches the stage's bottom
     * edge), so the extra height is worktop above it. Cook.view is the visible world rectangle
     * {left, top, right, bottom, ex, ey}; Cook.lift(k) is how far a station may raise its scene pieces
     * into the extra height (k of it), so they sit in the middle of the worktop, not squeezed to the shelf.
     * Backgrounds are cover-fitted to the view (never stretched); the pantry's photo stays 1:1 (its
     * shelves are the tap targets) and its edges carry on in the photo's own edge colours. */
    fitView() {
      const gs = this.scale.gameSize;
      const gw = Math.round(gs.width);
      const gh = Math.round(gs.height);
      const ex = Math.max(0, gw - W);
      const ey = Math.max(0, gh - H);
      const cam = this.cameras.main;
      cam.setSize(gw, gh);
      cam.setZoom(1);
      cam.setScroll(-ex / 2, -ey);
      Cook.view = { left: -ex / 2, top: -ey, right: W + ex / 2, bottom: H, w: gw, h: gh, ex, ey };
      this.fitBg();
      if (UI.onViewFit) UI.onViewFit();
    }
    /** The wood worktop's size for the visible view at the screen's own resolution, and its texture's key. */
    woodAt() {
      const v = Cook.view;
      const cr = this.game.canvas.getBoundingClientRect();
      const sc = Math.max(1, Math.ceil(((cr.width / Math.max(1, v.w)) * (window.devicePixelRatio || 1)) * 4) / 4);
      const vw = Math.round(v.right - v.left);
      const vh = Math.round(v.bottom - v.top);
      return { key: `bg:wood@${vw}x${vh}@${sc}`, vw, vh, sc };
    }
    /**
     * CK-48 (S13-V fix round): a view's worktop made ahead of its swap, in a quiet moment while the order's card is up: the wood
     * (drawn in code, about 0.4 s at a phone's speed) and a painted worktop's picture (loaded and decoded). Never shown here.
     */
    prewarmView(name) {
      try {
        if (!name || !Cook.view || !this.game || !this.game.canvas) return;
        if (name === "wood" && Cook.Art.worktopAt) {
          const { key, vw, vh, sc } = this.woodAt();
          if (!this.textures.exists(key)) this.textures.addCanvas(key, Cook.Art.worktopAt(vw, vh, sc, { wood: true }));
        } else if (Cook.Art.refUrl && Cook.Art.refUrl(`bg:${name}`)) Cook.Art.load(this, `bg:${name}`);
      } catch (e) {
        /* made at the swap, as before */
      }
    }
    /** A background texture, fitted to the visible world. */
    setBg(key) {
      this.bg.setTexture(key);
      this.fitBg();
    }
    fitBg() {
      const bg = this.bg;
      const v = Cook.view;
      if (!bg || !v || !bg.texture) return;
      this.bgExt.forEach((o) => o.destroy());
      this.bgExt = [];
      const src = bg.texture.getSourceImage();
      const bw = src.width || W;
      const bh = src.height || H;
      const k0 = W / bw; // every background is drawn 1600 wide in the design box
      bg.setVisible(true);
      /*
       * contract-11, SH-91, ART-05 (s08 w7A): a top-down worktop with a tile (data.art.sprites.bgTile[view]: the s08c marble,
       * WT1, seamless both ways and upscaled x2) is laid tiled at its own size (k design px per source px), never zoomed, so a
       * taller or wider stage shows more marble; the hob's plate (cut from bg-cook-hob-t-v1, x2) lies on it at its place in
       * the design box (box: where the -1600 picture drew it, so the burners stay at St.BURNER at every size).
       */
      const tile = Cook.Art.bgTile ? Cook.Art.bgTile(this.viewName) : null;
      if (tile && /^spr:bg:/.test(bg.texture.key)) {
        bg.setVisible(false);
        const k = tile.k || 0.5;
        const tw = bw * k;
        const th = bh * k;
        for (let y = Math.floor(v.top / th) * th; y < v.bottom; y += th)
          for (let x = Math.floor(v.left / tw) * tw; x < v.right; x += tw) this.bgExt.push(this.add.image(x, y, bg.texture.key).setOrigin(0).setScale(k).setDepth(D.bg));
        const pk = tile.plate && `bgplate-${tile.plate}`;
        if (pk && this.textures.exists(pk) && tile.box) {
          const [x0, y0, x1, y1] = tile.box;
          this.bgExt.push(this.add.image(x0, y0, pk).setOrigin(0).setDisplaySize(x1 - x0, y1 - y0).setDepth(D.bg + 0.05));
        }
        return;
      }
      // the wood (drawn in code: no painting): drawn for the visible view at the screen's own resolution, never zoomed
      if (this.viewName === "wood" && bg.texture.key === "bg:wood" && Cook.Art.worktopAt) {
        const { key, vw, vh, sc } = this.woodAt();
        if (this.woodKey && this.woodKey !== key && this.textures.exists(this.woodKey)) this.textures.remove(this.woodKey);
        if (!this.textures.exists(key)) this.textures.addCanvas(key, Cook.Art.worktopAt(vw, vh, sc, { wood: true }));
        this.woodKey = key;
        bg.setVisible(false);
        this.bgExt.push(this.add.image(v.left, v.top, key).setOrigin(0).setScale(1 / sc).setDepth(D.bg));
        return;
      }
      if (this.viewName === "pantry") {
        bg.setOrigin(0).setPosition(0, 0).setScale(k0);
        this.extendEdges(bg.texture.key, src, k0);
        return;
      }
      // SH-91, CK-44 (s07-cook): the kitchen's master (art.s02 kitchen-trays `core`) is drawn 1:1 with its 1600x900
      // core on the design box, so the stage shows more of the one picture instead of zooming it; the counter's
      // occluder and the trays' fronts are cut from the same picture at the same place (serviceFrame), so no seam
      if (bg.texture.key === "bg-service") {
        const f = Cook.serviceFrame(this);
        if (f.master) {
          bg.setOrigin(0).setPosition(f.ox, f.oy).setScale(1 / f.k);
          this.extendEdges(bg.texture.key, src, 1 / f.k, f.ox, f.oy);
          return;
        }
      }
      // cover the view, scaled about a pivot that stays put: the service picture's island edge (the
      // family lean on it), a worktop's middle (nothing sits on its pattern)
      const piv = this.viewName === "service" || !this.viewName ? { x: W / 2, y: 520 } : { x: W / 2, y: (v.top + v.bottom) / 2 };
      const dh = bh * k0;
      const need = Math.max(1, (piv.x - v.left) / piv.x, (v.right - piv.x) / (W - piv.x), (piv.y - v.top) / piv.y, (v.bottom - piv.y) / Math.max(1, dh - piv.y));
      bg.setOrigin(piv.x / W, piv.y / dh).setPosition(piv.x, piv.y).setScale(k0 * need);
    }
    /**
     * A picture's edges carried on past it (its own edge rows and columns), for a stage of another shape: the pantry
     * photo, or a stage wider or taller than the kitchen's master. The picture covers [ox, ox + bw*k] x [oy, oy + bh*k].
     */
    extendEdges(key, src, k, ox = 0, oy = 0) {
      const v = Cook.view;
      const strip = (name, sx, sy, sw, sh) => {
        const tk = `bgedge-${key}-${name}`;
        if (!this.textures.exists(tk)) {
          const c = document.createElement("canvas");
          c.width = sw;
          c.height = sh;
          c.getContext("2d").drawImage(src, sx, sy, sw, sh, 0, 0, sw, sh);
          this.textures.addCanvas(tk, c);
        }
        return tk;
      };
      const add = (tk, x, y, w, h) => this.bgExt.push(this.add.image(x, y, tk).setOrigin(0).setDisplaySize(w, h).setDepth(D.bg - 0.1));
      const bw = src.width;
      const bh = src.height;
      const x0 = ox;
      const y0 = oy;
      const x1 = ox + bw * k;
      const y1 = oy + bh * k;
      const top = Math.min(y0, v.top);
      const tall = Math.max(y1, v.bottom) - top;
      if (v.top < y0) add(strip("t", 0, 0, bw, 2), x0, v.top, x1 - x0, y0 - v.top + 1);
      if (v.bottom > y1) add(strip("b", 0, bh - 2, bw, 2), x0, y1 - 1, x1 - x0, v.bottom - y1 + 1);
      if (v.left < x0) add(strip("l", 0, 0, 2, bh), v.left, top, x0 - v.left + 1, tall);
      if (v.right > x1) add(strip("r", bw - 2, 0, 2, bh), x1 - 1, top, v.right - x1 + 1, tall);
    }

    /* ---------------- views ---------------- */
    track(obj) {
      this.layer.push(obj);
      return obj;
    }
    clearView() {
      Cook.undoAt = null; // a take-back belongs to the view that offered it
      this.loops.forEach((l) => l.stop && l.stop());
      this.loops = [];
      this.tweens.killAll();
      this.time.removeAllEvents();
      this.input.removeAllListeners();
      this.layer.forEach((o) => o && o.destroy && o.destroy());
      this.layer = [];
      this.chars = {};
      this.tick = null;
      this.ticks = [];
      if (Cook.Hub) Cook.Hub.reset();
      Cook.gauge = null;
      Cook.expect = null;
      Cook.paused = false;
    }
    /** Run fn every frame (not while paused); returns a function that stops it. */
    addTick(fn) {
      const t = { fn };
      this.ticks.push(t);
      return () => {
        t.fn = null;
        const i = this.ticks.indexOf(t);
        if (i >= 0) this.ticks.splice(i, 1);
      };
    }
    async setView(name, { fast, underCard = false } = {}) {
      const cam = this.cameras.main;
      // CK-48 (S13-V; Zafar 22 Oct: "still just a light brown screen"): a station coming in under the order card as it flies
      // into the sidebar swaps without fading the old view out to the light brown cover (the card covers the cut), and fades
      // in quickly
      const dur = fast || underCard ? 120 : 220;
      // a painted worktop (data.art.sprites.bg) loads while the old view fades
      const bgRef = `bg:${name}`;
      // SH-108 (P31: "if it's top-down then it should be the marble countertop"): a top-down worktop waits for its painting
      // (only a dead file's 20 s cap), never the code-drawn worktop after 2.5 s; the other views keep the short wait
      // (Zafar, 29 Oct: "the image loads and then jerks into a different version or different zoom level": the kitchen too waits
      // for its painting, so it is never drawn first as the stand-in at another fit and then swapped)
      const topDown = name === "marble" || name === "hob" || name === "service";
      // (a tiled worktop's hob plate loads with it: contract-11)
      const tileSpec = Cook.Art.bgTile ? Cook.Art.bgTile(name) : null;
      const plateLoad = tileSpec && tileSpec.plate ? Cook.Art.loadFile(this, `bgplate-${tileSpec.plate}`, tileSpec.plate.startsWith("assets/") ? `${tileSpec.plate}.webp` : `assets/cook/bg/${tileSpec.plate}.webp`) : Promise.resolve(true);
      const bgLoad = Cook.Art.refUrl(bgRef) ? Promise.race([Promise.all([Cook.Art.load(this, bgRef), plateLoad]), new Promise((r) => setTimeout(r, topDown ? 20000 : 2500))]) : null;
      if (this.viewName && !underCard) {
        cam.fadeOut(dur, 233, 220, 196);
        await Cook.wait(dur + 20);
      }
      if (bgLoad) await bgLoad;
      this.clearView();
      this.viewName = name;
      // the tally goes back to its corner (a view may place it: the pantry puts it on the fridge)
      if (UI.tallyAt) UI.tallyAt(null);
      // a painted view (data.art.sprites.bg) once loaded; the service and the old pantry photo otherwise
      // (the old pantry photo, only if the painted one never came: loaded now, decision 68)
      if (name === "pantry" && !Cook.Art.sprite(this, bgRef) && !this.textures.exists("bg-pantry")) await Cook.Art.loadFile(this, "bg-pantry", "assets/cook/bg/pantry.jpg");
      if ((name === "service" || name === "pantry") && !Cook.Art.sprite(this, bgRef)) this.setBg(`bg-${name}`);
      else this.setBg(Cook.Art.tex(this, `bg:${name}`));
      UI.hideBubble();
      // (under the card: never covered, so no fade back from the cover either)
      if (underCard) {
        if (cam.resetFX) cam.resetFX();
      } else cam.fadeIn(dur, 233, 220, 196);
    }
    tex(key) {
      return Cook.Art.tex(this, key);
    }

    /* ---------------- building blocks ---------------- */
    texSize(key) {
      const src = this.textures.get(key).getSourceImage();
      return { w: src.width, h: src.height };
    }
    fitScale(key, maxW, maxH) {
      const { w, h } = this.texSize(key);
      return Math.min(maxW / w, maxH / h);
    }
    /** A prop standing on a surface: origin bottom-centre, contact shadow. */
    prop(key, x, baseline, maxW, maxH, { depth = D.item, shadow = true } = {}) {
      const s = this.fitScale(key, maxW, maxH);
      let sh = null;
      if (shadow) {
        const { w } = this.texSize(key);
        sh = this.track(this.add.ellipse(x, baseline - 4, w * s * 0.8, Math.max(10, w * s * 0.12), 0x3a2410, 0.22).setDepth(depth - 1));
      }
      const img = this.track(this.add.image(x, baseline + 4, key).setOrigin(0.5, 1).setScale(s).setDepth(depth));
      img.baseScale = s;
      img.shadow = sh;
      return img;
    }
    /** A top-down thing (bowl, vessel, board) centred at x, y, fitted in a box. */
    flat(key, x, y, maxW, maxH, { depth = D.item } = {}) {
      const s = this.fitScale(key, maxW, maxH);
      const img = this.track(this.add.image(x, y, key).setScale(s).setDepth(depth));
      img.baseScale = s;
      if (Cook.Art.isPainted(key)) img.shadow = this.contactShadow(img);
      return img;
    }
    /**
     * A soft contact shadow under a painted sprite (the drawings bake their
     * own): a little down and to the right, away from the window light.
     * It follows the object (moved, scaled, faded, hidden) until fly() lifts it
     * off the surface (sh.lifted). `box` overrides the footprint.
     */
    contactShadow(img, box) {
      const b = box || img.getBounds();
      const sh = this.track(
        this.add
          .image(b.centerX + b.width * 0.035, b.centerY + b.height * 0.06, this.tex("shadow"))
          .setDisplaySize(b.width * 1.02, b.height * 0.98)
          .setDepth(img.depth - 0.6)
      );
      const s0 = { x: img.x, y: img.y, sx: img.scaleX || 1, sy: img.scaleY || 1, dx: sh.x - img.x, dy: sh.y - img.y, kx: sh.scaleX, ky: sh.scaleY };
      const follow = () => {
        if (!img.active || !sh.active) return;
        const fx = img.scaleX / s0.sx;
        const fy = img.scaleY / s0.sy;
        sh.setPosition(img.x + s0.dx * fx, img.y + s0.dy * fy).setScale(s0.kx * fx, s0.ky * fy);
        sh.setVisible(img.visible && !sh.lifted).setAlpha(img.alpha);
      };
      this.events.on("update", follow);
      img.once("destroy", () => {
        this.events.off("update", follow);
        sh.destroy();
      });
      return sh;
    }
    /** An ingredient as a heaped bowl (or its photo), with a stage label. */
    ingredient(id, x, y, { w = 170, h = 128, label = true, depth = D.item, state } = {}) {
      const key = Cook.Art.wordTex(this, id, state);
      const img = this.flat(key, x, y, w, h, { depth });
      img.wordId = id;
      if (label) img.label = this.label(img, id);
      return img;
    }
    centre(obj) {
      const b = obj.getBounds();
      return { x: b.centerX, y: b.centerY, w: b.width, h: b.height };
    }

    /**
     * A small label under an item, faded by how well the player knows the
     * word: text + speaker (new), speaker only (learning), nothing (known).
     */
    label(obj, id, { mode } = {}) {
      mode = mode || Cook.labelMode(id);
      if (mode === "none") return null;
      // Sidebar v3 (28 Sept, late; docs/archive/feedback/cook-ui-feedback-2026-09-28.md 10): an item whose word is
      // hidden shows no label at all, never a lone speaker bubble (its word is on the card's face = replay)
      if (mode !== "text") return null;
      const c = this.centre(obj);
      const ph = Cook.isPlaceholder(id);
      const text = mode === "text" ? Cook.display(id) : "";
      const cont = this.track(this.add.container(c.x, c.y + c.h / 2 + 4).setDepth(D.fx + 2));
      const t = text
        ? this.add
            .text(0, 0, text, { fontFamily: ph ? (global.Tokens && global.Tokens.font ? global.Tokens.font("body", "Nunito, sans-serif") : "Nunito, sans-serif") : (global.Tokens && global.Tokens.font ? global.Tokens.font("display", '"Baloo 2", Nunito, sans-serif') : '"Baloo 2", Nunito, sans-serif'), fontSize: "34px", fontStyle: ph ? "italic bold" : "bold", color: ph ? global.Tokens.hex("ink-rec") : global.Tokens.hex("ink-said") })
            .setOrigin(0, 0.5)
        : null;
      const iconW = 30;
      const w = (t ? t.width + 14 : 0) + iconW + 18;
      const bg = this.add.graphics();
      bg.fillStyle(0xfffaf1, 0.86);
      bg.fillRoundedRect(-w / 2, -24, w, 48, 24);
      bg.lineStyle(2, 0x3a2410, 0.12);
      bg.strokeRoundedRect(-w / 2, -24, w, 48, 24);
      const sp = this.add.graphics();
      const sx = -w / 2 + 12;
      sp.fillStyle(0x2d2018, 0.85);
      sp.fillRect(sx, -6, 7, 12);
      sp.fillTriangle(sx + 6, -6, sx + 16, -13, sx + 16, 13);
      sp.fillTriangle(sx + 6, 6, sx + 16, -13, sx + 16, 13);
      sp.lineStyle(2.5, 0x2d2018, 0.85);
      sp.beginPath();
      sp.arc(sx + 18, 0, 7, -0.9, 0.9);
      sp.strokePath();
      cont.add([bg, sp]);
      if (t) {
        t.x = sx + iconW + 2;
        cont.add(t);
      }
      // a long (placeholder) word on a small screen: the label grows so its text is never under 14px as rendered
      const shown = this.scale.displaySize.height / this.scale.gameSize.height;
      const base = text ? Math.max(1, 14.2 / (34 * shown * this.cameras.main.zoom)) : 1;
      cont.setScale(base);
      cont.setSize(w, 42);
      cont.setInteractive(new Phaser.Geom.Rectangle(-w / 2, -21, w, 42), Phaser.Geom.Rectangle.Contains);
      cont.on("pointerdown", (p, lx, ly, ev) => {
        if (ev && ev.stopPropagation) ev.stopPropagation();
        Cook.unlockAudio();
        if (Cook.onLabel) Cook.onLabel(id); // from word stage 3, hearing the target's label is help
        Lang.speakWord(id);
        this.tweens.add({ targets: cont, scale: base * 1.12, duration: 90, yoyo: true });
      });
      obj.once("destroy", () => cont.destroy());
      return cont;
    }

    tappable(obj, fn) {
      obj.setInteractive({ useHandCursor: true });
      obj.removeAllListeners("pointerdown");
      obj.on("pointerdown", (p) => {
        Cook.unlockAudio();
        if (Cook.paused) return;
        // something was done (the first-time overlay moves on: js/cook/coach.js)
        Cook.acted = (Cook.acted || 0) + 1;
        // the player's own hand does it (js/cook/hands.js): decoration only, it never changes the tap
        try {
          if (Cook.Hands) Cook.Hands.tapped(this, obj, p);
        } catch (e) {
          console.warn("hands:", e);
        }
        fn(p);
      });
      return obj;
    }
    untap(obj) {
      if (obj && obj.input) {
        obj.removeAllListeners("pointerdown");
        obj.disableInteractive();
      }
    }
    /**
     * The "this one" highlight (28 Sept, Zafar): a soft glow around the picture itself, and (for a
     * thing to fetch or tap next: opts.bounce) a small bounce of the picture, centred on the picture,
     * never on the picture and its label together. WebGL: a glow that follows the picture's own
     * outline; canvas: a soft halo behind the picture's opaque part.
     */
    glow(obj, on = true, opts = {}) {
      if (!obj) return;
      /*
       * SH-53 (s04-fxc): one highlight at a time, in every station. Every glow asked for is kept in order; only the
       * latest still standing shows, and when it goes the one before it comes back (maani's next dough waits while the
       * maani on the tawa is in its band; two samosas golden at once glow one after the other). A picture destroyed
       * without its glow off drops out.
       */
      const st = (this._glows = (this._glows || []).filter((g) => g.obj.active && g.obj.scene));
      const i = st.findIndex((g) => g.obj === obj);
      if (i >= 0) st.splice(i, 1);
      if (on && obj.active) st.push({ obj, opts });
      else this.glowDraw(obj, false);
      const top = st.length ? st[st.length - 1] : null;
      st.forEach((g) => g !== top && g.obj.glowFx && this.glowDraw(g.obj, false));
      if (top && (!top.obj.glowFx || top.obj === obj)) this.glowDraw(top.obj, true, top.opts);
      // CK-41: and the ✓'s glow waits while a picture glows (one highlight at a time, the DOM's and the canvas's together)
      if (Cook.UI && Cook.UI.holdDone) Cook.UI.holdDone(top ? top.obj : null);
    }
    /** The glow itself, drawn or taken off (glow() decides which one shows). */
    glowDraw(obj, on = true, { bounce = false } = {}) {
      if (!obj) return;
      if (obj.glowFx) {
        const g = obj.glowFx;
        g.tweens.forEach((t) => t.stop());
        if (g.fx && obj.preFX) obj.preFX.remove(g.fx);
        if (g.halo) g.halo.destroy();
        obj.glowFx = null;
        if (obj.active) {
          if (g.y != null) obj.y = g.y;
          obj.setScale(obj.baseScale || obj.scale);
        }
      }
      if (!on || !obj.active) return;
      const base = obj.baseScale || obj.scale;
      obj.baseScale = base;
      const tweens = [];
      let fx = null;
      let halo = null;
      if (obj.preFX && this.renderer && this.renderer.type === Phaser.WEBGL) {
        obj.preFX.padding = Math.max(obj.preFX.padding || 0, 20);
        fx = obj.preFX.addGlow(0xffcf6a, 3, 0, false, 0.1, 14);
        tweens.push(this.tweens.add({ targets: fx, outerStrength: 8, duration: 520, yoyo: true, repeat: -1, ease: "Sine.easeInOut" }));
      }
      // SH-60 (s08 w6J: the WebGL outline alone was too thin to see on a pantry jar, so her line came "without the highlight"):
      // a soft glow behind the picture in both renderers. EASY-08 (the judge, 23 Oct: "a solid pale-gold disc ... an oval plate round
      // the jar": Zafar's rejected round glow in a square box): it is the picture's own silhouette, blurred gold, so it follows its
      // outline (glowHalo below); it rides the hop with the picture
      halo = this.glowHalo(obj);
      if (halo) tweens.push(this.tweens.add({ targets: halo, alpha: 0.75, duration: 520, yoyo: true, repeat: -1, ease: "Sine.easeInOut" }));
      // (a test hook, only logged: when a glow comes on, so a check can hold it to Nani's help line, SH-60)
      try {
        if (window.Lifecycle && window.Lifecycle.note) window.Lifecycle.note("glow", { step: "on", by: String(obj.wordId || (obj.texture && obj.texture.key) || "") });
      } catch (e) {
        /* only a log */
      }
      // a small hop of the picture itself (its label and shadow stay where they are)
      let y = null;
      if (bounce && typeof obj.y === "number" && !this.tweens.isTweening(obj)) {
        y = obj.y;
        // (the judge, 23 Oct: a clear hop up and back, the shared kit's share of the thing's height, Onboard.HOP, in every game)
        const hop = Math.max(8, Math.min(48, obj.displayHeight * ((window.Onboard && window.Onboard.HOP) || 0.1)));
        tweens.push(this.tweens.add({ targets: obj, y: y - hop, duration: 300, yoyo: true, repeat: -1, repeatDelay: 450, ease: "Quad.easeOut" }));
      }
      obj.glowFx = { fx, halo, tweens, y };
    }
    /**
     * The glow from a picture's own outline (EASY-08): its silhouette drawn once, blurred, in the focus gold (an offscreen canvas:
     * only the shadow of the picture lands on it), as an image behind the picture with the same frame, origin, scale and angle, kept
     * on it every frame (the hop). A picture with no texture (a container, a drawing) gets none. -> the image, or null.
     */
    glowHalo(obj) {
      const fr = obj.frame;
      const img = fr && fr.source && fr.source.image;
      if (!img || !obj.texture || !fr.cutWidth || !fr.cutHeight) return null;
      const k = Math.abs(obj.scaleX || 1) || 1;
      // S12 W2-A (the judge, 23 Oct: the jar's glow "barely visible on 915x412"): the glow is sized on the SCREEN, not the world.
      // A phone shows the game shrunk (ds game px to a CSS px), so the same world blur was a few screen px; it keeps at least
      // 14 screen px at every size, and is laid on more times where it is spread wider, so it reads as strongly
      const ds = Math.max(1, (this.scale && this.scale.displayScale && this.scale.displayScale.x) || 1);
      const blur = Math.round(Math.max(6, Math.min(160, Math.max(13, 14 * ds) / k)));
      const passes = ds > 1.2 ? 5 : 3;
      const key = `__glow:${obj.texture.key}:${fr.name}:${blur}:${passes}`;
      const w = fr.cutWidth;
      const h = fr.cutHeight;
      const p = Math.ceil(blur * 1.8);
      if (!this.textures.exists(key)) {
        const ct = this.textures.createCanvas(key, w + 2 * p, h + 2 * p);
        if (!ct) return null;
        const g = ct.getContext();
        const OFF = 20000;
        g.shadowColor = "rgba(255, 176, 40, 1)";
        g.shadowBlur = blur;
        g.shadowOffsetX = OFF;
        // laid on three times (five on a phone), for a glow that reads at a glance; the picture itself lands off the canvas, only
        // its shadow on it
        for (let i = 0; i < passes; i++) g.drawImage(img, fr.cutX, fr.cutY, w, h, p - OFF, p, w, h);
        ct.refresh();
      }
      const halo = this.add.image(obj.x, obj.y, key).setOrigin((obj.originX * w + p) / (w + 2 * p), (obj.originY * h + p) / (h + 2 * p));
      const box = obj.parentContainer;
      if (box) box.addAt(halo, Math.max(0, box.getIndex(obj)));
      else this.track(halo);
      const sync = () => {
        if (!halo.active || !obj.active) return;
        halo.setPosition(obj.x, obj.y).setScale(obj.scaleX, obj.scaleY).setAngle(obj.angle).setVisible(obj.visible).setDepth(obj.depth - 0.5);
      };
      sync();
      this.events.on("update", sync);
      halo.once("destroy", () => this.events.off("update", sync));
      return halo;
    }
    /** The opaque part of an image in world px (its texture's transparent margins left out). */
    opaqueBox(obj) {
      const b = obj.getBounds();
      const out = { x: b.centerX, y: b.centerY, w: b.width, h: b.height };
      try {
        if (!obj.texture || !obj.frame) return out;
        const key = `${obj.texture.key}:${obj.frame.name}`;
        const cache = (Cook._opaque = Cook._opaque || {});
        if (!cache[key]) {
          const f = obj.frame;
          const cv = document.createElement("canvas");
          cv.width = f.cutWidth;
          cv.height = f.cutHeight;
          const g = cv.getContext("2d", { willReadFrequently: true });
          g.drawImage(f.source.image, f.cutX, f.cutY, f.cutWidth, f.cutHeight, 0, 0, f.cutWidth, f.cutHeight);
          const d = g.getImageData(0, 0, cv.width, cv.height).data;
          let x0 = cv.width, y0 = cv.height, x1 = -1, y1 = -1;
          for (let y = 0; y < cv.height; y += 2)
            for (let x = 0; x < cv.width; x += 2)
              if (d[(y * cv.width + x) * 4 + 3] > 40) {
                if (x < x0) x0 = x;
                if (x > x1) x1 = x;
                if (y < y0) y0 = y;
                if (y > y1) y1 = y;
              }
          cache[key] = x1 < 0 ? null : { x0: x0 / cv.width, y0: y0 / cv.height, x1: x1 / cv.width, y1: y1 / cv.height };
        }
        const o = cache[key];
        if (!o) return out;
        const fx = (u) => b.x + (obj.flipX ? 1 - u : u) * b.width;
        const fy = (v) => b.y + (obj.flipY ? 1 - v : v) * b.height;
        const xs = [fx(o.x0), fx(o.x1)];
        const ys = [fy(o.y0), fy(o.y1)];
        return { x: (xs[0] + xs[1]) / 2, y: (ys[0] + ys[1]) / 2, w: Math.abs(xs[1] - xs[0]), h: Math.abs(ys[1] - ys[0]) };
      } catch (e) {
        return out; // a tainted or odd texture: its bounds
      }
    }
    wiggle(obj) {
      const a = obj.angle;
      this.tweens.add({ targets: obj, angle: { from: a - 8, to: a + 8 }, duration: 70, yoyo: true, repeat: 2, onComplete: () => obj.active && obj.setAngle(a) });
    }
    // Sprint 10 (Zafar, 21 Oct): the code-drawn effects (burst, sparkle, puff, wisps, steam) don't match the art, so they
    // draw nothing for now; the matching version comes in Sprint 11. The signatures stay, so every caller still runs
    // (none of them waits on an effect: no completion callbacks).
    burst(x, y, colors, n = 12, spread = 90) {}
    /** A small "it went in" mark where something lands in a pot or a glass (28 Sept, s8). */
    puff(x, y, color = 0xffffff, size = 40, { flat = 0.72 } = {}) {}
    /** Soft steam rising from (x, y) (a pot or a glass), `n` wisps, `w` wide. */
    wisps(x, y, n = 2, w = 60) {}
    sparkle(x, y) {}
    steam(x, y, n = 3) {}
    fly(obj, x, y, { scale, duration = 520, arc = 140, depth } = {}) {
      if (depth != null) obj.setDepth(depth);
      if (obj.shadow) {
        obj.shadow.lifted = true;
        obj.shadow.setVisible(false);
      }
      if (obj.label) obj.label.setVisible(false);
      const sx = obj.x;
      const sy = obj.y;
      const s0 = obj.scale;
      return new Promise((resolve) => {
        this.tweens.addCounter({
          from: 0,
          to: 1,
          duration,
          ease: "Sine.easeInOut",
          onUpdate: (t) => {
            const k = t.getValue();
            obj.x = sx + (x - sx) * k;
            obj.y = sy + (y - sy) * k - Math.sin(k * Math.PI) * arc;
            if (scale != null) obj.setScale(s0 + (scale - s0) * k);
          },
          onComplete: () => resolve(),
        });
      });
    }
    floatText(x, y, text, color = "#ffffff", size = 54) {
      const t = this.track(
        this.add
          .text(x, y, text, { fontFamily: (global.Tokens && global.Tokens.font ? global.Tokens.font("display", '"Baloo 2", Nunito, sans-serif') : '"Baloo 2", Nunito, sans-serif'), fontSize: `${size}px`, fontStyle: "bold", color, stroke: global.Tokens.hex("ink-outline"), strokeThickness: 8 })
          .setOrigin(0.5)
          .setDepth(D.top)
      );
      this.tweens.add({ targets: t, y: y - 90, alpha: { from: 1, to: 0 }, duration: 1300, ease: "Cubic.easeOut", onComplete: () => t.destroy() });
    }
    /**
     * A result over the action, as a PICTURE (R5, T20, SH-54 of S02-A: no written English for the child): a sparkle
     * (perfect, golden, puffed), steam over the rim (boiled over), smoke (burnt, charred), a pale swatch (too early,
     * too pale, flat), a ring smaller than its target (too small, too thin, too little). Kutchi words later, where
     * Mum gives them. `words` are the same keys as before (data.verdicts).
     */
    verdict(x, y, score, words = {}) {
      const key = score >= 95 ? words.perfect || "perfect" : score >= 70 ? words.good || "good" : words.bad || "bad";
      const g = this.track(this.add.graphics().setDepth(D.top));
      const done = () => this.tweens.add({ targets: g, y: g.y - 60, alpha: { from: 1, to: 0 }, duration: 1300, ease: "Cubic.easeOut", onComplete: () => g.destroy() });
      g.setPosition(x, y);
      if (["perfect", "golden", "it-puffed", "turned", "good"].includes(key)) {
        g.destroy();
        this.sparkle(x, y);
        if (key !== "good") this.burst(x, y - 10, [0xffe08a, 0xf6c35b], 10, 80);
        return;
      }
      if (["burnt", "charred"].includes(key)) {
        g.destroy();
        for (let i = 0; i < 3; i++) this.puff(x + (i - 1) * 26, y - i * 8, 0x4a3f38, 46);
        return;
      }
      if (key === "boiled-over") {
        g.destroy();
        this.steam(x, y + 30, 5);
        return;
      }
      if (["too-early", "too-pale", "flat"].includes(key)) {
        // a pale swatch beside the golden one it should be
        g.fillStyle(0xfffaf0, 1).fillCircle(-26, 0, 22).lineStyle(4, 0xe6d5b8, 1).strokeCircle(-26, 0, 22);
        g.fillStyle(0xd9a441, 0.35).fillCircle(26, 0, 22).lineStyle(4, 0xc9962e, 0.5).strokeCircle(26, 0, 22);
        return done();
      }
      if (["too-small", "too-thin", "too-little"].includes(key)) {
        // a small ring inside the dashed target ring it should fill
        for (let a = 0; a < 16; a++) g.lineStyle(4, 0xc9962e, 0.6).beginPath().arc(0, 0, 34, (a / 16) * Math.PI * 2, ((a + 0.55) / 16) * Math.PI * 2).strokePath();
        g.lineStyle(5, 0xfffaf0, 1).strokeCircle(0, 0, 18);
        return done();
      }
      g.destroy(); // "bad", "too-much": nothing to say mid-round (UX 11)
    }
    bandScore(v, lo, hi) {
      if (v >= lo && v <= hi) return 100;
      const d = v < lo ? lo - v : v - hi;
      return Cook.clamp(100 - d * 260, 35, 99);
    }

    /* ---------------- first-person hands ---------------- */
    /** A hand from the bottom of the screen holding a tool; call .moveTo(x, y). */
    hand(tool, { x = 800, y = 700, angle = 0, k = 1 } = {}) {
      // the painted hand in the grip, the painted tool in it (js/cook/hands.js); else the drawn one
      const rig = Cook.Hands && Cook.Hands.tool(this, tool, { x, y, k });
      if (rig) return rig;
      const key = tool === "pin" ? this.tex("pin") : this.tex(`hand:${tool || ""}`);
      const img = this.track(this.add.image(x, y, key).setDepth(D.hand));
      if (tool === "pin") img.setOrigin(0.5, 0.58).setScale(0.85 * k);
      else img.setOrigin(0.5, 0.06).setScale(0.8 * k);
      img.setAngle(angle);
      img.moveTo = (tx, ty, dur = 90) => this.tweens.add({ targets: img, x: tx, y: ty, duration: dur, ease: "Sine.easeOut" });
      return img;
    }

    /* ---------------- characters (service view) ---------------- */
    addChar(who, { x, enter } = {}) {
      const c = CHARS[who];
      const key = who === "nani" ? "nani-neutral" : `${who}-neutral`;
      const img = this.track(this.add.image(x != null ? x : c.x, c.top, key).setOrigin(0.5, 0).setScale(c.scale).setDepth(D.char));
      img.who = who;
      img.baseY = c.top;
      img.mood = "neutral";
      this.tweens.add({ targets: img, scaleY: c.scale * 1.012, duration: 1700 + Math.random() * 400, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      this.chars[who] = img;
      if (who === "nani") this.pointFront(img, c);
      // ART-19 (s07 N5): Nani blinks now and then while she rests (only the neutral face; a mood or talk is never cut)
      // s08 wave 7B (ART-19): Nana, Ma and Ali too (s08c NN2, MA2, AL2: their blink frames on their neutral canvas)
      if (this.textures.exists(`${who}-blink`)) {
        const blink = () => {
          if (!img.active) return;
          if (img.mood === "neutral" && img.texture.key === `${who}-neutral`) {
            img.setTexture(`${who}-blink`);
            this.time.delayedCall(150, () => img.active && img.texture.key === `${who}-blink` && img.setTexture(`${who}-neutral`));
          }
          this.time.delayedCall(3200 + Math.random() * 2600, blink);
        };
        this.time.delayedCall(2400, blink);
      }
      if (enter) {
        img.x = W + 260;
        // (to the spot asked for: the chai tray's other people stand behind their own trays, decision 64)
        this.tweens.add({ targets: img, x: x != null ? x : c.x, duration: 900, ease: "Cubic.easeOut" });
        this.tweens.add({ targets: img, y: c.top - 14, duration: 150, yoyo: true, repeat: 2 });
      }
      return img;
    }
    /**
     * s08-nani-ground: when Nani points, her right hand comes up over the counter's back edge: the point frame's hand and
     * forearm (nani-point-front, cut by build/tools/art/specs/s08-nani.cut.json "front", on her canvas's registration, so
     * it lies exactly on her picture) drawn over the counter's front, moving with her. Her fingertip reaches into the tray in
     * front of her: the tray's own front wall (CK-21, the same cut as a served dish's) goes over it, and a soft contact
     * shadow (the shared Cook shadow) lies on the tray's floor beside her finger. Shown only while she shows the point frame.
     */
    pointFront(img, c) {
      if (!this.textures.exists("nani-point-front") || !c.pointTip) return;
      const W0 = this.texSize("nani-neutral").w;
      const front = this.track(this.add.image(img.x, img.y, "nani-point-front").setOrigin(0.5, 0).setDepth(D.occ + 0.5).setVisible(false));
      const sh = this.track(this.add.image(0, 0, this.tex("shadow")).setDepth(D.occ + 0.45).setVisible(false));
      let wall = null;
      const sync = () => {
        if (!img.active) return;
        const on = img.visible && img.texture.key === "nani-point";
        if (on && !wall && Cook.trayFrontFor) wall = Cook.trayFrontFor(this, img.x) || false;
        front.setVisible(on);
        sh.setVisible(on);
        if (wall) wall.setVisible(on);
        if (!on) return;
        front.setPosition(img.x, img.y).setScale(img.scaleX, img.scaleY).setAngle(img.angle).setAlpha(img.alpha);
        // the fingertip in the world (her picture turns about its top-centre as she talks)
        const a = (img.angle * Math.PI) / 180;
        const dx = (c.pointTip[0] - W0 / 2) * img.scaleX;
        const dy = c.pointTip[1] * img.scaleY;
        const tx = img.x + dx * Math.cos(a) - dy * Math.sin(a);
        const ty = img.y + dx * Math.sin(a) + dy * Math.cos(a);
        // on the floor just behind the wall (or under the tip, with no tray), a little right of the finger (light from the left)
        const fy = wall && wall.wallTop != null ? Math.min(ty, wall.wallTop) - 4 : ty - 2;
        sh.setPosition(tx + 6 * img.scaleX, fy).setDisplaySize(44 * img.scaleX, 16 * img.scaleY).setAlpha(img.alpha);
      };
      this.events.on("update", sync);
      img.once("destroy", () => {
        this.events.off("update", sync);
        front.destroy();
        sh.destroy();
        if (wall) wall.destroy();
      });
    }
    /**
     * The counter's front (the service picture from design y 611 down), drawn over the family: the same picture at the
     * same place and size as the background (serviceFrame), across the picture's whole width, so on any stage it is
     * one continuous counter (CK-44).
     */
    occluder() {
      const f = Cook.serviceFrame(this);
      const cy = Math.round((611 - f.oy) * f.k);
      return this.track(this.add.image(f.ox, f.oy, "bg-service").setOrigin(0).setScale(1 / f.k).setCrop(0, cy, f.bw, f.bh - cy).setDepth(D.occ));
    }
    setMood(who, mood) {
      const img = this.chars[who];
      if (!img) return;
      img.mood = mood;
      // ART-10: her box's face rests in the same mood as her counter sprite
      if (who === "nani" && UI.naniMood && mood !== "talk" && mood !== "blink") UI.naniMood(mood === "happy" ? "happy" : "neutral");
      const key =
        who === "nani"
          ? { neutral: "nani-neutral", happy: "nani-happy", talk: "nani-talk", point: "nani-point", blink: "nani-blink" }[mood] || "nani-neutral"
          : `${who}-${mood === "talk" ? "happy" : mood}`;
      img.setTexture(key);
    }
    async talk(who, line, opts = {}) {
      const img = this.chars[who];
      if (!img) return UI.say(line, { badge: true }, opts);
      const prev = img.mood;
      // s08 wave 7B (ART-19): a family customer with a talk frame (s08c NN1, MA1, AL1) talks as Nani does (below)
      const famTalk = who !== "nani" && this.textures.exists(`${who}-talk`);
      img.setTexture(who === "nani" ? (opts.mood === "point" ? "nani-point" : "nani-talk") : famTalk ? `${who}-talk` : `${who}-happy`);
      const stopBob = this.talkBob(img, who);
      // ART-19 (s08 w6G; the judge: "Nani keeps the same closed smile in all 8 frames while her line plays"): while she
      // speaks at the counter her mouth moves as the guide box's face does (js/shared/guide.js flap): her talking face
      // and her resting one in turn in the one calm cadence (NaniGuide.mouthMs, ART-19, Zafar 22 Oct), until the line ends.
      // Her mood reads "talk" meanwhile, so her resting blink never cuts in
      let flapT = 0;
      const talkKey = who === "nani" ? "nani-talk" : `${who}-talk`;
      const restKey = who === "nani" ? "nani-neutral" : `${who}-neutral`;
      if ((who === "nani" ? opts.mood !== "point" && this.textures.exists("nani-neutral") : famTalk) && this.textures.exists(restKey)) {
        img.mood = "talk";
        let open = true;
        const flap = () => {
          flapT = 0;
          if (!img.active || img.mood !== "talk") return;
          open = !open;
          img.setTexture(open ? talkKey : restKey);
          flapT = setTimeout(flap, window.NaniGuide && window.NaniGuide.mouthMs ? window.NaniGuide.mouthMs(open) : 300);
        };
        flapT = setTimeout(flap, window.NaniGuide && window.NaniGuide.mouthMs ? window.NaniGuide.mouthMs(true) : 150);
      }
      const stopFlap = () => {
        clearTimeout(flapT);
        flapT = 0;
      };
      // S04-B (SH-68, decision 75 (4)): the bubble sits above the speaker's head (below it with no room), placed by
      // the shared lifecycle; head: the top of the picture, in world px (UI.placeBubble maps it to the page)
      // (self: the speaker's picture, so the bubble keeps off every other person's head: contract-52)
      const anchor = { head: this.headBox(img), x: img.x, y: img.baseY, self: img };
      try {
        await UI.say(line, anchor, who === "nani" ? Object.assign({ nani: true }, opts) : opts);
      } finally {
        stopFlap();
        stopBob();
        if (img.active) this.setMood(who, opts.after || (prev === "talk" ? "neutral" : prev));
      }
    }
    /** The one talk animation (S04-B, ART-13, Z10: the shared lifecycle's small, slow bob). Returns stop(). */
    talkBob(img, who) {
      const L = global.Lifecycle;
      if (L) return L.talk.phaser(this, img, { dir: who === "nani" ? -1 : 1 });
      return () => {};
    }
    /** A character's head, in world px: the top of its picture, about a third of its width, centred on it. */
    headBox(img) {
      const w = img.displayWidth || 300;
      const top = img.baseY != null ? img.baseY : img.y;
      return { x: img.x - w * 0.2, y: top + w * 0.04, w: w * 0.4, h: w * 0.42 };
    }
    async leaveChar(who) {
      const img = this.chars[who];
      if (!img) return;
      await Cook.tween(this, { targets: img, x: W + 300, duration: 800, ease: "Cubic.easeIn" });
      img.destroy();
      delete this.chars[who];
    }

    /** Hold on `obj` to pour; `onLevel(v)` as it rises; resolves with the level at release. */
    pour(obj, { rate = 0.3, auto = false, lo, hi, onLevel, onStart, onStop, io = Cook.IO } = {}) {
      return new Promise((resolve) => {
        let off = null;
        let pouring = false;
        let level = 0;
        let loop = null;
        // where the gauge is (the test hook's box, njgTest.cook.gauge(); s04-hooks): the thing being poured
        const boxOf = () => {
          const b = obj.getBounds();
          return { x: b.x, y: b.y, w: b.width, h: b.height };
        };
        const start = () => {
          if (pouring) return;
          pouring = true;
          loop = Cook.sfx.pourLoop();
          if (onStart) onStart();
        };
        const stop = () => {
          if (!pouring) return;
          pouring = false;
          if (loop) loop.stop();
          if (onStop) onStop();
          if (level < 0.1 && !auto) return; // a tap, not a pour: keep waiting
          finish();
        };
        const finish = () => {
          io.expect(null);
          if (off) off();
          this.input.off("pointerup", stop);
          this.untap(obj);
          resolve(level);
        };
        this.tappable(obj, start);
        this.input.on("pointerup", stop);
        let last = performance.now();
        off = this.addTick(() => {
          const now = performance.now();
          const dt = Math.min(0.1, (now - last) / 1000) * Cook.speed;
          last = now;
          if (!pouring) return;
          level = Math.min(1.08, level + rate * dt);
          if (loop && loop.pitch) loop.pitch(level);
          if (auto && level >= (lo + hi) / 2) {
            level = (lo + hi) / 2;
            onLevel && onLevel(level);
            pouring = false;
            loop && loop.stop();
            onStop && onStop();
            return finish();
          }
          onLevel && onLevel(level);
          io.gauge({ level, lo, hi, at: boxOf });
          if (level >= 1.08) {
            pouring = false;
            loop && loop.stop();
            onStop && onStop();
            finish();
          }
        });
        io.gauge({ level: 0, lo, hi, at: boxOf });
        const c = this.centre(obj);
        io.expect({ kind: "hold", x: c.x, y: c.y });
      });
    }

    /**
     * A ring timer on the food: it fills like a clock; the green arc is
     * "now". Tap `target` (or any of `alsoTap`) to stop it. Returns the
     * fraction at the tap (1 if it ran out). While it's in the green, the
     * food pulses. Real cues (bubbles, colour) come from onLevel.
     */
    ring(target, { x, y, r = 120, lo = 0.62, hi = 0.82, rate = 0.22, onLevel, alsoTap = [], io = Cook.IO } = {}) {
      return new Promise((resolve) => {
        let off = null;
        const c = this.centre(target);
        x = x != null ? x : c.x;
        y = y != null ? y : c.y;
        const g = this.track(this.add.graphics().setDepth(D.fx + 1));
        let v = 0;
        let done = false;
        const a0 = -Math.PI / 2;
        const draw = () => {
          g.clear();
          g.lineStyle(16, 0xfffaf1, 0.75);
          g.beginPath();
          g.arc(x, y, r, 0, Math.PI * 2);
          g.strokePath();
          g.lineStyle(16, 0x7d9a78, 0.95);
          g.beginPath();
          g.arc(x, y, r, a0 + lo * Math.PI * 2, a0 + hi * Math.PI * 2);
          g.strokePath();
          g.lineStyle(10, v > hi ? 0xb24a3a : 0xc9973a, 1);
          g.beginPath();
          g.arc(x, y, r, a0, a0 + Math.min(1, v) * Math.PI * 2);
          g.strokePath();
          const ex = x + Math.cos(a0 + v * Math.PI * 2) * r;
          const ey = y + Math.sin(a0 + v * Math.PI * 2) * r;
          g.fillStyle(0xffffff, 1);
          g.fillCircle(ex, ey, 11);
          g.lineStyle(4, 0x3a2410, 0.6);
          g.strokeCircle(ex, ey, 11);
        };
        const hit = () => {
          if (done) return;
          done = true;
          io.expect(null);
          if (off) off();
          [target, ...alsoTap].forEach((o) => this.untap(o));
          this.glow(target, false);
          g.destroy();
          resolve(v);
        };
        [target, ...alsoTap].forEach((o) => this.tappable(o, hit));
        let last = performance.now();
        let inBand = false;
        off = this.addTick(() => {
          const now = performance.now();
          const dt = Math.min(0.1, (now - last) / 1000) * Cook.speed;
          last = now;
          v += rate * dt;
          const nowIn = v >= lo && v <= hi;
          if (nowIn !== inBand) {
            inBand = nowIn;
            this.glow(target, nowIn);
            if (nowIn) Cook.sfx.click();
          }
          onLevel && onLevel(v);
          io.gauge({ level: v, lo, hi, at: { x, y, r: r + 8 } });
          draw();
          if (v >= 1) hit();
        });
        draw();
        io.gauge({ level: 0, lo, hi, at: { x, y, r: r + 8 } });
        io.expect({ kind: "timing", x: c.x, y: c.y });
      });
    }

    /**
     * The finger that demonstrates a gesture until the player starts. SH-119 (Zafar, 22 Oct: one finger in every game): the shared
     * kit's finger (js/shared/onboard.js Onboard.finger): a tap (two points a few px apart: the maani pile) taps in the kit's
     * cadence; a longer path or a circle is the finger pressed and moving along it, then lifted, half a second, again. step: what it
     * shows, for the test log only (each play is logged to Lifecycle.log as {what: "ghost", step, at}: MAA-13; s04-hooks).
     */
    ghost(points, { duration = 1100, delay = 0, step = null } = {}) {
      const OB = window.Onboard;
      const page = (x, y) => (UI.worldToScreen ? UI.worldToScreen(x, y) : { x, y });
      const span = points.circle ? Infinity : Math.hypot(points[points.length - 1][0] - points[0][0], points[points.length - 1][1] - points[0][1]);
      const tap = span < 12;
      let alive = true;
      let tw = null;
      let finger = null;
      let cur = null;
      let loop = null;
      const dot = OB && OB.finger ? null : this.track(this.add.circle(0, 0, 26, 0xffffff, 0.75).setStrokeStyle(5, 0x3a2410, 0.35).setDepth(D.top).setVisible(false));
      const log = () => {
        // TEST HOOK (s04-hooks; only logged): each play in Lifecycle.log, so a probe counts plays (MAA-13)
        try {
          const L = window.Lifecycle;
          if (L && L.ghost) {
            const p0 = points.circle ? points.circle : { x: points[0][0], y: points[0][1] };
            const at = page(p0.x, p0.y);
            L.ghost(step || `cook:${this.viewName || (this.sys && this.sys.settings.key) || "?"}`, { gesture: points.circle ? "circle" : tap ? "tap" : "path", at: { x: Math.round(at.x), y: Math.round(at.y) } });
          }
        } catch (e) {
          /* only a log */
        }
      };
      const posAt = (k) => {
        if (points.circle) {
          const c = points.circle;
          const a = k * Math.PI * 2;
          return { x: c.x + Math.cos(a) * c.rx, y: c.y + Math.sin(a) * c.ry };
        }
        const seg = Math.min(points.length - 2, Math.floor(k * (points.length - 1)));
        const f = k * (points.length - 1) - seg;
        const [x1, y1] = points[seg];
        const [x2, y2] = points[seg + 1];
        return { x: x1 + (x2 - x1) * f, y: y1 + (y2 - y1) * f };
      };
      const run = () => {
        if (!alive || !this.sys || !this.sys.isActive()) return;
        log();
        if (OB && OB.finger && tap) {
          // a tap: the kit's own cadence, logged once a cycle (a probe counts the plays)
          if (!finger) {
            finger = OB.finger(() => page(points[0][0], points[0][1]));
            loop = this.time.addEvent({ delay: OB.fingerMs(), loop: true, callback: log });
          }
          return;
        }
        if (OB && OB.finger && !finger) finger = OB.finger(() => cur, { hold: true });
        tw = this.tweens.addCounter({
          from: 0,
          to: 1,
          duration,
          onUpdate: (t) => {
            const k = t.getValue();
            const p = posAt(k);
            if (finger) cur = k > 0.04 && k < 0.96 ? page(p.x, p.y) : null;
            if (dot) dot.setVisible(true).setPosition(p.x, p.y).setAlpha(k < 0.1 ? k * 7 : k > 0.85 ? (1 - k) * 5 : 0.75);
          },
          onComplete: () => {
            cur = null;
            if (alive) this.time.delayedCall(OB && OB.FINGER ? OB.FINGER.gap : 350, run);
          },
        });
      };
      const t0 = this.time.delayedCall(delay, run);
      const stop = () => {
        alive = false;
        t0.remove();
        if (tw) tw.stop();
        if (loop) loop.remove();
        if (finger) finger.stop();
        if (dot && dot.active) dot.destroy();
        this.input.off("pointerdown", stop);
      };
      this.input.once("pointerdown", stop);
      // the scene goes (the station ends): the finger goes with it
      this.events.once("shutdown", stop);
      return { stop };
    }

    special(obj, on = true) {
      if (!obj || !on) return obj;
      obj.setTint(0xffe2a0, 0xffd27a, 0xffe9b8, 0xf6c35b);
      // (its glint loop drew bursts: off with the other code effects, Sprint 10; the golden tint stays)
      return obj;
    }
  }

  Cook.CookScene = CookScene;
  Cook.D = D;
  Cook.CHARS = CHARS;
  /**
   * Where the service picture (texture bg-service) sits in the world: its origin at (ox, oy) design px, k of its own px
   * per design px. The kitchen's master (art.s02 kitchen-trays `core`: the 1600x900 core's offset in it) is drawn 1:1
   * with the core on the design box; an old 1600-wide picture at the design box's origin.
   */
  Cook.serviceFrame = function (scene) {
    const tex = scene && scene.textures && scene.textures.exists("bg-service") ? scene.textures.get("bg-service") : null;
    const img = tex && tex.getSourceImage ? tex.getSourceImage() : null;
    const bw = (img && img.width) || W;
    const bh = (img && img.height) || H;
    const kt = (((Cook.data && Cook.data.art) || {}).s02 || {})["kitchen-trays"];
    const core = kt && kt.ready && Array.isArray(kt.core) ? kt.core : null;
    if (core && bw >= W + core[0] && bh >= H + core[1]) return { master: true, ox: -core[0], oy: -core[1], k: 1, bw, bh };
    return { master: false, ox: 0, oy: 0, k: bw / W, bw, bh };
  };
})(window);

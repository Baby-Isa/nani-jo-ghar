/* Nani jo Ghar - fruit-bowl errand, Phaser 3 scene layer.
 * World is fixed at 1600x900 (the backgrounds' own pixel size). Every
 * scene coordinate is a background pixel from data/scenes/*.json.
 *
 * Kitchen (ask + pre-exposure) -> bazaar (buy into YOUR basket) ->
 * kitchen (move everything from your basket into Nani's bowl) -> patch.
 *
 * Playtest 2 (23 Sep 2026, docs/playtest-2026-09-23.md) reshaped this:
 *  - a first-person foreground basket you always hold; bought fruit lands
 *    in it and stays, then moves into Nani's bowl at home
 *  - characters stand BEHIND a counter/island that hides their lower body
 *  - items are sized to fit a box (not width only), sit a few px into
 *    their surface and get a soft contact shadow
 *  - characters breathe, their mouth moves while a line plays, they react
 *  - quantities are shown and heard (plural carrier lines) */
(function (global) {
  "use strict";

  const WORLD_W = 1600;
  const WORLD_H = 900;
  const HESITATION_MS = 5000;
  const SINK = 3; // px an item sits into its surface (matches build/place_preview.py)

  const DEPTH = {
    char: 10,
    occluder: 20,
    surfaceItem: 100, // + baseline / 10
    bowlBack: 300,
    bowlFront: 400,
    basketBack: 700,
    basketFront: 800,
    flying: 900,
    ambient: 950,
  };

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const rand = (a, b) => a + Math.random() * (b - a);

  function itemTextureKey(wordId) { return `item-${wordId}`; }
  function charTextureKey(charId, pose) { return `char-${charId}-${pose}`; }

  // ================= shared run state (survives scene restarts) =================
  const State = {
    errand: null,
    listState: {}, // word_id -> { qty, have, placed, noCount }
    basketCount: 0, // total bought this run
    basket: [], // word ids currently in the player's basket, in order added
    kitchenAssignment: {}, // word_id -> gap slot id
    bazaarSlotToWord: {}, // slot id -> word_id
    interactive: new Map(), // key -> { sprite, scene } currently tappable, for the e2e test helper
    busy: false, // true while a tap's consequences (audio, flight) play out
    currentAsk: null, // word Nani is asking for in the fill phase
    bowlCount: 0,
    hasCompletedOnce: false, // intro beats are skipped automatically on replay
  };

  function registerInteractive(key, sprite, scene) { State.interactive.set(key, { sprite, scene }); }
  function unregisterInteractive(key) { State.interactive.delete(key); }
  function clearSceneInteractives(scene) {
    for (const [k, v] of State.interactive) { if (v.scene === scene) State.interactive.delete(k); }
  }

  // ================= carrier lines (plural when qty > 1) =================
  /** What Nani says to ask for an item: "Muke bo santra khape" when more
   * than one is wanted and a sourced plural line exists, else singular. */
  function carrierLine(wid, qty) {
    const carrier = NjgData.carrier(wid);
    const word = NjgData.word(wid);
    const plural = qty > 1 && carrier && carrier.kutchi_plural_example;
    if (plural) {
      return {
        kind: "carrier", id: `${wid}-plural`,
        kutchi: { text: carrier.kutchi_plural_example, is_draft: true },
        english: `I need ${qty} ${word.english}s`,
      };
    }
    return {
      kind: "carrier", id: wid,
      kutchi: carrier ? { text: carrier.kutchi_singular, is_draft: true } : word.kutchi,
      english: carrier ? carrier.english : `I need ${word.english}`,
    };
  }

  // ================= sprite helpers =================
  function fitScale(scene, key, maxW, maxH) {
    const f = scene.textures.getFrame(key);
    return Math.min(maxW / f.width, maxH / f.height);
  }

  /** A fruit sprite standing on a surface: bottom-centre at (x, baseline),
   * sized to fit maxW x maxH, sunk SINK px into the surface, with a soft
   * contact shadow underneath (unless opts.shadow === false). */
  function createItemSprite(scene, wordId, x, baseline, maxW, maxH, opts) {
    opts = opts || {};
    const key = itemTextureKey(wordId);
    const sprite = scene.add.sprite(x, baseline + SINK, key);
    sprite.setOrigin(0.5, 1);
    const s = fitScale(scene, key, maxW, maxH);
    sprite.setScale(s);
    sprite._fitScale = s;
    sprite.setDepth(opts.depth != null ? opts.depth : DEPTH.surfaceItem + baseline / 10);
    sprite.wordId = wordId;
    if (opts.shadow !== false) {
      const w = sprite.displayWidth * 0.8;
      const sh = scene.add.ellipse(x, baseline, w, w * 0.14, 0x2a1608, 0.32);
      sh.setDepth(sprite.depth - 0.01);
      sprite._shadow = sh;
      sprite.once("destroy", () => sh.destroy());
    }
    if (opts.interactive) {
      sprite.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });
    }
    return sprite;
  }

  /** Silhouette: the fruit's own shape, tinted solid and dimmed. */
  function createSilhouette(scene, wordId, x, baseline, maxW, maxH) {
    const sprite = createItemSprite(scene, wordId, x, baseline, maxW, maxH, { shadow: false });
    sprite.setTintFill(0x3c281e);
    sprite.setAlpha(0.35);
    return sprite;
  }

  function startPulse(scene, sprite) {
    stopPulse(scene, sprite);
    const s = sprite._fitScale || sprite.scaleX;
    sprite._pulseTween = scene.tweens.add({
      targets: sprite, scaleX: s * 1.08, scaleY: s * 1.08,
      duration: 500, yoyo: true, repeat: -1, ease: "Sine.easeInOut",
    });
  }
  function stopPulse(scene, sprite) {
    if (sprite._pulseTween) {
      sprite._pulseTween.stop();
      sprite._pulseTween = null;
      if (sprite.active) sprite.setScale(sprite._fitScale || sprite.scaleX);
    }
  }

  function wiggle(scene, sprite) {
    const baseAngle = sprite.angle;
    scene.tweens.add({
      targets: sprite, angle: { from: baseAngle - 9, to: baseAngle + 9 },
      duration: 80, yoyo: true, repeat: 2, ease: "Sine.easeInOut",
      onComplete: () => sprite.setAngle(baseAngle),
    });
  }

  function hop(scene, sprite) {
    return new Promise((resolve) => {
      const baseY = sprite.y;
      scene.tweens.add({
        targets: sprite, y: baseY - 22, duration: 150, yoyo: true, ease: "Quad.easeOut",
        onComplete: () => { sprite.setY(baseY); resolve(); },
      });
    });
  }

  /** Move a sprite along an arc (quadratic curve peaking above both ends). */
  function arcTo(scene, sprite, tx, ty, toScale, duration) {
    return new Promise((resolve) => {
      const sx = sprite.x, sy = sprite.y;
      const s0 = sprite.scaleX;
      const peak = Math.min(sy, ty) - 140;
      scene.tweens.addCounter({
        from: 0, to: 1, duration: duration || 520, ease: "Sine.easeInOut",
        onUpdate: (tw) => {
          const p = tw.getValue();
          sprite.x = sx + (tx - sx) * p;
          sprite.y = (1 - p) * (1 - p) * sy + 2 * (1 - p) * p * peak + p * p * ty;
          sprite.setScale(s0 + (toScale - s0) * p);
        },
        onComplete: () => resolve(),
      });
    });
  }

  /** Alpha of `obj`'s own pixel under world point (x, y), 0 if outside. */
  function alphaAt(scene, obj, x, y) {
    if (!obj.frame || !obj.visible || obj.alpha === 0) return 0;
    const p = obj.getLocalPoint(x, y);
    const px = p.x + obj.displayOriginX, py = p.y + obj.displayOriginY;
    if (px < 0 || py < 0 || px >= obj.frame.width || py >= obj.frame.height) return 0;
    if (obj.isCropped && obj._crop && (py > obj._crop.y + obj._crop.height)) return 0;
    return scene.textures.getPixelAlpha(px, py, obj.texture.key, obj.frame.name) || 0;
  }

  /** Screen point where a player can actually see and tap this sprite: an
   * opaque pixel of its own that no higher-depth object covers (fruit in
   * a basket overlap, and the basket's front wall hides their bottoms).
   * For the e2e test helper - never a bounding-box centre guess. */
  function spriteToScreenPoint(scene, sprite) {
    const rect = scene.game.canvas.getBoundingClientRect();
    const sx = rect.width / WORLD_W, sy = rect.height / WORLD_H;
    const b = sprite.getBounds();
    const above = scene.children.list.filter((o) => o !== sprite && o.depth > sprite.depth && o.frame && o.visible);
    let best = null;
    const N = 9;
    for (let j = 1; j < N; j++) {
      for (let i = 1; i < N; i++) {
        const x = b.x + (b.width * i) / N, y = b.y + (b.height * j) / N;
        if (alphaAt(scene, sprite, x, y) < 200) continue;
        if (above.some((o) => alphaAt(scene, o, x, y) > 0)) continue;
        // prefer points near the middle of the sprite
        const d = Math.abs(i - N / 2) + Math.abs(j - N / 2);
        if (!best || d < best.d) best = { x, y, d };
      }
    }
    if (!best) best = { x: b.centerX, y: b.centerY };
    return { x: rect.left + best.x * sx, y: rect.top + best.y * sy };
  }

  // ================= containers: basket (foreground) and bowl =================
  /** A container drawn as back / items / front, so items sit IN it. Items
   * never leave except by take(). def comes from the scene JSON. */
  class Container {
    constructor(scene, def, kind) {
      this.scene = scene;
      this.def = def;
      this.kind = kind; // "basket" | "bowl"
      this.items = []; // sprites
      const backKey = `${kind}-back`, frontKey = `${kind}-front`;
      const f = scene.textures.getFrame(backKey);
      const s = def.w / f.width;
      const originY = def.baseline != null ? 1 : 0;
      const y = def.baseline != null ? def.baseline : def.top;
      this.backDepth = kind === "basket" ? DEPTH.basketBack : DEPTH.bowlBack;
      this.frontDepth = kind === "basket" ? DEPTH.basketFront : DEPTH.bowlFront;
      this.back = scene.add.image(def.x, y, backKey).setOrigin(0.5, originY).setScale(s).setDepth(this.backDepth);
      this.front = scene.add.image(def.x, y, frontKey).setOrigin(0.5, originY).setScale(s).setDepth(this.frontDepth);
    }

    spot(i) {
      const n = this.def.inside.length;
      const base = this.def.inside[i % n];
      if (i < n) return base;
      // overflow: pile on top with a little jitter
      return { x: base.x + rand(-14, 14), baseline: base.baseline - 18 * Math.floor(i / n) };
    }

    /** Put a new item sprite at the next spot. Returns the sprite. */
    place(wordId, opts) {
      opts = opts || {};
      const i = this.items.length;
      const sp = this.spot(i);
      const sprite = createItemSprite(this.scene, wordId, sp.x, sp.baseline, this.def.item.maxW, this.def.item.maxH, {
        shadow: false,
        depth: this.backDepth + 1 + sp.baseline / 100,
      });
      sprite.setAngle(rand(-8, 8));
      sprite._spot = i;
      this.items.push(sprite);
      if (opts.pop) {
        const s = sprite._fitScale;
        sprite.setScale(s * 0.4).setAlpha(0);
        this.scene.tweens.add({ targets: sprite, scale: s, alpha: 1, duration: 300, ease: "Back.easeOut" });
      }
      return sprite;
    }

    /** Where the next item will land, and its fitted scale - for arcs. */
    nextTarget(wordId) {
      const sp = this.spot(this.items.length);
      return { x: sp.x, y: sp.baseline + SINK, scale: fitScale(this.scene, itemTextureKey(wordId), this.def.item.maxW, this.def.item.maxH) };
    }

    remove(sprite) {
      this.items = this.items.filter((s) => s !== sprite);
    }
  }

  /** Fly a copy of `source` into `container`, then place the real item. */
  async function flyInto(scene, source, container, wordId) {
    const t = container.nextTarget(wordId);
    const clone = scene.add.sprite(source.x, source.y, itemTextureKey(wordId)).setOrigin(0.5, 1);
    clone.setScale(source.scaleX).setAngle(source.angle).setDepth(DEPTH.flying);
    await arcTo(scene, clone, t.x, t.y, t.scale, 560);
    clone.destroy();
    return container.place(wordId);
  }

  // ================= characters =================
  /** A character standing behind a counter: cropped at the counter's top
   * edge, breathing gently, mouth moving while a line plays. Poses share
   * one canvas (build/make_scene_art.py), so swaps never jump. */
  class Character {
    constructor(scene, def, occluderY) {
      this.scene = scene;
      this.id = def.id;
      const key = charTextureKey(def.id, "neutral");
      const f = scene.textures.getFrame(key);
      this.scale = def.scale || 1;
      const sprite = scene.add.sprite(def.x, def.top + f.height * this.scale, key);
      sprite.setOrigin(0.5, 1).setScale(this.scale).setDepth(DEPTH.char);
      if (occluderY != null) {
        // nothing of the character exists below the counter's top edge
        const keepRows = Math.min(f.height, (occluderY + 20 - def.top) / this.scale);
        sprite.setCrop(0, 0, f.width, keepRows);
      }
      this.sprite = sprite;
      this.pose = "neutral";
      // breathing: origin is the (hidden) bottom, so a tiny scaleY lifts
      // head and shoulders a few px
      scene.tweens.add({
        targets: sprite, scaleY: this.scale * 1.007, duration: 1700,
        yoyo: true, repeat: -1, ease: "Sine.easeInOut",
      });
      this.flapTimer = null;
    }

    setPose(pose) {
      this.pose = pose;
      this.sprite.setTexture(charTextureKey(this.id, pose));
    }

    /** Run fn (which plays a line) with the mouth moving and a slight tilt. */
    async talk(fn) {
      this.startFlap();
      const tilt = this.scene.tweens.add({
        targets: this.sprite, angle: { from: -0.5, to: 0.5 }, duration: 900,
        yoyo: true, repeat: -1, ease: "Sine.easeInOut",
      });
      try {
        return await fn();
      } finally {
        this.stopFlap();
        tilt.stop();
        this.scene.tweens.add({ targets: this.sprite, angle: 0, duration: 200 });
      }
    }

    startFlap() {
      this.stopFlap();
      const base = this.pose === "happy" ? "happy" : "neutral";
      let open = false;
      const step = () => {
        open = !open;
        this.sprite.setTexture(charTextureKey(this.id, open ? "mouth" : base));
        this.flapTimer = this.scene.time.delayedCall(open ? rand(110, 170) : rand(70, 130), step);
      };
      if (base === "neutral") step();
    }

    stopFlap() {
      if (this.flapTimer) { this.flapTimer.remove(); this.flapTimer = null; }
      if (this.sprite.active) this.sprite.setTexture(charTextureKey(this.id, this.pose));
    }

    /** Brief happy reaction, then back to neutral. */
    async cheer(ms) {
      this.setPose("happy");
      await NjgUI.sleep(ms || 900);
      if (this.sprite.active && this.pose === "happy") this.setPose("neutral");
    }

    say(kind, id, kutchiObj, english, gist, bubble) {
      return this.talk(() => NjgUI.speakLine(this.scene, bubble, kind, id, kutchiObj, english, gist));
    }
  }

  // ================= ambient life =================
  function addMotes(scene, def) {
    for (let i = 0; i < def.count; i++) {
      const m = scene.add.circle(rand(def.x0, def.x1), rand(def.y0, def.y1), rand(1.5, 3.2), 0xfff1c8, rand(0.25, 0.55));
      m.setDepth(DEPTH.ambient).setBlendMode(Phaser.BlendModes.ADD);
      const drift = () => {
        scene.tweens.add({
          targets: m,
          x: Phaser.Math.Clamp(m.x + rand(-60, 60), def.x0, def.x1),
          y: Phaser.Math.Clamp(m.y + rand(-50, 40), def.y0, def.y1),
          alpha: rand(0.15, 0.6),
          duration: rand(3500, 7000), ease: "Sine.easeInOut",
          onComplete: drift,
        });
      };
      drift();
    }
  }

  function addLanternGlow(scene, def) {
    const glow = scene.add.circle(def.x, def.y, def.r, 0xffc766, 0.18).setDepth(DEPTH.ambient).setBlendMode(Phaser.BlendModes.ADD);
    const flicker = () => {
      scene.tweens.add({
        targets: glow, alpha: rand(0.1, 0.26), scale: rand(0.92, 1.08),
        duration: rand(90, 260), onComplete: flicker,
      });
    };
    flicker();
  }

  /** Fills the letterbox (any part of #game-wrap the canvas doesn't cover)
   * with the scene's own dominant colour instead of black bars - sampled
   * once per background by shrinking it to 1x1 on an offscreen canvas. */
  const letterboxCache = {};
  function setLetterboxColor(scene, bgKey) {
    if (!letterboxCache[bgKey]) {
      const img = scene.textures.get(bgKey).getSourceImage();
      const c = document.createElement("canvas");
      c.width = 1; c.height = 1;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      letterboxCache[bgKey] = `rgb(${r},${g},${b})`;
    }
    NjgUI.el("game-wrap").style.background = letterboxCache[bgKey];
  }

  // ================= story beats =================
  /** A small scripted moment: 3-5s, one visual, one line (Kutchi if sourced,
   * else gist-only per "never invent Kutchi"), skippable with a tap
   * anywhere, skipped automatically on replay. See Build Brief v4 section 4. */
  const BEAT_VISUALS = {
    "hang-lantern": (scene, kitchenDef) => {
      const a = kitchenDef.eid_shelf.lantern;
      const img = scene.add.image(a.x, a.y - 40, "eid-lantern").setOrigin(0.5, 0).setDepth(DEPTH.ambient + 1).setAlpha(0).setScale(0.32);
      scene.tweens.add({ targets: img, y: a.y, alpha: 1, duration: 900, ease: "Bounce.easeOut" });
      return img; // left hanging for the rest of the scene
    },
    "bowl-full-glow": (scene, kitchenDef) => {
      const b = kitchenDef.island_top;
      const glow = scene.add.circle(b.x, b.baseline - 40, 90, 0xffe08a, 0.45).setDepth(DEPTH.bowlFront + 1).setBlendMode(Phaser.BlendModes.ADD);
      scene.tweens.add({ targets: glow, scale: 1.6, alpha: 0, duration: 1600, ease: "Sine.easeOut", onComplete: () => glow.destroy() });
      return glow;
    },
  };

  function playBeatVisual(scene, kitchenDef, visualName) {
    const fn = BEAT_VISUALS[visualName];
    if (fn) return fn(scene, kitchenDef);
    return null;
  }

  /** Resolves once the beat's line finishes AND at least a floor duration
   * has passed, or immediately on a tap anywhere (skippable). */
  function runBeat(scene, kitchenDef, beat, sayFn) {
    return new Promise((resolve) => {
      let done = false;
      const finish = () => { if (done) return; done = true; catcher.destroy(); resolve(); };
      const catcher = scene.add.rectangle(WORLD_W / 2, WORLD_H / 2, WORLD_W, WORLD_H, 0x000000, 0.001);
      catcher.setDepth(DEPTH.flying + 10).setInteractive();
      catcher.once("pointerdown", finish);

      playBeatVisual(scene, kitchenDef, beat.visual);
      const sentence = NjgData.sentence(beat.line_id);
      const line = sentence && sentence.kutchi
        ? sayFn(sentence.kutchi, sentence.english, beat.gist)
        : NjgUI.textOnly(beat.gist, beat.gist, 3200, kitchenDef.bubble);
      Promise.all([line, new Promise((r) => scene.time.delayedCall(3000, r))]).then(finish);
      scene.time.delayedCall(5000, finish); // hard cap per "3 to 5 seconds"
    });
  }

  function addOccluder(scene, sceneDef, bgKey) {
    const occ = sceneDef.occluder;
    if (!occ) return null;
    if (occ.fromBackground) {
      const img = scene.add.image(0, 0, bgKey).setOrigin(0, 0).setDepth(DEPTH.occluder);
      img.setCrop(0, occ.y, WORLD_W, WORLD_H - occ.y);
    } else {
      scene.add.image(occ.x, occ.y, `${sceneDef.id}-occluder`).setOrigin(0, 0).setDepth(DEPTH.occluder);
    }
    return occ.y;
  }

  // ================= audio preload list =================
  function buildAudioWants(errand) {
    const wordIds = new Set([
      ...errand.kitchen.pre_exposure,
      ...errand.kitchen.items.map((i) => i.word_id),
      ...errand.bazaar.decoys,
    ]);
    const wants = [];
    wordIds.forEach((id) => {
      wants.push({ kind: "word", id });
      wants.push({ kind: "carrier", id });
      wants.push({ kind: "carrier", id: `${id}-plural` });
    });
    ["num-01", "num-02", "num-03"].forEach((id) => wants.push({ kind: "word", id }));
    NjgData.content.sentences.forEach((s) => wants.push({ kind: "word", id: s.id }));
    return wants;
  }

  function resolveExistingAudio(wants) {
    return wants.filter((w) => NjgData.hasAudio(w.kind, w.id));
  }

  function numberLine(n) {
    const w = NjgData.word(`num-${String(n).padStart(2, "0")}`);
    return w && w.kutchi ? w : null;
  }

  // ================= BootScene =================
  class BootScene extends Phaser.Scene {
    constructor() { super("boot"); }
    init(data) { this.bootData = data; }
    preload() {
      const { errand, existingAudio } = this.bootData;
      const kitchen = NjgData.scene("kitchen");
      const bazaar = NjgData.scene("bazaar");
      this.load.image("bg-kitchen", kitchen.background);
      this.load.image("bg-bazaar", bazaar.background);
      if (!kitchen.occluder.fromBackground) this.load.image("kitchen-occluder", kitchen.occluder.image);
      ["lantern", "bunting", "crescent-star", "lights"].forEach((n) => this.load.image(`eid-${n}`, `assets/scene/eid/${n}.png`));
      this.load.image("bowl-back", kitchen.bowl.back);
      this.load.image("bowl-front", kitchen.bowl.front);
      this.load.image("basket-back", kitchen.basket.back);
      this.load.image("basket-front", kitchen.basket.front);
      ["nani", "shopkeeper"].forEach((c) => {
        this.load.image(charTextureKey(c, "neutral"), `assets/characters/${c}/${c}-neutral.png`);
        this.load.image(charTextureKey(c, "mouth"), `assets/characters/${c}/${c}-mouth.png`);
        this.load.image(charTextureKey(c, "happy"), `assets/characters/${c}/${c}-happy-aligned.png`);
      });
      const wordIds = new Set([
        ...errand.kitchen.pre_exposure,
        ...errand.kitchen.items.map((i) => i.word_id),
        ...errand.bazaar.decoys,
      ]);
      wordIds.forEach((id) => this.load.image(itemTextureKey(id), `assets/${NjgData.word(id).image}`));
      NjgAudio.manifest(existingAudio).forEach(({ key, url }) => this.load.audio(key, url));
    }
    create() {
      this.scene.start("kitchen", { phase: "intro" });
    }
  }

  // ================= KitchenScene =================
  class KitchenScene extends Phaser.Scene {
    constructor() { super("kitchen"); }
    init(data) { this.phase = data.phase; }
    create() {
      const sceneDef = NjgData.scene("kitchen");
      this.sceneDef = sceneDef;
      NjgUI.onSceneStart();
      setLetterboxColor(this, "bg-kitchen");
      this.add.image(0, 0, "bg-kitchen").setOrigin(0, 0);
      const occY = addOccluder(this, sceneDef, "bg-kitchen");
      this.nani = new Character(this, sceneDef.character, occY);
      this.bowl = new Container(this, sceneDef.bowl, "bowl");
      this.basket = new Container(this, sceneDef.basket, "basket");
      addMotes(this, sceneDef.ambient.motes);
      this.events.once("shutdown", () => clearSceneInteractives(this));
      if (this.phase === "intro") this.runIntro(sceneDef);
      else this.runFillBowl(sceneDef);
    }

    say(kind, id, kutchiObj, english, gist) {
      return this.nani.say(kind, id, kutchiObj, english, gist, this.sceneDef.bubble);
    }

    async runIntro(sceneDef) {
      const errand = State.errand;
      NjgUI.resetShoppingList();
      NjgUI.hideBubble();
      State.listState = {};
      State.basket = [];
      State.basketCount = 0;
      State.bowlCount = 0;
      NjgUI.setGoButton("", true, null);

      const slots = shuffle(errand.kitchen.gap_slots).slice(0, errand.kitchen.items.length);
      State.kitchenAssignment = {};
      errand.kitchen.items.forEach((it, i) => { State.kitchenAssignment[it.word_id] = slots[i]; });

      await NjgUI.narrate("Nani is making a fruit bowl for tonight's guests.", 1800);

      if (!State.hasCompletedOnce && errand.intro_beat) {
        await runBeat(this, sceneDef, errand.intro_beat, (k, e, g) => this.say("word", errand.intro_beat.line_id, k, e, g));
      }

      const greet = NjgData.sentence("snt-01");
      const hey = NjgData.sentence("snt-03");
      await this.say("word", "snt-01", greet.kutchi, greet.english, "");
      await this.say("word", "snt-03", hey.kutchi, hey.english, "");

      // --- pre-exposure: Nani names what's already in the bowl ---
      for (const wid of errand.kitchen.pre_exposure) {
        const word = NjgData.word(wid);
        this.bowl.place(wid, { pop: true });
        State.bowlCount = this.bowl.items.length;
        await this.say("word", wid, word.kutchi, word.english, "Already in the bowl:");
        Progress.recordMeeting(wid);
        await NjgUI.sleep(250);
      }

      // --- ask for each new item, silhouette pulsing at the shelf gap ---
      for (const it of errand.kitchen.items) {
        const line = carrierLine(it.word_id, it.qty);
        const slot = sceneDef.slots[State.kitchenAssignment[it.word_id]];
        const sil = createSilhouette(this, it.word_id, slot.x, slot.baseline, slot.maxW, slot.maxH);
        startPulse(this, sil);

        await this.say(line.kind, line.id, line.kutchi, line.english, "Nani needs:");

        await new Promise((resolve) => {
          sil.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });
          registerInteractive(`gap-${it.word_id}`, sil, this);
          sil.once("pointerdown", () => {
            stopPulse(this, sil);
            unregisterInteractive(`gap-${it.word_id}`);
            sil.destroy();
            const ghost = createItemSprite(this, it.word_id, slot.x, slot.baseline, slot.maxW, slot.maxH);
            ghost.setAlpha(0.6);
            ghost._shadow.setAlpha(0.18);
            Progress.recordMeeting(it.word_id);
            State.listState[it.word_id] = { qty: it.qty, have: 0, placed: 0, noCount: !!it.no_count };
            NjgUI.addToShoppingList(this, it.word_id, it.qty, !!it.no_count);
            resolve();
          });
        });
      }

      const go = NjgData.sentence("snt-06");
      await this.say("word", "snt-06", go.kutchi, go.english, "Time to go shopping.");
      NjgUI.setGoButton("Go to the bazaar →", false, () => this.scene.start("bazaar"));
    }

    async runFillBowl() {
      const errand = State.errand;
      NjgUI.setGoButton("", true, null);
      NjgUI.hideBubble();

      // the bowl as Nani left it, and your basket as you carried it home
      errand.kitchen.pre_exposure.forEach((wid) => this.bowl.place(wid));
      State.bowlCount = this.bowl.items.length;
      State.basket.forEach((wid) => this.basket.place(wid));
      NjgUI.setListMode("bowl");
      Object.keys(State.listState).forEach((wid) => {
        const st = State.listState[wid];
        st.placed = 0;
        NjgUI.setListProgress(wid, 0, st.qty, st.noCount);
      });

      await NjgUI.narrate("Home again! Put the fruit in Nani's bowl.", 1500);

      const order = shuffle(errand.kitchen.items.map((i) => i.word_id));
      for (const wid of order) {
        const st = State.listState[wid];
        State.currentAsk = wid;
        const line = carrierLine(wid, st.qty);
        this.armBasketTaps();
        State.busy = true;
        await this.say(line.kind, line.id, line.kutchi, line.english, "Nani wants:");
        State.busy = false;
        this.armHint(wid);
        await new Promise((resolve) => { this.onAskDone = resolve; });
      }
      State.currentAsk = null;
      this.disarmBasketTaps();
      await this.finish();
    }

    /** Every fruit in the basket is tappable; tapping the wrong one gets a
     * wiggle and a kind "Arre re!". */
    armBasketTaps() {
      this.disarmBasketTaps();
      this.basket.items.forEach((sprite, i) => {
        sprite.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });
        const key = `basket-${sprite.wordId}-${i}`;
        sprite._key = key;
        registerInteractive(key, sprite, this);
        sprite.on("pointerdown", () => this.onBasketTap(sprite));
      });
    }

    disarmBasketTaps() {
      this.basket.items.forEach((s) => {
        s.removeAllListeners("pointerdown");
        s.disableInteractive();
        if (s._key) unregisterInteractive(s._key);
      });
    }

    armHint(wid) {
      this.clearHint();
      this.hintTimer = this.time.delayedCall(HESITATION_MS, () => {
        this.hinting = this.basket.items.filter((s) => s.wordId === wid);
        this.hinting.forEach((s) => startPulse(this, s));
      });
    }

    clearHint() {
      if (this.hintTimer) { this.hintTimer.remove(); this.hintTimer = null; }
      (this.hinting || []).forEach((s) => stopPulse(this, s));
      this.hinting = [];
    }

    async onBasketTap(sprite) {
      if (State.busy || !State.currentAsk) return;
      const wid = sprite.wordId;
      const st = State.listState[wid];
      if (wid !== State.currentAsk) {
        State.busy = true;
        wiggle(this, sprite);
        Progress.recordMiss(wid);
        const oops = NjgData.sentence("snt-07");
        await this.say("word", "snt-07", oops.kutchi, oops.english, "");
        State.busy = false;
        return;
      }
      State.busy = true;
      this.clearHint();
      stopPulse(this, sprite);
      sprite.removeAllListeners("pointerdown");
      sprite.disableInteractive();
      unregisterInteractive(sprite._key);
      this.basket.remove(sprite);
      State.basket.splice(State.basket.indexOf(wid), 1);
      const t = this.bowl.nextTarget(wid);
      sprite.setDepth(DEPTH.flying);
      await arcTo(this, sprite, t.x, t.y, t.scale, 520);
      sprite.destroy();
      this.bowl.place(wid);
      State.bowlCount = this.bowl.items.length;
      st.placed += 1;
      NjgUI.setListProgress(wid, st.placed, st.qty, st.noCount);
      if (!st.noCount && st.qty > 1) {
        const num = numberLine(st.placed);
        if (num) await this.say("word", num.id, num.kutchi, num.english, "Counting:");
      }
      if (st.placed >= st.qty) {
        Progress.recordCorrect(wid);
        NjgUI.markListItemDone(wid);
        State.busy = false;
        const done = this.onAskDone;
        this.onAskDone = null;
        if (done) done();
      } else {
        State.busy = false;
        this.armHint(wid);
      }
    }

    async finish() {
      this.nani.setPose("happy");
      await NjgUI.textOnly("", "Well done!", 1600, this.sceneDef.bubble);

      const errand = State.errand;
      if (errand.outro_beat) {
        await runBeat(this, this.sceneDef, errand.outro_beat, (k, e, g) => this.say("word", errand.outro_beat.line_id, k, e, g));
      }
      State.hasCompletedOnce = true;

      const patch = { motif: errand.reward_patch.motif, colors: errand.reward_patch.colors, at: Date.now() };
      NjgUI.addPatch(patch);
      NjgUI.showPatchOverlay(patch, () => {
        State.basketCount = 0;
        State.basket = [];
        if (global.NjgGame && global.NjgGame.onErrandComplete) {
          global.NjgGame.onErrandComplete(errand.id, patch);
        }
      });
    }
  }

  // ================= BazaarScene =================
  class BazaarScene extends Phaser.Scene {
    constructor() { super("bazaar"); }
    create() {
      const sceneDef = NjgData.scene("bazaar");
      this.sceneDef = sceneDef;
      NjgUI.onSceneStart();
      NjgUI.setGoButton("", true, null);
      NjgUI.hideBubble();
      setLetterboxColor(this, "bg-bazaar");
      this.add.image(0, 0, "bg-bazaar").setOrigin(0, 0);
      const occY = addOccluder(this, sceneDef, "bg-bazaar");
      this.shopkeeper = new Character(this, sceneDef.character, occY);
      this.basket = new Container(this, sceneDef.basket, "basket");
      State.basket.forEach((wid) => this.basket.place(wid));
      addLanternGlow(this, sceneDef.ambient.lantern);
      this.events.once("shutdown", () => clearSceneInteractives(this));

      const errand = State.errand;
      const stock = [...errand.kitchen.items.map((i) => i.word_id), ...errand.bazaar.decoys];
      const slots = shuffle(errand.bazaar.slot_pool);
      const shuffledStock = shuffle(stock);
      State.bazaarSlotToWord = {};
      shuffledStock.forEach((wid, i) => { State.bazaarSlotToWord[slots[i]] = wid; });

      this.stallSprites = {};
      Object.entries(sceneDef.slots).forEach(([slotId, slot]) => {
        const wid = State.bazaarSlotToWord[slotId];
        if (!wid) return;
        const sprite = createItemSprite(this, wid, slot.x, slot.baseline, slot.maxW, slot.maxH, { interactive: true });
        this.stallSprites[wid] = sprite;
        registerInteractive(`stall-${wid}`, sprite, this);
        sprite.on("pointerdown", () => this.onTapStall(wid, sprite));
      });

      this.hesitationTimer = null;
      State.busy = true;
      this.runGreeting();
    }

    say(kind, id, kutchiObj, english, gist) {
      return this.shopkeeper.say(kind, id, kutchiObj, english, gist, this.sceneDef.bubble);
    }

    async runGreeting() {
      // you greet (narrated, your line), he replies
      const greet = NjgData.sentence("snt-01");
      await NjgUI.narrateLine(this, "word", "snt-01", greet.kutchi, greet.english, "You say:");
      const reply = NjgData.sentence("snt-02");
      await this.say("word", "snt-02", reply.kutchi, reply.english, "");
      const ask = NjgData.sentence("snt-08");
      await NjgUI.textOnly("", ask.english, 1200, this.sceneDef.bubble);
      NjgUI.hideNarration();
      State.busy = false;
      this.armHesitationGlow();
    }

    unboughtTargetSprites() {
      return Object.entries(State.listState)
        .filter(([, st]) => st.have < st.qty)
        .map(([wid]) => this.stallSprites[wid])
        .filter(Boolean);
    }

    clearHesitationTimer() {
      if (this.hesitationTimer) { this.hesitationTimer.remove(); this.hesitationTimer = null; }
      this.unboughtTargetSprites().forEach((s) => stopPulse(this, s));
    }

    armHesitationGlow() {
      this.clearHesitationTimer();
      this.hesitationTimer = this.time.delayedCall(HESITATION_MS, () => this.triggerHint());
    }

    triggerHint() {
      this.unboughtTargetSprites().forEach((s) => startPulse(this, s));
    }

    async onTapStall(wid, sprite) {
      if (State.busy) return;
      const st = State.listState[wid];
      if (!st) {
        State.busy = true;
        wiggle(this, sprite);
        Progress.recordMiss(wid);
        this.clearHesitationTimer();
        const oops = NjgData.sentence("snt-07");
        await this.say("word", "snt-07", oops.kutchi, oops.english, "");
        this.triggerHint();
        State.busy = false;
        return;
      }
      if (st.have >= st.qty) return;

      State.busy = true;
      this.clearHesitationTimer();
      st.have += 1;
      State.basketCount += 1;
      State.basket.push(wid);

      await hop(this, sprite);
      await flyInto(this, sprite, this.basket, wid);
      NjgUI.setListProgress(wid, st.have, st.qty, st.noCount);

      if (!st.noCount && st.qty > 1) {
        const num = numberLine(st.have);
        const word = NjgData.word(wid);
        if (num) await this.say("word", num.id, num.kutchi, num.english, `Counting ${word.english}s:`);
      }

      if (st.have >= st.qty) {
        Progress.recordCorrect(wid);
        stopPulse(this, sprite);
        sprite.setAlpha(0.4);
        sprite.disableInteractive();
        unregisterInteractive(`stall-${wid}`);
        NjgUI.markListItemDone(wid);
        const here = NjgData.sentence("snt-10");
        await this.say("word", "snt-10", here.kutchi, here.english, "");
      }

      if (Object.values(State.listState).every((s) => s.have >= s.qty)) {
        this.shopkeeper.setPose("happy");
        const thanks = NjgData.sentence("snt-11");
        await this.say("word", "snt-11", thanks.kutchi, thanks.english, "You have everything on the list!");
        this.shopkeeper.setPose("neutral");
        State.busy = false;
        NjgUI.setGoButton("Go home →", false, async () => {
          NjgUI.setGoButton("", true, null);
          const bye = NjgData.sentence("snt-14");
          await this.say("word", "snt-14", bye.kutchi, bye.english, "");
          this.scene.start("kitchen", { phase: "fill" });
        });
      } else {
        State.busy = false;
        this.armHesitationGlow();
      }
    }
  }

  // ================= boot / public API =================
  // js/shell.js drives the launch flow (tap to start -> profile picker ->
  // hub -> errand -> patch -> hub); this module only knows how to load its
  // data once and how to play/leave one errand when told to.
  async function unlockAudioAndFullscreen() {
    try { const a = new Audio(); a.play().catch(() => {}); } catch (e) {}
    try {
      const root = document.documentElement;
      if (root.requestFullscreen) await root.requestFullscreen().catch(() => {});
    } catch (e) {}
    try {
      if (screen.orientation && screen.orientation.lock) {
        await screen.orientation.lock("landscape").catch(() => {});
      }
    } catch (e) {}
  }

  let phaserGame = null;

  async function prepare() {
    await NjgData.load();
    const errand = NjgData.errand("bowl-01");
    State.errand = errand;
    const existingAudio = resolveExistingAudio(buildAudioWants(errand));
    return { errand, existingAudio };
  }

  /** First call unlocks audio (must run from the tap-to-start gesture),
   * creates the Phaser game and preloads. Later calls just (re)start the
   * kitchen intro - BootScene's preload already ran once. */
  async function playErrand() {
    if (!phaserGame) {
      await unlockAudioAndFullscreen();
      const { errand, existingAudio } = await prepare();
      phaserGame = new Phaser.Game({
        type: Phaser.AUTO,
        parent: "game",
        width: WORLD_W,
        height: WORLD_H,
        transparent: false,
        backgroundColor: "#000000",
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: WORLD_W,
          height: WORLD_H,
        },
        scene: [BootScene, KitchenScene, BazaarScene],
      });
      phaserGame.scene.start("boot", { errand, existingAudio });
      phaserGame.scale.on("resize", () => NjgUI.repositionBubble());

      global.__njg = {
        game: phaserGame,
        debugItems() {
          const items = [];
          State.interactive.forEach(({ sprite, scene }, key) => {
            if (!sprite.active || !sprite.input || !sprite.input.enabled) return;
            const p = spriteToScreenPoint(scene, sprite);
            items.push({ key, wordId: sprite.wordId, x: p.x, y: p.y });
          });
          return items;
        },
        basketCount() { return State.basketCount; },
        basketItems() { return State.basket.slice(); },
        bowlCount() { return State.bowlCount; },
        listState() { return State.listState; },
        busy() { return State.busy; },
        currentAsk() { return State.currentAsk; },
      };
    } else {
      State.basketCount = 0;
      State.basket = [];
      phaserGame.scene.start("kitchen", { phase: "intro" });
    }
  }

  /** Leave mid-errand: word progress already earned is kept (Progress
   * writes as it goes); the errand itself restarts from its beginning
   * next time, per Build Brief v4 section 2.3. Just stop rendering it -
   * State resets naturally the next time runIntro() runs. */
  function leaveErrand() {
    if (!phaserGame) return;
    ["kitchen", "bazaar"].forEach((key) => {
      const scene = phaserGame.scene.keys[key];
      if (scene && phaserGame.scene.isActive(key)) phaserGame.scene.stop(key);
    });
  }

  global.NjgGame = {
    prepare,
    playErrand,
    leaveErrand,
    unlockAudioAndFullscreen,
    errandId: () => "bowl-01",
    onErrandComplete: null, // js/shell.js assigns this
  };
})(window);

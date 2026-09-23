/* Nani jo Ghar - fruit-bowl errand, Phaser 3 scene layer (Build Brief v3).
 * World is fixed at 1600x900 (the backgrounds' own pixel size). Every
 * scene coordinate is a background pixel. Kitchen (ask + pre-exposure) ->
 * bazaar (buy, Kutchi-only list) -> kitchen (bowl fill) -> quilt patch.
 * Positions come from data/scenes/*.json, never guessed here - see
 * section 3. Only one errand in scope this pass (bowl-01). */
(function (global) {
  "use strict";

  const WORLD_W = 1600;
  const WORLD_H = 900;
  const HESITATION_MS = 5000;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function itemTextureKey(wordId) { return `item-${wordId}`; }
  function charTextureKey(charId, pose) { return `char-${charId}-${pose}`; }

  // ================= shared run state (survives scene restarts) =================
  const State = {
    errand: null,
    listState: {}, // word_id -> { qty, have, noCount }
    basketCount: 0,
    kitchenAssignment: {}, // word_id -> gap slot id
    bazaarSlotToWord: {}, // slot id -> word_id
    interactive: new Map(), // key -> { sprite, scene } currently tappable, for the e2e test helper
  };

  function registerInteractive(key, sprite, scene) {
    State.interactive.set(key, { sprite, scene });
  }
  function unregisterInteractive(key) {
    State.interactive.delete(key);
  }

  // ================= sprite helpers =================
  function placeBackground(scene, key) {
    scene.add.image(0, 0, key).setOrigin(0, 0);
  }

  /** Waist-up framing: origin (0.5,1) at
   * y = worldHeight + height*(1 - visibleFraction), so the bottom edge of
   * the frame crops the sprite. Never interactive, never covers a slot. */
  function placeCharacter(scene, charDef) {
    const key = charTextureKey(charDef.id, "neutral");
    const sprite = scene.add.sprite(0, 0, key);
    sprite.setOrigin(0.5, 1);
    const scale = charDef.scale || 1;
    sprite.setScale(scale);
    const h = sprite.height * scale;
    const baselineY = WORLD_H + h * (1 - (charDef.visibleFraction != null ? charDef.visibleFraction : 1));
    sprite.setPosition(charDef.x, baselineY);
    sprite.setDepth(1); // characters sit behind item slots, which use baseline-as-depth (100+)
    sprite.charId = charDef.id;
    return sprite;
  }

  function setCharacterPose(sprite, pose) {
    sprite.setTexture(charTextureKey(sprite.charId, pose));
  }

  /** A real, tappable/visible fruit sprite at a slot. Depth = baseline so
   * lower-on-screen items draw in front, per section 3. */
  function createItemSprite(scene, wordId, x, baseline, w, opts) {
    opts = opts || {};
    const key = itemTextureKey(wordId);
    const sprite = scene.add.sprite(x, baseline, key);
    sprite.setOrigin(0.5, 1);
    const ratio = w / sprite.width;
    sprite.setDisplaySize(w, sprite.height * ratio);
    sprite.setDepth(100 + baseline);
    sprite.wordId = wordId;
    if (opts.interactive) {
      sprite.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });
    }
    return sprite;
  }

  /** Silhouette: the fruit's own shape, tinted solid and dimmed - not a
   * placeholder box. Pulses only when it's the item Nani is asking for. */
  function createSilhouette(scene, wordId, x, baseline, w) {
    const sprite = createItemSprite(scene, wordId, x, baseline, w, { interactive: false });
    sprite.setTintFill(0x3c281e);
    sprite.setAlpha(0.35);
    return sprite;
  }

  function startPulse(scene, sprite) {
    stopPulse(scene, sprite);
    sprite._pulseTween = scene.tweens.add({
      targets: sprite,
      scaleX: sprite.scaleX * 1.06,
      scaleY: sprite.scaleY * 1.06,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }
  function stopPulse(scene, sprite) {
    if (sprite._pulseTween) {
      sprite._pulseTween.stop();
      sprite._pulseTween = null;
      sprite.setScale(sprite._baseScale != null ? sprite._baseScale : sprite.scaleX);
    }
  }

  function wiggle(scene, sprite) {
    const baseX = sprite.x;
    scene.tweens.add({
      targets: sprite,
      x: { from: baseX - 8, to: baseX + 8 },
      duration: 90,
      yoyo: true,
      repeat: 2,
      ease: "Sine.easeInOut",
      onComplete: () => sprite.setX(baseX),
    });
  }

  function hop(scene, sprite) {
    return new Promise((resolve) => {
      const baseY = sprite.y;
      scene.tweens.add({
        targets: sprite,
        y: baseY - 20,
        duration: 160,
        yoyo: true,
        ease: "Quad.easeOut",
        onComplete: () => {
          sprite.setY(baseY);
          resolve();
        },
      });
    });
  }

  /** A copy of the item flies to the basket corner (bottom-left) and
   * vanishes - the basket-count HTML element is what actually updates. */
  function flyToBasket(scene, sourceSprite) {
    return new Promise((resolve) => {
      const clone = scene.add.sprite(sourceSprite.x, sourceSprite.y, sourceSprite.texture.key);
      clone.setOrigin(0.5, 1);
      clone.setDisplaySize(sourceSprite.displayWidth, sourceSprite.displayHeight);
      clone.setDepth(500);
      scene.tweens.add({
        targets: clone,
        x: 40,
        y: WORLD_H - 30,
        scaleX: clone.scaleX * 0.3,
        scaleY: clone.scaleY * 0.3,
        alpha: 0.2,
        duration: 400,
        ease: "Cubic.easeIn",
        onComplete: () => {
          clone.destroy();
          resolve();
        },
      });
    });
  }

  /** Screen-space center of a sprite, for the e2e test helper - computed
   * from the sprite's world bounds x the canvas's own scale + offset,
   * never a raw element-centre guess. */
  function spriteToScreenPoint(scene, sprite) {
    const canvas = scene.game.canvas;
    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width / WORLD_W;
    const scaleY = rect.height / WORLD_H;
    const center = sprite.getCenter();
    return { x: rect.left + center.x * scaleX, y: rect.top + center.y * scaleY };
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
    });
    ["num-01", "num-02", "num-03"].forEach((id) => wants.push({ kind: "word", id }));
    NjgData.content.sentences.forEach((s) => wants.push({ kind: "word", id: s.id }));
    return wants;
  }

  function resolveExistingAudio(wants) {
    return wants.filter((w) => NjgData.hasAudio(w.kind, w.id));
  }

  // ================= BootScene =================
  class BootScene extends Phaser.Scene {
    constructor() { super("boot"); }
    init(data) { this.bootData = data; }
    preload() {
      const { errand, existingAudio } = this.bootData;
      this.load.image("bg-kitchen", NjgData.scene("kitchen").background);
      this.load.image("bg-bazaar", NjgData.scene("bazaar").background);
      this.load.image("bowl", NjgData.scene("kitchen").containers.bowl.image);
      ["nani", "shopkeeper"].forEach((c) => {
        ["neutral", "talking", "happy"].forEach((pose) => {
          this.load.image(charTextureKey(c, pose), `assets/characters/${c}/${c}-${pose}.png`);
        });
      });
      const wordIds = new Set([
        ...errand.kitchen.pre_exposure,
        ...errand.kitchen.items.map((i) => i.word_id),
        ...errand.bazaar.decoys,
      ]);
      wordIds.forEach((id) => {
        const word = NjgData.word(id);
        this.load.image(itemTextureKey(id), `assets/${word.image}`);
      });
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
      placeBackground(this, "bg-kitchen");
      this.nani = placeCharacter(this, sceneDef.character);
      this.events.once("shutdown", () => {
        for (const [k, v] of State.interactive) { if (v.scene === this) State.interactive.delete(k); }
      });

      this.bowlDef = sceneDef.containers.bowl;
      this.bowlNextInside = 0;
      this.add.image(this.bowlDef.x, this.bowlDef.baseline, "bowl")
        .setOrigin(0.5, 1)
        .setDisplaySize(this.bowlDef.w, this.bowlDef.w * (360 / 480))
        .setDepth(50);

      if (this.phase === "intro") {
        this.runIntro(sceneDef);
      } else {
        this.runFillBowl(sceneDef);
      }
    }

    async sayAs(charSprite, kind, id, kutchiObj, englishFallback, gist) {
      setCharacterPose(charSprite, "talking");
      await NjgUI.speakLine(this, kind, id, kutchiObj, englishFallback, gist);
      setCharacterPose(charSprite, "neutral");
    }

    placeInBowl(wordId, index) {
      const inside = this.bowlDef.inside[index];
      const sprite = createItemSprite(this, wordId, inside.x, inside.baseline, inside.w, { interactive: false });
      sprite.setDepth(60 + index);
      sprite.setScale(0.4);
      sprite.setAlpha(0);
      this.tweens.add({ targets: sprite, scale: 1, alpha: 1, duration: 300, ease: "Back.easeOut" });
      return sprite;
    }

    async runIntro(sceneDef) {
      const errand = State.errand;
      NjgUI.resetShoppingList();
      State.listState = {};
      NjgUI.setGoButton("…", true, null);

      const slots = shuffle(errand.kitchen.gap_slots).slice(0, errand.kitchen.items.length);
      State.kitchenAssignment = {};
      errand.kitchen.items.forEach((it, i) => { State.kitchenAssignment[it.word_id] = slots[i]; });

      await NjgUI.textOnly("Nani is making a fruit bowl for tonight's guests.",
        "Nani is making a fruit bowl for tonight's guests.", 900);

      const greet = NjgData.sentence("snt-01");
      const hey = NjgData.sentence("snt-03");
      await this.sayAs(this.nani, "word", "snt-01", greet.kutchi, greet.english, "");
      await this.sayAs(this.nani, "word", "snt-03", hey.kutchi, hey.english, "");

      // --- pre-exposure: Nani names what's already in the bowl ---
      for (const wid of errand.kitchen.pre_exposure) {
        const word = NjgData.word(wid);
        await this.sayAs(this.nani, "word", wid, word.kutchi, word.english, "Nani's already put these in:");
        this.placeInBowl(wid, this.bowlNextInside++);
        Progress.recordMeeting(wid);
        await NjgUI.sleep(250);
      }

      // --- ask for each new item, silhouette pulsing at the shelf slot she means ---
      for (const it of errand.kitchen.items) {
        const word = NjgData.word(it.word_id);
        const carrier = NjgData.carrier(it.word_id);
        const kutchiObj = carrier ? { text: carrier.kutchi_singular, is_draft: true } : word.kutchi;
        const slotId = State.kitchenAssignment[it.word_id];
        const slot = sceneDef.slots[slotId];
        const sil = createSilhouette(this, it.word_id, slot.x, slot.baseline, slot.w);
        sil._baseScale = sil.scaleX;
        startPulse(this, sil);

        await this.sayAs(this.nani, "carrier", it.word_id, kutchiObj,
          carrier ? carrier.english : `I need ${word.english}`, "Nani needs:");

        await new Promise((resolve) => {
          sil.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });
          registerInteractive(`gap-${it.word_id}`, sil, this);
          sil.once("pointerdown", () => {
            stopPulse(this, sil);
            unregisterInteractive(`gap-${it.word_id}`);
            sil.destroy();
            const filled = createItemSprite(this, it.word_id, slot.x, slot.baseline, slot.w, { interactive: false });
            filled.setAlpha(0.55);
            Progress.recordMeeting(it.word_id);
            State.listState[it.word_id] = { qty: it.qty, have: 0, noCount: !!it.no_count };
            NjgUI.addToShoppingList(this, it.word_id);
            resolve();
          });
        });
      }

      const go = NjgData.sentence("snt-06");
      await this.sayAs(this.nani, "word", "snt-06", go.kutchi, go.english, "Time to go shopping.");

      NjgUI.setGoButton("Go to the bazaar →", false, () => this.scene.start("bazaar"));
    }

    async runFillBowl(sceneDef) {
      NjgUI.setGoButton("…", true, null);
      setCharacterPose(this.nani, "neutral");

      // redraw the two pre-exposure fruit already in the bowl
      const errand = State.errand;
      this.bowlNextInside = 0;
      errand.kitchen.pre_exposure.forEach((wid) => {
        this.placeInBowl(wid, this.bowlNextInside++);
      });

      // the shelf now shows the three asked-for fruit resolved (full opacity)
      errand.kitchen.items.forEach((it) => {
        const slotId = State.kitchenAssignment[it.word_id];
        const slot = sceneDef.slots[slotId];
        createItemSprite(this, it.word_id, slot.x, slot.baseline, slot.w, { interactive: false });
      });

      // tray strip along the bottom: the bought fruit, above characters' depth
      const uniqueWords = errand.kitchen.items.map((i) => i.word_id);
      let remaining = shuffle(uniqueWords);
      const trayY = 870;
      const traySprites = [];

      const trayStrip = this.add.graphics();
      trayStrip.fillStyle(0xe6d3a8, 0.92);
      trayStrip.fillRoundedRect(WORLD_W / 2 - 260, trayY - 95, 520, 130, 16);
      trayStrip.lineStyle(3, 0xa87d3f, 0.9);
      trayStrip.strokeRoundedRect(WORLD_W / 2 - 260, trayY - 95, 520, 130, 16);
      trayStrip.setDepth(590);

      const renderTray = () => {
        traySprites.forEach((s) => { unregisterInteractive(`tray-${s.wordId}`); s.destroy(); });
        traySprites.length = 0;
        const spacing = 120;
        const startX = WORLD_W / 2 - ((remaining.length - 1) * spacing) / 2;
        remaining.forEach((wid, i) => {
          const sprite = createItemSprite(this, wid, startX + i * spacing, trayY, 90, { interactive: true });
          sprite.setDepth(600 + i);
          registerInteractive(`tray-${wid}`, sprite, this);
          traySprites.push(sprite);
          sprite.on("pointerdown", () => onTrayTap(wid, sprite));
        });
      };

      const onTrayTap = (wid, sprite) => {
        if (wid === remaining[0]) {
          traySprites.forEach((s) => { unregisterInteractive(`tray-${s.wordId}`); s.disableInteractive(); });
          const inside = this.bowlDef.inside[this.bowlNextInside];
          this.tweens.add({
            targets: sprite,
            x: inside.x, y: inside.baseline,
            scaleX: sprite.scaleX * 0.7, scaleY: sprite.scaleY * 0.7,
            duration: 400, ease: "Cubic.easeIn",
            onComplete: () => {
              sprite.destroy();
              Progress.recordCorrect(wid);
              this.bowlNextInside++;
              remaining = remaining.filter((w) => w !== wid);
              askNext();
            },
          });
        } else {
          wiggle(this, sprite);
          Progress.recordMiss(wid);
        }
      };

      const askNext = async () => {
        if (remaining.length === 0) {
          traySprites.forEach((s) => { unregisterInteractive(`tray-${s.wordId}`); s.destroy(); });
          traySprites.length = 0;
          trayStrip.destroy();
          return this.finish();
        }
        const wid = remaining[0];
        const carrier = NjgData.carrier(wid);
        const word = NjgData.word(wid);
        const kutchiObj = carrier ? { text: carrier.kutchi_singular, is_draft: true } : word.kutchi;
        renderTray();
        await this.sayAs(this.nani, "carrier", wid, kutchiObj, carrier ? carrier.english : `the ${word.english}`, "Nani wants the:");
      };
      await askNext();
    }

    async finish() {
      setCharacterPose(this.nani, "happy");
      await NjgUI.textOnly("", "Well done!", 1600);

      const patch = { motif: State.errand.reward_patch.motif, colors: State.errand.reward_patch.colors, at: Date.now() };
      NjgUI.addPatch(patch);
      NjgUI.showPatchOverlay(patch, () => {
        setCharacterPose(this.nani, "happy");
        NjgUI.setGoButton("Play again →", false, () => {
          State.basketCount = 0;
          NjgUI.updateBasketCount(0);
          this.scene.start("kitchen", { phase: "intro" });
        });
      });
    }
  }

  // ================= BazaarScene =================
  class BazaarScene extends Phaser.Scene {
    constructor() { super("bazaar"); }
    create() {
      const sceneDef = NjgData.scene("bazaar");
      placeBackground(this, "bg-bazaar");
      this.shopkeeper = placeCharacter(this, sceneDef.character);
      NjgUI.setGoButton("…", true, null);

      this.events.once("shutdown", () => {
        for (const [k, v] of State.interactive) { if (v.scene === this) State.interactive.delete(k); }
      });

      const errand = State.errand;
      const stock = [...errand.kitchen.items.map((i) => i.word_id), ...errand.bazaar.decoys];
      const slots = shuffle(errand.bazaar.slot_pool);
      const shuffledStock = shuffle(stock);
      State.bazaarSlotToWord = {};
      shuffledStock.forEach((wid, i) => { State.bazaarSlotToWord[slots[i]] = wid; });

      this.stallSprites = {}; // word_id -> sprite
      Object.entries(sceneDef.slots).forEach(([slotId, slot]) => {
        const wid = State.bazaarSlotToWord[slotId];
        const sprite = createItemSprite(this, wid, slot.x, slot.baseline, slot.w, { interactive: true });
        this.stallSprites[wid] = sprite;
        registerInteractive(`stall-${wid}`, sprite, this);
        sprite.on("pointerdown", () => this.onTapStall(wid, sprite));
      });

      this.hesitationTimer = null;
      this.runGreeting();
    }

    async runGreeting() {
      const reply = NjgData.sentence("snt-02");
      await this.sayAs(this.shopkeeper, "word", "snt-02", reply.kutchi, reply.english, "");
      const ask = NjgData.sentence("snt-08");
      await NjgUI.textOnly("The shopkeeper is ready for you.", ask.english, 1000);
      this.armHesitationGlow();
    }

    async sayAs(charSprite, kind, id, kutchiObj, englishFallback, gist) {
      setCharacterPose(charSprite, "talking");
      await NjgUI.speakLine(this, kind, id, kutchiObj, englishFallback, gist);
      setCharacterPose(charSprite, "neutral");
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
      this.unboughtTargetSprites().forEach((s) => { s._baseScale = s.scaleX; startPulse(this, s); });
    }

    async onTapStall(wid, sprite) {
      const st = State.listState[wid];
      if (!st) {
        wiggle(this, sprite);
        Progress.recordMiss(wid);
        if (this.hesitationTimer) this.hesitationTimer.remove();
        this.triggerHint();
        return;
      }
      if (st.have >= st.qty) return;

      this.clearHesitationTimer();
      st.have += 1;

      await hop(this, sprite);
      flyToBasket(this, sprite);
      State.basketCount += 1;
      NjgUI.updateBasketCount(State.basketCount);

      if (st.noCount) {
        Progress.recordCorrect(wid);
      } else {
        Progress.recordCorrect(wid);
        const numWord = NjgData.word(`num-${String(st.have).padStart(2, "0")}`);
        if (numWord && numWord.kutchi) {
          const word = NjgData.word(wid);
          await NjgUI.speakLine(this, "word", numWord.id, numWord.kutchi, numWord.english, `${word.english}, counting:`);
        }
      }

      if (st.have >= st.qty) {
        sprite.setAlpha(0.4);
        sprite.disableInteractive();
        unregisterInteractive(`stall-${wid}`);
        NjgUI.markListItemDone(wid);
      }

      if (Object.values(State.listState).every((s) => s.have >= s.qty)) {
        const thanks = NjgData.sentence("snt-11");
        await this.sayAs(this.shopkeeper, "word", "snt-11", thanks.kutchi, thanks.english, "You have everything on the list!");
        NjgUI.setGoButton("Go home →", false, () => this.scene.start("kitchen", { phase: "fill" }));
      } else {
        this.armHesitationGlow();
      }
    }
  }

  // ================= boot sequence =================
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

  async function boot() {
    await NjgData.load();
    const errand = NjgData.errand("bowl-01");
    State.errand = errand;
    const wants = buildAudioWants(errand);
    const existingAudio = resolveExistingAudio(wants);

    NjgUI.el("start-btn").onclick = async () => {
      NjgUI.el("overlay-start").style.display = "none";
      await unlockAudioAndFullscreen();

      const game = new Phaser.Game({
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
      game.scene.start("boot", { errand, existingAudio });

      global.__njg = {
        game,
        debugItems() {
          const items = [];
          State.interactive.forEach(({ sprite, scene }, key) => {
            if (!sprite.active) return;
            const p = spriteToScreenPoint(scene, sprite);
            items.push({ key, wordId: sprite.wordId, x: p.x, y: p.y });
          });
          return items;
        },
        basketCount() { return State.basketCount; },
        listState() { return State.listState; },
      };
    };
  }

  boot();
})(window);

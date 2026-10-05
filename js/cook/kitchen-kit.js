/*
 * The shared kitchen kit (docs/design-language/ui-design-system.md §13; API note: docs/architecture/shared-api.md).
 *
 * One hob for every Cook station, extracted from the chai v2 station: a compact top-down hob with
 * ONE BURNER PER PAN IN PLAY (1-4, never an empty burner: the burner rule), each burner's small
 * face badge and 48 px knob on the hob's front edge in front of it, the painted flame ring under
 * the pan, and the heat ring (the chai v2 clock ring: a white track, the sage "now" band, a gold
 * sweep and a white dot) centred on the pan. A pan, tawa or karahi is placed with its own round
 * body centred on the burner, whatever its handle does.
 *
 *   Cook.Kit.art(n)                       [key, url] pairs to St.load before building (hob n, knobs, flames, pans)
 *   Cook.Kit.size(n, k)                   {w, h, burnerY, frontY} of an n-burner hob at scale k (for layout)
 *   Cook.Kit.hob(S, {n, x, y, k})         the hob: {img, x, y, w, h, k, n, burners: [{x, y}], frontY, pitch}
 *   Cook.Kit.burner(S, hob, i, opts)      badge + knob + flames for burner i: {x, y, face, knob, knobHit, set(state)}
 *   Cook.Kit.place(S, kind, at, r)        a vessel (pan | tawa | karahi) centred on at {x, y}, body radius r
 *   Cook.Kit.heatRing(S, {depth})         {draw(x, y, r, level, lo, hi), clear(), destroy()}
 *   Cook.Kit.faceUrl(who, mood)           a person's round face art (mood: neutral | happy | frown)
 *   Cook.Kit.faceArt(who)                 [key, url] pairs for their three faces (keys <who>-badge[-mood])
 *   Cook.Kit.badge(S, who, mood, N)       a person's face on a white disc (a texture key)
 *   Cook.Kit.review(S, opts)              the review (X10 / Q1): their big round face over the dish,
 *                                         happy when it's right, gently frowning when it's wrong
 *   Cook.Kit.chip(S, id, x, y, opts)      the shelf's `🔊 word` chip (speaker only when opts.word is false)
 *   Cook.Kit.speaker(g, x, y, s)          the flat speaker icon, drawn into a Graphics
 *
 * Coordinates are the station's design px (the combined stations draw 1:1 on 1600x900).
 */
import { Cook as CookNS } from "./ns.js";
import { setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame } from "./life.js";

(function (global) {
  const Cook = CookNS;
  const D = Cook.D;

  const V2 = "assets/cook/items/chai-v2/";
  const ST = "assets/cook/items/chai-station/";
  // the hob family (29 Sept, X5: ChatGPT H1-H5, build/cut_cook_v3.py): each hob drawn whole (no more
  // tiles stitched from one 2-burner picture), scaled so every burner is the same size. Measured from
  // the art (assets/cook/items/v3/hob/meta.json; build/check_vessel_meta.py checks them): the canvas
  // w x h, each burner's centre and the front strip's middle (frontY, where the badges and knobs go),
  // as fractions. "wide": one big burner on a landscape hob (a big karahi), a kit option.
  const V3 = "assets/cook/items/v3/hob/";
  const HOBS = {
    1: { w: 465, h: 658, burners: [[0.4944, 0.3805]], frontY: 0.8325 },
    2: { w: 931, h: 568, burners: [[0.251, 0.4025], [0.7445, 0.4025]], frontY: 0.8342 },
    3: { w: 1388, h: 709, burners: [[0.1596, 0.3725], [0.4993, 0.3728], [0.8389, 0.3725]], frontY: 0.7885 },
    // 30 Sept (v3.1, R1): hob-4-v2, four burners at H1's burner size: at the same cap size it's 1546 px wide, not
    // 1753, so a station fitting it to a width draws bigger burners (chai at 4 people)
    4: { w: 1546, h: 530, burners: [[0.1413, 0.4542], [0.3807, 0.4543], [0.6202, 0.4544], [0.8597, 0.4544]], frontY: 0.8928, file: "hob-4-v2" },
    wide: { w: 937, h: 568, burners: [[0.4954, 0.3929]], frontY: 0.862 },
  };
  const hobOf = (n, wide) => (wide ? "wide" : String(Math.max(1, Math.min(4, n))));
  const HOB = { sets: HOBS, w: [1, 2, 3, 4].map((n) => HOBS[n].w), h: [1, 2, 3, 4].map((n) => HOBS[n].h) };
  // each vessel's round body as fractions of its canvas: centre (cx, cy) and radius r (of the width)
  const VESSELS = {
    pan: { key: "kit-pan", url: V2 + "pan-top.webp", w: 512, cx: 0.3434, cy: 0.6408, r: 0.3644 }, // centre fitted to the rim (29 Sept), as chai-tray.js
    tawa: { key: "kit-tawa", url: "assets/cook/items/vessel-tawa-t.webp", w: 400, cx: 0.388, cy: 0.552, r: 0.386 },
    // samosa v2's karahi of oil (build/cut_samosa_v2.py): oil = the oil's radius as a fraction of the body's
    karahi: { key: "kit-karahi", url: "assets/cook/items/samosa-v2/karahi.webp", w: 760, cx: 0.5, cy: 0.499, r: 0.395, oil: 0.72 },
  };
  const INK = { gold: 0xc9962e, sage: 0x7e9a76, track: 0xfffaf1, over: 0xb24a3a, text: 0x2a2522 };
  const BADGE = 64;
  // the knob (R2, v3.1): its round body is the badge's size beside it (X5); the art's body (its gold ring) is
  // 0.839 of its canvas (2 x r 0.4193, assets/cook/items/v3/hob/meta.json knob-off-v2; H6's was 0.742)
  const KNOB = Math.round(BADGE / 0.839); // the sprite's size
  const KNOB_HIT = 58; // the tap radius: at least 48 screen px across on a phone

  const CHIP = { w: 128, h: 46, hitW: 142, hitH: 80 };
  // the family's round faces (X4; the v3 face sheets, build/cut_cook_v3.py): framed by the eyes, three moods each.
  // Anyone else keeps their old badge (one mood).
  const FACES = Cook.FACES;
  const MOODS = ["neutral", "happy", "frown"];
  const FONT = "Nunito, sans-serif";

  const Kit = {
    HOB,
    VESSELS,
    KNOB,
    KNOB_HIT,
    BADGE,

    /** What to load for an n-burner hob (or the wide one: opts.wide), the knobs, flames and vessels. */
    art(n = 1, vessels = ["pan"], { wide = false } = {}) {
      const id = hobOf(n, wide);
      return [
        [`kit-hob-${id}`, `${V3}${HOBS[id].file || `hob-${id}`}.webp`],
        // 30 Sept (v3.1, R2): the knob with the stronger "on" glow
        ["kit-knob-off", V3 + "knob-off-v2.webp"],
        ["kit-knob-on", V3 + "knob-on-v2.webp"],
        ["kit-flame-high", ST + "flame-high.webp"],
        ["kit-flame-low", ST + "flame-low.webp"],
      ].concat(vessels.filter((v) => VESSELS[v]).map((v) => [VESSELS[v].key, VESSELS[v].url]));
    },

    /** The size of an n-burner hob (or the wide one) at scale k, and where its burners and front edge sit (px). */
    size(n, k, wide = false) {
      const H = HOBS[hobOf(n, wide)];
      const w = H.w * k;
      const h = H.h * k;
      return { w, h, burnerY: H.burners[0][1] * h, frontY: H.frontY * h };
    },

    /**
     * The hob, top-left at (x, y), scaled k (or centred on cx with its bottom at `bottom`).
     * Returns {img, x, y, w, h, k, n, burners: [{x, y}], frontY, pitch}.
     */
    hob(S, { n = 1, x, y, k = 0.79, cx, bottom, wide = false, depth = D.item - 4 } = {}) {
      n = wide ? 1 : Math.max(1, Math.min(4, n));
      const id = hobOf(n, wide);
      const sz = Kit.size(n, k, wide);
      if (cx != null) x = cx - sz.w / 2;
      if (bottom != null) y = bottom - sz.h;
      const img = S.track(S.add.image(x, y, `kit-hob-${id}`).setOrigin(0).setScale(k).setDepth(depth));
      img.shadow = S.contactShadow(img);
      const burners = HOBS[id].burners.map(([fx, fy]) => ({ x: x + fx * sz.w, y: y + fy * sz.h }));
      return { img, x, y, w: sz.w, h: sz.h, k, n, wide, burners, frontY: y + sz.frontY, pitch: n > 1 ? burners[1].x - burners[0].x : Infinity };
    },

    /** A person's round face art: mood neutral (a small smile), happy (it's right) or frown (it's wrong). */
    faceUrl: (who, mood) => Cook.facePath(who, mood),

    /** What to load for a person's faces: texture keys <who>-badge (neutral), <who>-badge-happy, -frown. */
    faceArt(who) {
      if (!who) return [];
      return MOODS.map((m) => [`${who}-badge${m === "neutral" ? "" : `-${m}`}`, Kit.faceUrl(who, m)]);
    },

    /** A person's face badge: their face art on a white disc with a thin grey ring (made once per mood and size). */
    badge(S, who, mood = "neutral", N = 192) {
      const key0 = `${who}-badge`;
      const want = mood && mood !== "neutral" ? `${key0}-${mood}` : key0;
      const key = S.textures.exists(want) ? want : key0;
      const out = `${key}-v2round${N === 192 ? "" : `-${N}`}`;
      if (S.textures.exists(out) || !S.textures.exists(key)) return S.textures.exists(out) ? out : key;
      const src = S.textures.get(key).getSourceImage();
      const cv = S.textures.createCanvas(out, N, N);
      const g = cv.getContext();
      const u = N / 192;
      g.save();
      g.beginPath();
      g.arc(N / 2, N / 2, N / 2 - 4 * u, 0, Math.PI * 2);
      g.fillStyle = "#ffffff";
      g.fill();
      g.clip();
      // the family's faces are framed to fill the circle (X4); an old badge sits a little lower, inset
      if (FACES.includes(who)) g.drawImage(src, 0, 0, N, N);
      else g.drawImage(src, 8 * u, 12 * u, N - 16 * u, N - 16 * u);
      g.restore();
      g.lineWidth = 8 * u;
      g.strokeStyle = "#ffffff";
      g.beginPath();
      g.arc(N / 2, N / 2, N / 2 - 5 * u, 0, Math.PI * 2);
      g.stroke();
      g.lineWidth = 2 * u;
      g.strokeStyle = "rgba(42,37,34,0.18)";
      g.beginPath();
      g.arc(N / 2, N / 2, N / 2 - 1.5 * u, 0, Math.PI * 2);
      g.stroke();
      cv.refresh();
      return out;
    },

    /**
     * The review (29 Sept, X10 / Q1, Zafar's answer): ONE way in every station. The person appears as a
     * big round face over the dish (no body, no pretend eating): happy when it's right, with the
     * family's praise beside it; a gentle frown when it's wrong (the station then marks the row and the
     * child redoes it, as before). Resolves once it has been seen and heard, with {face, close()}: the
     * station closes it when it moves on (a wrong one can stay up while they say their order again).
     *   who, ok, x, y (the face's centre, over the dish), size (its diameter, station px),
     *   line (what they say when it's right; default the "welldone" line; false for none),
     *   side ("left" | "right": where the praise card goes), k (the card's scale: the zone's), depth.
     */
    async review(S, { who, ok, x, y, size = 220, line, side = "left", k = 1, depth = D.fx + 4 } = {}) {
      // (Cook.forceReview: the screenshot script shows a face it can't make the bot earn; the look only,
      // the station's own verdict still decides what happens next)
      if (Cook.forceReview != null) ok = Cook.forceReview;
      const mood = ok ? "happy" : "frown";
      // never cut off by the view's edge (a phone shows less of the stage above the dish)
      const view = S.cameras && S.cameras.main && S.cameras.main.worldView;
      if (view && view.height) {
        const m = size * 0.08;
        y = Math.max(view.y + size / 2 + m, Math.min(view.bottom - size / 2 - m, y));
        x = Math.max(view.x + size / 2 + m, Math.min(view.right - size / 2 - m, x));
      }
      const key = Kit.badge(S, who, mood, 256);
      const face = S.track(S.add.container(x, y).setDepth(depth));
      const sh = S.add.graphics();
      sh.fillStyle(0x28190a, 0.16);
      sh.fillCircle(0, size * 0.035, size * 0.5);
      const img = S.add.image(0, 0, key).setDisplaySize(size, size);
      face.add([sh, img]);
      face.setScale(0.5).setAlpha(0);
      face.mood = mood;
      await Cook.tween(S, { targets: face, scale: 1, alpha: 1, duration: 340, ease: "Back.easeOut" });
      // (Cook.tasted and Cook.tasteHold: for the screenshot scripts)
      Cook.tasted = ok ? "happy" : "not-quite";
      let card = null;
      if (ok) {
        Cook.sfx.right();
        S.sparkle(x, y + size * 0.35);
        S.tweens.add({ targets: face, y: y - size * 0.06, duration: 170, yoyo: true, repeat: 1, ease: "Sine.easeOut" });
        const said = line === false ? null : line || Cook.Lang.line("welldone");
        if (said) {
          const t = S.add.text(0, 0, Cook.Lang.plain(said).trim(), { fontFamily: FONT, fontSize: "34px", fontStyle: "800", color: "#8C2F2F" }).setOrigin(0.5);
          const w = t.width + 44;
          const h = 58;
          const dir = side === "right" ? 1 : -1;
          card = S.track(S.add.container(x + dir * (size * 0.5 + (18 + w / 2) * k), y).setDepth(depth + 0.5).setScale(k).setAlpha(0));
          const g = S.add.graphics();
          g.fillStyle(0x28190a, 0.12);
          g.fillRoundedRect(-w / 2, -h / 2 + 3, w, h, 14);
          g.fillStyle(0xffffff, 1);
          g.fillRoundedRect(-w / 2, -h / 2, w, h, 14);
          card.add([g, t]);
          S.tweens.add({ targets: card, alpha: 1, duration: 200 });
          await Promise.race([Cook.Lang.speak(said).catch(() => {}), Cook.wait(2200)]);
        } else await Cook.wait(900);
        await Cook.wait(400);
      } else {
        // not quite: a gentle frown and a small shake of the head (never a red cross)
        Cook.sfx.soft();
        await Cook.tween(S, { targets: face, angle: { from: -5, to: 5 }, duration: 170, yoyo: true, repeat: 1, ease: "Sine.easeInOut" });
        face.setAngle(0);
        await Cook.wait(600);
      }
      if (Cook.tasteHold) await new Promise((r) => setTimeout(r, Cook.tasteHold));
      const close = async () => {
        const all = [face, card].filter((o) => o && o.active);
        if (!all.length) return;
        await Cook.tween(S, { targets: all, alpha: 0, scale: 0.85, duration: 260, ease: "Sine.easeIn" });
        all.forEach((o) => o.destroy());
      };
      return { face, card, close };
    },

    /**
     * Burner i's front-edge controls and flames. opts: who (a face badge left of the knob; omit for
     * the knob alone, centred), flameR (the pan's radius: the flame ring peeks out under it),
     * spread (badge-to-knob offset, default from the pitch), state ("off" | "high" | "low").
     * Returns {x, y, face, knob, knobHit, flameHi, flameLo, state, set(state, quiet)}; tap
     * handling is the station's (S.tappable(b.knobHit, …)).
     */
    burner(S, hob, i, { who, flameR = 112, spread, state = "off" } = {}) {
      const { x, y } = hob.burners[i];
      const fy = hob.frontY;
      const off = spread != null ? spread : Math.min(58, hob.pitch * 0.2);
      // 29 Sept (X6): the flames just peek out past the pan, and never reach halfway to the next burner
      // (flame-high's ring reaches 245/512 of its sprite, its inside 144/512: hidden under the pan)
      const outer = Math.min(flameR * 1.2, hob.pitch * 0.46);
      const bx = who ? x - off : null;
      const kx = who ? x + off : x;
      const flameHi = S.track(S.add.image(x, y, "kit-flame-high").setDepth(D.item - 1).setAlpha(0));
      const flameLo = S.track(S.add.image(x, y, "kit-flame-low").setDepth(D.item - 1).setAlpha(0));
      const fs = outer / 245;
      flameHi.setScale(fs);
      flameLo.setScale(fs * 0.92);
      let face = null;
      if (who) {
        face = S.track(S.add.image(bx, fy, Kit.badge(S, who)).setDisplaySize(BADGE, BADGE).setDepth(D.item + 1));
        face.baseScale = face.scaleX;
      }
      const knob = S.track(S.add.container(kx, fy).setDepth(D.item + 1));
      const kOff = S.add.image(0, 0, "kit-knob-off").setDisplaySize(KNOB, KNOB);
      const kOn = S.add.image(0, 0, "kit-knob-on").setDisplaySize(KNOB, KNOB).setAngle(-90).setAlpha(0);
      knob.add([kOff, kOn]);
      const knobHit = S.track(S.add.circle(kx, fy, KNOB_HIT, 0xffffff, 0.001).setDepth(D.item + 2));
      knobHit.baseScale = 1;
      const b = { i, x, y, face, knob, kOff, kOn, knobHit, flameHi, flameLo, state: "off" };
      /** Turn the knob: off, high (the big flame ring) or low (the small one). */
      b.set = (st, quiet = false) => {
        b.state = st;
        // high: a quarter turn (the bar upright); low: further round, the bar on the diagonal (29 Sept:
        // at 180 the H6 knob's bar lay flat again and "low" read as "off")
        const ang = { off: 0, high: 90, low: 135 }[st];
        const t = quiet ? 0 : 1;
        S.tweens.add({ targets: knob, angle: ang, duration: 260 * t + 1, ease: "Back.easeOut" });
        S.tweens.add({ targets: kOn, alpha: st === "off" ? 0 : 1, duration: 260 * t + 1 });
        S.tweens.add({ targets: flameHi, alpha: st === "high" ? 0.95 : 0, duration: 360 * t + 1 });
        S.tweens.add({ targets: flameLo, alpha: st === "low" ? 0.95 : 0, duration: 360 * t + 1 });
        if (!quiet) Cook.sfx.click();
      };
      if (state !== "off") b.set(state, true);
      return b;
    },

    /**
     * A vessel centred on `at` ({x, y}: a burner), its round body r px across the radius, with a
     * contact shadow. kind: pan | tawa | karahi (Kit.VESSELS). Returns the image (baseScale set).
     */
    place(S, kind, at, r, { depth = D.item } = {}) {
      const v = VESSELS[kind] || VESSELS.pan;
      const w = v.w || S.textures.get(v.key).getSourceImage().width;
      const scale = r / (v.r * w);
      const img = S.track(S.add.image(at.x, at.y, v.key).setOrigin(v.cx, v.cy).setScale(scale).setDepth(depth));
      img.baseScale = scale;
      img.bodyR = r;
      img.shadow = S.contactShadow(img, { centerX: at.x, centerY: at.y + r * 0.08, width: r * 2.15, height: r * 2.15 });
      return img;
    },

    /** The speaker icon, drawn at (x, y) about `s` px tall, in the charcoal text colour. */
    speaker(g, x, y, s, color = INK.text) {
      const k = s / 24;
      g.fillStyle(color, 1);
      g.fillRect(x - 8 * k, y - 3.5 * k, 5 * k, 7 * k);
      g.fillTriangle(x - 4 * k, y - 3.5 * k, x + 2 * k, y - 9 * k, x + 2 * k, y + 9 * k);
      g.fillTriangle(x - 4 * k, y + 3.5 * k, x + 2 * k, y - 9 * k, x - 4 * k, y - 3.5 * k);
      g.lineStyle(2.2 * k, color, 1);
      g.beginPath();
      g.arc(x + 3 * k, y, 5 * k, -0.9, 0.9);
      g.strokePath();
      g.beginPath();
      g.arc(x + 3 * k, y, 9.5 * k, -0.9, 0.9);
      g.strokePath();
    },

    /**
     * The shelf chip under an object (§4): `🔊 word`, one tappable chip; tap it = hear the word.
     * opts.word false: the speaker alone, the same size and place (higher levels). opts.w: its width.
     */
    chip(S, id, x, y, { word = true, w = CHIP.w, depth = D.item + 2 } = {}) {
      const chip = S.track(S.add.container(x, y).setDepth(depth));
      const bg = S.add.graphics();
      bg.fillStyle(0x28190a, 0.1);
      bg.fillRoundedRect(-w / 2, -CHIP.h / 2 + 2, w, CHIP.h, 12);
      bg.fillStyle(0xffffff, 1);
      bg.fillRoundedRect(-w / 2, -CHIP.h / 2, w, CHIP.h, 12);
      chip.add(bg);
      const icon = S.add.graphics();
      if (word) {
        const t = S.add.text(0, 0, Cook.display(id), { fontFamily: FONT, fontSize: "25px", fontStyle: "800", color: "#8C2F2F" }).setOrigin(0, 0.5);
        const maxT = w - 52;
        if (t.width > maxT) t.setScale(maxT / t.width);
        const tw = 22 + 8 + t.displayWidth;
        Kit.speaker(icon, -tw / 2 + 10, 0, 24);
        t.x = -tw / 2 + 30;
        chip.add([icon, t]);
      } else {
        Kit.speaker(icon, 1, 0, 26);
        chip.add(icon);
      }
      const hitW = Math.max(CHIP.hitW, w + 14);
      chip.setSize(hitW, CHIP.hitH);
      chip.setInteractive(new Phaser.Geom.Rectangle(-hitW / 2, -CHIP.hitH / 2 + 8, hitW, CHIP.hitH), Phaser.Geom.Rectangle.Contains);
      chip.on("pointerdown", (ptr, lx, ly, ev) => {
        if (ev && ev.stopPropagation) ev.stopPropagation();
        Cook.unlockAudio();
        if (Cook.onLabel) Cook.onLabel(id);
        Cook.Lang.speakWord(id);
        S.tweens.add({ targets: chip, scale: 1.08, duration: 90, yoyo: true });
      });
      return chip;
    },

    /**
     * The heat ring (one per pan): it fills like a clock from the top; the sage arc is "now"; the
     * sweep turns red past it. draw(x, y, r, level 0-1, lo, hi) each frame; clear() when it stops.
     */
    heatRing(S, { depth = D.fx - 2, width: w0 = 10 } = {}) {
      const g = S.track(S.add.graphics().setDepth(depth));
      const a0 = -Math.PI / 2;
      // 29 Sept (X6): half as thick again (10 -> 15 px) on a dark track, so it reads against the flames
      const width = w0 * 1.5;
      return {
        g,
        draw(x, y, r, level, lo, hi) {
          g.clear();
          g.lineStyle(width + 4, INK.text, 0.55);
          g.strokeCircle(x, y, r);
          g.lineStyle(width, 0x4a3b30, 0.85);
          g.strokeCircle(x, y, r);
          g.lineStyle(width, INK.sage, 0.95);
          g.beginPath();
          g.arc(x, y, r, a0 + lo * Math.PI * 2, a0 + hi * Math.PI * 2);
          g.strokePath();
          g.lineStyle(width * 0.6, level > hi ? INK.over : INK.gold, 1);
          g.beginPath();
          g.arc(x, y, r, a0, a0 + Math.min(1, level) * Math.PI * 2);
          g.strokePath();
          const ex = x + Math.cos(a0 + level * Math.PI * 2) * r;
          const ey = y + Math.sin(a0 + level * Math.PI * 2) * r;
          g.fillStyle(0xffffff, 1);
          g.fillCircle(ex, ey, width * 0.9);
          g.lineStyle(3, INK.text, 0.5);
          g.strokeCircle(ex, ey, width * 0.9);
        },
        clear: () => g.clear(),
        destroy: () => g.destroy(),
      };
    },
  };

  Cook.Kit = Kit;
})(window);

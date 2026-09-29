/*
 * The shared kitchen kit (docs/design/cook-design-system-v1.md §13; API note: docs/shared-api.md).
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
 *   Cook.Kit.badge(S, who)                a person's face on a white disc (a texture key)
 *   Cook.Kit.chip(S, id, x, y, opts)      the shelf's `🔊 word` chip (speaker only when opts.word is false)
 *   Cook.Kit.speaker(g, x, y, s)          the flat speaker icon, drawn into a Graphics
 *
 * Coordinates are the station's design px (the combined stations draw 1:1 on 1600x900).
 */
(function (global) {
  const Cook = global.Cook;
  const D = Cook.D;

  const V2 = "assets/cook/items/chai-v2/";
  const ST = "assets/cook/items/chai-station/";
  // the hobs as build/cut_chai_v2.py composed them: one canvas height, one width per burner count
  const HOB = {
    h: 671,
    burnerY: 0.3636,
    frontY: 0.76,
    // measured from the canvases (assets/cook/items/chai-v2/meta.json)
    w: [421, 775, 1129, 1483],
    burners: [[0.5297], [0.2877, 0.7445], [0.1975, 0.5111, 0.8246], [0.1504, 0.3891, 0.6278, 0.8665]],
  };
  // each vessel's round body as fractions of its canvas: centre (cx, cy) and radius r (of the width)
  const VESSELS = {
    pan: { key: "kit-pan", url: V2 + "pan-top.webp", w: 512, cx: 0.408, cy: 0.5805, r: 0.3644 },
    tawa: { key: "kit-tawa", url: "assets/cook/items/vessel-tawa-t.webp", w: 400, cx: 0.388, cy: 0.552, r: 0.386 },
    karahi: { key: "kit-karahi", url: "assets/cook/items/vessel-kadai-oil-t.webp", w: 0, cx: 0.5, cy: 0.5, r: 0.42 },
  };
  const INK = { gold: 0xc9962e, sage: 0x7e9a76, track: 0xfffaf1, over: 0xb24a3a, text: 0x2a2522 };
  const KNOB = 62; // what you see
  const KNOB_HIT = 58; // the tap radius: at least 48 screen px across on a phone
  const BADGE = 64;

  const CHIP = { w: 128, h: 46, hitW: 142, hitH: 80 };
  const FONT = "Nunito, sans-serif";

  const Kit = {
    HOB,
    VESSELS,
    KNOB,
    KNOB_HIT,
    BADGE,

    /** What to load for an n-burner hob (and the vessels, the chimta). */
    art(n = 1, vessels = ["pan"]) {
      return [
        [`kit-hob-${n}`, `${V2}hob-${n}.webp`],
        ["kit-knob-off", ST + "knob-off.webp"],
        ["kit-knob-on", ST + "knob-on.webp"],
        ["kit-flame-high", ST + "flame-high.webp"],
        ["kit-flame-low", ST + "flame-low.webp"],
      ].concat(vessels.filter((v) => VESSELS[v]).map((v) => [VESSELS[v].key, VESSELS[v].url]));
    },

    /** The size of an n-burner hob at scale k, and where its burners and front edge sit (fractions → px). */
    size(n, k) {
      const w = HOB.w[n - 1] * k;
      const h = HOB.h * k;
      return { w, h, burnerY: HOB.burnerY * h, frontY: HOB.frontY * h };
    },

    /**
     * The hob, top-left at (x, y), scaled k (or centred on cx with its bottom at `bottom`).
     * Returns {img, x, y, w, h, k, n, burners: [{x, y}], frontY, pitch}.
     */
    hob(S, { n = 1, x, y, k = 0.79, cx, bottom, depth = D.item - 4 } = {}) {
      n = Math.max(1, Math.min(4, n));
      const sz = Kit.size(n, k);
      if (cx != null) x = cx - sz.w / 2;
      if (bottom != null) y = bottom - sz.h;
      const img = S.track(S.add.image(x, y, `kit-hob-${n}`).setOrigin(0).setScale(k).setDepth(depth));
      img.shadow = S.contactShadow(img);
      const burners = HOB.burners[n - 1].map((f) => ({ x: x + f * sz.w, y: y + sz.burnerY }));
      return { img, x, y, w: sz.w, h: sz.h, k, n, burners, frontY: y + sz.frontY, pitch: n > 1 ? burners[1].x - burners[0].x : 300 };
    },

    /** A person's face badge: their badge art on a white disc with a thin grey ring (made once). */
    badge(S, who) {
      const key = `${who}-badge`;
      const out = `${key}-v2round`;
      if (S.textures.exists(out) || !S.textures.exists(key)) return S.textures.exists(out) ? out : key;
      const src = S.textures.get(key).getSourceImage();
      const N = 192;
      const cv = S.textures.createCanvas(out, N, N);
      const g = cv.getContext();
      g.save();
      g.beginPath();
      g.arc(N / 2, N / 2, N / 2 - 4, 0, Math.PI * 2);
      g.fillStyle = "#ffffff";
      g.fill();
      g.clip();
      g.drawImage(src, 8, 12, N - 16, N - 16);
      g.restore();
      g.lineWidth = 8;
      g.strokeStyle = "#ffffff";
      g.beginPath();
      g.arc(N / 2, N / 2, N / 2 - 5, 0, Math.PI * 2);
      g.stroke();
      g.lineWidth = 2;
      g.strokeStyle = "rgba(42,37,34,0.18)";
      g.beginPath();
      g.arc(N / 2, N / 2, N / 2 - 1.5, 0, Math.PI * 2);
      g.stroke();
      cv.refresh();
      return out;
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
      const bx = who ? x - off : null;
      const kx = who ? x + off : x;
      const flameHi = S.track(S.add.image(x, y, "kit-flame-high").setDepth(D.item - 1).setAlpha(0));
      const flameLo = S.track(S.add.image(x, y, "kit-flame-low").setDepth(D.item - 1).setAlpha(0));
      const fs = (flameR * 2.7) / 512;
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
        const ang = { off: 0, high: 90, low: 180 }[st];
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
    heatRing(S, { depth = D.fx - 2, width = 10 } = {}) {
      const g = S.track(S.add.graphics().setDepth(depth));
      const a0 = -Math.PI / 2;
      return {
        g,
        draw(x, y, r, level, lo, hi) {
          g.clear();
          g.lineStyle(width, INK.track, 0.8);
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

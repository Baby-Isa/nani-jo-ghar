/*
 * The shared kitchen kit (docs/design-language/ui-design-system.md §13; API note: docs/architecture/shared-api.md).
 *
 * One hob for every Cook station (the kitchen kit's stove part): a compact top-down hob with
 * ONE BURNER PER PAN IN PLAY (1-4, never an empty burner: the burner rule), each burner's small
 * face badge and 48 px knob on the hob's front edge in front of it, the painted flame ring under
 * the pan, and the heat ring (the clock ring: a white track, the sage "now" band, a gold
 * sweep and a white dot) centred on the pan. A pan, tawa or karahi is placed with its own round
 * body centred on the burner, whatever its handle does.
 *
 *   Cook.Kit.art(n)                       [key, url] pairs to St.load before building (hob n, knobs, flames, pans)
 *   Cook.Kit.size(n, k, wide, knobs)      {w, h, burnerY, burnerX, frontY} of an n-burner hob at scale k (for layout)
 *   Cook.Kit.hob(S, {n, x, y, k, knobs})  the hob: {img, x, y, w, h, k, n, burners: [{x, y}], frontY, pitch, knobs}
 *   Cook.Kit.burner(S, hob, i, opts)      badge + knob + flames for burner i: {x, y, face, knob, knobHit, set(state)}
 *     THE KNOB RULE (SH-247; Zafar, 9 Nov: "where you only have one item, you want the vertical space, and therefore you put the
 *     button off to the left in games where there's only ever one"): a game with only ever one pan asks for knobs: "left": the
 *     knob and the face stand in a column to the pan's left, centred on its height, on the hob's own glass (the one-burner hob
 *     turned a quarter, its front strip on the left; the wide hob's glass beside the pan), so the pan can be as big as the height
 *     allows. With several pans each burner's face and knob stay on the front edge below it, as before.
 *   Cook.Kit.heatRing(S, {depth})         {draw(x, y, r, level, lo, hi), clear(), destroy()}
 *     (hob, burner and heatRing are the stove part, for the games that cook with heat (Sprint 18, module map piece 2); the
 *     heat and boil on them, the knob's taps, the green, the boil-over and the simmer loop, is Mech.boil(S, pan, {burner,
 *     ring, band, rate, ...}): js/cook/mechanics/boil.js)
 *   Cook.Kit.faceUrl(who, mood)           a person's round face art (mood: neutral | happy | frown)
 *   Cook.Kit.faceArt(who)                 [key, url] pairs for their three faces (keys <who>-badge[-mood])
 *   Cook.Kit.badge(S, who, mood, N)       a person's face on a white disc (a texture key)
 *   Cook.Kit.review(S, opts)              the review (X10 / Q1; NjgServe.review, js/shared/serve.js): their big face over the dish,
 *                                         happy when it's right, gently frowning when it's wrong
 *   Cook.Kit.chip(S, id, x, y, opts)      the shelf's `🔊 word` chip (speaker only when opts.word is false)
 *   Cook.Kit.speaker(g, x, y, s)          the flat speaker icon, drawn into a Graphics
 *   Cook.Kit.worktop(S, {top, far, depth}) the worktop's wash; St.worktopWash() its colour; St.stoneBand(S, {top, base, far,
 *                                         depth}) the stone shelf band (at the foot of this file)
 *
 * Coordinates are the station's design px (the combined stations draw 1:1 on 1600x900).
 */
import { Cook as CookNS } from "./ns.js";
import { setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame } from "./life.js";
import { NjgServe } from "../shared/serve.js";

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
    // 1753, so a station fitting it to a width draws bigger burners (a pan for each of 4 people)
    4: { w: 1546, h: 530, burners: [[0.1413, 0.4542], [0.3807, 0.4543], [0.6202, 0.4544], [0.8597, 0.4544]], frontY: 0.8928, file: "hob-4-v2" },
    wide: { w: 937, h: 568, burners: [[0.4954, 0.3929]], frontY: 0.862 },
  };
  const hobOf = (n, wide) => (wide ? "wide" : String(Math.max(1, Math.min(4, n))));
  // SH-247: knobs on the left of a one-pan hob: the one-burner hob is turned a quarter (its front strip down its left side); the
  // wide hob keeps its way round (its glass already reaches past the pan on the left)
  const turned = (n, wide, knobs) => knobs === "left" && !wide && Math.max(1, Math.min(4, n)) === 1;
  // the column's gap between the face and the knob, and the hob's rim kept clear on its left (of its width)
  const COL_GAP = 14;
  const KNOB_GAP = 24; // the least gap between the knob and the pan's picture
  const RIM = 0.045;
  const HOB = { sets: HOBS, w: [1, 2, 3, 4].map((n) => HOBS[n].w), h: [1, 2, 3, 4].map((n) => HOBS[n].h) };
  // each vessel's round body as fractions of its canvas: centre (cx, cy) and radius r (of the width)
  const VESSELS = {
    pan: { key: "kit-pan", url: V2 + "pan-top.webp", w: 512, cx: 0.3434, cy: 0.6408, r: 0.3644 }, // centre fitted to the rim (29 Sept)
    tawa: { key: "kit-tawa", url: "assets/cook/items/vessel-tawa-t.webp", w: 400, cx: 0.388, cy: 0.552, r: 0.386 },
    // the v2 karahi of oil (build/cut_samosa_v2.py): oil = the oil's radius as a fraction of the body's
    karahi: { key: "kit-karahi", url: "assets/cook/items/samosa-v2/karahi.webp", w: 760, cx: 0.5, cy: 0.499, r: 0.395, oil: 0.72 },
  };
  const INK = { gold: 0xc9962e, sage: 0x7e9a76, track: 0xfffaf1, over: 0xb24a3a, text: 0x2a2522, shade: 0x28190a };
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
  const FONT = () => (global.Tokens && global.Tokens.font ? global.Tokens.font("word", "Nunito, sans-serif") : "Nunito, sans-serif"); // the central type's drawn-word font (SH-151)

  /*
   * The kitchen's chip keeps the box it always had (the orchestrator, 7 Nov: a stove game's contract-92): Kit.chip never reported its
   * card's size, so a game's first-time light and the light-room check (contract-92) measure the shelf item alone. The shared pill
   * keeps its card's size as cardW / cardH (the shelf's own lay-out and its check read them); here they move to pillW / pillH, and
   * come back only while the pill itself redraws or sizes its tap area.
   */
  function keepBox(chip) {
    const hide = () => {
      if (chip.cardW == null) return;
      chip.pillW = chip.cardW;
      chip.pillH = chip.cardH;
      delete chip.cardW;
      delete chip.cardH;
    };
    const show = () => {
      if (chip.pillW != null && chip.cardW == null) Object.assign(chip, { cardW: chip.pillW, cardH: chip.pillH });
    };
    const { face, hit } = chip;
    chip.face = (...a) => (show(), face.apply(chip, a), hide(), chip);
    chip.hit = (...a) => (show(), hit.apply(chip, a), hide(), chip);
    hide();
    return chip;
  }

  const Kit = {
    /** the shared ring and badge colours (the heat ring's; CHT-05: the chop timer uses them too) */
    INK,
    /** F2: the scale at which `px` canvas text renders at 14 CSS px (the canvas is shown smaller than its game size on a phone; TXT-05) */
    textFloor(S, px) {
      return 14.2 / (px * (S.scale.displaySize.height / S.scale.gameSize.height) * S.cameras.main.zoom);
    },
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
    size(n, k, wide = false, knobs = null) {
      const H = HOBS[hobOf(n, wide)];
      // SH-247: the one-burner hob turned a quarter clockwise for knobs on the left (its front strip then runs down its left side)
      if (turned(n, wide, knobs)) {
        const w = H.h * k;
        const h = H.w * k;
        return { w, h, burnerX: (1 - H.burners[0][1]) * w, burnerY: H.burners[0][0] * h, frontX: (1 - H.frontY) * w, frontY: null };
      }
      const w = H.w * k;
      const h = H.h * k;
      return { w, h, burnerX: H.burners[0][0] * w, burnerY: H.burners[0][1] * h, frontY: H.frontY * h };
    },

    /**
     * The hob, top-left at (x, y), scaled k (or centred on cx with its bottom at `bottom`).
     * Returns {img, x, y, w, h, k, n, burners: [{x, y}], frontY, pitch}.
     */
    hob(S, { n = 1, x, y, k = 0.79, cx, bottom, burnerAt, wide = false, knobs = null, depth = D.item - 4 } = {}) {
      n = wide ? 1 : Math.max(1, Math.min(4, n));
      const id = hobOf(n, wide);
      const turn = turned(n, wide, knobs);
      const sz = Kit.size(n, k, wide, knobs);
      if (cx != null) x = cx - sz.w / 2;
      if (bottom != null) y = bottom - sz.h;
      // (burnerAt {x, y}: the hob placed so its burner, the pan's middle, is there: a game that keeps its pan where it was)
      if (burnerAt) {
        x = burnerAt.x - sz.burnerX;
        y = burnerAt.y - sz.burnerY;
      }
      const img = turn
        ? S.track(S.add.image(x + sz.w / 2, y + sz.h / 2, `kit-hob-${id}`).setOrigin(0.5).setScale(k).setAngle(90).setDepth(depth))
        : S.track(S.add.image(x, y, `kit-hob-${id}`).setOrigin(0).setScale(k).setDepth(depth));
      img.shadow = S.contactShadow(img);
      const burners = turn ? [{ x: x + sz.burnerX, y: y + sz.burnerY }] : HOBS[id].burners.map(([fx, fy]) => ({ x: x + fx * sz.w, y: y + fy * sz.h }));
      const left = knobs === "left" && n === 1;
      return { img, x, y, w: sz.w, h: sz.h, k, n, wide, burners, frontY: turn ? null : y + sz.frontY, frontX: turn ? x + sz.frontX : null, knobs: left ? "left" : "front", pitch: n > 1 ? burners[1].x - burners[0].x : Infinity };
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
    review: (S, o) => NjgServe.review(S, o, NjgServe.env(Cook)), // (Sprint 18, piece 8: the shared serve part, js/shared/serve.js)

    /**
     * Burner i's front-edge controls and flames. opts: who (a face badge left of the knob; omit for
     * the knob alone, centred), flameR (the pan's radius: the flame ring peeks out under it),
     * spread (badge-to-knob offset, default from the pitch), state ("off" | "high" | "low").
     * On a hob made with knobs: "left" (SH-247, one pan) the face and the knob stand in a column to the pan's left, the face above
     * the knob, the pair centred on the burner's height, the column centred in the glass between the hob's rim and the pan:
     * reach (how far the pan's picture, its handles too, reaches left of its middle; default the flames' ring).
     * Returns {x, y, face, knob, knobHit, flameHi, flameLo, state, set(state, quiet)}; tap
     * handling is the station's (S.tappable(b.knobHit, …)).
     */
    burner(S, hob, i, { who, flameR = 112, spread, state = "off", reach } = {}) {
      if (Cook.sfx.preload) Cook.sfx.preload(["knob", "flame"]); // (CHAI-92: the knob's recorded sounds, in before the first turn)
      const { x, y } = hob.burners[i];
      const off = spread != null ? spread : Math.min(58, hob.pitch * 0.2);
      // 29 Sept (X6): the flames just peek out past the pan, and never reach halfway to the next burner
      // (flame-high's ring reaches 245/512 of its sprite, its inside 144/512: hidden under the pan)
      const outer = Math.min(flameR * 1.2, hob.pitch * 0.46);
      let bx = who ? x - off : null;
      let kx = who ? x + off : x;
      let fy = hob.frontY;
      let by = fy;
      if (hob.knobs === "left") {
        // SH-247: the column in the glass between the hob's rim and the pan (its handles, or its flames), centred on the burner's height
        const panL = x - Math.max(reach || 0, outer);
        const rimL = hob.x + hob.w * RIM;
        let col = hob.frontX != null && hob.frontX + KNOB / 2 < panL ? Math.min(hob.frontX, (rimL + panL) / 2) : (rimL + panL) / 2;
        // (never nearer the pan than a clear gap: a karahi's handle at 740x320 came within 1 px of the knob; contract-110)
        col = Math.max(rimL + KNOB / 2, Math.min(col, panL - KNOB_GAP - KNOB / 2));
        bx = who ? col : null;
        kx = col;
        const kh = BADGE; // (the knob's round body is the badge's size, X5)
        const stack = who ? BADGE + COL_GAP + kh : kh;
        by = y - stack / 2 + BADGE / 2;
        fy = who ? y + stack / 2 - kh / 2 : y;
      }
      const flameHi = S.track(S.add.image(x, y, "kit-flame-high").setDepth(D.item - 1).setAlpha(0));
      const flameLo = S.track(S.add.image(x, y, "kit-flame-low").setDepth(D.item - 1).setAlpha(0));
      const fs = outer / 245;
      flameHi.setScale(fs);
      flameLo.setScale(fs * 0.92);
      let face = null;
      if (who) {
        face = S.track(S.add.image(bx, by, Kit.badge(S, who)).setDisplaySize(BADGE, BADGE).setDepth(D.item + 1));
        face.baseScale = face.scaleX;
      }
      const knob = S.track(S.add.container(kx, fy).setDepth(D.item + 1));
      const kOff = S.add.image(0, 0, "kit-knob-off").setDisplaySize(KNOB, KNOB);
      const kOn = S.add.image(0, 0, "kit-knob-on").setDisplaySize(KNOB, KNOB).setAngle(-90).setAlpha(0);
      knob.add([kOff, kOn]);
      const knobHit = S.track(S.add.circle(kx, fy, KNOB_HIT, 0xffffff, 0.001).setDepth(D.item + 2));
      knobHit.baseScale = 1;
      knob.setName("kit-knob");
      if (face) face.setName("kit-burner-face");
      const b = { i, x, y, face, knob, kOff, kOn, knobHit, flameHi, flameLo, state: "off", side: hob.knobs || "front" };
      /** Turn the knob: off, high (the big flame ring) or low (the small one). quiet: at once and silent (a station's start);
       *  silent: turned as usual but with no knob or flame sound (CHAI-100: the fire going off by itself after a pan's last pour) */
      b.set = (st, quiet = false, silent = quiet) => {
        const was = b.state;
        b.state = st;
        // high: a quarter turn (the bar upright); low: further round, the bar on the diagonal (29 Sept:
        // at 180 the H6 knob's bar lay flat again and "low" read as "off")
        const ang = { off: 0, high: 90, low: 135 }[st];
        const t = quiet ? 0 : 1;
        S.tweens.add({ targets: knob, angle: ang, duration: 260 * t + 1, ease: "Back.easeOut" });
        S.tweens.add({ targets: kOn, alpha: st === "off" ? 0 : 1, duration: 260 * t + 1 });
        S.tweens.add({ targets: flameHi, alpha: st === "high" ? 0.95 : 0, duration: 360 * t + 1 });
        S.tweens.add({ targets: flameLo, alpha: st === "low" ? 0.95 : 0, duration: 360 * t + 1 });
        // CHAI-92 (Zafar's picks, 6 Nov, lab/juice.html): the gas knob's click (knob A, was the tiny "click" SH-196 found too quiet),
        // and as it turns on from off, the flame catching 180 ms later (flame B)
        if (!silent) {
          Cook.sfx.knob();
          if (was === "off" && st !== "off") Cook.sfx.flame({ delay: 180 });
        }
      };
      if (state !== "off") b.set(state, true);
      return b;
    },


    /** The speaker icon, drawn at (x, y) about `s` px tall, in the charcoal text colour (the shared kit's: Shelf.P.speaker). */
    speaker(g, x, y, s, color = INK.text) {
      return global.Shelf.P.speaker(g, x, y, s, color);
    },

    /**
     * The shelf chip under an object (§4): `🔊 word`, one tappable chip; tap it = hear the word (the shared kit's pill:
     * Shelf.P.chip, js/shared/shelf.js; this keeps the kitchen's look: its font, its shadow and the room beside the word).
     * opts.word false: the speaker alone, the same size and place (higher levels). opts.w: its width.
     */
    chip(S, id, x, y, { word = true, w = CHIP.w, depth = D.item + 2 } = {}) {
      return keepBox(global.Shelf.P.chip(S, x, y, Cook.display(id), {
        word,
        w,
        depth,
        font: FONT(),
        weight: "800",
        pad: 52,
        shade: INK.shade,
        onTap: () => {
          Cook.unlockAudio();
          if (Cook.onLabel) Cook.onLabel(id);
          Cook.Lang.speakWord(id);
        },
      }));
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

  /*
   * THE WORKTOP AND THE STONE BAND (Sprint 18, module map piece 4: moved here from js/cook/station-lib.js, names kept).
   * ART-41 (Zafar, 5 Nov: "I like 1 ... this colour left and bottom panel and this ledge style ... add this"): the shelf band in his
   * pale warm-grey stone (pack s17-pc2's tile, assets/shared/panel/stone-tile-s17) and the stone shelf the jars stand on (its strip,
   * stone-shelf-s17: the top face, the front edge, a soft shadow), in place of the flat parchment band and the grey plank lines.
   * The band's stone colour is drawn at once (no blank frame); the tile and the shelf come in when loaded. One call for every
   * station that has the band. base: the line every object stands on.
   *   St.worktopWash()                          the worktop's wash colour (Zafar, 5 Nov: the white marble warmed to the stone's
   *                                             undertone, "they should just sing off each other"; Fable's study: alpha 0.18)
   *   Cook.Kit.worktop(S, {top, far, depth, alpha})   the wash drawn over the worktop, from far above to the band's top
   *   St.STONE                                  the stone's colour (a token), its tile and shelf pictures and their scales
   *   St.stoneBand(S, {top, base, far, depth, tray})  the band from top to the screen's foot, and the shelf at base
   * ART-69, SH-243 (Zafar, 9 Nov: "top down items in a tray and side on items on the shelf, and the tray is in the game space, kind of
   * sitting on the countertop"; Fable's stone, build/reports/s19-stone-tray-fable.md): a band of top-down things (tray: true; by
   * default a band with no base, no ledge, since nothing stands side-on on it) is the worktop carried down to the view's foot with the
   * shared stone tray on it (Shelf.P.tray: one honed limestone slab along the whole band, inset 3% from the view's sides, its lip, its
   * shadow), drawn at once with nothing to load; a band with a base keeps the stone band and its shelf exactly as before.
   */
  const St = Cook.Stations;
  St.worktopWash = () => { const T = global.Tokens; return (T && T.int && T.int("worktop-wash")) || (T && T.cookInk ? T.cookInk().page : 0); };
  St.STONE = { get mean() { const T = global.Tokens; return (T && T.int && T.int("stone")) || (T && T.cookInk ? T.cookInk().panel : 0); }, tile: "assets/shared/panel/stone-tile-s17.webp", shelf: "assets/shared/panel/stone-shelf-s17.webp", tileK: 0.5, shelfK: 0.35, faceDown: 14 };
  /*
   * SH-248 (Zafar, 10 Nov: "the decision about which bottom element each game uses, the stone tray or the vertical shelf, should be in
   * their game file design, but also in their actual code, so it pulls the shared element"): each game's settings file names its
   * bottom row, band "tray" (top-down things lie on the stone tray) or "shelf" (side-on things stand on the stone shelf); the game passes
   * game: <its key> and the band is read from there (docs/game-design/modes/cook-bottom-row.md; build/core/band.test.mjs).
   */
  St.bandOf = (game) => ((((Cook.data && Cook.data.settings) || {})[game] || {}).band) || null;
  St.stoneBand = function (S, { top, base, far = 2000, depth = 0, tray = base == null, alpha = 0.18, game = null }) {
    if (game) {
      const b = St.bandOf(game);
      if (b === "tray" || b === "shelf") tray = b === "tray";
      else if (global.console) console.warn(`St.stoneBand: ${game}'s settings name no band ("tray" or "shelf")`);
    }
    const ST = St.STONE;
    const W = 1600 + 2 * far;
    const SH = global.Shelf;
    if (tray && SH && SH.P && SH.P.tray && SH.trayInk && SH.trayInk()) {
      // (the worktop's wash carried on under the tray, as Kit.worktop draws it above: the slab sits on the same marble)
      S.track(S.add.rectangle(-far, top, W, 900 - top + far, St.worktopWash(), alpha).setOrigin(0).setDepth(D.bg + 1));
      const view = () => {
        const v = Cook.view || {};
        return { left: v.left != null ? v.left : 0, right: v.right != null ? v.right : 1600, bottom: v.bottom != null ? v.bottom : 900 };
      };
      return SH.P.tray(S, { top, view, depth });
    }
    const flat = S.track(S.add.graphics().setDepth(depth));
    flat.fillStyle(ST.mean, 1);
    flat.fillRect(-far, top, W, 900 - top + far);
    // (SAM-29: the band's 3 px top shade, over the tile and the shelf, once here for every game with the band)
    const shade = S.track(S.add.graphics().setDepth(depth + 0.05));
    shade.fillStyle(0x2a1a0a, 0.08);
    shade.fillRect(-far, top, W, 3);
    const A = Cook.Art;
    if (!A || !A.loadFile || !S.add.tileSprite) return flat;
    A.loadFile(S, "panel-stone", ST.tile).then((ok) => {
      if (!ok || !S.sys || !S.sys.isActive()) return;
      const t = S.track(S.add.tileSprite(-far, top, W, 900 - top + far, "panel-stone").setOrigin(0).setDepth(depth + 0.01));
      t.setTileScale(ST.tileK, ST.tileK);
    });
    if (base != null) {
      A.loadFile(S, "panel-shelf", ST.shelf).then((ok) => {
        if (!ok || !S.sys || !S.sys.isActive()) return;
        const src = S.textures.get("panel-shelf").getSourceImage();
        const h = src.height * ST.shelfK;
        const sh = S.track(S.add.tileSprite(-far, base - ST.faceDown, W, h, "panel-shelf").setOrigin(0).setDepth(depth + 0.02));
        sh.setTileScale(ST.shelfK, ST.shelfK);
      });
    }
    return flat;
  };
  Kit.worktop = (S, { top, far = 2000, depth = D.bg + 1, alpha = 0.18 } = {}) => S.track(S.add.rectangle(-far, -far, 1600 + 2 * far, top + far, St.worktopWash(), alpha).setOrigin(0).setDepth(depth));
  Kit.worktopWash = St.worktopWash;
  Kit.stoneBand = St.stoneBand;

  Cook.Kit = Kit;
})(window);

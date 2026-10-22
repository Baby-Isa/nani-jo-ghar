/*
 * Combined station: the Chai tray, v2 (docs/design-language/ui-design-system.md §4, §5, §10; the owner's logic).
 *
 * Everything is made in the PAN; nothing is made in the glass.
 *  - THE HOB (top left): a compact top-down hob with one burner per person (level 1: 1, then 2, 3;
 *    never an unused burner). Each burner holds that person's pan; their small face badge and the
 *    burner's knob sit on the hob's front edge, in front of it. Tap a pan (or its face: you hear them
 *    again) to work on it. Pans can be cooked in any order, or all at once: the child chooses the
 *    speed and the boil-over risk.
 *  - THE SHELF (the bottom 30%): identical slots grouped by kind: liquids (water bottle, milk
 *    carton) | jars (chai leaves, sugar) | spices (small identical jars: the extras and the salt
 *    that looks like sugar). Under each object one `🔊 word` chip: tap the object = use it (into the
 *    chosen pan), tap the chip = hear it. Once the child has used a word right the word hides and the
 *    speaker stays, the same size and place, from the next round (Cook.chipWord, Zafar, 20 Oct). When
 *    something goes in, its word pops by the pour or spoon and the family clip plays.
 *  - HEAT, per pan (as before): tap the knob to light it (water first); a ring round the pan fills
 *    like a clock and the chai darkens and rolls; tap the knob in the green to turn it down. Ignore
 *    it and it boils over (foam, a hand job (not scored)). Then the pan is ready.
 *  - THE TRAY (top right): a small square wooden tray with 4 round cut-outs, each person's face
 *    under theirs, quiet (dimmed) until a pan is ready. Tap a ready pan: it lifts, turns towards you and pours
 *    into its person's glass. At level 4 (half or full: adh / aako) one tap pours half, a second
 *    fills it; below that one tap fills it.
 * The focal rule (§3): the next generic step pulses (water, chai, the knob, a ready pan); what a
 * person asked for (milk or not, how many sugars, which extra) pulses only when Nani helps
 * (guided), since that pulse would be the answer. Inactive shelf things are dimmed about 10%.
 * Pills tick as each step closes (UX 11) on the person's card; every glass is judged at the tick
 * and in the end review (a wrong one is a recast: that person says again what they asked for).
 *
 * Data: the chai recipe's slots (who and what, by level) in data/cook.json; this station's own
 * settings in data/stations/chai-tray.json; the boil knobs in data.mechanics.boil (profile tray).
 * Art: the pan, from exactly above, is s08b's (assets/cook/items-s08b/chai-pan/: empty, milk chai, black tea; TOP below),
 * with v3's pictured stages of the brew (assets/cook/items/v3/chai/: water, leaves, the boils, the foam, the spices; 30 Sept,
 * C8 / X9, nothing drawn inside it) cut to its contents' circle; the same pan turns and pours (CHAI-26); the tray and
 * glasses are assets/cook/items/chai-v2/ (positions in its meta.json); the pantry-v2 jars; the hob, burners, knobs, flames and
 * heat ring are the shared kitchen kit's (js/cook/kitchen-kit.js).
 */
import { Cook as CookNS } from "../ns.js";
import { setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame } from "../life.js";
import { NjgPour } from "../../shared/pour.js"; // CHAI-26: the shared pour's plan and stream (SH-117)

(function (global) {
  const Cook = CookNS;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  const V2 = "assets/cook/items/chai-v2/";
  const V3 = "assets/cook/items/v3/chai/";
  // 30 Sept (C8 / X9): the pan's contents are pictures, one per stage of the brew, all on one registered
  // canvas (the rim's centre lines up in all nine), so they cross-fade on the burner without moving
  const PAN_LOOKS = ["empty", "water", "leaves", "tea", "milky", "spiced", "boil-tea", "boil-milky", "foam"];
  // what build/cut_chai_v2.py measured (kept here so the station needs no extra fetch)
  const META = {
    // the v3 pan (v3/chai/meta.json): cx, cy = the canvas's registration point, the rim's measured centre
    // (handle left out), the same in all nine pictures. body: the rim's own radius (the heat gauge sits on
    // it, inside the flames); rIn: the contents' radius (the bubbles stay inside it); r: the size it's drawn
    // at, 1.087 x the body as with v2's pan, so the flame and heat rings (sized to panR) peek out around it
    panTop: { w: 405, h: 389, cx: 0.3754, cy: 0.6146, r: 0.3525, rIn: 0.3012, body: 0.3243 },
    glassR: 0.94,
    // CHAI-08 (s08c GL1, s08 w7A): the glasses from exactly above (480 x 466): the rim's radius as a share of half the width
    glassR8: 0.98,
  };
  /*
   * CHAI-08 (s08c GL1, s08 w7A): one set of glasses from exactly above, empty, milky chai and black tea (the half glass: the
   * full one over the empty one at HALF8's strength, composed once in code from the two pictures).
   */
  const S8C = "assets/cook/items-s08c/";
  const HALF8 = 0.6;
  /*
   * CK-06 (the s08c redo, CP4 v2): the pan's brewing states (water coming to the boil, the leaves brewing, the milky chai at a
   * rolling boil) are CP4's pictures, each shown only inside this pan's contents circle (its own contents circle measured on
   * the cut: cx, cy, r source px; assets/cook/items-s08c/meta.json brew), in place of v3's (no drawn bubble rings).
   */
  const BREW8 = {
    water: { file: `${S8C}chai-pan/pan-water-s08c.webp`, w: 497, h: 307, cx: 161.5, cy: 150.5, r: 130 },
    leaves: { file: `${S8C}chai-pan/pan-leaves-s08c.webp`, w: 502, h: 308, cx: 160.5, cy: 148.5, r: 122 },
    "boil-milky": { file: `${S8C}chai-pan/pan-boil-milky-s08c.webp`, w: 508, h: 308, cx: 162.5, cy: 148.5, r: 122 },
  };
  /*
   * Sprint 11 (B-cook; Zafar, 22 Oct): the pour is coded from the one top-down pan (TOP below), never from tilt pictures
   * (the s08c three-quarter frames pan-tip-*-s08c.webp are dropped). phi: where the spout points while it pours (degrees,
   * 0 = right, 90 = down the screen); lipBack: how far up-left of the glass's middle the spout's tip holds (a share of the
   * glass); squash: how much a full tip narrows the pan along its spout-handle line (how a tilt looks from exactly above);
   * lift: how much bigger the lifted pan is drawn (nearer the eye).
   */
  const POUR = { phi: 38, lipBack: 0.46, squash: 0.16, lift: 1.07, milk: 0xd98d4c, black: 0x7a1a0a };
  // the handle's end from the contents' centre, in rim radii (the empty picture's), for the spacing of pans on the hob
  const HANDLE_REACH = (531 - 180.3) / 128;
  /* ---------- the grid (design px, 1600x900; the canvas is the play area) ---------- */
  const SHELF_TOP = St.SHELF.top; // §3: the scene is the top 70%, the shelf band the bottom 30% (SH-112)
  const FAR = 2000; // backgrounds reach past the design box (the stage fill: Cook.view)
  const BASE = 818; // the shelf line: every object stands on it
  const BOX = 128; // a slot's fallback box (a word without shelf art)
  // true relative heights (Zafar, 28 Sept, late): the bottle and carton stand tall, the chai and
  // sugar jars medium, the spice jars short, all on one shelf line (the scale per group of the
  // pantry-v2 canvases: liquids | jars | spices)
  // PAN-09 (S05-C): the small spice jars (elchi, aadu, lasan, loon) drawn as big as the band allows (St.shelfFit caps
  // them at its padding), so their contents read at phone size
  // SH-112 (Zafar 20 Oct: a taller band, bigger jars): the caps a third up; shelfFit keeps each to the band's rule
  const SHELF_K = [0.56, 0.44, 0.66];
  const PITCH = 172;
  const GROUP_GAP = 44;
  const CHIP = { w: 128, h: 46, y: 860, hitW: 142, hitH: 80 }; // the tap area: as big as the band allows
  const HOB_K = 0.79; // the mock-up's hob, 15% bigger (§10)
  const TRAY_D = 392;
  const GAP = 72;
  const PAN_R = 112; // a pan's outer rim, design px
  const BADGE = 64;
  const WELLS = [[0.283, 0.279], [0.717, 0.279], [0.283, 0.697], [0.717, 0.697]]; // the tray's cut-outs
  const WELL_D = 0.33;
  const COL = { water: St.WATER, chai: 0x8a4a22, milk: 0xf6f1e7, glass: 0xc98a52 };
  const INK = { text: "#2A2522", kutchi: "#8C2F2F", card: 0xffffff, grey: 0xd9d2c7, gold: 0xc9962e, panel: 0xefe5d6, page: 0xf4ecdf };
  const FONT = "Nunito, sans-serif";
  const jarUrl = (id) => `assets/cook/items/shelf-${id}-bare-f.webp`;
  // the small-jar family for every spice slot: the art run's jars with lids that differ (art.s02 "spice-jar-*", C5; the
  // ginger jar replaces the old one that read as gummies, C24) once they land, else the v2 jars
  const SPICE_JAR = { "veg-14": "assets/cook/items/shelf-veg-14-jar-f.webp", "veg-13": "assets/cook/items/shelf-veg-13-jar-f.webp" };
  const spiceJar = (id) => {
    const s02 = ((Cook.data.art || {}).s02 || {});
    const e = Object.keys(s02).map((k) => s02[k]).find((v) => v && v.ready && v.line === "C5" && v.word === id);
    return (e && e.file) || SPICE_JAR[id] || jarUrl(id);
  };
  /*
   * CHAI-08, CHAI-25, CHAI-26 (s08b CP2; Zafar 17 Oct, P57 and P59): the pan on the hob is the s08b pan from exactly above
   * (a spout on its left, the black handle on its right), in three pictures: empty, milk chai, black tea. It is the pan
   * that pours (never a different picture swapped in). Each picture is placed by its contents' circle, measured on the
   * cuts (cx, cy, source px: the rim's lower wall shows a little, so the circle sits up and left of the picture's middle);
   * rim is the rim's radius and inner the contents' (source px), lip the spout's tip from the centre. The three are one pan
   * on one registration, so they cross-fade in place; the handle is drawn again from the empty picture over every state
   * (the milk cut's handle is 9 px shorter). On the hob the pan sits exactly as drawn (turn 0, Sprint 11), its handle level
   * to the right; the pans are sized so a handle clears the next burner's pan (HANDLE_REACH).
   * The pour is this pan itself, coded (POUR above), never another picture.
   */
  const S8 = "assets/cook/items-s08b/chai-pan/";
  const TOP = {
    looks: {
      empty: { key: "s08b-pan-empty", file: `${S8}pan-top-empty-s08b.webp`, w: 531, h: 286, cx: 180.3, cy: 134.3 },
      milk: { key: "s08b-pan-milk", file: `${S8}pan-top-milk-s08b.webp`, w: 531, h: 286, cx: 169.3, cy: 134.3 },
      black: { key: "s08b-pan-black", file: `${S8}pan-top-black-s08b.webp`, w: 520, h: 286, cx: 143.3, cy: 134.3 },
    },
    rim: 128,
    inner: 117,
    lip: [-134, 4],
    // Sprint 11 (Zafar, 22 Oct): true top-down and centred on its burner: no turn (the handle level to the right)
    turn: 0,
    // the handle's wedge (degrees from the handle's own direction, from 0.86 of the rim out): redrawn over the heat ring
    handle: [-16, 12],
  };
  // each stage of the brew (C8, X9): the s08b picture under it and, where the s08b pan has no picture of that stage, the
  // v3 pan's own picture of it, cut to this pan's contents circle (pictures only, never drawn contents: ART-12, CK-06)
  const STAGE = { empty: ["empty"], water: ["empty", "water"], leaves: ["empty", "leaves"], tea: ["black"], milky: ["milk"], spiced: ["milk", "spiced"], "boil-tea": ["black", "boil-tea"], "boil-milky": ["milk", "boil-milky"], foam: ["milk", "foam"] };
  const DISCS = PAN_LOOKS.filter((k) => STAGE[k][1]);
  const RING = "chai-pan-ring";
  /*
   * Sprint 11 (the painted effects, pack s11; the coordinator, 22 Oct): splash (something lands in the pan or the glass:
   * CK-27's "it went in"), steam (the boil), sparkle (a finished, served glass). Brief and small over the motion on the real
   * art: scale in, fade out in about half a second. No code-drawn dots, rings or sparkles. (The shine is held back.)
   */
  const FX = "assets/shared/fx-s11/";
  const FX_SIZE = { splash: [158, 133], steam: [123, 181], sparkle: [138, 160] };
  const ART = [
    ["fx-s11-splash", `${FX}splash-s11.webp`],
    ["fx-s11-steam", `${FX}steam-s11.webp`],
    ["fx-s11-sparkle", `${FX}sparkle-s11.webp`],
    ["v2-tray", V2 + "tray-4-cutout-t.webp"],
    ["v2-glass-empty", `${S8C}glass/glass-empty-top-s08c.webp`],
    ["v2-glass-full", `${S8C}glass/glass-chai-top-s08c.webp`],
    // CHAI-31 (the judge, 22 Oct: "dark maroon in the pan but amber in the glass"): black tea's glass is the s08c set's own
    // black-tea glass, the pan's tea colour (the half glass composed as the milky one's)
    ["v2-glass-black-full", `${S8C}glass/glass-black-top-s08c.webp`],
  ]
    .concat(Object.values(TOP.looks).map((t) => [t.key, t.file]))
    .concat(DISCS.map((k) => [`v3-pan-${k}`, BREW8[k] ? BREW8[k].file : `${V3}pan-${k}.webp`]))
    .concat(...[1, 2, 3, 4].map((n) => Cook.Kit.art(n, []))) // the shared kitchen kit: hobs, knobs, flames
    .filter(([key], i, a) => a.findIndex(([k2]) => k2 === key) === i);

  // CHAI-14 / CHAI-07 (C9): a cup with no milk is black tea, in the pan, the stream and the glass. The art run's glasses
  // (art.s02) replace the stand-in: until then the glass is tinted darker.
  const BLACK_ART = ["chai-glass-black-half", "chai-glass-black-full"];
  const BLACK = { stream: 0x7a3c16, tint: 0xc07a4c };
  // CHAI-22 (P33): milk, water and the leaves go in once each; a second tap wiggles
  const ONCE = { "cook-paani": "water", "cook-dudh": "milk", "cook-chai": "leaves" };
  // Sprint 11 (no Done): at L4 a cup poured half can take its second pour this long after the last pour, then it moves on
  const HALF_BEAT_MS = 2600;
  /** A test hook (only logged) for the contract checks (build/sandbox/lib/contract-chai.mjs): what the tray just did. */
  const note = (what, step, by) => {
    try {
      if (global.Lifecycle && global.Lifecycle.note) global.Lifecycle.note(what, { step: String(step), by: String(by) });
    } catch (e) {
      /* only a log */
    }
  };

  Mech.combined("chai-tray", {
    station: "chai-tray",
    view: "marble",
    dataFile: "data/stations/chai-tray.json",
    // one drawing space (1:1); the hob zone posts every expectation, the tray zone reports the glasses
    zones: [
      { id: "boil", mech: "boil", region: [0, 0, 1600, 900], footprint: { x: 0, y: 0, w: 1600, h: 900 } },
      { id: "tray", mech: "pour", region: [0, 0, 1600, 900], footprint: { x: 0, y: 0, w: 1600, h: 900 } },
    ],
    run: (host, params) => station(host, params),
  });

  /** Show one of the s08b pan's pictures on an image, placed by that picture's own registration point (its contents' circle). */
  function look8(im, key) {
    const t = TOP.looks[key];
    if (im.texture.key !== t.key) im.setTexture(t.key);
    return im.setOrigin(t.cx / t.w, t.cy / t.h);
  }
  const nameOf = (who) => (who === "nani" ? "Nani" : (Cook.data.customers[who] || {}).name || who);
  /** A person's face badge (the kitchen kit's). */
  const roundBadge = (S, who) => Cook.Kit.badge(S, who);
  /** This dish's ladder on the mission card (or one built from the cups). */
  function ladderOf(ctx, cups) {
    const Ls = UI.mission.ladders();
    const L = Ls.find((x) => x.recipe === "chai" && x.dish === (ctx.dishAt || 0)) || Ls.find((x) => x.recipe === "chai");
    return L || Cook.Order.ladder({ recipe: "chai", cups }, 0);
  }
  const personRows = (L, who) => {
    const s = L.sections.find((x) => x.for === who);
    return s ? [].concat(...s.groups) : [];
  };
  // a person's own headline ("Muke kari chai khape.") in place of the order's
  const personHead = (L, who) => (L.sections.find((x) => x.for === who) || {}).head || L.head;
  // 29 Sept (X1): one sentence per person, in card order ("Muke aadu waari chai khape, with dudh, ba khun.")
  const personLine = (L, who, rows) => Cook.Order.sentence(personHead(L, who), rows || personRows(L, who), { join: Cook.Order.joinOf(L) });
  const hiddenRow = (r) => !r.unsaid && !r.done && !r.revealed && r.line.segs.some((s) => s.w && Cook.dotItem(s.w, Cook.roundLevel()));

  /** The speaker icon (the kitchen kit's). */
  const speaker = (g, x, y, sz, color) => Cook.Kit.speaker(g, x, y, sz, color);

  async function station(host, params) {
    const S = host.S;
    const ctx = host.ctx;
    const K = host.knobs;
    const zb = host.zones.boil;
    const zt = host.zones.tray;
    const guided = !!ctx.guided;
    const level = zb.level;
    const people = (params.cups || []).slice(0, 4);
    const n = Math.max(1, people.length);
    const kBoil = Mech.knobs("boil", { level: K.boilLevel || level, profile: "tray" });
    const kCount = Mech.knobs("count", { level });
    const halves = people.some((p) => p.amount); // level 4: half or full
    // CK-49 (the level table): the spice row is what the cups ask for and 1, 2, 3, 3 decoys (a lookalike among them at L4,
    // sugar's lookalike counts), at most five jars (the shelf's slots narrow to fit)
    // (the salt, sugar's lookalike, is always the first decoy: the lab's #mistake tries it, CHAI-04)
    const askedX = [...new Set(people.map((p) => p.extra).filter(Boolean))];
    const SALT = "spi-16";
    const spicePool = (K.extras || []).concat(K.decoys || []).filter((id, i, a) => a.indexOf(id) === i && id !== SALT);
    const nSpice = Math.max(1, Math.min(Cook.levelRow(level).decoys, 5 - askedX.length));
    const spiceIds = Cook.shuffle(askedX.concat(SALT, St.tableDecoys(spicePool, askedX.concat(SALT), level, { n: nSpice - 1, also: 1, alsoLook: true, what: "spices" })));
    const shelfIds = [["cook-paani", "cook-dudh"], ["cook-chai", "cook-khun"], spiceIds];
    // real-time cap (St.loadArt): a Cook.wait cap shrank at test speed and the faces, tip frames and glasses missed it
    // (Phaser's green missing-texture box where Nana's face goes, the pan never tipping: CHAI-25, CK-04, CK-13, CHAI-08)
    await St.loadArt(
      S,
      ART.concat(
        St.artLoad(BLACK_ART.concat("teaspoon", "teaspoon-empty", "teaspoon-chai")), // the black-tea glasses; CHAI-13: TP1's three teaspoons
        people.flatMap((p) => Cook.Kit.faceArt(p.who)),
        [].concat(...shelfIds).map((id) => [`jar-${id}`, spiceJar(id)])
      )
    );
    // CHAI-08: the half glasses (milky and black): the full picture over the empty one at HALF8 (two pictures, composed once)
    const half8 = (key, fullKey) => {
      if (!S.textures.exists("v2-glass-empty") || !S.textures.exists(fullKey)) return;
      if (S.textures.exists(key)) S.textures.remove(key);
      const e = S.textures.get("v2-glass-empty").getSourceImage();
      const f = S.textures.get(fullKey).getSourceImage();
      const ct = S.textures.createCanvas(key, e.width, e.height);
      const g = ct.getContext();
      g.drawImage(e, 0, 0);
      g.globalAlpha = HALF8;
      g.drawImage(f, 0, 0, e.width, e.height);
      ct.refresh();
    };
    half8("v2-glass-half", "v2-glass-full");
    /*
     * CHAI-31 (the judge, 22 Oct: "dark maroon-brown in the pan, light golden amber in the glass"): one chai colour per brew.
     * The served glass is what must look like real chai, so the glass's own tea is measured (its middle, on the picture) and
     * the pan's tea is recoloured to it, its own light and shade kept (a copy of each pan picture made once, in code); the
     * stream is drawn in the same colour. Milky chai and black tea each have their own.
     */
    const teaOf = (key) => {
      try {
        const src = S.textures.get(key).getSourceImage();
        const cv = document.createElement("canvas");
        cv.width = src.width;
        cv.height = src.height;
        const g = cv.getContext("2d", { willReadFrequently: true });
        g.drawImage(src, 0, 0);
        const d = g.getImageData(0, 0, cv.width, cv.height).data;
        let n = 0;
        const sum = [0, 0, 0];
        const r0 = cv.width * 0.3;
        for (let y = 0; y < cv.height; y += 2)
          for (let x = 0; x < cv.width; x += 2) {
            if (Math.hypot(x - cv.width / 2, y - cv.height / 2) > r0) continue;
            const i = (y * cv.width + x) * 4;
            if (d[i + 3] < 200 || d[i] - d[i + 2] < 40) continue;
            sum[0] += d[i];
            sum[1] += d[i + 1];
            sum[2] += d[i + 2];
            n++;
          }
        return n ? sum.map((v) => v / n) : null;
      } catch (e) {
        return null;
      }
    };
    const TEA = { milk: teaOf("v2-glass-full"), black: teaOf(S.textures.exists("v2-glass-black-full") ? "v2-glass-black-full" : "v2-glass-full") };
    const hexOf = (c) => (Math.round(c[0]) << 16) | (Math.round(c[1]) << 8) | Math.round(c[2]);
    const recolour = (name) => {
      const t = TOP.looks[name];
      const tea = TEA[name];
      t.base = t.base || t.key;
      if (!tea || !S.textures.exists(t.base)) return;
      const key = `${t.base}-tea`;
      if (S.textures.exists(key)) S.textures.remove(key);
      const src = S.textures.get(t.base).getSourceImage();
      const ct = S.textures.createCanvas(key, src.width, src.height);
      const g = ct.getContext();
      g.drawImage(src, 0, 0);
      const img = g.getImageData(0, 0, src.width, src.height);
      const d = img.data;
      const inside = (x, y) => Math.hypot(x - t.cx, y - t.cy) <= TOP.inner * 1.04;
      const lum = (i) => 0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2];
      // the pan's own tea: its mean brightness, so its shading is kept around the glass's colour
      let n = 0;
      let L = 0;
      for (let y = 0; y < src.height; y++)
        for (let x = 0; x < src.width; x++) {
          const i = (y * src.width + x) * 4;
          if (d[i + 3] > 0 && inside(x, y) && d[i] - d[i + 2] > 40) {
            L += lum(i);
            n++;
          }
        }
      if (!n) return;
      L /= n;
      for (let y = 0; y < src.height; y++)
        for (let x = 0; x < src.width; x++) {
          const i = (y * src.width + x) * 4;
          if (!(d[i + 3] > 0 && inside(x, y) && d[i] - d[i + 2] > 40)) continue;
          // (x1.2: the glass's tea is measured with its light in it; the pan's surface reads the same at that)
          const k = Math.min(1.5, Math.max(0.65, (lum(i) / L) * 1.2));
          d[i] = Math.min(255, tea[0] * k);
          d[i + 1] = Math.min(255, tea[1] * k);
          d[i + 2] = Math.min(255, tea[2] * k);
        }
      g.putImageData(img, 0, 0);
      ct.refresh();
      t.key = key;
    };
    ["milk", "black"].forEach(recolour);
    if (TEA.milk) POUR.milkTea = hexOf(TEA.milk.map((v) => v * 0.92));
    if (TEA.black) POUR.blackTea = hexOf(TEA.black.map((v) => v * 0.92));
    POUR.edge = 0x5a2408;
    half8("v2-glass-black-half", "v2-glass-black-full");
    if (St.hasArt(S, "chai-glass-black-full")) half8(St.artKey("chai-glass-black-half"), St.artKey("chai-glass-black-full"));
    let lastPhase = null;
    const steps = St.steps(ctx);
    /*
     * S02-B (T8-T10): the box is the next step, one line at a time. water -> tea -> Chulo bar! -> (at the green)
     * Slow kar! -> for the chosen pan, "{item}. Wiji chad!" (a hidden item: [the next thing]) -> pour. Nothing to do
     * (waiting on the heat): the box is empty.
     */
    const stepLine = (key, id) => {
      // s08 w2A (SH-110): the step names the thing (Nani calls it as it opens); her box dots it where the card does (hideKnown)
      if (key === "cups" && id) return St.addLine(id);
      return St.guideLine(key === "slow" ? "chai-tray:slow" : `chai-tray:${key}`);
    };
    let lastGist = null;
    const phase = (key, id) => {
      const sid = key ? `${key}:${id || ""}` : null;
      if (sid === lastPhase) return;
      lastPhase = sid;
      if (!key) {
        steps.done();
        // CHAI-31 (the judge: "Pour it into their glass." still up once all is served): every cup poured, nothing is left
        // to do, so her box goes empty (R2; SH-63's host clear)
        if (pans.length && pans.every((q) => q.poured > 0) && UI.guideClear) UI.guideClear();
        return;
      }
      steps.to(key, { id: sid, line: stepLine(key, id) });
      if (key === lastGist) return;
      lastGist = key;
      const text = ((Cook.data.stations["chai-tray"] || {}).phases || {})[key];
      Cook.save.seenStation = Cook.save.seenStation || {};
      const seenKey = `chai-tray:${key}`;
      if (text && (guided || ctx.lab || !Cook.save.seenStation[seenKey])) UI.gist(text);
      Cook.save.seenStation[seenKey] = true;
    };

    /* ---------- the scene: the softened marble, the shelf band ---------- */
    // §7: soften the marble so it doesn't compete with the objects
    // (drawn past the design box: the stage fill shows more worktop above and at the sides, Cook.view)
    S.track(S.add.rectangle(-FAR, -FAR, 1600 + 2 * FAR, SHELF_TOP + FAR, INK.page, 0.5).setOrigin(0).setDepth(D.bg + 1));
    const band = S.track(S.add.graphics().setDepth(D.bg + 1.2));
    band.fillStyle(INK.panel, 1);
    band.fillRect(-FAR, SHELF_TOP, 1600 + 2 * FAR, 900 - SHELF_TOP + FAR);
    band.fillStyle(0x2a1a0a, 0.08);
    band.fillRect(-FAR, SHELF_TOP, 1600 + 2 * FAR, 3);
    band.fillStyle(INK.grey, 1);

    /* ---------- the hob: one burner per person ---------- */
    const hobW = Cook.Kit.HOB.w[n - 1];
    const hobH0 = Cook.Kit.HOB.h[n - 1];
    // the widest scale that fits the hob and the tray (which shrinks with the hob) in the row
    const room = 1600 - 2 * 56 - GAP;
    const k0 = Math.min(HOB_K, room - TRAY_D >= hobW * HOB_K ? HOB_K : Math.max((room - TRAY_D) / hobW, room / (hobW + hobH0 * 0.78)));
    // CHAI-08 (v2 mock-up, S05-C): hob and tray about 15% bigger and lower, where the row and the stage's height allow
    // (a taller stage's extra worktop goes into size, not into empty marble under the hob)
    const ey = (Cook.view && Cook.view.ey) || 0;
    const SHELF_GAP = 28;
    const k = Math.max(k0, Math.min(k0 * 1.15, room / (hobW + hobH0 * 0.78), (SHELF_TOP + ey - SHELF_GAP - 40) / hobH0));
    const hobH = hobH0 * k;
    let trayD = Math.min(TRAY_D * (k / k0), hobH * 0.78);
    // Sprint 11 (turn 0): each pan's handle lies level to the right, so a pan is sized to clear the next one's rim with its
    // handle (a rim's radius is 0.92 of panR: META.panTop), and the last pan's handle reaches past the hob's right edge:
    // the gap to the tray grows by that much (the tray a little smaller where the row is full)
    const HS = Cook.Kit.HOB.sets[n];
    const pitch0 = n > 1 ? (HS.burners[1][0] - HS.burners[0][0]) * hobW * k : Infinity;
    const panR0 = Math.min(Math.min(PAN_R, pitch0 * 0.4) * (k / HOB_K), (pitch0 - 12) / (0.92 * (HANDLE_REACH + 1)));
    const over = Math.max(0, HS.burners[n - 1][0] * hobW * k + panR0 * 0.92 * HANDLE_REACH + 14 - hobW * k);
    const gap = GAP + Math.max(0, over - GAP * 0.5);
    trayD = Math.min(trayD, Math.max(TRAY_D * 0.72, 1600 - 2 * 48 - hobW * k - gap));
    const total = hobW * k + gap + trayD;
    const hobX = Math.max(48, (1600 - total) / 2);
    // low (§10), just above the shelf; raised only a little into a taller stage's worktop
    const hobY = Math.max(-ey + 40, SHELF_TOP - SHELF_GAP - hobH - Cook.lift(0.2));
    // the shared kitchen kit's hob: one burner per person (the burner rule)
    const kHob = Cook.Kit.hob(S, { n, x: hobX, y: hobY, k });
    const hob = kHob.img;
    const burners = kHob.burners.map((b) => b.x);
    const pitch = kHob.pitch;
    const panR = Math.min(Math.min(PAN_R, pitch * 0.4) * (k / HOB_K), (pitch - 12) / (0.92 * (HANDLE_REACH + 1)));

    /* ---------- the tray: 4 cut-outs, a face under each one used ---------- */
    const trayX = hobX + hobW * k + gap;
    const trayY = hobY + (hobH - trayD) / 2 - 8;
    const tray = S.track(S.add.image(trayX, trayY, "v2-tray").setOrigin(0).setDepth(D.item - 4));
    tray.setDisplaySize(trayD, (trayD * 754) / 768);
    tray.shadow = S.contactShadow(tray);
    const trayQuiet = S.track(S.add.rectangle(trayX, trayY, trayD, (trayD * 754) / 768, INK.page, 0.42).setOrigin(0).setDepth(D.item + 1.1));

    /* ---------- one pan per person ---------- */
    const pm = META.panTop;
    // the drawn size as before (panR: the flame and heat rings are sized to it); the s08b rim is drawn the v3 rim's size
    const rimR = pm.body * pm.w * (panR / (pm.r * pm.w));
    const s8 = rimR / TOP.rim; // the s08b pictures' scale
    const rIn = TOP.inner * s8;
    // the v3 contents' pictures, cut to this pan's contents circle: their own contents' radius a little past it
    const discScale = (rIn * 1.03) / (0.3037 * pm.w);
    // a brew picture on the pan: CP4's by its own contents circle (CK-06), v3's by its registration
    const regDisc = (im, k) => {
      const b = BREW8[k];
      return b ? im.setOrigin(b.cx / b.w, b.cy / b.h).setScale((rIn * 1.03) / b.r) : im.setOrigin(pm.cx, pm.cy).setScale(discScale);
    };
    // where a pan's heat ring is (the gauge's place for the test hook __cook.gauge().box; s04-hooks): the ring and its track
    const ringAt = (pan) => ({ x: pan.x, y: pan.y, r: rimR + 10 });
    // CHAI-25 (P57): the pan's highlight is a ring on the rim's centre (never the picture's box with its handle)
    if (!S.textures.exists(RING)) {
      const g = S.make.graphics({ add: false });
      g.lineStyle(9, 0xffe2a6, 1);
      g.strokeCircle(TOP.rim + 16, TOP.rim + 16, TOP.rim + 4);
      g.generateTexture(RING, 2 * TOP.rim + 32, 2 * TOP.rim + 32);
      g.destroy();
    }
    const pans = people.map((p, i) => {
      const x = burners[i];
      const y = kHob.burners[i].y;
      // the kit's burner: the flame ring peeking out under the pan; their face (= hear them) and the knob on the front edge
      // the flames peek just past the rim, as in the approved mock-up (29 Sept: at panR two burners' flames met)
      const b = Cook.Kit.burner(S, kHob, i, { who: p.who, flameR: rimR * 0.97 });
      const { face, knob, kOff, kOn, knobHit, flameHi, flameLo } = b;
      // the pan is its own contents' picture (C8): `img` (an s08b picture) and `disc` (a v3 contents picture over it, where
      // that stage has one) show one stage, `mix` and `mixDisc` the next one fading in over it
      const top8 = (key, depth) => look8(S.track(S.add.image(x, y, TOP.looks[key].key)), key).setScale(s8).setAngle(TOP.turn).setDepth(depth);
      const img = top8("empty", D.item);
      img.baseScale = s8;
      img.shadow = S.contactShadow(img, { centerX: x, centerY: y + panR * 0.08, width: panR * 2.15, height: panR * 2.15 });
      const discMask = (() => {
        const mg = S.make.graphics({ add: false });
        mg.fillStyle(0xffffff, 1);
        mg.fillCircle(x, y, rIn);
        return mg.createGeometryMask();
      })();
      const disc8 = (depth) => regDisc(S.track(S.add.image(x, y, `v3-pan-${DISCS[0]}`)), DISCS[0]).setDepth(depth).setVisible(false).setMask(discMask);
      const disc = disc8(D.item + 0.02);
      const mix = top8("empty", D.item + 0.05).setAlpha(0);
      const mixDisc = disc8(D.item + 0.07);
      const layers = { mix, disc, mixDisc };
      // the glow's ring (CHAI-25), shown only while the pan is the next thing
      // (under the simmer and over the spoonfuls; the canvas renderer's halo, half a layer under it, lies under the pan)
      const glowRing = S.track(S.add.image(x, y, RING).setScale(s8).setDepth(D.item + 0.45).setVisible(false));
      // CHAI-12 (C19): the handle stays fully opaque OVER the heat ring: the pan's handle is drawn again above the ring,
      // masked to its wedge (the empty picture's, the same in every state)
      const handle = top8("empty", D.fx - 1.9);
      {
        const mg = S.make.graphics({ add: false });
        const pts = TOP.handle.map((d) => d + TOP.turn).flatMap((deg, k) => {
          const t = (deg * Math.PI) / 180;
          // (from just past the contents: the empty picture never covers the chai)
          const inner = { x: x + Math.cos(t) * rIn * 1.03, y: y + Math.sin(t) * rIn * 1.03 };
          const outer = { x: x + Math.cos(t) * rimR * 3, y: y + Math.sin(t) * rimR * 3 };
          return k ? [outer, inner] : [inner, outer];
        });
        mg.fillStyle(0xffffff, 1);
        mg.fillPoints(pts, true);
        handle.setMask(mg.createGeometryMask());
      }
      layers.handle = handle;
      // SH-32 (S05-C): what was spooned in shows in the pan (sugar heaps, elchi pods) until it boils in
      const bits = S.track(S.add.graphics().setDepth(D.item + 0.3));
      layers.bits = bits;
      const bubbles = S.track(S.add.graphics().setDepth(D.item + 0.5));
      const heatRing = Cook.Kit.heatRing(S);
      const sel = S.track(S.add.graphics().setDepth(D.item - 0.5));
      const selRing = S.track(S.add.graphics().setDepth(D.item + 0.95));
      const pan = {
        i, p, who: p.who, x, y, img, mix, disc, mixDisc, glowRing, shown: "empty", layers, bits, bubbles, ring: heatRing.g, heatRing, burner: b, sel, selRing, face, knob, kOff, kOn, knobHit, flameHi, flameLo,
        level: 0, has: { water: 0, leaves: 0, milk: 0 }, sugar: 0, salt: 0, extras: [],
        heat: 0, state: "cold", poured: 0, closed: false, spoonsClosed: false, look: 0,
      };
      // what Cook.Spoon aims at: a vessel with a rim and a surface
      pan.vessel = { active: true, rim: { x, y, rx: rIn, ry: rIn, depth: 0 }, rimRx: rIn, rimRy: rIn, surface: () => ({ x, y }) };
      // CHAI-13: the stirring teaspoon is wet with milky chai once there is milk, else the clean wet steel (water, black tea)
      pan.vessel.spoonWet = () => (pan.has.milk > 0 ? "chai" : "empty");
      img.panOf = pan;
      return pan;
    });
    const wells = people.map((p, i) => {
      const [fx, fy] = WELLS[i];
      const wx = trayX + fx * trayD;
      const wy = trayY + fy * ((trayD * 754) / 768);
      const d = (WELL_D * trayD) / META.glassR8;
      const glass = {};
      // (CHAI-08: 480 x 466, the rim from exactly above filling the cut-out)
      ["empty", "half", "full"].forEach((st) => (glass[st] = S.track(S.add.image(wx, wy, `v2-glass-${st}`).setDisplaySize(d, (d * 466) / 480).setDepth(D.item + 0.5).setAlpha(st === "empty" ? 1 : 0))));
      // CHAI-18 (S05-C): the orderer's face on the tray's rim beside their glass (the outer rim, level with the cut-out),
      // never over the cup
      const left = fx < 0.5;
      const fd = Math.min(46, trayD * 0.11);
      // CK-30 (S05-C3): its centre at least its radius in from the tray's edge, so it never hangs half off the tray
      const inset = Math.max(0.058 * trayD, fd / 2 + 6);
      const face = S.track(S.add.image(left ? trayX + inset : trayX + trayD - inset, wy, roundBadge(S, p.who)).setDisplaySize(fd, fd).setDepth(D.item + 1));
      return { x: wx, y: wy, glass, face, fill: 0 };
    });
    pans.forEach((pan, i) => (pan.well = wells[i]));
    // for the screenshot script (build/shoot_chai_v2.py): each pan's state; harmless when unused
    // (the test hook focus, flow.js: the pan in hand, its handle and the spoon's stir round it; CHAI-13's filmstrip)
    Cook.focusBox = () => {
      if (!sel || !sel.img || !sel.img.active) return null;
      const b = sel.img.getBounds();
      const m = Math.max(b.width, b.height) * 0.12;
      return { x: b.x - m, y: b.y - m * 2, w: b.width + m * 2, h: b.height + m * 3 };
    };
    Cook.chaiPans = () => pans.map((q) => ({ who: q.who, state: q.state, heat: q.heat, lo, hi, milk: q.has.milk > 0, leaves: q.has.leaves > 0, extras: q.extras.length, shown: q.shown, poured: q.poured }));

    /* ---------- the shelf: identical slots, grouped, a chip under each ---------- */
    const slotsN = shelfIds.reduce((a, g) => a + g.length, 0);
    // (nine jars at L3-L4: the slots narrow so the row stays clear of the tick)
    const slotW = Math.min(PITCH, (1600 - 190 - 80 - (shelfIds.length - 1) * GROUP_GAP) / slotsN);
    const width = slotsN * slotW + (shelfIds.length - 1) * GROUP_GAP;
    const x0 = Math.max(40, (1600 - 190 - width) / 2); // clear of the tick, bottom right
    const shelf = {};
    let sx = x0 + slotW / 2;
    const plank = S.track(S.add.graphics().setDepth(D.bg + 1.3));
    shelfIds.forEach((group, gi) => {
      plank.fillStyle(INK.grey, 1);
      plank.fillRoundedRect(sx - slotW / 2 + 10, BASE - 2, group.length * slotW - 20, 10, 5);
      // 29 Sept (X7): the band's padding rule (St.shelfFit): the group's tallest thing, hop included, keeps the top gap
      const K = Math.min(...group.map((id) => St.shelfFit(S, `jar-${id}`, SHELF_K[gi], BASE)));
      group.forEach((id) => {
        shelf[id] = slot(id, sx, K);
        sx += slotW;
      });
      sx += GROUP_GAP;
    });
    // where a canvas's picture ends at the bottom (its transparent margin stands below the shelf line)
    function opaqueBottom(key) {
      try {
        const src = S.textures.get(key).getSourceImage();
        const cv = document.createElement("canvas");
        cv.width = src.width;
        cv.height = src.height;
        const g = cv.getContext("2d", { willReadFrequently: true });
        g.drawImage(src, 0, 0);
        const d = g.getImageData(0, 0, cv.width, cv.height).data;
        for (let y = cv.height - 1; y > 0; y--) for (let x = 0; x < cv.width; x += 2) if (d[(y * cv.width + x) * 4 + 3] > 60) return (y + 1) / cv.height;
      } catch (e) {
        /* a tainted texture: its canvas bottom */
      }
      return 1;
    }
    function slot(id, x, K) {
      const key = `jar-${id}`;
      let img;
      if (S.textures.exists(key)) {
        img = S.track(S.add.image(x, BASE, key).setOrigin(0.5, opaqueBottom(key)).setScale(K).setDepth(D.item + 1));
        img.baseScale = K;
        img.shadow = S.contactShadow(img, { centerX: x, centerY: BASE - 2, width: img.displayWidth * 0.8, height: 22 });
      } else img = S.ingredient(id, x, BASE - BOX / 2, { w: BOX, h: BOX, label: false });
      img.wordId = id;
      img.isJar = true;
      img.home = { x: img.x, y: img.y };
      // the chip: `🔊 word`, or the speaker alone once the word hides (same size, same place)
      // Zafar, 20 Oct: the word is written until the child has used it right, then the speaker alone (every level)
      const showWord = Cook.chipWord(id, ctx);
      const chip = S.track(S.add.container(x, CHIP.y).setDepth(D.item + 2));
      const bg = S.add.graphics();
      bg.fillStyle(0x28190a, 0.1);
      bg.fillRoundedRect(-CHIP.w / 2, -CHIP.h / 2 + 2, CHIP.w, CHIP.h, 12);
      bg.fillStyle(INK.card, 1);
      bg.fillRoundedRect(-CHIP.w / 2, -CHIP.h / 2, CHIP.w, CHIP.h, 12);
      chip.add(bg);
      const icon = S.add.graphics();
      if (showWord) {
        const t = S.add.text(0, 0, Cook.display(id), { fontFamily: FONT, fontSize: "25px", fontStyle: "800", color: INK.kutchi }).setOrigin(0, 0.5);
        const maxT = CHIP.w - 52;
        if (t.width > maxT) t.setScale(maxT / t.width);
        const w = 22 + 8 + t.displayWidth;
        speaker(icon, -w / 2 + 10, 0, 24);
        t.x = -w / 2 + 30;
        chip.add([icon, t]);
      } else {
        speaker(icon, 1, 0, 26);
        chip.add(icon);
      }
      chip.setSize(CHIP.hitW, CHIP.hitH);
      chip.setInteractive(new Phaser.Geom.Rectangle(-CHIP.hitW / 2, -CHIP.hitH / 2 + 8, CHIP.hitW, CHIP.hitH), Phaser.Geom.Rectangle.Contains);
      chip.on("pointerdown", (ptr, lx, ly, ev) => {
        if (ev && ev.stopPropagation) ev.stopPropagation();
        Cook.unlockAudio();
        if (Cook.onLabel) Cook.onLabel(id);
        Lang.speakWord(id);
        S.tweens.add({ targets: chip, scale: 1.08, duration: 90, yoyo: true });
      });
      img.chip = chip;
      return img;
    }

    /* ---------- state, selection, looks ---------- */
    let sel = null;
    let busy = 0; // a pour or a spoon in flight
    let talked = false;
    let finished = false;
    let glowing = null;
    let doneShown = false;
    let finishGen = 0;
    let finishUp;
    let doneP = new Promise((r) => (finishUp = r));
    const dishNo = () => ctx.dishAt || 0;
    const [lo, hi] = kBoil.band;

    // C8: which picture the pan shows: [the stage, the next one fading in over it, how far]. The leaves
    // steep to black tea as it heats; near the green it comes to the boil; past the green milky chai
    // foams up to the rim (the boil-over warning). Turned down, it settles (the simmer bubbles stay on top).
    const boilAt = lo - 0.12;
    const lookOf = (pan) => {
      const tea = pan.has.leaves > 0;
      const milk = pan.has.milk > 0;
      if (pan.poured >= 2 || !(pan.has.water > 0 || milk)) return ["empty", null, 0];
      // milk in before the leaves: no picture of milky water, so the milky chai half over the water
      if (!tea) return milk ? ["water", "milky", 0.5] : ["water", null, 0];
      const calm = milk ? (pan.extras.length ? "spiced" : "milky") : "tea";
      const h = pan.heat;
      if (pan.state === "ready") return [calm, null, 0];
      if (pan.state !== "heating" || h < boilAt) return milk ? [calm, null, 0] : ["leaves", "tea", Cook.clamp(h / boilAt, 0, 1)];
      const boil = milk ? "boil-milky" : "boil-tea";
      if (!milk || h <= hi) return [calm, boil, Cook.clamp((h - boilAt) / (lo - boilAt), 0, 1)];
      return ["boil-milky", "foam", Cook.clamp((h - hi) / (1 - hi), 0, 1)];
    };
    /*
     * SH-32: each spoonful lies on the pan's surface where it went (no invisible counters): a small heap of sugar (the
     * salt that looks like it, the same), an elchi pod, a little heap of any other spice; it sinks in as the pan comes
     * to the boil. Spots go round the middle by the golden angle, so heaps never stack on one another.
     */
    const drawBits = (pan) => {
      const g = pan.bits;
      if (!g || !g.active) return;
      g.clear();
      if (!(pan.has.water > 0 || pan.has.milk > 0)) return;
      const heaps = pan.sugar + pan.salt;
      const spot = (i) => {
        const a = i * 2.39996 - 0.6;
        const r = rIn * (0.22 + 0.2 * ((i * 0.618) % 1));
        return { x: pan.x + Math.cos(a) * r, y: pan.y + Math.sin(a) * r };
      };
      let i = 0;
      for (let k = 0; k < heaps; k++, i++) {
        const q = spot(i);
        // SH-32 (s08 w8A; the judge: "the pan's contents look the same" after each spoonful): a third bigger, on a darker
        // wet patch, so each spoonful reads at laptop size (it was a faint 15 px speck on the milky chai)
        const w = rIn * 0.32;
        // a small wet patch where it landed, then the mound: fine crystals, lit from the top left (a seeded scatter,
        // so the same spoonful looks the same every frame)
        g.fillStyle(0x5a3a1c, 0.26).fillEllipse(q.x + w * 0.05, q.y + w * 0.08, w * 1.05, w * 0.66);
        let seed = (i + 1) * 9301;
        const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
        for (let c = 0; c < 72; c++) {
          const a = rnd() * Math.PI * 2;
          const rr = Math.sqrt(rnd());
          const cx = q.x + Math.cos(a) * rr * w * 0.5;
          const cy = q.y + Math.sin(a) * rr * w * 0.3 - (1 - rr) * w * 0.08;
          const lit = Math.cos(a + 2.4) * 0.5 + 0.5;
          const col = lit > 0.6 ? 0xffffff : lit > 0.3 ? 0xf1ece2 : 0xd9d1c2;
          const sz = Math.max(1.4, w * (0.035 + rnd() * 0.03));
          g.fillStyle(col, 1).fillRect(cx - sz / 2, cy - sz / 2, sz, sz);
        }
      }
      // (an extra the pan's own picture already shows from the milky stage on: the spiced chai pictures its spices)
      if (pan.shown === "spiced" || pan.shown === "boil-milky" || pan.shown === "foam") {
        const h0 = pan.heat || 0;
        g.setAlpha(pan.state === "ready" ? 0 : pan.state === "heating" ? Cook.clamp(1 - (h0 - boilAt * 0.6) / (boilAt * 0.5), 0, 1) : 1);
        return;
      }
      pan.extras.forEach((id) => {
        const q = spot(i++);
        const pod = id === "spi-10" || /elchi|cardamom/i.test(String(Cook.english ? Cook.english(id) : ""));
        if (pod) {
          // two little green pods, ridged
          [[-0.05, 0, 0.5], [0.07, 0.05, -0.4]].forEach(([dx, dy, a]) => {
            const cx = q.x + dx * rIn, cy = q.y + dy * rIn, L = rIn * 0.17, W = rIn * 0.085;
            const pts = [];
            for (let t = 0; t < 16; t++) {
              const u = (t / 16) * Math.PI * 2;
              const px = Math.cos(u) * L * 0.5, py = Math.sin(u) * W * 0.5;
              pts.push({ x: cx + px * Math.cos(a) - py * Math.sin(a), y: cy + px * Math.sin(a) + py * Math.cos(a) });
            }
            g.fillStyle(0x6f8a3c, 1).fillPoints(pts, true);
            g.lineStyle(1.5, 0x4b6226, 1).strokePoints(pts, true);
            g.lineStyle(1, 0xa9c06e, 0.9).lineBetween(cx - Math.cos(a) * L * 0.3, cy - Math.sin(a) * L * 0.3, cx + Math.cos(a) * L * 0.3, cy + Math.sin(a) * L * 0.3);
          });
        } else {
          const col = St.heapColor(id, 0xb07a3a);
          const w = rIn * 0.22;
          g.fillStyle(0x3a2410, 0.2).fillEllipse(q.x + w * 0.06, q.y + w * 0.1, w, w * 0.6);
          g.fillStyle(col, 1).fillEllipse(q.x, q.y, w, w * 0.58);
        }
      });
      // it sinks in as the pan comes to the boil (the picture's own colour carries the spice from there)
      const h = pan.heat || 0;
      g.setAlpha(pan.state === "ready" ? 0 : pan.state === "heating" ? Cook.clamp(1 - (h - boilAt * 0.6) / (boilAt * 0.5), 0, 1) : 1);
    };
    // a stage on a pair of layers: the s08b picture, and the v3 contents' picture over it where the stage has one
    const disc = (im, k, alpha) => {
      if (!k || alpha <= 0) return im.setVisible(false);
      if (im.texture.key !== `v3-pan-${k}`) {
        regDisc(im.setTexture(`v3-pan-${k}`), k).setRotation(0); // CK-06 (CP4): its own contents circle
      }
      return im.setVisible(true).setAlpha(alpha);
    };
    const tex = (pan, stage, top, dsc, alpha) => {
      const [k8, kd] = STAGE[stage] || STAGE.empty;
      look8(top, k8);
      disc(dsc, kd, alpha);
    };
    // fade: { from, u } while something goes in (the last picture, then the new one over it)
    const setLook = (pan, fade) => {
      if (!fade && pan.fading) return; // something's going in: its fade has the picture (the heat tick waits)
      let [a, b, u] = lookOf(pan);
      if (fade && fade.u < 1 && fade.from !== a) [a, b, u] = [fade.from, a, fade.u];
      else if (!fade || fade.u >= 1) pan.shown = b && u >= 0.5 ? b : a;
      tex(pan, a, pan.img, pan.disc, 1);
      if (b) tex(pan, b, pan.mix, pan.mixDisc, u);
      else disc(pan.mixDisc, null, 0);
      pan.mix.setAlpha(b ? u : 0);
      drawBits(pan);
    };
    const fadeLook = (pan, from, ms = 450) => {
      pan.fading = true;
      S.tweens.addCounter({
        from: 0,
        to: 1,
        duration: ms,
        onUpdate: (tw) => setLook(pan, { from, u: tw.getValue() }),
        onComplete: () => {
          pan.fading = false;
          setLook(pan);
        },
      });
    };
    const drawSel = () =>
      pans.forEach((pan) => {
        pan.sel.clear();
        pan.selRing.clear();
        if (pan !== sel || n < 2 || pan.away) return;
        // the chosen pan: a warm pool of light under it, and a gold ring round its face
        for (let j = 0; j < 3; j++) {
          pan.sel.fillStyle(0xffd98a, 0.14);
          pan.sel.fillCircle(pan.x, pan.y, panR * (1.06 + j * 0.08));
        }
        pan.selRing.lineStyle(5, INK.gold, 1);
        pan.selRing.strokeCircle(pan.face.x, pan.face.y, BADGE / 2 + 4);
      });
    const select = (pan) => {
      if (sel && sel !== pan) {
        closeSpoons(sel);
        // level 4: moving on from a pan you've poured from closes it (half is the child's call)
        if (sel.poured > 0) closePan(sel);
      }
      sel = pan;
      // G1: the person whose pan is in hand keeps their card open on a short sidebar (the others fold to their headline)
      if (UI.mission.focus) UI.mission.focus(pan.who);
      drawSel();
      UI.hideCount();
      // SH-39 (D6): the running count sits on the pan in use, over its rim on the side away from the handle
      // (anchored by its right edge at the left of the rim; the word's bubble keeps clear of it (popAt): the DOM badge keeps
      // its size on a phone while the pan shrinks, S05-C3)
      if (UI.tallyAt) UI.tallyAt(tallyPt(pan), { anchor: "right" });
      if (pan.sugar) UI.count(pan.sugar, { speak: false, id: "cook-khun" });
      if (pan.salt) UI.count(pan.salt, { speak: false, id: "spi-16" });
      pan.extras.forEach((id) => UI.count(spoonsOf(pan, id), { speak: false, id }));
      refresh();
    };
    // (CK-TB-01: the badge shows each spice's spoonfuls, so one tap on it takes one back and the chip goes at none)
    const spoonsOf = (pan, id) => Math.max(1, (pan.spoons || []).filter((x) => x === id).length);
    const closeSpoons = (pan) => {
      if (!pan || pan.closed || pan.spoonsClosed || !(pan.sugar > 0)) return;
      pan.spoonsClosed = true;
      UI.mission.closeItem(["cook-khun"], dishNo(), { for: pan.who });
    };
    const closePan = (pan) => {
      closeSpoons(pan);
      if (pan.closed) return;
      pan.closed = true;
      UI.mission.closeItem([], dishNo(), { all: true, for: pan.who });
    };

    /*
     * s08 w6B (CHAI-19, CHAI-08 judges: "word pills ... sit on the hob's top rim above the left pan"): the count badge's point
     * (its bottom middle, js/shared/tally.js) is just over the pan's rim on the side away from the handle (SH-39), unless the
     * badge would then lie across the hob's top edge (two pans on a short stage: the pans reach almost to it); then it sits
     * wholly above the hob, on the worktop, its bottom a little clear of the edge.
     */
    // the hob's steel frame along its top: a pill whose top is less than this below the hob's top edge reads as sitting on the
    // rim (844x390 L3: a bubble 12 px inside the edge, on the frame), so it goes wholly above the hob instead
    const RIM_CLEAR = 40;
    const BADGE_CSS_H = 48; // the badge's height on screen, CSS px (js/shared/tally.js, phone and laptop alike)
    const pxPerWorld = () => UI.worldToScreen(1, 0).x - UI.worldToScreen(0, 0).x || 1;
    const tallyPt = (pan) => {
      const x = pan.x - panR * 0.7;
      const y = pan.y - panR * 1.02;
      const h = BADGE_CSS_H / pxPerWorld();
      return y - h < hobY + RIM_CLEAR ? [x, hobY - 10] : [x, y];
    };
    /* ---------- the word pop (§4: learning happens during the action) ---------- */
    // when each item's name was last said here (the pour says a row again only if its words weren't just said: an item's
    // name is never said twice within 10 s of the child's time, contract-23)
    const saidAt = {};
    const saidLately = (ids) => (ids || []).some((id) => saidAt[id] && Date.now() - saidAt[id] < 10000);
    const pop = (id, pan, { speak = true } = {}) => {
      const k = Math.max(1, Cook.Kit.textFloor(S, 36)); // never under 14px as rendered
      const c = S.track(S.add.container(0, 0).setDepth(D.fx + 3).setAlpha(0).setScale(k));
      const t = S.add.text(0, 0, Cook.display(id), { fontFamily: FONT, fontSize: "36px", fontStyle: "800", color: INK.kutchi }).setOrigin(0, 0.5);
      const w = 34 + 10 + t.width + 36;
      const g = S.add.graphics();
      g.fillStyle(0x28190a, 0.1);
      g.fillRoundedRect(-w / 2, -28 + 3, w, 56, 12);
      g.fillStyle(INK.card, 1);
      g.fillRoundedRect(-w / 2, -28, w, 56, 12);
      speaker(g, -w / 2 + 30, 0, 26);
      t.x = -w / 2 + 50;
      c.add([g, t]);
      const { x, y } = popAt(pan, w * k, 59 * k);
      const v = Cook.view || {};
      const drift = y - (59 * k) / 2 - 14 >= (v.top || 0) + 10 ? 14 : 0; // (CHAI-19: no room above, no drift up)
      c.setPosition(x, y + 14);
      S.tweens.add({ targets: c, alpha: 1, y, duration: 180, ease: "Back.easeOut" });
      S.tweens.add({ targets: c, alpha: 0, y: y - drift, delay: 1900, duration: 320, onComplete: () => c.destroy() });
      if (speak && !UI.naniMuted()) {
        Lang.popWord(id);
        saidAt[id] = Date.now();
      }
      return c;
    };
    /*
     * Sprint 11 (B-cook, task 7): the new effects are motion on the real art, never drawn dots, rings or sparkles. An item
     * lands: a small squash, a bounce back, and it settles. A side-on thing (a bottle back on the shelf) squashes on its
     * base; a top-down one (a pan set on its burner, a glass as it fills) dips towards the worktop and back. The sounds are
     * the shared soft ones (js/shared/sfx.js: pop, the glass's clink) and Cook's pour loop.
     */
    const land = (targets, { k = 0.07, top = false, ms = 320 } = {}) =>
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
    // a painted effect: w design px wide, scaled in, then faded out (ms in all), drifting up by rise; never blocks a tap
    const fx = (kind, x, y, { w = 90, ms = 520, rise = 0, depth = D.fx + 2 } = {}) => {
      const key = `fx-s11-${kind}`;
      if (!S.textures.exists(key)) return null;
      const k = w / FX_SIZE[kind][0];
      const im = S.track(S.add.image(x, y, key).setDepth(depth).setScale(k * 0.55).setAlpha(0));
      S.tweens.add({ targets: im, scale: k, alpha: 1, duration: ms * 0.3, ease: "Back.easeOut" });
      S.tweens.add({ targets: im, alpha: 0, y: y - rise, delay: ms * 0.3, duration: ms * 0.7, ease: "Sine.easeIn", onComplete: () => im.destroy() });
      return im;
    };
    const panLayers = (pan) => [pan.img, pan.mix, pan.disc, pan.mixDisc].filter((o) => o && o.visible);
    const soft = (name, volume = 0.5) => {
      try {
        if (global.Sfx && global.Sfx.play) global.Sfx.play(name, { volume });
      } catch (e) {
        /* never break the game for a sound */
      }
    };
    /** A client rect (the DOM's px) in the station's design px. */
    const toWorld = (sx, sy) => {
      const o = UI.worldToScreen(0, 0);
      const s1 = UI.worldToScreen(1, 0).x - o.x || 1;
      return { x: (sx - o.x) / s1, y: (sy - o.y) / s1 };
    };
    const badgeBox = () => {
      const el = document.querySelector("#count-badge");
      if (!el || el.classList.contains("empty") || el.classList.contains("hidden")) return null;
      const r = el.getBoundingClientRect();
      if (!(r.width > 0 && r.height > 0)) return null;
      const a = toWorld(r.left, r.top);
      const b = toWorld(r.right, r.bottom);
      return { x0: a.x, y0: a.y, x1: b.x, y1: b.y };
    };
    /*
     * CHAI-19 (P29, Zafar 17 Oct: "centered in line with the chai pan but just above it, so that when items get poured in
     * or put in they don't overlap or underlap the text"): the word's bubble is centred over the pan, just above its rim,
     * clear of the bottle or spoon over the pan; if the count badge (on the rim's upper left, SH-39) is there, above it,
     * and where the screen's top leaves no room for that, beside it on the right.
     */
    const popAt = (pan, W, H) => {
      const v = Cook.view || {};
      // (s08 w6B, CHAI-19: the camera's own view of the world is what shows; at 844x390 Cook.view.top sat level with the hob's
      // top and pushed the bubble back onto its rim)
      const wv = S.cameras && S.cameras.main && S.cameras.main.worldView;
      const top = (wv && wv.height ? wv.y : v.top || 0) + 10;
      const left = (v.left || 0) + 10;
      const right = (v.right || 1600) - 10;
      let x = pan.x;
      let y = pan.y - rimR - 16 - H / 2;
      // s08 w6B (CHAI-19): never across the hob's top edge: where the pan reaches almost to it, the bubble sits wholly above
      // the hob, centred on the pan
      const offRim = (v) => (v - H / 2 < hobY + RIM_CLEAR && v + H / 2 > hobY - 10 ? hobY - 10 - H / 2 : v); // (only ever up)
      if (y - H / 2 < hobY + RIM_CLEAR) y = hobY - 10 - H / 2;
      const bb = badgeBox();
      const hits = (cx, cy) => bb && cx - W / 2 < bb.x1 + 8 && cx + W / 2 > bb.x0 - 8 && cy - H / 2 < bb.y1 + 8 && cy + H / 2 > bb.y0 - 8;
      if (hits(x, y)) {
        // above the count badge, and still never across the hob's top edge (1366x768: the badge sits just under the edge)
        const above = offRim(Math.min(bb.y0 - 8 - H / 2, y));
        if (above - H / 2 - 14 >= top && !hits(x, above)) y = above;
        else x = bb.x1 + 8 + W / 2;
      }
      // (the room above a short stage's hob is tight: the bubble may come up to just under the view's top; it then fades
      // where it is, never drifting up: pop() below)
      y = Math.max(top + H / 2 + 2, y);
      x = Math.max(left + W / 2, Math.min(right - W / 2, x));
      return { x, y };
    };

    /* ---------- using the shelf: pour a bottle, or a spoonful ---------- */
    const pourInto = async (pan, obj, color, toLevel, look) => {
      // the bottle or carton lifts, tips over the pan (its cap is the spout) and pours
      busy++;
      obj.flying = true;
      refresh();
      const art = S.track(S.add.image(obj.x, obj.y, obj.texture.key).setOrigin(0.5, 1).setScale(obj.scaleX).setDepth(D.fx + 1));
      obj.setAlpha(0);
      if (obj.shadow) obj.shadow.setVisible(false);
      // (CHAI-19: it tips in from the pan's right, level with the rim's middle, under the word's bubble over the pan)
      const ox = pan.x + panR * 0.55;
      const oy = pan.y + panR * 0.05;
      art.setOrigin(0.5, 0.5);
      art.y = obj.y - obj.displayHeight / 2;
      await S.fly(art, ox, oy, { duration: 380, arc: 60 });
      await new Promise((r) => S.tweens.add({ targets: art, angle: -118, duration: 220, ease: "Sine.easeOut", onComplete: r }));
      const rad = Phaser.Math.DegToRad(art.angle);
      const cy0 = -0.44 * art.displayHeight;
      const cap = { x: art.x - Math.sin(rad) * cy0, y: art.y + Math.cos(rad) * cy0 };
      const stream = S.track(S.add.graphics().setDepth(D.fx));
      const from = pan.level;
      pan.fading = true;
      await new Promise((r) =>
        S.tweens.addCounter({
          from: 0,
          to: 1,
          duration: 620,
          onUpdate: (tw) => {
            const u = tw.getValue();
            stream.clear();
            stream.lineStyle(11, color, color === COL.water ? 0.55 : 0.95);
            stream.beginPath();
            stream.moveTo(cap.x, cap.y);
            stream.lineTo(pan.x + (cap.x - pan.x) * 0.15, pan.y);
            stream.strokePath();
            pan.level = from + (toLevel - from) * u;
            setLook(pan, { from: look, u });
          },
          onComplete: r,
        })
      );
      stream.destroy();
      pan.fading = false;
      setLook(pan);
      // (it went in: CK-27, the painted splash. CHAI-31: the splash is water's own, so only water shows it)
      if (color === COL.water) fx("splash", pan.x, pan.y, { w: rIn * 0.95 });
      await new Promise((r) => S.tweens.add({ targets: art, angle: 0, duration: 180, onComplete: r }));
      await S.fly(art, obj.x, obj.y - obj.displayHeight / 2, { duration: 320, arc: 40 });
      art.destroy();
      obj.flying = false;
      obj.setAlpha(1);
      if (obj.shadow) obj.shadow.setVisible(true);
      land(obj, { k: 0.06 }); // (back on the shelf: it settles)
      soft("tap", 0.35);
      busy--;
    };
    const spoonInto = async (pan, obj, id) => {
      refresh(); // the next step is known now (a spoon in flight never holds the plan up)
      await Cook.Spoon.spoon(zb, { bowl: obj, into: pan.vessel, word: id, ms: kCount.spoonMs });
    };
    const use = async (id) => {
      const pan = sel;
      const obj = shelf[id];
      if (!pan || finished || pan.poured > 0 || !obj || (busy && (id === "cook-paani" || id === "cook-dudh"))) {
        if (obj && !busy) S.wiggle(obj);
        return;
      }
      // CHAI-22 (P33): there is one of milk, water and tea in a pan: a second tap only wiggles (nothing goes in, no word)
      if (ONCE[id] && pan.has[ONCE[id]] > 0) {
        S.wiggle(obj);
        note("chai-add", id, `${pan.who}:${pan.has[ONCE[id]]}:again`);
        return;
      }
      // Sprint 11 (principle 4: "a count ends at the right number and an extra tap doesn't land"): at L1, where the card
      // counts along and the row turns gold at the count (CHAI-16), a spoonful past the number only wiggles the jar. Never
      // from L2 (the count is the child's to judge: tapping till it stops must not win, the leak test)
      if (level <= 1 && pan.p.khun > 0 && id === "cook-khun" && pan.sugar >= pan.p.khun) {
        S.wiggle(obj);
        pan.capped = true;
        note("chai-add", id, `${pan.who}:${pan.sugar}:capped`);
        refresh();
        return;
      }
      unglow();
      Cook.sfx.pop();
      const look = pan.shown;
      if (id === "cook-paani") {
        pop(id, pan);
        pan.has.water++;
        // CK-51: the water is on every cup's card (not said in the order): it ticks as it goes in
        if (!pan.closed) UI.mission.tickItem("cook-paani", dishNo(), { for: pan.who });
        note("chai-add", id, `${pan.who}:${pan.has.water}`);
        await pourInto(pan, obj, COL.water, Math.min(0.9, pan.level + (pan.level < 0.1 ? 0.62 : 0.12)), look);
      } else if (id === "cook-dudh") {
        pop(id, pan);
        pan.has.milk++;
        note("chai-add", id, `${pan.who}:${pan.has.milk}`);
        if (pan.p.dudh && !pan.closed) UI.mission.tickItem("cook-dudh", dishNo(), { for: pan.who });
        await pourInto(pan, obj, COL.milk, Math.min(1, pan.level + 0.22), look);
      } else if (id === "cook-khun") {
        if (pan.sugar >= (K.tallyMax || 6)) return;
        pan.sugar++;
        pan.spoons = (pan.spoons || []).concat(id);
        UI.count(pan.sugar, { id: "cook-khun" });
        if (Cook.Hands) Cook.Hands.count(S, pan.sugar);
        // CHAI-16 (D5, rule E11): at level 1 the counted row turns gold the moment the count is reached
        if (level <= 1 && pan.sugar === (pan.p.khun || 0)) closeSpoons(pan);
        pop(id, pan, { speak: false });
        await spoonInto(pan, obj, id);
        drawBits(pan);
        land(panLayers(pan), { k: 0.03, top: true, ms: 260 });
      } else {
        if (id === "cook-chai") {
          pan.has.leaves++;
          if (!pan.closed) UI.mission.tickItem("cook-chai", dishNo(), { for: pan.who }); // (CK-51: the tea row ticks too)
          note("chai-add", id, `${pan.who}:${pan.has.leaves}`);
        }
        else {
          pan.spoons = (pan.spoons || []).concat(id); // CK-TB-01: a spoonful that can be taken back
        }
        if (id === "spi-16") {
          // the salt that looks like sugar: it just goes in (UX 11); the end check finds it
          pan.salt++;
          UI.count(pan.salt, { speak: false, id });
          zb.listen(false, `added ${id}, not cook-khun, for ${nameOf(pan.who)}`);
        } else if (id !== "cook-chai") {
          if (!pan.extras.includes(id)) pan.extras.push(id);
          if (id === pan.p.extra && !pan.closed) UI.mission.tickItem(id, dishNo(), { for: pan.who });
          UI.count(spoonsOf(pan, id), { speak: false, id });
        }
        pop(id, pan);
        await spoonInto(pan, obj, id);
        drawBits(pan);
        land(panLayers(pan), { k: 0.03, top: true, ms: 260 }); // (the spoonful lands: the pan gives a little)
        // the leaves (or a spice) land: the next picture fades in
        if (id === "cook-chai" && pan.level < 0.05) pan.level = 0.12;
        fadeLook(pan, look);
      }
      refresh();
    };
    Object.keys(shelf).forEach((id) => {
      const o = shelf[id];
      if (id !== "cook-paani" && id !== "cook-dudh") o.handAction = "pinch";
      S.tappable(o, () => talked && !finished && use(id));
    });

    /* ---------- heat: each knob, each pan ---------- */
    const setKnob = (pan, state) => pan.burner.set(state);
    const knobTap = (pan) => {
      if (finished) return;
      if (pan.state === "cold") {
        if (!pan.has.water) {
          // nothing to heat yet: the knob won't turn, the water bottle hops
          S.wiggle(pan.knob);
          S.glow(shelf["cook-paani"], true, { bounce: true });
          S.time.delayedCall(1200, () => glowing !== shelf["cook-paani"] && S.glow(shelf["cook-paani"], false));
          return;
        }
        if (sel !== pan) select(pan);
        pan.state = "heating";
        setKnob(pan, "high");
        refresh();
      } else if (pan.state === "heating") turnDown(pan, false);
    };
    const turnDown = (pan, over) => {
      note("chai-down", pan.heat.toFixed(3), `${lo}/${hi}/${pan.who}`); // (contract-70)
      pan.state = "ready";
      pan.ring.clear();
      setKnob(pan, "low");
      if (over) {
        // boiled over: foam down the sides and onto the hob
        for (let j = 0; j < 12; j++) {
          const a = Math.random() * Math.PI * 2;
          const f = S.track(S.add.ellipse(pan.x + Math.cos(a) * panR * 0.9, pan.y + Math.sin(a) * panR * 0.9, 46, 32, 0xfff6e6, 1).setDepth(D.item + 0.6));
          S.tweens.add({ targets: f, x: f.x + Math.cos(a) * 40, y: f.y + Math.sin(a) * 30 + 20, scale: 1.6, alpha: 0.85, duration: 700, ease: "Bounce.easeOut" });
        }
        Cook.sfx.puff();
        zb.oops();
        zb.skill(kBoil.overScore, "boil");
        S.verdict(pan.x, pan.y - panR - 40, kBoil.overScore, { bad: "boiled-over" });
      } else {
        const score = S.bandScore(pan.heat, lo, hi);
        zb.skill(score, "boil");
        S.verdict(pan.x, pan.y - panR - 40, score, { bad: "too-early" });
      }
      pan.heat = Math.min(pan.heat, hi);
      setLook(pan);
      if (trayQuiet.alpha > 0) S.tweens.add({ targets: trayQuiet, alpha: 0, duration: 400 });
      refresh();
    };
    pans.forEach((pan) => {
      S.tappable(pan.knobHit, () => knobTap(pan));
      S.tappable(pan.img, () => panTap(pan));
      S.tappable(pan.face, () => {
        if (finished) return;
        if (sel !== pan) select(pan);
        hear(pan);
      });
      setLook(pan);
    });
    // the gauge rides on the pan's rim, inside the flames (29 Sept: at panR + 14 it sat on the flame tips)
    const drawRing = (pan) => pan.heatRing.draw(pan.x, pan.y, rimR, pan.heat, lo, hi);
    let last = performance.now();
    let steamT = 0;
    const stopHeat = S.addTick(() => {
      const now = performance.now();
      const dt = Math.min(0.1, (now - last) / 1000) * Cook.speed;
      last = now;
      steamT += dt;
      pans.forEach((pan) => {
        const bs = pan.well && pan.well.blackShade;
        if (bs) bs.setAlpha(Math.max(pan.well.glass.half.alpha, pan.well.glass.full.alpha));
        const hd = pan.layers && pan.layers.handle;
        if (hd) hd.setAlpha(pan.img.alpha).setScale(pan.img.scaleX, pan.img.scaleY);
        if (pan.state === "heating") {
          const was = pan.heat >= lo && pan.heat <= hi;
          // CHAI-10: twice as fast to the green; in the green it slows to half, so the turn-down keeps its old time
          pan.heat += kBoil.rate * (pan.heat >= lo ? 0.5 : 1) * dt;
          const inBand = pan.heat >= lo && pan.heat <= hi;
          if (inBand && !was) {
            Cook.sfx.click();
            refresh(); // CHAI-24: the turn-off line on the frame the bar enters the green (not the next nudge)
          }
          drawRing(pan);
          setLook(pan);
          if (pan.heat >= 1) turnDown(pan, true);
        }
        // bubbles as it nears the boil, a gentle simmer once it's ready
        pan.bubbles.clear();
        const hot = pan.state === "heating" ? Cook.clamp((pan.heat - 0.3) / (lo - 0.3), 0, 1.4) : pan.state === "ready" && pan.poured < 2 ? 0.35 : 0;
        if (hot > 0 && pan.level > 0.05) {
          // CK-06 (CP4 v2: "never drawn circles or rings"): no drawn bubbles; the pictured boil rolls (its picture turns slowly)
          const spin = 0.0025 * Math.min(1.4, hot);
          [pan.disc, pan.mixDisc].forEach((im) => im && im.visible && im.setRotation(im.rotation + spin));
          // the painted steam, now and then, off the far rim (never over the tea: CK-06), only near the boil
          if (steamT > 0.3 && hot >= 0.8 && Math.random() < 0.12 + hot * 0.1) fx("steam", pan.x + (Math.random() - 0.5) * rIn * 0.8, pan.y - rIn * 1.2, { w: rIn * 0.55, ms: 900, rise: rIn * 0.35, depth: D.fx - 2 });
        }
      });
      if (steamT > 0.3) steamT = 0;
      if (gaugePan && gaugePan.state === "heating") zb.gauge({ level: gaugePan.heat, lo, hi, at: ringAt(gaugePan) });
    });

    /* ---------- pouring: a ready pan tips into its person's glass ---------- */
    // the glass shows black tea (CHAI-14): the art run's glasses when they've landed, else the milk-tea glass darker
    const blackGlass = (w) => {
      ["half", "full"].forEach((st) => {
        const g = w.glass[st];
        if (!g || g.blackDone) return;
        g.blackDone = true;
        if (S.textures.exists(`v2-glass-black-${st}`)) {
          const [dw, dh] = [g.displayWidth, g.displayHeight];
          g.setTexture(`v2-glass-black-${st}`).setDisplaySize(dw, dh);
        } else if (St.hasArt(S, `chai-glass-black-${st}`)) {
          const [dw, dh] = [g.displayWidth, g.displayHeight];
          g.setTexture(St.artKey(`chai-glass-black-${st}`)).setDisplaySize(dw, dh);
        }
        else if (!w.blackShade) {
          // the stand-in (no tints in the canvas renderer): a darker tea multiplied over the milk tea, faded with it
          const d = g.displayWidth;
          w.blackShade = S.track(S.add.circle(g.x, g.y, d * 0.37, BLACK.tint, 1).setDepth(g.depth + 0.01).setAlpha(0));
          w.blackShade.setBlendMode(Phaser.BlendModes.MULTIPLY);
        }
      });
    };
    /*
     * CK-TB-01 (E14; Zafar 17 Oct, P34: "if you click on the counter ... you take one of those ingredients out"): a tap on a
     * chip of the count badge (the sugar, the salt, a spice: SH-39) takes one of that thing back out of the pan in hand, the
     * spoon lifting it back to its jar, always until that pan is poured: lit or not, while anyone speaks or a spoon is still
     * on its way (it waits for that spoon). Water, milk and leaves can't come out (the picture shows them mixed in). The
     * first placement is the one scored: a spoonful taken back that was wrong still counts as a mistake for that cup
     * (pan.firstWrong, judged at Done). The badge is the DOM's and never takes a tap itself (js/shared/tally.js): the tap
     * falls through to the canvas, where a zone over each chip takes it.
     */
    const canTakeBack = (pan, id) => !!pan && talked && !finished && !pan.poured && !pan.closed && !Cook.paused && (pan.spoons || []).includes(id);
    const chips = () =>
      [...document.querySelectorAll("#count-badge .njg-tally-chip[data-tally], #count-badge .tl[data-k]")]
        .map((el) => ({ id: el.dataset.tally || el.dataset.k, r: el.getBoundingClientRect() }))
        .filter((c) => c.r.width > 0 && c.r.height > 0);
    const tbZones = new Map(); // a chip's id -> its zone on the canvas
    const syncTakeBack = () => {
      const live = new Set();
      if (sel && !finished)
        chips().forEach(({ id, r }) => {
          if (!canTakeBack(sel, id)) return;
          const a = toWorld(r.left, r.top);
          const b = toWorld(r.right, r.bottom);
          // (at least the 48 px tap target, LAY-04, centred on the chip)
          const min = toWorld(48, 0).x - toWorld(0, 0).x;
          const w = Math.max(b.x - a.x, min);
          const h = Math.max(b.y - a.y, min);
          const cx = (a.x + b.x) / 2;
          const cy = (a.y + b.y) / 2;
          let z = tbZones.get(id);
          if (!z) {
            z = S.track(S.add.zone(cx, cy, w, h).setDepth(D.fx + 6));
            z.chipId = id;
            S.tappable(z, () => takeBack(sel, id));
            tbZones.set(id, z);
          } else if (Math.abs(z.x - cx) > 1 || Math.abs(z.y - cy) > 1 || Math.abs(z.width - w) > 1 || Math.abs(z.height - h) > 1) {
            z.setPosition(cx, cy).setSize(w, h);
            if (z.input && z.input.hitArea) z.input.hitArea.setTo(0, 0, w, h);
          }
          live.add(id);
        });
      tbZones.forEach((z, id) => {
        if (live.has(id)) return;
        S.untap(z);
        z.destroy();
        tbZones.delete(id);
      });
    };
    // (the take-back player, build/sandbox: the last spoonful's chip)
    Cook.undoAt = () => {
      const id = sel && (sel.spoons || []).slice(-1)[0];
      const z = id && tbZones.get(id);
      return z && z.active && canTakeBack(sel, id) ? { x: z.x, y: z.y } : null;
    };
    const takeBack = async (pan, id) => {
      while (busy && !finished) await Cook.wait(60); // a spoon still on its way lands first
      if (!canTakeBack(pan, id)) return;
      pan.spoons.splice(pan.spoons.lastIndexOf(id), 1);
      const obj = shelf[id];
      busy++;
      unglow();
      zb.expect({ kind: "wait" });
      const p = pan.p;
      const wrong = id === "cook-khun" ? pan.sugar > (p.khun || 0) : id !== p.extra;
      // (the salt was logged as it went in: only its row is marked at Done)
      const why = id === "cook-khun" ? `${pan.sugar} cook-khun, they asked for ${p.khun || 0} (${nameOf(pan.who)})` : id === "spi-16" ? null : `added ${id} for ${nameOf(pan.who)}`;
      if (wrong) pan.firstWrong = (pan.firstWrong || []).concat({ row: id === "spi-16" ? "cook-khun" : id, why });
      if (id === "cook-khun") {
        pan.sugar--;
        // the counted row was gold at the count (CHAI-16): it opens again below it, and is gold again at it
        if (pan.spoonsClosed && pan.sugar < (p.khun || 0)) {
          pan.spoonsClosed = false;
          UI.mission.reopen(["cook-khun"], dishNo(), { for: pan.who });
        }
      } else if (id === "spi-16") pan.salt--;
      else if (!pan.spoons.includes(id)) {
        pan.extras = pan.extras.filter((x) => x !== id);
        if (id === p.extra) UI.mission.reopen([id], dishNo(), { for: pan.who });
      }
      UI.hideCount();
      if (pan.sugar) UI.count(pan.sugar, { speak: false, id: "cook-khun" });
      if (pan.salt) UI.count(pan.salt, { speak: false, id: "spi-16" });
      pan.extras.forEach((x) => UI.count(spoonsOf(pan, x), { speak: false, id: x }));
      Cook.sfx.pop();
      drawBits(pan); // SH-32: the spoonful comes back out of the pan
      if (obj) await Cook.Spoon.spoon(zb, { bowl: pan.img, into: at(obj), word: id, ms: kCount.spoonMs });
      if (id !== "cook-khun" && id !== "spi-16") fadeLook(pan, pan.shown);
      if (id === "cook-khun" && level <= 1 && pan.sugar === (p.khun || 0)) closeSpoons(pan);
      busy--;
      refresh();
    };
    const panTap = async (pan) => {
      if (finished || busy) return;
      if (pan.state !== "ready" || pan.poured >= 2 || !talked) {
        if (sel !== pan) select(pan);
        return;
      }
      if (sel !== pan) select(pan);
      finishGen++; // (L4: a second pour in the last beat holds the move-on)
      busy++;
      // Sprint 11 (easy-to-play principle 9: each word heard at the order, at the shelf and at the pour): while their chai
      // pours, the person's card says what went into it, row by row (at L1-L2, while the order is written in full)
      if (level <= 2 && !pan.poured && UI.readAlong) {
        const c = [...document.querySelectorAll("#mission .oc-card")].find((x) => x.dataset.who === pan.who);
        const said = c && c._parts ? c._parts().filter((p) => p.row && !p.row.head && !p.row.no && !saidLately(p.row.ids) && !(UI.readLately && UI.readLately(p.line))) : [];
        if (said.length) {
          said.forEach((p) => (p.row.ids || []).forEach((id) => (saidAt[id] = Date.now())));
          // (as the chai starts to flow, once the pan is over the glass: the tap's own moment stays quiet)
          Cook.wait(900).then(() => !finished && UI.readAlong(said)).catch(() => {});
        }
      }
      unglow();
      // CHAI-08's flaw (the judge, 20 Oct: "loose 'hakro' pills float at the hob's top-left corner during the pour"): the pan's
      // running count goes while it is off the hob pouring, and comes back with it if it is still on the go
      UI.hideCount();
      zb.expect({ kind: "wait" });
      const w = pan.well;
      const black = !(pan.has.milk > 0);
      if (black) blackGlass(w);
      /*
       * Sprint 11 (B-cook; Zafar, 22 Oct): the pour is coded from the ONE top-down pan (no tilt pictures: the s08c
       * three-quarter frames are gone). The hob's pan lifts (a little bigger: nearer the eye; its shadow drops away), turns
       * its spout towards the glass and comes over it; it tips, which from exactly above is a slight squash along the
       * spout-handle line; the chai slides towards the spout (the empty pan's steel shows on the handle's side) and falls
       * as the glass fills; the shared stream (js/shared/pour.js) leaves from the spout's tip. Then it tips back, turns and
       * goes home. The pan is two of its own pictures on one registration: the empty one, and the full one over it masked
       * to where the chai lies.
       */
      const P = Object.assign({ liftMs: 420, tipMs: 380, pourMs: 700, untipMs: 300, backMs: 420 }, K.pour || {});
      const to = halves ? pan.poured + 1 : 2;
      const from = pan.poured;
      const body = look8(pan.img, black ? "black" : "milk");
      const base = look8(S.track(S.add.image(pan.x, pan.y, TOP.looks.empty.key)), "empty").setScale(s8).setAngle(TOP.turn);
      const lmask = S.make.graphics({ add: false });
      body.setMask(lmask.createGeometryMask());
      const stream = S.track(S.add.graphics());
      // its shadow on the worktop, dropping away as it lifts (the contact shadow's own picture)
      const lsh = S.track(S.add.image(pan.x, pan.y, S.tex("shadow")).setDepth(D.fx + 0.5).setAlpha(0));
      // the pan's off the burner: no flame and no glow on an empty burner while it pours (29 Sept)
      pan.away = true;
      const flames = [pan.burner.flameHi, pan.burner.flameLo];
      // (the knob's own fade to its low flame may still be running from the turn-down: it stops, so the flame goes out)
      flames.forEach((fl) => (S.tweens.killTweensOf(fl), S.tweens.add({ targets: fl, alpha: 0, duration: 160 })));
      drawSel();
      Object.values(pan.layers).forEach((im) => im.setVisible(false));
      pan.bubbles.setVisible(false);
      if (pan.img.shadow) pan.img.shadow.setVisible(false);
      base.setDepth(D.fx + 1);
      body.setDepth(D.fx + 1.01);
      stream.setDepth(D.fx + 1.5);
      const gd = w.glass.empty.displayWidth;
      const v = Cook.view || {};
      const box = { l: (v.left || 0) + 12, t: (v.top || 0) + 12, r: (v.right || 1600) - 12, b: (v.bottom || 900) - 12 };
      // the spout comes to the glass from its upper left (the stream falls down the screen into it, as the eye reads a pour)
      const PHI = (POUR.phi * Math.PI) / 180; // where the spout points while it pours
      const turnTo = POUR.phi - 180; // the picture's spout is on its left: this turn points it at PHI
      const lipAt = { x: w.x - Math.cos(PHI) * gd * POUR.lipBack, y: w.y - Math.sin(PHI) * gd * POUR.lipBack };
      const surf = { x: w.x + gd * 0.02, y: w.y + gd * 0.02 };
      const rot = (dx, dy, deg) => {
        const a = (deg * Math.PI) / 180;
        return { x: dx * Math.cos(a) - dy * Math.sin(a), y: dx * Math.sin(a) + dy * Math.cos(a) };
      };
      // the pan's centre that puts its spout over lipAt at full tip, at scale z
      const holdAt = (z) => {
        const d = rot(TOP.lip[0] * z * (1 - POUR.squash), TOP.lip[1] * z, turnTo);
        return { x: lipAt.x - d.x, y: lipAt.y - d.y };
      };
      // the whole held pan (handle's end included) inside the view; else drawn smaller (down to 0.6 of its size)
      const HANDLE_END = TOP.looks.empty.w - TOP.looks.empty.cx;
      const fits = (z) => {
        const c = holdAt(z);
        const ends = [rot(HANDLE_END * z, 0, turnTo), rot(-TOP.rim * z, 0, turnTo), rot(0, TOP.rim * z, turnTo), rot(0, -TOP.rim * z, turnTo)];
        return ends.every((e) => c.x + e.x >= box.l && c.x + e.x <= box.r && c.y + e.y >= box.t && c.y + e.y <= box.b);
      };
      const zLift = s8 * POUR.lift;
      let zs = zLift;
      if (!fits(zs)) {
        let lo2 = zLift * 0.6;
        let hi2 = zLift;
        for (let i = 0; i < 12; i++) {
          const mid = (lo2 + hi2) / 2;
          if (fits(mid)) lo2 = mid;
          else hi2 = mid;
        }
        zs = lo2;
      }
      const plan = NjgPour.plan({
        from: { x: pan.x, y: pan.y },
        to: holdAt(zs),
        tilt: 1, // (the plan's angle is read as how far it has tipped, 0..1.15; the drawing turns it into the squash)
        arc: zs < zLift ? 12 : 40, // (a short screen: no rise past the room it has)
        ms: { lift: P.liftMs, tip: P.tipMs, pour: P.pourMs * (to - from), untip: P.untipMs, back: P.backMs },
      });
      const M = plan.marks;
      const st = (x) => (x >= 2 ? "full" : x >= 1 ? "half" : "empty");
      const ease = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
      const ell = (c, a, rx, ry, deg) => {
        const pts = [];
        for (let i = 0; i < 28; i++) {
          const t = (i / 28) * Math.PI * 2;
          const q = rot(a + Math.cos(t) * rx, Math.sin(t) * ry, deg);
          pts.push({ x: c.x + q.x, y: c.y + q.y });
        }
        return pts;
      };
      const draw = (f) => {
        if (!body.active) return;
        const t = f.t;
        // up: 0 on the burner, 1 lifted and over the glass (the lift and the way home)
        const up = f.phase === "lift" ? ease(Math.min(1, t / M.lift)) : f.phase === "back" || f.phase === "done" ? 1 - ease(Math.min(1, (t - M.untip) / P.backMs)) : 1;
        const tip = Math.max(0, Math.min(1.15, f.angle));
        const z = s8 + (zs - s8) * up;
        const deg = TOP.turn + (turnTo - TOP.turn) * up;
        const sx = 1 - POUR.squash * Math.min(1, tip) - POUR.squash * 0.3 * Math.max(0, tip - 1);
        [base, body].forEach((im) => im.setVisible(true).setPosition(f.x, f.y).setAngle(deg).setScale(z * sx, z));
        // the chai: how much is left in the pan (from 1 at a full pan to 0 once both halves are poured), slid to the spout
        const x = from + (to - from) * f.fill;
        // CHAI-31 (the judge: "the tilted pan shows bare steel"): the last of the chai stays in sight at the spout until the
        // pour ends; it goes as the pan tips back (a full pour), or stays as it is (a half one)
        const end = f.phase === "untip" ? Math.min(1, (t - M.pour) / P.untipMs) : f.phase === "back" || f.phase === "done" ? 1 : 0;
        const left = Math.max(0, 1 - x / 2, (1 - end) * 0.32);
        const rI = TOP.inner * z;
        const slide = rI * (0.3 * Math.min(1, tip) + 0.22 * (1 - left) * Math.min(1, tip));
        const kr = 0.45 + 0.55 * Math.sqrt(left);
        lmask.clear();
        lmask.fillStyle(0xffffff, 1);
        lmask.fillPoints(ell({ x: f.x, y: f.y }, -slide, rI * kr * sx * 1.06, rI * (0.55 + 0.45 * Math.sqrt(left)) * 1.02, deg), true);
        body.setAlpha(Math.min(1, left / 0.06));
        // the shadow: under it on the burner, falling away down and right as it rises
        const sw = TOP.rim * z * 2.1;
        lsh.setPosition(f.x + up * 26, f.y + up * 34).setDisplaySize(sw * sx, sw).setAngle(deg).setAlpha(0.55 - 0.25 * up);
        // the stream: thin, translucent tea from the spout's tip into the glass (js/shared/pour.js)
        stream.clear();
        if (f.flow > 0.01 && left > 0.001) {
          const d = rot(TOP.lip[0] * z * sx, TOP.lip[1] * z, deg);
          const sp = { x: f.x + d.x, y: f.y + d.y };
          // (seen from above the stream is short: wide at the spout, narrowing as it falls away into the glass; the pan's
          // own chai colour, measured on its pictures)
          // (CHAI-31: wider, and the measured tea of the glass it falls into)
          const wd = Math.max(9, rimR * 0.22);
          const col = black ? POUR.blackTea || POUR.black : POUR.milkTea || POUR.milk;
          const sm = NjgPour.stream(sp, surf, wd * (0.4 + 0.6 * f.flow), t / 1000);
          stream.fillStyle(col, 0.94);
          stream.fillPoints(sm.poly, true);
          // (its edge a shade darker, so the stream reads against the tea it falls into)
          stream.lineStyle(Math.max(1.2, wd * 0.12), POUR.edge, 0.55);
          stream.strokePoints(sm.poly, true);
          stream.lineStyle(Math.max(1, wd * 0.14), 0xffffff, 0.24);
          stream.strokePoints(sm.core, false);
          stream.fillStyle(col, 0.4 * f.flow);
          stream.fillEllipse(sm.pool.x, sm.pool.y, sm.pool.rx * 2, sm.pool.ry * 2);
        }
        // the glass fills: empty -> half -> full cross-fade
        const a0 = Math.floor(x);
        const fr = x - a0;
        ["empty", "half", "full"].forEach((s2, j) => w.glass[s2].setAlpha(j === a0 ? 1 - fr * (j < 2 ? 1 : 0) : j === a0 + 1 ? fr : 0));
        if (x >= 2) w.glass.full.setAlpha(1);
      };
      // (the test hook: where the pan is in its pour, for the filmstrip)
      Cook.chaiPour = { total: plan.total, marks: M };
      // the pour's sound: Cook's soft pour loop while the stream runs, rising as the glass fills
      let loop = null;
      const sound = (f) => {
        if (f.flow > 0.05 && !loop && f.phase !== "back" && Cook.sfx.pourLoop) loop = Cook.sfx.pourLoop() || { pitch() {}, stop() {} };
        if (loop) loop.pitch(f.fill * 0.6);
        if (loop && f.phase === "back") loop = (loop.stop(), null);
      };
      try {
        await new Promise((r) => S.tweens.addCounter({ from: 0, to: 1, duration: plan.total, onUpdate: (tw) => { const f = plan.at(tw.getValue() * plan.total); draw(f); sound(f); }, onComplete: r }));
      } finally {
        if (loop) loop.stop();
      }
      draw(plan.at(plan.total));
      Cook.chaiPour = null;
      stream.destroy();
      lsh.destroy();
      base.destroy();
      body.clearMask(true);
      lmask.destroy();
      body.setAlpha(1);
      ["empty", "half", "full"].forEach((s2) => w.glass[s2].setAlpha(s2 === st(to) ? 1 : 0));
      pan.poured = to;
      w.fill = to;
      body.setVisible(true).setPosition(pan.x, pan.y).setAngle(TOP.turn).setScale(s8).setDepth(D.item);
      land(body, { k: 0.04, top: true }); // (it sets down on the burner: a small settle)
      land(w.glass[st(to)], { k: 0.05, top: true }); // (the glass, full: a small settle and its clink)
      soft("right", 0.35);
      pan.away = false;
      if (pan.poured < 2) flames.forEach((fl, j) => S.tweens.add({ targets: fl, alpha: pan.burner.state === (j ? "low" : "high") ? 0.95 : 0, duration: 200 }));
      drawSel();
      if (pan.img.shadow) pan.img.shadow.setVisible(true);
      Object.values(pan.layers).forEach((im) => im.setVisible(true));
      pan.bubbles.setVisible(true);
      pan.level = pan.poured >= 2 ? 0 : pan.level * 0.6;
      setLook(pan);
      closeSpoons(pan);
      if (pan.poured >= 2 || !halves) closePan(pan);
      if (pan.poured >= 2) setKnob(pan, "off"); // the pan's empty: the fire goes off
      if (sel === pan && pan.poured < 2 && halves) {
        if (UI.tallyAt) UI.tallyAt(tallyPt(pan), { anchor: "right" });
        if (pan.sugar) UI.count(pan.sugar, { speak: false, id: "cook-khun" });
        if (pan.salt) UI.count(pan.salt, { speak: false, id: "spi-16" });
        pan.extras.forEach((x) => UI.count(spoonsOf(pan, x), { speak: false, id: x }));
      }
      busy--;
      if (pans.every((q) => q.poured > 0)) {
        doneShown = true;
        // SH-105 (decision 6, P26: "once you've poured all the teas it just scores you immediately"): every cup poured and none
        // can take more (no half-poured cup at L4's half / full), so nothing is left to choose: it moves on.
        // Sprint 11 (Zafar, 22 Oct: "no Next and no Done anywhere"): chai's own ✓ is gone. At L4 a cup poured half can still
        // take its second pour: the round moves on by itself (NjgButtons.moveOn) after a longer beat with no pour, and a
        // pour in that beat starts it again (finishGen)
        if (!halves || pans.every((q) => q.poured >= 2)) finishUp();
        else {
          const gen = finishGen;
          const go = () => gen === finishGen && !finished && !busy && finishUp();
          if (global.NjgButtons && global.NjgButtons.moveOn) global.NjgButtons.moveOn(go, { ms: HALF_BEAT_MS, reason: "cook:station" });
          else Cook.wait(HALF_BEAT_MS).then(go);
        }
      }
      refresh();
    };

    /* ---------- people speak ---------- */
    const L = () => ladderOf(ctx, people);
    const faceImg = () => document.querySelector("#nani-card .nc-face");
    async function personSay(pan, rows) {
      const img = faceImg();
      const prev = img ? img.getAttribute("src") : null;
      if (img) img.src = Cook.v(Cook.facePath(pan.who));
      const y0 = pan.face.y;
      const bob = S.tweens.add({ targets: pan.face, y: y0 - 8, duration: 200, yoyo: true, repeat: -1 });
      try {
        const said = UI.mission.sayPerson ? await UI.mission.sayPerson(pan.who, rows) : false;
        if (!said) await UI.say(personLine(L(), pan.who, rows), { badge: true }, { hide: St.hideKnown(ctx) });
      } finally {
        bob.stop();
        if (pan.face.active) pan.face.y = y0;
        UI.hideBubble();
        if (img && prev) img.src = prev;
      }
    }
    let speaking = false;
    const hear = async (pan) => {
      if (speaking) return;
      speaking = true;
      if (!guided && personRows(L(), pan.who).some(hiddenRow) && Cook.onHelp) Cook.onHelp("replay", { ids: personRows(L(), pan.who).flatMap((r) => r.ids) });
      try {
        await personSay(pan);
      } catch (e) {
        if (!(e instanceof Cook.Abort)) throw e;
      } finally {
        speaking = false;
      }
    };

    /* ---------- what's next (the tester, Nani's glow, the focal rule) ---------- */
    const at = (o) => {
      const c = S.centre(o);
      return { x: c.x, y: c.y };
    };
    const tapOn = (o, key, extra = {}) => Object.assign({ kind: "tap" }, at(o), { key }, extra);
    const want = (pan) => {
      const p = pan.p;
      if (!pan.has.water) return "cook-paani";
      if (!pan.has.leaves) return "cook-chai";
      if (p.dudh && !pan.has.milk) return "cook-dudh";
      if (pan.sugar < (p.khun || 0)) return "cook-khun";
      if (p.extra && !pan.extras.includes(p.extra) && shelf[p.extra]) return p.extra;
      return null;
    };
    const GENERIC = new Set(["cook-paani", "cook-chai"]);
    function plan() {
      if (!talked || finished) return null;
      // 1. a heating pan near the green comes first (turn it down in time)
      const hot = pans.filter((q) => q.state === "heating").sort((a, b) => b.heat - a.heat)[0];
      // CHAI-24 (P56): "Slow kar" and the knob's glow come as the bar enters the green, never before it (so no one thinks
      // they must stop it early); just before the green the pan already comes first, quietly
      if (hot && hot.heat >= lo - 0.14) {
        const green = hot.heat >= lo;
        return { e: { kind: "timing", x: hot.knobHit.x, y: hot.knobHit.y, key: `knob-${hot.who}` }, obj: green ? hot.knob : null, gauge: hot, focal: green, phase: green ? "slow" : null, slowAt: green ? hot : null };
      }
      // 2. a ready pan pours into its glass
      for (const q of pans) {
        const need = halves ? (q.p.amount === "ph-half" ? 1 : 2) : 2;
        if (q.state === "ready" && q.poured < need) return { e: tapOn(q.img, `pour-${q.who}`), obj: q.img, focal: true, phase: "pour" };
      }
      // 3. a pan still to fill: choose it, fill it, light it
      for (const q of pans) {
        if (q.state !== "cold") continue;
        const id = want(q);
        if (sel !== q) return { e: tapOn(q.img, `pan-${q.who}`), obj: q.face, focal: false, phase: id ? (id === "cook-paani" ? "water" : id === "cook-chai" ? "tea" : "cups") : "knob", pid: id };
        if (id) {
          const e = tapOn(shelf[id], id, { n: id === "cook-khun" ? q.sugar : undefined });
          if (id === "cook-khun") {
            e.wrongs = shelf["spi-16"] ? [at(shelf["spi-16"])] : [];
            if (ctx.lab && q === pans[pans.length - 1]) e.mistake = true; // the lab always tries the salt once
          }
          // (CHAI-22: the mistake player's wrong tap here is a second water: it must only wiggle)
          if (id === "cook-chai" && shelf["cook-paani"]) e.wrongs = [at(shelf["cook-paani"])];
          return { e, obj: shelf[id], focal: GENERIC.has(id), phase: id === "cook-paani" ? "water" : id === "cook-chai" ? "tea" : "cups", pid: id };
        }
        // (and here a second milk, in a pan that has it)
        const again = q.has.milk > 0 && shelf["cook-dudh"] ? [at(shelf["cook-dudh"])] : null;
        return { e: Object.assign({ kind: "tap", x: q.knobHit.x, y: q.knobHit.y, key: `knob-on-${q.who}` }, again ? { wrongs: again } : {}), obj: q.knob, focal: true, phase: "knob" };
      }
      // 4. waiting on the heat
      if (hot) return { e: { kind: "timing", x: hot.knobHit.x, y: hot.knobHit.y, key: `knob-${hot.who}` }, obj: null, gauge: hot, focal: false, phase: null };
      // (no ✓ any more: every cup is in its glass and the round moves on by itself)
      return { e: { kind: "wait" }, obj: null, phase: null };
    }
    const unglow = () => {
      if (glowing) S.glow(glowing, false);
      if (glowing && glowing.texture && glowing.texture.key === RING) glowing.setVisible(false);
      glowing = null;
    };
    /*
     * Sprint 12 (Zafar, 22 Oct; CHAI-32, EASY-03, EASY-10): chai's help ladder, on the shared kit's rungs (js/cook/coach.js
     * C.rungs, js/shared/onboard.js Onboard.stuck). No item ever moves by itself:
     *   the water, then the tea, the first time: the full dim and box at once (the item glowing in it, the finger tapping);
     *   every item step after that (the first ordered item included: none at once): no tap for 5 s, the next item's card comes
     *     up at the top left by Nani's box, as if from her, and the item glows and bounces (no box, no dim); 7 s more and the
     *     dim and box come instead (never the card and the heavy dim together); still nothing, it is left as it is;
     *   the knob, the slow-down and the pour keep the kit's own rungs (the box at once the first time; stuck, at 5 s).
     * What a person asked for (milk, the sugar, an extra) is the answer: its help runs only while it is study (Nani helps, a
     * redo, or the word still supported, stage 1-2), and a word shown that way is not counted as known (non-negotiable 4).
     */
    const LADDER = { glowAt: 5000, boxAt: 12000 };
    const ITEM_STEPS = new Set(["water", "tea", "cups"]);
    // the box keeps the thing's neighbours on the shelf dark (EASY-08: never half the jar above)
    const pageRect = (o, pad = 0) => () => {
      if (!o || !o.active) return null;
      const b = o.getBounds();
      const a = UI.worldToScreen(b.x - pad, b.y - pad);
      const z = UI.worldToScreen(b.right + pad, b.bottom + pad);
      return [a.x, a.y, z.x - a.x, z.y - a.y];
    };
    const shelfBut = (obj) => Object.values(shelf).filter((o) => o !== obj && o.active).map((o) => pageRect(o));
    const supported = (id) => !!id && Cook.wordStage(id) <= 2;
    const helped = new Set(); // the asked-for words shown by help this round (study: never marked right)
    let helpObj = null; // the thing the help lights now (it glows at once, not after Nani's pause)
    const helpGlow = (obj) => {
      if (helpObj === obj) return;
      helpObj = obj;
      unglow();
      refresh();
    };
    let rung = null;
    let rungKey = null;
    // within a step the live thing can change (the next pan's knob): the help follows the one live now (rungCur)
    let rungCur = null;
    const rungOf = (nx) => {
      if (!nx || !nx.e || finished) return null;
      const key = nx.e.key || "";
      if (nx.phase === "pour" && /^pour-/.test(key)) {
        const pan = pans.find((q) => `pour-${q.who}` === key);
        return pan && { obj: pan.img, target: pageRect(pan.glowRing) };
      }
      if (nx.phase === "slow" && nx.slowAt) return { obj: nx.slowAt.knob, target: pageRect(nx.slowAt.knob, 4) };
      if (/^knob-on-/.test(key)) {
        const pan = pans.find((q) => `knob-on-${q.who}` === key);
        return pan && { obj: pan.knob, target: pageRect(pan.knob, 4) };
      }
      const obj = shelf[key];
      if (!obj || !sel) return null;
      return { obj, id: key, target: pageRect(obj), avoid: () => shelfBut(obj) };
    };
    /* the call-out card (CHAI-32: "the card that comes up when they're ordering ... should look like it's coming from Nani"): the
       next item's word card, big, at the top left of the play area by her guide box (the order's own card: UI.wordOf), with a
       tail towards her box */
    let callout = null;
    const rowFor = (pid) => (sel ? personRows(L(), sel.who).find((r) => !r.no && r.ids.includes(pid)) : null);
    const hideCallout = () => {
      if (callout) callout.remove();
      callout = null;
    };
    const showCallout = (pid) => {
      hideCallout();
      const r = rowFor(pid);
      const stage = document.querySelector("#stage");
      const w = r && UI.wordOf && global.WordCard ? UI.wordOf(r, { size: 240 }) : null;
      if (!w || !stage) return;
      const box = document.createElement("div");
      box.className = "ck-callout";
      box.dataset.item = pid;
      Object.assign(box.style, { position: "absolute", left: "var(--njg-s4, 16px)", top: "var(--njg-s3, 12px)", zIndex: "21", animation: "icWordIn .3s cubic-bezier(.2, 1.3, .4, 1)" });
      const card = global.WordCard.card(box, w.word, Object.assign({}, w.wordOpts, { cls: "ic-word" }));
      card.style.width = "clamp(150px, min(17vw, 36vh), 210px)";
      // the tail: from her box, on the card's left edge
      const tail = document.createElement("i");
      tail.setAttribute("aria-hidden", "true");
      Object.assign(tail.style, { position: "absolute", left: "-11px", top: "var(--njg-s5, 24px)", width: "0", height: "0", borderTop: "11px solid transparent", borderBottom: "11px solid transparent", borderRight: "12px solid var(--njg-card)", filter: "drop-shadow(-2px 1px 1px rgba(60, 40, 20, 0.12))" });
      box.appendChild(tail);
      stage.appendChild(box);
      callout = box;
      if (Cook.life && Cook.life.onEnd) Cook.life.onEnd(hideCallout);
    };
    const coachStep = (nx, sid) => {
      rungCur = rungOf(nx);
      if (sid === rungKey) {
        if (helpObj && rungCur && helpObj !== rungCur.obj) helpGlow(rungCur.obj);
        return;
      }
      if (rung) rung.done();
      rung = null;
      rungKey = sid;
      hideCallout();
      if (helpObj) helpGlow(null);
      const step = nx && nx.phase;
      if (!step || !Cook.Coach || !Cook.Coach.rungs) return;
      const cur = rungCur;
      if (!cur) return;
      const answer = step === "cups";
      if (answer && !(guided || (sel && sel.redo) || supported(cur.id))) return; // (the answer: only while it is study)
      const items = ITEM_STEPS.has(step);
      const target = () => (rungCur && rungCur.target ? rungCur.target() : null);
      // (under the spotlight the live thing takes a tap, and so do the bulbs and the "?": the help stays everyone's, Zafar, 21 Oct)
      const live = [target, ".ng-bulb", "#btn-bulb", "#btn-help"];
      const name = UI.stepId && UI.stepId() != null ? UI.stepId() : null;
      const mark = () => answer && cur.id && !helped.has(cur.id) && (helped.add(cur.id), Cook.onHelp && Cook.onHelp("hint", { ids: [cur.id] }));
      const lightObj = () => (rungCur ? rungCur.obj : cur.obj);
      rung = Cook.Coach.rungs("chai-tray", step, Object.assign(
        { name, target, live, avoid: cur.avoid ? cur.avoid() : null, light: (on) => (on ? (mark(), helpGlow(lightObj())) : helpGlow(null)) },
        // CHAI-32: the box at once only the first time, for the water and the tea (never the first ordered item)
        answer ? { first: false } : {},
        items
          ? {
              at: [0, LADDER.boxAt, null],
              glowAt: LADDER.glowAt,
              glow: (on) => {
                if (on) {
                  mark();
                  showCallout(cur.id);
                  helpGlow(lightObj());
                } else {
                  hideCallout();
                  helpGlow(null);
                }
              },
            }
          : { line: () => UI.stepHelp && UI.stepHelp() }
      ));
    };
    const coachEnd = () => {
      if (rung) rung.done();
      rung = null;
      rungKey = null;
      hideCallout();
      helpObj = null;
    };

    /*
     * Sprint 11 (B-cook, task 6; easy-to-play principle 10: speaking is part of play, never a gate): when a pan is ready the
     * child may call "chai" to serve it. A round microphone sits by that pan's glass; a tap on it listens once, on the
     * device (js/shared/speech.js Speech.listen, a closed set: chai and two other words of the station, the family's own
     * recordings as the templates). "chai" heard: the ready pan pours, as a tap on it does. Anything else, or nothing: a
     * shrug (the microphone sways), nothing else. A tap on the pan always works. The microphone shows only where the family
     * has recorded every word of the set (no device voice is ever a template): until Mum records them it stays away.
     */
    const SAY_SET = ["cook-chai", "cook-paani", "cook-dudh"];
    const MIC_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>';
    let mic = null;
    let micPan = null;
    let listening = false;
    const sayUrls = () => {
      const Sp = global.Speech;
      if (!Sp || !Sp.templateUrls) return null;
      const urls = SAY_SET.map((id) => Sp.templateUrls(id, Cook.audioManifest || {}).map((u) => Cook.v(u)));
      return urls.every((u) => u.length) ? urls : null;
    };
    const micCan = () => {
      const Sp = global.Speech;
      return !!(Sp && Sp.listen && !(Sp.status && ["refused", "absent"].includes(Sp.status())) && global.navigator && navigator.mediaDevices && sayUrls());
    };
    const hideMic = () => {
      if (mic) mic.classList.add("hidden");
      micPan = null;
    };
    const placeMic = () => {
      if (!mic || !micPan) return;
      const w = micPan.well;
      const p = UI.worldToStage(w.x + w.glass.empty.displayWidth * 0.62, w.y - w.glass.empty.displayWidth * 0.62);
      mic.style.left = `${p.x}px`;
      mic.style.top = `${p.y}px`;
    };
    const heardServe = async () => {
      const Sp = global.Speech;
      if (listening || !Sp || !micPan) return;
      listening = true;
      mic.classList.add("on");
      const pan = micPan;
      let res = null;
      try {
        Cook.unlockAudio();
        const urls = sayUrls();
        // (inside the tap, for iOS: the family's recordings decoded as templates, once)
        if (urls) for (let i = 0; i < SAY_SET.length; i++) if (!(Sp.hasTemplates && Sp.hasTemplates([SAY_SET[i]]))) await Sp.loadTemplates(SAY_SET[i], urls[i]);
        res = await Sp.listen({ choices: SAY_SET, timeoutMs: 3000 });
      } catch (e) {
        res = null;
      } finally {
        listening = false;
        if (mic) mic.classList.remove("on");
      }
      note("chai-say", res ? res.choice : "none", pan.who);
      if (res && res.choice === "cook-chai" && pan.state === "ready" && !finished && !busy) {
        if (Sp.confirm) Sp.confirm("cook-chai", "game");
        return panTap(pan);
      }
      // a shrug: the microphone sways, nothing else happens
      if (mic) {
        mic.classList.remove("shrug");
        void mic.offsetWidth;
        mic.classList.add("shrug");
      }
    };
    const showMic = (pan) => {
      if (!micCan()) return hideMic();
      if (!mic) {
        const stage = document.querySelector("#stage");
        if (!stage) return;
        mic = document.createElement("button");
        mic.type = "button";
        mic.className = "ck-mic hidden";
        mic.setAttribute("aria-label", "");
        mic.innerHTML = MIC_SVG;
        mic.addEventListener("click", (ev) => {
          ev.stopPropagation();
          heardServe();
        });
        stage.appendChild(mic);
        if (Cook.life && Cook.life.onEnd) Cook.life.onEnd(() => mic && mic.remove());
      }
      micPan = pan;
      mic.classList.remove("hidden");
      placeMic();
    };
    if (UI.needShared) UI.needShared("speech");

    let gaugePan = null;
    function refresh() {
      if (finished) return;
      syncTakeBack();
      // serving: every pan is in its glass, so the last pan's sugar tally has nothing left to count
      if (pans.length && pans.every((q) => q.poured > 0)) UI.hideCount();
      if (busy) {
        zb.expect({ kind: "wait" }); // a pour in progress: the player waits for it
        hideMic();
        return;
      }
      const nx = plan();
      gaugePan = nx && nx.gauge ? nx.gauge : null;
      if (gaugePan) zb.gauge({ level: gaugePan.heat, lo, hi, at: ringAt(gaugePan) });
      zb.expect(nx ? nx.e : null);
      // (contract-70: where the bar was as "Slow kar" was called)
      if (nx && nx.slowAt && lastPhase !== "slow:") note("chai-slow", nx.slowAt.heat.toFixed(3), `${lo}/${hi}/${nx.slowAt.who}`);
      if (nx) phase(nx.phase, nx.pid); // S02-B: nothing to do -> the box is empty (R2)
      // Sprint 11: the real item's demo and the hint rungs for the step Nani has just opened (and calls)
      coachStep(nx, nx && nx.phase ? `${nx.phase}:${nx.pid || ""}` : null);
      // Sprint 11: a ready pan can be served by calling "chai" (its microphone by the glass)
      if (nx && nx.phase === "pour") showMic(pans.find((q) => `pour-${q.who}` === nx.e.key) || null);
      else hideMic();
      // the focal rule: the next generic step pulses (a person's choice only when Nani helps)
      // (CHAI-32: what the help lights glows and bounces at once, not after Nani's pause)
      const pick = helpObj || (nx && nx.obj && (nx.focal || guided || (sel && sel.redo)) ? nx.obj : null); // decision 51: a redo has help
      // CHAI-25: a pan glows as a ring on its rim's centre
      const obj = pick && pick.panOf ? pick.panOf.glowRing : pick;
      if (glowing !== obj) {
        unglow();
        if (obj && obj.texture && obj.texture.key === RING) obj.setVisible(true).setAlpha(0.9);
        if (obj) S.glow(obj, true, { bounce: !!obj.isJar, now: !!helpObj });
        glowing = obj;
      }
      // inactive shelf things step back about 10%
      const focusShelf = obj && obj.isJar;
      Object.values(shelf).forEach((o) => o.active && !o.glowFx && !o.flying && o.setAlpha(focusShelf && o !== obj ? 0.86 : 1));
      if (guided) UI.glowDone(!!nx && nx.e.kind === "click");
      // serving: once every pan is poured the hob steps back and the tray is the focus
      const served = pans.every((q) => q.poured > 0);
      [hob, ...pans.flatMap((q) => [q.img, q.face, q.knob])].forEach((o) => o.setAlpha(served ? 0.88 : 1));
    }

    /* ---------- the start: everyone says how they like it ---------- */
    ctx.nextStep && ctx.nextStep("Water");
    select(pans[0]);
    for (const pan of ctx.requestsSaid ? [] : pans) { // decision 53: said already in the requests pop-up
      speaking = true;
      await personSay(pan);
      speaking = false;
      await Cook.wait(K.speakGapMs || 300);
    }
    talked = true;
    refresh();
    let nudge = setInterval(() => !finished && refresh(), 250);

    /** The review faces, one over each glass (sized to the tray's spacing); the praise is said once, when all are right. */
    async function review(wrongPans) {
      // CK-07: one face per person at the review: the big face over their glass stands in for its small rim badge
      pans.forEach((q) => q.well.face && q.well.face.setVisible(false));
      const ws = pans.map((q) => q.well);
      let gap = 400;
      ws.forEach((a, i) => ws.forEach((b, j) => j > i && (gap = Math.min(gap, Math.hypot(a.x - b.x, a.y - b.y)))));
      // CHAI-08's flaw (the judge, 20 Oct: "Nana's face badge sits over the glass that was just filled"; s08 w6J): the face sits
      // at its glass's upper left, over the rim's edge only, so the chai just poured shows; it is sized so it never reaches the
      // next glass on the tray (was the large face over the dish, CK-07)
      const size = pans.length > 1 ? Math.max(96, Math.min(130, gap * 0.62)) : 150;
      const off = (q) => ((q.well.glass.empty.displayWidth || 120) / 2 + size / 2) * 0.74;
      const allOk = !wrongPans.length;
      // the praise card goes right of the last face; at 4 people that face is the tray's bottom right and
      // the card would run off the view (30 Sept), so then it goes left of the leftmost face instead
      const CARD_W = 230; // "Shabash!" at 34px with its padding, design px (with a margin)
      const vr = (Cook.view && Cook.view.right) || 1600;
      let praise = pans.length - 1;
      let side = "right";
      if (pans[praise].well.x - off(pans[praise]) + size / 2 + 18 + CARD_W > vr - 16) {
        praise = pans.reduce((b, q, j) => (q.well.x < pans[b].well.x ? j : b), 0);
        side = "left";
      }
      return Promise.all(
        pans.map((pan, i) =>
          Cook.Kit.review(S, {
            who: pan.who,
            ok: !wrongPans.includes(pan),
            // (s08 sweep, CK-07's flaw: "Nanu's hanging off the tray's left edge": a face stays on the tray, its left edge
            // inside the tray's own)
            x: Math.max(tray.x + size / 2 + 6, pan.well.x - off(pan)),
            // CK-07 (§14a, S05-C): each face by its own glass (one face per person: its small rim badge goes)
            y: pan.well.y - off(pan),
            size,
            side: i === praise ? side : "right",
            line: allOk && i === praise ? undefined : false,
          }),
        ),
      );
    }

    /* ---------- the tick: check every glass against what its person said ----------
     * Decision 51 (CK-23, S02-A reference wiring): a wrong cup is redone on the spot. The right cups stay done; the
     * wrong one empties (pan and glass), its person's rows open again, and the second try has help (the next thing
     * glows). At the third wrong try the game shows the right way and moves on. The first try is the one scored. */
    let round = 0;
    const emptyPan = (pan) => {
      Object.assign(pan, { level: 0, has: { water: 0, leaves: 0, milk: 0 }, sugar: 0, salt: 0, extras: [], spoons: [], heat: 0, state: "cold", poured: 0, closed: false, spoonsClosed: false, capped: false });
      pan.redo = (pan.redo || 0) + 1;
      setKnob(pan, "off");
      if (pan.heatRing && pan.heatRing.g) pan.heatRing.g.clear();
      pan.bubbles.clear();
      setLook(pan);
      ["empty", "half", "full"].forEach((s2) => pan.well.glass[s2].setAlpha(s2 === "empty" ? 1 : 0));
      pan.well.fill = 0;
      if (pan.well.blackShade) pan.well.blackShade = (pan.well.blackShade.destroy(), null);
      ["half", "full"].forEach((st) => {
        const g = pan.well.glass[st];
        g.blackDone = false;
        const [dw, dh] = [g.displayWidth, g.displayHeight];
        g.setTexture(`v2-glass-${st}`).setDisplaySize(dw, dh);
      });
      UI.mission.reopen(null, dishNo(), { for: pan.who });
    };
    // the right way, shown: their things glow in turn on the shelf while their card is read, then the glass fills
    const showRight = async (pan) => {
      const p = pan.p;
      const ids = ["cook-paani", "cook-chai", p.dudh ? "cook-dudh" : null, p.khun ? "cook-khun" : null, p.extra || null].filter((id) => id && shelf[id]);
      select(pan);
      const said = personSay(pan).catch(() => {});
      for (const id of ids) {
        S.glow(shelf[id], true, { bounce: true });
        await Cook.wait(520);
        S.glow(shelf[id], false);
      }
      await said;
      ["empty", "half", "full"].forEach((s2) => pan.well.glass[s2].setAlpha(s2 === "full" ? 1 : 0));
      pan.poured = 2;
      pan.redo = 0;
      personRows(L(), pan.who).forEach((r) => UI.mission.tickItem(r.ids[0], dishNo(), { for: pan.who, no: r.no, close: true }));
      fx("sparkle", pan.well.x + pan.well.glass.empty.displayWidth * 0.3, pan.well.y - pan.well.glass.empty.displayWidth * 0.3, { w: pan.well.glass.empty.displayWidth * 0.55, ms: 650 });
    };
    for (;;) {
      await doneP;
      finished = true;
      coachEnd();
      hideMic();
      clearInterval(nudge);
      syncTakeBack(); // (Done: nothing comes back out now)
      phase(null);
      unglow();
      UI.hideDone();
      UI.hideCount();
      zb.expect(null);
      const lad = L();
      const dish = dishNo();
      const recasts = [];
      for (const pan of pans) {
        if (round && !pan.redo) continue; // a right cup stays done
        const p = pan.p;
        const name = nameOf(pan.who);
        const made = pan.has.water > 0 && pan.has.leaves > 0 && pan.poured > 0;
        const hasMilk = pan.has.milk > 0;
        const got = { chai: made, milk: hasMilk === !!p.dudh, sugar: pan.sugar === (p.khun || 0) && !pan.salt };
        // SH-50: a wrong extra in the cup marks that person's extra row too (not only a missing one)
        got.extra = p.extra ? pan.extras.includes(p.extra) && pan.extras.every((id) => id === p.extra) : !pan.extras.length;
        const amount = !p.amount ? null : pan.poured >= 2 ? "ph-full" : "ph-half";
        got.amount = !p.amount || (got.chai && amount === p.amount);
        const why = [];
        if (!pan.has.water) why.push(`left out cook-paani for ${name}`);
        if (!pan.has.leaves) why.push(`left out cook-chai for ${name}`);
        if (!pan.poured) why.push(`poured no chai for ${name}`);
        if (!got.milk) why.push(p.dudh ? `left out cook-dudh for ${name}` : `added cook-dudh (they said no) for ${name}`);
        if (pan.sugar !== (p.khun || 0)) why.push(p.khun ? `${pan.sugar} cook-khun, they asked for ${p.khun} (${name})` : `added cook-khun (they said no) for ${name}`);
        else if (p.khun && !round) ctx.listen(true, `${pan.sugar} cook-khun, they asked for ${p.khun} (${name})`);
        if (p.extra && !pan.extras.includes(p.extra)) why.push(`left out ${p.extra} for ${name}`);
        pan.extras.filter((id) => id !== p.extra).forEach((id) => why.push(`added ${id} for ${name}`));
        if (p.amount && got.chai && amount !== p.amount) why.push(`poured ${amount} for ${name}, not ${p.amount}`);
        // CK-TB-01: a wrong spoonful taken back before Done is still this cup's first try (it's not redone, only marked)
        const tookBack = !round && !why.length && !pan.salt ? pan.firstWrong || [] : [];
        const rows = personRows(lad, pan.who);
        const said = rows.filter((r) => !r.unsaid); // (CK-51: the water and the tea rows are on the card, never said)
        const bad = [];
        rows.forEach((r) => {
          const id = r.ids[0];
          const ok = id === "cook-paani" ? pan.has.water > 0 : id === "cook-chai" ? pan.has.leaves > 0 : id === "cook-dudh" ? got.milk : id === "cook-khun" ? got.sugar : id === "ph-half" || id === "ph-full" ? got.amount : got.extra;
          if (ok) {
            UI.mission.tickItem(id, dish, { for: pan.who, no: r.no });
            if (!round && !r.no && !r.unsaid && id !== "cook-khun" && ctx.did && ctx.did.length < 14) ctx.did.push({ line: Lang.wordLine(id), ok: true });
          } else {
            // the first try is the one scored: a redo marks nothing new
            if (!round) UI.mission.missItem(id, dish, { for: pan.who, no: r.no });
            bad.push(r);
          }
        });
        // a wrong cup with no row of its own to blame (a plain chai with an extra in it): its person's first row
        if (!round && (why.length || pan.salt) && !bad.length && said[0]) UI.mission.missItem(said[0].ids[0], dish, { for: pan.who, no: said[0].no });
        // CK-32: at the review the rows found wrong are red on that person's card (it stays open to show them), every try
        if ((why.length || pan.salt) && UI.mission.serveWrong) UI.mission.serveWrong((bad.length ? bad : said.slice(0, 1)).map((r) => r.ids[0]), dish, { for: pan.who });
        if (!round) why.forEach((w) => ctx.listen(false, w));
        if (tookBack.length) {
          tookBack.forEach((t) => t.why && ctx.listen(false, t.why));
          // the row it was about (a spice nobody asked for: the person's extra row, or their first)
          const r0 = rows.find((r) => tookBack.some((t) => t.row === r.ids[0])) || rows.find((r) => !r.no && !r.unsaid && r.ids[0] !== "cook-dudh" && r.ids[0] !== "cook-khun") || said[0] || rows[0];
          if (r0) UI.mission.missItem(r0.ids[0], dish, { for: pan.who, no: r0.no });
        }
        if (!guided && !round) {
          // the water and the leaves are in every chai: a cup made with both is their word used right (Zafar, 20 Oct: then
          // their chips are the speaker alone, like every other jar's; nothing is marked missed for them)
          if (got.chai) ["cook-paani", "cook-chai"].forEach((id) => Cook.markRight(id));
          // CHAI-32 (non-negotiable 4): a word the help showed this round is study: right, it is not counted as known
          const right = (id, also) => !helped.has(id) && !helped.has(also) && Cook.markRight(id);
          (got.milk ? right : Cook.markMiss)("cook-dudh");
          // (a count the jar stopped at its number, L1, is supported counting: it never advances the number word; rule 6)
          if (p.khun && !pan.capped) (got.sugar ? right : Cook.markMiss)(Cook.numId(p.khun), "cook-khun");
          (got.sugar ? right : Cook.markMiss)("cook-khun");
          if (p.extra) (got.extra ? right : Cook.markMiss)(p.extra);
        }
        if (why.length || pan.salt) recasts.push({ pan, rows: !got.chai || !bad.length ? null : bad });
        else {
          pan.redo = 0;
          fx("sparkle", pan.well.x + pan.well.glass.empty.displayWidth * 0.3, pan.well.y - pan.well.glass.empty.displayWidth * 0.3, { w: pan.well.glass.empty.displayWidth * 0.55, ms: 650 });
        }
      }
      // the review (29 Sept, X10 / Q1: Cook.Kit.review): each person's big round face over their glass,
      // happy when it's right, a gentle frown when it's wrong (then they say again what they asked for)
      Cook.chaiServe = recasts.length ? "wrong" : "right"; // for the screenshot script
      const looks = await review(recasts.map((r) => r.pan));
      if (recasts.length) {
        if (!round) await zb.oops();
        for (const { pan, rows } of recasts) {
          select(pan);
          await personSay(pan, rows || undefined);
        }
      }
      await Promise.all(looks.map((l) => l.close()));
      pans.forEach((q) => q.well.face && q.well.face.active && q.well.face.setVisible(true));
      if (!recasts.length || !ctx.redo) break;
      // decision 51: each wrong cup is redone, or (its third wrong try) shown the right way
      const again = [];
      for (const { pan } of recasts) {
        const r = ctx.redo.wrong(`chai:${pan.who}`);
        if (r.action === "show") await showRight(pan);
        else again.push(pan);
      }
      if (!again.length) break;
      round++;
      again.forEach(emptyPan);
      finished = false;
      doneShown = false;
      doneP = new Promise((r) => (finishUp = r));
      select(again[0]);
      nudge = setInterval(() => !finished && refresh(), 250);
      refresh();
    }
    stopHeat();
    if (mic) mic.remove();
    mic = null;
    [...pans.flatMap((q) => [q.img, q.face, q.knobHit]), ...Object.values(shelf)].forEach((o) => S.untap(o));
    Object.values(shelf).forEach((o) => o.chip && o.chip.disableInteractive());
    await Cook.wait(500);
    zb.close();
    zt.close();
    return {
      served: pans.filter((q) => q.poured > 0).length,
      cups: pans.map((q) => ({ who: q.who, milk: q.has.milk > 0, sugar: q.sugar, salt: q.salt, extras: q.extras, level: q.poured / 2 })),
    };
  }

  Mech.lab("chai-tray", {
    name: "Chai tray",
    verb: "Combined: pans, knobs, pour",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.chai.make("nana", { level: L.level });
      L.ctx.steps = R.chai.steps(d);
      L.card(d, L.ctx.steps);
      await L.station("chai-tray", { cups: d.cups });
    },
  });
})(window);

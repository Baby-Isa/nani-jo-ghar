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
import { NjgServe } from "../../shared/serve.js"; // the kitchen kit's serving (Sprint 18 piece 8): the review faces, the tick and the recast

(function (global) {
  const Cook = CookNS;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  const V2 = "assets/cook/items/chai-v2/";
  // 30 Sept (C8 / X9): the pan's contents are pictures, one per stage of the brew, all on one registered
  // canvas (the rim's centre lines up in all nine), so they cross-fade on the burner without moving
  // what build/cut_chai_v2.py measured (kept here so the station needs no extra fetch)
  const META = {
    // the v3 pan (v3/chai/meta.json): cx, cy = the canvas's registration point, the rim's measured centre
    // (handle left out), the same in all nine pictures. body: the rim's own radius (the heat gauge sits on
    // it, inside the flames); rIn: the contents' radius (the bubbles stay inside it); r: the size it's drawn
    // at, 1.087 x the body as with v2's pan, so the flame and heat rings (sized to panR) peek out around it
    panTop: { w: 405, h: 389, cx: 0.3754, cy: 0.6146, r: 0.3525, rIn: 0.3012, body: 0.3243 },
    glassR: 0.94,
  };
  /*
   * CHAI-34, CHAI-08, CK-06 (Zafar, 29 Oct: "the pouring pans didn't work so now I'm switching to just having the pans move
   * above the glasses and empty and the glasses fill up"): the s14 pour, the pan emptying over its glass while the glass fills,
   * milky and black, each picture by its own measured rim: chai's frames, the resting glass and the pour's measures are its data
   * (data/stations/chai-tray.json kit.glass), played by the kitchen kit (Mech.pour.toGlass, Sprint 18 piece 7).
   */
  // the handle's end from the contents' centre, in rim radii (the empty picture's), for the spacing of pans on the hob
  const HANDLE_REACH = (514 - 203.8) / 158; // (s14: the empty picture's handle end over its rim radius)
  /* ---------- the grid (design px, 1600x900; the canvas is the play area) ---------- */
  const SHELF_TOP = St.SHELF.top; // §3: the scene is the top 70%, the shelf band the bottom 30% (SH-112)
  const FAR = 2000; // backgrounds reach past the design box (the stage fill: Cook.view)
  const BASE = 818; // the shelf line: every object stands on it
  const BOX = 128; // a slot's fallback box (a word without shelf art)
  // ART-51 (Zafar, 6 Nov: size classes, never true sizes): each shelf item stands at its class's share of the band's room (L 100 /
  // M 91 / S 84, the class in data/cook.json, St.classFit), never under 40 CSS px; was the per-group SHELF_K over the pantry-v2
  // canvases (28 Sept, PAN-09, SH-112)
  const PITCH = 172;
  const GROUP_GAP = 44;
  const CHIP = { w: 128, h: 46, y: 860 }; // (a word pill's card and its line: the shared kit's Shelf.PILL, Shelf.BAND.chipY)
  const SHADE = 0x28190a; // (chai's card shadow under the pills and the word pop; the kit's token is shade-rgb)
  const HOB_K = 0.79; // the mock-up's hob, 15% bigger (§10)
  const TRAY_D = 392;
  const GAP = 72;
  const PAN_R = 112; // a pan's outer rim, design px
  const BADGE = 64;
  // the tray's cut-outs: each opening's middle (CHAI-08, Zafar 22 Oct: "not centred in the cup holder": measured on the tray
  // picture, s12-w3b: the opening's lower bevel shows, so its middle is lower than the old 0.279 / 0.697)
  const WELLS = [[0.283, 0.29], [0.717, 0.29], [0.283, 0.708], [0.717, 0.708]];
  const WELL_D = 0.33;
  const COL = { water: St.WATER, chai: 0x8a4a22, milk: 0xf6f1e7, glass: 0xc98a52 };
  const INK = { get text() { return global.Tokens.cookInk().text; }, get kutchi() { return global.Tokens.cookInk().kutchi; }, card: 0xffffff, get grey() { return global.Tokens.cookInk().grey; }, get gold() { return global.Tokens.cookInk().gold; }, get panel() { return global.Tokens.cookInk().panel; }, get page() { return global.Tokens.cookInk().page; } }; // the central tokens (SH-151)
  const FONT = () => (global.Tokens && global.Tokens.font ? global.Tokens.font("word") : ""); // the central type's drawn-word font (SH-151)
  const WEIGHT = () => (global.Tokens && global.Tokens.weight ? global.Tokens.weight("drawn", "800") : "800"); // and its weight (SH-223: Lora 600 on chai)
  const jarUrl = (id) => `assets/cook/items/shelf-${id}-bare-f.webp`;
  // the small-jar family for every spice slot: the art run's jars with lids that differ (art.s02 "spice-jar-*", C5; the
  // ginger jar replaces the old one that read as gummies, C24) once they land, else the v2 jars
  const SPICE_JAR = { "veg-14": "assets/cook/items/shelf-veg-14-jar-f.webp", "veg-13": "assets/cook/items/shelf-veg-13-jar-f.webp" };
  // ART-50 (Zafar, 6 Nov: "swap the chai shelf jars in one change once cut and judged"): the stove-400 walnut set first
  // (data/cook.json art.chaiShelf: FA01's eight and FJ01's cumin and mustard, one batch); the old pictures stay as the fallback
  const spiceJar = (id) => {
    const cs = (Cook.data.art || {}).chaiShelf || {};
    if (typeof cs[id] === "string") return cs[id];
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
   * The pour is this pan itself (its emptying frames, kit.glass), never another picture.
   */
  // CHAI-34 (Zafar, 27-29 Oct: "the chai to sit nicely in the pan that's exactly top down"): the s14 pan, exactly overhead, six
  // pictures on one registration, the v3 boil and foam cut to its contents circle, each stage's pictures (CK-06: nothing drawn), the
  // glow ring (CHAI-25), the chosen pan and the spoonfuls (SH-32): the kitchen kit's pan (Cook.Kit.pan, Sprint 18) with chai's values
  // (data/stations/chai-tray.json kit.pan: mirrored, CHAI-26; turn 0, Sprint 11; the handle's wedge, CHAI-12; CHAI-63's black boil)
  /*
   * Sprint 11 (the painted effects, pack s11; the coordinator, 22 Oct): splash (something lands in the pan or the glass:
   * CK-27's "it went in"), steam (the boil), sparkle (a finished, served glass). Brief and small over the motion on the real
   * art: scale in, fade out in about half a second. No code-drawn dots, rings or sparkles. (The shine is held back.)
   */
  // (ART-31, 1 Nov: the splash went, so it is no longer loaded; the steam and the sparkle waited for the next art run, decision 2)
  // CHAI-92 (Zafar's picks, 6 Nov, lab/juice.html): that run's effects, art run s17-juice (assets/shared/juice/), drawn by name through
  // the Phaser twin of the juice kit (js/shared/juice.js Juice.P), never through Cook.Stations' sparkle/steam stubs (S.verdict's): the
  // full wisps (steam 1) over a boiling pan and a boil-over, the three twinkles (sparkle 2) over a full glass, the painted last drop
  // into the tray's glass. Loaded after the station starts (nothing waits on them; a sprite not in yet is not drawn). The s11 steam
  // and sparkle are no longer loaded.
  const JUICE_ART = ["sk-2", "sk-3", "sk-4", "sk-5", "st-1", "st-2", "st-3", "td-1", "td-2"].map((n) => [`fx-juice-${n}`, `assets/shared/juice/${n}.webp`]);
  // (and its picked sounds, js/shared/sfx.js FILES: fetched at the start too, so each plays on its moment, never late)
  const JUICE_SFX = ["knob", "flame", "simmer", "green", "glass", "settle", "sparkle", "pour-tea", "pour-glass", "pour-short"];
  // the station's art (CHAI-08, s14: the glasses exactly from above, each placed by its rim; the half glass is the fill's frame 4, the
  // full one its frame 6, so a glass rests as the pour left it); KG: chai's kit.glass
  const ART = (KG) => [["v2-tray", V2 + "tray-4-cutout-t.webp"], [KG.rest.key, KG.rest.file]]
    .concat(...["milky", "black"].map((set) => restOf(KG, set).map((m) => [m.key, m.file])))
    .concat(...[1, 2, 3, 4].map((n) => Cook.Kit.art(n, []))) // the shared kitchen kit: hobs, knobs, flames
    .filter(([key], i, a) => a.findIndex(([k2]) => k2 === key) === i);
  // the half and the full glass of a set (fill frames 4 and 6): on the tray from the start
  const restOf = (KG, set) => [KG.frames[set].glass[KG.half - 1], KG.frames[set].glass[KG.frames[set].glass.length - 1]];
  // the 24 pour frames (about 1.5 MB) are needed only at the pour: loaded after the station starts, so a new level is not held for
  // them (Zafar, 29 Oct: "the loading on a new level takes extra long"); the pour waits for them only if they are not in yet
  const ART_POUR = (KG) => ["milky", "black"].flatMap((set) => KG.frames[set].pan.concat(KG.frames[set].glass.filter((m) => !restOf(KG, set).includes(m)))).map((m) => [m.key, m.file]);
  // CHAI-14 / CHAI-07 (C9): a cup with no milk is black tea, in the pan, the stream and the glass. The art run's glasses
  // (art.s02) replace the stand-in: until then the glass is tinted darker.
  // CHAI-22 (P33): milk, water and the leaves go in once each; a second tap wiggles
  const ONCE = { "cook-paani": "water", "cook-dudh": "milk", "cook-chai": "leaves" };
  /** A test hook (only logged) for the contract checks (build/sandbox/lib/contract-chai.mjs): what the tray just did. */
  const note = (what, step, by) => {
    try {
      if (global.Lifecycle && global.Lifecycle.note) global.Lifecycle.note(what, { step: String(step), by: String(by) });
    } catch (e) {
      /* only a log */
    }
  };

  /*
   * SH-155 (Zafar, 29 Oct, round 4): chai's level rules are the central rules' (data/rules.json, read only through js/shared/rules.js:
   * window.Rules, loaded with the tokens): its cups by level (Rules.counts), decoys and lookalike, the order card's English and
   * picture, the hint waits, the order card's light, the big card's holds, the first-time hold of the knob, the word pill and the
   * level-up. None of those numbers is kept here or in chai's data (build/test_shared_rules.mjs checks it).
   */
  const RULES = () => global.Rules || (global.Tokens && global.Tokens.rules) || null;
  const rulesAt = (lv) => (RULES() ? RULES().level(lv) : { decoys: 1, lookalike: false, hintMs: 0 });
  // (the cups by level: the recipe's count is the rules' count for chai, filled in as Cook's data loads: js/cook/flow.js rulesCounts)

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

  // CHAI-91 (Zafar, 6 Nov, L4 on his phone): a look whose picture is not in yet shows the nearest look that is (Cook.Kit.pan.look)
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

  async function station(host, params) {
    Cook.serveTicks = new Set(["ph-half", "ph-full"]); // (SH-206: the glass ticks these as it is poured)
    Cook.shelfJars = true; // (the order's cards take this shelf's jars from the first card drawn: Zafar, 3 Nov, SH-200)
    const S = host.S;
    const ctx = host.ctx;
    const K = host.knobs;
    const zb = host.zones.boil;
    const zt = host.zones.tray;
    const guided = !!ctx.guided;
    const level = zb.level;
    const people = (params.cups || []).slice(0, 4);
    const n = Math.max(1, people.length);
    // Zafar, 29 Oct (chai level rules 6): chai's own heat by level over the tray profile (data/stations/chai-tray.json heat); the
    // kitchen kit's heat and boil (Mech.boil, Sprint 18) runs it
    const kBoil = Mech.boil.settings({ level: K.boilLevel || level, profile: "tray", heat: K.heat });
    const kCount = Mech.knobs("count", { level });
    // chai's values for the kitchen kit's pan (data/stations/chai-tray.json kit.pan; Cook.Kit.pan)
    const KIT = ((Cook.data.settings || {})["chai-tray"] || {}).kit || {};
    const KP = KIT.pan;
    // chai's values for the kit's pan into its glass (kit.glass: the frames, the resting glass, the lift, gap and times; Mech.pour.toGlass)
    // and its shelf's pour (kit.shelf: Mech.pour)
    const KG = KIT.glass;
    const halves = people.some((p) => p.amount); // level 4: half or full
    // how many pours a glass takes to hold what was asked (L4: half 1, full 2; below L4 one tap fills it)
    const needOf = (q) => (halves ? (q.p.amount === "ph-half" ? 1 : 2) : 2);
    /*
     * Sprint 14 (the kit's s14 look, on for chai: lab/cards.html, Zafar 27-28 Oct): the light (Onboard.look "s14": no finger, a
     * thing to tap lit in a lighter dim), Nani's helper card in place of the call-out card (CHAI-35, SH-149), and the first-time
     * steps (a new player sees all of them, a returning player none): after the first two items the whole order card lit for
     * 1.2 s (CHAI-37); the first hint teaches the arrow; the first time words are dotted, the dots lit once ("tap the dots").
     */
    const s14 = !!(UI.s14 && UI.s14());
    const OB14 = global.Onboard;
    if (s14 && OB14) {
      OB14.look = "s14";
      // (reset by UI.applyS14 when a round without the s14 look starts: the service scene after the tray keeps chai's look)
    }
    const seen14 = (Cook.save.seenStation = Cook.save.seenStation || {});
    // SH-159: the word pill (the s14 look): the core's per-word flag; elsewhere the chip as before (Cook.chipWord)
    const P14 = () => (s14 && Cook.core && Cook.core.progress && Cook.core.progress.pillShows ? Cook.core.progress : null);
    const pillShows14 = (id) => (P14() ? P14().pillShows(id) : Cook.chipWord(id, ctx));
    const pillNote = (id) => {
      try {
        const r = P14() && P14().get(id);
        if (r && global.Lifecycle && global.Lifecycle.note) global.Lifecycle.note("pill", { step: id, by: JSON.stringify({ n: r.pillRun || 0, e: r.pillEarned ? 1 : 0, s: r.pillHidden ? 0 : 1 }) });
      } catch (e) {
        /* only a log */
      }
    };
    const STATION14 = "chai-tray";
    const S14_TAG = "s14-";
    // (the kitchen kit's first-time gate, Cook.Coach.firsts: chai's lights once each for a new player; the lessons every game
    // shares once a round for the New player, CHAI-102)
    const gate14 = Cook.Coach.firsts(STATION14, { round: new Set() });
    const CONTROL_PAUSE_MS = 1000; // (Zafar, 30 Oct: a second's pause before a control's light and call, after the last move)
    const READ_AT_POUR = false; // (Zafar, 30 Oct: the pour says nothing; see the pour below)
    // CK-49 (the level table): the spice row is what the cups ask for and 1, 2, 3, 3 decoys (a lookalike among them at L4,
    // sugar's lookalike counts), at most five jars (the shelf's slots narrow to fit)
    // (the salt, sugar's lookalike, is always the first decoy: the lab's #mistake tries it, CHAI-04)
    const askedX = [...new Set(people.map((p) => p.extra).filter(Boolean))];
    const SALT = "spi-16";
    // (Zafar, 29 Oct, rule 5: up to 4 decoys and no salt before L4: the station's other spice jars, its teaDecoys spi-02 and spi-05, join the pool)
    const spicePool = (K.extras || []).concat(K.decoys || [], K.teaDecoys || []).filter((id, i, a) => a.indexOf(id) === i && id !== SALT);
    // SH-132 (contract-37: L3 put out 2 where the table wants 3): the decoys are the table's whatever the cups ask for; the row may hold
    // up to seven jars (the shelf's slots narrow to fit, below: slotW). Was: at most five jars, so three asked extras left room for two
    // Zafar, 29 Oct (chai level rules 5; SH-155): the decoys by level from the central rules (data/rules.json levels.decoys and
    // lookalike, through js/shared/rules.js), capped by the shelf's space; the salt (sugar's lookalike) only where the rules
    // want a lookalike (L4): at L1-L3 every decoy looks clearly unlike what was asked (it made L1 harder)
    const row14 = rulesAt(level);
    const nSpice = Math.max(1, Math.min(row14.decoys, 7 - askedX.length));
    const salted = !!row14.lookalike;
    const spiceIds = Cook.shuffle(
      salted
        ? askedX.concat(SALT, St.tableDecoys(spicePool, askedX.concat(SALT), level, { n: nSpice - 1, also: 1, alsoLook: true, what: "spices", station: "chai-tray" }))
        : askedX.concat(St.tableDecoys(spicePool, askedX.concat(SALT), level, { n: nSpice, what: "spices", station: "chai-tray" }))
    );
    const shelfIds = [["cook-paani", "cook-dudh"], ["cook-chai", "cook-khun"], spiceIds];
    // (Zafar, 3 Nov: "the bottle of ginger on the item card is different from the bottle of ginger on the shelf ... the one on the shelf
    // is the correct one": the order's word cards take the very picture the shelf draws, so they can never drift apart)
    const shelfSet = new Set([].concat(...shelfIds));
    Cook.shelfPic = (id) => (shelfSet.has(id) ? spiceJar(id) : null);
    /*
     * CK-06 (Zafar, 1 Nov: "I thought we had like proper visuals for elchi in the tea and ginger in the tea ... I think we should";
     * decision 3a): a spice in the pan is a picture, never drawn: one elchi pod from the props' five pods (assets/cook/props/elchi.webp,
     * its front pod at the bottom left) and one ginger slice from the three (chai-v2/ginger-slices-t.webp, the bottom left one), each
     * cut from its picture by its own outline (an ellipse round it, measured on the source) as the station starts; loaded only when
     * that spice is on the shelf (decision 68)
     */
    const SPICE_PIC = {
      "spi-10": { key: "chai-elchi-src", file: "assets/cook/props/elchi.webp", cut: [115, 107, 70, 29], w: 0.4, n: 2 },
      "veg-14": { key: "chai-ginger-src", file: `${V2}ginger-slices-t.webp`, cut: [65, 157.5, 59, 54], w: 0.3, n: 1 },
    };
    const onShelf = [].concat(...shelfIds);
    const spiceArt = Object.keys(SPICE_PIC).filter((id) => onShelf.includes(id)).map((id) => [SPICE_PIC[id].key, SPICE_PIC[id].file]);
    // real-time cap (St.loadArt): a Cook.wait cap shrank at test speed and the faces, tip frames and glasses missed it
    // (Phaser's green missing-texture box where Nana's face goes, the pan never tipping: CHAI-25, CK-04, CK-13, CHAI-08)
    await St.loadArt(
      S,
      ART(KG).concat(
        Cook.Kit.pan.art(KP), // the pan's looks and its contents pictures (the kitchen kit's pan, chai's set)
        St.artLoad(["teaspoon", "teaspoon-empty", "teaspoon-chai"]), // CHAI-13: TP1's three teaspoons
        people.flatMap((p) => Cook.Kit.faceArt(p.who)),
        [].concat(...shelfIds).map((id) => [`jar-${id}`, spiceJar(id)]),
        spiceArt
      )
    );
    // the cut: the source picture's pixels inside the outline, onto a canvas texture (pixels only, nothing drawn)
    const spiceTex = (id) => {
      const sp = SPICE_PIC[id];
      if (!sp) return null;
      const key = `${sp.key}-cut`;
      if (S.textures.exists(key)) return key;
      if (!S.textures.exists(sp.key)) return null;
      try {
        const src = S.textures.get(sp.key).getSourceImage();
        const [cx, cy, rx, ry] = sp.cut;
        const cv = document.createElement("canvas");
        cv.width = Math.ceil(2 * rx);
        cv.height = Math.ceil(2 * ry);
        const g = cv.getContext("2d");
        g.beginPath();
        g.ellipse(rx, ry, rx, ry, 0, 0, Math.PI * 2);
        g.clip();
        g.drawImage(src, cx - rx, cy - ry, 2 * rx, 2 * ry, 0, 0, 2 * rx, 2 * ry);
        S.textures.addCanvas(key, cv);
        return key;
      } catch (e) {
        return null;
      }
    };
    // (CHAI-92: the s17 effects load with the pour's frames, after the start: one load, so none waits on a loader already busy)
    const pourArt = St.loadArt(S, ART_POUR(KG).concat(JUICE_ART)).catch(() => {});
    if (Cook.sfx.preload) Cook.sfx.preload(JUICE_SFX);
    /*
     * CHAI-08, CHAI-34 (s14): a glass's picture by its own rim: its rim's centre on the well's middle, its rim's radius the
     * well's (every s14 glass and fill frame is cut a little differently, so each is placed by its own measure). The half
     * glass (L4's adh) is the fill's frame 4, the frame the pour stops on, and the full glass its frame 6 (no picture composed
     * in code; CHAI-31's recolour went with the s08b pan: the s14 pans and glasses are one run's colours).
     */
    const HALF_FULL = { "v2-glass-half": restOf(KG, "milky")[0], "v2-glass-black-half": restOf(KG, "black")[0], "v2-glass-full": restOf(KG, "milky")[1], "v2-glass-black-full": restOf(KG, "black")[1] };
    const GL = { [KG.rest.key]: KG.rest };
    Object.keys(HALF_FULL).forEach((k) => (GL[k] = HALF_FULL[k]));
    ["milky", "black"].forEach((set) => KG.frames[set].glass.forEach((m) => (GL[m.key] = m)));
    const glassTex = (key) => (HALF_FULL[key] ? HALF_FULL[key].key : key);
    const glassLook = (im, key, R) => {
      const m = GL[key];
      const t = glassTex(key);
      if (im.texture.key !== t) im.setTexture(t);
      im.glassR = R || im.glassR;
      return m ? im.setOrigin(m.cx / m.w, m.cy / m.h).setScale(im.glassR / m.r) : im;
    };
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
    const phase = (key, id, pick) => {
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
      // SH-205 (Zafar, 4 Nov evening, L2: "input all the items in pan 1 and set it to boil. While pan 1 is boiling, add the first two
      // items to pan 2, then stop pan 1 at the correct time and pour. Shortly after ... it will say ginger (when it should reset the
      // hint timer after the pour as that's a correct action"): after the pour the step is picking pan 2, its line pan 2's next item;
      // the tap it waits for is the pan, not an item, so the item's rule (said only as her card opens, SH-172) missed it and the line
      // was said at once as a control's call. A pick's step is never called: its line comes with the pick's own light, after the wait
      steps.to(key, { id: sid, line: stepLine(key, id), noCall: pick ? "pick" : null });
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
    // SH-108 reopened (Zafar, 27 Oct: "chai has the old stand in background, not the modern countertop"): a lighter wash, so the
    // painted marble reads as marble on a phone (at 0.5 it read as the old plain stand-in)
    // (Zafar, 5 Nov: the worktop and the stone "should just sing off each other": the wash in the stone's undertone, St.worktopWash)
    Cook.Kit.worktop(S, { top: SHELF_TOP, far: FAR }); // (the kitchen kit's wash: 0.18 over the worktop at D.bg + 1)
    // ART-41 (Zafar, 5 Nov): the band in his stone, with the stone shelf the jars stand on (St.stoneBand; was the parchment fill
    // and a grey plank line under each group; its 3 px top shade is the band's own now, SAM-29)
    St.stoneBand(S, { top: SHELF_TOP, base: BASE, far: FAR, depth: D.bg + 1.2 });

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
    // Sprint 11 (turn 0): each pan's handle lies level, so a pan is sized to clear the next one's rim with its handle (a
    // rim's radius is 0.92 of panR: META.panTop). CHAI-26 (mirrored, 23 Oct): the handles point left, so the first pan's
    // handle reaches past the hob's LEFT edge: the row keeps that much room on the left, and the tray sits a plain gap to
    // the right (only the spout faces it)
    const HS = Cook.Kit.HOB.sets[n];
    const pitch0 = n > 1 ? (HS.burners[1][0] - HS.burners[0][0]) * hobW * k : Infinity;
    const panR0 = Math.min(Math.min(PAN_R, pitch0 * 0.4) * (k / HOB_K), (pitch0 - 12) / (0.92 * (HANDLE_REACH + 1)));
    const overL = Math.max(0, panR0 * 0.92 * HANDLE_REACH + 14 - HS.burners[0][0] * hobW * k);
    const gap = GAP;
    trayD = Math.min(trayD, Math.max(TRAY_D * 0.72, 1600 - 2 * 48 - overL - hobW * k - gap));
    const total = overL + hobW * k + gap + trayD;
    const hobX = Math.max(48 + overL, (1600 - total) / 2 + overL);
    // (Zafar, 5 Nov evening, his laptop: "is there a reason why the stove and the tea tray and the general gameplay area is centred where
    // it is height-wise? ... a lot more space on top ... it would just feel more natural if it was centred in the space ... both X and Y
    // axis, including the gameplay area ... big enough to accommodate all the items that will or currently appear"): the play group
    // (the hob, the tray and the room the count pills take above the hob) is centred in the worktop that shows, between the view's top
    // and the shelf; was: low, just above the shelf, so a taller stage's extra worktop all went above it
    const viewTop = (Cook.view && Cook.view.top != null ? Cook.view.top : -ey);
    const ppw = (() => { try { return UI.worldToScreen(1, 0).x - UI.worldToScreen(0, 0).x || 1; } catch (e) { return 1; } })();
    const PILL_ROOM_Y = 50 / ppw; // (a count pill, 40 CSS px, and its gap above the hob's rim: js/shared/tally.js)
    const spanTop = viewTop + 16;
    const spanBot = SHELF_TOP - SHELF_GAP;
    const hobY = Math.min(spanBot - hobH, Math.max(viewTop + 40, spanTop + (spanBot - spanTop - (hobH + PILL_ROOM_Y)) / 2 + PILL_ROOM_Y));
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
    const s8 = rimR / KP.rim; // the pan pictures' scale
    const rIn = KP.inner * s8;
    // where a pan's heat ring is (the gauge's place for the test hook njgTest.cook.gauge().box; s04-hooks): the ring and its track
    const ringAt = (pan) => ({ x: pan.x, y: pan.y, r: rimR + 10 });
    const pans = people.map((p, i) => {
      // the kit's burner: the flame ring peeking out under the pan; their face (= hear them) and the knob on the front edge
      // the flames peek just past the rim, as in the approved mock-up (29 Sept: at panR two burners' flames met)
      const b = Cook.Kit.burner(S, kHob, i, { who: p.who, flameR: rimR * 0.97 });
      const { face, knob, kOff, kOn, knobHit, flameHi, flameLo } = b;
      // the kitchen kit's pan (CHAI-08, 22 Oct: its outline centred on the burner): `img` and `disc` show one stage, `mix` and `mixDisc`
      // the next fading in over it; the handle drawn again over the heat ring (CHAI-12); the spoonfuls on the surface (SH-32); the glow
      // ring (CHAI-25); the chosen pan's pool and face ring (G1). Chai says which look (lookOf) and what lies on the surface (heapsOf)
      const pan = Cook.Kit.pan(S, { at: { x: burners[i], y: kHob.burners[i].y }, rimR, panR, set: KP, lookOf: (q) => lookOf(q), heaps: (q) => heapsOf(q), spoonWet: (q) => (q.has.milk > 0 ? "chai" : "empty"), sel: { badge: BADGE } });
      // (Zafar, 29 Oct: "part of the handle looks like it covers the loading circle, by the green area": the ring over the handle,
      // which is drawn again at D.fx - 1.9 over every pan state)
      const heatRing = Cook.Kit.heatRing(S, { depth: D.fx - 1.85 });
      Object.assign(pan, {
        i, p, who: p.who, ring: heatRing.g, heatRing, burner: b, face, knob, kOff, kOn, knobHit, flameHi, flameLo,
        level: 0, has: { water: 0, leaves: 0, milk: 0 }, sugar: 0, salt: 0, extras: [],
        heat: 0, state: "cold", poured: 0, closed: false, spoonsClosed: false, look: 0,
      });
      return pan;
    });
    const wells = people.map((p, i) => {
      const [fx, fy] = WELLS[i];
      const wx = trayX + fx * trayD;
      const wy = trayY + fy * ((trayD * 754) / 768);
      const gR = (WELL_D * trayD) / 2; // (the rim's radius: the cut-out's)
      const glass = {};
      // (CHAI-08: 480 x 466, the rim from exactly above filling the cut-out)
      ["empty", "half", "full"].forEach((st) => (glass[st] = glassLook(S.track(S.add.image(wx, wy, glassTex(`v2-glass-${st}`))), `v2-glass-${st}`, gR).setDepth(D.item + 0.5).setAlpha(st === "empty" ? 1 : 0)));
      // CHAI-65 (Zafar, 1 Nov night: "the face is next to the tea. I think we should put them at the corners. So for the top left glass,
      // put it in the top left corner ... There's a bit of natural space there"): each orderer's face in its own glass's corner of the
      // tray (was CHAI-18's place: the side rim at the glass's height), never over the glass
      const left = fx < 0.5;
      const top = fy < 0.5;
      // SH-139 (Zafar, 27 Oct and again 1 Nov: "the face icons next to the chai trays probably should be a little bit bigger"): as big
      // as the burner faces (the kit's BADGE, 64), and on a small screen at least 30 px as seen, up to 90
      const perPx = Math.max(0.01, UI.worldToScreen(1, 0).x - UI.worldToScreen(0, 0).x || 1);
      const trayH = (trayD * 754) / 768;
      // (the corner, and the glass's centre measured from it)
      const cx0 = left ? trayX : trayX + trayD;
      const cy0 = top ? trayY : trayY + trayH;
      const gx = Math.abs(wx - cx0);
      const gy = Math.abs(wy - cy0);
      // its centre along the corner's diagonal, k in from each edge: wholly inside the corner where the gap allows (k = fd / 2 + 4),
      // else further out over the corner (never past its middle, k = 0), 4 px clear of the glass's rim; it shrinks only if even at the
      // corner it would touch the glass
      const clear = (k, d) => Math.hypot(gx - k, gy - k) >= gR + 4 + d / 2;
      let fd = Math.min(90, Math.max(BADGE, 30 / perPx));
      let k = fd / 2 + 4;
      while (k > 0 && !clear(k, fd)) k -= 1;
      while (fd > 24 && !clear(Math.max(0, k), fd)) fd -= 2;
      k = Math.max(0, k);
      // SH-183 (Zafar, 1 Nov, his 7-faded-faces.png: "faces shouldn't be faded they should have full contrast and 'sit on top'"):
      // over the tray's quiet veil and every picture: the badge depth (a pan pouring passes over them: SH-183 amended)
      const face = S.track(S.add.image(left ? cx0 + k : cx0 - k, top ? cy0 + k : cy0 - k, roundBadge(S, p.who)).setDisplaySize(fd, fd).setDepth(D.badge).setAlpha(1));
      return { x: wx, y: wy, r: gR, glass, face, fill: 0 };
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
    // (the test hook js:Cook.chaiBusy: a pour or a spoon in flight; CHAI-61's probe reads the lit pans' heat against it)
    Cook.chaiBusy = () => busy;
    Cook.chaiPans = () => pans.map((q) => ({ who: q.who, state: q.state, heat: q.heat, lo, hi, milk: q.has.milk > 0, leaves: q.has.leaves > 0, extras: q.extras.length, spicePics: Object.keys(q.spicePics || {}).length, shown: q.shown, poured: q.poured, need: needOf(q), closed: q.closed, sugar: q.sugar, khun: q.p.khun || 0, at: UI.worldToScreen(q.x, q.y), knobAt: q.knob ? UI.worldToScreen(q.knob.x, q.knob.y) : null }));
    // (the test hooks for the evidence probes, js:Cook.chaiAmounts and js:Cook.chaiFaces: read only)
    // CHAI-55: who asked half or full, in seat order, and the words' stages (the rule: data/cook.json chai cups.amount teach)
    Cook.chaiAmounts = { cups: people.map((p) => ({ who: p.who, amount: p.amount || null })), stages: { "ph-half": Cook.wordStage("ph-half"), "ph-full": Cook.wordStage("ph-full") } };
    // SH-139: each face's drawn size, in design px and on screen, beside the tray's
    Cook.chaiFaces = () => {
      const px = (d) => Math.round(d * (UI.worldToScreen(1, 0).x - UI.worldToScreen(0, 0).x) * 10) / 10;
      return {
        tray: { d: Math.round(trayD), screen: px(trayD) },
        trayFaces: wells.map((w) => ({ d: Math.round(w.face.displayWidth), screen: px(w.face.displayWidth) })),
        burnerFaces: pans.map((q) => ({ d: Math.round(q.face.displayWidth), screen: px(q.face.displayWidth) })),
      };
    };

    /* ---------- the shelf: identical slots, grouped, a chip under each ---------- */
    // CHAI-66 (Zafar, 1 Nov night: "the items at the bottom aren't in line with the tea tray and the tea hobs on the top ... There
    // should be the equal amount of space between the juru and the right edge of the tea board as there is the water bottle on the
    // left edge of the teapot"): the row centred under the hob-and-tray span (the first pan's handle to the tray's right edge), so the
    // two ends' gaps match. It still keeps clear of the tick at the bottom right: where a centred row would reach it (nine or ten
    // jars at L3-L4), the slots narrow, so the row stays centred and clear
    const spanL = hobX - overL;
    const spanR = trayX + trayD;
    // (Zafar, 5 Nov evening, L4 at his laptop: "can you see the word pills of the items on the shelf are touching? We had a rule ...
    // they could basically have space to spread out more and avoid overlapping": the right edge kept 190 px clear for the old tick
    // button, which chai no longer draws, so with three pans the row was squeezed short of the tray's edge. The margins are the view's
    // own edges now, 40 px in)
    const VL = (Cook.view && Cook.view.left != null ? Cook.view.left : 0) + 40;
    const VR = (Cook.view && Cook.view.right != null ? Cook.view.right : 1600) - 40;
    // SH-208 (Zafar, 4 Nov: "the pills are like overlapping ... where there's space to spread them out more ... we should try to do
    // that"; then, his screenshot: "The items should be centered between the red dotted lines (furtherest edges of in game objects on
    // both sides)"): the row is always centred on the hob-and-tray span (the pan's handle to the tray's right edge). Under that span
    // while the pills fit (CHAI-66); where they would touch, it widens evenly on both sides as far as the play area's margins let it
    // (the left margin and the tick's clearance, whichever is nearer the centre); past that the groups' gaps close to 20 px, then the
    // pills sit close
    // SH-219 (Zafar, 6 Nov: "the text in the pills and the speaker button next to the pills are super small on mobile ... it should follow
    // some logic or principle or scaling rule or minimum ... so the solution works nicely as a rule for all screens"): a word pill grows
    // until its word is at least PILL_MIN_CSS on screen (the platforms' smallest readable label), the speaker with it; never past
    // PILL_MAX (what the shelf band holds under the jars), and never so wide that two pills touch (the row's rule, below). A laptop
    // already shows it larger and keeps 1
    // SH-219 again (Zafar, 6 Nov 01:40: "do it now for chai so no surprises later"): each pill is as wide as its own face (the word's
    // measured width, the speaker and the padding; a speaker-only pill narrower), so a crowded row grows its words towards the floor
    // where short words and speaker-only pills leave room. The rule stays: the floor, at most 1.5x, never touching (PILL_GAP apart)
    // (the shared kit's shelf, piece 9-10: js/shared/shelf.js Shelf.slots lays the row; Shelf.pillWant, .pillRoom, .pillScale the pills)
    const Shelf = global.Shelf;
    const PILL_GAP = Shelf.pillGap(ppw); // (at least 5 CSS px between two pills)
    const rowIds = shelfIds.flat();
    const natW = {};
    const measureW = (id) => {
      if (natW[id] == null) {
        const t = S.add.text(0, 0, Cook.display(id), { fontFamily: FONT(), fontSize: `${Shelf.PILL.text}px`, fontStyle: WEIGHT() });
        natW[id] = t.width;
        t.destroy();
      }
      return natW[id];
    };
    const chipWant = Shelf.pillWant(ppw);
    const PILL_ROOM = Shelf.pillRoom(rowIds.map((id) => (pillShows14(id) ? Shelf.faceW(true, measureW(id)) : Shelf.faceW(false))), chipWant, PILL_GAP);
    const { slotW, x: slotX } = Shelf.slots(shelfIds, { span: [spanL, spanR], view: [VL, VR], pitch: PITCH, groupGap: GROUP_GAP, pillRoom: PILL_ROOM });
    const shelf = {};
    const fits = {};
    // (ART-41: the stone shelf is the line they stand on now; no plank under each group)
    // ART-51: each item by its size class (St.classFit: the band's room with the hop kept, as the old shelfFit, times the class)
    rowIds.forEach((id) => {
      const f = (fits[id] = St.classFit(S, `jar-${id}`, id, { base: BASE, ppw, slotW: slotW - 8 }));
      shelf[id] = slot(id, slotX[id], f.scale);
    });
    // (the size classes' measure, read only: each shelf item's class and opaque height on screen, CSS px; the L height it is a share of)
    Cook.chaiShelfSizes = () => rowIds.filter((id) => shelf[id] && fits[id]).map((id) => {
      const f = fits[id], o = shelf[id];
      const sc = Math.abs(o.scaleY || 1) / (f.scale || 1);
      return { id, cls: f.cls, flag: f.flag, k: f.k, cssH: Math.round(f.h * sc * ppw * 10) / 10, cssL: Math.round(f.hL * ppw * 10) / 10, cssW: Math.round(o.displayWidth * ppw * 10) / 10, cssSlot: Math.round(slotW * ppw * 10) / 10, floored: f.floored, capped: f.capped };
    });
    fitPills(false);
    // SH-219: the pills' one scale for the row: as large as the floor asks (chipWant), as far as each neighbouring pair allows without
    // touching (PILL_GAP between their cards); never below 1 (today's size): where even that would touch, the long words narrow
    // (their text scaled down) to their slot, as before. Run again when a pill's face changes (its word hides or comes back)
    function fitPills(anim) {
      const chips = rowIds.map((id) => shelf[id] && shelf[id].chip).filter((c) => c && c.active);
      const { k, cap } = Shelf.pillScale(chips.map((c) => ({ x: c.x, w: c.faceW(c.showsWord) })), { want: chipWant, gap: PILL_GAP, slotW });
      const y = Math.min(CHIP.y, 896 - (CHIP.h / 2) * k);
      chips.forEach((c) => {
        if (c.capW !== cap) c.face(c.showsWord, cap);
        c.k = k;
        c.hit(slotW);
        if (anim) S.tweens.add({ targets: c, scale: k, y, duration: 200, ease: "Sine.easeOut" });
        else c.setScale(k).setY(y);
      });
    }
    // SH-219 (the pills' measure, read only): each shelf pill on screen in CSS px: its card, its word's size, whether it shows the word
    Cook.chaiPills = () => {
      const k = UI.worldToScreen(1, 0).x - UI.worldToScreen(0, 0).x;
      return Object.values(shelf).filter((o) => o && o.chip && o.chip.active).map((o) => {
        const ch = o.chip, sc = Math.abs(ch.scaleX || 1), w = (ch.cardW || CHIP.w) * sc;
        const t = (ch.parts || []).find((f) => f.type === "Text");
        const a = UI.worldToScreen(ch.x - w / 2, ch.y - (CHIP.h / 2) * sc), z = UI.worldToScreen(ch.x + w / 2, ch.y + (CHIP.h / 2) * sc);
        return { id: ch.pillId, word: !!ch.showsWord, left: a.x, right: z.x, top: a.y, bottom: z.y, wordPx: t ? Math.round(25 * Math.abs(t.scaleX || 1) * sc * k * 10) / 10 : null, speakerPx: Math.round(26 * sc * k * 10) / 10 };
      }).sort((p, q) => p.left - q.left);
    };
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
      // SH-159 (Zafar, 29 Oct, round 3): on the s14 look the word pill's own ladder (js/core/progress.js pill, the central rules'
      // words.pill): written until picked right three times in a row (first try, no peek); a miss brings it back
      // (the shared kit's pill, piece 10: Shelf.P.chip; chip.face(word, cap) redraws it, chip.hit(slotW) its tap area: the card and
      // 7 px round it, as wide as its slot allows)
      const chip = Shelf.P.chip(S, x, CHIP.y, Cook.display(id), {
        word: pillShows14(id),
        depth: D.item + 2,
        shade: SHADE,
        onTap: () => {
          Cook.unlockAudio();
          if (Cook.onLabel) Cook.onLabel(id);
          Lang.speakWord(id);
        },
      });
      chip.pillId = id;
      chip.hit(slotW);
      img.chip = chip;
      return img;
    }

    /* ---------- state, selection, looks ---------- */
    let sel = null;
    let busy = 0; // a pour or a spoon in flight
    let moves14 = 0; // every pour, spoon or take-back begun (the order card's light skips once the child has moved on)
    let spoons14 = 0; // spoons in flight (they never hold the plan up, but the order card's light waits for them)
    let talked = false;
    let finished = false;
    let glowing = null;
    let doneShown = false;
    let finishUp;
    let doneP = new Promise((r) => (finishUp = r));
    const dishNo = () => ctx.dishAt || 0;
    const [lo, hi] = kBoil.band;
    /*
     * SH-158 (Zafar, 29 Oct, round 4; the central rules' timed.firstTimeHold): the first time a child meets the boil (a new player,
     * once ever), the heat holds in the green while the knob is lit, until the knob is tapped; after that, normal timing. Only the
     * knob the child turns holds (never a thing that moves by itself). A returning player's heat never holds.
     */
    const HOLD14 = `${STATION14}:${S14_TAG}boil-hold`;
    const hold14 = !!(gate14.fresh && RULES() && RULES().firstTimeHold() && !seen14[HOLD14]);

    // C8: which picture the pan shows: [the stage, the next one fading in over it, how far]. The leaves
    // steep to black tea as it heats; near the green it comes to the boil; past the green milky chai
    // foams up to the rim (the boil-over warning). Turned down, it settles (the simmer bubbles stay on top).
    // CHAI-63 (Zafar, 1 Nov: "there's a chai boiling animation or new image that happens as the chai is ready (green zone) or close to
    // green zone - i didn't see that on the other modes"): the boil comes up the same TIME before the green at every level (was a
    // fixed 0.12 of heat: 1.3 s at L1's slow rate, 0.9 s at L4's, and L1's first-time hold kept it on screen for as long as the child
    // waited); its steam starts with it, and black tea boils too (kit.pan.stages)
    const boilAt = Mech.boil.boilAt(lo, kBoil.rate);
    const lookOf = (pan) => {
      const tea = pan.has.leaves > 0;
      const milk = pan.has.milk > 0;
      if (pan.poured >= 2 || !(pan.has.water > 0 || milk)) return ["empty", null, 0];
      // milk in before the leaves: no picture of milky water, so the milky chai half over the water
      if (!tea) return milk ? ["water", "milky", 0.5] : ["water", null, 0];
      const calm = milk ? (pan.extras.length ? "spiced" : "milky") : "tea";
      // CHAI-57: boiled over: the foam to the rim (milky), or the black tea's rolling boil, until the pan empties
      if (pan.state === "over") return milk ? ["boil-milky", "foam", 1] : [calm, "boil-tea", 1];
      const h = pan.heat;
      if (pan.state === "ready") return [calm, null, 0];
      if (pan.state !== "heating" || h < boilAt) return milk ? [calm, null, 0] : ["leaves", "tea", Cook.clamp(h / boilAt, 0, 1)];
      const boil = milk ? "boil-milky" : "boil-tea";
      if (!milk || h <= hi) return [calm, boil, Cook.clamp((h - boilAt) / (lo - boilAt), 0, 1)];
      return ["boil-milky", "foam", Cook.clamp((h - hi) / (1 - hi), 0, 1)];
    };
    /*
     * SH-32: each spoonful lies on the pan's surface where it went (no invisible counters): a heap of sugar (the salt that looks like
     * it, the same) for each spoonful, then each spice in the order it went in, sinking in as the pan comes to the boil (the kit's pan
     * draws them: Cook.Kit.pan heaps). CK-06 (decision 3a): "sinking at the boil": they fade from the rolling boil, boilAt, to the
     * green, gone once it is ready. CK-06 (Zafar, 1 Nov): elchi and ginger are pictures (the props' pod, the cut ginger slice), kept
     * after the milk; any other spice (a decoy put in by mistake) a small heap of its colour. No liquid yet: nothing on the surface.
     */
    const heapsOf = (pan) => {
      if (!(pan.has.water > 0 || pan.has.milk > 0)) return { list: null, sink: 1 };
      const h = pan.heat || 0;
      const sink = pan.state === "ready" || pan.state === "over" ? 0 : pan.state === "heating" ? Cook.clamp(1 - (h - boilAt) / Math.max(0.01, lo - boilAt), 0, 1) : 1;
      const list = Array.from({ length: pan.sugar + pan.salt }, () => ({ heap: true }));
      pan.extras.forEach((id) => {
        const sp = SPICE_PIC[id];
        const key = sp ? spiceTex(id) : null;
        list.push(key ? { id, pic: { key, w: sp.w, n: sp.n } } : { id, colour: St.heapColor(id, 0xb07a3a) });
      });
      return { list, sink };
    };
    // the pan's look now, as lookOf says (fade: { from, u } while something goes in: the last picture, then the new one over it)
    const setLook = (pan, fade) => pan.show(fade);
    // (the spoonfuls alone, after a spoonful went in or came back out)
    const drawBits = (pan) => {
      const h = heapsOf(pan);
      pan.heaps(h.list, h.sink);
    };
    let switched14 = false;
    // the chosen pan: a warm pool of light under it, and a gold ring round its face (several pans only; none while it pours)
    const drawSel = () => pans.forEach((pan) => pan.select(pan === sel && n >= 2 && !pan.away, pan.face));
    const select = (pan) => {
      if (sel && sel !== pan && talked) switched14 = true; // (CHAI-68: the child has moved to another pan by themselves)
      if (sel && sel !== pan) {
        closeSpoons(sel);
        // level 4: moving on from a pan you've poured from closes it (half is the child's call)
        if (sel.poured > 0) closePan(sel);
        if (sel.poured > 0) Promise.resolve().then(() => maybeFinish());
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
    const BADGE_CSS_H = 40; // the badge's height on screen, CSS px (js/shared/tally.js, phone and laptop alike; a step smaller, 5 Nov)
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
    // (the shared kit's word pop, piece 12: Juice.P.pop draws the card, the speaker and the word, rises into place, holds and fades;
    // chai says the word)
    const pop = (id, pan, { speak = true } = {}) => {
      const k = Math.max(1, Cook.Kit.textFloor(S, 36)); // never under 14px as rendered
      const c = global.Juice.P.pop(S, (W, H) => popAt(pan, W, H), Cook.display(id), { k, depth: D.fx + 3, top: (Cook.view || {}).top || 0, shade: SHADE });
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
    const land = (targets, o) => Cook.Kit.pan.land(S, targets, o); // (the kitchen kit's settle: Cook.Kit.pan.land)
    // a painted effect at (x, y), about w design px across; never blocks a tap. CHAI-92 (Zafar's picks, 6 Nov): the s17 effects by
    // name through the Phaser twin (js/shared/juice.js Juice.P): "steam" one full wisp rising (steam 1), "sparkle" the three twinkles
    // (sparkle 2); under reduced motion each fades in place (Juice.less). (Was the s11 picture, scaled in and faded.)
    const J = () => (global.Juice && global.Juice.P) || null;
    const fx = (kind, x, y, { w = 90, depth = D.fx + 2 } = {}) => {
      const P = J();
      if (!P) return null;
      return kind === "sparkle" ? P.sparkle(S, x, y, { w: w * 1.6, kind: 2, depth: D.badge + 0.5, add: true }) : null;
    };
    /*
     * CHAI-92 (Zafar's picks, 6 Nov): a glass just poured. The painted last drop falls into it from a third of the lab's height, smaller
     * (Zafar, on the tray's top-down glass: "maybe it just needs to start from a smaller height, like a third of the height ... so it
     * doesn't start from way above ... It's just a bit more subtle, but paired with the 3 sparkles"), lands with its plink (drop B, at
     * twice the lab's level) and the glass's ring (glass C, in place of the end screen's "right" tick that played here); a full glass
     * then gets the three twinkles (sparkle 2) with their chime (sparkle A). Every glass gets them, whatever went in (never a verdict).
     */
    const glassDone = (pan, look) => {
      const w = pan.well;
      const g = w && w.glass[look];
      const P = J();
      if (!g || !P) return Cook.sfx.glass();
      const gw = g.displayWidth || 90;
      const full = look === "full";
      // (a little right of the middle: the person's face sits over the glass's upper left, and the drop falls clear of it into the tea)
      // (Fable judge, 6 Nov: at 0.11 of the glass and 300 ms the drop never showed on the tea; now big enough to see and slow enough
      // to follow, still from about a third of the lab's height)
      return P.drop(S, w.x + gw * 0.28, w.y - gw * 0.7, w.y, {
        w: gw * 0.17,
        ms: 460,
        splash: "none",
        depth: D.fx + 2,
        onLand: () => {
          Cook.sfx.drop();
          Cook.sfx.glass();
        },
      }).then(() => {
        if (!full || !g.active) return undefined;
        Cook.sfx.sparkle();
        // (inside the glass's right half, clear of the face on its upper left; added light, so the gold reads on the wood and the tea;
        // half the glass's width: Fable judge, 6 Nov, at the glass's width it flared at the rim and touched the face)
        return P.sparkle(S, w.x + gw * 0.18, w.y + gw * 0.06, { w: gw * 0.5, kind: 2, depth: D.badge + 0.5, add: true });
      });
    };
    const panLayers = (pan) => [pan.img, pan.mix, pan.disc, pan.mixDisc].filter((o) => o && o.visible);
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
      // (the shared kit's placing, Juice.popAt: never across the hob's top edge (s08 w6B, CHAI-19), above the count badge or beside it)
      return global.Juice.popAt({ x: pan.x, y: pan.y - rimR - 16 }, W, H, {
        top: (wv && wv.height ? wv.y : v.top || 0) + 10,
        left: (v.left || 0) + 10,
        right: (v.right || 1600) - 10,
        edge: { y: hobY, clear: RIM_CLEAR, above: 10 },
        avoid: badgeBox(),
      });
    };

    /* ---------- using the shelf: pour a bottle, or a spoonful ---------- */
    // (the kitchen kit's pour from the shelf, piece 6: Mech.pour lifts the bottle or carton, tips it over the pan with the short pour,
    // fades the pan's look and sets it back with its settle; Mech.pour.spoon the shared spoon. Chai keeps its own counts)
    const pourInto = async (pan, obj, color, toLevel, look) => {
      busy++;
      moves14++;
      obj.flying = true;
      refresh();
      await Mech.pour(S, { pan, from: obj, level: toLevel, look, settle: color === COL.water, onEnd: () => busy-- });
    };
    const spoonInto = async (pan, obj, id) => {
      // (counted for the order card's light only: it waits for a spoon to land, and skips once the child spoons the next thing)
      moves14++;
      spoons14++;
      refresh(); // the next step is known now (a spoon in flight never holds the plan up)
      await Mech.pour.spoon(zb, { pan, from: obj, word: id, ms: kCount.spoonMs, onEnd: () => spoons14-- });
    };
    const use = async (id) => {
      const pan = sel;
      const obj = shelf[id];
      if (!pan || finished || pan.poured > 0 || pan.state === "over" || !obj || (busy && (id === "cook-paani" || id === "cook-dudh"))) {
        if (obj && !busy) S.wiggle(obj);
        if (pan && pan.poured > 0 && !finished) {
          nextPanLight(); // (CHAI-68: a jar tapped into a poured pan: the next pan, at once)
          Cook.Coach.wrong(); // (and after the first time, the stuck hint on the next pan at once)
        }
        return;
      }
      // CHAI-22 (P33): there is one of milk, water and tea in a pan: a second tap only wiggles (nothing goes in, no word)
      if (ONCE[id] && pan.has[ONCE[id]] > 0) {
        S.wiggle(obj);
        note("chai-add", id, `${pan.who}:${pan.has[ONCE[id]]}:again`);
        return;
      }
      // SH-38 (Zafar, 1 Nov: "when you've put in the right number of sugars or other items, it just ticks it there and then ... it's
      // important for consistency"; easy-to-play rule 4; was L1 only, CHAI-16): at every level the counted row ticks on the spoonful
      // that reaches the number, and a spoonful past it only wiggles the jar (he accepts that a child can tap until it ticks)
      if (pan.p.khun > 0 && id === "cook-khun" && pan.sugar >= pan.p.khun) {
        S.wiggle(obj);
        pan.capped = true;
        note("chai-add", id, `${pan.who}:${pan.sugar}:capped`);
        refresh();
        return;
      }
      // (the same for the asked-for extra: one spoonful is its count, a second only wiggles the jar)
      if (pan.p.extra && id === pan.p.extra && pan.extras.includes(id)) {
        S.wiggle(obj);
        note("chai-add", id, `${pan.who}:1:capped`);
        return;
      }
      // (the tap's sound, at the tap: CHAI-92, Zafar's pick "Now", today's soft pop; the bottle's late sound is its settle, pourInto)
      Cook.sfx.pop();
      unglow();
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
        // SH-38 (Zafar, 1 Nov; was CHAI-16, L1 only): at every level the counted row ticks the moment the count is reached
        if (pan.sugar === (pan.p.khun || 0)) closeSpoons(pan);
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
        pan.fade(look);
      }
      refresh();
    };
    Object.keys(shelf).forEach((id) => {
      const o = shelf[id];
      if (id !== "cook-paani" && id !== "cook-dudh") o.handAction = "pinch";
      S.tappable(o, () => talked && !finished && use(id));
    });

    /* ---------- heat: each knob, each pan (the kitchen kit's heat and boil, Mech.boil: js/cook/mechanics/boil.js) ----------
     * The kit owns the knob's taps, the heat's clock (CHAI-10: twice as fast to the green, half speed in it), too early (CHAI-57:
     * the knob shakes, Nani says hever na, the heat runs on), the green (its ding, CHAI-92), the turn-down, the boil-over and starting
     * again (CHAI-57, decision 5c: no verdict, no mark), the first-time hold (SH-158), the boil's steam from boilAt (CHAI-63, CHAI-92)
     * and the hob's simmer loop by the hottest pan (CHAI-95). Chai says what each step does to its pans, cards and pictures (on).
     * The test hooks keep their names: Cook.chaiBoil (every boil event), Cook.chaiSimmer (the loop's level by heat).
     */
    const setKnob = (pan, state, silent = false) => pan.burner.set(state, false, silent);
    const stove = Mech.boil.stove(S, {
      log: "chai",
      hold: hold14,
      done: () => finished,
      onHoldEnd: () => (seen14[HOLD14] = true),
    });
    Cook.chaiBoil = stove.boilLog;
    Cook.chaiSimmer = stove.simmerLog;
    pans.forEach((pan) => {
      pan.boil = Mech.boil(S, pan, {
        id: pan.who,
        band: [lo, hi],
        rate: kBoil.rate,
        burner: pan.burner,
        ring: pan.heatRing,
        ringR: rimR, // (the gauge rides on the pan's rim, inside the flames: 29 Sept, at panR + 14 it sat on the flame tips)
        bind: true, // (chai reads and resets pan.state and pan.heat everywhere)
        can: () => !finished,
        canLight: () => !!pan.has.water,
        has: () => pan.level > 0.05,
        steam: { at: () => ({ x: pan.x, y: pan.y - rimR * 0.64, w: rimR * 2.4, depth: D.fx - 2 }), when: () => !pan.away },
        puff: { r: rIn },
        on: {
          // nothing to heat yet: the knob won't turn (the kit shakes it), the water bottle hops
          cantLight: () => {
            S.glow(shelf["cook-paani"], true, { bounce: true });
            S.time.delayedCall(1200, () => glowing !== shelf["cook-paani"] && S.glow(shelf["cook-paani"], false));
          },
          light: () => sel !== pan && select(pan),
          green: () => refresh(), // CHAI-24: the turn-off line on the frame the bar enters the green (not the next nudge)
          tick: () => setLook(pan),
          // (only ever in the green now, CHAI-57: a tap before it shakes the knob)
          down: (b, score) => {
            zb.skill(score, "boil");
            S.verdict(pan.x, pan.y - panR - 40, score, { bad: "too-early" });
          },
          // CHAI-57: boiled over (the v3 foam over the milky boil and the kit's steam puffs stand in until ART-32 brings the s14
          // boil-over); then that pan empties, its person's card rows open again and that pot starts again from the water; the
          // other pots keep theirs
          over: () => {
            setLook(pan);
            if (sel === pan) UI.hideCount();
          },
          again: () => {
            Object.assign(pan, { level: 0, has: { water: 0, leaves: 0, milk: 0 }, sugar: 0, salt: 0, extras: [], spoons: [], poured: 0, closed: false, spoonsClosed: false, capped: false });
            pan.bubbles.clear();
            setLook(pan);
            UI.mission.reopen(null, dishNo(), { for: pan.who });
            if (sel === pan) UI.hideCount();
          },
          changed: (b, what) => {
            if (what === "down") {
              setLook(pan);
              if (trayQuiet.alpha > 0) S.tweens.add({ targets: trayQuiet, alpha: 0, duration: 400 });
            }
            refresh();
          },
        },
      });
    });
    pans.forEach((pan) => {
      S.tappable(pan.img, () => panTap(pan));
      // Sprint 14 (lab/cards.html: "the glass lit for the pour"): on the s14 look the glass takes the tap too (its pan pours),
      // as well as the pan itself (kept)
      if (s14 && pan.well) {
        const w = pan.well;
        w.hit = S.track(S.add.zone(w.x, w.y, w.r * 2.1, w.r * 2.1).setDepth(D.item + 2));
        S.tappable(w.hit, () => panTap(pan));
      }
      S.tappable(pan.face, () => {
        if (finished) return;
        if (sel !== pan) select(pan);
        hear(pan);
      });
      setLook(pan);
    });
    // (the stove's own tick, made with it above, heats the pans first; this one follows each frame: the handle, the rolling boil,
    // the gauge)
    const stopHeat = S.addTick(() => {
      pans.forEach((pan) => {
        const hd = pan.layers && pan.layers.handle;
        if (hd) hd.setAlpha(pan.img.alpha).setScale(pan.img.scaleX, pan.img.scaleY);
        // (CHAI-61, Zafar, 1 Nov: a lit pan's boil runs on its own clock, whatever goes into another pan: the kit's)
        // bubbles as it nears the boil, a gentle simmer once it's ready
        pan.bubbles.clear();
        const hot = pan.state === "heating" ? Cook.clamp((pan.heat - 0.3) / (lo - 0.3), 0, 1.4) : pan.state === "ready" && pan.poured < 2 ? 0.35 : 0;
        if (hot > 0 && pan.level > 0.05) {
          // CK-06 (CP4 v2: "never drawn circles or rings"): no drawn bubbles; the pictured boil rolls (its picture turns slowly)
          const spin = 0.0025 * Math.min(1.4, hot);
          [pan.disc, pan.mixDisc].forEach((im) => im && im.visible && im.setRotation(im.rotation + spin));
        }
      });
      if (gaugePan && gaugePan.state === "heating") zb.gauge({ level: gaugePan.heat, lo, hi, at: ringAt(gaugePan) });
    });

    /* ---------- pouring: a ready pan tips into its person's glass ---------- */
    // the glass shows black tea (CHAI-14): the s14 black-tea glasses (the fill's frame 4 for the half, the black glass full)
    const blackGlass = (w) => {
      ["half", "full"].forEach((st) => {
        const g = w.glass[st];
        if (!g || g.blackDone) return;
        g.blackDone = true;
        glassLook(g, `v2-glass-black-${st}`);
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
    // (the kitchen kit's take-back zones, piece 7: Mech.pour.takeBack puts a 48 px zone over each chip chai allows)
    const tb = Mech.pour.takeBack(S, { can: (id) => !!sel && !finished && canTakeBack(sel, id), onTap: (id) => takeBack(sel, id) });
    const syncTakeBack = () => tb.sync();
    // (the take-back player, build/sandbox: the last spoonful's chip)
    Cook.undoAt = () => {
      const id = sel && (sel.spoons || []).slice(-1)[0];
      return id ? tb.at(id) : null;
    };
    const takeBack = async (pan, id) => {
      while (busy && !finished) await Cook.wait(60); // a spoon still on its way lands first
      if (!canTakeBack(pan, id)) return;
      pan.spoons.splice(pan.spoons.lastIndexOf(id), 1);
      const obj = shelf[id];
      busy++;
      moves14++;
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
      if (obj) await Mech.pour.unspoon(zb, { pan, to: obj, word: id, ms: kCount.spoonMs });
      if (id !== "cook-khun" && id !== "spi-16") pan.fade(pan.shown);
      if (id === "cook-khun" && pan.sugar === (p.khun || 0)) closeSpoons(pan);
      busy--;
      St.acted(); // (SH-184: a take-back is a right move too)
      refresh();
    };
    const panTap = async (pan) => {
      if (finished || busy) return;
      if (pan.state !== "ready" || pan.poured >= 2 || !talked) {
        if (sel !== pan) {
          select(pan);
          St.acted(); // (picking a pan is a move: the idle clock, the hint's, starts again: the sandbox, 4 Nov)
        }
        return;
      }
      // CHAI-54 (Zafar, 1 Nov): a glass that holds what was asked (ticked) takes no more: a pour past it doesn't land (a wiggle)
      if (halves && pan.poured > 0 && (pan.closed || pan.poured >= needOf(pan))) {
        if (sel !== pan) select(pan);
        S.wiggle(pan.img);
        note("chai-pour", "past", `${pan.who}:${pan.poured}`);
        return;
      }
      if (sel !== pan) select(pan);
      busy++;
      moves14++;
      coachEnd(); // (no help spotlight over the pour: s12-w3b)
      // Sprint 11 (easy-to-play principle 9: each word heard at the order, at the shelf and at the pour): while their chai
      // pours, the person's card said what went into it, row by row (at L1-L2). Zafar, 30 Oct: "when the tea is pouring it says
      // milk and one sugar, which it shouldn't": the pour is quiet (READ_AT_POUR off)
      if (READ_AT_POUR && level <= 2 && !pan.poured && UI.readAlong) {
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
       * The s14 pour (Zafar, 29 Oct: "just having the pans move above the glasses and empty and the glasses fill up"): the
       * hob's pan lifts off its burner and moves to sit just above its glass (over the tray, its rim clear of the glass's);
       * there the pan's emptying pictures (pe-*-1 full .. 6 empty) play in step with the glass's filling ones (gf-*-1 empty ..
       * 6 full), each placed by its own measured rim, so neither rim's centre moves; then the pan goes back to its burner
       * (empty after a full pour). No tipping, no drawn stream. At level 4 one tap pours half (frames 1-4), a second the rest
       * (4-6). The kitchen kit plays it (Mech.pour.toGlass, Sprint 18 piece 7) with chai's frames, lift, gap and times (kit.glass).
       */
      await pourArt; // (the pour frames, loaded behind the station's start: in long before a child reaches the pour)
      const to = halves ? pan.poured + 1 : 2;
      const from = pan.poured;
      // the pan's off the burner: no flame and no glow on an empty burner while it pours (29 Sept)
      pan.away = true;
      const flames = [pan.burner.flameHi, pan.burner.flameLo];
      // (the knob's own fade to its low flame may still be running from the turn-down: it stops, so the flame goes out)
      flames.forEach((fl) => (S.tweens.killTweensOf(fl), S.tweens.add({ targets: fl, alpha: 0, duration: 160 })));
      drawSel();
      // SH-183 amended (Zafar, 1 Nov night: "when the pan of the tea comes across to pour into the glass, it should go on top of the
      // face icons, rather than having them on top of the teapot"): while it pours, the pan and its shadow pass over the faces (the
      // kit's default depth, D.badge). The pour's sound while the chai runs (CHAI-87; Zafar's pick, 6 Nov ~17:45: pour A, a real pour
      // into a glass, at its own level); the test hook Cook.chaiPour: where the pan is in its pour, for the filmstrip
      const { look } = await Mech.pour.toGlass(S, {
        pan,
        well: w,
        from,
        to,
        frames: KG.frames[black ? "black" : "milky"],
        look: black ? "black" : "milk",
        lift: KG.lift,
        gap: KG.gap,
        arc: KG.arc,
        ms: KG.ms,
        sound: () => Cook.sfx.teaPourLoop && Cook.sfx.teaPourLoop(),
        hook: (info) => (Cook.chaiPour = info),
        onDone: (x) => {
          pan.poured = x;
          w.fill = x;
        },
      });
      // (CHAI-92: its last drop, its ring and, full, its twinkles: glassDone above; was soft("right", 0.35), nothing waits on it)
      // (Zafar, 8 Nov: "the ding and sparkle when a half glass is poured, even if the order requests a full cup ... should only happen
      // when the correct amount is placed into the glass": the drop, the ring and the twinkles only when the glass holds what its person
      // asked for; the pour's own sound stays)
      const asked = people.find((p) => p.who === pan.who);
      if (pan.poured === needOf({ p: asked || {} })) glassDone(pan, look);
      pan.away = false;
      if (pan.poured < 2) flames.forEach((fl, j) => S.tweens.add({ targets: fl, alpha: pan.burner.state === (j ? "low" : "high") ? 0.95 : 0, duration: 200 }));
      drawSel();
      pan.level = pan.poured >= 2 ? 0 : pan.level * 0.6;
      pan.unhide(); // (its layers, shadow and bubbles back, in the look it holds now)
      closeSpoons(pan);
      // CHAI-54: the glass ticks the moment it holds what was asked (L4: half at the first pour, full at the second)
      if (pan.poured >= needOf(pan)) closePan(pan);
      // the pan's empty: the fire goes off. CHAI-100 (Zafar, 6 Nov night: "when the tea pan goes back on the stove, it plays a sound like
      // a click ... I think we should remove that ... It just comes at the wrong time every time"): silently; the child's own knob turns
      // and the boil-over keep their click
      if (pan.poured >= 2) setKnob(pan, "off", true);
      if (sel === pan && pan.poured < 2 && halves) {
        if (UI.tallyAt) UI.tallyAt(tallyPt(pan), { anchor: "right" });
        if (pan.sugar) UI.count(pan.sugar, { speak: false, id: "cook-khun" });
        if (pan.salt) UI.count(pan.salt, { speak: false, id: "spi-16" });
        pan.extras.forEach((x) => UI.count(spoonsOf(pan, x), { speak: false, id: x }));
      }
      busy--;
      // SH-184 (Zafar, 1 Nov: "I was pausing making one chai pot while pouring the completed other pots and i got the nani hint ...
      // It should have noted that pouring was a legit action and therefore restart the timer"): the pour is a right move: the hint's
      // wait runs again from its end, whichever pan the hint is for
      St.acted();
      maybeFinish();
      refresh();
      if (!finished && !doneShown) nextPanSoon(); // (CHAI-68: the first pan poured: the next pan's light 0.8 s after, CHAI-99)
    };
    /*
     * SH-105 (decision 6, P26: "once you've poured all the teas it just scores you immediately"): every cup poured and ticked, so
     * nothing is left to choose: it moves on. CHAI-54 (Zafar, 1 Nov: "if half is achieved, then it should just tick after half"): at
     * L4 a glass ticks the moment it holds what was asked (half at the first pour, full at the second), so the round moves on once
     * every glass is ticked, with no beat after a half glass (was HALF_BEAT_MS, 2.6 s); a "full" glass left at half waits for its
     * second pour (the stuck hint lights its pan), unless the child moved on to another pan, which closes it (half is their call)
     */
    const maybeFinish = () => {
      if (finished || doneShown || busy || !pans.every((q) => q.poured > 0 && (q.closed || q.poured >= needOf(q)))) return;
      doneShown = true;
      finishUp();
    };

    /* ---------- people speak ---------- */
    const L = () => ladderOf(ctx, people);
    // (kit e, piece 18: a person says their order through the kitchen kit, UI.personSay / UI.hearPerson / UI.peopleSay: their card
    // read along, else chai's own sentence in Nani's box, their face in her box and the kit's one talk motion (contract-14, ART-13).
    // Chai's own personSay, its talk motion and its `speaking` flag are gone; a replay waits while anyone speaks (UI.personSpeaking))
    const orderOf = (pan, rows) => ({ who: pan.who, obj: pan.face, rows, line: () => personLine(L(), pan.who, rows), hide: St.hideKnown(ctx) });
    const hear = (pan) =>
      UI.hearPerson(pan.who, Object.assign(orderOf(pan), {
        onHelp: () => !guided && personRows(L(), pan.who).some(hiddenRow) && Cook.onHelp && Cook.onHelp("replay", { ids: personRows(L(), pan.who).flatMap((r) => r.ids) }),
      }));

    /* ---------- what's next (the tester, Nani's glow, the focal rule) ---------- */
    const at = (o) => {
      const c = S.centre(o);
      return { x: c.x, y: c.y };
    };
    const tapOn = (o, key, extra = {}) => Object.assign({ kind: "tap" }, at(o), { key }, extra);
    // what the pan still lacks, by item id
    const lacks = (pan, id) => {
      const p = pan.p;
      if (id === "cook-paani") return !pan.has.water;
      if (id === "cook-chai") return !pan.has.leaves;
      if (id === "cook-dudh") return !!p.dudh && !pan.has.milk;
      if (id === "cook-khun") return pan.sugar < (p.khun || 0);
      if (id === p.extra) return !pan.extras.includes(p.extra) && !!shelf[p.extra];
      return false;
    };
    // SH-182, SH-178 (Zafar, 1 Nov: "the hint prompt from Nani should always be the next item to put in sequentially, i.e. just the
    // next item on the menu card"): the next thing is the first undone row in the person's card order (water, tea, the extra, milk,
    // sugar: data/cook.json chai card.slots), one source for the plan, Nani's hint and the order card's light; any order still lands
    const want = (pan) => {
      let rows = [];
      try {
        rows = personRows(L(), pan.who);
      } catch (e) {
        rows = [];
      }
      for (const r of rows) {
        if (r.no || r.head) continue;
        const id = (r.ids || []).find((x) => lacks(pan, x));
        if (id) return id;
      }
      // (a card not drawn yet: the card's own order)
      return ["cook-paani", "cook-chai", pan.p.extra, "cook-dudh", "cook-khun"].find((id) => id && lacks(pan, id)) || null;
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
        if (q.state === "ready" && !q.closed && q.poured < needOf(q)) return { e: tapOn(q.img, `pour-${q.who}`), obj: q.img, focal: true, phase: "pour" };
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
      if (glowing && pans.some((q) => q.glowRing === glowing)) glowing.setVisible(false);
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
    // the level's wait before Nani's hint (SH-155: the central rules, data/rules.json levels.hintS, through js/shared/rules.js)
    const hintMs14 = () => rulesAt(level).hintMs || LADDER.glowAt;
    const ITEM_STEPS = new Set(["water", "tea", "cups"]);
    // the box keeps the thing's neighbours on the shelf dark (EASY-08: never half the jar above): the kit's one page box, Cook.Coach.box
    // two page rects' union (either may be missing)
    const unionRect = (f, g) => () => {
      const a = f && f(), c = g && g();
      if (!a || !c) return a || c || null;
      const x = Math.min(a[0], c[0]), y = Math.min(a[1], c[1]);
      return [x, y, Math.max(a[0] + a[2], c[0] + c[2]) - x, Math.max(a[1] + a[3], c[1] + c[3]) - y];
    };
    // (SH-230: each neighbour's picture where it rests and its pill: the lit box stops 2 px short of either)
    const shelfBut = (obj) =>
      Object.values(shelf)
        .filter((o) => o !== obj && o.active)
        .flatMap((o) => [() => (o.active ? toPage(restBox(o)) : null), () => (o.active ? toPage(pillBox(o)) : null)]);
    /*
     * CHAI-68 (Zafar, 2 Nov: "we need an onboarding for selecting the new pan to start cooking, which kicks in a few seconds after the
     * first pan is poured, when its the first time a second pan is introduced, and/or when they try to put items into the first pan"):
     * the first time only (a new player; SH-181), the light on the next empty pan and its face: 0.8 s after the first pan's pour ends
     * (CHAI-99, Zafar 6 Nov night; was about 3 s, then 0.3 s) while the child is still on it, or at once when they tap a jar into a poured pan. It goes when they pick that pan.
     */
    let nextPan14 = null;
    // (the next pan still to make; none once the child has moved between pans by themselves: they know how)
    const nextEmpty = () => pans.find((q) => q !== sel && !q.poured && q.state !== "over");
    // (the kitchen kit's next vessel, Cook.Coach.nextLight: 0.8 s after the pour's end (CHAI-99), or at once (o.from unset); lit round
    // the next pan's rim, its tap area (Zafar, 2 Nov: "a tighter highlight for the pan onboarding ... circular around the rim"), until
    // it is picked)
    const nextPanLight = (o = {}) => {
      if (nextPan14) nextPan14.cancel();
      if (!s14 || pans.length < 2) return;
      let nx = null;
      nextPan14 = Cook.Coach.nextLight({
        now: !o.from,
        get target() {
          const q = nextEmpty();
          return q ? Cook.Coach.box(q.glowRing) : null;
        },
        ok: () => {
          if ((o.from && sel !== o.from) || finished || !sel || !(sel.poured > 0) || !(sel.closed || sel.poured >= needOf(sel))) return false;
          nx = nextEmpty();
          return !!nx && !switched14 && gate14.first("next-pan");
        },
        quitIf: () => finished || sel === nx,
        get who() {
          return nx && nx.who;
        },
        note: `${STATION14}:${S14_TAG}light`,
      });
    };
    const nextPanSoon = () => {
      if (nextPan14) nextPan14.cancel();
      if (pans.length < 2 || pans.filter((q) => q.poured > 0).length !== 1) return;
      nextPanLight({ from: sel });
    };
    // a shelf thing's box (EASY-08, Zafar: "the item itself glowing and radiating ... in the box"): the thing where it rests (not
    // where its bounce has it). SH-230 (Zafar, 6 Nov night: "items with no written words in their pills is much too tight ... a general
    // rule that works in all cases that leaves some padding around the object+pill+face icon, or object+pill, or object"): this gives
    // the thing's parts as one union, its picture as drawn AND its pill (a speaker-only pill is narrower than its jar, so the jar sets
    // the sides; was the pill alone, CHAI-33); the margin round them, and
    // how far a neighbour or the screen's edge trims it, is the one rule every game's light uses (js/shared/onboard.js Onboard.litBox)
    const restY = (o) => (o.glowFx && o.glowFx.y != null ? o.y - o.glowFx.y : 0);
    // (the picture's own box, the one the contract measures, contract-92: its opaque part was tried, but the light then sat 3 px
    // closer to the frame's top than the rule's margin; the jars' frames are a few px, so the box is the same to the eye)
    const restBox = (o) => {
      const dy = restY(o);
      const b = o.getBounds();
      return { x0: b.x, y0: b.y - dy, x1: b.right, y1: b.bottom - dy };
    };
    // the pill as drawn: its card (CHIP, never Container.getBounds: a speaker-only chip holds only graphics, which have no bounds;
    // CHAI-33) and its 2 px shadow under it
    const pillBox = (o) => {
      const ch = o && o.chip;
      if (!ch || !ch.active) return null;
      const sx = Math.abs(ch.scaleX || 1), sy = Math.abs(ch.scaleY || 1), hw = ((ch.cardW || CHIP.w) / 2) * sx;
      return { x0: ch.x - hw, y0: ch.y - (CHIP.h / 2) * sy, x1: ch.x + hw, y1: ch.y + (CHIP.h / 2 + 2) * sy };
    };
    const toPage = (r) => {
      if (!r) return null;
      const a = UI.worldToScreen(r.x0, r.y0);
      const z = UI.worldToScreen(r.x1, r.y1);
      return [a.x, a.y, z.x - a.x, z.y - a.y];
    };
    // (the lit thing hops, js/cook/stations.js glow: its picture's top is where the hop takes it, so the margin over it holds at the
    // hop's top too; contract-92 caught 1 px over a jar mid-hop at L2 930x430)
    const hopOf = (o) => Math.max(8, Math.min(48, (o.displayHeight || 0) * ((global.Onboard && global.Onboard.HOP) || 0.1)));
    const itemRect = (o) => () => {
      if (!o || !o.active) return null;
      const p = restBox(o);
      p.y0 -= hopOf(o);
      const c = pillBox(o);
      return toPage(c ? { x0: Math.min(p.x0, c.x0), y0: Math.min(p.y0, c.y0), x1: Math.max(p.x1, c.x1), y1: Math.max(p.y1, c.y1) } : p);
    };
    // the finger taps the top of the thing from above, clear of its hop (the judge, 23 Oct: the hand never covers the thing,
    // even at the top of its bounce, nor its word under it)
    const itemPt = (o) => () => {
      if (!o || !o.active) return null;
      const b = o.getBounds();
      const hop = (global.Onboard && global.Onboard.HOP) || 0.1;
      return UI.worldToScreen(b.centerX, b.y - restY(o) - b.height * hop);
    };
    const helped = new Set(); // the asked-for words shown by help this round (study: never marked right)
    let hints14 = 0; // SH-160: how many times the guide's hint came this round (a peek or the arrow's card never counts)
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
        // (s14: the glass is lit for the pour, its pan still takes the tap: both live under the light)
        // (Zafar, 29 Oct: "the highlight box on the chai tray should go under the face circle so the face circle sits on top and
        // doesn't get a line over the face": the glass's box takes in its face badge, so no edge crosses the face)
        if (pan && s14 && pan.well && pan.well.hit) return { obj: pan.img, target: unionRect(Cook.Coach.box(pan.well.hit), pan.well.face ? Cook.Coach.box(pan.well.face) : null), also: Cook.Coach.box(pan.glowRing) };
        return pan && { obj: pan.img, target: Cook.Coach.box(pan.glowRing) };
      }
      // (SH-230: a control's box is its own picture; the margin round it is the one rule's, Onboard.litBox: was 4 px here and 4 more there)
      if (nx.phase === "slow" && nx.slowAt) return { obj: nx.slowAt.knob, target: Cook.Coach.box(nx.slowAt.knob) };
      if (/^knob-on-/.test(key)) {
        const pan = pans.find((q) => `knob-on-${q.who}` === key);
        return pan && { obj: pan.knob, target: Cook.Coach.box(pan.knob) };
      }
      // (the orchestrator's film, 30 Oct: at L3-L4 a cold pan that is not the one in hand opens its knob step as a tap on the pan, so
      // "Chulo bar!" was said with nothing lit (contract-78): its knob is lit, as a tap on the knob takes the pan in hand too)
      if (nx.phase === "knob" && /^pan-/.test(key)) {
        const pan = pans.find((q) => `pan-${q.who}` === key);
        return pan && { obj: pan.knob, target: Cook.Coach.box(pan.knob) };
      }
      // (Zafar, 3 Nov: "I filled the first tea tray, poured the first tea, and then I did nothing for like 30 seconds, and there was no
      // hint to click the second tea tray ... a stuck hint ... using the onboarding methodology of highlighting": the next pan to pick
      // is a control's step, its rim lit round as CHAI-68's first-time light; was: its next item's shelf thing, which had no light)
      if (/^pan-/.test(key)) {
        const pan = pans.find((q) => `pan-${q.who}` === key);
        // (Zafar, 4 Nov evening, L2: "even though I had tea pan 1 selected ... saucepan 2 [lit] in this outer gold rim ... It should only
        // onboard you to select the second tea pot after you've successfully poured the first pot of chai and it's been served": while
        // another pan is on the heat or waiting to pour, the next pan's stuck hint never comes; the plan still lets the child pick it)
        if (pan && pans.some((q) => q !== pan && q.state !== "cold" && q.poured < needOf(q))) return null;
        return pan && { obj: pan.img, target: Cook.Coach.box(pan.glowRing), round: true, panPick: true };
      }
      const obj = shelf[key];
      if (!obj || !sel) return null;
      return { obj, id: key, target: itemRect(obj), point: itemPt(obj), avoid: () => shelfBut(obj) };
    };
    /* the call-out card (CHAI-32: "the card that comes up when they're ordering ... should look like it's coming from Nani"): the
       next item's word card, big, at the top left of the play area by her guide box (the order's own card: UI.wordOf), with a
       tail towards her box */
    let callout = null;
    const rowFor = (pid) => (sel ? personRows(L(), sel.who).find((r) => !r.no && r.ids.includes(pid)) : null);
    // (s14: Nani's helper card, in her box: UI.helper names the item, UI.helperOpen opens it)
    const helperOf = (pid, answer) => {
      const r = rowFor(pid);
      const w = r && UI.wordOf ? UI.wordOf(r, { size: 240, written: true }) : null;
      if (!w) return null;
      // (the full answer is help: counted as a hint for an asked-for word, never as known; non-negotiable 4)
      w.onOpen = () => answer && !helped.has(pid) && (helped.add(pid), Cook.onHelp && Cook.onHelp("hint", { ids: [pid] }));
      return w;
    };
    const hideCallout = () => {
      if (s14 && UI.helperOpen) UI.helperOpen(false);
      if (callout) callout.dispatchEvent(new Event("ck-gone"));
      if (callout) callout.remove();
      callout = null;
    };
    const showCallout = (pid) => {
      hideCallout();
      if (s14 && UI.helperOpen) {
        UI.helperOpen(true, { by: "hint" });
        return;
      }
      const r = rowFor(pid);
      const side = document.querySelector("#side");
      const guide = document.querySelector("#guide");
      const w = r && UI.wordOf && global.WordCard ? UI.wordOf(r, { size: 240 }) : null;
      if (!w || !side || !guide) return;
      // the judge, 23 Oct: never over the hob, the tray, the shelf or the order list (fit, below)
      const box = document.createElement("div");
      box.className = "ck-callout";
      box.dataset.item = pid;
      Object.assign(box.style, { position: "fixed", left: "0", top: "0", zIndex: "40", animation: "icWordIn .3s cubic-bezier(.2, 1.3, .4, 1)" });
      let card = global.WordCard.card(box, w.word, Object.assign({}, w.wordOpts, { cls: "ic-word" }));
      const word = w;
      // (a phone, no room for the big card by the hob nor under the list: the same word card in its row form, [picture][speaker]
      // word, which is short enough to sit under the list)
      const asRow = () => {
        if (card.classList.contains("wc-row")) return;
        card.remove();
        card = global.WordCard.row(box, word.word, Object.assign({}, word.wordOpts, { cls: "ic-word" }));
        box.insertBefore(card, box.firstChild);
        // (as the order's own call-out card: the word never breaks inside itself, css/cook.css #intro.along .ic-word p)
        card.querySelectorAll("p, span").forEach((e) => Object.assign(e.style, { overflowWrap: "normal", wordBreak: "normal" }));
      };
      const tail = document.createElement("i");
      tail.setAttribute("aria-hidden", "true");
      Object.assign(tail.style, { position: "absolute", left: "var(--njg-s5, 24px)", top: "-11px", width: "0", height: "0", borderLeft: "11px solid transparent", borderRight: "11px solid transparent", borderBottom: "12px solid var(--njg-card)", filter: "drop-shadow(0 -1px 1px rgba(60, 40, 20, 0.12))" });
      box.appendChild(tail);
      document.body.appendChild(box);
      const fit = () => {
        if (!box.isConnected) return;
        const s = side.getBoundingClientRect();
        const g = guide.getBoundingClientRect();
        const stage = document.querySelector("#stage");
        const st = stage ? stage.getBoundingClientRect() : { left: s.right, top: s.top };
        // the judge, 23 Oct (second round): never over the order list either. Where it goes, in this order:
        //  1. the play area's top left, by Nani's guide box: the strip left of the hob, above the shelf (wide enough: 115 px,
        //     the speaker and a word side by side; a phone's strip is about that);
        //  2. the left column, under the order list and above the rail (a phone: the strip by the hob is too narrow);
        //  3. else under her box, over the list (a crowded card at L3-L4 on a phone)
        const hb = hob && hob.active ? hob.getBounds() : null;
        const hobLeft = hb ? UI.worldToScreen(hb.x, hb.y).x : st.left + 220;
        const shelfTop = UI.worldToScreen(0, SHELF_TOP).y;
        const pad = 10;
        const size = (w) => ((card.style.width = `${w}px`), card.offsetHeight);
        // the widest card up to `max` that is at most `h` tall (a narrower card is shorter: its picture is 4:3); null under 100 px
        const widest = (max, h) => {
          for (let w = Math.min(210, Math.floor(max)); w >= 100; w -= 6) if (size(w) <= h) return w;
          return null;
        };
        const free = hobLeft - st.left - 24; // (its 14 px from the column, its tail in the gap, 10 px clear of the hob)
        const list = document.querySelector("#mission");
        const rail = document.querySelector("#side .side-rail");
        // (where the list's own rows end: the card box itself can stretch down the column)
        const rowsIn = list && list.offsetParent ? [...list.querySelectorAll(".oc-card, .oc-row, .oc-pills, .m-head")].map((e) => e.getBoundingClientRect()).filter((r) => r.height > 0) : [];
        const listEnd = rowsIn.length ? Math.max(...rowsIn.map((r) => r.bottom)) : g.bottom;
        const floor = rail && rail.offsetParent ? rail.getBoundingClientRect().top : s.bottom;
        let w = free >= 115 ? widest(free, shelfTop - st.top - 2 * pad) : null;
        let at = "play";
        if (!w) {
          w = widest(s.width - 2 * pad, floor - listEnd - 14 - pad);
          at = "under-list";
        }
        if (!w) {
          asRow();
          w = Math.floor(s.width - 8);
          if (size(w) > floor - listEnd - 14 - pad) at = "under-guide";
        }
        box.dataset.at = at;
        const up = { left: "var(--njg-s5, 24px)", top: "-11px", borderTop: "0", borderLeft: "11px solid transparent", borderRight: "11px solid transparent", borderBottom: "12px solid var(--njg-card)" };
        if (at === "play") {
          box.style.left = `${st.left + 14}px`;
          box.style.top = `${Math.max(st.top + pad, g.top)}px`;
          Object.assign(tail.style, { left: "-11px", top: "var(--njg-s5, 24px)", borderLeft: "0", borderTop: "11px solid transparent", borderBottom: "11px solid transparent", borderRight: "12px solid var(--njg-card)" });
        } else {
          box.style.left = `${s.left + (s.width - w) / 2}px`;
          box.style.top = `${(at === "under-list" ? listEnd : g.bottom) + 14}px`;
          Object.assign(tail.style, up);
        }
      };
      fit();
      callout = box;
      const onResize = () => fit();
      global.addEventListener("resize", onResize);
      box.addEventListener("ck-gone", () => global.removeEventListener("resize", onResize));
      if (Cook.life && Cook.life.onEnd) Cook.life.onEnd(hideCallout);
    };
    const allRungs = new Set();
    const trackRung = (r) => (r && allRungs.add(r), r);
    let lastStep14 = null;
    const firstLit14 = {};
    const CONTROL14 = new Set(["knob", "slow", "pour"]);
    let cardWait14 = false; // (CHAI-37's order card light waiting for stillness: one waiter only)
    let ctl14 = null;
    const coachStep = (nx, sid) => {
      // (s12-w3b: never a help spotlight while a pan is off its burner pouring)
      if (pans.some((q) => q.away)) return coachEnd();
      rungCur = rungOf(nx);
      if (s14) {
        const st = nx && nx.phase;
        // CHAI-37 (Zafar, 27-28 Oct): after the first two items (the water, the tea), the whole order card lit for a moment (1.2 s;
        // no glow, no bounce), so the eye knows where to look next; once, for a new player
        // (Zafar, 29 Oct: "start its timer after the last animation action ... when the tea has finished going in": the light waits
        // until nothing is in flight, then a beat, then its time)
        // (SH-178, the judge, 3 Nov: a light skipped because the child had already moved on still used up its one showing, so a child who
        // stalled later never saw it: the showing is used only when the light is up; until then each pan's tea brings it again)
        // (one waiter at a time: the sandbox, 3 Nov, contract-87: each step opened while it waited started another, and three lit the
        // card together)
        // (and only towards an item: the sandbox, 3 Nov: after a pan's tea the next step can be picking the next pan, which has no item,
        // and the whole order card lit beside the pan's own light, contract-79 and -87)
        if (lastStep14 === "tea" && st !== "tea" && firstLit14.tea && gate14.fresh && !gate14.spent("card") && !cardWait14 && rungCur && rungCur.id) {
          cardWait14 = true;
          // (the orchestrator's film, 30 Oct: a child who has already moved on to the next thing needs no pointer: skipped, and a pour
          // begun while it is lit ends it; contract-79: it waits for a quiet spell; contract-82: the card whole in view, a face over it
          // in its box; SH-178: the next item's own card, following it as the order card is drawn again, the whole card only when the
          // item has no card in the row; Zafar, 4 Nov: up to 8 s, giving up only once the step has moved on from this one)
          // (the kitchen kit's card light, Cook.Coach.cardLight)
          const m0 = moves14;
          const on = () => moves14 !== m0;
          const moving = () => busy || spoons14 > 0 || pans.some((q) => q.away);
          const forStep = sid;
          const keyBefore = rungKey;
          Cook.Coach.cardLight({
            item: () => Cook.Coach.itemCard(rungCur && rungCur.id, sel ? sel.who : null),
            quitIf: () => on() || finished || (rungKey !== forStep && rungKey !== keyBefore),
            busy: moving,
            endIf: () => moving() || on(),
            step: st || "",
            note: `${STATION14}:${S14_TAG}light`,
            onLit: () => {
              gate14.spend("card");
              cardWait14 = false;
            },
          }).then((lit) => !lit && (cardWait14 = false));
        }
        lastStep14 = st || lastStep14;
        // Nani's helper card follows the step: the item asked for now (the arrow opens it whenever the child wants)
        if (sid !== rungKey && UI.helper) UI.helper(rungCur && rungCur.id && ITEM_STEPS.has(st) ? helperOf(rungCur.id, st === "cups") : null);
      }
      if (sid === rungKey) {
        if (helpObj && rungCur && helpObj !== rungCur.obj) helpGlow(rungCur.obj);
        return;
      }
      if (ctl14) ctl14.close();
      ctl14 = null;
      // (Zafar, 29 Oct, his video: "it was voice, pause, dim, pause, gold outline": a control's call and its light come together:
      // the knob to light the cooker, the knob at the green, the glass for the pour are lit (the dim, the gold box, the glow) as the
      // step opens and its call is said, until the step moves on)
      // SH-181, CHAI-56 (Zafar, 1 Nov: "the turn on the stove onboarding already happens on the first pot of tea, so it doesn't need to
      // repeat itself on a second pot of tea. Onboarding should only be actions that occur for the first time"; "If you're not a new
      // player, Nani should just give you the instruction, and then ... after that time has elapsed, then you should get the
      // onboarding visual"): that light only the first time each control comes up, for a new player (gate14.first: once a visit for the
      // labs' New player, once ever otherwise); every other time the call alone, and the same light as the stuck hint after the
      // level's wait (data/rules.json levels.hintS: 7, 9, 11, 13 s); never for the timed knob at the green (decision 5e)
      // (CHAI-50, Zafar, 30 Oct: "a black tint ... that never goes away ... the gold square box doesn't go away either": closing the
      // last rung's spotlight refreshes the station, which came back in here before rungKey was set and opened a second light that
      // nothing closed. The key is set and the rung let go first, so a refresh from its close finds this step already open)
      const r0 = rung;
      rung = null;
      rungKey = sid;
      if (s14 && (CONTROL14.has(nx && nx.phase) || (rungCur && rungCur.panPick)) && rungCur && rungCur.target && OB14 && OB14.light) {
        if (r0) r0.done();
        hideCallout();
        // (the orchestrator's film, 30 Oct: the pour's one box round the glass and its pan took in the other person's pan between
        // them: the box is the control alone (the glass, which pours at a tap too); its pan keeps its glow and its tap)
        if (ctl14) ctl14.close(); // (one light at a time, whatever came back in above)
        // (Zafar, 30 Oct: "add a second extra to the pause between the last item being added (including its animation) and the chulo
        // bar onboarding": the control's light and its call wait until nothing moves on the stage, then a second more; the call is
        // held for the light (UI.holdCalls), so they still come together, contract-78)
        const target = rungCur.target, also = rungCur.also, obj = rungCur.obj;
        // (picking the next pan: its first time is CHAI-68's own light, so here only the stuck hint)
        const firstTime = rungCur.panPick ? false : gate14.first(`ctl-${nx.phase}`);
        // (the kitchen kit's call with its light, Cook.Coach.control: the first time the light and the call together, the call held
        // until the light shows (contract-78), after a breath only when lighting the cooker after the last thing went in (the knob at
        // the green, "Slow kar!", is timed and comes at once); after that the call alone and the same light as the stuck hint after
        // the level's wait from the last action (SH-184), at once after a wrong move (Cook.Coach.wrong); none at the green)
        ctl14 = Cook.Coach.control({
          key: STATION14,
          target,
          also,
          round: !!rungCur.round,
          first: firstTime,
          pauseMs: nx && nx.phase === "knob" ? CONTROL_PAUSE_MS : 0,
          hintMs: hintMs14,
          current: () => rungKey === sid && !finished,
          busy: () => busy || pans.some((q) => q.away),
          noHint: nx.phase === "slow",
          onLight: () => helpGlow(obj),
          onHint: () => {
            hints14++; // (SH-160: the guide's hint came)
            if (UI.stepHelp) UI.stepHelp(); // (her call again with the light: contract-78)
          },
        });
        return;
      }
      if (r0) r0.done();
      hideCallout();
      if (helpObj) helpGlow(null);
      const step = nx && nx.phase;
      if (!step || !Cook.Coach || !Cook.Coach.rungs) return;
      const cur = rungCur;
      if (!cur) return;
      const answer = step === "cups";
      const items = ITEM_STEPS.has(step);
      const target = () => (rungCur && rungCur.target ? rungCur.target() : null);
      // (under the spotlight the live thing takes a tap, and so does the "?": the help stays everyone's, Zafar, 21 Oct)
      const live = [target, "#btn-help"].concat(cur.also ? [cur.also] : []);
      const name = UI.stepId && UI.stepId() != null ? UI.stepId() : null;
      const mark = () => answer && cur.id && !helped.has(cur.id) && (helped.add(cur.id), Cook.onHelp && Cook.onHelp("hint", { ids: [cur.id] }));
      const lightObj = () => (rungCur ? rungCur.obj : cur.obj);
      // (the answer: no hint past support unless it is study, Cook.Coach.rungs's word, answer, study: STD-D2-05)
      rung = trackRung(Cook.Coach.rungs("chai-tray", step, Object.assign(
        { word: cur.id, answer, study: !!(guided || (sel && sel.redo)) },
        // (the judge, 23 Oct: the finger taps the thing's body from above, never over its word chip under it)
        { name, target, live, fingerDown: true, item: () => (rungCur && rungCur.point ? rungCur.point() : null), avoid: cur.avoid ? cur.avoid() : null, light: (on) => (on ? ((firstLit14[step] = true), mark(), helpGlow(lightObj())) : helpGlow(null)) },
        // CHAI-32: the box at once only the first time, for the water and the tea (never the first ordered item)
        answer ? { first: false } : {},
        items
          ? {
              // (s14: the child alone after the first two, Nani's hint after the level's wait, the central rules' hintS; no heavy box)
              at: s14 ? [0, null, null] : [0, LADDER.boxAt, null],
              glowAt: s14 ? hintMs14() : LADDER.glowAt,
              glow: (on) => {
                if (on) {
                  hints14++; // (SH-160: the guide's hint came)
                  mark();
                  showCallout(cur.id);
                  helpGlow(lightObj());
                } else {
                  hideCallout();
                  helpGlow(null);
                }
              },
            }
          : { line: () => (hints14++, UI.stepHelp && UI.stepHelp()) }
      )));
    };
    const coachEnd = () => {
      if (ctl14) ctl14.close();
      ctl14 = null;
      // (every rung this station started: one replaced while its first-time spotlight was still to open kept it, over the pour)
      allRungs.forEach((r) => r && r.done && r.done());
      allRungs.clear();
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
      // CHAI-61: a lit pan that reaches the green while something goes into another pan is called at once ("Slow kar!", the knob's
      // glow and tap), as its heat runs on through the add (contract-70: the call as the bar enters the green, never held back)
      const hotNow = busy ? plan() : null;
      if (busy && !(hotNow && hotNow.phase === "slow")) {
        zb.expect({ kind: "wait" }); // a pour in progress: the player waits for it
        // s12-w3b (the judge, 26 Oct: a help spotlight dimmed the whole pour): no help rung runs while a pan pours; the next
        // step's help starts afresh after it
        coachEnd();
        helpGlow(null);
        hideMic();
        return;
      }
      const nx = hotNow || plan();
      gaugePan = nx && nx.gauge ? nx.gauge : null;
      if (gaugePan) zb.gauge({ level: gaugePan.heat, lo, hi, at: ringAt(gaugePan) });
      // (the step's phase rides on its expectation, so the evidence moments phase:slow and phase:pour come; 3 Nov)
      zb.expect(nx ? (nx.phase ? Object.assign({}, nx.e, { phase: nx.phase }) : nx.e) : null);
      // (contract-70: where the bar was as "Slow kar" was called)
      if (nx && nx.slowAt && lastPhase !== "slow:") note("chai-slow", nx.slowAt.heat.toFixed(3), `${lo}/${hi}/${nx.slowAt.who}`);
      // (a control's step names no item: Nani's card lets the last item go before the call is said, contract-89; the sandbox, 3 Nov)
      if (nx && CONTROL14.has(nx.phase) && UI.helper) UI.helper(null);
      if (nx) phase(nx.phase, nx.pid, !!(nx.e && /^pan-/.test(nx.e.key || ""))); // S02-B: nothing to do -> the box is empty (R2)
      // Sprint 11: the real item's demo and the hint rungs for the step Nani has just opened (and calls)
      // (picking the next pan is its own step, so the water after it opens as a new one with its own help: the sandbox, 3 Nov, contract-24)
      coachStep(nx, nx && nx.phase ? `${nx.phase}:${nx.pid || ""}${nx.e && /^pan-/.test(nx.e.key || "") ? ":pick" : ""}` : null);
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
        if (obj && pans.some((q) => q.glowRing === obj)) obj.setVisible(true).setAlpha(0.9);
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
    // decision 53: said already in the requests pop-up; else each in turn, the kit's gap between (UI.mission.times.speakGap)
    if (!ctx.requestsSaid) await UI.peopleSay(pans.map((pan) => orderOf(pan)));
    // SH-196 (Zafar, 2 Nov: "teach the blur of the word, and then the image, both when they first happen (no need to repeat for the
    // kutchi blurred as its same and english word blurred)"): once per player, for every game (one key each, not chai's own), the
    // first dotted word on the order card is lit ("tap the dots": a tap shows the word in its place, free help), then, the first
    // time a picture is blurred, its eye. The English and the Kutchi dots are one lesson. Was (Sprint 14): the Kutchi dots only.
    // (the kitchen kit's reveal lessons, Cook.Coach.lessons: once the order has landed, the dotted word then the blurred picture, each
    // spent only once its box is drawn: CHAI-102; once a round for the New player, Zafar 4 Nov evening)
    if (s14) await Cook.Coach.lessons({ gate: gate14, ctx, busy: () => busy || spoons14 > 0 });
    talked = true;
    refresh();
    let nudge = setInterval(() => !finished && refresh(), 250);

    /** The review faces, one over each glass (sized to the tray's spacing); the praise is said once, when all are right. */
    const serve = NjgServe.for(Cook);
    function review(wrongPans) {
      // CK-07: one face per person at the review: the big face over their glass stands in for its small rim badge
      pans.forEach((q) => q.well.face && q.well.face.setVisible(false));
      // CHAI-08's flaw (the judge, 20 Oct): each face at its glass's upper left, over the rim's edge only, sized so it never reaches
      // the next glass; (s08 sweep, CK-07's flaw) a face stays on the tray, its left edge inside the tray's own; the praise card right
      // of the last face, or left of the leftmost where it would run off the view (NjgServe.layout)
      const dishes = pans.map((q) => ({ who: q.who, x: q.well.x, y: q.well.y, w: q.well.glass.empty.displayWidth }));
      return serve.faces(S, dishes, wrongPans.map((q) => pans.indexOf(q)), { left: tray.x, right: (Cook.view && Cook.view.right) || 1600 });
    }

    /* ---------- the tick: check every glass against what its person said ----------
     * Decision 51 (CK-23, S02-A reference wiring): a wrong cup is redone on the spot. The right cups stay done; the
     * wrong one empties (pan and glass), its person's rows open again, and the second try has help (the next thing
     * glows). At the third wrong try the game shows the right way and moves on. The first try is the one scored. */
    const emptyPan = (pan) => {
      Object.assign(pan, { level: 0, has: { water: 0, leaves: 0, milk: 0 }, sugar: 0, salt: 0, extras: [], spoons: [], heat: 0, state: "cold", poured: 0, closed: false, spoonsClosed: false, capped: false });
      pan.redo = (pan.redo || 0) + 1;
      setKnob(pan, "off");
      if (pan.heatRing && pan.heatRing.g) pan.heatRing.g.clear();
      pan.bubbles.clear();
      setLook(pan);
      ["empty", "half", "full"].forEach((s2) => pan.well.glass[s2].setAlpha(s2 === "empty" ? 1 : 0));
      pan.well.fill = 0;
      ["half", "full"].forEach((st) => {
        const g = pan.well.glass[st];
        g.blackDone = false;
        glassLook(g, `v2-glass-${st}`);
      });
      UI.mission.reopen(null, dishNo(), { for: pan.who });
    };
    // the right way, shown: their things glow in turn on the shelf while their card is read, then the glass fills
    const showRight = async (pan) => {
      const p = pan.p;
      const ids = ["cook-paani", "cook-chai", p.dudh ? "cook-dudh" : null, p.khun ? "cook-khun" : null, p.extra || null].filter((id) => id && shelf[id]);
      select(pan);
      const said = UI.personSay(pan.who, orderOf(pan)).catch(() => {});
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
    // decision 51 (CK-23): the kitchen kit's tick and recast (NjgServe.round): each glass checked, the faces, a wrong cup's person
    // says again what they asked for, and each wrong cup is redone, or (its third wrong try) shown the right way
    let lad = null;
    let dish = 0;
    await serve.round({
      items: pans,
      done: async () => {
        await doneP;
        finished = true;
        Cook.shelfPic = null; // (the next station's cards take their own shelf's pictures)
        Cook.shelfJars = false;
        Cook.serveTicks = null;
        coachEnd();
        hideMic();
        clearInterval(nudge);
        syncTakeBack(); // (Done: nothing comes back out now)
        phase(null);
        unglow();
        UI.hideDone();
        UI.hideCount();
        zb.expect(null);
        lad = L();
        dish = dishNo();
      },
      check: (pan, round) => {
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
          // SH-159: each asked-for thing's word pill: right on the first try (no wrong spoonful for it) and no peek or help
          if (P14()) {
            const wrongFirst = (id) => (pan.firstWrong || []).some((w) => w.row === id);
            const peeked = (id) => helped.has(id) || !!(ctx.wordHelp && ctx.wordHelp.has(id));
            const asked = [["cook-paani", got.chai], ["cook-chai", got.chai]].concat(p.dudh ? [["cook-dudh", got.milk]] : [], p.khun ? [["cook-khun", got.sugar]] : [], p.extra ? [[p.extra, got.extra]] : []);
            asked.forEach(([id, ok]) => {
              P14().pill(id, { ok: !!ok, firstTry: !wrongFirst(id), peek: peeked(id) });
              pillNote(id);
            });
            let refit = false;
            Object.values(shelf).forEach((o) => o && o.chip && o.chip.active && o.chip.showsWord !== pillShows14(o.chip.pillId) && (refit = true) && o.chip.face(pillShows14(o.chip.pillId), Infinity));
            if (refit) fitPills(true);
          }
        }
        return { ok: !(why.length || pan.salt), rows: !got.chai || !bad.length ? null : bad };
      },
      onRight: (pan) => {
        pan.redo = 0;
        fx("sparkle", pan.well.x + pan.well.glass.empty.displayWidth * 0.3, pan.well.y - pan.well.glass.empty.displayWidth * 0.3, { w: pan.well.glass.empty.displayWidth * 0.55, ms: 650 });
      },
      // the review (29 Sept, X10 / Q1): each person's big round face over their glass, happy when it's right, a gentle frown when
      // it's wrong (then they say again what they asked for)
      review: (wrong) => review(wrong),
      oops: () => zb.oops(),
      recast: async (pan, rows) => {
        select(pan);
        await UI.personSay(pan.who, orderOf(pan, rows || undefined));
      },
      afterReview: () => pans.forEach((q) => q.well.face && q.well.face.active && q.well.face.setVisible(true)),
      redo: ctx.redo,
      key: (pan) => `chai:${pan.who}`,
      showRight,
      reset: emptyPan,
      again: (again) => {
        finished = false;
        doneShown = false;
        doneP = new Promise((r) => (finishUp = r));
        select(again[0]);
        nudge = setInterval(() => !finished && refresh(), 250);
        refresh();
      },
    });
    stopHeat();
    stove.end(); // (the kit's heat: its loop and steam off, nothing ticks or starts again)
    // SH-181 (P9: js/cook/coach.js C.start returns before chai's coach could be marked seen, so every returning player was "fresh"):
    // chai's first-time showing is used up once its first round ends; a returning player gets the calls alone and the stuck hints
    if (!guided) {
      Cook.save.coached = Cook.save.coached || {};
      Cook.save.coached[STATION14] = true;
    }
    if (mic) mic.remove();
    mic = null;
    [...pans.flatMap((q) => [q.img, q.face, q.knobHit]), ...Object.values(shelf)].forEach((o) => S.untap(o));
    Object.values(shelf).forEach((o) => o.chip && o.chip.disableInteractive());
    await Cook.wait(500);
    zb.close();
    zt.close();
    // SH-160: a finished round counts towards chai's level-up (the central rules); a grown-up's pick (the labs level, a story
    // day's level) plays at its own level and never moves the count
    if (Cook.roundDone && !guided) {
      const dsh = ctx.order && ctx.order.dishes ? ctx.order.dishes[ctx.dishAt || 0] : null;
      Cook.roundDone("chai", { level: Cook.roundLevel(ctx), hints: hints14, grownUp: !!ctx.lab || !(dsh && dsh.autoLevel) });
    }
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

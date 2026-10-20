/*
 * H-boing, the injection, with the drop machine (D15g, decision 27; the 1 Oct report §8H; CLN-58, CLN-37, CLN-42).
 * The doctor holds the syringe; the child helps and counts. Comic, never gory (H26), never scary: no needle shown.
 *
 * 1. Wipe the arm the count of times: the wipe's packet on the shelf, the cloth in the hand (CLN-168).
 * 2. The drop machine (s07 DM1, CLN-164): four clear tubes of coloured liquid MEDICINE, a lever each; a tap on a lever
 *    sends one drop down the chute into the upright syringe below, where it is a band of liquid in its colour (CLN-166),
 *    counted on the syringe (one count, CLN-170). A drop is taken back by tapping THAT band (CLN-58); the first go is
 *    the one scored (E14). The colour is said and on the card at every level (CLN-169); L2 two colours in order
 *    ("ba [red], ne poi hakro [blue]"); L3 the same, heard only (the closed card: Zafar's ladder, 13 Oct).
 * 3. Filled (L1 at the count; L2+ the child's ✓), the syringe places itself over the arm (CLN-167); its glowing end is
 *    pressed: a puff of mist and sparkles at the spot (no needle is ever seen), the medicine goes in, stars and hearts
 *    pop and she giggles. No count-down, no squash, no shake (Zafar, 18 Oct).
 * 4. A plaster of the colour asked on the spot. The apple is only at the send-off (H33), not here.
 * Rows (the words decide): the wipes; the drops (the count at L1, the colours in order from L2).
 * The art swaps in by file name (boing.json `art`: the art plan's D1 and D2); a missing file keeps the stand-in.
 */
(function (root) {
  "use strict";
  const Heal = (root.Clinic && root.Clinic.Heal) || (typeof require === "function" ? require("../registry.js") : null);
  const HS = (root.Clinic && root.Clinic.HealScene) || (typeof require === "function" ? require("../scene.js") : null);

  // CLN-37 (Zafar, 29 Sept / 1 Oct): the dispenser is four coloured tubes with a lever each at EVERY level; at level 1
  // any tube's drop counts (the count is the row); the colours are said from level 2 (COL)
  const K = { wipes: { 1: [1, 2, 3, 4, 5], 2: [2, 3, 4, 5], 3: [2, 3, 4, 5] }, drops: { 1: [2, 3, 4] }, colours: ["red", "yellow", "blue", "green"], tubes: 4, maxDrops: 5 };
  // Zafar (13 Oct, the heal ladder): each level adds one thing, all by level 2; level 3 only closes the card. So the
  // drops' colours, in order, are level 2's new thing (they were level 3's, with the closed card: two at once)
  const COL = 2;
  // line keys in data/clinic/heal/boing.json (the engine says them); T34: the headline is [Time for the jab] (to record)
  const WHY = { problem: "boing-why", goal: "boing-jab-goal" };
  // first-time help: the ghost finger's move for each kind of step (13g: no words, no device voice)
  const CUES = {
    wipe: { gesture: "tap", then: "tap" },
    drops: { gesture: "tap" },
    press: { gesture: "tap" },
    boing: { watch: true }, // the count-down runs by itself: the child watches (and counts along), nothing to demo
    plaster: { gesture: "tap", then: "tap" },
  };
  const MED = { red: "#e0584a", yellow: "#f0c43a", blue: "#4a86d8", green: "#5fae5a", purple: "#8a55c8" };
  // CLN-171 (Zafar, 18 Oct: "this game is about colours, no? So it should specify the colour of the plaster"): the plaster to put on is a named colour
  // (blue or yellow: the two with a picture and no Kutchi yet, so its row is the grey English until Mum gives the word); the shelf holds those two and the skin one
  const PLASTERS = ["skin", "blue", "yellow"];
  const ASKED = ["blue", "yellow"];

  function plan(level, rng) {
    const L = Math.max(1, Math.min(3, level));
    const wipes = HS.pick(K.wipes[L], rng);
    let drops;
    // CLN-164 (s07 DM1): the drop machine's four tubes stand in its own order (red, yellow, blue, green, as drawn); the
    // colour asked is the random thing, never the place
    const tubes = K.colours.slice(0, K.tubes);
    if (L < COL) {
      // level 1: one colour, said and on the card (CLN-169), the count with it
      drops = Array(HS.pick(K.drops[L], rng)).fill(HS.pick(tubes, rng));
    } else {
      const [a, b] = HS.shuffle(tubes, rng);
      const na = 1 + Math.floor(rng() * 2);
      const nb = 1 + Math.floor(rng() * 2);
      drops = Array(na).fill(a).concat(Array(nb).fill(b));
    }
    const groups = [];
    drops.forEach((c) => (groups.length && groups[groups.length - 1].c === c ? groups[groups.length - 1].n++ : groups.push({ c, n: 1 })));
    const plaster = HS.pick(ASKED, rng);
    const Lg = HS.L; // words, numbers and joins from data through the seam (R5)
    const say = (m, o) => Lg.show(m, o);
    const groupM = (g) => Lg.item(g.c, { n: g.n });
    // CLN-169 (Zafar, 18 Oct: "the game doesn't tell you which colour drops to put in there ... there should be an English placeholder"): the drops'
    // colour is on the card at EVERY level ("drops: three red"; a colour with no Kutchi yet is its grey English), the count with it; level 1 is one colour
    const dropW = say(Lg.join(["cl-drops", ":", ...groups.flatMap((g, i) => (i ? [",", groupM(g)] : [groupM(g)]))]), { cap: true });
    const steps = [
      { id: "wipe", kind: "wipe", count: wipes, row: Object.assign({ id: "wipe", seq: "steps" }, say(Lg.join(["cl-wipe", ",", Lg.count(wipes)]), { cap: true })) },
      {
        id: "drops",
        kind: "drops",
        drops,
        row: Object.assign({ id: "drops", seq: "steps" }, dropW),
        // L3: the colours in order are a sequence on the card (13h): one part per colour (in the job's one sequence)
        rows: L < COL ? null : groups.map((g, i) => Object.assign({ id: `drops${i}`, seq: "steps" }, say(i ? Lg.then(groupM(g), { lower: true }) : groupM(g)))),
      },
      { id: "press", kind: "press", row: Object.assign({ id: "press", seq: "steps" }, say(Lg.item("boing-press"), { cap: true })) },
      { id: "boing", kind: "boing", row: null },
      { id: "plaster", kind: "plaster", colour: plaster, row: Object.assign({ id: "plaster", seq: "steps" }, say(Lg.item("cl-plaster", { mods: [`col-${plaster}`] }), { cap: true })) },
    ];
    const rows = [{ id: "wipe-count", options: K.wipes[L], answer: wipes }];
    rows.push({ id: "drop-colours", seq: tubes, answer: drops, placeholder: true }); // (CLN-169: the colour is asked at every level; level 1's is one colour, its count with it)
    rows.push({ id: "plaster-colour", options: PLASTERS, answer: plaster, placeholder: true });
    const words = [Lg.num(wipes), Lg.w("cl-wipe"), Lg.w("cl-drops"), Lg.w("cl-plaster")];
    groups.forEach((g) => words.push(Lg.num(g.n)));
    if (L >= COL) words.push(Lg.w("lnk-pela"), Lg.w("lnk-nepoi"));
    return { level: L, steps, rows, words, tubes };
  }

  function mount(stage, ctx) {
    const P = plan(ctx.level, ctx.rng);
    // CLN-118 (D13): the taught round is shown by the ghost finger and scores nothing;
    // SH-99, CLN-161 (Zafar, 18 Oct; reverses CLN-118): the taught first round writes and says every count too, and its word review keeps the number words
    if (ctx.taught) P.words = HS.taughtWords(P.words).concat(P.words.filter((w) => w && w.n != null));
    const Kit = root.Clinic && root.Clinic.Kit;
    const fast = () => !!(Kit && Kit.fast);
    const S = HS.make(stage, ctx, { place: "limb", game: "boing" });
    const { s } = S;
    const st = { i: 0, wipes: 0, drops: [], judged: {}, over: false, busy: false, slip: false, wrongColour: false, max: 0 };
    const cur = () => P.steps[st.i] || null;
    const ART = (ctx.data && ctx.data.art) || {};
    const url = (u) => (Kit && Kit.url ? Kit.url(u) : u);
    // CLN-113 (S05-D): the job is one sequence on the shared card; SH-45 (S05-D3): at level 1 each step's row joins the
    // card as the step opens; from level 2 the whole sequence from the start
    const rowsOfStep = (x) => x.rows || (x.row ? [x.row] : []);
    ctx.card.ordered(false);
    ctx.card.setRows(P.level >= 2 ? [].concat(...P.steps.map(rowsOfStep)) : rowsOfStep(P.steps[0]));

    // the upper arm across the bottom left (U1's close-up swaps in); the jab spot
    // CLN-167 (Zafar, 18 Oct: "one fifth of the way up the bicep, central to the arm"; it sat in the crook): a fifth of
    // the way up from the elbow's crease towards the sleeve, in the middle of the arm (data art.upperarm.spot)
    const UA = ART.upperarm || {};
    const A = { x: (UA.spot && UA.spot[0]) || 300, y: (UA.spot && UA.spot[1]) || 395 };
    const skin = S.skin || "#d9a57c";
    const armG = s("g", {}, S.layer);
    const armBody = s("g", {}, armG); // the stand-in drawing (S03-D: U1-v2's close-up swaps in for it, boing.json art.upperarm)
    s("path", { d: "M-40 330 L410 345 Q474 350 474 400 Q474 452 410 456 L-40 470 Z", fill: skin, stroke: S.skinDark || "#b9845c", "stroke-width": 4 }, armBody);
    s("path", { d: "M-40 322 L130 326 Q150 400 130 478 L-40 478 Z", fill: S.clothes || "#e25a5a", stroke: "rgba(0,0,0,.18)", "stroke-width": 3 }, armBody); // the rolled sleeve
    const armArt = S.closeup("upperarm", armBody);
    if (armArt) armG.insertBefore(armArt, armG.firstChild);
    const spot = s("circle", { cx: A.x, cy: A.y, r: 16, fill: "none", stroke: "#2e8b7a", "stroke-width": 4, "stroke-dasharray": "5 5" }, armG);
    const shine = s("ellipse", { cx: A.x, cy: A.y, rx: 62, ry: 30, fill: "#fff", opacity: 0 }, armG);
    const markG = s("g", {}, armG);

    /*
     * CLN-164, CLN-165 (Zafar, 18 Oct: "a lot more photorealistic ... smaller"): the s07 drop machine (DM1) and its levers
     * (DM2), drawn at about three quarters of the old machine's size: four clear tubes of coloured medicine, each with a
     * drip spout and a lever in its socket; the drops run down the chute to its round mouth, and from there into the
     * syringe standing under it. Without the art, the drawn machine of before stands in.
     */
    const MV = ART.machineV3 && ART.machineV3.file ? ART.machineV3 : null;
    const machG = s("g", { class: "bo-machine" }, S.layer);
    const levers = {};
    let M;
    let ring;
    const tubeX = {};
    if (MV) {
      const [bx, by, bw] = MV.box;
      const k = bw / MV.size[0];
      const at = (x, y) => ({ x: bx + x * k, y: by + y * k });
      s("image", { href: url(MV.file), x: bx, y: by, width: bw, height: MV.size[1] * k, class: "bo-machine-art" }, machG);
      M = { x: bx, y: by, w: bw, h: MV.size[1] * k, spout: at(0, MV.spoutY).y, tubeTop: at(0, MV.tubeY[0]).y, tubeBot: at(0, MV.tubeY[1]).y, k };
      ring = at(MV.ring[0], MV.ring[1]);
      const LV = ART.levers || {};
      P.tubes.forEach((c, i) => {
        const sock = at(MV.tubes[i], MV.socketY);
        tubeX[c] = sock.x;
        const lv = s("g", { class: "bo-lever", "data-colour": c }, machG);
        const draw = (f) => {
          if (!f || !f.file) return null;
          const kk = (LV.plate || 26) / f.plate[2];
          return s("image", { href: url(f.file), x: sock.x - f.plate[0] * kk, y: sock.y - f.plate[1] * kk, width: f.size[0] * kk, height: f.size[1] * kk }, lv);
        };
        const upEl = draw(LV.up);
        const downEl = draw(LV.down);
        if (downEl) downEl.setAttribute("opacity", 0);
        levers[c] = { g: lv, arm: lv, upEl, downEl, x: sock.x, kx: sock.x, y: sock.y - ((LV.plate || 26) * 0.6) };
      });
    } else {
      // the drawn machine of before (white and pale steel, clear tubes, a drip spout and a lever each)
      const n = P.tubes.length;
      const MC = 540;
      M = { x: MC - (50 + n * 56) / 2, y: 10, w: 50 + n * 56, h: 172 };
      M.spout = M.y + 126;
      M.tubeTop = M.y + 12;
      M.tubeBot = M.y + 112;
      ring = { x: MC, y: M.y + M.h - 8 };
      const tubeW = 40;
      s("rect", { x: M.x, y: M.y, width: M.w, height: M.h, rx: 18, fill: "#f4f6f8", stroke: "#a9b4bf", "stroke-width": 4 }, machG);
      s("rect", { x: M.x + 8, y: M.y + M.h - 34, width: M.w - 16, height: 26, rx: 8, fill: "#dfe5ea" }, machG);
      P.tubes.forEach((c, k) => {
        const x = M.x + 25 + 28 + k * 56;
        tubeX[c] = x;
        s("rect", { x: x - tubeW / 2, y: M.y + 12, width: tubeW, height: 100, rx: tubeW / 2, fill: "rgba(255,255,255,.7)", stroke: "#a9b4bf", "stroke-width": 3 }, machG);
        s("rect", { x: x - tubeW / 2 + 5, y: M.y + 38, width: tubeW - 10, height: 70, rx: (tubeW - 10) / 2, fill: MED[c], opacity: 0.55 }, machG);
        const lv = s("g", { class: "bo-lever", "data-colour": c }, machG);
        const arm = s("g", { class: "bo-arm" }, lv);
        s("line", { x1: x + 14, y1: M.y + 128, x2: x + 14, y2: M.y + 146, stroke: "#6f7c88", "stroke-width": 6, "stroke-linecap": "round" }, arm);
        s("circle", { cx: x + 14, cy: M.y + 150, r: 13, fill: MED[c], stroke: "#4f5b66", "stroke-width": 3 }, arm);
        levers[c] = { g: lv, arm, x, kx: x + 14, y: M.y + 150 };
      });
    }

    /*
     * The syringe (the s02 E11 sheet, CLN-164: its picture, no drawn rects), at about 0.85 of before (CLN-165), standing
     * under the chute's mouth, its blue cap down: no needle is ever shown. CLN-166 (Zafar: "they should just fill the
     * syringe with liquid corresponding to the colour of the dropper"): each drop is a band of liquid in its tube's colour,
     * the barrel filling from the bottom; a band is taken back by tapping it (CLN-58).
     */
    const SYA = ART.syringe && ART.syringe.file ? ART.syringe : null;
    const syH = (SYA && SYA.h) || 210;
    const syK = SYA ? syH / SYA.size[1] : 1;
    const syW = SYA ? SYA.size[0] * syK : 66;
    const SY = { x: ring.x - syW / 2, y: (MV ? M.y + M.h - 18 : 262), w: syW, h: syH };
    const syCx = SY.x + SY.w / 2;
    const syG = s("g", { class: "bo-syringe" }, S.layer);
    const BAR = SYA ? { x0: SY.x + SYA.barrel[0] * syK, y0: SY.y + SYA.barrel[1] * syK, x1: SY.x + SYA.barrel[2] * syK, y1: SY.y + SYA.barrel[3] * syK } : { x0: SY.x + 6, y0: SY.y + 40, x1: SY.x + SY.w - 6, y1: SY.y + SY.h - 6 };
    const tipY = SYA ? SY.y + SYA.tip * syK : SY.y + SY.h + 58; // the cap's end (the needle's place, never shown)
    const glow = s("ellipse", { cx: syCx, cy: SY.y + 8, rx: 46, ry: 20, fill: "#ffe27a", opacity: 0 }, syG);
    let syFull = null;
    let syEmpty = null;
    if (SYA) {
      syFull = s("image", { href: url(SYA.file), x: SY.x, y: SY.y, width: SY.w, height: SY.h }, syG);
      if (SYA.pressed) syEmpty = s("image", { href: url(SYA.pressed), x: SY.x, y: SY.y, width: SY.w, height: SY.h, opacity: 0 }, syG);
    } else {
      s("rect", { x: SY.x, y: SY.y, width: SY.w, height: SY.h, rx: 12, fill: "rgba(235,246,251,.6)", stroke: "#6a8aa8", "stroke-width": 5 }, syG);
      s("rect", { x: syCx - 10, y: SY.y + SY.h, width: 20, height: 16, fill: "#6a8aa8" }, syG);
    }
    // the liquid in the barrel, laid over the picture's glass and multiplied, so its marks and shine show through
    const liquidG = s("g", { class: "bo-liquid" }, syG);
    liquidG.style.mixBlendMode = "multiply";
    const syEl = syFull || syG;
    const bandH = (BAR.y1 - BAR.y0) / K.maxDrops;
    const bandY = (k) => BAR.y1 - (k + 1) * bandH;
    const drawDrops = () => {
      S.clear(liquidG);
      st.drops.forEach((c, k) => {
        const r = s("rect", { class: "bo-drop", x: BAR.x0, y: bandY(k), width: BAR.x1 - BAR.x0, height: bandH + 0.6, fill: MED[c] || c, opacity: 0.86 }, liquidG);
        r.dataset.k = k;
      });
      if (st.drops.length) s("rect", { x: BAR.x0 + 2, y: bandY(st.drops.length - 1), width: BAR.x1 - BAR.x0 - 4, height: 2.2, rx: 1, fill: "#fff", opacity: 0.55 }, liquidG); // the liquid's top
      count(st.drops.length);
    };
    // CLN-170 (Zafar, 18 Oct: the drops' count "was on the packet item"): one count, on the syringe (the host's chip
    // over the syringe's picture; the taught round, which the host leaves uncounted, keeps the game's own chip there)
    let badgeEl = null;
    const badge = (k) => {
      if (!k) {
        if (badgeEl) badgeEl.remove();
        badgeEl = null;
        return;
      }
      if (!badgeEl || !badgeEl.isConnected) {
        badgeEl = S.h("span", "hs-count", S.root);
        badgeEl.classList.add("at");
        badgeEl.setAttribute("aria-hidden", "true");
      }
      const r = syEl.getBoundingClientRect();
      const rr = S.root.getBoundingClientRect();
      badgeEl.style.left = `${Math.round(r.left - rr.left)}px`;
      badgeEl.style.top = `${Math.round(r.top - rr.top)}px`;
      badgeEl.classList.toggle("dots", P.level >= 3);
      badgeEl.textContent = P.level >= 3 ? "•".repeat(Math.min(k, 9)) : Kit ? Kit.num(k) : String(k);
    };
    const count = (k) => {
      const d = cur();
      if (ctx.taught) return badge(k);
      ctx.tally("drops", k, { of: d && d.drops ? d.drops.length : 0, at: syEl });
    };
    const fallG = s("g", {}, S.fx);
    // a falling drop: a matte, see-through teardrop (never a ball, never a sweet): DM2's drawn drops when cut
    const DROP_ART = ART.drops || {};
    const tear = (g, x, y, r, c, cls) =>
      DROP_ART[c] && Kit
        ? s("image", { class: cls || null, href: Kit.url(DROP_ART[c]), x: x - (2.75 * r * DROP_ART.aspect) / 2, y: y - 1.5 * r, width: 2.75 * r * DROP_ART.aspect, height: 2.75 * r, preserveAspectRatio: "xMidYMax meet", opacity: DROP_ART.opacity || 1 }, g)
        : s("path", { class: cls || null, d: `M${x} ${y - r * 1.5} C${x + r * 0.35} ${y - r * 0.8} ${x + r} ${y - r * 0.2} ${x + r} ${y + r * 0.25} A${r} ${r} 0 1 1 ${x - r} ${y + r * 0.25} C${x - r} ${y - r * 0.2} ${x - r * 0.35} ${y - r * 0.8} ${x} ${y - r * 1.5}Z`, fill: MED[c] || c, opacity: 0.72, stroke: "rgba(0,0,0,.18)", "stroke-width": 1.5 }, g);
    const countG = s("g", {}, S.fx);

    const judge = (id, ok, detail) => {
      st.judged[id] = ok;
      ctx.log({ type: ok ? "right" : "wrong", rowId: id, detail });
    };
    const TOOL = { wipe: "cotton", plaster: "plaster-skin" };
    // the syringe's end (the plunger's top) lit and pulsing: the thing to press next
    const endY = () => SY.y + 8;
    const lightEnd = (on) => {
      glow.getAnimations && glow.getAnimations().forEach((a) => a.cancel());
      glow.setAttribute("opacity", on ? 0.75 : 0);
      if (!on) return;
      if (glow.animate) glow.animate([{ opacity: 0.35 }, { opacity: 0.85 }, { opacity: 0.35 }], { duration: 1100, iterations: Infinity });
    };
    // CLN-167: once it's filled, the syringe places itself over the arm, upright, its cap just above the spot
    const OVER = { dx: A.x - syCx, dy: A.y - 14 - tipY };
    let placed = false;
    const place = async () => {
      if (placed) return;
      placed = true;
      st.busy = true;
      const a = syG.animate ? syG.animate([{ transform: "translate(0px, 0px)" }, { transform: `translate(${OVER.dx}px, ${OVER.dy}px)` }], { duration: fast() ? 60 : 900, easing: "cubic-bezier(.45,0,.25,1)", fill: "forwards" }) : null;
      if (a) await a.finished.catch(() => {});
      syG.setAttribute("transform", `translate(${OVER.dx} ${OVER.dy})`);
      if (a) a.cancel();
      st.busy = false;
    };
    const open = async () => {
      const c = cur();
      // SH-45: L1 grows step by step; a row added this way is said here (as the ear's), the card's own reveal does not say it
      if (P.level < 2 && st.i > 0 && ctx.card.addRow) {
        rowsOfStep(c).forEach((r) => ctx.card.addRow(r));
        if (c.row && c.kind !== "boing") ctx.say(c.row);
      }
      if (c.kind !== "boing") ctx.card.now(c.id); // SH-45: the card opens the step's row and says it then (once)
      spot.setAttribute("opacity", c.kind === "plaster" || c.kind === "wipe" ? 1 : 0);
      glow.setAttribute("opacity", 0);
      if (c.kind === "boing") {
        S.cue("boing", CUES.boing, { x: syCx, y: SY.y });
        return jab();
      }
      if (c.kind === "drops") {
        S.pick(null); // the cloth goes down: the count sits on the syringe, not on a tool
        const want = c.drops[0];
        S.cue("drops", CUES.drops, { x: levers[want].kx, y: levers[want].y, r: 22 });
        return;
      }
      if (c.kind === "press") {
        await place();
        if (cur() !== c) return;
        lightEnd(true);
        S.cue("press", CUES.press, () => ({ x: syCx + OVER.dx, y: endY() + OVER.dy, r: 40 }));
        return;
      }
      S.cue(c.kind, CUES[c.kind], S.toolEls[c.kind === "plaster" ? `plaster-${c.colour}` : TOOL[c.kind]], { x: A.x, y: A.y });
    };
    const close = () => {
      const c = cur();
      if (!c) return;
      if (c.kind === "wipe") judge("wipe-count", st.wipes === c.count, `${st.wipes} of ${c.count}`);
      if (c.kind === "plaster") judge("plaster-colour", st.plaster === c.colour, `${st.plaster || "none"} of ${c.colour}`);
      if (c.kind === "drops") {
        // a drop taken back counts only if the child had gone past the count (the first go is scored)
        const over = st.slip && st.max > c.drops.length;
        judge("drop-colours", !over && !st.wrongColour && JSON.stringify(st.drops) === JSON.stringify(c.drops), st.drops.join(" "));
        badge(0);
      }
      if (c.row) ctx.card.tick(c.id);
      (c.rows || []).forEach((r) => ctx.card.tick(r.id, { quiet: true }));
      S.uncue();
      st.i++;
      if (cur()) open();
      else finish();
    };
    // B2: a cartoon "boing" (a springy pitch wobble), made here; quiet in tests
    const boingSound = () => {
      try {
        if (fast() || (Kit && Kit.Voice && Kit.Voice.quiet)) return;
        const AC = root.AudioContext || root.webkitAudioContext;
        if (!AC) return;
        const c = (boingSound.ctx = boingSound.ctx || new AC());
        const o = c.createOscillator();
        const g = c.createGain();
        const t = c.currentTime;
        o.type = "sine";
        o.frequency.setValueAtTime(180, t);
        o.frequency.exponentialRampToValueAtTime(520, t + 0.08);
        for (let k = 0; k < 6; k++) o.frequency.setValueAtTime(k % 2 ? 300 : 420, t + 0.1 + k * 0.06);
        o.frequency.exponentialRampToValueAtTime(200, t + 0.5);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.25, t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
        o.connect(g).connect(c.destination);
        o.start(t);
        o.stop(t + 0.6);
      } catch (e) {
        /* no sound */
      }
    };
    /*
     * CLN-167 (Zafar, 18 Oct): the jab, gently. No count-down, no squash, no shake: the syringe (already over the arm)
     * comes down to the spot, a small puff of mist and sparkles covers the cap's end (no needle is ever seen), the
     * medicine goes in (the liquid runs down as the plunger goes home), the stars and hearts pop round the spot (kept:
     * "the stars and the hearts aren't terrible"), she giggles, and the syringe lifts away.
     */
    const jab = async () => {
      st.busy = true;
      lightEnd(false);
      const D = (ms) => (fast() ? 40 : ms);
      const at = { x: A.x, y: A.y - 4 };
      const down = syG.animate ? syG.animate([{ transform: `translate(${OVER.dx}px, ${OVER.dy}px)` }, { transform: `translate(${OVER.dx}px, ${OVER.dy + 10}px)` }], { duration: D(260), easing: "ease-in", fill: "forwards" }) : null;
      // the puff: soft white mist round the cap's end, with gold sparkles in it
      const puff = s("g", { class: "bo-puff" }, S.fx);
      const defs = s("defs", {}, puff);
      const gid = `bo-mist-${Math.floor(ctx.rng() * 1e9)}`;
      const rg = s("radialGradient", { id: gid }, defs);
      s("stop", { offset: "0", "stop-color": "#ffffff", "stop-opacity": 0.95 }, rg);
      s("stop", { offset: "0.6", "stop-color": "#f4f8ff", "stop-opacity": 0.7 }, rg);
      s("stop", { offset: "1", "stop-color": "#ffffff", "stop-opacity": 0 }, rg);
      const mist = [[0, 0, 30], [-22, -8, 22], [22, -6, 22], [-10, 12, 20], [14, 12, 19], [0, -20, 18]].map(([dx, dy, r]) => s("circle", { cx: at.x + dx, cy: at.y + dy, r, fill: `url(#${gid})` }, puff));
      const sparks = [[-30, -24], [32, -18], [-20, 26], [26, 24], [2, -36]].map(([dx, dy], k) => s("path", { d: `M${at.x + dx} ${at.y + dy - 7} L${at.x + dx + 2} ${at.y + dy - 2} L${at.x + dx + 7} ${at.y + dy} L${at.x + dx + 2} ${at.y + dy + 2} L${at.x + dx} ${at.y + dy + 7} L${at.x + dx - 2} ${at.y + dy + 2} L${at.x + dx - 7} ${at.y + dy} L${at.x + dx - 2} ${at.y + dy - 2}Z`, fill: k % 2 ? "#fff6c8" : "#ffd84a", stroke: "#e8b04a", "stroke-width": 0.8 }, puff));
      if (puff.animate) {
        mist.forEach((m, k) => m.animate([{ transform: "scale(.3)", opacity: 0 }, { transform: "scale(1)", opacity: 1, offset: 0.25 }, { transform: "scale(1.15)", opacity: 1, offset: 0.7 }, { transform: "scale(1.35)", opacity: 0 }], { duration: D(1500 + k * 40), fill: "forwards", easing: "ease-out" }));
        mist.forEach((m) => ((m.style.transformBox = "fill-box"), (m.style.transformOrigin = "center")));
        sparks.forEach((p, k) => {
          p.style.transformBox = "fill-box";
          p.style.transformOrigin = "center";
          p.animate([{ transform: "scale(0) rotate(0deg)", opacity: 0 }, { transform: "scale(1.2) rotate(30deg)", opacity: 1, offset: 0.4 }, { transform: "scale(.8) rotate(60deg)", opacity: 0 }], { duration: D(1200), delay: fast() ? 0 : 120 + k * 70, fill: "forwards" });
        });
      }
      if (down) await down.finished.catch(() => {});
      // the medicine goes in: the liquid runs down, the plunger goes home (the pressed picture, same canvas)
      const n0 = st.drops.length;
      const t0 = Date.now();
      await new Promise((res) => {
        const ms = D(700);
        const step = () => {
          const u = Math.min(1, (Date.now() - t0) / ms);
          S.clear(liquidG);
          const top = BAR.y1 - (BAR.y1 - bandY(Math.max(0, n0 - 1))) * (1 - u);
          st.drops.forEach((c, k) => {
            const y = Math.max(top, bandY(k));
            const y2 = BAR.y1 - k * bandH;
            if (y2 > y) s("rect", { x: BAR.x0, y, width: BAR.x1 - BAR.x0, height: y2 - y + 0.6, fill: MED[c] || c, opacity: 0.86 }, liquidG);
          });
          if (syEmpty) {
            syEmpty.setAttribute("opacity", u.toFixed(3));
            syFull.setAttribute("opacity", (1 - u).toFixed(3));
          }
          if (u < 1 && root.requestAnimationFrame) root.requestAnimationFrame(step);
          else res();
        };
        step();
      });
      S.clear(liquidG);
      boingSound();
      // the stars and hearts round the spot (kept), drifting up
      const fun = s("g", {}, countG);
      for (let k = 0; k < 7; k++) {
        const a = -Math.PI / 2 + (k - 3) * 0.42;
        const g = s("g", {}, fun);
        if (k % 2) s("path", { d: "M0 -6 C-6 -14 -16 -6 0 6 C16 -6 6 -14 0 -6Z", fill: "#f28aa0", stroke: "#c95a78", "stroke-width": 2 }, g);
        else s("path", { d: "M0 -10 L3 -3 L10 -3 L4 2 L6 9 L0 5 L-6 9 L-4 2 L-10 -3 L-3 -3Z", fill: "#ffd84a", stroke: "#e8a02f", "stroke-width": 2 }, g);
        const x1 = A.x + Math.cos(a) * 90;
        const y1 = A.y - 40 + Math.sin(a) * 90;
        if (g.animate) g.animate([{ transform: `translate(${A.x}px, ${A.y - 30}px) scale(.2)`, opacity: 0 }, { transform: `translate(${x1}px, ${y1}px) scale(1.3)`, opacity: 1 }, { transform: `translate(${x1}px, ${y1 - 20}px) scale(1)`, opacity: 0 }], { duration: D(900), fill: "forwards" });
        else g.setAttribute("transform", `translate(${x1} ${y1})`);
      }
      S.face("giggle", 900);
      // the syringe lifts away and goes
      const lift = syG.animate ? syG.animate([{ transform: `translate(${OVER.dx}px, ${OVER.dy + 10}px)`, opacity: 1 }, { transform: `translate(${OVER.dx}px, ${OVER.dy - 50}px)`, opacity: 0 }], { duration: D(600), delay: D(250), easing: "ease-in", fill: "forwards" }) : null;
      ctx.after(D(950), () => {
        S.clear(countG);
        puff.remove();
        if (down) down.cancel();
        if (lift) lift.cancel();
        syG.setAttribute("opacity", 0);
        S.face("happy", 800);
        st.busy = false;
        close();
      });
    };
    const finish = () => {
      st.over = true;
      S.uncue();
      ctx.card.now(null);
      S.face("happy");
      S.markSeen();
      ctx.after(fast() ? 200 : 1500, () => ctx.done({ right: P.rows.filter((r) => st.judged[r.id]).length, total: P.rows.length, hints: 0, words: P.words }));
    };

    const IMG = "assets/clinic/items-v2/";
    // ART-20, CLN-106 (s08 w6F): the level plaster (B1's top-down view: a white pad on its coloured strip, the pharmacy
    // belt's plaster) in the tool column and on the arm (boing.json art.plasters); a colour with no picture keeps the old one
    const PL = ART.plasters || {};
    const plasterPic = (c) => PL[c] || `${IMG}plaster-${c}.webp`;
    const plasterH = (w) => w / (PL.aspect || 2);
    // B4 (CLN-106): the alcohol wipe's packet on the shelf; CLN-168 (Zafar, 18 Oct: "you should be cleaning it with the
    // cloth, not ... the packet"): the cloth (sheets/cloth) is what's in the hand on the arm
    const wipeArt = ART["alcohol-wipe"] && ART["alcohol-wipe"].on ? ART["alcohol-wipe"].file : null;
    const clothArt = ART.cloth && ART.cloth.file ? ART.cloth : null;
    const WIPE_SVG = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="14" y="20" width="72" height="60" rx="8" fill="#f8fbfd" stroke="#9fb3c4" stroke-width="4"/><path d="M14 34h72" stroke="#3f8fd0" stroke-width="7"/><path d="M30 60q20-14 40 0" fill="none" stroke="#bcd6ea" stroke-width="5" stroke-linecap="round"/></svg>');
    st.plaster = null;
    S.tools([{ id: "cotton", img: wipeArt || WIPE_SVG, glyph: "•" }].concat(PLASTERS.map((c) => ({ id: `plaster-${c}`, img: plasterPic(c), glyph: "•" }))), (id) => {
      if (/^plaster-/.test(id)) st.plaster = id.slice(8);
    });
    // ✓ (D7): from level 2 the child says when the syringe is full (the count is never given away by moving on at it);
    // then it places itself over the arm (CLN-167). At level 1 the drops close at the count by themselves
    const doneBtn = ctx.button(
      "✓",
      () => {
        const c = cur();
        if (!c || st.over || st.busy) return;
        if (c.kind === "drops" && st.drops.length) close();
      },
      "done"
    );
    if (doneBtn && doneBtn.setAttribute) doneBtn.setAttribute("aria-label", "Next");
    // a lever: one drop runs down into the syringe
    const pull = (colour) => {
      const c = cur();
      if (!c || st.over || st.busy) return;
      if (c.kind === "wipe" && st.wipes) close(); // the next action closes the wipe (D7)
      const d = cur();
      if (!d || d.kind !== "drops") return;
      if (st.drops.length >= K.maxDrops) return;
      const lv = levers[colour];
      if (lv.downEl) {
        lv.upEl.setAttribute("opacity", 0);
        lv.downEl.setAttribute("opacity", 1);
        ctx.after(fast() ? 40 : 260, () => {
          lv.upEl.setAttribute("opacity", 1);
          lv.downEl.setAttribute("opacity", 0);
        });
      } else if (lv.arm.animate) lv.arm.animate([{ transform: "translateY(0)" }, { transform: "translateY(10px)" }, { transform: "translateY(0)" }], { duration: 260 });
      const k = st.drops.length;
      st.drops.push(colour);
      st.max = Math.max(st.max, st.drops.length);
      if (d.drops[k] !== colour) st.wrongColour = true;
      // the drop leaves the tube's spout, runs down the chute and falls from its mouth into the syringe
      const x0 = tubeX[colour];
      const f1 = tear(fallG, x0, M.spout + 8, 6, colour);
      const f2 = tear(fallG, ring.x, ring.y + 6, 6, colour);
      f2.setAttribute("opacity", 0);
      const dur = fast() ? 40 : 520;
      const a1 = f1.animate ? f1.animate([{ transform: "translate(0px,0px)", opacity: 1 }, { transform: `translate(0px, ${(ring.y - M.spout) * 0.35}px)`, opacity: 1, offset: 0.4 }, { transform: `translate(${(ring.x - x0) * 0.6}px, ${ring.y - M.spout - 14}px)`, opacity: 0 }], { duration: dur * 0.55, fill: "forwards", easing: "ease-in" }) : null;
      const a2 = f2.animate ? f2.animate([{ transform: "translate(0px,0px)", opacity: 0 }, { transform: "translate(0px,0px)", opacity: 1, offset: 0.15 }, { transform: `translate(0px, ${bandY(k) + bandH / 2 - ring.y}px)`, opacity: 0.9 }], { duration: dur * 0.6, delay: dur * 0.4, fill: "forwards", easing: "cubic-bezier(.5,0,.9,.6)" }) : null;
      const land = () => {
        f1.remove();
        f2.remove();
        drawDrops();
      };
      if (a2) a2.finished.then(land, land);
      else land();
      if (a1) a1.finished.catch(() => {});
      if (!a2) drawDrops();
      ctx.sfx("pop");
      // D5 (SH-38): at level 1 the row turns gold at the count and the step closes by itself
      if (P.level === 1 && st.drops.length >= d.drops.length) S.when(() => (!cur() || cur().kind !== "drops" || st.over ? "stop" : !st.busy), close, 650, d.id);
    };
    const press = () => {
      const c = cur();
      if (!c || st.over || st.busy || c.kind !== "press" || !placed) return;
      S.uncue(); // the glowing end's help ends with the press
      ctx.card.tick("press");
      st.i++;
      open();
    };
    ctx.on(S.svg, "pointerdown", (e) => {
      if (!S.ready || st.over || st.busy) return;
      const p = S.pt(e);
      const c = cur();
      if (!c) return;
      const tol = 10 * S.unit() + 16;
      // the syringe's glowing end (the plunger's top), over the arm
      if (c.kind === "press" && Math.abs(p.x - (syCx + OVER.dx)) < 50 && p.y > endY() + OVER.dy - 40 && p.y < endY() + OVER.dy + 50) return press();
      // a lever (or its tube: the whole column is the lever's)
      if (c.kind === "wipe" || c.kind === "drops") {
        let best = null;
        Object.entries(levers).forEach(([colour, lv]) => {
          const near = Math.hypot(p.x - lv.kx, p.y - lv.y) < Math.max(22, tol + 4) || (Math.abs(p.x - lv.x) < 17 && p.y > M.tubeTop - 10 && p.y < lv.y + 18);
          const dd = Math.abs(p.x - lv.x);
          if (near && (!best || dd < best.dd)) best = { colour, dd };
        });
        if (best) return pull(best.colour);
      }
      // a band of liquid in the syringe: THAT drop goes back up into its tube (CLN-58: never the whole barrel by surprise)
      if (c.kind === "drops" && st.drops.length && Math.abs(p.x - syCx) < SY.w / 2 + 8 && p.y > BAR.y0 - 10 && p.y < BAR.y1 + 10) {
        let k = -1;
        let best = 1e9;
        st.drops.forEach((_, j) => {
          const dd = Math.abs(p.y - (bandY(j) + bandH / 2));
          if (dd < best) (best = dd), (k = j);
        });
        if (k < 0 || best > Math.max(bandH, tol)) return;
        const colour = st.drops[k];
        st.drops.splice(k, 1);
        st.slip = true;
        drawDrops();
        const up = tear(fallG, syCx, bandY(k), 6, colour);
        if (up.animate) up.animate([{ transform: "translate(0,0)", opacity: 0.8 }, { transform: `translate(0px, ${ring.y - bandY(k)}px)`, opacity: 0 }], { duration: fast() ? 40 : 380, fill: "forwards" }).finished.then(() => up.remove(), () => up.remove());
        else up.remove();
        ctx.sfx("tap");
        ctx.log({ type: "takeback", detail: "a drop" });
        return;
      }
      if (Math.abs(p.y - A.y) > 75 || p.x > 460) return;
      if (c.kind === "wipe" && S.sel === "cotton") {
        st.wipes++;
        S.count(st.wipes);
        ctx.tally("cotton", st.wipes, { next: "lever", of: c.count }); // S02-A hook: decision 52, the next step shows at L2+
        // D5 (SH-38): at level 1 the row turns gold at the count and the step closes by itself
        if (P.level === 1 && st.wipes >= c.count) S.when(() => (cur() !== c || st.over ? "stop" : !st.busy), close, 450, c.id);
        // B4 (CLN-106, S06): the cloth in the hand rubs to and fro across the spot, twice, for about a second; the skin
        // it passes over shines wet, a sheen that follows the wipe and settles
        const sheen = Math.min(0.3, st.wipes * 0.08);
        const dur = fast() ? 60 : 1000;
        const cw = 74;
        const ch = clothArt ? (cw * clothArt.size[1]) / clothArt.size[0] : 68;
        const w = s("image", { href: clothArt ? url(clothArt.file) : wipeArt ? url(wipeArt) : WIPE_SVG, x: A.x - cw / 2, y: A.y - ch / 2, width: cw, height: ch, class: "bo-cloth" }, S.fx);
        if (w.animate) {
          w.animate(
            [
              { transform: "translate(-50px, 8px) rotate(-10deg)", opacity: 0 },
              { transform: "translate(-46px, 7px) rotate(-9deg)", opacity: 1, offset: 0.08 },
              { transform: "translate(46px, -6px) rotate(8deg)", offset: 0.36 },
              { transform: "translate(-40px, 6px) rotate(-8deg)", offset: 0.64 },
              { transform: "translate(40px, -5px) rotate(8deg)", opacity: 1, offset: 0.9 },
              { transform: "translate(34px, -4px) rotate(7deg)", opacity: 0 },
            ],
            { duration: dur, fill: "forwards", easing: "ease-in-out" }
          );
          w.style.transformBox = "fill-box";
          w.style.transformOrigin = "center";
          shine.animate && shine.animate([{ opacity: Math.max(sheen, 0.12) * 0.4 }, { opacity: Math.min(0.5, sheen + 0.22), offset: 0.6 }, { opacity: sheen }], { duration: dur + 200, fill: "none" });
        }
        shine.setAttribute("opacity", sheen);
        ctx.after(dur + 40, () => w.remove());
        S.face("happy", 400);
      } else if (c.kind === "plaster" && /^plaster-/.test(S.sel || "") && Math.hypot(p.x - A.x, p.y - A.y) < 70) {
        // B6: the plaster she was given (the picture of the one picked)
        const kind = S.sel.slice(8);
        st.plaster = kind;
        s("image", { href: url(plasterPic(kind)), x: A.x - 52, y: A.y - plasterH(104) / 2, width: 104, height: plasterH(104) }, markG);
        spot.setAttribute("opacity", 0);
        shine.setAttribute("opacity", 0);
        ctx.after(250, () => close());
      }
    });
    return {
      async start() {
        S.begin(WHY); // input is live at once (13i); the why beat only in the lab
        open();
      },
      destroy() {
        badge(0);
        S.destroy();
      },
      debug: {
        get plan() {
          return P;
        },
        get cues() {
          return S.cueLog.slice();
        },
        state: () => ({ step: cur() && cur().id, drops: st.drops.slice(), placed, busy: st.busy }),
        /** TEST HOOK (CLN-164 to CLN-170; read-only): client px boxes of the machine, the syringe, the spot and the count chips */
        layout() {
          const box = (el) => {
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return { left: r.left, top: r.top, width: r.width, height: r.height };
          };
          const sp = S.client(A.x, A.y);
          return { machine: box(machG), syringe: box(syEl), spot: { x: sp.x, y: sp.y }, counts: [...S.root.ownerDocument.querySelectorAll(".hs-count")].filter((b) => b.getBoundingClientRect().width > 0).map(box), stage: box(S.svg) };
        },
        next() {
          if (!S.ready) return { do: "wait" };
          const c = cur();
          if (st.over || !c || st.busy) return { do: "wait" };
          const tool = (id) => {
            const r = S.toolEls[id].getBoundingClientRect();
            return { do: "tap", x: r.left + r.width / 2, y: r.top + r.height / 2, what: id };
          };
          const at = (x, y, what) => Object.assign({ do: "tap", what }, S.client(x, y));
          if (c.kind === "wipe") {
            if (st.wipes >= c.count) {
              if (P.level === 1) return { do: "wait" };
              const lv = levers[P.steps[1].drops[0]];
              return at(lv.kx, lv.y, "lever (closes the wipe)");
            }
            return S.sel !== "cotton" ? tool("cotton") : at(A.x, A.y, "wipe");
          }
          if (c.kind === "drops") {
            if (st.drops.length > c.drops.length) return at(syCx, bandY(st.drops.length - 1) + bandH / 2, "take a drop back");
            if (st.drops.length === c.drops.length) return P.level === 1 ? { do: "wait" } : { do: "button" };
            const want = c.drops[st.drops.length];
            return at(levers[want].kx, levers[want].y, `lever ${want}`);
          }
          if (c.kind === "press") return placed ? at(syCx + OVER.dx, endY() + OVER.dy, "press the glowing end") : { do: "wait" };
          if (c.kind === "plaster") return S.sel !== `plaster-${c.colour}` ? tool(`plaster-${c.colour}`) : at(A.x, A.y, "plaster");
          return { do: "wait" };
        },
        slip() {
          // one drop too many (then the driver takes it back by tapping that band)
          const c = cur();
          if (!S.ready || st.busy || !c || c.kind !== "drops" || st.drops.length !== c.drops.length || st.slip) return null;
          const lv = levers[c.drops[c.drops.length - 1]];
          return Object.assign({ do: "tap", what: "an extra drop" }, S.client(lv.kx, lv.y));
        },
      },
    };
  }

  function bot(level, rng) {
    const p = plan(level, rng);
    return Object.assign(HS.bot(p.rows, rng), { plan: p });
  }

  const def = {
    id: "boing",
    part: "arm",
    ailments: ["jab"],
    items: ["cotton", "syringe", "plaster"],
    gestures: ["tap"],
    levels: [1, 2, 3],
    plan,
    mount,
    bot,
    why: WHY,
    cues: CUES,
    steps: (level, rng) => plan(level, rng).steps.map((x) => x.kind),
  };
  if (Heal) Heal.register(def);
  if (typeof module === "object" && module.exports) module.exports = def;
})(typeof globalThis !== "undefined" ? globalThis : this);

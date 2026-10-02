/*
 * H-boing, the injection, with the drop machine (D15g, decision 27; the 1 Oct report §8H; CLN-58, CLN-37, CLN-42).
 * The doctor holds the syringe; the child helps and counts. Comic, never gory (H26): a cartoon needle is fine.
 *
 * 1. Wipe the arm the count of times with the cotton (tap the cotton, then the arm; L1 closes at the count, D5).
 * 2. The drop machine: tall dispensers of coloured liquid MEDICINE, a lever each; a tap on a lever lets one drop fall
 *    into the upright syringe below, counted on the syringe (D6). The drops are teardrop-shaped, matte and see-through
 *    (never a glossy ball, never sweets: I2, art plan question 9). A drop is taken back by tapping THAT drop in the
 *    syringe, never by tapping the barrel (CLN-58); the first go is the one scored (E14).
 *    L1 one dispenser, the count written and said; L2 one dispenser, more drops (the count written only);
 *    L3 three or four dispensers and the colours said, in order ("ba [red], ne poi hakro [blue]").
 * 3. The syringe's end glows: pressing it starts the jab (no ✓, D7): the doctor counts down, BOING (a starburst, no
 *    written word), the patient jumps.
 * 4. A plaster on the spot. The apple is only at the send-off (H33), not here.
 * Rows (the words decide): the wipes; the drops (count, and at L3 the colours in order).
 * The art swaps in by file name (boing.json `art`: the art plan's D1 and D2); a missing file keeps the stand-in.
 */
(function (root) {
  "use strict";
  const Heal = (root.Clinic && root.Clinic.Heal) || (typeof require === "function" ? require("../registry.js") : null);
  const HS = (root.Clinic && root.Clinic.HealScene) || (typeof require === "function" ? require("../scene.js") : null);

  const K = { wipes: { 1: [1, 2, 3, 4, 5], 2: [2, 3, 4, 5], 3: [2, 3, 4, 5] }, drops: { 1: [2, 3, 4], 2: [3, 4, 5] }, colours: ["red", "yellow", "blue", "green"], tubes: { 3: 4 }, one: "purple", maxDrops: 5 };
  const WHY = { problem: "Time for my jab.", goal: "I'll do it. You count!" };
  // first-time help: the ghost finger's move for each kind of step (13g: no words, no device voice)
  const CUES = {
    wipe: { gesture: "tap", then: "tap" },
    drops: { gesture: "tap" },
    press: { gesture: "tap" },
    boing: { watch: true }, // the count-down runs by itself: the child watches (and counts along), nothing to demo
    plaster: { gesture: "tap", then: "tap" },
  };
  const MED = { red: "#e0584a", yellow: "#f0c43a", blue: "#4a86d8", green: "#5fae5a", purple: "#8a55c8" };

  function plan(level, rng) {
    const L = Math.max(1, Math.min(3, level));
    const wipes = HS.pick(K.wipes[L], rng);
    let drops;
    let tubes;
    if (L < 3) {
      drops = Array(HS.pick(K.drops[L], rng)).fill(K.one);
      tubes = [K.one];
    } else {
      tubes = HS.shuffle(K.colours, rng).slice(0, K.tubes[3]);
      const [a, b] = HS.shuffle(tubes, rng);
      const na = 1 + Math.floor(rng() * 2);
      const nb = 1 + Math.floor(rng() * 2);
      drops = Array(na).fill(a).concat(Array(nb).fill(b));
    }
    const groups = [];
    drops.forEach((c) => (groups.length && groups[groups.length - 1].c === c ? groups[groups.length - 1].n++ : groups.push({ c, n: 1 })));
    const Lg = HS.L; // words, numbers and joins from data through the seam (R5)
    const say = (m, o) => Lg.show(m, o);
    const groupM = (g) => Lg.item(g.c, { n: g.n });
    const dropW = L < 3 ? say(Lg.join(["cl-drops", ",", Lg.count(drops.length)]), { cap: true }) : say(Lg.join(["cl-drops", ":", ...groups.flatMap((g, i) => (i ? [",", groupM(g)] : [groupM(g)]))]), { cap: true });
    const steps = [
      { id: "wipe", kind: "wipe", count: wipes, row: Object.assign({ id: "wipe" }, say(Lg.join(["cl-wipe", ",", Lg.count(wipes)]), { cap: true })) },
      {
        id: "drops",
        kind: "drops",
        drops,
        row: Object.assign({ id: "drops" }, dropW),
        // L3: the colours in order are a sequence on the card (13h): one part per colour
        rows: L < 3 ? null : groups.map((g, i) => Object.assign({ id: `drops${i}`, seq: "drops" }, say(i ? Lg.then(groupM(g), { lower: true }) : groupM(g)))),
      },
      { id: "press", kind: "press", row: Object.assign({ id: "press" }, say(Lg.item("boing-press"), { cap: true })) },
      { id: "boing", kind: "boing", row: null },
      { id: "plaster", kind: "plaster", row: Object.assign({ id: "plaster" }, say(Lg.item("cl-plaster"), { cap: true })) },
    ];
    const rows = [{ id: "wipe-count", options: K.wipes[L], answer: wipes }];
    if (L < 3) rows.push({ id: "drop-count", options: K.drops[L], answer: drops.length });
    else rows.push({ id: "drop-colours", seq: tubes, answer: drops, placeholder: true });
    const words = [Lg.num(wipes), Lg.w("cl-wipe"), Lg.w("cl-drops"), Lg.w("cl-plaster")];
    groups.forEach((g) => words.push(Lg.num(g.n)));
    if (L >= 3) words.push(Lg.w("lnk-pela"), Lg.w("lnk-nepoi"));
    return { level: L, steps, rows, words, tubes };
  }

  function mount(stage, ctx) {
    const P = plan(ctx.level, ctx.rng);
    const Kit = root.Clinic && root.Clinic.Kit;
    const fast = () => !!(Kit && Kit.fast);
    const S = HS.make(stage, ctx, { place: "limb", game: "boing" });
    const { s } = S;
    const st = { i: 0, wipes: 0, drops: [], judged: {}, over: false, busy: false, slip: false, wrongColour: false, max: 0 };
    const cur = () => P.steps[st.i] || null;
    const ART = (ctx.data && ctx.data.art) || {};
    // the card: one instruction at a time (D8): the first step's row; each next row joins as its step opens
    ctx.card.setRows(P.steps[0].rows || [P.steps[0].row]);

    // the upper arm across the bottom left (U1's close-up swaps in); the jab spot
    const A = { x: 300, y: 395 };
    const skin = S.skin || "#d9a57c";
    const armG = s("g", {}, S.layer);
    s("path", { d: "M-40 330 L410 345 Q474 350 474 400 Q474 452 410 456 L-40 470 Z", fill: skin, stroke: S.skinDark || "#b9845c", "stroke-width": 4 }, armG);
    s("path", { d: "M-40 322 L130 326 Q150 400 130 478 L-40 478 Z", fill: S.clothes || "#e25a5a", stroke: "rgba(0,0,0,.18)", "stroke-width": 3 }, armG); // the rolled sleeve
    const spot = s("circle", { cx: A.x, cy: A.y, r: 16, fill: "none", stroke: "#2e8b7a", "stroke-width": 4, "stroke-dasharray": "5 5" }, armG);
    const shine = s("ellipse", { cx: A.x, cy: A.y, rx: 70, ry: 32, fill: "#fff", opacity: 0 }, armG);
    const markG = s("g", {}, armG);

    // the drop machine (D1's art swaps in): white and pale steel, clear tubes of coloured liquid medicine, each with a
    // drip spout and a lever; the upright syringe stands under the spouts
    const n = P.tubes.length;
    const MC = 540; // the machine's centre line (clear of the tool shelf on the right at every screen shape)
    const M = { x: MC - (50 + n * 56) / 2, y: 10, w: 50 + n * 56, h: 172 };
    const tubeW = 40;
    const tubeX = (k) => M.x + 25 + 28 + k * 56;
    const machG = s("g", {}, S.layer);
    s("rect", { x: M.x, y: M.y, width: M.w, height: M.h, rx: 18, fill: "#f4f6f8", stroke: "#a9b4bf", "stroke-width": 4 }, machG);
    s("rect", { x: M.x + 8, y: M.y + M.h - 34, width: M.w - 16, height: 26, rx: 8, fill: "#dfe5ea" }, machG);
    const levers = {};
    P.tubes.forEach((c, k) => {
      const x = tubeX(k);
      s("rect", { x: x - tubeW / 2, y: M.y + 12, width: tubeW, height: 100, rx: tubeW / 2, fill: "rgba(255,255,255,.7)", stroke: "#a9b4bf", "stroke-width": 3 }, machG);
      s("rect", { x: x - tubeW / 2 + 5, y: M.y + 38, width: tubeW - 10, height: 70, rx: (tubeW - 10) / 2, fill: MED[c], opacity: 0.55 }, machG);
      s("rect", { x: x - tubeW / 2 + 8, y: M.y + 44, width: 5, height: 56, rx: 2.5, fill: "#fff", opacity: 0.5 }, machG);
      s("path", { d: `M${x - 7} ${M.y + 112} L${x + 7} ${M.y + 112} L${x + 3} ${M.y + 126} L${x - 3} ${M.y + 126}Z`, fill: "#a9b4bf" }, machG); // the drip spout
      // the lever: a round knob on an arm, at the side of the tube; down = a drop falls
      const lv = s("g", { class: "bo-lever", "data-colour": c }, machG);
      const arm = s("g", { class: "bo-arm" }, lv);
      s("line", { x1: x + 14, y1: M.y + 128, x2: x + 14, y2: M.y + 146, stroke: "#6f7c88", "stroke-width": 6, "stroke-linecap": "round" }, arm);
      s("circle", { cx: x + 14, cy: M.y + 150, r: 13, fill: MED[c], stroke: "#4f5b66", "stroke-width": 3 }, arm);
      levers[c] = { g: lv, arm, x, kx: x + 14, y: M.y + 150 };
    });
    // the upright syringe under the machine: the barrel open at the top, the needle down; the drops sit inside
    const SY = { x: MC - 33, y: 262, w: 66, h: 168 };
    const syCx = SY.x + SY.w / 2;
    const syG = s("g", {}, S.layer);
    const plunger = s("g", { opacity: 0 }, syG);
    s("rect", { x: syCx - 8, y: SY.y - 40, width: 16, height: 50, fill: "#c4cdd6" }, plunger);
    const thumb = s("rect", { x: syCx - 36, y: SY.y - 56, width: 72, height: 18, rx: 9, fill: "#dfe5ea", stroke: "#8a96a3", "stroke-width": 3 }, plunger);
    const glow = s("ellipse", { cx: syCx, cy: SY.y - 47, rx: 56, ry: 24, fill: "#ffe27a", opacity: 0 }, syG);
    syG.insertBefore(glow, plunger);
    s("rect", { x: SY.x, y: SY.y, width: SY.w, height: SY.h, rx: 12, fill: "rgba(235,246,251,.85)", stroke: "#6a8aa8", "stroke-width": 5 }, syG);
    for (let k = 1; k < 6; k++) s("line", { x1: SY.x + SY.w - 16, y1: SY.y + k * (SY.h / 6), x2: SY.x + SY.w, y2: SY.y + k * (SY.h / 6), stroke: "#6a8aa8", "stroke-width": 3 }, syG);
    s("rect", { x: syCx - 10, y: SY.y + SY.h, width: 20, height: 16, fill: "#6a8aa8" }, syG);
    s("line", { x1: syCx, y1: SY.y + SY.h + 16, x2: syCx, y2: SY.y + SY.h + 58, stroke: "#8a8f98", "stroke-width": 4, "stroke-linecap": "round" }, syG);
    const dropG = s("g", {}, syG);
    const fallG = s("g", {}, S.fx);
    // a drop: a matte, see-through teardrop (never a ball)
    const tear = (g, x, y, r, c, cls) =>
      s("path", { class: cls || null, d: `M${x} ${y - r * 1.5} C${x + r * 0.35} ${y - r * 0.8} ${x + r} ${y - r * 0.2} ${x + r} ${y + r * 0.25} A${r} ${r} 0 1 1 ${x - r} ${y + r * 0.25} C${x - r} ${y - r * 0.2} ${x - r * 0.35} ${y - r * 0.8} ${x} ${y - r * 1.5}Z`, fill: MED[c] || c, opacity: 0.72, stroke: "rgba(0,0,0,.18)", "stroke-width": 1.5 }, g);
    const slotY = (k) => SY.y + SY.h - 24 - k * 30;
    const drawDrops = () => {
      S.clear(dropG);
      st.drops.forEach((c, k) => {
        const d = tear(dropG, syCx, slotY(k), 13, c, "bo-drop");
        d.dataset.k = k;
      });
      // the count sits on the syringe (D6): the Kutchi word at L1-2, dots from L3; never the target
      badge(st.drops.length);
    };
    // the count's badge: a DOM chip over the syringe's top corner (the host's look, .hs-count)
    let badgeEl = null;
    const badge = (k) => {
      if (!k) {
        if (badgeEl) badgeEl.remove();
        badgeEl = null;
        return;
      }
      if (!badgeEl || !badgeEl.isConnected) {
        badgeEl = S.h("span", "hs-count", S.root);
        badgeEl.setAttribute("aria-hidden", "true");
      }
      const at = S.client(SY.x - 30, SY.y + 6);
      const rr = S.root.getBoundingClientRect();
      badgeEl.style.left = `${at.x - rr.left}px`;
      badgeEl.style.top = `${at.y - rr.top}px`;
      badgeEl.classList.toggle("dots", P.level >= 3);
      badgeEl.textContent = P.level >= 3 ? "•".repeat(Math.min(k, 9)) : Kit ? Kit.num(k) : String(k);
      badgeEl.classList.remove("bump");
      void badgeEl.offsetWidth;
      badgeEl.classList.add("bump");
    };
    const countG = s("g", {}, S.fx);
    // the art (the art plan's D1, D2): drawn over the stand-in when the files exist
    const artImg = (key, x, y, w, h, parent, under) => {
      const f = ART[key];
      if (!f || !Kit) return null;
      const im = s("image", { href: Kit.url(f), x, y, width: w, height: h, preserveAspectRatio: "xMidYMid meet", opacity: 0 }, parent);
      if (under) parent.insertBefore(im, parent.firstChild);
      im.addEventListener("load", () => {
        im.setAttribute("opacity", 1);
        if (key === "machine") machG.querySelectorAll(":scope > rect, :scope > path").forEach((n) => n.setAttribute("opacity", 0));
      });
      im.addEventListener("error", () => im.remove());
      return im;
    };
    artImg("machine", M.x, M.y, M.w, M.h, machG, true);

    const judge = (id, ok, detail) => {
      st.judged[id] = ok;
      ctx.log({ type: ok ? "right" : "wrong", rowId: id, detail });
    };
    const TOOL = { wipe: "cotton", plaster: "plaster" };
    const addRows = (c) => {
      (c.rows || [c.row]).filter(Boolean).forEach((r) => ctx.card.addRow(r));
    };
    const open = () => {
      const c = cur();
      if (c.kind !== "boing" && st.i > 0) {
        addRows(c);
        ctx.card.now(c.id);
        ctx.say(c.row);
      } else if (c.kind !== "boing") ctx.card.now(c.id);
      spot.setAttribute("opacity", c.kind === "plaster" || c.kind === "wipe" ? 1 : 0);
      glow.setAttribute("opacity", 0);
      if (c.kind === "boing") {
        S.cue("boing", CUES.boing, { x: syCx, y: SY.y });
        return countdown();
      }
      if (c.kind === "drops") {
        S.pick(null); // the cotton goes down: the count's badge sits on the syringe, not on a tool
        const want = c.drops[0];
        S.cue("drops", CUES.drops, { x: levers[want].kx, y: levers[want].y, r: 22 });
        return;
      }
      if (c.kind === "press") {
        plunger.setAttribute("opacity", 1);
        glow.setAttribute("opacity", 0.75);
        glow.animate && glow.animate([{ opacity: 0.35 }, { opacity: 0.85 }, { opacity: 0.35 }], { duration: 1100, iterations: Infinity });
        S.cue("press", CUES.press, { x: syCx, y: SY.y - 47, r: 40 });
        return;
      }
      S.cue(c.kind, CUES[c.kind], S.toolEls[TOOL[c.kind]], { x: A.x, y: A.y });
    };
    const close = () => {
      const c = cur();
      if (!c) return;
      if (c.kind === "wipe") judge("wipe-count", st.wipes === c.count, `${st.wipes} of ${c.count}`);
      if (c.kind === "drops") {
        // a drop taken back counts only if the child had gone past the count (the first go is scored)
        const over = st.slip && st.max > c.drops.length;
        if (P.level < 3) judge("drop-count", !over && st.drops.length === c.drops.length, `${st.drops.length} of ${c.drops.length}`);
        else judge("drop-colours", !st.wrongColour && JSON.stringify(st.drops) === JSON.stringify(c.drops), st.drops.join(" "));
        badge(0);
      }
      if (c.row) ctx.card.tick(c.id);
      (c.rows || []).forEach((r) => ctx.card.tick(r.id, { quiet: true }));
      S.uncue();
      st.i++;
      if (cur()) open();
      else finish();
    };
    const countdown = async () => {
      st.busy = true;
      glow.getAnimations && glow.getAnimations().forEach((a) => a.cancel());
      glow.setAttribute("opacity", 0);
      // the doctor brings the syringe to the arm
      const move = syG.animate ? syG.animate([{ transform: "translate(0,0) rotate(0)" }, { transform: `translate(${A.x - syCx - 40}px, ${A.y - SY.y - SY.h - 70}px)` }], { duration: fast() ? 60 : 600, fill: "forwards" }) : null;
      if (move) await move.finished.catch(() => {});
      const from = Math.min(5, Math.max(3, st.drops.length));
      for (let k = from; k >= 1; k--) {
        S.clear(countG);
        // the number as it's said: its Kutchi word at L1-2, heard only at L3 (E12)
        if (P.level < 3 && HS.num(k)) {
          const t = s("text", { x: 400, y: 120, "font-size": 72, "text-anchor": "middle", fill: "#2e6b5f", "font-weight": 800, "font-family": "Nunito, sans-serif" }, countG);
          t.textContent = HS.num(k);
        }
        await S.say(HS.L.num(k, { cap: true }), "doctor");
      }
      S.clear(countG);
      // BOING: a comic starburst (no written word), the arm jumps, the needle goes in and out
      const burst = s("g", { transform: `translate(${A.x} ${A.y - 90})` }, countG);
      const pts = [];
      for (let k = 0; k < 16; k++) {
        const r = k % 2 ? 34 : 70;
        const a = (Math.PI * 2 * k) / 16;
        pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`);
      }
      s("polygon", { points: pts.join(" "), fill: "#ffd84a", stroke: "#e8872f", "stroke-width": 5 }, burst);
      burst.animate && burst.animate([{ transform: `translate(${A.x}px, ${A.y - 90}px) scale(.2)` }, { transform: `translate(${A.x}px, ${A.y - 90}px) scale(1.15)` }, { transform: `translate(${A.x}px, ${A.y - 90}px) scale(1)` }], { duration: 350, fill: "forwards" });
      armG.animate && armG.animate([{ transform: "translateY(0)" }, { transform: "translateY(-16px)" }, { transform: "translateY(8px)" }, { transform: "translateY(0)" }], { duration: 500 });
      S.clear(dropG); // the medicine is in
      plunger.setAttribute("opacity", 0);
      S.face("ouch", 700);
      ctx.sfx("pop");
      ctx.after(fast() ? 100 : 900, () => {
        S.clear(countG);
        if (move) move.cancel();
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
    S.tools([{ id: "cotton", img: IMG + "cotton-buds.webp", glyph: "•" }, { id: "plaster", img: IMG + "plaster-skin.webp", glyph: "•" }], () => {
      const c = cur();
      if (st.over || st.busy || !c) return;
    });
    // a lever: one drop falls into the syringe
    const pull = (colour) => {
      const c = cur();
      if (!c || st.over || st.busy) return;
      if (c.kind === "wipe" && st.wipes) close(); // the next action closes the wipe (D7)
      const d = cur();
      if (!d || d.kind !== "drops") return;
      if (st.drops.length >= K.maxDrops) return;
      const lv = levers[colour];
      lv.arm.animate && lv.arm.animate([{ transform: "translateY(0)" }, { transform: "translateY(10px)" }, { transform: "translateY(0)" }], { duration: 260 });
      const k = st.drops.length;
      st.drops.push(colour);
      st.max = Math.max(st.max, st.drops.length);
      if (P.level >= 3 && d.drops[k] !== colour) st.wrongColour = true;
      // the drop falls from the spout into the barrel
      const fall = tear(fallG, lv.x, M.y + 136, 11, colour);
      const dy = slotY(k) - (M.y + 136);
      const dx = syCx - lv.x;
      const anim = fall.animate ? fall.animate([{ transform: "translate(0,0)" }, { transform: `translate(${dx}px, ${dy}px)` }], { duration: fast() ? 40 : 380, easing: "cubic-bezier(.5,0,.9,.6)" }) : null;
      const land = () => {
        fall.remove();
        drawDrops();
      };
      if (anim) anim.finished.then(land, land);
      else land();
      if (!anim) drawDrops();
      ctx.tally("drops", st.drops.length);
      ctx.sfx("pop");
      // D5 (SH-38): at level 1 the row turns gold at the count and the step closes by itself
      if (P.level === 1 && st.drops.length >= d.drops.length) S.when(() => (!cur() || cur().kind !== "drops" || st.over ? "stop" : !st.busy), close, 450);
    };
    const press = () => {
      const c = cur();
      if (!c || st.over || st.busy) return;
      // the glowing end: it closes the drops step (L2+, D7: the next action) and starts the jab
      if (c.kind === "drops" && st.drops.length) close();
      if (cur() && cur().kind === "press") {
        S.uncue(); // the glowing end's help ends with the press
        ctx.card.tick("press");
        thumb.animate && thumb.animate([{ transform: "translateY(0)" }, { transform: "translateY(12px)" }], { duration: 160, fill: "forwards" });
        st.i++;
        open();
      }
    };
    ctx.on(S.svg, "pointerdown", (e) => {
      if (!S.ready || st.over || st.busy) return;
      const p = S.pt(e);
      const c = cur();
      if (!c) return;
      const tol = 10 * S.unit() + 16;
      // the syringe's glowing end (the plunger's top): from when the drops are in
      if ((c.kind === "press" || (c.kind === "drops" && st.drops.length && P.level >= 2)) && Math.abs(p.x - syCx) < 50 && p.y > SY.y - 80 && p.y < SY.y - 18) return press();
      // a lever
      for (const [colour, lv] of Object.entries(levers)) {
        if (Math.hypot(p.x - lv.kx, p.y - lv.y) < Math.max(26, tol + 6) || (Math.abs(p.x - lv.x) < 28 && p.y > M.y + 6 && p.y < M.y + 140)) return pull(colour);
      }
      // a drop in the syringe: THAT drop goes back up into its tube (CLN-58: never the whole barrel by surprise)
      if (c.kind === "drops" && st.drops.length && Math.abs(p.x - syCx) < SY.w / 2 + 6 && p.y > SY.y && p.y < SY.y + SY.h) {
        let k = -1;
        let best = 1e9;
        st.drops.forEach((_, j) => {
          const d = Math.abs(p.y - slotY(j));
          if (d < best) (best = d), (k = j);
        });
        if (k < 0 || best > Math.max(22, tol)) return;
        const colour = st.drops[k];
        st.drops.splice(k, 1);
        st.slip = true;
        drawDrops();
        const up = tear(fallG, syCx, slotY(k), 11, colour);
        const lv = levers[colour] || { x: syCx };
        if (up.animate) up.animate([{ transform: "translate(0,0)", opacity: 0.72 }, { transform: `translate(${lv.x - syCx}px, ${M.y + 120 - slotY(k)}px)`, opacity: 0 }], { duration: fast() ? 40 : 380, fill: "forwards" }).finished.then(() => up.remove(), () => up.remove());
        else up.remove();
        ctx.tally("drops", st.drops.length);
        ctx.sfx("tap");
        ctx.log({ type: "takeback", detail: "a drop" });
        return;
      }
      if (Math.abs(p.y - A.y) > 75 || p.x > 480) return;
      if (c.kind === "wipe" && S.sel === "cotton") {
        st.wipes++;
        S.count(st.wipes);
        ctx.tally("cotton", st.wipes);
        // D5 (SH-38): at level 1 the row turns gold at the count and the step closes by itself
        if (P.level === 1 && st.wipes >= c.count) S.when(() => (cur() !== c || st.over ? "stop" : !st.busy), close, 450);
        shine.setAttribute("opacity", Math.min(0.3, st.wipes * 0.08));
        const w = s("ellipse", { cx: p.x, cy: p.y, rx: 22, ry: 14, fill: "#fff", opacity: 0.55 }, S.fx);
        ctx.after(400, () => w.remove());
        S.face("happy", 400);
      } else if (c.kind === "plaster" && S.sel === "plaster" && Math.hypot(p.x - A.x, p.y - A.y) < 70) {
        s("rect", { x: A.x - 40, y: A.y - 20, width: 80, height: 40, rx: 12, fill: "#f2d2a8", stroke: "#b98a60", "stroke-width": 2 }, markG);
        s("rect", { x: A.x - 12, y: A.y - 10, width: 24, height: 20, rx: 4, fill: "#fff", opacity: 0.6 }, markG);
        spot.setAttribute("opacity", 0);
        shine.setAttribute("opacity", 0);
        ctx.after(250, () => close());
      }
    });
    // the drops step at L1 shows the plunger once the count is in (it closes by itself, then the end glows)
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
            if (st.drops.length > c.drops.length) return at(syCx, slotY(st.drops.length - 1), "take a drop back");
            if (st.drops.length === c.drops.length) return P.level === 1 ? { do: "wait" } : at(syCx, SY.y - 47, "press the glowing end");
            const want = c.drops[st.drops.length];
            return at(levers[want].kx, levers[want].y, `lever ${want}`);
          }
          if (c.kind === "press") return at(syCx, SY.y - 47, "press the glowing end");
          if (c.kind === "plaster") return S.sel !== "plaster" ? tool("plaster") : at(A.x, A.y, "plaster");
          return { do: "wait" };
        },
        slip() {
          // one drop too many (then the driver takes it back by tapping that drop)
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

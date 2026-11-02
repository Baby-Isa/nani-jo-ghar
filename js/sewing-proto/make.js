/*
 * Make (prototype, proto-sewing 2 Nov 2026; build/reports/designs/sewing.md §3b, its critique, games-at-a-glance §7).
 *
 * Big Ma's table, straight down: the cloth from the stall spread in the middle, the paper pattern pieces at the left edge
 * (unlabelled, each its own shape), the sewing machine at the top, the rail at the right. THE SENTENCE LAYOUT: Ali (who has
 * outgrown his clothes) asks in the box, one instruction at a time ("[Kurta] banai!": make me a kurta; the engine's make, the
 * garment to record), and under him the word tiles: Clothes (a tile for every pattern on the table) and from L2 Sizes (the long
 * and short pair, neutral strips).
 *   1. Tap the pattern he names: it slides onto the cloth and Big Ma's chalk traces round it.
 *   2. From L2, a kurta has two chalk hems, long and short, the same colour and weight: "[Long] [kurta] kap!" (cut the long one).
 *      Tap one: the right one lights as the scissors' track; a wrong one wobbles and he says it again. Nothing is cut.
 *   3. Drag the scissors along the lit chalk (the track: it only moves forward and never decides anything). Snip: the offcut drops.
 *   4. Drag the piece along the seam under the machine (the same track): the machine chatters, the piece joins.
 *   5. The garment folds itself and flies to the rail. The row ticks.
 * Wrong taps wobble and stay; nothing is removed, so the last pattern is never forced. Every garment is modest: the kurta is
 * long-sleeved, its hem to the knee (long) or the hip (short); "short" is never a short sleeve.
 *   L1  two makes, a kurta or a cap, from two patterns; one chalk line
 *   L2  two makes from three patterns (the dupatta joins); a kurta's long or short hem
 *   L3  three makes from four patterns (the shawl joins)
 *   L4  as L2, and after each kurta its buttons: "Muke trae laal [buttons] khape" (three red buttons) from a tin of red and pink;
 *      the placket has five spots, so the picture never gives the count; it ticks at the number and an extra one doesn't land
 * Not built: "no said last" ("long, not short"), "for Ali", two sleeves, Simba batting the offcut, Big Ma's song at the machine.
 */
import { svg, COLOUR_LEX } from "./cloth.js";
import { BIGMA } from "./art.js";

const W = typeof window !== "undefined" ? window : globalThis;
const LEX = { kurta: "n.kurta", cap: "n.cap", dupatta: "n.dupatta", shawl: "n.shawl" };
const LEN = { long: "a.long", short: "a.short" };
// the chalk hem's height in the outline's box (the kurta's hem in js/sewing-proto/cloth.js: long 96, short 74; the cut just below)
const HEM = { long: 0.9, short: 0.7 };

export default async function make(F) {
  const lv = F.level;
  const kinds = [["kurta", "cap"], ["kurta", "cap", "dupatta"], ["kurta", "cap", "dupatta", "shawl"], ["kurta", "cap", "dupatta"]][lv - 1];
  const n = lv === 3 ? 3 : 2;
  const colour = F.pick(["red", "green", "blue"]);
  // the makes: random garments, at least one kurta from L2 (the length is the level's new word)
  let makes = Array.from({ length: n }, () => F.pick(kinds));
  if (lv >= 2 && !makes.includes("kurta")) makes[Math.floor(F.rng() * n)] = "kurta";
  makes = makes.map((k) => ({ k, len: k === "kurta" && lv >= 2 ? F.pick(["long", "short"]) : null, btn: k === "kurta" && lv === 4 ? { n: 2 + Math.floor(F.rng() * 2), c: F.pick(["red", "pink"]) } : null }));

  /* ----- the scene: the table, the cloth, the patterns, the machine, the rail, Big Ma's face watching ----- */
  F.scene.insertAdjacentHTML("beforeend", '<div class="sw-table"></div>');
  const clothEl = F.put(`sw-cloth wide sw-c-${colour}`, { x: 0.47, y: 0.97, h: 0.66, w: 0.5 });
  const machine = F.put("sw-machine wide", { x: 0.55, y: 0.27, h: 0.2, w: 0.3, html: '<span class="sw-machine-arm"></span><span class="sw-machine-wheel"></span><span class="sw-machine-plate"></span>' });
  F.put("sw-rail wide", { x: 0.9, y: 0.98, h: 0.9, w: 0.14 });
  F.put("sw-watch", { x: 0.12, y: 0.24, h: 0.2, img: BIGMA.face });
  const order = F.shuffle(kinds);
  const patterns = order.map((k, i) => {
    const y = 0.42 + (0.56 * (i + 1)) / order.length;
    const el = F.put(`sw-pattern`, { x: 0.1, y: Math.min(0.98, y), h: Math.min(0.2, 0.62 / order.length), tag: "button", html: svg(k, { colour: "paper", length: "long", buttons: 0 }) });
    el.dataset.k = k;
    el.setAttribute("aria-label", "pattern");
    return el;
  });
  let railN = 0;

  /* ----- his instructions ----- */
  const garment = (m) => ({ fn: "Item", kind: LEX[m.k], ...(m.len ? { mods: [LEN[m.len]] } : {}) });
  const steps = [];
  makes.forEach((m, i) => {
    steps.push({ kind: "pattern", i, m, line: { fn: "Command", verb: "v.make", obj: garment(m) }, word: { fn: "Item", kind: LEX[m.k] }, tiles: m.len ? [m.k, m.len] : [m.k] });
    if (m.len) steps.push({ kind: "hem", i, m, line: { fn: "Command", verb: "v.cut", obj: garment(m) }, word: { fn: "Item", kind: "n.kurta", mods: [LEN[m.len]] }, tiles: [m.len] });
    if (m.btn) steps.push({ kind: "btn", i, m, need: m.btn.n, line: { fn: "Need", who: "p1", thing: { fn: "Item", kind: "n.buttons", n: m.btn.n, mods: [COLOUR_LEX[m.btn.c]] } }, word: { fn: "Item", kind: "n.buttons", n: m.btn.n, mods: [COLOUR_LEX[m.btn.c]] }, tiles: [`btn-${m.btn.c}`] });
  });
  let hemEls = [];
  let tinBtns = [];
  const rows = steps.map((s, k) =>
    F.row({
      key: `${s.kind}${k}`,
      line: s.line,
      word: s.word,
      need: s.need || 1,
      tiles: s.tiles,
      target: () => (s.kind === "pattern" ? patterns.find((e) => e.dataset.k === s.m.k) : s.kind === "hem" ? hemEls.find((e) => e.dataset.len === s.m.len) : tinBtns.find((e) => e.dataset.c === s.m.btn.c && !e.classList.contains("used"))),
      data: s,
    })
  );
  const pic = (k, o = {}) => (box) => box.insertAdjacentHTML("beforeend", svg(k, Object.assign({ colour: "plain", cls: "sw-tilepic", buttons: 0 }, o)));
  const groups = [{ label: { fn: "Item", kind: "n.clothes" }, tiles: kinds.map((k) => ({ key: k, word: { fn: "Item", kind: LEX[k] }, lex: LEX[k], picture: pic(k) })) }];
  if (lv >= 2) groups.push({ label: { fn: "Item", kind: "n.sizes" }, tiles: [{ pair: ["long", "short"].map((l) => ({ key: l, word: { fn: "Item", kind: "n.kurta", mods: [LEN[l]] }, lex: LEN[l], picture: pic(l) })) }] });
  if (lv === 4) groups.push({ label: { fn: "Item", kind: "n.buttons" }, tiles: ["red", "pink"].map((c) => ({ key: `btn-${c}`, word: { fn: "Item", kind: "n.buttons", mods: [COLOUR_LEX[c]] }, lex: COLOUR_LEX[c], picture: (box) => box.insertAdjacentHTML("beforeend", svg("button", { colour: c, cls: "sw-tilepic" })) })) });
  F.sentence(groups);

  /* ----- one make, after the right pattern: chalk, (hem), cut, seam, the rail ----- */
  let busy = false;
  let outline = null;
  let hemWait = null;
  async function work(r) {
    const m = r.data.m;
    busy = true;
    F.pause(true);
    // the pattern slides onto the cloth; the chalk traces round it
    const pat = patterns.find((e) => e.dataset.k === m.k);
    outline = F.put(`sw-outline sw-c-${colour}`, { x: 0.47, y: 0.94, h: 0.6, html: svg(m.k, { colour, length: "long", buttons: 0, cls: "sw-chalked" }) });
    await F.fly(null, pat, outline, { cls: "sw-flypattern", size: pat.getBoundingClientRect().height, ms: 480 });
    outline.classList.add("traced");
    await F.sleep(F.T(650));
    if (F.dead) return;
    let cutY = m.k === "cap" ? 0.74 : m.k === "dupatta" ? 0.7 : m.k === "shawl" ? 0.82 : HEM.long;
    if (m.len) {
      // two chalk hems, the same colour and weight; the next row asks which
      F.add(r);
      hemEls = ["long", "short"].map((l) => {
        const h = F.doc.createElement("button");
        h.type = "button";
        h.className = "sw-hem";
        h.dataset.len = l;
        h.style.top = `${HEM[l] * 100}%`;
        h.setAttribute("aria-label", "chalk line");
        outline.appendChild(h);
        F.on(h, "click", () => pickHem(h));
        return h;
      });
      F.pause(false);
      const chosen = await new Promise((res) => (hemWait = res));
      F.pause(true);
      cutY = HEM[chosen];
    }
    // the scissors along the lit chalk
    await F.track({ parent: outline, x1: 0.18, y1: cutY, x2: 0.82, y2: cutY, tool: "scissors", toolHtml: svg("scissors", { colour: "plain" }), name: "sew-cut" });
    if (F.dead) return;
    hemEls.forEach((h) => h.remove());
    hemEls = [];
    outline.classList.add("cut", `cut-${m.len || "long"}`);
    const off = F.doc.createElement("span");
    off.className = `sw-offcut sw-c-${colour}`;
    off.style.top = `${cutY * 100}%`;
    outline.appendChild(off);
    F.after(F.T(900), () => off.remove());
    if (W.Sfx) W.Sfx.play("pop", { volume: 0.3 });
    await F.sleep(F.T(500));
    // the piece under the machine; drag it along the seam
    outline.classList.add("to-machine");
    await F.sleep(F.T(450));
    await F.track({ x1: 0.4, y1: 0.33, x2: 0.72, y2: 0.33, tool: "cloth", toolHtml: svg(m.k, { colour, length: m.len || "long", buttons: 0 }), name: "sew-seam", onMove: () => F.jiggle(machine, "sw-run") });
    if (F.dead) return;
    // the garment folds itself and flies to the rail
    const done = F.put(`sw-made`, { x: 0.9, y: 0.12 + 0.22 * (railN + 1), h: 0.18, html: svg(m.k, { colour, length: m.len || "long", buttons: m.btn ? 0 : 3 }), z: 6 });
    railN = (railN + 1) % 4;
    outline.remove();
    outline = null;
    done.classList.add("sw-arrive");
    if (m.btn) {
      // the buttons: the kurta comes back big onto the table with five empty spots
      await buttons(r, m, done);
    }
    F.pause(false);
    busy = false;
    if (!m.len) F.add(r);
    else F.add(rows.find((x) => x.data.kind === "hem" && x.data.i === r.data.i));
  }
  function pickHem(h) {
    F.acted();
    const r = F.current();
    if (!r || r.data.kind !== "hem") return;
    if (h.dataset.len !== r.data.m.len) {
      F.oops(r, h);
      return;
    }
    hemEls.forEach((x) => x !== h && x.classList.add("off"));
    h.classList.add("lit");
    if (hemWait) hemWait(h.dataset.len);
    hemWait = null;
  }

  /* ----- L4: the buttons ----- */
  async function buttons(r0, m, railEl) {
    const big = F.put(`sw-outline sw-placket sw-c-${colour}`, { x: 0.47, y: 0.94, h: 0.6, html: svg("kurta", { colour, length: m.len, buttons: 0 }) });
    const spots = [0.14, 0.2, 0.26, 0.32, 0.38].map((y) => {
      const s = F.doc.createElement("span");
      s.className = "sw-spot";
      s.style.top = `${y * 100}%`;
      big.appendChild(s);
      return s;
    });
    const tin = F.put("sw-tin wide", { x: 0.75, y: 0.95, h: 0.3, w: 0.18 });
    tinBtns = [];
    const cols = F.shuffle(["red", "red", "red", "red", "pink", "pink", "pink", "pink"]);
    cols.forEach((c, i) => {
      const b = F.doc.createElement("button");
      b.type = "button";
      b.className = `sw-tinbtn ${i % 2 ? "small" : "big"}`;
      b.dataset.c = c;
      b.style.left = `${12 + (i % 4) * 22}%`;
      b.style.top = `${18 + Math.floor(i / 4) * 42}%`;
      b.innerHTML = svg("button", { colour: c });
      b.setAttribute("aria-label", `${c} button`);
      tin.appendChild(b);
      tinBtns.push(b);
    });
    // the button row is next: tick the hem (or pattern) row first
    const hemRow = rows.find((x) => x.data.kind === "hem" && x.data.i === r0.data.i);
    F.pause(false);
    busy = false;
    F.add(hemRow || r0);
    const br = rows.find((x) => x.data.kind === "btn" && x.data.i === r0.data.i);
    let k = 0;
    await new Promise((res) => {
      tinBtns.forEach((b) =>
        F.on(b, "click", async () => {
          F.acted();
          const r = F.current();
          if (r !== br || b.classList.contains("used")) return;
          if (b.dataset.c !== m.btn.c) {
            F.oops(r, b);
            return;
          }
          if (F.full(r)) {
            F.jiggle(b, "sw-shake");
            return;
          }
          b.classList.add("used");
          const spot = spots[k++];
          await F.fly(null, b, spot, { cls: `sw-flybtn sw-c-${b.dataset.c}`, size: b.getBoundingClientRect().height, ms: 380 });
          spot.classList.add("on", `sw-c-${b.dataset.c}`);
          if (F.add(r)) res();
        })
      );
    });
    await F.sleep(F.T(600));
    big.remove();
    tin.remove();
    tinBtns = [];
    railEl.innerHTML = svg("kurta", { colour, length: m.len, buttons: 3 });
  }

  patterns.forEach((el) =>
    F.on(el, "click", () => {
      F.acted();
      const r = F.current();
      if (!r || busy) return;
      if (r.data.kind !== "pattern" || el.dataset.k !== r.data.m.k) {
        F.oops(r, el); // a wobble; it stays; he says it again
        return;
      }
      work(r).catch((e) => !F.dead && console.error("sewing-proto make", e));
    })
  );

  await F.ask({ guide: "make-head" });
  F.begin();
  F.teach("sew-pattern", () => rows[0].target && rows[0].target());
  await new Promise((res) => F.whenAll(res));
  await F.finish(async () => {
    F.jiggle(machine);
    await F.sleep(F.T(500));
  });
}

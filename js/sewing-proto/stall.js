/*
 * The cloth stall (prototype, proto-sewing 2 Nov 2026; build/reports/designs/sewing.md §3a, its critique, games-at-a-glance §7).
 *
 * The shops' cloth stall at eye level: bolts stand on the counter, the seller behind it, Big Ma at the right with her cloth bag.
 * THE SENTENCE LAYOUT (proto brief, 2 Nov): Big Ma says one instruction at a time, big in her box ("Muke laal [cloth] khape": the
 * engine's want frame, cloth to record), and under her the word tiles: Colours (a tile for every bolt on the counter, asked for or
 * not) and from L2 Sizes (the big and small pair tile, neutral cloth). Tap the bolt: it flops open across the counter with a thump
 * and a puff of lint. From L2 the seller holds up two pieces, a big one and a small one, in that cloth: Big Ma says which
 * ("Wadho ginech": buy the big one, a family line). The piece folds into her bag and she pays (a clink; pay is the shops' to
 * teach). A wrong bolt or piece wobbles and stays; she says her instruction again (it will tick plain). Bolts are never removed:
 * a bought bolt stands back up, so the second buy is never forced.
 *   L1  two buys, the colour only; two bolts, red and green (both recorded)
 *   L2  two buys, the colour, then the big or the small piece; three bolts (white joins, to record)
 *   L3  as L2, her line says both at once ("Muke laal wadho [cloth] khape"); four bolts (blue joins)
 *   L4  two buys in order from one line ("Pela laal [cloth], ne poi lilo [cloth]"), then the sizes; five bolts, pink beside red
 * Not built: "not the red one" (no said last), "for Ali", the speaking moment (the seller's "what would you like?"), paying with
 * coins, Simba riding the roll.
 */
import { svg, COLOUR_LEX } from "./cloth.js";
import { BIGMA, SELLER } from "./art.js";

const W = typeof window !== "undefined" ? window : globalThis;

const cloth = (c, size) => ({ fn: "Item", kind: "n.cloth", mods: [COLOUR_LEX[c], ...(size ? [size === "big" ? "a.big" : "a.small"] : [])] });

export default async function stall(F) {
  const lv = F.level;
  const onCounter = [["red", "green"], ["red", "green", "white"], ["red", "green", "white", "blue"], ["red", "pink", "green", "white", "blue"]][lv - 1];
  const bolts = lv === 4 ? onCounter.slice() : F.shuffle(onCounter); // (L4: pink always beside red, the look-alike)
  if (lv === 4 && F.rng() < 0.5) bolts.reverse();
  // (two buys, picked apart: the same colour may come twice, as nothing leaves the counter; at L4 the two differ, "first, then")
  const first = F.pick(onCounter);
  const buys = [first, lv === 4 ? F.pick(onCounter.filter((c) => c !== first)) : F.pick(onCounter)].map((c) => ({ c, size: lv >= 2 ? F.pick(["big", "small"]) : null }));

  /* ----- the scene: the stall, the seller, the counter, the bolts, Big Ma and her bag ----- */
  F.scene.insertAdjacentHTML("beforeend", '<div class="sw-stall-wall"></div><div class="sw-awning"></div><div class="sw-shelf-back"></div>');
  F.put("sw-seller", { x: 0.42, y: 0.66, h: 0.56, img: SELLER.body });
  F.put("sw-counter wide", { x: 0.42, y: 1.0, h: 0.38, w: 0.84 });
  F.put("sw-counter-top wide", { x: 0.42, y: 0.66, h: 0.05, w: 0.86 });
  F.put("sw-bigma", { x: 0.91, y: 1.0, h: 0.52, img: BIGMA.body, z: 5 });
  const bag = F.put("sw-clothbag", { x: 0.79, y: 0.99, h: 0.2, z: 6, html: '<span class="sw-clothbag-strap"></span>' });
  const span = 0.66;
  const boltEls = bolts.map((c, i) => {
    const x = 0.09 + (bolts.length === 1 ? span / 2 : (span * i) / (bolts.length - 1));
    const el = F.put(`sw-bolt`, { x, y: 0.67, h: 0.4, tag: "button", html: svg("bolt", { colour: c }), z: 3 });
    el.dataset.c = c;
    el.setAttribute("aria-label", `${c} cloth`);
    return el;
  });

  /* ----- her instructions: one row each ----- */
  const steps = [];
  buys.forEach((b, i) => {
    const colourLine = lv === 4 ? { fn: "FirstThen", a: cloth(buys[0].c), b: cloth(buys[1].c) } : lv === 3 ? { fn: "Need", who: "p1", thing: cloth(b.c, b.size) } : { fn: "Need", who: "p1", thing: cloth(b.c) };
    steps.push({ kind: "bolt", i, b, line: colourLine, word: cloth(b.c), tiles: lv === 4 ? [buys[0].c, buys[1].c] : lv === 3 ? [b.c, b.size] : [b.c] });
    if (b.size) steps.push({ kind: "piece", i, b, line: { fn: "Say", x: b.size === "big" ? "phrase.buy-the-big-one" : "phrase.buy-the-small-one" }, word: { fn: "Item", kind: "n.cloth", mods: [b.size === "big" ? "a.big" : "a.small"] }, tiles: [b.size] });
  });
  let pieces = [];
  const rows = steps.map((s, k) =>
    F.row({
      key: `${s.kind}${k}`,
      line: s.line,
      word: s.word,
      tiles: s.tiles,
      target: () => (s.kind === "bolt" ? boltEls.find((e) => e.dataset.c === s.b.c) : pieces.find((p) => p.dataset.size === s.b.size)),
      data: s,
    })
  );
  // (a tile's word is the cloth with its colour or size, the one it teaches underlined: a bare lilo or wadho has no form of its own)
  const tile = (c) => ({ key: c, word: cloth(c), lex: COLOUR_LEX[c], picture: (box) => box.insertAdjacentHTML("beforeend", svg("bolt", { colour: c, cls: "sw-tilepic" })) });
  const groups = [{ label: { fn: "Item", kind: "n.colours" }, tiles: onCounter.map(tile) }];
  if (lv >= 2)
    groups.push({
      label: { fn: "Item", kind: "n.sizes" },
      tiles: [{ pair: ["big", "small"].map((s) => ({ key: s, word: { fn: "Item", kind: "n.cloth", mods: [s === "big" ? "a.big" : "a.small"] }, lex: s === "big" ? "a.big" : "a.small", picture: (box) => box.insertAdjacentHTML("beforeend", svg(s, { colour: "plain", cls: "sw-tilepic" })) })) }],
    });
  F.sentence(groups);

  /* ----- the unroll, the pieces, the bag ----- */
  let unrolled = null;
  async function unroll(el, c) {
    const x = Number(el.style.getPropertyValue("--x"));
    el.classList.add("sw-lifted");
    F.jiggle(el);
    unrolled = F.put(`sw-unroll wide sw-c-${c}`, { x: Math.min(0.5, x + 0.28), y: 0.78, h: 0.11, w: 0.56, z: 4 });
    F.after(F.T(30), () => unrolled && unrolled.classList.add("open"));
    await F.sleep(F.T(520));
    if (F.dead) return;
    // the thump and the puff of lint
    F.jiggle(F.scene.querySelector(".sw-counter-top"), "sw-thump");
    const puff = F.put("sw-puff", { x: Math.min(0.75, x + 0.55), y: 0.76, h: 0.08, z: 7 });
    F.after(F.T(700), () => puff.remove());
    el.classList.remove("sw-lifted");
  }
  function showPieces(c) {
    pieces.forEach((p) => p.remove());
    const sides = F.shuffle([0.26, 0.56]);
    pieces = ["big", "small"].map((s, i) =>
      F.put(`sw-piece sw-${s}`, { x: sides[i], y: 0.96, h: s === "big" ? 0.24 : 0.12, tag: "button", html: svg("piece", { colour: c }), z: 8 })
    );
    pieces.forEach((p, i) => {
      p.dataset.size = i === 0 ? "big" : "small";
      p.setAttribute("aria-label", `${p.dataset.size} piece`);
      F.on(p, "click", () => pickPiece(p));
    });
  }
  async function toBag(el) {
    await F.fly(null, el, bag, { cls: `sw-flypiece sw-c-${el.dataset.c || "plain"}`, size: el.getBoundingClientRect().height, ms: 520 });
    F.jiggle(bag);
    if (W.Sfx) W.Sfx.play("coin", { volume: 0.3 });
  }
  let busy = false;

  boltEls.forEach((el) =>
    F.on(el, "click", async () => {
      F.acted();
      const r = F.current();
      if (!r || busy) return;
      if (r.data.kind !== "bolt" || el.dataset.c !== r.data.b.c) {
        F.oops(r, el);
        return;
      }
      busy = true;
      await unroll(el, el.dataset.c);
      if (unrolled) {
        unrolled.dataset.c = el.dataset.c;
      }
      const s = r.data;
      if (s.b.size) showPieces(s.b.c);
      F.add(r);
      if (!s.b.size && unrolled) {
        const u = unrolled;
        unrolled = null;
        u.dataset.c = s.b.c;
        await toBag(u);
        u.remove();
      }
      busy = false;
    })
  );
  async function pickPiece(p) {
    F.acted();
    const r = F.current();
    if (!r || busy) return;
    if (r.data.kind !== "piece" || p.dataset.size !== r.data.b.size) {
      F.oops(r, p);
      return;
    }
    busy = true;
    p.dataset.c = r.data.b.c;
    F.add(r);
    await toBag(p);
    pieces.forEach((x) => x.remove());
    pieces = [];
    if (unrolled) unrolled.remove();
    unrolled = null;
    busy = false;
  }

  await F.ask({ guide: "stall-head" });
  F.begin();
  F.teach("stall-bolt", () => rows[0].target && rows[0].target());
  await new Promise((res) => F.whenAll(res));
  await F.finish(async () => {
    F.jiggle(bag);
    await F.speak(F.lineOf("stall-pay")); // (Big Ma pays herself until the shops have taught pay)
  });
}

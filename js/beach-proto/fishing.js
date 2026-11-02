/*
 * Litter fishing (prototype, proto-beach 2 Nov 2026; build/reports/designs/beach-boat.md §3.6: Zafar's idea 66, the boat day).
 *
 * A side-on cutaway: the boat's rail at the left above the waterline (the rod, the reel, the basket on the deck), clear water
 * below down to the sandy bottom, and rubbish on the bottom: a bottle, a shoe, a tin can, a bag, a sock, a ball, a kettle, and
 * Nani's sun hat, half sunk. Everything lies still alike, asked or not; fish swim past (never caught). THE SENTENCE
 * LAYOUT: Masi says one at a time ("Shoe kadh!": take out the shoe; the nouns are to record), the word tiles under her: Things
 * (every kind in the water), from L2 the small-and-big pair and red and white.
 *   Tap the thing: the hook drops straight onto it (no aiming) with a tink. Tap the reel three times: it rises a third each click,
 *   breaks the surface and swings into the basket; the instruction ticks. A wrong thing: the hook boinks off, the thing wobbles,
 *   the hook comes back empty and she says it again (it will tick plain). Nothing wrong is ever caught.
 *   After each catch a new thing sinks in to a free spot (the field never shrinks). The shoe spits out the crab.
 *   The last ask is always Nani's hat. Then the boatman nets the rest and the fish come back.
 *   L1  one of each kind in the water; three asks, then the hat
 *   L2  two of each kind (big and small; the bottles red and white): the thing and its size or colour
 *   L3, L4  as L2 (counts as clumps, "not the red one", the girl's small hat beside Nani's: not built)
 */
import { PICS } from "./art.js";
import { lineHtml, allRec } from "./kit.js";

const LEX = { bottle: "n.bottle", shoe: "n.shoe", can: "n.tin-can", bag: "n.bag", sock: "n.sock", ball: "n.ball", kettle: "n.kettle", hat: "n.sun-hat" };
const I = (kind, extra) => Object.assign({ fn: "Item", kind }, extra || {});

export default async function fishing(F) {
  const lv = F.level;
  const KINDS = lv === 1 ? ["bottle", "shoe", "can", "bag", "sock", "ball", "kettle"] : ["bottle", "shoe", "ball", "kettle"];
  const variants = (k) => (lv === 1 ? [{}] : k === "bottle" ? [{ colour: "red" }, { colour: "white" }] : [{ size: "big" }, { size: "small" }]);
  const pool = [];
  for (const k of KINDS) for (const v of variants(k)) pool.push(Object.assign({ kind: k }, v));
  const N = 3;
  const thingNP = (t) => (t.kind === "hat" ? { fn: "Of", owner: I("pn.nani"), thing: I(LEX.hat) } : I(LEX[t.kind], t.size || t.colour ? { mods: [`a.${t.size || t.colour}`] } : {}));

  /* ----- the scene ----- */
  F.scene.insertAdjacentHTML("beforeend", '<div class="bp-sky bp-sky-fish"></div><div class="bp-water"></div><div class="bp-bottom"></div><div class="bp-hull"></div><span class="bp-fish f1"></span><span class="bp-fish f2"></span>');
  const basket = F.put("bp-basket", { x: 0.1, y: 0.33, h: 0.1, html: `<img src="${PICS.basketBack}" alt="">` });
  const reel = F.put("bp-reel", { x: 0.2, y: 0.42, h: 0.09, tag: "button" });
  reel.setAttribute("aria-label", "reel");
  F.put("bp-rod", { x: 0.24, y: 0.36, h: 0.22 });
  const line = F.put("bp-fishline", { x: 0.5, y: 0.3, h: 0 });
  line.style.opacity = "0";

  // slots on the bottom, two rows; every thing bobs alike
  const slots = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) slots.push({ x: 0.34 + c * 0.125 + (r ? 0.06 : 0), y: 0.74 + r * 0.17, free: true });
  const els = [];
  function drop(t, slot, sink) {
    slot.free = false;
    const el = F.put(`bp-litter k-${t.kind}${t.colour ? " " + t.colour : ""}${t.size === "small" ? " small" : ""}`, { x: slot.x, y: sink ? 0.42 : slot.y, h: t.kind === "hat" ? 0.09 : t.size === "small" ? 0.08 : 0.12, tag: "button" });
    el.dataset.kind = t.kind;
    el.dataset.size = t.size || "";
    el.dataset.colour = t.colour || "";
    el.setAttribute("aria-label", `${t.size || t.colour || ""} ${t.kind}`.trim());
    el._slot = slot;
    if (sink) F.after(F.T(60), () => el.style.setProperty("--y", String(slot.y)));
    F.on(el, "click", () => hook(el));
    els.push(el);
    return el;
  }
  const free = () => F.shuffle(slots.filter((s) => s.free));
  const start = F.shuffle(pool).slice(0, Math.min(pool.length, lv === 1 ? 7 : 8));
  const fs = free();
  start.forEach((t, i) => drop(t, fs[i]));
  drop({ kind: "hat" }, free()[0]);

  /* ----- the asks: three from what's in the water, then the hat ----- */
  const asks = [];
  const live = () => els.filter((e) => !e.classList.contains("caught"));
  const matches = (el, t) => el.dataset.kind === t.kind && (!t.size || el.dataset.size === t.size) && (!t.colour || el.dataset.colour === t.colour);
  const rows = [];
  for (let i = 0; i < N; i++) {
    rows.push(
      F.row({
        key: `fish${i}`,
        line: { fn: "Command", verb: "v.take-out", obj: { fn: "Item", kind: "n.shoe" } }, // replaced when it comes up (see ask())
        word: I(LEX.shoe),
        tiles: [],
        target: () => live().find((e) => matches(e, asks[i])),
        data: { i },
      })
    );
  }
  const hatRow = F.row({ key: "hat", line: { fn: "Command", verb: "v.take-out", obj: thingNP({ kind: "hat" }) }, word: I(LEX.hat), tiles: ["hat"], target: () => live().find((e) => e.dataset.kind === "hat"), data: { hat: true } });
  asks[N] = { kind: "hat" };
  // each ask is drawn from what is in the water when it comes up (never the hat before the end)
  function plan(r) {
    const i = r.data.i;
    if (i == null || asks[i]) return;
    const cands = live().filter((e) => e.dataset.kind !== "hat");
    const el = F.pick(cands);
    const t = { kind: el.dataset.kind, size: el.dataset.size || null, colour: el.dataset.colour || null };
    asks[i] = t;
    const lr = F.say({ fn: "Command", verb: "v.take-out", obj: thingNP(t) });
    const wr = F.say(I(LEX[t.kind]));
    r.line = lr;
    r.wordRes = wr;
    Object.assign(r.word, { kutchi: allRec(wr) ? null : { html: lineHtml(wr) }, english: (wr && wr.en) || "", rec: allRec(wr), say: () => F.speak(wr) });
    r.tiles = [t.kind, t.size, t.colour].filter(Boolean);
  }
  plan(rows[0]);

  /* ----- the tiles ----- */
  const shape = (cls) => (box) => box.insertAdjacentHTML("beforeend", `<span class="bp-tilepic bp-litter ${cls}"></span>`);
  const groups = [{ label: { en: "things" }, tiles: KINDS.concat(["hat"]).map((k) => ({ key: k, word: I(LEX[k]), lex: LEX[k], picture: shape(`k-${k}`) })) }];
  if (lv >= 2)
    groups.push({
      label: { en: "sizes" },
      tiles: [
        { pair: [
          { key: "small", word: { fn: "Amt", x: "a.small" }, lex: "a.small", picture: (box) => box.insertAdjacentHTML("beforeend", '<span class="bp-tilepic bp-plain small"></span>') },
          { key: "big", word: { fn: "Amt", x: "a.big" }, lex: "a.big", picture: (box) => box.insertAdjacentHTML("beforeend", '<span class="bp-tilepic bp-plain"></span>') },
        ] },
        { key: "red", word: { fn: "Amt", x: "a.red" }, lex: "a.red", picture: shape("k-bottle red") },
        { key: "white", word: { fn: "Amt", x: "a.white" }, lex: "a.white", picture: shape("k-bottle white") },
      ],
    });
  F.sentence(groups);

  /* ----- the hook and the reel ----- */
  let busy = false;
  let hooked = null;
  let clicks = 0;
  const pos = (el) => ({ x: Number(el.style.getPropertyValue("--x")), y: Number(el.style.getPropertyValue("--y")), h: Number(el.style.getPropertyValue("--h")) });
  function lineTo(x, y) {
    line.style.setProperty("--x", String(x));
    line.style.setProperty("--y", String(Math.max(0.3, y)));
    line.style.setProperty("--h", String(Math.max(0, y - 0.3)));
    line.style.opacity = y > 0.31 ? "1" : "0";
  }
  async function hook(el) {
    F.acted();
    const r = F.current();
    if (!r || busy || hooked || el.classList.contains("caught")) return;
    busy = true;
    const p = pos(el);
    lineTo(p.x, p.y - p.h);
    await F.sleep(F.T(450));
    const t = r.data.hat ? { kind: "hat" } : asks[r.data.i];
    if (!matches(el, t)) {
      // the boink: the thing wobbles, the hook comes back empty
      F.oops(r, el);
      await F.sleep(F.T(400));
      lineTo(p.x, 0.3);
      busy = false;
      return;
    }
    if (W().Sfx) W().Sfx.play("right", { volume: 0.2 });
    hooked = el;
    clicks = 0;
    busy = false;
    F.jiggle(reel);
  }
  F.on(reel, "click", async () => {
    F.acted();
    const r = F.current();
    if (!r || busy || !hooked) return F.jiggle(reel, "bp-shake");
    busy = true;
    clicks++;
    reel.classList.toggle("turn");
    const el = hooked;
    const slot = el._slot;
    const y = slot.y - (slot.y - 0.42) * (clicks / 3);
    el.style.setProperty("--y", String(y));
    lineTo(slot.x, y - pos(el).h);
    await F.sleep(F.T(300));
    if (clicks < 3) {
      busy = false;
      return;
    }
    // out of the water, into the basket
    el.classList.add("caught");
    lineTo(slot.x, 0.3);
    await F.fly(null, el, basket, { cls: el.className.replace(/\bbp-thing\b|\bcaught\b/g, ""), size: el.getBoundingClientRect().height, ms: 450 });
    F.jiggle(basket);
    hooked = null;
    slot.free = true;
    if (el.dataset.kind === "shoe") {
      // the shoe spits out the crab
      const crab = F.put("bp-crab", { x: 0.1, y: 0.3, h: 0.05 });
      F.after(F.T(300), () => crab.style.setProperty("--x", "-0.2"));
      F.after(F.T(1400), () => crab.remove());
    }
    const next = rows.find((x) => !x.done && x !== r);
    if (next && !next.data.hat) {
      // a new thing sinks in to a free spot (a random one from the pool)
      const s = free()[0];
      if (s) drop(F.pick(pool), s, true);
    }
    if (next) plan(next);
    F.add(r);
    busy = false;
  });

  await F.ask({ guide: "fi-head" });
  F.begin();
  F.teach("hook", () => rows[0].target && rows[0].target());
  await new Promise((res) => F.whenAll(res));
  await F.finish(async () => {
    // the boatman nets the rest; the fish come back
    F.speak(F.lineOf("fi-net"));
    live().forEach((e) => e.classList.add("gone"));
    F.root.classList.add("bp-clear");
    await F.sleep(F.T(900));
  });
  void hatRow;
}
const W = () => (typeof window !== "undefined" ? window : globalThis);

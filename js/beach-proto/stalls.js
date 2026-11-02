/*
 * The three stalls, with pay (prototype, proto-beach 2 Nov 2026; build/reports/designs/beach-boat.md §3.3: Zafar's idea 68).
 *
 * A wide view of three stalls on the sand: the corn grill (left), the cassava chips fryer (middle), the coconut cart (right); the
 * picnic basket in front. THE SENTENCE LAYOUT: Masi orders one thing at a time ("Muke wadho chips khape.": I want big chips), the
 * word tiles under her: Food (corn, chips, coconut, and the small-and-big pair), Toppings (lemon, chilli); the prices have no tiles
 * (five number tiles more did not fit the laptop panel: the coin stacks show the counts). Tap the stall that sells it: it zooms in (a wrong stall shakes; her line again). Inside, make it:
 *   CORN    the cob grills by itself (the toy part); tap the topping she said: it goes on the cob (one she didn't say shakes off);
 *           tap the paper sleeve to close it (before the topping is on: her line again, the sleeve waits).
 *   CHIPS   the chips fry; tap the basket's handle when they're golden ("Careful, it's hot!" once); tap the cone she said (both
 *           sizes are out): the chips tip in.
 *   COCONUT tap the coconut of the size she said (two of each): the top comes off with a thwack, a straw goes in, a slurp.
 * Then PAY: the price is said ("It's two"); Masi's purse holds stacks of one to three coins (five from L2), no digits; tap the
 * stack, then the stallholder's open hand: the coins slide over. Zoom out: the stall greys (it still works: a later ask can come
 * back to it) and the food drops into the basket.
 *   L1  one order at each stall (corn with one topping, the cone size, the coconut size); prices 1-3
 *   L2  "with lemon, without chilli" (the unsaid topping is out too); prices to 5; a fourth order goes back to a done stall
 *   L3, L4  as L2 (owners, other ways of asking, the middle-sized look-alikes: not built)
 * Not built: bundles of cobs and straw cups (counts), the salt, the queue of beach-goers, the speaking turn at the third stall,
 * the watch step for the first pay, Nani's sip.
 */
import { PICS } from "./art.js";

const FOOD = { corn: "n.corn-on-the-cob", chips: "n.chips-english", coconut: "n.coconut" };
const TOP = { lemon: "n.lemon", chilli: "n.chilli" };
const I = (kind, extra) => Object.assign({ fn: "Item", kind }, extra || {});

export default async function stalls(F) {
  const lv = F.level;
  const maxPrice = lv === 1 ? 3 : 5;
  const order = F.shuffle(["corn", "chips", "coconut"]);
  if (lv >= 2) order.push(F.pick(order.slice(0, 2))); // the return ask: a done stall again
  const orders = order.map((food) => {
    const o = { food, price: 1 + Math.floor(F.rng() * maxPrice) };
    if (food === "corn") {
      o.with = F.pick(["lemon", "chilli"]);
      if (lv >= 2) o.without = o.with === "lemon" ? "chilli" : "lemon";
    } else o.size = F.pick(["big", "small"]);
    return o;
  });
  const orderNP = (o) => {
    if (o.food === "corn") {
      const head = I(FOOD.corn, { mods: [{ fn: "WithFood", x: I(TOP[o.with]) }] });
      return o.without ? { fn: "Without", head, x: I(TOP[o.without]) } : head;
    }
    return I(FOOD[o.food], { mods: [`a.${o.size}`] });
  };

  /* ----- the scene: three stalls, the basket ----- */
  F.scene.insertAdjacentHTML("beforeend", '<div class="bp-sky"></div><div class="bp-horizon"></div><div class="bp-far-sand"></div>');
  const STALL_X = { corn: 0.2, chips: 0.5, coconut: 0.8 };
  const stallEl = {};
  for (const food of ["corn", "chips", "coconut"]) {
    const sign = food === "corn" ? `<img src="${PICS.cornDone}" alt="">` : food === "chips" ? `<img src="${PICS.chipsGolden}" alt="">` : '<span class="bp-coconut"></span>';
    const s = F.put(`bp-stall bp-stall-${food}`, { x: STALL_X[food], y: 0.78, h: 0.5, w: 0.25, tag: "button", html: `<span class="bp-awning"></span><span class="bp-counter"></span><span class="bp-sign">${sign}</span><span class="bp-keeper"></span>` });
    s.classList.add("wide");
    s.dataset.food = food;
    s.setAttribute("aria-label", `${food} stall`);
    stallEl[food] = s;
  }
  const basket = F.put("bp-basket", { x: 0.5, y: 0.98, h: 0.16, html: `<img src="${PICS.basketBack}" alt="">` });

  /* ----- her orders: each an order row, then its pay row ----- */
  let field = null; // the inside of the open stall
  const rows = [];
  orders.forEach((o, i) => {
    rows.push(
      F.row({
        key: `order${i}`,
        line: { fn: "Need", who: "p1", thing: orderNP(o) },
        word: I(FOOD[o.food]),
        tiles: [o.food, o.size, o.with, o.without].filter(Boolean),
        target: () => (field ? field.target(o) : stallEl[o.food]),
        data: { kind: "order", o },
      })
    );
    rows.push(
      F.row({
        key: `pay${i}`,
        line: { fn: "ItSX", x: I(`num.${o.price}`) },
        word: I(`num.${o.price}`),
        tiles: [],
        target: () => (field && field.held ? field.hand : field && field.stack(o.price)),
        data: { kind: "pay", o },
      })
    );
  });

  /* ----- the tiles ----- */
  const img = (src, cls = "") => (box) => box.insertAdjacentHTML("beforeend", `<img class="bp-tileimg ${cls}" src="${src}" alt="">`);
  const pic = (cls) => (box) => box.insertAdjacentHTML("beforeend", `<span class="bp-tilepic ${cls}"></span>`);
  F.sentence([
    {
      label: { en: "food" },
      tiles: [
        { key: "corn", word: I(FOOD.corn), lex: FOOD.corn, picture: img(PICS.cornDone) },
        { key: "chips", word: I(FOOD.chips), lex: FOOD.chips, picture: img(PICS.chipsGolden) },
        { key: "coconut", word: I(FOOD.coconut), lex: FOOD.coconut, picture: pic("bp-coconut") },
        { pair: [
          { key: "small", word: { fn: "Amt", x: "a.small" }, lex: "a.small", picture: pic("bp-plain small") },
          { key: "big", word: { fn: "Amt", x: "a.big" }, lex: "a.big", picture: pic("bp-plain") },
        ] },
      ],
    },
    {
      label: { en: "toppings" },
      tiles: ["lemon", "chilli"].map((t) => ({ key: t, word: I(TOP[t]), lex: TOP[t], picture: img(PICS[t]) })),
    },
  ]);

  /* ----- inside a stall ----- */
  let busy = false;
  let hotSaid = false;
  function openStall(food, r) {
    const o = r.data.o;
    const box = F.put("bp-inside", { x: 0.5, y: 1, h: 1, w: 1 });
    box.classList.add("wide", `bp-inside-${food}`);
    const at = (cls, opts) => F.put(cls, Object.assign({ parent: box }, opts));
    const keeperHand = at("bp-hand", { x: 0.86, y: 0.42, h: 0.14, tag: "button" });
    keeperHand.setAttribute("aria-label", "stallholder's hand");
    const f = { food, box, hand: keeperHand, held: null, ready: false, stacks: [] };
    f.stack = (n) => f.stacks[n - 1];
    if (food === "corn") {
      at("bp-grill", { x: 0.36, y: 0.6, h: 0.08, w: 0.36 }).classList.add("wide");
      const cob = at("bp-cob", { x: 0.36, y: 0.6, h: 0.26, img: PICS.cornRaw });
      const tops = {};
      F.shuffle(["lemon", "chilli"]).forEach((t, k) => {
        tops[t] = at("bp-top", { x: 0.66 + k * 0.12, y: 0.6, h: 0.13, tag: "button", img: PICS[t] });
        tops[t].setAttribute("aria-label", t);
        F.on(tops[t], "click", () => topping(t));
      });
      const sleeve = at("bp-sleeve", { x: 0.12, y: 0.62, h: 0.18, tag: "button" });
      sleeve.setAttribute("aria-label", "paper sleeve");
      F.after(F.T(700), () => cob.querySelector("img") && (cob.querySelector("img").src = PICS.cornHalf));
      F.after(F.T(1400), () => cob.querySelector("img") && (cob.querySelector("img").src = PICS.cornDone));
      const on = new Set();
      async function topping(t) {
        F.acted();
        const r2 = F.current();
        if (!r2 || r2.data.kind !== "order" || busy) return;
        if (t !== o.with) return F.oops(r2, tops[t]); // a puff: it shakes off; her line again
        if (on.has(t)) return F.jiggle(tops[t], "bp-shake");
        on.add(t);
        await F.fly(PICS[t], tops[t], cob, { size: tops[t].getBoundingClientRect().height * 0.7, ms: 380 });
        cob.insertAdjacentHTML("beforeend", `<img class="bp-cob-top" src="${PICS[t]}" alt="">`);
      }
      F.on(sleeve, "click", async () => {
        F.acted();
        const r2 = F.current();
        if (!r2 || r2.data.kind !== "order" || busy) return;
        if (!on.has(o.with)) {
          F.stopVoice();
          F.sayLine(r2); // the sleeve waits: her line again, no verdict
          return F.jiggle(sleeve, "bp-shake");
        }
        busy = true;
        await F.fly(PICS.cornDone, cob, sleeve, { size: cob.getBoundingClientRect().height, ms: 380 });
        cob.classList.add("taken");
        sleeve.classList.add("full");
        made(r2, sleeve, PICS.cornDone);
      });
      f.target = () => (on.has(o.with) ? sleeve : tops[o.with]);
    } else if (food === "chips") {
      at("bp-fryer", { x: 0.34, y: 0.66, h: 0.2, w: 0.3 }).classList.add("wide");
      const fryB = at("bp-frybasket", { x: 0.34, y: 0.6, h: 0.18, tag: "button", img: PICS.chipsRaw });
      fryB.setAttribute("aria-label", "the basket's handle");
      F.after(F.T(1500), () => {
        f.ready = true;
        const im = fryB.querySelector("img");
        if (im) im.src = PICS.chipsGolden;
      });
      const cones = {};
      F.shuffle(["big", "small"]).forEach((size, k) => {
        cones[size] = at(`bp-cone${size === "small" ? " small" : ""}`, { x: 0.62 + k * 0.13, y: 0.66, h: size === "big" ? 0.2 : 0.12, tag: "button" });
        cones[size].setAttribute("aria-label", `${size} cone`);
        F.on(cones[size], "click", () => cone(size));
      });
      let lifted = false;
      F.on(fryB, "click", () => {
        F.acted();
        if (!f.ready || lifted) return F.jiggle(fryB, "bp-shake");
        lifted = true;
        fryB.classList.add("lifted");
        if (!hotSaid) {
          hotSaid = true;
          F.speak(F.lineOf("st-hot"));
        }
      });
      async function cone(size) {
        F.acted();
        const r2 = F.current();
        if (!r2 || r2.data.kind !== "order" || busy) return;
        if (!lifted) return F.jiggle(cones[size], "bp-shake");
        if (size !== o.size) return F.oops(r2, cones[size]);
        busy = true;
        await F.fly(PICS.chipsGolden, fryB, cones[size], { size: fryB.getBoundingClientRect().height * 0.6, ms: 380 });
        fryB.classList.add("taken");
        cones[size].classList.add("full");
        made(r2, cones[size], PICS.chipsGolden);
      }
      f.target = () => (!lifted ? (f.ready ? fryB : null) : cones[o.size]);
    } else {
      const nuts = [];
      const sizes = F.shuffle(["big", "big", "small", "small"]);
      sizes.forEach((size, k) => {
        const n = at(`bp-coconut${size === "small" ? " small" : ""}`, { x: 0.18 + k * 0.13, y: 0.66, h: size === "big" ? 0.17 : 0.1, tag: "button" });
        n.dataset.size = size;
        n.setAttribute("aria-label", `${size} coconut`);
        nuts.push(n);
        F.on(n, "click", () => nut(n));
      });
      const block = at("bp-block", { x: 0.74, y: 0.68, h: 0.06, w: 0.18 });
      block.classList.add("wide");
      async function nut(n) {
        F.acted();
        const r2 = F.current();
        if (!r2 || r2.data.kind !== "order" || busy) return;
        if (n.dataset.size !== o.size) return F.oops(r2, n);
        busy = true;
        n.style.setProperty("--x", "0.74");
        n.style.setProperty("--y", "0.63");
        await F.sleep(F.T(500));
        n.classList.add("chopped"); // the thwack: the top comes off
        F.jiggle(n);
        await F.sleep(F.T(400));
        n.insertAdjacentHTML("beforeend", '<span class="bp-straw"></span>');
        await F.sleep(F.T(500));
        made(r2, n, null);
      }
      f.target = () => nuts.find((n) => n.dataset.size === o.size);
    }
    // Masi's purse: stacks of one to five coins (no digits)
    const purse = at("bp-purse", { x: 0.42, y: 0.98, h: 0.2, w: 0.5 });
    purse.classList.add("wide");
    for (let n = 1; n <= maxPrice; n++) {
      const st = at("bp-stack", { x: 0.22 + (n - 1) * (0.4 / Math.max(1, maxPrice - 1)), y: 0.95, h: 0.035 * n + 0.02, tag: "button", html: '<i class="bp-coin"></i>'.repeat(n) });
      st.dataset.n = String(n);
      st.setAttribute("aria-label", `${n} coins`);
      f.stacks.push(st);
      F.on(st, "click", () => {
        F.acted();
        const r2 = F.current();
        if (!r2 || r2.data.kind !== "pay" || busy) return F.jiggle(st, "bp-shake");
        if (f.held) f.held.classList.remove("lifted");
        f.held = st;
        st.classList.add("lifted");
      });
    }
    F.on(keeperHand, "click", async () => {
      F.acted();
      const r2 = F.current();
      if (!r2 || r2.data.kind !== "pay" || busy || !f.held) return F.jiggle(keeperHand, "bp-shake");
      const st = f.held;
      if (Number(st.dataset.n) !== r2.data.o.price) {
        st.classList.remove("lifted");
        f.held = null;
        return F.oops(r2, st);
      }
      busy = true;
      // the coins slide over one by one
      for (const c of Array.from(st.querySelectorAll(".bp-coin")).reverse()) {
        await F.fly(null, st, keeperHand, { cls: "bp-coin", size: st.getBoundingClientRect().width * 0.6, ms: 260 });
        c.remove();
      }
      F.add(r2);
      await F.sleep(F.T(300));
      closeStall(food);
    });
    return f;
  }
  let foodPic = null;
  let foodFrom = null;
  function made(r, from, src) {
    foodPic = src;
    foodFrom = from;
    F.add(r);
    busy = false;
  }
  async function closeStall(food) {
    const box = field && field.box;
    field = null;
    if (box) box.remove();
    stallEl[food].classList.add("done"); // greyed in code (Zafar's idea); a later ask can still come back
    await F.fly(foodPic, stallEl[food], basket, { cls: foodPic ? "" : "bp-coconut", size: basket.getBoundingClientRect().height * 0.6, ms: 520 });
    F.jiggle(basket);
    busy = false;
    void foodFrom;
  }

  for (const food of ["corn", "chips", "coconut"])
    F.on(stallEl[food], "click", () => {
      F.acted();
      const r = F.current();
      if (!r || busy || field || r.data.kind !== "order") return;
      if (r.data.o.food !== food) return F.oops(r, stallEl[food]);
      stallEl[food].classList.remove("done");
      field = openStall(food, r);
    });

  await F.ask({ guide: "st-head" });
  F.begin();
  F.teach("stall", () => rows[0].target && rows[0].target());
  await new Promise((res) => F.whenAll(res));
  await F.finish(async () => {
    F.jiggle(basket);
    await F.sleep(F.T(500));
  });
}

/*
 * Pay (shops.md §3E; games-at-a-glance §6; Zafar, 1 Nov: one way to pay, count out the coins and hand them over, ready-made
 * stacks for small prices). A price is a number, not a sentence, so this game keeps chai's order card (one card per price, the
 * seller's): he says the price ("Trae paisa, please"), its card pops and turns into its row.
 *
 * The money: two coins, no digits anywhere. A small copper coin is one; a big brass coin is ten.
 *   L1  prices one to five; Nani's purse holds ready-made copper stacks of one to five. Tap a stack: it slides onto the counter
 *       (another stack tapped swaps it; the counter tapped sends it back). The stack picked decides.
 *   L2  six to twenty; the purse holds two heaps, copper and brass: one tap, one coin onto the counter (brass in the top row,
 *       copper below, a gap after five). The counter stops at the price: a coin that would go past it doesn't land (the heap
 *       shakes), and the counted rows ring gold (the count ticks). Tap the rows: the last coin goes back.
 *   L3  the tens: ten, twenty ... a hundred
 *   L4  any number 21-99: tens and ones together
 * Tap the seller's open hand: the give. The price on the counter: he scoops the coins into his tin (a ding), "Barabar!", the
 * row ticks (gold first time). Short: his patient hand waits and he says the price again (nothing marked). A wrong stack at L1:
 * every coin slides back into the purse, he says the price again, the row will tick plain; after a second wrong give, the
 * helper card opens.
 * Not yet: the ten-coin trick (ten coppers jump into one brass coin, once at L2: waits on Mum's clip of ten, do), the seller's
 * count-along at L1 (waits on the number clips).
 */
import { SELLER } from "./art.js";

const HAND = "assets/characters/hands/skins/player-boy/hand-a3-palm-up-e.webp"; // (a stand-in: the seller's own open hand is an art need)

async function run(F) {
  const lv = F.level;
  const nPrices = lv === 4 ? 2 : 3;
  const prices = [];
  for (let i = 0; i < nPrices; i++) {
    let p;
    do {
      if (lv === 1) p = 1 + Math.floor(F.rng() * 5);
      else if (lv === 2) p = 6 + Math.floor(F.rng() * 15);
      else if (lv === 3) p = 10 * (1 + Math.floor(F.rng() * 10));
      else p = 21 + Math.floor(F.rng() * 79);
    } while (prices.includes(p) || (lv === 4 && p % 10 === 0));
    prices.push(p);
  }

  /* ----- the scene: the stall's wall, the seller behind the counter (his hand held out), his tin; Nani's purse ----- */
  F.scene.insertAdjacentHTML("beforeend", '<div class="tp-wall"></div><div class="tp-awning"></div><div class="tp-counter"></div>');
  const seller = F.put("tp-seller", { x: 0.8, y: 0.72, h: 0.62, img: "assets/characters/shopkeeper/shopkeeper-happy.png", z: 2 });
  seller.setAttribute("aria-hidden", "true");
  const hand = F.put("tp-hand", { x: 0.66, y: 0.74, h: 0.2, img: HAND, tag: "button", z: 6, flip: true });
  hand.setAttribute("aria-label", "the seller's hand");
  const tin = F.put("tp-tin", { x: 0.9, y: 0.92, h: 0.14, z: 6 });
  tin.setAttribute("aria-hidden", "true");
  const purse = F.put("tp-purse", { x: 0.22, y: 0.97, h: 0.24, z: 6 });
  const rowsEl = F.put("tp-rows", { x: 0.55, y: 0.96, h: 0.22, tag: "button", z: 7, html: '<div class="tp-row ten"></div><div class="tp-row one"></div>' });
  rowsEl.setAttribute("aria-label", "the coins on the counter");
  const tenRow = rowsEl.querySelector(".ten");
  const oneRow = rowsEl.querySelector(".one");

  /* ----- the purse: stacks (L1) or two heaps ----- */
  let stacks = [];
  let heaps = {};
  if (lv === 1) {
    stacks = F.shuffle([1, 2, 3, 4, 5]).map((k) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "tp-stack";
      b.dataset.n = String(k);
      b.setAttribute("aria-label", `a stack of ${k}`);
      b.innerHTML = '<span class="tp-coin"></span>'.repeat(k);
      purse.appendChild(b);
      return b;
    });
  } else {
    for (const kind of ["ten", "one"]) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = `tp-heap ${kind}`;
      b.setAttribute("aria-label", kind === "ten" ? "the big coins" : "the small coins");
      b.innerHTML = `<span class="tp-coin${kind === "ten" ? " ten" : ""}"></span>`.repeat(kind === "ten" ? 7 : 11);
      purse.appendChild(b);
      heaps[kind] = b;
    }
  }

  /* ----- the counter: what's on it, drawn in two rows (brass above copper, a gap after five) ----- */
  let on = { ten: 0, one: 0 };
  let stackOn = null;
  let order = []; // the coins in the order they landed (for taking the last one back)
  const sum = () => on.ten * 10 + on.one;
  let cur = null;
  function paint() {
    const coins = (k, cls) => Array.from({ length: k }, (_, i) => `${i === 5 ? '<span class="tp-gap"></span>' : ""}<span class="tp-coin${cls}"></span>`).join("");
    tenRow.innerHTML = coins(on.ten, " ten");
    oneRow.innerHTML = coins(on.one, "");
    rowsEl.classList.toggle("full", lv > 1 && !!cur && sum() === cur.data.price);
  }
  function clear() {
    on = { ten: 0, one: 0 };
    order = [];
    if (stackOn) stackOn.classList.remove("out");
    stackOn = null;
    paint();
  }
  stacks.forEach((b) =>
    F.on(b, "click", () => {
      F.acted();
      if (!cur) return;
      if (stackOn) stackOn.classList.remove("out");
      stackOn = b;
      b.classList.add("out");
      on = { ten: 0, one: Number(b.dataset.n) };
      paint();
      if (window.Sfx) window.Sfx.play("right", { volume: 0.22 });
    })
  );
  Object.entries(heaps).forEach(([kind, b]) =>
    F.on(b, "click", () => {
      F.acted();
      if (!cur) return;
      const v = kind === "ten" ? 10 : 1;
      if (sum() + v > cur.data.price) {
        F.jiggle(b, "tp-shake"); // past the price: it doesn't land
        return;
      }
      on[kind]++;
      order.push(kind);
      paint();
      if (window.Sfx) window.Sfx.play("right", { volume: 0.22 });
    })
  );
  F.on(rowsEl, "click", () => {
    F.acted();
    if (stackOn) return clear();
    const k = order.pop();
    if (!k) return;
    on[k]--;
    paint();
  });

  /* ----- the give ----- */
  let wrongGives = 0;
  F.on(hand, "click", async () => {
    F.acted();
    const r = cur;
    if (!r) return;
    const s = sum();
    if (!s || (lv > 1 && s < r.data.price)) {
      // his patient open hand: and ...? (the price again; nothing marked)
      F.jiggle(hand);
      F.sayLine(r);
      return;
    }
    if (s !== r.data.price) {
      // a wrong stack: every coin slides back into the purse, the price again
      clear();
      F.oops(r, hand);
      wrongGives++;
      if (wrongGives >= 2) F.helper(true, "second-wrong-give");
      return;
    }
    wrongGives = 0;
    // he scoops them into his tin: the count-back is the thank-you
    await F.fly(null, rowsEl, tin, { cls: "tp-coin ten", size: rowsEl.getBoundingClientRect().height * 0.4, ms: 420 });
    if (F.dead) return;
    on = { ten: 0, one: 0 };
    order = [];
    paint();
    F.jiggle(tin);
    if (window.Sfx) window.Sfx.play("gold", { volume: 0.3 });
    F.add(r);
  });

  /* ----- the prices, one at a time: his line, the card pops and turns into its row ----- */
  const coinPic = (box) => box.insertAdjacentHTML("beforeend", '<span class="tp-dots" style="font-size:2.4em"><span class="tp-coin"></span></span>');
  for (let i = 0; i < prices.length; i++) {
    const price = prices[i];
    const thing = { fn: "Item", kind: "n.paisa", n: price };
    const r = F.row({ key: `price${i}`, line: { fn: "XPlease", x: thing }, word: thing, need: 1, picture: coinPic, target: () => (sum() === price ? hand : lv === 1 ? stacks.find((b) => Number(b.dataset.n) === price) : heaps[price - sum() >= 10 ? "ten" : "one"]), data: { price } });
    cur = null;
    clear();
    if (stackOn) stackOn.classList.remove("out");
    await F.ask(i === 0 ? { guide: "pay-guide" } : {});
    cur = r;
    if (i === 0) {
      F.begin();
      F.teach("coins", () => (lv === 1 ? stacks.find((b) => Number(b.dataset.n) === price) : heaps[price >= 10 ? "ten" : "one"]));
    }
    await new Promise((res) => F.whenAll(res));
    cur = null;
    if (F.dead) return;
    // "Barabar!": just right
    await F.speak(F.say({ fn: "Exclaim", x: "phrase.just-right" }));
    stacks.forEach((b) => b.classList.remove("out"));
    stackOn = null;
  }
  await F.finish(async () => {
    F.jiggle(seller);
    await F.sleep(F.T(700));
  });
}

export default { opts: { person: SELLER }, run };

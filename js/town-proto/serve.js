/*
 * Serve at the fruit stall (shops.md §3A; games-at-a-glance §6): the fruit seller lets you help behind his counter. A customer
 * walks up and orders a sentence ("Muke ba amba khape": I'd like two mangoes): the speaker in the box is the customer, her line
 * big with its key words underlined, and the shared word tiles under it (every kind on the stall, asked for or not, and the
 * numbers): the tiles never give the answer.
 *
 *   Tap a crate: one of its fruit hops onto the scale's pan (the pan dips, the needle swings; the dial has no digits).
 *   The count stops at the number: another fruit doesn't land (it bounces back). The dial rings gold: that's the count.
 *   Tap the pan: the last fruit goes back (undo until the give).
 *   Tap the customer's held-out bag: the give. Right kind and number: the bag twists shut, the row ticks (gold first time),
 *   she pays the seller, the next customer walks up. A wrong kind on the pan at the give: everything tips back into the crates,
 *   her funny shake, her order again (the row will tick plain). A wrong crate tapped: the fruit hops up and back, nothing lands,
 *   her order again (nothing marked against the child beyond the plain tick).
 *
 *   L1  two crates (the asked kind and a clearly different one); one or two; 2 customers
 *   L2  three kinds; counts to five; 3 customers
 *   L3  four kinds and one kind in big and small crates: "two big mangoes" (the size pair tile); 3 customers
 *   L4  five kinds with the look-alikes (onion and potato side by side); counts to six; 3 customers
 * After the last customer, the seller says "Shabash!" (the kit's finale).
 */
import { PEOPLE, SELLER, SELLER_BODY, PRODUCE } from "./art.js";

const stamp = (p) => (typeof window !== "undefined" && typeof window.njgV === "function" ? window.njgV(p) : p);

async function run(F) {
  const lv = F.level;
  const nKinds = [2, 3, 4, 5][lv - 1];
  const most = [2, 5, 5, 6][lv - 1];
  const nCust = lv === 1 ? 2 : 3;
  // the kinds on the stall (L1: the confirmed words; L4 keeps onion and potato side by side)
  const pool = lv === 1 ? ["mango", "lemon", "onion", "tomato"] : ["mango", "lemon", "onion", "tomato", "banana", "potato", "orange"];
  let kinds = F.shuffle(pool).slice(0, nKinds);
  if (lv === 4 && !(kinds.includes("onion") && kinds.includes("potato"))) kinds = ["onion", "potato"].concat(F.shuffle(pool.filter((k) => k !== "onion" && k !== "potato")).slice(0, nKinds - 2));
  kinds = F.shuffle(kinds);
  if (lv === 4) {
    // (the look-alikes stand next to each other)
    const o = kinds.indexOf("onion");
    const p = kinds.indexOf("potato");
    kinds.splice(p, 1);
    kinds.splice(kinds.indexOf("onion") + (o < p ? 1 : 0), 0, "potato");
  }
  // the crates: one per kind; at L3 one kind also in a crate of small ones (big and small decide)
  const sized = lv === 3 ? kinds[0] : null;
  const crates = kinds.map((k) => ({ kind: k, size: sized === k ? "big" : null }));
  if (sized) crates.splice(1, 0, { kind: sized, size: "small" });
  const people = F.shuffle([PEOPLE.ma, PEOPLE.nana, PEOPLE.bigma, PEOPLE.hannah]).slice(0, nCust);
  // the orders: a kind (and at L3 a size), and how many; never the same kind twice running
  let last = null;
  const orders = people.map((who, i) => {
    let c;
    do c = F.pick(crates);
    while (crates.length > 1 && last && c.kind === last.kind && c.size === last.size);
    last = c;
    const n = lv === 1 ? 1 + Math.floor(F.rng() * 2) : 1 + Math.floor(F.rng() * most);
    return { who, crate: c, n, i };
  });

  /* ----- the scene: the street beyond, the customer, the counter with crates and the scale, the seller ----- */
  F.scene.insertAdjacentHTML("beforeend", '<div class="tp-wall"></div><div class="tp-awning"></div><div class="tp-counter"></div>');
  const seller = F.put("tp-seller", { x: 0.92, y: 0.72, h: 0.62, img: SELLER_BODY, z: 2 });
  seller.setAttribute("aria-hidden", "true");
  const cust = F.put("tp-person in", { x: 0.36, y: 0.69, h: 0.5, z: 3, html: '<div class="tp-body"></div><div class="tp-head"><img alt=""></div>' });
  const bag = F.put("tp-bag", { x: 0.56, y: 0.64, h: 0.2, tag: "button", z: 5, html: '<div class="tp-sack"></div>' });
  bag.setAttribute("aria-label", "the bag");
  const scale = F.put("tp-scale", { x: 0.84, y: 0.97, h: 0.28, tag: "button", z: 6, html: '<div class="tp-on"></div><div class="tp-pan"></div><div class="tp-dial"><div class="tp-needle"></div></div>' });
  scale.setAttribute("aria-label", "the scale");
  const on = scale.querySelector(".tp-on");
  const n = crates.length;
  const span = n > 4 ? 0.6 : 0.5;
  const crateEls = crates.map((c, i) => {
    const x = 0.09 + (n === 1 ? span / 2 : (span * i) / (n - 1));
    const el = F.put(`tp-crate${c.size === "small" ? " small" : ""}`, { x, y: 0.95, h: n > 4 ? 0.12 : n > 3 ? 0.14 : 0.17, tag: "button", z: 7, html: '<div class="tp-pile"></div>' });
    el.setAttribute("aria-label", `${c.size ? c.size + " " : ""}${c.kind}`);
    const pile = el.querySelector(".tp-pile");
    for (let k = 0; k < 6; k++) pile.insertAdjacentHTML("beforeend", `<img src="${stamp(PRODUCE[c.kind].img)}" alt="">`);
    return el;
  });
  const showCustomer = (o) => {
    const im = cust.querySelector(".tp-head img");
    im.src = stamp(o.who.face);
    cust.style.setProperty("--tp-cloth", o.who.cloth);
    cust.classList.remove("out");
  };

  /* ----- the orders: one row each, the customer's own sentence ----- */
  const item = (o) => ({ fn: "Item", kind: PRODUCE[o.crate.kind].lex, n: o.n, mods: o.crate.size ? [`a.${o.crate.size}`] : [] });
  const rows = orders.map((o) =>
    F.row({
      key: `order${o.i}`,
      line: { fn: "Need", who: "p1", thing: item(o) },
      word: item(o),
      need: 1,
      tiles: [o.crate.kind, `n${o.n}`].concat(o.crate.size ? [o.crate.size] : []),
      picture: (box) => box.insertAdjacentHTML("beforeend", `<img class="tp-tile-pic" src="${stamp(PRODUCE[o.crate.kind].img)}" alt="">`),
      target: () => (load.length >= o.n ? bag : crateEls[crates.indexOf(o.crate)]),
      data: o,
    })
  );

  /* ----- the word tiles: every kind on the stall, the size pair at L3, the numbers ----- */
  const pic = (kind, s = "100%") => (box) => {
    const i = document.createElement("img");
    i.src = stamp(PRODUCE[kind].img);
    i.alt = "";
    i.className = "tp-tile-pic";
    i.style.setProperty("--s", s);
    box.appendChild(i);
  };
  const dots = (k) => (box) => box.insertAdjacentHTML("beforeend", `<span class="tp-dots">${'<span class="tp-coin"></span>'.repeat(k)}</span>`);
  const fruitTiles = kinds.map((k) => ({ key: k, id: k, word: { fn: "Item", kind: PRODUCE[k].lex }, lex: PRODUCE[k].lex, picture: pic(k) }));
  if (sized) fruitTiles.push({ pair: [{ key: "small", id: "small", word: { fn: "Item", kind: PRODUCE[sized].lex, mods: ["a.small"] }, lex: "a.small", picture: pic(sized, "58%") }, { key: "big", id: "big", word: { fn: "Item", kind: PRODUCE[sized].lex, mods: ["a.big"] }, lex: "a.big", picture: pic(sized, "100%") }] });
  const numTiles = [];
  for (let k = 1; k <= most; k++) numTiles.push({ key: `n${k}`, id: `num${k}`, word: { fn: "Item", kind: "num." + k }, lex: "num." + k, picture: dots(k) });
  F.sentence([
    { label: { fn: "Item", kind: "n.fruit", number: "pl" }, tiles: fruitTiles },
    { label: { fn: "Ask", x: "q.how-many" }, tiles: numTiles },
  ]);

  /* ----- play ----- */
  let load = []; // the crates of the fruit on the pan, in order
  let wrongGives = 0;
  let showBag = F.params.onboard !== false;
  const cur = () => F.current();
  function paintScale(r) {
    scale.style.setProperty("--dip", String(Math.min(30, load.length * 6)));
    scale.style.setProperty("--turn", String(Math.min(120, load.length * 22)));
    scale.classList.toggle("full", !!r && load.length >= r.data.n);
    on.innerHTML = load.map((c) => `<img src="${stamp(PRODUCE[c.kind].img)}" alt=""${c.size === "small" ? ' style="width:22%"' : ""}>`).join("");
  }
  crateEls.forEach((el, i) =>
    F.on(el, "click", async () => {
      F.acted();
      const r = cur();
      if (!r) return;
      const c = crates[i];
      if (load.length >= r.data.n) {
        F.jiggle(scale, "tp-shake"); // that's the number: another doesn't land
        return;
      }
      await F.fly(PRODUCE[c.kind].img, el, scale, { ms: 420 });
      if (F.dead) return;
      load.push(c);
      if (showBag) bag.classList.add("lit");
      paintScale(r);
      F.jiggle(scale);
      if (window.Sfx) window.Sfx.play("right", { volume: 0.22 });
    })
  );
  F.on(scale, "click", () => {
    F.acted();
    if (!load.length) return;
    const c = load.pop();
    paintScale(cur());
    F.fly(PRODUCE[c.kind].img, scale, crateEls[crates.indexOf(c)], { ms: 380 });
  });
  F.on(bag, "click", async () => {
    F.acted();
    const r = cur();
    if (!r || !load.length) {
      F.jiggle(bag);
      return;
    }
    const o = r.data;
    const right = load.length === o.n && load.every((c) => c === o.crate);
    if (!right) {
      // everything tips back into the crates; her shake; her order again
      const back = load.slice();
      load = [];
      paintScale(r);
      back.forEach((c) => F.fly(PRODUCE[c.kind].img, scale, crateEls[crates.indexOf(c)], { ms: 420 }));
      F.oops(r, cust);
      wrongGives++;
      if (wrongGives >= 2) F.helper(true, "second-wrong-give");
      return;
    }
    wrongGives = 0;
    showBag = false;
    bag.classList.remove("lit");
    await F.fly(PRODUCE[o.crate.kind].img, scale, bag, { ms: 420 });
    load = [];
    paintScale(null);
    F.jiggle(bag);
    // she pays the seller (a coin to his tin), and walks off; the next customer walks up
    const next = rows[rows.indexOf(r) + 1];
    F.after(F.T(400), () => {
      if (F.dead) return;
      cust.classList.add("out");
      F.after(F.T(450), () => next && !F.dead && (showCustomer(next.data), F.person(next.data.who)));
    });
    F.add(r);
  });

  // (the seller's opening line, then the first customer's order; a tap skips to play)
  showCustomer(orders[0]);
  F.person(SELLER);
  F.setGuide("serve-guide");
  await Promise.race([F.speak(F.lineOf("serve-guide")), F.tapped()]);
  F.person(orders[0].who);
  await F.ask({});
  F.begin();
  // first time: the crate is lit (the kit's onboarding); the bag lights from the first fruit until the give (shops.md §3 rule 2:
  // "this is where it goes", not "now"; it never blocks another fruit)
  F.teach("crate", () => crateEls[crates.indexOf(orders[0].crate)]);

  await new Promise((res) => F.whenAll(res));
  F.person(SELLER);
  await F.finish(async () => {
    F.jiggle(seller);
    await F.sleep(F.T(700));
  });
}

export default { opts: {}, run };

/*
 * Nani's picky shopping (shops.md §3C; games-at-a-glance §6): at the general store two of the same thing sit side by side,
 * big and small, and only the describing word says which one Nani wants ("Wadho ginech": buy the big one). Her line is big in
 * her box, its key words underlined; the shared word tiles under it (the size pair, drawn at one neutral picture, and every
 * thing on the counter, asked for or not): the tiles never give the answer.
 *
 *   Tap a thing: it lifts (in hand; Nani's way of testing it: the big one wobbles heavily, the small one bounces). A lift is
 *   never a miss: tap another and the first goes back down; tap the lifted one again to put it down.
 *   Tap Nani's basket: the give. Nothing in hand: she asks "Kyo?" (which one?). The right one goes in and the row ticks (gold
 *   first time); the shopkeeper restocks the pair in a puff of dust, sides shuffled, so the one left never answers the next ask.
 *   A wrong one: it shakes and goes back (her funny reaction: the stand-in until the monocle and stagger poses are drawn), her
 *   ask again, the row will tick plain. After a second wrong give in a row, her helper card opens.
 *
 *   L1  one pair of pots, no decoy: "Wadho ginech." / "Nindho ginech." (whole recorded lines); 4 asks
 *   L2  pots and cups in both states and a glass as the decoy: "Muke wadho cup khape."; 4 asks
 *   L3  three of one thing (big, middle, small): "Wadho ma wadho." / "Nindho ma nindho."; 5 asks
 *   L4  pots, cups and onions in both states and the glass: "Muke nindho dungri khape."; 6 asks
 * Both states are asked at even odds, drawn fresh each ask (no alternation); left and right shuffled.
 */
import { GOODS, BASKET, SELLER_BODY } from "./art.js";

const stamp = (p) => (typeof window !== "undefined" && typeof window.njgV === "function" ? window.njgV(p) : p);
const SIZE = { big: 1.25, middle: 1, small: 0.72 };

async function run(F) {
  const lv = F.level;
  const nAsks = [4, 4, 5, 6][lv - 1];
  const kinds = lv === 1 ? ["pot"] : lv === 2 ? ["pot", "cup"] : lv === 3 ? [F.pick(["pot", "cup"])] : ["pot", "cup", "onion"];
  const decoy = lv === 2 || lv === 4 ? "glass" : null;
  const states = lv === 3 ? ["big", "middle", "small"] : ["big", "small"];
  const base = lv === 4 ? 0.16 : 0.19;

  /* ----- the asks: a thing (L2, L4) and a state (big or small; at L3 the biggest or the smallest), fresh each time ----- */
  const asks = [];
  for (let i = 0; i < nAsks; i++) asks.push({ i, kind: F.pick(kinds), size: F.pick(["big", "small"]) });
  const line = (a) => {
    if (lv === 1) return { fn: "Say", x: a.size === "big" ? "phrase.buy-the-big-one" : "phrase.buy-the-small-one" };
    if (lv === 3) return { fn: "Say", x: a.size === "big" ? "phrase.the-biggest" : "phrase.the-smallest" };
    return { fn: "Need", who: "p1", thing: { fn: "Item", kind: GOODS[a.kind].lex, mods: [`a.${a.size}`] } };
  };
  const word = (a) => ({ fn: "Item", kind: GOODS[a.kind].lex, mods: [`a.${a.size}`] });

  /* ----- the scene: the store's wall and shelves, the shopkeeper, the counter, Nani's basket ----- */
  F.scene.insertAdjacentHTML("beforeend", '<div class="tp-wall"></div><div class="tp-shelf" style="top:22%"></div><div class="tp-shelf" style="top:44%"></div><div class="tp-counter"></div>');
  // (the shelves' stock: decoration only, never tappable)
  [["pot", 0.2, 0.22], ["cup", 0.34, 0.22], ["glass", 0.48, 0.22], ["pot", 0.62, 0.22], ["cup", 0.26, 0.44], ["glass", 0.42, 0.44], ["pot", 0.56, 0.44]].forEach(([k, x, y]) => F.put("tp-item", { x, y, h: 0.09, img: GOODS[k].img, z: 1 }).setAttribute("aria-hidden", "true"));
  const keeper = F.put("tp-seller", { x: 0.88, y: 0.72, h: 0.6, img: SELLER_BODY, z: 2 });
  keeper.setAttribute("aria-hidden", "true");
  const basket = F.put("tp-basket", { x: 0.88, y: 0.98, h: 0.2, tag: "button", z: 9, html: `<div class="tp-load"></div><img src="${stamp(BASKET)}" alt="">` });
  basket.setAttribute("aria-label", "Nani's basket");
  const load = basket.querySelector(".tp-load");

  /* ----- the counter: each kind in every state, the decoy; slots shuffled ----- */
  let things = [];
  kinds.forEach((k) => states.forEach((s) => things.push({ kind: k, size: s })));
  if (decoy) things.push({ kind: decoy, size: "middle" });
  things = F.shuffle(things);
  const slots = things.map((_, i) => 0.1 + (things.length === 1 ? 0.33 : (0.62 * i) / (things.length - 1)));
  let up = null;
  function place(t, i) {
    const el = F.put("tp-item", { x: slots[i], y: 0.86, h: base * SIZE[t.size], img: GOODS[t.kind].img, tag: "button", z: 6 });
    el.setAttribute("aria-label", `${t.size} ${t.kind}`);
    t.el = el;
    t.slot = i;
    F.on(el, "click", () => {
      F.acted();
      if (up === t) return lower(t);
      if (up) lower(up);
      up = t;
      el.classList.add("up");
      // (Nani's test: the big one wobbles heavily, the small one bounces)
      F.jiggle(el, t.size === "big" ? "tp-shake" : "tp-bounce");
    });
    return el;
  }
  function lower(t) {
    t.el.classList.remove("up");
    if (up === t) up = null;
  }
  things.forEach(place);

  /* ----- her asks: one row each, one instruction at a time ----- */
  const rows = asks.map((a) =>
    F.row({
      key: `ask${a.i}`,
      line: line(a),
      word: word(a),
      tiles: lv === 1 || lv === 3 ? [a.size] : [a.size, a.kind],
      picture: (box) => box.insertAdjacentHTML("beforeend", `<img class="tp-tile-pic" src="${stamp(GOODS[a.kind].img)}" alt="">`),
      target: () => {
        const t = things.find((x) => x.kind === a.kind && x.size === (lv === 3 ? (a.size === "big" ? "big" : "small") : a.size));
        return up === t ? basket : t && t.el;
      },
      data: a,
    })
  );

  /* ----- the word tiles: the size pair (one neutral picture), every thing on the counter ----- */
  const pairKind = kinds[0];
  const pic = (kind, s = "100%") => (box) => {
    const i = document.createElement("img");
    i.src = stamp(GOODS[kind].img);
    i.alt = "";
    i.className = "tp-tile-pic";
    i.style.setProperty("--s", s);
    box.appendChild(i);
  };
  const thingTiles = kinds.concat(decoy ? [decoy] : []).map((k) => ({ key: k, id: k, word: { fn: "Item", kind: GOODS[k].lex }, lex: GOODS[k].lex, picture: pic(k) }));
  F.sentence([
    { label: { en: "Big and small" }, tiles: [{ pair: [{ key: "small", id: "small", word: { fn: "Item", kind: GOODS[pairKind].lex, mods: ["a.small"] }, lex: "a.small", picture: pic(pairKind, "58%") }, { key: "big", id: "big", word: { fn: "Item", kind: GOODS[pairKind].lex, mods: ["a.big"] }, lex: "a.big", picture: pic(pairKind, "100%") }] }] },
    { label: { en: "Things" }, tiles: thingTiles },
  ]);

  /* ----- the give ----- */
  let wrongGives = 0;
  F.on(basket, "click", async () => {
    F.acted();
    const r = F.current();
    if (!r) return;
    if (!up) {
      // nothing in hand: "Kyo?" (which one?), nothing counted
      F.jiggle(basket);
      F.speak(F.say({ fn: "Ask", x: "q.which-one" }));
      return;
    }
    const a = r.data;
    const t = up;
    const want = lv === 3 ? (a.size === "big" ? "big" : "small") : a.size;
    if (t.kind !== a.kind || t.size !== want) {
      // her funny reaction stands in: it shakes and goes back down; her ask again
      lower(t);
      F.oops(r, t.el);
      wrongGives++;
      if (wrongGives >= 2) F.helper(true, "second-wrong-give");
      return;
    }
    wrongGives = 0;
    lower(t);
    t.el.classList.add("gone");
    await F.fly(GOODS[t.kind].img, t.el, basket, { ms: 460 });
    if (F.dead) return;
    load.insertAdjacentHTML("beforeend", `<img src="${stamp(GOODS[t.kind].img)}" alt="">`);
    while (load.children.length > 3) load.firstElementChild.remove();
    F.jiggle(basket);
    // the restock: the same kind's states come back fresh, their sides shuffled (the decoy stays where it is)
    const same = things.filter((x) => x.kind === t.kind);
    const sl = F.shuffle(same.map((x) => x.slot));
    same.forEach((x, k) => {
      if (x !== t) x.el.remove();
    });
    t.el.remove();
    F.after(F.T(300), () => {
      if (F.dead) return;
      same.forEach((x, k) => {
        x.slot = sl[k];
        place(x, sl[k]);
        F.put("tp-puff", { x: slots[sl[k]], y: 0.88, h: 0.16, z: 7 });
      });
      F.after(F.T(700), () => F.scene.querySelectorAll(".tp-puff").forEach((p) => p.remove()));
    });
    F.add(r);
  });

  F.person({ id: "nani", name: "Nani", face: "assets/shared/faces/nani.webp" });
  await F.ask({ guide: "picky-guide" });
  F.begin();
  F.teach("lift", () => {
    const a = asks[0];
    const t = things.find((x) => x.kind === a.kind && x.size === (lv === 3 ? (a.size === "big" ? "big" : "small") : a.size));
    return t && t.el;
  });

  await new Promise((res) => F.whenAll(res));
  await F.finish(async () => {
    F.jiggle(basket);
    F.jiggle(keeper);
    await F.sleep(F.T(700));
  });
}

export default { opts: {}, run };

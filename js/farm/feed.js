/*
 * Feeding time (Zafar's notes, 1 Nov: "up to four animals in an arc of about 140 degrees, outdoors, each with its tray in
 * front; the food baskets sit in the middle gap, different foods for different animals; tap a basket, then the animal's tray,
 * the number of times asked: the right food and the right number; each tray ticks when it's right; levels go from one
 * animal to four").
 *
 * Hannah Mami names each animal and what it wants: "Hane murgi! Inke ba makai khape." (Now the hen! She wants two corn.)
 * v2 (Zafar, 2 Nov, FARM-01: "you could just match up the items pictorially"): she says ONE instruction at a time, big in her
 * box, and the order card is gone; under her the word tiles (js/shared/word-tiles.js): Animals (every animal in the yard) and
 * Food (every basket), a picture, its word and a big speaker each; nothing on them says who wants what. A tray of an animal
 * she isn't asking about: it shakes its head and she says her instruction again. The child taps a basket (it lifts and glows; it stays chosen), then taps a tray:
 * one piece flies in per tap. The tray's row ticks the moment its number is reached and the next piece bounces back (it
 * doesn't land). A wrong food: the animal shakes its head, the piece hops back, her ask is said again (the row ticks plain).
 * A tap on an animal says her instruction again (free). Fed animals eat (a two-picture loop); at the end everyone eats and hops.
 *
 *   L1  one animal; corn or grass (two baskets); one or two pieces
 *   L2  two animals; one to three pieces
 *   L3  three animals; water too (three baskets)
 *   L4  four animals; one to four pieces
 */
import { ANIMALS, THINGS, SCENERY, pose } from "./art.js";

const ANIMAL_POOL = ["hen", "goat", "cow", "sheep"];

export default async function feed(F) {
  const lv = F.level;
  const foods = lv >= 3 ? ["corn", "grass", "water"] : ["corn", "grass"];
  const most = [2, 3, 3, 4][lv - 1];
  const kinds = F.shuffle(ANIMAL_POOL).slice(0, lv);
  // each animal's food (all foods used where there are enough animals, so no basket is a give-away) and its count
  const want = F.shuffle(foods.concat(F.shuffle(foods))).slice(0, lv);
  const asks = kinds.map((kind, i) => ({ kind, food: want[i], n: want[i] === "water" ? 1 : 1 + Math.floor(F.rng() * most) }));

  /* ----- the scene: the yard, the arc of animals, the trays, the baskets ----- */
  backdrop(F);
  const n = asks.length;
  const angles = n === 1 ? [0] : asks.map((_, i) => -70 + (140 * i) / (n - 1));
  const slots = angles.map((deg) => {
    const t = (deg * Math.PI) / 180;
    // (one animal alone stands near, in the middle; more make the arc)
    const y = n === 1 ? 0.8 : 0.95 - 0.36 * Math.cos(t);
    const x = 0.5 + 0.36 * Math.sin(t);
    const depth = 0.8 + 0.25 * ((y - 0.59) / 0.24);
    return { x, y, depth, left: deg < 0 || (deg === 0 && n === 1) };
  });
  const animals = asks.map((a, i) => {
    const s = slots[i];
    const A = ANIMALS[a.kind];
    const faceRight = (A.faces || "right") === "right";
    // (facing the middle: a picture that faces right is flipped on the right of the arc, one that faces left on the left)
    const flip = s.x > 0.5 ? faceRight : !faceRight && s.x < 0.5;
    const el = F.put(`farm-animal`, { x: s.x, y: s.y - 0.07 * s.depth, h: A.h * s.depth, img: pose(a.kind, "stand"), flip, tag: "button", z: 10 + Math.round(s.y * 10) });
    el.setAttribute("aria-label", a.kind);
    el.dataset.kind = a.kind;
    return el;
  });
  const trays = asks.map((a, i) => {
    const s = slots[i];
    const tx = s.x + (0.5 - s.x) * 0.22;
    const el = F.put("farm-tray", { x: tx, y: Math.min(0.9, s.y + 0.02), h: 0.075 * s.depth + 0.015, tag: "button", z: 30 + Math.round(s.y * 10), html: '<div class="farm-in"></div>' });
    el.setAttribute("aria-label", `${a.kind}'s tray`);
    return el;
  });
  const basketXs = foods.length === 2 ? [0.43, 0.57] : [0.36, 0.5, 0.64];
  const order = F.shuffle(foods);
  const baskets = {};
  order.forEach((food, i) => {
    const el = food === "water" ? bucket(F, basketXs[i]) : basket(F, food, basketXs[i]);
    el.dataset.food = food;
    baskets[food] = el;
  });

  /* ----- her instructions (one at a time) and the word tiles: every animal and every food in the yard ----- */
  const rows = asks.map((a, i) =>
    F.row({
      key: `${a.kind}`,
      tiles: [a.kind, a.food],
      line: [{ fn: "Now", x: { fn: "Item", kind: ANIMALS[a.kind].lex } }, { fn: "Need", who: "p3", thing: foodItem(a) }],
      word: foodItem(a),
      need: a.n,
      picture: (box) => pic(box, a),
      target: () => (chosen === a.food ? trays[i] : baskets[a.food]),
      data: a,
    })
  );

  F.sentence([
    { label: { en: "Animals" }, tiles: kinds.map((kind) => ({ key: kind, id: kind, word: { fn: "Item", kind: ANIMALS[kind].lex }, lex: ANIMALS[kind].lex, picture: pose(kind, "stand") })) },
    { label: { fn: "Item", kind: "n.food" }, tiles: foods.map((food) => ({ key: food, id: food, word: { fn: "Item", kind: THINGS[food].lex }, lex: THINGS[food].lex, picture: THINGS[food].img || waterPic })) },
  ]);

  /* ----- play ----- */
  let chosen = null;
  const choose = (food) => {
    chosen = food;
    Object.entries(baskets).forEach(([f, el]) => {
      el.classList.toggle("sel", f === food);
      el.classList.toggle("lift", f === food);
    });
  };
  Object.entries(baskets).forEach(([food, el]) =>
    F.on(el, "click", () => {
      F.acted();
      choose(food);
      F.jiggle(el);
    })
  );
  // (a tap on an animal: it bounces and she says her instruction again; it never says which animal wants what)
  animals.forEach((el) =>
    F.on(el, "click", () => {
      F.acted();
      F.jiggle(el);
      F.stopVoice();
      F.sayLine();
    })
  );
  const eating = new Set();
  trays.forEach((tray, i) =>
    F.on(tray, "click", async () => {
      const r = rows[i];
      const a = asks[i];
      F.acted();
      if (!chosen) {
        Object.values(baskets).forEach((b) => F.jiggle(b));
        return;
      }
      const food = chosen;
      const src = THINGS[food].img;
      if (r.done) {
        // fed already: nothing more lands (it bounces back)
        F.jiggle(tray, "farm-shake");
        return;
      }
      const cur = F.current();
      if (cur && cur !== r) {
        // not the animal she's asking about now: it hops back, the animal shakes its head, her instruction again
        await F.fly(src, baskets[food], tray, { ms: 360, cls: src ? "" : "farm-drop" });
        F.oops(cur, animals[i]);
        return;
      }
      if (food !== a.food) {
        // a wrong food: it hops back, the animal shakes its head, her ask again
        await F.fly(src, baskets[food], tray, { ms: 360, cls: src ? "" : "farm-drop" });
        F.oops(r, animals[i]);
        return;
      }
      if (F.full(r)) {
        // the number is reached: the extra one doesn't land (it bounces back)
        F.jiggle(tray, "farm-shake");
        return;
      }
      F.add(r);
      const landed = r.got;
      await F.fly(src, baskets[food], tray, { ms: 420, cls: src ? "" : "farm-drop" });
      const box = tray.querySelector(".farm-in");
      if (food === "water") {
        if (!box.querySelector(".farm-water")) box.insertAdjacentHTML("beforeend", '<div class="farm-water"></div>');
      } else if (box.children.length < landed) {
        const im = document.createElement("img");
        im.src = stamp(src);
        im.alt = "";
        box.appendChild(im);
      }
      F.setPose(animals[i], a.kind, "eat", pose);
      F.after(F.T(700), () => !eating.has(i) && F.setPose(animals[i], a.kind, "stand", pose));
      if (r.done && !eating.has(i)) {
        eating.add(i);
        F.jiggle(animals[i]);
        munch(i);
      }
    })
  );
  // a fed animal eats: a two-picture loop (eat, stand)
  function munch(i) {
    let on = false;
    F.after(F.T(400), function loop() {
      if (F.dead) return;
      on = !on;
      F.setPose(animals[i], asks[i].kind, on ? "eat" : "stand", pose);
      F.after(F.T(on ? 650 : 900), loop);
    });
  }

  /* ----- first time: the basket, then the tray ----- */
  const r0 = rows[0];
  // (the taps work from the start: a tap during her ask lands the cards at once and is never lost)
  await F.ask({ headline: "feed-head", guide: "feed-guide" });
  F.begin();
  F.teach("basket", baskets[asks[0].food]).then(() => F.teach("tray", trays[0]));
  F.focus(r0);

  await new Promise((res) => F.whenAll(res));
  await F.finish(async () => {
    for (let k = 0; k < 2; k++) {
      animals.forEach((el) => F.jiggle(el));
      await F.sleep(F.T(650));
    }
  });
}

const stamp = (p) => (typeof window !== "undefined" && typeof window.njgV === "function" ? window.njgV(p) : p);

function foodItem(a) {
  const lex = THINGS[a.food].lex;
  return a.food === "water" ? { fn: "Item", kind: lex } : { fn: "Item", kind: lex, n: a.n };
}

/** A tile's picture for water (no picture yet): a little bucket, drawn. */
function waterPic(box) {
  box.insertAdjacentHTML("beforeend", '<span class="farm-tile-bucket"><span></span></span>');
}

/** The helper card's picture (help, asked for or after the wait): the animal and the food it wants. */
function pic(box, a) {
  const d = document.createElement("div");
  d.className = "farm-pic";
  const im = (src, cls = "") => {
    const i = document.createElement("img");
    i.src = stamp(src);
    i.alt = "";
    i.className = cls;
    d.appendChild(i);
  };
  im(pose(a.kind, "stand"), "farm-pic-who");
  if (THINGS[a.food].img) im(THINGS[a.food].img, "farm-pic-what");
  else d.insertAdjacentHTML("beforeend", '<span class="farm-pic-what farm-pic-water"></span>');
  box.appendChild(d);
}

function backdrop(F) {
  const add = (cls, src) => {
    const im = document.createElement("img");
    im.className = cls;
    im.src = stamp(src);
    im.alt = "";
    F.scene.appendChild(im);
  };
  add("farm-sky", SCENERY.sky);
  add("farm-hills", SCENERY.hills);
  add("farm-fields", SCENERY.fields);
  const g = document.createElement("div");
  g.className = "farm-ground";
  F.scene.appendChild(g);
  F.put("", { x: 0.06, y: 0.5, h: 0.3, img: SCENERY.tree, z: 1 });
  F.put("", { x: 0.95, y: 0.5, h: 0.16, img: SCENERY.bush, z: 1 });
}

function basket(F, food, x) {
  const el = F.put("farm-basket", { x, y: 0.985, h: 0.11, tag: "button", z: 60 });
  el.innerHTML = `<img src="${stamp(SCENERY.basketBack)}" alt=""><div class="farm-load"></div><img src="${stamp(SCENERY.basketFront)}" alt="">`;
  const load = el.querySelector(".farm-load");
  for (let i = 0; i < 3; i++) load.insertAdjacentHTML("beforeend", `<img src="${stamp(THINGS[food].img)}" alt="">`);
  el.setAttribute("aria-label", food);
  return el;
}
function bucket(F, x) {
  const el = F.put("farm-bucket", { x, y: 0.985, h: 0.13, tag: "button", z: 60, html: '<div class="farm-water-top"></div>' });
  el.setAttribute("aria-label", "water");
  return el;
}

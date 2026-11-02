/*
 * Home at dusk, with hide and seek (Zafar's notes, 1 Nov: "three homes along the top half (the coop, the cow pen, the stable or
 * goat shed) against the evening sky; the bottom half is the farmyard; the animals are scattered and some are hiding: a hen
 * chilling in a bucket of water, one under the hay, one under an overturned wheelbarrow, one behind the tree; some in the
 * wrong home at first (the chickens perched on the stable gate); the chicks are small and hide well; tap the hay, the
 * wheelbarrow or the bucket and someone may be under it; then tap the animal, then its home; three homes and three kinds of
 * animal; one screen").
 *
 * Hannah Mami says who goes in now ("Ba murgi ghar je me rakh!": put two hens in the house). A tap on an animal picks it up
 * (it glows); a tap on its home and it walks in and the window lights; the row ticks the moment the number is in. An animal
 * she didn't ask for shakes its head and her ask is said again (the row ticks plain). The wrong home: the animal bumps the
 * door and comes back (a funny moment, no miss: the home is not a heard word yet). The hay, the wheelbarrow and the bucket
 * can be lifted: someone may be under them (or nobody). At the end the sky goes dark: "Goodnight!".
 *
 *   L1  one ask: the cow or the goat; a hen in the bucket
 *   L2  two asks: two hens (one under the hay) and the goat or the cow
 *   L3  three asks: two hens (under the wheelbarrow; on the cow shed's gate), two chicks (one under the hay), the goat
 *       (behind the tree)
 *   L4  three asks: the small goat (the big one is out too), three hens, the cow
 * "Cow" and "chick" are still to record (grey English).
 *
 * v2 (Zafar, 2 Nov, FARM-01: the order card's picture of the animal gave the answer away): no order card; she says ONE
 * instruction at a time, big in her box, with the word tiles under her (js/shared/word-tiles.js): every kind of animal out in
 * the yard tonight, and at L4 the small-and-big pair tile (neutral goats). An animal she isn't asking about now: it shakes its
 * head and she says her instruction again.
 */
import { ANIMALS, SCENERY, pose } from "./art.js";

const HOMES = {
  coop: { x: 0.17, h: 0.3, ar: 0.85, stilts: true, sign: "hen" },
  goat: { x: 0.49, h: 0.3, ar: 1.15, sign: "goat" },
  cow: { x: 0.8, h: 0.36, ar: 1.35, sign: "cow" },
};
const HOME_OF = { hen: "coop", chick: "coop", goat: "goat", cow: "cow" };
// the yard's open places and the hiding places (x, foot y)
const OPEN = [[0.3, 0.74], [0.56, 0.7], [0.8, 0.78], [0.36, 0.98], [0.58, 0.88]];
const COVER = { hay: [0.13, 0.9], barrow: [0.44, 0.97], bucket: [0.7, 0.98], tree: [0.95, 0.66], gate: [0.74, 0.4] };

const stamp = (p) => (typeof window !== "undefined" && typeof window.njgV === "function" ? window.njgV(p) : p);

export default async function homeDusk(F) {
  const lv = F.level;
  // who is out tonight, and where: [kind, where, {size}]
  const plans = {
    1: { animals: [["cow", "open"], ["goat", "open"], ["hen", "bucket"]], asks: [[F.pick(["cow", "goat"]), 1]] },
    2: { animals: [["hen", "open"], ["hen", "hay"], ["goat", "open"], ["cow", "open"]], asks: [["hen", 2], [F.pick(["goat", "cow"]), 1]] },
    3: { animals: [["hen", "barrow"], ["hen", "gate"], ["chick", "hay"], ["chick", "open"], ["goat", "tree"], ["cow", "open"]], asks: [["hen", 2], ["chick", 2], ["goat", 1]] },
    4: { animals: [["goat", "open", "big"], ["goat", "tree", "small"], ["hen", "bucket"], ["hen", "barrow"], ["hen", "gate"], ["chick", "hay"], ["cow", "open"]], asks: [["goat", 1, "small"], ["hen", 3], ["cow", 1]] },
  }[lv];

  /* ----- the scene: the evening sky, the three homes, the yard ----- */
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
  F.scene.insertAdjacentHTML("beforeend", '<div class="farm-ground"></div>');
  const homes = {};
  for (const [id, h] of Object.entries(HOMES)) {
    const el = F.put(`farm-home${h.stilts ? " stilts" : ""}`, { x: h.x, y: 0.52, h: h.h, tag: "button", z: 5, html: `<div class="farm-roof"></div><div class="farm-walls"></div><div class="farm-door"></div><div class="farm-window"></div><div class="farm-sign"><img src="${stamp(pose(h.sign, "stand"))}" alt=""></div>` });
    el.style.setProperty("--ar", String(h.ar));
    el.setAttribute("aria-label", `${id} home`);
    homes[id] = el;
  }
  const covers = {
    hay: F.put("farm-cover", { x: COVER.hay[0], y: COVER.hay[1], h: 0.2, img: SCENERY.hay, tag: "button", z: 40 }),
    barrow: F.put("farm-barrow farm-cover", { x: COVER.barrow[0], y: COVER.barrow[1], h: 0.11, tag: "button", z: 40 }),
    bucket: F.put("farm-bucket farm-cover", { x: COVER.bucket[0], y: COVER.bucket[1], h: 0.12, tag: "button", z: 40, html: '<div class="farm-water-top"></div>' }),
  };
  F.put("", { x: COVER.tree[0], y: COVER.tree[1], h: 0.46, img: SCENERY.tree, z: 30 });

  /* ----- the animals ----- */
  const opens = F.shuffle(OPEN);
  const animals = plans.animals.map(([kind, where, size], i) => {
    const A = ANIMALS[kind];
    let x;
    let y;
    let z = 20;
    let hidden = false;
    let h = A.h * (size === "small" ? 0.7 : 1) * 0.85;
    if (where === "open") [x, y] = opens.pop();
    else if (where === "hay") {
      [x, y] = COVER.hay;
      y -= 0.02;
      hidden = true;
      z = 35;
    } else if (where === "barrow") {
      [x, y] = COVER.barrow;
      y -= 0.01;
      hidden = true;
      z = 35;
    } else if (where === "bucket") {
      [x, y] = COVER.bucket;
      y -= 0.07; // her head over the rim
      z = 39;
      h *= 0.9;
    } else if (where === "tree") {
      [x, y] = COVER.tree;
      x -= 0.08;
      y += 0.04;
      z = 25;
    } else if (where === "gate") {
      [x, y] = COVER.gate;
      h *= 0.8;
      z = 8;
    }
    const flip = x > 0.5 ? (A.faces || "right") === "right" : (A.faces || "right") === "left";
    const el = F.put(`farm-animal${hidden ? " farm-hider" : ""}`, { x, y, h, img: pose(kind, where === "bucket" ? "sit" : "stand"), flip, tag: "button", z });
    el.setAttribute("aria-label", `${size || ""} ${kind}`.trim());
    const a = { i, kind, size: size || null, where, el, hidden, home: false, x, y, h };
    return a;
  });
  const under = (cover) => animals.filter((a) => a.where === cover && a.hidden);

  /* ----- her asks ----- */
  const itemOf = (kind, n, size) => ({ fn: "Item", kind: ANIMALS[kind].lex, n, mods: size ? [`a.${size}`] : undefined });
  const rows = plans.asks.map(([kind, n, size]) =>
    F.row({
      key: `${size || ""}${kind}`,
      tiles: (size ? [size] : []).concat([kind]),
      line: { fn: "PutAt", thing: itemOf(kind, n, size), anchor: { fn: "Item", kind: "n.house" }, rel: "post.in" },
      word: itemOf(kind, n, size),
      need: n,
      picture: (box) => pic(box, kind, size),
      target: () => {
        const left = animals.find((a) => matches(a, kind, size) && !a.home);
        if (!left) return null;
        if (left.hidden) return covers[left.where];
        return chosen === left ? homes[HOME_OF[kind]] : left.el;
      },
      data: { kind, size },
    })
  );
  const matches = (a, kind, size) => a.kind === kind && (!size || a.size === size);
  const rowOf = (a) => {
    const cur = F.current();
    return cur && matches(a, cur.data.kind, cur.data.size) ? cur : null;
  };

  /* ----- the word tiles: every kind of animal out tonight (and the small-and-big pair where sizes are said) ----- */
  const kinds = [...new Set(plans.animals.map(([k]) => k))];
  const sized = plans.animals.find(([, , sz]) => sz);
  const tile = (kind) => ({ key: kind, id: kind, word: { fn: "Item", kind: ANIMALS[kind].lex }, lex: ANIMALS[kind].lex, picture: pose(kind, "stand") });
  const sizeTile = (kind, sz, scale) => ({
    key: sz,
    word: { fn: "Item", kind: ANIMALS[kind].lex, mods: [`a.${sz}`] },
    lex: `a.${sz}`,
    picture: (box) => {
      const i = document.createElement("img");
      i.src = stamp(pose(kind, "stand"));
      i.alt = "";
      i.className = "farm-tile-hen farm-tile-plain";
      i.style.setProperty("--s", scale);
      box.appendChild(i);
    },
  });
  const animalTiles = kinds.map(tile);
  if (sized) animalTiles.unshift({ pair: [sizeTile(sized[0], "small", "58%"), sizeTile(sized[0], "big", "100%")] });
  F.sentence([{ label: { en: "Animals" }, tiles: animalTiles }]);

  /* ----- play ----- */
  let chosen = null;
  const choose = (a) => {
    animals.forEach((x) => x.el.classList.toggle("sel", x === a));
    chosen = a;
  };
  animals.forEach((a) =>
    F.on(a.el, "click", () => {
      F.acted();
      if (a.hidden || a.home) return;
      choose(a);
      F.jiggle(a.el);
    })
  );
  Object.entries(covers).forEach(([id, c]) =>
    F.on(c, "click", () => {
      F.acted();
      const who = under(id);
      if (id === "hay") c.classList.add("lift");
      if (id === "barrow") c.classList.toggle("up");
      if (id === "bucket") F.jiggle(c, "farm-shake");
      if (!who.length) {
        if (id !== "bucket") F.speak(F.lineOf("dusk-nobody"));
        F.jiggle(c, "farm-shake");
        return;
      }
      who.forEach((a) => {
        a.hidden = false;
        a.el.classList.add("found");
        F.setPose(a.el, a.kind, "up", pose);
        F.after(F.T(700), () => F.setPose(a.el, a.kind, "stand", pose));
        F.jiggle(a.el);
      });
      if (id === "hay") F.after(F.T(250), () => c.classList.add("gone"));
    })
  );
  Object.entries(homes).forEach(([id, home]) =>
    F.on(home, "click", async () => {
      F.acted();
      const a = chosen;
      if (!a) return F.jiggle(home);
      const r = rowOf(a);
      if (!r) {
        // she isn't asking for this one now: it shakes its head, her instruction again
        F.oops(F.current(), a.el);
        choose(null);
        return;
      }
      if (F.full(r)) {
        F.jiggle(a.el, "farm-shake"); // that's enough of them: it doesn't go in
        choose(null);
        return;
      }
      if (HOME_OF[a.kind] !== id) {
        // the wrong home: it bumps the door and comes back (a funny moment; the home isn't a heard word yet)
        F.jiggle(home, "farm-shake");
        F.jiggle(a.el, "farm-shake");
        return;
      }
      choose(null);
      a.home = true;
      F.add(r);
      walkIn(a, home, HOMES[id]);
    })
  );
  function walkIn(a, home, H) {
    const el = a.el;
    el.classList.add("walk");
    F.setPose(el, a.kind, "stand", pose);
    el.style.setProperty("--x", String(H.x));
    el.style.setProperty("--y", String(H.stilts ? 0.44 : 0.52));
    el.style.setProperty("--h", String(a.h * 0.55));
    F.after(F.T(850), () => {
      el.classList.add("home-gone");
      home.classList.add("lit");
      F.jiggle(home);
    });
  }

  // (the taps work from the start: a tap during her ask lands the cards at once and is never lost)
  await F.ask({ headline: "dusk-head", guide: "dusk-guide" });
  F.begin();
  // first time: an animal she asked for, then its home
  const first = animals.find((a) => matches(a, rows[0].data.kind, rows[0].data.size) && !a.hidden);
  if (first) F.teach("animal", first.el).then(() => F.teach("home", homes[HOME_OF[first.kind]]));

  await new Promise((res) => F.whenAll(res));
  await F.finish(async () => {
    F.root.classList.add("night");
    Object.values(homes).forEach((h) => h.classList.add("lit"));
    await F.sleep(F.T(1700));
    const night = F.lineOf("dusk-night");
    F.setGuide("dusk-night");
    await F.speak(night);
  });
}

/** The helper card's picture (help, asked for or after the wait): the animal (its size). */
function pic(box, kind, size) {
  const d = document.createElement("div");
  d.className = "farm-pic";
  const i = document.createElement("img");
  i.src = stamp(pose(kind, "stand"));
  i.alt = "";
  i.className = `farm-pic-who${size === "small" ? " farm-small" : ""}`;
  d.appendChild(i);
  box.appendChild(d);
}

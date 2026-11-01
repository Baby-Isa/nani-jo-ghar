/*
 * The eggs (Zafar's notes, 1 Nov: "up to four hens on a perch; tap a hen and she hops up (one pose swap); her eggs are under
 * her, in the hay; Hannah Mami asks for 'all the eggs', 'half the eggs' or 'three eggs from the brown hen'; big and small, and
 * the colours, pick the hen; the eggs go straight into the basket, nothing is handed over; keep it short").
 *
 * The hens sit on their nests along the perch. A tap lifts one (she flaps up: the pose swap) and her eggs show in the hay; a
 * tap on another hen, or on her again, sets her down. Peeking is free. A tap on an egg sends it into the basket on the floor
 * if it's one she asked for; the row ticks the moment the number is reached and the next egg wobbles and stays ("careful").
 * An egg from a hen she didn't ask about wobbles, the hen clucks, and her ask is said again (the row ticks plain). One hen
 * each round hides a chick that tumbles out when she's lifted. At the end the hens cluck and hop.
 *
 * The hen is picked by the heard words (the engine: "Wadhi murgi ja ba inda khanech!": bring the big hen's two eggs):
 *   L1  two hens, big and small; all the eggs of one (one or two)
 *   L2  three hens; so many eggs from the big or the small one (she has more than asked)
 *   L3  three hens, red and white; two asks: all of one hen's, and so many from another
 *   L4  four hens, big and small, red and white; two asks, one of them half a hen's eggs
 * "White" and "half" are still to record: the engine shows them as grey English.
 */
import { ANIMALS, SCENERY, pose } from "./art.js";

const stamp = (p) => (typeof window !== "undefined" && typeof window.njgV === "function" ? window.njgV(p) : p);

export default async function eggs(F) {
  const lv = F.level;
  const nHens = [2, 3, 3, 4][lv - 1];
  // the hens: big and small; from L3 red (the hen art as it is) and white
  const looks = [];
  const sizes = ["big", "small"];
  const colours = lv >= 3 ? ["red", "white"] : ["red"];
  for (const s of sizes) for (const c of colours) looks.push({ size: s, colour: c });
  while (looks.length < nHens) looks.push({ size: F.pick(sizes), colour: F.pick(colours) });
  const hens = F.shuffle(looks).slice(0, nHens).map((h, i) => Object.assign(h, { i, eggs: 1 + Math.floor(F.rng() * 3) }));
  // the words that pick a hen at this level, and which hens they pick out alone
  // (L1-L2 the size; L3 the colour, or size and colour where the colour alone is two hens; L4 size and colour)
  const ways = lv <= 2 ? [["size"]] : lv === 3 ? [["colour"], ["size", "colour"]] : [["size", "colour"]];
  const said = (h, w) => w.map((k) => h[k]).join(" ");
  const alone = (h, w) => hens.filter((x) => said(x, w) === said(h, w)).length === 1;
  const wayOf = (h) => ways.find((w) => alone(h, w)) || null;
  const mods = (h) => (wayOf(h) || ways[ways.length - 1]).map((k) => h[k]);
  const unique = hens.filter((h) => wayOf(h));
  const nAsks = lv <= 2 ? 1 : 2;
  const targets = F.shuffle(unique).slice(0, nAsks);
  // what each ask wants
  const asks = targets.map((h, k) => {
    let kind = "all";
    if (lv === 2) kind = "some";
    if (lv === 3) kind = k === 0 ? "all" : "some";
    if (lv === 4) kind = k === 0 ? "half" : "some";
    if (kind === "half") h.eggs = F.pick([2, 4]);
    if (kind === "some") h.eggs = Math.max(h.eggs, 2) + 1;
    const n = kind === "all" ? h.eggs : kind === "half" ? h.eggs / 2 : 1 + Math.floor(F.rng() * (h.eggs - 1));
    return { hen: h, kind, n };
  });
  // one hen hides a chick
  const chickHen = F.pick(hens);

  /* ----- the scene: the hen house, the perch, the nests, the hens, the basket ----- */
  F.scene.insertAdjacentHTML("beforeend", '<div class="farm-wall"></div><div class="farm-floor"></div>');
  const plank = F.put("farm-plank wide", { x: 0.5, y: 0.6, h: 0.05, w: 0.94, z: 2 });
  plank.setAttribute("aria-hidden", "true");
  F.put("", { x: 0.12, y: 1.02, h: 0.18, img: SCENERY.hay, z: 1 });
  const xs = hens.map((_, i) => (nHens === 1 ? 0.5 : 0.2 + (0.6 * i) / (nHens - 1)));
  const henEls = [];
  const eggEls = [];
  hens.forEach((h, i) => {
    const x = xs[i];
    const big = h.size === "big";
    F.put("farm-nest", { x, y: 0.565, h: 0.08, img: SCENERY.hay, z: 3 });
    const box = F.put("farm-eggs", { x, y: 0.545, h: 0.055, w: big ? 0.12 : 0.08, z: 4 });
    box.classList.add("wide");
    const list = [];
    for (let k = 0; k < h.eggs; k++) {
      const e = document.createElement("button");
      e.type = "button";
      e.className = `farm-egg${h.colour === "white" ? "" : " brown"}`;
      e.setAttribute("aria-label", "egg");
      box.appendChild(e);
      list.push(e);
    }
    eggEls.push(list);
    const el = F.put(`farm-hen farm-${h.colour}`, { x, y: 0.565, h: (big ? 0.26 : 0.17), img: pose("hen", "sit"), flip: i >= nHens / 2, tag: "button", z: 6 });
    el.setAttribute("aria-label", `${h.size} ${h.colour} hen`);
    henEls.push(el);
  });
  const basket = F.put("farm-ebasket", { x: 0.5, y: 0.97, h: 0.16, tag: "div", z: 8 });
  basket.innerHTML = `<img src="${stamp(SCENERY.basketBack)}" alt=""><div class="farm-load"></div><img src="${stamp(SCENERY.basketFront)}" alt="">`;
  const load = basket.querySelector(".farm-load");

  /* ----- her asks: one card each ----- */
  const henItem = (h) => ({ fn: "Item", kind: ANIMALS.hen.lex, mods: mods(h).map((m) => `a.${m}`) });
  const eggsOf = (h, n) => ({ fn: "Of", owner: henItem(h), thing: n == null ? { fn: "Item", kind: "n.egg", number: "pl" } : { fn: "Item", kind: "n.egg", n } });
  const rows = asks.map((a, k) => {
    const line = a.kind === "all" ? { fn: "Command", verb: "v.bring", obj: eggsOf(a.hen, null) } : a.kind === "half" ? { fn: "BringHalfOfX", x: eggsOf(a.hen, null) } : { fn: "Command", verb: "v.bring", obj: eggsOf(a.hen, a.n) };
    const word = a.kind === "some" ? eggsOf(a.hen, a.n) : a.kind === "half" ? { fn: "BringHalfOfX", x: eggsOf(a.hen, null) } : eggsOf(a.hen, null);
    return F.row({ key: `hen${a.hen.i}`, line, word, need: a.n, picture: (box) => pic(box, a), target: () => (up === a.hen.i ? eggEls[a.hen.i].find((e) => !e.classList.contains("taken")) : henEls[a.hen.i]), data: a });
  });

  /* ----- play ----- */
  let up = -1;
  const chickOut = { done: false };
  function lift(i) {
    if (up >= 0 && up !== i) settle(up);
    const el = henEls[i];
    if (up === i) return settle(i);
    up = i;
    el.classList.add("up");
    F.setPose(el, "hen", "up", pose);
    if (hens[i] === chickHen && !chickOut.done) {
      chickOut.done = true;
      chick(i);
    }
  }
  function settle(i) {
    const el = henEls[i];
    el.classList.remove("up");
    F.setPose(el, "hen", "sit", pose);
    if (up === i) up = -1;
  }
  henEls.forEach((el, i) =>
    F.on(el, "click", () => {
      F.acted();
      lift(i);
    })
  );
  eggEls.forEach((list, i) =>
    list.forEach((e) =>
      F.on(e, "click", async (ev) => {
        ev.stopPropagation();
        F.acted();
        if (up !== i || e.classList.contains("taken")) return;
        const r = rows.find((x) => x.data.hen.i === i);
        if (!r) {
          // not a hen she asked about: the egg wobbles, the hen clucks, her ask again
          const open = rows.find((x) => !x.done);
          F.setPose(henEls[i], "hen", "happy", pose);
          F.after(F.T(600), () => up === i && F.setPose(henEls[i], "hen", "up", pose));
          F.oops(open || null, e);
          return;
        }
        F.focus(r);
        if (F.full(r)) {
          F.jiggle(e, "farm-shake"); // careful: that's enough (it doesn't land)
          return;
        }
        F.add(r);
        e.classList.add("taken");
        await F.fly(null, e, load, { cls: `farm-egg${hens[i].colour === "white" ? "" : " brown"}`, size: e.getBoundingClientRect().height * 0.8, ms: 460 });
        const inb = document.createElement("div");
        inb.className = `farm-egg${hens[i].colour === "white" ? "" : " brown"}`;
        load.appendChild(inb);
        F.jiggle(basket);
      })
    )
  );
  function chick(i) {
    const c = F.put("farm-chick", { x: xs[i], y: 0.56, h: ANIMALS.chick.h, img: pose("chick", "up"), z: 7 });
    c.classList.add("walk");
    F.after(F.T(80), () => {
      c.style.setProperty("--y", "0.95");
      c.style.setProperty("--x", String(Math.min(0.92, xs[i] + 0.12)));
    });
    F.after(F.T(1000), () => F.setPose(c, "chick", "happy", pose));
  }

  // (the taps work from the start: a tap during her ask lands the cards at once and is never lost)
  await F.ask({ headline: "eggs-head", guide: "eggs-guide" });
  F.begin();
  // first time: a hen, then an egg
  F.teach("hen", henEls[asks[0].hen.i]).then(() => F.teach("egg", () => eggEls[asks[0].hen.i][0]));

  await new Promise((res) => F.whenAll(res));
  if (up >= 0) settle(up);
  await F.finish(async () => {
    for (let k = 0; k < 2; k++) {
      henEls.forEach((el) => {
        F.setPose(el, "hen", "happy", pose);
        F.jiggle(el);
      });
      await F.sleep(F.T(650));
    }
    henEls.forEach((el) => F.setPose(el, "hen", "sit", pose));
  });
}

/** The card's picture: the hen (her size and colour) and an egg. */
function pic(box, a) {
  const d = document.createElement("div");
  d.className = "farm-pic";
  const i = document.createElement("img");
  i.src = stamp(pose("hen", "sit"));
  i.alt = "";
  i.className = `farm-pic-who farm-${a.hen.colour}${a.hen.size === "small" ? " farm-small" : ""}`;
  d.appendChild(i);
  d.insertAdjacentHTML("beforeend", `<span class="farm-egg${a.hen.colour === "white" ? "" : " brown"}"></span>`);
  box.appendChild(d);
}

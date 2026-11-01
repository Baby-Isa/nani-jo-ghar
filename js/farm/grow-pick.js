/*
 * Plant, water, grow, then pick: one game (Zafar's notes, 1 Nov: "one row of four plots: plant the sapling, water it, a short
 * time-lapse grows it, then pick what you sowed into the basket; 'pick two lemons': which plant, and how many; Hannah Mami
 * hosts, not Nani; the visual is simplified").
 *
 *   PLANT  She names the saplings to plant ("Plant the limu.": the frame still to record, the fruit Mum's word). A tap on a
 *          sapling in its pot picks it up; a tap on an empty plot plants it. A sapling she didn't name hops back to its pot
 *          and her ask is said again (the row ticks plain).
 *   WATER  "Now water it." A tap on the can, then on each new plant: the water falls, the soil darkens, and a short
 *          time-lapse grows it (sapling, bush, then fruit).
 *   PICK   Her new asks pop in ("Ba limu khan!": take two lemons). A tap on a fruit sends it into the basket; the row ticks
 *          the moment the number is in and the next one wobbles on the branch (it doesn't land). A fruit she didn't ask for
 *          wobbles and her ask is said again.
 *
 *   L1  two saplings on offer, plant one; pick one fruit
 *   L2  three on offer, plant two; pick two or three of one
 *   L3  four on offer, plant three; two picks, with colours (red or green tomatoes and chillies)
 *   L4  plant all four; two picks, with sizes (big or small mangoes) and colours
 * Every fruit is Mum's word (limu, tameto, mirchi, ambo); "plant", "water" and the tomatoes' plural are still to record.
 */
import { THINGS, SCENERY } from "./art.js";

const KINDS = ["lemon", "tomato", "chilli", "mango"];
const stamp = (p) => (typeof window !== "undefined" && typeof window.njgV === "function" ? window.njgV(p) : p);
// where the fruit hang on a grown plant (left %, top % of the plant's box)
const SPOTS = [[30, 28], [66, 24], [46, 44], [72, 48], [24, 52], [52, 18]];

export default async function growPick(F) {
  const lv = F.level;
  const offered = F.shuffle(KINDS).slice(0, [2, 3, 4, 4][lv - 1]);
  const toPlant = F.shuffle(offered).slice(0, [1, 2, 3, 4][lv - 1]);
  const plotXs = [0.2, 0.4, 0.6, 0.8];

  /* ----- the scene: the field, the row of four plots, the pots, the can, the basket ----- */
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
  F.scene.insertAdjacentHTML("beforeend", '<div class="farm-ground soil"></div>');
  const plots = plotXs.map((x, i) => {
    const el = F.put("farm-plot", { x, y: 0.7, h: 0.065, tag: "button", z: 5 });
    el.setAttribute("aria-label", `plot ${i + 1}`);
    return { i, x, el, kind: null, plant: null, wet: false };
  });
  const potXs = offered.map((_, i) => (offered.length === 1 ? 0.5 : 0.3 + (0.4 * i) / (offered.length - 1)));
  const pots = offered.map((kind, i) => {
    const el = F.put("farm-pot", { x: potXs[i], y: 0.985, h: 0.17, tag: "button", z: 20, html: `<span class="farm-sapling"><img src="${stamp(SCENERY.bush)}" alt=""><img class="farm-sapling-fruit" src="${stamp(THINGS[kind].img)}" alt=""></span>` });
    el.setAttribute("aria-label", `${kind} sapling`);
    return { kind, el, used: false };
  });
  const can = F.put("farm-can", { x: 0.91, y: 0.97, h: 0.15, tag: "button", z: 20 });
  can.setAttribute("aria-label", "watering can");
  const basket = F.put("farm-ebasket", { x: 0.13, y: 0.99, h: 0.14, z: 20 });
  basket.innerHTML = `<img src="${stamp(SCENERY.basketBack)}" alt=""><div class="farm-load"></div><img src="${stamp(SCENERY.basketFront)}" alt="">`;
  const load = basket.querySelector(".farm-load");

  /* ----- PLANT ----- */
  const fruitItem = (kind, n, mods) => ({ fn: "Item", kind: THINGS[kind].lex, n, mods: mods && mods.length ? mods : undefined });
  const plantRows = toPlant.map((kind) =>
    F.row({
      key: `plant-${kind}`,
      line: { fn: "PlantTheX", x: fruitItem(kind) },
      word: fruitItem(kind),
      need: 1,
      picture: THINGS[kind].img,
      target: () => (held && held.kind === kind ? plots.find((p) => !p.kind).el : pots.find((p) => p.kind === kind).el),
      data: { kind },
    })
  );
  const phase = { now: "plant" };
  let held = null;
  const hold = (pot) => {
    held = pot;
    pots.forEach((p) => {
      p.el.classList.toggle("sel", p === pot);
      p.el.classList.toggle("lift", p === pot);
    });
  };
  pots.forEach((pot) =>
    F.on(pot.el, "click", () => {
      F.acted();
      if (phase.now !== "plant" || pot.used) return;
      hold(pot);
      const r = plantRows.find((x) => x.data.kind === pot.kind);
      if (r) F.focus(r);
    })
  );
  plots.forEach((plot) =>
    F.on(plot.el, "click", () => {
      F.acted();
      if (phase.now === "water") return water(plot);
      if (phase.now !== "plant" || plot.kind) return F.jiggle(plot.el);
      if (!held) return pots.forEach((p) => !p.used && F.jiggle(p.el));
      const pot = held;
      const r = plantRows.find((x) => x.data.kind === pot.kind && !x.done);
      if (!r) {
        // a sapling she didn't name: it hops back to its pot, her ask again
        F.oops(plantRows.find((x) => !x.done) || null, pot.el);
        hold(null);
        return;
      }
      hold(null);
      pot.used = true;
      pot.el.classList.add("gone");
      plot.kind = pot.kind;
      plot.el.classList.add("planted");
      plot.plant = growPlant(plot);
      F.add(r);
    })
  );
  function growPlant(plot) {
    const kind = plot.kind;
    const tall = kind === "mango";
    const el = F.put(`farm-plant${tall ? " tall" : ""}`, { x: plot.x, y: 0.69, h: tall ? 0.44 : 0.34, z: 10, html: `<div class="farm-stem"></div><img class="farm-leaves" src="${stamp(tall ? SCENERY.tree : SCENERY.bush)}" alt="">` });
    el.dataset.stage = "0";
    el.dataset.kind = kind;
    return { el, kind, fruit: [] };
  }

  await F.ask({ headline: "grow-head", guide: "grow-guide" });
  F.begin();
  F.teach("sapling", pots.find((p) => p.kind === toPlant[0]).el).then(() => F.teach("plot", plots[0].el));
  await new Promise((res) => F.whenAll(res));

  /* ----- WATER, then the time-lapse ----- */
  phase.now = "water";
  F.whenAll(null);
  F.setGuide("grow-water");
  await F.speak(F.lineOf("grow-water"));
  let canOn = false;
  F.on(can, "click", () => {
    F.acted();
    if (phase.now !== "water") return;
    canOn = !canOn;
    can.classList.toggle("sel", canOn);
  });
  const planted = plots.filter((p) => p.kind);
  let grown = 0;
  let saidLook = false;
  const allGrown = new Promise((res) => (phase.grown = res));
  async function water(plot) {
    if (!plot.kind || plot.wet) return F.jiggle(plot.el);
    if (!canOn) return F.jiggle(can);
    plot.wet = true;
    can.classList.add("pour");
    for (let k = 0; k < 3; k++) F.fly(null, can, plot.el, { cls: "farm-drop", size: 10, ms: 420 + k * 90 });
    await F.sleep(F.T(600));
    can.classList.remove("pour");
    plot.el.classList.add("wet");
    const el = plot.plant.el;
    el.style.setProperty("--grow-ms", `${F.T(1100)}ms`);
    el.dataset.stage = "1";
    if (!saidLook) {
      saidLook = true;
      F.setGuide("grow-look");
      F.speak(F.lineOf("grow-look"));
    }
    await F.sleep(F.T(1300));
    el.dataset.stage = "2";
    addFruit(plot.plant);
    await F.sleep(F.T(900));
    grown++;
    if (grown >= planted.length) phase.grown();
  }
  const firstWater = F.teach("can", can);
  firstWater.then(() => F.teach("water", planted[0].el));
  // (the hints while watering: the can, then a dry plant)
  await allGrown;
  can.classList.remove("sel");

  /* ----- PICK ----- */
  phase.now = "pick";
  const picks = pickAsks(lv, planted, F);
  const pickRows = picks.map((p) =>
    F.row({
      key: `pick-${p.kind}`,
      line: { fn: "Command", verb: "v.take", obj: fruitItem(p.kind, p.n, p.mods.map((m) => `a.${m}`)) },
      word: fruitItem(p.kind, p.n, p.mods.map((m) => `a.${m}`)),
      need: p.n,
      picture: (box) => fruitPic(box, p),
      target: () => {
        const pl = planted.find((x) => x.kind === p.kind);
        return pl && pl.plant.fruit.find((f) => !f.picked && fits(f, p));
      },
      data: p,
    })
  );
  F.whenAll(null);
  const done = new Promise((res) => F.whenAll(res));
  await F.ask({ guide: "grow-guide" });
  F.teach("fruit", () => pickRows[0].target && pickRows[0].target() && pickRows[0].target().el);

  function addFruit(plant) {
    const kind = plant.kind;
    const looks = fruitLooks(kind, lv);
    looks.forEach((look, k) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = `farm-fruit${look.size === "small" ? " small" : ""}`;
      b.style.left = `${SPOTS[k][0]}%`;
      b.style.top = `${SPOTS[k][1]}%`;
      if (kind === "mango") b.style.setProperty("--fs", ".2");
      b.innerHTML = `<img class="${tint(kind, look.colour)}" src="${stamp(THINGS[kind].img)}" alt="">`;
      b.setAttribute("aria-label", `${look.size || ""} ${look.colour || ""} ${kind}`.replace(/\s+/g, " ").trim());
      plant.el.appendChild(b);
      const f = Object.assign({ el: b, kind, picked: false }, look);
      plant.fruit.push(f);
      F.on(b, "click", (ev) => {
        ev.stopPropagation();
        pick(f);
      });
    });
  }
  async function pick(f) {
    F.acted();
    if (phase.now !== "pick" || f.picked) return;
    const r = pickRows.find((x) => fits(f, x.data));
    if (!r) {
      // a fruit she didn't ask for: it wobbles on the branch, her ask again
      F.oops(pickRows.find((x) => !x.done) || null, f.el);
      return;
    }
    F.focus(r);
    if (F.full(r)) {
      F.jiggle(f.el, "farm-shake"); // that's enough: it stays on the plant
      return;
    }
    F.add(r);
    f.picked = true;
    await F.fly(THINGS[f.kind].img, f.el, load, { size: f.el.getBoundingClientRect().width, ms: 480 });
    f.el.classList.add("picked");
    const im = document.createElement("img");
    im.src = stamp(THINGS[f.kind].img);
    im.alt = "";
    im.className = `farm-in-basket ${tint(f.kind, f.colour)}`.trim();
    load.appendChild(im);
    F.jiggle(basket);
  }

  await done;
  await F.finish(async () => {
    planted.forEach((p) => F.jiggle(p.plant.el));
    await F.sleep(F.T(700));
    F.jiggle(basket);
  });
}

/** What each fruit on a plant looks like (colours from L3, sizes at L4). */
function fruitLooks(kind, lv) {
  const four = [0, 1, 2, 3];
  if (kind === "tomato") return four.map((k) => ({ colour: lv >= 3 && k % 2 ? "green" : "red" }));
  if (kind === "chilli") return four.map((k) => ({ colour: lv >= 3 && k % 2 ? "red" : "green" }));
  if (kind === "mango") return four.map((k) => ({ size: lv >= 4 && k % 2 ? "small" : "big" }));
  return four.map(() => ({}));
}
/** Does a fruit fit an ask (its kind, and its colour or size when the ask names one)? */
function fits(f, p) {
  if (f.kind !== p.kind) return false;
  if (p.mods.includes("red") && f.colour !== "red") return false;
  if (p.mods.includes("green") && f.colour !== "green") return false;
  if (p.mods.includes("big") && f.size !== "big") return false;
  if (p.mods.includes("small") && f.size !== "small") return false;
  return true;
}
/** Her pick asks: which planted plant, how many, and from L3 which colour or size. */
function pickAsks(lv, planted, F) {
  const kinds = F.shuffle(planted.map((p) => p.kind)).slice(0, lv >= 3 ? 2 : 1);
  return kinds.map((kind) => {
    let mods = [];
    if (lv >= 3 && (kind === "tomato" || kind === "chilli")) mods = [F.pick(["red", "green"])];
    if (lv >= 4 && kind === "mango") mods = [F.pick(["big", "small"])];
    const avail = fruitLooks(kind, lv).filter((l) => fits(Object.assign({ kind }, l), { kind, mods })).length;
    const n = lv === 1 ? 1 : Math.min(avail, lv === 2 ? 2 + Math.floor(F.rng() * 2) : 1 + Math.floor(F.rng() * avail));
    return { kind, n, mods };
  });
}
function fruitPic(box, p) {
  const d = document.createElement("div");
  d.className = "farm-pic";
  const i = document.createElement("img");
  i.src = stamp(THINGS[p.kind].img);
  i.alt = "";
  i.className = `farm-pic-what ${tint(p.kind, p.mods.includes("green") ? "green" : p.mods.includes("red") ? "red" : null)}${p.mods.includes("small") ? " farm-small" : ""}`;
  d.appendChild(i);
  box.appendChild(d);
}
/** A fruit's colour as a tint of its one picture (placeholder: the green tomato and the red chilli are recoloured). */
function tint(kind, colour) {
  if (kind === "tomato" && colour === "green") return "farm-tint-green";
  if (kind === "chilli" && colour === "red") return "farm-tint-red";
  return "";
}

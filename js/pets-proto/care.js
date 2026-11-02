/*
 * Look after the animals (prototype, proto-pets 2 Nov 2026; build/reports/designs/adoption-centre.md §3 stage A, its critique).
 *
 * Hannah Mami's yard: the animals sit on mats on the long care counter; along its front the four tools, always all four, always in
 * the same places: the corn basket (feed), the tub (wash), the brush, the bed. THE SENTENCE LAYOUT (proto brief, 2 Nov): she says
 * one care at a time, big in her box ("Kutro dho!": wash the dog), and under her the word tiles: Animals (every animal on the
 * counter) and Looking after (the four cares, the tools' pictures); no tile glows for the answer.
 * THE SHARED GIVE-TO TAP: tap the tool (it lifts; tap it again to put it back), then the animal. Then the care, by hand:
 *   FEED   a cob flies into the animal's bowl; from L2 tap the corn (or the animal) for each cob she asks for; the count ticks at
 *          its number and an extra cob doesn't land; the animal eats.
 *   WASH   the tub comes to the animal; tap it to scrub (bubbles); then the jug: the rinse, and the animal shakes.
 *   BRUSH  a track along its back: drag the brush end to end, three strokes; it fluffs up.
 *   BED    the bed comes to it; tap the blanket: it curls up and sleeps (a sleeping animal stays askable: it wakes for its care).
 * A wrong tool or a wrong animal: a funny wobble, the tool goes back, her line again (the instruction ticks plain).
 *   L1  the dog and the ant; feed or wash, drawn at random (repeats allowed); the brush and the bed are on the counter, not live: 4 asks
 *   L2  three of dog, ant, rabbit, bee; all four cares; feed says how many cobs (1-3); a care rarely twice in a row: 5 asks
 *   L3  the cat joins; "the cat is hungry" (feed) and "the cat is sleepy" (bed) as well as the commands: 6 asks
 *   L4  the big and the small rabbit side by side ("brush the small rabbit"): 6 asks
 * Not built: Ali's turn (the speaking moment), the funny per-animal misses and eats (one wobble and one bounce for all), "not",
 * the zoom for the wash and the brush, the dog's shake spraying the screen (drops fall round it instead).
 */
import { ANIMALS, TOOLS, PROPS } from "./art.js";
import { yard, matXs, animal } from "./yard.js";

const CARE_LEX = { feed: "v.feed", wash: "v.wash", brush: "v.brush", bed: "v.put-to-bed" };
const TOOL_X = { feed: 0.14, wash: 0.38, brush: 0.62, bed: 0.86 };
const TOOL_H = { feed: 0.16, wash: 0.19, brush: 0.12, bed: 0.2 };

/** An animal kind's spec: the rabbit pair are the rabbit, big or small. */
export const specOf = (k) =>
  k === "rabbit-small" ? Object.assign({}, ANIMALS.rabbit, { base: "rabbit", mods: ["a.small"], h: 0.16, pair: "a.small" }) : k === "rabbit-big" ? Object.assign({}, ANIMALS.rabbit, { base: "rabbit", mods: ["a.big"], h: 0.31, pair: "a.big" }) : ANIMALS[k];
/** The animal as the engine's noun phrase. */
export const np = (k) => {
  const s = specOf(k);
  return s.mods ? { fn: "Item", kind: s.lex, mods: s.mods } : { fn: "Item", kind: s.lex };
};

export default async function care(F) {
  const lv = F.level;
  /* ----- who's on the counter, and her asks ----- */
  let kinds;
  if (lv === 1) kinds = ["dog", "ant"];
  else if (lv === 2) kinds = F.shuffle(["dog", "ant", "rabbit", "bee"]).slice(0, 3);
  else if (lv === 3) kinds = ["cat", ...F.shuffle(["dog", "ant", "rabbit", "bee"]).slice(0, 2)];
  else kinds = ["rabbit-small", "rabbit-big", F.pick(["dog", "ant", "bee", "cat"])];
  kinds = F.shuffle(kinds);
  const cares = lv === 1 ? ["feed", "wash"] : ["feed", "wash", "brush", "bed"];
  const asks = [];
  const sleeping = new Set();
  let last = null;
  for (let i = 0; i < [4, 5, 6, 6][lv - 1]; i++) {
    let c = null;
    let k = null;
    for (let t = 0; t < 60; t++) {
      c = F.pick(cares);
      k = lv === 4 && F.rng() < 0.6 ? F.pick(["rabbit-small", "rabbit-big"]) : F.pick(kinds);
      if (lv >= 2 && c === last && F.rng() > 0.25) continue; // (a care again: about one ask in four)
      if (c === "bed" && sleeping.has(k)) continue; // (only bed isn't asked of an animal already asleep)
      break;
    }
    if (c === "bed") sleeping.add(k);
    else sleeping.delete(k);
    last = c;
    const n = c === "feed" && lv >= 2 ? 1 + Math.floor(F.rng() * 3) : 1;
    const feel = lv >= 3 && (c === "feed" || c === "bed") && F.rng() < 0.5 ? (c === "feed" ? "hungry" : "sleepy") : null;
    asks.push({ care: c, k, n, feel });
  }

  /* ----- the scene ----- */
  yard(F);
  const xs = matXs(kinds.length);
  const animals = {};
  kinds.forEach((k, i) => (animals[k] = animal(F, k, specOf(k), xs[i])));
  const tools = {};
  for (const c of Object.keys(TOOLS)) {
    const t = F.put(`pt-tool pt-tool-${c}`, { x: TOOL_X[c], y: 0.985, h: TOOL_H[c], img: TOOLS[c].img, tag: "button" });
    t.setAttribute("aria-label", c);
    t.dataset.care = c;
    if (!cares.includes(c)) {
      t.classList.add("off"); // (L1: on the counter, not live)
      t.disabled = true;
    }
    tools[c] = t;
  }

  /* ----- her instructions: one row each ----- */
  const lineOf = (a) => {
    if (a.feel) return { fn: a.feel === "hungry" ? "TheXIsHungry" : "TheXIsSleepy", x: np(a.k) };
    const cmd = { fn: "Command", verb: CARE_LEX[a.care], obj: np(a.k) };
    if (a.care === "feed" && lv >= 2) return [cmd, { fn: "Command", verb: "v.give", obj: { fn: "Item", kind: "n.corn-on-the-cob", n: a.n } }];
    return cmd;
  };
  const tileKey = (k) => (specOf(k).pair ? k : k);
  let held = null;
  const rows = asks.map((a, i) =>
    F.row({
      key: `${a.care}-${a.k}-${i}`,
      line: lineOf(a),
      word: lineOf(a),
      need: a.n,
      tiles: [tileKey(a.k), a.feel || a.care],
      target: () => (held === a.care ? animals[a.k] : tools[a.care]),
      data: a,
    })
  );
  const animalTile = (k) => {
    const s = specOf(k);
    return { key: k, word: np(k), lex: s.pair || s.lex, picture: s.pair ? (box) => box.insertAdjacentHTML("beforeend", `<img class="pt-tilepic ${k}" src="${F.stampUrl(s.img)}" alt="">`) : s.img };
  };
  const plain = kinds.filter((k) => !specOf(k).pair);
  const groups = [
    { label: { fn: "Item", kind: "n.animals" }, tiles: [...(lv === 4 ? [{ pair: [animalTile("rabbit-small"), animalTile("rabbit-big")] }] : []), ...plain.map(animalTile)] },
    { label: { fn: "Item", kind: "n.looking-after" }, tiles: cares.map((c) => ({ key: c, word: { fn: "Command", verb: CARE_LEX[c] }, lex: CARE_LEX[c], picture: TOOLS[c].img })) },
  ];
  // (no Feelings group: a third group squeezed every tile picture to nothing at 1280x665; hungry and sleepy are heard in her line only)
  F.sentence(groups);

  /* ----- the give-to tap ----- */
  let active = null; // a care under way: {care, el, row, ...}
  const paint = () => Object.entries(tools).forEach(([c, t]) => t.classList.toggle("sel", held === c));
  for (const [c, t] of Object.entries(tools))
    F.on(t, "click", () => {
      F.acted();
      if (active) {
        if (active.onTool) active.onTool(c, t);
        return;
      }
      held = held === c ? null : c; // (tap it again: it goes back)
      paint();
      if (held) F.jiggle(t);
    });
  for (const [k, el] of Object.entries(animals))
    F.on(el, "click", () => {
      F.acted();
      if (active) {
        if (active.el === el && active.onAnimal) active.onAnimal();
        else F.jiggle(el);
        return;
      }
      const r = F.current();
      if (!r) return;
      if (!held) {
        F.jiggle(el); // (nothing in hand: a happy bounce, nothing marked)
        return;
      }
      if (k !== r.data.k || held !== r.data.care) {
        F.oops(r, el); // a funny wobble; the tool goes back; her line again
        held = null;
        paint();
        return;
      }
      const c = held;
      held = null;
      paint();
      if (el.classList.contains("asleep")) wake(el);
      ({ feed, wash, brush, bed })[c](r, el);
    });

  const wake = (el) => {
    el.classList.remove("asleep");
    const b = el.parentNode.querySelector(`.pt-blanket[data-k="${el.dataset.k}"]`);
    if (b) b.remove();
    F.jiggle(el);
  };
  const xOf = (el) => Number(el.style.getPropertyValue("--x"));
  const yOf = (el) => Number(el.style.getPropertyValue("--y"));
  const hOf = (el) => Number(el.style.getPropertyValue("--h"));
  const done = (fn) => {
    active = null;
    if (fn) fn();
  };

  /* ----- FEED: cobs into its bowl; the count ticks at its number ----- */
  function feed(r, el) {
    const bowl = F.put("pt-bowl", { x: xOf(el) + hOf(el) * 0.42, y: yOf(el) + 0.05, h: 0.075, img: PROPS.bowl, z: 6 });
    const add = async () => {
      if (F.full(r)) {
        F.jiggle(bowl, "pt-shake"); // (an extra cob doesn't land)
        return;
      }
      const ticked = F.add(r);
      if (ticked) active.onAnimal = active.onTool = () => {}; // (counted: nothing more lands)
      const cob = document.createElement("img");
      cob.src = F.stampUrl(PROPS.cob);
      cob.className = "pt-cob";
      cob.alt = "";
      cob.style.setProperty("--i", String(r.got - 1));
      await F.fly(PROPS.cob, tools.feed, bowl, { size: tools.feed.getBoundingClientRect().height * 0.5, ms: 420 });
      bowl.appendChild(cob);
      if (ticked) {
        el.classList.add("eat");
        F.jiggle(el);
        await F.sleep(F.T(1100));
        el.classList.remove("eat");
        bowl.remove();
        tools.feed.classList.remove("lift");
        done();
      }
    };
    active = { care: "feed", el, row: r, onAnimal: add, onTool: (c) => (c === "feed" ? add() : F.jiggle(tools[c], "pt-shake")) };
    tools.feed.classList.add("lift");
    add();
  }

  /* ----- WASH: the tub comes; scrub (bubbles); the jug rinses; a shake ----- */
  async function wash(r, el) {
    tools.wash.classList.add("away");
    const tub = F.put("pt-tub", { x: xOf(el), y: yOf(el) + 0.04, h: Math.max(0.11, hOf(el) * 0.5), img: TOOLS.wash.img, z: 7 });
    let jug = null;
    let scrubs = 0;
    active = {
      care: "wash",
      el,
      row: r,
      onAnimal: () => {
        scrubs++;
        for (let i = 0; i < 3; i++) {
          const b = document.createElement("span");
          b.className = "pt-bubble";
          b.style.left = `${15 + F.rng() * 70}%`;
          b.style.top = `${10 + F.rng() * 60}%`;
          el.appendChild(b);
        }
        F.jiggle(el);
        if (!jug) {
          jug = F.put("pt-jug", { x: xOf(el) + hOf(el) * 0.55 + 0.05, y: yOf(el) - 0.02, h: 0.11, img: PROPS.jug, tag: "button", z: 8 });
          jug.setAttribute("aria-label", "jug");
          if (lv === 1) jug.classList.add("sel"); // (L1: the next step of a care already chosen, never which care)
          F.on(jug, "click", rinse);
        }
      },
    };
    F.teach("scrub", () => el);
    async function rinse() {
      F.acted();
      if (!active || active.el !== el) return;
      jug.classList.add("pour");
      for (let i = 0; i < 8; i++) {
        const d = document.createElement("span");
        d.className = "pt-drop";
        d.style.left = `${F.rng() * 100}%`;
        d.style.animationDelay = `${F.rng() * 0.3}s`;
        el.appendChild(d);
      }
      el.querySelectorAll(".pt-bubble").forEach((b) => b.remove());
      await F.sleep(F.T(500));
      F.jiggle(el, "pt-shake");
      active = null;
      F.add(r);
      await F.sleep(F.T(700));
      el.querySelectorAll(".pt-drop").forEach((d) => d.remove());
      tub.remove();
      jug.remove();
      tools.wash.classList.remove("away");
    }
    await F.fly(TOOLS.wash.img, tools.wash, tub, { size: tub.getBoundingClientRect().height, ms: 420 }).catch(() => {});
    void scrubs;
  }

  /* ----- BRUSH: a track along its back; drag the brush end to end, three strokes ----- */
  function brush(r, el) {
    tools.brush.classList.add("away");
    const w = Math.max(0.16, hOf(el) * 0.9);
    const track = F.put("pt-track wide", { x: xOf(el), y: yOf(el) - hOf(el) * 0.92, h: 0.07, w, z: 9 });
    track.innerHTML = `<i class="pt-track-line"></i><span class="pt-strokes"><b></b><b></b><b></b></span><img class="pt-brush" src="${F.stampUrl(TOOLS.brush.img)}" alt="" draggable="false">`;
    const br = track.querySelector(".pt-brush");
    const pips = track.querySelectorAll(".pt-strokes b");
    let strokes = 0;
    let drag = false;
    const at = (ev) => {
      const b = track.getBoundingClientRect();
      return Math.max(0, Math.min(1, (ev.clientX - b.left) / b.width));
    };
    const setX = (f) => br.style.setProperty("--f", String(f));
    setX(0);
    active = { care: "brush", el, row: r, onAnimal: () => F.jiggle(br) };
    F.teach("brush", () => track);
    F.on(track, "pointerdown", (ev) => {
      F.acted();
      drag = true;
      br.classList.remove("back");
      try {
        track.setPointerCapture(ev.pointerId);
      } catch (e) {
        /* fine */
      }
      setX(Math.min(at(ev), 0.25));
    });
    F.on(track, "pointermove", (ev) => {
      if (!drag) return;
      const f = at(ev);
      setX(f);
      if (f >= 0.9) {
        drag = false;
        stroke();
      }
    });
    const up = () => {
      if (!drag) return;
      drag = false;
      br.classList.add("back");
      setX(0);
    };
    F.on(track, "pointerup", up);
    F.on(track, "pointercancel", up);
    async function stroke() {
      strokes++;
      pips[strokes - 1].classList.add("on");
      el.classList.add("fluff");
      F.jiggle(el);
      br.classList.add("back");
      setX(0);
      if (strokes < 3) return;
      active = null;
      F.add(r);
      await F.sleep(F.T(900));
      el.classList.remove("fluff");
      track.remove();
      tools.brush.classList.remove("away");
    }
  }

  /* ----- BED: the bed comes; tap the blanket; it curls up and sleeps ----- */
  async function bed(r, el) {
    tools.bed.classList.add("away");
    const b = F.put("pt-bed", { x: xOf(el), y: yOf(el) + 0.05, h: Math.max(0.12, hOf(el) * 0.55), img: TOOLS.bed.img, tag: "button", z: 7 });
    b.setAttribute("aria-label", "blanket");
    active = { care: "bed", el, row: r, onAnimal: () => tuck() };
    F.teach("tuck", () => b);
    F.on(b, "click", () => {
      F.acted();
      tuck();
    });
    let tucked = false;
    async function tuck() {
      if (tucked) return;
      tucked = true;
      el.classList.add("asleep");
      const bl = F.put("pt-blanket", { x: xOf(el), y: yOf(el) + 0.01, h: hOf(el) * 0.28, w: hOf(el) * 0.5, z: 8 });
      bl.dataset.k = el.dataset.k;
      bl.innerHTML = '<span class="pt-zz"></span>';
      active = null;
      F.add(r);
      await F.sleep(F.T(700));
      b.remove();
      tools.bed.classList.remove("away");
    }
    await F.fly(TOOLS.bed.img, tools.bed, b, { size: b.getBoundingClientRect().height, ms: 420 }).catch(() => {});
  }

  await F.ask({ guide: "care-head" });
  F.begin();
  F.teach("tool", () => tools[rows[0].data.care]);
  await new Promise((res) => F.whenAll(res));
  await F.finish(async () => {
    Object.values(animals).forEach((el) => F.jiggle(el));
    await F.sleep(F.T(500));
  });
}

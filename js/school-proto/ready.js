/*
 * Getting ready (prototype, proto-school 2 Nov 2026; build/reports/designs/do-it-engine.md B1, its critique; games at a glance §5).
 *
 * A school morning at Nani's: Ali and his two little cousins (placeholder names, to record) stand in a row in pyjamas with
 * bed-hair (their places shuffled each round). THE SENTENCE LAYOUT (proto brief, 2 Nov): Nani calls one child and one job at a
 * time ("Ali! Hath dho!": the name, then the job; the engine, its missing words grey to record), big in her box; under her the
 * word tiles: Children (the three) and Jobs (a tile for every job the room's things can do, asked or not). Tap the thing: it
 * flies to the child she named, who does it (combed: the bed-hair springs flat; teeth: a foam moustache, wiped at once; the
 * bowl: a few happy bounces; soap: clean hands; the flannel: a clean face); the instruction ticks (gold first try).
 * A wrong thing: the child gives a puzzled shake (never a frown), the thing stays, Nani says it again (it ticks plain). Food is
 * never played with: a wrong tap on a bowl is "later". Calls jump between the children at random (never the routine's order).
 *   L1  brush your teeth, comb your hair, eat your breakfast: each to every child (9 calls); things: toothbrushes, comb, bowls
 *   L2  adds wash your hands (the soap) and wash your face (the flannel): both washes for every child, plus three L1 calls
 *   L3, L4  as L2 (the tiles' words dot out on the ladder: ?ladder=5). Not built: socks and shoes, "not your face!", "first ...
 *   then ...", get dressed, the mirror and the twirl into uniform, the bus horn.
 */
import { FAMILY, THINGS } from "./art.js";

const stamp = (p) => (typeof window !== "undefined" && typeof window.njgV === "function" ? window.njgV(p) : p);
const KIDS = ["ali", "zahra", "hasan"];
// each job: the thing tapped, the line's job part (an engine meaning or a data/school-proto.json key), its tile's word
const JOBS = {
  teeth: { thing: "toothbrush", line: "ready-teeth", tile: { fn: "Item", kind: "n.tooth", number: "pl" }, lex: "n.tooth" },
  hair: { thing: "comb", line: "ready-hair", tile: { fn: "Item", kind: "n.hair" }, lex: "n.hair" },
  breakfast: { thing: "bowl", line: { fn: "Command", verb: "v.eat", obj: { fn: "Item", kind: "n.breakfast" } }, tile: { fn: "Item", kind: "n.breakfast" }, lex: "n.breakfast" },
  hands: { thing: "soap", line: { fn: "Command", verb: "v.wash", obj: { fn: "Item", kind: "n.hand", number: "pl" } }, tile: { fn: "Item", kind: "n.hand", number: "pl" }, lex: "n.hand" },
  face: { thing: "flannel", line: { fn: "Command", verb: "v.wash", obj: { fn: "Item", kind: "n.face" } }, tile: { fn: "Item", kind: "n.face" }, lex: "n.face" },
};

export default async function ready(F) {
  const lv = F.level;
  const jobs = lv === 1 ? ["teeth", "hair", "breakfast"] : ["teeth", "hair", "breakfast", "hands", "face"];
  // the calls: L1 every job to every child; L2+ both washes to every child, plus three of the L1 jobs
  let calls = [];
  if (lv === 1) for (const k of KIDS) for (const j of jobs) calls.push({ kid: k, job: j });
  else {
    for (const k of KIDS) calls.push({ kid: k, job: "hands" }, { kid: k, job: "face" });
    const l1 = F.shuffle(KIDS.flatMap((k) => ["teeth", "hair", "breakfast"].map((j) => ({ kid: k, job: j })))).slice(0, 3);
    calls = calls.concat(l1);
  }
  calls = F.shuffle(calls);

  /* ----- the scene: the children's room in the morning ----- */
  F.scene.insertAdjacentHTML("beforeend", '<div class="sp-wall"></div><div class="sp-floor"></div>');
  const shelfLeft = F.rng() < 0.5;
  const sx = shelfLeft ? 0.11 : 0.89;
  const nx = shelfLeft ? 0.89 : 0.11;
  F.put("sp-shelf wide", { x: sx, y: 0.5, h: 0.035, w: 0.18 });
  F.put("sp-shelf wide", { x: sx, y: 0.8, h: 0.035, w: 0.18 });
  const things = {};
  const putThing = (name, x, y, h) => {
    const t = THINGS[name];
    const el = F.put(`sp-obj sp-${name}`, { x, y, h, img: t.img, tag: "button" });
    el.setAttribute("aria-label", name);
    el.dataset.thing = name;
    things[name] = el;
    return el;
  };
  putThing("toothbrush", sx - 0.045, 0.5, 0.15);
  putThing("comb", sx + 0.045, 0.5, 0.1);
  if (lv >= 2) {
    putThing("soap", sx - 0.045, 0.8, 0.08);
    putThing("flannel", sx + 0.045, 0.8, 0.1);
  }
  // Nani's tray of bowls (by the door)
  F.put("sp-tray wide", { x: nx, y: 0.66, h: 0.04, w: 0.17 });
  const bowls = [];
  for (let i = 0; i < 3; i++) {
    const b = F.put("sp-obj sp-bowl", { x: nx + (i - 1) * 0.05, y: 0.635, h: 0.08, img: THINGS.bowl.img, tag: "button" });
    b.dataset.thing = "bowl";
    b.setAttribute("aria-label", "bowl");
    bowls.push(b);
  }
  // the three children, places shuffled
  const order = F.shuffle(KIDS);
  const kidEl = {};
  order.forEach((k, i) => {
    const tall = k === "ali" ? 0.62 : k === "zahra" ? 0.5 : 0.44;
    const el = F.put("sp-kid", { x: 0.32 + i * 0.18, y: 0.95, h: tall, html: `<span class="sp-pj"></span><img class="sp-face" src="${stamp(FAMILY[k].face)}" alt=""><span class="sp-hair"></span><span class="sp-foam"></span>` });
    el.dataset.kid = k;
    kidEl[k] = el;
  });

  /* ----- Nani's calls: one row each ----- */
  const rows = calls.map((c, i) =>
    F.row({
      key: `c${i}`,
      line: [{ fn: "Call", x: FAMILY[c.kid].lex }, typeof JOBS[c.job].line === "string" ? { fn: "Say", x: lexOfLine(F, JOBS[c.job].line) } : JOBS[c.job].line],
      word: JOBS[c.job].tile,
      tiles: [c.kid, c.job],
      target: () => (c.job === "breakfast" ? bowls.find((b) => !b.classList.contains("used")) : things[JOBS[c.job].thing]),
      data: c,
    })
  );
  F.sentence([
    { label: { fn: "Item", kind: "n.children" }, tiles: KIDS.map((k) => ({ key: k, word: { fn: "Item", kind: FAMILY[k].lex }, lex: FAMILY[k].lex, picture: FAMILY[k].face })) },
    { label: { fn: "Item", kind: "n.jobs" }, tiles: jobs.map((j) => ({ key: j, word: JOBS[j].tile, lex: JOBS[j].lex, picture: THINGS[JOBS[j].thing].img || ((box) => box.insertAdjacentHTML("beforeend", `<span class="sp-obj sp-${JOBS[j].thing} sp-tilepic"></span>`)) })) },
  ]);

  async function doJob(c, el) {
    const kid = kidEl[c.kid];
    const src = el.querySelector("img") ? el.querySelector("img").getAttribute("src") : null;
    if (c.job === "breakfast") el.classList.add("used");
    await F.fly(src, el, kid, { size: el.getBoundingClientRect().height, ms: 460 });
    if (c.job === "hair") kid.classList.add("combed");
    if (c.job === "teeth") {
      kid.classList.add("foam");
      F.after(F.T(900), () => kid.classList.remove("foam"));
    }
    if (c.job === "breakfast") kid.classList.add("fed");
    F.jiggle(kid);
  }
  const all = Object.values(things).concat(bowls);
  all.forEach((el) =>
    F.on(el, "click", () => {
      F.acted();
      const r = F.current();
      if (!r) return;
      if (el.classList.contains("used")) return;
      const want = JOBS[r.data.job].thing;
      if (el.dataset.thing !== want) {
        // the named child looks puzzled (a shake); the thing stays; her call again
        F.jiggle(kidEl[r.data.kid], "sp-shake");
        F.oops(r, el);
        return;
      }
      F.add(r);
      doJob(r.data, el);
    })
  );

  await F.ask({ guide: "ready-head" });
  F.begin();
  F.teach("thing", () => rows[0].target());
  await new Promise((res) => F.whenAll(res));
  await F.finish(async () => {
    for (const k of KIDS) F.jiggle(kidEl[k]);
    await F.sleep(F.T(400));
  });
}

/** The phrase entry a data/school-proto.json line became (its alias school-proto.line.<key>). */
function lexOfLine(F, key) {
  const e = F.L.linearizer.lexOf(`school-proto.line.${key}`);
  return e ? e.id : key;
}

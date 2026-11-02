/*
 * Pick it up and put it back (proto-home, 2 Nov 2026; build/reports/designs/pick-it-up-put-it-back.md and its critique; the glance:
 * "Nana can't find his glasses or his cup. Nani says where they are, and you fetch them through the house. Then you put back what
 * Simba knocked over").
 *
 *   STAGE 1, WHERE IS IT? Nana sits in the sitting room of the doll's house. Nani says where his thing is ("Nana jo cup table je
 *   niche ai."). Tap a room: the camera eases in (a tap on a neighbour's edge goes there). Two identical copies, one on and one
 *   under the table, so only on or under decides. The right one flies through the house to Nana and its pip fills; the wrong one
 *   shakes and she says it again. Copies are never used up: each errand lays them out afresh.
 *   STAGE 2, PUT IT AWAY: the bedroom; things on the rug. Tap one, then one of the dotted rings (every ring the same, on and under
 *   every anchor; never used up). Right: it settles there. Wrong: it boings back and she says it again.
 *
 *   L1  the room lit for you (guided); one table; 2 errands, 3 put-aways (on or under the bedside table)
 *   L2  the room is heard too ("Nana's cup is in the kitchen. It's under the table."); a copy in another room as well; the
 *       put-aways have two anchors (the table and the bed)
 *   L3  as L2, the tile words dotted (past support); 3 errands
 *   L4  as L3 (big and small copies and "my"/"your" not built)
 */
import { NANA } from "./art.js";
import { house } from "./house.js";

const THINGS = {
  glasses: { lex: "n.glasses" },
  cup: { lex: "n.cup" },
  ball: { lex: "n.ball" },
  bag: { lex: "n.bag" },
};
const ROOMS_OF = { kitchen: "n.kitchen", bedroom: "n.bedroom" };
// the furniture in each room, in shares of the room: x (middle), y (foot), h (height), w
const TABLE = { x: 0.42, y: 0.9, h: 0.3, w: 0.36 };
const BED = { x: 0.78, y: 0.9, h: 0.28, w: 0.36 };

export default async function fetchGame(F) {
  const lv = F.level;
  const H = house(F, { onRoom: (id) => goRoom(id) });
  const item = (kind) => ({ fn: "Item", kind });
  const of = (k) => ({ fn: "Of", owner: item("pn.nana"), thing: item(THINGS[k].lex) });

  /* ----- the rooms: a table in the kitchen and the bedroom; the bed in the bedroom; Nana on the sofa ----- */
  const tables = {};
  for (const id of ["kitchen", "bedroom"]) {
    const room = H.room(id);
    tables[id] = F.put("hp-table wide", { ...TABLE, parent: room, html: '<span class="hp-leg"></span><span class="hp-leg hp-leg2"></span>' });
  }
  const bed = F.put("hp-bedx wide", { ...BED, parent: H.room("bedroom") });
  const bedroomRug = F.put("hp-rugx wide", { x: 0.32, y: 0.99, h: 0.06, w: 0.4, parent: H.room("bedroom") });
  const sitting = H.room("sitting");
  F.put("hp-sofa wide", { x: 0.55, y: 0.9, h: 0.3, w: 0.5, parent: sitting });
  const nana = F.put("hp-nana", { x: 0.55, y: 0.86, h: 0.62, img: NANA.body, parent: sitting, z: 3 });
  F.put("hp-th hp-th-glasses hp-nana-glasses", { x: 0.5, y: 0.6, h: 0.05, w: 0.08, parent: sitting, z: 4 }).classList.add("wide", "gone");

  /* ----- the errands (stage 1) and the put-aways (stage 2) ----- */
  const nErr = lv >= 3 ? 3 : 2;
  const errands = [];
  let last = null;
  for (let i = 0; i < nErr; i++) {
    const k = F.pick(["glasses", "cup"].filter((x) => x !== last));
    last = k;
    errands.push({ k, room: F.pick(Object.keys(ROOMS_OF)), rel: F.pick(["post.on", "post.under"]) });
  }
  const anchors = lv >= 2 ? ["table", "bed"] : ["table"];
  const puts = F.shuffle(["ball", "bag", "cup"]).map((k) => ({ k, anchor: F.pick(anchors), rel: F.pick(["post.on", "post.under"]) }));

  let copies = [];
  const fetchRows = errands.map((e, i) =>
    F.row({
      key: `fetch-${i}`,
      line: { fn: "Say", x: "phrase.where-is-it" },
      word: item(THINGS[e.k].lex),
      tiles: [],
      target: () => (H.at !== e.room ? H.room(e.room) : (copies.find((c) => c.right) || {}).el),
      data: {
        e,
        before: (r) => {
          const said = { fn: "LocatedAt", thing: of(e.k), anchor: item("n.table"), rel: e.rel };
          r.line = F.say(lv >= 2 ? [{ fn: "LocatedAt", thing: of(e.k), anchor: item(ROOMS_OF[e.room]), rel: "post.in" }, { fn: "LocatedAt", thing: item(THINGS[e.k].lex), anchor: item("n.table"), rel: e.rel }] : said);
          if (i === 0) r.line = [F.lineOf("pk-head")].concat(r.line);
          r.tiles = [`t-${e.k}`, e.rel].concat(lv >= 2 ? [`r-${e.room}`] : []);
          layCopies(e);
          if (H.at) H.zoom(null);
          // (L1: the room is guided: it glows, the camera waits for the tap)
          H.light(lv === 1 ? e.room : null, true);
        },
      },
    })
  );
  const putRows = puts.map((p, i) =>
    F.row({
      key: `put-${i}`,
      line: { fn: "Say", x: "phrase.where-is-it" },
      word: item(THINGS[p.k].lex),
      tiles: [],
      target: () => (held && held.k === p.k ? ringOf(p.anchor, p.rel) : (loose.find((x) => x.k === p.k && !x.done) || {}).el),
      data: {
        p,
        before: (r) => {
          const cmd = { fn: "PutAt", thing: item(THINGS[p.k].lex), anchor: item(p.anchor === "bed" ? "n.bed" : "n.table"), rel: p.rel };
          r.line = i === 0 ? [F.lineOf("pk-put"), F.say(cmd)] : F.say(cmd);
          r.tiles = [`t-${p.k}`, p.rel].concat(lv >= 2 ? [`f-${p.anchor}`] : []);
          if (H.at !== "bedroom") startPutting();
        },
      },
    })
  );

  /* ----- the word tiles: every thing in the house's game, the two positions (a pair), the rooms and furniture from L2 ----- */
  const thingPic = (k) => (box) => {
    const s = document.createElement("span");
    s.className = `hp-tthing hp-th hp-th-${k}`;
    box.appendChild(s);
  };
  const relPic = (rel) => (box) => {
    const s = document.createElement("span");
    s.className = `hp-trel hp-trel-${rel === "post.on" ? "on" : "under"}`;
    s.innerHTML = '<i class="hp-trel-top"></i><i class="hp-trel-ball"></i>';
    box.appendChild(s);
  };
  const groups = [
    { label: { en: "Things" }, tiles: Object.keys(THINGS).map((k) => ({ key: `t-${k}`, id: THINGS[k].lex, word: item(THINGS[k].lex), lex: THINGS[k].lex, picture: thingPic(k) })) },
    { label: { en: "Where" }, tiles: [{ pair: ["post.on", "post.under"].map((rel) => ({ key: rel, id: rel, word: { fn: "Place", anchor: item("n.table"), rel }, lex: rel, picture: relPic(rel) })) }] },
  ];
  if (lv >= 2) {
    groups.push({ label: { en: "Rooms" }, tiles: Object.entries(ROOMS_OF).map(([id, lex]) => ({ key: `r-${id}`, id: lex, word: item(lex), lex, picture: (box) => roomPic(box, id) })) });
    groups[0].tiles.push(
      { key: "f-table", id: "n.table", word: item("n.table"), lex: "n.table", picture: thingPic("table") },
      { key: "f-bed", id: "n.bed", word: item("n.bed"), lex: "n.bed", picture: thingPic("bed") }
    );
  }
  F.sentence(groups);

  /* ----- stage 1: the copies, the rooms, the fetch ----- */
  function layCopies(e) {
    copies.forEach((c) => c.el.remove());
    copies = [];
    const add = (room, rel, right) => {
      const t = tables[room];
      const y = rel === "post.on" ? TABLE.y - TABLE.h + 0.005 : TABLE.y - 0.01;
      const el = F.put(`hp-copy hp-th hp-th-${e.k} wide`, { x: TABLE.x + (rel === "post.on" ? 0.04 : -0.05), y, h: 0.09, w: 0.12, parent: H.room(room), tag: "button", z: 6 });
      el.setAttribute("aria-label", e.k);
      const c = { el, room, rel, right };
      F.on(el, "click", (ev) => {
        ev.stopPropagation();
        pickCopy(c);
      });
      copies.push(c);
      return t;
    };
    add(e.room, "post.on", e.rel === "post.on");
    add(e.room, "post.under", e.rel === "post.under");
    if (lv >= 2) add(Object.keys(ROOMS_OF).find((x) => x !== e.room), F.pick(["post.on", "post.under"]), false);
  }
  function goRoom(id) {
    F.acted();
    const r = F.current();
    if (!r || stage !== 1) return;
    if (H.at === id) return;
    if (id === "sitting" || id === "bathroom" || id === "ali") {
      // (nothing of his there now: the room is shown, the camera eases back out)
      F.jiggle(H.room(id));
      return;
    }
    H.light(null);
    H.zoom(id);
  }
  async function pickCopy(c) {
    F.acted();
    const r = F.current();
    if (!r || stage !== 1 || H.at !== c.room) return;
    if (!c.right) return F.oops(r, c.el);
    const e = r.data.e;
    c.el.classList.add("gone");
    await H.zoom(null, { ms: 500 });
    await F.fly(null, c.el, nana, { cls: `hp-th hp-th-${e.k}`, size: 40, ms: 800 });
    F.jiggle(nana);
    if (e.k === "glasses") F.root.querySelector(".hp-nana-glasses").classList.remove("gone");
    F.add(r);
    if (r === fetchRows[fetchRows.length - 1]) stage = 2;
  }

  /* ----- stage 2: the bedroom; tap a thing, then a ring ----- */
  const rings = {};
  const ringPos = { "table|post.on": [TABLE.x, TABLE.y - TABLE.h - 0.005], "table|post.under": [TABLE.x, TABLE.y - 0.01], "bed|post.on": [BED.x, BED.y - BED.h - 0.005], "bed|post.under": [BED.x, BED.y - 0.01] };
  const ringOf = (a, rel) => rings[`${a}|${rel}`];
  let loose = [];
  let held = null;
  function startPutting() {
    stage = 2;
    copies.forEach((c) => c.el.remove());
    copies = [];
    H.zoom("bedroom");
    const room = H.room("bedroom");
    for (const a of anchors)
      for (const rel of ["post.on", "post.under"]) {
        const [x, y] = ringPos[`${a}|${rel}`];
        const el = F.put("hp-ring", { x, y, h: 0.11, parent: room, tag: "button", z: 7 });
        el.setAttribute("aria-label", `${rel} ${a}`);
        F.on(el, "click", (ev) => {
          ev.stopPropagation();
          drop(a, rel, el);
        });
        rings[`${a}|${rel}`] = el;
      }
    loose = puts.map((p, i) => {
      const el = F.put(`hp-copy hp-th hp-th-${p.k} wide`, { x: 0.18 + i * 0.12, y: 0.985, h: 0.09, w: 0.1, parent: room, tag: "button", z: 8 });
      const o = { k: p.k, el, done: false, home: [0.18 + i * 0.12, 0.985] };
      F.on(el, "click", (ev) => {
        ev.stopPropagation();
        F.acted();
        if (o.done) return F.jiggle(el);
        held = o;
        loose.forEach((x) => x.el.classList.toggle("sel", x === o));
        F.jiggle(el);
      });
      return o;
    });
    F.teach("thing", () => loose[0] && loose[0].el);
  }
  const placed = {};
  function drop(a, rel, ringEl) {
    F.acted();
    const r = F.current();
    if (!r || stage !== 2 || !held) return F.jiggle(ringEl);
    const p = r.data.p;
    const o = held;
    held = null;
    o.el.classList.remove("sel");
    if (o.k !== p.k || a !== p.anchor || rel !== p.rel) {
      // it boings back to the rug (a funny bounce, never a frown); her line again
      F.oops(r, o.el);
      return;
    }
    const key = `${a}|${rel}`;
    const n = (placed[key] = (placed[key] || 0) + 1);
    const [x, y] = ringPos[key];
    o.el.style.setProperty("--x", String(x - 0.04 + (n - 1) * 0.06));
    o.el.style.setProperty("--y", String(y));
    o.done = true;
    F.after(F.T(650), () => F.jiggle(o.el));
    F.add(r);
  }

  let stage = 1;
  await F.sleep(F.T(400));
  await F.ask({});
  F.begin();
  F.teach("room", () => F.current() && F.current().target());
  void bed;
  void bedroomRug;
  await new Promise((res) => F.whenAll(res));
  await F.finish(async () => {
    await H.zoom(null);
    F.jiggle(nana);
  });
}

function roomPic(box, id) {
  const s = document.createElement("span");
  s.className = `hp-troom hp-room-${id}`;
  s.innerHTML = '<span class="hp-wall"></span><span class="hp-floor"></span>';
  box.appendChild(s);
}

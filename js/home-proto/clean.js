/*
 * The clean-up (proto-home, 2 Nov 2026; build/reports/designs/clean-up-day.md and its critique; the glance: "the camera zooms into
 * the bathroom, and Nani asks you to tidy it: switch off the light, turn off the tap, close the curtains").
 *
 *   One instruction at a time in Nani's box, the word tiles under her (every thing in the bathroom; from L2 the doing words as
 *   pairs: on and off). Tap the thing she names: it flips (on to off, open to closed) like a toy and its pip fills. To clean: the
 *   broom, then the dirty spot. To put away (L2): the soap, then its dish. A wrong thing does its joke, then flips back by itself,
 *   and she says it again. At the end, with the light off and the curtain closed, the room goes soft blue, Zazu's eyes shine in the
 *   laundry basket and he pops up; then Nani switches the light back on.
 *
 *   L1  one of each thing: switch off the light, close the curtain, turn off the tap, sweep (in a random order)
 *   L2  two lights and two taps in opposite states, so on or off decides; the soap
 *   L3  as L2, the tile words dotted (past support)
 *   L4  as L3 (the big tap, "all the lights", "first ... then" not built)
 */
import { CAT, PICS } from "./art.js";
import { house } from "./house.js";

export default async function clean(F) {
  const lv = F.level;
  const H = house(F, {});
  const room = H.room("bathroom");
  const item = (kind) => ({ fn: "Item", kind });
  const cmd = (verb, kind) => ({ fn: "Command", verb, obj: kind ? item(kind) : undefined });

  /* ----- the bathroom: the lights, the taps, the window's curtain, the broom, the dirt, the soap, the laundry basket ----- */
  const two = lv >= 2;
  const things = {};
  const flip = (key, cls, pos, on) => {
    const el = F.put(`hp-flip ${cls}${on ? " on" : ""} wide`, { ...pos, parent: room, tag: "button", z: 6, html: '<span class="hp-flip-in"></span>' });
    el.setAttribute("aria-label", key);
    things[key] = { key, el, on };
    return things[key];
  };
  F.put("hp-basin wide", { x: 0.3, y: 0.62, h: 0.12, w: 0.24, parent: room });
  F.put("hp-bath wide", { x: 0.66, y: 0.9, h: 0.2, w: 0.44, parent: room });
  room.insertAdjacentHTML("beforeend", '<div class="hp-window hp-bathwin"></div>');
  const basket = F.put("hp-laundry wide", { x: 0.92, y: 0.9, h: 0.17, w: 0.12, parent: room, z: 5 });
  // the lights: one hanging light (L1); two wall lights from L2, in opposite states
  if (two) {
    const firstOn = F.pick([true, false]);
    flip("lamp1", "hp-lamp", { x: 0.18, y: 0.32, h: 0.1, w: 0.1 }, firstOn);
    flip("lamp2", "hp-lamp", { x: 0.5, y: 0.32, h: 0.1, w: 0.1 }, !firstOn);
  } else flip("lamp1", "hp-lamp", { x: 0.45, y: 0.26, h: 0.12, w: 0.1 }, true);
  // the taps: the basin's (L1); and the bath's from L2, in opposite states
  if (two) {
    const firstOn = F.pick([true, false]);
    flip("tap1", "hp-tapx", { x: 0.3, y: 0.52, h: 0.08, w: 0.08 }, firstOn);
    flip("tap2", "hp-tapx", { x: 0.55, y: 0.72, h: 0.08, w: 0.08 }, !firstOn);
  } else flip("tap1", "hp-tapx", { x: 0.3, y: 0.52, h: 0.08, w: 0.08 }, true);
  const curtain = flip("curtain", "hp-curt", { x: 0.8, y: 0.6, h: 0.36, w: 0.22 }, true);
  const broom = F.put("hp-broom wide", { x: 0.07, y: 0.88, h: 0.5, w: 0.06, parent: room, tag: "button", z: 7 });
  const dirt = F.put("hp-dirt wide", { x: 0.42, y: 0.97, h: 0.05, w: 0.16, parent: room, tag: "button", z: 4 });
  const soap = two ? F.put("hp-soapx", { x: 0.22, y: 0.985, h: 0.06, img: PICS.soap, parent: room, tag: "button", z: 8 }) : null;
  const dish = two ? F.put("hp-dish wide", { x: 0.4, y: 0.5, h: 0.03, w: 0.1, parent: room, tag: "button", z: 6 }) : null;
  const zazu = F.put("hp-cat zazu hp-hidden", { x: 0.92, y: 0.8, h: 0.16, img: CAT.peek, parent: room, z: 4 });

  /* ----- the jobs: [verb, kind, the thing it acts on] ----- */
  const jobs = [];
  if (two) {
    const lv1 = F.pick(["lamp1", "lamp2"]);
    jobs.push({ verb: things[lv1].on ? "v.switch-off" : "v.switch-on", kind: "n.lamp", key: lv1, tiles: ["t-lamp", "d-switch"] });
    const tp = F.pick(["tap1", "tap2"]);
    jobs.push({ verb: things[tp].on ? "v.turn-off" : "v.turn-on", kind: "n.tap", key: tp, tiles: ["t-tap", "d-turn"] });
    jobs.push({ verb: "v.close", kind: "n.curtain", key: "curtain", tiles: ["t-curtain", "d-close"] });
    jobs.push({ verb: "v.sweep", kind: null, key: "dirt", tiles: ["d-sweep"] });
    jobs.push({ put: true, key: "soap", tiles: ["t-soap", "t-dish"] });
  } else {
    jobs.push({ verb: "v.switch-off", kind: "n.lamp", key: "lamp1", tiles: ["t-lamp"] });
    jobs.push({ verb: "v.turn-off", kind: "n.tap", key: "tap1", tiles: ["t-tap"] });
    jobs.push({ verb: "v.close", kind: "n.curtain", key: "curtain", tiles: ["t-curtain"] });
    jobs.push({ verb: "v.sweep", kind: null, key: "dirt", tiles: [] });
  }
  const order = F.shuffle(jobs);
  const rows = order.map((j, i) =>
    F.row({
      key: `job-${i}-${j.key}`,
      line: i === 0 ? [{ fn: "Say", x: "home-proto.line.cl-head" }, j.put ? putLine() : cmd(j.verb, j.kind)] : j.put ? putLine() : cmd(j.verb, j.kind),
      word: j.put ? item("n.soap") : cmd(j.verb, j.kind),
      tiles: j.tiles.slice(),
      target: () => (j.key === "dirt" ? (held === "broom" ? dirt : broom) : j.put ? (held === "soap" ? dish : soap) : things[j.key].el),
      data: { j },
    })
  );
  function putLine() {
    return { fn: "PutAt", thing: item("n.soap"), anchor: item("n.soap-dish"), rel: "post.on" };
  }
  // (her first line: the engine's id for the placeholder line, through its alias)
  const head = F.L.linearizer.lexOf("home-proto.line.cl-head");
  if (head) rows[0].line = [F.say({ fn: "Say", x: head.id }), F.say(order[0].put ? putLine() : cmd(order[0].verb, order[0].kind))];

  /* ----- the word tiles: every thing in the room; from L2 the doing words as on-and-off pairs ----- */
  const pic = (cls) => (box) => {
    const s = document.createElement("span");
    s.className = `hp-tclean ${cls}`;
    s.innerHTML = '<span class="hp-flip-in"></span>';
    box.appendChild(s);
  };
  const thingTiles = [
    { key: "t-lamp", id: "n.lamp", word: item("n.lamp"), lex: "n.lamp", picture: pic("hp-lamp on") },
    { key: "t-tap", id: "n.tap", word: item("n.tap"), lex: "n.tap", picture: pic("hp-tapx") },
    { key: "t-curtain", id: "n.curtain", word: item("n.curtain"), lex: "n.curtain", picture: pic("hp-curt on") },
    { key: "t-broom", id: "n.broom", word: item("n.broom"), lex: "n.broom", picture: pic("hp-broom") },
  ];
  if (two) thingTiles.push({ key: "t-soap", id: "n.soap", word: item("n.soap"), lex: "n.soap", picture: PICS.soap }, { key: "t-dish", id: "n.soap-dish", word: item("n.soap-dish"), lex: "n.soap-dish", picture: pic("hp-dish") });
  const groups = [{ label: { en: "Things" }, tiles: thingTiles }];
  if (two) {
    const verbTile = (v, key, cls) => ({ key, id: v, word: { fn: "Command", verb: v }, lex: v, picture: pic(cls) });
    groups.push({
      label: { en: "Doing" },
      tiles: [
        // (each pair beside a single tile, so the rows pack: three to a row)
        { pair: [verbTile("v.switch-on", "d-switch-on", "hp-lamp hp-plain on"), verbTile("v.switch-off", "d-switch-off", "hp-lamp hp-plain")] },
        verbTile("v.close", "d-close", "hp-curt hp-plain"),
        { pair: [verbTile("v.turn-on", "d-turn-on", "hp-tapx hp-plain on"), verbTile("v.turn-off", "d-turn-off", "hp-tapx hp-plain")] },
        verbTile("v.sweep", "d-sweep", "hp-broom"),
      ],
    });
    // (a job's doing-word tile: the pair's half it says)
    rows.forEach((r) => {
      r.tiles = r.tiles.map((t) => (t === "d-switch" ? (r.data.j.verb === "v.switch-on" ? "d-switch-on" : "d-switch-off") : t === "d-turn" ? (r.data.j.verb === "v.turn-on" ? "d-turn-on" : "d-turn-off") : t));
    });
  } else rows.forEach((r) => r.data.j.key === "dirt" && (r.tiles = []));
  F.sentence(groups);

  /* ----- play ----- */
  let held = null;
  const setOn = (t, on) => {
    t.on = on;
    t.el.classList.toggle("on", on);
  };
  for (const t of Object.values(things))
    F.on(t.el, "click", (ev) => {
      ev.stopPropagation();
      F.acted();
      const r = F.current();
      if (!r) return;
      const j = r.data.j;
      setOn(t, !t.on);
      F.jiggle(t.el);
      if (j.key === t.key && !j.put) {
        F.add(r);
        return;
      }
      // the wrong thing: its joke (it flips), then it flips back by itself; her line again
      F.oops(r, t.el);
      F.after(F.T(900), () => setOn(t, !t.on));
    });
  F.on(broom, "click", (ev) => {
    ev.stopPropagation();
    F.acted();
    held = held === "broom" ? null : "broom";
    broom.classList.toggle("sel", held === "broom");
    if (soap) soap.classList.remove("sel");
  });
  F.on(dirt, "click", (ev) => {
    ev.stopPropagation();
    F.acted();
    const r = F.current();
    if (!r || held !== "broom") return F.jiggle(dirt);
    if (r.data.j.key !== "dirt") {
      held = null;
      broom.classList.remove("sel");
      return F.oops(r, broom);
    }
    held = null;
    broom.classList.remove("sel");
    F.jiggle(broom, "hp-shake");
    dirt.classList.add("gone");
    F.add(r);
  });
  if (soap) {
    F.on(soap, "click", (ev) => {
      ev.stopPropagation();
      F.acted();
      held = held === "soap" ? null : "soap";
      soap.classList.toggle("sel", held === "soap");
      broom.classList.remove("sel");
    });
    F.on(dish, "click", (ev) => {
      ev.stopPropagation();
      F.acted();
      const r = F.current();
      if (!r || held !== "soap") return F.jiggle(dish);
      held = null;
      soap.classList.remove("sel");
      if (!r.data.j.put) return F.oops(r, soap);
      soap.style.setProperty("--x", "0.4");
      soap.style.setProperty("--y", "0.5");
      F.add(r);
    });
  }

  await F.sleep(F.T(500));
  await H.zoom("bathroom", { ms: 900 });
  await F.ask({});
  F.begin();
  F.teach("thing", () => F.current() && F.current().target());
  await new Promise((res) => F.whenAll(res));
  await F.finish(async () => {
    // the dusk: light off and curtain closed: soft blue; Zazu's eyes in the laundry basket, a sleepy pop-up; then the light back on
    Object.values(things).forEach((t) => (t.key.startsWith("lamp") || t.key === "curtain") && setOn(t, false));
    room.classList.add("hp-dusk");
    await F.sleep(F.T(900));
    zazu.classList.remove("hp-hidden");
    zazu.classList.add("hp-leap");
    F.jiggle(basket);
    await F.sleep(F.T(1400));
    setOn(things.lamp1, true);
    room.classList.remove("hp-dusk");
  });
  void curtain;
}

/*
 * The blackboard (prototype, proto-school 2 Nov 2026; build/reports/designs/school-day.md §3B, its critique).
 *
 * The teacher calls the child up as her helper. A lesson is two or three board jobs, each a different action. THE SENTENCE LAYOUT
 * (proto brief, 2 Nov): the teacher says one job at a time, big in her box ("Draw the chakli.": the frame to record, the picture,
 * colour and number words in Kutchi where the engine has them); under her the word tiles: Pictures (bird, house, car, goat) and
 * Colours (red, green), and Numbers from L2: a tile for each, asked or not; no tile glows for the answer. The board never shows
 * letters or numbers. A chalk tray along the bottom: the white chalk, the red and green chalks, the duster from L2 (tap a tool
 * to hold it; only one at once).
 *   DRAW: three faint dotted pictures; hold the white chalk, then drag over the picture she named: the chalk line fills in as
 *     you drag; when it's drawn, the picture hops (comes alive). A drag on another picture: it wobbles, her line again.
 *   COLOUR: drawn pictures; hold a coloured chalk, tap a picture: it fills. Wrong picture or colour: a wobble, her line again.
 *   RING (count): groups of one, two and three birds; tap the group she named: a chalk ring draws round it and she counts them
 *     aloud as each bounces. A wrong group: she counts that one (the miss is the lesson), then her line again.
 *   RUB OUT: red and green cars and birds; hold the duster, then rub over the picture she named: it fades. The wrong one dodges.
 *   L1  draw, then colour (red or green)
 *   L2  draw, ring the group, rub out (colour and noun decide); the duster always in the tray
 *   L3, L4  as L2. Not built: Ali's model, size (big/small), "how many?", two jobs in one line, the sticker at the bell, the
 *     snap-to-track drawing (here any drag over the picture draws it).
 */
const PATHS = {
  bird: "M14 58 Q30 34 52 50 Q64 30 86 40 Q80 52 64 58 Q44 76 14 58 Z M52 50 L46 38 M60 62 L56 78 M48 64 L44 80",
  house: "M18 52 L50 20 L82 52 M24 46 L24 86 L76 86 L76 46 M42 86 L42 66 L58 66 L58 86 M30 56 L40 56 L40 64 L30 64 Z",
  car: "M8 68 L18 48 L66 48 L80 62 L92 64 L92 76 L8 76 Z M24 48 L26 62 L72 62 M30 84 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0 M72 84 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0",
  goat: "M18 42 L64 42 Q74 42 78 32 L84 22 L88 34 L82 46 L74 50 L72 80 M28 50 L26 80 M18 42 Q10 46 12 54 M62 50 L64 80 M80 26 L76 16",
};
const KIND = { bird: "n.bird", house: "n.house", car: "n.car", goat: "n.she-goat" };
const COL = { red: "a.red", green: "a.green" };
const item = (k, o = {}) => Object.assign({ fn: "Item", kind: KIND[k] }, o);

export default async function board(F) {
  const lv = F.level;
  const kinds = Object.keys(PATHS);
  const jobs = lv === 1 ? ["draw", "colour"] : F.shuffle(["draw", "ring", "rub"]);

  /* ----- the scene: the board and its chalk tray ----- */
  F.scene.insertAdjacentHTML("beforeend", '<div class="sp-wall sp-classroom"></div>');
  const boardEl = document.createElement("div");
  boardEl.className = "sp-board";
  F.scene.appendChild(boardEl);
  const tray = document.createElement("div");
  tray.className = "sp-tray-bar";
  F.scene.appendChild(tray);
  const tools = {};
  const toolList = ["white", "red", "green"].concat(lv >= 2 ? ["duster"] : []);
  F.shuffle(toolList).forEach((t) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `sp-tool ${t === "duster" ? "sp-duster" : `sp-chalk ${t}`}`;
    b.setAttribute("aria-label", t === "duster" ? "duster" : `${t} chalk`);
    b.dataset.tool = t;
    tray.appendChild(b);
    tools[t] = b;
  });
  let held = null;
  const hold = (t) => {
    held = held === t ? null : t;
    Object.values(tools).forEach((b) => b.classList.toggle("held", b.dataset.tool === held));
  };
  Object.values(tools).forEach((b) =>
    F.on(b, "click", () => {
      F.acted();
      hold(b.dataset.tool);
    })
  );

  /* ----- the jobs: each a row; the board is dealt fresh for each ----- */
  const plan = jobs.map((j) => {
    if (j === "draw") return { j, k: F.pick(kinds) };
    if (j === "colour") return { j, k: F.pick(kinds), c: F.pick(["red", "green"]) };
    if (j === "ring") return { j, n: 1 + Math.floor(F.rng() * 3) };
    return { j, k: F.pick(["car", "bird"]), c: F.pick(["red", "green"]) };
  });
  const lineOf = (p) =>
    p.j === "draw"
      ? { fn: "DrawTheX", x: item(p.k) }
      : p.j === "colour"
        ? { fn: "ColourTheXY", x: item(p.k), y: { fn: "Item", kind: COL[p.c] } }
        : p.j === "ring"
          ? { fn: "PutARingRoundTheX", x: item("bird", p.n > 1 ? { n: p.n } : {}) }
          : { fn: "RubOutTheX", x: item(p.k, { mods: [COL[p.c]] }) };
  const rows = plan.map((p, i) =>
    F.row({
      key: `${p.j}${i}`,
      line: lineOf(p),
      word: p.j === "ring" ? item("bird", p.n > 1 ? { n: p.n } : {}) : p.c ? item(p.k, { mods: [COL[p.c]] }) : item(p.k),
      tiles: [p.k || "bird", p.c, p.j === "ring" ? `n${p.n}` : null].filter(Boolean),
      target: () => (p.j === "ring" ? pics.find((x) => x.n === p.n)?.el : pics.find((x) => x.k === p.k && (!p.c || x.c === p.c || p.j === "colour"))?.el),
      data: p,
    })
  );
  const svgPic = (k, cls = "") => `<svg viewBox="0 0 100 100" class="sp-chalkpic ${cls}" aria-hidden="true"><path class="sp-fill" d="${PATHS[k]}"/><path class="sp-dots" d="${PATHS[k]}"/><path class="sp-ink" pathLength="100" d="${PATHS[k]}"/></svg>`;
  const tiles = [
    { label: { fn: "Item", kind: "n.pictures" }, tiles: kinds.map((k) => ({ key: k, word: item(k), lex: KIND[k], picture: (box) => box.insertAdjacentHTML("beforeend", svgPic(k, "drawn tile")) })) },
    { label: { fn: "Item", kind: "n.colours" }, tiles: ["red", "green"].map((c) => ({ key: c, word: { fn: "Item", kind: COL[c] }, lex: COL[c], picture: (box) => box.insertAdjacentHTML("beforeend", `<span class="sp-swatch ${c}"></span>`) })) },
  ];
  if (lv >= 2) tiles.push({ label: { en: "numbers" }, tiles: [1, 2, 3].map((n) => ({ key: `n${n}`, word: { fn: "Item", kind: `num.${n}` }, lex: `num.${n}`, picture: (box) => box.insertAdjacentHTML("beforeend", `<span class="sp-dots-n">${'<i></i>'.repeat(n)}</span>`) })) });
  F.sentence(tiles);

  /* ----- dealing the board for a job ----- */
  let pics = [];
  function deal(p) {
    boardEl.innerHTML = "";
    pics = [];
    hold(null);
    const slots = (n) => Array.from({ length: n }, (_, i) => (i + 0.5) / n);
    if (p.j === "draw") {
      const ks = F.shuffle([p.k].concat(F.shuffle(kinds.filter((k) => k !== p.k)).slice(0, 2)));
      ks.forEach((k, i) => pics.push(place({ k, x: slots(3)[i], state: "dotted" })));
    } else if (p.j === "colour") {
      const ks = F.shuffle([p.k].concat(F.shuffle(kinds.filter((k) => k !== p.k)).slice(0, lv === 1 ? 1 : 2)));
      ks.forEach((k, i) => pics.push(place({ k, x: slots(ks.length)[i], state: "drawn" })));
    } else if (p.j === "ring") {
      F.shuffle([1, 2, 3]).forEach((n, i) => pics.push(place({ k: "bird", n, x: slots(3)[i], state: "drawn", group: true })));
    } else {
      const set = F.shuffle([["car", "red"], ["car", "green"], ["bird", "red"], ["bird", "green"]]);
      set.forEach(([k, c], i) => pics.push(place({ k, c, x: slots(4)[i], state: "drawn coloured" })));
    }
  }
  function place(o) {
    const el = document.createElement("button");
    el.type = "button";
    el.className = `sp-boardpic ${o.group ? "group" : ""}`;
    el.style.setProperty("--x", String(o.x));
    el.setAttribute("aria-label", o.k);
    const n = o.n || 1;
    el.innerHTML = Array.from({ length: n }, () => svgPic(o.k, o.state)).join("");
    if (o.c) el.querySelectorAll(".sp-chalkpic").forEach((s) => s.classList.add(o.c));
    boardEl.appendChild(el);
    o.el = el;
    o.progress = 0;
    wire(o);
    return o;
  }

  /* ----- the gestures ----- */
  const cur = () => F.current();
  const right = (o, p) => (p.j === "ring" ? o.n === p.n : o.k === p.k && (p.j !== "rub" || o.c === p.c));
  function done(o, r) {
    const next = rows[rows.indexOf(r) + 1];
    F.add(r);
    if (next) F.after(F.T(900), () => !F.dead && deal(next.data));
  }
  function wire(o) {
    let down = null;
    F.on(o.el, "pointerdown", (ev) => {
      F.acted();
      const r = cur();
      if (!r) return;
      const p = r.data;
      if (p.j === "draw" || p.j === "rub") {
        const need = p.j === "draw" ? "white" : "duster";
        if (held !== need) {
          F.jiggle(tools[need] || o.el, "sp-shake");
          return;
        }
        if (!right(o, p)) {
          if (p.j === "rub") o.el.classList.add("dodge"), F.after(F.T(700), () => o.el.classList.remove("dodge"));
          F.oops(r, o.el);
          return;
        }
        down = { x: ev.clientX, y: ev.clientY };
        try {
          o.el.setPointerCapture(ev.pointerId);
        } catch (e) {
          /* ok */
        }
      }
    });
    F.on(o.el, "pointermove", (ev) => {
      if (!down) return;
      const r = cur();
      if (!r) return;
      const d = Math.hypot(ev.clientX - down.x, ev.clientY - down.y);
      down = { x: ev.clientX, y: ev.clientY };
      const w = o.el.getBoundingClientRect().width || 100;
      o.progress = Math.min(100, o.progress + (d / (w * 2.2)) * 100);
      if (r.data.j === "draw") o.el.style.setProperty("--draw", String(100 - o.progress));
      else o.el.style.opacity = String(1 - o.progress / 110);
      if (o.progress >= 100) {
        down = null;
        if (r.data.j === "draw") {
          o.el.querySelectorAll(".sp-chalkpic").forEach((s) => s.classList.replace("dotted", "drawn"));
          F.jiggle(o.el, "sp-alive");
        } else o.el.classList.add("rubbed");
        done(o, r);
      }
    });
    const up = () => (down = null);
    F.on(o.el, "pointerup", up);
    F.on(o.el, "pointercancel", up);
    F.on(o.el, "click", async () => {
      const r = cur();
      if (!r) return;
      const p = r.data;
      if (p.j === "colour") {
        if (held !== "red" && held !== "green") {
          F.jiggle(tools.red, "sp-shake");
          return;
        }
        if (!right(o, p) || held !== p.c) {
          F.oops(r, o.el);
          return;
        }
        o.el.querySelectorAll(".sp-chalkpic").forEach((s) => s.classList.add("coloured", held));
        F.jiggle(o.el, "sp-alive");
        done(o, r);
      } else if (p.j === "ring") {
        if (o.el.classList.contains("ringed")) return;
        o.el.classList.add("ringed");
        const ok = right(o, p);
        if (ok) done(o, r);
        // she counts the group aloud, each bird bouncing (a wrong group: the count is the lesson, then her line again)
        const birds = [...o.el.querySelectorAll(".sp-chalkpic")];
        for (let i = 0; i < birds.length; i++) {
          F.jiggle(birds[i], "sp-alive");
          await F.speak(F.say({ fn: "Item", kind: `num.${i + 1}` }), { cap: F.T(700) });
        }
        if (!ok) {
          o.el.classList.remove("ringed");
          F.oops(r, o.el);
        }
      }
    });
  }

  deal(plan[0]);
  await F.ask({ guide: "board-head" });
  F.begin();
  const first = plan[0].j === "draw" ? "white" : plan[0].j === "rub" ? "duster" : null;
  if (first) F.teach("chalk", tools[first]);
  await new Promise((res) => F.whenAll(res));
  await F.finish(async () => {
    pics.forEach((o) => F.jiggle(o.el, "sp-alive"));
    await F.sleep(F.T(500));
  });
}

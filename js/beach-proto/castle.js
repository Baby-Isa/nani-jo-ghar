/*
 * The sandcastle (prototype, proto-beach 2 Nov 2026; build/reports/designs/beach-boat.md §3.2: Zafar's design, fill and stack).
 *
 * Eye level at sand height, the sea far behind. The child's patch: a row of spots on the smooth sand, every one outlined the same,
 * the next one lit (L1-L2: the order is given). The kit along the bottom: the big and the small bucket (one colour), the sand heap
 * with the spade, two shells. THE SENTENCE LAYOUT: Masi says one instruction at a time ("Wadho bucket bhar!": fill the big bucket;
 * from L2 "Fill the small bucket: thorok." with the frame to record), the word tiles under her: Buckets (small and big as a pair,
 * the shell), Amounts from L2 (a little, full; half at L4: the same plain heap on each, the amount is only a word).
 *   1 Tap a bucket: it hops next to the heap (a wrong bucket shakes and stays; her line again).
 *   2 Tap the heap: each tap flies one spadeful in (a little 1, half 2, full 4); the amount bounces the moment it's reached and a
 *     spadeful after that plops off and doesn't land (Zafar, 1 Nov).
 *   3 Tap the bucket (or the lit spot): it flies over, flips and lifts: a tower as tall as the sand in it. Tipped before the amount
 *     is reached, the tower slumps back into the heap and the bucket comes back empty (her line again; it will tick plain).
 *   4 "A shell on the big tower": tap a shell, then the tower (a wrong tower: the shell hops back).
 * The end: the crab pops out of the tallest tower; "Smile!", the photo flash.
 *   L1  two towers (big and small, either order), always "fill it" (full); one shell
 *   L2  three towers, the amount said (a little or full); two shells
 *   L3  as L2 (positions, "in the middle, next to, on top", not built yet)
 *   L4  as L2 with half beside a little and full
 * Not built: the two-step line ("first the small one, a little, and then the big one, full"), L3's positions and stacking.
 */
const BK = "n.bucket";
const NEED = { little: 1, half: 2, full: 4 };
const AMT = {
  little: { fn: "Exclaim", x: "phrase.a-little" },
  full: { fn: "Amt", x: "a.whole" },
  half: { fn: "Amt", x: "a.adh" },
};
const LEX = { little: "phrase.a-little", full: "a.whole", half: "a.adh" };
const H = { big: 0.22, small: 0.14 };
const bucketNP = (size) => ({ fn: "Item", kind: BK, mods: [`a.${size}`] });

export default async function castle(F) {
  const lv = F.level;
  const nTowers = lv === 1 ? 2 : 3;
  const sizes = lv === 1 ? F.shuffle(["big", "small"]) : F.shuffle(["big", "small", F.pick(["big", "small"])]);
  const amounts = lv === 1 ? ["full", "full"] : sizes.map(() => F.pick(lv >= 4 ? ["little", "half", "full"] : ["little", "full"]));
  const towers = sizes.map((size, i) => ({ size, amount: amounts[i] }));
  const shellAsks = lv === 1 ? [F.pick(["big", "small"])] : F.shuffle(["big", "small"]);

  /* ----- the scene ----- */
  F.scene.insertAdjacentHTML("beforeend", '<div class="bp-sky"></div><div class="bp-horizon"></div><div class="bp-far-sand"></div>');
  const spotX = nTowers === 2 ? [0.36, 0.62] : [0.26, 0.49, 0.72];
  const spots = spotX.map((x) => F.put("bp-spot", { x, y: 0.7, h: 0.05, w: 0.14, tag: "button" }));
  spots.forEach((s) => s.classList.add("wide"));
  const HOME = { big: 0.1, small: 0.24 };
  const bucketEl = {};
  for (const size of ["big", "small"]) {
    const b = F.put("bp-bucket", { x: HOME[size], y: 0.97, h: H[size], tag: "button", html: '<span class="bp-fill"></span>' });
    b.dataset.size = size;
    b.setAttribute("aria-label", `${size} bucket`);
    bucketEl[size] = b;
  }
  const heap = F.put("bp-heap", { x: 0.52, y: 0.98, h: 0.15, w: 0.17, tag: "button", html: '<span class="bp-spade"></span>' });
  heap.classList.add("wide");
  heap.setAttribute("aria-label", "sand");
  const shellEls = [0.78, 0.88].map((x) => {
    const s = F.put("bp-shell", { x, y: 0.95, h: 0.07, tag: "button" });
    s.setAttribute("aria-label", "shell");
    return s;
  });

  /* ----- her instructions: one per tower, then the shells ----- */
  const towerRows = towers.map((t, i) =>
    F.row({
      key: `tower${i}`,
      line: lv === 1 ? { fn: "Command", verb: "v.fill", obj: bucketNP(t.size) } : { fn: "FillTheXY", x: bucketNP(t.size), y: AMT[t.amount] },
      word: bucketNP(t.size),
      tiles: lv === 1 ? [t.size] : [t.size, t.amount],
      target: () => (held ? (fill < NEED[t.amount] ? heap : held) : bucketEl[t.size]),
      data: Object.assign({ kind: "tower", i }, t),
    })
  );
  const builtTowers = [];
  const shellRows = shellAsks.map((size, i) =>
    F.row({
      key: `shell${i}`,
      line: { fn: "AShellOnTheX", x: { fn: "Item", kind: "n.tower", mods: [`a.${size}`] } },
      word: { fn: "Item", kind: "n.shell" },
      tiles: ["shell", size],
      target: () => (chosen ? builtTowers.find((t) => t.dataset.size === size && !t.dataset.shell) : shellEls.find((s) => !s.classList.contains("taken"))),
      data: { kind: "shell", size },
    })
  );

  /* ----- the tiles ----- */
  const pic = (cls) => (box) => box.insertAdjacentHTML("beforeend", `<span class="bp-tilepic ${cls}"></span>`);
  const groups = [
    {
      label: { en: "buckets" },
      tiles: [
        { pair: [
          { key: "small", word: bucketNP("small"), lex: "a.small", picture: pic("bp-bucket small") },
          { key: "big", word: bucketNP("big"), lex: "a.big", picture: pic("bp-bucket") },
        ] },
        { key: "shell", word: { fn: "Item", kind: "n.shell" }, lex: "n.shell", picture: pic("bp-shell") },
      ],
    },
  ];
  if (lv >= 2)
    groups.push({
      label: { en: "amounts" },
      tiles: (lv >= 4 ? ["little", "half", "full"] : ["little", "full"]).map((a) => ({ key: a, word: AMT[a], lex: LEX[a], picture: pic("bp-heap-pic") })),
    });
  F.sentence(groups);

  /* ----- the moves ----- */
  let held = null; // the bucket beside the heap
  let fill = 0;
  let chosen = null; // the shell in hand
  let busy = false;
  const nextSpot = () => spots[builtTowers.length];
  const litSpot = () => spots.forEach((s, i) => s.classList.toggle("next", i === builtTowers.length && F.current() && F.current().data.kind === "tower"));
  const setFill = (b, n) => (b.querySelector(".bp-fill").style.height = `${(n / 4) * 100}%`);
  function home(b) {
    b.style.setProperty("--x", String(HOME[b.dataset.size]));
    b.style.setProperty("--y", "0.97");
    b.classList.remove("tipped");
    setFill(b, 0);
  }

  for (const size of ["big", "small"])
    F.on(bucketEl[size], "click", () => {
      F.acted();
      const r = F.current();
      if (!r || busy) return;
      const b = bucketEl[size];
      if (r.data.kind !== "tower") return F.jiggle(b, "bp-shake");
      if (held === b) return tip(r);
      if (held) return F.jiggle(b, "bp-shake");
      if (size !== r.data.size) return F.oops(r, b);
      held = b;
      fill = 0;
      b.style.setProperty("--x", "0.38");
      F.jiggle(b);
    });
  F.on(heap, "click", async () => {
    F.acted();
    const r = F.current();
    if (!r || busy || r.data.kind !== "tower") return F.jiggle(heap, "bp-shake");
    if (!held) return F.jiggle(heap, "bp-shake");
    const need = NEED[r.data.amount];
    if (fill >= need) {
      // the plop: a spadeful that won't land
      F.jiggle(held, "bp-shake");
      return;
    }
    fill++;
    await F.fly(null, heap, held, { cls: "bp-spadeful", size: heap.getBoundingClientRect().height * 0.35, ms: 300 });
    setFill(held, fill);
    if (fill >= need) {
      F.jiggle(held);
      if (W().Sfx) W().Sfx.play("right", { volume: 0.25 });
    }
  });
  spots.forEach((s) =>
    F.on(s, "click", () => {
      F.acted();
      const r = F.current();
      if (r && held && !busy && r.data.kind === "tower" && s === nextSpot()) tip(r);
    })
  );

  async function tip(r) {
    if (fill < 1) return F.jiggle(held, "bp-shake");
    busy = true;
    const b = held;
    const spot = nextSpot();
    const sx = Number(spot.style.getPropertyValue("--x"));
    b.style.setProperty("--x", String(sx));
    b.style.setProperty("--y", "0.66");
    await F.sleep(F.T(450));
    b.classList.add("tipped");
    await F.sleep(F.T(300));
    const ok = fill === NEED[r.data.amount];
    const tower = F.put("bp-tower", { x: sx, y: 0.7, h: H[b.dataset.size] * (fill / 4) * 0.9, tag: "button", html: '<span class="bp-crenel"></span>' });
    tower.dataset.size = b.dataset.size;
    tower.setAttribute("aria-label", `${b.dataset.size} tower`);
    home(b);
    held = null;
    fill = 0;
    if (!ok) {
      // the slump: back into the heap, "fff"; her line again
      await F.sleep(F.T(350));
      tower.classList.add("slump");
      F.oops(r, null);
      F.after(F.T(600), () => tower.remove());
      busy = false;
      return;
    }
    tower.classList.add("lifted-out");
    builtTowers.push(tower);
    F.on(tower, "click", () => onTower(tower));
    F.add(r);
    busy = false;
    litSpot();
  }

  shellEls.forEach((s) =>
    F.on(s, "click", () => {
      F.acted();
      const r = F.current();
      if (!r || busy || s.classList.contains("taken")) return;
      if (r.data.kind !== "shell") return F.jiggle(s, "bp-shake");
      shellEls.forEach((x) => x.classList.toggle("lifted", x === s));
      chosen = s;
    })
  );
  async function onTower(tower) {
    F.acted();
    const r = F.current();
    if (!r || busy || r.data.kind !== "shell" || !chosen) return F.jiggle(tower, "bp-shake");
    if (tower.dataset.size !== r.data.size || tower.dataset.shell) {
      F.oops(r, tower);
      return;
    }
    busy = true;
    const s = chosen;
    chosen = null;
    s.classList.remove("lifted");
    s.classList.add("taken");
    await F.fly(null, s, tower, { cls: "bp-shell", size: s.getBoundingClientRect().height, ms: 420 });
    tower.dataset.shell = "1";
    tower.insertAdjacentHTML("beforeend", '<span class="bp-shell bp-ontop"></span>');
    F.jiggle(tower);
    F.add(r);
    busy = false;
  }

  litSpot();
  await F.ask({ guide: "sc-head" });
  F.begin();
  litSpot();
  F.teach("bucket", () => towerRows[0].target());
  await new Promise((res) => F.whenAll(res));
  spots.forEach((s) => s.classList.remove("next"));
  await F.finish(async () => {
    // the crab pops out of the tallest tower; Nani's photo
    const tall = builtTowers.slice().sort((a, b) => b.getBoundingClientRect().height - a.getBoundingClientRect().height)[0];
    if (tall) tall.insertAdjacentHTML("beforeend", '<span class="bp-crab bp-crab-top"></span>');
    await F.speak(F.lineOf("sc-photo"));
    F.root.classList.add("bp-flash");
    await F.sleep(F.T(400));
    F.root.classList.remove("bp-flash");
  });
}
const W = () => (typeof window !== "undefined" ? window : globalThis);

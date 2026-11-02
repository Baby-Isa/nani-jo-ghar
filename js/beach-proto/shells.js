/*
 * Shells (prototype, proto-beach 2 Nov 2026; build/reports/designs/beach-boat.md §3.1, its critique).
 *
 * Top-down wet sand, the sea along the top; Masi's bucket at the right. THE SENTENCE LAYOUT (proto brief, 2 Nov): Masi says one
 * instruction at a time, big in her box ("Wadho shell khanech!": bring the big shell; the shell is to record), and under her the
 * word tiles: Shells (small and big as a neutral pair tile, the pebble), Numbers from L2, Colours from L3; a tile for every kind of
 * thing on the sand, asked for or not; none glows for the answer. Tap a shell (a pile from L2): it lifts; right, it hops into the
 * bucket (a pile hops in whole) and the instruction ticks; then a wave sweeps in and lays out a fresh spread for the next. Wrong,
 * it shakes and drops back, and she says it again (the instruction will tick plain). Under one shell a round is the crab: lifted,
 * it pops out and scuttles off sideways into the foam (always under a right shell here: a happy meeting).
 *   L1  size only: 2 big, 2 small, 1 pebble
 *   L2  the count as piles: the asked size in piles of 1, 2 and 3, the other size in the asked count
 *   L3  a colour (red or white; white is to record): both colours in both sizes, the pebble
 *   L4  size and colour, with a middle-sized look-alike beside the asked size
 * Not built: "not the red ones" (the no ask), Masi counting along as a pile hops in, the first-round scripted crab.
 */
const SH = "n.shell";
const SIZE = { small: 0.085, middle: 0.12, big: 0.165 };
const shellNP = (a) => {
  const mods = [];
  if (a.size) mods.push(`a.${a.size}`);
  if (a.colour) mods.push(`a.${a.colour}`);
  const o = { fn: "Item", kind: SH };
  if (a.n) o.n = a.n;
  if (mods.length) o.mods = mods;
  return o;
};

export default async function shells(F) {
  const lv = F.level;
  const N = 3;
  const two = (x, y) => F.shuffle([x, y, F.pick([x, y])]);
  let asks;
  if (lv === 1) asks = two("big", "small").map((size) => ({ size }));
  else if (lv === 2) {
    const ns = F.shuffle([1, 2, 3]);
    asks = two("big", "small").map((size, i) => ({ size, n: ns[i] }));
  } else if (lv === 3) asks = two("red", "white").map((colour) => ({ colour }));
  else {
    const cs = two("red", "white");
    asks = two("big", "small").map((size, i) => ({ size, colour: cs[i] }));
  }
  const crabAt = Math.floor(F.rng() * N);

  /* ----- the scene ----- */
  F.scene.insertAdjacentHTML("beforeend", '<div class="bp-sand"></div><div class="bp-wet"></div><div class="bp-sea"></div>');
  const sea = F.scene.querySelector(".bp-sea");
  const bucket = F.put("bp-bucket", { x: 0.9, y: 0.95, h: 0.24, html: '<span class="bp-fill"></span>' });
  const fillEl = bucket.querySelector(".bp-fill");
  let inBucket = 0;

  /* ----- her instructions ----- */
  const tilesOf = (a) => [a.size, a.n ? `n${a.n}` : null, a.colour].filter(Boolean);
  let field = [];
  const isRight = (el, a) => {
    const d = el.dataset;
    if (d.kind !== "shell") return false;
    if (a.size && d.size !== a.size) return false;
    if (a.colour && d.colour !== a.colour) return false;
    if (lv === 2 && Number(d.n) !== a.n) return false;
    return true;
  };
  const rows = asks.map((a, i) =>
    F.row({
      key: `shell${i}`,
      line: { fn: "Command", verb: "v.bring", obj: shellNP(a) },
      word: shellNP(a),
      tiles: tilesOf(a),
      target: () => field.find((el) => isRight(el, a) && !el.classList.contains("taken")),
      data: a,
    })
  );

  /* ----- the tiles: every kind on the sand, asked for or not ----- */
  const pic = (cls) => (box) => box.insertAdjacentHTML("beforeend", `<span class="bp-tilepic ${cls}"></span>`);
  const groups = [
    {
      label: { en: "shells" },
      tiles: [
        { pair: [
          { key: "small", word: { fn: "Item", kind: SH, mods: ["a.small"] }, lex: "a.small", picture: pic("bp-shell small") },
          { key: "big", word: { fn: "Item", kind: SH, mods: ["a.big"] }, lex: "a.big", picture: pic("bp-shell") },
        ] },
      ].concat(lv === 2 ? [] : [{ key: "pebble", word: { fn: "Item", kind: "n.pebble" }, lex: "n.pebble", picture: pic("bp-pebble") }]),
    },
  ];
  if (lv === 2)
    groups.push({
      label: { en: "numbers" },
      tiles: [1, 2, 3].map((n) => ({ key: `n${n}`, word: { fn: "Item", kind: `num.${n}` }, lex: `num.${n}`, picture: (box) => box.insertAdjacentHTML("beforeend", `<span class="bp-dots">${"<i></i>".repeat(n)}</span>`) })),
    });
  if (lv >= 3)
    groups.push({
      label: { en: "colours" },
      tiles: ["red", "white"].map((c) => ({ key: c, word: { fn: "Item", kind: SH, mods: [`a.${c}`] }, lex: `a.${c}`, picture: pic(`bp-shell ${c}`) })),
    });
  F.sentence(groups);

  /* ----- a fresh spread on the sand for the ask ----- */
  function spread(a, idx) {
    field.forEach((el) => el.remove());
    field = [];
    const things = [];
    if (lv === 1) things.push({ size: "big" }, { size: "big" }, { size: "small" }, { size: "small" }, { pebble: true });
    else if (lv === 2) {
      const other = a.size === "big" ? "small" : "big";
      things.push({ size: a.size, n: 1 }, { size: a.size, n: 2 }, { size: a.size, n: 3 }, { size: other, n: a.n });
    } else if (lv === 3) {
      things.push({ size: "big", colour: "red" }, { size: "small", colour: "red" }, { size: "big", colour: "white" }, { size: "small", colour: "white" });
      things.push({ size: F.pick(["big", "small"]), colour: F.pick(["red", "white"]) }, { pebble: true });
    } else {
      const other = a.colour === "red" ? "white" : "red";
      things.push({ size: "small", colour: a.colour }, { size: "middle", colour: a.colour }, { size: "big", colour: a.colour });
      things.push({ size: "small", colour: other }, { size: "big", colour: other }, { pebble: true });
    }
    // slots: a 4 x 2 grid on the wet sand, kept clear of the bucket; shuffled, jittered
    const cols = lv === 2 ? 2 : 4;
    const slots = [];
    for (let r = 0; r < 2; r++) for (let c = 0; c < cols; c++) slots.push({ x: 0.12 + (c + 0.5) * (0.66 / cols), y: 0.5 + r * 0.32 });
    const order = F.shuffle(slots).slice(0, things.length);
    things.forEach((t, i) => {
      const s = order[i];
      const x = s.x + (F.rng() - 0.5) * 0.05;
      const y = s.y + (F.rng() - 0.5) * 0.05;
      let el;
      if (t.pebble) {
        el = F.put("bp-pebble", { x, y, h: 0.09, tag: "button" });
        el.dataset.kind = "pebble";
      } else if (t.n) {
        el = F.put("bp-pile", { x, y, h: SIZE[t.size], tag: "button", html: `<span class="bp-shell${t.colour ? " " + t.colour : ""}"></span>`.repeat(t.n) });
        el.dataset.kind = "shell";
        el.dataset.n = String(t.n);
      } else {
        el = F.put(`bp-shell${t.colour ? " " + t.colour : ""}`, { x, y, h: SIZE[t.size], tag: "button" });
        el.dataset.kind = "shell";
      }
      el.dataset.size = t.size || "";
      el.dataset.colour = t.colour || "";
      el.setAttribute("aria-label", t.pebble ? "pebble" : `${t.n ? t.n + " " : ""}${t.size} ${t.colour || ""} shell`);
      field.push(el);
      F.on(el, "click", () => pickUp(el));
    });
    if (idx === crabAt) {
      const under = field.find((el) => isRight(el, a));
      if (under) under.dataset.crab = "1";
    }
  }

  let busy = false;
  async function pickUp(el) {
    F.acted();
    const r = F.current();
    if (!r || busy || el.classList.contains("taken")) return;
    busy = true;
    el.classList.add("lifted");
    if (el.dataset.crab) {
      delete el.dataset.crab;
      const crab = F.put("bp-crab", { x: Number(el.style.getPropertyValue("--x")), y: Number(el.style.getPropertyValue("--y")), h: 0.07 });
      F.speak(F.lineOf("sh-crab"));
      await F.sleep(F.T(500));
      crab.style.setProperty("--x", "1.2");
      F.after(F.T(1200), () => crab.remove());
    }
    if (!isRight(el, r.data)) {
      await F.sleep(F.T(250));
      F.oops(r, el);
      await F.sleep(F.T(350));
      el.classList.remove("lifted");
      busy = false;
      return;
    }
    el.classList.add("taken");
    await F.fly(null, el, bucket, { cls: el.className.replace(/\b(bp-thing|lifted|taken)\b/g, ""), size: el.getBoundingClientRect().height, ms: 480 });
    inBucket += Number(el.dataset.n || 1);
    fillEl.style.height = `${Math.min(80, inBucket * 9)}%`;
    F.jiggle(bucket);
    F.add(r);
    const next = F.current();
    if (next) {
      // the wave: in, a fresh spread, out
      sea.classList.add("wave");
      await F.sleep(F.T(600));
      spread(next.data, rows.indexOf(next));
      sea.classList.remove("wave");
    }
    busy = false;
  }

  spread(rows[0].data, 0);
  await F.ask({ guide: "sh-head" });
  F.begin();
  F.teach("shell", () => rows[0].target && rows[0].target());
  await new Promise((res) => F.whenAll(res));
  await F.finish(async () => {
    F.jiggle(bucket);
    await F.sleep(F.T(500));
  });
}

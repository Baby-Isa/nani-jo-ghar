/*
 * Pack the school bag (prototype, proto-school 2 Nov 2026; build/reports/designs/school-day.md §3A, its critique).
 *
 * Nani's front door: things stand on the bench, the open school bag at its right end. THE SENTENCE LAYOUT (proto brief, 2 Nov):
 * Nani says one instruction at a time, big in her box ("Book wij!": put the book in; the engine, the noun to record), and under
 * her the word tiles: School things and Toys, a tile for every kind of thing on the bench, asked for or not; no tile glows for
 * the answer. Tap the thing: it hops into the bag with a bounce and the instruction ticks (gold first try). A count ticks the
 * moment its number is reached; an extra one doesn't land (it wobbles and stays). A wrong thing wriggles and stays on the
 * bench, and she says her instruction again (the instruction will tick plain). At the end the bag zips shut.
 *   L1  two school things asked (book, pencil), a ball as the decoy: 3 slots
 *   L2  a school thing, then "two (or three) pencils" (more pencils than asked), the unasked school thing and a toy: 4 slots
 *   L3  as L2 with three asks (a crayon or the lunchbox too) and the teddy: 6 slots
 *   L4  as L3 with four asks
 * Not built: "not the ball" (a no ask), owners (your book, not Ali's), the big and small book, show-and-tell day, Simba in the
 * bag, the call-back at the zip.
 */
const KINDS = {
  book: { lex: "n.book", school: true },
  pencil: { lex: "n.pencil", school: true },
  crayon: { lex: "n.crayon", school: true },
  lunchbox: { lex: "n.lunchbox", school: true },
  ball: { lex: "n.ball" },
  teddy: { lex: "n.teddy" },
};
const item = (k, n) => (n && n > 1 ? { fn: "Item", kind: KINDS[k].lex, n } : { fn: "Item", kind: KINDS[k].lex });

export default async function bag(F) {
  const lv = F.level;
  // the asks and what stands on the bench
  let asks;
  let bench;
  if (lv === 1) {
    asks = F.shuffle([{ k: "book", n: 1 }, { k: "pencil", n: 1 }]);
    bench = { book: 1, pencil: 1, ball: 1 };
  } else {
    const n = 2 + Math.floor(F.rng() * (lv === 2 ? 1 : 2)); // two (L2), two or three (L3+)
    const other = F.pick(["book", "crayon"]);
    asks = [{ k: other, n: 1 }, { k: "pencil", n }];
    if (lv >= 3) asks.push({ k: other === "book" ? F.pick(["crayon", "lunchbox"]) : "lunchbox", n: 1 });
    if (lv >= 4) asks.push({ k: F.pick(["ball", "teddy"]), n: 1 }); // (a toy is right sometimes: show-and-tell's seed)
    asks = F.shuffle(asks);
    bench = { book: 1, crayon: 1, pencil: n + 1 + Math.floor(F.rng() * 2), ball: 1 };
    if (lv >= 3) Object.assign(bench, { lunchbox: 1, teddy: 1 });
  }

  /* ----- the scene: the door, the bench, the things, the bag ----- */
  F.scene.insertAdjacentHTML("beforeend", '<div class="sp-wall"></div><div class="sp-floor"></div><div class="sp-door"></div>');
  F.put("sp-bench wide", { x: 0.46, y: 0.78, h: 0.06, w: 0.78 });
  F.put("sp-bench-legs wide", { x: 0.46, y: 0.96, h: 0.18, w: 0.72 });
  const bagEl = F.put("sp-bag", { x: 0.86, y: 0.8, h: 0.36, html: '<span class="sp-bag-flap"></span><span class="sp-bag-strap"></span>' });
  const kinds = F.shuffle(Object.keys(bench));
  const span = 0.66;
  const els = [];
  kinds.forEach((k, i) => {
    const x = 0.14 + (kinds.length === 1 ? span / 2 : (span * i) / (kinds.length - 1));
    const n = bench[k];
    for (let j = 0; j < n; j++) {
      const dx = n > 1 ? (j - (n - 1) / 2) * 0.035 : 0;
      const el = F.put(`sp-obj sp-${k}`, { x: x + dx, y: 0.75, h: k === "pencil" ? 0.2 : k === "teddy" ? 0.2 : 0.15, tag: "button" });
      el.setAttribute("aria-label", k);
      el.dataset.k = k;
      els.push(el);
    }
  });

  /* ----- her instructions: one row each ----- */
  const rows = asks.map((a, i) =>
    F.row({
      key: `${a.k}${i}`,
      line: { fn: "Command", verb: "v.put-in", obj: item(a.k, a.n) },
      word: item(a.k, a.n),
      need: a.n,
      tiles: [a.k],
      target: () => els.find((e) => e.dataset.k === a.k && !e.classList.contains("packed")),
      data: a,
    })
  );
  const tile = (k) => ({ key: k, word: item(k), lex: KINDS[k].lex, picture: (box) => box.insertAdjacentHTML("beforeend", `<span class="sp-obj sp-${k} sp-tilepic"></span>`) });
  const onBench = Object.keys(bench);
  F.sentence([
    { label: { en: "school things" }, tiles: onBench.filter((k) => KINDS[k].school).map(tile) },
    { label: { en: "toys" }, tiles: onBench.filter((k) => !KINDS[k].school).map(tile) },
  ]);

  els.forEach((el) =>
    F.on(el, "click", async () => {
      F.acted();
      if (el.classList.contains("packed")) return;
      const r = F.current();
      if (!r) return;
      if (el.dataset.k !== r.data.k) {
        F.oops(r, el); // a wriggle; it stays on the bench; her instruction again
        return;
      }
      if (F.full(r)) {
        F.jiggle(el, "sp-shake");
        return;
      }
      el.classList.add("packed");
      F.add(r);
      await F.fly(null, el, bagEl, { cls: `sp-obj sp-${el.dataset.k}`, size: el.getBoundingClientRect().height, ms: 480 });
      F.jiggle(bagEl);
    })
  );

  await F.ask({ guide: "bag-head" });
  F.begin();
  F.teach("pack", () => rows[0].target && rows[0].target());
  await new Promise((res) => F.whenAll(res));
  bagEl.classList.add("zipped");
  await F.finish(async () => {
    F.jiggle(bagEl);
    await F.sleep(F.T(500));
  });
}

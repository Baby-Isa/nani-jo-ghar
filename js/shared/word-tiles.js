/*
 * Word tiles (proto-farm v2, 2 Nov 2026): the side panel of any game whose order is a sentence (Zafar, 2 Nov; the layout in
 * build/reports/proto-brief-2026-11-02.md, the mock-ups sources/art/mockups-2026-11-02/feed-B-yard.webp, feed-B-barn.webp,
 * eggs-B-grid.webp). The helper says one instruction at a time; under her box, small tiles grouped under labels (Animals /
 * Food, Hens / Eggs ...): a picture, its word under it and a big speaker under the word ("I want to encourage listening").
 *
 * THE TILES NEVER GIVE THE ANSWER: the game gives a tile for every thing in the scene, asked for or not; no tile glows for
 * being asked; a tile lights only while its word is spoken (its own speaker, or the helper's line while the word is still
 * supported: the game's call); the picture always stays; the word dots out on the word ladder (opts.shown(tile) false) and a
 * tap on the dots shows it for 3 s, reported through opts.onReveal (the game makes it cost accuracy). A pair tile (small and
 * big side by side) is two tiles in one frame.
 *
 *   const T = mountTiles(parent, groups, { shown(tile) -> bool, onSpeak(tile), onReveal(tile), speed })
 *     groups: [{ label: {html, rec} | null, tiles: [tile | {pair: [tile, tile]}] }]
 *     tile:   { key, id (the word's id, for the ladder), html (its Kutchi, the kit's word markup), rec (still to record),
 *               picture: url | (box) => void, say: () => Promise }
 *   T.el  T.tile(key) -> el  T.say(key) -> Promise (lit while it plays)  T.light(key, on)  T.lightAll(false)
 *   T.repaint()  (the ladder changed: the words dot out or come back)
 *   T.steps(n, done, cur)   the progress pips (one per instruction: done ones filled, the current one ringed; never a verdict)
 *
 * The look is css/shared/word-tiles.css (the kit's s14 card tokens, no px). Plain DOM; no globals.
 */
const SPK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h4l5-4v14l-5-4H3z" fill="currentColor"/><path d="M15.5 8.5a4.5 4.5 0 0 1 0 7M18 6a8 8 0 0 1 0 12" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>';
const textOf = (html) => String(html || "").replace(/<[^>]*>/g, "").replace(/&[a-z]+;/g, "x");

export function mountTiles(parent, groups, opts = {}) {
  const doc = parent.ownerDocument || document;
  const speed = () => Number(opts.speed) || 1;
  const el = (tag, cls, p) => {
    const e = doc.createElement(tag);
    if (cls) e.className = cls;
    if (p) p.appendChild(e);
    return e;
  };
  const box = el("div", "wt", parent);
  const pips = el("div", "wt-steps", box);
  pips.setAttribute("aria-hidden", "true");
  const tiles = {};
  for (const g of groups) {
    const sec = el("section", "wt-group", box);
    if (g.label) {
      const h = el("h3", "wt-label", sec);
      h.innerHTML = `<span>${g.label.html}</span>`;
      if (g.label.rec) h.classList.add("wt-rec");
    }
    const grid = el("div", "wt-grid", sec);
    const units = g.tiles.reduce((n, t) => n + (t.pair ? 2 : 1), 0);
    const cols = units === 4 ? 2 : Math.max(2, Math.min(3, units));
    grid.style.setProperty("--wt-cols", String(cols));
    sec.style.setProperty("--wt-rows", String(Math.ceil(units / cols)));
    for (const t of g.tiles) {
      if (t.pair) {
        const p = el("div", "wt-pair", grid);
        t.pair.forEach((w) => (tiles[w.key] = tile(p, w)));
      } else tiles[t.key] = tile(grid, t);
    }
  }
  function tile(p, w) {
    const t = el("div", "wt-tile", p);
    t.dataset.key = w.key;
    if (w.id != null) t.dataset.word = String(w.id);
    t._w = w;
    const pic = el("div", "wt-pic", t);
    if (typeof w.picture === "function") w.picture(pic);
    else if (w.picture) {
      const im = el("img", "", pic);
      im.src = w.picture;
      im.alt = "";
      im.draggable = false;
    }
    const slot = el("div", "wt-slot", t);
    const word = el("p", "wt-word", slot);
    word.innerHTML = w.html || "";
    if (w.rec) word.classList.add("wt-rec");
    const dots = el("button", "wt-dots", slot);
    dots.type = "button";
    dots.setAttribute("aria-label", "");
    dots.innerHTML = Array.from({ length: Math.max(3, Math.min(6, textOf(w.html).replace(/\s/g, "").length - 1)) }, () => "<i></i>").join("");
    const spk = el("button", "wt-spk", t);
    spk.type = "button";
    spk.setAttribute("aria-label", "");
    spk.innerHTML = SPK;
    t._parts = { word, dots, spk };
    // (a tap anywhere on the tile hears its word; the dots are a peek at the written word)
    t.addEventListener("click", () => say(w.key));
    dots.addEventListener("click", (ev) => {
      ev.stopPropagation();
      peek(t);
    });
    return t;
  }
  function paint(t) {
    const shown = opts.shown ? opts.shown(t._w) !== false : true;
    t.classList.toggle("wt-dotted", !shown && !t._w.rec);
  }
  function peek(t) {
    if (!t.classList.contains("wt-dotted")) return;
    t.classList.add("wt-peek");
    clearTimeout(t._peekT);
    t._peekT = setTimeout(() => t.classList.remove("wt-peek"), 3000 / speed());
    if (opts.onReveal) opts.onReveal(t._w, t);
  }
  const light = (key, on) => {
    const t = tiles[key];
    if (t) t.classList.toggle("wt-lit", !!on);
  };
  async function say(key) {
    const t = tiles[key];
    if (!t) return;
    if (opts.onSpeak) opts.onSpeak(t._w, t);
    light(key, true);
    try {
      await Promise.resolve(t._w.say ? t._w.say() : null);
    } catch (e) {
      /* a missing clip: the tile still lit */
    }
    light(key, false);
  }
  Object.values(tiles).forEach(paint);
  return {
    el: box,
    tile: (key) => tiles[key] || null,
    keys: () => Object.keys(tiles),
    say,
    light,
    lightAll(on) {
      Object.keys(tiles).forEach((k) => light(k, on));
    },
    repaint() {
      Object.values(tiles).forEach(paint);
    },
    steps(n, done, cur) {
      pips.innerHTML = "";
      pips.hidden = n <= 1;
      for (let i = 0; i < n; i++) {
        const d = el("i", i < done ? "wt-step done" : i === cur ? "wt-step cur" : "wt-step", pips);
        d.dataset.i = String(i);
      }
    },
    destroy() {
      box.remove();
    },
  };
}


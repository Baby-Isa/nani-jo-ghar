/*
 * Who's hiding? (prototype, proto-safari 2 Nov 2026; build/reports/designs/safari.md §3B and its critique).
 *
 * The long grass at the end of the ride: grass clumps in one band, an animal behind each with one part showing (the elephant's
 * ears and back, the giraffe's neck, the zebra's tail). Hannah Mami says one instruction, big in her box, with the shared word
 * tiles under her (a tile for every animal, and the parts or the looks; none glows for the answer). Tap a clump: the grass
 * rustles and the animal pops up. The right one: "Ker ai? The zebra! Shabash" and the instruction ticks (gold first go); then
 * everyone ducks and comes up behind new clumps (nothing is used up, so nothing is won by elimination). A wrong one pops up
 * too, wobbles ("not me!"), she says who it is, it ducks back down and she asks again (the instruction will tick plain).
 * At the end, "Everybody out!": they all pop up, the camera's frame goes gold over the group, and a tap inside takes the
 * group photo (the Snap gesture).
 *   L1  the name: "The zebra is hiding. Kida ai?" 3 finds
 *   L2  the part decides: "Find the kan!" (ears: Mum's word), the neck, the tail. 3 finds
 *   L3  the look decides, every clump showing a back: "Where's the stripy one?" (spotty, grey) 5 finds
 *   L4  big and small: a big and a small giraffe among four clumps: "The nindho giraffe is hiding. Kida ai?" 5 finds
 * Not built (the design's): the L3+ speaking turn with the binoculars ("Ker ai?", the child names it), the random part per
 * hide (each animal always shows the same part at L1-L2), the pop-up's own animal tricks (the spray, the sway, the chewing),
 * a baby elephant at L4, the photo going to the book.
 */
import { ANIMALS, PARTS, LOOKS, HIDE } from "./art.js";

const it = (kind, mods) => (mods && mods.length ? { fn: "Item", kind, mods } : { fn: "Item", kind });
const SIZE = { big: "a.big", small: "a.small" };
const WHERE = { fn: "Say", x: "phrase.where-is-it" };
const WHO = { fn: "Ask", x: "phrase.whos-there" };
const WELL = { fn: "Exclaim", x: "phrase.well-done" };

/** The hiders: a picture, its height (a share of the play area's), and its parts: the share of it above the grass and the clip. */
const HIDERS = {
  elephant: { kind: "elephant", img: ANIMALS.elephant.img, h: 0.36, part: "ears", look: "grey", show: { part: { share: 0.42, clip: "0 0 0 0" }, back: { share: 0.4, clip: "0 0 0 45%" } } },
  giraffe: { kind: "giraffe", img: ANIMALS.giraffe.img, h: 0.5, part: "neck", look: "spotty", size: "big", show: { part: { share: 0.5, clip: "0 0 0 0" }, back: { share: 0.62, clip: "45% 0 0 0" } } },
  zebra: { kind: "zebra", img: ANIMALS.zebra.img, h: 0.38, part: "tail", look: "stripy", show: { part: { share: 0.62, clip: "28% 0 0 55%" }, back: { share: 0.55, clip: "30% 0 0 35%" } } },
  smallGiraffe: { kind: "giraffe", img: ANIMALS.giraffe.small, h: 0.32, part: "neck", size: "small", show: { part: { share: 0.5, clip: "0 0 0 0" } } },
};
const ICON = {
  ears: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M30 6C16 6 8 16 8 26c0 8 6 10 10 10 2 6 6 8 10 6s2-8 6-12c4-5 8-8 8-14 0-6-6-10-12-10z" fill="currentColor"/></svg>',
  neck: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M26 4h10l-4 6-2 34h-8l2-30-6-4z" fill="currentColor"/></svg>',
  tail: '<svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"><path d="M8 8c10 2 14 8 14 18s2 12 6 14"/><path d="M28 36l6 8M28 40l2 6M28 38l8 4" stroke-width="3.5"/></svg>',
  stripy: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="4" y="4" width="40" height="40" rx="6" fill="var(--njg-white)"/><path d="M10 4v40M20 4v40M30 4v40M40 4v40" stroke="var(--njg-ink-outline)" stroke-width="5"/></svg>',
  spotty: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="4" y="4" width="40" height="40" rx="6" fill="var(--njg-cream)"/><g fill="var(--njg-brown)"><circle cx="14" cy="14" r="5"/><circle cx="32" cy="12" r="4"/><circle cx="24" cy="26" r="5"/><circle cx="12" cy="34" r="4"/><circle cx="35" cy="34" r="5"/></g></svg>',
  grey: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="4" y="4" width="40" height="40" rx="6" fill="var(--njg-pewter)"/></svg>',
};

export default async function hiding(F) {
  const lv = F.level;
  const N = [3, 3, 5, 5][lv - 1];
  const doc = F.root.ownerDocument;
  const W = doc.defaultView;
  const who = lv === 4 ? ["giraffe", "smallGiraffe", "elephant", "zebra"] : ["elephant", "giraffe", "zebra"];
  const nC = who.length;
  const hc = nC === 4 ? 0.2 : 0.25; // the clump's height
  const foot = 0.88;
  const xs = nC === 4 ? [0.13, 0.38, 0.63, 0.88] : [0.18, 0.5, 0.82];
  const showOf = (id) => (lv === 3 ? HIDERS[id].show.back || HIDERS[id].show.part : HIDERS[id].show.part);

  /* ----- the scene: the sky, the far hills, the grass, the clumps, the hiders ----- */
  F.scene.insertAdjacentHTML("beforeend", `<div class="sf-savannah"><img class="sf-hills" alt="" src="${typeof W.njgV === "function" ? W.njgV(HIDE.hills) : HIDE.hills}"><div class="sf-far"></div><div class="sf-ground"></div></div>`);
  const clumps = xs.map((x, i) => {
    const c = F.put("sf-clump", { x, y: foot, h: hc, img: HIDE.clump, tag: "button" });
    c.setAttribute("aria-label", "grass");
    c.dataset.i = String(i);
    return c;
  });
  const hiders = {};
  for (const id of who) {
    const h = HIDERS[id];
    const el = F.put("sf-hider", { x: 0.5, y: foot, h: h.h, img: h.img });
    hiders[id] = { id, el, at: -1, ...h };
  }
  let order = F.shuffle(who);
  /** Everyone behind their clump: the part above the grass, the rest clipped or behind the grass. */
  function hide() {
    order.forEach((id, i) => {
      const h = hiders[id];
      const s = showOf(id);
      const top = foot - hc;
      const f = Math.min(foot - 0.01, top + (1 - s.share) * h.h);
      h.at = i;
      h.el.style.setProperty("--x", String(xs[i]));
      h.el.style.setProperty("--y", String(f));
      h.el.querySelector("img").style.clipPath = `inset(${s.clip})`;
      h.el.style.setProperty("--pop", String(((f - (top + hc * 0.15)) / h.h) * 100));
      h.el.classList.remove("out");
    });
  }
  const hiderAt = (i) => Object.values(hiders).find((h) => h.at === i);

  /* ----- the asks (with replacement: the same one can come twice), one row each ----- */
  const asks = [];
  for (let i = 0; i < N; i++) {
    let id = F.pick(who);
    if (lv === 4 && F.rng() < 0.65) id = F.pick(["giraffe", "smallGiraffe"]);
    asks.push(id);
  }
  const nameOf = (h) => it(ANIMALS[h.kind].lex, lv === 4 && h.size ? [SIZE[h.size]] : null);
  const rows = asks.map((id, i) => {
    const h = HIDERS[id];
    let line;
    let word;
    let tiles;
    if (lv === 2) {
      line = { fn: "FindTheX", x: it(PARTS[h.part].lex) };
      word = it(PARTS[h.part].lex);
      tiles = [h.part];
    } else if (lv === 3) {
      line = { fn: "WhereSTheXOne", x: it(LOOKS[h.look].lex) };
      word = it(LOOKS[h.look].lex);
      tiles = [h.look];
    } else {
      line = [{ fn: "TheXIsHiding", x: nameOf(h) }, WHERE];
      word = nameOf(h);
      tiles = [h.kind].concat(lv === 4 && h.size ? [h.size] : []);
    }
    return F.row({ key: `hide${i}`, line, word, tiles, data: { id }, target: () => clumps[hiders[id].at] });
  });

  /* ----- the tiles: every animal; the parts (L2), the looks (L3), big and small (L4); neutral pictures ----- */
  const icon = (k) => (box) => box.insertAdjacentHTML("beforeend", `<span class="sf-icon">${ICON[k]}</span>`);
  const groups = [{ label: it("n.wild-animals"), tiles: Object.keys(ANIMALS).map((k) => ({ key: k, word: it(ANIMALS[k].lex), lex: ANIMALS[k].lex, picture: ANIMALS[k].img })) }];
  if (lv === 2) groups.push({ label: it("n.what-shows"), tiles: Object.keys(PARTS).map((p) => ({ key: p, word: it(PARTS[p].lex), lex: PARTS[p].lex, picture: icon(p) })) });
  if (lv === 3) groups.push({ label: it("n.what-shows"), tiles: Object.keys(LOOKS).map((p) => ({ key: p, word: it(LOOKS[p].lex), lex: LOOKS[p].lex, picture: icon(p) })) });
  if (lv === 4)
    groups.push({ label: it("n.big-and-small"), tiles: [{ pair: ["small", "big"].map((z) => ({ key: z, word: it(ANIMALS.giraffe.lex, [SIZE[z]]), lex: SIZE[z], picture: (box) => box.insertAdjacentHTML("beforeend", `<span class="sf-size ${z}"></span>`) })) }] });
  F.sentence(groups);
  hide();

  /* ----- a find, and everyone re-hides ----- */
  let busy = false;
  async function rehide() {
    Object.values(hiders).forEach((h) => h.el.classList.add("down"));
    clumps.forEach((c, i) => F.after(F.T(80 * i), () => F.jiggle(c, "rustle")));
    await F.sleep(F.T(450));
    const was = order.slice();
    // (new places: never everyone in the same place again)
    for (let n = 0; n < 6 && order.every((id, i) => was[i] === id); n++) order = F.shuffle(who);
    hide();
    await F.sleep(F.T(60));
    Object.values(hiders).forEach((h) => h.el.classList.remove("down"));
    await F.sleep(F.T(450));
  }
  F.beforeNext = async () => {
    await found;
    await rehide();
    busy = false;
  };
  let found = Promise.resolve();
  clumps.forEach((c, i) =>
    F.on(c, "click", async () => {
      F.acted();
      const r = F.current();
      if (busy || !r || !F.live) return;
      busy = true;
      const h = hiderAt(i);
      F.jiggle(c, "rustle");
      h.el.classList.add("out");
      if (h.id === r.data.id || (lv !== 4 && h.kind === HIDERS[r.data.id].kind) || (lv === 3 && h.look === HIDERS[r.data.id].look)) {
        // (her find line, said while the row ticks; the re-hide waits for it)
        found = F.speak([F.say(WHO), F.say(nameOf(h)), F.say(WELL)]);
        F.add(r);
        if (rows.every((x) => x.done)) busy = false;
        return;
      }
      F.oops(r, h.el, { line: false });
      F.stopVoice();
      await F.speak(F.say({ fn: "ThatSTheX", x: nameOf(h) }));
      h.el.classList.remove("out");
      await F.sleep(F.T(300));
      busy = false;
      if (!F.dead && F.current() === r) F.sayLine(r);
    })
  );

  /* ----- the round, then everybody out and the group photo ----- */
  await F.ask({ guide: "hide-head" });
  F.begin();
  F.teach("hide-tap", () => rows[0] && rows[0].target && rows[0].target());
  await new Promise((res) => F.whenAll(res));
  await found;
  await F.sleep(F.T(400));
  F.setGuide("hide-out");
  F.speak(F.lineOf("hide-out"));
  Object.values(hiders).forEach((h) => h.el.classList.add("out"));
  await F.sleep(F.T(700));
  // the group photo: the Snap kit's frame over everyone, gold; a tap inside takes it
  const pr = F.play.getBoundingClientRect();
  const boxes = Object.values(hiders).map((h) => h.el.getBoundingClientRect());
  const L = Math.min(...boxes.map((b) => b.left)) - pr.left;
  const T = Math.min(...boxes.map((b) => b.top)) - pr.top;
  const R = Math.max(...boxes.map((b) => b.right)) - pr.left;
  const B = Math.max(...clumps.map((c) => c.getBoundingClientRect().bottom)) - pr.top;
  const frame = doc.createElement("button");
  frame.type = "button";
  frame.className = "sf-frame sf-group-frame";
  frame.setAttribute("aria-label", "Take the photo");
  frame.innerHTML = "<i></i><i></i><i></i><i></i>";
  Object.assign(frame.style, { left: `${Math.max(0, L - 10)}px`, top: `${Math.max(0, T - 10)}px`, width: `${Math.min(pr.width, R + 10) - Math.max(0, L - 10)}px`, height: `${Math.min(pr.height, B + 6) - Math.max(0, T - 10)}px` });
  F.scene.appendChild(frame);
  F.after(F.T(420), () => frame.classList.add("gold"));
  const flash = doc.createElement("div");
  flash.className = "sf-flash";
  F.scene.appendChild(flash);
  const shot = new Promise((res) => F.on(frame, "click", res));
  F.teach("hide-photo", frame);
  await shot;
  if (W.Sfx) W.Sfx.play("click");
  flash.classList.add("on");
  frame.remove();
  await F.finish(async () => {
    Object.values(hiders).forEach((h, i) => F.after(F.T(120 * i), () => F.jiggle(h.el, "sf-pop")));
    await F.sleep(F.T(700));
  });
}

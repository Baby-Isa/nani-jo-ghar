/*
 * The picnic (prototype, proto-beach 2 Nov 2026; build/reports/designs/beach-boat.md §3.4).
 *
 * The cloth on the sand; behind it Nani (middle) and Masi (right); the child's cushion at the front left; Ali's tiffin box at the
 * cloth's right edge (Ali isn't there: his box stands in for him); the basket at the left. EVERY SPOT IS OUTLINED THE SAME (Zafar's
 * rule from pick it up and put it back): a plate place and a cup place in front of each of the three, the middle of the cloth and
 * Ali's box: eight, every time, so the owner word picks the spot, never the picture. THE SENTENCE LAYOUT: Masi says one at a time,
 * the word tiles under her: People (Nani, Masi, Ali) and, from L2, Food and things (corn, chips, coconut, cup, plate).
 *   L1  the basket hands out one thing at a time ("Hi Nani lai ai.": this is for Nani): tap a place of hers; it hops there (the
 *       right kind of place: a cup to her cup place). A place of someone else: it slides back, her line again.
 *   L2  "The two cups are for Masi" (the frame to record): tap the thing in the basket row, then her place, once per thing; the
 *       count ticks at its number and an extra one doesn't land.
 *   L3, L4  as L2 (positions with owners, "next to her plate", "in the middle", and the L4 pour: not built)
 * The end: everyone eats; the crab climbs out of the basket, snips the last chip and scuttles off; Masi: "O, kenjo nai!".
 */
import { PICS, PEOPLE } from "./art.js";

const KIND = {
  corn: { lex: "n.corn-on-the-cob", img: PICS.cornDone, place: "plate" },
  chips: { lex: "n.chips-english", img: PICS.chipsGolden, place: "plate" },
  coconut: { lex: "n.coconut", img: null, place: "plate" },
  cup: { lex: "n.cup", img: PICS.cup, place: "cup" },
  plate: { lex: "n.plate", img: PICS.plate, place: "plate" },
};
const OWNERS = ["nani", "masi", "ali"];
const I = (kind, extra) => Object.assign({ fn: "Item", kind }, extra || {});

export default async function picnic(F) {
  const lv = F.level;
  let asks;
  if (lv === 1) {
    const owners = F.shuffle(OWNERS.concat([F.pick(OWNERS)]));
    const kinds = F.shuffle(["corn", "chips", "coconut", "cup"]);
    asks = owners.map((owner, i) => ({ owner, kind: kinds[i], n: 1 }));
  } else {
    const owners = F.shuffle(OWNERS);
    const kinds = F.shuffle(["cup", "plate", "corn"]);
    const ns = F.shuffle([2, 1, 2]);
    asks = owners.map((owner, i) => ({ owner, kind: kinds[i], n: ns[i] }));
  }

  /* ----- the scene ----- */
  F.scene.insertAdjacentHTML("beforeend", '<div class="bp-sky"></div><div class="bp-horizon"></div><div class="bp-far-sand"></div>');
  const person = (id, x) => {
    const p = F.put("bp-person", { x, y: 0.56, h: 0.3, html: `<span class="bp-body"></span><img class="bp-face" src="${PEOPLE[id].face}" alt="">` });
    p.dataset.who = id;
    return p;
  };
  person("nani", 0.5);
  person("masi", 0.76);
  const cloth = F.put("bp-cloth", { x: 0.58, y: 0.97, h: 0.44, w: 0.78 });
  cloth.classList.add("wide");
  F.put("bp-cushion", { x: 0.3, y: 1.02, h: 0.08, w: 0.16 }).classList.add("wide");
  const SPOTS = [
    { owner: "nani", place: "plate", x: 0.5, y: 0.7 },
    { owner: "nani", place: "cup", x: 0.61, y: 0.68 },
    { owner: "masi", place: "plate", x: 0.76, y: 0.7 },
    { owner: "masi", place: "cup", x: 0.87, y: 0.68 },
    { owner: "me", place: "plate", x: 0.3, y: 0.94 },
    { owner: "me", place: "cup", x: 0.41, y: 0.92 },
    { owner: "mid", place: "middle", x: 0.6, y: 0.84 },
    { owner: "ali", place: "box", x: 0.86, y: 0.95 },
  ];
  const spotEls = SPOTS.map((s) => {
    const el = F.put(`bp-place${s.place === "box" ? " bp-tiffin" : ""}`, { x: s.x, y: s.y, h: s.place === "box" ? 0.14 : 0.1, w: s.place === "box" ? 0.12 : 0.1, tag: "button" });
    el.classList.add("wide");
    el.dataset.owner = s.owner;
    el.dataset.place = s.place;
    el.setAttribute("aria-label", `${s.owner} ${s.place}`);
    return el;
  });
  const basket = F.put("bp-basket", { x: 0.12, y: 0.99, h: 0.15, html: `<img src="${PICS.basketBack}" alt="">` });
  const thingPic = (k) => (KIND[k].img ? `<img src="${KIND[k].img}" alt="">` : '<span class="bp-coconut"></span>');
  // the basket row (L2+): one of each kind, always there (it refills)
  const rowEls = {};
  if (lv >= 2)
    ["corn", "chips", "coconut", "cup", "plate"].forEach((k, i) => {
      const el = F.put("bp-pthing", { x: 0.1, y: 0.2 + i * 0.13, h: 0.1, tag: "button", html: thingPic(k) });
      el.dataset.kind = k;
      el.setAttribute("aria-label", k);
      rowEls[k] = el;
    });

  /* ----- her instructions ----- */
  let inHand = null; // L1: the thing the basket handed out
  let chosen = null; // L2: the thing picked in the basket row
  const rows = asks.map((a, i) =>
    F.row({
      key: `put${i}`,
      line: lv === 1 ? { fn: "ForWho", x: I(PEOPLE[a.owner].lex) } : { fn: "TheXIsForY", x: I(KIND[a.kind].lex, a.n > 1 ? { n: a.n } : {}), y: I(PEOPLE[a.owner].lex) },
      word: I(PEOPLE[a.owner].lex),
      need: a.n,
      tiles: lv === 1 ? [a.owner] : [a.owner, a.kind],
      target: () => (lv >= 2 && chosen !== a.kind ? rowEls[a.kind] : spotFor(a.owner, a.kind)),
      data: a,
    })
  );
  const spotFor = (owner, kind) => spotEls.find((s) => s.dataset.owner === owner && (owner === "ali" || s.dataset.place === KIND[kind].place));

  /* ----- the tiles ----- */
  const face = (id) => (box) => box.insertAdjacentHTML("beforeend", `<img class="bp-tileimg bp-tileface" src="${PEOPLE[id].face}" alt="">`);
  const groups = [{ label: { en: "people" }, tiles: OWNERS.map((id) => ({ key: id, word: I(PEOPLE[id].lex), lex: PEOPLE[id].lex, picture: face(id) })) }];
  if (lv >= 2)
    groups.push({
      label: { en: "food" },
      tiles: ["corn", "chips", "coconut", "cup", "plate"].map((k) => ({
        key: k,
        word: I(KIND[k].lex),
        lex: KIND[k].lex,
        picture: (box) => box.insertAdjacentHTML("beforeend", KIND[k].img ? `<img class="bp-tileimg" src="${KIND[k].img}" alt="">` : '<span class="bp-tilepic bp-coconut"></span>'),
      })),
    });
  F.sentence(groups);

  /* ----- the moves ----- */
  let busy = false;
  function handOut() {
    if (lv >= 2) return;
    const r = F.current();
    if (inHand) inHand.remove();
    inHand = null;
    if (!r) return;
    inHand = F.put("bp-pthing bp-inhand", { x: 0.1, y: 0.74, h: 0.13, html: thingPic(r.data.kind) });
    F.jiggle(inHand);
  }
  Object.values(rowEls).forEach((el) =>
    F.on(el, "click", () => {
      F.acted();
      if (busy) return;
      Object.values(rowEls).forEach((x) => x.classList.toggle("lifted", x === el));
      chosen = el.dataset.kind;
    })
  );
  const placed = new Map();
  spotEls.forEach((spot) =>
    F.on(spot, "click", async () => {
      F.acted();
      const r = F.current();
      if (!r || busy) return;
      const a = r.data;
      const from = lv === 1 ? inHand : rowEls[chosen];
      if (!from) return F.jiggle(spot, "bp-shake");
      const kind = lv === 1 ? a.kind : chosen;
      if (spot.dataset.owner !== a.owner || kind !== a.kind) {
        // it slides back; her line again
        if (from) F.jiggle(from, "bp-shake");
        return F.oops(r, spot);
      }
      if (F.full(r)) return F.jiggle(spot, "bp-shake");
      busy = true;
      const to = spotFor(a.owner, kind);
      await F.fly(KIND[kind].img, from, to, { cls: KIND[kind].img ? "" : "bp-coconut", size: to.getBoundingClientRect().height * 0.9, ms: 420 });
      const n = (placed.get(to) || 0) + 1;
      placed.set(to, n);
      to.insertAdjacentHTML("beforeend", `<span class="bp-on" style="--k:${n - 1}">${thingPic(kind)}</span>`);
      to.classList.add("has");
      F.jiggle(to);
      F.add(r);
      busy = false;
      if (lv === 1 && r.done) F.after(F.T(400), handOut);
    })
  );

  await F.ask({ guide: "pc-head" });
  handOut();
  F.begin();
  F.teach("place", () => rows[0].target && rows[0].target());
  await new Promise((res) => F.whenAll(res));
  if (inHand) inHand.remove();
  await F.finish(async () => {
    // everyone eats; the crab out of the basket snips the last chip and scuttles off
    const crab = F.put("bp-crab", { x: 0.1, y: 0.84, h: 0.07 });
    await F.sleep(F.T(500));
    crab.style.setProperty("--x", "1.2");
    await F.speak(F.say({ fn: "Exclaim", x: "phrase.oh-no-theres-no-food" }));
    crab.remove();
  });
}

/*
 * Going home (prototype, proto-pets 2 Nov 2026; build/reports/designs/adoption-centre.md §3 stage B, its critique finding 4).
 *
 * The end of the day at Hannah Mami's pet hotel: the pets stand forward along the counter in one line, the same size and all happy
 * (the small rabbit is smaller: that's the L4 word). A family (a mother and a girl with a basket: the party's stand-ins) comes up
 * behind the counter and says who they've come for ("We've come for the dog": the engine, the frame to record). THE SENTENCE
 * LAYOUT: their line, big in the box, and the word tiles under it: Animals, a tile for every kind on the counter; no tile glows for
 * the answer. Tap the pet they named: it hops into the girl's basket (the dog walks off with them: kept outdoors, no hug), the girl
 * bounces, "Achija!" (bye), they leave, and the next family comes. A wrong pet wobbles, nothing marked; their line again.
 * NEVER FORCED BY ELIMINATION: the hotel has more than one pet of a kind, every family's pet is drawn from what's left, and when a
 * family comes at least two kinds are still on the counter.
 *   L1  dogs and ants (two of each), 3 families
 *   L2  dog, ant, rabbit, bee (6 pets), 4 families
 *   L3  the cat joins (7 pets), 5 families
 *   L4  the big and the small rabbit among them (7 pets), 5 families; "we've come for the small rabbit" at least once
 * Not built: the doorbell's chime, the girl's hug pose, the pet's goodbye trick, the photo for the evening book, Hannah Mami's "aah".
 */
import { FAMILY } from "./art.js";
import { yard, matXs, animal } from "./yard.js";
import { specOf, np } from "./care.js";

export default async function home(F) {
  const lv = F.level;
  /* ----- the pets on the counter, and the families' picks ----- */
  const kinds = [["dog", "ant"], ["dog", "ant", "rabbit", "bee"], ["dog", "ant", "rabbit", "bee", "cat"], ["dog", "ant", "bee", "cat", "rabbit-small", "rabbit-big"]][lv - 1];
  const nPets = [4, 6, 7, 7][lv - 1];
  const nFam = [3, 4, 5, 5][lv - 1];
  const pets = kinds.slice();
  while (pets.length < nPets) pets.push(F.pick(kinds));
  const line = F.shuffle(pets);
  const left = line.slice();
  const picks = [];
  for (let i = 0; i < nFam; i++) {
    const kindsLeft = [...new Set(left)];
    let ok = kindsLeft.filter((k) => {
      const after = left.slice();
      after.splice(after.indexOf(k), 1);
      return i === nFam - 1 || new Set(after).size >= 2; // (the next family still has a real choice)
    });
    if (lv === 4 && i === nFam - 1 && !picks.some((k) => /^rabbit-/.test(k))) ok = ok.filter((k) => /^rabbit-/.test(k)).length ? ok.filter((k) => /^rabbit-/.test(k)) : ok;
    const k = F.pick(ok.length ? ok : kindsLeft);
    picks.push(k);
    left.splice(left.indexOf(k), 1);
  }

  /* ----- the scene: the yard, the family behind the counter, the pets in one line (the same height: only the word picks) ----- */
  yard(F);
  const mum = F.put("pt-mum pt-family-away", { x: 0.44, y: 0.6, h: 0.4, img: FAMILY.mum });
  const girl = F.put("pt-girl pt-family-away", { x: 0.6, y: 0.6, h: 0.3, img: FAMILY.girl });
  const basket = F.put("pt-basket pt-family-away", { x: 0.6, y: 0.62, h: 0.1, img: FAMILY.basket });
  const xs = matXs(line.length);
  const SAME_H = 0.2;
  const els = line.map((k, i) => {
    const s = specOf(k);
    const h = k === "rabbit-small" ? SAME_H * 0.6 : SAME_H;
    return animal(F, k, s, xs[i], { y: 0.86, h, mat: false });
  });

  /* ----- the families' lines: one row each ----- */
  const rows = picks.map((k, i) =>
    F.row({
      key: `home-${k}-${i}`,
      line: { fn: "WeVeComeForTheX", x: np(k) },
      word: np(k),
      tiles: [k],
      target: () => els.find((e) => e.dataset.k === k && !e.classList.contains("gone")),
      data: { k },
    })
  );
  const tile = (k) => {
    const s = specOf(k);
    return { key: k, word: np(k), lex: s.pair || s.lex, picture: s.pair ? (box) => box.insertAdjacentHTML("beforeend", `<img class="pt-tilepic ${k}" src="${F.stampUrl(s.img)}" alt="">`) : s.img };
  };
  const plain = kinds.filter((k) => !specOf(k).pair);
  F.sentence([{ label: { fn: "Item", kind: "n.animals" }, tiles: [...(lv === 4 ? [{ pair: [tile("rabbit-small"), tile("rabbit-big")] }] : []), ...plain.map(tile)] }]);

  const family = (on) => [mum, girl, basket].forEach((e) => e.classList.toggle("pt-family-away", !on));
  let busy = false;
  els.forEach((el) =>
    F.on(el, "click", async () => {
      F.acted();
      const r = F.current();
      if (!r || busy || el.classList.contains("gone")) return;
      if (el.dataset.k !== r.data.k) {
        F.oops(r, el); // a wobble; it stays; their line again
        return;
      }
      busy = true;
      el.classList.add("gone");
      const dog = el.dataset.k === "dog";
      await F.fly(specOf(el.dataset.k).img, el, dog ? mum : basket, { size: el.getBoundingClientRect().height, ms: 560 });
      F.jiggle(girl);
      F.add(r); // (it ticks now; the next family's line comes after the goodbye: F.setNext below)
      await F.speak(F.say({ fn: "Say", x: "phrase.bye" }), { cap: F.T(1300) });
      family(false);
      await F.sleep(F.T(600));
      if (F.current()) family(true);
      busy = false;
    })
  );

  F.setNext(2400);
  family(true);
  await F.ask({ guide: "home-head" });
  F.begin();
  F.teach("pick", () => rows[0].target && rows[0].target());
  await new Promise((res) => F.whenAll(res));
  await F.finish(async () => {
    els.filter((e) => !e.classList.contains("gone")).forEach((e) => F.jiggle(e));
    await F.sleep(F.T(500));
  });
}

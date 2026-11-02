/*
 * The party presents (prototype, proto-party 2 Nov 2026; build/reports/designs/party-gifts.md §3 B1, its critique). Zara's
 * family has a thank-you present for everyone, in plain brown boxes, and you help Nani hand them out (THE SENTENCE LAYOUT: her
 * one instruction at a time, the word tiles under her: the toys and everyone in the room). Tap a box: it bursts open and the
 * toy jumps out. Tap the toy, then the person she names: they take it and play (a bounce), the instruction ticks. A wrong
 * person: a wobble and a grin, the toy goes back; she says it again (it ticks plain).
 *
 * The design's drum is a TOY CAR here: the family's rule, no musical instruments (Zafar's brief, 2 Nov). The car is gadi, in
 * the engine (confirmed).
 *   L1  three boxes, one toy each; "Hi Nana lai ai." (this is for Nana; Mum's recording): only who it's for matters.
 *   L2  two boxes, five toys between them (a ball twice: items repeat, so the last is never forced); three asked:
 *       "The gadi is for Zara." (the frame to record), so the toy and the person both come from the words. The baby is here.
 * Not built: L3 "it's yours / it's Zara's", the end "whose is it? mine!". To record (grey English): ball, teddy, balloon, baby,
 * "The {x} is for {y}.", her opening line.
 */
import { CAST, TOYS, SVG } from "./art.js";

export default {
  opts: {},
  async run(F) {
    const lv = F.level;
    const stamp = F.stamp;
    F.scene.insertAdjacentHTML("beforeend", '<div class="pp-wall"></div><div class="pp-bunting"></div><div class="pp-bunting b3"></div><div class="pp-floor"></div><div class="pp-sofa"></div>');

    /* ----- the people ----- */
    const who = lv === 1 ? ["nana", "zara", "yusuf"] : ["nana", "zara", "yusufMum", "yusuf"];
    const xs = who.length === 3 ? [0.22, 0.5, 0.78] : [0.14, 0.38, 0.62, 0.86];
    const els = {};
    who.forEach((id, i) => {
      const el = F.put("pp-person", { x: xs[i], y: 0.74, h: CAST[id].h, img: CAST[id].img, tag: "button", z: 3 });
      el.setAttribute("aria-label", id === "yusufMum" ? "the baby" : id);
      els[id] = el;
    });

    /* ----- the boxes and the toys inside ----- */
    const kinds = Object.keys(TOYS);
    const boxesToys = lv === 1 ? F.shuffle(kinds).slice(0, 3).map((k) => [k]) : (() => {
      const five = F.shuffle(["car", "ball", "teddy", "balloon", "ball"]);
      return [five.slice(0, 3), five.slice(3)];
    })();
    const bx = boxesToys.length === 3 ? [0.3, 0.5, 0.7] : [0.35, 0.65];
    const toys = [];
    const boxes = boxesToys.map((list, i) => {
      const b = F.put("pp-box", { x: bx[i], y: 0.93, h: 0.15, tag: "button", z: 8 });
      b.setAttribute("aria-label", "a present");
      b.list = list;
      return b;
    });

    /* ----- the instructions ----- */
    const lexOf = { nana: "pn.nana", zara: "pn.zara", yusuf: "pn.yusuf" };
    const npOf = (id) => (id === "yusufMum" ? { fn: "Item", kind: "n.baby" } : lexOf[id]);
    const keyOf = (id) => (id === "yusufMum" ? "baby" : id);
    const people = F.shuffle(who);
    let asks;
    if (lv === 1) asks = people.slice(0, 3).map((id) => ({ who: id, toy: null }));
    else {
      const all = boxesToys.flat();
      const ks = F.shuffle([...new Set(all)]).slice(0, 3);
      asks = ks.map((k, i) => ({ who: people[i], toy: k }));
    }
    let held = null;
    const rows = asks.map((a, i) =>
      F.row({
        key: `gift${i}`,
        line: a.toy ? { fn: "TheXIsForY", x: { fn: "Item", kind: TOYS[a.toy].lex }, y: npOf(a.who) } : { fn: "ForWho", x: npOf(a.who) },
        word: a.toy ? { fn: "Item", kind: TOYS[a.toy].lex } : { fn: "For", x: npOf(a.who) },
        tiles: a.toy ? [a.toy, keyOf(a.who)] : [keyOf(a.who)],
        picture: null,
        target: () => {
          const fit = toys.find((t) => !t.used && (!a.toy || t.kind === a.toy));
          if (held && (!a.toy || held.kind === a.toy)) return els[a.who];
          return fit ? fit.el : boxes.find((b) => !b.opened);
        },
        data: a,
      })
    );

    /* ----- the word tiles ----- */
    const imgPic = (src) => (box) => box.insertAdjacentHTML("beforeend", `<img class="pp-tile-pic" alt="" src="${stamp(src)}">`);
    const toyPic = (k) => (TOYS[k].img ? imgPic(TOYS[k].img) : (box) => box.insertAdjacentHTML("beforeend", SVG[TOYS[k].svg].replace("<svg", '<svg class="pp-tile-svg"')));
    const toyTiles = kinds.map((k) => ({ key: k, word: { fn: "Item", kind: TOYS[k].lex }, lex: TOYS[k].lex, picture: toyPic(k) }));
    const peopleTiles = [
      { key: "nana", word: { fn: "Item", kind: "pn.nana" }, lex: "pn.nana", picture: imgPic(CAST.nana.head) },
      { key: "zara", word: { fn: "Item", kind: "pn.zara" }, lex: "pn.zara", picture: imgPic(CAST.zara.head) },
      { key: "yusuf", word: { fn: "Item", kind: "pn.yusuf" }, lex: "pn.yusuf", picture: imgPic(CAST.yusuf.head) },
    ];
    if (lv >= 2) peopleTiles.push({ key: "baby", word: { fn: "Item", kind: "n.baby" }, lex: "n.baby", picture: (box) => box.insertAdjacentHTML("beforeend", SVG.baby.replace("<svg", '<svg class="pp-tile-svg"')) });
    F.sentence([
      { label: { en: "toys" }, tiles: toyTiles },
      { label: { en: "family" }, tiles: peopleTiles },
    ]);

    /* ----- play ----- */
    const hold = (t) => {
      held = t;
      toys.forEach((x) => {
        x.el.classList.toggle("sel", x === t);
        x.el.classList.toggle("lift", x === t);
      });
    };
    boxes.forEach((b, i) =>
      F.on(b, "click", () => {
        F.acted();
        if (b.opened) return;
        b.opened = true;
        b.classList.add("open");
        if (window.Sfx) window.Sfx.play("pop", { volume: 0.4 });
        b.list.forEach((k, j) => {
          const n = b.list.length;
          const x = bx[i] + (n === 1 ? 0 : (j - (n - 1) / 2) * 0.09);
          const t = TOYS[k];
          const el = F.put("pp-toy", { x, y: 0.95, h: t.h, img: t.img || null, tag: "button", z: 9, html: t.svg ? `<span class="pp-shape">${SVG[t.svg]}</span>` : null });
          el.setAttribute("aria-label", k);
          el.classList.add("out");
          const toy = { kind: k, el, used: false };
          toys.push(toy);
          F.on(el, "click", (ev) => {
            ev.stopPropagation();
            F.acted();
            if (toy.used) return;
            hold(held === toy ? null : toy);
          });
        });
      })
    );
    let busy = false;
    Object.entries(els).forEach(([id, el]) =>
      F.on(el, "click", async () => {
        F.acted();
        const r = F.current();
        if (busy || !r) return;
        if (!held) return F.jiggle(el);
        if (id !== r.data.who || (r.data.toy && held.kind !== r.data.toy)) {
          // a wobble and a grin; the toy goes back; she says it again
          hold(null);
          return F.oops(r, el);
        }
        busy = true;
        const t = held;
        hold(null);
        t.used = true;
        const src = TOYS[t.kind].img;
        await F.fly(src, t.el, el, { ms: 520 });
        t.el.classList.add("gone");
        F.jiggle(el);
        if (window.Sfx) window.Sfx.play(t.kind === "teddy" ? "boing" : "pop", { volume: 0.35 });
        F.tick(r);
        busy = false;
      })
    );

    await F.ask({ guide: "gift-guide" });
    F.begin();
    F.teach("box", () => boxes[0]);
    await new Promise((res) => F.whenAll(res));
    await F.finish(async () => Object.values(els).forEach((el) => F.jiggle(el)));
  },
};

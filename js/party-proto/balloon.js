/*
 * Pass the balloon (prototype, proto-party 2 Nov 2026; build/reports/designs/party-guests.md §3 stage A, its critique; Zafar
 * 1 Nov: "the balloon: yes for now"). Zara's family sit in a row facing us. Whoever holds the balloon calls who gets it next
 * ("Give the balloon to Yusuf!"); the child taps that person and the balloon floats over: a soft bop on a child's head (they
 * hold it and call next), or into a grown-up's hands, who bats it back to a child. A wrong tap: the balloon puffs back with a
 * cheeky wobble, the call comes again, the call ticks plain.
 *
 * THE SENTENCE LAYOUT (proto brief, 2 Nov): no order card; the call is shown big in Zara's box, one at a time, its words
 * underlined; under it the word tiles: everyone in the row (L1: Zara, Yusuf, Nana by their faces; L2: Zara, Yusuf, and a
 * mum tile and an aunt tile with the same neutral woman's picture, so the tile never says which sister is which).
 *
 *   L1  the children say their names ("My name is Zara."), then three calls by name: Zara, Yusuf or Nana (Nana is ours).
 *   L2  only the two sisters are called: "Zara's mum", "Zara's aunt", "Yusuf's mum", "Yusuf's aunt" (Zara's aunt IS Yusuf's
 *       mum); the sisters swap seats each call, so only the words pick which one. Four calls.
 *   End Zara asks your name ("What's your name?") and the balloon floats down to you.
 *
 * To record (grey English): "My name is {x}.", "Give the balloon to {x}.", "What's your name?", Zara, Yusuf (names), mum and
 * aunt (masi) as kin words. The engine says "Zara jo mum": the gender of mum is unknown, so jo is its default (Mum: ji).
 */
import { CAST, FACES, SVG } from "./art.js";

export default {
  opts: { person: FACES.zara },
  async run(F) {
    const lv = F.level;
    const stamp = F.stamp;

    /* ----- the room and the row ----- */
    F.scene.insertAdjacentHTML("beforeend", '<div class="pp-wall"></div><div class="pp-bunting"></div><div class="pp-bunting b2"></div><div class="pp-bunting b3"></div><div class="pp-floor"></div><div class="pp-sofa"></div>');
    const ids = lv === 1 ? ["zara", "nana", "yusuf"] : ["zara", "zaraMum", "yusufMum", "yusuf"];
    let seats = ids.slice();
    const xsOf = (n) => Array.from({ length: n }, (_, i) => (n === 1 ? 0.5 : 0.18 + (0.64 * i) / (n - 1)));
    const els = {};
    const place = () => {
      const xs = xsOf(seats.length);
      seats.forEach((id, i) => els[id].style.setProperty("--x", String(xs[i])));
    };
    ids.forEach((id) => {
      const c = CAST[id];
      const el = F.put("pp-person", { x: 0.5, y: 0.94, h: c.h, img: c.img, tag: "button", z: 5 });
      el.style.transition = "left .8s ease-in-out";
      el.setAttribute("aria-label", id);
      els[id] = el;
    });
    place();
    const ball = document.createElement("div");
    ball.className = "pp-balloon";
    F.scene.appendChild(ball);
    const balloonTo = (id) => {
      const a = els[id].getBoundingClientRect();
      const pr = F.scene.getBoundingClientRect();
      ball.style.left = `${a.left + a.width / 2 - pr.left}px`;
      ball.style.top = `${a.top - pr.top + (CAST[id].child ? -pr.height * 0.06 : a.height * 0.3)}px`;
      F.jiggle(ball, "bop");
    };

    /* ----- the words ----- */
    const kin = (owner, k) => ({ fn: "Of", owner: CAST[owner].lex, thing: { fn: "Item", kind: k === "mum" ? "n.mum" : "n.aunt" } });
    // who each L2 call names: Zara's mum = zaraMum; Zara's aunt = yusufMum; Yusuf's mum = yusufMum; Yusuf's aunt = zaraMum
    const KIN = [
      { owner: "zara", k: "mum", who: "zaraMum" },
      { owner: "zara", k: "aunt", who: "yusufMum" },
      { owner: "yusuf", k: "mum", who: "yusufMum" },
      { owner: "yusuf", k: "aunt", who: "zaraMum" },
    ];
    let calls;
    if (lv === 1) {
      calls = [];
      let holder = "zara";
      let last = null;
      while (calls.length < 3) {
        const t = F.pick(ids.filter((x) => x !== holder && x !== last));
        calls.push({ who: t, holder, np: CAST[t].lex, tiles: [t] });
        last = t;
        holder = CAST[t].child ? t : holder;
      }
    } else {
      const order = F.shuffle(KIN.slice());
      let holder = "zara";
      calls = order.map((c) => {
        const o = { who: c.who, holder, np: kin(c.owner, c.k), tiles: [c.owner, c.k] };
        holder = holder === "zara" ? "yusuf" : "zara";
        return o;
      });
    }
    const headPic = (src) => (box) => {
      const i = document.createElement("img");
      i.src = stamp(src);
      i.alt = "";
      i.className = "pp-tile-pic";
      box.appendChild(i);
    };
    const svgPic = (name) => (box) => box.insertAdjacentHTML("beforeend", SVG[name].replace("<svg", '<svg class="pp-tile-svg"'));
    const rows = calls.map((c, i) =>
      F.row({
        key: `call${i}`,
        line: { fn: "GiveTheBalloonToX", x: c.np },
        word: typeof c.np === "string" ? { fn: "Item", kind: c.np } : c.np,
        picture: lv === 1 ? headPic(CAST[c.who].head) : svgPic("woman"),
        tiles: c.tiles,
        target: () => els[c.who],
        data: c,
      })
    );
    const people =
      lv === 1
        ? [
            { key: "zara", word: { fn: "Item", kind: "pn.zara" }, lex: "pn.zara", picture: headPic(CAST.zara.head) },
            { key: "yusuf", word: { fn: "Item", kind: "pn.yusuf" }, lex: "pn.yusuf", picture: headPic(CAST.yusuf.head) },
            { key: "nana", word: { fn: "Item", kind: "pn.nana" }, lex: "pn.nana", picture: headPic(CAST.nana.head) },
          ]
        : [
            { key: "zara", word: { fn: "Item", kind: "pn.zara" }, lex: "pn.zara", picture: headPic(CAST.zara.head) },
            { key: "yusuf", word: { fn: "Item", kind: "pn.yusuf" }, lex: "pn.yusuf", picture: headPic(CAST.yusuf.head) },
            { key: "mum", word: { fn: "Item", kind: "n.mum" }, lex: "n.mum", picture: svgPic("woman") },
            { key: "aunt", word: { fn: "Item", kind: "n.aunt" }, lex: "n.aunt", picture: svgPic("woman") },
          ];
    F.sentence([{ label: { en: "family" }, tiles: people }]);

    /* ----- the start: L1 the children say their names; the balloon with the first holder ----- */
    let holder = calls[0].holder;
    balloonTo(holder);
    if (lv === 1) {
      for (const id of ["zara", "yusuf"]) {
        if (F.dead) return;
        F.jiggle(els[id]);
        await F.bubble(els[id], F.lineOf({ fn: "MyNameIsX", x: CAST[id].lex }));
      }
    }
    const markHolder = () => Object.entries(els).forEach(([id, el]) => el.classList.toggle("pp-hold", id === holder));
    markHolder();

    let busy = false;
    Object.entries(els).forEach(([id, el]) =>
      F.on(el, "click", async () => {
        F.acted();
        const r = F.current();
        if (!r || busy) return;
        if (id === holder) return F.jiggle(el); // (the holder already has it: a little bounce)
        if (id !== r.data.who) {
          // a wrong tap: the balloon puffs towards them and back, a cheeky wobble; the call again
          busy = true;
          const was = ball.style.left;
          const a = el.getBoundingClientRect();
          const pr = F.scene.getBoundingClientRect();
          ball.style.left = `${(parseFloat(was) + (a.left + a.width / 2 - pr.left)) / 2}px`;
          F.oops(r, el);
          await F.sleep(F.T(600));
          balloonTo(holder);
          busy = false;
          return;
        }
        busy = true;
        balloonTo(id);
        if (window.Sfx) window.Sfx.play("boing", { volume: 0.25 });
        await F.sleep(F.T(950));
        F.jiggle(el);
        if (CAST[id].child) holder = id;
        else {
          // a grown-up bats it back to a child
          const next = rows[rows.indexOf(r) + 1];
          holder = next ? next.data.holder : "zara";
          await F.sleep(F.T(350));
          balloonTo(holder);
        }
        markHolder();
        // L2: the sisters swap seats, so only the words pick which one
        if (lv === 2) {
          const a2 = seats.indexOf("zaraMum");
          const b2 = seats.indexOf("yusufMum");
          if (F.rng() < 0.6) [seats[a2], seats[b2]] = [seats[b2], seats[a2]];
          place();
        }
        F.tick(r);
        busy = false;
      })
    );

    await F.ask({ guide: "balloon-guide" });
    F.begin();
    F.teach("person", () => els[calls[0].who]);

    await new Promise((res) => F.whenAll(res));
    await F.finish(async () => {
      await F.bubble(els.zara, F.lineOf("balloon-your-name"));
      ball.style.top = "92%";
      ball.style.left = "50%";
      Object.values(els).forEach((el) => F.jiggle(el));
    });
  },
};

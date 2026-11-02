/*
 * The cake (prototype, proto-party 2 Nov 2026; build/reports/designs/party-gifts.md §3 A1-A2, its critique). It's Zara's cake
 * (a cake at a celebration is fine; nothing here is a reward). Nani says one thing at a time (THE SENTENCE LAYOUT, word tiles
 * under her: the cake and candles, and everyone at the table):
 *   1. "Trae candles khanech!": tap the bundle with that many candles (no digits anywhere: the number picks the bundle). The
 *      candles fly onto the cake, lit.
 *   2. "Now blow!": tap the cake; the flames go out one by one as Nani counts down.
 *   3. "Hi Nana lai ai." (this is for Nana, Mum's recording): tap a slice, then that person; they take a bite. A wrong person
 *      wobbles ("for me? no!") and the slice goes back; she says it again.
 *   L1  bundles of one, two and three candles; two slices (Nana, Zara or Yusuf).
 *   L2  four bundles from one to six; three slices, and the baby is at the table (on Yusuf's mum's lap).
 * The cloth and the cups (the design's L2) wait. To record (grey English): candle, cake, baby, "Now blow!", the opening line.
 */
import { CAST, SVG } from "./art.js";

export default {
  opts: {},
  async run(F) {
    const lv = F.level;
    const stamp = F.stamp;
    F.scene.insertAdjacentHTML("beforeend", '<div class="pp-wall"></div><div class="pp-bunting"></div><div class="pp-bunting b2"></div><div class="pp-floor"></div>');

    /* ----- the people behind the table ----- */
    const who = lv === 1 ? ["nana", "zara", "yusuf"] : ["nana", "zara", "yusufMum", "yusuf"];
    const xs = who.length === 3 ? [0.22, 0.5, 0.78] : [0.14, 0.38, 0.62, 0.86];
    const els = {};
    const plates = {};
    who.forEach((id, i) => {
      const el = F.put("pp-person", { x: xs[i], y: 0.66, h: CAST[id].h * 0.92, img: CAST[id].img, tag: "button", z: 3 });
      el.setAttribute("aria-label", id === "yusufMum" ? "the baby" : id);
      els[id] = el;
      const pl = document.createElement("div");
      pl.className = "pp-plate";
      pl.style.left = `${xs[i] * 100}%`;
      pl.style.top = "70%";
      pl.style.zIndex = "6";
      F.scene.appendChild(pl);
      plates[id] = pl;
    });
    F.scene.insertAdjacentHTML("beforeend", '<div class="pp-table" style="z-index:4"></div>');
    const cake = F.put("pp-cake", { x: 0.5, y: 0.66, h: 0.2, tag: "button", z: 7, html: '<div class="pp-sponge"></div><div class="pp-on-top"></div>' });
    cake.setAttribute("aria-label", "the cake");
    const onTop = cake.querySelector(".pp-on-top");

    /* ----- the bundles of candles (no digits) and the slices ----- */
    const n = lv === 1 ? 1 + Math.floor(F.rng() * 3) : 2 + Math.floor(F.rng() * 5);
    let counts = lv === 1 ? [1, 2, 3] : F.shuffle([1, 2, 3, 4, 5, 6].filter((x) => x !== n)).slice(0, 3).concat([n]);
    counts = F.shuffle(counts);
    const bundles = counts.map((c, i) => {
      const b = F.put("pp-bundle", { x: 0.2 + (0.6 * i) / Math.max(1, counts.length - 1), y: 0.97, h: 0.17, tag: "button", z: 9, html: `<span class="pp-bundle-in">${'<span class="pp-candle"></span>'.repeat(c)}</span>` });
      b.setAttribute("aria-label", "candles");
      b.dataset.n = String(c);
      return b;
    });
    const nSlices = lv === 1 ? 2 : 3;
    const slices = [];

    /* ----- the instructions ----- */
    const candleNP = { fn: "Item", kind: "n.candle", n };
    const forWhom = F.shuffle(who).slice(0, nSlices);
    const lexOf = { nana: "pn.nana", zara: "pn.zara", yusuf: "pn.yusuf" };
    const npOf = (id) => (id === "yusufMum" ? { fn: "Item", kind: "n.baby" } : lexOf[id]);
    const keyOf = (id) => (id === "yusufMum" ? "baby" : id);
    const rows = [
      F.row({ key: "candles", line: { fn: "Command", verb: "v.bring", obj: candleNP }, word: candleNP, tiles: ["candles", "candle"], picture: null, target: () => bundles.find((b) => Number(b.dataset.n) === n), data: { kind: "candles" } }),
      F.row({ key: "blow", line: { fn: "Say", x: (F.L.linearizer.lexOf("party-proto.line.cake-blow") || {}).id }, word: { fn: "Item", kind: "n.cake" }, tiles: ["cake"], picture: null, target: () => cake, data: { kind: "blow" } }),
      ...forWhom.map((id, i) => F.row({ key: `slice${i}`, line: { fn: "ForWho", x: npOf(id) }, word: { fn: "For", x: npOf(id) }, tiles: [keyOf(id)], picture: null, target: () => (held ? els[id] : slices.find((s) => !s.used)), data: { kind: "slice", who: id } })),
    ];

    /* ----- the word tiles: the cake things, and everyone at the table ----- */
    const imgPic = (src) => (box) => box.insertAdjacentHTML("beforeend", `<img class="pp-tile-pic" alt="" src="${stamp(src)}">`);
    const htmlPic = (html) => (box) => box.insertAdjacentHTML("beforeend", html);
    const cakeTiles = [
      { key: "candle", word: { fn: "Item", kind: "n.candle" }, lex: "n.candle", picture: htmlPic('<span class="pp-bundle" style="height:80%;border:0;background:none"><span class="pp-candle"></span></span>') },
      { key: "candles", word: { fn: "Item", kind: "n.candle", number: "pl" }, lex: "n.candle", picture: htmlPic('<span class="pp-bundle" style="height:80%;border:0;background:none"><span class="pp-candle"></span><span class="pp-candle"></span><span class="pp-candle"></span></span>') },
      { key: "cake", word: { fn: "Item", kind: "n.cake" }, lex: "n.cake", picture: htmlPic('<span class="pp-cake" style="position:relative;display:block;width:80%"><span class="pp-sponge"></span></span>') },
    ];
    const peopleTiles = [
      { key: "nana", word: { fn: "Item", kind: "pn.nana" }, lex: "pn.nana", picture: imgPic(CAST.nana.head) },
      { key: "zara", word: { fn: "Item", kind: "pn.zara" }, lex: "pn.zara", picture: imgPic(CAST.zara.head) },
      { key: "yusuf", word: { fn: "Item", kind: "pn.yusuf" }, lex: "pn.yusuf", picture: imgPic(CAST.yusuf.head) },
    ];
    if (lv >= 2) peopleTiles.push({ key: "baby", word: { fn: "Item", kind: "n.baby" }, lex: "n.baby", picture: htmlPic(SVG.baby.replace("<svg", '<svg class="pp-tile-svg"')) });
    F.sentence([
      { label: { en: "cake" }, tiles: cakeTiles },
      { label: { en: "family" }, tiles: peopleTiles },
    ]);

    /* ----- play ----- */
    let held = null;
    let busy = false;
    const candleEls = [];
    bundles.forEach((b) =>
      F.on(b, "click", async () => {
        F.acted();
        const r = F.current();
        if (busy || !r) return;
        if (r.data.kind !== "candles") return F.jiggle(b);
        if (Number(b.dataset.n) !== n) return F.oops(r, b);
        busy = true;
        bundles.forEach((x) => x.classList.add("gone"));
        for (let k = 0; k < n; k++) {
          const c = document.createElement("span");
          c.className = "pp-candle lit";
          onTop.appendChild(c);
          candleEls.push(c);
        }
        F.jiggle(cake);
        F.tick(r);
        busy = false;
      })
    );
    F.on(cake, "click", async () => {
      F.acted();
      const r = F.current();
      if (busy || !r) return;
      if (r.data.kind !== "blow") return F.jiggle(cake);
      busy = true;
      // the flames go out one by one as she counts down
      for (let k = candleEls.length; k >= 1; k--) {
        candleEls[k - 1].classList.remove("lit");
        await Promise.all([F.speak(F.say({ fn: "Item", kind: `num.${k}` })), F.sleep(F.T(650))]);
      }
      if (window.Sfx) window.Sfx.play("gold", { volume: 0.3 });
      // the cake is cut: the slices on a plate in front
      for (let k = 0; k < nSlices + 1; k++) {
        const s = F.put("pp-slice", { x: 0.36 + k * 0.09, y: 0.93, h: 0.1, tag: "button", z: 9 });
        s.setAttribute("aria-label", "a slice of cake");
        slices.push(s);
        F.on(s, "click", () => {
          F.acted();
          if (s.used) return;
          held = held === s ? null : s;
          slices.forEach((x) => {
            x.classList.toggle("sel", x === held);
            x.classList.toggle("lift", x === held);
          });
        });
      }
      F.tick(r);
      busy = false;
    });
    Object.entries(els).forEach(([id, el]) =>
      F.on(el, "click", async () => {
        F.acted();
        const r = F.current();
        if (busy || !r) return;
        if (r.data.kind !== "slice" || !held) return F.jiggle(el);
        if (id !== r.data.who) {
          // "for me? no, no!": a wobble, the slice goes back; she says it again
          const s = held;
          held = null;
          s.classList.remove("sel", "lift");
          return F.oops(r, el);
        }
        busy = true;
        const s = held;
        held = null;
        s.used = true;
        s.classList.remove("sel", "lift");
        await F.fly(null, s, plates[id], { cls: "pp-slice", size: s.getBoundingClientRect().height, ms: 520 });
        s.classList.add("gone");
        const mine = document.createElement("div");
        mine.className = "pp-slice";
        Object.assign(mine.style, { position: "absolute", left: "30%", bottom: "40%", height: "130%", aspectRatio: "1.2" });
        plates[id].appendChild(mine);
        F.jiggle(el);
        F.tick(r);
        busy = false;
      })
    );

    await F.ask({ guide: "cake-guide" });
    F.begin();
    F.teach("bundle", () => rows[0].target());
    await new Promise((res) => F.whenAll(res));
    await F.finish(async () => Object.values(els).forEach((el) => F.jiggle(el)));
  },
};

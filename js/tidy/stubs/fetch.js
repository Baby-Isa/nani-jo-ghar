/*
 * STAND-IN for Cook's `fetch` (js/cook/mechanics/fetch.js, reused per D.3):
 * Cook's runs on Phaser, which this plain-HTML page doesn't load, so until
 * the shell hosts both, this is the same verb in Tidy's zones. Take the
 * named things from a shelf, among look-alikes, into the tray; the zone
 * sends each one on its channel (out: "fetched") and the cloth zone takes
 * it (in: "fetched"), as Cook's zones route items.
 * The shelf holds the round's things plus look-alike decoys (extras no row
 * names, G6); everything starts on the shelf, so a "leave" row means leave
 * it on the shelf. Nothing is refused: a decoy fetched is just an extra.
 * Knobs (data/tidy.json mechanics.fetch): lookalikes (decoys added).
 */
(function (global) {
  const Tidy = global.Tidy;

  /** Before the view is drawn: the decoys, and everything on the shelf. */
  Tidy.fetchPrepare = function (H) {
    const k = Tidy.Mech.knobs("fetch", H.level);
    const used = new Set(Object.values(H.R.items).map((it) => it.word));
    const pool = Tidy.Rules.pool(["tableware"]).filter((w) => !used.has(w));
    Tidy.Rules.util.shuffle(Math.random, pool)
      .slice(0, k.lookalikes)
      .forEach((w, i) => {
        const iid = `${w}#d${i}`;
        H.R.items[iid] = { word: w, attrs: {}, kind: "tableware" };
        H.R.order.push(iid);
        H.R.solution[iid] = "tray";
      });
    H.R.order = Tidy.Rules.util.shuffle(Math.random, H.R.order);
    H.R.order.forEach((i) => {
      if (H.R.start[i] == null || H.R.start[i] === "tray") H.R.start[i] = "shelf";
      if (H.R.solution[i] === "tray") H.R.solution[i] = "shelf";
    });
    H.pl = Object.assign({}, H.R.start);
  };

  Tidy.Mech.define("fetch", {
    run(z, p, k) {
      const H = z.host;
      const items = H.R.order.filter((i) => H.pl[i] === "shelf");
      const nodes = {};
      // the shelf: a tall zone of its own (design 380x900), planks with the things on them
      const [W, Ht] = z.design;
      const cols = 2;
      const rows = Math.max(1, Math.ceil(items.length / cols));
      const rowH = Math.min(200, (Ht - 60) / rows);
      const size = Math.min(150, rowH * 0.85);
      for (let r = 0; r < rows; r++) {
        const plank = Tidy.el("div", "surf plank", z.el);
        Object.assign(plank.style, { left: "16px", top: `${40 + (r + 1) * rowH - 14}px`, width: `${W - 32}px`, height: "16px" });
      }
      items.forEach((iid, i) => {
        const it = H.R.items[iid];
        const n = Tidy.el("div", "item", z.el);
        Object.assign(n.style, { width: `${size}px`, height: `${size}px`, margin: `${-size / 2}px 0 0 ${-size / 2}px` });
        n.dataset.iid = iid;
        n.innerHTML = Tidy.picture(it.word) ? `<img src="${Tidy.picture(it.word)}" alt="">` : Tidy.shape(it.word, it.attrs.colour);
        n.style.left = `${W * ((i % cols) + 0.5) / cols}px`;
        n.style.top = `${40 + Math.floor(i / cols) * rowH + rowH - 14 - size / 2}px`;
        nodes[iid] = n;
      });
      z.on(z.el, "pointerdown", (e) => {
        if (H.locked || H.dead) return;
        const n = e.target.closest(".item");
        if (!n || !nodes[n.dataset.iid]) return;
        const iid = n.dataset.iid;
        n.remove();
        delete nodes[iid];
        Tidy.sfx("whoosh");
        z.emit(iid);
      });
      H.on(`in:${z.spec.out}`, (iid) => H.move(iid, "tray", { fetched: true, swapped: true }));
      return { nodes };
    },
  });

  Tidy.Mech.lab("fetch", { name: "Fetch and lay", verb: "Shelf, then the cloth", game: "dastarkhwan", level: 3 });
})(window);

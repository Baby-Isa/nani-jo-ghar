/*
 * Mechanic: tell (new; D.3, 6.5 M12). Ali acts on an instruction the child
 * gives: he takes a thing he HEARD (any one that matches: say "cup" when
 * there are three and he picks one) and puts it at a spot chosen UNIFORMLY
 * among the free spots that satisfy what he was told. Ambiguity goes wrong
 * on purpose (the barrier-game lesson). At level 1 he knows the place from
 * Nani's card (D.9.3); at level 3 the place is said too.
 * Knobs (data/tidy.json mechanics.tell): slots (the listens a row), timeoutMs.
 */
(function (global) {
  const Tidy = global.Tidy;
  const Rel = Tidy.Rel;
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  Tidy.Mech.define("tell", {
    run(z, p, k) {
      const H = z.host;
      const ali = Tidy.el("div", "ali", z.el);
      ali.style.backgroundImage = "url(assets/cook/characters/cousin-happy.webp)";
      Object.assign(ali.style, { left: "1450px", top: "560px" });
      const walk = async (x, y) => {
        ali.style.left = `${x - 75}px`;
        ali.style.top = `${y - 150}px`;
        await Tidy.wait(650);
      };
      /**
       * heard: {noun, count?, place?: groupKey}. row: what the card shows
       * (Ali's fallback for any slot not said at this level).
       */
      async function act(row, heard) {
        const n = heard.count ? Number(String(heard.count).replace("num-0", "").replace("num-", "")) : row.type === "count" ? row.n : 1;
        const key = heard.place || `${row.rel}|${row.anchor && typeof row.anchor === "object" ? "" : row.anchor || ""}`;
        const g = H.R.B.groups.find((x) => x.key === key);
        const rel = g ? g.rel : row.rel;
        const anchor = g ? g.anchor : row.anchor;
        const done = [];
        for (let i = 0; i < n; i++) {
          // what he heard, from the tray; if none is left there, from wherever one is (not what he just put)
          let pool = Object.keys(H.R.items).filter((j) => H.R.items[j].word === heard.noun && H.pl[j] === "tray");
          if (!pool.length) pool = Object.keys(H.R.items).filter((j) => H.R.items[j].word === heard.noun && !done.includes(j) && H.pl[j] !== "shelf");
          if (!pool.length) break;
          const iid = pick(pool);
          const at = H.view.pos(iid);
          await walk(at.x, at.y);
          let spots = H.R.B.spots.filter((s) => Rel.free(H.state(), H.R.B, s.id) > 0 && Rel.satisfies(H.state(), H.R.B, s.id, rel, anchor, iid));
          if (!spots.length) {
            // full: he takes back something there that no right row needs (a thing he put there by mistake)
            const holding = H.R.rows.filter((r) => H.holds(r));
            const spare = H.R.B.spots
              .filter((s) => Rel.satisfies(H.state(), H.R.B, s.id, rel, anchor, iid))
              .flatMap((s) => H.at(s.id).map((o) => ({ s, o })))
              .find(({ o }) => {
                const was = H.pl[o];
                H.pl[o] = "tray";
                const ok = holding.every((r) => H.holds(r));
                H.pl[o] = was;
                return ok;
              });
            if (spare) {
              H.move(spare.o, "tray", { byAli: true, swapped: true });
              spots = [spare.s];
            }
          }
          const s = spots.length ? pick(spots) : null;
          if (!s) break;
          await walk(s.x, s.y);
          H.move(iid, s.id, { byAli: true });
          done.push(iid);
          Tidy.sfx("pop");
        }
        await walk(1450, 710);
        return done.map((i) => ({ iid: i, at: H.pl[i] }));
      }
      /** Ali takes back what he put for a row (before trying again): only what's still where he put it. */
      function undo(put) {
        put.filter((x) => H.pl[x.iid] === x.at).forEach((x) => H.move(x.iid, "tray", { byAli: true, swapped: true }));
      }
      return { act, undo };
    },
  });

  Tidy.Mech.lab("tell", { name: "Tell Ali", verb: "You say it, Ali does it", game: "putaway", level: 1, via: "ali" });
})(window);

/*
 * Mechanic: count in (spoons). Tap the bowl once per spoon they asked
 * for, then the tick. The look-alike bowls beside it (salt next to sugar)
 * can be spooned in too: a spoon of the wrong one costs the accuracy badge
 * ("Arre re!"). The badge shows the running tally only, never the target.
 * Kutchi: the number ("ba khun"), "khun na", and which bowl.
 * Cook.Spoon.spoon(z, {bowl, into, word}) is the one-spoon animation the
 * Chai tray uses cup by cup.
 * Knobs (data.mechanics.count): max (spoons before the bowl stops giving),
 * spoonMs (the spoon's flight).
 */
import { Cook as CookNS } from "../ns.js";
import { setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame } from "../life.js";

(function (global) {
  const Cook = CookNS;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  /*
   * s08 w6B (CHAI-13, the judge at 1112 ms: "two spoons show in the pan at once"): one teaspoon in a vessel at a time. A
   * spoonful tapped while the last one's spoon still goes round waits (its count and word were already given at the tap,
   * so nothing the child does waits) and flies in once that spoon has lifted out; while another waits behind it, its stir
   * is one quick turn, so a run of quick taps never builds a long queue.
   */
  function spoon(z, o) {
    const into = o.into;
    if (!into || !into.rim) return spoonNow(z, o);
    into.spoonsWaiting = (into.spoonsWaiting || 0) + 1;
    const prev = into.spoonQ || Promise.resolve();
    const mine = prev
      .then(async () => {
        while (into.stirring && into.active !== false) await new Promise((r) => setTimeout(r, 30));
        into.spoonsWaiting--;
        return spoonNow(z, Object.assign({}, o, { quick: into.spoonsWaiting > 0 }));
      })
      .catch(() => {});
    into.spoonQ = mine;
    return mine;
  }
  /** One spoonful from `bowl` into `into` (a vessel or a point): a spoon with a heap on it. */
  async function spoonNow(z, { bowl, into, word, ms = 360, quick = false }) {
    const S = z.S;
    if (!S || !S.sys || !S.sys.isActive()) return;
    const col = St.heapColor(word, 0xffffff);
    const c = S.centre(bowl);
    // CHAI-13 (S06 round 3): into a pot or a glass, the spoon that flies in is the stir's own teaspoon, the same size and
    // lie (the flight's was a third of the size, a grey sliver on the hob), and it lands where the stir starts, so it
    // goes straight round with no gap: the sugar tap shows the spoon coming in and stirring
    const st = into.rim && St.stirStart ? St.stirStart(into) : null;
    const L = st ? st.L : z.L(1);
    const sp = S.track(S.add.container(c.x, c.y - z.L(20)).setDepth(D.fx + 1)); // CHAI-13: over the puff it makes, so the teaspoon is seen
    // CHAI-13 (s08c TP1, s08 w7A): the real teaspoon, heaped with sugar (and the salt that looks like it) as drawn; any other
    // spoonful lies on the clean spoon (art.s02 "teaspoon" is the sugar spoon, "teaspoon-empty" the clean one). Loaded here
    // if the station did not (the plain chai's count), only when a spoonful is shown (decision 68)
    await St.loadArt(S, St.artLoad(["teaspoon", "teaspoon-empty", "teaspoon-chai"]), 1500);
    const sugary = word === "cook-khun" || word === "spi-16";
    const tid = sugary ? "teaspoon" : "teaspoon-empty";
    if (St.hasArt(S, tid)) {
      const im = S.add.image(0, 0, St.artKey(tid));
      const m = St.art(tid).meta || {};
      const bowlAt = m.bowl || [0.5, 0.85];
      im.setOrigin(bowlAt[0], bowlAt[1]).setScale((L * 80) / Math.max(im.width, im.height)).setAngle(-60);
      sp.add(im);
      if (!sugary) sp.add(S.add.ellipse(0, 0, L * 20, L * 12, col, 1));
    } else {
      const g = S.add.graphics();
      if (st) St.teaspoon(g, 0, 0, L * 70, L * 38, L, col);
      else St.teaspoon(g, 0, 0, z.L(64), z.L(4), z.L(1), col);
      sp.add(g);
    }
    const p = into.surface ? into.surface() : into;
    const to = st || { x: p.x + (Math.random() - 0.5) * z.L(30), y: p.y - z.L(10) };
    await S.fly(sp, to.x, to.y, { duration: ms, arc: z.L(90) });
    S.puff(p.x, p.y, col, z.L(36)); // CK-27: the one shared puff (no spray of dots, CK-06)
    if (st) {
      // into a pot or a glass: a stir with the teaspoon (28 Sept, s8; CHAI-13, S06: two slow turns, so the spoon is seen
      // going round in the pan, not a blink; nothing waits on it: the next tap is taken while it stirs). It takes over
      // from this spoon in the same frame (or, already going round, goes round again)
      const stir = St.stirIn(S, into, quick ? { ms: 520, turns: 1, dipped: true } : { ms: 900, turns: 2, dipped: true });
      sp.destroy();
      await stir;
      return;
    }
    S.tweens.add({ targets: sp, angle: -70, duration: 120 });
    await Cook.wait(130);
    sp.destroy();
  }
  Cook.Spoon = { spoon };

  Mech.define("count", {
    api: "countIn",
    async run(z, { bowl, n, into, word, items }, k) {
      const S = z.S;
      let count = 0;
      UI.count(0, { speak: false, id: word });
      const others = Object.entries(items || {}).filter(([id, obj]) => obj && obj !== bowl && id !== word);
      const add = async (from, id) => {
        const p = spoon(z, { bowl: from, into, word: id, ms: k.spoonMs });
        if (id !== word) {
          UI.countUp(id, { speak: false });
          return p;
        }
        count++;
        UI.count(count, { id: word });
        z.progress({ count });
        return p;
      };
      if (z.guided) S.glow(bowl, true);
      await new Promise((resolve) => {
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          z.expect(null);
          [bowl, ...others.map(([, o]) => o)].forEach((o) => S.untap(o));
          S.glow(bowl, false);
          UI.hideDone();
          resolve();
        };
        const post = () => {
          const c = S.centre(bowl);
          z.expect({ kind: "count", x: c.x, y: c.y, target: n, count: () => count, doneSel: "#done-btn" });
        };
        S.tappable(bowl, () => {
          if (count >= k.max) return;
          Cook.sfx.pop();
          add(bowl, word);
          if (z.guided) {
            S.glow(bowl, count < n);
            UI.glowDone(count >= n);
          } else if (count >= n && UI.doneGlows && UI.doneGlows()) {
            S.glow(bowl, false);
            UI.glowDone(true);
          }
        });
        // the look-alikes are real choices: a spoon of salt goes in too
        others.forEach(([id, obj]) =>
          S.tappable(obj, () => {
            // level 2 up it just goes in, like any spoon (UX 11): the review says so
            if (z.quiet) Cook.sfx.pop();
            else Cook.sfx.soft();
            add(obj, id);
            z.listen(false, `added ${id}, not ${word}`);
            z.oops();
          })
        );
        // CK-34 (contract-8): the ✓ waits unlit while the bowl is the thing to tap; it lights once the count is reached
        UI.done({ glow: false }).then(finish);
        post();
      });
      UI.hideCount();
      z.listen(count === n, `${count} ${word}, they asked for ${n}`);
      count === n ? Cook.markRight(Cook.numId(n)) : Cook.markMiss(Cook.numId(n));
      return count;
    },
  });

  Mech.lab("count", {
    name: "Sugar",
    verb: "Count in",
    async run(L) {
      const n = 1 + Math.floor(Math.random() * 3);
      L.card([Lang.line("and", Lang.phrase(Lang.countParts(n, "cook-khun")))], ["count"]);
      const z = await L.scene("count", "hob");
      const pan = St.vessel(L.S, "pan", z.X(St.BURNER.left.x), z.Y(St.BURNER.left.y - 30), 1.35 * z.k);
      pan.setLiquid(0.6, 0xc49468);
      const items = {};
      Cook.shuffle(["cook-khun", "spi-16", "cook-atto"]).forEach((id, i) => (items[id] = L.S.ingredient(id, z.X(300 + i * 250), z.Y(St.STRIP_Y - 20), { w: z.L(170), h: z.L(128) })));
      await L.run("count", z, { bowl: items["cook-khun"], n, into: pan, word: "cook-khun", items });
    },
  });
})(window);

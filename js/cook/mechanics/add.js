/*
 * Mechanic: add. Pick the named thing from the counter and it flies into
 * the pan (tea leaves among look-alikes, the elchi or ginger).
 * Kutchi: which one. A sub-step: it runs in a scene someone else set up.
 */
import { Cook as CookNS } from "../ns.js";
import { setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame } from "../life.js";

(function (global) {
  const Cook = CookNS;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  Mech.define("add", {
    async run(z, { items, expected, into, say, allowAny }, k) {
      const S = z.S;
      async function flyIn(key, obj) {
        const col = St.heapColor(key);
        // from the top of the jar or bowl (a front-on jar stands on its base)
        const c = S.centre(obj);
        const dot = S.track(S.add.circle(c.x, c.y - c.h * 0.25, z.L(18), col, 1).setDepth(D.fx));
        Cook.sfx.pop();
        const p = into.surface ? into.surface() : into;
        await S.fly(dot, p.x, p.y, { duration: k.flyMs, arc: z.L(110) });
        S.burst(p.x, p.y, col, 10, z.L(50));
        S.puff(p.x, p.y, col, z.L(46));
        dot.destroy();
      }
      const r = await S.step({
        items,
        expected,
        word: expected,
        guided: z.guided,
        sayLine: say || Lang.wordLine(expected),
        allowAny,
        io: z.io,
        quiet: z.quiet,
        onWrong: (key, m) => {
          z.listen(false, `added ${key}`);
          if (m === 1) z.oops();
        },
        // level 2 up (UX 11): a wrong one goes into the pan like any other; the review says so
        onLand: (key, obj) => flyIn(key, obj),
      });
      await flyIn(r.key, items[r.key]);
      if (!z.guided && Lang.known(r.key)) Cook.markRight(r.key);
      z.progress({ added: r.key });
      return r.key;
    },
  });
})(window);

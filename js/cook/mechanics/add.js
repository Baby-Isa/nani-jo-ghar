/*
 * Mechanic: add. Pick the named thing from the counter and it flies into
 * the pan (tea leaves among look-alikes, the elchi or ginger).
 * Kutchi: which one. A sub-step: it runs in a scene someone else set up.
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  Mech.define("add", {
    async run(z, { items, expected, into, say, allowAny }, k) {
      const S = z.S;
      const r = await S.step({
        items,
        expected,
        word: expected,
        guided: z.guided,
        sayLine: say || Lang.wordLine(expected),
        allowAny,
        io: z.io,
        onWrong: (key, m) => {
          z.listen(false, `added ${key}`);
          if (m === 1) z.oops();
        },
      });
      const obj = items[r.key];
      const blob = S.track(S.add.circle(obj.x, obj.y - z.L(20), z.L(16), 0xffffff, 0.001).setDepth(D.fx));
      const col = St.heapColor(r.key);
      const dot = S.track(S.add.circle(obj.x, obj.y - z.L(20), z.L(18), col, 1).setDepth(D.fx));
      Cook.sfx.pop();
      const p = into.surface ? into.surface() : into;
      await S.fly(dot, p.x, p.y, { duration: k.flyMs, arc: z.L(110) });
      S.burst(p.x, p.y, col, 10, z.L(50));
      dot.destroy();
      blob.destroy();
      if (!z.guided && Cook.data.words[r.key]) Cook.markRight(r.key);
      z.progress({ added: r.key });
      return r.key;
    },
  });
})(window);

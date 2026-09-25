/*
 * Mechanic: care (M2, the trolley). docs/modes/clinic-design.md R2.5, 6.4,
 * 6.5, 12.2 task 3. The doctor names the treatment ("A plaster." / level 2:
 * "The green bandage."). The trolley always holds EVERY unlocked item for the
 * level, shuffled per visit, with three bandage rolls in three colours and
 * two plaster tins from level 2, so what's there never answers what he said.
 * The first pick is graded (the care row); a wrong one: "No," and he says
 * it again; two misses: it glows (shown).
 * Params: room, row (the care row), line (his instruction; default row.say).
 * Returns {obj, img}: the chosen object and its image (it goes on next).
 */
(function (global) {
  const Cook = global.Cook;
  const Clinic = global.Clinic;
  const V = global.ClinicVisit;

  Cook.Mech.define("care", {
    async run(z, params, k) {
      const { room, row } = params;
      const ctx = z.ctx;
      const S = room.S;
      const objs = Cook.shuffle(row.options);
      const tr = room.showTrolley(objs);
      if (!params.noSay) await room.say("doctor", row.say);
      let misses = 0;
      return new Promise((resolve) => {
        const want = row.accept;
        const post = () => {
          const t = tr.items[want[0]];
          z.expect({ kind: "tap", x: t.x, y: t.y, key: want[0], wrongs: tr.all.filter((o) => !want.includes(o.obj)).map((o) => ({ x: o.x, y: o.y })) });
        };
        tr.all.forEach((img) =>
          S.tappable(img, async () => {
            if (want.includes(img.obj)) {
              tr.all.forEach((o) => S.untap(o));
              S.glow(tr.items[want[0]], false);
              ctx.grade(row, misses === 0);
              Cook.sfx.right();
              z.expect(null);
              resolve({ obj: img.obj, img });
              return;
            }
            misses++;
            ctx.grade(row, false);
            S.wiggle(img);
            Cook.sfx.soft();
            // "No," and he says it again (the recast); two misses: it glows (shown)
            await room.say("doctor", row.say).catch(() => {});
            if (misses >= 2) {
              ctx.shown(row);
              S.glow(tr.items[want[0]], true);
            }
            post();
          })
        );
        post();
      });
    },
  });
})(window);

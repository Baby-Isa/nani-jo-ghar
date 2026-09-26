/*
 * Mechanic: fry (several at once). Drop them into the oil, then lift each
 * out when its own ring reaches green. Several cook at once, at different
 * times: juggling. The count ("bo samosa") is the Kutchi, and which ones:
 * the tray always holds more than asked for (a random number of extras,
 * never a fixed "one more"), at level 2 other things are on the tray too
 * (chips beside the samosas), and at level 3 the pan is mixed: Nani's
 * chips are already frying, and she says "lift the samosas, leave the
 * chips". Lifting or frying the wrong kind, or the wrong number, costs
 * the ear star. While things fry (hands idle) Nani may ask "pass me".
 * Params: kind (a key of knobs.items: samosa, chips…), count, made (how
 * many you made: they're on the tray, plus the extras; default count).
 * Knobs (data.mechanics.fry): band, rate [min, max], extras [min, max],
 * others {kind: [min, max]} (other things on the tray), leave {kind: n}
 * (already frying: leave them), leaveRate, burnAt, burntScore,
 * items {kind: {art, scale, word}}, passMeAfterMs, special.
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;
  const B = St.BURNER;

  // places in the kadai, around its middle (design offsets from the rim centre)
  const SLOTS = [[-150, 0], [30, -45], [170, 10], [-40, 50], [-190, -60], [110, 60], [-80, -50], [210, -50], [60, 5]];

  Mech.define("fry", {
    station: "fry",
    view: "hob",
    async run(z, { kind = "samosa", count = 1, made }, k) {
      const S = z.S;
      const ctx = z.ctx;
      const kadai = St.vessel(S, "kadai", z.X(B.left.x + 190), z.Y(B.left.y - 10), 1.55 * z.k);
      kadai.setLiquid(0.8, 0xe6b84a);
      const [lo, hi] = k.band;
      const look = (kd) => (k.items || {})[kd] || { art: `bowl:${kd}`, scale: 0.5, word: kd };
      const wordOf = (kd) => look(kd).word || kd;
      // the tray: what you made plus a random number of extras, and (level 2+) other things
      const base = made != null ? made : count;
      const onTray = [];
      for (let i = 0; i < base + St.knobInt(k.extras); i++) onTray.push(kind);
      Object.keys(k.others || {}).forEach((kd) => {
        if (kd === kind) return;
        for (let i = St.knobInt(k.others[kd]); i > 0; i--) onTray.push(kd);
      });
      const trayKinds = Cook.shuffle(onTray);
      // a steel tray on the worktop, clear of the Done button's corner
      const perRow = Math.max(2, Math.ceil(trayKinds.length / 2));
      const rows = Math.ceil(trayKinds.length / perRow);
      const dx = 125;
      const tx0 = 1060 - ((perRow - 1) * dx) / 2;
      const ty0 = rows > 1 ? 728 : 780;
      const tw = (perRow - 1) * dx + 170;
      const th = (rows - 1) * 100 + 130;
      const tg = S.track(S.add.graphics().setDepth(D.item - 0.3));
      tg.fillStyle(0x3a2410, 0.18).fillRoundedRect(z.X(1060 - tw / 2 + 6), z.Y(ty0 - 65 + 8), z.L(tw), z.L(th), z.L(22));
      tg.fillStyle(0xaeb2b6, 1).fillRoundedRect(z.X(1060 - tw / 2), z.Y(ty0 - 65), z.L(tw), z.L(th), z.L(22));
      tg.fillStyle(0xd6d9dc, 1).fillRoundedRect(z.X(1060 - tw / 2 + 10), z.Y(ty0 - 55), z.L(tw - 20), z.L(th - 20), z.L(16));
      const tray = trayKinds.map((kd, i) => {
        const row = Math.floor(i / perRow);
        const col = i % perRow;
        const x = tx0 + col * dx;
        const img = S.track(S.add.image(z.X(x), z.Y(ty0 + row * 100), S.tex(look(kd).art)).setScale(look(kd).scale * z.k).setDepth(D.item + row * 0.1));
        img.baseScale = img.scale;
        img.kind = kd;
        return img;
      });
      const spoon = S.hand("spoon", { x: z.X(640), y: z.Y(700), angle: -15, k: z.k });
      if (k.special) S.special(spoon);
      const sizzle = Cook.sfx.sizzleLoop();
      S.loops.push(sizzle);
      const frying = [];
      const doneOut = [];
      let dropped = 0;
      let droppedMine = 0;
      let slot = 0;
      const slotPos = () => {
        const [dx, dy] = SLOTS[slot++ % SLOTS.length];
        return { x: kadai.rim.x + z.L(dx), y: kadai.rim.y + z.L(dy) };
      };
      const ringG = S.track(S.add.graphics().setDepth(D.fx + 1));
      const R = z.L(56);
      const drawRings = () => {
        ringG.clear();
        frying.forEach((f) => {
          if (f.out) return;
          const a0 = -Math.PI / 2;
          ringG.lineStyle(z.L(9), 0xfffaf1, 0.8);
          ringG.beginPath();
          ringG.arc(f.x, f.y, R, 0, Math.PI * 2);
          ringG.strokePath();
          ringG.lineStyle(z.L(9), 0x7d9a78, 1);
          ringG.beginPath();
          ringG.arc(f.x, f.y, R, a0 + lo * Math.PI * 2, a0 + hi * Math.PI * 2);
          ringG.strokePath();
          ringG.lineStyle(z.L(6), f.v > hi ? 0xb24a3a : 0xc9973a, 1);
          ringG.beginPath();
          ringG.arc(f.x, f.y, R, a0, a0 + Math.min(1, f.v) * Math.PI * 2);
          ringG.strokePath();
        });
      };
      const [r0, r1] = k.rate;
      const fry = (img, p, { leave = false, v = 0 } = {}) => {
        const f = { img, kind: img.kind, x: p.x, y: p.y, v, rate: leave ? k.leaveRate : r0 + Math.random() * (r1 - r0), out: false, leave };
        frying.push(f);
        S.tappable(img, () => lift(f));
        return f;
      };
      // level 3: Nani's things are already in the pan; leave them
      const leaveKinds = Object.keys(k.leave || {}).filter((kd) => kd !== kind);
      leaveKinds.forEach((kd) => {
        for (let i = 0; i < k.leave[kd]; i++) {
          const p = slotPos();
          const img = S.track(S.add.image(p.x, p.y, S.tex(look(kd).art)).setScale(look(kd).scale * 0.9 * z.k).setDepth(D.item + 1));
          img.kind = kd;
          fry(img, p, { leave: true, v: 0.15 + Math.random() * 0.25 });
        }
      });
      if (leaveKinds.length) {
        const lines = [Lang.line("lift", Lang.phrase([wordOf(kind)]))].concat(leaveKinds.map((kd) => Lang.line("leave", Lang.phrase([wordOf(kd)]))));
        leaveKinds.forEach((kd) => Cook.markSeen(wordOf(kd)));
        await z.say(Lang.join(lines), { hide: St.hideKnown(ctx) });
      }
      let lifted = 0;
      const lift = (f) => {
        if (f.out) return;
        f.out = true;
        S.untap(f.img);
        S.glow(f.img, false);
        Cook.sfx.pop();
        S.tweens.add({ targets: spoon, x: f.x + z.L(40), y: f.y + z.L(40), duration: 100 });
        if (f.leave) {
          z.listen(false, `lifted ${wordOf(f.kind)} (Nani said leave them)`);
          z.oops();
          S.fly(f.img, z.X(250), z.Y(120), { duration: 380, arc: z.L(80) }).then(() => f.img.destroy());
          return;
        }
        const score = f.v >= 1 ? k.burntScore : S.bandScore(f.v, lo, hi);
        z.skill(score, "fry");
        S.verdict(f.x, f.y - z.L(80), score, { perfect: "golden", bad: f.v >= 1 ? "burnt" : "too-pale" });
        if (f.kind === kind) lifted++;
        // the picture tally: what you've lifted out, by kind
        UI.countUp(wordOf(f.kind), { state: f.kind === "samosa" ? "fried" : "bowl" });
        S.fly(f.img, z.X(250 + (doneOut.length % 4) * 80), z.Y(St.STRIP_Y - 30 + Math.floor(doneOut.length / 4) * 60), { duration: 380, arc: z.L(120) });
        doneOut.push(f);
        z.progress({ fried: doneOut.length });
      };
      await new Promise((resolve) => {
        tray.forEach((t) =>
          S.tappable(t, () => {
            dropped++;
            if (t.kind === kind) droppedMine++;
            S.untap(t);
            if (t.kind !== kind) {
              z.listen(false, `fried ${wordOf(t.kind)} (not asked for)`);
              z.oops();
            }
            const p = slotPos();
            Cook.sfx.sizzle(0.6);
            if (dropped === 1) z.passMeAfter(k.passMeAfterMs); // hands idle: Nani may ask
            S.fly(t, p.x, p.y, { duration: 320, arc: z.L(80), scale: t.baseScale * 0.9 }).then(() => {
              S.burst(p.x, p.y, [0xfff0c0, 0xe6b84a], 10, z.L(50));
              fry(t, p);
            });
          })
        );
        let doneShown = false;
        let last = performance.now();
        const stop = z.tick(() => {
          const now = performance.now();
          const dt = Math.min(0.1, (now - last) / 1000) * Cook.speed;
          last = now;
          frying.forEach((f) => {
            if (f.out) return;
            f.v += f.rate * dt;
            if (f.leave) f.v = Math.min(f.v, hi - 0.02); // Nani's: they wait in the green, tempting
            f.img.setTint(Phaser.Display.Color.GetColor(255, 255 - Math.min(1, f.v) * 60, 255 - Math.min(1, f.v) * 130));
            const inB = f.v >= lo && f.v <= hi;
            if (inB !== !!f.glow) {
              f.glow = inB;
              S.glow(f.img, inB);
            }
            if (!f.leave && f.v >= k.burnAt) lift(f);
          });
          drawRings();
          // Done once everything you dropped is out again
          const mine = frying.filter((f) => !f.leave);
          const settled = dropped >= 1 && mine.length === dropped && mine.every((f) => f.out);
          if (settled && !doneShown) {
            doneShown = true;
            UI.done({ glow: ctx.guided && lifted >= count }).then(() => {
              stop();
              ringG.clear();
              z.expect(null);
              resolve();
            });
          } else if (!settled && doneShown) {
            doneShown = false;
            UI.hideDone();
          }
          // for the test: lift anything of ours in the band, else drop another if needed
          const ready = mine.find((f) => !f.out && f.kind === kind && f.v >= lo + (hi - lo) * 0.2);
          const next = droppedMine < count ? tray.find((t) => t.kind === kind && t.input && t.input.enabled) : null;
          const wrongs = tray.filter((t) => t.kind !== kind && t.input && t.input.enabled).map((t) => ({ x: t.x, y: t.y }));
          if (ready) z.expect({ kind: "tap", x: ready.x, y: ready.y, key: "lift" });
          else if (next) z.expect({ kind: "tap", x: next.x, y: next.y, key: "drop", wrongs });
          else if (settled) z.expect({ kind: "click", selector: "#done-btn" });
          else z.expect({ kind: "wait" });
        });
        if (ctx.guided) S.glow(tray.find((t) => t.kind === kind), true);
        if (count === 0) {
          // nothing to fry (they didn't ask): Done straight away is right
          UI.done({ glow: ctx.guided }).then(() => {
            stop();
            z.expect(null);
            resolve();
          });
          z.expect({ kind: "click", selector: "#done-btn" });
        }
      });
      // Nani takes hers out
      frying.filter((f) => f.leave && !f.out).forEach((f) => S.fly(f.img, z.X(250), z.Y(120), { duration: 380, arc: z.L(80) }));
      sizzle.stop();
      ctx.result.fried = lifted;
      z.listen(lifted === count, `fried ${lifted}, they asked for ${count}: ${wordOf(kind)}`);
      if (!ctx.guided && count >= 1 && count <= 5) (lifted === count ? Cook.markRight : Cook.markMiss)(Cook.numId(count));
      await Cook.wait(300);
      return lifted;
    },
  });

  // Wave 6b: the kept station, samosa + fry, in one go (fill, fold as many as they said, fry them)
  Mech.lab("samosa", {
    name: "Samosa + fry",
    verb: "Fill, fold, fry",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.samosa.make(Cook.pick(["nana", "ma", "cousin"]), { level: L.level });
      L.card(d, R.samosa.steps(d));
      const made = await St.fillFold(L.S, L.ctx, { fillings: d.fillings, exclude: d.no, decoyPool: Cook.data.recipes.samosa.lists.fillings_all, count: d.count, level: L.level }, { region: L.region });
      await L.station("fry", { kind: "samosa", count: d.count, made });
    },
  });

  Mech.lab("fry", {
    name: "Fry",
    verb: "Lift when golden",
    async run(L) {
      const n = Cook.pick([1, 2, 3]);
      L.card([Lang.line(Lang.orderFrame(0), Lang.phrase(Lang.countParts(n, "ph-samosa")))], ["Fry"]);
      await L.station("fry", { kind: "samosa", count: n });
    },
  });
})(window);

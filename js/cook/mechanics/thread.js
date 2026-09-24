/*
 * Mechanic: thread (build the skewers they asked for). The skewer points
 * away from you on the board, handle at the bottom; tap a bowl and the
 * piece goes on from the tip and slides down. When it's full it's done.
 * Tap the skewer to slide the last piece back off.
 *
 * Kutchi: which kind and how many ("bo ghos, hikdo vegetable"), and for a
 * mixed skewer the pieces in the order they said ("ghos, ne poi tameto…").
 * Every piece bowl is always there (plus decoys at later levels), in a new
 * order each time, and nothing stops you at the number ordered: you
 * decide how many to make. A piece that fits no skewer in the order costs
 * the ear star at once; the count is graded where the skewers end up (the
 * grill's plate, or Done when threading on its own).
 *
 * In a zone with an `out` channel (the Mishkaki grill station) each
 * finished skewer is sent on as {kind: "skewer", pieces, sprite} when the
 * rack has room (`line.room()`); `until` (a promise) ends it.
 * Params: skewers ({kind word: count}), pattern (the mixed skewer, in
 * order), line, until, layout {bowlsX, boardX, rowX}.
 * Knobs (data.mechanics.thread): pieces (per skewer), decoys, decoyPool,
 * showAfterMs (after Nani's hint, the piece glows: being shown).
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  Mech.define("thread", {
    station: "thread",
    view: "marble",
    footprint: { x: 380, y: 40, w: 1100, h: 840 },
    async run(z, params, k) {
      const S = z.S;
      const ctx = z.ctx;
      const SK = Cook.Skewer;
      const want = params.skewers || {};
      const pattern = params.pattern || [];
      const line = params.line || {};
      const lay = Object.assign({ bowlsX: 540, boardX: 800, rowX: 1010 }, params.layout || {});
      const n = k.pieces;
      const ordered = Object.keys(want).filter((w) => want[w] > 0);
      const mixedW = SK.kindWord("mixed");
      const SKY = 440; // the skewer's centre on the board

      /* the bowls: every skewer piece (and decoys), in a new order each time */
      const pieceIds = SK.pieceIds();
      const ids = Cook.shuffle(pieceIds.concat(St.decoys(k.decoyPool || [], pieceIds, k.decoys || 0)));
      const bowls = {};
      const y0 = 140;
      const y1 = 770;
      ids.forEach((id, i) => {
        const y = ids.length === 1 ? 450 : y0 + ((y1 - y0) * i) / (ids.length - 1);
        bowls[id] = S.ingredient(id, z.X(lay.bowlsX), z.Y(y), { w: z.L(150), h: z.L(ids.length > 4 ? 100 : 112) });
      });
      S.track(S.add.image(z.X(lay.boardX), z.Y(430), SK.tex(S, "board")).setScale(z.k).setDepth(D.item - 2));
      const hand = S.hand(null, { x: z.X(lay.boardX + 10), y: z.Y(735), k: z.k * 0.7 });
      hand.setDepth(D.item + 1.5);

      /* the skewer on the board */
      let sk = null;
      let hit = null;
      const fresh = () => {
        sk = SK.make(S, [], { x: z.X(lay.boardX), y: z.Y(SKY), scale: z.k, n, depth: D.item + 1 });
        sk.setAlpha(0);
        S.tweens.add({ targets: sk, alpha: 1, duration: 250 });
        sk.target = null;
      };
      hit = S.track(S.add.zone(z.X(lay.boardX), z.Y(SKY - 60), z.L(150), z.L(560)).setDepth(D.fx + 3));
      fresh();

      const made = {};
      let odd = 0;
      let tickedMixed = false;
      let busy = false;
      let waiting = false;
      let stopped = false;
      const doneRow = [];

      /** What a careful cook taps next: {w, id} (a piece for a skewer still needed), {undo}, or null. */
      const plan = () => {
        if (!sk || sk.ids.length >= n) return null;
        const left = {};
        ordered.forEach((w) => (left[w] = want[w] - (made[w] || 0)));
        const cands = ordered.filter((w) => left[w] > 0 && SK.fits(w, sk.ids, pattern));
        if (!cands.length) return sk.ids.length ? { undo: true } : null;
        const w = cands.includes(sk.target) ? sk.target : cands[0];
        const i = sk.ids.length;
        const what = SK.kindOfWord(w);
        const of = (c) => ids.filter((id) => SK.cls(id) === c);
        const id = what === "mixed" ? pattern[i] : what === "meat" ? of("meat")[0] : of("veg")[i % of("veg").length];
        return { w, id };
      };
      line.threading = () => !stopped && (!!plan() || (sk && sk.ids.length > 0 && sk.ids.length < n));
      line.blocked = () => waiting;

      /* Nani's help if you hesitate: she says it again (the no-help star), then it glows (the ear star) */
      let idle = 0;
      let hinted = false;
      let shown = null;
      const poke = () => {
        idle = 0;
        hinted = false;
        if (shown && !z.guided) S.glow(shown, false);
        shown = null;
      };
      line.poke = line.poke || poke;
      const hintLine = (p) => (SK.kindOfWord(p.w) === "mixed" ? Lang.wordLine(p.id) : Lang.bare(Lang.phrase(Lang.countParts(want[p.w], p.w))));

      /* a piece onto the skewer, from the tip */
      const tapPiece = async (id) => {
        poke();
        if (busy || stopped || waiting || sk.ids.length >= n) {
          S.wiggle(bowls[id]);
          return;
        }
        const exp = plan();
        busy = true;
        const from = bowls[id];
        const fly = S.track(S.add.image(from.x, from.y, SK.tex(S, `piece:${id}`)).setScale(SK.pieceScale(n) * z.k).setDepth(D.item + 3));
        Cook.sfx.pop();
        await S.fly(fly, z.X(lay.boardX), z.Y(SKY - 250), { duration: 300, arc: z.L(90) });
        fly.destroy();
        const img = SK.addPiece(S, sk, id, { at: -250 });
        const slot = SK.slotY(sk.ids.length - 1, n);
        await Cook.tween(S, { targets: [img, img.marks], y: slot, duration: 180 + (slot + 250) * 0.6, ease: "Quad.easeIn" });
        if (exp && exp.w) sk.target = exp.w;
        if (!ordered.some((w) => SK.fits(w, sk.ids, pattern))) {
          const e = exp && exp.id ? exp.id : null;
          z.listen(false, e ? `${id} instead of ${e}` : `${id}, not in the order`);
          if (!z.guided) Cook.markMiss(e || id);
          S.wiggle(sk);
          z.oops();
        }
        if (sk.ids.length >= n) await finish();
        busy = false;
      };

      /* tap the skewer: the last piece slides back off */
      S.tappable(hit, async () => {
        poke();
        if (busy || stopped || waiting || !sk.ids.length) return;
        busy = true;
        const img = sk.imgs[sk.imgs.length - 1];
        const id = sk.ids[sk.ids.length - 1];
        const wx = sk.x + img.x * sk.scaleX;
        const wy = sk.y + img.y * sk.scaleY;
        SK.popPiece(sk);
        const back = S.track(S.add.image(wx, wy, SK.tex(S, `piece:${id}`)).setScale(SK.pieceScale(n) * z.k).setDepth(D.item + 3));
        Cook.sfx.soft();
        await S.fly(back, bowls[id].x, bowls[id].y, { duration: 280, arc: z.L(60) });
        back.destroy();
        busy = false;
      });

      /* a full skewer: to the rack (or the row beside the board) */
      const finish = async () => {
        const c = SK.classify(sk.ids, pattern);
        if (c.ok) made[c.kind] = (made[c.kind] || 0) + 1;
        else odd++;
        S.sparkle(z.X(lay.boardX), z.Y(SKY - 60));
        Cook.sfx.right();
        if (c.ok && c.kind === mixedW && !tickedMixed && ctx.tickItem) {
          tickedMixed = true;
          sk.ids.forEach((id, i) => {
            if (!z.guided) Cook.markRight(id);
            ctx.tickItem(i);
          });
        }
        z.progress({ threaded: sk.ids.slice(), kind: c.kind });
        await Cook.wait(250);
        if (z.out) {
          waiting = true;
          while (!stopped && line.room && line.room() <= 0) await Cook.wait(120);
          waiting = false;
          if (stopped) return;
          z.emit({ kind: "skewer", pieces: sk.ids.slice(), sprite: sk });
        } else {
          const j = doneRow.length;
          doneRow.push(sk);
          S.tweens.add({ targets: sk, x: z.X(lay.rowX + Math.min(j, 5) * 80), y: z.Y(SKY), scale: 0.55 * z.k, duration: 380, ease: "Sine.easeInOut" });
          if (j === 0) doneBtn();
        }
        fresh();
      };

      ids.forEach((id) => S.tappable(bowls[id], () => tapPiece(id)));

      /* on its own: Done ends it (and grades the count); in the station, `until` */
      let resolveStop;
      const stop = new Promise((r) => (resolveStop = r));
      if (params.until) params.until.then(() => resolveStop());
      let doneShown = false;
      const doneBtn = () => {
        doneShown = true;
        UI.done({ glow: false }).then(() => resolveStop());
      };

      /* every frame: help timers, glows, what to do next (for the test) */
      let lastT = performance.now();
      let glowing = null;
      const off = z.tick(() => {
        const now = performance.now();
        const dtReal = now - lastT;
        lastT = now;
        if (stopped) return;
        const p = busy || waiting ? null : plan();
        const target = p && p.id ? bowls[p.id] : null;
        if (z.guided) {
          if (target !== glowing) {
            if (glowing) S.glow(glowing, false);
            if (target) S.glow(target, true);
            glowing = target;
          }
          if (!z.out && doneShown) UI.glowDone(!busy && !odd && !sk.ids.length && Object.keys(made).every((w) => made[w] === (want[w] || 0)) && ordered.every((w) => made[w] === want[w]));
        } else if (target && !(line.cooking && line.cooking())) {
          idle += dtReal;
          if (!hinted && idle > Cook.hintDelay(p.w)) {
            hinted = true;
            if (Cook.onHelp) Cook.onHelp("hint");
            St.nani(hintLine(p)).catch(() => {});
          }
          if (hinted && !shown && idle > Cook.hintDelay(p.w) + k.showAfterMs) {
            shown = target;
            S.glow(target, true);
            if (Cook.onHelp) Cook.onHelp("shown", { ids: [p.w] });
          }
        }
        if (busy) return z.expect({ kind: "wait" });
        if (!p) {
          if (!z.out && doneShown && !sk.ids.length) return z.expect({ kind: "click", selector: "#done-btn" });
          return z.expect(null);
        }
        if (p.undo) return z.expect({ kind: "tap", x: hit.x, y: z.Y(SKY), key: "undo" });
        const c = S.centre(target);
        const jig = ((sk.ids.length % 3) - 1) * z.L(14);
        const wrongs = ids.filter((id) => id !== p.id).map((id) => S.centre(bowls[id]));
        z.expect({ kind: "tap", x: c.x + jig, y: c.y, key: p.id, wrongs });
      });

      await stop;
      stopped = true;
      off();
      z.expect(null);
      if (glowing) S.glow(glowing, false);
      if (shown) S.glow(shown, false);
      ids.forEach((id) => S.untap(bowls[id]));
      S.untap(hit);
      if (!z.out) {
        UI.hideDone();
        // on its own, the count is graded here: the right number of each kind
        const kinds = [...new Set(ordered.concat(Object.keys(made)))];
        kinds.forEach((w) => {
          const got = made[w] || 0;
          const m = want[w] || 0;
          z.listen(got === m, `${got} ${w} skewers, they asked for ${m}`);
          if (!z.guided) (got === m ? Cook.markRight : Cook.markMiss)(w);
        });
        if (odd) z.listen(false, `${odd} skewer${odd > 1 ? "s" : ""} not in the order`);
        ctx.result.skewers = doneRow.map((s) => s.ids.slice());
        await Cook.wait(300);
      }
      return Object.values(made).reduce((a, b) => a + b, 0) + odd;
    },
  });

  Mech.lab("thread", {
    name: "Skewer",
    verb: "Which kind, how many",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.mishkaki.make(Cook.pick(["nana", "ma", "cousin"]), { level: L.level });
      L.card(d, ["Skewer"]);
      await L.station("thread", { skewers: d.skewers, pattern: d.pattern });
    },
  });
})(window);

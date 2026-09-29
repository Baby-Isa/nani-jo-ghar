/*
 * Mechanic: thread (build the skewers they asked for). The skewer points
 * away from you on the board, handle at the bottom; tap a bowl and the
 * piece goes on from the tip and slides down. When it's full it's done.
 * Tap the skewer to slide the last piece back off.
 *
 * Sekelo v2 (docs/design/cook-design-system-v1.md §15): the chai v2 grid. The
 * prep bowls sit top-down on the shelf band (Zafar, 29 Sept: this station stays top-down) (identical slots, meat | veg,
 * a `🔊 word` chip under each: tap the bowl = thread it, tap the chip = hear
 * it; speaker-only at level 3 up); the board with its upright skewer on the
 * left of the scene, the skewer rack on the right. A piece's word pops by the
 * skewer as it goes on (the family clip plays). A finished skewer moves to
 * the rack, then the next starts; no picture tally (the rack shows them).
 * The meat piece is ph-mishkaki (mishkaki = the meat cubes).
 *
 * Kutchi: which kind and how many ("ba lakri gos, hakri lakri boga"), and for a
 * mixed skewer the pieces in the order they said ("gos, ne poi tameto…").
 * Every piece bowl is always there (plus decoys at later levels), in a new
 * order each time, and nothing stops you at the number ordered: you
 * decide how many to make. A piece that fits no skewer in the order
 * bounces back to its bowl and costs the ear star; the count is graded
 * where the skewers end up (the grill's plate, or Done when threading on
 * its own).
 *
 * In a zone with an `out` channel (the Mishkaki grill's juggle, level 4)
 * each finished skewer is sent on as {kind: "skewer", pieces, sprite} when
 * the rack has room (`line.room()`); `until` (a promise) ends it.
 * Wave 6, one job at a time (`handoff`: {label, max}): the finished skewers
 * wait in a row beside the board, the count isn't graded here (the plate
 * is), and the big button ("Go to the barbecue") ends it; it returns
 * {items: [{pieces}]} for the grill's rack. `max`: no more skewers than
 * the rack holds.
 * Params: skewers ({kind word: count}), pattern (the mixed skewer, or several different ones, in
 * order), line, until, layout {bowlsX, boardX, rowX}, handoff.
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
    footprint: { x: 0, y: 0, w: 1600, h: 900 },
    async run(z, params, k) {
      const S = z.S;
      const ctx = z.ctx;
      const SK = Cook.Skewer;
      SK.resetIcons();
      const want = params.skewers || {};
      const pattern = params.pattern || [];
      // two different mixes (design system 12): one skewer of each
      const pats = SK.pats(pattern);
      const madePat = pats.map(() => 0);
      const line = params.line || {};
      const handoff = params.handoff || null;
      const n = k.pieces;
      const ordered = Object.keys(want).filter((w) => want[w] > 0);
      const mixedW = SK.kindWord("mixed");
      // Sekelo v2 (§15): the board and its upright skewer on the left of the scene, the rack on the right,
      // the prep bowls on the shelf band below (the chai v2 grid)
      const BOARD = { x: 560, y: 346, w: 250, h: 586 };
      // the scene is raised into the middle of a taller stage's worktop (the stage fill); the shelf band keeps z0
      const z0 = z;
      z = Cook.liftZone(z0);
      const SKY = 352; // the skewer's centre on the board
      const SKS = 0.84; // the skewer on the board
      const RACK = { x: 1090, y: SKY, s: 0.6 }; // the rack sized to its skewers (followup, 29 Sept)
      const slots = (handoff && handoff.max) || 4;
      const full = () => handoff && handoff.max && doneRow.length >= handoff.max;

      /* the bowls: every skewer piece (and decoys), on the shelf, meat | vegetables, in a new order each time */
      const pieceIds = SK.pieceIds();
      const ids = pieceIds.concat(St.decoys(k.decoyPool || [], pieceIds, k.decoys || 0));
      await SK.loadArt(S, ids);
      SK.band(S, z0);
      const meatIds = ids.filter((id) => SK.cls(id) === "meat");
      const groups = [Cook.shuffle(meatIds), Cook.shuffle(ids.filter((id) => !meatIds.includes(id)))].filter((g) => g.length);
      const bowls = SK.shelf(S, z0, groups, { level: z.level });
      const board = S.track(S.add.image(z.X(BOARD.x), z.Y(BOARD.y), S.textures.exists("sk2-board") ? "sk2-board" : SK.tex(S, "board")).setDepth(D.item - 2));
      if (S.textures.exists("sk2-board")) board.setAngle(90).setDisplaySize(z.L(BOARD.h), z.L(BOARD.w));
      else board.setDisplaySize(z.L(BOARD.w), z.L(BOARD.h));
      board.shadow = S.contactShadow(board, { centerX: z.X(BOARD.x), centerY: z.Y(BOARD.y), width: z.L(BOARD.w), height: z.L(BOARD.h) });
      const rack = SK.rack(S, z, { x: RACK.x, y: RACK.y, slots, s: RACK.s });

      /* the skewer on the board */
      let sk = null;
      let hit = null;
      const fresh = () => {
        sk = SK.make(S, [], { x: z.X(BOARD.x), y: z.Y(SKY), scale: z.k * SKS, n, depth: D.item + 1 });
        sk.setAlpha(0);
        S.tweens.add({ targets: sk, alpha: 1, duration: 250 });
        sk.target = null;
      };
      hit = S.track(S.add.zone(z.X(BOARD.x), z.Y(SKY - 40), z.L(170), z.L(560)).setDepth(D.fx + 3));
      fresh();

      const made = {};
      let odd = 0;
      let busy = false;
      let waiting = false;
      let stopped = false;
      const doneRow = [];

      /** What a careful cook taps next: {w, id} (a piece for a skewer still needed), {undo}, or null. */
      const plan = () => {
        if (!sk || sk.ids.length >= n || full()) return null;
        const left = {};
        ordered.forEach((w) => (left[w] = want[w] - (made[w] || 0)));
        const cands = ordered.filter((w) => left[w] > 0 && SK.fits(w, sk.ids, pattern));
        if (!cands.length) return sk.ids.length ? { undo: true } : null;
        const w = cands.includes(sk.target) ? sk.target : cands[0];
        const i = sk.ids.length;
        const what = SK.kindOfWord(w);
        const of = (c) => ids.filter((id) => SK.cls(id) === c);
        // a mixed one: the mix this skewer has started (and not made yet), else the first still to make
        const pt = pats.length > 1 ? pats.find((x, j) => !madePat[j] && sk.ids.every((p, q) => p === x[q])) || pats[0] : pats[0] || [];
        const id = what === "mixed" ? pt[i] : what === "meat" ? of("meat")[0] : of("veg")[i % of("veg").length];
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
      // said as the order said it: "Ba lakri gos." (the skewer's `unit` word before the kind)
      const unitOf = (w) => (SK.cfg().unit ? [SK.cfg().unit, w] : [w]);
      const hintLine = (p) => (SK.kindOfWord(p.w) === "mixed" ? Lang.wordLine(p.id) : Lang.bare(Lang.phrase(Lang.countParts(want[p.w], p.w).flatMap((x) => (typeof x === "string" ? unitOf(x) : [x])))));

      /* a piece onto the skewer, from the tip */
      const tapPiece = async (id) => {
        poke();
        if (busy || stopped || waiting || sk.ids.length >= n || full()) {
          S.wiggle(bowls[id]);
          return;
        }
        const exp = plan();
        busy = true;
        const from = bowls[id];
        const fly = S.track(S.add.image(from.x, from.y, SK.tex(S, `piece:${id}`)).setScale(SK.pieceScale(n) * z.k * SKS).setDepth(D.item + 3));
        Cook.sfx.pop();
        await S.fly(fly, z.X(BOARD.x), z.Y(SKY - 250 * SKS), { duration: 300, arc: z.L(90) });
        if (!ordered.some((w) => SK.fits(w, sk.ids.concat(id), pattern))) {
          // it fits no skewer they asked for: it bounces back to its bowl
          const e = exp && exp.id ? exp.id : null;
          z.listen(false, e ? `${id} instead of ${e}` : `${id}, not in the order`);
          if (!z.guided) Cook.markMiss(e || id);
          if (!z.quiet) {
            // level 1: it bounces back to its bowl (the one gentle correction)
            S.wiggle(sk);
            z.oops();
            await S.fly(fly, from.x, from.y, { duration: 280, arc: z.L(60) });
            fly.destroy();
            busy = false;
            return;
          }
          // level 2 up (UX 11): it goes on like any other piece; the plate and the review judge the skewer
        }
        fly.destroy();
        const img = SK.addPiece(S, sk, id, { at: -250 });
        const slot = SK.slotY(sk.ids.length - 1, n);
        await Cook.tween(S, { targets: [img, img.marks], y: slot, duration: 180 + (slot + 250) * 0.6, ease: "Quad.easeIn" });
        // the word pops by the skewer as the piece settles, and the family clip plays
        SK.pop(S, z, id, z.X(BOARD.x - BOARD.w / 2 - 130), z.Y(SKY + slot * SKS));
        if (exp && exp.w) sk.target = exp.w;
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
        const back = S.track(S.add.image(wx, wy, SK.tex(S, `piece:${id}`)).setScale(SK.pieceScale(n) * z.k * SKS).setDepth(D.item + 3));
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
        // (§15: no picture tally; the rack shows the skewers made)
        // that skewer's mini card on the order ticks (28 Sept); a wrong one ticks nothing (no verdicts mid-round)
        if (c.ok && ctx.tickCard) ctx.tickCard(c.kind);
        S.sparkle(z.X(BOARD.x), z.Y(SKY - 60));
        Cook.sfx.right();
        // a mixed one ticks its own mix's pieces (the sequence's positions: two different mixes are said one after the other)
        if (c.ok && c.kind === mixedW && !madePat[c.pat] && ctx.tickItem) {
          const at = pats.slice(0, c.pat).reduce((a, x) => a + x.length, 0);
          sk.ids.forEach((id, i) => {
            if (!z.guided) Cook.markRight(id);
            ctx.tickItem(at + i);
          });
        }
        if (c.ok && c.kind === mixedW && c.pat >= 0) madePat[c.pat]++;
        z.progress({ threaded: sk.ids.slice(), kind: c.kind });
        await Cook.wait(250);
        if (z.out) {
          waiting = true;
          while (!stopped && line.room && line.room() <= 0) await Cook.wait(120);
          waiting = false;
          if (stopped) return;
          z.emit({ kind: "skewer", pieces: sk.ids.slice(), sprite: sk });
        } else {
          // it moves to the rack (upright, bridging the rails), then the next one starts on the board
          const j = doneRow.length;
          doneRow.push(sk);
          sk.setDepth(D.item + 0.5 + j * 0.01);
          await Cook.tween(S, { targets: sk, x: rack.x(Math.min(j, slots - 1)), y: rack.y, scale: RACK.s * z.k, duration: 420, ease: "Sine.easeInOut" });
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
        if (handoff) {
          UI.go(handoff.label, { glow: false }).then(() => resolveStop());
          SK.goIcon();
        }
        else UI.done({ glow: false }).then(() => resolveStop());
      };
      const doneSel = handoff ? "#go-btn" : "#done-btn";

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
          if (!z.out && doneShown) (handoff ? UI.glowGo : UI.glowDone)(!busy && !odd && !sk.ids.length && Object.keys(made).every((w) => made[w] === (want[w] || 0)) && ordered.every((w) => made[w] === want[w]));
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
          if (!z.out && doneShown && !sk.ids.length) return z.expect({ kind: "click", selector: doneSel });
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
      if (handoff) {
        // one job at a time: the skewers go on to the barbecue's rack; the plate grades the count
        UI.hideGo();
        await Cook.wait(200);
        return { items: doneRow.map((s) => ({ pieces: s.ids.slice() })), shelf: groups };
      }
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
      await L.station("thread", { skewers: d.skewers, pattern: d.pattern2 ? [d.pattern, d.pattern2] : d.pattern });
    },
  });
})(window);

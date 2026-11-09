/*
 * Mechanic: roll (and decide how many). Two hands on the pin: drag up and
 * down until the dough fills the dashed circle; overdo it and it tears.
 * Then another ball, or the tick when you've made as many as they said.
 * Kutchi: how many ("trae maani").
 *
 * In a zone with an `out` channel (the Maani line, Roll -> Tawa), each
 * rolled maani is sent on as {kind: "maani", sprite, score}; the next zone
 * can fly the sprite over and cook it.
 * Params: count, at/spareAt/stackAt (design coords, to re-lay it out).
 * Knobs (data.mechanics.roll): radius, startRadius, band, grow, maxSize,
 * tearAt, tornScore, doneAt, quietMs, maxCount, special.
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
   * The legacy Roll lab (S05-C2, decision 77: no new art): the maani line's painted chakla, velan and dough
   * (assets/cook/items/v3/maani/), measured as the maani line measures them; the drawn ones only if a picture fails.
   */
  const V3 = "assets/cook/items/v3/maani/";
  const V3_ART = [
    ["mv-chakla", V3 + "chakla.webp"],
    ["mv-velan", V3 + "velan.webp"],
    ["mv-ball-maani", V3 + "dough-ball-wheat.webp"],
    ["mv-raw-maani", V3 + "maani-wheat-raw.webp"],
  ];
  const CHAKLA = { cx: 0.4988, cy: 0.4988, r: 0.4746 }; // the maani line's (measured from the art)
  const DISC_R = 0.44; // a maani state's disc radius (of the width)
  const BALL_R = 0.437; // a dough ball's

  Mech.define("roll", {
    station: "roll",
    view: "marble",
    footprint: { x: 150, y: 180, w: 1300, h: 660 },
    async run(z, { count, at, spareAt, stackAt }, k) {
      const S = z.S;
      const ctx = z.ctx;
      at = St.pt(at, { x: 780, y: 430 });
      const sp = St.pt(spareAt, { x: 230, y: 760 });
      const sk = St.pt(stackAt, { x: 1330, y: 700 });
      // (alone only: Roll -> Tawa hands its maani to the tawa, which draws the next states in its own art)
      if (!z.out) await St.loadArt(S, V3_ART);
      const v3 = !z.out && V3_ART.every(([key]) => S.textures.exists(key));
      const ball = v3 ? "mv-ball-maani" : "dough-ball";
      const raw = v3 ? "mv-raw-maani" : "chapati-raw";
      const fit = (img, w) => img.setScale(z.L(w) / ((img.texture.key === raw && v3 ? 2 * DISC_R : img.texture.key === ball && v3 ? 2 * BALL_R : 1) * S.texSize(img.texture.key).w));
      let one = {};
      if (v3) {
        // the chakla stays (rollOne rolls on it): placed by its round body, as on the maani line
        const D_CH = z.L(500);
        const board = S.track(S.add.image(z.X(at.x), z.Y(at.y), "mv-chakla").setOrigin(CHAKLA.cx, CHAKLA.cy).setDepth(D.item - 2));
        board.setScale(D_CH / 2 / (CHAKLA.r * board.width));
        if (S.contactShadow) board.shadow = S.contactShadow(board);
        // the maani line's target too: a faint gold ring that glows at the right size, not the white dashed circle
        one = { board: false, tex: { ball, raw }, pinTex: "mv-velan", pinW: 520, body: (key) => (key === raw ? DISC_R : key === ball ? BALL_R : 0.5), gold: true };
      }
      const rolled = [];
      const spare = S.track(S.add.image(z.X(sp.x), z.Y(sp.y), ball).setDepth(D.item));
      if (v3) fit(spare, 120);
      else spare.setScale(0.45 * z.k);
      spare.baseScale = spare.scale;
      const stack = [];
      for (;;) {
        spare.setVisible(false);
        const score = await rollOne(z, k, at, v3 ? Object.assign({}, one, { dough: S.track(S.add.image(z.X(at.x), z.Y(at.y), ball)) }) : {});
        rolled.push(score);
        z.skill(score, "roll");
        const done = S.track(S.add.image(z.X(sk.x), z.Y(sk.y) - z.L(stack.length * 10), raw).setDepth(D.item + stack.length));
        if (v3) fit(done, 230);
        else done.setScale(0.36 * z.k);
        stack.push(done);
        UI.count(rolled.length, { id: "cook-maani", state: "raw" });
        z.emit({ kind: "maani", sprite: z.out ? done : null, score, n: rolled.length });
        // SH-238 (no ✓): the rolling ends by itself once as many as they asked for are made
        if (rolled.length >= k.maxCount || (count > 0 && rolled.length >= count)) break;
        spare.setVisible(true);
        if (z.guided && rolled.length < count) S.glow(spare, true);
        const more = await new Promise((resolve) => {
          const finish = (v) => {
            z.expect(null);
            S.untap(spare);
            S.glow(spare, false);
            resolve(v);
          };
          S.tappable(spare, () => finish(true));
          const c = S.centre(spare);
          z.expect({ kind: "tap", x: c.x, y: c.y, key: "more" });
        });
        if (!more) break;
      }
      if (z.out) spare.setVisible(false);
      UI.hideCount();
      ctx.result.maani = rolled.length;
      z.listen(rolled.length === count, `made ${rolled.length} maani, they asked for ${count}`);
      // the number word moves on (or back) with what you made (audit: counts teach numbers)
      if (!z.guided && count >= 1 && count <= 5) (rolled.length === count ? Cook.markRight : Cook.markMiss)(Cook.numId(count));
      return rolled.length;
    },
  });

  /**
   * Roll one ball on the chakla: the building block (the Maani line uses it
   * too, as Mech.rollOne). Resolves with the score, or with {score, target,
   * sprite, torn} when opts.keep. opts:
   *   dough    a dough sprite already there (flown in from a bowl)
   *   board    false: the caller draws a chakla that stays
   *   tex      {ball, raw}: texture keys for this dough (millet dough is greyer)
   *   targets  [{id, r}]: several dashed circles (big and small); the
   *            nearest one to where you stop is the size you made
   *   aim      which target the test aims for (the gauge; never shown)
   *   quietMs  how long a pause ends the roll (default the knob)
   *   patient  a pause only ends the roll on (or past) a circle: stop short,
   *            or between the two, and it waits for you (to flip a maani)
   *   onStart  called once, when the pin first moves the dough
   *   handle   {} that gets cancel(): stop without a score (resolves null)
   *   pinTex   a rolling-pin texture (level, e.g. the maani v2 velan): the pin rolls on its own, no hands;
   *            pinW its width (design px)
   *   body     (key) => the fraction of the texture's width that is the round body's radius (default 0.5)
   *   gold     the target is a faint gold ring etched on the board that glows when the maani is the
   *            right size (maani v2, §11), not the white dashed circle
   *   rimStop  MAA-21 (Zafar, 9 Nov): before the big/small lesson, the radius (design px) where the dough stops hard, at the
   *            board's rim or just inside it: no ring drawn, never a tear; the juice sound at the stop, and the roll ends by
   *            itself there (a pause before it ends it too once the maani is a fair size: any size up to the stop counts)
   */
  function rollOne(z, k, at, opts = {}) {
    const S = z.S;
    return new Promise((resolve) => {
      const cx = z.X(at.x);
      const cy = z.Y(at.y);
      const targets = (opts.targets || [{ id: null, r: k.radius }]).map((t) => Object.assign({}, t, { R: z.L(t.r) }));
      const aimT = targets[opts.aim || 0] || targets[0];
      const Rmax = Math.max(...targets.map((t) => t.R));
      const Rmin = Math.min(...targets.map((t) => t.R));
      const quietMs = opts.quietMs || k.quietMs;
      const [lo, hi] = k.band;
      let r = z.L(k.startRadius);
      const chakla = opts.board === false ? null : S.flat(S.tex("chakla"), cx, cy + z.L(10), z.L(560), z.L(460), { depth: D.item - 2 });
      const dough = opts.dough || S.track(S.add.image(cx, cy, "dough-ball"));
      dough.setPosition(cx, cy).setDepth(D.item + 1);
      const tex = Object.assign({ ball: "dough-ball", raw: "chapati-raw" }, opts.tex);
      const setR = () => {
        const key = r < z.L(90) ? tex.ball : tex.raw;
        if (dough.texture.key !== key) dough.setTexture(key);
        // opts.body(key): how much of its canvas the dough's round body fills (the v3 maani art has
        // margins), so the dough's edge, not its box, is r across; default the whole width
        const fr = (opts.body && opts.body(key)) || 0.5;
        dough.setScale(r / (fr * S.texSize(key).w));
      };
      setR();
      // the target you're nearest to (by ratio: 10% short of small is nearer small)
      const nearest = () => targets.reduce((a, t) => (Math.abs(Math.log(r / t.R)) < Math.abs(Math.log(r / a.R)) ? t : a));
      const guide = S.track(S.add.graphics().setDepth(D.fx));
      // (STD-E6-01: the ring's colours are the tokens: the flat gold, the one highlight colour for its glow, sage for the dashes' right)
      const T = global.Tokens;
      const tok = (name) => (T && T.int ? T.int(name) : 0);
      const INK = { gold: tok("gold"), glow: tok("focus"), right: tok("cook-sage-dark"), card: tok("card") };
      // (MAA-21: before the big/small lesson the hard stop at the board's rim, no ring; the gauge, the test's, reads the way to the stop)
      const rimR = opts.rimStop ? z.L(opts.rimStop) : 0;
      const drawGuide = () => {
        guide.clear();
        if (rimR) return;
        const near = nearest();
        targets.forEach((t) => {
          const ok = t === near && r >= t.R * lo && r <= t.R * hi;
          if (opts.gold) {
            if (ok) {
              guide.lineStyle(z.L(22), INK.glow, 0.28);
              guide.strokeCircle(cx, cy, t.R);
            }
            guide.lineStyle(z.L(ok ? 7 : 4), INK.gold, ok ? 1 : 0.45);
            guide.strokeCircle(cx, cy, t.R);
            return;
          }
          guide.lineStyle(z.L(7), ok ? INK.right : INK.card, 0.95);
          for (let a = 0; a < 360; a += 12) {
            guide.beginPath();
            guide.arc(cx, cy, t.R, Phaser.Math.DegToRad(a), Phaser.Math.DegToRad(a + 6));
            guide.strokePath();
          }
        });
      };
      drawGuide();
      let pin;
      if (opts.pinTex) {
        // MAA-12 (M7): the pin rolls ABOVE the size ring (the ring is D.fx)
        pin = S.track(S.add.image(cx, cy + z.L(60), opts.pinTex).setDepth(D.fx + 0.5).setAlpha(0));
        pin.setScale(z.L(opts.pinW || 520) / S.texSize(opts.pinTex).w);
        S.tweens.add({ targets: pin, alpha: 1, duration: 200 });
      } else pin = S.hand("pin", { x: cx, y: cy + z.L(60), k: z.k });
      if (k.special) S.special(pin);
      let last = null;
      let quiet = null;
      let torn = false;
      let started = false;
      let over = false;
      let ghost = null;
      const offs = [];
      const stop = () => {
        over = true;
        z.expect(null);
        offs.forEach((f) => f());
        clearTimeout(quiet);
        if (ghost) ghost.stop();
        guide.destroy();
      };
      const done = () => {
        if (over) return;
        stop();
        const t = nearest();
        // (MAA-21: before the lesson any maani up to the stop is right)
        const score = torn ? k.tornScore : rimR ? 100 : S.bandScore(r / t.R, lo, hi);
        S.verdict(cx, cy - z.L(200), score, { bad: r < t.R * lo ? "too-small" : "too-thin" });
        Cook.sfx.right();
        if (opts.keep) {
          S.tweens.add({ targets: pin, alpha: 0, duration: 200, onComplete: () => pin.destroy() });
          return resolve({ score, target: t.id, sprite: dough, torn });
        }
        S.tweens.add({ targets: [dough, pin, chakla].filter(Boolean), alpha: 0, duration: 250, delay: 250, onComplete: () => [dough, pin, chakla].forEach((o) => o && o.destroy()) });
        setTimeout(() => resolve(score), 520 / Cook.speed);
      };
      if (opts.handle) {
        opts.handle.cancel = () => {
          if (over) return;
          stop();
          pin.destroy();
          if (chakla) chakla.destroy();
          resolve(null);
        };
      }
      const down = (p) => {
        last = { x: p.worldX, y: p.worldY };
        clearTimeout(quiet);
      };
      // MAA-21 (Zafar, 9 Nov, his tester on a phone: "She just rolled as quickly as possible until it couldn't roll anymore ... at the
      // beginning, there's a hard stop around the perimeter of, or maybe just inside the perimeter of the rolling board"; it changes
      // his 8 Nov stop at the size): opts.rimStop: the dough stops growing there, never tears; the juice sound (8 Nov: "the juice
      // sound is for rolling into the right size"), the maani gives a little squash, then the roll ends by itself (the next step's
      // light asks for the tap, and a tap's light has no finger)
      let stopped = false;
      const stopAtRim = () => {
        stopped = true;
        last = null;
        clearTimeout(quiet);
        if (Cook.Coach && Cook.Coach.ended) Cook.Coach.ended("roll");
        if (Cook.sfx.green) Cook.sfx.green();
        const s0 = dough.scale;
        S.tweens.add({ targets: dough, scale: s0 * 1.03, duration: 140, yoyo: true, ease: "Sine.easeOut", onComplete: () => dough.active && dough.setScale(s0) });
        S.time.delayedCall(700 / Cook.speed, done);
      };
      const move = (p) => {
        if (!p.isDown || !last || stopped) return;
        const dy = p.worldY - last.y;
        const dx = p.worldX - last.x;
        const d = Math.hypot(dx, dy);
        if (d < 4) return;
        last = { x: p.worldX, y: p.worldY };
        if (!started) {
          started = true;
          // SH-236: the roll has begun: its first-time light goes now, and its demo stops
          if (ghost) ghost.stop();
          if (Cook.Coach && Cook.Coach.began) Cook.Coach.began("roll");
          if (opts.onStart) opts.onStart();
        }
        pin.y = Cook.clamp(p.worldY, cy - z.L(150), cy + z.L(150));
        r = Math.min(rimR || Rmax * k.maxSize, r + d * k.grow);
        if (rimR && r >= rimR) {
          setR();
          z.gauge({ level: r / (rimR || aimT.R), lo, hi });
          return stopAtRim();
        }
        if (!rimR && r > Rmax * k.tearAt && !torn) {
          torn = true;
          S.burst(cx, cy, [0xf3e1b8, 0xffffff], 10, z.L(80));
          z.oops();
        }
        setR();
        drawGuide();
        z.gauge({ level: r / (rimR || aimT.R), lo, hi });
        if (Math.random() < 0.12) Cook.sfx.flip();
      };
      const up = () => {
        if (stopped) return;
        last = null;
        clearTimeout(quiet);
        if (started && Cook.Coach && Cook.Coach.ended) Cook.Coach.ended("roll");
        const onCircle = rimR ? r >= Rmin * lo : targets.some((t) => r >= t.R * lo && r <= t.R * hi) || r >= Rmax * lo;
        if (opts.patient ? onCircle : r >= Rmin * k.doneAt) quiet = setTimeout(done, quietMs / Cook.speed);
      };
      offs.push(z.on("pointerdown", down), z.on("pointermove", move), z.on("pointerup", up));
      // MAA-20 (Zafar, 8 Nov: "the rolling pin to go up and down and the finger dragging it up and down and just one finger"): the
      // pin rides under the kit's one finger (the coach's roll step, or the kit's demo): the pin's offset from the middle of the dough
      const pinHome = pin.y;
      const carry = (dx, dy, t, press) => {
        if (started || over || !pin.active) return;
        pin.y = press ? Cook.clamp(cy + dy, cy - z.L(150), cy + z.L(150)) : pinHome;
      };
      // SH-119: no ghost of the roll's own. The first time the coach's script shows the roll (Cook.Coach's light, one finger, the pin
      // moving); after that, stuck past the level's wait, the kit's demo shows it again (Cook.Coach.demo, the same finger)
      const C = Cook.Coach;
      if (C && C.demo && !(C.active && C.active())) {
        const R = global.Rules;
        const wait = z.guided ? 1500 : R && R.hintMs ? R.hintMs(Cook.roundLevel ? Cook.roundLevel(z.ctx) || 1 : 1) : 7000;
        ghost = C.demo(() => (started || over ? null : { from: { x: cx, y: cy - z.L(110) }, to: { x: cx, y: cy + z.L(110) } }), { gesture: "roll", delay: wait / Cook.speed, step: "roll", carry });
      }
      z.gauge({ level: r / (rimR || aimT.R), lo, hi });
      // (the light's thing: the board the dough is rolled on, whole, SH-230; the pin rides the coach's finger, carry)
      z.expect(Cook.Coach && Cook.Coach.lit ? Cook.Coach.lit({ kind: "roll", x: cx, y: cy, r: aimT.R }, { thing: opts.boardThing || chakla || dough, carry }) : { kind: "roll", x: cx, y: cy, r: aimT.R });
    });
  }
  Mech.rollOne = rollOne;

  Mech.lab("roll", {
    name: "Roll",
    verb: "How many?",
    async run(L) {
      // the maani recipe orders two kinds now (the Maani line); the lone roll station is "how many"
      const n = 1 + Math.floor(Math.random() * 4);
      L.card([Lang.line(Lang.orderFrame(0), Lang.phrase(Lang.countParts(n, "cook-maani", { one: false })))], ["Roll"]);
      await L.station("roll", { count: n });
    },
  });
})(window);

/*
 * Snap: a whole round without a screen, and the bots that play it
 * (docs/modes/snap-design.md 8.4 and D5; build brief phase 0). Pure: the
 * Node leak bot (build/leak_snap.mjs) runs it hundreds of times per level,
 * and the lab's in-browser bot (js/snap/bot.js) uses the same strategies to
 * drive the real viewfinder and hand-in.
 *
 * A strategy sees only what a child who knows no Kutchi sees:
 *   - the orchard (every fruit's kind, size and place: it's a picture);
 *   - the rows' shape on the card (how many; a leave-out row shows its "Nar",
 *     a frame word, beside its dots; no digits, ever);
 *   - its own prints; Ali's picture cards (G4).
 * It never sees the rows' words (they are dots from word stage 3), and at
 * the hand-in it never knows which row Nani is asking (she asks by voice).
 * Only the oracle is given the rows.
 *
 *   Sim.play({ snap, scene, game, level, seed, strategy, stage, memory }) -> result
 *   Sim.STRATEGIES: name -> strategy
 */
(function (root, factory) {
  const S = root.Snap || {};
  const node = typeof module === "object" && module.exports;
  const Sim = node
    ? factory(require("./photo.js"), require("./requests.js"), require("./stubs/stars.js"))
    : factory(S.Photo, S.Req, S.StarsStub);
  if (node) module.exports = Sim;
  else {
    root.Snap = S;
    S.Sim = Sim;
  }
})(typeof self !== "undefined" ? self : this, function (Photo, Req, Stars) {
  const Sim = {};

  /* ---------------- what a bot can do with its hands ---------------- */
  const shotOf = (f) => (f ? { cx: f.cx, cy: f.cy, zoom: f.zoom } : null);
  /** A shot of some count of a kind the bot can see, picked at random from the counts it can make. */
  function guessCount(v, kind, { alone = false } = {}) {
    const [c0, c1] = v.K.counts || [1, 3];
    const ok = [];
    for (let n = c0; n <= c1; n++) {
      const row = { kind: "count", noun: kind, n };
      const f = alone ? aloneFrame(v, row) : Req.frameFor(row, v.lay, v.K);
      if (f) ok.push(f);
    }
    return ok.length ? shotOf(v.rng.pick(ok)) : null;
  }
  /** The same, with no other kind in the frame at all ("everything alone"). */
  function aloneFrame(v, row) {
    const others = v.lay.kinds.filter((k) => k !== row.noun);
    for (const k of others) {
      const f = Req.frameFor(Object.assign({}, row, { not: k }), v.lay, v.K);
      if (f && f.print.sprites.every((s) => s.kind === row.noun || s.visible < 0.1)) return f;
    }
    return Req.frameFor(row, v.lay, v.K);
  }
  function pickShot(v, kind, size) {
    return shotOf(Req.frameFor({ kind: "pick", noun: kind, size }, v.lay, v.K));
  }
  /** Groups of fruit the eye sees as one bunch: same kind, close together. */
  function bunches(lay) {
    const left = lay.spots.slice();
    const out = [];
    while (left.length) {
      const g = [left.shift()];
      for (let i = 0; i < g.length; i++)
        for (let j = left.length - 1; j >= 0; j--)
          if (left[j].kind === g[i].kind && Math.hypot(left[j].x - g[i].x, left[j].y - g[i].y) < 260) g.push(left.splice(j, 1)[0]);
      out.push(g);
    }
    return out;
  }
  const centre = (g) => [g.reduce((a, s) => a + s.x, 0) / g.length, g.reduce((a, s) => a + s.y, 0) / g.length];
  const reach = (v, p) => (Req.reachable(p, v.lay, v.K) ? p : Req.tapCentre(p[0], p[1], v.lay.spots, v.K.vf.aimAssist));
  const randomPick = (v, tray) => v.rng.int(0, tray.length - 1);
  const fill = (v, shots) => shots.filter(Boolean).slice(0, v.film);

  /* ---------------- the strategies (design 8.4 plus D5's four) ---------------- */
  const S = {};
  S.oracle = {
    blind: false,
    shoot: (v) => fill(v, v.rows.map((r, i) => Object.assign(shotOf(Req.frameFor(r, v.lay, v.K, { lens: true })) || {}, { forRow: i }))),
    // the print shot for this row (another print may happen to fit it too)
    pick: (v, tray, asked) => {
      let i = tray.findIndex((p) => p.forRow === asked && Photo.matches(p.print, v.rows[asked], v.K.photo).ok);
      if (i < 0) i = tray.findIndex((p) => Photo.matches(p.print, v.rows[asked], v.K.photo).ok);
      return i >= 0 ? i : 0;
    },
  };
  S.random = {
    shoot: (v) =>
      fill(
        v,
        Array.from({ length: v.film }, () => {
          const s = v.rng.pick(v.lay.spots);
          const p = reach(v, [s.x + v.rng.int(-120, 120), s.y + v.rng.int(-80, 80)]);
          return { cx: p[0], cy: p[1], zoom: v.rng.pick(v.K.vf.zooms) };
        })
      ),
    pick: randomPick,
  };
  // the most eye-catching thing: the biggest bunches (G1) or the biggest fruit (G2), in turn
  S.salience = {
    shoot: (v) => {
      if (v.game === "g2") return fill(v, v.lay.spots.filter((s) => s.size === "big").sort((a, b) => a.x - b.x).map((s) => pickShot(v, s.kind, "big")));
      return fill(
        v,
        bunches(v.lay)
          .sort((a, b) => b.length - a.length)
          .map((g) => {
            const p = reach(v, centre(g));
            return { cx: p[0], cy: p[1], zoom: v.K.vf.zooms[Math.min(1, v.K.vf.zooms.length - 1)] };
          })
      );
    },
    pick: (v, tray, asked, turn) => 0,
  };
  // one print of each kind: a guessed count (G1), the big one (G2)
  S.onePerKind = {
    shoot: (v) => fill(v, v.rng.shuffle(v.lay.kinds).map((k) => (v.game === "g2" ? pickShot(v, k, v.rng() < 0.5 ? "big" : "small") : guessCount(v, k)))),
    pick: randomPick,
  };
  // a whole bunch in the frame, zoomed out: fails exactly-N and the main subject
  S.fillFrame = {
    shoot: (v) => fill(v, v.rng.shuffle(bunches(v.lay)).map((g) => { const p = reach(v, centre(g)); return { cx: p[0], cy: p[1], zoom: v.K.vf.zooms[0] }; })),
    pick: randomPick,
  };
  // the middle size (never asked)
  S.middleSize = {
    games: ["g2"],
    shoot: (v) => fill(v, v.rng.shuffle(v.lay.kinds).map((k) => pickShot(v, k, "mid"))),
    pick: randomPick,
  };
  // leave-out levels: a print of one kind with nothing else in it
  S.everythingAlone = {
    only: (K) => !!K.notChance,
    shoot: (v) => fill(v, v.rng.shuffle(v.lay.kinds).map((k) => (v.game === "g2" ? pickShot(v, k, v.rng() < 0.5 ? "big" : "small") : guessCount(v, k, { alone: true })))),
    pick: randomPick,
  };
  // one per kind, handed in in the order they were shot
  S.shotOrder = {
    shoot: S.onePerKind.shoot,
    pick: () => 0,
  };
  // one print per row, and at the hand-in the print shot for a row of the same shape
  S.rowShape = {
    shoot: (v) => {
      const kinds = v.rng.shuffle(v.lay.kinds);
      const shots = v.shapes.map((sh, i) => {
        const k = kinds[i % kinds.length];
        const s = v.game === "g2" ? pickShot(v, k, v.rng() < 0.5 ? "big" : "small") : guessCount(v, k, { alone: sh.nar });
        if (s) s.forShape = sh.nar;
        return s;
      });
      return fill(v, shots);
    },
    pick: (v, tray, asked) => {
      const want = v.shapes[asked].nar;
      const same = tray.map((p, i) => (p.forShape === want ? i : -1)).filter((i) => i >= 0);
      return same.length ? v.rng.pick(same) : randomPick(v, tray);
    },
  };
  // a new profile every round: every word is new, so its fruit twinkle as Nani says it,
  // and the bot shoots exactly those. Stage-1 rows are taught, not tested: no ear star offered
  S.freshProfile = { stage: 1, shoot: S.oracle.shoot, pick: S.oracle.pick, seesRows: true };
  // last round's right answers, shot again (the orchard is re-dealt from the seed)
  S.sceneMemory = {
    shoot: (v) => fill(v, (v.memory || []).map((f) => ({ cx: f.cx, cy: f.cy, zoom: f.zoom }))),
    pick: () => 0,
  };
  Object.keys(S).forEach((k) => (S[k].name = k));
  Sim.STRATEGIES = S;
  Sim.applies = (st, game, K) => (!st.games || st.games.includes(game)) && (!st.only || st.only(K));

  /* ---------------- one round ---------------- */
  Sim.play = function ({ snap, scene, game, level, seed, strategy, stage = 3, memory = null, listen = null }) {
    const round = Req.makeRound(snap, scene, game, level, seed);
    const { K, lay, rows } = round;
    const st = typeof strategy === "string" ? S[strategy] : strategy;
    const wordStage = st.stage || stage;
    const rng = Req.rng(seed * 7919 + 17);
    const v = { game, K, lay, film: round.film, shapes: rows.map((r) => ({ nar: !!r.not })), rng, memory, rows: st.blind === false || st.seesRows ? rows : null };
    const scn = { w: lay.w, h: lay.h };
    const said = [];
    let shots;
    const ali = game === "g4";
    if (ali) shots = aliShoot(v, rows, st, listen || (st.blind === false ? "oracle" : "null"), said);
    else shots = st.shoot(v);
    const tray = shots.slice(0, round.film).map((f, i) => ({ i, forShape: f.forShape, forRow: f.forRow, print: Photo.printRecord(lay.spots, Photo.frameAt(f.cx, f.cy, f.zoom, K.vf.base, scn)) }));
    // Show Nani: every row again, in a new order
    const order = rng.shuffle(rows.map((_, i) => i));
    const handed = rows.map(() => ({ firstRight: false }));
    const lens = [];
    order.forEach((ri, turn) => {
      const row = rows[ri];
      const h = handed[ri];
      h.stage = wordStage;
      // G4: a row Ali never shot right (film gone) doesn't count against the ear
      if (ali && !tray.some((p) => Photo.matches(p.print, row, K.photo).ok)) h.excluded = true;
      if (!tray.length) return;
      let k = st.pick(v, tray, ri, turn);
      k = Math.max(0, Math.min(tray.length - 1, k | 0));
      if (Photo.matches(tray[k].print, row, K.photo).ok) {
        h.firstRight = true;
        lens.push(Photo.lensScore(tray[k].print, K.photo));
        tray.splice(k, 1);
        return;
      }
      // a recast, then choose again: the bot tries the others at random; none fits: back for a frame (the row's ear is gone)
      const rest = rng.shuffle(tray.map((_, i) => i).filter((i) => i !== k));
      const j = rest.find((i) => Photo.matches(tray[i].print, row, K.photo).ok);
      if (j != null) {
        lens.push(Photo.lensScore(tray[j].print, K.photo));
        tray.splice(j, 1);
      }
    });
    const ear = Stars.ear(handed, { minTested: K.handin.minTested });
    const voice = Stars.voice(said, { minSaid: K.ali.minSaid });
    return {
      ear: ear.earned,
      earOffered: ear.offered,
      lens: Stars.lens(lens),
      voice: voice.earned,
      voiceOffered: voice.offered,
      rows,
      right: shots.length ? rows.map((r) => Req.frameFor(r, lay, K)).map(shotOf) : [],
    };
  };

  /* ---------------- G4: Ali shoots what he hears ---------------- */
  /**
   * The card is a picture of the wanted shot. The child says it; listen()
   * is "oracle" (hears the target), "null" (hears nothing: the pills come
   * up), or a function. After a null the bot taps a pill at random (pills are
   * speaker-only from word stage 3), which moves the round on and credits
   * nothing. It can see Ali's print against the card, so it retries with
   * another pill while there is spare film.
   */
  function aliShoot(v, rows, st, listen, said) {
    const K = v.K;
    const shots = [];
    let film = v.film;
    const nouns = v.lay.kinds;
    const nums = [];
    for (let n = K.counts[0]; n <= K.counts[1]; n++) nums.push(n);
    const hear = (choices, target) => (typeof listen === "function" ? listen(choices, target) : listen === "oracle" ? { choice: target, confidence: 0.9 } : null);
    rows.forEach((row, ri) => {
      const tried = new Set();
      let spoken = true;
      const rec = { target: row.noun, heard: null };
      const keep = () => rows.length - ri - 1; // film to keep for the rows still to come
      for (let attempt = 0; film > keep(); attempt++) {
        let noun;
        let n = row.n;
        const hn = spoken ? hear(nouns, row.noun) : null;
        if (hn && hn.choice) noun = hn.choice;
        else {
          spoken = false;
          const untried = nouns.filter((k) => !tried.has(k));
          noun = v.rng.pick(untried.length ? untried : nouns);
        }
        if ((K.listen || []).includes("number")) {
          const hnum = spoken ? hear(nums.map(String), String(row.n)) : null;
          n = hnum && hnum.choice ? Number(hnum.choice) : v.rng.pick(nums);
        }
        if (attempt === 0) rec.heard = spoken ? noun : null;
        tried.add(noun);
        const f = aliFrame(v, noun, n);
        if (!f) break;
        f.forRow = ri;
        shots.push(f);
        film--;
        const print = Photo.printRecord(v.lay.spots, Photo.frameAt(f.cx, f.cy, f.zoom, K.vf.base, { w: v.lay.w, h: v.lay.h }));
        if (Photo.matches(print, row, K.photo).ok) break;
      }
      if (spoken) said.push(rec);
    });
    return shots;
  }
  /** Ali frames the heard kind at the count: exactly, or the nearest count he can make (a funny wrong print). */
  function aliFrame(v, noun, n) {
    const tries = [n, n - 1, n + 1, n - 2, n + 2, 1];
    for (const m of tries) {
      if (m < 1) continue;
      const f = Req.frameFor({ kind: "count", noun, n: m }, v.lay, v.K, { lens: true });
      if (f) return shotOf(f);
    }
    return null;
  }
  Sim.aliFrame = (lay, K, noun, n) => aliFrame({ lay, K }, noun, n);

  return Sim;
});

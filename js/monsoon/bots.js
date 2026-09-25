/*
 * Monsoon rush: the leak bots (design section 8.5) and a headless storm
 * player. Same file in Node (build/leak_monsoon.mjs) and in the Rush lab,
 * so the browser bots and the Node bots are the same code.
 *
 * A bot is a non-speaker: it sees what's on screen (the candidates, where
 * they are, what colour they are, the shared countdown, a stage-1 twinkle,
 * the flash on the right pot after a miss, the tarp's state) and hears the
 * audio only as opaque clip ids with durations. It never sees the word ids.
 * decide(view) returns its answers for one wave as [{t, pick}] (or
 * {t, said, via} for a speaking round); the grader decides what counts.
 *
 * Every bot must earn the ear star in under 2% of storms (hard fail 10%).
 */
(function (root, factory) {
  const Bots = factory(typeof module === "object" && module.exports ? require("./calls.js") : root.Monsoon.Calls);
  if (typeof module === "object" && module.exports) module.exports = Bots;
  else root.Monsoon.Bots = Bots;
})(typeof self !== "undefined" ? self : this, function (Calls) {
  "use strict";
  const Bots = {};

  /* ------------------------------------------------ what a bot can see */
  /**
   * The public view of a wave: no word ids, only what's on screen and
   * what's heard. `reveals` are only true information at or after their
   * time (the drop starting to fall above a pot); the grader counts
   * anything done at or after a reveal as late, so a bot can't use them early.
   */
  Bots.view = function (storm, wave, T, extra) {
    const cands = storm.candidates.map((c) => ({ id: c.id, slot: c.slot, color: c.feat ? c.feat.color : null, kind: c.feat ? c.feat.kind : null }));
    const v = {
      kind: storm.kind,
      level: storm.level,
      mode: storm.mode,
      frame: wave.frame === "switch" ? "single+" : wave.frame, // a switch is heard, not seen: a longer call
      nTargets: wave.targets.length,
      candidates: cands,
      clips: T.parts.map((p) => ({ clip: `c${hash(p.clip)}`, dur: Math.round(p.dur * 100) / 100 })),
      t0: T.t0,
      keyEnd: T.keyEnd,
      beat: T.beat,
      reveals: wave.targets.map((tg) => ({ t: T.reveal[tg.id], cand: tg.cand })),
      twinkle: wave.targets.filter((tg) => tg.taught).map((tg) => tg.cand), // stage-1: the target twinkles as she says it
      state: wave.state, // K3: the tarp, on or off
      retry: false, // the bot can't tell a retry apart (same call, same place)
    };
    if (storm.kind === "count") {
      v.dropStart = T.dropStart;
      v.dropEvery = T.dropEvery;
      v.fall = storm.cfg.fall || 0.6;
      v.dropLand = (k) => T.dropLand(k);
      v.open = storm.cfg.named ? cands.map((c) => c.id) : [wave.targets[0].cand];
    }
    if (storm.kind === "say") {
      // the caller can see: the one swelling stain is the target (D.4)
      v.seen = wave.targets.map((tg) => tg.cand);
      v.choices = storm.candidates.map((c) => c.id);
    }
    return Object.assign(v, extra || {});
  };
  // clip ids are opaque to the bot: a stable hash of the clip key
  function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < String(s).length; i++) h = Math.imul(h ^ String(s).charCodeAt(i), 16777619);
    return (h >>> 0).toString(36);
  }

  /* ------------------------------------------------ strategies */
  const GESTURES = ["pull", "roll", "hold", "scoop"];
  const keyClip = (v) => v.clips.map((c) => c.clip).join("+");
  const keyDur = (v) => Math.round(v.clips.reduce((s, c) => s + c.dur, 0) * 20) / 20;

  /** A distinct random pick per target, at time t. */
  function randomPicks(v, R, t, from) {
    const pool = R.shuffle(from || v.candidates.map((c) => c.id));
    return pool.slice(0, v.nTargets).map((id, i) => ({ t: t + i * 0.25, pick: id }));
  }
  /** Count bots: lid pot `pot` when `k` drops have landed. */
  const lidAt = (v, pot, k, extra) => ({ t: (k <= 0 ? v.dropStart : v.dropLand(k)) + (extra || 0.25), pick: pot });

  function make(name, R) {
    const mem = { across: {}, within: {}, last: null };
    const b = {
      name,
      reset() {
        mem.within = {};
        mem.last = null;
      },
      observe(v, rec) {
        // after the wave: where each drop really fell (the reveal, and the flash after a miss)
        const tgs = rec.wave.targets;
        tgs.forEach((tg) => {
          const c = v.candidates.find((x) => x.id === tg.cand);
          mem.last = c ? c.slot : null;
        });
        const k = keyClip(v);
        mem.within[k] = tgs.map((tg) => tg.cand);
        const d = keyDur(v);
        mem.across[d] = mem.across[d] || {};
        tgs.forEach((tg) => {
          const c = v.candidates.find((x) => x.id === tg.cand);
          if (c) mem.across[d][c.slot] = (mem.across[d][c.slot] || 0) + 1;
        });
      },
      decide(v) {
        const t = v.keyEnd + 0.3;
        const ids = v.candidates.map((c) => c.id);
        if (v.kind === "which") {
          switch (name) {
            case "random":
              return randomPicks(v, R, t);
            case "wait":
              return v.reveals.map((r) => ({ t: (isFinite(r.t) ? r.t : v.keyEnd + 1e9) + 0.1, pick: r.cand }));
            case "spam":
              return v.candidates
                .slice()
                .sort((a, b) => a.slot - b.slot)
                .map((c, i) => ({ t: t + i * 0.05, pick: c.id }));
            case "camp":
              return randomPicks(v, R, v.t0 - 1.5).concat(randomPicks(v, R, v.t0 - 0.5));
            case "odd": {
              // the most visually distinct pot: farthest colour from the rest
              const col = (c) => (c.color ? parseInt(c.color.slice(1), 16) : 0);
              const rgb = (x) => [(x >> 16) & 255, (x >> 8) & 255, x & 255];
              const score = (c) => v.candidates.reduce((s, o) => s + rgb(col(c)).reduce((q, ch, i) => q + Math.abs(ch - rgb(col(o))[i]), 0) + (o.kind !== c.kind ? 120 : 0), 0);
              const order = v.candidates.slice().sort((a, b) => score(b) - score(a) || a.slot - b.slot);
              return order.slice(0, v.nTargets).map((c, i) => ({ t: t + i * 0.25, pick: c.id }));
            }
            case "near": {
              if (mem.last == null) return randomPicks(v, R, t);
              const order = v.candidates.slice().sort((a, b) => Math.abs(a.slot - mem.last) - Math.abs(b.slot - mem.last) || R() - 0.5);
              return order.slice(0, v.nTargets).map((c, i) => ({ t: t + i * 0.25, pick: c.id }));
            }
            case "duration": {
              // learns clip length -> screen position across storms (the leak the shuffle must kill)
              const m = mem.across[keyDur(v)];
              if (!m) return randomPicks(v, R, t);
              const best = Object.entries(m).sort((a, b) => b[1] - a[1]).map((e) => Number(e[0]));
              const picks = best.map((s) => v.candidates.find((c) => c.slot === s)).filter(Boolean);
              const rest = R.shuffle(v.candidates.filter((c) => !picks.includes(c)));
              return picks.concat(rest).slice(0, v.nTargets).map((c, i) => ({ t: t + i * 0.25, pick: c.id }));
            }
            case "menu":
              // knows chai and daal from menus, and that they're never called: guesses among the rest
              return randomPicks(v, R, t, ids.filter((id) => !(v.menu || []).includes(id)));
            case "learner": {
              // remembers clip -> pot within a storm (from reveals and flashes); retries don't count
              const seen = mem.within[keyClip(v)];
              if (seen) return seen.slice(0, v.nTargets).map((id, i) => ({ t: t + i * 0.25, pick: id }));
              return randomPicks(v, R, t);
            }
            case "twinkle":
              if (v.twinkle.length) return v.twinkle.map((id, i) => ({ t: t + i * 0.25, pick: id }));
              return randomPicks(v, R, t);
            default:
              return randomPicks(v, R, t);
          }
        }
        if (v.kind === "count") {
          const pots = v.open;
          const pickPot = () => (name === "menu" ? R.pick(pots.filter((p) => !(v.menu || []).includes(p))) : R.pick(pots));
          const out = [];
          for (let j = 0; j < v.nTargets; j++) {
            const pot = pots.length === 1 ? pots[0] : pickPot();
            if (name === "wait") continue;
            if (name === "spam") pots.forEach((p) => out.push(lidAt(v, p, 0, 0.1 + j * 0.05)));
            else if (name === "lidnow") out.push(lidAt(v, pot, 1, 0.1 + j * 0.05));
            else if (name === "fixed3") out.push(lidAt(v, pot, 3, 0.1 + j * 0.05));
            else if (name === "camp") out.push({ t: v.t0 - 1, pick: pot });
            else out.push(lidAt(v, pot, R.int(1, 5), 0.1 + j * 0.05));
          }
          return out;
        }
        if (v.kind === "weather") {
          if (name === "wait") return [];
          if (name === "spam") return GESTURES.map((g, i) => ({ t: t + i * 0.05, pick: g }));
          if (name === "camp") return [{ t: v.t0 - 1, pick: R.pick(GESTURES) }];
          if (name === "state") {
            // the tarp's state rules out one weather at level 1; from level 2 a redundant call is a no-go
            const possible = v.level <= 1 ? (v.state ? ["roll", "hold", "scoop"] : ["pull", "hold", "scoop"]) : GESTURES.concat(["none"]);
            const g = R.pick(possible);
            return g === "none" ? [] : [{ t, pick: g }];
          }
          const g = R.pick(v.level <= 1 ? GESTURES : GESTURES.concat(["none"]));
          return g === "none" ? [] : [{ t, pick: g }];
        }
        if (v.kind === "say") {
          // the caller sees the target but doesn't know its Kutchi name
          const tt = v.keyEnd + 0.8;
          if (name === "pills") return v.seen.map((id, i) => ({ t: tt + i * 0.3, said: id, via: "pill" }));
          if (name === "english") return v.seen.map((id, i) => ({ t: tt + i * 0.3, said: v.englishHeard ? v.englishHeard(id) : null, via: "voice" }));
          if (name === "wait") return [];
          const from = name === "menu" ? v.choices.filter((c) => !(v.menu || []).includes(c)) : v.choices;
          return v.seen.map((id, i) => ({ t: tt + i * 0.3, said: R.pick(from), via: "voice" }));
        }
        return [];
      },
    };
    return b;
  }

  Bots.names = {
    which: ["random", "wait", "spam", "camp", "odd", "near", "duration", "menu", "learner", "twinkle"],
    count: ["random", "wait", "spam", "camp", "lidnow", "fixed3", "menu"],
    weather: ["random", "wait", "spam", "camp", "state"],
    say: ["random", "menu", "pills", "english", "wait"],
  };
  Bots.make = (name, seed) => make(name, Calls.rng(seed || 1));

  /* ------------------------------------------------ headless storm player */
  /**
   * Play a storm with a bot on a virtual timeline (no browser). Drizzle's
   * reveal waits for the answers (or the lab cap). Returns the session.
   */
  Bots.play = function (storm, bot, opts) {
    opts = opts || {};
    const S = Calls.session(storm);
    let t = 3; // three seconds of quiet (design 1, step 2)
    let w;
    while ((w = S.next())) {
      const T = Calls.timing(w, t, storm);
      const v = Bots.view(storm, w, T, { menu: opts.menu || [], englishHeard: opts.englishHeard });
      let answers = bot.decide(v) || [];
      if (storm.mode === "drizzle" && storm.kind !== "count") {
        // the drop waits: reveal right after the last needed answer, or at the cap
        const firsts = answers.filter((a) => a.t >= T.t0).sort((a, b) => a.t - b.t).slice(0, w.targets.length);
        const cap = T.keyEnd + ((storm.rules.drizzle || {}).giveUpAfter || 45);
        const r = firsts.length >= w.targets.length ? Math.min(cap, firsts[firsts.length - 1].t + 0.05) : cap;
        w.targets.forEach((tg, j) => {
          T.reveal[tg.id] = r + (tg.after ? T.beat : 0);
          T.land[tg.id] = T.reveal[tg.id] + (storm.cfg.fall || 0.6);
        });
        // the wait bot dives when it finally sees the drop
        if (bot.name === "wait") answers = w.targets.map((tg) => ({ t: T.reveal[tg.id] + 0.1, pick: tg.cand }));
        T.end = Math.max(...Object.values(T.land)) + 2 * T.beat;
      }
      // a wave ends at T.end: a tap planned after it never happens (the next call has started)
      answers = answers.filter((a) => a.t < T.end);
      const g = Calls.grade(w, T, answers, storm);
      const rec = S.record(w, T, answers, g);
      bot.observe(v, rec);
      t = T.end;
    }
    return S;
  };

  return Bots;
});

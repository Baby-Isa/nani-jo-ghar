/*
 * Tidy up: the leak bot (docs/modes/tidy-up-design.md 8.4, build brief
 * task 1). A player who knows no Kutchi and sees only the screen:
 * Rules.view(round) = the tray's pictures (and what they are: anyone knows
 * an orange from a lemon, a fruit from a spice), the places on the board
 * (the bowl, a shelf, a cushion and who sits on it, the middle) without
 * their words, what's already on the board, and the rows as drawn (how
 * many; a digit while the number word is at stage 1-2). Never the rules.
 *
 * Strategies (each returns placements {iid: spotId | "tray"}):
 *   convention  the everyday layout (fruit in the bowl, a box filled from
 *               the top left, everyone's things in front of them)
 *   trayorder   row i gets the i-th kind on the tray, in the i-th place
 *               from the left
 *   elimination each kind to a different place, the obvious ones first,
 *               the rest into what's left
 *   liveprobe   level 1 only: try a place, and on a wiggle try the next
 *   prior       plays the place each thing most often belonged in, learned
 *               from 200 earlier rounds' answers
 *   copylast    replays the previous round's places for the same things
 *   waiter      does nothing (hesitation only replays the row aloud)
 *   random      every thing to a random place
 *   nameswrong  K2: "everything she names is wrong": moves every thing
 *               a row names (it's even told which) and leaves the rest
 *   reader      reads the English placeholders on the rows (reported
 *               apart: it measures the placeholder hole, not a code leak)
 * Pure logic: runs in Node (build/leak_tidy.mjs) and in the lab.
 */
(function (root, factory) {
  const Bot = factory();
  if (typeof module === "object" && module.exports) module.exports = Bot;
  else {
    root.Tidy = root.Tidy || {};
    root.Tidy.Bot = Bot;
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const Bot = {};
  const TRAY = "tray";
  Bot.STRATEGIES = ["convention", "trayorder", "elimination", "liveprobe", "prior", "copylast", "waiter", "random", "nameswrong", "reader"];

  const pick = (rng, a) => a[Math.floor(rng() * a.length)];
  const shuffle = (rng, arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  /** A little board model: what's where, and free room. */
  function board(view) {
    const pl = {};
    view.tray.forEach((t) => (pl[t.iid] = t.at || TRAY));
    const cap = {};
    view.spots.forEach((s) => (cap[s.id] = s.cap));
    const used = (s) => Object.values(pl).filter((p) => p === s).length;
    const free = (s) => cap[s] - used(s);
    const freeIn = (place, rng) => shuffle(rng, place.spots).find((s) => free(s) > 0) || null;
    return {
      pl,
      free,
      put(iid, place, rng) {
        const s = place && freeIn(place, rng);
        if (s) pl[iid] = s;
        return s;
      },
    };
  }
  const kindsOf = (view) => {
    const out = [];
    view.tray.forEach((t) => {
      const key = t.word + "|" + (t.colour || "");
      let k = out.find((x) => x.key === key);
      if (!k) out.push((k = { key, word: t.word, colour: t.colour, kind: t.kind, iids: [] }));
      k.iids.push(t.iid);
    });
    return out;
  };
  const onTray = (view, k) => k.iids.filter((i) => [TRAY, "shelf"].includes(view.tray.find((t) => t.iid === i).at));
  const howMany = (row, fallback) => (row && row.digit != null ? row.digit : fallback);
  const leftToRight = (view) => view.places.filter((p) => p.id !== "loose").slice().sort((a, b) => a.x - b.x || a.y - b.y);

  /** Put `n` of kind k (from the tray first) into a place. */
  function putKind(bd, view, k, n, place, rng) {
    const pool = onTray(view, k).concat(k.iids.filter((i) => !onTray(view, k).includes(i)));
    pool.slice(0, n).forEach((i) => bd.put(i, place, rng));
  }

  const S = {};
  S.random = (view, ctx) => {
    const bd = board(view);
    kindsOf(view).forEach((k) => putKind(bd, view, k, howMany(null, 1 + Math.floor(ctx.rng() * Math.min(3, k.iids.length))), pick(ctx.rng, view.places), ctx.rng));
    return bd.pl;
  };
  S.waiter = (view) => board(view).pl;
  S.convention = (view, ctx) => {
    const bd = board(view);
    const conv = view.convention || {};
    const ks = kindsOf(view);
    if (conv.byKind) {
      ks.forEach((k) => {
        const place = view.places.find((p) => p.id.endsWith("|" + conv.byKind[k.kind]));
        putKind(bd, view, k, k.iids.length, place, ctx.rng);
      });
    } else if (conv.fill) {
      // fill in order; with count rows on show, as many of each kind as the i-th row's digit
      const fill = conv.fill.filter((id) => view.spots.find((s) => s.id === id));
      let f = 0;
      ks.forEach((k, i) => {
        const n = view.rows[i] ? howMany(view.rows[i], k.iids.length > 1 ? 2 : 1) : view.rows.some((r) => r.digit != null) ? 0 : k.iids.length;
        onTray(view, k)
          .slice(0, n)
          .forEach((iid) => {
            while (f < fill.length && bd.free(fill[f]) <= 0) f++;
            if (f < fill.length) bd.pl[iid] = fill[f];
          });
      });
    }
    return bd.pl;
  };
  S.trayorder = (view, ctx) => {
    const bd = board(view);
    const ks = kindsOf(view);
    const places = leftToRight(view);
    view.rows.forEach((r, i) => ks[i] && putKind(bd, view, ks[i], howMany(r, 1), places[i % places.length], ctx.rng));
    return bd.pl;
  };
  S.elimination = (view, ctx) => {
    const bd = board(view);
    const places = shuffle(ctx.rng, view.places.filter((p) => p.id !== "loose"));
    // "obvious" first: things with a picture that belongs somewhere (a kind the everyday layout has a place for)
    const ks = shuffle(ctx.rng, kindsOf(view)).sort((a, b) => (b.kind ? 1 : 0) - (a.kind ? 1 : 0));
    ks.forEach((k, i) => {
      if (i >= places.length) return;
      putKind(bd, view, k, howMany(view.rows[i], 1), places[i], ctx.rng);
    });
    return bd.pl;
  };
  S.liveprobe = (view, ctx) => {
    const bd = board(view);
    kindsOf(view).forEach((k) => {
      onTray(view, k)
        .slice(0, 1)
        .forEach((iid) => {
          for (const place of shuffle(ctx.rng, view.places)) {
            const s = bd.put(iid, place, ctx.rng);
            if (!s) continue;
            if (!view.live || !ctx.probe || !ctx.probe(iid, s, bd.pl)) break; // no wiggle: keep it
          }
        });
    });
    return bd.pl;
  };
  S.prior = (view, ctx) => {
    const bd = board(view);
    const mem = (ctx.memory && ctx.memory.prior) || {};
    kindsOf(view).forEach((k) => {
      const seen = mem[k.word];
      if (!seen) return;
      const best = Object.keys(seen.places).sort((a, b) => seen.places[b] - seen.places[a])[0];
      const n = Object.keys(seen.n).sort((a, b) => seen.n[b] - seen.n[a])[0];
      const place = view.places.find((p) => p.id === best);
      if (place) putKind(bd, view, k, Number(n) || 1, place, ctx.rng);
    });
    return bd.pl;
  };
  /** What the prior bot learns from a round's answer (as if it watched the check). */
  Bot.learn = function (memory, view, solution) {
    memory.prior = memory.prior || {};
    const where = {};
    view.places.forEach((p) => p.spots.forEach((s) => (where[s] = where[s] || p.id)));
    const counts = {};
    view.tray.forEach((t) => {
      const s = solution[t.iid];
      if (!s || s === TRAY) return;
      const m = (memory.prior[t.word] = memory.prior[t.word] || { places: {}, n: {} });
      m.places[where[s]] = (m.places[where[s]] || 0) + 1;
      counts[t.word] = (counts[t.word] || 0) + 1;
    });
    Object.keys(counts).forEach((w) => (memory.prior[w].n[counts[w]] = (memory.prior[w].n[counts[w]] || 0) + 1));
    memory.last = { where, solution, tray: view.tray };
  };
  S.copylast = (view, ctx) => {
    const bd = board(view);
    const last = ctx.memory && ctx.memory.last;
    if (!last) return S.random(view, ctx);
    kindsOf(view).forEach((k) => {
      const before = last.tray.filter((t) => t.word === k.word && last.solution[t.iid] && last.solution[t.iid] !== TRAY);
      if (!before.length) return putKind(bd, view, k, 1, pick(ctx.rng, view.places), ctx.rng);
      const place = view.places.find((p) => p.id === last.where[last.solution[before[0].iid]]);
      putKind(bd, view, k, before.length, place || pick(ctx.rng, view.places), ctx.rng);
    });
    return bd.pl;
  };
  S.nameswrong = (view, ctx) => {
    const bd = board(view);
    const named = new Set(ctx.named || []);
    view.tray.forEach((t) => {
      if (!named.has(t.word) || t.at === TRAY) return;
      const here = view.places.find((p) => p.spots.includes(t.at));
      const others = view.places.filter((p) => p !== here);
      bd.pl[t.iid] = TRAY;
      bd.put(t.iid, pick(ctx.rng, others), ctx.rng);
    });
    // and anything named still on the tray goes somewhere
    view.tray.forEach((t) => named.has(t.word) && bd.pl[t.iid] === TRAY && t.at === TRAY && bd.put(t.iid, pick(ctx.rng, view.places), ctx.rng));
    return bd.pl;
  };
  S.reader = (view, ctx) => {
    const bd = board(view);
    const ks = kindsOf(view);
    const claimed = new Set();
    const known = view.rows.map((r) => r.read || {});
    // rows whose thing is readable: straight there
    known.forEach((r, i) => {
      const k = r.item && ks.find((x) => x.word === r.item && (!r.colour || x.colour === r.colour));
      if (!k) return;
      claimed.add(k.key);
      if (r.type === "leave") return; // "leave the cup": leave it
      if (r.nextTo) return; // placed after everything else
      putKind(bd, view, k, r.n || 1, r.place ? view.places.find((p) => p.id === r.place) : pick(ctx.rng, view.places), ctx.rng);
    });
    // "all the fruit in the basket"
    known.forEach((r) => {
      if (r.type !== "class" || !r.place) return;
      ks.filter((k) => k.kind === r.cls).forEach((k) => {
        claimed.add(k.key);
        putKind(bd, view, k, k.iids.length, view.places.find((p) => p.id === r.place), ctx.rng);
      });
    });
    // unreadable things: a guess among the unclaimed kinds, at the readable place
    known.forEach((r, i) => {
      if (r.item || r.type === "class" || r.type === "not" || r.type === "leave") return;
      const k = pick(ctx.rng, ks.filter((x) => !claimed.has(x.key)));
      if (!k) return;
      claimed.add(k.key);
      putKind(bd, view, k, r.n || 1, r.place ? view.places.find((p) => p.id === r.place) : pick(ctx.rng, view.places), ctx.rng);
    });
    // next to a readable placed thing
    known.forEach((r) => {
      if (!r.nextTo) return;
      const k = r.item ? ks.find((x) => x.word === r.item) : pick(ctx.rng, ks.filter((x) => !claimed.has(x.key)));
      const y = view.tray.find((t) => t.word === r.nextTo && view.spots.some((x) => x.id === bd.pl[t.iid]));
      if (!k || !y) return;
      const s = view.spots.find((x) => x.id === bd.pl[y.iid]).nbr.find((n) => bd.free(n) > 0);
      if (s) bd.pl[onTray(view, k)[0] || k.iids[0]] = s;
    });
    // "nothing in the middle": clear it
    known.forEach((r) => {
      if (r.type !== "not" || !r.place) return;
      const p = view.places.find((x) => x.id === r.place);
      if (p) Object.keys(bd.pl).forEach((i) => p.spots.includes(bd.pl[i]) && (bd.pl[i] = TRAY));
    });
    return bd.pl;
  };

  Bot.play = function (view, strategy, ctx) {
    const fn = S[strategy];
    if (!fn) throw new Error(`Tidy bot: no strategy ${strategy}`);
    return fn(view, ctx);
  };

  /** Ali's turn by pills alone (no voice): pick a pill per listen. */
  Bot.PILL_STRATEGIES = ["pill-random", "pill-first", "pill-same"];
  Bot.pills = function (listens, strategy, ctx) {
    return listens.map((l) => {
      const shown = shuffle(ctx.rng, l.choices); // the pills are shuffled on screen
      if (strategy === "pill-first") return shown[0];
      if (strategy === "pill-same") return shown[Math.min(shown.length - 1, ctx.slot || 1)];
      return pick(ctx.rng, shown);
    });
  };
  return Bot;
});

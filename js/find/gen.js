/*
 * Find it: the round generator, pure (docs/find-it-design.md D3, D5, 8.2
 * phase 0). No DOM and no Cook: it runs in find.html and in Node
 * (build/leak_find.mjs), so the leak bot plays exactly the rounds the page
 * builds.
 *
 * A round is rows ("wants") and the things on the stall:
 *   want  { noun, count?, size?, where?: [relation, anchor], not? }
 *   kind  { noun, size?, copies, target?, decoy?, clutter?, no? }
 *   unit  { noun, size?, spot }       one thing in one hide spot
 *
 * Randomness is always passed in (env.rng), so a round is reproducible.
 * env = { rng, groups, clutter, drawable(id), cognate(id), stage(id), word(id) }
 *
 * The rules (the Kutchi decides, never the picture):
 *   - every row's thing has more copies out than were asked for, and its
 *     look-alike group is out too (the live slice's rule, unchanged);
 *   - size (F2, "which one?"): once any row carries a size, every thing on
 *     the stall except the clutter is out in BOTH sizes, so a row's length
 *     or a thing's two sizes never says which row is sized; the asked
 *     noun is in both sizes, each size is on two or more nouns, and the
 *     sizes are balanced (WhichOne.checkDecoys, the shared decoy rule);
 *   - where (F3, calls): a called thing is in three or more places, and
 *     only the position separates the copies; anchors match by WORD (both
 *     crates are "the crate"), through Rel.holds, the shared relations layer;
 *   - the count's digit is shown only while the number word is taught
 *     (stage <= 1); from stage 2 the number word alone says how many.
 */
(function (root, factory) {
  const req = (p) => (typeof require === "function" ? require(p) : null);
  const Rel = (root && root.Rel) || req("../shared/rel.js");
  const WhichOne = (root && root.WhichOne) || req("../shared/whichone.js");
  const G = factory(Rel, WhichOne);
  if (typeof module === "object" && module.exports) module.exports = G;
  else {
    root.Find = root.Find || {};
    root.Find.Gen = G;
  }
})(typeof self !== "undefined" ? self : this, function (Rel, WhichOne) {
  "use strict";
  const G = {};
  G.Rel = Rel;
  G.WhichOne = WhichOne;

  /* ---------------- randomness ---------------- */
  G.rng = (seed) => WhichOne.rng(seed);
  G.rint = (rng, a, b) => (b == null ? (Array.isArray(a) ? G.rint(rng, a[0], a[1]) : a) : a + Math.floor(rng() * (b - a + 1)));
  G.shuffle = (arr, rng) => WhichOne.shuffle(arr, rng);
  G.pick = (arr, rng) => arr[Math.floor(rng() * arr.length)];

  /** A mechanic's settings at a level (level 1 in full; later levels list only what changes). */
  G.knobs = function (levels, level = 1) {
    const L = levels || [{}];
    const out = {};
    for (let i = 0; i < Math.min(level, L.length); i++) Object.assign(out, L[i]);
    return out;
  };

  /* ---------------- sizes ---------------- */
  G.SIZES = ["ph-big", "ph-small"];
  G.otherSize = (s) => (s === G.SIZES[0] ? G.SIZES[1] : G.SIZES[0]);
  /** The digit beside a row's count shows only while its number word is taught (stage <= 1), D5.2. */
  G.DIGIT_MAX_STAGE = 1;
  G.digitShown = (numStage) => numStage <= G.DIGIT_MAX_STAGE;

  /* ---------------- places: (relation, anchor word) ---------------- */
  const anchorWord = (scene, id) => {
    const a = (scene.anchors || {})[id];
    return a ? a.word || a.en || id : id;
  };
  G.anchorWord = anchorWord;
  const tagsOf = (sp) => [[sp.rel, sp.anchor]].concat(sp.also || []);
  G.tagsOf = tagsOf;
  const keyOf = (scene, rel, anchor) => `${Rel.id(rel)}|${anchorWord(scene, anchor)}`;
  G.keyOf = keyOf;
  G.spotKeys = (scene, sp) => new Set(tagsOf(sp).map(([r, a]) => keyOf(scene, r, a)));
  /**
   * Every place a row can name in this scene, with its hide spots:
   * { key: {rel, anchor, word, spots: [spot ids]} }, limited to `rels`.
   */
  G.places = function (scene, rels) {
    const out = {};
    for (const sp of scene.spots) {
      for (const [r, a] of tagsOf(sp)) {
        const rel = Rel.id(r);
        if (rels && !rels.map(Rel.id).includes(rel)) continue;
        const k = keyOf(scene, rel, a);
        (out[k] = out[k] || { key: k, rel, anchor: a, word: anchorWord(scene, a), spots: [] }).spots.push(sp.id);
      }
    }
    return out;
  };

  /* ---------------- matching ---------------- */
  /** Does a placed item answer a row? The noun, then any qualifier the row names (where: Rel.holds, by word). */
  G.matches = function (item, want, scene) {
    if (!item || !want || item.noun !== want.noun) return false;
    if (want.colour && item.colour !== want.colour) return false;
    if (want.size && item.size !== want.size) return false;
    if (want.where && !Rel.holds(item, want.where, scene || { anchors: {}, spots: [] })) return false;
    return true;
  };

  /* ---------------- choosing what to ask for ---------------- */
  function chooseTargets(n, k, env) {
    const rng = env.rng;
    const canAsk = (id) => env.drawable(id) && (k.cognateTargets || !env.cognate(id));
    // weakest words first, with some chance (spaced retrieval: due words plus new ones)
    const weight = {};
    const w = (id) => (weight[id] = weight[id] != null ? weight[id] : env.stage(id) + rng() * 1.6);
    const groups = G.shuffle(env.groups.filter((g) => g.filter(canAsk).length), rng);
    const chosen = groups.slice(0, Math.max(1, k.groups || 1));
    const pools = chosen.map((g) => g.filter(canAsk).sort((a, b) => w(a) - w(b)));
    const targets = [];
    while (targets.length < n && pools.some((p) => p.length)) pools.forEach((p) => p.length && targets.length < n && targets.push(p.shift()));
    // not enough in the chosen groups: borrow a group more
    for (const g of groups.slice(chosen.length)) {
      if (targets.length >= n) break;
      const id = g.filter(canAsk).sort((a, b) => w(a) - w(b))[0];
      if (id) {
        targets.push(id);
        chosen.push(g);
      }
    }
    return { targets, chosen };
  }

  /**
   * One round's rows and stall. k: the level's knobs (data/find.json
   * mechanics.<id>.levels). Returns {wants, kinds, units, problems}.
   *   rows, groups, count, spare, decoyKinds, decoyCopies, clutterKinds,
   *   maxItems, maxUnits, noRow, cognateTargets      as in the live slice
   *   sizeRows     how many rows carry a size ("all" for F2)
   *   otherSize    copies of a size row's thing in the other size
   *   whereRows    how many rows carry a position ("all" for F3)
   *   rels         which relations a position may use
   *   places       a positioned thing is in at least this many places
   *   calls        F3: rows are calls, one of each, nouns may repeat
   */
  G.makeRound = function (k, env, scene) {
    // a round that breaks a rule is dealt again (rarely: a crowded stall, two calls wanting one spot)
    let r;
    for (let i = 0; i < 40; i++) {
      r = makeOnce(k, env, scene);
      if (!r.problems.length) return Object.assign(r, { deals: i + 1 });
    }
    return Object.assign(r, { deals: 40 });
  };
  function makeOnce(k, env, scene) {
    const rng = env.rng;
    const problems = [];
    const nCalls = k.calls ? G.rint(rng, k.calls) : 0;
    const nNouns = k.calls ? Math.min(k.nouns || 2, nCalls) : k.rows;
    const { targets, chosen } = chooseTargets(nNouns, k, env);
    let wants;
    if (k.calls) {
      // F3: each noun called at least once, then repeats (the same noun, somewhere else)
      wants = targets.map((noun) => ({ noun, count: 1, call: true }));
      while (wants.length < nCalls) wants.push({ noun: G.pick(targets, rng), count: 1, call: true });
      wants = G.shuffle(wants, rng);
    } else {
      wants = targets.map((noun) => ({ noun, count: G.rint(rng, k.count) }));
      const total = () => wants.reduce((a, x) => a + x.count, 0);
      while (total() > (k.maxUnits || 7)) wants.sort((a, b) => b.count - a.count)[0].count--;
    }
    // qualifiers: size, then where
    const nSize = k.sizeRows === "all" ? wants.length : Math.min(k.sizeRows || 0, wants.length);
    // the asked sizes are mixed (never all "big"), so no one size is the safe bet
    const sizeDeal = G.shuffle(G.SIZES, rng);
    G.shuffle(wants, rng)
      .slice(0, nSize)
      .forEach((w, i) => (w.size = nSize === 1 ? G.pick(G.SIZES, rng) : sizeDeal[i % 2]));
    const sized = nSize > 0;
    const nWhere = k.whereRows === "all" || k.calls ? wants.length : Math.min(k.whereRows || 0, wants.length);
    const whereRows = G.shuffle(wants, rng).slice(0, nWhere);
    const places = G.places(scene, k.rels || ["in", "on"]);
    if (nWhere) assignWhere(whereRows, wants, places, k, rng, problems);

    // the stall: more of each than asked for, then look-alikes (the same groups first), then clutter
    const kinds = [];
    const byNoun = {};
    wants.forEach((w) => (byNoun[w.noun] = byNoun[w.noun] || []).push(w));
    for (const [noun, rows] of Object.entries(byNoun)) {
      const need = rows.reduce((a, r) => a + r.count, 0);
      if (rows.some((r) => r.where)) {
        // a positioned thing: its copies are decided by where they go (placeWhere)
        kinds.push({ noun, copies: 0, target: true, where: true });
        continue;
      }
      const spare = G.rint(rng, k.spare);
      if (!sized) {
        kinds.push({ noun, copies: need + spare, target: true });
        continue;
      }
      const r = rows[0];
      if (r.size) {
        kinds.push({ noun, size: r.size, copies: need + spare, target: true, sizedRow: true });
        kinds.push({ noun, size: G.otherSize(r.size), copies: Math.max(1, G.rint(rng, k.otherSize || [1, 2])), target: true, wrongSize: true });
      } else {
        // a row with no size in a sized round: either size answers it; both sizes are out
        const all = Math.max(2, need + spare);
        const big = G.rint(rng, 1, all - 1);
        kinds.push({ noun, size: G.SIZES[0], copies: big, target: true });
        kinds.push({ noun, size: G.SIZES[1], copies: all - big, target: true });
      }
    }
    const taken = new Set(targets);
    const near = G.shuffle([].concat(...chosen.map((g) => g.filter((id) => env.drawable(id) && !taken.has(id)))), rng);
    const far = G.shuffle([].concat(...env.groups.filter((g) => !chosen.includes(g)).map((g) => g.filter(env.drawable))), rng);
    near.concat(far)
      .slice(0, k.decoyKinds || 0)
      .forEach((id) => {
        taken.add(id);
        const copies = G.rint(rng, k.decoyCopies);
        if (!sized) return kinds.push({ noun: id, copies, decoy: true });
        const all = Math.max(2, copies);
        const big = G.rint(rng, 1, all - 1);
        kinds.push({ noun: id, size: G.SIZES[0], copies: big, decoy: true });
        kinds.push({ noun: id, size: G.SIZES[1], copies: all - big, decoy: true });
      });
    G.shuffle(env.clutter.filter((id) => env.drawable(id) && !taken.has(id)), rng)
      .slice(0, k.clutterKinds || 0)
      .forEach((id) => kinds.push({ noun: id, copies: G.rint(rng, 1, 2), clutter: true }));
    // a "no X" row: X is a look-alike that is out on the stall
    // (never a word a non-speaker could read as English: "no kivi" would give it away)
    const decoys = kinds.filter((x) => x.decoy && (k.cognateTargets || !env.cognate(x.noun)));
    if (k.noRow && rng() < k.noRow && decoys.length) {
      const d = decoys.find((x) => targets.some((t) => sameGroup(env, t, x.noun))) || decoys[0];
      kinds.filter((x) => x.noun === d.noun).forEach((x) => (x.no = true));
      wants.push({ noun: d.noun, not: true });
    }
    // the clutter cap (and the scene's spots)
    trim(kinds, wants, Math.min(k.maxItems || 99, scene.spots.length) - whereUnits(wants, k), sized);
    if (sized) balanceSizes(kinds, wants, Math.min(k.maxItems || 99, scene.spots.length) - whereUnits(wants, k));
    const units = place(kinds, wants, scene, places, k, rng, problems);
    // the shared decoy rule, per size row
    if (sized) {
      const items = units.filter((u) => u.size);
      wants
        .filter((w) => w.size && !w.not)
        .forEach((w) => {
          const hits = items.filter((it) => it.noun === w.noun && it.size === w.size).length;
          // with a position in the round too (level 4), the positioned copies can't also be balanced by size
          const r = WhichOne.checkDecoys(items, { noun: w.noun, size: w.size }, { count: hits, minValues: { size: 2 }, balanced: !nWhere });
          if (!r.ok) problems.push(...r.problems.map((p) => `size row ${w.noun}: ${p}`));
        });
    }
    return { wants, kinds, units, problems };
  }

  const sameGroup = (env, a, b) => env.groups.some((g) => g.includes(a) && g.includes(b));

  /* ---- where: every positioned row gets a place its noun can also be away from ---- */
  function assignWhere(rows, wants, places, k, rng, problems) {
    const keys = Object.keys(places);
    const byNoun = {};
    rows.forEach((w) => (byNoun[w.noun] = byNoun[w.noun] || []).push(w));
    for (const [noun, rs] of Object.entries(byNoun)) {
      const used = new Set();
      for (const w of rs) {
        // a place of its own: spots that no other place called for this thing shares, and the reverse
        const own = (a, others) => places[a].spots.filter((sp) => others.every((o) => !places[o].spots.includes(sp))).length;
        const free = G.shuffle(keys.filter((key) => !used.has(key) && own(key, [...used]) >= w.count && [...used].every((u) => own(u, [key]) >= 1)), rng);
        const key = free[0];
        if (!key) {
          problems.push(`no place left for ${noun}`);
          delete w.where;
          continue;
        }
        used.add(key);
        w.where = [places[key].rel, places[key].anchor];
        w.placeKey = key;
      }
      void noun;
    }
  }
  // units a positioned noun will need (its called copies and its copies elsewhere)
  function whereUnits(wants, k) {
    const nouns = {};
    wants.filter((w) => w.where).forEach((w) => (nouns[w.noun] = (nouns[w.noun] || 0) + w.count + (k.calls ? 0 : 1) + (w.size ? 1 : 0)));
    return Object.values(nouns).reduce((a, n) => a + n + Math.max(1, (k.places || 3) - 1), 0);
  }

  function trim(kinds, wants, cap, sized) {
    const count = () => kinds.reduce((a, x) => a + x.copies, 0);
    const min = 1;
    const cut = (pred) => {
      const c = kinds.filter((x) => pred(x) && x.copies > min).sort((a, b) => b.copies - a.copies)[0];
      if (!c) return false;
      c.copies--;
      return true;
    };
    let guard = 500;
    while (count() > cap && guard-- > 0) {
      if (cut((x) => x.clutter)) continue;
      if (cut((x) => x.decoy)) continue;
      const cl = kinds.findIndex((x) => x.clutter);
      if (cl >= 0) {
        kinds.splice(cl, 1);
        continue;
      }
      // drop a whole look-alike (both its sizes), never the "no X" one, never the last one
      const dnouns = [...new Set(kinds.filter((x) => x.decoy && !x.no).map((x) => x.noun))];
      if (dnouns.length && new Set(kinds.filter((x) => x.decoy).map((x) => x.noun)).size > (sized ? 2 : 1)) {
        const n = dnouns[dnouns.length - 1];
        for (let i = kinds.length - 1; i >= 0; i--) if (kinds[i].noun === n && kinds[i].decoy) kinds.splice(i, 1);
        continue;
      }
      // a wrong-size copy, then a spare: never down to "exactly what was asked"
      if (cut((x) => x.wrongSize)) continue;
      const t = kinds.filter((x) => x.target && !x.where && !x.wrongSize && x.copies > needOf(wants, x) + 1)[0];
      if (t) {
        t.copies--;
        continue;
      }
      break;
    }
  }
  const needOf = (wants, kind) =>
    wants.filter((w) => !w.not && w.noun === kind.noun && (!w.size || w.size === kind.size)).reduce((a, w) => a + w.count, 0) || 0;

  /** Sizes balanced within one (the decoy rule's "balanced"), by moving copies between a thing's two sizes. */
  function balanceSizes(kinds, wants, cap) {
    const total = () => kinds.reduce((a, x) => a + x.copies, 0);
    const tally = () => {
      const t = {};
      G.SIZES.forEach((s) => (t[s] = 0));
      kinds.filter((x) => x.size).forEach((x) => (t[x.size] += x.copies));
      return t;
    };
    let guard = 50;
    while (guard-- > 0) {
      const t = tally();
      const [a, b] = G.SIZES;
      const d = t[a] - t[b];
      if (Math.abs(d) <= 1) return;
      const big = d > 0 ? a : b;
      const small = G.otherSize(big);
      // a decoy (or a no-size row's thing) moves one copy from the larger size to the smaller
      const from = kinds.find((x) => x.size === big && x.copies > 1 && (x.decoy || (x.target && !x.wrongSize && !x.sizedRow)));
      const to = from && kinds.find((x) => x.noun === from.noun && x.size === small);
      if (from && to) {
        from.copies--;
        to.copies++;
        continue;
      }
      // else one fewer of the larger size (a decoy, a wrong size, a spare), or, with room, one more of the smaller
      const cut = kinds.find((x) => x.size === big && x.copies > 1 && (x.decoy || x.wrongSize)) || kinds.find((x) => x.size === big && x.sizedRow && x.copies > needOf(wants, x) + 1);
      if (cut && total() >= cap) {
        cut.copies--;
        continue;
      }
      const add = kinds.find((x) => x.size === small && x.decoy) || kinds.find((x) => x.size === small);
      if (add && total() >= cap) {
        // make room: one clutter thing goes
        const cl = kinds.findIndex((x) => x.clutter);
        if (cl >= 0) {
          if (--kinds[cl].copies <= 0) kinds.splice(cl, 1);
          continue;
        }
      }
      if (!add || total() >= cap) {
        if (!cut) return;
        cut.copies--;
        continue;
      }
      add.copies++;
    }
  }

  /* ---- placing: positioned things first (their places are the lesson), then the rest at random ---- */
  function place(kinds, wants, scene, places, k, rng, problems) {
    const spotById = {};
    scene.spots.forEach((sp) => (spotById[sp.id] = sp));
    const free = new Set(G.shuffle(scene.spots.map((s) => s.id), rng));
    const units = [];
    const take = (id, u) => {
      free.delete(id);
      units.push(Object.assign({ spot: id }, u));
    };
    const byNoun = {};
    wants.filter((w) => w.where).forEach((w) => (byNoun[w.noun] = byNoun[w.noun] || []).push(w));
    for (const [noun, rows] of Object.entries(byNoun)) {
      const called = new Set(rows.map((r) => r.placeKey));
      const sizes = kinds.some((x) => x.size) ? G.SIZES : [null];
      const kind = kinds.find((x) => x.noun === noun && x.where);
      // the called copies: in a spot of that place, and of no other called place of this noun
      for (const r of rows) {
        const cands = G.shuffle(places[r.placeKey].spots.filter((id) => free.has(id) && [...G.spotKeys(scene, spotById[id])].every((kk) => kk === r.placeKey || !called.has(kk))), rng);
        const n = r.count + (k.calls ? 0 : G.rint(rng, k.spare || 0));
        if (cands.length < r.count) problems.push(`${noun}: only ${cands.length} spots for ${r.placeKey}`);
        cands.slice(0, n).forEach((id) => take(id, { noun, size: r.size || (sizes[0] ? G.pick(sizes, rng) : null), called: r.placeKey }));
        // size and where (level 4): the other size is in the same place, so both words decide
        if (r.size) {
          const spot = cands[n] || G.shuffle([...free].filter((id) => [...G.spotKeys(scene, spotById[id])].every((kk) => !called.has(kk))), rng)[0];
          if (spot) take(spot, { noun, size: G.otherSize(r.size), called: cands[n] ? r.placeKey : null });
        }
      }
      // elsewhere: copies in other places, so the noun is in >= k.places places and the position decides
      const need = Math.max(1, (k.places || 3) - called.size);
      const other = G.shuffle(Object.keys(places).filter((kk) => !called.has(kk)), rng);
      const usedKeys = new Set();
      let placed = 0;
      for (const kk of other) {
        if (placed >= need) break;
        const id = G.shuffle(places[kk].spots.filter((s) => free.has(s) && [...G.spotKeys(scene, spotById[s])].every((x) => !called.has(x))), rng)[0];
        if (!id) continue;
        // a new place (by key) for the count of places
        const keysHere = G.spotKeys(scene, spotById[id]);
        if ([...keysHere].some((x) => usedKeys.has(x))) continue;
        keysHere.forEach((x) => usedKeys.add(x));
        // the same size as a called copy, so size never separates the copies (only the position does)
        const r = G.pick(rows, rng);
        take(id, { noun, size: r.size || (sizes[0] ? G.pick(sizes, rng) : null) });
        placed++;
      }
      if (placed < need) problems.push(`${noun}: in ${called.size + placed} places, needs ${called.size + need}`);
      if (kind) kind.copies = units.filter((u) => u.noun === noun).length;
    }
    const rest = G.shuffle([].concat(...kinds.filter((x) => !x.where).map((x) => Array.from({ length: x.copies }, () => x))), rng);
    const spots = [...free];
    rest.forEach((x, i) => {
      if (i < spots.length) take(spots[i], { noun: x.noun, size: x.size || null });
    });
    if (rest.length > spots.length) {
      problems.push(`${rest.length - spots.length} things had no spot`);
      // the stall shows what fitted: recount
      kinds.forEach((x) => {
        if (!x.where) x.copies = units.filter((u) => u.noun === x.noun && (u.size || null) === (x.size || null)).length;
      });
    }
    return units;
  }

  /* ---------------- placed things ---------------- */
  /** Units to items: a hide spot's position (a little jitter), then their relations. */
  G.items = function (units, scene, rng) {
    const spotById = {};
    scene.spots.forEach((sp) => (spotById[sp.id] = sp));
    const items = units.map((u, i) => {
      const sp = spotById[u.spot];
      return { id: `it${i}`, noun: u.noun, colour: null, size: u.size || null, spot: u.spot, x: sp.x + G.rint(rng, -6, 6), baseline: sp.baseline, called: u.called || null };
    });
    return G.relate(scene, items);
  };

  /* ---------------- relations of placed things ---------------- */
  /** What each unit is in / on / in front of, from its spot, plus "next to" its neighbours on the same anchor. */
  G.relate = function (scene, items) {
    const spotById = {};
    scene.spots.forEach((sp) => (spotById[sp.id] = sp));
    items.forEach((it) => {
      const sp = spotById[it.spot];
      it.anchor = sp.anchor;
      it.rel = tagsOf(sp).map((t) => t.slice());
    });
    const byAnchor = {};
    items.forEach((it) => (byAnchor[it.anchor] = byAnchor[it.anchor] || []).push(it));
    Object.values(byAnchor).forEach((list) => {
      list.sort((a, b) => a.x - b.x);
      list.forEach((it, j) => {
        if (list[j - 1] && it.x - list[j - 1].x < 140) it.rel.push(["next-to", list[j - 1].id]);
        if (list[j + 1] && list[j + 1].x - it.x < 140) it.rel.push(["next-to", list[j + 1].id]);
      });
    });
    return items;
  };

  /* ---------------- Check the bag (M5): what gets packed, and the one mistake ---------------- */
  /**
   * The list packed with one mistake: "swap" (a look-alike instead of one
   * thing) or "extra" (one too many). Returns {packed, error, wrongNoun, swapFor}.
   */
  G.pack = function (listed, stallNouns, errors, env) {
    const rng = env.rng;
    let packed = [];
    listed.forEach((w) => {
      for (let i = 0; i < w.count; i++) packed.push(w.noun);
    });
    const onList = new Set(listed.map((w) => w.noun));
    let error = G.pick(errors || ["swap"], rng);
    let wrongNoun = null;
    let swapFor = null;
    if (error === "swap") {
      const i = Math.floor(rng() * packed.length);
      const orig = packed[i];
      const g = env.groups.find((x) => x.includes(orig)) || [];
      const alt = G.shuffle(g.filter((id) => !onList.has(id) && env.drawable(id)), rng)[0] || G.shuffle(stallNouns.filter((id) => !onList.has(id)), rng)[0];
      if (alt) {
        packed[i] = alt;
        wrongNoun = alt;
        swapFor = orig;
      } else error = "extra";
    }
    if (error === "extra") {
      wrongNoun = G.pick(listed, rng).noun;
      packed.push(wrongNoun);
    }
    return { packed: G.shuffle(packed, rng), error, wrongNoun, swapFor };
  };

  /* ---------------- the bowl (speaking moment 1) and Ali's turn: the closed sets ---------------- */
  /** The basket's kinds, padded with stall decoys to at least `min`, at most `max` (D4). */
  G.closedSet = function (have, stall, env, { min = 3, max = 8 } = {}) {
    const out = [...new Set(have)].slice(0, max);
    G.shuffle([...new Set(stall)].filter((id) => !out.includes(id)), env.rng).forEach((id) => out.length < min && out.push(id));
    return G.shuffle(out, env.rng);
  };

  return G;
});

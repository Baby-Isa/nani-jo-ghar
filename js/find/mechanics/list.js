/*
 * Find it, M1: Nani's list (the bazaar hunt), with M5 Check the bag as its
 * twist (docs/find-it-design.md s2.2, s3).
 *
 * Nani's list is spoken in Kutchi and shown as the order ladder (words
 * fade to dots per word stage). The stall is busy with look-alikes: every
 * thing on the list has more copies out than were asked for, and its
 * look-alike group is out too, so only the Kutchi says which and how many.
 * Tap to find (it arcs into your basket and its row's tally goes up); a
 * wrong tap wiggles and Nani recasts; press Done to hand the basket over.
 *
 * Check the bag: the shopkeeper packs the list into your bag and gets one
 * thing wrong (a look-alike instead of one thing, or one too many). Tap the
 * wrong one; he says sorry and swaps it. The rows are still dots from
 * stage 3, so you have to remember what was asked.
 *
 * Settings: data/find.json mechanics.list.levels (see its _about).
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const Find = global.Find;
  const V = Find.View;

  /* ---------------- what Nani asks for, and what's on the stall ---------------- */
  function makeWants(k, scene) {
    const painted = scene.painted || [];
    const drawable = (id) => !!Find.picture(id) && !painted.includes(id);
    const canAsk = (id) => drawable(id) && (k.cognateTargets || !Find.isCognate(id));
    // weakest words first, with some chance (spaced retrieval: due words plus new ones)
    const weight = {};
    const w = (id) => (weight[id] = weight[id] != null ? weight[id] : Cook.wordStage(id) + Math.random() * 1.6);
    const groups = Cook.shuffle(Find.groups().filter((g) => g.filter(canAsk).length));
    const chosen = groups.slice(0, Math.max(1, k.groups || 1));
    const pools = chosen.map((g) => g.filter(canAsk).sort((a, b) => w(a) - w(b)));
    const targets = [];
    while (targets.length < k.rows && pools.some((p) => p.length)) pools.forEach((p) => p.length && targets.length < k.rows && targets.push(p.shift()));
    // not enough in the chosen groups: borrow a group more
    for (const g of groups.slice(chosen.length)) {
      if (targets.length >= k.rows) break;
      const id = g.filter(canAsk).sort((a, b) => w(a) - w(b))[0];
      if (id) {
        targets.push(id);
        chosen.push(g);
      }
    }
    // how many of each: within the basket's room
    const wants = targets.map((noun) => ({ noun, count: Find.rint(k.count) }));
    let total = () => wants.reduce((a, x) => a + x.count, 0);
    while (total() > (k.maxUnits || 7)) wants.sort((a, b) => b.count - a.count)[0].count--;
    // the stall: more of each than asked for, then look-alikes (the same groups first), then clutter
    const kinds = wants.map((x) => ({ noun: x.noun, copies: x.count + Find.rint(k.spare), target: true }));
    const taken = new Set(targets);
    const near = Cook.shuffle([].concat(...chosen.map((g) => g.filter((id) => drawable(id) && !taken.has(id)))));
    const far = Cook.shuffle([].concat(...Find.groups().filter((g) => !chosen.includes(g)).map((g) => g.filter(drawable))));
    near.concat(far)
      .slice(0, k.decoyKinds || 0)
      .forEach((id) => {
        taken.add(id);
        kinds.push({ noun: id, copies: Find.rint(k.decoyCopies), decoy: true });
      });
    Cook.shuffle((Find.data.lookalike_groups.clutter || []).filter((id) => drawable(id) && !taken.has(id)))
      .slice(0, k.clutterKinds || 0)
      .forEach((id) => kinds.push({ noun: id, copies: Find.rint(1, 2), clutter: true }));
    // a "no X" row: X is a look-alike that is out on the stall
    const decoys = kinds.filter((x) => x.decoy);
    if (k.noRow && Math.random() < k.noRow && decoys.length) {
      const d = decoys.find((x) => targets.some((t) => Find.sameGroup(t, x.noun))) || decoys[0];
      d.no = true;
      wants.push({ noun: d.noun, not: true });
    }
    // the clutter cap (and the scene's spots)
    const cap = Math.min(k.maxItems || 99, scene.spots.length);
    const count = () => kinds.reduce((a, x) => a + x.copies, 0);
    const trim = (pred, min) => {
      const c = kinds.filter((x) => pred(x) && x.copies > min).sort((a, b) => b.copies - a.copies)[0];
      if (!c) return false;
      c.copies--;
      return true;
    };
    while (count() > cap) {
      if (trim((x) => x.clutter, 1)) continue;
      if (trim((x) => x.decoy, 1)) continue;
      const cl = kinds.findIndex((x) => x.clutter);
      if (cl >= 0) {
        kinds.splice(cl, 1);
        continue;
      }
      const dk = kinds.findIndex((x) => x.decoy && !x.no);
      if (dk >= 0 && kinds.filter((x) => x.decoy).length > 1) {
        kinds.splice(dk, 1);
        continue;
      }
      // never down to "exactly what was asked": one spare stays
      const t = kinds.filter((x) => x.target && x.copies > wants.find((y) => y.noun === x.noun).count + 1)[0];
      if (t) {
        t.copies--;
        continue;
      }
      break;
    }
    return { wants, kinds };
  }
  Find.makeWants = makeWants;

  /* ---------------- greeting the shopkeeper ---------------- */
  async function greeting(round) {
    const ex = (Cook.data.exchanges || []).find((e) => e.id === "salaam");
    if (!ex) return;
    await Find.say("shopkeeper", Lang.line(ex.ask));
    const opts = [ex.answer].concat(ex.wrong).map((key) => ({ key, line: Lang.line(key) }));
    const r = await UI.choose(opts, ex.answer, { glowAfter: 7000 / Cook.speed });
    if (!round.alive()) throw new Cook.Abort("left");
    V.mood("happy");
    await Cook.wait(500);
    V.mood("neutral");
    return r.misses;
  }

  /* ---------------- M5: check the bag ---------------- */
  async function checkBag(round, { fromBasket = true } = {}) {
    const scene = round.scene;
    const P = V.person || { x: 1005, top: 200 };
    const at = { x: P.x, baseline: 560, w: 60, h: 60 };
    round.phase = "packing";
    UI.mission.step(round.rows.length ? 2 : 0);
    // the stall steps back: only the bag is tappable now
    round.items.forEach((it) => {
      it.off = true;
      if (it.el) it.el.classList.add("off");
    });
    if (fromBasket && round.basket.length) {
      await Promise.all(round.basket.map((it, i) => Cook.wait(i * 60).then(() => V.fly(it, at, { into: "gone", ms: 420 }))));
    }
    V.clearBasket();
    round.basket = [];
    V.mood("happy");
    await Cook.wait(450);
    // he packs the list, and gets one thing wrong
    const listed = round.rows.filter((r) => !r.want.not);
    let packed = [];
    listed.forEach((r) => {
      for (let i = 0; i < r.want.count; i++) packed.push(r.want.noun);
    });
    const onList = new Set(listed.map((r) => r.want.noun));
    const errors = (round.knobs.bag && round.knobs.bag.errors) || ["swap"];
    let error = Cook.pick(errors);
    let wrongNoun = null;
    let swapFor = null;
    if (error === "swap") {
      const i = Math.floor(Math.random() * packed.length);
      const orig = packed[i];
      const g = Find.groupOf(orig) || [];
      const alt = Cook.shuffle(g.filter((id) => !onList.has(id) && Find.picture(id)))[0] || Cook.shuffle(round.items.map((x) => x.noun).filter((id) => !onList.has(id)))[0];
      if (alt) {
        packed[i] = alt;
        wrongNoun = alt;
        swapFor = orig;
      } else error = "extra";
    }
    if (error === "extra") {
      wrongNoun = Cook.pick(listed).want.noun;
      packed.push(wrongNoun);
    }
    packed = Cook.shuffle(packed);
    const bag = [];
    for (let i = 0; i < packed.length; i++) {
      const spot = V.basketSpot(i);
      const sz = await V.measure(packed[i], Math.min(spot.w, spot.h));
      const it = { id: `bag${i}`, noun: packed[i], x: at.x, baseline: at.baseline, w: sz.w, h: sz.h, tilt: Find.rint(-8, 8), bag: true, rel: [["in", "bag"]] };
      V.addItem(it, { bag: true });
      bag.push(it);
      // wrong: the swapped thing; for one too many, any of that kind (taking one back fixes it)
      it.wrong = error === "extra" ? it.noun === wrongNoun : it.noun === wrongNoun;
      V.fly(it, spot, { ms: 380 });
      await Cook.wait(90);
    }
    await Cook.wait(420);
    round.bag = { items: bag, error, wrongNoun, swapFor };
    await Find.say("shopkeeper", Lang.line("here"));
    UI.gist(Find.data.mechanics.bag.goal, { full: true });
    round.phase = "bag";
    let misses = 0;
    await new Promise((resolve) => {
      round.onBagTap = (x, y) => {
        const it = V.hit(x, y, bag);
        if (!it) return V.ripple(x, y);
        if (it.wrong) {
          round.onBagTap = () => {};
          Cook.sfx.right();
          it.gone = true;
          V.glow([it], false);
          round.phase = "packing";
          const back = V.fly(it, at, { into: "gone", ms: 420 });
          (async () => {
            await back;
            V.mood("happy");
            await Find.say("shopkeeper", Lang.line("oops"), { ms: 900 });
            if (error === "swap" && swapFor) {
              const spot = { x: it.x, baseline: it.baseline, w: it.w, h: it.h };
              const sz = await V.measure(swapFor, Math.min(scene.basket.item.maxW, scene.basket.item.maxH));
              const fix = { id: "bagfix", noun: swapFor, x: at.x, baseline: at.baseline, w: sz.w, h: sz.h, bag: true };
              V.addItem(fix, { bag: true });
              await V.fly(fix, { x: spot.x, baseline: spot.baseline, w: sz.w, h: sz.h }, { ms: 380 });
            }
            resolve();
          })();
          return;
        }
        // a thing that WAS on the list: wiggle, recast (what you tapped, then the list), try again
        misses++;
        V.wiggle(it);
        Cook.sfx.soft();
        const row = listed.find((r) => r.want.noun === it.noun) || null;
        round.earMiss(row, `bag: ${it.noun} was on the list`, "bag");
        Find.sayLater("nani", Lang.join([Lang.line("oops"), Lang.bare(Lang.phrase([it.noun]))].concat(Find.listLines(round.L).map((x) => x.line))));
        if (misses >= 2) {
          V.glow(bag.filter((b) => b.wrong && !b.gone));
          round.onHelp("shown", { ids: [wrongNoun] });
        }
      };
    });
    round.onBagTap = null;
    UI.hideGist();
    await Find.say("shopkeeper", Lang.line("bye"), { ms: 900 });
    V.mood("neutral");
  }
  Find.checkBag = checkBag;

  /* ---------------- one round ---------------- */
  async function run(round, { bag = true, greet = false, search = true } = {}) {
    const scene = round.scene;
    V.build(scene);
    V.onTap((x, y) => round.tap(x, y));
    const { wants, kinds } = makeWants(round.knobs, scene);
    round.kindsOut = kinds;
    round.items = await Find.placeItems(scene, kinds);
    round.items.forEach((it) => V.addItem(it));
    V.openZoom();
    if (!round.alive()) throw new Cook.Abort("left");
    if (greet) await greeting(round);
    round.openList(wants);
    UI.gist(Find.data.mechanics.list.goal);
    round.phase = "listen";
    await round.sayList();
    if (!round.alive()) throw new Cook.Abort("left");
    if (search) {
      round.beginSearch();
      await round.waitDone();
      round.endSearch();
      round.phase = "grade";
      await round.grade();
    }
    if (bag) await checkBag(round, { fromBasket: search });
    UI.hideGist();
    return round.finish();
  }
  Find.Mech.define("list", { run });

  /* ---------------- the Search lab ---------------- */
  Find.Mech.lab("list", { name: "Nani's list + Check the bag", verb: "M1 + M5", mech: "list", opts: { bag: true } });
  Find.Mech.lab("list-only", { name: "Nani's list", verb: "M1: find + count", mech: "list", opts: { bag: false } });
  Find.Mech.lab("bag", { name: "Check the bag", verb: "M5 on its own", mech: "list", opts: { bag: true, search: false } });
})(window);

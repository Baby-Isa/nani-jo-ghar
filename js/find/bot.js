/*
 * Find it: the non-speaker bot (docs/find-it-design.md s6, "the wife's test
 * as code"). A test player that sees only the screen and knows no Kutchi.
 *
 * It sees what a person who doesn't speak Kutchi sees: the pictures on the
 * stall (and what they are in English: anyone can tell an orange from a
 * lemon), where they are and how big they look, the rows on the list as
 * drawn (their visible text, any digit, tallies and the "no" mark), the bag,
 * and the English goal behind the "?". It never reads the round's data. It plays
 * with one of these strategies:
 *   salient    each row gets the biggest, most eye-catching picture left
 *   copies     each row gets the picture with the most copies out
 *   leftright  row i gets the i-th kind of thing, scanning left to right
 *   random     each row gets a random kind
 *   cognate    a row whose visible word looks like an English fruit name
 *              (kivi ~ kiwi) gets that fruit; the rest as "salient"
 * How many: the row's digit if one is ever shown (a leak: rows show only
 * the running tally now), otherwise a guess (1-3).
 * The bag: a kind it didn't pick itself, else a kind there's only one of.
 * If it earns the ear star in more than 10% of rounds, something on the
 * screen is giving the answer away.
 */
(function (global) {
  const Cook = global.Cook;
  const Find = global.Find;
  const $ = (s) => document.querySelector(s);
  const B = (Find.Bot = {});
  B.STRATEGIES = ["salient", "copies", "leftright", "random", "cognate"];

  const visible = (e) => {
    if (!e) return false;
    const r = e.getBoundingClientRect();
    const cs = getComputedStyle(e);
    return r.width > 2 && r.height > 2 && cs.display !== "none" && cs.visibility !== "hidden";
  };
  const picOf = (e) => e.querySelector("img").getAttribute("src");
  /** What anyone can see: the picture's thing, in English (they recognise fruit, not Kutchi). */
  const seen = (pic) => {
    const m = /([a-z]{3}-\d\d)\.png$/.exec(pic || "");
    const w = m && Cook.data.words[m[1]];
    return w ? w.english : "";
  };
  const num = (t) => {
    const n = parseInt(String(t || "").replace(/[^0-9]/g, ""), 10);
    return Number.isFinite(n) ? n : null;
  };

  B.look = function () {
    const card = (sel) =>
      [...document.querySelectorAll(sel)]
        .filter((e) => visible(e) && !e.classList.contains("gone") && !e.classList.contains("off"))
        .map((e) => ({ e, pic: picOf(e), r: e.getBoundingClientRect() }));
    const rows = [...document.querySelectorAll("#mission .lr")].map((li) => ({
      no: li.classList.contains("no"),
      text: ((li.querySelector(".wp-text") || {}).innerText || "").trim(),
      digit: num((li.querySelector(".ldigit") || {}).textContent),
      tally: num((li.querySelector(".ltally") || {}).textContent) || 0,
    }));
    return {
      items: card("#world .w-items .fi-item"),
      bag: card("#world .fi-bag"),
      rows,
      searching: visible($("#find-done")),
      // the goal waits behind the "?" (Wave 5): what anyone sees by pressing it
      bagging: /packed your bag/i.test(Cook.UI.helpText()),
      result: visible($("#overlay")) && !!$("#panel .res-card"),
    };
  };

  function lev(a, b) {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++)
      for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  /** How much a row's visible text looks like an English name (0 = the same word). */
  function likeness(text, english) {
    const toks = String(text).toLowerCase().split(/[^a-z]+/).filter((t) => t.length >= 3);
    const names = String(english).toLowerCase().split(/[^a-z]+/).filter(Boolean);
    let best = 1;
    toks.forEach((t) => names.forEach((n) => (best = Math.min(best, lev(t, n) / Math.max(t.length, n.length)))));
    return best;
  }

  const tap = async (e) => {
    const r = e.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height * 0.55;
    const t = document.elementFromPoint(x, y);
    if (!t) return;
    const o = { clientX: x, clientY: y, bubbles: true, cancelable: true, pointerId: 11, isPrimary: true, pointerType: "touch" };
    t.dispatchEvent(new PointerEvent("pointerdown", o));
    t.dispatchEvent(new PointerEvent("pointerup", o));
  };
  const nap = (ms) => new Promise((r) => setTimeout(r, ms / Math.max(1, Cook.speed)));

  function kindsOf(list) {
    const by = new Map();
    list.forEach((x) => {
      const k = by.get(x.pic) || { pic: x.pic, els: [], area: 0, minX: Infinity, english: seen(x.pic) };
      k.els.push(x);
      k.area = Math.max(k.area, x.r.width * x.r.height);
      k.minX = Math.min(k.minX, x.r.left);
      by.set(x.pic, k);
    });
    return [...by.values()];
  }

  /** Assign each list row a kind of thing on the stall, by strategy. */
  function assign(rows, kinds, strategy) {
    const pool = kinds.slice();
    const order = {
      salient: (a, b) => b.area - a.area,
      copies: (a, b) => b.els.length - a.els.length,
      leftright: (a, b) => a.minX - b.minX,
    }[strategy];
    const ranked = strategy === "random" || !order && strategy !== "cognate" ? Cook.shuffle(pool) : pool.sort(order || ((a, b) => b.area - a.area));
    // a "no X" row: a cognate bot avoids the thing it looks like
    const avoid = new Set();
    if (strategy === "cognate")
      rows.filter((r) => r.no).forEach((r) => {
        const k = ranked.slice().sort((a, b) => likeness(r.text, a.english) - likeness(r.text, b.english))[0];
        if (k && likeness(r.text, k.english) <= 0.4) avoid.add(k.pic);
      });
    const out = [];
    const used = new Set(avoid);
    rows
      .filter((r) => !r.no)
      .forEach((r) => {
        let k = null;
        if (strategy === "cognate") {
          const c = ranked.filter((x) => !used.has(x.pic)).sort((a, b) => likeness(r.text, a.english) - likeness(r.text, b.english))[0];
          if (c && likeness(r.text, c.english) <= 0.4) k = c;
        }
        k = k || ranked.find((x) => !used.has(x.pic));
        if (!k) return;
        used.add(k.pic);
        out.push({ row: r, kind: k, n: r.digit || 1 + Math.floor(Math.random() * 3) });
      });
    return out;
  }

  /** Play the round on screen until the result appears. Resolves with what it did. */
  B.play = async function (round, strategy = "salient") {
    const token = Cook.run;
    const alive = () => token === Cook.run;
    const log = { strategy, picks: [], bag: null };
    const picked = new Set();
    const tried = new Set();
    let searched = false;
    let bagTaps = 0;
    const t0 = Date.now();
    while (alive() && Date.now() - t0 < 120000) {
      const L = B.look();
      if (L.result) break;
      if (L.searching && !searched) {
        await nap(300);
        searched = true;
        const plan = assign(L.rows, kindsOf(L.items), strategy);
        for (const p of plan) {
          picked.add(p.kind.pic);
          const els = p.kind.els.slice().sort((a, b) => b.r.width * b.r.height - a.r.width * a.r.height);
          for (let i = 0; i < p.n && i < els.length; i++) {
            if (!alive()) return log;
            await tap(els[i].e);
            log.picks.push(seen(p.kind.pic));
            await nap(160);
          }
        }
        await nap(250);
        if (alive() && visible($("#find-done"))) $("#find-done").click();
      } else if (L.bagging && L.bag.length && bagTaps < 12) {
        await nap(200);
        const ks = kindsOf(B.look().bag);
        // a kind it didn't pick itself, then one there's only one of, then anything it hasn't tried
        const fresh = (k) => !tried.has(k.pic);
        const choice = ks.find((k) => fresh(k) && !picked.has(k.pic)) || ks.find((k) => fresh(k) && k.els.length === 1) || ks.find(fresh) || Cook.pick(ks);
        if (choice) {
          tried.add(choice.pic);
          if (log.bag == null) log.bag = seen(choice.pic);
          await tap(choice.els[0].e);
        }
        bagTaps++;
        await nap(700);
      } else await nap(120);
    }
    return log;
  };
})(window);

#!/usr/bin/env node
/*
 * Run 16 (fix-samosa): the probes of samosa's and roll-tawa's rows (SAM-44, SAM-47, RT-01 to RT-04). One lab play with the
 * sandbox's fair player (build/sandbox/lib/cook-player.mjs), a fresh profile and the first-time help on (guided=1), while the page is
 * sampled every 100 ms: Nani's box and its line, the voice, the first-time light's layers and holes, the gear, the fried samosas.
 * Each --row decides on those samples; exit 0 = the row holds, 1 = it fails (each fault printed), 2 = the play broke.
 *
 *   node build/probes/samosa-rt.mjs --row SAM-47 [--game samosa] [--level 1] [--size 1280x665] [--speed 2] [--secs 150]
 *
 * Port: COOK_TEST_PORT (default 8853).
 */
const argv = process.argv.slice(2);
const val = (k, d) => { const i = argv.indexOf(`--${k}`); return i >= 0 ? argv[i + 1] : d; };
const row = val("row", "SAM-47");
const ROWS = {
  "SAM-44": { game: "samosa" }, "SAM-35": { game: "samosa" }, "SAM-46": { game: "samosa" }, "SAM-47": { game: "samosa" }, "SAM-47a": { game: "samosa" }, "SAM-47b": { game: "samosa" }, "chai": { game: "chai-tray" },
  "RT-01": { game: "roll-tawa" }, "RT-02": { game: "roll-tawa" }, "RT-03": { game: "roll-tawa" }, "RT-04": { game: "roll-tawa" },
};
if (!ROWS[row]) { console.error(`unknown row ${row}`); process.exit(2); }
const game = val("game", ROWS[row].game), level = +val("level", 1), speed = +val("speed", 1), secs = +val("secs", 200);
const [w, h] = String(val("size", "1280x665")).split("x").map(Number);
process.env.COOK_TEST_PORT = process.env.COOK_TEST_PORT || "8853";
const { pw, startServer, BASE } = await import("../sandbox/lib/env.mjs");
const { CookPlayer } = await import("../sandbox/lib/cook-player.mjs");
const { ChildPlayer } = await import("../sandbox/lib/child-player.mjs");
const pace = val("pace", "child");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rec = { state: async () => {}, pend: () => {}, note: () => {}, shot: async () => {} };

// one sample of the page (all boxes in page px), read in an animation frame queued after the game's own: what was last drawn, never a
// state between two frames that is changed before it is drawn
const SAMPLE = (game) => {
  const box = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return r.width && r.height ? [r.x, r.y, r.width, r.height].map(Math.round) : null; };
  const ls = [...document.querySelectorAll(".njg-onboard.on")].filter((l) => !l.classList.contains("ob-empty") && !l.classList.contains("ob-buried") && +getComputedStyle(l).opacity > 0.05);
  const holes = ls.flatMap((l) => { try { return JSON.parse(l.dataset.holes || "[]"); } catch (e) { return []; } }).map((x) => [x.x, x.y, x.w, x.h].map(Math.round));
  const g = document.querySelector("#guide");
  const line = g && g.querySelector(".ng-line");
  const V = window.NjgVoice;
  const C = window.Cook, S = C && C.scene;
  let speaking = false;
  try { speaking = !!(C && C.voiceBusy && C.voiceBusy()) || !!(V && V.busy && V.busy()); } catch (e) { /* not yet */ }
  const fry = S && S.children ? S.children.list.filter((o) => o.texture && /^sv2-fry-\d$/.test(o.texture.key) && o.visible && o.alpha > 0.02).map((o) => ({ k: +o.texture.key.slice(-1), a: +o.alpha.toFixed(2), x: Math.round(o.x), y: Math.round(o.y), d: +o.depth.toFixed(3) })) : [];
  const e = window.njgTest && njgTest.cook && njgTest.cook.expectation ? njgTest.cook.expectation() : null;
  const gauge = window.njgTest && njgTest.cook && njgTest.cook.gauge ? njgTest.cook.gauge() : null;
  const gear = document.querySelector("#btn-settings, .njg-settings, #settings-btn, [data-role=settings]");
  // RT-01 (as contract-113 measures it, lib/contract-s19.mjs): a word pill, the count's badge or the tally 12% or more under a button of
  // the page (the settings cog), outside the side panel
  const shown = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 2 && r.height > 2 && cs.visibility !== "hidden" && cs.display !== "none" && +cs.opacity > 0.05; };
  const btns = [...document.querySelectorAll("button, [role=button]")].filter((b) => shown(b) && !b.closest("#side, #mission, #guide, .oc-card, .wc14, .njg-results, .njg-rq-card"));
  const under = [];
  for (const pl of document.querySelectorAll(".njg-wpill, .njg-pill, #count-badge, .njg-tally")) {
    if (!shown(pl)) continue;
    const a = pl.getBoundingClientRect();
    for (const b of btns) {
      if (b.contains(pl) || pl.contains(b)) continue;
      const c = b.getBoundingClientRect();
      const ix = Math.max(0, Math.min(a.right, c.right) - Math.max(a.left, c.left)), iy = Math.max(0, Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top));
      if ((ix * iy) / Math.max(1, a.width * a.height) >= 0.12) under.push(`${(pl.textContent || pl.id || pl.className).toString().trim().slice(0, 20)} under ${b.id || b.className || b.tagName} [${[a.x, a.y, a.width, a.height].map(Math.round)}]`);
    }
  }
  const txt = (sel) => [...document.querySelectorAll(sel)].filter(shown).map((e) => (e.innerText || "").replace(/\s+/g, " ").trim()).filter(Boolean);
  const things = S && S.children ? S.children.list.filter((o) => o.texture && o.visible && o.alpha > 0.05 && /tawa|hob|burner|plate|serving|turner|face/i.test(o.texture.key)).map((o) => { const b = o.getBounds(); return { k: o.texture.key, b: [b.x, b.y, b.width, b.height].map(Math.round) }; }) : [];
  // SAM-46: the board, the karahi, the hob and the filling heaps (world px), the word pops (canvas text) and the bottom row
  const geo = [];
  const texts = [];
  let bottom = null;
  if (game === "samosa" && S && S.children) {
    const walk = (list) => list.forEach((o) => {
      if (!o.visible || o.alpha <= 0.05) return;
      if (o.type === "Text" && o.text) { const b = o.getBounds(); texts.push({ t: o.text, b: [b.x, b.y, b.width, b.height].map(Math.round) }); }
      else if (o.texture && /board|karahi|hob|heap/i.test(o.texture.key)) { const b = o.getBounds(); geo.push({ k: o.texture.key, b: [b.x, b.y, b.width, b.height].map(Math.round) }); }
      if (o.list) walk(o.list);
    });
    walk(S.children.list);
    try { const A = C.Frame.area(S); bottom = A && A.bottom ? [A.bottom.x, A.bottom.y, A.bottom.w, A.bottom.h].map(Math.round) : null; } catch (e) { /* no frame yet */ }
  }
  // SAM-35: the language's number words, from the game's own lexicon (never written here: non-negotiable 2)
  let nums = [];
  try { if (C && C.numId && C.display) nums = Array.from({ length: 12 }, (_, i) => String(C.display(C.numId(i + 1)) || "").toLowerCase()).filter(Boolean); } catch (e) { /* not loaded */ }
  return {
    geo, texts, bottom, nums,
    under, card: txt("#mission .oc-card"), cardItems: txt("#mission .oc-card .wc14"), pop: txt(".njg-rq-card"), things,
    layers: ls.length, holes, guide: box(g), line: line ? line.textContent.trim() : null, speaking,
    fry, ek: e ? `${e.kind}:${e.key || ""}` : null, gauge, gear: box(gear), view: C && S ? S.viewName : null,
  };
};

const server = await startServer();
const browser = await pw.chromium.launch();
const page = await browser.newPage({ viewport: { width: w, height: h } });
const samples = [];
let code = 0;
try {
  // (roll-tawa is the Station lab's own, on cook.html, as the sandbox's cook:<station> flows play it; the rest on the lab page's host)
  const station = game === "roll-tawa";
  if (station) {
    await page.goto(`${BASE}/cook.html?speed=${speed}`, { waitUntil: "load" });
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${BASE}/cook.html?speed=${speed}`, { waitUntil: "load" });
    await page.waitForSelector("#panel .title-wrap", { timeout: 20000 });
    await page.evaluate(([k, l]) => { njgTest.cook.lab(k, true, { level: l }); }, [game, level]);
  } else {
    await page.goto(`${BASE}/lab.html`, { waitUntil: "load" });
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${BASE}/lab.html?mode=cook&game=${game}&level=${level}&nonav=1&seed=7&speed=${speed}&guided=1`, { waitUntil: "load" });
    await page.waitForFunction(() => /\/playing/.test(String(window.njgTest && njgTest.state && njgTest.state())), null, { timeout: 60000 });
    await page.evaluate(() => import("./js/cook/mount.js").then((m) => { (window.njgTest = window.njgTest || {}).cook = m.Cook.testHook; window.Cook = m.Cook; }));
  }
  const t0 = Date.now();
  let on = true;
  const sampler = (async () => { while (on) { const s = await page.evaluate(`new Promise((r) => requestAnimationFrame(() => r((${SAMPLE.toString()})(${JSON.stringify(game)}))))`).catch(() => null); if (s) samples.push({ t: Date.now() - t0, ...s }); await sleep(100); } })();
  const P = pace === "child" ? new ChildPlayer(page, rec, { speed }) : new CookPlayer(page, rec, { mode: "fair", speed });
  P.helped = true;
  const st = () => page.evaluate("window.njgTest ? String(njgTest.state()) : 'loading'").catch(() => "loading");
  const over = station ? () => page.evaluate("(() => { const b = document.querySelector('.njg-results #lab-list'); return !!b && b.offsetParent !== null; })()").catch(() => false) : async () => !/\/playing/.test(await st());
  await P.play(async () => (await over()) || Date.now() - t0 > secs * 1000, { timeout: secs * 1000 + 20000 }).catch((e) => console.log("play: " + e.message));
  await sleep(1500);
  on = false;
  await sampler;
} catch (e) {
  console.log("broke: " + e.message);
  code = 2;
}
await browser.close();
if (server && server.close) server.close();
if (process.env.PROBE_DUMP) (await import("node:fs")).writeFileSync(process.env.PROBE_DUMP, JSON.stringify(samples));
if (code) process.exit(code);

const inside = (a, b, tol = 2) => a[0] >= b[0] - tol && a[1] >= b[1] - tol && a[0] + a[2] <= b[0] + b[2] + tol && a[1] + a[3] <= b[1] + b[3] + tol;
const faults = [];
const checks = {
  // SAM-44: (a) a samosa in the oil browns as its ring fills: the leading one's colour (raw 0, light 1, golden 2, too dark 3: the picture
  // under and the share of the next one over it) is never paler than its ring says (golden at the green's start, lo; light at half of
  // it), and no samosa leaves the oil paler than golden at the lift; (b) in the fry Nani's line changes once per step: it never goes
  // back to a line it has left ('Samosa hane kadh.' back to 'Tar!' and forward again while the spoon carries one)
  "SAM-44": () => {
    let worst = null;
    for (const s of samples) {
      const g = s.gauge;
      if (!g || g.level == null || !s.fry.length || !/^(timing:lift|tap:samosa|wait:)/.test(s.ek || "")) continue;
      // the samosas in the oil: pairs (the picture under, the next over it) at one place; the most cooked one leads
      const at = new Map();
      for (const f of s.fry) { const k = `${Math.round(f.x / 6)},${Math.round(f.y / 30)}`; const v = at.get(k) || 0; at.set(k, Math.max(v, f.a >= 0.999 ? f.k : f.k - 1 + f.a)); }
      const lead = Math.max(...at.values());
      const want = Math.min(2, g.level / (g.lo * 0.5));
      if (want - lead > 0.25 && (!worst || want - lead > worst.d)) worst = { d: want - lead, t: s.t, lead, want, level: g.level };
    }
    if (worst) faults.push(`${(worst.t / 1000).toFixed(1)} s: the leading samosa's colour ${worst.lead.toFixed(2)} where its ring (${worst.level.toFixed(2)}) says ${worst.want.toFixed(2)} (raw 0, light 1, golden 2)`);
    // (the knob's 'Chulo bar!' between is the fire's own step; 'Tar!' after the lift's line is a step back unless a raw one still waits
    // to go in, the drop's step: its expectation a tap on a samosa)
    const fry = samples.filter((s) => s.line && /^(Tar!|Samosa hane kadh\.|Chulo bar!)$/.test(s.line));
    let cur = null;
    for (let n = 0; n < fry.length; n++) {
      const s = fry[n];
      if (s.line === cur) continue;
      if (cur === "Samosa hane kadh." && s.line === "Tar!") {
        const next = fry.slice(n, n + 6).map((x) => x.ek).filter(Boolean);
        if (!next.includes("tap:samosa")) { faults.push(`${(s.t / 1000).toFixed(1)} s: Nani's line back to 'Tar!' after 'Samosa hane kadh.' with no samosa left to put in (it changes once per step)`); break; }
      }
      cur = s.line;
    }
    if (!fry.length) faults.push("no fry line seen: the play never reached the fry");
  },
  // RT-01: no word pill, count badge or tally under the settings cog at any moment (Fable, 15 Nov: a pill top right with a dough disc,
  // its word hidden under the gear)
  "RT-01": () => {
    const s = samples.find((x) => x.under && x.under.length);
    if (s) faults.push(`${(s.t / 1000).toFixed(1)} s: ${s.under.join("; ")}`);
  },
  // RT-02: the roll's first time is the kit's light (the dim and one gold box round the board) while the roll is the step
  "RT-02": () => {
    if (!samples.some((x) => /^roll:/.test(x.ek || "") && x.layers > 0 && x.holes.length)) faults.push("no first-time light (the dim and its box) while the roll was the step");
  },
  // RT-03: the order card is the order's own: its row holds the item card ('char maani'), not a name over an empty box
  "RT-03": () => {
    const s = samples.find((x) => x.card && x.card.length);
    if (!s) return void faults.push("no order card seen");
    if (!samples.some((x) => (x.cardItems || []).some((t) => /maani/i.test(t)))) faults.push(`the order card has no item card for the maani: '${s.card.join(" | ")}'`);
    if (s.card.some((t) => /^Nana\b/.test(t))) faults.push(`the order card's row is a name: '${s.card.join(" | ")}'`);
  },
  // SAM-46 (three of its four: the pastry's own shadow is a question against SH-268): (a) the fill's word pop ('hakro chundo') whole on
  // the board, never over its corner; (b) the shelf's heaps centred in the bottom row (their group's middle within 2% of the row's
  // width of its middle); (c) the karahi, handles and all, inside its hob
  "SAM-46": () => {
    const inBox = (a, b, tol = 2) => a[0] >= b[0] - tol && a[1] >= b[1] - tol && a[0] + a[2] <= b[0] + b[2] + tol && a[1] + a[3] <= b[1] + b[3] + tol;
    const hit = (a, b) => a[0] < b[0] + b[2] && b[0] < a[0] + a[2] && a[1] < b[1] + b[3] && b[1] < a[1] + a[3];
    let popSeen = 0, shelfSeen = 0, potSeen = 0;
    const bad = {};
    const once = (k, m) => { if (!bad[k]) { bad[k] = 1; faults.push(m); } };
    for (const x of samples) {
      const board = (x.geo || []).find((g) => g.k === "sv3-board");
      if (board && /^tap:/.test(x.ek || "") || (board && x.line && /^Bhar/.test(x.line))) for (const t of x.texts || []) {
        if (!hit(t.b, board.b) || /^Shabash/.test(t.t)) continue;
        popSeen++;
        if (!inBox(t.b, board.b)) { once("pop", `${(x.t / 1000).toFixed(1)} s: the pop '${t.t}' [${t.b}] past the board's edge [${board.b}]`); }
      }
      const heaps = (x.geo || []).filter((g) => /^sv3-heap-/.test(g.k) && x.bottom && g.b[1] + g.b[3] / 2 > x.bottom[1]);
      if (heaps.length >= 2 && /^tap:/.test(x.ek || "")) {
        shelfSeen++;
        const mid = (Math.min(...heaps.map((g) => g.b[0])) + Math.max(...heaps.map((g) => g.b[0] + g.b[2]))) / 2, row = x.bottom[0] + x.bottom[2] / 2;
        if (Math.abs(mid - row) > 0.02 * x.bottom[2]) { once("shelf", `${(x.t / 1000).toFixed(1)} s: the shelf's heaps centred at ${Math.round(mid)}, the bottom row's middle ${Math.round(row)}`); }
      }
      const pot = (x.geo || []).find((g) => g.k === "sv3-karahi"), hob = (x.geo || []).find((g) => /^kit-hob/.test(g.k));
      if (pot && hob) {
        potSeen++;
        if (!inBox(pot.b, hob.b)) { once("pot", `${(x.t / 1000).toFixed(1)} s: the karahi [${pot.b}] past its hob [${hob.b}]`); }
      }
    }
    if (!popSeen) faults.push("no word pop seen on the board");
    if (!shelfSeen) faults.push("no shelf seen");
    if (!potSeen) faults.push("no karahi on its hob seen");
  },
  // RT-04 (its tawa part; the turner's sleeve is the hand rig's, js/cook/hands.js, and the face and Nani's box are the judge's): each
  // tawa's round body centred on a burner of its hob (within 3% of the hob's width) and inside the hob's edges. The body's middle is
  // (0.398, 0.552) of the tawa's picture and its radius 0.355 of the picture's width (roll-tawa.js TAWA_BODY, TAWA_IN); the burners are
  // the kit's (js/cook/kitchen-kit.js HOBS: shares of each hob picture)
  "RT-04": () => {
    const BURNERS = { 1: [[0.4944, 0.3805]], 2: [[0.251, 0.4025], [0.7445, 0.4025]], 3: [[0.1596, 0.3725], [0.4993, 0.3728], [0.8389, 0.3725]], 4: [[0.1413, 0.4542], [0.3807, 0.4543], [0.6202, 0.4544], [0.8597, 0.4544]] };
    let seen = 0;
    for (const x of samples) {
      const hob = (x.things || []).find((g) => /^kit-hob-\d/.test(g.k));
      const tawas = (x.things || []).filter((g) => /tawa/i.test(g.k) && !/maani/i.test(g.k));
      if (!hob || !tawas.length || !(x.ek || "").startsWith("roll:")) continue;
      const n = +hob.k.match(/^kit-hob-(\d)/)[1];
      const bs = (BURNERS[n] || []).map(([u, v]) => [hob.b[0] + u * hob.b[2], hob.b[1] + v * hob.b[3]]);
      for (const t of tawas) {
        const cx = t.b[0] + 0.398 * t.b[2], cy = t.b[1] + 0.552 * t.b[3], r = 0.355 * t.b[2];
        const d = Math.min(...bs.map(([bx, by]) => Math.hypot(bx - cx, by - cy)));
        seen++;
        if (d > 0.03 * hob.b[2]) return void faults.push(`${(x.t / 1000).toFixed(1)} s: the tawa's body at (${Math.round(cx)}, ${Math.round(cy)}), ${Math.round(d)} px from its burner (hob [${hob.b}])`);
        if (cx - r < hob.b[0] - 2 || cx + r > hob.b[0] + hob.b[2] + 2) return void faults.push(`${(x.t / 1000).toFixed(1)} s: the tawa's body (${Math.round(cx - r)} to ${Math.round(cx + r)}) past the hob's edges (${hob.b[0]} to ${hob.b[0] + hob.b[2]})`);
      }
    }
    if (!seen) faults.push("no tawa on its hob seen while the roll was the step");
  },
  // SAM-35: the order card's sentence says the count (one of the lexicon's number words), and its item cards are the fillings, never a
  // finished samosa (Zafar, 12 Nov night: "If there's two samosas being ordered, the sentence should say, I want two samosas ... the item
  // card should be the fillings, not the finished samosa")
  "SAM-35": () => {
    const s = samples.find((x) => x.card && x.card.length && x.cardItems && x.cardItems.length && x.nums && x.nums.length);
    if (!s) return void faults.push("no order card with its item cards seen");
    const items = s.cardItems.join(" | ");
    const sentence = s.card[0].replace(items, "").trim().toLowerCase();
    if (!s.nums.some((n) => sentence.split(/[^a-z\u00c0-\u024f']+/).includes(n))) faults.push(`the order's sentence '${sentence}' names no count`);
    if (s.cardItems.some((t) => /samosa/i.test(t))) faults.push(`a finished-samosa item card on the order card: '${items}'`);
  },
  // SAM-47: (a) while Nani says the line in her box, her box is never under a first-time light's dim; (b) no light comes twice on the
  // same box with nothing done between (two onboards 3 s apart, nothing changed)
  chai: () => checks["SAM-47a"](),
  // SAM-47: (a) while Nani says the line in her box, her box is never under a first-time light's dim (chai has the same: a kit rule, a
  // question); (b) a tap's light never comes again on the same box for the same thing (the heap lit again for each next spoon)
  "SAM-47": () => { checks["SAM-47a"](); checks["SAM-47b"](); },
  "SAM-47a": () => {
    for (const s of samples) {
      if (s.layers && s.speaking && s.line && s.guide && !s.holes.some((hb) => inside(s.guide, hb))) { faults.push(`${(s.t / 1000).toFixed(1)} s: Nani's box (line '${s.line}') under the dim while she speaks; lit ${JSON.stringify(s.holes)}`); break; }
    }
  },
  "SAM-47b": () => {
    const shown = new Map();
    let prev = null;
    for (const s of samples) {
      // (a lit box's centre, to 24 px: the box itself pulses)
      const lit = s.holes.length && /^tap:/.test(s.ek || "") ? `${s.ek} ${((b) => [Math.round((b[0] + b[2] / 2) / 24), Math.round((b[1] + b[3] / 2) / 24)].join(","))(s.holes[s.holes.length - 1])}` : null;
      if (lit && lit !== prev) {
        if (shown.has(lit)) faults.push(`${(s.t / 1000).toFixed(1)} s: the same light again (${s.ek} at ${JSON.stringify(s.holes.at(-1))}), first at ${(shown.get(lit) / 1000).toFixed(1)} s`);
        else shown.set(lit, s.t);
      }
      prev = lit;
    }
  },
};
if (!checks[row]) { console.log(`${row}: no check yet; ${samples.length} samples`); process.exit(2); }
checks[row]();
console.log(`${row} ${game} L${level} ${w}x${h}: ${samples.length} samples over ${((samples.at(-1) || { t: 0 }).t / 1000).toFixed(0)} s`);
faults.forEach((f) => console.log("  FAULT " + f));
console.log(faults.length ? `FAIL ${row}` : `PASS ${row}`);
process.exit(faults.length ? 1 : 0);

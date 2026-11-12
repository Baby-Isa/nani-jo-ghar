// s19-clean-a3: the Fable review of s19-clean-a2's merge (build/reports/s19-clean-a2-review.md), its findings in the shared pieces.
// node --test build/sandbox/s19-clean-a3.test.mjs   (the page tests skip where there is no browser)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { launch, ROOT } from "./lib/env.mjs";

const { NjgServe } = await import("../../js/shared/serve.js");

// A page with the pop-up, a stand-in Lifecycle (stage ends by hand, notes kept) and a stand-in Cook lifetime: its clock is the one
// unmount cancels, and its ends run at unmount (js/cook/life.js), as Home does: the host fires no stage end on a leave (host.js)
async function popupPage(browser) {
  const ctx = await browser.newContext({ viewport: { width: 900, height: 400 } });
  const page = await ctx.newPage();
  await page.setContent("<!doctype html><meta charset=utf-8><body style='margin:0'><div id=stage style='position:absolute;inset:0'></div><div id=panel style='position:absolute;right:0;top:0;width:160px;height:80px'><div class=oc-card>card</div></div></body>");
  await page.evaluate(() => {
    const ends = [];
    window.__log = [];
    window.Lifecycle = { onStageEnd: (f) => (ends.push(f), () => ends.splice(ends.indexOf(f), 1)), stageEnd: () => ends.slice().forEach((f) => f()), hooks: () => ends.length };
    const timers = new Set();
    const lifeEnds = new Set();
    window.__life = {
      wait: (ms) => new Promise((r) => { const t = setTimeout(() => (timers.delete(t), r()), ms); timers.add(t); }),
      onEnd: (f) => (lifeEnds.add(f), () => lifeEnds.delete(f)),
      end: () => { [...lifeEnds].forEach((f) => f()); lifeEnds.clear(); timers.forEach((t) => clearTimeout(t)); timers.clear(); },
    };
  });
  await page.addScriptTag({ path: join(ROOT, "js", "shared", "wrong-order.js"), type: "module" });
  await page.waitForFunction(() => window.NjgWrongOrder);
  return { ctx, page };
}

test("a2 finding 1: leaving mid-pop-up (Cook's lifetime ends, no stage end) ends it: veil gone, nothing after, a later stage end wakes nothing", async (t) => {
  let browser;
  try { browser = await launch(); } catch (e) { return t.skip("no browser here"); }
  try {
    const { ctx, page } = await popupPage(browser);
    const out = await page.evaluate(async () => {
      const never = () => new Promise(() => {}); // a voice that never ends
      const big = () => { const el = document.createElement("div"); const rows = [1, 2, 3, 4, 5].map((i) => { const r = document.createElement("div"); r.className = "oc-row"; r.textContent = "row " + i; el.appendChild(r); return { el: r, ok: i !== 3, say: never }; }); return { el, rows, head: never }; };
      const from = document.querySelector("#panel .oc-card");
      let result = "pending";
      const p = window.NjgWrongOrder.play({
        host: document.getElementById("stage"),
        cards: [{ who: "ma", ok: false, face: "", headline: "x", big, from }],
        wait: window.__life.wait,
        onEnd: window.__life.onEnd,
        sound: (n) => window.__log.push("sound:" + n),
        note: (w) => window.__log.push(w),
      }).then((r) => (result = r));
      await new Promise((r) => setTimeout(r, 1500)); // the card is open, a line being said
      const mid = { veil: document.querySelectorAll(".njg-wo").length, hooks: window.Lifecycle.hooks(), open: window.NjgWrongOrder.isOpen(), out: from.classList.contains("njg-wo-out") };
      const n0 = window.__log.length;
      window.__life.end(); // Home: Cook unmounts
      await new Promise((r) => setTimeout(r, 300));
      const after = { result, veil: document.querySelectorAll(".njg-wo").length, hooks: window.Lifecycle.hooks(), open: window.NjgWrongOrder.isOpen(), out: from.classList.contains("njg-wo-out"), log: window.__log.slice(n0) };
      window.Lifecycle.stageEnd(); // the next game's stage ends
      await new Promise((r) => setTimeout(r, 1500));
      return { mid, after, later: window.__log.slice(n0), p: !!p };
    });
    assert.equal(out.mid.veil, 1, "the pop-up is up before the leave");
    assert.equal(out.mid.hooks, 1);
    assert.ok(out.after.result && out.after.result.cut, `play() returned cut at the leave: ${JSON.stringify(out.after.result)}`);
    assert.equal(out.after.veil, 0, "the veil went with Cook");
    assert.equal(out.after.hooks, 0, "its stage-end hook is gone");
    assert.equal(out.after.open, false, "isOpen() is false");
    assert.equal(out.after.out, false, "the side panel's card is back");
    assert.deepEqual(out.after.log, [], "no sound or note after the leave");
    assert.deepEqual(out.later, [], "a later stage end wakes nothing (no tick, no row, no close)");
    await ctx.close();
  } finally { await browser.close(); }
});

test("a2 finding 1: the serve's round never goes on from a cut pop-up (no redo, no reset, no end against the next game)", async () => {
  const did = [];
  NjgServe.use({ show: async () => "cut", redo: () => did.push("redo"), end: () => did.push("end") });
  try {
    let settled = false;
    NjgServe.round({
      items: ["nana"], done: async () => {}, review: async () => [], recast: async () => did.push("recast"), undo: async () => did.push("undo"),
      check: () => ({ ok: false, rows: [] }), redo: { wrong: () => ({ action: "again" }) }, key: (x) => x, reset: () => did.push("reset"), again: () => did.push("again"), leave: () => did.push("leave"),
    }).then(() => (settled = true));
    await new Promise((r) => setTimeout(r, 200));
    assert.equal(settled, false, "the round never resolves");
    assert.deepEqual(did, [], `nothing of the round ran after the cut: ${did}`);
  } finally { NjgServe.use(null); }
});

test("a2 finding 1: Cook's pop-up is given Cook's own end and the voice stop; Kit.wrongOrder never wakes from a cut", () => {
  const ui = readFileSync(join(ROOT, "js", "cook", "ui.js"), "utf8");
  const at = ui.indexOf("M.showWrong = async function");
  const body = ui.slice(at, ui.indexOf("M.redoStart = function", at));
  assert.match(body, /onEnd:\s*Cook\.life && Cook\.life\.onEnd/, "showWrong passes Cook.life.onEnd");
  assert.match(body, /hush:/, "showWrong passes the voice stop");
  assert.match(body, /return "cut"/, "a cut pop-up is told to the round");
  const kit = readFileSync(join(ROOT, "js", "cook", "kitchen-kit.js"), "utf8");
  assert.match(kit, /r === "cut" \? new Promise\(\(\) => \{\}\)/);
});

test("a2 finding 3: taps hurry only the line in flight; every row is still said and the wrong row's line is never cut", async (t) => {
  let browser;
  try { browser = await launch(); } catch (e) { return t.skip("no browser here"); }
  try {
    const { ctx, page } = await popupPage(browser);
    const run = (taps) => page.evaluate(async (taps) => {
      const said = [];
      const line = (id, ms) => () => { const s = { id, t0: performance.now(), t1: null }; said.push(s); return new Promise((r) => setTimeout(() => ((s.t1 = performance.now()), r()), ms)); };
      const big = () => { const el = document.createElement("div"); const rows = [1, 2, 3, 4, 5].map((i) => { const r = document.createElement("div"); r.className = "oc-row"; r.textContent = "row " + i; el.appendChild(r); return { el: r, ok: i !== 3, say: line("row" + i, 1200) }; }); return { el, rows, head: line("head", 1200) }; };
      const marks = [];
      const t0 = performance.now();
      const p = window.NjgWrongOrder.play({
        host: document.getElementById("stage"),
        cards: [{ who: "nana", ok: true, face: "", headline: "right" }, { who: "ma", ok: false, face: "", headline: "x", big }],
        note: (w, i) => w === "wo-row" && marks.push({ ok: i.ok, t: performance.now() }),
        hush: () => {},
      });
      // a child still tapping the pans: a tap every 150 ms from the start
      const iv = taps ? setInterval(() => { const v = document.querySelector(".njg-wo"); if (v) v.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); }, 150) : null;
      await p;
      if (iv) clearInterval(iv);
      return { ms: performance.now() - t0, said: said.map((s) => s.id), wrongHeard: said.find((s) => s.id === "row3"), marks: marks.map((m) => m.ok), crossAt: (marks.find((m) => !m.ok) || {}).t };
    }, taps);
    const calm = await run(false);
    const busy = await run(true);
    assert.deepEqual(calm.said, ["head", "row1", "row2", "row3", "row4", "row5"]);
    assert.deepEqual(busy.said, calm.said, "every line still said, however many taps");
    assert.deepEqual(busy.marks, [true, true, false, true, true], "every row marked, the wrong one crossed");
    assert.ok(busy.wrongHeard.t1 != null && busy.crossAt >= busy.wrongHeard.t1 - 5, "the wrong row's line was heard to its end before its cross, never cut by a tap");
    assert.ok(busy.ms < calm.ms - 1500, `taps hurry the other lines: ${Math.round(busy.ms)} against ${Math.round(calm.ms)} ms`);
    // each hurried line is still heard a moment (LOOK.minSay) before the next
    assert.ok(busy.ms > 5 * 500 + 1200, `never a flash: ${Math.round(busy.ms)} ms`);
    await ctx.close();
  } finally { await browser.close(); }
});

// a2 finding 2: contract-115's set is sekelo's grill and its trays only. The review's own scene (c115b.mjs): chai's good run with three
// hobs at 45% of the room's height spread across the play area and the tray beside them was green after s19-clean-a2; red again now
test("a2 finding 2: three small hobs spread across the width are red on contract-115; sekelo's grill and trays still one set", async () => {
  const { gunzipSync } = await import("node:zlib");
  const S = await import("./lib/contract-s19b.mjs");
  const r = JSON.parse(gunzipSync(readFileSync(join(ROOT, "build/sandbox/fixtures/bad-runs/pages/s19c2-cook-chai-tray-speed1@1280x665/page.json.gz"))).toString("utf8"));
  const first = r.timeline.find((e) => e.k === "s19it");
  const pic = (id, key, l, t0, rr, b) => [id, key, l, t0, rr, b, 100, 0, 0, 0, 0, 0, 0, 0, 0];
  const scene = (ch) => r.timeline.map((x) => (x.k !== "s19it" ? x : Object.assign({}, x, { ch: x === first ? ch : [], gone: [] })));
  const judge = (tl) => { const out = []; S.check115(r, tl, (id, t, msg) => /main thing/.test(msg) && out.push(msg)); return out; };
  const hobs = scene([pic(901, "kit-hob-901", 360, 150, 510, 360), pic(902, "kit-hob-902", 560, 150, 710, 360), pic(903, "kit-hob-903", 760, 150, 910, 360), pic(904, "v2-tray", 960, 160, 1170, 350)]);
  assert.ok(judge(hobs).length, "three small hobs and the tray: red");
  // the grill between its two trays, together across the width (a set laid side by side): green, as s19-clean-a2 made it
  const grill = scene([pic(911, "gk-tray", 40, 150, 330, 300), pic(912, "gk-grill", 340, 140, 940, 340), pic(913, "gk-tray", 950, 150, 1240, 300)]);
  assert.deepEqual(judge(grill), [], "sekelo's grill and trays filling the width: green");
  // the same short grill alone in the middle: red
  assert.ok(judge(scene([pic(912, "gk-grill", 340, 140, 940, 340)])).length, "the grill alone, short: red");
});

// a2 finding 4: the open card's smallest word never under 14 px (the card's own floor), measured as drawn; contract-118 judges it
test("a2 finding 4: contract-118 is red on an open card with 10 px words, green at 14", async () => {
  const { check118 } = await import("./lib/contract-wo.mjs");
  const run = (minPx) => {
    const card = { who: "ma", phase: "open", box: [200, 40, 540, 280], items: [[220, 60, 520, 100]], rows: 1, marked: 1, crossed: true, faceW: 90, minPx };
    const tl = [{ type: "c", k: "s19wo", t: 1000, vw: 740, vh: 320, veil: [0, 0, 740, 320], card, sideFaceW: 40, panel: [], faces: [] }, { type: "c", k: "s19wo", t: 2000, vw: 740, vh: 320, card: null, idle: true, panel: [], faces: [] }];
    const out = [];
    check118({ flow: "cook:chai-tray@L3#serve-wrong" }, tl, (id, t, m) => out.push(m));
    return out.filter((m) => /smallest word/.test(m));
  };
  assert.equal(run(10).length, 1, "10 px words: red");
  assert.deepEqual(run(14.2), [], "14 px: green");
});

test("a2 finding 4: a five- and a seven-row wrong card at 740x320 keeps its words at 14 px or more, every row in view or scrolled to", async (t) => {
  let browser;
  try { browser = await launch(); } catch (e) { return t.skip("no browser here"); }
  const { startServer, BASE } = await import("./lib/env.mjs");
  let srv;
  try { srv = await startServer(); } catch (e) { await browser.close(); return t.skip("port busy"); }
  try {
    for (const n of [5, 7]) {
      const ctx = await browser.newContext({ viewport: { width: 740, height: 320 } });
      const page = await ctx.newPage();
      await page.goto(`${BASE}/lab/wrong-order.html`, { waitUntil: "load" });
      await page.waitForFunction(() => window.OrderCard && window.Face);
      const r = await page.evaluate(async (n) => {
        const { NjgWrongOrder } = await import("/js/shared/wrong-order.js");
        const OC = window.OrderCard;
        const w = (x) => `<span class="word">${x}</span>`;
        const parts = [["dudh"], ["ba", "khun"], ["elchi"], ["aadu"], ["trae", "jeeru"], ["paani"], ["chai"]].slice(0, n).map(([a, b], i) => ({ label: b ? `${a} ${w(b)}` : w(a), key: "k" + i, done: false }));
        const data = { person: { id: "ma", face: "/assets/cook/characters/ma-badge.webp", name: "ma" }, headline: { html: `Muke ${w("chai")} khape.` }, items: [{ label: null, parts }] };
        NjgWrongOrder.play({ host: document.getElementById("stage"), cards: [{ who: "ma", ok: false, face: data.person.face, headline: data.headline.html, from: document.querySelector("#side .oc-card"), big() { const rows = []; const el = OC.card(data, { big: true, onEl: (k, e) => e.classList.contains("oc-row") && rows.push({ el: e, ok: k !== "k1", say: () => new Promise((r) => setTimeout(r, 3000)) }) }); return { el, rows }; } }], faceHtml: (who, src, size) => window.Face.html(who, size, { src }) });
        for (let i = 0; i < 100 && !document.querySelector(".njg-wo-open"); i++) await new Promise((r) => setTimeout(r, 50));
        await new Promise((r) => setTimeout(r, 400));
        const card = document.querySelector(".njg-wo-open");
        let px = 0;
        for (const x of card.querySelectorAll("*")) if ([...x.childNodes].some((m) => m.nodeType === 3 && m.textContent.trim())) { const f = parseFloat(getComputedStyle(x).fontSize) * (x.currentCSSZoom || 1); if (!px || f < px) px = f; }
        const b = card.getBoundingClientRect();
        return { px, inView: b.top >= -1 && b.left >= -1 && b.bottom <= innerHeight + 1 && b.right <= innerWidth + 1 };
      }, n);
      assert.ok(r.px >= 13.9, `${n} rows at 740x320: the smallest word is ${r.px.toFixed(1)} px`);
      assert.ok(r.inView, `${n} rows: the card inside the screen`);
      await ctx.close();
    }
  } finally { await browser.close(); srv.close(); }
});

#!/usr/bin/env node
// The 6 Nov card and type in the game (SH-222, SH-223, SH-224, SH-227; build/reports/card-build-chai-2026-11-06.md): chai L1 played by
// the fair player, shot BEFORE (the 6 Nov type held off: <html class="njg-lora"> stripped as it is set, so the page is today's game)
// and AFTER (the game as built), and measured.
//   COOK_TEST_PORT=8862 flock -w 1800 /tmp/njg-browser-8862.lock node build/tools/cards/card-build.mjs --out DIR
//        [--sizes 740x320,971x318,971x412,930x430,1280x665,1920x1080] [--states before,after] [--dpr 2] [--no-wm]
// At the order pop-up (the big card, Nani's box, Nana's bubble) it pins a still copy of the pop-up and shoots it, Nani's box and the
// whole screen; at the shelf (the side panel's order card, Nani's box shut) it shoots the shelf (the drawn pills) and the side panel
// with chai's own order and with three written-in rows (all one line, all two lines, mixed: only Mum's recorded forms), then the
// English hidden and one peeking; the word moment's cards from its lab page (lab/word-moment.html?at=end). For every item card in the
// first order card it writes the measures to <out>/measure.json: the card, the gap g (7cqi), the three gaps (the foot to the speaker,
// the speaker to the divider, the divider to the English's ink as the game computed it: --wc14-ink), the divider's top and span, the
// English sizes, the tap areas (the speaker's ::after, the English's dots), and anything clipped, overlapping or outside its card.
// card-build-sheet.py makes the sheets and measures the last gap again off the pixels.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { startServer, launch, newPage, SIZES, sleep, BASE } from "../../sandbox/lib/env.mjs";
import { cookStation } from "../../sandbox/flows/cook.mjs";

const argv = process.argv.slice(2);
const val = (k, d) => { const i = argv.indexOf(`--${k}`); return i >= 0 ? argv[i + 1] : d; };
const OUT = val("out", "build/screenshots/card-build/raw");
const DPR = +val("dpr", 2);
SIZES["971x318"] = SIZES["971x318"] || { width: 971, height: 318, label: "Zafar's phone in a browser (with its bars)", touch: true };
SIZES["971x412"] = SIZES["971x412"] || { width: 971, height: 412, label: "Zafar's phone without the browser's banner", touch: true };
const sizes = val("sizes", "740x320,971x318,971x412,930x430,1280x665,1920x1080").split(",");
const states = val("states", "before,after").split(",");

// the written-in rows (only real Kutchi forms, Mum's recorded words; the chutneys' and "hakro khun"'s pictures are stand-ins)
const I = "/assets/cook/items/";
const CASES = {
  one: [["paani", "water"], ["chai", "chai"], ["dudh", "milk"], ["khun", "sugar"]],
  two: [["fudino ji chutney", "mint chutney", I + "icon-ph-lili.webp"], ["amli ji chutney", "tamarind chutney", I + "icon-ph-amli.webp"], ["hakro khun", "brown sugar", I + "icon-cook-khun.webp"], ["nair ji chutney", "coconut chutney", null]],
  mixed: [["fudino ji chutney", "mint chutney", I + "icon-ph-lili.webp"], ["chai", "chai"], ["hakro khun", "brown sugar", I + "icon-cook-khun.webp"], ["paani", "water"]],
};

// BEFORE: the class is taken off as soon as it is put on (the type's CSS, the drawn pills' face and weight and the row pass all key on it)
const OFF = `(() => { const strip = () => { const h = document.documentElement; if (h && h.classList.contains("njg-lora")) h.classList.remove("njg-lora"); };
  new MutationObserver(strip).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] }); strip(); })();`;
// Nani's box held shut while the side panel is shot (the game opens her help card again after a wait)
const SHUT = `body.njg-s14 #guide.ng-s14 .ng-help { grid-template-rows: 0fr !important; transition: none !important; }
  body.njg-s14 #guide.ng-s14 .ng-arrow svg { transform: none !important; }`;

function writeCase(rows) {
  const cards = [...document.querySelectorAll("#side .m-order > .oc-card:first-child .oc-row.oc-it14")];
  if (!window.__njgPics) window.__njgPics = Object.fromEntries(cards.map((c) => [c.querySelector(".wc14-k")?.textContent.trim(), c.querySelector("img.wc-img")?.getAttribute("src")]));
  if (!window.__njgOwn) window.__njgOwn = cards.map((c) => [c.querySelector(".wc14-k")?.textContent.trim(), c.querySelector(".wc14-en")?.textContent.trim(), c.querySelector("img.wc-img")?.getAttribute("src")]);
  const use = rows || window.__njgOwn;
  cards.forEach((c, i) => {
    const r = use[i]; if (!r) return;
    const k = c.querySelector(".wc14-k"), e = c.querySelector(".wc14-en"), img = c.querySelector("img.wc-img");
    if (k) k.textContent = r[0];
    if (e) e.textContent = r[1];
    const src = r[2] || window.__njgPics[r[0]] || window.__njgPics.khun || window.__njgPics.chai;
    if (img && src) img.setAttribute("src", src);
  });
  document.querySelectorAll("#side .oc-card.njg-mock-next").forEach((n) => n.remove());
  const first = document.querySelector("#side .m-order > .oc-card");
  if (first) { const n = first.cloneNode(true); n.classList.add("njg-mock-next"); first.after(n); }
  const m = document.querySelector("#mission"); if (m) m.scrollTop = 0;
  document.querySelectorAll("#side .oc-row14").forEach((r) => { r.scrollLeft = 0; });
}

function measure() {
  const f2 = (v) => +(+v).toFixed(2);
  const R = (b) => ({ x: f2(b.left), y: f2(b.top), w: f2(b.width), h: f2(b.height), b: f2(b.bottom), r: f2(b.right) });
  const side = document.querySelector("#side"), mission = document.querySelector("#mission");
  const out = { on: document.documentElement.classList.contains("njg-lora"), side: R(side.getBoundingClientRect()), items: [] };
  const c1 = document.querySelector("#side .m-order > .oc-card"), c2 = c1 && c1.nextElementSibling;
  if (!c1) return out;
  const p = parseFloat(getComputedStyle(side).getPropertyValue("--njg-p")) || 1, pxv = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--njg-px")) || 1;
  const mb = mission.getBoundingClientRect().bottom, fadeTop = mb - 22 * p * pxv;
  out.card1 = R(c1.getBoundingClientRect());
  if (c2 && c2.classList.contains("oc-card")) { const h = (c2.querySelector(".oc-headline") || c2.querySelector(".oc-head")).getBoundingClientRect(); out.nextHeadline = { clearOfFade: f2(fadeTop - h.bottom), whole: h.bottom <= mb + 0.5 }; }
  const row = c1.querySelector(".oc-row14"); if (!row) return out;
  const rb = row.getBoundingClientRect();
  for (const it of row.querySelectorAll(":scope > .oc-row.oc-it14")) {
    const b = it.getBoundingClientRect();
    const k = it.querySelector(".wc14-k"), en = it.querySelector(".wc14-en"), spk = it.querySelector(".wc14-spk"), slotE = it.querySelector(".wc14-slot-e"), dots = it.querySelector(".wc14-en-dots");
    const kb = k.getBoundingClientRect(), eb = en.getBoundingClientRect(), sb = spk.getBoundingClientRect();
    const cs = getComputedStyle(it), bf = getComputedStyle(it, "::before");
    const hasDiv = bf.content && bf.content !== "none" && bf.display !== "none";
    const divH = hasDiv ? parseFloat(bf.height) : 0, divW = hasDiv ? parseFloat(bf.width) : 0;
    const divTop = hasDiv ? sb.top - parseFloat(getComputedStyle(spk).marginTop) - divH : null;
    const ink = parseFloat(slotE.style.getPropertyValue("--wc14-ink")) || 0;
    const inkFoot = slotE.getBoundingClientRect().bottom - ink;
    const g = parseFloat(getComputedStyle(spk).marginBottom) + parseFloat(cs.borderBottomWidth);
    const sa = getComputedStyle(spk, "::after"), si = ["top", "right", "bottom", "left"].map((s) => parseFloat(sa[s]) || 0);
    const sHit = { t: sb.top + si[0], r: sb.right - si[1], b: sb.bottom - si[2], l: sb.left + si[3] };
    const dcs = dots ? getComputedStyle(dots) : null, di = dcs ? ["top", "right", "bottom", "left"].map((s) => parseFloat(dcs[s]) || 0) : [0, 0, 0, 0];
    const sl = slotE.getBoundingClientRect();
    const eHit = { t: sl.top + di[0], r: sl.right - di[1], b: sl.bottom - di[2], l: sl.left + di[3] };
    const xOver = Math.min(eHit.r, sHit.r) > Math.max(eHit.l, sHit.l);
    out.items.push({
      word: k.textContent.trim(), en: en.textContent.trim(), inView: b.right <= rb.right + 1, hidden: it.classList.contains("wc14-hide-en"), peek: en.classList.contains("wc14-peek"),
      card: R(b), kPx: f2(parseFloat(getComputedStyle(k).fontSize)), enPx: f2(parseFloat(getComputedStyle(en).fontSize)), kFace: getComputedStyle(k).fontFamily.split(",")[0].replace(/"/g, ""), kW: getComputedStyle(k).fontWeight,
      enFace: getComputedStyle(en).fontFamily.split(",")[0].replace(/"/g, ""), enW: getComputedStyle(en).fontWeight, enCol: getComputedStyle(en).color, enLines: Math.round(eb.height / (parseFloat(getComputedStyle(en).lineHeight) || 12)),
      spk: R(sb), g: f2(g), foot: f2(b.bottom - sb.bottom), spkToDiv: hasDiv ? f2(sb.top - (divTop + divH)) : null, divToInk: hasDiv ? f2(divTop - inkFoot) : null, divToBox: hasDiv ? f2(divTop - sl.bottom) : null,
      divTop: hasDiv ? f2(divTop) : null, divSpan: hasDiv ? [f2(b.left + b.width / 2 - divW / 2), f2(b.left + b.width / 2 + divW / 2)] : null, divH: f2(divH), ink: f2(ink), inkFoot: f2(inkFoot),
      enBox: R(eb), kBox: R(kb), spkHit: { w: f2(sHit.r - sHit.l), h: f2(Math.min(sHit.b, rb.bottom) - Math.max(sHit.t, rb.top)) }, hitOverlap: xOver ? f2(Math.max(0, eHit.b - sHit.t)) : 0,
      clipped: [k, en].some((e) => !it.classList.contains("wc14-hide-en") || e === k ? e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 2 : false),
      overlap: kb.bottom > eb.top + 0.5 || (hasDiv ? inkFoot > divTop + 0.5 || divTop + divH > sb.top + 0.5 : eb.bottom > sb.top + 0.5),
      outside: [kb, sb].some((x) => x.bottom > b.bottom + 0.5 || x.left < b.left - 0.5 || x.right > b.right + 0.5),
    });
  }
  const vis = out.items.filter((i) => i.inView);
  const spread = (a) => (a.length ? f2(Math.max(...a) - Math.min(...a)) : 0);
  out.row = { cardH: spread(out.items.map((i) => i.card.h)), divTop: spread(out.items.filter((i) => i.divTop != null).map((i) => i.divTop)), enPx: [...new Set(out.items.map((i) => i.enPx))],
    minDivToInk: out.items.length && out.items[0].divToInk != null ? Math.min(...out.items.map((i) => i.divToInk)) : null, vis: vis.length };
  return out;
}

const srv = await startServer();
const browser = await launch();
const data = {};
mkdirSync(OUT, { recursive: true });
const inject = (page, css) => page.evaluate((c) => { let s = document.getElementById("njg-card-build"); if (!s) { s = document.createElement("style"); s.id = "njg-card-build"; document.head.appendChild(s); } s.textContent = c; }, css);
const settle = async (page) => {
  await page.evaluate(() => (document.fonts && document.fonts.ready) || null).catch(() => {});
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  await page.evaluate(() => { const W = window.WordCard; if (W && W.fit14) W.fit14(); });
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  await sleep(120);
};
const shot = (page, path, clip) => page.screenshot({ path, ...(clip ? { clip } : {}), animations: "disabled" }).catch((e) => console.log("  shot", path, e.message.split("\n")[0]));
const box = (page, sel, pad = 0) => page.evaluate(([s, p]) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); if (!b.width) return null; const x = Math.max(0, b.left - p), y = Math.max(0, b.top - p); return { x, y, width: Math.min(innerWidth - x, b.width + 2 * p), height: Math.min(innerHeight - y, b.height + 2 * p) }; }, [sel, pad]);

async function atPopup(page, dir, st, size) {
  await page.waitForFunction(() => [...document.querySelectorAll(".wc14-big:not(.wc14-side) .wc14-en")].some((e) => e.getBoundingClientRect().width > 0), null, { timeout: 15000 }).catch(() => {});
  await sleep(450);
  await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
  await shot(page, join(dir, `${st}-order-screen.png`));
  const g = await box(page, "#guide", 4); if (g) await shot(page, join(dir, `${st}-nani-box.png`), g);
  const bub = await box(page, ".cv-bubble.in", 6); if (bub) await shot(page, join(dir, `${st}-bubble.png`), bub);
  // the pop-up flies into its row a moment later: a still copy pinned where it stands
  const ok = await page.evaluate(() => {
    const src = document.querySelector(".wc14-big:not(.wc14-side)"); if (!src) return false;
    const b = src.getBoundingClientRect();
    const big = src.cloneNode(true); big.classList.add("njg-mock-pop"); big.classList.remove("wc-pop", "wc14-flyer");
    Object.assign(big.style, { position: "fixed", left: b.left + "px", top: b.top + "px", width: b.width + "px", height: b.height + "px", margin: "0", zIndex: "9999", animation: "none", transform: "none" });
    document.body.appendChild(big); src.style.visibility = "hidden"; window.__njgPop = big; return true;
  });
  if (ok) {
    for (const [nm, k, e, pic] of [["own"], ["long", "fudino ji chutney", "mint chutney", "/assets/cook/items/icon-ph-lili.webp"]]) {
      if (k) await page.evaluate(([k, e, pic]) => { const p = window.__njgPop; p.querySelector(".wc14-k").textContent = k; p.querySelector(".wc14-en").textContent = e; const im = p.querySelector("img.wc-img"); if (im) im.setAttribute("src", pic); }, [k, e, pic]);
      await settle(page);
      const m = await page.evaluate(() => { const p = window.__njgPop; const k = p.querySelector(".wc14-k"), e = p.querySelector(".wc14-en"); const f = (x) => ({ px: parseFloat(getComputedStyle(x).fontSize), face: getComputedStyle(x).fontFamily.split(",")[0], w: getComputedStyle(x).fontWeight, clipped: x.scrollWidth > x.clientWidth + 1 || x.scrollHeight > x.clientHeight + 2 }); return { k: f(k), en: f(e), gapKE: +(e.getBoundingClientRect().top - k.getBoundingClientRect().bottom).toFixed(2) }; });
      data[`${size}|${st}|popup-${nm}`] = m;
      const c = await box(page, ".njg-mock-pop", 10); if (c) await shot(page, join(dir, `${st}-popup-${nm}.png`), c);
    }
    await page.evaluate(() => { document.querySelectorAll(".njg-mock-pop").forEach((n) => n.remove()); document.querySelectorAll(".wc14-big").forEach((n) => { n.style.visibility = ""; }); });
  }
}

async function atShelf(page, dir, st, size) {
  await sleep(500);
  await shot(page, join(dir, `${st}-shelf-screen.png`));
  const play = await box(page, "#stage", 0) || await box(page, "#game", 0); if (play) await shot(page, join(dir, `${st}-shelf.png`), play);
  await page.evaluate(() => { try { window.Cook.UI.helperOpen(false, { by: "quiet" }); } catch (e) { /* the class alone */ } const g = document.querySelector("#guide"); if (g) g.classList.remove("ng-open"); });
  await inject(page, SHUT); await sleep(700);
  for (const cs of ["game", "one", "two", "mixed"]) {
    await page.evaluate(`(${writeCase.toString()})(${JSON.stringify(cs === "game" ? null : CASES[cs])})`);
    await settle(page);
    data[`${size}|${st}|${cs}`] = await page.evaluate(`(${measure.toString()})()`);
    const s = data[`${size}|${st}|${cs}`].side;
    await shot(page, join(dir, `${st}-panel-${cs}.png`), { x: 0, y: 0, width: Math.ceil(s.r) + 2, height: Math.ceil(s.b) });
  }
  // the English hidden (its dots), then one card's English peeking as the game does it (word-card.js reveal: .wc14-peek .revealed, its dots .wc14-gone)
  for (const cs of ["mixed", "two"]) {
    await page.evaluate(`(${writeCase.toString()})(${JSON.stringify(CASES[cs])})`);
    for (const ph of ["hidden", "peek"]) {
      await page.evaluate(([ph, pi]) => document.querySelectorAll("#side .m-order > .oc-card .oc-row.oc-it14").forEach((c, i) => {
        c.classList.add("wc14-hide-en"); const on = ph === "peek" && i % 4 === pi;
        const e = c.querySelector(".wc14-en"), d = c.querySelector(".wc14-en-dots");
        if (e) { e.classList.toggle("wc14-peek", on); e.classList.toggle("revealed", on); }
        if (d) d.classList.toggle("wc14-gone", on);
      }), [ph, cs === "two" ? 1 : 0]);
      await settle(page);
      data[`${size}|${st}|${ph}-${cs}`] = await page.evaluate(`(${measure.toString()})()`);
      const s = data[`${size}|${st}|${ph}-${cs}`].side;
      await shot(page, join(dir, `${st}-panel-${ph}-${cs}.png`), { x: 0, y: 0, width: Math.ceil(s.r) + 2, height: Math.ceil(s.b) });
    }
    await page.evaluate(() => document.querySelectorAll("#side .oc-row.oc-it14").forEach((c) => { c.classList.remove("wc14-hide-en"); c.querySelector(".wc14-en")?.classList.remove("wc14-peek", "revealed"); c.querySelector(".wc14-en-dots")?.classList.remove("wc14-gone"); }));
  }
  // the next card's headline against the list's soft foot, the tightest case (all two lines) already measured; back to the game's own
  await page.evaluate(`(${writeCase.toString()})(null)`);
  await inject(page, "");
}

async function runChai(size, st) {
  const dir = join(OUT, size); mkdirSync(dir, { recursive: true });
  const np = await newPage(browser, size, { dpr: DPR });
  if (st === "before") await np.ctx.addInitScript(OFF);
  const page = np.page, done = new Set();
  const rec = {
    names: new Map(),
    async state(name, o = {}) {
      if (o.settle) await page.waitForTimeout(o.settle);
      if (name === "order-card-big" && !done.has("popup")) { done.add("popup"); await atPopup(page, dir, st, size); }
      if (name === "view-marble" && !done.has("shelf")) { done.add("shelf"); await atShelf(page, dir, st, size); throw new Error("enough states"); }
      return name;
    },
    note() {}, pend() {}, stop(m) { throw new Error(m); },
  };
  const t0 = Date.now();
  try { await cookStation("chai-tray", 1).run({ page, rec, timeoutMs: 300000, profile: "seen" }); } catch (e) { if (!/enough states/.test(e.message)) console.log(`  ${size} ${st}: ${e.message.split("\n")[0]}`); }
  if (np.errors.length) console.log(`  ${size} ${st}: page errors: ${np.errors.slice(0, 3).join(" | ")}`);
  console.log(`  ${size} ${st}: ${Math.round((Date.now() - t0) / 1000)} s, ${[...done].join(",")}`);
  await np.ctx.close();
}

async function runWordMoment(size, st) {
  const dir = join(OUT, size); mkdirSync(dir, { recursive: true });
  const np = await newPage(browser, size, { dpr: DPR }), p = np.page;
  await p.goto(`${BASE}/lab/word-moment.html?at=end`, { waitUntil: "load" });
  // (the lab page links its sheets one by one, not through the kit: the fonts sheet added, and the type turned on as chai does)
  await p.addStyleTag({ content: ".bar { display: none !important; }" });
  if (st === "after") { await p.addStyleTag({ url: `${BASE}/css/shared/fonts.css` }); await p.evaluate(() => document.documentElement.classList.add("njg-lora")); await p.evaluate(() => document.fonts.load('600 20px "Lora"')).catch(() => {}); }
  await p.evaluate(() => window.dispatchEvent(new Event("resize")));
  await sleep(1500);
  await settle(p);
  await shot(p, join(dir, `${st}-word-moment.png`));
  await np.ctx.close();
}

for (const size of sizes) for (const st of states) { await runChai(size, st); if (!argv.includes("--no-wm")) await runWordMoment(size, st); }
writeFileSync(join(OUT, "measure.json"), JSON.stringify(data, null, 1));
await browser.close();
srv.close();

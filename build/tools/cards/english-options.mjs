#!/usr/bin/env node
// Card English size study (6 Nov, SH-222). Mock only: each option is CSS injected into the page at the moment shot; no game file changes.
//   COOK_TEST_PORT=8852 flock -w 900 /tmp/njg-browser-8852.lock node build/tools/cards/english-options.mjs [--out build/screenshots/cards]
// Plays chai L1 (the fair player) at five sizes; at the order pop-up and at the shelf view (the order card's items in the side panel)
// it measures every card with English under a Kutchi word, today and under each option, and shoots the screen.
// Writes <out>/<size>/<option>-<state>.png and <out>/measure.json
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { startServer, launch, newPage, SIZES, sleep } from "../../sandbox/lib/env.mjs";
import { cookStation } from "../../sandbox/flows/cook.mjs";
import { OPTIONS as FONTS } from "../fonts/options-b.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const val = (k, d) => { const i = argv.indexOf(`--${k}`); return i >= 0 ? argv[i + 1] : d; };
const OUT = val("out", join(HERE, "..", "..", "screenshots", "cards"));
// --long "kutchi|english": write that word onto the first item card and the pop-up card before shooting (a long word that may wrap)
const LONG = val("long", null);
const ONLY = val("only", null);
const sizes = val("sizes", "740x320,930x430,1280x665,1920x1080,971x318").split(",");
if (!SIZES["971x318"]) SIZES["971x318"] = { width: 971, height: 318, label: "Zafar's phone in a browser", touch: true };
const px = (n) => `calc(var(--njg-px) * ${n})`;

// the options, phones only where they move anything (the big screens already show 12 px or more; each keeps the cards' outer boxes; the study measures whether the item card's height holds)
export const OPTIONS = {
  before: "",
  // 1: a fixed 12 px floor for the English only; nothing else moves (the item cards grow by the English's extra height)
  floor12: `
    .wc14-it .wc14-en { font-size: clamp(${px(12)}, 10cqi, max(${px(12)}, var(--njg-card14-u19))) !important; }`,
  // 2: 12 px English, its room taken from the gaps around it: the Kutchi up (its gap above 6 -> 3cqi), the speaker's gap above it
  //    (5 -> 2.5cqi), the English set tight (line-height 1); the card's height holds
  nudge: `@media (max-height: 500px) {
    .wc14-it .wc14-en { font-size: clamp(${px(12)}, 10cqi, max(${px(12)}, var(--njg-card14-u19))) !important; line-height: 1 !important; }
    .wc14-it > .wc14-slot-k { margin-top: 3cqi !important; }
    .wc14-it > .wc14-spk { margin-top: 2.5cqi !important; } }`,
  // 2b (6 Nov, Zafar's long-word test "fudino ji chutney"): option 2, but the English's size is not forced (no !important), so the card's
  //    own fit (word-card.js fitOne14) shrinks a long English to 10 px on one line before it would wrap; the card's height holds
  nudgefit: `@media (max-height: 500px) {
    body #side .wc14-it .wc14-en, body .wc14-it .wc14-en { font-size: clamp(${px(12)}, 10cqi, max(${px(12)}, var(--njg-card14-u19))); line-height: 1 !important; }
    .wc14-it > .wc14-slot-k { margin-top: 3cqi !important; }
    .wc14-it > .wc14-spk { margin-top: 2.5cqi !important; } }`,
  // the new card (Zafar, 6 Nov: yes to 2b and to Lora): option 2b plus the Lora option (fonts-sample-2026-11-06.md option 1)
  get newcard() { return FONTS.L.faces.replaceAll("__MOCKFONTS__", "/build/tools/fonts/woff2") + "\n" + FONTS.L.css + "\n" + this.nudgefit; },
  // 3: a gentler 11 px floor, the Kutchi up a little; the card's height holds
  floor11: `@media (max-height: 500px) {
    .wc14-it .wc14-en { font-size: clamp(${px(11)}, 10cqi, max(${px(11)}, var(--njg-card14-u19))) !important; line-height: 1.05 !important; }
    .wc14-it > .wc14-slot-k { margin-top: 3cqi !important; }
    .wc14-it > .wc14-spk { margin-top: 4cqi !important; } }`,
  // 4: 13 px English: option 2's gaps plus the speaker drawn at the panel's 30 px floor (today 31.7 on phones; its 48 px tap area stays)
  big13: `@media (max-height: 500px) {
    .wc14-it .wc14-en { font-size: clamp(${px(13)}, 10cqi, max(${px(13)}, var(--njg-card14-u19))) !important; line-height: 1 !important; }
    .wc14-it > .wc14-slot-k { margin-top: 3cqi !important; }
    .wc14-it > .wc14-spk { margin-top: 2.5cqi !important; }
    body.njg-s14 #side .oc-row.oc-it14 > .oc-spk.wc14-spk { width: clamp(${px(30)}, 32cqi, max(${px(30)}, var(--njg-card14-u60))) !important; } }`,
};

// every visible English under a Kutchi word: its card, the Kutchi and the speaker, the free room, any clipping or overlap
function measure() {
  const r = (e) => { const b = e.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width * 10) / 10, h: Math.round(b.height * 10) / 10 }; };
  const fs = (e) => Math.round(parseFloat(getComputedStyle(e).fontSize) * 10) / 10;
  const out = [];
  for (const en of document.querySelectorAll(".wc14-en")) {
    const eb = en.getBoundingClientRect();
    if (!eb.width || getComputedStyle(en).visibility === "hidden" || !en.textContent.trim()) continue;
    const card = en.closest(".wc14-it, .wc14-big, .wc14, .wc"); if (!card) continue;
    const kind = card.matches(".wc14-it") ? "item" : card.matches(".wc14-side") ? "helper" : card.matches(".wc14-big") ? "pop-up" : "card";
    const k = card.querySelector(".wc14-k"), spk = card.querySelector(".wc14-spk");
    const cb = card.getBoundingClientRect();
    const clipped = [en, k].filter(Boolean).some((e) => e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 2);
    const sb = spk && spk.getBoundingClientRect();
    out.push({
      kind, word: k ? k.textContent.trim() : "", en: en.textContent.trim(), enPx: fs(en), enH: Math.round(eb.height * 10) / 10,
      card: r(card), kPx: k ? fs(k) : null, k: k ? r(k) : null, enBox: r(en), spk: sb ? r(spk) : null,
      padTop: k ? Math.round((k.getBoundingClientRect().top - (card.querySelector(".wc14-pic") || card).getBoundingClientRect().bottom) * 10) / 10 : null,
      gapKtoEn: k ? Math.round((eb.top - k.getBoundingClientRect().bottom) * 10) / 10 : null,
      gapEnToSpk: sb ? Math.round((sb.top - eb.bottom) * 10) / 10 : null,
      foot: sb ? Math.round((cb.bottom - sb.bottom) * 10) / 10 : Math.round((cb.bottom - eb.bottom) * 10) / 10,
      overlap: sb ? sb.top < eb.bottom - 0.5 && sb.left < eb.right && sb.right > eb.left : false,
      outside: eb.bottom > cb.bottom + 0.5 || (sb ? sb.bottom > cb.bottom + 0.5 : false), clipped,
    });
  }
  return out;
}

const srv = await startServer();
const browser = await launch();
const data = {};
mkdirSync(OUT, { recursive: true });

async function applyAndShoot(page, size, state) {
  const dir = join(OUT, size); mkdirSync(dir, { recursive: true });
  if (LONG) await page.evaluate((w) => {
    const [kw, ew] = w.split("|");
    for (const card of [document.querySelector("#side .wc14-it, .wc14-it"), document.querySelector(".wc14-big")].filter(Boolean)) {
      const k = card.querySelector(".wc14-k"), e = card.querySelector(".wc14-en");
      if (k) k.textContent = kw;
      if (e) e.textContent = ew;
    }
  }, LONG);
  for (const [name, css] of Object.entries(OPTIONS).filter(([n]) => !ONLY || ONLY.split(",").includes(n))) {
    await page.evaluate((c) => { let s = document.getElementById("njg-mock-cards"); if (!s) { s = document.createElement("style"); s.id = "njg-mock-cards"; document.head.appendChild(s); } s.textContent = c; }, css);
    await page.evaluate(() => new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res))));
    await page.evaluate(() => (document.fonts && document.fonts.ready) || null).catch(() => {});
    await sleep(250);
    await page.evaluate(() => { const W = window.WordCard; if (W && W.fit14) W.fit14(); });
    await page.evaluate(() => new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res))));
    await sleep(150);
    data[`${size}|${state}|${name}`] = await page.evaluate(`(${measure.toString()})()`);
    await page.screenshot({ path: join(dir, `${name}-${state}.png`), animations: "disabled" }).catch(() => {});
  }
  await page.evaluate(() => { const s = document.getElementById("njg-mock-cards"); if (s) s.textContent = ""; });
}

async function runSize(size) {
  const np = await newPage(browser, size, { dpr: +(val("dpr", 1)) });
  const page = np.page, done = new Set();
  const rec = {
    names: new Map(),
    async state(name, o = {}) {
      if (o.settle) await page.waitForTimeout(o.settle);
      if (name === "order-card-big" && !done.has("popup")) {
        await page.waitForFunction(() => [...document.querySelectorAll(".wc14-big .wc14-en")].some((e) => e.getBoundingClientRect().width > 0), null, { timeout: 15000 }).then(() => page.waitForTimeout(400)).catch(() => {});
        done.add("popup"); await applyAndShoot(page, size, "popup");
      }
      if (name === "view-marble" && !done.has("panel")) { await page.waitForTimeout(400); done.add("panel"); await applyAndShoot(page, size, "panel"); throw new Error("enough states"); }
      return name;
    },
    note() {}, pend() {}, stop(m) { throw new Error(m); },
  };
  const t0 = Date.now();
  try { await cookStation("chai-tray", 1).run({ page, rec, timeoutMs: 240000, profile: "seen" }); } catch (e) { if (!/enough states/.test(e.message)) console.log(`  ${size}: ${e.message.split("\n")[0]}`); }
  console.log(`  ${size}: ${Math.round((Date.now() - t0) / 1000)} s, states ${[...done].join(",")}`);
  await np.ctx.close();
}

await Promise.all(sizes.map(runSize));
writeFileSync(join(OUT, "measure.json"), JSON.stringify(data, null, 1));
await browser.close();
srv.close();

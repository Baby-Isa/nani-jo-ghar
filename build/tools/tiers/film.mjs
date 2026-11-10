#!/usr/bin/env node
// A page's first minute, filmed (check-prototype's first-play film, check-live's strip on the live site): open the page at one
// size, optionally tap what the game asks for (njgTest's expectation, as a fair new player would), record a video and/or a frame
// every few seconds, and count the page errors. Pictures and a count only: the eyes judge the film (Zafar, 9 Nov: "the first few
// seconds"). Local pages go through the sandbox's own server (its fonts, no network); --url opens a live page as a phone would.
//   node build/tools/tiers/film.mjs (--page <path?query> | --url <https://...>) --out <dir> [--size 740x320] [--seconds 40]
//                                   [--every 5] [--video] [--play]
import { mkdirSync, writeFileSync, readdirSync, renameSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { args } from "../review/lib/common.mjs";

const a = args();
const out = a.val("out"), size = a.val("size", "740x320"), seconds = +a.val("seconds", 40), every = +a.val("every", 0);
if (!out || !(a.val("page") || a.val("url"))) { console.log("node build/tools/tiers/film.mjs (--page <path?query> | --url <url>) --out <dir> [--size 740x320] [--seconds 40] [--every 5] [--video] [--play]"); process.exit(2); }
mkdirSync(out, { recursive: true });
const env = await import("../../sandbox/lib/env.mjs");
const [w, h] = size.split("x").map(Number);
const browser = await env.launch();
let srv = null, ctx, page;
let errors = [];
const video = a.has("video") ? { recordVideo: { dir: join(out, "video-tmp"), size: { width: w, height: h } } } : {};
if (a.val("url")) {
  ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: h < 500, isMobile: h < 500, ...video });
  page = await ctx.newPage();
  page.on("pageerror", (e) => { if (!/ResizeObserver loop/.test(String(e.message || e))) errors.push(String(e.message || e).slice(0, 300)); });
  page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource|net::ERR/.test(m.text())) errors.push(`console: ${m.text().slice(0, 300)}`); });
} else {
  srv = await env.startServer();
  if (a.has("video")) process.env.NJG_VIDEO = join(out, "video-tmp");
  const np = env.SIZES[size] ? await env.newPage(browser, size) : null;
  if (np) { ctx = np.ctx; page = np.page; errors = np.errors; } // (the sandbox's own error list: page errors and console errors)
  else {
    ctx = await browser.newContext({ viewport: { width: w, height: h }, ...video }); page = await ctx.newPage();
    page.on("pageerror", (e) => { if (!/ResizeObserver loop/.test(String(e.message || e))) errors.push(String(e.message || e).slice(0, 300)); });
  }
}
const url = a.val("url") || `${env.BASE}/${a.val("page").replace(/^\//, "")}`;
let loaded = true;
await page.goto(url, { waitUntil: "load", timeout: 60000 }).catch((e) => { loaded = false; errors.push(`load: ${String(e.message || e).split("\n")[0]}`); });
const frames = [], t0 = Date.now();
let next = 0, taps = 0;
while (loaded && Date.now() - t0 < seconds * 1000) {
  if (every && Date.now() - t0 >= next) { const f = join(out, `frame-${String(frames.length).padStart(2, "0")}.png`); await page.screenshot({ path: f }).catch(() => {}); frames.push(f); next += every * 1000; }
  if (a.has("play")) {
    const g = await page.evaluate(() => { const T = window.njgTest; const e = T && T.cook && T.cook.expectation ? T.cook.expectation() : null; if (!e || e.kind !== "click" || !e.selector) return null; const el = document.querySelector(e.selector); const r = el && el.getBoundingClientRect(); return r && r.width > 2 ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null; }).catch(() => null);
    if (g) { await page.mouse.click(g.x, g.y).catch(() => {}); taps++; }
  }
  await page.waitForTimeout(400);
}
const vid = a.has("video") && page.video ? page.video() : null;
await ctx.close();
let film = null;
if (vid) { try { film = join(out, "film.webm"); await vid.saveAs(film); await vid.delete(); } catch (e) { film = null; } }
await browser.close();
if (srv) srv.close();
let strip = null;
if (frames.length) { const r = spawnSync("python3", [join(env.ROOT, "build/tools/tiers/pairs.py"), "--strip", out, join(out, "strip.jpg")], { encoding: "utf8" }); if (r.status === 0) strip = join(out, "strip.jpg"); }
const res = { url, size, seconds, loaded, errors, taps, frames: frames.length, film, strip };
writeFileSync(join(out, "film.json"), JSON.stringify(res, null, 1));
console.log(`film: ${url} at ${size}, ${seconds} s, ${loaded ? "loaded" : "DID NOT LOAD"}, ${errors.length} page error(s)${taps ? `, ${taps} taps` : ""}${film ? `; ${film}` : ""}${strip ? `; ${strip}` : ""}`);
for (const e of errors.slice(0, 8)) console.log(`  ${e}`);
process.exit(loaded && !errors.length ? 0 : 1);

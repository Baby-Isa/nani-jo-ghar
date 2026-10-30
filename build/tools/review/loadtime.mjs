#!/usr/bin/env node
// S14 tools, B6 (SH-168; CHAI-44): the time and the bytes from the page to the first play tap, per game, on lab.html (Zafar's route), on a
// set slow line (so the time is mostly the bytes and the requests, not this machine). A baseline keeps each game's numbers; a growth of
// 20% or more fails (lib/loadtime.mjs).
//   node build/tools/review/loadtime.mjs [--games chai-tray,fetch] [--level 3] [--size 930x430] [--net 4000/60] [--runs 2]
//                                        [--record] [--label branch] [--root <repo>] [--json]
//   --record   write the numbers into the baseline (build/tools/review/data/loadtime-baseline.json) instead of judging them
//   --root     measure another checkout (a worktree of main): its game files, this tool's measure
// Under the browser lock, on your own port (COOK_TEST_PORT). Exit 1 on a growth.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { args, help, ROOT as TOOLS_ROOT } from "./lib/common.mjs";
import { isPlayTap, judgeLoad, keyOf, kb } from "./lib/loadtime.mjs";

const a = args();
help("node build/tools/review/loadtime.mjs [--games chai-tray,fetch] [--level 3] [--size 930x430] [--net 4000/60] [--runs 2] [--record] [--label x] [--root <repo>] [--json]\n  load time and bytes to the first play tap per game (lab.html), a baseline, a growth of 20% fails (SH-168, CHAI-44)", a);
const REPO = a.val("root") || TOOLS_ROOT;
const GAMES = (a.val("games") || "chai-tray").split(",");
const LEVEL = +(a.val("level") || 3), SIZE = a.val("size") || "930x430", NET = a.val("net") || "4000/60", RUNS = +(a.val("runs") || 2);
const FILE = join(TOOLS_ROOT, "build", "tools", "review", "data", "loadtime-baseline.json");
const [KBPS, LAT] = NET.split("/").map(Number);

// the sandbox's own server and browser, on the checkout asked for
const env = await import(join(REPO, "build", "sandbox", "lib", "env.mjs"));
const { startServer, launch, newPage, BASE, sleep } = env;

async function measure(browser, game) {
  const { page, ctx } = await newPage(browser, SIZE, { seed: 1 });
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: LAT, downloadThroughput: (KBPS * 1000) / 8, uploadThroughput: (KBPS * 1000) / 8 });
  let bytes = 0, requests = 0, stopped = false;
  const sizes = new Map();
  cdp.on("Network.requestWillBeSent", (e) => { if (!stopped) { requests++; sizes.set(e.requestId, e.request.url); } });
  cdp.on("Network.loadingFinished", (e) => { if (!stopped) bytes += e.encodedDataLength || 0; });
  const t0 = Date.now();
  await page.goto(`${BASE}/lab.html?mode=cook&game=${game}&level=${LEVEL}&nonav=1&seed=7&speed=3`, { waitUntil: "commit" });
  let hooked = false, ms = null;
  while (Date.now() - t0 < 120000) {
    if (!hooked) {
      const st = await page.evaluate("window.njgTest ? String(njgTest.state()) : 'loading'").catch(() => "loading");
      if (/\/playing/.test(st)) { await page.evaluate(() => import("./js/cook/mount.js").then((m) => { (window.njgTest = window.njgTest || {}).cook = m.Cook.testHook; window.Cook = m.Cook; })).catch(() => {}); hooked = true; }
    }
    if (hooked) {
      const e = await page.evaluate(() => { const T = window.njgTest; const x = T && T.cook && T.cook.expectation ? T.cook.expectation() : null; return x ? { kind: x.kind, selector: x.selector || "", intro: !!x.intro } : null; }).catch(() => null);
      if (isPlayTap(e)) { ms = Date.now() - t0; stopped = true; break; }
      // a child's way to it: the greeting's answer, then a tap on the order's pop-up
      if (e && e.kind === "click" && /^#choices/.test(e.selector)) { const g = await page.evaluate((s) => { const el = document.querySelector(s); const r = el && el.getBoundingClientRect(); return r && r.width > 2 ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null; }, e.selector).catch(() => null); if (g) await page.mouse.click(g.x, g.y).catch(() => {}); }
      else if (await page.$(".njg-rq-veil:not(.going)")) await page.click(".njg-rq-veil:not(.going)", { force: true, timeout: 1500, position: { x: 8, y: 8 } }).catch(() => {});
    }
    await sleep(100);
  }
  await ctx.close().catch(() => {});
  return ms == null ? null : { ms, bytes, requests };
}

const srv = await startServer();
const browser = await launch();
const out = {};
try {
  for (const g of GAMES) {
    const runs = [];
    for (let i = 0; i < RUNS; i++) { const r = await measure(browser, g); if (r) runs.push(r); }
    if (!runs.length) { out[g] = null; console.log(`${g}: never reached a play tap in 120 s`); continue; }
    runs.sort((x, y) => x.ms - y.ms);
    const mid = runs[Math.floor(runs.length / 2)];   // the middle run's time; its bytes (bytes barely vary)
    out[g] = { ms: mid.ms, bytes: Math.max(...runs.map((r) => r.bytes)), requests: mid.requests };
  }
} finally { await browser.close(); srv.close(); }

const base = existsSync(FILE) ? JSON.parse(readFileSync(FILE, "utf8")) : {};
let bad = 0;
const label = a.val("label") || "";
for (const g of GAMES) {
  const k = keyOf(g, LEVEL, SIZE, NET), now = out[g];
  if (!now) { bad++; continue; }
  if (a.has("record")) { base[k] = { ...now, label, date: new Date().toISOString().slice(0, 16) }; console.log(`${k}: ${now.ms} ms, ${kb(now.bytes)}, ${now.requests} requests: recorded${label ? ` (${label})` : ""}`); continue; }
  const v = judgeLoad(base[k], now);
  if (v.ok === false) bad++;
  console.log(`${k}: ${now.ms} ms, ${kb(now.bytes)}, ${now.requests} requests: ${v.ok === null ? v.why : v.ok ? "ok, " + v.why : "FAIL, " + v.why}`);
}
if (a.has("record")) { mkdirSync(dirname(FILE), { recursive: true }); writeFileSync(FILE, JSON.stringify(base, null, 1) + "\n"); }
if (a.has("json")) console.log(JSON.stringify(out));
process.exit(bad ? 1 : 0);

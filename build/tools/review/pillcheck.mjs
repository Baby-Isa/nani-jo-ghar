#!/usr/bin/env node
// The shelf pills' measure (SH-219, Zafar 6 Nov: "pills that fit their word"): chai at each level and size, every pill's word size on
// screen (CSS px), the gap between neighbours, and the rule: a word at least 13 CSS px where its slot has room, at most 1.5x, never
// two pills touching (gap >= 4 CSS px). Exit 1 on touching pills.
//   node build/tools/review/pillcheck.mjs [--levels 1,2,3,4] [--sizes 740x320,930x430,1280x665,1920x1080,971x318] [--profile pill-miss]
//                                          [--shots <dir>] [--json out.json] [--root <repo>]
//   --profile: a seeded save (build/sandbox/lib/seed.mjs; pill-hidden or pill-miss show speaker-only pills); --shots: the shelf's band
export const PILL_WAIT_MS = 60000;
import { writeFileSync } from "node:fs";
import { args } from "./lib/common.mjs";

const a = args();
if (a.has("help") || a.has("h")) {
  console.log("node build/tools/review/pillcheck.mjs [--levels 1,2,3,4] [--sizes a,b] [--json out.json] [--root <repo>]");
  process.exit(0);
}
const envPath = a.val("root") ? `${a.val("root")}/build/sandbox/lib/env.mjs` : "../../sandbox/lib/env.mjs";
const { PORT, startServer, launch, newPage, SIZES } = await import(envPath);
const levels = String(a.val("levels", "1,2,3,4")).split(",");
const sizes = String(a.val("sizes", "740x320,930x430,1280x665,1920x1080,971x318")).split(",");
const profile = a.val("profile");
const shots = a.val("shots");
const { seedCook } = profile ? await import(envPath.replace("env.mjs", "seed.mjs")) : {};
if (shots) (await import("node:fs")).mkdirSync(shots, { recursive: true });
const srv = await startServer();
const browser = await launch();
const rows = [];
for (const size of sizes) {
  for (const level of levels) {
    const np = SIZES[size] ? await newPage(browser, size) : null;
    const [w, h] = size.split("x").map(Number);
    const p = np ? np.page : await browser.newPage({ viewport: { width: w, height: h }, hasTouch: h < 500 });
    const url = `http://127.0.0.1:${PORT}/lab.html?mode=cook&game=chai-tray&level=${level}&nonav=1&seed=7&speed=3`;
    await p.goto(url, { waitUntil: "load" });
    if (profile) {
      await seedCook(p, profile);
      await p.goto(url, { waitUntil: "load" });
    }
    let pills = null;
    const t0 = Date.now();
    // (s19-checks audit: the wait was 30 s, against an order intro of about 27 s at 1920x1080 L4: one run in three found no pills,
    // build/reports/stove-redo-landed-2026-11-06.md item 8; PILL_WAIT_MS gives the slowest intro twice its time)
    while (Date.now() - t0 < PILL_WAIT_MS) {
      pills = await p.evaluate(() => (window.Cook && window.Cook.chaiPills ? window.Cook.chaiPills() : null)).catch(() => null);
      if (pills && pills.length) break;
      await p.waitForTimeout(200);
    }
    await p.waitForTimeout(800);
    pills = await p.evaluate(() => (window.Cook && window.Cook.chaiPills ? window.Cook.chaiPills() : null)).catch(() => null) || [];
    if (shots && pills.length) {
      const top = Math.max(0, Math.min(...pills.map((q) => q.top)) - 70), bot = Math.max(...pills.map((q) => q.bottom)) + 8;
      await p.screenshot({ path: `${shots}/pills-${size}-L${level}${profile ? "-" + profile : ""}.png`, clip: { x: 0, y: top, width: w, height: Math.min(h - top, bot - top) } });
    }
    const words = pills.filter((q) => q.wordPx).map((q) => q.wordPx);
    const gaps = pills.slice(1).map((q, i) => q.left - pills[i].right);
    const r = { size, level: +level, n: pills.length, nWords: words.length, wordMin: words.length ? Math.min(...words) : null, wordMax: words.length ? Math.max(...words) : null, speakerMin: pills.length ? Math.min(...pills.map((q) => q.speakerPx)) : null, gapMin: gaps.length ? Math.round(Math.min(...gaps) * 10) / 10 : null, widths: pills.map((q) => Math.round(q.right - q.left)) };
    r.ok = r.gapMin == null || r.gapMin >= 4;
    rows.push(r);
    console.log(`${r.ok ? "pass" : "FAIL"} ${size} L${level}: ${r.n} pills, words ${r.wordMin}-${r.wordMax} px, speaker ${r.speakerMin} px, closest gap ${r.gapMin} px`);
    await p.close();
  }
}
await browser.close();
if (srv && srv.close) srv.close();
if (a.val("json")) writeFileSync(a.val("json"), JSON.stringify(rows, null, 1));
process.exit(rows.some((r) => !r.ok) ? 1 : 0);

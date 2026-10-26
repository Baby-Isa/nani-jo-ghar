#!/usr/bin/env node
// Every request each live page makes in its first seconds, and every file it asks for more than once (S13-V, CK-48: "no data file
// is fetched twice on any live page"). Opens each page fresh (storage cleared), waits, counts by path (the version stamp left out).
//   COOK_TEST_PORT=8864 flock -w 1800 /tmp/njg-browser-8864.lock node build/sandbox/netcount.mjs [--wait 8000] [--out file]
// Exit 1 when a page asks for any data/*.json twice.
import { writeFileSync } from "node:fs";
import { startServer, launch, newPage, BASE, sleep } from "./lib/env.mjs";

const argv = process.argv.slice(2);
const val = (k, d) => { const i = argv.indexOf(k); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const WAIT = +val("--wait", "8000");
export const PAGES = ["index.html", "first.html", "day.html", "cook.html", "clinic.html", "lab.html"];

const srv = await startServer();
const browser = await launch();
const rows = [];
let twice = 0;
for (const p of PAGES) {
  const { page, ctx } = await newPage(browser, "1366x768");
  const seen = new Map();
  page.on("request", (r) => {
    const u = r.url();
    if (!u.startsWith(BASE)) return;
    const path = u.slice(BASE.length + 1).replace(/\?.*$/, "");
    seen.set(path, (seen.get(path) || 0) + 1);
  });
  await page.goto(`${BASE}/${p}`, { waitUntil: "load" }).catch(() => {});
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  seen.clear();
  await page.goto(`${BASE}/${p}`, { waitUntil: "load" }).catch(() => {});
  await sleep(WAIT);
  const all = [...seen.values()].reduce((a, b) => a + b, 0);
  const dup = [...seen.entries()].filter(([, n]) => n > 1);
  const dupData = dup.filter(([f]) => /^data\/.+\.json$/.test(f));
  twice += dupData.length;
  rows.push(`| ${p} | ${all} | ${seen.size} | ${dup.length ? dup.map(([f, n]) => `${f} x${n}`).join(", ") : "none"} |`);
  await ctx.close();
}
await browser.close();
srv.close();
const text = `| page | requests | files | asked for more than once |\n|---|---|---|---|\n${rows.join("\n")}\n`;
if (val("--out")) writeFileSync(val("--out"), text);
process.stdout.write(text);
process.exit(twice ? 1 : 0);

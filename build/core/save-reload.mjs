#!/usr/bin/env node
// S13-V task 5's proof in the browser: one profile keeps its progress through first launch (character, Nani's pantry round and the
// chai round in Cook), a clinic round (the clinic's own Clinic.Run.save, as a morning does), and a reload of the house. After each
// step the page's own window.Save (the one save, js/core/save.js) is read back as text; the house is then reloaded and read again.
// Exit 1 when anything written before the reload is missing after it. Text only (no pictures).
//   COOK_TEST_PORT=8864 flock -w 1800 /tmp/njg-browser-8864.lock timeout 900 node build/core/save-reload.mjs [--out file]
import { writeFileSync } from "node:fs";
import { BASE, startServer, launch, newPage } from "../sandbox/lib/env.mjs";
import { firstLaunch } from "../sandbox/flows/first.mjs";

const argv = process.argv.slice(2);
const out = argv.includes("--out") ? argv[argv.indexOf("--out") + 1] : null;
const rec = { states: [], stops: [], notes: [], async state() {}, note(n) { this.notes.push(n); }, stop(s) { this.stops.push(s); } };
const READ = () => {
  const S = window.Save;
  if (!S) return { error: "no window.Save" };
  S.init();
  const p = S.current();
  const cook = S.get("cook") || {};
  return {
    module: S.lang ? "js/core/save.js (schema " + JSON.parse(localStorage.getItem("njg-save") || "{}").schema + ")" : "classic js/shared/save.js",
    player: p && p.name, players: S.players().length, firstDone: S.flag("firstDone"), character: Object.keys(S.get("character") || {}).length,
    cookCoins: cook.coins || 0, cookWords: Object.keys(cook.words || {}).length, words: Object.keys(S.get("words") || {}).length,
    wallet: (S.get("wallet") || {}).coins, clinic: (S.get("clinic") || {}).state || ((S.get("ui") || {}).clinic || {}).state || null, story: Object.keys(S.get("story") || {}).length,
  };
};
const server = await startServer();
const browser = await launch();
const rows = [];
let bad = 0;
try {
  const { ctx, page, errors } = await newPage(browser, "1366x768", { seed: 7 });
  await firstLaunch({ page, rec, errors, size: "1366x768", browser });
  rows.push(["after first launch and its two Cook rounds", await page.evaluate(READ)]);
  await page.goto(`${BASE}/clinic.html?seed=7&quiet=1&fast=1&onboard=0&stage=waiting&level=1`, { waitUntil: "load" });
  await page.waitForFunction(() => window.Clinic && window.Clinic.Run && window.Save, null, { timeout: 30000 });
  await page.evaluate(() => {
    const R = window.Clinic.Run;
    const st = R.state();
    st.album = Array.from(new Set((st.album || []).concat(["kid:knee"])));
    st.coins = (st.coins || 0) + 2;
    st.session = st.session + 1;
    R.save(st);
  });
  rows.push(["after a clinic round", await page.evaluate(READ)]);
  const before = rows[rows.length - 1][1];
  await page.goto(`${BASE}/index.html`, { waitUntil: "load" });
  await page.waitForFunction(() => window.Save, null, { timeout: 30000 });
  await page.reload({ waitUntil: "load" });
  await page.waitForFunction(() => window.Save, null, { timeout: 30000 });
  const after = await page.evaluate(READ);
  rows.push(["the house, reloaded", after]);
  for (const k of ["player", "players", "firstDone", "character", "cookCoins", "cookWords", "words", "story"]) if (JSON.stringify(after[k]) !== JSON.stringify(before[k])) { bad++; rows.push([`LOST ${k}`, { before: before[k], after: after[k] }]); }
  if (!after.clinic || after.clinic.session !== before.clinic.session) { bad++; rows.push(["LOST the clinic's state", { before: before.clinic, after: after.clinic }]); }
  rows.push(["page errors", [...new Set(errors)]]);
  await ctx.close();
} finally {
  await browser.close();
  server.close();
}
const text = `# one profile through first launch, a Cook round, a clinic round and a reload (build/core/save-reload.mjs)\n\n${rows.map(([k, v]) => `- **${k}**: \`${JSON.stringify(v)}\``).join("\n")}\n\n${bad ? `${bad} LOST` : "nothing lost"}\n`;
if (out) writeFileSync(out, text);
process.stdout.write(text);
process.exit(bad ? 1 : 0);

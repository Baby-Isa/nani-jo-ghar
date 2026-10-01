#!/usr/bin/env node
// Captures REAL save shapes from the live pages, for the schema-2 migration tests (build/core/save.test.mjs).
// It plays first launch in the sandbox's browser (character, Nani's pantry round and the chai round in Cook,
// the Eid story, the house), then opens the clinic and lets the clinic's own code (Clinic.Run.state/save,
// the same calls a morning makes) add the morning's coins and album entry. Then it writes the whole
// localStorage to build/core/fixtures/live-save.json. Nothing in the game is changed.
// One browser at a time, own port:
//   COOK_TEST_PORT=8813 flock -w 1800 /tmp/njg-browser.lock timeout 1800 node build/core/capture-saves.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { ROOT, BASE, startServer, launch, newPage } from "../sandbox/lib/env.mjs";
import { firstLaunch } from "../sandbox/flows/first.mjs";

const out = join(ROOT, "build", "core", "fixtures", "live-save.json");
const rec = { states: [], stops: [], notes: [], async state() {}, note(n) { this.notes.push(n); }, stop(s) { this.stops.push(s); } };
const server = await startServer();
const browser = await launch();
const dump = (page) => page.evaluate(() => Object.fromEntries(Object.keys(localStorage).map((k) => [k, localStorage.getItem(k)])));
try {
  const { ctx, page, errors } = await newPage(browser, "1366x768", { seed: 7 });
  await firstLaunch({ page, rec, errors, size: "1366x768", browser });
  const afterFirst = await dump(page);
  // the clinic: its saved state through its own code (what R.morning does after each patient: coins, album, session)
  await page.goto(`${BASE}/clinic.html?seed=7&quiet=1&fast=1&onboard=0&stage=waiting&level=1`, { waitUntil: "load" });
  await page.waitForFunction(() => window.Clinic && window.Clinic.Run && window.UIStore && window.Save, null, { timeout: 30000 });
  await page.evaluate(() => {
    const R = window.Clinic.Run;
    const st = R.state();
    st.album = Array.from(new Set((st.album || []).concat(["kid:knee"])));
    st.coins = (st.coins || 0) + 1 + 1; // one patient, every row right (run.js R.morning)
    st.coins = st.coins + 1; // a second patient, not all right
    st.session = st.session + 1;
    R.save(st);
  });
  const afterClinic = await dump(page);
  mkdirSync(join(ROOT, "build", "core", "fixtures"), { recursive: true });
  writeFileSync(out, JSON.stringify({ captured: new Date().toISOString(), how: "build/core/capture-saves.mjs: first launch played in the sandbox, then the clinic's own Clinic.Run.save()", errors: [...new Set(errors)], afterFirst, afterClinic }, null, 1));
  console.log(`wrote ${out}: ${Object.keys(afterClinic).length} keys; notes ${rec.notes.length}, page errors ${new Set(errors).size}`);
  await ctx.close();
} finally {
  await browser.close();
  server.close();
}

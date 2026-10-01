// node --test build/lint/layout.test.mjs
// Runs the screen lint on a small fixture page with known violations and checks it finds every one
// of them, and none of the clean elements. Needs Chromium at /opt/pw-browsers (or Playwright's own).
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CLICK_HOOK, lintPage } from "./layout.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
let pw;
try { pw = require("playwright"); } catch (e) { pw = require(join(execSync("npm root -g").toString().trim(), "playwright")); }
const exe = existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined;

async function lintFixture(w, h) {
  const browser = await pw.chromium.launch({ executablePath: exe, args: ["--no-sandbox"] });
  try {
    const page = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage();
    await page.addInitScript(CLICK_HOOK);
    await page.goto("file://" + join(here, "fixtures", "violations.html"));
    return await lintPage(page);
  } finally { await browser.close(); }
}
const find = (fs, check, id) => fs.find((f) => f.check === check && f.selector.includes("#" + id));

test("finds every known violation, and no clean element", async () => {
  const fs = await lintFixture(844, 900);
  const expected = [
    ["text-clipped", "clip-self"],
    ["text-clipped", "clip-parent-text"],
    ["ellipsis", "ellipsis-bad"],
    ["ellipsis", "clamp-bad"],
    ["text-small", "small-text"],
    ["tap-small", "small-btn"],
    ["tap-small", "small-link"],
    ["tap-small", "click-div"],
    ["text-offscreen", "offscreen-text"],
    ["scroll-container", "scroller"],
  ];
  for (const [check, id] of expected) assert.ok(find(fs, check, id), `${check} on #${id} not found. Got: ${JSON.stringify(fs.map((f) => f.check + " " + f.selector))}`);
  assert.ok(fs.some((f) => f.check === "page-scroll" && /sideways/.test(f.measured)), "sideways page scroll not found");
  // measured values are real numbers
  assert.match(find(fs, "text-small", "small-text").measured, /^11\.0px$/);
  assert.match(find(fs, "tap-small", "small-btn").measured, /^30x30px$/);
  // the clean elements stay clean
  for (const id of ["ok-btn", "ok-text", "ellipsis-fits", "hidden-none", "hidden-opacity", "hidden-vis", "parked", "parked-btn", "wraps", "scaled-ok", "moving-off"]) {
    const bad = fs.filter((f) => f.selector.includes("#" + id));
    assert.deepEqual(bad, [], `#${id} should be clean but got ${JSON.stringify(bad)}`);
  }
  // an ellipsis that truncates is reported once, as an ellipsis (not also as clipped)
  assert.equal(fs.filter((f) => f.check === "text-clipped" && f.selector.includes("ellipsis-bad")).length, 0);
});

test("the same findings at another size (1366x768)", async () => {
  const fs = await lintFixture(1366, 768);
  assert.ok(find(fs, "tap-small", "small-btn"));
  assert.ok(find(fs, "text-clipped", "clip-self"));
});

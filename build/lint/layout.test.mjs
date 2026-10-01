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

// ---- covering, broken words, the play area; text inside a Phaser canvas ----
import { PHASER_HOOK, lintPhaser } from "./phaser.mjs";

async function withPage(w, h, file, fn) {
  const browser = await pw.chromium.launch({ executablePath: exe, args: ["--no-sandbox"] });
  try {
    const page = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage();
    await page.addInitScript(CLICK_HOOK);
    await page.addInitScript(PHASER_HOOK);
    await page.goto("file://" + join(here, "fixtures", file));
    return await fn(page);
  } finally { await browser.close(); }
}

test("something on top of a tappable thing is found; a pointer-events:none overlay, a child and a modal scrim are not", async () => {
  const fs = await withPage(844, 390, "covering.html", (p) => lintPage(p));
  const cov = find(fs, "covered", "cov-btn");
  assert.ok(cov, `covered on #cov-btn not found. Got: ${JSON.stringify(fs.map((f) => f.check + " " + f.selector))}`);
  assert.match(cov.measured, /#cov-over/);
  assert.deepEqual(fs.filter((f) => f.check === "covered" && /cov-clean-btn|cov-child-btn/.test(f.selector)), []);
  assert.deepEqual(fs.filter((f) => f.check === "covers-play-area"), []);
  const scrim = await withPage(844, 390, "covering.html?scrim=1&blocker=1", (p) => lintPage(p));
  assert.deepEqual(scrim.filter((f) => f.check === "covered" || f.check === "covers-play-area"), [], "a full-screen modal over everything is by design");
});

test("something other than the canvas on top of the middle of the play area is found", async () => {
  const fs = await withPage(844, 390, "covering.html?blocker=1", (p) => lintPage(p));
  const f = fs.find((x) => x.check === "covers-play-area" && x.selector.includes("#blocker"));
  assert.ok(f, `covers-play-area on #blocker not found. Got: ${JSON.stringify(fs.map((x) => x.check + " " + x.selector))}`);
});

test("a word split mid-word across lines is found; a wrap at a space or hyphen, and a long unbroken word, are not", async () => {
  const fs = await withPage(844, 390, "covering.html", (p) => lintPage(p));
  const b = find(fs, "word-broken", "brk-bad");
  assert.ok(b, `word-broken on #brk-bad not found. Got: ${JSON.stringify(fs.map((f) => f.check + " " + f.selector))}`);
  assert.match(b.measured, /Wonderfulness/);
  assert.deepEqual(fs.filter((f) => f.check === "word-broken" && /brk-ok|brk-hyphen|brk-long/.test(f.selector)), []);
});

test("text drawn in a Phaser canvas: a small one, one in a scaled container and one cut by the edge are found; hidden ones are not", async () => {
  // the world is 1600x900 and the window 800x450: everything is drawn at half size
  const fs = await withPage(800, 450, "phaser-text.html", async (p) => {
    await p.waitForFunction(() => window.__njgGames && window.__njgGames.length && window.__njgGames[0].scene.getScenes(true).length, null, { timeout: 15000 });
    await p.waitForTimeout(400);
    return lintPhaser(p);
  });
  const tiny = fs.find((f) => f.check === "canvas-text-small" && f.selector.includes("[20px"));
  assert.ok(tiny, `a small canvas text was not found. Got: ${JSON.stringify(fs)}`);
  assert.equal(tiny.measured, "10.0px");
  const scaled = fs.find((f) => f.check === "canvas-text-small" && f.selector.includes("[34px"));
  assert.ok(scaled, "the text in a scaled container was not found");
  assert.equal(scaled.measured, "8.5px"); // 34 x 0.5 (container) x 0.5 (the screen), the worst of the three 34 px labels
  assert.ok(fs.find((f) => f.check === "canvas-text-offscreen" && f.selector.includes("[34px")), "the text cut by the canvas edge was not found");
  assert.deepEqual(fs.filter((f) => f.selector.includes("[12px")), [], "hidden, transparent and hidden-container texts are clean");
  assert.equal(fs.filter((f) => f.check === "canvas-text-small").length, 2);
});

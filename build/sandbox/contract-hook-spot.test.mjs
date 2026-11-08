// S18 wave 3: the contract hook's spotNow reads the first-time help's light (js/shared/onboard.js Onboard.spot: its layers'
// data-holes) but skips a layer that is fading out (no class "on"): a closing light keeps its holes for its 300 ms fade, and
// the lit-thing check (contract-53) must not judge the pictures against a light that is going. Runs the real hook in the
// browser on a fixture page (skips where there is no browser). node --test build/sandbox/contract-hook-spot.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { launch } from "./lib/env.mjs";
import { CONTRACT_HOOK } from "./lib/contract-hook.mjs";

const HOLE = (x) => JSON.stringify([{ x, y: 10, w: 50, h: 50 }]);
const PAGE = (layers) => `<!doctype html><meta charset=utf-8><body style="margin:0">${layers}</body>`;

async function spotsOf(browser, layers) {
  const ctx = await browser.newContext({ viewport: { width: 800, height: 400 } });
  const page = await ctx.newPage();
  const spots = [];
  let got;
  const first = new Promise((res) => (got = res));
  await page.exposeFunction("__njgLog", (e) => { if (e && e.k === "spot") { spots.push(e); got(); } });
  await page.setContent(PAGE(layers));
  await page.addScriptTag({ content: CONTRACT_HOOK });
  await Promise.race([first, new Promise((res) => setTimeout(res, 4000))]);
  await ctx.close();
  return spots;
}

test("contract hook spotNow: a light layer fading out (no class 'on') adds no hole; the lit one does", async (t) => {
  let browser;
  try { browser = await launch(); } catch (e) { return t.skip("no browser here"); }
  try {
    const mixed = await spotsOf(browser, `<div class="njg-onboard on" data-holes='${HOLE(10)}'></div><div class="njg-onboard" data-holes='${HOLE(300)}'></div>`);
    assert.equal(mixed.length, 1, "the lit layer is read");
    assert.deepEqual(mixed[0].holes, [{ l: 10, t: 10, r: 60, b: 60 }], "only the layer that is on: not the one fading out");
    // only a fading layer: no light on screen, nothing to judge against
    const fading = await spotsOf(browser, `<div class="njg-onboard" data-holes='${HOLE(300)}'></div>`);
    assert.equal(fading.length, 0, "a lone fading layer is no spot");
  } finally { await browser.close(); }
});

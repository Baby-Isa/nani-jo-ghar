// Node tests for the frame (js/shared/frame.js) and the tokens (css/shared/tokens.css, data/layout.json): the form
// factors of the screen matrix, the floors (text 14 px, taps 48 px) at every size, tablets bigger than laptops,
// the first-paint fallback in tokens.css equal to what layout.json gives, and no hard-coded px sizes in css/shared.
// No browser. Run: node --test build/test_shared_frame.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, readdirSync } from "node:fs";

const require = createRequire(import.meta.url);
const Frame = require("../js/shared/frame.js");
const L = JSON.parse(readFileSync(new URL("../data/layout.json", import.meta.url)));
const CSS = readFileSync(new URL("../css/shared/tokens.css", import.meta.url), "utf8");
const MATRIX = { "844x390": "phone", "800x360": "phone", "1366x768": "laptop", "1440x900": "laptop", "1280x800": "laptop", "1024x768": "tablet", "1180x820": "tablet", "1366x1024": "tablet" };
const px = (v) => parseFloat(v);

test("every size in the screen matrix gets its form factor", () => {
  for (const [k, ff] of Object.entries(MATRIX)) {
    const [w, h] = k.split("x").map(Number);
    assert.equal(Frame.formFactor(L, w, h), ff, k);
    assert.equal(Frame.formFactor(Frame.DEFAULTS, w, h), ff, `${k}: the first-paint thresholds match layout.json`);
  }
});

test("floors: text never under 14 px, taps never under 48 px, at every size", () => {
  for (const k of Object.keys(MATRIX)) {
    const [w, h] = k.split("x").map(Number);
    const { vars } = Frame.compute(L, w, h);
    for (const t of L.floors.textTokens) assert.ok(px(vars[`--njg-${t}`]) >= 14, `${k} ${t} = ${vars[`--njg-${t}`]}`);
    for (const t of L.floors.tapTokens) assert.ok(px(vars[`--njg-${t}`]) >= 48, `${k} ${t} = ${vars[`--njg-${t}`]}`);
  }
});

test("tablets get bigger UI than laptops, and a sidebar about a fifth to a quarter of the screen", () => {
  const lap = Frame.compute(L, 1366, 768);
  for (const k of ["1024x768", "1180x820", "1366x1024"]) {
    const [w, h] = k.split("x").map(Number);
    const t = Frame.compute(L, w, h);
    assert.ok(t.scale > 1, `${k} scale ${t.scale}`);
    assert.ok(px(t.vars["--njg-side-h"]) > px(lap.vars["--njg-side-h"]), `${k}: bigger card headline`);
    assert.ok(px(t.vars["--njg-tool"]) > 48, `${k}: bigger guide tools`);
    const share = t.sideW / w;
    assert.ok(share >= 0.18 && share <= 0.27, `${k}: sidebar ${t.sideW}px = ${(share * 100).toFixed(1)}%`);
  }
  assert.equal(lap.sideW, 260, "the laptop sidebar stays Cook's 19%");
});

test("tokens.css's first-paint fallback equals layout.json (laptop, phone, the smallest tablet)", () => {
  const blocks = CSS.split(/@media/);
  const read = (block) => Object.fromEntries([...block.matchAll(/(--njg-[a-z0-9-]+):\s*([0-9.]+px)/g)].map((m) => [m[1], m[2]]));
  const lapCss = read(blocks[0]);
  const phoneCss = read(blocks.find((b) => /max-height: 499/.test(b)));
  const tabCss = read(blocks.find((b) => /max-aspect-ratio: 3\/2/.test(b)));
  const check = (css, w, h, name) => {
    const { vars } = Frame.compute(L, w, h);
    for (const [k, v] of Object.entries(vars)) {
      if (!/px$/.test(v) || k === "--njg-side-w") continue;
      if (css[k] == null) continue; // not overridden in this block: the laptop value applies
      assert.equal(css[k], v, `${name} ${k}`);
    }
  };
  check(lapCss, 1366, 768, "laptop");
  const lap = Frame.compute(L, 1366, 768).vars;
  for (const [k, v] of Object.entries(lap)) if (/px$/.test(v) && k !== "--njg-side-w") assert.equal(lapCss[k], v, `laptop ${k} is in tokens.css`);
  check(phoneCss, 844, 390, "phone");
  // the phone block lists every token that differs on a phone
  const ph = Frame.compute(L, 844, 390).vars;
  for (const [k, v] of Object.entries(ph)) if (/px$/.test(v) && k !== "--njg-side-w" && v !== lap[k]) assert.equal(phoneCss[k], v, `phone ${k} is in tokens.css's phone block`);
  check(tabCss, 1024, 768, "tablet");
});

test("no hard-coded px sizes in css/shared (tokens.css is the one place)", () => {
  const dir = new URL("../css/shared/", import.meta.url);
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".css") || f === "tokens.css") continue;
    const src = readFileSync(new URL(f, dir), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    // a px length that isn't a 0px fallback
    const bad = [...src.matchAll(/(?<![\w.-])(\d*\.?\d+)px\b/g)].filter((m) => +m[1] !== 0).map((m) => src.slice(Math.max(0, m.index - 40), m.index + 6).replace(/\s+/g, " "));
    assert.deepEqual(bad, [], `${f}: ${bad.length} px sizes`);
  }
});

test("no ellipsis in css/shared or Cook's sidebar (F7)", () => {
  for (const f of ["css/shared/order-card.css", "css/shared/guide.css", "css/cook-side-v2.css", "css/shared/results.css"]) {
    const src = readFileSync(new URL(`../${f}`, import.meta.url), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    assert.ok(!/text-overflow:\s*ellipsis/.test(src), f);
    const mins = [...src.matchAll(/--fit-min:\s*([0-9.]+)px/g)].map((m) => +m[1]);
    assert.ok(mins.every((v) => v >= 14), `${f}: --fit-min under 14 px: ${mins}`);
  }
});

test("the card's row layout is chosen per form factor in data (default: stacked everywhere)", () => {
  for (const k of Object.keys(MATRIX)) {
    const [w, h] = k.split("x").map(Number);
    assert.equal(Frame.compute(L, w, h).rows, "stack", k);
  }
  const L2 = JSON.parse(JSON.stringify(L));
  L2.card.rows.tablet = "pills";
  assert.equal(Frame.compute(L2, 1024, 768).rows, "pills");
  assert.equal(Frame.compute(L2, 1366, 768).rows, "stack");
});

test("one number in layout.json moves the sidebar", () => {
  const L2 = JSON.parse(JSON.stringify(L));
  L2.sidebar.laptop.share = 0.25;
  assert.equal(Frame.compute(L2, 1366, 768).sideW, Math.round(1366 * 0.25));
});

test("upright phones get the turn-your-phone card; landscape and tablets don't", () => {
  assert.equal(Frame.compute(L, 390, 844).rotate, true);
  assert.equal(Frame.compute(L, 844, 390).rotate, false);
  assert.equal(Frame.compute(L, 768, 1024).rotate, false);
});

test("R6: a sidebar that doesn't fit steps down from the screen's scale to sidebar.fit.minScale", () => {
  const t = Frame.compute(L, 1180, 820);
  const steps = Frame.sideScales(L, t.scale);
  assert.equal(steps[0], t.scale, "the screen's own scale first");
  assert.equal(steps[steps.length - 1], L.sidebar.fit.minScale);
  for (let i = 1; i < steps.length; i++) assert.ok(steps[i] < steps[i - 1], `steps go down: ${steps}`);
  assert.equal(Frame.sideTokens(L, t.ff, t.scale, t.scale), null, "nothing to set at the screen's own scale");
});

test("R6: the sidebar's own sizes keep the floors, the taps and the dock's padding at every step", () => {
  for (const k of Object.keys(MATRIX)) {
    const [w, h] = k.split("x").map(Number);
    const t = Frame.compute(L, w, h);
    for (const s of Frame.sideScales(L, t.scale).slice(1)) {
      const v = Frame.sideTokens(L, t.ff, t.scale, s);
      for (const tok of L.floors.textTokens) if (v[`--njg-${tok}`]) assert.ok(px(v[`--njg-${tok}`]) >= 14.5, `${k} @${s} ${tok} ${v[`--njg-${tok}`]}`);
      for (const tok of [...L.floors.tapTokens, ...L.floors.unscaled, ...L.sidebar.fit.keep]) assert.equal(v[`--njg-${tok}`], undefined, `${k} @${s}: ${tok} keeps the screen's value`);
      for (const [name, val] of Object.entries(v)) assert.ok(px(val) <= px(t.vars[name]) + 1e-9, `${k} @${s}: ${name} only shrinks`);
    }
  }
});

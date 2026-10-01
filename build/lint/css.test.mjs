// node --test build/lint/css.test.mjs : the static spacing lint finds every planted off-grid value and none of the clean ones.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { lintCssText, offGrid, onGrid, lintCssAll } from "./css.mjs";

const here = dirname(fileURLToPath(import.meta.url));

test("finds every off-grid spacing value in the fixture, and none of the clean rules", () => {
  const fs = lintCssText(readFileSync(join(here, "fixtures", "spacing.css"), "utf8"), "spacing.css");
  const by = (sel) => fs.filter((f) => f.selector.includes(`| ${sel} |`));
  assert.equal(by(".bad-padding")[0].measured, "10px");
  assert.equal(by(".bad-margin")[0].measured, "5px");
  assert.equal(by(".bad-gap")[0].measured, "6px");
  assert.equal(by(".bad-rem")[0].measured, "1.25rem");
  assert.equal(by(".bad-negative")[0].measured, "-10px");
  const media = by(".bad-media");
  assert.equal(media.length, 1);
  assert.match(media[0].selector, /@media \(max-width: 800px\)/);
  assert.equal(fs.length, 6, `unexpected findings: ${JSON.stringify(fs.map((f) => f.selector))}`);
  for (const id of ["ok-grid", "ok-zero", "ok-computed", "ok-relative", "ok-not-spacing", "ok-rem", "ok-comment", "k"]) assert.deepEqual(by("." + id), [], id);
});

test("the grid: 0, 4, 8, 12 and every multiple of 8", () => {
  for (const v of [0, 4, 8, 12, 16, 24, 32, 40, 48, 64]) assert.ok(onGrid(v), String(v));
  for (const v of [1, 2, 3, 5, 6, 7, 10, 14, 18, 20, 22, 28, 30]) assert.ok(!onGrid(v), String(v));
  assert.deepEqual(offGrid("10px 8px 3px 0 auto 50%"), ["10px", "3px"]);
});

test("the live stylesheets parse (a count, not a verdict: the baseline holds the findings)", () => {
  const all = lintCssAll();
  assert.ok(all.length >= 0 && all.every((f) => f.check === "spacing-grid" && f.selector.startsWith("css/")));
});

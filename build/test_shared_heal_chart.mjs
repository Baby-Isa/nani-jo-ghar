// CLN-189 (s08-w5b; Zafar, 18 Oct: "she's saying tomato, limu, which is lemon ... I'm pressing no, because an orange,
// not a lemon"): every picture the eye chart draws is the colour of its word (data/clinic/heal/eye.json chart_colours),
// measured on the picture itself by build/heal_colour.py. The old golden half lemon is the red case: it reads orange.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const eye = require(join(ROOT, "js/clinic/heal/games/eye.js"));
const data = JSON.parse(readFileSync(join(ROOT, "data/clinic/heal/eye.json"), "utf8"));
const classify = (files) =>
  execFileSync("python3", [join(ROOT, "build/heal_colour.py"), ...files.map((f) => join(ROOT, f))], { encoding: "utf8" })
    .trim()
    .split("\n")
    .map((l) => JSON.parse(l));

test("every eye-chart picture is its word's colour (CLN-189)", () => {
  const pics = eye.chartPictures;
  assert.ok(pics && pics.length >= 4, "eye.js exports its chart pictures");
  const want = data.chart_colours;
  pics.forEach((p) => assert.ok(existsSync(join(ROOT, p.icon)), `${p.lex}: ${p.icon} exists`));
  const got = classify(pics.map((p) => p.icon));
  pics.forEach((p, i) => {
    const ok = [].concat(want[p.lex] || []);
    assert.ok(ok.length, `${p.lex} has a colour in eye.json chart_colours`);
    assert.ok(ok.includes(got[i].class), `${p.lex} (${p.icon}) reads ${got[i].class} (hue ${got[i].hue}), its word wants ${ok.join(" or ")}`);
  });
});

test("the check tells a lemon from an orange: the old half lemon reads orange (the red case)", () => {
  const [half, whole] = classify(["assets/clinic/items-v2/lemon-half.webp", "assets/clinic/items-s08b/lemon-whole-s08b.webp"]);
  assert.notEqual(half.class, "yellow");
  assert.equal(whole.class, "yellow");
});

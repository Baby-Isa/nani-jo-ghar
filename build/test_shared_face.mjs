// ART-08 (S13-A2): the one face maker (js/shared/face.js) on data/faces.json: one crop per person, three sizes only.
//   node --test build/test_shared_face.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const F = require("../js/shared/face.js");
const T = JSON.parse(readFileSync(new URL("../data/faces.json", import.meta.url), "utf8"));

test("three sizes only, each a token", () => {
  assert.deepEqual(F.SIZES, ["row", "guide", "big"]);
  assert.deepEqual(T.sizes, { row: "face", guide: "guide-face", big: "big-face" });
  const tokens = readFileSync(new URL("../css/shared/tokens.css", import.meta.url), "utf8");
  for (const t of Object.values(T.sizes)) assert.match(tokens, new RegExp(`--njg-${t}:`), t);
});

test("every person has one cut of the passed S12 sheet, eyes at the same height", () => {
  const eyes = Object.values(T.people).map((p) => p.eyeY);
  for (const [id, p] of Object.entries(T.people)) {
    assert.match(p.src, /^assets\/shared\/faces\/[a-z]+\.webp$/, id);
    assert.ok(p.eyeY >= 0.36 && p.eyeY <= 0.48, `${id} eyes at ${p.eyeY}`);
  }
  assert.ok(Math.max(...eyes) - Math.min(...eyes) <= 0.04, "level within 4% of the circle");
});

test("a known person is drawn from the table; an alias too; anyone else from the game's picture", () => {
  const nana = F.html("Nana", "row", { src: "assets/cook/characters/nana-badge.webp" });
  assert.match(nana, /class="njg-face njg-face-row"/);
  assert.match(nana, /src="assets\/shared\/faces\/nana\.webp"/);
  assert.match(nana, /data-who="nana"/);
  assert.match(F.html("patient", "big"), /girl\.webp/);
  const ali = F.html("ali", "row", { src: "assets/cook/characters/ali-badge.webp" });
  assert.match(ali, /njg-face-own/);
  assert.match(ali, /ali-badge\.webp/);
  assert.match(F.html("nani", "huge"), /njg-face-row/, "an unknown size is the row size");
});

test("the button: the circle in its tap area, the badge, the role class", () => {
  const b = F.buttonHtml("doctor", "guide", { cls: "ng-face", label: "Hear the doctor again" });
  assert.match(b, /^<button class="njg-face-btn njg-face-btn-guide face-say ng-face"/);
  assert.match(b, /aria-label="Hear the doctor again"/);
  assert.match(b, /class="njg-face njg-face-guide"/);
  assert.match(b, /say-badge/);
  assert.doesNotMatch(F.buttonHtml("nani", "big", { badge: false }), /say-badge/);
});

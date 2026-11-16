// SH-224 (probes-open, run 16; Zafar, 6 Nov: "keep the fonts in the repo rather than loading them from Google ... the central place
// that everyone pulls upon"): no page or script the game ships loads a font from Google; the faces come from assets/fonts/ (the tokens).
// node build/test_fonts_local.mjs (a node:test file: exit 1 on a fail)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const GOOGLE = /fonts\.(googleapis|gstatic)\.com/;
const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });

test("no shipped page links Google Fonts", () => {
  const pages = readdirSync(ROOT).filter((f) => f.endsWith(".html"));
  const bad = pages.filter((f) => GOOGLE.test(readFileSync(join(ROOT, f), "utf8")));
  assert.deepEqual(bad, [], "pages that load fonts from Google");
});

test("no shipped script or style loads Google Fonts", () => {
  const files = ["js", "css"].flatMap((d) => walk(join(ROOT, d))).filter((f) => /\.(m?js|css)$/.test(f));
  const bad = files.filter((f) => GOOGLE.test(readFileSync(f, "utf8"))).map((f) => relative(ROOT, f));
  assert.deepEqual(bad, [], "scripts or styles that load fonts from Google");
});

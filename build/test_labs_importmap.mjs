// LAB-08 (probes-open, run 16): labs.html carries the core import map (data-njg="core"), so its core modules load with the version
// stamp (a returning player never gets stale code after a publish), and build/gen_labs.mjs writes that tag (bump_version.py fills it).
// node --test build/test_labs_importmap.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(join(ROOT, "labs.html"), "utf8");

test("labs.html has the core import map, every entry stamped", () => {
  const m = /<script type="importmap" data-njg="core">([\s\S]*?)<\/script>/.exec(html);
  assert.ok(m, "labs.html has no <script type=\"importmap\" data-njg=\"core\">");
  const map = JSON.parse(m[1]).imports || {};
  const bad = Object.entries(map).filter(([, v]) => !/\?v=\w+/.test(v));
  assert.ok(Object.keys(map).length > 0, "the import map is empty");
  assert.deepEqual(bad, [], "import map entries without a ?v= stamp");
});

test("every module script labs.html loads from js/ is stamped", () => {
  const srcs = [...html.matchAll(/<script[^>]*type="module"[^>]*src="([^"]+)"/g)].map((x) => x[1]).filter((s) => /^(\.\/)?js\//.test(s));
  const bad = srcs.filter((s) => !/\?v=\w+/.test(s));
  assert.deepEqual(bad, [], "module scripts without a ?v= stamp");
});

test("gen_labs.mjs writes the core import map tag", () => {
  const gen = readFileSync(join(ROOT, "build", "gen_labs.mjs"), "utf8");
  assert.match(gen, /importmap/, "build/gen_labs.mjs never writes an import map");
});

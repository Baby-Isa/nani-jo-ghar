// S18 wave 3: loadcheck reads a station's own settings (data/stations/<k>.json "assets") as its manifest, and checks baking,
// eggs and corn. No browser: --list and --manifest answer before the server starts. node --test build/tools/review/loadcheck.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const LC = join(ROOT, "build/tools/review/loadcheck.mjs");
const run = (...args) => execFileSync(process.execPath, [LC, ...args], { cwd: ROOT, encoding: "utf8" });

test("loadcheck lists baking, eggs and corn as pages", () => {
  const ids = run("--list").split("\n").map((l) => l.trim().split(/\s+/)[0]);
  for (const k of ["baking", "eggs", "corn"]) assert.ok(ids.includes(`cook:${k}`), `cook:${k} is a page`);
});

test("loadcheck's manifest for a station includes its settings' assets (data/stations/<k>.json)", () => {
  for (const k of ["baking", "eggs", "corn"]) {
    const want = JSON.parse(readFileSync(join(ROOT, `data/stations/${k}.json`), "utf8")).assets;
    assert.ok(want.length > 0);
    const got = new Set(run("--manifest", `cook:${k}`).split("\n").map((l) => l.trim()).filter(Boolean));
    for (const u of want) assert.ok(got.has(u), `${k}: ${u} is in its manifest`);
  }
  // a station is not given another's pictures
  const eggs = run("--manifest", "cook:eggs");
  assert.ok(!eggs.includes("assets/cook/proto/baking/oven-shut.webp"), "baking's oven is not eggs'");
});

// SH-221 (6 Nov): every sound the shared kit asks for exists. js/shared/buttons.js called Sfx.tap(), which js/shared/sfx.js never had
// (its tap is Sfx.play("tap")), so no shared button ever made its tap sound and nothing said so (each call is guarded).
//   node --test build/test_shared_sfx_calls.mjs
// Reads every js/shared/*.js file's source: each Sfx.<method> it calls must be a function of the shared Sfx, and each
// Sfx.play("<name>") / Sfx.loop("<name>") a sound sfx.js has.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const Sfx = require("../js/shared/sfx.js");
const SHARED = join(ROOT, "js", "shared");
const files = readdirSync(SHARED).filter((f) => f.endsWith(".js") && f !== "sfx.js");
// (comments left out: a doc line naming a sound is not a call)
const src = (f) => readFileSync(join(SHARED, f), "utf8").replace(/\/\*[\s\S]*?\*\/|(^|[^:"'`\\])\/\/[^\n]*/g, "$1");
// the loops sfx.js knows (LOOPS is not exported: read from its source)
const sfxSrc = readFileSync(join(SHARED, "sfx.js"), "utf8");
const loopsBlock = (sfxSrc.match(/const LOOPS = \{([\s\S]*?)\n {2}\};/) || [])[1] || "";
const LOOPS = new Set([...loopsBlock.matchAll(/^\s{4}(?:"([\w-]+)"|(\w+)):/gm)].map((m) => m[1] || m[2]));
const PROPS = new Set(["muted", "volume", "names"]);

test("the loops are read from sfx.js", () => {
  for (const k of ["pour", "pour-glass", "sizzle", "boil"]) assert.ok(LOOPS.has(k), k);
});

test("every Sfx.<method> the shared kit calls is one sfx.js has", () => {
  const bad = [];
  for (const f of files)
    for (const m of src(f).matchAll(/\bSfx\.([A-Za-z_]\w*)/g)) {
      const name = m[1];
      if (PROPS.has(name)) continue;
      if (typeof Sfx[name] !== "function") bad.push(`js/shared/${f}: Sfx.${name} (sfx.js has ${Object.keys(Sfx).filter((k) => typeof Sfx[k] === "function").join(", ")})`);
    }
  assert.deepEqual(bad, []);
});

test("every Sfx.play / Sfx.loop name the shared kit asks for is a sound sfx.js has", () => {
  const bad = [];
  for (const f of files)
    for (const m of src(f).matchAll(/\bSfx\.(play|loop)\(\s*["'`]([\w-]+)["'`]/g)) {
      const ok = m[1] === "play" ? Sfx.names.includes(m[2]) : LOOPS.has(m[2]);
      if (!ok) bad.push(`js/shared/${f}: Sfx.${m[1]}("${m[2]}")`);
    }
  assert.deepEqual(bad, []);
});

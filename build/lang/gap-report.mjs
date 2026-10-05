#!/usr/bin/env node
// The gap reporter (step 4a, the minimum 4c: decision 38 (c)). Given the meanings a game needs, lists what the
// language engine can't say yet, or has no recording for, as a plain list for Mum (Markdown), in the order given.
// No frequency ranking or simulator (deferred). Also runs the data check first and stops on errors.
//   node build/lang/gap-report.mjs --needs <file.json> [--data data/lang/] [--seed] [--path store|test] [--out f.md] [--json]
//   node build/lang/gap-report.mjs --seed        the test seed and its example needs (data/lang/test-seed/)
// A needs file is {needs: [{label, meaning, ctx?}]} or a plain list of them.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createEngine, DATA_FILES } from "../../js/core/lang/engine/index.js";
import { validate } from "../../js/core/lang/engine/validate.js";
import { gapReport } from "../../js/core/lang/engine/gaps.js";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const argv = process.argv.slice(2);
const opt = (name, dflt = null) => {
  const i = argv.indexOf(`--${name}`);
  return i < 0 ? dflt : argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : true;
};
const J = (p) => JSON.parse(readFileSync(p.startsWith("/") ? p : ROOT + p, "utf8"));

export function loadData({ seed = false, dir = "data/lang/" } = {}) {
  const data = {};
  for (const f of DATA_FILES) data[f] = J(`${seed && f !== "params" ? "data/lang/test-seed/" : dir}${f}.json`);
  return data;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const seed = !!opt("seed");
  const data = loadData({ seed, dir: opt("data", "data/lang/") });
  const audio = J("data/family-audio.json");
  const v = validate(data, { audio });
  if (!v.ok) {
    console.error(`Data errors (${v.errors.length}):`);
    v.errors.forEach((e) => console.error(`  ${e.where}: ${e.msg}`));
    process.exit(1);
  }
  const needsFile = opt("needs", seed ? "data/lang/test-seed/needs.json" : null);
  if (!needsFile) {
    console.error("give --needs <file.json> (or --seed)");
    process.exit(2);
  }
  const raw = J(needsFile);
  const needs = Array.isArray(raw) ? raw : raw.needs || [];
  const engine = createEngine({ data, audio, path: opt("path", "store"), phrases: false });
  const rep = gapReport(engine, needs, { elicit: J("data/lang/elicit.json") });
  const out = opt("json") ? JSON.stringify(rep.items, null, 2) : rep.text;
  const file = opt("out");
  if (file && file !== true) writeFileSync(file, out + "\n");
  else console.log(out);
  if (v.warnings.length) console.error(`(${v.warnings.length} data warnings; run the tests to see them)`);
}

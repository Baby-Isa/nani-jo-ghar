#!/usr/bin/env node
// heal-marks.mjs: the words each heal game teaches (CLN-119) and the eye chart's item pool (CLN-38). Always exit 0: the output is the evidence.
//   node build/tools/review/heal-marks.mjs            per game: its words (Kutchi, or English still to record) and its per-level knob words
//   node build/tools/review/heal-marks.mjs --pool eye the chart's item pool, with the lexicon's Kutchi and each item's family (food, drink, household...)
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const J = (f) => { try { return JSON.parse(readFileSync(join(ROOT, f), "utf8")); } catch (e) { return null; } };
const lex = (J("data/lang/lexicon.json") || {}).entries || [];
const byId = new Map(lex.map((e) => [e.id, e]));
const byGloss = new Map(lex.filter((e) => e.gloss).map((e) => [String(e.gloss).toLowerCase(), e]));
// the Kutchi for an English word in the lexicon (a recorded lemma, not a to-record placeholder), else null
const kutchiOf = (en) => { const e = byGloss.get(String(en).toLowerCase()) || byId.get(en); return e && e.lemma && e.status !== "to-record" ? e.lemma : null; };
const FAMILY = (id) => /^(fru|veg)-/.test(id) ? "food" : /^cook-(dudh|paani|chai)/.test(id) ? "drink" : /^(hh|house|home|furn|clo)-?/.test(id) ? "household" : "other";
const args = process.argv.slice(2);

if (args.includes("--pool")) {
  const which = args[args.indexOf("--pool") + 1] || "eye";
  const src = readFileSync(join(ROOT, `js/clinic/heal/games/${which}.js`), "utf8");
  const m = /const THINGS = \[([^\]]*)\]/.exec(src);
  const ids = m ? [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : [];
  console.log(`# ${which} chart item pool (js/clinic/heal/games/${which}.js THINGS): ${ids.length} items`);
  const fam = {};
  for (const id of ids) {
    const e = byId.get(id) || [...byId.values()].find((x) => (x.aliases || []).includes(id));
    const f = FAMILY(id); fam[f] = (fam[f] || 0) + 1;
    console.log(`${id.padEnd(10)} ${f.padEnd(10)} ${e ? `${e.lemma || "(no Kutchi)"}  [${e.gloss || ""}]` : "(not in the lexicon)"}`);
  }
  console.log(`families: ${Object.entries(fam).map(([k, v]) => `${k} ${v}`).join(", ")}`);
  console.log(`household nouns (bed, table...): ${fam.household || 0}${fam.household ? "" : "  <- none: the chart draws only fruit, veg and drinks (CLN-38)"}`);
  process.exit(0);
}

const dir = join(ROOT, "data/clinic/heal");
for (const f of readdirSync(dir).filter((x) => x.endsWith(".json")).sort()) {
  const d = J(`data/clinic/heal/${f}`); if (!d) continue;
  const game = f.replace(/\.json$/, "");
  console.log(`\n## ${game}`);
  const words = d.words || {};
  for (const [id, w] of Object.entries(words)) console.log(`  word ${id.padEnd(14)} ${w.kutchi ? `Kutchi: ${w.kutchi}` : `ENGLISH (to record): ${w.english || id}`}`);
  // per-level knob words: colour lists, counts, up/down...: any string array or {level: [strings]} under knobs
  const rows = [];
  const walk = (v, path) => {
    if (Array.isArray(v) && v.length && v.every((x) => typeof x === "string")) rows.push([path, v]);
    else if (v && typeof v === "object" && !Array.isArray(v)) for (const [k, x] of Object.entries(v)) walk(x, path ? `${path}.${k}` : k);
  };
  walk(d.knobs || {}, "knobs");
  for (const [p, v] of rows) console.log(`  ${p}: ${v.map((x) => `${x}${kutchiOf(x) ? `=${kutchiOf(x)}` : " (English)"}`).join(", ")}`);
  if (d.numbers) console.log(`  numbers: ${Object.values(d.numbers).join(", ")}`);
}
process.exit(0);

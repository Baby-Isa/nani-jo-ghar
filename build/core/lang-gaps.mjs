#!/usr/bin/env node
// What the Lang seam can't say yet: plays every Cook recipe at levels 1-4 for every customer (8 seeds), says
// each order, section and row through the adapter, and counts the gaps it meets (rule, lexeme, feature, audio),
// plus the adapter's own list (Lang.GAPS). Audio gaps are for the store path (OK family clips only).
//   node build/core/lang-gaps.mjs [--json]
import { readFileSync } from "node:fs";
import { loadCook, ROOT } from "./cook-harness.mjs";
import { createLang, itemFromParts } from "../../js/core/lang/index.js";
import { clipIndex } from "../../js/core/voice.js";

const fam = JSON.parse(readFileSync(ROOT + "data/family-audio.json", "utf8"));
const tts = JSON.parse(readFileSync(ROOT + "data/cook-tts.json", "utf8")).lines;
const index = clipIndex(fam, { tts });
const count = new Map();
let said = 0;
for (const seed of [1, 2, 3, 4, 5, 6, 7, 8]) {
  const { Cook } = await loadCook({ seed });
  const Lang = createLang({ cook: Cook, index, path: "store" });
  const D = Cook.data;
  for (const id of Object.keys(D.recipes).filter((x) => x[0] !== "_"))
    for (const level of [1, 2, 3, 4])
      for (const who of id === "pantry" ? ["nani"] : Object.keys(D.customers)) {
        const d = Cook.Recipes[id].make(who, { level });
        if (id === "pantry") d.for = "chai";
        const lad = Cook.Order.ladder(d, 0);
        const rs = [Lang.say({ fn: "Order", ladders: [lad], withWhen: true })];
        Cook.Order.rows(lad, { all: true }).forEach((r) => r.parts && r.parts.length && rs.push(Lang.say(itemFromParts(r.parts))));
        rs.forEach((r) => {
          said++;
          r.gaps.forEach((g) => {
            const key = g.kind === "rule" ? `rule ${g.id}: "${g.what}"` : g.kind === "lexeme" ? `lexeme ${g.lex} ("${g.what}")` : g.kind === "feature" ? `feature gender of ${g.lex} (said "${g.defaulted}")` : `audio "${g.what}"`;
            count.set(key, (count.get(key) || 0) + 1);
          });
        });
      }
}
const rows = [...count.entries()].sort((a, b) => b[1] - a[1]);
if (process.argv.includes("--json")) console.log(JSON.stringify({ said, rows }, null, 1));
else {
  console.log(`${said} results; gaps met (how often):`);
  for (const k of ["rule", "lexeme", "feature", "audio"]) {
    const rr = rows.filter(([g]) => g.startsWith(k));
    console.log(`\n${k}: ${rr.length} distinct`);
    rr.slice(0, 25).forEach(([g, n]) => console.log(`  ${n}x ${g}`));
  }
  const { GAPS } = await import("../../js/core/lang/index.js");
  console.log("\nthe adapter's own list:");
  GAPS.forEach((g) => console.log(`  ${g.id}: ${g.what}`));
}

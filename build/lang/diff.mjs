#!/usr/bin/env node
// Read-only: rebuild data/lang in memory (import_all's buildStore) and list how it differs from the committed
// data/lang/*.json. Writes nothing. Exit 1 if anything differs, so it can gate a rebuild (S05 plan, flaw 2):
//   node build/lang/diff.mjs [--all]     (--all prints every changed field, not only confirmation demotions)
import { buildStore, dataOf, compare } from "./import_all.mjs";

const { S } = buildStore();
const { out, demotions } = compare(dataOf(S));
for (const d of process.argv.includes("--all") ? out : demotions) console.log(`${d.p}: ${JSON.stringify(d.was)} -> ${JSON.stringify(d.now)}`);
console.log(`${out.length} differences, ${demotions.length} confirmation demotions`);
process.exit(out.length ? 1 : 0);

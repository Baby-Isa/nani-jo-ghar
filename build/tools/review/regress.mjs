#!/usr/bin/env node
// Regression lookup: given screens/flows (or the mapper's output), list the regression rows to recheck (id, status, one line).
import { readFileSync } from "node:fs";
import { args, help, die, more } from "./lib/common.mjs";
import { loadRegressions, plain, statusKind, rowsForFlow, CONTRACT_ROWS } from "./lib/regressions.mjs";

const HELP = `
node build/tools/review/regress.mjs <flow,flow,...> [--shared] [--keep] [--status open,built] [--all-rows] [--max N]
node build/tools/review/touched.mjs --json | node build/tools/review/regress.mjs --stdin
  Lists the rows of docs/process/regressions.md to recheck for the given sandbox flow ids (a base id covers its levels and paths:
  clinic:heal-cut, cook:chai-tray, clinic:waiting, first, house, mode:tidy ...). One line each: id, status, check, the issue.
  Rows come from the flow's own section (Cook: chai, Clinic > Waiting room, Heal games ...) and, for a heal game, only the rows about it
  (plus the rows about every heal game). Cook: general rows are listed when they name the station.
  --shared      also the Shared components rows (order card, end screen, buttons, layout): the mapper's JSON asks for this by itself
                when a shared file changed
  --keep        also the "Keep (liked)" rows        --status a,b  only these kinds: open, reopened, built, fixed (default: all but retired)
  --all-rows    every row of the sections found     --max N  rows per flow before "... and N more" (default 40)
Reads docs/process/regressions.md only. No network.`;
const a = args(); help(HELP, a);

let flowIds = a.pos.join(",").split(",").map((s) => s.trim()).filter(Boolean), wantShared = a.has("shared");
if (a.has("stdin")) { const j = JSON.parse(readFileSync(0, "utf8")); flowIds = j.flows || []; if (j.sharedTouched) wantShared = true; }
if (!flowIds.length) die("Name the flows (clinic:heal-cut,cook:chai-tray ...) or pipe touched.mjs --json into --stdin. --help shows more.");
const rows = loadRegressions();
const kinds = a.val("status") ? new Set(a.val("status").split(",")) : null;
const MAX = +a.val("max", 40);

// the flow -> rows mapping lives in lib/regressions.mjs (sprintcheck.mjs inverts it: rows -> flows)
export { CONTRACT_ROWS };
const pick = (id) => rowsForFlow(id, rows);
const line = (r) => `  ${r.id.padEnd(7)} ${statusKind(r.status).padEnd(8)} ${plain(r.check).slice(0, 38).padEnd(38)} ${plain(r.issue).slice(0, 96)}`;
let total = new Set();
for (const id of flowIds) {
  let rs = a.has("all-rows") ? rows.filter((r) => pick(id).some((p) => p.h2 === r.h2)) : pick(id);
  if (kinds) rs = rs.filter((r) => kinds.has(statusKind(r.status))); else rs = rs.filter((r) => statusKind(r.status) !== "retired");
  rs.forEach((r) => total.add(r.id));
  console.log(`${id}: ${rs.length} rows`);
  more(rs, MAX, line);
}
if (wantShared) {
  const rs = rows.filter((r) => r.h2 === "Shared components" && (!kinds || kinds.has(statusKind(r.status))) && statusKind(r.status) !== "retired" && !total.has(r.id));
  rs.forEach((r) => total.add(r.id));
  console.log(`shared components (a shared file changed): ${rs.length} rows`);
  more(rs, MAX, line);
}
if (a.has("keep")) { const rs = rows.filter((r) => /^Keep/.test(r.h2)); console.log(`keep (liked, must not regress): ${rs.length} rows`); more(rs, MAX, line); }
console.log(`checked by the contract run on every flow (--check fails on a break): ${Object.entries(CONTRACT_ROWS).map(([k, v]) => `${k}: ${v.join(", ")}`).join("; ")}`);
console.log(`${total.size} distinct rows to recheck${wantShared ? "" : "; add --shared for the Shared components rows"}.`);

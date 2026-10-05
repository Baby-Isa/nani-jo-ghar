#!/usr/bin/env node
// Regression lookup: given screens/flows (or the mapper's output), list the regression rows to recheck (id, status, one line).
import { readFileSync } from "node:fs";
import { args, help, die, more } from "./lib/common.mjs";
import { loadRegressions, plain, statusKind } from "./lib/regressions.mjs";

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

const HEAL = { cut: /scrape|plaster|\bcut\b|graze/i, knee: /knee|bandage|wrap/i, ear: /\bear\b|wax|cotton/i, tooth: /tooth|teeth|brush/i, taste: /taste|drink|soothing|thundo/i, fever: /fever|thermometer|\bfan\b/i, boing: /boing|lolli|bead/i, eye: /\beye\b|veg/i, foot: /\bfoot\b|toes|tweezer|splinter/i, tummy: /tummy/i, hic: /\bhic\b/i, hair: /\bhair\b/i };
const CANON = { cut: /scrape|\bcut\b/i, knee: /\bknee\b/i, ear: /\bear\b/i, tooth: /\btooth\b/i, taste: /\btaste\b|drinks/i, fever: /\bfever\b/i, boing: /\bboing\b/i, eye: /\beye\b/i, foot: /\bfoot\b/i, tummy: /\btummy\b/i, hic: /\bhic\b/i, hair: /\bhair\b/i };
const GENERIC_HEAL = /every heal|each heal|all heal|heal game|heal card|every game|each game/i;
const COOK_SECTION = { fetch: "pantry", "chai-tray": "chai", chai: "chai", "maani-line": "maani", maani: "maani", daar: "daar", daal: "daar", chop: "chaat", tadka: "chaat", stir: "chaat", assemble: "chaat", chaat: "chaat", samosa: "samosa", "mishkaki-grill": "sekelo", mishkaki: "sekelo", grill: "sekelo" };
const text = (r) => plain(`${r.issue} ${r.check}`);

function pick(id) {
  const out = [];
  const inSec = (re, h3re) => rows.filter((r) => re.test(r.h2) && (!h3re || h3re.test(r.h3)));
  let m;
  if ((m = /^clinic:heal-(?:extra-)?(\w+)/.exec(id))) {
    const g = m[1], me = HEAL[g], mine = CANON[g], others = Object.entries(CANON).filter(([k]) => k !== g).map(([, v]) => v);
    for (const r of inSec(/^Clinic$/, /Heal games|Clinic-wide/)) {
      const t = plain(r.issue), namesOther = others.some((o) => o.test(t));
      if (mine && mine.test(t)) out.push(r);
      else if (GENERIC_HEAL.test(t)) out.push(r);
      else if (namesOther) continue;
      else if ((me && me.test(t)) || r.h3 === "Heal games" || (/heal|zoom|card|help/i.test(t))) out.push(r);
    }
  } else if ((m = /^clinic:(waiting|diagnosis|pharmacy|sendoff)/.exec(id))) {
    const names = { waiting: /Waiting room/, diagnosis: /Diagnosis/, pharmacy: /Pharmacy/, sendoff: /Send-off/ };
    out.push(...inSec(/^Clinic$/, names[m[1]]), ...inSec(/^Clinic$/, /Clinic-wide/));
  } else if (id === "clinic:patient" || id === "clinic:morning") out.push(...inSec(/^Clinic$/, /Clinic-wide/));
  else if ((m = /^cook:(?:recipe:)?([\w-]+)/.exec(id)) && COOK_SECTION[m[1]]) {
    const sec = COOK_SECTION[m[1]], key = new RegExp(`\\b${m[1].replace("-", "[- ]")}\\b`, "i");
    out.push(...rows.filter((r) => r.h2 === `Cook: ${sec}`), ...rows.filter((r) => r.h2 === "Cook: general" && key.test(text(r))));
  } else if (id.startsWith("cook:")) out.push(...rows.filter((r) => r.h2 === "Cook: general"));
  else if (id === "first" || id === "house" || id === "rotate-card") out.push(...rows.filter((r) => /^First launch/.test(r.h2)));
  else if (id.startsWith("mode:")) out.push(...rows.filter((r) => /^Other modes/.test(r.h2)));
  return [...new Set(out)];
}
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
console.log(`${total.size} distinct rows to recheck${wantShared ? "" : "; add --shared for the Shared components rows"}.`);

// Parser for docs/process/regressions.md: rows with their section, status and check; and the flow -> rows mapping that
// regress.mjs prints and sprintcheck.mjs inverts (rows -> flows).
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./common.mjs";

export const REGRESSIONS = join(ROOT, "docs", "process", "regressions.md");
export function parseRegressions(text) {
  const rows = [];
  let h2 = "", h3 = "";
  for (const line of String(text).split("\n")) {
    let m;
    if ((m = /^## (.*)/.exec(line))) { h2 = m[1].trim(); h3 = ""; continue; }
    if ((m = /^### (.*)/.exec(line))) { h3 = m[1].trim(); continue; }
    if (!/^\| [A-Z][A-Z]*-[A-Z0-9-]*\d+ \|/.test(line)) continue;
    const c = line.replace(/^\|\s*/, "").replace(/\s*\|\s*$/, "").split(/ \| /);
    if (c.length < 4) continue;
    rows.push({ id: c[0].trim(), issue: c[1].trim(), status: c[2].trim(), check: c[3].trim(), source: (c[4] || "").trim(), h2, h3 });
  }
  return rows;
}
export function loadRegressions(file = REGRESSIONS) { return parseRegressions(readFileSync(file, "utf8")); }
export const plain = (s) => s.replace(/\*\*|`|\*/g, "").replace(/\s+/g, " ").trim();
// "open", "reopened", "built, not re-played", "fixed", "open (unverified)", "retired" ...
export const statusKind = (s) => { const t = plain(s).toLowerCase(); return t.startsWith("reopened") ? "reopened" : t.startsWith("open") ? "open" : t.startsWith("built") ? "built" : t.startsWith("fixed") ? "fixed" : t.startsWith("retired") ? "retired" : t.startsWith("keep") ? "keep" : "other"; };

// the rows the contract run checks on every flow (decision 75; build/sandbox/lib/contract.mjs): a contract break names its check
export const CONTRACT_ROWS = { "contract-1 popup": ["SH-64", "CHT-10", "CHAI-15", "CK-29"], "contract-2 moves-on": ["SH-40", "CLN-92", "CLN-110"], "contract-3 voice": ["SH-66"], "contract-4 bubble": ["SH-68", "CLN-86"], "contract-5 badges": ["SH-67"], "contract-6 old-art": ["DAAR-13", "ART-17", "ART-13"], "contract-7 one-voice": ["PAN-04"], "contract-8 highlight": ["SH-53"], "contract-9 closed-card": ["CLN-114"], "contract-10 your-turn": ["SH-71"], "contract-11 background": ["PAN-14", "ART-05"], "contract-12 greyed": ["SH-23"], "contract-13 stale-ui": ["CLN-06"], "contract-14 talk": ["ART-18"] };
// row id -> the contract checks that cover it ("contract-1" ...)
export function contractChecksOf(id) { return Object.entries(CONTRACT_ROWS).filter(([, ids]) => ids.includes(id)).map(([k]) => k.split(" ")[0]); }

const HEAL = { cut: /scrape|plaster|\bcut\b|graze/i, knee: /knee|bandage|wrap/i, ear: /\bear\b|wax|cotton/i, tooth: /tooth|teeth|brush/i, taste: /taste|drink|soothing|thundo/i, fever: /fever|thermometer|\bfan\b/i, boing: /boing|lolli|bead/i, eye: /\beye\b|veg/i, foot: /\bfoot\b|toes|tweezer|splinter/i, tummy: /tummy/i, hic: /\bhic\b/i, hair: /\bhair\b/i };
const CANON = { cut: /scrape|\bcut\b/i, knee: /\bknee\b/i, ear: /\bear\b/i, tooth: /\btooth\b/i, taste: /\btaste\b|drinks/i, fever: /\bfever\b/i, boing: /\bboing\b/i, eye: /\beye\b/i, foot: /\bfoot\b/i, tummy: /\btummy\b/i, hic: /\bhic\b/i, hair: /\bhair\b/i };
const GENERIC_HEAL = /every heal|each heal|all heal|heal game|heal card|every game|each game/i;
export const COOK_SECTION = { fetch: "pantry", "chai-tray": "chai", chai: "chai", "maani-line": "maani", maani: "maani", daar: "daar", daal: "daar", chop: "chaat", tadka: "chaat", stir: "chaat", assemble: "chaat", chaat: "chaat", samosa: "samosa", "mishkaki-grill": "sekelo", mishkaki: "sekelo", grill: "sekelo" };

// the rows of `rows` to recheck for one sandbox flow id (a base id stands for its levels and paths). Rows come from the flow's own
// section and, for a heal game, only the rows about it (plus the rows about every heal game); Cook: general rows when they name the station.
export function rowsForFlow(id, rows) {
  const text = (r) => plain(`${r.issue} ${r.check}`);
  const out = [];
  // lab.html's Cook tiles (lab:cook/<game>) are Cook's own stations and recipes through the host
  if (id.startsWith("lab:cook/")) {
    const g = id.slice(9).replace(/^recipe-/, "");
    if (g === "round") return [...new Set([...rowsForFlow("cook:fetch", rows), ...rowsForFlow("cook:chai", rows)])];
    return rowsForFlow(`cook:${g}`, rows);
  }
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
// the inverse: row id -> the flow ids (of `flowIds`) whose lookup lists it
export function flowsForRows(rows, flowIds) {
  const out = new Map(rows.map((r) => [r.id, []]));
  for (const id of flowIds) for (const r of rowsForFlow(id, rows)) if (out.has(r.id)) out.get(r.id).push(id);
  return out;
}

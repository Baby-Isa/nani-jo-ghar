// Parser for the regression rows: the live fix list (docs/process/regressions.md: open, reopened, waiting, keep) and the done
// archive (docs/archive/regressions-done.md: built, fixed, retired; decision 99). Rows with their section, status and check; and the
// flow -> rows mapping that regress.mjs prints and sprintcheck.mjs inverts (rows -> flows). Every reader sees both files.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { ROOT } from "./common.mjs";

export const REGRESSIONS = join(ROOT, "docs", "process", "regressions.md");
export const REGRESSIONS_DONE = join(ROOT, "docs", "archive", "regressions-done.md");
export const REGRESSION_PATHS = ["docs/process/regressions.md", "docs/archive/regressions-done.md"];
// both files as one text (the live list first); a missing archive reads as empty
export function readAllRegressions() { return [REGRESSIONS, REGRESSIONS_DONE].map((f) => existsSync(f) ? readFileSync(f, "utf8") : "").join("\n"); }
// the same at a git ref (before the 13 Oct split the archive did not exist, so the old single file is the whole list)
export function gitRegressions(ref) {
  const show = (p) => { try { return execFileSync("git", ["show", `${ref}:${p}`], { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 28, stdio: ["ignore", "pipe", "ignore"] }); } catch { return ""; } };
  return REGRESSION_PATHS.map(show).join("\n");
}
const ROWLINE = /^\| ([A-Z][A-Z]*-[A-Z0-9-]*\d+) \|/;
// move the rows `ids` from the archive text to the live text, each under its own ## / ### heading (added at the end of the live
// list, before Keep, when the live list has no such section). Returns {live, done, moved}.
export function moveRows(liveText, doneText, ids) {
  const want = new Set(ids), moved = [];
  const dl = doneText.split("\n"), keepDone = [], take = [];
  let h2 = "", h3 = "", header = [];
  for (const l of dl) {
    let m;
    if ((m = /^## (.*)/.exec(l))) { h2 = l; h3 = ""; keepDone.push(l); continue; }
    if (/^### /.test(l)) { h3 = l; keepDone.push(l); continue; }
    if (/^\| ID \||^\|---/.test(l)) { header = header.length >= 2 ? [l] : [...header, l]; keepDone.push(l); continue; }
    if ((m = ROWLINE.exec(l)) && want.has(m[1])) { take.push({ h2, h3, header: [...header], line: l }); moved.push(m[1]); continue; }
    keepDone.push(l);
  }
  let ll = liveText.split("\n");
  for (const t of take) {
    // find the live section: the ### under the ## if any, else the ##
    let i2 = ll.indexOf(t.h2), at = -1;
    if (i2 >= 0) {
      let end = ll.findIndex((l, k) => k > i2 && /^## /.test(l)); if (end < 0) end = ll.length;
      let start = i2;
      if (t.h3) { const i3 = ll.findIndex((l, k) => k > i2 && k < end && l === t.h3); if (i3 >= 0) { start = i3; const e3 = ll.findIndex((l, k) => k > i3 && /^#{2,3} /.test(l)); end = e3 < 0 ? end : Math.min(end, e3); } else start = -1; }
      if (start >= 0) { for (let k = start; k < end; k++) if (ROWLINE.test(ll[k]) || /^\|---/.test(ll[k])) at = k; }
    }
    if (at >= 0) { ll.splice(at + 1, 0, t.line); continue; }
    const block = ["", t.h2, ...(t.h3 ? ["", t.h3] : []), "", ...t.header, t.line];
    const keep = ll.findIndex((l) => /^## Keep/.test(l));
    ll.splice(keep < 0 ? ll.length : keep, 0, ...block, "");
  }
  return { live: ll.join("\n").replace(/\n{3,}/g, "\n\n"), done: keepDone.join("\n"), moved };
}
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
export function loadRegressions(file) { return parseRegressions(file ? readFileSync(file, "utf8") : readAllRegressions()); }
export const plain = (s) => s.replace(/\*\*|`|\*/g, "").replace(/\s+/g, " ").trim();
// "open", "reopened", "waiting on art", "built, not re-played", "fixed", "open (unverified)", "retired" ...
// Zafar, 21 Oct: an open row's status starts with its label (to fix: code/check, waiting on Zafar/Mum/art)
const LABEL_RE = /^(?:to fix: (?:code|check)|waiting on (?:zafar|mum|art)|before app store)\b/;
export const statusKind = (s) => { const t = plain(s).toLowerCase(); if (LABEL_RE.test(t)) return /\breopened\b/.test(t) ? "reopened" : "open"; return t.startsWith("reopened") ? "reopened" : t.startsWith("open") ? "open" : t.startsWith("built") ? "built" : t.startsWith("fixed") ? "fixed" : t.startsWith("retired") ? "retired" : t.startsWith("keep") ? "keep" : "other"; };

// the rows the contract run checks on every flow (decision 75; build/sandbox/lib/contract.mjs): a contract break names its check
export const CONTRACT_ROWS = {"contract-72 row-glide": ["SH-152", "CHAI-39"], "contract-75 skip-zone": ["SH-157"], "contract-76 pop-face": ["SH-154"], "contract-77 timed-hold": ["SH-158"], "contract-78 call-light": ["CHAI-40"], "contract-79 card-light": ["CHAI-42"], "contract-80 no-jump": ["CHAI-45"], "contract-81 over-gauge": ["CHAI-46"], "contract-82 edge-on-face": ["CHAI-47"], "contract-83 card-on-face": ["SH-154", "CHAI-43"], "contract-84 light-clear": ["SH-164"], "contract-85 replay": ["SH-161"], "contract-86 bubble-clear": ["SH-166"], "contract-1 popup": ["SH-64", "CHT-10", "CHAI-15", "CK-29"], "contract-2 moves-on": ["SH-40", "CLN-92", "CLN-110"], "contract-3 voice": ["SH-66"], "contract-4 bubble": ["SH-68", "CLN-86", "CLN-146"], "contract-5 badges": ["SH-67"], "contract-6 old-art": ["DAAR-13", "ART-17", "ART-13", "CK-52"], "contract-7 one-voice": ["PAN-04"], "contract-8 highlight": ["SH-53", "SH-79", "CK-34", "CLN-143", "CLN-144", "CLN-145", "CK-41"], "contract-9 closed-card": ["CLN-114"], "contract-10 your-turn": ["SH-71"], "contract-11 background": ["PAN-14", "ART-05"], "contract-12 greyed": ["SH-23"], "contract-13 stale-ui": ["CLN-06"], "contract-14 talk": ["ART-18"], "contract-15 words-whole": ["SH-73", "CLN-153"], "contract-16 english": ["LNG-01", "PAN-10", "SH-85", "MOD-09", "MOD-10", "CK-42", "LNG-15", "SH-92"], "contract-17 voice-src": ["LNG-06", "LNG-14"], "contract-18 card-rows": ["SH-10", "SEK-13", "DAAR-19", "DAAR-23", "CLN-131", "CLN-141"], "contract-19 counting": ["DAAR-18", "DAAR-24", "SH-92"], "contract-20 one-face": ["CLN-85", "CLN-139", "CLN-149", "DAAR-25", "CK-40"], "contract-21 input-live": ["CLN-152", "CK-43", "CK-45"], "contract-22 once-whole": ["PAN-04", "PAN-16", "CHAI-21"], "contract-23 item-word": ["SH-94"], "contract-24 help-ladder": ["SH-60", "SH-95"], "contract-25 bulb-pulse": ["SH-96"], "contract-26 opening": ["LNG-16"], "contract-27 peek-whole": ["SH-98"], "contract-28 one-bulb": ["SH-98"], "contract-29 peek-time": ["SH-98"], "contract-30 written": ["SH-99"], "contract-31 free-replay": ["SH-102"], "contract-32 divider": ["SH-103"], "contract-33 headline-size": ["SH-107"], "contract-34 go-arrow": ["SH-106"], "contract-35 card-ladder": ["SH-110", "SAM-26", "MAA-18"], "contract-36 step-call": ["SH-110", "SEK-18", "SH-133"], "contract-37 decoys": ["CK-49", "SH-132"], "contract-50 one-tick": ["SAM-24", "SAM-27"], "contract-51 inside-card": ["SH-142", "SH-138"], "contract-52 bubble-clear": ["CK-18", "SH-145", "SH-138"], "contract-53 one-in-light": ["CHAI-33", "SH-138"], "contract-54 rail-in-side": ["CK-53", "SH-138"]};
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

#!/usr/bin/env node
// Status counts: rebuild the numbers of the "Open feedback" table in docs/status.md from docs/process/regressions.md.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { args, help, ROOT, die } from "./lib/common.mjs";
import { loadRegressions, statusKind } from "./lib/regressions.mjs";

const HELP = `
node build/tools/review/statuscounts.mjs [--write]
  Counts the rows of docs/process/regressions.md per area (open or reopened; built, not re-played) and prints the "Open feedback" table of
  docs/status.md with the numbers rebuilt. Only the leading number of each cell (or of each "a / b / c" part) changes; the words after it
  ("including ...") stay as written. Prints which cells changed. --write updates docs/status.md. Retired and keep rows are not counted.`;
const a = args(); help(HELP, a);

const rows = loadRegressions();
const sections = (names) => rows.filter((r) => names.some((n) => (typeof n === "string" ? r.h2 === n : n.test(r.h2))));
const count = (rs) => ({ open: rs.filter((r) => ["open", "reopened"].includes(statusKind(r.status))).length, built: rs.filter((r) => statusKind(r.status) === "built").length });
// area label (as the status table writes it, matched by its start) -> the sections it covers (several = a " / " split cell)
const AREAS = [
  [/^Shared components/, [["Shared components"]]],
  [/^Cook: pantry/, [["Cook: pantry"]]],
  [/^Cook: chai/, [["Cook: chai"], ["Cook: maani"], ["Cook: daar"], ["Cook: chaat"], ["Cook: samosa"], ["Cook: sekelo"], ["Cook: general"]]],
  [/^Clinic/, [["Clinic"]]],
  [/^First launch/, [["First launch and shell"]]],
  [/^Other modes/, [["Other modes"]]],
  [/^Art/, [[/^Art/]]],
  [/^Language and audio/, [["Language and audio"]]],
];
const file = join(ROOT, "docs", "status.md");
const lines = readFileSync(file, "utf8").split("\n");
const start = lines.findIndex((l) => /^## Open feedback/.test(l));
if (start < 0) die("No '## Open feedback' section in docs/status.md.");
const retab = (cell, nums) => { // replace the leading integer of each " / " part
  const parts = cell.split(" / ");
  if (parts.length !== nums.length) return nums.length === 1 ? cell.replace(/^\d+/, String(nums[0])) : nums.join(" / ");
  return parts.map((p, i) => (/^\d+/.test(p.trim()) ? p.replace(/\d+/, String(nums[i])) : String(nums[i]))).join(" / ");
};
const changes = [], stale = [];
for (let i = start; i < lines.length && !/^---\s*$/.test(lines[i]); i++) {
  if (!/^\|/.test(lines[i]) || /^\|[-| ]+\|$/.test(lines[i]) || /^\| Area/.test(lines[i])) continue;
  const cells = lines[i].split("|").slice(1, -1).map((c) => c.trim());
  const area = AREAS.find(([re]) => re.test(cells[0]));
  if (!area) { console.error(`unknown area, left as is: ${cells[0]}`); continue; }
  const counts = area[1].map((names) => count(sections(names)));
  const before = [cells[1], cells[2]];
  cells[1] = retab(cells[1], counts.map((c) => c.open));
  cells[2] = retab(cells[2], counts.map((c) => c.built));
  if (before[0] !== cells[1] || before[1] !== cells[2]) changes.push(`${cells[0].slice(0, 40)}: open ${before[0].match(/^[\d / ]+/)?.[0].trim()} -> ${cells[1].match(/^[\d / ]+/)?.[0].trim()}; built ${before[1]} -> ${cells[2]}`);
  for (const id of new Set(cells[1].match(/\b[A-Z]{2,4}-\d+\b/g) || [])) { const r = rows.find((x) => x.id === id); if (r && !(["open", "reopened"].includes(statusKind(r.status)))) stale.push(`${id} is named as open in the prose but is now "${statusKind(r.status)}"; edit the words by hand`); else if (r && /reopened/.test(cells[1]) && statusKind(r.status) !== "reopened" && new RegExp(id + " reopened").test(cells[1].replace(/\*\*/g, ""))) stale.push(`${id} is called reopened in the prose but is "${statusKind(r.status)}"`); }
  lines[i] = `| ${cells.join(" | ")} |`;
}
const table = lines.slice(start, lines.findIndex((l, i) => i > start && /^---\s*$/.test(l))).filter((l) => /^\|/.test(l));
if (a.has("write")) { writeFileSync(file, lines.join("\n")); console.log(`docs/status.md updated: ${changes.length} rows changed`); }
else console.log(table.join("\n"));
const total = count(rows.filter((r) => !/^(Keep|Retired|Process)/.test(r.h2)));
console.log(`\n${changes.length ? "Cells that changed:\n  " + changes.join("\n  ") : "No cell changed: the table already matches regressions.md."}\n${stale.length ? "Prose to check by hand:\n  " + stale.join("\n  ") + "\n" : ""}Total (all areas above): ${total.open} open or reopened, ${total.built} built, not re-played.${a.has("write") ? "" : "\nRun with --write to update docs/status.md."}`);

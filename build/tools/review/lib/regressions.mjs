// Parser for docs/process/regressions.md: rows with their section, status and check.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./common.mjs";

export function loadRegressions(file = join(ROOT, "docs", "process", "regressions.md")) {
  const rows = [];
  let h2 = "", h3 = "";
  for (const line of readFileSync(file, "utf8").split("\n")) {
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
export const plain = (s) => s.replace(/\*\*|`|\*/g, "").replace(/\s+/g, " ").trim();
// "open", "reopened", "built, not re-played", "fixed", "open (unverified)", "retired" ...
export const statusKind = (s) => { const t = plain(s).toLowerCase(); return t.startsWith("reopened") ? "reopened" : t.startsWith("open") ? "open" : t.startsWith("built") ? "built" : t.startsWith("fixed") ? "fixed" : t.startsWith("retired") ? "retired" : t.startsWith("keep") ? "keep" : "other"; };

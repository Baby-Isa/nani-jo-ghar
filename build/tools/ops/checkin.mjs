#!/usr/bin/env node
// Check-in summary: what landed since the last check-in, the art count on main and the sessions status.md lists; --log appends the line.
import { existsSync, readFileSync, writeFileSync, appendFileSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { ROOT, args, help, gitSoft, branch, ukStamp, fromUk, logLine, LOG, STATUS } from "./lib.mjs";

// Days before today move out of the live log into docs/process/overnight-log/<date>.md (one file per day, appended to).
function rotateLog() {
  const today = ukStamp().slice(0, 10), dir = join(ROOT, "docs", "process", "overnight-log");
  const keep = [], moved = {};
  for (const l of readFileSync(LOG, "utf8").split("\n")) {
    const d = (/^- (\d{4}-\d\d-\d\d) /.exec(l) || [])[1];
    if (d && d < today) (moved[d] ||= []).push(l); else keep.push(l);
  }
  const days = Object.keys(moved).sort();
  if (!days.length) return;
  mkdirSync(dir, { recursive: true });
  for (const d of days) {
    const f = join(dir, `${d}.md`);
    if (!existsSync(f)) writeFileSync(f, `# Overnight log, ${d} (times UK)\n\n`);
    appendFileSync(f, moved[d].join("\n") + "\n");
  }
  writeFileSync(LOG, keep.join("\n"));
  console.log(`Rotated ${days.join(", ")} to docs/process/overnight-log/.`);
}
// the last "Check-in" line: today's live log first, then the newest dated file
function lastCheckin() {
  const dir = join(ROOT, "docs", "process", "overnight-log"), re = /^- \d{4}-\d\d-\d\d \d\d:\d\d UK · Check-in/;
  const files = [LOG, ...(existsSync(dir) ? readdirSync(dir).filter((f) => /^\d{4}-\d\d-\d\d\.md$/.test(f)).sort().reverse().map((f) => join(dir, f)) : [])];
  for (const f of files) { const l = readFileSync(f, "utf8").split("\n").filter((x) => re.test(x)).pop(); if (l) return l; }
  return null;
}

const HELP = `
node build/tools/ops/checkin.mjs [--since "YYYY-MM-DD HH:MM"] [--art dir] [--art-target 115] [--log] [--note "text"] [--no-fetch]
  Prints, in a few lines:
    - commits on this branch (after git fetch) since the last "Check-in" line of the overnight log, docs/process/overnight-log.md or the newest dated file in docs/process/overnight-log/ (or --since, UK time),
      grouped by their session tag ("T2:", "4e:", ...)
    - reports added under build/reports/ in that time
    - art on main: images under --art (default sources/art/clinic-heal-v3) on origin/main, against --art-target (default 115)
    - the sessions docs/status.md "Next chat" lists (session id, what it is, and whether its report has landed)
  --log appends one line to the overnight log ("Check-in: ..."), first moving earlier days to docs/process/overnight-log/<date>.md; with --note added (your one-line judgement of the screenshots).
  Git only; no other network.`;
const a = args(); help(HELP, a);
const br = branch();
if (!a.has("no-fetch")) gitSoft("fetch", "-q", "origin", br, "main");
const ref = gitSoft("rev-parse", "--verify", "-q", `origin/${br}`) ? `origin/${br}` : "HEAD";

// since when
let since = a.val("since") ? fromUk(a.val("since")) : null;
if (!since) {
  const last = lastCheckin();
  since = last ? fromUk(last.slice(2, 18)) : new Date(Date.now() - 3600e3);
}
const iso = since.toISOString();
console.log(`Since ${ukStamp(since)} UK (${a.val("since") ? "--since" : "last check-in"}), branch ${ref}`);

// commits, grouped by session tag
const commits = gitSoft("log", ref, `--since=${iso}`, "--no-merges", "--format=%h\t%s").split("\n").filter(Boolean).map((l) => l.split("\t"));
const tags = {};
for (const [, s] of commits) { const t = (/^([\w.-]{1,12})(?: \([^)]*\))?:/.exec(s) || [, "other"])[1]; (tags[t] ||= []).push(s.replace(/^[\w.-]{1,12}(?: \([^)]*\))?:\s*/, "")); }
console.log(`Commits: ${commits.length}${commits.length ? ` (${Object.entries(tags).map(([t, l]) => `${t} ${l.length}`).join(", ")})` : ""}`);
for (const [t, l] of Object.entries(tags)) console.log(`  ${t}: ${l[0].slice(0, 110)}${l.length > 1 ? ` (+${l.length - 1})` : ""}`);

// reports landed
const reports = [...new Set(gitSoft("log", ref, `--since=${iso}`, "--diff-filter=A", "--name-only", "--format=", "--", "build/reports/").split("\n").filter(Boolean))];
console.log(`Reports landed: ${reports.length ? reports.map((r) => r.replace("build/reports/", "")).join(", ") : "none"}`);

// art on main
const artDir = a.val("art", "sources/art/clinic-heal-v3"), target = +a.val("art-target", 115);
const art = gitSoft("ls-tree", "-r", "--name-only", "origin/main", artDir).split("\n").filter((f) => /\.(png|webp|jpe?g)$/i.test(f));
const artNew = gitSoft("log", "origin/main", `--since=${iso}`, "--diff-filter=A", "--name-only", "--format=", "--", artDir).split("\n").filter(Boolean).length;
console.log(`Art on main: ${art.length} of ${target} in ${artDir} (${artNew} new since)`);

// sessions in status.md "Next chat"
const status = existsSync(STATUS) ? readFileSync(STATUS, "utf8") : "";
const next = status.slice(status.indexOf("## Next chat"), status.indexOf("\n## ", status.indexOf("## Next chat") + 5));
const seen = new Map(), ids = [...next.matchAll(/`(session_\w+)`/g)];
ids.forEach((m, i) => {
  if (seen.has(m[1])) return;
  const lineStart = next.lastIndexOf("\n", m.index) + 1, prevEnd = i && ids[i - 1].index > lineStart ? ids[i - 1].index + ids[i - 1][0].length : lineStart;
  const before = next.slice(prevEnd, m.index), after = next.slice(m.index + m[0].length, i + 1 < ids.length ? ids[i + 1].index : undefined).split("\n")[0];
  const label = (before.split(/[;.]\s|\),\s|:\*\*\s/).pop() || "").replace(/\*\*|Running:?|\d\.\s/g, "").replace(/^[\s,:)-]+|[\s,(:-]+$/g, "").trim();
  const rep = (/`([\w.-]+\.md)`/.exec(after.split(/\)[,;.]/)[0]) || [])[1];
  const landed = rep && existsSync(join(ROOT, "build", "reports", rep));
  seen.set(m[1], `${m[1]}  ${label.slice(-60)}${rep ? `  report ${rep}: ${landed ? "landed" : "not yet"}` : ""}`);
});
console.log(`Sessions in status.md: ${seen.size}`);
for (const s of seen.values()) console.log(`  ${s}`);

if (a.has("log")) {
  rotateLog();
  const parts = [`Check-in: ${commits.length} commits${commits.length ? ` (${Object.entries(tags).map(([t, l]) => `${t} ${l.length}`).join(", ")})` : ""}`,
    reports.length ? `reports ${reports.map((r) => r.replace("build/reports/", "")).join(", ")}` : "", `art ${art.length} of ${target}`, a.val("note") || ""].filter(Boolean);
  console.log(`Logged: ${logLine(parts.join("; ") + ".")}`);
}

// The publish gate (checks-to-build 2; rules A30, B6, B20, C9, decision 89): publish.mjs refuses (not --force) while
//   a fix-list row is open or reopened without a note that it waits on Mum, art or Zafar;
//   checks.mjs is red (the doc limits are inside it);
//   the last full contract run (--gate, --all or the --contract route) has a break, or game files changed since it ran;
//   the last evidence run is older than the game files, or has batches nobody judged or verdicts nobody collected.
// Pure parts here (unit tested in publishgate.test.mjs); gather() reads the disk and git.
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { ROOT } from "../review/lib/common.mjs";
import { parseRegressions, statusKind, plain, REGRESSIONS } from "../review/lib/regressions.mjs";
import { parseVerdicts } from "../review/lib/evidence.mjs";

// a row that may stay open at a publish says what it waits on
export const WAITS = /\b(?:wait(?:s|ing)?\s+(?:on|for)|needs?)\s+(?:Mum|art|Zafar|his\b|the art|an art run)|two strikes: Zafar/i;
export const GAME_FILE = /^(?:js|css|data|assets)\/|^[^/]+\.html$/;

export function rowBlockers(md) {
  return parseRegressions(md).filter((r) => ["open", "reopened"].includes(statusKind(r.status)) && !WAITS.test(plain(r.status))).map((r) => r.id);
}
export function waiting(md) {
  return parseRegressions(md).filter((r) => ["open", "reopened"].includes(statusKind(r.status)) && WAITS.test(plain(r.status))).map((r) => r.id);
}
// contract: {scope, breaks, commit, changed: [game files since]} | null; evidence: {run, changed, unjudged: [ids], uncollected: [ids]} | null
export function gateProblems({ rows = [], checks = { ok: true, failed: [] }, contract = null, evidence = null }) {
  const out = [];
  if (rows.length) out.push(`${rows.length} fixable rows still open (no "waiting on Mum/art/Zafar" note): ${rows.join(", ")}`);
  if (!checks.ok) out.push(`checks.mjs is red: ${checks.failed.join("; ") || "see its output"}`);
  if (!contract) out.push("no full contract run on record (sandbox/run.mjs --gate, --all --check, or --contract): run one");
  else {
    if (contract.breaks) out.push(`the last contract run (${contract.scope}, ${String(contract.commit).slice(0, 8)}) has ${contract.breaks} breaks`);
    if (contract.changed.length) out.push(`game files changed since the last contract run (${contract.changed.length}: ${contract.changed.slice(0, 4).join(", ")}${contract.changed.length > 4 ? ", ..." : ""}): run it again`);
  }
  if (!evidence) out.push("no evidence run on record (evidence.mjs --run --sprint): run, judge, collect and apply one");
  else {
    if (evidence.changed.length) out.push(`game files changed since evidence run ${evidence.run} (${evidence.changed.length}: ${evidence.changed.slice(0, 4).join(", ")}${evidence.changed.length > 4 ? ", ..." : ""}): run it again`);
    if (evidence.unjudged.length) out.push(`evidence run ${evidence.run} has rows nobody judged: ${evidence.unjudged.join(", ")}`);
    if (evidence.uncollected.length) out.push(`evidence run ${evidence.run} has verdicts not collected (evidence.mjs --collect): ${evidence.uncollected.join(", ")}`);
  }
  return out;
}

// ---------- reading the disk ----------
const git = (...a) => { const r = spawnSync("git", a, { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 26 }); return r.status === 0 ? r.stdout.trim() : null; };
export const changedSince = (commit) => { const d = commit ? git("diff", "--name-only", `${commit}`, "HEAD") : null; return d === null ? ["(the run's commit is not in this history)"] : d.split("\n").filter((f) => f && GAME_FILE.test(f)); };
const newest = (dir, file, ok = () => true) => {
  if (!existsSync(dir)) return null;
  const c = readdirSync(dir).map((d) => join(dir, d, file)).filter((p) => existsSync(p)).map((p) => ({ p, t: statSync(p).mtimeMs })).filter((x) => { try { return ok(JSON.parse(readFileSync(x.p, "utf8"))); } catch (e) { return false; } });
  return c.sort((a, b) => b.t - a.t)[0]?.p || null;
};
// a contract break a fix-list row covers while it waits on Mum, art or Zafar (build/tools/review/data/contract-known.json:
// [{check, flow, row}]) does not block a publish, as the row itself doesn't; the row must still say it waits
export function openBreaks(breaks, known, md) {
  const waits = new Set(parseRegressions(md).filter((r) => WAITS.test(plain(r.status))).map((r) => r.id));
  return breaks.filter((b) => !known.some((k) => k.check === b.check && (k.flow === b.flow || (k.flow.endsWith("*") && b.flow.startsWith(k.flow.slice(0, -1)))) && waits.has(k.row)));
}
export function lastContract() {
  const p = newest(join(ROOT, "build/screenshots/sandbox"), "contract-meta.json", (m) => ["gate", "all", "route"].includes(m.scope) && m.complete !== false);
  if (!p) return null;
  const m = JSON.parse(readFileSync(p, "utf8"));
  let breaks = m.breaks;
  try {
    const list = JSON.parse(readFileSync(join(p, "..", "contract.json"), "utf8"));
    const known = existsSync(join(ROOT, "build/tools/review/data/contract-known.json")) ? JSON.parse(readFileSync(join(ROOT, "build/tools/review/data/contract-known.json"), "utf8")) : [];
    breaks = openBreaks(list, known, readFileSync(REGRESSIONS, "utf8")).length;
  } catch (e) { /* no list: count them all */ }
  return { ...m, breaks, changed: changedSince(m.commit) };
}
export function lastEvidence() {
  const p = newest(join(ROOT, "build/screenshots/evidence"), "index.json");
  if (!p) return null;
  const dir = join(p, ".."), index = JSON.parse(readFileSync(p, "utf8")), run = dir.split("/").pop();
  let cache = {}; try { cache = JSON.parse(readFileSync(join(ROOT, "build/tools/review/data/verdicts.json"), "utf8")); } catch (e) { /* none yet */ }
  const unjudged = [], uncollected = [], jdir = join(dir, "judge");
  for (const f of existsSync(jdir) ? readdirSync(jdir).filter((x) => /^batch-.*\.verdicts\.md$/.test(x)) : []) {
    const t = readFileSync(join(jdir, f), "utf8"), v = parseVerdicts(t);
    const asked = [...t.matchAll(/^([A-Z][A-Z]*-[A-Z0-9-]*\d+) \|/gm)].map((m) => m[1]);
    const said = new Set(v.lines.map((l) => l.id));
    for (const id of asked) if (!said.has(id)) unjudged.push(id);
    for (const l of v.lines) if (l.verdict !== "EVIDENCE" && !(cache[l.id] && cache[l.id].run === run)) uncollected.push(l.id);
  }
  return { run, commit: index.commit, changed: changedSince(index.commit), unjudged, uncollected };
}
export function runChecks() {
  const r = spawnSync(process.execPath, [join(ROOT, "build/tools/review/checks.mjs")], { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 26 });
  const failed = (r.stdout || "").split("\n").filter((l) => /^FAIL/.test(l)).map((l) => l.replace(/^FAIL\s+/, "").trim());
  return { ok: r.status === 0, failed };
}
export function gather({ checks = true } = {}) {
  const md = readFileSync(REGRESSIONS, "utf8");
  return { rows: rowBlockers(md), waiting: waiting(md), checks: checks ? runChecks() : { ok: true, failed: [] }, contract: lastContract(), evidence: lastEvidence() };
}

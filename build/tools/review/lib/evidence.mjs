// The evidence loop's judging side (decision 82; build/tools/review/evidence.mjs). Pure (no browser, no git), unit tested:
//   rowOutcome(probes)                 a row's probes -> {tool: [why], expect: PASS|FAIL|null, line}: a failed probe is a tool failure (never
//                                      evidence); a row whose every probe has expects that all decided is decided by the machine
//   dhash(png) / near(a, b)            a panel's perceptual hash (9x8 difference hash of luminance) and a tolerant compare
//   fingerprint(parts)                 the cache key: row words + spec + text captures + the mode's tree hash (exact), panels (dhash, tolerant)
//   cacheHit(entry, fp)                does a cached verdict still stand for this evidence?
//   batches(rows, {visual, text})      rows to judge -> batches of 8-10 visual rows grouped by kind, text-only rows up to 30
//   parseVerdicts(text)                a reviewer's batch file -> {judge, lines: [{id, verdict, line, panel}], rejected: [...]}
//   applyVerdicts(md, verdicts, run)   regressions text -> new text: FAIL reopens, PASS marks built (keep and retired rows untouched);
//                                      the replaced statuses come back as `history` for build/tools/review/data/status-history.jsonl
import { createHash } from "node:crypto";
import { decodePng } from "./png.mjs";
import { parseRegressions, statusKind, plain } from "./regressions.mjs";

export const sha = (s) => createHash("sha256").update(typeof s === "string" ? s : JSON.stringify(s)).digest("hex").slice(0, 20);

// ---------- a row's outcome from its probe results ----------
// probes: [{reached, tool: [why], expects: [{raw, ok, why}], kind}]
export function rowOutcome(probes) {
  const tool = [];
  if (!probes.length) tool.push("no evidence spec for this row (build/sandbox/data/evidence.json)");
  for (const p of probes) for (const t of p.tool || []) tool.push(`${p.id || ""}: ${t}`);
  if (tool.length) return { tool, expect: null, line: "" };
  const allDecided = probes.every((p) => (p.expects || []).length && p.expects.every((e) => e.ok === true || e.ok === false));
  if (!allDecided) return { tool, expect: null, line: "" };
  const bad = probes.flatMap((p) => p.expects.filter((e) => e.ok === false).map((e) => `${p.id}: ${e.raw}: ${e.why}`));
  if (bad.length) return { tool, expect: "FAIL", line: `machine: ${bad.slice(0, 2).join("; ")}` };
  return { tool, expect: "PASS", line: `machine: ${probes.flatMap((p) => p.expects.map((e) => `${e.raw} (${e.why})`)).slice(0, 3).join("; ")}` };
}

// ---------- perceptual hash ----------
export function dhash(buf) {
  const { w, h, data } = decodePng(buf);
  const W = 9, H = 8, g = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    // the mean luminance of the cell
    const x0 = Math.floor((x * w) / W), x1 = Math.max(x0 + 1, Math.floor(((x + 1) * w) / W)), y0 = Math.floor((y * h) / H), y1 = Math.max(y0 + 1, Math.floor(((y + 1) * h) / H));
    let s = 0, n = 0;
    const sx = Math.max(1, Math.floor((x1 - x0) / 6)), sy = Math.max(1, Math.floor((y1 - y0) / 6));
    for (let yy = y0; yy < y1; yy += sy) for (let xx = x0; xx < x1; xx += sx) { const o = (yy * w + xx) * 4; s += 0.3 * data[o] + 0.59 * data[o + 1] + 0.11 * data[o + 2]; n++; }
    g.push(s / n);
  }
  let bits = "";
  for (let y = 0; y < H; y++) for (let x = 0; x < W - 1; x++) bits += g[y * W + x] > g[y * W + x + 1] + 2 ? "1" : "0";
  return BigInt("0b" + bits).toString(16).padStart(16, "0");
}
export function hamming(a, b) { let x = BigInt("0x" + a) ^ BigInt("0x" + b), n = 0; while (x) { n += Number(x & 1n); x >>= 1n; } return n; }
export const NEAR = 6; // of 64 bits: antialiasing and a moving timer badge stay under it; a changed wrap or a new shadow does not
export const near = (a, b) => a.length === b.length && a.every((x, i) => hamming(x, b[i]) <= NEAR);

// ---------- the cache ----------
// parts: {words, spec, text, tree} (exact) and panels: [dhash] (tolerant)
export function fingerprint({ words, spec, text, tree, panels = [] }) { return { hash: sha([words, spec, text, tree]), dhash: panels }; }
export function cacheHit(entry, fp) { return !!entry && entry.hash === fp.hash && Array.isArray(entry.dhash) && near(entry.dhash, fp.dhash); }

// ---------- batches ----------
export const TEXT_KINDS = new Set(["text", "voice"]);
export function batches(rows, { visual = 10, text = 30 } = {}) {
  const out = [];
  const groups = new Map();
  for (const r of rows) { const k = r.kind || "layout"; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(r); }
  for (const [k, list] of [...groups.entries()].sort()) {
    const n = TEXT_KINDS.has(k) ? text : visual;
    for (let i = 0; i < list.length; i += n) out.push({ kind: k, rows: list.slice(i, i + n) });
  }
  return out;
}

// ---------- the reviewer's verdict file ----------
// "judge: <model and session>" then one line per row: "ID | PASS: B, <what the panel shows>" | "ID | FAIL: A, <what is wrong>" |
// "ID | EVIDENCE: <what is missing>" (goes to the tool owner, never to regressions.md). A PASS must cite its panel first (Fable 17).
export function parseVerdicts(text) {
  const out = { judge: null, lines: [], rejected: [] };
  for (const raw of String(text || "").split("\n")) {
    const l = raw.trim();
    let m;
    if ((m = /^judge:\s*(.+)$/i.exec(l))) { out.judge = m[1].trim(); continue; }
    if (!(m = /^\|?\s*([A-Z][A-Z]*-[A-Z0-9-]*\d+)\s*\|\s*(PASS|FAIL|EVIDENCE)\s*:\s*(.+?)\s*\|?$/.exec(l))) continue;
    const [, id, verdict, line] = m;
    // a text-only row cites its text capture: "PASS: text, ...", or by its label in the .md ("SH-45-p1-L1-1366x768 dom: ...",
    // "p1-L2 voice, ..."); passFor() below keeps the A-D rule for a row that has a sheet
    const pm = /^(?:panel\s+)?([A-D](?:\s*(?:,|and|\+|&)\s*[A-D])*(?![\w-])|(?:[A-Z]+-\d+-)?p\d+(?:-L\d+)?(?:-(?:\d+x\d+|repo))?(?:\s+(?:dom|voice|cmd|contract|text|stage list))?|(?:the\s+)?(?:text|voice|dom|cmd|t)(?:\s+(?:capture|timeline))?)\b\s*(?:\([^)]*\))?\s*[,:;.)-]/i.exec(line);
    const panel = pm ? pm[1].replace(/^the\s+/i, "").replace(/\s+/g, " ").trim().replace(/^([A-D](?:\s*(?:,|and|\+|&)\s*[A-D])*)$/i, (s) => s.toUpperCase().replace(/\s+/g, "")) : null;
    if (verdict === "PASS" && !panel) { out.rejected.push({ id, why: "a PASS must name the panel it saw first (\"PASS: B, ...\")", line }); continue; }
    out.lines.push({ id, verdict, line, panel });
  }
  return out;
}

// A PASS stands on what it cites: a row with a sheet (a PNG) names a panel A-D; a text-only row (no sheet) names its text
// capture (decision 96, S05-C3: the text judge's PASSes on SH-45, CLN-120 were refused for naming no panel that could exist).
// -> null when it stands, else why not
export function passRefusal(l, hasSheet) {
  if (!l || l.verdict !== "PASS") return null;
  if (!l.panel) return "a PASS must name the panel it saw first (\"PASS: B, ...\")";
  const lettered = /^[A-D](?:[,&+]|AND|$)/.test(l.panel);
  if (hasSheet && !lettered) return `the row has a sheet: a PASS names its panel A-D, not "${l.panel}"`;
  if (!hasSheet && lettered) return `the row has no sheet (text only): a PASS names its text capture, not panel ${l.panel}`;
  return null;
}

// ---------- regressions.md ----------
const clean = (s) => String(s || "").replace(/\|/g, "/").replace(/\(/g, "[").replace(/\)/g, "]").replace(/\s+/g, " ").trim();
// verdicts: Map id -> {verdict: PASS|FAIL, line, png}; run: the evidence run id -> {text, changed: [{id, from, to}], skipped: [{id, why}]}
export function applyVerdicts(md, verdicts, run) {
  const rows = new Map(parseRegressions(md).map((r) => [r.id, r]));
  const changed = [], skipped = [], history = [];
  const lines = md.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const m = /^\| ([A-Z][A-Z]*-[A-Z0-9-]*\d+) \|/.exec(lines[i]);
    if (!m || !verdicts.has(m[1])) continue;
    const id = m[1], v = verdicts.get(id), r = rows.get(id);
    if (!r) continue;
    const kind = statusKind(r.status);
    if (kind === "keep" || kind === "retired") { skipped.push({ id, why: kind }); continue; }
    if (v.verdict !== "PASS" && v.verdict !== "FAIL") { skipped.push({ id, why: v.verdict }); continue; }
    if (r.status.includes(`evidence ${v.verdict} ${run}`)) { skipped.push({ id, why: "already applied" }); continue; }
    const note = `evidence ${v.verdict} ${run}: ${clean(v.line)}${v.png ? `; \`${v.png}\`` : ""}`;
    const head = v.verdict === "FAIL" ? "**reopened**" : kind === "fixed" ? "fixed" : "built";
    // the status is the current state only (decision 99): the old one goes to the history file, not after "· earlier:"
    const status = `${head} (${note})`;
    history.push({ id, run, earlier: r.status });
    const cells = lines[i].replace(/^\|\s*/, "").replace(/\s*\|\s*$/, "").split(/ \| /);
    if (cells.length < 4) { skipped.push({ id, why: "row has fewer than four cells" }); continue; }
    cells[2] = status;
    lines[i] = `| ${cells.join(" | ")} |`;
    changed.push({ id, from: plain(r.status).slice(0, 60), to: `${head} (${v.verdict})` });
  }
  return { text: lines.join("\n"), changed, skipped, history };
}

// cost-and-speed change 3: --apply refuses a run that has no verdicts in the cache (judge and collect first), so nothing is written
// from a run nobody judged. Returns null when fine, else the reason.
export function applyGuard(index, cache) {
  const rows = Object.entries((index && index.rows) || {}).filter(([, r]) => r.fp && !(r.tool && r.tool.length));
  if (!cache || !Object.keys(cache).length) return "there is no verdict cache (build/tools/review/data/verdicts.json): run --judge and --collect first";
  const hit = rows.filter(([rid, r]) => cache[rid] && cacheHit(cache[rid], r.fp));
  if (rows.length && !hit.length) return `none of this run's ${rows.length} rows has a verdict in the cache: run --judge and --collect first`;
  return null;
}

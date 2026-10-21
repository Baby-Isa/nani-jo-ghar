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
// the labels a text-only row's text file offers a PASS to cite (s08 w6L: SH-115, CLN-172, LNG-04 were refused for naming the script
// they read): each "#### <label>" heading of the .md without its "(exit N)" or " · <what>" tail (a cmd capture's command; a dom,
// voice or contract capture's probe id), and each probe id of its "Probes" bullets
export function captureLabels(md) {
  const out = new Set();
  for (const raw of String(md || "").split("\n")) {
    let m;
    if ((m = /^####\s+(.+?)\s*$/.exec(raw))) {
      const h = m[1].replace(/\s+\((?:exit|code)\s*[\w-]*\)\s*$/, "").trim();
      if (h) out.add(h);
      const head = h.split(" · ")[0].trim();
      if (head) out.add(head);
    } else if ((m = /^-\s+([A-Z]+-[A-Z0-9-]*\d+-p\d+[\w@.#-]*):/.exec(raw))) out.add(m[1]);
  }
  return [...out];
}
// the longest label the line starts with (a PASS "naming its capture label", as the batch file tells the judge), else null
export function labelOf(line, labels) {
  const L = String(line || "").trim().toLowerCase();
  let best = null;
  for (const lab of labels || []) {
    const k = String(lab).trim().toLowerCase();
    if (k.length < 3 || !L.startsWith(k)) continue;
    const next = L.charAt(k.length);
    if (next && !/[\s,:;.)(\-]/.test(next)) continue;
    if (!best || k.length > best.length) best = String(lab).trim();
  }
  return best;
}
// labelsOf(id) -> the row's capture labels (optional): a PASS that opens with one stands as that text capture's
export function parseVerdicts(text, labelsOf = null) {
  const out = { judge: null, lines: [], rejected: [] };
  for (const raw of String(text || "").split("\n")) {
    const l = raw.trim();
    let m;
    if ((m = /^judge:\s*(.+)$/i.exec(l))) { out.judge = m[1].trim(); continue; }
    if (!(m = /^\|?\s*([A-Z][A-Z]*-[A-Z0-9-]*\d+)\s*\|\s*(PASS|FAIL|EVIDENCE)\s*:\s*(.+?)\s*\|?$/.exec(l))) continue;
    const [, id, verdict, line] = m;
    // a text-only row cites its text capture: "PASS: text, ...", or by its label in the .md ("SH-45-p1-L1-1366x768 dom: ...",
    // "p1-L2 voice, ..."); passFor() below keeps the A-L rule for a row that has a sheet
    const pm = /^(?:panel\s+)?([A-L](?:\s*(?:,|and|\+|&)\s*[A-L])*(?![\w-])|(?:[A-Z]+-\d+-)?p\d+(?:-L\d+)?(?:-(?:\d+x\d+|repo))?(?:\s+(?:dom|voice|cmd|contract|text|stage list))?|(?:the\s+)?(?:text|voice|dom|cmd|t)(?:\s+(?:capture|timeline))?)\b\s*(?:\([^)]*\))?\s*[,:;.)-]/i.exec(line);
    let panel = pm ? pm[1].replace(/^the\s+/i, "").replace(/\s+/g, " ").trim().replace(/^([A-L](?:\s*(?:,|and|\+|&)\s*[A-L])*)$/i, (s) => s.toUpperCase().replace(/\s+/g, "")) : null;
    // a text-only row's PASS that opens with a capture label from its .md (a script's command, a probe id): "PASS: grep -n ... data/x.json, all four ..."
    if (!panel && verdict === "PASS" && labelsOf) panel = labelOf(line, labelsOf(id) || []);
    if (verdict === "PASS" && !panel) { out.rejected.push({ id, why: "a PASS must name the panel it saw first (\"PASS: B, ...\")", line }); continue; }
    out.lines.push({ id, verdict, line, panel });
  }
  return out;
}

// A PASS stands on what it cites: a row with a sheet (a PNG) names a panel A-D (to A-L on a row with more probes); a text-only row (no sheet) names its text
// capture (decision 96, S05-C3: the text judge's PASSes on SH-45, CLN-120 were refused for naming no panel that could exist).
// -> null when it stands, else why not
export function passRefusal(l, hasSheet) {
  if (!l || l.verdict !== "PASS") return null;
  if (!l.panel) return "a PASS must name the panel it saw first (\"PASS: B, ...\")";
  const lettered = /^[A-L](?:[,&+]|AND|$)/.test(l.panel);
  if (hasSheet && !lettered) return `the row has a sheet: a PASS names its panel A-D (to A-L on a row with more probes), not "${l.panel}"`;
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
    // a FAIL row names only the run (the judge's line is in build/tools/review/data/verdicts.json), so the fix list stays under its limit;
    // a PASS keeps its line, which goes with the row to the archive
    const note = v.verdict === "FAIL" ? `evidence FAIL ${run}` : `evidence PASS ${run}: ${clean(v.line)}`;
    const head = v.verdict === "FAIL" ? (v.twoStrikes ? "**open (two strikes: Zafar)**" : "**reopened**") : kind === "fixed" ? "fixed" : "built";
    // the status is the current state only (decision 99): the old one goes to the history file, not after "· earlier:"
    // a FAIL keeps what the row still waits on (Mum, art): that is current state, not history
    const wait = v.verdict === "FAIL" && /waiting on [^·|(*]*(\([^)]*\))?/.exec(plain(r.status));
    const status = `${head}${wait ? ` · **${wait[0].trim()}**` : ""} (${note})`;
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

// ---------- red then green (checks-to-build 1, rule C22) ----------
// The verdict log (build/tools/review/data/verdict-log.jsonl) is append-only: {id, run, verdict: PASS|FAIL, spec, judge, date} per
// verdict, {id, run, event: "built", date} when --apply marks a row built. spec is specHash(the row's evidence spec): a fix that
// weakens the probe gets no credit for the old probe's red.
export const specHash = (spec) => sha(spec || null);
const RED = /evidence FAIL ([A-Za-z0-9][\w-]*)/g;
// The reds written before the log existed, from the fix list's statuses and the history file's earlier statuses; spec "legacy"
// (unknown, so any probe). A run the log already holds is the log's.
export function legacyReds(texts, history, log) {
  const have = new Set(log.map((e) => `${e.id} ${e.run}`)), out = [], seen = new Set();
  const add = (id, status) => { for (const m of String(status || "").matchAll(RED)) { const k = `${id} ${m[1]}`; if (have.has(k) || seen.has(k)) continue; seen.add(k); out.push({ id, run: m[1], verdict: "FAIL", spec: "legacy" }); } };
  for (const t of texts) for (const r of parseRegressions(t)) add(r.id, r.status);
  for (const h of history) add(h.id, h.earlier);
  return out;
}
// verdicts: Map id -> {verdict, ...}; kinds: id -> statusKind; specs: id -> specHash; log: the verdict log; run: this run.
// -> {verdicts (the ones that may be applied; a FAIL carries twoStrikes), refused: [{id, why}], strikes: [id]}
export function redGreen(verdicts, { kinds, specs, log, run, legacy = [] }) {
  const out = new Map(), refused = [], strikes = [];
  for (const [id, v] of verdicts) {
    const mine = log.filter((e) => e.id === id);
    const at = mine.findIndex((e) => e.run === run);
    const before = at < 0 ? mine : mine.slice(0, at);
    if (v.verdict === "PASS" && !["built", "fixed"].includes(kinds[id])) {
      // A new feature (an open row that has never failed) has no before to fail: its PASS closes it (Zafar, 21 Oct).
      const fresh = kinds[id] === "open" && !mine.some((e) => e.verdict === "FAIL") && !legacy.some((e) => e.id === id);
      const red = fresh || legacy.some((e) => e.id === id) || before.some((e) => e.verdict === "FAIL" && e.run !== run && e.spec === specs[id]);
      if (!red) { refused.push({ id, why: "no red first: run this row's probe before the fix and see it fail (a FAIL on this probe from an earlier run)" }); continue; }
    }
    if (v.verdict === "FAIL") {
      let b = -1; mine.forEach((e, i) => { if (e.event === "built") b = i; });
      const runs = new Set(mine.slice(b + 1).filter((e) => e.verdict === "FAIL").map((e) => e.run)); runs.add(run);
      if (runs.size >= 2) { strikes.push(id); out.set(id, { ...v, twoStrikes: true }); continue; }
    }
    out.set(id, v);
  }
  return { verdicts: out, refused, strikes };
}

// --changed (Zafar, 20 Oct): the rows worth playing again after a change. A row is touched when one of its probes plays a flow
// (by base id: "clinic:heal-eye#mistake@L2" is "clinic:heal-eye") that touched.mjs reaches from the changed files, or when it runs a
// script (a "repo" probe: no browser, cheap, always kept), or its spec is broken (it must show). `norm` is the normalised spec's rows
// (id -> probes with .flowId / .repo); rows with no probes (no spec, human, decision) are not played either way.
export const flowBase = (id) => String(id || "").replace(/[@#].*$/, "");
export function changedRows(rowIds, norm, touchedIds, { rowErrors = {} } = {}) {
  const hit = new Set(touchedIds), keep = [], skipped = [];
  for (const id of rowIds) {
    const probes = norm[id];
    if (!probes) { skipped.push(id); continue; }
    const touched = rowErrors[id] || probes.some((p) => p.repo || hit.has(flowBase(p.flowId)));
    (touched ? keep : skipped).push(id);
  }
  return { keep, skipped };
}

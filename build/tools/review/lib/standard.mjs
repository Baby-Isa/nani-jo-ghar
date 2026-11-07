// The standard's rule-block reader and the audit's resolver (Sprint 17; format: build/reports/s17-standard-format.md).
// Part 1 (pure, shared with stdids.mjs later): parse docs/design-language/standard/*.md into rule objects and a list of malformed blocks.
// Part 2 (used by audit.mjs --standard): resolve each rule's Checked-by terms against saved results and render the report.
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, basename } from "node:path";

// ---------- part 1: the parser ----------

export const SCOPES = ["House", "Family", "Game"];
export const IMPACTS = ["stuck", "wrong", "feels bad", "unfinished", "cosmetic"];
export const REQUIRED = ["Why", "Scope", "Pattern / part", "Checked by", "See it", "Status"];
export const OPTIONAL = ["Layer", "Lives in", "Value", "Impact", "Source rows"];
export const DOMAINS = { 0: "Foundations", A: "Learning", B: "Play", C: "Progression", D: "Guidance", E: "Presentation", F: "Build", G: "Proof", H: "Supply" };
const ID_RE = /^STD-(0\d|[A-H]\d)-(\d{2})$/;
const HEAD_RE = /^#{1,4}\s+STD-/;
const FIELD_RE = /\*\*([^*:]+):\*\*/g;

// a segment that starts like a term ("word:" or "contract-NN") is a new term (an unknown word is then reported); any other " + " stays
// inside the previous term (a judge's text may use it)
const SPLIT_RE = /\s\+\s(?=`?(?:contract-\d|[A-Za-z][\w-]*:))/;
const KIND_RES = [
  ["contract", /^contract-(\d+)\b\s*(.*)$/s],
  ["check", /^check:\s*([^\s,;]+)\s*(.*)$/s],
  ["tool", /^tool:\s*([^\s,;]+)\s*(.*)$/s],
  ["probe", /^probe:\s*([^\s,;]+)\s*(.*)$/s],
  ["doc", /^doc:\s*(.+)$/s],
  ["judge", /^judge:\s*(.*)$/s],
  ["gap", /^gap:\s*(.*)$/s],
];

// "contract-53 + judge: the shrink's motion" -> [{kind, ref, text}]; unknown words go to problems
export function parseCheckedBy(raw) {
  const terms = [], problems = [];
  const s = String(raw || "").trim();
  if (!s) return { terms, problems: ["Checked by is empty"] };
  for (let part of s.split(SPLIT_RE)) {
    part = part.trim().replace(/^`+|`+$/g, "").trim();
    if (!part) continue;
    let hit = null;
    for (const [kind, re] of KIND_RES) {
      const m = re.exec(part);
      if (m) { hit = { kind, ref: kind === "contract" ? `contract-${m[1]}` : kind === "doc" || kind === "judge" || kind === "gap" ? m[1].trim() : m[1].replace(/`/g, ""), text: part }; break; }
    }
    if (hit) terms.push(hit);
    else problems.push(`unknown Checked-by word "${part.split(/[\s:]/)[0]}" in "${part.slice(0, 60)}" (use contract-NN, check:, tool:, probe:, doc:, judge:, gap:)`);
  }
  return { terms, problems };
}

// the last line: "**Layer:** x · **Lives in:** y · ..." -> {Layer: x, ...}
function splitFields(body) {
  const out = {};
  const hits = [...body.matchAll(FIELD_RE)];
  hits.forEach((m, i) => {
    const end = i + 1 < hits.length ? hits[i + 1].index : body.length;
    out[m[1].trim()] = body.slice(m.index + m[0].length, end).replace(/\s*[·]\s*$/, "").trim();
  });
  return out;
}

// text of one page -> {rules, problems}; problems are {file, line, id, msg}
export function parseStandardText(text, file = "(text)") {
  const lines = String(text).split(/\r?\n/);
  const rules = [], problems = [];
  const bad = (line, id, msg) => problems.push({ file, line, id, msg });
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*```/.test(lines[i])) { inFence = !inFence; continue; }
    if (inFence || !HEAD_RE.test(lines[i])) continue;
    const startLine = i + 1;
    const head = /^####\s+(STD-[^\s·]+)\s*·\s*(.+?)\s*$/.exec(lines[i]);
    if (!head) {
      const idOnly = /^#+\s+(STD-\S+)/.exec(lines[i]);
      bad(startLine, idOnly ? idOnly[1] : "?", `malformed heading "${lines[i].slice(0, 70)}" (expected "#### STD-XX-NN · rule")`);
      continue;
    }
    const id = head[1];
    if (!/^####\s/.test(lines[i])) bad(startLine, id, "rule heading must be a #### heading");
    if (!ID_RE.test(id)) bad(startLine, id, `bad rule ID "${id}" (expected STD-<area>-<nn>: 01-09, A1-H9, two digits)`);
    // the block: bullet lines up to the next heading; a blank line then prose ends it
    const bullets = [];
    let j = i + 1, afterBlank = false;
    for (; j < lines.length; j++) {
      const l = lines[j];
      if (/^#{1,6}\s/.test(l)) break;
      if (/^\s*```/.test(l)) break;
      if (!l.trim()) { afterBlank = true; continue; }
      if (/^- /.test(l)) { bullets.push({ text: l.slice(2), line: j + 1 }); afterBlank = false; continue; }
      if (bullets.length && (!afterBlank || /^\s{2,}/.test(l))) { bullets[bullets.length - 1].text += " " + l.trim(); afterBlank = false; continue; }
      if (!bullets.length && afterBlank) continue; // blank lines between heading and fields
      break; // prose after the block
    }
    i = j - 1;
    const fields = {}, fieldLine = {};
    for (const b of bullets) {
      const fm = /^\*\*([^*:]+):\*\*/.exec(b.text);
      if (!fm) { bad(b.line, id, `bullet is not a "**Field:**" line: "${b.text.slice(0, 60)}"`); continue; }
      const name = fm[1].trim();
      if ([...b.text.matchAll(FIELD_RE)].length > 1 || name === "Layer") { // the last line carries several fields
        const multi = splitFields(b.text);
        for (const [k, v] of Object.entries(multi)) { if (k in fields) bad(b.line, id, `field "${k}" given twice`); fields[k] = v; fieldLine[k] = b.line; }
      } else {
        if (name in fields) bad(b.line, id, `field "${name}" given twice`);
        fields[name] = b.text.slice(fm[0].length).trim();
        fieldLine[name] = b.line;
      }
    }
    for (const k of Object.keys(fields)) if (!REQUIRED.includes(k) && !OPTIONAL.includes(k)) bad(fieldLine[k], id, `unknown field "${k}"`);
    for (const k of REQUIRED) if (!(k in fields) || !fields[k]) bad(startLine, id, `missing field "${k}"`);
    if (fields.Scope && !SCOPES.includes(fields.Scope)) bad(fieldLine.Scope, id, `Scope "${fields.Scope}" must be exactly one of ${SCOPES.join(", ")}`);
    const pp = String(fields["Pattern / part"] || "").split("/").map((x) => x.trim());
    if (fields["Pattern / part"] && (pp.length < 2 || !/^(P\d{1,2}|-)$/.test(pp[0]))) bad(fieldLine["Pattern / part"], id, `Pattern / part "${fields["Pattern / part"]}" must read "P<n> or - / part or -"`);
    if (fields.Impact && !IMPACTS.includes(fields.Impact)) bad(fieldLine.Impact, id, `Impact "${fields.Impact}" must be one of ${IMPACTS.join(", ")}`);
    const cb = parseCheckedBy(fields["Checked by"]);
    if (fields["Checked by"]) for (const p of cb.problems) bad(fieldLine["Checked by"], id, p);
    const status = fields.Status || "";
    rules.push({
      id, rule: head[2], why: fields.Why || "", scope: fields.Scope || "", pattern: pp[0] || "", part: pp.slice(1).join("/").trim(),
      checkedBy: cb.terms, seeIt: fields["See it"] || "", status, retired: /^retired\b/i.test(status),
      layer: fields.Layer || "", livesIn: fields["Lives in"] || "", value: fields.Value || "", impact: fields.Impact || "",
      sourceRows: (fields["Source rows"] || "").split(/[,;]\s*/).map((x) => x.replace(/`/g, "").trim()).filter(Boolean),
      domain: ID_RE.test(id) ? id[4] : "?", file, line: startLine,
    });
  }
  return { rules, problems };
}

// every *.md in the folder (not placement/patterns/glossary/values/README: they hold no rule blocks, and are skipped when empty anyway)
export function parseStandardDir(dir) {
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return { rules: [], problems: [], files: [], missing: true };
  const files = readdirSync(dir).filter((f) => f.endsWith(".md")).sort();
  const rules = [], problems = [];
  for (const f of files) {
    const r = parseStandardText(readFileSync(join(dir, f), "utf8"), f);
    rules.push(...r.rules); problems.push(...r.problems);
  }
  const seen = new Map();
  for (const r of rules) {
    if (seen.has(r.id)) problems.push({ file: r.file, line: r.line, id: r.id, msg: `rule ID defined twice (also ${seen.get(r.id).file}:${seen.get(r.id).line})` });
    else seen.set(r.id, r);
  }
  return { rules, problems, files, missing: false };
}

// ---------- part 2: which rules a game answers to ----------

// the kitchen family (docs/sprints/S18-kitchen-family.md, decision 11): every Cook game except the pantry (fetch)
export const KITCHEN_FAMILY = ["chai-tray", "daar", "sekelo", "maani", "maani-line", "chaat", "chop", "samosa", "eggs", "baking", "corn", "mishkaki-grill", "tadka", "stir", "assemble"];
export const GAME_ALIASES = { "chai-tray": ["chai-tray", "recipe:chai", "chai"], daar: ["daar", "daal", "recipe:daal"], maani: ["maani", "maani-line", "recipe:maani"], "maani-line": ["maani-line", "maani", "recipe:maani"], chaat: ["chaat", "recipe:chaat"], samosa: ["samosa", "recipe:samosa"], "mishkaki-grill": ["mishkaki-grill", "mishkaki", "recipe:mishkaki"] };
export function scopesFor(game) {
  const s = ["House"];
  if (KITCHEN_FAMILY.includes(game)) s.push("Family");
  if (game === "chai-tray") s.push("Game");
  return s;
}
// a flow name like "cook:chai-tray@L4#hint" belongs to the game when its name (after cook:) is the game or an alias
export function flowIsGame(flow, game) {
  const names = GAME_ALIASES[game] || [game];
  const base = String(flow).replace(/[@#].*$/, "");
  return names.some((n) => base === n || base === `cook:${n}` || base.endsWith(`:${n}`));
}

// ---------- part 3: the saved results ----------

// a sandbox run folder: contract.json (the breaks), contract.md (the checks that ran), data/*.json (the pages: one per flow x size)
export function loadContract(runDir, game) {
  const out = { dir: runDir, found: false, ran: new Set(), breaks: [], flows: [], pages: 0, gamePages: 0, covered: false, date: "" };
  if (!runDir || !existsSync(join(runDir, "contract.md"))) return out;
  out.found = true;
  for (const l of readFileSync(join(runDir, "contract.md"), "utf8").split("\n")) {
    const m = /^\|\s*(contract-\d+)\b[^|]*\|\s*(\d+)\s*\|/.exec(l);
    if (m) out.ran.add(m[1]);
  }
  if (existsSync(join(runDir, "contract.json"))) { try { out.breaks = JSON.parse(readFileSync(join(runDir, "contract.json"), "utf8")); } catch { /* unreadable: no breaks known */ } }
  if (existsSync(join(runDir, "contract-meta.json"))) { try { const m = JSON.parse(readFileSync(join(runDir, "contract-meta.json"), "utf8")); out.date = String(m.date || "").slice(0, 10); out.pages = m.pages || 0; } catch { /* ignore */ } }
  const dd = join(runDir, "data");
  const flows = new Map();
  if (existsSync(dd)) for (const f of readdirSync(dd).filter((x) => x.endsWith(".json"))) {
    try { const d = JSON.parse(readFileSync(join(dd, f), "utf8")); if (d.flow) flows.set(d.flow, (flows.get(d.flow) || 0) + 1); } catch { /* skip */ }
  }
  out.flows = [...flows.keys()];
  out.gamePages = [...flows].filter(([f]) => flowIsGame(f, game)).reduce((n, [, c]) => n + c, 0);
  // no data folder: judge by the run id or by a break on the game's flow
  out.covered = out.gamePages > 0 || (!existsSync(dd) && (basename(runDir).includes(game) || out.breaks.some((b) => flowIsGame(b.flow, game))));
  return out;
}

// the newest sandbox run folder that holds a contract run covering the game
export function latestContractRun(runsDir, game) {
  if (!existsSync(runsDir)) return null;
  const dirs = readdirSync(runsDir).map((n) => join(runsDir, n)).filter((p) => statSync(p).isDirectory() && existsSync(join(p, "contract.md"))).sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
  return dirs.find((d) => loadContract(d, game).covered) || null;
}

// checks.mjs output: "ok   unit   46 files, ..." / "FAIL words ..." plus the "     NEW ..." detail lines under a step
export function parseChecksOutput(text) {
  const steps = new Map();
  let last = null;
  for (const l of String(text).split("\n")) {
    const m = /^(ok  |FAIL) (\S+)\s*(.*)$/.exec(l);
    if (m) { last = { ok: m[1].trim() === "ok", text: m[3].trim(), detail: [] }; steps.set(m[2], last); continue; }
    if (last && /^\s{5}\S/.test(l)) last.detail.push(l.trim());
  }
  return steps;
}

// an audit report (build/reports/audit-<game>-<date>.md): "| key | what | pass or **FAIL** | min | last lines |"
export function parseAuditReport(text) {
  const steps = new Map();
  for (const l of String(text).split("\n")) {
    const m = /^\|\s*(sandbox|panel|labcheck|leak|load)\s*\|[^|]*\|\s*(\*\*FAIL\*\*|pass)\s*\|[^|]*\|\s*(.*?)\s*\|?\s*$/.exec(l);
    if (m) steps.set(m[1], { ok: m[2] === "pass", text: m[3] });
  }
  return steps;
}
export const TOOL_STEP = { panelcheck: "panel", labcheck: "labcheck", leak: "leak", loadtime: "load", sandbox: "sandbox" };

// ---------- part 4: resolving a term, a rule ----------

export const RESULTS = ["pass", "fail", "judge", "gap", "not run"];
// worst first: any failed machine term fails the rule; a term that never ran leaves it not run; a gap beats judge; judge beats pass
const ORDER = ["fail", "not run", "gap", "judge", "pass"];

export function resolveTerm(term, ctx) {
  const { kind, ref } = term;
  if (kind === "judge" || kind === "doc") return { result: "judge", note: kind === "doc" ? `doc: ${ref}` : "" };
  if (kind === "gap") return { result: "gap", note: ref };
  if (kind === "contract") {
    const c = ctx.contract;
    if (!c || !c.found) return { result: "not run", note: "no contract run" };
    if (!c.covered) return { result: "not run", note: `run has no ${ctx.game} pages` };
    if (!c.ran.has(ref)) return { result: "not run", note: "check not in the run" };
    const hits = c.breaks.filter((b) => b.check === ref && flowIsGame(b.flow, ctx.game));
    if (hits.length) return { result: "fail", note: `${hits.length} break${hits.length > 1 ? "s" : ""}: ${String(hits[0].measured || hits[0].what || "").slice(0, 90)}` };
    return { result: "pass", note: `${c.gamePages} pages` };
  }
  if (kind === "check") {
    const [name, rule] = ref.split("/");
    const st = ctx.checks && ctx.checks.get(name);
    if (!st) return { result: "not run", note: ctx.checks ? `no "${name}" step in the checks output` : "no checks run" };
    if (st.ok) return { result: "pass", note: st.text.slice(0, 60) };
    if (rule) { // check:static/<rule>: fail only if the step's detail names the rule (else the failure is someone else's)
      const named = st.detail.filter((d) => d.toLowerCase().includes(rule.toLowerCase()));
      return named.length ? { result: "fail", note: named[0].slice(0, 90) } : st.detail.length ? { result: "pass", note: `step fails on other rules (${rule} not named)` } : { result: "fail", note: st.text.slice(0, 90) };
    }
    return { result: "fail", note: st.text.slice(0, 90) };
  }
  if (kind === "tool") {
    const step = TOOL_STEP[ref];
    const st = step && ctx.tools && ctx.tools.get(step);
    if (!st) return { result: "not run", note: step ? "audit did not run it" : "the audit has no step for it" };
    return st.ok ? { result: "pass", note: `audit ${step}` } : { result: "fail", note: `audit ${step}: ${st.text.slice(0, 80)}` };
  }
  if (kind === "probe") {
    const v = ctx.verdicts && ctx.verdicts[ref];
    if (!v) return { result: "not run", note: "no verdict cached" };
    const verdict = String(v.verdict || "").toUpperCase();
    return verdict === "PASS" ? { result: "pass", note: `${v.date || ""}` } : verdict === "FAIL" ? { result: "fail", note: `${v.date || ""} ${String(v.line || "").slice(0, 70)}`.trim() } : { result: "not run", note: `verdict ${verdict || "empty"}` };
  }
  return { result: "not run", note: "unknown term" };
}

export function resolveRule(rule, ctx) {
  const terms = rule.checkedBy.map((t) => ({ term: t, ...resolveTerm(t, ctx) }));
  const result = terms.length ? ORDER.find((r) => terms.some((t) => t.result === r)) : "gap";
  return { rule, result, terms };
}

// the rules a game answers to (retired ones set aside), each resolved
export function auditRules(rules, ctx) {
  const scopes = scopesFor(ctx.game);
  const live = rules.filter((r) => !r.retired);
  const mine = live.filter((r) => scopes.includes(r.scope));
  return { scopes, retired: rules.length - live.length, otherScope: live.length - mine.length, results: mine.map((r) => resolveRule(r, ctx)) };
}

export function countBy(results) {
  const c = Object.fromEntries(RESULTS.map((r) => [r, 0]));
  for (const x of results) c[x.result]++;
  return c;
}

const esc = (s) => String(s).replace(/\|/g, "/").replace(/\s+/g, " ").trim();
const cut = (s, n) => (s.length > n ? s.slice(0, n - 3) + "..." : s);
const countLine = (c) => RESULTS.map((r) => `${c[r]} ${r}`).join(", ");

export function renderReport({ game, day, audit, problems, sources, command }) {
  const { results, scopes } = audit;
  const total = countBy(results);
  const md = [
    `# Standard audit: ${game} (${day})`, "",
    `\`${command}\`: ${results.length} rules (${scopes.join(" + ")} scope): **${countLine(total)}**.`,
    `${audit.retired ? `${audit.retired} retired rule(s) set aside. ` : ""}${audit.otherScope ? `${audit.otherScope} rule(s) of another scope not counted. ` : ""}Pass means every machine term passed and no judge or gap term is left; judge means the machine terms passed and the eye is still owed (Fable or Zafar); gap means a term has no tool yet; not run means a term's result is missing (it never ran on this game, or no saved result was given).`, "",
    "## Sources", "", ...sources.map((s) => `- ${s}`), "",
  ];
  const byDomain = new Map();
  for (const x of results) (byDomain.get(x.rule.domain) || byDomain.set(x.rule.domain, []).get(x.rule.domain)).push(x);
  md.push("## Counts per domain", "", "| Domain | Rules | Pass | Fail | Judge | Gap | Not run |", "|---|---|---|---|---|---|---|");
  const keys = [...byDomain.keys()].sort();
  for (const k of keys) { const c = countBy(byDomain.get(k)); md.push(`| ${k} ${DOMAINS[k] || ""} | ${byDomain.get(k).length} | ${c.pass} | ${c.fail} | ${c.judge} | ${c.gap} | ${c["not run"]} |`); }
  md.push(`| **All** | **${results.length}** | ${total.pass} | ${total.fail} | ${total.judge} | ${total.gap} | ${total["not run"]} |`, "");
  for (const k of keys) {
    const list = byDomain.get(k);
    md.push(`## ${k} ${DOMAINS[k] || ""}: ${countLine(countBy(list))}`, "", "| ID | Rule | Scope | Result | Terms | Why |", "|---|---|---|---|---|---|");
    for (const x of list) {
      const terms = x.terms.map((t) => `${t.term.kind === "contract" ? t.term.ref : `${t.term.kind}: ${cut(esc(t.term.ref), 28)}`} ${t.result}${t.note && t.result !== "pass" && t.result !== "judge" && t.result !== "gap" ? ` (${cut(esc(t.note), 80)})` : ""}`).join("; ");
      md.push(`| ${x.rule.id} | ${esc(x.rule.rule)} | ${x.rule.scope} | ${x.result === "fail" ? "**fail**" : x.result} | ${terms} | ${cut(esc(x.rule.why), 120)} |`);
    }
    md.push("");
  }
  md.push(`## Malformed blocks (${problems.length})`, "");
  if (!problems.length) md.push("None.", "");
  else md.push(...problems.map((p) => `- \`${p.file}:${p.line}\` ${p.id}: ${p.msg}`), "");
  return md.join("\n");
}

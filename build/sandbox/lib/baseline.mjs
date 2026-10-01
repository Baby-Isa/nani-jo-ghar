// The ratchet. build/lint/baseline.json holds today's findings; a run may not add one, and the count only goes down.
// A finding is identified by (check, flow, size, selector), not by state name, so a renamed state doesn't count as new.
// It only counts as NEW if even (check, size, selector) is unknown to the baseline in any flow: a screen that is timing-dependent
// (which words are on a card, where a belt dish is when the picture is taken) turns up in a different flow now and then, and
// that is reported as "moved", not failed.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./env.mjs";

export const BASELINE = join(ROOT, "build", "lint", "baseline.json");
// build/lint/ignore.json: findings that are timing noise by design (each with its reason)
const IGNORE = existsSync(join(ROOT, "build", "lint", "ignore.json")) ? JSON.parse(readFileSync(join(ROOT, "build", "lint", "ignore.json"), "utf8")) : [];
export const ignored = (f) => IGNORE.some((i) => i.check === f.check && f.selector.includes(i.selector));
export const keyOf = (f) => `${f.check}|${f.flow}|${f.size}|${f.selector}`;
export const looseKey = (f) => `${f.check}|${f.size}|${f.selector}`;
const fsKey = (flow, size) => `${flow}@${size}`;

// results -> flat findings (one per key, with the states it showed in) and per flow-size facts
export function flatten(results) {
  const findings = new Map();
  const flows = {};
  for (const r of results) {
    flows[fsKey(r.flow, r.size)] = { complete: r.complete, errors: [...new Set(r.errors)].sort(), states: r.states.length };
    for (const s of r.states) for (const f of s.findings.filter((x) => !ignored(x))) {
      const e = { check: f.check, page: s.page, flow: r.flow, size: r.size, selector: f.selector, measured: f.measured, text: f.text || "", states: [s.name] };
      e.key = keyOf(e);
      const old = findings.get(e.key);
      if (!old) findings.set(e.key, e);
      else if (!old.states.includes(s.name)) old.states.push(s.name);
    }
  }
  return { findings: [...findings.values()], flows };
}

// the file is one finding per line (small, and a diff shows what changed); a finding is {key, measured}
export function load() {
  if (!existsSync(BASELINE)) return null;
  const b = JSON.parse(readFileSync(BASELINE, "utf8"));
  b.findings = b.findings.map((f) => {
    const i = [0, 1, 2].reduce((at) => f.key.indexOf("|", at) + 1, 0); // the first three "|"
    const [check, flow, size] = f.key.slice(0, i - 1).split("|");
    return { ...f, check, flow, size, selector: f.key.slice(i), states: f.states || [], page: f.page || "" };
  });
  return b;
}
function save(out, path = BASELINE) {
  const flows = Object.keys(out.flows).sort().map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(out.flows[k])}`).join(",\n");
  const finds = out.findings.map((f) => "  " + JSON.stringify({ key: f.key, measured: f.measured })).join(",\n");
  writeFileSync(path, `{\n "version": 1,\n "generated": ${JSON.stringify(out.generated)},\n "flows": {\n${flows}\n },\n "findings": [\n${finds}\n ]\n}\n`);
}

// compare a run with the baseline, within the flows and sizes the run covered
export function compare(base, cur, scope) {
  const inScope = (x) => scope.has(fsKey(x.flow, x.size));
  const baseAll = base ? base.findings : [];
  const baseF = new Map(baseAll.filter(inScope).map((f) => [f.key, f]));
  const baseLoose = new Set(baseAll.map(looseKey));
  const curF = new Map(cur.findings.map((f) => [f.key, f]));
  const curLoose = new Set(cur.findings.map(looseKey));
  const unknown = cur.findings.filter((f) => !baseF.has(f.key));
  const added = unknown.filter((f) => !baseLoose.has(looseKey(f)));
  const moved = unknown.filter((f) => baseLoose.has(looseKey(f)));
  const fixed = [...baseF.values()].filter((f) => !curF.has(f.key) && !curLoose.has(looseKey(f)));
  const incomplete = [];
  const newErrors = [];
  const unbaselined = [], newIncomplete = [];
  for (const fs of scope) {
    const b = base && base.flows && base.flows[fs], c = cur.flows[fs];
    if (!b && c) { unbaselined.push(fs); if (!c.complete) newIncomplete.push(fs); }
    if (b && b.complete && c && !c.complete) incomplete.push(fs);
    if (c) for (const e of c.errors) if (!b || !(b.errors || []).includes(e)) newErrors.push(`${fs}: ${e}`);
  }
  return { added, moved, fixed, incomplete, newErrors, unbaselined, newIncomplete };
}

// append only: add the findings and the flow-sizes the baseline lacks; change nothing that is already there
export function append(base, cur, { path } = {}) {
  const out = JSON.parse(JSON.stringify(base));
  const have = new Set(out.findings.map((f) => f.key));
  let added = 0;
  for (const f of cur.findings) if (!have.has(f.key)) { out.findings.push(f); have.add(f.key); added++; }
  for (const [fs, v] of Object.entries(cur.flows)) if (!out.flows[fs]) out.flows[fs] = v;
  out.findings.sort((a, b) => a.key.localeCompare(b.key));
  out.generated = base.generated; // an append is not a regeneration
  save(out, path);
  out.added = added;
  return out;
}

// write a new baseline. shrinkOnly: keep only what the old one had (drop the fixed); accept: adopt the run's findings
export function update(base, cur, scope, { accept }) {
  const out = base ? JSON.parse(JSON.stringify(base)) : { version: 1, findings: [], flows: {} };
  const inScope = (x) => scope.has(fsKey(x.flow, x.size));
  const curF = new Map(cur.findings.map((f) => [f.key, f]));
  const curLoose = new Set(cur.findings.map(looseKey));
  const kept = [];
  for (const f of out.findings) {
    if (!inScope(f)) { kept.push(f); continue; }
    const c = curF.get(f.key);
    const run = cur.flows[fsKey(f.flow, f.size)];
    if (c) kept.push(accept ? c : { ...f, measured: c.measured, states: c.states }); // still there (refresh what it measures)
    else if (!accept && ((run && !run.complete) || curLoose.has(looseKey(f)))) kept.push(f); // flow stopped early, or it turned up in another flow: not fixed
    else if (accept) { /* adopted run replaces it */ }
  }
  if (accept) { const have = new Set(kept.map((f) => f.key)); for (const f of cur.findings) if (!have.has(f.key)) kept.push(f); }
  out.findings = kept.sort((a, b) => a.key.localeCompare(b.key));
  for (const fs of scope) {
    const c = cur.flows[fs]; if (!c) continue;
    const b = out.flows[fs];
    if (accept || !b) out.flows[fs] = c;
    else out.flows[fs] = { complete: b.complete || c.complete, states: c.states, errors: (b.errors || []).filter((e) => c.errors.includes(e)) };
  }
  out.generated = new Date().toISOString();
  save(out);
  return out;
}

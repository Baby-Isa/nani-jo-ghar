// The ratchet. build/lint/baseline.json holds today's findings; a run may not add one, and the count only goes down.
// A finding is identified by (check, flow, size, selector), not by state name, so a renamed state doesn't count as new.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./env.mjs";

export const BASELINE = join(ROOT, "build", "lint", "baseline.json");
export const keyOf = (f) => `${f.check}|${f.flow}|${f.size}|${f.selector}`;
const fsKey = (flow, size) => `${flow}@${size}`;

// results -> flat findings (one per key, with the states it showed in) and per flow-size facts
export function flatten(results) {
  const findings = new Map();
  const flows = {};
  for (const r of results) {
    flows[fsKey(r.flow, r.size)] = { complete: r.complete, errors: [...new Set(r.errors)].sort(), states: r.states.length };
    for (const s of r.states) for (const f of s.findings) {
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
function save(out) {
  const flows = Object.keys(out.flows).sort().map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(out.flows[k])}`).join(",\n");
  const finds = out.findings.map((f) => "  " + JSON.stringify({ key: f.key, measured: f.measured })).join(",\n");
  writeFileSync(BASELINE, `{\n "version": 1,\n "generated": ${JSON.stringify(out.generated)},\n "flows": {\n${flows}\n },\n "findings": [\n${finds}\n ]\n}\n`);
}

// compare a run with the baseline, within the flows and sizes the run covered
export function compare(base, cur, scope) {
  const inScope = (x) => scope.has(fsKey(x.flow, x.size));
  const baseF = new Map((base ? base.findings : []).filter(inScope).map((f) => [f.key, f]));
  const curF = new Map(cur.findings.map((f) => [f.key, f]));
  const added = cur.findings.filter((f) => !baseF.has(f.key));
  const fixed = [...baseF.values()].filter((f) => !curF.has(f.key));
  const incomplete = [];
  const newErrors = [];
  for (const fs of scope) {
    const b = base && base.flows && base.flows[fs], c = cur.flows[fs];
    if (b && b.complete && c && !c.complete) incomplete.push(fs);
    if (c) for (const e of c.errors) if (!b || !(b.errors || []).includes(e)) newErrors.push(`${fs}: ${e}`);
  }
  return { added, fixed, incomplete, newErrors };
}

// write a new baseline. shrinkOnly: keep only what the old one had (drop the fixed); accept: adopt the run's findings
export function update(base, cur, scope, { accept }) {
  const out = base ? JSON.parse(JSON.stringify(base)) : { version: 1, findings: [], flows: {} };
  const inScope = (x) => scope.has(fsKey(x.flow, x.size));
  const curF = new Map(cur.findings.map((f) => [f.key, f]));
  const kept = [];
  for (const f of out.findings) {
    if (!inScope(f)) { kept.push(f); continue; }
    const c = curF.get(f.key);
    const run = cur.flows[fsKey(f.flow, f.size)];
    if (c) kept.push(accept ? c : { ...f, measured: c.measured, states: c.states }); // still there (refresh what it measures)
    else if (run && !run.complete && !accept) kept.push(f);   // the flow stopped early: can't tell it was fixed
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

// The one loop (S13-T, docs/architecture/evidence-loop.md "The one loop (S13)"): a builder's brief -> its rows' evidence, BEFORE the
// build and AFTER it, from the same probes at the same sizes, and the judge's before-beside-after batch. Pure (no browser, no git),
// unit tested in build/tools/review/evidence.test.mjs. The CLI is build/tools/review/evidence.mjs --before|--after|--judge --brief.
//   ROW_ID                               a fix-list row id in a text (SH-19, CLN-57, DAAR-11, CHAI-02)
//   briefRows(spec, knownIds)            the brief's rows: spec.rows, then every row id its tasks name (do and accept), known ones only
//   briefSizes(spec) / briefSlug(spec)   the sizes it plays (default 1366x768 and 915x412) and its folder name
//   briefProbes(probes, spec)            a row's probes for the brief: on the brief's flows (all when none plays one), at its sizes,
//                                        and a moving thing filmed at 250 and 500 ms (strip:<sel>:4x<ms>) beside its own strip
//   panelKey(...) / pairPanels(b, a)     a panel's identity across two runs (probe, level, size, capture) and the before|after pairs
export const ROW_ID = /\b([A-Z][A-Z]*-(?:[A-Z0-9]+-)*\d+)\b/g;
export const BRIEF_SIZES = ["1366x768", "915x412"];
export const STRIP_MS = [250, 500];
export const STRIP_FRAMES = 4;

const texts = (spec) => [...(spec.tasks || []).flatMap((t) => (typeof t === "string" ? [t] : [t.do, t.accept])), spec.name || ""].filter(Boolean).map(String);
// -> {rows: [ids in order], named: [every id seen], unknown: [ids not on the fix list or its archive], newRows: [ids]}
export function briefRows(spec, knownIds) {
  const known = knownIds instanceof Set ? knownIds : new Set(knownIds || []);
  const named = [];
  const add = (id) => { if (!named.includes(id)) named.push(id); };
  for (const id of spec.rows || []) add(String(id).trim());
  for (const t of texts(spec)) for (const m of t.matchAll(ROW_ID)) add(m[1]);
  // a build ID in a task's words (S13-A1, F7, CK-48's sibling "S12") is not a row: only the fix list's ids count
  const rows = named.filter((id) => known.has(id));
  const newRows = [...new Set((spec.newRows || spec.newFeatures || []).map(String))].filter((id) => rows.includes(id));
  return { rows, named, unknown: named.filter((id) => !known.has(id) && (spec.rows || []).includes(id)), newRows };
}
export const briefSizes = (spec) => (Array.isArray(spec.sizes) && spec.sizes.length ? spec.sizes.map(String) : BRIEF_SIZES.slice());
export const briefSlug = (spec, file = "") => String(spec.report || spec.slug || String(file).split("/").pop().replace(/\.json$/, "") || "brief").toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
const baseOf = (flowId) => String(flowId || "").replace(/[@#].*$/, "");

// probes: one row's normalized probes (sandbox/lib/evidence.mjs normalizeSpec); spec: the brief. parse: parseCapture.
export function briefProbes(probes, spec, parse) {
  const flows = (spec.flows || []).map(baseOf);
  const hit = probes.filter((p) => !p.repo && flows.includes(baseOf(p.flowId)));
  const use = hit.length ? probes.filter((p) => p.repo || hit.includes(p)) : probes;
  const sizes = briefSizes(spec);
  const ms = Array.isArray(spec.strips) ? spec.strips.map(Number) : STRIP_MS;
  return use.map((p) => {
    if (p.repo) return p;
    const capture = p.capture.slice();
    // (an every: probe films each of its moments already: no more strips for it)
    if (p.kind === "motion" && !p.every && parse) {
      for (const sel of [...new Set(p.capture.filter((c) => c.kind === "strip" || c.kind === "trace").map((c) => c.sel))]) {
        for (const m of ms) {
          const raw = `strip:${sel}:${STRIP_FRAMES}x${m}`;
          if (!capture.some((c) => c.raw === raw)) { const c = parse(raw); if (!c.error) capture.push(c); }
        }
      }
    }
    return { ...p, sizes, capture };
  });
}

// a panel's identity: the same probe, level, size and capture in the before and the after run
export const panelKey = (probe, level, size, raw, type = "img") => `p${probe + 1}|L${level}|${size}|${type === "room" ? "room:" : ""}${raw}`;
// before, after: [{key, ...}] -> [{key, before, after}] in the after's order, then the before's leftovers
export function pairPanels(before = [], after = []) {
  const out = [], seen = new Set();
  for (const a of after) { out.push({ key: a.key, before: before.find((b) => b.key === a.key) || null, after: a }); seen.add(a.key); }
  for (const b of before) if (!seen.has(b.key)) { out.push({ key: b.key, before: b, after: null }); seen.add(b.key); }
  return out;
}
// what a missing before means on the sheet: a new feature (the row describes something not built yet) is "not there yet"; any other
// row's missing before is a probe fault (the judge answers EVIDENCE, never PASS)
export const beforeNote = (isNew, tool = []) => (isNew ? "not there yet (a new feature: nothing to show before the build)" : `PROBE FAULT: the before shows nothing${tool.length ? ` (${tool[0]})` : ""}`);

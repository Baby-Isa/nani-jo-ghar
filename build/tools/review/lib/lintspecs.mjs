// --lint-specs: a static pass over build/sandbox/data/evidence.json that needs no browser (S05-T2; docs/architecture/evidence-loop.md
// "Probe pitfalls"). Pure: the caller hands in what the repo knows.
//   lintSpecs(spec, ctx) -> [{kind, row, probe, msg}]
//   ctx: {flows:Set of run.mjs --list ids, legacy:Set, corpus:string (js/ and css/ text), exists(path)->bool, lexicon:Set (the words the family says), rowText:{ID: text}}
// kinds: flow (unknown flow), legacy (a legacy lab), selector (absent from js/ and css/), end-card (a moment after the end card for a
// row that is not about it), cmd (script missing), expect (an expect with no markers)
export const LEGACY_FLOWS = ["cook:fill", "cook:fry", "cook:roll"]; // the old Station labs; the current samosa and maani flows replace them
const END_MOMENTS = /^(?:every:)?(?:rec:)?(?:results|result|page:end)(?:-|$)|^(?:every:)?life:results/;
const ABOUT_END = /\b(end|result|results|review|badge|badges|score|star|stars|tick|ticks|word review|summary|finale)\b/i;

export const baseFlow = (f) => String(f || "").replace(/#[\w-]+$/, "").replace(/@L\d+/, "");

// the class and id tokens of a CSS selector (not pseudo-classes, attribute values, or canvas:/hook:/tool: names)
export function selectorTokens(sel) {
  const s = String(sel || "");
  if (/^(canvas|hook|tool):/.test(s)) return [];
  const out = new Set();
  for (const m of s.replace(/\[[^\]]*\]/g, "").replace(/:(not|is|has|where)\(/g, " ").matchAll(/([.#])(-?[_a-zA-Z][\w-]*)/g)) out.add(m[1] + m[2]);
  return [...out];
}
const selectorsOf = (pr) => {
  const out = [];
  for (const c of pr.capture || []) { const m = /^(?:crop|zoom2|strip|dom|trace):(.+?)(?::\d+x\d+|:\d+)?(?:@[\w:-]+)?$/.exec(c); if (m) out.push(m[1]); }
  for (const e of pr.expect || []) { const m = /^!?(?:count|noClip|lines|minFont|minSize|centredOn|inside|noOverlap|lastsMs|traceAmp|tracePeriod):(.+?)(?:[<>=!]+\d+)?$/.exec(e); if (m) out.push(...m[1].split(",")); }
  for (const w of [pr.at, pr.after]) { const m = /^(?:every:)?(?:visible|hidden|only):(.+)$/.exec(String(w || "")); if (m) out.push(m[1]); }
  return out;
};

export function lintSpecs(spec, ctx) {
  const out = [];
  for (const [row, entry] of Object.entries(spec || {})) {
    if (row[0] === "_" || !entry) continue;
    const probes = Array.isArray(entry) ? entry : Array.isArray(entry.probes) ? entry.probes : [];
    probes.forEach((pr, i) => {
      const add = (kind, msg) => out.push({ kind, row, probe: i + 1, msg });
      const flow = baseFlow(pr.flow);
      if (flow && flow !== "repo") {
        if (ctx.legacy.has(flow)) add("legacy", `${pr.flow} is a legacy lab: point the probe at the current samosa or maani flow`);
        else if (!ctx.flows.has(flow) && !ctx.flows.has(String(pr.flow)) && !/^cook:recipe:/.test(flow) && !/^lab:/.test(flow)) add("flow", `${pr.flow} is not in run.mjs --list`);
      }
      const seen = new Set();
      for (const sel of selectorsOf(pr)) for (const t of selectorTokens(sel)) {
        if (seen.has(t)) continue; seen.add(t);
        if (!ctx.corpus.includes(t.slice(1))) add("selector", `${t} is in no js/ or css/ file (${sel})`);
      }
      const ends = [pr.at, pr.after, ...(pr.capture || []).map((c) => (/@([\w:-]+)$/.exec(c) || [])[1])].filter((m) => m && END_MOMENTS.test(m));
      if (ends.length && !ABOUT_END.test(`${(ctx.rowText || {})[row] || ""} ${pr.note || ""}`)) add("end-card", `${ends.join(", ")} is after the end card but the row is not about the end`);
      for (const c of pr.capture || []) if (/^cmd:/.test(c)) for (const tok of c.slice(4).split(/\s+/)) if (/^(?:build|docs|data|assets|js|css)\/[^\s*]+\.(?:py|mjs|js|json|md|png|webp)$/.test(tok) && !ctx.exists(tok)) add("cmd", `${tok} does not exist`);
      for (const e of pr.expect || []) {
        const m = /^!?order:(.+)$/.exec(e);
        if (!m) continue;
        const items = m[1].split(",").map((x) => x.trim()).filter(Boolean);
        if (items.every((x) => /^[.#[]|:|^[a-z]+\[|^\/.+\/$/.test(x))) continue; // selectors or regexes
        const miss = items.filter((x) => !x.split(/\s+/).every((w) => ctx.lexicon.has(w.toLowerCase())));
        if (miss.length) add("expect", `${e}: ${miss.join(", ")} are not words the family says, so the order has no markers; order selectors, /regexes/ or recorded Kutchi words`);
      }
    });
  }
  return out;
}

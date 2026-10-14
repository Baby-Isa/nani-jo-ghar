// The feedback coverage gate (checks-to-build 24; rules A5, A6): a finished feedback report maps every transcript line to a point
// or to chatter, and every point names its cause in code as file:line (or says "not code: <art | Mum | Zafar | design ...>").
// feedback.mjs --check <report.md> runs it and exits 1 on any problem.
const CAUSE = /[\w./-]+\.(?:js|mjs|css|json|html|py|md):\d+|^not code:/i;
const cells = (l) => l.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim());
export function checkReport(md) {
  const out = [];
  const sec = (n) => { const m = new RegExp(`^## ${n}\\.[^\\n]*\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`, "m").exec(md); return m ? m[1] : null; };
  const points = sec(2), cover = sec(4);
  if (points == null) out.push("no section 2 (every point)");
  else for (const l of points.split("\n").filter((x) => /^\|\s*P\d+/.test(x))) {
    const c = cells(l);
    if (!CAUSE.test(c[4] || "")) out.push(`${c[0]}: no cause in code (file:line), or "not code: ..."`);
  }
  if (cover == null) out.push("no section 4 (coverage)");
  else for (const l of cover.split("\n").filter((x) => /^\|/.test(x) && /\bunmapped\b/i.test(x))) out.push(`transcript lines ${cells(l)[0]} are unmapped (a point, or "chatter")`);
  const tail = /unmapped (\d+)\./.exec(md);
  if (tail && +tail[1] > 0 && !out.some((x) => /unmapped/.test(x))) out.push(`${tail[1]} transcript lines unmapped`);
  return out;
}

/*
 * The gap reporter (the minimum step 4c, decision 38 (c)): given the meanings a game needs, what the engine can't
 * say yet, or has no recording for, as a plain list for Mum. No frequency ranking and no simulator (deferred until
 * whole arcs are settled): each gap lists the lines that need it, in the order the game gave them.
 *
 *   gapReport(engine, needs, { ctx, elicit }) -> { items, text }
 *   needs: [{ label?, meaning, ctx? }]       elicit: data/lang/elicit.json (templates and headings)
 *   items: [{ kind, key, what, ask, neededBy: [label], example, request }]   text: the list, as Markdown
 *
 * The English here is for grown-ups (Mum's sheet), from the data's own glosses and elicit sentences.
 */
const ORDER = ["rule", "lexeme", "form", "feature", "audio"];

export function gapReport(engine, needs, { ctx = {}, elicit = null, title = "What the engine can't say yet" } = {}) {
  const T = (elicit && elicit.templates) || {};
  const H = (elicit && elicit.headings) || {};
  const L = engine.linearizer;
  const byKey = new Map();
  (needs || []).forEach((need, i) => {
    const label = need.label || `line ${i + 1}`;
    const r = engine.say(need.meaning, { ...ctx, ...(need.ctx || {}) });
    for (const g of r.gaps) {
      let item = byKey.get(g.key);
      if (!item) {
        item = { kind: g.kind, key: g.key, id: g.id, lex: g.lex, cell: g.cell, feature: g.feature, what: g.what, ask: [], neededBy: [], example: r.en, text: g.t };
        byKey.set(g.key, item);
      }
      for (const a of g.ask || []) if (!item.ask.includes(a)) item.ask.push(a);
      if (!item.neededBy.includes(label)) item.neededBy.push(label);
    }
  });

  const fillT = (tpl, vals) => String(tpl || "").replace(/\{(\w+)\}/g, (_, k) => (vals[k] != null ? vals[k] : `{${k}}`));
  const items = Array.from(byKey.values());
  for (const it of items) {
    const e = it.lex ? L.lexOf(it.lex) : null;
    const vals = { gloss: (e && (e.gloss || e.en)) || it.lex || "", glossPl: (e && (e.glossPl || e.gloss)) || it.lex || "", example: it.example, text: it.text || "" };
    if (it.kind === "rule") {
      const abs = L.functions[it.id] || {};
      it.request = [T.rule || "", ...(abs.elicit || []).map((s) => `"${s}"`)].filter(Boolean).join(" ");
    } else if (it.kind === "form") {
      // a noun's plural or "with the …" form has its own short template; any other word is asked in the line itself
      const cell = it.cell || "";
      const noun = e && (e.pos === "N" || e.pos === "PN");
      const t = noun && /(^|\.)obl(\.|$)/.test(cell) ? T["form.obl"] : noun && /(^|\.)pl(\.|$)/.test(cell) ? T["form.pl"] : T.form;
      it.request = fillT(t, vals);
    } else if (it.kind === "feature") it.request = fillT(T[`feature.${it.feature}`] || T.feature, vals);
    else it.request = fillT(T[it.kind], vals);
  }
  items.sort((a, b) => ORDER.indexOf(a.kind) - ORDER.indexOf(b.kind));

  const lines = [`# ${title}`, "", `${(needs || []).length} lines checked; ${items.length} things to ask or record.`, ""];
  for (const kind of ORDER) {
    const group = items.filter((x) => x.kind === kind);
    if (!group.length) continue;
    lines.push(`## ${H[kind] || kind}`, "");
    group.forEach((it, i) => {
      const ask = it.ask.length ? ` Ask: ${it.ask.join(", ")}.` : "";
      lines.push(`${i + 1}. ${it.request || it.what}${ask}`);
      lines.push(`   - Why: ${it.what}. Needed by ${it.neededBy.length} line${it.neededBy.length === 1 ? "" : "s"}: ${it.neededBy.slice(0, 5).join("; ")}${it.neededBy.length > 5 ? " …" : ""}.`);
    });
    lines.push("");
  }
  if (!items.length) lines.push("Nothing missing: the engine can say every line, and every word has a recording.", "");
  return { items, text: lines.join("\n") };
}

export default gapReport;

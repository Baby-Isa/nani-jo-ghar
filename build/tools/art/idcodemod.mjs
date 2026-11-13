#!/usr/bin/env node
// Step 2's codemod (s19-night-art; build/reports/s19-art-rename-plan.md): a game's path strings become ids. Dry run by default: lists,
// per game, every whole path string in its station code (js/cook/stations/<k>.js) and settings (data/stations/<k>.json) with the piece
// and state it is (through the ledger for a renamed file), the rewrite it would make, and what is left for a person: a path built from a
// folder and a stem ("dir" + stem), which no mechanical rewrite can make an id. Code: "assets/..." -> Cook.Art.file("<id>", "<state>");
// settings: a string field is left as it is (Step 2's settings rewrite waits for the station code that reads it; they load through was).
//   node build/tools/art/idcodemod.mjs --game mishkaki-grill [--write]     (--write only when the orchestrator has cleared the game)
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { ROOT, load, fileIndex, loadLedger, wasOf, RENAME_ORDER } from "./registry.mjs";

const PATH = /(["'`])(assets\/[^"'`\s$*{}]+\.(?:png|webp|jpe?g|svg))\1/g;
export function codemod(game, { root = ROOT, reg = load(root), led = loadLedger(root) } = {}) {
  const idx = fileIndex(reg), was = wasOf(led);
  const out = { game, code: [], data: [], built: [], unknown: [] };
  const js = `js/cook/stations/${game}.js`, json = `data/stations/${game}.json`;
  let text = null;
  if (existsSync(join(root, js))) {
    text = readFileSync(join(root, js), "utf8");
    text = text.replace(PATH, (all, q, p) => {
      const f = idx.get(was[p] || p);
      if (!f || f.role !== "current") { out.unknown.push({ file: js, path: p }); return all; }
      out.code.push({ file: js, path: p, id: f.id, state: f.state });
      return `Cook.Art.file(${JSON.stringify(f.id)}, ${JSON.stringify(f.state)})`;
    });
    for (const m of readFileSync(join(root, js), "utf8").matchAll(/["'`](assets\/[^"'`\s]*\/)["'`]/g)) out.built.push({ file: js, dir: m[1] });
  }
  if (existsSync(join(root, json))) {
    const t = readFileSync(join(root, json), "utf8");
    for (const m of t.matchAll(PATH)) { const f = idx.get(was[m[2]] || m[2]); (f && f.role === "current" ? out.data : out.unknown).push({ file: json, path: m[2], ...(f ? { id: f.id, state: f.state } : {}) }); }
    for (const m of t.matchAll(/"dir":\s*"(assets\/[^"]*)"/g)) out.built.push({ file: json, dir: m[1] });
  }
  return { ...out, text, js };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const argv = process.argv.slice(2), gi = argv.indexOf("--game");
  const games = gi >= 0 ? [argv[gi + 1]] : RENAME_ORDER;
  for (const g of games) {
    const r = codemod(g);
    console.log(`${g}: code ${r.code.length} path strings -> Cook.Art.file; settings ${r.data.length} path strings (load through was); ${r.built.length} folder+stem paths (by hand); ${r.unknown.length} not a current piece`);
    if (argv.includes("--verbose")) for (const x of [...r.code, ...r.data]) console.log(`  ${x.file}: ${x.path} = ${x.id} ${x.state}`);
    if (argv.includes("--write") && r.code.length) { writeFileSync(join(ROOT, r.js), r.text); console.log(`  wrote ${r.js}`); }
  }
}

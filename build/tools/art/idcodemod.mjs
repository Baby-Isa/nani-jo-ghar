#!/usr/bin/env node
// Step 2's codemod (s19-night-art; build/reports/s19-art-rename-plan.md): a game's path strings become ids. Dry run by default: lists,
// per game, every whole path string in its station code (js/cook/stations/<k>.js) and settings (data/stations/<k>.json) with the piece
// and state it is (through the ledger for a renamed file), the rewrite it would make, and what is left for a person: a path built from a
// folder and a stem ("dir" + stem), which no mechanical rewrite can make an id. Code: "assets/..." -> Cook.Art.file("<id>", "<state>");
// settings (JSON cannot call): a whole path string -> the registry's file for that piece and state today (Cook.Art.file's answer), so
// nothing loads through was; the id form waits for station code that reads ids. A manifest glob is left (loadcheck reads it by first name).
//   node build/tools/art/idcodemod.mjs [--game mishkaki-grill] [--patch DIR] [--write]
//     --patch DIR   write DIR/<game>.patch (git apply, from the repo root), nothing applied
//     --write       apply to the station files (only when the orchestrator has cleared the game)
import { readFileSync, writeFileSync, existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
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
  let jtext = null;
  if (existsSync(join(root, json))) {
    const t = readFileSync(join(root, json), "utf8");
    jtext = t.replace(PATH, (all, q, p) => {
      const f = idx.get(was[p] || p);
      if (!f || f.role !== "current") { out.unknown.push({ file: json, path: p }); return all; }
      const now = reg.pieces[f.id].states[f.state];
      out.data.push({ file: json, path: p, id: f.id, state: f.state, now });
      return now === p ? all : `${q}${now}${q}`;
    });
    for (const m of t.matchAll(/"dir":\s*"(assets\/[^"]*)"/g)) out.built.push({ file: json, dir: m[1] });
  }
  return { ...out, text, js, jtext, json };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const argv = process.argv.slice(2), gi = argv.indexOf("--game");
  const games = gi >= 0 ? [argv[gi + 1]] : RENAME_ORDER;
  for (const g of games) {
    const r = codemod(g);
    console.log(`${g}: code ${r.code.length} path strings -> Cook.Art.file; settings ${r.data.length} path strings -> today's registry file; ${r.built.length} folder+stem paths (by hand); ${r.unknown.length} not a current piece`);
    if (argv.includes("--verbose")) for (const x of [...r.code, ...r.data]) console.log(`  ${x.file}: ${x.path} = ${x.id} ${x.state}`);
    const pi = argv.indexOf("--patch");
    if (pi >= 0) {
      const dir = argv[pi + 1];
      mkdirSync(dir, { recursive: true });
      const tmp = mkdtempSync(join(tmpdir(), "idcodemod-"));
      let patch = "";
      for (const [f, t] of [[r.js, r.text], [r.json, r.jtext]]) {
        if (t == null || t === readFileSync(join(ROOT, f), "utf8")) continue;
        writeFileSync(join(tmp, "new"), t);
        const d = spawnSync("diff", ["-u", "--label", `a/${f}`, "--label", `b/${f}`, join(ROOT, f), join(tmp, "new")], { encoding: "utf8" });
        patch += d.stdout;
      }
      rmSync(tmp, { recursive: true, force: true });
      const head = `# Step 2 for ${g} (build/tools/art/idcodemod.mjs, from ${spawnSync("git", ["rev-parse", "--short", "HEAD"], { cwd: ROOT, encoding: "utf8" }).stdout.trim()}): ${r.code.length} code path strings -> Cook.Art.file, ${r.data.length} settings path strings -> today's registry file; by hand: ${r.built.map((b) => `${b.file} ${b.dir}`).join(", ") || "none"}; not a current piece (left): ${r.unknown.map((u) => u.path).join(", ") || "none"}\n# apply from the repo root: git apply ${dir}/${g}.patch (re-run the codemod instead if the station files changed since)\n`;
      if (!patch) { rmSync(join(dir, `${g}.patch`), { force: true }); console.log(`  ${g}: nothing to change (no patch)`); continue; }
      writeFileSync(join(dir, `${g}.patch`), head + patch);
      console.log(`  ${dir}/${g}.patch: ${patch.split("\n").filter((l) => /^\+[^+]/.test(l)).length} lines changed`);
    }
    if (argv.includes("--write")) for (const [f, t] of [[r.js, r.text], [r.json, r.jtext]]) if (t != null && t !== readFileSync(join(ROOT, f), "utf8")) { writeFileSync(join(ROOT, f), t); console.log(`  wrote ${f}`); }
  }
}

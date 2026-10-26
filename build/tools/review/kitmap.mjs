#!/usr/bin/env node
// Where a shared element is drawn or styled (S13-T, the one loop): per element of data/kit-elements.json, every file:line its grep
// rules find in js/, css/ and the pages (the rules are seeded from build/reports/s13-kit-review.md section 3), the kit's own home
// first (js/shared, css/shared), then the copies outside it (a game's own: the places a builder deletes or moves), then the parked
// games' (out of scope until they are unparked). A CSS rule found on its first line is shown to its closing brace (cook.css:795-804);
// lines next to each other are one range. build/tools/ops/brief.mjs pastes it under PLACES for a brief naming the element.
//   node build/tools/review/kitmap.mjs [--elem finger,glow] [--json]
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { ROOT, args, help, die } from "./lib/common.mjs";

export const PARKED = /^(js\/(monsoon|tidy|who|dress|find|snap)\/|css\/(monsoon|tidy|who|dress|find|snap|parked-panels)\.css$|(monsoon|tidy|who|dress|find|snap)\.html$)/;
export const KIT_HOME = /^(js\/shared\/|css\/shared\/)/;
const slugOf = (s) => String(s).toLowerCase().replace(/\?/g, "q").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const loadKit = (root = ROOT) => JSON.parse(readFileSync(join(root, "data", "kit-elements.json"), "utf8"));
export function findElement(kit, name) { return Object.keys(kit.elements).find((n) => n === name || slugOf(n) === slugOf(name)) || null; }

// the files the map reads: js/**, css/**, the pages (*.html at the root); the test and lab tools are not the game
function files(root) {
  const out = [];
  const walk = (d) => { for (const n of readdirSync(join(root, d))) { const p = `${d}/${n}`; const s = statSync(join(root, p)); if (s.isDirectory()) walk(p); else if (/\.(m?js|css)$/.test(n) && !/\.test\.m?js$/.test(n)) out.push(p); } };
  for (const d of ["js", "css"]) walk(d);
  for (const n of readdirSync(root)) if (n.endsWith(".html")) out.push(n);
  return out.sort();
}
// the line numbers a file's matches cover: a CSS rule's first line runs to its closing brace
function spans(text, isCss, res) {
  const lines = text.split("\n"), out = [];
  for (let i = 0; i < lines.length; i++) {
    if (!res.some((re) => re.test(lines[i]))) continue;
    let j = i;
    if (isCss && lines[i].includes("{") && !lines[i].includes("}")) { let d = 0; for (let k = i; k < lines.length; k++) { d += (lines[k].match(/\{/g) || []).length - (lines[k].match(/\}/g) || []).length; if (d <= 0) { j = k; break; } } }
    out.push([i + 1, j + 1]);
  }
  // merged: overlapping or touching ranges
  const merged = [];
  for (const [a, b] of out.sort((x, y) => x[0] - y[0])) { const l = merged[merged.length - 1]; if (l && a <= l[1] + 1) l[1] = Math.max(l[1], b); else merged.push([a, b]); }
  return merged;
}
export const fmtSpan = ([a, b]) => (a === b ? `${a}` : `${a}-${b}`);
// -> {element, kit: [{file, spans}], copies: [...], parked: [...]}
export function kitMap(names = null, { root = ROOT, kit = loadKit(root) } = {}) {
  const list = names && names.length ? names.map((n) => findElement(kit, n) || n) : Object.keys(kit.elements);
  const all = files(root), text = new Map();
  const read = (f) => { if (!text.has(f)) text.set(f, readFileSync(join(root, f), "utf8")); return text.get(f); };
  const out = [];
  for (const name of list) {
    const E = kit.elements[name];
    if (!E) { out.push({ element: name, error: `no element "${name}" in data/kit-elements.json` }); continue; }
    const res = (E.grep || []).map((g) => new RegExp(g));
    const hit = { kit: [], copies: [], parked: [] };
    for (const f of all) {
      const s = spans(read(f), f.endsWith(".css"), res);
      if (!s.length) continue;
      (KIT_HOME.test(f) ? hit.kit : PARKED.test(f) ? hit.parked : hit.copies).push({ file: f, spans: s });
    }
    out.push({ element: name, sel: E.sel, ...hit });
  }
  return out;
}
// the text a brief pastes (and the CLI prints): one block per element
export function kitMapText(map, { maxPerFile = 12 } = {}) {
  const line = (x) => `${x.file}:${x.spans.slice(0, maxPerFile).map(fmtSpan).join(",")}${x.spans.length > maxPerFile ? ` (+${x.spans.length - maxPerFile} more)` : ""}`;
  return map.map((m) => m.error ? `  ${m.element}: ${m.error}` : [
    `  ${m.element} (${m.sel}):`,
    `    the kit: ${m.kit.map(line).join("; ") || "none"}`,
    `    outside the kit (${m.copies.length} files: a call to the kit stays; a game's own copy moves to the kit or goes): ${m.copies.map(line).join("; ") || "none"}`,
    ...(m.parked.length ? [`    parked games (out of scope until unparked): ${m.parked.map(line).join("; ")}`] : []),
  ].join("\n")).join("\n");
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const a = args();
  help(readFileSync(new URL(import.meta.url), "utf8").split("\n").slice(1, 8).map((l) => l.replace(/^\/\/ ?/, "")).join("\n"), a);
  const kit = loadKit();
  const names = a.val("elem") ? String(a.val("elem")).split(",").map((s) => s.trim()) : null;
  for (const n of names || []) if (!findElement(kit, n)) die(`No element "${n}" (data/kit-elements.json: ${Object.keys(kit.elements).join(", ")}).`);
  const map = kitMap(names, { kit });
  if (a.has("json")) console.log(JSON.stringify(map, null, 1));
  else console.log(kitMapText(map, { maxPerFile: 40 }));
}

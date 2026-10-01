// The static CSS lint (no browser, about a second): spacing values sit on the grid (LAY-03, F16).
//   spacing-grid   a margin, padding or gap in px (or rem) that is not 0, 4, 8, 12 or a multiple of 8
// Allowed: 0, 4, 8, 12, 16, 24, 32, 40, 48 ... (the checklist's set, and every multiple of 8). Anything computed (calc, clamp, var,
// min, max), a percentage, vw/vh or em is left alone: only a plain length can be judged without rendering. rem counts as 16 px.
// Findings are identified by file, rule selector, property and value, so the ratchet (build/lint/baseline.json, flow "css") only
// ever shrinks. `node build/lint/css.mjs` lists them; `node build/lint/css.mjs --count` prints the total.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const SPACING = /^(margin|padding)(-(top|right|bottom|left|inline|block)(-(start|end))?)?$|^(gap|row-gap|column-gap|grid-gap|grid-row-gap|grid-column-gap)$/;

export const onGrid = (px) => { const v = Math.round(Math.abs(px) * 100) / 100; return v === 0 || v === 4 || v === 8 || v === 12 || (Number.isInteger(v) && v % 8 === 0); };

function stripComments(s) { return s.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " ")); }

// split on a character outside parentheses and quotes
function splitTop(s, ch) {
  const out = []; let depth = 0, q = null, cur = "";
  for (const c of s) {
    if (q) { cur += c; if (c === q) q = null; continue; }
    if (c === '"' || c === "'") { q = c; cur += c; continue; }
    if (c === "(") depth++;
    if (c === ")") depth--;
    if (c === ch && depth === 0) { out.push(cur); cur = ""; continue; }
    cur += c;
  }
  out.push(cur);
  return out;
}

// -> [{selector, context, decls: [[prop, value]]}]
export function parseRules(text) {
  const s = stripComments(text);
  const rules = [];
  const walk = (i, context, stopAtBrace) => {
    let prelude = "";
    while (i < s.length) {
      const c = s[i];
      if (c === "}") { if (stopAtBrace) return i + 1; i++; continue; }
      if (c === "{") {
        const head = prelude.trim().replace(/\s+/g, " ");
        // find the matching close
        let d = 1, j = i + 1;
        while (j < s.length && d > 0) { if (s[j] === "{") d++; else if (s[j] === "}") d--; j++; }
        const body = s.slice(i + 1, j - 1);
        if (/^@(media|supports|layer|container|document)/i.test(head)) { walkInner(body, context.concat(head.replace(/\s+/g, " ")), rules); }
        else if (/^@/.test(head)) { /* keyframes, font-face, page: not layout spacing */ }
        else rules.push({ selector: head, context: context.join(" "), decls: decls(body) });
        i = j; prelude = ""; continue;
      }
      if (c === ";") { prelude = ""; i++; continue; } // @import, @charset
      prelude += c; i++;
    }
    return i;
  };
  const walkInner = (body, context, into) => { const sub = parseRules(body); for (const r of sub) into.push({ ...r, context: [context.join(" "), r.context].filter(Boolean).join(" ") }); };
  walk(0, [], false);
  return rules;
}

function decls(body) {
  const out = [];
  for (const d of splitTop(body, ";")) {
    const k = d.indexOf(":");
    if (k < 0) continue;
    const prop = d.slice(0, k).trim().toLowerCase();
    const value = d.slice(k + 1).replace(/!important/i, "").trim();
    if (prop && value && !prop.startsWith("--")) out.push([prop, value]);
  }
  return out;
}

// the offending plain lengths in one value, as ["10px", "5px"]
export function offGrid(value) {
  const bad = [];
  for (const tok of splitTop(value.replace(/\s+/g, " "), " ")) {
    const t = tok.trim();
    const m = /^(-?\d*\.?\d+)(px|rem)$/i.exec(t);
    if (!m) continue; // 0, auto, %, vw, vh, em, var(), calc(), clamp(), min(), max(), keywords
    const px = parseFloat(m[1]) * (m[2].toLowerCase() === "rem" ? 16 : 1);
    if (!onGrid(px)) bad.push(t);
  }
  return bad;
}

export function lintCssText(text, file) {
  const out = [];
  for (const r of parseRules(text)) {
    for (const [prop, value] of r.decls) {
      if (!SPACING.test(prop)) continue;
      const bad = offGrid(value);
      if (bad.length) out.push({ check: "spacing-grid", selector: `${file} | ${r.context ? r.context + " | " : ""}${r.selector} | ${prop}: ${value}`, measured: bad.join(" "), text: "" });
    }
  }
  return out;
}

export function cssFiles(dir = join(ROOT, "css")) {
  const out = [];
  for (const f of readdirSync(dir).sort()) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) out.push(...cssFiles(p));
    else if (f.endsWith(".css")) out.push(p);
  }
  return out;
}

// every live stylesheet (css/**); the labs' own styles are developer chrome and are left out
export function lintCssAll() {
  const out = [];
  for (const p of cssFiles()) out.push(...lintCssText(readFileSync(p, "utf8"), relative(ROOT, p)));
  return out;
}

if (process.argv[1] && process.argv[1].endsWith("css.mjs")) {
  const all = lintCssAll();
  if (process.argv.includes("--count")) console.log(all.length);
  else for (const f of all) console.log(`${f.check} ${f.measured}\t${f.selector}`);
}

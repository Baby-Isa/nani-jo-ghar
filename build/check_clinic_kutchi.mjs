// No Kutchi in the clinic's code (rule G13; R5's acceptance): every Kutchi word the clinic says comes from data through
// the language seam (js/clinic/lang.js, js/core/lang). This scans every string and template literal in js/clinic/**
// (comments are skipped) for a word of the Kutchi lexicon (data/clinic/lang.json, data/cook.json, the clinic's data
// files) and exits 1 on any. Run: node build/check_clinic_kutchi.mjs [--list]
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const J = (p) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));

// every Kutchi word the data knows (word by word)
const words = new Set();
const addText = (t) => String(t || "").toLowerCase().replace(/\[[^\]]*\]/g, " ").replace(/\{[^}]*\}/g, " ").split(/[^a-z']+/).filter((w) => w.length >= 2).forEach((w) => words.add(w));
const walk = (o) => {
  if (!o || typeof o !== "object") return;
  for (const [k, v] of Object.entries(o)) {
    if ((k === "kutchi" || k === "k" || k === "kutchi_one" || k === "kutchi_many") && typeof v === "string") addText(v);
    else if (k === "forms" && v && typeof v === "object") Object.values(v).forEach(addText);
    else walk(v);
  }
};
walk(J("data/clinic/lang.json"));
walk(J("data/cook.json").words);
walk(J("data/clinic/pipeline.json"));
const nums = J("data/clinic/heal/cut.json").numbers || {};
Object.values(nums).forEach(addText);
// words that are also everyday English or code (a string holding them is not Kutchi): judged by hand, listed here
const ENGLISH = new Set(["chai", "na", "char", "ne", "ba", "ka", "to", "me", "in", "re", "pan", "kari", "masala", "samosa", "mango", "lassi", "naan", "chapati", "chilli", "curry", "dal", "daal", "achar", "ali", "layla", "nana", "ma"]);
const KEEP_SHORT = new Set(["ba", "na", "ne"]); // short Kutchi words checked only as a whole literal (e.g. "ba", "na ")
// data keys: a literal that IS an item's id ("paani", the jug's id in data/clinic.json) names data, it isn't text
const IDS = new Set();
[J("data/clinic.json").items, J("data/clinic/pipeline.json").items, J("data/clinic/pipeline.json").lines, J("data/clinic.json").lines, J("data/clinic/pipeline.json").goodbyes].forEach((m) => Object.keys(m || {}).forEach((k) => IDS.add(k)));
readdirSync(join(ROOT, "data/clinic/heal")).forEach((f) => {
  const d = J(`data/clinic/heal/${f}`);
  Object.keys(d.items || {}).forEach((k) => IDS.add(k));
  Object.keys(d.words || {}).forEach((k) => IDS.add(k));
});
const files = [];
const list = (d) => readdirSync(d).forEach((f) => {
  const p = join(d, f);
  if (statSync(p).isDirectory()) list(p);
  else if (p.endsWith(".js")) files.push(p);
});
list(join(ROOT, "js/clinic"));

// string and template literals outside comments
function literals(src) {
  const out = [];
  let i = 0;
  let line = 1;
  while (i < src.length) {
    const c = src[i];
    if (c === "\n") line++;
    if (c === "/" && src[i + 1] === "/") {
      while (i < src.length && src[i] !== "\n") i++;
      continue;
    }
    if (c === "/" && src[i + 1] === "*") {
      const e = src.indexOf("*/", i + 2);
      line += (src.slice(i, e).match(/\n/g) || []).length;
      i = e + 2;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      let j = i + 1;
      let s = "";
      while (j < src.length && src[j] !== c) {
        if (src[j] === "\\") {
          s += src[j + 1];
          j += 2;
          continue;
        }
        if (c === "`" && src[j] === "$" && src[j + 1] === "{") {
          let depth = 1;
          const k0 = j + 2;
          j += 2;
          while (j < src.length && depth) {
            if (src[j] === "{") depth++;
            else if (src[j] === "}") depth--;
            j++;
          }
          // the strings inside ${...} are literals too
          literals(src.slice(k0, j - 1)).forEach((x) => out.push({ s: x.s, line: line + x.line - 1 }));
          s += " ";
          continue;
        }
        if (src[j] === "\n") line++;
        s += src[j];
        j++;
      }
      out.push({ s, line });
      i = j + 1;
      continue;
    }
    i++;
  }
  return out;
}

const hits = [];
for (const f of files) {
  const src = readFileSync(f, "utf8");
  for (const { s, line } of literals(src)) {
    const low = s.toLowerCase();
    if (IDS.has(s)) continue;
    // selectors, paths, ids and class names are code, not words for the child
    if (/^[\w.#:[\]="' >*-]*$/.test(s) && /[-_.#/]/.test(s)) continue;
    const toks = low.replace(/\[[^\]]*\]/g, " ").split(/[^a-z']+/).filter(Boolean);
    const found = toks.filter((t) => words.has(t) && (!ENGLISH.has(t) || (KEEP_SHORT.has(t) && low.trim() === t)));
    if (found.length) hits.push(`${f.slice(ROOT.length + 1)}:${line}: ${JSON.stringify(s.slice(0, 80))} (${[...new Set(found)].join(", ")})`);
  }
}
if (process.argv.includes("--list")) console.log([...words].sort().join(" "));
if (hits.length) {
  console.log(`Kutchi in the clinic's code (${hits.length}):\n${hits.join("\n")}`);
  process.exit(1);
}
console.log(`OK: no Kutchi in js/clinic (${files.length} files, ${words.size} words checked)`);

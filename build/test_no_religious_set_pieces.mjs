// LNG-22 (probes-open, run 16; Zafar, 31 Oct: celebrations out, no religious set pieces; "the Eid lines become the birthday"):
// neither the first launch's hook (data/story/first-launch.json) nor Cook's day-6 finale (data/cook.json, js/cook/flow.js) plays an
// Eid scene or line. Comments for grown-ups are not looked at; only the data the game plays.  node build/test_no_religious_set_pieces.mjs
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const EID = /\beid\b/i;
const bad = [];
// every string value (and key) in the first launch's story data
const walk = (v, path) => {
  if (typeof v === "string") { if (EID.test(v)) bad.push(`${path}: ${v.slice(0, 60)}`); return; }
  if (Array.isArray(v)) return v.forEach((x, i) => walk(x, `${path}[${i}]`));
  if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) { if (EID.test(k)) bad.push(`${path}.${k} (key)`); walk(x, `${path}.${k}`); }
};
walk(JSON.parse(readFileSync(join(ROOT, "data/story/first-launch.json"), "utf8")), "first-launch");
// Cook's finale: no 'Eid Mubarak' line in Cook's data
const cook = readFileSync(join(ROOT, "data/cook.json"), "utf8");
if (/eid mubarak/i.test(cook)) bad.push("data/cook.json: an 'Eid Mubarak' line");
if (bad.length) { console.error(`FAIL: ${bad.length} Eid set pieces the game plays:\n  ${bad.slice(0, 12).join("\n  ")}`); process.exit(1); }
console.log("ok: no Eid scene or line in the first launch or Cook's finale");

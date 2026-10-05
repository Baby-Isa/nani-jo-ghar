#!/usr/bin/env node
// Touched-flow mapper (decision 34): from a git diff, list the sandbox flows to run, including flows reached through shared files,
// and print the exact --touched command. Reach comes from what each page really loads (its <link> and <script> lists) plus a small
// rule table for files pages load by fetch (data/, js/core). Anything it cannot place is reported and widens the list (safe side).
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { args, help, ROOT, die, more } from "./lib/common.mjs";

const HELP = `
node build/tools/review/touched.mjs [--base <ref>] [--files a,b,c] [--all-flows] [--json]
  Lists the sandbox flows to run for what changed in git diff <base>..HEAD (default base: the merge-base with origin/main, else HEAD~1),
  plus uncommitted changes. --files names files instead of reading git (also handy to ask "what would this reach?").
  Prints: the changed files by area, each flow base id with the file that reaches it, and the ready-to-paste command:
    COOK_TEST_PORT=8815 flock -w 1800 /tmp/njg-browser.lock timeout 1200 node build/sandbox/run.mjs --touched <ids> --parallel 3 --budget-min 13 --check
  A base id stands for all its levels and paths (cook:chai-tray = @L2, @L3, #mistake ...). --json prints {files, flows, command}.
  Not runtime (docs, build tools, reports): ignored. A runtime file it cannot place: reported as "unplaced" and every flow is listed.`;
const a = args(); help(HELP, a);

// ---------- the changed files ----------
function git(...x) { try { return execFileSync("git", x, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch (e) { return null; } }
let files;
if (a.val("files")) files = a.val("files").split(",").map((s) => s.trim()).filter(Boolean);
else {
  const base = a.val("base") || git("merge-base", "HEAD", "origin/main") || "HEAD~1";
  const set = new Set([...(git("diff", "--name-only", `${base}..HEAD`) || "").split("\n"), ...(git("diff", "--name-only", "HEAD") || "").split("\n"), ...(git("ls-files", "--others", "--exclude-standard") || "").split("\n")].filter(Boolean));
  files = [...set];
}

// ---------- the flows ----------
const { allFlows } = await import("../../sandbox/flows/index.mjs");
const flows = allFlows();
const baseId = (id) => id.replace(/[@#].*$/, "");
const ids = [...new Set(flows.map((f) => baseId(f.id)))];
const PAGES_ALL = ["index.html", "first.html", "cook.html", "clinic.html", "tidy.html", "who.html", "dress.html", "monsoon.html", "snap.html", "find.html"];
// which page(s) each flow loads
function pagesOf(id) {
  if (id === "house") return ["index.html"];
  if (id === "first") return ["index.html", "first.html", "cook.html"];
  if (id.startsWith("cook:")) return ["cook.html"];
  if (id.startsWith("clinic:heal-extra")) return ["lab/clinic-heal-host.html"];
  if (id.startsWith("clinic:")) return ["clinic.html"];
  if (id.startsWith("mode:")) return [id.slice(5) + ".html"];
  if (id === "rotate-card") return PAGES_ALL;
  return [];
}
// what a page loads: its stylesheets and scripts
const loads = new Map();
const strip = (u) => u.replace(/\?.*$/, "");
function pageLoads(p) {
  if (loads.has(p)) return loads.get(p);
  const set = new Set();
  const fp = join(ROOT, p);
  if (existsSync(fp)) for (const m of readFileSync(fp, "utf8").matchAll(/(?:src|href)="([^"]+\.(?:js|css|json))(?:\?[^"]*)?"/g)) if (!/^https?:/.test(m[1])) set.add(strip(m[1]));
  loads.set(p, set);
  return set;
}

// ---------- the reach of one file ----------
// returns {flows:Set, why:string} or null (unplaced) or "ignore"
const cookIds = ids.filter((i) => i.startsWith("cook:")), clinicIds = ids.filter((i) => i.startsWith("clinic:"));
const stationNames = (n) => cookIds.filter((i) => i === `cook:${n}` || i === `cook:recipe:${n}`);
function reach(f) {
  const out = new Set();
  const take = (xs) => xs.forEach((x) => out.add(x));
  if (/^(docs|sources|content|assets\/audio|README|CLAUDE)/.test(f) || /\.(md|docx|txt)$/.test(f)) return "ignore";
  if (f.startsWith("build/") && !f.startsWith("build/sandbox/") && !f.startsWith("build/lint/")) return "ignore";
  if (f.startsWith("build/lint/") || f.startsWith("build/sandbox/")) { if (/\.test\.mjs$|baseline\.json|ignore\.json|fixtures/.test(f)) return "ignore"; take(ids); return out; } // the judge itself changed: everything
  if (f === "js/version.js") return "ignore"; // the cache stamp only
  // stage 2 (first, because it is the narrow one): per-station / per-game files reach only their own flows even though the page loads them all
  let m, narrow = false;
  if ((m = /^js\/cook\/(?:stations|mechanics)\/([\w-]+)\.js$/.exec(f))) { const n = m[1]; const hit = [...stationNames(n), ...cookIds.filter((i) => i.includes(n))]; if (hit.length) { take(hit); narrow = true; } else take(cookIds); }
  else if ((m = /^data\/stations\/([\w-]+)\.json$/.exec(f))) { const hit = [...stationNames(m[1]), ...cookIds.filter((i) => i.includes(m[1]))]; take(hit.length ? hit : cookIds); narrow = !!hit.length; }
  else if (/^(js\/cook\/|css\/cook|data\/cook|data\/scenes\/(kitchen|cook|worktop|bazaar)|cook\.html|data\/economy|data\/hand-|assets\/cook)/.test(f)) { take(cookIds); out.add("first"); }
  else if ((m = /^js\/clinic\/heal\/games\/([\w-]+)\.js$/.exec(f))) { const hit = clinicIds.filter((i) => i.startsWith(`clinic:heal-${m[1]}`)); take(hit.length ? hit : clinicIds.filter((i) => i.includes("heal"))); take(clinicIds.filter((i) => i === "clinic:patient" || i === "clinic:morning")); narrow = true; }
  else if ((m = /^js\/clinic\/stages\/([\w-]+)\.js$/.exec(f)) && m[1] !== "common") { take(clinicIds.filter((i) => i === `clinic:${m[1]}` || i === "clinic:patient" || i === "clinic:morning")); narrow = true; }
  else if (/^(js\/clinic\/|css\/clinic|data\/clinic|data\/patients|data\/scenes\/clinic|clinic\.html|assets\/clinic|lab\/clinic)/.test(f)) take(clinicIds);
  else if (/^(js\/core\/|data\/lang\/|data\/family-audio|data\/audio-manifest|data\/content\.json|data\/progress|data\/unlocks|data\/layout|data\/shared\/|js\/progress)/.test(f)) { take(ids.filter((i) => !i.startsWith("mode:") && i !== "css")); } // the core and the language: every live page (parked modes are not on the core)
  else if (/^css\/(?!cook|clinic|shared\/)/.test(f) || /^js\/(home|first)\.js$/.test(f) || /^(index|first)\.html$/.test(f)) { /* page-specific: stage 1 places it */ }
  else if (/^js\/(dress|find|monsoon|snap|tidy|who)\/|^css\/(dress|find|monsoon|snap|tidy|who)\.css|^data\/(dress|find|monsoon|snap|tidy|who)\.json/.test(f)) { const mode = /^(?:js\/|css\/|data\/)(\w+)/.exec(f)[1]; take(ids.filter((i) => i === `mode:${mode}`)); }
  else if (/^(js\/demo|js\/vendor|assets\/)/.test(f) && !out.size) return null;
  // stage 1: every page that loads the file (shared css/js, page css, mode code)
  if (!narrow) for (const id of ids.filter((i) => i !== "rotate-card")) for (const pg of pagesOf(id)) if (pageLoads(pg).has(f) || pg === f) out.add(id);
  if (/^css\//.test(f)) out.add("css"); // the static spacing lint reads every stylesheet
  if (/^(js\/shared\/(frame|app)|css\/shared\/(frame|app|tokens))/.test(f)) out.add("rotate-card");
  return out.size ? out : null;
}

const area = (f) => (/^(js|css|data|assets)\/shared|^css\/shared|^js\/shared/.test(f) ? "shared" : /^js\/core|^data\/lang/.test(f) ? "core/lang" : f.split("/")[0]);
const placed = new Map(), unplaced = [], ignored = [];
for (const f of files) {
  const r = reach(f);
  if (r === "ignore") ignored.push(f); else if (!r) unplaced.push(f); else for (const id of r) { if (!placed.has(id)) placed.set(id, []); placed.get(id).push(f); }
}
let chosen = [...placed.keys()].filter((i) => ids.includes(i));
if (unplaced.length) chosen = ids;
if (a.has("all-flows")) chosen = ids;
const order = new Map(ids.map((x, i) => [x, i]));
chosen.sort((x, y) => order.get(x) - order.get(y));
const cmd = chosen.length ? `COOK_TEST_PORT=8815 flock -w 1800 /tmp/njg-browser.lock timeout 1200 node build/sandbox/run.mjs --touched ${chosen.join(",")} --parallel 3 --budget-min 13 --check` : "";
const pagesN = flows.filter((f) => chosen.includes(baseId(f.id))).reduce((s, f) => s + (f.static ? 1 : (f.sizes || ["x", "x", "x", "x", "x", "x", "x", "x"]).length), 0);

if (a.has("json")) { console.log(JSON.stringify({ files, flows: chosen, sharedTouched: files.some((f) => /^(js|css|data)\/(shared|core|lang)|^css\/shared|^js\/shared/.test(f)), unplaced, command: cmd, pages: pagesN }, null, 1)); process.exit(0); }
const byArea = {};
for (const f of files) if (!ignored.includes(f)) byArea[area(f)] = (byArea[area(f)] || 0) + 1;
console.log(`touched: ${files.length} changed files (${Object.entries(byArea).map(([k, v]) => `${k} ${v}`).join(", ") || "none that run"}${ignored.length ? `; ${ignored.length} not runtime, ignored` : ""})`);
if (unplaced.length) { console.log(`UNPLACED (${unplaced.length}) so every flow is listed:`); more(unplaced, 8, (f) => `  ${f}`); }
if (!chosen.length) { console.log("No flow is reached by these changes. Nothing to run."); process.exit(0); }
console.log(`flows to run: ${chosen.length} (${pagesN} pages, every level and path; about ${Math.ceil(pagesN * 0.23)} min of browser time at 3 pages at once)`);
more(chosen, 60, (id) => { const w = [...new Set(placed.get(id) || [])]; return `  ${id.padEnd(28)} <- ${w.slice(0, 2).join(", ")}${w.length > 2 ? ` +${w.length - 2}` : ""}`; });
console.log(`\n${cmd}`);

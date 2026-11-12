#!/usr/bin/env node
/*
 * What each kitchen game really loads (s19-artuse, the art registry's first step; Zafar, 12 Nov).
 *   node build/tools/art/artuse.mjs            join the cached page loads with the files on disk and every name of them; write
 *                                              build/reports/art-use.json and lab/art-board-data.js
 *   node build/tools/art/artuse.mjs --refresh  replay the page loads first (loadcheck's discover run, about 2 minutes, under the
 *                                              browser lock; COOK_TEST_PORT picks the port) and cache them in build/reports/art-use-loads.json
 * Three sources, each stated honestly in art-use.json:
 *   loads   what a page asked for, from the load check, each page opened to its first step at level 1 (NOT played to its end);
 *           pages that did not open are listed. 
 *   names   every picture a file names, by full path, by glob (a manifest's pattern), or by stem ("v4/sekelo/bowl-meat" under
 *           assets/cook/items/); in js/, data/, css/, lab/ and the root pages. Strings built in code (${...}) are not resolved
 *   disk    every picture under assets/ (git ls-files)
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync, execFileSync } from "node:child_process";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const LOADS = join(ROOT, "build/reports/art-use-loads.json");
const OUT = join(ROOT, "build/reports/art-use.json");
const BOARD_DATA = join(ROOT, "lab/art-board-data.js");
const IMG = /\.(webp|png|jpe?g|svg|gif)$/i;
const PAGE_ID = /^cook(:.+)?$/;

/* ---------- globs ---------- */
export const globRe = (g) => new RegExp("^" + g.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "\u0000").replace(/\*/g, "[^/]*").replace(/\u0000/g, ".*") + "$");

/* ---------- disk ---------- */
export function pictures(root = ROOT) {
  let list;
  try { list = execFileSync("git", ["ls-files", "assets"], { cwd: root, encoding: "utf8", maxBuffer: 1 << 26 }).split("\n"); } catch { list = []; }
  list = list.filter((p) => IMG.test(p) && existsSync(join(root, p)));
  if (!list.length) { const w = (d) => readdirSync(join(root, d)).flatMap((f) => { const p = `${d}/${f}`; return statSync(join(root, p)).isDirectory() ? w(p) : [p]; }); if (existsSync(join(root, "assets"))) list = w("assets").filter((p) => IMG.test(p)); }
  return list.sort();
}
// the folder's version: v4 = Sprint 19; vN; -sNN = the sprint that made it; else unversioned
export function versionOf(p) {
  const v = p.match(/\/v(\d+)(?:\/|-)/);
  if (v) return `v${v[1]}`;
  const s = p.match(/-s(\d{2})[a-z]?(?:\/|[-.@])/) || p.match(/\/[\w-]*-s(\d{2})[a-z]?\//);
  if (s) return `s${s[1]}`;
  return "unversioned";
}
export const isNew = (p) => versionOf(p) === "v4";

/* ---------- names ---------- */
const SCAN_DIRS = ["js", "data", "css", "lab"];
const SKIP = /(^|\/)(vendor|node_modules)\/|^data\/art\/|candidates|audio-manifest|asset-list|^lab\/art-board|family-audio|\.map$/;
const walkText = (root, dir, out = []) => {
  if (!existsSync(join(root, dir))) return out;
  for (const f of readdirSync(join(root, dir))) {
    const p = `${dir}/${f}`;
    if (SKIP.test(p)) continue;
    if (statSync(join(root, p)).isDirectory()) walkText(root, p, out);
    else if (/\.(js|mjs|json|css|html)$/.test(f)) out.push(p);
  }
  return out;
};
export function textFiles(root = ROOT) {
  const top = readdirSync(root).filter((f) => /\.html$/.test(f));
  return [...top, ...SCAN_DIRS.flatMap((d) => walkText(root, d))].filter((p) => !SKIP.test(p));
}
// returns {byPicture: {path: [{file, how}]}, dynamic: n, files: n}
export function scanNames(pics, root = ROOT, files = textFiles(root)) {
  const picSet = new Set(pics);
  const ROOTS = ["assets/cook/items/", "assets/cook/bg/", "assets/cook/props/", "assets/cook/", "assets/"];
  const stems = new Map(); // "v4/sekelo/bowl-meat" -> [paths]
  for (const p of pics) for (const r of ROOTS) if (p.startsWith(r)) { const s = p.slice(r.length).replace(/\.[a-z0-9]+$/i, ""); (stems.get(s) || stems.set(s, []).get(s)).push(p); }
  const byPicture = {};
  let dynamic = 0;
  const add = (p, file, how) => { const a = (byPicture[p] = byPicture[p] || []); if (!a.some((x) => x.file === file && x.how === how)) a.push({ file, how }); };
  const globs = new Map(); // glob -> RegExp, shared
  for (const f of files) {
    const text = readFileSync(join(root, f), "utf8");
    // (1) assets/ paths anywhere in the text (quoted, in a url(), in a manifest)
    for (const m of text.matchAll(/assets\/[A-Za-z0-9_\-./*@]+(?:\$\{[^}]*\}[A-Za-z0-9_\-./*@]*)*/g)) {
      let t = m[0].replace(/[.]+$/, "");
      if (t.includes("${")) { dynamic++; continue; }
      if (t.includes("*")) {
        if (!globs.has(t)) globs.set(t, globRe(t));
        const re = globs.get(t);
        for (const p of pics) if (re.test(p)) add(p, f, "glob");
      } else if (picSet.has(t)) add(t, f, "path");
      else if (t.endsWith("/")) { /* a folder named: the files in it are not named one by one */ }
    }
    // (2) stems: a quoted string that is a picture's path under a known root, without its extension
    for (const m of text.matchAll(/["'`]([A-Za-z0-9_\-./@]{3,120})["'`]/g)) {
      const s = m[1];
      if (s.startsWith("assets/")) continue;
      const hit = stems.get(s);
      if (hit && (s.includes("/") || /-t$|-s\d\d/.test(s))) for (const p of hit) add(p, f, "stem");
    }
  }
  return { byPicture, dynamic, files: files.length };
}

/* ---------- the retired list ---------- */
export const loadRetired = (root = ROOT) => {
  const p = join(root, "data/art/retired.json");
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")).retired.map((r) => Object.assign({ re: globRe(r.glob) }, r)) : [];
};
export const retiredOf = (retired, p) => retired.find((r) => r.re.test(p)) || null;

/* ---------- the page loads (cached) ---------- */
const gameOf = (id) => (id === "cook" ? "(title)" : id.replace(/^cook:/, ""));
// (the chaat flow is the chop station then the assemble station: loadcheck has no page of its own for it)
const FLOWS = { "chai-tray": "chai", eggs: "eggs", baking: "baking", corn: "corn", chop: "chop", assemble: "chaat", fetch: "pantry", daar: "daar", samosa: "samosa", "maani-line": "maani", "mishkaki-grill": "sekelo" };
function runDiscover() {
  const json = join(ROOT, "build/reports/.art-use-discover.tmp.json");
  const ids = ["cook", "fetch", "chai-tray", "maani-line", "mishkaki-grill", "daar", "chop", "tadka", "stir", "assemble", "samosa", "baking", "eggs", "corn"].map((k) => (k === "cook" ? k : `cook:${k}`));
  const env = Object.assign({}, process.env, { COOK_TEST_PORT: process.env.COOK_TEST_PORT || "8913" });
  const lock = process.env.NJG_LOCK || `/tmp/njg-browser-${env.COOK_TEST_PORT}.lock`;
  const r = spawnSync("flock", ["-w", "3600", lock, "timeout", "1500", "node", join(ROOT, "build/tools/review/loadcheck.mjs"), "--discover", "--parallel", "2", "--only", ids.join(","), "--json", json], { cwd: ROOT, encoding: "utf8", env, maxBuffer: 1 << 26 });
  const out = r.stdout || "";
  const raw = existsSync(json) ? JSON.parse(readFileSync(json, "utf8")) : {};
  try { unlinkSync(json); } catch {}
  const pages = {};
  for (const id of ids) {
    const line = out.split("\n").find((l) => l.replace(/^(ok  |FAIL) /, "").startsWith(id + " ") && /^(ok  |FAIL) /.test(l)) || "";
    const failed = /did not load/.test(line) || !raw[id];
    pages[id] = { reached: failed ? "no" : id === "cook" ? "title" : "first-step", note: failed ? (line.split("did not load: ")[1] || "not in the run").trim() : "", pictures: (raw[id] || {}).pictures || [] };
  }
  return { generated: new Date().toISOString().slice(0, 10), source: "loadcheck --discover (cook title + each station lab, level 1, speed 3)", pages };
}

/* ---------- the join ---------- */
export function build({ pics, loads, names, retired }) {
  const loadedBy = {};
  for (const [id, pg] of Object.entries(loads.pages)) for (const p of pg.pictures) (loadedBy[p] = loadedBy[p] || []).push(id);
  const out = {};
  const all = new Set([...pics, ...Object.keys(loadedBy)]);
  for (const p of [...all].sort()) {
    const ret = retiredOf(retired, p);
    const lb = loadedBy[p] || [];
    const nm = names.byPicture[p] || [];
    const version = versionOf(p);
    let status;
    if (lb.length) status = ret ? "red" : isNew(p) ? "green" : "amber";
    else status = "grey";
    out[p] = { version, status, loadedBy: lb.map(gameOf).sort(), namedIn: [...new Set(nm.map((n) => n.file))].sort(), namedHow: [...new Set(nm.map((n) => n.how))].sort(), retired: ret ? { glob: ret.glob, replacedBy: ret.replacedBy, row: ret.row } : null, onDisk: pics.includes ? undefined : undefined };
    delete out[p].onDisk;
  }
  return out;
}
export function countsByGame(per, loads) {
  const g = {};
  for (const [id, pg] of Object.entries(loads.pages)) g[gameOf(id)] = { label: FLOWS[gameOf(id)] || null, reached: pg.reached, green: 0, amber: 0, red: 0, total: 0 };
  for (const e of Object.values(per)) for (const game of e.loadedBy) { const c = g[game]; if (!c) continue; c[e.status]++; c.total++; }
  return g;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const argv = process.argv.slice(2);
  if (argv.includes("--refresh") || !existsSync(LOADS)) { const l = runDiscover(); writeFileSync(LOADS, JSON.stringify(l, null, 1) + "\n"); console.log(`page loads replayed: ${Object.values(l.pages).filter((p) => p.reached !== "no").length}/${Object.keys(l.pages).length} pages opened`); }
  const loads = JSON.parse(readFileSync(LOADS, "utf8"));
  const pics = pictures();
  const names = scanNames(pics);
  const retired = loadRetired();
  const per = build({ pics, loads, names, retired });
  const games = countsByGame(per, loads);
  const disk = Object.entries(per).filter(([p]) => pics.includes(p) || true);
  const grey = Object.values(per).filter((e) => e.status === "grey");
  const summary = {
    onDisk: pics.length, loadedByAPage: Object.values(per).filter((e) => e.loadedBy.length).length,
    storedLoadedByNothing: grey.length, greyButNamed: grey.filter((e) => e.namedIn.length).length, greyUnnamed: grey.filter((e) => !e.namedIn.length).length,
    retiredStillLoaded: Object.values(per).filter((e) => e.status === "red").length,
    retiredStillNamed: Object.values(per).filter((e) => e.retired && e.namedIn.length).length,
  };
  const completeness = {
    pagesRun: Object.keys(loads.pages).length,
    pagesOpened: Object.entries(loads.pages).filter(([, p]) => p.reached !== "no").map(([id]) => id),
    pagesNotOpened: Object.entries(loads.pages).filter(([, p]) => p.reached === "no").map(([id, p]) => `${id}: ${p.note}`),
    playedToTheirEnd: 0,
    howFar: "Each page was opened to its first step at level 1. None was played to its end, so pictures a later step, level or mood brings in show as grey (stored, loaded by nothing) even when the game uses them.",
    namesNotResolved: `${names.dynamic} strings built in code (\${...}) were not resolved; ${names.files} files scanned`,
  };
  writeFileSync(OUT, JSON.stringify({ generated: loads.generated, loadsFrom: loads.source, completeness, summary, games, pictures: per }, null, 1) + "\n");
  // the board's data: loaded pictures per game, and the grey ones by folder
  const boardPics = Object.entries(per).filter(([, e]) => e.loadedBy.length).map(([p, e]) => [p, e.version, e.status[0], e.loadedBy.join(","), e.retired ? e.retired.replacedBy : ""]);
  const greyByFolder = {};
  for (const [p, e] of Object.entries(per)) if (e.status === "grey") { const d = p.replace(/\/[^/]*$/, ""); const c = (greyByFolder[d] = greyByFolder[d] || { n: 0, named: 0 }); c.n++; if (e.namedIn.length) c.named++; }
  writeFileSync(BOARD_DATA, `/* written by build/tools/art/artuse.mjs: do not edit */\nwindow.ART_BOARD = ${JSON.stringify({ generated: loads.generated, completeness, summary, games, pics: boardPics, grey: greyByFolder })};\n`);
  console.log(`art-use: ${pics.length} pictures on disk, ${summary.loadedByAPage} loaded by a page, ${summary.storedLoadedByNothing} stored and loaded by nothing (${summary.greyButNamed} named somewhere), ${summary.retiredStillLoaded} retired still loaded`);
  for (const [g, c] of Object.entries(games)) console.log(`  ${g.padEnd(16)} ${c.reached.padEnd(10)} green ${c.green} amber ${c.amber} red ${c.red} (${c.total})`);
}

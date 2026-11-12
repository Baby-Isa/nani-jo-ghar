#!/usr/bin/env node
/*
 * What every page really loads, and what nothing loads (s19-artuse, extended by s19-artreg: the art registry's map and catalogue).
 *   node build/tools/art/artuse.mjs            join the cached loads with the files on disk and every name of them; write
 *                                              build/reports/art-use.json, build/reports/art-move-out.json and (with the registry)
 *                                              lab/art-board-data.js. Seconds.
 *   --refresh   first steps: loadcheck's discover run (the Cook title, each station lab and each clinic game to its first step at
 *               level 1; the mode pages opened), cached in build/reports/art-use-loads.json (about 3 minutes)
 *   --full      full plays: the sandbox plays every kitchen flow to its end at L1-L4, the serving kitchen (story day 1, free
 *               cooking, the shop), the title, the house and first launch, story mode, one clinic patient, the day's door, farm
 *               ride and book, at 1280x665, one page at a time, with a load trace (TRACE_HOOK, via NJG_INIT); cached in
 *               build/reports/art-use-plays.json (about 90 minutes). --resume continues a stopped run; --from-run <id> only reads one
 *   --static    the lab pages and the root pages opened at 1280x665 and left 2.5 s, cached in build/reports/art-use-static.json
 *   All browser runs take the lock /tmp/njg-browser-$COOK_TEST_PORT.lock (default port 8913) or $NJG_LOCK.
 * Sources, each stated honestly in art-use.json (completeness.perGame says how far each game was played):
 *   loads   what a page fetched (resource timing) or drew (the sandbox's contract hook), merged over the three caches
 *   names   every picture a file names, by full path, by glob (a manifest's pattern), by stem ("v4/sekelo/bowl-meat" under
 *           assets/cook/items/), or by a path built in code (\${...} read as a pattern: "built"); in js/, data/, css/, lab/, root pages
 *   disk    every picture under assets/ (git ls-files); sizes from git ls-tree -l (also origin/main's, for its ChatGPT folders)
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync, execFileSync } from "node:child_process";
import { tmpdir } from "node:os";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const LOADS = join(ROOT, "build/reports/art-use-loads.json");
const OUT = join(ROOT, "build/reports/art-use.json");
const PLAYS = join(ROOT, "build/reports/art-use-plays.json"); // the full plays (--full, --from-run)
const STATIC = join(ROOT, "build/reports/art-use-static.json"); // the lab and root pages (--static)
const MOVE_OUT = join(ROOT, "build/reports/art-move-out.json"); // the catalogue's other half
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
      if (t.includes("${")) {
        // a path built in code: read as a pattern (each \${...} one folder level or less), so a picture it may name is "built", never unnamed
        dynamic++;
        const g = t.replace(/\$\{[^}]*\}/g, "*").replace(/\*+/g, "*");
        if (!globs.has(g)) globs.set(g, globRe(g));
        const re = globs.get(g);
        for (const p of pics) if (re.test(p)) add(p, f, "built");
        continue;
      }
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
export const loadApproved = (root = ROOT) => {
  const p = join(root, "data/art/approved.json");
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")).approved.map((r) => Object.assign({ re: globRe(r.glob) }, r)) : [];
};
export const retiredOf = (retired, p) => retired.find((r) => r.re.test(p)) || null;

/* ---------- the page loads (cached) ---------- */
// a page or flow id -> the game it belongs to (the board's columns). The chaat flow is the chop station then the assemble station;
// tadka and stir are inside daar; a story day, free cooking and the shop are the serving kitchen's
const KITCHEN_KEYS = ["chai-tray", "eggs", "baking", "corn", "chop", "chaat", "fetch", "daar", "samosa", "maani-line", "mishkaki-grill"];
export function gameOf(id) {
  const base = String(id).replace(/[@#].*$/, "");
  if (base === "cook" || base === "cook:title") return "title";
  if (base === "cook:assemble" || base === "cook:chaat") return "chaat";
  if (base === "cook:tadka" || base === "cook:stir") return "daar";
  if (/^cook:(day\d|open-kitchen|shop)$/.test(base)) return "serve";
  if (base.startsWith("cook:") && KITCHEN_KEYS.includes(base.slice(5))) return base.slice(5);
  if (base.startsWith("cook:")) return "cook-other";
  if (base === "house" || base === "first" || base === "page:index" || base === "page:first" || base === "page:index.html" || base === "page:first.html") return "house";
  if (base.startsWith("lab:cook/story")) return "story";
  if (base.startsWith("clinic") || base === "page:clinic.html") return "clinic";
  if (base.startsWith("day:") || base === "page:day.html") return "day";
  if (base.startsWith("page:lab/") || base === "page:lab.html" || base === "page:labs.html") return "labs";
  if (/^page:(dress|find|monsoon|snap|tidy|who)(\.html)?$/.test(base)) return "parked modes";
  return base.replace(/^page:/, "");
}
export const GAME_NAMES = { "chai-tray": "Chai", eggs: "Eggs", baking: "Baking", corn: "Corn", chop: "Chop", chaat: "Chaat", fetch: "Pantry", daar: "Daar", samosa: "Samosa", "maani-line": "Maani", "mishkaki-grill": "Sekelo (grill)", title: "Cook title", serve: "Serving kitchen (story days, free cooking, shop)", house: "The house and first launch", story: "Story mode", clinic: "Clinic", day: "A day at Nani's (door, farm ride, book)", labs: "Lab pages", "parked modes": "Parked modes", "cook-other": "Cook (other)" };
const DISCOVER_IDS = ["cook", ...["fetch", "chai-tray", "maani-line", "mishkaki-grill", "daar", "chop", "tadka", "stir", "assemble", "samosa", "baking", "eggs", "corn"].map((k) => `cook:${k}`), "clinic:morning", ...["cut", "knee", "ear", "tooth", "taste", "fever", "boing", "eye", "foot"].map((g) => `clinic:${g}`), ...["first", "index", "dress", "find", "monsoon", "snap", "tidy", "who"].map((m) => `page:${m}`)];
function runDiscover() {
  const json = join(ROOT, "build/reports/.art-use-discover.tmp.json");
  const ids = DISCOVER_IDS;
  const env = Object.assign({}, process.env, { COOK_TEST_PORT: process.env.COOK_TEST_PORT || "8913" });
  const lock = process.env.NJG_LOCK || `/tmp/njg-browser-${env.COOK_TEST_PORT}.lock`;
  const r = spawnSync("flock", ["-w", "3600", lock, "timeout", "1500", "node", join(ROOT, "build/tools/review/loadcheck.mjs"), "--discover", "--parallel", "1", "--only", ids.join(","), "--json", json], { cwd: ROOT, encoding: "utf8", env, maxBuffer: 1 << 26 });
  const out = r.stdout || "";
  const raw = existsSync(json) ? JSON.parse(readFileSync(json, "utf8")) : {};
  try { unlinkSync(json); } catch {}
  const pages = {};
  for (const id of ids) {
    const line = out.split("\n").find((l) => l.replace(/^(ok  |FAIL) /, "").startsWith(id + " ") && /^(ok  |FAIL) /.test(l)) || "";
    const failed = /did not load/.test(line) || !raw[id];
    pages[id] = { reached: failed ? "no" : id === "cook" ? "title" : id.startsWith("page:") ? "opened" : "first-step", note: failed ? (line.split("did not load: ")[1] || "not in the run").trim() : "", pictures: (raw[id] || {}).pictures || [] };
  }
  return { generated: new Date().toISOString().slice(0, 10), source: "loadcheck --discover (the Cook title, each station lab and each clinic game to its first step at level 1; the mode pages opened)", pages };
}
// the three caches merged: {pages: {id: {game, how, reached, pictures}}}; how = "first step" | "to its end" | "stopped" | "opened"
export function allLoads(root = ROOT) {
  const rd = (f) => (existsSync(join(root, f)) ? JSON.parse(readFileSync(join(root, f), "utf8")) : null);
  const first = rd("build/reports/art-use-loads.json"), plays = rd("build/reports/art-use-plays.json"), stat = rd("build/reports/art-use-static.json");
  const pages = {};
  if (first) for (const [id, pg] of Object.entries(first.pages)) pages[`first:${id}`] = { id, game: gameOf(id), how: pg.reached === "no" ? "not opened" : pg.reached === "opened" ? "opened" : "first step", note: pg.note || "", pictures: pg.pictures || [] };
  if (plays) for (const [id, f] of Object.entries(plays.flows)) pages[`play:${id}`] = { id, game: gameOf(id), how: f.complete ? "to its end" : "stopped", note: f.complete ? "" : (f.stops || []).join("; "), pictures: f.loaded || [], drawn: f.drawn || [] };
  if (stat) for (const [id, pg] of Object.entries(stat.pages)) pages[`page:${id.replace(/^page:/, "")}`] = { id, game: gameOf(id), how: pg.reached === "no" ? "not opened" : "opened", note: pg.note || "", pictures: pg.pictures || [] };
  return { generated: [first, plays, stat].filter(Boolean).map((x) => x.generated).sort().pop() || null, sources: [first && first.source, plays && plays.source, stat && stat.source].filter(Boolean), pages };
}

/* ---------- the full plays (s19-artreg): every kitchen flow to its end, L1-L4, and the other modes, under a load trace ---------- */
// The sandbox plays each flow (build/sandbox/run.mjs, its own players) with one more init script (NJG_INIT): every picture the page
// fetches (the browser's resource timing) is logged into the page's timeline as {type:"c", k:"artload", src}. The sandbox's own
// contract hook already logs every picture drawn ({k:"art"}). Both are read back from the run's data files.
const KITCHEN = ["chai-tray", "eggs", "baking", "corn", "chop", "chaat", "fetch", "daar", "samosa", "maani-line", "mishkaki-grill"];
export const FULL_FLOWS = [
  ...KITCHEN.flatMap((k) => [`cook:${k}`, `cook:${k}@L2`, `cook:${k}@L3`, `cook:${k}@L4`]),
  "cook:title", "cook:day1", "cook:open-kitchen", "cook:shop", // the title, a story day's orders served in the serving kitchen, free cooking, the shop
  "house", "first", "lab:cook/story-birthday", // the house and the first launch; the story mode
  "clinic:patient", "day:door", "day:window", "day:book", // the clinic (one patient, end to end), a day at Nani's (the door, the farm ride, the evening book)
];
const FULL_SIZE = "1280x665";
export const TRACE_HOOK = `(() => {
  if (window.__njgArtUse) return; window.__njgArtUse = true;
  const q = [], seen = new Set(), IMG = /\\.(webp|png|jpe?g|svg|gif)$/i;
  try { performance.setResourceTimingBufferSize(100000); } catch (e) {}
  const take = (name) => { try { const u = new URL(name, location.href); if (u.origin !== location.origin) return; const p = decodeURIComponent(u.pathname.replace(/^\\//, "")); if (!IMG.test(p) || seen.has(p)) return; seen.add(p); q.push({ type: "c", k: "artload", src: p, t: Date.now(), page: location.pathname.replace(/^\\//, "") }); } catch (e) {} };
  const flush = () => { if (window.__njgLog && q.length) q.splice(0).forEach((e) => { try { window.__njgLog(e); } catch (x) {} }); };
  try { new PerformanceObserver((l) => l.getEntries().forEach((e) => take(e.name))).observe({ type: "resource", buffered: true }); } catch (e) {}
  setInterval(flush, 200); addEventListener("pagehide", flush);
})();`;
// a run's data files -> {flow: {complete, stops, loaded: [...], drawn: [...]}}
export function harvest(dataDir) {
  const out = {};
  for (const f of readdirSync(dataDir).filter((x) => x.endsWith(".json")).sort()) {
    let r;
    try { r = JSON.parse(readFileSync(join(dataDir, f), "utf8")); } catch { continue; }
    if (!r || !r.flow) continue;
    const loaded = new Set(), drawn = new Set();
    for (const e of r.timeline || []) {
      if (!e || e.type !== "c" || (e.k !== "art" && e.k !== "artload")) continue;
      const p = String(e.src || "").split("?")[0].replace(/^\//, "");
      if (!p.startsWith("assets/") || !IMG.test(p)) continue;
      (e.k === "art" ? drawn : loaded).add(p);
    }
    for (const p of drawn) loaded.add(p); // a picture drawn was loaded (a blob or a cached copy may not show in the timing)
    out[r.flow] = { size: r.size, complete: !!r.complete, stops: (r.stops || []).slice(0, 2), seconds: Math.round((r.ms || 0) / 1000), loaded: [...loaded].sort(), drawn: [...drawn].sort() };
  }
  return out;
}
function runFull({ resume = false, runId = "artuse-full" } = {}) {
  const hook = join(tmpdir(), `njg-artuse-hook-${process.pid}.js`);
  writeFileSync(hook, TRACE_HOOK);
  const env = Object.assign({}, process.env, { COOK_TEST_PORT: process.env.COOK_TEST_PORT || "8913", NJG_INIT: hook, NJG_NO_LIGHTSHOT: "1" });
  const lock = process.env.NJG_LOCK || `/tmp/njg-browser-${env.COOK_TEST_PORT}.lock`;
  const flows = (process.env.ARTUSE_FLOWS || FULL_FLOWS.join(",")).split(",");
  const r = spawnSync("flock", ["-w", "3600", lock, "timeout", "7000", "node", join(ROOT, "build/sandbox/run.mjs"), "--flow", flows.join(","), "--sizes", FULL_SIZE, "--parallel", "1", "--no-sheets", "--run-id", runId, ...(resume ? ["--resume", runId] : [])], { cwd: ROOT, encoding: "utf8", env, stdio: "inherit" });
  try { unlinkSync(hook); } catch {}
  return r.status;
}
// the lab pages and the root pages: opened, waited on, every picture they fetch (no play: a page, not a game)
async function runStatic() {
  const { pw } = await import(join(ROOT, "build/sandbox/lib/env.mjs"));
  const { createServer } = await import("node:http");
  const port = +(process.env.COOK_TEST_PORT || 8913);
  const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".gif": "image/gif", ".mp3": "audio/mpeg", ".m4a": "audio/mp4", ".woff2": "font/woff2" };
  const srv = createServer((req, res) => {
    let f = join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname));
    if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
    if (!existsSync(f)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "content-type": MIME[(f.match(/\.[a-z0-9]+$/i) || [""])[0].toLowerCase()] || "application/octet-stream" });
    res.end(readFileSync(f));
  });
  await new Promise((ok, no) => { srv.once("error", no); srv.listen(port, "127.0.0.1", ok); });
  const exe = existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined;
  const browser = await pw.chromium.launch({ executablePath: exe, args: ["--no-sandbox", "--disable-webgl", "--autoplay-policy=no-user-gesture-required"] });
  const list = [...readdirSync(join(ROOT, "lab")).filter((f) => f.endsWith(".html") && f !== "art-board.html").map((f) => `lab/${f}`), ...readdirSync(ROOT).filter((f) => f.endsWith(".html"))].sort();
  const pages = {};
  for (const url of list) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 665 }, serviceWorkers: "block" });
    await ctx.route(/^https?:\/\//, (route) => (route.request().url().startsWith(`http://127.0.0.1:${port}`) ? route.fallback() : route.abort()));
    const page = await ctx.newPage();
    const pics = new Set();
    page.on("request", (q) => { try { const u = new URL(q.url()); if (u.port == port) { const p = decodeURIComponent(u.pathname.slice(1)); if (p.startsWith("assets/") && IMG.test(p)) pics.add(p); } } catch {} });
    let note = "";
    try { await page.goto(`http://127.0.0.1:${port}/${url}?quiet=1&seed=1`, { waitUntil: "load", timeout: 30000 }); await new Promise((r) => setTimeout(r, 2500)); } catch (e) { note = String(e.message || e).split("\n")[0].slice(0, 160); }
    pages[`page:${url}`] = { reached: note ? "no" : "opened", note, pictures: [...pics].sort() };
    await ctx.close();
  }
  await browser.close();
  srv.close();
  return { generated: new Date().toISOString().slice(0, 10), source: "each lab page and root page opened at 1280x665 and left 2.5 s (no play)", pages };
}

/* ---------- the join ---------- */
export function build({ pics, loads, names, retired, approved = [] }) {
  const loadedBy = {};
  for (const [key, pg] of Object.entries(loads.pages)) for (const p of pg.pictures) (loadedBy[p] = loadedBy[p] || new Set()).add(key);
  const out = {};
  const all = new Set([...pics, ...Object.keys(loadedBy)]);
  for (const p of [...all].sort()) {
    const ret = retiredOf(retired, p);
    const lb = [...(loadedBy[p] || [])];
    const nm = names.byPicture[p] || [];
    const version = versionOf(p);
    let status;
    if (lb.length) status = ret ? "red" : isNew(p) ? "green" : approved.some((a) => a.re.test(p)) ? "approved" : "amber";
    else status = "grey";
    const games = [...new Set(lb.map((k) => loads.pages[k].game || gameOf(loads.pages[k].id || k)))].sort();
    out[p] = { version, status, games, loadedBy: [...new Set(lb.map((k) => loads.pages[k].id || k))].sort(), namedIn: [...new Set(nm.map((n) => n.file))].sort(), namedHow: [...new Set(nm.map((n) => n.how))].sort(), retired: ret ? { glob: ret.glob, replacedBy: ret.replacedBy, row: ret.row } : null };
    if (!pics.includes(p)) out[p].missing = true; // asked for, not on disk
  }
  return out;
}
export function countsByGame(per, loads) {
  const g = {};
  for (const pg of Object.values(loads.pages)) {
    const k = pg.game || gameOf(pg.id);
    const c = (g[k] = g[k] || { pages: 0, toTheEnd: 0, stopped: [], firstStep: 0, opened: 0, notOpened: [], green: 0, approved: 0, amber: 0, red: 0, total: 0 });
    c.pages++;
    if (pg.how === "to its end") c.toTheEnd++; else if (pg.how === "stopped") c.stopped.push(`${pg.id}: ${pg.note}`.slice(0, 200)); else if (pg.how === "first step") c.firstStep++; else if (pg.how === "opened") c.opened++; else c.notOpened.push(`${pg.id}: ${pg.note}`.slice(0, 200));
  }
  for (const e of Object.values(per)) for (const game of e.games || []) { const c = g[game]; if (!c) continue; c[e.status]++; c.total++; }
  return g;
}
// how complete a game's map is, in a line a person can read
export function howComplete(c) {
  const parts = [];
  if (c.toTheEnd) parts.push(`${c.toTheEnd} play${c.toTheEnd > 1 ? "s" : ""} to the end`);
  if (c.stopped.length) parts.push(`${c.stopped.length} stopped before the end`);
  if (c.firstStep) parts.push(`${c.firstStep} to the first step only`);
  if (c.opened) parts.push(`${c.opened} page${c.opened > 1 ? "s" : ""} opened (no play)`);
  if (c.notOpened.length) parts.push(`${c.notOpened.length} did not open`);
  return parts.join(", ") || "not visited";
}

/* ---------- the catalogue's other half: what nothing loads and nothing names (the move-out list for Sprint 20) ---------- */
const MEDIA = /\.(webp|png|jpe?g|svg|gif|mp4|webm|mov)$/i;
export function sizes(root = ROOT, ref = "HEAD") {
  const m = new Map();
  try { for (const l of execFileSync("git", ["ls-tree", "-r", "-l", ref, "--", "assets"], { cwd: root, encoding: "utf8", maxBuffer: 1 << 28 }).split("\n")) { const t = l.indexOf("\t"); if (t < 0) continue; const meta = l.slice(0, t).split(/\s+/); m.set(l.slice(t + 1).replace(/^"|"$/g, ""), +meta[3] || 0); } } catch {}
  return m;
}
export function moveOut({ per, root = ROOT, sz = sizes(root), mainSz = null }) {
  const out = { unloadedUnnamed: [], namedNotLoaded: [], videos: [], pngTwins: [], chatgptOnMain: [] };
  const all = [...sz.keys()].filter((p) => MEDIA.test(p));
  for (const p of all) {
    const size = sz.get(p) || 0;
    if (/\.(mp4|webm|mov)$/i.test(p)) { out.videos.push({ path: p, bytes: size, named: !!(per[p] && per[p].namedIn.length) }); continue; }
    const e = per[p];
    if (!e || e.games.length) continue;
    const row = { path: p, bytes: size, why: e.retired ? `retired (${e.retired.row})` : "" };
    if (/\.png$/i.test(p) && sz.has(p.replace(/\.png$/i, ".webp"))) row.twin = p.replace(/\.png$/i, ".webp");
    if (e.namedIn.length) { row.namedIn = e.namedIn.slice(0, 3); row.how = e.namedHow; out.namedNotLoaded.push(row); }
    else { out.unloadedUnnamed.push(row); if (row.twin) out.pngTwins.push(row); }
  }
  if (mainSz) {
    const dirs = new Map();
    for (const [p, b] of mainSz) { const m = p.match(/^(assets\/(?:[^/]+\/)*?[^/]*chatgpt[^/]*)\//i); if (!m) continue; const d = dirs.get(m[1]) || { path: m[1], files: 0, bytes: 0, onThisBranch: sz.has(p) }; d.files++; d.bytes += b; dirs.set(m[1], d); }
    out.chatgptOnMain = [...dirs.values()].sort((a, b) => b.bytes - a.bytes);
  }
  const sum = (l) => l.reduce((a, r) => a + r.bytes, 0);
  const byFolder = (l) => { const f = {}; for (const r of l) { const d = r.path.replace(/\/[^/]*$/, ""); const c = (f[d] = f[d] || { files: 0, bytes: 0 }); c.files++; c.bytes += r.bytes; } return Object.entries(f).map(([path, c]) => ({ path, ...c })).sort((a, b) => b.bytes - a.bytes); };
  out.totals = { unloadedUnnamed: { files: out.unloadedUnnamed.length, bytes: sum(out.unloadedUnnamed) }, namedNotLoaded: { files: out.namedNotLoaded.length, bytes: sum(out.namedNotLoaded) }, videos: { files: out.videos.length, bytes: sum(out.videos) }, pngTwins: { files: out.pngTwins.length, bytes: sum(out.pngTwins) }, chatgptOnMain: { folders: out.chatgptOnMain.length, bytes: out.chatgptOnMain.reduce((a, d) => a + d.bytes, 0) }, assets: { files: sz.size, bytes: [...sz.values()].reduce((a, b) => a + b, 0) } };
  out.foldersUnloadedUnnamed = byFolder(out.unloadedUnnamed);
  out.foldersNamedNotLoaded = byFolder(out.namedNotLoaded);
  return out;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const argv = process.argv.slice(2);
  if (argv.includes("--full")) { const code = runFull({ resume: argv.includes("--resume"), runId: process.env.ARTUSE_RUN || "artuse-full" }); console.log(`full plays: the sandbox ended with ${code}`); }
  const fromRun = argv.includes("--from-run") ? argv[argv.indexOf("--from-run") + 1] : argv.includes("--full") ? process.env.ARTUSE_RUN || "artuse-full" : null;
  if (fromRun) { const d = join(ROOT, "build/screenshots/sandbox", fromRun, "data"); const plays = harvest(d); const old = existsSync(PLAYS) ? JSON.parse(readFileSync(PLAYS, "utf8")).flows : {}; writeFileSync(PLAYS, JSON.stringify({ generated: new Date().toISOString().slice(0, 10), source: `build/sandbox/run.mjs at ${FULL_SIZE}, each flow played by the sandbox's player, every picture fetched (resource timing) or drawn (the contract hook); run ${fromRun}`, flows: Object.assign(old, plays) }, null, 1) + "\n"); console.log(`full plays harvested: ${Object.keys(plays).length} flows from ${fromRun}`); }
  if (argv.includes("--static")) { const st = await runStatic(); writeFileSync(STATIC, JSON.stringify(st, null, 1) + "\n"); console.log(`static pages: ${Object.keys(st.pages).length} opened`); }
  if (argv.includes("--refresh") || !existsSync(LOADS)) { const l = runDiscover(); writeFileSync(LOADS, JSON.stringify(l, null, 1) + "\n"); console.log(`page loads replayed: ${Object.values(l.pages).filter((p) => p.reached !== "no").length}/${Object.keys(l.pages).length} pages opened`); }
  const loads = allLoads();
  const pics = pictures();
  const names = scanNames(pics);
  const retired = loadRetired();
  const per = build({ pics, loads, names, retired, approved: loadApproved() });
  const games = countsByGame(per, loads);
  for (const c of Object.values(games)) c.howComplete = howComplete(c);
  const grey = Object.values(per).filter((e) => e.status === "grey");
  let mainSz = null;
  try { execFileSync("git", ["rev-parse", "--verify", "-q", "origin/main"], { cwd: ROOT }); mainSz = sizes(ROOT, "origin/main"); } catch {}
  const mo = moveOut({ per, mainSz });
  const summary = {
    onDisk: pics.length, loadedByAPage: Object.values(per).filter((e) => e.games.length).length, askedForMissing: Object.values(per).filter((e) => e.missing).length,
    storedLoadedByNothing: grey.length, greyButNamed: grey.filter((e) => e.namedIn.length).length, greyUnnamed: grey.filter((e) => !e.namedIn.length).length,
    retiredStillLoaded: Object.values(per).filter((e) => e.status === "red").length,
    retiredStillNamed: Object.values(per).filter((e) => e.retired && e.namedIn.length).length,
    moveOut: mo.totals,
  };
  const completeness = {
    pages: Object.keys(loads.pages).length,
    sources: loads.sources,
    perGame: Object.fromEntries(Object.entries(games).map(([g, c]) => [g, c.howComplete])),
    notReached: Object.values(games).flatMap((c) => [...c.stopped, ...c.notOpened]),
    namesNotResolved: `${names.dynamic} paths built in code (\${...}) are read as patterns (how "built"), so a picture one may name is never on the move-out list; ${names.files} files scanned`,
  };
  writeFileSync(OUT, JSON.stringify({ generated: loads.generated, completeness, summary, games, pictures: per }, null, 1) + "\n");
  writeFileSync(MOVE_OUT, JSON.stringify({ generated: loads.generated, _about: "Sprint 20's move-out list (s19-artreg): stored pictures that no page loaded in any play and no file names (unloadedUnnamed: move to sources/art-retired/<same path>), pictures some file names but no play loaded (namedNotLoaded: check first), the published videos, the PNGs with a WebP twin (a subset of unloadedUnnamed) and the ChatGPT folders on main. Bytes from git (git ls-tree -l). Nothing was moved.", ...mo }, null, 1) + "\n");
  console.log(`art-use: ${pics.length} pictures on disk, ${summary.loadedByAPage} loaded by a page (${summary.askedForMissing} asked for and missing), ${summary.storedLoadedByNothing} stored and loaded by nothing (${summary.greyButNamed} named somewhere), ${summary.retiredStillLoaded} retired still loaded`);
  const mb = (b) => (b / 1e6).toFixed(1) + " MB";
  console.log(`move-out: ${mo.totals.unloadedUnnamed.files} pictures loaded by nothing and named by nothing (${mb(mo.totals.unloadedUnnamed.bytes)}); ${mo.totals.namedNotLoaded.files} named but not loaded (${mb(mo.totals.namedNotLoaded.bytes)}); ${mo.totals.videos.files} videos (${mb(mo.totals.videos.bytes)}); ChatGPT folders on main ${mo.totals.chatgptOnMain.folders} (${mb(mo.totals.chatgptOnMain.bytes)})`);
  for (const [g, c] of Object.entries(games)) console.log(`  ${g.padEnd(16)} ${c.howComplete.padEnd(60)} ${c.total} pictures`);
  if (existsSync(join(ROOT, "data/art/registry.json"))) { const R = await import("./registry.mjs"); R.writeBoard({ root: ROOT, use: { generated: loads.generated, completeness, summary, games, pictures: per }, moveOut: mo }); console.log("lab/art-board-data.js written from the registry"); }
}

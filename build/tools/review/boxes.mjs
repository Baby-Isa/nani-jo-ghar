#!/usr/bin/env node
// The box gate (Sprint 20 P4, build/reports/s20-plan.md section 4: "stand still, read the boxes, take the pictures"). A game played by
// the fair play bot with the stand-still switch (js/cook/test-stand.js, injected by this tool only), held at six named moments (the
// order, the first light, mid-cook, the serve, well done, the end); at each, exact boxes read from the game (numbers, not pixels:
// build/sandbox/lib/boxes.mjs) and a picture kept. A run is compared with the reference box by box, exactly: any change is a
// difference, printed with how far it moved. Pixels are compared only at the order and the end, inside their cards, faces left out
// (a face circle's rim is drawn a little differently run to run; its box is compared exactly).
//
//   node build/tools/review/boxes.mjs --game chai-tray --run [--levels 1,4] [--sizes 740x320,930x430,1280x665,1920x1080]
//        [--parallel 2] [--run-id <id>] [--plant move4|card-face|cut-word|light-off]
//        plays every level at every size, writes build/screenshots/boxes/<id>/<game>/L<n>@<size>/ (boxes.json and a picture per
//        moment), then compares with the reference (build/frozen/boxes/<game>/): pass or fail, and the minutes taken. Exit 1 on a fail.
//   node build/tools/review/boxes.mjs --game chai-tray --diff [--run-id <id>] [--against <id>]
//        compares a run (default: the newest) with the reference (or with another run): every box that moved and by how much, and
//        the differences sheet <run>/diff-<game>.html (before, after, what moved). Exit 1 on any difference.
//   node build/tools/review/boxes.mjs --game chai-tray --freeze --run-id <id>
//        makes that run the reference (boxes and pictures; build/frozen/boxes/<game>/).
//   node build/tools/review/boxes.mjs --game chai-tray --prove [--sizes ...] [--levels ...]
//        the proof: three runs in a row, each compared with the first (identical, or the gate does not stand), then the four planted
//        faults, each on its own page and each caught; prints the gate's minutes. Writes <first run>/proof.json.
//   node build/tools/review/boxes.mjs --game chai-tray --rules [--levels 1,4] [--sizes ...] [--parallel 2] [--run-id <id>] [--plant <p>]
//        [--from <run id or folder>] [--only overlap,light,...]
//        Sprint 20 P5, the geometry rules (build/sandbox/lib/geometry.mjs): plays as --run (or reads a played run: --from) and judges ten
//        rules on every moment and size: pass or fail per rule, each fault with what, where and by how much, and the minutes. Writes
//        <run>/rules-<game>.json.
//   node build/tools/review/boxes.mjs --game chai-tray --prove-plants [--sizes 740x320]
//        the rules' proof: each planted fault (boxes-play.mjs PLANTS) on its own page, judged: its own rule must fail on it, with the
//        planted fault in its message. A rule that cannot fail does not count. Re-run whenever a rule changes. Any game with a spec (chai-tray, eggs, maani-line) can be read one-off this way: nothing is
//        compared with a reference or written as one. Exit 1 on a fail.
// Browser: COOK_TEST_PORT (default 8812) under NJG_LOCK (default /tmp/njg-browser-all.lock), taken here unless a caller holds it.
// A miss (a moment not reached, a page that did not end) is a fail; so is a moment whose boxes changed between its read and the
// read after its picture (the game did not stand still).
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync, cpSync, rmSync } from "node:fs";
import { join, relative } from "node:path";
import { spawnSync } from "node:child_process";
import { args, ROOT, rel } from "./lib/common.mjs";
import { decodePng } from "./lib/png.mjs";
import { PLANTS } from "../../sandbox/lib/boxes-play.mjs";
import { judge, formatRules, RULE_IDS } from "../../sandbox/lib/geometry.mjs";
import { diffPage, pixelDiff, pageKey, MOMENTS, PIXEL_MOMENTS, PIXEL_BOX, pixelRegion, pixelMasks, SIZES, LEVELS, GAMES } from "../../sandbox/lib/boxes.mjs";

const a = args();
const HELP = readFileSync(new URL(import.meta.url), "utf8").split("\n").slice(1, 33).map((l) => l.replace(/^\/\/ ?/, "")).join("\n");
if (a.has("help") || a.has("h")) { console.log(HELP); process.exit(0); }
const game = a.val("game", "chai-tray");
if (!GAMES[game]) { console.error(`No box spec for ${game} (build/sandbox/lib/boxes.mjs GAMES: ${Object.keys(GAMES).join(", ")})`); process.exit(2); }
const levels = String(a.val("levels", LEVELS.join(","))).split(",").map(Number);
const sizes = String(a.val("sizes", SIZES.join(","))).split(",");
const parallel = Math.max(1, Math.min(2, +a.val("parallel", 2)));
export const OUT = join(ROOT, "build", "screenshots", "boxes");
export const REF = join(ROOT, "build", "frozen", "boxes");
const LOCK = process.env.NJG_LOCK || "/tmp/njg-browser-all.lock";
const stamp = () => new Date().toISOString().replace(/[-:]/g, "").slice(0, 13).replace("T", "-");
const mins = (ms) => (ms / 60000).toFixed(1);

// ---------- the lock (a nested flock on the same lock would wait for itself) ----------
function underLock() {
  if (process.env.NJG_LOCKED) return true;
  let pid = process.ppid;
  for (let i = 0; i < 12 && pid > 1; i++) {
    try {
      const cmd = readFileSync(`/proc/${pid}/cmdline`, "utf8").split("\0");
      if (/(^|\/)flock$/.test(cmd[0]) && cmd.includes(LOCK)) return true;
      pid = +readFileSync(`/proc/${pid}/stat`, "utf8").split(") ")[1].split(" ")[1];
    } catch (e) { return false; }
  }
  return false;
}
const browserStep = a.has("run") || a.has("prove") || a.has("prove-plants") || (a.has("rules") && !a.has("from"));
if (browserStep && !underLock()) {
  const r = spawnSync("flock", ["-w", "3600", LOCK, process.execPath, process.argv[1], ...process.argv.slice(2)], { stdio: "inherit", cwd: ROOT, env: { ...process.env, NJG_LOCKED: "1" } });
  process.exit(r.status == null ? 1 : r.status);
}

// ---------- reading runs ----------
const pageDir = (root, level, size) => join(root, game, pageKey(level, size));
function loadPages(root) {
  const g = join(root, game);
  if (!existsSync(g)) return {};
  const out = {};
  for (const n of readdirSync(g)) { const f = join(g, n, "boxes.json"); if (existsSync(f)) out[n] = { ...JSON.parse(readFileSync(f, "utf8")), dir: join(g, n) }; }
  return out;
}
function newestRun() {
  if (!existsSync(OUT)) return null;
  const runs = readdirSync(OUT).map((n) => join(OUT, n)).filter((p) => existsSync(join(p, game))).sort((x, y) => statSync(join(y, game)).mtimeMs - statSync(join(x, game)).mtimeMs);
  return runs[0] || null;
}
const runRoot = (id) => (!id ? newestRun() : existsSync(id) ? id : join(OUT, id));

// ---------- playing ----------
async function play({ id, plant = null, levels: lv = levels, sizes: sz = sizes, quiet = false }) {
  const { startServer, launch } = await import("../../sandbox/lib/env.mjs");
  const { playBoxes } = await import("../../sandbox/lib/boxes-play.mjs");
  const root = join(OUT, id);
  mkdirSync(root, { recursive: true });
  const t0 = Date.now();
  const srv = await startServer();
  const browser = await launch();
  const jobs = lv.flatMap((level) => sz.map((size) => ({ level, size })));
  const results = [];
  try {
    const worker = async () => {
      while (jobs.length) {
        const j = jobs.shift();
        const r = await playBoxes(browser, { game, level: j.level, size: j.size, dir: pageDir(root, j.level, j.size), plant });
        results.push(r);
        if (!quiet) console.log(`  played ${pageKey(j.level, j.size)}${plant ? ` (planted: ${plant})` : ""}: ${Object.keys(r.moments).length}/6 moments${r.missed.length ? `, missed ${r.missed.join(", ")}` : ""}${r.ended ? "" : ", did not end"}, ${(r.ms / 1000).toFixed(0)} s`);
      }
    };
    await Promise.all(Array.from({ length: parallel }, worker));
  } finally {
    await browser.close().catch(() => {});
    if (srv && srv.close) srv.close();
  }
  const ms = Date.now() - t0;
  writeFileSync(join(root, `run-${game}.json`), JSON.stringify({ game, levels: lv, sizes: sz, plant, ms, at: new Date().toISOString() }, null, 1));
  return { root, results, ms };
}

// ---------- comparing ----------
/** a run against a reference (another run's folder or the frozen one): {pages: [{key, missing, diffs, pixels, faults}], fails} */
export function compare(runRootDir, refRootDir, { only = null, played = false } = {}) {
  const cur = loadPages(runRootDir), ref = loadPages(refRootDir);
  const pages = [];
  let fails = 0;
  // (played: only the pages this run played, a run of some levels or sizes against the whole reference)
  const keys = only || (played ? Object.keys(cur).sort() : [...new Set([...Object.keys(cur), ...Object.keys(ref)])].sort());
  for (const k of keys) {
    const c = cur[k], r = ref[k];
    const faults = [];
    if (!c) { pages.push({ key: k, faults: ["not played in this run"], diffs: [], missing: [], pixels: [] }); fails++; continue; }
    if (!c.ended) faults.push("the round did not reach its end");
    for (const m of c.missed || []) faults.push(`moment "${m}" never reached (the game never stood still in it)`);
    for (const [m, v] of Object.entries(c.moments || {})) if (!v.steady) faults.push(`moment "${m}": the boxes changed while it stood (read, picture, read again)`);
    for (const [m, v] of Object.entries(c.moments || {})) if (v.pictureStill === false) faults.push(`moment "${m}": no two pictures in a row the same (${v.shots} taken)`);
    for (const e of c.errors || []) faults.push(`page error: ${e}`);
    if (!r) { faults.push("no reference for this page"); pages.push({ key: k, faults, diffs: [], missing: [], pixels: [], cur: c }); fails++; continue; }
    const { missing, diffs } = diffPage(r, c);
    const pixels = [];
    for (const m of MOMENTS) {
      if (!PIXEL_MOMENTS.has(m) || !c.moments[m] || !r.moments[m]) continue;
      const pa = join(r.dir, r.moments[m].shot), pb = join(c.dir, c.moments[m].shot);
      if (!existsSync(pa) || !existsSync(pb)) { pixels.push({ moment: m, n: -1, why: "a picture is missing" }); continue; }
      const region = pixelRegion(r.moments[m].read, m);
      if (!region) { pixels.push({ moment: m, n: -1, why: `no ${PIXEL_BOX[m].join(" or ")} box to compare inside` }); continue; }
      const res = pixelDiff(decode(pa), decode(pb), region, pixelMasks(r.moments[m].read));
      if (res.n) pixels.push({ moment: m, ...res });
    }
    const bad = faults.length || missing.length || diffs.length || pixels.length;
    if (bad) fails++;
    pages.push({ key: k, faults, missing, diffs, pixels, cur: c, ref: r });
  }
  return { pages, fails };
}
const decode = (f) => decodePng(readFileSync(f));

function printCompare(res, label) {
  for (const p of res.pages) {
    const n = p.faults.length + p.missing.length + p.diffs.length + p.pixels.length;
    if (!n) { console.log(`  ${p.key}: identical`); continue; }
    console.log(`  ${p.key}: ${n} difference${n > 1 ? "s" : ""}`);
    for (const f of p.faults) console.log(`    ${f}`);
    for (const m of p.missing) console.log(`    moment "${m.moment}" missing from the ${m.in}`);
    for (const d of p.diffs.slice(0, 40)) console.log(`    ${d.moment}: ${d.kind === "box" ? "" : d.kind + " "}${d.name} ${d.by}${d.before && d.after && d.kind === "box" ? ` (${d.before.join(",")} -> ${d.after.join(",")})` : ""}`);
    if (p.diffs.length > 40) console.log(`    ... and ${p.diffs.length - 40} more`);
    for (const x of p.pixels) console.log(`    ${x.moment}: ${x.n < 0 ? x.why : `${x.n} pixels differ, in ${x.box.join(",")}`}`);
  }
  console.log(`${res.fails ? "FAIL" : "pass"} ${label}: ${res.pages.length - res.fails}/${res.pages.length} pages identical`);
}

// the differences sheet: per page and moment that moved, the picture before and after, and the list of what moved
function sheet(res, runRootDir, refLabel) {
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const out = join(runRootDir, `diff-${game}.html`);
  const parts = [`<!doctype html><meta charset="utf-8"><title>Boxes: ${esc(game)}</title><style>body{font:14px system-ui;margin:16px;background:#faf7f2;color:#222}h2{margin:24px 0 6px}.pair{display:flex;gap:12px;flex-wrap:wrap}.pair figure{margin:0;max-width:48%}.pair img{max-width:100%;border:1px solid #ccc}td,th{padding:2px 8px;text-align:left;border-bottom:1px solid #e4ddd2}.ok{color:#2a6}.bad{color:#b22}</style>`, `<h1>Boxes: ${esc(game)}</h1><p>This run (${esc(rel(runRootDir))}) against ${esc(refLabel)}. Exact: any change is a difference. ${res.fails ? `<b class="bad">${res.fails} page(s) differ.</b>` : `<b class="ok">Every page identical.</b>`}</p>`];
  for (const p of res.pages) {
    const ms = [...new Set([...p.diffs.map((d) => d.moment), ...p.pixels.map((x) => x.moment)])];
    if (!ms.length && !p.faults.length && !p.missing.length) continue;
    parts.push(`<h2>${esc(p.key)}</h2>`);
    for (const f of p.faults) parts.push(`<p class="bad">${esc(f)}</p>`);
    for (const m of ms) {
      const before = p.ref && p.ref.moments[m] ? relative(runRootDir, join(p.ref.dir, p.ref.moments[m].shot)) : null;
      const after = p.cur && p.cur.moments[m] ? relative(runRootDir, join(p.cur.dir, p.cur.moments[m].shot)) : null;
      parts.push(`<h3>${esc(m)}</h3><div class="pair"><figure>${before ? `<img src="${esc(before)}">` : "no picture"}<figcaption>before</figcaption></figure><figure>${after ? `<img src="${esc(after)}">` : "no picture"}<figcaption>after</figcaption></figure></div>`);
      parts.push(`<table><tr><th>what</th><th>moved</th><th>before</th><th>after</th></tr>${p.diffs.filter((d) => d.moment === m).map((d) => `<tr><td>${esc(d.kind === "box" ? d.name : `${d.name} (${d.kind})`)}</td><td>${esc(d.by)}</td><td>${esc(JSON.stringify(d.before && (d.before.box || d.before)))}</td><td>${esc(JSON.stringify(d.after && (d.after.box || d.after)))}</td></tr>`).join("")}${p.pixels.filter((x) => x.moment === m).map((x) => `<tr><td>pixels</td><td>${esc(x.n < 0 ? x.why : `${x.n} differ`)}</td><td colspan="2">${esc(x.box ? x.box.join(",") : "")}</td></tr>`).join("")}</table>`);
    }
  }
  writeFileSync(out, parts.join("\n"));
  return out;
}

async function diffAndPrint(runRootDir, against, label, played = false) {
  const refDir = against ? runRoot(against) : REF;
  if (!existsSync(join(refDir, game))) { console.log(`No reference for ${game} yet (${rel(join(refDir, game))}): make one with --freeze --run-id <id>.`); return null; }
  const res = compare(runRootDir, refDir, { played });
  printCompare(res, label);
  const sh = sheet(res, runRootDir, against ? rel(refDir) : "the reference");
  console.log(`  differences sheet: ${rel(sh)}`);
  return res;
}

// ---------- commands ----------
const T0 = Date.now();
if (a.has("prove")) {
  const id0 = a.val("run-id", `prove-${game}-${stamp()}`);
  const runs = [];
  const proof = { game, levels, sizes, runs: [], plants: [], at: new Date().toISOString() };
  for (let i = 1; i <= 3; i++) {
    const id = `${id0}-r${i}`;
    console.log(`run ${i} of 3 (${id})`);
    const r = await play({ id });
    runs.push(r.root);
    let res = null;
    if (i > 1) { res = compare(r.root, runs[0]); printCompare(res, `run ${i} against run 1`); sheet(res, r.root, `run 1 (${rel(runs[0])})`); }
    else { const own = compare(r.root, r.root); const faults = own.pages.flatMap((p) => p.faults.map((f) => `${p.key}: ${f}`)); faults.forEach((f) => console.log(`  ${f}`)); console.log(`${faults.length ? "FAIL" : "pass"} run 1: every page reached its six moments and stood still in each`); res = { fails: faults.length ? 1 : 0, pages: own.pages }; }
    proof.runs.push({ id, minutes: +mins(r.ms), fails: res.fails, diffs: res.pages.reduce((n, p) => n + p.diffs.length + p.pixels.length + p.faults.length + p.missing.length, 0) });
    console.log(`  the gate's minutes, run ${i}: ${mins(r.ms)}`);
  }
  // the planted faults, each on one page (the smallest phone, level 1), each against run 1
  const plants = ["move4", "card-face", "cut-word", "light-off"];
  for (const plant of plants) {
    const id = `${id0}-plant-${plant}`;
    const r = await play({ id, plant, levels: [1], sizes: [sizes[0]], quiet: true });
    const key = pageKey(1, sizes[0]);
    const res = compare(r.root, runs[0], { only: [key] });
    const p = res.pages[0];
    const what = (p.cur && Object.values(p.cur.moments).map((m) => m.planted).filter(Boolean)[0]) || "not planted";
    // caught: a difference in the planted thing itself, at the moment it was planted (anything else is noise, and is said)
    const P = PLANTS[plant];
    const all = p.diffs.concat(p.pixels.map((x) => ({ moment: x.moment, kind: "pixels", name: "pixels", by: x.n < 0 ? x.why : `${x.n} differ` })));
    const caught = all.filter((d) => d.moment === P.at && new RegExp(P.expect).test(d.name) && (!P.kind || d.kind === P.kind));
    const fx = (d) => `${d.moment} ${d.kind && d.kind !== "box" ? d.kind + " " : ""}${d.name} ${d.by}`;
    const pixelOnly = all.filter((d) => d.kind === "pixels");
    console.log(`${caught.length ? "caught" : "MISSED"} ${plant} at ${key} (${what}): ${caught.slice(0, 3).map(fx).join("; ")}${caught.length > 3 ? `; and ${caught.length - 3} more` : ""}${p.faults.length ? `; page faults: ${p.faults.join("; ")}` : ""}`);
    proof.plants.push({ plant, page: key, planted: what, caught: caught.length > 0, diffs: caught.slice(0, 12).map(fx), alsoMoved: all.filter((d) => !caught.includes(d)).slice(0, 20).map(fx), pixels: pixelOnly.map(fx), faults: p.faults, minutes: +mins(r.ms) });
    sheet(res, r.root, `run 1 (${rel(runs[0])})`);
  }
  proof.minutes = +mins(Date.now() - T0);
  proof.identical = proof.runs.every((r) => !r.fails);
  proof.caught = proof.plants.every((p) => p.caught);
  writeFileSync(join(runs[0], `proof-${game}.json`), JSON.stringify(proof, null, 1));
  console.log(`${proof.identical && proof.caught ? "pass" : "FAIL"} the proof: three runs ${proof.identical ? "identical" : "NOT identical"}, ${proof.plants.filter((p) => p.caught).length}/4 planted faults caught; the gate's minutes: ${proof.runs.map((r) => r.minutes).join(", ")} per run, ${proof.minutes} in all (${rel(join(runs[0], `proof-${game}.json`))})`);
  process.exit(proof.identical && proof.caught ? 0 : 1);
} else if (a.has("run")) {
  const id = a.val("run-id", `${game}-${stamp()}`);
  const plant = a.val("plant");
  console.log(`boxes: ${game}, levels ${levels.join(",")}, sizes ${sizes.join(",")}${plant ? `, planted ${plant}` : ""}`);
  const r = await play({ id, plant });
  const res = await diffAndPrint(r.root, a.val("against"), `${game} against ${a.val("against") || "the reference"}`, true);
  const own = res || compare(r.root, r.root);
  const fails = res ? res.fails : own.pages.filter((p) => p.faults.length).length;
  if (!res) { for (const p of own.pages) for (const f of p.faults) console.log(`  ${p.key}: ${f}`); console.log(`${fails ? "FAIL" : "pass"} ${game}: every moment reached and still (no reference to compare with)`); }
  console.log(`${fails ? "FAIL" : "pass"} the box gate, ${game}: ${mins(Date.now() - T0)} minutes (${rel(r.root)})`);
  process.exit(fails ? 1 : 0);
} else if (a.has("prove-plants")) {
  const id0 = a.val("run-id", `rules-proof-${stamp()}`);
  const rows = [];
  for (const [plant, P] of Object.entries(PLANTS)) {
    const r = await play({ id: `${id0}-${plant}`, plant, levels: [1], sizes: [sizes[0]], quiet: true });
    const page = loadPages(r.root)[pageKey(1, sizes[0])];
    const pages = [{ key: pageKey(1, sizes[0]), game, level: 1, size: sizes[0], moments: page.moments }];
    const planted = Object.values(page.moments).map((m) => m.planted).filter(Boolean)[0] || "not planted";
    if (!P.rule) { rows.push({ plant, rule: null, planted, caught: null }); console.log(`n/a    ${plant} (${planted}): a move of 4 px breaks no rule; the box gate's reference diff catches it (--prove)`); continue; }
    const res = judge(pages, { ref: null, only: [P.rule] })[0];
    const hit = res.faults.filter((f) => f.where.endsWith(` ${P.at}`) && new RegExp(P.match).test(f.msg));
    rows.push({ plant, rule: P.rule, planted, caught: hit.length > 0, fault: hit[0] && hit[0].msg });
    console.log(`${hit.length ? "caught" : "MISSED"} ${plant} (${planted}) by ${P.rule} at ${P.at}: ${hit.length ? hit[0].msg : `none of its ${res.faults.length} fault(s) names it${res.faults[0] ? `, e.g. ${res.faults[0].msg}` : ""}`}`);
  }
  const bad = rows.filter((r) => r.caught === false).length;
  writeFileSync(join(OUT, `${id0}-proof.json`), JSON.stringify({ game, size: sizes[0], rows, at: new Date().toISOString() }, null, 1));
  console.log(`${bad ? "FAIL" : "pass"} the rules' proof: ${rows.filter((r) => r.caught).length}/${rows.filter((r) => r.rule).length} planted faults caught by their rule, ${mins(Date.now() - T0)} minutes`);
  process.exit(bad ? 1 : 0);
} else if (a.has("rules")) {
  const only = a.val("only") ? String(a.val("only")).split(",") : null;
  if (only && only.some((i) => !RULE_IDS.includes(i))) { console.error(`No such rule: ${only.filter((i) => !RULE_IDS.includes(i)).join(", ")} (have: ${RULE_IDS.join(", ")})`); process.exit(2); }
  let root;
  if (a.has("from")) { root = runRoot(a.val("from")); if (!root || !existsSync(join(root, game))) { console.error(`No played run for ${game} at ${a.val("from")}.`); process.exit(2); } }
  else {
    const id = a.val("run-id", `rules-${game}-${stamp()}`);
    const plant = a.val("plant");
    console.log(`boxes --rules: ${game}, levels ${levels.join(",")}, sizes ${sizes.join(",")}${plant ? `, planted ${plant}` : ""}`);
    root = (await play({ id, plant })).root;
  }
  const cur = loadPages(root);
  const pages = Object.entries(cur).sort(([x], [y]) => x.localeCompare(y)).map(([key, p]) => ({ key, game, level: p.level, size: p.size, moments: p.moments, missed: p.missed, ended: p.ended }));
  // chai's reference is the frame's standard for the slots (the frame's own gate until its reference is Zafar's)
  const refDir = join(REF, "chai-tray");
  const refPages = existsSync(refDir) ? (() => { const o = []; for (const n of readdirSync(refDir)) { const f = join(refDir, n, "boxes.json"); if (existsSync(f)) { const p = JSON.parse(readFileSync(f, "utf8")); o.push({ key: n, game: "chai-tray (reference)", level: p.level, size: p.size, moments: p.moments }); } } return o; })() : null;
  const res = judge(pages, { ref: refPages, only });
  // (a page that did not reach its end or a moment is said, not judged away)
  for (const p of pages) { if (!p.ended) console.log(`  ${p.key}: the round did not reach its end`); if (p.missed && p.missed.length) console.log(`  ${p.key}: moments not reached: ${p.missed.join(", ")}`); }
  console.log(formatRules(res, { max: +a.val("max", 8) }));
  writeFileSync(join(root, `rules-${game}.json`), JSON.stringify({ game, pages: pages.map((p) => p.key), rules: res, at: new Date().toISOString() }, null, 1));
  const failed = res.filter((r) => r.pass === false).length;
  console.log(`${failed ? "FAIL" : "pass"} the geometry rules, ${game}: ${res.filter((r) => r.pass).length}/${res.length} pass${res.some((r) => r.pass === null) ? `, ${res.filter((r) => r.pass === null).length} skipped` : ""}, ${pages.length} pages, ${mins(Date.now() - T0)} minutes (${rel(root)})`);
  process.exit(failed ? 1 : 0);
} else if (a.has("diff")) {
  const root = runRoot(a.val("run-id"));
  if (!root || !existsSync(root)) { console.error("No box run yet: --run first (or --run-id <id>)."); process.exit(2); }
  const res = await diffAndPrint(root, a.val("against"), `${game}: ${rel(root)} against ${a.val("against") || "the reference"}`);
  console.log(`${!res || res.fails ? "FAIL" : "pass"} the box diff, ${game}: ${mins(Date.now() - T0)} minutes`);
  process.exit(!res || res.fails ? 1 : 0);
} else if (a.has("freeze")) {
  const root = runRoot(a.val("run-id"));
  if (!root || !existsSync(join(root, game))) { console.error("No such run: --freeze --run-id <id>."); process.exit(2); }
  const own = compare(root, root);
  const bad = own.pages.filter((p) => p.faults.length);
  if (bad.length) { bad.forEach((p) => p.faults.forEach((f) => console.log(`  ${p.key}: ${f}`))); console.error("Not frozen: a page missed a moment or did not stand still."); process.exit(1); }
  const dst = join(REF, game);
  rmSync(dst, { recursive: true, force: true });
  mkdirSync(dst, { recursive: true });
  cpSync(join(root, game), dst, { recursive: true });
  writeFileSync(join(dst, "frozen.json"), JSON.stringify({ game, from: rel(root), at: new Date().toISOString() }, null, 1));
  console.log(`The reference for ${game} is now ${rel(root)} (${rel(dst)}).`);
} else {
  console.log(HELP);
  process.exit(2);
}

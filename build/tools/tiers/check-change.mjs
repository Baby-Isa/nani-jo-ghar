#!/usr/bin/env node
// check-change (tier 2, targeted: a builder's hand-back and every merge; Zafar, 9-10 Nov). The touched game only, at the levels
// touched, at 740x320 and 930x430, with that game's contract rules; each named row's probe red (the base commit) then green (this
// one); before|after pictures made by script from the base commit and the candidate; a first-play film of L1 as a new player.
// Thin: it runs run.mjs, evidence.mjs, touched.mjs and the checks tiers.json places at tier 2; it rewrites none of them.
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { args, help } from "../review/lib/common.mjs";
import * as T from "./lib.mjs";

const HELP = `
node build/tools/tiers/check-change.mjs [--dry-run] [--base <ref>] [--games chop,daar] [--rows SH-1,CK-2] [--levels 1,2]
                                        [--sizes 740x320] [--brief <spec.json>] [--no-before] [--no-film]
  Tier 2. By default the games and rows come from git: the diff from the merge base with origin/main to the working tree
  (touched.mjs's map; a shared file reaching more than ${T.CONFIG.tiers.change.maxGames} games plays ${T.CONFIG.tiers.change.sharedGames.join(", ")} and chai's frozen run; check-sprint plays the rest).
  Levels: L1, or L1-L4 when the change touches levels (a level table, a ladder, the game's station data). --brief <spec>: a
  builder's brief: its flows are the games, its rows go through evidence.mjs --after/--judge --brief, and its scope is audited.
  Runs (tiers.json "change"): check-push; brief.mjs --audit (with --brief); run.mjs --flow <the game's flows> --sizes 740x320,930x430
  --check; the same flows on the base commit's tree (build/screenshots/tiers/trees/<base>) for the before; pairs.py: before|after;
  the rows' probes (evidence.mjs) on both; a film of L1 as a new player (NJG_VIDEO); the tier's extra checks (tiers.json "checks").
  Blocks on: check-push, a page that does not reach its end, a page error, a contract break the base did not have, a row's probe
  failing on this commit, a blocking extra check. Writes build/reports/tiers/change-<commit>.json and .md; exit 1 when it fails.
  Port COOK_TEST_PORT; lock NJG_LOCK (default ${T.CONFIG.lock}).`;
const a = args(); help(HELP, a);
const { dry } = T.common(a);
const C = T.CONFIG.tiers.change;
const t0 = Date.now();
const sha = T.head(), base = a.val("base") ? T.git("rev-parse", a.val("base")) : T.mergeBase();
if (!base) { console.error("No base commit (pass --base <ref>)."); process.exit(2); }
const all = T.allFlowIds();
const spec = a.val("brief") ? JSON.parse(readFileSync(a.val("brief"), "utf8")) : null;
const tc = T.touched(base);
const files = tc.files || [];
const notes = [];
// ---- the games
let games, gamesWhy;
if (a.val("games")) { games = a.val("games").split(",").map((g) => T.normalizeGame(g.trim(), all) || g.trim()); gamesWhy = "--games"; }
else if (spec && spec.flows && spec.flows.length) { games = T.gamesFromFlows(spec.flows, all); gamesWhy = "the brief's flows"; }
else {
  games = T.gamesFromFlows(tc.flows || [], all); gamesWhy = `the diff from ${T.short(base)}`;
  if (games.length > C.maxGames) { notes.push(`the change reaches ${games.length} games (a shared file): tier 2 plays ${C.sharedGames.join(", ")} and chai's frozen run; check-sprint plays every game`); games = C.sharedGames; gamesWhy = "a shared change"; }
}
const unknown = games.filter((g) => !all.some((f) => T.gameOf(f, all) === g));
if (unknown.length) { console.error(`Unknown game(s): ${unknown.join(", ")} (node build/sandbox/run.mjs --list)`); process.exit(2); }
// ---- the levels, the flows, the sizes
const diffs = T.fileDiffs(base, files.filter((f) => /^(js|css|data)\//.test(f)));
const sizes = (a.val("sizes") ? a.val("sizes").split(",") : C.sizes);
const flows = [], levelsBy = {};
for (const g of games) {
  levelsBy[g] = a.val("levels") ? a.val("levels").split(",").map(Number) : T.levelsTouched(diffs, g);
  flows.push(...T.flowsOfGame(g, all, { levels: levelsBy[g], skipPaths: C.skipPaths }));
}
// ---- the rows
const probed = T.probedRows();
let rows = [];
if (a.val("rows")) rows = a.val("rows").split(",").map((x) => x.trim()).filter(Boolean);
else if (!spec) rows = T.rowsFromDiff(T.git("diff", base, "--", "docs/process/regressions.md") || "", T.git("log", "--format=%B", `${base}..HEAD`) || "", probed);
const noProbe = rows.filter((r) => !probed.has(r));
if (noProbe.length) notes.push(`rows with no probe (a row with no probe is never built): ${noProbe.join(", ")}`);
rows = rows.filter((r) => probed.has(r));
// ---- the steps
const id = T.short(sha), bid = T.short(base);
const work = join(T.WORK, `change-${id}`);
const pagesN = flows.length * sizes.length;
const steps = [];
steps.push({ id: "push", what: "tier 0 first (reused when it passed on this commit)", cmd: "node", argv: ["build/tools/tiers/check-push.mjs"], minutes: 3, blocks: true });
if (spec) steps.push({ id: "scope", what: "the builder's files inside its owns (brief.mjs --audit)", cmd: "node", argv: ["build/tools/ops/brief.mjs", "--audit", a.val("brief"), `${base}..HEAD`], minutes: 1, blocks: true });
const afterRun = `tiers-change-${id}`, beforeRun = `tiers-before-${bid}-${id}`;
if (flows.length) steps.push({ id: "play", what: `the robot plays ${games.join(", ")} (${flows.length} flows: L${[...new Set(Object.values(levelsBy).flat())].join(",L")}, paths) at ${sizes.join(", ")} with the contract rules`, cmd: "node", argv: ["build/sandbox/run.mjs", "--flow", flows.join(","), "--sizes", sizes.join(","), "--check", "--no-sheets", "--run-id", afterRun], browser: true, minutes: Math.ceil(pagesN * T.CONFIG.secondsPerPage / 60), blocks: false, timeoutMin: 120 });
const before = C.before && !a.has("no-before") && flows.length > 0;
if (before) {
  steps.push({ id: "before", what: `the same flows on the base commit ${bid} (its own tree and sandbox)`, cmd: "node", argv: ["build/sandbox/run.mjs", "--flow", "{base flows}", "--sizes", sizes.join(","), "--check", "--no-sheets", "--run-id", beforeRun], browser: true, minutes: Math.ceil(pagesN * T.CONFIG.secondsPerPage / 60), blocks: false, timeoutMin: 120, tree: true });
  steps.push({ id: "pairs", what: "before | after pictures, made by script from the two runs", cmd: "python3", argv: ["build/tools/tiers/pairs.py", "{before run}", T.rel(T.runPath(afterRun)), T.rel(join(work, "before-after"))], minutes: 1, blocks: false });
}
if (spec) {
  steps.push({ id: "rows", what: "the brief's rows, after (evidence.mjs --after --brief; the before was played at launch)", cmd: "node", argv: ["build/tools/review/evidence.mjs", "--after", "--brief", a.val("brief")], browser: true, selfLock: true, minutes: 10, blocks: true });
  steps.push({ id: "rows-judge", what: "the judge's before|after batch for Fable (evidence.mjs --judge --brief)", cmd: "node", argv: ["build/tools/review/evidence.mjs", "--judge", "--brief", a.val("brief")], minutes: 1, blocks: false });
} else if (rows.length) {
  if (before) steps.push({ id: "rows-red", what: `the rows' probes on the base commit (red): ${rows.join(", ")}`, cmd: "node", argv: ["build/tools/review/evidence.mjs", "--run", "--rows", rows.join(","), "--run-id", `tiers-red-${bid}-${id}`], browser: true, selfLock: true, minutes: rows.length * 2, blocks: false, tree: true });
  steps.push({ id: "rows-green", what: `the rows' probes on this commit (green): ${rows.join(", ")}`, cmd: "node", argv: ["build/tools/review/evidence.mjs", "--run", "--rows", rows.join(","), "--run-id", `tiers-green-${id}`], browser: true, selfLock: true, minutes: rows.length * 2, blocks: true });
  steps.push({ id: "rows-judge", what: "the judge's batch for Fable (evidence.mjs --judge)", cmd: "node", argv: ["build/tools/review/evidence.mjs", "--judge", "--run-id", `tiers-green-${id}`], minutes: 1, blocks: false });
}
const films = [];
if (!a.has("no-film")) for (const g of games) {
  const f = T.filmFlow(g, all, C.film.prefer);
  if (!f) { notes.push(`${g}: no L1 flow to film`); continue; }
  const run = `tiers-film-${id}-${T.keyOf(g)}`;
  films.push(run);
  steps.push({ id: `film:${T.keyOf(g)}`, game: g, what: `a first-play film: ${f} as a new player at ${C.film.size}, for the orchestrator to look at`, cmd: "node", argv: ["build/sandbox/run.mjs", "--flow", f, "--sizes", C.film.size, "--no-sheets", "--run-id", run], env: { NJG_VIDEO: join(work, "video-tmp") }, browser: true, minutes: 2, blocks: false });
}
const elems = (() => { try { return T.elementsFromDiff(T.git("diff", base, "--", "js/shared", "css/shared") || "", JSON.parse(readFileSync(join(T.ROOT, "data/kit-elements.json"), "utf8")).elements); } catch (e) { return []; } })();
steps.push(...T.extraSteps("change", { files, games, elems, base }).map((s) => (s.check === "loadtime" || s.check === "panelcheck") && !files.length ? { ...s, skip: "no files changed" } : s));
// shared change: chai's frozen run (when tiers.json's frozen "when" did not already fire)
if (gamesWhy === "a shared change" && !steps.some((s) => s.check === "frozen")) steps.push({ id: "frozen", what: "chai against its frozen run (a shared change)", cmd: "node", argv: ["build/tools/review/frozen.mjs", "--diff"], browser: true, selfLock: true, minutes: 10, blocks: true });

const extra = [`base ${bid} (${a.val("base") ? "--base" : "merge base with origin/main"}), ${files.length} changed file(s); games: ${games.join(", ") || "none"} (${gamesWhy})`,
  `levels: ${games.map((g) => `${g} L${levelsBy[g].join(",L")}`).join("; ") || "-"}; sizes ${sizes.join(", ")}; rows: ${rows.join(", ") || (spec ? "the brief's" : "none")}`, ...notes];
if (dry) { T.printPlan("check-change (tier 2)", steps.filter((s) => !s.skip), extra); process.exit(0); }
if (!games.length && !rows.length && !spec) { console.log("check-change: no game or row reached by this change; tier 0 is enough"); }

// ---- run
const r = T.newResult("change", { base, games, gamesWhy, rows, levels: levelsBy, sizes, notes, artefacts: {} });
let tree = null;
for (const s of steps) {
  if (!s.tree && !String(s.argv || "").includes("{before run}")) continue;
  if (!tree) { process.stdout.write(`  the base tree ${bid} ... `); try { tree = T.beforeTree(base); console.log(T.rel(tree)); } catch (e) { console.log(`not made: ${e.message}`); } }
  if (!tree) { s.skip = "no base tree"; continue; }
  if (s.tree) s.cwd = tree;
  if (s.id === "before") {
    const at = spawnSync(process.execPath, ["build/sandbox/run.mjs", "--list"], { cwd: tree, encoding: "utf8", maxBuffer: 1 << 26 }).stdout.split("\n").map((l) => l.split(/\s+/)[0]);
    const have = flows.filter((f) => at.includes(f));
    if (!have.length) { s.skip = "none of these flows exists on the base commit (a new game)"; continue; }
    if (have.length < flows.length) notes.push(`not on the base commit: ${flows.filter((f) => !at.includes(f)).join(", ")}`);
    s.argv = s.argv.map((x) => (x === "{base flows}" ? have.join(",") : x));
  }
  if (s.id === "rows-red") {
    const ev = JSON.parse(readFileSync(join(tree, "build/sandbox/data/evidence.json"), "utf8"));
    const have = rows.filter((x) => ev[x]);
    if (!have.length) { s.skip = "no probe on the base commit (new probes: the red is the launch's evidence.mjs --before run)"; continue; }
    s.argv = s.argv.map((x) => (x === rows.join(",") ? have.join(",") : x));
  }
  s.argv = s.argv.map((x) => (x === "{before run}" ? T.runPath(beforeRun, tree) : x));
}
mkdirSync(work, { recursive: true });
const done = await T.runAll(steps, join(work, "logs"));
// ---- judge the play: stuck pages, page errors, and contract breaks the base did not have
const after = T.readRun(T.runPath(afterRun));
const beforeR = tree ? T.readRun(T.runPath(beforeRun, tree)) : { pages: [], breaks: [] };
const known = new Set(beforeR.breaks.map((b) => `${b.check}|${b.flow}|${b.size}`));
const fails = T.runFailures(after, all);
// (a break blocks unless the base had the same check break on the same flow and size)
for (const f of fails) if (f.check.startsWith("contract-")) { const [flow, size] = f.where.replace(/ \(.*$/, "").split(/@(?=\d+x\d+$)/); f.blocks = !known.has(`${f.check}|${flow}|${size}`); if (!f.blocks) f.what += " (the base has it too)"; }
if (flows.length && !after.pages.length) fails.push({ game: null, check: "play", where: T.rel(T.runPath(afterRun)), what: "no page played (see the play step's log)", blocks: true });
r.failures = [...fails, ...T.stepFailures(done)];
r.artefacts = {
  "the play": T.rel(T.runPath(afterRun)),
  ...(tree ? { "before | after": T.rel(join(work, "before-after", "index.html")) } : {}),
  ...(films.length ? { "first-play films": films.flatMap((f) => T.filmsOf(f)) } : {}),
  ...(done.some((s) => s.id === "rows-judge" && s.status === "pass") ? { "the judge's batch": spec ? `build/screenshots/brief/${(spec.report || "").trim()}/` : `build/screenshots/evidence/tiers-green-${id}/judge/` } : {}),
  logs: T.rel(join(work, "logs")),
};
r.pages = { after: after.pages.length, before: beforeR.pages.length, breaksAfter: after.breaks.length, breaksBefore: beforeR.breaks.length };
const res = T.finish(r, done, t0);
for (const f of (res.failures || []).filter((x) => x.blocks)) console.log(`  BLOCKS ${f.game || ""} ${f.check} ${f.where || ""}: ${f.what}`);
process.exit(res.ok ? 0 : 1);

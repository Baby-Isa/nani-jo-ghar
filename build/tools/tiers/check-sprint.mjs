#!/usr/bin/env node
// check-sprint (tier 3, once the sprint's main work is in, BEFORE the fix-up; Zafar, 9-10 Nov; /sprint runs it). Since the last
// publish: every changed game at L1-L4 at the four sizes with every rule (end reached, 0 page errors, contract checks); every
// other game to its end at one size (shared code can break it); chai's frozen run; the judge's batches for Fable (the sprint's row
// probes; beside chai for a game on its new pictures); first-minute films (first time and returning); and ONE fix list, by game.
import { readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { args, help } from "../review/lib/common.mjs";
import * as T from "./lib.mjs";

const HELP = `
node build/tools/tiers/check-sprint.mjs [--dry-run] [--since <ref>] [--games a,b] [--no-others] [--no-films] [--beside chop,daar]
  Tier 3. --since: default the last publish (the newest "Publish: version" commit on origin/main in this branch). The games: what
  the diff since then reaches (touched.mjs), or --games. Runs (tiers.json "sprint"): check-push; run.mjs --flow <changed games'
  flows, L1-L4 and paths> --sizes the four --check --parallel 3; run.mjs --flow <every other game's L1> --sizes 1280x665;
  evidence.mjs --run --sprint then --judge (the probe sheets for Fable); sidebyside.mjs <game> for each changed Cook game whose
  pictures changed (or --beside); a film of L1 as a new player and as a returning one (NJG_VIDEO, 740x320); the tier's extra checks
  (tiers.json "checks": chai's frozen run, the audit's steps per Cook game, the older scripts ...). Writes the result with the fix
  list by game: build/reports/tiers/sprint-<commit>.json and .md; exit 1 when the fix list has anything that blocks.`;
const a = args(); help(HELP, a);
const { dry } = T.common(a);
const S = T.CONFIG.tiers.sprint;
const t0 = Date.now();
const sha = T.head(), base = a.val("since") ? T.git("rev-parse", a.val("since")) : T.lastPublish();
const all = T.allFlowIds();
const tc = T.touched(base);
const files = tc.files || [];
const games = a.val("games") ? a.val("games").split(",").map((g) => T.normalizeGame(g.trim(), all) || g.trim()) : T.gamesFromFlows(tc.flows || [], all);
const everyGame = T.gamesFromFlows(all, all);
const others = a.has("no-others") ? [] : everyGame.filter((g) => !games.includes(g) && all.includes(g));
const sizes = T.sizesOf(S.sizes);
const flows = games.flatMap((g) => T.flowsOfGame(g, all, { levels: [1, 2, 3, 4], skipPaths: ["speed1"] }));
const id = T.short(sha), work = join(T.WORK, `sprint-${id}`);
const runChanged = `tiers-sprint-${id}`, runOthers = `tiers-sprint-others-${id}`, runRows = `tiers-sprint-rows-${id}`;
const steps = [{ id: "push", what: "tier 0 first (reused when it passed on this commit)", cmd: "node", argv: ["build/tools/tiers/check-push.mjs"], minutes: 3, blocks: true }];
if (flows.length) steps.push({ id: "play", what: `the changed games (${games.length}: ${games.join(", ")}) at L1-L4 and their paths (${flows.length} flows) at the four sizes, every rule`, cmd: "node", argv: ["build/sandbox/run.mjs", "--flow", flows.join(","), "--sizes", sizes.join(","), "--check", "--parallel", "3", "--no-sheets", "--run-id", runChanged], browser: true, minutes: Math.ceil(flows.length * sizes.length * T.CONFIG.secondsPerPage / 60 / 2), blocks: false, timeoutMin: S.timeoutMin });
if (others.length) steps.push({ id: "others", what: `every other game (${others.length}) to its end at ${S.othersSize}`, cmd: "node", argv: ["build/sandbox/run.mjs", "--flow", others.join(","), "--sizes", S.othersSize, "--parallel", "3", "--no-sheets", "--run-id", runOthers], browser: true, minutes: Math.ceil(others.length * T.CONFIG.secondsPerPage / 60 / 2), blocks: false, timeoutMin: S.timeoutMin });
steps.push({ id: "rows", what: "the sprint's row probes (evidence.mjs --run --sprint)", cmd: "node", argv: ["build/tools/review/evidence.mjs", "--run", "--sprint", "--since", base, "--run-id", runRows], browser: true, selfLock: true, minutes: 20, blocks: false, timeoutMin: S.timeoutMin });
steps.push({ id: "rows-judge", what: "the probe sheets' batches for Fable (evidence.mjs --judge)", cmd: "node", argv: ["build/tools/review/evidence.mjs", "--judge", "--run-id", runRows], minutes: 1, blocks: false });
// beside chai: a changed Cook game whose pictures changed (its new scene and art), or --beside
const art = files.filter((f) => new RegExp(S.besideChai.when).test(f));
const beside = a.val("beside") ? a.val("beside").split(",") : games.filter((g) => T.familyOf(g) === "cook" && g !== "cook:chai-tray" && art.some((f) => f.includes(T.keyOf(g)))).map(T.keyOf);
for (const k of beside) steps.push({ id: `beside:${k}`, game: `cook:${k}`, what: `${k} beside chai at a child's pace, for Fable (sidebyside.mjs)`, cmd: "node", argv: ["build/tools/review/sidebyside.mjs", k, "--sizes", S.besideChai.sizes], browser: true, selfLock: true, minutes: 12, blocks: false });
const films = [];
if (!a.has("no-films")) for (const g of games) for (const [kind, prefer] of Object.entries({ first: S.films.first, returning: S.films.returning })) {
  const f = T.filmFlow(g, all, prefer);
  if (!f) continue;
  const run = `tiers-film-${id}-${T.keyOf(g)}-${kind}`;
  films.push(run);
  steps.push({ id: `film:${T.keyOf(g)}:${kind}`, game: g, what: `the first minute, ${kind === "first" ? "a new player" : "a returning player"}: ${f} at ${S.films.size}`, cmd: "node", argv: ["build/sandbox/run.mjs", "--flow", f, "--sizes", S.films.size, "--no-sheets", "--run-id", run], env: { NJG_VIDEO: join(work, "video-tmp") }, browser: true, minutes: 2, blocks: false });
}
const elems = (() => { try { return T.elementsFromDiff(T.git("diff", base, "--", "js/shared", "css/shared") || "", JSON.parse(readFileSync(join(T.ROOT, "data/kit-elements.json"), "utf8")).elements); } catch (e) { return []; } })();
steps.push(...T.extraSteps("sprint", { files, games, elems, base }));

const extra = [`since ${T.short(base)} (${a.val("since") ? "--since" : "the last publish"}), ${files.length} changed file(s)`, `changed games (${games.length}): ${games.join(", ") || "none"}; others at one size: ${others.length}; beside chai: ${beside.join(", ") || "none"}; shared elements: ${elems.join(", ") || "none"}`];
if (dry) { T.printPlan("check-sprint (tier 3)", steps, extra); process.exit(0); }

mkdirSync(work, { recursive: true });
const r = T.newResult("sprint", { base, games, gamesWhy: a.val("games") ? "--games" : `the diff since ${T.short(base)}`, others, notes: [], artefacts: {} });
const done = await T.runAll(steps, join(work, "logs"));
const changed = T.readRun(T.runPath(runChanged)), rest = T.readRun(T.runPath(runOthers));
// the fix list: every changed game's stuck page, page error and contract break (each gets an outcome in the sprint: the game
// fixed, the probe fixed, or the rule retired with his yes), every other game's stuck page and page error, every failed step
const fixes = [...T.runFailures(changed, all).map((f) => ({ ...f, blocks: true })), ...T.runFailures({ pages: rest.pages, breaks: [] }, all), ...T.stepFailures(done)];
r.failures = fixes;
r.fixTitle = "Fix list";
r.pages = { changed: changed.pages.length, others: rest.pages.length, breaks: changed.breaks.length };
r.artefacts = {
  "the play": T.rel(T.runPath(runChanged)),
  "probe sheets' batches for Fable": `build/screenshots/evidence/${runRows}/judge/`,
  ...(beside.length ? { "beside chai (Fable)": "build/screenshots/sidebyside/ (judge-batch.md in each)" } : {}),
  "first-minute films": films.flatMap((f) => T.filmsOf(f)),
  logs: T.rel(join(work, "logs")),
};
const res = T.finish(r, done, t0);
console.log(T.fixListMd(fixes.filter((f) => f.blocks !== false), "Fix list"));
process.exit(res.ok ? 0 : 1);

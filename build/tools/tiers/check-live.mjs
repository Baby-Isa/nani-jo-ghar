#!/usr/bin/env node
// check-live (tier 4, right after a publish, before "it's live"; Zafar, 9 Nov; check-publish --go runs it). Each changed game's
// first minute on the live site at 740x320: page errors and a strip of frames for the orchestrator to look at first. On a failure
// it prints the exact command that puts main back to the last good publish (a new commit with that publish's tree: no force push).
import { mkdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { args, help } from "../review/lib/common.mjs";
import * as T from "./lib.mjs";

const HELP = `
node build/tools/tiers/check-live.mjs [--dry-run] [--games a,b] [--site <url>] [--seconds 60]
  Tier 4. The games: those of the newest check-publish on a commit main now has (else what the last publish changed). For each,
  build/tools/tiers/film.mjs --url <site>/<its page> --size ${T.CONFIG.tiers.live.size} --seconds ${T.CONFIG.tiers.live.seconds} --every ${T.CONFIG.tiers.live.every}
  (a strip and the page errors). Writes build/reports/tiers/live-<main commit>.json and .md. Exit 1 on a page that does not load or a
  page error, with the command that puts main back to the last good publish; exit 3 when the site cannot be reached from here.`;
const a = args(); help(HELP, a);
const { dry } = T.common(a);
const L = T.CONFIG.tiers.live;
const t0 = Date.now();
T.git("fetch", "-q", "origin", "main");
const remote = T.git("remote", "get-url", "origin") || "";
const m = /github\.com[/:]([^/]+)\/([^/.]+)/.exec(remote) || /\/git\/([^/]+)\/([^/.]+)/.exec(remote);
const SITE = (a.val("site") || (m ? `https://${m[1].toLowerCase()}.github.io/${m[2]}` : "")).replace(/\/$/, "");
const all = T.allFlowIds();
const pubs = T.publishes(3);
const mainSha = T.git("rev-parse", "origin/main");
const onMain = (c) => T.git("merge-base", "--is-ancestor", c, "origin/main") !== null;
const last = T.readResults("publish").filter((r) => r.ok && !r.dry && onMain(r.commit)).sort((x, y) => String(y.date).localeCompare(String(x.date)))[0];
let games = a.val("games") ? a.val("games").split(",").map((g) => T.normalizeGame(g.trim(), all) || g.trim()) : last ? last.games : null;
if (!games && pubs.length > 1) games = T.gamesFromFlows(T.touched(null, (T.git("diff", "--name-only", pubs[1].sha, pubs[0].sha) || "").split("\n").filter(Boolean)).flows || [], all);
games = (games || []).length ? games : ["house"];
if (!a.val("games") && games.length > L.maxGames) games = L.sharedGames; // a shared change: one game a family (the four sizes and every game ran at tier 3)
export const liveUrl = (game) => { for (const [p, u] of Object.entries(L.urls)) if (p !== "*" && (game === p || game.startsWith(p))) return u.replaceAll("{key}", T.keyOf(game)); return L.urls["*"]; };
// the last good publish: the one before the newest (main back to its tree, as a new commit on top of main)
const good = pubs[1];
const rollback = good ? `git fetch origin main && NJG_ROLLBACK=1 git push origin "$(git commit-tree ${good.sha}^{tree} -p origin/main -m 'Roll back main to the last good publish ${good.stamp} (check-live failed on ${pubs[0].stamp})')":refs/heads/main` : "(no earlier publish on main to go back to)";
const id = T.short(mainSha), work = join(T.WORK, `live-${id}`);
const steps = games.map((g) => ({ id: `live:${T.keyOf(g) || g}`, game: g, what: `${g}'s first minute on the live site at ${L.size}`, cmd: "node", argv: ["build/tools/tiers/film.mjs", "--url", `${SITE}/${liveUrl(g)}`, "--size", L.size, "--seconds", String(a.val("seconds") || L.seconds), "--every", String(L.every), "--play", "--out", T.rel(join(work, T.keyOf(g) || g))], browser: true, minutes: Math.ceil((+a.val("seconds") || L.seconds) / 60) + 1, blocks: true }));
const extra = [`site ${SITE || "unknown (--site)"}; main ${id}${pubs[0] ? ` (publish ${pubs[0].stamp})` : ""}; games: ${games.join(", ")}`, `on a failure: ${rollback}`];
if (dry) { T.printPlan("check-live (tier 4)", steps, extra); process.exit(0); }

// can the site be reached from here? (a container's proxy can block github.io: then the orchestrator opens it on a device)
let reach = true;
try { const r = await fetch(`${SITE}/js/version.js?nocache=${Date.now()}`, { cache: "no-store" }); reach = r.ok; } catch (e) { reach = false; }
const r = T.newResult("live", { commit: mainSha, base: good ? good.sha : null, games, site: SITE, notes: [], artefacts: {} });
if (!reach) {
  r.notes.push(`${SITE} cannot be reached from here: open each game's page on a phone (740x320 or a real one) before saying it is live`);
  r.failures = [{ game: null, check: "site", what: `${SITE} not reachable from this machine`, blocks: true }];
  T.finish(r, steps.map((s) => ({ id: s.id, what: s.what, game: s.game, blocks: true, status: "skipped", note: "site not reachable" })), t0);
  console.log(`check-live: ${SITE} is not reachable from here. Open these on a phone before saying it is live:\n${games.map((g) => `  ${SITE}/${liveUrl(g)}`).join("\n")}\nIf one fails: ${rollback}`);
  process.exit(3);
}
mkdirSync(work, { recursive: true });
const done = await T.runAll(steps, join(work, "logs"));
r.failures = T.stepFailures(done);
r.artefacts = { strips: games.map((g) => T.rel(join(work, T.keyOf(g) || g, "strip.jpg"))).filter((p) => existsSync(join(T.ROOT, p))), logs: T.rel(join(work, "logs")) };
const res = T.finish(r, done, t0);
console.log(`look at the strips first: ${r.artefacts.strips.join(", ") || "(none made)"}`);
if (!res.ok) { console.log(`\nLIVE CHECK FAILED. Put main back to the last good publish first, then look:\n  ${rollback}`); process.exit(1); }

#!/usr/bin/env node
// The merge script (Sprint 20 P3): a builder's branch reaches the current branch only when the gate passes on the MERGED result.
//   node build/tools/tiers/merge.mjs <branch> [--game chai-tray,daar | none] [--gate-script <path>] [--dry-run]
// 1. the tree must be clean and no merge under way; 2. git merge --no-commit --no-ff <branch> (a conflict: aborted, printed);
// 3. the games come from the merge's changed files (touched.mjs's map; a change reaching more than tiers.json's maxGames plays its
//    sharedGames; none: tier 0 only) unless --game; 4. gate.mjs on the merged tree; 5. pass: commit, the gate's final line in the
//    message; fail: git merge --abort, the gate's BLOCKS lines printed, the tree as it was. It never pushes.
import { spawnSync } from "node:child_process";
import { args, ROOT } from "../review/lib/common.mjs";
import { pathToFileURL } from "node:url";

// pure: the games a set of changed files reaches
export function gamesFor(touchedFlows, all, cfg, gamesFromFlows, keyOf) {
  let games = gamesFromFlows(touchedFlows, all);
  if (games.length > cfg.maxGames) games = cfg.sharedGames;
  return games.map(keyOf);
}
export const gateLineOf = (out) => (String(out).split("\n").reverse().find((l) => /^GATE (PASS|FAIL) /.test(l)) || "");

async function main() {
  const a = args();
  const branch = a.pos[0];
  if (!branch || a.has("help")) { console.log("node build/tools/tiers/merge.mjs <branch> [--game g[,g] | none] [--gate-script <path>] [--dry-run]"); process.exit(branch ? 0 : 2); }
  const git = (...x) => spawnSync("git", x, { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 28 });
  const out = (r) => `${r.stdout || ""}${r.stderr || ""}`.trim();
  if (git("rev-parse", "--verify", `${branch}^{commit}`).status !== 0) { console.error(`merge: no branch ${branch}`); process.exit(2); }
  if (git("rev-parse", "-q", "--verify", "MERGE_HEAD").status === 0) { console.error("merge: a merge is already under way; finish or abort it first"); process.exit(2); }
  const dirty = git("status", "--porcelain", "--untracked-files=no").stdout.trim();
  if (dirty) { console.error(`merge: the tree is not clean:\n${dirty}`); process.exit(2); }
  const here = git("rev-parse", "--abbrev-ref", "HEAD").stdout.trim();
  const m = git("merge", "--no-commit", "--no-ff", branch);
  const merging = git("rev-parse", "-q", "--verify", "MERGE_HEAD").status === 0;
  if (m.status !== 0 || !merging) {
    if (merging) git("merge", "--abort");
    if (!merging && /Already up to date/.test(out(m))) { console.log(`merge: ${branch} is already in ${here}; nothing to do`); process.exit(0); }
    console.error(`merge: REFUSED, ${branch} does not merge into ${here} cleanly (aborted):\n${out(m).slice(0, 800)}`);
    process.exit(1);
  }
  const abort = (why) => { git("merge", "--abort"); console.error(`merge: REFUSED, ${why}; the merge is aborted and ${here} is as it was. Nothing was pushed.`); process.exit(1); };
  const T = await import("./lib.mjs");
  const files = git("diff", "--cached", "--name-only").stdout.split("\n").filter(Boolean);
  let games;
  if (a.val("game")) games = a.val("game") === "none" ? [] : a.val("game").split(",");
  else {
    const all = T.allFlowIds();
    const tc = T.touched(null, files);
    games = gamesFor(tc.flows || [], all, T.CONFIG.tiers.change, T.gamesFromFlows, T.keyOf);
  }
  console.log(`merge: ${branch} into ${here}: ${files.length} changed file(s); the gate plays ${games.length ? games.join(", ") : "tier 0 only (no game reached)"}`);
  if (a.has("dry-run")) { git("merge", "--abort"); process.exit(0); }
  const g = a.val("gate-script", "build/tools/tiers/gate.mjs");
  const r = spawnSync(process.execPath, [g, "--game", games.length ? games.join(",") : "none"], { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 28, stdio: ["ignore", "pipe", "inherit"] });
  process.stdout.write(r.stdout || "");
  const line = gateLineOf(r.stdout);
  if (r.status !== 0 || !/^GATE PASS /.test(line)) abort(`the gate did not pass${line ? ` (${line})` : ""}`);
  const c = git("commit", "-m", `Merge ${branch} (gate passed)\n\n${line}`);
  if (c.status !== 0) abort(`the commit failed: ${out(c).slice(0, 300)}`);
  console.log(`merge: ${branch} merged into ${here}, ${git("rev-parse", "--short", "HEAD").stdout.trim()}; ${line}. Not pushed.`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();

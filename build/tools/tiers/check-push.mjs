#!/usr/bin/env node
// check-push (tier 0, every push; Zafar, 9-10 Nov: "they should happen automatically"): checks.mjs, no browser. The push hook
// (.claude/settings.json, push-hook.mjs) runs it before any `git push` and refuses the push when it fails. A pass on this commit
// with a clean tree is reused, so a second push of the same code costs nothing.
import { args, help } from "../review/lib/common.mjs";
import { CONFIG, common, newResult, finish, runAll, printPlan, readResults, head, dirtyFiles, WORK, resultName, ROOT } from "./lib.mjs";
import { join } from "node:path";
import { readFileSync } from "node:fs";

const HELP = `
node build/tools/tiers/check-push.mjs [--dry-run] [--again]
  Tier 0: node build/tools/review/checks.mjs (unit tests, words, static, leak bots, bump, specs, docs, stdids, recordings, fix list,
  decisions, art, size). Writes build/reports/tiers/push-<commit>.json and .md; exit 1 when it fails.
  A pass already on record for this commit (clean tree) is reused unless --again.`;
const a = args(); help(HELP, a);
const { dry } = common(a);
const t = CONFIG.tiers.push;
const steps = [{ id: "checks", what: "checks.mjs: every fast check, no browser", cmd: "node", argv: t.argv, minutes: t.minutes, blocks: true }];

if (dry) { printPlan("check-push (tier 0)", steps, ["a pass already on record for this commit (clean tree) is reused"]); process.exit(0); }
const sha = head();
const prior = readResults("push").find((r) => r.commit === sha && r.ok && !r.dirty);
if (prior && !dirtyFiles().length && !a.has("again")) { console.log(`check-push: passed on ${sha.slice(0, 10)} already (${prior.date}); nothing to run`); process.exit(0); }
const t0 = Date.now();
const done = await runAll(steps, join(WORK, resultName("push", sha)));
const r = finish(newResult("push"), done, t0);
if (!r.ok) for (const l of readFileSync(join(ROOT, done[0].log), "utf8").split("\n").filter((x) => /^(FAIL| {5}\S)/.test(x)).slice(0, 30)) console.log(`  ${l}`);
process.exit(r.ok ? 0 : 1);

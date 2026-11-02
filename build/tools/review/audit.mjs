#!/usr/bin/env node
// The audit (Sprint 17, docs/process/prototype-to-game.md "Once, in Sprint 17"): one command plays a game at L1-L4 at the four sizes
// and reports it against the standard, joining the checks that already exist:
//   1 sandbox   build/sandbox/run.mjs --touched <flow> --check: every level and path at the four sizes; the contract checks (one light,
//               bubbles off faces, cards off faces, the order card's light, calls with their lights, ...) and the screen lint (clipped,
//               covered, off-screen text); exit 1 on a contract break or a new finding
//   2 panel     panelcheck.mjs: the side panel's measures and the order film (SH-169, SH-189 to SH-192)
//   3 labcheck  labcheck.mjs on the game's lab page at L1-L4, played to its order: page errors, any word leaving its card, speaker gaps
//   4 leak      leak.mjs <config>: a bot that knows no Kutchi can't win
//   5 load      loadtime.mjs --games <game>: time to the first play tap against the baseline
// Writes build/reports/audit-<game>-<date>.md (one line per step, its result and where its detail is); exit 1 if any step fails.
// The judge looks at what it can't measure (docs/process/prototype-to-game.md, step 3).
//
//   node build/tools/review/audit.mjs <game> [--only sandbox,panel,labcheck,leak,load] [--leak <config>]
//   e.g. node build/tools/review/audit.mjs chai-tray        (Cook games for now: the lab page is lab.html?mode=cook&game=<game>)
import { spawnSync } from "node:child_process";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { args, ROOT } from "./lib/common.mjs";

const a = args();
const game = a.pos[0];
if (!game || a.has("help")) {
  console.log("node build/tools/review/audit.mjs <game> [--only sandbox,panel,labcheck,leak,load] [--leak <config>]");
  process.exit(game ? 0 : 1);
}
const only = a.val("only") ? String(a.val("only")).split(",") : null;
const want = (k) => !only || only.includes(k);
const stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "");
const day = new Date().toISOString().slice(0, 10);
const logDir = join(ROOT, "build", "screenshots", "audit", `${game}-${stamp}`);
mkdirSync(logDir, { recursive: true });
const leakCfg = a.val("leak") || (existsSync(join(ROOT, "build/tools/review/leak-configs", `${game}.json`)) ? game : "cook");

const steps = [];
const run = (key, what, cmd, argv, timeoutMin) => {
  if (!want(key)) return;
  console.log(`\n== ${key}: ${what}\n   node ${[cmd, ...argv].join(" ")}`);
  const t0 = Date.now();
  const r = spawnSync("node", [join(ROOT, cmd), ...argv], { cwd: ROOT, encoding: "utf8", timeout: timeoutMin * 60000, maxBuffer: 64 << 20 });
  const outText = `${r.stdout || ""}${r.stderr || ""}`;
  const log = join(logDir, `${key}.log`);
  writeFileSync(log, outText);
  const tail = outText.trim().split("\n").filter(Boolean).slice(-3).join(" / ").slice(0, 400);
  const ok = r.status === 0;
  steps.push({ key, what, ok, min: ((Date.now() - t0) / 60000).toFixed(1), tail, log: log.slice(ROOT.length + 1) });
  console.log(`   ${ok ? "pass" : "FAIL"} (${steps[steps.length - 1].min} min): ${tail}`);
};

run("sandbox", "every level and path at the four sizes: the contract checks and the screen lint", "build/sandbox/run.mjs", ["--touched", `cook:${game}`, "--parallel", "2", "--no-sheets", "--run-id", `audit-${game}-${stamp}`], 60);
run("panel", "the side panel's measures and the order film", "build/tools/review/panelcheck.mjs", ["--game", game, "--json", join(logDir, "panel.json")], 40);
run("labcheck", "the lab page at L1-L4, played to the order: errors, spills, speaker gaps", "build/tools/review/labcheck.mjs", ["lab.html", ...[1, 2, 3, 4].map((l) => `mode=cook&game=${game}&level=${l}&nonav=1&seed=7&speed=3`), "--until", ".wc14-pop", "--play", "--out", join(logDir, "labcheck")], 20);
run("leak", "a bot that knows no Kutchi can't win", "build/tools/review/leak.mjs", [leakCfg], 20);
run("load", "time to the first play tap against the baseline", "build/tools/review/loadtime.mjs", ["--games", game], 15);

const fails = steps.filter((s) => !s.ok);
const md = [
  `# Audit: ${game} (${day})`,
  "",
  `\`node build/tools/review/audit.mjs ${game}\`: ${fails.length ? `**${fails.length} of ${steps.length} steps fail**` : `all ${steps.length} steps pass`}. Logs: \`${logDir.slice(ROOT.length + 1)}/\`.`,
  "The judge looks at what this can't measure (the light's look, the motion, the art); the standard is `docs/process/prototype-to-game.md`.",
  "",
  "| Step | What it checks | Result | Minutes | Last lines |",
  "|---|---|---|---|---|",
  ...steps.map((s) => `| ${s.key} | ${s.what} | ${s.ok ? "pass" : "**FAIL**"} | ${s.min} | ${s.tail.replace(/\|/g, "/")} |`),
  "",
];
const report = join(ROOT, "build", "reports", `audit-${game}-${day}.md`);
writeFileSync(report, md.join("\n"));
console.log(`\n${report.slice(ROOT.length + 1)}: ${fails.length ? `${fails.length} step(s) fail` : "all pass"}`);
process.exit(fails.length ? 1 : 0);

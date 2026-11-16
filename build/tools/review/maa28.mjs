#!/usr/bin/env node
// MAA-28's check (run16 fix-chai): "a person's item cards never change at well done" (maani L4: the bajr card, ticked last, slid
// out of a two-card phone row at well done, so the row showed another card than the one played). Plays cook:maani-line at the
// levels and sizes asked through the sandbox with lib/maa28-hook.js on every page, then reads its lines from each page's errors:
//   red   an item card's word or picture changed, or 1.5 s after the well done a person's row still shows item cards
//   green every page reached the well done, judged, with no fail
// Exit 0 green, 1 red, 2 a page never reached its well done (no verdict).
//   node build/tools/review/maa28.mjs [--levels 4] [--sizes 740x320,930x430,1280x665,1920x1080] [--game maani-line] [--paths speed1,fair] [--run-id id] [--root <tree>]
// Under the browser lock, on a port of one's own: COOK_TEST_PORT=88xx flock -w 3600 /tmp/njg-browser-all.lock node build/tools/review/maa28.mjs
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const val = (f, d) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : d; };
// --root <tree>: play another checkout (a worktree of the code before a fix) with this hook
const ROOT = val("--root", join(HERE, "..", "..", ".."));
const game = val("--game", "maani-line");
const levels = String(val("--levels", "4")).split(",");
const sizes = val("--sizes", "740x320,930x430,1280x665,1920x1080");
const runId = val("--run-id", `maa28-${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}`);
// --paths speed1,fair: the sandbox path (speed1: a child's pace, the side-by-side run Fable judged, its seed with it; fair: fast)
const paths = String(val("--paths", "speed1")).split(",");
const flows = levels.flatMap((l) => paths.map((p) => `cook:${game}${+l > 1 ? `@L${l}` : ""}${p === "fair" ? "" : "#" + p}`)).join(",");

const r = spawnSync(process.execPath, [join(ROOT, "build", "sandbox", "run.mjs"), "--flow", flows, "--sizes", sizes, "--parallel", "2", "--no-sheets", "--run-id", runId], {
  cwd: ROOT, stdio: ["ignore", "inherit", "inherit"], env: { ...process.env, NJG_INIT: join(HERE, "lib", "maa28-hook.js"), NJG_NO_LIGHTSHOT: "1" },
});
const dir = join(ROOT, "build", "screenshots", "sandbox", runId, "data");
if (!existsSync(dir)) { console.log(`no run data (${dir}); run.mjs exit ${r.status}`); process.exit(2); }
let red = 0, none = 0;
for (const f of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  const d = JSON.parse(readFileSync(join(dir, f), "utf8"));
  const lines = (d.errors || []).map((e) => String(e).replace(/^.*?console: /, "")).filter((e) => /^MAA-28 /.test(e));
  const fails = lines.filter((e) => / FAIL /.test(e));
  const seen = lines.some((e) => / seen /.test(e));
  const verdict = fails.length ? "RED" : seen ? "green" : "NO VERDICT";
  if (fails.length) red++; else if (!seen) none++;
  console.log(`${verdict.padEnd(10)} ${d.flow} @ ${d.size}${d.complete ? "" : " (stopped: " + (d.stops || [])[0] + ")"}`);
  for (const e of lines) console.log(`    ${e}`);
}
console.log(red ? `MAA-28 red on ${red} page(s)` : none ? `MAA-28: ${none} page(s) never reached the well done` : "MAA-28 green");
process.exit(red ? 1 : none ? 2 : 0);

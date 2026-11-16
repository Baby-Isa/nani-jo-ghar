#!/usr/bin/env node
// MAA-20's check (run16 fix-chai): maani's roll demo moves the rolling pin up and down under its one finger (Zafar, 8 Nov). Plays
// cook:maani-line (a new player) through the sandbox with lib/maa20-hook.js on every page and reads its "MAA-20 demo" lines:
//   green every page showed the roll demo, and in each showing whose finger travelled 30 px or more the pin travelled at least
//         half as far
//   red   a showing whose finger travelled and whose pin stayed (under half the finger's travel)
// Exit 0 green, 1 red, 2 no roll demo seen. The pick between the finger and a pulsing circle (the lab's pair) stays his.
//   node build/tools/review/maa20.mjs [--levels 1] [--paths fair] [--sizes 740x320,1280x665] [--run-id id] [--root <tree>]
// Under the browser lock, on a port of one's own: COOK_TEST_PORT=88xx flock -w 3600 /tmp/njg-browser-all.lock node build/tools/review/maa20.mjs
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const val = (f, d) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : d; };
const ROOT = val("--root", join(HERE, "..", "..", ".."));
const levels = String(val("--levels", "1")).split(",");
const paths = String(val("--paths", "fair")).split(",");
const sizes = val("--sizes", "740x320,1280x665");
const runId = val("--run-id", `maa20-${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}`);
const flows = levels.flatMap((l) => paths.map((p) => `cook:maani-line${+l > 1 ? `@L${l}` : ""}${p === "fair" ? "" : "#" + p}`)).join(",");
const r = spawnSync(process.execPath, [join(ROOT, "build", "sandbox", "run.mjs"), "--flow", flows, "--sizes", sizes, "--parallel", "2", "--no-sheets", "--run-id", runId], {
  cwd: ROOT, stdio: ["ignore", "inherit", "inherit"], env: { ...process.env, NJG_INIT: join(HERE, "lib", "maa20-hook.js"), NJG_NO_LIGHTSHOT: "1" },
});
const dir = join(ROOT, "build", "screenshots", "sandbox", runId, "data");
if (!existsSync(dir)) { console.log(`no run data (${dir}); run.mjs exit ${r.status}`); process.exit(2); }
let red = 0, none = 0;
for (const f of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  const d = JSON.parse(readFileSync(join(dir, f), "utf8"));
  const demos = (d.errors || []).map((e) => String(e).replace(/^.*?console: /, "")).filter((e) => /^MAA-20 demo/.test(e));
  const moves = demos.map((e) => { const m = e.match(/finger (\d+) px, pin (\d+) px/); return m ? { f: +m[1], p: +m[2] } : null; }).filter((x) => x && x.f >= 30);
  const bad = moves.filter((x) => x.p < x.f * 0.5);
  const v = bad.length ? "RED" : moves.length ? "green" : "NO DEMO";
  if (bad.length) red++; else if (!moves.length) none++;
  console.log(`${v.padEnd(8)} ${d.flow} @ ${d.size}${d.complete ? "" : " (stopped)"}`);
  for (const e of demos) console.log(`    ${e}`);
}
console.log(red ? `MAA-20 red on ${red} page(s)` : none ? `MAA-20: ${none} page(s) showed no roll demo` : "MAA-20 green");
process.exit(red ? 1 : none ? 2 : 0);

#!/usr/bin/env node
// The real bad runs (s19-checks-1; build/reports/s19-checks-review.md section 5, change 4: "real bad runs as the test"): copies a played
// run's pages into this library, small: each page's record (its timeline: what the checks read) gzipped, and each light's two pictures
// (lib/lightshot.mjs), never whole films. It then judges them as the contract does and writes expect.json: every check each page
// is red on today, with why. build/sandbox/badruns.test.mjs fails if any of those stops going red (a check loosened too far).
//   node build/sandbox/fixtures/bad-runs/make.mjs --run <run id> --commit <sha> [--good] [--name "<flow>@<size>=<ROW> <flaw>" ...]
//     [--tag <tag>] (the pages are kept as <tag>-<flow>@<size>, beside another commit's of the same flow) [--only <flow>,...]
// A bad run is played on the old code with today's sandbox: NJG_GAME_ROOT=<a checkout of the old commit> NJG_KEEP_LIGHTS=1
// node build/sandbox/run.mjs --contract --keyframes --flow ... (lib/env.mjs serves that commit's game; see README.md).
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, cpSync, rmSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { gzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { analyse } from "../../lib/contract.mjs";
import { judgeDirs } from "../../lib/lightjudge.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..", "..");
export const slug = (s) => String(s).replace(/[^\w@-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
export const pageName = (r) => `${slug(r.flow)}@${r.size}`;

/** Judge a page as the contract does, its lights from their folders: -> {red: {check: [measured...]}} */
export function judgePage(r, lightRoot) {
  const dirs = (r.lights || []).map((l) => join(lightRoot, l.dir));
  const v = dirs.length ? judgeDirs(dirs, { rejudge: true }) : {};
  (r.lights || []).forEach((l) => (l.verdict = v[join(lightRoot, l.dir)]));
  const red = {};
  for (const b of analyse(r, { root: ROOT })) (red[b.check] = red[b.check] || []).push(String(b.measured));
  return red;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const argv = process.argv.slice(2);
  const val = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };
  const run = val("--run"), commit = val("--commit"), tag = val("--tag"), only = val("--only") ? val("--only").split(",") : null;
  if (!run || !commit) { console.error("make: --run <run id> --commit <sha>"); process.exit(2); }
  const names = {};
  argv.forEach((a, i) => { if (a === "--name") { const [k, ...w] = argv[i + 1].split("="); names[k] = w.join("="); } });
  const runDir = join(ROOT, "build/screenshots/sandbox", run);
  const expFile = join(HERE, "expect.json");
  const exp = existsSync(expFile) ? JSON.parse(readFileSync(expFile, "utf8")) : { pages: {} };
  for (const f of readdirSync(join(runDir, "data"))) {
    const r = JSON.parse(readFileSync(join(runDir, "data", f), "utf8"));
    if (r.size === "static" || (only && !only.includes(r.flow))) continue;
    const name = (tag ? `${tag}-` : "") + pageName(r);
    const pd = join(HERE, "pages", name);
    rmSync(pd, { recursive: true, force: true });
    mkdirSync(pd, { recursive: true });
    // each light's pictures and record (not its verdict or mark: the test judges them afresh)
    // (a light whose pictures a run deleted after it passed is left out: only lights with their pictures are fixtures)
    r.lights = (r.lights || []).filter((l) => existsSync(join(ROOT, l.dir, "with.jpg")) && existsSync(join(ROOT, l.dir, "under.jpg")));
    for (const l of r.lights || []) {
      const src = join(ROOT, l.dir), dst = join(pd, "lights", String(l.n).padStart(2, "0"));
      mkdirSync(dst, { recursive: true });
      for (const x of ["before.jpg", "with.jpg", "with2.jpg", "under.jpg", "light.json"]) if (existsSync(join(src, x))) cpSync(join(src, x), join(dst, x));
      l.dir = relative(pd, dst);
      delete l.verdict;
    }
    // the moments contract-113 broke at, for the eye (the run's own shot of each)
    const keep = { flow: r.flow, size: r.size, t0: r.t0, ms: r.ms, states: (r.states || []).map((s) => ({ name: s.name, at: s.at, shot: s.shot })), cshots: r.cshots || [], timeline: r.timeline, lights: r.lights || [], complete: r.complete };
    writeFileSync(join(pd, "page.json.gz"), gzipSync(JSON.stringify(keep)));
    const judged = JSON.parse(JSON.stringify(keep));
    const red = judgePage(judged, pd);
    const breaks = analyse(judged, { root: ROOT });
    const shots = new Set(breaks.filter((x) => x.check === "contract-113" && x.shot).map((x) => x.shot));
    const fdir = join(runDir, String(r.flow).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), r.size);
    for (const s of shots) if (existsSync(join(fdir, s))) cpSync(join(fdir, s), join(pd, s));
    exp.pages[name] = { flow: r.flow, size: r.size, commit, kind: argv.includes("--good") ? "good" : "bad", name: names[`${r.flow}@${r.size}`] || names[r.flow] || "", red: Object.fromEntries(Object.entries(red).map(([k, v]) => [k, v.slice(0, 4)])), shots: [...shots] };
    console.log(`${name}: ${Object.keys(red).join(", ") || "green"}`);
  }
  writeFileSync(expFile, JSON.stringify(exp, null, 1) + "\n");
}

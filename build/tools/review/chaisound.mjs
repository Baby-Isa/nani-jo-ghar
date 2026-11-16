#!/usr/bin/env node
// Chai's knob, flame and next-pan check (run16 fix-chai): plays cook:chai-tray (fresh, fair) through the sandbox with
// lib/chai-sound-hook.js on every page, then reads each page's timeline (the hook's marks beside the sandbox's real plays):
//   CHAI-113 every knob turned on from off (a Cook.sfx.flame call) is heard: the knob's file (sfx/file:knob-a) starts within 0.4 s
//            and the flame's (sfx/file:flame-b) within 0.9 s, even while Nani speaks
//   CHAI-100 no knob sound the child did not make: every Cook.sfx.knob call comes within 0.6 s of a tap (the fire going off after
//            the last pour is silent; the fair path has no boil-over)
//   CHAI-97  each word moment's pours play the recorded pour file, never the made-up synthesized pour (a cold load: a fresh page)
//   CHAI-99  the next pan's light (the life event "next-pan") comes at least 0.8 s after the first pour's end (its last frame); the
//            hook holds the player's touches 3 s after that pour, as a child taking it in (a player that moves on at once gets no
//            light, rightly). Only where there is a next pan (L2-L4) and the light is still first-time
// Exit 0 green, 1 red, 2 nothing to judge.
//   node build/tools/review/chaisound.mjs [--levels 1,2,3,4] [--sizes 740x320,1280x665] [--rows CHAI-99,CHAI-100,CHAI-113] [--paths speed1]
//                                         [--run-id id] [--root <tree>] [--from-run id]
// Under the browser lock, on a port of one's own: COOK_TEST_PORT=88xx flock -w 3600 /tmp/njg-browser-all.lock node build/tools/review/chaisound.mjs
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const val = (f, d) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : d; };
const ROOT = val("--root", join(HERE, "..", "..", ".."));
const levels = String(val("--levels", "1,2,3,4")).split(",");
const sizes = val("--sizes", "740x320,1280x665");
const rows = String(val("--rows", "CHAI-97,CHAI-99,CHAI-100,CHAI-113")).split(",");
const fromRun = val("--from-run");
const runId = fromRun || val("--run-id", `chaisound-${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}`);
// --paths speed1 (default: a child's pace, so the game's own waits are real: fast play divides them by Cook.speed) or fair
const paths = String(val("--paths", "speed1")).split(",");
const flows = levels.flatMap((l) => paths.map((p) => `cook:chai-tray${+l > 1 ? `@L${l}` : ""}${p === "fair" ? "" : "#" + p}`)).join(",");

if (!fromRun) {
  const r = spawnSync(process.execPath, [join(ROOT, "build", "sandbox", "run.mjs"), "--flow", flows, "--sizes", sizes, "--parallel", "2", "--no-sheets", "--run-id", runId], {
    cwd: ROOT, stdio: ["ignore", "inherit", "inherit"], env: { ...process.env, NJG_INIT: join(HERE, "lib", "chai-sound-hook.js"), NJG_NO_LIGHTSHOT: "1" },
  });
  if (r.status && r.status !== 1) console.log(`run.mjs exit ${r.status}`);
}
const dir = join(ROOT, "build", "screenshots", "sandbox", runId, "data");
if (!existsSync(dir)) { console.log(`no run data (${dir})`); process.exit(2); }

const verdicts = [];
const say = (row, page, ok, what) => { verdicts.push({ row, page, ok }); console.log(`${ok ? "green" : "RED  "} ${row.padEnd(8)} ${page}: ${what}`); };
for (const f of readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
  const d = JSON.parse(readFileSync(join(dir, f), "utf8"));
  const page = `${d.flow} @ ${d.size}${d.complete ? "" : " (stopped)"}`;
  const tl = (d.timeline || []).filter((e) => e.page === "cook.html" || /cook/.test(e.page || ""));
  const marks = (k) => tl.filter((e) => e.k === "chai-mark" && e.m === k).map((e) => e.t);
  const plays = (stem) => tl.filter((e) => e.type === "play" && e.via === "sfx" && e.url === `sfx/file:${stem}`).map((e) => e.t);
  const taps = marks("tap"), knobCalls = marks("knob-call"), flameCalls = marks("flame-call"), pours = marks("pour");
  const knobPlays = plays("knob-a"), flamePlays = plays("flame-b");
  if (!tl.some((e) => e.k === "chai-mark")) { console.log(`NO HOOK ${page}`); continue; }
  const near = (list, a, b) => list.some((t) => t >= a && t <= b);
  if (rows.includes("CHAI-113")) {
    const miss = flameCalls.filter((t) => !near(knobPlays, t - 50, t + 400) || !near(flamePlays, t - 50, t + 900));
    if (flameCalls.length) say("CHAI-113", page, !miss.length, `${flameCalls.length} knob(s) turned on, ${miss.length} not heard whole (knob plays ${knobPlays.length}, flame plays ${flamePlays.length})`);
    else console.log(`-     CHAI-113 ${page}: no knob turned on`);
  }
  if (rows.includes("CHAI-100")) {
    const stray = knobCalls.filter((t) => !near(taps, t - 600, t + 20));
    say("CHAI-100", page, !stray.length, `${knobCalls.length} knob sound(s) asked, ${stray.length} with no tap in the 0.6 s before${stray.length ? ` (${stray.map((t) => ((t - d.t0) / 1000).toFixed(1) + " s").join(", ")} in)` : ""}`);
  }
  if (rows.includes("CHAI-97")) {
    // each word moment (life "word-moment"), 15 s from its start: its pours are the recorded pour file, never the made-up synthesized
    // one (a buffer the page made itself: "sfx/noise:" or "sfx/osc:")
    const wms = tl.filter((e) => e.k === "life" && e.what === "word-moment").map((e) => e.at || e.t);
    for (const t of wms) {
      const inW = tl.filter((e) => e.type === "play" && e.via === "sfx" && e.t >= t && e.t <= t + 15000);
      const files = inW.filter((e) => /^sfx\/file:pour/.test(e.url));
      const made = inW.filter((e) => /^sfx\/(noise|osc):/.test(e.url));
      say("CHAI-97", page, files.length >= 1 && !made.length, `word moment at ${((t - d.t0) / 1000).toFixed(1)} s: ${files.length} pour file play(s) [${[...new Set(files.map((e) => e.url))].join(", ")}], ${made.length} made-up sound(s) [${[...new Set(made.map((e) => e.url))].join(", ")}]`);
    }
    if (!wms.length) console.log(`-     CHAI-97  ${page}: no word moment`);
  }
  if (rows.includes("CHAI-99")) {
    // the first pour's end: its last frame before a 400 ms gap; the next pan's light: the first "next-pan" life event after it
    const ends = tl.filter((e) => e.k === "chai-mark" && e.m === "pour-end").map((e) => e.at);
    const life = tl.filter((e) => e.k === "life" && /next-pan/.test(JSON.stringify(e))).map((e) => e.at || e.t);
    const end0 = ends[0];
    const lit = end0 != null ? life.find((t) => t > end0 - 200) : null;
    if (end0 == null || lit == null) console.log(`-     CHAI-99  ${page}: ${end0 == null ? "no pour" : "no next-pan light"} (pours end ${ends.length}, next-pan ${life.length})`);
    else say("CHAI-99", page, lit - end0 >= 800 - 60, `the next pan's light ${lit - end0} ms after the first pour's end`);
  }
}
const red = verdicts.filter((v) => !v.ok);
for (const row of rows) {
  const v = verdicts.filter((x) => x.row === row);
  console.log(`${row}: ${!v.length ? "nothing judged" : v.some((x) => !x.ok) ? `RED on ${v.filter((x) => !x.ok).length} of ${v.length}` : `green on ${v.length}`}`);
}
process.exit(red.length ? 1 : verdicts.length ? 0 : 2);

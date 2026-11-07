#!/usr/bin/env node
// Chai's frozen run (Sprint 17; Fable's review of the roll-out plan, 7 Nov: "freeze a golden run ... the guard everything after is
// measured against"). Sprint 18 moves chai's code into the kits piece by piece; after every switch this says whether chai still
// behaves as it did when Zafar signed it off (7 Nov, live 20261107T120301Z).
//
//   node build/tools/review/frozen.mjs --freeze --runs <run>,<run> [--game chai-tray]
//        reads finished sandbox runs (build/screenshots/sandbox/<run>/) and writes the fingerprint build/frozen/<game>/frozen.json,
//        the films (<run>/films/*.webm, NJG_VIDEO) to build/frozen/<game>/films/, the contract reports, and ear.md (the ear items
//        from the sound logs: the boil loop, the clicks, the pour, as judge rows)
//   node build/tools/review/frozen.mjs --diff [--run <run>] [--game chai-tray] [--quick | --full]
//        without --run: plays chai now (--quick, the default: L1-L4 and the paths at 1280x665 and 740x320, about 10 minutes;
//        --full: every path at the four sizes, about 20) under /tmp/njg-browser-all.lock, then compares each page with the
//        frozen one: reached its end, page errors, contract breaks, the states it passed through, the game's own notes (Lifecycle),
//        the sounds it played and the timing of chai's moments. Writes build/reports/frozen-diff-<game>-<stamp>.md; exit 1 on
//        any change. A film is made (NJG_VIDEO) only of the pages that changed, to show the judge.
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { args, ROOT, RUNS } from "./lib/common.mjs";

const a = args();
const game = a.val("game") || "chai-tray";
const OUT = join(ROOT, "build", "frozen", game);
const SIZES_QUICK = ["1280x665", "740x320"];

// noisy notes: counted, not compared exactly (a poke per sample, the simmer's ticks, help rungs depend on the machine's speed)
const NOISY = new Set(["poke", "chai-simmer", "rung", "glow", "ghost", "timed-hold"]);
// chai's moments whose timing the ear and the eye care about, from the stage's start (ms)
const MOMENTS = ["request", "order-landed", "chai-add", "chai-boil", "chai-slow", "chai-down", "step-call", "card-fold", "results"];
// the ear items (Zafar's: the boil loop, the clicks, the pour)
const EAR = {
  boil: /simmer|boil|bubble/,
  clicks: /\/(click|knob|tap)$|file:knob/,
  pour: /pour/,
};

const soundKey = (e) => (e.url ? e.url.replace(/^assets\/audio\//, "") : e.via === "speechSynthesis" ? `tts:${String(e.text || "").toLowerCase()}` : String(e.url || e.text || e.via || "?"));
const pageKey = (r) => `${r.flow}@${r.size}`;

export function fingerprint(r) {
  const tl = r.timeline || [];
  const t0 = (tl.find((e) => e.k === "life" && e.what === "stage-start") || tl[0] || { t: 0 }).t;
  const life = tl.filter((e) => e.type === "c" && e.k === "life");
  const seq = life.map((e) => e.what).filter((w) => !NOISY.has(w));
  const counts = {};
  for (const e of life) counts[e.what] = (counts[e.what] || 0) + 1;
  const sounds = {};
  for (const e of tl.filter((e) => e.type === "play")) { const k = soundKey(e); sounds[k] = (sounds[k] || 0) + 1; }
  const moments = {};
  for (const m of MOMENTS) moments[m] = life.filter((e) => e.what === m).map((e) => e.t - t0);
  const ear = {};
  for (const [k, re] of Object.entries(EAR)) ear[k] = tl.filter((e) => e.type === "play" && re.test(soundKey(e))).map((e) => ({ s: soundKey(e), at: e.t - t0, dur: e.dur == null ? null : e.dur }));
  return {
    complete: !!r.complete,
    stops: r.stops || [],
    errors: [...new Set(r.errors || [])],
    states: (r.states || []).map((s) => s.name),
    seq, counts, sounds, moments, ear,
    findings: r.findingCount || 0,
  };
}

function readRun(id) {
  const dir = id.startsWith("/") ? id : join(RUNS, id);
  if (!existsSync(join(dir, "data"))) throw new Error(`no run at ${dir}`);
  const pages = {};
  for (const f of readdirSync(join(dir, "data")).filter((f) => f.endsWith(".json"))) {
    const r = JSON.parse(readFileSync(join(dir, "data", f), "utf8"));
    if (!r.flow || r.size === "static") continue;
    pages[pageKey(r)] = fingerprint(r);
  }
  const breaks = existsSync(join(dir, "contract.json")) ? JSON.parse(readFileSync(join(dir, "contract.json"), "utf8")) : [];
  return { dir, pages, breaks };
}
const breakKey = (b) => `${b.check} ${b.flow}@${b.size}`;

if (a.has("freeze")) {
  const runs = String(a.val("runs") || "").split(",").filter(Boolean);
  if (!runs.length) { console.log("--freeze needs --runs <run>,<run>"); process.exit(1); }
  mkdirSync(join(OUT, "films"), { recursive: true });
  const frozen = { game, frozenAt: new Date().toISOString(), commit: spawnSync("git", ["rev-parse", "HEAD"], { cwd: ROOT, encoding: "utf8" }).stdout.trim(), runs, pages: {}, breaks: [] };
  const ear = [];
  for (const id of runs) {
    const run = readRun(id);
    Object.assign(frozen.pages, run.pages);
    frozen.breaks.push(...run.breaks.map(breakKey));
    for (const f of ["contract.md", "summary.md"]) if (existsSync(join(run.dir, f))) copyFileSync(join(run.dir, f), join(OUT, `${id.split("/").pop()}-${f}`));
    if (existsSync(join(run.dir, "films"))) for (const f of readdirSync(join(run.dir, "films"))) copyFileSync(join(run.dir, "films", f), join(OUT, "films", f));
  }
  for (const [k, p] of Object.entries(frozen.pages)) if (/1280x665/.test(k)) ear.push([k, p]);
  writeFileSync(join(OUT, "frozen.json"), JSON.stringify(frozen, null, 1));
  const fmt = (xs) => xs.length ? xs.map((x) => `${(x.at / 1000).toFixed(1)} s ${x.s.split("/").pop()}${x.dur ? ` (${Number(x.dur).toFixed(1)} s)` : ""}`).join(", ") : "none";
  writeFileSync(join(OUT, "ear.md"), [
    `# ${game}: the ear items, frozen ${frozen.frozenAt.slice(0, 16)} (commit ${frozen.commit.slice(0, 8)})`,
    "",
    "Zafar's ear items (the boil loop, the clicks, the pour) as judge rows: what each page played and when, from the stage's start, by",
    "the sandbox's sound log. A judge listens to the film beside this (films/) and passes each row; after a Sprint 18 switch,",
    "`frozen.mjs --diff` flags any page whose sounds or their timing changed.",
    "",
    "| Page | The boil loop | The clicks | The pour | Judge |",
    "|---|---|---|---|---|",
    ...ear.map(([k, p]) => `| ${k} | ${fmt(p.ear.boil)} | ${fmt(p.ear.clicks)} | ${fmt(p.ear.pour)} | to judge |`),
    "",
    "## Proof",
    "",
    `The runs: ${runs.map((r) => `\`build/screenshots/sandbox/${r}/\``).join(", ")}; the fingerprint \`build/frozen/${game}/frozen.json\`.`,
    "",
  ].join("\n"));
  console.log(`frozen ${Object.keys(frozen.pages).length} pages, ${frozen.breaks.length} contract break(s) known, films: ${readdirSync(join(OUT, "films")).length} -> ${OUT.slice(ROOT.length + 1)}/`);
  process.exit(0);
}

if (a.has("diff")) {
  const frozenFile = join(OUT, "frozen.json");
  if (!existsSync(frozenFile)) { console.log(`no frozen run for ${game}: ${frozenFile}`); process.exit(1); }
  const frozen = JSON.parse(readFileSync(frozenFile, "utf8"));
  const stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "");
  let runId = a.val("run");
  const flowsOf = (keys) => [...new Set(keys.map((k) => k.split("@").slice(0, -1).join("@")))];
  const frozenKeys = Object.keys(frozen.pages);
  if (!runId) {
    runId = `frozen-diff-${game}-${stamp}`;
    const sizes = a.has("full") ? [...new Set(frozenKeys.map((k) => k.split("@").pop()))] : SIZES_QUICK;
    const flows = flowsOf(frozenKeys);
    console.log(`playing ${flows.length} flows at ${sizes.join(", ")} (run ${runId}) ...`);
    const r = spawnSync("flock", ["-w", "3600", "/tmp/njg-browser-all.lock", "timeout", "3600", process.execPath, join(ROOT, "build/sandbox/run.mjs"), "--flow", flows.join(","), "--sizes", sizes.join(","), "--contract", "--parallel", "2", "--no-sheets", "--run-id", runId], { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, COOK_TEST_PORT: process.env.COOK_TEST_PORT || "8819" }, maxBuffer: 64 << 20 });
    if (r.status !== 0 && r.status !== 1) console.log(`(the run exited ${r.status}: ${String(r.stderr || "").slice(-300)})`);
  }
  const now = readRun(runId);
  const diffs = [];
  const add = (page, what, before, after) => diffs.push({ page, what, before, after });
  const nowBreaks = new Set(now.breaks.map(breakKey));
  for (const b of nowBreaks) if (!frozen.breaks.includes(b)) add(b.split(" ")[1], "a new contract break", "-", b.split(" ")[0]);
  for (const b of frozen.breaks) if (!nowBreaks.has(b) && now.pages[b.split(" ")[1]]) add(b.split(" ")[1], "a contract break gone", b.split(" ")[0], "-");
  for (const [k, p] of Object.entries(now.pages)) {
    const f = frozen.pages[k];
    if (!f) continue;
    if (f.complete !== p.complete) add(k, "reached its end", f.complete, p.complete);
    for (const e of p.errors) if (!f.errors.includes(e)) add(k, "a new page error", "-", e.slice(0, 160));
    if (f.states.join(",") !== p.states.join(",")) add(k, "the states it passed through", f.states.join(" > "), p.states.join(" > "));
    if (f.seq.join(",") !== p.seq.join(",")) {
      const i = f.seq.findIndex((w, j) => p.seq[j] !== w);
      add(k, "the game's notes, in order (first difference)", f.seq.slice(Math.max(0, i - 2), i + 3).join(" > "), p.seq.slice(Math.max(0, i - 2), i + 3).join(" > "));
    }
    const sk = new Set([...Object.keys(f.sounds), ...Object.keys(p.sounds)]);
    for (const s of sk) if ((f.sounds[s] || 0) !== (p.sounds[s] || 0) && !/simmer|loop/.test(s)) add(k, `the sound ${s}`, `${f.sounds[s] || 0}x`, `${p.sounds[s] || 0}x`);
    for (const m of MOMENTS) {
      const x = f.moments[m] || [], y = p.moments[m] || [];
      if (x.length !== y.length) { add(k, `how often ${m} happens`, x.length, y.length); continue; }
      x.forEach((t, i) => { const tol = Math.max(400, Math.abs(t) * 0.15); if (Math.abs(y[i] - t) > tol) add(k, `when ${m} happens (#${i + 1})`, `${(t / 1000).toFixed(2)} s`, `${(y[i] / 1000).toFixed(2)} s`); });
    }
  }
  const missing = frozenKeys.filter((k) => !now.pages[k] && (a.has("full") || SIZES_QUICK.includes(k.split("@").pop())) && !a.val("run"));
  for (const k of missing) add(k, "the page did not play", "played", "missing");
  const changed = [...new Set(diffs.map((d) => d.page))];
  const report = join(ROOT, "build", "reports", `frozen-diff-${game}-${stamp}.md`);
  writeFileSync(report, [
    `# ${game} against its frozen run (${stamp})`,
    "",
    `\`node build/tools/review/frozen.mjs --diff\`: run \`${runId}\` against \`build/frozen/${game}/frozen.json\` (frozen ${frozen.frozenAt.slice(0, 16)}, commit ${frozen.commit.slice(0, 8)}). ${diffs.length ? `**${diffs.length} change(s) on ${changed.length} page(s)**` : "**No change**"} over ${Object.keys(now.pages).filter((k) => frozen.pages[k]).length} pages.`,
    "",
    ...(diffs.length ? ["| Page | What changed | Frozen | Now |", "|---|---|---|---|", ...diffs.map((d) => `| ${d.page} | ${d.what} | ${String(d.before).replace(/\|/g, "/")} | ${String(d.after).replace(/\|/g, "/")} |`), "",
      `A changed page is filmed for the judge: \`NJG_VIDEO=<dir> node build/sandbox/run.mjs --flow <flow> --sizes <size> --run-id <id>\` (films in the run's films/).`] : []),
    "",
  ].join("\n"));
  console.log(`${report.slice(ROOT.length + 1)}: ${diffs.length ? `${diffs.length} change(s) on ${changed.length} page(s)` : "no change"}`);
  for (const d of diffs.slice(0, 30)) console.log(`  ${d.page}: ${d.what}: ${d.before} -> ${d.after}`);
  process.exit(diffs.length ? 1 : 0);
}

console.log("node build/tools/review/frozen.mjs --freeze --runs <run>,<run> [--game chai-tray] | --diff [--run <run>] [--quick | --full] [--game chai-tray]");
process.exit(1);

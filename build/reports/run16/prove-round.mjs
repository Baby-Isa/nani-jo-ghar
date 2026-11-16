#!/usr/bin/env node
// Run 16, the prove session: one round over the run16 branches (BRIEF.md "prove").
// For each branch with a new build/reports/run16/<name>-ready.txt (new = its commit and list not yet proven here):
//   a fresh worktree at that commit; each ready row's check run twice (evidence specs via evidence.mjs --run, node tests via
//   node --test); check-change.mjs --base 48003532 --games <its games> --rows <its spec rows> once.
// A row passing both times with check-change exit 0 is ready; passing once is unproven (flaky); failing is bounced.
// An eye row (no machine verdict) is ready only with a judge PASS from origin/run16/judge's judge.json; else unproven.
// Writes build/reports/run16/prove.json (+ prove-state.json, prove/<branch>-<sha>.log). Fixes nothing.
// Usage: node build/reports/run16/prove-round.mjs [--only fix-daar] [--dry] [--no-change]
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync, appendFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const ROOT = execFileSync("git", ["rev-parse", "--show-toplevel"]).toString().trim();
const BASE = "48003532";
const OUT = join(ROOT, "build/reports/run16");
const LOGS = join(OUT, "prove");
const WT = process.env.PROVE_WT || "/tmp/claude-0/-home-user-nani-jo-ghar/19c4bf5a-5dcd-5534-942f-c5fecea30fea/scratchpad/wt";
const PORT = process.env.COOK_TEST_PORT || "8871";
const args = process.argv.slice(2);
const only = args.includes("--only") ? args[args.indexOf("--only") + 1].split(",") : null;
const DRY = args.includes("--dry"), NOCHANGE = args.includes("--no-change");
const BUILDERS = ["fix-kit", "fix-daar", "fix-samosa", "fix-chai", "fix-stove"];
// results "game" -> run.mjs --list cook games
const GAME = { sekelo: "mishkaki-grill", mishkaki: "mishkaki-grill", kit: null, other: null };
const VALID = new Set(["assemble", "baking", "boil", "chaat", "chai", "chai-tray", "chop", "corn", "count", "daal", "daar", "eggs", "fetch", "fill", "flip", "fry", "grill", "maani", "maani-line", "mishkaki", "mishkaki-grill", "pour", "roll", "roll-tawa", "samosa", "stir", "tadka", "thread"]);

mkdirSync(LOGS, { recursive: true });
const git = (...a) => execFileSync("git", a, { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] }).toString();
const show = (ref, p) => { try { return git("show", `${ref}:${p}`); } catch { return null; } };
const now = () => new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC";
const readJson = (p, d) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return d; } };

git("fetch", "-q", "origin", "refs/heads/run16/*:refs/remotes/origin/run16/*");
const statePath = join(OUT, "prove-state.json"), provePath = join(OUT, "prove.json");
const state = readJson(statePath, {});
const prove = readJson(provePath, []);
const judgeRef = "origin/run16/judge";
const judge = (() => { try { return JSON.parse(show(judgeRef, "build/reports/run16/judge.json") || "[]"); } catch { return []; } })();
const judgeOf = (row, branch) => judge.filter((j) => j.row === row && (!j.branch || String(j.branch).includes(branch))).pop();

for (const name of only || BUILDERS) {
  try { git("fetch", "-q", "origin", `refs/heads/run16/${name}:refs/remotes/origin/run16/${name}`); } catch {}
  const ref = `origin/run16/${name}`;
  let sha; try { sha = git("rev-parse", ref).trim(); } catch { console.log(`${name}: no branch yet`); continue; }
  const results = (() => { try { return JSON.parse(show(ref, `build/reports/run16/${name}.json`) || "[]"); } catch { return []; } })();
  // the ready list; until one is posted, the results' built and proven rows (the orchestrator, 06:20)
  let ready = show(ref, `build/reports/run16/${name}-ready.txt`);
  if (!ready) ready = results.filter((r) => /^(built|proven)$/.test(r.status) && r.game !== undefined).map((r) => `${r.row} (${r.status}, from the results file)`).join("\n");
  if (!ready) { console.log(`${name}: nothing built yet (${sha.slice(0, 7)})`); continue; }
  const key = createHash("sha1").update(ready).digest("hex").slice(0, 10);
  const rows = [...new Set(ready.match(/\b[A-Z]{2,5}-\d{1,4}\b/g) || [])];
  const done = state[name] || {};
  // rows already settled on an earlier commit with the same ready list and same results entry are not re-run
  const todo = rows.filter((r) => { const d = done[r]; const res = results.find((x) => x.row === r); return !d || d.readyKey !== key || d.resHash !== hash(res); });
  if (!todo.length) { console.log(`${name}: ready list unchanged (${rows.length} rows, ${sha.slice(0, 7)})`); continue; }
  console.log(`${name}: ${sha.slice(0, 7)}, ${todo.length} row(s) to prove: ${todo.join(", ")}`);
  if (DRY) continue;
  const log = join(LOGS, `${name}-${sha.slice(0, 7)}.log`);
  const L = (s) => { appendFileSync(log, s + "\n"); console.log(s); };
  L(`# ${name} at ${sha} (${now()})\nready list ${key}: ${rows.join(", ")}`);
  const wt = join(WT, `${name}-${sha.slice(0, 7)}`);
  if (!existsSync(wt)) execFileSync("git", ["worktree", "add", "--detach", wt, sha], { cwd: ROOT, stdio: "ignore" });
  const run = (cmd, a, extra = {}) => { const t0 = Date.now(); const r = spawnSync(cmd, a, { cwd: wt, env: { ...process.env, COOK_TEST_PORT: PORT, ...extra }, encoding: "utf8", maxBuffer: 1 << 28, timeout: 90 * 60e3 }); const out = (r.stdout || "") + (r.stderr || ""); appendFileSync(log, `\n$ ${cmd} ${a.join(" ")}  (exit ${r.status}, ${Math.round((Date.now() - t0) / 1000)}s)\n${out.slice(-6000)}\n`); return { code: r.status, out }; };
  const spec = readJson(join(wt, "build/sandbox/data/evidence.json"), {});
  // classify each row's check
  const plan = todo.map((row) => {
    const res = results.filter((x) => x.row === row && /^(built|proven)$/.test(x.status)).pop() || results.find((x) => x.row === row) || {};
    const readyLine = (ready.split("\n").find((l) => new RegExp(`^\\s*${row}\\b`).test(l)) || "").replace(new RegExp(`^\\s*${row}\\s*`), "");
    const cmds = commandsOf(readyLine).length ? commandsOf(readyLine) : commandsOf(String(res.probe || ""));
    if (cmds.length) return { row, res, tests: [], specRows: [], cmds };
    const probes = String(res.probe || "").split(/[,;\s()]+/).map((t) => t.replace(/^[^\w.\/-]+|[^\w.\/-]+$/g, "")).filter(Boolean);
    // a test file only: *.test.mjs or a file that imports node:test (a library like contract-s17.mjs passes node --test trivially)
    const tests = probes.filter((p) => /\.(m?js|cjs)$/.test(p) && existsSync(join(wt, p)) && (/\.test\.(m?js|cjs)$/.test(p) || /node:test/.test(readFileSync(join(wt, p), "utf8"))));
    const specRows = probes.filter((p) => !/\.(m?js|cjs)$/.test(p) && spec[p]);
    if (!tests.length && !specRows.length && spec[row]) specRows.push(row);
    return { row, res, tests, specRows, cmds: [] };
  });
  const evRows = [...new Set(plan.flatMap((p) => p.specRows))];
  const ev = [];
  for (const n of [1, 2]) {
    if (!evRows.length) break;
    const id = `prove-${name}-${sha.slice(0, 7)}-${n}`;
    let r = run("node", ["build/tools/review/evidence.mjs", "--run", "--rows", evRows.join(","), "--run-id", id]);
    for (let k = 0; r.code === 75 && k < 10; k++) r = run("node", ["build/tools/review/evidence.mjs", "--run", "--resume", id]);
    ev[n] = { code: r.code, index: readJson(join(wt, "build/screenshots/evidence", id, "index.json"), { rows: {} }) };
  }
  const testRes = {};
  for (const p of plan) for (const t of p.tests) testRes[t] = [1, 2].map(() => run("node", ["--test", t]).code);
  const cmdRes = {};
  for (const p of plan) for (const c of p.cmds) {
    if (cmdRes[c.join(" ")]) continue;
    const isTest = c[1] === "--test";
    cmdRes[c.join(" ")] = [1, 2].map(() => (isTest ? run(c[0], c.slice(1)) : run("flock", ["-w", "3600", "/tmp/njg-browser-all.lock", ...c])).code);
  }
  let change = { code: null, md: null };
  // the builder's own check-change report on the branch stands in (orchestrator, 07:11): the newest one whose commit is in the branch
  const own = ownChange(ref);
  if (own && !NOCHANGE) {
    change = { code: own.ok ? 0 : 1, md: own.md, own: own.file };
    writeFileSync(join(LOGS, `${name}-${sha.slice(0, 7)}-change.md`), own.md);
    L(`check-change: the branch's own ${own.file} (${own.ok ? "passed / no new break" : "failed"}; covers ${own.commit})`);
  } else if (!NOCHANGE) {
    const games = process.env.PROVE_GAMES ? process.env.PROVE_GAMES.split(",") : [...new Set(plan.map((p) => p.res.game).map((g) => (g in GAME ? GAME[g] : g)).filter((g) => g && VALID.has(g)))];
    const a = ["build/tools/tiers/check-change.mjs", "--base", BASE];
    if (games.length) a.push("--games", games.join(","));
    if (evRows.length) a.push("--rows", evRows.join(","));
    if (process.env.PROVE_CHANGE_ARGS) a.push(...process.env.PROVE_CHANGE_ARGS.split(" ").filter(Boolean));
    const r = run("node", a);
    const short = git("rev-parse", "--short=10", sha).trim();
    const md = join(wt, `build/reports/tiers/change-${short}.md`);
    change = { code: r.code, games, md: existsSync(md) ? readFileSync(md, "utf8") : null };
    if (change.md) writeFileSync(join(LOGS, `${name}-${sha.slice(0, 7)}-change.md`), change.md);
    L(`check-change exit ${r.code} (games ${games.join(",") || "from the diff"})`);
  }
  for (const p of plan) {
    const why = [];
    let passes = [true, true], machine = true;
    for (const c of p.cmds) { const k = c.join(" "); cmdRes[k].forEach((x, i) => { if (x !== 0) passes[i] = false; }); why.push(`${k.slice(0, 90)}: ${cmdRes[k].map((x) => (x === 0 ? "pass" : `fail(${x})`)).join(", ")}`); }
    if (!p.tests.length && !p.specRows.length && !p.cmds.length) { record(name, sha, p.row, "bounced", `no runnable check: probe "${p.res.probe || ""}" is neither an evidence spec on the branch nor a test file`); (state[name] ||= {})[p.row] = { readyKey: key, resHash: hash(p.res), sha, status: "bounced" }; continue; }
    for (const t of p.tests) { testRes[t].forEach((c, i) => { if (c !== 0) passes[i] = false; }); why.push(`${t}: ${testRes[t].map((c) => (c === 0 ? "pass" : `fail(${c})`)).join(", ")}`); }
    for (const s of p.specRows) {
      const v = [1, 2].map((n) => ev[n]?.index?.rows?.[s]);
      const verdicts = v.map((x) => {
        if (!x) return "missing";
        if (x.tool && x.tool.length) return "tool failure";
        if (x.expect) return x.expect;
        if (x.reached < x.probes) return "not reached";
        // mixed: some probes carry an expect, the rest are eye panels: all expects pass -> a machine pass (eye panels to the judge)
        let md = ""; try { md = readFileSync(join(wt, x.md), "utf8"); } catch {}
        const ex = md.match(/- expect [^\n]*?: (PASS|FAIL|undecided)/g) || [];
        if (ex.length && ex.every((e) => /: PASS$/.test(e))) return "PASS";
        if (ex.some((e) => /: FAIL$/.test(e))) return "FAIL";
        return "eye";
      });
      verdicts.forEach((x, i) => { if (x !== "PASS" && x !== "eye") passes[i] = false; });
      if (verdicts.every((x) => x === "eye")) machine = false;
      why.push(`${s}: ${verdicts.join(", ")}${v[0] && v[0].expectLine ? ` (${String(v[0].expectLine).slice(0, 120)})` : ""}`);
    }
    const changeOk = NOCHANGE ? null : change.code === 0;
    if (!NOCHANGE) why.push(change.own ? `check-change (the builder's ${change.own}): ${change.code === 0 ? "pass" : "FAIL"}` : `check-change exit ${change.code}`);
    let status;
    if (passes[0] && passes[1]) status = changeOk === false ? "bounced" : "ready";
    else if (passes[0] || passes[1]) status = "unproven";
    else status = "bounced";
    if (status === "ready" && !machine) {
      const j = judgeOf(p.row, name);
      if (j && /PASS/i.test(j.verdict)) why.push(`judge PASS: ${String(j.reason || "").slice(0, 100)}`);
      else { status = "unproven"; why.push(j ? `judge ${j.verdict}: ${String(j.reason || "").slice(0, 100)}` : "eye row: reached both times, no judge verdict yet"); }
    }
    if (changeOk === false && passes[0] && passes[1]) why.push("check-change failed: see prove/" + `${name}-${sha.slice(0, 7)}-change.md`);
    record(name, sha, p.row, status, why.join("; "));
    (state[name] ||= {})[p.row] = { readyKey: key, resHash: hash(p.res), sha, status };
  }
  saveState();
  saveProve();
  if (!process.env.PROVE_KEEP_WT) try { execFileSync("git", ["worktree", "remove", "--force", wt], { cwd: ROOT, stdio: "ignore" }); } catch {}
}
saveState();
saveProve();

// "node x.mjs --a b (comment); node --test y.test.mjs" -> [["node","x.mjs","--a","b"],["node","--test","y.test.mjs"]]
function commandsOf(text) {
  const out = [];
  for (const m of String(text).matchAll(/\bnode\s+((?:--test\s+)?[\w./-]+\.m?js)((?:\s+--?[\w-]+(?:\s+(?![-(])[^\s;()]+)?)*)/g)) {
    const a = ["node", ...m[1].split(/\s+/), ...m[2].trim().split(/\s+/).filter(Boolean)];
    if (a.some((x) => x.includes("<"))) continue;
    out.push(a);
  }
  return out;
}
function ownChange(ref) {
  let files = [];
  try { files = git("ls-tree", "--name-only", `${ref}:build/reports/tiers/`).split("\n").filter((f) => /^change-[0-9a-f]+\.md$/.test(f)); } catch { return null; }
  const cands = [];
  for (const f of files) {
    const c = f.slice(7, -3);
    // only a report made on this run's work: its commit is in the branch and is not the base or before it
    try { git("merge-base", "--is-ancestor", c, BASE); continue; } catch {}
    let t = 0;
    try { git("merge-base", "--is-ancestor", c, ref); t = Number(git("log", "-1", "--format=%ct", c).trim()); } catch { continue; }
    cands.push({ f, c, t });
  }
  if (!cands.length) return null;
  cands.sort((a, b) => b.t - a.t);
  const { f, c } = cands[0];
  const md = show(ref, `build/reports/tiers/${f}`) || "";
  const fail = /check-change: FAILED|\*\*FAILED\*\*|FAILED in/i.test(md) && !/no new break/i.test(md);
  return { file: f, commit: c, md, ok: !fail };
}
// two rounds may run at once (one per branch group): merge with what is on disk, mine win for my branch+row
function saveProve() {
  const disk = readJson(provePath, []);
  const mine = new Set(prove.map((p) => `${p.branch} ${p.row}`));
  writeFileSync(provePath, JSON.stringify([...disk.filter((p) => !mine.has(`${p.branch} ${p.row}`)), ...prove], null, 1) + "\n");
}
function saveState() { const disk = readJson(statePath, {}); for (const [b, rows] of Object.entries(state)) disk[b] = { ...(disk[b] || {}), ...rows }; writeFileSync(statePath, JSON.stringify(disk, null, 1) + "\n"); }
function hash(o) { return createHash("sha1").update(JSON.stringify(o || {})).digest("hex").slice(0, 10); }
function record(branch, commit, row, status, why) {
  for (let i = prove.length - 1; i >= 0; i--) if (prove[i].branch === `run16/${branch}` && prove[i].row === row) prove.splice(i, 1);
  prove.push({ branch: `run16/${branch}`, commit: commit.slice(0, 10), row, status, why, at: now() });
  console.log(`  ${row}: ${status} - ${why}`);
}

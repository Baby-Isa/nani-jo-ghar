// The check tiers' shared parts (Zafar, 9-10 Nov: one tool per tier, run by the process itself, never requested).
// Pure parts first (unit tested in tiers.test.mjs), then the parts that read git and the disk, then the step runner and the
// result files every tier writes: build/reports/tiers/<tier>-<commit>.json and .md.
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync, rmSync, unlinkSync, createWriteStream } from "node:fs";
import { join, dirname } from "node:path";
import { spawnSync, spawn, execFileSync } from "node:child_process";
import { ROOT, locked } from "../review/lib/common.mjs";

export { ROOT };
export const CONFIG = JSON.parse(readFileSync(join(ROOT, "build/tools/tiers/tiers.json"), "utf8"));
export const RESULTS = join(ROOT, CONFIG.results);
export const WORK = join(ROOT, CONFIG.work);
export const sizesOf = (s) => (s === "four" ? CONFIG.sizes.four : Array.isArray(s) ? s : String(s).split(","));

// ---------------------------------------------------------------- pure: flows -> games, levels, rows
// a flow id's game: its base id, a lab page's Cook game folded into cook:<game> when that flow exists
export const baseId = (id) => id.replace(/[@#].*$/, "");
export function gameOf(id, all = null) {
  const b = baseId(id);
  const m = /^lab:cook\/(.+)$/.exec(b);
  if (m && (!all || all.some((x) => baseId(x) === `cook:${m[1]}`))) return `cook:${m[1]}`;
  return b;
}
export const keyOf = (game) => game.replace(/^(cook:|lab:cook\/|clinic:heal-|clinic:|mode:|day:)/, "");
export const familyOf = (game) => (/^(cook:|lab:cook\/)/.test(game) ? "cook" : /^clinic:/.test(game) ? "clinic" : game.split(":")[0]);
export const levelOf = (id) => +((/@L(\d)/.exec(id) || [0, 1])[1]);
export const pathOf = (id) => (/#([\w-]+)/.exec(id) || [0, ""])[1];
// not games: the static spacing lint's flow and the rotate card (they ride with the games they reach)
export const NOT_GAMES = new Set(["css", "rotate-card"]);
export function gamesFromFlows(flows, all) {
  const out = [];
  for (const f of flows) { const g = gameOf(f, all); if (!NOT_GAMES.has(g) && !out.includes(g)) out.push(g); }
  return out;
}
// "chop" -> "cook:chop"; "heal-cut" -> "clinic:heal-cut"; an exact game id stays
export function normalizeGame(name, all) {
  const games = [...new Set(all.map((x) => gameOf(x, all)))];
  if (games.includes(name)) return name;
  for (const p of ["cook:", "clinic:", "clinic:heal-", "mode:", "day:"]) if (games.includes(p + name)) return p + name;
  return null;
}
// the flows that play a game at these levels (its paths too unless skipped); a lab page's flows ride with its game
export function flowsOfGame(game, all, { levels = [1, 2, 3, 4], skipPaths = [], paths = true } = {}) {
  return all.filter((id) => gameOf(id, all) === game && levels.includes(levelOf(id)) && (paths ? !skipPaths.includes(pathOf(id)) : !pathOf(id)));
}
// the first flow of a game that exists, from a preference list of paths ("#speed1", "" = the plain L1 flow)
export function filmFlow(game, all, prefer = ["#speed1", ""]) {
  for (const p of prefer) { const id = `${game}${p}`; if (all.includes(id)) return id; }
  return null;
}
// the changed lines of a unified diff (not the +++/--- headers)
export const changedLines = (diff) => diff.split("\n").filter((l) => /^[+-]/.test(l) && !/^(\+\+\+|---) /.test(l));
// levels touched: every level when the change touches levels (a level table, a ladder, the game's own station data), else L1
export function levelsTouched(diffs, game, cfg = CONFIG.tiers.change.levels) {
  const key = keyOf(game);
  for (const { file, text } of diffs) {
    if (file === `data/stations/${key}.json`) return cfg.touched;
    if (changedLines(text || "").some((l) => /\blevels?\b|\bL[1-4]\b|ladder/i.test(l))) return cfg.touched;
  }
  return cfg.default;
}
// the fix-list rows a change names: IDs on the fix list's changed lines and in the commit messages, that have a probe
export const ROW_ID = /\b[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*-\d+\b/g;
export function rowsFromDiff(regressionsDiff, logText, probed) {
  const ids = new Set([...changedLines(regressionsDiff || "").join("\n").matchAll(ROW_ID), ...String(logText || "").matchAll(ROW_ID)].map((m) => m[0]));
  return [...ids].filter((id) => probed.has(id)).sort();
}
// the shared elements a change touches (data/kit-elements.json: each element's class-name patterns on a changed line)
export function elementsFromDiff(diff, elements) {
  const lines = changedLines(diff || "").join("\n");
  return Object.entries(elements).filter(([, e]) => (e.grep || []).some((g) => new RegExp(g).test(lines))).map(([name]) => name);
}
// does a check fire for this tier? when: "always", "games:<family>", or a regex over the changed files
export function fires(when, { files = [], games = [] } = {}) {
  if (!when) return false;
  if (when === "always") return true;
  const m = /^games:(\w+)$/.exec(when);
  if (m) return games.some((g) => familyOf(g) === m[1]);
  const re = new RegExp(when);
  return files.some((f) => re.test(f));
}
// the extra checks a tier runs (tiers.json "checks"), one step per game where a check is "per": "game"
export function extraSteps(tier, { files = [], games = [], elems = [], base = "", checks = CONFIG.checks } = {}) {
  const out = [];
  for (const c of checks) {
    const t = c.tiers && c.tiers[tier];
    if (!t || c.builtin || !fires(t.when, { files, games })) continue;
    const fam = games.filter((g) => !c.family || familyOf(g) === c.family);
    if (c.family && !fam.length) continue;
    if (c.needs === "elems" && !elems.length) continue;
    const fill = (s, g) => s.replaceAll("{key}", g ? keyOf(g) : "").replaceAll("{keys}", fam.map(keyOf).join(",")).replaceAll("{elems}", elems.join(",")).replaceAll("{base}", base);
    const blocks = t.blocks ?? c.blocks ?? true;
    const one = (g) => ({ id: g ? `${c.id}:${keyOf(g)}` : c.id, what: c.what, game: g || null, check: c.id, browser: !!c.browser, selfLock: !!c.selfLock, minutes: c.minutes || 1, blocks, fix: c.fix || null,
      ...(c.shell ? { shell: fill(c.shell, g) } : { cmd: c.cmd || "node", argv: c.argv.map((x) => fill(x, g)) }) });
    if (c.per === "game") for (const g of fam) out.push(one(g)); else out.push(one(null));
  }
  return out;
}
// the known-fails list and the fix list: failures grouped by game ({game, check, where, what})
export function groupByGame(items) {
  const by = new Map();
  for (const it of items) { const g = it.game || "(every game)"; if (!by.has(g)) by.set(g, []); by.get(g).push(it); }
  return [...by.entries()].sort((a, b) => (a[0] === "(every game)") - (b[0] === "(every game)") || a[0].localeCompare(b[0]));
}
export function fixListMd(items, title = "Fix list") {
  if (!items.length) return `## ${title}\n\nNothing to fix.\n`;
  const L = [`## ${title} (${items.length}, by game)`, ""];
  for (const [g, list] of groupByGame(items)) {
    L.push(`**${g}** (${list.length})`);
    for (const it of list) L.push(`- ${it.check}${it.where ? ` at ${it.where}` : ""}: ${it.what}`);
    L.push("");
  }
  return L.join("\n");
}
// a sandbox run's pages -> failures: a page that never reached its end, page errors, contract breaks
export function runFailures({ pages = [], breaks = [] }, all = null) {
  const out = [];
  for (const p of pages) {
    const where = `${p.flow}@${p.size}`;
    if (!p.complete) out.push({ game: gameOf(p.flow, all), check: "stuck", where, what: `did not reach its end${p.stops && p.stops.length ? ` (${String(p.stops[0].why || p.stops[0]).slice(0, 120)})` : ""}`, blocks: true });
    for (const e of p.errors || []) out.push({ game: gameOf(p.flow, all), check: "page error", where, what: String(e).slice(0, 200), blocks: true });
  }
  const seen = new Set();
  for (const b of breaks) {
    const k = `${b.check}|${b.flow}|${b.size}|${b.measured}`;
    if (seen.has(k)) continue; seen.add(k);
    out.push({ game: gameOf(b.flow, all), check: b.check, where: `${b.flow}@${b.size}${b.state ? ` (${b.state})` : ""}`, what: String(b.measured || b.item || "").slice(0, 200), blocks: false });
  }
  return out;
}

// ---------------------------------------------------------------- pure: the result files
export const short = (sha) => String(sha || "").slice(0, 10);
export const resultName = (tier, commit) => `${tier}-${short(commit)}`;
export function resultMd(r) {
  const icon = (s) => ({ pass: "ok  ", fail: "FAIL", report: "note", skipped: "skip", dry: "plan" }[s.status] || s.status);
  const L = [`# ${r.name} (tier ${r.tierNo}) on ${short(r.commit)}${r.dirty ? " + uncommitted changes" : ""}`, "",
    `**${r.dry ? "DRY RUN (nothing ran)" : r.ok ? "PASSED" : "FAILED"}**, ${r.date}${r.base ? `; base ${short(r.base)}` : ""}${r.minutes != null ? `; ${r.minutes} min` : ""}.`, ""];
  if (r.games && r.games.length) L.push(`Games: ${r.games.join(", ")}${r.gamesWhy ? ` (${r.gamesWhy})` : ""}.`);
  if (r.rows && r.rows.length) L.push(`Rows: ${r.rows.join(", ")}.`);
  if (r.notes && r.notes.length) for (const n of r.notes) L.push(`- ${n}`);
  L.push("", "| | step | what | blocks | result |", "|---|---|---|---|---|");
  for (const s of r.steps) L.push(`| ${icon(s)} | ${s.id} | ${s.what} | ${s.blocks ? "yes" : "reports"} | ${String(s.line || s.note || "").replace(/\|/g, "/").slice(0, 160)} |`);
  if (r.failures) L.push("", fixListMd(r.failures.filter((f) => f.blocks !== false), r.fixTitle || "Blocking"));
  if (r.failures && r.failures.some((f) => f.blocks === false)) L.push("", fixListMd(r.failures.filter((f) => f.blocks === false), "Reported, not blocking"));
  if (r.knownFails) L.push("", fixListMd(r.knownFails, "Known fails (open, published with the list)"));
  if (r.artefacts && Object.keys(r.artefacts).length) { L.push("", "## For the eyes"); for (const [k, v] of Object.entries(r.artefacts)) L.push(`- ${k}: ${Array.isArray(v) ? v.join(", ") : v}`); }
  return L.join("\n") + "\n";
}
// only the tier result files changed since a commit (they are committed after the check: still the same code)
export const onlyResultFiles = (files) => files.every((f) => f.startsWith(`${CONFIG.results}/`));
// has <tier> passed on this code? a passing result for HEAD, or for an earlier commit with only result files changed since
export function passedOn(tier, head, { results = readResults(tier), changedSince = (c) => gitChanged(c) } = {}) {
  const ok = results.filter((r) => r.ok && !r.dry && !r.dirty);
  const exact = ok.find((r) => r.commit === head);
  if (exact) return exact;
  for (const r of ok.sort((a, b) => String(b.date).localeCompare(String(a.date)))) {
    const ch = changedSince(r.commit);
    if (ch && onlyResultFiles(ch)) return r;
  }
  return null;
}

// ---------------------------------------------------------------- git and the disk
export function git(...a) { const r = spawnSync("git", a, { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 28 }); return r.status === 0 ? r.stdout.trim() : null; }
export const head = () => git("rev-parse", "HEAD");
// (status lines start with a space: never trimmed)
export const dirtyFiles = () => (spawnSync("git", ["status", "--porcelain", "--untracked-files=all"], { cwd: ROOT, encoding: "utf8" }).stdout || "").split("\n").filter(Boolean).map((l) => l.slice(3)).filter((f) => !f.startsWith(`${CONFIG.results}/`));
// the files changed from a commit to the working tree (committed or not, untracked too); null when the commit is not here
export function gitChanged(commit) {
  if (!commit || git("cat-file", "-e", `${commit}^{commit}`) === null) return null;
  const d = git("diff", "--name-only", commit);
  const u = git("ls-files", "--others", "--exclude-standard") || "";
  return [...new Set([...(d || "").split("\n"), ...u.split("\n")].filter(Boolean))];
}
export const mergeBase = () => git("merge-base", "HEAD", "origin/main") || git("rev-parse", "HEAD~1");
// the last publish: the newest "Publish: version" commit on origin/main this branch contains (else the merge base)
export function lastPublish() {
  const log = git("log", "--format=%H %s", "-n", "200", "origin/main") || "";
  for (const l of log.split("\n")) { const [sha, ...s] = l.split(" "); if (/^Publish: version/.test(s.join(" ")) && git("merge-base", "--is-ancestor", sha, "HEAD") !== null) return sha; }
  return mergeBase();
}
export function publishes(n = 5) {
  return (git("log", "--format=%H %s", "-n", "400", "origin/main") || "").split("\n").filter((l) => / Publish: version/.test(l)).slice(0, n).map((l) => ({ sha: l.split(" ")[0], stamp: (/version (\S+)/.exec(l) || [])[1] }));
}
export function allFlowIds() {
  const r = spawnSync(process.execPath, ["build/sandbox/run.mjs", "--list"], { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 26 });
  return (r.stdout || "").split("\n").map((l) => l.split(/\s+/)[0]).filter((x) => x && /^[\w:/@#.-]+$/.test(x) && !/^(Flows|flows)/.test(x));
}
// the games and flows the diff reaches (touched.mjs's map: what each page loads, shared files to every game)
// (a dot-folder, .claude or .github, is never served: touched.mjs would call it unplaced and list every flow)
export function touched(base, files = null) {
  const all = files || gitChanged(base) || [];
  const served = all.filter((f) => !/(^|\/)\./.test(f));
  if (!served.length) return { files: all, flows: [], unplaced: [] };
  const r = spawnSync(process.execPath, ["build/tools/review/touched.mjs", "--json", "--files", served.join(",")], { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 26 });
  try { return { ...JSON.parse(r.stdout), files: all }; } catch (e) { return { files: all, flows: [], unplaced: [], error: (r.stderr || r.stdout || "").slice(0, 300) }; }
}
export const fileDiffs = (base, files) => files.map((file) => ({ file, text: git("diff", base, "--", file) || "" }));
export const probedRows = () => new Set(Object.keys(JSON.parse(readFileSync(join(ROOT, "build/sandbox/data/evidence.json"), "utf8"))).filter((k) => !k.startsWith("_")));
export function readResults(tier) {
  if (!existsSync(RESULTS)) return [];
  return readdirSync(RESULTS).filter((f) => f.startsWith(`${tier}-`) && f.endsWith(".json")).map((f) => { try { return JSON.parse(readFileSync(join(RESULTS, f), "utf8")); } catch (e) { return null; } }).filter(Boolean);
}
export function writeResult(r) {
  mkdirSync(RESULTS, { recursive: true });
  const name = resultName(r.tier, r.commit) + (r.dry ? "-dry" : "");
  writeFileSync(join(RESULTS, `${name}.json`), JSON.stringify(r, null, 1) + "\n");
  writeFileSync(join(RESULTS, `${name}.md`), resultMd(r));
  return `${CONFIG.results}/${name}.md`;
}
// a sandbox run folder -> its pages ({flow, size, complete, errors, stops}) and contract breaks
export function readRun(dir) {
  const pages = [], data = join(dir, "data");
  if (existsSync(data)) for (const f of readdirSync(data).filter((x) => x.endsWith(".json"))) {
    try { const d = JSON.parse(readFileSync(join(data, f), "utf8")); if (d.flow) pages.push({ flow: d.flow, size: d.size, complete: !!d.complete, errors: d.errors || [], stops: d.stops || [] }); } catch (e) { /* a page still being written */ }
  }
  let breaks = [];
  try { breaks = JSON.parse(readFileSync(join(dir, "contract.json"), "utf8")); } catch (e) { /* no contract checks in this run */ }
  return { pages, breaks };
}
export const runPath = (id, root = ROOT) => join(root, "build", "screenshots", "sandbox", id);
export const filmsOf = (id, root = ROOT) => { const d = join(runPath(id, root), "films"); return existsSync(d) ? readdirSync(d).filter((f) => f.endsWith(".webm")).map((f) => rel(join(d, f))) : []; };
export const rel = (p) => (p.startsWith(ROOT) ? p.slice(ROOT.length + 1) : p);

// the code before: a tree of the base commit, beside this one (git archive of what a page and the sandbox need; the pictures
// hard-linked from this tree, those changed since put back to the base's), reused while the base is the same
export function beforeTree(base) {
  const dir = join(WORK, "trees", short(base));
  if (existsSync(join(dir, ".tiers-ok"))) return dir;
  rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
  const paths = ["build/sandbox", "build/lint", "build/tools/review", "build/test_cook_mount.mjs", "js", "css", "data", "lab", "content"].filter((p) => git("cat-file", "-e", `${base}:${p}`) !== null);
  const pages = (git("ls-tree", "--name-only", base) || "").split("\n").filter((f) => /\.(html|ico)$/.test(f));
  const tar = spawnSync("bash", ["-c", `git archive ${base} -- ${[...paths, ...pages].map((p) => `'${p}'`).join(" ")} | tar -x -C '${dir}'`], { cwd: ROOT, encoding: "utf8" });
  if (tar.status !== 0) throw new Error(`git archive ${short(base)}: ${tar.stderr}`);
  if (existsSync(join(ROOT, "assets"))) spawnSync("cp", ["-al", join(ROOT, "assets"), join(dir, "assets")]);
  for (const f of (gitChanged(base) || []).filter((x) => x.startsWith("assets/"))) {
    const p = join(dir, f);
    try { unlinkSync(p); } catch (e) { /* new since the base */ }
    const buf = spawnSync("git", ["show", `${base}:${f}`], { cwd: ROOT, maxBuffer: 1 << 28 });
    if (buf.status === 0) { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, buf.stdout); }
  }
  writeFileSync(join(dir, ".tiers-ok"), base + "\n");
  return dir;
}

// ---------------------------------------------------------------- running the steps
const PORT = process.env.COOK_TEST_PORT || "";
export function stepArgv(s) {
  const base = s.shell ? ["bash", "-c", s.shell] : [s.cmd || "node", ...s.argv];
  const timed = ["timeout", String(Math.max(5, Math.ceil((s.timeoutMin || s.minutes * 3 + 5))) * 60), ...base];
  return s.browser && !s.selfLock ? locked(timed, { wait: 3600 }) : timed;
}
// (printed so it pastes into a shell: an argument with a shell character is quoted)
const q = (x) => (/[^\w@%+=:,./-]/.test(String(x)) ? `'${String(x).replace(/'/g, "'\\''")}'` : String(x));
export const show = (s) => (s.shell ? s.shell : [s.cmd || "node", ...s.argv].map(q).join(" "));
export function planMinutes(steps) { return Math.round(steps.reduce((t, s) => t + (s.minutes || 0), 0)); }
export function printPlan(name, steps, extra = []) {
  console.log(`${name}: ${steps.length} step(s), about ${planMinutes(steps)} min${steps.some((s) => s.browser) ? " (browser steps under the one lock, one at a time)" : ""}`);
  for (const x of extra) console.log(`  ${x}`);
  for (const s of steps) console.log(`  ${s.blocks ? "blocks " : "reports"} ~${String(Math.round(s.minutes)).padStart(3)} min  ${s.id.padEnd(22)} ${s.what}\n${" ".repeat(24)}$ ${s.env ? Object.entries(s.env).map(([k, v]) => `${k}=${v} `).join("") : ""}${show(s)}`);
}
// run one step: its output to <log dir>/<id>.log, the last line kept; the step's own judge (s.judge) may read what it made
export function runStep(s, logDir) {
  mkdirSync(logDir, { recursive: true });
  const logFile = join(logDir, `${s.id.replace(/[^\w.-]+/g, "_")}.log`);
  const argv = stepArgv(s), t0 = Date.now();
  const env = { ...process.env, ...(s.env || {}) };
  return new Promise((res) => {
    const out = createWriteStream(logFile);
    const p = spawn(argv[0], argv.slice(1), { cwd: s.cwd || ROOT, env });
    let tail = "";
    const keep = (d) => { out.write(d); tail = (tail + d).slice(-4000); if (process.env.NJG_TIERS_VERBOSE) process.stdout.write(d); };
    p.stdout.on("data", keep); p.stderr.on("data", keep);
    p.on("close", (code) => {
      out.end();
      const lines = tail.split("\n").map((l) => l.trim()).filter(Boolean);
      // (a sandbox run's own verdict lines say more than its last line)
      // (and a failed check's own FAIL lines say more than a closing note)
      const verdict = lines.filter((l) => /^(CONTRACT|CHECK) /.test(l)).join("; ");
      const failed = code !== 0 ? lines.filter((l) => /^FAIL\b/.test(l)).slice(0, 3).join("; ") : "";
      const r = { code, ok: code === 0, line: verdict || failed || lines.at(-1) || "", tail: lines.slice(-6), log: rel(logFile), minutes: +((Date.now() - t0) / 60000).toFixed(1) };
      if (s.judge) Object.assign(r, s.judge(r) || {});
      res(r);
    });
  });
}
// run a tier's steps in order (one browser at a time) and fold them into a result
export async function runAll(steps, logDir, { onStep = () => {} } = {}) {
  const done = [];
  for (const s of steps) {
    if (s.skip) { done.push({ ...strip(s), status: "skipped", note: s.skip }); continue; }
    process.stdout.write(`  ${s.id} ... `);
    const r = await runStep(s, logDir);
    const status = r.ok ? "pass" : s.blocks ? "fail" : "report";
    console.log(`${status} (${r.minutes} min)${r.ok ? "" : `: ${r.line.slice(0, 140)}`}`);
    const row = { ...strip(s), status, code: r.code, line: r.line, tail: r.tail, log: r.log, minutes: r.minutes, ...(r.extra || {}) };
    done.push(row);
    onStep(row, r);
  }
  return done;
}
const strip = (s) => ({ id: s.id, what: s.what, game: s.game || null, blocks: !!s.blocks, browser: !!s.browser, fix: s.fix || null, command: show(s) });
export function stepFailures(steps) {
  return steps.filter((s) => s.status === "fail" || s.status === "report").map((s) => ({ game: s.game, check: s.id, where: s.log, what: `${s.line || "exit " + s.code}${s.fix ? ` (reports, not blocks: ${s.fix})` : ""}`, blocks: s.status === "fail" }));
}
export function newResult(tier, extra = {}) {
  const t = CONFIG.tiers[tier];
  const commit = head();
  return { tier, tierNo: t.tier, name: t.name, commit, dirty: dirtyFiles().length > 0, date: new Date().toISOString(), ...extra };
}
export function finish(r, steps, t0) {
  r.steps = steps;
  r.minutes = +((Date.now() - t0) / 60000).toFixed(1);
  r.ok = !r.dry && steps.every((s) => s.status !== "fail") && !(r.failures || []).some((f) => f.blocks !== false);
  const md = writeResult(r);
  console.log(`${r.name}: ${r.dry ? "dry run" : r.ok ? "PASSED" : "FAILED"}${r.dry ? "" : ` in ${r.minutes} min`}; ${md}`);
  return r;
}
export const today = () => new Date().toISOString().replace(/[:.]/g, "").slice(0, 15);
// the common options every tier tool takes
export function common(a) { return { dry: a.has("dry-run") || a.has("dry"), port: PORT }; }

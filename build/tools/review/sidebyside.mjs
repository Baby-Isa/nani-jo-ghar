#!/usr/bin/env node
/*
 * Side by side with chai (s19-checks, Sprint 19 parts 2 and 3; build/reports/s18-eye-judge-experiment.md, its changes 2 and 3; the merge
 * rule proposed in build/reports/s18-review-and-direction.md §6 principle 10, not yet agreed): play chai and a game to the same key
 * moments at a child's pace and hand the eye judge full-size pairs (chai left, the game right), close-ups of the order card and Nani's
 * box beside chai's, and frame strips round each first-time light and lesson (0.5 s before to 2 s after, about every 110 ms).
 *   node build/tools/review/sidebyside.mjs <game> [--level 1] [--sizes 740x320,1280x665] [--run <run id>] [--out <dir>] [--no-lock]
 * <game>: a kitchen game's station id (maani-line, daar, mishkaki-grill, chaat, samosa, eggs, corn, baking, chop).
 * It plays cook:chai-tray and cook:<game> (#speed1, a child's pace; @L<n> for --level) through the sandbox with --keyframes
 * (build/sandbox/lib/keyframes.mjs: no new browser plumbing, the sandbox's players and probes), taking /tmp/njg-browser-all.lock
 * itself (never wrap it in flock: it would wait on itself) unless --no-lock; --run reuses a played run. Then it writes
 * build/screenshots/sidebyside/<game>-L<n>-<stamp>/ (or --out): the pictures (sidebyside_compose.py), index.html, and
 * judge-batch.md: the eye judge's batch, the rubric's questions (docs/process/eye-judge-rubric.md) asked of these pictures, flaws first,
 * with the verdict file it must write. The order of the key moments: the order in the side panel, the first first-time light, the first
 * move, mid-cook, the serve, well done, the end. The run's own contract breaks (part 1's code checks among them) are listed first.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { args, help, ROOT, RUNS, locked } from "./lib/common.mjs";

export const MOMENTS = [["order", "the order in the side panel"], ["light", "the first first-time light"], ["kind", "the first move"], ["mid", "mid-cook"], ["serve", "the serve"], ["praise", "well done"], ["end", "the end screen's word review"]];
export const GAMES = ["maani-line", "mishkaki-grill", "daar", "chaat", "samosa", "eggs", "corn", "baking", "chop"];
export const slug = (s) => String(s).replace(/[^\w@-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
export const flowsFor = (game, level = 1) => [`cook:chai-tray${level > 1 ? `@L${level}` : ""}#speed1`, `cook:${game}${level > 1 ? `@L${level}` : ""}#speed1`];

// the judge's batch: what to open, the rubric's questions by moment, the verdict file
export function batchText({ game, level, sizes, man, breaks, rubric, verdicts }) {
  const L = [];
  L.push(`# Eye judge: ${game} beside chai, L${level}`, "");
  L.push(`You are the eye judge (.claude/agents/judge.md, "Side by side"). Judge ${game} against chai, the signed-off reference ("clean, modern, beautiful", 7 Nov), from these pictures only. Flaws first, most serious first, each naming the picture and what chai does instead. The rubric is docs/process/eye-judge-rubric.md: read it whole before the first picture. Part 1 (the code checks) already decided what it lists below; do not judge those again, judge everything else.`, "");
  L.push(`Write your verdict to \`${verdicts}\`: first line \`judge: <your model and session>\`, then the flaws, then one line per rubric question you could answer (\`Q<n> | pass\` or \`Q<n> | FAIL: <picture>, <what>\` or \`Q<n> | can't tell\`), then the last line \`SHIP? | yes\` or \`SHIP? | no: <the flaws that stop it>\` (would a premium, Toca Boca-level game ship this?), and \`WORSE THAN CHAI? | <moments where ${game} is worse than chai at the same moment, or none>\` (the merge rule, proposed: nothing merges that this shows worse than chai unless a look sheet accepted it).`, "");
  L.push(`## Part 1, already decided by code (the run's contract breaks; not yours to judge again)`, "");
  if (breaks.length) for (const b of breaks) L.push(`- ${b}`); else L.push("- none");
  L.push("", "## The pictures", "");
  for (const size of sizes) {
    L.push(`### ${size}`, "");
    MOMENTS.forEach(([m, words], i) => {
      const pair = (man.pairs || []).find((p) => p.startsWith(size + "/") && p.endsWith(`-${m}.png`));
      const close = (man.closes || []).find((p) => p.startsWith(size + "/") && p.endsWith(`-${m}.png`));
      const miss = (man.missing || []).filter((x) => x.endsWith(`@${size}: ${m}`));
      L.push(`${i + 1}. **${words}**: ${pair ? `\`${pair}\`` : "(no pair)"}${close ? `; close-ups \`${close}\`` : ""}${miss.length ? `; NOT REACHED: ${miss.map((x) => x.split("@")[0]).join(", ")} (an EVIDENCE note, never a flaw of the game)` : ""}. Ask: ${(rubric[m] || []).map((q) => `Q${q}`).join(", ") || "the rubric's questions that apply"}.`);
    });
    const strips = (man.strips || []).filter((p) => p.startsWith(size + "/"));
    if (strips.length) {
      L.push("", `Strips (motion and timing: two fingers, a light that stays after the move starts, a flash in flight, a jump; frame times in ms from the moment, 0 = the light or lesson came): ${strips.map((s) => `\`${s}\``).join(", ")}. Ask: ${(rubric.strip || []).map((q) => `Q${q}`).join(", ")}.`);
    }
    L.push("");
  }
  return L.join("\n");
}

// which rubric questions each moment asks (read from the rubric file: `- **Q12** ... (moments: order, light)`)
export function rubricByMoment(text) {
  const out = {};
  for (const m of text.matchAll(/\*\*Q(\d+)\*\*([\s\S]*?)\(moments?: ([^)]+)\)/g)) {
    for (const k of m[3].split(/[,\s]+/).filter(Boolean)) (out[k] = out[k] || []).push(+m[1]);
  }
  return out;
}

export function indexHtml({ game, level, man, batch }) {
  const img = (p) => `<figure><img src="${p}" loading="lazy"><figcaption>${p}</figcaption></figure>`;
  return `<!doctype html><meta charset="utf-8"><title>${game} beside chai, L${level}</title>
<style>body{font:15px system-ui;background:#faf7f0;color:#281e14;margin:16px}img{max-width:100%;border:1px solid #ccc}figure{margin:12px 0}h2{margin-top:28px}</style>
<h1>${game} beside chai, L${level}</h1><p>Chai left, ${game} right, at the same moments; close-ups at 1:1; strips 0.5 s before to 2 s after each first-time light. The judge's batch: <a href="${batch}">${batch}</a>.</p>
<h2>Pairs</h2>${(man.pairs || []).map(img).join("")}
<h2>Close-ups</h2>${(man.closes || []).map(img).join("")}
<h2>Strips</h2>${(man.strips || []).map(img).join("")}
${(man.missing || []).length ? `<h2>Not reached</h2><ul>${man.missing.map((x) => `<li>${x}</li>`).join("")}</ul>` : ""}`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const a = args();
  help(readFileSync(new URL(import.meta.url), "utf8").split("*/")[0].replace(/^[\s\S]*?\/\*\n?/, "").replace(/^ \* ?/gm, ""), a);
  const game = a.pos[0];
  if (!game || !GAMES.includes(game)) { console.error(`sidebyside: name a kitchen game (${GAMES.join(", ")})`); process.exit(2); }
  const level = +(a.val("level") || 1);
  const sizes = (a.val("sizes") || "740x320,1280x665").split(",");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 13).replace("T", "-");
  const runId = a.val("run") || `sbs-${game}-L${level}-${stamp}`;
  const flows = flowsFor(game, level);
  if (!a.val("run")) {
    const cmd = [process.execPath, join(ROOT, "build/sandbox/run.mjs"), "--contract", "--keyframes", "--flow", flows.join(","), "--sizes", sizes.join(","), "--parallel", "2", "--no-sheets", "--run-id", runId];
    const full = a.has("no-lock") ? cmd : locked(["timeout", "1800", ...cmd]);
    console.log(`sidebyside: playing ${flows.join(" and ")} at ${sizes.join(", ")} (run ${runId})`);
    const r = spawnSync(full[0], full.slice(1), { cwd: ROOT, stdio: "inherit", env: { ...process.env, COOK_TEST_PORT: process.env.COOK_TEST_PORT || "8893" } });
    if (r.status !== 0 && r.status !== 1) { console.error(`sidebyside: the run stopped (exit ${r.status})`); process.exit(r.status || 1); }
  }
  const runDir = join(RUNS, runId);
  if (!existsSync(join(runDir, "keyframes"))) { console.error(`sidebyside: ${runDir} has no keyframes (play it with run.mjs --keyframes)`); process.exit(2); }
  const out = a.val("out") || join(ROOT, "build/screenshots/sidebyside", `${game}-L${level}-${stamp}`);
  mkdirSync(out, { recursive: true });
  const c = spawnSync("python3", [join(ROOT, "build/tools/review/sidebyside_compose.py"), runDir, slug(flows[0]), slug(flows[1]), out, "--sizes", sizes.join(",")], { cwd: ROOT, encoding: "utf8" });
  process.stdout.write(c.stdout || "");
  if (c.status !== 0) { console.error(c.stderr); process.exit(1); }
  const man = JSON.parse(readFileSync(join(out, "manifest.json"), "utf8"));
  let breaks = [];
  try { const cj = JSON.parse(readFileSync(join(runDir, "contract.json"), "utf8")); breaks = (Array.isArray(cj) ? cj : cj.breaks || []).map((b) => `${b.check} ${b.flow} @ ${b.size} ${b.at}s: ${b.measured}`); } catch (e) { breaks = ["(no contract.json: the run's contract was not read)"]; }
  const rubricFile = join(ROOT, "docs/process/eye-judge-rubric.md");
  const rubric = existsSync(rubricFile) ? rubricByMoment(readFileSync(rubricFile, "utf8")) : {};
  const batch = "judge-batch.md", verdicts = relative(ROOT, join(out, "judge-batch.verdicts.md"));
  writeFileSync(join(out, batch), batchText({ game, level, sizes, man, breaks, rubric, verdicts }));
  writeFileSync(join(out, "index.html"), indexHtml({ game, level, man, batch }));
  console.log(`sidebyside: ${relative(ROOT, out)}/ (index.html, ${batch}; ${breaks.length} contract breaks listed first)`);
}

#!/usr/bin/env node
/*
 * Runs the game's recogniser (js/shared/speech.js, the same code the browser
 * runs) on audio files and prints a confusion matrix.
 *
 * Files are named <choice>__<take>.wav|mp3 (or <choice>.mp3 for a single
 * take); the part before "__" is the word the file says.
 *
 *   node build/speech/harness.js --templates build/voice-test \
 *        --queries /tmp/aug --choices 1-kutchi-moke-chai-kape,2-kutchi-moke-doodh-kape
 *
 *   --templates  dir(s) or files whose clips are the reference takes
 *   --queries    dir(s) or files to recognise (default: the templates, leave-one-out)
 *   --choices    comma list: the closed set at this speaking moment (default:
 *                every choice in the templates). A query whose true word is
 *                not in the set is a "none" query and should come back null.
 *   --loo        leave-one-out: every query file is also a template, minus itself
 *   --no-warp    single-warp features (to measure what the VTLN warps buy)
 *   --accept X   --max X   override the margin / distance thresholds
 *   --md FILE    also write the report as markdown
 *
 * Needs ffmpeg on PATH or pip install imageio-ffmpeg.
 */
const fs = require("fs");
const path = require("path");
const { spawnSync, execSync } = require("child_process");
const Speech = require(path.join(__dirname, "..", "..", "js", "shared", "speech.js"));

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : def;
};
const flag = (name) => args.includes(name);

function ffmpegExe() {
  const w = spawnSync("which", ["ffmpeg"]);
  if (w.status === 0) return w.stdout.toString().trim();
  return execSync('python3 -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())"').toString().trim();
}
const FF = ffmpegExe();

function decode(file) {
  const r = spawnSync(FF, ["-loglevel", "error", "-i", file, "-f", "f32le", "-ac", "1", "-ar", String(Speech.SR), "-"], { maxBuffer: 1 << 28 });
  if (r.status !== 0) throw new Error(`ffmpeg failed on ${file}: ${r.stderr}`);
  const buf = r.stdout;
  return new Float32Array(buf.buffer, buf.byteOffset, buf.length / 4);
}

function listFiles(spec) {
  const out = [];
  for (const p of spec.split(",")) {
    if (!p) continue;
    if (fs.statSync(p).isDirectory()) {
      for (const f of fs.readdirSync(p).sort()) if (/\.(wav|mp3|m4a|ogg)$/i.test(f)) out.push(path.join(p, f));
    } else out.push(p);
  }
  return out;
}
const choiceOf = (file) => path.basename(file).replace(/\.[^.]+$/, "").split("__")[0];
const takeOf = (file) => path.basename(file).replace(/\.[^.]+$/, "").split("__")[1] || "take";

const templateFiles = listFiles(opt("--templates", "build/voice-test"));
const queryFiles = opt("--queries") ? listFiles(opt("--queries")) : templateFiles;
const loo = flag("--loo") || !opt("--queries");
const warps = flag("--no-warp") ? [1.0] : null;
if (opt("--accept")) Speech.config.accept = Number(opt("--accept"));
if (opt("--max")) Speech.config.maxDistance = Number(opt("--max"));

const allChoices = Array.from(new Set(templateFiles.map(choiceOf)));
const choices = opt("--choices") ? opt("--choices").split(",") : allChoices;
for (const c of choices) if (!allChoices.includes(c)) throw new Error(`no template for choice ${c}`);

// features once per file
const feats = new Map();
const t0 = Date.now();
for (const f of new Set([...templateFiles, ...queryFiles])) {
  const pcm = decode(f);
  feats.set(f, { pcm, tmpl: Speech.features(pcm, Speech.SR), query: warps ? [Speech.features(pcm, Speech.SR)] : Speech.queryFeatures(pcm, Speech.SR) });
}
const featMs = Date.now() - t0;

const templates = templateFiles.filter((f) => choices.includes(choiceOf(f))).map((f) => ({ choice: choiceOf(f), feat: feats.get(f).tmpl, file: f }));
if (loo) for (const f of queryFiles) if (choices.includes(choiceOf(f)) && !templateFiles.includes(f)) templates.push({ choice: choiceOf(f), feat: feats.get(f).tmpl, file: f });

const labels = choices.concat(["(none)"]);
const matrix = {};
for (const a of labels) {
  matrix[a] = {};
  for (const b of labels) matrix[a][b] = 0;
}
const rows = [];
const margins = { right: [], wrong: [], none: [] };
let classifyMs = 0;
for (const f of queryFiles) {
  const truth = choices.includes(choiceOf(f)) ? choiceOf(f) : "(none)";
  const tset = templates.filter((t) => t.file !== f);
  const t1 = Date.now();
  const r = Speech.classify(feats.get(f).query, tset);
  classifyMs += Date.now() - t1;
  const got = r.choice || "(none)";
  matrix[truth][got]++;
  const ok = got === truth;
  (truth === "(none)" ? margins.none : ok ? margins.right : margins.wrong).push(r.margin);
  rows.push({ file: path.basename(f), truth, got, ok, best: r.best, d1: r.d1, margin: r.margin, conf: r.confidence });
}

const short = (c) => c.replace(/^\d+-(kutchi|english)-/, (m, l) => (l === "kutchi" ? "K:" : "E:"));
const lines = [];
const n = queryFiles.length;
const correct = rows.filter((r) => r.ok).length;
const named = rows.filter((r) => r.truth !== "(none)");
const namedRight = named.filter((r) => r.ok).length;
const namedNull = named.filter((r) => r.got === "(none)").length;
const namedWrong = named.length - namedRight - namedNull;
const noneQ = rows.filter((r) => r.truth === "(none)");
const noneRejected = noneQ.filter((r) => r.ok).length;
lines.push(`Closed set (${choices.length}): ${choices.map(short).join(", ")}`);
lines.push(`Templates: ${templates.length} (${loo ? "leave-one-out over queries" : "reference takes only"}); queries: ${n}; warps: ${warps ? "off" : "on"}; accept margin ${Speech.config.accept}, max distance ${Speech.config.maxDistance}`);
lines.push(`In-set queries: ${named.length}: right ${namedRight} (${((100 * namedRight) / Math.max(1, named.length)).toFixed(0)}%), wrong ${namedWrong}, null ${namedNull}` + (noneQ.length ? `; out-of-set queries: ${noneQ.length}: rejected ${noneRejected}, mis-accepted ${noneQ.length - noneRejected}` : ""));
lines.push(`Time: features ${(featMs / feats.size).toFixed(0)} ms per clip (3 warps), classify ${(classifyMs / n).toFixed(0)} ms per query against ${templates.length} templates (Node; a phone is 1–3× slower)`);
lines.push("");
lines.push("| said \\ heard | " + labels.map(short).join(" | ") + " |");
lines.push("|---|" + labels.map(() => "---").join("|") + "|");
for (const a of labels) {
  if (a === "(none)" && !noneQ.length) continue;
  lines.push(`| ${short(a)} | ` + labels.map((b) => (matrix[a][b] ? String(matrix[a][b]) : "·")).join(" | ") + " |");
}
lines.push("");
const stat = (xs) => (xs.length ? `n=${xs.length} min ${Math.min(...xs).toFixed(2)} median ${xs.slice().sort((a, b) => a - b)[Math.floor(xs.length / 2)].toFixed(2)} max ${Math.max(...xs).toFixed(2)}` : "n=0");
lines.push(`Margins (d2-d1)/d1: right ${stat(margins.right)}; wrong ${stat(margins.wrong)}; out-of-set ${stat(margins.none)}`);
const d1s = rows.filter((r) => r.truth !== "(none)").map((r) => r.d1);
const d1n = noneQ.map((r) => r.d1);
lines.push(`Best distance d1: in-set ${stat(d1s)}; out-of-set ${stat(d1n)}`);
if (flag("--verbose")) {
  lines.push("");
  lines.push("| file | truth | heard | d1 | margin | conf |");
  lines.push("|---|---|---|---|---|---|");
  for (const r of rows) lines.push(`| ${r.file} | ${short(r.truth)} | ${short(r.got)}${r.ok ? "" : " ✗"} | ${r.d1.toFixed(2)} | ${r.margin.toFixed(2)} | ${r.conf} |`);
}
const report = lines.join("\n");
console.log(report);
if (opt("--md")) fs.writeFileSync(opt("--md"), report + "\n");

#!/usr/bin/env node
// Mum-round pipeline: one command from a folder of Mum's recordings to clips, the manifest, the engine and the new gap counts.
import { existsSync, readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, basename, extname, resolve } from "node:path";
import { spawn } from "node:child_process";
import { cpus } from "node:os";
import { ROOT, rel, args, help, die, sh } from "./lib.mjs";

const HELP = `
node build/tools/ops/mumround.mjs <folder> [--go] [--draft-items] [--no-engine] [--no-loudness] [--tol 3]
  For each recording in the folder (sources/audio/mum-YYYY-MM-DD/*.m4a|mp3|wav), in order:
   1. transcript   <name>.md beside it; if missing, build/transcribe_family.py makes it (Whisper through the OpenAI API, only
                   with --go and OPENAI_API_KEY set; otherwise skipped with a note)
   2. items        <name>.items.json (the item list cut_family_clips.py needs: qid, at, ids, Kutchi, English). If missing, the
                   question ids heard in the transcript are counted; --draft-items writes <name>.items.draft.json with qid and
                   time filled, for you to add the words (never invent Kutchi: copy them from the notes Zafar typed)
   3. cut          build/cut_family_clips.py <rec> --items ... (--go only): clips trimmed and loudness-normalised to -16 LUFS,
                   merged into data/family-audio.json
   4. loudness     measures every clip of this source with ffmpeg (EBU R128); lists clips more than --tol LU off -16
                   (clips under 0.5 s are too short to measure and are counted apart)
   5. engine       node build/lang/import_all.mjs (--go writes data/lang/; a dry run uses --check and writes nothing), then
                   prints the gap list's counts and the clips still waiting for Zafar's ear (lab/family-audio.html)
  Default is a dry run: it reads, measures and prints what --go would do; nothing is written. Steps 1 and 3 call the
  OpenAI API through the existing Python scripts and only run with --go. Then: write the answers into grammar-notes,
  lexicon and build/lang/hand/ (decision 40), re-run with --go, and send Zafar the spellings to confirm.`;
const a = args(); help(HELP, a);
const GO = a.has("go"), TOL = +a.val("tol", 3), TARGET = -16;
if (!a.pos[0]) die("Give the folder of recordings (e.g. sources/audio/mum-2026-10-05). --help shows the steps.");
const dir = resolve(a.pos[0]);
if (!existsSync(dir) || !statSync(dir).isDirectory()) die(`No folder ${a.pos[0]}.`);
const recs = readdirSync(dir).filter((f) => /\.(m4a|mp3|wav|ogg|aac)$/i.test(f)).sort();
if (!recs.length) die(`No recordings in ${rel(dir)}.`);
console.log(`${GO ? "RUN" : "DRY RUN"}: ${recs.length} recording(s) in ${rel(dir)}`);

const hasKey = !!process.env.OPENAI_API_KEY;
const manifestPath = join(ROOT, "data", "family-audio.json");
const QID = /\b([A-Z]{1,2}\d{1,3}(?:\.\d{1,2})?)\b/g;
const toSec = (t) => t.split(":").reduce((s, x) => s * 60 + +x, 0);
const todo = [];

for (const r of recs) {
  const stem = basename(r, extname(r)), recPath = join(dir, r);
  const md = join(dir, `${stem}.md`), items = join(dir, `${stem}.items.json`);
  console.log(`\n${r}`);
  // 1. transcript
  if (existsSync(md)) console.log(`  transcript  have ${rel(md)}`);
  else if (GO && hasKey) { sh("python3", ["build/transcribe_family.py", recPath, md]); console.log(`  transcript  made ${rel(md)}`); }
  else { console.log(`  transcript  missing: ${GO ? "no OPENAI_API_KEY, skipped" : "--go would run build/transcribe_family.py"}`); todo.push(`${r}: transcript`); }
  // 2. items
  const qids = [];
  if (existsSync(md)) for (const line of readFileSync(md, "utf8").split("\n")) {
    const m = /^\s*-\s*\*\*(\d+(?::\d\d)+)\*\*\s*(.*)$/.exec(line);
    if (!m) continue;
    for (const q of m[2].matchAll(QID)) if (!qids.some((x) => x.qid === q[1])) qids.push({ qid: q[1], at: toSec(m[1]) });
  }
  if (existsSync(items)) {
    const n = JSON.parse(readFileSync(items, "utf8")).reduce((s, q) => s + (q.items || []).length, 0);
    console.log(`  items       have ${rel(items)} (${n} words)`);
    // 3. cut
    if (GO && hasKey) { const out = sh("python3", ["build/cut_family_clips.py", recPath, "--items", items]); console.log(`  cut         ${out.split("\n").slice(-2).join(" | ")}`); }
    else console.log(`  cut         ${GO ? "no OPENAI_API_KEY, skipped" : `--go would run build/cut_family_clips.py ${rel(recPath)} --items ${rel(items)}`}`);
  } else {
    console.log(`  items       missing: ${qids.length} question ids heard in the transcript${qids.length ? " (" : ""}${qids.slice(0, 4).map((q) => q.qid).join(", ")}${qids.length > 4 ? ", ..." : ""}${qids.length ? ")" : ""}${qids.length ? "" : ": Whisper may have misheard the ids (\"Aai one\" for I1); give each question's time by hand"}`);
    if (a.has("draft-items") && qids.length) {
      const draft = join(dir, `${stem}.items.draft.json`);
      writeFileSync(draft, JSON.stringify(qids.map((q) => ({ qid: q.qid, at: q.at, items: [{ id: "", kutchi: "", english: "" }] })), null, 1) + "\n");
      console.log(`              wrote ${rel(draft)}: fill id, kutchi, english from the notes, then rename to .items.json`);
    } else todo.push(`${r}: item list (--draft-items starts one)`);
  }
}

// 4. what the manifest holds for these recordings, and their loudness
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const mine = manifest.filter((x) => x.source && recs.some((r) => x.source === rel(join(dir, r))));
const withFile = mine.filter((x) => x.file);
const unchecked = withFile.filter((x) => !x.checked), low = withFile.filter((x) => x.confidence === "low"), skipped = mine.filter((x) => !x.file);
console.log(`\nManifest: ${withFile.length} clips from these recordings (${low.length} flagged low, ${unchecked.length} not yet heard by Zafar), ${skipped.length} skipped rows`);

async function loud(file) {
  return new Promise((res) => {
    const p = spawn("ffmpeg", ["-nostats", "-hide_banner", "-i", join(ROOT, file), "-af", "ebur128=peak=true", "-f", "null", "-"]);
    let err = ""; p.stderr.on("data", (d) => (err += d));
    p.on("close", () => {
      const s = err.slice(err.lastIndexOf("Summary"));
      const i = /I:\s+(-?[\d.]+) LUFS/.exec(s), dur = /Duration: (\d+):(\d+):([\d.]+)/.exec(err);
      res({ file, lufs: i ? +i[1] : null, dur: dur ? +dur[1] * 3600 + +dur[2] * 60 + +dur[3] : 0 });
    });
    p.on("error", () => res({ file, lufs: null, dur: 0 }));
  });
}
if (!a.has("no-loudness") && withFile.length) {
  const files = withFile.map((x) => x.file).filter((f) => existsSync(join(ROOT, f)));
  const out = [], pool = Math.max(2, cpus().length);
  for (let i = 0; i < files.length; i += pool) out.push(...(await Promise.all(files.slice(i, i + pool).map(loud))));
  const measured = out.filter((x) => x.dur >= 0.5 && x.lufs != null && x.lufs > -70);
  const off = measured.filter((x) => Math.abs(x.lufs - TARGET) > TOL).sort((p, q) => Math.abs(q.lufs - TARGET) - Math.abs(p.lufs - TARGET));
  const mean = measured.reduce((s, x) => s + x.lufs, 0) / (measured.length || 1);
  console.log(`Loudness: ${measured.length} measured, mean ${mean.toFixed(1)} LUFS (target ${TARGET}), ${off.length} more than ${TOL} LU off; ${out.length - measured.length} too short to measure; ${withFile.length - files.length} files missing`);
  for (const x of off.slice(0, 5)) console.log(`  ${x.lufs.toFixed(1)} LUFS  ${x.file}`);
  if (off.length > 5) console.log(`  ... and ${off.length - 5} more`);
  if (off.length) todo.push(`${off.length} clips off loudness: re-cut them (cut_family_clips.py normalises), never hand-edit`);
}

// 5. engine and gap counts
if (!a.has("no-engine")) {
  const t0 = Date.now();
  const out = sh("node", ["build/lang/import_all.mjs", ...(GO ? [] : ["--check"])], { soft: true });
  const tail = out.split("\n").filter((l) => /^(store errors|validator|wrote|written)/i.test(l.trim())).slice(-3);
  console.log(`\nEngine (${GO ? "import_all" : "import_all --check, nothing written"}, ${Math.round((Date.now() - t0) / 1000)} s): ${tail.join(" | ") || "no summary printed"}`);
}
const gap = join(ROOT, "data", "lang", "reports", "gap-list.md");
if (existsSync(gap)) {
  console.log(`${("Gap list" + (GO ? "" : " (as committed)") + ":").padEnd(64)} Cook | Clinic`);
  for (const line of readFileSync(gap, "utf8").split("\n")) {
    const m = /^\| ([^|]+?) \| (\d+) \| (\d+) \|$/.exec(line);
    if (m) console.log(`  ${m[1].slice(0, 60).padEnd(62)} ${m[2].padStart(4)} | ${m[3].padStart(4)}`);
  }
}
console.log(todo.length ? `\nTo do: ${todo.join("; ")}` : "\nNothing left to do for these recordings.");

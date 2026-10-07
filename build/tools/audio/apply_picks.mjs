#!/usr/bin/env node
/**
 * Apply Zafar's clip picks from the review page (S02-D, decision 67).
 *
 * Input: the "Copy my picks" list, one `speaker/id=N` per line (N = candidate rank, or `k` = keep current).
 * For each pick N it copies assets/audio/family-candidates/<speaker>/<id>/<N>.mp3 to
 * assets/audio/family/<speaker>/<id>-rc.mp3 (a new name: the old file is never overwritten or deleted),
 * points the manifest entry at it, records the old file and times (old_file, old_start, old_end), sets the
 * take's source times and checked: "ok-zafar". A `k` pick only sets checked: "ok-zafar" on the current clip.
 *
 * Usage: node build/tools/audio/apply_picks.mjs picks.txt [--dry-run]     (or pipe the list on stdin)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const MANIFEST = path.join(ROOT, "data/family-audio.json");
const CANDS = path.join(ROOT, "data/family-audio-candidates.json");

const args = process.argv.slice(2);
// --status=ok-auto marks the orchestrator's own picks (decision 70); Zafar's picks stay ok-zafar
const STATUS = (args.find((a) => a.startsWith("--status=")) || "--status=ok-zafar").split("=")[1];
const dry = args.includes("--dry-run");
const file = args.find((a) => !a.startsWith("--"));
const text = file ? fs.readFileSync(file, "utf8") : fs.readFileSync(0, "utf8");

const picks = [];
for (const raw of text.split(/[\n,;]+/)) {
  const s = raw.trim();
  if (!s) continue;
  const m = s.match(/^(mum|zafar)\/([^=\s]+)\s*=\s*(k|\d+)$/);
  if (!m) { console.error(`skipped, not a pick: ${s}`); continue; }
  picks.push({ speaker: m[1], id: m[2], pick: m[3] });
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
const cands = JSON.parse(fs.readFileSync(CANDS, "utf8"));
const byKey = new Map(cands.lines.map((l) => [l.key, l]));
let changed = 0;
const copies = [];
for (const p of picks) {
  const key = `${p.speaker}/${p.id}`;
  const entry = manifest.find((e) => e.id === p.id && e.speaker === p.speaker);
  if (!entry) { console.error(`no manifest entry for ${key}`); continue; }
  if (p.pick === "k") {
    console.log(`${key}: keep ${entry.file} (checked ${entry.checked ?? "-"} -> ok-zafar)`);
    entry.checked = STATUS;
    changed++;
    continue;
  }
  const c = byKey.get(key)?.candidates.find((x) => String(x.rank) === p.pick);
  if (!c) { console.error(`${key}: no candidate ${p.pick}`); continue; }
  let to = `assets/audio/family/${p.speaker}/${p.id}-rc.mp3`;
  for (let n = 2; fs.existsSync(path.join(ROOT, to)) && to !== entry.file; n++) to = `assets/audio/family/${p.speaker}/${p.id}-rc${n}.mp3`;
  console.log(`${key}: ${entry.file} -> ${to} (take ${c.rank}, ${path.basename(c.source)} ${c.start}-${c.end} s, score ${c.score})`);
  copies.push([path.join(ROOT, c.file), path.join(ROOT, to)]);
  if (!entry.old_file) Object.assign(entry, { old_file: entry.file, old_start: entry.start, old_end: entry.end, old_source: entry.source });
  Object.assign(entry, { file: to, source: c.source, start: c.start, end: c.end, checked: STATUS });
  entry.note = `${entry.note ? entry.note + "; " : ""}re-clipped (S02-D2, blind-verified), Zafar picked take ${c.rank}`;
  changed++;
}
console.log(`${changed} entries ${dry ? "would change (dry run, nothing written)" : "changed"}`);
if (!dry && changed) {
  for (const [a, b] of copies) fs.copyFileSync(a, b);
  // The manifest's own layout: one entry per line, Python-style ", " and ": " separators.
  const row = (e) => JSON.stringify(e).replace(/("(?:[^"\\]|\\.)*")|([,:])/g, (m, str, p) => str ?? p + " ")
    .replace(/("(?:old_)?(?:start|end)": -?\d+)(?=[,}])/g, "$1.0");
  fs.writeFileSync(MANIFEST, "[\n" + manifest.map(row).join(",\n") + "\n]\n");
}

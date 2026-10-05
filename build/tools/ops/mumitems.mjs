#!/usr/bin/env node
// Rebuild a recording's item list (the --items file of build/cut_family_clips.py, and <stem>.items.json for mumround.mjs) from
// data/family-audio.json, which keeps every cut take's id, Kutchi, English, question, speaker and times.
//   node build/tools/ops/mumitems.mjs <recording or folder> [--out dir] [--write]    (dry run unless --write)
// One list per recording: questions in the order first heard; "at" is the first take's start minus 3 s (where the question was read);
// every item pins each speaker's take ([start, end], pinned takes pad only into quiet) or skips that speaker with the manifest's own reason
// ("skip: not cut in the original run" when the manifest has no row). Takes the old run skipped keep their rows (file null).
// A replay is faithful to the words and takes, not byte for byte: the manifest stores the padded times, and a pin pads into quiet again.
import { readFileSync, writeFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join, basename, resolve, relative } from "node:path";
import { ROOT, args, help, die } from "./lib.mjs";

const a = args();
help(`node build/tools/ops/mumitems.mjs <recording|folder> [--out dir] [--write]
  Writes <stem>.items.json beside each recording (or in --out) from data/family-audio.json. Dry run (counts only) without --write.`, a);
if (!a.pos[0]) die("Give a recording (sources/audio/mum-2026-10-05/I1-I35.m4a) or a folder of them.");
const target = resolve(a.pos[0]);
if (!existsSync(target)) die(`No ${a.pos[0]}.`);
const recs = statSync(target).isDirectory() ? readdirSync(target).filter((f) => /\.(m4a|mp3|wav|ogg|aac)$/i.test(f)).map((f) => join(target, f)) : [target];
const manifest = JSON.parse(readFileSync(join(ROOT, "data", "family-audio.json"), "utf8"));
const r1 = (x) => Math.round(x * 100) / 100;

for (const rec of recs) {
  const src = relative(ROOT, rec);
  const rows = manifest.filter((r) => r.source === src);
  if (!rows.length) { console.log(`${src}: no rows in the manifest, nothing to rebuild`); continue; }
  const speakers = [...new Set(rows.map((r) => r.speaker))].sort();
  const questions = new Map();
  for (const r of rows) {
    if (!questions.has(r.qid)) questions.set(r.qid, new Map());
    const items = questions.get(r.qid);
    if (!items.has(r.id)) items.set(r.id, { id: r.id, kutchi: r.kutchi, english: r.english, rows: {} });
    items.get(r.id).rows[r.speaker] = r;
  }
  const list = [];
  let pinned = 0, skipped = 0, noAt = 0;
  for (const [qid, items] of questions) {
    const starts = rows.filter((r) => r.qid === qid && r.file && r.start != null).map((r) => r.start);
    const q = { qid };
    if (starts.length) q.at = r1(Math.max(0, Math.min(...starts) - 3)); else noAt++;
    q.items = [...items.values()].map((it) => {
      const o = { id: it.id, kutchi: it.kutchi, english: it.english };
      for (const sp of speakers) {
        const row = it.rows[sp];
        if (row && row.file && row.start != null) { o[sp] = [r1(row.start), r1(row.end)]; pinned++; }
        else { o[sp] = `skip: ${row ? row.note || "skipped in the original run" : "not cut in the original run"}`; skipped++; }
      }
      const note = (it.rows.mum || it.rows[speakers[0]] || {}).note;
      if (note) o.note = note;
      return o;
    });
    list.push(q);
  }
  const out = join(a.val("out") ? resolve(a.val("out")) : join(rec, ".."), `${basename(rec).replace(/\.[^.]+$/, "")}.items.json`);
  console.log(`${src}: ${list.length} questions, ${list.reduce((s, q) => s + q.items.length, 0)} items, ${pinned} pinned takes, ${skipped} skipped speaker slots${noAt ? `, ${noAt} question(s) with no take (no "at")` : ""} -> ${relative(ROOT, out)}${a.has("write") ? "" : " (dry run)"}`);
  if (a.has("write")) writeFileSync(out, JSON.stringify(list, null, 1) + "\n");
}

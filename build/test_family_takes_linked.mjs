// LNG-20 (probes-open, run 16): every usable family take (data/family-audio.json, approved "game") is linked to a word form or a
// meaning in the clip index (data/lang/clips.json, built by build/lang/import_all.mjs), or is marked unused ("unused": true, with
// why); a take on file that the game can never play is a gap (e.g. 'Khuda hafiz!' spelt differently, the potato takes, the
// "one X, two Xs" takes that hold two phrases and need splitting).   node build/test_family_takes_linked.mjs  (exit 1 on an orphan)
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const takes = JSON.parse(readFileSync(join(ROOT, "data/family-audio.json"), "utf8"));
const linked = new Set(JSON.parse(readFileSync(join(ROOT, "data/lang/clips.json"), "utf8")).clips.map((c) => c.clip));
const usable = takes.filter((t) => t.approved === "game" && !t.unused);
const orphans = usable.filter((t) => !linked.has(t.id));
const ids = [...new Set(orphans.map((t) => t.id))];
if (ids.length) {
  console.error(`FAIL: ${ids.length} usable take ids (${orphans.length} takes) linked to no word or meaning and not marked unused:`);
  for (const id of ids.slice(0, 40)) { const t = orphans.find((x) => x.id === id); console.error(`  ${id}: "${t.kutchi}" (${t.english})`); }
  if (ids.length > 40) console.error(`  ... and ${ids.length - 40} more`);
  process.exit(1);
}
console.log(`ok: all ${usable.length} usable takes are linked or marked unused`);

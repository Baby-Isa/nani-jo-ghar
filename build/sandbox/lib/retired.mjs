#!/usr/bin/env node
// Contract check 6 (decision 75): no old art drawn where a replacement exists. The retired list,
// build/sandbox/data/retired-art.json, is made here from the art manifests' own "replaces" entries plus the named
// ones Zafar caught (8 Oct: the Chop tile's hand-and-knife, Nani standing behind a cut-out counter in Cook service):
//   node build/sandbox/lib/retired.mjs --write        (re-make it; run again after an art manifest gains a "replaces")
// Each entry: {file, sha256, by (its replacement), why, scope (a stage pattern, or null: anywhere)}. A file is matched by
// its path AND its content: a picture redrawn under the same name (new content) no longer matches, so swapping the art
// under the same key or file (S04-C's leaning Nani) clears the finding without editing this list.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
export const RETIRED_FILE = join(ROOT, "build", "sandbox", "data", "retired-art.json");
const sha = (f) => (existsSync(join(ROOT, f)) ? createHash("sha256").update(readFileSync(join(ROOT, f))).digest("hex").slice(0, 16) : null);
const J = (f) => JSON.parse(readFileSync(join(ROOT, f), "utf8"));

// Zafar's named items are pinned to the content they had on 8 Oct: a picture swapped in under the same name must never be
// re-hashed into the list (S04-C redrew Nani under the same files, so hashing them today would retire the new leaning Nani)
const PINNED = {
  "assets/cook/items/tool-knife-t.webp": "0cc84a15120f58fd",
  "assets/cook/items/tool-knife-t.png": "bf7441643967432e",
  "assets/cook/hands/nani/b1-handle-grip-t.webp": "52d78f97d873894b",
  "assets/cook/hands/player-boy/b1-handle-grip-t.webp": "a13cd1af22a8a459",
  "assets/cook/hands/player-girl/b1-handle-grip-t.webp": "b934ae68384e5e6d",
  "assets/cook/characters/nani-neutral.webp": "6d2565900651707c",
  "assets/cook/characters/nani-talk.webp": "6d2565900651707c",
  "assets/cook/characters/nani-happy.webp": "6d2565900651707c",
  "assets/cook/characters/nani-point.webp": "6d2565900651707c",
};
export function build() {
  const out = [];
  const add = (file, by, why, scope = null) => { if (!out.some((e) => e.file === file && e.scope === scope)) out.push({ file, sha256: PINNED[file] || sha(file), by, why, scope }); };
  // 1. the clinic's sheets: remap old single-view picture -> the sheet view that replaces it
  const sheets = J("data/clinic/sheets.json");
  for (const [old, now] of Object.entries(sheets.remap || {})) if (!old.startsWith("_")) add(old, now, "data/clinic/sheets.json remap");
  // 2. the clinic's rough art: final.replaces (rough sprite id -> the final sprite that stands in for it)
  const rough = J("data/clinic/rough-art.json");
  const file = (id) => rough.sprites[id] && rough.sprites[id].file;
  for (const [old, now] of Object.entries((rough.final || {}).replaces || {})) if (file(old) && file(now)) add(file(old), file(now), "data/clinic/rough-art.json final.replaces");
  // 3. named by Zafar, 8 Oct (Z8): the Chop tile's old hand-and-knife; the new knife is the kit's s02 knife (DAAR-13, ART-17)
  for (const f of ["assets/cook/items/tool-knife-t.webp", "assets/cook/items/tool-knife-t.png"]) add(f, "assets/cook/items/tool-knife-t-v2.webp", "Z8 (8 Oct): the old knife in the hand; the new knife has no hand");
  for (const who of ["nani", "player-boy", "player-girl"]) add(`assets/cook/hands/${who}/b1-handle-grip-t.webp`, "assets/cook/items/tool-knife-t-v2.webp", "Z8 (8 Oct): the hand holding the old knife at the chopping board", "cook:*:wood");
  // 4. named by Zafar, 8 Oct (Z9, decision 64): Nani standing behind a cut-out counter in Cook's service view; she leans on
  // the counter (her counter sheet). Matched by content: S04-C swaps the leaning picture in under the same keys
  for (const m of ["neutral", "talk", "happy", "point"]) add(`assets/cook/characters/nani-${m}.webp`, "Nani leaning on the counter (decision 64, ART-13)", "Z9 (8 Oct): the standing Nani sprite in service", "cook:*:service");
  return out.filter((e) => e.sha256);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const list = build();
  if (process.argv.includes("--write")) {
    mkdirSync(dirname(RETIRED_FILE), { recursive: true });
    writeFileSync(RETIRED_FILE, JSON.stringify({ _about: "Made by build/sandbox/lib/retired.mjs --write from the art manifests' replaces entries and Zafar's named items: don't hand-edit. Contract check 6 flags any of these files drawn with this content (scope: a stage pattern, null = anywhere).", list }, null, 1) + "\n");
    console.log(`retired-art.json: ${list.length} files`);
  } else console.log(JSON.stringify(list, null, 1));
}

#!/usr/bin/env node
// The family clips' release status (Zafar, 12 Nov): every family recording so far is approved for the game now, not for
// the app stores; everything is re-recorded properly before the stores. Each clip in data/family-audio.json carries
// `approved`: "game" (plays in the game now, before any ear check) or "final" (store-ready). The ear check in
// lab/family-audio.html can still drop a bad take (`checked: "redo"`: never plays). docs/language/fill-the-engine.md § 4.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { ROOT, args, help } from "./lib.mjs";

const HELP = `
node build/tools/ops/storeaudio.mjs [--check] [--list]
  default   the STORE gate: exit 1 while any clip that can play (a file, not marked redo) is short of "final".
            A store build runs this first and stops on a failure.
  --check   the GAME check (checks.mjs runs it): exit 1 only when a playable clip has no release status
            ("game" or "final"); prints how far the store gate is from passing.
  --list    also list the clips short of "final".`;

export const STATUSES = ["game", "final"];

/** Pure: a manifest list -> the counts both gates read. */
export function releaseStatus(list) {
  const rows = (list || []).filter((e) => e && e.file);
  const dropped = rows.filter((e) => e.checked === "redo");
  const playable = rows.filter((e) => e.checked !== "redo");
  const missing = playable.filter((e) => !STATUSES.includes(e.approved));
  const final = playable.filter((e) => e.approved === "final");
  const game = playable.filter((e) => e.approved === "game");
  const short = playable.filter((e) => e.approved !== "final");
  return { playable: playable.length, game: game.length, final: final.length, dropped: dropped.length, missing, short };
}

/** Pure: {ok, text} for the store gate (store = true) or the game check. */
export function verdict(r, { store = true } = {}) {
  const counts = `${r.playable} playable family clips: ${r.game} "game", ${r.final} "final"${r.missing.length ? `, ${r.missing.length} with no release status` : ""} (${r.dropped} dropped by the ear check)`;
  if (store) return { ok: r.short.length === 0, text: r.short.length ? `STORE BUILD BLOCKED: ${r.short.length} of ${counts} are short of "final" (Zafar, 12 Nov: re-record before the stores)` : `store gate passes: ${counts}` };
  return { ok: r.missing.length === 0, text: `${counts}; ${r.short.length ? `a store build would fail (${r.short.length} short of "final")` : "a store build would pass"}` };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const a = args();
  help(HELP, a);
  const r = releaseStatus(JSON.parse(readFileSync(join(ROOT, "data", "family-audio.json"), "utf8")));
  const v = verdict(r, { store: !a.has("check") });
  console.log(v.text);
  const show = a.has("check") ? r.missing : a.has("list") ? r.short : [];
  for (const e of show.slice(0, a.has("list") ? 1e9 : 10)) console.log(`  ${e.approved || "(none)"}  ${e.id} (${e.speaker})  ${e.file}`);
  process.exit(v.ok ? 0 : 1);
}

# Step 3, R2 "The core"

Branch `ccr-fcd9dddd-wnywzc`. No live page, mode or shared file changed; R4/R5 wire the core.

## What exists (`js/core/`, ES modules)
`save` (schema 2, same API and keys), `progress` (G23), `score` (three badges; no stars), `wallet`, `voice`, `lang/` (the seam), `context`, `unlocks` + `Entitlements`, `settings`, `content` (versions), `log`, `types`, `index` (`loadCore()`). Data: `economy`, `progress`, `unlocks`, `map` (versioned). `bump_version.py` writes an import map into opted-in pages (+ `--dry-run`, `--stamp`); today's output is byte-identical. In Chromium every module loads by name, stamped.

## Save migration
Per player: Cook's `words` → `words`; Cook's and the clinic's coins → one `wallet`; root gets `lang: "kutchi"`. Old keys untouched; gains on old-code pages are picked up, losses never. Tested on a save captured from the live pages, pre-shell keys, two players, a lost root, schema-1 imports, and the classic save reading schema 2 unchanged.

## Economy (rounds between upgrades, 300 children each)
| | first four (10–15 coins) | next eight (40–80) |
|---|---|---|
| learning | 2.6–3.5 | 4.8–6.7 |
| steady | 2.3–2.9 | 3.9–5.3 |
| strong | 1.9–2.4 | 3.2–4.3 |

## The seam
9,520 Cook lines (all recipes, L1–L4, 8 seeds) match word for word; the voice plan matches today's playback (165 lines). Gaps: orders pass as ladders; "with", "and", "times" and headlines are English; 8 nouns of unknown gender get the he-form unflagged (khun, dungri …); no register or verbs; the clinic's Kutchi; word timing; no single lexicon. Store path: 30 everyday words (ba, muke, khape …) have no OK clip.

## Checks
`node --test build/core/` 42 pass; shared 117 pass; lint and ratchet 6 pass. Sandbox `--check` (clean worktree of this branch): quick run passed; 844x390, 800x360, 1366x768 complete: 111/111 flow-sizes reach their end, 0 new findings, 0 page errors. Stopped there as asked: no live page changed, so the full run happens at the gate.

## For the orchestrator
- Docs: target-model § 3.4 (+`unlocks`, `settings`), testing.md. `family-voice.js` 47–60 still plays unchecked clips.
- R4/R5: drop the classic `save.js` tag on module pages; `economy.json` prices replace `cook.json`'s; pass `round.play` to `Score.finish`; the clinic's Kutchi must become data. `map.json` is a start for R3b.
- Zafar: (1) a "game" = one round? (2) model voice follows the character (girl → Mum)? (3) oldest-iPad check once a module page is live; (4) stage 5 is new; (5) Pages keeps stand-in voices; only the store app or `?voice=store` is OK-clips-only.

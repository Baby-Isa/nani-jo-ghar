# s20-lang-khapeti: the orders' agreeing endings; no loon (14 Nov)

Branch `s20-lang-khapeti`, never pushed. The brief names no fix-list row, so there is no before/after evidence folder (`evidence.mjs --after`: "names no fix-list row").

## What changed
- **Endings (decision 27):** Cook's order frames (`data/cook.json` meanings `need`, `need_waari`) name the engine's polite register, whose want already agrees with the thing (§1, §31, §58); `js/cook/words.js` passes a frame's register to the engine. Every order now says khapeti / khapanti / khapeto / khapanta by gender and count. Full before/after table: `build/reports/s20-lang-khapeti-orders.md` (47 lines, every kitchen game, L1-L4). Examples: Muke chai khape → khapeti; Muke ba samosa khape → khapanta; Muke ba maani khape → khapanti; Muke hakro bafelo indo khape → khapeto.
- **'na khape' stays as Mum said it.** The engine's agreement rule doesn't clearly cover it: in her refusals the agreement is on nato / nati and khape stays (§11, §24 B1).
- **Not changed:** the chai sugar row's own frame (WantIn, "Munji chai me … khape") is built but never said (its row is said inside the headline). The engine's polite form for it is Mum's *wijij*, a different sentence, so Zafar decides. Need lines outside the kitchen (clinic, prototypes) still say khape.
- **loon:** the clinic seed (`loon`, `spi-16`) and the foot game's `words.loon` (and its audio, Mum's mitho clip) now say mitho. Ids are kept. n.salt-2 is gone, and loon is listed as "not Kutchi".
- **Akho burichad (Zafar, 14 Nov):** a draft fixed line (`guide-fill-full`, guide `chai-tray:pour-again`) for chai L4's second pour of a full glass. The first pour keeps *Iloka je glass me wij*. Heard in the L4 run's sound log.
- Two core tests take the new headline (`cook-orders-kutchi`, `chai104-headline-amount`), and the cook-tts test lists loon.

## New recording lines needed (for the sheet's owner; the sheet itself is back to base)
- khapeto: want, he-thing, one ("Muke dudh khapeto"): no single-word clip
- khapanta: want, he-thing, more than one ("Muke ba samosa khapanta")
- khapanti: want, she-thing, more than one ("Muke ba maani khapanti")
- akho burichad: "Fill it up all the way", chai L4's second pour (spelling to confirm by Mum)

## Proof
- `node --test build/lang/`: 61 pass, 0 fail. `node build/lint/words.mjs`: report-only, strict gate 0 literals. Leak: checks.mjs's 14 configs ok; `leak.mjs cook`: ok; clinic-heal-foot: PASS.
- `checks.mjs`: 14 steps ok. The recordings step will be stale until the sheet's owner adds the lines above.
- Contract (`s20-lang-khapeti-contract`, four sizes): every flow reached its end, 0 page errors. 4 breaks: contract-78 ×3 ("Samosa hane kadh.") and contract-109 ×1. The base has the same breaks (`s20-lang-khapeti-base-samosa`). Chai L4: one contract-78 at the second pour, also on the base.
- Chai's order pictures (all show khapeti): `build/screenshots/labcheck/s20-lang-khapeti/740x320-mode=cook_game=chai_tray_level=1_nonav=1_seed=7_speed=3.png`, `…/740x320-…level=4…png`, `…/1280x665-…level=1…png`, `…/1280x665-…level=4…png`.
- check-change (tier 2, `build/screenshots/tiers/change-05845cdbc8/logs/`): not finished. The push step failed only on the recording sheet (left stale on purpose). The scope step lists 1781 files, measured against an old base tree (1e85a893d6), not this branch. The play stage was still running after 50 minutes (44 chai and eggs flows reached their end, 0 page errors) and my timeout stopped it.

## For the orchestrator (outside this brief's files)
- **Probes and contract-119** match the old text: contract-119's `/\bkhape\b/` (build/sandbox/lib/contract-wo.mjs) no longer sees an order line, and these probes too: SH-70, CHAI-05, MAA-02, CHT-07, SEK-01, CK-64, SH-267. Chai's frozen reference says khape.
- Kutchi loon is still in files I don't own: data/content.json (handout), data/cook-tts.json, data/monsoon-audio.json, data/audio-manifest.json (parked TTS) and a note in data/stations/baking.json.
- Drafts: sekelo, naan and makai have no gender yet, so they take the he-form (khapeto/khapanta), flagged.

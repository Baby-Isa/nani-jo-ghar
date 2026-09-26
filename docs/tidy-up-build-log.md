# Tidy up: build log (phases 0 and 1)

**Date:** 25 Sept 2026. **Branch:** `claude/build-tidy`. **Spec:** `docs/modes/tidy-up-design.md` (deep dive D.1–D.9, 8.1, 8.4, section 12), `docs/modes/BUILD-COMMON.md`. Every default in the design doc taken.

## What's built

| Piece | File(s) | Notes |
|---|---|---|
| Data | `data/tidy.json` | Games T1–T4, levels (only what changes), mechanics knobs, placeholders (`kutchi: null`), row grammar, relations stand-in, star set with the voice star. Fruit, veg, spice nouns and numbers borrowed from `data/content.json`. |
| Scene sidecars | `data/scenes/kitchen-tidy.json`, `sitting-room-tidy.json`, `worktop-tidy.json` | Spots with relation tags, neighbour graph, caps, `lv`, convention layouts. Boards: shelves; cloth (H view, D.9.2); masala dabba and the fruit box (T view). |
| Generator | `js/tidy/rules.js` | `Rules.make` for K1–K4 on T1, T2, T3; the four per-round solver checks with re-rolls (cap 100); `phrase`, `view`, `grade`, `liveWrong`, `aliListens`. Pure JS: runs in the page and in Node. |
| Leak bot | `js/tidy/bot.js`, `build/leak_tidy.mjs` | 8.4's strategies plus `random` and `nameswrong`; Ali's turn by pills. |
| Engine | `js/tidy/engine.js` | Zones (own design space each), host, view (greybox), sidebar ladder, intro card, help ladder (6.2), K0 pebble demo, Busy clock, result card with word review, test hooks. |
| Mechanics | `js/tidy/mechanics/{place,pack,stack,check,paw,tell}.js` | One verb per file, knobs from data. |
| Mini-games | `js/tidy/games/{putaway,dastarkhwan,box,ali}.js` | T1, T2 (fetch-and-lay at L3: two zones routed by channel), T3 (lid and ribbon), T4. |
| Lab | `tidy.html`, `css/tidy.css`, `js/tidy/lab.js` | Game × board × kind × level, Nani helps, Busy, Paw, Grandparent, Voice off, Show spots, word stage 1–4, rule inspector, non-speaker bot, mechanics alone. |
| Tests | `build/test_tidy.py` | `--lab`, `--sizes`, `--rel`, `--gen`, `--bot`. Port `COOK_TEST_PORT`, default 8802. |

## Stubs (swap = one line each)

| Stub | Stands in for | API |
|---|---|---|
| `js/tidy/stubs/rel.js` | `js/shared/rel.js` + `data/relations.json` | `Rel.holds(state, rule, scene)`, `Rel.options(state, rule, scene)` |
| `js/tidy/stubs/say.js` | the foundation's `say` moment | `Tidy.Say.moment({ask, choices, answer, timeoutMs, parent}) → {choice, by}`; **calls** `js/shared/speech.js` `Speech.listen` (family recordings as templates), pills and parent tick as fallback |
| `js/tidy/stubs/fetch.js` | Cook's `fetch` | Cook's is Phaser-drawn; same verb in Tidy's DOM zones |
| `js/tidy/stubs/passme.js` | Cook's `passme` | same, in the sidebar |
| `data/tidy.json` `relations`, `star_sets.tidy` | the foundation's relation list and star rules | same shape as 8.1 |

## Decisions I had to take

1. **Masala dabba from level 2.** At level 1 the tin has only three places (middle, back, front); once one row fills the middle, no row keeps 3 options (G5). Level 2 adds left and right.
2. **No "next to" in the dabba.** Every katori touches the middle one, so a blind drop satisfies a next-to row about 1 time in 2. Next-to lives on the shelves and the cloth.
3. **Rule rows (class, "nothing") only in K4 rounds; a K3 round is all count rows.** D.5 puts K4 at level 3, but the level-3 knobs would otherwise add rule rows to every kind.
4. **Level 1 shelves show 8 spots, not ≤6** (4 places × 2). With 3 rows plus an extra, G1's "items + 3 free spots" needs 7. G1 wins.
5. **Places drawn uniformly, full or not** (a full place re-rolls the round), so no place is said more often for being roomier. This is what made check 5 pass.
6. **Next-to options** = free spots ÷ satisfying spots (a blind drop's odds), not a count of places.
7. **Check 5 statistic.** Each place said: observed ÷ fair share (1/k of rows when k places were on offer) ≤ 1.5. A (thing, place) pair fails only if it's also over 4.1 SD (Bonferroni across ~2,000 cells).
8. **The neighbour graph is made symmetric at load** (a sidecar slot can only hold one neighbour per direction).
9. **Ali takes what he heard from the board if none is left on the tray**, and if the named place is full he clears something no right row needs.
10. **The tray keeps one fixed slot per kind**, so nothing slides when a kind is used up.
11. **No persistence in phase 1.** The lab's word-stage override replaces progress. Nothing is written to storage.
12. **Placeholders added:** people (Nana, Ma, Ali, Big Ma), `ph-t-tray`, `ph-t-shelf`, anchors, relations, colours, tableware, class words, all `kutchi: null` with their Questions-for-Mum ids.

## Leak-bot numbers (`node build/leak_tidy.mjs --gen 1000 --bot 500`, seed 1)

**Generator:** 100% of 1,000 rounds pass the four per-round checks on every game × board × level × kind. Mean re-rolls are 0–7, the worst is 46. Place-level flat priors are 1.02–1.24 (limit 1.5).

One pair cell is flagged at seed 1: fru-05 in the box corners, L3 K3, 1.67×, z = 4.3. At 4,000 rounds on seeds 1, 3 and 4 the same board shows no flag (max place ratio 1.12), and seed 2 passes at 1,000. I read it as chance. The script still exits 1 on it at seed 1.

**Bot, ear-star rate over 500 rounds (worst cell per strategy):** convention 4.0%, trayorder 5.0%, elimination 6.0% (T1 L1), liveprobe 2.8%, prior 4.4%, copylast 5.0%, waiter 0%, random 4.6%, nameswrong 1.2%. **All under 10%.**

**Level 1 blind rates:** T1 1.4–6.0%, T2 0–3.0%, T3 0.4–3.6%. **Reader** (the English placeholder hole, reported apart): T1 L1 16%, T2 95–100% (every T2 word is a placeholder), T3 L1 9.6%.

**Ali's turn by pills alone:** L1 T1 6.2%, T2 3.2%, T3 6.6%; L2 0–3.2%; L3 0% (blind estimates match). By voice a bot scores 0.

## Browser tests

`python3 build/test_tidy.py --lab --sizes --rel` passes:
- `--rel`: 42/42 relation cases.
- `--lab`: T1 (shelves and dabba), T2, T3, T4 on each at levels 1–3, K2 and K4 included, through real taps and drags. Each round makes one deliberate mistake: at L1 it must cost a row; at L2+ it must bring a recast and a fix.
- `--sizes`: 915×375, 1366×768, 1440×900, 1280×800, iPad landscape and portrait.
- In every run: the tap-cover check before every tap, no text on items, identical dots while holding (G1, G2), no console errors.

Screenshots are in `build/screenshots/tidy/`, and I looked at them. What they caught, all fixed:
- the Done button fell off the phone sidebar;
- the portrait board jumped when Nani's line came and went;
- pass-me pictures filled the portrait sidebar;
- Simba's paw sat under items and could knock things after Done;
- the pass-me card showed the word whatever its stage;
- fruit in the box cells hid the tallies.

## Left for the next phase

- Phase 2: swap the stubs for `js/shared/rel.js`, `say`, which-one and the star rules; re-run `--bot 500` on the shared checker; register with the shell; the Find it basket as T1's tray.
- S3 (pass me reversed) and S4 aren't built.
- The recogniser is called, but not yet tried with a real microphone and the family's templates. Headless runs use the pills.
- Not yet built:
  - the `order` and `pair` mechanics (second set);
  - placement sounds per material;
  - the secrets album, records and upgrades;
  - the word-progress write-back;
  - "Tidy the house" free play.

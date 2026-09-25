# Who did it?: build log

## 25 Sept 2026: phases 0 and 1 (branch `claude/build-who`)

Built to `docs/modes/BUILD-COMMON.md` and the design doc's deep dive and section 12, with every default taken. Only this mode's own files were touched.

### What's built

| Piece | File | Notes |
|---|---|---|
| Case engine | `js/who/case.js` | Pure and seeded (Node and browser). Generates, solves and grades all four kinds: K1 one each, K2 keep who fits, K3 Nani guesses (`askNext`), K4 Tell Ali (`actOn`). `stars()` applies the ear rules (at least 2 tested clues; stage-1 words are taught, not tested; placeholder rows never count; a lucky guess never earns the ear), the craft star (par time at L1–2; fewest words for Tell Ali) and the voice star (mic or parent only) |
| Data | `data/who.json`, `data/scenes/sofa.json` | People (cats, Kasuku silent, Ali, Nana, 4 greybox guests), attributes, clue types, placeholder lines (including Ali's echo lines and Nani's question frames), mechanics levels, games G1–G5 with level knobs, the `a1c3-sweets` case, `star_set` with the voice star |
| Mechanics | `js/who/mechanics/{lineup,examine,accuse}.js` | One file each. `lineup` includes Cook's freePick idea (tap anything, then Done; graded afterwards) |
| Mini-games | `js/who/games/{look-closer,one-each,keep-who-fits,tell-ali}.js` | G3, G1, G2, G5; zones over the mechanics |
| Page and lab | `who.html`, `css/who.css`, `js/who/{flow,ui,suspect}.js` | `who.html?lab=1` |
| Stubs | `js/who/stubs/whichone.js`, `js/who/stubs/tell.js` | For the foundation's `whichone` and `js/shared/mechanics/tell.js` |
| Tests | `build/leak_who.mjs`, `build/test_who.py` | Node leak bot; Playwright play tests and UI bot (port 8803) |

### Leak bot (`node build/leak_who.mjs`, 10,000 rounds per game and level, Kutchi-real clue types)

Ear-star rate for the best blind strategy at each level:

| Game, level | Shape | Best blind strategy | Rate | D5 estimate |
|---|---|---|---|---|
| G3 Look closer L1 | 4 suspects × 3 items | Peek at all, then random | 1.4–1.7% | 1.6% |
| G3 L2 | 5 suspects, 2–3 clues | Row shape / tap half | 1.3% | — |
| G1 Who ate this one? L1 | 3 × 3 | Any (random, never-repeat, position…) | 3.4–4.1% | 3.7% |
| G1 L2 | 4 × 3 | Any | 1.3–1.8% | — |
| G2 Keep who fits L1 | 5 suspects, 2 clues | Row shape (half, then one) / tap half | 2.2% / 1.8% | ≈4% |
| G2 L2 | 5–6 suspects, 2–3 clues | Tap half / row shape | 0.8% | <5% |
| G5 Tell Ali L1–2 | 4–6 suspects, 4–6 words | Pills | **0% voice star**; solved by random pills 16.9% (L1) / 12.4% (L2), coins only | 0%; 6% solved |
| G4 Nani guesses L1 (logic only) | 6 cards, 4–5 questions | Random ✓/✗ | 6.3%; always-✓ 0% | 6.25% |

Tap-all, tap-none, tap-one, early accuse, the odd one out and waiting for the glow all score 0%. Every rule check passes on every case: one culprit at the end and none sooner; every clue removes someone; no single clue names the culprit from L2; the culprit no more distinctive than the median; one trace per look-alike group; a word on only one dimension per line-up; the culprit's slot uniform (chi-square under the p = 0.001 critical value everywhere).

### Play tests (`python3 build/test_who.py --lab --viewport all`)

G1, G2, G3 at L1–2 and G5 at L1–2 (bot voice, pills and a parent's tick), plus the Arc 1 Ch3 case, pass on all six sizes through real pointer events. Each game plays a case with a deliberate mistake (the recast runs, the ear star is lost) and a clean case (the ear star is earned; for G5 the voice star, never by pills). A tap-cover check runs before every tap, and the magnifier is dragged over every suspect's paws. Screenshots are in `build/screenshots/who/` (not committed).

### Decisions taken on the way

1. **The greybox is plain HTML in a scaled 1600×900 world, like Find it**, not Phaser. It's cheaper for grey shapes and tests; the art pass can change it.
2. **K1 eaters are drawn with replacement** (the same suspect can eat two sweets). With one each, a "never the same twice" bot would win 1 in 6.
3. **A word means one thing per line-up.** A generator bug let *tameto* be both held and on the paws; Tell Ali then looped because Ali couldn't tell which was meant. The generator now refuses such line-ups and the leak bot checks for them.
4. **G2 L1 has 2 clues, not 2–3**, because with Kutchi-real words only there are just two dimensions without the magnifier: held items and *vadho/nindho* (drafts, counted per D9.1). With `--all-words` it has 2–3.
5. **The magnifier is a lens you drag**; tapping a suspect always picks. So examining and picking never collide on touch.
6. **Nani guesses asks any question that splits the cards**, not the best halving one (that's G6's craft), so a round has 4–5 questions (6.25%, as D5 says).
7. **Pills are audio-only below word stage 3** (D4): tap to hear, tap again to tell Ali.
8. **The lab keeps nothing between visits**: pocket money is per page, word stages come from the lab's selector. `js/progress.js` takes over with the shell.
9. **`js/shared/mechanics/tell.js` is a stub in `js/who/stubs/`**, because BUILD-COMMON keeps `js/shared/` for the foundation (the brief's 12.2 said this agent would write it).

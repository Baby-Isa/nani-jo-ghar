# Round 5 for Mum: plan notes (paused, 30 Sept 2026, late)

Work in progress, saved so it can resume in the morning **when Zafar says go**. Nothing here has been shown to Mum.

## Inputs saved alongside

- `research-2026-09-30-grammar-checklist.md`: 21 grammar categories the engine needs. For each: what Mum has confirmed, what Sindhi/Kutchi sources predict, the open question, and minimal-pair test sentences. The Keine et al. paper itself couldn't be opened (proxy), so it's cited from the abstract only.
- `research-2026-09-30-game-inventory.md`: every sentence frame, verb, noun and English placeholder the game uses today, and the fragments. Section 7 is the short list of what Cook needs.
- The two Gemini blueprints and `README.md` in this folder.

## Proposed shape (not yet approved)

**Priorities:** grammar first (Zafar: the engine should build any sentence and need only words), then Cook (fixed fully before the clinic). About 60–75 minutes for the core, with "stop here" marks. **Session length not yet confirmed.**

1. **Part A, quick checks (~5 min):**
   - Round 4 Q1–Q15 (unanswered);
   - new Q16+ from Claude's unconfirmed assumptions: *{x} na* vs polite form, the green chutney, chutney and *chundo* genders, *lakri* order, *inke* vs naming the thing, green pepper, "tomorrow", *Muke sekelo khape*;
   - the handout words never confirmed: *atto, lasan, aadu, hardar, jeeru, rai, elchi, loon, lal marcha, trae, char, panj*.
2. **Section C, the grammar core (~25 min):** Round 4's C22–C154, kept with the same IDs. It already tests the big rules: "big/red/good" agreement, whose, I/you/he/she, my/your, need/want/like/can, every day, right now, "went" by a man and a woman, "ate the mango vs the maani" by Nana, Nani and "I", tomorrow, commands to a child, an elder and several children, "not", and questions.
3. **New Section L, the gaps (~15 min):** ID prefix L is unused so far. It fills what the checklist found Section C doesn't cover:
   - a possible third gender (a few *-u* words);
   - "we ate …";
   - "from", "near", "to", "with a spoon" (instrument);
   - compound verbs: put in, take out, eat it all up, finish;
   - "and / with / but / because / if / when / then";
   - Cook's **"with" for food** and **"and" between two kinds** (the inventory's biggest blocker);
   - a list of 3–6 items;
   - numbers 5–10;
   - "was / there is / there isn't / I have";
   - "we" (you and me) vs "we" (not you);
   - "call Nani / call the boy" (animate objects);
   - "the one that …";
   - "very / more / again".
4. **Part N, Nani's cooking lines (~10 min):** Round 4 N1–N23, plus the cooking verbs Cook has none of: chop, stir, roll, fold, fill, fry, grill, pour, boil, flip, thread, light.
5. **Part W, missing kitchen words (~10 min):** Round 4 W1–W9 and G1–G10.
6. **If time:** Round 4 Part 4 onwards, unchanged; point her at the Round 4 sheet.

## To finish when approved

1. Write `docs/Nani jo Ghar — Questions for Mum (Round 5).md` in Round 4's format. Keep its "How to answer" section: long takes, say the ID, three times for Parts A/N/W, once for sentences.
2. Fable review.
3. Build the Word copy: `npm install docx@8` in the scratchpad, then `NODE_PATH=<scratch>/node_modules node build/build_mum_questions_docx.js <md> <docx>`. Tested on Round 4 and it works.
4. Send Zafar the Word copy and a short brief.

# Prototype report: the clinic's new games (2 Nov 2026)

Builder: proto-clinic, overnight run (brief: `build/reports/proto-brief-2026-11-02.md`). Design: `build/reports/designs/clinic-every-part.md`
§3A, §3C-§3E and its critique. Branch: this worktree, 5 commits on `claude/nice-lovelace-0vfjcj` (not pushed). The scrape and every
existing clinic game are untouched.

## How they are built

- **Beside the healing games, in clinic mode:** `js/clinic/main.js` gains a `PROTO` list (four games, levels 1-4) and their lab
  entries, so `build/gen_labs.mjs` puts their cards at the end of **"Clinic: the healing games"** in `labs.html`.
- **Not in the morning's pipeline yet:** each plays alone in the lab. The heal host's clinic card is not chai's order card, so these
  run on a prototype kit instead: `js/clinic/proto/kit.js`, a copy of the farm kit (`js/farm/kit.js`: chai's helper box, order card,
  ask, count and tick, oops, onboarding, stuck hints, "Shabash!", the host's end screen), with the person as an option (the doctor
  by default). The copy keeps the farm builder's kit free to change tonight. To merge later: one kit for both.
- **The sentence layout** (the brief's) is in the same kit (`createProto(..., {sentence: true})`): the person's box holds one line
  at a time with its key words underlined; word tiles in labelled groups sit under it (picture, word, a big 44 px speaker). Every
  part in play has a tile, asked or not; no tile glows for the answer (a tile lights only while its word is said, at L1-L2); from
  L3 a tile's word is dots (tap them to see it: counted as a hint). The ladder itself is not wired: the dots go by level.
- Files: `js/clinic/proto/{kit,play,where,hand,nose,drinks}.js`, `css/clinic-proto.css` (the farm's scene rules under `cp-`, the
  room, the tiles; the shared side panel is not restyled except the underline in the sentence box, see "Flaws").
- Checks: `node --check` on every file; one lab shot each at 1280x665 (no errors, nothing spills). Not played to the end screen by
  a script, and no leak bot rows yet.

## The games

### 1. Where does it hurt? (the sentence layout)
Lab: `lab.html?mode=clinic&game=where&level=1` (levels 1-4)

- **Plays:** the girl sits on the bed, hands in her lap, looking ahead. Her line in the box: "[My] gutan [hurts]." Tap the part on
  her. A tap anywhere on her head opens the face close-up (always, right or wrong); inside: forehead (head), ears, eyes, nose,
  mouth; a tap off the face goes back. Right: "ow!", a soft red glow, the row ticks (gold first try, plain after a miss). Wrong: a
  different small reaction each time ("hee hee!", "na!", a shrug) and her line again. Tiles: Body / Face.
- **Levels:** L1 7 parts, 2 calls; L2 13 parts (adds elbow, tummy, chest, eye, nose, mouth), 3 calls; L3 as L2 with the tiles'
  words dotted; L4 as L3, 4 calls.
- **Not yet:** two parts in one line (frame P-2 missing), the side ask and the left/right showing (L3), the why ("I've got a
  cough"), the hand/foot zooms and the small parts (L4), tooth, shoulder, neck (no lexicon entries). The doctor's "Where does it
  hurt?" isn't said (it's in the lexicon but unrecorded; his box isn't on this screen: the patient is the person).

### 2. The hand splinter (order card)
Lab: `lab.html?mode=clinic&game=hand&level=1` (levels 1-4)

- **Plays:** "Pela ba [jugs] garam paani, ne poi [splinters]." Tap the hot or cold jug, then the hand: one jug per tap, one speck of
  dirt off per jug; the row ticks at the number, an extra jug doesn't land; the other water shakes and the line is said again.
  Then drag each splinter along its path (square turns); off the path: "ow!", "Dhyan rakh." (Mum's clip), it slides back. Out past
  the edge: it flies into the kidney tray, "plink". Then the plasters, then each spot. The hand wiggles at the end.
- **Levels:** L1 1-3 jugs, one straight splinter; L2 2-4 jugs, two winding paths; L3 as L2, heard only; L4 3-6 jugs, three
  splinters, narrower paths.
- **Not yet:** the finger order (L2: thumb, middle finger, little finger are not in the lexicon) and big/small (L3).
- **Art:** the palm is a flat placeholder shape; needs `clinic-every-part-5` (a palm, fingers spread, on the clinic's table).

### 3. The blocked nose (order card)
Lab: `lab.html?mode=clinic&game=nose&level=1` (levels 1-4)

- **Plays:** "Pela ba chando, ne poi [tissue]." Tap the dropper, then the nose: a drop falls from above (nothing goes in); the row
  ticks at the number, an extra drop doesn't land. Then the tissue box (only now the face twitches: never on the drops' tick),
  then the nose: "choo!", always caught, and she smiles. Then the tissue into the bin: the row ticks. A tissue before the drops are
  done, or the cream, shakes and the line is said again.
- **Levels:** L1 1-2 drops; L2 2-3 drops, the cream on the tray as a decoy; L3 as L2, heard only; L4 3-5 drops.
- **Not yet:** the side (L3, frame D-10 missing) and counts per side (L4). No honk sound yet (a "pop" stands in).

### 4. The drinks (order card)
Lab: `lab.html?mode=clinic&game=drinks&level=1` (levels 1-4)

- **Plays:** "Muke aadu de." / "Ne paani." All six things on the counter (ginger, honey, milk, turmeric, lemon, water). Tap one,
  then the cup; a wrong one hops back with a shake and the line again. Then tap the cup, then the patient (the boy for the cough,
  the girl otherwise): "burp! hee hee" after ginger, "aah" otherwise.
- **Levels:** L1 one of taste.js's four drinks by its two things; L2 a spoon count for the honey or turmeric (2-3, "ba [spoons]
  [honey]"); L3 as L2, heard only; L4 as L3.
- **Not yet:** the stethoscope listen step, the stir, L3 "the drink for his cough" (frame D-11 missing), L4 halves.

## Words missing (grey italic, to record)

- **Body:** hurts (and "My" in "My {part} hurts": the frame plays as `[My] gutan [hurts]`), arm, leg, head, nose, mouth, tummy,
  chest, elbow; not in the lexicon at all: thumb, middle finger, little finger, shoulder, neck, toe.
- **Things:** tissue, splinters, plaster, jug/jugs, drops (the plural noun outside "chando"), honey, spoons.
- **Lines:** "Where does it hurt?", "Ow!", the patients' reactions (giggle, "na", "choo", "aah"), "All better!".
- In Kutchi already: gutan, hath, pag, kan, akh, garam/thundo paani, pela … ne poi, chando, dhyan rakh, aadu, dudh, hardar, limu,
  paani, cup, muke … de, ne …, hane …!, shabash, the numbers.

## Art needs

The palm (and fingers) for the hand; tile pictures for hand, leg, elbow, tummy, chest (plain tiles now); a falling drop that
matches the dropper; a used tissue; a stethoscope; a clinic counter for the drinks (a flat wood colour now); the clinic room
behind the bed (a flat wall now).

## Flaws, first

1. The sentence box's key-word underline is styled in `css/clinic-proto.css` (`.cp-sentence #guide .word`), not in the shared
   kit: move it to `css/shared/` when the farm builder's tile layout lands, and make one tile component for both.
2. The first-time teach lights the right jug, dropper or thing (the farm kit's pattern), once per action and player: a one-time
   matching hint.
3. Where does it hurt?: the body spots are hand-placed on `girl-front.webp`; check every one by tapping. Hand: the path and
   channel widths were judged from one shot; check the drag on a touch screen.
4. No leak bot rows and no end-to-end script run; only 1280x665 was checked.

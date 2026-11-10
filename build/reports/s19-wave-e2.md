# s19-wave-e2: sekelo, samosa, chaat and baking on their redrawn art (10 Nov)

Opus, high. Branch `s19-wave-e2`, never pushed. Flaws first.

## Flaws and open
- **Chaat's chutneys (Zafar: the drizzles) barely show.** Chaat is still side-on; the new C5-C11 tops are straight down. They are wired as the top layer's surface through the bowl's mouth, a thin ellipse at this camera. They read properly only in the top-down chaat (CHT-13, his call: band "tray", the cream bowl). Drizzling the chutney band from the drizzle picture was tried and looked worse than the strip, so it is not used.
- **Sekelo:** the skewer at 740x320 is still small (the layout's scale), and the served skewer's handle still runs past the tray's foot (the tray picture's slots).
- **Samosa's fold arrow stays.** It is SAM-21's help; the brief said no arrow, the standing rule says no help goes without Zafar. Question for him. The orange glow is gone, and the kit's box is held until the first drag.
- **Baking:** there is no dough-ball picture in B1's bowl, so the dough is the shaggy bowl (mini B1-2's ball is a different bowl). Milk, flour, yoghurt and sugar keep the old jug: B2 has water only. The oven is old art on the new worktop. Atto and khun still look alike (art).
- **Not mine (exact changes):**
  - chop's own rows (s19-fixes-e): CK-83's Nani box, the light's timing, the side panel, the chip under the gear. Chaat's call into chop (`data/cook.json` recipes.chaat.run `chop-game`) passes only `targets`, `only` and `pool`, with no layout or light option, so nothing to remove.
  - "hakro" missing from the end review: the shared end screen's word list (ui.js/flow.js owner).
  - Baking's order card cut at 740x320: the shared card (UI.mission).
- **checks.mjs, two FAILs on my art, for the orchestrator** (build/tools is read-only to me):
  - `artcheck-known.json` gains `pixel|assets/cook/items/v4/baking/<f>.webp|rim` for bowl-empty, bowl-flour, bowl-flour-1, -2, -3, bowl-shaggy and jug-1 to jug-4, and `pixel|…/jug-1..4.webp|smudge`. These are see-through glass and water, by design.
  - artcolour fails `sekelo/onion-over.webp` on palette (a red onion's maroon; the other three onion stages pass). Zafar decides.

## What changed
- **Cuts (task 1):** `build/tools/art/s19_cut.py` +15 lines; 54 pieces; `sources/art/s19-full/cuts/contact-sheet-3.jpg`. Glass on the wall and marble has its own cutter (`glass_cut`: see-through above the counter, measured outlines below). The magenta rims on yellow and green edges were taken off. Pieces (source number):
  - K2 #98: sekelo/{meat,tomato,onion,pepper,potato}-{raw,part,cooked,over}
  - K6c #94: kit/cloth (not wired: it is samosa's spoon rest, and the spoon alone, K6b, was left out)
  - C5 #24: chaat/layer-lili; C5-drizzle #111: layer-lili-drizzle; C6 #95: layer-dungri; C10 #39: layer-amli; C10-drizzle #110: layer-amli-drizzle
  - S2 #92: samosa/sheet-under; S4 #97: samosa/samosa-{raw,part,cooked,over}
  - B1 #108: baking/bowl-{empty,flour,shaggy}; B1f #109: bowl-flour-1/2/3; B2 #83: jug-0..4; B3 #87: tray-raw, tray-baked
  - K4 #101: corn/cob-raw, -turned, -done (kept) and **cob-over** (new); K7 #103: eggs/egg-cracked, -cooked, -overdone, boiled halves (kept) and **egg-part** (new). Corn and eggs are s19-fixes-e's to wire.
- **Sekelo (CK-81):**
  - The grill shows four stages: raw, part after a turn, cooked, over.
  - The kit's light comes on the first put-on, turn and lift.
  - One face at well done, beside the cooked tray; the small circle sits beside the tray's top right.
  - The pills are chai's size.
- **Samosa (CK-82):**
  - The fry uses S4; a turned flap shows S2.
  - The samosas are in sight at well done, with the face at the plate's upper left.
  - The face is on the plate and the hob from the first frame.
  - The knob's light is round the knob alone; the pills are chai's size.
- **Chaat (CK-83):**
  - The layers rise over 0.9 s.
  - The face is on the bowl's rim from the first frame.
  - The Shabash is clear of the word pop.
- **Baking (CK-84):**
  - It sits on the kit's worktop and stone shelf; the bowl stands on the worktop, never on a jar.
  - The flour rises by quarters, and the dough turns shaggy once something wet is in.
  - The jars are spread along the shelf with chai's pills; the trays and the water jug are the new art.
  - The face is on the bowl, then on the tray.
  - The bowl's tap no longer lights the headline.
- **Settings:** each game's settings list their new files (`assets`, `v4pieces`, `tops`, the bowl and jug states).

## Evidence specs for the five rows (for the orchestrator's evidence.json; `--lint-specs`: 0 flagged in a trial copy)
Not written: the builder was stopped before this step (10 Nov ~23:00). The orchestrator adds them with the next fix round.

## Proof
- Orchestrator's run on this branch, orch-e2-proof (build/screenshots/sandbox/orch-e2-proof/contract.md): sekelo, samosa, chaat and baking at L1, 740x320 and 1280x665, every end reached, 0 page errors; 2 breaks, both the probe faults s19-wave-d named (contract-89 samosa's "Tar!" sampler, contract-107 a hop sampled at the light's first frame), with s19-checks-1.
- Cuts: sources/art/s19-full/cuts/contact-sheet-3.jpg.

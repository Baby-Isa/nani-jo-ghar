# Chai v2 in the game (29 Sept, §10)

**Built:** everything is made in the pan, with one pan per burner and one burner per person (1–3 by level; 4 supported). Pans cook in any order or all at once, each with its own heat, boil and boil-over. A ready pan tips into its person's glass (level 4: half, then full). Faces and 48 px knobs sit on the hob's front edge. The tray stays quiet until serving.

**Shelf:** liquids | jars | spice jars at true heights, with a `🔊 word` chip under each (speaker only from level 3). The word pops by each pour. The next step pulses and the others dim.

**Art: $0.40 spent** (gpt-image-1 medium, 7 calls): pans, glasses, liquids and two jars. The hobs are composed from the mock-up's hob. Cut by `build/cut_chai_v2.py` and checked on cream.

**Tests:** `test_cook.py --lab --viewport laptop` PASS. Level 4 was played through.

**Best shots** (`build/reports/chai-v2/`): `laptop-l3-mid-cook.png`, `laptop-l3-pan-pour.png`, `laptop-l3-serving.png`.

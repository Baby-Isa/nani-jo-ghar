# Chai v2 in the game (29 Sept, §10)

**Built:** everything is made in the pan. There is one pan per burner, and the burners match the people (1–3 by level; 4 supported). Pans can be cooked in any order or all at once, each with its own heat ring, boil and boil-over. A ready pan tips and pours into its person's glass (level 4: one tap pours half, two fill it). Faces and 48 px knobs sit on the hob's front edge. The tray stays quiet until a pan is ready, and the hob steps back once every glass is poured.

**Shelf:** liquids | jars | small spice jars at true relative heights (tall, medium, short), with a `🔊 word` chip under each (speaker only from level 3). The word pops by each pour or spoon, the next generic step pulses, and the others dim 10%. There is more room above the shelf (Zafar's review).

**Art: $0.40 spent** (gpt-image-1 medium, 7 calls, `sources/art/chai-v2/cost.json`): the pan, the tipped pan, the glasses, the liquids, and the aadu and lasan jars. The hobs are composed from the mock-up's hob. Cut by `build/cut_chai_v2.py` and checked on cream.

**Tests:** `test_cook.py --lab --viewport laptop` PASS. Level 4 was played through.

**Best shots** (`build/reports/chai-v2/`): `laptop-l3-mid-cook.png`, `laptop-l3-pan-pour.png`, `laptop-l3-serving.png`.

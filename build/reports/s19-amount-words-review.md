# Where a little, a lot, a bit more, a bit less go (review, 9 Nov)

Zafar's question (CK-72). No established game is touched.

## 1. The words in the lexicon

- **a little:** *thorok*, **draft**, marked doubtful. The beach design calls it confirmed, but the lexicon says draft. (*thori*, "a bit", is confirmed, but only heard in *thori war rakh*.)
- **a lot:** **to record**, no Kutchi.
- **a bit more:** "Still a little more", **to record**. *wadhare* (more) is draft, doubtful.
- **a bit less:** **no entry**, a new word for Mum.
- **enough:** *bas*, **confirmed**.
- Related: *bhareli* (heaped) is confirmed.

## 2. Shortlist, best first

**1. The sandcastle** (beach, a labs prototype, `castle.js`). It's already Zafar's design: "a little or full".
- *Child:* Masi says the amount. The child taps the heap, one spadeful per tap, then tips the bucket.
- *Shown:* the same bucket each time. A stump tower or a tall tower.
- *Real choice:* not today. The bucket stops at the amount and the heap stays lit until then. Fix: fill up to the brim, nothing stops the child, judged when they tip. A wrong tower slumps and Masi says her line again. Drop *half* (that's a measure, for chai and baking).
- *At L4:* Masi half-fills a bucket and says "a bit more" or "a bit less". The child adds a spadeful or scoops one out.
- *First time:* Masi tips a little and a lot side by side, each said.
- *Cost:* code only, no new art.

**2. The fruit stall** (town, a prototype, `serve.js`), with a chana customer (chana is confirmed).
- *Child:* scoops chana onto the scale pan.
- *Shown:* a small or a big heap on the pan.
- *Real choice:* the pan never stops the child, and tapping the pan already takes a scoop back. So "a bit more" and "a bit less" are real market talk.
- *Keep it apart from the counted fruit:* her own customer or her own level.
- *Cost:* new art (a sack, heaps on the pan) and some new code.

**3. Hair's shampoo** (clinic, built but parked).
- *Child:* squeezes the bottle once per tap, then rubs.
- *Shown:* a small foam cap or a towering foam hat. Both are funny, never a verdict.
- *Real choice:* the bottle never stops the child.
- *First time:* the doctor shows both.
- *Cost:* foam art in two sizes, and changes to hair's L3. Zafar hasn't played it yet, so this needs his OK.

**4. Pet hotel feeding** (a prototype, `care.js`).
- *Child:* fills one bowl, then gives it.
- *Shown:* a few bits or a heaped bowl.
- *Real choice:* only if the amount is random, never "big animal gets a lot", or the child wins by the pattern. The cob counts would give way at these levels.
- *Cost:* small code, plus bowl-heap art.

**Enough (*bas*):** only heard after the give. It can never be the signal to stop, because then the child wins by waiting.

## 3. Top recommendation

The sandcastle: fix the stop and the light, swap half for a lot, and add a bit more and a bit less at L4. Code only.

## 4. Considered and rejected

- Cook's games, baking included: established, or already decided.
- The drinks' heaped spoon: *bhareli* means "heaped", a measure, and the game already counts spoons. Too small at 740x320 too.
- Hic and tummy: half and full glasses; tummy has sweets.
- Tooth, fever, ear: established heal games.
- Farm feed, nose drops, hand jugs: counted; amounts would mix with counts.
- Party cake: slices are big and small, not amounts.
- Farm watering: barely visible, and it's about knowledge.
- Safari, school, sewing, home: nothing gets poured or heaped.

## Proof

`CLAUDE.md`, `data/lang/lexicon.json`, `docs/game-design/modes/README.md`, `clinic.md`, `docs/process/regressions.md` (CK-72), `docs/status.md`, `docs/ideas.md`, `build/reports/designs/beach-boat.md`, the headers of `castle.js` (and its fill and tip code), `serve.js`, `care.js`, `cake.js`, `farm/{feed,grow-pick}.js`, `clinic-proto/*.js`, `clinic/heal/games/{hic,tummy,hair}.js`, and every `*-proto/main.js`.

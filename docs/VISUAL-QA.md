# Visual QA: the definition of done for anything Zafar sees

Written 28 Sept 2026, after the end-of-round badges took five rounds to get right. Every build brief that changes art, layout or UI links to this file. Tests passing is not "done" for visual work.

## 0. Keep iterations fast (Zafar, 28 Sept)
- **While iterating:** only the laptop view (1366×768), and only the screens you changed: one screenshot each, looked at and fixed. Skip the full test suites until the end.
- **Before the one final push to `main`:** the full matrix below (phone and laptop, every state), plus the repo's tests.

## 1. Look at it, the way Zafar will
- Take **uncropped** screenshots of **every state** (e.g. all right / mixed / none; 0, 1, 2 and 3+ hints; new best / good / plain) at **390×844 (phone)** and **1366×768 (laptop)**.
- **Open each screenshot and look at it.** Write one line per state saying what's right or wrong. "The screenshot exists" doesn't count.
- Judge it against the design intent (UX-PRINCIPLES), not just "it renders". Ask:
  - Would a five-year-old read it at a glance?
  - Do the pieces match in style and size?
  - Is anything clipped, misaligned, fringed or squashed?

## 2. Art cuts (ChatGPT sheets → sprites)
- Cut with `build/cut_tick_v2.py`'s method:
  - the object is everything not connected to the flat background, with holes filled (so grey metal or clear glass stays solid);
  - edges and glow use colour-to-alpha against the measured background;
  - for glow cells, the solid core is only the strongly coloured body.
- **Check every cut on the game's cream background, zoomed:** no grey fringe, no ring, no holes, and the glow isn't squared off at the canvas edge.
- **Every state of one object shares one canvas, registered to the object's own bounding box**, so layers line up exactly. Check with a pixel-diff overlay when states are layered (e.g. gold over pewter).
- When code maps a value onto art (like a fill percentage), map it onto the **object's** extent, not the image's.

## 3. Ship it, then check the live site
- Run `bump_version.py`, then push the branch and `HEAD:main`.
- **Confirm the GitHub Pages build ran for that commit** (Actions → "pages build and deployment"). Pages sometimes skips builds.
- Only then tell Zafar it's live, and **send him a screenshot**.

## 4. Who does it
- Visual or judgement work (art cuts, layout, UI polish) goes to the top model; mechanical work (data, wiring, docs) can go to the mid-tier model.
- The orchestrator looks at the screenshot itself before reporting "done", and never passes on a session's "done" unseen.

## 5. Hunt for flaws, don't confirm the fix (29 Sept, after Zafar caught the chai pans)
**What happened:** every chai pan sat low-left of its burner from the v2 build onward: the pan's centre had been measured with its handle attached. It passed the chai v2 build, two polish passes, the stage-fill session ("hob + tray centred ✓") and the orchestrator's own check. Zafar spotted it in one screenshot, along with a lit burner with no pan on it and the heat gauge sitting on the flame tips. Nobody had ever shot the boiling state.

**Why the tests didn't help:** `test_cook.py` is a play-through test. A bot plays every station and checks the scoring; it never looks at the picture. Passing it says the game works, not that it looks right.

**The rules from now on:**
- **Shoot every state that draws something different,** not only start/mid/end: for a hob, heating (flames + gauge), turned down, a pan lifted away, boiled over. Levels 1–4 when the layout changes with the count (1–4 burners). Each station's shoot script names its states in its header; add one whenever a new state appears.
- **The reviewer lists what's wrong before saying anything is right.** For each shot: zoom into the focal object (crop ×2) and write every flaw you can find (alignment, overlap, crowding, empty or lit-but-unused things, labels, anything that differs from the approved mock-up). "Looks right" with no flaws listed isn't a review.
- **Compare with the approved mock-up** (`build/reports/*-mockup/`) side by side, not from memory.
- **Measure what can be measured.** `python3 build/check_vessel_meta.py` checks that each vessel's recorded centre matches its art's rim. Add a check like it whenever art metadata drives placement.
- **The builder doesn't mark its own homework:** the orchestrator (or a fresh session) reviews the final shots, not the session that made them.

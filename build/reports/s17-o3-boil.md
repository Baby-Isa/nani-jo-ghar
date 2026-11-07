# s17-o3-boil: the boil's sound, one seamless loop (CHAI-95, 7 Nov)

**Flaws first.**
- Three edits fall outside my files, each its own commit so it can be dropped:
  - simmer-b's row in `assets/shared/sfx/SOURCES.md` and the picked list in `build/test_shared_sfx_files.mjs` (the unit tests need both);
  - option B on `lab/juice.html`'s simmer row. It plays the file once, not looped.
- 3.4 s of source can't fill 12 s without reuse. The best 50 ms match is r 0.58 (the median was 0.90 in the proposed file, 0.36 now).
- Across the jump, the two copies differ only by the 64 kbit/s codec's noise (r 0.87). The step there (0.035) is inside the clip's own spread (p99 0.061).
- The feedback doc calls the boil Mixkit. It is BigSoundBank #0149, CC0.

**The proposed file:** its overlaps pulsed about 2 dB every 0.4 s, and its 0.1 s levels ran from -37.2 to -31.4 dB.

**What changed.** `sources/audio/simmer-b-make.py` rebuilds the loop from simmer-a 0.02-3.45 s:
- 17 grains with 120 ms equal-power cross-fades, each at 0.95-1.05x speed, no source reused within 2.5 s;
- a 3:1 hold on the loudest pops;
- built on a circle, at simmer-a's loudness (-33.82 dB).

The file has 0.1 s of circular padding either side. `js/shared/sfx.js` loops it from 0.1 to 12.1 s (`loopAt`), so the join holds whether or not a browser trims the MP3's padding. Chromium trims it exactly.

**Measurements:**
- 12.000 s loop;
- 0.1 s levels from -35.4 to -32.9 dB;
- envelope autocorrelation 0.09 or less;
- 98 KB.

## Proof
- Plot: `sources/audio/simmer-b-loops.png`.
- Sound log: `build/screenshots/sandbox/s17-o3-boil-sound/` (chai tray, 1280x665, reached its end). It names `sfx/file:simmer-b`.
- No BEFORE folder, no evidence or contract run (the orchestrator's instruction).
- Checks: unit 659/0, size 420 MB, load 29/29; the rest ok.

Open: CHAI-95 waits on the judge and on Zafar's ear.

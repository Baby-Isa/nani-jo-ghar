**STATUS: standalone experiment, not yet run. Independent of Build Brief v4 — no merge conflicts, can run before/after/alongside it. Writes only to `lab/nani-alive.html` and `assets/characters/nani/expr/`, never touches the main game files.**

---

# Nani jo Ghar: Build Brief, "Alive Nani" test

**Run with:** Sonnet, medium effort, in a Claude Code session with the repo `Baby-Isa/nani-jo-ghar` attached.
**Scope:** ONE character (Nani). Build a self-contained test page at `lab/nani-alive.html`. **Do not touch the main game files.** This runs independently of the Phaser rebuild brief, so there are no merge conflicts.
**Goal:** prove that a script can produce flicker-free expression frames for a character with zero manual art work, and that Phaser can make her feel alive. If this works, it becomes the pipeline for every character.

---

## 0. Rules

1. **The API key never goes in the repo, a commit, a log, or a chat message.** Read it only from the environment variable `GEMINI_API_KEY` (or `OPENAI_API_KEY` for the fallback). Add `.env` to `.gitignore`.
2. **Cost cap: 16 image API calls in total for this whole test.** Count them in the script and stop at the cap. Print the running count.
3. If the API is unreachable (network blocked) or the key is missing, **stop and tell Zafar exactly which one it is**. Don't retry in a loop and don't try workarounds. The fallback is in section 6.
4. Every final frame must be pixel-identical to the base image outside the changed facial region. This is the whole point, and section 3.4 tests for it.
5. Don't finish until section 5 passes and you have looked at the contact sheet and GIFs yourself.

---

## 1. Why we're doing it this way

The current `nani-neutral/talking/happy.png` files were generated separately. They're different widths (327, 331 and 326px) and the head and scarf shift between them, so swapping them makes Nani jump. The fix: one **base** image. Each expression is made as an AI **edit** of the base, and then a script pastes **only the changed eyes or mouth** back onto the untouched base. The body never moves between frames, so there's no flicker.

---

## 2. Frames to produce

Base: `assets/characters/nani/nani-neutral.png` (327×700 RGBA).

| Frame id | Edit prompt (send with the base image) | Region allowed to change |
|---|---|---|
| `eyes-closed` | "Edit this illustration: close her eyes gently, as in a natural relaxed blink. Change nothing else: same face, glasses, headscarf, clothes, colours, lighting, line style and framing." | eyes |
| `eyes-half` | "Edit this illustration: her eyes half closed, mid-blink. Change nothing else: same face, glasses, headscarf, clothes, colours, lighting, line style and framing." | eyes |
| `mouth-half` | "Edit this illustration: her mouth slightly open as if mid-word, lips parted a little, teeth barely visible. Change nothing else: same eyes, face, glasses, headscarf, clothes, colours, lighting, line style and framing." | mouth |
| `mouth-open` | "Edit this illustration: her mouth open as if saying 'aah' while talking warmly. Change nothing else: same eyes, face, glasses, headscarf, clothes, colours, lighting, line style and framing." | mouth |
| `smile` | "Edit this illustration: a big warm proud smile, eyes slightly crinkled with happiness. Change nothing else: same face shape, glasses, headscarf, clothes, colours, lighting, line style and framing." | eyes + mouth + cheeks |

Generate **2 candidates per frame** (10 calls). Up to 6 retries are left under the cap for frames where both candidates fail QA.

---

## 3. Pipeline: `build/expressions.py`

### 3.1 Prepare the input
- Upscale the base ×3 (Lanczos) and composite it onto a flat `#E8E0D0` background, centred on a canvas matching the API's supported aspect ratio. Keep a record of the transform so you can invert it exactly. Edit models handle transparency badly, so they never see alpha.
- Save the prepared input in `build/expr_work/` (git-ignored).

### 3.2 Call the edit API
- **Primary: Google Gemini image editing** via the official `google-genai` Python SDK. **Check the current Gemini docs for the latest image-editing model name**; don't hardcode one from memory. Send the prepared image + the prompt, save the returned image.
- **Fallback if Gemini fails or quality is poor: OpenAI Images edit endpoint** (`openai` SDK, latest GPT image model per current docs, with the high input-fidelity option if the docs still offer one).
- Log the model name used, call count, and any per-image cost the response reports.

### 3.3 Align and extract the patch
For each candidate:
1. Invert the 3.1 transform (crop the canvas, downscale to 327×700).
2. **Register** the candidate to the base with OpenCV `findTransformECC` (MOTION_AFFINE) on greyscale, using only the head area (top 40%) to estimate the transform. Warp the candidate.
3. **Locate the face regions automatically:** try MediaPipe Face Landmarker on the base to get eye and mouth boxes. If it doesn't find a face (cartoon style), fall back to the largest connected diff blob inside the upper 35% of the image, split into an eye band (upper half of the face box) and a mouth band (lower half).
4. **Mask** = pixels where |candidate − base| (RGB sum) > 45, AND inside the frame's allowed region (section 2, table), dilated by 6px, then closed, then feathered with an 8px Gaussian blur.
5. **Composite:** `final = base × (1 − mask) + candidate × mask`. The alpha channel = the base alpha, unchanged.
6. Save as `assets/characters/nani/expr/nani-<frame-id>.png`, 327×700, identical dimensions to the base.

### 3.4 Automatic QA (pick the best candidate, reject bad ones)
Reject a candidate if any of these hold:
- **Leak:** after alignment, more than 1.5% of pixels OUTSIDE the allowed region differ from the base by > 45. (That means the model redrew the face or head, so the patch would look wrong.)
- **Seam:** the mean colour difference along the mask's feathered edge is > 18. (That means a visible join.)
- **No-op:** less than 0.15% of the allowed region changed. (The edit didn't happen.)
- **Outside-region identity:** assert that the final frame equals the base exactly where mask = 0. This must be 100%.
Of the passing candidates, pick the lower seam score. If neither passes, retry that frame (within the cap). If it still fails, record it as failed. Don't fake it.

### 3.5 Review artefacts (to `lab/review/`, committed)
- `contact-sheet.png`: base + every final frame side by side, with each frame's QA scores printed underneath.
- `blink.gif`: neutral → half → closed → half → neutral at 60ms per frame, looping with a 1.5s pause.
- `talk.gif`: cycling closed/half/open/half at ~90ms.
- `face-crops.png`: the same frames cropped to the face at 3× zoom, so seams are easy to see.

**Look at all four yourself.** Check: no visible seam, glasses unchanged, no colour shift, the expression reads clearly, and it looks like the same person. Write your verdict per frame in the final report.

---

## 4. The test page: `lab/nani-alive.html` (Phaser 3, vendored, no CDN)

A plain scene: the kitchen background (`bg-nani-kitchen-v1.jpg`, 1600×900 world, `Scale.FIT`), with Nani waist-up at x=1400, scale 1.1, bottom 25% cropped by the frame (the same framing as the main rebuild brief). Load all the frames. Since they're identical in size and pixel-identical outside the face, swapping textures can't jump.

**Note (23 Sep 2026): the kitchen background has since moved to v3** (`bg-nani-kitchen-v3.png`, see the Roadmap's layout contract v2 and the Chapter 1 Art Prompts doc). If this brief runs after Build Brief v4, point the test page at kitchen v3's measured `character.nani` anchor instead of the coordinates above, so the test reflects where Nani actually stands in the real game.

Behaviours, each with an on-screen toggle so Zafar can compare with and without:
1. **Breathing:** a scaleY tween 1.000 → 1.012 with origin at the bottom-centre, 3.6s, sine, yoyo, infinite.
2. **Idle sway:** a rotation tween ±0.35° pivoting at the bottom-centre, 5.3s (deliberately not a multiple of the breath timing, so it never looks mechanical).
3. **Blink:** at a random interval of 2.5–6s, run neutral → half (50ms) → closed (80ms) → half (50ms) → neutral. 15% of the time, do a double blink. Skip the blink while the smile frame is showing.
4. **Talking driven by the audio:** a "Say line" button plays `assets/audio/word/snt-01.mp3` through Web Audio with an `AnalyserNode`. Each frame, compute the RMS volume, smooth it (attack 30ms, release 90ms), and map it to mouth frames: below the threshold → base, medium → `mouth-half`, loud → `mouth-open`. Hold any mouth frame at least 60ms to avoid jitter. Blinks keep happening during speech (eye and mouth frames don't conflict, because each final frame only changes one region; for a blink during speech, show the eye frame for the blink's duration, since blinks are short).
5. **Happy:** a "Well done" button shows `smile` for 1.8s plus a small hop (y −12px then back, 250ms, ease out-back).
6. A small "raw frames" strip at the bottom that can be toggled on, showing every frame as a thumbnail for inspection.

It must work on the Flip 5 in landscape and on a laptop. Tap-to-start unlocks audio.

---

## 5. Done means
- [ ] All 5 frames produced and passing QA (or failures honestly reported, with reasons)
- [ ] Contact sheet, blink.gif, talk.gif and face-crops reviewed by you, with a verdict written per frame
- [ ] `lab/nani-alive.html` works at 915×375 (touch) and 1366×768 in Playwright: the page loads, "Say line" produces mouth frame changes (assert the texture key changes at least 5 times during the clip), a blink happens within 7s, and there are no console errors
- [ ] No API key anywhere in the repo (run `git grep -i "api_key\|sk-\|AIza"` and confirm it's clean)
- [ ] Committed and pushed to `main`, then confirm `https://baby-isa.github.io/nani-jo-ghar/lab/nani-alive.html` serves the new page
- [ ] Final message to Zafar: the link, the GIFs, the per-frame verdicts, total API calls and cost, the model used, and a one-line recommendation: is this good enough to roll out to all characters?

## 6. Fallback if the API can't be reached
Stop before building anything else. Write `lab/PROMPTS.md` with the 5 prompts, and tell Zafar: "Paste each prompt into Gemini with nani-neutral.png attached, save the results as eyes-closed.png, eyes-half.png, mouth-half.png, mouth-open.png, smile.png, and drop them into the chat." Then run 3.3 onwards on those files exactly as above.

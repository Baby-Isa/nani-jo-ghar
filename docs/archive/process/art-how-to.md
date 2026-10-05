> Archived 5 Oct 2026 (D1). This is the manual 26–30 Sept method (downloads, zips, drag-and-drop). The current method is `docs/design-language/art-pipeline.md` and the `/art-run` skill.

# Art how-to: running art through ChatGPT via Claude in Chrome

> **Stale points (the rulebook, `docs/process/rules.md`, wins).** Blocks below are copied word for word from the 26–30 Sept packs; read them with these overrides:
> - "No private photos" / "Mum's, Big Ma's, the doctor's and the cats' photos stay in `sources/private/` and never go into the repo" → family photos may be attached for likeness; all consent is given (D12, decision 9). The 26 Sept run-me already says so; the rule's short form is in `rules.md` §7.
> - "Download", "Drag the PNGs into the Claude Code chat", "Zafar uploads" and "drag them in" → the current method needs no manual steps and no downloads: the runner moves files through its cloud workspace and file-upload tool: references from `raw.githubusercontent.com` into ChatGPT, kept images from ChatGPT into GitHub's upload page, one commit each to `sources/art/<pack>/` on `main` (page fetch() and the clipboard are blocked, 5 Oct). The template is the "MOVING IMAGES WITHOUT DOWNLOADING" section of `docs/design-language/art-plans/clinic-heal-chrome-block.txt` (D3, decision 29); Claude then cuts and reviews.
> - "Zafar watches / signs off" a sheet → only for characters based on real people (Nani, Big Ma, the doctor); all other art is judged by the runner and Claude (D12, decision 29).
> - "Slice magenta sheets with `build/slice_sheet.py`" → legacy; cut with `build/cut_tick_v2.py`'s method (D7, D22; `design-language/art-pipeline.md`).
> - "Generate via an image API for transparency" → ChatGPT, not an API, except a rapid prototype under $2 when Zafar can't respond (D1, D2, non-negotiable 13).
> - "Hands" in the prompts → hands are out of Cook and parked (Zafar, 28 Sept).
> - "Liquids as discs" → pre-rendered pictures (D11).
> - "Chapter 1 thick outlines / cel shading" → retired; the style is the stylised 3D look with no outlines (D13, D16).
> - Prompt packs are in `docs/archive/art-prompts/` (the exact prompts behind shipped art, needed for any re-prompt). The prompt URLs in the paste block below point there after the move.
> - Plan before prompting (D4, D5): see `design-language/art-pipeline.md` and `design-language/art-bible.md`.

The rules for art are in `process/rules.md` §7 (D1–D31 by ID); the look is `design-language/art-bible.md`; how art is cut, named and exported is `design-language/art-pipeline.md`. This file is the **runner method**: what goes in the one paste block for Claude in Chrome, what the runner does for each prompt, how it logs, and what Claude does next.

## 1. Chat discipline (from batch 1 § 0, the tips)

> from: docs/archive/art-prompts/chatgpt-art-prompts.md § 0. Tips before you start (the tips, word for word)

- **Always attach the style anchor** (`style-anchor-v1.png`, made in step 1) to every prompt after step 1, plus whatever else the attach line says. It's what keeps everything looking like one game.
- **Size:** ChatGPT makes three sizes. Ask for **1536×1024** (landscape) for sheets and backgrounds, **1024×1024** for the style anchor. Every prompt already says which.
- **Regenerate, don't argue.** If an image is wrong, press regenerate or send the same prompt again in a fresh message. Don't chain "no, fix the left one" corrections: each edit drifts the style and faces a little more. The one exception is a single small edit that says "change only…".
- **One chat per character**, and one per background, named after it (e.g. "Nani sheet"). Expressions and relights go in that same chat so ChatGPT keeps the look. **Start a fresh chat for each ingredient sheet** so it never "edits" an earlier sheet.
- **Never make a state by editing another** (whole onion → chopped onion). Each sheet is generated fresh; raw and cooked versions that must match sit on the same sheet.
- **Download the PNG** with ChatGPT's download button. Never screenshot: it shrinks the image and blurs the magenta edge.
- **If ChatGPT won't use a photo**, send the same prompt without that photo: every character prompt already describes the likeness in words.
- **If you hit the image limit**, stop and carry on later; nothing is lost.

## 2. Edit rules for approved images (from batch 3, Cook)

> from: docs/archive/art-prompts/chatgpt-art-prompts-batch3-cook.md § 0.1 What's different from batch 2


- **Batch 1's tips (its section 0) and batch 2's slicer rules (its section 2 intro) all still apply** to section 2: attach the style anchor, a fresh chat for each, download the PNG (never a screenshot), regenerate rather than argue.
- **Section 1 is all edits, not new sheets.** Each one edits an approved image in place, so the character changes face or pose without jumping: the game swaps these images over each other in the same spot (`build/cut_characters.py` cuts every mood with the same box as the neutral). So:
  - **Attach only the image being edited. No style anchor:** a second image leaves ChatGPT unsure which one to edit, and the approved image already carries the style.
  - **Always edit the approved original, in a fresh chat,** never an earlier edit, so the moods don't drift from each other.
  - **Compare with the original:** if it looks identical, it has failed; if the head, hands or counter edge have moved or changed size, it has failed too.
- **No private photos in section 1.** Photos are allowed again (Zafar, 25 Sept), but these are edits of an already approved likeness: a photo would pull Nani's face away from the approved drawing, which is exactly the jump the edits are there to avoid. Nana, Ma and Ali are generic (no real person).
- **Section 2 goes on grey** (`#808080`), like the other steel, glass and wood items: no shadows, so the game can add its own contact shadow.


## 3. The one paste block for Claude in Chrome (30 Sept overnight pack)

> from: docs/archive/art-prompts/chatgpt-art-prompts-overnight-2026-09-30.md § Paste this one block into Claude in Chrome (the current model of a run: read the page, download references, run each prompt, upload to `sources/art/<pack>/`, report pass/fail)

```
You're making 13 images in ChatGPT for a children's game called Nani jo Ghar, then uploading them to GitHub yourself. Work through these steps in order, and don't change any ChatGPT, GitHub or Chrome settings.

1. Open https://github.com/Baby-Isa/nani-jo-ghar/blob/main/docs/archive/art-prompts/chatgpt-art-prompts-overnight-2026-09-30.md and read the whole page. It has 13 prompts in this order: R1, R2, R3, R4, R5, R6, R7, R8, CI1, CI2, CI3, CI4, CI5. Each is in a grey code box, followed by "attach", "save as" and "check" lines.

2. Download the reference images listed under "Reference images" on that page. Open each link and click its "Download raw file" button (the download-arrow icon at the top right of the image).

3. In ChatGPT (chatgpt.com), for each prompt in order: start a new chat, attach the files its "attach" line names, paste the text of its code box exactly as written, and send. When the image arrives, compare it against its "check" line.
   - If it passes, download it straight away with ChatGPT's own download button (never a screenshot), before moving on.
   - If it fails, reply once saying which check it failed and ask for a corrected image. If that fails too, start a fresh chat and try once more (at most 2 retries per prompt). Then download the best one and note what's wrong with it.
   - Download only the one image you keep for each prompt, so there are exactly 13 downloads.

4. Upload them to GitHub yourself, in two uploads. Rename nothing on GitHub. For each upload, choose "Commit directly to the main branch" and click "Commit changes", then check the folder page lists the files.
   - The 8 images from R1 to R8: open https://github.com/Baby-Isa/nani-jo-ghar/upload/main/sources/art/cook-v3-1 and drag them in. Commit message: "Cook v3.1 art redos (ChatGPT, 8 images)".
   - The 5 images from CI1 to CI5: open https://github.com/Baby-Isa/nani-jo-ghar/upload/main/sources/art/clinic-v2/items and drag them in. Commit message: "Clinic v2 item art (ChatGPT, 5 images)".

5. Tell me, in prompt order: the prompt (R1 … CI5), the file name as uploaded, and pass, or what's wrong with it.
```

**What happens next:** Claude matches the uploads to the prompts by the pictures, renames them to the "save as" names, cuts them (the cut_tick_v2 method, `docs/archive/process/VISUAL-QA.md` §2, with the grey-leftover check) and reviews them before any station uses them.


> from: docs/archive/art-prompts/chatgpt-art-prompts-overnight-2026-09-30.md § Rules on every image (the ground, registration and style rules that pack repeats under its reference images)

- Flat mid-grey `#808080` background, no floor, no cast shadows, no text, numbers, letters or logos.
- Each thing is centred in its own cell with clear grey all round it, never touching the edge.
- **"Top-down" means straight down from directly above**, like a photo taken from the ceiling: round things are perfect circles, never ellipses.
- **Registration:** where a sheet shows one object in several states, it is the same object at exactly the same size and position in every cell.
- **Style:** the attached style anchor (a stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines). The one exception is R8's flat icons.

## 4. The unattended runner prompt, per-prompt rules, log and image limits (26 Sept run-me)

> from: docs/archive/art/art-run-tonight.md (the whole file, headings demoted one level; it is the fullest version of the runner prompt. Its pack list, file names and "tonight" wording belong to that run.)


**Made:** 26 Sept 2026. **For:** one unattended Claude in Chrome run in ChatGPT, covering three prompt packs, **the cooking game's art first**. This file is `RUN-ME.md` in `nani-art-tonight.zip` (a copy lives in the repo at `docs/archive/art/art-run-tonight.md`).

### Zafar: before you start (5 minutes)

1. **Unzip** `nani-art-tonight.zip` into your Downloads folder, so you have `Downloads/nani-art-tonight/` with `RUN-ME.md`, `packs/`, `attach/`, `private-photos/` and `results/` inside.
2. **Drop the photos into `private-photos/`** (see its README): at least `mum-01.jpg` (a clear, front-on, well-lit face photo of Mum). Tonight's run uses Mum's photos only; the others (`bigma-01.jpg`, `doctor-01.jpg`, `simba-01.jpg`, `zazu-01.jpg`) aren't used by any prompt tonight (their prompts are batch 2's section 3, which you're doing by hand), so they're optional. The photos stay on your laptop: they never go into the repo.
3. **Optional:** if you've approved `char-simba-v1.png` from your batch 2 run, copy it into `attach/` (batch 3's 4.1 and 4.2 use it if it's there, and work without it).
4. Open ChatGPT in a Chrome tab, signed in. Open a **new** Claude in Chrome chat, paste the zip (or this file) into it, then paste the runner prompt below and leave it running.

### Missing, find on your laptop

Every attachment the three packs list is in `attach/` except these, which aren't in the repo:

| File | Used by | Needed tonight? |
|---|---|---|
| `char-simba-v1.png` | batch 3's 4.1 and 4.2 (optional there); batch 2's 3.2 | Optional. Add it to `attach/` only if you've approved it; the prompts work without it |
| `char-bigma-v1.png`, `char-doctor-v1.png`, `char-zazu-v1.png` | batch 2's 3.2 only | No: section 3 of batch 2 is skipped tonight |
| Private photos (`sources/private/…` in the packs) | batch 3's 1.1 and 7.1 tonight (Mum); batch 2's section 3 | Mum's: yes, in `private-photos/` |

### The run, in order (58 images)

| # | Pack (`packs/…`) | Steps | Images |
|---|---|---|---|
| 1 | `chatgpt-art-prompts-batch3-cook.md` | 1.1–1.10 (the cook characters: Nani's happy, talk, point and blink; Nana, Ma and Ali happy at the counter; their "tsk" faces), then 2.1 the chai glass and 2.2 the skewer rack | 12 |
| 2 | `chatgpt-art-prompts-batch2.md` | Sections 1 and 2 only: 1.1–1.5 (the worktop evening, onion, velan, chakla, thali redos), 2.1–2.7 (bajri maani, hob knob and flames, tray and grill, samosa folds, front-view pantry veg and containers, chaat layers). **Not section 3** (the character sheets: Zafar is doing them by hand) | 12 |
| 3 | `chatgpt-art-prompts-batch3.md` | Every section in its own order: 1.1–1.5, 2.1–2.6, 3.1–3.2, 4.1–4.3, 5.1–5.3, 6.1–6.8, 7.1–7.4, 8.1–8.3 | 34 |
| | | **Total** | **58** |

If the run stops early, the cook art is already done. Everything is free ChatGPT image generation; expect image-limit waits, so it may run well into the morning.

### The runner prompt (paste this into Claude in Chrome)

```
You're running tonight's "Nani jo Ghar" art prompts in ChatGPT, on your own. Zafar isn't watching; he'll read your log in the morning.

WHERE THINGS ARE
Zafar has given you a zip, nani-art-tonight.zip, and unzipped it on his laptop to Downloads/nani-art-tonight/ (if it isn't there, look for a folder of that name in Downloads, and log where you found it). Inside:
- RUN-ME.md: this file. It wins wherever a pack disagrees with it.
- packs/: the three prompt packs, plus the Art Bible and the Asset Naming Convention (for reference only; you don't need them to run the prompts). Read the packs from the zip in this chat; if you can't, open them in a Chrome tab from the unzipped folder.
- attach/: every attachment the packs name, with the file names the packs use. The packs give repo paths (sources/art/..., assets/cook/...) and say "Downloads/nani-batch2-attach/" or similar: ignore those folders, every file is in attach/ under its own name.
- private-photos/: Zafar's family photos (mum-01.jpg, mum-02.jpg, ...). Use them only as the PHOTOS section below says.
- results/: where results go if Chrome asks where to save (see SAVING).
Images made earlier in this run (e.g. "the image you saved for 6.4") are attached from wherever the browser saved them; your log says which file each one is.

WHAT TO RUN, IN THIS ORDER (58 images)
1. packs/chatgpt-art-prompts-batch3-cook.md: 1.1 to 1.10, then 2.1 and 2.2 (12 images). In its section 1 (edits of approved images) attach ONLY the one image named on the attach line: no style anchor, no photos.
2. packs/chatgpt-art-prompts-batch2.md: sections 1 and 2 only, 1.1 to 1.5, then 2.1 to 2.7 (12 images). Do NOT do its section 3 (the real-life character sheets): Zafar is doing those himself. Do 1.1 in a fresh chat.
3. packs/chatgpt-art-prompts-batch3.md: every section, top to bottom: 1.1 to 1.5, 2.1 to 2.6, 3.1 and 3.2, 4.1 to 4.3, 5.1 to 5.3, 6.1 to 6.8, 7.1 to 7.4, then 8.1 to 8.3 (34 images). For 4.1 and 4.2, attach char-simba-v1.png only if it's in attach/; otherwise send without it and note that in the log.
Each pack has its own "Instructions for Claude in Chrome" block: don't run those separately; this prompt replaces them, and keeps their per-prompt rules below.
Name every step with its pack, so the log can't drift: "cook 1.3", "b2 2.4", "b3 6.7".

PHOTOS (Zafar has lifted the old "never attach photos" rule)
Photos of real people may now be attached where likeness helps. Tonight that's Nani (Zafar's mum) in two prompts only:
- b3 1.1 (Nani's feelings sheet) and b3 7.1 (Nani, "where it hurts"): attach the pack's files, PLUS private-photos/mum-01.jpg (and mum-02.jpg if it's there; at most two photos). Paste the prompt exactly as written, then add this one paragraph at the very end, exactly as written:
  "Also attached: a photo of the real woman Nani is based on. Use it only to keep her likeness in the face (face shape, eyes, smile) as it survives stylising. The attached character sheet stays the reference for her look, clothes, jewellery and render style. Keep the stylised 3D animated-film look: not photorealistic."
  If there's no mum photo in private-photos/, send the prompt as written without that paragraph, and log it.
- Nowhere else. The cook pack's section 1 is edits of an approved drawing (a photo would make Nani's face jump), Nana, Ma, Ali, Isa and the new people are generic, and Big Ma, the doctor and the cats (bigma-*, doctor-*, simba-*, zazu-*) have no prompt in tonight's run. Ignore the packs' older wording that says no photos: this section replaces it.

FOR EACH PROMPT
1. Start a fresh ChatGPT chat, except where the prompt says to use an existing chat (b3 2.2–2.6, 4.3, 6.2–6.6).
2. Attach exactly the files on its "attach:" line (plus a photo only where PHOTOS says), paste the text of its fenced block exactly as written, and send. Always attach style-anchor-v1.png unless the attach line says not to (the cook pack's section 1, the same-chat follow-ups and b3's relights don't take it). Don't reword, shorten or add to the prompt (the only addition allowed is the photo paragraph above), and never write a prompt of your own. If a prompt can't be sent as written, skip it and say why in the log.
3. When the image arrives, judge it against that prompt's "check:" line, point by point. Also look for: any text or letters; shadows or a floor on a magenta or grey background; items or panels touching or crossing into a neighbour's cell; grid lines or panel borders; a background that isn't flat.
4. For an edit or relight (the cook pack's section 1, b2 1.1, b3 8.1–8.3), compare it with the image you attached: if they look identical, it has failed. In the cook pack's section 1 it has also failed if the head, hands or counter edge have moved or changed size.
5. If it fails, you may redo it ONCE: send the same prompt again in a fresh chat with the same attachments (for a step that runs in an existing chat, send the same prompt again in that chat). Don't send corrections like "make the left one smaller". Keep whichever of the two is better, even if both fail, and note the failures in the log. A step that continues an earlier chat always uses the chat holding the image you KEPT.
6. Download the image you keep with ChatGPT's download button (never a screenshot). Make sure you download the NEW image, not one of the files you attached.
7. Write its log line straight away (see THE LOG), then move on to the next prompt.

SAVING
Downloads go wherever Chrome normally saves them (usually Downloads); don't change that. If Chrome asks where to save, choose Downloads/nani-art-tonight/results/ and, if you can edit the name, use the prompt's "save as:" name. Otherwise keep the name ChatGPT gives it: the log's "save as" column is how Claude matches each file to its step afterwards, so the downloaded file's name must be logged exactly.

THE LOG (one running log for the whole run)
Keep ONE log for all three packs, in one file: Downloads/nani-art-tonight/results/art-run-log.txt. If you can write or append to that file, add each line as you go. If you can't write files from the browser, keep the log in this chat instead: post each new line as soon as you write it, and after every 5 images (and before every image-limit wait) post the whole log so far as one code block, so the latest full log is always near the bottom of the chat.
One line per downloaded image:
  <pack step, e.g. cook 1.3> | <time> | <the downloaded file's name exactly as the browser saved it> | save as <the "save as:" name> | PASS or FAIL (<which check points failed>) | redo used: yes/no | photo attached: none / mum-01.jpg ... | <notes>
Also log every skipped prompt, every redo, every image limit and anything odd (a refusal, an error, a duplicate download, a missing attachment). Number nothing yourself: use the pack and step numbers, so the log can't drift out of step with the files.

IMAGE LIMITS
If ChatGPT says you've hit the image limit, log the time and ChatGPT's exact message. Wait until the time it gives (or check back about every 30 minutes), then carry on from the same prompt. Don't stop the run and don't switch to another tool.

DON'T CHANGE ANYTHING
No ChatGPT settings, model picker, memory, custom instructions, plan or upgrade offers; no Chrome settings or download folder; no signing in or out; no deleting chats. Don't upload anything except the files on each attach line and the photos PHOTOS allows. If something needs a decision from Zafar, log it, skip that step and carry on.

AT THE END
Paste the full log (all three packs), then a short list per pack of what passed, what failed and what was skipped.
```

### After the run (Zafar)

Move the new PNGs from Downloads into `nani-art-tonight/results/` (if they aren't there already), then drag them into the Claude Code chat with the log and say "tonight's run". Claude renames them to the **save as:** names, files the character sheets in `sources/art/characters/` and the rest in `sources/art/chatgpt/`, and cuts them as each pack's **cuts to:** / **slices to:** lines say. Delete the photos from `private-photos/` whenever you like; nothing in the repo needs them.

## 5. The batch-3 (Cook) runner block

> from: docs/archive/art-prompts/chatgpt-art-prompts-batch3-cook.md § 0.4 Instructions for Claude in Chrome (unattended run)


```
You're running the "Cook" batch-3 art prompts in ChatGPT, on your own. Zafar isn't watching; he'll read your log afterwards.

The prompts: docs/archive/art-prompts/chatgpt-art-prompts-batch3-cook.md, open in another tab. Do 1.1 to 1.10, then 2.1 and 2.2, in that order (12 images).
The attachments are in the folder Zafar gave you. Each prompt's "attach:" line says which files go with it. In section 1 attach ONLY the one image named (no style anchor). In section 2 always attach style-anchor-v1.png.

For each prompt:
1. Start a fresh ChatGPT chat.
2. Attach exactly the files on its "attach:" line, paste the text of its fenced block exactly as written, and send. Don't reword, shorten or add to the prompt, and never write a prompt of your own.
3. When the image arrives, judge it against that prompt's "check:" line, point by point. Also look for: any text or letters; shadows on the grey; a background that isn't flat. For an edit (section 1), compare it with the image you attached: if they look identical, it has failed; if the head, hands or counter have moved or changed size, it has failed.
4. If it fails, you may redo it ONCE: send the same prompt again in a fresh chat with the same attachments. Keep whichever of the two is better, even if both fail, and note the failures in the log.
5. Download the image you keep with ChatGPT's download button (never a screenshot). Make sure you download the NEW image, not the file you attached.
6. Write one log line straight away, then move on.

Keep a log as you go, and paste it in full as your last message. One line per downloaded image:
  <step> | <time> | <the downloaded file's name exactly as the browser saved it> | save as <the "save as:" name> | PASS or FAIL (<which check points failed>) | redo used: yes/no | <notes>

Image limits: if ChatGPT says you've hit the image limit, log the time and its exact message, wait, then carry on. Don't stop the run and don't switch to another tool.

Don't change anything: no ChatGPT settings, model picker, memory, custom instructions, no Chrome settings or download folder. If something needs a decision from Zafar, log it, skip that step and carry on.

At the end: paste the full log, then a short list of what passed, what failed and what was skipped.
```


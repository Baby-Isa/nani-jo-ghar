# Batch brief-01: CHAI-92, CHAI-93, CHAI-87, SH-226, Zafar's picked juice wired into chai (6 Nov)

Verdict file: build/screenshots/juice/judge/brief-01.verdicts.md

Each sheet is chai at 1280x665 (cook.html, the station lab `njgTest.cook.lab("chai-tray")` or a chai order, the sandbox's fair player at a child's pace, speed 1), shot by `build/tools/juice/shoot_juice.mjs`. BEFORE (red label) is the same play with the game's files of commit 09c3dc4 (the code before this change), AFTER (green label) this branch. Each still is taken with the kitchen's Phaser tweens frozen for the instant of the shot; the page's own animations run on. The two plays are timed independently, so a frame's ms is from its moment (the pour's end, the drop's start), not the same instant to the millisecond. Sounds are not judged here (the voice gate's proof is in the report, `build/reports/juice-chai-wired-2026-11-06.md`, from the sound log); judge only what shows. Never a verdict: every glass, round and order gets its effect whatever went in, and nothing shown may read as right or wrong.

## CHAI-92 (the juice: steam, tray glass, end screen, the serve's stamp)
Issue (Zafar, 6 Nov, his picks on `lab/juice.html`): "steam 1 (full wisps) over the hob's pan as it boils; sparkle 2 (three twinkles) on a full glass; gold burst 1 behind the end screen's badge and the serve's stamp"; on the tray's top-down glass: "maybe it just needs to start from a smaller height, like a third of the height ... so it doesn't start from way above ... It's just a bit more subtle, but paired with the 3 sparkles."
Check:
- sheet-A-steam-1280x665.png: BEFORE the s11 cartoon steam (a drawn white curl over the rim); AFTER soft painted wisps rising from the boiling pan's far rim, reading on the dark hob and fading as they rise; no wisp over a tap target (the knob, the face, the shelf), nothing covering the heat ring's gauge or the "hakro" bubble. Whole screens below the crops: nothing else on the hob changed.
- sheet-B-glass-L1-1280x665.png (milky, full glass): AFTER a small painted drop falls a short way (about two thirds of the glass's width) into the glass, clear of the person's face on the glass's upper left, then three small gold twinkles over the glass's right half one after another, gone by 1.5 s; BEFORE nothing but the s11 star the old code drew at Done (over a right glass only; AFTER draws the s17 twinkles there too, so two sets may overlap at L1). The plays are timed apart: in some AFTER frames the round has already moved on (the face fading for the review). The drop and twinkles must be subtle, never over the face, never cut at the tray's edge. sheet-B-glass-L4 (black tea, a half glass at L4's first pour): AFTER the drop only (twinkles are for a full glass); judge that no twinkle shows on the half glass.
- sheet-D-end-1280x665.png (chai L4): AFTER a soft gold glow blooms behind the stopwatch (under the watch, not over its numbers), every round; the badges, numbers and the next button unchanged and unclipped.
- sheet-E-stamp-1280x665.png: AFTER a soft gold glow behind the served card's ink stamp as it lands, under the stamp (the stamp and its tick stay on top), the dish picture and its word "chai" still readable.
Flaws first, anywhere on the crops.
Sheets: build/screenshots/juice/sheet-A-steam-1280x665.png, build/screenshots/juice/sheet-B-glass-L1-1280x665.png, build/screenshots/juice/sheet-B-glass-L4-1280x665.png, build/screenshots/juice/sheet-D-end-1280x665.png, build/screenshots/juice/sheet-E-stamp-1280x665.png

## CHAI-93 (the word moment's last drop painted)
Issue (Zafar, 6 Nov): "there's a little drop then that pours in last. I do like the little drop as a fun animation, but it does look code drawn ... So I don't know whether you can just get a little drop or something made in artwork." His pick: "last drop 1 (with the crown) in the word moment (side-on glass)".
Check: sheet-C-word-moment-1280x665.png: BEFORE the stream's tail and a small drawn dot (a CSS shape) falling into the glass; AFTER a painted tea drop with its tail falls from the kettle's spout into the side-on glass and, as it lands on the tea, a small crown splash rises from the surface and fades (the 600 ms frame). The drop must look painted like the rest of the art, the right tea colour family, not outside the glass when it lands, the crown on the tea's surface (not floating above or below it).
Sheets: build/screenshots/juice/sheet-C-word-moment-1280x665.png

## Reduced motion (CHAI-92)
Check: sheet-F-reduced-motion-1280x665.png (AFTER only, the system's reduced-motion setting): every effect fades where it is and nothing travels: one still wisp over the pan, one soft glint on the glass (no three twinkles), the word moment's drop as a small dot where it lands (no fall, no crown), the gold glow behind the stamp; nothing glaring or covering a face or a word.
Sheets: build/screenshots/juice/sheet-F-reduced-motion-1280x665.png

## The strip
build/screenshots/juice/strip-after-1280x665.png: every effect after the change, in play order (for an overall look; judge the pairs above for the rows).

## CHAI-87, SH-226 (sound: not on these sheets)
The pour (Zafar's pick pour A) and every other picked sound are heard, not seen; their proof is the report's sound-log table and `node --test build/test_shared_sfx_files.mjs`. Write `EVIDENCE: sound` for these two if you cannot judge them from the report's text, or judge the report's proof as text.

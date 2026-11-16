# Evidence batch-02 (layout, 10 rows) · run r16pb-cook

You are the reviewer for Nani jo Ghar's evidence loop (decision 82). You are not the session that built these changes (probes-built).

For each row: read its sheet (PNG, if it has one: its panels are labelled A-D, or up to A-L over two sheets for a row with more probes: read both; the labels repeated below) and its text file (.md: the panels in words, the voice timeline, text captures, expect results). Judge against the row's own words (Zafar's feedback), nothing else. Words the engine marks loan:en (thank you, mixed, cup, film) are Kutchi (decision 87): never flag them as English. A line shown as grey-italic English with the hidden to-record tag is allowed (decision 84): it is not an English leak and not a missing clip; only its absence from Mum's list is a gap.
1. Flaws first: anything wrong in the panels (clipping, overlap, English for the child, a bubble away from its speaker, old art), even off the row's point.
2. Then one line in build/screenshots/evidence/r16pb-cook/judge/batch-02.verdicts.md:
   `ID | PASS: <panel>, <what that panel shows that proves it>` e.g. `CLN-100 | PASS: A, L3 wrap crosses the kneecap, 6 turns`
   `ID | FAIL: <panel>, <what is wrong>`
   `ID | EVIDENCE: <what the sheet is missing>` only when the sheet does not show the row's state at all (it goes to the tool owner, never to the list as a FAIL).
   A PASS that names no panel is refused. A text-only row (Sheet: (text only)) names its text capture instead, by its label in the .md: `SH-45 | PASS: SH-45-p1-L1-1280x665 dom, the line reads ...` (or `PASS: text, ...`); a script capture by the command printed after its `####` heading: `LNG-04 | PASS: grep -n -i "ph-turner" data/lang/reports/gap-list.md, the placeholder is on Mum's list`. Sound quality and feel are not yours: say so in a FAIL only when the row is about what you can read (which clip, when, in what order).
3. First line of the verdict file: `judge: <your model and session>`.

## CHAI-89 [open] Shared components > Order cards
- Issue: The play area centred on the worktop at every size (Zafar, 5 Nov evening: "a lot more space on top ... placed centrally, both X and Y axis, including the gameplay area ... big enough to accommodate all the items that will or currently appear")
- Check: auto: chai L1-L4 at the four sizes, 971x318 and 1024x768: the space above the group (less the count pills' room) and below it within 10% of each other, and the space left and right of it within 10%; nothing in play crosses the group's box
- Sheet: /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/CHAI-89.png
- Text: /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/CHAI-89.md
- Panel A: cook:chai-tray#speed1 L1 1280x665 [p-fresh] · crop:#game at every onboard (4)
- Panel B: cook:chai-tray#speed1 L1 740x320 [p-fresh] · crop:#game at every onboard (4)

## CHAI-08 [open] Cook: chai
- Issue: v2 mock-up fixes: hob and tray about 15% bigger and lower, pans true top-down, tilted pan for the pour, real top-down glasses and liquids · 22 Oct: "can we just revert to the old chai pans? ... this tea pan is still not top down properly and it's still not centred on the burner. I don't know why you can't see that"; "the tea glass is ... not exactly top down ... and it's not centred in the cup holder either" (screenshot 4) · 28 Oct (told again): "redo the chai pan and glasses to be proper top down" with his reference (sources/art/refs/2026-10-28-chai/glass-top-down-ref.png: the base centred, the rings even) · Superseded in part (Zafar, 29 Oct: "the pouring pans didn't work so now I'm switching to just having the pans move above the glasses and empty and the glasses fill up"): no tilted pan; the pan flat over its glass, emptying
- Check: eye: 1366×768
- Sheet: /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/CHAI-08.png and /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/CHAI-08-2.png and /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/CHAI-08-3.png and /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/CHAI-08-4.png and /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/CHAI-08-5.png
- Text: /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/CHAI-08.md
- Panel A: cook:chai-tray L1 1366x768 [p-seen] · shot at rec:view-marble
- Panel B: reference: build/sandbox/data/refs/chai-v2-mockup.png
- Panel C: cook:chai-tray L1 1366x768 [p-seen] · strip:#stage:4x250 at exp:pour-nana
- Panel D: cook:chai-tray@L4 L4 1920x1080 [p-seen] · strip:#stage:10x200 at exp:pour-nana
- Panel E: cook:chai-tray@L4 L4 930x430 [p-seen] · strip:#stage:10x200 at exp:pour-nana

## CHAI-35 [open] Cook: chai
- Issue: "How has Nani's call-out card gone down in the sidebar covering up other elements ... what happened to telling me": no card falls back over the order card without asking (the hint card goes into Nani's box: SH-149)
- Check: auto: chai L1, L2, L3 and L4 at 971x318 and 1280x665
- Sheet: /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/CHAI-35.png
- Text: /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/CHAI-35.md
- Panel A: cook:chai-tray#hint L1 1920x1080 [p-seen] · shot at rec:hint-glow
- Panel B: cook:chai-tray#hint L1 740x320 [p-seen] · shot at rec:hint-glow

## CHAI-36 [open] Cook: chai
- Issue: "The whole screen's gone dark but nothing's highlighted and the tea isn't ready to be turned off ... way too early": the dim comes only with its lit target
- Check: auto: chai L1, L2, L3 and L4 at 971x318 and 1280x665 (no dim frame without a lit target)
- Sheet: /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/CHAI-36.png
- Text: /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/CHAI-36.md
- Panel A: cook:chai-tray L1 1920x1080 [p-fresh] · shot at exp:knob-on-nana
- Panel B: cook:chai-tray L1 930x430 [p-fresh] · shot at exp:knob-on-nana
- Panel C: cook:chai-tray L1 1920x1080 [p-fresh] · shot at exp:knob-nana
- Panel D: cook:chai-tray L1 930x430 [p-fresh] · shot at exp:knob-nana

## CHAI-38 [open] Cook: chai
- Issue: "Remeber to use the other elements of the chai game like the actual heating animation and ring etc - just apply the new elements from this stuff to what's there": the roll-out puts the new cards, helper card and onboarding into the real chai; its heat, heat ring, pan states and pour stay
- Check: auto: chai L1, L2, L3 and L4 at the four sizes; eye: the heat and ring as before
- Sheet: /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/CHAI-38.png
- Text: /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/CHAI-38.md
- Panel A: cook:chai-tray L1 930x430 [p-seen] · shot at rec:results-badges
- Panel B: cook:chai-tray@L4 L4 930x430 [p-seen] · shot at rec:results-badges

## CHAI-48 [open] Cook: chai
- Issue: Found by the orchestrator's contract run (30 Oct, s14-A-contract): in a two- or three-person chai the next person's long first line, pushed along by the screen's edge, sat over Nana's face (contract-52, 41-64% of his head at 1280x665 and 740x320): the bubble keeps off every other person's head (Cook passes them to the shared placement, which wraps the line narrower at its own speaker before trying the other side)
- Check: auto: contract-52 on every Cook game with two or more people at the four sizes
- Sheet: /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/CHAI-48.png and /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/CHAI-48-2.png and /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/CHAI-48-3.png and /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/CHAI-48-4.png
- Text: /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/CHAI-48.md
- Panel A: cook:chai-tray@L3#order-whole L3 1280x665 [p-seen] · shot at every bubble (8)
- Panel B: cook:chai-tray@L3#order-whole L3 740x320 [p-seen] · shot at every bubble (8)

## CHAI-49 [open] Cook: chai
- Issue: Found by the s14-tools check (contract-78) and the orchestrator's film (30 Oct): at L3-L4 a cold pan that was not the one in hand opened its knob step as a tap on the pan, so "Chulo bar!" was said with nothing lit (the third pan, every L4 round at a child's pace): its knob is lit with the call
- Check: auto: contract-78 on chai L3-L4 at speed 1
- Sheet: /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/CHAI-49.png
- Text: /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/CHAI-49.md
- Panel A: cook:chai-tray@L4#speed1 L4 1280x665 [p-seen] · shot at rec:kind-timing
- Panel B: cook:chai-tray@L4#speed1 L4 930x430 [p-seen] · shot at rec:kind-timing

## CHAI-56 [open] Cook: chai
- Issue: "I'm still getting in the onboarding for Chulobara, turn on the stove, even though I haven't got new player selected. I'm immediately getting that onboarding. So that needs fixing ... because Nani says then as the next instruction, she says turn on the stove, and that triggers the onboarding support to give the visual to what she's saying. However, that works well during onboarding if you're a new player. If you're not a new player, Nani should just give you the instruction, and then, like how we have the rule of like 7 or 9 or 11 seconds of no activity, you get extra help. After that time has elapsed, then you should get the onboarding visual of turning on the stove. Otherwise, you should just get the verbal instruction": a returning player hears the call alone; the knob's light comes only after the level's wait
- Check: auto: chai at L1, L2, L3 and L4, new and returning (returning: "Chulo bar!" with nothing lit; the lit knob after 7, 9, 11, 13 s with no tap)
- Sheet: /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/CHAI-56.png and /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/CHAI-56-2.png and /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/CHAI-56-3.png and /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/CHAI-56-4.png and /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/CHAI-56-5.png
- Text: /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/CHAI-56.md
- Panel A: cook:chai-tray L1 1280x665 [p-fresh] · shot at every onboard (4)
- Panel B: cook:chai-tray L1 740x320 [p-fresh] · shot at every onboard (5)
- Panel C: cook:chai-tray@L3 L3 1280x665 [p-fresh] · shot at every onboard (5)
- Panel D: cook:chai-tray@L3 L3 740x320 [p-fresh] · shot at every onboard (7)

## DAAR-39 [open] Cook: daar
- Issue: "the onboarding for the chop game definitely went awry ... going up and down jerkily"; "the whole entire screen of the chop game has been highlighted, and it's been treated as an item ... Just highlight the knife ... a small horizontal strip, maybe twice the height of the knife, running the full width along. The rest is shaded darker. And then there's a finger grabbing the knife and dragging it from right to left. And as it drags it from right to left, it chops an item in half. So an item happens to jump in ... that highlighted rectangle box on purpose, predestined ... don't add it to the chopped list ... once it's chopped it, the highlight goes and the player can play. But if the player chooses to grab the knife, no, actually don't let them ... make them wait for the onboarding": the chop's first time is that strip demo; nothing else lit or bouncing; the knife locked until it ends
- Check: auto: daar's chop at L1 as a new player, filmed at the four sizes: a strip about twice the knife's height across the board's full width, the rest darker, the finger dragging the knife right to left, one planted vegetable cut, not counted; the knife inert until the end; the window resized during the demo: no jitter
- Sheet: /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/DAAR-39.png
- Text: /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/DAAR-39.md
- Panel A: cook:daar#speed1 L1 1280x665 [p-fresh] · crop:#game at every onboard (4)
- Panel B: cook:daar#speed1 L1 740x320 [p-fresh] · crop:#game at every onboard (4)

## DAAR-45 [open] Cook: daar
- Issue: One stir, one look (Zafar, 8 Nov: "stir ... it's not the same as the stir in daar like it is a different speedo it's a different style different art different zoom different everything's different ... you might just drop that game in half basically which is two completely different screens")
- Check: auto: stir and daar's stir at L1, L2, L3 and L4: the same dial, pot, art and zoom (one frame each, side by side)
- Sheet: /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/DAAR-45.png
- Text: /home/user/nani-jo-ghar/build/screenshots/evidence/r16pb-cook/DAAR-45.md
- Panel A: cook:daar L1 1280x665 [p-seen] · stir-mid: the screen, #side outlined
- Panel B: cook:daar L1 1280x665 [p-seen] · crop:#side at rec:stir-mid


# Evidence batch-04 (motion, 5 rows) · run r16pb-newcook

You are the reviewer for Nani jo Ghar's evidence loop (decision 82). You are not the session that built these changes (probes-built).

For each row: read its sheet (PNG, if it has one: its panels are labelled A-D, or up to A-L over two sheets for a row with more probes: read both; the labels repeated below) and its text file (.md: the panels in words, the voice timeline, text captures, expect results). Judge against the row's own words (Zafar's feedback), nothing else. Words the engine marks loan:en (thank you, mixed, cup, film) are Kutchi (decision 87): never flag them as English. A line shown as grey-italic English with the hidden to-record tag is allowed (decision 84): it is not an English leak and not a missing clip; only its absence from Mum's list is a gap.
1. Flaws first: anything wrong in the panels (clipping, overlap, English for the child, a bubble away from its speaker, old art), even off the row's point.
2. Then one line in /home/user/nani-jo-ghar/build/reports/run16/judge/probes-built/r16pb-newcook/batch-04.verdicts.md:
   `ID | PASS: <panel>, <what that panel shows that proves it>` e.g. `CLN-100 | PASS: A, L3 wrap crosses the kneecap, 6 turns`
   `ID | FAIL: <panel>, <what is wrong>`
   `ID | EVIDENCE: <what the sheet is missing>` only when the sheet does not show the row's state at all (it goes to the tool owner, never to the list as a FAIL).
   A PASS that names no panel is refused. A text-only row (Sheet: (text only)) names its text capture instead, by its label in the .md: `SH-45 | PASS: SH-45-p1-L1-1280x665 dom, the line reads ...` (or `PASS: text, ...`); a script capture by the command printed after its `####` heading: `LNG-04 | PASS: grep -n -i "ph-turner" data/lang/reports/gap-list.md, the placeholder is on Mum's list`. Sound quality and feel are not yours: say so in a FAIL only when the row is about what you can read (which clip, when, in what order).
3. First line of the verdict file: `judge: <your model and session>`.

## SH-60 [open] Shared components > Layout and stage
- Issue: Help (line and glow) only after the pause, for the first item too; a new player sees every word ("Start over" clears learned words; "play as new" in "?"); 17 Oct: "I've literally pressed chai ... almost immediately I'm getting the audible hint to put in milk"; "the highlight should only happen at the same time as the voice instruction ... both held back a couple more seconds"; "for the first one we just bump it up by two seconds"; "Give a bit more time for the hints, especially because a hint should cost a bulb"; his question "there is an onboarding tutorial, isn't there?": yes, the first play of each recipe is guided (js/cook/flow.js:406) and highlights at once; after that his rule holds · Merged SH-95: A help ladder, every game: "it definitely shouldn't play at the beginning ... after a reasonable amount of time Nani tells you the instruction audibly and the items start flashing"; "You shouldn't be getting help, especially not in level four ... beginning levels, with hints, and it shouldn't persist"; "Can we check how and when she chimes in on level 3?"; the lab's "Nani helps" on by default · Merged SH-96: "Flash the light bulb on the recipe card, or both light bulbs ... after like 15 or 20 seconds ... so they know that they can use the light bulbs and they're clickable", every game
- Check: eye: pantry L2, fresh profile · LNG-02 · auto: every game, a contract-run check built with the fix (no line or glow before the pause from the last action)
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/SH-60.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/SH-60-2.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/SH-60.md
- Panel A: cook:fetch@L2#hint L2 1366x768 [p-fresh_gl] · strip:#stage:8x1000 at rec:view-pantry

## DAAR-47 [open] Cook: daar
- Issue: Things poured into daar's pot from above? (Zafar, 9 Nov: "I mean, can we have things pouring in from the top into the pan? Maybe we can, but then my worry is like, well, then we probably should have done the same for chai, no? Maybe with tea we had a bad problem because the pouring came from an item, which made it a lot more complicated than coming down from the sky. I guess with tea we have the spoon doing most of it. I don't know, maybe we don't need to be consistent, but I don't like the sound of that. I don't know, is it worth being consistent and then missing out on a nice visual for Dar if you think it's possible for us to do it? I don't know, if I'm honest. I could use your help on this one. I'm not sure if you had to do a good animation though, to be honest. I think we should. I'm erring towards leaving it out because I don't think we'll be able to execute it well. And a nagging part of me doesn't like that that's not how it's done on Chai. And it's top down as well, so you wouldn't necessarily see it so much.")
- Check: eye: daar at L1, L2, L3 and L4, if it is built
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/DAAR-47.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/DAAR-47-2.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/DAAR-47.md
- Panel A: cook:daar L1 1280x665 [p-seen] · strip:#stage:4x250 at drv:daar-in
- Panel B: cook:daar@L4 L4 1280x665 [p-seen] · strip:#stage:4x250 at drv:daar-in

## DAAR-66 [open] Cook: daar
- Issue: Daar's hob step comes in, not from nothing (bare marble up to 0.4 s, then the whole scene in one frame), and the asker's face circle at the hob is the kit's size, beside its bowl (today a speck floating beside the steel bowl)
- Check: auto: daar L1-L4, four sizes: no frame of bare marble between steps; the face circle the kit's size
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/DAAR-66.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/DAAR-66-2.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/DAAR-66-3.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/DAAR-66.md
- Panel A: cook:daar L1 740x320 [p-seen] · strip:#stage:4x120 at life:step-open
- Panel B: cook:daar L1 740x320 [p-seen] · strip:#stage:4x120 at life:step-call · NO MOTION CAPTURED
- Panel C: cook:daar L1 740x320 [p-seen] · strip:#stage:4x120 at life:step-close
- Panel D: cook:daar@L4 L4 740x320 [p-seen] · strip:#stage:4x120 at life:step-open
- Panel E: cook:daar@L4 L4 740x320 [p-seen] · strip:#stage:4x120 at life:step-call
- Panel F: cook:daar@L4 L4 740x320 [p-seen] · strip:#stage:4x120 at life:step-close

## CK-123 [open] Cook: general
- Issue: Eggs: the boiled egg's pot shows water and its boil (chai's pot shows water, the boil, the colour); today a whole egg sits in a dry steel pot over a flame
- Check: auto: eggs L2-L4 (boiled), four sizes: the pot's water drawn from the egg's going in, the boil while it cooks
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/CK-123.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/CK-123-2.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/CK-123-3.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/CK-123.md
- Panel A: cook:eggs@L2 L2 740x320 [p-seen] · strip:#stage:4x250 at cook-done:click
- Panel B: cook:eggs@L2 L2 740x320 [p-seen] · strip:#stage:4x250 at cook-done:tap
- Panel C: cook:eggs@L2 L2 740x320 [p-seen] · strip:#stage:4x250 at cook-done:tap
- Panel D: cook:eggs@L4 L4 740x320 [p-seen] · strip:#stage:4x250 at cook-done:click
- Panel E: cook:eggs@L4 L4 740x320 [p-seen] · strip:#stage:4x250 at cook-done:tap · NO MOTION CAPTURED
- Panel F: cook:eggs@L4 L4 740x320 [p-seen] · strip:#stage:4x250 at cook-done:tap

## CK-135 [open] Cook: general
- Issue: Baking: the dough visibly becomes naan and the bowl's things go to the oven in place, never a cross-fade of two scenes (the s20-b2-baking call taken: a crossfade; Fable: chai glides or changes things in place)
- Check: auto: baking L1-L4: no frame where two scenes are both half shown; the dough's change seen
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/CK-135.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/CK-135-2.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/CK-135-3.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/CK-135-4.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/CK-135-5.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/CK-135-6.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/CK-135-7.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/CK-135-8.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/CK-135.md
- Panel A: cook:baking L1 1280x665 [p-seen] · strip:#stage:4x150 at life:step-close · NO MOTION CAPTURED
- Panel B: cook:baking L1 1280x665 [p-seen] · strip:#stage:4x150 at life:step-close
- Panel C: cook:baking L1 1280x665 [p-seen] · strip:#stage:4x150 at life:step-call
- Panel D: cook:baking L1 1280x665 [p-seen] · strip:#stage:4x150 at life:step-call
- Panel E: cook:baking@L4 L4 1280x665 [p-seen] · strip:#stage:4x150 at life:step-close
- Panel F: cook:baking@L4 L4 1280x665 [p-seen] · strip:#stage:4x150 at life:step-close · NO MOTION CAPTURED
- Panel G: cook:baking@L4 L4 1280x665 [p-seen] · strip:#stage:4x150 at life:step-close
- Panel H: cook:baking@L4 L4 1280x665 [p-seen] · strip:#stage:4x150 at life:step-close


<!-- source: b5a24e0 origin/run16/probes-built:build/screenshots/evidence/r16pb-newcook/judge/batch-04.md -->

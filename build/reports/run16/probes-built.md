# Run 16: probes-built (hand-back)

The 202 rows whose status says built under "to fix", proved on today's head (the branch base 48003532 plus spec changes only: no game code touched).

**Counts:** cannot-probe 96 · proven 67 · open 23 · built 16. Cook rows: 116, of them proven 54, open 15.

## Flaws first

- **Built rows that are not fixed (open, 23).** The check or the judge shows the fault on today's head:
- **SH-224** (other, Logic): partly built (chai and the tokens host Lora): cook.html and the other pages still load Google fonts; the row waits for the roll-out.
- **SH-226** (other, Logic): chai part built and green; the row is to fix: code for every other game (waits for the frame).
- **SH-203** (kit, Look): built per its status, but the check fails on today's head: machine: SH-203-p1-L4-1280x665: pass: 1 contract breaks
- **SH-151** (other, Check): the kit reads the type roles, but the other modes still name faces and colours outside the tokens; the lint passes only because it warns until the roll-out.
- **SH-285** (kit, Logic): Nani own order does flash its first card, but for about 100 ms, not as it is said: the SH-267 flash fault (fix-kit owns it)
- **PAN-04** (kit, Logic): Cook is one voice at a time; the clinic send-off count overlaps (clinic is parked, so the clinic part is Parked)
- **CHAI-34** (chai, Art): built per its status, but the judge sees the fault on today's head
- **CHAI-39** (chai, Kutchi): built per its status, but the judge sees the fault on today's head
- **CHAI-49** (chai, Teaching): built per its status, but the judge sees the fault on today's head
- **DAAR-12** (daar, Teaching): built per its status, but the judge sees the fault on today's head
- **DAAR-61** (chop, Logic): built per its status, but the judge sees the fault on today's head
- **SAM-30** (samosa, Teaching): built per its status, but the judge sees the fault on today's head
- **CHT-13** (chaat, Art): built per its status, but the judge sees the fault on today's head
- **CHT-18** (chaat, Teaching): built per its status, but the judge sees the fault on today's head
- **CK-54** (kit, Logic): built per its status, but the judge sees the fault on today's head
- **CK-122** (eggs, Look): built per its status, but the judge sees the fault on today's head
- **CK-126** (eggs, Logic): built per its status, but the check fails on today's head: machine: CK-126-p1-L2-740x320: pass: 1 contract breaks; CK-126-p1-L3-740x320: pass: 2 contract breaks
- **SH-314** (other, Logic): 270f39f fixed most of the leak but a timing-dependent one remains: a word card fitted after unmount re-adds its resize listener and section, and an audio context can stay open; needs fix-kit (shared files).
- **PRC-06** (other, Check): built per its status, but the check fails on today's head: machine: PRC-06-p1-repo: pass: node build/tools/review/evidence.mjs --plan --all: exit 1
- **SH-122** (kit, Look): to fix: code, research and propose (not built); my still was the wrong check (judge audit FAIL): it needs a strip across a zoom hand-over
- **CK-84** (baking, Look): built per its status, but the judge sees the fault on today's head
- **CK-85** (chaat, Look): built per its status, but the judge sees the fault on today's head
- **CK-80** (corn, Teaching): built per its status, but the judge sees the fault on today's head
- **Weak red.** Most proven rows are green on head with the fix commit cited, not replayed red. The repo was shallow (history from 8 Nov); I deepened it, but a red replay costs browser time. Replayed red→green: DAAR-40 (contract-95, 64cff18f5~1); by script, SH-316 (934f5fa~1) and SH-221 (the old call put back). CK-91 is red on 1f8400855~1 (the flash card over the cog), but on head the flash lasts about 100 ms, so its green cannot be seen until SH-267 is fixed. CK-90's red did not show on its old commit on either the fair or the mistake path: no driver makes the refused tap while a topping flies. Its green is real, but the check cannot tell before from after.
- **Checks I found testing the wrong thing and rewrote:** CK-91 (contract-119 passed before the fix; now noOverlap of .wc14-flash and #side-cog), DAAR-40 (the cmd failed on any contract break; now contract-95 alone), CK-90 and CK-113 (fair play never makes a refused tap; now the mistake path), SAM-31 (asked for 2 cards at L1, but L1 orders one filling), SH-224 (now red while cook.html loads a Google font). The judge's audit failed ART-51, DAAR-37, SH-209 and SH-122; those are cannot-probe (or open) with the reason.
- **Browser time.** ~1.6-2 pages a minute on 4 cores. The new shared and chai eye specs did not all play; they are cannot-probe with their spec ready (`evidence.mjs --run --rows <id>`).

## Proven (67)

- **SH-227** (kit, Look): the machine check passes on today's head
- **CHAI-89** (chai, Look): eye row passed by the independent judge on today's head
- **SH-177** (kit, Look): the machine check passes on today's head
- **SH-155** (kit, Check): the machine check passes on today's head
- **SH-159** (kit, Teaching): eye row passed by the independent judge on today's head
- **SH-160** (kit, Teaching): eye row passed by the independent judge on today's head
- **SH-290** (kit, Check): the machine check passes on today's head
- **SH-305** (kit, Logic): the machine check passes on today's head
- **PAN-22** (kit, Teaching): the machine check passes on today's head
- **CHAI-08** (chai, Art): eye row passed by the independent judge on today's head
- **CHAI-35** (chai, Look): eye row passed by the independent judge on today's head
- **CHAI-36** (chai, Teaching): eye row passed by the independent judge on today's head
- **CHAI-38** (chai, Logic): eye row passed by the independent judge on today's head
- **CHAI-48** (kit, Look): eye row passed by the independent judge on today's head
- **DAAR-36** (daar, Logic): eye row passed by the independent judge on today's head
- **DAAR-39** (daar, Teaching): eye row passed by the independent judge on today's head
- **DAAR-40** (daar, Logic): fixed by 64cff18f5 (the chop opens its own step as its board starts); red then green on contract-95 alone
- **DAAR-41** (daar, Teaching): the machine check passes on today's head
- **DAAR-43** (daar, Look): the machine check passes on today's head
- **DAAR-44** (daar, Look): the machine check passes on today's head
- **DAAR-45** (daar, Look): eye row passed by the independent judge on today's head
- **DAAR-03** (daar, Teaching): eye row passed by the independent judge on today's head
- **DAAR-47** (daar, HisCall): eye row passed by the independent judge on today's head
- **DAAR-57** (daar, Look): eye row passed by the independent judge on today's head
- **DAAR-58** (daar, Look): the machine check passes on today's head
- **DAAR-63** (chop, Teaching): the machine check passes on today's head
- **DAAR-65** (daar, Look): the machine check passes on today's head
- **SEK-22** (sekelo, Look): eye row passed by the independent judge on today's head
- **SEK-25** (sekelo, Logic): eye row passed by the independent judge on today's head
- **SEK-26** (sekelo, Look): eye row passed by the independent judge on today's head
- **SAM-31** (samosa, Logic): the row reason holds (no old box); the spec asked >=2 cards at L1, but L1 orders one filling, so it now asks >=1 there (sheet SAM-31.png panels B, D)
- **SAM-34** (samosa, Look): eye row passed by the independent judge on today's head
- **SAM-36** (samosa, Logic): eye row passed by the independent judge on today's head
- **SAM-42** (samosa, Teaching): the machine check passes on today's head
- **SAM-43** (samosa, Look): eye row passed by the independent judge on today's head
- **MAA-23** (maani-line, Teaching): eye row passed by the independent judge on today's head
- **MAA-26** (maani-line, Logic): eye row passed by the independent judge on today's head
- **MAA-27** (maani-line, Look): eye row passed by the independent judge on today's head
- **CK-53** (kit, Look): the machine check passes on today's head
- **CK-61** (corn, Look): the machine check passes on today's head
- **CK-62** (eggs, Look): the machine check passes on today's head
- **CK-63** (eggs, Look): the machine check passes on today's head
- **CK-64** (eggs, Logic): eye row passed by the independent judge on today's head
- **CK-72** (baking, Teaching): eye row passed by the independent judge on today's head
- **CK-77** (eggs, Look): eye row passed by the independent judge on today's head
- **CK-104** (corn, Look): eye row passed by the independent judge on today's head
- **CK-113** (kit, Logic): the machine check passes on today's head
- **CK-114** (eggs, Logic): the machine check passes on today's head
- **CK-120** (eggs, Look): eye row passed by the independent judge on today's head
- **CK-123** (eggs, Look): eye row passed by the independent judge on today's head
- **CK-124** (eggs, Look): the machine check passes on today's head
- **CK-127** (corn, Look): eye row passed by the independent judge on today's head
- **CK-128** (corn, Look): eye row passed by the independent judge on today's head
- **CK-129** (corn, Look): eye row passed by the independent judge on today's head
- **CK-130** (corn, Look): eye row passed by the independent judge on today's head
- **CK-131** (corn, Logic): the machine check passes on today's head
- **CK-133** (baking, Look): eye row passed by the independent judge on today's head
- **CK-134** (baking, Look): eye row passed by the independent judge on today's head
- **CK-136** (baking, Look): eye row passed by the independent judge on today's head
- **SH-315** (eggs, Check): the machine check passes on today's head
- **SH-316** (other, Check): fixed by 934f5fa (the labs page carries the import map); red on the commit before, green today.
- **CHAI-65** (chai, Look): eye row passed by the independent judge on today's head
- **SH-221** (other, Logic): the shared buttons call the one tap sound sfx.js has; the check names the old call when it comes back.
- **SH-183** (kit, Look): the machine check passes on today's head
- **SH-187** (kit, Look): the machine check passes on today's head
- **SH-261** (kit, Teaching): the machine check passes on today's head
- **CK-90** (corn, Logic): green on head on the mistake path; the check could not show the old fault, so the proof rests on green plus the fix commits 231080600 and 1f8400855

## Built, waiting on the judge's eye (16)

Batches: build/screenshots/evidence/r16pb-cook/judge/, r16pb-newcook/judge/, r16pb-newsh/judge/, r16pb-fix/judge/ (sheets committed).

SH-308, SH-310, CHAI-42, CHAI-56, DAAR-46, DAAR-62, SEK-31, SEK-32, SAM-45, MAA-19, MAA-21, CHT-20, CK-118, CHAI-58, CHAI-110, CK-83

## Cannot-probe (96)

- **CHAI-91** (chai, Logic): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows CHAI-91
- **CHAI-92** (other, Check): only Zafar can judge it: Zafar plays every sound and sees every visual on the juice lab page, alone and over a chai screenshot
- **CHAI-93** (chai, Art): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows CHAI-93
- **SH-222** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-222
- **SH-223** (kit, Look): only Zafar can judge it: Zafar plays chai in Lora and Fraunces, then the roll-out before/after per game: the type feels elegant, not too bold
- **ART-50** (chai, Check): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows ART-50
- **ART-51** (chai, Check): the row is item sizes 100/91/84 of the slot and a 40 CSS px floor: an eye crop cannot measure it (judge audit FAIL); needs the art size tool (artcolour size) run on the shelf boxes
- **ART-52** (kit, Check): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows ART-52
- **SH-213** (kit, Teaching): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-213
- **SH-214** (kit, Logic): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-214
- **SH-216** (kit, Check): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-216
- **SH-215** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-215
- **CHAI-86** (chai, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows CHAI-86
- **CHAI-87** (chai, Logic): only Zafar can judge it: Zafar hears the pour into a glass (pour A) on the lab page and in chai L1-L4: does it sound like tea poured into a glass
- **CHAI-90** (chai, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows CHAI-90
- **SH-219** (kit, Look): pillcheck.mjs exits 1 on head while every size it prints passes (740x320 L1 5 pills 12.1 px; L2-L3 0 pills, the ladder hides them for a seen player): a tool fault for its owner
- **SH-217** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-217
- **CHAI-88** (chai, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows CHAI-88
- **SH-218** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-218
- **ART-43** (kit, Check): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows ART-43
- **ART-41** (kit, Check): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows ART-41
- **ART-40** (kit, Check): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows ART-40
- **CHAI-84** (chai, Art): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows CHAI-84
- **SH-209** (kit, Look): the row is the box height with and without its arrow; contract-101 does not measure that (judge audit FAIL) and no driver opens and shuts the arrow
- **SH-171** (kit, Logic): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-171
- **SH-180** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-180
- **SH-182** (kit, Teaching): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-182
- **SH-60** (kit, Teaching): the sheet did not show the row's state (a probe fault, judged NOT SHOWN); the spec needs a better moment or capture
- **SH-228** (kit, Teaching): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-228
- **SH-139** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-139
- **SH-140** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-140
- **SH-142** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-142
- **SH-143** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-143
- **SH-144** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-144
- **SH-152** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-152
- **SH-154** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-154
- **SH-156** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-156
- **SH-157** (kit, Logic): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-157
- **SH-147** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-147
- **SH-148** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-148
- **SH-149** (kit, Logic): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-149
- **SH-150** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-150
- **SH-108** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-108
- **SH-236** (kit, Teaching): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-236
- **SH-119** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-119
- **SH-245** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-245
- **SH-293** (kit, HisCall): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-293
- **SH-306** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-306
- **SH-307** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-307
- **SH-309** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-309
- **CHAI-102** (chai, Teaching): only Zafar can judge it: the dotted-word lesson lights a dotted word on screen at every level, after the order has landed
- **CHAI-54** (chai, Logic): the probe reads js:Cook.chaiPans, which the page no longer sets (a hook gone with the chai rewrite): the spec needs a new read; sheets of the pans are in the run for the eye
- **CHAI-57** (chai, Logic): the sheet did not show the row's state (a probe fault, judged NOT SHOWN); the spec needs a better moment or capture
- **DAAR-37** (daar, Logic): the row asks ten seeds per level of chop kinds and totals; my probe read js:Cook.chopPlan, which does not exist (judge audit FAIL); needs a hook or a node test over the level table
- **DAAR-38** (daar, Logic): tool failure: DAAR-38-p1-L1-740x320: strip:#stage:4x250 at life:chop-done (hit 1): the filmstrip of "#stage" did not change over 4 frames (250 ms apart)
- **DAAR-54** (daar, Look): the sheet did not show the row's state (a probe fault, judged NOT SHOWN); the spec needs a better moment or capture
- **DAAR-66** (daar, Look): the sheet did not show the row's state (a probe fault, judged NOT SHOWN); the spec needs a better moment or capture
- **MAA-22** (maani-line, Logic): the strip of #game at exp:tawa-on did not change over 16 frames at L3 and L4 (a filmstrip of a still screen: the moment comes before the motion, or the motion is on the canvas the strip misses); the spec needs a later moment
- **CK-59** (kit, Logic): the sheet did not show the row's state (a probe fault, judged NOT SHOWN); the spec needs a better moment or capture
- **CK-06** (chai, Look): the probe reads js:Cook.chaiPans, which the page no longer sets (a hook gone with the chai rewrite): the spec needs a new read; sheets of the pans are in the run for the eye
- **CK-116** (baking, Kutchi): the sheet did not show the row's state (a probe fault, judged NOT SHOWN); the spec needs a better moment or capture
- **CK-117** (corn, Look): the sheet did not show the row's state (a probe fault, judged NOT SHOWN); the spec needs a better moment or capture
- **CK-119** (corn, Look): tool failure: CK-119-p1-L1-1280x665: crop:.njg-rq-card at only:.njg-rq-card (hit 1): ".njg-rq-card" is not on screen at only:.njg-rq-card · CK-119-p1-L1-740x320: crop:.njg-rq-card at only:.njg-rq-card (hit 1): ".njg-rq-card" is not on screen at only:.njg-rq-ca
- **CK-125** (eggs, Logic): the sheet did not show the row's state (a probe fault, judged NOT SHOWN); the spec needs a better moment or capture
- **CK-135** (baking, Look): the sheet did not show the row's state (a probe fault, judged NOT SHOWN); the spec needs a better moment or capture
- **SH-311** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-311
- **SH-312** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-312
- **SH-313** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-313
- **SH-317** (kit, Check): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-317
- **CLN-206** (clinic, Logic): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows CLN-206
- **ART-28** (chai, Check): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows ART-28
- **CHAI-31** (chai, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows CHAI-31
- **CHAI-61** (chai, Logic): the sheet did not show the row's state (a probe fault, judged NOT SHOWN); the spec needs a better moment or capture
- **CHAI-62** (chai, Logic): the strip of #side at phase:slow did not change over 8 frames at L2 and L3: the moment does not reach the motion the row is about; the spec needs a new moment
- **CHAI-64** (chai, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows CHAI-64
- **CHAI-66** (chai, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows CHAI-66
- **CHAI-109** (chai, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows CHAI-109
- **CHAI-112** (chai, Teaching): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows CHAI-112
- **SH-19** (day, Teaching): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-19
- **SH-185** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-185
- **SH-186** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-186
- **SH-188** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-188
- **SH-191** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-191
- **SH-193** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-193
- **SH-194** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-194
- **SH-252** (kit, Kutchi): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-252
- **SH-256** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-256
- **SH-264** (kit, Look): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-264
- **SH-265** (kit, Logic): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-265
- **SH-266** (kit, Logic): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-266
- **SH-267** (kit, Teaching): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows SH-267
- **CK-86** (corn, Look): the sheet did not show the row's state (a probe fault, judged NOT SHOWN); the spec needs a better moment or capture
- **CK-79** (daar, Look): chop L1 at 740x320 never reaches view-marble (chop has no marble view), 6 of 8 probes reached; the row is to fix: code, partly built (daar contract-115 and the chop phase left)
- **CK-91** (kit, Look): red shown for the row reason; the green cannot be seen until the flash stays (SH-267, fix-kit); re-run evidence.mjs --run --rows CK-91 after that fix
- **ART-78** (kit, Art): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows ART-78
- **ART-79** (kit, Check): not played in this run (the browser time ran out before its page); the spec is ready: evidence.mjs --run --rows ART-79

## Questions for Zafar

None of design. Three rows are his ear or eye alone: CHAI-87 (the pour sound), CHAI-92 (the juice lab), SH-223 (the font sample). Several rows say "to fix: code, waits for the frame" or "partly built" (SH-224, SH-226, SH-151, SH-122). They are open, not built: the orchestrator may want them relabelled.

## How to re-run

`node build/tools/review/evidence.mjs --run --rows <ids>` (specs in build/sandbox/data/evidence.json). Red replays: a slim worktree of the fix's parent with today's build/sandbox, build/tools and build/lint copied in.

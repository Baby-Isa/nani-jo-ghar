# Sound and juice: the map for chai and the shared kit (6 Nov 2026, overnight)

**Zafar, 6 Nov:** "a decent version for chai ... helps us flesh out when and where and how all the sounds and juice comes from."
**This report:** the principles (with their sources), a map of every moment in chai and the shared kit where a sound or a
movement could go (what is there now, what to add, what to leave silent), the chai version as an implementation plan, and the
juice art run's pack (`build/tools/art/specs/s17-juice.run.yaml`, `docs/design-language/art-plans/s17-juice-art-plan.md`, the
block `docs/design-language/art-plans/s17-juice-chrome-block.txt`). **Nothing in the game was changed.** Decisions for him are at
the end, numbered.

## In short

1. Chai already has most of its juice: the real things move (a bottle tips, a pan settles, the glass fills), each step ticks on
   the card, the tally bumps, Nani smiles when something goes in. What it lacks is **sound at the right moment** and **one
   consistent voice** for that sound. Today the tap's own sound comes 1.7 s late (after the bottle has flown back), the knob's click
   is too quiet to hear, the shelf's "pop" is the same note every time, and three sounds sit below what a phone speaker can play.
2. **The rule set is small:** every tap answers within 100 ms; a right move sounds warm and short; a mistake gets the same soft
   sound as "not now", never a buzzer; nothing plays under a family voice; everything sits between 250 Hz and 4 kHz; every repeated
   sound varies a little; sound and motion can be turned off by a grown-up; the system's "reduce motion" is honoured everywhere.
3. **What to add in chai:** eleven sounds (seven new recipes in `js/shared/sfx.js`, four retuned), two timing moves, one voice
   gate, pitch jitter, and four painted effects from one small art run (sparkle, steam, tea drops, a gold burst). Everything else
   on the map stays silent on purpose, each with its reason.
4. **What this never re-proposes:** the ripple (SH-141, "we tried that and failed it"), the painted blue splash (ART-31, decision 2a),
   the read-along at the pour (CHAI-51), sweets as rewards, red crosses, or any sound that says "wrong".

## 1. Principles, with reasons and sources

Sources marked *(web, 6 Nov)* were checked tonight by search; those marked *(from knowledge)* are cited from memory and should be
read before anyone quotes them outside this repo. None of them contradicts a decision of Zafar's; where practice and his word
differ, his word wins and the row says so.

| # | Principle | Why | Source | What it means for chai |
|---|---|---|---|---|
| P1 | **Every action answers at once, within 100 ms.** | Past about 100 ms the brain stops reading the response as "mine"; consistent timing matters more than speed. "Without immediate feedback there is no virtual sensation." | Swink, *Game Feel* (2008), ch. 2-3: response within ~100 ms; the Rutgers game-feel lecture on Swink *(web, 6 Nov)* | The tap's acknowledgement (sound and a 1-frame squash) fires on the tap itself, never at the end of the bottle's flight (today `soft("tap")` is at `js/cook/stations/chai-tray.js:1300`, after the return flight). |
| P2 | **Layer small things, not big ones.** | Jonasson and Purho's demo adds ~20 tiny tweaks (tweened scale, a sound per event, particles, a little screen movement) and the same game feels alive; no one of them is large. Nijman's talk builds the same way, one feedback layer at a time. | "Juice it or lose it" (Jonasson, Purho, 2012); "The Art of Screenshake" (Nijman, Vlambeer, INDIGO 2013) *(web, 6 Nov)* | Chai's juice is the sum of the squash on landing, the tick's pop, the tally's bump, a short sound each, never a fanfare per step. **No screenshake** in a children's game: it reads as alarm (P6). |
| P3 | **Feedback for every action, never a verdict.** | For 3-7s the feedback says "it happened", not "you were right". Right and wrong get the same acknowledgement; only the end review shows what to work on. | Zafar's non-negotiable 7 and UX 11 ("show progress, not verdicts; no red crosses or buzzes mid-round"); audio.md E10 "no buzzes"; Toca Boca and Sago Mini's "toys, not games: no winning, no losing" *(web, 6 Nov)*; NN/g kids' research: under-6s miss subtle audio-visual verdicts anyway *(web, 6 Nov)* | A spoonful that goes in sounds the same whether it was asked for or not. A tap that cannot land (a second water, "not now" on the knob) gets the one soft low note (`cook-soft`) and a wiggle, never `wrong`. |
| P4 | **The family's voice is the game; nothing masks it.** | Every Kutchi line is a real recording (non-negotiable 2). An effect under it hides a syllable; two voices at once is already a contract failure (PAN-04, contract-7). | audio.md G14, E5; the chai standard §4.1 "one voice at a time" | A **voice gate**: while a family clip sounds (`Cook.voiceBusy()`, `js/cook/core.js:304`) any effect longer than 120 ms waits or is dropped; ticks under 120 ms play at -9 dB. The order's cards landing in their rows stay silent (the person is speaking). |
| P5 | **Loudness and pitch for 3-7-year-olds.** | Young ears are more sensitive to bright, sharp sounds; WHO-ITU's children's dose is 75 dB over 40 h/week; parents set phones loud for speech, so effects must sit under the voice. | WHO-ITU H.870 safe listening (children's mode 75 dB) *(web, 6 Nov)*; Apple HIG "Playing audio": effects must not drown speech *(from knowledge)* | Effects peak at least 6 dB under the family voice (`Sfx.volume` 0.5 today, voice at 1.0); no square waves above 0.1 gain; nothing above 4 kHz except a short noise tick. |
| P6 | **Phone speakers: mid frequencies, no sub-bass, no long tails.** | Small speakers roll off below roughly 250-600 Hz; a 196 Hz sine (today's `wrong`) is nearly inaudible on a phone and distorts when pushed. | Measured phone responses: 230 Hz-10 kHz at best, uniform only from ~700 Hz *(web, 6 Nov)*; Material sound guidance: short, percussive, mid-frequency, made for cheap speakers *(secondary, web, 6 Nov)* | Every fundamental at or above 250 Hz; the body of each sound in 400 Hz-3 kHz; a touch of harmonic above (triangle, not sine) so it carries. Retune `wrong` (196 Hz), `chop`'s 160 Hz thump and `boing`'s 180 Hz start. |
| P7 | **Reduced motion is a setting, not a hope.** | Motion a child did not ask for can distract or, for some, cause discomfort; WCAG 2.3.3 asks that interaction-triggered animation can be turned off. | WCAG 2.1 SC 2.3.3 (AAA) and the `prefers-reduced-motion` technique *(web, 6 Nov)*; art bible §5 "switched off by the reduce motion setting" | The kit already honours it in the results, onboarding, word moment, request pop-up, word card, focus.css. The gaps: Phaser's tweens in chai (the squash, the fly, the wiggle), the tally bump (done), the order card's tick pop (not yet). One grown-up switch, "less motion", as well as the system's. |
| P8 | **Sound off is a grown-up's choice, and the game must still be playable.** | Phones are muted in waiting rooms; a parent may want Nani's voice but not the effects (or neither). | Apple HIG: feedback must remain optional and work with sound muted *(web, 6 Nov)*; WCAG 1.4.2 audio control *(from knowledge)* | `Sfx.muted` exists but nothing sets it. A second switch beside Nani's mute in the "?" pop-up: "Sounds" (effects) separate from "Nani's voice"; both remembered in the save. Every sound has a visible twin (the squash, the tick), so muted play loses nothing the child needs. |
| P9 | **Repetition fatigue: vary what repeats.** | A sound heard 40 times a round grates unless it moves a little; the standard trick is a random pitch of about ±5-10 % per play, and two or three alternates for the most frequent one. | Jonasson and Purho; game-audio practice (random pitch 0.9-1.1) *(web, 6 Nov)* | A global `Sfx.jitter` (default ±4 %) on every one-shot except chords (`gold`, `fanfare`, `coin`: a detuned chord sounds wrong); the shelf's `pop` gets three alternates by item kind (a liquid, a jar, a spoonful). |
| P10 | **Match the sound to the picture's weight.** | A sound that is heavier or lighter than the motion it marks reads as false; HIG: match a haptic's intensity and sharpness to the animation. | Apple HIG "Playing haptics" *(web, 6 Nov)*; Swink on polish (sound and motion as one effect) | A 320 ms squash gets a 60-120 ms sound; the pan's settle a soft low thud (330 Hz); the glass filling the rising pour loop (already in); the end screen's gold badge the one long chime of the round. |
| P11 | **Haptics: not in chai, not yet.** | iOS Safari has no `navigator.vibrate`; Android's is coarse; HIG warns that frequent haptics tire. Conversations already vibrate on a wrong pill (UX 14, his rule); chai has no social "no". | Apple HIG "Playing haptics": occasional, short, with the animation *(web, 6 Nov)* | None in chai until the app-store wrapper, where a 10 ms tick on a landing can be tested on a real phone. Decision 8. |
| P12 | **Silence is a tool.** | Juice with no gaps is noise; the quiet pour was his own call (CHAI-51). The moments that carry meaning (the order being said, the word moment's card) need the room. | Jonasson and Purho's own warning ("too much juice"); Zafar, 30 Oct (the quiet pour) | The map marks 14 moments "silent, on purpose". |

## 2. The map

Every moment in chai and the shared kit. **Now** is what the code does today (read, not guessed); **sound** and **juice** are what
to add; **silent** says what stays quiet and why. Priority: P1 = in the chai version; P2 = the next sprint; P3 = nice, later.
Recipe names in `sfx` are section 3's table.

### 2a. The shelf, the pan and the spoon

| Moment | Now (file:line) | Sound to add | Juice to add | Silent, and why | Pri |
|---|---|---|---|---|---|
| **Tap an item on the shelf** (a bottle, a jar) | `cook-pop` at once (`chai-tray.js:1350`: 520→820 Hz sine, 80 ms); the bottle lifts and flies (`:1265`); `soft("tap")` only at the end of the return flight (`:1300`), 1.7 s late | `pop` keeps its place as the tap's answer (≤100 ms); give it **three alternates by kind** (liquid, jar, spoon) and jitter; **drop the late `tap`** | the picked item gets a 1-frame squash (0.96) on the tap itself before it lifts (`land()` with `ms: 120`) | | P1 |
| **The pour lands** (the pan's picture changes over 620 ms, `:1281-1290`; the pan settles, `:1293`) | the settle has no sound ("the sound stays" in the comment at `:1292` refers to the pour loop, which the shelf pour does not run) | **`pour-in`**: a short soft pour (noise 900 Hz band, 380 ms, falling gain) for water and milk, started as the bottle tips (`:1270`), not after | none: the pan's settle (k 0.03) is right | no splash picture: ART-31, decision 2a | P1 |
| **The item back on the shelf** (`:1299`, `land(obj, {k: 0.06})`) | the squash; then `soft("tap")` | **`settle-soft`** (a 330 Hz triangle, 60 ms, -12 dB): a bottle set down | | | P2 |
| **A spoonful** (`Cook.Spoon.spoon`, `:1309`) | silent in flight; `cook-pop` was at the tap | **`spoon-tip`** as the spoon tips over the pan (noise 1.6 kHz, 90 ms, very quiet: sugar grains) | the sugar grains' scatter sprite (pack s17-juice SG, optional, P3) | | P2 |
| **The word pops by the pan** (`pop()`, `:1131`, the family clip plays) | the bubble rises 180 ms and fades at 1.9 s | **nothing**: the clip is the sound | | the family voice (P4) | — |
| **A second water, milk or tea** (`:1328-1331`, wiggle, no word) | the wiggle only (`stations.js:667`: ±8°, 70 ms ×3) | **`cook-soft`** (the one soft note), jittered | the wiggle stays | never `wrong` (P3) | P1 |
| **A spoonful past the count** (`:1335-1346`, wiggle, capped) | the wiggle | `cook-soft` | | | P1 |
| **Take a spoonful back** (`takeBack`, `:1640-1677`) | `cook-pop` (`:1670`), the spoon comes out, the row reopens | **`pop-back`**: the pop played falling (820→520 Hz), so undo sounds like the reverse of the add | the tally chip bumps as it counts down (it already does: `tally.js:49`) | | P1 |
| **The tally chip** (`UI.count`, `tally.js:31-52`) | the chip bumps (CSS `njgTallyBump` 1.2×, 300 ms, reduced-motion aware) | **nothing of its own**: the add's pop is 60 ms earlier; a second sound here would double it | | doubled sound reads as two events (P10) | — |
| **A tap on a pan or its face** (`panTap`, `:1679-1685`; `hear`, `:1919`) | the face replays the person's order (a family clip); selecting a pan is silent | **`select`** a 50 ms triangle at 880 Hz, -9 dB, only when the pan changes and no clip plays | the chosen pan's ring already lights (CHAI-25) | the face's replay: voice only | P2 |

### 2b. The heat

| Moment | Now | Sound to add | Juice to add | Silent, and why | Pri |
|---|---|---|---|---|---|
| **Turn the knob on** (`knobTap`, `:1414-1427`; the kit's `set()`, `kitchen-kit.js:278-286`) | the knob turns 260 ms with `click` (1200 Hz square, 30 ms, gain 0.05: the sound SH-196 found too quiet) | **`knob`**: a gas knob's clack (noise 2.2 kHz 25 ms + 1480 Hz triangle 40 ms, gain 0.2), then **`flame`** a 200 ms soft whoomph (noise 700 Hz, rising then falling) as the flame appears | the flame's alpha already fades in over 360 ms | | P1 |
| **The knob with no water** (`:1416-1422`: the knob wiggles, the bottle glows and bounces) | silent | `cook-soft` | | | P1 |
| **The heat ring fills** (`drawRing`, the loop at `:1540-1560`) | silent; bubbles roll in the picture | **`simmer`** a very quiet boil loop (`boil` exists: 400 Hz band, 0.05 gain) from heat 0.5, rising with heat, stopped at the turn-down | the s17-juice steam wisps (ST) drift from the pan from heat 0.7, 2-3 at a time, never over a tap target (art bible §5) | | P2 |
| **The bar enters the green** (`:1554`, `click`) | the same quiet `click` | **`green`**: a clear two-note ding (1047 + 1319 Hz triangle, 110 ms) so the moment to tap is heard as well as seen (CHAI-24 wants it on that frame) | | | P1 |
| **Tap before the green** (`:1429-1441`: the knob wiggles, Nani says *hever na*) | the wiggle; Mum's clip | `cook-soft` 150 ms **before** her line (the gate holds it clear of the clip) | | never a buzzer (P3) | P1 |
| **Turn down in the green** (`turnDown`, `:1491`) | the knob's `click` | **`knob`** (the same clack, falling pitch variant) and the flame loop fades 300 ms | | | P1 |
| **Boil over** (`boilOver`, `:1472-1489`: foam, two steam puffs, `puff`) | `puff` (300→500 Hz sine 350 ms + noise) | **`over`**: a soft fizz (noise 1.2 kHz, 600 ms, gain fading) in place of `puff`'s rising sine, which reads as "a cartoon pop"; no low note, no verdict | the ST steam wisps replace the s11 steam (`fx("steam")`, `:1476-1477`, ART-31 decision 2a) | Nani says nothing (non-negotiable 7: "no verdict and no mark", `:1470`) | P1 |

### 2c. The pour and the tray

| Moment | Now | Sound to add | Juice to add | Silent, and why | Pri |
|---|---|---|---|---|---|
| **Tap a ready pan** (`:1686-1714`) | the pan lifts (the s14 frames, `:1720-1830`); the pour loop runs while it pours, rising with the fill (`:1832-1838`, `pourLoop`, 900 Hz band, wobble 7) | keep; **add a `lift`** (a soft 120 ms whoosh, `cook-whoosh` at -6 dB) as the pan leaves the burner, and the loop's last 150 ms fades (it does) | the last drop (CHAI-80) is drawn in code; the glass's small dip as it fills (`land(top)`, exists in `land()` but not called here): call it at the pour's end, k 0.03 | the read-along: CHAI-51, "the pour is quiet" | P1 |
| **The glass is full** (`pan.poured = to`, `:1850`) | the fill's last frame; the half/full rows tick (SH-206) | **`glass`**: a glass's single clear ring (1568 Hz triangle 180 ms + 2093 Hz at -12 dB) as the pan settles back | the SK sparkle, once, small, over the glass (the s11 sparkle restyled, decision 2a) | | P1 |
| **A pour past full** (`:1688-1693`, wiggle) | the wiggle | `cook-soft` | | | P1 |
| **Every glass poured** (`refresh()`, `:2753-2755`: the hob steps back to 0.88) | silent | **nothing here**: the serve beat follows at once (2e) | | the serve has its own sounds; two in a row is noise | — |
| **The pan back on its burner, empty** (`:1867`: the fire goes off) | the knob's `click` | `knob` (off variant); the flame loop stops | | | P1 |

### 2d. The order card, the tally and the words

| Moment | Now | Sound to add | Juice to add | Silent, and why | Pri |
|---|---|---|---|---|---|
| **The order is said; a card pops out and flies into its row** (`js/cook/ui.js:1886`, SH-150; the glide, `order-card.js:377-425`) | the person's clip; the card flies whole; no sound | **nothing** | the row's glide is smooth already (contract-72) | the family voice is speaking (P4): a landing sound under each word would mask it | — |
| **A row ticks** (`tickItem`, `ui.js:3514-3530`; the tick pops in, `order-card.css:177`, `ocTick` 300 ms) | the tick's pop; Nani smiles 1.6 s (`ui.js:3524`) | **`tick`**: a short bright tick (1760 Hz triangle 45 ms + a 3 kHz noise 15 ms, gain 0.14), played only if no clip sounds, else dropped (it is the card's own event; the add's pop already answered the tap) | the tick's pop; add `prefers-reduced-motion` to `ocTick` (it has none) | | P1 |
| **A person's card folds** (`order-card.js:17`, FOLD_AFTER 700) | the fold | **`fold`**: a paper fold (noise 1.1 kHz 80 ms falling, gain 0.1) | | | P2 |
| **A row reopens** (a boil-over, a take-back; `reopen`) | the row opens, the tick goes | **nothing**: the take-back's `pop-back` or the boil-over's fizz is the sound | | one event, one sound | — |
| **The reveal tap** (the dots → the word; `word-card.js`, the lesson at `chai-tray.js:2885`: `reveal`) | `reveal` in the lesson only (2.6 kHz noise 30 ms + 1480 Hz 50 ms); the child's own tap is silent | play **`reveal`** on the child's own reveal tap too, at -6 dB, jittered | | | P1 |
| **The word's speaker on a chip or card** | the family clip | nothing | the chip's existing press | the voice (P4) | — |
| **The tally chip counts** | the bump | (2a: nothing) | | | — |

### 2e. The word moment, the help, the transitions and the end

| Moment | Now | Sound to add | Juice to add | Silent, and why | Pri |
|---|---|---|---|---|---|
| **The word moment: the kettle pours** (`word-moment.js:325-382`, `pour-glass` loop with the glass's rising ring, CHAI-87) | the loop; the last drop animates | keep; **`drop`** a single soft plink (1319 Hz sine 70 ms, -9 dB) as the last drop lands | | | P2 |
| **The snap** (`word-moment.js:434-438`, `shutter`) | the shutter (CHAI-72) | keep | the corners' flash (built) | no iris (his 3 Nov call) | — |
| **The helper card opens** (`UI.helperOpen`, `chai-tray.js:2199-2219`) | silent; the arrow's light the first time | **nothing**: it opens as a hint, and a sound would call attention to help | | a hint should not announce itself | — |
| **The stuck hint's light** (`light14`, the help ladder `data/shared.json` helpMs) and **Nani's call** | the glow and the hop (`focus.css`), her clip | nothing | | the voice; the glow is a hint, not an event (E16) | — |
| **The bulbs pulse** (`guide.js:140`, 17 s) | the pulse | nothing | | a pulse is a nudge | — |
| **The bulb is tapped** (`ui.js:3415`, `click`) | `click` (too quiet) | **`bulb`**: a soft switch (noise 1.8 kHz 20 ms + 988 Hz triangle 60 ms) | the English fades in (exists) | | P2 |
| **The "?" and the cog** (`ui.js:4335-4344`, `click`) | `click` | `bulb` (the same switch) | | | P3 |
| **Done / Next buttons** (`buttons.js:78-91`, `Sfx.tap`, which is not a function: `Sfx.tap` is undefined, so **no button sound plays**) | silent (a bug: `root.Sfx.tap` should be `root.Sfx.play("tap")`) | fix it: `tap` at -6 dB | the pressed state (exists) | | P1 |
| **Station start** (the greeting, the first light) | the clips; the s14 light | nothing | | the voice | — |
| **The serve** (`flow.js:1090-1121`: `pop`, `whoosh`, the stamp's `chop` + `soft`; the coin at `:1172`) | as listed; "Ahhh, chai" and *barabar* are family lines | **retime**: `pop` on the card's rise is fine; the stamp's `chop` (a 160 Hz square thump) is inaudible on phones: use **`stamp`** (noise 500 Hz 50 ms + 294 Hz triangle 90 ms); the coin's `coin` (1320/1760 Hz squares) retuned to triangles | the BU gold burst (pack s17-juice) behind the stamp, once | the "+N" float stays | P1 |
| **Level-up** (`Cook.roundDone`, `flow.js:404-414`: a save and a log line, nothing shown) | nothing shown or heard | **nothing yet**: there is no level-up screen; when one comes, the end screen's `gold` chime is its sound | | a level-up the child cannot see has no sound | — |
| **The end screen: the badges** (`results.js:317-370`: the time counts up; `bing` on a new best; `right` per step of the accuracy count; `wrong` once if any wrong; `gold` if all right; the hints and looks badges silent) | as listed | keep `bing` and `gold` (the round's one long chime); **replace `wrong`** (196 Hz falling sine: a verdict) with `cook-soft`, or with silence (decision 5); **`right` per step** retuned to a 60 ms tick (it is 160 ms × up to 12 steps: a stutter) | the badges' rise and the gold's buzz/twinkle (CSS, reduced-motion aware) | the hints badge: a bulb is a count, not a win | P1 |
| **The end screen: the word review** (page 2) | silent | nothing | | reading time | — |
| **Again / Home** (`buttons.js`) | (the `Sfx.tap` bug) | `tap` | | | P1 |
| **The chai demo and the finale** (`flow.js:1312`, `:1628`, `fanfare`) | `fanfare` (four triangles, 300 ms each) | keep; jitter off (a chord) | | | — |

### 2f. Settings and the sandbox

| Moment | Now | Add | Pri |
|---|---|---|---|
| Sound off | `Sfx.muted` exists (`sfx.js:29`), nothing sets it; Nani's mute is `NaniGuide.muted()` (`guide.js:56-62`, save flag `naniMuted`) | a second switch, "Sounds", in the "?" pop-up beside Nani's mute, save flag `sfxMuted`, read by `Sfx.muted` at load | P1 |
| Motion off | the system's `prefers-reduced-motion` honoured in `results.js:169`, `onboard.js:380`, `word-moment.js:37`, `request-popup.js:129`, `word-card.js:360`, `focus.css`, `tally.css`; not in chai's Phaser tweens (`land`, `fly`, `wiggle`) nor `ocTick` | one helper, `Motion.less()` (`js/shared/tokens.js`), true for the system setting **or** a grown-up switch "Less motion" (flag `lessMotion`); chai's `land`/`wiggle` go instant when it is true; `html[data-motion="less"]` makes the CSS media rules apply too | P1 |
| The test hook | synthesised sounds go out as `njg-sfx` events for the sandbox's sound log (`sfx.js:193-217`), only for `coin` and `lap` (`EVENT`) | every sound tells (name, start, end) so the voice gate can be checked (section 3e) | P1 |

## 3. The chai version: implementation plan

### 3a. Sounds in `js/shared/sfx.js` (synthesised, no files)

All one-shots under 200 ms except `gold`, `bing`, `fanfare` and `over`; fundamentals ≥ 250 Hz; peak gain ≤ 0.25 through
`Sfx.volume` 0.5. "jitter" = ±4 % random pitch per play (`Sfx.jitter`, off for chords).

| Name | New / retune | Recipe (the `tone`/`noise` helpers in the file) | Where it is called |
|---|---|---|---|
| `pop` (3 variants: `pop-liquid`, `pop-jar`, `pop-spoon`) | retune | liquid: 520→820 Hz sine 80 ms gain 0.2; jar: 620→900 Hz triangle 70 ms gain 0.16; spoon: 740→980 Hz sine 60 ms gain 0.14; jitter | `use()` by item kind (`chai-tray.js:1350`) |
| `pop-back` | new | 820→520 Hz sine 90 ms gain 0.18, jitter | `takeBack` (`:1670`) |
| `pour-in` | new | noise bandpass 900 Hz Q 0.7, 380 ms, gain 0.14→0.02; milk: 700 Hz | `pourInto` as the bottle tips (`:1270`) |
| `settle-soft` | new | 330 Hz triangle 60 ms gain 0.08 | `pourInto` end (`:1299`), replacing the late `tap` |
| `spoon-tip` | new | noise bandpass 1600 Hz Q 1.2, 90 ms, gain 0.07 | `Cook.Spoon.spoon` at the tip (`js/cook/hands.js`) |
| `select` | new | 880 Hz triangle 50 ms gain 0.1 | `select(pan)` when the pan changes |
| `knob` (on / off variants) | new | noise 2200 Hz Q 1, 25 ms, gain 0.2 + 1480 Hz triangle 40 ms gain 0.12 (off: 1180 Hz) | `kitchen-kit.js:285` in place of `click` |
| `flame` | new | noise bandpass 700 Hz Q 0.5, 220 ms, gain 0→0.1→0 | after `knob` on |
| `simmer` (loop) | retune of `boil` | 420 Hz band Q 2, gain 0.04, wobble 5; `pitch(heat)` 0.7→1.6 | the heat loop from heat 0.5 |
| `green` | new | 1047 Hz + 1319 Hz triangles, 110 ms, gain 0.16, no jitter | `:1554` in place of `click` |
| `over` | new | noise bandpass 1200 Hz Q 0.6, 600 ms, gain 0.14→0.01 | `boilOver` in place of `puff` |
| `lift` | reuse | `cook-whoosh` at volume 0.5 | the pan's lift (`:1832`) |
| `glass` | new | 1568 Hz triangle 180 ms gain 0.14 + 2093 Hz 120 ms gain 0.04 | the glass full (`:1850`) |
| `tick` | new | 1760 Hz triangle 45 ms gain 0.12 + noise 3000 Hz 15 ms gain 0.1 | `tickItem` (`ui.js:3514`) through the gate |
| `fold` | new | noise bandpass 1100 Hz 80 ms, gain 0.1 falling | `order-card.js` fold |
| `reveal` | reuse | as is, volume 0.5 on the child's own tap | `word-card.js` reveal |
| `bulb` | new | noise 1800 Hz 20 ms gain 0.12 + 988 Hz triangle 60 ms gain 0.1 | `bulbOn`, `#btn-help`, `#side-cog` |
| `tap` | fix | `buttons.js:80`: `root.Sfx.play("tap", {volume: 0.5})` | every shared button |
| `stamp` | new | noise 500 Hz Q 1, 50 ms, gain 0.2 + 294 Hz triangle 90 ms gain 0.1 | `flow.js:1119` in place of `chop` + `soft` |
| `coin` | retune | 1320 / 1760 Hz **triangles** (the squares are harsh), gains as now | as now |
| `wrong` | retune | 294→262 Hz triangle 180 ms gain 0.12 (or retired: decision 5) | `results.js:360` |
| `right` (the count's step) | retune | 880→990 Hz triangle **60 ms** (was 160) | `results.js:354` |
| `cook-soft` | keep | 330 Hz sine 160 ms, slide -60; jitter | every "can't land" moment |
| `drop` | new | 1319 Hz sine 70 ms gain 0.08 | the word moment's last drop |

### 3b. The voice gate

`Sfx.play(name, opts)` gains one check: `Sfx.voiceBusy` is a function the host sets (`Cook`: `() => Cook.voiceBusy()`,
`js/cook/core.js:304`; the clinic and the shared story: their players). While it returns true, a sound whose recipe is longer than
120 ms is **dropped** (not queued: a late sound is a wrong sound, P1) unless `opts.under: true` (the pour loops, which the design
puts under nothing); a sound ≤ 120 ms plays at -9 dB (`volume × 0.35`). The gate never touches the family clips themselves.

### 3c. Timing moves in chai (`js/cook/stations/chai-tray.js`)

1. The tap's squash: `land(obj, {k: 0.04, ms: 120})` at the top of `use()` (after the guards), before the flight.
2. `pour-in` starts as the bottle reaches its tilt (`:1270`, after the 220 ms turn), not at the pan's picture change.
3. The late `soft("tap")` (`:1300`) becomes `settle-soft` as the bottle lands, and its call moves to the same line as `land(obj)`.
4. The glass's dip: `land(glassLayers, {k: 0.03, top: true})` at the pour's end (`:1850`).
5. Motion off: `land`, `wiggle` and `fly` read `Motion.less()` and go to their end state at once (one guard each, no second code path).

### 3d. Juice in the kit (named functions)

| Function | File | What it does | Who calls it |
|---|---|---|---|
| `Juice.squash(obj, {k, ms, top})` | `js/shared/juice.js` (new; the body is chai's `land()`, `chai-tray.js:1162-1186`, moved) | the squash-and-settle on a Phaser or DOM thing; instant under `Motion.less()` | chai (today's `land`), every stove game at the roll-out |
| `Juice.sprite(S, kind, x, y, {w, ms, rise})` | `js/shared/juice.js` (the body is chai's `fx()`, `:1188-1196`) | one painted effect from pack s17-juice: scale in, fade, drift; never blocks a tap | chai's glass sparkle, the boil-over's steam, the serve's burst |
| `Juice.steam(S, x, y, {n, w})` | `js/shared/juice.js` | 2-3 ST wisps on a slow loop, stopped by the caller; off under `Motion.less()` | the heat loop from heat 0.7 |
| `Juice.tickPop(el)` | CSS already (`order-card.css:177`); add the reduced-motion rule | the tick's pop | `order-card.js` |
| `Juice.bump(el)` | exists as the tally's `bump` (`tally.js:49-51`) | the count's bump | the tally |
| `Motion.less()` | `js/shared/tokens.js` | the system setting or the grown-up's flag | every animation above; `focus.css` through `html[data-motion]` |
| `Cook.Stations.sparkle / steam` | `js/cook/stations.js:667-680` (the empty stubs from Sprint 10) | filled by `Juice.sprite`, so every existing caller works | the stations |

### 3e. Settings and checks

| Item | Where | What |
|---|---|---|
| "Sounds" switch | the "?" pop-up (`js/cook/ui.js`, `UI.openHelp`), the clinic's menu | a row beside Nani's mute: the grown-ups' English, save flag `sfxMuted` → `Sfx.muted` |
| "Less motion" switch | the same pop-up | save flag `lessMotion` → `Motion.less()` and `html[data-motion="less"]` |
| **Check: no effect under a voice** (contract) | `build/sandbox/lib/contract.mjs`, a new row after contract-14 | from the sound log (every `njg-sfx` event now tells, with its recipe's length): any effect > 120 ms starting while a family clip sounds is a failure; one ≤ 120 ms must be marked `under` (the gate's -9 dB) |
| **Check: the recipes' floor** (unit) | `build/test_shared_sfx.mjs` (new) | every recipe's lowest fundamental ≥ 250 Hz; every one-shot ≤ 200 ms except the listed long ones; every name `Cook.sfx` calls exists in `SOUNDS`; `buttons.js` calls a function that exists |
| **Check: the tap's answer** (contract) | the same contract file | the first `njg-sfx` after a shelf tap within 100 ms of the tap (the sandbox's timeline has both) |
| **Check: motion off** (static + contract) | `build/lint/static.mjs motion` (exists) + a sandbox run with `?motion=less` | no transform-tween longer than 1 ms runs; the round still completes |
| The sound rules themselves | `docs/design-language/audio.md` (a new section "Effects", under its 1000-word limit) | P1-P12 in one list, the recipe table's rules (floor, length, gate, jitter) |

### 3f. Steps, size, risk

| Step | What | Size | Risk |
|---|---|---|---|
| 1 | `sfx.js`: the recipes (3a), jitter, the gate, every sound tells; `buttons.js` fix; the unit test | half a day | low: no file plays differently unless a caller changes; the test guards the floor |
| 2 | Chai's timing moves (3c) and the new calls (2a-2c); the serve's `stamp`; the end screen's retunes | half a day | medium: the chai contract run and labcheck at the four sizes must pass again; his ear decides the recipes (a lab page with one button per sound, so he can hear them side by side before they go in) |
| 3 | The two switches, `Motion.less()`, the CSS hook, reduced-motion in `ocTick` and chai's tweens | half a day | low |
| 4 | The contract rows and the sound log's new fields | half a day | low |
| 5 | `js/shared/juice.js` (the move of `land`/`fx`), the stubs filled | half a day | low until the art lands; the sprites are optional (the code paths exist and draw nothing today) |
| 6 | After the art run: cut, wire, the judge | half a day + the run | the run itself (section 4) |

About three days of a mid-tier builder's time plus the run, in one sprint; the judge looks once at the end (the fast lane). Build
order: 1, 3 (so the switches exist before anything is louder), 2, 4, 5, 6.

## 4. The juice art run: pack `s17-juice`

**What the map needs:** four painted effects in the game's own look (ART-31, decision 2a: "the steam and the serve sparkle get
redrawn in the s14 look in your next art run"). Nothing here is a reward and nothing is food: a sparkle, steam, drops of tea, a
burst of gold light. **No coin:** Cook's coins are a drawn "+N" and a sound today; a painted coin invites "money as a prize" and
is not needed by any screen on the map. **No tick:** the tick is the kit's flat gold SVG (`OrderCard.CHECK`), one everywhere.

| Line | What | Sheet | Game pictures | Used at |
|---|---|---|---|---|
| SK | A warm gold sparkle, four steps (a point of light growing to a soft four-point star and fading) and two tiny dots | 3×2 on flat grey | 6 | the full glass; the end screen's gold badge (behind the CSS twinkles) |
| ST | Steam: three soft wisp shapes and the same three thinner | 3×2 | 6 | the boil (from heat 0.7), the boil-over, the poured glass |
| TD | Drops of milky chai: a falling drop, a small crown as it lands, two ring ripples on a tea surface, two droplets | 3×2 | 6 | the pour's landing in the glass; the last drop (optional: decision 4) |
| BU | A gold burst: a soft radiating burst in three sizes, and three single rays | 3×2 | 6 | the serve's stamp; the end screen's gold badge |

Four prompts, about 24 game pictures, about 6-8 images with redos, under an hour in two windows. **Format:** `artblock.py`'s
line-per-sheet format fits (the s17-art3 pack's GS and CR lines are the same kind of sprite sheet: an invisible grid on flat
`#808080`, nothing touching a cell's edge, judged with `soft_edges`). The cut is colour-to-alpha against the measured grey, never a
hard key (art-pipeline §"glass and steam need partial alpha"), by gutters, into `assets/shared/fx-s17/` as WebP with alpha,
@2x kept. **Sizes:** each cell about 1/3 of 1536 px; the game draws a sparkle at 60-90 design px, a wisp at 80-120, so the cuts are
stored at 256 px (×1.5 for phones: 384).

**Flaws first:** (1) ChatGPT draws soft effects on grey with a halo; the colour-to-alpha cut handles a 1-2 px fringe, and the
check asks for "no shadow on the grey". (2) A sparkle can come out as a clip-art star (the art bible's "no glossy clip-art
shine"); the check names "soft, glowing, no hard points". (3) TD's tea colour must match the s14 glass; the glass is attached.

The spec validates (`--check`) against `origin/claude/vibrant-hopper-v3yexp`, where every reference already is (they are on
`main` too). The orchestrator regenerates the block after merging the colour tool's changes to `artblock.py` (the house colours
and the edge-finish line will then appear in it).

## 5. Proof

| Check | Result |
|---|---|
| `python3 build/tools/art/artblock.py --spec build/tools/art/specs/s17-juice.run.yaml --check` | spec ok: 4 lines, 4 checks, 3 references, every prompt is in the plan |
| `python3 build/tools/art/artblock.py --spec build/tools/art/specs/s17-juice.run.yaml` | wrote `docs/design-language/art-plans/s17-juice-chrome-block.txt` |
| `node build/tools/review/checks.mjs` (02:18 UK, after the three files were written) | all ok: unit 88 files, 627 pass, 0 fail; words 0 literals; static 836 findings, 0 new; leak 20 configs; specs 0 new; docs within every limit (the art plan's paths all exist); fixlist labelled; recordings current; size 403 MB; load 29/29 |
| Code read for the map | `js/shared/sfx.js` (all), `js/cook/core.js:385-450`, `js/cook/stations/chai-tray.js` (the shelf, heat, pour, take-back, hint and lesson sections, cited by line), `js/cook/ui.js` (the tick, the choices, the bulb, the buttons), `js/cook/flow.js` (the serve, the demo, the finale, round-end), `js/cook/kitchen-kit.js:195-290`, `js/shared/{tally,order-card,results,word-moment,onboard,guide,buttons}.js`, the kit's CSS keyframes |
| Feedback read | every `docs/feedback/chai-*.md` and `docs/process/regressions.md` for sound, sparkle, ripple, splash, click, quiet |
| Game files changed | none |

What was not proved: no sound was played tonight (no speaker in the sandbox); the recipes are designed from the file's own
helpers and the frequency rules, and step 2 of the plan puts a lab page with one button per sound in front of Zafar before any of
them ships.

## 6. Decisions for Zafar

Answerable "yes to all except ...".

1. **The rule set (section 1, P1-P12) goes into `docs/design-language/audio.md` as the game's sound rules**, with the checks in
   3e. **Recommend yes.**
2. **The chai version (section 3), built in the next sprint as the fast lane with one lab page for the sounds first**, so you hear
   every recipe side by side before any goes into the game. **Recommend yes**, 1-3 then 2 in the build order above.
3. **A sparkle on the full glass and a gold burst behind the serve's stamp** (pack s17-juice SK and BU): progress, not a verdict,
   since every glass gets them whatever went in. **Recommend yes.** If you'd rather nothing painted appears at the glass, say "no
   SK" and the ring sound alone marks it.
4. **Tea drops (TD): a redraw of the splash you dropped.** You removed the blue splash (ART-31, decision 2a) and asked "is there a
   way to make it look nicer, like the style of the game?". TD is that try: drops in the tea's own colour, from the real glass. It
   is in the pack but wired nowhere until you've seen the cut. **Recommend run it, decide on the cut.**
5. **The end screen's "wrong" sound.** Today a round with any mistake plays a falling 196 Hz note once (`results.js:360`). (a)
   Replace it with the neutral soft note; (b) silence: the grey part of the tick says it. **Recommend (b)**: the review shows, the
   sound would judge.
6. **The green zone gets an audible two-note ding** (today a near-silent click). It is a timing aid, not a language aid, so it is
   not a leak. **Recommend yes.**
7. **Two grown-up switches in the "?" pop-up: "Sounds" and "Less motion"**, beside Nani's mute, remembered on the device.
   **Recommend yes.**
8. **No haptics in chai until the app-store wrapper** (iOS web has none; Android's is coarse). **Recommend yes.** Conversations'
   wrong-pill vibration (your UX 14 rule) stays as it is.
9. **Run the s17-juice block** (four prompts, under an hour) as part of the next art run you supervise, after the stove family's
   block. **Recommend yes.**

## Launches and cost

One agent on this task: the top model at high effort, about 35 minutes of reading and writing, roughly 250k tokens in all.

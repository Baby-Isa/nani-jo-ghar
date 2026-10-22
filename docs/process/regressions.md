# Fix list

The genuine things still to fix, plus the keep list (things Zafar liked: must not regress). One row per issue, IDs stable (never reused). Done rows (built, fixed, retired) are in `docs/archive/regressions-done.md`; the tools read both, so their checks keep running, and a done row that fails again moves back here as **reopened** (`evidence.mjs --apply` does it). Old status history is in `build/tools/review/data/status-history.jsonl` and git.
**Status:** **open** · **reopened** · **waiting on** <art, Mum, Zafar> · **built** (moves to the archive) · *keep*. A status is the current state in one line: no history chain.
**Check:** **auto: <script>** or **eye: <size/state>**. Add a row the day feedback arrives, with the next free ID (`feedback.mjs` finds it across both files).

## Shared components

### Order cards

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| SH-70 | Every order card's headline is the short form (*Muke X khape.*), in every station and on the clinic's patient card; the polite long form belongs to Conversations, never the cards | **waiting on Mum** · short-form clips | eye/ear: every station's card and the clinic's patient card, the short-form headline (sprint check sheet) · LNG-03 | `docs/archive/feedback/cook-ui-feedback-2026-09-28.md` §1, §9 |
| SH-12 | Items with no word at higher levels: L3 dots the item words (the level table, Zafar 19 Oct, SH-110, replaces the speaker-only chip); the bulb shows every word | **to fix: check** · reworded to the level table; re-judge | eye: L3–L4 · CMP-08 | `docs/archive/feedback/cook-ui-feedback-2026-09-28.md` §10 |
| SH-13 | Counting along is consistent: L1 written and counted aloud, L2 written, L3+ heard | **to fix: check** · sweep: right; judge to close | eye: L1–L4 · INT-10 | `docs/archive/feedback/cook-playtest-2026-09-29.md` X12, Q7 |
| SH-14 | Item labels do not overlap with more than five items; look-alike bowls are labelled | **waiting on art** · stickers for the seed jars and red tubs | eye: 1366×768 | `docs/archive/cook/cook-with-nani-todo.md` Wave 1 |
| SH-62 | The sequence's stick ends in its tip just below the last row, even when a row wraps (SEK-17) | **to fix: check** · sweep: right; judge to close | eye: scrape, knee cards · CMP-07 | `docs/archive/feedback/clinic-playtest-2026-10-06.md` S3, K5 |

### Layout and stage

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| SH-37 | Cook screens have one focal thing; UI and world look like one product; identical shelf slots; design tokens only | **to fix: check** · with CK-48: judge to close | eye: 1366×768 · CMP-10, CMP-04 | `docs/design-language/ui-design-system.md` §1.1–1.4 |
| SH-90 | "Review playability on phones in a future sprint - the ingredients items need to be bigger and take space from the pantry or the chai station ... probably the rest as well as there's vertical padding": a phone playability review of every game; known so far: items too small, and vertical padding the items should take | **before app store** · phone playability (Zafar, 21 Oct) | eye: every game played through at 844×390, 800×360 and 915×412 (the review) + auto: a phone-size check on every game, built in its sprint (item size, and no unused vertical padding at 844×390) | `docs/feedback/cook-phone-2026-10-15.md` P4 |
| SH-91 | "Several kitchen backgrounds for different sized screens or one very large upscaled image with all the core content in the middle and then stuff above and below to fill wider or taller screens?": every scene's background, every game, is one master that the stage shows more of instead of zooming in (`fitBg`, `js/cook/stations.js:146`); "chatgpt can redraw but you might need to upscale as well after" | **waiting on art** · wider scene masters | eye: every scene background (the counter, pantry, chai and every station, the clinic rooms, the other modes) at 844×390, 915×412, 1366×768 and 1366×1024: nothing in the 1600×900 core zoomed or cut | `docs/feedback/cook-phone-2026-10-15.md` P3 |
| SH-104 | The third end-review page: "it hasn't ticked Channa ... in a little pill ... it says potato ... that's not really clear"; "maybe we don't need this third screen ... hold it to the side for now" | **waiting on Zafar** · held aside to Sprint 10 (Zafar, 21 Oct) | eye: the chaat review | `docs/feedback/cook-playtest-2026-10-17.md` P23 |
| SH-106 | The go-on button, every station: sekelo's "is just bad ... more consistent with the other ones ... there's no arrow"; samosa's karahi reads as "the handles are text and there's a pan sitting over the text" (a taller button is one of two options in SAM-20); 18 Oct, the clinic too: "the move on to the next stage button ... much nicer ... more consistent with how it is done in the cook game" | **waiting on art** · grill, fryer pictures | auto: every game, a contract-run check built with the fix (the arrow is on every go-on button) + eye: sekelo, samosa | `docs/feedback/cook-playtest-2026-10-17.md` P27 · `docs/feedback/clinic-playtest-2026-10-18.md` P9 |
| SH-53 | One shared next-thing highlight in every station and every clinic tool strip: the centred glow and bounce of the item itself (the pantry's), one at a time, one colour token, in the card and on the stage together; no station draws its own ring, band or throb; no throb on a hidden word after its first hidden showing; rows tick piece by piece (sekelo mixed, samosa); 17 Oct: "make it glow even more, kind of extend a little bit further out from the item ... like how we got on the tick button ... pulsating quite strongly" | **to fix: code** · film samosa L2; clinic glow white and off-centre | auto: contract-8 highlight (one at a time, every flow); eye: sekelo L2, daar L2, samosa L3, pantry, a clinic tool strip: one colour token, no station's own ring (sprint check sheet) · CMP-09 · eye: the help glow beside the tick's pulse, every game | `docs/archive/feedback/cook-playtest-2026-10-06.md` S5, D11, A10; `docs/archive/feedback/cook-ui-feedback-2026-09-28.md` §8 · `docs/feedback/cook-playtest-2026-10-17.md` P13 |
| SH-60 | Help (line and glow) only after the pause, for the first item too; a new player sees every word ("Start over" clears learned words; "play as new" in "?"); 17 Oct: "I've literally pressed chai ... almost immediately I'm getting the audible hint to put in milk"; "the highlight should only happen at the same time as the voice instruction ... both held back a couple more seconds"; "for the first one we just bump it up by two seconds"; "Give a bit more time for the hints, especially because a hint should cost a bulb"; his question "there is an onboarding tutorial, isn't there?": yes, the first play of each recipe is guided (`js/cook/flow.js:406`) and highlights at once; after that his rule holds · Merged SH-95: A help ladder, every game: "it definitely shouldn't play at the beginning ... after a reasonable amount of time Nani tells you the instruction audibly and the items start flashing"; "You shouldn't be getting help, especially not in level four ... beginning levels, with hints, and it shouldn't persist"; "Can we check how and when she chimes in on level 3?"; the lab's "Nani helps" on by default · Merged SH-96: "Flash the light bulb on the recipe card, or both light bulbs ... after like 15 or 20 seconds ... so they know that they can use the light bulbs and they're clickable", every game | **to fix: check** · sekelo glow fixed (glow-green, 0 breaks); judge to close | eye: pantry L2, fresh profile · LNG-02 · auto: every game, a contract-run check built with the fix (no line or glow before the pause from the last action) | `docs/archive/feedback/cook-playtest-2026-10-06.md` PA5, PA12 · `docs/feedback/cook-playtest-2026-10-17.md` P1 · `docs/feedback/cook-playtest-2026-10-17.md` P5 · `docs/feedback/cook-playtest-2026-10-17.md` P65 |
| SH-112 | "Do a review of all of these item boxes everywhere to make sure they're the right size, which is bigger": the tool strip items "too small compared to the whole scene. It's not obvious what they are" (boing, fever, foot) | **to fix: code** · fever strip empty | eye: every tool strip, both games, 800x360 and 1366x768 | `docs/feedback/clinic-playtest-2026-10-18.md` P1 |
| SH-115 | Cut-outs: "We built a tool to cut these out and test them, so this should all be picked up"; "Please understand why these are slipping through and make the fix to the tools" (the eye bottle, the foot's toes, the tweezers, the thermometer) | **waiting on art** · re-cut four pictures (holes) | auto: a pixel check on every shipped cut (grey share, holes, rim, cream composite) | `docs/feedback/clinic-playtest-2026-10-18.md` P7 |
| SH-117 | One shared pour and fill, every game, from Cook's chai (being redone): the daal into its pot and the taste game's glass · Merged DAAR-28: "A better animation for the daal pouring into the pot ... like the chai one, but remember we're redoing the tea one" · Merged CLN-197: Taste: "the filling animations ... take from the cook game ... the chai game" | **waiting on art** · the daal bowl tipping, top-down frames | eye: each pour and fill as frames | `docs/feedback/cook-playtest-2026-10-17.md` P47 · `docs/feedback/clinic-playtest-2026-10-18.md` P49 |

## Cook: pantry

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| PAN-06 | Shelves side-on, not top-down bowls; clear labelled jars; meat in a fridge section; no generic metal jugs; three to four full shelves; nothing floating | **waiting on art** · labels, shelves, meat | eye: 1366×768 · ART-03 | `docs/archive/cook/cook-with-nani-phase-a-design.md` §2 |
| PAN-04 | One speech queue per station, in every station and the clinic: the count words, Nani's "next thing" line and the order never overlap (the chop's explainer played "loads of voice all at the same time"); 17 Oct: "lots of voice overlap"; "such an assault. It's really hard to follow everything"; "Computer's voice and Nani's voice were going at the same time" · Merged SH-94: Item names said on every tap, every game: "Mishkaki, Mishkaki, Mishkaki ... very noisy"; "we don't repeat the ingredients out loud when we put them in, maybe for everything"; tapping water "interrupts and stops their order playing out ... how do we expand that as a rule across this game mode and across all game modes" · Merged PAN-16: The pantry reads its lines twice: Nani's ask for a thing (*Muke dudh de.*) is said, then said again straight after (package C saw it, 12 Oct); 17 Oct: "Nani keeps saying multiple times fill it up with meat ... after each time I put one"; "she says everything twice"; "samosa war ... twice like straight after each other with no pause"; daal "she said again to put turmeric and then rice" ; "she should say it once maybe at the beginning and then not say it ... Unless I put it in like once and then have a massive pause for 10 seconds" · Merged CHAI-21: "She said elchi wari and then said the whole sentence ... You should just start with the full sentence" | **waiting on Zafar** · your ear: one voice at a time | auto: contract-7 one-voice (voice log: no two lines at once, every flow); ear: pantry, the chop · AUD-01 · auto: contract check every game (no two voices at once, pops and counts included) + auto: every game, a contract-run check built with the fix | `docs/archive/feedback/cook-playtest-2026-09-29.md` P1; `docs/archive/feedback/cook-playtest-2026-10-06.md` D1 · `docs/feedback/cook-playtest-2026-10-17.md` P4 · `docs/feedback/cook-playtest-2026-10-17.md` P3 · S05 orchestrator, 12 Oct (from package C) · `docs/feedback/cook-playtest-2026-10-17.md` P2 · `docs/feedback/cook-playtest-2026-10-17.md` P8 |
| PAN-01 | **KNOWN BUG.** "Bring me these" headline clipped ("these" cut) and the growing highlighted row / gold done-outline clipped at the card edges (re-found 30 Sept 18:00 UK) | **to fix: check** · open (two strikes: Zafar) (evidence FAIL ev-20261021-141514-4pn) | eye: 390×844 and 1366×768, each fetched row · TXT-01, TXT-04 | `docs/archive/feedback/cook-playtest-2026-09-29.md` P3, P2; `docs/archive/feedback/cook-playtest-2026-10-06.md` |
| PAN-13 | Pantry/chai fatigue in the story days: pantry only the first time a dish is ever made; a new station sooner | **to fix: check** · fixed (one pantry trip); judge to close | eye: story days 1–3 | `docs/archive/feedback/cook-playtest-2026-10-06.md` PA15 |
| PAN-10 | Pantry wording: card headline *Muke de* + items, Nani's box the task (*Muke chai lai de*, to check with Mum); at L1 she reads the card once, then names the items one at a time as the child goes (the tea, then the flour, then the daar); from L2 her box folds to a minimised state that expands for the fuller instruction (pending decision) | **waiting on Mum** · the Kutchi headline (Round 5) | ear: pantry L1–L3; eye: the guide box folded at L2 · LNG-04 | `docs/archive/feedback/cook-playtest-2026-10-06.md` PA1, PA3, PA4 |

## Cook: chai

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| CHAI-26 | "I've definitively decided I don't like the pouring mechanism ... the pan's almost rotating away"; "four or five orientations of ... 20 degrees each time towards the player, and the chai level following ... Let's try that once or twice. If that doesn't work then just do one static half-poured, half-turned" | **waiting on art** · pour redo | eye: the pour as frames | `docs/feedback/cook-playtest-2026-10-17.md` P59 |
| CHAI-19 | At 844x390 no loose word pill floats over the hob's top rim (an 'elchi' pill sat there; found by the S05 judges in CHAI-18 D); 17 Oct: "the text that says water covers the bottle as the bottle's pouring ... centered in line with the chai pan but just above it, so that when items get poured in or put in they don't overlap or underlap the text" | **to fix: check** · sweep: right; judge to close | eye: 844x390, chai-tray L3 · eye: chai, every pour, 844x390 and 1366x768 | `build/reports/s05-fixround-verdicts.md` · `docs/feedback/cook-playtest-2026-10-17.md` P29 |
| CHAI-08 | v2 mock-up fixes: hob and tray about 15% bigger and lower, pans true top-down, tilted pan for the pour, real top-down glasses and liquids | **waiting on art** · tilted pan, liquid | eye: 1366×768 | `docs/design-language/ui-design-system.md` §10 |
| CHAI-02 | Layout: hob and tray do not overlap; the ingredient strip shows the pantry's front-on (side-on) jars, carton and bottle, while the hob, pans and tray stay top-down ("I like how it is in the chai one, side-on. If I didn't comment on something, leave it"); real liquid, not a flat blue disc; pour animation; knobs wired; no fill-line relic on glass or pot | **to fix: check** · sweep: right; judge to close | eye: 1366×768, the ingredient strip ×2 zoom | `docs/archive/feedback/cook-ui-feedback-2026-09-28.md` §8; `docs/archive/feedback/cook-playtest-2026-09-29.md` Q2 |

## Cook: daar

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| DAAR-02 | Ladle: a real *kadchi* seen top-down, its handle rising toward the viewer (foreshortened, "sticking up into the air") and resting on the rim as it goes round (DAAR-11); not a dipper or measuring scoop | **waiting on art** · the kadchi | eye: ×2 zoom, stir | `docs/archive/feedback/cook-playtest-2026-09-29.md` D6; `docs/archive/feedback/cook-playtest-2026-10-06.md` |
| DAAR-26 | The stir line: "I don't think the recipe card should come up and tell you ... we should just keep Nani doing the stirring instructions"; "it just said two quickly ... didn't say the word turn or spin ... she should say the full instruction with the verb from the beginning"; the full sentence "needs recording" | **waiting on Mum** · check the stir line; leave as is (Zafar, 21 Oct) | ear: daal stir L1-L4 | `docs/feedback/cook-playtest-2026-10-17.md` P9 |
| DAAR-12 | Laps and speed on the card; asked speed green, the other yellow, spill red | **waiting on Zafar** · stir lab L3: the speed is dots on the card (heard, not written)? | eye: stir L1–L3 | `docs/archive/feedback/cook-playtest-2026-10-06.md` D12, D13 |

## Cook: sekelo

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| SEK-14 | The rack and the plate are pre-rendered pictures holding one, two, three and four real skewers (handles off the plate, straight, left to right, SEK-07); only the pieces are drawn in code on top (his K9 idea, Q11 yes). If the plain plate with code-laid skewers (SEK-07's S03 note) is kept instead, that needs his OK recorded as a decision · Zafar, 19 Oct: yes to the pictures; there are two racks, the uncooked one at the top and the cooked one below | **to fix: check** · sweep: right; judge to close | eye: rack and plate with 1–4 skewers, ×2 zoom | `docs/archive/feedback/cook-playtest-2026-09-29.md` K9, Q11 |
| SEK-18 | Sekelo L1 thread: "I'm not getting any instructions from Nani ... about 20 seconds ... You've not got the Kutchi for her instruction?" | **waiting on Mum** · Thread them line | ear: sekelo L1 | `docs/feedback/cook-playtest-2026-10-17.md` P6 |
| SEK-20 | Sekelo layout: "very visually unbalanced"; the oval plate "a lot more shiny"; "keep the barbecue style ... change the Mishkaki plate"; "Get Fable to do a quick review"; "two racks on the left. One is the uncooked and one is the cooked ... the two racks ... a square and the barbecue ... a square"; "I never really liked the plate anyway"; his three ideas: "a square metal tray with the Mishkakis on it would look better and if it was padded correctly" (less shiny than the grill); the two racks; "then you can make the barbecue a little bit bigger. You might have to redraw it" | **waiting on art** · a square top-down barbecue | eye: sekelo L1-L4 at 1366x768 and 844x390 | `docs/feedback/cook-playtest-2026-10-17.md` P37 |

## Cook: samosa

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|

## Cook: maani

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| MAA-15 | "I heard Ferai once ... I didn't hear it the second time ... she should say it the second time" | **waiting on Mum** · take-off wording | ear: maani L1 | `docs/feedback/cook-playtest-2026-10-17.md` P7 |
| MAA-16 | "She doesn't say and, which makes it seem like maybe the person wants two chapatis overall ... the and there is very important" | **waiting on Mum** · the "and" join | ear: maani L3 | `docs/feedback/cook-playtest-2026-10-17.md` P14 |
| MAA-14 | Nani's "pass me" is one shared pop-up in every station where she can ask (pantry, chai, daar, chaat, samosa, sekelo, maani): she comes across the screen, interrupting, play paused, a 3-second ring, an impatient face; never in a mode's first plays | **to fix: check** · sweep: right; judge to close | eye: story day 2+ in each station, Nani's pass-me pop-up (sprint check sheet) | `docs/archive/feedback/cook-playtest-2026-10-06.md` M9, M10 |

## Cook: chaat

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| CHT-13 | "Artwork for all the items that can go inside the bowl ... it doesn't really work"; "redraw the bowl so it's exactly side-on ... a horizontal strip ... So let's do that, unless you have any qualms" | **waiting on art** · bowl, item art | eye: every chaat item in the bowl | `docs/feedback/cook-playtest-2026-10-17.md` P61 |
| CHT-04 | Layers read as food, not liquid or flat rectangles; chilli layer not too thick; tidy ingredient grid with chips; no big red digit tally; card shows the order; bowl not huge | **waiting on art** · the side-on bowl redraw (CHT-13) | eye: serve and build states | `docs/design-language/ui-design-system.md` §14 |

## Cook: general

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| CK-01 | Levels 2–4 of every station (Cook and clinic) not yet played by Zafar; needs his pass | **waiting on Zafar** · levels 2-4 | eye: L2–L4 · INT-11 | `docs/archive/feedback/cook-playtest-2026-09-29.md` K11 |
| CK-TAB-01 | Tablets: Cook's play items grow to use a 4:3 screen (decision 24); each station needs a 4:3 layout before the stage can grow them | **before app store** · 4:3 tablet layouts (Zafar, 21 Oct) | sandbox 1024×768, 1180×820, 1366×1024 | `build/reports/step3-r3a.md` |
| CK-45 | In chai and the chai tray, a tap on the worktop while Nani's "Wiji chad!" (after a mistake) is said is not taken at once (contract-21: no act within 150 ms; non-negotiable 12: never make them wait for speech) | **to fix: check** · sweep: right; judge to close | auto: contract-21 on cook:chai#mistake and cook:chai-tray#mistake | `build/screenshots/sandbox/s07-gate/contract.md` |
| CK-46 | "Her body is completely floating": at the Cook counter Nani's crossed forearms hover above the counter top (the back cabinet shows under both elbows); Ma's arms read as in her lap, not resting. Target (Zafar, 16 Oct): everyone at the counter reads as seated on a stool behind it, hands and arms in the lap, the counter's edge covering the lower forearms (placement and code only, no new art); and her point pose's finger goes behind the counter edge | **to fix: check** · sweep: right; judge to close | eye: cook:day1, cook:day6 at 800x360, 844x390, 1366x768: no cabinet showing between any arm and the counter in any mood; every figure at one stool height; the point's fingertip on the counter top in front of her; every resting or standing character checked for the same float | Zafar's chat, 16 Oct |
| CK-48 | Loading into a station: "a zoomed-in chopping board which then went away and then the main game loaded"; "all the loadings seem just a bit slow and a bit janky ... Ideally you just go into the game mode nice and smoothly" | **to fix: check** · fixed for daar; slow-load check green | auto: every game, a contract-run check built with the fix (click through the card after 1 s on a throttled run: nothing half-drawn, nothing still loading) | `docs/feedback/cook-playtest-2026-10-17.md` P28 |
| CK-06 | Things inside pots and pans look real (chai liquid, daar oil, contents), not white dots or swirling dots | **waiting on art** · contents look icon | eye: each cooking state | `docs/archive/feedback/cook-playtest-2026-09-29.md` X9, C8, D2 |

## Clinic

### Clinic-wide

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| CLN-82 | L2+: once a count is reached, the next step's row appears and its tool glows after a pause (stuck after dabs, kicks, wipes, jugs: scrape, knee, boing, foot) | **to fix: check** · ring fixed; plaster glow needs a probe that waits | eye: every heal game L2, L3 | `docs/archive/feedback/clinic-playtest-2026-10-06.md` H1, K5, B5, FT4, TA3 |
| CLN-87 | Zoom in and out about 1.5 s; zoom-out from full zoom on the healed part; her poses during the zoom (sitting, the swap to the close-up, the pull-out) are her finished art, no stand-in body ("her animations don't look good") | **waiting on art** · match-cut knee art; zoom-in still ~2.7 s in the sandbox | eye: zoom in and out in every heal game, ×2 zoom on her | `docs/archive/feedback/clinic-playtest-2026-10-06.md` Z1, Z2 |

### Waiting room

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|

### Diagnosis

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|

### Send-off

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|

### Heal games

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| CLN-38 | Eye: the chart draws its items from household and everyday nouns the child has met (bed, table: Find it, Cook, the house), not only fruit and veg ("what else other than fruit and veg?"); "why am I clicking on the things?" answered | **waiting on Mum** · household nouns | auto: list the chart's item pool at each level; eye: eye test L1–L3 | `docs/archive/feedback/clinic-playtest-2026-09-29.md` H-eye; `docs/archive/feedback/clinic-playtest-2026-10-01.md` P81, D18 |
| CLN-65 | Patients have hot, cold, happy, sad, pain (sore) and neutral states, from one body, plus two whole-body extras: cold under the blanket and hugging a hot-water bottle; in fever her body alternates visibly as the room swings too hot or cold; the other five patients get the same set (decision 71 order) | **waiting on art** · patient states | eye: each state, fever as the room swings, send-off | `docs/archive/feedback/clinic-playtest-2026-10-01.md` P57, D3, 2:0:53–1:01; `docs/archive/feedback/clinic-playtest-2026-10-06.md` |
| CLN-106 | Boing: alcohol wipe with a wipe motion; a funny jab; a plaster choice; the bulb shows the next step; "it needs all new artwork": boing's arm and the drop machine are still stand-ins that failed the judge (`clinic.md` "Still stand-ins"), and the row is not built until they pass | **waiting on art** · boing arm, machine | eye: boing L1–L3, ×2 zoom on the arm and the machine | `docs/archive/feedback/clinic-playtest-2026-10-06.md` B2, B3, B4, B5, B6 |
| CLN-107 | Eye: a wrong yes/no shakes red, the doctor names the row with pictures; a misread gets a drop and a right re-read before the tick; outlines don't overlap; chart drawn in code, items shrink clearly, one big at top; stylised eye; "to the eye test" button bottom right; L1 her word as a fading bubble; count-along L1 only; water vs milk pictures | **waiting on art** · stylised eye | eye: eye L1–L3 | `docs/archive/feedback/clinic-playtest-2026-10-06.md` EY1, EY3, EY6, EY7, EY10–EY13 |
| CLN-119 | Each heal game teaches its own language strand beyond numbers, from its scene (D18): scrape colours and first/then; knee body parts; ear big/small and the hearing word; tooth up/down, left/right; drinks colours and *na*; fever room things and open/close/on/off; boing colours; eye household nouns; foot toes and water temperatures | **waiting on Mum** · each game's words | auto: the words each game marks in `ctx.mark`, listed per game; eye/ear: each game L1–L3 | `docs/archive/feedback/clinic-playtest-2026-10-01.md` P40, P62, D18 |
| CLN-137 | Send-off L2: her face shows no feeling while she says it (her art's resting face smiles) | **waiting on art** · neutral face | needs-decision | `docs/archive/feedback/clinic-playtest-2026-09-29.md` E2, E4, CQ6, §13d |
| CLN-150 | The doctor is one picture everywhere: the box at the top and the heal card show an older man with glasses (Kit.DOCTOR_FACE), the diagnosis card and the standing doctor a bearded man | **waiting on art** · judge passes | eye: clinic diagnosis and heal 1366x768 | build/screenshots/sandbox/s06-route3 |
| CLN-156 | Standing check-up: he reads further forward than her (his dark shoes spread wider than her small white ones); bring her forward a touch and a little bigger, so every part of her is easy to tap | **to fix: check** · sweep: right; judge to close | eye: clinic:diagnosis@L3, clinic:morning@L3 at 800x360 and 1366x768: they read side by side to Fable; her tap targets at least today's size | Zafar's chat, 16 Oct |
| CLN-158 | The hiccups heal game writes English sound words to the child ("hic!", "glug!", "BOO!", "pfff!"; non-negotiable 5), and a menu button is cut off at its top at 800x360 (the sidebar card scrolls, 191>170) | **waiting on Zafar** · the hiccups game is parked (Zafar, 21 Oct) | eye: heal-extra-hic at 800x360 and 1366x768: no written English, nothing clipped | build/reports/s08-gate.md |
| CLN-163 | "The zoom in animation on the teeth needs to be much better ... two big jumps"; "nicely smoothly zoom in and zoom out"; "multiple artwork steps or ... an upscaled high resolution version"; "from far the cavities look like they went outside of the teeth area" · Merged CLN-185: "The teeth, and ... the eye game feel a little bit too zoomed in ... it's a bit intimidating" | **waiting on art** · a face-to-mouth middle step, high-res | eye: every close-up's zoom as frames; at the far view the cavities sit inside the teeth, every level | `docs/feedback/clinic-playtest-2026-10-18.md` P11 · `docs/feedback/clinic-playtest-2026-10-18.md` P36 |
| CLN-172 | Scrape: "It's incredibly boring ... nothing really to do ... I don't even know how educational it is"; "suggestions ... swipe mechanics and match mechanics and spot the difference"; "which language elements"; "hospital games ... learn from them"; "knee surgery ... broken bones ... connect up the valves"; "send an agent to do a bit of research ... do we replace it"; his limits: "What other knee games are there? There's knee"; "I'm not sure how that would be educational in terms of language ... not that advanced that we would even know the vocabulary" | **waiting on Zafar** · parked (Zafar, 21 Oct) | auto: no ailment reaches the scrape (`data/clinic/pipeline.json`), as hic, tummy and hair | `docs/feedback/clinic-playtest-2026-10-18.md` P20 |
| CLN-175 | Fever: "the thermometer is also not cut out correctly"; "it looks like a cartoon thermometer ... it should be a photorealistic one" | **waiting on art** · photoreal thermometer | eye: fever, strip and mouth | `docs/feedback/clinic-playtest-2026-10-18.md` P23 |
| CLN-179 | Knee: "it needs to be a photorealistic bandage"; "the bandages still don't go to the edge of the knee sometimes ... level three, do it eight times ... zoom in"; "it doesn't need to be coded, you need artwork for this, don't know, you're gonna have to tell me, do a bit of research ... tell me what would be best" | **waiting on art** · a photographic bandage that curves round the knee | eye: knee L3 eight wraps, zoomed | `docs/feedback/clinic-playtest-2026-10-18.md` P30 |
| CLN-180 | Tooth: "the bristles point to the top right ... the back of the handle ... also facing the top right ... twisted"; "make sure you understand what I'm saying visually ... write the right prompt and evaluate the outcome" | **waiting on art** · brush direction | eye: the brushing view | `docs/feedback/clinic-playtest-2026-10-18.md` P31 |
| CLN-186 | Eye: "photorealistic drops, and the bottle ... isn't cut out nicely at all" | **waiting on art** · drops, bottle re-cut | eye: eye L3 | `docs/feedback/clinic-playtest-2026-10-18.md` P37 |
| CLN-192 | Foot: "the outside of the foot isn't cut out that well"; "the foot kind of floats ... the ankle ... just stops dead ... blow it out into the background" | **waiting on art** · foot cut-out | eye: foot at 800x360, 1366x768, 1366x1024 | `docs/feedback/clinic-playtest-2026-10-18.md` P44 |
| CLN-193 | Foot: "an irritated raised red translucent channel and you see the splinter traveling inside"; "a 2000-level snake type game"; "a repeatable, very tileable visual block ... drawn by ChatGPT ... the splinter as well"; "we don't really want to show the foot cut open"; "you have to make it translucent"; "give me some suggestions" (answered §6) | **waiting on art** · splinter channel | eye: foot, every level's paths | `docs/feedback/clinic-playtest-2026-10-18.md` P45 |
| CLN-196 | Taste: "a metal cup, but it's got a drop shadow, but it's sitting on the surface"; "Is the metal cup the right thing?" | **waiting on art** · judge passes | eye: taste | `docs/feedback/clinic-playtest-2026-10-18.md` P48 |
| CLN-35 | Tooth: brushing clear; no confusing bug; voice-overs, input live and sidebar work | **to fix: check** · film the brushing | eye: tooth | `docs/archive/feedback/clinic-playtest-2026-09-29.md` H-tooth, §13k; `docs/archive/feedback/clinic-playtest-2026-10-06.md` |
| CLN-43 | A heal game opens by zooming from the patient on the bed to the sore part; never a lone limb on a table; the background soft, not washed out (D1) | **waiting on art** · her forearm resting in her lap, close-up | eye: each heal game's opening, 1366×768 and 844×390 | `docs/archive/feedback/clinic-playtest-2026-10-01.md` P2, P3, 1:0:00–1:51, 2:0:26 |
| CLN-52 | Tooth: drilled inside the mouth; decay jagged and scattered by level | **to fix: check** · sweep: right; judge to close | eye: tooth L1, L3 | `docs/archive/feedback/clinic-playtest-2026-10-01.md` P43, P44, 1:23:04–23:31, 1:25:04 |
| CLN-57 | Fever: always clear what to do next (no tools that silently do nothing): the doctor's line and the lit row name it, and it glows after a pause (the help ladder, SH-60); a live thermometer with a zone | **to fix: check** · frames miss the glow pulse; re-shoot | eye: fever, after each change | `docs/archive/feedback/clinic-playtest-2026-10-01.md` P58, P59, 2:1:01–2:21; `docs/archive/feedback/clinic-playtest-2026-10-06.md` |
| CLN-99 | Scrape: a dabbing cloth; the sequence's stick ends in its tip below the last row (SEK-17); all steps (plasters too) in the sequence; no "Cold!" mid-step | **to fix: check** · sweep: right; judge to close | eye: scrape L1–L3 | `docs/archive/feedback/clinic-playtest-2026-10-06.md` S1, S3, H3 |

## A day at Nani's (story mode)

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| BOOK-05 | Stick in the photo: Nani's sentence about the day ("then we saw a big cow"), written under the dashed frame as she says it; the child drags the right one of three unlabelled photos of the day into the frame; it snaps in or slides back; it can be taken back until Done | **to fix: check** · open | eye: a filmstrip at 1366x768 + auto: the book leak bot | `docs/sprints/S09-a-day-at-nanis.md` (Zafar, 19-20 Oct) |
| DAY-02 | A whole day plays through: the farm day goes door, ride, book with its finds; a kitchen or clinic day hands off and the book follows on return | **waiting on Zafar** · open (two strikes) (evidence FAIL ev-20261021-032427-602) | auto: the full-day flows reach their end | `docs/sprints/S09-a-day-at-nanis.md` (Zafar, 19-21 Oct) |
| DAY-03 | The way back: Cook's or the clinic's round returns to the evening book by itself, and writes the day log the book reads | **waiting on** Sprint 8's publish (a change in Cook and the clinic) | auto: day:full-kitchen plays Cook's round and returns to the book | s09-final-door report, 21 Oct |

## Labs and the day builder

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|

## Other modes

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| MOD-10 | The parked modes still write English for the child (non-negotiable 5), outside the ? and the labs: result headings and receipts ("Words from this round", "They asked", "Understood", "Pocket money", "Case closed!", "Helping Nani"), the titles' intros (Find it, Snap), Snap's "Show Nani" and "None of these: take another", the intro cards' "Tap to start", "Nani's list", "Nani's photos", the result's way back to the lab ("Dress lab"), Who did it?'s "EN" and Monsoon's storm name | **waiting on Mum** · English needs Kutchi | auto: contract-16 on the mode flows | `build/screenshots/sandbox/s06-gate/contract.md` (full gate, 14 Oct) |

## Art (cuts, style, backgrounds, characters)

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| ART-10 | Nani has four cooking moods (not one image); Nana, Ma and Ali "impatient" faces do not smile smugly | **waiting on art** · four Nani moods | eye: Nani faces | `docs/archive/cook/cook-with-nani-todo.md` "Then" |
| ART-11 | Potato cube does not read as butter | **waiting on art** · potato reads butter | eye: ×2 zoom | `docs/status.md` §7 Artwork |
| ART-12 | Clinic 7.1 "where it hurts" has neck, back and hair parts; belt and rail do not sit too high | **waiting on art** · neck, back, hair parts | eye: 1366×768 | `docs/status.md` §7 Artwork |
| ART-19 | Every speaking character has life from one body: a blink, mouth shapes while a line plays (two or three mouth frames on the registered face canvas, "even with the speech bubble"), breathing, and a small set of pose images (neutral, happy, gesture, concerned) on one canvas (ART-06); Nani, Nana, Ma, Ali, the shopkeeper, the doctor and the girl, every mode; no new animation that does not look good (E22) | **waiting on art** · blink and mouth frames | eye: each speaking character while a line plays, Cook service and the clinic (the eye test first) · LAY-08 | `docs/archive/feedback/playtest-2026-09-23.md` §2 (yes, [MVP] basic), §4.4; `docs/archive/feedback/clinic-playtest-2026-10-06.md` EY8 |
| ART-20 | A table of every clinic item and every view it needs (belt, tray, tool column, in use, spares), then one sprite sheet per item (decision 65); the belt's tilted plaster and comb (CLN-97) and boing's drop machine are the first gaps | **waiting on art** · item views | eye: the table in `clinic.md`, then each item's views in the pharmacy and its heal game | `docs/archive/feedback/clinic-playtest-2026-10-06.md` P6 |
| ART-22 | "The girl and doctor look like different game artwork styles they completely clash"; Nani, the grandad (the doctor) and the girl must share one house style that suits the rest of the game | **waiting on art** · one house style | eye: Nani, the doctor and the girl side by side, and each in their scene | Zafar's chat, 16 Oct |
| ART-23 | Waiting room: the man and woman on the bench (and the auntie, uncle, woman with baby stand-ins) are in a chibi style the girl and boy aren't | **waiting on art** · bench style | eye: clinic:waiting at 1366x768: one style on the bench | build/reports/s08-rejudge.md |
| ART-18 | Less bobbing: the talk bob is about a third of today's (now 6 px / 1.2° every 220 ms) and slower, one shared talk animation for Cook and the clinic, every speaking character in every mode (asked three times: K2, Z10 twice) | **to fix: check** · sweep: right; judge to close | auto: contract-14 talk (one talk animation, every mode); eye: Cook service, the clinic waiting room and diagnosis, the bob moving (sprint check sheet) | `docs/archive/feedback/cook-playtest-2026-10-06.md` K2; `docs/archive/feedback/playtest-2026-10-08-sprint3.md` Z10 |

## Language and audio

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| LNG-18 | "For the purposes of testing you can use English voices spoken out loud across the game ... on the final release they have to all be replaced": on the test site every line without a family recording, its English placeholders included, is spoken by the device voice in every game (Cook, the clinic, the day); the store build plays none, and a release check lists every line still to record (amends LNG-01 for the test site only) | **to fix: code** · open (Zafar, 20 Oct) | auto: a contract-run check on the test path (every line has a sound) and the store path (no device voice, no TTS) | Zafar, chat 20 Oct |
| LNG-01 | No English instruction text or audio for the child (pop-ups, help bubbles read by a device voice); no English or pictures where the task is understanding Kutchi; English only in "?" | **waiting on Mum** · device voice stands in | auto: `build/check_onboard.mjs` · LNG-01, LNG-05 | `docs/archive/feedback/cook-ui-feedback-2026-09-28.md` §1 |
| LNG-04 | English placeholder words still waiting for Mum: the "with" join, *ph-turner*, *sekelo*, the plaster line | **waiting on Mum** · placeholder words | auto: `build/lines_needing_family.py` · LNG-04 | `docs/archive/feedback/cook-playtest-2026-09-29.md` Q5, M6, K1 |
| LNG-06 | Voice is not "crazy fast"; no device or browser voice in shipped audio (family voices only) | **waiting on Mum** · device voice stands in | eye: ear · AUD-01 | `docs/archive/build-logs/cook-with-nani-build-log.md` §1 |
| LNG-08 | Family voices sound clean: clean-up pass on Mum's clips, a mic for the next rounds (pending decision) | **waiting on Mum** · studio re-record after her next round (Zafar, 21 Oct) | ear: blind A/B of 10 clips | `docs/archive/feedback/cook-playtest-2026-10-06.md` V1, V3 |
| LNG-10 | "Thank you" and the family's "oh dear" recorded; *arre re* out until Mum gives it | **waiting on Mum** · thank you, oh dear | ear | `docs/archive/feedback/cook-playtest-2026-10-06.md` T9 |
| LNG-11 | *Muke de*, *Muke chai lai de* checked with Mum | **waiting on Mum** · Muke de check | auto: lines_needing_family | `docs/archive/feedback/cook-playtest-2026-10-06.md` PA4 |
| LNG-12 | Clip candidates say only the target word in the right voice (picker offered 'Okay' for amli, 'P-10 Cup' and 'P-11' for cup, English talk for chulo) | **waiting on Mum** · studio re-record after her next round (Zafar, 21 Oct) | auto: blind double transcription + 30-clip audit; ear: Zafar's picker | Zafar, 7 Oct (chat) |
| LNG-15 | Cook's day-6 finale heading "Eid Mubarak!" is hand-written and not in the family lexicon: shown as English to record (grey italic, data-rec) until Mum confirms it and it comes from the language engine | **waiting on Mum** · Eid greeting | auto: contract-16 on cook:day6 | S06 touched-flows check, 14 Oct |
| LNG-16 | The customer's opening is silent, every order: "I didn't hear the muke"; "the Mukher didn't play at the beginning ... opening card"; "I don't hear the muke. I don't think it's playing. So that needs fixing" (no clip for *muke* or *khape*; the device voice's cancel race, `js/core/voice.js:298`) | **waiting on Mum** · muke, khape clips | auto: every game, a contract-run check built with the fix (the opening line plays, every order) + ear: chai L1, maani L1, chaat L1 | `docs/feedback/cook-playtest-2026-10-17.md` P11 |

## Clinic

### Pharmacy

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|

## Clinic

### Pharmacy

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|

## Clinic

### Pharmacy

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|

## Shared components

### End screen and word review

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| SH-51 | Coin-jar pocket-money screen (five fill pictures, card lands on the jar, coins drop with a ching, card rises and fades; this game's total and the jar total) from the end-screen template; cards not clipped (rounded top, square bottom now); Next is the primary button, not a red "Nani's shop" (pending decision) | **to fix: check** · jar fills to the cheapest thing not yet bought (Zafar, 21 Oct); judge | eye: day summary 1366×768, 390×844 | `docs/archive/feedback/cook-playtest-2026-10-06.md` C10, C11, C14 |

## Shared components

### Onboarding and help

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|

## Shared components

### Onboarding and help

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| SH-63 | The guide box vs the card: one rule and a table of every line in every Cook station and clinic stage | **to fix: code** · clinic L2 card shows step lines, not the order | eye/ear: every game | `docs/archive/feedback/clinic-playtest-2026-10-06.md` G1, D6, D13, FV7, B1, FT3 |

## Shared components

### Onboarding and help

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| SH-64 | The whole card is read out only while the request pop-up is up; a tap that clicks through into the game cuts the read-out at once (now the pharmacy pop-up folds on a tap but the reading carries on); one shared pop-up from `js/shared/` for Cook and the clinic (non-negotiable 8) | **to fix: check** · game stops at the tap; probe taps late | ear: tap through the pop-up at once, Cook chai and clinic pharmacy, scrape | `docs/archive/feedback/clinic-playtest-2026-10-08.md` P1, P2 |

## Process

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| PRC-06 | Rows were marked built from reading code and never seen in play; feedback documents never re-read against the list for coverage | **to fix: check** · nine rows still have no spec | the full audit (decision 76): every row with proof | `docs/archive/feedback/playtest-2026-10-08-sprint3.md` Z11 |

## Easy to play (Sprint 11)

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| EASY-08 | The spotlight lights only the live control (judge, 22 Oct: it half-lit the jar above and the water bottle) | **to fix: code** · Step 0's spotlight | eye: the 5 s spotlight on chai, one thing lit | `docs/sprints/S11-easy-to-play.md` |
| CHAI-31 | Tea colour and effects (judge, 22 Oct): the tea is maroon in the pan but amber in the glass; a blue water splash lands on amber tea; the conversation bubble shows a generic face, not Nana's | **to fix: code** · s11-cook fix round | eye: pan and glass the same tea; splash in the tea's colour; the bubble with his face | `docs/sprints/S11-easy-to-play.md` |

## Keep (things Zafar liked: must not regress)

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| KEEP-01 | Underline while a line is spoken; order card and pop-up are "the bar we want to set" | keep | eye: every station · TXT-08, CMP-07 | `docs/archive/feedback/cook-playtest-2026-09-29.md` C1, C13 |
| KEEP-02 | Daar: chopped things wait at the side and you add them in | keep | eye: daar | `docs/archive/feedback/cook-playtest-2026-09-29.md` D4 |
| KEEP-03 | Samosa: oil looks better, frying is fun, adding samosas is fun, slotted-spoon lift is good | keep | eye: samosa | `docs/archive/feedback/cook-playtest-2026-09-29.md` §S |
| KEEP-04 | Samosa fold swipe stays and feels great; no dashed line, no red dot | keep | eye: fold | `docs/design-language/ui-design-system.md` §15 |
| KEEP-05 | Sekelo top-down ingredients look good; sekelo stays top-down | keep | eye: sekelo | `docs/archive/feedback/cook-playtest-2026-09-29.md` §K |
| KEEP-06 | Diagnosis: "does it hurt here?", "my foot", "look at the knee, then the hand"; calm, no time pressure | keep | eye: diagnosis | `docs/archive/feedback/clinic-playtest-2026-09-29.md` D1, D2, D3 |
| KEEP-07 | Heal games liked: knee tap, ear wax taking-out, tooth small-tooth three taps, taste "bones", boing wipe and count, eye test, plaster colour idea | keep | eye: each heal game | `docs/archive/feedback/clinic-playtest-2026-09-29.md` H-knee, H-ear, H-tooth, H-taste, H-boing, H-eye |
| KEEP-08 | The lolly "so funny" (now an apple, never a lolly) | keep | auto: grep lolly · CUL-02 | `docs/archive/feedback/clinic-playtest-2026-09-29.md` E3 |
| KEEP-09 | The closed card's three dots ("he's talking"); the card's fold | keep | eye: L3 card | `docs/archive/feedback/clinic-playtest-2026-10-01.md` P9, P13, 1:5:02, 1:7:26 |
| KEEP-10 | Liked in the heal games: the bandage wrap, the ear pop-ups, the drill concept, the tongue pops, the thermometer, the boing and its plaster, the eye redrop-and-reread, foot L3 | keep | eye: each game | `docs/archive/feedback/clinic-playtest-2026-10-01.md` §2 of this report |
| KEEP-11 | Nana's voice; Nani and Nana talking; two-person chai; maani speed; the greeting hand gesture | keep | eye: each | `docs/archive/feedback/cook-playtest-2026-10-06.md` V4, M4, M13, C17 |
| KEEP-12 | The card that shows then blanks words; chai highlighted at the start; calling out items as they go in | keep | eye: pantry, chai | `docs/archive/feedback/cook-playtest-2026-10-06.md` PA6, PA9, C3 |
| KEEP-13 | Pantry wrong-item handling; cooker on early is fine; daar dial and rotation; samosa fry and frying handle | keep | eye: each | `docs/archive/feedback/cook-playtest-2026-10-06.md` PA13, C28, D6, A9 |
| KEEP-14 | Clinic: the zoom in and out; scrape sequence; pharmacy pause-hint and card fold; knee animation and dots; ear clean-up and wax that keeps coming; tooth drill, fill-to-green, clean mouth, L3 one-by-one, fill timer; taste popping; fever window; eye test and art; foot splinters; waiting room L3 heard-not-seen | keep | eye: each | `docs/archive/feedback/clinic-playtest-2026-10-06.md` P4, P7, K4, K7, E7, T2, T8, TA1, TA5, EY9, FT5, W4 |
| KEEP-15 | Chai: the pan's boiling bubbles and the flames ("the tea animation with the bubbles") | keep | eye: chai boiling state | `docs/archive/feedback/cook-playtest-2026-09-29.md` C11 |
| KEEP-16 | Liked, 17 Oct: daal chop ("so much better ... the knife ... really nice"); the stir speed indicator ("looks very good"); chai's replayed order on a pot tap ("very clever"); maani's big and small ("really fun"); sekelo's grill ("let's keep the barbecue style"); samosa frying ("this part's kind of fun", with KEEP-03) | keep | eye: each | `docs/feedback/cook-playtest-2026-10-17.md` P37, P40, P46, P51, P53, P58 |
| KEEP-17 | Liked, 18 Oct: boing's stars and hearts ("actually isn't terrible"); the knee bandaging ("not bad now ... looks much better"); the foot's pathways ("I love to see the different pathways") and its play ("the gameplay part of it is fun"); Cook's daal dial ("looks really good"); fever's "cold snowflake icon, which is good" | keep | eye: each | `docs/feedback/clinic-playtest-2026-10-18.md` P15, P30, P45, P34 |

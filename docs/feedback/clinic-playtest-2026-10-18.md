# Feedback: clinic play-test, 18 Oct

**Source:** Zafar's two voice notes, 18 Oct, on the live site (38d0591a), through the heal-game lab page: part 1 (24:29) boing L1 and L3, the scrape, ear, fever, the girl's and doctor's placement, knee, tooth; part 2 (14:05) eye L3, foot, taste L3. Transcribed with `build/transcribe_family.py`; times part:m:ss. 322 transcript lines, 49 points. Causes checked in code by one read-only reading pass (nothing run in a browser); a fresh Fable second reader on §3. Kutchi spellings are Whisper's.

## 1. What it would change (read this first)

### 1a. Every mechanic changed

| Game or screen | Now (checked in code) | Proposed | Points |
|---|---|---|---|
| Scrape | Wash, dab, plaster: one verb a step (`js/clinic/heal/games/cut.js:560`) | His question: make it fun or replace it (a surgery or broken-bone game); a researched design pass first, nothing replaced without his yes (clinic decision 1) | P20 |
| Every heal game, first (taught) round | Counts dropped from the card and the voice (CLN-118, `js/clinic/heal/games/cut.js:646`) while the step still closes at the count | Every count needed is written and said, every round (clinic decision 2) | P5 |
| Boing | L1 any drops, no colour; plaster any colour; a 5-3-1 count-down and a squash "boing" | The colour said at every level, the plaster's colour said and judged; no count-down, no squash, the syringe sits above the arm, a puff hides the needle (clinic decision 3) | P15, P16, P19 |
| Ear | Code-drawn sore spots the bud must miss (CLN-46) | The spots go, for good (clinic decision 4) | P8 |
| Fever | "Just right" the instant the reading touches green; no ending | Settled only after about 2 s in the green; a real ending (clinic decision 5) | P26, P29 |
| Tooth | Filling stops itself at the top | Overfill shows, smooths back, redo (clinic decision 6) | P35 |
| Every close-up | Zoom in jumps between two pictures | One hi-res picture, one smooth camera (clinic decision 7) | P11 |
| Eye | One eye, 1-3 drops at every level; rows 1, 2, 2, 3 on a code-drawn board | From L2 drops per eye (left and right); an optician's wall, a real chart, rows 1-2-3-4 (clinic decision 8) | P38, P39 |
| Foot | Each jug clears a random share of the dirt | Move the water over each dirty patch, as the scrape's wash | P42 |
| Every replay | Says every row, done ones too | Says only the steps still to do | P6 |

### 1b. Old art reused

| Asset | Where it is reused | Points |
|---|---|---|
| `assets/clinic/sheets/syringe/*.webp` (drawn, not wired) | Boing's syringe, in place of code rects | P12 |
| `assets/clinic/sheets/cloth/cloth-*.webp` | Boing's wipe, in place of the packet | P16 |
| `assets/clinic/items-v2/plaster-skin.webp` | The foot's plaster, in place of code rects | P43 |
| `assets/clinic/sheets/tweezers/tweezers-open.webp` (unused) | The ear's grab, back prong and front prong | P21 |
| Cook's whole lemon `icon-fru-02.webp` | The eye chart's *limu* until a new lemon lands | P41 |
| Cook's chai fill | The taste game's fill | P49 |

## 2. Every point

| Point | Time | What Zafar said | Screen | Cause (checked in code) | Fix |
|---|---|---|---|---|---|
| P1 | 1:0:09-0:20, 1:14:23-14:38, 2:7:28-7:48 | "the items on the right hand side look a bit too small compared to the whole scene. It's not obvious what they are"; fever: "the size of the items on the right hand side all need reviewing ... it's too small"; foot: "the item boxes are too small, but you've got to do a review of all of these item boxes everywhere to make sure they're the right size, which is bigger" | every tool strip, both games | `js/clinic/heal/scene.js:85` draws the tool at 60x46 in a 72x53 box (`css/clinic.css:532`) | One shared, bigger tool box (tokens), every strip in both games |
| P2 | 1:2:37-3:03, 1:6:24-6:33 | "in the left-hand panel, on the bottom left, there's what looks like code. It said mounted Boing L1 side equals right seat equals 92276 tray equals. That's always there"; "the code being in the bottom left is also apparent on all these game modes" | the heal-game lab page | `lab/clinic-heal-host.html:146` prints the lab log into `.cl-lab-out` (`css/clinic.css:175`); not in the real clinic | Lab log only with `?debug=1` |
| P3 | 1:4:04-4:32, 1:6:10-6:24, 1:13:26-14:14 | "I didn't think that was the new agreed-upon style, where it's like an arrow going down in the centre, and then the items, pills on top of it ... a legacy design style? ... if we came up with a new one, let me know"; ear L3: "there's two cards ... shouldn't they all be part of the same sequence ... review all these side cards and make them similar to cook" | every clinic card | The pills on one stick are the agreed shared sequence (`js/shared/order-card.js:194`; SEK-03, SEK-17, CLN-94); ear L3 splits because its wax rows carry `seq:"wax"` and the rest none (`js/clinic/kit.js:783`) | Answer: it is the agreed style; one sequence, one box, in every heal game |
| P4 | 1:4:32-5:35 | "the face of the doctor is very zoomed out ... you can see down to like the third or fourth button"; "all the characters where you just see a circle of their face need to be zoomed in by the same amount ... recipe cards, or the guide card"; "the patients ... top right ... maybe a little bit more zoomed out, or maybe keep them all the same ... they all need to be done the same way ... have a go first, and then do a visual check yourself, and then adjust manually" | every face circle, both games | The doctor's circle uses a 144 px bust (`js/clinic/kit.js:184`), the patients tight 512 px heads; the circles share no zoom (`css/shared/order-card.css:73`) | One shared zoom, a per-face tweak in data, set by eye |
| P5 | 1:6:36-6:59 | "it needed me to press the cloth twice, but it wasn't in the instructions to do it twice. So I can't say enough times, all the frequencies has to be written down. And audible as well" | every heal game's first round | The taught round drops the count (`js/clinic/heal/games/cut.js:646`, CLN-118) while the step closes at the count (`js/clinic/heal/games/cut.js:812`); the same in ear, boing, eye, foot, knee; the host skips the spoken number (`js/clinic/heal/host.js:598`) | Clinic decision 2 |
| P6 | 1:12:00-13:26 | "this will be something for maybe all game modes across both games ... I pressed the speaker button ... he told me all the items, all the steps on the list ... it's already ticked off all the other items ... they should just read out starting from the remaining steps" | every replay, both games | `js/clinic/kit.js:1075` replays every row up to the current one, ticked ones too | Replay only the steps not done (Cook's replay too) |
| P7 | 2:0:00-0:39, 2:6:40-6:59, 2:7:48-7:53, 1:10:15, 1:14:38 | "the bottle isn't cut out nicely at all"; "We built a tool to cut these out and test them, so this should all be picked up"; "this foot is really terribly cut out, there's massive grey spaces in between the toes. Please understand why these are slipping through and make the fix to the tools"; the tweezers "aren't cut out nicely"; the thermometer "not cut out correctly" | every cut-out, both games | `build/tools/art/artcheck.mjs:53` only checks "WebP with alpha"; the pixel judge (`build/tools/art/artjudge.py:150`) only flags, skips glass and runs on sources; the cutter keys #808080 at tolerance 10 (`build/tools/art/artlib.py:21`), so steel sits on the key, and keeps grey holes under 600 px (`build/tools/art/artlib.py:53`) | A pixel check on every shipped cut (grey share, holes, rim, a cream composite); re-key steel; re-cut the failures (clinic decision 11) |
| P8 | 1:11:00-11:57, 2:10:46-10:54 | "Again, I've told you this once, I don't know why you've not recorded this, on her earlobe ... a cartoon-looking purple blob ... it stays there the whole time ... it should just be removed"; L3 "two pink dots ... please remove them permanently"; foot: "there's a random purple dot on the big toe" | ear; foot | The ear's spots are code-drawn sore patches the bud must miss (`js/clinic/heal/games/ear.js:150`, CLN-46); the toe dot is likely the splinter's head (`js/clinic/heal/games/foot.js:263`, to confirm) | Clinic decision 4; the toe dot found on a shot and removed |
| P9 | 2:0:39-0:57 | "the move on to the next stage button needs, similarly, making much nicer and making more consistent with how it is done in the cook game. I think there's earlier feedback on this as well, it just needs to apply to this game mode as well" | every heal game | The shared round tick (`js/clinic/kit.js:1249`, `js/clinic/heal/host.js:447`) | The same go-on button as Cook's (SH-106) |
| P10 | 1:17:54-19:01 | "her feet have a drop shadow underneath them, so it looks like her feet aren't resting on the wooden stool ... I'm not sure if that was the intention"; "the doctor has a drop shadow underneath his feet in one of the diagnosed games ... looks like he's floating ... or ... the call them in for the waiting room ... positioned badly relative to the background"; "log it as a point if I don't come back to it, remind me" | diagnosis, waiting room | `js/clinic/kit.js:148` one shadow per measured foot: the seated girl's falls on the floor under dangling feet; the doctor's shows on views with guessed feet | Her shadow under the stool when seated; his only from measured feet; each view re-placed on its floor line |
| P11 | 1:23:22-24:19 | "the zoom in animation on the teeth needs to be much better ... the cavities look like they went outside of the teeth area ... it was like two big jumps"; "nicely smoothly zoom in and zoom out ... multiple artwork steps or ... an upscaled high resolution version ... suggest to me what to do" | every close-up (tooth seen) | `js/clinic/heal/games/tooth.js:421` zooms the mouth art, then swaps to a code-drawn tooth picture; zoom-out snaps (`js/clinic/heal/games/tooth.js:437`) | Clinic decision 7 |
| P12 | 1:0:23-0:41 | "I thought we made artwork for the dropper ... needs to be a lot more photorealistic. As does the syringe, in a similar kind of art style as the plasters and the packets" | boing | The machine is the old flat `heal-v3/drop-machine.webp`; the syringe is code rects (`js/clinic/heal/games/boing.js:147`) though sheets exist | Wire the syringe sheets; a new machine in the art run |
| P13 | 1:0:41-0:56 | "the dropper machine needs to be smaller, the syringe needs to be a little bit smaller, and the items on the right hand side need to be larger" | boing | `js/clinic/heal/games/boing.js:126` machine 50+56n x 172; syringe 66x168 (`js/clinic/heal/games/boing.js:148`) | Machine about 0.75, syringe 0.85; tools as P1 |
| P14 | 1:0:56-1:09 | "they shouldn't look like drops in the syringe, they should just fill the syringe with liquid corresponding to the colour of the dropper" | boing | Teardrop pictures stacked one per slot (`js/clinic/heal/games/boing.js:170`) | A liquid level in the barrel, the dropper's colour |
| P15 | 1:1:09-2:04, 1:3:39-4:04 | "right next to the crook of the arm ... the items don't actually go on top of it ... maybe one fifth of the way up the bicep, central to the arm ... you don't need to have the crazy boing animation"; "You don't see the needle go in ... a little puff ... mist and sparkles"; "the syringe should place itself above the arm once you've filled it, before you press the plunger"; "I don't think we need the countdown"; "the stars and the hearts aren't terrible, but we don't need the whole syringe to move left and right violently" | boing | Spot at (300, 395) (`js/clinic/heal/games/boing.js:107`); fly-in, 5-3-1 count-down, squash, flinch (`js/clinic/heal/games/boing.js:300`) | Spot a fifth up the bicep, central; syringe above the arm once filled; a puff; no count-down, no squash; stars and hearts stay |
| P16 | 1:2:12-2:27 | "when you clean the arm, you should be cleaning it with the cloth, not the item inside the packet, not the outside of the packet" | boing | The in-hand wipe is the sachet (`js/clinic/heal/games/boing.js:360`); cloth art exists | The cloth in hand; the packet stays in the strip |
| P17 | 1:2:27-2:37 | "The game doesn't tell you which colour drops to put in there. I know there's no Kutchi for it at the moment, but there should be an English placeholder. It needs to tell you which colours" | boing L1 | L1 is colourless by design (`js/clinic/heal/games/boing.js:61`, CLN-37) | Clinic decision 3 (grey English "to record" until Mum) |
| P18 | 1:3:14-3:39 | "the counter for 1, 2, 3 that was counting the drops was on the packet item, making it look like it was counting the number of packets. Now ... it's by the syringe" | boing | Two counters: the game's own at the syringe (`js/clinic/heal/games/boing.js:177`) and the host's, which falls back to the selected tool (`js/clinic/heal/host.js:454`) | One counter, on the syringe |
| P19 | 1:5:49-6:05 | "the colour of the plaster is not specified ... If we're not specifying the colour ... there should just be one plaster ... This game is about colours, no? So it should specify the colour of the plaster" | boing | The plaster row has no colour; any is accepted (`js/clinic/heal/games/boing.js:74`) | Clinic decision 3 |
| P20 | 1:7:17-9:58 | "It's incredibly boring, actually ... There's nothing really to do ... I don't even know how educational it is"; "give me some suggestions on how to make this game more fun ... swipe mechanics and match mechanics and spot the difference"; "which language elements we can incorporate"; "any other games like this where you have to fix injuries, hospital games ... learn from them"; "knee surgery? ... broken bones ... open heart ... connect up the valves"; "send an agent to do a bit of research ... if we can't make this game mode better, do we replace it" | scrape | not code: design: one verb a step (`js/clinic/heal/games/cut.js:560`) | Clinic decision 1 |
| P21 | 1:10:06-10:40 | "the tweezers aren't cut out nicely ... along the bottom"; "they don't grab the blobs correctly ... not one prong in front and behind ... the far side of the prong just floats in air" | ear | One closed tweezers picture over the blob (`js/clinic/heal/games/ear.js:536`); the open art is unused | Back prong under the blob, front prong over it; re-cut |
| P22 | 1:10:40-10:56 | "change the bin to a medical ... kidney-shaped metal tray ... I might have gone back on that one from a previous decision, but I think it'll look better now" | ear | `js/clinic/heal/games/ear.js:172` a steel bin | A kidney tray (art run) |
| P23 | 1:14:38, 1:16:56-17:03 | "the thermometer is also not cut out correctly"; "it also looks like a cartoon thermometer ... it should be a photorealistic one" | fever | The mouth thermometer is code rects (`js/clinic/heal/games/fever.js:620`); the strip's glass cut is poor | One photo thermometer (art run), both places |
| P24 | 1:14:43-15:06 | "I'm sure I gave this a previous feedback, the fan is just wrong ... I'm looking at the bottom of the fan but the fan is on the ceiling ... why that wasn't added to the art list" | fever | `js/clinic/heal/games/fever.js:198` tilts the blades as if seen from above | A ceiling fan seen from below (art run); the tilt flipped |
| P25 | 1:15:06-16:09 | "these items are just floating about ... can you not see this, it's really frustrating ... the hot water bottle ... just floating in the air to the top right of the table"; "put them on the bed with her ... lying on the bed ... two or three to that one, one or two to the left, one or two to the right ... resting on a solid surface" | fever | One row at y 0.455 not on any surface (`data/clinic/heal/fever.json:1` room.at) | Items lying on the bed around her, with contact shadows |
| P26 | 1:16:09-16:32, 1:17:03-17:14 | "I pressed the fan and then the girl said I'm okay ... but then it switched to being too cold, so she shouldn't have said that ... until she's feeling the correct temperature"; "same thing ... then became too hot again ... that needs fixing at all points" | fever | `js/clinic/heal/games/fever.js:800` closes the moment the reading touches green and she says "just right" (`js/clinic/heal/games/fever.js:754`) while the swing carries it on | Clinic decision 5 |
| P27 | 1:16:32-16:56 | "the thermometer doesn't sit in her mouth, it's sitting on her bottom lip ... when her face changed ... the thermometer didn't move with it" | fever | Drawn at fixed body coordinates (`js/clinic/heal/games/fever.js:620`); the `mouth` anchor exists unused (`js/clinic/figure.js:596`) | Place by the mouth anchor on every face change |
| P28 | 1:17:14-17:24 | "for hot, the little sweat icon should be red to indicate heat" | fever | Blue (`js/clinic/heal/games/fever.js:634`) | Red token for hot; the snowflake stays |
| P29 | 1:17:24-17:54 | "I don't know how this game mode ends now ... she says she's feeling okay so I don't know ... you need to tell me how it's gonna end properly" | fever | not code: design: rounds end after 3-4 swings (`js/clinic/heal/games/fever.js:45`), no ending | Clinic decision 5 |
| P30 | 1:19:01-20:22 | "it's not bad the bandaging now, but I think it needs to be a photorealistic bandage ... the bandages still don't go to the edge of the knee sometimes ... have a go on level three, do it eight times ... zoom in"; "it doesn't match the photorealism ... of the trouser"; "you need artwork for this ... do a bit of research ... tell me what would be best"; "this game hasn't ended now, but that's fine" | knee | Each turn is a code ribbon ending at its anchor dots inside the skin (`js/clinic/heal/games/knee.js:243`) | Ends run past the anchors (the mask trims); a tileable crepe-bandage band (art run) laid in code |
| P31 | 1:20:22-21:08 | "the toothbrush ... a little bit twisted ... the bristles point to the top right ... the back of the handle ... also facing the top right"; "first make sure you understand what I'm saying visually ... so that you can yourself diagnose it ... write the right prompt and evaluate the outcome" | tooth | The brushing art turned 38 degrees and squashed 0.8 (`js/clinic/heal/games/tooth.js:196`); to see on a shot | A new brush picture, bristles to the teeth, handle out of the mouth, no rotation (art run) |
| P32 | 1:21:08-22:06 | "a code-written white line that just goes from the drill into the filling area, which removes the immersion"; "have the tip of the drill go on top of the filling area ... centered in the cavity and the cavity fills from the middle" | tooth | The `ribbon` path (`js/clinic/heal/games/tooth.js:338`); the tip fixed at (400, 222) (`js/clinic/heal/games/tooth.js:328`) | No line; the tip on the cavity's centre |
| P33 | 1:22:06-22:27 | "the button ... it's right at the bottom ... the middle of the button should be in line with the middle of the progress bar and both should be centered between the bottom of the tooth and the bottom of the screen" | tooth | Button y 440, gauge middle y 430 (`js/clinic/heal/games/tooth.js:341`, `:313`) | Both on one line, midway |
| P34 | 1:22:27-22:57 | "the progress bar ... could look better than the current code drawn one ... the speedometer for the dial game, that looks really good ... use design elements from that" | tooth (every gauge) | Flat rects (`js/clinic/heal/games/tooth.js:314`) | One shared gauge from Cook's daal dial |
| P35 | 1:22:57-23:22 | "the game stopped early when I kept pressing ... if I filled too much ... it should let me get it wrong ... does it empty the filling and make you redo it?" | tooth | `js/clinic/heal/games/tooth.js:684` stops at the top and closes the step (`js/clinic/heal/games/tooth.js:696`) | Clinic decision 6 |
| P36 | 1:24:19-24:29 | "the teeth, and now I'm playing the eye game, feel a little bit too zoomed in ... zoom out a little bit ... it's a bit intimidating" | tooth, eye | `js/clinic/heal/host.js:194` push-in from camera.size 230/240 | A step less zoom |
| P37 | 2:0:00-0:30 | "the drops need to be more realistic, photorealistic drops, and the bottle ... isn't cut out nicely at all ... the top left of the image" | eye | A code-drawn drop (`js/clinic/heal/games/eye.js:232`); the bottle a soft glass cut | Drop art (art run); the bottle re-cut (P7) |
| P38 | 2:0:59-1:32 | "add some more complexity to this for level 3 ... even by level 2, start picking drops. A certain number of drops in the left eye and a certain number of drops in the right eye ... build up left and right combinations" | eye | One eye, 1-3 drops at every level (`js/clinic/heal/games/eye.js:41`) | Clinic decision 8 |
| P39 | 2:1:32-5:37 | "the board ... all needs massively improving"; "put a background on the right-hand side ... up on the wall ... slightly blurred ... less bare and barren"; "the board looks like it's code made ... render the whole thing in one image, an eye test board sitting on an optician's wall ... code draw everything that goes onto the board"; "take out those lines"; "one, two, then three, then four ... right now one, then two, then two, then three"; "do some research, have a look at some eye test boards"; "take away the eye icon"; "in the future put some other items on this, not just food" | eye | The chart is code (`js/clinic/heal/games/eye.js:386`), with ruled lines (`:433`), an eye icon (`:392`) and rows 1-2-2-3 (`js/clinic/heal/games/eye.js:41`) | Clinic decision 8; non-food items later (idea) |
| P40 | 2:5:37-6:13 | "the items are tomato and orange and milk, but she's saying tomato, limu, which is lemon, and dudh, so I'm pressing no, because an orange, not a lemon. And you're marking it as the incorrect answer, when it is the correct answer" | eye | *limu* (`fru-02`) is drawn with `lemon-half.webp`, a golden-orange half that reads as an orange (`js/clinic/heal/scene.js:118`); the word is right, the picture wrong | Clinic decision 9 |
| P41 | 2:6:13-6:40 | "why did we choose this foot? ... there was a better foot where the toes were more realistic ... oh it's fine, it doesn't matter" | foot | not code: art choice (`data/clinic/heal/foot.json` art.sole) | None (his "it's fine") |
| P42 | 2:7:03-7:25, 2:10:54-12:24 | "the animation for clearing the foot is terrible ... a colored, coded jet, and the items don't clear or wash away nicely ... think about how I've done it elsewhere"; "the cleaning off the dirt part of the game could be a bit more interesting"; "like the plaster one ... you have to put the cursor over specific parts of the dirt and the water clears off those parts ... go around the whole foot" | foot | Each jug clears a random share (`js/clinic/heal/games/foot.js:196`); a coded splash (`js/clinic/heal/games/foot.js:199`) | The scrape's wash: move the water over each patch |
| P43 | 2:7:28-7:48 | "the plaster that goes onto the foot isn't a photorealistic plaster, it's a coded one. It should be the photorealistic plaster that's in the item box" | foot | Two code rects (`js/clinic/heal/games/foot.js:266`) | The photo plaster |
| P44 | 2:7:48-8:21 | "the outside of the foot isn't cut out that well"; "the foot kind of floats in the air ... the ankle ... just stops dead ... connected ... or blow it out into the background ... so it doesn't look like a cut-out foot floating" | foot | The sole art ends at a straight cuff (`data/clinic/heal/foot.json` art.place; `js/clinic/heal/games/foot.js:140`) | The leg fades off the edge (an edit of the sole, art run) |
| P45 | 2:8:25-10:46 | "the channels ... we don't really want to show the foot cut open"; "an irritated raised red translucent channel and you see the splinter traveling inside of it"; "the gameplay part of it is fun, but ... some coded, like 2000-level snake type game on it"; "I love to see the different pathways"; "build the pathways in code by using a repeatable, very tileable visual block ... drawn by ChatGPT ... and the splinter as well, that needs artwork" | foot | Plain strokes (`js/clinic/heal/games/foot.js:244`); a brown stroke for the splinter (`:261`) | A tileable channel block and a splinter (art run), laid in code along the paths |
| P46 | 2:11:03-11:31 | "when you hit the edge ... the foot should vibrate a little and it should say ow ... a little red flash" | foot | Says ow and rings red (`js/clinic/heal/games/foot.js:396`); the foot doesn't move | A small shake and a soft flash |
| P47 | 2:12:24-13:17 | "It should be a clean cotton bud with nothing on it. Then when it ... hits the blob, the cotton bud ... should have the colour of the blob ... before it was always just green, even if it was a blue dot" | taste | One bud picture with green baked in (`js/clinic/heal/games/taste.js:254`) | A clean bud; its tip takes the touched colour |
| P48 | 2:13:17-13:45 | "all the artwork for the cooking thing needs to be better ... a metal cup, but it's got a drop shadow, but it's sitting on the surface"; "Is the metal cup the right thing ... let me know if there's something else that makes more sense" | taste | `items-v2/tumbler.webp` on a code tray with a black ellipse (`js/clinic/heal/games/taste.js:288`) | Clinic decision 10 |
| P49 | 2:13:48-14:05 | "the filling animations, there's a lot of stuff we can just take from the cook game ... follow the principle of the cook game ... the chai game" | taste | One clipped ellipse moving up (`js/clinic/heal/games/taste.js:315`) | Cook's chai fill, shared |

## 3. Regression rows (added to `docs/process/regressions.md` the same day)

Reopened: CLN-135 (P8), CLN-105 (P24, P25, P27). Widened (open already): SH-99 (P5, the clinic too), SH-106 (P9, the clinic too).

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| SH-112 | "Do a review of all of these item boxes everywhere to make sure they're the right size, which is bigger": the tool strip items "too small compared to the whole scene. It's not obvious what they are" (boing, fever, foot) | **open** | eye: every tool strip, both games, 800x360 and 1366x768 | P1 |
| SH-113 | Face circles: "all the characters where you just see a circle of their face need to be zoomed in by the same amount" (the doctor's "very zoomed out"); "have a go first, and then do a visual check yourself, and then adjust manually" | **open** | eye: every face circle, both games, side by side | P4 |
| SH-114 | Replay "for maybe all game modes across both games": "they should just read out starting from the remaining steps" (`js/clinic/kit.js:1075` replays ticked rows) | **open** | ear: ear L3 replay after two steps; every game | P6 |
| SH-115 | Cut-outs: "We built a tool to cut these out and test them, so this should all be picked up"; "Please understand why these are slipping through and make the fix to the tools" (the eye bottle, the foot's toes, the tweezers, the thermometer) | **open** (clinic decision 11) | auto: a pixel check on every shipped cut (grey share, holes, rim, cream composite) | P7 |
| SH-116 | Told before, still there: "I've told you this once, I don't know why you've not recorded this"; "why that wasn't added to the art list"; "can you not see this, it's really frustrating ... why you can or can't see this"; "We built a tool to cut these out and test them" | **open** | auto: `/feedback` searches the archive for every point and reopens what came back; `/review` judges a shot of every told-before row | P8, P24, P25, P7 |
| CLN-159 | "In the left-hand panel, on the bottom left, there's what looks like code ... mounted Boing L1 side ... seat ... tray ... apparent on all these game modes" (the lab page's log) | **open** | eye: the heal lab without `?debug=1` and the real clinic page: no log, every game | P2 |
| CLN-160 | Ear L3: "there's two cards ... shouldn't they all be part of the same sequence ... review all these side cards and make them similar to cook" (`js/clinic/kit.js:783`) ; "I didn't think that was the new agreed-upon style ... if we came up with a new one, let me know" (answered: it is the agreed shared sequence, §6) | **open** | auto: one sequence box per heal-game card, every game and level; eye: each beside Cook's card | P3 |
| CLN-161 | "It needed me to press the cloth twice, but it wasn't in the instructions ... all the frequencies has to be written down. And audible as well" (the taught round drops counts, CLN-118) | **open** (Zafar, 18 Oct; clinic decision 2) | auto: every count a step needs is on the card and said, every round | P5 |
| CLN-162 | "Her feet have a drop shadow underneath them ... not resting on the wooden stool"; "the doctor has a drop shadow underneath his feet ... floating ... positioned badly relative to the background" (diagnosis or the waiting room call-in); "log it as a point ... remind me"; "I'm not sure if that was the intention" (she dangles: answered §6) | **open** (which game he floats in: he will say when he plays them; the reminder is `docs/questions.md`) | eye: fever (her feet on the stool), diagnosis and the waiting room, every view | P10 |
| CLN-163 | "The zoom in animation on the teeth needs to be much better ... two big jumps"; "nicely smoothly zoom in and zoom out"; "multiple artwork steps or ... an upscaled high resolution version"; "from far the cavities look like they went outside of the teeth area" | **open** (clinic decision 7) | eye: every close-up's zoom as frames; at the far view the cavities sit inside the teeth, every level | P11 |
| CLN-164 | Boing: the dropper "needs to be a lot more photorealistic. As does the syringe, in a similar kind of art style as the plasters and the packets" ; "I can see some of it in my downloads, maybe not all of it" | **open** (the machine landed in s07, `sources/art/s07/dm1-*`, `dm2-*`, unwired; the syringe sheets exist) | eye: boing L1 | P12 |
| CLN-165 | Boing: "the dropper machine needs to be smaller, the syringe ... a little bit smaller, and the items on the right ... larger" | **open** | eye: boing at 800x360 and 1366x768 | P13 |
| CLN-166 | Boing: "they should just fill the syringe with liquid corresponding to the colour of the dropper" | **open** | eye: boing, each drop | P14 |
| CLN-167 | Boing: "one fifth of the way up the bicep, central to the arm"; "you don't need the crazy boing animation"; "a little puff ... mist and sparkles"; "the syringe should place itself above the arm once you've filled it"; "I don't think we need the countdown"; stars and hearts stay | **open** | eye: boing's jab as frames | P15 |
| CLN-168 | Boing: "you should be cleaning it with the cloth, not the item inside the packet, not the outside of the packet" | **open** | eye: boing's wipe | P16 |
| CLN-169 | Boing: "The game doesn't tell you which colour drops to put in ... there should be an English placeholder" | **open** (clinic decision 3) | auto: the colour on the card and said at every level | P17 |
| CLN-170 | Boing: "the counter for 1, 2, 3 ... was on the packet item ... Now ... it's by the syringe" | **open** | auto: one counter in one place every round (on the syringe: our proposal, §6) | P18 |
| CLN-171 | Boing: "This game is about colours, no? So it should specify the colour of the plaster" | **open** (clinic decision 3) | auto: the plaster's colour on the card, said and judged | P19 |
| CLN-172 | Scrape: "It's incredibly boring ... nothing really to do ... I don't even know how educational it is"; "suggestions ... swipe mechanics and match mechanics and spot the difference"; "which language elements"; "hospital games ... learn from them"; "knee surgery ... broken bones ... connect up the valves"; "send an agent to do a bit of research ... do we replace it"; his limits: "What other knee games are there? There's knee"; "I'm not sure how that would be educational in terms of language ... not that advanced that we would even know the vocabulary" | **open** (research and options owed to Zafar, clinic decision 1; nothing replaced without his yes) | eye: the new design, played | P20 |
| CLN-173 | Ear: "the tweezers aren't cut out nicely"; "not one prong in front and behind ... the far side of the prong just floats in air" | **open** | eye: the ear grab as frames | P21 |
| CLN-174 | Ear: "change the bin to a medical ... kidney-shaped metal tray ... We might already have the artwork" | **open** (it exists: `assets/clinic/sheets/bin/bin-kidney-3q.webp`) | eye: ear | P22 |
| CLN-175 | Fever: "the thermometer is also not cut out correctly"; "it looks like a cartoon thermometer ... it should be a photorealistic one" | **waiting on art** (s08b) | eye: fever, strip and mouth | P23 |
| CLN-176 | Fever: "the girl said I'm okay ... but then it switched to being too cold, so she shouldn't have said that"; "that needs fixing at all points" | **open** (clinic decision 5) | auto: "just right" only after 2 s in the green | P26 |
| CLN-177 | Fever: "the little sweat icon should be red to indicate heat" | **open** | eye: fever, hot | P28 |
| CLN-178 | Fever: "I don't know how this game mode ends ... you need to tell me how it's gonna end properly" ; the knee too: "again this game hasn't ended now ... it's okay" | **open** (clinic decision 5) | eye: fever's and the knee's end, all levels | P29 |
| CLN-179 | Knee: "it needs to be a photorealistic bandage"; "the bandages still don't go to the edge of the knee sometimes ... level three, do it eight times ... zoom in"; "it doesn't need to be coded, you need artwork for this, don't know, you're gonna have to tell me, do a bit of research ... tell me what would be best" | **open** (recommendation §6: an art band laid by code; s08b BD1 draws the band) | eye: knee L3 eight wraps, zoomed | P30 |
| CLN-180 | Tooth: "the bristles point to the top right ... the back of the handle ... also facing the top right ... twisted"; "make sure you understand what I'm saying visually ... write the right prompt and evaluate the outcome" | **waiting on art** (s08b) | eye: the brushing view | P31 |
| CLN-181 | Tooth: "a code-written white line that just goes from the drill into the filling area"; "the tip ... centered in the cavity and the cavity fills from the middle" | **open** | eye: the fill as frames | P32 |
| CLN-182 | Tooth: "the middle of the button should be in line with the middle of the progress bar, and both centered between the bottom of the tooth and the bottom of the screen" | **open** | auto: button and gauge centres on one line | P33 |
| CLN-183 | Tooth: the progress bar "could look better ... the speedometer for the dial game, that looks really good ... use design elements from that" | **open** | eye: the gauge beside Cook's dial | P34 |
| CLN-184 | Tooth: "it should let me get it wrong ... does it empty the filling and make you redo it?" | **open** (clinic decision 6) | eye: tooth, overfill and redo | P35 |
| CLN-185 | "The teeth, and ... the eye game feel a little bit too zoomed in ... it's a bit intimidating" | **open** | eye: tooth and eye at 800x360 and 1366x768 | P36 |
| CLN-186 | Eye: "photorealistic drops, and the bottle ... isn't cut out nicely at all" | **waiting on art** (the drop, s08b; the bottle re-cut, SH-115) | eye: eye L3 | P37 |
| CLN-187 | Eye: "by level 2, start picking drops. A certain number of drops in the left eye and a certain number in the right eye ... left and right combinations" | **open** (clinic decision 8) | auto: L2+ cards ask a count per eye | P38 |
| CLN-188 | Eye chart: "a background on the right-hand side ... up on the wall"; "an eye test board sitting on an optician's wall ... code draw everything that goes onto the board"; "take out those lines"; "one, two, then three, then four"; "do some research"; "take away the eye icon"; "we want it to take up most of the screen" | **open** (rows 1-2-3-4, no lines, no icon, the board filling most of its side now; the wall and board picture wait on s08b) | eye: the chart, every level | P39 |
| CLN-189 | Eye: "she's saying tomato, limu, which is lemon ... I'm pressing no, because an orange, not a lemon. And you're marking it as the incorrect answer" (`lemon-half.webp` reads as an orange) | **open** (clinic decision 9) | auto: each chart picture's colour class matches its word | P40 |
| CLN-190 | Foot: "the animation for clearing the foot is terrible ... a colored, coded jet"; "the cleaning ... could be a bit more interesting"; "like the plaster one ... put the cursor over specific parts of the dirt" | **open** | eye: foot's wash as frames | P42 |
| CLN-191 | Foot: "the plaster ... isn't a photorealistic plaster, it's a coded one. It should be the photorealistic plaster that's in the item box" | **open** | eye: foot's plaster | P43 |
| CLN-192 | Foot: "the outside of the foot isn't cut out that well"; "the foot kind of floats ... the ankle ... just stops dead ... blow it out into the background" | **waiting on art** (s08b, an edit of the sole) | eye: foot at 800x360, 1366x768, 1366x1024 | P44 |
| CLN-193 | Foot: "an irritated raised red translucent channel and you see the splinter traveling inside"; "a 2000-level snake type game"; "a repeatable, very tileable visual block ... drawn by ChatGPT ... the splinter as well"; "we don't really want to show the foot cut open"; "you have to make it translucent"; "give me some suggestions" (answered §6) | **waiting on art** (s08b SP1) | eye: foot, every level's paths | P45 |
| CLN-194 | Foot: "the foot should vibrate a little and it should say ow ... a little red flash" | **open** | eye: foot, a touch on the edge | P46 |
| CLN-195 | Taste: "a clean cotton bud with nothing on it ... when it hits the blob ... the colour of the blob" | **open** | eye: taste L3, a blue spot | P47 |
| CLN-196 | Taste: "a metal cup, but it's got a drop shadow, but it's sitting on the surface"; "Is the metal cup the right thing?" | **waiting on art** (clinic decision 10; s08b) | eye: taste | P48 |
| CLN-197 | Taste: "the filling animations ... take from the cook game ... the chai game" | **open** | eye: taste's fill | P49 |
| KEEP-17 | Liked, 18 Oct: boing's stars and hearts ("actually isn't terrible"); the knee bandaging ("not bad now ... looks much better"); the foot's pathways ("I love to see the different pathways") and its play ("the gameplay part of it is fun"); Cook's daal dial ("looks really good"); fever's "cold snowflake icon, which is good" | keep | eye: each | P15, P30, P45, P34 |

Reopened and widened rows (his new words added):

| ID | Issue (his words added) | Status | Check | Source |
|---|---|---|---|---|
| CLN-135 | 18 Oct: "on her earlobe ... a cartoon-looking purple blob ... it stays there the whole time ... removed"; "two pink dots ... please remove them permanently"; the foot: "a random purple dot on the big toe" | **reopened** (Zafar: remove for good, clinic decision 4) | eye: ear L1 and L3, foot | P8 |
| CLN-105 | 18 Oct: "the fan is just wrong ... I'm looking at the bottom of the fan but the fan is on the ceiling"; "these items are just floating about ... put them on the bed with her, just put it on the bed behind her ... two or three ... one or two to the left, one or two to the right, lying on the bed ... resting on a solid surface"; "the thermometer doesn't sit in her mouth, it's sitting on her bottom lip ... didn't move with it" | **reopened** (the fan waits on art, s08b) | eye: fever at every level and face | P24, P25, P27 |
| SH-99 | 18 Oct, the clinic too: "all the frequencies has to be written down. And audible as well" | **open** | as before | P5 |
| SH-106 | 18 Oct, the clinic too: "the move on to the next stage button ... much nicer ... more consistent with how it is done in the cook game" | **open** | as before | P9 |

## 4. Coverage: every transcript line → a point

| Lines | Point |
|---|---|
| 1:0:01 | chatter |
| 1:0:09–1:0:20 | P1 |
| 1:0:23–1:0:41 | P12 |
| 1:0:41 | P13 |
| 1:0:56 | P14 |
| 1:1:09–1:2:04 | P15 |
| 1:2:12–1:2:15 | P16 |
| 1:2:27–1:2:37 | P17 |
| 1:2:37–1:3:03 | P2 |
| 1:3:14–1:3:39 | P18 |
| 1:3:39–1:4:04 | P15 |
| 1:4:04–1:4:32 | P3 |
| 1:4:32–1:5:35 | P4 |
| 1:5:40 | chatter |
| 1:5:49–1:6:05 | P19 |
| 1:6:10–1:6:24 | P3 |
| 1:6:24–1:6:33 | P2 |
| 1:6:36–1:6:59 | P5 |
| 1:7:02–1:7:16 | chatter |
| 1:7:17–1:9:58 | P20 |
| 1:10:01 | chatter |
| 1:10:06–1:10:40 | P21 (1:10:15 also P7) |
| 1:10:44–1:10:56 | P22 |
| 1:11:00–1:11:57 | P8 |
| 1:12:00–1:13:26 | P6 |
| 1:13:26–1:14:14 | P3 |
| 1:14:23–1:14:38 | P1 (1:14:38 also P7, P23) |
| 1:14:43–1:15:06 | P24 |
| 1:15:06–1:15:51 | P25 |
| 1:16:09–1:16:32 | P26 |
| 1:16:32–1:16:52 | P27 |
| 1:16:56 | P23 |
| 1:17:03 | P26 |
| 1:17:14 | P28 |
| 1:17:24–1:17:45 | P29 |
| 1:17:54–1:19:01 | P10 |
| 1:19:01–1:20:22 | P30 |
| 1:20:22–1:21:08 | P31 |
| 1:21:08–1:22:06 | P32 |
| 1:22:06–1:22:24 | P33 |
| 1:22:27–1:22:57 | P34 |
| 1:22:57–1:23:18 | P35 |
| 1:23:22–1:23:51 | P11 |
| 1:24:19–1:24:29 | P36 |
| 2:0:00 | P37, P7 |
| 2:0:30–2:0:31 | P7 |
| 2:0:39–2:0:57 | P9 |
| 2:0:59–2:1:24 | P38 |
| 2:1:32–2:4:39 | P39 |
| 2:4:41 | P39 |
| 2:4:57–2:5:31 | P39 |
| 2:5:37–2:6:09 | P40 |
| 2:6:13–2:6:37 | P41 |
| 2:6:40–2:6:59 | P7 |
| 2:7:03–2:7:25 | P42 |
| 2:7:28 | P43, P1 |
| 2:7:48 | P44, P7 |
| 2:7:53–2:8:21 | P44 |
| 2:8:25–2:10:37 | P45 |
| 2:10:38 | chatter |
| 2:10:46 | P8 |
| 2:10:54 | P42 |
| 2:11:03–2:11:31 | P46 |
| 2:11:57–2:12:18 | P42 |
| 2:12:24–2:13:13 | P47 |
| 2:13:17–2:13:45 | P48 |
| 2:13:48–2:14:05 | P49 |

Lines: 322; in a point 313; chatter 9; unmapped 0.

Two readers: mine and a fresh Fable agent on the transcripts and §3: 5 missing, 8 weakened, 3 overclaims, 9 questions untracked; all fixed (a process row SH-116; CLN-160, 163, 164, 174, 105, 162, 159, 188, 193, 172, 179, 170, 178 and KEEP-17 widened or corrected; the eye's non-food items in `docs/ideas.md`; every question answered in §6). After the fixes: 0 unmapped, 0 weakened.

## 5. Old feedback coming back

| Row | What came back | Why it slipped |
|---|---|---|
| CLN-135 (P8) | The ear's pink blob | Recorded on 6 Oct as "cleared at the end", not "remove for good"; the spots are the bud's obstacle by design (CLN-46) |
| CLN-105 (P24, P25, P27) | The fan, floating items, the thermometer at her mouth | Built from a code reading: the fan's tilt sign and the items' row were never judged on a shot, and the thermometer was never re-placed when her face swaps |
| SH-106 (P9) | The go-on button | Written for Cook only on 17 Oct |
| SH-116 (P8, P24, P25) | "Why you can or can't see this" | Feedback rows were marked built from a code reading or a one-game check (CLN-105, CLN-135), and nobody looked at a picture of each again |
| SH-115 (P7) | Bad cut-outs | The checks never look at pixels on shipped files; "check every cut zoomed on cream" was a manual rule |

## 6. Decisions for Zafar

Yes to all except ... Each has a recommendation.

1. **The scrape (P20, CLN-172).** I research hospital and injury games and bring 3 options with their Kutchi needs (a richer scrape, a swap, or a splint game), within his limits (not another knee game; words Mum can give). Recommend: a Fable design pass (about $3-5) when tokens allow; nothing replaced without his yes.
2. **Counts in the first round (P5, CLN-161; reverses CLN-118).** Recommend yes: every count a step needs is written and said in every round, the first included.
3. **Boing's colours (P17, P19, CLN-169, CLN-171).** Recommend yes: the drops' and the plaster's colour said and on the card at every level, grey English "to record" until Mum.
4. **The ear's pink spots (P8, CLN-135).** Recommend yes: removed for good; the bud no longer has to miss them (CLN-46 goes).
5. **Fever (P26, P29, CLN-176, CLN-178).** Recommend: "just right" only after 2 s in the green with no tap; the end: on the last "just right" she smiles, says she feels better, the thermometer reads normal, then the go-on button. Her dangling feet were not meant: her shadow goes under the stool.
6. **Tooth overfill (P35, CLN-184).** Recommend: overfilling shows red, the filling smooths back to the line and he fills again; the first go is what's scored.
7. **Zooms (P11, CLN-163).** Recommend: one high-resolution close-up per game (upscaled on our side, no new drawing) and one smooth camera move in and out, the cavities drawn in that picture's own place.
8. **The eye (P38, P39, CLN-187, CLN-188).** Recommend yes: from L2 a count for each eye (left and right, recorded for diagnosis); rows 1-2-3-4, no lines, no eye icon now; the optician's wall and board from the art run.
9. **The lemon (P40, CLN-189).** Recommend: Cook's whole yellow lemon now, the new one from the art run; an orange only when Mum gives its word.
10. **The taste cup (P48, CLN-196).** Recommend a clear glass: the colour mixing is the point, and steel hides it.
11. **Cut-outs (P7, SH-115).** Recommend yes: a pixel check on every shipped cut (grey share, holes, rim, a cream composite), steel and glass re-keyed, the failures re-cut (Sonnet, about $3).
12. **Answers to his questions:** the pills-on-a-stick card *is* the agreed shared sequence (SEK-03, SEK-17, CLN-94); ear L3's second card is a bug. The foot's wash is code (the scrape's wash reused) with drawn water. The splinter channels: a drawn tileable welt laid in code, as he guessed. The knee bandage: a drawn crepe band laid by code along each turn, its ends run past the anchors. The boing counter: one, on the syringe.

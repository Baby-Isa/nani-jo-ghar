// The contract checks (decision 75, rule C19): Zafar's "everywhere" rules, measured on every flow the sandbox plays, from what
// was on screen (the contract probe, lib/contract-hook.mjs) and what was heard (the sound hook, lib/sound.mjs), never from the
// game's code, so they hold whatever the shared host becomes. One check per contract item:
//
//   contract-1 popup     every play phase that gives an order opens with the shared request pop-up, read out, then folds
//                        into the sidebar
//   contract-2 moves-on  where the outcome is obvious the game moves on by itself: no ✓, Next or stage button once the
//                        step's result is decided
//   contract-3 voice     every stage and game end stops all voice: no line starts or keeps playing after its stage ended
//   contract-4 bubble    every speech bubble sits above (or, without room, below) its speaker's head, never in a corner; S13-B2:
//                        every one is the kit's .cv-bubble (Conversations.bubble), never a game's own (#bubble, .cl-bubble)
//   contract-49 one-end   nothing inside the end screen (.njg-results) carries a game's own class (S13-B2: the receipt slot)
//   contract-5 badges    end-screen badges appear one, two, three in order
//   contract-6 old-art   no retired art drawn where a replacement exists (build/sandbox/data/retired-art.json)
//
// And the measurable halves of the other "every game" rows of docs/process/regressions.md (s04-f2; the rest of those rows are
// eye checks on the sprint check sheets):
//
//   contract-7 one-voice    one voice at a time: no two lines' clips sound over each other (PAN-04)
//   contract-8 highlight    one next-thing highlight at a time, in one colour: the stage's glows and every lit thing on a card (SH-53)
//   contract-9 closed-card  from L3 the card in the waiting room, the pharmacy and every heal game is open, its words blanked, never
//                           folded (SH-110, Zafar 26 Oct, overrides CLN-114's closed card; each blanked row's speaker: contract-40)
//   contract-10 your-turn   the staged talkers face the player when it is the child's turn (SH-71); in the examination the doctor faces her (CLN-157)
//   contract-11 background  no background stretched out of proportion (PAN-14) or drawn low-res (ART-05)
//   contract-12 greyed      a ✓ / Next / stage button is hidden until usable, never shown greyed (SH-23)
//   contract-13 stale-ui    no reply pill from an earlier stage left on screen (CLN-06)
//   contract-14 talk        one talk animation: no bob bigger or faster than the shared one, no other talk animation (ART-18)
//   contract-16 english     no written English for the child: every text on screen is a lexicon form (loan: en included), a
//                           number, a to-record placeholder, the bulb's English or grown-ups' text (checks-to-build 4)
//   contract-19 counting    the counting rule: from L3 no number word written on a card (for a player who has heard the words:
//                           a "seen" profile; decision 57 writes a number the first times); from L2 no counting along aloud
//                           (a line that is only a number word after the stage's first tap) (checks-to-build 7)
//   contract-20 one-face    one face per person: no patient face circle while she stands on screen in full (decision 92),
//                           never two face circles or two cards of one person (R4; checks-to-build 8)
//   contract-18 card-rows   a card row ticks only within 1 s after the game logged that step closed (Lifecycle step-close for
//                           its key); no row changes its words mid-stage (the bulb's English aside) (checks-to-build 6)
//   contract-21 input-live  a real tap in the play area while a line is voiced, where the game expected one, is handed to the
//                           game (Lifecycle act) within 150 ms (E5; checks-to-build 20)
//   contract-22 once-whole  each Cook line said once (the same line not again within 10 s) and whole (no clip cut by another line) (PAN-04, PAN-16)
//   contract-23 item-word    an item's name on a tap only when nothing else is speaking, never at L3-L4, not again within 10 s (SH-94)
//   contract-24 help-ladder  no help line or glow before the idle time by level, counted from the last action (SH-60, SH-95)
//   contract-25 bulb-pulse   both bulbs pulse after 15-20 s stuck, never before (SH-96)
//   contract-26 opening      every word of a line said under the request pop-up has a sound: the opening is heard whole (LNG-16)
//   contract-34 go-arrow     every go-on (→ Next) button on screen shows the arrow (SH-106); S13-A2: every go-on, done and
//                            answer-pill button on screen is the kit's .njg-btn
//   contract-42 face-circle  every face circle of a person on screen is the kit's .njg-face, of one of three sizes, drawn at its
//                            token's width within 1 px (ART-08, S13-A2)
//   contract-44 one-finger   one finger on screen at a time, the kit's .ob-finger only; first-time help always has its finger
//                            (SH-130, S13-A2)
//   contract-35 card-ladder  Cook's card by level: open at L1-L2, the item words dotted at L3 and L4, never folded (SH-110, 26 Oct)
//   contract-36 step-call    Nani calls each step once as it opens, at every level (SH-110)
//   contract-37 decoys       decoys by level: 1, 2, 3, then 3 with a lookalike at L4 (CK-49)
//   contract-38 two-pages    the end screen has two pages in every game: the badges and the word review, never the steps page (SH-104)
//   contract-39 card-english the word card's English only while the word is supported (stage 1-2), then only when tapped open (SH-123)
//   contract-40 one-card     every order card on screen carries only the kit's classes (no game's own on it or its rows); SH-110:
//                            every blanked (dotted) row starts with its speaker (S13-B1)
//   contract-41 one-popup    the request pop-up on screen is the kit's (.njg-rq-card), never Cook's own #intro (S13-B1)
//   contract-50 one-tick     samosa: the card's rows tick together at the one tick, never a kind before its samosas are all made (SAM-24)
//   contract-70 slow-at-green  chai: "Slow kar" as the heat bar enters the green, never before it (CHAI-24; lib/contract-chai.mjs)
//   contract-71 once-each      chai: milk, water and tea go into a pan once each; a second tap adds nothing (CHAI-22)
//   contract-17 voice-src   on the store build (run.mjs --store) only clips Zafar marked OK sound: no device voice, no placeholder
//                           TTS, no unchecked or redo clip, no unknown audio (non-negotiable 10; checks-to-build 5)
//
// analyse(result, {retired, clip}) -> [{check, item, flow, level, size, state, shot, at, measured}]. A break is never
// ratcheted into the baseline: --check and --contract fail on any (exit 1).
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { lexiconWords } from "./evidence.mjs";
// contracts 45 and up: the day's frame (s09-frame), in a file of their own
import { DAY_CHECKS, check45, check46, check47, check48 } from "./contract-day.mjs";
// contracts 65 and up: the daal station (s08 w4A), in a file of their own
import { DAAL_CHECKS, check65, check66 } from "./contract-daal.mjs";
// contracts 70 and up: the chai tray (s08 wave 4B), in a file of their own
import { CHAI_CHECKS, check70, check71 } from "./contract-chai.mjs";

export const CHECKS = {
  "contract-19": { item: "counting", title: "the counting rule", how: "From level 2, no line that is only a number word (counting along) starts after the stage's first tap (a line with role countdown or laps, the daar stir's laps, is not counting along). Level 1 counts along and writes the number. (Its other half, no written number from level 3, went with SH-99: every number said is written, contract-30.)" },
  "contract-16": { item: "english", title: "no written English for the child", how: "Every texts sample (lib/contract-hook.mjs: each visible text node, tagged when it is a to-record placeholder, the bulb's English or grown-ups' text in the ? pop-up or a lab panel): a to-record placeholder passes until launch (Zafar, 14 Oct) and is a break on the store build (--store); every other text's words must be lexicon forms (data/lang/lexicon.json with its inflections, loan: en words, family clips: sandbox/lib/evidence.mjs lexiconWords) or numbers; any other word is a break, named with the words." },
  "contract-20": { item: "one-face", title: "one face per person", how: "Every faces sample (lib/contract-hook.mjs: the order cards' faces, the guide's face, a clinic close-up face, with whose they are; the cards' people; whether a clinic patient figure stands 85% on screen and a third of its height or more): in the clinic, a face circle other than the doctor's guide face while the patient stands in full is a break (decision 92: her circle only where she is off screen); anywhere, two face circles of one person (R4: the guide who is also the asker has one card with her face) or two cards for one person is a break." },
  "contract-22": { item: "once-whole", title: "each line said once and whole", how: "Cook's lines (the sound log, who \"cook\"): the same line (its words, case and marks aside) starting twice within 10 s of the child's time is a break (PAN-16; Cook's test speed shortens the game's waits, so 10 s / speed in the run, and a help line's, role howto, 10 s of the clock) unless the child asked for it (a tap on a card, the pop-up or a button within 0.7 s before, or a one-word line right after a tap) or the game opened a new step whose call it says again on purpose (Lifecycle step-call \"queued-again\": maani's Firai on both turns, MAA-15, Zafar 17 Oct); item words (contract-23) and counts (laps, countdowns, number words) are not judged here. On a #speed1 flow (a child's pace, where clip timing is real) a clip stopped 150 ms or more before its own end (the file's length) with no stop from the game near it (a voice stop, a stage end, a tap through the pop-up), by another line's clip starting over it, is a break (PAN-04)." },
  "contract-23": { item: "item-word", title: "an item's name only when nothing else speaks", how: "Lines tagged role item (js/cook/words.js Lang.popWord: an item's name as it is tapped or lands) that made a sound: at level 3 or 4 any is a break; one starting while another Cook line is being said (from its call to its end, or a clip of it sounding) is a break; the same item word again within 10 s is a break (SH-94, decision 1 of 17 Oct)." },
  "contract-24": { item: "help-ladder", title: "no help before the idle time", how: "Nani's help and the glow come only after the child has done nothing for the ladder's time by level (7, 8, 11, 15 s: data/cook.json calm.helpMs), counted from the LAST action (a real tap, the stage or the step opening). Three things are measured on every path but #mistake: the game's own help log (Lifecycle help, idle), a step line (role howto) said, and a picture's glow switching on (the sampler's hl). One earlier than the table is a break (SH-60, SH-95). A glow that comes with a rung of the onboarding kit (Lifecycle rung: the first-time box at once, chai's 5 s card; Zafar, 22 Oct, CHAI-32) is that help, not a break." },
  "contract-25": { item: "bulb-pulse", title: "the bulbs pulse when stuck", how: "The bulbs' pulse (Lifecycle bulb-pulse, js/shared/guide.js pulseBulbs) may not start before 15 s of no action; any stretch of no action of 21 s or more inside a play stage must have had the pulse start (SH-96: both light bulbs pulse after 15-20 s stuck)." },
  "contract-26": { item: "opening", title: "the opening line is heard whole", how: "Every Cook line said while the request pop-up is up: each of its words that is in the lexicon must have a sound, a family clip of that word or the device voice saying it (the sound log); a word that made no sound (the device voice's text thrown away by a cancel, no stand-in at all) is a break (LNG-16: \"I didn't hear the muke\")." },
  "contract-27": { item: "peek-whole", title: "the peek shows every word", how: "The side sample's peek (a card with the class peek: a tap on its small bulb opened it) and its dots (.dots, the dotted word '•••' of Lang.html's hide): any dotted word in a peeking card is a break (SH-98, Zafar, 17 Oct: 'certain words are hidden, which is pointless'). Numbers: contract-30." },
  "contract-28": { item: "one-bulb", title: "one bulb picture", how: "The bulbs sample (every shown .oc-look.bulb, .ng-bulb, .cl-bulb or #btn-bulb and the file it is drawn with: an <img>, a CSS background, or the flat inline svg): any bulb not drawn with assets/ui/results/icon-bulb.webp (the photo Nani's box uses) is a break, on Cook and the clinic alike (SH-100, Zafar, 17 Oct: 'let's make them all photorealistic')." },
  "contract-29": { item: "peek-time", title: "the peek lasts the level's time", how: "Each peek (the side sample's peek count from 0 to some and back) on a page whose card count and stage did not change: it must last the level's time from data (data/cook.json calm.peekMs, the clinic's Kit.PEEK_MS: 7 s at level 3, the same 3.5 s added to the others), judged as a child's time (Cook's test speed 3 shortens it; the clinic's is real time); under that less 450 ms is a break (SH-101)." },
  "contract-30": { item: "written", title: "everything said is written", how: "The card sample (everything written on the sidebar cards, shown or folded: row and headline words, count chips) against the lines said in the stage (the sound log, not item names on a tap, laps or count-downs): every number word (the lexicon's Num entries) a line says must be written on a card of that stage, and every English placeholder in its brackets ([red]); at every level and in every round, taught ones too (SH-99, CLN-161, CLN-169, CLN-171). One is the exception (Zafar, 19 Oct: 'we don't need to write one, only two or more'): a said one (hakro, hakri) whose item is written bare passes. Counting along the taps (role count) is a tally, not the order." },
  "contract-31": { item: "free-replay", title: "a replay is free and says what is left", how: "A help Cook counts (the hint sample: Cook.onHelp's kind) of kind replay is a break (SH-102: only seeing it written costs); and after a tap on a face (the card's replay) with rows already ticked (the rows sample), no line said in the next 7 s may be a ticked row's words (SH-114: a replay reads out the remaining steps)." },
  "contract-32": { item: "divider", title: "the review's divider leaves room", how: "The review sample (the word review's two halves, side by side: the wrong words' column and the right words' column, their widths and counts): with no wrong word the right words take 4/5 of the width (room for four right and one wrong, SH-103, Zafar, 17 Oct: 'a little bit more to the left'); the wrong half is as many units wide as it has words (1 to 3) against the right half's 4, so the divider moves over as wrong words grow. Not judged on a taught round (one group) or stacked on a portrait phone." },
  "contract-33": { item: "headline-size", title: "the order pop-up's headlines: one size, wrap first", how: "The heads sample (each headline of the order pop-up with its size, its full size from a bare clone of it, and its line count; settled 400 ms): two sizes on one pop-up, or headlines all on one line while shrunk under their full size, is a break (SH-107, Zafar, 18 Oct: 'it was better to have the bigger text'; only the order pop-up: everywhere else keeps shrink, then wrap, non-negotiable 9)." },
  "contract-17": { item: "voice-src", title: "only family voices on the store build", how: "On a run with --store (window.NJG_BUILD = \"store\", the packaged app's voice path) every sound the page played is classified against data/family-audio.json and data/cook-tts.json (lib/sound.mjs): anything but a family clip marked checked: ok (the device voice, a placeholder TTS file, an unchecked or redo clip, unknown audio) is a break. A line with no clip at all is the recording gap list, never silent." },
  "contract-18": { item: "card-rows", title: "card rows tick when their step closes", how: "Every rows sample (lib/contract-hook.mjs: each sidebar card row with its key, words and tick) against the shared lifecycle's step-close log (Lifecycle.note: the order card's tick path and the heal host, at their own millisecond, with the step's key): a row that turns ticked with no step-close for its key (any step-close for a row with no key) in the 1.1 s before is a break; a row whose words change while it stays in the same stage (not to or from a row with no letters, not under the bulb's English) is a break." },
  "contract-21": { item: "input-live", title: "input is live while a line plays", how: "Every real tap (trusted pointerdown) in the play area (not the sidebar, the pop-up or a ✓/Next button) while a line is being said (a clip of it sounding, or the line between its start and end in the sound log) and the game expected a tap, a pick or a drag: the shared lifecycle must log an act (Lifecycle.note from js/shared/host.js onAct, the heal host's input and Cook's play area: its canvas and its own controls, js/cook/flow.js) within 150 ms. None is a break (E5: input never waits for the voice)." },
  "contract-1": { item: "popup", title: "pop-up before play", how: "Splits the flow into stages (a Cook station from Cook.inStation, else the game host's stage) and finds each stage's first real tap in the play area. A stage that gives an order (a line said before that tap outside a pop-up, a new order card in the sidebar, or the first stage with a card) must have had the request pop-up (.njg-rq-open, Cook's #intro) on screen since the last stage ended; a line must start while it is up (read out) unless a tap closed it at once; within 2 s of closing an order card must show in the sidebar (folded). Nani's how-to step line and her 'pass me' (the game tags them howto / passme) are not orders (decision 80), nor is a card the game tags data-howto (the clinic send-off's goal-only card: the doctor asks on screen, in his bubble; CLN-140)." },
  "contract-2": { item: "moves-on", title: "moves on by itself", how: "Every ✓, Next or stage button seen on screen (.cl-go, #done-btn, a button reading ✓ or →, aria 'next'/'done') and every press of one is judged with what the game expected at that moment: if it expected only that button (the clinic between stages or kind 'button', a heal game's 'button' step, Cook clicking that selector), the step was already decided, so the button is a break. A ✓/Done that lets the child take things back until Done (non-negotiable 12) is not: Cook's count or 'more' step, an open count Cook steers its player to end with Done (expectation 'open': more stirs, folds or skewers still change it), an expectation that offers a take-back (undo), Cook's pictures still taking taps (live: chaat's bowl, where more taps still change the result), a heal game's count it reported uncapped (ctx.tally without capped: the child decides when it's enough, C10). A capped count (ctx.tally {capped}) that stopped taking input and still shows its ✓ is a break (decision 79). A button that starts the next part of the order (samosa's 'next kind', expectation choice) is the child's own move (decision 80)." },
  "contract-3": { item: "voice", title: "voice stops at every stage end", how: "Every clip's real start, length (the decoded buffer or the file's own length) and stop (ended, stop, pause, cancel) from the sound log; each belongs to the line (and so the stage) it was said for. A stage ends when the shared lifecycle logged its stage-end (Lifecycle.log, at its own millisecond; else the sampled stage change), so a line queued after the stop belongs to the next stage. A clip still sounding 250 ms after its stage ended, or started after it, is a break." },
  "contract-4": { item: "bubble", title: "bubble at the speaker's head", how: "Every speech bubble's box and tail (its ::after / ::before) against its speaker's head on screen: a Cook character's sprite (the top quarter of the figure), the clinic figure's head (its measured head anchor on the art, data/clinic/heal-art.json, else the art's top fifth), the doctor's figure. The tail (or the bubble) must be in the head's column and the bubble above it (or below it); a bubble beside the head, away from it or in a corner of the screen is a break. S13-B2 (the kit review, decision 6): every bubble on screen is the kit's .cv-bubble (js/shared/conversations.js Conversations.bubble); a game's own (Cook's #bubble, the clinic's .cl-bubble) is a break, once per page." },
  "contract-5": { item: "badges", title: "badges in order", how: "While the end screen is up, every 40 ms: does anything of each badge show (its parts' opacity, or a picture on its spot from outside it). Each must first show after the one before it." },
  "contract-6": { item: "old-art", title: "no retired art", how: "Every image drawn (canvas drawImage, offscreen canvases a rig draws from, <img>, CSS backgrounds, Phaser WebGL textures) by file; a file on the retired list with the same content (sha256), in its scope, is a break." },
  "contract-7": { item: "one-voice", title: "one voice at a time", how: "Every clip said for a line (the sound log, its real start and stop as contract-3 reads them); two clips of different lines sounding together for more than 150 ms is a break (PAN-04: the count words, the next-thing line and the order never overlap). Clips whose length is only estimated are not judged." },
  "contract-8": { item: "highlight", title: "one highlight at a time", how: "Sampled on every change: Cook's pictures carrying the shared glow (glowFx) and the clinic's next-up or pulsing tools (a tool family, all the plasters, is one highlight). More than one at once for 300 ms or more is a break (SH-53)." },
  "contract-9": { item: "closed-card", title: "no folded card from L3", how: "At the first play tap of the waiting room, the pharmacy or a heal game at level 3 or more: no order card in the sidebar may be closed (OrderCard 'closed': folded to face + headline). SH-110 (Zafar, 26 Oct: 'we can't just have fully blanked out order cards'; overrides CLN-114's closed card): the card stays open, its rows' words blanked (dotted), each blanked row starting with its speaker (contract-40). A closed card is a break." },
  "contract-10": { item: "your-turn", title: "faces the player on the child's turn", how: "At every play tap the clinic asked for (it expected a tap or a pick, not 'wait'), every staged talker on screen (the staging hook's .cl-staged, data-pose) must face the player (data-pose 'front'); still turned to the other talker is a break (SH-71, rules E20, F26). In the examination (clinic/diagnosis) the doctor stays three-quarter to her instead, and front is the break (CLN-157). Cook has no poses yet: an eye check." },
  "contract-11": { item: "background", title: "backgrounds in proportion and sharp", how: "Every picture covering half the screen or Cook's canvas (<img>, CSS background, Phaser image): screen px per source px across and down. Across and down differing by more than 3% is stretched (PAN-14); more than 1.5 screen px per source px (times the page's pixel ratio) is low-res (ART-05). Either is a break." },
  "contract-12": { item: "greyed", title: "buttons hidden until usable", how: "A ✓, Next or stage button on screen while disabled, aria-disabled, dimmed under 60% or greyscale, for 400 ms or more and not just pressed (1.5 s before), is a break: hidden until usable, never greyed (SH-23)." },
  "contract-13": { item: "stale-ui", title: "each stage clears its own UI", how: "Each reply pill (.cl-pill, .njg-pill, .cv-pill, .st-reply, .st-choice; not the sidebar's) remembers the stage it was first seen in; still on screen 600 ms into a later play stage is a break (CLN-06)." },
  "contract-15": { item: "words-whole", title: "no word broken across lines in a card", how: "Sampled on every change: every word of four letters or more (no hyphen) in an order card, a request card or a word tile whose letters sit on two lines (its text range has client rects on two rows). Held 300 ms or more is a break; non-negotiable 9, SH-73." },
  "contract-14": { item: "talk", title: "one talk animation", how: "Every 400 ms: Cook's characters' repeating tweens (yoyo) and the play area's endless CSS talk or bob animations (cards, the guide box and the pop-up are not the play area). A tween lifting or tilting more than the shared Lifecycle.talk.SPEC (2 px, 0.4°) or faster than its 380 ms, or a CSS talk animation other than njg-talk, is a break (ART-18)." },
  "contract-34": { item: "go-arrow", title: "every go-on button has the arrow; every button the kit's", how: "Every buttons sample (lib/contract-hook.mjs): a go-on button on screen (the shared → Next .njg-next, Cook's #go-btn, samosa's #samosa-next, [data-go]; not the ✓) must show the arrow: the shared kit's arrow (js/shared/buttons.js ICON.arrow, its head path) drawn at least 2 px, or an arrow character. One without it is a break (SH-106: \"there's no arrow\"). S13-A2 (the kit review, decision 6): every go-on or done button on screen and every answer pill (.njg-pill, a game's .cl-pill; not the Say or conversation replies, their own components) must be the kit's .njg-btn (js/shared/buttons.js NjgButtons.done/next/pills); one that is not is a break." },
  "contract-42": { item: "face-circle", title: "one face circle, three sizes", how: "Every facekit sample (lib/contract-hook.mjs): each face circle of a person on screen (a card's .oc-face, the guide's .ng-face, the heal corner .hs-face, a bubble's .cv-face, Cook's Nani card and pass-me, the book's .day-face, any .njg-face) must be the kit's circle (js/shared/face.js: .njg-face) with one of the three size classes (njg-face-row, -guide, -big) and laid out at that size's token (--njg-face, --njg-guide-face, --njg-big-face, as the element reads it) within 1 px (its laid-out width: the talk's tilt or a pop-up's entrance scale aside). A face that is not the kit's, has no size, or is drawn at another width is a break (ART-08, S13-A2: Nana and the doctor the same size in every place)." },
  "contract-44": { item: "one-finger", title: "one finger, the kit's", how: "Every fingers sample (lib/contract-hook.mjs): a finger on screen must be the kit's .ob-finger (js/shared/onboard.js Onboard.finger; a game's own, Cook's old .co-finger, is a break) and there is never more than one at a time; while the stuck help's spotlight (.njg-spot.on) shows, its finger must come: a spotlight on screen 2 s or more with no finger is a break (SH-130: the eye test's card step at the laptop size had no finger; SH-19: first-time help always has its finger)." },
  "contract-35": { item: "card-ladder", title: "the card by level", how: "Cook flows only, at each station stage's first play tap (the side and rows samples just before it): L1 and L2 every sidebar card open (none closed) and no dotted word (•••) in a row; L3 and L4 every card open and no item word (the lexicon's forms of an item: data/cook.json words with a bowl, heap, image, layer or piece) written in a row not yet ticked, the items dotted (each dotted row with its speaker: contract-40). SH-110 (Zafar, 26 Oct: never a memory test, no fully blanked card) replaces L4's folded card (face + headline); was closedFrom 3 (the level table, Zafar 19 Oct)." },
  "contract-40": { item: "one-card", title: "one card markup; a blanked row has its speaker", how: "Every kitcard sample (lib/contract-hook.mjs): each order card on screen (.oc-card, sidebar or pop-up) and its head, face, items and rows may carry only the kit's classes (oc-, wc, njg-, fit and the card's state words: done, next, reading ...); a game's own class (cl-row, cl-card-face, r6, icard ...) is a break (S13: the clinic's and Cook's copies go, one card everywhere). SH-110 (Zafar, 26 Oct: a card is never a memory test): a row not done whose words are blanked (a dotted word showing, or OrderCard's oc-blank) must start with its speaker (.oc-spk, the row's first element); one without it is a break." },
  "contract-41": { item: "one-popup", title: "one order pop-up", how: "Every kitcard sample: a request pop-up on screen (.njg-rq-open, .njg-rq-veil, Cook's #intro) must be the kit's (js/shared/request-popup.js: a .njg-rq-card inside the veil). Cook's own #intro shown, or a pop-up with no .njg-rq-card, is a break (S13-B1: Cook on the kit's pop-up, like the clinic and the day)." },
  "contract-36": { item: "step-call", title: "Nani calls each step as it opens", how: "Cook flows only: every step the game opens in a play stage (Lifecycle step-open, js/shared/guide.js stepper) must be called: a Cook line tagged role call must start after it and before the next step opens (or within 6 s), unless the game logged a step-call skip for that step (Lifecycle step-call, by 'skip ...': Nani muted, the station said it a moment ago, a step with no voiced line, the step closed before its turn). A step-open with neither is a break; a call said where the step-call log says skip is a break too (SH-110, the level table: the order in pieces, at every level, never help)." },
  "contract-50": { item: "one-tick", title: "samosa: the card ticks at the one tick", how: "Cook flows of the samosa station only, in the stage where the game reported its fillings' decoys (Lifecycle decoys by 'fillings'): the rows sample (each sidebar card row and its tick). Once any row ticks, every row still open (not a \"don't\" row, which ticks with the finished dish) must tick within 1.5 s: the fill closes once for every strip at the one tick, so no kind's box or filling row ticks while samosas of it are still to be made (SAM-24, P42: 'he's ticked the samosa like it's done but he wanted three'). A row unticked again (a redo after a mistake, decision 51) starts the wait over." },
  "contract-37": { item: "decoys", title: "decoys by level", how: "Cook flows of the stations with things to pick (the pantry, chai tray, samosa, sekelo, daar, chaat): each station stage must report its decoys (Lifecycle decoys: the count, and lookalike 0 or 1, js/cook/station-lib.js St.decoyNote) and the count must be the table's (1, 2, 3, 3 by level; at least that for the pantry's shelf and the daar's chop, whose rows are full by design), with a lookalike among them at L4. No report, a wrong count or no lookalike at L4 is a break (CK-49, P32)." },
  "contract-38": { item: "two-pages", title: "the end screen: two pages", how: "Every endpages sample (lib/contract-hook.mjs: the end screen's pages, data-page, the one shown, data-step, and its step rows): a third page (the steps of the round, .rs-p3), a card on step 3 or any step row (.rs-step, .rs-steps-list) in any game is a break (SH-104, Zafar, 22 Oct: the third page goes from every game; js/shared/results.js Results.STEPS_PAGE is the only way in, and it is off)." },
  "contract-39": { item: "card-english", title: "the word card's English: supported, then tapped", how: "Every card-en sample (lib/contract-hook.mjs: each shared word card's English slot on screen with words in it, its card's data-stage and whether the child opened it, the slot's revealed class): English showing on a card at stage 3 or more that the child did not open is a break (SH-123; Zafar, 21 Oct: English on a word card only while the word is supported, then only when tapped; data/progress.json support[stage].english). An order card's row (the slot inside an .oc-card, oc) never shows its English untapped, at any stage: a break (S13-B1 round 3; CLAUDE.md non-negotiable 3)." },
  ...DAY_CHECKS,
  ...DAAL_CHECKS,
  ...CHAI_CHECKS,
};

// the route the contract run plays by default (run.mjs --contract with no --flow): what Zafar played on 8 Oct and the places his
// rules were caught. Also the sample build/tools/review/sprintcheck.mjs plays for a row about every game
export const CONTRACT_ROUTE = ["cook:chop", "lab:cook/chop", "cook:chaat@L4", "cook:fetch#speed1", "lab:cook/round#speed1", "clinic:waiting", "clinic:diagnosis", "clinic:heal-knee@L2", "clinic:morning"];

const TOL = 250; // ms a voice may run past its stage end (one audio frame of fade, the sampling)
const OVERLAP = 150; // ms two lines may sound together (a fade, a stop that lands a frame late)
const TALK_SPEC = { lift: 2, tilt: 0.4, ms: 380 }; // js/shared/request-popup.js Lifecycle.talk.SPEC, when the page did not report it

// ---- the clip's own length, when the page could not say (a silent build, metadata never loaded) ----
const clipCache = new Map();
export function clipSeconds(root, url) {
  const f = String(url || "").split("?")[0];
  if (clipCache.has(f)) return clipCache.get(f);
  let d = null;
  try {
    const p = join(root, f);
    if (existsSync(p)) d = parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], { encoding: "utf8", timeout: 5000 }).trim()) || null;
  } catch (e) { d = null; }
  clipCache.set(f, d);
  return d;
}

const levelOf = (flow) => { const m = /@L(\d)/.exec(flow) || /level=(\d)/.exec(flow); return m ? +m[1] : 1; };
const center = (b) => ({ x: (b.l + b.r) / 2, y: (b.t + b.b) / 2 });
// the stage's real level (s08 w6E): a day flow runs L3 dishes under an L1 label, and a seen profile plays later dishes higher, so a
// check of the level table reads the order's own level: the last "order-level" note (Lifecycle, js/cook/ui.js) at or before t, else
// the sidebar's data-level (the side sample's lv), else the flow's label
export function realLevel(tl, t, fallback = 1) {
  let note = null, side = null;
  for (const e of tl) {
    if (e.t > t) break;
    if (e.type !== "c") continue;
    if (e.k === "life" && e.what === "order-level") { const n = parseInt(e.step != null ? e.step : e.reason, 10); if (n >= 1) note = n; }
    else if (e.k === "side" && e.lv != null) { const n = parseInt(e.lv, 10); if (n >= 1) side = n; }
  }
  const lv = note != null ? note : side;
  return lv != null ? Math.min(4, lv) : fallback;
}

// ---- stages from the probe's stage events ----
export function segments(tl, tEnd) {
  const segs = [];
  for (const e of tl) if (e.type === "c" && e.k === "stage") {
    const prev = segs[segs.length - 1];
    // the same stage, seen in more detail (Cook's station inside the host's stage once Cook's hook is there): not a boundary
    if (prev && e.key.startsWith(prev.key + "|")) { prev.key = e.key; continue; }
    if (prev) prev.t1 = e.t;
    segs.push({ key: e.key, t0: e.t, t1: null });
  }
  if (segs.length) segs[segs.length - 1].t1 = null;
  // the real end of a stage: the shared lifecycle's own stage-end (Lifecycle.log, at its own millisecond: the voice stop),
  // the latest one in the 1.5 s before the sampler saw the stage change, not the sample (100 ms apart). A line queued after
  // the stop then belongs to the next stage, not to the one that ended
  // (and its stage-start, Lifecycle.stageStart: a Cook station opens; the line it opens with is its own, s04-fxc)
  const ends = tl.filter((e) => e.type === "c" && e.k === "life" && (e.what === "stage-end" || e.what === "stage-start")).map((e) => e.t);
  if (ends.length) for (let i = 1; i < segs.length; i++) {
    const s = segs[i], prev = segs[i - 1];
    const c = ends.filter((t) => t <= s.t0 + 20 && t > prev.t0 && t >= s.t0 - 1500);
    if (c.length) { const t = c[c.length - 1]; prev.t1 = t; s.t0 = t; s.fromLife = true; }
  }
  return segs;
}
const segAt = (segs, t) => { let s = null; for (const x of segs) if (x.t0 <= t) s = x; return s; };
// a stage the child plays in: a Cook station, or a host stage that is a game (not idle, results, done)
export const isPlayStage = (key) => /(^|\|)cook:station/.test(key) || (!/cook:between/.test(key) && /^host:[^|]*\//.test(key));

// lines and their clips: each clip's real interval
export function voice(tl, { root = ".", clip = clipSeconds } = {}) {
  const lines = new Map(), plays = new Map();
  // ids count from 1 on every page a flow opens (the story, then cook.html, then the story again): keyed by page and load, a
  // later page's line 1 never overwrites an earlier page's (s04-fxc)
  let load = 0, lastPage = null;
  const key = (e, id) => `${load}|${id}`;
  for (const e of tl) {
    if (e.type === "play" && e.via === "sfx") continue; // a sound effect (Cook's sizzle loop: lib/sound.mjs 3b), never a voice
    if (e.page && e.page !== lastPage && (e.type === "line" || e.type === "play")) { if (lastPage != null) load++; lastPage = e.page; }
    if (e.type === "line") { if (lines.has(key(e, e.id))) load++; lines.set(key(e, e.id), { id: key(e, e.id), text: e.text, who: e.who, role: e.role || null, t0: e.t, t1: null, plays: [] }); }
    else if (e.type === "line-end" && lines.has(key(e, e.id))) lines.get(key(e, e.id)).t1 = e.t;
    else if (e.type === "play" && e.pid) { if (plays.has(key(e, e.pid))) load++; plays.set(key(e, e.pid), { pid: key(e, e.pid), url: e.url || null, text: e.text || null, via: e.via, t0: e.t, dur: e.dur, est: !!e.est, end: null, why: null }); }
    else if (e.type === "play-dur" && plays.has(key(e, e.pid))) plays.get(key(e, e.pid)).dur = e.dur;
    else if (e.type === "play-end" && plays.has(key(e, e.pid))) { const p = plays.get(key(e, e.pid)); if (p.end == null) { p.end = e.t; p.why = e.why; } }
  }
  const stops = tl.filter((e) => e.type === "voice-stop").map((e) => e.t);
  // the game's own turns (js/cook/words.js Lang.speak: say-start when the first clip of a queued line is about to play, say-end
  // when it is done), each matched to the line asked for it: the earliest unmatched line of the same words
  const turns = [];
  {
    const open = new Map();
    const same = (a, b) => normW(a).replace(/\s+/g, " ") === normW(b).replace(/\s+/g, " ");
    const taken = new Set();
    for (const e of tl) {
      if (e.type !== "c" || e.k !== "life") continue;
      if (e.what === "say-start") {
        const u = { id: e.reason, t0: e.t, t1: null, text: e.by || "", line: null };
        // (s08 w6L, contract-3) the turn's id is its line's id (say-start's reason = the sound log's line id): a clip belongs to the line its
        // turn said, never to the next line with the same words (a cut count clip was matched by order to a later stage's count line)
        const byId = [...lines.values()].filter((x) => String(x.id).split("|").pop() === String(e.reason) && !taken.has(x.id) && x.t0 <= e.t + 5).sort((a, b) => b.t0 - a.t0)[0];
        const l = byId || [...lines.values()].filter((x) => x.who === "cook" && !taken.has(x.id) && x.t0 <= e.t + 5 && same(x.text, u.text)).sort((a, b) => a.t0 - b.t0)[0];
        if (l) { taken.add(l.id); u.line = l; }
        open.set(u.id, u);
        turns.push(u);
      } else if (e.what === "say-end" && open.has(e.reason)) open.get(e.reason).t1 = e.t;
    }
  }
  for (const p of plays.values()) {
    if (p.dur == null && p.url) { p.dur = clip(root, p.url); p.fromFile = p.dur != null; }
    if (p.dur == null) { p.dur = 1; p.est = true; }
    const natural = p.t0 + p.dur * 1000;
    p.t1 = p.end != null ? Math.min(p.end, natural) : natural;
    // the line it was said for: the latest line that had started (and not long ended) when it played. Where the game logged its
    // own turns (Lifecycle say-start / say-end: Cook's one speech queue, PAN-04, logs a line when asked for but starts it when its
    // turn comes) the clip belongs to the turn it sounded in, and so to that turn's line
    let best = null;
    const turn = turns.length ? turns.filter((u) => u.t0 <= p.t0 + 5 && (u.t1 == null || p.t0 <= u.t1 + 60)).pop() : null;
    if (turn && turn.line) best = turn.line;
    else for (const l of lines.values()) if (l.t0 <= p.t0 + 5 && (l.t1 == null || p.t0 <= l.t1 + 60) && (!best || l.t0 >= best.t0)) best = l;
    if (best) { best.plays.push(p); p.line = best; }
  }
  // a Cook line that played nothing (the test build had no clip it could play in time, or the next line replaced it before it
  // loaded): it is said in real play, so its length is its words' family clips (or about 0.45 s a word), cut by the next Cook
  // line (one channel: a new line replaces the old) or a voice stop
  const cookLines = [...lines.values()].filter((l) => l.who === "cook");
  for (const l of cookLines) {
    if (l.plays.length || !(l.text || "").trim()) continue;
    const est = l.t0 + lineSeconds(root, l.text, clip) * 1000;
    const next = cookLines.find((x) => x.t0 > l.t0 && x.id !== l.id);
    const stop = stops.find((t) => t > l.t0);
    const t1 = Math.min(est, next ? next.t0 : Infinity, stop || Infinity);
    plays.set(`line${l.id}`, { pid: `line${l.id}`, url: null, text: l.text, via: "silent line (its words' clip lengths)", t0: l.t0, dur: (est - l.t0) / 1000, est: true, t1, end: t1 < est ? t1 : null, why: t1 < est ? (next && next.t0 === t1 ? "the next line" : "a voice stop") : null, line: l });
    l.plays.push(plays.get(`line${l.id}`));
    l.silent = true;
  }
  return { lines: [...lines.values()], plays: [...plays.values()] };
}

// a line's length from its words' clips: the family's recording of the word, else the placeholder file, else 0.45 s
let famWords = null;
export function lineSeconds(root, text, clip = clipSeconds) {
  if (!famWords) {
    famWords = new Map();
    const p = join(root, "data", "family-audio.json");
    if (existsSync(p)) for (const e of JSON.parse(readFileSync(p, "utf8"))) if (e && e.file && e.kutchi && e.checked !== "redo") { const k = normW(e.kutchi); if (!famWords.has(k)) famWords.set(k, e.file); }
  }
  let s = 0;
  for (const w of String(text).split(/\s+/).map(normW).filter(Boolean)) {
    const f = famWords.get(w) || (existsSync(join(root, "assets", "audio", "cook-tts", `${w}.mp3`)) ? `assets/audio/cook-tts/${w}.mp3` : null);
    const d = f ? clip(root, f) : null;
    s += (d || 0.45) + 0.04;
  }
  return Math.max(0.3, s);
}
const normW = (s) => String(s || "").toLowerCase().normalize("NFC").replace(/[^\p{L}\p{M}\p{N} ]/gu, "").trim();

// the state (and its screenshot) nearest after t, else the last before it
function stateAt(r, t) {
  // the probe's own shot of that moment (taken as the bubble, badge, button, pop-up or stage change happened), else a state's
  const c = (r.cshots || []).filter((x) => x.t >= t - 60 && x.t <= t + 700).sort((a, b) => Math.abs(a.t - t) - Math.abs(b.t - t))[0];
  const at = t - (r.t0 || 0);
  if (c) { let s = null; for (const x of r.states || []) if (x.at != null && x.at <= at) s = x; return { state: s ? `after ${s.name}` : "start", shot: c.shot }; }
  const st = r.states || [];
  let s = st.find((x) => x.at != null && x.at >= at - 200) || st[st.length - 1];
  return s ? { state: s.name, shot: s.shot } : { state: "?", shot: null };
}

// ---- the checks ----
// lines that give no order (decision 80): Nani's how-to step line and her "pass me" (and its thank-you) stay outside the pop-up
export const NOT_ORDER = new Set(["howto", "passme", "call"]); // (s08 w2A: "call", Nani calling a step as it opens: the order in pieces after the pop-up gave it, SH-110)
const ASK_BEFORE = 1000; // ms: a request logged this long before its pop-up's open sample is that pop-up's
const TAP_CLOSES = 1500; // ms: a tap on the pop-up this soon after it opened is the child closing it
function check1(tl, segs, v, add) {
  const side = tl.filter((e) => e.type === "c" && e.k === "side");
  const sideAt = (t) => { let s = { n: 0, rows: 0 }; for (const e of side) if (e.t <= t) s = e; else break; return s; };
  const pops = [];
  // the pop-up opened when the shared lifecycle's request was logged (Lifecycle.log, at its own millisecond), not when the
  // probe next sampled it (up to 100 ms later): the read-out's first line starts in between (s04-fxc)
  const asks = tl.filter((e) => e.type === "c" && e.k === "life" && e.what === "request").map((e) => e.t);
  for (const e of tl) if (e.type === "c" && e.k === "popup") {
    if (e.open && (!pops.length || pops[pops.length - 1].t1 != null)) {
      const after = pops.length ? pops[pops.length - 1].t1 : -Infinity;
      // (a request logged up to 1 s before the sample, and up to 150 ms before the last pop-up's close sample: the next pop-up
      // opening as the last one closes, s08 w6E)
      const ask = asks.filter((t) => t <= e.t && t >= e.t - ASK_BEFORE && t >= after - 150);
      pops.push({ t0: ask.length ? ask[0] : e.t, t1: null });
    } else if (!e.open && pops.length && pops[pops.length - 1].t1 == null) pops[pops.length - 1].t1 = e.t;
  }
  const inputs = tl.filter((e) => e.type === "c" && e.k === "input");
  let windowStart = tl.length ? tl[0].t : 0, first = true, lastRows = 0;
  for (const s of segs) {
    if (!isPlayStage(s.key)) continue;
    const end = s.t1 == null ? Infinity : s.t1;
    const play = inputs.find((i) => i.t >= s.t0 && i.t < end && !i.popup && !i.side && !i.next && !(i.exp && i.exp.cook && i.exp.cook.intro));
    if (!play) continue; // no play here (a stage the flow only passed through): the window runs on
    const card = sideAt(play.t);
    // decision 80: Nani's how-to step line and her "pass me" (role "howto" / "passme" in the sound log) are not orders
    const outside = v.lines.filter((l) => l.t0 >= windowStart && l.t0 < play.t && (l.text || "").trim() && !NOT_ORDER.has(l.role) && !pops.some((p) => p.t0 <= l.t0 + 50 && (p.t1 == null || l.t0 <= p.t1)));
    const newCard = card.n > 0 && card.rows !== lastRows;
    const order = card.n > 0 && (first || outside.length > 0 || newCard);
    if (order) {
      const mine = pops.filter((p) => p.t0 >= windowStart - 50 && p.t0 < play.t);
      if (!mine.length) add("contract-1", play.t, `${s.key}: the play phase starts with no request pop-up${outside.length ? ` (said outside it: "${outside.map((l) => l.text).slice(0, 2).join(" / ")}")` : ""}; first tap at ${play.x},${play.y}`);
      else {
        const p = mine[mine.length - 1];
        // read out: a line said, or a family clip played (the read-along plays its chunks' clips without a line of its own)
        const said = v.lines.some((l) => l.t0 >= p.t0 - 100 && (p.t1 == null || l.t0 <= p.t1) && (l.text || "").trim()) || v.plays.some((q) => !q.est && q.url && q.t0 >= p.t0 - 100 && (p.t1 == null || q.t0 <= p.t1));
        // a pop-up the child's first tap closed before the voice began (a tap on it within TAP_CLOSES of its opening, a few ms
        // before the sample too) is read out as far as it will be (s08 w6E)
        const tappedAtOnce = inputs.some((i) => i.t >= p.t0 - 150 && i.t <= p.t0 + 600) || inputs.some((i) => i.popup && i.t >= p.t0 - 150 && i.t <= p.t0 + TAP_CLOSES && (p.t1 == null || i.t <= p.t1 + 150));
        if (!said && !tappedAtOnce) add("contract-1", p.t0, `${s.key}: the request pop-up was not read out (no line while it was up)`);
        if (p.t1 != null) {
          const folded = side.some((e) => e.t >= p.t1 - 100 && e.t <= p.t1 + 2000 && e.n > 0) || sideAt(p.t1 + 2000).n > 0;
          if (!folded) add("contract-1", p.t1, `${s.key}: the pop-up closed and no order card showed in the sidebar within 2 s (it did not fold)`);
        }
      }
    }
    // the card as this stage left it (a part revealed mid-stage, with its own pop-up, is not the next stage's new order)
    const left = end === Infinity ? card : sideAt(end - 1);
    lastRows = left.n > 0 ? left.rows : card.n > 0 ? card.rows : lastRows;
    first = false;
    windowStart = end;
  }
}

// what the game expected says the step is decided: only the button is left
export function decided(exp, sel) {
  if (!exp) return false;
  // the shell between rounds (the end of a morning, the results, idle) is not a game's step: its buttons are the child's choice
  if (exp.host && /^(done|results|idle)$/.test(exp.host)) return false;
  // non-negotiable 12: the child can take it back until Done. A take-back on offer, or pictures still taking taps that change
  // the result (chaat's bowl), leave the step open: its Done is the child's choice, not a decided step
  if (exp.live > 0 || (exp.cook && exp.cook.undo) || (exp.hostExp && exp.hostExp.undo)) return false;
  // an open count the station steers its player to end (Cook's expectation `open`: more stirs, folds or skewers still change
  // the result, the child decides when it's enough, C10; moving on at the right count would give the answer away, NN6)
  if (exp.cook && exp.cook.open) return false;
  // decision 80: a button that starts the next part of the order (samosa's 'next kind', expectation `choice`) is the child's
  // own move: moving on when the first count is made would give the count away
  if (exp.cook && exp.cook.choice) return false;
  if (exp.cook) {
    if (["count", "more"].includes(exp.cook.kind) || exp.cook.intro) return false;
    if (exp.cook.kind === "click" && exp.cook.selector && !/njg-results|rs-|lab-list|#t-|#sum-|#shop|#fin-/.test(exp.cook.selector)) return !sel || sel.includes(exp.cook.selector.replace(/^#/, "#")) || /done-btn|go/.test(exp.cook.selector);
    return false;
  }
  if (exp.heal && exp.heal.do === "button") {
    // a count the game reported uncapped (more taps still change it: the ear's drops) is the child's to end (C10); a capped
    // count (the knee's wrap stops at it) or a step with no count is decided (decision 79)
    const c = exp.heal.count;
    if (c && !c.capped) return false;
    return true;
  }
  if ("clinic" in exp) return exp.clinic == null || exp.clinic.kind === "button";
  if (exp.hostExp && exp.hostExp.kind === "button") return true;
  return false;
}
function check2(tl, segs, add) {
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c") continue;
    if (e.k === "buttons" && e.list && e.list.length && decided(e.exp, e.list[0].sel)) {
      const s = segAt(segs, e.t);
      for (const b of e.list) { const k = `${s && s.key}|${b.sel}`; if (seen.has(k)) continue; seen.add(k); add("contract-2", e.t, `${s ? s.key : "?"}: ${b.sel}${b.text ? ` "${b.text}"` : ""} shown after the step was decided (the game expected only this button: ${JSON.stringify(e.exp)})`); }
    }
    if (e.k === "input" && e.next && decided(e.exp, e.btn)) {
      const s = segAt(segs, e.t), k = `${s && s.key}|${e.btn}`;
      if (seen.has(k)) continue;
      seen.add(k);
      add("contract-2", e.t, `${s ? s.key : "?"}: had to press ${e.btn} to move on after the step was decided (${JSON.stringify(e.exp)})`);
    }
  }
}
function check3(segs, v, add) {
  for (const p of v.plays) {
    const owner = segAt(segs, p.line ? p.line.t0 : p.t0);
    if (!owner || owner.t1 == null) continue;
    const over = p.t1 - owner.t1;
    if (over > TOL) {
      const next = segAt(segs, owner.t1 + 1);
      add("contract-3", owner.t1 + 1, `"${(p.line && p.line.text) || p.text || p.url}" (${p.url || p.via}, ${p.dur.toFixed(2)} s${p.est ? ", estimated" : p.fromFile ? ", the file's length" : ""}) ${p.t0 > owner.t1 ? `started ${Math.round(p.t0 - owner.t1)} ms after` : "kept playing"} ${Math.round(over)} ms past the end of ${owner.key} (into ${next ? next.key : "?"})${p.why ? `; it stopped by ${p.why}` : "; nothing stopped it"}`);
    }
  }
}
// the speaker's head(s) for a bubble
function headsFor(b, heads) {
  const who = b.who;
  let hs = heads.filter((h) => h.who === who);
  if (who === "cook" || !hs.length) hs = heads.filter((h) => h.src === "phaser").length && who === "cook" ? heads.filter((h) => h.src === "phaser") : hs;
  // a speaker element that is a whole standing figure: its head is its top fifth
  return hs.map((h) => {
    const w = h.box.r - h.box.l, hh = h.box.b - h.box.t;
    if (/^speaker:/.test(h.src) && hh > w * 1.5) return { ...h, box: { l: Math.round(h.box.l + w * 0.25), t: h.box.t, r: Math.round(h.box.r - w * 0.25), b: Math.round(h.box.t + hh * 0.2) }, from: "figure top" };
    return h;
  });
}
export function bubbleOk(b, h, vw, vh) {
  const hw = h.box.r - h.box.l, hh = h.box.b - h.box.t;
  // the tail must point into the head's own column; a bubble with no tail must at least overlap it
  const inCol = b.tail ? b.tail.x >= h.box.l - 4 && b.tail.x <= h.box.r + 4 : b.box.r >= h.box.l - hw * 0.25 && b.box.l <= h.box.r + hw * 0.25;
  const reach = Math.max(120, hh * 1.5);
  const above = b.box.b <= h.box.t + hh * 0.5 && b.box.b >= h.box.t - reach;
  const below = b.box.t >= h.box.b - hh * 0.5 && b.box.t <= h.box.b + reach;
  return { ok: inCol && (above || below), inCol, above, below };
}
export function inCorner(b, area) {
  const m = 24;
  const L = b.box.l - area.l <= m, Rt = area.r - b.box.r <= m, T = b.box.t - area.t <= m, B = area.b - b.box.b <= m;
  return (L || Rt) && (T || B) ? `${T ? "top" : "bottom"}-${L ? "left" : "right"}` : null;
}
function check4(tl, segs, add) {
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "bubble") continue;
    for (const b of e.list) {
      // S13-B2: the kit's bubble only (the hook's kit flag: .cv-bubble; an older timeline has none and is judged by its place)
      if (b.kit === false && !seen.has(`kit|${b.sel || b.who}`)) {
        seen.add(`kit|${b.sel || b.who}`);
        const s = segAt(segs, e.t);
        add("contract-4", e.t, `${s ? s.key : "?"}: ${b.who}'s bubble "${b.text}" (${b.sel || "?"}) is not the kit's bubble (.cv-bubble, Conversations.bubble)`);
      }
      const hs = headsFor(b, e.heads || []);
      const area = e.play || { l: 0, t: 0, r: e.vw, b: e.vh };
      const corner = inCorner(b, { l: 0, t: 0, r: e.vw, b: e.vh }) || inCorner(b, area);
      // nearest head first (Cook's bubbles name no speaker: the character it was put by is the nearest one)
      const bc = b.tail || center(b.box);
      const res = hs.map((h) => ({ h, d: Math.hypot(center(h.box).x - bc.x, center(h.box).y - bc.y), ...bubbleOk(b, h, e.vw, e.vh) })).sort((x, y) => x.d - y.d);
      const good = res.find((x) => x.ok);
      if (good && !corner) continue;
      if (good && corner) { const c = center(good.h.box); if (Math.abs(c.y - center(b.box).y) < 200) continue; }
      const s = segAt(segs, e.t);
      const k = `${s && s.key}|${b.who}|${corner || ""}|${res.length ? (res[0].inCol ? "c" : "n") + (res[0].above ? "a" : res[0].below ? "b" : "s") : "none"}`;
      if (seen.has(k)) continue;
      seen.add(k);
      const h = res[0];
      const why = !hs.length ? `no head of "${b.who}" on screen` : `${h.inCol ? "in" : "not in"} the head's column, ${h.above ? "above" : h.below ? "below" : "beside or away from"} the head (${h.h.src}${h.h.from ? ", " + h.h.from : ""} ${JSON.stringify(h.h.box)})`;
      add("contract-4", e.t, `${s ? s.key : "?"}: ${b.who}'s bubble "${b.text}" at ${JSON.stringify(b.box)}${b.tail ? ` tail ${b.tail.x},${b.tail.y}` : ""}: ${why}${corner ? `; in the ${corner} corner` : ""}`);
    }
  }
}
function check5(tl, add) {
  let run = null;
  const flush = () => {
    if (!run) return;
    const { n, first, names } = run;
    run = null;
    for (let i = 1; i < n; i++) for (let j = 0; j < i; j++) {
      if (first[i] == null) continue;
      if (first[j] == null || first[i] < first[j] - 30) return add("contract-5", first[i], `badge ${i + 1} (${names[i]}) showed before badge ${j + 1} (${names[j]})${first[j] == null ? ", which never showed" : ` by ${Math.round(first[j] - first[i])} ms`}`);
    }
    if (n > 1 && first.every((x) => x != null && Math.abs(x - first[0]) <= 30)) add("contract-5", first[0], `all ${n} badges showed at once (not one, two, three)`);
  };
  for (const e of tl) {
    if (e.type === "c" && e.k === "stage") { if (e.key !== "end") flush(); }
    if (e.type !== "c" || e.k !== "badges") continue;
    if (e.list.every((b) => b.box && b.box.r - b.box.l < 2)) { flush(); continue; }
    if (!run) run = { n: e.list.length, names: e.list.map((b) => b.badge), first: e.list.map(() => null) };
    e.list.forEach((b, i) => { if (i < run.n && run.first[i] == null && b.vis > 0.35) run.first[i] = e.t; });
  }
  flush();
}
const shaCache = new Map();
const shaOf = (root, f) => { if (shaCache.has(f)) return shaCache.get(f); const p = join(root, f); const h = existsSync(p) ? createHash("sha256").update(readFileSync(p)).digest("hex").slice(0, 16) : null; shaCache.set(f, h); return h; };
// a scope pattern matches any part of the stage key ("cook:*:service" matches "host:cook/order|cook:between1:service")
const glob = (pat) => new RegExp("(^|\\|)" + pat.split("*").map((x) => x.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join("[^|]*") + "($|\\|)");
function check6(tl, retired, root, add) {
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "art") continue;
    const f = String(e.src || "").split("?")[0];
    for (const r of retired) {
      if (r.file !== f) continue;
      if (r.scope && !glob(r.scope).test(e.stage || "")) continue;
      if (r.sha256 && shaOf(root, f) !== r.sha256) continue; // redrawn under the same name: not the old picture
      const k = `${f}|${e.stage}`;
      if (seen.has(k)) continue;
      seen.add(k);
      add("contract-6", e.t, `${e.stage}: drew ${f} (${e.via}${e.key ? `, texture ${e.key}` : ""}): ${r.why}; replaced by ${r.by}`);
    }
  }
}

// ---- the measurable halves of the other "every game" rows ----
// 7 (PAN-04): two lines' clips sounding together
function check7(segs, v, add) {
  const ps = v.plays.filter((p) => p.line && !p.est && p.t1 > p.t0).sort((a, b) => a.t0 - b.t0);
  const seen = new Set();
  for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length && ps[j].t0 < ps[i].t1; j++) {
    const a = ps[i], b = ps[j];
    if (a.line === b.line) continue;
    const over = Math.min(a.t1, b.t1) - b.t0;
    if (over <= OVERLAP) continue;
    const s = segAt(segs, b.t0), k = `${s && s.key}|${a.line.text}|${b.line.text}`;
    if (seen.has(k)) continue;
    seen.add(k);
    add("contract-7", b.t0, `${s ? s.key : "?"}: "${b.line.text}" (${b.url || b.via}) started while "${a.line.text}" (${a.url || a.via}) was still sounding: ${Math.round(over)} ms together`);
  }
}
// 8 (SH-53): more than one highlight at once, held 300 ms or more
function check8(tl, segs, add, tEnd = tl[tl.length - 1].t) {
  // frames sampled before the first paint (the title not yet drawn) are not findings (C2's blank frames at 0.2 s and 0.9 s)
  const paint = tl.find((e) => e.type === "c" && e.k === "art");
  const hs = tl.filter((e) => e.type === "c" && e.k === "hl" && (!paint || e.t >= paint.t));
  const seen = new Set();
  hs.forEach((e, i) => {
    if (!(e.n > 1)) return;
    const until = i + 1 < hs.length ? hs[i + 1].t : tEnd;
    if (until - e.t < 300) return;
    const s = segAt(segs, e.t), k = `${s && s.key}|${e.list.join(",")}`;
    if (seen.has(k)) return;
    seen.add(k);
    const cols = [...new Set(e.list.map((x) => (/#(.+)$/.exec(x) || [])[1]).filter(Boolean))];
    add("contract-8", e.t, `${s ? s.key : "?"}: ${e.n} highlights at once for ${Math.round(until - e.t)} ms (${e.list.join(", ")})${cols.length > 1 ? `, in ${cols.length} colours (${cols.join(" / ")})` : ""}; one at a time, in one colour`);
  });
}
// 15 (SH-73, non-negotiable 9): a word broken across lines in a card, held 300 ms or more
function check15(tl, segs, add, tEnd = tl[tl.length - 1].t) {
  const ws = tl.filter((e) => e.type === "c" && e.k === "wrap");
  const seen = new Set();
  ws.forEach((e, i) => {
    if (!(e.n > 0)) return;
    const until = i + 1 < ws.length ? ws[i + 1].t : tEnd;
    if (until - e.t < 300) return;
    const s = segAt(segs, e.t), k = `${s && s.key}|${e.list.join(",")}`;
    if (seen.has(k)) return;
    seen.add(k);
    add("contract-15", e.t, `${s ? s.key : "?"}: ${e.n} word${e.n > 1 ? "s" : ""} broken across lines for ${Math.round(until - e.t)} ms (${e.list.slice(0, 6).join(", ")})`);
  });
}
// 9 (SH-110, overriding CLN-114): from L3 the card in the waiting room, the pharmacy and every heal game is open (its words blanked), never folded
const CLOSED_FROM_L3 = /(^|\|)host:clinic\/(waiting|pharmacy|heal)|(^|\|)host:heal\//;
function check9(tl, segs, level, add) {
  if (level < 3) return;
  const side = tl.filter((e) => e.type === "c" && e.k === "side");
  const sideAt = (t) => { let s = null; for (const e of side) if (e.t <= t) s = e; else break; return s; };
  const inputs = tl.filter((e) => e.type === "c" && e.k === "input" && !e.popup && !e.side && !e.next);
  for (const s of segs) {
    if (!CLOSED_FROM_L3.test(s.key)) continue;
    const end = s.t1 == null ? Infinity : s.t1;
    const first = inputs.find((i) => i.t >= s.t0 && i.t < end);
    if (!first) continue;
    const c = sideAt(first.t);
    if (!c || !c.n || c.closed == null) continue;
    if (c.closed > 0) add("contract-9", first.t, `${s.key} at L${level}: ${c.closed} of ${c.n} sidebar cards folded at the first play tap (SH-110: from L3 the card stays open, its words blanked, each with its speaker)`);
  }
}
// 10 (SH-71): on the child's turn (a tap the clinic asked for), every staged talker faces the player. In the examination
// (CLN-157, s08-placement-judge; ux-principles 16) the doctor faces whoever he speaks to and her between lines: on the
// child's turn there he stays three-quarter to her (the cue is the card and the pulsing parts), and front is the break
const EXAMINE = /clinic\/diagnosis$/;
const DOCTOR = /\bcl-doc\b/;
function check10(tl, segs, add) {
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "input" || e.popup || e.side || !(e.poses && e.poses.length)) continue;
    const k0 = e.exp && e.exp.clinic && e.exp.clinic.kind;
    if (!k0 || k0 === "wait") continue;
    const s = segAt(segs, e.t);
    const exam = !!(s && EXAMINE.test(s.key));
    const wrong = (p) => (exam && DOCTOR.test(p.who) ? p.pose !== "talk" : p.pose !== "front");
    const turned = e.poses.filter(wrong);
    if (!turned.length) continue;
    const k = `${s && s.key}|${turned.map((p) => p.who).join(",")}`;
    if (seen.has(k)) continue;
    seen.add(k);
    const say = (p) => (exam && DOCTOR.test(p.who) ? `${p.who} "${p.pose}": he faces the patient while the child examines her (CLN-157)` : `${p.who} still "${p.pose}"${p.facing ? ` facing ${p.facing}` : ""}: talkers turn to face the player`);
    add("contract-10", e.t, `${s ? s.key : "?"}: the child's turn (${k0}) with ${turned.map(say).join(", ")}`);
  }
}
// 11 (PAN-14, ART-05): a background stretched (across and down differ) or drawn low-res (more screen px than source px)
function check11(tl, add) {
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "bg" || !(e.sx > 0) || !(e.sy > 0)) continue;
    // a figure's art pushed in by a heal game's zoom is not a background (the probe now skips figures; runs recorded before it
    // carried them by file)
    if (/\/(patients|characters)\//.test(e.src || "")) continue;
    const ratio = Math.max(e.sx, e.sy) / Math.min(e.sx, e.sy);
    const up = Math.max(e.sx, e.sy) * (e.dpr || 1);
    const what = [];
    if (ratio > 1.03) what.push(`stretched: ${e.sx.toFixed(2)} across, ${e.sy.toFixed(2)} down (${Math.round((ratio - 1) * 100)}% out of proportion)`);
    // an SVG is drawn at the screen's own resolution (its "source px" is only its viewBox): never low-res (s04-fxc)
    if (up > 1.5 && !/\.svg$/i.test(String(e.src || "").split("?")[0])) what.push(`low-res: ${up.toFixed(2)} screen px per source px`);
    if (!what.length) continue;
    const k = `${e.src}|${what.map((w) => w.split(":")[0]).join("+")}`;
    if (seen.has(k)) continue;
    seen.add(k);
    add("contract-11", e.t, `${e.stage || "?"}: background ${e.src} (${e.via}) ${what.join("; ")}`);
  }
}
// 12 (SH-23): a ✓ / Next / stage button shown greyed for 400 ms or more, not just pressed
function check12(tl, segs, add, tEnd = tl[tl.length - 1].t) {
  const gs = tl.filter((e) => e.type === "c" && e.k === "greyed");
  const presses = tl.filter((e) => e.type === "c" && e.k === "input" && (e.next || e.btn));
  const seen = new Set();
  gs.forEach((e, i) => {
    for (const b of e.list || []) {
      // how long this button stayed greyed: until an event without it
      let until = tEnd;
      for (let j = i + 1; j < gs.length; j++) if (!(gs[j].list || []).some((x) => x.sel === b.sel && x.why === b.why)) { until = gs[j].t; break; }
      if (until - e.t < 400) continue;
      if (presses.some((p) => p.t <= e.t + 50 && p.t >= e.t - 1500)) continue; // pressed: the button on its way out
      const s = segAt(segs, e.t), k = `${s && s.key}|${b.sel}`;
      if (seen.has(k)) continue;
      seen.add(k);
      add("contract-12", e.t, `${s ? s.key : "?"}: ${b.sel}${b.text ? ` "${b.text}"` : ""} shown ${b.why} for ${Math.round(until - e.t)} ms (hidden until usable, never greyed)`);
    }
  });
}
// 27 (SH-106): every go-on button on screen shows the arrow
function check34(tl, segs, add) {
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "buttons") continue;
    for (const b of e.list || []) {
      if (!b.go || b.arrow !== false) continue;
      const s = segAt(segs, e.t), k = `${s && s.key}|${b.sel}`;
      if (seen.has(k)) continue;
      seen.add(k);
      add("contract-34", e.t, `${s ? s.key : "?"}: ${b.sel} has no arrow`);
    }
  }
}
// 34, S13-A2: every go-on, done and pill button on screen is the kit's .njg-btn
function check34kit(tl, segs, add) {
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "buttons") continue;
    for (const b of [...(e.list || []), ...(e.pills || [])]) {
      if (b.kit !== false) continue;
      const s = segAt(segs, e.t), k = `${s && s.key}|${b.sel}`;
      if (seen.has(k)) continue;
      seen.add(k);
      add("contract-34", e.t, `${s ? s.key : "?"}: ${b.sel}${b.text ? ` "${b.text}"` : ""} is not the kit's button (.njg-btn)`);
    }
  }
}
// 42 (ART-08, S13-A2): every face circle is the kit's .njg-face at one of three sizes, its token's width within 1 px
export function check42(tl, segs, add) {
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "facekit") continue;
    for (const f of e.list || []) {
      const s = segAt(segs, e.t);
      let why = null;
      if (!f.kit) why = `is not the kit's face circle (.njg-face, js/shared/face.js), ${Math.round(f.w)} px`;
      else if (!f.size) why = "has no size (njg-face-row, -guide or -big)";
      else if (!(f.tok > 0) || Math.abs(f.w - f.tok) > 1 || Math.abs(f.h - f.tok) > 1) why = `drawn ${Math.round(f.w)} x ${Math.round(f.h)} px, its size (${f.size}) is ${Math.round(f.tok)} px`;
      if (!why) continue;
      const k = `${s && s.key}|${f.sel}|${why.replace(/\d+/g, "#")}`;
      if (seen.has(k)) continue;
      seen.add(k);
      add("contract-42", e.t, `${s ? s.key : "?"}: ${f.sel} ${why}`);
    }
  }
}
// 44 (SH-130, S13-A2): one finger at a time, the kit's; a stuck help's spotlight always gets its finger
export const SPOT_NO_FINGER_MS = 2000;
export function check44(tl, segs, add, tEnd = tl.length ? tl[tl.length - 1].t : 0) {
  const seen = new Set();
  let since = null; // the spotlight on with no finger since
  const flush = (t) => {
    if (since == null || t - since < SPOT_NO_FINGER_MS) return;
    const s = segAt(segs, since), k = `${s && s.key}|none`;
    if (!seen.has(k)) { seen.add(k); add("contract-44", since, `${s ? s.key : "?"}: the help's spotlight showed ${Math.round((t - since) / 100) / 10} s with no finger`); }
  };
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "fingers") continue;
    const s = segAt(segs, e.t);
    const list = e.list || [];
    for (const f of list.filter((x) => !x.kit)) {
      const k = `${s && s.key}|own|${f.sel}`;
      if (!seen.has(k)) { seen.add(k); add("contract-44", e.t, `${s ? s.key : "?"}: ${f.sel} is a finger of its own (the kit's is .ob-finger)`); }
    }
    const kit = list.filter((x) => x.kit).length;
    if (kit > 1) {
      const k = `${s && s.key}|many`;
      if (!seen.has(k)) { seen.add(k); add("contract-44", e.t, `${s ? s.key : "?"}: ${kit} fingers on screen at once`); }
    }
    if (e.help && !list.length) { if (since == null) since = e.t; }
    else { flush(e.t); since = null; }
  }
  flush(tEnd);
}
// 13 (CLN-06): a reply pill from an earlier stage still on screen in a later play stage
function check13(tl, add) {
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "stale" || !isPlayStage(e.stage || "")) continue;
    const k = `${e.from}|${e.stage}|${e.sel}`;
    if (seen.has(k)) continue;
    seen.add(k);
    add("contract-13", e.t, `${e.stage}: ${e.sel}${e.text ? ` "${e.text}"` : ""} from ${e.from} still on screen (each stage clears its own UI)`);
  }
}
// 14 (ART-18): one talk animation, no bigger or faster than the shared one
function check14(tl, segs, add) {
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "talk") continue;
    const S = { ...TALK_SPEC, ...(e.spec || {}) };
    for (const a of e.list || []) {
      let why = null;
      if (a.via === "phaser") {
        const w = [];
        if (a.dy > S.lift + 0.5) w.push(`lifts ${a.dy} px (shared: ${S.lift})`);
        if (a.da > S.tilt + 0.15) w.push(`tilts ${a.da}° (shared: ${S.tilt})`);
        if (a.ms && a.ms < S.ms - 30) w.push(`every ${a.ms} ms (shared: ${S.ms})`);
        if (w.length) why = w.join(", ");
      } else if (a.name !== "njg-talk") why = `its own talk animation "${a.name}" (${a.ms} ms), not the shared njg-talk`;
      else if (a.ms && a.ms < S.ms - 30) why = `njg-talk every ${a.ms} ms (shared: ${S.ms})`;
      if (!why) continue;
      const s = segAt(segs, e.t), k = `${s && s.key}|${a.who}|${a.via}|${a.name || ""}`;
      if (seen.has(k)) continue;
      seen.add(k);
      add("contract-14", e.t, `${s ? s.key : "?"}: ${a.who} talking (${a.via}) ${why}`);
    }
  }
}

// the lexicon's words for contract-16, read once per root (build/sandbox/lib/evidence.mjs lexiconWords)
const LEXICA = new Map();
function lexiconFor(root) {
  if (!LEXICA.has(root)) LEXICA.set(root, existsSync(join(root, "data/lang/lexicon.json")) ? lexiconWords(root) : null);
  return LEXICA.get(root);
}
const NUMS = new Map();
function numbersFor(root) {
  if (!NUMS.has(root)) NUMS.set(root, existsSync(join(root, "data/lang/lexicon.json")) ? (lexiconWords(root, { tags: true }).tags.number || new Set()) : null);
  return NUMS.get(root);
}
function check19(r, tl, segs, v, nums, add) {
  if (!nums || !nums.size) return;
  const level = levelOf(r.flow || "");
  const split = (s) => String(s || "").toLowerCase().normalize("NFC").match(/[\p{L}][\p{L}\p{M}'’]*/gu) || [];
  const seen = new Set();
  if (level >= 2) {
    // the request pop-up reads the order out (a phase's own pop-up mid-stage: the daar stir's "Muke daar khape, ba."):
    // a number said while it is up is the order, heard, never counting along
    const pops = [];
    for (const e of tl) if (e.type === "c" && e.k === "popup") {
      if (e.open && (!pops.length || pops[pops.length - 1].t1 != null)) pops.push({ t0: e.t, t1: null });
      else if (!e.open && pops.length && pops[pops.length - 1].t1 == null) pops[pops.length - 1].t1 = e.t;
    }
    const asks = tl.filter((e) => e.type === "c" && e.k === "life" && e.what === "request").map((e) => e.t);
    const inPopup = (t) => pops.some((p) => t >= p.t0 - 150 && (p.t1 == null || t <= p.t1)) || asks.some((a) => t >= a && t - a < 150);
    const firstTap = (t) => { const s = segAt(segs, t); const from = s ? s.t0 : -Infinity; const i = tl.find((e) => e.type === "c" && e.k === "input" && !e.popup && e.t >= from); return i ? i.t : Infinity; };
    for (const l of v.lines) {
      // a count-down the game says on its own (the boing jab: the doctor counts down to it) is not counting along; nor are
      // the daar stir's laps, said aloud at every level (DAAR-24 retired, Zafar 14 Oct: the exception D12 asked for)
      if (l.role === "countdown" || l.role === "laps" || inPopup(l.t0)) continue;
      const ws = split(l.text);
      if (ws.length && ws.length <= 2 && ws.every((x) => nums.has(x)) && l.t0 > firstTap(l.t0) && !seen.has(l.text + l.t0)) { seen.add(l.text + l.t0); add("contract-19", l.t0, `"${l.text}" is counting along at L${level}`); }
    }
  }
}
// Zafar, 14 Oct: until launch, English marked to record passes (it will be recorded in Kutchi); on the store build (run.mjs
// --store) a to-record placeholder is a break, so nothing ships with one
function check16(tl, lex, add, store) {
  if (!lex) return;
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "texts") continue;
    for (const x of e.list || []) {
      if (x.rec && store && !x.grown && !seen.has("rec:" + x.t)) { seen.add("rec:" + x.t); add("contract-16", e.t, `"${x.t}" (${x.sel}): a to-record placeholder on the store build`); continue; }
      // a door line's English (rule 5's door exception) is contract-46's to judge
      // a player's own name, typed by a grown-up on the who's-playing screen (the hook's name tag), is not English
      if (x.rec || x.en || x.grown || x.door || x.name) continue;
      const words = (String(x.t).toLowerCase().normalize("NFC").match(/[\p{L}][\p{L}\p{M}'’]*/gu) || []).map((w) => w.replace(/’/g, "'")).filter((w) => w.length > 1 && !lex.has(w));
      if (!words.length) continue;
      const k = x.t;
      if (seen.has(k)) continue;
      seen.add(k);
      add("contract-16", e.t, `"${x.t}" (${x.sel}): ${[...new Set(words)].join(", ")}`);
    }
  }
}
function check20(tl, add) {
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "faces") continue;
    const say = (m) => { if (!seen.has(m)) { seen.add(m); add("contract-20", e.t, m); } };
    const list = e.list || [];
    if (e.clinic && e.figFull) for (const f of list) if (!f.doctor && f.who && f.who !== "doctor") say(`${f.who || "a person"}'s face circle while she is on screen in full (${f.sel})`);
    const by = {}; for (const f of list) if (f.who) by[f.who] = (by[f.who] || 0) + 1;
    for (const [w, n] of Object.entries(by)) if (n > 1) say(`two faces of ${w} on screen (${list.filter((f) => f.who === w).map((f) => f.sel).join(", ")})`);
    const cs = {}; for (const c of e.cards || []) cs[c] = (cs[c] || 0) + 1;
    for (const [w, n] of Object.entries(cs)) if (n > 1) say(`two cards for ${w}`);
  }
}
// 18 (checks-to-build 6): a row ticks only after its step closed; a row keeps its words through its stage
export const TICK_AFTER = 1000; // ms a row may tick after its step-close
function check18(tl, segs, add) {
  const closes = tl.filter((e) => e.type === "c" && e.k === "life" && e.what === "step-close").map((e) => ({ t: e.t, step: e.step != null ? String(e.step) : String(e.reason || "") }));
  const letters = (x) => /\p{L}/u.test(x || "");
  const prev = new Map();
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "rows") continue;
    const s = segAt(segs, e.t);
    for (const x of e.list || []) {
      const p = prev.get(x.id);
      prev.set(x.id, { ...x, seg: s });
      if (!p || p.seg !== s) continue;
      if (!p.done && x.done) {
        // the sampler sees a tick up to 100 ms after it is drawn; the log is at its own millisecond
        const ok = closes.some((c) => c.t <= e.t + 30 && c.t >= e.t - TICK_AFTER - 100 && (x.key == null || c.step === String(x.key)));
        const k = `tick|${s && s.key}|${x.id}`;
        if (!ok && !seen.has(k)) { seen.add(k); add("contract-18", e.t, `${s ? s.key : "?"}: the row "${x.text}"${x.key ? ` (${x.key})` : ""} ticked with no step-close logged for it in the ${TICK_AFTER / 1000} s before`); }
      }
      // a hidden count ("•••") written in when it is heard (decision 57) is not a change of words
      const masked = (a, b) => /•/.test(a) && new RegExp("^" + a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/•+/g, "\\S+") + "$", "u").test(b);
      if (!x.en && !p.en && letters(p.text) && letters(x.text) && p.text !== x.text && !masked(p.text, x.text)) {
        const k = `words|${s && s.key}|${x.id}|${p.text}|${x.text}`;
        if (!seen.has(k)) { seen.add(k); add("contract-18", e.t, `${s ? s.key : "?"}: the row${x.key ? ` ${x.key}` : ""} changed its words mid-stage, "${p.text}" to "${x.text}"`); }
      }
    }
  }
}
// 21 (checks-to-build 20, E5): a tap in the play area while a line is voiced is handed to the game within 150 ms
export const ACT_MS = 150;
const expectsInput = (exp) => {
  if (!exp) return false;
  if (exp.heal) return /^(tap|drag|hold)$/.test(exp.heal.do || "");
  if (exp.clinic) return !!exp.clinic.kind && !/^(wait|button)$/.test(exp.clinic.kind);
  if (exp.cook) return !!exp.cook.kind && !/^(wait|idle)$/.test(exp.cook.kind) && !exp.cook.intro;
  if (exp.hostExp) return !!exp.hostExp.kind && !/^(wait|button)$/.test(exp.hostExp.kind);
  return false;
};
function check21(tl, segs, v, add) {
  const acts = tl.filter((e) => e.type === "c" && e.k === "life" && e.what === "act").map((e) => e.t);
  // a line being said: a clip of it sounding, or the line itself between its start and its end (a line with no clip yet is
  // still said, at its words' pace)
  const sounding = (t) => (v.plays.find((p) => !p.est && p.line && p.t0 <= t && t <= p.t1) || {}).line || v.lines.find((l) => l.t1 != null && (l.text || "").trim() && l.t0 <= t && t <= l.t1);
  // a tap the first-time help blocked (js/shared/onboard.js: a touch outside its light is stopped on capture) never reaches the game
  // and logs no act: the probe logs it as input-blocked right after
  const blocked = tl.filter((e) => e.type === "c" && e.k === "input-blocked");
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "input" || !e.play || e.popup || e.side || e.next || !expectsInput(e.exp)) continue;
    if (blocked.some((b) => b.t >= e.t && b.t <= e.t + 100 && Math.abs(b.x - e.x) <= 2 && Math.abs(b.y - e.y) <= 2)) continue;
    const line = sounding(e.t);
    if (!line) continue;
    if (acts.some((t) => t >= e.t - 30 && t <= e.t + ACT_MS)) continue;
    const s = segAt(segs, e.t), k = `${s && s.key}|${e.on}`;
    if (seen.has(k)) continue;
    seen.add(k);
    add("contract-21", e.t, `${s ? s.key : "?"}: a tap on ${e.on} at ${e.x},${e.y} while "${line.text}" was being said: no act logged within ${ACT_MS} ms (the game expected ${JSON.stringify(e.exp)})`);
  }
}
// ---- S08 wave 1A: voice and help in every game (PAN-04, PAN-16, SH-94, SH-60, SH-95, SH-96, LNG-16) ----
// The ladder these measure is the ONE table, data/shared.json helpMs (js/shared/guide.js PAUSE through Tokens.ladder; S13-A1): the
// help comes only after the child has done nothing for this long (by level), counted from the LAST action. Read from the table,
// never a copy of it (S13-B1)
const SHARED_LADDER = (() => {
  try {
    return JSON.parse(readFileSync(new URL("../../../data/shared.json", import.meta.url), "utf8"));
  } catch (e) {
    return {};
  }
})();
export const LADDER = Array.isArray(SHARED_LADDER.helpMs) ? SHARED_LADDER.helpMs.slice() : [];
export const BULB_PULSE_MIN = 15000; // the bulbs pulse after 15-20 s stuck (Zafar, 17 Oct): never before 15 s
export const BULB_PULSE_MAX = 21000; // ... and by 21 s of no action they must be pulsing
export const SAID_AGAIN = 10000; // a line is not said again within this long (PAN-16: "about 10 s": judged from 9 s)
const SAID_JUDGED = 9000;
const SLOP = 400; // ms: the sampler, a timer's tick
const isCookLine = (l) => /^cook/.test(l.who || "");
const isCountLine = (l, nums) => {
  const ws = String(l.text || "").toLowerCase().normalize("NFC").match(/[\p{L}][\p{L}\p{M}'’]*/gu) || [];
  return l.role === "laps" || l.role === "countdown" || (!!nums && ws.length > 0 && ws.length <= 2 && ws.every((x) => nums.has(x)));
};
// a tap that asked to hear it (the speaker on her face or a card, the order replayed, a chip): its line is the child's own, not a repeat
const askedAt = (inputs, t) => inputs.some((i) => i.t <= t + 20 && t - i.t <= 700 && (i.side || i.popup || i.btn));
// the last thing the child did before t: a real tap in the play area or a button, the stage opening (Lifecycle stage-start), or the step opening
function lastAction(tl, t, { steps = false } = {}) {
  let last = -Infinity;
  for (const e of tl) {
    if (e.t > t) break;
    if (e.type === "c" && e.k === "input") last = Math.max(last, e.t);
    else if (e.type === "c" && e.k === "life" && (e.what === "stage-start" || (steps && e.what === "step-open"))) last = Math.max(last, e.t);
  }
  return last;
}
// the request pop-up's open windows ({t0, t1}) from the probe's popup samples
function popupWindows(tl) {
  const pops = [];
  for (const e of tl) if (e.type === "c" && e.k === "popup") {
    if (e.open && (!pops.length || pops[pops.length - 1].t1 != null)) pops.push({ t0: e.t, t1: null });
    else if (!e.open && pops.length && pops[pops.length - 1].t1 == null) pops[pops.length - 1].t1 = e.t;
  }
  return pops;
}
// 22 (PAN-04, PAN-16): each line said once and whole
function check22(r, tl, segs, v, nums, add) {
  // Cook's test speed shortens the game's own waits (and its clip timers) but not the help's real-time ones: a repeat is judged
  // against 10 s of the child's time (10 s / speed in the run), a help line's against 10 s of the clock; a clip cut short only
  // where the timing is real (a #speed1 flow, a child's pace)
  const speed = +((/#speed(\d+)/.exec(r.flow || "") || [])[1] || 3);
  const inputs = tl.filter((e) => e.type === "c" && e.k === "input");
  // (s08 w6d, wave 6A: a count word is a tally of the child's taps, not a line the game says twice, as contract-30 treats it; and the
  // request pop-up reads each person's order in their own words, so two people ordering the same thing say the same line twice there)
  const pops = popupWindows(tl);
  const inPop = (t) => pops.some((p) => t >= p.t0 - 150 && (p.t1 == null || t <= p.t1 + 150));
  const lines = v.lines.filter((l) => (l.text || "").trim() && isCookLine(l) && l.role !== "item" && l.role !== "count" && !isCountLine(l, nums)).sort((a, b) => a.t0 - b.t0);
  const seen = new Set();
  const norm = (s) => normW(s).replace(/\s+/g, " ");
  // MAA-15 (Zafar, 17 Oct: "she should say it the second time"): a step the game opens with its call said again on purpose
  // (Lifecycle step-call "queued-again": maani's Firai on its second turn) is a new step's call, not a repeat
  const againAt = tl.filter((e) => e.type === "c" && e.k === "life" && e.what === "step-call" && e.by === "queued-again").map((e) => e.t);
  for (let i = 0; i < lines.length; i++) for (let j = i + 1; j < lines.length; j++) {
    const a = lines[i], b = lines[j];
    if (b.t0 - a.t0 >= SAID_AGAIN) break;
    if (b.t0 - a.t0 >= (b.role === "howto" ? SAID_JUDGED : SAID_JUDGED / speed)) continue;
    if (norm(a.text) !== norm(b.text) || !norm(a.text)) continue;
    if (inPop(a.t0) && inPop(b.t0)) continue;
    if (askedAt(inputs, b.t0) || (norm(a.text).split(" ").length === 1 && inputs.some((x) => x.t <= b.t0 + 20 && b.t0 - x.t <= 400))) continue;
    if (b.role === "call" && againAt.some((t) => t > a.t0 && t <= b.t0 + 50)) continue;
    const s = segAt(segs, b.t0), k = `${s && s.key}|${norm(a.text)}`;
    // (the pop-up's read-out before the station is the order card's: two people may ask for the same thing, each in their own words; the serve and the praise between stations are judged too, wave 1B: "Shabash!" once)
    if (!s || !(isPlayStage(s.key) || /cook:between|cook:closing/.test(s.key))) continue;
    if (seen.has(k)) continue;
    seen.add(k);
    add("contract-22", b.t0, `${s ? s.key : "?"}: "${b.text}" said twice, ${Math.round(b.t0 - a.t0)} ms apart (a line is said once; again only after ${SAID_AGAIN / 1000} s idle)`);
  }
  // whole: a clip cut short by another LINE starting over it (not the next word of its own line), with no stop the game made near it
  if (speed !== 1) return;
  const stops = tl.filter((e) => e.type === "voice-stop" || (e.type === "c" && e.k === "life" && /^(stage-end|stage-start|request|results|advance)$/.test(e.what))).map((e) => e.t);
  for (const p of v.plays) {
    if (p.est || !p.line || p.end == null || !/^(stop|pause|cancel)$/.test(p.why || "")) continue;
    const natural = p.t0 + p.dur * 1000;
    if (natural - p.end < 150) continue;
    if (stops.some((t) => Math.abs(t - p.end) <= 300)) continue;
    const next = v.plays.find((q) => q !== p && q.t0 >= p.end - 60 && q.t0 <= p.end + 60);
    if (next && next.line === p.line) continue;
    const s = segAt(segs, p.end), k = `cut|${s && s.key}|${p.url}`;
    if (seen.has(k)) continue;
    seen.add(k);
    add("contract-22", p.end, `${s ? s.key : "?"}: "${p.line.text}" cut off ${Math.round(natural - p.end)} ms before its end (${p.url || p.via}, by ${p.why}) with no stop from the game: another line began over it`);
  }
}
// 23 (SH-94): an item's name on a tap only when nothing else is speaking, never at levels 3 and 4, the same word again only after 10 s
function check23(r, tl, segs, v, add) {
  const level = levelOf(r.flow || "");
  // (a pop the queue dropped because something was speaking made no sound: only a pop that sounded is judged)
  // An item's name is a line tagged role item (js/cook/words.js Lang.popWord); a build before the tag has the same thing as one
  // untagged word said right after a tap on the pictures (a chip's word, role hear, is the child asking to hear it: not a pop)
  const taps = tl.filter((e) => e.type === "c" && e.k === "input" && e.on === "canvas");
  const oneWord = (l) => normW(l.text).split(" ").filter(Boolean).length === 1;
  const isPop = (l) => l.role === "item" || (!l.role && oneWord(l) && taps.some((i) => i.t <= l.t0 + 20 && l.t0 - i.t <= 400));
  const pops = v.lines.filter((l) => (l.text || "").trim() && isCookLine(l) && isPop(l) && l.plays.length && !l.silent).sort((a, b) => a.t0 - b.t0);
  const others = v.lines.filter((l) => !pops.includes(l) && (l.text || "").trim() && isCookLine(l));
  const seen = new Set();
  const norm = (s) => normW(s).replace(/\s+/g, " ");
  pops.forEach((p, i) => {
    const s = segAt(segs, p.t0);
    const say = (why) => { const k = `${s && s.key}|${norm(p.text)}|${why}`; if (!seen.has(k)) { seen.add(k); add("contract-23", p.t0, `${s ? s.key : "?"}: the item word "${p.text}" ${why}`); } };
    if (level >= 3) return say(`was said at level ${level} (an item's name on a tap is for levels 1 and 2 only)`);
    // over another line: another line was open (from its call to its end, or a clip of it sounding)
    const over = others.find((l) => l.t0 < p.t0 && (l.t1 == null || l.t1 > p.t0 + 30));
    const sounding = v.plays.find((q) => q.line && q.line !== p && !pops.includes(q.line) && !q.est && q.t0 < p.t0 && q.t1 > p.t0 + 100);
    if (over || sounding) return say(`started while "${(over || sounding.line).text}" was being said`);
    const prev = pops.slice(0, i).reverse().find((q) => norm(q.text) === norm(p.text));
    if (prev && p.t0 - prev.t0 < SAID_AGAIN) say(`was said again ${Math.round(p.t0 - prev.t0)} ms after the last time (again only after ${SAID_AGAIN / 1000} s)`);
  });
}
// 24 (SH-60, SH-95): no help line or glow before the idle time, counted from the last action (by level)
const CONTINUOUS = /^(hold|drag|stir|swipe|roll|circle|pour|slice|cut)$/;
function check24(r, tl, segs, v, add) {
  if (/#mistake/.test(r.flow || "")) return; // a wrong pick is an action, and the game answers it
  const level = levelOf(r.flow || "");
  const need = LADDER[Math.min(LADDER.length, level) - 1];
  const seen = new Set();
  const flag = (t, what) => {
    const ref = lastAction(tl, t);
    if (!isFinite(ref) || t - ref >= need - SLOP) return;
    // the last thing she did was a hold, a drag, a stir or a swipe: the probe sees where it began, not when she let go
    const last = tl.filter((e) => e.type === "c" && e.k === "input" && e.t <= t && e.t >= ref - 1).pop();
    if (last && CONTINUOUS.test((last.exp && last.exp.cook && last.exp.cook.kind) || "")) return;
    const s = segAt(segs, t), k = `${s && s.key}|${what}`;
    if (seen.has(k)) return;
    seen.add(k);
    add("contract-24", t, `${s ? s.key : "?"}: ${what} ${Math.round(t - ref)} ms after the last action (L${level} waits ${need} ms)`);
  };
  const inputs = tl.filter((e) => e.type === "c" && e.k === "input");
  // the help itself (the stepper's and the step engine's, logged when it fires)
  for (const e of tl) if (e.type === "c" && e.k === "life" && e.what === "help" && e.reason === "idle") flag(e.t, `Nani's help (voice and glow) came`);
  // a step line she says (her how-to lines are the steps' help), not a replay the child asked for
  for (const l of v.lines) if (l.role === "howto" && (l.text || "").trim() && !askedAt(inputs, l.t0)) flag(l.t0, `her step line "${l.text}" was said`);
  // a glow switching on
  // (Zafar, 22 Oct: CHAI-32, EASY-03: the onboarding kit's own rungs light the item on their own clock: the first time a step
  // comes up, the box and the item's glow at once; chai's ladder, the item's glow with its card at 5 s. A glow that comes with
  // a rung of the kit (Lifecycle "rung", js/shared/onboard.js Onboard.stuck) is that help, not Nani's early)
  const rungs = tl.filter((e) => e.type === "c" && e.k === "life" && e.what === "rung").map((e) => e.t);
  const byRung = (t) => rungs.some((r) => t >= r - 100 && t <= r + 1500);
  let prev = new Set();
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "hl") continue;
    const now = new Set((e.list || []).filter((x) => /^cook:/.test(x)));
    for (const x of now) if (!prev.has(x) && !byRung(e.t)) flag(e.t, `the glow on ${x.replace(/^cook:/, "")} came`);
    prev = now;
  }
}
// 25 (SH-96): both light bulbs pulse after 15-20 s stuck, never before
function check25(tl, segs, add) {
  const seen = new Set();
  const pulses = tl.filter((e) => e.type === "c" && e.k === "life" && e.what === "bulb-pulse");
  for (const e of pulses) {
    if (e.reason !== "on") continue;
    const ref = lastAction(tl, e.t, { steps: false });
    if (isFinite(ref) && e.t - ref < BULB_PULSE_MIN - SLOP) { const s = segAt(segs, e.t); add("contract-25", e.t, `${s ? s.key : "?"}: the bulbs began to pulse ${Math.round(e.t - ref)} ms after the last action (not before ${BULB_PULSE_MIN} ms)`); }
  }
  // a stretch of no action at least BULB_PULSE_MAX long inside a play stage must have had the pulse start
  // any real tap is an action (the shared guide's idle clock restarts on every pointerdown: the card's face, a peek, the bulb as much as a tap in the play area; s08 w1b, SH-102: a replay is a child doing something)
  const inputs = tl.filter((e) => e.type === "c" && e.k === "input");
  for (const s of segs) {
    if (!isPlayStage(s.key)) continue;
    const end = s.t1 == null ? (tl[tl.length - 1] || {}).t : s.t1;
    const ts = [s.t0, ...inputs.filter((i) => i.t >= s.t0 && i.t < end).map((i) => i.t), end];
    for (let i = 0; i + 1 < ts.length; i++) {
      if (ts[i + 1] - ts[i] < BULB_PULSE_MAX + SLOP) continue;
      const on = pulses.some((p) => p.reason === "on" && p.t >= ts[i] && p.t <= ts[i + 1]);
      const k = `${s.key}|${ts[i]}`;
      if (!on && !seen.has(k)) { seen.add(k); add("contract-25", ts[i] + BULB_PULSE_MAX, `${s.key}: ${Math.round((ts[i + 1] - ts[i]) / 1000)} s with no action and the bulbs never pulsed (they pulse after ${BULB_PULSE_MIN / 1000}-${BULB_PULSE_MAX / 1000} s)`); }
    }
  }
}
// 26 (LNG-16): the opening line is heard whole, every order: every word of a line said while the request pop-up is up sounds
// (a family clip of that word, or the device voice saying it), never silently dropped
function check26(tl, v, add, root, lex) {
  if (!lex) return;
  const pops = [];
  for (const e of tl) if (e.type === "c" && e.k === "popup") {
    if (e.open && (!pops.length || pops[pops.length - 1].t1 != null)) pops.push({ t0: e.t, t1: null });
    else if (!e.open && pops.length && pops[pops.length - 1].t1 == null) pops[pops.length - 1].t1 = e.t;
  }
  if (!pops.length) return;
  const fam = fileWords(root);
  const stops = tl.filter((e) => e.type === "voice-stop").map((e) => e.t);
  // a tap on the pop-up itself (the test player taps 0.1 s after it opens, on find) ends the read-out as a voice stop does
  const popTaps = tl.filter((e) => e.type === "c" && e.k === "input" && e.popup).map((e) => e.t);
  // the words on screen as a to-record placeholder (grey italic, decision 84: dress's "white socks"): never spoken, never missing
  const placeholder = new Set();
  for (const e of tl) if (e.type === "c" && e.k === "texts") for (const x of e.list || []) if (x.rec) for (const w of normW(x.t || "").split(" ")) if (w) placeholder.add(w);
  const seen = new Set();
  for (const p of pops) {
    for (const l of v.lines) {
      if (!(l.text || "").trim() || !isCookLine(l) || l.t0 < p.t0 - 100 || (p.t1 != null && l.t0 > p.t1)) continue;
      // a tap through the pop-up (or any stop the game made) ends the read-out: what it had not said yet was cut on purpose
      if (stops.some((t) => t > l.t0 && t <= (l.t1 == null ? l.t0 + 5000 : l.t1) + 200)) continue;
      if (popTaps.some((t) => t >= p.t0 - 150 && t > l.t0 - 300 && t <= (l.t1 == null ? l.t0 + 5000 : l.t1) + 200)) continue;
      // (s08 w6L) the pop-up the test player tapped through folds, and the game says the order again as it closes (Find it: the same line
      // 3 ms before the fold, in the page's fast test speed, its clips cut by the fold): that second saying is the fold's, not the opening
      if (p.t1 != null && l.t0 >= p.t1 - 400 && popTaps.some((t) => t >= p.t0 - 150 && t <= p.t1 + 150)) continue;
      // (s08 w6L) a line that played nothing and is mostly to-record placeholder words ("For Nana: blue dupatta.", Dress up: the grey
      // words are not spoken, and the name in it has no clip alone) is a to-record line: never spoken, so never "not heard whole"
      const lw = normW(l.text).split(" ").filter(Boolean);
      if (!l.plays.some((q) => !/^silent line/.test(q.via || "")) && lw.length && lw.filter((w) => placeholder.has(w) || ENGLISH_PLACEHOLDERS.has(w)).length * 2 >= lw.length) continue;
      const heard = new Set();
      const lineWords = new Set(normW(l.text).split(" "));
      let respelled = 0; // device-voice pieces that say a word by its respelling (the lexicon's say: "ba" is "ber")
      for (const q of l.plays) {
        if (q.via === "speechSynthesis" && normW(q.text || "").split(" ").some((w) => w && !lineWords.has(w))) respelled++;
        const f = String(q.url || "").split("?")[0];
        const t = q.via === "speechSynthesis" ? q.text : fam.get(f) || ((/cook-tts\/([^/]+)\.mp3$/.exec(f) || [])[1]);
        for (const w of normW(t || "").split(" ")) if (w) heard.add(w);
      }
      // (an English placeholder in the line, grey italic, is never spoken: only the lexicon's words are judged)
      const missing = normW(l.text).split(" ").filter((w) => w && lex.has(w) && !ENGLISH_PLACEHOLDERS.has(w) && !placeholder.has(w) && !heard.has(w)).slice(respelled);
      if (!missing.length || seen.has(l.text)) continue;
      seen.add(l.text);
      add("contract-26", l.t0, `the opening line "${l.text}" was not heard whole: ${[...new Set(missing)].join(", ")} had no sound (no clip played and the device voice did not say it)`);
    }
  }
}
// the engine's grey English placeholders (a to-record frame word with no Kutchi yet): never spoken, so never a missing sound
const ENGLISH_PLACEHOLDERS = new Set(["with", "and", "also", "only", "for", "but", "or"]);
// family clip file -> its words (data/family-audio.json), and the placeholder TTS files by name
const FILE_WORDS = new Map();
function fileWords(root) {
  if (FILE_WORDS.has(root)) return FILE_WORDS.get(root);
  const m = new Map();
  const p = join(root, "data", "family-audio.json");
  if (existsSync(p)) for (const e of JSON.parse(readFileSync(p, "utf8"))) if (e && e.file && e.kutchi) m.set(e.file, e.kutchi);
  FILE_WORDS.set(root, m);
  return m;
}
function check17(r, tl, add) {
  if (!r.store || !r.sound) return;
  for (const p of r.sound.plays || []) if (p.kind !== "family-ok") add("contract-17", r.t0 || (tl[0] && tl[0].t) || 0, `${p.kind}: ${p.file || p.text || "?"}${p.n > 1 ? ` x${p.n}` : ""}`);
}
// ---- s08 wave 1B: the card and what is said (SH-98 to SH-103, SH-107, SAM-23, CLN-160, CLN-161, CLN-169, CLN-171) ----
// the peek's time by level, from data (data/cook.json calm.peekMs; the clinic's Kit.PEEK_MS): 7 s at level 3 (double the old 3.5 s,
// SH-101) and the same 3.5 s added to the others, so 7 s at every level
export const PEEK_MS = { 1: 7000, 2: 7000, 3: 7000, 4: 7000 };
const wordsOf = (s) => String(s || "").toLowerCase().normalize("NFC").match(/[\p{L}\p{N}][\p{L}\p{M}\p{N}'’]*/gu) || [];
// 27 (SH-98): the small bulb's peek shows every word in Kutchi: never a dotted one
function check27(tl, add) {
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "side" || !(e.peek > 0) || !(e.dots > 0)) continue;
    const k = (e.words || []).join("|");
    if (seen.has(k)) continue;
    seen.add(k);
    add("contract-27", e.t, `a peeking card shows ${e.dots} dotted word${e.dots > 1 ? "s" : ""} (•••): the peek shows every word in Kutchi${(e.words || []).length ? ` ("${e.words.join(" / ")}")` : ""}`);
  }
}
// 28 (SH-100): one bulb picture everywhere: the photo (assets/ui/results/icon-bulb.webp), never the flat drawing
function check28(tl, add) {
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "bulbs") continue;
    for (const b of e.list || []) {
      const ok = (b.kind === "img" || b.kind === "bg") && /^icon-bulb\.webp$/.test(b.file || "");
      const k = `${b.sel}|${b.kind}|${b.file}`;
      if (ok || seen.has(k)) continue;
      seen.add(k);
      add("contract-28", e.t, `${b.sel} is drawn ${b.kind === "svg" ? "as the flat inline drawing" : `with ${b.file || b.kind}`}, not the photo icon-bulb.webp (one bulb picture everywhere)`);
    }
  }
}
// 29 (SH-101): a peek lasts the level's time (data), not less: judged as a child's time (Cook's test speed shortens it; the clinic's peek is real time)
function check29(r, tl, segs, add) {
  const level = levelOf(r.flow || "");
  const speed = /^clinic:/.test(r.flow || "") ? 1 : +((/#speed(\d+)/.exec(r.flow || "") || [])[1] || 3);
  const want = (PEEK_MS[level] || PEEK_MS[3]) / speed;
  let open = null;
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "side") continue;
    if (e.peek > 0 && !open) open = { t0: e.t, n: e.n, seg: segAt(segs, e.t) };
    else if (!(e.peek > 0) && open) {
      const o = open;
      open = null;
      // a card that went away, a stage that ended, or the light bulb pressed (the bulb opens the card in English and ends the look: SH-41) closes the peek on purpose
      if (e.n !== o.n || segAt(segs, e.t) !== o.seg) continue;
      if (tl.some((x) => x.type === "c" && x.k === "input" && /bulb/.test(x.btn || x.on || "") && x.t >= o.t0 && x.t <= e.t + 250)) continue;
      const took = e.t - o.t0;
      if (took < want - 450) add("contract-29", o.t0, `a peek lasted ${Math.round(took)} ms; level ${level} gives ${Math.round(want)} ms${speed > 1 ? ` (${PEEK_MS[level] || PEEK_MS[3]} ms at the test speed ${speed})` : ""}`);
    }
  }
}
// 30 (SH-99): every number said in an order or a step is written on the card, at every level and in every round (a taught one too);
// a line's English placeholder ([red]: a colour or item with no Kutchi yet) is written there too
// the number one's forms (data/lang/lexicon.json num.1: hakro, hakri; the old spellings too): a card writes the bare item for one
const ONE_FORMS = new Set(["hakro", "hakri", "hik", "hikdo", "hikdi", "ek"]);
const WRITTEN_SKIP = new Set(["item", "laps", "countdown", "count"]); // (s08 w2A: "count", L1 counting along the taps, "hakro bataato, ba bataata": a tally, not the order)
function check30(r, tl, segs, v, nums, add) {
  if (!nums || !nums.size) return;
  const cards = tl.filter((e) => e.type === "c" && e.k === "card" && (e.words || []).length).map((e) => ({ t: e.t, words: wordsOf((e.words || []).join(" ")) }));
  if (!cards.length) return;
  const seen = new Set();
  for (const l of v.lines) {
    const text = String(l.text || "").trim();
    if (!text || WRITTEN_SKIP.has(l.role) || isCountLine(l, nums)) continue;
    // a day page (day.html, Sprint 9) has no order cards: its side cards are the door's weather and activity, so its lines are
    // not orders to write down (the book's placeholder "What did we do today?" read as the number do, 21 Oct)
    if (/^day:/.test(String(l.who || ""))) continue;
    // the stage it was said in (the request pop-up reads the order out before the station's own stage starts: the first stage's)
    const s = segAt(segs, l.t0) || segs[0] || { key: "page", t0: -Infinity, t1: null };
    if (/cook:between|cook:closing/.test(s.key)) continue;
    // the cards of that stage: from a little before it (the card opens with the request) to its end, whenever they were drawn
    const mine = cards.filter((c) => c.t >= s.t0 - 10000 && (s.t1 == null || c.t <= s.t1));
    if (!mine.length) continue;
    const written = new Set(mine.flatMap((c) => c.words));
    const said = wordsOf(text.replace(/\[[^\]]*\]/g, " "));
    for (const [i, w] of said.entries()) {
      if (!nums.has(w) || written.has(w) || seen.has(`${s.key}|${w}`)) continue;
      // s08 w2A (Zafar, 19 Oct: "we don't need to write one, only two or more"): a said one with its bare item written passes
      if (ONE_FORMS.has(w) && said[i + 1] && written.has(said[i + 1])) continue;
      seen.add(`${s.key}|${w}`);
      add("contract-30", l.t0, `${s.key}: "${text}" says ${w}, which no card written in this stage holds (every number said is written)`);
    }
    for (const m of text.matchAll(/\[([^\]]+)\]/g)) {
      const missing = wordsOf(m[1]).filter((w) => !written.has(w));
      if (!missing.length || seen.has(`${s.key}|[${m[1]}`)) continue;
      seen.add(`${s.key}|[${m[1]}`);
      add("contract-30", l.t0, `${s.key}: "${text}" says [${m[1]}], which no card written in this stage holds`);
    }
  }
}
// 31 (SH-102, SH-114): a replay (the speaker, a tap on a face) is free and says only the steps not yet done
const REPLAY_WINDOW = 7000;
function check31(tl, v, add) {
  const seen = new Set();
  for (const e of tl) if (e.type === "c" && e.k === "hint" && /^(replay|say|hear)$/.test(e.kind || "") && e.counted !== false && !seen.has(`h${e.t}`)) {
    seen.add(`h${e.t}`);
    add("contract-31", e.t, `a replay was counted as a hint (${e.kind}${e.ids ? `: ${[].concat(e.ids).join(", ")}` : ""})`);
  }
  // a tap on a face (the card's replay) with some steps already ticked: what it says must be the steps left
  const rows = tl.filter((e) => e.type === "c" && e.k === "rows");
  const norm = (s) => wordsOf(s).join(" ");
  for (const i of tl) {
    if (i.type !== "c" || i.k !== "input" || !/\b(oc-face|face-say|cl-card-face|ng-face)\b/.test(i.on || "")) continue;
    const before = rows.filter((x) => x.t <= i.t).pop();
    const done = new Set(((before && before.list) || []).filter((x) => x.done && norm(x.text)).map((x) => norm(x.text)));
    if (!done.size) continue;
    for (const l of v.lines) {
      if (l.t0 < i.t || l.t0 > i.t + REPLAY_WINDOW || !norm(l.text) || !done.has(norm(l.text)) || seen.has(`${i.t}|${l.id}`)) continue;
      seen.add(`${i.t}|${l.id}`);
      add("contract-31", l.t0, `a replay said "${l.text}", a step already ticked (a replay says only what is left)`);
    }
  }
}
// 32 (SH-103): the end review's divider leaves room for four right words and one wrong one (the right words are 4/5 of the width with
// none wrong), and moves over as the wrong words grow: the wrong side is as many units wide as it has words (1 to 3), the right side 4
export function reviewShare(bad) { return 4 / (Math.max(1, Math.min(bad, 3)) + 4); }
function check32(tl, add) {
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "review" || e.none || !(e.badW + e.okW > 0)) continue;
    const share = e.okW / (e.badW + e.okW);
    const want = reviewShare(e.bad);
    // content may push a narrow half wider than its share (a long word in one tile at 800x360): never narrower than it, so lower is judged loosely
    const bad = e.bad === 0 ? share < 0.72 || share > 0.88 : share < want - 0.12 || share > want + 0.08;
    const k = `${e.bad}|${e.ok}|${Math.round(share * 20)}`;
    if (!bad || seen.has(k)) continue;
    seen.add(k);
    add("contract-32", e.t, `the review's right words take ${Math.round(share * 100)}% of the width with ${e.bad} wrong and ${e.ok} right (wanted about ${Math.round(want * 100)}%: room for four right and one wrong, the wrong side growing with its count)`);
  }
}
// 38 (SH-104): the end screen has two pages in every game (the badges, the word review): never the steps page
export function check38(tl, add) {
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "endpages") continue;
    if ((e.pages || []).includes(3) || e.step === 3 || e.steps > 0) {
      add("contract-38", e.t, `the end screen holds the steps page (pages ${(e.pages || []).join(", ") || "none"}, showing ${e.step}, ${e.steps} step rows): two pages only in every game (SH-104)`);
      return;
    }
  }
}
// 39 (SH-123): a word card's English shows only while its word is supported (stage 1-2), past that only when the child opens it
export function check39(tl, add) {
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "card-en") continue;
    for (const x of e.list || []) {
      // (S13-B1 round 3; CLAUDE.md non-negotiable 3, Zafar 21 Oct: "then only when tapped"): an order card's row (x.oc) never shows its
      // English untapped, at any stage
      if (x.revealed || (x.stage < 3 && !x.oc) || seen.has(x.word + (x.oc ? "|oc" : ""))) continue;
      seen.add(x.word + (x.oc ? "|oc" : ""));
      if (x.oc) add("contract-39", e.t, `the order card's row for ${x.word} (stage ${x.stage}) shows its English "${x.text}" without the child tapping it open`);
      else add("contract-39", e.t, `the word card for ${x.word} (stage ${x.stage}, past support) shows its English "${x.text}" without the child opening it`);
    }
  }
}
// 33 (SH-107): the order pop-up's headlines are one size per screen, and wrap at full size before they shrink: a size under the full
// one is only for headlines that don't fit two lines, so a pop-up whose every headline is on one line is at full size
function check33(tl, add) {
  const heads = tl.filter((e) => e.type === "c" && e.k === "heads");
  const seen = new Set();
  heads.forEach((e, i) => {
    const list = e.list || [];
    const next = heads[i + 1];
    if (!list.length || (next && next.t - e.t < 400)) return; // (the card is still flying in: its sizes are easing)
    const sizes = [...new Set(list.map((x) => x.size))];
    const k = list.map((x) => `${x.size}/${x.lines}`).join("|");
    if (seen.has(k)) return;
    if (sizes.length > 1) {
      seen.add(k);
      return add("contract-33", e.t, `the order pop-up's headlines are ${sizes.length} sizes at once (${list.map((x) => `"${x.text}" ${x.size}px, ${x.lines} line${x.lines > 1 ? "s" : ""}`).join("; ")}): one size per screen`);
    }
    if (list.every((x) => x.lines <= 1) && list.some((x) => x.size < x.full - 0.5)) {
      seen.add(k);
      add("contract-33", e.t, `the order pop-up's headlines shrank to ${sizes[0]}px (full ${Math.max(...list.map((x) => x.full))}px) to stay on one line: they wrap at full size first, and shrink only when two lines don't fit`);
    }
  });
}
// ---- s08 wave 2A: Cook's level table (SH-110, SAM-26, MAA-18, CK-49; build/reports/research-levels-2026-10-19.md) ----
const isCookFlow = (flow) => /^(cook:|lab:cook\/)/.test(flow || "");
// the station a Cook flow plays (cook:samosa@L3 -> samosa; lab:cook/recipe-chai -> chai)
const stationOf = (flow) => { const m = /^(?:cook:(?:recipe:)?|lab:cook\/(?:recipe-)?)([\w-]+)/.exec(flow || ""); return m ? m[1] : null; };
// the written forms of every item word (a thing to pick: data/cook.json words with a bowl, heap, image, layer or piece, and
// bajri maani and the sekelo meat cube, which have none), from the lexicon with its inflections: what a dotted L3 card must not write in an open row
const ITEMS = new Map();
export function itemForms(root) {
  if (ITEMS.has(root)) return ITEMS.get(root);
  const out = new Set();
  const read = (f) => { try { return JSON.parse(readFileSync(join(root, f), "utf8")); } catch (e) { return null; } };
  const cook = read("data/cook.json") || {};
  const ids = new Set(Object.entries(cook.words || {}).filter(([k, v]) => v && typeof v === "object" && !/^(num|lnk|kin|name)-/.test(k) && (["bowl", "heap", "image", "layer", "piece"].some((f) => f in v) || k === "cook-bajrmaani" || k === "ph-mishkaki")).map(([k]) => k));
  const lex = read("data/lang/lexicon.json") || {};
  const par = (read("data/lang/paradigms.json") || {}).paradigms || {};
  const split = (x) => String(x || "").toLowerCase().normalize("NFC").match(/[\p{L}][\p{L}\p{M}'’]*/gu) || [];
  for (const e of lex.entries || []) {
    if (e.pos !== "N" || !(e.aliases || []).some((a) => ids.has(a))) continue;
    const add = (x) => split(x).forEach((w) => out.add(w));
    add(e.lemma);
    const walk = (v) => { if (typeof v === "string") add(v); else if (v && typeof v === "object") { if (typeof v.t === "string") add(v.t); else Object.values(v).forEach(walk); } };
    walk(e.forms || {});
    const pd = par[e.paradigm];
    if (pd && e.lemma) {
      let stem = e.lemma; const dr = pd.stem && pd.stem.drop; if (dr && stem.endsWith(dr)) stem = stem.slice(0, -dr.length);
      Object.values(pd.cells || {}).map((c) => (c && typeof c === "object" ? c.make : c)).filter((m) => typeof m === "string").forEach((m) => add(m.replace(/\{stem\}/g, stem).replace(/\{lemma\}/g, e.lemma)));
    }
  }
  ITEMS.set(root, out);
  return out;
}
// 35 (SH-110): the card by level: open, open, the item words dotted, hidden
function check35(r, tl, segs, add, root) {
  if (!isCookFlow(r.flow)) return;
  const items = itemForms(root);
  const last = (k, t) => { let s = null; for (const e of tl) { if (e.t > t) break; if (e.type === "c" && e.k === k) s = e; } return s; };
  const inputs = tl.filter((e) => e.type === "c" && e.k === "input" && !e.popup && !e.side && !e.next);
  for (const s of segs) {
    if (!/(^|\|)cook:station/.test(s.key)) continue;
    const end = s.t1 == null ? Infinity : s.t1;
    const first = inputs.find((i) => i.t >= s.t0 && i.t < end);
    if (!first) continue;
    const side = last("side", first.t);
    // (the rows as the child reads them: the last sample in the stage before that tap with no row under the bulb's English)
    const rows = tl.filter((e) => e.type === "c" && e.k === "rows" && e.t <= first.t && e.t >= s.t0 - 10000 && !(e.list || []).some((x) => x.en)).pop() || last("rows", first.t);
    if (!side || !side.n) continue;
    // a peeking card (the bulb's peek) shows every word, contract-27's rule: it is not the card at rest that this check judges
    if (side.peek > 0) continue;
    const level = realLevel(tl, first.t, levelOf(r.flow || ""));
    const at = `${s.key} at L${level}`;
    // SH-110 (Zafar, 26 Oct: "we can't just have fully blanked out order cards on the left when the game starts"): L4 is as L3 now,
    // open with its item words dotted (each dotted row with its speaker, contract-40); was: every card folded at L4
    const all = ((rows && rows.list) || []).filter((x) => !x.en);
    const open = all.filter((x) => !x.done && !/\bna$/.test((x.text || "").trim())); // (a "no" row, "dhania na", is never ticked)
    // the card you work from is open: a second card may fold for a phase it can't be acted on (the order card under Nani's
    // chop card, design system 13), and a card whose rows are all ticked may fold (samosa's fry); every card closed is a break
    if (side.closed >= side.n && !(all.length && !open.length)) add("contract-35", first.t, `${at}: ${side.closed} of ${side.n} sidebar cards closed at the first play tap (open at every level; L3-L4 dot the items instead: SH-110)`);
    // (s08 w6L, wave 6J) a #hint player pressed the bulb or peeked: the rows it paid to reveal are not the card at rest
    if (/#hint/.test(r.flow || "")) continue;
    if (level <= 2) {
      const dotted = open.filter((x) => /•/.test(x.text || ""));
      if (dotted.length) add("contract-35", first.t, `${at}: ${dotted.length} row${dotted.length > 1 ? "s" : ""} with dotted words ("${dotted.map((x) => x.text).slice(0, 3).join(" / ")}"): an open card writes every word at L1-L2`);
    } else {
      const shown = open.filter((x) => wordsOf(x.text).some((w) => items.has(w)));
      if (shown.length) add("contract-35", first.t, `${at}: an item written in ${shown.length} open row${shown.length > 1 ? "s" : ""} ("${shown.map((x) => x.text).slice(0, 3).join(" / ")}"): at L3-L4 the item words are dotted (frames, verbs and numbers written)`);
    }
  }
}
// 40 (S13-B1): one card markup (only the kit's classes on a card and its rows); SH-110: every blanked row starts with its speaker.
// 41: the request pop-up is the kit's (.njg-rq-card), never Cook's #intro. Each break is reported once per page (its first sample)
export function check40(tl, add) {
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "kitcard") continue;
    for (const b of e.bad || []) {
      if (seen.has(`b|${b}`)) continue;
      seen.add(`b|${b}`);
      add("contract-40", e.t, `a card's ${String(b).replace(/:/, " carries a game's own class:")} (one card everywhere: only the kit's classes)`);
    }
    for (const m of e.mute || []) {
      if (seen.has(`m|${m}`)) continue;
      seen.add(`m|${m}`);
      add("contract-40", e.t, `a blanked row ("${m}") with no speaker at its start (SH-110: never a memory test)`);
    }
  }
}
export function check41(tl, add) {
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "kitcard") continue;
    for (const p of [...(e.ownPop || []), ...(e.intro ? ["#intro"] : [])]) {
      if (seen.has(p)) continue;
      seen.add(p);
      add("contract-41", e.t, `a pop-up of the game's own (${p}) on screen: the order pop-up is the kit's .njg-rq-card`);
    }
  }
}
// 36 (SH-110): Nani calls each step as it opens (the order in pieces), at every level
const CALL_WITHIN = 6000;
function check36(r, tl, segs, v, add) {
  if (!isCookFlow(r.flow)) return;
  const life = tl.filter((e) => e.type === "c" && e.k === "life");
  const opens = life.filter((e) => e.what === "step-open");
  const notes = life.filter((e) => e.what === "step-call");
  const calls = v.lines.filter((l) => l.role === "call" && (l.text || "").trim());
  const seen = new Set();
  opens.forEach((o, i) => {
    const s = segAt(segs, o.t);
    if (!s || !isPlayStage(s.key)) return;
    // SH-133 (S13-B1): the same step logged open again with no other step opened in between (the help's hint rungs armed again
    // for it, js/shared/onboard.js Onboard.stuck, after a card row ticked) is that step still open, not a new opening: it was
    // judged at its first (its call, or the skip logged then)
    const prev = opens[i - 1];
    if (prev && prev.reason === o.reason && segAt(segs, prev.t) === s) return;
    const next = opens[i + 1];
    const until = Math.min(o.t + CALL_WITHIN, next ? next.t + 300 : Infinity, s.t1 == null ? Infinity : s.t1 + 300);
    // (step ids count again from 1 on each station's stepper: this opening's notes are the ones before that id opens again)
    const again = opens.slice(i + 1).find((x) => x.reason === o.reason);
    const mine = notes.filter((n) => n.reason === o.reason && n.t >= o.t - 50 && n.t <= Math.min(o.t + CALL_WITHIN, again ? again.t : Infinity));
    const skip = mine.find((n) => /^skip/.test(n.by || ""));
    // a call queued behind another line may start after the next step opened: any call from this opening on counts
    const said = calls.find((l) => l.t0 >= o.t - 50 && l.t0 <= Math.max(until, o.t + CALL_WITHIN));
    const k = `${s.key}|${o.reason}|${o.t}`;
    if (seen.has(k)) return;
    if (!said && !skip) { seen.add(k); add("contract-36", o.t, `${s.key}: step ${o.reason} (${o.by || ""}) opened and Nani did not call it (no line tagged call within ${CALL_WITHIN / 1000} s, no skip logged)`); }
  });
}
// 37 (CK-49): decoys by level, 1 / 2 / 3 / 3 + a lookalike, from the game's own report per station stage
export const DECOYS = { 1: 1, 2: 2, 3: 3, 4: 3 };
const DECOY_STATIONS = /^(fetch|pantry|chai-tray|chai|samosa|mishkaki-grill|mishkaki|daar|daal|assemble|chaat)$/;
const DECOY_AT_LEAST = /^(fetch|pantry|daar|daal)$/;
function check37(r, tl, segs, add) {
  if (!isCookFlow(r.flow)) return;
  const st = stationOf(r.flow);
  if (!st || !DECOY_STATIONS.test(st)) return;
  const level = levelOf(r.flow || "");
  const want = DECOYS[Math.min(4, level)];
  const notes = tl.filter((e) => e.type === "c" && e.k === "life" && e.what === "decoys");
  if (!notes.length) {
    const s = segs.find((x) => /(^|\|)cook:station/.test(x.key));
    if (s) add("contract-37", s.t0, `${s.key} (${st} at L${level}): no decoy count reported in the round (the table wants ${want}${level >= 4 ? " with a lookalike" : ""})`);
    return;
  }
  {
    const s = { key: "round" };
    const mine = notes;
    for (const n of mine) {
      const got = Number(n.reason);
      const look = /lookalike:1/.test(n.by || "");
      const what = (n.by || "").replace(/\s*lookalike:\d/, "");
      const ok = DECOY_AT_LEAST.test(st) ? got >= want : got === want;
      if (!ok) add("contract-37", n.t, `${s.key} (${st}${what ? `, ${what}` : ""} at L${level}): ${got} decoy${got === 1 ? "" : "s"}, the table wants ${DECOY_AT_LEAST.test(st) ? "at least " : ""}${want}`);
      if (level >= 4 && !look) add("contract-37", n.t, `${s.key} (${st}${what ? `, ${what}` : ""} at L4): no lookalike among the decoys (L4: 3 + a lookalike variant)`);
    }
  }
}
// 50 (SAM-24): samosa's card ticks once, at the one tick, for every strip; never a kind early
export const ONE_TICK_MS = 1500;
function check50(r, tl, segs, add) {
  if (!isCookFlow(r.flow) || stationOf(r.flow) !== "samosa") return;
  const fills = tl.filter((e) => e.type === "c" && e.k === "life" && e.what === "decoys" && /^fillings/.test(e.by || ""));
  // (the note comes as the station picks its fillings, a moment before the sampler sees its stage start: the station stage just after it)
  const stages = new Set(fills.map((e) => segs.find((x) => /station/.test(x.key) && x.t0 >= e.t - 50 && x.t0 <= e.t + 3000) || segAt(segs, e.t)).filter(Boolean));
  for (const s of stages) {
    let first = null; // the first tick since the rows were last all open (or one was reopened)
    let broke = false;
    let last = null;
    for (const e of tl) {
      if (e.type !== "c" || e.k !== "rows" || segAt(segs, e.t) !== s) continue;
      // (a "don't" row stays neutral until the dish is finished, by design: not judged; an older run without the flag: "... na")
      const list = (e.list || []).filter((x) => x.text && !x.no && !/\sna$/.test(x.text));
      if (!list.length) continue;
      const prev = new Map((last || []).map((x) => [x.id, x]));
      if (list.some((x) => prev.has(x.id) && prev.get(x.id).done && !x.done)) {
        first = null;
        broke = false;
      }
      last = list;
      const done = list.filter((x) => x.done);
      if (!done.length) {
        first = null;
        continue;
      }
      if (!first) first = { t: e.t, rows: done.map((x) => x.text) };
      const late = list.filter((x) => x.done && prev.has(x.id) && !prev.get(x.id).done);
      if (late.length && e.t - first.t > ONE_TICK_MS && !broke) {
        broke = true;
        add("contract-50", first.t, `${s.key}: "${first.rows.slice(0, 3).join(" / ")}" ticked ${((e.t - first.t) / 1000).toFixed(1)} s before "${late.map((x) => x.text).slice(0, 3).join(" / ")}" (more than ${ONE_TICK_MS / 1000} s): a samosa kind ticked before its samosas were all made (the card ticks at the one tick)`);
      }
    }
    // a row ticked, and others still open when the stage ended
    if (!broke && first && last && last.some((x) => !x.done) && s.t1 != null && s.t1 - first.t > ONE_TICK_MS) add("contract-50", first.t, `${s.key}: "${first.rows.slice(0, 3).join(" / ")}" ticked and ${last.filter((x) => !x.done).length} row(s) never did in this stage`);
  }
}
export function loadRetired(root) {
  const p = join(root, "build", "sandbox", "data", "retired-art.json");
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")).list : [];
}

// the run's timeline in time order; a lifecycle log entry at its own time (at), not when the probe read it
export function timeline(r) {
  return (r.timeline || []).map((e) => (e && e.type === "c" && e.k === "life" && e.at ? { ...e, t: e.at } : e)).sort((a, b) => a.t - b.t);
}

export function analyse(r, { root = ".", retired = loadRetired(root), clip = clipSeconds, lexicon = null, numbers = null } = {}) {
  const tl = timeline(r);
  const out = [];
  if (!tl.length) return out;
  const segs = segments(tl);
  const v = voice(tl, { root, clip });
  // the page's real end (its start plus its length): the probe samples only on a change, so a state that lasts to the end
  // (the end screen's word review) has no event after it; the timeline's last event is not the end (SH-86)
  const tEnd = Math.max(tl[tl.length - 1].t, r.t0 && r.ms ? r.t0 + r.ms : 0);
  // (the level table's checks, 35 and 36, name the stage's real level: realLevel)
  const add = (check, t, measured) => out.push({ check, item: CHECKS[check].item, flow: r.flow, level: /^contract-3[56]$/.test(check) ? realLevel(tl, t, levelOf(r.flow)) : levelOf(r.flow), size: r.size, ...stateAt(r, t), at: Math.round((t - (r.t0 || tl[0].t)) / 100) / 10, measured });
  check1(tl, segs, v, add);
  check2(tl, segs, add);
  check3(segs, v, add);
  check4(tl, segs, add);
  check5(tl, add);
  check6(tl, retired, root, add);
  check7(segs, v, add);
  check8(tl, segs, add, tEnd);
  check9(tl, segs, levelOf(r.flow || ""), add);
  check10(tl, segs, add);
  check11(tl, add);
  check12(tl, segs, add, tEnd);
  check13(tl, add);
  check34(tl, segs, add);
  check34kit(tl, segs, add);
  check42(tl, segs, add);
  check44(tl, segs, add, tEnd);
  check14(tl, segs, add);
  check15(tl, segs, add, tEnd);
  check17(r, tl, add);
  check20(tl, add);
  check18(tl, segs, add);
  check21(tl, segs, v, add);
  check22(r, tl, segs, v, numbers || numbersFor(root), add);
  check23(r, tl, segs, v, add);
  check24(r, tl, segs, v, add);
  check25(tl, segs, add);
  check26(tl, v, add, root, lexicon || lexiconFor(root));
  check16(tl, lexicon || lexiconFor(root), add, !!r.store);
  check19(r, tl, segs, v, numbers || numbersFor(root), add);
  check27(tl, add);
  check28(tl, add);
  check29(r, tl, segs, add);
  check30(r, tl, segs, v, numbers || numbersFor(root), add);
  check31(tl, v, add);
  check32(tl, add);
  check33(tl, add);
  check38(tl, add);
  check39(tl, add);
  check40(tl, add);
  check41(tl, add);
  check35(r, tl, segs, add, root);
  check36(r, tl, segs, v, add);
  check37(r, tl, segs, add);
  check45(tl, add);
  check46(tl, add);
  check47(r, tl, add);
  check48(r, tl, add);
  check50(r, tl, segs, add);
  check65(r, tl, add);
  check66(r, tl, v, add);
  check70(r, tl, add);
  check71(r, tl, add);
  check49(tl, add);
  return out;
}

// ---- S13-B2 (one shared kit, pair 3): the end screen is the kit's alone ----
// 49 (the brief's "41b"; the check ids are numbers): nothing inside .njg-results carries a game's own class (the hook's kitend sample: every class in it that is not the kit's);
// the clinic's receipt is the kit's receipt slot (js/shared/results.js Results.show({receipt})). Each class once per page
Object.assign(CHECKS, {
  "contract-49": { item: "one-end", title: "one end screen", how: "Every kitend sample (lib/contract-hook.mjs: each class on the end screen, .njg-results, and everything inside it that is not the kit's: rs-, njg-, the kit's face, word and button classes and their bare state words): a game's own class there (the clinic's cl-receipt, cl-face, Cook's own) is a break, each once per page (S13-B2: the receipt is a data slot of the shared end screen, Results.show({receipt}), drawn by results.js only)." },
});
export function check49(tl, add) {
  const seen = new Set();
  for (const e of tl) {
    if (e.type !== "c" || e.k !== "kitend") continue;
    for (const c of e.bad || []) {
      if (seen.has(c)) continue;
      seen.add(c);
      add("contract-49", e.t, `the end screen holds a game's own class: ${c} (one end screen everywhere: only the kit's classes)`);
    }
  }
}

// the voice log a reviewer reads: every line with its stage, its clips and their real start and end (seconds from the flow's start)
export function voiceLog(r, { root = "." } = {}) {
  const tl = timeline(r);
  const segs = segments(tl);
  const v = voice(tl, { root });
  const T = (t) => ((t - (r.t0 || (tl[0] && tl[0].t) || 0)) / 1000).toFixed(2);
  const rows = [];
  for (const s of segs) rows.push(`${T(s.t0)} ---- stage ${s.key}`);
  for (const l of v.lines) rows.push(`${T(l.t0)} line "${l.text}" [${segAt(segs, l.t0) ? segAt(segs, l.t0).key : "?"}]${l.plays.length ? "" : " (silent)"}${l.plays.map((p) => `\n${T(p.t0)}   clip ${p.url || p.via} ${p.dur.toFixed(2)} s, sounding to ${T(p.t1)}${p.why ? ` (${p.why})` : ""}`).join("")}`);
  return rows.sort((a, b) => parseFloat(a) - parseFloat(b));
}

// many results -> the contract report (markdown) and the list of breaks
export function report(results, opts = {}) {
  const all = [];
  for (const r of results) if (r.size !== "static") all.push(...analyse(r, opts));
  let md = `## Contract checks (decision 75): ${all.length} breaks over ${results.filter((r) => r.size !== "static").length} pages\n\n| check | breaks | how it measures |\n|---|---|---|\n`;
  for (const [k, c] of Object.entries(CHECKS)) md += `| ${k} ${c.title} | ${all.filter((f) => f.check === k).length} | ${c.how} |\n`;
  md += `\n| check | flow | level | size | state (shot) | at s | what |\n|---|---|---|---|---|---|---|\n`;
  for (const f of all) md += `| ${f.check} | ${f.flow} | L${f.level} | ${f.size} | ${f.state}${f.shot ? ` (${f.shot})` : ""} | ${f.at} | ${String(f.measured).replace(/\|/g, "/")} |\n`;
  return { breaks: all, md };
}

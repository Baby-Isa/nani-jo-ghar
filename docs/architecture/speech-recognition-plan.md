# Nani jo Ghar — Speech recognition plan

*Closed-set spoken-word recognition: at a speaking moment the game knows the 3–8 Kutchi words the child could mean, and must pick the one said, or say "didn't catch that". Companion to the Deep-dive brief (principle 3) and the Game Design's "Speaking, staged" table (stage two). 25 Sept 2026.*

## Recommendation in one paragraph

Ship **template matching on the device**: MFCC features compared by dynamic time warping against the family's own recordings of each word, plus takes **enrolled on the device** by the child or a parent at first use. It is 25 KB of plain JavaScript, nothing to download, about 150 ms on a phone, nothing leaves the device, and it exists now as `js/shared/speech.js` behind the fixed call `listen({choices, timeoutMs}) → {choice, confidence} | null`. On the only test set that exists (Zafar's six one-take clips through eleven distortions each) it names the right Kutchi phrase 33 times out of 33 with no wrong answers and rejects all 33 English clips; the cloud alternative (Whisper plus fuzzy matching) scores the same but gave one confident *wrong* answer and sends the child's voice to a server. The caveat: one adult take per phrase, distorted, is not a child. The first real number comes from the recording script below. If real children come in under about 85% on a five-word set after enrolment, the upgrade is a small pretrained speech-embedding model on the device, designed here but not testable in this environment.

## The problem, precisely

- **Closed set, 3–8 items.** The game never needs to know *what* was said, only *which*.
- **No Kutchi model exists** from any vendor. Anything that needs training data for the language is out.
- **The reference voices are adults**; the speakers are children of 5–11, whose pitch is roughly double and whose vocal tract is 15–25% shorter, so every formant sits higher.
- **In the browser on iPhones and iPads**, under iOS Safari's microphone rules.
- **Children's voices stay on the device** (Brief, principle 9). Nothing is uploaded without a parent's explicit consent, and the default is that nothing is uploaded at all.
- **Kind to a five-year-old.** A miss costs nothing; progress never waits on recognition.

## Candidates compared

| | (a) MFCC + DTW templates, pure JS | (b) Pretrained embedding model on device | (c) Cloud transcription + fuzzy match | (d) Hybrid: (a) first, (c) with consent |
|---|---|---|---|---|
| Accuracy, adults | Measured 100% on 3-way and 97% on 6-way here (see caveats) | Best in class: the few-shot keyword-spotting papers the Game Design cites get ~90–95% on unseen languages from 5 examples per word | Measured 93–96% here, with one confident wrong answer; hallucination on short clips is a known failure | As (a), rescued by (c) on nulls |
| Child voice vs adult templates | The weak point. Mitigated by vocal-tract warping (built in, worth ~20 points on pitch-shifted tests) and by enrolment | Trained on thousands of speakers including children; the most robust | Whisper handles children reasonably | As (a) |
| In-browser feasibility | 25 KB, no download, ~150 ms per query; iOS quirks handled in the module | 5–40 MB download (ONNX Runtime Web or transformers.js), 100–500 ms per query, WebGPU/WASM support varies on iOS | Needs network; 1–3 s round trip | Both |
| Privacy | Nothing leaves the device; audio is dropped once featured | Same | Child's voice uploaded to OpenAI | Uploads only after opt-in |
| Cost | Nil | Nil per use | ~$0.006 a minute, but an API key in a family app | Pennies |
| Build effort | Done (prototype); a week to integrate and tune | 2–3 weeks; **not testable here** (HuggingFace downloads are blocked) | Two days (prototype exists); the consent UI is the real work | Sum of both |

A fifth candidate, the phone's built-in recogniser (`webkitSpeechRecognition` in hi-IN or gu-IN, then fuzzy match), is rejected outright: it ships the audio to Apple or Google silently, offers no Kutchi, and is absent on iOS Safari for most languages.

**Chosen: (a) now, with enrolment; (b) designed as the upgrade; (c) not in the shipped child path.** In order: privacy (only (a) and (b) keep the Brief's rule without a consent flow), the size of the set (DTW is at its best on 3–8 items with a handful of templates each), and shipping (it works today, offline, with no model file). Why not (b) first: it is better on children's voices, but it cannot be tested from here, adds a download, and its advantage only matters if (a) fails on real children. Measure first. The cloud script stays in `build/speech/` as a measuring stick.

## How the prototype works

`js/shared/speech.js` is one file with no dependencies and two halves.

**Pure functions** (also run by the Node harness, so the numbers below are for this exact code): resample to 16 kHz; endpoint by energy (10 dB over the room's floor, gaps under 250 ms bridged, first-to-last run if under 3 s, else the longest); MFCC (25 ms frames every 10 ms, 24 mel bands, 12 cepstra plus deltas, per-utterance mean and variance normalisation so the room and microphone cancel); **vocal-tract warping**, every query featured with the mel axis at ×0.88, ×1.0 and ×1.12 and the best fit counting, the standard cheap defence against short vocal tracts; DTW with a 30% band, normalised by path length so a slow child and a quick aunt compare fairly; per choice the mean of the two nearest templates, then the **margin** `(d2 − d1) / d1` between best and runner-up. A choice is named only if `d1 ≤ 5.5` and margin ≥ 0.15; confidence is 0 at that margin and 1 at three times it, scaled down as `d1` nears the cut-off.

**Browser half:** `listen()` calls `getUserMedia` inside the tap, taps an AudioContext with an AudioWorklet (Blob URL) or a ScriptProcessorNode where that fails, endpoints live (starts after 120 ms of speech, stops after 600 ms of silence or `timeoutMs`), stops the mic track at once (iOS drops speaker volume while a mic is open), then classifies. `loadTemplates(choice, urls)` decodes the same MP3s the game plays. `enrol(choice)` keeps the last heard take as quantised features (about 4.6 KB) in localStorage; no audio is kept. `Speech.last` holds what the parent log needs.

**Cost on a phone:** about 150 ms for the three feature passes on an older iPad, plus 1–2 ms per template, so eight choices × five templates is under 100 ms more. The child hears a reaction well inside half a second.

## Test results

**What was tested.** Zafar's six one-take clips in `build/voice-test/` (three Kutchi phrases, three English), each put through `build/speech/augment.py`: clean, noise at 20 and 10 dB SNR, pitch and formants up 18% and 30% (rough child), tempo 0.85 and 1.25, echo, a 300–3400 Hz band-limit (tablet mic), pitch-up plus noise, and a late-start/early-cut edit. 66 queries. `build/speech/harness.js` runs the module on them; `build/speech/cloud_whisper.py` runs Whisper with the closed set as its prompt and the Game Design's generous spelling rules for the match. Full tables are in `build/speech/results/`.

**Kutchi 3-set (the realistic shape), one reference take per phrase, English clips as out-of-set:**

| said \ heard | chai | dudh | takiviyo | (none) |
|---|---|---|---|---|
| moke chai kape | 11 | · | · | · |
| moke doodh kape | · | 11 | · | · |
| abo takiviyo ai | · | · | 11 | · |
| English (33) | · | · | · | 33 |

33 of 33 named correctly, none wrong, none null; every English clip rejected. Margins on correct answers ran 0.2 to 3 (median about 1); on the English clips 0.00 to 0.07.

**6-way set (Kutchi and English together):** 64 of 66, no wrong answers; the two nulls were the +30% pitch variants of two English phrases, which lie outside the ±12% warp range. **Warps off:** 25 of 33 on the 3-set, so the warping is worth about 20 points on the pitch-shifted variants alone. **Leave-one-out** with every other variant as a template (a stand-in for enrolment): 33 of 33, and no faster to fail.

**Cloud Whisper + fuzzy match, same 3-set:** 31 of 33 right, **one wrong** (a +30% pitch "abo takiviyo ai" came back as the prompt's own "moke doodh kape": Whisper copying its prompt, a known failure on short clips), one null (it wrote the phrase in Perso-Arabic script, موکه چای کپه, which is right but which the matcher doesn't read). 6-way: 64 of 66, no wrong. Whisper's transcripts of the clean Kutchi were otherwise exactly the expected spellings, which is a genuine strength of the cloud route when the prompt carries the set.

**How little this proves.** Every query is a distortion of the *same take* as its template. The distances tell the real story: an unrelated utterance lands at `d1 ≈ 5.5` with margin near zero; the same take through noise or pitch lands at 1.4–5.3, the 10 dB noise variant already a hair under the cut-off. A *different* take by the same adult will land in between, a child's take higher still, and nobody knows where until it is recorded. So the thresholds are calibrated on the wrong distribution, the matrix says only "the pipeline is not broken and the margin test separates related from unrelated sound", and accuracy on children is *unknown*. The recording script below is the first real measurement.

## Enrolment: the fix for adult templates and child voices

Enrolment turns the template set from "Mum's voice" into "Mum's voice and this child's voice", the biggest accuracy lever available without a model.

- **When:** the first time a word is spoken at a speaking moment, and whenever a parent taps "that was right" after a null. Never a separate lesson: the shadowing stage ("say it after Nani") already exists, and an enrolment is a shadowing take the game keeps.
- **What is kept:** features only, per word, per profile, on this device; three takes, later ones replacing the oldest; a parent's "start again" clears them.
- **Who confirms:** a parent's tap, or a clear recognition against the family templates (margin ≥ 0.4). An unconfirmed take is never enrolled, or the child would teach the recogniser their mistakes.
- **A parent can enrol too**, thirty seconds at setup, in the child's room on the child's tablet.

## Confidence, "say it again", and kindness

| Outcome | Rule | What the child sees |
|---|---|---|
| Named, confidence ≥ 0.5 | Act on it | The character does it; the voice star fills |
| Named, confidence 0.2–0.5 | Act on it, and enrol the take if a family template agrees | Same |
| Null (first time) | One "say it again", with the character leaning in | Nani's "Hmm?" recording and a bigger microphone; pills fade in behind |
| Null (second) or timeout | Fallback | The pills are live; tapping one is a full success for the errand; the voice star stays open, not lost |
| Mic refused or absent | `listen()` returns null at once | Pills from the start; the microphone button is hidden for the session |

Nothing is ever marked wrong. Confidence is for the parent log and the enrolment rule, never shown to the child. A wrong recognition (dudh brought when chai was said) is handled like a wrong cup at the tray: a recast, and the child tries again or taps. The margin test exists so that a *wrong* answer is rarer than a null, and the test bears that out (0 wrong in 132 in-set queries; the cloud route managed one).

## Data plan: what the family should record

For recognition, quantity of takes matters more than quality of room, the opposite of the playback recordings.

| Who | Per speaking word | Why |
|---|---|---|
| Mum | 5 takes, spread across the session, not five in a row | The reference voice; five is what the few-shot literature uses |
| Zafar | 5 takes, in the room and on the device the children play on | The nearest adult to the children's conditions |
| Aunt or a cousin | 3 takes | A third voice widens the template cloud |
| Isa and a cousin (with a parent's consent, **kept in the family, never shipped**) | 5 takes each | The only way to measure what matters. The Brief bars children's voices from the shipped app; measuring at home is not shipping, but it is Zafar's decision (below) |

Words first: the chai tray's set, then Cook's other speaking moments, then each mode's first. About 25 words covers the first release; five takes by three adults is 375 utterances, about 20 minutes.

**The five-minute test script for Zafar's phone, today.** Voice memo, a quiet room, the phone on the table where a tablet would sit. Say "chai set". For each of **chai, dudh, khun, paani, elchi**: the word five times, two seconds between each, four before the next word. Say "distractors", then **char, dahi, jeeru, loon, aadu** twice each (the near-sounding words the out-of-set test needs). Then, if Isa is willing and it is a game to him, "Isa says" and the same five words as many times as he will give, Zafar saying the word before each take so the split is unambiguous. Process with `build/split_voice_notes.py memo.m4a out --no-transcribe`, rename the clips `<word>__<take>.mp3`, and run `node build/speech/harness.js --templates out --loo` for the same-speaker number and `--templates <adult clips> --queries <Isa clips>` for the one that matters.

**Questions for Mum.** Recommend, without editing the doc: "say the Kutchi twice" becomes "three times" for the ~25 speaking words, and the introduction gains a sentence saying these will also teach the game to recognise the children, so she says them as she would to a child asking for chai, not as a dictionary. Three from Mum plus five from Zafar is enough to start.

## Game integration

**The call.** `const heard = await Speech.listen({ choices: ["cook-chai", "cook-dudh", "cook-khun"], timeoutMs: 4000, onState })`. Before the scene opens the mode calls `Speech.loadTemplates(id, urls)` with the family MP3s from the audio manifest and checks `Speech.hasTemplates(choices)`; a word without a family recording has no speaking moment yet. `listen()` must run from the microphone button's tap handler (iOS), and no voice line plays while listening.

**The UI, one moment:** the character turns to the child and the gist caption sets it up ("Nana wants his chai. Tell the cook what to make"). A big round microphone button, the choices as faint pills beneath it. Tap: the button pulses (`onState: "listening"`), swells with the child's voice (`"speaking"`), the character cups an ear. On a result the character acts at once and says the word back from the family recording, so a recognised word is heard again in a proper voice. On a null, Nani's "Hmm?" and the pills brighten; on the second null or a timer, the pills are simply live. A small parent button ("they said it") in the sidebar counts as a success and an enrolment.

**Voice star rules (data, in `star_sets`):** earned when every speaking moment in the errand ended in a recognised word or a parent's confirmation; a pill tap leaves it unfilled but removes nothing else; nulls and retries don't count against it; modes with no speaking moment at that level don't show it. A shy child, or one in a library, still gets every other star.

**Logged for the parent (device only, no audio):** per moment, the choices, result, confidence, margin, whether a retry or fallback happened, whether the take was enrolled. The notebook shows it per word as "said it: 3 of 4 times this week", the evidence the Technical Plan's `produce_stage` needs.

**Cook's first speaking moments, in order of value:**

1. **Chai tray, ordering for Nana.** Nana holds out his cup; the child says what goes in. Set: {chai, dudh, khun, paani} at level 1; {nar khun / nar dudh, elchi, aadu} at level 2. Role reversal of the tray's ear test, so the words are already known. Build first.
2. **Pass me.** The child is the cook and Nani the helper: "loon" and she passes the salt. Set: the shelf's 4–6 items.
3. **Counting maani.** "bo" or "trae" and the helper plates that many. Set: {hikdo, bo, trae, char, panj}.
4. **Stir speed.** "aastethi" / "jaldi". A set of two, the easiest for the margin rule; a good first success for a five-year-old.

## Privacy and consent, stated plainly

- The shipped path is on-device only. Audio lives in memory for under a second and is never written; enrolments are features, not sound, and can't be turned back into a voice. No API key ships in the app.
- If a cloud fallback is ever wanted (candidate (d)), it needs a parent-only settings screen, a plain sentence saying whose servers and what is sent, off by default. Recommended answer for now: don't.
- Children's takes recorded for *measuring* the recogniser are family files on Zafar's laptop, not repo files, and never templates in the shipped app.

## Risks

1. **Real children may sit far from adult templates.** Mitigation: enrolment plus warping; backstop: candidate (b). Unknown until the script is recorded.
2. **Short, similar words** ("chai"/"char", "dudh"/"dahi"): avoid near-pairs in a closed set where the design allows, and put them in the out-of-set test.
3. **Noise.** A television at 10 dB SNR is already at the cut-off; keep speaking moments in calm scenes.
4. **iOS microphone friction.** Standalone PWAs may re-ask permission each launch; a refused mic must be a quiet fallback. The Capacitor wrap removes most of this.
5. **Endpointing and thresholds are guesses** tuned on the wrong data: expect to retune the silence rule, `accept` and `maxDistance` once on the family's takes, then leave them.

## Decisions for Zafar

| Decision | Default |
|---|---|
| Record Isa (and a cousin) saying five words for measurement, kept in the family and never shipped? | Yes, with their parents' say-so; it is the only real test |
| Enrol the child's takes on the device by default, or behind a parent toggle? | On by default; nothing leaves the device, and it is the accuracy lever |
| Any cloud path at all, even behind consent? | No for the first release; keep the script as a tool |
| Ask Mum for three takes of the speaking words instead of two? | Yes; recommend the wording change to the Questions doc |
| Budget for candidate (b) if children come in under 85%? | Decide after the first real number, not before |

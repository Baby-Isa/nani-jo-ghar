# Audio: recording, voices and sound

> **Stale points (what `docs/process/rules.md` now overrides; the text below is left as written).**
> - "There is no Kutchi speech recognition... from any vendor" and the staged speaking table → the speaking ramp is in rules E32 and `docs/game-design/speaking.md`; recognition work is in `docs/architecture/speech-recognition-plan.md`. Children's takes never ship and stay on the device (I15)
> - "Placeholder TTS in the nearest available voice" (Technical Plan audio pipeline) → TTS is test-only and never ships; only real family voices ship (G14, non-negotiable 10)
> - "Forty words takes about fifteen minutes" and "one take, each word twice" → recording practice now: Mum records long takes saying section IDs, split by silence; Zafar marks every clip OK/?? in `lab/family-audio.html`; only OK clips ship (G16)
> - Whole-sentence or hand-made fragments → the most frequent phrases are recorded whole, the rest assembled from recorded words by the language engine (G9, G12, non-negotiable 11)
> - "Reward chime on correct" is fine; "never a buzzer" is E10

Rules, by ID (the rulebook wins): **G14** every voice is a real family member, TTS test-only and replaced file for file; **G16** recording practice and OK/?? marking; **G17** the child's model reply is Zafar's (boy) or Mum's (girl) for now; **I15** consent, and children's voices never ship; **G12** record the most frequent phrases whole; **E10** no buzzes; **E5** never make the child wait for speech.

---

## Recording, multiple voices and sound design

> from: docs/archive/design-v1/Game Design.md § Audio and speaking (recording, multiple voices, speaking stages, the line to hold) and § Sound

## Audio and speaking

There is no Kutchi speech recognition and no Kutchi voice synthesis, from any vendor. Every sound in the game is a recording of a person.

**Recording.** One long take per session rather than one file per word. The speaker says each word twice with a pause, and the file is split automatically on the silences. Forty words takes about fifteen minutes with a cup of tea. The room matters more than the microphone: a soft room with the curtains shut beats a good microphone in a kitchen.

**Multiple voices are a feature.** The same word recorded by Zafar's mother, his aunt and a cousin, played at random, teaches that a word survives being said differently. It also makes the world feel populated.

**Speaking, staged.**

| Stage | What the player does | What the app does | Needs |
| --- | --- | --- | --- |
| 1 | Records themselves saying a word | Plays it back beside the family recording, side by side | Nothing. This is shadowing, and it works |
| 2 | Says one of a handful of known words | Decides which one they said | About five recordings of each word, from a few speakers |
| 3 | Speaks freely | Understands them | A corpus that does not yet exist |

Stage two is the one people assume is impossible, and it is not. It is not speech recognition, it is classification among a small known set: the player is looking at eight fruits and says one of them. Published work on few-shot keyword spotting builds a classifier for an unseen language from five examples per word, at usable accuracy. Your family can produce that training set in an afternoon.

Stage three is a long game. An app used by enough families, with consent, becomes the first real corpus of spoken Kutchi. Worth noting in the plan and building nothing towards yet.

**A line to hold.** Recordings a child makes in the app stay on the device and are never uploaded. The corpus, if it ever exists, comes from adults who chose to contribute their voice, and the two are never mixed.

**Sound** matters as much as picture. Market chatter under the bazaar, a kettle in the kitchen, gulls on the beach road. A warm chime for correct, never a buzzer for wrong.

---

## The audio pipeline (from the technical plan)

> from: docs/architecture/technical-plan.md § Pipelines (audio)

**Audio: recording to bundled files, staged and swappable**

1. **Placeholder today.** Until a real recording exists, a word falls back to text-to-speech reading the romanised spelling in the nearest available voice, Gujarati or Hindi. Clearly worse, clearly temporary, good enough to test the game before anyone has been recorded.
2. **Real voices, staged.** Record in one long take per session, each word or sentence said twice with a pause. A script finds the silences and splits the take into one file per item, named to match the content master.
3. **Multiple speakers stack, they don't replace.** Each new voice adds another Recording row for the same word. The app can pick one at random, or let a player choose whose voice they hear.
4. **Swapping needs no rebuild.** A Recording is just a file matched by name to the content master. Replacing the placeholder with a family voice, or adding a second one, is a file drop, not a code change.

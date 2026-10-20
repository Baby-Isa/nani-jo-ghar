# s09-book

Branch `worktree-agent-ac393bafc43718726` (not pushed: in-chat run). Round 3 on `c76d38c8`. Sandbox run `s09-book-r3-matrix`; evidence `s09-book-r3-red` (round-2 code) then `s09-book-r3-green2`. Game code: the evening book only.

## Flaws first (builder's list; the judge decides)
| # | flaw |
|---|---|
| 1 | Rule 11 leaves the book mostly silent grey English; in stick in the photo the grey sentence names the photo until Mum records it (Zafar, 20 Oct: keep it; the leak bot lists it as "still English") |
| 2 | The zoom's book-filling room shot is 2.6x the room picture (blurry for about a second); the room carries the sandbox's `cl-zooming` push-in marker while it is on screen, so contract-11 waits, as it does for the clinic. Request: a mode-neutral marker name |
| 3 | Her hands and dupatta differ between b1 and b2, so the 0.4 s cross-fade shows a short double image of the hands |
| 4 | Tomorrow's doorway is small (76 px); at 844x390 it touches the hearth's corner |
| 5 | Placeholder art: find-it backdrops; dog, bird, door, car |
| 6 | Name it: a tap chooses at once (no listen-first) |

## Round 3 (the judge's second FAILs, Zafar's agreed fixes)
| point | fix |
|---|---|
| BOOK-01 zoom | The camera zooms the room until its book lies exactly where the pages picture's book lies (both books measured: `lapBook`), then a 0.4 s cross-fade; out is the same in reverse. No box, no second Nani |
| BOOK-07 cards | Real gold cards (`--njg-focus` with a `--njg-gold` edge), pictures on cream discs |
| Tomorrow | A doorway at the end of the card row (arched frame, door swung back, a step, tomorrow's sky), whole and inside the screen |
| Word said twice | Said once, on the tap; the sentence waits for it |
| Kitchen boxes | Drawn as windows (frame, panes, sill) |
| Gold underline | Only the shared read-along colour while a line is said; the chosen word keeps the word colour, no underline |
| Face circle | Cook's guide face (`nani-face.webp`, cover, from the top), as in `css/shared/guide.css`; no shared crop data exists yet (SH-113) |

## Rule 11, line by line
| line | was | now |
|---|---|---|
| Where is the goat? / What's this? | engine | kept: whole sentence, real lexicon |
| There's the goat! | *Huda!* | grey English |
| Name it: Nana wanted chai / We saw a dog / We went by car | *Inke chai khape.* ("he wants chai"), *Ne poi kutro.*, *Pa gadi me aayo.* | the Kutchi word in the row, the sentence grey |
| Then we saw a big goat / Then we used the milk | *Ne poi wadhi bakri.* | grey English |
| Our day | *Pela darwajo. Ne poi gadi.* | grey: "In the morning we opened the door." ... |
| What did we do today? / Goodnight! / See you tomorrow! | grey / *saware* | grey English |

## Play it
`day.html?stage=book&log=farm` · `&log=kitchen` · `day.html?stage=book&game=find` · `&game=nameit` · `&game=photo` · `&game=ourday` (`&seed=7`: the same book).

## Proof
| row | red (`s09-book-r3-red`) | green (`s09-book-r3-green2`) |
|---|---|---|
| BOOK-01 | tool failure (stopped in the room) | three strips: in, out, the page turn |
| BOOK-04, 05, 07 | round-2 sheets | sheets |
| BOOK-03, 06 | | sheets |
| BOOK-02, 08 | | machine PASS |

- 8 sizes: 8/8 reach the end, 0 page errors, **0 contract breaks**, 0 layout findings. `checks.mjs` all ok (unit 480, load 29/29).
- Stills: `build/screenshots/s09-book/pages-view-1366x768.png`, `pages-view-844x390.png` (pages 330 and 327 px wide at 844x390).

## Requests
| who | what |
|---|---|
| Orchestrator | a mode-neutral push-in marker for contract-11 (the book borrows `cl-zooming`) |
| Mum (recording sheet) | the grey lines above |
| s09b art | find-it spreads; dog, bird, door, car sprites |

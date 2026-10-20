# s09-book

Branch `worktree-agent-ac393bafc43718726` (not pushed: in-chat run). Fix round on `dc365a3` + `6f5ab407` (the v2 art). Sandbox run `s09-book-fix-matrix`; evidence `s09-book-fix-red` (pre-fix code) then `s09-book-fix-green2`. Game code: the evening book only.

## Flaws first (builder's list; the judge decides)
| # | flaw |
|---|---|
| 1 | Rule 11 leaves the book mostly silent grey English: only "Where is the goat?" (*Bakri kida ai?*) and "What's this?" (*Hi kuro ai?*) are engine sentences. In stick in the photo the grey "Then we saw a big goat." names the photo until Mum records it: the leak bot lists it as "still English" (as `leak.mjs` does), not as a pass |
| 2 | The zoom in and out move the pages picture as a rectangle over the room: its edges show for about a second, fading |
| 3 | Placeholder art: the find-it backdrops and the dog, bird, door and car |
| 4 | Laptop "face" shot is head and shoulders (the room picture may not be magnified past 1.45x, ART-05) |
| 5 | No probe films a page turn: the driver now marks `drv:page-turn`; suggest a BOOK-01 probe `strip:.day-book:6x200` there |
| 6 | Name it: a tap chooses at once (no listen-first) |

## The judge's points
| point | fix |
|---|---|
| BOOK-01 zoom out | The pages shrink back into the book on her lap with the room all round (never black), eased, 2.4 s real time even at test speed |
| BOOK-01 page turn | The right page lifts from its corner and swings over the fold, 1 s real time; the whole 64 px corner takes the tap (the clipped corner missed taps: it froze one 800x360 run) |
| BOOK-01 bubble | Her lines in the shared speech bubble (`conversations.css`, speaker chip replays) beside her head |
| Tomorrow | Its own white card, bottom left, clear of the fire; word cards make room for it |
| BOOK-07 | A day-book flies from her lap onto b1 v2's empty shelf, gold-outlined |
| BOOK-06 | The finished layout stays: the driver turns 10.5 s after the slide-in starts |
| Zafar, 20 Oct | b2 v2 (the book held out to the child, her chin, dupatta and hands) and b1 v2 cut into `assets/day/book/`; pages measured inside its gold frames; v1 cuts deleted |

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
| row | red (pre-fix) | green (`s09-book-fix-green2`) |
|---|---|---|
| BOOK-01 | p1 tool failure; p2 the black cut | both strips (camera in; zoom out) |
| BOOK-03, 07 | old sheets | sheets |
| BOOK-06 | tool failure (page turned) | finished 3 + 2 layout |
| BOOK-02, 08 | | machine PASS |

- 8 sizes: 8/8 reach the end, 0 page errors, **0 contract breaks**, 0 layout findings. `checks.mjs` all ok (unit 478, load 29/29).
- Stills: `build/screenshots/s09-book/pages-view-1366x768.png`, `pages-view-844x390.png` (pages 330 and 327 px wide at 844x390).

## Requests
| who | what |
|---|---|
| Orchestrator | a BOOK-01 page-turn probe at `drv:page-turn` |
| Mum (recording sheet) | the grey lines above |
| s09b art | find-it spreads; dog, bird, door, car sprites |
